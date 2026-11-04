import { useMemo } from 'react'
import { Cells, Formula, Muted, NumberField, Row, StepNote, StepperBar, Tag, Verdict, Widget, usePresetState, useStepper, type Cell } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { factorTex, factorize, factorText, leadNode, phi, randInt, sub } from './lib/numtheory'

// Eulerova funkce jako síto: z čísel 1 … n postupně škrtáme násobky prvočísel z rozkladu n.
// Každé prvočíslo p odebere přesně 1/p ze zbývajících — odtud φ(n) = n · ∏ (1 − 1/p).

type State = { n: number }

const GRID_MAX = 400

const PRESETS = [
  { label: 'Z přednášky', values: { n: 12 } },
  { label: 'φ(15) = φ(3 · 5)', values: { n: 15 }, note: 'Součin dvou prvočísel jako v RSA: φ(pq) = (p − 1)(q − 1) = 2 · 4 = 8.' },
  { label: 'Prvočíslo', values: { n: 13 }, note: 'U prvočísla p se škrtá jen p samo, takže φ(p) = p − 1.' },
  { label: 'Selftest 3575', values: { n: 3575 }, note: 'Cvičení 2.1: 3575 = 5² · 11 · 13. Mocnina 5² na výsledek nemá vliv — škrtají se jen násobky 5.' },
] as const

export function EulerTotient({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ n: 12 }, PRESETS)
  const { n } = st.value
  const fac = useMemo(() => factorize(n), [n])
  const primes = fac.map((f) => f.p)
  const s = useStepper(primes.length + 1, { resetKey: n })
  const k = s.index // počet už použitých prvočísel
  const used = primes.slice(0, k)
  const done = s.atEnd

  // kolik zbývá po škrtnutí násobků prvních k prvočísel
  const remaining = used.reduce((acc, p) => (acc / p) * (p - 1), n)
  const before = k > 0 ? (remaining / (primes[k - 1]! - 1)) * primes[k - 1]! : n

  const cells: Cell[] =
    n > GRID_MAX
      ? []
      : Array.from({ length: n }, (_, i) => {
      const x = i + 1
      const by = used.find((p) => x % p === 0)
      if (by === undefined) return { v: x, sub: '\u00a0', tone: done ? 'ok' : undefined, title: done ? `gcd(${x}, ${n}) = 1` : undefined }
      const now = by === primes[k - 1]
      return { v: x, sub: `${by} |`, tone: now ? 'changed' : 'dim', title: `${by} dělí ${x} i ${n}` }
    })

  const productTex = used.map((p) => `\\left(1 - \\tfrac{1}{${p}}\\right)`).join(' \\cdot ')
  const fracTex = used.map((p) => `\\tfrac{${p - 1}}{${p}}`).join(' \\cdot ')
  const coprimes = n <= GRID_MAX && done ? cells.filter((c) => c.tone === 'ok').map((c) => c.v) : []

  const p = primes[k - 1]
  const note =
    n === 1 ? (
      <>Číslo 1 nemá žádné prvočinitele; jediné číslo z {'{1}'} je s 1 nesoudělné, takže φ(1) = 1.</>
    ) : k === 0 ? (
      <>
        Začínáme se všemi čísly 1 … {n}. Rozklad {n} = {factorText(fac)} říká, že stačí škrtnout násobky {primes.length === 1 ? `prvočísla ${primes[0]}` : `prvočísel ${primes.slice(0, -1).join(', ')} a ${primes[primes.length - 1]}`}.
      </>
    ) : (
      <>
        Škrtáme násobky {p}: z {before} {k === 1 ? '' : 'zbývajících '}čísel padne každé {p}. číslo (tedy 1/{p}) a zůstane {before} · {p! - 1}/{p} = <b>{remaining}</b>.
        {done && ` Všechna zbylá čísla jsou s ${n} nesoudělná.`}
      </>
    )

  return (
    <Widget
      title={title ?? 'Eulerova funkce φ(n)'}
      lead={leadNode(lead, 'Zadej n a krokuj síto: každé prvočíslo z rozkladu n vyškrtne svoje násobky a co zbude, spočítá φ(n).')}
      {...st.widget}
      onRandom={() => st.set({ n: randInt(10, 120) })}
      footer={
        <p>
          Prvočíslo p dělí přesně každé p-té číslo, a to i mezi čísly, která zbyla po předchozích prvočíslech. Proto každé p vynásobí počet
          zbylých čísel (1 − 1/p) a na mocnině v rozkladu nezáleží.
        </p>
      }
    >
      <Row gap={4} align="end">
        <NumberField label="Číslo n" value={n} min={1} max={99999} onChange={(v) => st.set({ n: v })} />
        <Muted>
          Rozklad: <Tex tex={`${n} = ${n === 1 ? '1' : factorTex(fac)}`} />
        </Muted>
      </Row>

      <StepperBar stepper={s} noPlay={primes.length < 2} label={(i) => (i === 0 ? 'Start' : `Prvočíslo ${primes[i - 1]}`)} />

      <StepNote title={done ? 'Hotovo' : k === 0 ? 'Start' : `Násobky ${p}`} kind={done ? 'ok' : undefined}>
        {note}
      </StepNote>

      {n <= GRID_MAX ? (
        <Cells items={cells} wrap size="sm" ariaLabel={`Čísla 1 až ${n}`} />
      ) : (
        <Muted>Mřížku čísel ukazujeme do n = {GRID_MAX}; postup i vzorec platí pro libovolné n.</Muted>
      )}

      <Formula
        label={done ? `φ(${n})` : 'Zbývá'}
        steps={
          k === 0
            ? []
            : [<Tex key="a" tex={`${n} \\cdot ${productTex}`} />, <Tex key="b" tex={`${n} \\cdot ${fracTex}`} />]
        }
        result={remaining}
      />

      {done && (
        <Verdict kind="ok" title={`φ(${n}) = ${phi(n)}`}>
          {coprimes.length > 0 && coprimes.length <= 24 ? (
            <>
              S {n} jsou nesoudělná:{' '}
              {coprimes.map((c, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  <Tag tone="ok">{c}</Tag>
                </span>
              ))}
            </>
          ) : (
            <>Právě tolik čísel z 1 … {n} nemá s {n} společného dělitele — tolik prvků má v ℤ{sub(n)} inverzi.</>
          )}
        </Verdict>
      )}
    </Widget>
  )
}
