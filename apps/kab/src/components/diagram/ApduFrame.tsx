import { Box, Dg, T, Wire } from './dg'

// Struktura APDU (ISO 7816-4). Command APDU = povinná hlavička CLA INS P1 P2 + volitelné tělo Lc Data Le.
// Response APDU = volitelné tělo (data) + povinné zápatí SW1 SW2. Volitelné části jsou čárkované.
type Field = { name: string; w: number; note: string; size: string; data?: boolean; opt?: boolean }

export function ApduFrame() {
  const W = 520
  const H = 270
  const x0 = 8
  const gap = 4
  const u = 60 // 1bajtové pole
  const dW = 116 // datové pole
  const cellH = 34

  const cmd: Field[] = [
    { name: 'CLA', w: u, note: 'třída', size: '1 B' },
    { name: 'INS', w: u, note: 'instrukce', size: '1 B' },
    { name: 'P1', w: u, note: 'parametr', size: '1 B' },
    { name: 'P2', w: u, note: 'parametr', size: '1 B' },
    { name: 'Lc', w: u, note: 'délka dat', size: '1 B', opt: true },
    { name: 'Data', w: dW, note: 'data příkazu', size: 'Lc B', data: true, opt: true },
    { name: 'Le', w: u, note: 'oček. délka', size: '1 B', opt: true },
  ]
  const rsp: Field[] = [
    { name: 'Data', w: dW, note: 'data odpovědi', size: '≤ Le B', data: true, opt: true },
    { name: 'SW1', w: u, note: 'stav', size: '1 B' },
    { name: 'SW2', w: u, note: 'stav', size: '1 B' },
  ]

  const xs = (fs: Field[]) => {
    const out: number[] = []
    let c = x0
    for (const f of fs) {
      out.push(c)
      c += f.w + gap
    }
    return out
  }

  const bracket = (x1: number, x2: number, y: number, label: string) => (
    <g>
      <Wire pts={[[x1, y + 6], [x1, y], [x2, y], [x2, y + 6]]} arrow="none" faint />
      <T x={(x1 + x2) / 2} y={y - 10} k="s">
        {label}
      </T>
    </g>
  )

  const row = (fs: Field[], yTitle: string, y: number, groups: [number, number, string][]) => {
    const x = xs(fs)
    return (
      <g>
        <T x={x0} y={y - 60} k="h" a="start">
          {yTitle}
        </T>
        {groups.map(([a, b, l]) => (
          <g key={l}>{bracket(x[a], x[b] + fs[b].w, y - cellH / 2 - 12, l)}</g>
        ))}
        {fs.map((f, i) => (
          <g key={f.name}>
            <Box
              x={x[i] + f.w / 2}
              y={y}
              w={f.w}
              h={cellH}
              mono
              role={f.data ? 'data' : 'plain'}
              dashed={f.opt}
              label={f.name}
            />
            <T x={x[i] + f.w / 2} y={y + cellH / 2 + 14} k="s">
              {f.note}
            </T>
            <T x={x[i] + f.w / 2} y={y + cellH / 2 + 30} k="sm" muted>
              {f.size}
            </T>
          </g>
        ))}
      </g>
    )
  }

  const xr = xs(rsp)
  return (
    <Dg
      w={W}
      h={H}
      title="Struktura APDU: command APDU má povinnou hlavičku CLA, INS, P1, P2 a volitelné tělo Lc, Data, Le; response APDU má volitelná data a povinné stavové slovo SW1 SW2."
    >
      {row(cmd, 'Command APDU', 76, [
        [0, 3, 'hlavička (povinná)'],
        [4, 6, 'tělo (volitelné)'],
      ])}
      {row(rsp, 'Response APDU', 206, [
        [0, 0, 'tělo (volitelné)'],
        [1, 2, 'zápatí (povinné)'],
      ])}
      <T x={xr[2] + u + 16} y={206} k="s" a="start" muted>
        např. 90 00 = úspěch
      </T>
    </Dg>
  )
}
