import { useMemo } from 'react'
import katex from 'katex'

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

// Recognize the start of an HTML tag (or comment / closing tag). This must
// NOT match bare "<" inside math like `$a < b$`.
function isTagStart(html: string, i: number): boolean {
  if (html[i] !== '<') return false
  const next = html[i + 1]
  if (next === '/' || next === '!') return true
  if (!next) return false
  return /[a-zA-Z]/.test(next)
}

function process(html: string): string {
  // Process text nodes while preserving HTML tags. Simple state machine:
  // outside tags we tokenize math, inside tags we copy verbatim.
  let out = ''
  let i = 0
  let buf = ''
  const flushBuf = () => {
    if (!buf) return
    for (const t of tokenize(buf)) {
      if (t.kind === 'text') out += t.value
      else out += renderMath(t.value, t.display)
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
      out += html.slice(i, close + 1)
      i = close + 1
      continue
    }
    buf += html[i]!
    i++
  }
  flushBuf()
  return out
}

export function MathHTML({ html, className }: { html: string; className?: string }) {
  const rendered = useMemo(() => process(html), [html])
  return <div className={className} dangerouslySetInnerHTML={{ __html: rendered }} />
}
