import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Extended Euclidean: finds (g, s, t) with g = gcd(a, b) = s·a + t·b.
// When gcd(a, n) = 1, s mod n is the modular inverse of a.

type Row = {
  // a_i = q_i · b_i + r_i
  a: number
  b: number
  q: number
  r: number
  // Back-substituted Bézout coefficients of the ORIGINAL pair (a0, b0)
  // tracked as r_i = s_i · a0 + t_i · b0.
  s: number
  t: number
}

function buildRows(a0: number, b0: number): Row[] {
  const A = Math.abs(a0 | 0)
  const B = Math.abs(b0 | 0)
  if (A === 0 || B === 0) return []
  let a = A
  let b = B
  // Invariants: a = s_a · A + t_a · B, b = s_b · A + t_b · B.
  let sa = 1
  let ta = 0
  let sb = 0
  let tb = 1
  const rows: Row[] = []
  let guard = 0
  while (b > 0 && guard < 200) {
    const q = Math.floor(a / b)
    const r = a - q * b
    // (s_r, t_r) = (s_a, t_a) - q · (s_b, t_b)
    const sr = sa - q * sb
    const tr = ta - q * tb
    rows.push({ a, b, q, r, s: sr, t: tr })
    a = b
    b = r
    sa = sb
    ta = tb
    sb = sr
    tb = tr
    guard++
  }
  return rows
}

export function ExtEuclid() {
  const [a, setA] = useState(17)
  const [n, setN] = useState(26)

  const rows = useMemo(() => buildRows(a, n), [a, n])
  // The last row with r > 0 gives gcd = b in the final row; we want
  // gcd = last non-zero remainder, with its (s, t).
  const last = rows.length > 0 ? rows[rows.length - 1]! : null
  // After the loop, gcd = a (the previous b), with (s, t) = (s_a, t_a)
  // BEFORE the last assignment. Equivalently: the row whose r became 0 has
  // r=0, so the answer is the row just before. We tracked rows including the
  // terminating one; gcd = that row's b.
  const gcd = last ? last.b : Math.abs(a)
  // Bézout coefficients (s, t) for gcd come from the second-to-last row
  // (the row whose remainder is gcd), or, if there's only one row and it
  // already has r = 0, from (1, 0) trivially.
  const bezout = (() => {
    if (rows.length === 0) return { s: 1, t: 0 }
    if (rows.length === 1) {
      // Single step: a = q·n + 0, gcd = n, so n = 0·a + 1·n.
      return { s: 0, t: 1 }
    }
    return { s: rows[rows.length - 2]!.s, t: rows[rows.length - 2]!.t }
  })()

  const safeA = Math.abs(a | 0)
  const safeN = Math.max(1, Math.abs(n | 0))
  const coprime = gcd === 1
  const inverse = coprime ? ((bezout.s % safeN) + safeN) % safeN : null

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>a</span>
          <input
            type="number"
            min={1}
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>modul n</span>
          <input
            type="number"
            min={2}
            value={n}
            onChange={(e) => setN(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
      </div>

      {/* Table */}
      <div className={ui.panel + ' overflow-x-auto'}>
        <div className={ui.rowLabel + ' mb-2'}>Rozšířený Euklidův algoritmus</div>
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink-800">
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">#</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">a</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">b</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">q</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">r = a − q·b</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">s</th>
              <th className="py-1.5 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">t</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isFinal = row.r === 0
              const isGcd = i === rows.length - 2
              return (
                <tr
                  key={i}
                  className={
                    'border-b border-ink-800/60 last:border-0 ' +
                    (isGcd ? 'bg-ink-900/60' : '')
                  }
                >
                  <td className="py-1.5 pr-3 font-mono text-ink-400">{i + 1}</td>
                  <td className="py-1.5 pr-3 font-mono text-ink-100">{row.a}</td>
                  <td className="py-1.5 pr-3 font-mono text-ink-100">{row.b}</td>
                  <td className="py-1.5 pr-3 font-mono text-ink-300">{row.q}</td>
                  <td
                    className={
                      'py-1.5 pr-3 font-mono ' +
                      (isFinal ? 'text-ink-400' : 'text-ink-100 font-semibold')
                    }
                  >
                    {row.r}
                    {isFinal && <span className="ml-2 text-ink-500">← stop</span>}
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-ink-300">{row.s}</td>
                  <td className="py-1.5 font-mono text-ink-300">{row.t}</td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-2 font-mono text-[13px] text-ink-500">
                  Zadejte kladná a, n.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={'mt-2 ' + ui.monoMuted}>
          V každém řádku platí r = s·a + t·n. Po skončení dává poslední nenulový
          řádek hledané koeficienty.
        </div>
      </div>

      {/* Bézout */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Bézoutova rovnost</div>
        <div className="font-mono text-[14px] text-ink-100">
          gcd({safeA}, {safeN}) = {gcd} ={' '}
          <span className="text-ink-100">({bezout.s})</span> · {safeA} +{' '}
          <span className="text-ink-100">({bezout.t})</span> · {safeN}
        </div>
        <div className={'mt-1 ' + ui.monoMuted}>
          ověření: ({bezout.s})·{safeA} + ({bezout.t})·{safeN} ={' '}
          {bezout.s * safeA + bezout.t * safeN}
        </div>
      </div>

      {/* Modular inverse */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Modulární inverze</div>
        {coprime ? (
          <>
            <div className="font-mono text-[14px] text-ink-100">
              a<sup>−1</sup> mod n = {bezout.s} mod {safeN} ={' '}
              <span className="font-semibold">{inverse}</span>
            </div>
            <div className={'mt-1 ' + ui.monoMuted}>
              kontrola: {safeA} · {inverse} = {safeA * (inverse ?? 0)} ≡{' '}
              {((safeA * (inverse ?? 0)) % safeN + safeN) % safeN} (mod {safeN})
            </div>
          </>
        ) : (
          <div className="font-sans text-[13px] text-ink-400">
            gcd({safeA}, {safeN}) = {gcd} ≠ 1, takže a v ℤ<sub>n</sub> nemá inverzi.
          </div>
        )}
      </div>
    </div>
  )
}
