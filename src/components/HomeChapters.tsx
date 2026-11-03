'use client'
import Link from 'next/link'
import type { NavChapter } from '@/lib/content'
import { useProgress } from '@/lib/progress'

export function HomeChapters({ chapters }: { chapters: (NavChapter & { summary: string })[] }) {
  const prog = useProgress()
  return (
    <ul className="rows">
      {chapters.map((c) => {
        const read = c.sections.filter((s) => prog.read[s.id]).length
        const firstUnread = c.sections.findIndex((s) => !prog.read[s.id])
        const qids = c.sections.flatMap((s) => s.qids)
        const ok = qids.filter((id) => prog.answers[id]?.ok).length
        return (
          <li key={c.number}>
            <Link className="row" href={`/kapitola/${c.number}/${firstUnread > 0 ? firstUnread + 1 : 1}`}>
              <span className="num">{c.number}</span>
              <span className="row-t">{c.title}</span>
              <span className={`prog${read === c.sections.length ? ' done' : ''}`} title={`${ok}/${qids.length} otázek správně`}>
                {read}/{c.sections.length}
              </span>
              <span className="row-d">{c.summary}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
