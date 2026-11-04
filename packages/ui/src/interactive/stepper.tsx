'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { IxIcon } from './icons'
import { cx, type VerdictKind } from './util'

/* ------------------------------------------------------------------ */
/* useStepper                                                          */
/* ------------------------------------------------------------------ */

export type StepperOptions = {
  /** Výchozí krok (0 = první). */
  initial?: number
  /** Když se změní (např. `${a},${b}`), krokování se vrátí na `initial` a zastaví. */
  resetKey?: unknown
  /** Délka kroku při přehrávání při rychlosti 1× (ms). Výchozí 1100. */
  interval?: number
}

export type Stepper = {
  /** Aktuální krok, 0 … count−1. */
  index: number
  count: number
  atStart: boolean
  atEnd: boolean
  go: (i: number) => void
  next: () => void
  prev: () => void
  first: () => void
  last: () => void
  playing: boolean
  play: () => void
  pause: () => void
  toggle: () => void
  speed: number
  setSpeed: (s: number) => void
}

/**
 * Stav krokování algoritmu. `count` = počet stavů (včetně počátečního).
 * Při změně vstupů předej `resetKey`, ať se krokování vrátí na začátek.
 */
export function useStepper(count: number, { initial = 0, resetKey, interval = 1100 }: StepperOptions = {}): Stepper {
  const last = Math.max(0, count - 1)
  const [index, setIndex] = useState(Math.min(initial, last))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [key, setKey] = useState(resetKey)

  // reset při změně vstupů — odvozeně během renderu, bez blikání
  if (key !== resetKey) {
    setKey(resetKey)
    setIndex(Math.min(initial, last))
    setPlaying(false)
  }
  const i = Math.min(index, last)

  useEffect(() => {
    if (!playing) return
    if (i >= last) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setIndex((x) => Math.min(x + 1, last)), interval / speed)
    return () => clearTimeout(t)
  }, [playing, i, last, interval, speed])

  const go = useCallback((n: number) => setIndex(Math.max(0, Math.min(n, last))), [last])
  return {
    index: i,
    count,
    atStart: i === 0,
    atEnd: i >= last,
    go,
    next: () => go(i + 1),
    prev: () => go(i - 1),
    first: () => {
      setPlaying(false)
      go(0)
    },
    last: () => {
      setPlaying(false)
      go(last)
    },
    playing,
    play: () => {
      if (i >= last) setIndex(0)
      setPlaying(true)
    },
    pause: () => setPlaying(false),
    toggle: () => {
      if (playing) setPlaying(false)
      else {
        if (i >= last) setIndex(0)
        setPlaying(true)
      }
    },
    speed,
    setSpeed,
  }
}

/* ------------------------------------------------------------------ */
/* StepperBar                                                          */
/* ------------------------------------------------------------------ */

export type StepperBarProps = {
  stepper: Stepper
  /** Popisek kroku místo čísla, např. „runda 3 · MixColumns“. */
  label?: (index: number) => ReactNode
  /** Skrýt tlačítko Přehrát (krátké algoritmy do ~4 kroků). */
  noPlay?: boolean
  /** Skrýt posuvník (scrubber). */
  noScrubber?: boolean
  /** Nabízené rychlosti přehrávání. */
  speeds?: readonly number[]
  className?: string
}

const isTypingTarget = (el: EventTarget | null) => {
  if (!(el instanceof HTMLElement)) return false
  const tag = el.tagName
  if (tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable) return true
  if (tag === 'INPUT') return (el as HTMLInputElement).type !== 'button' && (el as HTMLInputElement).type !== 'checkbox'
  return false
}

/**
 * Ovládání krokování: ⏮ · ‹ Zpět · ▶ Přehrát · Další › · „Krok 3 / 9“ · posuvník · rychlost.
 * Klávesy ← / → (a Home / End) fungují, kdykoli je fokus kdekoli uvnitř widgetu (mimo textová pole).
 */
