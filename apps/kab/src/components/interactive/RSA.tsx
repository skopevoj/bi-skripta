import { Formula, Grid, KeyValue, NumberField, Panel, Verdict, Widget, usePresetState } from '@skripta/ui/interactive'
import { Tex } from '@skripta/ui/math'
import type { WidgetProps } from './registry'
import { gcd, isPrime, leadNode, modInverse, modPow, nextPrime, prevPrime, randInt } from './lib/numtheory'

// RSA na malých číslech: z p, q, e se spočítá n, Φ(n) a d = e⁻¹ mod Φ(n);
// pak c = |m^e|_n a |c^d|_n vrátí m, protože e·d = 1 + k·Φ(n).

type State = { p: number; q: number; e: number; m: number }

const PRESETS = [
  { label: 'Z přednášky', values: { p: 43, q: 59, e: 13, m: 1520 } },
  {
    label: 'p = 61, q = 53',
    values: { p: 61, q: 53, e: 17, m: 65 },
    note: 'Učebnicový příklad: Φ(n) = 3120, d = 17⁻¹ mod 3120 = 2753, zpráva 65 se zašifruje na 2790.',
  },
  {
    label: 'm soudělné s n',
    values: { p: 43, q: 59, e: 13, m: 430 },
    note: '430 = 10 · 43 je soudělné s n, takže Eulerova věta se použít nedá — dešifrování přesto funguje (pro n = pq to platí pro každé m < n).',
  },
] as const

const SMALL_PRIMES = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139]

function primeError(name: string, x: number) {
  if (isPrime(x)) return undefined
  const lo = prevPrime(x)
  const hi = nextPrime(x)
  return `${name} = ${x} není prvočíslo — nejbližší jsou ${lo ? `${lo} a ` : ''}${hi}.`
}

/** Nejmenší e' ≥ from, které je nesoudělné s phi (a menší než phi). */
function nextValidE(from: number, phiN: number) {
  for (let x = Math.max(3, from); x < phiN; x++) if (gcd(x, phiN) === 1) return x
  return null
}

const bar = (x: string | number, mod: string | number) => `\\lvert ${x} \\rvert_{${mod}}`

