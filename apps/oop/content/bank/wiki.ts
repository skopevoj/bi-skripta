import type { Question, SourceRef } from '../types'

// Otázky přepsané z kopie FIT Wiki (fit-wiki/), stránky BI-OOP.
// Odpovědi na wiki psali studenti — vše ověřeno znovu (scala-cli / slidy).

const WIKI = 'https://fit-wiki.cz/škola/předměty/bi-oop/'

const wikiRef = (page: string, label: string): SourceRef => ({
  kind: 'wiki',
  label: `FIT Wiki – ${label}`,
  page,
  url: WIKI + page,
})

const img = (file: string, label: string): SourceRef => ({
  kind: 'image',
  src: `/sources/wiki/${file}`,
  label,
})

// Stránky wiki
const K1 = wikiRef('k1', 'Kvíz K1 (2024/25)')
const K2 = wikiRef('k2', 'Kvíz K2 (2024/25)')
const K4 = wikiRef('k4', 'Kvíz K4 (2024/25)')
const K7 = wikiRef('k7', 'Kvíz K7 (2024/25)')
const K8 = wikiRef('k8', 'Kvíz K8 (2024/25)')
const M1510 = wikiRef('marast_15_10_20', 'Marast 15. 10. 2020')
const M2210 = wikiRef('marast_22_10_20', 'Marast 22. 10. 2020')
const M0511 = wikiRef('marast_05_11_20', 'Marast 5. 11. 2020')
const M1211 = wikiRef('marast_12_11_20', 'Marast 12. 11. 2020')
const M1712 = wikiRef('marast_17_12_20', 'Marast 17. 12. 2020')
const MIX = wikiRef('marast_2021_2022_mix', 'Marast 2021/22 (mix)')
const POLY = wikiRef('poly', 'stránka „poly“ (kvíz)')
const T0411 = wikiRef('test_04_11_19', 'Midterm 4. 11. 2019')
const T0511 = wikiRef('test_05_11_19', 'Midterm 5. 11. 2019')
const Z1301 = wikiRef('zkouska_13_1_26', 'Zkouška 13. 1. 2026')
const Z2301 = wikiRef('oop_zkouska_2026-01-23', 'Zkouška 23. 1. 2026')

