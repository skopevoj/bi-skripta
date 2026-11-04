import { Actor, Dg, Kw, Msg, SelfAct } from './dg'

// FIDO2 / WebAuthn registrace. Uživatel nejdřív potvrdí přítomnost, pak authenticator vygeneruje
// pár klíčů pro danou RP, soukromý klíč SK si ponechá a vrátí attestation + VK + credential ID.
export function Fido2Register() {
  const [user, auth, client, rp] = [54, 196, 430, 660]
  const W = 720
  const H = 420
  const bottom = H - 8
  return (
    <Dg
      w={W}
      h={H}
      title="FIDO2 registrace: RP pošle challenge, klient předá požadavek authenticatoru, uživatel potvrdí přítomnost, authenticator vygeneruje pár klíčů pro RP a vrátí attestation, veřejný klíč a credential ID, které RP uloží."
    >
      <Actor x={user} w={92} bottom={bottom} label="uživatel" />
      <Actor x={auth} w={132} bottom={bottom} label="authenticator" />
      <Actor x={client} w={156} bottom={bottom} label="klient (prohlížeč)" />
      <Actor x={rp} w={112} bottom={bottom} label="Relying Party" />

      <Msg n={1} x1={rp} x2={client} y={84} label="challenge, RP ID, parametry" />
      <Msg n={2} x1={client} x2={auth} y={134} label="makeCredential (CTAP2)" note="challenge, RP ID" />
      <Msg n={3} x1={auth} x2={user} y={184} label="výzva k potvrzení" />
      <Msg n={4} x1={user} x2={auth} y={222} label="dotek / PIN" />
      <SelfAct
        x={auth}
        y1={244}
        y2={296}
        n={5}
        lines={[
          <>
            nový pár (<Kw>SK</Kw>, <Kw>VK</Kw>) pro RP
          </>,
          <>
            <Kw>SK</Kw> zůstává v zařízení
          </>,
        ]}
      />
      <Msg
        n={6}
        x1={auth}
        x2={client}
        y={334}
        label={
          <>
            attestation, <Kw>VK</Kw>, credential ID
          </>
        }
      />
      <Msg
        n={7}
        x1={client}
        x2={rp}
        y={384}
        label={
          <>
            attestation, <Kw>VK</Kw>, credential ID
          </>
        }
        note={
          <>
            RP ověří attestation, uloží <Kw>VK</Kw>
          </>
        }
      />
    </Dg>
  )
}
