import { Box, Dg, Ix, Op, T, Wire, Xor, XOR_R } from './dg'

// Rundovní funkce DES f(R, Kᵢ):
// R (32 b) → expanze E (48 b) → ⊕ rundovní klíč Kᵢ (48 b) → 8 S-boxů (6 b → 4 b) → permutace P → 32 b.
export function DESRound() {
  const W = 360
  const H = 372
  const cx = 170

  const yIn = 22
  const yE = 80
  const yX = 138
  const yBusIn = 176
  const yS = 204
  const sH = 28
  const yBusOut = 236
  const yP = 276
  const yOut = 342

  const sW = 30
  const sGap = 6
  const sCount = 8
  const sBlock = sCount * sW + (sCount - 1) * sGap
  const sX = (i: number) => cx - sBlock / 2 + sW / 2 + i * (sW + sGap)

  const width = (y: number, t: string) => (
    <T x={cx + 8} y={y} k="sm" a="start" halo>
      {t}
    </T>
  )

  return (
    <Dg
      w={W}
      h={H}
      minW={300}
      title="Rundovní funkce DES: expanze E z 32 na 48 bitů, XOR s rundovním klíčem, osm S-boxů zpět na 32 bitů, permutace P."
    >
      <Box x={cx} y={yIn} w={56} h={28} role="data" mono label="R" />
      <Wire pts={[[cx, yIn + 14], [cx, yE - 15]]} />
      {width((yIn + 14 + yE - 15) / 2, '32 b')}

      <Op x={cx} y={yE} w={120} h={30} label="E" />
      <T x={cx + 70} y={yE} k="s" a="start">
        expanze
      </T>
      <Wire pts={[[cx, yE + 15], [cx, yX - XOR_R]]} />
      {width((yE + 15 + yX - XOR_R) / 2, '48 b')}

      <Xor x={cx} y={yX} />
      <Box x={310} y={yX} w={52} h={28} role="key" mono label={<Ix b="K" s="i" />} />
      <Wire pts={[[284, yX], [cx + XOR_R, yX]]} role="key" />
      <T x={(284 + cx + XOR_R) / 2} y={yX - 10} k="sm" muted>
        48 b
      </T>

      {/* 48 b se rozdělí po 6 b do osmi S-boxů */}
      <Wire pts={[[cx, yX + XOR_R], [cx, yBusIn]]} arrow="none" />
      <Wire pts={[[sX(0), yBusIn], [sX(7), yBusIn]]} arrow="none" />
      {Array.from({ length: sCount }, (_, i) => (
        <g key={i}>
          <Wire pts={[[sX(i), yBusIn], [sX(i), yS - sH / 2]]} />
          <Op x={sX(i)} y={yS} w={sW} h={sH} label={<Ix b="S" s={String(i + 1)} />} />
          <Wire pts={[[sX(i), yS + sH / 2], [sX(i), yBusOut]]} arrow="none" />
        </g>
      ))}
      <T x={sX(0) - 8} y={yBusIn + 7} k="sm" a="end" muted>
        6 b
      </T>
      <T x={sX(0) - 8} y={yBusOut - 6} k="sm" a="end" muted>
        4 b
      </T>
      <T x={sX(7) + 20} y={yS} k="s" a="start">
        S-boxy
      </T>
      <Wire pts={[[sX(0), yBusOut], [sX(7), yBusOut]]} arrow="none" />
      <Wire pts={[[cx, yBusOut], [cx, yP - 15]]} />
      {width((yBusOut + yP - 15) / 2, '32 b')}

      <Op x={cx} y={yP} w={120} h={30} label="P" />
      <T x={cx + 70} y={yP} k="s" a="start">
        permutace
      </T>
      <Wire pts={[[cx, yP + 15], [cx, yOut - 14]]} />
      {width((yP + 15 + yOut - 14) / 2, '32 b')}

      <Box x={cx} y={yOut} w={104} h={28} role="data" mono label={<>f(R, <Ix b="K" s="i" role="key" />)</>} />
    </Dg>
  )
}
