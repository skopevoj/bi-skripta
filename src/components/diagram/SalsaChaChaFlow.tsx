import { svg } from './Figure'

type BoxProps = {
  x: number
  y: number
  w: number
  h: number
  title: string
  subtitle?: string
  fill?: string
}

function Box({ x, y, w, h, title, subtitle, fill = svg.fillBox }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill={fill}
        stroke={svg.stroke}
        strokeWidth={1.25}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - (subtitle ? 4 : -4)}
        textAnchor="middle"
        fill={svg.text}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={13}
        fontWeight={600}
      >
        {title}
      </text>
      {subtitle && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 14}
          textAnchor="middle"
          fill={svg.textMuted}
          fontFamily="ui-monospace, monospace"
          fontSize={11}
        >
          {subtitle}
        </text>
      )}
    </g>
  )
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={svg.stroke}
        strokeWidth={1.5}
        markerEnd="url(#salsa-chacha-flow-arrow)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 8}
          textAnchor="middle"
          fill={svg.textFaint}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize={11}
        >
          {label}
        </text>
      )}
    </g>
  )
}

export function SalsaChaChaFlow() {
  return (
    <svg
      viewBox="0 0 760 270"
      width="100%"
      style={{ maxWidth: 760, minWidth: 620, display: 'block' }}
      role="img"
      aria-label="Schéma proudové šifry Salsa20 nebo ChaCha: klíč, nonce a čítač vstupují do generátoru hesla; heslo se XORuje s otevřeným textem a vzniká šifrový text."
    >
      <defs>
        <marker
          id="salsa-chacha-flow-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth={6}
          markerHeight={6}
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={svg.stroke} />
        </marker>
      </defs>

      <text
        x={380}
        y={24}
        textAnchor="middle"
        fill={svg.text}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={14}
        fontWeight={650}
      >
        Proudová šifra: generátor vyrobí heslo, zpráva se jen XORuje
      </text>

      <Box x={32} y={62} w={108} h={42} title="Klíč" subtitle="K" />
      <Box x={32} y={114} w={108} h={42} title="Nonce / IV" subtitle="N" />
      <Box x={32} y={166} w={108} h={42} title="Čítač bloku" subtitle="i" />

      <Box
        x={210}
        y={88}
        w={148}
        h={94}
        title="Salsa / ChaCha"
        subtitle="keystream generator"
        fill={svg.fillBoxAlt}
      />

      <Arrow x1={140} y1={83} x2={210} y2={118} />
      <Arrow x1={140} y1={135} x2={210} y2={135} />
      <Arrow x1={140} y1={187} x2={210} y2={152} />

      <Box x={420} y={105} w={120} h={60} title="Blok hesla" subtitle="Hᵢ" />
      <Arrow x1={358} y1={135} x2={420} y2={135} label="20 rund ARX" />

      <Box x={420} y={28} w={120} h={48} title="Otevřený text" subtitle="Mᵢ" />

      <circle
        cx={602}
        cy={135}
        r={18}
        fill={svg.fillBox}
        stroke={svg.stroke}
        strokeWidth={1.4}
      />
      <line x1={590} y1={135} x2={614} y2={135} stroke={svg.stroke} strokeWidth={1.4} />
      <line x1={602} y1={123} x2={602} y2={147} stroke={svg.stroke} strokeWidth={1.4} />
      <text
        x={602}
        y={174}
        textAnchor="middle"
        fill={svg.textFaint}
        fontFamily="ui-monospace, monospace"
        fontSize={12}
      >
        Cᵢ = Mᵢ ⊕ Hᵢ
      </text>

      <Arrow x1={540} y1={135} x2={584} y2={135} />
      <Arrow x1={540} y1={52} x2={591} y2={124} label="zpráva" />

      <Box x={650} y={111} w={78} h={48} title="ŠT" subtitle="Cᵢ" />
      <Arrow x1={620} y1={135} x2={650} y2={135} />

      <path
        d="M420 216 H650"
        fill="none"
        stroke={svg.strokeMuted}
        strokeWidth={1.1}
        strokeDasharray="4 4"
        markerEnd="url(#salsa-chacha-flow-arrow)"
      />
      <text
        x={535}
        y={238}
        textAnchor="middle"
        fill={svg.textMuted}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize={12}
      >
        Dešifrování je stejný XOR: Mᵢ = Cᵢ ⊕ Hᵢ
      </text>
    </svg>
  )
}
