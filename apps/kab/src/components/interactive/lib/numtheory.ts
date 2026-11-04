// Teorie čísel pro widgety skupiny A (mod, gcd, inverze, φ, umocňování, Rabin–Miller, RSA, D-H).
// Všechno, co může přetéct 2^53 (umocňování, součiny), počítá v BigInt.

import { createElement, type ReactNode } from 'react'
import { MathHTML } from '@skripta/ui/math'

/** Matematické modulo pro čísla (vždy 0 … n−1). */
export const modN = (a: number, n: number) => ((a % n) + n) % n

/** Matematické modulo pro BigInt (vždy 0 … n−1). */
export const modB = (a: bigint, n: bigint) => ((a % n) + n) % n

/** a^e mod m v BigInt (square & multiply zprava). */
export function modPow(a: bigint | number, e: bigint | number, m: bigint | number): bigint {
  const M = BigInt(m)
  if (M === 1n) return 0n
  let base = modB(BigInt(a), M)
  let exp = BigInt(e)
  let r = 1n
  while (exp > 0n) {
    if (exp & 1n) r = (r * base) % M
    base = (base * base) % M
    exp >>= 1n
  }
  return r
}

/** Číslo s typografickým minusem (−3 místo -3). */
export const fmt = (x: number | bigint) => String(x).replace('-', '−')

/** a·b mod m bez přetečení (přes BigInt). */
export const mulMod = (a: number, b: number, m: number) => Number((BigInt(a) * BigInt(b)) % BigInt(m))

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

/* ------------------------------------------------------------------ */
/* Euklidův algoritmus                                                 */
/* ------------------------------------------------------------------ */

export type EuclidRow = { i: number; a: number; b: number; q: number; r: number }

/** Řádky a = q·b + r, dokud r ≠ 0 (poslední řádek má r = 0). */
export function euclidRows(a: number, b: number): EuclidRow[] {
  const rows: EuclidRow[] = []
  let x = a
  let y = b
  while (y !== 0 && rows.length < 200) {
    const q = Math.floor(x / y)
    const r = x - q * y
    rows.push({ i: rows.length + 1, a: x, b: y, q, r })
    x = y
    y = r
  }
  return rows
}

/* ------------------------------------------------------------------ */
/* Rozšířený Euklidův algoritmus                                       */
/* ------------------------------------------------------------------ */

/** Řádek tabulky: platí r = s·a + t·n. q je podíl, kterým se z řádků i−2, i−1 spočítal tento řádek. */
export type ExtRow = { i: number; q: number | null; r: number; s: number; t: number }

/**
 * Tabulková verze rozšířeného Eukleida pro a⁻¹ mod n.
 * r₀ = n (= 0·a + 1·n), r₁ = a (= 1·a + 0·n), r_{i+1} = r_{i−1} − q·r_i a stejně pro s, t.
 * Končí řádkem se zbytkem 0.
 */
export function extEuclidRows(a: number, n: number): ExtRow[] {
  const rows: ExtRow[] = [
    { i: 0, q: null, r: n, s: 0, t: 1 },
    { i: 1, q: null, r: a, s: 1, t: 0 },
  ]
  while (rows[rows.length - 1]!.r !== 0 && rows.length < 200) {
    const p = rows[rows.length - 2]!
    const c = rows[rows.length - 1]!
    const q = Math.floor(p.r / c.r)
    rows.push({ i: rows.length, q, r: p.r - q * c.r, s: p.s - q * c.s, t: p.t - q * c.t })
  }
  return rows
}

/** a⁻¹ mod n, nebo null, když gcd(a, n) ≠ 1. */
export function modInverse(a: number, n: number): number | null {
  const rows = extEuclidRows(modN(a, n), n)
  const last = rows[rows.length - 2]!
  if (last.r !== 1) return null
  return modN(last.s, n)
}

/* ------------------------------------------------------------------ */
/* Prvočísla, rozklad, φ                                               */
/* ------------------------------------------------------------------ */

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false
  if (n < 4) return true
  if (n % 2 === 0) return false
  for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false
  return true
}

export function nextPrime(n: number): number {
  let k = Math.max(2, Math.floor(n) + 1)
  while (!isPrime(k)) k++
  return k
}

export function prevPrime(n: number): number | null {
  for (let k = Math.floor(n) - 1; k >= 2; k--) if (isPrime(k)) return k
  return null
}

export type PrimePower = { p: number; k: number }

