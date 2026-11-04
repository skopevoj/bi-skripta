import { useMemo, useState } from 'react'
import {
  Cells,
  CellRows,
  Formula,
  Grid,
  NumberField,
  Panel,
  Slider,
  StepNote,
  StepperBar,
  TextField,
  TraceTable,
  Verdict,
  Widget,
  mod,
  usePresetState,
  useStepper,
} from '@skripta/ui/interactive'

/* ================================================================== */
/* Demo 1: Caesarova šifra — živý výstup, bez krokování                */
/* ================================================================== */

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const onlyLetters = (s: string) =>
  s
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z ]/g, '')

const CAESAR_PRESETS = [
  { label: 'Z přednášky', values: { text: 'UTOK ZA USVITU', k: 3 } },
  { label: 'ROT13', values: { text: 'HELLO WORLD', k: 13 }, note: 'Posun 13 je polovina abecedy, takže šifrování a dešifrování je stejná operace.' },
  { label: 'Přetočení přes Z', values: { text: 'XYZ', k: 5 }, note: 'Písmena na konci abecedy „přetečou“ a pokračují od A — proto se počítá mod 26.' },
] as const

export function CaesarDemo() {
  const st = usePresetState<{ text: string; k: number }>({ text: 'UTOK ZA USVITU', k: 3 }, CAESAR_PRESETS)
  const { text, k } = st.value
  const [picked, setPicked] = useState<number | null>(null)
  const firstLetter = ABC.indexOf(text.replace(/ /g, '')[0] ?? 'A')
  const sel = picked ?? Math.max(0, firstLetter)
  const enc = (ch: string) => (ch === ' ' ? ' ' : ABC[mod(ABC.indexOf(ch) + k, 26)]!)
  const cipher = text.split('').map(enc)

  return (
    <Widget
      title="Caesarova šifra"
      lead="Posuň klíč k a sleduj, jak se posune celá abeceda. Klikni na písmeno v horním řádku a uvidíš výpočet."
      {...st.widget}
      onRandom={() => st.set({ k: 1 + Math.floor(Math.random() * 25) })}
      footer={
        <p>
          Každé písmeno se posune o stejný počet míst, takže stačí vyzkoušet všech 25 klíčů (útok hrubou silou). Šifrový text navíc zachovává
          četnost písmen.
        </p>
      }
    >
      <Grid min={220}>
        <TextField label="Otevřený text" value={text} onChange={(t) => st.set({ text: t })} normalize={onlyLetters} hint="Jen písmena A–Z a mezery, diakritika se odstraní." />
        <Slider label="Klíč k" value={k} min={0} max={25} onChange={(v) => st.set({ k: v })} format={(v) => `k = ${v}`} hint="Posun o k míst doprava." />
      </Grid>

      <div>
        <CellRows
          ariaLabel="Mapování abecedy"
          head={ABC.split('').map((_, i) => i)}
          rows={[
            { label: 'OT', cells: ABC.split('') },
            { label: 'ŠT', cells: ABC.split('').map((_, i) => ({ v: ABC[mod(i + k, 26)]!, tone: i === sel ? ('active' as const) : undefined })) },
          ]}
          activeCol={sel}
          onColSelect={setPicked}
        />
      </div>

      <Formula
        label={`Písmeno ${ABC[sel]}`}
        steps={[`E(${ABC[sel]}) = (${sel} + ${k}) mod 26`, `${sel + k} mod 26`]}
        result={`${mod(sel + k, 26)} = ${ABC[mod(sel + k, 26)]}`}
      />

      <Panel variant="soft" label="Šifrový text" aside={`${cipher.filter((c) => c !== ' ').length} písmen`}>
        <Cells
          size="sm"
          wrap
          ariaLabel="Šifrový text"
          items={cipher.map((c, i) => ({ v: c === ' ' ? ' ' : c, tone: text[i] === ABC[sel] ? ('active' as const) : c === ' ' ? ('dim' as const) : undefined }))}
        />
      </Panel>
    </Widget>
  )
}

