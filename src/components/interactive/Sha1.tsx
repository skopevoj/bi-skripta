import { useEffect, useMemo, useRef, useState } from 'react'
import { ui } from './InteractiveCard'

// Initial hash values H0..H4 (FIPS 180-1, §5.3.1).
const H0 = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
// Round constants K[0]..K[3] for the four 20-round groups.
const K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6]

function rol(x: number, n: number): number {
  return ((x << n) | (x >>> (32 - n))) >>> 0
}

function toHex32(x: number): string {
  return (x >>> 0).toString(16).padStart(8, '0')
}

function utf8Bytes(s: string): Uint8Array {
  return new TextEncoder().encode(s)
}

// SHA-1 padding: append 0x80, zeros, then 64-bit big-endian bit-length so the
// total length is a multiple of 512 bits. Returns the padded bytes.
function padMessage(bytes: Uint8Array): Uint8Array {
  const bitLen = bytes.length * 8
  const totalBytes = Math.ceil((bytes.length + 1 + 8) / 64) * 64
  const padded = new Uint8Array(totalBytes)
  padded.set(bytes)
  padded[bytes.length] = 0x80
  const dv = new DataView(padded.buffer)
  dv.setUint32(totalBytes - 8, Math.floor(bitLen / 0x100000000) >>> 0, false)
  dv.setUint32(totalBytes - 4, bitLen >>> 0, false)
  return padded
}

function bytesToWords(bytes: Uint8Array): Uint32Array {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const out = new Uint32Array(bytes.length / 4)
  for (let i = 0; i < out.length; i++) out[i] = dv.getUint32(i * 4, false)
  return out
}

type Round = {
  t: number
  W: number
  f: number
  k: number
  group: 0 | 1 | 2 | 3
  // State AFTER this round.
  state: [number, number, number, number, number]
}

type BlockRun = {
  block: number
  // 80 words of message expansion.
  W: Uint32Array
  // 16 input words for this block (M0..M15).
  M: Uint32Array
  // State entering the block (H before).
  initial: [number, number, number, number, number]
  // 80 rounds.
  rounds: Round[]
  // State leaving the block (after H += state).
  final: [number, number, number, number, number]
}

function runSha1(bytes: Uint8Array): { padded: Uint8Array; blocks: BlockRun[] } {
  const padded = padMessage(bytes)
  const words = bytesToWords(padded)
  const numBlocks = words.length / 16
  const H = [...H0]
  const blocks: BlockRun[] = []

  for (let bi = 0; bi < numBlocks; bi++) {
    const M = words.slice(bi * 16, bi * 16 + 16)
    const W = new Uint32Array(80)
    for (let t = 0; t < 16; t++) W[t] = M[t]
    for (let t = 16; t < 80; t++) {
      W[t] = rol(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1)
    }

    const initial: [number, number, number, number, number] = [
      H[0],
      H[1],
      H[2],
      H[3],
      H[4],
    ]
    let a = H[0],
      b = H[1],
      c = H[2],
      d = H[3],
      e = H[4]

    const rounds: Round[] = []
    for (let t = 0; t < 80; t++) {
      let f: number, k: number, group: 0 | 1 | 2 | 3
      if (t < 20) {
        f = ((b & c) | (~b & d)) >>> 0
        k = K[0]
        group = 0
      } else if (t < 40) {
        f = (b ^ c ^ d) >>> 0
        k = K[1]
        group = 1
      } else if (t < 60) {
        f = ((b & c) | (b & d) | (c & d)) >>> 0
        k = K[2]
        group = 2
      } else {
        f = (b ^ c ^ d) >>> 0
        k = K[3]
        group = 3
      }
      const temp = (rol(a, 5) + f + e + k + W[t]) >>> 0
      e = d
      d = c
      c = rol(b, 30)
      b = a
      a = temp
      rounds.push({ t, W: W[t], f, k, group, state: [a, b, c, d, e] })
    }

    H[0] = (H[0] + a) >>> 0
    H[1] = (H[1] + b) >>> 0
    H[2] = (H[2] + c) >>> 0
    H[3] = (H[3] + d) >>> 0
    H[4] = (H[4] + e) >>> 0

    blocks.push({
      block: bi,
      M,
      W,
      initial,
      rounds,
      final: [H[0], H[1], H[2], H[3], H[4]],
    })
  }

  return { padded, blocks }
}

