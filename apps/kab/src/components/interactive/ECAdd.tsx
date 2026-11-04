import { useMemo, useState } from 'react'
import { Formula, Grid, KeyValue, NumberField, Segmented, Select, Stack, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { isPrime, md, modInv, signed, useWidth } from './lib/classical'
import './widgets-b.css'

// Sčítání bodů na eliptické křivce y² ≡ x³ + ax + b (mod p). Jedna otázka: jak se spočítá P + Q (a 2P) a proč leží
// P, Q a −R na jedné „přímce“.

type Pt = readonly [number, number] | null // null = bod v nekonečnu O
type State = { a: number; b: number; p: number; P: string; Q: string }

const key = (pt: Pt) => (pt ? `${pt[0]},${pt[1]}` : 'O')
const parse = (s: string): Pt => {
  if (s === 'O') return null
  const [x, y] = s.split(',').map(Number)
  return [x!, y!]
}
const show = (pt: Pt) => (pt ? `[${pt[0]}, ${pt[1]}]` : 'O')

const PRESETS = [
  { label: 'Z přednášky: 2P', values: { a: 2, b: 2, p: 17, P: '5,1', Q: '5,1' } },
  { label: 'P + Q', values: { a: 2, b: 2, p: 17, P: '5,1', Q: '6,3' }, note: 'Přičtením P k 2P = [6, 3] vznikne 3P. Opakovaným sčítáním dostaneme libovolný násobek kP.' },
  {
    label: 'P + (−P)',
    values: { a: 2, b: 2, p: 17, P: '5,1', Q: '5,16' },
    note: 'Body nad sebou se stejným x: spojnice je svislá, třetí průsečík leží v nekonečnu, a proto P + (−P) = O.',
  },
]

type Sum =
  | { kind: 'identity'; R: Pt; why: string }
  | { kind: 'vertical'; R: null }
  | { kind: 'line'; R: readonly [number, number]; s: number; doubling: boolean; num: number; den: number; inv: number }

function add(P: Pt, Q: Pt, a: number, p: number): Sum {
  if (!P) return { kind: 'identity', R: Q, why: 'P = O je neutrální prvek, takže O + Q = Q.' }
  if (!Q) return { kind: 'identity', R: P, why: 'Q = O je neutrální prvek, takže P + O = P.' }
  const [x1, y1] = P
  const [x2, y2] = Q
  const doubling = x1 === x2 && y1 === y2
  if (x1 === x2 && (!doubling || y1 === 0)) return { kind: 'vertical', R: null }
  const num = doubling ? md(3 * x1 * x1 + a, p) : md(y2 - y1, p)
  const den = doubling ? md(2 * y1, p) : md(x2 - x1, p)
  const inv = modInv(den, p)!
  const s = md(num * inv, p)
  const x3 = md(s * s - x1 - x2, p)
  const y3 = md(s * (x1 - x3) - y1, p)
  return { kind: 'line', R: [x3, y3], s, doubling, num, den, inv }
}

export function ECAdd({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ a: 2, b: 2, p: 17, P: '5,1', Q: '5,1' }, PRESETS)
  const { a: aRaw, b: bRaw, p } = st.value
  const [target, setTarget] = useState<'P' | 'Q'>('P')

  const prime = isPrime(p)
  const a = md(aRaw, p)
  const b = md(bRaw, p)
  const disc = md(4 * a * a * a + 27 * b * b, p)
  const valid = prime && disc !== 0

  const points = useMemo(() => {
    const out: [number, number][] = []
    if (!valid) return out
    for (let x = 0; x < p; x++) {
      const rhs = md(x * x * x + a * x + b, p)
      for (let y = 0; y < p; y++) if ((y * y) % p === rhs) out.push([x, y])
    }
    return out
  }, [a, b, p, valid])
  const onCurve = (pt: Pt) => !pt || points.some(([x, y]) => x === pt[0] && y === pt[1])

  // Když se změní křivka a vybraný bod na ní neleží, vezmeme první bod (stav se nepřepisuje, jen zobrazení).
  const fallback: Pt = points[0] ?? null
  const P0 = parse(st.value.P)
  const Q0 = parse(st.value.Q)
  const P = onCurve(P0) ? P0 : fallback
  const Q = onCurve(Q0) ? Q0 : fallback

  const sum = valid ? add(P, Q, a, p) : null
  const R = sum?.R ?? null
  const negR: Pt = sum?.kind === 'line' ? [sum.R[0], md(-sum.R[1], p)] : null

  const order = useMemo(() => {
    if (!valid || !P) return 1
    let acc: Pt = P
    let r = 1
    while (acc && r <= points.length + 2) {
      acc = add(acc, P, a, p).R
      r++
    }
    return r
  }, [P, a, p, points.length, valid])

  const pick = (pt: Pt) => {
    if (target === 'P') {
      st.set({ P: key(pt) })
      setTarget('Q')
    } else {
      st.set({ Q: key(pt) })
      setTarget('P')
    }
  }

  const opts = [...points.map((pt) => ({ value: key(pt), label: show(pt) })), { value: 'O', label: 'O (bod v nekonečnu)' }]
  const sub = `${p}`.split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join('')
  const m = (e: string) => `|${e}|${sub}`

  return (
    <Widget
      title={title ?? 'Sčítání bodů na eliptické křivce'}
      lead={lead ?? 'Klikněte v grafu na dva body P a Q (dvakrát na stejný bod = zdvojení) a sledujte výpočet směrnice s a souřadnic R = P + Q.'}
      {...st.widget}
      footer={
        <p>
          P, Q a −R leží na jedné přímce y ≡ s·x + c (mod p) — v GF(p) se „přímka“ jen zalomí přes okraj, proto vypadá jako rozházené body. Součet R je
          zrcadlový obraz −R podle osy (y ↔ p − y). Řád bodu dělí řád křivky #E; když je #E prvočíslo, má každý bod kromě O řád #E.
        </p>
      }
    >
      <Grid min={110}>
        <NumberField label="Koeficient a" value={aRaw} min={0} max={96} onChange={(v) => st.set({ a: v })} />
        <NumberField label="Koeficient b" value={bRaw} min={0} max={96} onChange={(v) => st.set({ b: v })} />
        <NumberField
          label="Modul p"
          value={p}
          min={5}
          max={61}
          onChange={(v) => st.set({ p: v })}
          error={prime ? undefined : `${p} není prvočíslo, GF(p) by nebylo těleso — zkuste ${nextPrime(p)}.`}
        />
      </Grid>

      <Tex display tex={`E:\\ y^2 \\equiv x^3 ${a ? `+ ${a === 1 ? '' : a}x` : ''} ${b ? `+ ${b}` : ''} \\pmod{${p}}`} />

      {!prime ? null : !valid ? (
        <Verdict kind="bad" title="Singulární křivka — body netvoří grupu">
          |4a³ + 27b²|{sub} = 0, takže křivka má hrot nebo samoprůsečík a sčítání bodů není definované. Změňte a nebo b.
        </Verdict>
      ) : (
        <>
          <Grid min={150}>
            <Select label="Bod P" value={key(P)} options={opts} onChange={(v) => st.set({ P: v })} />
            <Select label="Bod Q" value={key(Q)} options={opts} onChange={(v) => st.set({ Q: v })} />
            <Segmented
              label="Klik v grafu nastaví"
              value={target}
              onChange={setTarget}
              options={[
                { value: 'P', label: 'P' },
                { value: 'Q', label: 'Q' },
              ]}
            />
          </Grid>

          <ECPlot p={p} points={points} P={P} Q={Q} R={R} negR={negR} sum={sum} onPick={pick} />

          {sum?.kind === 'line' ? (
            <Stack gap={2}>
              <Formula
                label={sum.doubling ? 'Směrnice tečny' : 'Směrnice sečny'}
                steps={
                  sum.doubling
                    ? [m('(3x_P² + a)·(2y_P)⁻¹'), m(`(3·${P![0]}² + ${a})·(2·${P![1]})⁻¹`), m(`${sum.num}·${sum.den}⁻¹`), m(`${sum.num}·${sum.inv}`)]
                    : [m('(y_Q − y_P)·(x_Q − x_P)⁻¹'), m(`(${Q![1]} − ${P![1]})·(${Q![0]} − ${P![0]})⁻¹`), m(`${sum.num}·${sum.den}⁻¹`), m(`${sum.num}·${sum.inv}`)]
                }
                result={`s = ${sum.s}`}
              />
              <Formula label="x_R" steps={[m('s² − x_P − x_Q'), m(`${sum.s}² − ${P![0]} − ${Q![0]}`), m(signed(sum.s * sum.s - P![0] - Q![0]))]} result={sum.R[0]} />
              <Formula label="y_R" steps={[m('s·(x_P − x_R) − y_P'), m(`${sum.s}·(${P![0]} − ${sum.R[0]}) − ${P![1]}`), m(signed(sum.s * (P![0] - sum.R[0]) - P![1]))]} result={sum.R[1]} />
            </Stack>
          ) : null}

          {sum && (
            <Verdict kind="ok" title={`${sum.kind === 'line' && sum.doubling ? '2P' : 'P + Q'} = ${show(R)}`}>
              {sum.kind === 'identity'
                ? sum.why
                : sum.kind === 'vertical'
                  ? P![1] === Q![1]
                    ? `Bod má y = 0, takže tečna v něm je svislá a 2P = O.`
                    : `P a Q mají stejné x = ${P![0]} a opačná y, takže spojnice je svislá a třetí průsečík leží v nekonečnu.`
                  : `Kontrola: ${sum.R[1]}² = ${sum.R[1] ** 2} ≡ ${md(sum.R[1] ** 2, p)} a ${sum.R[0]}³ + ${a}·${sum.R[0]} + ${b} = ${sum.R[0] ** 3 + a * sum.R[0] + b} ≡ ${md(sum.R[0] ** 3 + a * sum.R[0] + b, p)} (mod ${p}), bod leží na křivce. Třetí průsečík přímky je −R = ${show(negR)}.`}
            </Verdict>
          )}

          <KeyValue
            cols={2}
            items={[
              { k: 'Řád křivky #E', v: points.length + 1, hint: `${points.length} bodů + O${isPrime(points.length + 1) ? ' (prvočíslo)' : ''}` },
              { k: 'Řád bodu P', v: P ? order : 1, hint: P ? `nejmenší r s r·P = O; dělí #E` : 'O má řád 1' },
            ]}
          />
        </>
      )}
    </Widget>
  )
}

