import type { Question, SourceRef } from '../types'

// Otázky přepsané ze studentského Anki balíčku (kvízy 2023/24, FIT Wiki).
// Maska odpovědí v balíčku je studentská — každá otázka je vyřešena znovu,
// kódové otázky ověřeny ve Scale 3.9 (scala-cli). Kde se balíček mýlil, říká to vysvětlení.

const DECK_URL = 'https://fit-wiki.cz/škola/předměty/bi-oop'
const WIKI: SourceRef = { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: DECK_URL }
const img = (file: string): SourceRef => ({
  kind: 'image',
  src: `/sources/anki/${file}`,
  label: 'Anki kartička – původní obrázek',
  url: DECK_URL,
})
const ORIGIN = { type: 'real', seen: ['Anki (kvízy 2023/24)'] } as const

export const anki: Question[] = [
  // ---------------------------------------------------------------- L1 principy
  {
    id: 'anki-04',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Zkombinování dat s funkcemi v jeden celek (třídu) se nazývá:',
    options: ['Overriding', 'Overloading', 'Polymorfismus', 'Encapsulation'],
    correct: [3],
    explanation:
      '<strong>Encapsulation</strong> (zapouzdření): stav a chování zabalené do jednoho objektu, ke stavu se dostanou jen jeho metody.<br>' +
      'Ostatní možnosti jsou jiné pojmy: <em>overriding</em> = podtřída nahradí implementaci metody, <em>overloading</em> = více metod stejného jména s jinou signaturou, ' +
      '<em>polymorfismus</em> = jedno rozhraní, více typů/implementací.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 76, quote: 'Objects are where state and behaviour get packaged together.' },
      { kind: 'slide', doc: 'L1', page: 78, quote: 'The state is reachable only through the methods.' },
      WIKI,
    ],
  },
  {
    id: 'anki-84',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Class-based (CBI) vs. prototype-based inheritance (PBI). Co platí?',
    options: ['JavaScript implementuje PBI', 'C++ implementuje PBI', 'Smalltalk implementuje CBI', 'Scala implementuje CBI'],
    correct: [0, 2, 3],
    explanation:
      'Na slajdu „Hierarchy of OOP“ je větev <em>Class-Based</em> (C++, C#, Java, Python, Kotlin, Scala, …) a větev <em>Object-Based → Prototypes</em> (JavaScript, Self).<br>' +
      'Smalltalk je třídní jazyk (i <code>True</code>/<code>False</code> jsou v něm třídy). C++ je čistě class-based, takže „C++ implementuje PBI“ neplatí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 96 },
      { kind: 'slide', doc: 'L1', page: 89, quote: 'There are two Boolean classes, True and False, and both' },
      WIKI,
    ],
  },
  {
    id: 'anki-86',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Class-based (CBI) vs. prototype-based inheritance (PBI). Co platí?',
    options: [
      'Každý čistě objektově orientovaný jazyk je postavený na CBI',
      'Pro CBI platí, že každý objekt je instancí nějaké třídy',
      'Pro PBI platí, že každý objekt má prototyp',
      'Pro PBI platí, že každý objekt je instancí nějaké třídy',
    ],
    correct: [1, 2],
    explanation:
      'OOP se dělí na class-based a object-based (prototypy, closures) — JavaScript nebo Self jsou objektové bez tříd, takže „každý OO jazyk je CBI“ neplatí.<br>' +
      'V CBI je objekt běhovou instancí nějaké třídy; v PBI objekt nevzniká z třídy, ale odkazuje na svůj prototyp.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L1', page: 96 },
      { kind: 'slide', doc: 'L2', page: 11, quote: 'In the class-based system, it is a runtime instance of some class' },
      WIKI,
    ],
  },
  {
    id: 'anki-89',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Class-based inheritance (CBI) vs. prototype-based inheritance (PBI). Co platí?',
    options: [
      'Každý čistě objektově orientovaný jazyk je postavený na PBI',
      'Každý čistě objektově orientovaný jazyk je postavený na CBI',
      'Pro PBI platí, že každý objekt má prototyp',
      'Pro PBI platí, že každý objekt je instancí jediné třídy',
    ],
    correct: [2],
    explanation:
      'Ani jedna větev není „ta jediná“: Scala/Java jsou class-based, JavaScript/Self prototype-based, a obě jsou objektově orientované. ' +
      'Pro PBI platí jen to, že objekt má prototyp; třídy v něm nejsou.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'L1', page: 96 }, WIKI],
  },

  // ---------------------------------------------------------------- L2 objekty / subtyping / dispatch
  {
    id: 'anki-24',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Druhy polymorfismu:',
    options: ['Subtype polymorphism', 'Parametric polymorphism', 'Ad-hoc polymorphism', 'State polymorphism', 'Instance polymorphism'],
    correct: [0, 1, 2],
    explanation:
      'Přednáška zná tři druhy: <strong>subtype</strong> (objekt podtypu tam, kde se čeká nadtyp), <strong>parametric</strong> (generika, <code>List[T]</code>) ' +
      'a <strong>ad-hoc</strong> (overloading, type classes — jiné chování podle typu argumentu). „State“ a „instance“ polymorfismus neexistují.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 29, quote: 'allows a function or a data type to be written generically' },
      { kind: 'slide', doc: 'L6', page: 68, quote: 'Overloads and type classes provide two forms of ad-hoc polymorphism.' },
      WIKI,
    ],
  },
  {
    id: 'anki-06',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Abstraktní třída:',
    options: [
      'Může dědit pouze z abstraktních tříd',
      'Může definovat pouze abstraktní atributy a metody',
      'Nemůže být použita k vytvoření instancí',
      'Může definovat abstraktní atributy a metody',
    ],
    correct: [2, 3],
    explanation:
      '<code>new Shape</code> pro <code>abstract class Shape</code> se nepřeloží → instance vytvořit nejde. ' +
      'Abstraktní třída smí mít abstraktní <em>i</em> konkrétní členy (proto „pouze abstraktní“ neplatí) a smí dědit i z obyčejné třídy ' +
      '(<code>abstract class Shape extends Base</code> se přeloží).',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L6', page: 46, quote: 'A trait is almost like an abstract class, but' }, WIKI],
  },
  {
    id: 'anki-56',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co z následujícího je pravda o abstraktní třídě?',
    options: [
      'Může definovat instanční proměnné a metody',
      'Může definovat pouze abstraktní instanční proměnné a metody',
      'Nemůže být použita k vytvoření instancí',
      'Může definovat abstraktní instanční metody a proměnné',
    ],
    correct: [0, 2, 3],
    explanation:
      'Abstraktní třída = třída, která smí mít abstraktní členy (bez těla) a nejde instancovat. ' +
      'Konkrétní atributy a metody mít může (<code>val name = "shape"</code>, <code>def describe = …</code> vedle <code>def area: Double</code> se přeloží), ' +
      'takže „pouze abstraktní“ neplatí.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L6', page: 46, quote: 'A trait is almost like an abstract class, but' }, WIKI],
  },
  {
    id: 'anki-54',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Neabstraktní třída <code>A</code>, která dědí od třídy <code>B</code>:',
    options: [
      'Musí implementovat všechny abstraktní členy',
      'Musí zavolat jeden z konstruktorů třídy B',
      'Musí zavolat primární konstruktor třídy B',
      'Může přepsat definici všech non-final členů',
    ],
    correct: [0, 1],
    explanation:
      '1) Konkrétní třída nesmí nechat nic abstraktní → ano.<br>' +
      '2) Podtřída vždy volá konstruktor nadtřídy (implicitně nebo explicitně) → ano.<br>' +
      '3) Nemusí to být primární konstruktor: <code>class A extends B()</code>, kde <code>B</code> má <code>def this() = this(42)</code>, se přeloží a volá pomocný konstruktor → ne.<br>' +
      '4) <strong>Ne</strong>: <code>private</code> členy nejsou final, a přesto je přepsat nejde (<code>override def f</code> nad <code>private def f</code> je chyba kompilace). ' +
      'Balíček tuto možnost označuje jako správnou, ale podle slajdů i kompilátoru neplatí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
      { kind: 'slide', doc: 'L5', page: 14, quote: 'it cannot override a private method!' },
      WIKI,
    ],
  },
  {
    id: 'anki-59',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Když třída <code>A</code> dědí od třídy <code>B</code>, zdědí vše kromě:',
    options: [
      'abstraktních členů',
      'konečných (final) členů',
      'přepsaných (overridden) členů (override v A)',
      'privátních členů (private)',
      'protected členů',
    ],
    correct: [2, 3],
    explanation:
      'Přesně podle slajdu „Subclassing“: dědí se public a protected členy, <strong>ne</strong> private (podtřída o nich ani neví) ' +
      'a <strong>ne</strong> přepsané (jejich definici v <code>A</code> nahrazuješ). Final a abstraktní členy se dědí normálně — final jen nejde přepsat.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 37, quote: 'A subclass inherits all protected and public members' },
      { kind: 'slide', doc: 'L2', page: 37, quote: 'no overridden members (because you change the' },
      WIKI,
    ],
  },
  {
    id: 'anki-07',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Uvažujme následující kód. Které statementy se zkompilují?',
    code: `class A

class B extends A`,
    options: ['val x: Any = new A', 'val x: A = new Nothing', 'val x: B = new A', 'val x: A = new B'],
    correct: [0, 3],
    explanation:
      'Do proměnné typu <code>T</code> smíš dát hodnotu typu <code>T</code> nebo jeho podtypu.<br>' +
      '<code>A &lt;: Any</code> → OK. <code>B &lt;: A</code> → <code>val x: A = new B</code> OK. ' +
      '<code>A</code> není podtyp <code>B</code> → <code>val x: B = new A</code> je chyba. ' +
      '<code>Nothing</code> je sice podtyp všeho, ale nemá konstruktor („Nothing does not have a constructor“) → chyba.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      img('paste-47c0e209e2e422cfb94ec73b206879782303fcd6.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-27',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Uvažujte následující kód. Co platí?',
    code: `val x: A = ???

def f(y: A) = ???`,
    options: [
      'Proměnná x může nabývat pouze hodnoty typu A',
      'Proměnné x lze přiřadit hodnotu A',
      'Proměnné x lze přiřadit hodnotu jakéhokoliv podtypu A',
      'Proměnné x lze přiřadit hodnotu jakéhokoliv nadtypu A',
    ],
    correct: [1, 2],
    explanation:
      'Pravidlo subtypingu: kde se čeká <code>A</code>, smí být hodnota <code>A</code> nebo libovolného podtypu (<code>B &lt;: A</code>). ' +
      'Nadtyp nikdy (<code>val x: A = new Any</code> neprojde). „Pouze hodnoty typu A“ je past — runtime třída může být i podtřída.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      img('paste-a8e7d0ebe5e0a26ba99eb9870a3d4055113c3fbb.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-29',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co musí platit, aby se následující kód zkompiloval?',
    code: `def f(x: S): A = {
  val y: T = x

  y.g()
}`,
    options: ['T musí mít metodu g', 'Metoda g musí vracet hodnotu typu A nebo její podtyp', 'S <: T', 'S musí overridnout metodu g'],
    correct: [0, 1, 2],
    explanation:
      'Projdi řádky: <code>val y: T = x</code> — <code>x: S</code> jde přiřadit do <code>T</code> jen když <code>S &lt;: T</code>. ' +
      '<code>y.g()</code> — volání se kontroluje podle statického typu <code>T</code>, takže <code>T</code> musí mít <code>g</code>. ' +
      'Výsledek je návratová hodnota <code>f: A</code>, takže <code>g</code> musí vracet <code>A</code> nebo podtyp. ' +
      'Jestli <code>S</code> metodu <code>g</code> přepisuje, je pro kompilaci jedno.',
    verified: 'reasoning',
    sources: [
      { kind: 'slide', doc: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      img('paste-4c27f39ede28dc9ae2eb8b1372d584028f5e485e.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-30',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co platí?',
    code: `class A

class B extends A

class C extends B

class D extends A`,
    options: ['A >: C', 'A >: B', 'B <: D', 'D >: C', 'C >: B', 'C <: A'],
    correct: [0, 1, 5],
    explanation:
      'Nakresli strom: <code>A</code> nahoře, pod ním <code>B</code> a <code>D</code>, pod <code>B</code> je <code>C</code>. ' +
      'Subtyping je tranzitivní: <code>C &lt;: B &lt;: A</code>, takže <code>A &gt;: C</code>, <code>A &gt;: B</code>, <code>C &lt;: A</code>. ' +
      '<code>B</code>/<code>C</code> a <code>D</code> jsou sourozenecké větve — žádný vztah. <code>C &gt;: B</code> je obráceně.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L2', page: 30, quote: 'A >: B means that A is a supertype of B' },
      img('paste-1e9869c967eb5823000f514492b50f0c39cf034f.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-33',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co platí o kódu <code>class A extends B</code>?',
    options: [
      'A je nadtyp třídy B',
      'A je podtyp třídy B',
      'Vytvoří novou is-a relaci mezi A a B',
      'Instance třídy A se může použít kdekoliv je potřeba instance třídy B',
    ],
    correct: [1, 2, 3],
    explanation:
      '<code>extends</code> zavádí nominální subtyping <code>A &lt;: B</code> („A is-a B“), takže instance <code>A</code> smí všude, kde se čeká <code>B</code>. ' +
      'Nadtyp je naopak <code>B</code>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L6', page: 19, quote: 'Relates objects or classes together using is-a relationship' },
      { kind: 'slide', doc: 'L2', page: 30, quote: 'means that any variable of type B can safely be' },
      WIKI,
    ],
  },
  {
    id: 'anki-46',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co můžeme říct o nominálním a strukturálním typovém systému?',
    options: [
      'Strukturální typový systém určuje kompatibilitu typů pouze podle kompatibility struktury těch typů',
      'Nominální typový systém určuje kompatibilitu typů pomocí explicitních deklarací',
      'Strukturální typový systém kontroluje typování za běhu programu',
      'Nominální typový systém určuje kompatibilitu typů pouze podle kompatibility struktury těch typů',
    ],
    correct: [0, 1],
    explanation:
      'Nominální = rozhoduje deklarace (<code>extends</code>), strukturální = rozhoduje tvar (jaké metody typ má). ' +
      'Obojí je statická kontrola při kompilaci; „za běhu“ je <em>duck typing</em> (JavaScript, Python), to je třetí kategorie.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 64, quote: 'type equivalence and compatibility is determined by explicit declarations' },
      { kind: 'slide', doc: 'L2', page: 64, quote: "type equivalence and compatibility is determined by type's actual structure" },
      { kind: 'slide', doc: 'L2', page: 64, quote: 'looks like structural typing, but it is a runtime characteristics' },
      WIKI,
    ],
  },
  {
    id: 'anki-52',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co se stane po spuštění následujícího kódu?',
    code: `class A {
  def hi = "Hi from A"
}

class B extends A {
  def hi = "Hi from B"
}

val x: A = new B
println(x.hi)`,
    options: ['Chyba při kompilaci', 'Vytiskne "Hi from A"', 'Vytiskne "Hi from B"', 'Chyba za běhu'],
    correct: [0],
    explanation:
      '<code>B.hi</code> má stejnou signaturu jako zděděné <code>A.hi</code>, takže je to přepsání — a ve Scale musí mít modifikátor <code>override</code>. ' +
      'Bez něj: „method hi of type =&gt; String needs `override` modifier“. Kdyby tam <code>override</code> byl, vypsalo by se "Hi from B" (dynamic dispatch).',
    verified: 'scala',
    sources: [img('paste-d4c464a1b6124584491538c515d38e378d520c57.jpg'), WIKI],
  },
  {
    id: 'anki-53',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co bude výsledek?',
    code: `class Person(val name: String)

val xs = List(new Person("Alice"), new Person("Bob"))
val ys = xs

xs == ys`,
    options: ['false', 'Chyba při kompilaci', 'Chyba za běhu', 'true'],
    correct: [3],
    explanation:
      '<code>ys = xs</code> nekopíruje seznam, jen referenci — <code>xs</code> a <code>ys</code> jsou tentýž objekt, takže <code>==</code> (i <code>eq</code>) dá <code>true</code>.',
    verified: 'scala',
    sources: [img('paste-af6c93009e1dcef9fca8b6ef2f41c737de7108e8.jpg'), WIKI],
  },
  {
    id: 'anki-55',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co bude výsledkem následujícího kódu?',
    code: `class Person(val name: String)

val xs = List(new Person("Alice"), new Person("Bob"))
val ys = List(new Person("Alice"), new Person("Bob"))

xs == ys`,
    options: ['Chyba za běhu', 'Chyba při kompilaci', 'true', 'false'],
    correct: [3],
    explanation:
      '<code>List ==</code> porovnává prvky po dvojicích jejich <code>equals</code>. <code>Person</code> je obyčejná třída (ne case class) bez vlastního <code>equals</code>, ' +
      'takže se porovnává identita — čtyři různé objekty → <code>false</code>. S <code>case class Person</code> by to bylo <code>true</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 38, quote: 'A value has equality by its components.' },
      img('paste-b9f8fad6ce0a982cbaa0da59769afa9dfd5a73ac.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-58',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Které z následujících výrazů jsou pravdivé?',
    code: `class Person(val name: String) {

  override def equals(other: Any): Boolean = other match {
    case that: Person => name == that.name
    case _ => false
  }

  override def hashCode(): Int = java.util.Objects.hash(name)
}

val p1 = new Person("Alice")
val p2 = new Person("Bob")
val p3 = p1
val p4 = new Person("Alice")`,
    options: ['p1 eq p3', 'p1 == p4', 'p1 == p2', 'p1 eq p2', 'p1 eq p4'],
    correct: [0, 1],
    explanation:
      '<code>eq</code> = identita (stejná reference): pravda jen pro <code>p1 eq p3</code>. ' +
      '<code>==</code> volá přepsané <code>equals</code>, které porovnává <code>name</code>: <code>p1 == p4</code> ("Alice") pravda, <code>p1 == p2</code> nepravda. ' +
      '<code>p4</code> je nový objekt, takže <code>p1 eq p4</code> je <code>false</code>.',
    verified: 'scala',
    sources: [img('paste-7d9b1f2273e958a31ee181662b1526052c5ff8c5.jpg'), WIKI],
  },
  {
    id: 'anki-26',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co je dynamic dispatch?',
    options: [
      'Důležitá součást „method invocation“',
      'Hledání názvu operace v tabulce asociované s objektem v run-time',
      'Hledání názvu operace v tabulce asociované s objektem v compile-time',
      'Možnost mít pro objekty používající stejný interface jiné reprezentace',
    ],
    correct: [0, 1],
    explanation:
      'Dynamic dispatch je krok volání metody: <em>za běhu</em> se podle runtime třídy příjemce vybere implementace (prakticky přes tabulku metod objektu). ' +
      'V compile-time se vybírá jen signatura (overload). Poslední možnost popisuje <em>multiple representations</em> / polymorfismus — ' +
      'dynamic dispatch ho umožňuje, ale není to jeho definice.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 22, quote: 'Dynamic the receiver’s runtime class selects' },
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Runtime: for a virtual call, select the override for that signature' },
      WIKI,
    ],
  },
  {
    id: 'anki-85',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Dynamic dispatch:',
    options: [
      'Je výchozí volání v jazyce Scala',
      'Je k dispozici pouze v dynamických jazycích',
      'Skutečná metoda, která se bude volat, se řeší až za běhu',
      'Jaká metoda se zavolá, závisí na aktuálně použitých hodnotách argumentů za běhu programu',
    ],
    correct: [0, 2],
    explanation:
      'Na JVM je většina volání dynamická (výjimky: private, final, metody companion objektu) → ve Scale je to výchozí. ' +
      'Funguje i ve staticky typovaných jazycích. Za běhu se rozhoduje <strong>jen podle runtime třídy příjemce</strong>; ' +
      'runtime typy explicitních argumentů výběr neovlivní — overload se volí staticky podle jejich statických typů (single dispatch).<br>' +
      'Balíček označuje i poslední možnost jako správnou; to by popisovalo multiple dispatch, který Scala nemá.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' },
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types' },
      WIKI,
    ],
  },
  {
    id: 'anki-88',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Single dispatch:',
    options: [
      'Je hybrid mezi statickým a dynamickým voláním',
      'Volá staticky podle typu prvního argumentu a dynamicky na zbytek',
      'Je užitečné pouze pro OOP s jednoduchou dědičností',
      'Volá dynamicky podle prvního argumentu a staticky na zbytek',
    ],
    correct: [0, 3],
    explanation:
      '„Signature first, receiver second“: při kompilaci se podle <em>statických</em> typů argumentů vybere overload, za běhu se podle runtime třídy ' +
      '<em>příjemce</em> (to je ten „první argument“, <code>this</code>) vybere override. Tedy dynamicky podle příjemce, staticky podle zbytku — hybrid. ' +
      'S počtem předků nesouvisí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Compile time: select an accessible signature from the receiver’s static type' },
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types' },
      WIKI,
    ],
  },
  {
    id: 'anki-28',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude výsledek následujícího kódu?',
    code: `class A {
  def f = 1 + this.g
  def g = 1
}

class B extends A {
  override def f = super.f * 2
}

class C extends B {
  override def g = 2
}

def test(x: A) = x.f
def test(x: B) = x.f + 2
def test(x: C) = x.f + 4

val u: A = new C
val w: B = new C
val v: C = new C

test(u) + test(v) + test(w)`,
    options: ['24', '21', '18', '16', 'Nezkompiluje se'],
    correct: [0],
    explanation:
      'Všechny tři objekty jsou runtime <code>C</code>, takže <code>x.f</code> je vždy stejné: <code>B.f = super.f * 2</code>, <code>A.f = 1 + this.g</code>, ' +
      '<code>this.g</code> dynamicky → <code>C.g = 2</code>. Tedy <code>f = (1 + 2) * 2 = 6</code>.<br>' +
      'Overload <code>test</code> se vybírá staticky podle deklarovaného typu proměnné: <code>test(u: A) = 6</code>, <code>test(v: C) = 6 + 4 = 10</code>, ' +
      '<code>test(w: B) = 6 + 2 = 8</code>. Součet 24.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 16 },
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      img('paste-2f75548fcb9f39a7014c8db90e5ce59b90401404.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-31',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude důsledek spuštění následujícího kódu?',
    code: `class A {
  def m: Int = 7
  def n: Int = 6
}

class B extends A {
  override def m: Int = m * n
  override def n: Int = 5
}

println(new B().m)`,
    options: ['35', '42', 'Chyba během kompilace', 'Chyba za běhu'],
    correct: [3],
    explanation:
      '<code>m</code> uvnitř <code>B.m</code> je <code>this.m</code> → dynamicky zase <code>B.m</code> → nekonečná rekurze → <code>StackOverflowError</code> za běhu. ' +
      'Přeloží se to (návratový typ je uvedený). Chtěl-li autor rodičovskou verzi, musí napsat <code>super.m</code> (viz další otázka → 35).',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 9, quote: 'override def f: Int = f * g' },
      img('paste-f84da0b6094037f3cbc1cc8e74d61a18fb093694.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-32',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude důsledek spuštění následujícího kódu?',
    code: `class A {
  def m: Int = 7
  def n: Int = 6
}

class B extends A {
  override def m: Int = super.m * n
  override def n: Int = 5
}

println(new B().m)`,
    options: ['35', '42', 'Chyba během kompilace', 'Chyba za běhu'],
    correct: [0],
    explanation:
      '<code>super.m</code> je statické → <code>A.m = 7</code>. <code>n</code> je <code>this.n</code> → dynamicky <code>B.n = 5</code> (ne 6!). Výsledek 7 * 5 = 35.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 10, quote: 'override def f: Int = super.f * g' },
      { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      img('paste-07a2d437c1c4e0e1e8974217451b585900dae2f6.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-34',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude výsledek spuštění následujícího kódu?',
    code: `class A {
  def f: Int = 7
}

class B extends A {
  override def f: Int = super.f + this.g
  def g: Int = 5
}

class C extends B {
  override def g: Int = 6
}

println(new C().f)`,
    options: ['35', '12', 'Chyba za běhu', 'Chyba za kompilace', '13'],
    correct: [4],
    explanation:
      '<code>C</code> nepřepisuje <code>f</code> → běží <code>B.f</code>. <code>super.f</code> v <code>B</code> je staticky <code>A.f = 7</code>, ' +
      '<code>this.g</code> dynamicky podle runtime třídy <code>C</code> → 6. Výsledek 7 + 6 = 13 (12 by vyšlo, kdyby se <code>g</code> bralo z <code>B</code>). ' +
      'Totéž vyjde i s <code>super.f + g</code> — <code>g</code> bez <code>this.</code> je pořád <code>this.g</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 12 },
      { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
      img('paste-326a955c5b9a31b191fce23782c2c0f42a003ce5.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-35',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude výsledek spuštění následujícího kódu?',
    code: `class A {
  def f = 1
}

class B extends A {
  override def f = 20
}

class X {
  def m(x: A): Int = this.n(x)
  def n(x: A): Int = x.f
}

class Y extends X {
  def m(x: B): Int = 30
  override def n(x: A): Int = super.n(x) + 1
}

val a: A = new A
val b: A = new B
val c: X = new Y

println(c.m(a) + c.m(b))`,
    options: ['60', '23', 'Chyba za běhu', 'Chyba za kompilace'],
    correct: [1],
    explanation:
      '<code>Y.m(x: B)</code> má jiný typ parametru → je to <strong>overload</strong>, ne override. Statický typ <code>c</code> je <code>X</code>, a <code>X</code> zná jen <code>m(A)</code>, ' +
      'takže oba hovory jdou do <code>X.m(A)</code> (navíc <code>b</code> je staticky <code>A</code>).<br>' +
      '<code>X.m</code> volá <code>this.n</code> → dynamicky <code>Y.n</code> = <code>x.f + 1</code>; <code>x.f</code> dynamicky: pro <code>a</code> 1, pro <code>b</code> 20.<br>' +
      '(1 + 1) + (20 + 1) = 2 + 21 = 23.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L2', page: 20, quote: 'Compile time: select an accessible signature from the receiver’s static type' },
      img('paste-82336ba489e6a7a05ab772f26170400bf46cb270.jpg'),
      WIKI,
    ],
  },

  // ---------------------------------------------------------------- L4 generics / variance
  {
    id: 'anki-36',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaké metody na proměnné <code>x</code> mohu volat v metodě <code>test</code>?',
    code: `class A {
  def ma(): Unit = {}
}

class B extends A {
  def mb(): Unit = {}
}

class C extends B {
  def mc(): Unit = {}
}

class D extends A {
  def md(): Unit = {}
}

class Test[T] {
  def test(x: T): Unit = {
    // which methods can I call on x
  }
}

val t = new Test[B]
t.test(new B)`,
    options: ['mb', 'mc', 'test', 'ma', 'Žádnou z nich (jen metody z Any)'],
    correct: [4],
    explanation:
      'Tělo <code>Test</code> se typově kontroluje jednou, pro libovolné <code>T</code> — o tom, že později napíšeš <code>Test[B]</code>, nic neví. ' +
      '<code>T</code> nemá žádný bound, takže o <code>x</code> ví jen, že je <code>Any</code>: <code>x.ma()</code> dá „value ma is not a member of T“. ' +
      '<code>test</code> je metoda třídy <code>Test</code>, ne <code>x</code>. Kdyby bylo <code>class Test[T &lt;: B]</code>, šlo by <code>ma</code> a <code>mb</code>.<br>' +
      '(V balíčku nebyla zaškrtnutá žádná možnost; varianta „žádnou“ je doplněná.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' },
      img('paste-0c71a822b48ed5daf5d3d7fb538c4c22df970312.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-37',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Instance kterých tříd mohou být dodány jako parametr <code>x</code> pro následující funkci: <code>def f[A &lt;: MyClass](x: A): Unit</code>?',
    options: [
      'Všechny nadtřídy včetně MyClass',
      'Všechny nadtřídy kromě MyClass',
      'Pouze MyClass',
      'MyClass a všechny její podtřídy',
      'Všechny podtřídy kromě MyClass',
    ],
    correct: [3],
    explanation:
      'Upper bound <code>A &lt;: MyClass</code> povoluje jako typový argument <code>MyClass</code> nebo libovolný podtyp (subtyping je reflexivní, takže <code>MyClass</code> samotná taky). ' +
      'Nadtřída neprojde: <code>f(new Super)</code> je chyba kompilace.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' },
      WIKI,
    ],
  },
  {
    id: 'anki-38',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Instance kterých tříd mohou být použity pro parametr <code>x</code> při volání metody <code>test</code> na posledním řádku?',
    code: `class A {
  def ma(): Unit = {}
}

class B extends A {
  def mb(): Unit = {}
}

class C extends B {
  def mc(): Unit = {}
}

class D extends A {
  def md(): Unit = {}
}

class Test[T] {
  def test(x: T): Unit = { }
}

new Test[B]().test(???)`,
    options: ['Int', 'A', 'String', 'Any', 'B', 'C'],
    correct: [4, 5],
    explanation:
      'Dosaď <code>T = B</code>: metoda je <code>test(x: B)</code>. Projde <code>B</code> a jeho podtyp <code>C</code>. ' +
      '<code>A</code> a <code>Any</code> jsou nadtypy, <code>Int</code> a <code>String</code> nesouvisí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      img('paste-ff16f46c56120d0e74c2c0be135cb8c6e3a88812.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-39',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Uvažujte definici <code>class CP[T]</code>. Vyberte pravdivá tvrzení.',
    options: [
      'T je kovariantní typový parametr',
      'T je invariantní typový parametr',
      'Pokud A &lt;: B, pak CP[A] &gt;: CP[B]',
      'Pokud A &lt;: B, pak CP[A] &lt;: CP[B]',
    ],
    correct: [1],
    explanation:
      'Bez anotace (<code>+</code>/<code>-</code>) je parametr invariantní: z <code>A &lt;: B</code> neplyne žádný vztah mezi <code>CP[A]</code> a <code>CP[B]</code>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L4', page: 46, quote: 'C[T] means that the class C is invariant in T (the default)' },
      { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
      WIKI,
    ],
  },
  {
    id: 'anki-40',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Uvažujte definici <code>class Producer[+T]</code>. Rozhodněte, která tvrzení jsou správně.',
    options: [
      'T je kontravariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B: pokud A &lt;: B, pak Producer[A] &gt;: Producer[B]',
      'Pro jakékoliv dvě třídy A a B: pokud A &lt;: B, pak Producer[A] &lt;: Producer[B]',
      'T je kovariantní typový parametr',
    ],
    correct: [2, 3],
    explanation: '<code>+T</code> = kovariance: směr subtypingu se zachová, <code>A &lt;: B ⇒ Producer[A] &lt;: Producer[B]</code>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L4', page: 46, quote: 'C[+T] means that the class C is covariant in T' },
      { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
      WIKI,
    ],
  },
  {
    id: 'anki-42',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Uvažujte definici <code>class Consumer[-T]</code> a rozhodněte, která tvrzení jsou správně.',
    options: [
      'Pro jakékoliv dvě třídy A a B: pokud A &lt;: B, pak Consumer[A] &gt;: Consumer[B]',
      'T je kontravariantní typový parametr',
      'T je kovariantní typový parametr',
      'T je invariantní typový parametr',
    ],
    correct: [0, 1],
    explanation:
      '<code>-T</code> = kontravariance: směr se obrátí, <code>A &lt;: B ⇒ Consumer[B] &lt;: Consumer[A]</code>, tj. <code>Consumer[A] &gt;: Consumer[B]</code>.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L4', page: 46, quote: 'C[-T] means that the class C is contravariant in T' },
      { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
      WIKI,
    ],
  },
  {
    id: 'anki-41',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt:
      'Funkce s jedním parametrem <code>A =&gt; B</code> je definována jako parametrizovaný typ <code>Function1[A, B]</code>. Oba typové parametry mají variance anotace. Vyberte které.',
    options: ['-A', '+B', '+A', '-B'],
    correct: [0, 1],
    explanation:
      '<code>trait Function1[-S, +T]</code>: vstup je kontravariantní (funkce smí přijmout víc), výstup kovariantní (smí vrátit konkrétnější typ).',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'L4', page: 59, quote: 'Inputs are contravariant, outputs are covariant.' }, WIKI],
  },
  {
    id: 'anki-43',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt:
      'Uvažujme třídu <code>Collection[T]</code> a to, že třídy <code>Dog</code> a <code>Animal</code> k sobě nemají žádný vztah. Jaká může být variance <code>T</code>, aby se tento kód zkompiloval?',
    code: `var dogs: Collection[Dog] = ...

var animals: Collection[Animal] = dogs`,
    options: ['Nikdy se nezkompiluje', 'Vždy se zkompiluje', 'Invariance', 'Covariance', 'Contravariance'],
    correct: [0],
    explanation:
      'Variance jen <em>přenáší</em> existující vztah <code>Dog &lt;: Animal</code> (nebo opačný) na <code>Collection</code>. Když mezi <code>Dog</code> a <code>Animal</code> žádný vztah není, ' +
      'není co přenést — s <code>[T]</code>, <code>[+T]</code> i <code>[-T]</code> je to type mismatch. (Pozor: v podobných otázkách bývá <code>Dog extends Animal</code>, pak by stačila kovariance.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
      img('paste-8cc6d7dd723edf1b7a76e4a6e41c89155eced8cc.jpg'),
      WIKI,
    ],
  },

  // ---------------------------------------------------------------- L5 encapsulation / ADT / pattern matching
  {
    id: 'anki-03',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Které metody na <code>x</code> mohu zavolat z metody <code>test</code> na řádku 8?',
    code: `class C {
  private def m1: Unit = ()
  private[this] def m2: Unit = ()
  protected def m3: Unit = ()
  def m4: Unit = ()

  def test(x: C) = {
    x.???
  }
}`,
    options: ['m1', 'm2', 'm3', 'm4'],
    correct: [0, 1, 2, 3],
    explanation:
      'Jsme uvnitř třídy <code>C</code>: <code>m4</code> (public) ano, <code>m3</code> (protected: třída + podtřídy) ano, ' +
      '<code>m1</code> (private) ano — <code>private</code> je soukromé pro <em>třídu</em>, ne pro objekt, takže jde volat i na jiné instanci <code>x</code> téže třídy.<br>' +
      '<code>m2</code> (<code>private[this]</code>): ve Scale 2 to znamenalo „jen přes <code>this</code>“ a <code>x.m2</code> se nepřeložilo — proto balíček uvádí jen m1, m3, m4. ' +
      '<strong>Ve Scale 3</strong> (ověřeno na 3.3 i 3.9) se ale kvalifikátor <code>[this]</code> ignoruje („Ignoring [this] qualifier“) a <code>m2</code> se chová jako <code>private</code> → přeloží se všechny čtyři. ' +
      'Slajdy <code>private[this]</code> vůbec nezmiňují.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 13, quote: 'Private members are accessible only from' },
      { kind: 'slide', doc: 'L5', page: 9 },
      img('paste-8bf1ea130b0c0ff1c4fb8117a3307a1948f05ba6.jpg'),
      img('paste-c338055ea7dfc912f85198596d03a31221a9f292.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-44',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co bude výsledek následujícího kódu?',
    code: `class A {
  protected def m: Int = 1
}

class B extends A {
  override def m: Int = 2
}

val y: A = new B()

y.m`,
    options: ['2', '1', 'Chyba za běhu', 'Chyba při kompilaci'],
    correct: [3],
    explanation:
      'Přístupnost kontroluje kompilátor podle <strong>statického</strong> typu: <code>y: A</code> a v <code>A</code> je <code>m</code> protected → volat ho zvenku (top-level kód) nelze. ' +
      'Že override v <code>B</code> je public, nepomůže — runtime třída se pro přístupová práva nebere v úvahu. (S <code>val y: B</code> by to vypsalo 2, viz další otázka.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 12, quote: 'The override is public by default. The parent declaration is still protected.' },
      img('paste-90c96a9b3f83b9072d2caa3b3a7ab14910782797.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-50',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co bude výsledkem následujícího kódu?',
    code: `class A {
  protected def m: Int = 1
}

class B extends A {
  override def m: Int = 2
}

val y: B = new B()

y.m`,
    options: ['1', '2', 'Chyba při kompilaci', 'Chyba za běhu'],
    correct: [1],
    explanation:
      'Override bez modifikátoru je <strong>public</strong>, takže přes statický typ <code>B</code> volat jde, a vrátí <code>B.m = 2</code>. ' +
      'Porovnej s předchozí otázkou: stejný objekt přes <code>val y: A</code> je chyba kompilace.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 12, quote: 'The override is public by default. The parent declaration is still protected.' },
      img('paste-6b55578bae908da98e3e206da64edfdddfe8779a.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-48',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Proč chceme zapouzdřovat?',
    options: [
      'Aby se zabránilo narušení invariantů třídy',
      'Abychom mohli později změnit podrobnosti implementace',
      'Povolit přímý přístup k vnitřnímu stavu objektu',
      'Abychom umožnili polymorfismus',
    ],
    correct: [0, 1],
    explanation:
      'Zapouzdření = hranice kolem stavu: změny jdou jen přes operace, které drží invariant, a implementaci (uložení dat) jde změnit bez dopadu na volající. ' +
      'Přímý přístup ke stavu je přesný opak; polymorfismus zajišťuje subtyping/dispatch, ne zapouzdření.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L5', page: 26, quote: 'A good boundary makes invalid changes hard and implementation changes local.' },
      { kind: 'slide', doc: 'L5', page: 7 },
      WIKI,
    ],
  },
  {
    id: 'anki-09',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Case classes:',
    options: [
      'Jsou užitečné pro datové modelování a při pattern matchingu',
      'Mají implementaci ekvivalence, která porovnává všechny stavové proměnné',
      'Ve výchozím stavu jsou neměnné (immutable)',
      'Ve výchozím stavu jsou měnitelné (mutable)',
    ],
    correct: [0, 1, 2],
    explanation:
      'Case class generuje <code>equals</code>/<code>hashCode</code> (porovnání po složkách), <code>copy</code>, factory <code>apply</code> a extractor <code>unapply</code> pro pattern matching. ' +
      'Parametry konstruktoru jsou implicitně <code>val</code> → výchozí je immutable.<br>' +
      'Pozn.: „všechny stavové proměnné“ = parametry konstruktoru; pole definovaná v těle se do <code>equals</code> nepočítají.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L5', page: 30, quote: 'The val keyword is implicit in case classes' },
      { kind: 'slide', doc: 'L5', page: 38, quote: 'A value has equality by its components.' },
      WIKI,
    ],
  },
  {
    id: 'anki-45',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Case classes:',
    options: [
      'Nemohou dědit z jiných tříd',
      'Dávají způsob, jak vytvořit algebraické datové typy',
      'Nemohou být měnitelné',
      'Jsou užitečné pro ukládání obyčejných dat',
    ],
    correct: [1, 3],
    explanation:
      'Case class je „product“ část ADT a slouží k modelování obyčejných dat. ' +
      'Dědit smí (<code>case class P(...) extends Base(1)</code> se přeloží; zakázané je jen dědit case class z case class) a měnitelná být <em>může</em> ' +
      '(<code>case class P(var name: String)</code> se přeloží) — immutable je jen výchozí a doporučené.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 30, quote: "Scala's take on product part of Algebraic Data Types" },
      { kind: 'slide', doc: 'L5', page: 30, quote: 'Model plain data aggregates with less ceremony' },
      WIKI,
    ],
  },
  {
    id: 'anki-49',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Pro case classes platí:',
    options: [
      'Pro rovnost, pokud chceme porovnávat obsah spíše než umístění v paměti, musíme přepsat equals a hashCode',
      'Ve výchozím stavu jsou mutable (měnitelné)',
      'Ve výchozím stavu jsou immutable (neměnné)',
      'Mají implementaci ekvivalence, která porovná všechny stavové proměnné',
    ],
    correct: [2, 3],
    explanation:
      '<code>equals</code>/<code>hashCode</code> po složkách generuje kompilátor — přepisovat je musíš u <em>obyčejné</em> třídy, ne u case class. ' +
      'Parametry jsou implicitně <code>val</code> → immutable.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L5', page: 30, quote: 'The val keyword is implicit in case classes' },
      { kind: 'slide', doc: 'L5', page: 38, quote: 'A value has equality by its components.' },
      WIKI,
    ],
  },
  {
    id: 'anki-51',
    kind: 'mc',
    topic: 'pattern',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co z následujícího platí o pattern matchingu?',
    options: [
      'Může se použít pro matching typů, kdy poskytuje bezpečnější alternativu k isInstanceOf a asInstanceOf',
      'Každý případ za => může obsahovat pouze jeden výraz',
      'Je to statement',
      'Je to výraz, takže pokud se žádný případ neshoduje, dostaneme výjimku',
    ],
    correct: [0, 3],
    explanation:
      '<code>case n: Int =&gt; …</code> otestuje typ a rovnou naváže proměnnou správného typu — žádný ruční cast. ' +
      '<code>match</code> je výraz (má hodnotu), a když nepadne žádný case, vyhodí za běhu <code>MatchError</code>. ' +
      'Za <code>=&gt;</code> smí být víc příkazů (blok až do dalšího <code>case</code>), hodnotou je poslední výraz.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 47 }, { kind: 'slide', doc: 'L5', page: 72, quote: 'Cases run from top to bottom.' }, WIKI],
  },
  {
    id: 'anki-57',
    kind: 'mc',
    topic: 'pattern',
    lecture: 'L5',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Jaký bude výstup následujícího kódu?',
    code: `case class Num(x: Int)
val xs = List(Num(1), Num(2))

xs match {
  case Num(x) :: _ => print(x)
  case Num(x) :: Num(y) :: _ => print(x + y)
  case x :: y :: Nil => print(0)
  case _ => print(2)
}`,
    options: ['0', '1', '2', '3'],
    correct: [1],
    explanation:
      'Case se zkouší shora dolů a vyhraje <strong>první</strong>, který pasuje. <code>Num(x) :: _</code> pasuje na jakýkoli neprázdný seznam začínající <code>Num</code> → <code>x = 1</code>, vypíše 1. ' +
      'Kompilátor u dalších dvou case dokonce hlásí „Unreachable case“.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 72, quote: 'Cases run from top to bottom.' },
      { kind: 'slide', doc: 'L5', page: 53, quote: 'In a pattern, head :: tail extracts a nonempty list.' },
      img('paste-5f9718e26435d760b57622095ac81e3d98c5f13c.jpg'),
      WIKI,
    ],
  },

  // ---------------------------------------------------------------- L6 ad-hoc (type classes)
  {
    id: 'anki-20',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co bude výstupem tohoto programu?',
    code: `trait Show[T] {
  def show(x: T): String
}

case class Student(name: String)
case class Teacher(name: String)

implicit val studentShow: Show[Student] = {
  x => s"Student: \${x.name}"
}

def print[T](x: T)(implicit s: Show[T]) = {
  println(s.show(x))
}

print(Student("Jon Doe"))
print(Teacher("Jon Doe"))`,
    options: [
      '"Student: Jon Doe"<br>"Student: Jon Doe"',
      '"Student: Jon Doe"<br>"Teacher: Jon Doe"',
      'Chyba při kompilaci – chybí implementace Show pro Teacher',
      'Chyba za běhu – chybí implementace Show pro Teacher',
    ],
    correct: [2],
    explanation:
      'Instanci type class (<code>implicit</code> / <code>given</code>) hledá kompilátor podle statického typu. Pro <code>print(Teacher(...))</code> potřebuje <code>Show[Teacher]</code> a žádná není ' +
      '→ chyba kompilace („No given instance of type Show[Teacher] was found“). Nic se nevypíše, ani první řádek — program se vůbec nepřeloží.<br>' +
      '(<code>implicit val</code>/<code>implicit s</code> je starší zápis; ve Scale 3 totéž znamená <code>given</code>/<code>using</code>.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L6', page: 88, quote: 'If no best candidate exists, compilation fails.' },
      img('paste-07d251e6ce320f0107ee1e63c7b0d144b46b4810.jpg'),
      WIKI,
    ],
  },
  {
    id: 'anki-21',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { ...ORIGIN, seen: [...ORIGIN.seen] },
    prompt: 'Co platí pro následující kód?',
    code: `trait Show[T] {
  def show(x: T): String
}

case class Student(name: String)

implicit val studentShow: Show[Student] = {
  x => s"Student: \${x.name}"
}

def print[T](x: T)(implicit s: Show[T]) = {
  println(s.show(x))
}`,
    options: [
      'Metoda print používá type class Show',
      'Implicitní hodnota studentShow je instancí type class',
      'Metoda print je type class',
      'Trait Show[T] je type class',
    ],
    correct: [0, 1, 3],
    explanation:
      'Tři role type class patternu: <strong>type class</strong> = generický trait s operacemi (<code>Show[T]</code>), ' +
      '<strong>instance</strong> = implementace pro konkrétní typ (<code>studentShow: Show[Student]</code>), ' +
      '<strong>použití</strong> = generická funkce, která si o schopnost řekne implicitním parametrem (<code>print</code>). <code>print</code> sama type class není.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L6', page: 87, quote: 'An instance implements those operations for a type: Jsonable[Player].' },
      { kind: 'slide', doc: 'L6', page: 87, quote: 'A generic function requests the capability: using Jsonable[T].' },
      img('paste-4b4a4187fbe16e1a593426e00cc0d01656b7f83c.jpg'),
      WIKI,
    ],
  },
]