export const wiki: Question[] = [
  // ---------------------------------------------------------------------------
  // Kvíz K1 (2024/25) — subtyping polymorphism
  {
    id: 'wiki-k1-01',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Uvažujte následující třídy. Která tvrzení jsou pravdivá?',
    code: `class A
class B extends A
class C extends B
class D extends A`,
    options: ['B <: D', 'D >: C', 'B >: B', 'A >: C'],
    correct: [2, 3],
    explanation:
      'Nakresli si strom: <code>A</code> je kořen, pod ním <code>B</code> a <code>D</code> (sourozenci), pod <code>B</code> je <code>C</code>.<br>' +
      '<ul><li><code>B &lt;: D</code> — B a D jsou sourozenci, mezi nimi žádná relace není → <strong>ne</strong>.</li>' +
      '<li><code>D &gt;: C</code> znamená <code>C &lt;: D</code>. Cesta nahoru z C je C → B → A, D na ní neleží → <strong>ne</strong>.</li>' +
      '<li><code>B &gt;: B</code> — subtyping je <strong>reflexivní</strong>, každý typ je podtyp i nadtyp sám sebe → <strong>ano</strong>.</li>' +
      '<li><code>A &gt;: C</code> znamená <code>C &lt;: A</code> (tranzitivně přes B) → <strong>ano</strong>.</li></ul>' +
      '<strong>Past:</strong> <code>&gt;:</code> čti zprava doleva („C je podtyp D?“), a nezapomeň na reflexivitu. Wiki má stejné odpovědi.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 75, quote: 'A type relation between two types, usually written B <: A.' },
      K1,
    ],
  },
  {
    id: 'wiki-k1-02',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Co platí o třídě <code>C</code>?',
    code: `class C {
  def m: Int = 1
  val n: Int = 0
}`,
    options: [
      'Definuje instanční proměnnou <code>n</code>',
      'Definuje metodu <code>m</code>',
      'Dědí svůj jediný konstruktor',
      'Nelze ji zkonstruovat, protože nemá žádný konstruktor',
    ],
    correct: [0, 1],
    explanation:
      '<code>val n</code> je pole (instanční proměnná, jen pro čtení), <code>def m</code> je metoda. ' +
      'Třída bez parametrů má přesto <strong>vlastní primární konstruktor</strong> (bez parametrů) — hlavička třídy ho definuje vždy, takže <code>new C</code> funguje. ' +
      'Konstruktory se <strong>nedědí</strong>: podtřída jen musí zavolat konstruktor nadtřídy.<br>' +
      '<strong>Past:</strong> „nemá žádný konstruktor“ — v Scale má každá (neabstraktní) třída aspoň primární konstruktor. Na wiki je původně anglicky, odpovědi souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 12, quote: 'A blueprint (a template) for creating objects' },
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
      K1,
    ],
  },
  {
    id: 'wiki-k1-03',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Třída…',
    options: [
      'nemusí definovat ani instanční proměnné ani instanční metody',
      'má vždy alespoň jednu instanční metodu',
      'má vždy alespoň jednu instanční proměnnou',
      'má vždy alespoň jeden konstruktor (může být zděděný)',
    ],
    correct: [0, 3],
    explanation:
      '<code>class A</code> bez těla je platná třída — žádné pole, žádná vlastní metoda. Konstruktor ale má vždy: primární konstruktor bez parametrů se vygeneruje z hlavičky.<br>' +
      'Formulace „může být zděděný“ je nepřesná (konstruktory se nedědí, podtřída jen volá konstruktor nadtřídy), ale tvrzení „má vždy alespoň jeden konstruktor“ platí — v kvízu (screenshot na wiki) je správně zaškrtnuto.<br>' +
      '<strong>Past:</strong> metody zděděné z <code>Any</code>/<code>AnyRef</code> (<code>toString</code>…) nejsou „instanční metody, které třída definuje“.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
      K1,
      img('oop-k1.png', 'Kvíz K1 (2024/25) – screenshot otázky „Třída“'),
    ],
  },
  {
    id: 'wiki-k1-04',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)', 'FIT Wiki – Marast 2021/22 (Kvíz K2 – zapouzdření)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Zkombinování dat s funkcemi v jeden celek (třídu) se nazývá',
    options: ['overriding', 'overloading', 'polymorfismus', 'zapouzdření (encapsulation)'],
    correct: [3],
    explanation:
      'Zabalení stavu a chování (dat a metod, které s nimi pracují) do jednoho objektu je <strong>zapouzdření</strong>; navíc jen metody objektu smí sahat na jeho stav.<br>' +
      'Overriding = přepsání zděděné metody, overloading = více metod se stejným jménem a jinými typy parametrů, polymorfismus = jeden kód pro hodnoty více typů. Wiki má stejnou odpověď.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L1', page: 76, quote: 'Objects are where state and behaviour get packaged together.' },
      K1,
      MIX,
      img('bi_oop_24_25_quiz1.png', 'Kvíz K1 (2024/25) – screenshot'),
      img('bi-oop_21-22_quiz2.png', 'Marast 2021/22, Kvíz K2 – zapouzdření – screenshot'),
      // sloučeno z duplicit: anki-04
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'wiki-k1-05',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Vyberte vše, co platí o následujícím kódu: <code>class A extends B</code>',
    options: [
      'Třída B je podtyp třídy A',
      'Vytvoří nový typ B',
      'Třída B je nadtyp třídy A',
      'Vytvoří novou subtype relaci mezi A a B, A <: B',
    ],
    correct: [2, 3],
    explanation:
      'Deklarace <code>class A extends B</code> <strong>zavádí nový typ A</strong> (B už existuje) a zároveň nominální relaci <code>A &lt;: B</code>. Tedy B je nadtyp A, ne podtyp.<br>' +
      '<strong>Past:</strong> „vytvoří nový typ B“ — nový je ten, který se právě deklaruje (A). Wiki má stejné odpovědi.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 35, quote: 'Nominal subtyping is the type relation introduced by the declaration.' },
      K1,
      img('bi_oop_24_25_quiz1.png', 'Kvíz K1 (2024/25) – screenshot'),
    ],
  },
  {
    id: 'wiki-k1-06',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Jaká je hodnota posledního výrazu (co se vypíše)?',
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

println(test(u) + test(v) + test(w))`,
    answer: '24',
    explanation:
      '<strong>1) <code>x.f</code> pro objekt C</strong> (všechny tři proměnné drží <code>new C</code>): C nemá vlastní <code>f</code> → <code>B.f = super.f * 2</code>; <code>super</code> je statické → <code>A.f = 1 + this.g</code>; <code>this</code> je dynamické → <code>C.g = 2</code>. Tedy <code>(1 + 2) * 2 = 6</code>.<br>' +
      '<strong>2) Overload <code>test</code></strong> se vybírá podle <em>statického</em> typu argumentu: <code>test(u)</code> (u: A) → 6, <code>test(v)</code> (v: C) → 6 + 4 = 10, <code>test(w)</code> (w: B) → 6 + 2 = 8.<br>' +
      'Součet <code>6 + 10 + 8 = 24</code>. Wiki uvádí 24 — souhlasí.<br>' +
      '<strong>Past:</strong> plést si pořadí v součtu (v je C, w je B) a zapomenout, že <code>this.g</code> uvnitř A volá přepsané <code>C.g</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L2', page: 18, quote: 'Different parameter types create overloads, static types choose between them.' },
      K1,
      img('1_quiz.png', 'Kvíz K1 (2024/25) – zadání kódu'),
    ],
  },
  {
    id: 'wiki-k1-07',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Uvažujte následující kód. Která tvrzení platí?',
    code: `val x: A = ???

def f(y: A) = ???`,
    options: [
      'Parametru y lze přiřadit hodnotu jakéhokoli podtypu A',
      'Proměnná x může nabývat pouze hodnoty typu A',
      'Parametru y lze přiřadit pouze hodnotu typu A',
      'Proměnné x lze přiřadit hodnotu typu A a jakýchkoli nadtypů A',
    ],
    correct: [0],
    explanation:
      'Subtyping: kde se čeká <code>A</code>, smí přijít hodnota libovolného <strong>podtypu</strong> A (přiřazení, argument i návratová hodnota). Platí to pro proměnnou x i parametr y stejně.<br>' +
      '„Pouze typu A“ je špatně (smí i podtypy), „nadtypy A“ je špatně (nadtyp nezaručuje, že má všechny členy A). Wiki má stejné odpovědi.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 32, quote: 'Assignments, arguments, and results accept a' },
      K1,
      img('oop_2024_10_14_marast_001.png', 'Kvíz K1 (2024/25), Marast 14. 10. 2024 – screenshot'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Kvíz K2 (2024/25) — parametric polymorphism
  {
    id: 'wiki-k2-01',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Může mít metoda typové parametry?',
    options: [
      'Ano',
      'Ano, ale pouze pokud je definována v abstraktní třídě',
      'Ano, ale nejvýše jeden',
      'Ano, ale pouze, pokud daná třída také definuje typové parametry',
      'Ne',
    ],
    correct: [0],
    explanation:
      'Metoda může mít libovolný počet vlastních typových parametrů, nezávisle na tom, jestli je třída generická nebo abstraktní: <code>class Plain { def pair[A, B](a: A, b: B) = (a, b) }</code> se přeloží. Hodnoty typových parametrů metody se dosazují (nebo odvodí) v místě volání.<br>' +
      'Na wiki jsou dvě varianty otázky (na jednom screenshotu chybí možnost „Ano“, tam jsou všechny nabízené možnosti špatně) — tady jsou sloučené.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 23, quote: 'values are provided at call sites' },
      K2,
      img('snímek_obrazovky_2024-10-19_115052.png', 'Kvíz K2 (2024/25) – varianta 1, screenshot'),
      img('oop-2024-marast-2-parametric.png', 'Kvíz K2 (2024/25) – varianta 2, screenshot'),
    ],
  },
  {
    id: 'wiki-k2-02',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Které z metod <code>ma</code>/<code>mb</code>/<code>mc</code>/<code>md</code> lze zavolat na <code>x</code> uvnitř metody <code>test</code>?',
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
  def test[R >: T](x: R): Unit = {
    // what can I call on x?
  }
}

val t = new Test[B]
t.test(new B)`,
    options: ['ma', 'mb', 'mc', 'md', 'žádnou z nich'],
    correct: [4],
    explanation:
      'Uvnitř <code>test</code> kompilátor o <code>R</code> ví jen <code>R &gt;: T</code> — a to i v definici, kde ještě vůbec neví, čím bude <code>T</code>. Dolní mez neříká nic o tom, co hodnota <em>umí</em>; R může být klidně <code>Any</code> (<code>t.test(42)</code> i <code>t.test("s")</code> se přeloží, R se odvodí jako společný nadtyp). Na <code>x</code> lze volat jen metody <code>Any</code>.<br>' +
      'Kompilátor u <code>x.ma()</code> hlásí <code>value ma is not a member of R</code>.<br>' +
      '<strong>Na wiki</strong> student zaškrtl jen <code>ma</code> a dostal 1 bod (částečně) — <code>ma</code> ve skutečnosti nejde. Původní kvíz měl jen 4 možnosti (správně = nic nezaškrtnout), možnost „žádnou z nich“ je doplněná.<br>' +
      '<strong>Past:</strong> horní mez (<code>&lt;:</code>) dává metody nadtypu, dolní mez (<code>&gt;:</code>) nedává žádné.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 76, quote: 'Lower bounds (>: T): write values safely to a consumer.' },
      K2,
    ],
  },
  {
    id: 'wiki-k2-03',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Co můžeme říci o nominálním a strukturálním typovém systému?',
    options: [
      'Strukturální typování je stejné jako duck typing',
      'Nominální typový systém určuje kompatibilitu typů pomocí explicitních deklarací',
      'Nominální typový systém určuje kompatibilitu typu na základě struktury typu',
      'Strukturální typový systém určuje kompatibilitu typů pomocí explicitních deklarací',
      'Strukturální typový systém určuje kompatibilitu typů pouze podle kompatibility struktury těch typů',
      'Strukturální typový systém kontroluje typování za běhu programu',
    ],
    correct: [1, 4],
    explanation:
      '<strong>Nominální</strong> (Scala, Java): podtyp jen když to explicitně deklaruješ (<code>extends</code>). <strong>Strukturální</strong> (Go interfaces): kompatibilita podle toho, jaké členy typ skutečně má.<br>' +
      'Duck typing vypadá jako strukturální, ale je to <strong>běhová</strong> vlastnost (Python, JS) — proto „strukturální = duck typing“ i „strukturální kontroluje za běhu“ jsou špatně.<br>' +
      'Na wiki jsou dva screenshoty s různými možnostmi, tady sloučené; odpovědi wiki souhlasí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 64, quote: 'type equivalence and compatibility is determined by explicit declarations' },
      { kind: 'slide', lecture: 'L2', page: 64, quote: "type equivalence and compatibility is determined by type's actual structure" },
      { kind: 'slide', lecture: 'L2', page: 64, quote: 'looks like structural typing, but it is a runtime characteristics' },
      K2,
      img('oop-2024-marast-2-parametric.png', 'Kvíz K2 (2024/25) – varianta 2, screenshot'),
      img('snímek_obrazovky_2024-10-20_163821.png', 'Kvíz K2 (2024/25) – varianta 3, screenshot'),
    ],
  },
  {
    id: 'wiki-k2-04',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Instance kterých tříd mohu použít pro parametr <code>x</code> při volání metody <code>test</code> na posledním řádku?',
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
  def test(x: T): Unit = {}
}

