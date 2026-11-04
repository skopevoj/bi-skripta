import type { Question } from '../types'

// Vlastní otázky ke kapitole 4 (L4 — Parametric polymorphism).
// Všechny kódy ověřeny se scala-cli (Scala 3.9.0).

export const ch4: Question[] = [
  // -------------------------------------------------------------------------
  // 4.1 Generické třídy a metody
  {
    id: 'ch4-01',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 1 (Container[T].store)',
      why: 'Protiklad k otázce 1 ze sample: metoda existuje už ve statickém typu T, takže se to zkompiluje a rozhodne dynamický dispatch.',
    },
    prompt: 'What will it print?',
    code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Holder[T]:
  def keep(x: T): T = x

val h = Holder[A]()
val v = h.keep(C())

println(v.m)`,
    answer: '3',
    explanation: `<ol>
<li><code>Holder[A]</code> → za <code>T</code> dosadíme <code>A</code>, takže <code>keep(x: A): A</code>.</li>
<li><code>C()</code> je podtyp <code>A</code>, předat jde. Statický typ <code>v</code> je <code>A</code> (návratový typ <code>T</code> = <code>A</code>).</li>
<li><code>v.m</code>: compiler hledá <code>m</code> v <code>A</code> — existuje, takže se to zkompiluje.</li>
<li>Za běhu je v <code>v</code> objekt <code>C</code> a <code>m</code> je overridnutá → dynamický dispatch → <strong>3</strong>.</li>
</ol>
Generika neruší dynamický dispatch — jen určují, co compiler <em>dovolí</em> zavolat.`,
    verified: 'scala',
  },
  {
    id: 'ch4-02',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 1; slide L4 s. 23 (inference typových argumentů)',
      why: 'Procvičuje, že odvozený typový argument je nejbližší společný nadtyp argumentů, ne typ posledního argumentu.',
    },
    prompt: 'What will it print?',
    code: `class A:
  def ma: Int = 1

class B extends A:
  def mb: Int = 2

class C extends B:
  def mc: Int = 3

def pick[T](first: T, second: T): T = second

val r = pick(B(), C())
println(r.mc)`,
    answer: 'CE',
    explanation: `<ol>
<li><code>T</code> není zadané, compiler ho odvodí z obou argumentů: <code>B</code> a <code>C</code> → nejbližší společný nadtyp je <code>B</code>.</li>
<li>Statický typ <code>r</code> je tedy <code>B</code>, i když za běhu je to <code>C</code>.</li>
<li><code>B</code> nemá metodu <code>mc</code> → <strong>compile error</strong> (<em>value mc is not a member of B</em>).</li>
</ol>
Kdyby tam bylo <code>r.mb</code>, vypíše se <code>2</code>.`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 23, quote: 'the type inference can often' }],
  },
  {
    id: 'ch4-03',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Kvíz K2 2024/25 (FIT Wiki): new Test[B]().test(???)',
      why: 'Základní dovednost: po dosazení typového argumentu je parametr obyčejný parametr typu B a platí pro něj subtyping.',
    },
    prompt: 'Instances of which classes can be passed as parameter <code>x</code> in the last line? Mark all correct answers.',
    code: `class A
class B extends A
class C extends B
class D extends A

class Test[T]:
  def test(x: T): Unit = ()

Test[B]().test(???)`,
    options: ['A', 'B', 'C', 'D', 'Int', 'Libovolná třída, protože T nemá žádný bound'],
    correct: [1, 2],
    explanation: `Po dosazení <code>T = B</code> je to <code>test(x: B)</code>. Předat jde <code>B</code> a všechny jeho podtypy (<code>C</code>).
<code>A</code> je nadtyp, <code>D</code> je sourozenec (podtyp <code>A</code>, ne <code>B</code>), <code>Int</code> nesouvisí.
To, že <code>T</code> nemá bound, znamená jen to, že při vytváření <code>Test[...]</code> můžu dosadit cokoli — jakmile je dosazeno, je typ pevný.`,
    verified: 'scala',
  },

  // -------------------------------------------------------------------------
  // 4.2 Bounds
  {
    id: 'ch4-04',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 5 (Processor[T <: B])',
      why: 'Upper bound omezuje, jaké typové argumenty smím dosadit — chyba je už na řádku s vytvořením instance.',
    },
    prompt: 'What will it print?',
    code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Processor[T <: B]:
  def compute(x: T): Int = x.m

val p = Processor[A]()
println(p.compute(C()))`,
    answer: 'CE',
    explanation: `<code>T <: B</code> říká, že za <code>T</code> smím dosadit jen <code>B</code> nebo jeho podtyp. <code>A</code> je nadtyp <code>B</code>
→ <strong>compile error</strong> (<em>Type argument A does not conform to upper bound B</em>) hned u <code>Processor[A]()</code>.
Že by <code>compute(C())</code> jinak fungovalo, nehraje roli. S <code>Processor[B]()</code> by se vypsalo <code>3</code> (dynamický dispatch na <code>C.m</code>).`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' }],
  },
  {
    id: 'ch4-05',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 2 (def f[A >: MyClass](x: A))',
      why: 'Lower bound na parametru metody „propustí“ skoro cokoli, protože compiler odvodí širší typ — pokud ho ale napíšu explicitně, bound platí.',
    },
    prompt: 'Which calls compile? Mark all correct answers.',
    code: `class A
class B extends A
class C extends B
class D extends A

def g[R >: B](x: R): Unit = ()`,
    options: ['g(A())', 'g(C())', 'g(D())', 'g(42)', 'g[C](C())', 'g[A](C())'],
    correct: [0, 1, 2, 3, 5],
    explanation: `<ul>
<li>Bez explicitního typu si compiler <code>R</code> zvolí tak, aby platilo <code>R >: B</code> <em>a zároveň</em> argument <code><: R</code>.
Vždy to jde — v nejhorším <code>R = Any</code>. Proto projde <code>A()</code>, <code>C()</code>, <code>D()</code> i <code>42</code>.
(U <code>C()</code> se zvolí <code>R = B</code> a <code>C <: B</code>.)</li>
<li><code>g[C](C())</code>: explicitně <code>R = C</code>, ale <code>C</code> není nadtyp <code>B</code> → <em>Type argument C does not conform to lower bound B</em>.</li>
<li><code>g[A](C())</code>: <code>A >: B</code> ✓ a <code>C <: A</code> ✓ → kompiluje.</li>
</ul>`,
    verified: 'scala',
  },
  {
    id: 'ch4-06',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Kvíz K2 2024/25 (FIT Wiki): def test[R >: T](x: R) — „what can I call on x?“',
      why: 'Ukazuje, že lower bound nedává žádné metody: x může být klidně Any, i když samotné T má upper bound.',
    },
    prompt: 'Which lines can be written as the body of <code>test</code> so that the code compiles? Mark all correct answers.',
    code: `class A:
  def ma(): Int = 1

class B extends A:
  def mb(): Int = 2

class Test[T <: A]:
  def test[R >: T](x: R): Unit =
    // ???

Test[B]().test(B())`,
    options: ['x.ma()', 'x.mb()', 'println(x.toString)', 'println(x == x)', 'val a: A = x', 'val t: T = x'],
    correct: [2, 3],
    explanation: `<code>R >: T</code> říká jen „<code>R</code> je <em>nadtyp</em> <code>T</code>“. Nadtypem je i <code>Any</code>, takže o <code>x</code> compiler ví jen to, že je to <code>Any</code>.
Volat jde jen metody z <code>Any</code> (<code>toString</code>, <code>==</code>, <code>hashCode</code>…). <code>x.ma()</code> nejde, přestože <code>T <: A</code> — bound na <code>T</code> se „nahoru“ nepřenáší.
Přiřazení do <code>A</code> nebo <code>T</code> taky ne: <code>R</code> může být širší než obojí. (Na FIT Wiki si autor nebyl jistý — compiler dává jen <code>toString</code>/<code>==</code>.)`,
    verified: 'scala',
  },
  {
    id: 'ch4-07',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slide L4 s. 38 (copy[T] a Get and Put Principle)',
      why: 'Procvičuje get/put princip a zároveň past, že u volání stačí, aby šel najít jeden vhodný T.',
    },
    prompt: 'Which signatures of <code>copy</code> make the whole program compile? Mark all correct answers.',
    code: `import scala.collection.mutable.ArrayBuffer

class Animal(val name: String)
class Cat(n: String) extends Animal(n)

// ??? =
//   for x <- src do dst += x

val cats = ArrayBuffer(Cat("Garfield"), Cat("Arlene"))
val animals = ArrayBuffer[Animal]()
copy(cats, animals)`,
    options: [
      'def copy[T](src: ArrayBuffer[? <: T], dst: ArrayBuffer[? >: T]): Unit',
      'def copy[T](src: ArrayBuffer[T], dst: ArrayBuffer[T]): Unit',
      'def copy[T](src: ArrayBuffer[? >: T], dst: ArrayBuffer[? <: T]): Unit',
      'def copy[T](src: ArrayBuffer[? <: T], dst: ArrayBuffer[T]): Unit',
      'def copy[T](src: ArrayBuffer[T], dst: ArrayBuffer[? >: T]): Unit',
    ],
    correct: [0, 3, 4],
    explanation: `<code>ArrayBuffer</code> je mutable → invariantní. <code>cats: ArrayBuffer[Cat]</code>, <code>animals: ArrayBuffer[Animal]</code>.
<ul>
<li>(1) učebnicové get/put: src je producent (<code>? <: T</code>), dst konzument (<code>? >: T</code>). Projde (např. <code>T = Cat</code>).</li>
<li>(2) obojí <code>[T]</code>: <code>T</code> by muselo být zároveň <code>Cat</code> i <code>Animal</code> → CE.</li>
<li>(3) obráceně: z <code>src: [? >: T]</code> vytáhnu jen <code>Any</code> a do <code>dst: [? <: T]</code> nejde vložit nic → CE už v těle.</li>
<li>(4) <code>T = Animal</code>: <code>ArrayBuffer[Cat] <: ArrayBuffer[? <: Animal]</code> ✓, dst přesně <code>Animal</code> ✓.</li>
<li>(5) <code>T = Cat</code>: src přesně <code>Cat</code> ✓, <code>ArrayBuffer[Animal] <: ArrayBuffer[? >: Cat]</code> ✓.</li>
</ul>
Stačí, když jeden z obou parametrů je „pružný“ — bound je potřeba jen tam, kde se typy liší.`,
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 38, quote: 'use upper bound when you only get values out of a structure,' },
      { kind: 'slide', doc: 'L4', page: 38, quote: 'use lower bound when you only put values into a structure, and' },
    ],
  },

  // -------------------------------------------------------------------------
  // 4.3 Variance
  {
    id: 'ch4-08',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 6 (class Consumer[-T])',
      why: 'Zrcadlová verze otázky 6 pro kovarianci, doplněná o Nothing a o variance position.',
    },
    prompt: 'Given the definition <code>class Producer[+T]</code> and <code>class Cat extends Animal</code>, mark all correct statements.',
    options: [
      'val a: Producer[Animal] = Producer[Cat]() compiles',
      'val b: Producer[Cat] = Producer[Animal]() compiles',
      'val c: Producer[String] = Producer[Nothing]() compiles',
      'val d: Producer[Int] = Producer[Any]() compiles',
      'For any A, B: if A <: B then Producer[B] <: Producer[A]',
      'Producer may declare a method def put(x: T): Unit',
    ],
    correct: [0, 2],
    explanation: `<code>+T</code>: <code>A <: B ⇒ Producer[A] <: Producer[B]</code> (směr zachován).
<ul>
<li><code>Cat <: Animal</code> → (a) ✓, (b) je opačný směr ✗.</li>
<li><code>Nothing</code> je podtyp všeho → <code>Producer[Nothing] <: Producer[String]</code> ✓.</li>
<li><code>Any</code> není podtyp <code>Int</code> → (d) ✗. (e) popisuje kontravarianci ✗.</li>
<li>(f) <code>+T</code> v parametru metody = kontravariantní pozice → <em>covariant type T occurs in contravariant position</em> ✗.</li>
</ul>`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' }],
  },
  {
    id: 'ch4-09',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 8 (var animals: Collection[Animal] = dogs)',
      why: 'Otázka 8 obráceně — přiřazení „z obecnějšího do konkrétnějšího“ vyžaduje kontravarianci.',
    },
    prompt: 'Imagine a generic class <code>Printer[T]</code> that can print values of type <code>T</code>. What variance annotation is needed for the following code to compile? Mark all correct answers.',
    code: `class Dog extends Animal

var forAnimals: Printer[Animal] = ...
var forDogs: Printer[Dog] = forAnimals`,
    options: ['Covariant', 'Contravariant', 'Invariant', 'Will always compile', 'Will never compile'],
    correct: [1],
    explanation: `Potřebujeme <code>Printer[Animal] <: Printer[Dog]</code>, přitom <code>Dog <: Animal</code> → směr se <strong>obrací</strong> → kontravariance <code>Printer[-T]</code>.
Dává to smysl: kdo umí vytisknout libovolné zvíře, umí vytisknout i psa. S <code>+T</code> i s invariantním <code>T</code> scala-cli hlásí <em>Found: Printer[Animal], Required: Printer[Dog]</em>.`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' }],
  },
  {
    id: 'ch4-10',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, otázka 10 (Consumer[-T] s x.m)',
      why: 'Opravená verze otázky 10: s upper boundem se tělo zkompiluje, takže se musí správně spočítat kontravariance i dispatch.',
    },
    prompt: 'What will it print?',
    code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Consumer[-T <: A]:
  def accept(x: T): Int = x.m * 10

