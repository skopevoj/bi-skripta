import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { ui } from './InteractiveCard'

type VariantId = 'salsa' | 'chacha'
type WordId = 'a' | 'b' | 'c' | 'd'
type InitialKind = 'constant' | 'key' | 'nonce' | 'counter'

type Action = {
  from: WordId[]
  target: WordId
  op: string
  rot?: string
  result: string
}

type ProcessStep = {
  title: string
  note: string
  focus: 'matrix' | 'quarter' | 'arx' | 'rounds'
  actions: Action[]
}

type InitialCell = {
  label: string
  kind: InitialKind
  title: string
  description: string
}

const WORDS: Record<WordId, { index: number; label: string }> = {
  a: { index: 0, label: 'a' },
  b: { index: 4, label: 'b' },
  c: { index: 8, label: 'c' },
  d: { index: 12, label: 'd' },
}

const WORD_BY_INDEX = new Map(
  Object.entries(WORDS).map(([word, meta]) => [meta.index, word as WordId]),
)

const BASE_CELLS = [
  'σ0',
  'k0',
  'k1',
  'k2',
  'k3',
  'σ1',
  'n0',
  'n1',
  't0',
  't1',
  'σ2',
  'k4',
  'k5',
  'k6',
  'k7',
  'σ3',
]

const KIND_LABELS: Record<InitialKind, string> = {
  constant: 'konstanta',
  key: 'klíč',
  nonce: 'nonce',
  counter: 'čítač',
}

const KIND_DESCRIPTIONS: Record<InitialKind, string> = {
  constant: 'Pevné veřejné slovo. Nemění tajnost, jen ukotvuje formát stavu.',
  key: 'Část tajného 256bitového klíče. Bez něj nelze vyrobit stejný blok hesla.',
  nonce: 'Veřejná hodnota unikátní pro zprávu. Se stejným klíčem se nesmí opakovat.',
  counter: 'Pořadí bloku hesla. Díky čítači generátor vyrábí další a další bloky.',
}

function cell(label: string, kind: InitialKind): InitialCell {
  return {
    label,
    kind,
    title: KIND_LABELS[kind],
    description: KIND_DESCRIPTIONS[kind],
  }
}

const INITIAL_STATES: Record<VariantId, InitialCell[]> = {
  salsa: [
    cell('σ0', 'constant'),
    cell('k0', 'key'),
    cell('k1', 'key'),
    cell('k2', 'key'),
    cell('k3', 'key'),
    cell('σ1', 'constant'),
    cell('n0', 'nonce'),
    cell('n1', 'nonce'),
    cell('i0', 'counter'),
    cell('i1', 'counter'),
    cell('σ2', 'constant'),
    cell('k4', 'key'),
    cell('k5', 'key'),
    cell('k6', 'key'),
    cell('k7', 'key'),
    cell('σ3', 'constant'),
  ],
  chacha: [
    cell('c0', 'constant'),
    cell('c1', 'constant'),
    cell('c2', 'constant'),
    cell('c3', 'constant'),
    cell('k0', 'key'),
    cell('k1', 'key'),
    cell('k2', 'key'),
    cell('k3', 'key'),
    cell('k4', 'key'),
    cell('k5', 'key'),
    cell('k6', 'key'),
    cell('k7', 'key'),
    cell('i', 'counter'),
    cell('n0', 'nonce'),
    cell('n1', 'nonce'),
    cell('n2', 'nonce'),
  ],
}

