import { Box, Dg, Dot, T, Wire } from './dg'

// Architektura procesorové čipové karty: CPU, kryptografický koprocesor, senzory a paměti ROM/RAM/EEPROM
// na vnitřní sběrnici; I/O rozhraní na okraji čipu komunikuje s terminálem (ISO 7816 / ISO 14443).
export function SmartcardArch() {
  const W = 620
  const H = 300

  const chip = { x: 12, y: 30, w: 420, h: 258 }
  const yBus = 159
  const busX1 = 36
  const busX2 = 400
  const yTop = 92
  const yBot = 226
  const bh = 44
  const cols = [86, 226, 362]

  const top = [
    { label: 'CPU', w: 104 },
    { label: 'krypto-koprocesor', w: 136 },
    { label: 'senzory', w: 92 },
  ]
  const bottom = [
    { label: 'ROM', sub: 'OS, program', w: 104 },
    { label: 'RAM', sub: 'pracovní paměť', w: 104 },
    { label: 'EEPROM / Flash', sub: 'data, applety', w: 120 },
  ]

  const xIO = 432
  const ioW = 64
  const xTerm = 572

  return (
    <Dg
      w={W}
      h={H}
      title="Architektura procesorové čipové karty: CPU, kryptografický koprocesor, senzory a paměti ROM, RAM a EEPROM na vnitřní sběrnici; I/O rozhraní komunikuje s terminálem."
    >
      <rect className="dg-group" x={chip.x} y={chip.y} width={chip.w} height={chip.h} rx={10} />
      <T x={chip.x} y={14} k="h" a="start">
        procesorová čipová karta
      </T>

      <line className="dg-bus" x1={busX1} y1={yBus} x2={busX2} y2={yBus} />
      <T x={busX1} y={yBus - 12} k="s" a="start" muted>
        sběrnice
      </T>

      {top.map((b, i) => (
        <g key={b.label}>
          <Wire pts={[[cols[i], yTop + bh / 2], [cols[i], yBus]]} arrow="none" />
          <Dot x={cols[i]} y={yBus} />
          <Box x={cols[i]} y={yTop} w={b.w} h={bh} label={b.label} />
        </g>
      ))}
      {bottom.map((b, i) => (
        <g key={b.label}>
          <Wire pts={[[cols[i], yBus], [cols[i], yBot - bh / 2]]} arrow="none" />
          <Dot x={cols[i]} y={yBus} />
          <Box x={cols[i]} y={yBot} w={b.w} h={bh} label={b.label} sub={b.sub} />
        </g>
      ))}

      {/* I/O na okraji čipu, spojené se sběrnicí */}
      <Wire pts={[[busX2 - 24, yBus], [xIO - ioW / 2, yBus]]} arrow="none" />
      <Box x={xIO} y={yBus} w={ioW} h={bh} label="I/O" sub="rozhraní" />

      {/* vnější spojení s terminálem */}
      <Wire pts={[[xIO + ioW / 2 + 1, yBus], [xTerm - 40 - 1, yBus]]} arrow="both" />
      <T x={(xIO + ioW / 2 + xTerm - 40) / 2} y={yBus - 26} k="sm" muted>
        ISO 7816
      </T>
      <T x={(xIO + ioW / 2 + xTerm - 40) / 2} y={yBus - 12} k="sm" muted>
        ISO 14443
      </T>
      <Box x={xTerm} y={yBus} w={80} h={bh} label="terminál" sub="čtečka" />
    </Dg>
  )
}
