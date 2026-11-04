'use client'

import {
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { IxIcon, type IxIconName } from './icons'
import { cx } from './util'

/* ------------------------------------------------------------------ */
/* Tlačítka                                                            */
/* ------------------------------------------------------------------ */

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  /** primary = jediná hlavní akce widgetu; secondary = běžná; ghost = vedlejší (bez rámečku). */
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  icon?: IxIconName
  /** Ikona za textem (např. „Další ›“). */
  iconEnd?: IxIconName
  children?: ReactNode
}

export function Button({ variant = 'secondary', size = 'md', icon, iconEnd, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx('ix-btn', `ix-btn-${variant}`, size === 'sm' && 'ix-btn-sm', !children && 'ix-btn-icon', className)}
      {...rest}
    >
      {icon && <IxIcon name={icon} />}
      {children}
      {iconEnd && <IxIcon name={iconEnd} />}
    </button>
  )
}

/** Čtvercové tlačítko jen s ikonou. `label` je povinný (aria-label + tooltip). */
export function IconButton({ icon, label, variant = 'ghost', ...rest }: Omit<ButtonProps, 'children' | 'icon'> & { icon: IxIconName; label: string }) {
  return <Button icon={icon} variant={variant} aria-label={label} title={label} {...rest} />
}

/* ------------------------------------------------------------------ */
/* Pole s popiskem                                                     */
/* ------------------------------------------------------------------ */

export type FieldProps = {
  label: ReactNode
  /** Krátká nápověda pod polem (šedě). Skryje se, když je chyba. */
  hint?: ReactNode
  /** Chybová hláška: co je špatně a co změnit („a = 4 není nesoudělné s 26, zkus 5“). */
  error?: ReactNode
  /** Hodnota vpravo od popisku (např. u slideru). */
  value?: ReactNode
  htmlFor?: string
  className?: string
  children: ReactNode
}

