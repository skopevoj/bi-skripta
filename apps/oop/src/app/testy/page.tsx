import type { Metadata } from 'next'
import { DocHeader, Page } from '@skripta/ui'
import { TestList } from '@skripta/ui/practice'
import { tests } from '@/lib/content'

export const metadata: Metadata = { title: 'Testy nanečisto' }

export default function TestsPage() {
  return (
    <Page>
      <DocHeader eyebrow="Procvičování" title="Testy nanečisto">
        <p className="sk-lede">Deset otázek, 45 minut, 2 body za otázku bez částečných bodů. Výsledky a vysvětlení uvidíš až po odevzdání.</p>
      </DocHeader>
      {tests.length === 0 ? (
        <p className="sk-empty">Testy se ještě připravují.</p>
      ) : (
        <TestList tests={tests.map((t) => ({ id: t.id, title: t.title, description: t.description, n: t.questionIds.length }))} />
      )}
    </Page>
  )
}
