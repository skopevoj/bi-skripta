'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { LectureId } from '@content/types'

export type SourceView =
  | { kind: 'pdf'; file: string; title: string; page: number; quotes?: string[]; lecture?: LectureId; href?: string }
  | { kind: 'img'; src: string; label: string; url?: string }

export type EditorLoad = { code: string; autorun: boolean; n: number }

type Ctx = {
  open: boolean
  tab: 'editor' | 'source'
  setTab: (t: 'editor' | 'source') => void
  close: () => void
  openPanel: (t: 'editor' | 'source') => void
  openEditor: (code?: string, opts?: { autorun?: boolean }) => void
  openSource: (v: SourceView, anchor?: HTMLElement | null) => void
  source: SourceView | null
  setSource: (v: SourceView) => void
  load: EditorLoad | null
  anchor: React.RefObject<HTMLElement | null>
}

const WB = createContext<Ctx | null>(null)

export function useWorkbench(): Ctx {
  const c = useContext(WB)
  if (!c) throw new Error('useWorkbench outside provider')
  return c
}

export function WorkbenchProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'editor' | 'source'>('editor')
  const [source, setSource] = useState<SourceView | null>(null)
  const [load, setLoad] = useState<EditorLoad | null>(null)
  const anchor = useRef<HTMLElement | null>(null)

  useEffect(() => {
    document.body.classList.toggle('wb-open', open)
    if (open) document.body.classList.remove('menu-open')
    if (!open) document.querySelectorAll('.cite.on').forEach((c) => c.classList.remove('on'))
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && document.body.classList.contains('wb-open')) {
        // let an open search dropdown handle Esc first
        if ((e.target as HTMLElement | null)?.closest?.('.search')) return
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const openPanel = useCallback((t: 'editor' | 'source') => {
    setTab(t)
    setOpen(true)
  }, [])

  const openEditor = useCallback((code?: string, opts?: { autorun?: boolean }) => {
    if (code !== undefined) setLoad((l) => ({ code, autorun: !!opts?.autorun, n: (l?.n ?? 0) + 1 }))
    setTab('editor')
    setOpen(true)
  }, [])

  const openSource = useCallback((v: SourceView, el?: HTMLElement | null) => {
    document.querySelectorAll('.cite.on').forEach((c) => c.classList.remove('on'))
    if (el) {
      el.classList.add('on')
      anchor.current = el
    } else anchor.current = null
    setSource(v)
    setTab('source')
    setOpen(true)
  }, [])

  const value = useMemo<Ctx>(
    () => ({ open, tab, setTab, close, openPanel, openEditor, openSource, source, setSource, load, anchor }),
    [open, tab, close, openPanel, openEditor, openSource, source, load],
  )
  return <WB.Provider value={value}>{children}</WB.Provider>
}
