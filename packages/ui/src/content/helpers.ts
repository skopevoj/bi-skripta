import type { CalloutDef } from '../lib/config'
import { plain } from '../lib/text'
import { calloutDef } from './callouts'
import type { BlockLike, Chapter, NavChapter } from './types'

/** DOM id of block `i` in a section (stable — used by search and TOC links). */
export const blockId = (secId: string, i: number) => `${secId}-${i + 1}`

/** Callouts are numbered per chapter (Definice 3.4, Příklad 3.5 …), one counter for all kinds. */
export const countCallouts = (blocks: readonly BlockLike[]) =>
  blocks.filter((b) => b.kind === 'callout' && !(b as { number?: string }).number).length

/** Callout counter offset of section `si` (sum of callouts in the previous sections of the chapter). */
export const calloutStart = <B extends BlockLike>(c: Chapter<B>, si: number) =>
  c.sections.slice(0, si).reduce((n, s) => n + countCallouts(s.blocks), 0)

export const sectionQuestionIds = (blocks: readonly BlockLike[]): string[] =>
  blocks.flatMap((b) => (b.kind === 'quiz' ? (b as unknown as { ids: string[] }).ids : []))

const CORE = new Set(['p', 'list', 'code', 'table', 'figure'])

export type TocEntry = { id: string; title: string }

/** Entries for "Na této stránce": important callouts, h3, labs, quizzes and titled course blocks. */
export function tocEntries(secId: string, blocks: readonly BlockLike[], callouts?: Record<string, CalloutDef>): TocEntry[] {
  const out: TocEntry[] = []
  blocks.forEach((raw, i) => {
    const b = raw as BlockLike & { title?: string; type?: string; id?: string }
    const id = blockId(secId, i)
    if (b.kind === 'callout') {
      const d = calloutDef(b.type ?? '', callouts)
      if (d.toc && b.title) out.push({ id, title: d.tocPrefix ? `${d.tocPrefix}: ${plain(b.title)}` : plain(b.title) })
    } else if (b.kind === 'h3') out.push({ id: b.id ?? id, title: plain(b.title ?? '') })
    else if (b.kind === 'interactive') out.push({ id, title: b.title || 'Interaktivně' })
    else if (b.kind === 'quiz') out.push({ id, title: b.title || 'Procvičení' })
    else if (!CORE.has(b.kind) && b.kind !== 'callout' && typeof b.title === 'string' && b.title) out.push({ id, title: plain(b.title) })
  })
  return out
}

export const defaultSectionHref = (c: { number: string }, si: number) => `/kapitola/${c.number}/${si + 1}`

/** Serialisable chapter outline for <Shell nav> / <ChapterList>. */
export function navChapters<B extends BlockLike>(
  chapters: Chapter<B>[],
  opts: { sectionHref?: (c: Chapter<B>, si: number) => string; hasQuestion?: (id: string) => boolean } = {},
): NavChapter[] {
  const href = opts.sectionHref ?? defaultSectionHref
  return chapters.map((c) => ({
    number: c.number,
    title: c.title,
    summary: c.summary,
    href: href(c, 0),
    sections: c.sections.map((s, i) => ({
      id: s.id,
      number: s.number,
      title: s.title,
      href: href(c, i),
      qids: sectionQuestionIds(s.blocks).filter((id) => (opts.hasQuestion ? opts.hasQuestion(id) : true)),
    })),
  }))
}

export type PageLink = { href: string; title: string }

/** Previous / next section across chapters. `end` = where "Další" leads after the last section. */
export function prevNext<B extends BlockLike>(
  chapters: Chapter<B>[],
  ci: number,
  si: number,
  opts: { sectionHref?: (c: Chapter<B>, si: number) => string; end?: PageLink } = {},
): { prev: PageLink | null; next: PageLink | null } {
  const href = opts.sectionHref ?? defaultSectionHref
  const c = chapters[ci]!
  const pc = chapters[ci - 1]
  const nc = chapters[ci + 1]
  const prev =
    si > 0
      ? { href: href(c, si - 1), title: c.sections[si - 1]!.title }
      : pc
        ? { href: href(pc, pc.sections.length - 1), title: pc.sections.at(-1)!.title }
        : null
  const next =
    si < c.sections.length - 1
      ? { href: href(c, si + 1), title: c.sections[si + 1]!.title }
      : nc
        ? { href: href(nc, 0), title: `${nc.number}. ${nc.title}` }
        : (opts.end ?? null)
  return { prev, next }
}
