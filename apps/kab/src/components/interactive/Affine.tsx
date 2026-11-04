import { useState } from 'react'
import { CellRows, Cells, Formula, Grid, Muted, NumberField, Panel, Slider, TextField, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { ABC, LETTERS, gcd, idx, letter, lettersAndSpaces, md, modInv, nearestCoprime, plural } from './lib/classical'

// Afinní šifra c = |a·p + b|₂₆. Jedna otázka: proč musí být a nesoudělné s 26.

type State = { text: string; a: number; b: number }

const COPRIME = Array.from({ length: 26 }, (_, i) => i).filter((i) => gcd(i, 26) === 1)

const PRESETS = [
  { label: 'Z přednášky', values: { text: 'AFFINE CIPHER', a: 7, b: 10 } },
  { label: 'a = 5, b = 8', values: { text: 'AFFINE CIPHER', a: 5, b: 8 }, note: 'Učebnicový příklad: AFFINE CIPHER se zašifruje na IHHWVC SWFRCP.' },
  {
    label: 'Soudělné a = 13',
    values: { text: 'AFFINE CIPHER', a: 13, b: 0 },
    note: 'gcd(13, 26) = 13: všechna sudá písmena padnou na A a lichá na N, takže z ŠT nejde poznat, co bylo v OT.',
  },
  { label: 'a = 1 je Caesar', values: { text: 'AFFINE CIPHER', a: 1, b: 3 }, note: 'S a = 1 zbude jen posun o b — posuvná šifra je zvláštní případ afinní.' },
] as const

export function Affine({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ text: 'AFFINE CIPHER', a: 7, b: 10 }, PRESETS)
  const { text, a, b } = st.value
  const [picked, setPicked] = useState<number | null>(null)

  const g = gcd(a, 26)
  const ok = g === 1
  const inv = modInv(a, 26)
  const E = (p: number) => md(a * p + b, 26)

  const firstLetter = idx(text.replace(/ /g, '')[0] ?? 'A')
  const sel = picked ?? Math.max(0, firstLetter)
  const selC = E(sel)
  // Písmena, která se zašifrují na stejné písmeno jako vybrané (u soudělného a jich je g).
  const twins = LETTERS.map((_, p) => p).filter((p) => E(p) === selC)
  const used = new Set(LETTERS.map((_, p) => E(p))).size

  const cipher = text.split('').map((ch) => (ch === ' ' ? ' ' : letter(E(idx(ch)))))
  const count = cipher.filter((c) => c !== ' ').length
  const suggest = nearestCoprime(a, 26)

  return (
    <Widget
      title={title ?? 'Afinní šifra'}
      lead={lead ?? 'Měňte koeficient a a posun b; zkuste i a soudělné s 26 a sledujte, co se stane s mapováním abecedy.'}
      {...st.widget}
      onRandom={() => st.set({ a: COPRIME[Math.floor(Math.random() * COPRIME.length)]!, b: Math.floor(Math.random() * 26) })}
      footer={
        <p>
          Dešifrovat jde jen tehdy, když je zobrazení prosté, a to nastane právě pro gcd(a, 26) = 1 — pak existuje inverze a⁻¹ mod 26. Takových a je
          φ(26) = 12, posunů b je 26, celkem tedy 12 · 26 = 312 klíčů: na hrubou sílu i frekvenční analýzu je to pořád málo.
        </p>
      }
    >
      <Grid min={180}>
        <TextField label="Otevřený text (OT)" value={text} onChange={(t) => st.set({ text: t })} normalize={lettersAndSpaces} hint="Jen písmena A–Z a mezery." />
        <NumberField
          label="Koeficient a"
          value={a}
          min={0}
          max={25}
          onChange={(v) => st.set({ a: v })}
          error={ok ? undefined : `a = ${a} je soudělné s 26 (gcd = ${g}), zkuste ${suggest}.`}
          hint={`Nesoudělná s 26: ${COPRIME.join(', ')}.`}
        />
        <Slider label="Posun b" value={b} min={0} max={25} onChange={(v) => st.set({ b: v })} format={(v) => `b = ${v}`} />
      </Grid>

      <CellRows
        ariaLabel="Mapování abecedy OT → ŠT"
        head={LETTERS.map((_, i) => i)}
        rows={[
          { label: 'OT', cells: LETTERS.map((ch, p) => ({ v: ch, tone: !ok && p !== sel && twins.includes(p) ? ('bad' as const) : undefined })) },
          {
            label: 'ŠT',
            cells: LETTERS.map((_, p) => ({
              v: letter(E(p)),
              tone: p === sel ? ('active' as const) : !ok && twins.includes(p) ? ('bad' as const) : undefined,
            })),
          },
        ]}
        activeCol={sel}
        onColSelect={setPicked}
      />

      <Formula label={`Písmeno ${ABC[sel]}`} steps={['c = |a·p + b|₂₆', `|${a}·${sel} + ${b}|₂₆`, `|${a * sel + b}|₂₆`]} result={`${selC} = ${letter(selC)}`} />

      {ok && inv !== null ? (
        <>
          <Formula
            label="Dešifrování"
            steps={['p = |a⁻¹(c − b)|₂₆', `|${inv}(c − ${b})|₂₆`]}
            result={`|${inv}c + ${md(-inv * b, 26)}|₂₆`}
            suffix={`protože |${a}·${inv}|₂₆ = 1`}
          />
          <Panel variant="soft" label="Šifrový text (ŠT)" aside={plural(count, 'písmeno', 'písmena', 'písmen')}>
            {count === 0 ? (
              <Muted>Napište otevřený text.</Muted>
            ) : (
              <Cells
                size="sm"
                wrap
                ariaLabel="Šifrový text"
                items={cipher.map((c, i) => ({ v: c, tone: c === ' ' ? ('dim' as const) : text[i] === ABC[sel] ? ('active' as const) : undefined }))}
              />
            )}
          </Panel>
        </>
      ) : (
        <Verdict kind="bad" title={`Pro a = ${a} nejde dešifrovat`}>
          {twins.length > 1 ? (
            <>
              Písmena {twins.length > 6 ? `${twins.slice(0, 5).map((p) => ABC[p]).join(', ')} … (všech ${twins.length})` : twins.map((p) => ABC[p]).join(', ')} se všechna zašifrují na {letter(selC)}, takže z ŠT nepoznáte, které z nich to bylo. Ve ŠT se
              objeví jen {used} z 26 písmen. Inverze {a}⁻¹ mod 26 neexistuje, protože gcd({a}, 26) = {g} ≠ 1.
            </>
          ) : (
            <>Inverze {a}⁻¹ mod 26 neexistuje, protože gcd({a}, 26) = {g} ≠ 1.</>
          )}
        </Verdict>
      )}
    </Widget>
  )
}
