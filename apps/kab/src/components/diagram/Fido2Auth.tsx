import { Actor, Dg, Kw, Msg, SelfAct } from './dg'

// FIDO2 / WebAuthn autentizace (assertion). Stejné rozložení jako registrace: RP pošle challenge
// a seznam credential ID, uživatel potvrdí, authenticator podepíše challenge + sign counter klíčem SK,
// RP ověří podpis klíčem VK z registrace.
export function Fido2Auth() {
  const [user, auth, client, rp] = [54, 196, 430, 660]
  const W = 720
  const H = 420
  const bottom = H - 8
  return (
    <Dg
      w={W}
      h={H}
      title="FIDO2 autentizace: RP pošle challenge a seznam credential ID, klient předá požadavek authenticatoru, uživatel potvrdí, authenticator podepíše challenge a sign counter soukromým klíčem a RP podpis ověří veřejným klíčem z registrace."
    >
      <Actor x={user} w={92} bottom={bottom} label="uživatel" />
      <Actor x={auth} w={132} bottom={bottom} label="authenticator" />
      <Actor x={client} w={156} bottom={bottom} label="klient (prohlížeč)" />
      <Actor x={rp} w={112} bottom={bottom} label="Relying Party" />

      <Msg n={1} x1={rp} x2={client} y={84} label="challenge, seznam credential ID" />
      <Msg n={2} x1={client} x2={auth} y={134} label="getAssertion (CTAP2)" note="challenge, RP ID, credential ID" />
      <Msg n={3} x1={auth} x2={user} y={184} label="výzva k potvrzení" />
      <Msg n={4} x1={user} x2={auth} y={222} label="dotek / PIN" />
      <SelfAct
        x={auth}
        y1={244}
        y2={302}
        n={5}
        lines={[
          <>najde credential pro RP</>,
          <>podepíše challenge + counter</>,
          <>
            soukromým klíčem <Kw>SK</Kw>
          </>,
        ]}
      />
      <Msg n={6} x1={auth} x2={client} y={334} label="podpis, authenticatorData" note="vč. sign counteru" />
      <Msg
        n={7}
        x1={client}
        x2={rp}
        y={384}
        label="podpis, authenticatorData"
        note={
          <>
            RP ověří podpis pomocí <Kw>VK</Kw>, zkontroluje counter
          </>
        }
      />
    </Dg>
  )
}
