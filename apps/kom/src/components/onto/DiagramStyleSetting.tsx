'use client'
import { useMemo } from 'react'
import type { Diagram } from '@content/types'
import { layout } from '@/lib/onto/layout'
import { DiagramSvg, STYLES } from './DiagramSvg'
import { setDiagramStyle, useDiagramStyle } from './OntoDiagram'

const SAMPLE: Diagram = {
  classes: [
    { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
    { id: 's', name: 'Student', st: 'role', x: 0, y: 1.15 },
    { id: 'e', name: 'Enrollment', st: 'relator', x: 1.15, y: 1.15 },
  ],
  gens: [{ general: 'p', specifics: ['s'] }],
  assocs: [{ from: 'e', to: 's', st: 'mediation' }],
}

/** KOM extension of the settings popover: OntoUML diagram style (saved in a cookie, applies immediately). */
export function DiagramStyleSetting() {
  const style = useDiagramStyle()
  const g = useMemo(() => layout(SAMPLE), [])
  return (
    <div className="sk-pop-sec">
      <p className="sk-label">Styl diagramů</p>
      <div className="set-styles" role="radiogroup" aria-label="Styl diagramů">
        {STYLES.map((s) => (
          <button key={s.id} type="button" role="radio" aria-checked={style === s.id} className="set-style od" data-style={s.id} onClick={() => setDiagramStyle(s.id)} title={s.desc}>
            <span className="set-prev">
              <DiagramSvg g={g} style={s.id} uid={`set-${s.id}`} />
            </span>
            <b>{s.label}</b>
          </button>
        ))}
      </div>
    </div>
  )
}
