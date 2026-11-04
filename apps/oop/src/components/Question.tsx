'use client'
import { useEffect, useId, useRef, useState } from 'react'
import type { Question as Q } from '@content/types'
import { emptyAnswer, grade, isAnswered } from '@/lib/grade'
import { clearAnswer, recordAnswer, useProgress, type AnswerState } from '@/lib/progress'
import { KIND_LABEL } from '@/lib/meta'
import { wrapForRun } from '@/lib/wrap'
import { CodeBlock } from './CodeBlock'
import { Icon } from './Icon'
import { Sources } from './Sources'
import { useWorkbench } from './workbench/WorkbenchProvider'

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
      {q.verified === 'scala' && (
        <span className="badge ok">
          <Icon name="check" />
          Ověřeno kompilátorem
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
  if (q.kind === 'output') {
    if (q.answer.trim() === 'CE') return <>Nezkompiluje se.</>
    return q.answer.includes('\n') ? (
      <>
        Vypíše <code>{q.answer.split('\n').join(' ⏎ ')}</code>.
      </>
    ) : (
      <>
        Vypíše <code>{q.answer}</code>.
      </>
    )
  }
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
  const uid = useId()
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
  if (q.kind === 'output') {
    const multi = q.answer.includes('\n')
    return (
      <form
        className="ans"
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit?.()
        }}
      >
        {multi ? (
          <textarea
            rows={Math.min(6, q.answer.split('\n').length)}
            placeholder="Výstup (každý řádek zvlášť)"
            aria-label="Tvoje odpověď"
            value={st.text}
            disabled={locked || st.ce}
            spellCheck={false}
            onChange={(e) => set({ ...st, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                onSubmit?.()
              }
            }}
          />
        ) : (
          <input
            type="text"
            placeholder="Výstup"
            aria-label="Tvoje odpověď"
            value={st.text}
            disabled={locked || st.ce}
            spellCheck={false}
            onChange={(e) => set({ ...st, text: e.target.value })}
          />
        )}
        <label className="chk" htmlFor={uid}>
          <input id={uid} type="checkbox" checked={st.ce} disabled={locked} onChange={(e) => set({ ...st, ce: e.target.checked })} />
          Nezkompiluje se
        </label>
        {onSubmit && !locked && (
          <button className="btn" type="submit" disabled={!isAnswered(q, st)}>
            {submitLabel ?? 'Zkontrolovat'}
          </button>
        )}
      </form>
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
  const wb = useWorkbench()
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
          {ok ? 'Správně.' : st.ce || st.text || st.sel.length ? 'Ne.' : 'Bez odpovědi.'} <span>{expectedText(q)}</span>
        </p>
      )}
      {children}
      <div className="expl-html" dangerouslySetInnerHTML={{ __html: q.explanation }} />
      <Provenance q={q} />
      <Sources refs={q.sources} block />
      {(q.code || onRetry) && (
        <p className="after">
          {q.code && (
            <button type="button" className="lnk" onClick={() => wb.openEditor(wrapForRun(q.code!).program, { autorun: true })}>
              Spustit v editoru →
            </button>
          )}
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
      {q.code && <CodeBlock code={q.code} edit={false} />}
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
      <AnswerInputs q={q} st={st} set={setSt} locked={checked} showTruth={checked && q.kind === 'mc'} onSubmit={check} />
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
