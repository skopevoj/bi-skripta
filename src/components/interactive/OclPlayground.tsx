'use client'

import { useMemo, useState } from 'react'
import { CodeLines, Seg, cx } from './ui'
import { CARS, DRIVERS, EXPRS, RIDES, dName, ridesOf, type Mark, type Params } from './lib/ocl'
import s from './ix.module.css'

const defaults = (i: number): Params => Object.fromEntries((EXPRS[i].params ?? []).map((p) => [p.key, p.def]))

function Obj({ id, mark, title, lines, other }: { id: string; mark?: Mark; title: string; lines: string[]; other?: boolean }) {
  return (
    <div className={cx(s.obj, mark && s[mark], other && s.other)} data-id={id}>
      <b>{title}</b>
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  )
}

export default function OclPlayground() {
  const [ei, setEi] = useState(0)
  const [params, setParams] = useState<Params>(() => defaults(0))
  const [shown, setShown] = useState(false)
  const e = EXPRS[ei]
  const out = useMemo(() => e.run(params), [e, params])
  const marks = shown ? out.marks : {}

  const choose = (i: number) => {
    setEi(i)
    setParams(defaults(i))
    setShown(false)
  }
  const setP = (k: string, v: number | string) => {
    setParams((p) => ({ ...p, [k]: v }))
  }

  const head = e.ctx === 'TaxiCompany' ? '-- dotaz, self = costy : TaxiCompany' : `context ${e.ctx}`
  const code = [head, ...e.code(params).split('\n')].map((text) => ({ text }))

  return (
    <div className={s.stack}>
      <div className={s.objs} aria-label="Objektový model">
        <div className={s.objGrp}>
          <span className={s.objGrpH}>self = costy : TaxiCompany — drivers</span>
          <div className={s.objRow}>
            {DRIVERS.filter((d) => d.firm === 'costy').map((d) => (
              <Obj key={d.id} id={d.id} mark={marks[d.id]} title={`${d.name} : Driver`} lines={[`age = ${d.age}`, `rides = {${ridesOf(d).map((r) => r.id).join(', ')}}`]} />
            ))}
            <Obj id="emil" mark={marks.emil} other title="Emil : Driver" lines={['age = 29', 'rides = {}', 'firma Rychlík']} />
          </div>
        </div>
        <div className={s.objGrp}>
          <span className={s.objGrpH}>rides</span>
          <div className={s.objRow}>
            {RIDES.map((r) => (
              <Obj key={r.id} id={r.id} mark={marks[r.id]} title={`${r.id} : Ride`} lines={[`price = ${r.price}`, `km = ${r.km}`, `driver = ${dName(r.driver)}, car = ${r.car}`]} />
            ))}
          </div>
        </div>
        <div className={s.objGrp}>
          <span className={s.objGrpH}>cars</span>
          <div className={s.objRow}>
            {CARS.map((c) => (
              <Obj key={c.id} id={c.id} mark={marks[c.id]} title={`${c.id} : Car`} lines={[`plate = '${c.plate}'`, `seats = ${c.seats}`]} />
            ))}
          </div>
        </div>
      </div>

      <div className={s.oclGrid}>
        <div className={s.exprs} role="group" aria-label="Výrazy OCL">
          {EXPRS.map((x, i) => (
            <button key={x.id} type="button" aria-pressed={i === ei} className={s.expr} onClick={() => choose(i)}>
              <small>
                <b style={{ color: 'var(--ink-2)', fontFamily: 'var(--mono)', fontWeight: 600 }}>{x.op}</b> · {x.title}
              </small>
            </button>
          ))}
        </div>

        <div className={s.stack}>
          <CodeLines lang="ocl" lines={code} />
          {e.params?.map((p) =>
            p.kind === 'num' ? (
              <div key={p.key} className={s.param}>
                <span>{p.label} =</span>
                <span className={s.num}>
                  <button type="button" aria-label={`Snížit ${p.label}`} onClick={() => setP(p.key, Math.max(p.min, Number(params[p.key]) - p.step))}>
                    −
                  </button>
                  <output aria-live="polite">{params[p.key]}</output>
                  <button type="button" aria-label={`Zvýšit ${p.label}`} onClick={() => setP(p.key, Math.min(p.max, Number(params[p.key]) + p.step))}>
                    +
                  </button>
                </span>
              </div>
            ) : (
              <div key={p.key} className={s.param}>
                <span>{p.label}:</span>
                <Seg label={p.label} value={String(params[p.key])} options={p.opts} onChange={(v) => setP(p.key, v)} />
              </div>
            ),
          )}

          {!shown ? (
            <div className={s.bar}>
              <button type="button" className="btn sm" onClick={() => setShown(true)}>
                Vyhodnotit
              </button>
              <span className={s.small}>Nejdřív si tipni výsledek.</span>
            </div>
          ) : (
            <>
              <ol className={s.trace} aria-live="polite">
                {out.steps.map((st, i) => (
                  <li key={i}>
                    <code>{st.code}</code>
                    {st.items && (
                      <span className={s.items}>
                        {st.items.map((it, j) => (
                          <span key={j} className={cx(s.it, it.cls && s[it.cls], it.dec && s.d)}>
                            {it.label}
                          </span>
                        ))}
                      </span>
                    )}
                    {st.value && (
                      <span>
                        → <code>{st.value}</code>
                      </span>
                    )}
                    {st.note && <span className={s.small}>{st.note}</span>}
                  </li>
                ))}
              </ol>
              <div className={cx(s.panel, s.panelSoft)}>
                <div className={s.val}>
                  <span>= {out.value}</span>
                  <small>{out.type}</small>
                </div>
                {e.tip && <p className={s.small}>{e.tip}</p>}
              </div>
            </>
          )}
        </div>
      </div>
      <p className={s.small}>
        Pozn.: množina (Set) nemá pořadí — prvky tu procházíme v pořadí, v jakém jsou nakreslené. <code>-&gt;</code> volá operaci nad kolekcí, <code>.</code> naviguje / čte atribut.
      </p>
    </div>
  )
}
