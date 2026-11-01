'use client'

import { useState } from 'react'
import { HIERARCHIES, VAR_DECL, boxSub, reason, type Variance } from './lib/variance'
import { Seg, YesNo, cx, ix as s, useScore } from './ui'

type Kind = 'sub' | 'assign'
type Q = { x: number; y: number; kind: Kind }

const VARS = [
  { v: 'co' as const, label: '+T' },
  { v: 'contra' as const, label: '-T' },
  { v: 'inv' as const, label: 'T' },
]

function randQ(prev?: Q): Q {
  for (;;) {
    const x = Math.floor(Math.random() * 3)
    const y = Math.random() < 0.85 ? (x + 1 + Math.floor(Math.random() * 2)) % 3 : x
    const q: Q = { x, y, kind: Math.random() < 0.5 ? 'sub' : 'assign' }
    if (!prev || q.x !== prev.x || q.y !== prev.y || q.kind !== prev.kind) return q
  }
}

export default function VarianceLab() {
  const [h, setH] = useState<'0' | '1'>('0')
  const [v, setV] = useState<Variance>('co')
  const [q, setQ] = useState<Q>(() => ({ x: 0, y: 1, kind: 'assign' }))
  const [answered, setAnswered] = useState(false)
  const [score, add] = useScore()
  const H = HIERARCHIES[+h]
  const X = H[q.x]
  const Y = H[q.y]

  // "Box[X] <: Box[Y]?" or "val b: Box[X] = Box[Y]()" (needs Box[Y] <: Box[X])
  const [l, r] = q.kind === 'sub' ? [q.x, q.y] : [q.y, q.x]
  const answer = boxSub(v, l, r)
  const why = reason(v, H[l], H[r], l, r)
  const pickT = (which: 'x' | 'y', cur: number) => (
    <select
      className={cx(s.inSel, which === 'y' && s.inSelY)}
      value={cur}
      aria-label={which === 'x' ? 'Levý typ' : 'Pravý typ'}
      onChange={(e) => next({ ...q, [which]: +e.target.value })}
    >
      {H.map((n, i) => (
        <option key={n} value={i}>
          {n}
        </option>
      ))}
    </select>
  )
  const question =
    q.kind === 'sub' ? (
      <>
        Platí <code className={s.nowrap}>Box[{pickT('x', q.x)}] &lt;: Box[{pickT('y', q.y)}]</code>?
      </>
    ) : (
      <>
        Zkompiluje se <code className={s.nowrap}>val b: Box[{pickT('x', q.x)}] = Box[{pickT('y', q.y)}]()</code>?
      </>
    )

  const next = (nq?: Q) => {
    setQ(nq ?? randQ(q))
    setAnswered(false)
  }
  const change = (fn: () => void) => {
    fn()
    setAnswered(false)
  }

  // position in the Box tower: covariant keeps the order, contravariant flips it
  const pos = (i: number) => (v === 'contra' ? 2 - i : i)
  const STEP = 48

  return (
    <div className={s.stack}>
      <div className={s.row}>
        <span className={s.lbl}>Hierarchie</span>
        <Seg
          label="Hierarchie"
          value={h}
          onChange={(nh) => change(() => setH(nh))}
          options={[
            { v: '0', label: 'Animal ⊃ Dog ⊃ Puppy' },
            { v: '1', label: 'A ⊃ B ⊃ C' },
          ]}
        />
      </div>
      <div className={s.row}>
        <span className={s.lbl}>Deklarace</span>
        <Seg label="Variance" value={v} onChange={(nv) => change(() => setV(nv))} options={VARS} />
        <code className={s.mono}>class Box[{VAR_DECL[v]}]</code>
      </div>

      <div className={s.diag} aria-hidden="true">
        <div className={s.col}>
          <span className={s.colH}>T</span>
          <div className={s.tower}>
            {H.map((n, i) => (
              <div key={n} className={cx(s.node, i === q.x && s.x, i === q.y && i !== q.x && s.y)} style={{ transform: `translateY(${i * STEP}px)` }}>
                {n}
              </div>
            ))}
            {[0, 1].map((i) => (
              <span key={i} className={s.conn} style={{ top: i * STEP + 32 }} />
            ))}
          </div>
        </div>
        <div className={cx(s.col, (v === 'inv' || !answered) && s.inv)}>
          <span className={s.colH}>Box[T]{answered ? '' : ' · po odpovědi'}</span>
          <div className={s.tower} style={{ opacity: answered ? 1 : 0.4, transition: 'opacity .3s' }}>
            {H.map((n, i) => (
              <div
                key={n}
                className={cx(s.node, answered && i === q.x && s.x, answered && i === q.y && i !== q.x && s.y)}
                style={{ transform: `translateY(${(answered ? pos(i) : i) * STEP}px)` }}
              >
                Box[{n}]
              </div>
            ))}
            {[0, 1].map((i) => (
              <span key={i} className={s.conn} style={{ top: i * STEP + 32 }} />
            ))}
          </div>
        </div>
        <p className={s.legend}>
          Šipka míří k nadtypu.{' '}
          {v === 'co' && 'U +T jde Box stejným směrem jako T.'}
          {v === 'contra' && 'U -T se pořadí Boxů otočí.'}
          {v === 'inv' && 'U invariantního Box nejsou dva různé Boxy v žádném vztahu.'}
        </p>
      </div>

      <YesNo
        key={`${h}${v}${q.x}${q.y}${q.kind}`}
        question={question}
        answer={answer}
        why={
          q.kind === 'assign' ? (
            <>
              Přiřazení potřebuje <code>Box[{Y}] &lt;: Box[{X}]</code>. {why}
            </>
          ) : (
            why
          )
        }
        onNext={() => next()}
        score={score}
        onAnswered={(ok) => {
          add(ok)
          setAnswered(true)
        }}
      />
    </div>
  )
}
