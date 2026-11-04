import { useMemo } from 'react'
import { CellRows, KeyValue, Segmented, StepNote, StepperBar, Toggle, Verdict, Grid, Widget, usePresetState, useStepper, type CellInput } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { cz, pct, plural, randomSeed, rng, sup } from './lib/classical'

// BB84. Jedna otázka: proč odposlech prozradí chyby v prosetém klíči (≈ 25 %).

type Basis = '+' | '×'
type State = { seed: number; n: number; eve: boolean }

type Photon = {
  aBit: number
  aBasis: Basis
  eBasis: Basis
  eBit: number
  bBasis: Basis
  bBit: number
  match: boolean // Alice a Bob měli stejnou bázi
}

const DEFAULT_SEED = 8

// Polarizace podle přednášky: báze + → |0⟩ = „|“, |1⟩ = „—“; báze × → |0⟩ = „\“, |1⟩ = „/“.
const POL: Record<Basis, [string, string]> = { '+': ['|', '—'], '×': ['\\', '/'] }

/** Simulace protokolu. Náhodná čísla se berou vždy ve stejném pořadí, takže zapnutí Evy nemění volby Alice a Boba. */
function simulate(seed: number, n: number, eve: boolean): Photon[] {
  const r = rng(seed)
  const out: Photon[] = []
  for (let i = 0; i < n; i++) {
    const aBit = r() < 0.5 ? 0 : 1
    const aBasis: Basis = r() < 0.5 ? '+' : '×'
    const eBasisRaw: Basis = r() < 0.5 ? '+' : '×'
    const eGuess = r() < 0.5 ? 0 : 1
    const bBasis: Basis = r() < 0.5 ? '+' : '×'
    const bGuess = r() < 0.5 ? 0 : 1
    // Foton, který dorazí k Bobovi: bez Evy Alicin, s Evou ten, který Eva naměřila a poslala dál ve své bázi.
    let photonBasis = aBasis
    let photonBit = aBit
    let eBit = aBit
    if (eve) {
      eBit = eBasisRaw === aBasis ? aBit : eGuess
      photonBasis = eBasisRaw
      photonBit = eBit
    }
    const bBit = bBasis === photonBasis ? photonBit : bGuess
    out.push({ aBit, aBasis, eBasis: eBasisRaw, eBit, bBasis, bBit, match: aBasis === bBasis })
  }
  return out
}

const PRESETS = [
  { label: 'Bez odposlechu', values: { seed: DEFAULT_SEED, n: 16, eve: false } },
  {
    label: 'S odposlechem',
    values: { seed: DEFAULT_SEED, n: 16, eve: true },
    note: 'Stejné volby Alice a Boba, jen Eva mezi nimi měří. Kde zvolí špatnou bázi (1/2), pošle dál náhodně polarizovaný foton a Bob se splete s pravděpodobností 1/2 — celkem 1/4.',
  },
]

const STEPS = ['Alice posílá', 'Eva měří', 'Bob měří', 'Porovnání bází', 'Kontrola klíče']

