import { useCallback, useMemo, useState } from 'react'
import { ui } from './InteractiveCard'

// BB84 quantum key distribution — pedagogic simulation.
//
// Bases:  '+' = rectilinear  (0 → →,  1 → ↑)
//         '×' = diagonal     (0 → ↗,  1 → ↘)
//
// Measurement rules:
//   - Same basis as sender → result is deterministic (correct bit).
//   - Different basis      → result is uniformly random (0/1 with p = 1/2).
//
// With an eavesdropper, Eve measures Alice's photon in her own random basis,
// then re-sends a fresh photon encoded in *Eve's* basis. If Bob's basis later
// matches Alice's but Eve guessed wrong, Bob has a 50 % chance of error —
// averaged over Eve's basis choice, this gives 25 % bit-error rate on the
// sifted key, which betrays her presence.

type Basis = '+' | '×'
type Bit = 0 | 1

type Row = {
  aliceBit: Bit
  aliceBasis: Basis
  photon: string
  eveBasis: Basis | null
  eveBit: Bit | null
  bobBasis: Basis
  bobBit: Bit
  match: boolean // bases match (Alice ↔ Bob)
  error: boolean // match AND Bob's bit ≠ Alice's bit (Eve-induced flip)
}

function randBit(): Bit {
  return Math.random() < 0.5 ? 0 : 1
}
function randBasis(): Basis {
  return Math.random() < 0.5 ? '+' : '×'
}

function photonGlyph(bit: Bit, basis: Basis): string {
  if (basis === '+') return bit === 0 ? '→' : '↑'
  return bit === 0 ? '↗' : '↘'
}

// Measure a photon (bit, basis_sent) in basis_used. Same basis → correct bit;
// different basis → fair coin flip.
function measure(bit: Bit, basisSent: Basis, basisUsed: Basis): Bit {
  if (basisSent === basisUsed) return bit
  return randBit()
}

function simulate(n: number, eavesdrop: boolean): Row[] {
  const rows: Row[] = []
  for (let i = 0; i < n; i++) {
    const aliceBit = randBit()
    const aliceBasis = randBasis()
    let basisOnWire: Basis = aliceBasis
    let bitOnWire: Bit = aliceBit
    let eveBasis: Basis | null = null
    let eveBit: Bit | null = null
    if (eavesdrop) {
      eveBasis = randBasis()
      eveBit = measure(aliceBit, aliceBasis, eveBasis)
      // Eve re-encodes her measured bit in *her* basis and sends it onward.
      basisOnWire = eveBasis
      bitOnWire = eveBit
    }
    const bobBasis = randBasis()
    const bobBit = measure(bitOnWire, basisOnWire, bobBasis)
    const match = aliceBasis === bobBasis
    const error = match && bobBit !== aliceBit
    rows.push({
      aliceBit,
      aliceBasis,
      photon: photonGlyph(aliceBit, aliceBasis),
      eveBasis,
      eveBit,
      bobBasis,
      bobBit,
      match,
      error,
    })
  }
  return rows
}

