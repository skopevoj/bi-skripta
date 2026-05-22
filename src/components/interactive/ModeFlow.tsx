// Small schematic diagrams for the five block-cipher modes: ECB, CBC, CFB, OFB, CTR.
// Each shows three blocks (i = 1, 2, 3) of the encryption data-flow.
// Interaction: a "Krok" slider highlights which column is currently being computed,
// so the student can follow the chaining step by step.

import { useState } from 'react'

type Mode = 'ecb' | 'cbc' | 'cfb' | 'ofb' | 'ctr'

const W = 360
const H_NORMAL = 200
const H_OFB = 170

const COL_X = [60, 180, 300]
const BOX_W = 64
const BOX_H = 22

// --- Shared SVG primitives --------------------------------------------------

function Box({
  cx,
  cy,
  label,
  kind = 'data',
  dim = false,
}: {
  cx: number
  cy: number
  label: string
  kind?: 'data' | 'op' | 'iv'
  dim?: boolean
}) {
  const x = cx - BOX_W / 2
  const y = cy - BOX_H / 2
  const fill = kind === 'op' ? '#28282a' : kind === 'iv' ? 'transparent' : '#f4f2ec'
  const stroke = kind === 'iv' ? '#9c9a91' : '#c4c2b8'
  const textFill = kind === 'op' ? '#fbfaf7' : '#28282a'
  const opacity = dim ? 0.35 : 1
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray={kind === 'iv' ? '3 2' : undefined}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={11}
        fill={textFill}
      >
        {label}
      </text>
    </g>
  )
}

function Xor({ cx, cy, dim = false }: { cx: number; cy: number; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.35 : 1}>
      <circle cx={cx} cy={cy} r={9} fill="#fbfaf7" stroke="#9c9a91" strokeWidth={1} />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={12}
        fill="#52524d"
      >
        ⊕
      </text>
    </g>
  )
}

function Wire({
  d,
  dim = false,
  arrow = true,
  markerId,
}: {
  d: string
  dim?: boolean
  arrow?: boolean
  markerId: string
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke="#9c9a91"
      strokeWidth={1.25}
      opacity={dim ? 0.3 : 1}
      markerEnd={arrow ? `url(#${markerId})` : undefined}
    />
  )
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" fill="#9c9a91" />
      </marker>
    </defs>
  )
}

// --- Mode shells ------------------------------------------------------------

function Frame({
  title,
  formula,
  caption,
  height,
  children,
  active,
  setActive,
  arrowId,
}: {
  title: string
  formula: string
  caption: string
  height: number
  children: React.ReactNode
  active: number
  setActive: (n: number) => void
  arrowId: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="font-mono text-[12px] text-ink-300">{formula}</div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] tracking-[0.18em] uppercase text-ink-500 font-sans mr-1">
            Krok
          </span>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setActive(n)}
              className={
                'w-7 h-7 rounded text-[12px] font-mono border transition-colors ' +
                (active === n
                  ? 'bg-ink-200 text-ink-950 border-ink-200'
                  : 'bg-transparent text-ink-400 border-ink-800 hover:border-ink-600')
              }
              aria-label={`Krok ${n}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${height}`}
          width="100%"
          style={{ maxWidth: 480, display: 'block', margin: '0 auto' }}
          aria-label={title}
        >
          <ArrowDefs id={arrowId} />
          {children}
        </svg>
      </div>

      <p className="text-[12px] text-ink-400 font-sans leading-relaxed text-center">
        {caption}
      </p>
    </div>
  )
}

// --- ECB --------------------------------------------------------------------

function ECBDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  return (
    <>
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1) // ₁ ₂ ₃
        return (
          <g key={i}>
            <Box cx={x} cy={20} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x},32 L${x},58`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={70} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},82 L${x},108`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={120} label={`ŠT${sub}`} dim={dim} />
          </g>
        )
      })}
    </>
  )
}

// --- CBC --------------------------------------------------------------------

function CBCDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Layout (per col): OT (y=20) → XOR (y=58) → Eₖ (y=88) → ŠT (y=140)
  // Chain: ŠT_{i-1} loops up to XOR_i. IV → XOR_1.
  return (
    <>
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            <Box cx={x} cy={20} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x},32 L${x},49`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={58} dim={dim} />
            <Wire d={`M${x},67 L${x},77`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={88} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},100 L${x},168`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={180} label={`ŠT${sub}`} dim={dim} />
          </g>
        )
      })}
      {/* IV → XOR_1 */}
      <Box cx={20} cy={58} label="IV" kind="iv" dim={active !== 1} />
      <Wire d={`M40,58 L${COL_X[0] - 9},58`} dim={active !== 1} markerId={arrowId} />
      {/* ŠT_1 → XOR_2 (chain) */}
      <Wire
        d={`M${COL_X[0]},192 L${COL_X[0]},200 Q${COL_X[0]},210 ${COL_X[0] + 10},210 L${COL_X[1] - 10},210 Q${COL_X[1]},210 ${COL_X[1]},200 L${COL_X[1]},67`}
        dim={active !== 2}
        markerId={arrowId}
      />
      {/* ŠT_2 → XOR_3 */}
      <Wire
        d={`M${COL_X[1]},192 L${COL_X[1]},200 Q${COL_X[1]},210 ${COL_X[1] + 10},210 L${COL_X[2] - 10},210 Q${COL_X[2]},210 ${COL_X[2]},200 L${COL_X[2]},67`}
        dim={active !== 3}
        markerId={arrowId}
      />
    </>
  )
}

// --- CFB --------------------------------------------------------------------

function CFBDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Per col: Eₖ at top (y=30), XOR at y=88, OT into XOR from side, ŠT at y=140
  // Chain: ŠT_{i-1} → Eₖ_i input. IV → Eₖ_1 input.
  return (
    <>
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            {/* small input-feed tick above Eₖ */}
            <Wire d={`M${x},10 L${x},19`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={30} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},42 L${x},79`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={88} dim={dim} />
            {/* OT_i comes in from the right */}
            <Box cx={x + 60} cy={88} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 28},88 L${x + 9},88`} dim={dim} markerId={arrowId} />
            <Wire d={`M${x},97 L${x},128`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={140} label={`ŠT${sub}`} dim={dim} />
          </g>
        )
      })}
      {/* IV → Eₖ_1 */}
      <Box cx={20} cy={30} label="IV" kind="iv" dim={active !== 1} />
      <Wire d={`M40,30 L${COL_X[0] - 32},30`} dim={active !== 1} markerId={arrowId} />
      {/* ŠT_1 → Eₖ_2 */}
      <Wire
        d={`M${COL_X[0]},152 L${COL_X[0]},162 Q${COL_X[0]},172 ${COL_X[0] + 10},172 L${COL_X[1] - 10},172 Q${COL_X[1]},172 ${COL_X[1]},162 L${COL_X[1]},10`}
        dim={active !== 2}
        markerId={arrowId}
      />
      {/* ŠT_2 → Eₖ_3 */}
      <Wire
        d={`M${COL_X[1]},152 L${COL_X[1]},162 Q${COL_X[1]},172 ${COL_X[1] + 10},172 L${COL_X[2] - 10},172 Q${COL_X[2]},172 ${COL_X[2]},162 L${COL_X[2]},10`}
        dim={active !== 3}
        markerId={arrowId}
      />
    </>
  )
}

// --- OFB --------------------------------------------------------------------

function OFBDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Horizontal key-stream chain: IV → Eₖ → H₁ → Eₖ → H₂ → Eₖ → H₃
  // Each H_i XORed with OT_i to give ŠT_i below.
  // Eₖ at y=30, H output to next Eₖ on same row.
  // Below each Eₖ: XOR at y=80, OT comes from right, ŠT at y=128.
  return (
    <>
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            <Box cx={x} cy={30} label="Eₖ" kind="op" dim={dim} />
            {/* down from Eₖ to XOR */}
            <Wire d={`M${x},42 L${x},71`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={80} dim={dim} />
            <Box cx={x + 60} cy={80} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 28},80 L${x + 9},80`} dim={dim} markerId={arrowId} />
            <Wire d={`M${x},89 L${x},118`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={130} label={`ŠT${sub}`} dim={dim} />
          </g>
        )
      })}
      {/* IV → Eₖ_1 (from left) */}
      <Box cx={20} cy={30} label="IV" kind="iv" dim={active !== 1} />
      <Wire d={`M40,30 L${COL_X[0] - 32},30`} dim={active !== 1} markerId={arrowId} />
      {/* Eₖ_1 → Eₖ_2 (horizontal key stream) */}
      <Wire
        d={`M${COL_X[0] + 32},30 L${COL_X[1] - 32},30`}
        dim={active < 2}
        markerId={arrowId}
      />
      {/* Eₖ_2 → Eₖ_3 */}
      <Wire
        d={`M${COL_X[1] + 32},30 L${COL_X[2] - 32},30`}
        dim={active < 3}
        markerId={arrowId}
      />
    </>
  )
}

// --- CTR --------------------------------------------------------------------

function CTRDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Per col: counter at top, Eₖ, XOR with OT from right, ŠT.
  return (
    <>
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        const ctr = i === 0 ? 'IV' : `IV+${i}`
        return (
          <g key={i}>
            <Box cx={x} cy={20} label={ctr} kind="iv" dim={dim} />
            <Wire d={`M${x},32 L${x},58`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={70} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},82 L${x},111`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={120} dim={dim} />
            <Box cx={x + 60} cy={120} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 28},120 L${x + 9},120`} dim={dim} markerId={arrowId} />
            <Wire d={`M${x},129 L${x},158`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={170} label={`ŠT${sub}`} dim={dim} />
          </g>
        )
      })}
    </>
  )
}

// --- Public components ------------------------------------------------------

const CONFIG: Record<
  Mode,
  { title: string; formula: string; caption: string; height: number }
> = {
  ecb: {
    title: 'ECB',
    formula: 'ŠTᵢ = Eₖ(OTᵢ)',
    caption:
      'Bloky se šifrují nezávisle. Stejný OT blok dvakrát → vždy stejný ŠT. Paralelizovatelné, ale odhaluje vzory.',
    height: 150,
  },
  cbc: {
    title: 'CBC',
    formula: 'ŠTᵢ = Eₖ(OTᵢ ⊕ ŠTᵢ₋₁),  ŠT₀ = IV',
    caption:
      'Před šifrováním se OT XORuje s předchozím ŠT (první s IV). Šifrování je sériové — nelze paralelizovat.',
    height: 230,
  },
  cfb: {
    title: 'CFB',
    formula: 'ŠTᵢ = OTᵢ ⊕ Eₖ(ŠTᵢ₋₁),  ŠT₀ = IV',
    caption:
      'Eₖ se aplikuje na předchozí ŠT a výsledek se XORuje s OT. Samosynchronizující — chyba se po jednom bloku „vyhojí“.',
    height: 190,
  },
  ofb: {
    title: 'OFB',
    formula: 'Hᵢ = Eₖ(Hᵢ₋₁),  H₀ = IV,  ŠTᵢ = OTᵢ ⊕ Hᵢ',
    caption:
      'Klíčový proud H nezávisí na OT/ŠT — lze ho předpočítat. Bitová chyba v ŠT poškodí pouze jeden bit OT.',
    height: H_OFB,
  },
  ctr: {
    title: 'CTR',
    formula: 'ŠTᵢ = OTᵢ ⊕ Eₖ(IV + i − 1)',
    caption:
      'Každý blok má vlastní hodnotu čítače. Bloky jsou na sobě nezávislé → plně paralelizovatelné při šifrování i dešifrování.',
    height: H_NORMAL,
  },
}

function ModeFlow({ mode }: { mode: Mode }) {
  const [active, setActive] = useState(1)
  const cfg = CONFIG[mode]
  const arrowId = `mf-arr-${mode}`
  return (
    <Frame
      title={cfg.title}
      formula={cfg.formula}
      caption={cfg.caption}
      height={cfg.height}
      active={active}
      setActive={setActive}
      arrowId={arrowId}
    >
      {mode === 'ecb' && <ECBDiagram active={active} arrowId={arrowId} />}
      {mode === 'cbc' && <CBCDiagram active={active} arrowId={arrowId} />}
      {mode === 'cfb' && <CFBDiagram active={active} arrowId={arrowId} />}
      {mode === 'ofb' && <OFBDiagram active={active} arrowId={arrowId} />}
      {mode === 'ctr' && <CTRDiagram active={active} arrowId={arrowId} />}
    </Frame>
  )
}

export function ModeECB() {
  return <ModeFlow mode="ecb" />
}
export function ModeCBC() {
  return <ModeFlow mode="cbc" />
}
export function ModeCFB() {
  return <ModeFlow mode="cfb" />
}
export function ModeOFB() {
  return <ModeFlow mode="ofb" />
}
export function ModeCTR() {
  return <ModeFlow mode="ctr" />
}
