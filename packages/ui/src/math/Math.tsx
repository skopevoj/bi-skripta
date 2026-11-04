'use client'

import { useMemo } from 'react'
import { renderMathInHtml, renderTex, type MathHtmlOptions, type TexOptions } from './render'

export type TexProps = TexOptions & {
  /** LaTeX bez dolarů, např. `a^{-1} \bmod n`. */
  tex: string
  /** Blokový (vycentrovaný) vzorec. */
  display?: boolean
  className?: string
}

/** Jeden vzorec. Inline jako `<span>`, `display` jako `<div>` (široký se posouvá uvnitř). */
export function Tex({ tex, display = false, macros, className }: TexProps) {
  const html = useMemo(() => renderTex(tex, display, { macros }), [tex, display, macros])
  const Tag = display ? 'div' : 'span'
  return <Tag className={className ? `mx ${display ? 'mx-display ' : ''}${className}` : display ? 'mx mx-display' : 'mx'} dangerouslySetInnerHTML={{ __html: html }} />
}

export type MathHTMLProps = MathHtmlOptions & {
  /** HTML (důvěryhodné — z obsahu aplikace) s `$…$` a `$$…$$`. */
  html: string
  as?: 'div' | 'span' | 'p'
  className?: string
}

/**
 * HTML řetězec s matematikou. `transformText` (např. z `createTermWrapper`) upraví text mimo matematiku a kód.
 * `transformText` předávej stabilní (vytvořený jednou na úrovni modulu), jinak se HTML přepočítává při každém renderu.
 */
export function MathHTML({ html, as: Tag = 'div', className, transformText, macros }: MathHTMLProps) {
  const out = useMemo(() => renderMathInHtml(html, { transformText, macros }), [html, transformText, macros])
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: out }} />
}
