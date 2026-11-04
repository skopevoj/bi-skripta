// Pure model for the dispatch tracer: a linear class chain (A <: ... ), parameterless methods
// whose bodies are `k`, `super.n op k` or `n op k` (this-call), overloaded top-level functions
// `def f(x: T) = x.n op k`, and `val obj: S = R(); println(f(obj))`.
// Semantics (Scala 3): overload = most specific applicable alternative by the STATIC type of
// the argument; `x.n` must be a member of the parameter's static type; the body runs from the
// RUNTIME class; `super.n` = nearest implementation above the class where the code is written;
// `n` (this-call) dispatches again from the runtime class.

export type Op = '+' | '*'
export type Term = { k: 'const'; v: number } | { k: 'super'; m: string } | { k: 'self'; m: string }
export type Body = { t: Term; op?: Op; n?: number }
export type Method = { name: string; body: Body }
export type Cls = { name: string; methods: Method[] }
export type Overload = { param: number; m: string; op?: Op; n?: number }
export type Program = {
  id: string
  label: string
  classes: Cls[] // classes[i] extends classes[i - 1]
  fn: string
  overloads: Overload[] // sorted by param index
  staticT: number
  runtimeT: number
}

export type Line = { text: string; id?: string }

export const lid = {
  cls: (i: number) => `c${i}`,
  meth: (i: number, m: string) => `m${i}.${m}`,
  ov: (j: number) => `o${j}`,
  val: 'val',
  call: 'call',
}

const fmtBody = (b: Body) => {
  const t = b.t.k === 'const' ? String(b.t.v) : b.t.k === 'super' ? `super.${b.t.m}` : b.t.m
  return b.op ? `${t} ${b.op} ${b.n}` : t
}
const fmtOvBody = (o: Overload) => (o.op ? `x.${o.m} ${o.op} ${o.n}` : `x.${o.m}`)

/** Index of the nearest class at or above `from` that defines `m`, or -1. */
export function findImpl(p: Program, from: number, m: string): number {
  for (let i = from; i >= 0; i--) if (p.classes[i].methods.some((x) => x.name === m)) return i
  return -1
}

export function renderLines(p: Program, topLevel = true): Line[] {
  const L: Line[] = []
  p.classes.forEach((c, i) => {
    const head = i === 0 ? `class ${c.name}` : `class ${c.name} extends ${p.classes[i - 1].name}`
    L.push({ text: c.methods.length ? head + ':' : head, id: lid.cls(i) })
    for (const m of c.methods) {
      const ov = i > 0 && findImpl(p, i - 1, m.name) >= 0
      L.push({ text: `  ${ov ? 'override ' : ''}def ${m.name} = ${fmtBody(m.body)}`, id: lid.meth(i, m.name) })
    }
    if (!topLevel) L.push({ text: '' })
  })
  if (topLevel) L.push({ text: '' })
  p.overloads.forEach((o, j) => {
    L.push({ text: `def ${p.fn}(x: ${p.classes[o.param].name}) = ${fmtOvBody(o)}`, id: lid.ov(j) })
  })
  L.push({ text: '' })
  const ind = topLevel ? '' : '  '
  L.push({ text: `${ind}val obj: ${p.classes[p.staticT].name} = ${p.classes[p.runtimeT].name}()`, id: lid.val })
  L.push({ text: `${ind}println(${p.fn}(obj))`, id: lid.call })
  return L
}

/** Complete Scala 3 source (used for verification and for "open in editor"). */
export function renderScala(p: Program, wrap?: string): string {
  const L = renderLines(p, false).map((l) => l.text)
  const at = L.findIndex((l) => l.startsWith('  val obj'))
  const body = [...L.slice(0, at), wrap ? `def run(): Unit =` : `@main def run() =`, ...L.slice(at)]
  if (!wrap) return body.join('\n')
  return [`object ${wrap}:`, ...body.map((l) => (l ? '  ' + l : l))].join('\n')
}

// ---------------------------------------------------------------------------

export type Frame = {
  depth: number
  cls: number
  m: string
  expr: string
  via: string // how we got here, e.g. "obj je D" / "super v C" / "this je D"
  value: number
  line: string
}

