import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Modular exponentiation in BigInt — safe for n up to ~2^53 inputs but produces
// exact results for arbitrary BigInt operands.
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n
  let result = 1n
  let b = ((base % mod) + mod) % mod
  let e = exp
  while (e > 0n) {
    if (e & 1n) result = (result * b) % mod
    e >>= 1n
    b = (b * b) % mod
  }
  return result
}

// Split n - 1 = 2^b · m with m odd.
function factor2(nMinus1: bigint): { b: number; m: bigint } {
  let b = 0
  let m = nMinus1
  while (m > 0n && (m & 1n) === 0n) {
    m >>= 1n
    b += 1
  }
  return { b, m }
}

// Trial-division ground truth so we can label numbers as actually prime or
// composite (the widget is meant for teaching, not large inputs).
function isPrimeTrial(n: bigint): boolean {
  if (n < 2n) return false
  if (n < 4n) return true
  if ((n & 1n) === 0n) return false
  let i = 3n
  while (i * i <= n) {
    if (n % i === 0n) return false
    i += 2n
  }
  return true
}

type Chain = {
  // z₀ = a^m, z₁ = z₀² mod n, …, z_b = a^{n-1} mod n.
  values: bigint[]
  // Index where z first becomes n - 1 (Miller-Rabin "passes" here). -1 if never.
  hitMinusOne: number
  // True when z₀ ≡ 1 (Miller-Rabin passes immediately).
  startsAtOne: boolean
}

function buildChain(a: bigint, b: number, m: bigint, n: bigint): Chain {
  const values: bigint[] = []
  let z = modPow(a, m, n)
  values.push(z)
  for (let i = 0; i < b; i++) {
    z = (z * z) % n
    values.push(z)
  }
  const startsAtOne = values[0] === 1n
  let hitMinusOne = -1
  // Standard MR: the witness check looks at z₀ = 1 or z_i = n - 1 for some
  // 0 ≤ i < b. We record the first such index.
  if (!startsAtOne) {
    for (let i = 0; i < b; i++) {
      if (values[i] === n - 1n) {
        hitMinusOne = i
        break
      }
    }
  }
  return { values, hitMinusOne, startsAtOne }
}

type Preset = {
  label: string
  n: number
  a: number
  note: string
}

const presets: Preset[] = [
  {
    label: '561 (Carmichael)',
    n: 561,
    a: 2,
    note: 'Carmichaelovo číslo — Fermat ho neodhalí pro žádnou bázi nesoudělnou s 561. MR ho ale prozradí.',
  },
  {
    label: '1729 (Carmichael)',
    n: 1729,
    a: 2,
    note: 'Slavné Hardy–Ramanujanovo číslo, navíc Carmichaelovo — Fermat selhává, MR funguje.',
  },
  {
    label: '341 (Fermat. pseudoprvočíslo)',
    n: 341,
    a: 2,
    note: '2³⁴⁰ ≡ 1 (mod 341), takže Fermat říká „prvočíslo". MR s bází 2 odhalí složenost.',
  },
  {
    label: '341 s bází 3',
    n: 341,
    a: 3,
    note: 'Stejné složené číslo, jiná báze: tentokrát i Fermat zachytí složenost.',
  },
  {
    label: '13 (prvočíslo)',
    n: 13,
    a: 2,
    note: 'Skutečné prvočíslo — oba testy projdou, ať vezmeš jakoukoli bázi.',
  },
  {
    label: '97 (prvočíslo)',
    n: 97,
    a: 5,
    note: 'Skutečné prvočíslo — oba testy projdou.',
  },
  {
    label: '15 (malé složené)',
    n: 15,
    a: 2,
    note: 'Drobné složené číslo — odhalí ho oba testy.',
  },
]

function formatBig(x: bigint): string {
  return x.toString()
}

