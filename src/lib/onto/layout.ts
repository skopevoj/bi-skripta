// Geometry for OntoUML diagrams: boxes on a grid, orthogonal routing, generalization trees.
// Pure functions, no DOM — used by the React renderer and by the PNG preview script.
import type { DAssoc, DClass, DGen, Diagram, Mark } from '../../../content/types'
import { CLASS_INFO, REL_INFO } from './info'

export const COL = 210
export const ROW = 130
const PAD_X = 16
const ST_FS = 11.5
const NAME_FS = 14
const ATTR_FS = 11.5
const MARGIN = 28

export type Pt = [number, number]

export type Box = {
  id: string
  cls: DClass
  cx: number
  cy: number
  w: number
  h: number
  x0: number
  y0: number
  x1: number
  y1: number
  headH: number // stereotype + name compartment height
}

export type Label = {
  x: number
  y: number
  text: string
  anchor: 'start' | 'middle' | 'end'
  kind: 'name' | 'st' | 'mult' | 'role' | 'meta' | 'gs'
}

export type Glyph =
  | { kind: 'triangle'; pts: Pt[] } // hollow generalization head
  | { kind: 'diamond'; pts: Pt[]; filled: boolean }
  | { kind: 'dot'; at: Pt }
  | { kind: 'arrow'; pts: Pt[] } // small reading-direction arrow

export type Edge = {
  key: string
  kind: 'gen' | 'assoc' | 'deriv' | 'note'
  ends: string[] // class ids this edge touches (for hover + steps)
  paths: Pt[][]
  dashed?: boolean
  glyphs: Glyph[]
  labels: Label[]
  mark?: Mark
  title?: string // tooltip on hover
}

export type NoteBox = { id: string; x0: number; y0: number; w: number; h: number; lines: string[] }

export type Geometry = {
  boxes: Box[]
  byId: Map<string, Box>
  edges: Edge[]
  notes: NoteBox[]
  view: { x: number; y: number; w: number; h: number }
}

// ---------------------------------------------------------------------------
// text metrics (approximate, font-independent enough for Onest / system sans)

function charW(c: string): number {
  if (' .,:;|!il\'`'.includes(c)) return 0.28
  if ('fjtrI()[]{}1'.includes(c)) return 0.36
  if ('mwMW'.includes(c)) return 0.86
  if (c >= 'A' && c <= 'Z') return 0.66
  if ('«»'.includes(c)) return 0.5
  if (c >= '0' && c <= '9') return 0.56
  return 0.55
}
export function textW(s: string, size: number, bold = false): number {
  let w = 0
  for (const c of s) w += charW(c)
  return w * size * (bold ? 1.07 : 1)
}

export function stText(c: DClass): string {
  const l = CLASS_INFO[c.st].label
  return l ? `«${l}»` : ''
}

function measure(c: DClass): { w: number; h: number; headH: number } {
  const st = stText(c)
  const rows = [...(c.attrs ?? []), ...(c.literals ?? [])]
  const nameW = textW(c.name, NAME_FS, true)
  const stW = textW(st, ST_FS)
  const attrW = Math.max(0, ...rows.map((a) => a.length * ATTR_FS * 0.61 - PAD_X + 12))
  const w = Math.max(124, Math.ceil(Math.max(nameW, stW, attrW) + PAD_X * 2))
  const headH = st ? 50 : 36
  const h = headH + (rows.length ? rows.length * 19 + 12 : 0)
  return { w, h, headH }
}

// ---------------------------------------------------------------------------

function rectHit(b: Box, p: Pt, pad = 0) {
  return p[0] > b.x0 - pad && p[0] < b.x1 + pad && p[1] > b.y0 - pad && p[1] < b.y1 + pad
}

/** Point where the segment from the box center towards `to` leaves the box. */
function clip(b: Box, to: Pt): Pt {
  const dx = to[0] - b.cx
  const dy = to[1] - b.cy
  if (dx === 0 && dy === 0) return [b.cx, b.cy]
  const tx = dx !== 0 ? b.w / 2 / Math.abs(dx) : Infinity
  const ty = dy !== 0 ? b.h / 2 / Math.abs(dy) : Infinity
  const t = Math.min(tx, ty)
  return [b.cx + dx * t, b.cy + dy * t]
}

function triangle(tip: Pt, dir: Pt): Pt[] {
  // dir: unit vector pointing from the line towards the tip
  const L = 15
  const W = 8.5
  const bx = tip[0] - dir[0] * L
  const by = tip[1] - dir[1] * L
  const nx = -dir[1]
  const ny = dir[0]
  return [tip, [bx + nx * W, by + ny * W], [bx - nx * W, by - ny * W]]
}

