import type { Metadata } from 'next'
import { Suspense } from 'react'
import { DocHeader, Page } from '@skripta/ui'
import { Bank } from '@skripta/ui/practice'
import { questions } from '@/lib/content'

export const metadata: Metadata = { title: 'Banka otázek' }

export default function BankPage() {
  return (
    <Page>
      <DocHeader eyebrow="Procvičování" title="Banka otázek">
        <p className="sk-lede">
          Skutečné otázky z midtermu a zkoušky (FIT Wiki), otázky ze slidů a vymyšlené otázky ve stejném stylu. Vyfiltruj si, co potřebuješ, a projdi to
          jednu po druhé.
        </p>
      </DocHeader>
      <Suspense>
        <Bank questions={questions} />
      </Suspense>
    </Page>
  )
}
