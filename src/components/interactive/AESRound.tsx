import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { ui } from './InteractiveCard'

type StepId = 'plain' | 'ark0' | 'start' | 'sub' | 'shift' | 'mix' | 'ark'

type Step = {
  id: StepId
  label: string
  bytes: number[]
}

type RoundTrace = {
  index: number
  label: string
  roundKey: number[]
  steps: Step[]
}

const PLAIN = '00112233445566778899aabbccddeeff'
const KEY = '000102030405060708090a0b0c0d0e0f'
const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]

function hexToBytes(hex: string): number[] {
  const out: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    out.push(parseInt(hex.slice(i, i + 2), 16))
  }
  return out
}

function hx(n: number): string {
  return n.toString(16).padStart(2, '0')
}

function rotl8(x: number, n: number): number {
  return ((x << n) | (x >> (8 - n))) & 0xff
}

function gmul(a: number, b: number): number {
  let x = a & 0xff
  let y = b & 0xff
  let r = 0
  while (y) {
    if (y & 1) r ^= x
    const hi = x & 0x80
    x = (x << 1) & 0xff
    if (hi) x ^= 0x1b
    y >>= 1
  }
  return r
}

function gpow(a: number, exp: number): number {
  let r = 1
  let x = a
  let e = exp
  while (e > 0) {
    if (e & 1) r = gmul(r, x)
    x = gmul(x, x)
    e >>= 1
  }
  return r
}

function sbox(x: number): number {
  const inv = x === 0 ? 0 : gpow(x, 254)
  return (
    inv ^
    rotl8(inv, 1) ^
    rotl8(inv, 2) ^
    rotl8(inv, 3) ^
    rotl8(inv, 4) ^
    0x63
  ) & 0xff
}

function addRoundKey(state: number[], key: number[]): number[] {
  return state.map((b, i) => b ^ key[i]!)
}

function subBytes(state: number[]): number[] {
  return state.map(sbox)
}

function shiftRows(state: number[]): number[] {
  const out = state.slice()
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      out[col * 4 + row] = state[((col + row) % 4) * 4 + row]!
    }
  }
  return out
}

function mixColumn(a: number[]): number[] {
  return [
    gmul(0x02, a[0]!) ^ gmul(0x03, a[1]!) ^ a[2]! ^ a[3]!,
    a[0]! ^ gmul(0x02, a[1]!) ^ gmul(0x03, a[2]!) ^ a[3]!,
    a[0]! ^ a[1]! ^ gmul(0x02, a[2]!) ^ gmul(0x03, a[3]!),
    gmul(0x03, a[0]!) ^ a[1]! ^ a[2]! ^ gmul(0x02, a[3]!),
  ]
}

function mixColumns(state: number[]): number[] {
  const out = state.slice()
  for (let col = 0; col < 4; col++) {
    const mixed = mixColumn(state.slice(col * 4, col * 4 + 4))
    for (let row = 0; row < 4; row++) out[col * 4 + row] = mixed[row]!
  }
  return out
}

function expandKey(key: number[]): number[][] {
  const words: number[][] = []
  for (let i = 0; i < 4; i++) words.push(key.slice(i * 4, i * 4 + 4))
  for (let i = 4; i < 44; i++) {
    let temp = words[i - 1]!.slice()
    if (i % 4 === 0) {
      temp = [temp[1]!, temp[2]!, temp[3]!, temp[0]!].map(sbox)
      temp[0] ^= RCON[i / 4]!
    }
    words.push(words[i - 4]!.map((b, j) => b ^ temp[j]!))
  }
  const roundKeys: number[][] = []
  for (let round = 0; round <= 10; round++) {
    roundKeys.push(words.slice(round * 4, round * 4 + 4).flat())
  }
  return roundKeys
}

