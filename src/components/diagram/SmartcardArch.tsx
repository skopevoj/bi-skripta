import { svg } from './Figure'

// Internal architecture of a processor smart card. A rounded "chip" rectangle
// contains the CPU, crypto co-processor, three memory blocks, an I/O interface
// and a small tamper-sensor block, all tapping a central horizontal bus.
// An external Terminal box connects via the I/O pad with an ISO 7816 / 14443 link.
export function SmartcardArch() {
  const W = 520
  const H = 360

  // chip outline
  const chipX = 20
  const chipY = 36
  const chipW = 360
  const chipH = 296

  // central bus (horizontal)
  const busY = chipY + chipH / 2
  const busX1 = chipX + 18
  const busX2 = chipX + chipW - 18

  // box sizes
  const bw = 96 // standard width
  const bh = 44 // standard height
  const noteOffset = 12 // gap between box bottom and its note text

  // top-row boxes (above bus)
  const topY = chipY + 36
  const cpuX = chipX + chipW / 2 - bw / 2 - 70 // CPU left of center
  const coproX = chipX + chipW / 2 - bw / 2 + 70 // Crypto coprocessor right of center
  const sensorsW = 70
  const sensorsH = 28
  const sensorsX = chipX + chipW - sensorsW - 14
  const sensorsY = chipY + 12

  // bottom-row boxes (below bus)
  const bottomY = busY + 40
  const romX = chipX + 20
  const ramX = chipX + chipW / 2 - bw / 2
  const eepromX = chipX + chipW - bw - 20

  // I/O block (left edge, straddling the bus)
  const ioW = 56
  const ioH = 70
  const ioX = chipX - ioW / 2 + 8
  const ioY = busY - ioH / 2

  // Terminal box (outside chip)
  const termW = 96
  const termH = 70
  const termX = W - termW - 14
  const termY = busY - termH / 2

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      style={{ maxWidth: 520 }}
      fontFamily="Inter, system-ui, sans-serif"
      fontSize="12"
    >
      {/* Title above chip */}
      <text
        x={chipX + chipW / 2}
        y={chipY - 14}
        textAnchor="middle"
        fill={svg.textFaint}
        fontSize="10"
        letterSpacing="3"
      >
        ČIPOVÁ KARTA
      </text>

      {/* Chip outline (silicon die) */}
      <rect
        x={chipX}
        y={chipY}
        width={chipW}
        height={chipH}
        rx="14"
        fill={svg.fillBoxAlt}
        stroke={svg.stroke}
        strokeWidth="1.4"
      />

      {/* Central bus */}
      <line
        x1={busX1}
        y1={busY}
        x2={busX2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="3"
      />
      <text
        x={busX2 - 4}
        y={busY - 6}
        textAnchor="end"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        sběrnice
      </text>

      {/* CPU */}
      <rect
        x={cpuX}
        y={topY}
        width={bw}
        height={bh}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text x={cpuX + bw / 2} y={topY + bh / 2 + 4} textAnchor="middle" fill={svg.text}>
        CPU
      </text>
      <line
        x1={cpuX + bw / 2}
        y1={topY + bh}
        x2={cpuX + bw / 2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={cpuX + bw / 2} cy={busY} r="2.5" fill={svg.stroke} />

      {/* Crypto co-processor */}
      <rect
        x={coproX}
        y={topY}
        width={bw}
        height={bh}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text x={coproX + bw / 2} y={topY + bh / 2} textAnchor="middle" fill={svg.text} fontSize="11">
        Kryptografický
      </text>
      <text x={coproX + bw / 2} y={topY + bh / 2 + 13} textAnchor="middle" fill={svg.text} fontSize="11">
        koprocesor
      </text>
      <line
        x1={coproX + bw / 2}
        y1={topY + bh}
        x2={coproX + bw / 2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={coproX + bw / 2} cy={busY} r="2.5" fill={svg.stroke} />

      {/* Sensors (tamper) */}
      <rect
        x={sensorsX}
        y={sensorsY}
        width={sensorsW}
        height={sensorsH}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      <text
        x={sensorsX + sensorsW / 2}
        y={sensorsY + sensorsH / 2 + 4}
        textAnchor="middle"
        fill={svg.text}
        fontSize="11"
      >
        Senzory
      </text>

      {/* ROM */}
      <rect
        x={romX}
        y={bottomY}
        width={bw}
        height={bh}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text x={romX + bw / 2} y={bottomY + bh / 2 + 4} textAnchor="middle" fill={svg.text}>
        ROM
      </text>
      <text
        x={romX + bw / 2}
        y={bottomY + bh + noteOffset}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        program / OS
      </text>
      <line
        x1={romX + bw / 2}
        y1={bottomY}
        x2={romX + bw / 2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={romX + bw / 2} cy={busY} r="2.5" fill={svg.stroke} />

      {/* RAM */}
      <rect
        x={ramX}
        y={bottomY}
        width={bw}
        height={bh}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text x={ramX + bw / 2} y={bottomY + bh / 2 + 4} textAnchor="middle" fill={svg.text}>
        RAM
      </text>
      <text
        x={ramX + bw / 2}
        y={bottomY + bh + noteOffset}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        pracovní paměť
      </text>
      <line
        x1={ramX + bw / 2}
        y1={bottomY}
        x2={ramX + bw / 2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={ramX + bw / 2} cy={busY} r="2.5" fill={svg.stroke} />

      {/* EEPROM / Flash */}
      <rect
        x={eepromX}
        y={bottomY}
        width={bw}
        height={bh}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text x={eepromX + bw / 2} y={bottomY + bh / 2 + 4} textAnchor="middle" fill={svg.text} fontSize="11">
        EEPROM / Flash
      </text>
      <text
        x={eepromX + bw / 2}
        y={bottomY + bh + noteOffset}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        perzistentní data, applety
      </text>
      <line
        x1={eepromX + bw / 2}
        y1={bottomY}
        x2={eepromX + bw / 2}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <circle cx={eepromX + bw / 2} cy={busY} r="2.5" fill={svg.stroke} />

      {/* I/O interface — straddles the chip edge */}
      <rect
        x={ioX}
        y={ioY}
        width={ioW}
        height={ioH}
        rx="2"
        fill={svg.fillEmphasis}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text
        x={ioX + ioW / 2}
        y={ioY + ioH / 2 - 2}
        textAnchor="middle"
        fill={svg.text}
        fontSize="11"
      >
        I/O
      </text>
      <text
        x={ioX + ioW / 2}
        y={ioY + ioH / 2 + 12}
        textAnchor="middle"
        fill={svg.text}
        fontSize="11"
      >
        rozhraní
      </text>
      {/* I/O → bus tap (rightward) */}
      <line
        x1={ioX + ioW}
        y1={busY}
        x2={busX1}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />

      {/* External link: I/O → Terminal */}
      <line
        x1={ioX}
        y1={busY}
        x2={termX}
        y2={busY}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <polygon
        points={`${termX},${busY} ${termX - 7},${busY - 4} ${termX - 7},${busY + 4}`}
        fill={svg.stroke}
      />
      <polygon
        points={`${ioX},${busY} ${ioX + 7},${busY - 4} ${ioX + 7},${busY + 4}`}
        fill={svg.stroke}
      />
      <text
        x={(ioX + termX) / 2}
        y={busY - 8}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        ISO 7816 / ISO 14443
      </text>

      {/* Terminal box (outside chip) */}
      <rect
        x={termX}
        y={termY}
        width={termW}
        height={termH}
        rx="2"
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth="1.2"
      />
      <text
        x={termX + termW / 2}
        y={termY + termH / 2 + 4}
        textAnchor="middle"
        fill={svg.text}
      >
        Terminál
      </text>
      <text
        x={termX + termW / 2}
        y={termY + termH + noteOffset}
        textAnchor="middle"
        fill={svg.textFaint}
        fontStyle="italic"
        fontSize="10"
      >
        čtečka
      </text>
    </svg>
  )
}
