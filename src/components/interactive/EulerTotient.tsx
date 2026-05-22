import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Visualizes Euler's totient φ(n): which numbers in {1, …, n} are coprime
// with n. Shows the prime factorization formula φ(n) = n · ∏ (1 − 1/p).

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function primeFactors(n: number): number[] {
  const out: number[] = []
  let x = Math.abs(n | 0)
  for (let p = 2; p * p <= x; p++) {
    if (x % p === 0) {
      out.push(p)
      while (x % p === 0) x = x / p
    }
  }
  if (x > 1) out.push(x)
  return out
}

export function EulerTotient() {
  const [n, setN] = useState(12)
  const safeN = Math.max(1, Math.min(120, n | 0))

  const coprimes = useMemo(() => {
    const out: number[] = []
    for (let k = 1; k <= safeN; k++) if (gcd(k, safeN) === 1) out.push(k)
    return out
  }, [safeN])

  const factors = useMemo(() => primeFactors(safeN), [safeN])
  const phi = coprimes.length

  const numerator = factors.reduce((acc, p) => acc * (p - 1), 1)
  const denominator = factors.reduce((acc, p) => acc * p, 1)

  // Cell grid: 10 columns; size auto.
  const COLS = Math.min(12, safeN)
  return (
    <div className="space-y-4">
      <label className={ui.panel + ' block'}>
        <span className={ui.label}>n</span>
        <input
          type="range"
          min={1}
          max={60}
          value={n}
          onChange={(e) => setN(Number(e.target.value) || 1)}
          className={ui.slider}
        />
        <div className="flex items-baseline justify-between mt-1">
          <span className={ui.monoMuted}>1 ≤ n ≤ 60</span>
          <span className={ui.chip}>n = {safeN}</span>
        </div>
      </label>

      {/* Coprime grid */}
      <div className={ui.panel}>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <div className={ui.rowLabel}>Čísla z {'{'}1,…,n{'}'}</div>
          <div className="flex items-center gap-3 text-[11px] font-sans">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-ink-200 border border-ink-200" />
              <span className="text-ink-400">nesoudělné s n</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-ink-900 border border-ink-800" />
              <span className="text-ink-400">sdílí dělitele s n</span>
            </span>
          </div>
        </div>
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeN }).map((_, i) => {
            const k = i + 1
            const isCop = gcd(k, safeN) === 1
            const g = gcd(k, safeN)
            return (
              <div
                key={k}
                className={
                  'aspect-square flex items-center justify-center rounded border font-mono text-[12px] ' +
                  (isCop
                    ? 'bg-ink-200 text-ink-950 border-ink-200'
                    : 'bg-ink-900 text-ink-400 border-ink-800')
                }
                title={`gcd(${k}, ${safeN}) = ${g}`}
              >
                {k}
              </div>
            )
          })}
        </div>
      </div>

      {/* Formula */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Eulerova funkce φ(n)</div>
        <div className="font-mono text-[14px] text-ink-100">
          φ({safeN}) = počet k ∈ {'{'}1,…,{safeN}{'}'} s gcd(k, {safeN}) = 1 ={' '}
          <span className="font-semibold">{phi}</span>
        </div>
        {factors.length > 0 ? (
          <>
            <div className={'mt-2 ' + ui.label + ' mb-1'}>Vzorec přes prvočíselný rozklad</div>
            <div className="font-mono text-[13px] text-ink-200">
              {safeN} = {factors.map((p, i) => {
                // recompute exponent
                let x = safeN
                let e = 0
                while (x % p === 0) { x /= p; e++ }
                return (
                  <span key={p}>
                    {i > 0 && ' · '}
                    {p}
                    {e > 1 && <sup>{e}</sup>}
                  </span>
                )
              })}
            </div>
            <div className="font-mono text-[13px] text-ink-100 mt-1">
              φ({safeN}) = {safeN} · {factors.map((p, i) => (
                <span key={p}>
                  {i > 0 && ' · '}
                  (1 − 1/{p})
                </span>
              ))}{' '}
              = {safeN} · {numerator}/{denominator} ={' '}
              <span className="font-semibold">{phi}</span>
            </div>
          </>
        ) : (
          <div className={'mt-2 ' + ui.monoMuted}>φ(1) = 1 (konvence).</div>
        )}
        <div className={'mt-2 text-[12px] font-sans text-ink-400 leading-relaxed'}>
          Důležitý speciální případ: pro prvočíslo p platí φ(p) = p − 1, neboť
          všechna čísla 1, …, p − 1 jsou s p nesoudělná. Pro součin dvou různých
          prvočísel je φ(pq) = (p − 1)(q − 1) — toto využívá RSA.
        </div>
      </div>
    </div>
  )
}
