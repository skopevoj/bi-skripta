// Symetrická kryptografie pro widgety skupiny C (módy, AES, SHA-1/256, Salsa20/ChaCha).
// Čistý TypeScript bez Reactu. Správnost ověřena proti testovacím vektorům
// (FIPS-197 App. B a C.1, FIPS 180 „abc“, RFC 8439 §2.1.1, Salsa20 spec §3).

/* ================================================================== */
/* Obecné                                                              */
/* ================================================================== */

export const hex2 = (b: number) => (b & 0xff).toString(16).padStart(2, '0')
export const hex8 = (w: number) => (w >>> 0).toString(16).padStart(8, '0')
export const bytesToHex = (b: ArrayLike<number>) => Array.from(b, hex2).join('')

/** Hex řetězec → bajty; `null`, když to není sudý počet hex znaků. */
export function hexToBytes(s: string): number[] | null {
  const t = s.replace(/\s+/g, '').toLowerCase()
  if (t.length % 2 || /[^0-9a-f]/.test(t)) return null
  const out: number[] = []
  for (let i = 0; i < t.length; i += 2) out.push(parseInt(t.slice(i, i + 2), 16))
  return out
}

export const popcount = (x: number) => {
  let n = 0
  let v = x >>> 0
  while (v) {
    v &= v - 1
    n++
  }
  return n
}

/** Bity bajtů jako řetězec „0110…“ (MSB první). */
export const bytesToBits = (b: ArrayLike<number>) => Array.from(b, (x) => (x & 0xff).toString(2).padStart(8, '0')).join('')

export const hamming = (a: ArrayLike<number>, b: ArrayLike<number>) => {
  let n = 0
  for (let i = 0; i < Math.min(a.length, b.length); i++) n += popcount((a[i]! ^ b[i]!) & 0xff)
  return n
}

export const utf8 = (s: string) => Array.from(new TextEncoder().encode(s))

/* ================================================================== */
/* Hračková 4bitová bloková šifra pro operační módy                    */
/* ================================================================== */

/** S-box šifry PRESENT (4 → 4 b). Změna 1 vstupního bitu vždy změní aspoň 2 výstupní bity. */
export const TOY_SBOX = [0xc, 0x5, 0x6, 0xb, 0x9, 0x0, 0xa, 0xd, 0x3, 0xe, 0xf, 0x8, 0x4, 0x7, 0x1, 0x2] as const
const TOY_INV = (() => {
  const inv = new Array<number>(16)
  TOY_SBOX.forEach((v, i) => (inv[v] = i))
  return inv
})()

/** E_K(x) = S(x ⊕ K) — 4bitová „bloková šifra“ (permutace bloků pro každý klíč). */
export const toyE = (x: number, k: number) => TOY_SBOX[(x ^ k) & 15]!
/** D_K(y) = S⁻¹(y) ⊕ K — inverze toyE. */
export const toyD = (y: number, k: number) => (TOY_INV[y & 15]! ^ k) & 15

export const bin4 = (x: number) => (x & 15).toString(2).padStart(4, '0')

export type Mode = 'ecb' | 'cbc' | 'cfb' | 'ofb' | 'ctr'

/**
 * Jeden blok zpracovaný v módu. Názvy jako v přednášce:
 * `chain` = hodnota z předchozího bloku (ŠT_{i−1}, H_{i−1}, u bloku 1 IV), `ein` = vstup E_K / D_K,
 * `eout` = výstup E_K / D_K (u CFB/OFB/CTR heslo H_i), `ctr` = čítač CTR_i.
 */
export type ModeBlock = { i: number; ot: number; st: number; chain?: number; ein: number; eout: number; ctr?: number }

/** Šifrování: OT bloky → průběh (ŠT_0 = IV). */
export function modeEncrypt(mode: Mode, ot: readonly number[], k: number, iv: number): ModeBlock[] {
  const out: ModeBlock[] = []
  let prev = iv // ŠT_{i−1} (CBC, CFB) nebo H_{i−1} (OFB)
  ot.forEach((p, idx) => {
    const i = idx + 1
    if (mode === 'ecb') {
      const c = toyE(p, k)
      out.push({ i, ot: p, st: c, ein: p, eout: c })
    } else if (mode === 'cbc') {
      const x = p ^ prev
      const c = toyE(x, k)
      out.push({ i, ot: p, st: c, chain: prev, ein: x, eout: c })
      prev = c
    } else if (mode === 'cfb') {
      const h = toyE(prev, k)
      const c = p ^ h
      out.push({ i, ot: p, st: c, chain: prev, ein: prev, eout: h })
      prev = c
    } else if (mode === 'ofb') {
      const h = toyE(prev, k)
      out.push({ i, ot: p, st: p ^ h, chain: prev, ein: prev, eout: h })
      prev = h
    } else {
      const ctr = (iv + i - 1) & 15 // CTR_i = |IV + i − 1|_{2^B}, B = 4
      const h = toyE(ctr, k)
      out.push({ i, ot: p, st: p ^ h, ein: ctr, eout: h, ctr })
    }
  })
  return out
}

