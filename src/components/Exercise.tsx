import { useMemo, useState } from 'react'
import { MathHTML } from './MathHTML'

type Answer =
  | { type: 'open'; accept: string[]; placeholder?: string }
  | { type: 'multichoice'; options: { text: string; correct: boolean }[] }

type Tab = 'zadani' | 'vypocet' | 'vysledek'

export function Exercise({
  number,
  title,
  source,
  problem,
  solution,
  result,
  answer,
}: {
  number: string
  title?: string
  source?: string
  problem: string
  solution?: string
  result: string
  answer?: Answer
}) {
  const [tab, setTab] = useState<Tab>('zadani')

  const tabs: { id: Tab; label: string; visible: boolean }[] = useMemo(
    () => [
      { id: 'zadani', label: 'Zadání', visible: true },
      { id: 'vypocet', label: 'Výpočet', visible: !!solution },
      { id: 'vysledek', label: 'Výsledek', visible: true },
    ],
    [solution],
  )

  return (
    <section className="my-5 rounded-lg border border-ink-800 bg-ink-900/40 overflow-hidden">
      <header className="flex items-center justify-between gap-3 px-4 py-2.5 font-sans font-semibold rounded-t-lg bg-accent-priklad text-ink-100">
        <span className="text-[15px] flex items-baseline gap-1">
          <span>Příklad {number}</span>
          {title && (
            <MathHTML
              as="span"
              className="font-medium opacity-90"
              html={`(${title})`}
              noGloss
            />
          )}
        </span>
        {source && (
          <span className="text-[11px] tracking-[0.18em] uppercase opacity-80">
            {source}
          </span>
        )}
      </header>

      <div
        role="tablist"
        aria-label="Kroky příkladu"
        className="flex border-b border-ink-800 bg-ink-900/30 font-sans"
      >
        {tabs
          .filter((t) => t.visible)
          .map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={
                  'flex-1 px-3 py-2 text-[12px] tracking-[0.18em] uppercase border-r border-ink-800 last:border-r-0 transition-colors ' +
                  (active
                    ? 'bg-ink-950 text-ink-100 font-semibold'
                    : 'text-ink-500 hover:text-ink-300 hover:bg-ink-900/60')
                }
              >
                {t.label}
              </button>
            )
          })}
      </div>

      <div className="px-5 py-4">
        {tab === 'zadani' && (
          <div className="space-y-4">
            <MathHTML className="skripta-prose" html={problem} />
            {answer && <AnswerWidget answer={answer} onReveal={() => setTab(solution ? 'vypocet' : 'vysledek')} />}
          </div>
        )}
        {tab === 'vypocet' && solution && (
          <MathHTML className="skripta-prose" html={solution} />
        )}
        {tab === 'vysledek' && (
          <div className="space-y-3">
            <div className="text-[11px] tracking-[0.22em] uppercase text-ink-500 font-sans">
              Výsledek
            </div>
            <MathHTML className="skripta-prose font-semibold text-ink-100" html={result} />
          </div>
        )}
      </div>
    </section>
  )
}

function normalizeOpen(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[,;]+/g, ',')
}

function AnswerWidget({ answer, onReveal }: { answer: Answer; onReveal: () => void }) {
  if (answer.type === 'open') return <OpenAnswer answer={answer} onReveal={onReveal} />
  return <MultiChoiceAnswer answer={answer} onReveal={onReveal} />
}

function OpenAnswer({
  answer,
  onReveal,
}: {
  answer: Extract<Answer, { type: 'open' }>
  onReveal: () => void
}) {
  const [value, setValue] = useState('')
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle')

  const check = () => {
    const norm = normalizeOpen(value)
    if (!norm) return
    const accepted = answer.accept.map(normalizeOpen)
    setState(accepted.includes(norm) ? 'correct' : 'wrong')
  }

  return (
    <div className="rounded border border-ink-800 bg-ink-950/40 px-3 py-3 font-sans space-y-2">
      <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500">
        Zkuste odpovědět
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (state !== 'idle') setState('idle')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') check()
          }}
          placeholder={answer.placeholder ?? 'Vaše odpověď'}
          className={
            'flex-1 px-2.5 py-1.5 bg-ink-950 border rounded text-ink-100 font-mono text-[13px] focus:outline-none transition-colors ' +
            (state === 'correct'
              ? 'border-emerald-500/60 focus:border-emerald-500'
              : state === 'wrong'
                ? 'border-rose-500/60 focus:border-rose-500'
                : 'border-ink-800 focus:border-ink-600')
          }
        />
        <button
          type="button"
          onClick={check}
          className="px-3 py-1.5 bg-ink-900 hover:bg-ink-850 border border-ink-800 hover:border-ink-700 rounded text-ink-100 text-[13px] font-medium transition-colors"
        >
          Zkontrolovat
        </button>
      </div>
      <FeedbackRow state={state} onReveal={onReveal} />
    </div>
  )
}

