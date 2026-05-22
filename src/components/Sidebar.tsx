import type { Chapter } from '../types'

export function Sidebar({
  chapters,
  activeChapterId,
  activeSectionId,
  onSelectChapter,
  onJumpSection,
}: {
  chapters: Chapter[]
  activeChapterId: string | null
  activeSectionId: string | null
  onSelectChapter: (id: string) => void
  onJumpSection: (id: string) => void
}) {
  return (
    <aside className="lg:sticky lg:top-0 self-start lg:h-screen lg:overflow-y-auto sidebar-scroll border-r border-ink-800 bg-ink-900/60">
      <div className="px-4 py-5">
        <div className="text-[10px] tracking-[0.22em] uppercase text-ink-500 font-sans font-semibold">
          Skripta
        </div>
        <div className="mt-1 text-lg font-sans font-bold text-ink-100">BI-KAB</div>
      </div>

      <nav className="pb-8 font-sans">
        {chapters.map((c) => {
          const isActive = activeChapterId === c.id
          return (
            <div key={c.id}>
              <button
                onClick={() => onSelectChapter(c.id)}
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
              </button>
              {isActive &&
                c.sections.map((s) => {
                  const isSecActive = activeSectionId === s.id
                  return (
                    <button
                      key={s.id}
                      onClick={() => onJumpSection(s.id)}
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
                    </button>
                  )
                })}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
