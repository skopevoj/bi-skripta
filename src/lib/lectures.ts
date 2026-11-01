import type { LectureId } from '@content/types'

export type LectureDoc = { id: LectureId | 'L3' | 'sample'; n?: number; title: string; file?: string; pages?: number }

export const LECTURE_DOCS: LectureDoc[] = [
  { id: 'L1', n: 1, title: 'Principles of OOP', file: '/slides/L1.pdf', pages: 108 },
  { id: 'L2', n: 2, title: 'Subtyping polymorphism', file: '/slides/L2.pdf', pages: 84 },
  { id: 'L3', n: 3, title: 'Host – bez slidů, není na testu' },
  { id: 'L4', n: 4, title: 'Parametric polymorphism', file: '/slides/L4.pdf', pages: 82 },
  { id: 'L5', n: 5, title: 'Encapsulation, ADTs and pattern matching', file: '/slides/L5.pdf', pages: 78 },
  { id: 'L6', n: 6, title: 'Composition, inheritance and ad-hoc polymorphism', file: '/slides/L6.pdf', pages: 101 },
  { id: 'sample', title: 'Ukázkový midterm 2026', file: '/slides/sample-midterm.pdf', pages: 5 },
]
