// Turns a test-style snippet (definitions + top-level statements, no @main) into a runnable
// Scala 3 program by moving top-level statements into `@main def run()`.
// Returns the program and a line map (program line -> original line) for error reporting.

const DEF_START =
  /^(?:@|\/\/|\/\*|\*|import\b|package\b|export\b|(?:(?:final|sealed|abstract|open|case|private|protected|implicit|inline|transparent|lazy)\s+)*(?:class|trait|object|enum|def|type|given|extension)\b)/

export function hasEntryPoint(code: string): boolean {
  return /@main\b/.test(code) || /\bdef\s+main\s*\(/.test(code) || /extends\s+App\b/.test(code)
}

export type Wrapped = { program: string; lineMap: number[] | null; wrapped: boolean }

export function wrapForRun(code: string): Wrapped {
  if (hasEntryPoint(code)) return { program: code, lineMap: null, wrapped: false }
  const lines = code.replace(/\r\n/g, '\n').split('\n')
  const defs: { text: string; line: number }[] = []
  const body: { text: string; line: number }[] = []
  let mode: 'def' | 'stmt' = 'def'
  lines.forEach((text, i) => {
    const top = text.length > 0 && !/^\s/.test(text)
    if (top) {
      // closing braces / `end x` markers continue the current block
      if (/^[})\]]/.test(text) || /^end\b/.test(text)) {
        /* keep mode */
      } else mode = DEF_START.test(text) ? 'def' : 'stmt'
    }
    if (text.trim() === '') {
      ;(mode === 'def' ? defs : body).push({ text, line: i + 1 })
      return
    }
    if (mode === 'def') defs.push({ text, line: i + 1 })
    else body.push({ text: '  ' + text, line: i + 1 })
  })
  while (body.length && body[body.length - 1].text.trim() === '') body.pop()
  if (!body.some((b) => b.text.trim() !== '')) {
    // nothing to execute — still compile it
    body.push({ text: '  ()', line: 0 })
  }
  const out: { text: string; line: number }[] = [...defs]
  while (out.length && out[out.length - 1].text.trim() === '') out.pop()
  out.push({ text: '', line: 0 }, { text: '@main def run(): Unit =', line: 0 }, ...body)
  return { program: out.map((l) => l.text).join('\n'), lineMap: out.map((l) => l.line), wrapped: true }
}
