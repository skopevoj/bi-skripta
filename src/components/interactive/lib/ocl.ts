// Tiny curated OCL evaluator for OclPlayground: a fixed object model + prepared expressions.
// Not a parser — each expression is a template with parameters and its own evaluation trace.

export type Driver = { id: string; name: string; age: number; firm: 'costy' | 'rychlik' }
export type Car = { id: string; plate: string; seats: number }
export type Ride = { id: string; driver: string; car: string; price: number; km: number }

export const DRIVERS: Driver[] = [
  { id: 'anna', name: 'Anna', age: 34, firm: 'costy' },
  { id: 'boris', name: 'Boris', age: 52, firm: 'costy' },
  { id: 'cyril', name: 'Cyril', age: 23, firm: 'costy' },
  { id: 'dana', name: 'Dana', age: 34, firm: 'costy' },
  { id: 'emil', name: 'Emil', age: 29, firm: 'rychlik' },
]
export const CARS: Car[] = [
  { id: 'c1', plate: '1AB 2345', seats: 4 },
  { id: 'c2', plate: '2CD 6789', seats: 7 },
  { id: 'c3', plate: '3EF 1122', seats: 4 },
]
export const RIDES: Ride[] = [
  { id: 'r1', driver: 'anna', car: 'c1', price: 250, km: 8 },
  { id: 'r2', driver: 'anna', car: 'c1', price: 480, km: 15 },
  { id: 'r3', driver: 'boris', car: 'c2', price: 1200, km: 40 },
  { id: 'r4', driver: 'boris', car: 'c2', price: 300, km: 9 },
  { id: 'r5', driver: 'cyril', car: 'c3', price: 150, km: 4 },
]

const selfDrivers = DRIVERS.filter((d) => d.firm === 'costy')
const ridesOf = (d: Driver) => RIDES.filter((r) => r.driver === d.id)
const dName = (id: string) => DRIVERS.find((d) => d.id === id)!.name

export type Mark = 'in' | 'hit' | 'miss' | 'dec'
export type Item = { label: string; cls?: 'y' | 'n' | 'skip'; dec?: boolean }
export type Step = { code: string; note?: string; items?: Item[]; value?: string }
export type Out = { steps: Step[]; value: string; type: string; marks: Record<string, Mark> }

export type Param =
  | { key: string; kind: 'num'; label: string; min: number; max: number; step: number; def: number }
  | { key: string; kind: 'choice'; label: string; opts: { v: string; label: string }[]; def: string }
export type Params = Record<string, number | string>

export type Expr = {
  id: string
  title: string
  op: string // short tag shown in the list
  ctx: string
  code: (p: Params) => string
  params?: Param[]
  run: (p: Params) => Out
  tip?: string
}

const set = (xs: string[]) => `Set{${xs.join(', ')}}`
const bag = (xs: (string | number)[]) => `Bag{${xs.join(', ')}}`
const mk = (ids: string[], m: Mark, base: Record<string, Mark> = {}) => ({ ...base, ...Object.fromEntries(ids.map((i) => [i, m])) })
const n = (p: Params, k = 'n') => Number(p[k])

/** select / reject / forAll / exists over objects with per-item trace */
function iterate<T extends { id: string }>(
  op: 'select' | 'reject' | 'forAll' | 'exists',
  src: T[],
  label: (o: T) => string,
  pred: (o: T) => [boolean, string],
) {
  const items: Item[] = []
  const kept: T[] = []
  let decided: T | null = null
  for (const o of src) {
    if (decided) {
      items.push({ label: `${label(o)} —`, cls: 'skip' })
      continue
    }
    const [v, why] = pred(o)
    items.push({ label: `${label(o)}: ${why} ${v ? '✓' : '✗'}`, cls: v ? 'y' : 'n' })
    if ((op === 'select' && v) || (op === 'reject' && !v)) kept.push(o)
    if ((op === 'forAll' && !v) || (op === 'exists' && v)) {
      decided = o
      items[items.length - 1].dec = true
    }
  }
  return { items, kept, decided }
}

const srcStep = (code: string, labels: string[]): Step => ({ code, value: set(labels) })

