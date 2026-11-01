'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Icon } from '../Icon'
import { PdfPage } from './PdfPage'

export function PdfViewer({ file, pages: pagesHint }: { file: string; pages: number }) {
  const sp = useSearchParams()
  const router = useRouter()
  const path = usePathname()
  const qPage = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1)
  const quote = sp.get('q') || ''
  const [page, setPage] = useState(qPage)
  const [pageIn, setPageIn] = useState(String(qPage))
  const [pages, setPages] = useState(pagesHint)

  useEffect(() => {
    setPage(qPage)
    setPageIn(String(qPage))
  }, [qPage])

  const go = (p: number) => {
    const n = Math.min(Math.max(1, p), pages)
    setPage(n)
    setPageIn(String(n))
    const q = new URLSearchParams({ page: String(n) })
    if (quote && n === qPage) q.set('q', quote)
    router.replace(`${path}?${q}`, { scroll: false })
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
    <div className="pdf-full">
      <div className="pdf-bar">
        <div className="pnav">
          <button type="button" aria-label="Předchozí strana" onClick={() => go(page - 1)}>
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
          <span>/ {pages}</span>
          <button type="button" aria-label="Další strana" onClick={() => go(page + 1)}>
            <Icon name="r" />
          </button>
        </div>
        <span className="sp" />
        <a className="lnk" href={file} target="_blank" rel="noopener noreferrer">
          Stáhnout PDF
        </a>
      </div>
      <PdfPage file={file} page={page} quotes={quote && page === qPage ? [quote] : []} onPages={setPages} />
      {quote && page === qPage && <p className="quote">„{quote}“</p>}
    </div>
  )
}
