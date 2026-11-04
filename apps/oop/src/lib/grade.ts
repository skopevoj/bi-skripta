import type { Question } from '@content/types'
import type { AnswerState } from './progress'

export const emptyAnswer = (): AnswerState => ({ sel: [], text: '', ce: false, revealed: false, self: null })

export function normOutput(s: string): string {
  return s
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')
}

export function isAnswered(q: Question, st: AnswerState): boolean {
  if (q.kind === 'mc') return st.sel.length > 0
  if (q.kind === 'output') return st.ce || st.text.trim() !== ''
  return st.revealed || st.text.trim() !== ''
}

/** null = cannot be graded automatically (open question without self-grade). */
export function grade(q: Question, st: AnswerState): boolean | null {
  if (q.kind === 'mc') {
    const a = [...st.sel].sort((x, y) => x - y)
    const b = [...q.correct].sort((x, y) => x - y)
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  if (q.kind === 'output') {
    if (q.answer.trim() === 'CE') return st.ce
    if (st.ce) return false
    const want = normOutput(q.answer)
    const got = normOutput(st.text)
    if (got === want) return true
    // allow "6, 6, 8" for a multi-line output
    if (want.includes('\n')) return normOutput(st.text.replace(/\s*[,;]\s*/g, '\n')) === want
    return false
  }
  return st.self
}