function nextPrime(n: number): number {
  let k = Math.max(5, n)
  while (!isPrime(k)) k++
  return k > 61 ? 61 : k
}

function ECPlot({
  p,
  points,
  P,
  Q,
  R,
  negR,
  sum,
  onPick,
}: {
  p: number
  points: readonly (readonly [number, number])[]
  P: Pt
  Q: Pt
  R: Pt
  negR: Pt
  sum: Sum | null
  onPick: (pt: Pt) => void
}) {
  const [ref, W] = useWidth<HTMLDivElement>()
  const side = Math.min(W, 460)
  const m = { l: 28, r: 8, t: 8, b: 24 }
  const cell = (side - m.l - m.r) / p
  const H = m.t + cell * p + m.b
  const X = (x: number) => m.l + (x + 0.5) * cell
  const Y = (y: number) => m.t + (p - 0.5 - y) * cell
  const r = Math.max(3, Math.min(7, cell * 0.3))
  const hit = Math.max(cell / 2, 8)
  const tickStep = Math.max(1, Math.ceil(22 / cell))
  const ticks = Array.from({ length: p }, (_, i) => i).filter((i) => i % tickStep === 0)

  // Body „přímky“ y ≡ y_P + s(x − x_P) (mod p), nebo svislý sloupec x = x_P.
  const line: [number, number][] = []
  if (sum?.kind === 'line' && P) for (let x = 0; x < p; x++) line.push([x, md(P[1] + sum.s * (x - P[0]), p)])
  if (sum?.kind === 'vertical' && P) for (let y = 0; y < p; y++) line.push([P[0], y])

  const same = (u: Pt, v: readonly [number, number]) => !!u && u[0] === v[0] && u[1] === v[1]
  const labels: { pt: readonly [number, number]; text: string; cls?: string }[] = []
  if (P) labels.push({ pt: P, text: same(Q, P) ? 'P = Q' : 'P' })
  if (Q && !same(P, Q)) labels.push({ pt: Q, text: 'Q' })
  if (negR && !same(P, negR) && !same(Q, negR)) labels.push({ pt: negR, text: '−R' })
  if (R) labels.push({ pt: R, text: same(P, R) || same(Q, R) ? 'R (= P/Q)' : 'R', cls: 'ix-ecadd-lbl ix-ecadd-lbl-r' })

  const desc = `Body křivky v mřížce ${p} × ${p}. P = ${show(P)}, Q = ${show(Q)}, R = P + Q = ${show(R)}.`

  return (
    <div ref={ref} className="ix-ecadd-plot">
      <svg width={side} height={H} viewBox={`0 0 ${side} ${H}`} role="img" aria-label={desc}>
        <defs>
          <marker id="ix-ecadd-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L8,4 L0,8 z" className="ix-ecadd-arrowhead" />
          </marker>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={X(t)} x2={X(t)} y1={m.t} y2={m.t + cell * p} className="ix-ecadd-grid" />
            <line x1={m.l} x2={m.l + cell * p} y1={Y(t)} y2={Y(t)} className="ix-ecadd-grid" />
            <text x={X(t)} y={H - 8} textAnchor="middle" className="ix-ecadd-ax">
              {t}
            </text>
            <text x={m.l - 6} y={Y(t) + 4} textAnchor="end" className="ix-ecadd-ax">
              {t}
            </text>
          </g>
        ))}
        {/* osa zrcadlení y = p/2 */}
        <line x1={m.l} x2={m.l + cell * p} y1={m.t + (p / 2) * cell} y2={m.t + (p / 2) * cell} className="ix-ecadd-mirror" />

        {line.map(([x, y]) => (
          <rect key={`l${x},${y}`} x={X(x) - cell * 0.42} y={Y(y) - cell * 0.42} width={cell * 0.84} height={cell * 0.84} rx={3} className="ix-ecadd-line" />
        ))}

        {negR && R && <line x1={X(negR[0])} x2={X(R[0])} y1={Y(negR[1])} y2={Y(R[1]) + (R[1] > negR[1] ? r + 3 : -(r + 3))} className="ix-ecadd-refl" />}

        {points.map((pt) => {
          const cls = same(R, pt) ? 'ix-ecadd-pt ix-ecadd-r' : same(P, pt) || same(Q, pt) ? 'ix-ecadd-pt ix-ecadd-pq' : same(negR, pt) ? 'ix-ecadd-pt ix-ecadd-negr' : 'ix-ecadd-pt'
          return (
            <g key={key(pt)} className="ix-ecadd-g" onClick={() => onPick(pt)}>
              <title>{show(pt)}</title>
              <circle cx={X(pt[0])} cy={Y(pt[1])} r={hit} className="ix-ecadd-hit" />
              <circle cx={X(pt[0])} cy={Y(pt[1])} r={same(P, pt) || same(Q, pt) || same(R, pt) || same(negR, pt) ? r + 1.5 : r} className={cls} />
            </g>
          )
        })}

        {labels.map((l, i) => {
          const right = l.pt[0] < p * 0.75
          return (
            <text key={i} x={X(l.pt[0]) + (right ? r + 5 : -(r + 5))} y={Y(l.pt[1]) - r - 2} textAnchor={right ? 'start' : 'end'} className={l.cls ?? 'ix-ecadd-lbl'}>
              {l.text}
            </text>
          )
        })}
      </svg>
      <div className="ix-ecadd-legend" aria-hidden="true">
        <span>
          <i className="ix-ecadd-key" /> P, Q
        </span>
        <span>
          <i className="ix-ecadd-key ix-ecadd-key-line" /> přímka mod p
        </span>
        <span>
          <i className="ix-ecadd-key ix-ecadd-key-negr" /> −R (3. průsečík)
        </span>
        <span>
          <i className="ix-ecadd-key ix-ecadd-key-r" /> R = P + Q
        </span>
        <span>
          <i className="ix-ecadd-key ix-ecadd-key-mirror" /> osa zrcadlení (y ↔ p − y)
        </span>
      </div>
    </div>
  )
}
