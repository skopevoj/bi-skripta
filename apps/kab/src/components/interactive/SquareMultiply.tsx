import { useMemo } from 'react'
import { Cells, Formula, Grid, NumberField, StepNote, StepperBar, TraceTable, Verdict, Widget, usePresetState, useStepper } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { leadNode, randInt, squareMultiplySteps, sub, sup, type SqmStep } from './lib/numtheory'

// Square & multiply zleva doprava: čteme bity exponentu od nejvyššího.
// Umocnění na druhou exponent zdvojí (připíše bit 0), násobení základem přičte 1 (bit 1).
// Po každém kroku tedy platí x = a^(dosud přečtené bity) mod m.

type State = { a: number; e: number; m: number }

const PRESETS = [
  { label: 'Z přednášky', values: { a: 1907, e: 29, m: 2633 } },
  {
    label: 'Dešifrování',
    values: { a: 2199, e: 2269, m: 2633 },
    note: 'Dešifrovací exponent d = 2269 z příkladu 2.1 vrátí blok 1907 — místo 2268 násobení stačí 17 operací.',
  },
  { label: '3²⁰⁰ mod 50', values: { a: 3, e: 200, m: 50 }, note: '200 = 11001000₂: osm bitů, takže 7 umocnění na druhou a jen 2 násobení.' },
  { label: 'D-H: 2⁷ mod 13', values: { a: 2, e: 7, m: 13 }, note: 'Alicina zpráva y₁ z příkladu 2.2: 7 = 111₂, samé jedničky — násobí se v každém kroku.' },
] as const

const bin = (x: bigint) => `${x.toString(2)}${sub(2)}`

export function SquareMultiply({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ a: 1907, e: 29, m: 2633 }, PRESETS)
  const { a, e, m } = st.value
  const steps = useMemo(() => squareMultiplySteps(BigInt(a), BigInt(e), BigInt(m)), [a, e, m])
  const s = useStepper(steps.length, { resetKey: `${a},${e},${m}` })
  const step = steps[s.index]!
  const aRed = a % m
  const bits = e.toString(2)
  const result = steps[steps.length - 1]!.after
  const squarings = bits.length - 1
  const mults = bits.split('').filter((c) => c === '1').length - 1

  const note = step.first ? (
    <>Nejvyšší bit exponentu je vždy 1: začneme x = a{aRed !== a ? ` mod m = ${aRed}` : ` = ${a}`}, tedy x = a¹.</>
  ) : step.bit === 0 ? (
    <>
      Bit 0: x jen umocníme na druhou. Exponent se zdvojí: {step.expSoFar / 2n} → {step.expSoFar.toString()}.
    </>
  ) : (
    <>
      Bit 1: x umocníme na druhou a vynásobíme a. Exponent se zdvojí a přičte se 1: {step.expSq / 2n} → 2 · {(step.expSq / 2n).toString()} + 1 ={' '}
      {step.expSoFar.toString()}.
    </>
  )

  return (
    <Widget
      title={title ?? 'Square & multiply'}
      lead={leadNode(lead, 'Krokuj bity exponentu zleva: každý bit znamená „umocni na druhou“, bit 1 navíc „vynásob základem a“.')}
      {...st.widget}
      onRandom={() => st.set({ a: randInt(2, 999), e: randInt(10, 999), m: randInt(50, 9999) })}
      footer={
        <p>
          Exponent se skládá bit po bitu: umocnění na druhou ho zdvojí, vynásobení a přičte 1. Proto stačí asi log₂ e kroků místo e − 1 násobení a
          mezivýsledky se po každém kroku berou mod m, takže čísla nikdy nepřerostou m².
        </p>
      }
    >
      <Grid min={150}>
        <NumberField
          label="Základ a"
          value={a}
          min={0}
          max={999999999}
          onChange={(v) => st.set({ a: v })}
          hint={a >= m ? `a ≥ m: počítá se se zbytkem a mod m = ${aRed}.` : undefined}
        />
        <NumberField label="Exponent e" value={e} min={1} max={999999999} onChange={(v) => st.set({ e: v })} />
        <NumberField label="Modul m" value={m} min={2} max={999999999} onChange={(v) => st.set({ m: v })} />
      </Grid>

      <Cells
        label={
          <>
            Exponent e = {e} = {bits}
            {sub(2)} (nad bitem: dosud přečtený exponent)
          </>
        }
        ariaLabel="Bity exponentu"
        size="lg"
        items={steps.map((r, i) => ({
          v: r.bit,
          sub: i <= s.index ? r.expSoFar.toString() : '\u00a0',
          tone: i === s.index ? 'active' : i > s.index ? 'dim' : undefined,
        }))}
        selected={s.index}
        onSelect={s.go}
      />

      <StepperBar stepper={s} label={(i) => `bit ${bits[i]}`} />

      <StepNote title={step.first ? 'Start' : step.bit ? 'Na druhou a krát a' : 'Na druhou'}>{note}</StepNote>

      {!step.first && (
        <Grid min={220} gap={3}>
          <Formula label="Na druhou" steps={[`${step.before}² mod ${m}`]} result={step.sq.toString()} />
          {step.bit === 1 && <Formula label="Krát a" steps={[`${step.sq} · ${aRed} mod ${m}`]} result={step.after.toString()} />}
        </Grid>
      )}
      <Formula label="Teď platí" steps={[<Tex key="x" tex={`x = ${aRed}^{${step.expSoFar}} \\bmod ${m}`} />]} result={step.after.toString()} />

      <TraceTable
        columns={[
          { key: 'bit', label: 'Bit', align: 'center' },
          { key: 'op', label: 'Operace', align: 'left', mono: false, render: (r: SqmStep) => (r.first ? 'start (x = a)' : r.bit ? 'na druhou, krát a' : 'na druhou') },
          { key: 'exp', label: 'Exponent dosud', render: (r: SqmStep) => `${bin(r.expSoFar)} = ${r.expSoFar}` },
          { key: 'x', label: 'x', render: (r: SqmStep) => r.after.toString() },
        ]}
        rows={steps}
        current={s.index}
        onRowClick={s.go}
      />

      {s.atEnd && (
        <Verdict kind="ok" title={`${a}${sup(e)} mod ${m} = ${result}`}>
          {bits.length} bitů exponentu: {squarings} umocnění na druhou + {mults} násobení = {squarings + mults} operací místo {e - 1} násobení naivně.
        </Verdict>
      )}
    </Widget>
  )
}
