// Full-text search index for the package `<Search>` (top bar, ⌘K): chapters, sections, headings,
// callouts, exercises, widgets and every paragraph / list / table / formula. Hits link to the block anchor.
import { blockId, calloutDef, plain, type SearchItem } from '@skripta/ui'
import type { Block, Chapter } from './types'
import { pathFor } from './router'

const join = (...xs: (string | undefined)[]) => xs.filter(Boolean).join(' ')

function blockItem(b: Block, where: string, page: string, anchor: string): SearchItem | null {
  const href = `${page}#${anchor}`
  switch (b.kind) {
    case 'h3':
      return { k: 'c', t: `${b.number} ${b.title}`, d: where, href: `${page}#${b.id}` }
    case 'callout':
      return { k: 'c', t: join(`${calloutDef(b.type).label} ${b.number}`, b.title && `(${plain(b.title)})`), d: plain(join(b.html, b.plain)), href }
    case 'exercise':
      return {
        k: 'c',
        t: join(`Příklad ${b.number}`, b.title && `(${plain(b.title)})`),
        d: plain(join(b.source, b.problem, b.result, b.solution)),
        href,
      }
    case 'interactive':
      return b.title ? { k: 'c', t: b.title, d: join('Interaktivně ·', b.hint), href } : null
    case 'diagram':
      return b.caption ? { k: 'x', t: plain(b.caption), d: where, href } : null
    case 'p':
      return { k: 'x', t: where, d: plain(b.html), href }
    case 'list':
      return { k: 'x', t: where, d: b.items.map(plain).join(' · '), href }
    case 'math':
      return { k: 'x', t: where, d: b.tex, href }
    case 'table':
      return { k: 'x', t: where, d: plain(join(b.caption, b.head.join(' '), ...b.rows.map((r) => r.join(' ')))), href }
    case 'glossary':
      return null
  }
}

export function buildKabSearch(chapters: Chapter[]): SearchItem[] {
  const out: SearchItem[] = []
  for (const c of chapters) {
    const ch = pathFor(c.id)
    const chTitle = `${c.number}. ${c.title}`
    out.push({ k: 's', t: chTitle, d: 'Kapitola', href: ch })
    ;(c.intro ?? []).forEach((b, i) => {
      const it = blockItem(b, chTitle, ch, blockId(c.id, i))
      if (it) out.push(it)
    })
    for (const s of c.sections) {
      const page = pathFor(c.id, s.id)
      const where = `${s.number} ${s.title}`
      out.push({ k: 's', t: where, d: chTitle, href: page })
      s.blocks.forEach((b, i) => {
        const it = blockItem(b, where, page, blockId(s.id, i))
        if (it) out.push(it)
      })
    }
  }
  return out
}
