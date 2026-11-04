import type { Metadata } from 'next'
import { DocHeader, Page } from '@skripta/ui'
import { TestList } from '@skripta/ui/practice'
import { tests } from '@/lib/content'

export const metadata: Metadata = { title: 'Testy nanečisto' }

export default function TestsPage() {
  return (
    <Page>
      <DocHeader eyebrow="Procvičování" title="Testy nanečisto">
        <p className="sk-lede">
          Cvičné midtermy (10 otázek, 20 min, jen OntoUML) a cvičné zkoušky (25 otázek, 45 min, celý předmět). Boduje se jako v Moodle, výsledky a
          vysvětlení uvidíš až po odevzdání.
        </p>
      </DocHeader>
      {tests.length === 0 ? (
        <p className="sk-empty">Testy se ještě připravují.</p>
      ) : (
        <TestList tests={tests.map((t) => ({ id: t.id, title: t.title, description: t.description, minutes: t.minutes, n: t.questionIds.length }))} />
      )}
    </Page>
  )
}
