import { useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Grid, KeyValue, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { aesEncryptBlock, aesRoundKeys, bytesToHex, sha256 } from './lib/symmetric'
import './widgets-c.css'

// ECB × CBC na obrázku: proč ECB prozradí tvar a CBC ne.
// Obrázek 16 × 12 pixelů, 1 blok = 2 pixely vedle sebe (16 bajtů, pixel = 8 bajtů 00/ff), šifra AES-128.
// Barva bloku ŠT = první dva bajty šifrového bloku; stejné bloky ŠT mají stejnou barvu.

const W = 16
const H = 12
const PX = 2 // pixelů na blok
const BLOCKS = (W / PX) * H

const SMILEY = [
  '0000000000000000',
  '0000111111110000',
  '0001100000011000',
  '0011000000001100',
  '0011011001101100',
  '0011011001101100',
  '0011000000001100',
  '0011010000101100',
  '0011001111001100',
  '0001100000011000',
  '0000111111110000',
  '0000000000000000',
].join('')
const STRIPES = Array.from({ length: H }, (_, r) => (Math.floor(r / 2) % 2 ? '1' : '0').repeat(W)).join('')
const EMPTY = '0'.repeat(W * H)

type State = { img: string; seed: number }

const PRESETS = [
  { label: 'Smajlík', values: { img: SMILEY } },
  { label: 'Pruhy', values: { img: STRIPES }, note: 'Každý řádek tvoří 8 stejných bloků, takže ECB pruhy zachová dokonale.' },
  { label: 'Prázdný', values: { img: EMPTY }, note: 'Jednobarevná plocha: v ECB je všech 96 bloků ŠT stejných, v CBC je každý jiný.' },
] as const

/** Klíč a IV pro AES odvozené z čísla („Náhodně“ = jiný klíč a IV). */
function keyMaterial(seed: number) {
  const h = sha256(Array.from(new TextEncoder().encode(`klic-${seed}`)))
  return { key: h.slice(0, 16), iv: h.slice(16, 32) }
}

/** Blok b (0…47) → 16 bajtů OT. */
function blockBytes(img: string, b: number): number[] {
  const out: number[] = []
  for (let j = 0; j < PX; j++) {
    const v = img[b * PX + j] === '1' ? 0xff : 0x00
    for (let k = 0; k < 16 / PX; k++) out.push(v)
  }
  return out
}

function encryptImage(img: string, seed: number) {
  const { key, iv } = keyMaterial(seed)
  const rk = aesRoundKeys(key)
  const pts = Array.from({ length: BLOCKS }, (_, b) => blockBytes(img, b))
  const ecb = pts.map((p) => aesEncryptBlock(p, rk))
  let prev = iv
  const cbc = pts.map((p) => {
    prev = aesEncryptBlock(
      p.map((x, i) => x ^ prev[i]!),
      rk,
    )
    return prev
  })
  const distinct = (xs: number[][]) => new Set(xs.map(bytesToHex)).size
  return { ecb, cbc, nPt: distinct(pts), nEcb: distinct(ecb), nCbc: distinct(cbc) }
}

/** Rozložení (počet bloků na řádek, pixelů v bloku) — jen mřížka, žádné barvy. */
const GRID = { gridTemplateColumns: `repeat(${W / PX}, 1fr)` }
const BLK = { gridTemplateColumns: `repeat(${PX}, 1fr)` }

const LEVELS = 10
const HUES = ['--ink', '--acc', '--ok', '--warn', '--bad'] as const
/** Barva bloku ŠT z jeho bajtů (odstín z c[1], sytost z c[0]) — jen míchání tokenů, žádné vlastní barvy. */
const shade = (c: number[]) => `color-mix(in oklab, var(${HUES[c[1]! % HUES.length]}) ${20 + Math.floor((c[0]! * LEVELS) / 256) * 7}%, var(--bg-2))`

/* ------------------------------------------------------------------ */

function Picture({ label, sub, blocks }: { label: string; sub: string; blocks: number[][] }) {
  return (
    <figure className="ix-ecb-fig">
      <figcaption className="ix-ecb-cap">
        <b>{label}</b> <span>{sub}</span>
      </figcaption>
      <div className="ix-ecb-img" style={GRID} role="img" aria-label={`Obrázek zašifrovaný v módu ${label}`}>
        {blocks.map((c, b) => (
          <span key={b} className="ix-ecb-blk" style={BLK}>
            {Array.from({ length: PX }, (_, j) => (
              <span key={j} className="ix-ecb-px" style={{ background: shade(c) }} />
            ))}
          </span>
        ))}
      </div>
    </figure>
  )
}

function Canvas({ img, onChange }: { img: string; onChange: (img: string) => void }) {
  const [focus, setFocus] = useState(0)
  const paint = useRef<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const latest = useRef(img)
  latest.current = img

  const setPx = (i: number, v: string) => {
    const cur = latest.current
    if (cur[i] === v) return
    const next = cur.slice(0, i) + v + cur.slice(i + 1)
    latest.current = next
    onChange(next)
  }
  const idxAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null
    if (!el || !ref.current?.contains(el)) return -1
    const d = el.closest<HTMLElement>('[data-px]')?.dataset.px
    return d === undefined ? -1 : Number(d)
  }
  const onDown = (e: PointerEvent) => {
    const i = idxAt(e.clientX, e.clientY)
    if (i < 0) return
    paint.current = latest.current[i] === '1' ? '0' : '1'
    setPx(i, paint.current)
    setFocus(i)
    ref.current?.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (paint.current === null) return
    const i = idxAt(e.clientX, e.clientY)
    if (i >= 0) setPx(i, paint.current)
  }
  const onUp = () => {
    paint.current = null
  }
  const onKey = (e: KeyboardEvent) => {
    const d = ({ ArrowRight: 1, ArrowLeft: -1, ArrowDown: W, ArrowUp: -W } as Record<string, number>)[e.key]
    if (d === undefined) return
    e.preventDefault()
    e.stopPropagation()
    const n = focus + d
    if (n < 0 || n >= W * H || (Math.abs(d) === 1 && Math.floor(n / W) !== Math.floor(focus / W))) return
    setFocus(n)
    ref.current?.querySelector<HTMLElement>(`[data-px="${n}"]`)?.focus()
  }

  return (
    <figure className="ix-ecb-fig">
      <figcaption className="ix-ecb-cap">
        <b>Otevřený text</b> <span>klikejte a tahejte</span>
      </figcaption>
      <div
        ref={ref}
        className="ix-ecb-img ix-ecb-canvas"
        style={GRID}
        role="group"
        aria-label="Obrázek 16 × 12 pixelů; šipky přesouvají, mezerník přepne pixel"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        {Array.from({ length: BLOCKS }, (_, b) => (
          <span key={b} className="ix-ecb-blk" style={BLK}>
            {Array.from({ length: PX }, (_, j) => {
              const i = b * PX + j
              const on = img[i] === '1'
              return (
                <button
                  key={j}
                  type="button"
                  data-px={i}
                  className="ix-ecb-px ix-ecb-btn"
                  data-on={on || undefined}
                  tabIndex={i === focus ? 0 : -1}
                  aria-pressed={on}
                  aria-label={`Pixel ${(i % W) + 1}, ${Math.floor(i / W) + 1}`}
                  onClick={(e) => {
                    // myš/prst obsloužil pointerdown; klávesnice (detail = 0) přepíná tady
                    if (e.detail === 0) setPx(i, on ? '0' : '1')
                  }}
                  onFocus={() => setFocus(i)}
                />
              )
            })}
          </span>
        ))}
      </div>
    </figure>
  )
}

