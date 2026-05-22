import { useEffect, useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

const M = 26

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    ;[a, b] = [b, a % b]
  }
  return a
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function modInverse(a: number, m: number): number | null {
  const ra = mod(a, m)
  for (let x = 1; x < m; x++) {
    if ((ra * x) % m === 1) return x
  }
  return null
}

type Matrix = [[number, number], [number, number]]

function det(A: Matrix): number {
  return mod(A[0][0] * A[1][1] - A[0][1] * A[1][0], M)
}

function inverseMod26(A: Matrix): Matrix | null {
  const d = det(A)
  const dInv = modInverse(d, M)
  if (dInv === null) return null
  return [
    [mod(dInv * A[1][1], M), mod(-dInv * A[0][1], M)],
    [mod(-dInv * A[1][0], M), mod(dInv * A[0][0], M)],
  ]
}

function letterToNum(ch: string): number | null {
  const c = ch.toUpperCase().charCodeAt(0)
  if (c >= 65 && c <= 90) return c - 65
  return null
}

function numToLetter(n: number): string {
  return String.fromCharCode((mod(n, M)) + 65)
}

function cleanText(s: string): string {
  return s.toUpperCase().replace(/[^A-Z]/g, '')
}

type Pair = {
  ot: string
  st: string
  p1: number
  p2: number
  c1raw: number
  c2raw: number
  c1: number
  c2: number
}

function encrypt(plain: string, A: Matrix): Pair[] {
  const clean = cleanText(plain)
  const padded = clean.length % 2 === 0 ? clean : clean + 'X'
  const out: Pair[] = []
  for (let i = 0; i < padded.length; i += 2) {
    const p1 = letterToNum(padded[i]!)!
    const p2 = letterToNum(padded[i + 1]!)!
    const c1raw = A[0][0] * p1 + A[0][1] * p2
    const c2raw = A[1][0] * p1 + A[1][1] * p2
    const c1 = mod(c1raw, M)
    const c2 = mod(c2raw, M)
    out.push({
      ot: padded[i]! + padded[i + 1]!,
      st: numToLetter(c1) + numToLetter(c2),
      p1,
      p2,
      c1raw,
      c2raw,
      c1,
      c2,
    })
  }
  return out
}

function MatrixInput({
  value,
  onChange,
  ariaLabel,
}: {
  value: Matrix
  onChange: (m: Matrix) => void
  ariaLabel: string
}) {
  const setCell = (r: 0 | 1, c: 0 | 1, v: number) => {
    const next: Matrix = [
      [value[0][0], value[0][1]],
      [value[1][0], value[1][1]],
    ]
    next[r][c] = mod(v, M)
    onChange(next)
  }
  return (
    <div
      className="inline-grid grid-cols-2 gap-1.5 p-2 border border-ink-800 rounded bg-ink-950"
      role="group"
      aria-label={ariaLabel}
    >
      {([0, 1] as const).map((r) =>
        ([0, 1] as const).map((c) => (
          <input
            key={`${r}-${c}`}
            type="number"
            min={0}
            max={25}
            value={value[r][c]}
            onChange={(e) => setCell(r, c, Number(e.target.value || 0))}
            className="w-12 px-1.5 py-1 bg-ink-900 border border-ink-800 rounded text-ink-100 font-mono text-[13px] text-center focus:outline-none focus:border-ink-600"
          />
        )),
      )}
    </div>
  )
}

function MatrixReadonly({ value }: { value: Matrix }) {
  return (
    <div className="inline-grid grid-cols-2 gap-1.5 p-2 border border-ink-800 rounded bg-ink-950">
      {([0, 1] as const).map((r) =>
        ([0, 1] as const).map((c) => (
          <span
            key={`${r}-${c}`}
            className="w-12 px-1.5 py-1 bg-ink-900/40 border border-ink-800 rounded text-ink-200 font-mono text-[13px] text-center"
          >
            {value[r][c]}
          </span>
        )),
      )}
    </div>
  )
}