const STEPS: Record<VariantId, ProcessStep[]> = {
  salsa: [
    {
      title: 'Stav 4 × 4 slov',
      focus: 'matrix',
      note:
        'Salsa20 drží konstanty, klíč, nonce a čítač v jedné matici. Všechny další kroky jen opakovaně promíchávají její 32bitová slova.',
      actions: [],
    },
    {
      title: 'Vybere se quarter-round',
      focus: 'quarter',
      note:
        'Jedna čtveřice slov projde malou ARX míchačkou. V reálné rundě se takových čtveřic zpracuje více najednou.',
      actions: [{ from: ['a', 'b', 'c', 'd'], target: 'b', op: 'QR', result: 'a b c d' }],
    },
    {
      title: '1. změna: b',
      focus: 'arx',
      note:
        'Sečtou se sousední slova, výsledek se zarotuje a přes XOR změní cílové slovo. Tady se mění b.',
      actions: [{ from: ['a', 'd'], target: 'b', op: '+ → rot → XOR', rot: '7', result: 'b′' }],
    },
    {
      title: '2. změna: c',
      focus: 'arx',
      note:
        'Nové b se hned používá dál. Změna se tím začne šířit přes celou čtveřici.',
      actions: [{ from: ['b', 'a'], target: 'c', op: '+ → rot → XOR', rot: '9', result: 'c′' }],
    },
    {
      title: '3. změna: d',
      focus: 'arx',
      note:
        'Další XOR zasáhne d. Pořadí je důležité: každé nové slovo ovlivní následující krok.',
      actions: [{ from: ['c', 'b'], target: 'd', op: '+ → rot → XOR', rot: '13', result: 'd′' }],
    },
    {
      title: '4. změna: a',
      focus: 'arx',
      note:
        'Nakonec se změní i a. U Salsa quarter-roundu je každé ze čtyř slov přepsané právě jednou.',
      actions: [{ from: ['d', 'c'], target: 'a', op: '+ → rot → XOR', rot: '18', result: 'a′' }],
    },
    {
      title: 'Rundy: sloupce a řádky',
      focus: 'rounds',
      note:
        'Salsa střídá sloupcové a řádkové quarter-roundy. Po 20 rundách se promíchaný stav přičte k původní matici a vznikne blok hesla.',
      actions: [],
    },
  ],
  chacha: [
    {
      title: 'Stejný typ stavu',
      focus: 'matrix',
      note:
        'ChaCha také pracuje s maticí 4 × 4 a se stejnými ARX operacemi: sčítání, rotace, XOR.',
      actions: [],
    },
    {
      title: 'Vybere se quarter-round',
      focus: 'quarter',
      note:
        'ChaCha vezme čtveřici a, b, c, d, ale v ní tok vede jinak než u Salsy. Proto se změny rozptýlí rychleji.',
      actions: [{ from: ['a', 'b', 'c', 'd'], target: 'd', op: 'QR', result: 'a b c d' }],
    },
    {
      title: '1. dvojkrok: a a d',
      focus: 'arx',
      note:
        'Nejdřív se změní a sčítáním. Hned potom se přes nové a změní d a rotuje se o 16 bitů.',
      actions: [
        { from: ['a', 'b'], target: 'a', op: '+', result: 'a′' },
        { from: ['d', 'a'], target: 'd', op: 'XOR → rot', rot: '16', result: 'd′' },
      ],
    },
    {
      title: '2. dvojkrok: c a b',
      focus: 'arx',
      note:
        'Teď se stejná energie přesune spodní půlkou čtveřice: c pohltí d a potom b zareaguje na nové c.',
      actions: [
        { from: ['c', 'd'], target: 'c', op: '+', result: 'c′' },
        { from: ['b', 'c'], target: 'b', op: 'XOR → rot', rot: '12', result: 'b′' },
      ],
    },
    {
      title: '3. dvojkrok: znovu a a d',
      focus: 'arx',
      note:
        'ChaCha každé slovo protáhne míchačkou podruhé. a i d se znovu změní, tentokrát s rotací 8.',
      actions: [
        { from: ['a', 'b'], target: 'a', op: '+', result: 'a″' },
        { from: ['d', 'a'], target: 'd', op: 'XOR → rot', rot: '8', result: 'd″' },
      ],
    },
    {
      title: '4. dvojkrok: znovu c a b',
      focus: 'arx',
      note:
        'Po posledním dvojkroku už každé slovo prošlo změnou dvakrát. To je hlavní praktický rozdíl proti Salsa quarter-roundu.',
      actions: [
        { from: ['c', 'd'], target: 'c', op: '+', result: 'c″' },
        { from: ['b', 'c'], target: 'b', op: 'XOR → rot', rot: '7', result: 'b″' },
      ],
    },
    {
      title: 'Rundy: sloupce a diagonály',
      focus: 'rounds',
      note:
        'ChaCha střídá sloupcové a diagonální quarter-roundy. Po 20 rundách se výsledek přičte ke vstupu a XORuje se s otevřeným textem.',
      actions: [],
    },
  ],
}

const VARIANT_LABEL: Record<VariantId, string> = {
  salsa: 'Salsa20',
  chacha: 'ChaCha',
}

function wordLabel(word: WordId): string {
  return WORDS[word].label
}

function stepChangedWords(steps: ProcessStep[], stepIndex: number): Set<WordId> {
  const changed = new Set<WordId>()
  for (const step of steps.slice(0, stepIndex + 1)) {
    for (const action of step.actions) {
      if (step.focus === 'arx') changed.add(action.target)
    }
  }
  return changed
}

