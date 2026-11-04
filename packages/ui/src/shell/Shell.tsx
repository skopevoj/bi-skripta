'use client'
import { useEffect, useState, type ReactNode } from 'react'
import type { NavChapter } from '../content/types'
import { Link, useSkripta } from '../lib/context'
import { Icon, IconSprite } from '../lib/icons'
import type { SearchItem } from '../lib/search'
import { useWorkbench } from '../workbench/context'
import { REPO_URL } from '../courses'
import { CourseSwitcher } from './CourseSwitcher'
import { Search } from './Search'
import { Settings, ThemeToggle } from './Settings'
import { Sidebar, type SideLink } from './Sidebar'

export type ShellTab = {
  href: string
  label: string
  /** Path prefixes that mark the tab current ("/" matches only the home page). Default: [href]. */
  match?: string[]
}

export type ShellProps = {
  /** Chapter outline (see `navChapters`). */
  nav: NavChapter[]
  /** Product tabs under the top bar (Skripta · Banka otázek · Testy · Slajdy). */
  tabs?: ShellTab[]
  /** Links at the bottom of the sidebar (practice, slides). */
  links?: SideLink[]
  /** Search index (see `buildSearchIndex`). Omit to hide search. */
  search?: SearchItem[]
  /** Right panel, usually <Workbench/> from `@skripta/ui/workbench`. */
  panel?: ReactNode
  /** Extra sections of the settings popover (e.g. KOM diagram style). */
  settings?: ReactNode
  /** Custom logo (default: the accent square). */
  logo?: ReactNode
  /** Extra content at the right of the top bar (before search). */
  topExtra?: ReactNode
  home?: string
  /** Current section id when the pathname is not enough (one-page chapters). */
  currentSection?: string
  /** GitHub link in the top bar (default `REPO_URL` from courses.ts; null hides it). */
  repo?: string | null
  children: ReactNode
}

const strip = (h: string) => h.split('#')[0]!.split('?')[0]!
function tabOn(t: ShellTab, path: string) {
  return (t.match ?? [strip(t.href)]).some((m) => (m === '/' ? path === '/' : path === m || path.startsWith(m.endsWith('/') ? m : m + '/')))
}

/**
 * App frame (b-reference): top bar with course switcher, search, theme, settings; product tabs;
 * sidebar (drawer on phones) | page content (+ <Toc>) | panel (bottom sheet on phones).
 */
export function Shell({ nav, tabs, links, search, panel, settings, logo, topExtra, home = '/', currentSection, repo = REPO_URL, children }: ShellProps) {
  const { pathname } = useSkripta()
  const wb = useWorkbench()
  const [menu, setMenu] = useState(false)

  // close the drawer on navigation and when the panel opens
  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    if (wb.open) setMenu(false)
  }, [wb.open])
  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <div className="sk-app" data-panel={wb.open ? 'open' : undefined} data-menu={menu ? 'open' : undefined}>
      <IconSprite />
      <a className="sk-skip" href="#top">
        Přeskočit na obsah
      </a>
      <header className="sk-top">
        <div className="sk-top-in">
          <button type="button" className="sk-ib sk-menu" aria-label="Kapitoly" aria-expanded={menu} onClick={() => setMenu(!menu)}>
            <Icon name={menu ? 'x' : 'menu'} />
          </button>
          <CourseSwitcher logo={logo} home={home} />
          <span className="sk-sp" />
          {topExtra}
          {search && <Search items={search} />}
          {repo && (
            <a className="sk-ib sk-repo" href={repo} target="_blank" rel="noopener noreferrer" aria-label="Zdrojový kód na GitHubu" title="Zdrojový kód na GitHubu">
              <Icon name="github" />
            </a>
          )}
          <ThemeToggle />
          <Settings>{settings}</Settings>
        </div>
        {tabs && tabs.length > 0 && (
          <nav className="sk-tabs" aria-label="Sekce aplikace">
            {tabs.map((t) => (
              <Link key={t.href} href={t.href} aria-current={tabOn(t, pathname) ? 'page' : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <div className="sk-layout">
        <Sidebar nav={nav} links={links} currentSection={currentSection} open={menu} />
        {children}
        {panel}
      </div>
      <div
        className="sk-scrim"
        aria-hidden="true"
        onClick={() => {
          setMenu(false)
          wb.close()
        }}
      />
    </div>
  )
}