/** Dešifrování přijatých bloků ŠT (mohou obsahovat chybu) → průběh s `ot` = výsledný OT. */
export function modeDecrypt(mode: Mode, st: readonly number[], k: number, iv: number): ModeBlock[] {
  const out: ModeBlock[] = []
  let prev = iv
  st.forEach((c, idx) => {
    const i = idx + 1
    if (mode === 'ecb') {
      const p = toyD(c, k)
      out.push({ i, ot: p, st: c, ein: c, eout: p })
    } else if (mode === 'cbc') {
      const y = toyD(c, k)
      out.push({ i, ot: y ^ prev, st: c, chain: prev, ein: c, eout: y })
      prev = c
    } else if (mode === 'cfb') {
      const h = toyE(prev, k) // i při dešifrování se používá E_K
      out.push({ i, ot: c ^ h, st: c, chain: prev, ein: prev, eout: h })
      prev = c
    } else if (mode === 'ofb') {
      const h = toyE(prev, k)
      out.push({ i, ot: c ^ h, st: c, chain: prev, ein: prev, eout: h })
      prev = h
    } else {
      const ctr = (iv + i - 1) & 15
      const h = toyE(ctr, k)
      out.push({ i, ot: c ^ h, st: c, ein: ctr, eout: h, ctr })
    }
  })
  return out
}

/* ================================================================== */
/* AES-128                                                             */
/* ================================================================== */

/** Násobení v GF(2^8) s m(x) = x^8 + x^4 + x^3 + x + 1. */
export function gmul(a: number, b: number): number {
  let x = a & 0xff
  let y = b & 0xff
  let r = 0
  while (y) {
    if (y & 1) r ^= x
    x = (x << 1) ^ (x & 0x80 ? 0x11b : 0)
    y >>= 1
  }
  return r & 0xff
}

export const AES_SBOX: readonly number[] = (() => {
  const rotl8 = (x: number, n: number) => ((x << n) | (x >> (8 - n))) & 0xff
  const s: number[] = []
  for (let x = 0; x < 256; x++) {
    let inv = 0
    if (x) for (let y = 1; y < 256; y++) if (gmul(x, y) === 1) inv = y
    s.push((inv ^ rotl8(inv, 1) ^ rotl8(inv, 2) ^ rotl8(inv, 3) ^ rotl8(inv, 4) ^ 0x63) & 0xff)
  }
  return s
})()

/** Stav = 16 bajtů po sloupcích (index = 4·sloupec + řádek), jako ve FIPS-197. */
export type AesState = number[]

export const subBytes = (s: AesState) => s.map((b) => AES_SBOX[b]!)
/** Řádek r se posune cyklicky o r doleva: s'[r, c] = s[r, (c + r) mod 4]. */
export const shiftRows = (s: AesState) => s.map((_, i) => s[4 * (((i >> 2) + (i & 3)) & 3) + (i & 3)]!)
export const MIX = [
  [2, 3, 1, 1],
  [1, 2, 3, 1],
  [1, 1, 2, 3],
  [3, 1, 1, 2],
] as const
export const mixColumns = (s: AesState) =>
  s.map((_, i) => {
    const c = i >> 2
    const r = i & 3
    return MIX[r]!.reduce((acc, m, j) => acc ^ gmul(m, s[4 * c + j]!), 0)
  })
export const addRoundKey = (s: AesState, k: readonly number[]) => s.map((b, i) => b ^ k[i]!)

const RCON = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]

/** Expanze 128bitového klíče → 11 rundovních klíčů po 16 bajtech. */
export function aesRoundKeys(key: readonly number[]): number[][] {
  const w: number[][] = []
  for (let i = 0; i < 4; i++) w.push(key.slice(4 * i, 4 * i + 4) as number[])
  for (let i = 4; i < 44; i++) {
    let t = w[i - 1]!.slice()
    if (i % 4 === 0) {
      t = [t[1]!, t[2]!, t[3]!, t[0]!].map((b) => AES_SBOX[b]!)
      t[0]! ^= RCON[i / 4 - 1]!
    }
    w.push(w[i - 4]!.map((b, j) => b ^ t[j]!))
  }
  return Array.from({ length: 11 }, (_, r) => w.slice(4 * r, 4 * r + 4).flat())
}

export type AesOp = 'input' | 'sub' | 'shift' | 'mix' | 'ark'
export type AesStep = { round: number; op: AesOp; before: AesState; after: AesState }

