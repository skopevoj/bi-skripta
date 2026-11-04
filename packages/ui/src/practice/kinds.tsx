'use client'
import type { CoreQuestion, McQuestion, OpenQuestion, QuestionLike, TfQuestion } from '../content/types'
import { useSkripta } from '../lib/context'
import { Html } from '../lib/html'
import { Icon } from '../lib/icons'
import type { AnswerInputsProps, AnswerState, QuestionKindDef } from './types'

export const emptyAnswer = (): AnswerState => ({ sel: [], text: '', ce: false, revealed: false, self: null })

const letter = (i: number) => String.fromCharCode(65 + i)

type OptState = { on: boolean; right: boolean }
function optClass({ on, right }: OptState, showTruth: boolean) {
  if (!showTruth) return 'sk-opt'
  return `sk-opt ${right ? (on ? 'right picked' : 'right missed') : on ? 'wrong picked' : 'neutral'}`
}
function mark({ on, right }: OptState, showTruth: boolean) {
  if (!showTruth) return ''
  return right ? (on ? 'správně' : 'mělo být') : on ? 'špatně' : ''
}

function McInputs({ q, st, set, locked, showTruth, onSubmit, submitLabel }: AnswerInputsProps<McQuestion>) {
  return (
    <>
      <ul className="sk-opts">
        {q.options.map((o, i) => {
          const s = { on: st.sel.includes(i), right: q.correct.includes(i) }
          return (
            <li key={i}>
              <button
                type="button"
                className={optClass(s, showTruth)}
                aria-pressed={s.on}
                disabled={locked}
                onClick={() => set({ ...st, sel: s.on ? st.sel.filter((x) => x !== i) : [...st.sel, i].sort((a, b) => a - b) })}
              >
                <span className="sk-chk">
                  <Icon name="check" />
                </span>
                <span className="sk-ol">{letter(i)}</span>
                <Html className="sk-ot" html={o} />
                <span className="sk-mk">{mark(s, showTruth)}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {onSubmit && !locked && (
        <div className="sk-q-f">
          <button className="sk-btn sm" type="button" onClick={() => onSubmit()} disabled={st.sel.length === 0}>
            {submitLabel ?? 'Zkontrolovat'}
          </button>
        </div>
      )}
    </>
  )
}

function TfInputs({ q, st, set, locked, showTruth, onSubmit }: AnswerInputsProps<TfQuestion>) {
  const truth = q.answer ? 0 : 1
  return (
    <ul className="sk-opts tf">
      {['Pravda', 'Nepravda'].map((o, i) => {
        const s = { on: st.sel[0] === i, right: i === truth }
        return (
          <li key={i}>
            <button
              type="button"
              className={optClass(s, showTruth)}
              aria-pressed={s.on}
              disabled={locked}
              onClick={() => {
                const next = { ...st, sel: [i] }
                set(next)
                onSubmit?.(next)
              }}
            >
              <span className="sk-rad" />
              <span className="sk-ot">{o}</span>
              <span className="sk-mk">{mark(s, showTruth)}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function OpenInputs({ st, set, locked, onSubmit, submitLabel }: AnswerInputsProps<OpenQuestion>) {
  return (
    <div className="sk-ans">
      <textarea
        rows={3}
        placeholder="Tvoje odpověď (nepovinné – porovnáš si ji se vzorovou)"
        aria-label="Tvoje odpověď"
        value={st.text}
        disabled={locked}
        onChange={(e) => set({ ...st, text: e.target.value })}
      />
      {onSubmit && !locked && (
        <button className="sk-btn sm" type="button" onClick={() => onSubmit()}>
          {submitLabel ?? 'Ukázat vzorovou odpověď'}
        </button>
      )}
    </div>
  )
}

const mc: QuestionKindDef<McQuestion> = {
  label: 'Vyber správné',
  Inputs: McInputs,
  isAnswered: (_q, st) => st.sel.length > 0,
  grade: (q, st) => {
    const a = [...st.sel].sort((x, y) => x - y)
    const b = [...q.correct].sort((x, y) => x - y)
    return a.length === b.length && a.every((v, i) => v === b[i])
  },
  expected: (q) => <>Odpověď: {q.correct.map(letter).join(', ')}.</>,
  showTruth: true,
  /** Moodle: multi-answer gets partial credit (each right pick +1/k, each wrong pick −1/k, min 0). */
  points: (q, st, partial) => {
    if (partial && q.correct.length > 1) {
      const k = q.correct.length
      const hits = st.sel.filter((i) => q.correct.includes(i)).length
      const wrong = st.sel.length - hits
      return Math.max(0, Math.round(((hits - wrong) / k) * 100) / 100)
    }
    return mc.grade(q, st) ? 1 : 0
  },
}

const tf: QuestionKindDef<TfQuestion> = {
  label: 'Pravda, nebo ne?',
  Inputs: TfInputs,
  isAnswered: (_q, st) => st.sel.length > 0,
  grade: (q, st) => st.sel.length > 0 && st.sel[0] === (q.answer ? 0 : 1),
  expected: (q) => <>Odpověď: {q.answer ? 'Pravda' : 'Nepravda'}.</>,
  showTruth: true,
}

const open: QuestionKindDef<OpenQuestion> = {
  label: 'Otevřená otázka',
  Inputs: OpenInputs,
  isAnswered: (_q, st) => st.revealed || st.text.trim() !== '',
  grade: (_q, st) => st.self,
  selfGraded: true,
}

export const CORE_KINDS: Record<CoreQuestion['kind'], QuestionKindDef<any>> = { mc, tf, open }

const unknownKind: QuestionKindDef = {
  label: 'Otázka',
  Inputs: () => null,
  isAnswered: () => false,
  grade: () => null,
}

/** Kind definition for a question (course `practice.kinds` override built-ins). */
export function useKind(q: QuestionLike): QuestionKindDef {
  const { practice } = useSkripta()
  return practice?.kinds?.[q.kind] ?? (CORE_KINDS as Record<string, QuestionKindDef>)[q.kind] ?? unknownKind
}

/** Non-hook variant for lists (bank, tests). */
export function kindOf(q: QuestionLike, kinds?: Record<string, QuestionKindDef<any>>): QuestionKindDef {
  return kinds?.[q.kind] ?? (CORE_KINDS as Record<string, QuestionKindDef>)[q.kind] ?? unknownKind
}

export function gradeQuestion(q: QuestionLike, st: AnswerState, kinds?: Record<string, QuestionKindDef<any>>): boolean | null {
  return kindOf(q, kinds).grade(q, st)
}
export function isAnswered(q: QuestionLike, st: AnswerState, kinds?: Record<string, QuestionKindDef<any>>): boolean {
  return kindOf(q, kinds).isAnswered(q, st)
}
export function pointsOf(q: QuestionLike, st: AnswerState, partial: boolean, kinds?: Record<string, QuestionKindDef<any>>): number {
  const k = kindOf(q, kinds)
  return k.points ? k.points(q, st, partial) : k.grade(q, st) ? 1 : 0
}
