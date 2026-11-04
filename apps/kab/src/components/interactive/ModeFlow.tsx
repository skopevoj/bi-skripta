import { Fragment, useMemo, type ReactNode } from 'react'
import {
  BitRow,
  Cells,
  Flow,
  FlowArrow,
  FlowBox,
  FlowOp,
  FlowText,
  Formula,
  Grid,
  KeyValue,
  Panel,
  Row,
  Segmented,
  Stack,
  StepNote,
  StepperBar,
  TextField,
  Verdict,
  Widget,
  usePresetState,
  useStepper,
  type Preset,
  type Tone,
} from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { bin4, modeDecrypt, modeEncrypt, popcount, type Mode, type ModeBlock } from './lib/symmetric'

// Pět operačních módů (ECB, CBC, CFB, OFB, CTR) se stejným rozvržením, aby šly porovnat:
// stejné vstupy, stejný diagram po blocích, stejné krokování a stejný přehled vlastností.
// Otázka: odkud bere blok i svůj vstup — a co z toho plyne pro paralelizaci a šíření chyb?
// Bloková šifra E_K je hračková 4bitová (E_K(x) = S(x ⊕ K), S-box šifry PRESENT), aby šly hodnoty přepočítat ručně.

/* ------------------------------------------------------------------ */
/* Pomocné                                                             */
/* ------------------------------------------------------------------ */

const SUBS = '₀₁₂₃₄₅₆₇₈₉'
const sub = (n: number) => String(n).replace(/\d/g, (d) => SUBS[Number(d)]!)

/** E_K / D_K v HTML textu. */
const EK = (d = false) => (
  <>
    {d ? 'D' : 'E'}
    <sub>K</sub>
  </>
)
/** E_K / D_K v SVG. */
const svgEK = (d = false) => (
  <>
    {d ? 'D' : 'E'}
    <tspan fontSize="10" dy="4">
      K
    </tspan>
  </>
)

const bitsWord = (n: number) => (n === 1 ? 'bit' : n < 5 ? 'bity' : 'bitů')
const blocksWord = (n: number) => (n === 1 ? 'blok' : n < 5 ? 'bloky' : 'bloků')

/** Text s „_{…}“ / „_i“ → HTML dolní index (krátké popisky vlastností). */
function withSubs(s: string): ReactNode {
  return s.split(/(_\{[^}]+\}|_[A-Za-z])/g).map((p, i) => (p.startsWith('_') ? <sub key={i}>{p.replace(/^_\{?/, '').replace(/\}$/, '')}</sub> : <Fragment key={i}>{p}</Fragment>))
}

type View = 'enc' | 'dec'
type State = { ot: string; k: string; iv: string; view: View; flip: number }

function parseBlocks(s: string): { blocks?: number[]; error?: string } {
  const bits = s.replace(/\s+/g, '')
  if (!bits) return { error: 'Zadejte aspoň jeden blok (4 bity), např. 1001.' }
  if (bits.length % 4) return { error: `Text má ${bits.length} bitů — délka musí být násobek 4 (bloky po 4 bitech).` }
  if (bits.length > 24) return { error: `Nejvýš 6 bloků (24 bitů), teď je jich ${bits.length / 4}.` }
  const blocks: number[] = []
  for (let i = 0; i < bits.length; i += 4) blocks.push(parseInt(bits.slice(i, i + 4), 2))
  return { blocks }
}

function parse4(s: string, what: string): { v?: number; error?: string } {
  if (s.length !== 4) return { error: `${what} musí mít přesně 4 bity, teď má ${s.length}.` }
  return { v: parseInt(s, 2) }
}

const onlyBits = (s: string) => s.replace(/[^01 ]/g, '')
const only4 = (s: string) => s.replace(/[^01]/g, '').slice(0, 4)

/* ------------------------------------------------------------------ */
/* Popis módů (slovník přednášky)                                      */
/* ------------------------------------------------------------------ */

type Prop = { v: string; hint: string }
type Spec = {
  name: string
  usesIV: boolean
  ivLabel?: string
  ivHint?: string
  /** Rovnice z přednášky (KaTeX). */
  texEnc: string
  texDec: string
  enc: Prop
  dec: Prop
  /** Chyba 1 bitu v ŠT_i; v `hint` se „_i“ a „_{i+1}“ dosadí. */
  err: Prop
  errNote: string
  sameNote: string
  extra?: Preset<State>[]
  footer: ReactNode
}

const BASE: Omit<State, 'view' | 'flip'> = { ot: '1001 0110 1001 1100', k: '1011', iv: '1010' }