/** Celý průběh AES-128: vstup, AddRoundKey(0), rundy 1–9 (4 operace), runda 10 bez MixColumns. */
export function aesTrace(input: readonly number[], key: readonly number[]): { steps: AesStep[]; roundKeys: number[][] } {
  const rk = aesRoundKeys(key)
  const steps: AesStep[] = []
  let s = input.slice()
  steps.push({ round: 0, op: 'input', before: s, after: s })
  const push = (round: number, op: AesOp, f: (x: AesState) => AesState) => {
    const n = f(s)
    steps.push({ round, op, before: s, after: n })
    s = n
  }
  push(0, 'ark', (x) => addRoundKey(x, rk[0]!))
  for (let r = 1; r <= 10; r++) {
    push(r, 'sub', subBytes)
    push(r, 'shift', shiftRows)
    if (r < 10) push(r, 'mix', mixColumns)
    push(r, 'ark', (x) => addRoundKey(x, rk[r]!))
  }
  return { steps, roundKeys: rk }
}

export function aesEncryptBlock(input: readonly number[], rk: readonly (readonly number[])[]): number[] {
  let s = addRoundKey(input.slice(), rk[0]!)
  for (let r = 1; r <= 10; r++) {
    s = shiftRows(subBytes(s))
    if (r < 10) s = mixColumns(s)
    s = addRoundKey(s, rk[r]!)
  }
  return s
}

/* ================================================================== */
/* SHA-1                                                               */
/* ================================================================== */

const rotl = (x: number, n: number) => ((x << n) | (x >>> (32 - n))) >>> 0
const rotr = (x: number, n: number) => ((x >>> n) | (x << (32 - n))) >>> 0
const add = (...xs: number[]) => xs.reduce((a, b) => (a + b) >>> 0, 0)

export { rotl as rotl32, rotr as rotr32, add as add32 }

/** Damgård–Merklovo zarovnání: bit 1, nuly, 64 b délky → násobek 512 b. */
export function mdPad(msg: readonly number[]): number[] {
  const bitLen = msg.length * 8
  const out = msg.slice() as number[]
  out.push(0x80)
  while (out.length % 64 !== 56) out.push(0)
  const hi = Math.floor(bitLen / 2 ** 32)
  for (const w of [hi, bitLen >>> 0]) out.push((w >>> 24) & 255, (w >>> 16) & 255, (w >>> 8) & 255, w & 255)
  return out
}

export const SHA1_IV = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0] as const
export const SHA1_K = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6] as const

export const sha1F = (t: number, b: number, c: number, d: number) =>
  t < 20 ? ((b & c) | (~b & d)) >>> 0 : t < 40 || t >= 60 ? (b ^ c ^ d) >>> 0 : ((b & c) | (b & d) | (c & d)) >>> 0

export type Sha1Round = { t: number; w: number; f: number; k: number; before: number[]; after: number[] }

/** Jeden blok (16 slov) → expanze W_0…W_79 a 80 rund. */
export function sha1Block(words: readonly number[], h: readonly number[]) {
  const w: number[] = words.slice(0, 16) as number[]
  for (let t = 16; t < 80; t++) w.push(rotl(w[t - 3]! ^ w[t - 8]! ^ w[t - 14]! ^ w[t - 16]!, 1))
  let [a, b, c, d, e] = h as [number, number, number, number, number]
  const rounds: Sha1Round[] = []
  for (let t = 0; t < 80; t++) {
    const f = sha1F(t, b, c, d)
    const k = SHA1_K[Math.floor(t / 20)]!
    const before = [a, b, c, d, e]
    const tmp = add(rotl(a, 5), f, e, w[t]!, k)
    e = d
    d = c
    c = rotl(b, 30)
    b = a
    a = tmp
    rounds.push({ t, w: w[t]!, f, k, before, after: [a, b, c, d, e] })
  }
  const out = [a, b, c, d, e].map((x, i) => add(x, h[i]!))
  return { w, rounds, out }
}

export const wordsOf = (bytes: readonly number[], off = 0, n = 16) =>
  Array.from({ length: n }, (_, i) => ((bytes[off + 4 * i]! << 24) | (bytes[off + 4 * i + 1]! << 16) | (bytes[off + 4 * i + 2]! << 8) | bytes[off + 4 * i + 3]!) >>> 0)

const wordsToBytes = (ws: readonly number[]) => ws.flatMap((w) => [(w >>> 24) & 255, (w >>> 16) & 255, (w >>> 8) & 255, w & 255])

export function sha1(msg: readonly number[]): number[] {
  const p = mdPad(msg)
  let h: number[] = SHA1_IV.slice()
  for (let off = 0; off < p.length; off += 64) h = sha1Block(wordsOf(p, off), h).out
  return wordsToBytes(h)
}

