'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Diagram } from '@content/types'
import { layout } from '@/lib/onto/layout'
import { DiagramSvg, STYLES, type DiagramStyle } from './onto/DiagramSvg'
import { setDiagramStyle, useDiagramStyle } from './onto/OntoDiagram'
import { Icon } from './Icon'

const SAMPLE: Diagram = {
  classes: [
    { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
    { id: 's', name: 'Student', st: 'role', x: 0, y: 1.15 },
    { id: 'e', name: 'Enrollment', st: 'relator', x: 1.15, y: 1.15 },
  ],
  gens: [{ general: 'p', specifics: ['s'] }],
  assocs: [{ from: 'e', to: 's', st: 'mediation' }],
}

type Theme = 'system' | 'light' | 'dark'
const THEMES: { id: Theme; label: string }[] = [
  { id: 'system', label: 'Podle systému' },
  { id: 'light', label: 'Světlý' },
  { id: 'dark', label: 'Tmavý' },
]

function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme
  return t === 'light' || t === 'dark' ? t : 'system'
}
function applyTheme(t: Theme) {
  const root = document.documentElement
  try {
    if (t === 'system') {
      delete root.dataset.theme
      localStorage.removeItem('kom-theme')
    } else {
      root.dataset.theme = t
      localStorage.setItem('kom-theme', t)
    }
  } catch {
    /* storage unavailable */
  }
}

/** Gear in the top bar → settings popover (diagram style is saved to a cookie for all diagrams). */
export function Settings() {
  const saved = useDiagramStyle()
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<DiagramStyle>(saved)
  const [theme, setTheme] = useState<Theme>('system')
  const root = useRef<HTMLDivElement>(null)
  const g = useMemo(() => layout(SAMPLE), [])

  const show = () => {
    setStyle(saved)
    setTheme(currentTheme())
    setOpen(true)
  }
  const cancel = () => setOpen(false)
  const save = () => {
    setDiagramStyle(style)
    applyTheme(theme)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="set" ref={root}>
      <button className="icon-btn" type="button" aria-label="Nastavení" title="Nastavení" aria-expanded={open} onClick={() => (open ? cancel() : show())}>
        <Icon name="gear" />
      </button>
      {open && (
        <div className="set-pop" role="dialog" aria-label="Nastavení">
          <p className="set-h">Styl diagramů</p>
          <div className="set-styles" role="radiogroup" aria-label="Styl diagramů">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={style === s.id}
                className="set-style od"
                data-style={s.id}
                onClick={() => setStyle(s.id)}
              >
                <span className="set-prev">
                  <DiagramSvg g={g} style={s.id} uid={`set-${s.id}`} />
                </span>
                <span className="set-l">
                  <b>{s.label}</b>
                  <small>{s.desc}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="set-h">Vzhled</p>
          <div className="od-seg set-theme" role="radiogroup" aria-label="Vzhled">
            {THEMES.map((t) => (
              <button key={t.id} type="button" role="radio" aria-checked={theme === t.id} aria-pressed={theme === t.id} onClick={() => setTheme(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="set-act">
            <button type="button" className="btn ghost sm" onClick={cancel}>
              Zrušit
            </button>
            <button type="button" className="btn sm" onClick={save}>
              Uložit
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