function diamond(tip: Pt, dir: Pt): Pt[] {
  // dir points from the line into the whole's box (tip on its border)
  const L = 20
  const W = 7
  const mx = tip[0] - dir[0] * (L / 2)
  const my = tip[1] - dir[1] * (L / 2)
  const nx = -dir[1]
  const ny = dir[0]
  return [tip, [mx + nx * W, my + ny * W], [tip[0] - dir[0] * L, tip[1] - dir[1] * L], [mx - nx * W, my - ny * W]]
}

function unit(a: Pt, b: Pt): Pt {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l = Math.hypot(dx, dy) || 1
  return [dx / l, dy / l]
}

// ---------------------------------------------------------------------------
// generalizations

function layoutGen(g: DGen, gi: number, byId: Map<string, Box>, slots: SlotTracker): Edge | null {
  const sup = byId.get(g.general)
  const subs = g.specifics.map((id) => byId.get(id)).filter((b): b is Box => !!b)
  if (!sup || subs.length === 0) return null
  const key = g.id ?? `gen-${gi}`
  const paths: Pt[][] = []
  const glyphs: Glyph[] = []
  const labels: Label[] = []
  const below = subs.filter((s) => s.y0 >= sup.y1 + 24)
  const other = subs.filter((s) => !below.includes(s))

  if (below.length) {
    const ax = slots.bottom(sup, key, below)
    const top = Math.min(...below.map((s) => s.y0))
    const barY = Math.round(sup.y1 + Math.max(22, (top - sup.y1) / 2))
    const drops = below.map((s) => [slots.top(s, key, ax), s.y0] as Pt)
    const xs = [ax, ...drops.map((d) => d[0])]
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const tip: Pt = [ax, sup.y1]
    glyphs.push({ kind: 'triangle', pts: triangle(tip, [0, -1]) })
    if (below.length === 1 && Math.abs(drops[0][0] - ax) < 1) {
      paths.push([[ax, sup.y1 + 15], [ax, drops[0][1]]])
    } else {
      paths.push([[ax, sup.y1 + 15], [ax, barY]])
      if (maxX - minX > 0.5) paths.push([[minX, barY], [maxX, barY]])
      for (const d of drops) paths.push([[d[0], barY], d])
    }
    if (g.set && (g.set.disjoint || g.set.complete || g.set.name)) {
      const flags = [g.set.disjoint ? 'disjoint' : '', g.set.complete ? 'complete' : ''].filter(Boolean).join(', ')
      const txt = [g.set.name, flags ? `{${flags}}` : ''].filter(Boolean).join(' ')
      // put the label to the right of the trunk, just above the bar
      labels.push({ x: ax + 8, y: barY - 7, text: txt, anchor: 'start', kind: 'gs' })
    }
  }
  for (const s of other) {
    // side or upward generalization: straight line from sub to sup
    const a = clip(s, [sup.cx, sup.cy])
    const b = clip(sup, [s.cx, s.cy])
    const d = unit(a, b)
    glyphs.push({ kind: 'triangle', pts: triangle(b, d) })
    paths.push([a, [b[0] - d[0] * 15, b[1] - d[1] * 15]])
  }
  return { key, kind: 'gen', ends: [sup.id, ...subs.map((s) => s.id)], paths, glyphs, labels, mark: g.mark }
}

