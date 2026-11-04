import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Blocks, DocHeader, Page, PrevNext, ReadMarker, Toc, calloutStart, plural, prevNext, readingMinutes, tocEntries, type QuestionLike } from '@skripta/ui'
import { OpenEditorButton } from '@/components/workbench/OopWorkbench'
import { chapterByNum, chapters, getQuestions, sectionQuestionIds } from '@/lib/content'
import { CALLOUTS, docLong } from '@/lib/meta'

type P = { params: Promise<{ n: string; s: string }> }

export function generateStaticParams() {
  return chapters.flatMap((c) => c.sections.map((_, i) => ({ n: c.number, s: String(i + 1) })))
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { n, s } = await params
  const c = chapterByNum(n)
  const sec = c?.sections[Number(s) - 1]
  return { title: sec ? `${sec.number} ${sec.title}` : 'Kapitola' }
}

export default async function SectionPage({ params }: P) {
  const { n, s } = await params
  const c = chapterByNum(n)
  const si = Number(s) - 1
  const sec = c?.sections[si]
  if (!c || !sec) notFound()

  const qs = getQuestions(sectionQuestionIds(sec.blocks))
  const qmap: Record<string, QuestionLike> = Object.fromEntries(qs.map((q) => [q.id, q]))
  const { prev, next } = prevNext(chapters, chapters.indexOf(c), si, { end: { href: '/testy', title: 'Testy nanečisto' } })

  return (
    <>
      <Page>
        <DocHeader
          eyebrow={`Kapitola ${c.number} · ${c.title}`}
          number={sec.number}
          title={sec.title}
          meta={[
            { icon: 'slides', label: docLong(c.lecture) },
            ...(qs.length > 0 ? [{ icon: 'list' as const, label: plural(qs.length, ['otázka', 'otázky', 'otázek']) }] : []),
            { icon: 'clock', label: `${readingMinutes(sec.blocks)} min čtení` },
          ]}
        >
          {si === 0 && <p className="sk-lede">{c.summary}</p>}
        </DocHeader>

        <Blocks secId={sec.id} blocks={sec.blocks} questions={qmap} chapter={c.number} calloutStart={calloutStart(c, si)} />

        <ReadMarker sectionId={sec.id} />
        <PrevNext prev={prev} next={next} />
      </Page>
      <Toc entries={tocEntries(sec.id, sec.blocks, CALLOUTS)} docs={[c.lecture]}>
        <OpenEditorButton />
      </Toc>
    </>
  )
}