new Test[B]().test(???)`,
    options: ['C', 'A', 'Int', 'String'],
    correct: [0],
    explanation:
      '<code>T</code> je pevně dosazené na <code>B</code>, takže <code>test</code> má signaturu <code>test(x: B)</code>. Projde B a každý podtyp B — z nabízených jen <strong>C</strong>. A (nadtyp), Int a String neprojdou (<code>Found: A, Required: B</code>).<br>' +
      'Pozor na rozdíl oproti <code>test[R &gt;: T]</code>: tam je typový parametr metody volný a odvodí se, tady ne. Wiki souhlasí.',
    verified: 'scala',
    sources: [K2, img('snímek_obrazovky_2024-10-20_163821.png', 'Kvíz K2 (2024/25) – screenshot')],
  },

  // ---------------------------------------------------------------------------
  // Kvíz K4 (2024/25) — variance
  {
    id: 'wiki-k4-01',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K4 (2024/25)'] },
    prompt: 'Uvažujte následující definici: <code>class Producer[+T]</code> a rozhodněte, která tvrzení jsou správná.',
    options: [
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak Producer[A] není podtypem Producer[B]',
      'T je kovariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak i Producer[A] >: Producer[B]',
      'T je kontravariantní typový parametr',
    ],
    correct: [1],
    explanation:
      '<code>+T</code> = <strong>kovariance</strong>: subtyping se zachovává, <code>A &lt;: B ⇒ Producer[A] &lt;: Producer[B]</code>. Tím padá první možnost (je to přesně naopak) i třetí (to by byla kontravariance). Wiki souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[+T] means that the class C is covariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
      K4,
      img('oop_marast_4_parametric_01.png', 'Kvíz K4 (2024/25) – screenshot'),
    ],
  },
  {
    id: 'wiki-k4-02',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'real',
      seen: ['FIT Wiki – Kvíz K4 (2024/25)', 'Ukázkový midterm 2026, otázka 8'],
    },
    prompt:
      'Uvažujte generickou třídu <code>class Collection[T]</code> reprezentující kolekci prvků typu <code>T</code>. Jakou varianční anotaci musí <code>T</code> mít, aby se následující kód zkompiloval?',
    code: `class Dog extends Animal

var dogs: Collection[Dog] = ...
var animals: Collection[Animal] = dogs`,
    options: ['Vždy se zkompiluje', 'Nikdy se nezkompiluje', 'Kontravarianci', 'Kovarianci'],
    correct: [3],
    explanation:
      'Přiřazení <code>Collection[Dog]</code> do <code>Collection[Animal]</code> vyžaduje <code>Collection[Dog] &lt;: Collection[Animal]</code>, přičemž <code>Dog &lt;: Animal</code> — směr se zachovává, tedy <strong>kovariance</strong> (<code>Collection[+T]</code>).<br>' +
      'Bez anotace (invariance) to neprojde, s <code>-T</code> také ne. Wiki souhlasí; stejná otázka je i v ukázkovém midtermu.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
      { kind: 'official', label: 'Sample midterm 2026, otázka 8' },
      K4,
      img('oop_marast_4_parametric_01.png', 'Kvíz K4 (2024/25) – screenshot'),
    ],
  },
  {
    id: 'wiki-k4-03',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K4 (2024/25)', 'Kvíz 2 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Uvažujte definici <code>class CP[T]</code>. Vyberte pravdivá tvrzení.',
    options: [
      'T je invariantní typový parametr',
      'pokud A <: B pak CP[A] >: CP[B]',
      'pokud A <: B pak CP[A] není nadtyp CP[B]',
      'pokud A <: B pak CP[A] není podtyp CP[B]',
    ],
    correct: [0, 2, 3],
    explanation:
      'Bez anotace je parametr <strong>invariantní</strong>: z <code>A &lt;: B</code> neplyne žádná relace mezi <code>CP[A]</code> a <code>CP[B]</code> — ani podtyp, ani nadtyp (kompilátor odmítne přiřazení oběma směry).<br>' +
      '<strong>Drobná past:</strong> pro A = B (i to splňuje A &lt;: B) je CP[A] = CP[B], tedy podtyp i nadtyp. Kvíz to myslí pro různé A, B — oficiální odpověď (screenshot) je invariantní + „není nadtyp“ + „není podtyp“.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
      K4,
      img('2024-11-10_17-05.png', 'Kvíz K4 (2024/25) – screenshot'),
      // sloučeno z duplicit: kv2-07, anki-39
      { kind: 'image', src: '/sources/kvizy/q2/quiz_2_5.png', label: 'Kvíz 2 (2023/24, Discord) – screenshot', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'image', src: '/sources/kvizy/q2/quiz_2_11.png', label: 'Kvíz 2 (2023/24, Discord) – screenshot', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – BI-OOP (kvízy 2023/24 z Discordu)', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'wiki-k4-04',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'real',
      seen: ['FIT Wiki – Kvíz K4 (2024/25)', 'Ukázkový midterm 2026, otázka 6 (s více možnostmi)'],
    },
    prompt: 'Uvažujte definici <code>class Consumer[-T]</code> a rozhodněte, která tvrzení jsou správná.',
    options: [
      'T je kontravariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak Consumer[A] <: Consumer[B]',
      'T je kovariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak Consumer[A] >: Consumer[B]',
    ],
    correct: [0, 3],
    explanation:
      '<code>-T</code> = <strong>kontravariance</strong>: subtyping se otáčí, <code>A &lt;: B ⇒ Consumer[B] &lt;: Consumer[A]</code>, což je totéž jako <code>Consumer[A] &gt;: Consumer[B]</code>.<br>' +
      'Intuice: kdo umí zkonzumovat libovolné zvíře, poslouží i tam, kde se čeká konzument psů. Wiki souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[-T] means that the class C is contravariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
      { kind: 'official', label: 'Sample midterm 2026, otázka 6' },
      K4,
      img('2024-11-10_17-05.png', 'Kvíz K4 (2024/25) – screenshot'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Kvíz K7 (2024/25) + Marast 22. 10. 2020 + Marast 2021/22
  {
    id: 'wiki-k7-01',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K7 (2024/25)', 'FIT Wiki – Marast 22. 10. 2020', 'FIT Wiki – Marast 2021/22 (mix)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Uvažujte následující kód a rozhodněte, které řádky se zkompilují.',
    code: `class A;

class B extends A`,
    options: ['val x: Any = new A', 'val x: A = new B', 'val x: B = new A', 'val x: A = new Nothing'],
    correct: [0, 1],
    explanation:
      'Přiřazení projde, když typ hodnoty je podtyp deklarovaného typu: <code>A &lt;: Any</code> ✔, <code>B &lt;: A</code> ✔, <code>A &lt;: B</code> ✘ (<code>Found: A, Required: B</code>).<br>' +
      '<code>Nothing</code> je sice podtyp všeho, ale <strong>nemá žádné hodnoty ani konstruktor</strong> — <code>new Nothing</code> je chyba překladu (<code>Nothing does not have a constructor</code>).<br>' +
      'Na screenshotu z Marastu 2021/22 student zaškrtl i <code>new Nothing</code> a dostal jen 1 bod — to potvrzuje, že správně je jen Any a A = new B. Odpověď na stránce Marast 22. 10. 2020 (F, F, T, T) souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 32, quote: 'Assignments, arguments, and results accept a' },
      K7,
      M2210,
      MIX,
      img('oop_2024_k7_01.png', 'Kvíz K7 (2024/25) – screenshot'),
      img('bi-oop_marast_22_10_20.png', 'Marast 22. 10. 2020 – screenshot'),
      img('bi-oop_21-22_quiz3.png', 'Marast 2021/22 – screenshot'),
      // sloučeno z duplicit: anki-07
      { kind: 'image', src: '/sources/anki/paste-47c0e209e2e422cfb94ec73b206879782303fcd6.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'wiki-k7-02',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: {
      type: 'real',
      seen: ['FIT Wiki – Kvíz K7 (2024/25)', 'FIT Wiki – Marast 2021/22 (mix)'],
    },
    prompt: 'Co je pravdivé o abstraktní třídě?',
    options: [
      'Může definovat konstruktory.',
      'Nemůže být použita k vytvoření instancí.',
      'Může definovat abstraktní instanční proměnné a metody.',
      'Může definovat pouze abstraktní atributy a metody.',
      'Může dědit jenom z abstraktních tříd.',
    ],
    correct: [0, 1, 2],
    explanation:
      '<code>abstract class Shape(val name: String) { def area: Double; val sides: Int; def describe = ... }</code> — má konstruktor s parametrem, abstraktní metodu i abstraktní <code>val</code> a k tomu konkrétní metodu. Takže „pouze abstraktní“ neplatí.<br>' +
      '<code>new Shape(...)</code> neprojde (<code>Shape is abstract; it cannot be instantiated</code>). <code>new Shape("x") { ... }</code> vytvoří instanci <em>anonymní podtřídy</em>, ne samotné abstraktní třídy.<br>' +
      'Abstraktní třída smí dědit i z konkrétní třídy (<code>abstract class Mid extends Base</code>). Dvě varianty otázky z wiki jsou sloučené, odpovědi souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 46, quote: 'A trait is almost like an abstract class, but' },
      K7,
      MIX,
      img('oop_2024_k7_01.png', 'Kvíz K7 (2024/25) – screenshot'),
      img('bi-oop_21-22_quiz3.png', 'Marast 2021/22 – screenshot'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Kvíz K8 (2024/25)
  {
    id: 'wiki-k8-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Kvíz K8 (2024/25)'] },
    prompt: 'Co se stane, když spustíte následující kód?',
    code: `class A {
  def f = 1
}

