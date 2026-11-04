import { useEffect } from 'react'
import {
  Blocks,
  ChapterList,
  DocHeader,
  Icon,
  Comics,
  Link,
  Page,
  PrevNext,
  ReadMarker,
  Rows,
  Shell,
  Toc,
  plural,
  readingMinutes,
  tocEntries,
  useProgress,
  type NavChapter,
  type PageLink,
} from '@skripta/ui'
import { skripta } from './data'
import { buildKabSearch } from './searchIndex'
import { XKCD } from './xkcd'
import { KabProvider } from './skripta'
import { parsePath, pathFor, scrollToHash, useLocation } from './router'
import type { Chapter, Section } from './types'

const CHAPTERS = skripta.chapters
const SUFFIX = 'BI-KAB · Skripta'

/**
 * Sidebar outline. Chapters link to their landing page (`/chap-1`: intro + list of sections).
 * One-page chapters (no sections — glossary, cheat sheet) get one pseudo-section with the chapter id,
 * so reading progress (`ReadMarker`) works for them too.
 */
const NAV: NavChapter[] = CHAPTERS.map((c) => ({
  number: c.number,
  title: c.title,
  href: pathFor(c.id),
  sections:
    c.sections.length > 0
      ? c.sections.map((s) => ({ id: s.id, number: s.number, title: s.title, href: pathFor(c.id, s.id) }))
      : [{ id: c.id, number: c.number, title: c.title, href: pathFor(c.id) }],
}))

const SEARCH = buildKabSearch(CHAPTERS)

/** Reading order for prev / next: chapter landing, then its sections. */
const PAGES: (PageLink & { key: string })[] = CHAPTERS.flatMap((c) => [
  { key: c.id, href: pathFor(c.id), title: `${c.number}. ${c.title}` },
  ...c.sections.map((s) => ({ key: `${c.id}/${s.id}`, href: pathFor(c.id, s.id), title: `${s.number} ${s.title}` })),
])

function neighbours(key: string) {
  const i = PAGES.findIndex((p) => p.key === key)
  return { prev: i > 0 ? PAGES[i - 1] : null, next: i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : null }
}

function useTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX
  }, [title])
}

function Home() {
  useTitle('')
  const first = CHAPTERS[0]
  return (
    <Page>
      <Comics items={XKCD} label="xkcd o kryptografii" credit={
          <>
            Komiksy <a href="https://xkcd.com/">xkcd</a> od Randalla Munroea, licence{' '}
            <a href="https://creativecommons.org/licenses/by-nc/2.5/">CC BY-NC 2.5</a>.
          </>
        } />
      <header className="sk-doc-h">
        <p className="sk-eyebrow">BI-KAB · FIT ČVUT</p>
        <h1>{skripta.subtitle ?? 'Kryptografie a bezpečnost'}</h1>
        <p className="sk-lede">
          Skripta k předmětu BI-KAB: od modulární aritmetiky přes klasické, blokové a proudové šifry až po RSA, eliptické křivky a PKI. S
          interaktivními ukázkami a příklady z testů.
        </p>
        {first && (
          <div className="sk-actions">
            <Link className="sk-btn" href={pathFor(first.id)}>
              Začít číst
            </Link>
          </div>
        )}
      </header>
      <h2>Kapitoly</h2>
      <ChapterList chapters={NAV} />
    </Page>
  )
}

function SectionRows({ chapter }: { chapter: Chapter }) {
  const prog = useProgress()
  return (
    <Rows
      items={chapter.sections.map((s) => ({
        key: s.id,
        href: pathFor(chapter.id, s.id),
        num: s.number,
        title: s.title,
        done: !!prog.read[s.id],
        aside: prog.read[s.id] ? <Icon name="check" /> : undefined,
      }))}
    />
  )
}

function ChapterPage({ chapter }: { chapter: Chapter }) {
  useTitle(`${chapter.number}. ${chapter.title}`)
  const intro = chapter.intro ?? []
  const onePage = chapter.sections.length === 0
  const { prev, next } = neighbours(chapter.id)
  const toc = tocEntries(chapter.id, intro)
  return (
    <>
      <Page>
        <DocHeader
          eyebrow="Kapitola"
          number={chapter.number}
          title={chapter.title}
          meta={
            onePage
              ? [{ icon: 'clock', label: `${readingMinutes(intro)} min čtení` }]
              : [{ icon: 'list', label: plural(chapter.sections.length, ['sekce', 'sekce', 'sekcí']) }]
          }
        />
        <Blocks blocks={intro} secId={chapter.id} />
        {!onePage && (
          <>
            <h2>Sekce</h2>
            <SectionRows chapter={chapter} />
          </>
        )}
        {onePage && <ReadMarker sectionId={chapter.id} />}
        <PrevNext prev={prev} next={next} />
      </Page>
      {toc.length > 0 && <Toc entries={toc} />}
    </>
  )
}

function SectionPage({ chapter, section }: { chapter: Chapter; section: Section }) {
  useTitle(`${section.number} ${section.title}`)
  const { prev, next } = neighbours(`${chapter.id}/${section.id}`)
  return (
    <>
      <Page>
        <DocHeader
          eyebrow={
            <Link href={pathFor(chapter.id)}>
              Kapitola {chapter.number} · {chapter.title}
            </Link>
          }
          number={section.number}
          title={section.title}
          meta={[{ icon: 'clock', label: `${readingMinutes(section.blocks)} min čtení` }]}
        />
        <Blocks blocks={section.blocks} secId={section.id} />
        <ReadMarker sectionId={section.id} />
        <PrevNext prev={prev} next={next} />
      </Page>
      <Toc entries={tocEntries(section.id, section.blocks)} />
    </>
  )
}

function NotFound({ path }: { path: string }) {
  useTitle('Stránka nenalezena')
  const first = CHAPTERS[0]
  return (
    <Page>
      <DocHeader title="Stránka nenalezena" />
      <p>
        Adresa <code>{path}</code> neexistuje.
      </p>
      {first && (
        <p>
          <Link href={pathFor(first.id)}>Zpět na začátek</Link>
        </p>
      )}
    </Page>
  )
}

function Content() {
  const { pathname } = useLocation()
  const route = parsePath(pathname)
  if (route.kind === 'home') return <Home />
  if (route.kind === 'notFound') return <NotFound path={route.path} />
  const chapter = CHAPTERS.find((c) => c.id === route.chapterId)
  if (!chapter) return <NotFound path={pathname} />
  if (route.kind === 'chapter') return <ChapterPage key={chapter.id} chapter={chapter} />
  const section = chapter.sections.find((s) => s.id === route.sectionId)
  if (!section) return <NotFound path={pathname} />
  return <SectionPage key={section.id} chapter={chapter} section={section} />
}

export default function App() {
  // Deep link with #anchor (search results, shared links): scroll once the page has rendered.
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash.slice(1))
  }, [])
  return (
    <KabProvider>
      <Shell nav={NAV} search={SEARCH}>
        <Content />
      </Shell>
    </KabProvider>
  )
}
