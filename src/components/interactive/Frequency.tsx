import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Rough reference frequencies for Czech (sums near 100 %).
const CZECH_REF: Record<string, number> = {
  A: 8.4, B: 1.5, C: 2.7, D: 3.6, E: 7.7, F: 0.1, G: 0.1, H: 1.4,
  I: 6.3, J: 2.1, K: 3.7, L: 3.8, M: 3.2, N: 6.6, O: 8.7, P: 3.0,
  Q: 0.0, R: 4.8, S: 5.2, T: 5.7, U: 3.0, V: 5.3, W: 0.0, X: 0.0,
  Y: 1.9, Z: 2.2,
}

const DEFAULT_TEXT =
  'WYPYVKH QL RUPOH WZHUH THALTHAPJRFT QHGFRLT. RKV QP ULGUH, UPRKF ULWVYVGBTP QLQP OSVBIJL. ZPMYF H RVKF QZVB UHZAYVQL, RALYL UHT WVTHOHQP ZKLSLUP BAHQVCHA P SBZAPA. MYLRCLUJUP HUHSFGH QL GHRSHKUP TLAVKH, QHR VKOHSPA WBCVKUP HILJLKB.'

function computeFreq(text: string): { pct: Record<string, number>; total: number } {
  const counts: Record<string, number> = {}
  for (const ch of ALPHABET) counts[ch] = 0
  let total = 0
  for (const raw of text) {
    const ch = raw.toUpperCase()
    if (ch >= 'A' && ch <= 'Z') {
      counts[ch]++
      total++
    }
  }
  const pct: Record<string, number> = {}
  for (const ch of ALPHABET) {
    pct[ch] = total === 0 ? 0 : (counts[ch] / total) * 100
  }
  return { pct, total }
}

export function Frequency() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const { pct, total } = useMemo(() => computeFreq(text), [text])

  // Scale bars so the tallest measured value or reference reaches ~100 % of row width.
  const maxValue = useMemo(() => {
    let m = 0
    for (const ch of ALPHABET) {
      m = Math.max(m, pct[ch], CZECH_REF[ch])
    }
    return Math.max(m, 1)
  }, [pct])

  return (
    <div className="space-y-5">
      <div>
        <label className={ui.label} htmlFor="freq-text">
          Šifrový text
        </label>
        <textarea
          id="freq-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          spellCheck={false}
          className={ui.input + ' resize-y leading-relaxed'}
        />
        <div className="mt-1 text-[11px] tracking-[0.18em] uppercase text-ink-500 font-sans">
          Celkem písmen:{' '}
          <span className="font-mono text-ink-300 normal-case tracking-normal">
            {total}
          </span>
        </div>
      </div>

      <div className={ui.panel}>
        <div className="flex items-center gap-4 mb-3 text-[11px] tracking-[0.18em] uppercase text-ink-500 font-sans">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-2 bg-ink-700" /> Měřeno
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-[2px] bg-accent-definice" /> Čeština (ref.)
          </span>
        </div>
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-3 gap-y-1 items-center">
          {ALPHABET.map((ch) => {
            const value = pct[ch]
            const ref = CZECH_REF[ch]
            const w = (value / maxValue) * 100
            const refLeft = (ref / maxValue) * 100
            return (
              <div key={ch} className="contents">
                <span className="font-mono text-[12px] text-ink-400 text-right w-4">
                  {ch}
                </span>
                <div className="relative h-3.5 bg-transparent">
                  <div
                    className="absolute inset-y-0 left-0 bg-ink-700"
                    style={{ width: `${w}%` }}
                  />
                  <div
                    className="absolute inset-y-0 w-[2px] bg-accent-definice"
                    style={{ left: `calc(${refLeft}% - 1px)` }}
                    aria-hidden="true"
                  />
                </div>
                <span className="font-mono text-[12px] text-ink-400 tabular-nums w-12 text-right">
                  {value.toFixed(1)}&nbsp;%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-[13px] text-ink-400 font-sans leading-relaxed">
        Porovnáním špiček naměřené distribuce se referenční četností lze odhadnout
        posun monoalfabetické substituce. Nejvyšší tyčka v ŠT pravděpodobně
        odpovídá nejčastějšímu písmenu jazyka.
      </p>
    </div>
  )
}
