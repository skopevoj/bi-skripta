'use client'
import { useEffect, useRef, useState } from 'react'
import type { Question as Q } from '@content/types'
import { emptyAnswer, grade, isAnswered } from '@/lib/grade'
import { clearAnswer, recordAnswer, useProgress, type AnswerState } from '@/lib/progress'
import { KIND_LABEL } from '@/lib/meta'
import { CodeBlock } from './CodeBlock'
import { Icon } from './Icon'
import { Sources } from './Sources'
import { OntoDiagram } from './onto/OntoDiagram'

function OriginBadges({ q }: { q: Q }) {
  return (
    <div className="badges">
      {q.origin.type === 'real' ? (
        <span className="badge">
          <span className="dot" />
          Skutečná · {q.origin.seen[0]}
          {q.origin.seen.length > 1 ? ` +${q.origin.seen.length - 1}` : ''}
        </span>
      ) : (
        <span className="badge">
          <span className="dot orig" />
          Vymyšlená
        </span>
      )}
      {q.verified === 'slides' && (
        <span className="badge ok">
          <Icon name="check" />
          Podloženo slajdy
        </span>
      )}
    </div>
  )
}

function Provenance({ q }: { q: Q }) {
  if (q.origin.type === 'real') return <p className="prov">Skutečná · {q.origin.seen.join(', ')}</p>
  return (
    <p className="prov">
      Vymyšlená · inspirovaná <em>{q.origin.inspiredBy}</em>. {q.origin.why}
    </p>
  )
}

function expectedText(q: Q): React.ReactNode {
  if (q.kind === 'tf') return <>Odpověď: {q.answer ? 'Pravda' : 'Nepravda'}.</>
  if (q.kind === 'mc') {
    const letters = q.correct.map((i) => String.fromCharCode(65 + i)).join(', ')
    return <>Odpověď: {letters}.</>
  }
  return null
}

/** Inputs for one question. `locked` = after checking / in review. */
export function AnswerInputs({
  q,
  st,
  set,
  locked,
  showTruth,
  onSubmit,
  submitLabel,
}: {
  q: Q
  st: AnswerState
  set: (s: AnswerState) => void
  locked: boolean
  showTruth: boolean
  onSubmit?: () => void
  submitLabel?: string
}) {
  if (q.kind === 'mc') {
    return (
      <>
        <ul className="opts">
          {q.options.map((o, i) => {
            const on = st.sel.includes(i)
            const right = showTruth && q.correct.includes(i)
            const wrong = showTruth && on && !q.correct.includes(i)
            const cls = ['opt', on && 'picked', right && 'right', wrong && 'wrong', locked && 'locked'].filter(Boolean).join(' ')
            return (
              <li key={i}>
                <label className={cls}>
                  <input
                    type="checkbox"
                    checked={on}
                    disabled={locked}
                    onChange={() => set({ ...st, sel: on ? st.sel.filter((x) => x !== i) : [...st.sel, i] })}
                  />
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                  {showTruth && (right || wrong) ? (
                    <span className="mk">{right ? (on ? 'správně' : 'mělo být') : 'špatně'}</span>
                  ) : (
                    <span />
                  )}
                </label>
              </li>
            )
          })}
        </ul>
        {onSubmit && !locked && (
          <div className="ans">
            <button className="btn" type="button" onClick={onSubmit} disabled={st.sel.length === 0}>
              {submitLabel ?? 'Zkontrolovat'}
            </button>
          </div>
        )}
      </>
    )
  }
  if (q.kind === 'tf') {
    return (
      <ul className="opts tf">
        {['Pravda', 'Nepravda'].map((o, i) => {
          const on = st.sel[0] === i
          const truth = q.answer ? 0 : 1
          const right = showTruth && i === truth
          const wrong = showTruth && on && i !== truth
          const cls = ['opt', on && 'picked', right && 'right', wrong && 'wrong', locked && 'locked'].filter(Boolean).join(' ')
          return (
            <li key={i}>
              <label className={cls}>
                <input
                  type="radio"
                  checked={on}
                  disabled={locked}
                  onChange={() => {
                    set({ ...st, sel: [i] })
                  }}
                  onClick={() => onSubmit && !locked && setTimeout(onSubmit, 0)}
                />
                <span>{o}</span>
                {showTruth && (right || wrong) ? <span className="mk">{right ? (on ? 'správně' : 'mělo být') : 'špatně'}</span> : <span />}
              </label>
            </li>
          )
        })}
      </ul>
    )
  }
  // open
  return (
    <div className="ans">
      <textarea
        rows={3}
        className="prose"
        placeholder="Tvoje odpověď (nepovinné – porovnáš si ji se vzorovou)"
        aria-label="Tvoje odpověď"
        value={st.text}
        disabled={locked}
        onChange={(e) => set({ ...st, text: e.target.value })}
      />
      {onSubmit && !locked && (
        <button className="btn" type="button" onClick={onSubmit}>
          {submitLabel ?? 'Ukázat vzorovou odpověď'}
        </button>
      )}
    </div>
  )
}

