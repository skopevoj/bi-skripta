import { useMemo } from 'react'
import { BitRow, Cells, Formula, Grid, Segmented, Stack, StepNote, StepperBar, TextField, Toggle, Verdict, Widget, usePresetState, useStepper } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { add32, chachaQR, hex8, popcount, rotl32, salsaQR, type QrStep, type QrWord } from './lib/symmetric'

// Quarter-round Salsa20 a ChaCha krok po kroku (ARX: ⊞, ⋘, ⊕).
// Otázka: jak QR promíchá čtyři slova — a proč ChaCha míchá víc (každé slovo mění 2×, Salsa 1×)?

type V = 'salsa' | 'chacha'
type State = { v: V; a: string; b: string; c: string; d: string; diff: boolean }

const SALSA_VEC = { a: 'd3917c5b', b: '55f1c407', c: '52a58a7a', d: '8f887a3b' }
const CHACHA_VEC = { a: '11111111', b: '01020304', c: '9b8d6f43', d: '01234567' }
const KNOWN: Record<string, string> = {
  ['salsa' + Object.values(SALSA_VEC).join('')]: '3e2f308c d90a8f36 6ab2a923 2883524c — testovací vektor ze specifikace Salsa20',
  ['chacha' + Object.values(CHACHA_VEC).join('')]: 'ea2a92f4 cb1cf8ce 4581472e 5881c4bb — testovací vektor RFC 8439, §2.1.1',
}

const PRESETS = [
  { label: 'Salsa20 (specifikace)', values: { v: 'salsa' as V, ...SALSA_VEC, diff: false } },
  { label: 'ChaCha (RFC 8439)', values: { v: 'chacha' as V, ...CHACHA_VEC, diff: false }, note: 'Vstup z RFC 8439, §2.1.1; výstup musí vyjít ea2a92f4 cb1cf8ce 4581472e 5881c4bb.' },
  {
    label: 'Jeden bit vstupu',
    values: { a: '00000001', b: '00000000', c: '00000000', d: '00000000', diff: true },
    note: 'Vstup s jediným jedničkovým bitem: přepínejte Salsa20 / ChaCha a porovnejte, kolik bitů se po jednom QR liší od nulového vstupu.',
  },
] as const

const W: QrWord[] = ['a', 'b', 'c', 'd']
const TEX: Record<V, string> = {
  salsa: 'b := b \\oplus ((a \\boxplus d) \\lll 7);\\ c := c \\oplus ((b \\boxplus a) \\lll 9);\\ d := d \\oplus ((c \\boxplus b) \\lll 13);\\ a := a \\oplus ((d \\boxplus c) \\lll 18)',
  chacha: 'a := a \\boxplus b;\\ d := (d \\oplus a) \\lll 16;\\ c := c \\boxplus d;\\ b := (b \\oplus c) \\lll 12;\\ \\text{totéž znovu s rotacemi } 8,\\ 7',
}
const hexOnly = (s: string) => s.toLowerCase().replace(/[^0-9a-f]/g, '').slice(0, 8)
const toBits = (ws: number[]) => ws.map((x) => (x >>> 0).toString(2).padStart(32, '0')).join('')

