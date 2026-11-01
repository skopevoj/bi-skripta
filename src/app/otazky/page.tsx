import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Bank } from '@/components/Bank'
import { chapters, questions } from '@/lib/content'

export const metadata: Metadata = { title: 'Banka otázek' }

export default function BankPage() {
  const chapterTitles = Object.fromEntries(chapters.map((c) => [c.lecture, c.title]))
  return (
    <main className="content">
      <div className="doc">
        <h1>Banka otázek</h1>
        <p className="lede">Skutečné otázky z kvízů, Anki a FIT Wiki a vymyšlené otázky ve stejném stylu. Vyfiltruj si, co potřebuješ, a projdi to jednu po druhé.</p>
        <div style={{ height: 24 }} />
        <Suspense>
          <Bank questions={questions} chapterTitles={chapterTitles} />
        </Suspense>
      </div>
    </main>
  )
}
