'use client'

import { useState } from 'react'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { Sources } from '@skripta/ui'
import { Icon } from '@skripta/ui'
import { Seg, cx } from './ui'
import { PATTERNS } from './lib/transform'
import s from './ix.module.css'

export default function Transform() {
  const [pi, setPi] = useState(0)
  const [si, setSi] = useState(0)
  const p = PATTERNS[pi]
  const st = p.strategies[si] ?? p.strategies[0]
  const onto = st.onto ?? p.onto
  // wide diagrams (3+ columns) get stacked instead of side by side
  const wide = Math.max(...onto.classes.map((c) => c.x), ...st.uml.classes.map((c) => c.x)) > 1.4

  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.lbl}>Vzor</span>
        <Seg
          sans
          label="OntoUML vzor"
          value={p.id}
          onChange={(v) => {
            setPi(PATTERNS.findIndex((x) => x.id === v))
            setSi(0)
          }}
          options={PATTERNS.map((x) => ({ v: x.id, label: x.label }))}
        />
      </div>
      <p className={s.p}>{p.intro}</p>

      <div className={s.bar}>
        <span className={s.lbl}>Strategie</span>
        <div className={s.opts} role="group" aria-label="Strategie transformace">
          {p.strategies.map((x, i) => (
            <button key={x.id} type="button" className={cx(s.opt, x.verdict === 'bad' && s.optBad)} aria-pressed={i === si} onClick={() => setSi(i)}>
              {x.verdict === 'good' && <Icon name="check" className={s.vIco} />}
              {x.verdict === 'bad' && <Icon name="x" className={s.vIco} />}
              {x.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cx(s.side, wide && s.sideStack)}>
        <div className={s.sideCol}>
          <span className={s.sideH}>OntoUML</span>
          <OntoDiagram key={`o-${p.id}-${st.onto ? st.id : ''}`} diagram={onto} compact toolbar={false} />
        </div>
        <span className={s.sideArrow} aria-hidden="true">
          →
        </span>
        <div className={cx(s.sideCol, st.verdict === 'bad' && s.bad)}>
          <span className={s.sideH}>UML / OO návrh{st.verdict === 'bad' ? ' — chybně' : ''}</span>
          <OntoDiagram key={`u-${p.id}-${st.id}`} diagram={st.uml} compact toolbar={false} />
        </div>
      </div>

      <div className={s.pc} aria-live="polite" key={`${p.id}-${st.id}`}>
        <div>
          <span className={cx(s.pcH, s.plus)}>Výhody</span>
          <ul>
            {st.pros.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className={cx(s.pcH, s.minus)}>Nevýhody / na co dát pozor</span>
          <ul>
            {st.cons.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <Sources block refs={st.src} />
    </div>
  )
}