const TOY = (
  <>
    {' '}
    Blok tu má jen 4 bity a E<sub>K</sub> je hračková šifra (S-box šifry PRESENT), aby šlo vše přepočítat ručně; skutečné šifry mají blok 128 b.
  </>
)

const SPECS: Record<Mode, Spec> = {
  ecb: {
    name: 'ECB',
    usesIV: false,
    texEnc: '\\text{ŠT}_i = E_K(\\text{OT}_i)',
    texDec: '\\text{OT}_i = D_K(\\text{ŠT}_i)',
    enc: { v: 'paralelně', hint: 'každý blok je nezávislý' },
    dec: { v: 'paralelně', hint: 'každý blok je nezávislý' },
    err: { v: 'jen blok i', hint: 'celý OT_i je špatně, ostatní bloky vyjdou správně' },
    errNote: 'Chyba zůstane v jediném bloku: celý OT₂ je špatně, ostatní bloky vyjdou správně.',
    sameNote: 'Všechny bloky ŠT vyjdou stejně — ECB prozradí strukturu zprávy.',
    footer: (
      <p>
        Stejný blok OT dá vždy stejný blok ŠT, takže ECB prozradí opakování a útočník může bloky přeskupovat, mazat a vkládat.{TOY}
      </p>
    ),
  },
  cbc: {
    name: 'CBC',
    usesIV: true,
    ivLabel: 'IV (= ŠT₀)',
    texEnc: '\\text{ŠT}_i = E_K(\\text{OT}_i \\oplus \\text{ŠT}_{i-1}),\\quad \\text{ŠT}_0 = \\text{IV}',
    texDec: '\\text{OT}_i = \\text{ŠT}_{i-1} \\oplus D_K(\\text{ŠT}_i)',
    enc: { v: 'sériově', hint: 'blok i potřebuje ŠT_{i−1}' },
    dec: { v: 'paralelně', hint: 'ŠT_{i−1} i ŠT_i už máme' },
    err: { v: 'bloky i a i+1', hint: 'celý OT_i a tentýž bit v OT_{i+1}; pak se mód sám zotaví' },
    errNote: 'Celý OT₂ je špatně a v OT₃ je překlopený tentýž bit; OT₄ už vyjde správně — po 2 správných blocích ŠT se mód zotaví.',
    sameNote: 'Stejné bloky OT dají různé ŠT, protože se před šifrováním XORují s předchozím ŠT.',
    footer: (
      <p>
        Řetězení přes ŠT<sub>i−1</sub> skryje opakované bloky, ale šifrování musí jít blok po bloku. Dešifrování je paralelní: každý OT
        <sub>i</sub> potřebuje jen dva přijaté bloky ŠT.{TOY}
      </p>
    ),
  },
  cfb: {
    name: 'CFB',
    usesIV: true,
    ivLabel: 'IV (= ŠT₀)',
    texEnc: '\\text{ŠT}_i = \\text{OT}_i \\oplus E_K(\\text{ŠT}_{i-1}),\\quad \\text{ŠT}_0 = \\text{IV}',
    texDec: '\\text{OT}_i = \\text{ŠT}_i \\oplus E_K(\\text{ŠT}_{i-1})',
    enc: { v: 'sériově', hint: 'heslo bloku i vzniká ze ŠT_{i−1}' },
    dec: { v: 'paralelně', hint: 'všechny ŠT už máme' },
    err: { v: 'bloky i a i+1', hint: 'tentýž bit v OT_i a celý OT_{i+1}; pak se mód sám zotaví' },
    errNote: 'V OT₂ je špatně jen překlopený bit (přímý XOR), ale celý OT₃ je poškozený, protože ŠT₂ vstupuje do E_K dalšího bloku.',
    sameNote: 'Stejné bloky OT dají různé ŠT, protože heslo E_K(ŠT_{i−1}) se s každým blokem mění.',
    footer: (
      <p>
        CFB dělá z blokové šifry samosynchronizující proudovou šifru: heslo E<sub>K</sub>(ŠT<sub>i−1</sub>) závisí na předchozím ŠT. I při
        dešifrování se volá jen E<sub>K</sub>, D<sub>K</sub> není potřeba.{TOY}
      </p>
    ),
  },
  ofb: {
    name: 'OFB',
    usesIV: true,
    ivLabel: 'IV (= H₀)',
    texEnc: 'H_i = E_K(H_{i-1}),\\ H_0 = \\text{IV},\\quad \\text{ŠT}_i = \\text{OT}_i \\oplus H_i',
    texDec: '\\text{OT}_i = \\text{ŠT}_i \\oplus H_i',
    enc: { v: 'heslo sériově', hint: 'H_i nezávisí na OT — dá se předpočítat, ⊕ pak paralelně' },
    dec: { v: 'heslo sériově', hint: 'stejné heslo jako při šifrování, ⊕ paralelně' },
    err: { v: 'jen 1 bit', hint: 'tentýž bit v OT_i — chyba se nešíří' },
    errNote: 'Poškozený je jen překlopený bit OT₂ — heslo nezávisí na ŠT, takže se chyba nešíří.',
    sameNote: 'Stejné bloky OT dají různé ŠT, protože každý blok má jiné heslo H_i.',
    extra: [
      {
        label: 'Příklad 4.4',
        values: { ot: '0110 1011 1001', k: '1011', iv: '1111', view: 'enc', flip: -1 },
        note: 'Ze cvičení: ŠT₂ = 1101 a H₃ = E_K(H₂) = 0111, takže ŠT₃ = OT₃ ⊕ H₃ = 1001 ⊕ 0111 = 1110. Dokrokujte na blok 3.',
      },
    ],
    footer: (
      <p>
        OFB je synchronní proudová šifra: heslo H<sub>1</sub>, H<sub>2</sub>, … závisí jen na K a IV, ne na zprávě. Chyba v ŠT se proto nešíří,
        ale ztráta bloku (rozsynchronizování) je fatální. Při dešifrování se volá jen E<sub>K</sub>.{TOY}
      </p>
    ),
  },
  ctr: {
    name: 'CTR',
    usesIV: true,
    ivLabel: 'IV (počátek čítače)',
    ivHint: 'V praxi IV = nonce ‖ čítač.',
    texEnc: '\\text{CTR}_i = |\\text{IV} + i - 1|_{2^B},\\ H_i = E_K(\\text{CTR}_i),\\ \\text{ŠT}_i = \\text{OT}_i \\oplus H_i',
    texDec: '\\text{OT}_i = \\text{ŠT}_i \\oplus E_K(\\text{CTR}_i)',
    enc: { v: 'paralelně', hint: 'H_i závisí jen na čítači; jde i náhodný přístup' },
    dec: { v: 'paralelně', hint: 'jde dešifrovat i jediný blok uprostřed zprávy' },
    err: { v: 'jen 1 bit', hint: 'tentýž bit v OT_i — chyba se nešíří' },
    errNote: 'Poškozený je jen překlopený bit OT₂ — heslo H₂ = E_K(CTR₂) na ŠT nezávisí.',
    sameNote: 'Stejné bloky OT dají různé ŠT, protože čítač roste a každý blok má jiné heslo H_i.',
    extra: [
      {
        label: 'Přetečení čítače',
        values: { ...BASE, iv: '1110', view: 'enc', flip: -1 },
        note: 'Čítač se počítá modulo 2^B (zde B = 4): po 1111 následuje 0000. Hodnota čítače se pod jedním klíčem nesmí opakovat.',
      },
    ],
    footer: (
      <p>
        Heslo H<sub>i</sub> = E<sub>K</sub>(CTR<sub>i</sub>) závisí jen na čítači, takže všechny bloky jde spočítat najednou v obou směrech.
        Čítač se pod jedním klíčem nesmí opakovat — jinak ŠT ⊕ ŠT′ = OT ⊕ OT′.{TOY}
      </p>
    ),
  },
}

