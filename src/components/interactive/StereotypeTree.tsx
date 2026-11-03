'use client'

import { useMemo, useState } from 'react'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { CLASS_INFO } from '@/lib/onto/info'
import { Seg, cx, useScore } from './ui'
import { ALL_ST, CONCEPTS, RESULTS, TREE, pathTo, type ResultSt } from './lib/stereo'
import s from './ix.module.css'

type Step = { node: string; opt: number }

function ResultCard({ st, concept }: { st: ResultSt; concept?: string }) {
  const r = RESULTS[st]
  return (
    <div className={cx(s.panel, s.res)} aria-live="polite">
      <div className={s.resHead}>
        <span className={s.small}>{concept ? `${concept} →` : 'Výsledek:'}</span>
        <span className={s.resSt}>«{CLASS_INFO[st].label}»</span>
        <span className={s.props}>
          {r.props.map((p) => (
            <span key={p} className={s.stc}>
              {p}
            </span>
          ))}
        </span>
      </div>
      <p className={s.p}>{r.what}</p>
      <p className={s.p}>
        <b>Příklady:</b> {r.example}
      </p>
      <div className={s.miniDia}>
        <OntoDiagram key={st} diagram={r.diagram} compact toolbar={false} />
      </div>
    </div>
  )
}

function Tree({ path, setPath }: { path: Step[]; setPath: (p: Step[]) => void }) {
  // current node = follow the path
  let cur: string | null = 'dep'
  let result: ResultSt | null = null
  for (const st of path) {
    const nx: string = TREE[st.node].opts[st.opt].next
    if (nx.startsWith('=')) {
      result = nx.slice(1) as ResultSt
      cur = null
    } else cur = nx
  }
  const node = cur ? TREE[cur] : null

  return (
    <div className={s.stack}>
      <nav className={s.crumbs} aria-label="Cesta stromem">
        <button type="button" className={cx(s.crumb, path.length === 0 && s.crumbCur)} onClick={() => setPath([])}>
          Start
        </button>
        {path.map((st, i) => (
          <span key={i} style={{ display: 'contents' }}>
            <span className={s.crumbSep} aria-hidden="true">
              ›
            </span>
            <button type="button" className={s.crumb} title={`Vrátit se k otázce: ${TREE[st.node].q}`} onClick={() => setPath(path.slice(0, i))}>
              {TREE[st.node].short} <b>{TREE[st.node].opts[st.opt].short}</b>
            </button>
          </span>
        ))}
      </nav>

      {node && (
        <div className={s.qStep} key={node.id}>
          <span className={s.qNum}>Otázka {path.length + 1}</span>
          <p className={s.h}>{node.q}</p>
          {node.help && <p className={s.qHelp}>{node.help}</p>}
          <div className={s.optList} role="group" aria-label={node.q}>
            {node.opts.map((o, i) => (
              <button key={i} type="button" className={s.opt} onClick={() => setPath([...path, { node: node.id, opt: i }])}>
                <span className={s.key} aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && <ResultCard st={result} />}

      <div className={s.bar}>
        <button type="button" className="btn ghost sm" disabled={path.length === 0} onClick={() => setPath(path.slice(0, -1))}>
          Zpět
        </button>
        {path.length > 0 && (
          <button type="button" className="lnk" onClick={() => setPath([])}>
            Začít znovu
          </button>
        )}
      </div>
    </div>
  )
}

function Drill({ onShowPath }: { onShowPath: (st: ResultSt) => void }) {
  const order = useMemo(() => [...CONCEPTS].sort(() => Math.random() - 0.5), [])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<ResultSt | null>(null)
  const [score, add] = useScore()
  const c = order[i % order.length]
  const done = picked !== null
  const pick = (st: ResultSt) => {
    if (done) return
    setPicked(st)
    add(st === c.st)
  }
  const next = () => {
    setPicked(null)
    setI(i + 1)
  }
  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <span className={s.small}>Jaký stereotyp má třída</span>
        <span className={s.concept}>{c.name}</span>
        <span className={s.sp} />
        {score.total > 0 && (
          <span className={s.score}>
            {score.ok}/{score.total} správně
          </span>
        )}
      </div>
      <div className={cx(s.opts, s.mono)} role="group" aria-label="Vyber stereotyp">
        {ALL_ST.map((st) => (
          <button
            key={st}
            type="button"
            className={cx(s.opt, done && st === c.st && s.right, done && st === picked && st !== c.st && s.wrong)}
            aria-pressed={picked === st}
            disabled={done}
            onClick={() => pick(st)}
          >
            «{CLASS_INFO[st].label}»
          </button>
        ))}
      </div>
      {done && (
        <>
          <p className={s.fb} aria-live="polite">
            <b className={picked === c.st ? s.ok : s.bad}>{picked === c.st ? 'Správně.' : `Ne — ${c.name} je «${CLASS_INFO[c.st].label}».`}</b>
            {c.why}
          </p>
          <ResultCard st={c.st} concept={c.name} />
          <div className={s.bar}>
            <button type="button" className="btn sm" onClick={next} autoFocus>
              Další pojem
            </button>
            <button type="button" className="lnk" onClick={() => onShowPath(c.st)}>
              Ukázat cestu stromem
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function StereotypeTree() {
  const [mode, setMode] = useState<'tree' | 'drill'>('tree')
  const [path, setPath] = useState<Step[]>([])
  return (
    <div className={s.stack}>
      <Seg
        sans
        label="Režim"
        value={mode}
        onChange={setMode}
        options={[
          { v: 'tree', label: 'Rozhodovací strom' },
          { v: 'drill', label: 'Procvič si' },
        ]}
      />
      {mode === 'tree' ? (
        <Tree path={path} setPath={setPath} />
      ) : (
        <Drill
          onShowPath={(st) => {
            setPath(pathTo(st))
            setMode('tree')
          }}
        />
      )}
    </div>
  )
}