// Render a 32-bit word as 32 small squares (bit grid).
function BitRow({ word }: { word: number }) {
  const cells: { bit: number; key: number }[] = []
  for (let i = 31; i >= 0; i--) {
    cells.push({ bit: (word >>> i) & 1, key: 31 - i })
  }
  return (
    <div className="flex gap-[1px]">
      {cells.map((c) => (
        <span
          key={c.key}
          className={
            'w-[6px] h-[10px] rounded-[1px] ' +
            (c.bit ? 'bg-ink-200' : 'bg-ink-800')
          }
          title={`bit ${31 - c.key} = ${c.bit}`}
        />
      ))}
    </div>
  )
}

const STATE_LABELS = ['A', 'B', 'C', 'D', 'E'] as const

const GROUP_INFO = [
  { range: '0–19', fName: 'Ch', formula: '(b ∧ c) ∨ (¬b ∧ d)', k: K[0] },
  { range: '20–39', fName: 'Parity', formula: 'b ⊕ c ⊕ d', k: K[1] },
  { range: '40–59', fName: 'Maj', formula: '(b∧c) ∨ (b∧d) ∨ (c∧d)', k: K[2] },
  { range: '60–79', fName: 'Parity', formula: 'b ⊕ c ⊕ d', k: K[3] },
] as const