export function SalsaChaCha() {
  const [variant, setVariant] = useState<VariantId>('chacha')
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)

  const steps = STEPS[variant]
  const step = steps[stepIndex]!
  const changedWords = useMemo(
    () => stepChangedWords(steps, stepIndex),
    [steps, stepIndex],
  )
  const activeWords = new Set(step.actions.flatMap((action) => [...action.from, action.target]))
  const targetWords = new Set(step.actions.map((action) => action.target))

  useEffect(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [variant])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setStepIndex((current) => {
        if (current === steps.length - 1) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 1900)
    return () => window.clearTimeout(timer)
  }, [playing, stepIndex, steps.length])

  return (
    <div className="space-y-3">
      <div className={ui.panel}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className={ui.rowLabel}>Generátor hesla bez počítání</div>
            <p className="mt-1 max-w-[62ch] font-sans text-[13px] leading-relaxed text-ink-400">
              Nejdřív se složí počáteční stav z konstant, klíče, nonce a čítače. Pak se proklikávej tokem slov a sleduj, kam se změny v ARX kroku přenášejí.
            </p>
          </div>
          <div className="flex flex-wrap gap-1 font-sans" role="tablist" aria-label="Varianta">
            {(['salsa', 'chacha'] as const).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={variant === id}
                onClick={() => setVariant(id)}
                className={
                  'rounded border px-3 py-1.5 text-[12px] font-medium transition-colors ' +
                  (variant === id
                    ? 'border-ink-200 bg-ink-100 text-ink-950'
                    : 'border-ink-800 bg-ink-950/40 text-ink-400 hover:border-ink-700 hover:text-ink-200')
                }
              >
                {VARIANT_LABEL[id]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <InitialStateExplorer variant={variant} />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 overflow-x-auto pb-1 font-sans" role="tablist" aria-label="Kroky ARX">
          {steps.map((item, index) => {
            const active = index === stepIndex
            return (
              <button
                key={item.title}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setStepIndex(index)
                  setPlaying(false)
                }}
                className={
                  'shrink-0 rounded border px-2.5 py-1.5 text-[11px] transition-colors ' +
                  (active
                    ? 'border-ink-200 bg-ink-100 font-semibold text-ink-950'
                    : 'border-ink-800 bg-ink-950/40 text-ink-500 hover:border-ink-700 hover:text-ink-200')
                }
              >
                {index + 1}
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => {
            if (stepIndex === steps.length - 1) setStepIndex(0)
            setPlaying((value) => !value)
          }}
          className={playing ? ui.buttonPrimary : ui.button}
        >
          {playing ? 'Zastavit' : 'Přehrát kroky'}
        </button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.72fr)]">
        <div className={ui.panel}>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <div className={ui.rowLabel}>Stav a tok slov</div>
              <div className="mt-1 font-sans text-[13px] text-ink-400">
                Zvýrazněná čtveřice představuje jeden quarter-round.
              </div>
            </div>
            <div className="font-mono text-[12px] text-ink-500">
              {VARIANT_LABEL[variant]}
            </div>
          </div>
          <StateGrid
            key={`${variant}-${stepIndex}`}
            variant={variant}
            focus={step.focus}
            activeWords={activeWords}
            targetWords={targetWords}
            changedWords={changedWords}
          />
        </div>

        <div className={ui.panel}>
          <div className={ui.rowLabel}>Krok {stepIndex + 1}</div>
          <h4 className="m-0 mt-1 font-sans text-[16px] font-semibold text-ink-100">
            {step.title}
          </h4>
          <p className="m-0 mt-2 font-sans text-[14px] leading-relaxed text-ink-300">
            {step.note}
          </p>
          <FlowPanel step={step} />
        </div>
      </div>
    </div>
  )
}