/* ------------------------------------------------------------------ */
/* Diagram                                                             */
/* ------------------------------------------------------------------ */

const CW = 150 // šířka sloupce bloku
const R1 = 30
const R2 = 86
const R3 = 142
const R4 = 198
const MID = (R2 + R3) / 2
const BW = 76 // datový box
const BH = 34
const IW = 44 // vstupní box u proudových módů (vlevo od ⊕)
const OPW = 56
const OPH = 30
const XR = 11
const IVX = 45 // střed sloupce s IV
const INX = 50 // posun vstupního boxu proudových módů vlevo od osy sloupce

type ColState = 'done' | 'cur' | 'future'
type P = [number, number]

function ModeDiagram({ mode, view, blocks, iv, cur, sent, flipBlock }: { mode: Mode; view: View; blocks: ModeBlock[]; iv: number; cur: number; sent: number[]; flipBlock: number }) {
  const spec = SPECS[mode]
  const n = blocks.length
  const L = spec.usesIV && mode !== 'ctr' ? 96 : 10
  const X = (i: number) => L + i * CW + CW / 2
  const W = L + n * CW + 10
  const stream = mode === 'cfb' || mode === 'ofb' || mode === 'ctr'
  const dec = view === 'dec'
  const H = mode === 'cfb' && dec ? 238 : 222
  const hasErr = dec && flipBlock >= 0

  const colState = (i: number): ColState => (i < cur ? 'done' : i === cur ? 'cur' : 'future')
  const tone = (cs: ColState): 'active' | 'dim' | undefined => (cs === 'cur' ? 'active' : cs === 'future' ? 'dim' : undefined)
  const val = (cs: ColState, v: number) => (cs === 'future' ? '····' : bin4(v))
  const inTone = (i: number, cs: ColState) => (cs === 'cur' ? 'active' : dec && i === flipBlock ? 'changed' : tone(cs))
  const outTone = (i: number, cs: ColState): 'active' | 'dim' | 'ok' | 'bad' | undefined =>
    cs !== 'done' || !hasErr ? tone(cs) : blocks[i]!.ot === sent[i] ? 'ok' : 'bad'

  const els: ReactNode[] = []

  // IV ve sloupci 0 — zastupuje ŠT₀ (CBC, CFB) nebo H₀ (OFB)
  if (spec.usesIV && mode !== 'ctr') {
    const y = mode === 'cbc' ? (dec ? R1 : R4) : mode === 'cfb' ? (dec ? R3 : R4) : MID
    els.push(<FlowBox key="iv" x={IVX} y={y} w={BW} h={BH} kind="key" label="IV" sub={bin4(iv)} tone={cur === 0 ? 'active' : undefined} />)
  }

  blocks.forEach((b, i) => {
    const x = X(i)
    const cs = colState(i)
    const t = tone(cs)
    const k = i + 1
    const xm = x - CW / 2 // svislá spojka mezi sloupci (CBC)
    // stoupačka zpětné vazby (CFB, OFB): vpravo od předchozího sloupce, ať nekříží vstup tohoto bloku
    const riser = i === 0 ? IVX + BW / 2 + 4 : X(i - 1) + 50
    const prevX = i === 0 ? IVX : X(i - 1)
    const arrow = (key: string, points: P[]) => <FlowArrow key={key + i} points={points} tone={t} />

    if (!stream) {
      // ECB, CBC: data shora dolů přes E_K / D_K
      els.push(<FlowBox key={`t${i}`} x={x} y={R1} w={BW} h={BH} label={dec ? `ŠT${sub(k)}` : `OT${sub(k)}`} sub={bin4(dec ? b.st : b.ot)} tone={inTone(i, cs)} />)
      els.push(<FlowBox key={`b${i}`} x={x} y={R4} w={BW} h={BH} label={dec ? `OT${sub(k)}` : `ŠT${sub(k)}`} sub={val(cs, dec ? b.ot : b.st)} tone={outTone(i, cs)} />)
      if (mode === 'ecb') {
        els.push(<FlowBox key={`e${i}`} x={x} y={MID} w={OPW} h={OPH} kind="op" label={svgEK(dec)} tone={t} />)
        els.push(arrow('a1', [[x, R1 + 17], [x, MID - 15]]), arrow('a2', [[x, MID + 15], [x, R4 - 17]]))
      } else if (!dec) {
        // CBC šifrování: OT ⊕ ŠT_{i−1} → E_K → ŠT
        els.push(<FlowOp key={`x${i}`} x={x} y={R2} tone={t} />)
        els.push(<FlowBox key={`e${i}`} x={x} y={R3} w={OPW} h={OPH} kind="op" label={svgEK()} tone={t} />)
        els.push(arrow('a1', [[x, R1 + 17], [x, R2 - XR]]), arrow('a2', [[x, R2 + XR], [x, R3 - 15]]), arrow('a3', [[x, R3 + 15], [x, R4 - 17]]))
        els.push(
          <FlowText key={`v${i}`} x={x + 8} y={MID} anchor="start" muted>
            {val(cs, b.ein)}
          </FlowText>,
        )
        els.push(arrow('c', [[prevX + BW / 2, R4], [xm, R4], [xm, R2], [x - XR, R2]]))
      } else {
        // CBC dešifrování: ŠT → D_K → ⊕ ŠT_{i−1} → OT
        els.push(<FlowBox key={`e${i}`} x={x} y={R2} w={OPW} h={OPH} kind="op" label={svgEK(true)} tone={t} />)
        els.push(<FlowOp key={`x${i}`} x={x} y={R3} tone={t} />)
        els.push(arrow('a1', [[x, R1 + 17], [x, R2 - 15]]), arrow('a2', [[x, R2 + 15], [x, R3 - XR]]), arrow('a3', [[x, R3 + XR], [x, R4 - 17]]))
        els.push(
          <FlowText key={`v${i}`} x={x + 8} y={MID} anchor="start" muted>
            {val(cs, b.eout)}
          </FlowText>,
        )
        els.push(arrow('c', [[prevX + BW / 2, R1], [xm, R1], [xm, R3], [x - XR, R3]]))
      }
      return
    }

    // CFB, OFB, CTR: E_K vyrábí heslo, data přicházejí zleva do ⊕
    els.push(<FlowBox key={`e${i}`} x={x} y={R2} w={OPW} h={OPH} kind="op" label={svgEK()} tone={t} />)
    els.push(<FlowOp key={`x${i}`} x={x} y={R3} tone={t} />)
    els.push(<FlowBox key={`in${i}`} x={x - INX} y={R3} w={IW} h={BH} label={dec ? `ŠT${sub(k)}` : `OT${sub(k)}`} sub={bin4(dec ? b.st : b.ot)} tone={inTone(i, cs)} />)
    els.push(<FlowBox key={`o${i}`} x={x} y={R4} w={BW} h={BH} label={dec ? `OT${sub(k)}` : `ŠT${sub(k)}`} sub={val(cs, dec ? b.ot : b.st)} tone={outTone(i, cs)} />)
    els.push(arrow('ai', [[x - INX + IW / 2, R3], [x - XR, R3]]), arrow('ao', [[x, R3 + XR], [x, R4 - 17]]), arrow('ah', [[x, R2 + 15], [x, R3 - XR]]))
    els.push(
      <FlowText key={`h${i}`} x={x - 8} y={MID} anchor="end" muted>
        {mode === 'cfb' ? val(cs, b.eout) : `H${sub(k)} ${val(cs, b.eout)}`}
      </FlowText>,
    )
    if (mode === 'ctr') {
      els.push(<FlowBox key={`c${i}`} x={x} y={R1} w={BW} h={BH} kind="key" label={`CTR${sub(k)}`} sub={bin4(b.ctr!)} tone={t} />)
      els.push(arrow('ac', [[x, R1 + 17], [x, R2 - 15]]))
    } else {
      // vstup E_K shora: z předchozího bloku (CFB: ŠT_{i−1}, OFB: H_{i−1}) nebo z IV
      let start: P[]
      if (mode === 'ofb') start = [[i === 0 ? IVX + BW / 2 : prevX, MID]]
      else if (!dec) start = [[prevX + BW / 2, R4]]
      else {
        const sx = i === 0 ? IVX : prevX - INX
        start = [
          [sx, R3 + 17],
          [sx, H - 12],
        ]
      }
      const last = start[start.length - 1]!
      els.push(arrow('ch', [...start, [riser, last[1]], [riser, 52], [x, 52], [x, R2 - 15]]))
    }
  })

  return (
    <Flow width={W} height={H} minWidth={Math.min(W, 540)} title={`${dec ? 'Dešifrování' : 'Šifrování'} v módu ${spec.name}: ${n} ${blocksWord(n)}, právě blok ${cur + 1}.`}>
      {els}
    </Flow>
  )
}

