// def f[T <: B](x: T) / def f[T >: B](x: T) / def f[T](x: T) with class A ⊃ B ⊃ C (+ Int, String).
export type Bound = 'none' | 'upper' | 'lower'
export const ARGS = [
  { t: 'A', expr: 'A()' },
  { t: 'B', expr: 'B()' },
  { t: 'C', expr: 'C()' },
  { t: 'Int', expr: '42' },
  { t: 'String', expr: '"hi"' },
] as const
export type ArgT = (typeof ARGS)[number]['t']
export const METHODS = [
  { name: 'ma()', owner: 'A' },
  { name: 'mb()', owner: 'B' },
  { name: 'mc()', owner: 'C' },
  { name: 'toString', owner: 'Any' },
] as const

const isSubOfB = (t: string) => t === 'B' || t === 'C'
const isSuperOfB = (t: string) => t === 'A' || t === 'B' // Any/AnyRef not offered as arguments

export const sig = (b: Bound) => (b === 'upper' ? 'T <: B' : b === 'lower' ? 'T >: B' : 'T')

/** f(arg) with the type argument inferred */
export function inferred(b: Bound, t: ArgT): boolean {
  return b === 'upper' ? isSubOfB(t) : true
}
/** f[t](arg) with the type argument written explicitly as the argument's own class */
export function explicit(b: Bound, t: ArgT): boolean {
  return b === 'upper' ? isSubOfB(t) : b === 'lower' ? isSuperOfB(t) : true
}
/** may the body of f call x.<m> ? */
export function callable(b: Bound, owner: string): boolean {
  if (owner === 'Any') return true
  return b === 'upper' && (owner === 'A' || owner === 'B')
}

export function whyInferred(b: Bound, t: ArgT): string {
  if (b === 'none') return 'Bez boundu projde cokoli.'
  if (b === 'upper')
    return isSubOfB(t) ? `T = ${t}, a ${t} <: B.` : `T by muselo být ${t}, ale ${t} není podtyp B → CE.`
  return t === 'C'
    ? 'Compiler zvolí T = B (B >: B) a C <: B, takže projde.'
    : isSuperOfB(t)
      ? `T = ${t}, a ${t} >: B.`
      : `Compiler rozšíří T na společný nadtyp B a ${t} (B | ${t}) → projde.`
}
export function whyExplicit(b: Bound, t: ArgT): string {
  if (b === 'none') return 'Bez boundu projde cokoli.'
  if (b === 'upper') return isSubOfB(t) ? `${t} <: B ✓` : `${t} does not conform to upper bound B → CE.`
  return isSuperOfB(t) ? `${t} >: B ✓` : `${t} does not conform to lower bound B → CE (typ je napsaný, compiler ho nerozšíří).`
}
export function whyCall(b: Bound, owner: string, name: string): string {
  if (owner === 'Any') return `${name} je metoda Any → jde vždy.`
  if (b === 'upper')
    return owner === 'C' ? `T může být i B, a B nemá ${name} → CE.` : `T <: B, takže x umí všechno, co B (i zděděné z A).`
  if (b === 'lower') return `T >: B může být klidně Any → o x víme jen, že je Any → CE.`
  return `T bez boundu = cokoli → jen metody Any → CE.`
}
