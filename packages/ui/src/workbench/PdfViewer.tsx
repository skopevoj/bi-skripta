'use client'
import { useEffect, useState } from 'react'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { PdfPage } from './PdfPage'

/** Full-page PDF reader (lecture library). Syncs `?page=` (and highlights `?q=` on that page). Wrap in <Suspense> under Next. */
export function PdfViewer({ file, pages: pagesHint }: { file: string; pages?: number }) {
  const { useSearchParam, navigate, pathname } = useSkripta()
  const qPage = Math.max(1, parseInt(useSearchParam('page') || '1', 10) || 1)
  const quote = useSearchParam('q') || ''
  const [page, setPage] = useState(qPage)
  const [pageIn, setPageIn] = useState(String(qPage))
  const [pages, setPages] = useState(pagesHint ?? 0)

  useEffect(() => {
    setPage(qPage)
    setPageIn(String(qPage))
  }, [qPage])

  const go = (p: number) => {
    const n = Math.min(Math.max(1, p), pages || 9999)
    setPage(n)
    setPageIn(String(n))
    const q = new URLSearchParams({ page: String(n) })
    if (quote && n === qPage) q.set('q', quote)
    navigate(`${pathname}?${q}`, { replace: true, scroll: false })
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input, textarea, select, [contenteditable]')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') go(page + 1)
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(page - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <div className="sk-pdf">
      <div className="sk-pdf-bar">
        <button type="button" className="sk-ib sm" aria-label="Předchozí strana" onClick={() => go(page - 1)} disabled={page <= 1}>
          <Icon name="l" />
        </button>
        <input
          inputMode="numeric"
          aria-label="Strana"
          value={pageIn}
          onChange={(e) => setPageIn(e.target.value)}
          onBlur={() => go(parseInt(pageIn, 10) || page)}
          onKeyDown={(e) => e.key === 'Enter' && go(parseInt(pageIn, 10) || page)}
        />
        <span className="sk-pg-n">/ {pages || '…'}</span>
        <button type="button" className="sk-ib sm" aria-label="Další strana" onClick={() => go(page + 1)} disabled={!!pages && page >= pages}>
          <Icon name="r" />
        </button>
        <span className="sk-sp" />
        <a className="sk-lnk" href={file} target="_blank" rel="noopener noreferrer">
          Stáhnout PDF
          <Icon name="ext" />
        </a>
      </div>
      <PdfPage file={file} page={page} quotes={quote && page === qPage ? [quote] : []} onPages={setPages} />
      {quote && page === qPage && (
        <div className="sk-quotes">
          <ul>
            <li>„{quote}“</li>
          </ul>
        </div>
      )}
    </div>
  )
}