val consumer: Consumer[C] = Consumer[B]()
println(consumer.accept(C()))`,
    answer: '30',
    explanation: `<ol>
<li>Tělo: <code>T <: A</code>, takže <code>x.m</code> existuje ✓ (bez boundu by to byl CE jako v sample otázce 10).</li>
<li><code>-T</code> a <code>C <: B</code> ⇒ <code>Consumer[B] <: Consumer[C]</code> → přiřazení ✓.</li>
<li><code>accept(C())</code>: parametr má statický typ <code>C</code> ✓. Za běhu je <code>x</code> objekt <code>C</code> → <code>m</code> = 3 (dynamický dispatch) → <strong>30</strong>.</li>
</ol>`,
    verified: 'scala',
  },
  {
    id: 'ch4-11',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slidy L4 s. 29–30 a 47 (invariantní ArrayList[Cat] vs ArrayList[Animal])',
      why: 'Odhaluje nejčastější chybnou úvahu: „Box je invariantní, takže Box[A] = Box(C()) nejde“ — jde, protože se typový argument odvodí.',
    },
    prompt: 'Given the code below, which lines compile? Mark all correct answers.',
    code: `class A
class C extends A
class Box[T](val v: T)

val c: Box[C] = Box(C())`,
    options: [
      'val b1: Box[A] = Box(C())',
      'val b2: Box[A] = c',
      'val b3: Box[A] = Box[C](C())',
      'val b4: Box[? <: A] = c',
      'val b5: Box[C] = Box[A](C())',
      'val b6: Box[A] = Box[A](C())',
    ],
    correct: [0, 3, 5],
    explanation: `<code>Box[T]</code> je invariantní → <code>Box[C]</code> a <code>Box[A]</code> spolu nesouvisí.