function buildTrace(plain: number[], key: number[]): RoundTrace[] {
  const roundKeys = expandKey(key)
  const rounds: RoundTrace[] = []
  let state = plain.slice()

  rounds.push({
    index: 0,
    label: 'Init',
    roundKey: roundKeys[0]!,
    steps: [
      { id: 'plain', label: 'Plaintext', bytes: state },
      {
        id: 'ark0',
        label: 'AddRoundKey',
        bytes: addRoundKey(state, roundKeys[0]!),
      },
    ],
  })
  state = rounds[0]!.steps[1]!.bytes

  for (let round = 1; round <= 10; round++) {
    const steps: Step[] = [{ id: 'start', label: 'Vstup', bytes: state }]
    state = subBytes(state)
    steps.push({ id: 'sub', label: 'SubBytes', bytes: state })
    state = shiftRows(state)
    steps.push({ id: 'shift', label: 'ShiftRows', bytes: state })
    if (round < 10) {
      state = mixColumns(state)
      steps.push({ id: 'mix', label: 'MixColumns', bytes: state })
    }
    state = addRoundKey(state, roundKeys[round]!)
    steps.push({ id: 'ark', label: 'AddRoundKey', bytes: state })
    rounds.push({
      index: round,
      label: `Runda ${round}`,
      roundKey: roundKeys[round]!,
      steps,
    })
  }

  return rounds
}

function stepIntro(id: StepId): string {
  switch (id) {
    case 'plain':
      return 'Výchozí otevřený text zapsaný do AES stavu po sloupcích.'
    case 'ark0':
      return 'Před první rundou se stav XORuje s původním klíčem.'
    case 'start':
      return 'Stav na začátku vybrané rundy.'
    case 'sub':
      return 'Každý bajt projde nelineární substitucí S-boxem.'
    case 'shift':
      return 'Řádky matice se cyklicky posunou doleva o 0, 1, 2 a 3 pozice.'
    case 'mix':
      return 'Každý sloupec se vynásobí pevnou maticí nad GF(2^8).'
    case 'ark':
      return 'Výsledek rundy vznikne XORem stavu s rundovním klíčem.'
  }
}

function previousStep(round: RoundTrace, step: Step): Step | null {
  const index = round.steps.indexOf(step)
  return index > 0 ? round.steps[index - 1]! : null
}

