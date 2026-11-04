import { useMemo } from 'react'
import { Formula, Grid, NumberField, StepNote, StepperBar, TraceTable, Verdict, Widget, usePresetState, useStepper } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { euclidRows, leadNode, randInt, type EuclidRow } from './lib/numtheory'

// Eukleidův algoritmus: gcd(a, b) = gcd(b, a mod b), dokud zbytek není 0.
// Řetěz rovností gcd(…) = gcd(…) = … roste s každým krokem — to je celá věta 0.2.

type State = { a: number; b: number }

const PRESETS = [
  { label: 'Z přednášky', values: { a: 252, b: 105 } },
  { label: 'gcd(240, 46)', values: { a: 240, b: 46 }, note: 'Pět dělení, výsledek 2: obě čísla jsou sudá, ale nic většího je nedělí.' },
  {
    label: 'Nesoudělná',
    values: { a: 26, b: 17 },
    note: 'gcd(26, 17) = 1 — 17 má proto inverzi modulo 26 (spočítá ji rozšířený Euklidův algoritmus v sekci 0.3).',
  },
  {
    label: 'Fibonacci',
    values: { a: 89, b: 55 },
    note: 'Sousední Fibonacciho čísla jsou nejhorší případ: podíl q je pokaždé 1, takže zbytky klesají nejpomaleji.',
  },
] as const

const gcdChain = (rows: EuclidRow[], upto: number) => {
  const out = [`gcd(${rows[0]!.a}, ${rows[0]!.b})`]
  for (let i = 0; i <= upto; i++) out.push(`gcd(${rows[i]!.b}, ${rows[i]!.r})`)
  return out
}

export function GcdEuclid({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ a: 252, b: 105 }, PRESETS)
  const { a, b } = st.value
  const rows = useMemo(() => euclidRows(a, b), [a, b])
  const s = useStepper(rows.length, { resetKey: `${a},${b}` })
  const row = rows[s.index]!
  const g = rows[rows.length - 1]!.b
  const done = row.r === 0

  return (
    <Widget
      title={title ?? 'Euklidův algoritmus'}
      lead={leadNode(lead, 'Zadej dvě čísla a krokuj: dvojice (a, b) se pokaždé nahradí dvojicí (b, a mod b), dokud zbytek není 0.')}
      {...st.widget}
      onRandom={() => st.set({ a: randInt(50, 999), b: randInt(10, 400) })}
      footer={
        <p>
          gcd se při nahrazení (a, b) → (b, a mod b) nemění, protože každý společný dělitel a a b dělí i zbytek a − q·b. Zbytky ostře klesají, takže
          algoritmus skončí — a gcd(x, 0) = x. Počet kroků roste jen logaritmicky.
        </p>
      }
    >
      <Grid min={160}>
        <NumberField label="a" value={a} min={1} max={999999} onChange={(v) => st.set({ a: v })} />
        <NumberField
          label="b"
          value={b}
          min={1}
          max={999999}
          onChange={(v) => st.set({ b: v })}
          hint={b > a ? 'b > a: první krok čísla jen prohodí (q = 0).' : undefined}
        />
      </Grid>

      <StepperBar stepper={s} noPlay={rows.length <= 2} />

      <StepNote title={done ? 'Hotovo' : `Krok ${s.index + 1}`} kind={done ? 'ok' : undefined}>
        {done ? (
          <>
            {row.a} = {row.q} · {row.b} + 0 — zbytek je 0, takže algoritmus končí a poslední nenulový zbytek {row.b} je gcd.
          </>
        ) : (
          <>
            {row.a} = {row.q} · {row.b} + {row.r}; zbytek {row.r} ≠ 0, takže gcd({row.a}, {row.b}) = gcd({row.b}, {row.r}) a pokračujeme.
          </>
        )}
      </StepNote>

      <Formula label="Řetěz" steps={gcdChain(rows, s.index)} result={done ? g : undefined} />

      <TraceTable
        columns={[
          { key: 'i', label: 'Krok', align: 'left' },
          { key: 'a', label: 'a' },
          { key: 'b', label: 'b' },
          { key: 'q', label: 'q = ⌊a / b⌋' },
          { key: 'r', label: 'r = a mod b' },
          { key: 'eq', label: 'a = q · b + r', align: 'left', render: (r: EuclidRow) => `${r.a} = ${r.q} · ${r.b} + ${r.r}` },
        ]}
        rows={rows}
        current={s.index}
        onRowClick={s.go}
        rowTone={(r, i) => (r.r === 0 && i <= s.index ? 'ok' : undefined)}
      />

      {done && (
        <Verdict kind="ok" title={`gcd(${a}, ${b}) = ${g}`}>
          {g === 1
            ? 'Čísla jsou nesoudělná — nemají společného dělitele kromě 1.'
            : `Obě čísla jsou násobky ${g}: ${a} = ${a / g} · ${g} a ${b} = ${b / g} · ${g}.`}
        </Verdict>
      )}
    </Widget>
  )
}
