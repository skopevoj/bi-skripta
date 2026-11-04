import { useMemo } from 'react'
import { Formula, Grid, Muted, NumberField, Segmented, Stack, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import type { WidgetProps } from './registry'
import { leadNode, modN, randInt, sub } from './lib/numtheory'
import './widgets-a.css'

// Modulární kruh: a ∘ b v ℤₙ jako chůze po ciferníku o n dílcích.
// Výsledek je místo, kde ručička skončí; kolikrát přejde přes 0, je podíl q, který se zahodí.

type Op = '+' | '−' | '·'
type State = { n: number; a: number; b: number; op: Op }

const PRESETS = [
  { label: 'Z přednášky', values: { n: 12, a: 7, b: 8, op: '+' as Op } },
  {
    label: 'Odčítání přes 0',
    values: { n: 12, a: 3, b: 5, op: '−' as Op },
    note: '3 − 5 = −2: ručička jde proti směru a skončí na 10, protože −2 = −1 · 12 + 10. Výsledek mod je vždy 0 … n − 1.',
  },
  {
    label: 'Inverze v ℤ₂₆',
    values: { n: 26, a: 3, b: 9, op: '·' as Op },
    note: '3 · 9 = 27 ≡ 1 (mod 26): devět skoků po 3 skončí na 1, takže 9 je inverze 3 modulo 26 — přesně to potřebuje afinní šifra.',
  },
  {
    label: 'Součin je 0',
    values: { n: 6, a: 2, b: 3, op: '·' as Op },
    note: '2 · 3 ≡ 0 (mod 6), i když ani jeden činitel není 0. Proto v ℤ₆ nelze krátit dvojkou ani trojkou (poznámka 0.1).',
  },
] as const

const OPS = [
  { value: '+' as Op, label: '+', title: 'Sčítání: b dílků po směru' },
  { value: '−' as Op, label: '−', title: 'Odčítání: b dílků proti směru' },
  { value: '·' as Op, label: '×', title: 'Násobení: b skoků po a dílcích od 0' },
]

/* ------------------------------------------------------------------ */
/* Ciferník                                                            */
/* ------------------------------------------------------------------ */

const SIZE = 300
const C = SIZE / 2
const R_TICK = 112 // kruh s dílky
const R_LABEL = 133 // čísla
const R_WALK = 94 // první otočka chůze
const R_MIN = 36 // nejmenší poloměr spirály

function polar(pos: number, n: number, r: number) {
  const t = (pos / n) * 2 * Math.PI - Math.PI / 2
  return [C + r * Math.cos(t), C + r * Math.sin(t)] as const
}

type Walk = { start: number; dir: 1 | -1; dist: number; hop: number }

function Clock({ n, walk, result }: { n: number; walk: Walk; result: number }) {
  const { start, dir, dist, hop } = walk
  const laps = Math.max(1, Math.ceil(dist / n))
  // mezera mezi otočkami spirály, aby se vešla dovnitř ciferníku
  const gap = Math.min(11, (R_WALK - R_MIN) / laps)
  const radiusAt = (t: number) => R_WALK - (t / n) * gap

  // spirála: až 6 bodů na dílek, ale nejvýš ~1500 bodů celkem
  const perTick = Math.max(1, Math.min(6, Math.floor(1500 / Math.max(1, dist))))
  const pts: string[] = []
  for (let k = 0; k <= dist * perTick; k++) {
    const t = k / perTick
    const [x, y] = polar(start + dir * t, n, radiusAt(t))
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  // místa dopadu jednotlivých skoků u násobení
  const hops: (readonly [number, number])[] = []
  if (hop > 0 && dist / hop <= 60) {
    for (let t = hop; t < dist; t += hop) hops.push(polar(start + dir * t, n, radiusAt(t)))
  }
  const [sx, sy] = polar(start, n, R_WALK)

  return (
    <svg className="ix-modclock" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Ciferník ℤ${sub(n)}: start ${start}, výsledek ${result}`}>
      <defs>
        <marker id="ix-modclock-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 1 L9 5 L0 9 z" className="ix-modclock-head" />
        </marker>
      </defs>
      <circle cx={C} cy={C} r={R_TICK} className="ix-modclock-ring" />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = polar(i, n, R_TICK)
        const [lx, ly] = polar(i, n, R_LABEL)
        const cls = i === result ? 'ix-modclock-res' : i === start ? 'ix-modclock-start' : i === 0 ? 'ix-modclock-zero' : undefined
        return (
          <g key={i} className={cls}>
            <circle cx={x} cy={y} r={i === result ? 7 : i === start ? 5 : i === 0 ? 4 : 2.6} className="ix-modclock-tick" />
            <text x={lx} y={ly} className="ix-modclock-num" textAnchor="middle" dominantBaseline="central">
              {i}
            </text>
          </g>
        )
      })}
      {dist > 0 && <polyline points={pts.join(' ')} className="ix-modclock-walk" markerEnd="url(#ix-modclock-arrow)" />}
      {hops.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.8} className="ix-modclock-hop" />
      ))}
      <circle cx={sx} cy={sy} r={4.5} className="ix-modclock-from" />
      <text x={C} y={C - 6} className="ix-modclock-c" textAnchor="middle" dominantBaseline="central">
        {result}
      </text>
      <text x={C} y={C + 22} className="ix-modclock-csub" textAnchor="middle" dominantBaseline="central">
        v ℤ{sub(n)}
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Widget                                                              */
/* ------------------------------------------------------------------ */

export function ModClock({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ n: 12, a: 7, b: 8, op: '+' }, PRESETS)
  const { n, a, b, op } = st.value
  const aBad = a >= n

  const { raw, walk } = useMemo((): { raw: number; walk: Walk } => {
    if (op === '+') return { raw: a + b, walk: { start: a, dir: 1, dist: b, hop: 0 } }
    if (op === '−') return { raw: a - b, walk: { start: a, dir: -1, dist: b, hop: 0 } }
    return { raw: a * b, walk: { start: 0, dir: 1, dist: a * b, hop: a } }
  }, [a, b, op])
  const r = modN(raw, n)
  const q = Math.floor(raw / n)
  const expr = `${a} ${op} ${b}`
  const wraps = Math.abs(q)

  const walkText =
    op === '+'
      ? `Z ${a} ujdeš ${b} dílků po směru hodin.`
      : op === '−'
        ? `Z ${a} ujdeš ${b} dílků proti směru hodin.`
        : `Z 0 uděláš ${b} skoků po ${a} dílcích (násobení = opakované sčítání).`

  return (
    <Widget
      title={title ?? 'Modulární kruh'}
      lead={leadNode(lead, 'Zvol operaci a čísla a sleduj, kde ručička na ciferníku o n dílcích skončí.')}
      {...st.widget}
      onRandom={() => {
        const nn = randInt(5, 26)
        st.set({ n: nn, a: randInt(0, nn - 1), b: randInt(1, 2 * nn) })
      }}
      footer={
        <p>
          Celé otočky přes 0 se zahazují — zbude jen místo, kde ručička stojí. Proto stačí počítat se zbytky 0 … n − 1 a mezivýsledky můžeš
          brát mod n kdykoli (věta 0.1).
        </p>
      }
    >
      <Grid min={130}>
        <NumberField label="Modul n" value={n} min={2} max={36} onChange={(v) => st.set({ n: v })} hint="Počet dílků ciferníku." />
        <NumberField
          label="a"
          value={a}
          min={0}
          max={99}
          onChange={(v) => st.set({ a: v })}
          error={aBad ? `a musí být menší než n = ${n} (zkus ${a % n}).` : undefined}
        />
        <Segmented label="Operace" value={op} options={OPS} onChange={(v) => st.set({ op: v })} />
        <NumberField label="b" value={b} min={0} max={99} onChange={(v) => st.set({ b: v })} />
      </Grid>

      {aBad ? (
        <Verdict kind="bad" title="Číslo a leží mimo ciferník">
          V ℤ{sub(n)} existují jen zbytky 0 až {n - 1}. Zmenši a, nebo zvětši modul n.
        </Verdict>
      ) : (
        <div className="ix-modclock-layout">
          <Clock n={n} walk={walk} result={r} />
          <Stack gap={3}>
            <Formula label="Výsledek" steps={[`(${expr}) mod ${n}`, `${raw} mod ${n}`]} result={r} />
            <p className="ix-modclock-text">
              {walkText} Protože {raw} = {q} · {n} + {r}, ručička {wraps === 0 ? 'nepřešla přes 0' : `přešla přes 0 ${wraps}×`} a skončila na{' '}
              <b>{r}</b>.
            </p>
            <Formula label="Zápis" steps={[expr]} rel="≡" result={r} suffix={`(mod ${n})`} />
            <Muted>
              Tečka = start ({walk.start}), velký kruh = výsledek ({r}){walk.dist > n ? ', každá otočka spirály = jedno přetočení přes 0' : ''}
              {op === '·' && walk.dist / a <= 60 ? ', malé tečky = dopady jednotlivých skoků' : ''}.
            </Muted>
          </Stack>
        </div>
      )}
    </Widget>
  )
}
