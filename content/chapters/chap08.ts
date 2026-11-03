import type { Chapter, DClass, Diagram } from '../types'

// ---------------------------------------------------------------------------
// Model pro příklady: zjednodušená taxislužba (Costy Taxi z cvičení).
// Třídy podle C09 str. 13 (Person s rolemi Driver a Customer, Vehicle s podtřídami
// PersonalCar a Van, TaxiRide); atributy jsou doplněné kvůli OCL příkladům.

const person = (x: number, y: number): DClass => ({
  id: 'person',
  name: 'Person',
  st: 'kind',
  x,
  y,
  attrs: ['name: String', 'age: Integer'],
  note: 'rigidní, dává identitu: člověk je Person po celou dobu existence',
})
const driver = (x: number, y: number, attrs: string[] = ['rating: Real']): DClass => ({
  id: 'driver',
  name: 'Driver',
  st: 'role',
  x,
  y,
  attrs,
  note: 'anti-rigidní a relačně závislá: řidičem je člověk díky jízdám (mediation)',
})
const customer = (x: number, y: number, attrs: string[] = ['credit: Real']): DClass => ({
  id: 'customer',
  name: 'Customer',
  st: 'role',
  x,
  y,
  attrs,
  note: 'role: zákazníkem je člověk jen díky objednaným jízdám',
})
const ride = (x: number, y: number, attrs: string[]): DClass => ({
  id: 'ride',
  name: 'TaxiRide',
  st: 'relator',
  x,
  y,
  attrs,
  note: 'relátor: jedna jízda spojuje řidiče, zákazníky a vozidlo',
})
const vehicle = (x: number, y: number): DClass => ({
  id: 'vehicle',
  name: 'Vehicle',
  st: 'kind',
  x,
  y,
  attrs: ['plate: String', 'seats: Integer'],
})

const rideDriver = { id: 'a-drv', from: 'ride', to: 'driver', st: 'mediation', fromMult: '1..*', toMult: '1', fromRole: 'rides', toRole: 'driver' } as const
const rideCustomer = { id: 'a-cus', from: 'ride', to: 'customer', st: 'mediation', fromMult: '1..*', toMult: '1..*', fromRole: 'rides', toRole: 'customers' } as const
const rideVehicle = { id: 'a-veh', from: 'ride', to: 'vehicle', st: 'mediation', fromMult: '1..*', toMult: '1', fromRole: 'rides', toRole: 'vehicle' } as const

const fullModel: Diagram = {
  classes: [
    person(1.25, 0),
    driver(0, 2),
    ride(1.25, 2, ['start: Integer', 'end: Integer', 'distanceKm: Real', 'price: Real', 'isPaid: Boolean', '/duration: Integer']),
    customer(2.5, 2),
    vehicle(1.25, 3.6),
    { id: 'car', name: 'PersonalCar', st: 'subkind', x: 0.75, y: 4.8 },
    { id: 'van', name: 'Van', st: 'subkind', x: 1.75, y: 4.8, note: 'dodávka: v OCL jí dáme pravidlo o počtu míst' },
  ],
  gens: [
    { general: 'person', specifics: ['driver', 'customer'] },
    { general: 'vehicle', specifics: ['car', 'van'], set: { disjoint: true, complete: true } },
  ],
  assocs: [{ ...rideDriver }, { ...rideCustomer }, { ...rideVehicle }],
  steps: [
    { label: 'Osoby a jejich role', add: ['person', 'driver', 'customer'] },
    { label: 'Relátor TaxiRide spojuje řidiče a zákazníky', add: ['ride'] },
    { label: 'Vozidla', add: ['vehicle', 'car', 'van'] },
  ],
}

const peopleModel: Diagram = {
  classes: [
    person(1.25, 0),
    driver(0, 1.5),
    ride(1.25, 1.5, ['start: Integer', 'end: Integer', 'price: Real']),
    customer(2.5, 1.5),
  ],
  gens: [{ general: 'person', specifics: ['driver', 'customer'] }],
  assocs: [{ ...rideDriver }, { ...rideCustomer }],
}

const prePostModel: Diagram = {
  classes: [
    customer(0, 0),
    ride(1.3, 0, ['price: Real', 'isPaid: Boolean']),
    driver(2.6, 0),
  ],
  assocs: [{ ...rideCustomer }, { ...rideDriver }],
  notes: [
    { id: 'n-cus', text: 'topUp(amount: Real)', x: 0, y: 1.05, attach: ['customer'] },
    { id: 'n-ride', text: 'pay()', x: 1.3, y: 1.05, attach: ['ride'] },
    { id: 'n-drv', text: 'unpaidRides(): Integer', x: 2.6, y: 1.05, attach: ['driver'] },
  ],
}

