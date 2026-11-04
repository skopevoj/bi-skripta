import { useMemo, useState } from 'react'
import { CellRows, Field, Grid, KeyValue, Muted, NumberField, Panel, TextField, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { gcd, idx, letter, lettersAndSpaces, lettersOnly, md, modInv, plural, primeFactors, signed } from './lib/classical'

// Hillova šifra pro n = 2: c = |A·p|₂₆ po dvojicích písmen. Jedna otázka: jak matice zašifruje blok a kdy jde dešifrovat.

type Mat = readonly [number, number, number, number] // [a11, a12, a21, a22]
type State = { text: string; m: Mat }

const PRESETS: { label: string; values: Partial<State>; note?: string }[] = [
  { label: 'Z přednášky', values: { text: 'THE GOLD IS BURIED IN ORONO', m: [5, 17, 4, 15] } },
  { label: 'HELP → HIAT', values: { text: 'HELP', m: [3, 3, 2, 5] }, note: 'Učebnicový příklad: det A = 9, gcd(9, 26) = 1, HELP se zašifruje na HIAT.' },
  {
    label: 'Bez inverze',
    values: { text: 'HELP', m: [1, 2, 3, 4] },
    note: 'det A = −2 ≡ 24 (mod 26). Nad reálnými čísly by matice inverzi měla, modulo 26 ne — 24 a 26 jsou obě sudé.',
  },
]

const mul = (m: Mat, p: readonly [number, number]): [number, number] => [md(m[0] * p[0] + m[1] * p[1], 26), md(m[2] * p[0] + m[3] * p[1], 26)]
const pm = (rows: readonly (string | number)[][]) => `\\begin{pmatrix}${rows.map((r) => r.join(' & ')).join(' \\\\ ')}\\end{pmatrix}`
const neg = (n: number) => (n === 0 ? '0' : `-${n}`)

const CELLS = [
  { i: 0, label: 'A₁₁' },
  { i: 1, label: 'A₁₂' },
  { i: 2, label: 'A₂₁' },
  { i: 3, label: 'A₂₂' },
] as const

export function Hill({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ text: 'THE GOLD IS BURIED IN ORONO', m: [5, 17, 4, 15] }, PRESETS)
  const { text, m } = st.value
  const [picked, setPicked] = useState<number | null>(null)

  const letters = lettersOnly(text)
  const padded = letters.length % 2 === 1 ? letters + 'X' : letters
  const blocks = useMemo(() => {
    const out: { p: [number, number]; c: [number, number] }[] = []
    for (let i = 0; i + 1 < padded.length; i += 2) {
      const p: [number, number] = [idx(padded[i]!), idx(padded[i + 1]!)]
      out.push({ p, c: mul(m, p) })
    }
    return out
  }, [padded, m])

  const detRaw = m[0] * m[3] - m[1] * m[2]
  const det = md(detRaw, 26)
  const g = gcd(det, 26)
  const detInv = modInv(det, 26)
  const ok = g === 1 && detInv !== null
  const inv: Mat | null = ok ? [md(detInv * m[3], 26), md(-detInv * m[1], 26), md(-detInv * m[2], 26), md(detInv * m[0], 26)] : null

  // U singulární matice najdeme nenulový vektor v s A·v ≡ 0: bloky p a p + v pak mají stejný ŠT.
  const kernel = useMemo<[number, number] | null>(() => {
    if (ok) return null
    for (let x = 0; x < 26; x++)
      for (let y = 0; y < 26; y++) {
        if (x === 0 && y === 0) continue
        const [u, w] = mul(m, [x, y])
        if (u === 0 && w === 0) return [x, y]
      }
    return null
  }, [m, ok])

  const sel = Math.min(picked ?? 0, Math.max(0, blocks.length - 1))
  const blk = blocks[sel]
  const twin = blk && kernel ? ([md(blk.p[0] + kernel[0], 26), md(blk.p[1] + kernel[1], 26)] as const) : null
  const word = (v: readonly number[]) => v.map(letter).join('')

  const setCell = (i: number, v: number) => {
    const next = [...m] as [number, number, number, number]
    next[i] = v
    st.set({ m: next })
  }

  return (
    <Widget
      title={title ?? 'Hillova šifra (n = 2)'}
      lead={lead ?? 'Upravte klíčovou matici A a klikněte na blok OT; uvidíte násobení maticí i to, zda jde A invertovat modulo 26.'}
      {...st.widget}
      footer={
        <p>
          Každý blok se násobí stejnou maticí, takže stejná dvojice OT dá vždy stejnou dvojici ŠT, ale jednotlivá písmena se už nešifrují samostatně.
          Šifra je lineární: ze dvou známých dvojic (OT, ŠT) se klíč dopočítá jako A = |C·P⁻¹|₂₆.
        </p>
      }
    >
      <Grid min={220}>
        <TextField
          label="Otevřený text (OT)"
          value={text}
          onChange={(t) => st.set({ text: t })}
          normalize={lettersAndSpaces}
          hint={letters.length % 2 === 1 ? 'Lichý počet písmen — poslední blok je doplněn písmenem X.' : 'Jen písmena A–Z; mezery se ignorují.'}
        />
        <Field label="Klíčová matice A" hint="Prvky 0–25.">
          <Grid min={60} gap={2} style={{ gridTemplateColumns: 'repeat(2, max-content)' }}>
            {CELLS.map((c) => (
              <NumberField key={c.i} label={c.label} value={m[c.i]} min={0} max={25} noStepper chars={2} onChange={(v) => setCell(c.i, v)} />
            ))}
          </Grid>
        </Field>
      </Grid>

      <KeyValue
        cols={3}
        items={[
          { k: 'det A', v: `${m[0]}·${m[3]} − ${m[1]}·${m[2]} = ${signed(detRaw)}`, hint: detRaw === det ? undefined : `|${signed(detRaw)}|₂₆ = ${det}` },
          { k: 'gcd(det A, 26)', v: g, tone: ok ? 'ok' : 'bad', hint: ok ? 'nesoudělné → inverze existuje' : `sdílí dělitele ${primeFactors(g).join(' a ')}` },
          { k: '(det A)⁻¹ mod 26', v: detInv ?? 'neexistuje', tone: ok ? undefined : 'bad' },
        ]}
      />

      {ok && inv ? (
        <Tex display tex={`A^{-1} = \\left|(\\det A)^{-1}\\cdot ${pm([[m[3], neg(m[1])], [neg(m[2]), m[0]]])}\\right|_{26} = \\left|${detInv}\\cdot ${pm([[m[3], neg(m[1])], [neg(m[2]), m[0]]])}\\right|_{26} = ${pm([[inv[0], inv[1]], [inv[2], inv[3]]])}`} />
      ) : (
        <Verdict kind="bad" title="Matice A nemá inverzi modulo 26 — ŠT nejde dešifrovat">
          {det === 0 ? 'det A ≡ 0 (mod 26). ' : `det A ≡ ${det} je soudělné s 26 (gcd = ${g}), takže k němu neexistuje inverze. `}
          {blk && twin
            ? `Proto se různé bloky zobrazí na stejný ŠT: ${word(blk.p)} i ${word(twin)} se zašifrují na ${word(blk.c)}. `
            : ''}
          Upravte matici tak, aby det A nebyl dělitelný 2 ani 13.
        </Verdict>
      )}

      <Panel variant="soft" label="Šifrování po blocích" aside={blocks.length ? plural(blocks.length, 'blok', 'bloky', 'bloků') : undefined}>
        {blocks.length === 0 ? (
          <Muted>Napište otevřený text (aspoň 1 písmeno).</Muted>
        ) : (
          <>
            <CellRows
              ariaLabel="Bloky OT a ŠT"
              head={blocks.map((_, i) => i + 1)}
              rows={[
                { label: 'OT', cells: blocks.map((b) => word(b.p)) },
                { label: 'ŠT', cells: blocks.map((b, i) => ({ v: word(b.c), tone: i === sel ? ('active' as const) : undefined })) },
              ]}
              activeCol={sel}
              onColSelect={setPicked}
            />
            {blk && (
              <Tex
                display
                tex={`${pm([[m[0], m[1]], [m[2], m[3]]])}${pm([[blk.p[0]], [blk.p[1]]])} = ${pm([[`${m[0]}\\cdot ${blk.p[0]} + ${m[1]}\\cdot ${blk.p[1]}`], [`${m[2]}\\cdot ${blk.p[0]} + ${m[3]}\\cdot ${blk.p[1]}`]])} = ${pm([[m[0] * blk.p[0] + m[1] * blk.p[1]], [m[2] * blk.p[0] + m[3] * blk.p[1]]])} \\equiv ${pm([[blk.c[0]], [blk.c[1]]])} = \\text{${word(blk.c)}}`}
              />
            )}
          </>
        )}
      </Panel>
    </Widget>
  )
}
