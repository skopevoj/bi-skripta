/** Spojí třídy, vynechá prázdné hodnoty. */
export const cx = (...a: Array<string | false | null | undefined | 0>) => a.filter(Boolean).join(' ')

/** Matematické modulo, vždy v intervalu 0 … n−1 (i pro záporné a). */
export const mod = (a: number, n: number) => ((a % n) + n) % n

/** Stav buňky / řádku / hodnoty. Barva je vždy doplněná tvarem nebo ikonou. */
export type Tone = 'active' | 'changed' | 'ok' | 'bad' | 'warn' | 'dim'

/** Typ výsledku pro `Verdict`, `StepNote` a pole formuláře. */
export type VerdictKind = 'ok' | 'bad' | 'warn' | 'info'