const deriveModel: Diagram = {
  classes: [
    ride(0, 0, ['start: Integer', 'end: Integer', 'distanceKm: Real', 'isPaid: Boolean', '/duration: Integer']),
    driver(1.5, 0, ['rating: Real', '/totalKm: Real']),
  ],
  assocs: [{ ...rideDriver }],
  notes: [{ id: 'n-der', text: '„/“ = odvozený atribut, jeho hodnotu dává derive', x: 0.75, y: 1.0 }],
}

const vehicleModel: Diagram = {
  classes: [
    vehicle(1, 0),
    { id: 'car', name: 'PersonalCar', st: 'subkind', x: 0, y: 1.25 },
    { id: 'van', name: 'Van', st: 'subkind', x: 2, y: 1.25, mark: 'focus', note: 'pravidlo „aspoň 7 míst“ platí jen pro dodávky' },
  ],
  gens: [{ general: 'vehicle', specifics: ['car', 'van'], set: { disjoint: true, complete: true } }],
}

const collectionModel: Diagram = {
  classes: [
    driver(0, 0),
    ride(1.3, 0, ['distanceKm: Real', 'price: Real', 'isPaid: Boolean']),
    customer(2.6, 0),
    vehicle(1.3, 1.6),
  ],
  assocs: [{ ...rideDriver }, { ...rideCustomer }, { ...rideVehicle }],
}

const filterModel: Diagram = {
  classes: [
    person(1, 0),
    driver(0, 1.25, ['licenseNo: String']),
    customer(2, 1.25),
  ],
  gens: [{ general: 'person', specifics: ['driver', 'customer'] }],
  notes: [{ id: 'n-f', text: 'chybí {complete}: ne každá Person je Driver', x: 1, y: 2.05 }],
}

// ---------------------------------------------------------------------------

