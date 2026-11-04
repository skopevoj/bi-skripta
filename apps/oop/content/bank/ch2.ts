import type { Question } from '../types'

// Practice questions for chapter 2 (L2 Subtyping polymorphism).
// Every 'scala'-verified answer was compiled/run with scala-cli (Scala 3.9.0).

export const ch2: Question[] = [
  // ---------------------------------------------------------------- 2.1 objekty
  {
    id: 'ch2-01',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slide 5 (A parameter is not necessarily a public field)',
      why: 'Procvičí rozdíl mezi obyčejným parametrem konstruktoru, val, var a private var – na tom stojí každá otázka „zkompiluje se to?“.',
    },
    prompt: `Která z řádků se <strong>zkompilují</strong> (každý zvlášť, vložený za <code>val c = ...</code>)?`,
    code: `class Counter(init: Int, val step: Int, var label: String):
  private var count: Int = init

val c = Counter(1, 2, "a")`,
    options: [
      '<code>println(c.init)</code>',
      '<code>println(c.step)</code>',
      '<code>c.step = 5</code>',
      '<code>c.label = "x"</code>',
      '<code>println(c.count)</code>',
      '<code>c = Counter(3, 4, "b")</code>',
    ],
    correct: [1, 3],
    explanation: `<ul>
<li><code>init</code> je jen vstup konstruktoru (bez <code>val</code>/<code>var</code>) – zvenku není člen → CE.</li>
<li><code>val step</code> je veřejný read-only člen → čtení OK, přiřazení CE („Reassignment to val step“).</li>
<li><code>var label</code> je veřejný a má i setter → <code>c.label = "x"</code> OK.</li>
<li><code>count</code> je <code>private</code> → CE.</li>
<li><code>c</code> je <code>val</code> → referenci nelze přesměrovat → CE („Reassignment to val c“).</li>
</ul>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 5, quote: 'init: constructor input, available inside the' },
      { kind: 'slide', lecture: 'L2', page: 5, quote: 'A constructor parameter declared var also' },
      { kind: 'slide', lecture: 'L2', page: 4, quote: 'val step exposes a read-only member.' },
    ],
  },
  {
    id: 'ch2-02',
    kind: 'output',
    topic: 'objekty',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 8–9 (Construction runs the class body; val fixes the reference, not the object)',
      why: 'Ověří, že víš, kdy běží tělo třídy a že přiřazení kopíruje referenci, ne objekt.',
    },
    prompt: 'Co se vypíše?',
    code: `class Counter(init: Int):
  println("init " + init)
  private var count = init
  def inc(): Unit = count += 1
  def get = count

val a = Counter(1)
var b = a
b.inc()
b = Counter(10)
b.inc()
println(a.get)
println(b.get)`,
    answer: `init 1
init 10
2
11`,
    explanation: `<ol>
<li><code>Counter(1)</code> spustí tělo třídy → vypíše <code>init 1</code>.</li>
<li><code>var b = a</code> zkopíruje <em>referenci</em> – <code>a</code> i <code>b</code> ukazují na stejný objekt. <code>b.inc()</code> → count tohoto objektu je 2.</li>
<li><code>b = Counter(10)</code> vytvoří nový objekt (vypíše <code>init 10</code>) a přesměruje jen <code>b</code>. <code>a</code> pořád ukazuje na první objekt.</li>
<li><code>b.inc()</code> → 11. Výsledek: <code>a.get</code> = 2, <code>b.get</code> = 11.</li>
</ol>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 8, quote: 'Field initializers and statements run in source' },
      { kind: 'slide', lecture: 'L2', page: 9, quote: 'Assignment copies a reference, not the object.' },
    ],
  },

  // ---------------------------------------------------------------- 2.2 this / super
  {
    id: 'ch2-03',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm otázka 7 a L4 warm-up Q4 (super.f * this.g)',
      why: 'Drilluje kombinaci super řetězu (statický) a this-volání uvnitř předka (dynamické).',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def name = "A"
  def hello = "hello " + name

class B extends A:
  override def name = "B"
  override def hello = super.hello + "!"

class C extends B:
  override def name = "C" + super.name

val x: A = C()
println(x.hello)`,
    answer: 'hello CB!',
    explanation: `<ol>
<li><code>x.hello</code>: statický typ <code>A</code> má <code>hello</code> → kompiluje. Runtime třída <code>C</code>; <code>C</code> nepřepisuje <code>hello</code> → nejbližší je <code>B.hello</code>.</li>
<li><code>B.hello</code> = <code>super.hello + "!"</code>. <code>super</code> v <code>B</code> = vždy <code>A.hello</code> (statické).</li>
<li><code>A.hello</code> = <code>"hello " + name</code>. <code>name</code> je <code>this.name</code> → dynamické, objekt je pořád <code>C</code> → <code>C.name</code>.</li>
<li><code>C.name</code> = <code>"C" + super.name</code> = <code>"C" + B.name</code> = <code>"CB"</code>.</li>
<li>Složeno: <code>"hello " + "CB" + "!"</code> = <code>hello CB!</code>.</li>
</ol>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L4', page: 12 },
    ],
  },
  {
    id: 'ch2-04',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slide 22 (private methods = static dispatch) a L4 slide 5 (private inc)',
      why: 'Past: stejnojmenná metoda v podtřídě nepřepíše private metodu předka, takže volání uvnitř předka jde na původní.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  private def secret = 1
  def x = 10
  def show = secret + x

class B extends A:
  def secret = 2
  override def x = 20

println(B().show)`,
    answer: '21',
    explanation: `<ol>
<li><code>B.secret</code> není override – <code>A.secret</code> je <code>private</code>, podtřída ho „nevidí“, takže <code>B.secret</code> je úplně nová metoda (proto se ani nevyžaduje <code>override</code>).</li>
<li><code>show</code> je jen v <code>A</code>. Volání <code>secret</code> uvnitř <code>A</code> míří na private metodu → statický dispatch → <code>A.secret</code> = 1.</li>
<li><code>x</code> je běžná metoda → dynamický dispatch → <code>B.x</code> = 20.</li>
<li>1 + 20 = <code>21</code>.</li>
</ol>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' },
      { kind: 'slide', lecture: 'L4', page: 5 },
    ],
  },

  // ---------------------------------------------------------------- 2.3 overloading vs overriding
  {
    id: 'ch2-05',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slide 18 (static types choose between overloads)',
      why: 'Nejjednodušší ukázka, že overload vybírá statický typ argumentu, ne to, co v proměnné skutečně je.',
    },
    prompt: 'Co se vypíše?',
    code: `def describe(x: Any) = "any"
def describe(x: String) = "string"
def describe(x: Int) = "int"

val a: Any = "hi"
val s = "hi"
println(describe(a) + " " + describe(s) + " " + describe(42))`,
    answer: 'any string int',
    explanation: `<ul>
<li><code>describe(a)</code>: statický typ <code>a</code> je <code>Any</code> (deklarovaný) → jediný použitelný overload je <code>describe(Any)</code> → <code>any</code>. Že je uvnitř String, nehraje roli.</li>
<li><code>describe(s)</code>: typ <code>s</code> je odvozen jako <code>String</code> → nejspecifičtější je <code>describe(String)</code>.</li>
<li><code>describe(42)</code> → <code>describe(Int)</code>.</li>
</ul>`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 18,
        quote: 'Different parameter types create overloads, static types choose between them.',
      },
    ],
  },
  {
    id: 'ch2-06',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm otázka 9 a L2 slide 21 (Quiz: signature first, receiver second)',
      why: 'Tři volání na stejný objekt s různými statickými typy – přesně algoritmus „signatura, pak příjemce“.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def f(x: A): String = "A.f(A)"

class B extends A:
  override def f(x: A): String = "B.f(A)"
  def f(x: B): String = "B.f(B)"

val ab: A = B()
val b: B = B()
println(ab.f(b))
println(b.f(ab))
println(b.f(b))`,
    answer: `B.f(A)
B.f(A)
B.f(B)`,
    explanation: `<ol>
<li><code>ab.f(b)</code>: statický typ příjemce <code>A</code> zná jen <code>f(A)</code> → signatura <code>f(A)</code>. Runtime <code>B</code> má override <code>f(A)</code> → <code>B.f(A)</code>. (<code>f(B)</code> není vidět, i když argument je B!)</li>
<li><code>b.f(ab)</code>: příjemce <code>B</code> má <code>f(A)</code> i <code>f(B)</code>; argument má statický typ <code>A</code> → hodí se jen <code>f(A)</code> → <code>B.f(A)</code>.</li>
<li><code>b.f(b)</code>: obě se hodí, nejspecifičtější je <code>f(B)</code> → <code>B.f(B)</code>.</li>
</ol>`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 20,
        quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types',
      },
      { kind: 'official', label: 'Sample midterm 2026, otázka 9' },
    ],
  },

  // ---------------------------------------------------------------- 2.4 algoritmus
  {
    id: 'ch2-07',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm otázky 3 a 7 (overloadované top-level funkce + super řetěz)',
      why: 'Kombinuje statický výběr overloadu funkce s několika úrovněmi dynamických this-volání a super.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def a = 1
  def b = a * 10
  def c = b + a

class B extends A:
  override def a = 2

class C extends B:
  override def b = super.b + 5
  override def a = 3

def calc(x: A) = x.c
def calc(x: B) = x.c * 2
def calc(x: C) = x.c * 3

val v: A = C()
println(calc(v))`,
    answer: '38',
    explanation: `<ol>
<li>Overload funkce: statický typ <code>v</code> je <code>A</code> → <code>calc(A)</code> (žádné <code>* 2</code> ani <code>* 3</code>!).</li>
<li><code>x.c</code>, runtime <code>C</code>: <code>c</code> přepsané není → <code>A.c</code> = <code>b + a</code>.</li>
<li><code>b</code> → <code>C.b</code> = <code>super.b + 5</code>; <code>super</code> v C = B, ale B <code>b</code> nepřepisuje → <code>A.b</code> = <code>a * 10</code>, kde <code>a</code> je dynamické → <code>C.a</code> = 3 → 30. Tedy <code>C.b</code> = 35.</li>
<li><code>a</code> → <code>C.a</code> = 3.</li>
<li><code>c</code> = 35 + 3 = <code>38</code>.</li>
</ol>`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 20,
        quote: 'Use the method name and static argument types to choose an overload',
      },
      { kind: 'official', label: 'Sample midterm 2026, otázky 3 a 7' },
    ],
  },
  {
    id: 'ch2-08',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slide 25 (Inside each class, this has a specific static type)',
      why: 'Nejzrádnější past: this uvnitř předka má statický typ předka, takže overload se vybere podle něj.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def who(x: A) = "A"
  def who(x: B) = "B"
  def test = who(this)

class B extends A:
  override def who(x: A) = "BA"
  override def who(x: B) = "BB"

val b = B()
println(b.test)
println(b.who(b))`,
    answer: `BA
BB`,
    explanation: `<ol>
<li><code>b.test</code>: <code>test</code> je jen v <code>A</code>. Uvnitř se volá <code>who(this)</code>.</li>
<li>Compile time: kód je napsaný ve třídě <code>A</code>, takže <strong>statický typ <code>this</code> je <code>A</code></strong> → vybere se signatura <code>who(A)</code> (ne <code>who(B)</code>, i když objekt je B).</li>
<li>Runtime: příjemce je objekt třídy <code>B</code> → override <code>B.who(A)</code> → <code>BA</code>.</li>
<li><code>b.who(b)</code>: statický typ argumentu <code>B</code> → <code>who(B)</code> → runtime B → <code>BB</code>.</li>
</ol>Přesně tohle řeší double dispatch: aby byl statický typ <code>this</code> konkrétní, musí volání proběhnout v podtřídě.`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 25,
        quote: 'Inside each class, this has a speciﬁc static type, so the hitBy overload is known.',
      },
    ],
  },

  // ---------------------------------------------------------------- 2.5 CE
  {
    id: 'ch2-09',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm otázka 1 (v.m3 na statickém typu B)',
      why: 'Statický typ nemusí být napsaný – odvozený typ if/else je společný nadtyp, a ten rozhoduje o dostupných metodách.',
    },
    prompt: 'Co se vypíše? (Pokud se kód nezkompiluje, odpověz CE.)',
    code: `class A:
  def m = 1

class B extends A:
  def n = 2

val flag = true
val x = if flag then B() else A()
println(x.n)`,
    answer: 'CE',
    explanation: `<ol>
<li>Typ <code>x</code> se odvodí jako nejmenší společný nadtyp větví <code>B</code> a <code>A</code> → <code>A</code>. Že <code>flag</code> je <code>true</code>, kompilátor neřeší.</li>
<li><code>x.n</code>: statický typ <code>A</code> metodu <code>n</code> nemá → <strong>CE</strong> („value n is not a member of A“), i když za běhu by tam byl objekt B.</li>
</ol>`,
    verified: 'scala',
    sources: [{ kind: 'slide', lecture: 'L2', page: 15, quote: 'The static type controls which members are' }],
  },
  {
    id: 'ch2-10',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slide 20 (Compile time: select a signature) – ambiguous overload',
      why: 'Ukáže, že nejednoznačný overload je chyba překladu celého programu, ne jen „špatný výstup“ jednoho řádku.',
    },
    prompt: 'Co se vypíše? (Pokud se kód nezkompiluje, odpověz CE.)',
    code: `class A
class B extends A

class P:
  def m(x: A, y: B) = "AB"
  def m(x: B, y: A) = "BA"

val p = P()
println(p.m(B(), A()))
println(p.m(B(), B()))`,
    answer: 'CE',
    explanation: `<ol>
<li><code>p.m(B(), A())</code>: druhý argument je <code>A</code> → hodí se jen <code>m(B, A)</code> – sám o sobě by tento řádek prošel.</li>
<li><code>p.m(B(), B())</code>: hodí se obě signatury. <code>m(A, B)</code> je specifičtější ve 2. parametru, <code>m(B, A)</code> v 1. → žádná není specifičtější ve všem → <strong>Ambiguous overload</strong>.</li>
<li>Chyba překladu znamená, že se nespustí nic – ani první <code>println</code>. Odpověď: <code>CE</code>.</li>
</ol>`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 20,
        quote: 'Compile time: select an accessible signature from the receiver’s static type',
      },
    ],
  },

  // ---------------------------------------------------------------- 2.6 double dispatch
  {
    id: 'ch2-11',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 25–27 (double dispatch, space simulator)',
      why: 'Trace double dispatch – kdo je příjemce prvního a kdo druhého volání a jaký statický typ má this.',
    },
    prompt: 'Co se vypíše?',
    code: `abstract class Shape:
  def meet(o: Shape): String
  def metBy(c: Circle): String
  def metBy(s: Square): String

class Circle extends Shape:
  def meet(o: Shape) = o.metBy(this)
  def metBy(c: Circle) = "CC"
  def metBy(s: Square) = "SC"

class Square extends Shape:
  def meet(o: Shape) = o.metBy(this)
  def metBy(c: Circle) = "CS"
  def metBy(s: Square) = "SS"

val c: Shape = Circle()
val s: Shape = Square()
println(c.meet(s) + " " + s.meet(c))`,
    answer: 'CS SC',
    explanation: `<ol>
<li><code>c.meet(s)</code> → 1. dispatch podle runtime <code>c</code> → <code>Circle.meet</code>. Tam <code>this</code> má statický typ <code>Circle</code> → signatura <code>metBy(Circle)</code>.</li>
<li><code>o.metBy(this)</code>: 2. dispatch podle runtime <code>o</code> = <code>Square</code> → <code>Square.metBy(Circle)</code> = <code>"CS"</code>.</li>
<li><code>s.meet(c)</code> → <code>Square.meet</code> → <code>metBy(Square)</code> na <code>Circle</code> → <code>Circle.metBy(Square)</code> = <code>"SC"</code>.</li>
</ol>Pozor: v <code>Circle</code>/<code>Square</code> chybí <code>override</code>, ale to je OK – implementují abstraktní členy.`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 26,
        quote: 'Second dispatch: o’s runtime class chooses the override of the selected hitBy signature.',
      },
    ],
  },

  // ---------------------------------------------------------------- 2.7 LSP
  {
    id: 'ch2-12',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 47–51 (contract of Counter, BoundedCounter quiz)',
      why: 'Procvičí pravidlo slabší precondition / silnější postcondition na konkrétních overridech.',
    },
    prompt: `Kontrakt třídy <code>Counter</code>: <code>get</code> vrací nezáporný stav; <code>set(n)</code> přijme každé <code>n ≥ 0</code> a potom platí <code>get == n</code>; <code>inc()</code> zvýší <code>get</code> alespoň o <code>step</code>. Které overridy v podtřídě jsou v souladu s behavioral subtypingem (LSP)?`,
    options: [
      '<code>inc()</code> zvýší stav o <code>2 * step</code>.',
      '<code>set(n)</code> odmítne (vyhodí výjimku) každé <code>n &gt; 100</code>.',
      '<code>set(n)</code> pro <code>n &gt; 10</code> tiše nastaví 10.',
      '<code>set(n)</code> přijme i záporné <code>n</code> a nastaví pak 0; pro <code>n ≥ 0</code> se chová jako předek.',
      '<code>inc()</code> nic neudělá, pokud stav dosáhl limitu.',
      'Libovolný override, protože kompilátor ověřil, že podtřída je podtyp.',
    ],
    correct: [0, 3],
    explanation: `<ul>
<li>A: „alespoň o step“ je splněno i pro 2·step (silnější postcondition je OK) – slide to říká přímo o DoubleCounteru.</li>
<li>B: odmítá vstupy, které předek přijímá → silnější precondition → porušení.</li>
<li>C: slibované <code>get == n</code> neplatí → slabší postcondition → porušení.</li>
<li>D: přijímá víc vstupů (slabší precondition) a pro původní vstupy dodrží vše → OK; stav zůstane nezáporný.</li>
<li>E: přesně BoundedCounter ze slidů – na limitu nesplní slíbený progres → porušení.</li>
<li>F: kompilátor kontroluje jen nominální podtyp, ne chování.</li>
</ul>`,
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 47, quote: 'DoubleCounter’s two steps satisfy this contract.' },
      { kind: 'slide', lecture: 'L2', page: 49, quote: 'No: that strengthens the precondition.' },
      { kind: 'slide', lecture: 'L2', page: 49, quote: 'No: that violates the promised result.' },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 51,
        quote: 'Accept at least every input accepted by the base contract: no stronger precondition.',
      },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 36,
        quote: 'The compiler’s nominal subtype check does not prove this behavioral relationship.',
      },
    ],
  },
  {
    id: 'ch2-13',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 30, 33, 35–37, 43–44, 76 (subclassing vs subtyping)',
      why: 'Teoretické tvrzení typu „označ všechna pravdivá“ – přesně formát multiple-choice otázek z testu.',
    },
    prompt: 'Označ všechna pravdivá tvrzení.',
    options: [
      'Ve Scale <code>class B extends A</code> zavádí podtyp <code>B &lt;: A</code>.',
      'Subclassing a subtyping jsou vždy totéž.',
      'Podtřída zdědí <code>private</code> členy předka a může k nim přímo přistupovat.',
      'Relace <code>&lt;:</code> je reflexivní a tranzitivní.',
      'Pokud kompilátor přijme <code>B &lt;: A</code>, je zaručeno, že B dodržuje kontrakt A.',
      '<code>Square extends Rectangle</code> s nezávislými <code>setWidth</code>/<code>setHeight</code> porušuje LSP.',
    ],
    correct: [0, 3, 5],
    explanation: `<ul>
<li>A ✓: extends ve Scale/Javě zakládá nominální podtyp.</li>
<li>B ✗: obecně subclassing ≠ subtyping (např. neveřejné dědění v C++ podtyp nevytvoří).</li>
<li>C ✗: private stav v objektu existuje, ale podtřída k němu nemá přístup.</li>
<li>D ✓: <code>A &lt;: A</code>; z <code>B &lt;: A</code> a <code>C &lt;: B</code> plyne <code>C &lt;: A</code>.</li>
<li>E ✗: kompilátor ověří jen nominální vztah, ne chování.</li>
<li>F ✓: klient čeká, že šířku a výšku nastaví nezávisle (area 20), čtverec to nesplní.</li>
</ul>`,
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 76, quote: 'But in principle, subclassing ≠ subtyping.' },
      { kind: 'slide', lecture: 'L2', page: 33, quote: 'It does not always create a subtype' },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 35,
        quote: 'Inherited private state still exists, but subclasses cannot access it directly.',
      },
      { kind: 'slide', lecture: 'L2', page: 30, quote: 'if B <: A and C <: B then C <: A' },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 35,
        quote: 'A compiler can establish the nominal relation without proving the behavioral one.',
      },
      { kind: 'slide', lecture: 'L2', page: 44, quote: 'Square is not a true subtype of Rectangle' },
    ],
  },

  // ---------------------------------------------------------------- 2.8 override rules
  {
    id: 'ch2-14',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm otázka 4 (typ parametru) a L2 slides 53–56 (návratový typ)',
      why: 'Zrcadlo otázky 4 ze sample testu – tentokrát pro návratový typ, kde je odpověď jiná (kovariance).',
    },
    prompt: 'Které typy lze dosadit za <code>?</code> (návratový typ), aby se kód zkompiloval? Označ všechny.',
    code: `class A
class B extends A
class C extends B

class X:
  def f(b: B): B = new B

class Y extends X:
  override def f(b: B): ? = ???`,
    options: ['<code>A</code>', '<code>B</code>', '<code>C</code>', '<code>Any</code>', '<code>Nothing</code>'],
    correct: [1, 2, 4],
    explanation: `<ul>
<li>Návratový typ je v kovariantní pozici: smí být stejný nebo <strong>podtyp</strong> původního <code>B</code>. Klient, který volá <code>x.f(...)</code> přes typ <code>X</code>, čeká B – podtyp mu dá vše, co B umí.</li>
<li><code>B</code>, <code>C</code> ✓. <code>Nothing</code> je podtyp všeho → taky ✓ (a <code>???</code> má typ Nothing).</li>
<li><code>A</code>, <code>Any</code> ✗ – nadtypy; scala-cli: „method f … has incompatible type“.</li>
</ul>Pozor: u <strong>parametru</strong> (sample otázka 4) je jediná správná odpověď <code>B</code>.`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 62, quote: 'Return type is in covariant position' },
      { kind: 'slide', lecture: 'L2', page: 55, quote: 'A subtype has all methods of the' },
      { kind: 'slide', lecture: 'L2', page: 56, quote: 'A does not have method g' },
    ],
  },
  {
    id: 'ch2-15',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 61–62 (ERROR - it is not an override but overload)',
      why: 'Odhalí rozdíl mezi „override s nadtypem parametru“ (CE) a „overload bez override“ včetně Scala-specifické nejednoznačnosti.',
    },
    prompt: `Místo <code>???</code> stojí buď <code>override</code>, nebo nic. Označ všechna pravdivá tvrzení.`,
    code: `class A
class B extends A

class T1:
  def m(x: B): String = "T1"

class T2 extends T1:
  ??? def m(x: A): String = "T2"`,
    options: [
      'S <code>override</code> se kód nezkompiluje.',
      'Bez <code>override</code> se kód zkompiluje a <code>T2.m(A)</code> je nový overload.',
      'Bez <code>override</code> se kód zkompiluje a <code>T2.m(A)</code> přepíše <code>T1.m(B)</code> (kontravariantní parametr).',
      'Bez <code>override</code>: <code>val t: T1 = T2(); t.m(B())</code> vrátí <code>"T1"</code>.',
      'Bez <code>override</code>: <code>T2().m(B())</code> vrátí <code>"T1"</code>, protože <code>m(B)</code> je specifičtější.',
    ],
    correct: [0, 1, 3],
    explanation: `<ul>
<li>1 ✓: jiný typ parametru = jiná signatura, takže není co přepsat → „method m has a different signature than the overridden declaration“.</li>
<li>2 ✓, 3 ✗: Scala (stejně jako Java) kontravariantní parametr jako override nebere – je to overload.</li>
<li>4 ✓: statický typ <code>T1</code> zná jen <code>m(B)</code>, T2 ji nepřepsal → <code>"T1"</code>.</li>
<li>5 ✗: past! Ve Scale se při výběru overloadu počítá i to, <em>ve které třídě</em> je alternativa definovaná: <code>m(A)</code> z podtřídy T2 „vyhrává“ podle třídy, <code>m(B)</code> podle typu parametru → remíza → <strong>Ambiguous overload (CE)</strong>. Java by zvolila <code>m(B)</code>.</li>
</ul>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 62, quote: 'ERROR - it is not an override but overload' },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 61,
        quote: 'do not allow contravariance in override method parameters because of',
      },
    ],
  },

  // ---------------------------------------------------------------- 2.9 nominal vs structural
  {
    id: 'ch2-16',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'L2 slides 64–70 (nominal, structural, duck typing)',
      why: 'Ověří, že víš, kdy Scala přijme objekt podle struktury a kdy jen podle deklarace extends.',
    },
    prompt: 'Označ všechna pravdivá tvrzení.',
    code: `import scala.reflect.Selectable.reflectiveSelectable

type Speaker = { def speak: String }
abstract class Animal:
  def speak: String

class Robot:
  def speak: String = "beep"

def viaStruct(s: Speaker) = s.speak
def viaNominal(a: Animal) = a.speak`,
    options: [
      '<code>viaStruct(Robot())</code> se zkompiluje a vrátí <code>"beep"</code>.',
      '<code>viaNominal(Robot())</code> se zkompiluje, protože Robot má metodu <code>speak: String</code>.',
      'Scala je primárně nominálně typovaná; strukturální typ <code>{ def speak: String }</code> volá metodu přes reflexi.',
      'Duck typing (Python) se ověřuje až za běhu; strukturální typování (Go, TypeScript, Scala) při překladu.',
      'Bez importu <code>reflectiveSelectable</code> se <code>s.speak</code> zkompiluje stejně.',
    ],
    correct: [0, 2, 3],
    explanation: `<ul>
<li>1 ✓: strukturální typ – stačí, že Robot má <code>speak: String</code>.</li>
<li>2 ✗: <code>Animal</code> je nominální typ, Robot nikde nedeklaruje <code>extends Animal</code> → CE (Found: Robot, Required: Animal).</li>
<li>3 ✓: slidy – Scala je nominální jazyk, strukturální typy jsou navíc a jdou přes reflexi.</li>
<li>4 ✓: duck typing „vypadá jako strukturální“, ale je to vlastnost běhu.</li>
<li>5 ✗: bez importu CE („Required: Selectable | Dynamic“).</li>
</ul>`,
    verified: 'scala',
    sources: [
      {
        kind: 'slide',
        lecture: 'L2',
        page: 64,
        quote: 'type equivalence and compatibility is determined by explicit declarations',
      },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 64,
        quote: "type equivalence and compatibility is determined by type's actual structure",
      },
      {
        kind: 'slide',
        lecture: 'L2',
        page: 64,
        quote: 'looks like structural typing, but it is a runtime characteristics',
      },
      { kind: 'slide', lecture: 'L2', page: 68 },
    ],
  },
]
