'use client'

import { useMemo, useState } from 'react'
import type { ClassSt, Diagram, RelSt } from '@content/types'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { Sources } from '@skripta/ui'
import { cx, useScore } from './ui'
import s from './ix.module.css'

type Rel = Extract<RelSt, 'componentOf' | 'memberOf' | 'subCollectionOf' | 'subQuantityOf' | 'containment'>
const RELS: Rel[] = ['componentOf', 'memberOf', 'subCollectionOf', 'subQuantityOf', 'containment']

type Pair = { part: string; partSt: ClassSt; whole: string; wholeSt: ClassSt; rel: Rel; cz: string; why: string; meta?: string[]; mult: [string, string] }

const PAIRS: Pair[] = [
  {
    part: 'Engine',
    partSt: 'kind',
    whole: 'Car',
    wholeSt: 'kind',
    rel: 'componentOf',
    cz: 'motor – auto',
    why: 'Auto je funkční celek: motor v něm má svou specifickou funkci.',
    mult: ['1', '1'],
  },
  {
    part: 'Heart',
    partSt: 'kind',
    whole: 'Person',
    wholeSt: 'kind',
    rel: 'componentOf',
    cz: 'srdce – člověk',
    why: 'Člověk je funkční celek, srdce plní konkrétní funkci (povinná, ale vyměnitelná část).',
    mult: ['1', '1'],
  },
  {
    part: 'Director',
    partSt: 'role',
    whole: 'Company',
    wholeSt: 'kind',
    rel: 'componentOf',
    cz: 'ředitel – firma',
    why: 'Firma je funkční celek; ředitel má v ní jinou funkci než ostatní části.',
    mult: ['1', '1'],
  },
  {
    part: 'Tree',
    partSt: 'kind',
    whole: 'Forest',
    wholeSt: 'collective',
    rel: 'memberOf',
    cz: 'strom – les',
    why: 'Les je kolektiv: všechny stromy v něm hrají stejnou roli. Kolektiv má alespoň 2 členy.',
    mult: ['1', '2..*'],
  },
  {
    part: 'Student',
    partSt: 'role',
    whole: 'Class Group',
    wholeSt: 'collective',
    rel: 'memberOf',
    cz: 'student – paralelka',
    why: 'Paralelka je kolektiv rovnocenných členů (studentů).',
    mult: ['1..*', '2..*'],
  },
  {
    part: 'Bird',
    partSt: 'kind',
    whole: 'Flock',
    wholeSt: 'collective',
    rel: 'memberOf',
    cz: 'pták – hejno',
    why: 'Hejno je kolektiv; jednotlivý pták je jeho člen (atom).',
    mult: ['1', '2..*'],
  },
  {
    part: 'Club',
    partSt: 'collective',
    whole: 'Federation',
    wholeSt: 'collective',
    rel: 'memberOf',
    cz: 'klub – federace',
    why: 'Z pohledu federace je klub nedělitelný člen — i když sám je kolektivem. memberOf není tranzitivní.',
    mult: ['1..*', '2..*'],
  },
  {
    part: 'North Part',
    partSt: 'collective',
    whole: 'Forest',
    wholeSt: 'collective',
    rel: 'subCollectionOf',
    cz: 'severní cíp lesa – les',
    why: 'Část je opět kolektiv (skupina stromů) — vztah mezi dvěma plurálními entitami. Tranzitivní.',
    mult: ['1', '1'],
  },
  {
    part: 'Young Birds',
    partSt: 'collective',
    whole: 'Flock',
    wholeSt: 'collective',
    rel: 'subCollectionOf',
    cz: 'mladí ptáci – hejno',
    why: 'Mladí ptáci tvoří podkolektiv hejna: všichni jeho členové jsou i členy hejna.',
    mult: ['1', '1'],
  },
  {
    part: 'Modelling Group',
    partSt: 'collective',
    whole: 'Research Group',
    wholeSt: 'collective',
    rel: 'subCollectionOf',
    cz: 'modelovací podskupina – výzkumná skupina',
    why: 'Podskupina je kolektiv uvnitř kolektivu; člen podskupiny je i členem celé skupiny.',
    mult: ['1', '1'],
  },
  {
    part: 'Alcohol',
    partSt: 'quantity',
    whole: 'Wine',
    wholeSt: 'quantity',
    rel: 'subQuantityOf',
    cz: 'alkohol – víno',
    why: 'Obojí jsou kvantity (látky). Podkvantita je vždy esenciální, na straně části právě 1.',
    meta: ['essential'],
    mult: ['1', '1'],
  },
  {
    part: 'Sand',
    partSt: 'quantity',
    whole: 'Mortar',
    wholeSt: 'quantity',
    rel: 'subQuantityOf',
    cz: 'písek – malta',
    why: 'Malta je kvantita složená z dalších kvantit (písku) → subQuantityOf.',
    meta: ['essential'],
    mult: ['1', '1'],
  },
  {
    part: 'Wine',
    partSt: 'quantity',
    whole: 'Bottle',
    wholeSt: 'kind',
    rel: 'containment',
    cz: 'víno – láhev',
    why: 'Láhev není ze stejné látky — je to kontejner, který kvantitu vína obsahuje.',
    mult: ['1', '1'],
  },
  {
    part: 'Clay',
    partSt: 'quantity',
    whole: 'Statue',
    wholeSt: 'kind',
    rel: 'containment',
    cz: 'jíl – socha',
    why: 'Socha je objekt vyrobený z kvantity jílu → containment (kvantita → kontejner).',
    mult: ['1', '1'],
  },
]

