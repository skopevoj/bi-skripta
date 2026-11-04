'use client'
import { useEffect, useState } from 'react'
import { Rows } from '../content/Article'
import type { MockTest } from '../content/types'
import { useSkripta } from '../lib/context'
import { loadJSON } from '../lib/progress'
import { fmtPts, runKey, testRules, type TestRun } from './TestRunner'

export type TestSummary = Pick<MockTest, 'id' | 'title' | 'description' | 'minutes' | 'points' | 'partial' | 'pass'> & { n: number }

/** Mock tests with the last result ("7,5 / 10", "Rozpracovaný"). Pass summaries (no question data needed). */
export function TestList({ tests, href = (id) => `/testy/${id}` }: { tests: TestSummary[]; href?: (id: string) => string }) {
  const { course, practice } = useSkripta()
  const [runs, setRuns] = useState<Record<string, TestRun | null>>({})
  useEffect(() => {
    setRuns(Object.fromEntries(tests.map((t) => [t.id, loadJSON<TestRun>(runKey(course.storage, t.id))])))
  }, [tests, course.storage])
  return (
    <Rows
      items={tests.map((t, i) => {
        const r = runs[t.id]
        const R = testRules({ ...t, questionIds: [] }, t.n, practice?.testDefaults)
        return {
          key: t.id,
          href: href(t.id),
          num: i + 1,
          title: t.title,
          desc: t.description,
          aside: r?.submittedAt ? `${fmtPts(r.score ?? 0)} / ${fmtPts(R.max)}` : r ? 'Rozpracovaný' : '',
          done: !!r?.submittedAt && (r.score ?? 0) >= R.pass,
        }
      })}
    />
  )
}
