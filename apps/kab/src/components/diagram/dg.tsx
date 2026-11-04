import { createContext, useContext, useId, type ReactNode } from 'react'
import './diagrams.css'

/*
 * Společné stavební prvky statických diagramů KAB. Souřadnice jsou v jednotkách viewBoxu.
 * Barvy výhradně přes třídy v diagrams.css (tokeny), takže diagramy fungují světle i tmavě.
 * Role uzlů a hran viz hlavička diagrams.css.
 */

export type Role = 'key' | 'data' | 'param' | 'auth' | 'plain'
export type Pt = readonly [number, number]

const R = 4 // rádius uzlů (= --r-1)
const CAP = 3 // výška barevné čepičky

const MarkerCtx = createContext('dg')

/** Plátno diagramu: škáluje se na šířku, pod `minW` px se posouvá uvnitř figure. */
export function Dg({
  w,
  h,
  title,
  minW,
  children,
}: {
  w: number
  h: number
  /** Popis pro čtečky obrazovky. */
  title: string
  /** Minimální šířka v px (výchozí 0.8 × w, aby 11px text nekleslo pod ~9px). */
  minW?: number
  children: ReactNode
}) {
  const id = `dg${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <div className="dg">
      <svg
        className="dg-svg"
        viewBox={`0 0 ${w} ${h}`}
        style={{ minWidth: Math.min(w, minW ?? Math.round(w * 0.8)), maxWidth: w }}
        role="img"
        aria-label={title}
      >
        <defs>
          {(['', 'key', 'faint'] as const).map((k) => (
            <marker
              key={k}
              id={k ? `${id}-${k}` : id}
              viewBox="0 0 8 8"
              refX="8"
              refY="4"
              markerWidth="8"
              markerHeight="8"
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path d="M0 0.5 L8 4 L0 7.5 z" className={k ? `dg-mk-${k}` : 'dg-mk'} />
            </marker>
          ))}
        </defs>
        <MarkerCtx.Provider value={id}>{children}</MarkerCtx.Provider>
      </svg>
    </div>
  )
}

/** Karta s barevnou čepičkou podle role (střed x, y). */
export function Box({
  x,
  y,
  w,
  h = 30,
  role = 'plain',
  label,
  sub,
  mono,
  dashed,
}: {
  x: number
  y: number
  w: number
  h?: number
  role?: Role
  label: ReactNode
  /** Druhý řádek (11 px). */
  sub?: ReactNode
  /** Notace (L₀, Mᵢ…) monospace písmem. */
  mono?: boolean
  /** Čárkovaný obrys = volitelná část. */
  dashed?: boolean
}) {
  const x0 = x - w / 2
  const y0 = y - h / 2
  const e = R - Math.sqrt(R * R - (R - CAP) * (R - CAP))
  const cap = `M${x0 + e} ${y0 + CAP} A${R} ${R} 0 0 1 ${x0 + R} ${y0} H${x0 + w - R} A${R} ${R} 0 0 1 ${x0 + w - e} ${y0 + CAP} Z`
  return (
    <g className="dg-n" data-r={role} data-dash={dashed ? '' : undefined}>
      <rect className="dg-n-body" x={x0} y={y0} width={w} height={h} rx={R} />
      <path className="dg-n-cap" d={cap} />
      <text className={mono ? 'dg-m' : 'dg-t dg-t-b'} x={x} y={sub ? y - 6 : y + 1} textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      {sub && (
        <text className="dg-s" x={x} y={y + 10} textAnchor="middle" dominantBaseline="central">
          {sub}
        </text>
      )}
    </g>
  )
}

/** Operace (E, P, f, F, S-box, generátor): neutrální výplň, akcentový obrys. */
export function Op({
  x,
  y,
  w,
  h = 30,
  label,
  sub,
  sans,
}: {
  x: number
  y: number
  w: number
  h?: number
  label: ReactNode
  sub?: ReactNode
  /** Slovní popisek (jinak monospace notace). */
  sans?: boolean
}) {
  return (
    <g>
      <rect className="dg-op" x={x - w / 2} y={y - h / 2} width={w} height={h} rx={R} />
      <text className={sans ? 'dg-t dg-t-b' : 'dg-m'} x={x} y={sub ? y - 7 : y + 1} textAnchor="middle" dominantBaseline="central">
        {label}
      </text>
      {sub && (
        <text className="dg-s" x={x} y={y + 10} textAnchor="middle" dominantBaseline="central">
          {sub}
        </text>
      )}
    </g>
  )
}

export const XOR_R = 10

/** Kroužek ⊕ (střed x, y, poloměr XOR_R). */
export function Xor({ x, y }: { x: number; y: number }) {
  const r = XOR_R
  return (
    <g>
      <circle className="dg-op" cx={x} cy={y} r={r} />
      <path className="dg-xor-x" d={`M${x - r + 3} ${y} H${x + r - 3} M${x} ${y - r + 3} V${y + r - 3}`} />
    </g>
  )
}

/** Hrana (lomená čára přes body). Šipka na konci, oboustranná nebo žádná. */
export function Wire({
  pts,
  role,
  arrow = 'end',
  dashed,
  faint,
}: {
  pts: readonly Pt[]
  role?: 'key'
  arrow?: 'end' | 'both' | 'none'
  dashed?: boolean
  faint?: boolean
}) {
  const id = useContext(MarkerCtx)
  const mk = `url(#${role === 'key' ? `${id}-key` : faint ? `${id}-faint` : id})`
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')
  return (
    <path
      className="dg-w"
      d={d}
      data-r={role}
      data-dash={dashed ? '' : undefined}
      data-faint={faint ? '' : undefined}
      markerEnd={arrow !== 'none' ? mk : undefined}
      markerStart={arrow === 'both' ? mk : undefined}
    />
  )
}

/** Rozbočení na vodiči. */
export function Dot({ x, y, role }: { x: number; y: number; role?: 'key' }) {
  return <circle className="dg-dot" data-r={role} cx={x} cy={y} r={2.5} />
}

type TextKind = 't' | 'tb' | 'm' | 's' | 'sm' | 'h'
const TEXT_CLASS: Record<TextKind, string> = {
  t: 'dg-t',
  tb: 'dg-t dg-t-b',
  m: 'dg-m',
  s: 'dg-s',
  sm: 'dg-sm',
  h: 'dg-h',
}

/** Volný text. `k`: t = 13 sans, tb = 13 sans tučně, m = 13 mono, s = 11 sans, sm = 11 mono, h = 11 mono verzálky. */
export function T({
  x,
  y,
  k = 't',
  a = 'middle',
  halo,
  muted,
  children,
}: {
  x: number
  y: number
  k?: TextKind
  a?: 'start' | 'middle' | 'end'
  halo?: boolean
  muted?: boolean
  children: ReactNode
}) {
  const cls = [TEXT_CLASS[k], halo && 'dg-halo', muted && 'dg-muted'].filter(Boolean).join(' ')
  return (
    <text className={cls} x={x} y={y} textAnchor={a} dominantBaseline="central">
      {children}
    </text>
  )
}

/**
 * Symbol s dolním indexem uvnitř <text> (např. SK s indexem Aut). Index je 11 px a posunutý dolů,
 * za ním se účaří vrací zpět. `role` obarví celý symbol (klíč / data).
 */
export function Ix({ b, s, role }: { b: ReactNode; s: ReactNode; role?: 'key' | 'data' }) {
  const cls = role === 'key' ? 'dg-k' : role === 'data' ? 'dg-d' : undefined
  return (
    <>
      <tspan className={cls}>{b}</tspan>
      <tspan className={cls} dy={4} fontSize={11}>
        {s}
      </tspan>
      <tspan dy={-4}>{'​'}</tspan>
    </>
  )
}

/** Obarvená notace bez indexu (např. „k“, „SK“). */
export function Kw({ role = 'key', children }: { role?: 'key' | 'data'; children: ReactNode }) {
  return <tspan className={role === 'key' ? 'dg-k' : 'dg-d'}>{children}</tspan>
}

/* ---------- sekvenční diagramy ---------- */

/** Účastník + čárkovaná čára života. */
export function Actor({
  x,
  y = 22,
  w,
  h = 34,
  bottom,
  label,
  role = 'plain',
}: {
  x: number
  y?: number
  w: number
  h?: number
  bottom: number
  label: ReactNode
  role?: Role
}) {
  return (
    <g>
      <line className="dg-life" x1={x} y1={y + h / 2} x2={x} y2={bottom} />
      <Box x={x} y={y} w={w} h={h} role={role} label={label} />
    </g>
  )
}

/** Zpráva mezi čarami života: šipka z x1 do x2 ve výšce y, popisek nad ní (u `at`, jinak uprostřed). */
export function Msg({
  x1,
  x2,
  y,
  n,
  label,
  note,
  at,
  mono,
}: {
  x1: number
  x2: number
  y: number
  /** Číslo kroku (vlevo u popisku). */
  n?: number
  label: ReactNode
  /** Poznámka pod šipkou (11 px). */
  note?: ReactNode
  at?: number
  mono?: boolean
}) {
  const cx = at ?? (x1 + x2) / 2
  const dir = x2 > x1 ? 1 : -1
  return (
    <g>
      <Wire pts={[[x1, y], [x2 - dir * 1, y]]} />
      <text className={`${mono ? 'dg-m' : 'dg-t'} dg-halo`} x={cx} y={y - 11} textAnchor="middle" dominantBaseline="central">
        {n !== undefined && <tspan className="dg-muted">{`${n}  `}</tspan>}
        {label}
      </text>
      {note && (
        <text className="dg-s dg-halo dg-muted" x={cx} y={y + 12} textAnchor="middle" dominantBaseline="central">
          {note}
        </text>
      )}
    </g>
  )
}

/** Vlastní akce účastníka: aktivační proužek + smyčka, text vpravo. */
export function SelfAct({ x, y1, y2, n, lines }: { x: number; y1: number; y2: number; n?: number; lines: ReactNode[] }) {
  const lx = x + 5
  const loopX = x + 30
  const mid = (y1 + y2) / 2
  return (
    <g>
      <rect className="dg-act" x={x - 5} y={y1} width={10} height={y2 - y1} rx={2} />
      <Wire pts={[[lx, y1 + 8], [loopX, y1 + 8], [loopX, y2 - 8], [lx + 1, y2 - 8]]} />
      {lines.map((l, i) => (
        <text
          key={i}
          className="dg-t dg-halo"
          x={loopX + 10}
          y={mid + (i - (lines.length - 1) / 2) * 18}
          dominantBaseline="central"
        >
          {i === 0 && n !== undefined && <tspan className="dg-muted">{`${n}  `}</tspan>}
          {l}
        </text>
      ))}
    </g>
  )
}
