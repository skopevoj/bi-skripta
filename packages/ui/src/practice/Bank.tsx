'use client'
import { useEffect, useMemo, useState } from 'react'
import type { QuestionLike } from '../content/types'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { loadJSON, saveJSON, storageKey, useProgress } from '../lib/progress'
import { plain } from '../lib/text'
import { kindOf } from './kinds'
import { QuestionCard } from './QuestionCard'
import type { BankFilter } from './types'

const PAGE = 60

/** The most telling line of a code snippet (skip trivial lines). */
function codeHint(code: string): string {
  const lines = code
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//') && !l.startsWith('--') && l !== '}' && !l.startsWith('$'))
  return lines.find((l) => /println|val |def |context |select|SELECT/.test(l)) ?? lines[0] ?? ''
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="sk-sel">
      <span>{label}</span>
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

const STATE: BankFilter = {
  id: 'state',
  label: 'Stav',
  options: [
    ['new', 'Nezodpovězené'],
    ['bad', 'Špatně'],
    ['ok', 'Správně'],
  ],
  get: () => undefined, // handled specially (needs progress)
}

/** Question bank: filters, list, practice mode (one by one), deep link `?id=`. */
export function Bank({ questions, filters: extraFilters }: { questions: QuestionLike[]; filters?: BankFilter[] }) {
  const { practice, course, useSearchParam, navigate, pathname } = useSkripta()
  const prog = useProgress()
  const KEY = storageKey(course.storage, 'bank-filters')

  const filters = useMemo<BankFilter[]>(() => {
    const out: BankFilter[] = [...(extraFilters ?? practice?.bankFilters ?? [])]
    if (practice?.topics) {
      const t = practice.topics
      out.push({ id: 'topic', label: 'Téma', options: Object.entries(t), get: (q) => q.topic })
    }
    if (practice?.sourceGroups) {
      const g = practice.sourceGroups
      out.push({ id: 'src', label: 'Zdroj', options: Object.entries(g.labels), get: (q) => g.of(q) })
    }
    if (practice?.verified) {
      const v = practice.verified
      out.push({ id: 'ver', label: 'Ověřeno', options: Object.entries(v).map(([k, x]) => [k, x.label]), get: (q) => q.verified })
    }
    out.push(STATE)
    return out
  }, [extraFilters, practice])

  const [f, setF] = useState<Record<string, string>>({})
  const [limit, setLimit] = useState(PAGE)
  const [practiceAt, setPracticeAt] = useState<number | null>(null)
  const [practiceIds, setPracticeIds] = useState<string[]>([])

  useEffect(() => {
    const saved = loadJSON<Record<string, string>>(KEY)
    if (saved) setF(saved)
  }, [KEY])
  const update = (k: string, v: string) => {
    const next = { ...f, [k]: v }
    if (!v) delete next[k]
    setF(next)
    setLimit(PAGE)
    saveJSON(KEY, next)
  }

  const list = useMemo(
    () =>
      questions.filter((q) => {
        for (const flt of filters) {
          const v = f[flt.id]
          if (!v) continue
          if (flt === STATE) {
            const a = prog.answers[q.id]
            if (v === 'new' && a) return false
            if (v === 'bad' && (!a || a.ok)) return false
            if (v === 'ok' && (!a || !a.ok)) return false
          } else if (flt.get(q) !== v) return false
        }
        return true
      }),
    [questions, f, filters, prog.answers],
  )

  // deep link ?id=… → practise that one question (within the whole bank)
  const deepId = useSearchParam('id')
  useEffect(() => {
    if (!deepId) return
    const ids = questions.map((q) => q.id)
    const i = ids.indexOf(deepId)
    if (i >= 0) {
      setPracticeIds(ids)
      setPracticeAt(i)
      window.scrollTo({ top: 0 })
    }
  }, [deepId, questions])

  const start = (i: number) => {
    // freeze the set so answering doesn't reshuffle it (e.g. with the "nezodpovězené" filter)
    setPracticeIds(list.map((q) => q.id))
    setPracticeAt(i)
    window.scrollTo({ top: 0 })
  }
  const stop = () => {
    setPracticeAt(null)
    if (deepId) navigate(pathname, { replace: true, scroll: false })
  }
  const go = (i: number) => {
    setPracticeAt(i)
    window.scrollTo({ top: 0 })
  }

  const byId = useMemo(() => new Map(questions.map((q) => [q.id, q])), [questions])
  const answered = questions.filter((q) => prog.answers[q.id]).length
  const wrong = questions.filter((q) => prog.answers[q.id] && !prog.answers[q.id]!.ok).length
  const topics = practice?.topics

  if (practiceAt !== null && practiceIds.length) {
    const q = byId.get(practiceIds[practiceAt]!)
    if (q)
      return (
        <div className="sk-bank">
          <div className="sk-bank-bar">
            <button type="button" className="sk-lnk" onClick={stop}>
              <Icon name="l" />
              Seznam otázek
            </button>
            <span className="sk-sp" />
            <span className="sk-q-n">
              {practiceAt + 1} / {practiceIds.length}
            </span>
          </div>
          <QuestionCard key={q.id} q={q} n={[q.id, q.topic && topics?.[q.topic]].filter(Boolean).join(' · ')} />
          <nav className="sk-pn tight" aria-label="Otázky">
            {practiceAt > 0 ? (
              <button type="button" className="prev" onClick={() => go(practiceAt - 1)}>
                <small>
                  <Icon name="l" />
                  Předchozí
                </small>
                <span>Otázka {practiceAt}</span>
              </button>
            ) : (
              <span />
            )}
            {practiceAt < practiceIds.length - 1 ? (
              <button type="button" className="next" onClick={() => go(practiceAt + 1)}>
                <small>
                  Další
                  <Icon name="r" />
                </small>
                <span>Otázka {practiceAt + 2}</span>
              </button>
            ) : (
              <button type="button" className="next" onClick={stop}>
                <small>Hotovo</small>
                <span>Zpět na seznam</span>
              </button>
            )}
          </nav>
        </div>
      )
  }

  const active = Object.values(f).some(Boolean)
  return (
    <div className="sk-bank">
      <p className="sk-meta">
        <span>
          <Icon name="bank" />
          {questions.length} otázek
        </span>
        <span>
          <Icon name="check" />
          zodpovězeno {answered}
        </span>
        <span>
          <Icon name="x" />
          špatně {wrong}
        </span>
      </p>
      <div className="sk-filters">
        {filters.map((flt) => (
          <Select key={flt.id} label={flt.label} value={f[flt.id] ?? ''} onChange={(v) => update(flt.id, v)} options={flt.options} />
        ))}
      </div>
      <div className="sk-bank-bar">
        <span>
          {list.length === questions.length ? `Všech ${list.length}` : `Vybráno ${list.length}`}
          {active && (
            <>
              {' · '}
              <button
                type="button"
                className="sk-lnk"
                onClick={() => {
                  setF({})
                  saveJSON(KEY, null)
                }}
              >
                Zrušit filtry
              </button>
            </>
          )}
        </span>
        <span className="sk-sp" />
        <button type="button" className="sk-btn sm" disabled={list.length === 0} onClick={() => start(0)}>
          <Icon name="play" />
          Procvičovat
        </button>
      </div>
      {list.length === 0 ? (
        <p className="sk-empty">Žádná otázka neodpovídá filtrům.</p>
      ) : (
        <ul className="sk-ql">
          {list.slice(0, limit).map((q, i) => {
            const a = prog.answers[q.id]
            const p = plain(q.prompt)
            const k = kindOf(q, practice?.kinds)
            const meta = [k.label, q.topic && topics?.[q.topic], practice?.sourceGroups && practice.sourceGroups.labels[practice.sourceGroups.of(q)]]
            return (
              <li key={q.id}>
                <button type="button" onClick={() => start(i)}>
                  <span className="sk-ql-p">{p || k.label}</span>
                  {q.code && p.length < 60 && <span className="sk-ql-c">{codeHint(q.code)}</span>}
                  <span className="sk-ql-m">{meta.filter(Boolean).join(' · ')}</span>
                  {a ? <span className={`sk-ql-s ${a.ok ? 'ok' : 'bad'}`}>{a.ok ? 'Správně' : 'Špatně'}</span> : <span />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      {list.length > limit && (
        <p className="sk-more">
          <button type="button" className="sk-btn ghost sm" onClick={() => setLimit(limit + PAGE)}>
            Zobrazit dalších {Math.min(PAGE, list.length - limit)}
          </button>
        </p>
      )}
    </div>
  )
}