export type Step = { title: string; html: string; lines: string[]; ce?: boolean; fact: string }

export type Trace = {
  steps: Step[]
  output: string // number as string, or 'CE'
  ceReason?: string
}

const code = (s: string) => `<code>${s.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</code>`

export function trace(p: Program): Trace {
  const C = (i: number) => p.classes[i].name
  const S = p.staticT
  const R = p.runtimeT
  const steps: Step[] = []

  // 1. static types
  steps.push({
    title: 'Statické typy',
    html: `${code(`obj`)} je deklarované jako ${code(C(S))} → statický typ argumentu ve volání ${code(`${p.fn}(obj)`)} je ${code(C(S))}. Co je za ${code('=')}, teď nehraje roli.`,
    lines: [lid.val, lid.call],
    fact: `statický typ ${C(S)}`,
  })

  // 2. overload (compile time) + check of the bodies
  const applicable = p.overloads.map((o) => o.param <= S)
  const bad = p.overloads.map((o) => findImpl(p, o.param, o.m) < 0)
  const rows = p.overloads
    .map((o, j) => {
      const sig = `${p.fn}(x: ${C(o.param)})`
      const a = applicable[j] ? `${C(S)} &lt;: ${C(o.param)} ✓` : `${C(S)} není podtyp ${C(o.param)} ✗`
      return `<li>${code(sig)} — ${a}</li>`
    })
    .join('')
  let chosen = -1
  p.overloads.forEach((o, j) => {
    if (applicable[j] && (chosen < 0 || o.param > p.overloads[chosen].param)) chosen = j
  })
  const firstBad = bad.indexOf(true)
  if (firstBad >= 0) {
    const o = p.overloads[firstBad]
    const reason = `value ${o.m} is not a member of ${C(o.param)}`
    steps.push({
      title: 'Výběr overloadu (compile time)',
      html: `Definice ${code(`${p.fn}(x: ${C(o.param)}) = x.${o.m}…`)} se nezkompiluje: ${code(o.m)} je definovaná až v ${code(C(firstDefiner(p, o.m)))}, ale ${code('x')} má statický typ ${code(C(o.param))}. Na ${code('x')} smíš volat jen metody statického typu.`,
      lines: [lid.ov(firstBad)],
      ce: true,
      fact: 'CE',
    })
    return { steps, output: 'CE', ceReason: reason }
  }
  if (chosen < 0) {
    steps.push({
      title: 'Výběr overloadu (compile time)',
      html: `Kandidáti:<ul>${rows}</ul>Žádný overload nebere ${code(C(S))} → <strong>compile error</strong> (<em>None of the overloaded alternatives … match arguments (${C(S)})</em>). Na runtime třídě ${code(C(R))} nezáleží — overload se vybírá jen podle statického typu.`,
      lines: p.overloads.map((_, j) => lid.ov(j)).concat(lid.val, lid.call),
      ce: true,
      fact: 'CE',
    })
    return { steps, output: 'CE', ceReason: `None of the overloaded alternatives of method ${p.fn} match arguments (${C(S)})` }
  }
  const ch = p.overloads[chosen]
  steps.push({
    title: 'Výběr overloadu (compile time)',
    html: `Kandidáti:<ul>${rows}</ul>Nejspecifičtější použitelný je ${code(`${p.fn}(x: ${C(ch.param)})`)}. Tahle volba je pevná, za běhu se už nemění.`,
    lines: [lid.ov(chosen), lid.call],
    fact: `${p.fn}(x: ${C(ch.param)})`,
  })

  // 3. runtime class
  steps.push({
    title: 'Runtime třída',
    html: `Objekt vznikl jako ${code(`${C(R)}()`)} → runtime třída je ${code(C(R))}${R !== S ? ` (ne ${code(C(S))})` : ''}.`,
    lines: [lid.val],
    fact: `runtime ${C(R)}`,
  })

  // 4. dispatch of x.m
  const impl = findImpl(p, R, ch.m)
  steps.push({
    title: 'Dynamický dispatch',
    html: `V těle ${code(fmtOvBody(ch))} se volá ${code(`x.${ch.m}`)}. Hledám od runtime třídy ${code(C(R))} nahoru první třídu, která ${code(ch.m)} definuje → ${code(`${C(impl)}.${ch.m}`)}.`,
    lines: [lid.ov(chosen), lid.meth(impl, ch.m)],
    fact: `${C(impl)}.${ch.m}`,
  })

  // 5. evaluation
  const frames: Frame[] = []
  const ev = (cls: number, m: string, depth: number, via: string): number => {
    const meth = p.classes[cls].methods.find((x) => x.name === m)!
    const fr: Frame = { depth, cls, m, expr: fmtBody(meth.body), via, value: 0, line: lid.meth(cls, m) }
    frames.push(fr)
    let v: number
    const t = meth.body.t
    if (t.k === 'const') v = t.v
    else if (t.k === 'super') {
      const s = findImpl(p, cls - 1, t.m)
      v = ev(s, t.m, depth + 1, `super v ${C(cls)}`)
    } else {
      const s = findImpl(p, R, t.m)
      v = ev(s, t.m, depth + 1, `this je ${C(R)}`)
    }
    if (meth.body.op) v = meth.body.op === '+' ? v + meth.body.n! : v * meth.body.n!
    fr.value = v
    return v
  }
  const inner = ev(impl, ch.m, 0, `obj je ${C(R)}`)
  const out = ch.op ? (ch.op === '+' ? inner + ch.n! : inner * ch.n!) : inner
  const fin = ch.op ? `${inner} ${ch.op} ${ch.n} = <strong>${out}</strong>` : `<strong>${out}</strong>`
  steps.push({
    title: 'Vyhodnocení (super / this)',
    html:
      `<ol class="ix-frames">${frames
        .map(
          (f) =>
            `<li style="--d:${f.depth}"><span class="ix-fn">${C(f.cls)}.${f.m}</span> <code>${f.expr}</code> <span class="ix-via">${f.via}</span> <span class="ix-val">= ${f.value}</span></li>`,
        )
        .join('')}</ol>` + `Nakonec ${code(fmtOvBody(ch))}: ${fin}`,
    lines: [...new Set(frames.map((f) => f.line)), lid.ov(chosen)],
    fact: String(out),
  })
  return { steps, output: String(out) }
}

