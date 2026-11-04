import type { AnswerState } from '@skripta/ui'
import { COMPILE_ERROR, type Question } from '@content/types'

type OutputQ = Extract<Question, { kind: 'output' }>

/** Output comparison ignores blank lines and runs of whitespace. */
export function normOutput(s: string): string {
  return s
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join('\n')
}

export const outputAnswered = (_q: OutputQ, st: AnswerState) => st.ce || st.text.trim() !== ''

/** „Co to vypíše?“: exact stdout (normalised), or the „Nezkompiluje se“ checkbox for 'CE'. */
export function gradeOutput(q: OutputQ, st: AnswerState): boolean {
  if (q.answer.trim() === COMPILE_ERROR) return st.ce
  if (st.ce) return false
  const want = normOutput(q.answer)
  if (normOutput(st.text) === want) return true
  // allow "6, 6, 8" for a multi-line output
  if (want.includes('\n')) return normOutput(st.text.replace(/\s*[,;]\s*/g, '\n')) === want
  return false
}
