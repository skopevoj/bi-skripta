import type { Diagram, Question } from '../types'

// Výřezy modelu taxislužby (stejný model jako v kapitole 8).
const people: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 1.25, y: 0, attrs: ['name: String', 'age: Integer'] },
    { id: 'driver', name: 'Driver', st: 'role', x: 0, y: 1.5, attrs: ['rating: Real'] },
    { id: 'ride', name: 'TaxiRide', st: 'relator', x: 1.25, y: 1.5, attrs: ['start: Integer', 'end: Integer', 'price: Real'] },
    { id: 'customer', name: 'Customer', st: 'role', x: 2.5, y: 1.5, attrs: ['credit: Real'] },
  ],
  gens: [{ general: 'person', specifics: ['driver', 'customer'] }],
  assocs: [
    { from: 'ride', to: 'driver', st: 'mediation', fromMult: '1..*', toMult: '1', fromRole: 'rides', toRole: 'driver' },
    { from: 'ride', to: 'customer', st: 'mediation', fromMult: '1..*', toMult: '1..*', fromRole: 'rides', toRole: 'customers' },
  ],
}

const rides: Diagram = {
  classes: [
    { id: 'driver', name: 'Driver', st: 'role', x: 0, y: 0, attrs: ['rating: Real'] },
    { id: 'ride', name: 'TaxiRide', st: 'relator', x: 1.3, y: 0, attrs: ['distanceKm: Real', 'price: Real', 'isPaid: Boolean'] },
    { id: 'customer', name: 'Customer', st: 'role', x: 2.6, y: 0, attrs: ['credit: Real'] },
    { id: 'vehicle', name: 'Vehicle', st: 'kind', x: 1.3, y: 1.6, attrs: ['plate: String', 'seats: Integer'] },
  ],
  assocs: [
    { from: 'ride', to: 'driver', st: 'mediation', fromMult: '1..*', toMult: '1', fromRole: 'rides', toRole: 'driver' },
    { from: 'ride', to: 'customer', st: 'mediation', fromMult: '1..*', toMult: '1..*', fromRole: 'rides', toRole: 'customers' },
    { from: 'ride', to: 'vehicle', st: 'mediation', fromMult: '1..*', toMult: '1', fromRole: 'rides', toRole: 'vehicle' },
  ],
}

const vehicles: Diagram = {
  classes: [
    { id: 'vehicle', name: 'Vehicle', st: 'kind', x: 1, y: 0, attrs: ['plate: String', 'seats: Integer'] },
    { id: 'car', name: 'PersonalCar', st: 'subkind', x: 0, y: 1.25 },
    { id: 'van', name: 'Van', st: 'subkind', x: 2, y: 1.25 },
  ],
  gens: [{ general: 'vehicle', specifics: ['car', 'van'], set: { disjoint: true, complete: true } }],
}

const EXAM = 'Zkouška BI-KOM (FIT Wiki, kom_zkouška_zabarveno.png)'

