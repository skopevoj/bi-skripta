'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { DocId } from '@content/types'

export type SourceView =
  | { kind: 'pdf'; file: string; title: string; page: number; quotes?: string[]; doc?: DocId; href?: string }
  | { kind: 'img'; src: string; label: string; url?: string }

type Ctx = {
  open: boolean
  close: () => void
  openSource: (v: SourceView, anchor?: HTMLElement | null) => void
  source: SourceView | null
  setSource: (v: SourceView) => void
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
  const [source, setSource] = useState<SourceView | null>(null)
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

  const openSource = useCallback((v: SourceView, el?: HTMLElement | null) => {
    document.querySelectorAll('.cite.on').forEach((c) => c.classList.remove('on'))
    if (el) {
      el.classList.add('on')
      anchor.current = el
    } else anchor.current = null
    setSource(v)
    setOpen(true)
  }, [])

  const value = useMemo<Ctx>(
    () => ({ open, close, openSource, source, setSource, anchor }),
    [open, close, openSource, source],
  )
  return <WB.Provider value={value}>{children}</WB.Provider>
}
