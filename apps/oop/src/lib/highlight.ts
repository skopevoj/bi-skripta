// Tiny Scala highlighter (same rules as the approved mockup). Returns HTML.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const KW =
  'class|def|val|var|extends|override|super|new|trait|object|if|then|else|match|case|import|with|this|true|false|null|sealed|abstract|private|protected|given|using|enum|for|yield|do|while|return|type|final|lazy|implicit|extension|end|try|catch|finally|throw|open|export|package'
const RE = new RegExp(
  `(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:[^"\\\\\\n]|\\\\.)*")|(@[A-Za-z]+)|\\b(${KW})\\b|\\b([A-Z][A-Za-z0-9_]*)\\b|\\b(\\d+(?:\\.\\d+)?[LDF]?)\\b`,
  'g',
)

export function highlight(src: string): string {
  let o = ''
  let last = 0
  let m: RegExpExecArray | null
  RE.lastIndex = 0
  while ((m = RE.exec(src))) {
    o += esc(src.slice(last, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'a' : m[4] ? 'k' : m[5] ? 't' : 'n'
    o += `<span class="${cls}">${esc(m[0])}</span>`
    last = m.index + m[0].length
  }
  return o + esc(src.slice(last))
}

export function escapeHtml(s: string): string {
  return esc(s).replace(/"/g, '&quot;')
}
