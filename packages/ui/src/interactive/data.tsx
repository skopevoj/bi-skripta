'use client'

import { Fragment, isValidElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { IxIcon } from './icons'
import { cx, type Tone, type VerdictKind } from './util'

/** Posune vodorovně posuvný kontejner tak, aby byl prvek `[data-ix-col=…]` vidět (stránku nehýbe). */
function useScrollToCol(col: number | null | undefined) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = ref.current
    if (!box || col === null || col === undefined || box.scrollWidth <= box.clientWidth) return
    const el = box.querySelector<HTMLElement>(`[data-ix-col="${col}"]`)
    if (!el) return
    const b = box.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const pad = 48
    if (r.left < b.left + pad) box.scrollLeft -= b.left + pad - r.left
    else if (r.right > b.right - pad) box.scrollLeft += r.right - (b.right - pad)
  }, [col])
  return ref
}

/* ------------------------------------------------------------------ */
/* Buňky                                                               */
/* ------------------------------------------------------------------ */

export type Cell = {
  v: ReactNode
  /** active = právě zpracovávaná (rámeček v akcentu), changed = změnila se (tečka + podbarvení),
   *  ok / bad / warn = výsledek (ikona v rohu), dim = nehraje roli. */
  tone?: Tone
  /** Malý popisek nad hodnotou (index, souřadnice, „před“…). */
  sub?: ReactNode
  /** Tooltip / delší popis pro čtečky. */
  title?: string
}
export type CellInput = Cell | string | number

const toCell = (c: CellInput): Cell => (typeof c === 'object' && c !== null && !isValidElement(c) ? (c as Cell) : { v: c as ReactNode })

const TONE_SR: Partial<Record<Tone, string>> = { changed: 'změněno', ok: 'v pořádku', bad: 'chyba', warn: 'pozor', active: 'aktuální' }

export type CellsProps = {
  items: readonly CellInput[]
  /** Počet sloupců mřížky; bez něj jeden řádek (posouvá se uvnitř, nebo `wrap`). */
  cols?: number
  /** Položky jsou uložené po sloupcích (AES stav: index = sloupec·4 + řádek). */
  columnMajor?: boolean
  /** Zalamovat do více řádků místo vodorovného posunu. */
  wrap?: boolean
  size?: 'sm' | 'md' | 'lg'
  /** Klikací buňky (výběr pro detail). */
  onSelect?: (index: number) => void
  selected?: number | null
  /** Popisek pro čtečky (a vizuálně nad buňkami, když `label`). */
  label?: ReactNode
  ariaLabel?: string
  className?: string
}

/**
 * Řada / mřížka hodnot (písmena, bajty, čísla). Stav buňky = `tone`; změna se ukazuje i tvarem (tečka), ne jen barvou.
 * Široké řady se posouvají uvnitř, stránka nikdy.
 */
