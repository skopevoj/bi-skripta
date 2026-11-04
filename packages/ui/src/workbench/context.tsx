'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { SourceView } from '../lib/config'

export type { SourceView }

export type WorkbenchPayload = { data: unknown; n: number }

export type WorkbenchCtx = {
  open: boolean
  /** Active tab id (null = the Workbench's first tab). */
  tab: string | null
  setTab: (id: string) => void
  /** Open the panel on a tab; `data` is delivered to the tab via `payload(id)` (n increments on each send). */
  openTab: (id: string, data?: unknown) => void
  payload: (id: string) => WorkbenchPayload | undefined
  close: () => void
  /** Show a source (PDF page / image) in the "source" tab; `anchor` = the clicked citation. */
  openSource: (v: SourceView, anchor?: HTMLElement | null) => void
  source: SourceView | null
  /** The clicked citation badge (for "Zpět na místo v textu"). */
  anchor: RefObject<HTMLElement | null>
  /** Scroll back to the cited block and pulse it. */
  back: () => void
}

/** Elements a citation highlights as "the place in the text": the enclosing block, else the paragraph. */
const BLOCK_SEL = '[data-sk-anchor], .sk-box, .sk-tbl-w, .sk-fig-w, .sk-fig, .sk-q, .sk-lab'
const TEXT_SEL = '.sk-code, li, p, .sk-pb'
const anchorOf = (el: HTMLElement) => (el.closest(BLOCK_SEL) ?? el.closest(TEXT_SEL)) as HTMLElement | null

const noop = () => {}
const FALLBACK: WorkbenchCtx = {
  open: false,
  tab: null,
  setTab: noop,
  openTab: noop,
  payload: () => undefined,
  close: noop,
  openSource: noop,
  source: null,
  anchor: { current: null },
  back: noop,
}

const WB = createContext<WorkbenchCtx>(FALLBACK)

export function useWorkbench(): WorkbenchCtx {
  return useContext(WB)
}

function clearMarks() {
  document.querySelectorAll('.sk-cite.on').forEach((c) => c.classList.remove('on'))
  document.querySelectorAll('.sk-src-anchor').forEach((c) => c.classList.remove('sk-src-anchor'))
}

export function WorkbenchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<string | null>(null)
  const [source, setSource] = useState<SourceView | null>(null)
  const [payloads, setPayloads] = useState<Record<string, WorkbenchPayload>>({})
  const anchor = useRef<HTMLElement | null>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) clearMarks()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      const t = e.target as HTMLElement | null
      if (t?.closest?.('.sk-search, .sk-pop, [role="dialog"]:not(.sk-panel)')) return
      setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const openTab = useCallback((id: string, data?: unknown) => {
    if (data !== undefined) setPayloads((p) => ({ ...p, [id]: { data, n: (p[id]?.n ?? 0) + 1 } }))
    setTab(id)
    setOpen(true)
  }, [])

  const openSource = useCallback((v: SourceView, el?: HTMLElement | null) => {
    clearMarks()
    if (el) {
      el.classList.add('on')
      anchor.current = el
      anchorOf(el)?.classList.add('sk-src-anchor')
    } else anchor.current = null
    setSource(v)
    setTab('source')
    setOpen(true)
  }, [])

  const back = useCallback(() => {
    const el = anchor.current
    if (!el || !document.contains(el)) return
    const block = anchorOf(el) ?? el
    if (matchMedia('(max-width: 820px)').matches) setOpen(false)
    block.scrollIntoView({ behavior: 'smooth', block: 'center' })
    block.classList.remove('sk-pulse')
    void block.offsetWidth
    block.classList.add('sk-pulse')
  }, [])

  const payload = useCallback((id: string) => payloads[id], [payloads])

  const value = useMemo<WorkbenchCtx>(
    () => ({ open, tab, setTab, openTab, payload, close, openSource, source, anchor, back }),
    [open, tab, openTab, payload, close, openSource, source, back],
  )
  return <WB.Provider value={value}>{children}</WB.Provider>
}
