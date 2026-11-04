import type { ReactNode } from 'react'
import { Actor, Dg, Ix, Msg } from './dg'

// Výměna veřejných klíčů přes Autoritu (7 zpráv). Kroky 1–2 a 4–5 získají VK protějšku podepsané
// klíčem SK_Aut, kroky 3, 6, 7 jsou vzájemná autentizace nonci N₁, N₂.
export function PubkeyAuthority() {
  const [A, Aut, B] = [70, 330, 590]
  const W = 660
  const H = 400
  const bottom = H - 8

  // E s klíčem v indexu: E_{SK_Aut}(…), E_{VK_B}(…)
  const enc = (key: ReactNode, body: ReactNode) => (
    <>
      E
      <tspan dy={4} fontSize={11}>
        {key}
      </tspan>
      <tspan dy={-4}>(</tspan>
      {body})
    </>
  )
  const skAut = (
    <tspan className="dg-k">
      SK
      <tspan dy={3}>Aut</tspan>
      <tspan dy={-3}>{'​'}</tspan>
    </tspan>
  )
  const vk = (who: string) => <Ix b="VK" s={who} role="key" />
  const vkSub = (who: string) => (
    <tspan className="dg-k">
      VK
      <tspan dy={3}>{who}</tspan>
      <tspan dy={-3}>{'​'}</tspan>
    </tspan>
  )
  const T = (i: string) => <Ix b="T" s={i} />
  const N = (i: string) => <Ix b="N" s={i} />

  return (
    <Dg
      w={W}
      h={H}
      title="Výměna veřejných klíčů přes Autoritu: A a B si od Autority vyžádají podepsaný veřejný klíč protějšku a pak se vzájemně autentizují nonci N1 a N2."
    >
      <Actor x={A} w={64} bottom={bottom} label="A" />
      <Actor x={Aut} w={112} bottom={bottom} label="Autorita" role="auth" />
      <Actor x={B} w={64} bottom={bottom} label="B" />

      <Msg mono n={1} x1={A} x2={Aut} y={84} label={<>Req. ‖ {T('1')}</>} />
      <Msg mono n={2} x1={Aut} x2={A} y={130} label={enc(skAut, <>{vk('B')} ‖ Req. ‖ {T('1')}</>)} />
      <Msg mono n={3} x1={A} x2={B} y={180} at={(A + Aut) / 2} label={enc(vkSub('B'), <>ID<tspan dy={4} fontSize={11}>A</tspan><tspan dy={-4}> ‖ </tspan>{N('1')}</>)} />
      <Msg mono n={4} x1={B} x2={Aut} y={230} label={<>Req. ‖ {T('2')}</>} />
      <Msg mono n={5} x1={Aut} x2={B} y={276} label={enc(skAut, <>{vk('A')} ‖ Req. ‖ {T('2')}</>)} />
      <Msg mono n={6} x1={B} x2={A} y={326} at={(Aut + B) / 2} label={enc(vkSub('A'), <>{N('1')} ‖ {N('2')}</>)} />
      <Msg mono n={7} x1={A} x2={B} y={372} at={(A + Aut) / 2} label={enc(vkSub('B'), N('2'))} />
    </Dg>
  )
}
