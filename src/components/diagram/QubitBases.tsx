import { svg } from './Figure'

// BB84 polarization encoding — two conjugate bases shown as compass panels.
// Left: rectilinear basis (+) with vertical |0⟩ and horizontal |1⟩.
// Right: diagonal basis (×) with |0⟩ at +45° and |1⟩ at -45°.
export function QubitBases() {
  const W = 600
  const H = 340

  // Panel centers + geometry
  const r = 70 // circle radius
  const arm = 86 // arrow half-length (slightly outside the circle)
  const cyP = 150 // vertical center of both compasses
  const cxA = 165 // panel (a) center x
  const cxB = 435 // panel (b) center x

  // Double-headed arrow: a single stroke with a small triangle arrowhead at each end.
  const Arrow = ({
    cx,
    cy,
    angle, // degrees, 0 = pointing right
  }: {
    cx: number
    cy: number
    angle: number
  }) => {
    const rad = (angle * Math.PI) / 180
    const dx = Math.cos(rad) * arm
    const dy = Math.sin(rad) * arm
    const x1 = cx - dx
    const y1 = cy - dy
    const x2 = cx + dx
    const y2 = cy + dy

    // Arrowhead size
    const ah = 7 // length along shaft
    const aw = 4.5 // half-width perpendicular

    // Perpendicular unit vector
    const px = -Math.sin(rad)
    const py = Math.cos(rad)

    // Head at (x2, y2) — base point ah back along shaft
    const b2x = x2 - Math.cos(rad) * ah
    const b2y = y2 - Math.sin(rad) * ah
    const head2 = [
      `${x2},${y2}`,
      `${b2x + px * aw},${b2y + py * aw}`,
      `${b2x - px * aw},${b2y - py * aw}`,
    ].join(' ')

    // Head at (x1, y1) — base point ah forward along shaft
    const b1x = x1 + Math.cos(rad) * ah
    const b1y = y1 + Math.sin(rad) * ah
    const head1 = [
      `${x1},${y1}`,
      `${b1x + px * aw},${b1y + py * aw}`,
      `${b1x - px * aw},${b1y - py * aw}`,
    ].join(' ')

    return (
      <g>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={svg.stroke}
          strokeWidth="1.6"
          strokeLinecap="butt"
        />
        <polygon points={head2} fill={svg.stroke} />
        <polygon points={head1} fill={svg.stroke} />
      </g>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 600 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* ─── Panel (a): Lineární báze (+) ─────────────────────────── */}
      <text
        x={cxA}
        y={48}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        Lineární báze (+)
      </text>
      <text
        x={cxA}
        y={30}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        A
      </text>

      <circle
        cx={cxA}
        cy={cyP}
        r={r}
        fill="none"
        stroke={svg.strokeFaint}
        strokeWidth="1"
      />
      {/* Center dot */}
      <circle cx={cxA} cy={cyP} r="1.5" fill={svg.stroke} />

      {/* Vertical |0⟩ */}
      <Arrow cx={cxA} cy={cyP} angle={90} />
      <text
        x={cxA + 10}
        y={cyP - arm + 4}
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        |0⟩
      </text>

      {/* Horizontal |1⟩ */}
      <Arrow cx={cxA} cy={cyP} angle={0} />
      <text
        x={cxA + arm + 6}
        y={cyP - 6}
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        |1⟩
      </text>

      <text
        x={cxA}
        y={cyP + arm + 30}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        fontStyle="italic"
      >
        |0⟩ = | , |1⟩ = —
      </text>

      {/* ─── Panel (b): Diagonální báze (×) ───────────────────────── */}
      <text
        x={cxB}
        y={48}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        Diagonální báze (×)
      </text>
      <text
        x={cxB}
        y={30}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        letterSpacing="2"
      >
        B
      </text>

      <circle
        cx={cxB}
        cy={cyP}
        r={r}
        fill="none"
        stroke={svg.strokeFaint}
        strokeWidth="1"
      />
      <circle cx={cxB} cy={cyP} r="1.5" fill={svg.stroke} />

      {/* |0⟩ at +45° (visually a backslash: top-left ↘ bottom-right).
          In screen coords, angle = +45° draws from upper-left to lower-right
          because y grows downward — which is the "\" orientation. */}
      <Arrow cx={cxB} cy={cyP} angle={45} />
      <text
        x={cxB - arm * 0.71 - 26}
        y={cyP - arm * 0.71 + 2}
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        |0⟩
      </text>

      {/* |1⟩ at -45° (the "/" orientation). */}
      <Arrow cx={cxB} cy={cyP} angle={-45} />
      <text
        x={cxB + arm * 0.71 + 6}
        y={cyP - arm * 0.71 + 2}
        fill={svg.text}
        fontStyle="italic"
        fontSize="13"
      >
        |1⟩
      </text>

      <text
        x={cxB}
        y={cyP + arm + 30}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        fontStyle="italic"
      >
        |0⟩ = \ , |1⟩ = /
      </text>

      {/* ─── Shared caption ───────────────────────────────────────── */}
      <text
        x={W / 2}
        y={H - 24}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="11"
        fontStyle="italic"
      >
        Báze jsou navzájem konjugované — měření v nesprávné bázi dává náhodný výsledek.
      </text>
    </svg>
  )
}
