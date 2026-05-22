import { svg } from './Figure'

// Merkle–Damgård iterated hash. Horizontal chain: IV → f → f → f → … → fₙ → h(M).
// Each compression box f takes a chaining value Hᵢ₋₁ from the left and a
// message block Mᵢ from above; outputs Hᵢ to the right.
export function MerkleDamgard() {
  const W = 520
  const H = 220

  // Vertical anchors
  const yChain = 130 // horizontal chain centerline
  const yMsg = 30 // top row of message blocks
  const boxW = 44
  const boxH = 44

  // f-box centers along x
  const f1 = 110
  const f2 = 200
  const f3 = 290
  const fDots = 360
  const fN = 420

  // Final output box (h(M))
  const outX = 495

  // Helper for a small arrowhead pointing right
  const arrowRight = (x: number, y: number) => (
    <polygon
      points={`${x},${y} ${x - 6},${y - 4} ${x - 6},${y + 4}`}
      fill={svg.stroke}
    />
  )
  // Arrowhead pointing down
  const arrowDown = (x: number, y: number) => (
    <polygon
      points={`${x},${y} ${x - 4},${y - 6} ${x + 4},${y - 6}`}
      fill={svg.stroke}
    />
  )

  // A compression-function box centered on cx with optional message label
  const fBox = (cx: number, label: string) => (
    <>
      <rect
        x={cx - boxW / 2}
        y={yChain - boxH / 2}
        width={boxW}
        height={boxH}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text
        x={cx}
        y={yChain + 5}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
      >
        {label}
      </text>
    </>
  )

  // Message block above a compression box: small rect + label + arrow down
  const msgBlock = (cx: number, label: string) => (
    <>
      <rect
        x={cx - 22}
        y={yMsg - 14}
        width={44}
        height={26}
        fill={svg.fillBoxAlt}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text
        x={cx}
        y={yMsg + 4}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
      >
        {label}
      </text>
      {/* Arrow from message block down into f */}
      <line
        x1={cx}
        y1={yMsg + 12}
        x2={cx}
        y2={yChain - boxH / 2 - 2}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      {arrowDown(cx, yChain - boxH / 2)}
    </>
  )

  // Chain segment from x1 to x2 with a label centered above
  const chainSeg = (x1: number, x2: number, label: string, faint = false) => (
    <>
      <line
        x1={x1}
        y1={yChain}
        x2={x2 - 2}
        y2={yChain}
        stroke={faint ? svg.strokeFaint : svg.stroke}
        strokeWidth="1.2"
        strokeDasharray={faint ? '3 3' : undefined}
      />
      {!faint && arrowRight(x2, yChain)}
      <text
        x={(x1 + x2) / 2}
        y={yChain - 8}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="11"
      >
        {label}
      </text>
    </>
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 520 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* Top caption row above message blocks */}
      <text
        x={(f1 + fN) / 2}
        y={12}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        ZPRÁVA (BLOKY)
      </text>

      {/* Message blocks M1..Mn */}
      {msgBlock(f1, 'M₁')}
      {msgBlock(f2, 'M₂')}
      {msgBlock(f3, 'M₃')}
      <text
        x={fDots}
        y={yMsg + 4}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
      >
        …
      </text>
      {msgBlock(fN, 'Mₙ')}

      {/* IV input box on the left */}
      <rect
        x={20}
        y={yChain - 16}
        width={48}
        height={32}
        fill={svg.fillBoxAlt}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text
        x={44}
        y={yChain + 5}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
      >
        IV
      </text>

      {/* Chain segments: IV → f1 → f2 → f3 → … → fN → h(M) */}
      {chainSeg(68, f1 - boxW / 2, 'H₀')}
      {chainSeg(f1 + boxW / 2, f2 - boxW / 2, 'H₁')}
      {chainSeg(f2 + boxW / 2, f3 - boxW / 2, 'H₂')}
      {chainSeg(f3 + boxW / 2, fDots - 12, 'H₃')}
      {/* dotted continuation through "…" */}
      <line
        x1={fDots - 12}
        y1={yChain}
        x2={fDots + 12}
        y2={yChain}
        stroke={svg.strokeFaint}
        strokeWidth="1.2"
        strokeDasharray="3 3"
      />
      <text
        x={fDots}
        y={yChain - 8}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="11"
      >
        …
      </text>
      {chainSeg(fDots + 12, fN - boxW / 2, 'Hₙ₋₁')}

      {/* Compression-function boxes */}
      {fBox(f1, 'f')}
      {fBox(f2, 'f')}
      {fBox(f3, 'f')}
      {fBox(fN, 'f')}

      {/* Final segment fN → h(M) with Hn label */}
      <line
        x1={fN + boxW / 2}
        y1={yChain}
        x2={outX - 26}
        y2={yChain}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      {arrowRight(outX - 24, yChain)}
      <text
        x={(fN + boxW / 2 + outX - 26) / 2}
        y={yChain - 8}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="11"
      >
        Hₙ
      </text>

      {/* Output: h(M) */}
      <text
        x={outX}
        y={yChain - 24}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        HASH
      </text>
      <text
        x={outX}
        y={yChain + 5}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
      >
        h(M)
      </text>

      {/* Bottom hint: input/output orientation */}
      <text
        x={44}
        y={H - 16}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        VSTUP
      </text>
      <text
        x={outX}
        y={H - 16}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        VÝSTUP
      </text>
    </svg>
  )
}
