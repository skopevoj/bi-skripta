import { useEffect, useMemo, useState } from 'react'
import { skripta, footnotes } from './data'
import type { Block, Chapter } from './types'
import { Sidebar } from './components/Sidebar'
import { Callout } from './components/Callout'
import { MathHTML } from './components/MathHTML'
import { InteractiveCard } from './components/interactive/InteractiveCard'
import { InteractiveWidget } from './components/interactive/registry'
import { Figure } from './components/diagram/Figure'
import { DiagramComponent } from './components/diagram/registry'
import { GlossaryList } from './components/GlossaryList'
import { Exercise } from './components/Exercise'

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

function ChapterView({ chapter }: { chapter: Chapter }) {
  return (
    <section id={chapter.id} className="scroll-mt-6">
      <h2 className="text-3xl font-sans font-bold text-ink-100 mb-6 pb-3 border-b border-ink-800 flex items-baseline gap-4">
        <span className="tabular-nums text-ink-500 text-2xl font-semibold">
          {chapter.number}
        </span>
        <span>{chapter.title}</span>
      </h2>

      {chapter.intro?.map((b, i) => <BlockRenderer key={`intro-${i}`} block={b} />)}

      {chapter.sections.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-6 mt-10">
          <h2 className="text-2xl font-sans font-semibold text-ink-100 mb-4 flex items-baseline gap-3">
            <span className="tabular-nums text-ink-500 text-xl">{s.number}</span>
            <span>{s.title}</span>
          </h2>
          {s.blocks.map((b, i) => (
            <BlockRenderer key={`${s.id}-${i}`} block={b} />
          ))}
        </section>
      ))}
    </section>
  )
}

export default function App() {
  const chapters = skripta.chapters
  const [chapterIndex, setChapterIndex] = useState(0)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)

  const chapter = chapters[chapterIndex]!
  const prev = chapterIndex > 0 ? chapters[chapterIndex - 1] : null
  const next = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null

  const sectionIds = useMemo(() => chapter.sections.map((s) => s.id), [chapter])

  useEffect(() => {
    // reset scroll + active section when chapter changes
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    setActiveSectionId(null)
  }, [chapterIndex])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length === 0) return
        setActiveSectionId(visible[0]!.target.id)
      },
      { rootMargin: '-10% 0px -70% 0px', threshold: 0 },
    )
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sectionIds])

  const goChapter = (id: string) => {
    const idx = chapters.findIndex((c) => c.id === id)
    if (idx >= 0) setChapterIndex(idx)
  }
  const jumpSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const footnoteEntries = Object.entries(footnotes)

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      <Sidebar
        chapters={chapters}
        activeChapterId={chapter.id}
        activeSectionId={activeSectionId}
        onSelectChapter={goChapter}
        onJumpSection={jumpSection}
      />

      <main className="min-w-0 px-6 md:px-12 lg:px-16 py-10 max-w-4xl">
        <header className="mb-10" />

        <ChapterView chapter={chapter} />

        <nav className="mt-16 pt-8 border-t border-ink-800 grid grid-cols-2 gap-3 font-sans">
          {prev ? (
            <button
              onClick={() => setChapterIndex(chapterIndex - 1)}
              className="group text-left rounded-lg border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-700 transition-colors px-4 py-3"
            >
              <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500 mb-1">
                ← Předchozí
              </div>
              <div className="text-ink-200 group-hover:text-ink-100 text-sm font-medium leading-snug">
                <span className="tabular-nums text-ink-500 mr-2">{prev.number}</span>
                {prev.title}
              </div>
            </button>
          ) : (
            <div />
          )}
          {next ? (
            <button
              onClick={() => setChapterIndex(chapterIndex + 1)}
              className="group text-right rounded-lg border border-ink-800 bg-ink-900/40 hover:bg-ink-900 hover:border-ink-700 transition-colors px-4 py-3"
            >
              <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500 mb-1">
                Další →
              </div>
              <div className="text-ink-200 group-hover:text-ink-100 text-sm font-medium leading-snug">
                <span className="tabular-nums text-ink-500 mr-2">{next.number}</span>
                {next.title}
              </div>
            </button>
          ) : (
            <div />
          )}
        </nav>

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
