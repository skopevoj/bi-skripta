import type { Metadata } from 'next'
import { DocHeader, Page, Rows } from '@skripta/ui'
import { DOCS } from '@/lib/meta'

export const metadata: Metadata = { title: 'Slajdy' }

const GROUPS = [
  { g: 'P' as const, title: 'Přednášky' },
  { g: 'C' as const, title: 'Cvičení' },
  { g: 'W' as const, title: 'Studentské materiály' },
]

export default function LecturesPage() {
  return (
    <Page>
      <DocHeader eyebrow="Zdroje" title="Slajdy">
        <p className="sk-lede">Slajdy přednášek a cvičení. Odkazy „P2 · 18“ (přednáška 2, slajd 18) nebo „C3 · 5“ (cvičení 3) ve skriptech vedou přímo na konkrétní slajd.</p>
      </DocHeader>
      {GROUPS.map(({ g, title }) => (
        <section key={g}>
          <h2>{title}</h2>
          <Rows
            items={DOCS.filter((d) => d.group === g).map((d) => ({
              href: `/prednasky/${d.id}`,
              num: d.group === 'W' ? 'W' : d.n,
              title: d.title,
              aside: `${d.pages} str.`,
            }))}
          />
        </section>
      ))}
    </Page>
  )
}
