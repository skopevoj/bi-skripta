import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DocHeader, Page } from '@skripta/ui'
import { TestRunner } from '@skripta/ui/practice'
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
  return (
    <Page>
      <DocHeader eyebrow="Test nanečisto" title={test.title} />
      <TestRunner test={test} questions={getQuestions(test.questionIds)} />
    </Page>
  )
}
