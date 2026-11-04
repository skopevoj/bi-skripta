import { useMemo } from 'react'
import { Formula, Grid, KeyValue, Segmented, Slider, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { cz, pct, useWidth } from './lib/classical'
import './widgets-b.css'

// Narozeninový paradox. Jedna otázka: kolik prvků stačí vybrat, aby se dva (libovolné) shodovaly.

type Space = 'days' | 'h16' | 'h32'
type State = { space: Space; k: number }

const SPACES: Record<Space, { n: number; nTex: string; min: number; max: number; step: number; def: number; what: string }> = {
  days: { n: 365, nTex: '365', min: 2, max: 80, step: 1, def: 23, what: 'lidí' },
  h16: { n: 2 ** 16, nTex: '2¹⁶', min: 4, max: 1024, step: 4, def: 256, what: 'zpráv' },
  h32: { n: 2 ** 32, nTex: '2³²', min: 256, max: 262144, step: 256, def: 65536, what: 'zpráv' },
}

const PRESETS = [
  { label: 'Z přednášky', values: { space: 'days' as Space, k: 23 } },
  { label: '70 lidí', values: { space: 'days' as Space, k: 70 }, note: 'Při 70 lidech je shoda skoro jistá, přestože dní je pětkrát víc než lidí.' },
  {
    label: 'Haš 32 bitů',
    values: { space: 'h32' as Space, k: 65536 },
    note: '2^(b/2) = 2¹⁶ zpráv dá kolizi s pravděpodobností asi 39 %; na 50 % je potřeba asi 1,18 · 2^(b/2). Útok tedy stojí jen ~2^(b/2) haší, ne 2^b.',
  },
]

/** L[k] = ln P(žádná shoda mezi k prvky) = Σ ln(1 − i/n), i = 0 … k−1. */
function logNoCollision(n: number, kMax: number): Float64Array {
  const L = new Float64Array(kMax + 1)
  for (let k = 1; k <= kMax; k++) L[k] = L[k - 1]! + (k - 1 < n ? Math.log1p(-(k - 1) / n) : -Infinity)
  return L
}

export function Birthday({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ space: 'days', k: 23 }, PRESETS)
  const { space, k } = st.value
  const S = SPACES[space]
  const { n } = S

  const L = useMemo(() => logNoCollision(n, S.max), [n, S.max])
  const p1 = (kk: number) => 1 - Math.exp(L[Math.min(kk, S.max)]!)
  const p2 = (kk: number) => 1 - Math.exp(kk * Math.log1p(-1 / n))
  const k50 = useMemo(() => {
    for (let i = 1; i <= S.max; i++) if (1 - Math.exp(L[i]!) >= 0.5) return i
    return S.max
  }, [L, S.max])

  const exact = p1(k)
  const approx = 1 - Math.exp(-(k * k) / (2 * n))
  const pairs = (k * (k - 1)) / 2
  const fixed = p2(k)

  return (
    <Widget
      title={title ?? 'Narozeninový paradox'}
      lead={lead ?? 'Posouvejte počet lidí k a sledujte, jak rychle roste šance, že se libovolní dva shodují.'}
      {...st.widget}
      footer={
        <p>
          Shoda může nastat v kterékoli dvojici a dvojic je k(k − 1)/2, tedy přibližně k²/2 — proto stačí k ≈ √n, ne n/2. Intuice se plete, protože
          hledá shodu s jedním pevným člověkem (kolize 2. řádu, čárkovaná křivka). U b-bitové haše to znamená kolizi už po zhruba 2^(b/2) zprávách.
        </p>
      }
    >
      <Grid min={220}>
        <Segmented
          label="Prostor hodnot n"
          value={space}
          onChange={(v) => st.set({ space: v, k: SPACES[v].def })}
          options={[
            { value: 'days', label: '365 dní' },
            { value: 'h16', label: 'Haš 16 b' },
            { value: 'h32', label: 'Haš 32 b' },
          ]}
        />
        <Slider
          label={space === 'days' ? 'Počet lidí k' : 'Počet zpráv k'}
          value={k}
          min={S.min}
          max={S.max}
          step={S.step}
          onChange={(v) => st.set({ k: v })}
          format={(v) => `k = ${cz(v)}`}
        />
      </Grid>

      <Formula
        label="Aspoň jedna shoda"
        steps={['P(n, k) = 1 − (n−1)/n · (n−2)/n ⋯ (n−k+1)/n', `P(${S.nTex}, ${cz(k)})`]}
        result={pct(exact)}
      />

      <BirthdayPlot k={k} kMax={S.max} k50={k50} p1={p1} p2={p2} />

      <KeyValue
        cols={2}
        items={[
          { k: 'Odhad 1 − exp(−k²/2n)', v: pct(approx), hint: 'vzorec z přednášky' },
          { k: 'Dvojic k porovnání', v: cz(pairs), hint: `k(k − 1)/2 pro k = ${cz(k)}` },
          { k: 'Shoda s jedním pevným', v: pct(fixed), hint: '1 − (1 − 1/n)^k — kolize 2. řádu' },
          { k: 'Na 50 % stačí', v: `k = ${cz(k50)} ${S.what}`, hint: `√n = ${cz(Math.sqrt(n), space === 'days' ? 1 : 0)}` },
        ]}
      />
    </Widget>
  )
}

