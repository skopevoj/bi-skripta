// Aggregates all content for the app. Content files themselves are written by content agents;
// this file only wires them together.
import type { Chapter, MockTest, Question } from './types'

import { chap01 } from './chapters/chap01'
import { chap02 } from './chapters/chap02'
import { chap04 } from './chapters/chap04'
import { chap05 } from './chapters/chap05'
import { chap06 } from './chapters/chap06'

import { kvizyA } from './bank/kvizyA'
import { kvizyB } from './bank/kvizyB'
import { anki } from './bank/anki'
import { wiki } from './bank/wiki'
import { ch1 } from './bank/ch1'
import { ch2 } from './bank/ch2'
import { ch4 } from './bank/ch4'
import { ch5 } from './bank/ch5'
import { ch6 } from './bank/ch6'

import { sample } from './bank/sample'
import { mocks } from './bank/mocks'
import { tests as mockTests } from './tests/tests'

// Questions hidden everywhere in the app (duplicates / out of scope) — see curation.ts.
export { EXCLUDED_IDS } from './curation'
import { EXCLUDED_IDS } from './curation'

export * from './types'

export const chapters: Chapter[] = [chap01, chap02, chap04, chap05, chap06]

const allQuestions: Question[] = [
  ...sample,
  ...mocks,
  ...kvizyA,
  ...kvizyB,
  ...anki,
  ...wiki,
  ...ch1,
  ...ch2,
  ...ch4,
  ...ch5,
  ...ch6,
]

export const questions: Question[] = allQuestions.filter((q) => !EXCLUDED_IDS.has(q.id))

export const questionById: Map<string, Question> = new Map(questions.map((q) => [q.id, q]))

export const tests: MockTest[] = mockTests