<ul>
<li><strong>b1</strong>: <code>Box(C())</code> nemá typ pevně daný. Compiler vidí očekávaný typ <code>Box[A]</code>, zvolí <code>T = A</code> a <code>C()</code> předá jako <code>A</code> ✓.</li>
<li><strong>b2</strong>, <strong>b3</strong>: vpravo je už hotový <code>Box[C]</code> → invariance → CE.</li>
<li><strong>b4</strong>: wildcard <code>Box[? <: A]</code> je pohled, do kterého se vejde každý <code>Box[X]</code> s <code>X <: A</code> ✓.</li>
<li><strong>b5</strong>: <code>Box[A]</code> do <code>Box[C]</code> ✗. <strong>b6</strong>: typ sedí přesně, <code>C()</code> je <code>A</code> ✓.</li>
</ul>`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 47, quote: 'Even with the bound, invariant Box[Cat] is not a subtype of Box[Animal].' }],
  },

  // -------------------------------------------------------------------------
  // 4.4 Variance positions
  {
    id: 'ch4-12',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slidy L4 s. 43–45 a 50–51 (covariant type T occurs in contravariant position)',
      why: 'Mechanické určení variance positions včetně „dvojitého otočení“ u funkce v parametru.',
    },
    prompt: 'Which members can be declared in <code>class Box[+T](init: T)</code> without a compile error? Mark all correct answers.',
    options: [
      'def get: T = init',
      'def set(x: T): Unit = ()',
      'var w: T = init',
      'val v: T = init',
      'def add[U >: T](x: U): Box[U] = Box(x)',
      'def each(f: T => Unit): Unit = f(init)',
      'def make(f: Unit => T): Unit = ()',
    ],
    correct: [0, 3, 4, 5],
    explanation: `<code>+T</code> smí být jen ve „výstupních“ (kovariantních) pozicích.