class B extends A {
  override def f = 2
}

val b: B = new B()

print(b.f)
print(b.asInstanceOf[A].f)`,
    answer: '22',
    explanation:
      '<code>asInstanceOf[A]</code> je <strong>upcast</strong> — mění jen statický pohled (typ výrazu), ne objekt. Volání <code>f</code> je dynamické, rozhoduje běhová třída objektu = B → podruhé zase 2. Přetypování na nadtyp nikdy neselže.<br>' +
      'V kvízu byly možnosti „Vypíše se 11“, „Runtime exception“, „Vypíše se 21“, „Vypíše se 12“ — <strong>žádná není správně</strong>, program vypíše <code>22</code>.<br>' +
      '<strong>Past:</strong> myslet si, že cast „přepne“ na implementaci z A (jako u statického dispatche).',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 15, quote: 'Upcasting changes the view, not the object.' },
      { kind: 'slide', lecture: 'L2', page: 15, quote: 'The runtime receiver selects an overridden body.' },
      K8,
      img('screenshot_2024-12-07_191920.png', 'Kvíz K8 (2024/25) – screenshot'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Marast 2020/21
  {
    id: 'wiki-marast_15_10_20-01',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 15. 10. 2020'] },
    prompt: 'Objekt má…',
    options: ['invarianty', 'stav', 'identitu', 'chování'],
    correct: [0, 1, 2, 3],
    explanation:
      'Definice ze slidů: objekt = <strong>stav</strong> (pole), <strong>chování</strong> (metody) a <strong>identita</strong> (dva objekty se stejným stavem jsou různé, <code>a eq b</code> je false).<br>' +
      '<strong>Invarianty</strong> jsou podmínky na stav, které objekt udržuje (např. <code>count &gt;= 0</code>) — právě proto má zapouzdření smysl. Wiki uvádí všechny čtyři jako pravdivé; s tím souhlasíme.<br>' +
      '<strong>Past:</strong> zapomenout na identitu („Don\'t forget identity!“).',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 11, quote: 'An object is a structure with a state, behavior and identity' },
      { kind: 'slide', lecture: 'L2', page: 51, quote: 'Preserve invariants and any promised limits on side effects.' },
      M1510,
      img('bi-oop_marast_15.png', 'Marast 15. 10. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_15_10_20-02',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 15. 10. 2020'] },
    prompt: 'Neabstraktní třída A, která dědí od třídy B…',
    options: [
      'musí zavolat primární konstruktor třídy B',
      'musí zavolat jeden z konstruktorů třídy B',
      'musí implementovat všechny abstraktní členy',
      'pokud definuje svůj vlastní konstruktor, tak nemusí volat konstruktor třídy B',
    ],
    correct: [1, 2],
    explanation:
      'V <code>extends B(...)</code> podtřída vždy volá <strong>některý</strong> konstruktor B — klidně pomocný: <code>class B(a: Int, b: Int) { def this(a: Int) = this(a, 0) }</code>, <code>class A extends B(1)</code> volá pomocný <code>this(a)</code>. (Ten pak sám deleguje na primární, takže primární konstruktor B nakonec proběhne vždy — ale A ho volat <em>přímo</em> nemusí.) Žádný vlastní konstruktor A tohle volání nenahradí.<br>' +
      'Neabstraktní třída musí implementovat všechny zděděné abstraktní členy, jinak <code>class Y needs to be abstract, since def m: Int in class X is not defined</code>.<br>' +
      'Wiki: F, T, T, F — souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
      { kind: 'slide', lecture: 'L2', page: 8, quote: 'An auxiliary def this(...) must delegate to' },
      M1510,
      img('bi-oop_marast_15.png', 'Marast 15. 10. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_22_10_20-01',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'real',
      seen: ['FIT Wiki – Marast 22. 10. 2020', 'Ukázkový midterm 2026, otázka 2 (s možností Int)'],
    },
    prompt:
      'Instance kterých tříd mohou být dodány jako parametr <code>x</code> pro následující funkci: <code>def f[A &gt;: MyClass](x: A): Unit</code>',
    options: ['MyClass a všech jejích nadtříd', 'pouze MyClass', 'String', 'MyClass a všech jejích podtříd'],
    correct: [0, 2, 3],
    explanation:
      'Klíč: <code>A</code> je typový parametr <strong>metody</strong>, který kompilátor u každého volání odvodí. Hledá A, které je nadtyp MyClass <em>a zároveň</em> nadtyp typu argumentu:<br>' +
      '<ul><li><code>f(new MyClass)</code> → A = MyClass</li><li><code>f(new Base)</code> (nadtřída) → A = Base</li><li><code>f(new Sub)</code> (podtřída) → A = MyClass, protože Sub &lt;: MyClass</li><li><code>f("String")</code> → A = společný nadtyp (Any/Matchable)</li></ul>' +
      'Takže projde prakticky cokoli; „pouze MyClass“ je špatně. Wiki (T, F, T, T) souhlasí; stejná otázka je v ukázkovém midtermu.<br>' +
      '<strong>Past:</strong> číst <code>&gt;:</code> jako „jen nadtypy“ a vynechat podtřídy a String.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'T is Cat, R has to be Animal since that is' },
      { kind: 'official', label: 'Sample midterm 2026, otázka 2' },
      M2210,
      img('bi-oop_marast_22_10_20.png', 'Marast 22. 10. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_05_11_20-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 5. 11. 2020'] },
    prompt: 'Co vypíše následující kód?',
    code: `class A {
  def f: Int = 2
}

class B extends A {
  def g: Int = 1 + this.f
}

class C extends B {
  override def f: Int = 2 + super.f
  override def g: Int = 1 + super.g
}

println(new C().f)`,
    answer: '4',
    explanation:
      'Volá se jen <code>f</code>, <code>g</code> je návnada. <code>C.f = 2 + super.f</code>; <code>super</code> v C ukazuje na B, B <code>f</code> nedefinuje → zděděné <code>A.f = 2</code>. Výsledek <code>2 + 2 = 4</code>. Wiki (screenshot s odpovědí 4) souhlasí.<br>' +
      '<strong>Past:</strong> začít trasovat <code>g</code> a <code>this.f</code> — tady nehrají roli.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      M0511,
      img('bi-oop_marast_05.png', 'Marast 5. 11. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_12_11_20-01',
    kind: 'mc',
    topic: 'traits',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 12. 11. 2020'] },
    prompt: 'Co se stane, když spustíme následující kód?',
    code: `trait T {
  def f: Int = 1
}

trait T1 extends T {
  abstract override def f: Int = super.f + 1
}

trait T2 extends T {
  abstract override def f: Int = super.f * 3
}

class A extends T with T1 with T2
class B extends T with T2 with T1

