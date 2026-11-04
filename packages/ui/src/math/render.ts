import katex from 'katex'

/*
 * Vykreslování LaTeXu (KaTeX) do HTML řetězců. Bez Reactu — dá se použít i při generování obsahu.
 * Port z KAB `MathHTML.tsx`: `$…$` inline, `$$…$$` display, `\$` = doslovný dolar;
 * HTML tagy se kopírují beze změny (i `<` uvnitř matematiky typu `$a < b$` funguje).
 */

export type TexOptions = {
  /** Vlastní makra KaTeXu (např. `{ '\\Z': '\\mathbb{Z}' }`). */
  macros?: Record<string, string>
}

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Vykreslí jeden výraz. Chyba v LaTeXu se ukáže jako červený zdroj, nikdy nevyhodí výjimku. */
export function renderTex(tex: string, display = false, opts: TexOptions = {}): string {
  try {
    return katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      errorColor: 'var(--bad)',
      strict: 'ignore',
      output: 'html',
      macros: opts.macros ? { ...opts.macros } : undefined,
    })
  } catch {
    return `<span class="mx-err">${escapeHtml(tex)}</span>`
  }
}

type Token = { kind: 'text'; value: string } | { kind: 'math'; value: string; display: boolean }

/** Rozdělí čistý text (bez tagů) na text a matematiku. */
export function tokenizeMath(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  let buf = ''
  const flush = () => {
    if (buf) tokens.push({ kind: 'text', value: buf })
    buf = ''
  }
  while (i < input.length) {
    const ch = input[i]
    if (ch === '\\' && input[i + 1] === '$') {
      buf += '$'
      i += 2
      continue
    }
    if (ch === '$') {
      const display = input[i + 1] === '$'
      const start = i + (display ? 2 : 1)
      let end = -1
      for (let j = start; j < input.length; j++) {
        if (input[j] === '\\' && input[j + 1] === '$') {
          j++
          continue
        }
        if (display ? input.startsWith('$$', j) : input[j] === '$') {
          end = j
          break
        }
      }
      if (end === -1) {
        buf += ch
        i++
        continue
      }
      flush()
      tokens.push({ kind: 'math', value: input.slice(start, end), display })
      i = end + (display ? 2 : 1)
      continue
    }
    buf += ch
    i++
  }
  flush()
  return tokens
}

const isTagStart = (html: string, i: number) => {
  if (html[i] !== '<') return false
  const next = html[i + 1]
  return next === '/' || next === '!' || (!!next && /[a-zA-Z]/.test(next))
}

/** Tagy, uvnitř kterých se nespouští `transformText` (glosář apod.) ani matematika. */
const VERBATIM = new Set(['code', 'pre', 'kbd', 'script', 'style'])
/** Tagy, uvnitř kterých se nespouští jen `transformText` (matematika ano). */
const NO_TRANSFORM = new Set(['a', 'button', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

export type MathHtmlOptions = TexOptions & {
  /**
   * Úprava čistého textu mimo matematiku a mimo `<code>/<pre>/<kbd>/<a>/nadpisy` — vstup je HTML-escapovaný text,
   * výstup HTML. Použití: glosářové tooltipy (`createTermWrapper`), zvýraznění pojmů.
   */
  transformText?: (text: string) => string
}

/** Vykreslí `$…$` / `$$…$$` uvnitř HTML řetězce. Tagy zůstanou, text mimo matematiku projde `transformText`. */
export function renderMathInHtml(html: string, opts: MathHtmlOptions = {}): string {
  const { transformText } = opts
  let out = ''
  let buf = ''
  let verbatim = 0
  let noTransform = 0
  const flush = () => {
    if (!buf) return
    if (verbatim > 0) out += buf
    else
      for (const t of tokenizeMath(buf)) {
        if (t.kind === 'math') out += renderTex(t.value, t.display, opts)
        else out += transformText && noTransform === 0 ? transformText(t.value) : t.value
      }
    buf = ''
  }
  let i = 0
  while (i < html.length) {
    if (isTagStart(html, i)) {
      flush()
      const close = html.indexOf('>', i)
      if (close === -1) {
        buf += html.slice(i)
        break
      }
      const tag = html.slice(i, close + 1)
      const m = /^<\s*(\/?)([a-zA-Z][a-zA-Z0-9-]*)/.exec(tag)
      if (m && !tag.endsWith('/>')) {
        const isClose = m[1] === '/'
        const name = m[2]!.toLowerCase()
        const d = isClose ? -1 : 1
        if (VERBATIM.has(name)) verbatim = Math.max(0, verbatim + d)
        if (NO_TRANSFORM.has(name)) noTransform = Math.max(0, noTransform + d)
      }
      out += tag
      i = close + 1
      continue
    }
    buf += html[i]
    i++
  }
  flush()
  return out
}

/* ------------------------------------------------------------------ */
/* Pojmy s tooltipem (glosář)                                          */
/* ------------------------------------------------------------------ */

export type TermEntry = { term: string; definition: string; aliases?: readonly string[] }

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/**
 * Z glosáře udělá `transformText` pro `renderMathInHtml` / `<MathHTML>`: výskyty pojmů (celá slova, i s diakritikou)
 * obalí do `<span class="mx-term">` s tooltipem (`.mx-term-tip`; styly v math.css, otevírá se hoverem i fokusem).
 * Data glosáře patří aplikaci (KAB `glossary.ts`), ne balíčku.
 */
export function createTermWrapper(entries: readonly TermEntry[]): (text: string) => string {
  const lookup = new Map<string, TermEntry>()
  const all: string[] = []
  for (const e of entries) {
    for (const t of [e.term, ...(e.aliases ?? [])]) {
      lookup.set(t.toLowerCase(), e)
      all.push(t)
    }
  }
  if (!all.length) return (t) => t
  all.sort((a, b) => b.length - a.length)
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${all.map(escapeRegex).join('|')})(?![\\p{L}\\p{N}])`, 'giu')
  return (text) => {
    if (!text) return text
    return text.replace(pattern, (matched) => {
      const e = lookup.get(matched.toLowerCase())
      if (!e) return matched
      return (
        `<span class="mx-term" tabindex="0" data-term="${escapeAttr(e.term)}">${matched}` +
        `<span class="mx-term-tip" role="tooltip"><span class="mx-term-t">${escapeHtml(e.term)}</span>` +
        `<span class="mx-term-d">${escapeHtml(e.definition)}</span></span></span>`
      )
    })
  }
}