<ul>
<li><code>get: T</code>, <code>val v: T</code> — návratová hodnota / čtení ✓.</li>
<li><code>set(x: T)</code> — parametr = kontravariantní pozice ✗. <code>var w: T</code> — setter → invariantní pozice ✗.</li>
<li><code>add[U >: T](x: U)</code> — v parametru je <code>U</code>, ne <code>T</code>; <code>T</code> je jen v lower boundu ✓ (trik ze slidu 51).</li>
<li><code>each(f: T => Unit)</code>: parametr otočí jednou, vstup funkce podruhé → zpět kovariantní ✓.</li>
<li><code>make(f: Unit => T)</code>: <code>T</code> je výstup funkce (+) v parametru (−) → kontravariantní ✗.</li>
</ul>`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 45, quote: 'A covariant type cannot occur in contravariant positions (method parameters, vars)' }],
  },
  {
    id: 'ch4-13',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slide L4 s. 51 (appended[R >: T]) a s. 81 („Why can List[+T].appended[R >: T](x: R) accept a Dog after Cat?“)',
      why: 'Procvičuje, jaký typ vyjde z lower-bound triku — nejbližší společný nadtyp.',
    },
    prompt: 'What is the static type of <code>all</code>? Mark all correct answers.',
    code: `class Animal
