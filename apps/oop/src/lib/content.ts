import 'server-only'
import { chapters, questionById, questions, tests, type Chapter, type Question, type Block } from '@content'

export { chapters, questions, questionById, tests }

export function chapterByNum(n: string): Chapter | undefined {
  return chapters.find((c) => c.number === n)
}

export function sectionQuestionIds(blocks: Block[]): string[] {
  return blocks.flatMap((b) => (b.kind === 'quiz' ? b.ids : []))
}

export function chapterQuestionIds(c: Chapter): string[] {
  return c.sections.flatMap((s) => sectionQuestionIds(s.blocks)).filter((id) => questionById.has(id))
}

export function getQuestions(ids: string[]): Question[] {
  return ids.map((id) => questionById.get(id)).filter((q): q is Question => !!q)
}

/** Light-weight chapter outline for client nav. */
export type NavChapter = {
  number: string
  title: string
  lecture: string
  sections: { id: string; number: string; title: string; qids: string[] }[]
}
export function navChapters(): NavChapter[] {
  return chapters.map((c) => ({
    number: c.number,
    title: c.title,
    lecture: c.lecture,
    sections: c.sections.map((s) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      qids: sectionQuestionIds(s.blocks).filter((id) => questionById.has(id)),
    })),
  }))
}

export function readingMinutes(blocks: Block[]): number {
  let words = 0
  const count = (s: string) => (words += s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length)
  for (const b of blocks) {
    if (b.kind === 'p') count(b.html)
    else if (b.kind === 'list') b.items.forEach(count)
    else if (b.kind === 'callout') {
      count(b.html)
      if (b.code) words += b.code.split('\n').length * 3
    } else if (b.kind === 'code') words += b.code.split('\n').length * 3
  }
  return Math.max(1, Math.round(words / 160))
}
