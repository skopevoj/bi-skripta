'use client'
import type { ReactNode } from 'react'
import { Html } from '../lib/html'
import { Sources } from './Cite'
import type { SourceRef } from './types'

/** Picture with a caption. `wide` lets it break out of the text column (like diagrams in b-reference). */
export function Figure({
  src,
  alt,
  caption,
  sources,
  id,
  wide,
  children,
}: {
  src?: string
  alt?: string
  caption?: string
  sources?: SourceRef[]
  id?: string
  wide?: boolean
  children?: ReactNode
}) {
  return (
    <figure id={id} className={`sk-fig${wide ? ' wide' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={alt ?? ''} loading="lazy" />}
      {children}
      {(caption || (sources && sources.length > 0)) && (
        <figcaption>
          {caption && <Html html={caption} label />}
          <Sources refs={sources} />
        </figcaption>
      )}
    </figure>
  )
}
