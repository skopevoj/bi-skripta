import { Dg, T, Wire } from './dg'

// Polarizační kódování v BB84. Lineární báze (+): |0⟩ = „|“, |1⟩ = „—“.
// Diagonální báze (×): |0⟩ = „\“, |1⟩ = „/“ — tatáž dvojice otočená o 45°.
export function QubitBases() {
  const W = 520
  const H = 262
  const cy = 140
  const r = 66 // kružnice
  const arm = 80 // polovina délky šipky polarizace
  const panels = [
    { cx: 130, title: 'lineární báze (+)', a0: -90, a1: 0, legend: '|0⟩ = |    |1⟩ = —' },
    { cx: 390, title: 'diagonální báze (×)', a0: -135, a1: -45, legend: '|0⟩ = \\    |1⟩ = /' },
  ]

  // konec šipky ve směru úhlu (stupně, 0 = doprava, −90 = nahoru)
  const at = (cx: number, deg: number, len: number) => {
    const t = (deg * Math.PI) / 180
    return [cx + Math.cos(t) * len, cy + Math.sin(t) * len] as const
  }

  return (
    <Dg
      w={W}
      h={H}
      minW={360}
      title="Dvě konjugované polarizační báze v BB84: lineární báze se svislým stavem 0 a vodorovným stavem 1, diagonální báze otočená o 45 stupňů se stavem 0 jako zpětné lomítko a stavem 1 jako lomítko."
    >
      {panels.map((p, i) => {
        const pol = (deg: number, label: string) => {
          const a = at(p.cx, deg, arm)
          const b = at(p.cx, deg + 180, arm)
          const l = at(p.cx, deg, arm + 16)
          return (
            <g>
              <Wire pts={[b, a]} arrow="both" />
              <T x={l[0]} y={l[1]} k="m">
                {label}
              </T>
            </g>
          )
        }
        return (
          <g key={p.title}>
            <T x={p.cx} y={14} k="tb">
              {p.title}
            </T>
            <circle cx={p.cx} cy={cy} r={r} fill="none" className="dg-life" />
            {i === 1 && (
              <g>
                {/* osy lineární báze pro srovnání a vyznačení úhlu 45° */}
                <Wire pts={[[p.cx, cy - r], [p.cx, cy + r]]} arrow="none" dashed faint />
                <Wire pts={[[p.cx - r, cy], [p.cx + r, cy]]} arrow="none" dashed faint />
                <path
                  className="dg-w"
                  data-faint=""
                  d={`M${p.cx} ${cy - 34} A34 34 0 0 1 ${at(p.cx, -45, 34)[0]} ${at(p.cx, -45, 34)[1]}`}
                />
                <T x={at(p.cx, -67, 48)[0]} y={at(p.cx, -67, 48)[1]} k="sm" muted halo>
                  45°
                </T>
              </g>
            )}
            {pol(p.a0, '|0⟩')}
            {pol(p.a1, '|1⟩')}
            <circle className="dg-dot" cx={p.cx} cy={cy} r={2.5} />
            <T x={p.cx} y={H - 12} k="sm" muted>
              {p.legend}
            </T>
          </g>
        )
      })}
    </Dg>
  )
}