/** Distributes several edge anchors along a box side so they don't overlap. */
class SlotTracker {
  private used = new Map<string, number[]>()
  private take(id: string, want: number, b: Box): number {
    const arr = this.used.get(id) ?? []
    let x = want
    const minGap = 26
    const lo = b.x0 + 14
    const hi = b.x1 - 14
    for (let tries = 0; tries < 8 && arr.some((u) => Math.abs(u - x) < minGap); tries++) {
      x = want + (tries % 2 === 0 ? 1 : -1) * minGap * Math.ceil((tries + 1) / 2)
    }
    x = Math.min(hi, Math.max(lo, x))
    arr.push(x)
    this.used.set(id, arr)
    return x
  }
  bottom(b: Box, _key: string, subs: Box[]): number {
    // anchor towards the children's center of mass, but stay near the middle
    const mid = subs.reduce((s, x) => s + x.cx, 0) / subs.length
    const want = Math.min(b.x1 - 20, Math.max(b.x0 + 20, b.cx + (mid - b.cx) * 0.0))
    return this.take(`${b.id}:b`, want, b)
  }
  top(b: Box, _key: string, fromX: number): number {
    const want = b.cx + Math.max(-b.w / 4, Math.min(b.w / 4, (fromX - b.cx) * 0))
    return this.take(`${b.id}:t`, want, b)
  }
  side(b: Box, side: 't' | 'b' | 'l' | 'r', want: number): number {
    const arr = this.used.get(`${b.id}:${side}`) ?? []
    let v = want
    const lo = side === 't' || side === 'b' ? b.x0 + 12 : b.y0 + 10
    const hi = side === 't' || side === 'b' ? b.x1 - 12 : b.y1 - 10
    for (let tries = 0; tries < 8 && arr.some((u) => Math.abs(u - v) < 18); tries++) {
      v = want + (tries % 2 === 0 ? 1 : -1) * 18 * Math.ceil((tries + 1) / 2)
    }
    v = Math.min(hi, Math.max(lo, v))
    arr.push(v)
    this.used.set(`${b.id}:${side}`, arr)
    return v
  }
}

// ---------------------------------------------------------------------------
// associations

function segLen(a: Pt, b: Pt) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function routeAssoc(a: Box, b: Box, as: DAssoc, boxes: Box[], slots: SlotTracker, offset: number): Pt[] {
  const route = as.route ?? 'auto'
  const ox0 = Math.max(a.x0, b.x0)
  const ox1 = Math.min(a.x1, b.x1)
  const oy0 = Math.max(a.y0, b.y0)
  const oy1 = Math.min(a.y1, b.y1)
  if (route === 'straight') {
    const p = clip(a, [b.cx, b.cy])
    const q = clip(b, [a.cx, a.cy])
    return [p, q]
  }
  if (route === 'auto' && ox1 - ox0 > 30) {
    // vertical
    const x = (ox0 + ox1) / 2 + offset
    const down = b.cy > a.cy
    return [[x, down ? a.y1 : a.y0], [x, down ? b.y0 : b.y1]]
  }
  if (route === 'auto' && oy1 - oy0 > 20) {
    const y = (oy0 + oy1) / 2 + offset
    const right = b.cx > a.cx
    return [[right ? a.x1 : a.x0, y], [right ? b.x0 : b.x1, y]]
  }
  // elbow
  const hv = (): Pt[] => {
    const right = b.cx > a.cx
    const down = b.cy > a.cy
    const y = slots.side(a, right ? 'r' : 'l', a.cy + offset)
    const x = slots.side(b, down ? 't' : 'b', b.cx + (right ? -1 : 1) * Math.min(b.w / 4, 30))
    return [[right ? a.x1 : a.x0, y], [x, y], [x, down ? b.y0 : b.y1]]
  }
  const vh = (): Pt[] => {
    const right = b.cx > a.cx
    const down = b.cy > a.cy
    const x = slots.side(a, down ? 'b' : 't', a.cx + (right ? 1 : -1) * Math.min(a.w / 4, 30))
    const y = slots.side(b, right ? 'l' : 'r', b.cy + offset)
    return [[x, down ? a.y1 : a.y0], [x, y], [right ? b.x0 : b.x1, y]]
  }
  const blocked = (pts: Pt[]) =>
    boxes.some((o) => o !== a && o !== b && pts.some((p, i) => i > 0 && segHitsBox(pts[i - 1], p, o)))
  if (route === 'hv') return hv()
  if (route === 'vh') return vh()
  const h = hv()
  if (!blocked(h)) return h
  const v = vh()
  return blocked(v) ? h : v
}

function segHitsBox(p: Pt, q: Pt, o: Box): boolean {
  for (let t = 0.05; t < 1; t += 0.05) {
    const x = p[0] + (q[0] - p[0]) * t
    const y = p[1] + (q[1] - p[1]) * t
    if (rectHit(o, [x, y], 4)) return true
  }
  return false
}

function endLabels(p: Pt, toward: Pt, mult?: string, role?: string, glyph = 0): Label[] {
  const d = unit(p, toward)
  const out: Label[] = []
  const horiz = Math.abs(d[0]) > Math.abs(d[1])
  const along = 9 + glyph
  const bx = p[0] + d[0] * along
  const by = p[1] + d[1] * along
  if (horiz) {
    const anchor = d[0] > 0 ? 'start' : 'end'
    if (mult) out.push({ x: bx, y: by - 6, text: mult, anchor, kind: 'mult' })
    if (role) out.push({ x: bx, y: by + 15, text: role, anchor, kind: 'role' })
  } else {
    const y = d[1] > 0 ? by + 9 : by - 2
    if (mult) out.push({ x: bx + 7, y, text: mult, anchor: 'start', kind: 'mult' })
    if (role) out.push({ x: bx - 7, y, text: role, anchor: 'end', kind: 'role' })
  }
  return out
}

