import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Suggested small primes; keeps live computation legible.
const SMALL_PRIMES = [7, 11, 13, 17, 19, 23, 29, 31]

function isPrime(n: number): boolean {
  if (n < 2) return false
  if (n < 4) return true
  if (n % 2 === 0) return false
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false
  }
  return true
}

function modPow(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0
  let result = 1
  let b = base % mod
  let e = exp
  while (e > 0) {
    if (e & 1) result = (result * b) % mod
    e >>= 1
    b = (b * b) % mod
  }
  return result
}

// Stages of the protocol; cursor 0..5 means how many of them are "revealed".
const STAGES = [
  { n: 1, label: 'Veřejné parametry (m, g)' },
  { n: 2, label: 'Soukromé klíče (a, b)' },
  { n: 3, label: 'Veřejné klíče (A = gᵃ, B = gᵇ)' },
  { n: 4, label: 'Výměna přes kanál' },
  { n: 5, label: 'Sdílené tajemství' },
] as const

export function DiffieHellman() {
  const [m, setM] = useState(23)
  const [g, setG] = useState(5)
  const [a, setA] = useState(6)
  const [b, setB] = useState(15)
  const [stage, setStage] = useState<number>(5)

  const validM = isPrime(m) && m >= 5 && m <= 9973
  // Clamp keys against the prime: private key in [1, m-2].
  const maxKey = Math.max(1, m - 2)
  const aClamped = Math.min(Math.max(1, a), maxKey)
  const bClamped = Math.min(Math.max(1, b), maxKey)
  const gClamped = ((g % m) + m) % m

  const A = useMemo(
    () => (validM ? modPow(gClamped, aClamped, m) : 0),
    [validM, gClamped, aClamped, m],
  )
  const B = useMemo(
    () => (validM ? modPow(gClamped, bClamped, m) : 0),
    [validM, gClamped, bClamped, m],
  )
  const Ka = useMemo(
    () => (validM ? modPow(B, aClamped, m) : 0),
    [validM, B, aClamped, m],
  )
  const Kb = useMemo(
    () => (validM ? modPow(A, bClamped, m) : 0),
    [validM, B, bClamped, m, A],
  )

  // Visibility per element by stage cursor.
  const showPublic = stage >= 1
  const showPrivate = stage >= 2
  const showPubKeys = stage >= 3
  const showChannel = stage >= 4
  const showSecret = stage >= 5

  return (
    <div className="space-y-4">
      {/* Stage stepper */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STAGES.map((s) => {
          const isCurrent = s.n === stage
          const isDone = s.n <= stage
          return (
            <button
              key={s.n}
              type="button"
              onClick={() => setStage(s.n)}
              className={
                'px-2 py-1 rounded border text-[11px] font-sans transition-colors ' +
                (isCurrent
                  ? 'bg-ink-200 text-ink-950 border-ink-200'
                  : isDone
                    ? 'bg-ink-900 text-ink-100 border-ink-700'
                    : 'bg-ink-900 text-ink-500 border-ink-800 hover:border-ink-700')
              }
            >
              <span className="font-mono mr-1">{s.n}.</span>
              {s.label}
            </button>
          )
        })}
        <div className="ml-auto flex gap-1.5">
          <button
            type="button"
            onClick={() => setStage((s) => Math.max(0, s - 1))}
            disabled={stage === 0}
            className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
          >
            ← Zpět
          </button>
          <button
            type="button"
            onClick={() => setStage((s) => Math.min(5, s + 1))}
            disabled={stage >= 5}
            className={ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'}
          >
            Další →
          </button>
        </div>
      </div>

      {/* Veřejné parametry */}
      <div
        className={
          ui.panel + ' transition-opacity ' + (showPublic ? 'opacity-100' : 'opacity-30')
        }
      >
        <div className={ui.rowLabel + ' mb-2'}>1. Veřejné parametry</div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={ui.label}>Modul m (prvočíslo)</span>
            <input
              type="number"
              min={5}
              max={9973}
              value={m}
              onChange={(e) => setM(Number(e.target.value) || 0)}
              className={ui.input}
            />
            <div className="mt-1.5 flex flex-wrap gap-1">
              {SMALL_PRIMES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setM(p)}
                  className={
                    'px-1.5 py-0.5 rounded border text-[11px] font-mono transition-colors ' +
                    (m === p
                      ? 'bg-ink-200 text-ink-950 border-ink-200'
                      : 'bg-ink-900 text-ink-300 border-ink-800 hover:border-ink-700')
                  }
                >
                  {p}
                </button>
              ))}
            </div>
            {!validM && (
              <div className="mt-1 text-[11px] font-sans text-ink-500">
                m musí být prvočíslo z rozsahu 5–9973.
              </div>
            )}
          </label>
          <label className="block">
            <span className={ui.label}>Generátor g</span>
            <input
              type="number"
              min={2}
              max={Math.max(2, m - 1)}
              value={g}
              onChange={(e) => setG(Number(e.target.value) || 0)}
              className={ui.input}
            />
            <div className={'mt-1.5 ' + ui.monoMuted}>g mod m = {gClamped}</div>
          </label>
        </div>
      </div>

      {/* Alice | Channel | Bob */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Alice */}
        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>Alice</div>
          <div
            className={
              'transition-opacity ' + (showPrivate ? 'opacity-100' : 'opacity-30')
            }
          >
            <label className="block mb-3">
              <span className={ui.label}>2. Soukromý klíč a (tajný)</span>
              <input
                type="range"
                min={1}
                max={maxKey}
                value={aClamped}
                onChange={(e) => setA(Number(e.target.value))}
                className={ui.slider}
              />
              <div className="flex items-baseline justify-between mt-1">
                <span className={ui.monoMuted}>1 ≤ a ≤ {maxKey}</span>
                <span className={ui.chip}>a = {aClamped}</span>
              </div>
            </label>
          </div>
          <div
            className={
              'transition-opacity ' + (showPubKeys ? 'opacity-100' : 'opacity-30')
            }
          >
            <div className={ui.label}>3. Veřejný klíč A</div>
            <div className={ui.mono}>
              A = g<sup>a</sup> mod m
            </div>
            <div className={ui.monoMuted}>
              = {gClamped}
              <sup>{aClamped}</sup> mod {m} ={' '}
              <span className="text-ink-100">{showPubKeys ? A : '…'}</span>
            </div>
          </div>
          <div
            className={
              'mt-2 transition-opacity ' + (showSecret ? 'opacity-100' : 'opacity-30')
            }
          >
            <div className={ui.label}>5. Sdílené tajemství</div>
            <div className={ui.mono}>
              K = B<sup>a</sup> mod m
            </div>
            <div className={ui.monoMuted}>
              = {showSecret ? B : '…'}
              <sup>{aClamped}</sup> mod {m} ={' '}
              <span className="text-ink-100 font-semibold">
                {showSecret ? Ka : '…'}
              </span>
            </div>
          </div>
        </div>

        {/* Channel */}
        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>Veřejný kanál</div>
          <div className="space-y-2 text-center">
            <div className={'transition-opacity ' + (showPublic ? 'opacity-100' : 'opacity-30')}>
              <div className={ui.label}>1. domluveno veřejně</div>
              <div className={ui.mono}>m = {m},  g = {gClamped}</div>
            </div>
            <div className={'transition-opacity ' + (showChannel ? 'opacity-100' : 'opacity-30')}>
              <div className={ui.label}>4. Alice → Bob</div>
              <div className={ui.mono}>A = {showPubKeys ? A : '…'}</div>
            </div>
            <div className={'transition-opacity ' + (showChannel ? 'opacity-100' : 'opacity-30')}>
              <div className={ui.label}>4. Bob → Alice</div>
              <div className={ui.mono}>B = {showPubKeys ? B : '…'}</div>
            </div>
            <div
              className={
                'pt-2 border-t border-ink-800 transition-opacity ' +
                (showSecret ? 'opacity-100' : 'opacity-30')
              }
            >
              <div className={ui.label}>5. shoda klíčů</div>
              {validM && Ka === Kb ? (
                <div className="font-mono text-[13px] text-ink-100">
                  K<sub>A</sub> = K<sub>B</sub> = {showSecret ? Ka : '…'} ✓
                </div>
              ) : (
                <div className="font-mono text-[13px] text-ink-400">
                  K<sub>A</sub> = {Ka}, K<sub>B</sub> = {Kb}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bob */}
        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>Bob</div>
          <div
            className={
              'transition-opacity ' + (showPrivate ? 'opacity-100' : 'opacity-30')
            }
          >
            <label className="block mb-3">
              <span className={ui.label}>2. Soukromý klíč b (tajný)</span>
              <input
                type="range"
                min={1}
                max={maxKey}
                value={bClamped}
                onChange={(e) => setB(Number(e.target.value))}
                className={ui.slider}
              />
              <div className="flex items-baseline justify-between mt-1">
                <span className={ui.monoMuted}>1 ≤ b ≤ {maxKey}</span>
                <span className={ui.chip}>b = {bClamped}</span>
              </div>
            </label>
          </div>
          <div
            className={
              'transition-opacity ' + (showPubKeys ? 'opacity-100' : 'opacity-30')
            }
          >
            <div className={ui.label}>3. Veřejný klíč B</div>
            <div className={ui.mono}>
              B = g<sup>b</sup> mod m
            </div>
            <div className={ui.monoMuted}>
              = {gClamped}
              <sup>{bClamped}</sup> mod {m} ={' '}
              <span className="text-ink-100">{showPubKeys ? B : '…'}</span>
            </div>
          </div>
          <div
            className={
              'mt-2 transition-opacity ' + (showSecret ? 'opacity-100' : 'opacity-30')
            }
          >
            <div className={ui.label}>5. Sdílené tajemství</div>
            <div className={ui.mono}>
              K = A<sup>b</sup> mod m
            </div>
            <div className={ui.monoMuted}>
              = {showSecret ? A : '…'}
              <sup>{bClamped}</sup> mod {m} ={' '}
              <span className="text-ink-100 font-semibold">
                {showSecret ? Kb : '…'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Eve */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Eva (odposlech)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className={ui.label}>Vidí na kanále</div>
            <div className="font-mono text-[13px] text-ink-200 space-y-0.5">
              <div>m = {m}</div>
              <div>g = {gClamped}</div>
              <div>A = {showPubKeys ? A : '…'}</div>
              <div>B = {showPubKeys ? B : '…'}</div>
            </div>
          </div>
          <div>
            <div className={ui.label}>Co nezná</div>
            <div className="font-sans text-[13px] text-ink-300 leading-relaxed">
              Soukromé klíče <span className="font-mono">a</span>,{' '}
              <span className="font-mono">b</span> ani{' '}
              <span className="font-mono">K = g^(ab) mod m</span>. Aby je z{' '}
              <span className="font-mono">A = g^a mod m</span> dopočítala, musí
              vyřešit problém diskrétního logaritmu (PDL), který je pro velké{' '}
              <span className="font-mono">m</span> výpočetně neproveditelný.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
