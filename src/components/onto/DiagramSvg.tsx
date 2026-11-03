// Pure SVG rendering of a laid-out OntoUML diagram. No hooks — also used by the PNG preview script.
import type { Geometry, Pt, Box } from '../../lib/onto/layout'
import { stText } from '../../lib/onto/layout'
import { CLASS_INFO } from '../../lib/onto/info'

export type DiagramStyle = 'klasik' | 'moderni' | 'tisk' | 'vyrazny'

export const STYLES: { id: DiagramStyle; label: string }[] = [
  { id: 'moderni', label: 'Moderní' },
  { id: 'klasik', label: 'Klasik' },
  { id: 'vyrazny', label: 'Výrazný' },
  { id: 'tisk', label: 'Tisk' },
]

const STYLE_CFG: Record<DiagramStyle, { r: number; er: number }> = {
  klasik: { r: 3, er: 0 },
  moderni: { r: 11, er: 9 },
  tisk: { r: 0, er: 0 },
  vyrazny: { r: 8, er: 6 },
}

/** Polyline with rounded corners. */
function pathD(pts: Pt[], r: number): string {
  if (pts.length < 2) return ''
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1]
    const [x, y] = pts[i]
    const [nx, ny] = pts[i + 1]
    const l1 = Math.hypot(x - px, y - py)
    const l2 = Math.hypot(nx - x, ny - y)
    const rr = Math.min(r, l1 / 2, l2 / 2)
    if (rr < 0.5) {
      d += ` L${x},${y}`
      continue
    }
    const ax = x - ((x - px) / l1) * rr
    const ay = y - ((y - py) / l1) * rr
    const bx = x + ((nx - x) / l2) * rr
    const by = y + ((ny - y) / l2) * rr
    d += ` L${ax},${ay} Q${x},${y} ${bx},${by}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last[0]},${last[1]}`
}

const poly = (pts: Pt[]) => pts.map((p) => p.join(',')).join(' ')

export type SvgState = {
  visible?: Set<string> | null // build-up step
  hover?: string | null // hovered class id
  related?: Set<string> | null // ids related to hover
  famFocus?: string | null // legend focus (family or stereotype)
}

function rigidGlyph(b: Box) {
  const info = CLASS_INFO[b.cls.st]
  if (!info.rigidity) return null
  const x = b.x1 - 13
  const y = b.y0 + 13
  // ■ rigid, ◧ semi-rigid, □ anti-rigid
  return (
    <g className="od-rig" aria-hidden="true">
      <rect x={x - 4} y={y - 4} width={8} height={8} rx={1.5} className="od-rig-o" />
      {info.rigidity === 'rigidní' && <rect x={x - 4} y={y - 4} width={8} height={8} rx={1.5} className="od-rig-f" />}
      {info.rigidity === 'semi-rigidní' && <path d={`M${x - 4},${y + 4} L${x - 4},${y - 2.5} Q${x - 4},${y - 4} ${x - 2.5},${y - 4} L${x},${y - 4} L${x},${y + 4} Z`} className="od-rig-f" />}
    </g>
  )
}