function layoutAssoc(as: DAssoc, ai: number, byId: Map<string, Box>, boxes: Box[], slots: SlotTracker, offset: number): Edge | null {
  const a = byId.get(as.from)
  const b = byId.get(as.to)
  if (!a || !b) return null
  const pts = routeAssoc(a, b, as, boxes, slots, offset)
  const glyphs: Glyph[] = []
  const labels: Label[] = []
  let path = pts
  // part–whole diamond at the whole end
  if (as.whole) {
    const atEnd = as.whole === 'to'
    const tip = atEnd ? pts[pts.length - 1] : pts[0]
    const prev = atEnd ? pts[pts.length - 2] : pts[1]
    const d = unit(prev, tip)
    const dm = diamond(tip, d)
    glyphs.push({ kind: 'diamond', pts: dm, filled: !as.shareable })
    const cut: Pt = dm[2]
    path = atEnd ? [...pts.slice(0, -1), cut] : [cut, ...pts.slice(1)]
  }
  // name/stereotype: on the longest segment, unless it is too short for the text next to the end labels
  const st0 = as.st && as.st !== 'none' ? `«${REL_INFO[as.st].label}»` : ''
  const need = Math.max(textW(st0, 11), textW(as.name ?? '', 12)) + 80
  const segs = pts.slice(1).map((p, i) => ({ i, len: segLen(pts[i], p), horiz: Math.abs(p[0] - pts[i][0]) >= Math.abs(p[1] - pts[i][1]) }))
  segs.sort((x, y) => y.len - x.len)
  const fit = segs.find((x) => (x.horiz ? x.len >= need : x.len >= 70))
  const best = (fit ?? segs[0]).i
  const s0 = pts[best]
  const s1 = pts[best + 1]
  const mx = (s0[0] + s1[0]) / 2
  const my = (s0[1] + s1[1]) / 2
  const horiz = Math.abs(s1[0] - s0[0]) >= Math.abs(s1[1] - s0[1])
  const st = as.st && as.st !== 'none' ? `«${REL_INFO[as.st].label}»` : ''
  const lines = [st, as.name ?? ''].filter(Boolean)
  const meta = as.meta?.length ? `{${as.meta.join(', ')}}` : ''
  if (horiz) {
    let y = my - 8 - (lines.length - 1) * 14
    lines.forEach((t, i) => labels.push({ x: mx, y: y + i * 14, text: t, anchor: 'middle', kind: i === 0 && st ? 'st' : 'name' }))
    if (meta) labels.push({ x: mx, y: my + 17, text: meta, anchor: 'middle', kind: 'meta' })
  } else {
    let y = my - ((lines.length + (meta ? 1 : 0) - 1) * 14) / 2 + 4
    lines.forEach((t, i) => labels.push({ x: mx + 9, y: y + i * 14, text: t, anchor: 'start', kind: i === 0 && st ? 'st' : 'name' }))
    if (meta) labels.push({ x: mx + 9, y: y + lines.length * 14, text: meta, anchor: 'start', kind: 'meta' })
  }
  labels.push(...endLabels(pts[0], pts[1], as.fromMult, as.fromRole, as.whole === 'from' ? 20 : 0))
  labels.push(...endLabels(pts[pts.length - 1], pts[pts.length - 2], as.toMult, as.toRole, as.whole === 'to' ? 20 : 0))
  return {
    key: as.id ?? `as-${ai}`,
    kind: 'assoc',
    ends: [a.id, b.id],
    paths: [path],
    glyphs,
    labels,
    mark: as.mark,
    title: as.st ? REL_INFO[as.st].desc : undefined,
  }
}

// ---------------------------------------------------------------------------

function wrap(text: string, max = 30): string[] {
  const out: string[] = []
  for (const para of text.split('\n')) {
    let line = ''
    for (const w of para.split(/\s+/)) {
      if (line && (line + ' ' + w).length > max) {
        out.push(line)
        line = w
      } else line = line ? line + ' ' + w : w
    }
    out.push(line)
  }
  return out
}