/** Explanation, provenance, sources and run button (shown after checking / in review). */
export function Result({ q, ok, st, onRetry, children }: { q: Q; ok: boolean | null; st: AnswerState; onRetry?: () => void; children?: React.ReactNode }) {
  return (
    <>
      {q.kind === 'open' ? (
        <div className="model">
          <b>Vzorová odpověď</b>
          <div className="expl-html" dangerouslySetInnerHTML={{ __html: q.modelAnswer }} />
        </div>
      ) : (
        <p className={`verdict ${ok ? 'ok' : 'bad'}`}>
          <Icon name={ok ? 'check' : 'x'} />
          {ok ? 'Správně.' : st.text || st.sel.length ? 'Ne.' : 'Bez odpovědi.'} <span>{expectedText(q)}</span>
        </p>
      )}
      {children}
      <div className="expl-html" dangerouslySetInnerHTML={{ __html: q.explanation }} />
      <Provenance q={q} />
      <Sources refs={q.sources} block />
      {onRetry && (
        <p className="after">
          {onRetry && (
            <button type="button" className="lnk" onClick={onRetry}>
              Zkusit znovu
            </button>
          )}
        </p>
      )}
    </>
  )
}

export function QuestionPrompt({ q }: { q: Q }) {
  return (
    <>
      <div className="q-prompt" dangerouslySetInnerHTML={{ __html: q.prompt }} />
      {q.diagram && <OntoDiagram diagram={q.diagram} compact />}
      {q.code && <CodeBlock code={q.code} lang={q.lang ?? 'ocl'} />}
    </>
  )
}

/** Self-checking question card (chapters, bank). Persists the answer. */
export function QuestionCard({ q, n, id }: { q: Q; n?: string; id?: string }) {
  const prog = useProgress()
  const saved = prog.answers[q.id]
  const [st, setSt] = useState<AnswerState>(emptyAnswer)
  const [checked, setChecked] = useState(false)
  const restored = useRef(false)

  // restore the last answer once — `saved` only shows up after hydration (server snapshot is empty)
  useEffect(() => {
    if (restored.current || !saved) return
    restored.current = true
    setSt(saved.st)
    setChecked(true)
  }, [saved])

  const ok = q.kind === 'open' ? st.self : grade(q, st)

  const check = () => {
    if (q.kind === 'open') {
      const next = { ...st, revealed: true }
      setSt(next)
      setChecked(true)
      return
    }
    if (!isAnswered(q, st)) return
    setChecked(true)
    recordAnswer(q.id, !!grade(q, st), st)
  }
  const selfGrade = (v: boolean) => {
    const next = { ...st, revealed: true, self: v }
    setSt(next)
    recordAnswer(q.id, v, next)
  }
  const retry = () => {
    setSt(emptyAnswer())
    setChecked(false)
    clearAnswer(q.id)
  }

  return (
    <section className="q" id={id} aria-label="Otázka k procvičení">
      <div className="q-h">
        <h3>{KIND_LABEL[q.kind]}</h3>
        {n && <span className="q-n">{n}</span>}
      </div>
      <OriginBadges q={q} />
      <QuestionPrompt q={q} />
      <AnswerInputs q={q} st={st} set={setSt} locked={checked} showTruth={checked && q.kind !== 'open'} onSubmit={check} />
      <div className={`res${checked ? ' on' : ''}`}>
        <div>
          {checked && (
            <Result q={q} ok={ok} st={st} onRetry={retry}>
              {q.kind === 'open' && (
                <div className="selfgrade">
                  {st.self === null ? (
                    <>
                      Měl/a jsem to?
                      <button type="button" className="btn ghost sm" onClick={() => selfGrade(true)}>
                        Ano
                      </button>
                      <button type="button" className="btn ghost sm" onClick={() => selfGrade(false)}>
                        Ne
                      </button>
                    </>
                  ) : (
                    <span className={`verdict ${st.self ? 'ok' : 'bad'}`} style={{ margin: 0 }}>
                      <Icon name={st.self ? 'check' : 'x'} />
                      {st.self ? 'Označeno jako správně.' : 'Označeno jako špatně.'}
                    </span>
                  )}
                </div>
              )}
            </Result>
          )}
        </div>
      </div>
    </section>
  )
}

export { OriginBadges, Provenance }