export function BB84({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ seed: DEFAULT_SEED, n: 16, eve: false }, PRESETS)
  const { seed, n, eve } = st.value
  const rows = useMemo(() => simulate(seed, n, eve), [seed, n, eve])
  const s = useStepper(STEPS.length, { resetKey: `${seed},${n}` })
  const step = s.index

  const sifted = rows.filter((r) => r.match)
  const errors = sifted.filter((r) => r.aBit !== r.bBit).length
  const rate = sifted.length ? errors / sifted.length : 0
  const longRun = useMemo(() => {
    const big = simulate(seed + 1, 20000, eve).filter((r) => r.match)
    return big.filter((r) => r.aBit !== r.bBit).length / big.length
  }, [seed, eve])
  const detect = 1 - 0.75 ** sifted.length

  const blank = (cells: CellInput[], from: number) => (step >= from ? cells : cells.map(() => ''))
  const sym = (b: Basis, bit: number) => POL[b][bit]!

  const table = [
    { label: 'Alice: bit', cells: rows.map((r) => r.aBit) },
    { label: 'Alice: báze', cells: rows.map((r) => r.aBasis) },
    { label: 'foton', cells: rows.map((r) => sym(r.aBasis, r.aBit)) },
    ...(eve
      ? [
          { label: 'Eva: báze', cells: blank(rows.map((r) => ({ v: r.eBasis, tone: r.eBasis !== r.aBasis ? ('warn' as const) : undefined })), 1), muted: true },
          { label: 'Eva: naměří', cells: blank(rows.map((r) => ({ v: r.eBit, tone: r.eBit !== r.aBit ? ('bad' as const) : undefined })), 1), muted: true },
          { label: 'foton dál', cells: blank(rows.map((r) => sym(r.eBasis, r.eBit)), 1), muted: true },
        ]
      : []),
    { label: 'Bob: báze', cells: blank(rows.map((r) => r.bBasis), 2) },
    { label: 'Bob: naměří', cells: blank(rows.map((r) => r.bBit), 2) },
    { label: 'shodná báze', cells: blank(rows.map((r) => ({ v: r.match ? '✓' : '·', tone: r.match ? ('ok' as const) : ('dim' as const) })), 3) },
    {
      label: 'klíč (Bob)',
      cells: blank(
        rows.map((r) =>
          r.match ? { v: r.bBit, tone: step >= 4 ? (r.aBit === r.bBit ? ('ok' as const) : ('bad' as const)) : undefined } : { v: '', tone: 'dim' as const },
        ),
        3,
      ),
    },
  ]

  const evePicks = rows.filter((r) => r.eBasis !== r.aBasis).length
  const note = [
    `Alice zvolí ${n} náhodných bitů a ke každému náhodnou bázi (+ nebo ×) a pošle Bobovi odpovídající polarizované fotony.`,
    eve
      ? `Eva musí každý foton změřit, aby se něco dozvěděla; u ${evePicks} z ${n} zvolila jinou bázi než Alice, naměřila náhodný bit a poslala dál foton ve své bázi.`
      : 'Nikdo neodposlouchává — fotony dorazí k Bobovi tak, jak je Alice poslala.',
    'Bob měří v náhodně zvolených bázích; kde se jeho báze liší od báze fotonu, dostane náhodný bit.',
    `Alice a Bob si veřejným kanálem řeknou jen báze (ne bity) a ponechají ${sifted.length} pozic, kde se shodly — to je prosetý klíč.`,
    eve
      ? `Porovnají (obětují) bity prosetého klíče: ${errors} z ${sifted.length} nesouhlasí — chyby zavedla Eva.`
      : `Porovnají bity prosetého klíče: všech ${sifted.length} souhlasí, protože bez rušení dá měření ve stejné bázi vždy Alicin bit.`,
  ][step]

  return (
    <Widget
      title={title ?? 'BB84 — kvantová distribuce klíče'}
      lead={lead ?? 'Projděte protokol krok po kroku, pak zapněte odposlech a porovnejte chybovost prosetého klíče.'}
      {...st.widget}
      onRandom={() => st.set({ seed: randomSeed() })}
      footer={
        <p>
          Eva nezná báze předem, takže v polovině případů měří špatně a foton tím změní. Na pozicích prosetého klíče pak vznikne chyba s pravděpodobností
          1/2 · 1/2 = 1/4. Porovnáním m bitů ji Alice s Bobem odhalí s pravděpodobností 1 − (3/4)ᵐ; bez Evy je chybovost (bez šumu) nulová.
        </p>
      }
    >
      <Grid min={200}>
        <Toggle label="Odposlech (Eva)" checked={eve} onChange={(v) => st.set({ eve: v })} hint="Eva měří každý foton a posílá dál, co naměřila." />
        <Segmented
          label="Počet fotonů"
          value={n}
          onChange={(v) => st.set({ n: v })}
          options={[
            { value: 16, label: '16' },
            { value: 32, label: '32' },
            { value: 64, label: '64' },
          ]}
        />
      </Grid>

      <StepperBar stepper={s} label={(i) => STEPS[i]} />
      <StepNote title={`${step + 1}. ${STEPS[step]}`}>{note}</StepNote>

      <CellRows ariaLabel="Průběh BB84 po fotonech" head={rows.map((_, i) => i + 1)} rows={table} />

      {s.atEnd && (
        <>
          <KeyValue
            cols={3}
            items={[
              { k: 'Prosetý klíč', v: `${sifted.length} z ${n} bitů`, hint: 'shodná báze ≈ 1/2' },
              { k: 'Chybovost', v: `${errors} / ${sifted.length} = ${pct(rate)}`, tone: errors ? 'bad' : 'ok' },
              { k: 'Dlouhodobě', v: pct(longRun), hint: `simulace ${cz(20000)} fotonů` },
            ]}
          />
          {!eve ? (
            <Verdict kind="ok" title="Klíče Alice a Boba se shodují">
              Bez odposlechu dává měření ve shodné bázi vždy Alicin bit, takže prosetý klíč je stejný na obou stranách.
            </Verdict>
          ) : errors > 0 ? (
            <Verdict kind="bad" title={`Odposlech odhalen: ${plural(errors, 'chyba', 'chyby', 'chyb')} v ${sifted.length} bitech`}>
              Očekávaná chybovost s Evou je 25 %; při {sifted.length} porovnaných bitech ji odhalí s pravděpodobností 1 − (3/4){sup(sifted.length)} = {pct(detect)}.
            </Verdict>
          ) : (
            <Verdict kind="warn" title="Eva měla štěstí — žádná chyba">
              Při {sifted.length} bitech projde odposlech bez chyby s pravděpodobností (3/4){sup(sifted.length)} = {pct(1 - detect)}. Zkuste víc fotonů.
            </Verdict>
          )}
        </>
      )}
    </Widget>
  )
}
