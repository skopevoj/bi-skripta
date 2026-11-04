// Override rules for `class X { def f(b: B): B }` and `class Y extends X { [override] def f(b: P): R = ??? }`
// with hierarchy Any ⊃ A ⊃ B ⊃ C ⊃ Nothing (Scala 3).
// - Same parameter type B → it is the same signature: needs `override` (X.f is concrete) and the
//   return type must conform to B (B, C, Nothing).
// - Different parameter type → a new overload: fine without `override`, CE "overrides nothing" with it.

export const PARAMS = ['Any', 'A', 'B', 'C'] as const
export const RETS = ['Any', 'A', 'B', 'C', 'Nothing'] as const
export type P = (typeof PARAMS)[number]
export type R = (typeof RETS)[number]

const RANK: Record<string, number> = { Any: 0, A: 1, B: 2, C: 3, Nothing: 4 }
export const conforms = (sub: string, sup: string) => RANK[sub] >= RANK[sup]

export type Verdict = {
  ok: boolean
  kind: 'override' | 'overload' | 'ce'
  msg: string // short compiler-ish message (CE) or what it is
  why: string // one-line Czech reason (html)
  viaX?: 'X.f' | 'Y.f' // val x: X = Y(); x.f(B())
  viaY?: 'X.f' | 'Y.f' | 'ambig' // val y: Y = Y(); y.f(B())
}

export function verdict(p: P, r: R, hasOverride: boolean): Verdict {
  if (p === 'B') {
    const retOk = conforms(r, 'B')
    if (!hasOverride)
      return {
        ok: false,
        kind: 'ce',
        msg: 'error overriding method f in class X of type (b: B): B; method f of type (b: B): ' + r + ' needs `override` modifier',
        why:
          'Signatura je stejná jako v <code>X</code>, takže metodu přepisuješ — u konkrétní metody je ve Scale <code>override</code> povinné.' + (conforms(r, 'B') ? '' : ` I s <code>override</code> by to neprošlo: <code>${r}</code> není podtyp <code>B</code>.`),
      }
    if (!retOk)
      return {
        ok: false,
        kind: 'ce',
        msg: `error overriding method f in class X of type (b: B): B; method f of type (b: B): ${r} has incompatible type`,
        why: `Stejný parametr = stejná signatura → je to override, a návratový typ smí být jen <code>B</code> nebo jeho podtyp. <code>${r}</code> je nadtyp <code>B</code>.`,
      }
    return {
      ok: true,
      kind: 'override',
      msg: 'override',
      why:
        r === 'B'
          ? 'Parametr i návrat stejné → klasický override.'
          : `Parametr stejný, návrat <code>${r}</code> je podtyp <code>B</code> (kovariantní návratový typ) → override.`,
      viaX: 'Y.f',
      viaY: 'Y.f',
    }
  }
  if (hasOverride)
    return {
      ok: false,
      kind: 'ce',
      msg: 'method f has a different signature than the overridden declaration',
      why: `Parametr <code>${p}</code> ≠ <code>B</code> → jiná signatura, takže <code>override</code> nemá co přepsat. Scala nedovolí ani obecnější (kontravariantní) parametr.`,
    }
  return {
    ok: true,
    kind: 'overload',
    msg: 'overload',
    why: `Parametr <code>${p}</code> ≠ <code>B</code> → vznikl nový <strong>overload</strong>, <code>X.f(b: B)</code> zůstává nepřepsaná. Návratový typ tu nehraje roli.`,
    viaX: 'X.f',
    // Y sees f(b: B) from X and its own f(b: p). For p = C only f(B) applies. For p = A/Any both
    // apply: f(B) wins on the parameter, f(p) wins for being defined in the subclass → tie → CE.
    viaY: p === 'C' ? 'X.f' : 'ambig',
  }
}
