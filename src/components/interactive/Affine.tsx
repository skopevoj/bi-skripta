import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const M = 26

// a values coprime with 26 (i.e. gcd(a, 26) = 1)
const COPRIME_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]

function gcd(a: number, b: number): number {
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function modInverse(a: number, m: number): number | null {
  for (let x = 1; x < m; x++) {
    if (((a % m) * x) % m === 1) return x
  }
  return null
}

function affineChar(ch: string, a: number, b: number): string {
  const code = ch.charCodeAt(0)
  if (code >= 65 && code <= 90) {
    const p = code - 65
    const c = (((a * p + b) % M) + M) % M
    return String.fromCharCode(c + 65)
  }
  if (code >= 97 && code <= 122) {
    const p = code - 97
    const c = (((a * p + b) % M) + M) % M
    return String.fromCharCode(c + 97)
  }
  return ch
}

export function Affine() {
  const [text, setText] = useState('ATAK ZA SVITANI')
  const [a, setA] = useState(7)
  const [b, setB] = useState(10)

  const aValid = gcd(a, M) === 1
  const aInv = useMemo(() => (aValid ? modInverse(a, M) : null), [a, aValid])

  const cipher = useMemo(
    () =>
      aValid
        ? text.split('').map((c) => affineChar(c, a, b)).join('')
        : '',
    [text, a, b, aValid],
  )

  const shiftedAlphabet = useMemo(
    () =>
      aValid
        ? ALPHABET.split('').map((c) => affineChar(c, a, b)).join('')
        : ALPHABET,
    [a, b, aValid],
  )

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label className={ui.label} htmlFor="affine-text">
            Otevřený text
          </label>
          <input
            id="affine-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={ui.input}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="sm:w-40">
          <label className={ui.label} htmlFor="affine-a">
            Koeficient&nbsp;
            <span className="text-ink-300 font-mono normal-case tracking-normal">
              a = {a}
            </span>
          </label>
          <select
            id="affine-a"
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className={ui.input}
          >
            {COPRIME_A.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:w-44">
          <label className={ui.label} htmlFor="affine-b">
            Posun&nbsp;
            <span className="text-ink-300 font-mono normal-case tracking-normal">
              b = {b}
            </span>
          </label>
          <input
            id="affine-b"
            type="range"
            min={0}
            max={25}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className={ui.slider}
          />
        </div>
      </div>

      <div className="text-[12px] font-mono text-ink-400 leading-relaxed">
        <span className="text-ink-200">c = ({a}·p + {b}) mod 26</span>
        {aValid && aInv !== null && (
          <>
            {'   '}·{'   '}
            <span>
              a⁻¹ = {aInv} mod 26{' '}
              <span className="text-ink-500">
                (dešifrování: p = {aInv}·(c − {b}) mod 26)
              </span>
            </span>
          </>
        )}
      </div>

      {!aValid && (
        <div className="text-[13px] text-red-600 font-sans">
          Hodnota a = {a} není nesoudělná s 26 — afinní šifra by nebyla
          invertovatelná. Vyberte a ∈ {'{'}1, 3, 5, 7, 9, 11, 15, 17, 19, 21,
          23, 25{'}'}.
        </div>
      )}

      <div className={ui.panel + ' overflow-x-auto'}>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-center min-w-fit">
          <span className={ui.rowLabel}>OT</span>
          <div className={ui.mono + ' tracking-[0.35em] whitespace-nowrap'}>
            {ALPHABET.split('').map((c) => (
              <span key={`p-${c}`} className="inline-block w-[1.2em] text-center">
                {c}
              </span>
            ))}
          </div>
          <span className={ui.rowLabel + ' text-ink-600'} aria-hidden="true">
            ↓
          </span>
          <div className="tracking-[0.35em] whitespace-nowrap text-ink-600 font-mono text-[13px]">
            {ALPHABET.split('').map((_, i) => (
              <span key={`a-${i}`} className="inline-block w-[1.2em] text-center">
                ↓
              </span>
            ))}
          </div>
          <span className={ui.rowLabel}>ŠT</span>
          <div className={ui.mono + ' tracking-[0.35em] whitespace-nowrap'}>
            {shiftedAlphabet.split('').map((c, i) => (
              <span key={`c-${i}`} className="inline-block w-[1.2em] text-center">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className={ui.label}>Šifrový text</span>
        <div className={ui.panel + ' ' + ui.mono + ' break-words whitespace-pre-wrap'}>
          {cipher || ' '}
        </div>
      </div>
    </div>
  )
}
