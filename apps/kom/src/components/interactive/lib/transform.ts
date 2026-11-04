// OntoUML → UML transformation recipes (P06). Data for Transform.tsx.
import type { ClassSt, DAssoc, DClass, Diagram, SourceRef } from '@content/types'

export type Strategy = {
  id: string
  label: string
  verdict?: 'good' | 'bad' | 'neutral'
  onto?: Diagram // overrides the pattern's OntoUML side
  uml: Diagram
  pros: string[]
  cons: string[]
  src: SourceRef[]
}
export type Pattern = { id: string; label: string; intro: string; onto: Diagram; strategies: Strategy[] }

const C = (id: string, name: string, x: number, y: number, st: ClassSt = 'none', extra: Partial<DClass> = {}): DClass => ({ id, name, st, x, y, ...extra })
const A = (from: string, to: string, extra: Partial<DAssoc> = {}): DAssoc => ({ from, to, st: 'none', ...extra })
const P = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P06', page, ...(quote ? { quote } : {}) })

// ---------------------------------------------------------------- shared OntoUML sides
const ontoHouse: Diagram = {
  classes: [
    C('h', 'House', 0.5, 0, 'kind', { attrs: ['value: Currency', 'computeDamageCost()'] }),
    C('i', 'Insured House', 0, 1, 'phase', { attrs: ['insuranceLevel: Percent'] }),
    C('u', 'Uninsured House', 1, 1, 'phase'),
  ],
  gens: [{ general: 'h', specifics: ['i', 'u'], set: { disjoint: true, complete: true } }],
}
const ontoProf: Diagram = {
  classes: [
    C('p', 'Professor', 0.5, 0, 'kind'),
    C('t', 'Teacher', 0, 1, 'role'),
    C('r', 'Researcher', 1, 1, 'role'),
    C('s', 'Subject', 0, 2, 'kind'),
    C('pr', 'Project', 1, 2, 'kind'),
  ],
  gens: [{ general: 'p', specifics: ['t', 'r'] }],
  assocs: [
    { from: 't', to: 's', st: 'material', fromMult: '0..*', toMult: '1..*' },
    { from: 'r', to: 'pr', st: 'material', fromMult: '1..*', toMult: '1..*' },
  ],
}
const ontoBeing: Diagram = {
  classes: [
    C('b', 'Being', 0.5, 0, 'kind', { attrs: ['name: String'] }),
    C('h', 'Human', 0, 1, 'subkind', { attrs: ['speak(): String'] }),
    C('a', 'Animal', 1, 1, 'subkind', { attrs: ['doSound(): String'] }),
  ],
  gens: [{ general: 'b', specifics: ['h', 'a'] }],
}
const roleUmlBase = [C('ts', 'Subject', 0, 2), C('rp', 'Project', 1.3, 2)]

