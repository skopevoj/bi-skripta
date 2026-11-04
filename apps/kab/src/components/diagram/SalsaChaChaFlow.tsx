import { Box, Dg, Ix, Op, T, Wire, Xor, XOR_R } from './dg'

// Salsa20 / ChaCha jako synchronní proudová šifra. Stav 4×4 slov (512 b) = konstanta + klíč + nonce
// + čítač bloku; po 20 rundách ARX a přičtení vstupu vznikne blok hesla hᵢ, který se XORuje s OT.
export function SalsaChaChaFlow() {
  const W = 600
  const H = 216

  const xIn = 66
  const inW = 112
  const ins = [
    { y: 36, label: 'konstanta', bits: '128 b', role: 'plain' as const },
    { y: 78, label: <>klíč k</>, bits: '256 b', role: 'key' as const },
    { y: 120, label: 'nonce', bits: '64 b', role: 'param' as const },
    { y: 162, label: <>čítač i</>, bits: '64 b', role: 'param' as const },
  ]

  const xG = 270
  const gW = 132
  const yG = 99
  const gH = 160

  const xX = 478
  const xC = 562
  const yM = 36

  return (
    <Dg
      w={W}
      h={H}
      title="Salsa20 a ChaCha: konstanta, klíč, nonce a čítač bloku tvoří stav 4×4 slov; po 20 rundách ARX vznikne blok hesla, který se XORuje s otevřeným textem na šifrový text."
    >
      {ins.map((i) => (
        <g key={i.bits + i.y}>
          <Box x={xIn} y={i.y} w={inW} h={30} role={i.role} label={i.label} />
          <Wire pts={[[xIn + inW / 2, i.y], [xG - gW / 2, i.y]]} role={i.role === 'key' ? 'key' : undefined} />
          <T x={(xIn + inW / 2 + xG - gW / 2) / 2} y={i.y - 10} k="sm" muted>
            {i.bits}
          </T>
        </g>
      ))}

      <Op x={xG} y={yG} w={gW} h={gH} label="" />
      <T x={xG} y={yG - 26} k="tb">
        Salsa20 / ChaCha
      </T>
      <T x={xG} y={yG + 2} k="s">
        stav 4×4 slova po 32 b
      </T>
      <T x={xG} y={yG + 20} k="s">
        20 rund ARX
      </T>
      <T x={xG} y={yG + 38} k="s">
        + přičtení vstupu
      </T>

      <Wire pts={[[xG + gW / 2, yG], [xX - XOR_R, yG]]} role="key" />
      <T x={(xG + gW / 2 + xX - XOR_R) / 2} y={yG - 12} k="t">
        blok hesla <tspan className="dg-m dg-k">h</tspan>
        <tspan className="dg-m dg-k" dy={4} fontSize={11}>
          i
        </tspan>
      </T>
      <T x={(xG + gW / 2 + xX - XOR_R) / 2} y={yG + 12} k="sm" muted>
        512 b
      </T>

      <Box x={xX} y={yM} w={44} h={30} role="data" mono label={<Ix b="m" s="i" />} />
      <T x={xX} y={yM - 24} k="s" muted>
        OT
      </T>
      <Wire pts={[[xX, yM + 15], [xX, yG - XOR_R]]} />
      <Xor x={xX} y={yG} />
      <Wire pts={[[xX + XOR_R, yG], [xC - 22, yG]]} />
      <Box x={xC} y={yG} w={44} h={30} role="data" mono label={<Ix b="c" s="i" />} />
      <T x={xC} y={yG - 27} k="s" muted>
        ŠT
      </T>

      <T x={(xX + xC) / 2} y={yG + 44} k="sm">
        <Ix b="c" s="i" /> = <Ix b="m" s="i" /> ⊕ <Ix b="h" s="i" role="key" />
      </T>
      <T x={(xX + xC) / 2} y={yG + 64} k="s" muted>
        dešifrování je týž XOR
      </T>
    </Dg>
  )
}
