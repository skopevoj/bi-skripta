'use client'
import { useSyncExternalStore } from 'react'

export type AnswerState = { sel: number[]; text: string; ce: boolean; revealed: boolean; self: boolean | null }
export type SavedAnswer = { ok: boolean; st: AnswerState; t: number }
export type Progress = { answers: Record<string, SavedAnswer>; read: Record<string, number> }

const KEY = 'kom-progress-v1'
const EMPTY: Progress = { answers: {}, read: {} }
let cache: Progress | null = null
const subs = new Set<() => void>()

function load(): Progress {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    const p = raw ? (JSON.parse(raw) as Progress) : null
    cache = p && typeof p === 'object' ? { answers: p.answers || {}, read: p.read || {} } : { answers: {}, read: {} }
  } catch {
    cache = { answers: {}, read: {} }
  }
  return cache
}

function save(next: Progress) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable – keep in memory */
  }
  subs.forEach((f) => f())
}

function subscribe(f: () => void) {
  subs.add(f)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null
      f()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    subs.delete(f)
    window.removeEventListener('storage', onStorage)
  }
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, load, () => EMPTY)
}

export function recordAnswer(id: string, ok: boolean, st: AnswerState) {
  const p = load()
  save({ ...p, answers: { ...p.answers, [id]: { ok, st, t: Date.now() } } })
}

export function clearAnswer(id: string) {
  const p = load()
  if (!p.answers[id]) return
  const answers = { ...p.answers }
  delete answers[id]
  save({ ...p, answers })
}

export function markRead(sectionId: string) {
  const p = load()
  if (p.read[sectionId]) return
  save({ ...p, read: { ...p.read, [sectionId]: Date.now() } })
}

// ---- generic JSON in localStorage (tests etc.)
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
