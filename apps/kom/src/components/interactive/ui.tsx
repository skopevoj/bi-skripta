'use client'

import { useState, type ReactNode } from 'react'
import type { CodeLang } from '@content/types'
import { highlight } from '@/lib/highlight'
import s from './ix.module.css'

export const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ')

/** Code with optional highlighted lines (others are dimmed while something is highlighted). */
export function CodeLines({
  lines,
  hl,
  ce,
  lang = 'ocl',
}: {
  lines: { text: string; id?: string }[]
  hl?: Set<string> | null
  ce?: boolean
  lang?: CodeLang
}) {
  const focus = !!hl && hl.size > 0
  return (
    <pre className={cx(s.code, focus && s.focus, ce && s.ce)}>
      {lines.map((l, i) => (
        <span
          key={i}
          className={cx(s.ln, focus && l.id && hl!.has(l.id) && s.hl)}
          dangerouslySetInnerHTML={{ __html: highlight(l.text, lang) || ' ' }}
        />
      ))}
    </pre>
  )
}

export function Seg<T extends string>({
  value,
  options,
  onChange,
  label,
  sans,
}: {
  value: T
  options: readonly { v: T; label: ReactNode }[]
  onChange: (v: T) => void
  label: string
  sans?: boolean
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} className={sans ? 'sans' : undefined} aria-pressed={o.v === value} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

/** A yes/no drill question with instant feedback. */
export function YesNo({
  question,
  answer,
  why,
  onNext,
  score,
  onAnswered,
  yes = 'Ano',
  no = 'Ne',
}: {
  question: ReactNode
  answer: boolean
  why: ReactNode
  onNext: () => void
  score?: { ok: number; total: number }
  onAnswered?: (correct: boolean) => void
  yes?: string
  no?: string
}) {
  const [picked, setPicked] = useState<boolean | null>(null)
  const done = picked !== null
  const pick = (v: boolean) => {
    if (done) return
    setPicked(v)
    onAnswered?.(v === answer)
  }
  const next = () => {
    setPicked(null)
    onNext()
  }
  const cls = (v: boolean) =>
    cx('btn ghost sm', s.btnSm, done && v === answer && s.right, done && picked === v && v !== answer && s.wrong, done && picked === v && s.picked)
  return (
    <div className={s.q}>
      <p className={s.qText}>{question}</p>
      <div className={s.qBtns}>
        <button className={cls(true)} onClick={() => pick(true)} aria-pressed={picked === true}>
          {yes}
        </button>
        <button className={cls(false)} onClick={() => pick(false)} aria-pressed={picked === false}>
          {no}
        </button>
        {done && (
          <button className={cx('btn sm', s.btnSm)} onClick={next}>
            Další otázka
          </button>
        )}
        {score && score.total > 0 && (
          <span className={s.score}>
            {score.ok}/{score.total} správně
          </span>
        )}
      </div>
      {done && (
        <p className={s.fb} aria-live="polite">
          <b className={picked === answer ? s.ok : s.bad}>{picked === answer ? 'Správně.' : `Špatně — správně je ${answer ? yes : no}.`}</b>
          {why}
        </p>
      )}
    </div>
  )
}

export function useScore() {
  const [sc, set] = useState({ ok: 0, total: 0 })
  return [sc, (ok: boolean) => set((p) => ({ ok: p.ok + (ok ? 1 : 0), total: p.total + 1 }))] as const
}

export { s as ix }
