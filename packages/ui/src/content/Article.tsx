'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from '../lib/context'
import { Icon, type IconName } from '../lib/icons'
import { useProgress, useProgressActions } from '../lib/progress'
import type { PageLink } from './helpers'
import type { NavChapter } from './types'

/** Main column: `<main class="sk-content"><div class="sk-doc">…`. Put <Toc> next to it (as a sibling). */
export function Page({ children, wide, className }: { children: ReactNode; wide?: boolean; className?: string }) {
  return (
    <main className="sk-content">
      <article className={['sk-doc', wide && 'wide', className].filter(Boolean).join(' ')} id="top">
        {children}
      </article>
    </main>
  )
}

export type MetaItem = { icon?: IconName; label: ReactNode }

/** Article header: eyebrow („Kapitola 11 · Shrnutí“), number + title, meta chips. */
export function DocHeader({ eyebrow, number, title, meta, children }: { eyebrow?: ReactNode; number?: string; title: ReactNode; meta?: MetaItem[]; children?: ReactNode }) {
  return (
    <header className="sk-doc-h">
      {eyebrow && <p className="sk-eyebrow">{eyebrow}</p>}
      <h1>
        {number && <span className="sn">{number}</span>}
        {title}
      </h1>
      {meta && meta.length > 0 && (
        <p className="sk-meta">
          {meta.map((m, i) => (
            <span key={i}>
              {m.icon && <Icon name={m.icon} />}
              {m.label}
            </span>
          ))}
        </p>
      )}
      {children}
    </header>
  )
}

/** Previous / next cards at the end of a section. */
export function PrevNext({ prev, next }: { prev?: PageLink | null; next?: PageLink | null }) {
  return (
    <nav className="sk-pn" aria-label="Sekce">
      {prev ? (
        <Link href={prev.href} className="prev">
          <small>
            <Icon name="l" />
            Předchozí
          </small>
          <span>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="next">
          <small>
            Další
            <Icon name="r" />
          </small>
          <span>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

/** Marks the section as read once the reader reaches its end. */
export function ReadMarker({ sectionId }: { sectionId: string }) {
  const el = useRef<HTMLDivElement>(null)
  const { markRead } = useProgressActions()
  useEffect(() => {
    const node = el.current
    if (!node) return
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        markRead(sectionId)
        io.disconnect()
      }
    })
    io.observe(node)
    return () => io.disconnect()
  }, [sectionId, markRead])
  return <div ref={el} aria-hidden="true" />
}

export type RowItem = { href: string; num?: ReactNode; title: ReactNode; desc?: ReactNode; aside?: ReactNode; done?: boolean; key?: string }

/** Ruled list of links (home chapters, tests, lectures). */
export function Rows({ items }: { items: RowItem[] }) {
  return (
    <ul className="sk-rows">
      {items.map((it, i) => (
        <li key={it.key ?? it.href ?? i}>
          <Link className="sk-row" href={it.href}>
            <span className="sk-num">{it.num}</span>
            <span className="sk-row-t">{it.title}</span>
            <span className={`sk-prog${it.done ? ' done' : ''}`}>{it.aside}</span>
            {it.desc && <span className="sk-row-d">{it.desc}</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** Chapters with reading progress; each links to its first unread section. */
export function ChapterList({ chapters }: { chapters: NavChapter[] }) {
  const prog = useProgress()
  return (
    <Rows
      items={chapters.map((c) => {
        const read = c.sections.filter((s) => prog.read[s.id]).length
        const first = c.sections.find((s) => !prog.read[s.id]) ?? c.sections[0]
        return {
          key: c.number,
          href: first?.href ?? c.href,
          num: c.number,
          title: c.title,
          aside: `${read}/${c.sections.length}`,
          done: read === c.sections.length && read > 0,
          desc: c.summary,
        }
      })}
    />
  )
}

/** Inline facts row („10 otázek · 20 min“); children are `<li>` items. */
export function Facts({ children }: { children: ReactNode }) {
  return <ul className="sk-facts">{children}</ul>
}
