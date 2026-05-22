import { useEffect, useMemo, useRef, useState } from 'react'
import { ui } from './InteractiveCard'

// Real-valued elliptic curve point addition. Pure visual / pedagogic — no
// modular arithmetic. The user picks two points P, Q on the curve; we draw
// the secant (or tangent for doubling), find the third intersection −R, then
// reflect across the x-axis to obtain R = P + Q.

const SIZE = 360
const PAD = 24 // SVG padding in pixels
const X_MIN = -3
const X_MAX = 3
const Y_MIN = -3.5
const Y_MAX = 3.5
const SAMPLES = 481 // odd → guaranteed sample at x = 0

type Pt = { x: number; y: number }

function curveY2(x: number, a: number, b: number): number {
  return x * x * x + a * x + b
}

// Sample points on the curve as ordered arrays per branch.
// Branches: upper (y ≥ 0) and lower (y ≤ 0). May be disconnected in x.
function sampleBranches(
  a: number,
  b: number,
): { upper: Pt[][]; lower: Pt[][] } {
  const upper: Pt[][] = []
  const lower: Pt[][] = []
  let curUp: Pt[] = []
  let curLo: Pt[] = []
  for (let i = 0; i < SAMPLES; i++) {
    const x = X_MIN + ((X_MAX - X_MIN) * i) / (SAMPLES - 1)
    const y2 = curveY2(x, a, b)
    if (y2 >= 0) {
      const y = Math.sqrt(y2)
      curUp.push({ x, y })
      curLo.push({ x, y: -y })
    } else {
      if (curUp.length > 1) upper.push(curUp)
      if (curLo.length > 1) lower.push(curLo)
      curUp = []
      curLo = []
    }
  }
  if (curUp.length > 1) upper.push(curUp)
  if (curLo.length > 1) lower.push(curLo)
  return { upper, lower }
}

// Snap a clicked world-space point to the nearest curve sample. Tries both
// branches; takes the global minimum.
function snapToCurve(p: Pt, a: number, b: number): Pt {
  const { upper, lower } = sampleBranches(a, b)
  let best: Pt | null = null
  let bestD = Infinity
  for (const branch of [...upper, ...lower]) {
    for (const q of branch) {
      const dx = q.x - p.x
      const dy = q.y - p.y
      const d = dx * dx + dy * dy
      if (d < bestD) {
        bestD = d
        best = q
      }
    }
  }
  return best ?? p
}

function toScreen(p: Pt): { sx: number; sy: number } {
  const sx = PAD + ((p.x - X_MIN) / (X_MAX - X_MIN)) * (SIZE - 2 * PAD)
  const sy = PAD + ((Y_MAX - p.y) / (Y_MAX - Y_MIN)) * (SIZE - 2 * PAD)
  return { sx, sy }
}

function toWorld(sx: number, sy: number): Pt {
  const x = X_MIN + ((sx - PAD) / (SIZE - 2 * PAD)) * (X_MAX - X_MIN)
  const y = Y_MAX - ((sy - PAD) / (SIZE - 2 * PAD)) * (Y_MAX - Y_MIN)
  return { x, y }
}

function fmt(n: number, d = 2): string {
  if (!Number.isFinite(n)) return '∞'
  const s = n.toFixed(d)
  // strip trailing zeros / dangling dot
  return s.replace(/\.?0+$/, '') || '0'
}

