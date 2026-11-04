import type { CalloutDef, DocInfo as UiDoc } from '@skripta/ui'
import type { DocId, LectureId, Question, Topic } from '@content/types'

// Course metadata shared by server pages and the client provider (plain data — no 'server-only', no 'use client').

export type DocInfo = { id: DocId; n?: number; title: string; file: string; pages: number }

/** PDFs the citations and the library (/prednasky) point at. */
export const DOCS: DocInfo[] = [
  { id: 'L1', n: 1, title: 'Principles of OOP', file: '/slides/L1.pdf', pages: 108 },
  { id: 'L2', n: 2, title: 'Subtyping polymorphism', file: '/slides/L2.pdf', pages: 84 },
  { id: 'L4', n: 4, title: 'Parametric polymorphism', file: '/slides/L4.pdf', pages: 82 },
  { id: 'L5', n: 5, title: 'Encapsulation, ADTs and pattern matching', file: '/slides/L5.pdf', pages: 78 },
  { id: 'L6', n: 6, title: 'Composition, inheritance and ad-hoc polymorphism', file: '/slides/L6.pdf', pages: 101 },
  { id: 'sample', title: 'Ukázkový midterm 2026', file: '/slides/sample-midterm.pdf', pages: 5 },
]
export const SAMPLE_PDF = '/slides/sample-midterm.pdf'

export const LECTURE_IDS: LectureId[] = ['L1', 'L2', 'L4', 'L5', 'L6']
export const lectureNum = (l: LectureId) => Number(l.slice(1))

/** Short badge label: "P2" (přednáška 2), "Sample". */
export const docShort = (id: DocId) => (id === 'sample' ? 'Sample' : `P${lectureNum(id)}`)
/** Long label: "Přednáška 2", "Ukázkový midterm 2026". */
export const docLong = (id: DocId) => (id === 'sample' ? 'Ukázkový midterm 2026' : `Přednáška ${lectureNum(id)}`)

/** Docs in the shape @skripta/ui expects (citations, TOC buttons, source panel). */
export const UI_DOCS: UiDoc[] = DOCS.map((d) => ({ id: d.id, short: docShort(d.id), long: docLong(d.id), title: d.title, file: d.file, pages: d.pages }))

/** OOP calls its trap callouts „Past“ (typický chyták na testu). */
export const CALLOUTS: Record<string, CalloutDef> = {
  past: { label: 'Past', icon: 'warn', tone: 'coral', toc: true, tocPrefix: 'Past' },
}

export const TOPICS: Record<Topic, string> = {
  principy: 'Principy OOP',
  objekty: 'Třídy a objekty',
  dispatch: 'Dispatch',
  subtyping: 'Subtyping',
  generics: 'Generika a bounds',
  variance: 'Variance',
  erasure: 'Type erasure',
  encapsulation: 'Zapouzdření',
  adt: 'ADT, case classes',
  pattern: 'Pattern matching',
  composition: 'Kompozice',
  traits: 'Traity',
  adhoc: 'Ad-hoc polymorfismus',
}

export type SourceGroup = 'sample' | 'kvizy' | 'anki' | 'wiki' | 'orig'
export const SOURCE_GROUPS: Record<SourceGroup, string> = {
  sample: 'Sample',
  kvizy: 'Kvízy 2023/24',
  anki: 'Anki',
  wiki: 'FIT Wiki',
  orig: 'Vymyšlené',
}

export function sourceGroup(q: Question): SourceGroup {
  if (q.origin.type === 'original') return 'orig'
  const s = q.origin.seen.join(' ').toLowerCase()
  if (q.id.startsWith('sample') || s.includes('sample')) return 'sample'
  if (q.id.startsWith('kv')) return 'kvizy'
  if (q.id.startsWith('anki')) return 'anki'
  if (q.id.startsWith('wiki')) return 'wiki'
  if (s.includes('anki')) return 'anki'
  if (s.includes('wiki')) return 'wiki'
  if (s.includes('kvíz') || s.includes('kviz')) return 'kvizy'
  return 'orig'
}

/** Labels of `verified`; only `scala` gets the green badge. */
export const VERIFIED = {
  scala: { label: 'Kompilátorem', badge: 'Ověřeno kompilátorem' },
  slides: { label: 'Slajdy' },
  reasoning: { label: 'Jen úvahou' },
} as const

export const KIND_LABEL: Record<Question['kind'], string> = {
  mc: 'Vyber správné',
  output: 'Co to vypíše?',
  open: 'Otevřená otázka',
}
