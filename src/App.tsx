import { useEffect, useMemo } from 'react'
import { skripta, footnotes } from './data'
import type { Block, Chapter, Section } from './types'
import { Sidebar } from './components/Sidebar'
import { Callout } from './components/Callout'
import { MathHTML } from './components/MathHTML'
import { InteractiveCard } from './components/interactive/InteractiveCard'
import { InteractiveWidget } from './components/interactive/registry'
import { Figure } from './components/diagram/Figure'
import { DiagramComponent } from './components/diagram/registry'
import { GlossaryList } from './components/GlossaryList'
import { Exercise } from './components/Exercise'
import { Link, navigate, pathFor, useRoute } from './router'

function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <MathHTML className="skripta-prose" html={`<p>${block.html}</p>`} />
    case 'h3':
      return (
        <h3
          id={block.id}
          className="scroll-mt-8 mt-8 mb-3 text-xl font-sans font-semibold text-ink-100 flex items-baseline gap-3"
        >
          <span className="tabular-nums text-ink-500 text-base">{block.number}</span>
          <span>{block.title}</span>
        </h3>
      )
    case 'math':
      return <MathHTML className="skripta-prose" html={`$$${block.tex}$$`} />
    case 'list': {
      const inner = block.items.map((it) => `<li>${it}</li>`).join('')
      const html = block.ordered ? `<ol>${inner}</ol>` : `<ul>${inner}</ul>`
      return <MathHTML className="skripta-prose" html={html} />
    }
    case 'callout':
      return (
        <Callout
          type={block.type}
          number={block.number}
          title={block.title}
          html={block.html}
          plain={block.plain}
        />
      )
    case 'interactive':
      return (
        <InteractiveCard title={block.title} hint={block.hint}>
          <InteractiveWidget name={block.component} />
        </InteractiveCard>
      )
    case 'diagram':
      return (
        <Figure caption={block.caption}>
          <DiagramComponent name={block.component} />
        </Figure>
      )
    case 'glossary':
      return <GlossaryList />
    case 'exercise':
      return (
        <Exercise
          number={block.number}
          title={block.title}
          source={block.source}
          problem={block.problem}
          solution={block.solution}
          result={block.result}
          answer={block.answer}
        />
      )
  }
}

