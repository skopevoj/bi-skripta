import type { Metadata } from 'next'
import Link from 'next/link'
import { DOCS } from '@/lib/meta'

export const metadata: Metadata = { title: 'Slajdy' }

const GROUPS = [
  { g: 'P' as const, title: 'Přednášky' },
  { g: 'C' as const, title: 'Cvičení' },
  { g: 'W' as const, title: 'Studentské materiály' },
]

export default function LecturesPage() {
  return (
    <main className="content">
      <div className="doc">
        <h1>Slajdy</h1>
        <p className="lede">Slajdy přednášek a cvičení. Odkazy „P2 · 18“ (přednáška 2, slajd 18) nebo „C3 · 5“ (cvičení 3) ve skriptech vedou přímo na konkrétní slajd.</p>
        {GROUPS.map(({ g, title }) => (
          <section key={g}>
            <h2 className="anchor">{title}</h2>
            <ul className="rows">
              {DOCS.filter((d) => d.group === g).map((d) => (
                <li key={d.id}>
                  <Link className="row" href={`/prednasky/${d.id}`}>
                    <span className="num">{d.group === 'W' ? 'W' : d.n}</span>
                    <span className="row-t">{d.title}</span>
                    <span className="prog">{d.pages} str.</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
