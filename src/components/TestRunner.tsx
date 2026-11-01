'use client'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { MockTest, Question } from '@content/types'
import { emptyAnswer, grade, isAnswered } from '@/lib/grade'
import { loadJSON, saveJSON, type AnswerState } from '@/lib/progress'
import { KIND_LABEL } from '@/lib/meta'
import { AnswerInputs, OriginBadges, QuestionPrompt, Result } from './Question'
import { Icon } from './Icon'

const LIMIT_MS = 45 * 60 * 1000

export type TestRun = {
  startedAt: number
  answers: AnswerState[]
  flags: boolean[]
  submittedAt: number | null
  score: number | null
}
export const runKey = (id: string) => `oop-test-${id}`

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** Open questions on a test are graded strictly as "self-graded"; treated as wrong until marked. */
function scoreOf(qs: Question[], ans: AnswerState[]): { pts: number; ok: boolean[] } {
  const ok = qs.map((q, i) => !!grade(q, ans[i] ?? emptyAnswer()))
  return { pts: ok.filter(Boolean).length * 2, ok }
}

export function TestRunner({ test, questions }: { test: MockTest; questions: Question[] }) {
  const [run, setRun] = useState<TestRun | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cur, setCur] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [confirm, setConfirm] = useState(false)
  const n = questions.length

  useEffect(() => {
    setRun(loadJSON<TestRun>(runKey(test.id)))
    setLoaded(true)
  }, [test.id])

  const persist = useCallback(
    (r: TestRun | null) => {
      setRun(r)
      saveJSON(runKey(test.id), r)
    },
    [test.id],
  )

  const submit = useCallback(() => {
    if (!run || run.submittedAt) return
    const { pts } = scoreOf(questions, run.answers)
    persist({ ...run, submittedAt: Date.now(), score: pts })
    setConfirm(false)
    window.scrollTo({ top: 0 })
  }, [run, questions, persist])

  // countdown
  const active = !!run && !run.submittedAt
  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [active])
  const left = run ? run.startedAt + LIMIT_MS - now : LIMIT_MS
  useEffect(() => {
    if (active && left <= 0) submit()
  }, [active, left, submit])

  const result = useMemo(() => (run?.submittedAt ? scoreOf(questions, run.answers) : null), [run, questions])

  if (!loaded) return null

  // ---------------- intro
  if (!run) {
    return (
      <>
        <p className="lede">{test.description}</p>
        <ul className="facts" style={{ marginTop: 24 }}>
          <li>
            <b>{n}</b> otázek
          </li>
          <li>
            <b>{n * 2}</b> bodů, na projití <b>{n}</b>
          </li>
          <li>
            <b>45</b> minut
          </li>
        </ul>
        <p style={{ color: 'var(--ink-2)', fontSize: 15.5 }}>
          Každá otázka za 2 body, bez částečných bodů – stejně jako na skutečném testu. Odpovědi se ukážou až po odevzdání. Editor ani slajdy během
          testu nepoužívej.
        </p>
        <div className="actions" style={{ marginTop: 24 }}>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setNow(Date.now())
              persist({ startedAt: Date.now(), answers: questions.map(() => emptyAnswer()), flags: questions.map(() => false), submittedAt: null, score: null })
              setCur(0)
            }}
          >
            <Icon name="play" />
            Začít test
          </button>
        </div>
      </>
    )
  }

  const setAns = (i: number, st: AnswerState) => {
    if (run.submittedAt) return
    const answers = [...run.answers]
    answers[i] = st
    persist({ ...run, answers })
  }
  const toggleFlag = (i: number) => {
    const flags = [...run.flags]
    flags[i] = !flags[i]
    persist({ ...run, flags })
  }

  // ---------------- review
  if (run.submittedAt && result) {
    const passed = result.pts >= n
    return (
      <>
        <p className="score">
          {result.pts}
          <small> / {n * 2}</small>
        </p>
        <p className="meta" style={{ marginBottom: 20 }}>
          {passed ? 'Prošel/prošla bys (min. 10 bodů).' : 'Na projití je potřeba 10 bodů.'} <i>·</i> čas {fmt(Math.min(LIMIT_MS, run.submittedAt - run.startedAt))}
        </p>
        <div className="actions" style={{ marginBottom: 28 }}>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => {
              persist(null)
              window.scrollTo({ top: 0 })
            }}
          >
            Zkusit znovu
          </button>
          <Link href="/testy" className="btn ghost sm">
            Další testy
          </Link>
        </div>
        <div className="tnav" style={{ marginBottom: 12 }}>
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={result.ok[i] ? 'ok' : 'bad'}
              onClick={() => document.getElementById(`tq-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              aria-label={`Otázka ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {questions.map((q, i) => (
          <section key={q.id} className="q" id={`tq-${i}`}>
            <div className="q-h">
              <h3>
                {i + 1}. {KIND_LABEL[q.kind]}
              </h3>
              <span className="t-pts">{result.ok[i] ? '2 / 2 b' : '0 / 2 b'}</span>
            </div>
            <OriginBadges q={q} />
            <QuestionPrompt q={q} />
            <AnswerInputs q={q} st={run.answers[i]} set={() => {}} locked showTruth={q.kind === 'mc'} />
            <Result q={q} ok={result.ok[i]} st={run.answers[i]}>
              {q.kind === 'open' && run.answers[i].text && (
                <div className="model">
                  <b>Tvoje odpověď</b>
                  {run.answers[i].text}
                </div>
              )}
            </Result>
          </section>
        ))}
      </>
    )
  }

  // ---------------- running
  const q = questions[cur]
  const st = run.answers[cur] ?? emptyAnswer()
  const answeredCount = questions.filter((qq, i) => isAnswered(qq, run.answers[i] ?? emptyAnswer())).length
  return (
    <>
      <div className="t-head">
        <span className={`timer${left < 5 * 60 * 1000 ? ' low' : ''}`} aria-label="Zbývající čas">
          {fmt(left)}
        </span>
        <div className="tnav" role="navigation" aria-label="Otázky">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              className={[isAnswered(qq, run.answers[i] ?? emptyAnswer()) && 'ans', i === cur && 'cur', run.flags[i] && 'flag'].filter(Boolean).join(' ')}
              onClick={() => setCur(i)}
              aria-label={`Otázka ${i + 1}`}
              aria-current={i === cur ? 'step' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span className="sp" />
        {confirm ? (
          <>
            <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>
              {answeredCount < n ? `Nezodpovězeno ${n - answeredCount}. ` : ''}Odevzdat?
            </span>
            <button type="button" className="btn sm" onClick={submit}>
              Ano
            </button>
            <button type="button" className="lnk" onClick={() => setConfirm(false)}>
              Ne
            </button>
          </>
        ) : (
          <button type="button" className="btn sm" onClick={() => setConfirm(true)}>
            Odevzdat
          </button>
        )}
      </div>
      <section className="q" key={q.id}>
        <div className="q-h">
          <h3>
            {cur + 1}. {KIND_LABEL[q.kind]}
          </h3>
          <button type="button" className={`flagbtn${run.flags[cur] ? ' on' : ''}`} onClick={() => toggleFlag(cur)}>
            <Icon name="flag" />
            {run.flags[cur] ? 'Označeno' : 'Označit'}
          </button>
        </div>
        <div style={{ height: 10 }} />
        <QuestionPrompt q={q} />
        <AnswerInputs q={q} st={st} set={(s) => setAns(cur, s)} locked={false} showTruth={false} />
      </section>
      <nav className="next" style={{ marginTop: 0 }}>
        {cur > 0 ? (
          <a href="#" onClick={(e) => (e.preventDefault(), setCur(cur - 1))}>
            <small>← Předchozí</small>
            Otázka {cur}
          </a>
        ) : (
          <span />
        )}
        {cur < n - 1 ? (
          <a href="#" onClick={(e) => (e.preventDefault(), setCur(cur + 1))}>
            <small>Další →</small>
            Otázka {cur + 2}
          </a>
        ) : (
          <a href="#" onClick={(e) => (e.preventDefault(), setConfirm(true), window.scrollTo({ top: 0, behavior: 'smooth' }))}>
            <small>Konec</small>
            Odevzdat test
          </a>
        )}
      </nav>
    </>
  )
}
