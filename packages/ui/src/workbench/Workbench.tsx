'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { SourceView } from '../lib/config'
import { Link, useSkripta } from '../lib/context'
import { Icon, type IconName } from '../lib/icons'
import { useWorkbench } from './context'
import { PdfPage, setPdfWorker } from './PdfPage'

export type WorkbenchTab = {
  id: string
  label: string
  icon?: IconName
  /** Tab body (fills the panel; scroll inside). */
  render: () => ReactNode
  /** Header text when this is the only / active tab (kicker + title). */
  heading?: () => ReactNode
}

function SourceHeading() {
  const { source } = useWorkbench()
  if (!source) return <b className="sk-pn-title">Zdroj</b>
  const kicker = source.kind === 'pdf' ? (source.kicker ?? 'PDF') : 'Obrázek'
  const title = source.kind === 'pdf' ? source.title : source.label
  return (
    <>
      <span className="sk-pn-k">
        <Icon name={source.kind === 'pdf' ? 'slides' : 'img'} />
        {kicker}
      </span>
      <b className="sk-pn-title">{title}</b>
    </>
  )
}

function PdfSource({ src }: { src: Extract<SourceView, { kind: 'pdf' }> }) {
  const wb = useWorkbench()
  const [page, setPage] = useState(src.page)
  const [pages, setPages] = useState<number | null>(null)
  const [found, setFound] = useState<boolean | null>(null)

  useEffect(() => {
    setPage(src.page)
    setFound(null)
  }, [src])

  const go = (p: number) => setPage(Math.min(Math.max(1, p), pages ?? 9999))
  const quotes = page === src.page ? (src.quotes ?? []) : []

  return (
    <>
      <PdfPage file={src.file} page={page} quotes={quotes} onPages={setPages} onFound={setFound} />
      <div className="sk-pager">
        <button type="button" className="sk-ib sm" aria-label="Předchozí slajd" onClick={() => go(page - 1)} disabled={page <= 1}>
          <Icon name="l" />
        </button>
        <span className="sk-pg-n">
          <b>{page}</b> / {pages ?? '…'}
        </span>
        <button type="button" className="sk-ib sm" aria-label="Další slajd" onClick={() => go(page + 1)} disabled={pages !== null && page >= pages}>
          <Icon name="r" />
        </button>
        <span className="sk-sp" />
        {src.href ? (
          <Link href={`${src.href}?page=${page}`} className="sk-lnk">
            Otevřít celou přednášku
            <Icon name="ext" />
          </Link>
        ) : (
          <a href={src.file} target="_blank" rel="noopener noreferrer" className="sk-lnk">
            Otevřít PDF
            <Icon name="ext" />
          </a>
        )}
      </div>
      {quotes.length > 0 && (
        <div className="sk-quotes">
          <p className="sk-label">Citace z tohoto slajdu</p>
          <ul>
            {quotes.map((q, i) => (
              <li key={i}>„{q}“</li>
            ))}
          </ul>
          {found === false && <p className="sk-pop-n">Citaci se na stránce nepodařilo zvýraznit.</p>}
        </div>
      )}
      {wb.anchor.current && (
        <button type="button" className="sk-lnk sk-back" onClick={wb.back}>
          <Icon name="back" />
          Zpět na místo v textu
        </button>
      )}
    </>
  )
}

function ImgSource({ src }: { src: Extract<SourceView, { kind: 'img' }> }) {
  const wb = useWorkbench()
  return (
    <>
      <div className="sk-slide img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src.src} alt={src.label} />
      </div>
      <div className="sk-pager">
        <a href={src.src} target="_blank" rel="noopener noreferrer" className="sk-lnk">
          Otevřít obrázek
          <Icon name="ext" />
        </a>
        {src.url && (
          <a href={src.url} target="_blank" rel="noopener noreferrer" className="sk-lnk">
            Kde to najdeš online
            <Icon name="ext" />
          </a>
        )}
      </div>
      {wb.anchor.current && (
        <button type="button" className="sk-lnk sk-back" onClick={wb.back}>
          <Icon name="back" />
          Zpět na místo v textu
        </button>
      )}
    </>
  )
}

/** Source viewer: PDF page with the cited quote highlighted, pager, quotes, „Zpět na místo v textu“. */
export function SourcePane() {
  const { source } = useWorkbench()
  if (!source) return <p className="sk-pg-msg">Klikni na odkaz na slajd (např. „P2 · 18“) a otevře se tady.</p>
  return source.kind === 'pdf' ? <PdfSource src={source} /> : <ImgSource src={source} />
}

export const sourceTab: WorkbenchTab = { id: 'source', label: 'Zdroj', icon: 'slides', render: () => <SourcePane />, heading: () => <SourceHeading /> }

/**
 * Right panel (bottom sheet on phones). Tabs: default just „Zdroj“; courses add their own
 * (OOP: code editor) — `tabs={[editorTab, sourceTab]}`. Resizable by dragging the left edge.
 */
export function Workbench({ tabs = [sourceTab], label = 'Pracovní panel' }: { tabs?: WorkbenchTab[]; label?: string }) {
  const wb = useWorkbench()
  const { pdfWorker } = useSkripta()
  const grip = useRef<HTMLDivElement>(null)
  const active = tabs.find((t) => t.id === wb.tab) ?? tabs[0]!

  useEffect(() => {
    if (pdfWorker) setPdfWorker(pdfWorker)
  }, [pdfWorker])

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
      document.documentElement.style.setProperty('--pn-w', `${Math.round(w)}px`)
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
    <aside className="sk-panel" aria-label={label} aria-hidden={!wb.open} inert={!wb.open || undefined}>
      <div className="sk-grip" ref={grip} aria-hidden="true" />
      <div className="sk-pn-h">
        <span className="sk-handle" aria-hidden="true" onClick={wb.close} />
        {tabs.length > 1 && (
          <div className="sk-seg sk-pn-tabs" role="tablist">
            {tabs.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={t.id === active.id} aria-pressed={t.id === active.id} onClick={() => wb.setTab(t.id)}>
                {t.icon && <Icon name={t.icon} />}
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="sk-pn-tt">{tabs.length === 1 && (active.heading ? active.heading() : <b className="sk-pn-title">{active.label}</b>)}</div>
        <button type="button" className="sk-ib sk-pn-x" aria-label="Zavřít panel" title="Zavřít (Esc)" onClick={wb.close}>
          <Icon name="x" />
        </button>
      </div>
      {tabs.length > 1 && active.heading && <div className="sk-pn-sub">{active.heading()}</div>}
      {tabs.map((t) => (
        <div key={t.id} className="sk-pn-b" role={tabs.length > 1 ? 'tabpanel' : undefined} hidden={t.id !== active.id} data-pdf-scroll={t.id === 'source' || undefined}>
          {t.render()}
        </div>
      ))}
    </aside>
  )
}
