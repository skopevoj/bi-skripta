import { useMemo } from 'react'
import {
  ByteGrid,
  Cells,
  Formula,
  KeyValue,
  StepNote,
  StepperBar,
  TextField,
  TraceTable,
  Verdict,
  Widget,
  usePresetState,
  useStepper,
  type Tone,
} from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { SHA1_IV, add32, hex8, mdPad, rotl32, sha1Block, utf8, wordsOf, type Sha1Round } from './lib/symmetric'

// SHA-1 jednoho bloku: zarovnání na 512 b → 80 rund kompresní funkce → přičtení kontextu.
// Otázka: jak jedna runda promíchá kontext A, B, C, D, E se slovem zprávy W_t?

type State = { msg: string }
const MAX = 55 // bajtů, aby se zpráva vešla do jednoho bloku

const PRESETS = [
  { label: 'abc', values: { msg: 'abc' } },
  { label: 'Prázdná zpráva', values: { msg: '' }, note: 'I prázdná zpráva má blok: bit 1, 447 nul a délka 0. SHA-1("") = da39a3ee…' },
  {
    label: 'Plný blok',
    values: { msg: 'Do jednoho bloku SHA-1 se vejde nejvys 55 bajtu zpravy!' },
    note: '55 B zprávy + bajt 0x80 + 8 B délky = 64 B. O bajt delší zpráva by potřebovala druhý blok.',
  },
] as const

const SUBS = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => String(n).replace(/\d/g, (d) => SUBS[Number(d)]!)
const REG = ['A', 'B', 'C', 'D', 'E'] as const
const fName = (t: number) => (t < 20 ? 'Ch' : t < 40 || t >= 60 ? 'Parita' : 'Maj')
const fTex = (t: number) => (t < 20 ? '(B ∧ C) ∨ (¬B ∧ D)' : t < 40 || t >= 60 ? 'B ⊕ C ⊕ D' : '(B ∧ C) ∨ (B ∧ D) ∨ (C ∧ D)')
const KNOWN: Record<string, string> = { abc: 'a9993e364706816aba3e25717850c26c9cd0d89d', '': 'da39a3ee5e6b4b0d3255bfef95601890afd80709' }

export function Sha1({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ msg: 'abc' }, PRESETS)
  const { msg } = st.value
  const bytes = utf8(msg)
  const err = bytes.length > MAX ? `Zpráva má ${bytes.length} bajtů; widget ukazuje jeden blok, takže nejvýš ${MAX} bajtů (zbytek bloku zabere bit 1 a 64bitová délka).` : undefined

  const data = useMemo(() => {
    if (err) return null
    const block = mdPad(bytes)
    const r = sha1Block(wordsOf(block), SHA1_IV)
    return { block, ...r }
  }, [msg]) // eslint-disable-line react-hooks/exhaustive-deps

  const s = useStepper(82, { resetKey: msg })
  const i = s.index

  return (
    <Widget
      title={title ?? 'SHA-1 krok za krokem'}
      lead={lead ?? 'Napište zprávu, podívejte se na její zarovnání na 512bitový blok a krokujte 80 rund kompresní funkce.'}
      {...st.widget}
      footer={
        <p>
          V každé rundě vznikne jen jedno nové slovo (A); ostatní se posunou o místo dál, C navíc rotací o 30 bitů. Za 80 rund tak každé slovo
          zprávy W<sub>t</sub> ovlivní celý kontext. Nakonec se výsledek přičte k počátečnímu kontextu (Davies–Meyer), aby funkce nešla obrátit.
        </p>
      }
    >
      <TextField label="Zpráva M" value={msg} onChange={(v) => st.set({ msg: v })} mono error={err} hint={err ? undefined : `${bytes.length} B = ${bytes.length * 8} bitů; text se kóduje v UTF-8.`} />

      {!data ? (
        <Verdict kind="bad" title="Zpráva se nevejde do jednoho bloku">
          Zkraťte ji aspoň o {bytes.length - MAX} B — delší zpráva by se zpracovala ve dvou blocích (druhý by začínal s kontextem z prvního).
        </Verdict>
      ) : (
        <>
          <StepperBar stepper={s} label={(k) => (k === 0 ? 'Zarovnání' : k === 81 ? 'Výsledek' : `Runda t = ${k - 1} · ${fName(k - 1)}`)} speeds={[1, 2, 4]} />
          {i === 0 ? (
            <Padding block={data.block} len={bytes.length} />
          ) : i === 81 ? (
            <Final out={data.out} last={data.rounds[79]!.after} msg={msg} />
          ) : (
            <RoundView rounds={data.rounds} w={data.w} t={i - 1} go={(t) => s.go(t + 1)} />
          )}
        </>
      )}
    </Widget>
  )
}