export function Cells({ items, cols, columnMajor, wrap, size = 'md', onSelect, selected, label, ariaLabel, className }: CellsProps) {
  const n = items.length
  const rows = cols ? Math.ceil(n / cols) : 1
  // pořadí vykreslení (u columnMajor přeskládáme do řádků)
  const order: number[] = []
  if (cols && columnMajor) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = c * rows + r
      if (i < n) order.push(i)
    }
  } else for (let i = 0; i < n; i++) order.push(i)

  const scrollRef = useScrollToCol(selected)
  const style: CSSProperties | undefined = cols ? { gridTemplateColumns: `repeat(${cols}, minmax(var(--ix-cell-w), 1fr))` } : undefined
  const grid = (
    <div
      className={cx('ix-cells', `ix-cells-${size}`, cols ? 'ix-cells-grid' : wrap ? 'ix-cells-wrap' : 'ix-cells-row')}
      style={style}
      role={onSelect ? 'group' : 'list'}
      aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}
    >
      {order.map((i) => {
        const c = toCell(items[i]!)
        const sel = selected === i
        const inner = (
          <>
            {c.sub !== undefined && <span className="ix-cell-sub">{c.sub}</span>}
            <span className="ix-cell-v">{c.v}</span>
            {c.tone && TONE_SR[c.tone] && <span className="ix-sr">({TONE_SR[c.tone]})</span>}
          </>
        )
        const cls = cx('ix-cell', c.tone && `ix-t-${c.tone}`, sel && 'ix-cell-sel')
        return onSelect ? (
          <button key={i} type="button" className={cls} data-ix-col={i} aria-pressed={sel} title={c.title} onClick={() => onSelect(i)}>
            {inner}
          </button>
        ) : (
          <span key={i} role="listitem" className={cls} title={c.title}>
            {inner}
          </span>
        )
      })}
    </div>
  )
  return (
    <div className={cx('ix-cells-w', className)}>
      {label && <div className="ix-cap">{label}</div>}
      <div className="ix-scroll" ref={scrollRef}>
        {grid}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Bajty                                                               */
/* ------------------------------------------------------------------ */

export const hex2 = (b: number) => (b & 0xff).toString(16).padStart(2, '0')

export type ByteGridProps = Omit<CellsProps, 'items' | 'cols'> & {
  bytes: readonly number[]
  /** Předchozí stav — změněné bajty dostanou tón `changed`. */
  prev?: readonly number[]
  /** Výchozí 4 (AES stav 4×4). */
  cols?: number
  /** Formát bajtu (výchozí hex „0a“). */
  format?: (b: number, i: number) => ReactNode
  /** Vlastní tón pro bajt (přebije `changed`). */
  tone?: (i: number) => Tone | undefined
  /** Popisek nad bajtem (např. „před“ hodnota). */
  sub?: (i: number) => ReactNode
}

/** Mřížka bajtů s automatickým rozdílem proti `prev`. Pro AES stav: `cols={4} columnMajor`. */
export function ByteGrid({ bytes, prev, cols = 4, format = hex2, tone, sub, ...rest }: ByteGridProps) {
  const items: Cell[] = bytes.map((b, i) => ({
    v: format(b, i),
    tone: tone?.(i) ?? (prev && prev[i] !== undefined && prev[i] !== b ? 'changed' : undefined),
    sub: sub?.(i),
  }))
  return <Cells items={items} cols={cols} {...rest} />
}

/* ------------------------------------------------------------------ */
/* Bity                                                                */
/* ------------------------------------------------------------------ */

export type BitRowProps = {
  /** „0110…“, nebo pole 0/1/boolean. */
  bits: string | readonly (number | boolean)[]
  /** Porovnat s jinými bity: rozdílné bity se zvýrazní (lavinový efekt). */
  compare?: string | readonly (number | boolean)[]
  /** Mezera po každých N bitech (výchozí 8; 0 = bez mezer). */
  group?: number
  /** Ruční tón pro bit. */
  tone?: (i: number) => Tone | undefined
  label?: ReactNode
  /** Zobrazit počet rozdílných bitů vpravo. */
  showDiffCount?: boolean
  className?: string
}

const toBits = (b: string | readonly (number | boolean)[]) =>
  typeof b === 'string' ? b.replace(/[^01]/g, '').split('').map((c) => c === '1') : b.map((x) => !!x)

/** Řada bitů (kompaktní, mono). Rozdíly proti `compare` jsou zvýrazněné a spočítané. */
export function BitRow({ bits, compare, group = 8, tone, label, showDiffCount, className }: BitRowProps) {
  const a = toBits(bits)
  const b = compare ? toBits(compare) : null
  let diff = 0
  const out: ReactNode[] = []
  a.forEach((bit, i) => {
    const d = b ? b[i] !== bit : false
    if (d) diff++
    const t = tone?.(i) ?? (d ? 'changed' : undefined)
    if (group && i > 0 && i % group === 0) out.push(<span key={`g${i}`} className="ix-bit-gap" aria-hidden="true" />)
    out.push(
      <span key={i} className={cx('ix-bit', t && `ix-t-${t}`)}>
        {bit ? 1 : 0}
      </span>,
    )
  })
  return (
    <div className={cx('ix-bits-w', className)}>
      {(label || (showDiffCount && b)) && (
        <div className="ix-cap ix-cap-row">
          <span>{label}</span>
          {showDiffCount && b && (
            <span className="ix-cap-v">
              {diff} / {a.length} bitů jinak ({Math.round((diff / Math.max(1, a.length)) * 100)} %)
            </span>
          )}
        </div>
      )}
      <div className="ix-scroll">
        <div className="ix-bits">{out}</div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Řádky buněk zarovnané do sloupců                                    */
/* ------------------------------------------------------------------ */

export type CellRowsProps = {
  /** Řádky: popisek vlevo + buňky. Všechny řádky by měly mít stejný počet buněk. */
  rows: readonly { label: ReactNode; cells: readonly CellInput[]; muted?: boolean }[]
  /** Záhlaví sloupců (např. indexy 0…25). */
  head?: readonly ReactNode[]
  /** Zvýrazněný sloupec (např. vybrané písmeno). */
  activeCol?: number | null
  /** Klik na sloupec (výběr písmena / pozice). */
  onColSelect?: (col: number) => void
  ariaLabel?: string
  className?: string
}

/**
 * Několik řádků zarovnaných pod sebou (abeceda OT → ŠT, protokol BB84 bit po bitu, Vigenère klíč pod textem).
 * Popisky řádků zůstávají při posunu vidět.
 */
export function CellRows({ rows, head, activeCol, onColSelect, ariaLabel, className }: CellRowsProps) {
  const cols = Math.max(head?.length ?? 0, ...rows.map((r) => r.cells.length))
  const scrollRef = useScrollToCol(activeCol)
  return (
    <div className={cx('ix-scroll', className)} ref={scrollRef}>
      <table className="ix-crows" aria-label={ariaLabel}>
        {head && (
          <thead>
            <tr>
              <th scope="col" className="ix-crows-l">
                <span className="ix-sr">Řádek</span>
              </th>
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} scope="col" data-ix-col={c} className={cx(activeCol === c && 'ix-crows-on')}>
                  {head[c]}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className={cx(r.muted && 'ix-crows-muted')}>
              <th scope="row" className="ix-crows-l">
                {r.label}
              </th>
              {Array.from({ length: cols }, (_, c) => {
                const raw = r.cells[c]
                const cell = raw === undefined ? { v: '' } : toCell(raw)
                const cls = cx('ix-crows-c', cell.tone && `ix-t-${cell.tone}`, activeCol === c && 'ix-crows-on')
                return (
                  <td key={c} className={cls} title={cell.title} data-ix-col={!head && ri === 0 ? c : undefined}>
                    {onColSelect && ri === 0 ? (
                      <button type="button" className="ix-crows-btn" aria-pressed={activeCol === c} onClick={() => onColSelect(c)}>
                        {cell.v}
                      </button>
                    ) : (
                      cell.v
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* TraceTable                                                          */
/* ------------------------------------------------------------------ */

export type TraceColumn<R> = {
  key: string
  label: ReactNode
  /** Vlastní vykreslení buňky; výchozí `row[key]`. */
  render?: (row: R, index: number) => ReactNode
  align?: 'left' | 'right' | 'center'
  /** Výchozí true — čísla v mono písmu. */
  mono?: boolean
  /** Zvýraznit hodnotu, pokud se proti předchozímu řádku změnila. */
  diff?: boolean
}

export type TraceTableProps<R> = {
  columns: readonly TraceColumn<R>[]
  rows: readonly R[]
  /** Aktuální řádek (zvýrazněný). Řádky za ním se řídí `future`. */
  current?: number
  /** Co s řádky, které algoritmus ještě nespočítal: `blank` (výchozí — místo drží, hodnoty skryté), `dim`, `show`, `hide`. */
  future?: 'blank' | 'dim' | 'show' | 'hide'
  /** Klik na řádek = skok na krok. */
  onRowClick?: (index: number) => void
  /** Tón celého řádku (např. výsledek). */
  rowTone?: (row: R, index: number) => Tone | undefined
  caption?: ReactNode
  className?: string
}

/** Tabulka průběhu algoritmu (Eukleides, square-and-multiply…). Aktuální řádek je zvýrazněný a dá se na řádky klikat. */
export function TraceTable<R extends object>({ columns, rows, current, future = 'blank', onRowClick, rowTone, caption, className }: TraceTableProps<R>) {
  const cur = current ?? rows.length - 1
  const visible = future === 'hide' ? rows.slice(0, cur + 1) : rows
  const val = (r: R, c: TraceColumn<R>, i: number): ReactNode => (c.render ? c.render(r, i) : ((r as Record<string, unknown>)[c.key] as ReactNode))
  return (
    <div className={cx('ix-scroll', className)}>
      <table className={cx('ix-trace', onRowClick && 'ix-trace-click')}>
        {caption && <caption className="ix-cap">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" style={{ textAlign: c.align ?? 'right' }}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((r, i) => {
            const isFuture = current !== undefined && i > cur
            const t = rowTone?.(r, i)
            return (
              <tr
                key={i}
                className={cx(i === cur && current !== undefined && 'ix-trace-cur', isFuture && `ix-trace-${future}`, t && `ix-t-${t}`)}
                aria-current={i === cur && current !== undefined ? 'step' : undefined}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
              >
                {columns.map((c) => {
                  const v = val(r, c, i)
                  const prev = i > 0 ? val(rows[i - 1]!, c, i - 1) : undefined
                  const changed = c.diff && i > 0 && !isFuture && (typeof v === 'string' || typeof v === 'number') && v !== prev
                  return (
                    <td key={c.key} className={cx(c.mono !== false && 'ix-mono', changed && 'ix-trace-chg')} style={{ textAlign: c.align ?? 'right' }}>
                      {isFuture && future === 'blank' ? <span className="ix-trace-ph">·</span> : v}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* KeyValue                                                            */
/* ------------------------------------------------------------------ */

export type KeyValueItem = { k: ReactNode; v: ReactNode; hint?: ReactNode; tone?: Tone }

/** Přehled pojmenovaných hodnot (n = 143, φ(n) = 120, d = 103…). */
export function KeyValue({ items, cols, className }: { items: readonly KeyValueItem[]; /** Max. sloupců na široké obrazovce. */ cols?: 1 | 2 | 3 | 4; className?: string }) {
  return (
    <dl className={cx('ix-kv', cols && `ix-kv-${cols}`, className)}>
      {items.map((it, i) => (
        <div key={i} className={cx('ix-kv-i', it.tone && `ix-t-${it.tone}`)}>
          <dt>{it.k}</dt>
          <dd>
            <span className="ix-mono">{it.v}</span>
            {it.hint && <span className="ix-kv-h">{it.hint}</span>}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/* ------------------------------------------------------------------ */
/* Formula                                                             */
/* ------------------------------------------------------------------ */

export type FormulaProps = {
  /** Řetěz výrazů: obecný vzorec → dosazené hodnoty → … Mezi ně se vloží `rel`. */
  steps: readonly ReactNode[]
  /** Výsledek (zvýrazněný, poslední článek řetězu). */
  result?: ReactNode
  /** Vztah mezi články (výchozí „=“; např. „≡“). */
  rel?: ReactNode
  /** Dovětek za výsledkem, např. „(mod 26)“. */
  suffix?: ReactNode
  /** Popisek vlevo / nad vzorcem. */
  label?: ReactNode
  className?: string
}

/**
 * Vzorec s dosazenými hodnotami: `c = 3·7 + 5 = 26 ≡ 0 (mod 26)`.
 * Články mohou být text nebo `<Tex>` z `@skripta/ui/math`.
 */
export function Formula({ steps, result, rel = '=', suffix, label, className }: FormulaProps) {
  return (
    <div className={cx('ix-formula', className)}>
      {label && <span className="ix-formula-l">{label}</span>}
      <span className="ix-formula-e">
        {steps.map((s, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="ix-formula-rel">{rel}</span>}
            <span className="ix-formula-s">{s}</span>
          </Fragment>
        ))}
        {result !== undefined && (
          <>
            {steps.length > 0 && <span className="ix-formula-rel">{rel}</span>}
            <b className="ix-formula-r">{result}</b>
          </>
        )}
        {suffix && <span className="ix-formula-x">{suffix}</span>}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Verdict                                                             */
/* ------------------------------------------------------------------ */

const V_ICON = { ok: 'ok', bad: 'bad', warn: 'warn', info: 'info' } as const

export type VerdictProps = {
  kind: VerdictKind
  /** Krátké tvrzení („Prvočíslo“, „Složené — svědek a = 2“). */
  title: ReactNode
  /** Proč (jedna až dvě věty). */
  children?: ReactNode
  className?: string
}

/** Výsledek / stav: ikona + tučný text + vysvětlení. Nikdy jen barva. */
export function Verdict({ kind, title, children, className }: VerdictProps) {
  return (
    <div className={cx('ix-verdict', `ix-verdict-${kind}`, className)} role="status">
      <IxIcon name={V_ICON[kind]} />
      <div>
        <b className="ix-verdict-t">{title}</b>
        {children && <div className="ix-verdict-b">{children}</div>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tag, Panel                                                          */
/* ------------------------------------------------------------------ */

/** Malá hodnota v textu (mono štítek), volitelně s tónem. */
export function Tag({ tone, children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('ix-tag', tone && `ix-t-${tone}`, className)}>{children}</span>
}

export type PanelProps = {
  /** Malý nadpis sekce („Vstup“, „Mapování abecedy“, „Výsledek“). */
  label?: ReactNode
  /** Věc vpravo od nadpisu (počet, přepínač). */
  aside?: ReactNode
  /** soft = šedé pozadí (výsledky), line = rámeček (výchozí), plain = bez rámečku. */
  variant?: 'line' | 'soft' | 'plain'
  className?: string
  children: ReactNode
}

/** Podsekce uvnitř widgetu. Nepoužívat víc než 2–3 na widget — ne všechno musí být v rámečku. */
export function Panel({ label, aside, variant = 'line', className, children }: PanelProps) {
  return (
    <div className={cx('ix-panel', `ix-panel-${variant}`, className)}>
      {(label || aside) && (
        <div className="ix-cap ix-cap-row">
          <span>{label}</span>
          {aside && <span className="ix-cap-v">{aside}</span>}
        </div>
      )}
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Bars                                                                */
/* ------------------------------------------------------------------ */

export type BarsProps = {
  data: readonly { label: ReactNode; value: number; tone?: Tone; title?: string }[]
  /** Druhá řada pro srovnání (např. četnosti v češtině) — vykreslí se jako obrys. */
  compare?: readonly number[]
  compareLabel?: ReactNode
  valueLabel?: ReactNode
  /** Maximum osy (výchozí max z dat). */
  max?: number
  /** Výška sloupců v px (výchozí 120). */
  height?: number
  format?: (v: number) => string
  className?: string
}

/** Jednoduchý sloupcový graf (četnost písmen, rozdělení). Široký graf se posouvá uvnitř. */
export function Bars({ data, compare, compareLabel, valueLabel, max, height = 120, format = (v) => String(Math.round(v * 10) / 10), className }: BarsProps) {
  const m = max ?? Math.max(1e-9, ...data.map((d) => d.value), ...(compare ?? []))
  return (
    <div className={cx('ix-bars-w', className)}>
      {compare && (
        <div className="ix-bars-legend">
          <span>
            <i className="ix-bars-key" /> {valueLabel ?? 'Hodnota'}
          </span>
          <span>
            <i className="ix-bars-key ix-bars-key-c" /> {compareLabel ?? 'Srovnání'}
          </span>
        </div>
      )}
      <div className="ix-scroll">
        <div className="ix-bars" style={{ ['--ix-bars-h' as string]: `${height}px` }} role="list">
          {data.map((d, i) => (
            <div key={i} className={cx('ix-bar', d.tone && `ix-t-${d.tone}`)} role="listitem" title={d.title ?? `${format(d.value)}`}>
              <div className="ix-bar-plot">
                {compare && compare[i] !== undefined && <span className="ix-bar-c" style={{ height: `${(compare[i]! / m) * 100}%` }} />}
                <span className="ix-bar-v" style={{ height: `${(d.value / m) * 100}%` }} />
              </div>
              <span className="ix-bar-l">{d.label}</span>
              <span className="ix-sr">{format(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
