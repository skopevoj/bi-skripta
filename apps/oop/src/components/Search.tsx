'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Icon } from './Icon'

export type SearchItem = { t: string; d: string; href: string; k: 's' | 'c' | 'q' }

const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export function Search({ items }: { items: SearchItem[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [cur, setCur] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const wrap = useRef<HTMLLabelElement>(null)

  const folded = useMemo(() => items.map((it) => fold(it.t + ' ' + it.d)), [items])

  const results = useMemo(() => {
    const words = fold(q).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    const out: { it: SearchItem; score: number }[] = []
    items.forEach((it, i) => {
      const hay = folded[i]
      if (!words.every((w) => hay.includes(w))) return
      const title = fold(it.t)
      let score = it.k === 's' ? 0 : it.k === 'c' ? 1 : 2
      if (title.startsWith(words[0])) score -= 2
      else if (title.includes(words[0])) score -= 1
      out.push({ it, score })
    })
    return out.sort((a, b) => a.score - b.score).slice(0, 30).map((x) => x.it)
  }, [q, items, folded])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(true)
        input.current?.focus()
        input.current?.select()
      }
    }
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [])

  const go = (it: SearchItem) => {
    setOpen(false)
    setQ('')
    input.current?.blur()
    router.push(it.href)
  }

  return (
    <label
      ref={wrap}
      className={`search${open ? ' open' : ''}`}
      onClick={() => {
        setOpen(true)
        input.current?.focus()
      }}
    >
      <Icon name="search" />
      <input
        ref={input}
        type="search"
        placeholder="Hledat ve skriptech"
        aria-label="Hledat ve skriptech"
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
      {open && q.trim() && (
        <div className="sres" role="listbox">
          {results.length === 0 ? (
            <p>Nic nenalezeno.</p>
          ) : (
            results.map((it, i) => (
              <a
                key={it.href + i}
                href={it.href}
                className={i === cur ? 'on' : undefined}
                onMouseEnter={() => setCur(i)}
                onClick={(e) => {
                  e.preventDefault()
                  go(it)
                }}
              >
                <span>{it.t}</span>
                <small>{it.d}</small>
              </a>
            ))
          )}
        </div>
      )}
    </label>
  )
}
