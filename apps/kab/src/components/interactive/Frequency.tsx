import { useMemo } from 'react'
import { Bars, Button, Formula, Grid, KeyValue, Muted, Row, Segmented, Slider, Stack, TextField, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { LETTERS, cz, idx, letter, lettersAndSpaces, md, plural } from './lib/classical'

// Frekvenční analýza posuvné šifry. Jedna otázka: jak z četností písmen ŠT uhodnout klíč k.

type Lang = 'en' | 'cs'
type State = { text: string; k: number; lang: Lang }

// Četnosti písmen v % (angličtina: standardní tabulka; čeština: přibližně, diakritika sloučena — Č→C, Ř→R, Ě/É→E…).
const REF_RAW: Record<Lang, number[]> = {
  en: [8.2, 1.5, 2.8, 4.3, 12.7, 2.2, 2.0, 6.1, 7.0, 0.15, 0.77, 4.0, 2.4, 6.7, 7.5, 1.9, 0.1, 6.0, 6.3, 9.1, 2.8, 1.0, 2.4, 0.15, 2.0, 0.07],
  cs: [8.7, 1.6, 3.2, 3.6, 9.6, 0.3, 0.3, 1.3, 7.6, 2.1, 3.7, 3.8, 3.2, 6.6, 8.6, 3.4, 0, 4.8, 5.8, 5.7, 3.9, 4.4, 0.1, 0.1, 2.9, 3.2],
}
const REF: Record<Lang, number[]> = {
  en: norm(REF_RAW.en),
  cs: norm(REF_RAW.cs),
}
function norm(v: number[]): number[] {
  const s = v.reduce((a, b) => a + b, 0)
  return v.map((x) => (x / s) * 100)
}

const LECTURE = 'YFXMP CESPZ CJTDF DPQFW QZCPY NTASP CTYRX PDDLR PD'
const CZECH =
  'RYFWAVHUHSFGH QL CLKH V SBZALUP ZPMLY ILG GUHSVZAP RSPJL ULQJHZALQZPT WPZTLULT C JLZRLT ALEAB IFCH V ULIV L H WYHCL AV UHT WYVGYHKP WVZBU'
const VIGENERE =
  'UYM OOXFIIWAVF FN FXCQKWJXEQYG KGW B TCUOSVJ PLYXPIG DTH FMMUE WFTZHZ QFJADMI IZLHY XIV NUKUVVVFE SG ZBV RIUKMUY YOCMVY XIV SHE GIRVJKW XZBK KZFIG SUWJKQRT'

const PRESETS = [
  { label: 'Z přednášky', values: { text: LECTURE, k: 0, lang: 'en' as Lang } },
  {
    label: 'Česky',
    values: { text: CZECH, k: 0, lang: 'cs' as Lang },
    note: 'Delší český text zašifrovaný posunem. Čím delší ŠT, tím věrněji kopíruje četnosti jazyka.',
  },
  {
    label: 'Vigenère',
    values: { text: VIGENERE, k: 0, lang: 'en' as Lang },
    note: 'Anglický text zašifrovaný Vigenèrem s heslem BRIDGE. Četnosti jsou vyhlazené a žádný posun k nedá shodu.',
  },
]

export function Frequency({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ text: LECTURE, k: 0, lang: 'en' }, PRESETS)
  const { text, k, lang } = st.value

  const letters = text.replace(/ /g, '')
  const counts = useMemo(() => {
    const c = new Array<number>(26).fill(0)
    for (const ch of letters) c[idx(ch)]!++
    return c
  }, [letters])
  const total = letters.length

  // Nejčastější písmeno ŠT a odhad klíče z předpokladu „nejčastější ↔ E“.
  const top = counts.reduce((best, v, i) => (v > counts[best]! ? i : best), 0)
  const guess = md(top - 4, 26)

  // Četnosti textu po posunu zpět o k: sloupec p = četnost písmene c = p + k ve ŠT.
  const shifted = LETTERS.map((_, p) => (total ? (counts[md(p + k, 26)]! / total) * 100 : 0))
  const ref = REF[lang]
  // Míra neshody (χ²) — jen pro slovní hodnocení, ne jako číslo pro studenta.
  const chi = (kk: number) =>
    LETTERS.reduce((s, _, p) => {
      const e = Math.max(ref[p]!, 0.05) / 100
      const o = total ? counts[md(p + kk, 26)]! / total : 0
      return s + ((o - e) * (o - e)) / e
    }, 0)
  const scores = LETTERS.map((_, kk) => chi(kk))
  const bestK = scores.reduce((b, v, i) => (v < scores[b]! ? i : b), 0)
  const sorted = [...scores].sort((a, b) => a - b)
  const clear = sorted[1]! > sorted[0]! * 1.6 // nejlepší posun výrazně vyčnívá

  const candidate = text
    .split('')
    .map((ch) => (ch === ' ' ? ' ' : letter(idx(ch) - k)))
    .join('')

  return (
    <Widget
      title={title ?? 'Frekvenční analýza'}
      lead={lead ?? 'Posouvejte zkusmý klíč k, dokud se sloupce dešifrovaného textu nekryjí s četnostmi jazyka; pak text začne dávat smysl.'}
      {...st.widget}
      footer={
        <p>
          Monoalfabetická šifra písmena jen přejmenuje, jejich četnosti zůstanou. Nejčastější písmeno ŠT proto skoro jistě odpovídá E a z jediné dvojice
          (ŠT, OT) se dopočítá posun. U krátkého textu to nemusí vyjít napoprvé — pak zkuste druhé nejčastější písmeno.
        </p>
      }
    >
      <TextField
        label="Šifrový text (ŠT)"
        multiline
        value={text}
        onChange={(t) => st.set({ text: t })}
        normalize={lettersAndSpaces}
        hint={`${plural(total, 'písmeno', 'písmena', 'písmen')}; jen A–Z a mezery.`}
      />

      <Grid min={220}>
        <Slider label="Zkusmý klíč k" value={k} min={0} max={25} onChange={(v) => st.set({ k: v })} format={(v) => `k = ${v}`} hint="Text se posune zpět: p = |c − k|₂₆." />
        <Segmented
          label="Srovnat s jazykem"
          value={lang}
          onChange={(v) => st.set({ lang: v })}
          options={[
            { value: 'en', label: 'Angličtina' },
            { value: 'cs', label: 'Čeština' },
          ]}
        />
      </Grid>

      {total === 0 ? (
        <Muted>Vložte šifrový text.</Muted>
      ) : (
        <>
          <Stack gap={2}>
            <Formula
              label={`Nejčastější ve ŠT: ${letter(top)} (${counts[top]}×). Předpoklad ${letter(top)} ↔ E:`}
              steps={[`k = |${top} − 4|₂₆`]}
              result={guess}
            />
            {k !== guess && (
              <Row>
                <Button size="sm" onClick={() => st.set({ k: guess })}>
                  Zkusit k = {guess}
                </Button>
              </Row>
            )}
          </Stack>

          <Bars
            data={LETTERS.map((ch, p) => ({
              label: ch,
              value: shifted[p]!,
              tone: p === md(top - k, 26) ? ('active' as const) : undefined,
              title: `${ch}: ${cz(shifted[p]!, 1)} % (ve ŠT písmeno ${letter(p + k)})`,
            }))}
            compare={ref}
            valueLabel={`Text posunutý zpět o k = ${k}`}
            compareLabel={lang === 'en' ? 'Angličtina' : 'Čeština'}
            format={(v) => `${cz(v, 1)} %`}
          />

          <KeyValue cols={1} items={[{ k: `Kandidát na OT (k = ${k})`, v: candidate }]} />

          {k === bestK && clear ? (
            <Verdict kind="ok" title={`k = ${k}: sloupce se kryjí`}>
              Četnosti posunutého textu odpovídají jazyku nejlépe ze všech 26 posunů — přečtěte kandidáta na OT.
            </Verdict>
          ) : !clear ? (
            <Verdict kind="warn" title="Žádný posun nesedí výrazně líp než ostatní">
              {total < 30
                ? 'Text je na statistiku příliš krátký.'
                : 'Četnosti jsou vyhlazené — nejspíš nejde o posuvnou šifru (např. Vigenère, kde se posun mění s pozicí).'}
            </Verdict>
          ) : null}
        </>
      )}
    </Widget>
  )
}
