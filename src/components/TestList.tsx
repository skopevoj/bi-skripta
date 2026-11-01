'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { loadJSON } from '@/lib/progress'
import { runKey, type TestRun } from './TestRunner'

type T = { id: string; title: string; description: string; n: number }

export function TestList({ tests }: { tests: T[] }) {
  const [runs, setRuns] = useState<Record<string, TestRun | null>>({})
  useEffect(() => {
    setRuns(Object.fromEntries(tests.map((t) => [t.id, loadJSON<TestRun>(runKey(t.id))])))
  }, [tests])
  return (
    <ul className="rows">
      {tests.map((t, i) => {
        const r = runs[t.id]
        const st = r?.submittedAt ? `${r.score} / ${t.n * 2}` : r ? 'Rozpracovaný' : ''
        return (
          <li key={t.id}>
            <Link className="row" href={`/testy/${t.id}`}>
              <span className="num">{i + 1}</span>
              <span className="row-t">{t.title}</span>
              <span className={`prog${r?.submittedAt && (r.score ?? 0) >= t.n ? ' done' : ''}`}>{st}</span>
              <span className="row-d">{t.description}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
