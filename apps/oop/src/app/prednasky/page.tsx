import type { Metadata } from 'next'
import { DocHeader, Page, Rows } from '@skripta/ui'
import { DOCS, docLong } from '@/lib/meta'

export const metadata: Metadata = { title: 'Přednášky' }

export default function LecturesPage() {
  const lectures = DOCS.filter((d) => d.id !== 'sample')
  const sample = DOCS.find((d) => d.id === 'sample')!
  return (
    <Page>
      <DocHeader eyebrow="Zdroje" title="Přednášky">
        <p className="sk-lede">Slajdy přednášek, ze kterých je midterm. Odkazy „P2 · 18“ ve skriptech vedou přímo na konkrétní slajd.</p>
      </DocHeader>
      <Rows items={lectures.map((d) => ({ href: `/prednasky/${d.id}`, num: d.n, title: d.title, aside: `${d.pages} str.` }))} />
      <p className="sk-fine">Přednáška 3 byla hostovská, bez slajdů, a na testu není.</p>
      <h2>Oficiální materiály</h2>
      <Rows items={[{ href: `/prednasky/${sample.id}`, num: 'S', title: docLong(sample.id), aside: `${sample.pages} str.` }]} />
    </Page>
  )
}
