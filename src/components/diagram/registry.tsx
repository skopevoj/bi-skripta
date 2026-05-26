import { lazy, Suspense } from 'react'
import type { DiagramName } from '../../types'

const components: Record<DiagramName, ReturnType<typeof lazy>> = {
  feistel: lazy(() => import('./Feistel').then((m) => ({ default: m.Feistel }))),
  'des-round': lazy(() =>
    import('./DESRound').then((m) => ({ default: m.DESRound })),
  ),
  'merkle-damgard': lazy(() =>
    import('./MerkleDamgard').then((m) => ({ default: m.MerkleDamgard })),
  ),
  'stream-sync': lazy(() =>
    import('./StreamSync').then((m) => ({ default: m.StreamSync })),
  ),
  'salsa-chacha-flow': lazy(() =>
    import('./SalsaChaChaFlow').then((m) => ({ default: m.SalsaChaChaFlow })),
  ),
  'apdu-frame': lazy(() =>
    import('./ApduFrame').then((m) => ({ default: m.ApduFrame })),
  ),
  'smartcard-arch': lazy(() =>
    import('./SmartcardArch').then((m) => ({ default: m.SmartcardArch })),
  ),
  'fido2-register': lazy(() =>
    import('./Fido2Register').then((m) => ({ default: m.Fido2Register })),
  ),
  'fido2-auth': lazy(() =>
    import('./Fido2Auth').then((m) => ({ default: m.Fido2Auth })),
  ),
  'cert-tree': lazy(() =>
    import('./CertTree').then((m) => ({ default: m.CertTree })),
  ),
  'pubkey-authority': lazy(() =>
    import('./PubkeyAuthority').then((m) => ({ default: m.PubkeyAuthority })),
  ),
  'qubit-bases': lazy(() =>
    import('./QubitBases').then((m) => ({ default: m.QubitBases })),
  ),
}

export function DiagramComponent({ name }: { name: DiagramName }) {
  const Component = components[name]
  if (!Component) {
    return (
      <div className="text-ink-500 font-mono text-sm">
        Unknown diagram: {name}
      </div>
    )
  }
  return (
    <Suspense
      fallback={<div className="text-ink-500 font-mono text-sm">Načítám…</div>}
    >
      <Component />
    </Suspense>
  )
}
