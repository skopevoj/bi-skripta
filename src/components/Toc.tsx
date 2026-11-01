'use client'
import { useEffect, useState } from 'react'
import type { LectureId } from '@content/types'
import { lectureNum, lecturePdf } from '@/lib/meta'
import { Icon } from './Icon'
import { useWorkbench } from './workbench/WorkbenchProvider'

export function Toc({ entries, lecture }: { entries: { id: string; title: string }[]; lecture: LectureId }) {
  const wb = useWorkbench()
  const [cur, setCur] = useState(-1)

  useEffect(() => {
    const spy = () => {
      const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-h')) || 60
      const y = top + 80
      let c = -1
      entries.forEach((e, i) => {
        const el = document.getElementById(e.id)
        if (el && el.getBoundingClientRect().top < y) c = i
      })
      if (c === -1 && entries.length) c = 0
      setCur(c)
    }
    spy()
    addEventListener('scroll', spy, { passive: true })
    return () => removeEventListener('scroll', spy)
  }, [entries])

  return (
    <aside className="toc" aria-label="Na této stránce">
      {entries.length > 0 && (
        <>
          <p>Na této stránce</p>
          <ol>
            {entries.map((e, i) => (
              <li key={e.id}>
                <a href={`#${e.id}`} className={i === cur ? 'on' : undefined}>
                  {e.title}
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
      <div className="toc-act">
        <button type="button" onClick={() => wb.openEditor()}>
          <Icon name="code" />
          Otevřít editor
        </button>
        <button
          type="button"
          onClick={() =>
            wb.openSource({
              kind: 'pdf',
              file: lecturePdf(lecture),
              title: `Přednáška ${lectureNum(lecture)}`,
              page: 1,
              lecture,
              href: `/prednasky/${lecture}`,
            })
          }
        >
          <Icon name="slides" />
          Slajdy přednášky {lectureNum(lecture)}
        </button>
      </div>
    </aside>
  )
}
