import { useEffect, useState } from 'react'
import {
  Bars,
  BitRow,
  Button,
  ByteGrid,
  Cells,
  Flow,
  FlowArrow,
  FlowBox,
  FlowOp,
  FlowText,
  Formula,
  Grid,
  IconButton,
  KeyValue,
  NumberField,
  Panel,
  Row,
  Segmented,
  Select,
  Slider,
  Stack,
  Tag,
  TextField,
  Toggle,
  Verdict,
  Widget,
} from '@skripta/ui/interactive'
import { MathHTML, Tex, createTermWrapper } from '@skripta/ui/math'
import { CaesarDemo, EuclidDemo } from './demos'

type Theme = 'system' | 'light' | 'dark'

function ThemeSwitch() {
  const [t, setT] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || 'system')
  useEffect(() => {
    const el = document.documentElement
    if (t === 'system') delete el.dataset.theme
    else el.dataset.theme = t
  }, [t])
  return (
    <Segmented
      ariaLabel="Motiv"
      size="sm"
      value={t}
      onChange={setT}
      options={[
        { value: 'system', label: 'Systém' },
        { value: 'light', label: 'Světlý' },
        { value: 'dark', label: 'Tmavý' },
      ]}
    />
  )
}

function ControlsGallery() {
  const [n, setN] = useState(4)
  const [txt, setTxt] = useState('KRYPTO')
  const [sl, setSl] = useState(12)
  const [mode, setMode] = useState<'enc' | 'dec'>('enc')
  const [on, setOn] = useState(true)
  const [sel, setSel] = useState('aes128')
  const coprime = (x: number) => {
    let a = x
    let b = 26
    while (b) [a, b] = [b, a % b]
    return a === 1
  }
  return (
    <Widget title="Ovládací prvky" lead="Všechny vstupy kitu. Zkus do pole a napsat 4 nebo 30 — chyba se vysvětlí pod polem, nic se tiše neořízne." onReset={() => setN(5)}>
      <Row gap={2}>
        <Button variant="primary">Primární</Button>
        <Button>Sekundární</Button>
        <Button variant="ghost">Vedlejší</Button>
        <Button icon="shuffle">S ikonou</Button>
        <Button disabled>Vypnuté</Button>
        <IconButton icon="reset" label="Obnovit" />
        <Button size="sm" variant="secondary">Malé</Button>
      </Row>
      <Grid min={200}>
        <NumberField
          label="a (klíč afinní šifry)"
          value={n}
          min={1}
          max={25}
          onChange={setN}
          error={coprime(n) ? undefined : `a = ${n} není nesoudělné s 26, zkus ${[1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25].find((x) => x > n) ?? 25}.`}
          hint="Musí být nesoudělné s 26."
        />
        <TextField label="Text" value={txt} onChange={setTxt} normalize={(s) => s.toUpperCase()} hint="Převádí se na velká písmena." />
        <Slider label="Počet bitů" value={sl} min={4} max={32} onChange={setSl} format={(v) => `${v} b`} />
        <Select
          label="Varianta"
          value={sel}
          onChange={setSel}
          options={[
            { value: 'aes128', label: 'AES-128 (10 rund)' },
            { value: 'aes192', label: 'AES-192 (12 rund)' },
            { value: 'aes256', label: 'AES-256 (14 rund)' },
          ]}
        />
      </Grid>
      <Row gap={6} align="center">
        <Segmented label="Směr" value={mode} onChange={setMode} options={[{ value: 'enc', label: 'Šifrovat' }, { value: 'dec', label: 'Dešifrovat' }]} />
        <Toggle label="Odposlech (Eva)" checked={on} onChange={setOn} />
      </Row>
    </Widget>
  )
}

