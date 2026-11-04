import type { Metadata } from 'next'
import { TestList } from '@/components/TestList'
import { tests } from '@/lib/content'

export const metadata: Metadata = { title: 'Testy nanečisto' }

export default function TestsPage() {
  return (
    <main className="content">
      <div className="doc">
        <h1>Testy nanečisto</h1>
        <p className="lede">Deset otázek, 45 minut, 2 body za otázku bez částečných bodů. Výsledky a vysvětlení uvidíš až po odevzdání.</p>
        <div style={{ height: 28 }} />
        {tests.length === 0 ? (
          <p className="empty">Testy se ještě připravují.</p>
        ) : (
          <TestList tests={tests.map((t) => ({ id: t.id, title: t.title, description: t.description, n: t.questionIds.length }))} />
        )}
      </div>
    </main>
  )
}