export function Sha1() {
  const [input, setInput] = useState('Kryptografie')

  const bytes = useMemo(() => utf8Bytes(input), [input])
  const { blocks } = useMemo(() => runSha1(bytes), [bytes])

  // For visualisation we focus on the first block — keep input short enough
  // to fit into a single 512-bit block (≤ 55 bytes after padding).
  const block = blocks[0]
  const numBlocks = blocks.length

  // Cursor over 0..80 (0 = initial state, 80 = after all rounds).
  const [cursor, setCursor] = useState(80)
  const [playing, setPlaying] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    setCursor(80)
    setPlaying(false)
  }, [input])

  useEffect(() => {
    if (!playing) {
      if (timer.current) {
        window.clearTimeout(timer.current)
        timer.current = null
      }
      return
    }
    if (cursor >= 80) {
      setPlaying(false)
      return
    }
    timer.current = window.setTimeout(() => setCursor((c) => c + 1), 80)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [playing, cursor])

  const currentState: [number, number, number, number, number] =
    cursor === 0 ? block.initial : block.rounds[cursor - 1]!.state
  const activeRound = cursor > 0 ? block.rounds[cursor - 1]! : null
  const groupIdx = activeRound ? activeRound.group : 0
  const group = GROUP_INFO[groupIdx]

  // Final hash as a 40-hex string (uses last block).
  const finalH = blocks[blocks.length - 1]!.final
  const finalHex = finalH.map(toHex32).join('')

  // Web Crypto reference — should match finalHex.
  const [refHex, setRefHex] = useState<string>('')
  useEffect(() => {
    let alive = true
    crypto.subtle.digest('SHA-1', bytes.buffer).then((buf) => {
      if (!alive) return
      const arr = Array.from(new Uint8Array(buf))
      setRefHex(arr.map((b) => b.toString(16).padStart(2, '0')).join(''))
    })
    return () => {
      alive = false
    }
  }, [bytes])

  const matches = refHex && refHex === finalHex

  return (
    <div className="space-y-4">
      <div>
        <label className={ui.label} htmlFor="sha1-input">
          Vstupní zpráva
        </label>
        <input
          id="sha1-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 55))}
          className={ui.input}
          spellCheck={false}
          autoComplete="off"
          maxLength={55}
        />
        <div className="mt-1 text-[11px] font-sans text-ink-500">
          {bytes.length} B (≤ 55 B kvůli zobrazení jediného 512-bitového bloku)
          {numBlocks > 1 && (
            <span className="text-accent-definice">
              {' '}
              · zpráva má {numBlocks} bloků, vizualizujeme první
            </span>
          )}
        </div>
      </div>

      {/* Padded message — show 16 input words M0..M15 of first block */}
      <div className={ui.panel}>
        <div className={ui.rowLabel + ' mb-2'}>
          Zarovnaná zpráva — 16 slov vstupního bloku (M<sub>0</sub>…M
          <sub>15</sub>)
        </div>
        <div className="grid grid-cols-4 gap-x-3 gap-y-1 font-mono text-[12px]">
          {Array.from(block.M).map((w, i) => {
            const isPadStart =
              i * 4 <= bytes.length && bytes.length < (i + 1) * 4
            const isLength = i === 14 || i === 15
            return (
              <div key={i} className="flex items-baseline gap-2">
                <span className="text-ink-500 w-7">
                  M<sub>{i}</sub>
                </span>
                <span
                  className={
                    isLength
                      ? 'text-accent-veta'
                      : isPadStart
                        ? 'text-accent-definice'
                        : 'text-ink-100'
                  }
                >
                  {toHex32(w)}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-sans text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-ink-100" />
            data
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-accent-definice" />
            padding (0x80 + nuly)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-accent-veta" />
            délka v bitech (64 b)
          </span>
        </div>
      </div>

      {/* Round controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setCursor((c) => Math.max(0, c - 1))}
          disabled={cursor === 0}
          className={
            ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'
          }
        >
          ← Zpět
        </button>
        <button
          type="button"
          onClick={() => setCursor((c) => Math.min(80, c + 1))}
          disabled={cursor >= 80}
          className={
            ui.button + ' disabled:opacity-40 disabled:cursor-not-allowed'
          }
        >
          Další →
        </button>
        <button
          type="button"
          onClick={() => {
            if (cursor >= 80) setCursor(0)
            setPlaying((p) => !p)
          }}
          className={ui.buttonPrimary}
        >
          {playing ? '⏸ Pauza' : '▶ Přehrát'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false)
            setCursor(0)
          }}
          className={ui.button}
        >
          ⟲ Reset
        </button>
        <span className={ui.monoMuted + ' ml-auto'}>
          runda {cursor} / 80
        </span>
      </div>

      <div>
        <input
          type="range"
          min={0}
          max={80}
          step={1}
          value={cursor}
          onChange={(e) => {
            setPlaying(false)
            setCursor(Number(e.target.value))
          }}
          className={ui.slider}
        />
        <div className="flex justify-between text-[10px] font-sans text-ink-500 mt-1 px-1">
          <span>0</span>
          <span>20</span>
          <span>40</span>
          <span>60</span>
          <span>80</span>
        </div>
      </div>

      {/* Active round detail */}
      <div className={ui.panel}>
        <div className="flex items-baseline justify-between mb-2 gap-3 flex-wrap">
          <div className={ui.rowLabel}>
            {activeRound ? (
              <>
                Runda {activeRound.t} ·{' '}
                <span className="text-ink-300">
                  skupina {group.range} ({group.fName})
                </span>
              </>
            ) : (
              'Počáteční stav (IV)'
            )}
          </div>
          {activeRound && (
            <span className="font-mono text-[12px] text-ink-400">
              f<sub>t</sub> = {group.formula} · K<sub>t</sub> ={' '}
              <span className="text-ink-200">{toHex32(group.k)}</span>
            </span>
          )}
        </div>

        {activeRound && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 font-mono text-[12px]">
            <div className="text-ink-300">
              <span className="text-ink-500">W<sub>{activeRound.t}</sub> = </span>
              <span className="text-ink-100">{toHex32(activeRound.W)}</span>
            </div>
            <div className="text-ink-300">
              <span className="text-ink-500">f<sub>t</sub>(B,C,D) = </span>
              <span className="text-ink-100">{toHex32(activeRound.f)}</span>
            </div>
          </div>
        )}

        {/* State A..E with bit row */}
        <div className="space-y-1.5">
          {STATE_LABELS.map((label, i) => (
            <div
              key={label}
              className="flex items-center gap-3 font-mono text-[12px]"
            >
              <span className="w-3 text-ink-500">{label}</span>
              <span className="text-ink-100 w-[72px]">
                {toHex32(currentState[i])}
              </span>
              <BitRow word={currentState[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* Final hash */}
      <div className={ui.panel}>
        <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
          <div className={ui.label}>SHA-1 hash (160 b)</div>
          <span
            className={
              'text-[11px] font-sans ' +
              (matches ? 'text-ink-400' : 'text-accent-definice')
            }
          >
            {matches
              ? '✓ shoduje se s window.crypto.subtle'
              : refHex
                ? '✗ rozdíl proti Web Crypto'
                : '…'}
          </span>
        </div>
        <div className="font-mono text-[13px] text-ink-100 break-all leading-relaxed">
          {finalHex}
        </div>
      </div>

      <p className="text-[12px] font-sans text-ink-400 leading-relaxed">
        Posuvníkem proklikávej 80 rund: každá z nich do nového A namixuje
        rotované A, nelineární funkci f<sub>t</sub>(B, C, D), expanzní slovo
        W<sub>t</sub> a rundovní konstantu K<sub>t</sub>. Po 80 rundách se
        výsledný kontext přičte ke startovnímu IV (Davies–Meyer) — tím vznikne
        nový kontext, který by se použil pro další blok.
      </p>
    </div>
  )
}
