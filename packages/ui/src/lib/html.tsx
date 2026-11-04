'use client'
import type { ElementType } from 'react'
import { useSkripta } from './context'

/** Renders an `html` content string through the course's `renderHtml` (KaTeX-aware in KAB). */
export function Html({ html, as = 'span', className, id, label }: { html: string; as?: ElementType; className?: string; id?: string; label?: boolean }) {
  const { renderHtml } = useSkripta()
  return <>{renderHtml({ html, as, className, id, label })}</>
}

/** True when the html contains block-level markup that cannot live inside <p>. */
export const hasBlockHtml = (html: string) => /<(ul|ol|p|div|table|pre|blockquote|h[1-6])\b/i.test(html)