function Padding({ block, len }: { block: number[]; len: number }) {
  const tone = (j: number): Tone | undefined => (j < len ? undefined : j === len ? 'changed' : j >= 56 ? 'active' : 'dim')
  return (
    <>
      <StepNote title="Zarovnání (Damgård–Merklovo zesílení)">
        Za zprávu se připojí bit 1 (bajt 80), pak nuly a nakonec 64bitová délka zprávy, aby blok měl přesně 512 bitů.
      </StepNote>
      <ByteGrid bytes={block} cols={8} size="sm" label="Blok 512 b = 64 bajtů = slova W₀ … W₁₅ (po 4 bajtech)" tone={tone} />
      <KeyValue
        cols={3}
        items={[
          { k: 'Zpráva', v: `${len} B`, hint: 'bez zvýraznění' },
          { k: 'Bit 1 a nuly', v: `1 + ${(56 - len) * 8 - 1} bitů`, hint: 'bajt 80 žlutě, nuly šedě', tone: 'changed' },
          { k: 'Délka zprávy', v: `${len * 8} = 0x${(len * 8).toString(16)}`, hint: 'posledních 8 B', tone: 'active' },
        ]}
      />
    </>
  )
}

function RoundView({ rounds, w, t, go }: { rounds: Sha1Round[]; w: number[]; t: number; go: (t: number) => void }) {
  const r = rounds[t]!
  const [a, b, c, d, e] = r.before as [number, number, number, number, number]
  const from = Math.max(0, t - 4)
  const rows = rounds.slice(from, t + 1)
  return (
    <>
      <StepNote title={`Runda t = ${t} · F = ${fName(t)}, K = ${hex8(r.k)}`}>
        Nové A vznikne sečtením (mod 2³²) pěti hodnot; B, D, E jen převezmou předchozí A, C, D a C = B ⋘ 30.
      </StepNote>
      <Cells
        size="md"
        ariaLabel="Kontext po rundě"
        items={r.after.map((v, j) => ({ sub: REG[j], v: hex8(v), tone: j === 0 ? 'active' : j === 2 ? 'changed' : undefined }))}
      />
      {t >= 16 && (
        <Formula
          label={`W${sub(t)}`}
          steps={[`(W${sub(t - 16)} ⊕ W${sub(t - 14)} ⊕ W${sub(t - 8)} ⊕ W${sub(t - 3)}) ⋘ 1`, `(${hex8(w[t - 16]!)} ⊕ ${hex8(w[t - 14]!)} ⊕ ${hex8(w[t - 8]!)} ⊕ ${hex8(w[t - 3]!)}) ⋘ 1`]}
          result={hex8(w[t]!)}
        />
      )}
      <Formula label="F" steps={[fTex(t), `F(${hex8(b)}, ${hex8(c)}, ${hex8(d)})`]} result={hex8(r.f)} />
      <Formula
        label="A"
        steps={['(A ⋘ 5) ⊞ F ⊞ E ⊞ Wₜ ⊞ Kₜ', `${hex8(rotl32(a, 5))} ⊞ ${hex8(r.f)} ⊞ ${hex8(e)} ⊞ ${hex8(r.w)} ⊞ ${hex8(r.k)}`]}
        result={hex8(add32(rotl32(a, 5), r.f, e, r.w, r.k))}
      />
      <TraceTable
        caption={from > 0 ? `Posledních ${rows.length} rund (klikněte pro skok)` : 'Průběh rund (klikněte pro skok)'}
        columns={[
          { key: 't', label: 't', align: 'left', render: (x) => x.t },
          { key: 'w', label: 'Wₜ', render: (x) => hex8(x.w) },
          ...REG.map((n, j) => ({ key: n, label: n, render: (x: Sha1Round) => hex8(x.after[j]!) })),
        ]}
        rows={rows}
        current={rows.length - 1}
        onRowClick={(k) => go(from + k)}
      />
    </>
  )
}

function Final({ out, last, msg }: { out: number[]; last: number[]; msg: string }) {
  const hex = out.map(hex8).join('')
  const known = KNOWN[msg]
  return (
    <>
      <StepNote title="Přičtení kontextu">Po 80 rundách se A … E přičtou (mod 2³²) k počátečnímu kontextu H₀ … H₄; výsledkem je 160bitový haš.</StepNote>
      <KeyValue
        cols={1}
        items={out.map((v, j) => ({ k: `H${sub(j)}`, v: `${hex8(SHA1_IV[j]!)} ⊞ ${hex8(last[j]!)} = ${hex8(v)}` }))}
      />
      <Verdict kind="ok" title={`SHA-1 = ${out.map(hex8).join(' ')}`}>
        {known === hex ? 'Shoduje se s testovacím vektorem FIPS 180.' : 'Haš je zřetězení H₀ … H₄, tedy 5 × 32 = 160 bitů.'}
      </Verdict>
    </>
  )
}