export function Hill() {
  const [text, setText] = useState('THE GOLD IS BURIED IN ORONO')
  const [A, setA] = useState<Matrix>([
    [5, 17],
    [4, 15],
  ])
  const [activePair, setActivePair] = useState(0)

  const d = det(A)
  const valid = gcd(d, M) === 1
  const Ainv = useMemo(() => (valid ? inverseMod26(A) : null), [A, valid])
  const pairs = useMemo(() => (valid ? encrypt(text, A) : []), [text, A, valid])

  useEffect(() => {
    if (activePair >= pairs.length) setActivePair(0)
  }, [pairs.length, activePair])

  const cipher = pairs.map((p) => p.st).join('')
  const active = pairs[activePair] ?? null

  return (
    <div className="space-y-5">
      <div>
        <label className={ui.label} htmlFor="hill-text">
          Otevřený text
        </label>
        <input
          id="hill-text"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={ui.input}
          spellCheck={false}
          autoComplete="off"
        />
        <div className="mt-1 text-[12px] text-ink-500 font-sans">
          Mezery a interpunkce jsou ignorovány; lichá délka se doplní písmenem X.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[auto_auto_1fr] sm:items-start">
        <div>
          <span className={ui.label}>Klíčová matice A</span>
          <div className="mt-1">
            <MatrixInput value={A} onChange={setA} ariaLabel="Klíčová matice A" />
          </div>
          <div className="mt-2 text-[12px] font-mono text-ink-400">
            det A = {d} mod 26
          </div>
        </div>

        <div>
          <span className={ui.label}>Inverzní matice A⁻¹</span>
          <div className="mt-1">
            {Ainv ? (
              <MatrixReadonly value={Ainv} />
            ) : (
              <div className="inline-block px-3 py-2 border border-ink-800 rounded bg-ink-950 text-ink-500 font-mono text-[12px]">
                neexistuje
              </div>
            )}
          </div>
          <div className="mt-2 text-[12px] font-mono text-ink-400">
            {valid ? 'gcd(det, 26) = 1' : 'gcd(det, 26) ≠ 1'}
          </div>
        </div>

        <div className="text-[12px] font-mono text-ink-400 leading-relaxed sm:pl-2">
          <div className="text-ink-200">c = A · p (mod 26)</div>
          <div>p = A⁻¹ · c (mod 26)</div>
          <div className="text-ink-500 mt-1">
            Blok n = 2: každá dvojice písmen je sloupec p = (p₁, p₂)ᵀ.
          </div>
        </div>
      </div>

      {!valid && (
        <div className="text-[13px] text-red-600 font-sans">
          det A = {d} není nesoudělné s 26 — matice A není v ℤ₂₆ invertibilní a
          šifra by nešla dešifrovat. Upravte buňky tak, aby det A byl
          nesoudělný s 26.
        </div>
      )}

      {valid && pairs.length > 0 && (
        <>
          {/* Pair selector with synchronized OT/ŠT highlight */}
          <div className={ui.panel + ' overflow-x-auto'}>
            <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
              <span className={ui.rowLabel}>Dvojice znaků</span>
              <span className="text-[11px] font-sans text-ink-400">
                Klikněte na dvojici, abyste viděli rozepsané násobení matice × sloupec.
              </span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 items-center min-w-fit">
              <span className={ui.rowLabel}>OT</span>
              <div className="flex flex-wrap gap-1.5">
                {pairs.map((p, i) => (
                  <button
                    key={`p-${i}`}
                    type="button"
                    onClick={() => setActivePair(i)}
                    className={
                      'px-1.5 py-0.5 rounded font-mono text-[12px] border transition-colors ' +
                      (i === activePair
                        ? 'bg-ink-200 text-ink-950 border-ink-200'
                        : 'bg-ink-900 text-ink-200 border-ink-800 hover:border-ink-700')
                    }
                  >
                    {p.ot}
                  </button>
                ))}
              </div>
              <span className={ui.rowLabel + ' text-ink-600'} aria-hidden="true">
                ↓
              </span>
              <div className="text-ink-500 font-mono text-[12px]">A · p (mod 26)</div>
              <span className={ui.rowLabel}>ŠT</span>
              <div className="flex flex-wrap gap-1.5">
                {pairs.map((p, i) => (
                  <button
                    key={`c-${i}`}
                    type="button"
                    onClick={() => setActivePair(i)}
                    className={
                      'px-1.5 py-0.5 rounded font-mono text-[12px] border transition-colors ' +
                      (i === activePair
                        ? 'bg-ink-200 text-ink-950 border-ink-200'
                        : 'bg-ink-900 text-ink-100 border-ink-800 hover:border-ink-700')
                    }
                  >
                    {p.st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Walk-through of the active pair */}
          {active && (
            <div className={ui.panel}>
              <div className={ui.rowLabel + ' mb-2'}>
                Rozepsaný výpočet pro dvojici „{active.ot}"
              </div>
              <div className="space-y-2 font-mono text-[13px] text-ink-200">
                <div>
                  p = ({active.ot[0]}, {active.ot[1]})ᵀ = ({active.p1}, {active.p2})ᵀ
                </div>
                <div>
                  c₁ = {A[0][0]}·{active.p1} + {A[0][1]}·{active.p2}{' '}
                  = {A[0][0] * active.p1} + {A[0][1] * active.p2} = {active.c1raw}{' '}
                  {active.c1raw !== active.c1 && (
                    <span className="text-ink-400">≡ {active.c1} (mod 26)</span>
                  )}{' '}
                  → <span className="text-ink-100 font-semibold">{numToLetter(active.c1)}</span>
                </div>
                <div>
                  c₂ = {A[1][0]}·{active.p1} + {A[1][1]}·{active.p2}{' '}
                  = {A[1][0] * active.p1} + {A[1][1] * active.p2} = {active.c2raw}{' '}
                  {active.c2raw !== active.c2 && (
                    <span className="text-ink-400">≡ {active.c2} (mod 26)</span>
                  )}{' '}
                  → <span className="text-ink-100 font-semibold">{numToLetter(active.c2)}</span>
                </div>
              </div>
              <div className={'mt-2 text-[12px] font-sans text-ink-400'}>
                První řádek matice násobí celý sloupec p (skalární součin →
                první souřadnice c). Druhý řádek dává druhou souřadnici.
              </div>
            </div>
          )}

          <div>
            <span className={ui.label}>Šifrový text</span>
            <div
              className={ui.panel + ' ' + ui.mono + ' break-words whitespace-pre-wrap tracking-[0.15em]'}
            >
              {cipher || ' '}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
