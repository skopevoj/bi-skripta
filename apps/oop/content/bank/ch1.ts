import type { Question } from '../types'

export const ch1: Question[] = [
  {
    id: 'ch1-01',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 42 (Symptoms of Rotting Design)',
      why: 'Procvičí rozlišení pěti symptomů hnijícího designu podle popisu situace.',
    },
    prompt:
      'Po každé drobné úpravě v modulu plateb se rozbije něco v modulu, který s platbami vůbec nesouvisí. Který symptom hnijícího designu to je?',
    options: ['Rigidity', 'Fragility', 'Immobility', 'High design viscosity', 'High environment viscosity'],
    correct: [1],
    explanation:
      '<strong>Fragility</strong> = software se při každé změně rozbije na mnoha místech, často v oblastech bez koncepční souvislosti se změnou. <br><em>Rigidity</em> je něco jiného: změna je těžká, protože vyvolá kaskádu dalších <em>nutných</em> změn v závislých modulech (nic se nerozbije, jen musíš hodně upravovat).',
    verified: 'slides',
    sources: [
      {
        kind: 'slide',
        doc: 'L1',
        page: 42,
        quote: 'the tendency of the software to break in many places every time it is changed',
      },
    ],
  },
  {
    id: 'ch1-02',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 33, 37 a 93 (coupling, cena decouplingu, obrácení závislostí)',
      why: 'Ověří, že víš, co coupling znamená a že oddělování kódu není zadarmo.',
    },
    prompt: 'Která tvrzení o couplingu odpovídají přednášce? Označ všechna správná.',
    options: [
      'Dva kusy kódu jsou coupled, když jeden nepochopíš bez pochopení druhého.',
      'Čím menší coupling, tím méně se nutná změna šíří do zbytku kódu.',
      'Decoupling je zadarmo: každá nová vrstva abstrakce kód jen zlepší.',
      'Polymorfismus (závislost na rozhraní) umožňuje obrátit směr závislosti mezi moduly.',
      'Cílem je nízká cohesion a vysoký coupling.',
    ],
    correct: [0, 1, 3],
    explanation:
      'Definice couplingu (Nystrom): kód je coupled, když nejde pochopit jeden kus bez druhého. Méně couplingu = změna se méně šíří. <br>Decoupling má <strong>cenu</strong>: abstrakce je spekulace na budoucí flexibilitu, vrstvy stojí výkon a organizaci je třeba udržovat. <br>Modul M může záviset na rozhraní, které N implementuje → závislost M → N zmizí. <br>Cíl je naopak <strong>vysoká cohesion, nízký coupling</strong>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 33, quote: 'understand one without understanding the other.' },
      { kind: 'slide', doc: 'L1', page: 37, quote: 'it is essentially a speculation that you will need the' },
      { kind: 'slide', doc: 'L1', page: 93, quote: 'Polymorphism which allows us to reverse the dependencies!' },
      { kind: 'slide', doc: 'L5', page: 25, quote: 'Aim at high cohesion and low coupling' },
    ],
  },
  {
    id: 'ch1-03',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 42 (High design viscosity)',
      why: 'Druhý symptom, který se plete s rigidity – rozhoduje, jestli je těžká změna sama, nebo jen ta správná.',
    },
    prompt:
      'Víš, jak by měla vypadat čistá úprava zachovávající návrh, ale je o hodně pracnější než rychlý hack přes <code>if</code> na jednom místě. Který symptom to je?',
    options: ['Rigidity', 'Fragility', 'Immobility', 'High design viscosity', 'High environment viscosity'],
    correct: [3],
    explanation:
      '<strong>High design viscosity</strong>: metody zachovávající návrh jsou těžší než hacky – špatnou věc je snadné udělat, správnou těžké. <br><em>Environment viscosity</em> je pomalé prostředí (dlouhá kompilace), <em>immobility</em> je neschopnost kód znovu použít.',
    verified: 'slides',
    sources: [
      {
        kind: 'slide',
        doc: 'L1',
        page: 42,
        quote: 'it is easy to do the wrong thing, but hard to do the right thing',
      },
    ],
  },
  {
    id: 'ch1-04',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 70 a 75 (What we never used / What makes a language object-oriented?)',
      why: 'Odliší podstatné vlastnosti OOP od toho, co je jen pohodlí konkrétního jazyka.',
    },
    prompt:
      'Které z následujících položek patří mezi pět vlastností, které podle přednášky dělají jazyk objektově orientovaným? Označ všechny.',
    options: [
      'Multiple representations',
      'Encapsulation',
      'Třídy použitelné jako typy',
      'Subtyping',
      'Inheritance',
      'Open recursion',
      'Mutable state',
    ],
    correct: [0, 1, 3, 4, 5],
    explanation:
      'Pětice z přednášky: <strong>multiple representations</strong> (kód vybírá objekt, ne místo volání), <strong>encapsulation</strong>, <strong>subtyping</strong>, <strong>inheritance</strong>, <strong>open recursion</strong> (self se váže až při stavbě objektu). <br>Třída jako typ, <code>new</code>, mutable state ani dispatch table mezi podstatné věci nepatří – přednáška je výslovně uvádí jako „co jsme nikdy nepotřebovali“.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 75 },
      { kind: 'slide', doc: 'L1', page: 70, quote: 'a record of closures, plus a fixed point for self.' },
    ],
  },
  {
    id: 'ch1-05',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 74 (An object is a value whose entire public surface is a set of procedures)',
      why: 'Procvičí minimální definici objektu, která nepotřebuje třídy ani typový systém.',
    },
    prompt: 'Co je objekt v minimálním smyslu, jak ho definuje přednáška? Označ všechna správná tvrzení.',
    options: [
      'Hodnota, jejíž celé veřejné rozhraní tvoří množina procedur.',
      'Záznam (record) funkcí, kde se odkaz na sebe (self) zajistí pevným bodem.',
      'Nutně instance nějaké třídy vytvořená pomocí <code>new</code>.',
      'Něco, co bez statického typového systému nemůže existovat.',
      'Struktura, jejíž pole může kdokoli přímo číst a měnit.',
    ],
    correct: [0, 1],
    explanation:
      'Objekt = hodnota, jejíž veřejné rozhraní jsou jen procedury. Nic dalšího není potřeba: žádná třída, dědičnost ani typový systém – stačí first-class funkce. Po odstranění všeho nepodstatného zbude „record of closures plus fixed point for self“. <br>Veřejně měnitelná pole jsou opak zapouzdření.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 74, quote: 'Objects hide with procedural abstraction, not type abstraction.' },
      { kind: 'slide', doc: 'L1', page: 74, quote: 'They need no static type system at all' },
      { kind: 'slide', doc: 'L1', page: 70, quote: 'a record of closures, plus a fixed point for self.' },
    ],
  },
  {
    id: 'ch1-06',
    kind: 'output',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 83 (Open recursion in action, InstrCounter) a sample midterm otázka 7',
      why: 'Ukáže open recursion v praxi: zděděná metoda volá přes self přepsanou verzi – přesně to, co se počítá v „co to vypíše“.',
    },
    prompt: 'Co program vypíše?',
    code: `class Counter:
  protected var x = 0
  def get: Int = x
  def set(i: Int): Unit = x = i
  def inc(): Unit = set(x + 1)

class Doubling extends Counter:
  override def set(i: Int): Unit = super.set(i * 2)

@main def run() =
  val c: Counter = Doubling()
  c.inc()
  c.inc()
  println(c.get)`,
    answer: '6',
    explanation:
      '<code>inc</code> je zděděná z <code>Counter</code>, ale volá <code>set</code> na <code>this</code> – a <code>this</code> je objekt typu <code>Doubling</code> (dynamic dispatch / open recursion). <br>1. <code>inc()</code>: x = 0 → <code>set(1)</code> → Doubling.set → <code>super.set(2)</code> → x = 2. <br>2. <code>inc()</code>: <code>set(3)</code> → <code>super.set(6)</code> → x = 6. <br>Statický typ <code>Counter</code> nehraje roli, rozhoduje runtime typ objektu.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L1', page: 83, quote: 'it makes to set lands on the overriding version.' },
    ],
  },
  {
    id: 'ch1-07',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 84–86 (Add an operation / Add a representation / The extensibility problem)',
      why: 'Drilluje hlavní trade-off ADT vs. objekty: co je levné přidat v kterém stylu.',
    },
    prompt:
      'Do knihovny celočíselných množin chceš přidat novou <em>reprezentaci</em> „všechna sudá čísla“. Která tvrzení platí? Označ všechna správná.',
    options: [
      'U ADT (C, <code>set.h</code>/<code>set.c</code>) musíš do reprezentace přidat tag a do každé operace novou větev.',
      'U objektů stačí napsat jednu novou hodnotu implementující rozhraní, nic existujícího se nemění.',
      'U ADT stačí přidat jednu novou funkci, nic jiného se nemění.',
      'U objektů musíš upravit všechny existující implementace rozhraní.',
    ],
    correct: [0, 1],
    explanation:
      'Představ si matici: řádky = reprezentace, sloupce = operace. <strong>Objekt</strong> seskupuje kód po řádcích → nová reprezentace = nový řádek, levné. <strong>ADT</strong> seskupuje po sloupcích → nová reprezentace protne všechny operace (a <code>union</code> potřebuje větev pro každou <em>dvojici</em> variant). <br>Možnosti C a D popisují opačný případ – přidání nové <em>operace</em> (tam je levné ADT, drahé objekty).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 56, quote: 'New operations are cheap, new kinds of value are not.' },
      { kind: 'slide', doc: 'L1', page: 85 },
      { kind: 'slide', doc: 'L1', page: 86, quote: 'an object groups by row:' },
      { kind: 'slide', doc: 'L1', page: 86, quote: 'an ADT groups by column:' },
    ],
  },
  {
    id: 'ch1-08',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: {
      type: 'original',
      inspiredBy: 'L1 s. 53–55, 66 a 73 (sets of integers: union, cena ADT, verifikace)',
      why: 'Shrne silné a slabé stránky obou forem datové abstrakce na běžícím příkladu.',
    },
    prompt: 'ADT vs. objekty na příkladu množin celých čísel. Označ všechna pravdivá tvrzení.',
    options: [
      'ADT <code>union</code> vidí do reprezentace obou množin najednou, proto umí lineární merge seřazených seznamů.',
      'Objektový <code>Union</code> se o <code>s1</code> a <code>s2</code> dozví jen tím, že volá jejich metody.',
      'U ADT mohou v jednom programu bez problémů spolupracovat dvě různé implementace množiny.',
      'Typový systém zaručí, že každá implementace objektového rozhraní <code>ISet</code> se chová jako množina.',
      'ADT skrývá reprezentaci typovou abstrakcí, objekt procedurální abstrakcí.',
    ],
    correct: [0, 1, 4],
    explanation:
      'A: ano – možnost nahlédnout do několika reprezentací najednou je výhoda ADT. <br>B: ano – parametry jsou typované rozhraním, reprezentace je nedosažitelná. <br>C: ne – typ <code>set</code> je svázán s jedinou reprezentací; <code>set</code> a <code>set2</code> nejde smíchat (union pro ně nejde ani napsat). <br>D: ne – <code>Bad</code> má správný typ, ale není to množina. Typy hlídají strukturu, ne specifikaci. <br>E: ano.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 53, quote: 'The ability to inspect several representations' },
      { kind: 'slide', doc: 'L1', page: 66, quote: 'Everything it knows about s1 and s2, it learned by calling them.' },
      { kind: 'slide', doc: 'L1', page: 55, quote: 'The type name set is globally bound to one hidden' },
      { kind: 'slide', doc: 'L1', page: 73, quote: 'Type systems enforce structure, not specification.' },
      { kind: 'slide', doc: 'L1', page: 74, quote: 'Objects hide with procedural abstraction, not type abstraction.' },
    ],
  },
]
