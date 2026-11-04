'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Facts } from '../content/Article'
import type { MockTest, QuestionLike } from '../content/types'
import { Link, useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { loadJSON, saveJSON, storageKey } from '../lib/progress'
import { emptyAnswer, kindOf, pointsOf } from './kinds'
import { AnswerInputs, OriginBadges, QuestionHead, QuestionPrompt, Result } from './QuestionCard'
import type { AnswerState } from './types'

export type TestRun = {
  startedAt: number
  answers: AnswerState[]
  flags: boolean[]
  submittedAt: number | null
  score: number | null
}

/** localStorage key of a test run ("kom-test-midterm-1"). */
export const runKey = (prefix: string, id: string) => storageKey(prefix, `test-${id}`)

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
export const fmtPts = (x: number) => String(Math.round(x * 100) / 100).replace('.', ',')

/** Resolved scoring of a test (test fields override `practice.testDefaults`). */
export function testRules(test: MockTest, n: number, defaults?: { minutes?: number; points?: number; partial?: boolean }) {
  const points = test.points ?? defaults?.points ?? 1
  const partial = test.partial ?? defaults?.partial ?? true
  const minutes = test.minutes ?? defaults?.minutes ?? 20
  const max = n * points
  const pass = test.pass ?? Math.ceil(max / 2)
  return { points, partial, minutes, max, pass }
}

/** Timed mock test: intro → running (timer, question nav, flags) → review with score. */
export function TestRunner({ test, questions }: { test: MockTest; questions: QuestionLike[] }) {
  const { course, practice } = useSkripta()
  const kinds = practice?.kinds
  const key = runKey(course.storage, test.id)
  const [run, setRun] = useState<TestRun | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [cur, setCur] = useState(0)
  const [now, setNow] = useState(() => Date.now())
  const [confirm, setConfirm] = useState(false)
  const n = questions.length
  const R = testRules(test, n, practice?.testDefaults)
  const LIMIT_MS = R.minutes * 60 * 1000

  const scoreOf = useCallback(
    (ans: AnswerState[]) => {
      const pts = questions.map((q, i) => pointsOf(q, ans[i] ?? emptyAnswer(), R.partial, kinds) * R.points)
      const ok = questions.map((q, i) => !!kindOf(q, kinds).grade(q, ans[i] ?? emptyAnswer()))
      return { pts, ok, total: Math.round(pts.reduce((a, b) => a + b, 0) * 100) / 100 }
    },
    [questions, R.partial, R.points, kinds],
  )

  useEffect(() => {
    setRun(loadJSON<TestRun>(key))
    setLoaded(true)
  }, [key])

  const persist = useCallback(
    (r: TestRun | null) => {
      setRun(r)
      saveJSON(key, r)
    },
    [key],
  )

  const submit = useCallback(() => {
    if (!run || run.submittedAt) return
    persist({ ...run, submittedAt: Date.now(), score: scoreOf(run.answers).total })
    setConfirm(false)
    window.scrollTo({ top: 0 })
  }, [run, scoreOf, persist])

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

  const result = useMemo(() => (run?.submittedAt ? scoreOf(run.answers) : null), [run, scoreOf])

  if (!loaded) return null

  // ---------------- intro
  if (!run) {
    return (
      <div className="sk-test">
        <p className="sk-lede">{test.description}</p>
        <Facts>
          <li>
            <b>{n}</b> otázek
          </li>
          <li>
            <b>{fmtPts(R.max)}</b> bodů, na projití <b>{fmtPts(R.pass)}</b>
          </li>
          <li>
            <b>{R.minutes}</b> minut
          </li>
        </Facts>
        <p className="sk-test-rules">
          {practice?.testRules ??
            (R.partial
              ? 'Každá otázka za bod, u otázek s více správnými odpověďmi dostaneš část bodu (špatně zaškrtnutá možnost body ubírá). Odpovědi se ukážou až po odevzdání.'
              : `Každá otázka za ${R.points} ${R.points === 1 ? 'bod' : R.points < 5 ? 'body' : 'bodů'}, bez částečných bodů. Odpovědi se ukážou až po odevzdání.`)}
        </p>
        <div className="sk-actions">
          <button
            type="button"
            className="sk-btn"
            onClick={() => {
              const t = Date.now()
              setNow(t)
              persist({ startedAt: t, answers: questions.map(() => emptyAnswer()), flags: questions.map(() => false), submittedAt: null, score: null })
              setCur(0)
            }}
          >
            <Icon name="play" />
            Začít test
          </button>
        </div>
      </div>
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
    const passed = result.total >= R.pass
    return (
      <div className="sk-test">
        <p className="sk-score">
          {fmtPts(result.total)}
          <small> / {fmtPts(R.max)}</small>
        </p>
        <p className="sk-meta">
          <span className={passed ? 'ok' : 'bad'}>
            <Icon name={passed ? 'check' : 'x'} />
            {passed ? `Prošel/prošla bys (min. ${fmtPts(R.pass)} b).` : `Na projití je potřeba ${fmtPts(R.pass)} b.`}
          </span>
          <span>
            <Icon name="timer" />
            čas {fmt(Math.min(LIMIT_MS, run.submittedAt - run.startedAt))}
          </span>
        </p>
        <div className="sk-actions">
          <button
            type="button"
            className="sk-btn ghost sm"
            onClick={() => {
              persist(null)
              window.scrollTo({ top: 0 })
            }}
          >
            Zkusit znovu
          </button>
          <Link href={practice?.testsHref ?? '/testy'} className="sk-btn ghost sm">
            Další testy
          </Link>
        </div>
        <div className="sk-tnav review">
          {questions.map((q, i) => (
            <button
              key={q.id}
              type="button"
              className={result.ok[i] ? 'ok' : (result.pts[i] ?? 0) > 0 ? 'part' : 'bad'}
              onClick={() => document.getElementById(`tq-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              aria-label={`Otázka ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {questions.map((q, i) => {
          const st = run.answers[i] ?? emptyAnswer()
          const k = kindOf(q, kinds)
          return (
            <section key={q.id} className="sk-q done" id={`tq-${i}`} data-kind={q.kind}>
              <QuestionHead q={q} n={`${fmtPts(result.pts[i] ?? 0)} / ${fmtPts(R.points)} b`}>
                <span className="sk-q-i">{i + 1}.</span>
              </QuestionHead>
              <OriginBadges q={q} />
              <QuestionPrompt q={q} />
              <AnswerInputs q={q} st={st} set={() => {}} locked showTruth={!!k.showTruth} />
              <Result q={q} ok={result.ok[i] ?? false} st={st}>
                {k.selfGraded && st.text && (
                  <div className="sk-model">
                    <p className="sk-label">Tvoje odpověď</p>
                    {st.text}
                  </div>
                )}
              </Result>
            </section>
          )
        })}
      </div>
    )
  }

  // ---------------- running
  const q = questions[cur]!
  const st = run.answers[cur] ?? emptyAnswer()
  const answeredCount = questions.filter((qq, i) => kindOf(qq, kinds).isAnswered(qq, run.answers[i] ?? emptyAnswer())).length
  return (
    <div className="sk-test">
      <div className="sk-t-head">
        <span className={`sk-timer${left < 5 * 60 * 1000 ? ' low' : ''}`} aria-label="Zbývající čas">
          {fmt(left)}
        </span>
        <div className="sk-tnav" role="navigation" aria-label="Otázky">
          {questions.map((qq, i) => (
            <button
              key={qq.id}
              type="button"
              className={[kindOf(qq, kinds).isAnswered(qq, run.answers[i] ?? emptyAnswer()) && 'ans', i === cur && 'cur', run.flags[i] && 'flag']
                .filter(Boolean)
                .join(' ')}
              onClick={() => setCur(i)}
              aria-label={`Otázka ${i + 1}`}
              aria-current={i === cur ? 'step' : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <span className="sk-sp" />
        {confirm ? (
          <span className="sk-confirm">
            <span>{answeredCount < n ? `Nezodpovězeno ${n - answeredCount}. ` : ''}Odevzdat?</span>
            <button type="button" className="sk-btn sm" onClick={submit}>
              Ano
            </button>
            <button type="button" className="sk-lnk" onClick={() => setConfirm(false)}>
              Ne
            </button>
          </span>
        ) : (
          <button type="button" className="sk-btn sm" onClick={() => setConfirm(true)}>
            Odevzdat
          </button>
        )}
      </div>
      <section className="sk-q" key={q.id} data-kind={q.kind}>
        <QuestionHead q={q} n={`${cur + 1} / ${n}`}>
          <button type="button" className={`sk-flag${run.flags[cur] ? ' on' : ''}`} aria-pressed={!!run.flags[cur]} onClick={() => toggleFlag(cur)}>
            <Icon name="flag" />
            {run.flags[cur] ? 'Označeno' : 'Označit'}
          </button>
        </QuestionHead>
        <QuestionPrompt q={q} />
        <AnswerInputs q={q} st={st} set={(s) => setAns(cur, s)} locked={false} showTruth={false} />
        <div className="sk-q-pad" />
      </section>
      <nav className="sk-pn tight" aria-label="Otázky testu">
        {cur > 0 ? (
          <button type="button" className="prev" onClick={() => setCur(cur - 1)}>
            <small>
              <Icon name="l" />
              Předchozí
            </small>
            <span>Otázka {cur}</span>
          </button>
        ) : (
          <span />
        )}
        {cur < n - 1 ? (
          <button type="button" className="next" onClick={() => setCur(cur + 1)}>
            <small>
              Další
              <Icon name="r" />
            </small>
            <span>Otázka {cur + 2}</span>
          </button>
        ) : (
          <button
            type="button"
            className="next"
            onClick={() => {
              setConfirm(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <small>Konec</small>
            <span>Odevzdat test</span>
          </button>
        )}
      </nav>
    </div>
  )
}
