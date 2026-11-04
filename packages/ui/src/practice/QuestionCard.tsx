'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Sources } from '../content/Cite'
import { CodeBlock } from '../content/Code'
import type { QuestionLike } from '../content/types'
import { useSkripta } from '../lib/context'
import { Html } from '../lib/html'
import { Icon } from '../lib/icons'
import { useProgress, useProgressActions } from '../lib/progress'
import { emptyAnswer, useKind } from './kinds'
import type { AnswerInputsProps, AnswerState } from './types'

/** „Skutečná · Midterm 2024 +2“ / „Vymyšlená“ + green verified badge. */
export function OriginBadges({ q }: { q: QuestionLike }) {
  const { practice } = useSkripta()
  const badge = q.verified ? practice?.verified?.[q.verified]?.badge : undefined
  if (!q.origin && !badge) return null
  return (
    <div className="sk-badges">
      {q.origin?.type === 'real' ? (
        <span className="sk-badge">
          <i className="sk-dot real" />
          Skutečná · {q.origin.seen[0]}
          {q.origin.seen.length > 1 ? ` +${q.origin.seen.length - 1}` : ''}
        </span>
      ) : q.origin ? (
        <span className="sk-badge">
          <i className="sk-dot" />
          Vymyšlená
        </span>
      ) : null}
      {badge && (
        <span className="sk-badge ok">
          <Icon name="check" />
          {badge}
        </span>
      )}
    </div>
  )
}

export function Provenance({ q }: { q: QuestionLike }) {
  if (!q.origin) return null
  if (q.origin.type === 'real') return <p className="sk-prov">Skutečná · {q.origin.seen.join(', ')}</p>
  return (
    <p className="sk-prov">
      Vymyšlená · inspirovaná <em>{q.origin.inspiredBy}</em>. {q.origin.why}
    </p>
  )
}

/** Prompt + course extra (default: the question's code snippet). */
export function QuestionPrompt({ q }: { q: QuestionLike }) {
  const { practice } = useSkripta()
  return (
    <>
      <Html as="div" className="sk-q-p" html={q.prompt} />
      {practice?.promptExtra ? (
        <div className="sk-q-x">{practice.promptExtra(q)}</div>
      ) : q.code ? (
        <div className="sk-q-x">
          <CodeBlock code={q.code} lang={q.lang} actions={false} />
        </div>
      ) : null}
    </>
  )
}

/** The inputs of a question, by kind. */
export function AnswerInputs(props: AnswerInputsProps) {
  const k = useKind(props.q)
  return <k.Inputs {...props} />
}

/** Verdict, model answer, explanation, provenance, sources, retry (after checking / in review). */
export function Result({
  q,
  ok,
  st,
  onRetry,
  children,
}: {
  q: QuestionLike
  ok: boolean | null
  st: AnswerState
  onRetry?: () => void
  children?: ReactNode
}) {
  const k = useKind(q)
  const { practice } = useSkripta()
  const model = (q as { modelAnswer?: string }).modelAnswer
  const extra = practice?.resultExtra?.(q)
  const answered = st.text || st.sel.length || st.ce
  return (
    <div className={`sk-res on${ok === true ? ' ok' : ok === false ? ' bad' : ''}`}>
      {k.selfGraded ? (
        model && (
          <div className="sk-model">
            <p className="sk-label">Vzorová odpověď</p>
            <Html as="div" html={model} />
          </div>
        )
      ) : (
        <p className="sk-verdict">
          <Icon name={ok ? 'check' : 'x'} />
          <b>{ok ? 'Správně.' : answered ? 'Ne.' : 'Bez odpovědi.'}</b>
          {k.expected && <span>{k.expected(q)}</span>}
        </p>
      )}
      {children}
      <Html as="div" className="sk-expl" html={q.explanation} />
      <Provenance q={q} />
      {((q.sources && q.sources.length > 0) || onRetry || extra) && (
        <div className="sk-res-f">
          <Sources refs={q.sources} />
          {extra}
          {onRetry && (
            <button type="button" className="sk-lnk" onClick={onRetry}>
              Zkusit znovu
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/** Header row: kind label, optional number / extra (flag button…). */
export function QuestionHead({ q, n, children }: { q: QuestionLike; n?: ReactNode; children?: ReactNode }) {
  const k = useKind(q)
  return (
    <div className="sk-q-h">
      <span className="sk-q-k">{k.label}</span>
      {children}
      {n && <span className="sk-q-n">{n}</span>}
    </div>
  )
}

/** Self-checking question card (chapters, bank). Persists the answer in the course progress. */
export function QuestionCard({ q, n, id }: { q: QuestionLike; n?: ReactNode; id?: string }) {
  const k = useKind(q)
  const prog = useProgress()
  const { recordAnswer, clearAnswer } = useProgressActions()
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

  const ok = k.grade(q, st)

  const check = (next?: AnswerState) => {
    const cur = next ?? st
    if (k.selfGraded) {
      setSt({ ...cur, revealed: true })
      setChecked(true)
      return
    }
    if (!k.isAnswered(q, cur)) return
    setChecked(true)
    recordAnswer(q.id, !!k.grade(q, cur), cur)
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
    <section className={`sk-q${checked ? ' done' : ''}`} id={id} data-kind={q.kind} aria-label="Otázka k procvičení">
      <QuestionHead q={q} n={n} />
      <OriginBadges q={q} />
      <QuestionPrompt q={q} />
      <k.Inputs q={q} st={st} set={setSt} locked={checked} showTruth={checked && !!k.showTruth} onSubmit={check} />
      {checked && (
        <Result q={q} ok={k.selfGraded ? st.self : ok} st={st} onRetry={retry}>
          {k.selfGraded && (
            <div className="sk-selfgrade">
              {st.self === null ? (
                <>
                  <span>Měl/a jsem to?</span>
                  <button type="button" className="sk-btn ghost sm" onClick={() => selfGrade(true)}>
                    Ano
                  </button>
                  <button type="button" className="sk-btn ghost sm" onClick={() => selfGrade(false)}>
                    Ne
                  </button>
                </>
              ) : (
                <span className={`sk-verdict ${st.self ? 'ok' : 'bad'}`}>
                  <Icon name={st.self ? 'check' : 'x'} />
                  <b>{st.self ? 'Označeno jako správně.' : 'Označeno jako špatně.'}</b>
                </span>
              )}
            </div>
          )}
        </Result>
      )}
    </section>
  )
}