function DataGallery() {
  const prev = [0x32, 0x88, 0x31, 0xe0, 0x43, 0x5a, 0x31, 0x37, 0xf6, 0x30, 0x98, 0x07, 0xa8, 0x8d, 0xa2, 0x34]
  const next = prev.map((b, i) => (i % 5 === 0 ? (b * 7 + 3) & 0xff : b))
  const [selByte, setSelByte] = useState<number | null>(5)
  return (
    <Widget title="Zobrazení dat" lead="Buňky, bajty, bity, přehled hodnot, vzorec, verdikty a graf. Tóny: aktuální, změněno, ok, chyba, pozor, potlačené.">
      <Cells
        label="Cells — tóny"
        items={[
          'A',
          { v: 'B', tone: 'active' },
          { v: 'C', tone: 'changed' },
          { v: 'D', tone: 'ok' },
          { v: 'E', tone: 'bad' },
          { v: 'F', tone: 'warn' },
          { v: 'G', tone: 'dim' },
          { v: '7', sub: 'i=7' },
        ]}
      />
      <Grid min={240}>
        <ByteGrid label="ByteGrid — změny proti předchozímu stavu" bytes={next} prev={prev} columnMajor onSelect={setSelByte} selected={selByte} />
        <Stack gap={3}>
          <KeyValue
            cols={2}
            items={[
              { k: 'n = p · q', v: 143 },
              { k: 'φ(n)', v: 120, hint: '(p−1)(q−1)' },
              { k: 'e', v: 7, tone: 'active' },
              { k: 'd = e⁻¹ mod φ(n)', v: 103, tone: 'ok' },
            ]}
          />
          <Formula steps={['c = mᵉ mod n', '5⁷ mod 143']} result="47" />
          <p className="ix-muted">
            Inline štítky: <Tag>0x3a</Tag> <Tag tone="active">z₂</Tag> <Tag tone="ok">1</Tag> <Tag tone="bad">n−1</Tag>
          </p>
        </Stack>
      </Grid>
      <Stack gap={2}>
        <BitRow label="H(„Kryptografie“)" bits="0110100101110010011110010111000001110100" />
        <BitRow label="H(„Kryptografif“)" bits="1110000101011010011100110101100001010110" compare="0110100101110010011110010111000001110100" showDiffCount />
      </Stack>
      <Grid min={220}>
        <Verdict kind="ok" title="Prvočíslo">Test prošel pro všechny zvolené báze.</Verdict>
        <Verdict kind="bad" title="Složené — svědek a = 2">2⁵⁶⁰ ≢ 1 (mod 561) v Miller–Rabinově řetězci.</Verdict>
        <Verdict kind="warn" title="Slabý klíč">Pro k = 0 je šifrový text stejný jako otevřený.</Verdict>
        <Verdict kind="info" title="Poznámka">Hodnoty jsou malé, aby se daly přepočítat ručně.</Verdict>
      </Grid>
      <Panel label="Bars — četnost písmen" aside="ŠT vs. čeština">
        <Bars
          valueLabel="Šifrový text"
          compareLabel="Čeština"
          data={'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l, i) => ({ label: l, value: [8, 1, 3, 4, 10, 0.3, 0.3, 1.3, 7, 2, 4, 4, 3, 7, 8, 3, 0, 4, 5, 5, 4, 4, 0, 0, 3, 3][i]!, tone: l === 'E' ? ('active' as const) : undefined }))}
          compare={[8.4, 1.6, 3, 3.6, 10.6, 0.3, 0.3, 1.3, 7.6, 2.1, 3.7, 3.8, 3.2, 6.5, 8.6, 3.4, 0, 4.8, 5.8, 5.7, 3.9, 4.4, 0.1, 0.1, 2.9, 3.1]}
        />
      </Panel>
    </Widget>
  )
}

function FlowGallery() {
  const [blk, setBlk] = useState(1)
  const X = [130, 330, 530]
  const t = (i: number) => (i === blk ? 'active' : i > blk ? 'dim' : undefined)
  return (
    <Widget
      title="Režim CBC"
      lead="Vyber blok a sleduj, odkud se bere vstup pro XOR: u prvního bloku z IV, u dalších z předchozího šifrového textu."
      actions={<Segmented size="sm" ariaLabel="Blok" value={blk} onChange={setBlk} options={[0, 1, 2].map((i) => ({ value: i, label: `Blok ${i + 1}` }))} />}
    >
      <Flow width={620} height={250} title="Schéma šifrování v režimu CBC, tři bloky">
        <FlowBox x={40} y={95} w={56} label="IV" kind="key" tone={blk === 0 ? 'active' : undefined} />
        {X.map((x, i) => (
          <g key={i}>
            <FlowBox x={x} y={30} label={`OT${i + 1}`} tone={t(i)} />
            <FlowArrow points={[[x, 46], [x, 84]]} tone={i === blk ? 'active' : i > blk ? 'dim' : undefined} />
            <FlowOp x={x} y={95} tone={t(i)} />
            <FlowArrow points={[[x, 106], [x, 136]]} tone={i === blk ? 'active' : i > blk ? 'dim' : undefined} />
            <FlowBox x={x} y={152} label="Eₖ" kind="op" tone={t(i)} />
            <FlowArrow points={[[x, 168], [x, 198]]} tone={i === blk ? 'active' : i > blk ? 'dim' : undefined} />
            <FlowBox x={x} y={214} label={`ŠT${i + 1}`} tone={t(i)} />
            {i < 2 && <FlowArrow points={[[x + 44, 214], [x + 100, 214], [x + 100, 95], [X[i + 1]! - 12, 95]]} tone={i + 1 === blk ? 'active' : i + 1 > blk ? 'dim' : undefined} />}
          </g>
        ))}
        <FlowArrow points={[[68, 95], [X[0]! - 12, 95]]} tone={blk === 0 ? 'active' : undefined} />
        <FlowText x={40} y={124} muted>
          náhodný
        </FlowText>
      </Flow>
      <Formula steps={[`ŠT${blk + 1} = Eₖ(OT${blk + 1} ⊕ ${blk === 0 ? 'IV' : `ŠT${blk}`})`]} />
    </Widget>
  )
}

const term = createTermWrapper([
  { term: 'Eulerova funkce', aliases: ['Eulerovy funkce'], definition: 'φ(n) = počet čísel 1 … n, která jsou s n nesoudělná.' },
  { term: 'nesoudělná', definition: 'Čísla, jejichž největší společný dělitel je 1.' },
])

function MathGallery() {
  return (
    <Widget title="Matematika (KaTeX)" lead="Komponenty z @skripta/ui/math: jeden vzorec, blokový vzorec a HTML s $…$ a pojmy s tooltipem (najeď nebo Tab).">
      <p>
        Inline: <Tex tex="a^{\varphi(n)} \equiv 1 \pmod{n}" /> pro <Tex tex="\gcd(a, n) = 1" />.
      </p>
      <Tex display tex="d \equiv e^{-1} \pmod{\varphi(n)}, \qquad \varphi(pq) = (p-1)(q-1)" />
      <MathHTML
        transformText={term}
        html="<p>Hodnota <b>Eulerovy funkce</b> $\varphi(26) = 12$ říká, kolik klíčů $a$ afinní šifry existuje: $a$ a $26$ musí být nesoudělná. Kód <code>$x$</code> se nevykreslí.</p>"
      />
      <Formula label="S Tex" steps={[<Tex key="1" tex="5^{7} \bmod 143" />]} result="47" />
    </Widget>
  )
}

export function App() {
  return (
    <div className="pg">
      <header className="pg-h">
        <div>
          <div className="pg-k">@skripta/ui</div>
          <h1>Interaktivní kit</h1>
        </div>
        <ThemeSwitch />
      </header>
      <h2>Ukázkové widgety</h2>
      <p className="pg-p">Dva widgety postavené jen z kitu: živý výstup (Caesar) a krokování algoritmu (Eukleides).</p>
      <CaesarDemo />
      <EuclidDemo />
      <h2>Komponenty</h2>
      <ControlsGallery />
      <DataGallery />
      <FlowGallery />
      <MathGallery />
    </div>
  )
}
