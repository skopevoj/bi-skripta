// Tiny highlighters for OCL, Turtle and SPARQL. Returns HTML.
import type { CodeLang } from '@content/types'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const OCL_KW =
  'context|inv|pre|post|init|derive|def|body|let|in|if|then|else|endif|implies|and|or|not|xor|self|result|true|false|null|invalid|package|endpackage'
const OCL_OP =
  'forAll|exists|select|reject|collect|any|one|isUnique|iterate|size|isEmpty|notEmpty|includes|excludes|includesAll|excludesAll|count|sum|union|intersection|including|excluding|asSet|asBag|asSequence|asOrderedSet|first|last|at|allInstances|oclIsKindOf|oclIsTypeOf|oclAsType|oclIsUndefined|closure|sortedBy|max|min|abs|floor|round|concat|substring|toUpper|toLower'
const SPARQL_KW =
  'SELECT|WHERE|PREFIX|BASE|FILTER|OPTIONAL|UNION|DISTINCT|ORDER|BY|LIMIT|OFFSET|ASK|CONSTRUCT|DESCRIBE|GROUP|HAVING|COUNT|AS|VALUES|BIND|MINUS|NOT|EXISTS|ASC|DESC|a'

const RE: Record<Exclude<CodeLang, 'text'>, RegExp> = {
  ocl: new RegExp(
    `(--[^\\n]*)|('(?:[^'\\\\\\n]|\\\\.)*')|\\b(${OCL_KW})\\b|\\b(${OCL_OP})\\b|\\b([A-Z][A-Za-z0-9_]*)\\b|\\b(\\d+(?:\\.\\d+)?)\\b`,
    'g',
  ),
  turtle: /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"(?:@[a-z-]+|\^\^[\w:]+)?)|(@prefix|@base|\ba\b)|(<[^>\s]*>)|\b([A-Za-z][\w-]*:[\w-]*|:[\w-]+)|\b(\d+(?:\.\d+)?)\b/g,
  sparql: new RegExp(
    `(#[^\\n]*)|("(?:[^"\\\\\\n]|\\\\.)*"(?:@[a-z-]+|\\^\\^[\\w:]+)?)|\\b(${SPARQL_KW})\\b|(<[^>\\s]*>|\\?[\\w]+)|\\b([A-Za-z][\\w-]*:[\\w-]*)|\\b(\\d+(?:\\.\\d+)?)\\b`,
    'gi',
  ),
  xml: /(<!--[\s\S]*?-->)|("[^"]*")|(<\/?[\w:.-]+|\/?>)|()|(\b[\w:.-]+(?==))|()/g,
}

export function highlight(src: string, lang: CodeLang = 'text'): string {
  if (lang === 'text') return esc(src)
  const re = RE[lang]
  let o = ''
  let last = 0
  let m: RegExpExecArray | null
  re.lastIndex = 0
  while ((m = re.exec(src))) {
    if (m[0] === '') {
      re.lastIndex++
      continue
    }
    o += esc(src.slice(last, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : m[4] ? 'a' : m[5] ? 't' : 'n'
    o += `<span class="${cls}">${esc(m[0])}</span>`
    last = m.index + m[0].length
  }
  return o + esc(src.slice(last))
}

export function escapeHtml(s: string): string {
  return esc(s).replace(/"/g, '&quot;')
}