export function ECAdd() {
  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)
  const [P, setP] = useState<Pt | null>(null)
  const [Q, setQ] = useState<Pt | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const discriminant = 4 * a * a * a + 27 * b * b
  const singular = Math.abs(discriminant) < 1e-6

  const { upper, lower } = useMemo(() => sampleBranches(a, b), [a, b])

  // Recompute snapped points whenever a, b change so they remain on the curve.
  useEffect(() => {
    if (singular) return
    setP((prev) => (prev ? snapToCurve(prev, a, b) : prev))
    setQ((prev) => (prev ? snapToCurve(prev, a, b) : prev))
  }, [a, b, singular])

  // Compute R = P + Q.
  const result = useMemo(() => {
    if (!P || !Q) return null
    // Doubling case: P = Q (same screen-snap point). Tangent slope.
    const isSame = Math.abs(P.x - Q.x) < 1e-9 && Math.abs(P.y - Q.y) < 1e-9
    // Vertical line case: x_P = x_Q but y_P = −y_Q → P + Q = O (point at infinity).
    if (!isSame && Math.abs(P.x - Q.x) < 1e-9) {
      return { slope: Infinity, negR: null, R: null, vertical: true }
    }
    let m: number
    if (isSame) {
      if (Math.abs(P.y) < 1e-9) {
        return { slope: Infinity, negR: null, R: null, vertical: true }
      }
      m = (3 * P.x * P.x + a) / (2 * P.y)
    } else {
      m = (Q.y - P.y) / (Q.x - P.x)
    }
    const xR = m * m - P.x - Q.x
    // Standard formula: y_R = m(x_P − x_R) − y_P, R = (x_R, y_R). The third
    // intersection of the secant with the curve sits at (x_R, −y_R); R is its
    // reflection across the x-axis.
    const yR = m * (P.x - xR) - P.y
    const negR_pt: Pt = { x: xR, y: -yR }
    const R_pt: Pt = { x: xR, y: yR }
    return { slope: m, negR: negR_pt, R: R_pt, vertical: false }
  }, [P, Q, a])

  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    if (singular) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    // Map client coords to SVG viewBox coords.
    const sx = ((e.clientX - rect.left) / rect.width) * SIZE
    const sy = ((e.clientY - rect.top) / rect.height) * SIZE
    const world = toWorld(sx, sy)
    const snapped = snapToCurve(world, a, b)
    if (!P) setP(snapped)
    else if (!Q) setQ(snapped)
    else {
      // both filled → restart with the new click as P
      setP(snapped)
      setQ(null)
    }
  }

  function reset() {
    setP(null)
    setQ(null)
  }

  // Build SVG path "d" for a branch.
  function branchPath(branch: Pt[]): string {
    if (branch.length === 0) return ''
    let d = ''
    branch.forEach((p, i) => {
      const { sx, sy } = toScreen(p)
      d += (i === 0 ? 'M' : 'L') + sx.toFixed(2) + ' ' + sy.toFixed(2) + ' '
    })
    return d
  }

  // Extended line through P and Q for visual. Clip to viewport.
  function lineEndpoints(): { x1: number; y1: number; x2: number; y2: number } | null {
    if (!P || !Q || !result || result.vertical) return null
    const m = result.slope
    const xL = X_MIN
    const xR = X_MAX
    const yL = P.y + m * (xL - P.x)
    const yR = P.y + m * (xR - P.x)
    const a1 = toScreen({ x: xL, y: yL })
    const a2 = toScreen({ x: xR, y: yR })
    return { x1: a1.sx, y1: a1.sy, x2: a2.sx, y2: a2.sy }
  }

  const line = lineEndpoints()

  // Tick marks for axes (every 1 unit).
  const xTicks: number[] = []
  for (let v = Math.ceil(X_MIN); v <= Math.floor(X_MAX); v++) xTicks.push(v)
  const yTicks: number[] = []
  for (let v = Math.ceil(Y_MIN); v <= Math.floor(Y_MAX); v++) yTicks.push(v)

  const origin = toScreen({ x: 0, y: 0 })

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className={ui.panel}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className={ui.label}>Parametr a</span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={a}
              onChange={(e) => setA(Number(e.target.value))}
              className={ui.slider}
            />
            <div className="flex items-baseline justify-between mt-1">
              <span className={ui.monoMuted}>−3 ≤ a ≤ 3</span>
              <span className={ui.chip}>a = {fmt(a, 1)}</span>
            </div>
          </label>
          <label className="block">
            <span className={ui.label}>Parametr b</span>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className={ui.slider}
            />
            <div className="flex items-baseline justify-between mt-1">
              <span className={ui.monoMuted}>−3 ≤ b ≤ 3</span>
              <span className={ui.chip}>b = {fmt(b, 1)}</span>
            </div>
          </label>
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-3">
          <span className={ui.monoMuted}>
            y² = x³ + ({fmt(a, 1)})x + ({fmt(b, 1)})
          </span>
          <span className={ui.monoMuted}>
            4a³ + 27b² = {fmt(discriminant, 2)}
          </span>
        </div>
        {singular && (
          <div className="mt-2 text-[12px] font-sans text-ink-400">
            Křivka je singulární (4a³ + 27b² = 0) — sčítání bodů zde není
            korektně definováno. Změňte parametry.
          </div>
        )}
      </div>

      {/* Canvas + readout */}
      <div className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-4 items-start">
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            width={SIZE}
            height={SIZE}
            onClick={handleClick}
            className="border border-ink-800 rounded bg-ink-950 cursor-crosshair select-none"
          >
            {/* Grid */}
            {xTicks.map((v) => {
              const { sx } = toScreen({ x: v, y: 0 })
              return (
                <line
                  key={'gx' + v}
                  x1={sx}
                  y1={PAD}
                  x2={sx}
                  y2={SIZE - PAD}
                  className="stroke-ink-800"
                  strokeWidth={v === 0 ? 1.2 : 0.5}
                />
              )
            })}
            {yTicks.map((v) => {
              const { sy } = toScreen({ x: 0, y: v })
              return (
                <line
                  key={'gy' + v}
                  x1={PAD}
                  y1={sy}
                  x2={SIZE - PAD}
                  y2={sy}
                  className="stroke-ink-800"
                  strokeWidth={v === 0 ? 1.2 : 0.5}
                />
              )
            })}

            {/* Axis labels */}
            {xTicks
              .filter((v) => v !== 0)
              .map((v) => {
                const { sx } = toScreen({ x: v, y: 0 })
                return (
                  <text
                    key={'tx' + v}
                    x={sx}
                    y={origin.sy + 12}
                    textAnchor="middle"
                    className="fill-ink-500 font-mono"
                    fontSize={9}
                  >
                    {v}
                  </text>
                )
              })}
            {yTicks
              .filter((v) => v !== 0)
              .map((v) => {
                const { sy } = toScreen({ x: 0, y: v })
                return (
                  <text
                    key={'ty' + v}
                    x={origin.sx - 4}
                    y={sy + 3}
                    textAnchor="end"
                    className="fill-ink-500 font-mono"
                    fontSize={9}
                  >
                    {v}
                  </text>
                )
              })}

            {/* Curve (upper + lower branches) */}
            {!singular &&
              [...upper, ...lower].map((branch, i) => (
                <path
                  key={'br' + i}
                  d={branchPath(branch)}
                  fill="none"
                  className="stroke-ink-300"
                  strokeWidth={1.4}
                />
              ))}

            {/* Construction line */}
            {line && (
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                className="stroke-ink-500"
                strokeWidth={0.8}
              />
            )}

            {/* Vertical reflection line from −R down to R */}
            {result && result.negR && result.R && (
              <line
                x1={toScreen(result.negR).sx}
                y1={toScreen(result.negR).sy}
                x2={toScreen(result.R).sx}
                y2={toScreen(result.R).sy}
                className="stroke-ink-500"
                strokeWidth={0.8}
                strokeDasharray="3 3"
              />
            )}

            {/* Points P, Q, −R, R */}
            {P && <Marker p={P} label="P" />}
            {Q && <Marker p={Q} label="Q" />}
            {result && result.negR && (
              <Marker p={result.negR} label="−R" muted />
            )}
            {result && result.R && (
              <Marker p={result.R} label="R" accent />
            )}
          </svg>
        </div>

        {/* Readout */}
        <div className="space-y-2">
          <div className={ui.panel}>
            <div className={ui.rowLabel + ' mb-2'}>Body</div>
            <div className="space-y-1 font-mono text-[12.5px] text-ink-200">
              <div>
                P = {P ? `[${fmt(P.x)}, ${fmt(P.y)}]` : <span className="text-ink-500">— klikněte na křivku</span>}
              </div>
              <div>
                Q = {Q ? `[${fmt(Q.x)}, ${fmt(Q.y)}]` : <span className="text-ink-500">— klikněte na druhý bod</span>}
              </div>
              <div>
                R = P + Q ={' '}
                {result == null ? (
                  <span className="text-ink-500">—</span>
                ) : result.vertical || !result.R ? (
                  <span className="text-ink-400">O (bod v nekonečnu)</span>
                ) : (
                  <span className="text-ink-100">
                    [{fmt(result.R.x)}, {fmt(result.R.y)}]
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={ui.panel}>
            <div className={ui.rowLabel + ' mb-1'}>Směrnice</div>
            <div className="font-mono text-[12.5px] text-ink-200">
              {result == null ? (
                <span className="text-ink-500">—</span>
              ) : result.vertical ? (
                <span className="text-ink-400">svislá (P + Q = O)</span>
              ) : P && Q && Math.abs(P.x - Q.x) < 1e-9 ? (
                <>m = (3x_P² + a) / (2y_P) = {fmt(result.slope, 3)}</>
              ) : (
                <>m = (y_Q − y_P) / (x_Q − x_P) = {fmt(result.slope, 3)}</>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="text-[12px] font-sans text-ink-500">
              {!P
                ? 'Klikněte na křivku pro výběr P.'
                : !Q
                  ? 'Klikněte na křivku pro výběr Q.'
                  : 'Klikněte znovu pro nový výběr.'}
            </div>
            <button type="button" onClick={reset} className={ui.button}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Marker({
  p,
  label,
  accent,
  muted,
}: {
  p: Pt
  label: string
  accent?: boolean
  muted?: boolean
}) {
  const { sx, sy } = toScreen(p)
  const r = accent ? 3.5 : 2.8
  const fill = accent
    ? 'fill-accent-definice'
    : muted
      ? 'fill-ink-500'
      : 'fill-ink-100'
  return (
    <g>
      <circle
        cx={sx}
        cy={sy}
        r={r}
        className={fill + ' stroke-ink-950'}
        strokeWidth={0.8}
      />
      <text
        x={sx + 6}
        y={sy - 5}
        className="fill-ink-100 font-mono"
        fontSize={11}
      >
        {label}
      </text>
    </g>
  )
}
