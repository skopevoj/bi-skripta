'use client'
import type { SourceRef } from '@content/types'
import { docLong, docPdf, docShort } from '@/lib/meta'
import { Icon } from './Icon'
import { useWorkbench, type SourceView } from './workbench/WorkbenchProvider'

type Item =
  | { k: 'slide'; key: string; label: string; title: string; view: SourceView }
  | { k: 'open'; key: string; label: string; title: string; view: SourceView }
  | { k: 'ext'; key: string; label: string; title: string; href: string }
  | { k: 'text'; key: string; label: string; title: string }

function webLabel(url: string): string {
  if (/ontouml/i.test(url)) return 'OntoUML'
  if (/w3\.org/.test(url)) return 'W3C'
  if (/omg\.org/.test(url)) return 'OMG'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Web'
  }
}

function pageFromLabel(label: string): number | null {
  const m = label.match(/(?:strana|str\.|page|s\.)\s*(\d+)/i)
  return m ? Number(m[1]) : null
}

/** Merge refs: one pill per lecture+page (quotes combined), numbered "Originál" links for images. */
export function toItems(refs: SourceRef[]): Item[] {
  const out: Item[] = []
  const slides = new Map<string, Extract<Item, { k: 'slide' }>>()
  let imgN = 0
  const imgCount = refs.filter((r) => r.kind === 'image').length
  const seenExt = new Set<string>()
  for (const r of refs) {
    if (r.kind === 'slide') {
      const key = `${r.doc}-${r.page}`
      const ex = slides.get(key)
      if (ex) {
        if (r.quote && ex.view.kind === 'pdf') ex.view.quotes = [...(ex.view.quotes ?? []), r.quote]
        continue
      }
      const it: Extract<Item, { k: 'slide' }> = {
        k: 'slide',
        key,
        label: `${docShort(r.doc)} · ${r.page}`,
        title: `${docLong(r.doc)}, slajd ${r.page}`,
        view: {
          kind: 'pdf',
          file: docPdf(r.doc),
          title: docLong(r.doc),
          page: r.page,
          quotes: r.quote ? [r.quote] : [],
          doc: r.doc,
          href: `/prednasky/${r.doc}`,
        },
      }
      slides.set(key, it)
      out.push(it)
    } else if (r.kind === 'image') {
      imgN++
      const label = imgCount > 1 ? `Originál ${imgN}` : 'Originál'
      const isPdf = /\.pdf($|[?#])/i.test(r.src)
      const view: SourceView = isPdf
        ? { kind: 'pdf', file: r.src, title: r.label, page: pageFromLabel(r.label) ?? 1 }
        : { kind: 'img', src: r.src, label: r.label, url: r.url }
      out.push({ k: 'open', key: `img-${r.src}`, label, title: r.label, view })
    } else if (r.kind === 'wiki') {
      const href = r.url || 'https://fit-wiki.cz/škola/předměty/bi-kom'
      if (seenExt.has(href)) continue
      seenExt.add(href)
      out.push({ k: 'ext', key: `wiki-${href}`, label: 'Wiki', title: r.label, href })
    } else if (r.kind === 'web') {
      if (seenExt.has(r.url)) continue
      seenExt.add(r.url)
      out.push({ k: 'ext', key: `web-${r.url}`, label: webLabel(r.url), title: r.label, href: r.url })
    }
  }
  return out
}

export function Sources({ refs, block }: { refs?: SourceRef[]; block?: boolean }) {
  const wb = useWorkbench()
  if (!refs || refs.length === 0) return null
  const items = toItems(refs)
  const body = items.map((it) => {
    if (it.k === 'slide' || it.k === 'open')
      return (
        <button
          key={it.key}
          type="button"
          className="cite"
          title={it.title}
          onClick={(e) => wb.openSource(it.view, e.currentTarget)}
        >
          <Icon name={it.k === 'slide' ? 'slides' : 'img'} />
          {it.label}
        </button>
      )
    if (it.k === 'ext')
      return (
        <a key={it.key} className="cite" href={it.href} target="_blank" rel="noopener noreferrer" title={it.title}>
          <Icon name="ext" />
          {it.label}
        </a>
      )
    return (
      <span key={it.key} className="cite" title={it.title}>
        {it.label}
      </span>
    )
  })
  if (block) return <div className="srcs">{body}</div>
  return <span className="cites">{body}</span>
}