export function layout(d: Diagram): Geometry {
  const boxes: Box[] = d.classes.map((c) => {
    const m = measure(c)
    const cx = c.x * COL
    const cy = c.y * ROW
    return { id: c.id, cls: c, cx, cy, w: m.w, h: m.h, headH: m.headH, x0: cx - m.w / 2, y0: cy - m.h / 2, x1: cx + m.w / 2, y1: cy + m.h / 2 }
  })
  const byId = new Map(boxes.map((b) => [b.id, b]))
  const slots = new SlotTracker()
  const edges: Edge[] = []
  ;(d.gens ?? []).forEach((g, i) => {
    const e = layoutGen(g, i, byId, slots)
    if (e) edges.push(e)
  })
  const pairCount = new Map<string, number>()
  const assocEdges = new Map<string, Edge>()
  ;(d.assocs ?? []).forEach((a, i) => {
    const pk = [a.from, a.to].sort().join('|')
    const k = pairCount.get(pk) ?? 0
    pairCount.set(pk, k + 1)
    const offset = k === 0 ? 0 : (k % 2 ? 1 : -1) * 22 * Math.ceil(k / 2)
    const e = layoutAssoc(a, i, byId, boxes, slots, offset)
    if (e) {
      edges.push(e)
      assocEdges.set(e.key, e)
    }
  })
  for (const dv of d.derivations ?? []) {
    const rel = byId.get(dv.relator)
    const as = assocEdges.get(dv.assoc)
    if (!rel || !as) continue
    // attach to the middle of the material relation's longest segment
    const p = as.paths[0]
    let bi = 0
    for (let i = 1; i < p.length; i++) if (segLen(p[i - 1], p[i]) > segLen(p[bi], p[bi + 1] ?? p[bi])) bi = i - 1
    const mid: Pt = [(p[bi][0] + p[bi + 1][0]) / 2, (p[bi][1] + p[bi + 1][1]) / 2]
    const q = clip(rel, mid)
    edges.push({
      key: `der-${dv.assoc}`,
      kind: 'deriv',
      ends: [rel.id, ...as.ends],
      paths: [[mid, q]],
      dashed: true,
      glyphs: [{ kind: 'dot', at: q }],
      labels: [],
      title: 'derivation: materiální vztah je odvozen z relátoru',
    })
  }
  const notes: NoteBox[] = (d.notes ?? []).map((n) => {
    const lines = wrap(n.text)
    const w = Math.max(110, Math.max(...lines.map((l) => textW(l, 12.5))) + 26)
    const h = lines.length * 17 + 18
    const cx = n.x * COL
    const cy = n.y * ROW
    const nb: NoteBox = { id: n.id, x0: cx - w / 2, y0: cy - h / 2, w, h, lines }
    for (const t of n.attach ?? []) {
      const b = byId.get(t)
      if (!b) continue
      const nbBox: Box = { ...b, id: n.id, cx, cy, w, h, x0: nb.x0, y0: nb.y0, x1: nb.x0 + w, y1: nb.y0 + h }
      edges.push({ key: `note-${n.id}-${t}`, kind: 'note', ends: [t], paths: [[clip(nbBox, [b.cx, b.cy]), clip(b, [cx, cy])]], dashed: true, glyphs: [], labels: [] })
    }
    return nb
  })

  // bounds
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  const grow = (x: number, y: number) => {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
  }
  for (const b of boxes) { grow(b.x0, b.y0); grow(b.x1, b.y1) }
  for (const n of notes) { grow(n.x0, n.y0); grow(n.x0 + n.w, n.y0 + n.h) }
  for (const e of edges) {
    for (const p of e.paths) for (const q of p) grow(q[0], q[1])
    for (const l of e.labels) {
      const w = textW(l.text, 12)
      const lx = l.anchor === 'start' ? l.x : l.anchor === 'end' ? l.x - w : l.x - w / 2
      grow(lx, l.y - 12); grow(lx + w, l.y + 4)
    }
  }
  if (!isFinite(x0)) { x0 = 0; y0 = 0; x1 = 100; y1 = 100 }
  return { boxes, byId, edges, notes, view: { x: x0 - MARGIN, y: y0 - MARGIN, w: x1 - x0 + MARGIN * 2, h: y1 - y0 + MARGIN * 2 } }
}

/** Visible class ids at a given build-up step (cumulative). */
export function visibleAt(d: Diagram, step: number | null): Set<string> | null {
  if (!d.steps || step === null) return null
  const s = new Set<string>()
  d.steps.slice(0, step + 1).forEach((x) => x.add.forEach((id) => s.add(id)))
  return s
}
