import { useState } from 'react'
import { CellRows, Formula, Grid, KeyValue, Muted, Tag, TextField, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { idx, letter, lettersAndSpaces, lettersOnly } from './lib/classical'

// Vigenèrova šifra c_j = |p_j + k_((j−1) mod n)+1|₂₆. Jedna otázka: jak heslo posouvá každé písmeno jinak.

type State = { text: string; key: string }

const PRESETS = [
  { label: 'Z přednášky', values: { text: 'THE LITERATURE OF', key: 'BRIDGE' } },
  { label: 'LEMON', values: { text: 'ATTACK AT DAWN', key: 'LEMON' }, note: 'Učebnicový příklad: ATTACKATDAWN → LXFOPVEFRNHR. Obě A na začátku dají pokaždé jiné písmeno.' },
  { label: 'Heslo délky 1', values: { text: 'THE LITERATURE OF', key: 'D' }, note: 'S periodou n = 1 je každý posun stejný — je to obyčejná Caesarova šifra s k = 3.' },
] as const

export function Vigenere({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ text: 'THE LITERATURE OF', key: 'BRIDGE' }, PRESETS)
  const { text, key } = st.value
  const [picked, setPicked] = useState<number | null>(null)

  const p = lettersOnly(text).split('')
  const n = key.length
  const k = p.map((_, j) => (n ? idx(key[j % n]!) : 0))
  const c = p.map((ch, j) => letter(idx(ch) + k[j]!))

  // ŠT se zachovanými mezerami (jako v přednášce „UYM OOXFII…“).
  let j0 = 0
  const cipherSpaced = text
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : (c[j0++] ?? '')))
    .join('')
    .trim()

  const sel = Math.min(picked ?? 0, Math.max(0, p.length - 1))
  const same = p.map((ch, j) => (ch === p[sel] ? j : -1)).filter((j) => j >= 0)
  const sameCipher = same.map((j) => c[j]!)
  const distinct = new Set(sameCipher).size

  return (
    <Widget
      title={title ?? 'Vigenèrova šifra'}
      lead={lead ?? 'Změňte heslo a klikněte na písmeno OT; heslo se opakuje pod textem a každé písmeno posune o jiný kus.'}
      {...st.widget}
      footer={
        <p>
          Stejné písmeno OT se šifruje různě podle toho, pod které písmeno hesla padne, takže četnosti ve ŠT se vyhladí. Po n písmenech se ale posuny
          opakují: písmena na pozicích j, j + n, j + 2n… tvoří obyčejnou Caesarovu šifru. Když útočník uhodne periodu n, rozloží ŠT na n Caesarů a každý
          rozluští frekvenční analýzou.
        </p>
      }
    >
      <Grid min={220}>
        <TextField label="Otevřený text (OT)" value={text} onChange={(t) => st.set({ text: t })} normalize={lettersAndSpaces} hint="Jen písmena A–Z a mezery." />
        <TextField
          label="Heslo K"
          value={key}
          onChange={(t) => st.set({ key: t })}
          normalize={lettersOnly}
          maxLength={20}
          error={n === 0 ? 'Heslo musí mít aspoň jedno písmeno, např. BRIDGE.' : undefined}
          hint={`Perioda n = ${n}; ${key
            .split('')
            .map((ch) => `${ch} = ${idx(ch)}`)
            .join(', ')}.`}
        />
      </Grid>

      {p.length === 0 ? (
        <Muted>Napište otevřený text.</Muted>
      ) : n === 0 ? null : (
        <>
          <CellRows
            ariaLabel="OT, heslo a ŠT pod sebou"
            head={p.map((_, j) => j + 1)}
            rows={[
              { label: 'OT', cells: p },
              { label: 'heslo', cells: k.map((v, j) => ({ v: letter(v), tone: j % n === sel % n ? undefined : ('dim' as const) })), muted: true },
              { label: 'posun', cells: k, muted: true },
              { label: 'ŠT', cells: c.map((v, j) => ({ v, tone: j === sel ? ('active' as const) : undefined })) },
            ]}
            activeCol={sel}
            onColSelect={setPicked}
          />

          <Formula
            label={`Pozice j = ${sel + 1}`}
            steps={[`c${sub(sel + 1)} = |p${sub(sel + 1)} + k${sub((sel % n) + 1)}|₂₆`, `|${idx(p[sel]!)} + ${k[sel]}|₂₆`]}
            result={`${idx(c[sel]!)} = ${c[sel]}`}
          />

          {same.length > 1 && (
            <Muted>
              Písmeno <Tag>{p[sel]}</Tag> je v OT {same.length}×{' '}
              {distinct > 1 ? (
                <>
                  a zašifruje se jako{' '}
                  {sameCipher.map((ch, i) => (
                    <span key={i}>
                      <Tag tone={same[i] === sel ? 'active' : undefined}>{ch}</Tag>{' '}
                    </span>
                  ))}
                  — stejné písmeno, různý ŠT.
                </>
              ) : (
                <>a pokaždé padne pod stejné písmeno hesla, takže vyjde stejně ({sameCipher[0]}).</>
              )}
            </Muted>
          )}

          <KeyValue cols={1} items={[{ k: 'Šifrový text (ŠT)', v: cipherSpaced }]} />
        </>
      )}
    </Widget>
  )
}

const SUB = '₀₁₂₃₄₅₆₇₈₉'
function sub(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUB[Number(d)])
    .join('')
}
