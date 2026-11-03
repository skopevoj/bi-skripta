// Data for the stereotype decision tree (StereotypeTree.tsx). Agrees with P02–P04 slides.
import type { ClassSt, Diagram } from '@content/types'

export type ResultSt = Extract<
  ClassSt,
  'kind' | 'subkind' | 'role' | 'phase' | 'collective' | 'quantity' | 'relator' | 'category' | 'mixin' | 'roleMixin' | 'phaseMixin' | 'mode' | 'quality'
>

export type TreeOpt = { label: string; short: string; next: string } // next = node id or "=st"
export type TreeNode = { id: string; q: string; short: string; help?: string; opts: TreeOpt[] }

export const TREE: Record<string, TreeNode> = {
  dep: {
    id: 'dep',
    q: 'Je instance existenčně závislá na jiné entitě (bez ní nemůže existovat)?',
    short: 'Existenčně závislý?',
    help: 'Barva jablka, bolest hlavy, manželství — bez nositele (účastníků) neexistují. Osoba, auto, les existují samostatně.',
    opts: [
      { label: 'Ne, existuje samostatně (objekt)', short: 'ne — objekt', next: 'sortal' },
      { label: 'Ano, je to aspekt', short: 'ano — aspekt', next: 'relator' },
    ],
  },
  relator: {
    id: 'relator',
    q: 'Je to zhmotněný vztah — závisí na více (≥ 2) entitách, které spojuje?',
    short: 'Zhmotněný vztah?',
    help: 'Marriage spojuje dva lidi, Enrollment studenta a školu. Headache či Color patří jen jednomu nositeli.',
    opts: [
      { label: 'Ano, spojuje ≥ 2 entity', short: 'ano', next: '=relator' },
      { label: 'Ne, patří jednomu nositeli (intrinsický aspekt)', short: 'ne — intrinsický', next: 'qual' },
    ],
  },
  qual: {
    id: 'qual',
    q: 'Má strukturovaný prostor hodnot (lze ho vyjádřit hodnotou na nějaké škále)?',
    short: 'Prostor hodnot?',
    help: 'Hmotnost, barva, peněžní hodnota → ano. Dovednost, konkrétní nemoc → ne. Samotná měřitelnost nerozhoduje.',
    opts: [
      { label: 'Ano (hmotnost, barva…)', short: 'ano', next: '=quality' },
      { label: 'Ne (dovednost, nemoc…)', short: 'ne', next: '=mode' },
    ],
  },
  sortal: {
    id: 'sortal',
    q: 'Mají všechny instance stejný princip identity (víme, jak je rozlišit a spočítat)?',
    short: 'Jednotná identita?',
    help: 'Všichni studenti jsou osoby → ano. Zákazník může být osoba i firma (různé principy identity) → ne.',
    opts: [
      { label: 'Ano — je to sortál', short: 'ano — sortál', next: 'provides' },
      { label: 'Ne — instance různých druhů (ne-sortál)', short: 'ne — ne-sortál', next: 'nsRig' },
    ],
  },
  provides: {
    id: 'provides',
    q: 'Poskytuje identitu sám (není podtypem jiného sortálu)?',
    short: 'Poskytuje identitu?',
    help: 'Person identitu poskytuje. Student, Man či Child ji jen nesou — dědí ji od Person.',
    opts: [
      { label: 'Ano, je poskytovatelem identity', short: 'ano', next: 'agg' },
      { label: 'Ne, identitu dědí od nadtypu', short: 'ne — dědí', next: 'rig' },
    ],
  },
  agg: {
    id: 'agg',
    q: 'Jak je instance poskládaná?',
    short: 'Druh celku?',
    help: 'Kolektiv = rovnocenní členové (strom v lese). Kvantita = nepočitatelná látka (víno, jíl).',
    opts: [
      { label: 'Jednotlivý objekt / funkční celek (části mají různé funkce)', short: 'funkční celek', next: '=kind' },
      { label: 'Kolekce rovnocenných členů', short: 'kolekce', next: '=collective' },
      { label: 'Množství látky (nepočitatelné)', short: 'množství', next: '=quantity' },
    ],
  },
  rig: {
    id: 'rig',
    q: 'Je rigidní — instance nemůže přestat být tímto typem (a dál existovat)?',
    short: 'Rigidní?',
    help: 'Man zůstává Man ve všech světech. Student nebo Child jím být přestat může.',
    opts: [
      { label: 'Ano, rigidní', short: 'rigidní', next: '=subkind' },
      { label: 'Ne, anti-rigidní (může přestat)', short: 'anti-rigidní', next: 'rel' },
    ],
  },
  rel: {
    id: 'rel',
    q: 'Je relačně závislý — je jím díky vztahu k jiné entitě?',
    short: 'Relačně závislý?',
    help: 'Student je studentem díky zápisu na školu (vztah). Child je dítětem díky vlastnímu věku (vnitřní vlastnost).',
    opts: [
      { label: 'Ano, díky vztahu', short: 'ano', next: '=role' },
      { label: 'Ne, díky vnitřní vlastnosti', short: 'ne', next: '=phase' },
    ],
  },
  nsRig: {
    id: 'nsRig',
    q: 'Jaká je rigidita (pro instance různých druhů)?',
    short: 'Rigidita?',
    help: 'Rigidní: nutná pro všechny instance. Semi-rigidní: pro některé nutná, pro jiné jen možná. Anti-rigidní: pro žádnou nutná.',
    opts: [
      { label: 'Rigidní — pro všechny instance nutná', short: 'rigidní', next: '=category' },
      { label: 'Semi-rigidní — pro některé nutná, pro jiné ne', short: 'semi-rigidní', next: '=mixin' },
      { label: 'Anti-rigidní — pro žádnou instanci nutná', short: 'anti-rigidní', next: 'nsRel' },
    ],
  },
  nsRel: {
    id: 'nsRel',
    q: 'Je relačně závislý?',
    short: 'Relačně závislý?',
    help: 'Customer je zákazníkem díky objednávce (vztah). Young Being je mladý díky věku (vnitřní vlastnost).',
    opts: [
      { label: 'Ano, díky vztahu', short: 'ano', next: '=roleMixin' },
      { label: 'Ne, díky vnitřní vlastnosti', short: 'ne', next: '=phaseMixin' },
    ],
  },
}

