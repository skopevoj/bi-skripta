'use client'
import { useCallback, useMemo, useSyncExternalStore } from 'react'
import type { AnswerState, SavedAnswer } from '../practice/types'
import { useSkripta } from './context'

export type Progress = { answers: Record<string, SavedAnswer>; read: Record<string, number> }

const EMPTY: Progress = { answers: {}, read: {} }

/** localStorage key with the course prefix: key('progress-v1') → "kom-progress-v1". */
export const storageKey = (prefix: string, name: string) => `${prefix}-${name}`

type Store = { key: string; cache: Progress | null; subs: Set<() => void> }
const stores = new Map<string, Store>()

function store(prefix: string): Store {
  const key = storageKey(prefix, 'progress-v1')
  let s = stores.get(key)
  if (!s) {
    s = { key, cache: null, subs: new Set() }
    stores.set(key, s)
  }
  return s
}

function load(s: Store): Progress {
  if (s.cache) return s.cache
  try {
    const raw = localStorage.getItem(s.key)
    const p = raw ? (JSON.parse(raw) as Partial<Progress>) : null
    s.cache = p && typeof p === 'object' ? { answers: p.answers || {}, read: p.read || {} } : { answers: {}, read: {} }
  } catch {
    s.cache = { answers: {}, read: {} }
  }
  return s.cache
}

function save(s: Store, next: Progress) {
  s.cache = next
  try {
    localStorage.setItem(s.key, JSON.stringify(next))
  } catch {
    /* storage unavailable – keep in memory */
  }
  s.subs.forEach((f) => f())
}

function subscribe(s: Store, f: () => void) {
  s.subs.add(f)
  const onStorage = (e: StorageEvent) => {
    if (e.key === s.key) {
      s.cache = null
      f()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    s.subs.delete(f)
    window.removeEventListener('storage', onStorage)
  }
}

/** Imperative API for one course prefix (usable outside React). */
export function progressApi(prefix: string) {
  const s = store(prefix)
  return {
    get: () => load(s),
    recordAnswer(id: string, ok: boolean, st: AnswerState) {
      const p = load(s)
      save(s, { ...p, answers: { ...p.answers, [id]: { ok, st, t: Date.now() } } })
    },
    clearAnswer(id: string) {
      const p = load(s)
      if (!p.answers[id]) return
      const answers = { ...p.answers }
      delete answers[id]
      save(s, { ...p, answers })
    },
    markRead(sectionId: string) {
      const p = load(s)
      if (p.read[sectionId]) return
      save(s, { ...p, read: { ...p.read, [sectionId]: Date.now() } })
    },
    reset() {
      save(s, { answers: {}, read: {} })
    },
  }
}

/** Reading progress + saved answers of the current course (SSR snapshot = empty). */
export function useProgress(): Progress {
  const { course } = useSkripta()
  const s = store(course.storage)
  const sub = useCallback((f: () => void) => subscribe(s, f), [s])
  const get = useCallback(() => load(s), [s])
  return useSyncExternalStore(sub, get, () => EMPTY)
}

/** Progress actions bound to the current course. */
export function useProgressActions() {
  const { course } = useSkripta()
  return useMemo(() => progressApi(course.storage), [course.storage])
}

// ---- generic JSON in localStorage (tests, filters…) — pass the full key (see `storageKey`)
export function loadJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
export function saveJSON(key: string, v: unknown) {
  try {
    if (v === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(v))
  } catch {
    /* ignore */
  }
}
