// Small schematic diagrams for the five block-cipher modes: ECB, CBC, CFB, OFB, CTR.
// Each shows three blocks (i = 1, 2, 3) of the encryption data-flow.
// Interaction: a "Krok" slider highlights which column is currently being computed,
// so the student can follow the chaining step by step.

import { useState } from 'react'

type Mode = 'ecb' | 'cbc' | 'cfb' | 'ofb' | 'ctr'

const W = 720
const H_ECB = 230
const H_NORMAL = 300
const H_CBC = 340
const H_CFB = 300
const H_OFB = 270

const COL_X = [130, 360, 590]
const BOX_W = 86
const BOX_H = 30

// --- Shared SVG primitives --------------------------------------------------

function Box({
  cx,
  cy,
  label,
  kind = 'data',
  dim = false,
  width = BOX_W,
}: {
  cx: number
  cy: number
  label: string
  kind?: 'data' | 'op' | 'iv'
  dim?: boolean
  width?: number
}) {
  const x = cx - width / 2
  const y = cy - BOX_H / 2
  const fill = kind === 'op' ? '#28282a' : kind === 'iv' ? 'transparent' : '#f4f2ec'
  const stroke = kind === 'iv' ? '#9c9a91' : '#c4c2b8'
  const textFill = kind === 'op' ? '#fbfaf7' : '#28282a'
  const opacity = dim ? 0.32 : 1
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={width}
        height={BOX_H}
        rx={3}
        fill={fill}
        stroke={stroke}
        strokeWidth={dim ? 1 : 1.6}
        strokeDasharray={kind === 'iv' ? '3 2' : undefined}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={15}
        fill={textFill}
      >
        {label}
      </text>
    </g>
  )
}

function Xor({ cx, cy, dim = false }: { cx: number; cy: number; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.32 : 1}>
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="#fbfaf7"
        stroke="#9c9a91"
        strokeWidth={dim ? 1 : 1.8}
      />
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={17}
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
      stroke={dim ? '#c9c6bc' : '#78766c'}
      strokeWidth={dim ? 1.25 : 2.25}
      opacity={dim ? 0.22 : 1}
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
        <path d="M0,0 L10,5 L0,10 z" fill="#78766c" />
      </marker>
    </defs>
  )
}

function Lane({ cx, height }: { cx: number; height: number }) {
  return (
    <rect
      x={cx - 74}
      y={8}
      width={148}
      height={height - 16}
      rx={8}
      fill="#f4f2ec"
      stroke="#d8d5ca"
      strokeWidth={1}
      opacity={0.42}
    />
  )
}

function StepDot({
  x,
  y,
  n,
  label,
  dim = false,
}: {
  x: number
  y: number
  n: number
  label?: string
  dim?: boolean
}) {
  if (dim) return null
  return (
    <g>
      <circle cx={x} cy={y} r={10} fill="#28282a" stroke="#fbfaf7" strokeWidth={1.5} />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize={11}
        fill="#fbfaf7"
      >
        {n}
      </text>
      {label && (
        <text
          x={x + 15}
          y={y + 4}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={11}
          fill="#52524d"
        >
          {label}
        </text>
      )}
    </g>
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
            Blok
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
              aria-label={`Blok ${n}`}
              aria-pressed={active === n}
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
          style={{ maxWidth: 760, minWidth: 620, display: 'block', margin: '0 auto' }}
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
      <Lane cx={COL_X[active - 1]!} height={H_ECB} />
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1) // ₁ ₂ ₃
        return (
          <g key={i}>
            <Box cx={x} cy={34} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x},50 L${x},87`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 30} y={68} n={1} label="vstup" dim={dim} />
            <Box cx={x} cy={104} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},120 L${x},157`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 30} y={139} n={2} label="šifra" dim={dim} />
            <Box cx={x} cy={176} label={`ŠT${sub}`} dim={dim} />
            <StepDot x={x + 30} y={202} n={3} label="výstup" dim={dim} />
          </g>
        )
      })}
    </>
  )
}

