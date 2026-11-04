import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PdfViewer } from '@/components/pdf/PdfViewer'
import { LECTURE_DOCS } from '@/lib/lectures'

type P = { params: Promise<{ lecture: string }> }

export function generateStaticParams() {
  return LECTURE_DOCS.filter((l) => l.file).map((l) => ({ lecture: l.id }))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lecture } = await params
  const l = LECTURE_DOCS.find((x) => x.id === lecture)
  return { title: l ? (l.n ? `Přednáška ${l.n}` : l.title) : 'Přednáška' }
}

export default async function LecturePage({ params }: P) {
  const { lecture } = await params
  const l = LECTURE_DOCS.find((x) => x.id === lecture)
  if (!l || !l.file) notFound()
  return (
    <main className="content">
      <div className="doc wide">
        <h1>
          {l.n && <span className="sn">{l.n}</span>}
          {l.title}
        </h1>
        <Suspense>
          <PdfViewer file={l.file} pages={l.pages ?? 1} />
        </Suspense>
      </div>
    </main>
  )
}