function MultiChoiceAnswer({
  answer,
  onReveal,
}: {
  answer: Extract<Answer, { type: 'multichoice' }>
  onReveal: () => void
}) {
  const [picked, setPicked] = useState<Set<number>>(new Set())
  const [state, setState] = useState<'idle' | 'correct' | 'wrong'>('idle')

  const toggle = (i: number) => {
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
    if (state !== 'idle') setState('idle')
  }

  const check = () => {
    const correctIdx = new Set(
      answer.options.map((o, i) => (o.correct ? i : -1)).filter((i) => i >= 0),
    )
    if (picked.size !== correctIdx.size) {
      setState('wrong')
      return
    }
    for (const i of picked) {
      if (!correctIdx.has(i)) {
        setState('wrong')
        return
      }
    }
    setState('correct')
  }

  return (
    <div className="rounded bg-ink-950/40 px-3 py-3 font-sans space-y-2">
      <div className="text-[11px] tracking-[0.18em] uppercase text-ink-500">
        Vyberte správné odpovědi
      </div>
      <ul className="space-y-1.5">
        {answer.options.map((o, i) => {
          const isPicked = picked.has(i)
          const showResult = state !== 'idle'
          const isCorrect = o.correct
          const rowState = showResult
            ? isPicked && isCorrect
              ? 'hit'
              : isPicked && !isCorrect
                ? 'miss'
                : !isPicked && isCorrect
                  ? 'missed'
                  : 'neutral'
            : 'neutral'
          const ring =
            rowState === 'hit'
              ? 'border-emerald-500/60 bg-emerald-500/[0.06]'
              : rowState === 'miss'
                ? 'border-rose-500/60 bg-rose-500/[0.06]'
                : rowState === 'missed'
                  ? 'border-amber-500/60 bg-amber-500/[0.05]'
                  : isPicked
                    ? 'border-ink-600 bg-ink-900/60'
                    : 'border-ink-800 hover:border-ink-700 bg-transparent'
          return (
            <li key={i}>
              <label
                className={
                  'flex items-start gap-2 px-2.5 py-2 rounded border cursor-pointer transition-colors ' +
                  ring
                }
              >
                <input
                  type="checkbox"
                  checked={isPicked}
                  onChange={() => toggle(i)}
                  className="mt-1 accent-ink-400"
                />
                <MathHTML
                  as="span"
                  className="flex-1 text-[14px] text-ink-200"
                  html={o.text}
                  noGloss
                />
                {showResult && isCorrect && (
                  <span className="text-emerald-600 text-[12px] font-semibold tracking-wider mt-0.5">
                    ✓
                  </span>
                )}
                {showResult && !isCorrect && isPicked && (
                  <span className="text-rose-600 text-[12px] font-semibold tracking-wider mt-0.5">
                    ✗
                  </span>
                )}
              </label>
            </li>
          )
        })}
      </ul>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={check}
          className="px-3 py-1.5 bg-ink-900 hover:bg-ink-850 border border-ink-800 hover:border-ink-700 rounded text-ink-100 text-[13px] font-medium transition-colors"
        >
          Zkontrolovat
        </button>
      </div>
      <FeedbackRow state={state} onReveal={onReveal} />
    </div>
  )
}

function FeedbackRow({
  state,
  onReveal,
}: {
  state: 'idle' | 'correct' | 'wrong'
  onReveal: () => void
}) {
  if (state === 'idle') return null
  if (state === 'correct') {
    return (
      <div className="flex items-center justify-between gap-3 text-[13px]">
        <span className="text-emerald-700 font-medium">
          Správně. Pokračujte na postup řešení.
        </span>
        <button
          type="button"
          onClick={onReveal}
          className="text-ink-100 underline decoration-ink-500 decoration-1 underline-offset-2 hover:decoration-ink-300"
        >
          Zobrazit postup →
        </button>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between gap-3 text-[13px]">
      <span className="text-rose-700 font-medium">
        Zatím nesedí. Zkuste znovu nebo si zobrazte postup.
      </span>
      <button
        type="button"
        onClick={onReveal}
        className="text-ink-100 underline decoration-ink-500 decoration-1 underline-offset-2 hover:decoration-ink-300"
      >
        Zobrazit postup →
      </button>
    </div>
  )
}
