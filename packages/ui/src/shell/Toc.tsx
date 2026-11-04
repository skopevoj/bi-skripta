'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { docView } from '../content/Cite'
import type { TocEntry } from '../content/helpers'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { useWorkbench } from '../workbench/context'

/** „Na této stránce“ rail with scroll-spy; `docs` → buttons opening the slides in the source panel. */
export function Toc({ entries, docs, children, title = 'Na této stránce' }: { entries: TocEntry[]; docs?: string[]; children?: ReactNode; title?: string }) {
  const wb = useWorkbench()
  const cfg = useSkripta()
  const [cur, setCur] = useState(-1)

  useEffect(() => {
    const spy = () => {
      const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-h')) || 100
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

  const docInfos = (docs ?? []).map((id) => cfg.docs.find((d) => d.id === id)).filter((d) => !!d)

  return (
    <aside className="sk-toc" aria-label={title}>
      {entries.length > 0 && (
        <>
          <p className="sk-label">{title}</p>
          <ol>
            {entries.map((e, i) => (
              <li key={e.id}>
                <a href={`#${e.id}`} className={i === cur ? 'on' : undefined} aria-current={i === cur ? 'location' : undefined}>
                  {e.title}
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
      {(docInfos.length > 0 || children) && (
        <div className="sk-toc-act">
          {docInfos.map((d) => (
            <button key={d.id} type="button" className="sk-open-doc" onClick={() => wb.openSource(docView(d, 1, cfg))}>
              <Icon name="slides" />
              <span>Slajdy: {d.long}</span>
            </button>
          ))}
          {children}
        </div>
      )}
    </aside>
  )
}
