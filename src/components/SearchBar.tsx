import { useEffect, useMemo, useRef, useState } from 'react'
import type React from 'react'
import type { Chapter } from '../types'
import {
  buildSearchIndex,
  search,
  snippet,
  type SearchEntry,
  type SearchHit,
} from '../searchIndex'
import { navigate, pathFor } from '../router'

export function SearchBar({ chapters }: { chapters: Chapter[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const index = useMemo(() => buildSearchIndex(chapters), [chapters])
  const hits: SearchHit[] = useMemo(() => search(index, query, 40), [index, query])

  useEffect(() => {
    setActiveIdx(0)
  }, [query])

  // Global shortcut: ⌘K / Ctrl-K focuses the search input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Close dropdown when clicking outside.
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [open])

  const go = (entry: SearchEntry) => {
    const base = pathFor(entry.chapterId, entry.sectionId)
    const href = entry.anchor ? `${base}#${entry.anchor}` : base
    navigate(href)
    if (entry.anchor) {
      // After route updates, scroll to the anchor.
      requestAnimationFrame(() => {
        document.getElementById(entry.anchor!)?.scrollIntoView({ block: 'start' })
      })
    }
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (query) setQuery('')
      else {
        setOpen(false)
        inputRef.current?.blur()
      }
      return
    }
    if (!hits.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(hits.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = hits[activeIdx]
      if (hit) go(hit.entry)
    }
  }

  const showResults = open && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500 pointer-events-none"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m17 17-3.5-3.5" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Hledat ve skriptech…"
          aria-label="Hledat"
          className="w-full pl-8 pr-12 py-2 text-[13px] font-sans rounded-md bg-ink-950/60 border border-ink-800 text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-ink-600 focus:bg-ink-950"
        />
        {!query && (
          <kbd className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 text-[10px] text-ink-500 font-sans border border-ink-800 rounded px-1.5 py-0.5 pointer-events-none">
            ⌘K
          </kbd>
        )}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Vymazat"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-200 text-xs font-sans"
          >
            ✕
          </button>
        )}
      </div>

      {showResults && (
        <div className="absolute left-0 right-0 top-full mt-1 z-30 max-h-[70vh] overflow-y-auto sidebar-scroll rounded-md border border-ink-800 bg-ink-900 shadow-xl">
          {hits.length === 0 ? (
            <div className="px-3 py-4 text-[13px] text-ink-500 font-sans">
              Žádné výsledky pro „{query}".
            </div>
          ) : (
            <ul className="py-1 font-sans">
              {hits.map((hit, i) => {
                const e = hit.entry
                const isActive = i === activeIdx
                const where = e.sectionNumber
                  ? `${e.sectionNumber} ${e.sectionTitle}`
                  : `${e.chapterNumber} ${e.chapterTitle}`
                return (
                  <li key={`${e.chapterId}-${e.sectionId ?? ''}-${e.anchor ?? ''}-${i}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => go(e)}
                      className={
                        'w-full text-left px-3 py-2 flex flex-col gap-1 border-l-2 transition-colors ' +
                        (isActive
                          ? 'bg-ink-850 border-ink-500'
                          : 'border-transparent hover:bg-ink-850/60')
                      }
                    >
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-500">
                        <span className="text-amber-500/80">{e.label}</span>
                        <span className="text-ink-600">·</span>
                        <span className="truncate">{where}</span>
                      </div>
                      <div
                        className="text-[13px] text-ink-200 leading-snug search-snippet"
                        dangerouslySetInnerHTML={{ __html: snippet(e, query, 60) }}
                      />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