print(new A().f)
print(new B().f)`,
    options: ['Vypíše se 66', 'Vypíše se 44', 'Vypíše se 64', 'Vypíše se 46'],
    correct: [2],
    explanation:
      'V traitech je <code>super</code> <strong>dynamický</strong> — určuje ho linearizace, nejpravější trait běží první.<br>' +
      '<strong>A</strong> = A → T2 → T1 → T: <code>T2.f = super.f * 3</code>, kde super je T1: <code>T1.f = T.f + 1 = 2</code> → <code>2 * 3 = 6</code>.<br>' +
      '<strong>B</strong> = B → T1 → T2 → T: <code>T1.f = super.f + 1</code>, super je T2: <code>T2.f = 1 * 3 = 3</code> → <code>3 + 1 = 4</code>.<br>' +
      'Vypíše <code>64</code>. Wiki (F, F, T, F) souhlasí.<br>' +
      '<strong>Past:</strong> skládat zleva doprava — první se aplikuje <em>nejvnitřnější</em> (nejlevější) úprava, poslední (nejpravější) trait ji obaluje.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 58, quote: 'In traits super uses late binding - dispatched dynamically' },
      { kind: 'slide', lecture: 'L6', page: 58, quote: 'Method call is determined by linearization' },
      M1211,
      img('bi-oop_marast_12_1.png', 'Marast 12. 11. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_12_11_20-02',
    kind: 'mc',
    topic: 'traits',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 12. 11. 2020'] },
    prompt: 'Třída…',
    options: [
      'Může kombinovat (mix-in) libovolný počet traitů.',
      'Může kombinovat (mix-in) libovolný počet traitů a na jejich pořadí záleží.',
      'Může kombinovat (mix-in) maximálně jeden trait.',
      'Může kombinovat (mix-in) libovolný počet traitů a na jejich pořadí nezáleží.',
    ],
    correct: [0, 1],
    explanation:
      'Třída může přimíchat libovolně mnoho traitů. Pořadí <strong>záleží</strong>: určuje linearizaci, a tím i kam vede <code>super</code> a která implementace „vyhraje“ (viz <code>T with T1 with T2</code> vs <code>T with T2 with T1</code> → 6 vs 4). Wiki (T, T, F, F) souhlasí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 46, quote: 'A class can mix in any number of traits and' },
      { kind: 'slide', lecture: 'L6', page: 58, quote: 'Method call is determined by linearization' },
      M1211,
      img('bi-oop_marast_12_2.png', 'Marast 12. 11. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_17_12_20-01',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 17. 12. 2020'] },
    prompt: 'Type class:',
    options: [
      'umožňuje ad-hoc polymorfismus.',
      'je synonymem pro třídu.',
      'odděluje data a operace s těmito daty.',
      'definuje operace na nějakém obecném typu.',
    ],
    correct: [0, 2, 3],
    explanation:
      'Type class (např. <code>trait Jsonable[T]</code>) je parametrizovaný trait s operacemi nad obecným typem T; instance (<code>given Jsonable[Player]</code>) je implementuje pro konkrétní typ. Data (Player) a schopnost (JSON) zůstávají oddělené, typy nepotřebují společnou nadtřídu → <strong>ad-hoc polymorfismus</strong>.<br>' +
      'Se „třídou“ v OOP smyslu nemá nic společného kromě jména. Wiki (T, F, T, T) souhlasí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 68, quote: 'Overloads and type classes provide two forms of ad-hoc polymorphism.' },
      { kind: 'slide', lecture: 'L6', page: 87, quote: 'We can add a type or an operation without a common domain superclass.' },
      { kind: 'slide', lecture: 'L6', page: 96, quote: 'Keep domain data separate from independent capabilities.' },
      M1712,
      img('bi-oop_marast_17_12.png', 'Marast 17. 12. 2020 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_17_12_20-02',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 17. 12. 2020'] },
    prompt: 'Extension methods umožňují přidávat nové metody do:',
    options: [
      'stávajících traits.',
      'stávajících tříd.',
      'existujících tříd, ale s nutností překompilovat tyto třídy.',
      'existujících traits, ale s nutností překompilovat tyto traits.',
    ],
    correct: [0, 1],
    explanation:
      '<code>extension (s: String) def shout = ...</code> přidá metodu i k cizí třídě (String), kterou vůbec nemůžeš upravit; stejně tak k traitu. Původní typ se nemění ani nepřekládá — kompilátor jen přepíše <code>s.shout</code> na volání extension funkce. Wiki (T, T, F, F) souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 90, quote: 'The syntax feels like a member method. The Player class and the JSON behavior stay separate.' },
      M1712,
      img('bi-oop_marast_17_12.png', 'Marast 17. 12. 2020 – screenshot'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Stránka „poly“
  {
    id: 'wiki-poly-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – stránka „poly“ (kvíz)'] },
    prompt: 'Co vypíše následující program?',
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
    answer: '23',
    explanation:
      '<strong>Signatura podle statických typů:</strong> <code>c: X</code>, X má jen <code>m(x: A)</code>. <code>Y.m(x: B)</code> je <em>overload</em>, ne override (jiný typ parametru) — přes X ho nikdy nevybereš, a <code>b</code> má stejně statický typ A.<br>' +
      '<strong>Běh:</strong> <code>X.m</code> volá <code>this.n(x)</code> → dynamicky <code>Y.n = super.n(x) + 1 = x.f + 1</code>.<br>' +
      '<code>c.m(a)</code> = 1 + 1 = 2, <code>c.m(b)</code> = 20 + 1 = 21 (f je dynamicky B.f). Součet <code>23</code>. Wiki (23) souhlasí.<br>' +
      '<strong>Past:</strong> odpovědět 30 pro <code>c.m(b)</code> — runtime typ argumentu overload nevybírá.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Runtime: for a virtual call, select the override for that signature' },
      POLY,
      img('quiz2.png', 'Stránka „poly“ – screenshot kvízu'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Marast 2021/22 (mix)
  {
    id: 'wiki-marast_2021_2022_mix-01',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 2021/22 (Kvíz K2 – zapouzdření)'] },
    prompt: 'V následujícím kódu, které metody na <code>x</code> mohu zavolat z metody <code>test</code> na řádku 8?',
    code: `class C {
  private def m1: Unit = {}
  private[this] def m2: Unit = {}
  protected def m3: Unit = {}
  def m4: Unit = {}

  def test(x: C) = {
    x.???
  }
}`,
    options: ['m3', 'm4', 'm1', 'm2'],
    correct: [0, 1, 2, 3],
    explanation:
      'Přístupová práva v Scale jsou <strong>na úrovni třídy</strong>, ne objektu: kód uvnitř třídy C smí volat <code>private</code> i <code>protected</code> členy <em>jiné</em> instance C (<code>x.m1</code>, <code>x.m3</code>). <code>m4</code> je public.<br>' +
      '<strong>Scala 3 vs. wiki:</strong> v kvízu z roku 2021 (Scala 2) byla správně m1, m3, m4 — <code>private[this]</code> tehdy znamenalo object-private a <code>x.m2</code> neprošlo. <strong>Scala 3 kvalifikátor <code>[this]</code> ignoruje</strong> (varování „Ignoring [this] qualifier … just write private instead“) a <code>m2</code> je obyčejné <code>private</code> → <code>x.m2</code> se přeloží. Ve Scale 3 (a to je jazyk midtermu) jdou tedy zavolat <strong>všechny čtyři</strong>.<br>' +
      '<strong>Past:</strong> myslet si, že <code>private</code> zakazuje přístup k cizí instanci téže třídy.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 13, quote: 'Private members are accessible only from' },
      { kind: 'slide', lecture: 'L5', page: 11, quote: 'Accessible in the deﬁning class, its companion, and subclasses.' },
      MIX,
      img('bi-oop_21-22_quiz2.png', 'Marast 2021/22, Kvíz K2 – zapouzdření – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_2021_2022_mix-02',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 2021/22 (mix, několik screenshotů)'] },
    prompt: 'Case classes…',
    options: [
      'Jsou užitečné pro datové modelování a použití při pattern matchingu.',
      'Mají implementaci ekvivalence, která porovná všechny stavové proměnné.',
      'Ve výchozím nastavení jsou neměnné (immutable).',
      'Ve výchozím nastavení jsou měnitelné (mutable).',
      'Pro rovnost, pokud chceme porovnávat obsah spíše než umístění v paměti, musíme přepsat equals a hashCode, jako u jakékoli jiné třídy.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Case class generuje <code>equals</code>/<code>hashCode</code> (porovnání podle polí), <code>toString</code>, <code>copy</code>, <code>apply</code> a extraktor pro pattern matching; parametry konstruktoru jsou implicitně <code>val</code> → neměnné (<code>a.name = "y"</code> neprojde). Ručně přepisovat equals tedy <strong>nemusíš</strong>.<br>' +
      'Přesněji: generovaná rovnost porovnává jen pole z parametrů konstruktoru, ne <code>var</code> deklarované v těle třídy. Kvíz (screenshot s 4/4 body) bere „porovná všechny stavové proměnné“ jako pravdu.<br>' +
      'Na wiki je otázka na 4 screenshotech s různým pořadím a sadou možností — tady sloučeno.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 30, quote: 'The val keyword is implicit in case classes' },
      { kind: 'slide', lecture: 'L5', page: 30, quote: 'extractor for pattern matching' },
      MIX,
      img('bi-oop_21-22_quiz4.png', 'Marast 2021/22, Kvíz K4 – screenshot (vyhodnocený)'),
      img('7.png', 'Marast 2021/22 – screenshot'),
      img('8.png', 'Marast 2021/22, Kvíz K4 – screenshot'),
      img('10.png', 'Marast 2021/22 – screenshot'),
    ],
  },
  {
    id: 'wiki-marast_2021_2022_mix-03',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 2021/22 (mix)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co bude výstupem po spuštění tohoto programu?',
    code: `trait Show[T] {
  def show(x: T): String
}

