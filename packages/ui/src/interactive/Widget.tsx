'use client'

import { useCallback, useId, useMemo, useState, type ReactNode } from 'react'
import { IxIcon } from './icons'
import { cx } from './util'

/* ------------------------------------------------------------------ */
/* Předvolby                                                           */
/* ------------------------------------------------------------------ */

/** Jedna předvolba widgetu. `values` přepíše jen uvedené klíče stavu. */
export type Preset<T> = {
  label: string
  values: Partial<T>
  /** Jedna věta: co je na tomhle případu zajímavé. Ukáže se pod tlačítky. */
  note?: ReactNode
}

/** Props, které `usePresetState` připraví pro `<Widget>` (stačí je rozbalit `{...st.widget}`). */
export type WidgetPresetProps = {
  presets?: readonly { label: string; note?: ReactNode }[]
  activePreset?: number
  onPreset?: (index: number) => void
  onReset?: () => void
}

function shallowMatch<T extends object>(state: T, patch: Partial<T>): boolean {
  for (const k in patch) {
    const a = state[k as keyof T]
    const b = patch[k as keyof T]
    if (a === b) continue
    // pole a jednoduché objekty (matice, seznamy) porovnáme hodnotou
    if (typeof a === 'object' && typeof b === 'object' && JSON.stringify(a) === JSON.stringify(b)) continue
    return false
  }
  return true
}

/**
 * Stav widgetu s předvolbami. `initial` = příklad z přednášky (výchozí stav i cíl tlačítka „Obnovit“).
 *
 * ```tsx
 * const st = usePresetState({ text: 'UTOK ZA USVITU', k: 3 }, [
 *   { label: 'Příklad z přednášky', values: { text: 'UTOK ZA USVITU', k: 3 } },
 *   { label: 'ROT13', values: { k: 13 }, note: 'Šifrování a dešifrování je totéž.' },
 * ])
 * <Widget title="Caesar" lead="…" {...st.widget}>…</Widget>
 * ```
 */
export function usePresetState<T extends object>(initial: T, presets: readonly Preset<T>[] = []) {
  const [value, setValue] = useState<T>(initial)
  const set = useCallback((patch: Partial<T> | ((prev: T) => Partial<T>)) => {
    setValue((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }, [])
  const apply = useCallback(
    (i: number) => {
      const p = presets[i]
      if (p) setValue((prev) => ({ ...prev, ...p.values }))
    },
    [presets],
  )
  const reset = useCallback(() => setValue(initial), [initial])
  const active = useMemo(() => presets.findIndex((p) => shallowMatch(value, p.values)), [presets, value])
  const widget: WidgetPresetProps = {
    presets: presets.length ? presets : undefined,
    activePreset: active,
    onPreset: apply,
    onReset: reset,
  }
  return { value, set, apply, reset, active, widget }
}

/* ------------------------------------------------------------------ */
/* Rámec                                                               */
/* ------------------------------------------------------------------ */

export type WidgetProps = WidgetPresetProps & {
  /** Krátký název (2–5 slov), např. „Caesarova šifra“. */
  title: ReactNode
  /** Jedna věta: co si vyzkoušet / co uvidíš. */
  lead?: ReactNode
  /** Tlačítko „Náhodně“ vedle předvoleb. */
  onRandom?: () => void
  /** Pravý okraj hlavičky (např. přepínač režimu). Nepřeplňovat. */
  actions?: ReactNode
  /** Vysvětlení pod tělem („Čeho si všimnout“). */
  footer?: ReactNode
  /** Nadpis patičky; výchozí „Čeho si všimnout“. */
  footerTitle?: ReactNode
  /** Úroveň nadpisu pro čtečky (vizuálně se nemění). Výchozí 3. */
  level?: 2 | 3 | 4 | 5 | 6
  id?: string
  className?: string
  children: ReactNode
}

/**
 * Rámec každého interaktivního widgetu: hlavička s názvem a „Obnovit“, úvodní věta, předvolby, tělo, patička.
 * Není sbalitelný — widget je součást výkladu, ne příloha.
 */
export function Widget({
  title,
  lead,
  presets,
  activePreset = -1,
  onPreset,
  onRandom,
  onReset,
  actions,
  footer,
  footerTitle = 'Čeho si všimnout',
  level = 3,
  id,
  className,
  children,
}: WidgetProps) {
  const autoId = useId()
  const titleId = `${id ?? autoId}-t`
  const note = presets && activePreset >= 0 ? presets[activePreset]?.note : undefined
  const showPresets = (presets && presets.length > 0) || onRandom
  return (
    <section className={cx('ix-widget', className)} id={id} aria-labelledby={titleId} data-ix-widget="">
      <header className="ix-head">
        <IxIcon name="lab" className="ix-head-ic" />
        <div className="ix-title" role="heading" aria-level={level} id={titleId}>
          {title}
        </div>
        <div className="ix-head-a">
          {actions}
          {onReset && (
            <button type="button" className="ix-btn ix-btn-ghost ix-btn-sm" onClick={onReset} title="Vrátit příklad z přednášky">
              <IxIcon name="reset" />
              <span className="ix-hide-xs">Obnovit</span>
              <span className="ix-sr">Obnovit výchozí příklad</span>
            </button>
          )}
        </div>
      </header>
      <div className="ix-body">
        {lead && <p className="ix-lead">{lead}</p>}
        {showPresets && (
          <div className="ix-presets">
            <div className="ix-presets-row" role="group" aria-label="Příklady">
              <span className="ix-presets-l" aria-hidden="true">
                Příklad
              </span>
              {presets?.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  className="ix-chip"
                  aria-pressed={i === activePreset}
                  onClick={() => onPreset?.(i)}
                >
                  {p.label}
                </button>
              ))}
              {onRandom && (
                <button type="button" className="ix-chip ix-chip-dashed" onClick={onRandom}>
                  <IxIcon name="shuffle" />
                  Náhodně
                </button>
              )}
            </div>
            {note && (
              <p className="ix-presets-n" aria-live="polite">
                {note}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
      {footer && (
        <footer className="ix-foot">
          <div className="ix-foot-t">{footerTitle}</div>
          <div className="ix-foot-b">{footer}</div>
        </footer>
      )}
    </section>
  )
}