export function BB84() {
  const [n, setN] = useState(12)
  const [eavesdrop, setEavesdrop] = useState(false)
  const [seed, setSeed] = useState(0) // bump to regenerate
  const rows = useMemo(
    () => simulate(n, eavesdrop),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n, eavesdrop, seed],
  )

  const regen = useCallback(() => setSeed((s) => s + 1), [])

  const sifted = rows.filter((r) => r.match)
  const errors = sifted.filter((r) => r.error).length
  const k = sifted.length
  const errPct = k > 0 ? (errors / k) * 100 : 0
  const keyStr = sifted.map((r) => r.aliceBit).join('')

  // Build cell-class helper for highlight.
  function cellClass(row: Row, base = ''): string {
    let cls = base + ' '
    if (row.error) cls += 'bg-accent-dusledek/30 '
    else if (row.match) cls += 'bg-ink-900 '
    return cls
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className={ui.panel}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] gap-3 items-end">
          <label className="block">
            <span className={ui.label}>Počet odeslaných bitů</span>
            <input
              type="range"
              min={4}
              max={32}
              step={1}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              className={ui.slider}
            />
            <div className="flex items-baseline justify-between mt-1">
              <span className={ui.monoMuted}>4 ≤ n ≤ 32</span>
              <span className={ui.chip}>n = {n}</span>
            </div>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={eavesdrop}
              onChange={(e) => setEavesdrop(e.target.checked)}
              className="accent-ink-400"
            />
            <span className="font-sans text-[13px] text-ink-200">
              Odposlech (Eva)
            </span>
          </label>
          <button type="button" onClick={regen} className={ui.button}>
            Generovat
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-[12px]">
          <thead>
            <tr>
              <th className="text-left font-sans text-[11px] tracking-[0.16em] uppercase text-ink-500 font-medium py-1.5 pr-3 border-b border-ink-800">
                #
              </th>
              {rows.map((_, i) => (
                <th
                  key={i}
                  className="text-center font-mono text-[11px] text-ink-500 font-normal py-1.5 px-1.5 border-b border-ink-800"
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Alice bit" rows={rows} cellClass={cellClass}>
              {(r) => <span className="text-ink-100">{r.aliceBit}</span>}
            </Row>
            <Row label="Alice báze" rows={rows} cellClass={cellClass}>
              {(r) => <span className="text-ink-200">{r.aliceBasis}</span>}
            </Row>
            <Row label="Foton" rows={rows} cellClass={cellClass}>
              {(r) => <span className="text-ink-100 text-[14px]">{r.photon}</span>}
            </Row>
            {eavesdrop && (
              <>
                <Row label="Eva báze" rows={rows} cellClass={cellClass}>
                  {(r) => <span className="text-ink-400">{r.eveBasis}</span>}
                </Row>
                <Row label="Eva měření" rows={rows} cellClass={cellClass}>
                  {(r) => <span className="text-ink-400">{r.eveBit}</span>}
                </Row>
              </>
            )}
            <Row label="Bob báze" rows={rows} cellClass={cellClass}>
              {(r) => <span className="text-ink-200">{r.bobBasis}</span>}
            </Row>
            <Row label="Bob měření" rows={rows} cellClass={cellClass}>
              {(r) => <span className="text-ink-100">{r.bobBit}</span>}
            </Row>
            <Row label="Shoda bází" rows={rows} cellClass={cellClass}>
              {(r) =>
                r.match ? (
                  <span className="text-ink-100">✓</span>
                ) : (
                  <span className="text-ink-500">—</span>
                )
              }
            </Row>
            <Row label="Klíč" rows={rows} cellClass={cellClass}>
              {(r) =>
                r.match ? (
                  <span
                    className={
                      r.error
                        ? 'text-ink-100 font-semibold'
                        : 'text-ink-100 font-semibold'
                    }
                  >
                    {r.bobBit}
                  </span>
                ) : (
                  <span className="text-ink-500">·</span>
                )
              }
            </Row>
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className={ui.panel}>
          <div className={ui.label}>Prosévání</div>
          <div className="font-mono text-[13px] text-ink-100">
            Z {n} bitů zbylo {k} po prosévání
          </div>
          <div className={ui.monoMuted}>
            (báze se shodly u {k} z {n})
          </div>
        </div>
        <div className={ui.panel}>
          <div className={ui.label}>Chyba v klíči</div>
          <div className="font-mono text-[13px] text-ink-100">
            {errors} z {k} bitů ({k > 0 ? errPct.toFixed(1) : '—'} %)
          </div>
          <div className={ui.monoMuted}>
            {eavesdrop
              ? 'odposlech ≈ 25 % chybovost'
              : 'bez odposlechu ≈ 0 %'}
          </div>
        </div>
        <div className={ui.panel}>
          <div className={ui.label}>Sdílený klíč (Alice)</div>
          <div className="font-mono text-[13px] text-ink-100 break-all">
            {keyStr || <span className="text-ink-500">—</span>}
          </div>
          <div className={ui.monoMuted}>
            {k} {k === 1 ? 'bit' : 'bitů'}
          </div>
        </div>
      </div>

      <p className="text-[12.5px] font-sans text-ink-400 leading-relaxed">
        Sloupce se shodnou bází tvoří prosévaný klíč (světlejší podklad);
        sloupce, kde Bob naměřil jiný bit než Alice odeslala přesto, že báze
        souhlasí, prozrazují odposlech (růžový podklad). Odhalení Evy:
        obětováním <span className="font-mono">m</span> bitů k veřejnému
        porovnání odhalíme soustavný odposlech s pravděpodobností{' '}
        <span className="font-mono">1 − (3/4)<sup>m</sup></span>.
      </p>
    </div>
  )
}

function Row({
  label,
  rows,
  cellClass,
  children,
}: {
  label: string
  rows: Row[]
  cellClass: (r: Row, base?: string) => string
  children: (r: Row) => React.ReactNode
}) {
  return (
    <tr>
      <td className="text-[11px] tracking-[0.16em] uppercase text-ink-500 font-sans py-1 pr-3 border-b border-ink-800 whitespace-nowrap">
        {label}
      </td>
      {rows.map((r, i) => (
        <td
          key={i}
          className={cellClass(
            r,
            'text-center py-1 px-1.5 border-b border-ink-800',
          )}
        >
          {children(r)}
        </td>
      ))}
    </tr>
  )
}
