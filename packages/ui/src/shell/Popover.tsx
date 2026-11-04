'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Trigger + popover; closes on outside click and Esc. */
export function usePopover() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        root.current?.querySelector<HTMLElement>('[aria-expanded]')?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  return { open, setOpen, root }
}

export function PopoverWrap({ root, className, children }: { root: React.RefObject<HTMLDivElement | null>; className?: string; children: ReactNode }) {
  return (
    <div ref={root} className={['sk-pop-w', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}
