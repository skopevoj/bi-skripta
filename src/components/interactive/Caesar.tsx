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

export function Caesar() {
  const [text, setText] = useState('ATAK ZA SVITANI')
  const [shift, setShift] = useState(3)

  const cipher = useMemo(
    () => text.split('').map((c) => shiftChar(c, shift)).join(''),
    [text, shift],
  )

  const shiftedAlphabet = useMemo(
    () => ALPHABET.split('').map((c) => shiftChar(c, shift)).join(''),
    [shift],
  )

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
          {cipher || ' '}
        </div>
      </div>
    </div>
  )
}
