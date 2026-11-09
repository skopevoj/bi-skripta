import type { ComponentType, ReactNode } from 'react'
import type { QuestionLike } from '../content/types'

/** Answer to one question. Shape kept stable — it is what is persisted in localStorage. */
export type AnswerState = {
  sel: number[]
  text: string
  /** "does not compile" checkbox (OOP `output` questions) */
  ce: boolean
  revealed: boolean
  self: boolean | null
}
export type SavedAnswer = { ok: boolean; st: AnswerState; t: number }

export type AnswerInputsProps<Q extends QuestionLike = QuestionLike> = {
  q: Q
  st: AnswerState
  set: (s: AnswerState) => void
  /** after checking / in test review */
  locked: boolean
  /** mark right / wrong options */
  showTruth: boolean
  /** Check the answer; pass `next` when submitting right after `set` (state is not updated yet). */
  onSubmit?: (next?: AnswerState) => void
  submitLabel?: string
}

/** A question kind. Built-ins: mc, tf, open. Courses register more (OOP `output`). */
export type QuestionKindDef<Q extends QuestionLike = any> = {
  /** Header label, e.g. "Vyber správné". */
  label: string
  Inputs: ComponentType<AnswerInputsProps<Q>>
  isAnswered: (q: Q, st: AnswerState) => boolean
  /** null = cannot be graded automatically (self-graded). */
  grade: (q: Q, st: AnswerState) => boolean | null
  /** "Odpověď: A, C." line after checking. */
  expected?: (q: Q) => ReactNode
  /** Show right/wrong marks on the inputs once checked (mc, tf). */
  showTruth?: boolean
  /** Self-graded against `modelAnswer` (open). */
  selfGraded?: boolean
  /** Points for tests; default: 1 when graded right. */
  points?: (q: Q, st: AnswerState, partial: boolean) => number
}

export type BankFilter = {
  id: string
  label: string
  /** `group` → options are shown under <optgroup> headings (consecutive options with the same group). */
  options: [value: string, label: string, group?: string][]
  get: (q: QuestionLike) => string | undefined
  /** Short tag shown in the question list and the practice header, e.g. OOP lecture "P4". */
  tag?: (q: QuestionLike) => string | undefined
}

export type PracticeConfig = {
  /** Extra / overridden question kinds. */
  kinds?: Record<string, QuestionKindDef<any>>
  /** Labels for `verified` values; `badge` = text of the green badge (only values with a badge get one). */
  verified?: Record<string, { label: string; badge?: string }>
  /** Topic id → label (bank filter, meta line). */
  topics?: Record<string, string>
  /** Topic id → heading it is grouped under in the topic filter (OOP: its lecture). Order of `topics` decides the order. */
  topicGroup?: (topic: string) => string | undefined
  /** Grouping of questions by origin for the bank filter. */
  sourceGroups?: { labels: Record<string, string>; of: (q: QuestionLike) => string }
  /** Additional bank filters (e.g. OOP: by lecture). Shown before the built-in ones. */
  bankFilters?: BankFilter[]
  /** Rendered under the prompt (KOM: OntoUML diagram, OOP: code without "edit"). Default: code block. */
  promptExtra?: (q: QuestionLike) => ReactNode
  /** Rendered next to "Zkusit znovu" after checking (OOP: "Spustit v editoru →"). */
  resultExtra?: (q: QuestionLike) => ReactNode
  testDefaults?: { minutes?: number; points?: number; partial?: boolean }
  /** Rules paragraph on the test intro screen. */
  testRules?: string
  testsHref?: string
  bankHref?: string
}