/* ------------------------------------------------------------------ */
/* Vzorec a věta pro aktuální blok                                     */
/* ------------------------------------------------------------------ */

function stepText(mode: Mode, view: View, b: ModeBlock, iv: number): { formula: ReactNode[]; result: string; note: ReactNode } {
  const i = b.i
  const s = sub(i)
  const p = sub(i - 1)
  const prev = i === 1 ? 'IV' : mode === 'ofb' ? `H${p}` : `ŠT${p}`
  const B = bin4
  if (view === 'enc') {
    switch (mode) {
      case 'ecb':
        return {
          formula: [<>ŠT{s} = {EK()}(OT{s})</>, <>{EK()}({B(b.ot)})</>],
          result: B(b.st),
          note: <>Blok {i} nepotřebuje nic z ostatních bloků — všechny bloky lze šifrovat současně.</>,
        }
      case 'cbc':
        return {
          formula: [<>ŠT{s} = {EK()}(OT{s} ⊕ {prev})</>, <>{EK()}({B(b.ot)} ⊕ {B(b.chain!)})</>, <>{EK()}({B(b.ein)})</>],
          result: B(b.st),
          note:
            i === 1 ? (
              <>První blok se XORuje s IV, který zastupuje ŠT₀ — náhodný IV zajistí, že stejný OT dá pokaždé jiný ŠT.</>
            ) : (
              <>Blok {i} potřebuje ŠT{p} z předchozího kroku, takže šifrování musí jít blok po bloku.</>
            ),
        }
      case 'cfb':
        return {
          formula: [<>ŠT{s} = OT{s} ⊕ {EK()}({prev})</>, <>{B(b.ot)} ⊕ {EK()}({B(b.chain!)})</>, <>{B(b.ot)} ⊕ {B(b.eout)}</>],
          result: B(b.st),
          note: i === 1 ? <>První heslo vznikne zašifrováním IV, který zastupuje ŠT₀.</> : <>Heslo bloku {i} vzniká ze ŠT{p}, takže šifrování musí čekat na předchozí blok.</>,
        }
      case 'ofb':
        return {
          formula: [<>ŠT{s} = OT{s} ⊕ H{s}</>, <>{B(b.ot)} ⊕ {EK()}({B(b.chain!)})</>, <>{B(b.ot)} ⊕ {B(b.eout)}</>],
          result: B(b.st),
          note:
            i === 1 ? (
              <>
                H₁ = E<sub>K</sub>(IV) nezávisí na OT ani ŠT, takže se proud hesla dá spočítat dopředu.
              </>
            ) : (
              <>
                H{s} = E<sub>K</sub>(H{p}) závisí jen na předchozím hesle, ne na zprávě — ⊕ pak jde pro všechny bloky najednou.
              </>
            ),
        }
      case 'ctr':
        return {
          formula: [<>ŠT{s} = OT{s} ⊕ {EK()}(CTR{s})</>, <>{B(b.ot)} ⊕ {EK()}({B(b.ctr!)})</>, <>{B(b.ot)} ⊕ {B(b.eout)}</>],
          result: B(b.st),
          note: (
            <>
              CTR{s} = |IV + {i - 1}|₁₆ = {B(b.ctr!)}; blok {i} nepotřebuje žádný jiný blok, takže všechny bloky jdou současně.
              {b.ctr! < iv ? ' Čítač přetekl přes 1111 zpět na 0000.' : ''}
            </>
          ),
        }
    }
  }
  switch (mode) {
    case 'ecb':
      return {
        formula: [<>OT{s} = {EK(true)}(ŠT{s})</>, <>{EK(true)}({B(b.st)})</>],
        result: B(b.ot),
        note: <>Dešifrování bloku {i} potřebuje jen ŠT{s} — všechny bloky jdou současně.</>,
      }
    case 'cbc':
      return {
        formula: [<>OT{s} = {prev} ⊕ {EK(true)}(ŠT{s})</>, <>{B(b.chain!)} ⊕ {EK(true)}({B(b.st)})</>, <>{B(b.chain!)} ⊕ {B(b.eout)}</>],
        result: B(b.ot),
        note: <>Potřebuje jen přijaté {prev} a ŠT{s}, které už máme — dešifrování jde paralelně.</>,
      }
    case 'cfb':
      return {
        formula: [<>OT{s} = ŠT{s} ⊕ {EK()}({prev})</>, <>{B(b.st)} ⊕ {EK()}({B(b.chain!)})</>, <>{B(b.st)} ⊕ {B(b.eout)}</>],
        result: B(b.ot),
        note: (
          <>
            I při dešifrování se volá E<sub>K</sub>, ne D<sub>K</sub>; vstupem je přijatý {prev}, takže bloky jdou paralelně.
          </>
        ),
      }
    case 'ofb':
      return {
        formula: [<>OT{s} = ŠT{s} ⊕ H{s}</>, <>{B(b.st)} ⊕ {EK()}({B(b.chain!)})</>, <>{B(b.st)} ⊕ {B(b.eout)}</>],
        result: B(b.ot),
        note: <>Příjemce vyrobí ze stejného K a IV stejné heslo H{s} jako odesílatel a jen ho přiXORuje.</>,
      }
    case 'ctr':
      return {
        formula: [<>OT{s} = ŠT{s} ⊕ {EK()}(CTR{s})</>, <>{B(b.st)} ⊕ {EK()}({B(b.ctr!)})</>, <>{B(b.st)} ⊕ {B(b.eout)}</>],
        result: B(b.ot),
        note: <>Stačí znát číslo bloku — jde dešifrovat i jediný blok uprostřed zprávy.</>,
      }
  }
}