export type ResultInfo = { what: string; example: string; props: string[]; diagram: Diagram }

const k = (id: string, name: string, st: ClassSt, x: number, y: number, extra: object = {}) => ({ id, name, st, x, y, ...extra })

export const RESULTS: Record<ResultSt, ResultInfo> = {
  kind: {
    what: 'Rigidní sortál, který instancím poskytuje princip identity.',
    example: 'Person, Car, Organisation',
    props: ['sortál', 'rigidní', 'poskytuje identitu'],
    diagram: { classes: [k('p', 'Person', 'kind', 1, 0, { mark: 'focus' }), k('m', 'Man', 'subkind', 0.5, 1), k('w', 'Woman', 'subkind', 1.5, 1)], gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }] },
  },
  subkind: {
    what: 'Rigidní podtyp sortálu — identitu dědí od svého kindu.',
    example: 'Man, Woman (podtypy Person)',
    props: ['sortál', 'rigidní', 'nese identitu'],
    diagram: { classes: [k('p', 'Person', 'kind', 1, 0), k('m', 'Man', 'subkind', 0.5, 1, { mark: 'focus' }), k('w', 'Woman', 'subkind', 1.5, 1)], gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }] },
  },
  role: {
    what: 'Anti-rigidní sortál, jehož instance jím jsou díky vztahu (relační závislost).',
    example: 'Student, Employee, Husband',
    props: ['sortál', 'anti-rigidní', 'relačně závislý'],
    diagram: {
      classes: [k('p', 'Person', 'kind', 0, 0), k('s', 'Student', 'role', 0, 1, { mark: 'focus' }), k('e', 'Enrollment', 'relator', 1, 1), k('u', 'University', 'kind', 2, 1)],
      gens: [{ general: 'p', specifics: ['s'] }],
      assocs: [
        { from: 's', to: 'e', st: 'mediation', fromMult: '1', toMult: '1..*' },
        { from: 'e', to: 'u', st: 'mediation', fromMult: '0..*', toMult: '1' },
      ],
    },
  },
  phase: {
    what: 'Anti-rigidní sortál podle vnitřní vlastnosti; fáze tvoří {disjoint, complete} rozklad.',
    example: 'Child / Teenager / Adult, Living / Deceased',
    props: ['sortál', 'anti-rigidní', 'relačně nezávislý'],
    diagram: { classes: [k('p', 'Person', 'kind', 1, 0), k('c', 'Child', 'phase', 0.5, 1, { mark: 'focus' }), k('a', 'Adult', 'phase', 1.5, 1)], gens: [{ general: 'p', specifics: ['c', 'a'], set: { disjoint: true, complete: true } }] },
  },
  collective: {
    what: 'Poskytovatel identity pro celek z rovnocenných členů (memberOf).',
    example: 'Forest, Crowd, Research Group',
    props: ['sortál', 'rigidní', 'poskytuje identitu'],
    diagram: { classes: [k('f', 'Forest', 'collective', 0, 0, { mark: 'focus' }), k('t', 'Tree', 'kind', 1.4, 0)], assocs: [{ from: 'f', to: 't', st: 'memberOf', whole: 'from', shareable: false, fromMult: '1', toMult: '2..*' }] },
  },
  quantity: {
    what: 'Poskytovatel identity pro množství látky — maximální spojitá část, nepočitatelná.',
    example: 'Wine, Water, Clay',
    props: ['sortál', 'rigidní', 'poskytuje identitu'],
    diagram: { classes: [k('b', 'Bottle', 'kind', 0, 0), k('w', 'Wine', 'quantity', 1.4, 0, { mark: 'focus' })], assocs: [{ from: 'b', to: 'w', st: 'containment', fromMult: '1', toMult: '1' }] },
  },
  relator: {
    what: 'Zhmotněný vztah: existenčně závisí na ≥ 2 entitách, které spojuje (mediation).',
    example: 'Marriage, Enrollment, Contract',
    props: ['aspekt', 'rigidní', 'poskytuje identitu'],
    diagram: {
      classes: [k('h', 'Husband', 'role', 0, 0), k('m', 'Marriage', 'relator', 1, 0, { mark: 'focus' }), k('w', 'Wife', 'role', 2, 0)],
      assocs: [
        { from: 'h', to: 'm', st: 'mediation', fromMult: '1', toMult: '1' },
        { from: 'm', to: 'w', st: 'mediation', fromMult: '1', toMult: '1' },
      ],
    },
  },
  quality: {
    what: 'Intrinsický aspekt se strukturovaným prostorem hodnot; s nositelem ho spojuje characterization.',
    example: 'Color, Weight, Speed',
    props: ['aspekt', 'existenčně závislý na nositeli'],
    diagram: { classes: [k('c', 'Car', 'kind', 0, 0), k('q', 'Color', 'quality', 1.4, 0, { mark: 'focus', attrs: ['red: integer', 'green: integer', 'blue: integer'] })], assocs: [{ from: 'c', to: 'q', st: 'characterization', fromMult: '1', toMult: '1' }] },
  },
  mode: {
    what: 'Intrinsický aspekt bez strukturovaného prostoru hodnot (dovednost, nemoc).',
    example: 'Headache, Skill, Book Version',
    props: ['aspekt', 'existenčně závislý na nositeli'],
    diagram: { classes: [k('p', 'Person', 'kind', 0, 0), k('h', 'Headache', 'mode', 1.4, 0, { mark: 'focus' })], assocs: [{ from: 'p', to: 'h', st: 'characterization', fromMult: '1', toMult: '0..*' }] },
  },
  category: {
    what: 'Rigidní ne-sortál: nutná vlastnost společná instancím různých kindů. Abstraktní.',
    example: 'Living Being, Physical Object',
    props: ['ne-sortál', 'rigidní', 'bez vlastní identity'],
    diagram: { classes: [k('l', 'Living Being', 'category', 1, 0, { mark: 'focus', abstract: true }), k('p', 'Person', 'kind', 0.5, 1), k('d', 'Dog', 'kind', 1.5, 1)], gens: [{ general: 'l', specifics: ['p', 'd'], set: { disjoint: true } }] },
  },
  mixin: {
    what: 'Semi-rigidní ne-sortál: pro některé instance nutný, pro jiné jen možný.',
    example: 'Seatable, Insured Item',
    props: ['ne-sortál', 'semi-rigidní', 'bez vlastní identity'],
    diagram: {
      classes: [k('s', 'Seatable', 'mixin', 0.5, 0, { mark: 'focus', abstract: true }), k('k', 'Crate', 'kind', 1.5, 0), k('c', 'Chair', 'kind', 0, 1), k('sc', 'Solid Crate', 'phase', 1, 1), k('bc', 'Broken Crate', 'phase', 2, 1)],
      gens: [
        { general: 's', specifics: ['c', 'sc'], set: { disjoint: true } },
        { general: 'k', specifics: ['sc', 'bc'], set: { disjoint: true, complete: true } },
      ],
    },
  },
  roleMixin: {
    what: 'Anti-rigidní, relačně závislý ne-sortál: role společná instancím různých kindů.',
    example: 'Customer (osoba i organizace)',
    props: ['ne-sortál', 'anti-rigidní', 'relačně závislý'],
    diagram: {
      classes: [k('p', 'Person', 'kind', 0, 0), k('c', 'Customer', 'roleMixin', 1, 0, { mark: 'focus', abstract: true }), k('o', 'Organisation', 'kind', 2, 0), k('pc', 'PersonalCustomer', 'role', 0.5, 1), k('cc', 'CorporateCustomer', 'role', 1.5, 1)],
      gens: [
        { general: 'p', specifics: ['pc'] },
        { general: 'o', specifics: ['cc'] },
        { general: 'c', specifics: ['pc', 'cc'], set: { disjoint: true, complete: true } },
      ],
    },
  },
  phaseMixin: {
    what: 'Anti-rigidní, relačně nezávislý ne-sortál: fáze společná instancím různých kindů.',
    example: 'Young Being, Mature Being',
    props: ['ne-sortál', 'anti-rigidní', 'relačně nezávislý'],
    diagram: {
      classes: [k('p', 'Person', 'kind', 0, 0), k('y', 'Young Being', 'phaseMixin', 1, 0, { mark: 'focus', abstract: true }), k('d', 'Dog', 'kind', 2, 0), k('c', 'Child', 'phase', 0.5, 1), k('pu', 'Puppy', 'phase', 1.5, 1)],
      gens: [
        { general: 'p', specifics: ['c'] },
        { general: 'd', specifics: ['pu'] },
        { general: 'y', specifics: ['c', 'pu'] },
      ],
    },
  },
}

