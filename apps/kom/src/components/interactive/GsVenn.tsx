'use client'

import { useMemo, useState } from 'react'
import type { Diagram } from '@content/types'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { Sources } from '@/components/Sources'
import { cx } from './ui'
import s from './ix.module.css'

type R = { x: number; y: number; w: number; h: number; r: number; ry: number }
type Pt = [number, number]

// shapes of the Man / Woman regions for each combination (Person = circle r 125 around 200,150)
function shapes(d: boolean, c: boolean): { man: R; woman: R } {
  if (c && d) return { man: { x: 70, y: 20, w: 130, h: 260, r: 0, ry: 0 }, woman: { x: 200, y: 20, w: 130, h: 260, r: 0, ry: 0 } }
  if (c) return { man: { x: 70, y: 20, w: 155, h: 260, r: 0, ry: 0 }, woman: { x: 175, y: 20, w: 155, h: 260, r: 0, ry: 0 } }
  if (d) return { man: { x: 88, y: 98, w: 104, h: 100, r: 52, ry: 50 }, woman: { x: 208, y: 98, w: 104, h: 100, r: 52, ry: 50 } }
  return { man: { x: 92, y: 95, w: 134, h: 108, r: 67, ry: 54 }, woman: { x: 174, y: 95, w: 134, h: 108, r: 67, ry: 54 } }
}

const PAGE: Record<string, number> = { '00': 23, '01': 24, '10': 25, '11': 26 }

const TEXT: Record<string, string> = {
  '00': 'Mohou existovat instance pouze nadtypu, podtypů i jejich kombinací: osoba může být Man, Woman, obojí, nebo jen Person.',
  '01': 'Každá instance nadtypu je instancí alespoň jednoho podtypu — oblast „jen Person“ zmizí (nadtyp je de facto abstraktní). Kombinace Man i Woman je povolená.',
  '10': 'Žádná instance nepatří do více podtypů zároveň — kruhy Man a Woman se nepřekrývají. Instance „jen Person“ (ani Man, ani Woman) ale existovat může.',
  '11': 'Každá instance je instancí právě jednoho podtypu: buď Man, nebo Woman. Množina Person je jimi beze zbytku rozdělena (partition).',
}

function Rect({ r, cls }: { r: R; cls: string }) {
  return <rect className={cls} clipPath="url(#gsv-clip)" style={{ x: r.x, y: r.y, width: r.w, height: r.h, rx: r.r, ry: r.ry } as React.CSSProperties} />
}

function Dot({ at, name, off }: { at: Pt; name: string; off: boolean }) {
  return (
    <g className={cx(s.vDot, off && s.vOff)} style={{ transform: `translate(${at[0]}px, ${at[1]}px)` }} aria-hidden="true">
      <circle r="4.5" />
      <text x="0" y="-9" textAnchor="middle">
        {name}
      </text>
    </g>
  )
}

export default function GsVenn() {
  const [disjoint, setD] = useState(false)
  const [complete, setC] = useState(false)
  const sh = shapes(disjoint, complete)
  const key = `${disjoint ? 1 : 0}${complete ? 1 : 0}`

  const adam: Pt = complete ? [128, 175] : disjoint ? [140, 172] : [128, 172]
  const eva: Pt = [400 - adam[0], adam[1]]
  const alex: Pt = [200, 172]
  const pat: Pt = [200, 246]

  const regions = [
    { name: 'jen Person', who: 'Pat', ok: !complete, why: complete ? 'zakazuje {complete}' : 'povoleno — není complete' },
    { name: 'jen Man', who: 'Adam', ok: true, why: 'vždy povoleno' },
    { name: 'jen Woman', who: 'Eva', ok: true, why: 'vždy povoleno' },
    { name: 'Man i Woman zároveň', who: 'Alex', ok: !disjoint, why: disjoint ? 'zakazuje {disjoint}' : 'povoleno — není disjoint' },
  ]

  const diagram: Diagram = useMemo(
    () => ({
      classes: [
        { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0, abstract: complete },
        { id: 'm', name: 'Man', st: 'subkind', x: 0, y: 1 },
        { id: 'w', name: 'Woman', st: 'subkind', x: 1, y: 1 },
      ],
      gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint, complete } }],
    }),
    [disjoint, complete],
  )

  const label = [disjoint && 'disjoint', complete && 'complete'].filter(Boolean).join(', ')

  return (
    <div className={s.stack}>
      <div className={s.bar} role="group" aria-label="Meta-atributy generalization setu">
        <button type="button" className={s.tgl} aria-pressed={disjoint} onClick={() => setD(!disjoint)}>
          disjoint
        </button>
        <button type="button" className={s.tgl} aria-pressed={complete} onClick={() => setC(!complete)}>
          complete
        </button>
        <span className={s.small}>
          aktuálně: <code>{label ? `{${label}}` : 'bez meta-atributů'}</code>
        </span>
      </div>

      <div className={s.vennWrap}>
        <svg className={s.venn} viewBox="0 0 400 300" role="img" aria-label={`Vennův diagram: ${TEXT[key]}`}>
          <defs>
            <clipPath id="gsv-clip">
              <circle cx="200" cy="150" r="125" />
            </clipPath>
          </defs>
          <circle className={s.vSup} cx="200" cy="150" r="125" />
          <Rect r={sh.man} cls={cx(s.vSub, s.vMan)} />
          <Rect r={sh.woman} cls={cx(s.vSub, s.vWoman)} />
          <circle cx="200" cy="150" r="125" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
          <text className={s.vLabS} x="200" y={complete ? 18 : 62} textAnchor="middle">
            PERSON
          </text>
          <text className={s.vLab} x={complete ? 132 : disjoint ? 140 : 132} y="140" textAnchor="middle">
            Man
          </text>
          <text className={s.vLab} x={complete ? 268 : disjoint ? 260 : 268} y="140" textAnchor="middle">
            Woman
          </text>
          <Dot at={adam} name="Adam" off={false} />
          <Dot at={eva} name="Eva" off={false} />
          <Dot at={alex} name="Alex" off={disjoint} />
          <Dot at={pat} name="Pat" off={complete} />
        </svg>

        <div className={s.stack}>
          <ul className={s.regions} aria-label="Oblasti diagramu">
            {regions.map((r) => (
              <li key={r.name} className={r.ok ? s.yes : s.no}>
                <span className={s.rMark} aria-hidden="true">
                  {r.ok ? '✓' : '✕'}
                </span>
                <span>
                  <span className={s.rName}>{r.name}</span> <span className={s.small}>({r.who})</span>
                  <br />
                  <span className={s.small}>{r.why}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className={s.p} aria-live="polite" key={key} style={{ animation: 'none' }}>
            {TEXT[key]}
          </p>
        </div>
      </div>

      <div className={s.miniDia}>
        <OntoDiagram diagram={diagram} compact toolbar={false} />
      </div>

      <p className={s.small}>
        V implementaci: <b>{'{complete}'}</b> → nadtřída je abstraktní; <b>{'{disjoint}'}</b> je standardní chování OO — <b>non-disjoint</b> (jedna instance ve
        více podtřídách) OO přímo neumí a musí se emulovat. U «subkind» Man / Woman se v OntoUML obvykle používá <code>{'{disjoint, complete}'}</code>; ostatní
        kombinace tu slouží k pochopení sémantiky.
      </p>
      <Sources
        block
        refs={[
          { kind: 'slide', doc: 'P02', page: 22 },
          { kind: 'slide', doc: 'P02', page: PAGE[key] },
          { kind: 'slide', doc: 'P06', page: complete ? 22 : 23 },
        ]}
      />
    </div>
  )
}
