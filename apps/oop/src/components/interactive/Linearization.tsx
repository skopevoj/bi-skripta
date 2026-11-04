'use client'

import { Fragment, useState } from 'react'
import { TAIL, TYPES, chainOutput, linearize } from './lib/linearization'
import { CodeLines, Seg, cx, ix as s } from './ui'

const DEFS = TYPES.map((t) => ({
  text: t.kind === 'class' ? 'class Animal { def path = "Animal" }' : `trait ${t.name} extends ${t.parents.join(' with ')}`,
}))

function Chain({ items, cls }: { items: string[]; cls?: (n: string, i: number) => string | undefined }) {
  return (
    <span className={s.lin}>
      {items.map((n, i) => (
        <Fragment key={i}>
          <span className={cls?.(n, i)}>{n}</span>
        </Fragment>
      ))}
    </span>
  )
}

export default function Linearization() {
  const [parents, setParents] = useState<string[]>(['Animal', 'Furry', 'FourLegged'])
  const [before, setBefore] = useState<'1' | '0'>('1')
  const [stage, setStage] = useState(0)
  const r = linearize('X', parents)

  const set = (p: string[]) => {
    setParents(p)
    setStage(0)
  }
  const toggle = (n: string) => set(parents.includes(n) ? parents.filter((x) => x !== n) : [...parents, n])

  const chain = r.ok ? r.result.filter((n) => !TAIL.includes(n)) : []
  // stages: 1 parents' linearizations, 2 merge, 3 result, 4.. chain steps, last = output
  const last = 3 + chain.length + 1
  const chainPos = stage - 4 // index into chain currently visited
  const body = (n: string) => (before === '1' ? `"${n} > " + super.path` : `super.path + " < ${n}"`)

  return (
    <div className={s.stack}>
      <CodeLines
        lines={[
          ...DEFS,
          { text: '' },
          { text: `// T i X: override def path = ${body('T')}` },
        ]}
      />

      <div className={s.parents}>
        <span>
          <span className={s.kw}>class</span> X <span className={s.kw}>extends</span>
        </span>
        {parents.length === 0 && <span className={s.muted}>…</span>}
        {parents.map((p, i) => (
          <Fragment key={p}>
            {i > 0 && <span className={s.kw}>with</span>}
            <button className="chip on" onClick={() => toggle(p)} aria-label={`Odebrat ${p}`}>
              {p} <span aria-hidden="true">×</span>
            </button>
          </Fragment>
        ))}
      </div>
      <div className={s.row}>
        <span className={s.lbl}>Přidat</span>
        <div className="chips">
          {TYPES.filter((t) => !parents.includes(t.name)).map((t) => (
            <button key={t.name} className="chip" onClick={() => toggle(t.name)}>
              + {t.name}
            </button>
          ))}
        </div>
      </div>
      <div className={s.row}>
        <span className={s.lbl}>Tělo path</span>
        <Seg
          label="Tělo metody path"
          value={before}
          onChange={setBefore}
          options={[
            { v: '1', label: '"T > " + super.path' },
            { v: '0', label: 'super.path + " < T"' },
          ]}
        />
      </div>

      {!r.ok ? (
        <div className={s.verdict}>
          {r.error && <span className={s.bad}>✗ Nezkompiluje se</span>}
          <span className={s.fb} dangerouslySetInnerHTML={{ __html: r.why }} />
          {r.error && <span className={s.err}>{r.error}</span>}
        </div>
      ) : (
        <>
          {stage > 0 && (
            <ol className={s.steps}>
              <li className={stage === 1 ? s.cur : undefined}>
                <div>
                  <span className={s.stT}>Rodiče zprava doleva, každý svou linearizací</span>
                  <div style={{ display: 'grid', gap: 4, marginTop: 4 }}>
                    {r.parts.map((p) => (
                      <div key={p.parent} className={s.linRow}>
                        <span className={s.linL}>L({p.parent})</span>
                        <Chain items={p.lin} />
                      </div>
                    ))}
                  </div>
                </div>
              </li>
              {stage >= 2 && (
                <li className={stage === 2 ? s.cur : undefined}>
                  <div>
                    <span className={s.stT}>Spoj za X a nech jen poslední výskyt</span>
                    <Chain items={r.merged.map((m) => m.name)} cls={(_, i) => (r.merged[i].kept ? s.keep : s.strike)} />
                  </div>
                </li>
              )}
              {stage >= 3 && (
                <li className={stage === 3 ? s.cur : undefined}>
                  <div>
                    <span className={s.stT}>Linearizace</span>
                    <Chain
                      items={r.result}
                      cls={(n) => (chainPos >= 0 && chain[chainPos] === n ? s.cur : chainPos >= 0 && chain.indexOf(n) >= 0 && chain.indexOf(n) < chainPos ? s.done : undefined)}
                    />
                  </div>
                </li>
              )}
              {stage >= 4 && (
                <li className={stage < last ? s.cur : undefined}>
                  <div>
                    <span className={s.stT}>X().path a řetěz super</span>
                    {chainPos < chain.length ? (
                      <span>
                        {chainPos === 0 ? (
                          <>
                            Volání začne v <code>X</code> (první v linearizaci).
                          </>
                        ) : (
                          <>
                            <code>super.path</code> v <code>{chain[chainPos - 1]}</code> → další vpravo v linearizaci: <code>{chain[chainPos]}</code>
                            {TYPES.find((t) => t.name === chain[chainPos - 1])?.parents[0] !== chain[chainPos] &&
                              chain[chainPos - 1] !== 'X' && <span className={s.muted}> (ne rodič z deklarace!)</span>}
                            .
                          </>
                        )}
                        {chain[chainPos] === 'Animal' && ' Animal už super nevolá → vrací "Animal".'}
                      </span>
                    ) : (
                      <span className={s.result}>
                        Vypíše <code>{chainOutput(r.result, before === '1')}</code>
                      </span>
                    )}
                  </div>
                </li>
              )}
            </ol>
          )}
          <div className={s.ctrl}>
            {stage < last && (
              <button className={cx('btn ghost sm', s.btnSm)} onClick={() => setStage(stage + 1)}>
                {stage === 0 ? 'Spočítat krok za krokem' : 'Další krok'}
              </button>
            )}
            {stage > 0 && (
              <button className="lnk" onClick={() => setStage(stage - 1)}>
                Zpět
              </button>
            )}
            {stage < last && (
              <button className="lnk" onClick={() => setStage(last)}>
                Ukázat výsledek
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