export function RSA({ title, lead }: WidgetProps) {
  const st = usePresetState<State>({ p: 43, q: 59, e: 13, m: 1520 }, PRESETS)
  const { p, q, e, m } = st.value

  const pErr = primeError('p', p)
  const qErr = primeError('q', q) ?? (!pErr && p === q ? `p a q musí být různá prvočísla — zkus q = ${nextPrime(q)}.` : undefined)
  const primesOk = !pErr && !qErr
  const n = p * q
  const PHI = (p - 1) * (q - 1)
  const g = gcd(e, PHI)
  const eErr = !primesOk
    ? undefined
    : e >= PHI
      ? `e musí být menší než Φ(n) = ${PHI}.`
      : g !== 1
        ? `gcd(${e}, ${PHI}) = ${g} ≠ 1, takže e nemá inverzi mod Φ(n)${nextValidE(e + 1, PHI) ? ` — zkus e = ${nextValidE(e + 1, PHI)}` : ''}.`
        : undefined
  const keyOk = primesOk && !eErr
  const mErr = primesOk && m >= n ? `Zpráva musí být menší než n = ${n} (zkus ${m % n}).` : undefined

  const d = keyOk ? modInverse(e, PHI)! : 0
  const ed = BigInt(e) * BigInt(d)
  const k = keyOk ? (ed - 1n) / BigInt(PHI) : 0n
  const c = keyOk && !mErr ? modPow(m, e, n) : 0n
  const back = keyOk && !mErr ? modPow(c, d, n) : 0n

  return (
    <Widget
      title={title ?? 'RSA na malých číslech'}
      lead={leadNode(lead, 'Zvol prvočísla p, q a exponent e: hned uvidíš soukromý klíč d a jak dešifrování vrátí zprávu m.')}
      {...st.widget}
      onRandom={() => {
        const pp = SMALL_PRIMES[randInt(0, SMALL_PRIMES.length - 1)]!
        let qq = pp
        while (qq === pp) qq = SMALL_PRIMES[randInt(0, SMALL_PRIMES.length - 1)]!
        const ph = (pp - 1) * (qq - 1)
        st.set({ p: pp, q: qq, e: nextValidE(randInt(3, 40), ph) ?? 3, m: randInt(2, pp * qq - 1) })
      }}
      footer={
        <p>
          Veřejně je jen (n, e). Kdo zná p a q, spočítá Φ(n) a z něj d rozšířeným Euklidovým algoritmem; kdo je nezná, musí n rozložit na prvočísla — a
          to pro 2048bitové n nikdo neumí.
        </p>
      }
    >
      <Grid min={150}>
        <NumberField label="Prvočíslo p" value={p} min={2} max={999} onChange={(v) => st.set({ p: v })} error={pErr} />
        <NumberField label="Prvočíslo q" value={q} min={2} max={999} onChange={(v) => st.set({ q: v })} error={qErr} />
        <NumberField label="Exponent e" value={e} min={2} max={999999} onChange={(v) => st.set({ e: v })} error={eErr} />
        <NumberField label="Zpráva m" value={m} min={0} max={999999} onChange={(v) => st.set({ m: v })} error={mErr} />
      </Grid>

      {!keyOk ? (
        <Verdict kind="bad" title="Klíč nejde vytvořit">
          {pErr ?? qErr ?? eErr}
        </Verdict>
      ) : (
        <>
          <Panel label="Generování klíče" variant="soft">
            <KeyValue
              cols={3}
              items={[
                { k: 'n = p · q', v: n, hint: `${p} · ${q}` },
                { k: 'Φ(n) = (p − 1)(q − 1)', v: PHI, hint: `${p - 1} · ${q - 1}` },
                { k: 'd = e⁻¹ mod Φ(n)', v: d, hint: `e · d = ${ed} = ${k} · ${PHI} + 1`, tone: 'active' },
                { k: 'Veřejný klíč VK', v: `(${n}, ${e})` },
                { k: 'Soukromý klíč SK', v: `(${n}, ${d})` },
              ]}
            />
          </Panel>

          {mErr ? (
            <Verdict kind="bad" title="Zpráva je moc velká">
              {mErr} Delší zprávu je potřeba rozdělit na bloky menší než n.
            </Verdict>
          ) : (
            <>
              <Formula
                label="Šifrování"
                steps={[<Tex key="a" tex={`c = ${bar('m^e', 'n')}`} />, <Tex key="b" tex={bar(`${m}^{${e}}`, n)} />]}
                result={c.toString()}
              />
              <Formula
                label="Dešifrování"
                steps={[<Tex key="a" tex={bar('c^d', 'n')} />, <Tex key="b" tex={bar(`${c}^{${d}}`, n)} />]}
                result={back.toString()}
              />
              <Verdict kind={back === BigInt(m) ? 'ok' : 'bad'} title={`Dešifrování vrátilo m = ${back}`}>
                {gcd(m, n) === 1 ? (
                  <>
                    Protože e · d = 1 + {k.toString()} · Φ(n), je c<sup>d</sup> = m<sup>ed</sup> = m · (m<sup>Φ(n)</sup>)<sup>{k.toString()}</sup> ≡ m · 1 = m
                    (mod n) podle Eulerovy věty (věta 6.1).
                  </>
                ) : (
                  <>
                    gcd({m}, {n}) = {gcd(m, n)}, takže Eulerova věta neplatí — ale m<sup>ed</sup> ≡ m platí zvlášť modulo p i modulo q, a tedy i modulo n = pq.
                  </>
                )}
              </Verdict>
            </>
          )}
        </>
      )}
    </Widget>
  )
}