class Cat extends Animal
class Dog extends Animal

class Stack[+T](val items: List[T]):
  def push[U >: T](x: U): Stack[U] = Stack(x :: items)

val cats: Stack[Cat] = Stack(List(Cat()))
val all = cats.push(Dog())`,
    options: ['Stack[Cat]', 'Stack[Dog]', 'Stack[Animal]', 'Stack[Any]', 'It does not compile'],
    correct: [2],
    explanation: `<code>U</code> musí být nadtyp <code>Cat</code> (bound) a zároveň nadtyp <code>Dog</code> (argument). Nejbližší takový je <code>Animal</code>
→ <code>U = Animal</code>, výsledek <code>Stack[Animal]</code>. Ověřeno: <code>val x: Stack[Cat | Dog] = all</code> neprojde, compiler hlásí <em>Found: Stack[Animal]</em>.
Původní <code>cats</code> zůstává <code>Stack[Cat]</code> — nic se nemutuje, vzniká nový zásobník.`,
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 51, quote: 'T is Cat, R has to be Animal since that is' },
      { kind: 'slide', doc: 'L4', page: 51, quote: 'the closest basetype of both Cat and Dog' },
    ],
  },

  // -------------------------------------------------------------------------
  // 4.5 Function subtyping
  {
    id: 'ch4-14',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slide L4 s. 59 (Which assignments compile?) a s. 82 („Is (Animal => Cat) a subtype of (Cat => Animal)?“)',
      why: 'Mechanické použití pravidla Function1[-S, +T] na obou stranách najednou.',
    },
    prompt: 'Which lines compile? Mark all correct answers.',
    code: `class Animal
class Cat extends Animal

val f: Animal => Cat = a => Cat()`,
    options: [
      'val g: Cat => Animal = f',
      'val h: Animal => Animal = f',
      'val i: Cat => Cat = f',
      'val j: Animal => Cat = (c: Cat) => Cat()',
      'val k: Cat => Animal = (a: Animal) => a',
      'val l: Animal => Cat = (a: Animal) => a',
    ],
    correct: [0, 1, 2, 4],
    explanation: `<code>(A1 => R1) <: (A2 => R2)</code> ⇔ <code>A2 <: A1</code> (vstup obráceně) a <code>R1 <: R2</code> (výstup normálně).
