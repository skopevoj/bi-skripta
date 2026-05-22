import { svg } from './Figure'

// Public-key authority protocol: 3-actor sequence diagram.
// A requests B's verification key from the trusted Authority (and vice versa),
// then A and B run a nonce-based handshake to mutually authenticate.
export function PubkeyAuthority() {
  const W = 680
  const H = 560

  // Lifeline x-coordinates
  const xA = 120 // user A
  const xAut = 340 // Authority
  const xB = 560 // user B

  // Actor box geometry
  const boxW = 160
  const boxH = 44
  const yBoxTop = 20
  const yBoxBottom = yBoxTop + boxH

  // Lifeline vertical extent
  const yLifeStart = yBoxBottom
  const yLifeEnd = H - 20

  // Message y-coordinates (top → bottom time flow)
  const y1 = 110 // A → Aut: Req. ‖ T1
  const y2 = 170 // Aut → A: E_SK_Aut(VK_B ‖ Req. ‖ T1)
  const y3 = 240 // A → B:  E_VK_B(ID_A ‖ N1)
  const y4 = 310 // B → Aut: Req. ‖ T2
  const y5 = 370 // Aut → B: E_SK_Aut(VK_A ‖ Req. ‖ T2)
  const y6 = 440 // B → A:  E_VK_A(N1 ‖ N2)
  const y7 = 510 // A → B:  E_VK_B(N2)

  // Arrowhead helpers --------------------------------------------------------
  const arrowSize = 5
  const triRight = (x: number, y: number) =>
    `${x},${y} ${x - arrowSize - 1},${y - arrowSize} ${x - arrowSize - 1},${y + arrowSize}`
  const triLeft = (x: number, y: number) =>
    `${x},${y} ${x + arrowSize + 1},${y - arrowSize} ${x + arrowSize + 1},${y + arrowSize}`

  const stepX = 18 // far-left step number gutter

  // Encrypted-payload label: E with subscripted key, then plaintext in parens.
  // Renders as italic text with tspan baseline-shifted subscript for the key.
  const Enc = ({
    x,
    y,
    keyText,
    body,
  }: {
    x: number
    y: number
    keyText: string
    body: string
  }) => (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill={svg.text}
      fontStyle="italic"
      fontSize="12"
    >
      E
      <tspan baselineShift="sub" fontSize="9.5" fontStyle="italic">
        {keyText}
      </tspan>
      <tspan fontStyle="italic">{`(${body})`}</tspan>
    </text>
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 680 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* ---------- Actor boxes ---------- */}
      {[
        { x: xA, label: 'A' },
        { x: xAut, label: 'Autorita' },
        { x: xB, label: 'B' },
      ].map((a) => (
        <g key={a.label}>
          <rect
            x={a.x - boxW / 2}
            y={yBoxTop}
            width={boxW}
            height={boxH}
            fill={svg.fillBox}
            stroke={svg.stroke}
            strokeWidth="1.2"
            rx="2"
          />
          <text
            x={a.x}
            y={yBoxTop + boxH / 2 + 4}
            textAnchor="middle"
            fill={svg.text}
          >
            {a.label}
          </text>
        </g>
      ))}

      {/* ---------- Lifelines (dashed) ---------- */}
      {[xA, xAut, xB].map((x) => (
        <line
          key={x}
          x1={x}
          y1={yLifeStart}
          x2={x}
          y2={yLifeEnd}
          stroke={svg.strokeFaint}
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />
      ))}

      {/* ====================================================== */}
      {/* 1. A → Aut: Req. ‖ T1                                  */}
      {/* ====================================================== */}
      <text x={stepX} y={y1 + 4} fill={svg.textFaint} fontSize="11">
        1.
      </text>
      <line
        x1={xA}
        y1={y1}
        x2={xAut - arrowSize - 1}
        y2={y1}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xAut - 1, y1)} fill={svg.stroke} />
      <text
        x={(xA + xAut) / 2}
        y={y1 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        Req. ‖ T₁
      </text>

      {/* ====================================================== */}
      {/* 2. Aut → A: E_SK_Aut(VK_B ‖ Req. ‖ T1)                 */}
      {/* ====================================================== */}
      <text x={stepX} y={y2 + 4} fill={svg.textFaint} fontSize="11">
        2.
      </text>
      <line
        x1={xAut}
        y1={y2}
        x2={xA + arrowSize + 1}
        y2={y2}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xA + 1, y2)} fill={svg.stroke} />
      <Enc
        x={(xA + xAut) / 2}
        y={y2 - 6}
        keyText="SK_Aut"
        body="VK_B ‖ Req. ‖ T₁"
      />

      {/* ====================================================== */}
      {/* 3. A → B: E_VK_B(ID_A ‖ N1)                            */}
      {/* ====================================================== */}
      <text x={stepX} y={y3 + 4} fill={svg.textFaint} fontSize="11">
        3.
      </text>
      <line
        x1={xA}
        y1={y3}
        x2={xB - arrowSize - 1}
        y2={y3}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xB - 1, y3)} fill={svg.stroke} />
      <Enc x={(xA + xB) / 2} y={y3 - 6} keyText="VK_B" body="ID_A ‖ N₁" />

      {/* ====================================================== */}
      {/* 4. B → Aut: Req. ‖ T2                                  */}
      {/* ====================================================== */}
      <text x={stepX} y={y4 + 4} fill={svg.textFaint} fontSize="11">
        4.
      </text>
      <line
        x1={xB}
        y1={y4}
        x2={xAut + arrowSize + 1}
        y2={y4}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xAut + 1, y4)} fill={svg.stroke} />
      <text
        x={(xAut + xB) / 2}
        y={y4 - 6}
        textAnchor="middle"
        fill={svg.text}
        fontStyle="italic"
        fontSize="12"
      >
        Req. ‖ T₂
      </text>

      {/* ====================================================== */}
      {/* 5. Aut → B: E_SK_Aut(VK_A ‖ Req. ‖ T2)                 */}
      {/* ====================================================== */}
      <text x={stepX} y={y5 + 4} fill={svg.textFaint} fontSize="11">
        5.
      </text>
      <line
        x1={xAut}
        y1={y5}
        x2={xB - arrowSize - 1}
        y2={y5}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xB - 1, y5)} fill={svg.stroke} />
      <Enc
        x={(xAut + xB) / 2}
        y={y5 - 6}
        keyText="SK_Aut"
        body="VK_A ‖ Req. ‖ T₂"
      />

      {/* ====================================================== */}
      {/* 6. B → A: E_VK_A(N1 ‖ N2)                              */}
      {/* ====================================================== */}
      <text x={stepX} y={y6 + 4} fill={svg.textFaint} fontSize="11">
        6.
      </text>
      <line
        x1={xB}
        y1={y6}
        x2={xA + arrowSize + 1}
        y2={y6}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triLeft(xA + 1, y6)} fill={svg.stroke} />
      <Enc x={(xA + xB) / 2} y={y6 - 6} keyText="VK_A" body="N₁ ‖ N₂" />

      {/* ====================================================== */}
      {/* 7. A → B: E_VK_B(N2)                                   */}
      {/* ====================================================== */}
      <text x={stepX} y={y7 + 4} fill={svg.textFaint} fontSize="11">
        7.
      </text>
      <line
        x1={xA}
        y1={y7}
        x2={xB - arrowSize - 1}
        y2={y7}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon points={triRight(xB - 1, y7)} fill={svg.stroke} />
      <Enc x={(xA + xB) / 2} y={y7 - 6} keyText="VK_B" body="N₂" />
    </svg>
  )
}
