import 'server-only'
import { buildSearchIndex, navChapters as uiNav, sectionQuestionIds, type NavChapter } from '@skripta/ui'
import { chapters, questionById, questions, tests, type Chapter, type Question } from '@content'
import { KIND_LABEL } from './meta'

export { chapters, questions, questionById, tests }
export { sectionQuestionIds }

export function chapterByNum(n: string): Chapter | undefined {
  return chapters.find((c) => c.number === n)
}

export function getQuestions(ids: string[]): Question[] {
  return ids.map((id) => questionById.get(id)).filter((q): q is Question => !!q)
}

/** Chapter outline for the sidebar / home list. */
export function navChapters(): NavChapter[] {
  return uiNav(chapters, { hasQuestion: (id) => questionById.has(id) })
}

export function searchIndex() {
  return buildSearchIndex({
    chapters,
    questions,
    sectionHref: (c, si) => `/kapitola/${c.number}/${si + 1}`,
    kindLabel: (q) => KIND_LABEL[q.kind as Question['kind']],
  })
}