export const EXPRS: Expr[] = [
  {
    id: 'select',
    op: 'select',
    title: 'Řidiči starší než N',
    ctx: 'TaxiCompany',
    code: (p) => `self.drivers->select(d | d.age > ${p.n})`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 18, max: 60, step: 1, def: 30 }],
    run: (p) => {
      const r = iterate(
        'select',
        selfDrivers,
        (d) => d.name,
        (d) => [d.age > n(p), `${d.age} > ${p.n}`],
      )
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((d) => d.name),
          ),
          { code: `->select(d | d.age > ${p.n})`, items: r.items },
        ],
        value: set(r.kept.map((d) => d.name)),
        type: 'Set(Driver)',
        marks: mk(
          r.kept.map((d) => d.id),
          'hit',
          mk(
            selfDrivers.map((d) => d.id),
            'miss',
          ),
        ),
      }
    },
  },
  {
    id: 'reject',
    op: 'reject',
    title: 'Řidiči, kteří už jeli',
    ctx: 'TaxiCompany',
    code: () => `self.drivers->reject(d | d.rides->isEmpty())`,
    tip: 'reject = select s negovanou podmínkou: vyhodí prvky, pro které podmínka platí.',
    run: () => {
      const r = iterate(
        'reject',
        selfDrivers,
        (d) => d.name,
        (d) => [ridesOf(d).length === 0, `isEmpty() = ${ridesOf(d).length === 0}`],
      )
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((d) => d.name),
          ),
          { code: '->reject(d | d.rides->isEmpty())', note: 'Vyhodí ty, kde podmínka platí (✓).', items: r.items },
        ],
        value: set(r.kept.map((d) => d.name)),
        type: 'Set(Driver)',
        marks: mk(
          r.kept.map((d) => d.id),
          'hit',
          mk(
            selfDrivers.map((d) => d.id),
            'miss',
          ),
        ),
      }
    },
  },
  {
    id: 'collect',
    op: 'collect',
    title: 'Věky řidičů',
    ctx: 'TaxiCompany',
    code: (p) => (p.form === 'dot' ? 'self.drivers.age' : 'self.drivers->collect(d | d.age)'),
    params: [
      {
        key: 'form',
        kind: 'choice',
        label: 'Zápis',
        opts: [
          { v: 'arrow', label: '->collect' },
          { v: 'dot', label: 'tečka' },
        ],
        def: 'arrow',
      },
    ],
    tip: 'Tečka za kolekcí je zkratka za collect. collect nad Set vrací Bag — hodnoty se mohou opakovat (34 je tam dvakrát).',
    run: () => ({
      steps: [
        srcStep(
          'self.drivers',
          selfDrivers.map((d) => d.name),
        ),
        { code: 'collect: d ↦ d.age', items: selfDrivers.map((d) => ({ label: `${d.name} ↦ ${d.age}` })) },
      ],
      value: bag(selfDrivers.map((d) => d.age)),
      type: 'Bag(Integer)',
      marks: mk(
        selfDrivers.map((d) => d.id),
        'hit',
      ),
    }),
  },
  {
    id: 'flatten',
    op: '. zploštění',
    title: 'Všechny jízdy řidičů firmy',
    ctx: 'TaxiCompany',
    code: () => 'self.drivers.rides',
    tip: 'Navigace přes kolekci vytvoří kolekci kolekcí — OCL ji automaticky zploští (flatten).',
    run: () => ({
      steps: [
        srcStep(
          'self.drivers',
          selfDrivers.map((d) => d.name),
        ),
        {
          code: '.rides  (pro každého řidiče)',
          items: selfDrivers.map((d) => ({
            label: `${d.name} ↦ {${ridesOf(d)
              .map((r) => r.id)
              .join(', ')}}`,
          })),
        },
        { code: 'zploštění', note: 'Kolekce kolekcí jízd → jedna kolekce jízd.' },
      ],
      value: `{${RIDES.map((r) => r.id).join(', ')}}`,
      type: 'kolekce Ride (zploštěná)',
      marks: mk(
        RIDES.map((r) => r.id),
        'hit',
        mk(
          selfDrivers.map((d) => d.id),
          'in',
        ),
      ),
    }),
  },
  {
    id: 'sum',
    op: 'sum',
    title: 'Tržby všech jízd',
    ctx: 'TaxiCompany',
    code: () => 'self.drivers.rides.price->sum()',
    run: () => ({
      steps: [
        { code: 'self.drivers.rides', value: `{${RIDES.map((r) => r.id).join(', ')}}` },
        { code: '.price', value: bag(RIDES.map((r) => r.price)) },
        { code: '->sum()', note: RIDES.map((r) => r.price).join(' + ') },
      ],
      value: String(RIDES.reduce((a, r) => a + r.price, 0)),
      type: 'Integer',
      marks: mk(
        RIDES.map((r) => r.id),
        'hit',
      ),
    }),
  },
  {
    id: 'forAll',
    op: 'forAll',
    title: 'Jsou všichni řidiči aspoň N let?',
    ctx: 'TaxiCompany',
    code: (p) => `self.drivers->forAll(d | d.age >= ${p.n})`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 18, max: 60, step: 1, def: 25 }],
    tip: 'forAll rozhodne první prvek, který podmínku nesplní (protipříklad).',
    run: (p) => {
      const r = iterate(
        'forAll',
        selfDrivers,
        (d) => d.name,
        (d) => [d.age >= n(p), `${d.age} >= ${p.n}`],
      )
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((d) => d.name),
          ),
          { code: `->forAll(d | d.age >= ${p.n})`, items: r.items, note: r.decided ? `Protipříklad: ${r.decided.name}.` : 'Všichni podmínku splňují.' },
        ],
        value: String(!r.decided),
        type: 'Boolean',
        marks: r.decided
          ? mk(
              [r.decided.id],
              'dec',
              mk(
                selfDrivers.map((d) => d.id),
                'in',
              ),
            )
          : mk(
              selfDrivers.map((d) => d.id),
              'hit',
            ),
      }
    },
  },
  {
    id: 'exists',
    op: 'exists',
    title: 'Je jízda dražší než N?',
    ctx: 'TaxiCompany',
    code: (p) => `self.rides->exists(r | r.price > ${p.n})`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 0, max: 1500, step: 50, def: 1000 }],
    tip: 'exists rozhodne první prvek, který podmínku splní (svědek).',
    run: (p) => {
      const r = iterate(
        'exists',
        RIDES,
        (x) => x.id,
        (x) => [x.price > n(p), `${x.price} > ${p.n}`],
      )
      return {
        steps: [
          { code: 'self.rides', value: set(RIDES.map((x) => x.id)) },
          { code: `->exists(r | r.price > ${p.n})`, items: r.items, note: r.decided ? `Svědek: ${r.decided.id}.` : 'Žádná jízda podmínku nesplňuje.' },
        ],
        value: String(!!r.decided),
        type: 'Boolean',
        marks: r.decided
          ? mk(
              [r.decided.id],
              'dec',
              mk(
                RIDES.map((x) => x.id),
                'in',
              ),
            )
          : mk(
              RIDES.map((x) => x.id),
              'miss',
            ),
      }
    },
  },
  {
    id: 'size',
    op: 'size',
    title: 'Počet jízd delších než N km',
    ctx: 'TaxiCompany',
    code: (p) => `self.rides->select(r | r.km > ${p.n})->size()`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 0, max: 45, step: 1, def: 10 }],
    run: (p) => {
      const r = iterate(
        'select',
        RIDES,
        (x) => x.id,
        (x) => [x.km > n(p), `${x.km} > ${p.n}`],
      )
      return {
        steps: [
          { code: 'self.rides', value: set(RIDES.map((x) => x.id)) },
          { code: `->select(r | r.km > ${p.n})`, items: r.items, value: set(r.kept.map((x) => x.id)) },
          { code: '->size()' },
        ],
        value: String(r.kept.length),
        type: 'Integer',
        marks: mk(
          r.kept.map((x) => x.id),
          'hit',
          mk(
            RIDES.map((x) => x.id),
            'miss',
          ),
        ),
      }
    },
  },
  {
    id: 'isEmpty',
    op: 'isEmpty',
    title: 'Žádný řidič mladší než N?',
    ctx: 'TaxiCompany',
    code: (p) => `self.drivers->select(d | d.age < ${p.n})->isEmpty()`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 18, max: 60, step: 1, def: 21 }],
    run: (p) => {
      const r = iterate(
        'select',
        selfDrivers,
        (d) => d.name,
        (d) => [d.age < n(p), `${d.age} < ${p.n}`],
      )
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((d) => d.name),
          ),
          { code: `->select(d | d.age < ${p.n})`, items: r.items, value: set(r.kept.map((d) => d.name)) },
          { code: '->isEmpty()' },
        ],
        value: String(r.kept.length === 0),
        type: 'Boolean',
        marks: mk(
          r.kept.map((d) => d.id),
          'dec',
          mk(
            selfDrivers.map((d) => d.id),
            'in',
          ),
        ),
      }
    },
  },
  {
    id: 'includes',
    op: 'includes',
    title: 'Je X řidičem firmy?',
    ctx: 'TaxiCompany',
    code: (p) => `self.drivers->includes(${p.x})`,
    params: [{ key: 'x', kind: 'choice', label: 'X', opts: DRIVERS.map((d) => ({ v: d.name.toLowerCase(), label: d.name })), def: 'emil' }],
    run: (p) => {
      const d = DRIVERS.find((x) => x.id === p.x)!
      const yes = d.firm === 'costy'
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((x) => x.name),
          ),
          { code: `->includes(${p.x})`, note: yes ? `${d.name} v množině je.` : `${d.name} jezdí pro jinou firmu — v self.drivers není.` },
        ],
        value: String(yes),
        type: 'Boolean',
        marks: mk(
          [d.id],
          yes ? 'hit' : 'dec',
          mk(
            selfDrivers.map((x) => x.id),
            'in',
          ),
        ),
      }
    },
  },
  {
    id: 'allInstances',
    op: 'allInstances',
    title: 'Řidiči bez jízd: všichni vs. jen naši',
    ctx: 'TaxiCompany',
    code: (p) => `${p.src === 'all' ? 'Driver.allInstances()' : 'self.drivers'}->select(d | d.rides->isEmpty())`,
    params: [
      {
        key: 'src',
        kind: 'choice',
        label: 'Zdroj',
        opts: [
          { v: 'all', label: 'Driver.allInstances()' },
          { v: 'self', label: 'self.drivers' },
        ],
        def: 'all',
      },
    ],
    tip: 'allInstances() vrátí všechny existující instance třídy — i ty, které se k self nijak neváží.',
    run: (p) => {
      const src = p.src === 'all' ? DRIVERS : selfDrivers
      const r = iterate(
        'select',
        src,
        (d) => d.name,
        (d) => [ridesOf(d).length === 0, `isEmpty() = ${ridesOf(d).length === 0}`],
      )
      return {
        steps: [
          srcStep(
            p.src === 'all' ? 'Driver.allInstances()' : 'self.drivers',
            src.map((d) => d.name),
          ),
          { code: '->select(d | d.rides->isEmpty())', items: r.items },
        ],
        value: set(r.kept.map((d) => d.name)),
        type: 'Set(Driver)',
        marks: mk(
          r.kept.map((d) => d.id),
          'hit',
          mk(
            src.map((d) => d.id),
            'miss',
          ),
        ),
      }
    },
  },
  {
    id: 'nested',
    op: 'select + exists',
    title: 'Řidiči s jízdou dražší než N',
    ctx: 'TaxiCompany',
    code: (p) => `self.drivers->select(d |\n  d.rides->exists(r | r.price > ${p.n}))`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 0, max: 1500, step: 50, def: 400 }],
    run: (p) => {
      const r = iterate(
        'select',
        selfDrivers,
        (d) => d.name,
        (d) => {
          const w = ridesOf(d).find((x) => x.price > n(p))
          return [!!w, w ? `svědek ${w.id} (${w.price})` : ridesOf(d).length ? 'žádná' : 'nemá jízdy']
        },
      )
      return {
        steps: [
          srcStep(
            'self.drivers',
            selfDrivers.map((d) => d.name),
          ),
          { code: `->select(d | d.rides->exists(r | r.price > ${p.n}))`, items: r.items },
        ],
        value: set(r.kept.map((d) => d.name)),
        type: 'Set(Driver)',
        marks: mk(
          r.kept.map((d) => d.id),
          'hit',
          mk(
            selfDrivers.map((d) => d.id),
            'miss',
          ),
        ),
      }
    },
  },
  {
    id: 'inv',
    op: 'inv',
    title: 'Invariant: cena jízdy větší než N',
    ctx: 'Ride',
    code: (p) => `inv minPrice: self.price > ${p.n}`,
    params: [{ key: 'n', kind: 'num', label: 'N', min: 0, max: 600, step: 50, def: 0 }],
    tip: 'Invariant se vyhodnocuje pro každou instanci kontextu (self = jednotlivá jízda). Model je platný, jen když platí pro všechny.',
    run: (p) => {
      const bad = RIDES.filter((r) => !(r.price > n(p)))
      return {
        steps: [
          {
            code: 'pro každou jízdu (self : Ride)',
            items: RIDES.map((r) => ({ label: `${r.id}: ${r.price} > ${p.n} ${r.price > n(p) ? '✓' : '✗'}`, cls: r.price > n(p) ? 'y' : 'n' })),
          },
        ],
        value: bad.length ? `porušen (${bad.map((r) => r.id).join(', ')})` : 'splněn',
        type: 'invariant',
        marks: mk(
          bad.map((r) => r.id),
          'dec',
          mk(
            RIDES.map((r) => r.id),
            'hit',
          ),
        ),
      }
    },
  },
]

export { dName, ridesOf }
