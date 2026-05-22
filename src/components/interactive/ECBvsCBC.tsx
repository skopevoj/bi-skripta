import { useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Grid dimensions: COLS bits per block (= one row), ROWS blocks total.
const COLS = 16
const ROWS = 10

type Grid = boolean[][]

// --- Deterministic hashing primitives ---------------------------------------
// FNV-1a 32-bit hash of a string. Stable, small, sufficient for a visual demo.
function fnv1a(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

// Mulberry32 PRNG seeded from a 32-bit integer. Used to expand a hash into
// COLS pseudo-random bits.
function prng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function bitsFromSeed(seed: number, n: number): boolean[] {
  const rng = prng(seed)
  const out: boolean[] = []
  for (let i = 0; i < n; i++) out.push(rng() > 0.5)
  return out
}

function rowKey(row: boolean[]): string {
  let s = ''
  for (const b of row) s += b ? '1' : '0'
  return s
}

function xorRows(a: boolean[], b: boolean[]): boolean[] {
  return a.map((v, i) => v !== b[i])
}

// --- Cipher simulations -----------------------------------------------------
function encryptECB(grid: Grid): Grid {
  // Identical input blocks → identical output blocks. Pattern survives.
  return grid.map((row) => bitsFromSeed(fnv1a('ecb|' + rowKey(row)), COLS))
}

function encryptCBC(grid: Grid, iv: boolean[]): Grid {
  // Chain each block with the previous ciphertext block via XOR before "encrypting".
  const out: Grid = []
  let prev = iv
  for (const row of grid) {
    const mixed = xorRows(row, prev)
    const cipher = bitsFromSeed(fnv1a('cbc|' + rowKey(mixed)), COLS)
    out.push(cipher)
    prev = cipher
  }
  return out
}

// --- Presets ----------------------------------------------------------------
function emptyGrid(): Grid {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(false))
}

function presetStripes(): Grid {
  const g = emptyGrid()
  for (let r = 0; r < ROWS; r++) {
    if (r % 2 === 0) g[r] = Array(COLS).fill(true)
  }
  return g
}

function presetChessboard(): Grid {
  const g = emptyGrid()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      g[r][c] = (r + c) % 2 === 0
    }
  }
  return g
}

function presetH(): Grid {
  // Letter "H" centered in the grid — two vertical bars + a crossbar.
  const g = emptyGrid()
  const left = Math.floor(COLS * 0.25)
  const right = Math.floor(COLS * 0.75)
  const top = 1
  const bottom = ROWS - 2
  const mid = Math.floor(ROWS / 2)
  for (let r = top; r <= bottom; r++) {
    g[r][left] = true
    g[r][left + 1] = true
    g[r][right] = true
    g[r][right - 1] = true
  }
  for (let c = left; c <= right; c++) {
    g[mid][c] = true
    g[mid - 1][c] = true
  }
  return g
}

function randomNoise(): Grid {
  const g = emptyGrid()
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      g[r][c] = Math.random() > 0.5
    }
  }
  return g
}

// --- Visual grid ------------------------------------------------------------
const CELL = 14 // px

function GridView({
  grid,
  onToggle,
}: {
  grid: Grid
  onToggle?: (r: number, c: number) => void
}) {
  const interactive = !!onToggle
  return (
    <div
      className="inline-grid border border-ink-800 bg-ink-900"
      style={{
        gridTemplateColumns: `repeat(${COLS}, ${CELL}px)`,
        gridTemplateRows: `repeat(${ROWS}, ${CELL}px)`,
        gap: 1,
        padding: 1,
      }}
      role={interactive ? 'grid' : 'img'}
      aria-label={interactive ? 'Vstupní mřížka' : 'Mřížka'}
    >
      {grid.map((row, r) =>
        row.map((on, c) => {
          const base = on ? 'bg-ink-200' : 'bg-ink-900'
          if (interactive) {
            return (
              <button
                type="button"
                key={`${r}-${c}`}
                onClick={() => onToggle!(r, c)}
                className={
                  base +
                  ' border border-ink-800 hover:border-ink-600 transition-colors p-0'
                }
                style={{ width: CELL, height: CELL }}
                aria-label={`Buňka ${r + 1},${c + 1}: ${on ? 'aktivní' : 'prázdná'}`}
              />
            )
          }
          return (
            <div
              key={`${r}-${c}`}
              className={base + ' border border-ink-800'}
              style={{ width: CELL, height: CELL }}
            />
          )
        }),
      )}
    </div>
  )
}

// --- Main component ---------------------------------------------------------
export function ECBvsCBC() {
  const [grid, setGrid] = useState<Grid>(() => presetStripes())
  // Stable IV across re-renders, so CBC output is deterministic until user
  // explicitly regenerates it via the noise/preset controls.
  const [iv] = useState<boolean[]>(() => bitsFromSeed(0xc0ffee, COLS))

  const ecb = useMemo(() => encryptECB(grid), [grid])
  const cbc = useMemo(() => encryptCBC(grid, iv), [grid, iv])

  function toggle(r: number, c: number) {
    setGrid((g) => {
      const next = g.map((row) => row.slice())
      next[r][c] = !next[r][c]
      return next
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className={ui.rowLabel + ' mr-1'}>Vzor</span>
        <button
          type="button"
          className={ui.button}
          onClick={() => setGrid(presetStripes())}
        >
          Pruhy
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={() => setGrid(presetChessboard())}
        >
          Šachovnice
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={() => setGrid(presetH())}
        >
          Písmeno H
        </button>
        <span className="mx-1 text-ink-700" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          className={ui.button}
          onClick={() => setGrid(randomNoise())}
        >
          Náhodný šum
        </button>
        <button
          type="button"
          className={ui.button}
          onClick={() => setGrid(emptyGrid())}
        >
          Vyčistit
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className={ui.panel}>
          <div className="flex items-baseline justify-between mb-2">
            <span className={ui.label + ' mb-0'}>Otevřený text</span>
            <span className={ui.monoMuted}>OT</span>
          </div>
          <div className="overflow-x-auto">
            <GridView grid={grid} onToggle={toggle} />
          </div>
        </div>

        <div className={ui.panel}>
          <div className="flex items-baseline justify-between mb-2">
            <span className={ui.label + ' mb-0'}>ECB</span>
            <span className={ui.monoMuted}>E_K(OT_i)</span>
          </div>
          <div className="overflow-x-auto">
            <GridView grid={ecb} />
          </div>
        </div>

        <div className={ui.panel}>
          <div className="flex items-baseline justify-between mb-2">
            <span className={ui.label + ' mb-0'}>CBC</span>
            <span className={ui.monoMuted}>E_K(OT_i ⊕ ŠT_{'{i-1}'})</span>
          </div>
          <div className="overflow-x-auto">
            <GridView grid={cbc} />
          </div>
        </div>
      </div>

      <p className="text-[13px] text-ink-400 font-sans leading-relaxed">
        ECB šifruje každý blok nezávisle — stejné bloky dají stejný šifrový
        text, takže vzory ze vstupu zůstanou viditelné. CBC mísí každý blok
        s předchozím šifrovým textem (XOR), takže vzory zmizí a výstup vypadá
        jako bílý šum. Každý řádek mřížky je jeden blok o {COLS} bitech;
        kliknutím přepnete bit ve vstupu.
      </p>
    </div>
  )
}
