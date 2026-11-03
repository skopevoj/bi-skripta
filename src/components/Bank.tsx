'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Question, Topic, Verified } from '@content/types'
import { useProgress } from '@/lib/progress'
import { KIND_LABEL, SOURCE_GROUPS, TOPICS, plain, sourceGroup, type SourceGroup } from '@/lib/meta'
import { QuestionCard } from './Question'
import { Icon } from './Icon'

type Filters = { lec: string; topic: string; src: string; ver: string; state: string }
const ALL: Filters = { lec: '', topic: '', src: '', ver: '', state: '' }
const KEY = 'kom-bank-filters'
const PAGE = 60

/** The most telling line of a snippet (skip trivial class headers). */
function codeHint(code: string): string {
  const lines = code.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('//') && l !== '}' && !l.startsWith('$'))
  const pick = lines.find((l) => /println|val |def /.test(l)) ?? lines[0] ?? ''
  return pick
}

const VERIFIED: Record<Verified, string> = { slides: 'Slajdy', reasoning: 'Jen úvahou' }

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="sel">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Vše</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  )
}

export function Bank({ questions }: { questions: Question[] }) {
  const prog = useProgress()
  const router = useRouter()
  const params = useSearchParams()
  const [f, setF] = useState<Filters>(ALL)
  const [limit, setLimit] = useState(PAGE)
  const [practice, setPractice] = useState<number | null>(null)
  const [practiceIds, setPracticeIds] = useState<string[]>([])

  // restore filters
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setF({ ...ALL, ...JSON.parse(raw) })
    } catch {
      /* ignore */
    }
  }, [])
  const update = (k: keyof Filters, v: string) => {
    const next = { ...f, [k]: v }
    setF(next)
    setLimit(PAGE)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }

  const groups = useMemo(() => new Map(questions.map((q) => [q.id, sourceGroup(q)])), [questions])

  const list = useMemo(
    () =>
      questions.filter((q) => {
        if (f.topic && q.topic !== f.topic) return false
        if (f.src && groups.get(q.id) !== f.src) return false
        if (f.ver && q.verified !== f.ver) return false
        const a = prog.answers[q.id]
        if (f.state === 'new' && a) return false
        if (f.state === 'bad' && (!a || a.ok)) return false
        if (f.state === 'ok' && (!a || !a.ok)) return false
        return true
      }),
    [questions, f, groups, prog.answers],
  )

  // deep link ?id=... → practise that one question (within the whole bank)
  const deepId = params.get('id')
  useEffect(() => {
    if (!deepId) return
    const ids = questions.map((q) => q.id)
    const i = ids.indexOf(deepId)
    if (i >= 0) {
      setPracticeIds(ids)
      setPractice(i)
      window.scrollTo({ top: 0 })
    }
  }, [deepId, questions])

  const start = (i: number) => {
    // freeze the set so answering doesn't reshuffle it (e.g. with the "nezodpovězené" filter)
    setPracticeIds(list.map((q) => q.id))
    setPractice(i)
    window.scrollTo({ top: 0 })
  }
  const stop = () => {
    setPractice(null)
    if (deepId) router.replace('/otazky', { scroll: false })
  }

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])
  const answered = questions.filter((q) => prog.answers[q.id]).length
  const wrong = questions.filter((q) => prog.answers[q.id] && !prog.answers[q.id].ok).length

  if (practice !== null && practiceIds.length) {
    const q = byId.get(practiceIds[practice])
    if (q)
      return (
        <div>
          <div className="practice-nav">
            <button type="button" className="lnk" onClick={stop}>
              ← Seznam otázek
            </button>
            <span className="sp" />
            <span className="q-n">
              {practice + 1} / {practiceIds.length}
            </span>
          </div>
          <QuestionCard key={q.id} q={q} n={`${q.id} · ${TOPICS[q.topic]}`} />
          <nav className="next" style={{ marginTop: 0 }}>
            {practice > 0 ? (
              <a href="#" onClick={(e) => (e.preventDefault(), setPractice(practice - 1), window.scrollTo({ top: 0 }))}>
                <small>← Předchozí</small>
                Otázka {practice}
              </a>
            ) : (
              <span />
            )}
            {practice < practiceIds.length - 1 ? (
              <a href="#" onClick={(e) => (e.preventDefault(), setPractice(practice + 1), window.scrollTo({ top: 0 }))}>
                <small>Další →</small>
                Otázka {practice + 2}
              </a>
            ) : (
              <a href="#" onClick={(e) => (e.preventDefault(), stop())}>
                <small>Hotovo</small>
                Zpět na seznam
              </a>
            )}
          </nav>
        </div>
      )
  }

  return (
    <div>
      <p className="meta">
        {questions.length} otázek <i>·</i> zodpovězeno {answered} <i>·</i> špatně {wrong}
      </p>
      <div className="filters">
        <Select label="Téma" value={f.topic} onChange={(v) => update('topic', v)} options={(Object.keys(TOPICS) as Topic[]).map((t) => [t, TOPICS[t]])} />
        <Select label="Zdroj" value={f.src} onChange={(v) => update('src', v)} options={(Object.keys(SOURCE_GROUPS) as SourceGroup[]).map((s) => [s, SOURCE_GROUPS[s]])} />
        <Select label="Ověřeno" value={f.ver} onChange={(v) => update('ver', v)} options={(Object.keys(VERIFIED) as Verified[]).map((v) => [v, VERIFIED[v]])} />
        <Select
          label="Stav"
          value={f.state}
          onChange={(v) => update('state', v)}
          options={[
            ['new', 'Nezodpovězené'],
            ['bad', 'Špatně'],
            ['ok', 'Správně'],
          ]}
        />
      </div>
      <div className="bank-bar">
        <span>
          {list.length === questions.length ? `Všech ${list.length}` : `Vybráno ${list.length}`}
          {Object.values(f).some(Boolean) && (
            <>
              {' · '}
              <button type="button" className="lnk" onClick={() => (setF(ALL), localStorage.removeItem(KEY))}>
                Zrušit filtry
              </button>
            </>
          )}
        </span>
        <span className="sp" />
        <button type="button" className="btn sm" disabled={list.length === 0} onClick={() => start(0)}>
          <Icon name="play" />
          Procvičovat
        </button>
      </div>
      {list.length === 0 ? (
        <p className="empty">Žádná otázka neodpovídá filtrům.</p>
      ) : (
        <ul className="ql">
          {list.slice(0, limit).map((q, i) => {
            const a = prog.answers[q.id]
            const p = plain(q.prompt)
            return (
              <li key={q.id}>
                <button type="button" onClick={() => start(i)}>
                  <span className="ql-p">{p || KIND_LABEL[q.kind]}</span>
                  {q.code && p.length < 60 && <span className="ql-c">{codeHint(q.code)}</span>}
                  <span className="ql-m">
                    {KIND_LABEL[q.kind]} · {TOPICS[q.topic]} · {SOURCE_GROUPS[groups.get(q.id)!]}
                  </span>
                  {a ? <span className={`ql-s ${a.ok ? 'ok' : 'bad'}`}>{a.ok ? 'Správně' : 'Špatně'}</span> : <span />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {list.length > limit && (
        <p className="more">
          <button type="button" className="btn ghost sm" onClick={() => setLimit(limit + PAGE)}>
            Zobrazit dalších {Math.min(PAGE, list.length - limit)}
          </button>
        </p>
      )}
    </div>
  )
}