<ul>
<li>g, h, i: <code>f</code> bere <code>Animal</code> (≥ požadovaný vstup) a vrací <code>Cat</code> (≤ požadovaný výstup) ✓.</li>
<li>j: funkce umí jen <code>Cat</code>, ale slibujeme, že zvládne každé <code>Animal</code> ✗.</li>
<li>k: <code>Animal => Animal</code> jako <code>Cat => Animal</code> ✓.</li>
<li>l: vrací <code>Animal</code>, slibujeme <code>Cat</code> ✗.</li>
</ul>
Tedy ano: <code>(Animal => Cat) <: (Cat => Animal)</code>.`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 59, quote: '(A => B) <: (S => T) iff S <: A and B <: T.' }],
  },

  // -------------------------------------------------------------------------
  // 4.7 Type erasure
  {
    id: 'ch4-15',
    kind: 'output',
    topic: 'erasure',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Zkouška 23. 1. 2026 (FIT Wiki): match na _: List[String] pro List[String] a List[Int]',
      why: 'Type erasure v praxi: typový argument se za běhu nedá otestovat, takže první case chytí jakýkoli List.',
    },
    prompt: 'What will it print?',
    code: `def check(x: Any): String = x match
  case _: List[String] => "strings"
  case _: List[Int]    => "ints"
  case _               => "other"

println(check(List(1, 2)) + " " + check(Set("a")))`,
    answer: 'strings other',
    explanation: `Za běhu existuje jen <code>List</code> — typový argument je vymazán. <code>case _: List[String]</code> se tedy testuje jako „je to <code>List</code>?“.
<ul>
<li><code>List(1, 2)</code> je <code>List</code> → první case → <code>strings</code>.</li>
<li><code>Set("a")</code> není <code>List</code> → <code>other</code>.</li>
</ul>
Compiler to zkompiluje, jen varuje (<em>the type test for List[String] cannot be checked at runtime</em>) a druhý case označí jako <em>Unreachable</em>.`,
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L4', page: 62, quote: 'for compile-time only, no type parameters are present at runtime' }],
  },
  {
    id: 'ch4-16',
    kind: 'mc',
    topic: 'erasure',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slidy L4 s. 62–63 a 78 (erasure, reifikace, expanze; Java arrays)',
      why: 'Shrnuje důsledky erasure, které se dají zkoušet jako „mark all correct statements“.',
    },
    prompt: 'Mark all correct statements (Scala 3 on the JVM).',
    options: [
      'Two methods def f(xs: List[Int]) and def f(xs: List[String]) in the same class do not compile.',
      'At runtime, List(1, 2).isInstanceOf[List[String]] returns false.',
      'Java arrays are covariant, so storing a Dog into an Animal[] that refers to a Cat[] fails only at runtime.',
      'C++ templates create a new specialised copy of the code at compile time (expansion).',
      'Declaring class Box[T <: Animal] makes Box[Cat] a subtype of Box[Animal].',
    ],
    correct: [0, 2, 3],
    explanation: `<ul>
<li>(a) ✓ Po erasure mají obě metody signaturu <code>f(xs: List)</code> → <em>Conflicting definitions … have the same type after erasure</em>.</li>
<li>(b) ✗ Vrátí <code>true</code> (s varováním) — za běhu se testuje jen <code>List</code>.</li>
<li>(c) ✓ <code>ArrayStoreException</code> (slide 63).</li>
<li>(d) ✓ Expansion (slide 62, 78).</li>
<li>(e) ✗ Bound není variance — <code>Box</code> zůstává invariantní (slide 47).</li>
</ul>`,
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 63, quote: 'All generic types in Java are invariant and implemented using type erasure' },
      { kind: 'slide', doc: 'L4', page: 78, quote: 'Expansion specializes code at compile time (C++ templates).' },
      { kind: 'slide', doc: 'L4', page: 47, quote: 'Even with the bound, invariant Box[Cat] is not a subtype of Box[Animal].' },
    ],
  },
]
