import { lazy, Suspense } from 'react'
import type { InteractiveName } from '../../types'

const components: Record<InteractiveName, ReturnType<typeof lazy>> = {
  caesar: lazy(() => import('./Caesar').then((m) => ({ default: m.Caesar }))),
  affine: lazy(() => import('./Affine').then((m) => ({ default: m.Affine }))),
  hill: lazy(() => import('./Hill').then((m) => ({ default: m.Hill }))),
  vigenere: lazy(() =>
    import('./Vigenere').then((m) => ({ default: m.Vigenere })),
  ),
  frequency: lazy(() =>
    import('./Frequency').then((m) => ({ default: m.Frequency })),
  ),
  'diffie-hellman': lazy(() =>
    import('./DiffieHellman').then((m) => ({ default: m.DiffieHellman })),
  ),
  'square-multiply': lazy(() =>
    import('./SquareMultiply').then((m) => ({ default: m.SquareMultiply })),
  ),
  'ecb-vs-cbc': lazy(() =>
    import('./ECBvsCBC').then((m) => ({ default: m.ECBvsCBC })),
  ),
  avalanche: lazy(() =>
    import('./Avalanche').then((m) => ({ default: m.Avalanche })),
  ),
  birthday: lazy(() =>
    import('./Birthday').then((m) => ({ default: m.Birthday })),
  ),
  rsa: lazy(() => import('./RSA').then((m) => ({ default: m.RSA }))),
  'ec-add': lazy(() => import('./ECAdd').then((m) => ({ default: m.ECAdd }))),
  bb84: lazy(() => import('./BB84').then((m) => ({ default: m.BB84 }))),
}

export function InteractiveWidget({ name }: { name: InteractiveName }) {
  const Component = components[name]
  if (!Component) {
    return (
      <div className="text-ink-500 font-mono text-sm">
        Unknown interactive: {name}
      </div>
    )
  }
  return (
    <Suspense
      fallback={
        <div className="text-ink-500 font-mono text-sm">Načítám…</div>
      }
    >
      <Component />
    </Suspense>
  )
}
