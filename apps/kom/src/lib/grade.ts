import type { Question } from '@content/types'
import type { AnswerState } from './progress'

export const emptyAnswer = (): AnswerState => ({ sel: [], text: '', ce: false, revealed: false, self: null })

export function isAnswered(q: Question, st: AnswerState): boolean {
  if (q.kind === 'mc') return st.sel.length > 0
  if (q.kind === 'tf') return st.sel.length > 0
  return st.revealed || st.text.trim() !== ''
}

/** null = cannot be graded automatically (open question without self-grade). */
export function grade(q: Question, st: AnswerState): boolean | null {
  if (q.kind === 'mc') {
    const a = [...st.sel].sort((x, y) => x - y)
    const b = [...q.correct].sort((x, y) => x - y)
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  if (q.kind === 'tf') return st.sel.length > 0 && st.sel[0] === (q.answer ? 0 : 1)
  return st.self
}
