import type { Metadata } from 'next'
import Link from 'next/link'
import { LECTURE_DOCS } from '@/lib/lectures'

export const metadata: Metadata = { title: 'Přednášky' }

export default function LecturesPage() {
  return (
    <main className="content">
      <div className="doc">
        <h1>Přednášky</h1>
        <p className="lede">Slajdy přednášek, ze kterých je midterm. Odkazy „P2 · 18“ ve skriptech vedou přímo na konkrétní slajd.</p>
        <div style={{ height: 28 }} />
        <ul className="rows">
          {LECTURE_DOCS.map((l) =>
            l.file ? (
              <li key={l.id}>
                <Link className="row" href={`/prednasky/${l.id}`}>
                  <span className="num">{l.n ?? ''}</span>
                  <span className="row-t">{l.title}</span>
                  <span className="prog">{l.pages} str.</span>
                </Link>
              </li>
            ) : (
              <li key={l.id}>
                <div className="row" style={{ color: 'var(--ink-3)' }}>
                  <span className="num">{l.n}</span>
                  <span className="row-t" style={{ fontWeight: 500 }}>
                    {l.title}
                  </span>
                  <span />
                </div>
              </li>
            ),
          )}
        </ul>
      </div>
    </main>
  )
}
