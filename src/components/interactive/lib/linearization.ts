// Scala linearization for `class X extends P1 with P2 with … with Pn`:
// L(X) = X, then L(Pn), L(Pn-1), …, L(P1) concatenated; keep only the LAST occurrence of each type.
// (Equivalent to the spec's right-associative +⃗ where later operands win.)

export type TypeDef = { name: string; kind: 'class' | 'trait'; parents: string[] }

export const TYPES: TypeDef[] = [
  { name: 'Animal', kind: 'class', parents: [] },
  { name: 'Furry', kind: 'trait', parents: ['Animal'] },
  { name: 'HasLegs', kind: 'trait', parents: ['Animal'] },
  { name: 'FourLegged', kind: 'trait', parents: ['HasLegs'] },
  { name: 'Swims', kind: 'trait', parents: ['Animal'] },
  { name: 'Pet', kind: 'trait', parents: ['Furry'] },
]
const byName = Object.fromEntries(TYPES.map((t) => [t.name, t]))
export const TAIL = ['AnyRef', 'Any']

function keepLast(seq: string[]): { name: string; kept: boolean }[] {
  return seq.map((name, i) => ({ name, kept: seq.indexOf(name, i + 1) < 0 }))
}

export function linOf(name: string): string[] {
  const t = byName[name]
  if (!t.parents.length) return [name, ...TAIL]
  const seq = [name, ...t.parents.slice().reverse().flatMap(linOf)]
  return keepLast(seq).filter((x) => x.kept).map((x) => x.name)
}

export type LinResult =
  | { ok: false; error: string; why: string }
  | {
      ok: true
      parts: { parent: string; lin: string[] }[] // right-to-left
      merged: { name: string; kept: boolean }[]
      result: string[]
    }

export function linearize(cls: string, parents: string[]): LinResult {
  if (!parents.length) return { ok: false, error: '', why: 'Přidej aspoň jednoho rodiče.' }
  const ci = parents.findIndex((p, i) => byName[p].kind === 'class' && i > 0)
  if (ci > 0)
    return {
      ok: false,
      error: `class ${parents[ci]} is not a trait`,
      why: `${parents[ci]} je třída → v <code>extends</code> smí stát jen na prvním místě, za <code>with</code> patří jen traity.`,
    }
  const parts = parents
    .slice()
    .reverse()
    .map((p) => ({ parent: p, lin: linOf(p) }))
  const merged = keepLast([cls, ...parts.flatMap((p) => p.lin)])
  return { ok: true, parts, merged, result: merged.filter((m) => m.kept).map((m) => m.name) }
}

/** Expected output of X().path, where every type except AnyRef/Any defines path. */
export function chainOutput(result: string[], before: boolean): string {
  const chain = result.filter((n) => !TAIL.includes(n))
  return before ? chain.join(' > ') : chain.slice().reverse().join(' < ')
}

export function scalaSource(cls: string, parents: string[], before: boolean): string {
  const body = (n: string) => (before ? `"${n} > " + super.path` : `super.path + " < ${n}"`)
  const L: string[] = ['class Animal:', '  def path: String = "Animal"', '']
  for (const t of TYPES.slice(1)) {
    L.push(`trait ${t.name} extends ${t.parents.join(' with ')}:`, `  override def path: String = ${body(t.name)}`, '')
  }
  L.push(`class ${cls} extends ${parents.join(' with ')}:`, `  override def path: String = ${body(cls)}`)
  return L.join('\n')
}