export const ch08: Question[] = [
  // ---------------------------------------------------------------- 8.1
  {
    id: 'ch08-01',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 47`] },
    prompt: 'Vyberte pravdivá tvrzení o OCL.',
    options: [
      'Specifikace v OCL umožňují měnit instance modelu.',
      'OCL je programovací jazyk pro generování SW kódu z modelu.',
      'Specifikace v OCL nemohou měnit instance ani model, jen se dotazovat.',
      'OCL je deklarativní jazyk pro specifikace omezení.',
      'OCL je imperativní jazyk pro specifikace omezení.',
      'Specifikace v OCL umožňují měnit samotný model a jeho instance.',
    ],
    correct: [2, 3],
    explanation:
      'OCL je <strong>deklarativní</strong> (množina definic) a <strong>pouze dotazovací</strong>: nemá vedlejší efekty, nemůže měnit model ani instance (a, f špatně). Není imperativní (e) ani jazykem pro generování kódu (b), slouží k vyjádření omezení.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-47.png', label: 'Zkouška (FIT Wiki), úloha 47' },
      { kind: 'slide', doc: 'P07', page: 6, quote: 'Deklarativní jazyk = množina definic' },
      { kind: 'slide', doc: 'P07', page: 6, quote: 'Pouze dotazovací = nemůže měnit model a jeho instance (side-effect free)' },
    ],
  },
  {
    id: 'ch08-02',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 121`] },
    prompt: 'Vyberte pravdivá tvrzení o OCL.',
    options: [
      'OCL lze používat v kombinaci s různými jazyky specifikovanými OMG.',
      'Základem OCL je tvrzení neboli assertion, které má pravdivostní hodnotu ověřující, že model neobsahuje syntaktické chyby dle specifikace OntoUML nebo UML.',
      'OCL lze používat pouze s jednoduchými UML modely.',
      'Základem OCL je vyhodnocení neboli evaluation, které má číselnou hodnotu představující procentuální kvalitu zadaného modelu.',
      'OCL lze používat pouze s OntoUML modely.',
      'Základem OCL je tvrzení neboli assertion, které má pravdivostní hodnotu ověřující, že instance modelu je validní a že model je well-formed.',
    ],
    correct: [0, 5],
    explanation:
      'OCL se používá i v dalších jazycích OMG (např. QVT), a). Základem je <strong>assertion</strong> s hodnotou true/false, která kontroluje, že model je well-formed a instance validní, f). Nejde o kontrolu syntaxe notace (b) ani o číselné hodnocení (d). OCL funguje pro UML modely i metamodely a díky profilu i pro OntoUML, ne „pouze“ pro jedno z nich (c, e).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-121.png', label: 'Zkouška (FIT Wiki), úloha 121' },
      { kind: 'slide', doc: 'P07', page: 7, quote: 'Slouží pro kontrolu, že model je well-formed (dobře postavený).' },
      { kind: 'slide', doc: 'P07', page: 7, quote: 'Používán v dalších OMG jazycích (např. QVT).' },
    ],
  },
  // ---------------------------------------------------------------- 8.2
  {
    id: 'ch08-03',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 79`] },
    prompt: 'Vyberte pravdivá tvrzení o OCL.',
    options: [
      'Pro přístup k objektu dle daného kontextu se používá klíčové slovo <strong>this</strong>.',
      'Název OCL omezení je nepovinný.',
      'Pro přístup k objektu dle daného kontextu se používá klíčové slovo <strong>it</strong>.',
      'Každé OCL omezení je specifikované v rámci nějakého kontextu (třída, metoda, atribut).',
      'K OCL omezením je možné specifikovat kontext, ale není to nutné.',
      'Každé omezení musí být unikátně pojmenované.',
      'Pro přístup k objektu dle daného kontextu se používá klíčové slovo <strong>self</strong>.',
    ],
    correct: [1, 3, 6],
    explanation:
      'Kontextový objekt je <code>self</code> (ne <code>this</code> ani <code>it</code>). Kontext je <strong>povinný</strong>: každé omezení se k něčemu vztahuje (e špatně). Jméno (<code>inv jmeno:</code>) je volitelné, doporučené kvůli identifikaci, ale není povinné ani nemusí být unikátní (f).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-79.png', label: 'Zkouška (FIT Wiki), úloha 79' },
      { kind: 'slide', doc: 'P07', page: 9, quote: 'Omezení se vždy vztahuje k určitému context (např. třída, metoda, atribut).' },
      { kind: 'slide', doc: 'P07', page: 11 },
      { kind: 'slide', doc: 'P07', page: 12, quote: 'self ukazuje na objekt, ze kterého je constraint vyhodnocován, lze implicitně:' },
    ],
  },
  {
    id: 'ch08-04',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'P07 str. 11–12, 19; C07 str. 5',
      why: 'Na zkoušce bývá OCL ukázané v kódu: musíš poznat správnou syntaxi invariantu a navigaci.',
    },
    prompt: 'Které zápisy jsou <strong>správné invarianty</strong> nad zobrazeným modelem?',
    diagram: people,
    options: [
      '<code>context Driver inv: self.age &gt;= 18</code>',
      '<code>context Driver inv adult: age &gt;= 18</code>',
      '<code>context Driver::age inv: self &gt;= 18</code>',
      '<code>inv: Driver.age &gt;= 18</code>',
      '<code>context TaxiRide inv: self.end &gt; self.start</code>',
      '<code>context TaxiRide inv: self.customers.size() &gt;= 1</code>',
    ],
    correct: [0, 1, 4],
    explanation:
      'a), b), e) jsou v pořádku: kontext je třída, <code>self</code> lze vynechat, jméno je volitelné, <code>age</code> Driver dědí z Person. c) invariant patří ke třídě, kontext <code>Třída::atribut</code> se používá pro init/derive. d) chybí <code>context</code>. f) <code>customers</code> je kolekce, takže <code>-&gt;size()</code>, ne <code>.size()</code> (a stejně by to jen opakovalo multiplicitu 1..*).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P07', page: 12 },
      { kind: 'slide', doc: 'P07', page: 19 },
      { kind: 'slide', doc: 'C07', page: 5, quote: 'Implicitní self dle kontextu (je-li jednoznačné)' },
    ],
  },
  // ---------------------------------------------------------------- 8.3
  {
    id: 'ch08-05',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'P07 str. 15 (start@pre), C07 str. 7',
      why: 'Význam @pre a toho, že post není přiřazení, je klasický chyták.',
    },
    prompt: 'Co vyjadřuje následující omezení?',
    code: 'context Customer::topUp(amount : Real)\npre: amount > 0\npost: self.credit = self.credit@pre + amount',
    lang: 'ocl',
    options: [
      'Po provedení operace topUp je kredit zákazníka o <code>amount</code> vyšší, než byl před jejím zavoláním.',
      'Operace topUp přiřadí do atributu credit hodnotu <code>credit + amount</code>.',
      '<code>credit@pre</code> je výchozí hodnota kreditu při vytvoření zákazníka.',
      'Omezení je neplatné, protože <code>@pre</code> lze použít jen v precondition.',
      'Kredit zákazníka musí být vždy (i mezi voláními) roven součtu všech dobití.',
    ],
    correct: [0],
    explanation:
      '<code>x@pre</code> = hodnota <code>x</code> <em>před</em> vykonáním operace a používá se <strong>pouze v postcondition</strong> (d špatně). Postcondition nic nepřiřazuje, jen říká, co musí po operaci platit; změnu provede implementace (b). Výchozí hodnotu při vzniku objektu by určoval <code>init</code> (c). Pravidlo „vždy“ by byl invariant (e).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P07', page: 15, quote: 'start@pre = hodnota start před vykonáním operace.' },
      { kind: 'slide', doc: 'C07', page: 7, quote: '@pre odkazuje na hodnotu před voláním' },
    ],
  },
  {
    id: 'ch08-06',
    kind: 'tf',
    topic: 'ocl',
    origin: { type: 'real', seen: ['Přednáška 7, Časté otázky'] },
    prompt: 'Když v postcondition operace <code>Meeting::confirm()</code> napíšu <code>isConfirmed = true</code>, provede se tím potvrzení schůzky.',
    code: 'context Meeting::confirm()\npost: self.isConfirmed = true',
    lang: 'ocl',
    answer: false,
    explanation:
      'Nepravda. OCL nemění stav. Postcondition je <strong>smluvený výsledek</strong>: říká, co musí platit po provedení operace. Potvrzení musí udělat implementace operace. <code>=</code> je v OCL porovnání, ne přiřazení.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P07', page: 37, quote: 'Je to smluvený výsledek, nikoli příkaz k přiřazení.' },
      { kind: 'slide', doc: 'C07', page: 7, quote: 'result představuje výsledek operace, = není přiřazení' },
    ],
  },
  // ---------------------------------------------------------------- 8.4
  {
    id: 'ch08-07',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 122 (v Moodle přiřazovací otázka, zde převedena na výběr)`] },
    prompt: 'Správně přiřaďte typy omezení v OCL. Která přiřazení <em>popis → typ omezení</em> jsou správná?',
    options: [
      'Musí platit pro nově vytvořené objekty → <code>init</code>',
      'Definice odvozených atributů a vztahů → <code>derive</code>',
      'Musí být splněno po vykonání operace → <code>postcondition</code>',
      'Musí být vždy splněno → <code>invariant</code>',
      'Musí být splněno před vykonáním operace → <code>precondition</code>',
      'Musí platit pro nově vytvořené objekty → <code>invariant</code>',
      'Musí být splněno před vykonáním operace → <code>init</code>',
      'Definice odvozených atributů a vztahů → <code>let</code>',
    ],
    correct: [0, 1, 2, 3, 4],
    explanation:
      '<code>init</code> = hodnota při vytvoření objektu (pouze tehdy), <code>derive</code> = odvozený atribut/asociace, <code>pre</code>/<code>post</code> = před/po operaci, <code>inv</code> = vždy. Invariant neplatí „jen pro nové objekty“, ale stále (f). <code>init</code> nemá s operacemi nic společného (g). <code>let</code> je jen lokální proměnná v jednom výrazu (h).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-122.png', label: 'Zkouška (FIT Wiki), úloha 122' },
      { kind: 'slide', doc: 'P07', page: 30, quote: 'Specifikace hodnoty, která musí platit při vytvoření objektu (pouze).' },
      { kind: 'slide', doc: 'P07', page: 29 },
      { kind: 'slide', doc: 'P07', page: 13 },
      { kind: 'slide', doc: 'P07', page: 11, quote: 'Invariant je constraint, který má být pravdivý během celého života modelu.' },
    ],
  },
  {
    id: 'ch08-08',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 69`] },
    prompt: 'Vyberte pravdivá tvrzení o OCL.',
    options: [
      'V OCL lze vytvářet proměnné a pojmenované výrazy, v rámci kontextu lze definovat nový atribut nebo operaci pomocí <strong>def</strong>, pak je lze používat ve vícero omezeních.',
      'Omezení a další deklarace v OCL nelze strukturovat, vše musí být v rámci jedné specifikace přímo (jediný soubor).',
      'V OCL lze vytvářet proměnné a pojmenované výrazy, v rámci omezení pomocí konstrukce <strong>let-in</strong>, tyto názvy jsou pak dostupné pouze v daném omezení.',
      'V OCL nelze vytvářet proměnné a pojmenované výrazy, je nutné vždy výrazy psát přímo v omezení.',
      'Omezení a další deklarace v OCL lze strukturovat, slouží k tomu rozdělení do balíčků pomocí <strong>package</strong> a <strong>endpackage</strong>.',
      'V OCL lze vytvářet proměnné a pojmenované výrazy, v rámci kontextu lze definovat nový atribut nebo operaci pomocí <strong>let-in</strong>, pak je lze používat ve vícero omezeních.',
      'V OCL lze vytvářet proměnné a pojmenované výrazy, v rámci omezení pomocí konstrukce <strong>def</strong>, tyto názvy jsou pak dostupné pouze v daném omezení.',
    ],
    correct: [0, 2, 4],
    explanation:
      'Pozor na prohozené dvojice: <code>def</code> přidá do kontextu nový atribut/operaci <strong>pro opakované použití</strong> ve více omezeních. <code>let … in</code> je lokální (neměnná) proměnná <strong>jen v jednom</strong> omezení. f) a g) mají tyto významy prohozené. Strukturovat omezení lze balíčky <code>package … endpackage</code> (b, d špatně).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-69.png', label: 'Zkouška (FIT Wiki), úloha 69' },
      { kind: 'slide', doc: 'P07', page: 31, quote: 'Definice lokální proměnné (neměnná, immutable)' },
      { kind: 'slide', doc: 'P07', page: 32, quote: 'Přidávání nových atributů a operací do modelu pro opakované použití' },
      { kind: 'slide', doc: 'P07', page: 34 },
    ],
  },
  // ---------------------------------------------------------------- 8.5
  {
    id: 'ch08-09',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'C07 str. 10 (implies vs if then else)',
      why: 'Cvičící zdůrazňují, že if-then-else je v OCL často zbytečné; ekvivalence je snadno testovatelná.',
    },
    prompt: 'Které výrazy jsou ekvivalentní výrazu <code>if A then B else true endif</code>?',
    options: [
      '<code>A implies B</code>',
      '<code>A and B</code>',
      '<code>A or B</code>',
      '<code>B implies A</code>',
      '<code>not A or B</code>',
      '<code>if A then B endif</code>',
    ],
    correct: [0, 4],
    explanation:
      'Když A platí, výsledkem je B; když neplatí, výsledek je true. Přesně tak se chová <code>A implies B</code>, logicky totéž je <code>not A or B</code>. <code>A and B</code> by pro nepravdivé A dalo false. f) není platný OCL: if-then-else je výraz a musí mít <strong>obě větve</strong>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C07', page: 10, quote: 'if A then B else true je to samé jako A implies B' },
      { kind: 'slide', doc: 'C07', page: 10, quote: 'OCL není imperativní programování, if then else je výraz, kde musí vždy být obě' },
    ],
  },
  {
    id: 'ch08-10',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'P07 str. 26 (oclIsTypeOf … implies …)',
      why: 'Ověřuje pochopení implies: pro objekty, na které se podmínka nevztahuje, je invariant splněný.',
    },
    prompt: 'Které vozidlo <strong>porušuje</strong> invariant?',
    diagram: vehicles,
    code: 'context Vehicle\ninv vanSeats: self.oclIsKindOf(Van) implies self.seats >= 7',
    lang: 'ocl',
    options: [
      'PersonalCar se 4 místy',
      'PersonalCar se 2 místy',
      'Van s 9 místy',
      'Van s 5 místy',
      'Van se 7 místy',
    ],
    correct: [3],
    explanation:
      'Pro osobní auta je levá strana <code>implies</code> nepravdivá, takže invariant platí bez ohledu na počet míst. Pro dodávku musí platit <code>seats &gt;= 7</code> (neostrá nerovnost, 7 tedy stačí). Porušuje ho jen Van s 5 místy.',
    verified: 'reasoning',
    sources: [{ kind: 'slide', doc: 'P07', page: 26 }],
  },
  // ---------------------------------------------------------------- 8.6
  {
    id: 'ch08-11',
    kind: 'mc',
    topic: 'ocl',
    origin: { type: 'real', seen: [`${EXAM}, úloha 86 (v Moodle přiřazovací otázka, zde převedena na výběr)`] },
    prompt: 'Správně přiřaďte běžné operace s kolekcemi v OCL. Která přiřazení <em>popis → operace</em> jsou správná?',
    options: [
      'Zjištění, zda některý prvek v kolekci splňuje podmínku → <code>exists</code>',
      'Výběr prvků z kolekce, které splňují zadanou podmínku → <code>select</code>',
      'Výběr takového prvku z kolekce, který splňuje podmínku → <code>any</code>',
      'Zjištění, zda všechny prvky v kolekci splňují podmínku → <code>forAll</code>',
      'Transformace aplikováním výrazu na každý prvek kolekce → <code>collect</code>',
      'Výběr prvků z kolekce, které splňují zadanou podmínku → <code>reject</code>',
      'Zjištění, zda všechny prvky v kolekci splňují podmínku → <code>exists</code>',
      'Transformace aplikováním výrazu na každý prvek kolekce → <code>select</code>',
    ],
    correct: [0, 1, 2, 3, 4],
    explanation:
      '<code>select</code> vybere prvky splňující podmínku, <code>reject</code> naopak ty, které ji <em>nesplňují</em>. <code>any</code> vrátí jeden vyhovující prvek. <code>exists</code> = aspoň jeden, <code>forAll</code> = všechny. <code>collect</code> aplikuje výraz na každý prvek a vrátí kolekci výsledků.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-86.png', label: 'Zkouška (FIT Wiki), úloha 86' },
      { kind: 'slide', doc: 'P07', page: 20 },
      { kind: 'slide', doc: 'P07', page: 23, quote: 'Vrátí true pokud všechny elementy splní podmínku, jinak false .' },
      { kind: 'slide', doc: 'P07', page: 24, quote: 'Vrátí kolekci se všemi elementy, které splní podmínku.' },
      { kind: 'slide', doc: 'P07', page: 25, quote: 'Vrátí kolekci obsahující výsledek aplikace výrazu na všechny elementy' },
    ],
  },
  {
    id: 'ch08-12',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'P07 str. 24–27 (select, collect, size)',
      why: 'Procvičuje řetězení operací nad kolekcí na konkrétních datech.',
    },
    prompt:
      'Řidič má tři jízdy: cena 200 (zaplacená), 350 (nezaplacená), 120 (nezaplacená). Co vrátí výraz (kontext Driver)?',
    diagram: rides,
    code: 'self.rides->reject(r | r.isPaid)->collect(r | r.price)->sum()',
    lang: 'ocl',
    options: ['470', '200', '670', '2', '320'],
    correct: [0],
    explanation:
      '<code>reject(r | r.isPaid)</code> vyhodí zaplacené jízdy, zbudou 350 a 120. <code>collect</code> z nich vezme ceny a <code>sum()</code> je sečte: 470. Číslo 2 by vrátilo <code>-&gt;size()</code>, 200 by byl výsledek se <code>select</code>.',
    verified: 'reasoning',
    sources: [
      { kind: 'slide', doc: 'P07', page: 20 },
      { kind: 'slide', doc: 'C07', page: 8 },
    ],
  },
  {
    id: 'ch08-16',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'P07 str. 18 (OCLAny::allInstances()), P07 str. 20 (isUnique)',
      why: 'allInstances a unikátnost jsou typické „netriviální“ omezení ze semestrálky.',
    },
    prompt: 'Co vyjadřuje tento invariant?',
    code: 'context Vehicle\ninv: Vehicle.allInstances()->forAll(v1, v2 | v1 <> v2 implies v1.plate <> v2.plate)',
    lang: 'ocl',
    options: [
      'Žádná dvě různá vozidla nemají stejnou SPZ.',
      'Každé vozidlo má vyplněnou SPZ.',
      'Všechna vozidla mají stejnou SPZ.',
      'V systému mohou existovat nejvýše dvě vozidla.',
      'Totéž lze zapsat jako <code>Vehicle.allInstances()-&gt;isUnique(v | v.plate)</code>.',
    ],
    correct: [0, 4],
    explanation:
      '<code>allInstances()</code> vrátí všechna vozidla. Pro každou dvojici <em>různých</em> vozidel musí být SPZ různé, tedy SPZ je unikátní (stejně jako <code>isUnique</code>). Neříká nic o tom, že SPZ musí být vyplněná (b), ani o počtu vozidel (d).',
    verified: 'reasoning',
    sources: [
      { kind: 'slide', doc: 'P07', page: 18, quote: 'třídní operace: např. OCLAny::allInstances()' },
      { kind: 'slide', doc: 'P07', page: 20 },
    ],
  },
  // ---------------------------------------------------------------- 8.7
  {
    id: 'ch08-13',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'C08 str. 4 (nezaměňovat . a ->), P07 str. 19',
      why: 'Záměna . a -> je podle cvičících jedna z nejčastějších chyb.',
    },
    prompt: 'Kontext je <code>TaxiRide</code>. Které výrazy jsou zapsané <strong>správně</strong>?',
    diagram: rides,
    options: [
      '<code>self.driver.rating</code>',
      '<code>self.customers-&gt;size()</code>',
      '<code>self.customers.size()</code>',
      '<code>self.customers-&gt;forAll(c | c.credit &gt;= 0)</code>',
      '<code>self.driver-&gt;rating</code>',
      '<code>self.vehicle.seats</code>',
    ],
    correct: [0, 1, 3, 5],
    explanation:
      '<code>driver</code> a <code>vehicle</code> mají multiplicitu 1, jsou to objekty, takže atribut přes tečku (a, f). <code>customers</code> je kolekce (1..*), operace kolekce se volají šipkou (b, d). c) volá kolekční operaci tečkou. e) šipka se používá jen pro operace kolekcí, ne pro atribut objektu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P07', page: 19 },
      { kind: 'slide', doc: 'C08', page: 4, quote: 'nezaměňovat použití . a -> , lze ale použít automatické zplošťování s .' },
    ],
  },
  {
    id: 'ch08-14',
    kind: 'mc',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'C08 str. 4 (Shrnutí aktivity z minula), C07 str. 10',
      why: 'Shrnuje chyby, které cvičící vytkli v aktivitě s OCL.',
    },
    prompt: 'Která omezení jsou zapsaná <strong>chybně</strong>?',
    options: [
      '<code>context TaxiRide pre: not self.isPaid</code>',
      '<code>context TaxiRide derive: self.end - self.start</code>',
      '<code>context TaxiRide::duration : Integer derive: self.end - self.start</code>',
      '<code>context TaxiRide::pay() post: self.isPaid = true</code>',
      '<code>context TaxiRide::isPaid : Boolean init: false</code>',
      '<code>context TaxiRide inv: if self.isPaid then self.price &gt; 0 endif</code>',
    ],
    correct: [0, 1, 5],
    explanation:
      'a) <code>pre</code> lze jen v kontextu <strong>operace</strong>. b) <code>derive</code> musí být v kontextu <strong>atributu</strong> (<code>TaxiRide::duration : Integer</code>), jako v c). f) if-then-else musí mít obě větve; správně <code>self.isPaid implies self.price &gt; 0</code>. d) a e) jsou v pořádku.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C08', page: 4, quote: 'pre a post lze používat jen v kontextu metod' },
      { kind: 'slide', doc: 'C08', page: 4, quote: 'omezení derive musí být v kontextu atributu' },
      { kind: 'slide', doc: 'C07', page: 10 },
    ],
  },
  {
    id: 'ch08-15',
    kind: 'tf',
    topic: 'ocl',
    origin: {
      type: 'original',
      inspiredBy: 'C08 str. 4 (směry dědičností, chybějící {complete}, filtrování)',
      why: 'Typická chyba: pravidlo pro podtřídu napsané v kontextu nadtřídy bez filtrování.',
    },
    prompt:
      'V modelu je «kind» Person s rolemi Driver a Customer (generalizace bez {complete}). Pravidlo „každý řidič je plnoletý“ správně vyjadřuje invariant <code>context Person inv: self.age &gt;= 18</code>.',
    diagram: people,
    answer: false,
    explanation:
      'Nepravda. Invariant by platil pro <strong>všechny</strong> osoby, i pro zákazníky a osoby bez role, a zakázal by třeba nezletilého zákazníka. Správně se zvolí kontext podtřídy, <code>context Driver inv: self.age &gt;= 18</code>, případně se filtruje přes <code>oclIsKindOf(Driver) implies …</code>.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'C08', page: 4, quote: 'pozor na směry dědičností a chybějící {complete} , nutno filtrovat' }],
  },
]