export function AESRound() {
  const [roundIndex, setRoundIndex] = useState(1)
  const [stepId, setStepId] = useState<StepId>('sub')
  const [compareBit, setCompareBit] = useState(false)
  const [selected, setSelected] = useState(0)

  const plain = useMemo(() => hexToBytes(PLAIN), [])
  const key = useMemo(() => hexToBytes(KEY), [])
  const alteredPlain = useMemo(() => {
    const next = plain.slice()
    next[0] = next[0]! ^ 0x01
    return next
  }, [plain])

  const trace = useMemo(() => buildTrace(plain, key), [plain, key])
  const alteredTrace = useMemo(() => buildTrace(alteredPlain, key), [alteredPlain, key])

  const round = trace[roundIndex]!
  const validStep = round.steps.find((s) => s.id === stepId) ?? round.steps[0]!
  const step = validStep
  const stepIndex = round.steps.indexOf(step)
  const alteredStep = alteredTrace[roundIndex]!.steps[stepIndex]!
  const prev = previousStep(round, step)
  const changed = step.bytes.map((b, i) => b !== alteredStep.bytes[i])
  const changedCount = changed.filter(Boolean).length
  const selectedCol = Math.floor(selected / 4)
  const selectedRow = selected % 4

  const selectRound = (i: number) => {
    setRoundIndex(i)
    setStepId(i === 0 ? 'ark0' : 'sub')
  }

  return (
    <div className="space-y-3">
      <div className={ui.panel}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className={ui.rowLabel}>AES-128 testovací blok</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className={ui.chip}>P = {PLAIN}</span>
              <span className={ui.chip}>K = {KEY}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCompareBit((v) => !v)}
            className={
              compareBit ? ui.buttonPrimary : ui.button
            }
          >
            Změnit 1 bit
          </button>
        </div>
        {compareBit && (
          <div className="mt-3 text-[13px] text-ink-400 font-sans">
            Porovnáváme původní průchod s variantou, kde je první bajt
            plaintextu XORovaný s <code className="font-mono">01</code>.
            V aktuálním stavu se liší {changedCount}/16 bajtů.
          </div>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 font-sans" role="tablist" aria-label="Rundy AES">
        {trace.map((r, i) => {
          const active = i === roundIndex
          return (
            <button
              key={r.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => selectRound(i)}
              className={
                'shrink-0 rounded border px-3 py-1.5 text-[12px] font-medium transition-colors ' +
                (active
                  ? 'border-ink-200 bg-ink-100 text-ink-950'
                  : 'border-ink-800 bg-ink-900/40 text-ink-400 hover:border-ink-700 hover:text-ink-200')
              }
            >
              {r.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1 font-sans" role="tablist" aria-label="Kroky rundy">
        {round.steps.map((s) => {
          const active = s.id === step.id
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStepId(s.id)}
              className={
                'min-h-9 rounded border px-2 py-1.5 text-[11px] tracking-[0.08em] uppercase transition-colors ' +
                (active
                  ? 'border-ink-200 bg-ink-100 text-ink-950 font-semibold'
                  : 'border-ink-800 bg-ink-950/40 text-ink-500 hover:text-ink-200 hover:border-ink-700')
              }
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
        <div className={ui.panel}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className={ui.rowLabel}>Stav 4 × 4 bajty</div>
              <div className="mt-1 text-[13px] text-ink-400 font-sans">
                Sloupce jsou interní pořadí AES; buňky lze kliknout.
              </div>
            </div>
            <div className="text-right font-mono text-[12px] text-ink-500">
              {round.label} · {step.label}
            </div>
          </div>
          <StateMatrix
            key={`${roundIndex}-${step.id}`}
            bytes={step.bytes}
            prevBytes={prev?.bytes}
            roundKey={round.roundKey}
            stepId={step.id}
            changed={compareBit ? changed : undefined}
            selected={selected}
            highlightColumn={step.id === 'mix' ? selectedCol : undefined}
            highlightRow={step.id === 'shift' ? selectedRow : undefined}
            onSelect={setSelected}
          />
        </div>

        <div className={ui.panel}>
          <div className={ui.rowLabel + ' mb-2'}>{step.label}</div>
          <p className="m-0 text-[14px] leading-relaxed text-ink-300 font-sans">
            {stepIntro(step.id)}
          </p>
          <StepDetail
            round={round}
            step={step}
            prev={prev}
            selected={selected}
            selectedCol={selectedCol}
          />
        </div>
      </div>
    </div>
  )
}

function StateMatrix({
  bytes,
  prevBytes,
  roundKey,
  stepId,
  changed,
  selected,
  highlightColumn,
  highlightRow,
  onSelect,
}: {
  bytes: number[]
  prevBytes?: number[]
  roundKey: number[]
  stepId: StepId
  changed?: boolean[]
  selected: number
  highlightColumn?: number
  highlightRow?: number
  onSelect: (i: number) => void
}) {
  const mixCoeffs = [
    ['02', '03', '01', '01'],
    ['01', '02', '03', '01'],
    ['01', '01', '02', '03'],
    ['03', '01', '01', '02'],
  ]
  return (
    <div className={'aes-state-grid aes-main-step-' + stepId}>
      {[0, 1, 2, 3].flatMap((row) =>
        [0, 1, 2, 3].map((col) => {
          const index = col * 4 + row
          const isSelected = selected === index
          const isChanged = !!changed?.[index]
          const isColumn = highlightColumn === col
          const isRow = highlightRow === row
          const before = prevBytes?.[index]
          const keyByte = roundKey[index]
          const sourceCol = (col + row) % 4
          const fromCells = stepId === 'shift' ? sourceCol - col : 0
          const mixTerms =
            stepId === 'mix' && isColumn && prevBytes
              ? mixCoeffs[row]!.map((coef, i) => ({
                  coef,
                  byte: prevBytes[col * 4 + i]!,
                }))
              : []
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              style={
                {
                  '--aes-from-cells': fromCells,
                  '--aes-delay': `${row * 55 + col * 18}ms`,
                } as CSSProperties
              }
              className={
                'aes-main-cell relative aspect-square min-h-[3rem] rounded border font-mono transition-colors ' +
                (isSelected
                  ? 'border-ink-100 bg-ink-100 text-ink-950'
                  : isChanged
                    ? 'border-accent-veta bg-accent-veta/20 text-ink-100'
                    : isColumn || isRow
                    ? 'border-ink-600 bg-ink-900 text-ink-100'
                      : 'border-ink-800 bg-ink-950 text-ink-200 hover:border-ink-700 hover:bg-ink-900') +
                (stepId === 'mix' && isColumn ? ' is-mix-column' : '')
              }
              title={`řádek ${row}, sloupec ${col}`}
            >
              {(stepId === 'sub' || stepId === 'ark' || stepId === 'ark0') &&
                before !== undefined && (
                  <span className="aes-main-before">{hx(before)}</span>
                )}
              {stepId === 'sub' && <span className="aes-main-op">S</span>}
              {stepId === 'shift' && row > 0 && (
                <span className="aes-main-op">c{sourceCol}→c{col}</span>
              )}
              {stepId === 'mix' && isColumn && mixTerms.length > 0 && (
                <span className="aes-mix-source-cloud" aria-hidden="true">
                  {mixTerms.map((term, i) => (
                    <span
                      key={`${index}-${i}`}
                      className={`aes-mix-source aes-mix-source-${i}`}
                    >
                      {term.coef}·{hx(term.byte)}
                    </span>
                  ))}
                </span>
              )}
              {(stepId === 'ark' || stepId === 'ark0') && (
                <span className="aes-main-op">⊕{hx(keyByte!)}</span>
              )}
              <span className="aes-main-value">{hx(bytes[index]!)}</span>
              {isChanged && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent-veta" />
              )}
            </button>
          )
        }),
      )}
    </div>
  )
}

function StepDetail({
  round,
  step,
  prev,
  selected,
  selectedCol,
}: {
  round: RoundTrace
  step: Step
  prev: Step | null
  selected: number
  selectedCol: number
}) {
  const before = prev?.bytes[selected]
  const after = step.bytes[selected]
  const keyByte = round.roundKey[selected]

  if (step.id === 'sub' && before !== undefined && after !== undefined) {
    return (
      <DetailBox>
        <div className="text-ink-400">Vybraný bajt přes S-box:</div>
        <div className="mt-1 font-mono text-[16px] text-ink-100">
          {hx(before)} → {hx(after)}
        </div>
      </DetailBox>
    )
  }

  if (step.id === 'shift') {
    return (
      <DetailBox>
        <div className="grid gap-1 text-[13px] text-ink-300">
          {[0, 1, 2, 3].map((row) => (
            <div
              key={row}
              className={
                'flex items-center justify-between rounded px-2 py-1 ' +
                (selected % 4 === row ? 'bg-ink-900 text-ink-100' : '')
              }
            >
              <span>Řádek {row}</span>
              <span className="font-mono">← {row}</span>
            </div>
          ))}
        </div>
      </DetailBox>
    )
  }

  if (step.id === 'mix' && prev) {
    const beforeCol = prev.bytes.slice(selectedCol * 4, selectedCol * 4 + 4)
    const afterCol = step.bytes.slice(selectedCol * 4, selectedCol * 4 + 4)
    return (
      <DetailBox>
        <div className="text-ink-400">Vybraný sloupec {selectedCol}:</div>
        <div className="mt-1 font-mono text-[13px] text-ink-100">
          [{beforeCol.map(hx).join(' ')}] → [{afterCol.map(hx).join(' ')}]
        </div>
        <div className="mt-2 font-mono text-[12px] leading-relaxed text-ink-400">
          02 03 01 01<br />
          01 02 03 01<br />
          01 01 02 03<br />
          03 01 01 02
        </div>
      </DetailBox>
    )
  }

  if ((step.id === 'ark' || step.id === 'ark0') && prev && keyByte !== undefined) {
    return (
      <DetailBox>
        <div className="text-ink-400">Vybraný bajt:</div>
        <div className="mt-1 font-mono text-[16px] text-ink-100">
          {hx(prev.bytes[selected]!)} ⊕ {hx(keyByte)} = {hx(after!)}
        </div>
        <div className="mt-2 text-ink-400">
          Bajt klíče je přímo v odpovídající buňce hlavní matice.
        </div>
      </DetailBox>
    )
  }

  return (
    <DetailBox>
      <div className="text-ink-400">Aktuální bajt:</div>
      <div className="mt-1 font-mono text-[16px] text-ink-100">{hx(after!)}</div>
    </DetailBox>
  )
}

function DetailBox({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded border border-ink-800 bg-ink-950/60 px-3 py-2 font-sans text-[13px]">
      {children}
    </div>
  )
}
