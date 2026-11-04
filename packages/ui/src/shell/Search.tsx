'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { searchItems, type SearchItem } from '../lib/search'
import { fold } from '../lib/text'

const KIND: Record<SearchItem['k'], string> = { s: 'Sekce', c: 'Blok', q: '', x: '' }

/** Long descriptions (full-text entries): start the line near the first matched word so the hit is visible. */
function around(d: string, q: string): string {
  if (d.length <= 90) return d
  const f = fold(d)
  let at = -1
  for (const w of fold(q).split(/\s+/).filter(Boolean)) {
    const i = f.indexOf(w)
    if (i >= 0 && (at < 0 || i < at)) at = i
  }
  if (at < 40) return d
  const sp = d.lastIndexOf(' ', at - 30)
  return '… ' + d.slice(sp < 0 ? at - 30 : sp + 1)
}

/** Search box in the top bar (⌘K / Ctrl+K). On phones an icon that expands over the bar. */
export function Search({ items, placeholder = 'Hledat ve skriptech' }: { items: SearchItem[]; placeholder?: string }) {
  const { navigate } = useSkripta()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const wrap = useRef<HTMLDivElement>(null)

  const folded = useMemo(() => items.map((it) => fold(it.t + ' ' + it.d)), [items])
  const results = useMemo(() => searchItems(items, q, folded), [q, items, folded])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        input.current?.focus()
        input.current?.select()
      }
    }
    const onDown = (e: PointerEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [])

  const go = (it: SearchItem) => {
    setOpen(false)
    setQ('')
    input.current?.blur()
    navigate(it.href)
  }

  return (
    <div ref={wrap} className={`sk-search${open ? ' open' : ''}`}>
      <button
        type="button"
        className="sk-search-ic"
        aria-label={placeholder}
        tabIndex={-1}
        onClick={() => {
          setOpen(true)
          input.current?.focus()
        }}
      >
        <Icon name="search" />
      </button>
      <input
        ref={input}
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        role="combobox"
        aria-expanded={open && !!q.trim()}
        aria-controls="sk-sres"
        aria-autocomplete="list"
        value={q}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value)
          setCur(0)
          setOpen(true)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setCur((c) => Math.min(c + 1, results.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setCur((c) => Math.max(c - 1, 0))
          } else if (e.key === 'Enter' && results[cur]) {
            e.preventDefault()
            go(results[cur])
          } else if (e.key === 'Escape') {
            setOpen(false)
            input.current?.blur()
          }
        }}
      />
      <kbd>⌘K</kbd>
      {open && (
        <button type="button" className="sk-search-x" aria-label="Zavřít hledání" onClick={() => (setOpen(false), setQ(''))}>
          <Icon name="x" />
        </button>
      )}
      {open && q.trim() && (
        <div className="sk-sres" id="sk-sres" role="listbox">
          {results.length === 0 ? (
            <p>Nic nenalezeno.</p>
          ) : (
            results.map((it, i) => (
              <a
                key={it.href + i}
                href={it.href}
                role="option"
                aria-selected={i === cur}
                className={i === cur ? 'on' : undefined}
                onMouseEnter={() => setCur(i)}
                onClick={(e) => {
                  e.preventDefault()
                  go(it)
                }}
              >
                <span>{it.t}</span>
                <small>
                  {KIND[it.k] && <em>{KIND[it.k]}</em>}
                  {around(it.d, q)}
                </small>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  )
}
