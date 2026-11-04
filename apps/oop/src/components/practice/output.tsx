'use client'
// OOP question kind „Co to vypíše?“ — the student types the exact stdout or ticks „Nezkompiluje se“.
import { useId } from 'react'
import type { AnswerInputsProps, QuestionKindDef } from '@skripta/ui'
import { COMPILE_ERROR, type Question } from '@content/types'
import { gradeOutput, outputAnswered } from '@/lib/grade'

type OutputQ = Extract<Question, { kind: 'output' }>

function OutputInputs({ q, st, set, locked, onSubmit, submitLabel }: AnswerInputsProps<OutputQ>) {
  const uid = useId()
  const multi = q.answer.includes('\n')
  return (
    <form
      className="sk-ans"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
    >
      {multi ? (
        <textarea
          className="oop-out"
          rows={Math.min(6, q.answer.split('\n').length)}
          placeholder="Výstup (každý řádek zvlášť)"
          aria-label="Tvoje odpověď"
          value={st.text}
          disabled={locked || st.ce}
          spellCheck={false}
          onChange={(e) => set({ ...st, text: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              onSubmit?.()
            }
          }}
        />
      ) : (
        <input
          type="text"
          placeholder="Výstup"
          aria-label="Tvoje odpověď"
          value={st.text}
          disabled={locked || st.ce}
          spellCheck={false}
          onChange={(e) => set({ ...st, text: e.target.value })}
        />
      )}
      <label className="sk-chk-l" htmlFor={uid}>
        <input id={uid} type="checkbox" checked={st.ce} disabled={locked} onChange={(e) => set({ ...st, ce: e.target.checked })} />
        Nezkompiluje se
      </label>
      {onSubmit && !locked && (
        <button className="sk-btn sm" type="submit" disabled={!outputAnswered(q, st)}>
          {submitLabel ?? 'Zkontrolovat'}
        </button>
      )}
    </form>
  )
}

export const outputKind: QuestionKindDef<OutputQ> = {
  label: 'Co to vypíše?',
  Inputs: OutputInputs,
  isAnswered: outputAnswered,
  grade: gradeOutput,
  expected: (q) =>
    q.answer.trim() === COMPILE_ERROR ? (
      <>Nezkompiluje se.</>
    ) : (
      <>
        Vypíše <code>{q.answer.split('\n').join(' ⏎ ')}</code>.
      </>
    ),
}
