import { svg } from './Figure'

// ISO 7816-4 APDU structure. Two stacked horizontal frames:
// the command APDU (header + optional body) and the response APDU
// (optional body + mandatory trailer). Sterile, textbook-style layout.
export function ApduFrame() {
  const W = 620
  const H = 280

  // Field box geometry
  const unit = 46 // width of a 1-byte field
  const dataW = 138 // width of a variable-length Data field
  const boxH = 34

  // ── Command APDU (top) ─────────────────────────────────────────
  const cmdY = 70 // top of the row of boxes
  const cmdX0 = 36 // left edge

  // 4 header bytes + Lc + Data + Le
  const cmdFields = [
    { name: 'CLA', w: unit, note: 'třída' },
    { name: 'INS', w: unit, note: 'instrukce' },
    { name: 'P1', w: unit, note: 'parametr 1' },
    { name: 'P2', w: unit, note: 'parametr 2' },
    { name: 'Lc', w: unit, note: 'délka dat' },
    { name: 'Data', w: dataW, note: 'data' },
    { name: 'Le', w: unit, note: 'oček. délka odp.' },
  ]
  const cmdX: number[] = []
  {
    let cursor = cmdX0
    for (const f of cmdFields) {
      cmdX.push(cursor)
      cursor += f.w
    }
  }
  const headerLeft = cmdX[0]
  const headerRight = cmdX[3] + cmdFields[3].w
  const bodyLeft = cmdX[4]
  const bodyRight = cmdX[6] + cmdFields[6].w

  // ── Response APDU (bottom) ─────────────────────────────────────
  const rspY = 200
  const rspFields = [
    { name: 'Data', w: dataW, note: 'data odpovědi' },
    { name: 'SW1', w: unit, note: 'stavové slovo 1' },
    { name: 'SW2', w: unit, note: 'stavové slovo 2' },
  ]
  const rspTotalW =
    rspFields[0].w + rspFields[1].w + rspFields[2].w
  // Center the response row under the command row
  const rspX0 = cmdX0 + (cmdFields.reduce((s, f) => s + f.w, 0) - rspTotalW) / 2
  const rspX: number[] = []
  {
    let cursor = rspX0
    for (const f of rspFields) {
      rspX.push(cursor)
      cursor += f.w
    }
  }
  const rBodyLeft = rspX[0]
  const rBodyRight = rspX[0] + rspFields[0].w
  const trailerLeft = rspX[1]
  const trailerRight = rspX[2] + rspFields[2].w

  // Bracket helper: a small flat U above a span of boxes
  function bracket(x1: number, x2: number, y: number, label: string) {
    const drop = 6
    const top = y - 18
    return (
      <g>
        <path
          d={`M ${x1} ${y} L ${x1} ${top + drop} L ${x1 + 4} ${top} L ${x2 - 4} ${top} L ${x2} ${top + drop} L ${x2} ${y}`}
          fill="none"
          stroke={svg.strokeMuted}
          strokeWidth="1"
        />
        <text
          x={(x1 + x2) / 2}
          y={top - 6}
          textAnchor="middle"
          fill={svg.textMuted}
          fontSize="10"
          letterSpacing="1.6"
        >
          {label.toUpperCase()}
        </text>
      </g>
    )
  }

  // Field box helper
  function field(
    x: number,
    y: number,
    w: number,
    name: string,
    note: string,
    emphasis = false,
  ) {
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={w}
          height={boxH}
          fill={emphasis ? svg.fillEmphasis : svg.fillBox}
          stroke={svg.stroke}
          strokeWidth="1.2"
          rx="2"
        />
        <text
          x={x + w / 2}
          y={y + boxH / 2 + 4}
          textAnchor="middle"
          fill={svg.text}
          fontSize="13"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing="1.2"
        >
          {name}
        </text>
        <text
          x={x + w / 2}
          y={y + boxH + 16}
          textAnchor="middle"
          fill={svg.textFaint}
          fontSize="11"
          fontStyle="italic"
        >
          {note}
        </text>
      </g>
    )
  }

  // Section titles on the left margin
  const sectionTitleStyle = {
    fill: svg.textMuted,
    fontSize: 10,
    letterSpacing: '1.8',
  } as const

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: W }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="13"
    >
      {/* ── COMMAND APDU ── */}
      <text x={cmdX0} y={cmdY - 44} {...sectionTitleStyle}>
        COMMAND APDU
      </text>

      {/* Brackets above */}
      {bracket(headerLeft, headerRight, cmdY, 'Hlavička (povinná)')}
      {bracket(bodyLeft, bodyRight, cmdY, 'Tělo (volitelné)')}

      {/* Header — emphasized to signal mandatory */}
      {cmdFields.slice(0, 4).map((f, i) => (
        <g key={`cmdh-${i}`}>
          {field(cmdX[i], cmdY, f.w, f.name, f.note, true)}
        </g>
      ))}
      {/* Body — plain fill, optional */}
      {cmdFields.slice(4).map((f, i) => (
        <g key={`cmdb-${i}`}>
          {field(cmdX[i + 4], cmdY, f.w, f.name, f.note, false)}
        </g>
      ))}

      {/* Byte-count annotations under field notes */}
      {cmdFields.map((f, i) => (
        <text
          key={`cmdsize-${i}`}
          x={cmdX[i] + f.w / 2}
          y={cmdY + boxH + 30}
          textAnchor="middle"
          fill={svg.textFaint}
          fontSize="10"
        >
          {f.name === 'Data' ? 'Lc B' : '1 B'}
        </text>
      ))}

      {/* Subtle divider between command and response */}
      <line
        x1={cmdX0}
        y1={150}
        x2={cmdX0 + cmdFields.reduce((s, f) => s + f.w, 0)}
        y2={150}
        stroke={svg.strokeFaint}
        strokeWidth="1"
        strokeDasharray="2 4"
      />

      {/* ── RESPONSE APDU ── */}
      <text x={cmdX0} y={rspY - 44} {...sectionTitleStyle}>
        RESPONSE APDU
      </text>

      {/* Brackets above */}
      {bracket(rBodyLeft, rBodyRight, rspY, 'Tělo (volitelné)')}
      {bracket(trailerLeft, trailerRight, rspY, 'Zápatí (povinné)')}

      {/* Body — optional */}
      {field(rspX[0], rspY, rspFields[0].w, rspFields[0].name, rspFields[0].note, false)}
      {/* Trailer — emphasized */}
      {field(rspX[1], rspY, rspFields[1].w, rspFields[1].name, rspFields[1].note, true)}
      {field(rspX[2], rspY, rspFields[2].w, rspFields[2].name, rspFields[2].note, true)}

      {/* Byte-count annotations */}
      {rspFields.map((f, i) => (
        <text
          key={`rspsize-${i}`}
          x={rspX[i] + f.w / 2}
          y={rspY + boxH + 30}
          textAnchor="middle"
          fill={svg.textFaint}
          fontSize="10"
        >
          {f.name === 'Data' ? 'Le B' : '1 B'}
        </text>
      ))}
    </svg>
  )
}
