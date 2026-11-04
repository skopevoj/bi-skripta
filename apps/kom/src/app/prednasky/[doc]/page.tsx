import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DocHeader, Page } from '@skripta/ui'
import { PdfViewer } from '@skripta/ui/workbench'
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
    <Page wide>
      <DocHeader eyebrow={docLong(d.id)} number={d.group === 'W' ? 'W' : `${d.group}${d.n}`} title={d.title} />
      <Suspense>
        <PdfViewer file={docPdf(d.id)} pages={d.pages} />
      </Suspense>
    </Page>
  )
}
