import { useMemo, useState, type ReactNode } from 'react'
import { ByteGrid, Formula, Grid, Row, StepNote, StepperBar, TextField, Verdict, Widget, hex2, usePresetState, useStepper, type Tone } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { AES_SBOX, MIX, aesTrace, bytesToHex, gmul, hexToBytes, type AesOp } from './lib/symmetric'

// AES-128 krok za krokem: co udělá každá ze čtyř operací rundy se stavem 4 × 4 bajty.
// Výchozí příklad je FIPS-197, příloha B (klíč 2b7e1516…, OT 3243f6a8…).

type State = { pt: string; key: string }

const FIPS_B = { pt: '3243f6a8885a308d313198a2e0370734', key: '2b7e151628aed2a6abf7158809cf4f3c' }
const FIPS_C = { pt: '00112233445566778899aabbccddeeff', key: '000102030405060708090a0b0c0d0e0f' }
const KNOWN: Record<string, string> = {
  [FIPS_B.pt + FIPS_B.key]: '3925841d02dc09fbdc118597196a0b32',
  [FIPS_C.pt + FIPS_C.key]: '69c4e0d86a7b0430d8cdb78070b4c55a',
}

const PRESETS = [
  { label: 'FIPS-197 příloha B', values: FIPS_B },
  { label: 'FIPS-197 příloha C.1', values: FIPS_C, note: 'Druhý testovací vektor normy; výsledek musí vyjít 69c4e0d8…' },
] as const

const OP_NAME: Record<AesOp, string> = { input: 'Vstup', sub: 'SubBytes', shift: 'ShiftRows', mix: 'MixColumns', ark: 'AddRoundKey' }
const hexOnly = (s: string) => s.toLowerCase().replace(/[^0-9a-f]/g, '')
const rc = (i: number) => `[${i & 3}, ${i >> 2}]` // [řádek, sloupec]

function check(s: string, what: string) {
  if (s.length !== 32) return `${what} musí mít 32 hex znaků (16 bajtů), teď má ${s.length}.`
  return undefined
}

export function AESRound({ title, lead }: WidgetProps) {
  const st = usePresetState<State>(FIPS_B, PRESETS)
  const { pt, key } = st.value
  const ePt = check(pt, 'OT')
  const eKey = check(key, 'Klíč K')
  const ok = !ePt && !eKey

  const trace = useMemo(() => (ok ? aesTrace(hexToBytes(pt)!, hexToBytes(key)!) : null), [ok, pt, key])
  const steps = trace?.steps ?? []
  const s = useStepper(Math.max(1, steps.length), { resetKey: `${pt}|${key}` })
  const [sel, setSel] = useState(0)

  const step = steps[s.index]
  const out = steps.length ? bytesToHex(steps[steps.length - 1]!.after) : ''
  const known = KNOWN[pt + key]

  return (
    <Widget
      title={title ?? 'AES-128 po krocích'}
      lead={lead ?? 'Krokujte rundy AES a klikněte na bajt výsledku: uvidíte, z čeho vznikl.'}
      {...st.widget}
      onRandom={() => {
        const r = () => Array.from({ length: 16 }, () => hex2(Math.floor(Math.random() * 256))).join('')
        st.set({ pt: r(), key: r() })
      }}
      footer={
        <p>
          SubBytes je jediná nelineární operace (konfúze); ShiftRows a MixColumns rozprostřou každý bajt do celého stavu (difúze) — po dvou rundách
          závisí každý bajt na všech bajtech vstupu. AddRoundKey je jediné místo, kde do šifry vstupuje klíč. V 10. rundě se MixColumns vynechává.
        </p>
      }
    >
      <Grid min={260}>
        <TextField label="OT (16 bajtů hex)" value={pt} onChange={(v) => st.set({ pt: v })} normalize={hexOnly} maxLength={32} error={ePt} />
        <TextField label="Klíč K (16 bajtů hex)" value={key} onChange={(v) => st.set({ key: v })} normalize={hexOnly} maxLength={32} error={eKey} />
      </Grid>

      {!trace || !step ? (
        <Verdict kind="bad" title="Nelze šifrovat">
          {ePt ?? eKey}
        </Verdict>
      ) : (
        <>
          <StepperBar stepper={s} label={(i) => (i === 0 ? 'Vstup' : `Runda ${steps[i]!.round} · ${OP_NAME[steps[i]!.op]}`)} speeds={[1, 2, 4]} />
          <StepNote title={step.op === 'input' ? 'Vstup' : `Runda ${step.round} · ${OP_NAME[step.op]}`}>{stepNote(step.op, step.round)}</StepNote>
          <StepView step={step} roundKey={trace.roundKeys[step.round]!} sel={sel} onSel={setSel} />
          {s.atEnd && (
            <Verdict kind="ok" title={`ŠT = ${out}`}>
              {known === out ? 'Shoduje se s testovacím vektorem FIPS-197.' : 'Po 10 rundách je stav šifrovým textem (čte se po sloupcích).'}
            </Verdict>
          )}
        </>
      )}
    </Widget>
  )
}