/* ================================================================== */
/* Demo 2: Eukleidův algoritmus — krokování                            */
/* ================================================================== */

type ERow = { i: number; a: number; b: number; q: number; r: number }

function euclid(a: number, b: number): ERow[] {
  const rows: ERow[] = []
  let x = a
  let y = b
  let i = 1
  while (y !== 0 && rows.length < 60) {
    const q = Math.floor(x / y)
    const r = x % y
    rows.push({ i: i++, a: x, b: y, q, r })
    x = y
    y = r
  }
  return rows
}

const EUCLID_PRESETS = [
  { label: 'Z přednášky', values: { a: 252, b: 105 } },
  { label: 'Nesoudělná', values: { a: 26, b: 15 }, note: 'gcd = 1, čísla jsou nesoudělná — 15 má inverzi modulo 26.' },
  { label: 'Fibonacci', values: { a: 89, b: 55 }, note: 'Dvě po sobě jdoucí Fibonacciho čísla jsou nejhorší případ: podíl q je pokaždé 1.' },
] as const

export function EuclidDemo() {
  const st = usePresetState<{ a: number; b: number }>({ a: 252, b: 105 }, EUCLID_PRESETS)
  const { a, b } = st.value
  const rows = useMemo(() => euclid(a, b), [a, b])
  const s = useStepper(rows.length, { resetKey: `${a},${b}` })
  const row = rows[s.index]!
  const gcd = rows[rows.length - 1]!.b
  const swapped = a < b

  return (
    <Widget
      title="Eukleidův algoritmus"
      lead="Zadej dvě čísla a krokuj: v každém kroku nahradíme dvojici (a, b) dvojicí (b, a mod b), dokud zbytek není 0."
      {...st.widget}
      onRandom={() => st.set({ a: 20 + Math.floor(Math.random() * 480), b: 10 + Math.floor(Math.random() * 200) })}
      footer={<p>Poslední nenulový zbytek je gcd(a, b). Počet kroků roste jen logaritmicky — zbytek se nejpozději každé dva kroky aspoň způlí.</p>}
    >
      <Grid min={160}>
        <NumberField label="a" value={a} min={1} max={99999} onChange={(v) => st.set({ a: v })} />
        <NumberField
          label="b"
          value={b}
          min={1}
          max={99999}
          onChange={(v) => st.set({ b: v })}
          hint={swapped ? 'b > a: první krok čísla jen prohodí (q = 0).' : undefined}
        />
      </Grid>

      <StepperBar stepper={s} />

      <StepNote title={row.r === 0 ? 'Hotovo' : undefined} kind={row.r === 0 ? 'ok' : undefined}>
        {row.r === 0 ? (
          <>
            {row.a} je dělitelné {row.b} beze zbytku, takže algoritmus končí: gcd = <b>{row.b}</b>.
          </>
        ) : (
          <>
            {row.a} = {row.q} · {row.b} + {row.r}; zbytek {row.r} ≠ 0, pokračujeme s dvojicí ({row.b}, {row.r}).
          </>
        )}
      </StepNote>

      <Formula label="Zbytek" steps={['r = a − q · b', `${row.a} − ${row.q} · ${row.b}`]} result={row.r} />

      <TraceTable
        columns={[
          { key: 'i', label: 'Krok', align: 'left' },
          { key: 'a', label: 'a' },
          { key: 'b', label: 'b' },
          { key: 'q', label: 'q = ⌊a / b⌋' },
          { key: 'r', label: 'r = a mod b' },
        ]}
        rows={rows}
        current={s.index}
        onRowClick={s.go}
      />

      {s.atEnd && (
        <Verdict kind="ok" title={`gcd(${a}, ${b}) = ${gcd}`}>
          {gcd === 1 ? 'Čísla jsou nesoudělná.' : `Obě čísla jsou dělitelná ${gcd}: ${a} = ${a / gcd} · ${gcd}, ${b} = ${b / gcd} · ${gcd}.`}
        </Verdict>
      )}
    </Widget>
  )
}
