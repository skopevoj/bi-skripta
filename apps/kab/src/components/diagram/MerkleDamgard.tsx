import type { ReactNode } from 'react'
import { Box, Dg, Ix, Op, T, Wire } from './dg'

// Damgård–Merklova konstrukce: H₀ = IV, Hᵢ = f(Hᵢ₋₁, Mᵢ), výsledek h(M) = Hₙ.
// Kontext se řetězí zleva doprava, bloky zprávy vstupují do kompresní funkce shora.
export function MerkleDamgard() {
  const W = 580
  const H = 160
  const yC = 116 // osa řetězu
  const yM = 46 // řada bloků zprávy
  const fW = 44
  const fH = 36

  const xIV = 38
  const fs = [
    { x: 140, m: <Ix b="M" s="1" /> },
    { x: 240, m: <Ix b="M" s="2" /> },
    { x: 410, m: <Ix b="M" s="n" /> },
  ]
  const xDots = 325
  const xOut = 528

  const seg = (x1: number, x2: number, label: ReactNode, arrow = true) => (
    <g>
      <Wire pts={[[x1, yC], [x2, yC]]} arrow={arrow ? 'end' : 'none'} />
      <T x={(x1 + x2) / 2} y={yC - 12} k="sm" halo>
        {label}
      </T>
    </g>
  )

  return (
    <Dg
      w={W}
      h={H}
      title="Damgårdova–Merklova konstrukce: kontext H se řetězí od IV přes kompresní funkce f, do každé vstupuje jeden blok zprávy, poslední kontext je haš h(M)."
    >
      <T x={(fs[0].x + fs[2].x) / 2} y={12} k="h">
        bloky zprávy (po zarovnání)
      </T>

      <Box x={xIV} y={yC} w={52} h={28} role="param" mono label="IV" />
      {seg(xIV + 26, fs[0].x - fW / 2, <Ix b="H" s="0" />)}
      {seg(fs[0].x + fW / 2, fs[1].x - fW / 2, <Ix b="H" s="1" />)}
      {seg(fs[1].x + fW / 2, xDots - 16, <Ix b="H" s="2" />, false)}
      <T x={xDots} y={yC} k="m" muted>
        …
      </T>
      {seg(xDots + 16, fs[2].x - fW / 2, <Ix b="H" s="n−1" />)}
      {seg(fs[2].x + fW / 2, xOut - 32, <Ix b="H" s="n" />)}

      {fs.map((f, i) => (
        <g key={i}>
          <Box x={f.x} y={yM} w={52} h={28} role="data" mono label={f.m} />
          <Wire pts={[[f.x, yM + 14], [f.x, yC - fH / 2]]} />
          <Op x={f.x} y={yC} w={fW} h={fH} label="f" />
        </g>
      ))}
      <T x={xDots} y={yM} k="m" muted>
        …
      </T>

      <Box x={xOut} y={yC} w={64} h={28} role="data" mono label="h(M)" />

      <T x={xIV} y={yC + 30} k="s" muted>
        <Ix b="H" s="0" /> = IV
      </T>
      <T x={fs[2].x} y={yC + 30} k="s" muted>
        poslední blok: doplnění + délka
      </T>
      <T x={xOut} y={yC + 30} k="s" muted>
        haš = <Ix b="H" s="n" />
      </T>
    </Dg>
  )
}
