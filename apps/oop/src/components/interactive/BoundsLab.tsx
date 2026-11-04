'use client'

import { useState } from 'react'
import {
  ARGS,
  METHODS,
  callable,
  explicit,
  inferred,
  sig,
  whyCall,
  whyExplicit,
  whyInferred,
  type ArgT,
  type Bound,
} from './lib/bounds'
import { CodeLines, Seg, YesNo, cx, ix as s, useScore } from './ui'

const BOUNDS = [
  { v: 'none' as const, label: '[T]' },
  { v: 'upper' as const, label: '[T <: B]' },
  { v: 'lower' as const, label: '[T >: B]' },
]

const HIER = ['class A:  def ma() = 1', 'class B extends A:  def mb() = 2', 'class C extends B:  def mc() = 3']

type Q =
  | { kind: 'inf'; b: Bound; t: ArgT }
  | { kind: 'exp'; b: Bound; t: ArgT }
  | { kind: 'call'; b: Bound; m: number }

const rnd = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]

function randQ(): Q {
  const b = rnd<Bound>(['none', 'upper', 'upper', 'lower', 'lower', 'lower'])
  const k = rnd(['inf', 'inf', 'exp', 'call'] as const)
  if (k === 'call') return { kind: 'call', b, m: Math.floor(Math.random() * METHODS.length) }
  return { kind: k, b, t: rnd(ARGS).t }
}

const expr = (t: ArgT) => ARGS.find((a) => a.t === t)!.expr

function Yn({ v }: { v: boolean }) {
  return <span className={cx('yn', v ? 'y' : 'n')}>{v ? '✓' : 'CE'}</span>
}

export default function BoundsLab() {
  const [mode, setMode] = useState<'see' | 'drill'>('see')
  const [b, setB] = useState<Bound>('upper')
  const [sel, setSel] = useState<string>('a:A')
  const [q, setQ] = useState<Q>(randQ)
  const [n, setN] = useState(0)
  const [score, add] = useScore()

  const fLine = `def f[${sig(b)}](x: T) = x.???`
  let selWhy = ''
  if (sel.startsWith('a:')) {
    const t = sel.slice(2) as ArgT
    selWhy = `f(${expr(t)}): ${whyInferred(b, t)}  ·  f[${t}](${expr(t)}): ${whyExplicit(b, t)}`
  } else {
    const m = METHODS[+sel.slice(2)]
    selWhy = `x.${m.name}: ${whyCall(b, m.owner, m.name)}`
  }

  return (
    <div className={s.stack}>
      <div className={s.row}>
        <Seg
          label="Režim"
          sans
          value={mode}
          onChange={setMode}
          options={[
            { v: 'see', label: 'Prozkoumat' },
            { v: 'drill', label: 'Procvičit' },
          ]}
        />
        {mode === 'see' && <Seg label="Bound" value={b} onChange={setB} options={BOUNDS} />}
      </div>

      {mode === 'see' ? (
        <>
          <CodeLines lines={[...HIER.map((text) => ({ text })), { text: '' }, { text: fLine }]} />
          <div className={s.tables}>
            <div>
              <p className={s.cap}>Co projde jako argument</p>
              <table className="grid-t">
                <thead>
                  <tr>
                    <th>argument</th>
                    <th>f(x)</th>
                    <th>f[X](x)</th>
                  </tr>
                </thead>
                <tbody>
                  {ARGS.map((a) => (
                    <tr key={a.t} className={sel === 'a:' + a.t ? 'on' : undefined} onClick={() => setSel('a:' + a.t)}>
                      <td>
                        <code>{a.expr}</code>
                      </td>
                      <td>
                        <Yn v={inferred(b, a.t)} />
                      </td>
                      <td>
                        <Yn v={explicit(b, a.t)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className={s.cap}>Co smí tělo volat na x: T</p>
              <table className="grid-t">
                <thead>
                  <tr>
                    <th>volání</th>
                    <th>metoda z</th>
                    <th>v těle f</th>
                  </tr>
                </thead>
                <tbody>
                  {METHODS.map((m, i) => (
                    <tr key={m.name} className={sel === 'm:' + i ? 'on' : undefined} onClick={() => setSel('m:' + i)}>
                      <td>
                        <code>x.{m.name}</code>
                      </td>
                      <td className={s.muted}>{m.owner}</td>
                      <td>
                        <Yn v={callable(b, m.owner)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className={s.fb} key={sel + b}>
            {selWhy.split('  ·  ').map((w, i) => (
              <span key={i} style={{ display: 'block' }}>
                <code>{w.slice(0, w.indexOf(': '))}</code>
                {w.slice(w.indexOf(': '))}
              </span>
            ))}
          </p>
          <p className={s.muted} style={{ margin: 0 }}>
            <code>f(x)</code> = typový argument odvodí compiler, <code>f[X](x)</code> = napsaný explicitně (X je třída argumentu). Klikni na řádek pro důvod.
          </p>
        </>
      ) : (
        <Drill q={q} n={n} score={score} add={add} next={() => (setQ(randQ()), setN((x) => x + 1))} />
      )}
    </div>
  )
}

function Drill({
  q,
  n,
  score,
  add,
  next,
}: {
  q: Q
  n: number
  score: { ok: number; total: number }
  add: (ok: boolean) => void
  next: () => void
}) {
  const def = `def f[${sig(q.b)}](x: T) = ${q.kind === 'call' ? 'x.' + METHODS[q.m].name : '()'}`
  let question, answer: boolean, why: string
  if (q.kind === 'call') {
    const m = METHODS[q.m]
    question = <>Zkompiluje se tahle definice?</>
    answer = callable(q.b, m.owner)
    why = whyCall(q.b, m.owner, m.name)
  } else {
    const call = q.kind === 'inf' ? `f(${expr(q.t)})` : `f[${q.t}](${expr(q.t)})`
    question = (
      <>
        Zkompiluje se <code>{call}</code>?
      </>
    )
    answer = q.kind === 'inf' ? inferred(q.b, q.t) : explicit(q.b, q.t)
    why = q.kind === 'inf' ? whyInferred(q.b, q.t) : whyExplicit(q.b, q.t)
  }
  return (
    <>
      <CodeLines lines={[...HIER.map((text) => ({ text })), { text: '' }, { text: def }]} />
      <YesNo key={n} question={question} answer={answer} why={why} onNext={next} score={score} onAnswered={add} />
    </>
  )
}