/** Popisek + ovládací prvek + nápověda/chyba. Používají ho všechna pole kitu; lze použít i pro vlastní prvky. */
export function Field({ label, hint, error, value, htmlFor, className, children }: FieldProps) {
  const id = useId()
  return (
    <div className={cx('ix-field', !!error && 'ix-field-err', className)}>
      <div className="ix-field-h">
        <label className="ix-label" htmlFor={htmlFor} id={`${id}-l`}>
          {label}
        </label>
        {value !== undefined && <span className="ix-field-v">{value}</span>}
      </div>
      {children}
      {error ? (
        <p className="ix-msg ix-msg-bad" role="alert">
          <IxIcon name="warn" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p className="ix-msg">{hint}</p>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Číslo                                                               */
/* ------------------------------------------------------------------ */

export type NumberFieldProps = {
  label: ReactNode
  value: number
  /** Volá se jen s platným číslem v rozsahu min…max. Mimo rozsah se ukáže hláška a hodnota se nepropíše. */
  onChange: (n: number) => void
  min?: number
  max?: number
  step?: number
  /** Povolit desetinná čísla (výchozí jen celá). */
  decimal?: boolean
  /** Doménová chyba z widgetu (hodnota je v rozsahu, ale nedává smysl). */
  error?: ReactNode
  hint?: ReactNode
  /** Schovat tlačítka −/+ (např. v matici). */
  noStepper?: boolean
  /** Šířka vstupu ve znacích (výchozí podle max). */
  chars?: number
  /** Volá se s hláškou, když je rozepsaný vstup neplatný (a s `null`, když je zase v pořádku). */
  onInvalid?: (message: string | null) => void
  id?: string
  className?: string
}

/**
 * Celé číslo s tlačítky −/+. Uživatel může psát volně; neplatný mezistav se nepropíše,
 * ale zobrazí se pod polem vysvětlení — nikdy se tiše neořezává.
 */
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  decimal = false,
  error,
  hint,
  noStepper,
  chars,
  onInvalid,
  id,
  className,
}: NumberFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const [raw, setRaw] = useState(String(value))
  const [local, setLocal] = useState<string | null>(null)

  // synchronizace zvenku (předvolba, reset)
  useEffect(() => {
    setRaw((r) => (Number(r) === value && r.trim() !== '' ? r : String(value)))
    setLocal(null)
  }, [value])

  const check = (s: string): { n?: number; msg?: string } => {
    const t = s.trim().replace(',', '.')
    if (t === '' || t === '-') return { msg: 'Zadej číslo.' }
    const n = Number(t)
    if (!Number.isFinite(n)) return { msg: `„${s}“ není číslo.` }
    if (!decimal && !Number.isInteger(n)) return { msg: 'Zadej celé číslo.' }
    if (min !== undefined && n < min) return { msg: max !== undefined ? `Zadej číslo od ${min} do ${max}.` : `Nejmenší povolená hodnota je ${min}.` }
    if (max !== undefined && n > max) return { msg: min !== undefined ? `Zadej číslo od ${min} do ${max}.` : `Největší povolená hodnota je ${max}.` }
    return { n }
  }

  const commit = (s: string) => {
    setRaw(s)
    const r = check(s)
    setLocal(r.msg ?? null)
    onInvalid?.(r.msg ?? null)
    if (r.n !== undefined && r.n !== value) onChange(r.n)
  }

  const bump = (dir: 1 | -1) => {
    const base = check(raw).n ?? value
    let n = +(base + dir * step).toFixed(10)
    if (min !== undefined && n < min) n = min
    if (max !== undefined && n > max) n = max
    commit(String(n))
  }

  const msg = local ?? error
  const width = chars ?? Math.max(3, String(max ?? value).length + 1)
  const canDown = min === undefined || value > min
  const canUp = max === undefined || value < max

  return (
    <Field label={label} hint={hint} error={msg} htmlFor={inputId} className={className}>
      <div className={cx('ix-num', noStepper && 'ix-num-bare')}>
        {!noStepper && (
          <button type="button" className="ix-num-b" onClick={() => bump(-1)} disabled={!canDown} aria-label="Snížit" tabIndex={-1}>
            <IxIcon name="minus" />
          </button>
        )}
        <input
          id={inputId}
          className="ix-input ix-input-num"
          inputMode={decimal ? 'decimal' : 'numeric'}
          value={raw}
          aria-invalid={!!msg || undefined}
          style={{ width: `calc(${width}ch + 24px)` }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => commit(e.target.value)}
          onBlur={() => {
            if (local) return
            setRaw(String(value))
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault()
              bump(1)
            } else if (e.key === 'ArrowDown') {
              e.preventDefault()
              bump(-1)
            }
          }}
        />
        {!noStepper && (
          <button type="button" className="ix-num-b" onClick={() => bump(1)} disabled={!canUp} aria-label="Zvýšit" tabIndex={-1}>
            <IxIcon name="plus" />
          </button>
        )}
      </div>
    </Field>
  )
}

/* ------------------------------------------------------------------ */
/* Text                                                                */
/* ------------------------------------------------------------------ */

export type TextFieldProps = {
  label: ReactNode
  value: string
  onChange: (s: string) => void
  /** Úprava vstupu při psaní, např. `s => s.toUpperCase()` nebo odstranění diakritiky. */
  normalize?: (s: string) => string
  mono?: boolean
  placeholder?: string
  maxLength?: number
  error?: ReactNode
  hint?: ReactNode
  /** Víceřádkové pole. */
  multiline?: boolean
  id?: string
  className?: string
}

export function TextField({ label, value, onChange, normalize, mono = true, placeholder, maxLength, error, hint, multiline, id, className }: TextFieldProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const common = {
    id: inputId,
    className: cx('ix-input', mono && 'ix-mono', multiline && 'ix-textarea'),
    value,
    placeholder,
    maxLength,
    spellCheck: false,
    autoComplete: 'off',
    'aria-invalid': !!error || undefined,
  } as const
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={className}>
      {multiline ? (
        <textarea {...common} rows={3} onChange={(e) => onChange(normalize ? normalize(e.target.value) : e.target.value)} />
      ) : (
        <input {...common} type="text" onChange={(e) => onChange(normalize ? normalize(e.target.value) : e.target.value)} />
      )}
    </Field>
  )
}