export const chap08: Chapter = {
  id: 'chap-8',
  number: '8',
  title: 'OCL',
  docs: ['P07', 'C07', 'C08'],
  exam: ['zkouska'],
  summary:
    'Umět přečíst a napsat OCL omezení nad (Onto)UML modelem: zvolit kontext, rozlišit inv / pre / post / init / derive, používat implies a operace nad kolekcemi (select, collect, forAll…) a vyhnout se typickým chybám z cvičení.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-1',
      number: '8.1',
      title: 'K čemu je OCL',
      blocks: [
        {
          kind: 'p',
          html:
            'Diagram (OntoUML i UML) neumí říct všechno. Že jízda musí skončit po svém začátku nebo že dodávka má aspoň 7 míst, do diagramu nenakreslíš. Model pak <strong>povoluje situace, které v realitě nejsou přípustné</strong>. OCL tyto mezery zalepí: přidáš pravidla a množina povolených stavů se zúží blíž k realitě.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 3 },
            { kind: 'slide', doc: 'P07', page: 4, quote: 'Cílem je zamezit vzniku nepřípustných instancí v databázi = zachovat pravdivost' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'OCL (Object Constraint Language)',
          html:
            '<ul><li>standard OMG, <strong>dotazovací jazyk UML</strong> pro omezení, která nejdou vyjádřit samotnou notací,</li><li><strong>deklarativní</strong>: množina definic, ne postup výpočtu,</li><li><strong>bez vedlejších efektů</strong>: nemůže měnit model ani jeho instance, jen se ptá,</li><li>základ je <strong>tvrzení (assertion)</strong>: výraz, který je vždy <code>true</code> nebo <code>false</code>,</li><li>OntoUML je profil UML, takže OCL funguje i pro OntoUML.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P07', page: 6, quote: 'Standardní dotazovací jazyk UML 2 sloužící pro specifikaci omezení v modelech' },
            { kind: 'slide', doc: 'P07', page: 6, quote: 'Pouze dotazovací = nemůže měnit model a jeho instance (side-effect free)' },
            { kind: 'slide', doc: 'P07', page: 7, quote: 'Jelikož OntoUML je profil jazyka UML, OCL funguje pro něj stejně.' },
          ],
        },
        {
          kind: 'p',
          html:
            'Všechny příklady v kapitole píšeme nad touto zjednodušenou <strong>taxislužbou</strong> (Costy Taxi z cvičení). Projdi si ji po krocích. Jména rolí na koncích asociací (<code>driver</code>, <code>customers</code>, <code>rides</code>, <code>vehicle</code>) jsou přesně to, přes co budeme v OCL navigovat.',
        },
        {
          kind: 'diagram',
          title: 'Model pro příklady: taxislužba',
          diagram: fullModel,
          caption:
            'Person s rolemi Driver a Customer, relátor TaxiRide, Vehicle s podtřídami PersonalCar a Van. Atributy jsme doplnili kvůli příkladům.',
          sources: [{ kind: 'slide', doc: 'C09', page: 13 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Nejdřív model, pak OCL',
          html:
            'Do OCL patří jen to, co <strong>nejde zachytit přímo v (Onto)UML</strong>. Často stačí:<ul><li>vytvořit hierarchii podtříd,</li><li>přesunout vztah nebo atribut do podtřídy,</li><li>správně nastavit multiplicitu nebo <code>{complete}</code>, <code>{essential}</code>…</li></ul>',
          sources: [
            { kind: 'slide', doc: 'C07', page: 12, quote: 'V OCL specifikujte pouze to co nelze zachytit přímo v (Onto)UML' },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Proč ne prostě česky nebo testem?',
          html:
            'OCL přesně určí, <em>kterých instancí</em> se pravidlo týká a <em>co</em> musí platit. Text v češtině vysvětlí záměr, testy ověří jen vybrané případy. Tyto přístupy se doplňují.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 36, quote: 'OCL přesně určí, kterých instancí se pravidlo týká a jaká podmínka má platit.' },
          ],
        },
        { kind: 'quiz', ids: ['ch08-01', 'ch08-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-2',
      number: '8.2',
      title: 'Kontext a invariant',
      blocks: [
        {
          kind: 'p',
          html:
            'Každé omezení se vztahuje ke <strong>kontextu</strong>: třídě, operaci nebo atributu. <strong>Invariant</strong> (<code>inv</code>) je pravidlo nad třídou, které musí platit <strong>vždy</strong>, po celý život modelu. Obvykle zachycuje doménová (business) pravidla.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 9, quote: 'Omezení se vždy vztahuje k určitému context (např. třída, metoda, atribut).' },
            { kind: 'slide', doc: 'P07', page: 11, quote: 'Invariant je constraint, který má být pravdivý během celého života modelu.' },
          ],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Obecný tvar invariantu (jméno je nepovinné)',
          code: 'context <classifier>\ninv [<constraint_name>]: <Boolean_OCL_expression>',
          sources: [{ kind: 'slide', doc: 'P07', page: 11 }],
        },
        {
          kind: 'diagram',
          title: 'Výřez modelu pro invarianty',
          diagram: peopleModel,
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Invarianty nad taxislužbou',
          code:
            'context Driver\ninv adultDriver: self.age >= 18\n\ncontext TaxiRide\ninv endAfterStart: self.end > self.start\n\n-- self lze vynechat, je-li jasné, k čemu se atribut vztahuje\ncontext TaxiRide\ninv nonNegativePrice: price >= 0',
          sources: [
            { kind: 'slide', doc: 'P07', page: 12, quote: 'self ukazuje na objekt, ze kterého je constraint vyhodnocován, lze implicitně:' },
            { kind: 'slide', doc: 'C07', page: 5, quote: 'Je vhodné si omezení pojmenovávat (pro identifikaci)' },
          ],
        },
        {
          kind: 'p',
          html:
            '<code>self</code> je instance kontextové třídy (jako <code>this</code> v Javě, ale v OCL se píše <code>self</code>). <code>age</code> je zděděný atribut z <code>Person</code>, Driver ho má také. Kontext vybírej tak, aby se pravidlo zapsalo <strong>nejsnáz</strong>: věk řidiče se píše v kontextu <code>Driver</code>, ne přes všechny osoby.',
          sources: [
            { kind: 'slide', doc: 'C07', page: 4, quote: 'Občas lze omezení specifikovat z pohledu více kontextů, je vhodné zvolit takový, odkud' },
          ],
        },
        {
          kind: 'table',
          caption: 'Navigace přes asociaci: co dostanu?',
          head: ['Výraz (kontext TaxiRide)', 'Multiplicita konce', 'Výsledek', 'Operace se volají přes'],
          rows: [
            ['<code>self.driver</code>', '<code>1</code>', 'jeden objekt <code>Driver</code>', '<code>.</code> (např. <code>self.driver.age</code>)'],
            ['<code>self.customers</code>', '<code>1..*</code>', 'kolekce <code>Set(Customer)</code>', '<code>-&gt;</code> (např. <code>self.customers-&gt;size()</code>)'],
          ],
          sources: [{ kind: 'slide', doc: 'P07', page: 19 }],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Objekt vs. kolekce v jednom pravidle',
          code:
            '-- řidič nesmí vézt sám sebe jako zákazníka\n-- (Driver i Customer jsou role téže Person, takže to nastat může)\ncontext TaxiRide\ninv driverNotCustomer: self.customers->excludes(self.driver)',
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Neopakuj multiplicitu v OCL',
          html:
            'Invariant <code>self.customers-&gt;size() &gt;= 1</code> je zbytečný: totéž už říká multiplicita <code>1..*</code> v diagramu. Na testu i v semestrálce chtějí omezení, která model <em>sám</em> neumí.',
          code: 'context TaxiRide\ninv: self.customers->size() >= 1   -- už říká multiplicita 1..*',
          lang: 'ocl',
          sources: [{ kind: 'slide', doc: 'C07', page: 12, quote: 'Zvolit správně multiplicity či definovaná omezení ( {complete} , {essential} , ...)' }],
        },
        { kind: 'quiz', ids: ['ch08-03', 'ch08-04'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-3',
      number: '8.3',
      title: 'Pre- a postcondition',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Precondition</strong> (<code>pre</code>) říká, co musí platit <em>před</em> zavoláním operace, <strong>postcondition</strong> (<code>post</code>) co musí platit <em>po</em> jejím provedení. Dohromady tvoří <strong>kontrakt metody</strong> a nezávisí na tom, jak je operace implementovaná. Kontextem je vždy <strong>operace</strong>: <code>Třída::operace(parametry)</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 13, quote: 'Precondition = musí být splněn před vykonáním operace' },
            { kind: 'slide', doc: 'P07', page: 13, quote: 'Postcondition = musí být splněn po vykonání operace' },
            { kind: 'slide', doc: 'C07', page: 7, quote: 'Společně s precondition představuje kontrakt metody' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Operace v modelu (poznámky = operace třídy)',
          diagram: prePostModel,
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Kontrakty operací',
          code:
            'context TaxiRide::pay()\npre notPaidYet: self.isPaid = false\npost paid: self.isPaid = true\n\ncontext Customer::topUp(amount : Real)\npre positiveAmount: amount > 0\npost: self.credit = self.credit@pre + amount\n\ncontext Driver::unpaidRides() : Integer\npost: result = self.rides->select(r | not r.isPaid)->size()',
          sources: [
            { kind: 'slide', doc: 'P07', page: 14 },
            { kind: 'slide', doc: 'P07', page: 15 },
          ],
        },
        {
          kind: 'table',
          caption: 'Dvě klíčová slova jen pro postcondition',
          head: ['Zápis', 'Význam', 'Příklad'],
          rows: [
            ['<code>result</code>', 'návratová hodnota operace', '<code>post: result = self.end - self.start</code>'],
            ['<code>x@pre</code>', 'hodnota <code>x</code> <strong>před</strong> provedením operace (jen v <code>post</code>)', '<code>post: credit = credit@pre + amount</code>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P07', page: 14, quote: 'result označuje výsledek operace' },
            { kind: 'slide', doc: 'P07', page: 15, quote: 'start@pre = hodnota start před vykonáním operace.' },
            { kind: 'slide', doc: 'P07', page: 15, quote: 'Používá se pouze u postconditions.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: '„=“ v postcondition není přiřazení',
          html:
            '<code>post: self.isPaid = true</code> jízdu nezaplatí. OCL nemění stav, jen říká, co musí po operaci <strong>platit</strong>. Změnu musí provést implementace. Je to smluvený výsledek, ne příkaz. Pozor taky na <code>=</code> (rovnost) vs. <code>&lt;&gt;</code> (nerovnost), v OCL není <code>==</code> ani <code>!=</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 37, quote: 'Je to smluvený výsledek, nikoli příkaz k přiřazení.' },
            { kind: 'slide', doc: 'C07', page: 7, quote: 'result představuje výsledek operace, = není přiřazení' },
            { kind: 'slide', doc: 'C07', page: 6, quote: 'Pozor na operátory = a <>' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'pre / post jen v kontextu operace',
          html:
            'Nejčastější chyba z aktivity na cvičení: <code>pre</code>/<code>post</code> napsané v kontextu třídy. Bez operace není žádné „před“ a „po“.',
          code: '-- ŠPATNĚ\ncontext TaxiRide\npre: self.isPaid = false\n\n-- SPRÁVNĚ\ncontext TaxiRide::pay()\npre: self.isPaid = false',
          lang: 'ocl',
          sources: [{ kind: 'slide', doc: 'C08', page: 4, quote: 'pre a post lze používat jen v kontextu metod' }],
        },
        { kind: 'quiz', ids: ['ch08-05', 'ch08-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-4',
      number: '8.4',
      title: 'init, derive, def a let',
      blocks: [
        {
          kind: 'p',
          html:
            '<code>init</code> určuje hodnotu, která musí platit <strong>při vytvoření objektu</strong> (jen tehdy). <code>derive</code> definuje <strong>odvozený atribut</strong> (v diagramu se lomítkem <code>/</code>) nebo odvozenou asociaci: hodnota se vždy spočítá z jiných údajů. Kontextem obou je <strong>atribut</strong>: <code>Třída::atribut : Typ</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 30, quote: 'Specifikace hodnoty, která musí platit při vytvoření objektu (pouze).' },
            { kind: 'slide', doc: 'P07', page: 29, quote: 'Pomocí odvození (derivation rule) je možné definovat:' },
            { kind: 'slide', doc: 'C08', page: 4, quote: 'omezení derive musí být v kontextu atributu' },
          ],
        },
        { kind: 'diagram', title: 'Odvozené atributy /duration a /totalKm', diagram: deriveModel },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'init a derive',
          code:
            'context TaxiRide::isPaid : Boolean\ninit: false\n\ncontext TaxiRide::duration : Integer\nderive: self.end - self.start\n\ncontext Driver::totalKm : Real\nderive: self.rides->collect(r | r.distanceKm)->sum()',
          sources: [
            { kind: 'slide', doc: 'P07', page: 29 },
            { kind: 'slide', doc: 'P07', page: 30 },
            { kind: 'slide', doc: 'C07', page: 8 },
          ],
        },
        {
          kind: 'p',
          html:
            '<code>let … in</code> zavede <strong>lokální proměnnou</strong> (neměnnou) jen pro jedno omezení. <code>def</code> přidá do kontextu <strong>nový atribut nebo operaci</strong>, kterou pak můžeš používat ve více omezeních. Omezení lze sdružovat do balíčků <code>package … endpackage</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 31, quote: 'Definice lokální proměnné (neměnná, immutable)' },
            { kind: 'slide', doc: 'P07', page: 32, quote: 'Přidávání nových atributů a operací do modelu pro opakované použití' },
            { kind: 'slide', doc: 'P07', page: 34 },
          ],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'def (znovupoužitelné) vs. let (jen v tomto omezení)',
          code:
            'package CostyTaxi\n\ncontext Driver\ndef: paidRides : Set(TaxiRide) = self.rides->select(r | r.isPaid)\n\ncontext Driver\ninv experienced:\n  let n : Integer = self.rides->size() in\n  n > 100 implies self.rating >= 4.0\n\nendpackage',
        },
        {
          kind: 'table',
          caption: 'Typy omezení na jednom místě (oblíbené přiřazovací otázky)',
          head: ['Klíčové slovo', 'Kontext', 'Kdy musí platit'],
          rows: [
            ['<code>inv</code>', 'třída', 'vždy'],
            ['<code>pre</code>', 'operace <code>T::op()</code>', 'před vykonáním operace'],
            ['<code>post</code>', 'operace <code>T::op()</code>', 'po vykonání operace (smí <code>result</code>, <code>@pre</code>)'],
            ['<code>init</code>', 'atribut <code>T::a : Typ</code>', 'u nově vytvořeného objektu'],
            ['<code>derive</code>', 'atribut <code>T::a : Typ</code> (nebo asociace)', 'vždy, hodnota se odvozuje'],
            ['<code>def</code>', 'třída', 'definice nového atributu / operace pro více omezení'],
            ['<code>let … in</code>', 'uvnitř jednoho výrazu', 'lokální proměnná jen v daném omezení'],
          ],
          sources: [{ kind: 'slide', doc: 'C07', page: 9, quote: 'let in (lokální proměnná v podmínce), package / endpackage , import' }],
        },
        { kind: 'quiz', ids: ['ch08-07', 'ch08-08'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-5',
      number: '8.5',
      title: 'Výrazy: implies vs. if-then-else',
      blocks: [
        {
          kind: 'p',
          html:
            'Booleovské operátory OCL: <code>and</code>, <code>or</code>, <code>not</code>, <code>xor</code>, <code>implies</code> a výraz <code>if … then … else … endif</code>. Ten není příkaz jako v Javě: je to <strong>výraz</strong>, musí mít <strong>obě větve</strong> a obě stejného typu. Pro podmíněná pravidla skoro vždy stačí <code>implies</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 16 },
            { kind: 'slide', doc: 'C07', page: 10, quote: 'OCL není imperativní programování, if then else je výraz, kde musí vždy být obě' },
          ],
        },
        {
          kind: 'table',
          caption: 'Zbytečný if-then-else a jeho kratší zápis',
          head: ['Místo…', 'piš'],
          rows: [
            ['<code>if A then B else true endif</code>', '<code>A implies B</code>'],
            ['<code>if A then true else B endif</code>', '<code>A or B</code>'],
            ['<code>if A then true else false endif</code>', '<code>A</code>'],
            ['<code>if A then false else true endif</code>', '<code>not A</code>'],
          ],
          sources: [
            { kind: 'slide', doc: 'C07', page: 10, quote: 'if A then B else true je to samé jako A implies B' },
            { kind: 'slide', doc: 'C07', page: 10, quote: 'if A then true else B je to samé jako A or B' },
          ],
        },
        {
          kind: 'table',
          caption: 'Pravdivostní tabulka implies: když A neplatí, pravidlo je splněné',
          head: ['A', 'B', '<code>A implies B</code>'],
          rows: [
            ['true', 'true', '<strong>true</strong>'],
            ['true', 'false', '<strong>false</strong>'],
            ['false', 'true', '<strong>true</strong>'],
            ['false', 'false', '<strong>true</strong>'],
          ],
        },
        { kind: 'diagram', title: 'Výřez: vozidla', diagram: vehicleModel },
        {
          kind: 'code',
          lang: 'ocl',
          caption: '„Dodávka má aspoň 7 míst“ třikrát',
          code:
            '-- 1) s implies (kontext nadtřída)\ncontext Vehicle\ninv vanSeats: self.oclIsKindOf(Van) implies self.seats >= 7\n\n-- 2) totéž zbytečně přes if (else-větev musí být true!)\ncontext Vehicle\ninv vanSeats2: if self.oclIsKindOf(Van) then self.seats >= 7 else true endif\n\n-- 3) nejjednodušší: zvol rovnou kontext Van\ncontext Van\ninv vanSeats3: self.seats >= 7',
          sources: [
            { kind: 'slide', doc: 'P07', page: 26 },
            { kind: 'slide', doc: 'C07', page: 10 },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Test typu objektu',
          html:
            '<ul><li><code>oclIsTypeOf(T)</code>: objekt je <em>přesně</em> typu T (Van není <code>oclIsTypeOf(Vehicle)</code>),</li><li><code>oclIsKindOf(T)</code>: objekt je typu T <em>nebo jeho podtypu</em> (jako <code>instanceof</code> v Javě),</li><li><code>oclIsUndefined()</code>: hodnota chybí (<code>OclVoid</code>, „null“).</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P07', page: 17 },
            { kind: 'slide', doc: 'P07', page: 33, quote: 'prázdný atribut: hodnota OclVoid' },
            { kind: 'web', label: 'Acceleo/OCL Operations Reference (Eclipse)', url: 'https://wiki.eclipse.org/Acceleo/OCL_Operations_Reference' },
          ],
        },
        { kind: 'quiz', ids: ['ch08-09', 'ch08-10'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-6',
      number: '8.6',
      title: 'Kolekce a operace nad nimi',
      blocks: [
        {
          kind: 'p',
          html:
            'Navigace přes konec s multiplicitou &gt; 1 vrací <strong>kolekci</strong>. Na kolekci se operace volají šipkou <code>-&gt;</code>, na objekt (atribut, operaci, navigaci) tečkou <code>.</code>. Typy kolekcí:',
          sources: [
            { kind: 'slide', doc: 'P07', page: 20, quote: 'Pozn.: Jedná se všechno o operace, syntaxe je tedy např. self.mySet->size()' },
            { kind: 'slide', doc: 'C07', page: 5, quote: 'Rozdíl mezi . a ->' },
          ],
        },
        {
          kind: 'table',
          head: ['Kolekce', 'Duplicity?', 'Pořadí?', 'Kdy vzniká'],
          rows: [
            ['<code>Set</code>', 'ne', 'ne', 'navigace přes asociaci (běžný konec)'],
            ['<code>OrderedSet</code>', 'ne', 'ano', 'konec s <code>{ordered}</code>'],
            ['<code>Bag</code>', 'ano', 'ne', 'výsledek <code>collect</code> nad Set'],
            ['<code>Sequence</code>', 'ano', 'ano', 'např. <code>Sequence{1, 2, 2}</code>'],
          ],
          sources: [{ kind: 'slide', doc: 'P07', page: 17 }],
        },
        { kind: 'diagram', title: 'Výřez pro kolekce', diagram: collectionModel },
        {
          kind: 'table',
          caption: 'Nejčastější operace (r = iterační proměnná)',
          head: ['Operace', 'Vrací', 'Příklad (kontext Driver)'],
          rows: [
            ['<code>select(r | podm)</code>', 'kolekci prvků, které podmínku <strong>splní</strong>', '<code>rides-&gt;select(r | r.isPaid)</code>'],
            ['<code>reject(r | podm)</code>', 'kolekci prvků, které ji <strong>nesplní</strong>', '<code>rides-&gt;reject(r | r.isPaid)</code>'],
            ['<code>collect(r | výraz)</code>', 'kolekci výsledků výrazu (Bag)', '<code>rides-&gt;collect(r | r.price)</code>'],
            ['<code>forAll(r | podm)</code>', 'Boolean: splní <strong>všechny</strong>?', '<code>rides-&gt;forAll(r | r.price &gt;= 0)</code>'],
            ['<code>exists(r | podm)</code>', 'Boolean: splní <strong>aspoň jeden</strong>?', '<code>rides-&gt;exists(r | r.distanceKm &gt; 100)</code>'],
            ['<code>any(r | podm)</code>', 'nějaký jeden prvek, který splní', '<code>rides-&gt;any(r | not r.isPaid)</code>'],
            ['<code>size()</code>', 'Integer: počet prvků', '<code>rides-&gt;size()</code>'],
            ['<code>includes(x)</code> / <code>excludes(x)</code>', 'Boolean: je / není x v kolekci?', '<code>ride.customers-&gt;includes(c)</code>'],
            ['<code>isEmpty()</code> / <code>notEmpty()</code>', 'Boolean: je kolekce prázdná?', '<code>rides-&gt;select(r | not r.isPaid)-&gt;isEmpty()</code>'],
            ['<code>sum()</code>', 'součet čísel', '<code>rides-&gt;collect(r | r.price)-&gt;sum()</code>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P07', page: 20 },
            { kind: 'slide', doc: 'P07', page: 23, quote: 'Vrátí true pokud všechny elementy splní podmínku, jinak false .' },
            { kind: 'slide', doc: 'P07', page: 24, quote: 'Vrátí kolekci se všemi elementy, které splní podmínku.' },
            { kind: 'slide', doc: 'P07', page: 25, quote: 'Vrátí kolekci obsahující výsledek aplikace výrazu na všechny elementy' },
          ],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Pravidla s kolekcemi',
          code:
            '-- zákazník smí mít nejvýš 3 nezaplacené jízdy\ncontext Customer\ninv maxUnpaid: self.rides->reject(r | r.isPaid)->size() <= 3\n\n-- do auta se vejdou zákazníci + řidič (ostrá nerovnost!)\ncontext TaxiRide\ninv capacity: self.customers->size() < self.vehicle.seats\n\n-- řidič nikdy neveze sám sebe\ncontext Driver\ninv notOwnCustomer: self.rides->forAll(r | r.customers->excludes(self))',
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'self uvnitř iterátoru',
          html:
            'Na slidech je i zápis bez proměnné: <code>Sequence{2.3, 5.2}-&gt;forAll(self &gt; 3)</code>. Tam <code>self</code> znamená <strong>iterovaný prvek</strong>, ne kontext! Když potřebuješ obojí, pojmenuj proměnnou: <code>rides-&gt;forAll(r | r.customers-&gt;excludes(self))</code>, kde <code>r</code> je jízda a <code>self</code> řidič.',
          sources: [{ kind: 'slide', doc: 'P07', page: 23, quote: 'self nyní odkazuje na jednotlivé iterované objekty' }],
        },
        {
          kind: 'interactive',
          component: 'ocl-playground',
          title: 'Vyzkoušej si select / reject / collect / forAll / exists / size',
          hint: 'Zkus předpovědět výsledek dřív, než výraz vyhodnotíš. U forAll a exists sleduj, který prvek rozhodl.',
        },
        {
          kind: 'p',
          html:
            '<strong>Automatické zplošťování.</strong> Když navigaci z kolekce zřetězíš tečkou, OCL výsledek sám zploští: <code>self.rides.customers</code> není „kolekce kolekcí“, ale jedna kolekce zákazníků. Je to zkratka za <code>collect</code>.',
          sources: [
            { kind: 'slide', doc: 'P07', page: 28, quote: 'Kolekce se umí samy zplošťovat během operací ( flatten() ):' },
            { kind: 'slide', doc: 'C08', page: 4, quote: 'nezaměňovat použití . a -> , lze ale použít automatické zplošťování s .' },
          ],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Všichni zákazníci, které řidič vezl (kontext Driver)',
          code:
            'self.rides                         -- Set(TaxiRide)\nself.rides.customers               -- zploštěno: kolekce Customer (duplicity možné)\nself.rides->collect(r | r.customers)  -- totéž zapsané explicitně\nself.rides.customers->asSet()      -- bez duplicit',
          sources: [{ kind: 'slide', doc: 'P07', page: 20, quote: 'flatten(): Set{Bag{1,2,2},Bag{2}} → Set{1,2}' }],
        },
        {
          kind: 'p',
          html:
            '<strong>allInstances()</strong> vrátí všechny existující instance třídy. Hodí se pro pravidla „napříč objekty“, typicky unikátnost.',
          sources: [{ kind: 'slide', doc: 'P07', page: 18, quote: 'třídní operace: např. OCLAny::allInstances()' }],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'Unikátní SPZ (dvě ekvivalentní varianty)',
          code:
            'context Vehicle\ninv uniquePlate:\n  Vehicle.allInstances()->forAll(v1, v2 | v1 <> v2 implies v1.plate <> v2.plate)\n\ncontext Vehicle\ninv uniquePlate2: Vehicle.allInstances()->isUnique(v | v.plate)',
          sources: [{ kind: 'slide', doc: 'P07', page: 20 }],
        },
        { kind: 'quiz', ids: ['ch08-11', 'ch08-12', 'ch08-16'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-8-7',
      number: '8.7',
      title: 'Typické chyby (shrnutí z cvičení)',
      blocks: [
        {
          kind: 'p',
          html:
            'Cvičící po aktivitě s OCL sepsali, co studenti nejčastěji kazí. Tohle si projdi před zkouškou i před odevzdáním semestrálky (tam chtějí 3 netriviální omezení podle popisu + aspoň 2 další).',
          sources: [
            { kind: 'slide', doc: 'C08', page: 4 },
            { kind: 'slide', doc: 'C07', page: 13, quote: 'OCL omezení musí mít 3 netriviální dle popisu + alespoň 2 další' },
          ],
        },
        {
          kind: 'table',
          head: ['Chyba', 'Špatně', 'Správně'],
          rows: [
            ['pre/post mimo operaci', '<code>context TaxiRide pre: …</code>', '<code>context TaxiRide::pay() pre: …</code>'],
            ['derive mimo atribut', '<code>context TaxiRide derive: end - start</code>', '<code>context TaxiRide::duration : Integer derive: end - start</code>'],
            ['záměna <code>.</code> a <code>-&gt;</code>', '<code>self.customers.size()</code>', '<code>self.customers-&gt;size()</code>'],
            ['jiná nerovnost než v textu („méně než“)', '<code>customers-&gt;size() &lt;= vehicle.seats</code>', '<code>customers-&gt;size() &lt; vehicle.seats</code>'],
            ['vymyšlená operace', '<code>rides-&gt;filter(…)</code>, <code>rides.length</code>', 'operace z Acceleo OCL: <code>select</code>, <code>size()</code>'],
            ['zbytečný if', '<code>if A then B else true endif</code>', '<code>A implies B</code>'],
          ],
          sources: [
            { kind: 'slide', doc: 'C08', page: 4, quote: 'omezení musí odpovídat textovému popisu (např. ostré nerovnosti)' },
            { kind: 'slide', doc: 'C08', page: 4, quote: 'operace používat v souladu s implementací: Acceleo OCL nebo jinou odkázanou' },
            { kind: 'slide', doc: 'C07', page: 11, quote: 'Nelze si ale vymýšlet vlastní operace a typy/kolekce' },
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>Směr dědičnosti a chybějící <code>{complete}</code>.</strong> Když pravidlo píšeš z nadtřídy, ne každá instance nadtřídy je instancí podtřídy. Musíš <strong>filtrovat</strong> (na cvičení: ne všechny <em>transportables</em> jsou <em>Passenger</em>). V našem modelu: ne každá Person je Driver.',
          sources: [{ kind: 'slide', doc: 'C08', page: 4, quote: 'pozor na směry dědičností a chybějící {complete} , nutno filtrovat' }],
        },
        { kind: 'diagram', title: 'Role Driver a Customer bez {complete}', diagram: filterModel },
        {
          kind: 'code',
          lang: 'ocl',
          caption: '„Každý řidič má řidičský průkaz“',
          code:
            '-- ŠPATNĚ: Person nemá licenseNo a ne každá Person je Driver\ncontext Person\ninv: self.licenseNo <> null\n\n-- OK, ale zbytečně složitě: filtrování přes oclIsKindOf\ncontext Person\ninv: self.oclIsKindOf(Driver) implies not self.oclAsType(Driver).licenseNo.oclIsUndefined()\n\n-- NEJLÉPE: správný kontext\ncontext Driver\ninv hasLicense: not self.licenseNo.oclIsUndefined()',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Datum a rovnost objektů',
          html:
            'Pro práci s <code>Date</code> a porovnávání objektů můžeš vyjít z toho, co znáš z Javy (např. operace <code>isBefore</code> / <code>isAfter</code> na utility třídě Date ze slidů). Hlavně buď konzistentní a uveď, z jaké reference vycházíš.',
          sources: [
            { kind: 'slide', doc: 'C08', page: 4, quote: 'pro práci s Date a rovností objektů můžete použít zkušenosti z Javy' },
            { kind: 'slide', doc: 'P07', page: 10 },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'OCL na jednu obrazovku',
          html:
            '<ol><li>Vždy <code>context</code>: třída (inv, def), operace (pre, post), atribut (init, derive).</li><li><code>self</code> = kontextový objekt, jméno omezení je nepovinné, ale doporučené.</li><li><code>.</code> pro objekt, <code>-&gt;</code> pro kolekci; řetězení tečkou zplošťuje.</li><li><code>result</code> a <code>@pre</code> jen v post; <code>=</code> je porovnání.</li><li>Podmínku piš přes <code>implies</code>, ne přes if.</li><li>Do OCL jen to, co nejde vyjádřit v modelu.</li></ol>',
        },
        { kind: 'quiz', ids: ['ch08-13', 'ch08-14', 'ch08-15'] },
      ],
    },
  ],
}
