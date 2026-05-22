import { useMemo } from 'react'
import katex from 'katex'
import { glossaryLookup, glossaryPattern } from '../glossary'

type Token =
  | { kind: 'text'; value: string }
  | { kind: 'math'; value: string; display: boolean }

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  let textBuf = ''
  const flushText = () => {
    if (textBuf) {
      tokens.push({ kind: 'text', value: textBuf })
      textBuf = ''
    }
  }
  while (i < input.length) {
    const ch = input[i]
    // skip escaped dollar
    if (ch === '\\' && input[i + 1] === '$') {
      textBuf += '$'
      i += 2
      continue
    }
    if (ch === '$') {
      const display = input[i + 1] === '$'
      const close = display ? '$$' : '$'
      const start = i + close.length
      let end = -1
      let j = start
      while (j < input.length) {
        if (input[j] === '\\' && input[j + 1] === '$') {
          j += 2
          continue
        }
        if (display ? input.startsWith('$$', j) : input[j] === '$') {
          end = j
          break
        }
        j++
      }
      if (end === -1) {
        // unterminated; treat as text
        textBuf += ch
        i++
        continue
      }
      flushText()
      tokens.push({ kind: 'math', value: input.slice(start, end), display })
      i = end + close.length
      continue
    }
    textBuf += ch
    i++
  }
  flushText()
  return tokens
}

function renderMath(value: string, display: boolean): string {
  try {
    return katex.renderToString(value, {
      displayMode: display,
      throwOnError: false,
      errorColor: '#dc2626',
      strict: 'ignore',
      output: 'html',
    })
  } catch {
    return `<span class="katex-error">${escapeHtml(value)}</span>`
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

// Wrap occurrences of glossary terms inside a plain-text string with a
// hover-tooltip span. Matches must be on word boundaries (Czech letters /
// digits aware) and we don't recurse into already-wrapped output.
function wrapGlossary(text: string): string {
  if (!text) return text
  glossaryPattern.lastIndex = 0
  let out = ''
  let last = 0
  let m: RegExpExecArray | null
  while ((m = glossaryPattern.exec(text)) !== null) {
    const matched = m[0]
    const entry = glossaryLookup.get(matched.toLowerCase())
    if (!entry) continue
    out += text.slice(last, m.index)
    out +=
      `<span class="gloss" tabindex="0" data-term="${escapeAttr(entry.term)}">` +
      matched +
      `<span class="gloss-tip" role="tooltip">` +
      `<span class="gloss-tip-term">${escapeHtml(entry.term)}</span>` +
      `<span class="gloss-tip-def">${escapeHtml(entry.definition)}</span>` +
      `</span>` +
      `</span>`
    last = m.index + matched.length
  }
  out += text.slice(last)
  return out
}

// Recognize the start of an HTML tag (or comment / closing tag). This must
// NOT match bare "<" inside math like `$a < b$`.
function isTagStart(html: string, i: number): boolean {
  if (html[i] !== '<') return false
  const next = html[i + 1]
  if (next === '/' || next === '!') return true
  if (!next) return false
  return /[a-zA-Z]/.test(next)
}

// Tags inside which we do NOT want to auto-wrap glossary terms (would either
// nest awkwardly or change verbatim content).
const NO_GLOSS_TAGS = new Set(['code', 'a', 'pre', 'kbd'])

function process(html: string, skipGlossary: boolean): string {
  // Process text nodes while preserving HTML tags. Simple state machine:
  // outside tags we tokenize math, inside tags we copy verbatim. A small
  // counter tracks depth inside `<code>` (and a few similar tags) so we can
  // suppress glossary-term wrapping for verbatim-ish content.
  let out = ''
  let i = 0
  let buf = ''
  let noGlossDepth = 0
  const flushBuf = () => {
    if (!buf) return
    for (const t of tokenize(buf)) {
      if (t.kind === 'text') {
        out += skipGlossary || noGlossDepth > 0 ? t.value : wrapGlossary(t.value)
      } else {
        out += renderMath(t.value, t.display)
      }
    }
    buf = ''
  }
  while (i < html.length) {
    if (isTagStart(html, i)) {
      flushBuf()
      const close = html.indexOf('>', i)
      if (close === -1) {
        // unterminated tag — treat rest as text
        buf += html.slice(i)
        i = html.length
        break
      }
      const tag = html.slice(i, close + 1)
      const nameMatch = /^<\s*(\/?)([a-zA-Z][a-zA-Z0-9]*)/.exec(tag)
      if (nameMatch) {
        const isClose = nameMatch[1] === '/'
        const name = nameMatch[2]!.toLowerCase()
        if (NO_GLOSS_TAGS.has(name)) {
          if (isClose) noGlossDepth = Math.max(0, noGlossDepth - 1)
          else if (!tag.endsWith('/>')) noGlossDepth++
        }
      }
      out += tag
      i = close + 1
      continue
    }
    buf += html[i]!
    i++
  }
  flushBuf()
  return out
}

export function MathHTML({
  html,
  className,
  as: Tag = 'div',
  noGloss = false,
}: {
  html: string
  className?: string
  as?: 'div' | 'span'
  // When true, render math but skip wrapping glossary terms in tooltip spans.
  // Used for headings and labels where the popover would be visually noisy.
  noGloss?: boolean
}) {
  const rendered = useMemo(() => process(html, noGloss), [html, noGloss])
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: rendered }} />
}
