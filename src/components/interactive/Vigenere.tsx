import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

function isUpper(code: number) {
  return code >= 65 && code <= 90
}
function isLower(code: number) {
  return code >= 97 && code <= 122
}

type Cell = {
  plain: string
  key: string
  cipher: string
  isLetter: boolean
}

function vigenere(plain: string, key: string): Cell[] {
  const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase()
  const cells: Cell[] = []
  let ki = 0
  for (const ch of plain) {
    const code = ch.charCodeAt(0)
    if (cleanKey.length > 0 && (isUpper(code) || isLower(code))) {
      const base = isUpper(code) ? 65 : 97
      const k = cleanKey.charCodeAt(ki % cleanKey.length) - 65
      const c = String.fromCharCode(((code - base + k) % 26) + base)
      cells.push({
        plain: ch,
        key: cleanKey[ki % cleanKey.length],
        cipher: c,
        isLetter: true,
      })
      ki++
    } else {
      cells.push({ plain: ch, key: ' ', cipher: ch, isLetter: false })
    }
  }
  return cells
}

export function Vigenere() {
  const [text, setText] = useState('UTOK ZA USVITU')
  const [key, setKey] = useState('KLIC')

  const cells = useMemo(() => vigenere(text, key), [text, key])
  const cleanKey = key.replace(/[^A-Za-z]/g, '').toUpperCase()

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className={ui.label} htmlFor="vig-text">
            Otevřený text
          </label>
          <input
            id="vig-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={ui.input}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div className="sm:w-40">
          <label className={ui.label} htmlFor="vig-key">
            Klíč
          </label>
          <input
            id="vig-key"
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={ui.input}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <div className={ui.panel + ' overflow-x-auto'}>
        <div className="inline-grid gap-y-1 min-w-full">
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-center">
            <span className={ui.rowLabel}>OT</span>
            <div className="font-mono text-[13px] text-ink-100 whitespace-nowrap">
              {cells.map((cell, i) => (
                <span key={`p-${i}`} className="inline-block w-[1.2em] text-center">
                  {cell.plain}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-center">
            <span className={ui.rowLabel}>Klíč</span>
            <div className="font-mono text-[13px] text-ink-500 whitespace-nowrap">
              {cells.map((cell, i) => (
                <span key={`k-${i}`} className="inline-block w-[1.2em] text-center">
                  {cell.isLetter ? cell.key : ' '}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 items-center">
            <span className={ui.rowLabel}>ŠT</span>
            <div className="font-mono text-[13px] text-ink-100 whitespace-nowrap">
              {cells.map((cell, i) => (
                <span key={`c-${i}`} className="inline-block w-[1.2em] text-center">
                  {cell.cipher}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-ink-400 font-sans leading-relaxed">
        Každé písmeno otevřeného textu je Caesarovsky posunuto podle příslušného
        písmene klíče{cleanKey && (
          <>
            {' '}
            <span className={ui.chip}>{cleanKey}</span>
          </>
        )}
        , které se opakuje po celé délce zprávy. Nepísmenné znaky procházejí
        beze změny a neposouvají index klíče.
      </p>
    </div>
  )
}
