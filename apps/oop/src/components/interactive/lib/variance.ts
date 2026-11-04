// Box[+T] / Box[-T] / Box[T] over a chain hierarchy (index 0 = most general).
export type Variance = 'co' | 'contra' | 'inv'
export const VAR_DECL: Record<Variance, string> = { co: '+T', contra: '-T', inv: 'T' }
export const HIERARCHIES = [
  ['Animal', 'Dog', 'Puppy'],
  ['A', 'B', 'C'],
] as const

/** Is H[x] <: H[y] for chain indexes? (deeper = more specific) */
export const sub = (x: number, y: number) => x >= y

/** Box[X] <: Box[Y] ? */
export function boxSub(v: Variance, x: number, y: number): boolean {
  if (v === 'inv') return x === y
  return v === 'co' ? sub(x, y) : sub(y, x)
}

/** one-line Czech reason for Box[X] <: Box[Y] */
export function reason(v: Variance, X: string, Y: string, x: number, y: number): string {
  const rel = x === y ? `${X} = ${Y}` : sub(x, y) ? `${X} <: ${Y}` : `${Y} <: ${X}`
  if (x === y) return `Stejný typový argument → vždy platí, i u invariantního Box.`
  if (v === 'inv') return `Invariantní Box: Box[${X}] a Box[${Y}] spolu nesouvisí, i když ${rel}.`
  if (v === 'co')
    return sub(x, y)
      ? `+T zachovává směr: ${rel} ⇒ Box[${X}] <: Box[${Y}].`
      : `+T zachovává směr: ${rel} ⇒ Box[${Y}] <: Box[${X}], ne naopak.`
  return sub(y, x)
    ? `-T otočí směr: ${rel} ⇒ Box[${X}] <: Box[${Y}].`
    : `-T otočí směr: ${rel} ⇒ Box[${Y}] <: Box[${X}], ne naopak.`
}
