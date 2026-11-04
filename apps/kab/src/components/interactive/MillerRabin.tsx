import { useMemo, type ReactNode } from 'react'
import { Cells, Formula, Grid, Muted, NumberField, StepNote, StepperBar, Verdict, Widget, usePresetState, useStepper, type Cell, type VerdictKind } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { factorize, factorText, isPrime, leadNode, modPow, randInt, split2, sub } from './lib/numtheory'

// Fermat vs. Rabin–Miller na jednom řetězci z₀ = a^m, z₁ = z₀², …, z_b = a^(n−1) (mod n), kde n − 1 = 2^b · m.
// Fermat se dívá jen na poslední článek, Rabin–Miller na celou cestu: do 1 se smí dojít jen přes −1.

type State = { n: number; a: number }

const PRESETS = [
  {
    label: 'Carmichael 561',
    values: { n: 561, a: 2 },
    note: '561 = 3 · 11 · 17 projde Fermatem pro každé a nesoudělné s 561. Rabin–Miller ho odhalí: 67² ≡ 1, ale 67 ≢ ±1.',
  },
  { label: 'Prvočíslo 97', values: { n: 97, a: 5 }, note: 'U prvočísla řetěz vždy začne jedničkou, nebo do 1 dojde přes −1 = 96.' },
  {
    label: 'Silný lhář 2047',
    values: { n: 2047, a: 2 },
    note: '2047 = 23 · 89, ale 2¹⁰²³ ≡ 1: i Rabin–Miller se může mýlit (nejvýš pro 1/4 bází a), proto se opakuje s různými a.',
  },
] as const

type Chain = {
  b: number
  m: bigint
  z: bigint[]
  /** Index, kde Rabin–Miller rozhodl. */
  decide: number
  mrPass: boolean
  fermatPass: boolean
}

function chain(n: number, a: number): Chain {
  const N = BigInt(n)
  const { b, m } = split2(N - 1n)
  const z: bigint[] = [modPow(a, m, N)]
  for (let i = 1; i <= b; i++) z.push((z[i - 1]! * z[i - 1]!) % N)
  let decide = b - 1
  let mrPass = false
  if (z[0] === 1n) {
    decide = 0
    mrPass = true
  } else {
    for (let i = 0; i < b; i++) {
      if (z[i] === N - 1n) {
        decide = i
        mrPass = true
        break
      }
      if (i > 0 && z[i] === 1n) {
        decide = i
        break
      }
    }
  }
  return { b, m, z, decide, mrPass, fermatPass: z[b] === 1n }
}

