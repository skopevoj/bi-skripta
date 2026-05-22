import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Small primes for didactic key generation.
const PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]

function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a
  let y = b < 0n ? -b : b
  while (y) {
    ;[x, y] = [y, x % y]
  }
  return x
}

function modpow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n
  let r = 1n
  let b = ((base % mod) + mod) % mod
  let e = exp
  while (e > 0n) {
    if (e & 1n) r = (r * b) % mod
    e >>= 1n
    b = (b * b) % mod
  }
  return r
}

function modinv(a: bigint, m: bigint): bigint | null {
  // Extended Euclidean algorithm.
  let [old_r, r] = [a, m]
  let [old_s, s] = [1n, 0n]
  while (r !== 0n) {
    const q = old_r / r
    ;[old_r, r] = [r, old_r - q * r]
    ;[old_s, s] = [s, old_s - q * s]
  }
  if (old_r !== 1n) return null
  return ((old_s % m) + m) % m
}

export function RSA() {
  const [p, setP] = useState<number>(11)
  const [q, setQ] = useState<number>(13)
  const [eStr, setEStr] = useState<string>('7')
  const [mStr, setMStr] = useState<string>('5')

  const pB = BigInt(p)
  const qB = BigInt(q)
  const n = pB * qB
  const phi = (pB - 1n) * (qB - 1n)

  const eNum = Number(eStr)
  const eValid =
    Number.isInteger(eNum) &&
    eNum > 1 &&
    BigInt(eNum) < phi &&
    gcd(BigInt(eNum), phi) === 1n
  const eB = eValid ? BigInt(eNum) : null

  const d = useMemo(() => (eB !== null ? modinv(eB, phi) : null), [eB, phi])

  const samePQ = p === q

  const mNum = Number(mStr)
  const mValid =
    Number.isInteger(mNum) && mNum >= 0 && BigInt(mNum) < n && !samePQ
  const mB = mValid ? BigInt(mNum) : null

  const c = useMemo(
    () => (mB !== null && eB !== null ? modpow(mB, eB, n) : null),
    [mB, eB, n],
  )
  const mPrime = useMemo(
    () => (c !== null && d !== null ? modpow(c, d, n) : null),
    [c, d, n],
  )

  return (
    <div className="space-y-3">
      {/* Section 1: Key generation */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Generování klíče</div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={ui.label}>Prvočíslo p</span>
            <select
              value={p}
              onChange={(ev) => setP(Number(ev.target.value))}
              className={ui.input}
            >
              {PRIMES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={ui.label}>Prvočíslo q</span>
            <select
              value={q}
              onChange={(ev) => setQ(Number(ev.target.value))}
              className={ui.input}
            >
              {PRIMES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
        </div>
        {samePQ && (
          <div className="mt-2 text-[12px] font-sans text-red-600">
            p a q musí být různá prvočísla.
          </div>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <div className={ui.label}>Modul n</div>
            <div className={ui.mono}>
              n = p · q = {p} · {q} ={' '}
              <span className="text-ink-100">{n.toString()}</span>
            </div>
          </div>
          <div>
            <div className={ui.label}>Eulerova funkce φ(n)</div>
            <div className={ui.mono}>
              φ(n) = (p−1)(q−1) = {p - 1} · {q - 1} ={' '}
              <span className="text-ink-100">{phi.toString()}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block">
            <span className={ui.label}>Veřejný exponent e</span>
            <input
              type="number"
              min={2}
              value={eStr}
              onChange={(ev) => setEStr(ev.target.value)}
              className={ui.input}
            />
            {!eValid && (
              <div className="mt-1 text-[12px] font-sans text-red-600">
                e musí splňovat 1 &lt; e &lt; φ(n) a gcd(e, φ(n)) = 1.
              </div>
            )}
          </label>
          <div>
            <div className={ui.label}>Soukromý exponent d</div>
            <div className={ui.mono}>
              d = e<sup>−1</sup> mod φ(n) ={' '}
              <span className="text-ink-100">
                {d !== null ? d.toString() : '—'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={ui.label + ' mb-0'}>Klíče</span>
          <span className={ui.chip}>
            VK = (n, e) = ({n.toString()}, {eValid ? eNum : '—'})
          </span>
          <span className={ui.chip}>
            SK = (n, d) = ({n.toString()}, {d !== null ? d.toString() : '—'})
          </span>
        </div>
      </div>

      {/* Section 2: Encryption */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Šifrování</div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className={ui.label}>Zpráva m</span>
            <input
              type="number"
              min={0}
              value={mStr}
              onChange={(ev) => setMStr(ev.target.value)}
              className={ui.input}
            />
            {!mValid && !samePQ && (
              <div className="mt-1 text-[12px] font-sans text-red-600">
                m musí být celé číslo z rozsahu 0 ≤ m &lt; n = {n.toString()}.
              </div>
            )}
          </label>
          <div>
            <div className={ui.label}>Šifrový text c</div>
            <div className={ui.mono}>
              c = m<sup>e</sup> mod n
            </div>
            <div className={ui.monoMuted}>
              = {mValid ? mNum : '—'}
              <sup>{eValid ? eNum : '—'}</sup> mod {n.toString()} ={' '}
              <span className="text-ink-100">
                {c !== null ? c.toString() : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Decryption */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>Dešifrování</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className={ui.label}>Dešifrovaná zpráva m′</div>
            <div className={ui.mono}>
              m′ = c<sup>d</sup> mod n
            </div>
            <div className={ui.monoMuted}>
              = {c !== null ? c.toString() : '—'}
              <sup>{d !== null ? d.toString() : '—'}</sup> mod {n.toString()} ={' '}
              <span className="text-ink-100">
                {mPrime !== null ? mPrime.toString() : '—'}
              </span>
            </div>
          </div>
          <div>
            <div className={ui.label}>Korektnost</div>
            {mPrime !== null && mB !== null && mPrime === mB ? (
              <div className="font-mono text-[13px] text-accent-definice">
                m′ = m = {mPrime.toString()}
              </div>
            ) : (
              <div className="font-mono text-[13px] text-ink-400">
                m′ {mPrime !== null ? '= ' + mPrime.toString() : '= —'}, m ={' '}
                {mValid ? mNum : '—'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
