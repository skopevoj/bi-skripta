import type { BlockLike } from '../content/types'

/** Strip HTML tags and decode the common entities (search, previews). */
export function plain(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Lowercase + strip diacritics (search matching). */
export const fold = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

/** Czech plural: plural(3, ['otázka', 'otázky', 'otázek']) → "3 otázky". */
export function plural(n: number, forms: [one: string, few: string, many: string]): string {
  const f = n === 1 ? forms[0] : n >= 2 && n <= 4 ? forms[1] : forms[2]
  return `${n} ${f}`
}

const words = (s: string) => s.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

/** Rough reading time of a section (160 words / min; code 3 words per line; figures 40). */
export function readingMinutes(blocks: readonly BlockLike[]): number {
  let n = 0
  for (const raw of blocks) {
    const b = raw as Record<string, unknown> & BlockLike
    if (typeof b.html === 'string') n += words(b.html)
    if (Array.isArray(b.items)) (b.items as unknown[]).forEach((x) => typeof x === 'string' && (n += words(x)))
    if (Array.isArray(b.rows)) (b.rows as unknown[][]).forEach((r) => r.forEach((c) => typeof c === 'string' && (n += words(c))))
    if (typeof b.code === 'string') n += b.code.split('\n').length * 3
    if (b.kind === 'figure' || b.kind === 'diagram' || b.kind === 'compare' || b.kind === 'interactive') n += 40
  }
  return Math.max(1, Math.round(n / 160))
}