function stepNote(op: AesOp, round: number): ReactNode {
  switch (op) {
    case 'input':
      return 'Blok OT se zapíše do matice 4 × 4 po sloupcích: první čtyři bajty tvoří první sloupec.'
    case 'sub':
      return 'SubBytes nahradí každý bajt podle S-boxu (inverze v GF(2⁸) + afinní zobrazení) — jediná nelineární operace.'
    case 'shift':
      return 'ShiftRows posune řádek r cyklicky o r bajtů doleva; řádek 0 zůstane.'
    case 'mix':
      return 'MixColumns vynásobí každý sloupec pevnou maticí v GF(2⁸), takže každý výstupní bajt závisí na celém sloupci.'
    case 'ark':
      return round === 0
        ? 'Před první rundou se stav XORuje s klíčem K₀, což je přímo šifrovací klíč.'
        : round === 10
          ? 'Poslední AddRoundKey s K₁₀ — 10. runda neměla MixColumns. Stav je teď šifrový text.'
          : `AddRoundKey XORuje stav s rundovním klíčem K${sub(round)} z expanze klíče.`
  }
}

const SUBS = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => String(n).replace(/\d/g, (d) => SUBS[Number(d)]!)

/** Odkud pochází bajt i výsledku (indexy v původním stavu). */
function sources(op: AesOp, i: number): number[] {
  const r = i & 3
  const c = i >> 2
  if (op === 'shift') return [4 * ((c + r) & 3) + r]
  if (op === 'mix') return [0, 1, 2, 3].map((j) => 4 * c + j)
  return [i]
}

function StepView({ step, roundKey, sel, onSel }: { step: { round: number; op: AesOp; before: number[]; after: number[] }; roundKey: number[]; sel: number; onSel: (i: number) => void }) {
  const { op, before, after } = step
  const src = sources(op, sel)
  const srcTone = (i: number): Tone | undefined => (op !== 'input' && src.includes(i) ? 'active' : undefined)
  const kTone = (i: number): Tone | undefined => (i === sel ? 'active' : undefined)
  const outTone = (i: number): Tone | undefined => (i === sel ? 'active' : op !== 'input' && after[i] !== before[i] ? 'changed' : undefined)

  if (op === 'input') {
    return (
      <ByteGrid bytes={after} cols={4} columnMajor size="lg" label="Stav (OT)" onSelect={onSel} selected={sel} tone={(i) => (i === sel ? 'active' : undefined)} sub={(i) => (i === sel ? rc(i) : undefined)} />
    )
  }
  return (
    <>
      <Row gap={5} align="start">
        <ByteGrid bytes={before} cols={4} columnMajor label="Před" tone={srcTone} />
        {op === 'ark' && <ByteGrid bytes={roundKey} cols={4} columnMajor label={`⊕ Klíč K${sub(step.round)}`} tone={kTone} />}
        <ByteGrid bytes={after} cols={4} columnMajor label="Po — klikněte na bajt" onSelect={onSel} selected={sel} tone={outTone} />
      </Row>
      <ByteDetail op={op} before={before} after={after} roundKey={roundKey} i={sel} />
    </>
  )
}

function ByteDetail({ op, before, after, roundKey, i }: { op: AesOp; before: number[]; after: number[]; roundKey: number[]; i: number }) {
  const r = i & 3
  const c = i >> 2
  const h = hex2
  switch (op) {
    case 'sub': {
      const x = before[i]!
      return <Formula label={`Bajt ${rc(i)}`} steps={[`S(${h(x)})`, `S-box[řádek ${(x >> 4).toString(16)}, sloupec ${(x & 15).toString(16)}]`]} result={h(AES_SBOX[x]!)} />
    }
    case 'shift': {
      const from = 4 * ((c + r) & 3) + r
      return <Formula label={`Bajt ${rc(i)}`} steps={[`s′[${r}, ${c}] = s[${r}, (${c} + ${r}) mod 4]`, `s[${r}, ${(c + r) & 3}]`]} result={h(before[from]!)} />
    }
    case 'mix': {
      const col = [0, 1, 2, 3].map((j) => before[4 * c + j]!)
      const coef = MIX[r]!
      return (
        <Formula
          label={`Bajt ${rc(i)}`}
          steps={[coef.map((m, j) => `${h(m)}·${h(col[j]!)}`).join(' ⊕ '), coef.map((m, j) => h(gmul(m, col[j]!))).join(' ⊕ ')]}
          result={h(after[i]!)}
        />
      )
    }
    case 'ark':
      return <Formula label={`Bajt ${rc(i)}`} steps={[`${h(before[i]!)} ⊕ ${h(roundKey[i]!)}`]} result={h(after[i]!)} />
    default:
      return null
  }
}
