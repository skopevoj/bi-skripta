import { useEffect, useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// Compute SHA-256 via the Web Crypto API. Returns 32 bytes.
async function sha256Bytes(input: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return new Uint8Array(digest)
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// Count differing bits between two equal-length byte arrays.
function hammingDistance(a: Uint8Array, b: Uint8Array): number {
  const n = Math.min(a.length, b.length)
  let count = 0
  for (let i = 0; i < n; i++) {
    let x = a[i] ^ b[i]
    while (x) {
      x &= x - 1
      count++
    }
  }
  return count
}

// Render a 32-byte hash as 256 little bit squares, highlighting bits that
// differ from the reference hash (sage = differs, otherwise set/unset shade).
function BitGrid({
  bytes,
  reference,
}: {
  bytes: Uint8Array
  reference: Uint8Array
}) {
  const cells: { bit: number; differs: boolean; key: number }[] = []
  for (let i = 0; i < bytes.length; i++) {
    const xor = bytes[i] ^ reference[i]
    for (let j = 7; j >= 0; j--) {
      const bit = (bytes[i] >> j) & 1
      const differs = ((xor >> j) & 1) === 1
      cells.push({ bit, differs, key: i * 8 + (7 - j) })
    }
  }
  return (
    <div
      className="grid gap-[2px]"
      style={{ gridTemplateColumns: 'repeat(32, minmax(0, 1fr))' }}
    >
      {cells.map((c) => (
        <span
          key={c.key}
          className={
            'aspect-square rounded-[1px] ' +
            (c.differs
              ? 'bg-accent-definice'
              : c.bit
                ? 'bg-ink-800'
                : 'bg-ink-200')
          }
          title={`bit ${c.key} = ${c.bit}${c.differs ? ' (liší se)' : ''}`}
        />
      ))}
    </div>
  )
}

export function Avalanche() {
  const [inputA, setInputA] = useState('Kryptografie')
  const [inputB, setInputB] = useState('Kryptografif')
  const [hashA, setHashA] = useState<Uint8Array | null>(null)
  const [hashB, setHashB] = useState<Uint8Array | null>(null)

  useEffect(() => {
    let alive = true
    sha256Bytes(inputA).then((h) => {
      if (alive) setHashA(h)
    })
    return () => {
      alive = false
    }
  }, [inputA])

  useEffect(() => {
    let alive = true
    sha256Bytes(inputB).then((h) => {
      if (alive) setHashB(h)
    })
    return () => {
      alive = false
    }
  }, [inputB])

  const ready = hashA !== null && hashB !== null
  const diff = useMemo(
    () => (ready ? hammingDistance(hashA!, hashB!) : 0),
    [ready, hashA, hashB],
  )
  const percent = ready ? ((diff / 256) * 100).toFixed(1) : '—'

  const hexA = ready ? toHex(hashA!) : ''
  const hexB = ready ? toHex(hashB!) : ''

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={ui.label} htmlFor="aval-a">
            Vstup A
          </label>
          <textarea
            id="aval-a"
            value={inputA}
            onChange={(e) => setInputA(e.target.value)}
            rows={2}
            className={ui.input + ' resize-none'}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={ui.label} htmlFor="aval-b">
            Vstup B
          </label>
          <textarea
            id="aval-b"
            value={inputB}
            onChange={(e) => setInputB(e.target.value)}
            rows={2}
            className={ui.input + ' resize-none'}
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className={ui.panel}>
          <div className={ui.label}>SHA-256 (A)</div>
          <div className={ui.mono + ' break-all leading-relaxed'}>
            {hexA || '…'}
          </div>
        </div>
        <div className={ui.panel}>
          <div className={ui.label}>SHA-256 (B)</div>
          <div className={ui.mono + ' break-all leading-relaxed'}>
            {hexB || '…'}
          </div>
        </div>
      </div>

      <div className={ui.panel}>
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <span className={ui.rowLabel}>Bitový rozdíl</span>
          <span className="font-mono text-[13px] text-ink-100">
            <span className="text-ink-500">Lišících se bitů:&nbsp;</span>
            <span className="font-semibold">{ready ? diff : '—'}</span>
            <span className="text-ink-500"> / 256&nbsp;&nbsp;</span>
            <span className="font-semibold">{percent}%</span>
          </span>
        </div>
        {ready && <BitGrid bytes={hashB!} reference={hashA!} />}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-sans text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-ink-200" />
            bit 0
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-ink-800" />
            bit 1
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-[1px] bg-accent-definice" />
            liší se
          </span>
        </div>
      </div>

      <p className="text-[13px] font-sans text-ink-400 leading-relaxed">
        Lavinový efekt: změna jediného bitu ve vstupu by měla v průměru
        přepsat zhruba polovinu (≈ 50&nbsp;%) bitů výstupu. Hašovací funkce
        se tím chová jako náhodné orákulum — dvě podobné zprávy mají naprosto
        nesouvisející haše.
      </p>
    </div>
  )
}