/** Prvočíselný rozklad (pokusné dělení). */
export function factorize(n: number): PrimePower[] {
  const out: PrimePower[] = []
  let m = n
  for (let p = 2; p * p <= m; p += p === 2 ? 1 : 2) {
    if (m % p) continue
    let k = 0
    while (m % p === 0) {
      m /= p
      k++
    }
    out.push({ p, k })
  }
  if (m > 1) out.push({ p: m, k: 1 })
  return out
}

export function phi(n: number): number {
  return factorize(n).reduce((acc, { p }) => (acc / p) * (p - 1), n)
}

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' }
/** Horní index z Unicode znaků (pro krátké texty bez KaTeXu). */
export const sup = (n: number | string) => String(n).replace(/[0-9-]/g, (c) => SUP[c]!)

const SUB: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' }
/** Dolní index z Unicode znaků. */
export const sub = (n: number | string) => String(n).replace(/[0-9]/g, (c) => SUB[c]!)

/** „2² · 3“ */
export const factorText = (f: PrimePower[]) => f.map(({ p, k }) => (k > 1 ? `${p}${sup(k)}` : `${p}`)).join(' · ')

/** „2² · 3“ v TeXu. */
export const factorTex = (f: PrimePower[]) => f.map(({ p, k }) => (k > 1 ? `${p}^{${k}}` : `${p}`)).join(' \\cdot ')

/* ------------------------------------------------------------------ */
/* Grupa ℤ_p*                                                          */
/* ------------------------------------------------------------------ */

/** Řád prvku a v ℤ_p* pro prvočíslo p (přes rozklad p − 1, rychlé i pro velká p). */
export function orderModPrime(a: number, p: number): number {
  let ord = p - 1
  for (const { p: r } of factorize(p - 1)) {
    while (ord % r === 0 && modPow(a, ord / r, p) === 1n) ord /= r
  }
  return ord
}

/** Mocniny a, a², … až po 1 (podgrupa generovaná a). */
export function powersOf(a: number, m: number, limit = 400): number[] {
  const out: number[] = []
  let x = modN(a, m)
  for (let k = 0; k < limit; k++) {
    out.push(x)
    if (x === 1) break
    x = mulMod(x, a, m)
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Square & multiply                                                   */
/* ------------------------------------------------------------------ */

export type SqmStep = {
  /** Pořadí bitu zleva (0 = nejvyšší). */
  i: number
  bit: 0 | 1
  /** Hodnota před krokem. */
  before: bigint
  /** Po umocnění na druhou (u prvního bitu se neumocňuje — výsledek je 1). */
  sq: bigint
  /** Po případném vynásobení základem. */
  after: bigint
  /** Exponent, kterému odpovídá `after` (binární prefix exponentu). */
  expSoFar: bigint
  /** Exponent po umocnění na druhou. */
  expSq: bigint
  /** Byl to první bit (bez umocnění). */
  first: boolean
}

/** Square & multiply zleva doprava: pro každý bit exponentu x := x², a při bitu 1 ještě x := x·a. */
export function squareMultiplySteps(a: bigint, e: bigint, m: bigint): SqmStep[] {
  const bits = e.toString(2)
  const base = modB(a, m)
  const steps: SqmStep[] = []
  let x = 1n % m
  let ex = 0n
  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i] === '1' ? 1 : 0
    const first = i === 0
    const sq = first ? x : (x * x) % m
    const expSq = ex * 2n
    const after = bit ? (sq * base) % m : sq
    const expAfter = expSq + BigInt(bit)
    steps.push({ i, bit, before: x, sq, after, expSoFar: expAfter, expSq, first })
    x = after
    ex = expAfter
  }
  return steps
}

/* ------------------------------------------------------------------ */
/* Rabin–Miller                                                        */
/* ------------------------------------------------------------------ */

/** n − 1 = 2^b · m, m liché. */
export function split2(n1: bigint): { b: number; m: bigint } {
  let b = 0
  let m = n1
  while (m > 0n && (m & 1n) === 0n) {
    m >>= 1n
    b++
  }
  return { b, m }
}

/* ------------------------------------------------------------------ */
/* Úvodní věta z obsahu                                                 */
/* ------------------------------------------------------------------ */

/** `lead` z obsahu může obsahovat `$…$` — vykreslíme ho přes KaTeX. Bez něj vrátí výchozí větu widgetu. */
export function leadNode(lead: string | undefined, fallback: ReactNode): ReactNode {
  if (!lead) return fallback
  if (!lead.includes('$')) return lead
  return createElement(MathHTML, { html: lead, as: 'span' })
}

/** Pseudonáhodné celé číslo v [lo, hi]. */
export const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1))
