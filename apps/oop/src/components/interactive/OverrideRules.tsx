'use client'

import { useState } from 'react'
import { PARAMS, RETS, verdict, type P, type R } from './lib/override'
import { CodeLines, Seg, ix as s } from './ui'

export default function OverrideRules() {
  const [p, setP] = useState<P>('A')
  const [r, setR] = useState<R>('B')
  const [ov, setOv] = useState<'1' | '0'>('1')
  const v = verdict(p, r, ov === '1')

  const lines = [
    { text: 'class A' },
    { text: 'class B extends A' },
    { text: 'class C extends B' },
    { text: '' },
    { text: 'class X {' },
    { text: '  def f(b: B): B = new B' },
    { text: '}' },
    { text: 'class Y extends X {' },
    { text: `  ${ov === '1' ? 'override ' : ''}def f(b: ${p}): ${r} = ???`, id: 'y' },
    { text: '}' },
  ]
  const callRes = (via?: string) =>
    via === 'ambig' ? (
      <span className="yn n">CE: Ambiguous overload</span>
    ) : (
      <b>{via === 'Y.f' ? 'Y.f' : 'X.f'}</b>
    )

  return (
    <div className={s.stack}>
      <CodeLines lines={lines} hl={new Set(['y'])} ce={!v.ok} />

      <div className={s.row}>
        <span className={s.lbl}>Parametr</span>
        <Seg label="Typ parametru" value={p} onChange={setP} options={PARAMS.map((x) => ({ v: x, label: x }))} />
      </div>
      <div className={s.row}>
        <span className={s.lbl}>Návrat</span>
        <Seg label="Návratový typ" value={r} onChange={setR} options={RETS.map((x) => ({ v: x, label: x }))} />
      </div>
      <div className={s.row}>
        <span className={s.lbl}>Modifikátor</span>
        <Seg
          label="Modifikátor"
          value={ov}
          onChange={setOv}
          options={[
            { v: '1', label: 'override def' },
            { v: '0', label: 'def' },
          ]}
        />
      </div>

      <div className={s.verdict} aria-live="polite" key={p + r + ov}>
        {v.ok ? (
          <span className={s.ok}>✓ Zkompiluje se — {v.kind === 'override' ? 'override' : 'overload (nový f vedle starého)'}</span>
        ) : (
          <span className={s.bad}>✗ Nezkompiluje se</span>
        )}
        <span className={s.fb} dangerouslySetInnerHTML={{ __html: v.why }} />
        {!v.ok && <span className={s.err}>{v.msg}</span>}
        {v.ok && (
          <div className={s.calls}>
            <span>
              <code>val x: X = Y(); x.f(B())</code> → {callRes(v.viaX)}
            </span>
            <span>
              <code>val y: Y = Y(); y.f(B())</code> → {callRes(v.viaY)}
            </span>
            {v.viaY === 'ambig' && (
              <span className={s.muted}>
                Na <code>Y</code> sedí <code>f(b: B)</code> (specifičtější parametr) i <code>f(b: {p})</code> (definovaná v podtřídě). Scala to počítá jako
                remízu → nejednoznačné volání.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
