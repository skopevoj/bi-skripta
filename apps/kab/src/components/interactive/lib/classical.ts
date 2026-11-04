import { useEffect, useRef, useState } from 'react'

// Sdílené pomůcky pro klasické šifry (Caesar, afinní, Hill, Vigenère, frekvenční analýza)
// a pro widgety s náhodou (BB84).

export const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const LETTERS = ABC.split('')

/** Matematické modulo, vždy 0 … n−1. */
export const md = (a: number, n: number) => ((a % n) + n) % n

/** Index písmene A–Z (0–25), jinak −1. */
export const idx = (ch: string) => ABC.indexOf(ch)

/** Písmeno pro číslo (mod 26). */
export const letter = (n: number) => ABC[md(n, 26)]!

/** Velká písmena bez diakritiky; ponechá A–Z a mezery (víc mezer za sebou sloučí). */
export function lettersAndSpaces(s: string): string {
  return s
    .toUpperCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Z ]/g, '')
    .replace(/ {2,}/g, ' ')
}

/** Jen písmena A–Z (velká, bez diakritiky). */
export function lettersOnly(s: string): string {
  return lettersAndSpaces(s).replace(/ /g, '')
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

/** Inverze a modulo n, nebo null (když gcd(a, n) ≠ 1). */
export function modInv(a: number, n: number): number | null {
  a = md(a, n)
  for (let x = 1; x < n; x++) if ((a * x) % n === 1) return x
  return n === 1 ? 0 : null
}

/** Nejmenší kladné číslo nesoudělné s n, které je ≥ a (pro nápovědu „zkus 5“). */
export function nearestCoprime(a: number, n: number): number {
  for (let d = 0; d < n; d++) {
    if (a + d < n && gcd(a + d, n) === 1) return a + d
    if (a - d > 0 && gcd(a - d, n) === 1) return a - d
  }
  return 1
}

/** Prvočíselné dělitele n (pro vysvětlení „sdílí dělitele 2“). */
export function primeFactors(n: number): number[] {
  const out: number[] = []
  let m = Math.abs(n)
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      out.push(p)
      while (m % p === 0) m /= p
    }
  }
  if (m > 1) out.push(m)
  return out
}

export function isPrime(n: number): boolean {
  if (n < 2 || !Number.isInteger(n)) return false
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false
  return true
}

/** Deterministický generátor (mulberry32) — příklad z předvolby vypadá pokaždé stejně. */
export function rng(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Nové náhodné semínko pro „Náhodně“. */
export const randomSeed = () => 1 + Math.floor(Math.random() * 2 ** 31)

/** Formát čísla po česku (desetinná čárka, mezery mezi tisíci). */
export const cz = (n: number, digits = 0) => n.toLocaleString('cs-CZ', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** Pravděpodobnost v procentech po česku; malé hodnoty s platnými číslicemi. */
export function pct(p: number): string {
  const v = p * 100
  if (v === 0) return '0 %'
  if (v >= 99.95 && v < 100) return '> 99,9 %'
  if (v < 0.1) return `${v.toPrecision(2).replace('.', ',')} %`
  return `${cz(v, 1)} %`
}

/**
 * Šířka kontejneru v px (ResizeObserver). Vlastní SVG grafy kreslíme v pixelech skutečné šířky,
 * aby písmo zůstalo čitelné i na 375 px (viewBox by ho zmenšil).
 */
export function useWidth<T extends HTMLElement>(fallback = 560) {
  const ref = useRef<T>(null)
  const [w, setW] = useState(fallback)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((e) => {
      const cw = Math.round(e[0]?.contentRect.width ?? 0)
      if (cw > 0) setW(cw)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

/** Česká plurálová forma: plural(1, 'blok', 'bloky', 'bloků') → „1 blok“. */
export function plural(n: number, one: string, few: string, many: string): string {
  const w = n === 1 ? one : n >= 2 && n <= 4 ? few : many
  return `${cz(n)} ${w}`
}

/** Celé číslo se skutečným znaménkem minus (−2 místo -2). */
export const signed = (n: number) => (n < 0 ? `−${-n}` : String(n))

/** Číslo horním indexem (exponent v textu): sup(8) → „⁸“. */
export const sup = (n: number) =>
  String(n)
    .split('')
    .map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)] ?? d)
    .join('')