function ChapterLanding({ chapter }: { chapter: Chapter }) {
  return (
    <section id={chapter.id} className="scroll-mt-6">
      <h1 className="text-3xl font-sans font-bold text-ink-100 mb-6 pb-3 border-b border-ink-800 flex items-baseline gap-4">
        <span className="tabular-nums text-ink-500 text-2xl font-semibold">
          {chapter.number}
        </span>
        <span>{chapter.title}</span>
      </h1>

      {chapter.intro?.map((b, i) => <BlockRenderer key={`intro-${i}`} block={b} />)}

      {chapter.sections.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-sans font-semibold tracking-[0.18em] uppercase text-ink-500 mb-4">
            Sekce
          </h2>
          <ul className="space-y-2 font-sans">
            {chapter.sections.map((s) => (
              <li key={s.id}>
                <Link
                  to={pathFor(chapter.id, s.id)}
                  className="group flex items-baseline gap-3 rounded-lg border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-700 transition-colors px-4 py-3"
                >
                  <span className="tabular-nums text-ink-500 shrink-0">
                    {s.number}
                  </span>
                  <span className="text-ink-200 group-hover:text-ink-100 font-medium">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}

function SectionView({ chapter, section }: { chapter: Chapter; section: Section }) {
  return (
    <article id={section.id} className="scroll-mt-6">
      <div className="mb-3 text-[12px] tracking-[0.18em] uppercase text-ink-500 font-sans font-semibold">
        <Link
          to={pathFor(chapter.id)}
          className="hover:text-ink-200 transition-colors"
        >
          {chapter.number}. {chapter.title}
        </Link>
      </div>
      <h1 className="text-3xl font-sans font-bold text-ink-100 mb-6 pb-3 border-b border-ink-800 flex items-baseline gap-4">
        <span className="tabular-nums text-ink-500 text-2xl font-semibold">
          {section.number}
        </span>
        <span>{section.title}</span>
      </h1>

      {section.blocks.map((b, i) => (
        <BlockRenderer key={`${section.id}-${i}`} block={b} />
      ))}
    </article>
  )
}

type Page =
  | { kind: 'chapter'; chapter: Chapter; label: string; number: string; to: string }
  | {
      kind: 'section'
      chapter: Chapter
      section: Section
      label: string
      number: string
      to: string
    }

function buildPages(chapters: Chapter[]): Page[] {
  const pages: Page[] = []
  for (const c of chapters) {
    pages.push({
      kind: 'chapter',
      chapter: c,
      label: c.title,
      number: c.number,
      to: pathFor(c.id),
    })
    for (const s of c.sections) {
      pages.push({
        kind: 'section',
        chapter: c,
        section: s,
        label: s.title,
        number: s.number,
        to: pathFor(c.id, s.id),
      })
    }
  }
  return pages
}

export default function App() {
  const chapters = skripta.chapters
  const route = useRoute()

  const pages = useMemo(() => buildPages(chapters), [chapters])

  // Resolve route → current page (or null on home / 404).
  const current: Page | null = useMemo(() => {
    if (route.kind === 'chapter') {
      return pages.find((p) => p.kind === 'chapter' && p.chapter.id === route.chapterId) ?? null
    }
    if (route.kind === 'section') {
      return (
        pages.find(
          (p) =>
            p.kind === 'section' &&
            p.chapter.id === route.chapterId &&
            p.section.id === route.sectionId,
        ) ?? null
      )
    }
    return null
  }, [route, pages])

  // Redirect / → first chapter.
  useEffect(() => {
    if (route.kind === 'home' && chapters[0]) {
      navigate(pathFor(chapters[0].id), { replace: true })
    }
  }, [route, chapters])

  // Scroll to top on every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [route])

  const currentIndex = current ? pages.indexOf(current) : -1
  const prev = currentIndex > 0 ? pages[currentIndex - 1]! : null
  const next =
    currentIndex >= 0 && currentIndex < pages.length - 1
      ? pages[currentIndex + 1]!
      : null

  const activeChapterId =
    route.kind === 'chapter' || route.kind === 'section' ? route.chapterId : null
  const activeSectionId = route.kind === 'section' ? route.sectionId : null

  const footnoteEntries = Object.entries(footnotes)

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      <Sidebar
        chapters={chapters}
        activeChapterId={activeChapterId}
        activeSectionId={activeSectionId}
      />

      <main className="min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
        <header className="mb-10" />

        {current?.kind === 'chapter' && <ChapterLanding chapter={current.chapter} />}
        {current?.kind === 'section' && (
          <SectionView chapter={current.chapter} section={current.section} />
        )}
        {!current && route.kind === 'notFound' && (
          <div className="font-sans">
            <h1 className="text-2xl font-bold text-ink-100 mb-3">
              Stránka nenalezena
            </h1>
            <p className="text-ink-300 mb-6">
              Adresa <code className="text-ink-200">{route.path}</code> neexistuje.
            </p>
            {chapters[0] && (
              <Link
                to={pathFor(chapters[0].id)}
                className="text-ink-200 underline decoration-ink-600 hover:text-ink-100"
              >
                Zpět na začátek
              </Link>
            )}
          </div>
        )}

        {current && (
          <nav className="mt-16 pt-8 border-t border-ink-800 grid grid-cols-2 gap-3 font-sans">
            {prev ? (
              <Link
                to={prev.to}
                className="group text-left rounded-lg border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-700 transition-colors px-4 py-3"
              >
                <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500 mb-1">
                  ← Předchozí
                </div>
                <div className="text-ink-200 group-hover:text-ink-100 text-sm font-medium leading-snug">
                  <span className="tabular-nums text-ink-500 mr-2">
                    {prev.number}
                  </span>
                  {prev.label}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                to={next.to}
                className="group text-right rounded-lg border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-700 transition-colors px-4 py-3"
              >
                <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500 mb-1">
                  Další →
                </div>
                <div className="text-ink-200 group-hover:text-ink-100 text-sm font-medium leading-snug">
                  <span className="tabular-nums text-ink-500 mr-2">
                    {next.number}
                  </span>
                  {next.label}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {footnoteEntries.length > 0 && (
          <section className="mt-16 pt-8 border-t border-ink-800">
            <h2 className="text-sm font-sans font-semibold tracking-[0.18em] uppercase text-ink-500 mb-4">
              Poznámky pod čarou
            </h2>
            <ol className="space-y-2 text-sm text-ink-300">
              {footnoteEntries.map(([n, html]) => (
                <li key={n} id={`fn-${n}`} className="flex gap-3">
                  <span className="tabular-nums text-ink-500 w-5 shrink-0">{n}.</span>
                  <MathHTML className="skripta-prose !text-sm" html={html} />
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  )
}
