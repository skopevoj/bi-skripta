import type { BlockLike, Chapter, QuestionLike } from '../content/types'
import { blockId } from '../content/helpers'
import { fold, plain } from './text'

/** One search entry. k: s = section, c = callout / lab, q = question, x = anything else. */
export type SearchItem = { t: string; d: string; href: string; k: 's' | 'c' | 'q' | 'x' }

/** Rank items for a query: every word must match (diacritics-insensitive); sections first. */
export function searchItems(items: SearchItem[], query: string, folded?: string[], limit = 30): SearchItem[] {
  const ws = fold(query).split(/\s+/).filter(Boolean)
  if (!ws.length) return []
  const hay = folded ?? items.map((it) => fold(it.t + ' ' + it.d))
  const out: { it: SearchItem; score: number }[] = []
  items.forEach((it, i) => {
    if (!ws.every((w) => hay[i]!.includes(w))) return
    const title = fold(it.t)
    let score = it.k === 's' ? 0 : it.k === 'c' ? 1 : it.k === 'q' ? 2 : 3
    if (title.startsWith(ws[0]!)) score -= 2
    else if (title.includes(ws[0]!)) score -= 1
    out.push({ it, score })
  })
  return out.sort((a, b) => a.score - b.score).slice(0, limit).map((x) => x.it)
}

/**
 * Build a search index from chapters (sections + titled callouts / labs) and questions.
 * Server-side helper — pass the result to <Shell search={…}>.
 */
export function buildSearchIndex<B extends BlockLike>(opts: {
  chapters: Chapter<B>[]
  questions?: QuestionLike[]
  sectionHref: (c: Chapter<B>, sectionIndex: number) => string
  questionHref?: (q: QuestionLike) => string
  kindLabel?: (q: QuestionLike) => string
}): SearchItem[] {
  const out: SearchItem[] = []
  for (const c of opts.chapters) {
    c.sections.forEach((s, si) => {
      const href = opts.sectionHref(c, si)
      out.push({ k: 's', t: `${s.number} ${s.title}`, d: c.title, href })
      s.blocks.forEach((raw, bi) => {
        const b = raw as BlockLike & { title?: string }
        if ((b.kind === 'callout' || b.kind === 'interactive') && b.title)
          out.push({ k: 'c', t: plain(b.title), d: `${s.number} ${s.title}`, href: `${href}#${blockId(s.id, bi)}` })
      })
    })
  }
  for (const q of opts.questions ?? []) {
    const p = plain(q.prompt)
    const href = opts.questionHref ? opts.questionHref(q) : `/otazky?id=${encodeURIComponent(q.id)}`
    const kind = opts.kindLabel ? opts.kindLabel(q) : 'Otázka'
    out.push({ k: 'q', t: p.length > 110 ? p.slice(0, 107) + '…' : p, d: `Otázka · ${kind} · ${q.id}`, href })
  }
  return out
}
