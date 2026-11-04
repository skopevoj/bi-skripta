'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { applyFontSize, applyTheme, currentFontSize, currentTheme, resolvedTheme, type FontSize, type Theme } from '../lib/theme'
import { PopoverWrap, usePopover } from './Popover'

const THEMES: { id: Theme; label: string }[] = [
  { id: 'system', label: 'Auto' },
  { id: 'light', label: 'Světlý' },
  { id: 'dark', label: 'Tmavý' },
]
const SIZES: { id: FontSize; label: string }[] = [
  { id: 's', label: 'Menší' },
  { id: 'm', label: 'Běžné' },
  { id: 'l', label: 'Větší' },
]

/** Light / dark toggle button (moon / sun). */
export function ThemeToggle() {
  const { course } = useSkripta()
  return (
    <button
      type="button"
      className="sk-ib"
      aria-label="Světlý / tmavý režim"
      title="Světlý / tmavý režim"
      onClick={() => {
        applyTheme(course.storage, resolvedTheme() === 'dark' ? 'light' : 'dark')
        window.dispatchEvent(new Event('sk:theme'))
      }}
    >
      <Icon name="moon" className="sk-t-moon" />
      <Icon name="sun" className="sk-t-sun" />
    </button>
  )
}

/** Gear → popover: theme, text size + course extras (e.g. KOM diagram style). Changes apply immediately. */
export function Settings({ children }: { children?: ReactNode }) {
  const { course } = useSkripta()
  const { open, setOpen, root } = usePopover()
  const [theme, setTheme] = useState<Theme>('system')
  const [fs, setFs] = useState<FontSize>('m')

  useEffect(() => {
    const sync = () => {
      setTheme(currentTheme())
      setFs(currentFontSize())
    }
    sync()
    window.addEventListener('sk:theme', sync)
    return () => window.removeEventListener('sk:theme', sync)
  }, [open])

  return (
    <PopoverWrap root={root} className="sk-gear-w">
      <button
        type="button"
        className="sk-ib"
        aria-label="Nastavení"
        title="Nastavení"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Icon name="gear" />
      </button>
      {open && (
        <div className="sk-pop" role="dialog" aria-label="Nastavení">
          <p className="sk-label">Vzhled</p>
          <div className="sk-seg" role="radiogroup" aria-label="Vzhled">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={theme === t.id}
                onClick={() => {
                  applyTheme(course.storage, t.id)
                  setTheme(t.id)
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="sk-label">Velikost textu</p>
          <div className="sk-seg" role="radiogroup" aria-label="Velikost textu">
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={fs === s.id}
                onClick={() => {
                  applyFontSize(course.storage, s.id)
                  setFs(s.id)
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {children}
          <p className="sk-pop-n">Nastavení se ukládá jen v tomto prohlížeči.</p>
        </div>
      )}
    </PopoverWrap>
  )
}
