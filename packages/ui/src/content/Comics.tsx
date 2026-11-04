'use client'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Icon } from '../lib/icons'

/** One comic (e.g. an xkcd strip). `scale: 2` for @2x images, so they show at their intended size. */
export type Comic = {
  src: string
  width: number
  height: number
  title: string
  /** The comic's hover text; shown under the image (and as the image's alt). */
  alt: string
  href: string
  scale?: 1 | 2
}

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/**
 * Sliding gallery of comics for a course home page: swipe / arrows / ← → keys, starts on a random
 * comic. Each slide keeps its own height (the track follows the current one), so a tall strip
 * doesn't leave blank space under a short one.
 */
export function Comics({ items, random = true, credit, label = 'Komiksy' }: { items: Comic[]; random?: boolean; credit?: React.ReactNode; label?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [height, setHeight] = useState<number>()
  const count = items.length
  const item = items[index]

  const go = useCallback(
    (k: number, behavior: ScrollBehavior = 'smooth') => {
      const el = track.current
      if (!el || !count) return
      const n = ((k % count) + count) % count
      el.scrollTo({ left: n * el.clientWidth, behavior })
      setIndex(n)
    },
    [count],
  )

  // Random start after mount (keeps SSR output deterministic). Jumps with snapping off and re-checks:
  // on first paint the track may not scroll yet, and the browser would otherwise re-snap to slide 1.
  useEffect(() => {
    if (!random || count < 2) return
    const n = Math.floor(Math.random() * count)
    setIndex(n)
    let tries = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const jump = () => {
      const el = track.current
      if (!el) return
      el.style.scrollSnapType = 'none'
      el.scrollLeft = n * el.clientWidth
      requestAnimationFrame(() => {
        el.style.scrollSnapType = ''
        if (Math.abs(el.scrollLeft - n * el.clientWidth) > 2 && ++tries < 20) timer = setTimeout(jump, 50)
      })
    }
    jump()
    return () => clearTimeout(timer)
  }, [random, count])

  // The track takes the height of the current slide.
  useIsoLayoutEffect(() => {
    const slide = track.current?.children[index] as HTMLElement | undefined
    if (!slide) return
    const measure = () => setHeight(slide.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(slide)
    return () => ro.disconnect()
  }, [index])

  const onScroll = () => {
    const el = track.current
    if (!el) return
    const n = Math.round(el.scrollLeft / el.clientWidth)
    if (n !== index && n >= 0 && n < count) setIndex(n)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') (e.preventDefault(), go(index - 1))
    else if (e.key === 'ArrowRight') (e.preventDefault(), go(index + 1))
  }

  if (!item) return null
  return (
    <section className="sk-comics" aria-roledescription="galerie" aria-label={label} onKeyDown={onKey}>
      <div ref={track} className="sk-comics-track" style={{ height }} onScroll={onScroll} tabIndex={0} aria-live="polite">
        {items.map((c, i) => (
          <figure key={c.href} className="sk-comics-slide" aria-hidden={i !== index} aria-label={`${i + 1} z ${count}: ${c.title}`}>
            <a className="sk-comics-img" href={c.href} target="_blank" rel="noopener noreferrer" tabIndex={i === index ? 0 : -1}>
              <img src={c.src} width={c.width} height={c.height} alt={c.alt} title={c.alt} loading={i === index ? 'eager' : 'lazy'} style={{ maxWidth: c.width / (c.scale ?? 1) }} />
            </a>
            <figcaption>{c.alt}</figcaption>
          </figure>
        ))}
      </div>
      <div className="sk-comics-bar">
        <a className="sk-comics-t" href={item.href} target="_blank" rel="noopener noreferrer">
          {item.title}
          <Icon name="ext" />
        </a>
        {count > 1 && (
          <div className="sk-comics-nav">
            <button type="button" className="sk-ib" onClick={() => go(index - 1)} aria-label="Předchozí komiks">
              <Icon name="l" />
            </button>
            <span className="sk-comics-n">
              {index + 1} / {count}
            </span>
            <button type="button" className="sk-ib" onClick={() => go(index + 1)} aria-label="Další komiks">
              <Icon name="r" />
            </button>
          </div>
        )}
      </div>
      {credit && <p className="sk-comics-c">{credit}</p>}
    </section>
  )
}