function InitialStateExplorer({ variant }: { variant: VariantId }) {
  const cells = INITIAL_STATES[variant]
  return (
    <div className={ui.panel}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className={ui.rowLabel}>Počáteční stav 4 × 4 slov</div>
          <div className="mt-1 font-sans text-[13px] text-ink-400">
            Každá buňka má 32 bitů. Najeď myší nebo použij Tab pro vysvětlení role.
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 font-sans text-[11px] text-ink-500">
          {(['constant', 'key', 'nonce', 'counter'] as const).map((kind) => (
            <span key={kind} className={'scc-kind-legend scc-kind-' + kind}>
              {KIND_LABELS[kind]}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-[minmax(15rem,0.78fr)_minmax(13rem,0.45fr)]">
        <div className="scc-initial-grid" aria-label={`Počáteční stav ${VARIANT_LABEL[variant]}`}>
          {cells.map((item, index) => (
            <button
              key={`${variant}-${item.label}-${index}`}
              type="button"
              className={'scc-initial-cell scc-kind-' + item.kind}
              aria-label={`${item.label}: ${item.title}. ${item.description}`}
            >
              <span className="scc-initial-label">{item.label}</span>
              <span className="scc-initial-kind">{item.title}</span>
              <span className="scc-initial-tip" role="tooltip">
                <strong>{item.label}: {item.title}</strong>
                <span>{item.description}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="rounded border border-ink-800 bg-ink-950/60 px-3 py-2 font-sans text-[13px] leading-relaxed text-ink-400">
          <div className="font-semibold text-ink-100">
            {variant === 'salsa' ? 'Salsa20 stav' : 'ChaCha20 stav'}
          </div>
          <p className="m-0 mt-1">
            {variant === 'salsa'
              ? 'Salsa míchá 4 konstanty, 8 slov klíče, 2 slova nonce a 2 slova čítače.'
              : 'ChaCha20 stav se obvykle zapisuje jako 4 konstanty, 8 slov klíče, 1 slovo čítače a 3 slova nonce.'}
          </p>
          <p className="m-0 mt-2">
            Po 20 rundách se promíchaný stav přičte k tomuto vstupu. Výsledek je blok hesla pro XOR se zprávou.
          </p>
        </div>
      </div>
    </div>
  )
}

function StateGrid({
  variant,
  focus,
  activeWords,
  targetWords,
  changedWords,
}: {
  variant: VariantId
  focus: ProcessStep['focus']
  activeWords: Set<WordId>
  targetWords: Set<WordId>
  changedWords: Set<WordId>
}) {
  return (
    <div className={'scc-state-grid scc-focus-' + focus}>
      {BASE_CELLS.map((cell, index) => {
        const word = WORD_BY_INDEX.get(index)
        const active = word ? activeWords.has(word) || focus === 'quarter' : false
        const target = word ? targetWords.has(word) : false
        const changed = word ? changedWords.has(word) : false
        const row = Math.floor(index / 4)
        const col = index % 4
        const diagonal = variant === 'chacha' && focus === 'rounds' && row === col
        const rowRound = variant === 'salsa' && focus === 'rounds' && row === 1
        const colRound = focus === 'rounds' && col === 0
        return (
          <div
            key={`${cell}-${index}`}
            style={{ '--scc-delay': `${row * 45 + col * 25}ms` } as CSSProperties}
            className={
              'scc-cell ' +
              (active ? 'is-active ' : '') +
              (target ? 'is-target ' : '') +
              (changed ? 'is-changed ' : '') +
              (diagonal || rowRound || colRound ? 'is-round-path ' : '')
            }
          >
            <span className="scc-cell-label">
              {word ? wordLabel(word) : cell}
            </span>
            {word && changed && <span className="scc-cell-prime">′</span>}
          </div>
        )
      })}
    </div>
  )
}

function FlowPanel({ step }: { step: ProcessStep }) {
  if (step.focus === 'matrix') {
    return (
      <div className="mt-3 rounded border border-ink-800 bg-ink-950/60 px-3 py-2 font-sans text-[13px] leading-relaxed text-ink-400">
        Matice je jen pracovní paměť. Šifra z ní po rundách vyrobí blok hesla, který se potom XORuje s otevřeným textem.
      </div>
    )
  }

  if (step.focus === 'rounds') {
    return (
      <div className="mt-3 grid gap-2 font-sans text-[13px]">
        <div className="rounded border border-ink-800 bg-ink-950/60 px-3 py-2 text-ink-300">
          1. sloupcový průchod promíchá slova shora dolů
        </div>
        <div className="rounded border border-ink-800 bg-ink-950/60 px-3 py-2 text-ink-300">
          2. druhý průchod propojí vzdálenější slova {step.note.includes('diagon') ? 'po diagonálách' : 'po řádcích'}
        </div>
        <div className="rounded border border-ink-800 bg-ink-950/60 px-3 py-2 text-ink-300">
          3. po opakování se promíchaný stav přičte ke vstupu
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      {step.actions.map((action, index) => (
        <div
          key={`${action.target}-${index}`}
          style={{ '--scc-lane-delay': `${index * 170}ms` } as CSSProperties}
          className="scc-flow-lane"
        >
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            {action.from.map((word) => (
              <span key={word} className="scc-word-chip">
                {wordLabel(word)}
              </span>
            ))}
          </div>
          <span className="scc-op-chip">{action.op}</span>
          {action.rot && <span className="scc-rot-chip">rot {action.rot}</span>}
          <span className="scc-arrow" aria-hidden="true">
            →
          </span>
          <span className="scc-target-chip">
            {wordLabel(action.target)} → {action.result}
          </span>
        </div>
      ))}
    </div>
  )
}