export function ECBvsCBC({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ img: SMILEY, seed: 7 }, PRESETS)
  const { img, seed } = st.value
  const r = useMemo(() => encryptImage(img, seed), [img, seed])

  return (
    <Widget
      title={title ?? 'ECB vs. CBC na obrázku'}
      lead={lead ?? 'Kreslete do levého obrázku a porovnejte, co z tvaru zbude po zašifrování v ECB a v CBC.'}
      {...st.widget}
      onRandom={() => st.set({ seed: 1 + Math.floor(Math.random() * 1e6) })}
      footer={
        <p>
          Každý blok (2 pixely vedle sebe = 16 bajtů) se šifruje AES-128 a barva bloku ŠT je odvozená z jeho prvních dvou bajtů. ECB zobrazí stejný
          blok OT vždy na stejný blok ŠT, takže tvar zůstane vidět, i když jsou barvy „náhodné“. CBC před šifrováním přiXORuje předchozí ŠT, takže
          každý blok vyjde jinak. „Náhodně“ zvolí jiný klíč a IV.
        </p>
      }
    >
      <Grid min={180}>
        <Canvas img={img} onChange={(v) => st.set({ img: v })} />
        <Picture label="ECB" sub="ŠTᵢ = E(OTᵢ)" blocks={r.ecb} />
        <Picture label="CBC" sub="ŠTᵢ = E(OTᵢ ⊕ ŠTᵢ₋₁)" blocks={r.cbc} />
      </Grid>

      <KeyValue
        cols={3}
        items={[
          { k: 'Různých bloků OT', v: `${r.nPt} z ${BLOCKS}` },
          { k: 'Různých bloků ŠT v ECB', v: `${r.nEcb} z ${BLOCKS}`, tone: r.nEcb < BLOCKS ? 'warn' : undefined },
          { k: 'Různých bloků ŠT v CBC', v: `${r.nCbc} z ${BLOCKS}`, tone: r.nCbc === BLOCKS ? 'ok' : undefined },
        ]}
      />

      {r.nPt < BLOCKS ? (
        <Verdict kind="warn" title={`ECB: ${r.nPt} různých bloků OT ⇒ jen ${r.nEcb} různých bloků ŠT`}>
          Opakující se bloky obrázku dají opakující se bloky šifrového textu, proto je tvar vidět. V CBC je různých všech {r.nCbc} bloků.
        </Verdict>
      ) : (
        <Verdict kind="info" title="Žádný blok OT se neopakuje">
          Pak ani ECB nemá co prozradit — nakreslete plochu, kde se stejná dvojice pixelů opakuje.
        </Verdict>
      )}
    </Widget>
  )
}