case class Student(name: String)
case class Teacher(name: String)

given studentShow: Show[Student] with
  def show(x: Student) = s"Student: \${x.name}"

def printIt[T](x: T)(using s: Show[T]): Unit =
  println(s.show(x))

printIt(Student("Jon Doe"))
printIt(Teacher("Jon Doe"))`,
    options: [
      'Vypíše „Student: Jon Doe“ dvakrát.',
      'Vypíše „Student: Jon Doe“ a následně „Teacher: Jon Doe“.',
      'Chyba za kompilace – chybí implementace Show pro Teacher.',
      'Chyba za běhu programu – chybí implementace Show pro Teacher.',
    ],
    correct: [2],
    explanation:
      'U <code>printIt(Teacher(...))</code> se T odvodí jako <code>Teacher</code> a kompilátor hledá <code>given Show[Teacher]</code>. Žádná není → <strong>chyba překladu</strong> (<code>No given instance of type Show[Teacher]</code>). Instance se vybírá staticky, za běhu se nic nehledá, a <code>Show[Student]</code> pro Teacher použít nejde.<br>' +
      'Původní kód (Scala 2) používal <code>implicit val</code> / <code>(implicit s: Show[T])</code> a funkci jménem <code>print</code>; přepsáno do Scala 3 (<code>given</code>/<code>using</code>), chování je stejné. Wiki souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 88, quote: 'If no best candidate exists, compilation fails.' },
      { kind: 'slide', lecture: 'L6', page: 87, quote: 'The compiler selects the instance from the static types and the context.' },
      MIX,
      img('bi-oop_21-22_quiz1.jpg', 'Marast 2021/22 – screenshot (type class Show)'),
      // sloučeno z duplicit: anki-20
      { kind: 'image', src: '/sources/anki/paste-07d251e6ce320f0107ee1e63c7b0d144b46b4810.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'wiki-marast_2021_2022_mix-04',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 2021/22 (mix)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co platí pro následující kus kódu?',
    code: `trait Show[T] {
  def show(x: T): String
}

case class Student(name: String)

given studentShow: Show[Student] with
  def show(x: Student) = s"Student: \${x.name}"

def print[T](x: T)(using s: Show[T]): Unit =
  println(s.show(x))`,
    options: [
      'Metoda print používá type class Show.',
      'studentShow (given/implicitní hodnota) je instancí type class.',
      'Metoda print je type class.',
      'Trait Show[T] je type class.',
    ],
    correct: [0, 1, 3],
    explanation:
      'Role v type class patternu: <strong>type class</strong> = <code>Show[T]</code> (operace), <strong>instance</strong> = <code>studentShow: Show[Student]</code>, <strong>generická funkce, která schopnost vyžaduje</strong> = <code>print</code> (<code>using Show[T]</code>). Funkce sama type class není.<br>' +
      'Původně Scala 2 (<code>implicit val</code>), přepsáno do Scala 3. Wiki souhlasí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 87, quote: 'An instance implements those operations for a type: Jsonable[Player].' },
      { kind: 'slide', lecture: 'L6', page: 87, quote: 'A generic function requests the capability: using Jsonable[T].' },
      MIX,
      img('bi-oop_21-22_quiz1.jpg', 'Marast 2021/22 – screenshot (type class Show)'),
      // sloučeno z duplicit: anki-21
      { kind: 'image', src: '/sources/anki/paste-4b4a4187fbe16e1a593426e00cc0d01656b7f83c.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'wiki-marast_2021_2022_mix-05',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Marast 2021/22 (mix)'] },
    prompt: 'Ve statickém volání (static dispatch):',
    options: [
      'Volaná metoda závisí na typech proměnných a výrazů v době kompilace.',
      'Je to výchozí volání metod ve Scale.',
      'Vlastní metoda je vyřešena v době kompilace.',
      'V traitech se volání super řeší staticky.',
    ],
    correct: [0, 2],
    explanation:
      'Statický dispatch: cíl volání je pevně daný už při překladu podle statických typů (private/final metody, metody z <code>object</code>, <code>super</code> ve <em>třídě</em>).<br>' +
      'Výchozí volání instančních metod na JVM/ve Scale je ale <strong>dynamické</strong> (virtuální) → 2. možnost neplatí.<br>' +
      'V <strong>traitech</strong> je <code>super</code> naopak <strong>dynamické</strong> (určí ho až linearizace konkrétní třídy) → 4. možnost neplatí.<br>' +
      '<strong>Na wiki</strong> student zaškrtl i „v traitech se super řeší staticky“ a dostal jen 1 bod — to je ta chyba.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L6', page: 46, quote: 'the calls to super are resolved dynamically (unlike in a class where it is static)' },
      MIX,
      img('bi-oop_21-22_quiz09.jpg', 'Marast 2021/22 – screenshot (static dispatch)'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Midterm 4. 11. 2019 (papír)
  {
    id: 'wiki-test_04_11_19-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Midterm 4. 11. 2019 (cvičení 3)'] },
    prompt: 'Co program vypíše? (Nápověda ze zadání: rozmysli, která volání jsou dynamický a která statický dispatch.)',
    code: `class A {
  def f = this.g
  def g = 1
}

class B extends A {
  override def f = super.f + 1
  override def g = 2
}

class C extends A {
  override def g = super.g + 5
}

class D extends C {
  override def f = super.g + 1
  override def g = 10
}

val v1: A = new A
val v2: A = new B
val v3: A = new C
val v4: D = new D

println(v1.f)
println(v2.f)
println(v3.f)
println(v4.f)`,
    answer: '1\n3\n6\n7',
    explanation:
      '<code>this.g</code> = dynamicky (podle runtime třídy), <code>super.x</code> = staticky (třída za <code>extends</code>).<br>' +
      '<ul><li><code>v1.f</code> = A.g = <strong>1</strong></li>' +
      '<li><code>v2.f</code> = B.f = <code>super.f + 1</code> → A.f = <code>this.g</code> = B.g = 2 → <strong>3</strong></li>' +
      '<li><code>v3.f</code> = A.f = <code>this.g</code> = C.g = <code>super.g + 5</code> = 1 + 5 = <strong>6</strong></li>' +
      '<li><code>v4.f</code> = D.f = <code>super.g + 1</code> → C.g = <code>super.g + 5</code> → A.g = 1 → 6, +1 = <strong>7</strong></li></ul>' +
      '<strong>Past:</strong> u v4 dosadit D.g = 10 — ale <code>super.g</code> volá C.g a uvnitř C.g je zase <code>super.g</code> (A.g), ne <code>this.g</code>. Wiki (1, 3, 6, 7) souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      T0411,
      img('oop2.jpg', 'Midterm 4. 11. 2019 – foto strany 2 (cvičení 3)'),
    ],
  },
  {
    id: 'wiki-test_04_11_19-02',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Midterm 4. 11. 2019 (cvičení 4)'] },
    prompt:
      'Co program vypíše? (Nápověda ze zadání: začni linearizací hierarchie od třídy E; třídy, které už v řetězci jsou, se vynechávají, každá se objeví jen jednou.)',
    code: `class A {
  def f = "A"
}

trait B extends A {
  override abstract def f = super.f + "B"
}

trait C extends A {
  override abstract def f = super.f + "C"
}

trait D extends C {
  override abstract def f = super.f + "D"
}

class E extends A with B with D

println((new E).f)`,
    answer: 'ABCD',
    explanation:
      'Linearizace E (zprava, do hloubky, při duplicitě nech poslední výskyt): D → C → A, B → A, A ⇒ <code>E, D, C, B, A</code>.<br>' +
      'Volání: <code>E.f</code> = D.f = <code>super.f + "D"</code>, super za D v linearizaci je C → <code>C.f = super.f + "C"</code>, super je B → <code>B.f = super.f + "B"</code>, super je A → <code>"A"</code>. Skládá se zevnitř: <code>"A" + "B" + "C" + "D" = "ABCD"</code>.<br>' +
      '<strong>Past:</strong> super v traitu B neukazuje na A podle deklarace <code>extends A</code>, ale na následníka v linearizaci konkrétní třídy. Wiki (ABCD) souhlasí. Kód se v této podobě přeloží i ve Scale 3.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 59, quote: 'before eliminating all but the last occurrence of each module in the resulting list' },
      { kind: 'slide', lecture: 'L6', page: 58, quote: 'In traits super uses late binding - dispatched dynamically' },
      T0411,
      img('oop3.jpg', 'Midterm 4. 11. 2019 – foto strany 3 (cvičení 4)'),
    ],
  },
  {
    id: 'wiki-test_04_11_19-03',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Midterm 4. 11. 2019 (poznámka k řešení cvičení 4)'] },
    prompt: 'Varianta z poznámky k řešení na wiki: stejné definice A, B, C, D, ale jiná třída E. Co se vypíše?',
    code: `class A {
  def f = "A"
}

