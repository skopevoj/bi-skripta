'use client'
import type { CiteItem, SourceView } from '../lib/config'
import { useSkripta, type Skripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { useWorkbench } from '../workbench/context'
import type { DocInfo, SourceRef } from './types'

export function defaultWebLabel(url: string): string {
  if (/ontouml/i.test(url)) return 'OntoUML'
  if (/w3\.org/.test(url)) return 'W3C'
  if (/omg\.org/.test(url)) return 'OMG'
  if (/scala-lang\.org/.test(url)) return 'Scala'
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

export function docView(doc: DocInfo, page: number, cfg: Pick<Skripta, 'docHref'>, quotes: string[] = []): SourceView {
  return {
    kind: 'pdf',
    file: doc.file,
    title: doc.title ?? doc.long,
    kicker: doc.long,
    page,
    quotes,
    doc: doc.id,
    href: cfg.docHref ? cfg.docHref(doc.id) : `/prednasky/${doc.id}`,
  }
}

/** Merge refs into badges: one per doc + page (quotes combined), numbered "Originál" for images, dedup links. */
export function citeItems(refs: SourceRef[], cfg: Skripta): CiteItem[] {
  const out: CiteItem[] = []
  const slides = new Map<string, Extract<CiteItem, { k: 'source' }>>()
  let imgN = 0
  const imgCount = refs.filter((r) => r.kind === 'image').length
  const seen = new Set<string>()
  for (const r of refs) {
    const custom = cfg.resolveSource?.(r, refs)
    if (custom === null) continue
    if (custom) {
      if (!seen.has(custom.key)) out.push(custom)
      seen.add(custom.key)
      continue
    }
    if (r.kind === 'slide') {
      const key = `${r.doc}-${r.page}`
      const ex = slides.get(key)
      if (ex) {
        if (r.quote && ex.view.kind === 'pdf') ex.view.quotes = [...(ex.view.quotes ?? []), r.quote]
        continue
      }
      const d = cfg.docs.find((x) => x.id === r.doc)
      if (!d) {
        out.push({ k: 'text', key, label: `${r.doc} · ${r.page}`, title: `${r.doc}, slajd ${r.page}` })
        continue
      }
      const it: Extract<CiteItem, { k: 'source' }> = {
        k: 'source',
        key,
        label: `${d.short} · ${r.page}`,
        title: `${d.long}, slajd ${r.page}`,
        icon: 'slides',
        view: docView(d, r.page, cfg, r.quote ? [r.quote] : []),
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
      out.push({ k: 'source', key: `img-${r.src}`, label, title: r.label, icon: 'img', view })
    } else if (r.kind === 'wiki') {
      const href = r.url || cfg.wikiUrl || 'https://fit-wiki.cz'
      if (seen.has(href)) continue
      seen.add(href)
      out.push({ k: 'ext', key: `wiki-${href}`, label: 'Wiki', title: r.label, href })
    } else if (r.kind === 'web') {
      if (seen.has(r.url)) continue
      seen.add(r.url)
      out.push({ k: 'ext', key: `web-${r.url}`, label: (cfg.webLabel ?? defaultWebLabel)(r.url), title: r.label, href: r.url })
    } else if (r.kind === 'official') {
      out.push({ k: 'text', key: `off-${r.label}`, label: r.label, title: r.label })
    }
  }
  return out
}

/** One citation badge. */
export function Cite({ item }: { item: CiteItem }) {
  const wb = useWorkbench()
  if (item.k === 'source')
    return (
      <button type="button" className="sk-cite" title={item.title} onClick={(e) => wb.openSource(item.view, e.currentTarget)}>
        <Icon name={item.icon ?? 'slides'} />
        <span>{item.label}</span>
      </button>
    )
  if (item.k === 'ext')
    return (
      <a className="sk-cite web" href={item.href} target="_blank" rel="noopener noreferrer" title={item.title}>
        <Icon name="ext" />
        <span>{item.label}</span>
      </a>
    )
  return (
    <span className="sk-cite text" title={item.title}>
      {item.label}
    </span>
  )
}

/** Citation badges for a list of refs. `block` = own row (after lists / code), otherwise inline after text. */
export function Sources({ refs, block }: { refs?: SourceRef[]; block?: boolean }) {
  const cfg = useSkripta()
  if (!refs || refs.length === 0) return null
  const items = citeItems(refs, cfg)
  if (!items.length) return null
  const body = items.map((it) => <Cite key={it.key} item={it} />)
  if (block) return <div className="sk-srcs">{body}</div>
  return <span className="sk-cites">{body}</span>
}
