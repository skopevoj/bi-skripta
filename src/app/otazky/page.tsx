import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Bank } from '@/components/Bank'
import { questions } from '@/lib/content'

export const metadata: Metadata = { title: 'Banka otázek' }

export default function BankPage() {
  return (
    <main className="content">
      <div className="doc">
        <h1>Banka otázek</h1>
        <p className="lede">Skutečné otázky z midtermu a zkoušky (FIT Wiki), otázky ze slidů a vymyšlené otázky ve stejném stylu. Vyfiltruj si, co potřebuješ, a projdi to jednu po druhé.</p>
        <div style={{ height: 24 }} />
        <Suspense>
          <Bank questions={questions} />
        </Suspense>
      </div>
    </main>
  )
}
