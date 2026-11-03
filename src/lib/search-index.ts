import 'server-only'
import type { SearchItem } from '@/components/Search'
import { chapters, questions } from './content'
import { plain, KIND_LABEL } from './meta'
import { blockId } from '@/components/Blocks'

export function buildSearchIndex(): SearchItem[] {
  const out: SearchItem[] = []
  for (const c of chapters) {
    c.sections.forEach((s, si) => {
      const href = `/kapitola/${c.number}/${si + 1}`
      out.push({ k: 's', t: `${s.number} ${s.title}`, d: c.title, href })
      s.blocks.forEach((b, bi) => {
        if (b.kind === 'callout') out.push({ k: 'c', t: b.title, d: `${s.number} ${s.title}`, href: `${href}#${blockId(s.id, bi)}` })
        else if (b.kind === 'interactive' && b.title) out.push({ k: 'c', t: b.title, d: `${s.number} ${s.title}`, href: `${href}#${blockId(s.id, bi)}` })
      })
    })
  }
  for (const q of questions) {
    const p = plain(q.prompt)
    out.push({ k: 'q', t: p.length > 110 ? p.slice(0, 107) + '…' : p, d: `Otázka · ${KIND_LABEL[q.kind]} · ${q.id}`, href: `/otazky?id=${encodeURIComponent(q.id)}` })
  }
  return out
}
