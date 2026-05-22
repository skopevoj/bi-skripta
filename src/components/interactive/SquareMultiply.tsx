import { useEffect, useMemo, useRef, useState } from 'react'
import { ui } from './InteractiveCard'

type Step = {
  index: number // bit index from MSB (starting at 0)
  bit: 0 | 1
  // Previous result entering this step.
  before: number
  // State after the square step at this row.
  afterSquare: number
  // State after the optional multiply step (if bit === 1). Equal to afterSquare otherwise.
  afterMultiply: number
}

function buildSteps(base: number, exp: number, mod: number): Step[] {
  if (mod <= 0) return []
  const bits = exp.toString(2)
  const steps: Step[] = []
  let result = 1 % mod
  for (let i = 0; i < bits.length; i++) {
    const bit = (bits[i] === '1' ? 1 : 0) as 0 | 1
    const before = result
    // First iteration: skip leading square (result is still 1) for textbook left-to-right form.
    const afterSquare = i === 0 ? result : (result * result) % mod
    const afterMultiply = bit === 1 ? (afterSquare * (base % mod)) % mod : afterSquare
    steps.push({ index: i, bit, before, afterSquare, afterMultiply })
    result = afterMultiply
  }
  return steps
}

export function SquareMultiply() {
  const [a, setA] = useState(7)
  const [b, setB] = useState(13)
  const [m, setM] = useState(23)

  const safeA = Math.max(0, Math.min(99999, a | 0))
  const safeB = Math.max(0, Math.min(4095, b | 0))
  const safeM = Math.max(2, Math.min(99999, m | 0))

  const bits = useMemo(() => safeB.toString(2), [safeB])
  const steps = useMemo(
    () => buildSteps(safeA, safeB, safeM),
    [safeA, safeB, safeM],
  )
  const result = steps.length > 0 ? steps[steps.length - 1]!.afterMultiply : 1 % safeM
  const numMul = bits.length - 1 + bits.split('').filter((c) => c === '1').length

  // Playback: cursor is number of completed steps (0 = nothing yet).
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setCursor(steps.length)
    setPlaying(false)
  }, [safeA, safeB, safeM, steps.length])

  useEffect(() => {
    if (!playing) {
      if (timer.current) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
      return
    }
    if (cursor >= steps.length) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => setCursor((c) => c + 1), 850)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, cursor, steps.length])

  const activeStep = cursor > 0 ? steps[cursor - 1]! : null

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Základ a</span>
          <input
            type="number"
            min={0}
            value={a}
            onChange={(e) => setA(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Exponent b</span>
          <input
            type="number"
            min={0}
            max={4095}
            value={b}
            onChange={(e) => setB(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
        <label className={ui.panel + ' block'}>
          <span className={ui.label}>Modul m</span>
          <input
            type="number"
            min={2}
            value={m}
            onChange={(e) => setM(Number(e.target.value) || 0)}
            className={ui.input}
          />
        </label>
      </div>

      {/* Binary expansion with active bit highlight */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Binární rozvoj exponentu</div>
        <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1">
          <span className={ui.mono}>
            b = {safeB} ={' '}
            <span className="text-ink-100">
              {bits}
              <sub>2</sub>
            </span>
          </span>
          <span className={ui.monoMuted}>
            ({bits.length} bitů, {bits.split('').filter((c) => c === '1').length}{' '}
            jedniček)
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {bits.split('').map((bit, i) => {
            const isActive = activeStep !== null && i === activeStep.index
            const isDone = i < cursor
            const base =
              'font-mono text-[13px] w-7 h-7 flex items-center justify-center rounded border transition-colors '
            const style =
              isActive
                ? bit === '1'
                  ? 'bg-ink-100 text-ink-950 border-ink-100 ring-2 ring-ink-400 ring-offset-2 ring-offset-ink-900'
                  : 'bg-ink-700 text-ink-100 border-ink-700 ring-2 ring-ink-400 ring-offset-2 ring-offset-ink-900'
                : isDone
                  ? bit === '1'
                    ? 'bg-ink-200 text-ink-950 border-ink-200'
                    : 'bg-ink-800 text-ink-300 border-ink-800'
                  : bit === '1'
                    ? 'bg-ink-900 text-ink-400 border-ink-800 opacity-50'
                    : 'bg-ink-900 text-ink-500 border-ink-800 opacity-50'
            return (
              <span key={i} className={base + style} title={`bit ${i + 1} (zleva)`}>
                {bit}
              </span>
            )
          })}
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCursor((c) => Math.max(0, c - 1))}
          disabled={cursor === 0}
          className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
        >
          ← Zpět
        </button>
        <button
          type="button"
          onClick={() => setCursor((c) => Math.min(steps.length, c + 1))}
          disabled={cursor >= steps.length}
          className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
        >
          Další →
        </button>
        <button
          type="button"
          onClick={() => {
            if (cursor >= steps.length) setCursor(0)
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
            setCursor(0)
          }}
          className={ui.button}
        >
          ⟲ Reset
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setCursor(steps.length)
          }}
          className={ui.button}
        >
          ⏭ Konec
        </button>
        <span className={ui.monoMuted + ' ml-auto'}>
          krok {cursor} / {steps.length}
        </span>
      </div>

      {/* Active step explanation */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-1'}>Aktivní krok</div>
        {activeStep ? (
          <div className="space-y-1 font-mono text-[13px] text-ink-200">
            <div>
              {activeStep.index === 0 ? (
                <>
                  Krok 1 (nejvyšší bit = {activeStep.bit}) — startujeme s{' '}
                  <span className="text-ink-100">x = {activeStep.before}</span>
                  {activeStep.bit === 1 ? (
                    <>
                      , vynásobíme základem:{' '}
                      <span className="text-ink-100">
                        x · {safeA} mod {safeM} = {activeStep.afterMultiply}
                      </span>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  Krok {activeStep.index + 1}: vždy <em>square</em>{' '}
                  <span className="text-ink-100">
                    {activeStep.before}² mod {safeM} = {activeStep.afterSquare}
                  </span>
                  {activeStep.bit === 1 && (
                    <>
                      , a protože bit = 1, navíc <em>multiply</em>:{' '}
                      <span className="text-ink-100">
                        {activeStep.afterSquare} · {safeA} mod {safeM} ={' '}
                        {activeStep.afterMultiply}
                      </span>
                    </>
                  )}
                  {activeStep.bit === 0 && (
                    <span className="text-ink-400"> (bit = 0, multiply se vynechává)</span>
                  )}
                </>
              )}
            </div>
            <div className="text-ink-400">
              Stav po kroku: <span className="text-ink-100">x = {activeStep.afterMultiply}</span>
            </div>
          </div>
        ) : (
          <div className={ui.monoMuted}>
            Stiskni „Další" a sleduj, jak se v každém kroku výsledek umocní na druhou a — pokud je aktivní bit 1 — přinásobí se základ <span className="font-mono">a</span>.
          </div>
        )}
      </div>

      {/* Steps table */}
      <div className={ui.panel + ' overflow-x-auto'}>
        <div className={ui.rowLabel + ' mb-2'}>
          Postup (zleva doprava, square &amp; multiply)
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-ink-800">
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">
                Krok
              </th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">
                Bit
              </th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">
                Square
              </th>
              <th className="py-1.5 pr-3 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">
                Multiply
              </th>
              <th className="py-1.5 font-sans text-[11px] tracking-[0.18em] uppercase text-ink-500">
                Výsledek mod {safeM}
              </th>
            </tr>
          </thead>
          <tbody>
            {steps.map((s) => {
              const isVisible = s.index < cursor
              const isActive = activeStep !== null && s.index === activeStep.index
              return (
                <tr
                  key={s.index}
                  className={
                    'border-b border-ink-800/60 last:border-0 transition-opacity ' +
                    (isActive ? 'bg-ink-900/70 ' : '') +
                    (isVisible ? '' : 'opacity-30')
                  }
                >
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-400">
                    {s.index + 1}
                  </td>
                  <td className="py-1.5 pr-3">
                    <span
                      className={
                        'font-mono text-[12px] w-5 h-5 inline-flex items-center justify-center rounded border ' +
                        (s.bit === 1
                          ? 'bg-ink-200 text-ink-950 border-ink-200'
                          : 'bg-ink-900 text-ink-400 border-ink-800')
                      }
                    >
                      {s.bit}
                    </span>
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-300">
                    {s.index === 0 ? '—' : `→ ${s.afterSquare}`}
                  </td>
                  <td className="py-1.5 pr-3 font-mono text-[13px] text-ink-300">
                    {s.bit === 1 ? `· ${safeA} → ${s.afterMultiply}` : '—'}
                  </td>
                  <td className="py-1.5 font-mono text-[13px] text-ink-100">
                    {s.afterMultiply}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Final result */}
      <div className={ui.panel}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <div className={ui.label}>Výsledek</div>
            <div className="font-mono text-[15px] text-ink-100">
              {safeA}
              <sup>{safeB}</sup> mod {safeM} ={' '}
              <span className="font-semibold">{cursor >= steps.length ? result : '…'}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={ui.label}>Násobení</div>
            <div className={ui.mono}>{numMul}×</div>
            <div className={ui.monoMuted}>
              naivně {Math.max(0, safeB - 1)}×
            </div>
          </div>
        </div>
        <div className="mt-2 text-[12px] font-sans text-ink-400">
          Square &amp; multiply potřebuje O(log b) modulárních násobení, zatímco
          naivní postup O(b). Při velkých exponentech (tisíce bitů) je rozdíl
          řádový.
        </div>
      </div>
    </div>
  )
}