export function StepperBar({ stepper: s, label, noPlay, noScrubber, speeds = [0.5, 1, 2], className }: StepperBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const sRef = useRef(s)
  sRef.current = s

  useEffect(() => {
    const root = (ref.current?.closest('[data-ix-widget]') as HTMLElement | null) ?? ref.current
    if (!root) return
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || isTypingTarget(e.target)) return
      const st = sRef.current
      if (e.key === 'ArrowRight') st.next()
      else if (e.key === 'ArrowLeft') st.prev()
      else if (e.key === 'Home') st.first()
      else if (e.key === 'End') st.last()
      else return
      e.preventDefault()
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className={cx('ix-stepper', className)} ref={ref}>
      <div className="ix-stepper-row">
        <div className="ix-stepper-btns" role="group" aria-label="Krokování">
          <button type="button" className="ix-btn ix-btn-ghost ix-btn-icon" onClick={s.first} disabled={s.atStart} aria-label="Na začátek" title="Na začátek (Home)">
            <IxIcon name="first" />
          </button>
          <button type="button" className="ix-btn ix-btn-secondary" onClick={s.prev} disabled={s.atStart} title="Krok zpět (←)">
            <IxIcon name="prev" />
            <span className="ix-hide-xs">Zpět</span>
            <span className="ix-sr">Krok zpět</span>
          </button>
          {!noPlay && (
            <button type="button" className="ix-btn ix-btn-secondary" onClick={s.toggle} aria-pressed={s.playing} title={s.playing ? 'Pozastavit' : 'Přehrát kroky automaticky'}>
              <IxIcon name={s.playing ? 'pause' : 'play'} />
              <span className="ix-hide-xs">{s.playing ? 'Pauza' : s.atEnd ? 'Znovu' : 'Přehrát'}</span>
              <span className="ix-sr">{s.playing ? 'Pauza' : 'Přehrát'}</span>
            </button>
          )}
          <button type="button" className="ix-btn ix-btn-primary" onClick={s.next} disabled={s.atEnd} title="Další krok (→)">
            Další
            <IxIcon name="next" />
          </button>
        </div>
        <div className="ix-stepper-pos" aria-live="polite">
          {label ? (
            <>
              <span className="ix-stepper-l">{label(s.index)}</span>
              <span className="ix-stepper-n">
                {s.index + 1}/{s.count}
              </span>
            </>
          ) : (
            <span className="ix-stepper-l">
              Krok <b>{s.index + 1}</b> / {s.count}
            </span>
          )}
        </div>
      </div>
      {(!noScrubber || (!noPlay && speeds.length > 1)) && (
        <div className="ix-stepper-row ix-stepper-row2">
          {!noScrubber && (
            <input
              type="range"
              className="ix-range ix-stepper-scrub"
              min={0}
              max={Math.max(0, s.count - 1)}
              value={s.index}
              aria-label="Posun mezi kroky"
              aria-valuetext={`Krok ${s.index + 1} z ${s.count}`}
              style={{ ['--ix-pct' as string]: `${s.count > 1 ? (s.index / (s.count - 1)) * 100 : 0}%` }}
              onChange={(e) => {
                s.pause()
                s.go(Number(e.target.value))
              }}
            />
          )}
          {!noPlay && speeds.length > 1 && (
            <div className="ix-seg ix-seg-sm ix-stepper-speed" role="group" aria-label="Rychlost přehrávání">
              {speeds.map((v) => (
                <button key={v} type="button" aria-pressed={s.speed === v} onClick={() => s.setSpeed(v)}>
                  {String(v).replace('.', ',')}×
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* StepNote                                                            */
/* ------------------------------------------------------------------ */

export type StepNoteProps = {
  /** Krátký nadpis kroku, např. „Krok 3 · ShiftRows“ nebo „Výsledek“. */
  title?: ReactNode
  /** Stav (poslední krok s výsledkem apod.). Výchozí neutrální (akcent). */
  kind?: VerdictKind
  className?: string
  /** Jedna věta: co tenhle krok udělal a proč. */
  children: ReactNode
}

/** Vysvětlení aktuálního kroku. Patří hned pod `StepperBar` nebo pod vizualizaci kroku. */
export function StepNote({ title, kind, className, children }: StepNoteProps) {
  return (
    <div className={cx('ix-note', kind && `ix-note-${kind}`, className)} aria-live="polite">
      {title && <div className="ix-note-t">{title}</div>}
      <div className="ix-note-b">{children}</div>
    </div>
  )
}
