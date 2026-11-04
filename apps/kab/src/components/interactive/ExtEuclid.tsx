import { useMemo } from 'react'
import { Formula, Grid, NumberField, StepNote, StepperBar, TraceTable, Verdict, Widget, usePresetState, useStepper } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { extEuclidRows, fmt, gcd, leadNode, modN, randInt, sup, type ExtRow } from './lib/numtheory'

// Rozšířený Eukleidův algoritmus v tabulce: každý řádek je pravdivá rovnost r = s·a + t·n.
// Nový řádek = předminulý − q · minulý. Řádek se zbytkem 1 dává Bézouta, a s mod n je a⁻¹.

type State = { a: number; n: number }

const PRESETS = [
  { label: 'Z přednášky', values: { a: 17, n: 26 } },
  {
    label: 'RSA: e⁻¹ mod φ(n)',
    values: { a: 17, n: 3120 },
    note: 'Soukromý exponent RSA pro p = 61, q = 53, e = 17: φ(n) = 3120 a d = 17⁻¹ mod 3120 = 2753.',
  },
  {
    label: 'Exponenciální šifra',
    values: { a: 29, n: 2632 },
    note: 'Příklad 2.1: dešifrovací klíč d = 29⁻¹ mod 2632 = 2269.',
  },
  {
    label: 'Bez inverze',
    values: { a: 4, n: 26 },
    note: 'gcd(4, 26) = 2 ≠ 1 — zbytek 1 se nikdy neobjeví, inverze neexistuje. Proto a = 4 nejde jako klíč afinní šifry.',
  },
] as const

/** „−3 · 17 + 2 · 26“ */
const comb = (s: number, a: number, t: number, n: number) => `${fmt(s)} · ${a} ${t < 0 ? '−' : '+'} ${Math.abs(t)} · ${n}`

export function ExtEuclid({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ a: 17, n: 26 }, PRESETS)
  const { a, n } = st.value
  const aBad = a >= n
  const rows = useMemo(() => (aBad ? [] : extEuclidRows(a, n)), [a, n, aBad])
  // krok 0 = počáteční dva řádky, krok k = spočítaný řádek k + 1
  const s = useStepper(Math.max(1, rows.length - 1), { resetKey: `${a},${n}` })
  const cur = s.index + 1
  const row = rows[cur]
  const gRow = rows[rows.length - 2]
  const g = gRow?.r ?? gcd(a, n)
  const inv = g === 1 && gRow ? modN(gRow.s, n) : null
  const done = row?.r === 0

  const note = (() => {
    if (!row) return null
    if (s.index === 0)
      return (
        <>
          Začneme dvěma řádky, které platí triviálně: {n} = 0 · {a} + 1 · {n} a {a} = 1 · {a} + 0 · {n}.
        </>
      )
    const p2 = rows[cur - 2]!
    const p1 = rows[cur - 1]!
    if (done)
      return (
        <>
          {p2.r} = {row.q} · {p1.r} + 0 — zbytek 0, konec. Poslední nenulový zbytek je gcd = {p1.r}, a jeho řádek dává {p1.r} = {comb(p1.s, a, p1.t, n)}.
        </>
      )
    return (
      <>
        q = ⌊{p2.r} / {p1.r}⌋ = {row.q}; nový řádek = řádek {cur - 2} − {row.q} · řádek {cur - 1}, tedy {row.r} = {comb(row.s, a, row.t, n)}.
      </>
    )
  })()

  return (
    <Widget
      title={title ?? 'Modulární inverze'}
      lead={leadNode(lead, 'Krokuj tabulku: každý řádek je rovnost r = s · a + t · n a řádek se zbytkem 1 prozradí inverzi a⁻¹ mod n.')}
      {...st.widget}
      onRandom={() => {
        const nn = randInt(20, 400)
        st.set({ n: nn, a: randInt(2, nn - 1) })
      }}
      footer={
        <p>
          Je to obyčejný Euklidův algoritmus, jen si u každého zbytku pamatujeme, jak vznikl z a a n. Z řádku 1 = s · a + t · n stačí vzít mod n: t · n
          zmizí a zbude s · a ≡ 1, takže a⁻¹ = s mod n (důsledek 0.1). Záporné s se jen posune o n.
        </p>
      }
    >
      <Grid min={160}>
        <NumberField
          label="Číslo a"
          value={a}
          min={1}
          max={999999}
          onChange={(v) => st.set({ a: v })}
          error={aBad ? `a musí být menší než n = ${n}; zadej a mod n = ${a % n}.` : undefined}
        />
        <NumberField label="Modul n" value={n} min={2} max={999999} onChange={(v) => st.set({ n: v })} />
      </Grid>

      {aBad || !row ? (
        <Verdict kind="bad" title={`Inverzi hledáme v ℤₙ = {0, …, ${n - 1}}`}>
          Zmenši a pod {n}; a i a mod n mají stejnou inverzi.
        </Verdict>
      ) : (
        <>
          <StepperBar stepper={s} noPlay={rows.length <= 3} />

          <StepNote title={done ? 'Hotovo' : s.index === 0 ? 'Start' : `Řádek ${cur}`} kind={done ? (g === 1 ? 'ok' : 'bad') : undefined}>
            {note}
          </StepNote>

          {!done && (
            <Formula label={`Kontrola řádku ${cur}: s · a + t · n`} steps={[comb(row.s, a, row.t, n)]} result={row.r} />
          )}

          <TraceTable
            columns={[
              { key: 'i', label: 'i', align: 'left' },
              { key: 'q', label: 'q', render: (r: ExtRow) => r.q ?? '—' },
              { key: 'r', label: 'r (zbytek)' },
              { key: 's', label: 's (u a)', render: (r: ExtRow) => fmt(r.s) },
              { key: 't', label: 't (u n)', render: (r: ExtRow) => fmt(r.t) },
            ]}
            rows={rows}
            current={cur}
            onRowClick={(i) => s.go(Math.max(0, i - 1))}
            rowTone={(r, i) => (done && i === rows.length - 2 ? (r.r === 1 ? 'ok' : 'bad') : undefined)}
          />

          {done &&
            (inv !== null ? (
              <Verdict kind="ok" title={`${a}${sup(-1)} mod ${n} = ${inv}`}>
                Bézout: 1 = {comb(gRow!.s, a, gRow!.t, n)}, takže {a} · {gRow!.s < 0 ? `(${fmt(gRow!.s)})` : gRow!.s} ≡ 1 (mod {n})
                {gRow!.s < 0 ? `, a ${fmt(gRow!.s)} + ${n} = ${inv}` : ''}. Kontrola: {a} · {inv} = {a * inv} = {Math.floor((a * inv) / n)} · {n} + 1.
              </Verdict>
            ) : (
              <Verdict kind="bad" title={`${a} nemá inverzi modulo ${n}`}>
                gcd({a}, {n}) = {g} ≠ 1: každá kombinace s · {a} + t · {n} je násobek {g}, takže se nikdy nerovná 1.
              </Verdict>
            ))}
        </>
      )}
    </Widget>
  )
}