/* ------------------------------------------------------------------ */
/* Widget                                                              */
/* ------------------------------------------------------------------ */

function ModeWidget({ mode, title, lead }: WidgetProps & { mode: Mode }) {
  const spec = SPECS[mode]
  const presets = useMemo<Preset<State>[]>(
    () => [
      { label: 'Výchozí', values: { ...BASE, view: 'enc', flip: -1 } },
      { label: 'Stejné bloky OT', values: { ...BASE, ot: '0101 0101 0101 0101', view: 'enc', flip: -1 }, note: withSubs(spec.sameNote) },
      ...(spec.extra ?? []).map((p) => ({ ...p, note: typeof p.note === 'string' ? withSubs(p.note) : p.note })),
      { label: 'Chyba v ŠT₂', values: { ...BASE, view: 'dec', flip: 5 }, note: withSubs(spec.errNote) },
    ],
    [spec],
  )
  const st = usePresetState<State>({ ...BASE, view: 'enc', flip: -1 }, presets)
  const { ot, k, iv, view, flip } = st.value

  const pOt = parseBlocks(ot)
  const pK = parse4(k, 'Klíč K')
  const pIv = spec.usesIV ? parse4(iv, 'IV') : { v: 0 }
  const valid = !!pOt.blocks && pK.v !== undefined && pIv.v !== undefined
  const sentKey = pOt.blocks?.join(',') ?? ''
  const K = pK.v ?? 0
  const IV = pIv.v ?? 0

  const { sent, enc, received, decr, flipOk } = useMemo(() => {
    const sent = sentKey ? sentKey.split(',').map(Number) : []
    const enc = valid ? modeEncrypt(mode, sent, K, IV) : []
    const flipOk = flip >= 0 && flip < 4 * sent.length ? flip : -1
    const received = enc.map((b, i) => (flipOk >= 0 && Math.floor(flipOk / 4) === i ? b.st ^ (8 >> flipOk % 4) : b.st))
    const decr = valid ? modeDecrypt(mode, received, K, IV) : []
    return { sent, enc, received, decr, flipOk }
  }, [sentKey, valid, mode, K, IV, flip])
  const n = sent.length
  const blocks = view === 'enc' ? enc : decr

  // s chybou v ŠT rovnou ukázat celý výsledek; jinak od prvního bloku
  const s = useStepper(Math.max(1, n), { initial: view === 'dec' && flip >= 0 ? n - 1 : 0, resetKey: `${sentKey}|${K}|${IV}|${view}` })
  const cur = Math.min(s.index, Math.max(0, n - 1))
  const b = blocks[cur]
  const text = b ? stepText(mode, view, b, IV) : null

  // první dvojice opakovaných bloků OT (ECB × ostatní módy)
  let repeat: [number, number] | null = null
  for (let i = 0; i < n && !repeat; i++) for (let j = i + 1; j < n && !repeat; j++) if (sent[i] === sent[j]) repeat = [i, j]

  const flipBlock = flipOk >= 0 ? Math.floor(flipOk / 4) : -1
  const damaged = decr.map((d, i) => ({ i, bits: popcount(d.ot ^ sent[i]!) })).filter((d) => d.bits > 0)
  const fill = (h: string) => withSubs(h.replace(/_i/g, `_{${flipBlock + 1}}`).replace(/_\{i\+1\}/g, `_{${flipBlock + 2}}`))

  return (
    <Widget
      title={title ?? `Mód ${spec.name}`}
      lead={lead ?? 'Krokujte blok po bloku a sledujte, odkud blok i bere vstup; v Dešifrování překlopte bit ŠT a sledujte, kam se chyba rozšíří.'}
      {...st.widget}
      onRandom={() => {
        const r4 = () => bin4(Math.floor(Math.random() * 16))
        st.set({ ot: Array.from({ length: 4 }, r4).join(' '), k: r4(), iv: r4(), flip: -1 })
      }}
      footer={spec.footer}
    >
      <Grid min={150}>
        <TextField label="OT (bloky po 4 bitech)" value={ot} onChange={(v) => st.set({ ot: v, flip: -1 })} normalize={onlyBits} error={pOt.error} hint="1–6 bloků, mezery jen pro čitelnost." />
        <TextField label="Klíč K" value={k} onChange={(v) => st.set({ k: v })} normalize={only4} maxLength={4} error={pK.error} />
        {spec.usesIV && <TextField label={spec.ivLabel ?? 'IV'} value={iv} onChange={(v) => st.set({ iv: v })} normalize={only4} maxLength={4} error={pIv.error} hint={spec.ivHint} />}
      </Grid>

      <Segmented<View>
        ariaLabel="Směr"
        value={view}
        onChange={(v) => st.set({ view: v })}
        options={[
          { value: 'enc', label: 'Šifrování' },
          { value: 'dec', label: 'Dešifrování' },
        ]}
      />

      <Tex tex={view === 'enc' ? spec.texEnc : spec.texDec} display />

      {!valid || !b || !text ? (
        <Verdict kind="bad" title="Nelze spočítat">
          {pOt.error ?? pK.error ?? pIv.error}
        </Verdict>
      ) : (
        <>
          {view === 'dec' && (
            <Panel variant="plain" label="Přijatý ŠT — kliknutím překlopíte bit (chyba při přenosu)">
              <Row gap={4} align="start">
                {received.map((r, i) => (
                  <Cells
                    key={i}
                    size="sm"
                    label={`ŠT${sub(i + 1)}`}
                    ariaLabel={`Bity bloku ŠT${sub(i + 1)}`}
                    items={bin4(r)
                      .split('')
                      .map((c, j) => (flipOk === 4 * i + j ? { v: c, tone: 'changed' as Tone, title: 'Překlopený bit' } : { v: c }))}
                    selected={flipOk >= 0 && Math.floor(flipOk / 4) === i ? flipOk % 4 : null}
                    onSelect={(j) => {
                      st.set({ flip: flipOk === 4 * i + j ? -1 : 4 * i + j })
                      s.last()
                    }}
                  />
                ))}
              </Row>
            </Panel>
          )}

          <ModeDiagram mode={mode} view={view} blocks={blocks} iv={IV} cur={cur} sent={sent} flipBlock={flipBlock} />

          <StepperBar stepper={s} label={(i) => `Blok ${i + 1}`} noPlay={n < 3} />
          <StepNote>{text.note}</StepNote>
          <Formula steps={text.formula} result={text.result} />

          {view === 'enc' ? (
            <Panel variant="soft" label="Šifrový text ŠT" aside={s.atEnd ? `${n} ${blocksWord(n)}` : `hotovo ${cur + 1} z ${n}`}>
              <Stack gap={3}>
                <Cells
                  items={enc.map((e, i) => ({
                    sub: `ŠT${sub(i + 1)}`,
                    v: i <= cur ? bin4(e.st) : '····',
                    tone: i === cur ? 'active' : i > cur ? 'dim' : undefined,
                  }))}
                />
                {s.atEnd && repeat && <RepeatVerdict mode={mode} repeat={repeat} same={enc[repeat[0]]!.st === enc[repeat[1]]!.st} />}
              </Stack>
            </Panel>
          ) : (
            <Panel variant="soft" label="Dešifrovaný OT proti odeslanému">
              <Stack gap={3}>
                <BitRow bits={decr.map((d) => bin4(d.ot)).join('')} compare={sent.map(bin4).join('')} group={4} showDiffCount />
                {flipOk < 0 ? (
                  <Verdict kind="ok" title="Bez chyby se OT obnoví přesně">
                    Klikněte na libovolný bit přijatého ŠT výše a sledujte, kam se chyba rozšíří.
                  </Verdict>
                ) : (
                  <Verdict
                    kind={damaged.length > 1 ? 'warn' : 'info'}
                    title={`Chyba v ŠT${sub(flipBlock + 1)} poškodila ${damaged.map((d) => `OT${sub(d.i + 1)} (${d.bits} ${bitsWord(d.bits)})`).join(' a ')}`}
                  >
                    {fill(spec.err.hint.charAt(0).toUpperCase() + spec.err.hint.slice(1))}.
                  </Verdict>
                )}
              </Stack>
            </Panel>
          )}
        </>
      )}

      <KeyValue
        cols={3}
        items={[
          { k: 'Šifrování', v: spec.enc.v, hint: withSubs(spec.enc.hint) },
          { k: 'Dešifrování', v: spec.dec.v, hint: withSubs(spec.dec.hint) },
          { k: <>Chyba 1 bitu v ŠT<sub>i</sub></>, v: spec.err.v, hint: withSubs(spec.err.hint) },
        ]}
      />
    </Widget>
  )
}

