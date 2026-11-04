import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Question } from '@content/types'
import { Blocks, tocEntries } from '@/components/Blocks'
import { Toc } from '@/components/Toc'
import { ReadMarker } from '@/components/ReadMarker'
import { chapterByNum, chapters, getQuestions, readingMinutes, sectionQuestionIds } from '@/lib/content'
import { lectureNum } from '@/lib/meta'

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
  const qmap: Record<string, Question> = Object.fromEntries(qs.map((q) => [q.id, q]))

  // prev / next across chapters
  const ci = chapters.indexOf(c)
  const prev =
    si > 0
      ? { href: `/kapitola/${c.number}/${si}`, title: c.sections[si - 1].title }
      : ci > 0
        ? { href: `/kapitola/${chapters[ci - 1].number}/${chapters[ci - 1].sections.length}`, title: chapters[ci - 1].sections.at(-1)!.title }
        : null
  const next =
    si < c.sections.length - 1
      ? { href: `/kapitola/${c.number}/${si + 2}`, title: c.sections[si + 1].title }
      : ci < chapters.length - 1
        ? { href: `/kapitola/${chapters[ci + 1].number}/1`, title: `${chapters[ci + 1].number}. ${chapters[ci + 1].title}` }
        : { href: '/testy', title: 'Testy nanečisto' }

  const toc = tocEntries(sec.id, sec.blocks)

  return (
    <>
      <main className="content">
        <article className="doc" id="top">
          <h1>
            <span className="sn">{sec.number}</span>
            {sec.title}
          </h1>
          <p className="meta">
            Přednáška {lectureNum(c.lecture)} <i>·</i>{' '}
            {qs.length > 0 && (
              <>
                {qs.length === 1 ? '1 otázka' : qs.length <= 4 ? `${qs.length} otázky` : `${qs.length} otázek`} <i>·</i>{' '}
              </>
            )}
            {readingMinutes(sec.blocks)} min
          </p>
          {si === 0 && <p className="lede">{c.summary}</p>}

          <Blocks secId={sec.id} blocks={sec.blocks} qmap={qmap} />

          <ReadMarker sectionId={sec.id} />
          <nav className="next" aria-label="Sekce">
            {prev ? (
              <Link href={prev.href}>
                <small>← Předchozí</small>
                {prev.title}
              </Link>
            ) : (
              <span />
            )}
            <Link href={next.href}>
              <small>Další →</small>
              {next.title}
            </Link>
          </nav>
        </article>
      </main>
      <Toc entries={toc} lecture={c.lecture} />
    </>
  )
}
