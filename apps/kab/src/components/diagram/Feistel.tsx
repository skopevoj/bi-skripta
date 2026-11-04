import { Box, Dg, Dot, Ix, Op, T, Wire, Xor, XOR_R } from './dg'

// Dvě rundy Feistelovy sítě: (Lᵢ₊₁, Rᵢ₊₁) = (Rᵢ, Lᵢ ⊕ F(Rᵢ, Kᵢ₊₁)).
// Pravá polovina jde do F spolu s rundovním klíčem, výstup F se XORuje s levou polovinou,
// pak se poloviny prohodí.
export function Feistel() {
  const W = 360
  const xL = 100
  const xR = 260
  const xF = 180
  const nodeW = 60
  const nodeH = 28

  // y středů řad uzlů L/R: vstup, po 1. a po 2. rundě
  const rows = [26, 178, 330]
  const H = 376

  const round = (i: number) => {
    const yTop = rows[i] + nodeH / 2 // spodní hrana uzlů
    const yF = rows[i] + 64 // řada F a ⊕
    const yC1 = yF + 26 // začátek prohození
    const yC2 = rows[i + 1] - nodeH / 2 - 18 // konec prohození
    const yNext = rows[i + 1] - nodeH / 2 // horní hrana dalších uzlů
    const sub = String(i + 1)
    return (
      <g key={i}>
        <T x={8} y={yF} k="h" a="start">
          {`runda ${i + 1}`}
        </T>
        {/* levá polovina → ⊕ → (prohození) → R_{i+1} */}
        <Wire pts={[[xL, yTop], [xL, yF - XOR_R]]} />
        <Wire pts={[[xL, yF + XOR_R], [xL, yC1], [xR, yC2], [xR, yNext]]} />
        {/* pravá polovina → (prohození) → L_{i+1}, odbočka do F */}
        <Wire pts={[[xR, yTop], [xR, yC1], [xL, yC2], [xL, yNext]]} />
        <Dot x={xR} y={yF} />
        <Wire pts={[[xR, yF], [xF + 22, yF]]} />
        <Wire pts={[[xF - 22, yF], [xL + XOR_R, yF]]} />
        {/* rundovní klíč */}
        <T x={xF} y={yF - 38} k="m">
          <Ix b="K" s={String(i + 1)} role="key" />
        </T>
        <Wire pts={[[xF, yF - 28], [xF, yF - 13]]} role="key" />
        <Op x={xF} y={yF} w={44} h={26} label="F" />
        <Xor x={xL} y={yF} />
        <Box x={xL} y={rows[i + 1]} w={nodeW} h={nodeH} role="data" mono label={<Ix b="L" s={sub} />} />
        <Box x={xR} y={rows[i + 1]} w={nodeW} h={nodeH} role="data" mono label={<Ix b="R" s={sub} />} />
      </g>
    )
  }

  return (
    <Dg
      w={W}
      h={H}
      minW={300}
      title="Feistelova síť, dvě rundy: pravá polovina vstupuje s rundovním klíčem do funkce F, výstup F se XORuje s levou polovinou a poloviny se prohodí."
    >
      <Box x={xL} y={rows[0]} w={nodeW} h={nodeH} role="data" mono label={<Ix b="L" s="0" />} />
      <Box x={xR} y={rows[0]} w={nodeW} h={nodeH} role="data" mono label={<Ix b="R" s="0" />} />
      {round(0)}
      {round(1)}
      <T x={(xL + xR) / 2} y={H - 12} k="s" muted>
        … a stejně dál až do poslední rundy
      </T>
    </Dg>
  )
}
