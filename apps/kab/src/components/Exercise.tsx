// Exam-style exercise: Zadání (+ answer check) → Výpočet → Výsledek, inside a yellow „Příklad“ callout.
import { useState, type FormEvent } from 'react'
import { Callout, Html } from '@skripta/ui'
import { Button, Segmented, TextField, Verdict } from '@skripta/ui/interactive'
import type { Block } from '../types'

type ExerciseBlock = Extract<Block, { kind: 'exercise' }>
type Answer = NonNullable<ExerciseBlock['answer']>
type Step = 'zadani' | 'vypocet' | 'vysledek'
type Check = 'idle' | 'correct' | 'wrong'

export function Exercise({ id, block }: { id?: string; block: ExerciseBlock }) {
  const { number, title, source, problem, solution, result, answer } = block
  const [step, setStep] = useState<Step>('zadani')
  const steps: { value: Step; label: string }[] = [
    { value: 'zadani', label: 'Zadání' },
    ...(solution ? [{ value: 'vypocet' as const, label: 'Výpočet' }] : []),
    { value: 'vysledek', label: 'Výsledek' },
  ]
  const reveal = () => setStep(solution ? 'vypocet' : 'vysledek')

  return (
    <Callout id={id} type="priklad" number={number} title={title}>
      <div className="kab-ex">
        <div className="kab-ex-bar">
          <Segmented ariaLabel="Kroky příkladu" size="sm" value={step} options={steps} onChange={setStep} />
          {source && <span className="kab-ex-src">{source}</span>}
        </div>
        {step === 'zadani' && (
          <>
            <Html html={problem} as="div" className="kab-ex-html" />
            {answer && <AnswerCheck answer={answer} onReveal={reveal} />}
          </>
        )}
        {step === 'vypocet' && solution && <Html html={solution} as="div" className="kab-ex-html" />}
        {step === 'vysledek' && (
          <div className="kab-ex-res">
            <span className="kab-ex-label">Výsledek</span>
            <Html html={result} as="div" className="kab-ex-html" />
          </div>
        )}
      </div>
    </Callout>
  )
}

function AnswerCheck({ answer, onReveal }: { answer: Answer; onReveal: () => void }) {
  return answer.type === 'open' ? <OpenAnswer answer={answer} onReveal={onReveal} /> : <MultiChoice answer={answer} onReveal={onReveal} />
}

const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '').replace(/[,;]+/g, ',')

function OpenAnswer({ answer, onReveal }: { answer: Extract<Answer, { type: 'open' }>; onReveal: () => void }) {
  const [value, setValue] = useState('')
  const [check, setCheck] = useState<Check>('idle')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const v = normalize(value)
    if (!v) return
    setCheck(answer.accept.map(normalize).includes(v) ? 'correct' : 'wrong')
  }
  return (
    <form className="kab-ex-check" onSubmit={submit}>
      <div className="kab-ex-open">
        <TextField
          label="Zkuste odpovědět"
          value={value}
          placeholder={answer.placeholder ?? 'Vaše odpověď'}
          onChange={(v) => {
            setValue(v)
            if (check !== 'idle') setCheck('idle')
          }}
        />
        <Button type="submit" variant="primary">
          Zkontrolovat
        </Button>
      </div>
      <Feedback check={check} onReveal={onReveal} />
    </form>
  )
}

type Pick = 'yes' | 'no' | ''
const YES_NO: { value: Pick; label: string }[] = [
  { value: 'yes', label: 'Ano' },
  { value: 'no', label: 'Ne' },
]

function MultiChoice({ answer, onReveal }: { answer: Extract<Answer, { type: 'multichoice' }>; onReveal: () => void }) {
  const [picks, setPicks] = useState<Pick[]>(() => answer.options.map(() => ''))
  const [check, setCheck] = useState<Check>('idle')
  const want = (i: number): Pick => (answer.options[i]!.correct ? 'yes' : 'no')
  const set = (i: number, v: Pick) => {
    setPicks((p) => p.map((x, j) => (j === i ? (x === v ? '' : v) : x)))
    if (check !== 'idle') setCheck('idle')
  }
  const shown = check !== 'idle'
  return (
    <div className="kab-ex-check">
      <span className="kab-ex-label">U každého tvrzení vyberte ano nebo ne</span>
      <ul className="kab-ex-opts">
        {answer.options.map((o, i) => {
          const res = shown ? (picks[i] === want(i) ? 'ok' : 'bad') : undefined
          return (
            <li key={i} className="kab-ex-opt" data-res={res}>
              <Segmented ariaLabel={`Tvrzení ${i + 1}: ano / ne`} size="sm" value={picks[i]!} options={YES_NO} onChange={(v) => set(i, v)} />
              <Html html={o.text} label className="kab-ex-opt-t" />
              {res && (
                <span className="kab-ex-mark" aria-label={res === 'ok' ? 'správně' : 'špatně'}>
                  {res === 'ok' ? '✓' : '✕'}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <div>
        <Button
          variant="primary"
          onClick={() => setCheck(answer.options.every((_, i) => picks[i] === want(i)) ? 'correct' : 'wrong')}
        >
          Zkontrolovat
        </Button>
      </div>
      <Feedback check={check} onReveal={onReveal} />
    </div>
  )
}

function Feedback({ check, onReveal }: { check: Check; onReveal: () => void }) {
  if (check === 'idle') return null
  const ok = check === 'correct'
  return (
    <div className="kab-ex-fb">
      <Verdict kind={ok ? 'ok' : 'bad'} title={ok ? 'Správně.' : 'Zatím nesedí.'}>
        {ok ? 'Pokračujte na postup řešení.' : 'Zkuste znovu nebo si zobrazte postup.'}
      </Verdict>
      <Button variant="ghost" size="sm" iconEnd="next" onClick={onReveal}>
        Zobrazit postup
      </Button>
    </div>
  )
}
