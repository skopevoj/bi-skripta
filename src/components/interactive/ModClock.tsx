import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Modular arithmetic on a clock face. Shows a + b mod n as a rotation,
// with arrows that walk around the circle (and wrap when crossing 0).

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

type Op = '+' | '−' | '·'

function compute(a: number, b: number, op: Op, n: number): number {
  if (op === '+') return mod(a + b, n)
  if (op === '−') return mod(a - b, n)
  return mod(a * b, n)
}

export function ModClock() {
  const [n, setN] = useState(12)
  const [a, setA] = useState(7)
  const [b, setB] = useState(8)
  const [op, setOp] = useState<Op>('+')

  const safeN = Math.max(2, Math.min(36, n | 0))
  const safeA = mod(a | 0, safeN)
  const safeB = Math.max(-99, Math.min(99, b | 0))

  const result = useMemo(() => compute(safeA, safeB, op, safeN), [safeA, safeB, op, safeN])

  // Steps for the "walk": for + and −, we walk |b| positions; for ·, we
  // show repeated addition of a, b times (clamped to a sensible visual cap).
  const raw = op === '+' ? safeA + safeB : op === '−' ? safeA - safeB : safeA * safeB
  const steps = op === '·' ? Math.min(Math.abs(safeB), 12) : Math.min(Math.abs(safeB), 24)
  const direction = (op === '+' || op === '·') ? (safeB >= 0 ? 1 : -1) : (safeB >= 0 ? -1 : 1)

  // Circle geometry.
  const SIZE = 260
  const R = 100
  const CX = SIZE / 2
  const CY = SIZE / 2

  function tick(i: number) {
    // 0 at top, clockwise.
    const theta = (i / safeN) * 2 * Math.PI - Math.PI / 2
    return { x: CX + R * Math.cos(theta), y: CY + R * Math.sin(theta) }
  }

  // Build path that walks from safeA to result, going one tick at a time.
  const pathPoints: { x: number; y: number; value: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const v = mod(safeA + direction * i, safeN)
    const p = tick(v)
    pathPoints.push({ ...p, value: v })
  }

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Modul n</span>
          <input
            type="number"
            min={2}
            max={36}
            value={n}
            onChange={(e) => setN(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>a</span>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className={ui.input}
          />
          <div className={'mt-1 ' + ui.monoMuted}>a mod n = {safeA}</div>
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Operace</span>
          <div className="flex gap-1.5">
            {(['+', '−', '·'] as const).map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOp(o)}
                className={
                  'flex-1 py-1.5 rounded border font-mono text-[14px] transition-colors ' +
                  (op === o
                    ? 'bg-ink-200 text-ink-950 border-ink-200'
                    : 'bg-ink-900 text-ink-200 border-ink-800 hover:border-ink-700')
                }
              >
                {o}
              </button>
            ))}
          </div>
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>b</span>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
      </div>

      {/* Visual + equation */}
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-4 items-start">
        <div className={ui.panel + ' flex justify-center'}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-label="Modulární kruh">
            {/* Outer circle */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#dedcd3" strokeWidth={1} />
            {/* Tick marks and numbers */}
            {Array.from({ length: safeN }).map((_, i) => {
              const p = tick(i)
              const isResult = i === result
              const isStart = i === safeA
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isResult ? 11 : isStart ? 10 : 4}
                    fill={isResult ? '#16161a' : isStart ? '#9c9a91' : '#c4c2b8'}
                    stroke={isResult ? '#16161a' : 'none'}
                  />
                  <text
                    x={p.x}
                    y={p.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isResult ? 11 : 10}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fill={isResult ? '#fbfaf7' : isStart ? '#fbfaf7' : '#52524d'}
                  >
                    {i}
                  </text>
                </g>
              )
            })}
            {/* Walk path */}
            {pathPoints.map((p, i) => {
              if (i === 0) return null
              const prev = pathPoints[i - 1]!
              // Detect wrap (large angular jump) for dashed style.
              const dx = p.x - prev.x
              const dy = p.y - prev.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              const wrapped = dist > (2 * Math.PI * R) / safeN + 4
              return (
                <line
                  key={i}
                  x1={prev.x}
                  y1={prev.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#16161a"
                  strokeWidth={1.5}
                  strokeDasharray={wrapped ? '3 3' : undefined}
                  opacity={0.85}
                />
              )
            })}
            {/* Arrow head at result */}
            {pathPoints.length >= 2 &&
              (() => {
                const last = pathPoints[pathPoints.length - 1]!
                const prev = pathPoints[pathPoints.length - 2]!
                const dx = last.x - prev.x
                const dy = last.y - prev.y
                const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy))
                const ux = dx / len
                const uy = dy / len
                const ax = last.x - ux * 8 - uy * 5
                const ay = last.y - uy * 8 + ux * 5
                const bx = last.x - ux * 8 + uy * 5
                const by = last.y - uy * 8 - ux * 5
                return (
                  <polygon
                    points={`${last.x},${last.y} ${ax},${ay} ${bx},${by}`}
                    fill="#16161a"
                  />
                )
              })()}
          </svg>
        </div>

        <div className="space-y-3">
          <div className={ui.panel}>
            <div className={ui.rowLabel + ' mb-1'}>Výpočet</div>
            <div className="font-mono text-[15px] text-ink-100">
              {safeA} {op} {safeB} = {raw} ≡ <span className="font-semibold">{result}</span>{' '}
              (mod {safeN})
            </div>
            <div className={'mt-1.5 ' + ui.monoMuted}>
              {op === '+' && (
                <>Postup: ze {safeA} udělej {Math.abs(safeB)} krok{Math.abs(safeB) === 1 ? '' : 'ů'} {direction > 0 ? 'po směru ručiček' : 'proti směru'} — při překročení {safeN - 1} se vrátíš na 0.</>
              )}
              {op === '−' && (
                <>Odčítání = chůze opačným směrem. Při překročení 0 se vrátíš na {safeN - 1}.</>
              )}
              {op === '·' && (
                <>Násobení = opakované sčítání. {safeA} · {safeB} = {safeA} + {safeA} + … ({Math.abs(safeB)}×).</>
              )}
            </div>
          </div>

          <div className={ui.panel}>
            <div className={ui.rowLabel + ' mb-1'}>Co je modulo?</div>
            <div className="font-sans text-[13px] text-ink-300 leading-relaxed">
              ℤ<sub>n</sub> = {'{'}0, 1, …, n−1{'}'} — všechna celá čísla zaokrouhlená dolů na svůj zbytek po dělení n. Hodnota
              <span className="font-mono"> a mod n </span>
              odpovídá pozici na kruhu o {safeN} dílcích.
            </div>
          </div>
        </div>
      </div>

      {/* Quick toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={ui.label + ' mb-0'}>Rychle</span>
        {[5, 7, 11, 12, 26].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setN(v)}
            className={
              'px-1.5 py-0.5 rounded border text-[11px] font-mono transition-colors ' +
              (safeN === v
                ? 'bg-ink-200 text-ink-950 border-ink-200'
                : 'bg-ink-900 text-ink-300 border-ink-800 hover:border-ink-700')
            }
          >
            n = {v}
          </button>
        ))}
      </div>
    </div>
  )
}
