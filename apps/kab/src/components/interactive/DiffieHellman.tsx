import { Formula, Grid, KeyValue, NumberField, Panel, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { isPrime, leadNode, modPow, nextPrime, orderModPrime, powersOf, prevPrime, randInt, sub } from './lib/numtheory'

// Diffie–Hellman: Alice a Bob si pošlou jen y₁ = |a^kA|_m a y₂ = |a^kB|_m,
// a přesto oba spočítají stejné K = |a^(kA·kB)|_m — mocniny se dají přehodit.

type State = { m: number; a: number; kA: number; kB: number }

const PRESETS = [
  { label: 'Z přednášky', values: { m: 13, a: 2, kA: 7, kB: 11 } },
  {
    label: 'a není generátor',
    values: { m: 13, a: 3, kA: 7, kB: 11 },
    note: '3 má v ℤ₁₃* řád jen 3: y₁, y₂ i K můžou být jen 1, 3 nebo 9, takže Eva klíč uhodne nejvýš na tři pokusy.',
  },
  {
    label: 'Silné prvočíslo 23',
    values: { m: 23, a: 5, kA: 6, kB: 15 },
    note: '23 = 2 · 11 + 1 je silné prvočíslo, jak doporučuje text výše, a 5 je generátor ℤ₂₃*.',
  },
] as const

const kA_ = <sub>A</sub>
const kB_ = <sub>B</sub>

const bar = (x: string | number, mod: string | number) => `\\lvert ${x} \\rvert_{${mod}}`

export function DiffieHellman({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ m: 13, a: 2, kA: 7, kB: 11 }, PRESETS)
  const { m, a, kA, kB } = st.value

  const mErr = isPrime(m) ? undefined : `m = ${m} není prvočíslo — nejbližší jsou ${prevPrime(m) ?? 2} a ${nextPrime(m)}.`
  const aErr = !mErr && a > m - 1 ? `a musí být od 2 do m − 1 = ${m - 1}.` : undefined
  const kErr = (k: number) => (!mErr && k > m - 2 ? `Tajný klíč volíme od 1 do m − 2 = ${m - 2}.` : undefined)
  const kAErr = kErr(kA)
  const kBErr = kErr(kB)
  const err = mErr ?? aErr ?? kAErr ?? kBErr
  const ok = !err

  const ord = ok ? orderModPrime(a, m) : m - 1
  const aHint =
    ok && ord < m - 1
      ? `Pozor: a není generátor — má řád ${ord}, takže K může nabýt jen ${ord <= 12 ? `hodnot {${powersOf(a, m).sort((x, y) => x - y).join(', ')}}` : `${ord} různých hodnot`}.`
      : ok
        ? `a je generátor ℤ${sub(m)}*: jeho mocniny dají všech ${m - 1} nenulových zbytků.`
        : undefined

  const y1 = ok ? modPow(a, kA, m) : 0n
  const y2 = ok ? modPow(a, kB, m) : 0n
  const KA = ok ? modPow(y2, kA, m) : 0n
  const KB = ok ? modPow(y1, kB, m) : 0n
  const kAB = BigInt(kA) * BigInt(kB)
  const K = ok ? modPow(a, kAB, m) : 0n

  return (
    <Widget
      title={title ?? 'Diffie–Hellman'}
      lead={leadNode(lead, 'Změň tajné klíče Alice a Boba a sleduj, že oba pokaždé dojdou ke stejnému K, ačkoli si poslali jen y₁ a y₂.')}
      {...st.widget}
      onRandom={() => st.set({ kA: randInt(2, m - 2), kB: randInt(2, m - 2) })}
      footer={
        <p>
          Alice umocní Bobovo y₂ = a<sup>{kB_}</sup> na k<sub>A</sub>, Bob Alicino y₁ = a<sup>{kA_}</sup> na k<sub>B</sub> — obojí je a<sup>{kA_}{kB_}</sup>.
          Eva vidí m, a, y₁, y₂, ale na K by potřebovala k<sub>A</sub> nebo k<sub>B</sub>, tedy vyřešit diskrétní logaritmus.
        </p>
      }
    >
      <Grid min={150}>
        <NumberField label="Prvočíslo m" value={m} min={5} max={999999} onChange={(v) => st.set({ m: v })} error={mErr} hint="Veřejné." />
        <NumberField label="Generátor a" value={a} min={2} max={999999} onChange={(v) => st.set({ a: v })} error={aErr} hint={aHint} />
        <NumberField label={<>Alice: tajné k{kA_}</>} value={kA} min={1} max={999999} onChange={(v) => st.set({ kA: v })} error={kAErr} />
        <NumberField label={<>Bob: tajné k{kB_}</>} value={kB} min={1} max={999999} onChange={(v) => st.set({ kB: v })} error={kBErr} />
      </Grid>

      {!ok ? (
        <Verdict kind="bad" title="Parametry nejsou v pořádku">
          {err}
        </Verdict>
      ) : (
        <>
          <Grid min={250} gap={3}>
            <Panel label="Alice" aside={<>zná k{kA_} = {kA}</>}>
              <Formula
                label="1. pošle"
                steps={[<Tex key="a" tex={`y_1 = ${bar('a^{k_A}', 'm')}`} />, <Tex key="b" tex={bar(`${a}^{${kA}}`, m)} />]}
                result={y1.toString()}
              />
              <Formula
                label="2. spočítá"
                steps={[<Tex key="a" tex={`K = ${bar('y_2^{k_A}', 'm')}`} />, <Tex key="b" tex={bar(`${y2}^{${kA}}`, m)} />]}
                result={KA.toString()}
              />
            </Panel>
            <Panel label="Bob" aside={<>zná k{kB_} = {kB}</>}>
              <Formula
                label="1. pošle"
                steps={[<Tex key="a" tex={`y_2 = ${bar('a^{k_B}', 'm')}`} />, <Tex key="b" tex={bar(`${a}^{${kB}}`, m)} />]}
                result={y2.toString()}
              />
              <Formula
                label="2. spočítá"
                steps={[<Tex key="a" tex={`K = ${bar('y_1^{k_B}', 'm')}`} />, <Tex key="b" tex={bar(`${y1}^{${kB}}`, m)} />]}
                result={KB.toString()}
              />
            </Panel>
          </Grid>

          <Verdict kind={KA === KB ? 'ok' : 'bad'} title={`Společný klíč K = ${K}`}>
            Oba vlastně spočítali <Tex tex={`${bar(`a^{k_A k_B}`, 'm')} = ${bar(`${a}^{${kAB}}`, m)} = ${K}`} />, protože (a<sup>k{kB_}</sup>)<sup>k{kA_}</sup> = (a<sup>k{kA_}</sup>)
            <sup>k{kB_}</sup>.
          </Verdict>

          <Panel label="Odposlech: co vidí Eva" variant="plain">
            <KeyValue
              cols={4}
              items={[
                { k: 'm, a', v: `${m}, ${a}` },
                { k: 'y₁ (od Alice)', v: y1.toString() },
                { k: 'y₂ (od Boba)', v: y2.toString() },
                { k: 'K', v: '?', hint: <>musela by vyřešit <Tex tex={`${a}^k \\equiv ${y1} \\pmod{${m}}`} /> (diskrétní logaritmus)</> },
              ]}
            />
          </Panel>
        </>
      )}
    </Widget>
  )
}
