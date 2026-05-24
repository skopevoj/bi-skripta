import type { Block, Chapter } from './types'

export type SearchEntry = {
  chapterId: string
  chapterNumber: string
  chapterTitle: string
  sectionId?: string
  sectionNumber?: string
  sectionTitle?: string
  // Anchor inside the page (e.g. an h3 id). When present, the URL gets a hash.
  anchor?: string
  // Lower-cased, plain-text haystack used for matching.
  haystack: string
  // Original-case text used to generate snippets.
  original: string
  // Short label for the result (e.g. block kind or "Sekce", "Kapitola").
  label: string
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function blockText(block: Block): { text: string; label: string; anchor?: string } | null {
  switch (block.kind) {
    case 'p':
      return { text: stripHtml(block.html), label: 'Text' }
    case 'h3':
      return { text: `${block.number} ${block.title}`, label: 'Nadpis', anchor: block.id }
    case 'math':
      return { text: block.tex, label: 'Vzorec' }
    case 'list':
      return { text: block.items.map(stripHtml).join(' · '), label: 'Seznam' }
    case 'callout': {
      const parts = [block.title, stripHtml(block.html)]
      if (block.plain) parts.push(block.plain)
      const labelMap: Record<string, string> = {
        definice: 'Definice',
        veta: 'Věta',
        priklad: 'Příklad',
        poznamka: 'Poznámka',
        lemma: 'Lemma',
        dusledek: 'Důsledek',
        dukaz: 'Důkaz',
      }
      return {
        text: `${block.number} ${parts.join(' ')}`,
        label: labelMap[block.type] ?? 'Callout',
      }
    }
    case 'exercise': {
      const parts = [block.number]
      if (block.title) parts.push(block.title)
      if (block.source) parts.push(block.source)
      parts.push(stripHtml(block.problem))
      parts.push(stripHtml(block.result))
      if (block.solution) parts.push(stripHtml(block.solution))
      return { text: parts.join(' '), label: 'Cvičení' }
    }
    case 'interactive':
      return block.title || block.hint
        ? { text: [block.title, block.hint].filter(Boolean).join(' '), label: 'Interaktivní' }
        : null
    case 'diagram':
      return block.caption ? { text: block.caption, label: 'Diagram' } : null
    case 'glossary':
      return null
  }
}

export function buildSearchIndex(chapters: Chapter[]): SearchEntry[] {
  const entries: SearchEntry[] = []
  for (const c of chapters) {
    entries.push({
      chapterId: c.id,
      chapterNumber: c.number,
      chapterTitle: c.title,
      haystack: `${c.number} ${c.title}`.toLowerCase(),
      original: `${c.number} ${c.title}`,
      label: 'Kapitola',
    })

    for (const b of c.intro ?? []) {
      const t = blockText(b)
      if (!t) continue
      entries.push({
        chapterId: c.id,
        chapterNumber: c.number,
        chapterTitle: c.title,
        anchor: t.anchor,
        haystack: t.text.toLowerCase(),
        original: t.text,
        label: t.label,
      })
    }

    for (const s of c.sections) {
      entries.push({
        chapterId: c.id,
        chapterNumber: c.number,
        chapterTitle: c.title,
        sectionId: s.id,
        sectionNumber: s.number,
        sectionTitle: s.title,
        haystack: `${s.number} ${s.title}`.toLowerCase(),
        original: `${s.number} ${s.title}`,
        label: 'Sekce',
      })

      for (const b of s.blocks) {
        const t = blockText(b)
        if (!t) continue
        entries.push({
          chapterId: c.id,
          chapterNumber: c.number,
          chapterTitle: c.title,
          sectionId: s.id,
          sectionNumber: s.number,
          sectionTitle: s.title,
          anchor: t.anchor,
          haystack: t.text.toLowerCase(),
          original: t.text,
          label: t.label,
        })
      }
    }
  }
  return entries
}

export type SearchHit = {
  entry: SearchEntry
  // Index in haystack where the first match starts. -1 if no match (filtered out).
  matchAt: number
  // Score: lower is better. Title/heading hits rank above body text.
  score: number
}

// Czech-aware fold: lower-case + strip diacritics so "šifra" matches "sifra".
function fold(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function search(entries: SearchEntry[], query: string, limit = 30): SearchHit[] {
  const q = fold(query.trim())
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const hits: SearchHit[] = []

  for (const entry of entries) {
    const foldedHay = fold(entry.haystack)
    let allFound = true
    let firstAt = Infinity
    for (const term of terms) {
      const at = foldedHay.indexOf(term)
      if (at < 0) {
        allFound = false
        break
      }
      if (at < firstAt) firstAt = at
    }
    if (!allFound) continue

    // Boost titles/headings (shorter, structural entries) above body text.
    const isStructural =
      entry.label === 'Kapitola' || entry.label === 'Sekce' || entry.label === 'Nadpis'
    const score = (isStructural ? 0 : 100) + firstAt
    hits.push({ entry, matchAt: firstAt, score })
  }

  hits.sort((a, b) => a.score - b.score)
  return hits.slice(0, limit)
}

// Build a short snippet around the first match, with the matched terms highlighted.
// Returns HTML-escaped string with <mark> wrapping matches.
export function snippet(entry: SearchEntry, query: string, around = 80): string {
  const q = fold(query.trim())
  const terms = q.split(/\s+/).filter(Boolean)
  if (!terms.length) return escapeHtml(entry.original.slice(0, around * 2))

  const foldedHay = fold(entry.original)
  let firstAt = -1
  let firstTerm = ''
  for (const term of terms) {
    const at = foldedHay.indexOf(term)
    if (at >= 0 && (firstAt < 0 || at < firstAt)) {
      firstAt = at
      firstTerm = term
    }
  }
  if (firstAt < 0) return escapeHtml(entry.original.slice(0, around * 2))

  const start = Math.max(0, firstAt - around)
  const end = Math.min(entry.original.length, firstAt + firstTerm.length + around)
  const prefix = start > 0 ? '… ' : ''
  const suffix = end < entry.original.length ? ' …' : ''
  const slice = entry.original.slice(start, end)
  return prefix + highlight(slice, terms) + suffix
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlight(text: string, terms: string[]): string {
  // Walk over the (un-folded) source, but match in the folded form so diacritics
  // and case differences don't break the alignment.
  const folded = fold(text)
  type Range = { start: number; end: number }
  const ranges: Range[] = []
  for (const term of terms) {
    if (!term) continue
    let from = 0
    while (true) {
      const at = folded.indexOf(term, from)
      if (at < 0) break
      ranges.push({ start: at, end: at + term.length })
      from = at + term.length
    }
  }
  if (!ranges.length) return escapeHtml(text)
  ranges.sort((a, b) => a.start - b.start)
  const merged: Range[] = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r.start <= last.end) last.end = Math.max(last.end, r.end)
    else merged.push({ ...r })
  }
  let out = ''
  let cursor = 0
  for (const r of merged) {
    out += escapeHtml(text.slice(cursor, r.start))
    out += '<mark>' + escapeHtml(text.slice(r.start, r.end)) + '</mark>'
    cursor = r.end
  }
  out += escapeHtml(text.slice(cursor))
  return out
}
