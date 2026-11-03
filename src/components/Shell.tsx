'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import type { NavChapter } from '@/lib/content'
import { useProgress } from '@/lib/progress'
import { Icon } from './Icon'
import { Search, type SearchItem } from './Search'
import { Settings } from './Settings'
import { Workbench } from './workbench/Workbench'
import { useWorkbench } from './workbench/WorkbenchProvider'

function toggleTheme() {
  const root = document.documentElement
  const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  root.dataset.theme = cur === 'dark' ? 'light' : 'dark'
  try {
    localStorage.setItem('kom-theme', root.dataset.theme)
  } catch {
    /* ignore */
  }
}

function crumbsFor(path: string, nav: NavChapter[]): { href?: string; label: string }[] {
  const m = path.match(/^\/kapitola\/(\d+)(?:\/(\d+))?/)
  if (m) {
    const c = nav.find((x) => x.number === m[1])
    if (!c) return []
    const s = c.sections[(Number(m[2] || 1) || 1) - 1]
    return [{ href: `/kapitola/${c.number}/1`, label: c.title }, ...(s ? [{ label: s.title }] : [])]
  }
  if (path.startsWith('/otazky')) return [{ label: 'Banka otázek' }]
  if (path.startsWith('/testy/')) return [{ href: '/testy', label: 'Testy' }, { label: 'Test' }]
  if (path.startsWith('/testy')) return [{ label: 'Testy' }]
  const l = path.match(/^\/prednasky\/([PCW][\w-]+)/)
  if (l) return [{ href: '/prednasky', label: 'Slajdy' }, { label: l[1].startsWith('P') ? `Přednáška ${Number(l[1].slice(1, 3))}` : l[1].startsWith('C') ? `Cvičení ${Number(l[1].slice(1, 3))}` : 'Souhrn (Wiki)' }]
  if (path.startsWith('/prednasky')) return [{ label: 'Slajdy' }]
  return []
}

function Sidebar({ nav, path, counts }: { nav: NavChapter[]; path: string; counts: { questions: number; tests: number } }) {
  const prog = useProgress()
  const m = path.match(/^\/kapitola\/(\d+)(?:\/(\d+))?/)
  const curChap = m?.[1]
  const curSec = Number(m?.[2] || 1)
  return (
    <nav className="side" aria-label="Kapitoly">
      <ol>
        {nav.map((c) => {
          const done = c.sections.filter((s) => prog.read[s.id]).length
          const total = c.sections.length
          const on = c.number === curChap
          return (
            <li key={c.number} className={`chap${on ? ' on' : ''}`}>
              <Link href={`/kapitola/${c.number}/1`} aria-current={on ? 'true' : undefined}>
                <span className="num">{c.number}</span>
                <span>{c.title}</span>
                <span className={`prog${done === total ? ' done' : ''}`}>
                  {done}/{total}
                </span>
                {on && (
                  <span className="bar">
                    <i style={{ ['--p' as string]: `${Math.round((done / total) * 100)}%` }} />
                  </span>
                )}
              </Link>
              {on && (
                <ol className="secs">
                  {c.sections.map((s, i) => {
                    const now = i + 1 === curSec
                    return (
                      <li key={s.id}>
                        <Link href={`/kapitola/${c.number}/${i + 1}`} className={now ? 'now' : undefined} aria-current={now ? 'page' : undefined}>
                          {s.title}
                          {prog.read[s.id] && !now && <Icon name="check" />}
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
      <div className="side-foot">
        <Link href="/otazky" className={path.startsWith('/otazky') ? 'now' : undefined}>
          <Icon name="list" />
          Banka otázek<span>{counts.questions}</span>
        </Link>
        <Link href="/testy" className={path.startsWith('/testy') ? 'now' : undefined}>
          <Icon name="clock" />
          Testy nanečisto{counts.tests > 0 && <span>{counts.tests}</span>}
        </Link>
        <Link href="/prednasky" className={path.startsWith('/prednasky') ? 'now' : undefined}>
          <Icon name="file" />
          Slajdy (PDF)<span>24</span>
        </Link>
      </div>
    </nav>
  )
}

export function Shell({
  nav,
  search,
  counts,
  children,
}: {
  nav: NavChapter[]
  search: SearchItem[]
  counts: { questions: number; tests: number }
  children: React.ReactNode
}) {
  const path = usePathname() || '/'
  const crumbs = crumbsFor(path, nav)
  const wb = useWorkbench()

  // close the phone menu on navigation
  useEffect(() => {
    document.body.classList.remove('menu-open')
  }, [path])

  return (
    <>
      <header className="top">
        <button className="icon-btn" id="menuBtn" aria-label="Kapitoly" onClick={() => document.body.classList.toggle('menu-open')}>
          <Icon name="menu" />
        </button>
        <Link className="brand" href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="mark-logo" src="/icon.svg" alt="" width={26} height={26} />
          BI-KOM <small>skripta</small>
        </Link>
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Drobečková navigace">
            {crumbs.flatMap((c, i) => [
              ...(i > 0 ? [<Icon key={`s${i}`} name="chev" />] : []),
              c.href ? (
                <Link key={i} href={c.href}>
                  {c.label}
                </Link>
              ) : (
                <span key={i}>{c.label}</span>
              ),
            ])}
          </nav>
        )}
        <div className="top-r">
          <Search items={search} />
          <button className="icon-btn" aria-label="Světlý / tmavý režim" title="Světlý / tmavý režim" onClick={toggleTheme}>
            <Icon name="moon" className="t-moon" />
            <Icon name="sun" className="t-sun" />
          </button>
          <Settings />
        </div>
      </header>
      <div className="layout">
        <Sidebar nav={nav} path={path} counts={counts} />
        {children}
        <Workbench />
      </div>
      <div className="scrim" onClick={wb.close} />
    </>
  )
}