trait B extends A {
  override abstract def f = super.f + "B"
}

trait C extends A {
  override abstract def f = super.f + "C"
}

trait D extends C {
  override abstract def f = super.f + "D"
}

class E extends A with C with D with B

println((new E).f)`,
    answer: 'ACDB',
    explanation:
      'Zprava: B → A; D → C → A; C → A; A. Po odstranění dřívějších duplicit: <code>E, B, D, C, A</code>.<br>' +
      'Volání jde E → B → D → C → A a písmena se přidávají při návratu: <code>"A" + "C" + "D" + "B" = "ACDB"</code>. B je nejpravější, proto je jeho písmeno poslední; C se neopakuje, i když je v hierarchii dvakrát (přímo a přes D). Wiki (ACDB) souhlasí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 59, quote: 'before eliminating all but the last occurrence of each module in the resulting list' },
      T0411,
    ],
  },
  {
    id: 'wiki-test_04_11_19-04',
    kind: 'open',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Midterm 4. 11. 2019 (cvičení 5)'] },
    prompt:
      'Je dána následující definice <code>List</code>. (1) Definujte v traitu <code>List</code> metodu <code>++</code>, která spojí dva seznamy tak, že pro <code>xs: List[A]</code> a <code>ys: List[B]</code>, kde A je nadtyp B, je výsledkem <code>xs ++ ys</code> seznam, kde všechny prvky xs předcházejí prvkům ys. (2) Určete složitost vaší implementace v O-notaci.',
    code: `sealed trait List[+T] {
  def head: T
  def tail: List[T]
  def isEmpty: Boolean
}

case object Nil extends List[Nothing] {
  def head: Nothing = throw new NoSuchElementException()
  def tail: List[Nothing] = throw new NoSuchElementException()
  def isEmpty = true
}

case class Cons[+T](head: T, tail: List[T]) extends List[T] {
  def isEmpty = false
}`,
    modelAnswer:
      '<code>def ++[U &gt;: T](ys: List[U]): List[U] = if isEmpty then ys else Cons(head, tail ++ ys)</code><br>' +
      'Parametr <code>ys: List[T]</code> nejde — T je kovariantní a nesmí být v kontravariantní pozici (parametr metody). Řeší se to dolní mezí <code>U &gt;: T</code> (stejně jako <code>appended[R &gt;: T]</code> ze slidů). Pro <code>xs: List[Animal] ++ ys: List[Dog]</code> se U odvodí jako Animal (List[Dog] &lt;: List[Animal] díky kovarianci). ' +
      'Složitost <strong>O(n)</strong>, kde n = délka xs (prvky xs se zkopírují, ys se jen připojí).',
    explanation:
      'Ověřeno scala-cli: <code>xs ++ ys</code> s <code>xs: List[Animal]</code>, <code>ys: List[Dog]</code> vrátí <code>List[Animal]</code> v pořadí xs, pak ys.<br>' +
      '<strong>Na wiki</strong> autor řešení s <code>[R &gt;: T]</code> tvrdí, že „porušuje zadání“, protože l je nadtyp T. To je omyl: U je jen typ <em>výsledku</em>; díky kovarianci se <code>List[B]</code> s B &lt;: A předá jako <code>List[A]</code>, takže U = A přesně odpovídá zadání. Alternativa přes <code>implicit class</code> s <code>[B &lt;: A]</code> z wiki není potřeba.<br>' +
      '<strong>Past:</strong> napsat <code>def ++(ys: List[T])</code> → chyba „covariant type T occurs in contravariant position“.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'def appended[R >: T](e: R): List[R]' },
      { kind: 'slide', lecture: 'L4', page: 50, quote: 'covariant type T occurs in' },
      T0411,
      img('oop3.jpg', 'Midterm 4. 11. 2019 – foto strany 3 (definice List)'),
      img('oop4.jpg', 'Midterm 4. 11. 2019 – foto strany 4 (zadání cvičení 5)'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Midterm 5. 11. 2019 (papír)
  {
    id: 'wiki-test_05_11_19-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Midterm 5. 11. 2019 (cvičení 2)'] },
    prompt: 'Co program vypíše? (Nápověda ze zadání: rozmysli, která volání jsou dynamický a která statický dispatch.)',
    code: `class A {
  def x = this.y
  def y = "A"
}

class B extends A {
  override def x = super.x + "K"
  override def y = "B"
}

class C extends A {
  override def y = super.y + "C"
}

class D extends C {
  override def x = super.y + "L"
  override def y = "D"
}

val v1: A = new A
val v2: A = new B
val v3: A = new C
val v4: D = new D

println(v1.x)
println(v2.x)
println(v3.x)
println(v4.x)`,
    answer: 'A\nBK\nAC\nACL',
    explanation:
      'Stejný vzor jako midterm 4. 11. 2019, jen s řetězci.<br>' +
      '<ul><li><code>v1.x</code> = A.y = <strong>A</strong></li>' +
      '<li><code>v2.x</code> = <code>super.x + "K"</code> → A.x = <code>this.y</code> = B.y = "B" → <strong>BK</strong></li>' +
      '<li><code>v3.x</code> = A.x = <code>this.y</code> = C.y = <code>super.y + "C"</code> = <strong>AC</strong></li>' +
      '<li><code>v4.x</code> = D.x = <code>super.y + "L"</code> → C.y = A.y + "C" = "AC" → <strong>ACL</strong></li></ul>' +
      '<strong>Past:</strong> u v4 použít D.y = "D" — <code>super.y</code> je statický odkaz na C.y, a ten volá <code>super.y</code> (A.y), ne <code>this.y</code>. Na wiki k této variantě řešení není.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
      T0511,
      img('bi-oop_page_02.jpg', 'Midterm 5. 11. 2019 – foto strany 2 (cvičení 2)'),
    ],
  },

  // ---------------------------------------------------------------------------
  // Zkouška 13. 1. 2026
  {
    id: 'wiki-zkouska_13_1_26-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Zkouška 13. 1. 2026'] },
    prompt: 'Co vypíše tento program s několika overloaded metodami?',
    code: `class A {
  def m(other: A): Int = 1
}

class B extends A {
  def m(other: B): Int = 2
  def m(other: C): Int = 3
}

class C extends A {
  def m(other: B): Int = 4
  def m(other: C): Int = 5
}

val ab: A = new B()
val ac: A = new C()
val b: B = new B()
val c: C = new C()

