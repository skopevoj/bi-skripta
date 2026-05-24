import type { Chapter } from '../types'
import { Link, pathFor } from '../router'
import { SearchBar } from './SearchBar'

export function Sidebar({
  chapters,
  activeChapterId,
  activeSectionId,
}: {
  chapters: Chapter[]
  activeChapterId: string | null
  activeSectionId: string | null
}) {
  return (
    <aside className="lg:sticky lg:top-0 self-start lg:h-screen lg:overflow-y-auto sidebar-scroll border-r border-ink-800 bg-ink-900/60">
      <div className="px-4 pt-5 pb-3">
        <div className="text-lg font-sans font-bold text-ink-100 mb-3">BI-KAB</div>
        <SearchBar chapters={chapters} />
      </div>

      <nav className="pb-8 font-sans">
        {chapters.map((c) => {
          const isActive = activeChapterId === c.id
          return (
            <div key={c.id}>
              <Link
                to={pathFor(c.id)}
                className={
                  'w-full text-left px-4 py-2 text-[14px] flex items-baseline gap-2 transition-colors ' +
                  (isActive
                    ? 'bg-ink-850 text-ink-100 font-semibold'
                    : 'text-ink-300 hover:bg-ink-900 hover:text-ink-100')
                }
              >
                <span className="tabular-nums text-ink-500 w-4 shrink-0">
                  {c.number}
                </span>
                <span className="font-medium">{c.title}</span>
              </Link>
              {isActive &&
                c.sections.map((s) => {
                  const isSecActive = activeSectionId === s.id
                  return (
                    <Link
                      key={s.id}
                      to={pathFor(c.id, s.id)}
                      className={
                        'w-full text-left pl-10 pr-4 py-1.5 text-[13px] flex items-baseline gap-2 transition-colors ' +
                        (isSecActive
                          ? 'bg-ink-850 text-ink-100'
                          : 'text-ink-400 hover:bg-ink-900 hover:text-ink-200')
                      }
                    >
                      <span className="tabular-nums text-ink-600 shrink-0">
                        {s.number}
                      </span>
                      <span className="truncate">{s.title}</span>
                    </Link>
                  )
                })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