export function MillerRabin({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ n: 561, a: 2 }, PRESETS)
  const { n, a } = st.value
  const nErr = n % 2 === 0 ? `n = ${n} je sudé, takže je dělitelné 2. Test potřebuje liché n ≥ 5 — zkus ${n + 1}.` : undefined
  const aErr = !nErr && a > n - 2 ? `Báze a musí být od 2 do n − 2 = ${n - 2}.` : undefined
  const ok = !nErr && !aErr

  const c = useMemo(() => (ok ? chain(n, a) : null), [n, a, ok])
  const s = useStepper(c ? c.b + 1 : 1, { resetKey: `${n},${a}` })
  const prime = useMemo(() => isPrime(n), [n])

  if (!c) {
    return (
      <Shell title={title} lead={lead} st={st}>
        <Inputs n={n} a={a} st={st} nErr={nErr} aErr={aErr} />
        <Verdict kind="bad" title="Test nejde spustit">
          {nErr ?? aErr}
        </Verdict>
      </Shell>
    )
  }

  const N1 = BigInt(n - 1)
  const i = s.index
  const zi = c.z[i]!
  const cells: Cell[] = c.z.map((z, k) => {
    const label = k === 0 ? `z₀ = aᵐ` : k === c.b ? `z${sub(k)} = aⁿ⁻¹` : `z${sub(k)}`
    if (k > i) return { v: '·', sub: label, tone: 'dim' }
    const special = z === N1 ? 'ok' : z === 1n && k > 0 && c.z[k - 1] !== N1 && c.z[k - 1] !== 1n ? 'bad' : undefined
    return { v: z.toString(), sub: label, tone: special ?? (k === i ? 'active' : undefined), title: z === N1 ? 'n − 1 ≡ −1' : undefined }
  })

  const note: ReactNode = (() => {
    const head =
      i === 0 ? (
        <>
          z₀ = {a}
          <sup>{c.m.toString()}</sup> mod {n} = <b>{zi.toString()}</b>.
        </>
      ) : (
        <>
          z{sub(i)} = {c.z[i - 1]!.toString()}² mod {n} = <b>{zi.toString()}</b>.
        </>
      )
    let tail: ReactNode
    if (i > c.decide) tail = ' Rabin–Miller už rozhodl, dál počítáme jen kvůli Fermatovi.'
    else if (i === 0 && zi === 1n) tail = ' Hned 1 — Rabin–Miller končí: n možná je prvočíslo.'
    else if (zi === N1) tail = ` To je n − 1 ≡ −1 — test prošel, ${a} není svědek složenosti.`
    else if (zi === 1n) tail = ` Jednička bez −1 před ní: ${c.z[i - 1]}² ≡ 1, ale ${c.z[i - 1]} ≢ ±1. Taková odmocnina z 1 existuje jen modulo složené číslo.`
    else if (i === c.decide) tail = ` Ani po b − 1 = ${c.b - 1} umocněních nevyšlo −1, takže n je složené.`
    else tail = ' Ani 1, ani −1 — umocňujeme dál.'
    const fermat = i === c.b ? ' Poslední článek je aⁿ⁻¹ mod n — přesně to, na co se dívá Fermatův test.' : ''
    return (
      <>
        {head}
        {tail}
        {fermat}
      </>
    )
  })()

  const fac = factorize(n)
  const fermatV = verdictOf(c.fermatPass, prime)
  const mrV = verdictOf(c.mrPass, prime)

  return (
    <Shell title={title} lead={lead} st={st}>
      <Inputs n={n} a={a} st={st} />
      <Formula label="Rozklad" steps={[<Tex key="d" tex={`n - 1 = ${n - 1} = 2^{${c.b}} \\cdot ${c.m}`} />]} suffix={`b = ${c.b}, m = ${c.m} (liché)`} />

      <StepperBar stepper={s} noPlay={c.b < 2} label={(k) => `z${sub(k)}`} />
      <StepNote title={i === c.decide && i < c.b ? 'Rabin–Miller rozhodl' : i === c.b ? 'Konec řetězu' : `Článek z${sub(i)}`}>{note}</StepNote>

      <Cells items={cells} size="lg" ariaLabel="Řetěz z₀ … z_b" />

      {s.atEnd && (
        <>
          <Grid min={220} gap={3}>
            <Verdict kind={fermatV} title={`Fermat: ${c.fermatPass ? 'možná prvočíslo' : 'složené'}${fermatV === 'warn' ? ' — omyl' : ''}`}>
              Kouká jen na poslední článek z{sub(c.b)} = aⁿ⁻¹ mod n = {c.z[c.b]!.toString()}
              {c.fermatPass ? '.' : ' ≠ 1, ale prvočíslo by dalo 1.'}
            </Verdict>
            <Verdict kind={mrV} title={`Rabin–Miller: ${c.mrPass ? 'možná prvočíslo' : 'složené'}${mrV === 'warn' ? ' — omyl' : ''}`}>
              {c.mrPass
                ? c.z[0] === 1n
                  ? 'Řetěz začal jedničkou.'
                  : `Řetěz prošel −1 v článku z${sub(c.decide)}.`
                : c.fermatPass
                  ? 'Do 1 se dostal, aniž prošel −1.'
                  : 'Řetěz nikdy neprošel −1.'}
            </Verdict>
          </Grid>
          <Muted>
            Ve skutečnosti (pokusným dělením): {prime ? `${n} je prvočíslo.` : `${n} = ${factorText(fac)} je složené.`}
          </Muted>
        </>
      )}
    </Shell>
  )
}

/** Odpověď testu → tón: „složené“ je vždy pravda (bad), „možná prvočíslo“ je ok u prvočísla a warn u složeného. */
function verdictOf(pass: boolean, prime: boolean): VerdictKind {
  if (!pass) return 'bad'
  return prime ? 'ok' : 'warn'
}

type St = ReturnType<typeof usePresetState<State>>

function Shell({ title, lead, st, children }: WidgetProps & { st: St; children: ReactNode }) {
  return (
    <Widget
      title={title ?? 'Fermat vs. Rabin–Miller'}
      lead={leadNode(lead, 'Krokuj řetěz z₀ = aᵐ, z₁ = z₀², … mod n a porovnej, co z něj vyčte Fermatův a co Rabin–Millerův test.')}
      {...st.widget}
      onRandom={() => {
        const n = 2 * randInt(50, 4999) + 1
        st.set({ n, a: randInt(2, n - 2) })
      }}
      footer={
        <p>
          Modulo prvočíslo má 1 jen dvě odmocniny, +1 a −1. Řetěz z prvočísla proto do 1 vždy dojde přes −1 (nebo jí rovnou začne). Fermat vidí
          jen konec řetězu, Rabin–Miller i cestu — a tu Carmichaelova čísla neošálí.
        </p>
      }
    >
      {children}
    </Widget>
  )
}

function Inputs({ n, a, st, nErr, aErr }: { n: number; a: number; st: St; nErr?: string; aErr?: string }) {
  return (
    <Grid min={160}>
      <NumberField label="Testované číslo n" value={n} min={5} max={99999999} onChange={(v) => st.set({ n: v })} error={nErr} />
      <NumberField label="Báze a" value={a} min={2} max={99999999} onChange={(v) => st.set({ a: v })} error={aErr} hint="Náhodné číslo 2 … n − 2." />
    </Grid>
  )
}
