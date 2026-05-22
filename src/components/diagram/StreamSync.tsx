import { svg } from './Figure'

// Synchronous vs self-synchronizing stream cipher (encryption side).
// Two side-by-side schemas: (a) no feedback from ciphertext into the generator,
// (b) ciphertext fed back into the generator through an n-symbol shift register.
export function StreamSync() {
  const W = 560
  const H = 280

  // Per-panel layout (mirrored on left and right halves of the canvas).
  // x offsets are added per panel.
  const panelW = 280
  const gx = 90 // generator box center x within panel
  const xorX = 200 // XOR center x within panel
  const cTermX = 260 // ciphertext label x within panel

  const yGen = 110 // generator vertical center
  const yWire = yGen // hᵢ wire runs at generator center
  const yXor = yGen // XOR aligned with generator output
  const yPlain = 50 // plaintext label / arrow start
  const ySubLabel = 24 // panel sublabel

  const genW = 90
  const genH = 56
  const srW = 70
  const srH = 26

  // Helpers
  const stroke = svg.stroke
  const sw = 1.2

  // A right-pointing arrowhead at (x,y).
  const arrowR = (x: number, y: number) => (
    <polygon
      points={`${x},${y} ${x - 6},${y - 4} ${x - 6},${y + 4}`}
      fill={stroke}
    />
  )
  // Down-pointing arrowhead at (x,y).
  const arrowD = (x: number, y: number) => (
    <polygon
      points={`${x},${y} ${x - 4},${y - 6} ${x + 4},${y - 6}`}
      fill={stroke}
    />
  )

  // Render one panel at horizontal offset ox.
  // showFeedback toggles the ciphertext → shift register → generator loop.
  const Panel = (ox: number, sublabel: string, showFeedback: boolean) => {
    const gxA = ox + gx
    const xorXA = ox + xorX
    const cXA = ox + cTermX

    return (
      <g>
        {/* Sublabel above panel */}
        <text
          x={ox + panelW / 2}
          y={ySubLabel}
          textAnchor="middle"
          fill={svg.text}
          fontStyle="italic"
          fontSize="13"
        >
          {sublabel}
        </text>

        {/* Key K input — arrow into generator from the left */}
        <line
          x1={ox + 10}
          y1={yGen - 14}
          x2={gxA - genW / 2}
          y2={yGen - 14}
          stroke={stroke}
          strokeWidth={sw}
        />
        {arrowR(gxA - genW / 2, yGen - 14)}
        <text
          x={ox + 14}
          y={yGen - 18}
          fill={svg.text}
          fontStyle="italic"
          fontSize="13"
        >
          K
        </text>
        <text
          x={ox + 14}
          y={yGen - 2}
          fill={svg.textFaint}
          fontSize="10"
          letterSpacing="1.5"
        >
          klíč
        </text>

        {/* Generator box */}
        <rect
          x={gxA - genW / 2}
          y={yGen - genH / 2}
          width={genW}
          height={genH}
          fill={svg.fillBox}
          stroke={stroke}
          strokeWidth={sw}
          rx="2"
        />
        <text
          x={gxA}
          y={yGen - 4}
          textAnchor="middle"
          fill={svg.text}
          fontSize="12"
        >
          Generátor
        </text>
        <text
          x={gxA}
          y={yGen + 12}
          textAnchor="middle"
          fill={svg.text}
          fontSize="12"
        >
          hesla
        </text>

        {/* Generator output hᵢ → wire toward XOR */}
        <line
          x1={gxA + genW / 2}
          y1={yWire}
          x2={xorXA - 10}
          y2={yWire}
          stroke={stroke}
          strokeWidth={sw}
        />
        <text
          x={(gxA + genW / 2 + xorXA - 10) / 2}
          y={yWire - 6}
          textAnchor="middle"
          fill={svg.text}
          fontStyle="italic"
          fontSize="12"
        >
          hᵢ
        </text>

        {/* Plaintext pᵢ entering XOR from above */}
        <text
          x={xorXA}
          y={yPlain - 10}
          textAnchor="middle"
          fill={svg.textFaint}
          fontSize="10"
          letterSpacing="1.5"
        >
          OT
        </text>
        <text
          x={xorXA + 10}
          y={yPlain + 6}
          fill={svg.text}
          fontStyle="italic"
          fontSize="13"
        >
          pᵢ
        </text>
        <line
          x1={xorXA}
          y1={yPlain + 10}
          x2={xorXA}
          y2={yXor - 10}
          stroke={stroke}
          strokeWidth={sw}
        />
        {arrowD(xorXA, yXor - 10)}

        {/* XOR symbol */}
        <circle
          cx={xorXA}
          cy={yXor}
          r="10"
          fill={svg.fillBox}
          stroke={stroke}
          strokeWidth={sw}
        />
        <line x1={xorXA - 7} y1={yXor} x2={xorXA + 7} y2={yXor} stroke={stroke} strokeWidth={sw} />
        <line x1={xorXA} y1={yXor - 7} x2={xorXA} y2={yXor + 7} stroke={stroke} strokeWidth={sw} />

        {/* XOR → ciphertext */}
        <line
          x1={xorXA + 10}
          y1={yXor}
          x2={cXA - 14}
          y2={yXor}
          stroke={stroke}
          strokeWidth={sw}
        />
        {arrowR(cXA - 14, yXor)}
        <text
          x={cXA - 6}
          y={yXor + 5}
          fill={svg.text}
          fontStyle="italic"
          fontSize="13"
        >
          cᵢ
        </text>
        <text
          x={cXA - 4}
          y={yXor - 12}
          fill={svg.textFaint}
          fontSize="10"
          letterSpacing="1.5"
        >
          ŠT
        </text>

        {/* Feedback path (only for self-synchronizing) */}
        {showFeedback && (
          <g>
            {/* Tap on the ciphertext wire */}
            <circle cx={cXA - 20} cy={yXor} r="2.5" fill={stroke} />

            {/* Drop down from the ciphertext wire */}
            <line
              x1={cXA - 20}
              y1={yXor}
              x2={cXA - 20}
              y2={yGen + 80}
              stroke={stroke}
              strokeWidth={sw}
            />
            {/* Run left to under the shift register */}
            <line
              x1={cXA - 20}
              y1={yGen + 80}
              x2={gxA + srW / 2}
              y2={yGen + 80}
              stroke={stroke}
              strokeWidth={sw}
            />

            {/* Shift register box (n-symbol delay) under the generator */}
            <rect
              x={gxA - srW / 2}
              y={yGen + 80 - srH / 2}
              width={srW}
              height={srH}
              fill={svg.fillBoxAlt}
              stroke={stroke}
              strokeWidth={sw}
              rx="2"
            />
            {/* internal cell ticks to hint a shift register */}
            <line
              x1={gxA - srW / 2 + srW / 3}
              y1={yGen + 80 - srH / 2}
              x2={gxA - srW / 2 + srW / 3}
              y2={yGen + 80 + srH / 2}
              stroke={svg.strokeFaint}
              strokeWidth="1"
            />
            <line
              x1={gxA - srW / 2 + (2 * srW) / 3}
              y1={yGen + 80 - srH / 2}
              x2={gxA - srW / 2 + (2 * srW) / 3}
              y2={yGen + 80 + srH / 2}
              stroke={svg.strokeFaint}
              strokeWidth="1"
            />
            <text
              x={gxA}
              y={yGen + 84}
              textAnchor="middle"
              fill={svg.text}
              fontSize="11"
              fontStyle="italic"
            >
              n-symb. zpoždění
            </text>

            {/* Up from shift register into generator (bottom edge) */}
            <line
              x1={gxA}
              y1={yGen + 80 - srH / 2}
              x2={gxA}
              y2={yGen + genH / 2 + 4}
              stroke={stroke}
              strokeWidth={sw}
            />
            {arrowD(gxA, yGen + genH / 2 + 4)}

            {/* Feedback label — uses the wire that runs along the bottom */}
            <text
              x={(cXA - 20 + gxA + srW / 2) / 2}
              y={yGen + 80 + srH / 2 + 14}
              textAnchor="middle"
              fill={svg.text}
              fontStyle="italic"
              fontSize="11"
            >
              cᵢ₋ₙ … cᵢ₋₁
            </text>
          </g>
        )}

        {/* "no feedback" hint for the synchronous panel */}
        {!showFeedback && (
          <text
            x={ox + panelW / 2}
            y={yGen + 100}
            textAnchor="middle"
            fill={svg.textFaint}
            fontSize="11"
            fontStyle="italic"
          >
            stav generátoru nezávisí na ŠT
          </text>
        )}
      </g>
    )
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {Panel(0, '(a) Synchronní', false)}

      {/* Faint divider between panels */}
      <line
        x1={panelW}
        y1={20}
        x2={panelW}
        y2={H - 20}
        stroke={svg.strokeFaint}
        strokeWidth="1"
        strokeDasharray="3 4"
      />

      {Panel(panelW, '(b) Samosynchronizující', true)}
    </svg>
  )
}
