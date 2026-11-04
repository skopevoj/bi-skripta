'use client'
import { useEffect, useRef } from 'react'
import { markRead } from '@/lib/progress'

/** Marks the section as read once the reader reaches its end. */
export function ReadMarker({ sectionId }: { sectionId: string }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = el.current
    if (!node) return
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        markRead(sectionId)
        io.disconnect()
      }
    })
    io.observe(node)
    return () => io.disconnect()
  }, [sectionId])
  return <div ref={el} aria-hidden="true" />
}