function RepeatVerdict({ mode, repeat: [a, b], same }: { mode: Mode; repeat: [number, number]; same: boolean }) {
  const A = sub(a + 1)
  const Bs = sub(b + 1)
  if (same)
    return (
      <Verdict kind="warn" title={`OT${A} = OT${Bs} ⇒ ŠT${A} = ŠT${Bs}`}>
        {mode === 'ecb' ? 'Opakovaný blok zprávy je vidět i v šifrovém textu.' : 'Tady jde o náhodu: 4bitový blok má jen 16 hodnot. U 128bitového bloku se to prakticky nestane.'}
      </Verdict>
    )
  return (
    <Verdict kind="ok" title={`OT${A} = OT${Bs}, ale ŠT${A} ≠ ŠT${Bs}`}>
      Opakování bloku v šifrovém textu není vidět.
    </Verdict>
  )
}

export function ModeECB(p: WidgetProps) {
  return <ModeWidget mode="ecb" {...p} />
}
export function ModeCBC(p: WidgetProps) {
  return <ModeWidget mode="cbc" {...p} />
}
export function ModeCFB(p: WidgetProps) {
  return <ModeWidget mode="cfb" {...p} />
}
export function ModeOFB(p: WidgetProps) {
  return <ModeWidget mode="ofb" {...p} />
}
export function ModeCTR(p: WidgetProps) {
  return <ModeWidget mode="ctr" {...p} />
}