const WHOLE: Record<Rel, string> = {
  componentOf: 'funkční celek',
  memberOf: 'kolektiv (člen = atom)',
  subCollectionOf: 'kolektiv (část = kolektiv)',
  subQuantityOf: 'kvantita (část = kvantita)',
  containment: 'kontejner pro kvantitu',
}

const CHEAT: [Rel, string, string, string][] = [
  ['componentOf', 'funkční celek → funkční celek', 'obecně ne', 'sdílení závisí na doméně'],
  ['memberOf', 'funkční celek či kolektiv → kolektiv', 'ne', 'celkem alespoň 2 členové'],
  ['subCollectionOf', 'kolektiv → kolektiv', 'ano', 'nejvýše 1 podkolektiv daného typu'],
  ['containment', 'kvantita → kontejner', 'ne', '1:1 v uvedeném vzoru'],
  ['subQuantityOf', 'kvantita → kvantita', 'ano', 'právě 1 na straně části; esenciální'],
]

function diagramFor(p: Pair): Diagram {
  return {
    classes: [
      { id: 'w', name: p.whole, st: p.wholeSt, x: 0, y: 0 },
      { id: 'p', name: p.part, st: p.partSt, x: 1.75, y: 0, mark: 'focus' },
    ],
    assocs: [
      {
        from: 'w',
        to: 'p',
        st: p.rel,
        whole: p.rel === 'containment' ? undefined : 'from',
        shareable: p.mult[0] !== '1',
        fromMult: p.mult[0],
        toMult: p.mult[1],
        meta: p.meta,
      },
    ],
  }
}

export default function PartWhole() {
  const order = useMemo(() => [...PAIRS].sort(() => Math.random() - 0.5), [])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<Rel | null>(null)
  const [score, add] = useScore()
  const p = order[i % order.length]
  const done = picked !== null
  const ok = picked === p.rel

  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <div className={s.pair}>
          <span>{p.part}</span>
          <span className={s.arrow}>je částí</span>
          <span>{p.whole}</span>
        </div>
        <span className={s.sp} />
        {score.total > 0 && (
          <span className={s.score}>
            {score.ok}/{score.total} správně
          </span>
        )}
      </div>
      <p className={s.small} style={{ marginTop: -8 }}>
        {p.cz}
      </p>
      <div className={cx(s.opts, s.mono)} role="group" aria-label="Vyber relaci celek–část">
        {RELS.map((r) => (
          <button
            key={r}
            type="button"
            className={cx(s.opt, done && r === p.rel && s.right, done && r === picked && !ok && s.wrong)}
            aria-pressed={picked === r}
            disabled={done}
            onClick={() => {
              setPicked(r)
              add(r === p.rel)
            }}
          >
            «{r}»
          </button>
        ))}
      </div>

      {done && (
        <>
          <p className={s.fb} aria-live="polite">
            <b className={ok ? s.ok : s.bad}>{ok ? 'Správně.' : `Ne — správně je «${p.rel}».`}</b>
            Celek: <b style={{ color: 'var(--ink)', marginRight: 0 }}>{WHOLE[p.rel]}</b>. {p.why}
          </p>
          <div className={s.miniDia}>
            <OntoDiagram key={i} diagram={diagramFor(p)} compact toolbar={false} />
          </div>
          <div className={s.bar}>
            <button
              type="button"
              className="btn sm"
              autoFocus
              onClick={() => {
                setPicked(null)
                setI(i + 1)
              }}
            >
              Další dvojice
            </button>
          </div>
        </>
      )}

      <details className={s.cheat}>
        <summary>Tahák: jak vybrat relaci celek–část</summary>
        <div className={s.tblWrap}>
          <table className={s.cheatT}>
            <thead>
              <tr>
                <th>Relace</th>
                <th>Část → celek</th>
                <th>Tranzitivní?</th>
                <th>Klíčové omezení</th>
              </tr>
            </thead>
            <tbody>
              {CHEAT.map((r) => (
                <tr key={r[0]}>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Sources
          block
          refs={[
            { kind: 'slide', doc: 'P04', page: 54 },
            { kind: 'slide', doc: 'P04', page: 33 },
          ]}
        />
      </details>
    </div>
  )
}
