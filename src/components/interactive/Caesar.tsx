import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function shiftChar(ch: string, shift: number): string {
  const code = ch.charCodeAt(0)
  if (code >= 65 && code <= 90) {
    return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65)
  }
  if (code >= 97 && code <= 122) {
    return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97)
  }
  return ch
}

function letterIndex(ch: string): number | null {
  const c = ch.toUpperCase().charCodeAt(0)
  if (c >= 65 && c <= 90) return c - 65
  return null
}

export function Caesar() {
  const [text, setText] = useState('ATAK ZA SVITANI')
  const [shift, setShift] = useState(3)
  // The OT letter (A..Z) the user has selected for spotlight; null = none.
  const [activeLetter, setActiveLetter] = useState<number | null>(0)

  const cipher = useMemo(
    () => text.split('').map((c) => shiftChar(c, shift)).join(''),
    [text, shift],
  )

  const shiftedAlphabet = useMemo(
    () => ALPHABET.split('').map((c) => shiftChar(c, shift)).join(''),
    [shift],
  )

  // Index of the shifted counterpart for the active letter.
  const activeCipherIndex =
    activeLetter !== null ? (activeLetter + shift + 26 * 10) % 26 : null

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className={ui.label} htmlFor="caesar-text">
            Otevřený text
          </label>
          <input
            id="caesar-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={ui.input}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="sm:w-56">
          <label className={ui.label} htmlFor="caesar-shift">
            Posun&nbsp;
            <span className="text-ink-300 font-mono normal-case tracking-normal">
              k = {shift}
            </span>
          </label>
          <input
            id="caesar-shift"
            type="range"
            min={0}
            max={25}
            value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className={ui.slider}
          />
        </div>
      </div>

      {/* Alphabet mapping with spotlight */}
      <div className={ui.panel + ' overflow-x-auto'}>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <span className={ui.rowLabel}>Mapování abecedy</span>
          <span className="text-[11px] font-sans text-ink-400">
            Klikněte na písmeno níže nebo v textu pro spotlight.
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-center min-w-fit">
          <span className={ui.rowLabel}>OT</span>
          <div className="flex tracking-[0.35em] whitespace-nowrap">
            {ALPHABET.split('').map((c, i) => {
              const isActive = activeLetter === i
              return (
                <button
                  key={`p-${c}`}
                  type="button"
                  onClick={() => setActiveLetter(isActive ? null : i)}
                  className={
                    'inline-block w-[1.5em] text-center font-mono rounded-sm transition-colors ' +
                    (isActive
                      ? 'bg-ink-200 text-ink-950'
                      : 'text-ink-100 hover:bg-ink-900')
                  }
                >
                  {c}
                </button>
              )
            })}
          </div>
          <span className={ui.rowLabel + ' text-ink-600'} aria-hidden="true">
            ↓
          </span>
          <div className="tracking-[0.35em] whitespace-nowrap font-mono text-[13px]">
            {ALPHABET.split('').map((_, i) => {
              const isActive = activeLetter === i
              return (
                <span
                  key={`arr-${i}`}
                  className={
                    'inline-block w-[1.5em] text-center ' +
                    (isActive ? 'text-ink-100' : 'text-ink-600')
                  }
                >
                  {isActive ? '↓' : '↓'}
                </span>
              )
            })}
          </div>
          <span className={ui.rowLabel}>ŠT</span>
          <div className="flex tracking-[0.35em] whitespace-nowrap">
            {shiftedAlphabet.split('').map((c, i) => {
              const isActive = activeCipherIndex === i
              return (
                <span
                  key={`c-${i}`}
                  className={
                    'inline-block w-[1.5em] text-center font-mono rounded-sm ' +
                    (isActive
                      ? 'bg-ink-200 text-ink-950'
                      : 'text-ink-100')
                  }
                >
                  {c}
                </span>
              )
            })}
          </div>
        </div>
        {activeLetter !== null && (
          <div className="mt-3 font-mono text-[13px] text-ink-300">
            {ALPHABET[activeLetter]} ({activeLetter}) + {shift} ={' '}
            {activeLetter + shift}{' '}
            {activeLetter + shift >= 26 && (
              <span className="text-ink-500">
                ≡ {(activeLetter + shift) % 26} (mod 26)
              </span>
            )}{' '}
            → <span className="text-ink-100 font-semibold">{ALPHABET[(activeLetter + shift) % 26]}</span>
            {activeLetter + shift >= 26 && (
              <span className="ml-2 text-ink-500 text-[12px]">
                (přetočilo se přes Z zpět na A)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Output with per-character highlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <span className={ui.label}>Otevřený text (klikněte na znak)</span>
          <div className={ui.panel + ' ' + ui.mono + ' break-words whitespace-pre-wrap'}>
            {text.split('').map((ch, i) => {
              const idx = letterIndex(ch)
              const isHighlight = idx !== null && idx === activeLetter
              return (
                <span
                  key={`pt-${i}`}
                  onClick={() => idx !== null && setActiveLetter(idx === activeLetter ? null : idx)}
                  className={
                    (idx !== null ? 'cursor-pointer rounded-sm transition-colors ' : '') +
                    (isHighlight ? 'bg-ink-200 text-ink-950 px-0.5' : idx !== null ? 'hover:bg-ink-900' : '')
                  }
                >
                  {ch}
                </span>
              )
            })}
          </div>
        </div>
        <div>
          <span className={ui.label}>Šifrový text</span>
          <div className={ui.panel + ' ' + ui.mono + ' break-words whitespace-pre-wrap'}>
            {cipher.split('').map((ch, i) => {
              const otIdx = letterIndex(text[i] ?? '')
              const isHighlight = otIdx !== null && otIdx === activeLetter
              return (
                <span
                  key={`ct-${i}`}
                  className={
                    isHighlight ? 'bg-ink-200 text-ink-950 px-0.5 rounded-sm' : ''
                  }
                >
                  {ch}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
