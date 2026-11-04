'use client'
import type { NavChapter } from '../content/types'
import { Link, useSkripta } from '../lib/context'
import { Icon, type IconName } from '../lib/icons'
import { useProgress } from '../lib/progress'

export type SideLink = { href: string; label: string; icon?: IconName; count?: number; external?: boolean }

const strip = (h: string) => h.split('#')[0]!.split('?')[0]!

/** Which chapter / section is current for a pathname. */
export function currentOf(nav: NavChapter[], pathname: string, currentSection?: string) {
  for (const c of nav) {
    const s = c.sections.find((x) => (currentSection ? x.id === currentSection : strip(x.href) === pathname))
    if (s) return { chapter: c.number, section: s.id }
  }
  const c = nav.find((x) => strip(x.href) === pathname || pathname.startsWith(strip(x.href) + '/'))
  return { chapter: c?.number, section: currentSection }
}

/** Chapter navigation with reading progress; the current chapter expands into its sections. */
export function Sidebar({
  nav,
  links,
  title = 'Kapitoly',
  linksTitle = 'Procvičování',
  currentSection,
  open,
}: {
  nav: NavChapter[]
  links?: SideLink[]
  title?: string
  linksTitle?: string
  currentSection?: string
  /** mobile drawer state */
  open?: boolean
}) {
  const { pathname } = useSkripta()
  const prog = useProgress()
  const cur = currentOf(nav, pathname, currentSection)
  return (
    <nav className="sk-side" aria-label="Kapitoly" data-open={open || undefined}>
      {nav.length > 0 && (
        <>
          <p className="sk-label">{title}</p>
          <ol className="sk-chaps">
            {nav.map((c) => {
              const done = c.sections.filter((s) => prog.read[s.id]).length
              const total = c.sections.length
              const on = c.number === cur.chapter
              return (
                <li key={c.number} className={`sk-chap${on ? ' on' : ''}${done === total && total > 0 ? ' done' : ''}`}>
                  <Link href={c.href} aria-current={on ? 'true' : undefined}>
                    <span className="sk-num">{c.number}</span>
                    <span className="sk-ct">{c.title}</span>
                    <span className="sk-prog" title={`Přečteno ${done} z ${total} sekcí`}>
                      {done}/{total}
                    </span>
                  </Link>
                  {on && total > 1 && (
                    <ol className="sk-secs">
                      {c.sections.map((s) => {
                        const now = s.id === cur.section
                        return (
                          <li key={s.id}>
                            <Link href={s.href} className={now ? 'now' : prog.read[s.id] ? 'read' : undefined} aria-current={now ? 'page' : undefined}>
                              <span className="sk-ct">{s.title}</span>
                              {prog.read[s.id] && !now && <Icon name="check" className="ok" />}
                            </Link>
                          </li>
                        )
                      })}
                    </ol>
                  )}
                </li>
              )
            })}
          </ol>
        </>
      )}
      {links && links.length > 0 && (
        <div className="sk-side-foot">
          <p className="sk-label">{linksTitle}</p>
          {links.map((l) =>
            l.external ? (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.icon && <Icon name={l.icon} />}
                <span className="sk-ct">{l.label}</span>
                <Icon name="ext" className="sk-ext" />
              </a>
            ) : (
              <Link key={l.href} href={l.href} className={pathname.startsWith(strip(l.href)) ? 'now' : undefined}>
                {l.icon && <Icon name={l.icon} />}
                <span className="sk-ct">{l.label}</span>
                {l.count !== undefined && <span className="sk-cnt">{l.count}</span>}
              </Link>
            ),
          )}
        </div>
      )}
    </nav>
  )
}
