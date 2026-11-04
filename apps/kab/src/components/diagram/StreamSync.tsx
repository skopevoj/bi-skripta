import { Box, Dg, Dot, Ix, Kw, Op, T, Wire, Xor, XOR_R } from './dg'

// Šifrovací strana proudové šifry. (a) synchronní: heslo hᵢ závisí jen na klíči k.
// (b) samosynchronizující: hᵢ = f(k, cᵢ₋ₙ, …, cᵢ₋₁) — posledních n znaků ŠT se vrací do generátoru.
export function StreamSync() {
  const W = 600
  const H = 218
  const PW = 300 // šířka panelu

  const yG = 100 // osa generátoru a ⊕
  const yM = 46 // otevřený text nad ⊕

  const panel = (ox: number, feedback: boolean) => {
    const xK = ox + 26
    const xG = ox + 112
    const gW = 96
    const xX = ox + 222
    const xC = ox + 276
    const xTap = ox + 244
    const yReg = 168
    return (
      <g>
        <T x={ox + 8} y={14} k="tb" a="start">
          {feedback ? '(b) Samosynchronizující' : '(a) Synchronní'}
        </T>

        <Box x={xK} y={yG} w={36} h={28} role="key" mono label="k" />
        <Wire pts={[[xK + 18, yG], [xG - gW / 2, yG]]} role="key" />

        <Op x={xG} y={yG} w={gW} h={44} label="generátor" sub="hesla" sans />
        <Wire pts={[[xG + gW / 2, yG], [xX - XOR_R, yG]]} role="key" />
        <T x={(xG + gW / 2 + xX - XOR_R) / 2} y={yG - 12} k="m">
          <Ix b="h" s="i" role="key" />
        </T>

        <Box x={xX} y={yM} w={40} h={28} role="data" mono label={<Ix b="m" s="i" />} />
        <Wire pts={[[xX, yM + 14], [xX, yG - XOR_R]]} />
        <Xor x={xX} y={yG} />
        <Wire pts={[[xX + XOR_R, yG], [xC - 18, yG]]} />
        <Box x={xC} y={yG} w={36} h={28} role="data" mono label={<Ix b="c" s="i" />} />

        {feedback ? (
          <g>
            <Dot x={xTap} y={yG} />
            <Wire pts={[[xTap, yG], [xTap, yReg], [xG + 58, yReg]]} />
            <Box x={xG} y={yReg} w={116} h={28} label="posuvný registr" />
            <Wire pts={[[xG, yReg - 14], [xG, yG + 22]]} />
            <T x={xG + 8} y={(yReg - 14 + yG + 22) / 2} k="sm" a="start" halo>
              <Ix b="c" s="i−n" /> … <Ix b="c" s="i−1" />
            </T>
            <T x={ox + PW / 2} y={H - 14} k="sm" muted>
              <Ix b="h" s="i" /> = f(<Kw>k</Kw>, <Ix b="c" s="i−n" />, …, <Ix b="c" s="i−1" />)
            </T>
          </g>
        ) : (
          <T x={xG + 30} y={yReg} k="s" muted>
            heslo nezávisí na OT ani ŠT
          </T>
        )}
      </g>
    )
  }

  return (
    <Dg
      w={W}
      h={H}
      title="Šifrovací strana proudové šifry: vlevo synchronní, kde generátor hesla závisí jen na klíči; vpravo samosynchronizující, kde se posledních n znaků šifrového textu vrací přes posuvný registr do generátoru."
    >
      {panel(0, false)}
      <line className="dg-life" x1={PW - 4} y1={8} x2={PW - 4} y2={H - 8} />
      {panel(PW, true)}
    </Dg>
  )
}
