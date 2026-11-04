// Shared content schema for all skripta. Plain, serialisable TS data (Server → Client safe).
// `html` fields take inline HTML (<strong>, <em>, <code>, <br>, <ul>/<ol>/<li>, <a>) — how it is
// turned into React is decided by the course's `renderHtml` (default: innerHTML; KAB: KaTeX-aware).
// Courses extend these types (extra block kinds, question kinds, ids) — see README.

// ---------------------------------------------------------------------------
// Sources

export type SourceRef =
  /** A page of a course PDF (lecture/lab slides). `doc` = id from the course's `docs` list. */
  | { kind: 'slide'; doc: string; page: number; quote?: string }
  /** Official external documentation. */
  | { kind: 'web'; label: string; url: string }
  /** FIT Wiki (student-sourced). */
  | { kind: 'wiki'; label: string; url?: string; page?: string }
  /** The original image / PDF a question was transcribed from (public path). */
  | { kind: 'image'; src: string; label: string; url?: string }
  /** Official material without a link (e.g. "Sample midterm 2026, otázka 3"). */
  | { kind: 'official'; label: string }

/** One course PDF (slides, labs, wiki export…). */
export type DocInfo = {
  id: string
  /** Short badge label, e.g. "P2", "C3", "Wiki". */
  short: string
  /** Long label, e.g. "Přednáška 2". */
  long: string
  /** Full title, e.g. "OntoUML: základy, rigidní a anti-rigidní sortály". */
  title?: string
  /** Public URL of the PDF, e.g. "/slides/P02.pdf". */
  file: string
  pages?: number
  /** Grouping for the library page ("P", "C", "W"…). */
  group?: string
}

// ---------------------------------------------------------------------------
// Blocks

/** Built-in callout kinds (courses may add their own via `callouts` config). */
export type CalloutKind =
  | 'definice' | 'veta' | 'pravidlo' | 'lemma' | 'dusledek' | 'priklad'
  | 'past' | 'pozor' | 'poznamka' | 'shrnuti' | 'dukaz'

export type CoreBlock =
  | { kind: 'p'; html: string; sources?: SourceRef[] }
  | { kind: 'h3'; title: string; id?: string; number?: string }
  | { kind: 'list'; ordered: boolean; items: string[]; sources?: SourceRef[] }
  | { kind: 'code'; code: string; lang?: string; caption?: string; runnable?: boolean; sources?: SourceRef[] }
  | {
      kind: 'callout'
      type: CalloutKind | (string & {})
      title?: string
      html: string
      /** Explicit number ("5.5"); otherwise numbered per chapter (`chapter.n`). */
      number?: string
      /** Optional plain-language gloss rendered under the body ("Jednoduše: …"). */
      plain?: string
      code?: string
      lang?: string
      sources?: SourceRef[]
    }
  | { kind: 'table'; head: string[]; rows: string[][]; caption?: string; sources?: SourceRef[] }
  | { kind: 'figure'; src: string; alt: string; caption?: string; sources?: SourceRef[] }
  | { kind: 'interactive'; component: string; title?: string; hint?: string }
  /** Inline check questions from the bank (by id). */
  | { kind: 'quiz'; ids: string[]; title?: string }

/** Anything with a `kind` — course block kinds are delegated to registered renderers. */
export type BlockLike = { kind: string }

export type Section<B extends BlockLike = CoreBlock> = {
  id: string // anchor, e.g. "sec-2-3"
  number: string // "2.3"
  title: string
  blocks: B[]
}

export type Chapter<B extends BlockLike = CoreBlock> = {
  id: string
  number: string
  title: string
  summary?: string
  sections: Section<B>[]
}

/** Light-weight chapter outline for the sidebar / home list (serialisable). */
export type NavSection = { id: string; number: string; title: string; href: string; qids?: string[] }
export type NavChapter = { number: string; title: string; href: string; summary?: string; sections: NavSection[] }

// ---------------------------------------------------------------------------
// Questions

export type Origin =
  | { type: 'real'; seen: string[] }
  | { type: 'original'; inspiredBy: string; why: string }

/** Fields every question has. Courses add their own (diagram, lecture…). */
export type QuestionBase = {
  id: string
  topic?: string
  origin?: Origin
  prompt: string // html
  explanation: string // html
  /** e.g. 'slides' | 'reasoning' | 'scala' — labels come from practice config. */
  verified?: string
  sources?: SourceRef[]
  code?: string
  lang?: string
}

export type McQuestion = QuestionBase & { kind: 'mc'; options: string[]; correct: number[] }
export type TfQuestion = QuestionBase & { kind: 'tf'; answer: boolean }
export type OpenQuestion = QuestionBase & { kind: 'open'; modelAnswer: string }
export type CoreQuestion = McQuestion | TfQuestion | OpenQuestion

/** Any question; non-core kinds (e.g. OOP `output`) are handled by `practice.kinds`. */
export type QuestionLike = QuestionBase & { kind: string }

export type MockTest = {
  id: string
  title: string
  description: string
  questionIds: string[]
  /** default: practice config `testDefaults.minutes` (20) */
  minutes?: number
  /** points per question (default 1) */
  points?: number
  /** Moodle-style partial credit for multi-answer mc (default true) */
  partial?: boolean
  /** points needed to pass (default half of the max) */
  pass?: number
}