export const PATTERNS: Pattern[] = [
  {
    id: 'kind',
    label: 'Kind + subkindy',
    intro: 'Rigidní typy se převádějí přímočaře: dědičnost v OOP je také rigidní. Navíc musíme zvolit, co bude identitou objektu.',
    onto: {
      classes: [
        C('p', 'Person', 0.5, 0, 'kind', { attrs: ['name: String', 'birthDate: Date'] }),
        C('m', 'Man', 0, 1, 'subkind'),
        C('w', 'Woman', 1, 1, 'subkind'),
      ],
      gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
    },
    strategies: [
      {
        id: 'art',
        label: 'Dědičnost + umělý identifikátor',
        verdict: 'good',
        uml: {
          classes: [
            C('p', 'Person', 0.5, 0, 'none', { abstract: true, attrs: ['id: UUID', 'name: String', 'birthDate: Date'] }),
            C('m', 'Man', 0, 1),
            C('w', 'Woman', 1, 1),
          ],
          gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
        },
        pros: [
          'Subkind je rigidní — OO dědičnost (taky rigidní) sedí.',
          '{complete} → abstraktní nadtřída; {disjoint} je standardní chování OO.',
          'Umělý identifikátor (OID, UUID, primární klíč) je vždy jednoznačný.',
        ],
        cons: ['Identifikátor nemá doménový význam — sortál jen říká, že princip identity existuje.'],
        src: [P(29), P(22), P(23)],
      },
      {
        id: 'nat',
        label: 'Dědičnost + přirozený identifikátor',
        verdict: 'neutral',
        uml: {
          classes: [
            C('p', 'Person', 0.5, 0, 'none', { abstract: true, attrs: ['name: String {id}', 'surname: String {id}', 'birthDate: Date {id}'] }),
            C('m', 'Man', 0, 1),
            C('w', 'Woman', 1, 1),
          ],
          gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
        },
        pros: ['Identita z doménových vlastností: osoba = jméno + příjmení + datum narození.'],
        cons: ['Kombinace musí být opravdu jednoznačná (naše poznámka: dva lidé se stejným jménem a datem narození existují).'],
        src: [P(29)],
      },
    ],
  },
  {
    id: 'phase',
    label: '«phase»',
    intro: 'Fáze je anti-rigidní: dům může pojištění získat i ztratit. Objekt v OOP ale svou třídu za života nemění.',
    onto: ontoHouse,
    strategies: [
      {
        id: 'state',
        label: 'Vzor State (varianta 1)',
        verdict: 'good',
        uml: {
          classes: [
            C('h', 'House', 0.5, 0, 'none', { attrs: ['value: Currency', 'computeDamageCost()'] }),
            C('i', 'InsuredHouse', 0, 1, 'none', { attrs: ['insuranceLevel: Percent'] }),
            C('u', 'UninsuredHouse', 1, 1),
          ],
          assocs: [A('h', 'i', { fromMult: '1', toMult: '1', toRole: 'phase' }), A('h', 'u', { fromMult: '1', toMult: '1', toRole: 'phase' })],
          notes: [{ id: 'n', text: '{XOR} — právě jedna fáze', x: 0.5, y: 1.75 }],
        },
        pros: [
          'Dědičnost nahradí skládání — fázi lze za běhu vyměnit.',
          'Chování podle fáze se realizuje delegováním (computeDamageCost → fáze).',
          'Vzor je použitelný i pro disjunktní role.',
        ],
        cons: ['Pravidlo XOR (právě jedna fáze) je nutné ošetřit programově.'],
        src: [P(37), P(38), P(39, 'Tento návrhový vzor je použitelný i pro disjunktní role.')],
      },
      {
        id: 'back',
        label: 'Varianta 2: navigace od fáze',
        verdict: 'neutral',
        uml: {
          classes: [
            C('h', 'House', 0.5, 0, 'none', { attrs: ['value: Currency', 'computeDamageCost()'] }),
            C('i', 'InsuredHouse', 0, 1, 'none', { attrs: ['insuranceLevel: Percent'] }),
            C('u', 'UninsuredHouse', 1, 1),
          ],
          assocs: [A('i', 'h', { fromMult: '1', toMult: '1', toRole: 'house' }), A('u', 'h', { fromMult: '1', toMult: '1', toRole: 'house' })],
          notes: [{ id: 'n', text: '{XOR} — právě jedna fáze', x: 0.5, y: 1.75 }],
        },
        pros: ['Snadná navigace opačným směrem (z fáze k domu), podobně jako u rolí.'],
        cons: ['XOR — stejně jako multiplicity na straně bez šipky — je nutné ošetřit programově.'],
        src: [P(40)],
      },
      {
        id: 'attr',
        label: 'Zjednodušení na atribut',
        verdict: 'neutral',
        uml: {
          classes: [C('h', 'House', 0, 0, 'none', { attrs: ['value: Currency', 'insured: Boolean', 'insuranceLevel: Percent [0..1]', 'computeDamageCost()'] })],
        },
        pros: ['Nejjednodušší: „zbytečné“ třídy lze po úvaze nahradit metodou nebo atributem.'],
        cons: [
          'Chování fází skončí v podmínkách uvnitř House.',
          'Že insuranceLevel má jen pojištěný dům, už nevyjadřuje struktura — musí to hlídat kód / OCL.',
        ],
        src: [P(43, 'mohou "zbytečné" třídy být nahrazeny pouze metodou/atributem.'), P(57)],
      },
      {
        id: 'inh',
        label: 'Přímá dědičnost (chyba)',
        verdict: 'bad',
        uml: {
          classes: [
            C('h', 'House', 0.5, 0, 'none', { attrs: ['value: Currency'] }),
            C('i', 'InsuredHouse', 0, 1, 'none', { mark: 'bad' }),
            C('u', 'UninsuredHouse', 1, 1, 'none', { mark: 'bad' }),
          ],
          gens: [{ general: 'h', specifics: ['i', 'u'], mark: 'bad' }],
        },
        pros: ['Vypadá jako OntoUML 1 : 1.'],
        cons: [
          'Dědění v OOP je vždy rigidní: z instance UninsuredHouse se nikdy nestane InsuredHouse.',
          'Ztrácí se anti-rigidita — význam modelu se nezachová.',
        ],
        src: [P(30), P(56), P(58)],
      },
    ],
  },
  {
    id: 'role',
    label: '«role»',
    intro: 'Role je anti-rigidní: profesor může začít i přestat učit. Dědičnost proto nahradíme skládáním.',
    onto: ontoProf,
    strategies: [
      {
        id: 'v1',
        label: 'Varianta 1: role jako části',
        verdict: 'good',
        uml: {
          classes: [C('p', 'Professor', 0.65, 0), C('t', 'TeacherRole', 0, 1), C('r', 'ResearcherRole', 1.3, 1), ...roleUmlBase],
          assocs: [
            A('p', 't', { fromMult: '1', toMult: '0..1', toRole: 'teacherRole' }),
            A('p', 'r', { fromMult: '1', toMult: '0..1', toRole: 'researcherRole' }),
            A('t', 'ts', { toMult: '1..*', toRole: 'subjects: Set' }),
            A('r', 'rp', { toMult: '1..*', toRole: 'projects: Set' }),
          ],
        },
        pros: ['Roli lze přidat i odebrat (skládání místo rigidní dědičnosti).', 'Přímý přístup k rolím z Professor.'],
        cons: ['Navigace jen od profesora k rolím.'],
        src: [P(30), P(31)],
      },
      {
        id: 'v2',
        label: 'Varianta 2: kolekce rolí',
        verdict: 'neutral',
        uml: {
          classes: [
            C('p', 'Professor', 0.65, 0),
            C('c', 'OrderedCollection', 0.65, 0.85),
            C('t', 'TeacherRole', 0, 1.7),
            C('r', 'ResearcherRole', 1.3, 1.7),
            C('ts', 'Subject', 0, 2.6),
            C('rp', 'Project', 1.3, 2.6),
          ],
          assocs: [
            A('p', 'c', { toRole: 'roles' }),
            A('c', 't', { fromMult: '1', toMult: '0..*' }),
            A('c', 'r', { fromMult: '1', toMult: '0..*' }),
            A('t', 'ts', { toMult: '1..*', toRole: 'subjects: Set' }),
            A('r', 'rp', { toMult: '1..*', toRole: 'projects: Set' }),
          ],
        },
        pros: ['Flexibilní práce s kolekcí rolí.'],
        cons: ['Složitější přístup ke konkrétní roli.'],
        src: [P(32, 'Flexibilní práce s kolekcí rolí, ale složitější přístup k rolím.')],
      },
      {
        id: 'v3',
        label: 'Varianta 3: role zná profesora',
        verdict: 'neutral',
        uml: {
          classes: [C('p', 'Professor', 0.65, 0), C('t', 'TeacherRole', 0, 1), C('r', 'ResearcherRole', 1.3, 1), ...roleUmlBase],
          assocs: [
            A('t', 'p', { fromMult: '0..*', toMult: '1', toRole: 'professor' }),
            A('r', 'p', { fromMult: '0..*', toMult: '1' }),
            A('ts', 't', { fromMult: '1..*', toMult: '0..*', toRole: 'teachers: Set' }),
            A('rp', 'r', { fromMult: '1..*', toMult: '1..*', toRole: 'researchers: Set' }),
          ],
        },
        pros: ['Snadná navigace opačným směrem (od role / předmětu k profesorovi).'],
        cons: ['Z profesora se k jeho rolím dostaneme hůř.'],
        src: [P(33, 'Pro případ, kdy potřebujeme snadnou navigaci opačným směrem.')],
      },
      {
        id: 'inh',
        label: 'Přímá dědičnost (chyba)',
        verdict: 'bad',
        uml: {
          classes: [C('p', 'Professor', 0.5, 0), C('t', 'Teacher', 0, 1, 'none', { mark: 'bad' }), C('r', 'Researcher', 1, 1, 'none', { mark: 'bad' })],
          gens: [{ general: 'p', specifics: ['t', 'r'], mark: 'bad' }],
        },
        pros: ['Kopíruje strukturu OntoUML.'],
        cons: [
          'Instanci podtřídy nejde zrušit, aniž bychom zrušili i část z nadtřídy — role se nedá odebrat.',
          'Člověk získává a ztrácí role, objekt v Javě svou třídu nemění.',
        ],
        src: [P(30), P(58)],
      },
    ],
  },
  {
    id: 'relator',
    label: '«relator» + mediation',
    intro: 'Relátor se převádí přímočaře na třídu — řešíme hlavně směry vazeb. Materiální vztah M:N se jím rozloží na dva vztahy 1:N.',
    onto: {
      classes: [C('s', 'Student', 0, 1, 'role'), C('e', 'Enrollment', 1, 0, 'relator', { attrs: ['date: Date'] }), C('u', 'University', 2, 1, 'kind')],
      assocs: [
        { from: 'e', to: 's', st: 'mediation', fromMult: '1..*', toMult: '1' },
        { from: 'e', to: 'u', st: 'mediation', fromMult: '0..*', toMult: '1' },
        { id: 'm', from: 's', to: 'u', st: 'material', name: 'studies at', fromMult: '1..*', toMult: '1..*' },
      ],
      derivations: [{ relator: 'e', assoc: 'm' }],
    },
    strategies: [
      {
        id: 'cls',
        label: 'Relátor jako třída, jednosměrně',
        verdict: 'good',
        uml: {
          classes: [C('s', 'Student', 0, 0), C('e', 'Enrollment', 1.3, 0, 'none', { attrs: ['date: Date'] }), C('u', 'University', 2.6, 0)],
          assocs: [A('e', 's', { fromMult: '1..*', toMult: '1', toRole: 'student' }), A('e', 'u', { fromMult: '0..*', toMult: '1', toRole: 'university' })],
        },
        pros: [
          '«Relator» → třída, mediace → asociace 1:N; M:N vztah zmizí.',
          'Atributy vztahu (date) mají svůj domov.',
          'Vhodně zvolená jednosměrná navigace = jednoduchý a udržovatelný kód (KISS).',
        ],
        cons: ['Musíme rozhodnout směr navigace podle budoucích dotazů.'],
        src: [P(55), P(21), P(15)],
      },
      {
        id: 'both',
        label: 'Obousměrná navigace („brusle“)',
        verdict: 'neutral',
        uml: {
          classes: [C('s', 'Student', 0, 0), C('e', 'Enrollment', 1.3, 0, 'none', { attrs: ['date: Date'] }), C('u', 'University', 2.6, 0)],
          assocs: [
            A('s', 'e', { fromMult: '1', toMult: '1..*', fromRole: 'student', toRole: 'enrollments' }),
            A('e', 'u', { fromMult: '0..*', toMult: '1', fromRole: 'enrollments', toRole: 'university' }),
          ],
        },
        pros: ['Dotazy efektivně z obou stran.'],
        cons: [
          'Vložení a odebrání vazby je nutné ošetřit u obou objektů → nebezpečí nekonzistencí.',
          'Řeší to Relationship Object Pattern, ale přidává složitost — až jako optimalizace.',
        ],
        src: [P(13, 'Vkládání a odebírání asociace je třeba ošetřit u obou objektů'), P(15)],
      },
      {
        id: 'mn',
        label: 'Jen asociace M:N (bez relátoru)',
        verdict: 'bad',
        uml: {
          classes: [C('s', 'Student', 0, 0), C('u', 'University', 1.6, 0)],
          assocs: [A('s', 'u', { fromMult: '1..*', toMult: '1..*', name: 'studiesAt', mark: 'bad' })],
        },
        pros: ['Méně tříd.'],
        cons: [
          'Naše poznámka: ztratíme relátor — atributy zápisu (date) i jeho identitu (dva zápisy téhož studenta na tutéž školu).',
          'Přednáška: materiální vztahy M:N rozkládáme pomocí relátoru na dva vztahy 1:N.',
        ],
        src: [P(21)],
      },
    ],
  },
  {
    id: 'gs',
    label: 'Generalization set',
    intro: '{complete} a {disjoint} mají v OO přímý obraz. Non-disjoint (instance více podtříd zároveň) OO přímo neumí — musí se emulovat.',
    onto: ontoBeing,
    strategies: [
      {
        id: 'abs',
        label: '{disjoint, complete} → abstraktní třída',
        verdict: 'good',
        onto: {
          classes: [C('p', 'Person', 0.5, 0, 'kind'), C('m', 'Man', 0, 1, 'subkind'), C('w', 'Woman', 1, 1, 'subkind')],
          gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
        },
        uml: {
          classes: [C('p', 'Person', 0.5, 0, 'none', { abstract: true }), C('m', 'Man', 0, 1), C('w', 'Woman', 1, 1)],
          gens: [{ general: 'p', specifics: ['m', 'w'] }],
        },
        pros: ['complete: žádná instance není jen instancí nadtřídy → abstraktní třída.', 'disjoint: instance nejvýše jedné podtřídy = standardní chování OO.'],
        cons: ['Bez {complete} nadtřída abstraktní není.'],
        src: [P(22, 'V OO implementujeme jako abstraktní třídu.'), P(23)],
      },
      {
        id: 'comb',
        label: 'Non-disjoint: kombinační podtřídy',
        verdict: 'neutral',
        uml: {
          classes: [
            C('b', 'Being', 1, 0, 'none', { attrs: ['name: String'] }),
            C('h', 'Human', 0, 1, 'none', { attrs: ['speak(): String'] }),
            C('a', 'Animal', 1, 1, 'none', { attrs: ['doSound(): String'] }),
            C('ha', 'HumanAnimal', 2, 1, 'none', { attrs: ['speak(): String', 'doSound(): String'] }),
          ],
          gens: [{ general: 'b', specifics: ['h', 'a', 'ha'] }],
        },
        pros: ['Každá podtřída = jedna možná kombinace → vidíme typy instancí.'],
        cons: ['Počet kombinací roste exponenciálně (závažné porušení DRY).', 'Jen pro malý počet tříd; nevytvářet kombinace, které nemohou nastat.'],
        src: [P(25)],
      },
      {
        id: 'deleg',
        label: 'Non-disjoint: dědění + skládání',
        verdict: 'neutral',
        uml: {
          classes: [
            C('b', 'Being', 1, 0, 'none', { attrs: ['name: String'] }),
            C('h', 'Human', 0, 1, 'none', { attrs: ['speak(): String'] }),
            C('ha', 'HumanAnimal', 1, 1, 'none', { attrs: ['speak(): String', 'doSound(): String'] }),
            C('a', 'Animal', 2, 1, 'none', { attrs: ['doSound(): String'] }),
          ],
          gens: [{ general: 'b', specifics: ['h', 'ha', 'a'] }],
          assocs: [A('ha', 'h', { fromMult: '1', toMult: '1', toRole: 'human' }), A('ha', 'a', { fromMult: '1', toMult: '1', toRole: 'animal' })],
        },
        pros: ['Princip delegování — HumanAnimal deleguje na Human a Animal.', 'Neporušuje DRY.'],
        cons: ['Stále obecně exponenciální počet podtříd.'],
        src: [P(26)],
      },
      {
        id: 'comp',
        label: 'Non-disjoint: čisté skládání',
        verdict: 'neutral',
        uml: {
          classes: [
            C('b', 'Being', 0.5, 0, 'none', { attrs: ['name: String'] }),
            C('h', 'Human', 0, 1, 'none', { attrs: ['speak(): String'] }),
            C('a', 'Animal', 1, 1, 'none', { attrs: ['doSound(): String'] }),
          ],
          assocs: [A('b', 'h', { fromMult: '1', toMult: '0..1', toRole: 'human' }), A('b', 'a', { fromMult: '1', toMult: '0..1', toRole: 'animal' })],
        },
        pros: ['Počet tříd roste lineárně.'],
        cons: ['Ztrácíme přehled o vazbě dědění.', 'Nelze použít pro {complete} — nadtřída nemůže být abstraktní.'],
        src: [P(27), P(28)],
      },
    ],
  },
  {
    id: 'pw',
    label: 'Celek–část',
    intro: 'Funkční celek je skládání. Kolektiv a kvantita se implementují jako kolekce nebo třídy — podle toho, jestli potřebujeme další atributy.',
    onto: {
      classes: [C('c', 'Car', 0, 0, 'kind'), C('e', 'Engine', 1.5, 0, 'kind')],
      assocs: [{ from: 'c', to: 'e', st: 'componentOf', whole: 'from', fromMult: '1', toMult: '1' }],
    },
    strategies: [
      {
        id: 'comp',
        label: 'componentOf → skládání',
        verdict: 'good',
        uml: {
          classes: [C('c', 'Car', 0, 0), C('e', 'Engine', 1.5, 0)],
          assocs: [A('c', 'e', { whole: 'from', fromMult: '1', toMult: '1', toRole: 'engine' })],
        },
        pros: ['Funkční celek je skládání → implementace zcela přímočará.'],
        cons: ['Je třeba ošetřit multiplicity (spodní mez: hard / soft metoda).'],
        src: [P(50), P(16)],
      },
      {
        id: 'ess',
        label: '{essential} → konstruktor bez setteru',
        verdict: 'good',
        onto: {
          classes: [C('p', 'Person', 0, 0, 'kind'), C('b', 'Brain', 1.5, 0, 'kind')],
          assocs: [{ from: 'p', to: 'b', st: 'componentOf', whole: 'from', fromMult: '1', toMult: '1', meta: ['essential'] }],
        },
        uml: {
          classes: [C('p', 'Person', 0, 0, 'none', { attrs: ['- brain: Brain', '+ Person(brain: Brain)', '(žádné setBrain)'] }), C('b', 'Brain', 1.6, 0)],
          assocs: [A('p', 'b', { whole: 'from', fromMult: '1', toMult: '1', toRole: 'brain' })],
        },
        pros: ['Esenciální část předáme konstruktoru celku.', 'Bez setteru ji nejde zvenku vyměnit.'],
        cons: [
          'Uvnitř metod celku musíme sami dodržet, že instanci části nevyměníme.',
          '{inseparable} zajistit nelze úplně — jiný celek si část může složit k sobě.',
        ],
        src: [P(52), P(53)],
      },
      {
        id: 'coll',
        label: '«collective» → kolekce',
        verdict: 'good',
        onto: {
          classes: [
            C('f', 'Friends', 0, 1, 'collective'),
            C('p', 'Person', 1.5, 0, 'kind'),
            C('a', 'Animal', 1.5, 1, 'kind'),
            C('g', 'Gadget', 1.5, 2, 'kind'),
          ],
          assocs: [
            { from: 'f', to: 'p', st: 'memberOf', whole: 'from', shareable: true, toMult: '0..*' },
            { from: 'f', to: 'a', st: 'memberOf', whole: 'from', shareable: true, toMult: '0..*' },
            { from: 'f', to: 'g', st: 'memberOf', whole: 'from', shareable: true, toMult: '0..*' },
          ],
        },
        uml: {
          classes: [C('f', 'friends: Set', 0, 1), C('p', 'Person', 1.5, 0), C('a', 'Animal', 1.5, 1), C('g', 'Gadget', 1.5, 2)],
          assocs: [A('f', 'p', { toMult: '0..*' }), A('f', 'a', { toMult: '0..*' }), A('f', 'g', { toMult: '0..*' })],
        },
        pros: ['Kolektiv = instance kolekce (Set) v instanční proměnné.', 'Potřebujeme-li další atributy či metody, kolekci obalíme třídou.'],
        cons: ['Prvky různých typů: ve staticky typovaných jazycích je třeba něco navíc (interface / umělá nadtřída).'],
        src: [P(48), P(49)],
      },
      {
        id: 'qty',
        label: '«quantity» + «containment»',
        verdict: 'good',
        onto: {
          classes: [C('b', 'Bottle', 0, 0, 'kind'), C('w', 'Wine', 1.5, 0, 'quantity')],
          assocs: [{ from: 'b', to: 'w', st: 'containment', fromMult: '1', toMult: '1' }],
        },
        uml: {
          classes: [
            C('b', 'Bottle', 0, 0, 'none', { attrs: ['colour: Color', 'maxVolume_ml: Float'] }),
            C('w', 'Wine', 1.6, 0, 'none', { attrs: ['name: String', 'year: Integer', 'volume_ml: Float'] }),
          ],
          assocs: [A('b', 'w', { fromMult: '1', toMult: '1', toRole: 'content' })],
        },
        pros: ['«Quantity» je standardní třída.', '«containment» = skládání, vazba se obvykle jmenuje content (obsah).'],
        cons: ['—'],
        src: [P(46)],
      },
      {
        id: 'subq',
        label: '«subQuantityOf»',
        verdict: 'good',
        onto: {
          classes: [C('w', 'Wine', 0, 0, 'quantity'), C('a', 'Alcohol', 1.5, 0, 'quantity')],
          assocs: [{ from: 'w', to: 'a', st: 'subQuantityOf', whole: 'from', fromMult: '1', toMult: '1', meta: ['essential'] }],
        },
        uml: {
          classes: [
            C('w', 'Wine', 0, 0, 'none', { attrs: ['name: String', 'year: Integer', 'volume_ml: Float'] }),
            C('a', 'Alcohol', 1.6, 0, 'none', { attrs: ['percent: Float', 'purity: Float'] }),
          ],
          assocs: [A('w', 'a', { fromMult: '1', toMult: '1', toRole: 'alcoholSubQuantity' })],
        },
        pros: ['Podkvantita je analogicky třída připojená skládáním.'],
        cons: ['{essential} řešíme jako u funkčního celku (konstruktor, bez setteru).'],
        src: [P(47), P(52)],
      },
    ],
  },
  {
    id: 'aspect',
    label: '«quality» / «mode»',
    intro: 'Interní aspekty jsou přímočaré — a lze je optimalizovat na atributy.',
    onto: {
      classes: [C('c', 'Car', 0, 0, 'kind'), C('q', 'Color', 1.6, 0, 'quality', { attrs: ['red: integer', 'green: integer', 'blue: integer'] })],
      assocs: [{ from: 'c', to: 'q', st: 'characterization', fromMult: '1', toMult: '1' }],
    },
    strategies: [
      {
        id: 'cls',
        label: 'Aspekt jako třída',
        verdict: 'neutral',
        uml: {
          classes: [C('c', 'Car', 0, 0), C('q', 'Color', 1.6, 0, 'none', { attrs: ['red: Integer', 'green: Integer', 'blue: Integer'] })],
          assocs: [A('c', 'q', { whole: 'from', fromMult: '1', toMult: '1', toRole: 'color' })],
        },
        pros: ['Vyplatí se, když má aspekt vlastní atributy, vazby či metody.'],
        cons: ['Třída navíc pro jednoduchou hodnotu.'],
        src: [P(55), P(57)],
      },
      {
        id: 'attr',
        label: 'Optimalizace na atribut',
        verdict: 'good',
        uml: { classes: [C('c', 'Car', 0, 0, 'none', { attrs: ['color: Color'] })] },
        pros: ['Nejjednodušší; atributy jsou v OntoUML stejně „syntactic sugar“ pro kvality.'],
        cons: ['Aspekt pak nemůže mít vlastní vazby.'],
        src: [P(55, 'Interní Aspekty («Quality», «Mode») -- přímočaré + možnost optimalizace na atributy'), { kind: 'slide', doc: 'P04', page: 63 }],
      },
    ],
  },
]
