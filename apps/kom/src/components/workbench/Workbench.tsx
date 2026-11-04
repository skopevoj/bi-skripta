'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '../Icon'
import { PdfPage } from '../pdf/PdfPage'
import { useWorkbench, type SourceView } from './WorkbenchProvider'

function SourcePane() {
  const wb = useWorkbench()
  const src = wb.source
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [found, setFound] = useState<boolean | null>(null)
  const [pageIn, setPageIn] = useState('1')

  useEffect(() => {
    if (src?.kind === 'pdf') {
      setPage(src.page)
      setPageIn(String(src.page))
      setFound(null)
    }
  }, [src])

  const go = (p: number) => {
    const n = Math.min(Math.max(1, p), pages ?? 9999)
    setPage(n)
    setPageIn(String(n))
  }

  const back = () => {
    const el = wb.anchor.current
    if (!el || !document.contains(el)) return
    if (matchMedia('(max-width: 820px)').matches) wb.close()
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.remove('pulse')
    void el.offsetWidth
    el.classList.add('pulse')
  }

  const quotes = src?.kind === 'pdf' && page === src.page ? src.quotes ?? [] : []

  return (
    <div className="pane on" aria-label="Zdroj">
      {!src ? (
        <div className="sv-stage">
          <p className="pg-msg">Klikni na odkaz na slajd (např. „P2 · 18“) a otevře se tady.</p>
        </div>
      ) : src.kind === 'pdf' ? (
        <>
          <div className="sv-bar">
            {src.href ? (
              <Link href={`${src.href}?page=${page}`} title="Otevřít v knihovně přednášek" style={{ color: 'var(--ink-2)', fontSize: 14 }}>
                {src.title}
              </Link>
            ) : (
              <span>{src.title}</span>
            )}
            <span className="sp" />
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
              <span>/ {pages ?? '…'}</span>
              <button type="button" aria-label="Další strana" onClick={() => go(page + 1)}>
                <Icon name="r" />
              </button>
            </div>
          </div>
          <div className="sv-stage">
            <PdfPage file={src.file} page={page} quotes={quotes} onPages={setPages} onFound={setFound} />
            {(src.quotes?.length || wb.anchor.current) && (
              <div className="quote">
                {src.quotes?.map((q, i) => (
                  <div key={i}>„{q}“</div>
                ))}
                {found === false && page === src.page && (
                  <small style={{ color: 'var(--ink-3)' }}>Citaci se na stránce nepodařilo zvýraznit.</small>
                )}
                {wb.anchor.current && (
                  <small>
                    <button className="lnk" type="button" onClick={back}>
                      ← Zpět na místo v textu
                    </button>
                  </small>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <SourceImage src={src} back={wb.anchor.current ? back : undefined} />
      )}
    </div>
  )
}

function SourceImage({ src, back }: { src: Extract<SourceView, { kind: 'img' }>; back?: () => void }) {
  return (
    <>
      <div className="sv-bar">
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.label}</span>
        <span className="sp" />
        <a href={src.src} target="_blank" rel="noopener noreferrer">
          Otevřít obrázek
        </a>
      </div>
      <div className="sv-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img-src" src={src.src} alt={src.label} />
        <div className="quote">
          {src.url && (
            <small>
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                Kde to najdeš online
              </a>
            </small>
          )}
          {back && (
            <small>
              <button className="lnk" type="button" onClick={back}>
                ← Zpět na místo v textu
              </button>
            </small>
          )}
        </div>
      </div>
    </>
  )
}

export function Workbench() {
  const wb = useWorkbench()
  const grip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const g = grip.current
    if (!g) return
    let drag = false
    const down = (e: PointerEvent) => {
      drag = true
      g.classList.add('drag')
      g.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const w = Math.min(Math.max(window.innerWidth - e.clientX, 360), window.innerWidth * 0.62)
      document.documentElement.style.setProperty('--wb-w', `${w}px`)
    }
    const up = () => {
      drag = false
      g.classList.remove('drag')
    }
    g.addEventListener('pointerdown', down)
    g.addEventListener('pointermove', move)
    g.addEventListener('pointerup', up)
    g.addEventListener('pointercancel', up)
    return () => {
      g.removeEventListener('pointerdown', down)
      g.removeEventListener('pointermove', move)
      g.removeEventListener('pointerup', up)
      g.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <aside className="wb" aria-label="Pracovní panel" aria-hidden={!wb.open}>
      <div className="grip" ref={grip} />
      <div className="wb-h">
        <span className="handle" onClick={wb.close} />
        <div className="tabs">
          <button type="button" aria-selected="true">
            <Icon name="slides" />
            Zdroj
          </button>
        </div>
        <span className="sp" />
        <button className="icon-btn" type="button" aria-label="Zavřít panel" title="Zavřít (Esc)" onClick={wb.close}>
          <Icon name="x" />
        </button>
      </div>
      <SourcePane />
    </aside>
  )
}