println(ab.m(ac))
println(b.m(c))
println(ab.m(ac))`,
    answer: '1\n3\n1',
    explanation:
      'Žádná metoda v B ani C nepřepisuje <code>m(other: A)</code> — všechny jsou <strong>overloady</strong> s jiným typem parametru.<br>' +
      '<code>ab.m(ac)</code>: statický typ příjemce A → jediná kandidátka <code>m(A)</code>; za běhu je ab typu B, ale B <code>m(A)</code> nepřepsal → <strong>1</strong>.<br>' +
      '<code>b.m(c)</code>: statický typ B nabízí <code>m(A)</code>, <code>m(B)</code>, <code>m(C)</code>; argument má statický typ C → nejspecifičtější <code>m(C)</code> → <strong>3</strong>.<br>' +
      'Třetí řádek je stejný jako první → <strong>1</strong>. (Na wiki je <code>def main(args: Array[String])</code>; tady top-level kód. Řešení na wiki není.)<br>' +
      '<strong>Past:</strong> u <code>ab.m(ac)</code> očekávat 5 — Scala nemá double dispatch, runtime typ argumentu se nezohledňuje.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      { kind: 'slide', lecture: 'L2', page: 18, quote: 'Different parameter types create overloads, static types choose between them.' },
      Z1301,
    ],
  },
  {
    id: 'wiki-zkouska_13_1_26-02',
    kind: 'open',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['FIT Wiki – Zkouška 13. 1. 2026'] },
    prompt: 'Jaký je rozdíl mezi dědičností (inheritance) a subtypingem?',
    modelAnswer:
      '<strong>Subtyping</strong> je vztah mezi <em>typy</em>: <code>B &lt;: A</code> znamená, že hodnotu typu B lze bezpečně použít všude, kde se čeká A (substituce, LSP). ' +
      '<strong>Dědičnost</strong> je mechanismus <em>znovupoužití kódu</em>: třída převezme definice (pole, metody) jiné třídy a může je přepsat nebo doplnit. ' +
      'Ve Scale/Javě <code>class B extends A</code> (subclassing) zavede obojí najednou — dědičnost i nominální subtyping. V principu jsou ale nezávislé: subtyping bez dědičnosti (strukturální typy, interface inheritance bez implementace), dědičnost bez subtypingu (znovupoužití kódu, kde podtřída nedodrží kontrakt — porušení LSP; nebo private dědičnost v C++). Kompilátor zaručí jen nominální vztah, ne behaviorální subtyping.',
    explanation:
      'Na zkoušce se čeká: definice obou pojmů, že <code>extends</code> dává obojí, a příklad, kdy jedno bez druhého (strukturální typování / porušení LSP). Viz slidy L2 o subclassing vs. inheritance vs. subtyping.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 75, quote: 'every value of type B can safely be used wherever a value of type A is expected.' },
      { kind: 'slide', lecture: 'L2', page: 76, quote: 'In many OOP languages (Java, C#), subclassing automatically induces subtyping: if class B extends' },
      { kind: 'slide', lecture: 'L2', page: 35, quote: 'A compiler can establish the nominal relation without proving the behavioral one.' },
      Z1301,
    ],
  },
  {
    id: 'wiki-zkouska_13_1_26-03',
    kind: 'open',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Zkouška 13. 1. 2026'] },
    prompt:
      'Na kterém řádku program spadne (nepřeloží se), proč, a navrhněte 2 řešení — u každého diskutujte výhody a nevýhody.',
    code: `class Product(val name: String) {
  override def toString: String = name
}
class Mobile(name: String) extends Product(name)
class Laptop(name: String) extends Product(name)

class Inventory[T] {
  private var items: List[T] = List()

  def add(item: T): Unit = { items = item :: items }
  def getItems: List[T] = items
}

def printAll(inventory: Inventory[Product]): Unit = {
  println("Printing inventory:")
  inventory.getItems.foreach(println)
}

val laptopInventory = new Inventory[Laptop]()
laptopInventory.add(new Laptop("MacBook Pro"))
printAll(laptopInventory)

val mobileInventory = new Inventory[Mobile]()
mobileInventory.add(new Mobile("iPhone 15"))
printAll(mobileInventory)`,
    modelAnswer:
      'Chyba překladu na <code>printAll(laptopInventory)</code> (a stejně u <code>printAll(mobileInventory)</code>): <code>Found: Inventory[Laptop], Required: Inventory[Product]</code>. <code>Inventory[T]</code> je <strong>invariantní</strong>, takže z <code>Laptop &lt;: Product</code> neplyne <code>Inventory[Laptop] &lt;: Inventory[Product]</code>.<br>' +
      '<strong>Řešení 1 – horní mez:</strong> <code>def printAll[T &lt;: Product](inventory: Inventory[T])</code>. + Inventory zůstane měnitelné a beze změny; + bezpečné, funkce jen čte. − Musí se upravit každá taková funkce zvlášť.<br>' +
      '<strong>Řešení 2 – kovariance:</strong> <code>class Inventory[+T]</code>. Nejde jen připsat <code>+</code>: <code>add(item: T)</code> má T v kontravariantní pozici. Musí se změnit na neměnnou verzi <code>def add[U &gt;: T](item: U): Inventory[U]</code> (vrací nový inventář). + <code>Inventory[Laptop]</code> lze předat všude, kde se čeká <code>Inventory[Product]</code>; + neměnnost. − Mění API a sémantiku (add už nemutuje), všichni klienti se musí přizpůsobit.<br>' +
      '(Další možnost: deklarovat proměnnou rovnou jako <code>Inventory[Product]</code> — ale pak se do ní dají přidat i mobily.)',
    explanation:
      'Ověřeno scala-cli: původní kód hlásí type mismatch na obou voláních <code>printAll</code>; verze s <code>[T &lt;: Product]</code> i kovariantní neměnná verze se přeloží a vypíší inventář. Samotné <code>class Inventory[+T]</code> s <code>add(item: T)</code> se nepřeloží (covariant type T occurs in contravariant position).<br>' +
      '<strong>Past:</strong> „spadne za běhu“ — ne, je to chyba při překladu. Na wiki řešení není.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
      { kind: 'slide', lecture: 'L4', page: 76, quote: 'Upper bounds (<: T): read values safely from a producer.' },
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'def appended[R >: T](e: R): List[R]' },
      Z1301,
    ],
  },

  // ---------------------------------------------------------------------------
  // Zkouška 23. 1. 2026
  {
    id: 'wiki-oop_zkouska_2026-01-23-01',
    kind: 'open',
    topic: 'composition',
    lecture: 'L6',
    origin: { type: 'real', seen: ['FIT Wiki – Zkouška 23. 1. 2026'] },
    prompt: 'Vysvětlete composition a inheritance. V jakém případě je vhodnější který přístup?',
    modelAnswer:
      '<strong>Inheritance</strong> (<code>class B extends A</code>): B převezme implementaci A a stane se jejím podtypem („is-a“). Vazba je pevná, při překladu, a B závisí na vnitřních self-calls A (křehká základní třída); jedna osa variability na podtřídu → kombinace vedou k explozi podtříd.<br>' +
      '<strong>Composition</strong> (<code>class B(a: A)</code>): B <em>obsahuje</em> objekt A a deleguje na něj („has-a“). Části lze vyměnit za běhu, kombinovat (decorator: <code>Compressed(Pdf())</code>), skrýt vnitřek; subtyping se zachová přes malý interface.<br>' +
      '<strong>Kdy co:</strong> inheritance jen pokud je podtřída skutečný podtyp a dodrží kontrakt nadtřídy (LSP), např. stabilní framework s dokumentovanými hooky. Pro pouhé znovupoužití kódu, pro nezávisle se měnící chování nebo když se kontrakty liší (BoundedCounter vs Counter) → composition.',
    explanation:
      'Slidy L6: „Use composition instead of inheritance“ (serializéry), pravidla „If you only need code reuse, start with a private component“ a „Choose a base class only if every subtype can keep its contract“.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L6', page: 34, quote: 'If you only need code reuse, start with a private component.' },
      { kind: 'slide', lecture: 'L6', page: 34, quote: 'Choose a base class only if every subtype can keep its contract.' },
      { kind: 'slide', lecture: 'L6', page: 17, quote: 'If behaviors vary independently, put them in separate components.' },
      { kind: 'slide', lecture: 'L2', page: 50 },
      Z2301,
    ],
  },
  {
    id: 'wiki-oop_zkouska_2026-01-23-02',
    kind: 'output',
    topic: 'erasure',
    lecture: 'L4',
    origin: { type: 'real', seen: ['FIT Wiki – Zkouška 23. 1. 2026'] },
    prompt:
      'Funkce bere parametr typu <code>Any</code> a pattern-matchuje ho. Co vrátí pro argument typu <code>List[String]</code> a co pro <code>List[Int]</code>? (Co se vypíše?)',
    code: `def isStringList(x: Any): Boolean = x match {
  case _: List[String] => true
  case _ => false
}

println(isStringList(List("a", "b")))
println(isStringList(List(1, 2, 3)))`,
    answer: 'true\ntrue',
    explanation:
      '<strong>Type erasure:</strong> typové argumenty generik za běhu neexistují. Test <code>case _: List[String]</code> umí za běhu ověřit jen „je to List“; <code>[String]</code> se zahodí (kompilátor varuje, že test je <em>unchecked</em>). Proto i <code>List(1, 2, 3)</code> vrátí <code>true</code>.<br>' +
      'Zadání na wiki je jen slovní (funkce s <code>_: List[String] =&gt; true, _ =&gt; false</code>); kód je podle něj doplněný. Řešení na wiki není.<br>' +
      '<strong>Past:</strong> odpovědět „true, false“ — tak by to fungovalo jen s reifikovanými generiky (C#).',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 62, quote: 'for compile-time only, no type parameters are present at runtime' },
      { kind: 'slide', lecture: 'L4', page: 78, quote: 'Type erasure removes generic type arguments at runtime (Java, Scala).' },
      Z2301,
    ],
  },
]