export const ALL_ST: ResultSt[] = ['kind', 'subkind', 'role', 'phase', 'collective', 'quantity', 'relator', 'category', 'mixin', 'roleMixin', 'phaseMixin', 'mode', 'quality']

export const CONCEPTS: { name: string; st: ResultSt; why: string }[] = [
  { name: 'Person', st: 'kind', why: 'Osoba existuje samostatně, je rigidní a sama poskytuje princip identity.' },
  { name: 'Car', st: 'kind', why: 'Auto je funkční celek s vlastním principem identity; autem nepřestane být.' },
  { name: 'Man', st: 'subkind', why: 'Rigidní podtyp Person — identitu dědí, mužem nepřestane být.' },
  { name: 'Woman', st: 'subkind', why: 'Rigidní podtyp Person (s Man tvoří {disjoint, complete} rozklad).' },
  { name: 'Student', st: 'role', why: 'Anti-rigidní (studovat lze přestat) a relačně závislý — na zápisu ke škole.' },
  { name: 'Employee', st: 'role', why: 'Zaměstnancem je osoba díky pracovní smlouvě se zaměstnavatelem — relační závislost.' },
  { name: 'Child', st: 'phase', why: 'Anti-rigidní podle vnitřní vlastnosti (věk), bez vztahu k jiné entitě.' },
  { name: 'Teenager', st: 'phase', why: 'Fáze osoby podle věku — anti-rigidní, relačně nezávislá.' },
  { name: 'Marriage', st: 'relator', why: 'Zhmotněný vztah, existenčně závislý na obou manželích.' },
  { name: 'Enrollment', st: 'relator', why: 'Zápis spojuje studenta a školu a nese vlastní atributy (datum…).' },
  { name: 'Headache', st: 'mode', why: 'Intrinsický aspekt osoby bez strukturovaného prostoru hodnot.' },
  { name: 'Skill', st: 'mode', why: 'Dovednost patří jednomu nositeli a nemá hodnotovou škálu → mode.' },
  { name: 'Color', st: 'quality', why: 'Intrinsický aspekt s prostorem hodnot (např. RGB).' },
  { name: 'Weight', st: 'quality', why: 'Hmotnost má strukturovaný prostor hodnot → quality.' },
  { name: 'Forest', st: 'collective', why: 'Les je kolekce rovnocenných stromů (memberOf).' },
  { name: 'Crowd', st: 'collective', why: 'Dav = kolekce lidí, kteří v něm hrají stejnou roli.' },
  { name: 'Wine', st: 'quantity', why: 'Víno je množství látky — nepočitatelné, bere tvar nádoby.' },
  { name: 'Water', st: 'quantity', why: 'Voda je kvantita: maximální spojité množství látky.' },
  { name: 'Customer', st: 'roleMixin', why: 'Zákazníkem může být osoba i organizace (různé identity) a je jím díky objednávce.' },
  { name: 'Living Being', st: 'category', why: 'Rigidní vlastnost společná Person i Dog (různé principy identity).' },
  { name: 'Physical Object', st: 'category', why: 'Rigidní ne-sortál sdružující auta, budovy, lidi…' },
  { name: 'Insured Item', st: 'mixin', why: 'Pro některé instance nutné, pro jiné jen možné (dům může pojištění ztratit) → semi-rigidní.' },
  { name: 'Seatable', st: 'mixin', why: 'Židle je k sezení vždy, bedna jen dokud není rozbitá → semi-rigidní.' },
  { name: 'Young Being', st: 'phaseMixin', why: 'Fáze společná dětem i štěňatům — anti-rigidní, bez vztahu.' },
]

/** Path of (node, option index) pairs that leads to a result stereotype. */
export function pathTo(st: ResultSt): { node: string; opt: number }[] {
  const walk = (id: string, acc: { node: string; opt: number }[]): { node: string; opt: number }[] | null => {
    const n = TREE[id]
    for (let i = 0; i < n.opts.length; i++) {
      const nx = n.opts[i].next
      const step = [...acc, { node: id, opt: i }]
      if (nx === `=${st}`) return step
      if (!nx.startsWith('=')) {
        const r = walk(nx, step)
        if (r) return r
      }
    }
    return null
  }
  return walk('dep', []) ?? []
}
