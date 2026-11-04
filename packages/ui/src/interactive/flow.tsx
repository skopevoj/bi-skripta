'use client'

import { createContext, useContext, useId, type ReactNode } from 'react'
import { cx, type Tone } from './util'

/*
 * Jednoduché blokové diagramy v SVG (režimy blokových šifer, toky dat, protokoly).
 * Souřadnice jsou v jednotkách viewBoxu; diagram se škáluje na šířku, ale nikdy pod `minWidth`
 * (pod tím se posouvá uvnitř). Barvy jen přes tokeny (CSS třídy), takže funguje i tmavý režim.
 */

const MarkerCtx = createContext('ix-arrow')

export type FlowProps = {
  width: number
  height: number
  /** Popis diagramu pro čtečky (povinný). */
  title: string
  /** Pod touto šířkou v px se diagram přestane zmenšovat a začne se posouvat (výchozí 0.75 × width). */
  minWidth?: number
  className?: string
  children: ReactNode
}

export function Flow({ width, height, title, minWidth, className, children }: FlowProps) {
  const id = `ix-ar-${useId().replace(/:/g, '')}`
  return (
    <div className={cx('ix-scroll', 'ix-flow-w', className)}>
      <svg
        className="ix-flow"
        viewBox={`0 0 ${width} ${height}`}
        style={{ minWidth: minWidth ?? Math.round(width * 0.75), maxWidth: width }}
        role="img"
        aria-label={title}
      >
        <defs>
          {(['', 'active', 'dim'] as const).map((k) => (
            <marker
              key={k}
              id={k ? `${id}-${k}` : id}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
              className={cx('ix-flow-mk', k && `ix-flow-mk-${k}`)}
            >
              <path d="M0 1 L9 5 L0 9 z" />
            </marker>
          ))}
        </defs>
        <MarkerCtx.Provider value={id}>{children}</MarkerCtx.Provider>
      </svg>
    </div>
  )
}

type FlowTone = Extract<Tone, 'active' | 'dim' | 'changed' | 'ok' | 'bad'>

export type FlowBoxProps = {
  /** Střed boxu. */
  x: number
  y: number
  w?: number
  h?: number
  label: ReactNode
  /** Malý popisek pod hlavním (např. hodnota „3a“). */
  sub?: ReactNode
  /** data = hodnota (OT, ŠT), op = operace (E_k), key = klíč/IV (čárkovaně). */
  kind?: 'data' | 'op' | 'key'
  tone?: FlowTone
}

export function FlowBox({ x, y, w = 88, h = 32, label, sub, kind = 'data', tone }: FlowBoxProps) {
  return (
    <g className={cx('ix-fb', `ix-fb-${kind}`, tone && `ix-fb-${tone}`)}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={4} />
      <text x={x} y={sub ? y - 3 : y} dominantBaseline="central" textAnchor="middle">
        {label}
      </text>
      {sub && (
        <text className="ix-fb-sub" x={x} y={y + 10} dominantBaseline="central" textAnchor="middle">
          {sub}
        </text>
      )}
    </g>
  )
}

/** Kroužek s operátorem (⊕, +, ·). */
export function FlowOp({ x, y, r = 11, symbol = '⊕', tone }: { x: number; y: number; r?: number; symbol?: string; tone?: FlowTone }) {
  return (
    <g className={cx('ix-fo', tone && `ix-fb-${tone}`)}>
      <circle cx={x} cy={y} r={r} />
      <text x={x} y={y} dominantBaseline="central" textAnchor="middle">
        {symbol}
      </text>
    </g>
  )
}

export type FlowArrowProps = {
  /** Body cesty [x, y] — první je začátek, poslední hrot. Lomená čára přes všechny body. */
  points: readonly (readonly [number, number])[]
  tone?: 'active' | 'dim'
  dashed?: boolean
  /** Popisek u středu prvního úseku. */
  label?: ReactNode
}

export function FlowArrow({ points, tone, dashed, label }: FlowArrowProps) {
  const id = useContext(MarkerCtx)
  if (points.length < 2) return null
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')
  const [a, b] = [points[0]!, points[1]!]
  return (
    <g className={cx('ix-fa', tone && `ix-fa-${tone}`)}>
      <path d={d} markerEnd={`url(#${tone ? `${id}-${tone}` : id})`} strokeDasharray={dashed ? '4 3' : undefined} />
      {label && (
        <text x={(a[0] + b[0]) / 2 + 6} y={(a[1] + b[1]) / 2} dominantBaseline="central">
          {label}
        </text>
      )}
    </g>
  )
}

/** Volný popisek v diagramu. */
export function FlowText({ x, y, children, anchor = 'middle', muted }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'middle' | 'end'; muted?: boolean }) {
  return (
    <text className={cx('ix-ft', muted && 'ix-ft-muted')} x={x} y={y} textAnchor={anchor} dominantBaseline="central">
      {children}
    </text>
  )
}
