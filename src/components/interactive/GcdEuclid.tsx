import { useEffect, useMemo, useRef, useState } from 'react'
import { ui } from './InteractiveCard'

// Visualizes the Euclidean algorithm step-by-step:
//   gcd(a, b) = gcd(b, a mod b)
// with a Prev/Next/Auto playback, and a tape of (a, b, q, r) rows.

type Row = { a: number; b: number; q: number; r: number }

function buildRows(a0: number, b0: number): Row[] {
  const rows: Row[] = []
  let a = Math.max(Math.abs(a0 | 0), Math.abs(b0 | 0))
  let b = Math.min(Math.abs(a0 | 0), Math.abs(b0 | 0))
  // Guard against infinite loops / b=0.
  let guard = 0
  while (b > 0 && guard < 200) {
    const q = Math.floor(a / b)
    const r = a - q * b
    rows.push({ a, b, q, r })
    a = b
    b = r
    guard++
  }
  return rows
}

export function GcdEuclid() {
  const [a, setA] = useState(252)
  const [b, setB] = useState(105)
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  const rows = useMemo(() => buildRows(a, b), [a, b])
  const gcd = rows.length > 0 ? rows[rows.length - 1]!.b : Math.max(Math.abs(a), Math.abs(b))

  // Reset step when inputs change.
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [a, b])

  // Auto-play.
  useEffect(() => {
    if (!playing) {
      if (timer.current) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
      return
    }
    if (step >= rows.length) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => setStep((s) => s + 1), 900)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, step, rows.length])

  const visibleRows = rows.slice(0, step)
  const current = step > 0 ? rows[step - 1] : null

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
          <span className={ui.label}>b</span>
          <input
            type="number"
            min={1}
            value={b}
            onChange={(e) => setB(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
      </div>

      {/* Playback controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
        >
          ← Krok zpět
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(rows.length, s + 1))}
          disabled={step >= rows.length}
          className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
        >
          Další krok →
        </button>
        <button
          type="button"
          onClick={() => {
            if (step >= rows.length) setStep(0)
            setPlaying((p) => !p)
          }}
          className={ui.buttonPrimary}
        >
          {playing ? '⏸ Pauza' : '▶ Přehrát'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setStep(0)
          }}
          className={ui.button}
        >
          ⟲ Reset
        </button>
        <span className={ui.monoMuted + ' ml-auto'}>
          krok {step} / {rows.length}
        </span>
      </div>

      {/* Active step explanation */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Pravidlo</div>
        <div className="font-mono text-[14px] text-ink-100">
          gcd(a, b) = gcd(b, a mod b)
        </div>
        {current ? (
          <div className="mt-2 font-mono text-[14px] text-ink-100">
            gcd({current.a}, {current.b}) = gcd({current.b},{' '}
            <span className="text-ink-100 font-semibold">{current.a} mod {current.b} = {current.r}</span>)
            <div className={ui.monoMuted + ' mt-1'}>
              {current.a} = {current.q} · {current.b} + {current.r}
              {current.r === 0 && (
                <span className="text-ink-100 font-semibold">
                  {' '}— zbytek je 0, hotovo: gcd = {current.b}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className={'mt-2 ' + ui.monoMuted}>Stiskni „Další krok" a sleduj, jak Euklid postupně zmenšuje dvojici (a, b), dokud b ≠ 0.</div>
        )}
      </div>

      {/* Tape of completed steps */}
      <div className={ui.panel + ' overflow-x-auto'}>
        <div className={ui.rowLabel + ' mb-2'}>Tabulka kroků</div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink-800">
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">#</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">a</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">b</th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">q = ⌊a/b⌋</th>
              <th className="py-1.5 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">r = a − q·b</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, i) => {
              const isLast = i === visibleRows.length - 1
              const isFinal = row.r === 0
              return (
                <tr
                  key={i}
                  className={
                    'border-b border-ink-800/60 last:border-0 ' +
                    (isLast ? 'bg-ink-900/60' : '')
                  }
                >
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-400">{i + 1}</td>
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-100">{row.a}</td>
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-100">{row.b}</td>
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-300">{row.q}</td>
                  <td
                    className={
                      'py-1.5 font-mono text-[13px] ' +
                      (isFinal ? 'text-ink-100 font-semibold' : 'text-ink-200')
                    }
                  >
                    {row.r}
                    {isFinal && <span className="ml-2 text-ink-500">← konec</span>}
                  </td>
                </tr>
              )
            })}
            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-2 font-mono text-[13px] text-ink-500">
                  (zatím žádné kroky)
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Result */}
      <div className={ui.panel}>
        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <div>
            <div className={ui.label}>Největší společný dělitel</div>
            <div className="font-mono text-[15px] text-ink-100">
              gcd({Math.abs(a)}, {Math.abs(b)}) ={' '}
              <span className="font-semibold">{step >= rows.length ? gcd : '…'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={ui.label}>Počet kroků</div>
            <div className={ui.mono}>{rows.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
