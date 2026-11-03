import type { DocId, Question, SourceRef, Topic } from '@content/types'

export type DocInfo = { id: DocId; group: 'P' | 'C' | 'W'; n?: number; title: string; pages: number }

export const DOCS: DocInfo[] = [
  { id: 'P01', group: 'P', n: 1, title: 'Úvod do konceptuálního modelování', pages: 64 },
  { id: 'P02', group: 'P', n: 2, title: 'OntoUML: základy, rigidní a anti-rigidní sortály', pages: 85 },
  { id: 'P03', group: 'P', n: 3, title: 'OntoUML: ne-sortály a vztahy', pages: 58 },
  { id: 'P04', group: 'P', n: 4, title: 'OntoUML: celek–část a aspekty', pages: 69 },
  { id: 'P05', group: 'P', n: 5, title: 'OntoUML: shrnutí a antipatterny', pages: 61 },
  { id: 'P06', group: 'P', n: 6, title: 'Transformace OntoUML', pages: 59 },
  { id: 'P07', group: 'P', n: 7, title: 'OCL', pages: 38 },
  { id: 'P08', group: 'P', n: 8, title: 'RDF a OWL', pages: 65 },
  { id: 'P09', group: 'P', n: 9, title: 'BPMN', pages: 80 },
  { id: 'P11', group: 'P', n: 11, title: 'Shrnutí, příklady, AI v KM', pages: 57 },
  { id: 'C01', group: 'C', n: 1, title: 'Úvod, Costy Taxi', pages: 19 },
  { id: 'C02', group: 'C', n: 2, title: 'UML recap, OpenPonk', pages: 17 },
  { id: 'C03', group: 'C', n: 3, title: 'OntoUML: sortály', pages: 17 },
  { id: 'C04', group: 'C', n: 4, title: 'OntoUML: ne-sortály a vztahy', pages: 12 },
  { id: 'C05', group: 'C', n: 5, title: 'OntoUML: celek–část a aspekty', pages: 14 },
  { id: 'C06', group: 'C', n: 6, title: 'Shrnutí, antipatterny, transformace', pages: 38 },
  { id: 'C06-eshop', group: 'C', n: 6, title: 'E-shop (zadání)', pages: 1 },
  { id: 'C07', group: 'C', n: 7, title: 'OCL', pages: 17 },
  { id: 'C08', group: 'C', n: 8, title: 'Konzultace, midterm', pages: 7 },
  { id: 'C09', group: 'C', n: 9, title: 'RDF', pages: 19 },
  { id: 'C10', group: 'C', n: 10, title: 'BPMN', pages: 11 },
  { id: 'C11', group: 'C', n: 11, title: 'BPMN 2', pages: 4 },
  { id: 'C12', group: 'C', n: 12, title: 'Konzultace', pages: 7 },
  { id: 'W-suhrn', group: 'W', title: 'Souhrn OntoUML (FIT Wiki, studentský)', pages: 7 },
]
export const docById = (id: DocId) => DOCS.find((d) => d.id === id)!
export const docPdf = (id: DocId) => `/slides/${id}.pdf`
/** Short label: "P2", "C3", "Wiki". */
export function docShort(id: DocId): string {
  const d = docById(id)
  if (d.group === 'W') return 'Wiki'
  return `${d.group}${d.n}${id === 'C06-eshop' ? 'e' : ''}`
}
/** Long label: "Přednáška 2", "Cvičení 3". */
export function docLong(id: DocId): string {
  const d = docById(id)
  if (d.group === 'W') return d.title
  if (id === 'C06-eshop') return 'Cvičení 6 – E-shop'
  return `${d.group === 'P' ? 'Přednáška' : 'Cvičení'} ${d.n}`
}

export const TOPICS: Record<Topic, string> = {
  km: 'Konceptuální modelování',
  uml: 'UML základy',
  sortaly: 'Sortály',
  nesortaly: 'Ne-sortály',
  vztahy: 'Vztahy a relátory',
  'celek-cast': 'Celek–část',
  aspekty: 'Aspekty',
  antipatterny: 'Antipatterny',
  transformace: 'Transformace',
  ocl: 'OCL',
  rdf: 'RDF / OWL',
  bpmn: 'BPMN',
}

export type SourceGroup = 'midterm' | 'zkouska' | 'slidy' | 'orig'
export const SOURCE_GROUPS: Record<SourceGroup, string> = {
  midterm: 'Midterm (Wiki)',
  zkouska: 'Zkouška (Wiki)',
  slidy: 'Ze slidů',
  orig: 'Vymyšlené',
}

export function sourceGroup(q: Question): SourceGroup {
  if (q.origin.type === 'original') return 'orig'
  const s = q.origin.seen.join(' ').toLowerCase()
  if (s.includes('midterm')) return 'midterm'
  if (s.includes('zkouš') || s.includes('zkous') || s.includes('exam')) return 'zkouska'
  return 'slidy'
}

export const KIND_LABEL: Record<Question['kind'], string> = {
  mc: 'Vyber správné',
  tf: 'Pravda, nebo ne?',
  open: 'Otevřená otázka',
}

export function slideLabel(s: Extract<SourceRef, { kind: 'slide' }>) {
  return `${docShort(s.doc)} · ${s.page}`
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
