import { svg } from './Figure'

// DES round function f(R, K_i). Vertical pipeline:
// R (32 b) → E (48 b) → XOR with K_i (48 b) → S₁..S₈ (32 b) → P → f(R, K_i)
export function DESRound() {
  const W = 360
  const H = 460
  const cx = W / 2

  // Vertical layout — each row marks the *top* of the next box or the y of a wire feature.
  const yInLabel = 28
  const yInTick = 44
  const yE = 78
  const yXor = 168
  const ySTop = 210
  const ySBot = ySTop + 46
  const yP = 320
  const yOutTick = 410
  const yOutLabel = 432

  const eW = 140
  const eH = 32
  const pW = 80
  const pH = 32

  // S-boxes — 8 small boxes in a row
  const sCount = 8
  const sW = 30
  const sH = 46
  const sGap = 4
  const sBlockW = sCount * sW + (sCount - 1) * sGap
  const sStartX = cx - sBlockW / 2

  // Key arrow comes in from the right at XOR row
  const xorR = 10
  const keyLabelX = W - 24

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 360 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* Input R */}
      <text x={cx} y={yInLabel} textAnchor="middle" fill={svg.textFaint} fontSize="11" letterSpacing="2">
        VSTUP
      </text>
      <text x={cx} y={yInLabel + 16} textAnchor="middle" fill={svg.text} fontStyle="italic">
        R
      </text>

      {/* R → E */}
      <line x1={cx} y1={yInTick + 8} x2={cx} y2={yE} stroke={svg.stroke} strokeWidth="1.2" />
      <text x={cx + 8} y={(yInTick + 8 + yE) / 2 + 4} fill={svg.textFaint} fontSize="11">
        32
      </text>

      {/* E box (expansion) */}
      <rect
        x={cx - eW / 2}
        y={yE}
        width={eW}
        height={eH}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text x={cx} y={yE + eH / 2 + 5} textAnchor="middle" fill={svg.text} fontStyle="italic">
        E
      </text>

      {/* E → XOR */}
      <line x1={cx} y1={yE + eH} x2={cx} y2={yXor - 10} stroke={svg.stroke} strokeWidth="1.2" />
      <text x={cx + 8} y={(yE + eH + yXor) / 2 + 2} fill={svg.textFaint} fontSize="11">
        48
      </text>

      {/* XOR */}
      <circle cx={cx} cy={yXor} r={xorR} fill={svg.fillBox} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cx - 7} y1={yXor} x2={cx + 7} y2={yXor} stroke={svg.stroke} strokeWidth="1.2" />
      <line x1={cx} y1={yXor - 7} x2={cx} y2={yXor + 7} stroke={svg.stroke} strokeWidth="1.2" />

      {/* Round key K_i into XOR from the right */}
      <line x1={keyLabelX - 4} y1={yXor} x2={cx + xorR} y2={yXor} stroke={svg.stroke} strokeWidth="1.2" />
      <polygon
        points={`${cx + xorR},${yXor} ${cx + xorR + 6},${yXor - 4} ${cx + xorR + 6},${yXor + 4}`}
        fill={svg.stroke}
      />
      <text x={keyLabelX} y={yXor + 4} fill={svg.text} fontStyle="italic">
        Kᵢ
      </text>
      <text x={(cx + xorR + keyLabelX) / 2} y={yXor - 6} textAnchor="middle" fill={svg.textFaint} fontSize="11">
        48
      </text>

      {/* XOR → S-boxes */}
      <line x1={cx} y1={yXor + xorR} x2={cx} y2={ySTop} stroke={svg.stroke} strokeWidth="1.2" />
      <text x={cx + 8} y={(yXor + xorR + ySTop) / 2 + 4} fill={svg.textFaint} fontSize="11">
        48
      </text>

      {/* Fan-out bus into 8 S-boxes: horizontal manifold + 8 droppers */}
      <line
        x1={sStartX + sW / 2}
        y1={ySTop - 8}
        x2={sStartX + sBlockW - sW / 2}
        y2={ySTop - 8}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={cx} cy={ySTop - 8} r="2.5" fill={svg.stroke} />

      {Array.from({ length: sCount }).map((_, i) => {
        const x = sStartX + i * (sW + sGap)
        const xMid = x + sW / 2
        return (
          <g key={`s-${i}`}>
            {/* dropper from manifold into top of S-box */}
            <line x1={xMid} y1={ySTop - 8} x2={xMid} y2={ySTop} stroke={svg.stroke} strokeWidth="1.2" />
            {/* S-box */}
            <rect
              x={x}
              y={ySTop}
              width={sW}
              height={sH}
              fill={svg.fillBox}
              stroke={svg.stroke}
              strokeWidth="1.2"
              rx="2"
            />
            <text x={xMid} y={ySTop + sH / 2 + 4} textAnchor="middle" fill={svg.text} fontStyle="italic" fontSize="12">
              {`S${'₁₂₃₄₅₆₇₈'[i]}`}
            </text>
            {/* riser from bottom of S-box into collecting bus */}
            <line x1={xMid} y1={ySTop + sH} x2={xMid} y2={ySBot + 18} stroke={svg.stroke} strokeWidth="1.2" />
          </g>
        )
      })}

      {/* Collecting bus under S-boxes */}
      <line
        x1={sStartX + sW / 2}
        y1={ySBot + 18}
        x2={sStartX + sBlockW - sW / 2}
        y2={ySBot + 18}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={cx} cy={ySBot + 18} r="2.5" fill={svg.stroke} />

      {/* Bus → P */}
      <line x1={cx} y1={ySBot + 18} x2={cx} y2={yP} stroke={svg.stroke} strokeWidth="1.2" />
      <text x={cx + 8} y={(ySBot + 18 + yP) / 2 + 4} fill={svg.textFaint} fontSize="11">
        32
      </text>

      {/* P box (permutation) */}
      <rect
        x={cx - pW / 2}
        y={yP}
        width={pW}
        height={pH}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        rx="2"
      />
      <text x={cx} y={yP + pH / 2 + 5} textAnchor="middle" fill={svg.text} fontStyle="italic">
        P
      </text>

      {/* P → output */}
      <line x1={cx} y1={yP + pH} x2={cx} y2={yOutTick} stroke={svg.stroke} strokeWidth="1.2" />
      <text x={cx + 8} y={(yP + pH + yOutTick) / 2 + 4} fill={svg.textFaint} fontSize="11">
        32
      </text>

      {/* Output label */}
      <text x={cx} y={yOutLabel - 16} textAnchor="middle" fill={svg.textFaint} fontSize="11" letterSpacing="2">
        VÝSTUP
      </text>
      <text x={cx} y={yOutLabel} textAnchor="middle" fill={svg.text} fontStyle="italic">
        f(R, Kᵢ)
      </text>
    </svg>
  )
}