function BirthdayPlot({ k, kMax, k50, p1, p2 }: { k: number; kMax: number; k50: number; p1: (k: number) => number; p2: (k: number) => number }) {
  const [ref, W] = useWidth<HTMLDivElement>()
  const H = 200
  const m = { l: 40, r: 12, t: 12, b: 30 }
  const iw = Math.max(80, W - m.l - m.r)
  const ih = H - m.t - m.b
  const X = (kk: number) => m.l + (kk / kMax) * iw
  const Y = (p: number) => m.t + (1 - p) * ih

  const N = Math.min(kMax, 240)
  const path = (f: (k: number) => number) =>
    Array.from({ length: N + 1 }, (_, i) => {
      const kk = Math.round((i / N) * kMax)
      return `${i ? 'L' : 'M'}${X(kk).toFixed(1)},${Y(f(kk)).toFixed(1)}`
    }).join('')

  const ticks = niceTicks(kMax, W < 420 ? 4 : 5)
  const pk = p1(k)
  const labelRight = X(k) < m.l + iw * 0.7

  return (
    <div ref={ref} className="ix-birthday-plot">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Graf pravděpodobnosti shody v závislosti na k; pro k = ${k} je ${pct(pk)}.`}>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => (
          <g key={p}>
            <line x1={m.l} x2={m.l + iw} y1={Y(p)} y2={Y(p)} className={p === 0.5 ? 'ix-birthday-half' : 'ix-birthday-grid'} />
            <text x={m.l - 6} y={Y(p) + 4} textAnchor="end" className="ix-birthday-ax">
              {p * 100} %
            </text>
          </g>
        ))}
        {ticks.map((t) => (
          <text key={t} x={X(t)} y={H - 10} textAnchor="middle" className="ix-birthday-ax">
            {cz(t)}
          </text>
        ))}
        <line x1={X(k50)} x2={X(k50)} y1={Y(0.5)} y2={Y(0)} className="ix-birthday-half" />
        <path d={path(p2)} className="ix-birthday-p2" />
        <path d={path(p1)} className="ix-birthday-p1" />
        <line x1={X(k)} x2={X(k)} y1={m.t} y2={Y(0)} className="ix-birthday-k" />
        <circle cx={X(k)} cy={Y(pk)} r={5} className="ix-birthday-dot" />
        <text x={X(k) + (labelRight ? 8 : -8)} y={Math.max(m.t + 12, Y(pk) - 8)} textAnchor={labelRight ? 'start' : 'end'} className="ix-birthday-val">
          {pct(pk)}
        </text>
      </svg>
      <div className="ix-birthday-legend" aria-hidden="true">
        <span>
          <i className="ix-birthday-key" /> libovolní dva se shodují
        </span>
        <span>
          <i className="ix-birthday-key ix-birthday-key-2" /> shoda s jedním pevným
        </span>
      </div>
    </div>
  )
}

function niceTicks(max: number, count: number): number[] {
  const raw = max / count
  const pow = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 2.5, 5, 10].map((f) => f * pow).find((s) => s >= raw) ?? raw
  const out: number[] = []
  for (let t = 0; t <= max + 1e-9; t += step) out.push(Math.round(t))
  return out
}
