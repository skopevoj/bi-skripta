// A small, forgiving Turtle parser (subset): @prefix / PREFIX, IRIs, prefixed names, `a`,
// literals with @lang / ^^type, numbers, booleans, _:blank, [ … ] blank nodes, `;` and `,`.
// Keeps every token (incl. whitespace) so the source can be re-rendered with highlighting.

export type TokT = 'ws' | 'com' | 'dir' | 'iri' | 'pn' | 'a' | 'lit' | 'num' | 'bnode' | 'p' | 'err'
export type Tok = { t: TokT; text: string; line: number }
export type Term = { kind: 'iri' | 'blank' | 'lit'; key: string; label: string; full: string }
export type Triple = { s: Term; p: Term; o: Term; toks: [number, number, number] }
export type Parsed = { toks: Tok[]; triples: Triple[]; errors: string[] }

const RULES: [TokT, RegExp][] = [
  ['ws', /^\s+/],
  ['com', /^#[^\n]*/],
  ['dir', /^(?:@prefix|@base|PREFIX|BASE)\b/i],
  ['iri', /^<[^>\s]*>/],
  ['lit', /^"(?:[^"\\\n]|\\.)*"(?:@[A-Za-z]+(?:-[A-Za-z0-9]+)*|\^\^(?:<[^>\s]*>|(?:[A-Za-z][\w-]*)?:[\w-]*))?/],
  ['num', /^[+-]?\d+(?:\.\d+)?(?![\w:])/],
  ['bnode', /^_:[\w-]+/],
  ['a', /^a(?=[\s<["]|$)/],
  ['lit', /^(?:true|false)(?![\w:-])/],
  ['pn', /^(?:[A-Za-z][\w-]*)?:(?:[\w-]+(?:\.[\w-]+)*)?/],
  ['p', /^[.;,[\]]/],
]

export function lex(src: string): Tok[] {
  const out: Tok[] = []
  let i = 0
  let line = 1
  while (i < src.length) {
    const rest = src.slice(i)
    let m: RegExpMatchArray | null = null
    let t: TokT = 'err'
    for (const [tt, re] of RULES) {
      m = rest.match(re)
      if (m) {
        t = tt
        break
      }
    }
    const text = m ? m[0] : (rest.match(/^\S+?(?=[\s.;,[\]]|$)/)?.[0] ?? rest[0])
    out.push({ t, text, line })
    line += (text.match(/\n/g) ?? []).length
    i += text.length || 1
  }
  return out
}

const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'

export function shortIri(s: string, max = 26): string {
  if (s.length <= max) return s
  const inner = s.replace(/^<|>$/g, '')
  const last = inner.split('/').filter(Boolean).pop() ?? inner
  return last.length + 4 < inner.length ? `<…/${last}>` : s.slice(0, max - 1) + '…'
}

class PErr extends Error {
  constructor(
    msg: string,
    public at: number,
  ) {
    super(msg)
  }
}

export function parse(src: string): Parsed {
  const toks = lex(src)
  const sig = toks.map((t, i) => ({ t, i })).filter((x) => x.t.t !== 'ws' && x.t.t !== 'com')
  const prefixes: Record<string, string> = {}
  const triples: Triple[] = []
  const errors: string[] = []
  let k = 0
  let bn = 0
  const peek = () => sig[k]
  const lineOf = (j: number) => (sig[j] ?? sig[sig.length - 1])?.t.line ?? 1
  const expect = (text: string) => {
    if (peek()?.t.text !== text) throw new PErr(`očekávám „${text}“`, k)
    k++
  }

  const iriTerm = (tok: Tok): Term => {
    if (tok.t === 'iri') return { kind: 'iri', key: tok.text.slice(1, -1), label: shortIri(tok.text), full: tok.text.slice(1, -1) }
    if (tok.t === 'a') return { kind: 'iri', key: RDF + 'type', label: 'rdf:type', full: RDF + 'type' }
    const c = tok.text.indexOf(':')
    const pre = tok.text.slice(0, c)
    if (!(pre in prefixes)) errors.push(`ř. ${tok.line}: neznámý prefix „${pre}:“`)
    const full = (prefixes[pre] ?? pre + ':') + tok.text.slice(c + 1)
    return { kind: 'iri', key: full, label: tok.text, full }
  }

  const blank = (polist: (s: Term, at: number) => void): { term: Term; at: number } => {
    const at = sig[k].i
    k++ // [
    const term: Term = { kind: 'blank', key: `_:b${++bn}`, label: '[ ]', full: `prázdný uzel _:b${bn}` }
    if (peek()?.t.text !== ']') polist(term, at)
    expect(']')
    return { term, at }
  }

  const object = (): { term: Term; at: number } => {
    const x = peek()
    if (!x) throw new PErr('chybí objekt', k)
    if (x.t.text === '[') return blank(predicateObjectList)
    k++
    if (x.t.t === 'iri' || x.t.t === 'pn') return { term: iriTerm(x.t), at: x.i }
    if (x.t.t === 'bnode') return { term: { kind: 'blank', key: x.t.text, label: x.t.text, full: 'prázdný uzel' }, at: x.i }
    if (x.t.t === 'lit' || x.t.t === 'num') {
      let label = x.t.text
      const dt = label.match(/\^\^(.+)$/)
      if (dt && dt[1].startsWith('<')) label = label.replace(dt[1], shortIri(dt[1], 18))
      return { term: { kind: 'lit', key: `lit#${x.i}`, label, full: x.t.t === 'num' ? `${x.t.text} (xsd:integer/decimal)` : x.t.text }, at: x.i }
    }
    throw new PErr(`nečekaný objekt „${x.t.text}“`, k - 1)
  }

  function predicateObjectList(s: Term, sAt: number) {
    for (;;) {
      const v = peek()
      if (!v || !(v.t.t === 'iri' || v.t.t === 'pn' || v.t.t === 'a')) throw new PErr(`očekávám predikát, ne „${v?.t.text ?? 'konec'}“`, k)
      k++
      const p = iriTerm(v.t)
      for (;;) {
        const o = object()
        triples.push({ s, p, o: o.term, toks: [sAt, v.i, o.at] })
        if (peek()?.t.text === ',') {
          k++
          continue
        }
        break
      }
      if (peek()?.t.text === ';') {
        while (peek()?.t.text === ';') k++
        const n = peek()?.t.text
        if (n === '.' || n === ']' || n === undefined) return
        continue
      }
      return
    }
  }

  while (k < sig.length) {
    const start = k
    try {
      const x = peek()
      if (x.t.t === 'dir') {
        const sparql = !x.t.text.startsWith('@')
        k++
        if (/base/i.test(x.t.text)) {
          k++
        } else {
          const name = peek()
          if (!name || name.t.t !== 'pn' || !name.t.text.endsWith(':')) throw new PErr('za @prefix čekám „jmeno:“', k)
          k++
          const iri = peek()
          if (!iri || iri.t.t !== 'iri') throw new PErr('za prefixem čekám <IRI>', k)
          k++
          prefixes[name.t.text.slice(0, -1)] = iri.t.text.slice(1, -1)
        }
        if (!sparql) expect('.')
        continue
      }
      if (x.t.t === 'err') throw new PErr(`neznámý zápis „${x.t.text}“`, k)
      let s: Term
      let sAt = x.i
      if (x.t.text === '[') {
        const b = blank(predicateObjectList)
        s = b.term
        sAt = b.at
        if (peek()?.t.text !== '.') predicateObjectList(s, sAt)
      } else {
        k++
        if (x.t.t === 'iri' || x.t.t === 'pn') s = iriTerm(x.t)
        else if (x.t.t === 'bnode') s = { kind: 'blank', key: x.t.text, label: x.t.text, full: 'prázdný uzel' }
        else throw new PErr(`subjekt nemůže být „${x.t.text}“`, k - 1)
        predicateObjectList(s, sAt)
      }
      expect('.')
    } catch (e) {
      if (!(e instanceof PErr)) throw e
      errors.push(`ř. ${lineOf(e.at)}: ${e.message}`)
      // skip to after the next "."
      k = Math.max(k, start + 1)
      while (k < sig.length && sig[k].t.text !== '.') k++
      k++
    }
  }
  return { toks, triples, errors: [...new Set(errors)] }
}

// ---------------------------------------------------------------------------
// Layered layout: columns by longest path from roots, literals right of their subject.

export type GNode = { key: string; term: Term; x: number; y: number; w: number; h: number; col: number }
export type GEdge = { i: number; d: string; lx: number; ly: number; arrow: string; label: string }
export type Graph = { nodes: GNode[]; edges: GEdge[]; w: number; h: number }

const CW = 7.3 // approx char width of 12px mono

export function layoutGraph(triples: Triple[]): Graph {
  const terms = new Map<string, Term>()
  for (const t of triples) {
    if (!terms.has(t.s.key)) terms.set(t.s.key, t.s)
    if (!terms.has(t.o.key)) terms.set(t.o.key, t.o)
  }
  const keys = [...terms.keys()]
  // DFS from roots to find back edges (cycles), then longest path over the remaining DAG
  const out = new Map<string, number[]>()
  triples.forEach((t, i) => out.set(t.s.key, [...(out.get(t.s.key) ?? []), i]))
  const hasIn = new Set(triples.filter((t) => t.s.key !== t.o.key).map((t) => t.o.key))
  const back = new Set<number>()
  const state = new Map<string, 1 | 2>()
  const dfs = (k: string) => {
    state.set(k, 1)
    for (const i of out.get(k) ?? []) {
      const o = triples[i].o.key
      const st = state.get(o)
      if (st === 1) back.add(i)
      else if (!st) dfs(o)
    }
    state.set(k, 2)
  }
  for (const k of keys) if (!hasIn.has(k) && !state.has(k)) dfs(k)
  for (const k of keys) if (!state.has(k)) dfs(k)
  const depth = new Map(keys.map((k) => [k, 0]))
  for (let it = 0; it <= keys.length; it++) {
    let changed = false
    triples.forEach((t, i) => {
      if (back.has(i) || t.s.key === t.o.key) return
      const d = depth.get(t.s.key)! + 1
      if (d > depth.get(t.o.key)!) {
        depth.set(t.o.key, d)
        changed = true
      }
    })
    if (!changed) break
  }
  const cols: string[][] = []
  for (const k of keys) (cols[depth.get(k)!] ??= []).push(k)
  const size = (t: Term) => ({ w: Math.max(56, t.label.length * CW + (t.kind === 'lit' ? 20 : 30)), h: t.kind === 'lit' ? 28 : 34 })
  const ROWH = 56
  const nodes = new Map<string, GNode>()
  let x = 10
  let maxRows = 0
  cols.forEach((col, ci) => {
    if (!col) return
    if (ci > 0) {
      // order by average row of parents (barycenter)
      const bc = (k: string) => {
        const ps = triples.filter((t) => t.o.key === k && nodes.has(t.s.key)).map((t) => nodes.get(t.s.key)!.y)
        return ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : 1e9
      }
      col.sort((a, b) => bc(a) - bc(b))
    }
    const cw = Math.max(...col.map((k) => size(terms.get(k)!).w))
    col.forEach((k, ri) => {
      const t = terms.get(k)!
      const sz = size(t)
      nodes.set(k, { key: k, term: t, col: ci, x: x + (cw - sz.w) / 2, y: 20 + ri * ROWH + (ROWH - sz.h) / 2, ...sz })
    })
    maxRows = Math.max(maxRows, col.length)
    const longestPred = Math.max(0, ...triples.filter((t) => depth.get(t.s.key) === ci).map((t) => t.p.label.length))
    x += cw + Math.max(70, longestPred * 6.6 + 30)
  })
  // center columns vertically
  const H = 20 + maxRows * ROWH + 20
  for (const col of cols) {
    if (!col) continue
    const ns = col.map((k) => nodes.get(k)!)
    const top = Math.min(...ns.map((n) => n.y))
    const bot = Math.max(...ns.map((n) => n.y + n.h))
    const off = (H - (bot - top)) / 2 - top
    ns.forEach((n) => (n.y += off))
  }
  const pair = new Map<string, number>()
  const edges: GEdge[] = triples.map((t, i) => {
    const a = nodes.get(t.s.key)!
    const b = nodes.get(t.o.key)!
    const pk = `${t.s.key}|${t.o.key}`
    const nth = pair.get(pk) ?? 0
    pair.set(pk, nth + 1)
    const ay = a.y + a.h / 2
    const by = b.y + b.h / 2
    let d: string, c2: [number, number], end: [number, number], lx: number, ly: number
    if (b.col > a.col) {
      const sx = a.x + a.w
      const ex = b.x
      const mx = (sx + ex) / 2
      d = `M${sx},${ay} C${mx},${ay} ${mx},${by} ${ex},${by}`
      c2 = [mx, by]
      end = [ex, by]
      lx = mx
      ly = (ay + by) / 2 - 5 - nth * 14
    } else {
      const sx = a.x + a.w
      const ex = b.x + b.w
      const bulge = 46 + nth * 16
      d = `M${sx},${ay} C${sx + bulge},${ay} ${ex + bulge},${by} ${ex},${by}`
      c2 = [ex + bulge, by]
      end = [ex, by]
      lx = Math.max(sx, ex) + bulge * 0.75
      ly = (ay + by) / 2
    }
    const ang = Math.atan2(end[1] - c2[1], end[0] - c2[0])
    const p1 = [end[0] - 9 * Math.cos(ang - 0.4), end[1] - 9 * Math.sin(ang - 0.4)]
    const p2 = [end[0] - 9 * Math.cos(ang + 0.4), end[1] - 9 * Math.sin(ang + 0.4)]
    return { i, d, lx, ly, arrow: `${end[0]},${end[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`, label: t.p.label }
  })
  const W = Math.max(...[...nodes.values()].map((n) => n.x + n.w), ...edges.map((e) => e.lx + e.label.length * 3.4)) + 14
  return { nodes: [...nodes.values()], edges, w: Math.max(W, 200), h: H }
}