/* ================================================================== */
/* SHA-256                                                             */
/* ================================================================== */

const K256 = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]

export function sha256(msg: readonly number[]): number[] {
  const p = mdPad(msg)
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]
  for (let off = 0; off < p.length; off += 64) {
    const w = wordsOf(p, off)
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15]!, 7) ^ rotr(w[t - 15]!, 18) ^ (w[t - 15]! >>> 3)
      const s1 = rotr(w[t - 2]!, 17) ^ rotr(w[t - 2]!, 19) ^ (w[t - 2]! >>> 10)
      w.push(add(w[t - 16]!, s0 >>> 0, w[t - 7]!, s1 >>> 0))
    }
    let [a, b, c, d, e, f, g, hh] = h as [number, number, number, number, number, number, number, number]
    for (let t = 0; t < 64; t++) {
      const S1 = (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) >>> 0
      const ch = ((e & f) ^ (~e & g)) >>> 0
      const t1 = add(hh, S1, ch, K256[t]!, w[t]!)
      const S0 = (rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) >>> 0
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0
      const t2 = add(S0, maj)
      hh = g
      g = f
      f = e
      e = add(d, t1)
      d = c
      c = b
      b = a
      a = add(t1, t2)
    }
    ;[a, b, c, d, e, f, g, hh].forEach((x, i) => (h[i] = add(h[i]!, x)))
  }
  return wordsToBytes(h)
}

/* ================================================================== */
/* Salsa20 a ChaCha — quarter-round po krocích                         */
/* ================================================================== */

export type QrWord = 'a' | 'b' | 'c' | 'd'
/** Jeden řádek quarter-roundu: které slovo se mění, z čeho (operandy) a s jakou rotací. */
export type QrStep = {
  /** Slova po kroku [a, b, c, d]. */
  words: number[]
  /** Změněná slova v tomto kroku. */
  changed: QrWord[]
  /** Mezivýsledky pro vzorec s dosazením. */
  parts: { target: QrWord; sum?: number; x?: number; y?: number; rot: number; before: number; after: number; srcA: QrWord; srcB: QrWord }[]
}

const IDX: Record<QrWord, number> = { a: 0, b: 1, c: 2, d: 3 }

/** Salsa20: b ^= (a+d)<<<7; c ^= (b+a)<<<9; d ^= (c+b)<<<13; a ^= (d+c)<<<18. */
export function salsaQR(input: readonly number[]): QrStep[] {
  const v = input.map((x) => x >>> 0)
  const steps: QrStep[] = []
  const plan: [QrWord, QrWord, QrWord, number][] = [
    ['b', 'a', 'd', 7],
    ['c', 'b', 'a', 9],
    ['d', 'c', 'b', 13],
    ['a', 'd', 'c', 18],
  ]
  for (const [t, p, q, r] of plan) {
    const before = v[IDX[t]]!
    const sum = add(v[IDX[p]]!, v[IDX[q]]!)
    const after = (before ^ rotl(sum, r)) >>> 0
    v[IDX[t]] = after
    steps.push({ words: v.slice(), changed: [t], parts: [{ target: t, sum, rot: r, before, after, srcA: p, srcB: q }] })
  }
  return steps
}

/** ChaCha: a += b; d ^= a; d <<<= 16 · c += d; b ^= c; b <<<= 12 · a += b; d ^= a; d <<<= 8 · c += d; b ^= c; b <<<= 7. */
export function chachaQR(input: readonly number[]): QrStep[] {
  const v = input.map((x) => x >>> 0)
  const steps: QrStep[] = []
  const plan: [QrWord, QrWord, QrWord, number][] = [
    ['a', 'b', 'd', 16],
    ['c', 'd', 'b', 12],
    ['a', 'b', 'd', 8],
    ['c', 'd', 'b', 7],
  ]
  for (const [s, p, x, r] of plan) {
    // s := s + p; x := (x ⊕ s) <<< r
    const sBefore = v[IDX[s]]!
    const sAfter = add(sBefore, v[IDX[p]]!)
    v[IDX[s]] = sAfter
    const xBefore = v[IDX[x]]!
    const xAfter = rotl((xBefore ^ sAfter) >>> 0, r)
    v[IDX[x]] = xAfter
    steps.push({
      words: v.slice(),
      changed: [s, x],
      parts: [
        { target: s, rot: 0, before: sBefore, after: sAfter, srcA: s, srcB: p },
        { target: x, x: (xBefore ^ sAfter) >>> 0, rot: r, before: xBefore, after: xAfter, srcA: x, srcB: s },
      ],
    })
  }
  return steps
}