export function SalsaChaCha({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ v: 'salsa', ...SALSA_VEC, diff: false }, PRESETS)
  const { v, a, b, c, d, diff } = st.value
  const raw = [a, b, c, d]
  const errs = raw.map((x, i) => (x.length === 8 ? undefined : `Slovo ${W[i]} musí mít 8 hex znaků (32 bitů), teď má ${x.length}.`))
  const ok = errs.every((e) => !e)
  const input = useMemo(() => raw.map((x) => parseInt(x || '0', 16) >>> 0), [a, b, c, d]) // eslint-disable-line react-hooks/exhaustive-deps

  const qr = v === 'salsa' ? salsaQR : chachaQR
  const steps = useMemo(() => (ok ? qr(input) : []), [ok, qr, input])
  // porovnávací běh: překlopený nejnižší bit slova a
  const other = useMemo(() => (ok ? qr([input[0]! ^ 1, input[1]!, input[2]!, input[3]!]) : []), [ok, qr, input])

  const s = useStepper(5, { resetKey: `${v}|${raw.join()}` })
  const k = s.index
  const words = k === 0 ? input : steps[k - 1]?.words ?? input
  const otherWords = k === 0 ? [input[0]! ^ 1, input[1]!, input[2]!, input[3]!] : other[k - 1]?.words ?? input
  const step = k > 0 ? steps[k - 1] : undefined
  const prevWords = k <= 1 ? input : steps[k - 2]!.words

  // kolikrát už bylo každé slovo změněno (do aktuálního kroku)
  const times = W.map((w) => steps.slice(0, k).filter((x) => x.changed.includes(w)).length)
  const known = KNOWN[v + raw.join('')]

  return (
    <Widget
      title={title ?? 'Quarter-round Salsa20 a ChaCha'}
      lead={lead ?? 'Krokujte quarter-round a sledujte, které slovo se v kroku změní a z čeho; pak přepněte variantu.'}
      {...st.widget}
      onRandom={() => {
        const r = () => Math.floor(Math.random() * 2 ** 32).toString(16).padStart(8, '0')
        st.set({ a: r(), b: r(), c: r(), d: r() })
      }}
      footer={
        <p>
          QR používá jen sčítání mod 2³² (⊞), rotaci (⋘) a XOR (⊕) — rychlé v SW a bez tabulek, takže bez časových postranních kanálů. Salsa20
          mění každé slovo jednou, ChaCha dvakrát, a proto po jednom QR obvykle rozprostře změnu do víc bitů. Plná šifra opakuje QR na sloupce a řádky
          (Salsa20) nebo sloupce a diagonály (ChaCha) matice 4 × 4, celkem 20 rund.
        </p>
      }
    >
      <Segmented<V>
        label="Varianta"
        value={v}
        onChange={(x) => st.set({ v: x })}
        options={[
          { value: 'salsa', label: 'Salsa20' },
          { value: 'chacha', label: 'ChaCha' },
        ]}
      />
      <Tex tex={TEX[v]} display />

      <Grid min={130}>
        {W.map((w, i) => (
          <TextField key={w} label={`Slovo ${w}`} value={raw[i]!} onChange={(x) => st.set({ [w]: x } as Partial<State>)} normalize={hexOnly} maxLength={8} error={errs[i]} />
        ))}
      </Grid>

      {!ok ? (
        <Verdict kind="bad" title="Neplatné vstupní slovo">
          {errs.find(Boolean)}
        </Verdict>
      ) : (
        <>
          <StepperBar stepper={s} label={(i) => (i === 0 ? 'Vstup' : `Krok ${i} / 4`)} noPlay noScrubber />
          <StepNote title={k === 0 ? 'Vstup' : `Krok ${k}`}>{note(v, k, step)}</StepNote>

          <Cells
            size="lg"
            ariaLabel="Slova a, b, c, d"
            items={W.map((w, i) => ({
              sub: `${w} · ${times[i]}×`,
              v: hex8(words[i]!),
              tone: step?.changed.includes(w) ? 'active' : undefined,
              title: `${w} změněno ${times[i]}×`,
            }))}
          />

          {step && <StepFormulas v={v} step={step} prev={prevWords} />}

          <Toggle label="Porovnat s překlopeným bitem" hint="Druhý běh má ve slově a překlopený nejnižší bit." checked={diff} onChange={(x) => st.set({ diff: x })} />
          {diff && (
            <BitRow
              label="Rozdíl proti vstupu s překlopeným nejnižším bitem slova a"
              bits={toBits(otherWords)}
              compare={toBits(words)}
              group={32}
              showDiffCount
            />
          )}

          {s.atEnd && (
            <Verdict kind="ok" title={`Výstup: ${words.map(hex8).join(' ')}`}>
              {known
                ? `Shoduje se: ${known}.`
                : `${v === 'salsa' ? 'Salsa20 změnila každé slovo jednou' : 'ChaCha změnila každé slovo dvakrát'}; ${
                    diff ? `od běhu s překlopeným bitem se výstup liší v ${popcount(words[0]! ^ otherWords[0]!) + popcount(words[1]! ^ otherWords[1]!) + popcount(words[2]! ^ otherWords[2]!) + popcount(words[3]! ^ otherWords[3]!)} bitech ze 128.` : 'zapněte porovnání a uvidíte, kam se změna 1 bitu rozšířila.'
                  }`}
            </Verdict>
          )}
        </>
      )}
    </Widget>
  )
}

