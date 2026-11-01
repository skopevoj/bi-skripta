import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TestRunner } from '@/components/TestRunner'
import { getQuestions, tests } from '@/lib/content'

type P = { params: Promise<{ id: string }> }

export function generateStaticParams() {
  return tests.map((t) => ({ id: t.id }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params
  return { title: tests.find((t) => t.id === id)?.title ?? 'Test' }
}

export default async function TestPage({ params }: P) {
  const { id } = await params
  const test = tests.find((t) => t.id === id)
  if (!test) notFound()
  const qs = getQuestions(test.questionIds)
  return (
    <main className="content">
      <div className="doc">
        <h1>{test.title}</h1>
        <TestRunner test={test} questions={qs} />
      </div>
    </main>
  )
}
