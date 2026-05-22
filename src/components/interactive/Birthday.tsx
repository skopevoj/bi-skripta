import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Theoretical probability of at least one collision when drawing k samples
// uniformly from a space of size N = 2^n: 1 - exp(-k(k-1) / (2N)).
function theoreticalP(k: number, N: number): number {
  if (k < 2 || N <= 1) return 0
  return 1 - Math.exp((-k * (k - 1)) / (2 * N))
}

// Run a single trial: draw k samples in [0, N), return true if any collide.
function singleTrial(k: number, N: number): boolean {
  const seen = new Set<number>()
  for (let i = 0; i < k; i++) {
    const v = Math.floor(Math.random() * N)
    if (seen.has(v)) return true
    seen.add(v)
  }
  return false
}

// Average collision rate over `trials` runs.
function empiricalP(k: number, N: number, trials: number): number {
  if (k < 2 || N <= 1) return 0
  let hits = 0
  for (let t = 0; t < trials; t++) {
    if (singleTrial(k, N)) hits++
  }
  return hits / trials
}

// Find the smallest k for which the theoretical probability ≥ 0.5.
function fiftyPercentK(N: number): number {
  // Closed-form: k ≈ sqrt(2N ln 2). Round up.
  const k = Math.ceil(Math.sqrt(2 * N * Math.log(2)))
  return k
}