function note(v: V, k: number, step: QrStep | undefined) {
  if (k === 0 || !step) return v === 'salsa' ? 'Čtyři 32bitová slova; Salsa20 je změní postupně b, c, d, a — každé jednou.' : 'Čtyři 32bitová slova; ChaCha v každém kroku mění dvě slova, celkem každé dvakrát.'
  const p = step.parts
  if (v === 'salsa') {
    const x = p[0]!
    return `${x.target} se XORuje se součtem ${x.srcA} ⊞ ${x.srcB} orotovaným o ${x.rot} bitů — nová hodnota ${x.target} hned vstupuje do dalšího kroku.`
  }
  return `${p[0]!.target} := ${p[0]!.target} ⊞ ${p[0]!.srcB}, pak ${p[1]!.target} := (${p[1]!.target} ⊕ ${p[0]!.target}) ⋘ ${p[1]!.rot} — v jednom kroku se změní dvě slova.`
}

function StepFormulas({ v, step, prev }: { v: V; step: QrStep; prev: number[] }) {
  const idx = (w: QrWord) => W.indexOf(w)
  if (v === 'salsa') {
    const x = step.parts[0]!
    return (
      <Stack gap={2}>
        <Formula
          label={x.target}
          steps={[
            `${x.target} ⊕ ((${x.srcA} ⊞ ${x.srcB}) ⋘ ${x.rot})`,
            `${hex8(x.before)} ⊕ ((${hex8(prev[idx(x.srcA)]!)} ⊞ ${hex8(prev[idx(x.srcB)]!)}) ⋘ ${x.rot})`,
            `${hex8(x.before)} ⊕ (${hex8(x.sum!)} ⋘ ${x.rot})`,
            `${hex8(x.before)} ⊕ ${hex8(rotl32(x.sum!, x.rot))}`,
          ]}
          result={hex8(x.after)}
        />
        <BitRow label={`Bity slova ${x.target}: změněné proti předchozí hodnotě`} bits={toBits([x.after])} compare={toBits([x.before])} showDiffCount />
      </Stack>
    )
  }
  const [s, x] = step.parts as [QrStep['parts'][0], QrStep['parts'][0]]
  return (
    <Stack gap={2}>
      <Formula label={s.target} steps={[`${s.target} ⊞ ${s.srcB}`, `${hex8(s.before)} ⊞ ${hex8(prev[idx(s.srcB)]!)}`]} result={hex8(add32(s.before, prev[idx(s.srcB)]!))} />
      <Formula label={x.target} steps={[`(${x.target} ⊕ ${s.target}) ⋘ ${x.rot}`, `(${hex8(x.before)} ⊕ ${hex8(s.after)}) ⋘ ${x.rot}`, `${hex8(x.x!)} ⋘ ${x.rot}`]} result={hex8(x.after)} />
      <BitRow label={`Bity slova ${x.target}: změněné proti předchozí hodnotě`} bits={toBits([x.after])} compare={toBits([x.before])} showDiffCount />
    </Stack>
  )
}