function firstDefiner(p: Program, m: string): number {
  return p.classes.findIndex((c) => c.methods.some((x) => x.name === m))
}

// ---------------------------------------------------------------------------
// Presets (sample midterm 2026, questions 3 and 7) and the random generator.

const k = (v: number): Term => ({ k: 'const', v })
const sup = (m: string): Term => ({ k: 'super', m })
const me = (m: string): Term => ({ k: 'self', m })

export const PRESETS: Program[] = [
  {
    id: 'q3',
    label: 'Sample, otázka 3',
    classes: [
      { name: 'A', methods: [{ name: 'm', body: { t: k(1) } }] },
      { name: 'B', methods: [{ name: 'm', body: { t: sup('m'), op: '+', n: 1 } }] },
      { name: 'C', methods: [{ name: 'm', body: { t: sup('m'), op: '+', n: 2 } }] },
      { name: 'D', methods: [{ name: 'm', body: { t: sup('m'), op: '+', n: 3 } }] },
    ],
    fn: 'eval',
    overloads: [
      { param: 0, m: 'm' },
      { param: 2, m: 'm', op: '*', n: 10 },
      { param: 3, m: 'm', op: '*', n: 100 },
    ],
    staticT: 2,
    runtimeT: 3,
  },
  {
    id: 'q7',
    label: 'Sample, otázka 7',
    classes: [
      {
        name: 'A',
        methods: [
          { name: 'x', body: { t: k(1) } },
          { name: 'y', body: { t: me('x'), op: '+', n: 1 } },
          { name: 'z', body: { t: me('y'), op: '+', n: 2 } },
        ],
      },
      { name: 'B', methods: [{ name: 'x', body: { t: k(2) } }] },
      { name: 'C', methods: [{ name: 'y', body: { t: sup('y'), op: '*', n: 10 } }] },
    ],
    fn: 'compute',
    overloads: [
      { param: 0, m: 'z' },
      { param: 1, m: 'z', op: '*', n: 10 },
      { param: 2, m: 'z', op: '+', n: 100 },
    ],
    staticT: 1,
    runtimeT: 2,
  },
  {
    id: 'ce1',
    label: 'Chyták: žádný overload',
    classes: [
      { name: 'A', methods: [{ name: 'm', body: { t: k(1) } }] },
      { name: 'B', methods: [{ name: 'm', body: { t: sup('m'), op: '*', n: 2 } }] },
      { name: 'C', methods: [{ name: 'm', body: { t: sup('m'), op: '+', n: 5 } }] },
    ],
    fn: 'eval',
    overloads: [
      { param: 1, m: 'm', op: '*', n: 10 },
      { param: 2, m: 'm', op: '*', n: 100 },
    ],
    staticT: 0,
    runtimeT: 2,
  },
]

