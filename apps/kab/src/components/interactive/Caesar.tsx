import { useState } from 'react'
import { CellRows, Cells, Formula, Grid, Muted, Panel, Slider, TextField, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { ABC, LETTERS, idx, letter, lettersAndSpaces, plural } from './lib/classical'

// Posuvná (Caesarova) šifra: c = |p + k|₂₆. Jedna otázka: co udělá posun k s celou abecedou.

type State = { text: string; k: number }

const PRESETS = [
  { label: 'Z přednášky', values: { text: 'THISMESSAGEISTOPSECRET', k: 3 } },
  {
    label: 'Dešifrování',
    values: { text: 'WKLVPHVVDJHLVWRSVHFUHW', k: 23 },
    note: 'Dešifrovat znamená posunout o −3, tedy o 26 − 3 = 23 dopředu. Vyjde zpět OT z příkladu.',
  },
  {
    label: 'ROT13',
    values: { text: 'HELLO WORLD', k: 13 },
    note: 'Posun 13 je polovina abecedy, takže šifrování a dešifrování je stejná operace.',
  },
] as const

export function Caesar({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ text: 'THISMESSAGEISTOPSECRET', k: 3 }, PRESETS)
  const { text, k } = st.value
  const [picked, setPicked] = useState<number | null>(null)

  const firstLetter = idx(text.replace(/ /g, '')[0] ?? 'A')
  const sel = picked ?? Math.max(0, firstLetter)
  const cipher = text.split('').map((ch) => (ch === ' ' ? ' ' : letter(idx(ch) + k)))
  const count = cipher.filter((c) => c !== ' ').length

  return (
    <Widget
      title={title ?? 'Posuvná šifra'}
      lead={lead ?? 'Posuňte klíč k a sledujte, jak se posune celá abeceda; kliknutím na písmeno uvidíte výpočet.'}
      {...st.widget}
      onRandom={() => st.set({ k: 1 + Math.floor(Math.random() * 25) })}
      footer={
        <p>
          Všechna písmena se posunou o stejný počet míst, takže klíčů je jen 26 a stačí je vyzkoušet všechny (hrubá síla). Šifrový text navíc
          zachovává četnosti písmen — nejčastější písmeno ŠT odpovídá nejčastějšímu písmenu jazyka.
        </p>
      }
    >
      <Grid min={220}>
        <TextField
          label="Otevřený text (OT)"
          value={text}
          onChange={(t) => st.set({ text: t })}
          normalize={lettersAndSpaces}
          hint="Jen písmena A–Z a mezery; diakritika se odstraní."
        />
        <Slider label="Klíč k" value={k} min={0} max={25} onChange={(v) => st.set({ k: v })} format={(v) => `k = ${v}`} hint="Posun o k míst doprava (mod 26)." />
      </Grid>

      <CellRows
        ariaLabel="Mapování abecedy OT → ŠT"
        head={LETTERS.map((_, i) => i)}
        rows={[
          { label: 'OT', cells: LETTERS },
          { label: 'ŠT', cells: LETTERS.map((_, i) => ({ v: letter(i + k), tone: i === sel ? ('active' as const) : undefined })) },
        ]}
        activeCol={sel}
        onColSelect={setPicked}
      />

      <Formula label={`Písmeno ${ABC[sel]}`} steps={['c = |p + k|₂₆', `|${sel} + ${k}|₂₆`]} result={`${(sel + k) % 26} = ${letter(sel + k)}`} />

      <Panel variant="soft" label="Šifrový text (ŠT)" aside={plural(count, 'písmeno', 'písmena', 'písmen')}>
        {count === 0 ? (
          <Muted>Napište otevřený text.</Muted>
        ) : (
          <Cells
            size="sm"
            wrap
            ariaLabel="Šifrový text"
            items={cipher.map((c, i) => ({
              v: c,
              tone: c === ' ' ? ('dim' as const) : text[i] === ABC[sel] ? ('active' as const) : undefined,
            }))}
          />
        )}
      </Panel>
    </Widget>
  )
}
