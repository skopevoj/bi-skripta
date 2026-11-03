import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PdfViewer } from '@/components/pdf/PdfViewer'
import { DOCS, docLong, docPdf } from '@/lib/meta'

type P = { params: Promise<{ doc: string }> }

export function generateStaticParams() {
  return DOCS.map((d) => ({ doc: d.id }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { doc } = await params
  const d = DOCS.find((x) => x.id === doc)
  return { title: d ? docLong(d.id) : 'Slajdy' }
}

export default async function LecturePage({ params }: P) {
  const { doc } = await params
  const d = DOCS.find((x) => x.id === doc)
  if (!d) notFound()
  return (
    <main className="content">
      <div className="doc wide">
        <h1>
          <span className="sn">{d.group === 'W' ? 'W' : `${d.group}${d.n}`}</span>
          {d.title}
        </h1>
        <Suspense>
          <PdfViewer file={docPdf(d.id)} pages={d.pages} />
        </Suspense>
      </div>
    </main>
  )
}