export function MillerRabin() {
  const [n, setN] = useState(561)
  const [a, setA] = useState(2)

  // Sanity-clamp the inputs. Cap at 10^12 so trial-division (for the ground
  // truth label) stays under a second; the test math itself is fine much
  // higher, but the student doesn't need that here.
  const safeN = Math.max(3, Math.min(1_000_000_000_000, n | 0))
  const safeA = Math.max(2, Math.min(safeN - 1, a | 0))

  const N = BigInt(safeN)
  const A = BigInt(safeA)

  const { b, m } = useMemo(() => factor2(N - 1n), [safeN])
  const chain = useMemo(() => buildChain(A, b, m, N), [safeA, b, m, safeN])
  const fermatResult = chain.values[chain.values.length - 1]! // = a^{n-1} mod n
  const fermatPasses = fermatResult === 1n

  const mrPasses = chain.startsAtOne || chain.hitMinusOne !== -1
  const truth = useMemo(() => isPrimeTrial(N), [safeN])

  // Pedagogical highlight: did the tests disagree? That's the moment we want
  // students to notice — Fermat "probably prime" while MR finds a witness.
  const disagree = fermatPasses && !mrPasses

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Testované číslo n</span>
          <input
            type="number"
            min={3}
            value={n}
            onChange={(e) => setN(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Báze a (2 ≤ a ≤ n−1)</span>
          <input
            type="number"
            min={2}
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
      </div>

      {/* Presets */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Zajímavé případy</div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => {
            const active = p.n === safeN && p.a === safeA
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setN(p.n)
                  setA(p.a)
                }}
                className={
                  'px-2.5 py-1 rounded border font-sans text-[12px] transition-colors ' +
                  (active
                    ? 'bg-ink-100 text-ink-950 border-ink-100'
                    : 'bg-ink-900 hover:bg-ink-850 border-ink-800 text-ink-200')
                }
              >
                {p.label}
              </button>
            )
          })}
        </div>
        {presets.find((p) => p.n === safeN && p.a === safeA) && (
          <div className="mt-2 text-[12px] font-sans text-ink-400">
            {presets.find((p) => p.n === safeN && p.a === safeA)!.note}
          </div>
        )}
      </div>

      {/* Decomposition */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Rozklad n − 1</div>
        <div className="font-mono text-[13px] text-ink-100">
          n − 1 = {formatBig(N - 1n)} = 2<sup>{b}</sup> · {formatBig(m)}
          <span className="text-ink-400">
            {' '}
            (b = {b}, m liché)
          </span>
        </div>
      </div>

      {/* The shared chain z₀ … z_b — this is the heart of the comparison */}
      <div className={ui.panel + ' overflow-x-auto'}>
        <div className="flex items-baseline justify-between mb-2 gap-2 flex-wrap">
          <div className={ui.rowLabel}>
            Sdílený řetězec: z<sub>0</sub> = a<sup>m</sup>, z<sub>i+1</sub> = z<sub>i</sub>² mod n
          </div>
          <div className="text-[11px] font-sans text-ink-500">
            Fermat se dívá jen na poslední buňku · MR sleduje celý řetězec
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chain.values.map((v, i) => {
            const isLast = i === chain.values.length - 1
            const isStart = i === 0
            const isOne = v === 1n
            const isMinusOne = v === N - 1n
            const mrHitsHere = !chain.startsAtOne && i === chain.hitMinusOne

            // Two visual layers: an inner colour for MR (does this cell save
            // the test for this base?) and a ring for Fermat (the last cell
            // is what Fermat alone sees).
            let inner =
              'bg-ink-950 border-ink-800 text-ink-300'
            if (isStart && isOne) {
              inner = 'bg-emerald-900/40 border-emerald-700 text-emerald-200'
            } else if (mrHitsHere) {
              inner = 'bg-emerald-900/40 border-emerald-700 text-emerald-200'
            } else if (isMinusOne) {
              inner = 'bg-ink-900 border-emerald-800 text-emerald-300'
            } else if (isOne && !isStart) {
              // z = 1 after a squaring means the previous z was a non-trivial
              // square root of 1 — this is exactly the MR composite signal.
              inner = 'bg-rose-950/50 border-rose-800 text-rose-200'
            }

            const ringFermat = isLast
              ? fermatPasses
                ? 'ring-2 ring-emerald-500/70 ring-offset-2 ring-offset-ink-900'
                : 'ring-2 ring-rose-500/70 ring-offset-2 ring-offset-ink-900'
              : ''

            return (
              <div
                key={i}
                className={
                  'min-w-[60px] px-2 py-1.5 rounded border text-center font-mono text-[12px] ' +
                  inner +
                  ' ' +
                  ringFermat
                }
                title={
                  isLast
                    ? `z_${i} = a^(n−1) mod n — sem se dívá Fermat`
                    : `z_${i} = a^(${i === 0 ? 'm' : '2^' + i + '·m'}) mod n`
                }
              >
                <div className="text-[10px] font-sans tracking-[0.18em] text-ink-500 uppercase">
                  z<sub>{i}</sub>
                </div>
                <div>{formatBig(v)}</div>
                {isMinusOne && (
                  <div className="text-[10px] font-sans text-emerald-400">
                    = n−1
                  </div>
                )}
                {isOne && (
                  <div className="text-[10px] font-sans text-ink-400">
                    = 1
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Verdicts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Fermat column */}
        <div
          className={
            'rounded border px-3 py-3 ' +
            (fermatPasses
              ? 'border-emerald-800 bg-emerald-950/30'
              : 'border-rose-800 bg-rose-950/30')
          }
        >
          <div className="flex items-baseline justify-between mb-1">
            <div className="font-sans text-[13px] font-medium text-ink-100">
              Fermatův test
            </div>
            <div
              className={
                'font-mono text-[11px] tracking-[0.18em] uppercase ' +
                (fermatPasses ? 'text-emerald-300' : 'text-rose-300')
              }
            >
              {fermatPasses ? 'prošlo' : 'složené'}
            </div>
          </div>
          <div className="font-mono text-[13px] text-ink-200">
            a<sup>n−1</sup> mod n = {safeA}
            <sup>{safeN - 1}</sup> mod {safeN} ={' '}
            <span className="text-ink-100">{formatBig(fermatResult)}</span>
          </div>
          <div className="text-[12px] font-sans text-ink-400 mt-2">
            {fermatPasses
              ? 'Výsledek je 1 → Fermat usuzuje, že n může být prvočíslo.'
              : 'Výsledek není 1 → a je Fermatův svědek složenosti.'}
          </div>
        </div>

        {/* Miller-Rabin column */}
        <div
          className={
            'rounded border px-3 py-3 ' +
            (mrPasses
              ? 'border-emerald-800 bg-emerald-950/30'
              : 'border-rose-800 bg-rose-950/30')
          }
        >
          <div className="flex items-baseline justify-between mb-1">
            <div className="font-sans text-[13px] font-medium text-ink-100">
              Rabin–Millerův test
            </div>
            <div
              className={
                'font-mono text-[11px] tracking-[0.18em] uppercase ' +
                (mrPasses ? 'text-emerald-300' : 'text-rose-300')
              }
            >
              {mrPasses ? 'prošlo' : 'složené'}
            </div>
          </div>
          <div className="text-[12px] font-sans text-ink-300 space-y-1">
            {chain.startsAtOne && (
              <div>
                z<sub>0</sub> = a<sup>m</sup> ≡ 1 — test prochází hned na začátku.
              </div>
            )}
            {!chain.startsAtOne && chain.hitMinusOne !== -1 && (
              <div>
                z<sub>{chain.hitMinusOne}</sub> = n − 1 — test prochází po{' '}
                {chain.hitMinusOne} umocněních.
              </div>
            )}
            {!mrPasses && (
              <div>
                Řetězec nikdy nezačal jedničkou ani nezasáhl n − 1 →
                a je <strong>silný svědek složenosti</strong>.
              </div>
            )}
            {!mrPasses &&
              chain.values.some(
                (v, i) => i > 0 && v === 1n && chain.values[i - 1] !== N - 1n,
              ) && (
                <div className="text-rose-300">
                  Pozor: někde v řetězci se z² ≡ 1, aniž by předchozí z bylo
                  ±1. To je netriviální odmocnina z jedničky — silný důkaz, že
                  n není prvočíslo.
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Final banner — the punchline */}
      <div
        className={
          'rounded border px-3 py-3 ' +
          (disagree
            ? 'border-amber-700 bg-amber-950/40'
            : 'border-ink-800 bg-ink-900/40')
        }
      >
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div className="font-sans text-[13px] text-ink-100">
            {disagree ? (
              <>
                <strong className="text-amber-300">Rozpor:</strong> Fermat řekl
                „pravděpodobně prvočíslo", ale Rabin–Miller odhalil složenost.
                Přesně proto se v praxi používá MR.
              </>
            ) : fermatPasses && mrPasses ? (
              <>Oba testy se shodují: pro tuto bázi {safeN} prošlo.</>
            ) : (
              <>Oba testy se shodují: {safeN} je složené, a je svědkem.</>
            )}
          </div>
          <div className="text-[11px] font-sans tracking-[0.18em] uppercase text-ink-500">
            skutečnost: {truth ? 'prvočíslo' : 'složené'}
          </div>
        </div>
      </div>
    </div>
  )
}
