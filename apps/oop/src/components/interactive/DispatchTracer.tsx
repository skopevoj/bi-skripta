'use client'

import { Fragment, useMemo, useState } from 'react'
import { PRESETS, generate, mulberry32, renderLines, trace, type Program } from './lib/dispatch'
import { CodeLines, cx, ix as s } from './ui'

export default function DispatchTracer() {
  const [prog, setProg] = useState<Program>(PRESETS[0])
  const [step, setStep] = useState(0) // number of revealed steps
  const [guess, setGuess] = useState('')
  const [ceGuess, setCeGuess] = useState(false)
  const [checked, setChecked] = useState(false)

  const lines = useMemo(() => renderLines(prog), [prog])
  const t = useMemo(() => trace(prog), [prog])
  const total = t.steps.length
  const cur = step > 0 ? t.steps[step - 1] : null
  const finished = step >= total

  const load = (p: Program) => {
    setProg(p)
    setStep(0)
    setGuess('')
    setCeGuess(false)
    setChecked(false)
  }
  const randomize = () => {
    for (;;) {
      const p = generate(mulberry32((Math.random() * 2 ** 32) >>> 0))
      if (JSON.stringify(p.classes) !== JSON.stringify(prog.classes)) return load(p)
    }
  }

  const ans = ceGuess ? 'CE' : guess.trim()
  const correct = ans === t.output
  const check = () => {
    setChecked(true)
    setStep(total)
  }

  return (
    <div className={s.stack}>
      <div className={s.row}>
        <div className="chips" role="group" aria-label="Příklad">
          {PRESETS.map((p) => (
            <button key={p.id} className={cx('chip', prog.id === p.id && 'on')} style={{ fontFamily: 'var(--sans)' }} onClick={() => load(p)}>
              {p.label}
            </button>
          ))}
          <button className={cx('chip', prog.id === 'rnd' && 'on')} style={{ fontFamily: 'var(--sans)' }} onClick={randomize}>
            Náhodný ↻
          </button>
        </div>
      </div>

      <CodeLines lines={lines} hl={cur ? new Set(cur.lines) : null} ce={cur?.ce} />

      {cur && (
        <div className={s.stepBox} key={step}>
          <div className={s.trail}>
            {t.steps.slice(0, step).map((st, i) => (
              <Fragment key={i}>
                {i > 0 && <i aria-hidden="true">→</i>}
                <span className={cx(i === step - 1 && s.trailCur, st.ce && s.trailCe)}>{st.fact}</span>
              </Fragment>
            ))}
          </div>
          <span className={s.stT}>
            {step}. {cur.title}
          </span>
          <div className={s.stBody} dangerouslySetInnerHTML={{ __html: cur.html }} />
        </div>
      )}

      <div className={s.guess}>
        <input
          type="text"
          value={guess}
          disabled={ceGuess || checked}
          placeholder="Výstup"
          aria-label="Co se vypíše"
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ans && check()}
        />
        <label className="chk">
          <input type="checkbox" checked={ceGuess} disabled={checked} onChange={(e) => setCeGuess(e.target.checked)} />
          Nezkompiluje se
        </label>
        {!checked ? (
          <button className={cx('btn sm', s.btnSm)} disabled={!ans} onClick={check}>
            Ověřit
          </button>
        ) : (
          <span className={s.fb}>
            <b className={correct ? s.ok : s.bad}>{correct ? 'Správně.' : 'Ne.'}</b>
            {t.output === 'CE' ? 'Nezkompiluje se.' : <>Vypíše <code>{t.output}</code>.</>}
          </span>
        )}
      </div>

      <div className={s.ctrl}>
        {!finished && (
          <button className={cx('btn ghost sm', s.btnSm)} onClick={() => setStep(step + 1)}>
            {step === 0 ? 'Krokovat' : 'Další krok'} <span className={s.muted}>{step + 1}/{total}</span>
          </button>
        )}
        {step > 0 && (
          <button className="lnk" onClick={() => setStep(step - 1)}>
            Zpět
          </button>
        )}
        {!finished && step > 0 && (
          <button className="lnk" onClick={() => setStep(total)}>
            Na konec
          </button>
        )}
        {finished && !checked && (
          <span className={s.result}>
            Výsledek: {t.output === 'CE' ? <b className="yn n">compile error</b> : <code>{t.output}</code>}
          </span>
        )}
      </div>
    </div>
  )
}