export type Rng = () => number
const pick = <T,>(r: Rng, a: T[]): T => a[Math.floor(r() * a.length)]
const int = (r: Rng, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1))

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NAMES = ['A', 'B', 'C', 'D']
const OV_OPS: Array<{ op?: Op; n?: number }> = [{}, { op: '*', n: 10 }, { op: '*', n: 100 }, { op: '+', n: 100 }, { op: '+', n: 10 }]

export function generate(r: Rng, id = 'rnd'): Program {
  const n = int(r, 3, 4)
  const style = r() < 0.5 ? 'm' : 'xyz'
  const classes: Cls[] = NAMES.slice(0, n).map((name) => ({ name, methods: [] }))
  let callM: string

  if (style === 'm') {
    callM = 'm'
    // m is usually introduced in A; sometimes only in B (→ possible CE trap)
    const intro = r() < 0.2 ? 1 : 0
    for (let i = 0; i < intro; i++) classes[i].methods.push({ name: 'n' + i, body: { t: k(int(r, 1, 3)) } })
    classes[intro].methods.push({ name: 'm', body: { t: k(int(r, 1, 3)) } })
    for (let i = intro + 1; i < n; i++) {
      if (r() < 0.2) continue
      const body: Body =
        r() < 0.85 ? { t: sup('m'), op: r() < 0.7 ? '+' : '*', n: int(r, 2, 5) } : { t: k(int(r, 4, 9)) }
      classes[i].methods.push({ name: 'm', body })
    }
    // keep only meaningful helper methods: drop the "n0" filler (it would just add noise)
    for (const c of classes) c.methods = c.methods.filter((m) => m.name === 'm')
  } else {
    callM = 'z'
    classes[0].methods.push(
      { name: 'x', body: { t: k(1) } },
      { name: 'y', body: { t: me('x'), op: pick(r, ['+', '*'] as Op[]), n: int(r, 1, 3) } },
      { name: 'z', body: { t: me('y'), op: '+', n: int(r, 1, 3) } },
    )
    const order = ['x', 'y', 'z']
    for (let i = 1; i < n; i++) {
      if (r() < 0.15) continue
      const m = pick(r, order)
      const idx = order.indexOf(m)
      let body: Body
      const roll = r()
      if (m === 'x' || roll < 0.3) body = { t: k(int(r, 2, 5)) }
      else if (roll < 0.75) body = { t: sup(m), op: r() < 0.5 ? '*' : '+', n: r() < 0.5 ? 10 : int(r, 2, 5) }
      else body = { t: me(order[int(r, 0, idx - 1)]), op: '+', n: int(r, 1, 5) }
      classes[i].methods.push({ name: m, body })
    }
  }

  // overloads: 2–3 distinct parameter classes
  const cnt = Math.min(n, int(r, 2, 3))
  const params = shuffle(r, [...Array(n).keys()]).slice(0, cnt).sort((a, b) => a - b)
  const ops = shuffle(r, OV_OPS.slice())
  const overloads: Overload[] = params.map((param, j) => ({ param, m: callM, ...ops[j] }))
  const staticT = int(r, 0, n - 2)
  const runtimeT = int(r, staticT + (r() < 0.85 ? 1 : 0), n - 1)
  return { id, label: 'Náhodný', classes, fn: style === 'm' ? 'eval' : 'compute', overloads, staticT, runtimeT }
}

function shuffle<T>(r: Rng, a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