export function Birthday() {
  const [bits, setBits] = useState(12)
  const [maxK, setMaxK] = useState(50)
  const [seed, setSeed] = useState(0)

  const N = useMemo(() => 2 ** bits, [bits])

  // Theoretical curve: 100 points across [0, maxK].
  const theoretical = useMemo(() => {
    const points: { k: number; p: number }[] = []
    const steps = 100
    for (let i = 0; i <= steps; i++) {
      const k = (i / steps) * maxK
      points.push({ k, p: theoreticalP(k, N) })
    }
    return points
  }, [maxK, N])

  // Empirical samples at discrete k positions; spaced about every maxK/20.
  const empirical = useMemo(() => {
    const points: { k: number; p: number }[] = []
    const stepCount = 20
    const step = Math.max(1, Math.round(maxK / stepCount))
    const trials = 100
    for (let k = 0; k <= maxK; k += step) {
      points.push({ k, p: empiricalP(k, N, trials) })
    }
    if (points.length === 0 || points[points.length - 1].k !== maxK) {
      points.push({ k: maxK, p: empiricalP(maxK, N, trials) })
    }
    return points
    // `seed` forces re-simulation when the user clicks the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxK, N, seed])

  const halfK = fiftyPercentK(N)

  // Chart geometry.
  const W = 640
  const H = 220
  const padL = 36
  const padR = 12
  const padT = 12
  const padB = 28
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const xScale = (k: number) => padL + (k / maxK) * innerW
  const yScale = (p: number) => padT + (1 - p) * innerH

  const theoreticalPath = theoretical
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${xScale(pt.k).toFixed(2)} ${yScale(pt.p).toFixed(2)}`)
    .join(' ')

  const yTicks = [0, 0.25, 0.5, 0.75, 1]
  const xTickCount = 5
  const xTicks = Array.from({ length: xTickCount + 1 }, (_, i) =>
    Math.round((i / xTickCount) * maxK),
  )

  // Bar half-width for empirical sample bars.
  const barW = Math.max(2, (innerW / empirical.length) * 0.45)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className={ui.panel + ' block'}>
          <div className="flex items-baseline justify-between">
            <span className={ui.label}>Bitů hashe (n)</span>
            <span className={ui.chip}>
              n = {bits}, 2<sup>n</sup> = {N.toLocaleString('cs-CZ')}
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            value={bits}
            onChange={(e) => setBits(Number(e.target.value))}
            className={ui.slider}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <div className="flex items-baseline justify-between">
            <span className={ui.label}>Počet vzorků (k)</span>
            <span className={ui.chip}>k = {maxK}</span>
          </div>
          <input
            type="range"
            min={1}
            max={500}
            value={maxK}
            onChange={(e) => setMaxK(Number(e.target.value))}
            className={ui.slider}
          />
        </label>
      </div>

      <div className={ui.panel}>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <span className={ui.rowLabel}>Pravděpodobnost kolize</span>
          <div className="flex items-center gap-3 text-[11px] font-sans">
            <span className="inline-flex items-center gap-1.5 text-ink-500">
              <span className="inline-block w-3 h-[2px] bg-ink-400" />
              Teoretická pravděpodobnost
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink-500">
              <span className="inline-block w-2.5 h-2.5 bg-accent-definice rounded-[1px]" />
              Empirická pravděpodobnost
            </span>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          {/* Y gridlines + labels */}
          {yTicks.map((t) => (
            <g key={`y-${t}`}>
              <line
                x1={padL}
                x2={W - padR}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="#dedcd3"
                strokeWidth={1}
                strokeDasharray={t === 0.5 ? '0' : '2 3'}
              />
              <text
                x={padL - 6}
                y={yScale(t) + 3}
                textAnchor="end"
                className="fill-ink-500"
                style={{ fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}
              >
                {t.toFixed(2)}
              </text>
            </g>
          ))}

          {/* X axis ticks */}
          {xTicks.map((t) => (
            <g key={`x-${t}`}>
              <line
                x1={xScale(t)}
                x2={xScale(t)}
                y1={H - padB}
                y2={H - padB + 3}
                stroke="#9c9a91"
                strokeWidth={1}
              />
              <text
                x={xScale(t)}
                y={H - padB + 14}
                textAnchor="middle"
                className="fill-ink-500"
                style={{ fontSize: '10px', fontFamily: 'ui-monospace, monospace' }}
              >
                {t}
              </text>
            </g>
          ))}
          <text
            x={(padL + W - padR) / 2}
            y={H - 4}
            textAnchor="middle"
            className="fill-ink-500"
            style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
          >
            k (počet vzorků)
          </text>

          {/* Empirical bars (sage) */}
          {empirical.map((pt, i) => (
            <rect
              key={`emp-${i}`}
              x={xScale(pt.k) - barW / 2}
              y={yScale(pt.p)}
              width={barW}
              height={Math.max(0, H - padB - yScale(pt.p))}
              fill="#bcd9c4"
            />
          ))}

          {/* Theoretical line */}
          <path
            d={theoreticalPath}
            stroke="#52524d"
            strokeWidth={1.5}
            fill="none"
          />

          {/* 50% reference line marker if halfK fits */}
          {halfK <= maxK && (
            <line
              x1={xScale(halfK)}
              x2={xScale(halfK)}
              y1={padT}
              y2={H - padB}
              stroke="#71706a"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
          )}
        </svg>

        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <div className="font-mono text-[13px] text-ink-200">
            Pro 2<sup>n</sup> = {N.toLocaleString('cs-CZ')} hodnot stačí{' '}
            <span className="text-ink-100 font-semibold">~{halfK}</span>{' '}
            vzorků pro 50&nbsp;% pravděpodobnost kolize.
          </div>
          <button
            type="button"
            onClick={() => setSeed((s) => s + 1)}
            className={ui.button}
          >
            Spustit simulaci znovu
          </button>
        </div>
      </div>

      <p className="text-[13px] font-sans text-ink-400 leading-relaxed">
        Narozeninový paradox: počet vzorků potřebných ke kolizi roste jako{' '}
        <span className="font-mono">√N</span>, nikoli <span className="font-mono">N</span>.
        Proto má <span className="font-mono">b</span>-bitová hašovací funkce
        praktickou bezpečnost vůči kolizím jen <span className="font-mono">b/2</span> bitů.
      </p>
    </div>
  )
}