// --- CBC --------------------------------------------------------------------

function CBCDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Layout (per col): OT → XOR → Eₖ → ŠT.
  // Chain: ŠT_{i-1} loops up to XOR_i. IV → XOR_1.
  return (
    <>
      <Lane cx={COL_X[active - 1]!} height={H_CBC} />
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            <Box cx={x} cy={34} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x},50 L${x},86`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={104} dim={dim} />
            <StepDot x={x + 32} y={104} n={1} label="XOR" dim={dim} />
            <Wire d={`M${x},118 L${x},154`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={172} label="Eₖ" kind="op" dim={dim} />
            <StepDot x={x + 32} y={144} n={2} label="šifra" dim={dim} />
            <Wire d={`M${x},188 L${x},244`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={264} label={`ŠT${sub}`} dim={dim} />
            <StepDot x={x + 32} y={222} n={3} label="ŠT" dim={dim} />
          </g>
        )
      })}
      {/* IV → XOR_1 */}
      <Box cx={44} cy={104} label="IV" kind="iv" dim={active !== 1} width={54} />
      <Wire d={`M72,104 L${COL_X[0] - 15},104`} dim={active !== 1} markerId={arrowId} />
      {/* ŠT_1 → XOR_2 (chain) */}
      <Wire
        d={`M${COL_X[0]},280 L${COL_X[0]},306 Q${COL_X[0]},322 ${COL_X[0] + 16},322 L${COL_X[1] - 58},322 Q${COL_X[1] - 74},322 ${COL_X[1] - 74},306 L${COL_X[1] - 74},104 L${COL_X[1] - 15},104`}
        dim={active !== 2}
        markerId={arrowId}
      />
      {/* ŠT_2 → XOR_3 */}
      <Wire
        d={`M${COL_X[1]},280 L${COL_X[1]},306 Q${COL_X[1]},322 ${COL_X[1] + 16},322 L${COL_X[2] - 58},322 Q${COL_X[2] - 74},322 ${COL_X[2] - 74},306 L${COL_X[2] - 74},104 L${COL_X[2] - 15},104`}
        dim={active !== 3}
        markerId={arrowId}
      />
    </>
  )
}

// --- CFB --------------------------------------------------------------------

function CFBDiagram({ active, arrowId }: { active: number; arrowId: string }) {
  // Per col: Eₖ at top, XOR below, OT into XOR from the right, ŠT at bottom.
  // Chain: ŠT_{i-1} → Eₖ_i input. IV → Eₖ_1 input.
  return (
    <>
      <Lane cx={COL_X[active - 1]!} height={H_CFB} />
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            <Box cx={x} cy={78} label="Eₖ" kind="op" dim={dim} />
            <StepDot x={x + 58} y={78} n={1} label="vstup" dim={dim} />
            <Wire d={`M${x},94 L${x},142`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={122} n={2} label="šifra" dim={dim} />
            <Xor cx={x} cy={160} dim={dim} />
            <Box cx={x + 84} cy={160} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 41},160 L${x + 15},160`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={184} n={3} label="XOR" dim={dim} />
            <Wire d={`M${x},174 L${x},226`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={246} label={`ŠT${sub}`} dim={dim} />
            <StepDot x={x + 32} y={218} n={4} label="ŠT" dim={dim} />
          </g>
        )
      })}
      {/* IV → Eₖ_1 */}
      <Box cx={44} cy={78} label="IV" kind="iv" dim={active !== 1} width={54} />
      <Wire d={`M72,78 L${COL_X[0] - 43},78`} dim={active !== 1} markerId={arrowId} />
      {/* ŠT_1 → Eₖ_2 */}
      <Wire
        d={`M${COL_X[0]},262 L${COL_X[0]},286 Q${COL_X[0]},294 ${COL_X[0] + 16},294 L${COL_X[1] - 74},294 L${COL_X[1] - 74},78 L${COL_X[1] - 43},78`}
        dim={active !== 2}
        markerId={arrowId}
      />
      {/* ŠT_2 → Eₖ_3 */}
      <Wire
        d={`M${COL_X[1]},262 L${COL_X[1]},286 Q${COL_X[1]},294 ${COL_X[1] + 16},294 L${COL_X[2] - 74},294 L${COL_X[2] - 74},78 L${COL_X[2] - 43},78`}
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
      <Lane cx={COL_X[active - 1]!} height={H_OFB} />
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        return (
          <g key={i}>
            <Box cx={x} cy={48} label="Eₖ" kind="op" dim={dim} />
            <StepDot x={x + 32} y={26} n={1} label="Hᵢ" dim={dim} />
            <Wire d={`M${x},64 L${x},124`} dim={dim} markerId={arrowId} />
            <Xor cx={x} cy={142} dim={dim} />
            <Box cx={x + 84} cy={142} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 41},142 L${x + 15},142`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={166} n={2} label="XOR" dim={dim} />
            <Wire d={`M${x},156 L${x},208`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={228} label={`ŠT${sub}`} dim={dim} />
            <StepDot x={x + 32} y={200} n={3} label="ŠT" dim={dim} />
          </g>
        )
      })}
      {/* IV → Eₖ_1 (from left) */}
      <Box cx={44} cy={48} label="IV" kind="iv" dim={active !== 1} width={54} />
      <Wire d={`M72,48 L${COL_X[0] - 43},48`} dim={active !== 1} markerId={arrowId} />
      {/* Eₖ_1 → Eₖ_2 (horizontal key stream) */}
      <Wire
        d={`M${COL_X[0] + 43},48 L${COL_X[1] - 43},48`}
        dim={active < 2}
        markerId={arrowId}
      />
      {/* Eₖ_2 → Eₖ_3 */}
      <Wire
        d={`M${COL_X[1] + 43},48 L${COL_X[2] - 43},48`}
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
      <Lane cx={COL_X[active - 1]!} height={H_NORMAL} />
      {COL_X.map((x, i) => {
        const dim = active !== i + 1
        const sub = String.fromCharCode(0x2080 + i + 1)
        const ctr = i === 0 ? 'IV' : `IV+${i}`
        return (
          <g key={i}>
            <Box cx={x} cy={34} label={ctr} kind="iv" dim={dim} />
            <Wire d={`M${x},50 L${x},86`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={68} n={1} label="čítač" dim={dim} />
            <Box cx={x} cy={104} label="Eₖ" kind="op" dim={dim} />
            <Wire d={`M${x},120 L${x},166`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={144} n={2} label="šifra" dim={dim} />
            <Xor cx={x} cy={184} dim={dim} />
            <Box cx={x + 84} cy={184} label={`OT${sub}`} dim={dim} />
            <Wire d={`M${x + 41},184 L${x + 15},184`} dim={dim} markerId={arrowId} />
            <StepDot x={x + 32} y={208} n={3} label="XOR" dim={dim} />
            <Wire d={`M${x},198 L${x},250`} dim={dim} markerId={arrowId} />
            <Box cx={x} cy={270} label={`ŠT${sub}`} dim={dim} />
            <StepDot x={x + 32} y={242} n={4} label="ŠT" dim={dim} />
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
    height: H_ECB,
  },
  cbc: {
    title: 'CBC',
    formula: 'ŠTᵢ = Eₖ(OTᵢ ⊕ ŠTᵢ₋₁),  ŠT₀ = IV',
    caption:
      'Před šifrováním se OT XORuje s předchozím ŠT (první s IV). Šifrování je sériové — nelze paralelizovat.',
    height: H_CBC,
  },
  cfb: {
    title: 'CFB',
    formula: 'ŠTᵢ = OTᵢ ⊕ Eₖ(ŠTᵢ₋₁),  ŠT₀ = IV',
    caption:
      'Eₖ se aplikuje na předchozí ŠT a výsledek se XORuje s OT. Samosynchronizující — chyba se po jednom bloku „vyhojí“.',
    height: H_CFB,
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
