'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import type { ClassSt } from '@content/types'
import { CLASS_INFO } from '@/lib/onto/info'
import { Icon } from '@/components/Icon'
import { YesNo, cx, useScore } from './ui'
import s from './ix.module.css'

const WORLDS = [
  { age: 0, label: 'narození', text: 'Jan se narodil.' },
  { age: 7, label: 'ZŠ', text: 'Jan nastoupil do základní školy.' },
  { age: 14, label: 'puberta', text: 'Jan je teenager a pořád chodí do školy.' },
  { age: 19, label: 'VŠ', text: 'Jan je dospělý a studuje na FIT.' },
  { age: 25, label: 'práce', text: 'Jan dostudoval a nastoupil do práce.' },
  { age: 40, label: 'dálkově', text: 'Jan pracuje a k tomu dálkově studuje.' },
  { age: 67, label: 'důchod', text: 'Jan odešel do důchodu.' },
]

type Row = { name: string; st: ClassSt; rigid: boolean; on: boolean[]; why: string }
const ROWS: Row[] = [
  { name: 'Person', st: 'kind', rigid: true, on: [1, 1, 1, 1, 1, 1, 1].map(Boolean), why: 'kind — poskytuje identitu' },
  { name: 'Man', st: 'subkind', rigid: true, on: [1, 1, 1, 1, 1, 1, 1].map(Boolean), why: 'subkind — rigidní podtyp' },
  { name: 'Child', st: 'phase', rigid: false, on: [1, 1, 0, 0, 0, 0, 0].map(Boolean), why: 'phase — podle věku' },
  { name: 'Teenager', st: 'phase', rigid: false, on: [0, 0, 1, 0, 0, 0, 0].map(Boolean), why: 'phase — podle věku' },
  { name: 'Adult', st: 'phase', rigid: false, on: [0, 0, 0, 1, 1, 1, 1].map(Boolean), why: 'phase — podle věku' },
  { name: 'Student', st: 'role', rigid: false, on: [0, 1, 1, 1, 0, 1, 0].map(Boolean), why: 'role — vztah ke škole' },
  { name: 'Employee', st: 'role', rigid: false, on: [0, 0, 0, 0, 1, 1, 0].map(Boolean), why: 'role — vztah k zaměstnavateli' },
]

const QUIZ: { q: string; a: boolean; why: string; w: number }[] = [
  { q: 'Existuje svět, ve kterém Jan existuje, ale není Person?', a: false, why: '«kind» je rigidní: Person platí ve všech světech, kde Jan existuje.', w: 6 },
  { q: 'Může Jan přestat být Man a dál existovat?', a: false, why: '«subkind» je rigidní stejně jako kind — Man je Jan ve všech světech.', w: 0 },
  { q: 'Může Jan přestat být Student?', a: true, why: '«role» je anti-rigidní: ve 25 letech Jan studentem není, a pořád existuje.', w: 4 },
  { q: 'Může Jan přestat být Child?', a: true, why: '«phase» je anti-rigidní: Child platí jen v prvních světech.', w: 2 },
  {
    q: 'Existuje svět, ve kterém Jan existuje, ale není Adult?',
    a: true,
    why: 'Ano — v dětství. Adult je «phase», tedy anti-rigidní (ne každý svět, kde Jan existuje, je dospělý).',
    w: 1,
  },
  {
    q: 'Může být Jan v jednom světě zároveň Child i Adult?',
    a: false,
    why: 'Fáze tvoří {disjoint, complete} rozklad: v každém světě je Jan právě v jedné fázi.',
    w: 3,
  },
  { q: 'Může být Jan zároveň Student i Employee?', a: true, why: 'Role se nevylučují — ve 40 letech je Jan obojí.', w: 5 },
  { q: 'Mění se při přechodu Child → Adult identita Jana?', a: false, why: 'Phase i role identitu jen nesou (dědí od Person). Je to pořád tentýž Jan.', w: 3 },
]

export default function RigidityTimeline() {
  const [w, setW] = useState(3)
  const [qi, setQi] = useState(0)
  const [score, add] = useScore()
  const order = useMemo(() => [...QUIZ].sort(() => Math.random() - 0.5), [])
  const q = order[qi % order.length]
  const n = WORLDS.length
  const now = ROWS.filter((r) => r.on[w])

  return (
    <div className={s.stack}>
      <div className={s.tlCtl}>
        <button type="button" className="icon-btn" aria-label="Předchozí svět" disabled={w === 0} onClick={() => setW(w - 1)}>
          <Icon name="l" />
        </button>
        <input
          type="range"
          min={0}
          max={n - 1}
          step={1}
          value={w}
          onChange={(e) => setW(Number(e.target.value))}
          aria-label="Svět (okamžik v čase)"
          aria-valuetext={`${WORLDS[w].age} let, ${WORLDS[w].label}`}
        />
        <button type="button" className="icon-btn" aria-label="Další svět" disabled={w === n - 1} onClick={() => setW(w + 1)}>
          <Icon name="r" />
        </button>
      </div>

      <div className={s.tl}>
        <div className={s.tlGrid} style={{ '--n': n } as CSSProperties}>
          <span />
          {WORLDS.map((x, i) => (
            <button
              key={i}
              type="button"
              className={cx(s.tlHead, i === w && s.cur)}
              onClick={() => setW(i)}
              aria-pressed={i === w}
              aria-label={`Svět ${i + 1}: ${x.age} let, ${x.label}`}
            >
              <b style={{ fontWeight: 650 }}>{x.age}</b>
              <br />
              {x.label}
            </button>
          ))}
          {ROWS.map((r) => (
            <div key={r.name} style={{ display: 'contents' }}>
              <div className={s.tlRowL} title={r.why}>
                <span className="od-chip" data-fam={CLASS_INFO[r.st].family}>
                  «{CLASS_INFO[r.st].label}»
                </span>
                <b>{r.name}</b>
              </div>
              {r.on.map((on, i) => (
                <div key={i} className={cx(s.tlCell, i === w && s.cur)}>
                  {on ? (
                    <span className={cx(s.tlBar, r.rigid ? s.rig : s.anti, (i === 0 || !r.on[i - 1]) && s.s, (i === n - 1 || !r.on[i + 1]) && s.e)} />
                  ) : (
                    <span className={s.tlNo} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className={s.legend2}>
        <span>
          <i className={s.lgR} />
          rigidní — platí ve všech světech, kde Jan existuje
        </span>
        <span>
          <i className={s.lgA} />
          anti-rigidní — existuje svět, kde Jan existuje a typem není
        </span>
      </div>

      <div className={cx(s.panel, s.panelSoft)} key={w}>
        <p className={s.p}>
          <b>{WORLDS[w].age} let:</b> {WORLDS[w].text} Jan je teď instancí{' '}
          {now.map((r, i) => (
            <span key={r.name}>
              <b>{r.name}</b>
              {i < now.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
        <p className={s.small}>
          Person a Man se nemění nikdy (rigidní). Fáze se střídají podle věku — v každém světě právě jedna. Role přicházejí a odcházejí se vztahy (škola,
          zaměstnavatel).
        </p>
      </div>

      <YesNo
        key={qi}
        question={q.q}
        answer={q.a}
        why={q.why}
        score={score}
        onAnswered={(ok) => {
          add(ok)
          setW(q.w)
        }}
        onNext={() => setQi(qi + 1)}
      />
    </div>
  )
}
