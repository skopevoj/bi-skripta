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

export function DiffieHellman() {
  const [m, setM] = useState(23)
  const [g, setG] = useState(5)
  const [a, setA] = useState(6)
  const [b, setB] = useState(15)

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
    [validM, A, bClamped, m],
  )

  return (
    <div className="space-y-4">
      {/* Veřejné parametry */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Veřejné parametry</div>
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
            <div className={'mt-1.5 ' + ui.monoMuted}>
              g mod m = {gClamped}
            </div>
          </label>
        </div>
      </div>

      {/* Alice | Channel | Bob */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Alice */}
        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>Alice</div>
          <label className="block mb-3">
            <span className={ui.label}>Soukromý klíč a</span>
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
          <div className="space-y-2">
            <div>
              <div className={ui.label}>Veřejný klíč A</div>
              <div className={ui.mono}>
                A = g<sup>a</sup> mod m
              </div>
              <div className={ui.monoMuted}>
                = {gClamped}
                <sup>{aClamped}</sup> mod {m} ={' '}
                <span className="text-ink-100">{A}</span>
              </div>
            </div>
            <div>
              <div className={ui.label}>Sdílené tajemství</div>
              <div className={ui.mono}>
                K = B<sup>a</sup> mod m
              </div>
              <div className={ui.monoMuted}>
                = {B}
                <sup>{aClamped}</sup> mod {m} ={' '}
                <span className="text-ink-100 font-semibold">{Ka}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Channel */}
        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>Veřejný kanál</div>
          <div className="space-y-2 text-center">
            <div>
              <div className={ui.label}>Alice → Bob</div>
              <div className={ui.mono}>A = {A}</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={ui.monoMuted}>m = {m}</span>
              <span className={ui.monoMuted}>·</span>
              <span className={ui.monoMuted}>g = {gClamped}</span>
            </div>
            <div>
              <div className={ui.label}>Bob → Alice</div>
              <div className={ui.mono}>B = {B}</div>
            </div>
            <div className="pt-2 border-t border-ink-800">
              <div className={ui.label}>Shoda klíčů</div>
              {validM && Ka === Kb ? (
                <div className="font-mono text-[13px] text-ink-100">
                  K<sub>A</sub> = K<sub>B</sub> = {Ka} ✓ shoda
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
          <label className="block mb-3">
            <span className={ui.label}>Soukromý klíč b</span>
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
          <div className="space-y-2">
            <div>
              <div className={ui.label}>Veřejný klíč B</div>
              <div className={ui.mono}>
                B = g<sup>b</sup> mod m
              </div>
              <div className={ui.monoMuted}>
                = {gClamped}
                <sup>{bClamped}</sup> mod {m} ={' '}
                <span className="text-ink-100">{B}</span>
              </div>
            </div>
            <div>
              <div className={ui.label}>Sdílené tajemství</div>
              <div className={ui.mono}>
                K = A<sup>b</sup> mod m
              </div>
              <div className={ui.monoMuted}>
                = {A}
                <sup>{bClamped}</sup> mod {m} ={' '}
                <span className="text-ink-100 font-semibold">{Kb}</span>
              </div>
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
              <div>A = {A}</div>
              <div>B = {B}</div>
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