export function DiagramSvg({ g, style, uid, state = {}, title }: { g: Geometry; style: DiagramStyle; uid: string; state?: SvgState; title?: string }) {
  const cfg = STYLE_CFG[style]
  const vis = state.visible
  const isVis = (id: string) => !vis || vis.has(id)
  const edgeVis = (ends: string[]) => !vis || ends.every((e) => vis.has(e))
  const dimNode = (id: string) => {
    if (state.hover) return !(state.related?.has(id) ?? false)
    if (state.famFocus) {
      const c = g.byId.get(id)?.cls
      if (!c) return false
      return c.st !== state.famFocus && CLASS_INFO[c.st].family !== state.famFocus
    }
    return false
  }
  const dimEdge = (ends: string[]) => {
    if (state.hover) return !ends.includes(state.hover)
    if (state.famFocus) return true
    return false
  }
  const v = g.view
  return (
    <svg
      className="od-svg"
      viewBox={`${v.x} ${v.y} ${v.w} ${v.h}`}
      width={v.w}
      height={v.h}
      role="img"
      aria-label={title ?? 'OntoUML diagram'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {g.boxes.map((b) => (
          <clipPath key={b.id} id={`${uid}-c-${b.id}`}>
            <rect x={b.x0} y={b.y0} width={b.w} height={b.h} rx={cfg.r} />
          </clipPath>
        ))}
        <pattern id={`${uid}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.9" className="od-gridpt" />
        </pattern>
      </defs>
      <rect x={v.x} y={v.y} width={v.w} height={v.h} className="od-bg" fill={`url(#${uid}-dots)`} />

      {/* edges below nodes */}
      <g className="od-edges">
        {g.edges.map((e) => {
          if (!edgeVis(e.ends)) return null
          const dim = dimEdge(e.ends)
          return (
            <g key={e.key} className="od-e" data-kind={e.kind} data-mark={e.mark} data-dim={dim || undefined} data-hot={state.hover && !dim ? true : undefined}>
              {e.title && <title>{e.title}</title>}
              {e.paths.map((p, i) => (
                <path key={i} d={pathD(p, cfg.er)} className="od-line" data-dash={e.dashed || undefined} fill="none" />
              ))}
              {e.glyphs.map((gl, i) =>
                gl.kind === 'triangle' ? (
                  <polygon key={i} points={poly(gl.pts)} className="od-tri" />
                ) : gl.kind === 'diamond' ? (
                  <polygon key={i} points={poly(gl.pts)} className={gl.filled ? 'od-dia od-fill' : 'od-dia'} />
                ) : gl.kind === 'dot' ? (
                  <circle key={i} cx={gl.at[0]} cy={gl.at[1]} r={4.6} className="od-dot" />
                ) : (
                  <polygon key={i} points={poly(gl.pts)} className="od-dot" />
                ),
              )}
              {e.labels.map((l, i) => (
                <text key={i} x={l.x} y={l.y} textAnchor={l.anchor} className="od-lab" data-k={l.kind}>
                  {l.text}
                </text>
              ))}
            </g>
          )
        })}
      </g>

      {/* notes */}
      {g.notes.map((n) => {
        const f = 10
        const x1 = n.x0 + n.w
        return (
          <g key={n.id} className="od-note">
            <path d={`M${n.x0},${n.y0} L${x1 - f},${n.y0} L${x1},${n.y0 + f} L${x1},${n.y0 + n.h} L${n.x0},${n.y0 + n.h} Z`} className="od-note-b" />
            <path d={`M${x1 - f},${n.y0} L${x1 - f},${n.y0 + f} L${x1},${n.y0 + f}`} className="od-note-f" fill="none" />
            {n.lines.map((l, i) => (
              <text key={i} x={n.x0 + 12} y={n.y0 + 22 + i * 17} className="od-note-t">
                {l}
              </text>
            ))}
          </g>
        )
      })}

      {/* nodes */}
      {g.boxes.map((b) => {
        if (!isVis(b.id)) return null
        const c = b.cls
        const info = CLASS_INFO[c.st]
        const st = stText(c)
        const rows = [...(c.attrs ?? []), ...(c.literals ?? [])]
        const italic = c.abstract || info.sortal === false
        return (
          <g
            key={b.id}
            className="od-n"
            data-id={b.id}
            data-fam={info.family}
            data-st={c.st}
            data-mark={c.mark}
            data-dim={dimNode(b.id) || undefined}
            data-hover={state.hover === b.id || undefined}
            tabIndex={0}
          >
            <rect x={b.x0} y={b.y0} width={b.w} height={b.h} rx={cfg.r} className="od-shadow" />
            <rect x={b.x0} y={b.y0} width={b.w} height={b.h} rx={cfg.r} className="od-body" />
            <g clipPath={`url(#${uid}-c-${b.id})`}>
              <rect x={b.x0} y={b.y0} width={b.w} height={rows.length ? b.headH : b.h} className="od-head" />
              {style === 'moderni' && <rect x={b.x0} y={b.y0} width={4} height={b.h} className="od-stripe" />}
            </g>
            {rows.length > 0 && <line x1={b.x0} x2={b.x1} y1={b.y0 + b.headH} y2={b.y0 + b.headH} className="od-sep" />}
            <rect x={b.x0} y={b.y0} width={b.w} height={b.h} rx={cfg.r} className="od-border" fill="none" />
            {st && (
              <text x={b.cx} y={b.y0 + 19} textAnchor="middle" className="od-st">
                {st}
              </text>
            )}
            <text x={b.cx} y={b.y0 + (st ? 38 : 23)} textAnchor="middle" className="od-name" fontStyle={italic ? 'italic' : undefined}>
              {c.name}
            </text>
            {rows.map((a, i) => (
              <text key={i} x={b.x0 + 12} y={b.y0 + b.headH + 20 + i * 19} className="od-attr">
                {a}
              </text>
            ))}
            {style !== 'tisk' && rigidGlyph(b)}
          </g>
        )
      })}
    </svg>
  )
}