/* ------------------------------------------------------------------ */
/* Posuvník                                                            */
/* ------------------------------------------------------------------ */

export type SliderProps = {
  label: ReactNode
  value: number
  onChange: (n: number) => void
  min: number
  max: number
  step?: number
  /** Jak ukázat hodnotu vpravo od popisku (výchozí číslo). */
  format?: (n: number) => ReactNode
  hint?: ReactNode
  id?: string
  className?: string
}

export function Slider({ label, value, onChange, min, max, step = 1, format, hint, id, className }: SliderProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100
  return (
    <Field label={label} value={format ? format(value) : value} hint={hint} htmlFor={inputId} className={className}>
      <input
        id={inputId}
        type="range"
        className="ix-range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ['--ix-pct' as string]: `${pct}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </Field>
  )
}

/* ------------------------------------------------------------------ */
/* Segmentový přepínač                                                 */
/* ------------------------------------------------------------------ */

export type SegmentedOption<T extends string | number> = { value: T; label: ReactNode; title?: string; disabled?: boolean }

export type SegmentedProps<T extends string | number> = {
  /** Popisek nad přepínačem; bez něj je povinný `ariaLabel`. */
  label?: ReactNode
  ariaLabel?: string
  value: T
  options: readonly SegmentedOption<T>[]
  onChange: (v: T) => void
  /** Roztáhnout na celou šířku (stejně široké segmenty). */
  block?: boolean
  size?: 'sm' | 'md'
  className?: string
}

/** 2–6 vzájemně výlučných možností (režim, varianta, runda). Pro víc možností `Select`. */
export function Segmented<T extends string | number>({ label, ariaLabel, value, options, onChange, block, size = 'md', className }: SegmentedProps<T>) {
  const seg = (
    <div className={cx('ix-seg', block && 'ix-seg-block', size === 'sm' && 'ix-seg-sm')} role="group" aria-label={ariaLabel ?? (typeof label === 'string' ? label : undefined)}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === value}
          disabled={o.disabled}
          title={o.title}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
  if (!label) return className ? <div className={className}>{seg}</div> : seg
  return (
    <div className={cx('ix-field', className)}>
      <div className="ix-field-h">
        <span className="ix-label">{label}</span>
      </div>
      {seg}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Přepínač (switch)                                                   */
/* ------------------------------------------------------------------ */

export type ToggleProps = {
  label: ReactNode
  checked: boolean
  onChange: (v: boolean) => void
  hint?: ReactNode
  disabled?: boolean
  className?: string
}

/** Zapnout/vypnout jednu věc („Odposlech (Eva)“, „Ukázat mezivýsledky“). */
export function Toggle({ label, checked, onChange, hint, disabled, className }: ToggleProps) {
  return (
    <div className={cx('ix-toggle-w', className)}>
      <button type="button" role="switch" aria-checked={checked} disabled={disabled} className="ix-toggle" onClick={() => onChange(!checked)}>
        <span className="ix-toggle-track" aria-hidden="true">
          <span className="ix-toggle-knob" />
        </span>
        <span className="ix-toggle-l">{label}</span>
      </button>
      {hint && <p className="ix-msg">{hint}</p>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Výběr                                                               */
/* ------------------------------------------------------------------ */

export type SelectProps<T extends string | number> = {
  label: ReactNode
  value: T
  options: readonly { value: T; label: string; disabled?: boolean }[]
  onChange: (v: T) => void
  hint?: ReactNode
  error?: ReactNode
  id?: string
  className?: string
}

/** Nativní select (víc než ~6 možností, nebo když místo nestačí na `Segmented`). */
export function Select<T extends string | number>({ label, value, options, onChange, hint, error, id, className }: SelectProps<T>) {
  const autoId = useId()
  const inputId = id ?? autoId
  return (
    <Field label={label} hint={hint} error={error} htmlFor={inputId} className={className}>
      <div className="ix-select">
        <select
          id={inputId}
          className="ix-input"
          value={String(value)}
          onChange={(e) => {
            const o = options.find((x) => String(x.value) === e.target.value)
            if (o) onChange(o.value)
          }}
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
        <IxIcon name="chevron" />
      </div>
    </Field>
  )
}
