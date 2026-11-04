import { Box, Dg, Ix, T, Wire } from './dg'

// Dvě hierarchie CA spojené obousměrnou křížovou certifikací. Šipka = nadřízená CA vydává (podepisuje)
// certifikát podřízeného. Uživatelé A, B patří pod CA₁, uživatelé C, D pod CA₂ (jako v příkladu 11.2).
export function CertTree() {
  const W = 640
  const H = 296
  const yRoot = 54
  const ySub = 150
  const yUser = 232
  const rootW = 128
  const rootH = 44
  const subW = 108
  const userW = 104
  const nodeH = 32
  const yElbow = 108

  const trees = [
    { cx: 160, root: '1', users: ['A', 'B'] },
    { cx: 480, root: '2', users: ['C', 'D'] },
  ]

  return (
    <Dg
      w={W}
      h={H}
      title="Dvě hierarchie certifikačních autorit spojené obousměrnou křížovou certifikací: kořenová CA vydává certifikáty podřízeným CA a ty uživatelům."
    >
      {trees.map((t) => {
        const subs = [t.cx - 80, t.cx + 80]
        return (
          <g key={t.root}>
            {subs.map((sx, i) => (
              <g key={sx}>
                <Wire pts={[[t.cx, yRoot + rootH / 2], [t.cx, yElbow], [sx, yElbow], [sx, ySub - nodeH / 2]]} />
                <Wire pts={[[sx, ySub + nodeH / 2], [sx, yUser - nodeH / 2]]} />
                <Box
                  x={sx}
                  y={ySub}
                  w={subW}
                  h={nodeH}
                  role="auth"
                  label={`sub-CA ${t.root}.${i + 1}`}
                />
                <Box x={sx} y={yUser} w={userW} h={nodeH} label={`uživatel ${t.users[i]}`} />
              </g>
            ))}
            <Box
              x={t.cx}
              y={yRoot}
              w={rootW}
              h={rootH}
              role="auth"
              label={<Ix b="CA" s={t.root} />}
              sub="kořen, self-signed"
            />
          </g>
        )
      })}

      {/* křížová certifikace mezi kořeny */}
      <Wire pts={[[160 + rootW / 2 + 1, yRoot], [480 - rootW / 2 - 1, yRoot]]} arrow="both" dashed />
      <T x={320} y={yRoot - 12} k="s">
        křížová certifikace
      </T>
      <T x={320} y={yRoot + 12} k="s" muted>
        podpis VK oběma směry
      </T>

      <T x={W / 2} y={H - 12} k="s" muted>
        šipka = nadřízená CA podepisuje certifikát podřízeného
      </T>
    </Dg>
  )
}
