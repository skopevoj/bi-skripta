import { svg } from './Figure'

// Two rounds of a Feistel network. Shows the L/R split, round key K_i feeding
// the round function F, the XOR with the opposite half, and the swap between
// rounds. Vertical layout — reads top to bottom like the textbook.
export function Feistel() {
  const W = 420
  const H = 460
  const cxL = 130 // left column (L)
  const cxR = 290 // right column (R)

  // y coordinates of each row
  const yIn = 30
  const yLabel = 50
  const yF1 = 130
  const yX1 = 200
  const ySwap1 = 250
  const yF2 = 330
  const yX2 = 400
  const yOut = 440

  const boxW = 70
  const boxH = 36

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 420 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* Input split */}
      <text x={cxL} y={yIn} textAnchor="middle" fill={svg.textFaint} fontSize="11" letterSpacing="2">
        OT
      </text>
      <text x={cxR} y={yIn} textAnchor="middle" fill={svg.textFaint} fontSize="11" letterSpacing="2">
        OT
      </text>
      <text x={cxL} y={yLabel} textAnchor="middle" fill={svg.text} fontStyle="italic">
        L₀
      </text>
      <text x={cxR} y={yLabel} textAnchor="middle" fill={svg.text} fontStyle="italic">
        R₀
      </text>

      {/* Round 1 wires from L0 / R0 down */}
      <line x1={cxL} y1={yLabel + 8} x2={cxL} y2={yX1} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR} y1={yLabel + 8} x2={cxR} y2={ySwap1 - 20} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Tap from R0 → F1 */}
      <line x1={cxR} y1={yF1 - 18} x2={cxR - 50} y2={yF1 - 18} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR - 50} y1={yF1 - 18} x2={cxR - 50} y2={yF1} stroke={svg.stroke} strokeWidth="1.2" />
      <circle cx={cxR} cy={yF1 - 18} r="2.5" fill={svg.stroke} />

      {/* F box round 1 */}
      <rect
        x={cxR - 50 - boxW / 2}
        y={yF1}
        width={boxW}
        height={boxH}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text x={cxR - 50} y={yF1 + boxH / 2 + 5} textAnchor="middle" fill={svg.text} fontStyle="italic">
        F
      </text>

      {/* K1 into F */}
      <line
        x1={cxR + 60}
        y1={yF1 + boxH / 2}
        x2={cxR - 50 + boxW / 2}
        y2={yF1 + boxH / 2}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon
        points={`${cxR - 50 + boxW / 2},${yF1 + boxH / 2} ${cxR - 50 + boxW / 2 + 6},${yF1 + boxH / 2 - 4} ${cxR - 50 + boxW / 2 + 6},${yF1 + boxH / 2 + 4}`}
        fill={svg.stroke}
      />
      <text x={cxR + 66} y={yF1 + boxH / 2 + 4} fill={svg.text} fontStyle="italic">
        K₁
      </text>

      {/* F output → XOR on L side */}
      <line x1={cxR - 50} y1={yF1 + boxH} x2={cxR - 50} y2={yX1} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR - 50} y1={yX1} x2={cxL + 10} y2={yX1} stroke={svg.stroke} strokeWidth="1.2" />

      {/* XOR circle on L */}
      <circle cx={cxL} cy={yX1} r="10" fill={svg.fillBox} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxL - 7} y1={yX1} x2={cxL + 7} y2={yX1} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxL} y1={yX1 - 7} x2={cxL} y2={yX1 + 7} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Crossover (swap): R0 becomes L1, XOR output becomes R1. */}
      <line x1={cxL} y1={yX1 + 10} x2={cxR} y2={ySwap1 + 30} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR} y1={ySwap1 - 20} x2={cxL} y2={ySwap1 + 30} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Round 2 labels — L1, R1 after swap */}
      <text x={cxL} y={ySwap1 + 50} textAnchor="middle" fill={svg.text} fontStyle="italic">
        L₁
      </text>
      <text x={cxR} y={ySwap1 + 50} textAnchor="middle" fill={svg.text} fontStyle="italic">
        R₁
      </text>

      {/* Round 2 wires */}
      <line x1={cxL} y1={ySwap1 + 56} x2={cxL} y2={yX2} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR} y1={ySwap1 + 56} x2={cxR} y2={yOut} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Tap from R1 → F2 */}
      <line x1={cxR} y1={yF2 - 18} x2={cxR - 50} y2={yF2 - 18} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR - 50} y1={yF2 - 18} x2={cxR - 50} y2={yF2} stroke={svg.stroke} strokeWidth="1.2" />
      <circle cx={cxR} cy={yF2 - 18} r="2.5" fill={svg.stroke} />

      {/* F box round 2 */}
      <rect
        x={cxR - 50 - boxW / 2}
        y={yF2}
        width={boxW}
        height={boxH}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text x={cxR - 50} y={yF2 + boxH / 2 + 5} textAnchor="middle" fill={svg.text} fontStyle="italic">
        F
      </text>

      {/* K2 into F */}
      <line
        x1={cxR + 60}
        y1={yF2 + boxH / 2}
        x2={cxR - 50 + boxW / 2}
        y2={yF2 + boxH / 2}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon
        points={`${cxR - 50 + boxW / 2},${yF2 + boxH / 2} ${cxR - 50 + boxW / 2 + 6},${yF2 + boxH / 2 - 4} ${cxR - 50 + boxW / 2 + 6},${yF2 + boxH / 2 + 4}`}
        fill={svg.stroke}
      />
      <text x={cxR + 66} y={yF2 + boxH / 2 + 4} fill={svg.text} fontStyle="italic">
        K₂
      </text>

      {/* F output → XOR on L side round 2 */}
      <line x1={cxR - 50} y1={yF2 + boxH} x2={cxR - 50} y2={yX2} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxR - 50} y1={yX2} x2={cxL + 10} y2={yX2} stroke={svg.stroke} strokeWidth="1.2" />

      {/* XOR round 2 */}
      <circle cx={cxL} cy={yX2} r="10" fill={svg.fillBox} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxL - 7} y1={yX2} x2={cxL + 7} y2={yX2} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cxL} y1={yX2 - 7} x2={cxL} y2={yX2 + 7} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Continuation hint */}
      <line x1={cxL} y1={yX2 + 10} x2={cxL} y2={yOut} stroke={svg.strokeFaint} strokeWidth="1.2" strokeDasharray="3 3" />
      <text x={(cxL + cxR) / 2} y={yOut - 4} textAnchor="middle" fill={svg.textFaint} fontStyle="italic" fontSize="11">
        … další rundy
      </text>
    </svg>
  )
}
