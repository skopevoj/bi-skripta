import { useMemo } from 'react'
import { Bars, BitRow, Grid, Panel, Segmented, Stack, TextField, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { bytesToBits, bytesToHex, hamming, sha1, sha256, utf8 } from './lib/symmetric'

// Lavinový efekt: kolik bitů haše se změní, když se vstup změní o jediný bit? (≈ polovina)

type Fn = 'sha1' | 'sha256'
type State = { a: string; b: string; fn: Fn }

const HASH: Record<Fn, (m: number[]) => number[]> = { sha1, sha256 }
const NAME: Record<Fn, string> = { sha1: 'SHA-1', sha256: 'SHA-256' }
const MAX = 64 // bajtů zprávy

const PRESETS = [
  { label: 'abc → abb', values: { a: 'abc', b: 'abb' } },
  { label: 'Velké písmeno', values: { a: 'abc', b: 'Abc' }, note: '„a“ = 01100001, „A“ = 01000001 — liší se jediným bitem, a přesto se změní zhruba polovina haše.' },
  { label: 'Mezera navíc', values: { a: 'abc', b: 'abc ' }, note: 'Jiná délka zprávy: změní se i zarovnání (délka je v posledních 64 bitech bloku), výsledek je stejně „náhodný“.' },
] as const

/** Popisky košů histogramu (v % změněných bitů). */
const BINS = ['< 34', '34–38', '38–42', '42–46', '46–50', '50–54', '54–58', '58–62', '62–66', '≥ 66'] as const

const pct = (x: number) => `${(Math.round(x * 1000) / 10).toString().replace('.', ',')} %`

export function Avalanche({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ a: 'abc', b: 'abb', fn: 'sha1' }, PRESETS)
  const { a, b, fn } = st.value
  const ma = utf8(a)
  const mb = utf8(b)
  const errA = ma.length > MAX ? `Nejvýš ${MAX} bajtů, teď ${ma.length}.` : undefined
  const errB = mb.length > MAX ? `Nejvýš ${MAX} bajtů, teď ${mb.length}.` : undefined

  const ha = useMemo(() => HASH[fn](ma), [fn, a]) // eslint-disable-line react-hooks/exhaustive-deps
  const hb = useMemo(() => HASH[fn](mb), [fn, b]) // eslint-disable-line react-hooks/exhaustive-deps
  const n = ha.length * 8
  const d = hamming(ha, hb)
  const inDiff = ma.length === mb.length ? hamming(ma, mb) : null

  // všechny změny jednoho bitu M → rozdělení počtu změněných bitů haše
  const dist = useMemo(() => {
    if (!ma.length || errA) return null
    const counts: number[] = []
    for (let i = 0; i < ma.length * 8; i++) {
      const m = ma.slice()
      m[i >> 3] ^= 0x80 >> (i & 7)
      counts.push(hamming(ha, HASH[fn](m)))
    }
    // koše po 4 % kolem 50 % (krajní koše berou i zbytek)
    const bins = Array.from({ length: BINS.length }, () => 0)
    counts.forEach((c) => bins[Math.max(0, Math.min(BINS.length - 1, Math.floor(((c / n) * 100 - 30) / 4)))]!++)
    const avg = counts.reduce((x, y) => x + y, 0) / counts.length / n
    return { bins, avg, total: counts.length, min: Math.min(...counts), max: Math.max(...counts) }
  }, [fn, a]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Widget
      title={title ?? 'Lavinový efekt'}
      lead={lead ?? 'Změňte ve zprávě M′ jedno písmeno a sledujte, kolik bitů haše se překlopí.'}
      {...st.widget}
      footer={
        <p>
          U dobré hašovací funkce (i blokové šifry) změní 1 bit vstupu v průměru polovinu bitů výstupu, a to na nepředvídatelných místech. Z haše
          proto nejde poznat, jak „blízko“ jsou si dvě zprávy, a nedá se hledat kolize postupným dolaďováním vstupu.
        </p>
      }
    >
      <Grid min={200}>
        <TextField label="Zpráva M" value={a} onChange={(v) => st.set({ a: v })} mono error={errA} />
        <TextField
          label="Zpráva M′"
          value={b}
          onChange={(v) => st.set({ b: v })}
          mono
          error={errB}
          hint={inDiff !== null ? `Liší se od M v ${inDiff} ${inDiff === 1 ? 'bitu' : 'bitech'}.` : `Jiná délka (${mb.length} vs. ${ma.length} bajtů).`}
        />
        <Segmented<Fn>
          label="Hašovací funkce"
          value={fn}
          onChange={(v) => st.set({ fn: v })}
          options={[
            { value: 'sha1', label: 'SHA-1' },
            { value: 'sha256', label: 'SHA-256' },
          ]}
        />
      </Grid>

      {errA || errB ? (
        <Verdict kind="bad" title="Zpráva je moc dlouhá">
          {errA ?? errB}
        </Verdict>
      ) : (
        <>
          <Stack gap={3}>
            <BitRow label={`${NAME[fn]}(M) = ${bytesToHex(ha)}`} bits={bytesToBits(ha)} />
            <BitRow label={`${NAME[fn]}(M′) = ${bytesToHex(hb)}`} bits={bytesToBits(hb)} compare={bytesToBits(ha)} showDiffCount />
          </Stack>

          <Verdict kind={d === 0 ? 'info' : 'ok'} title={d === 0 ? 'Stejné zprávy, stejný haš' : `Změnilo se ${d} z ${n} bitů haše (${pct(d / n)})`}>
            {d === 0 ? 'Upravte M′, aby se lišila od M.' : `Očekávaná hodnota je n/2 = ${n / 2} bitů — změněné bity jsou zvýrazněné výše a nejsou nijak seskupené.`}
          </Verdict>

          {dist && (
            <Panel
              variant="soft"
              label={`Všech ${dist.total} změn jednoho bitu M → % změněných bitů haše`}
              aside={`průměr ${pct(dist.avg)} · min ${dist.min} · max ${dist.max} bitů`}
            >
              <Bars
                height={90}
                data={dist.bins.map((v, i) => ({ label: BINS[i]!, value: v, tone: i === 4 || i === 5 ? 'active' : undefined, title: `${v}× změna ${BINS[i]} % bitů` }))}
                format={(v) => String(v)}
              />
            </Panel>
          )}
        </>
      )}
    </Widget>
  )
}
