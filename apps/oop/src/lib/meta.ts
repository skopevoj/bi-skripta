import type { LectureId, Question, SourceRef, Topic } from '@content/types'

export const LECTURES: { id: LectureId | 'L3'; n: number; title: string; pages?: number }[] = [
  { id: 'L1', n: 1, title: 'Principles of OOP' },
  { id: 'L2', n: 2, title: 'Subtyping polymorphism' },
  { id: 'L3', n: 3, title: 'Host – bez slidů, není na testu' },
  { id: 'L4', n: 4, title: 'Parametric polymorphism' },
  { id: 'L5', n: 5, title: 'Encapsulation, ADTs and pattern matching' },
  { id: 'L6', n: 6, title: 'Composition, inheritance and ad-hoc polymorphism' },
]
export const LECTURE_IDS: LectureId[] = ['L1', 'L2', 'L4', 'L5', 'L6']
export const lectureNum = (l: LectureId) => Number(l.slice(1))
export const lecturePdf = (l: LectureId) => `/slides/${l}.pdf`

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

export const KIND_LABEL: Record<Question['kind'], string> = {
  mc: 'Vyber správné',
  output: 'Co to vypíše?',
  open: 'Otevřená otázka',
}

export function slideLabel(s: Extract<SourceRef, { kind: 'slide' }>) {
  return `P${lectureNum(s.lecture)} · ${s.page}`
}

/** Strip HTML tags (for search / previews). */
export function plain(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
