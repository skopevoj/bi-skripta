import type { Chapter } from '../types'

// Kapitola 4 — Parametric polymorphism (L4).
// Úvodní warm-up „Static vs Dynamic Dispatch Q1–Q8“ (slidy 9–16) je v kapitole 2.
// Všechny `runnable` programy ověřeny se scala-cli (Scala 3.9.0).

export const chap04: Chapter = {
  id: 'chap-4',
  number: '4',
  title: 'Parametrický polymorfismus (generika)',
  lecture: 'L4',
  summary:
    'Na papíře rozhodneš, co se stane s generickou třídou/metodou: jaký je statický typ výsledku, co smíš předat a zavolat při upper/lower boundu, kdy platí Box[A] <: Box[B] (variance), proč +T nesmí být v parametru a co udělá type erasure s pattern matchingem.',
  sections: [
    // =====================================================================
    {
      id: 'sec-4-1',
      number: '4.1',
      title: 'Generické třídy a metody',
      blocks: [
        {
          kind: 'p',
          html: 'Chceme jeden <code>List</code> pro <code>Int</code>, <code>String</code>… Copy-paste porušuje DRY, <code>List</code> s prvky typu <code>Any</code> zase ztrácí typovou kontrolu (casty, runtime chyby). Generika řeší obojí: jedna definice, plná statická typová kontrola.',
          sources: [
            { kind: 'slide', doc: 'L4', page: 20, quote: 'Reduced help from the compiler' },
            { kind: 'slide', doc: 'L4', page: 22, quote: 'allows one to make functions and data types generic' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Pojmy',
          html: `<ul>
<li><strong>type parameter</strong> — <code>T</code> v <code>class PList[T]</code> nebo <code>def g[R](…)</code>.</li>
<li><strong>type argument</strong> — konkrétní typ, který dosadím: <code>PList[String]</code>.</li>
<li><strong>type constructor</strong> — <code>PList</code> sám o sobě není typ, vyrábí typy (<code>PList[String]</code> už typ je).</li>
<li>Typové parametry může mít <strong>třída</strong> (argument dodám při vytvoření typu) i <strong>metoda</strong> (argument se dodá při volání), i když třída žádné nemá. Často je odvodí compiler.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 22, quote: 'PList is a type constructor (constructing new types)' },
            { kind: 'slide', doc: 'L4', page: 23, quote: 'values are provided at call sites' },
          ],
        },
        {
          kind: 'code',
          caption: 'Generická třída a generická metoda (podle slidů 22–23)',
          runnable: true,
          code: `class PList[T](val head: T, val tail: PList[T]):
  def including(x: T): PList[T] = PList(x, this)

def firstOr[T](xs: PList[T], default: T): T =
  if xs == null then default else xs.head

@main def run() =
  val xs: PList[String] = PList[String]("a", null).including("b")
  println(xs.head.toUpperCase)      // head má statický typ String → žádný cast
  println(firstOr(xs, "nic"))       // T odvozeno jako String
  println(firstOr[Int](null, 42))   // T zadáno explicitně`,
          sources: [{ kind: 'slide', doc: 'L4', page: 22 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jaký statický typ má výsledek generické metody?',
          html: `<ol>
<li>Zjisti, čemu se rovná <code>T</code>: u třídy podle <code>Container[B]()</code> / deklarace proměnné, u metody podle explicitního <code>[…]</code>, jinak ho odvodí compiler z argumentů (u více argumentů = <strong>nejbližší společný nadtyp</strong>).</li>
<li>Dosaď: <code>def store(x: T): T</code> s <code>T = B</code> je <code>store(x: B): B</code>.</li>
<li>Výsledek má statický typ <code>B</code> — <strong>bez ohledu na to</strong>, jaký objekt jsi tam reálně poslal.</li>
<li>Na výsledku smíš volat jen metody statického typu. Které tělo se pustí, rozhoduje pořád <strong>dynamický dispatch</strong> (overridnutá metoda podtřídy).</li>
</ol>`,
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Sample midterm, otázka 1: What will it print?',
          html: `<ol>
<li><code>Container[B]()</code> → <code>T = B</code> → <code>store(x: B): B</code>.</li>
<li><code>C()</code> je podtyp <code>B</code>, předat jde. Ale <code>v</code> má statický typ <code>B</code>.</li>
<li><code>v.m3</code>: <code>B</code> nemá <code>m3</code> → <strong>compile error</strong> (<em>value m3 is not a member of B</em>).</li>
</ol>
Že za běhu v <code>v</code> leží objekt <code>C</code>, nehraje roli — compiler se dívá jen na statický typ.`,
          code: `class A:
  def m1: Int = 1

class B extends A:
  def m2: Int = 2

class C extends B:
  def m3: Int = 3

class Container[T]:
  def store(x: T): T = x

val container = Container[B]()
val v = container.store(C())

println(v.m3)   // CE`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 1' }],
        },
        {
          kind: 'code',
          caption: 'Co se zkompiluje: metody z B ano, objekt je přitom opravdu C',
          runnable: true,
          code: `class A:
  def m1: Int = 1
class B extends A:
  def m2: Int = 2
class C extends B:
  def m3: Int = 3

class Container[T]:
  def store(x: T): T = x

@main def run() =
  val container = Container[B]()
  val v = container.store(C())   // statický typ B, za běhu C
  println(v.m2)                  // m2 je v B → OK
  println(v.isInstanceOf[C])     // objekt JE C, jen to compiler neví
  // println(v.m3)               // CE: value m3 is not a member of B`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Odvozený typ je společný nadtyp, ne typ posledního argumentu',
          html: `<code>def pick[T](a: T, b: T): T = b</code> a <code>pick(B(), C())</code>: compiler zvolí <code>T = B</code> (nejbližší společný nadtyp), takže výsledek je <code>B</code> a <code>.mc</code> z <code>C</code> nejde zavolat, i když metoda vrací právě to <code>C()</code>.`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Na neomezeném T nejde zavolat skoro nic',
          html: `Uvnitř <code>class Box[T]</code> o <code>x: T</code> compiler neví nic — <code>T</code> může být cokoli (i <code>Int</code>). Smíš volat jen metody z <code>Any</code> (<code>toString</code>, <code>==</code>, <code>hashCode</code>). <code>def accept(x: T): Int = x.m</code> je <strong>compile error</strong> <em>value m is not a member of T</em> — a to i když všechna reálná použití dosazují třídy, které <code>m</code> mají. Řešení je upper bound <code>[T <: A]</code> (sekce 4.2).`,
          sources: [{ kind: 'slide', doc: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' }],
        },
        { kind: 'quiz', ids: ['ch4-01', 'ch4-02', 'ch4-03'], title: 'Generika: statický typ výsledku' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-2',
      number: '4.2',
      title: 'Upper a lower bounds',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Upper bound a lower bound',
          html: `<ul>
<li><strong>Upper bound</strong> <code>[T <: B]</code> — <code>T</code> musí být <code>B</code> nebo jeho podtyp. Uvnitř smíš na <code>x: T</code> volat metody <code>B</code>.</li>
<li><strong>Lower bound</strong> <code>[T >: B]</code> — <code>T</code> musí být <code>B</code> nebo jeho <em>nadtyp</em>. O <code>x: T</code> nevíš skoro nic (nadtypem je i <code>Any</code>).</li>
<li>Bound se dá napsat na typový parametr třídy, metody, nebo na wildcard v typu: <code>Collection[? <: T]</code> (na slidech je starší zápis <code>[_ <: T]</code>, ve Scale 3 je <code>_</code> deprecated, píše se <code>?</code>).</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 33, quote: 'means that the src collection may have elements of any type' },
            { kind: 'slide', doc: 'L4', page: 37, quote: 'the target collection may have elements of any type' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Co můžu volat na x: T?',
          html: `Podívej se na deklaraci <code>T</code>:
<ul>
<li><code>[T]</code> bez boundu → jen metody <code>Any</code> (<code>toString</code>, <code>==</code>, <code>hashCode</code>). Cokoli jiného = <strong>CE</strong>.</li>
<li><code>[T <: B]</code> → metody <code>B</code> (a jeho předků). Za běhu se pustí override z reálné třídy objektu.</li>
<li><code>[R >: T]</code> → zase jen metody <code>Any</code>. Lower bound <strong>nepřidává žádné metody</strong>, i kdyby <code>T</code> samo mělo upper bound.</li>
<li>Kombinace <code>[R >: C <: A]</code> → metody <code>A</code> (rozhoduje upper bound).</li>
</ul>`,
          sources: [{ kind: 'slide', doc: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Co můžu předat jako argument?',
          html: `<ol>
<li><strong>Typ je už dosazený</strong> (<code>Test[B]().test(x: T)</code>) → parametr je obyčejné <code>x: B</code> → projde <code>B</code> a jeho podtřídy, nic jiného (sourozenci ani nadtřídy ne).</li>
<li><strong>Upper bound na metodě</strong> <code>def f[T <: B](x: T)</code> → <code>B</code> a jeho podtřídy.</li>
<li><strong>Lower bound na metodě</strong> <code>def f[T >: B](x: T)</code> a typ <em>nenapíšu</em> → projde <strong>cokoli</strong>: compiler zvolí <code>T</code> jako nadtyp <code>B</code> i argumentu (v nejhorším <code>Any</code>). I podtřída <code>B</code> projde (<code>T = B</code>).</li>
<li>Typ <em>napíšu explicitně</em> → bound se kontroluje: <code>f[Sub](Sub())</code> s <code>T >: MyClass</code> = <strong>CE</strong> (<em>does not conform to lower bound</em>).</li>
<li>Upper bound na <strong>třídě</strong> <code>class Processor[T <: B]</code> → <code>Processor[A]()</code> je CE hned při vytvoření.</li>
</ol>`,
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Sample midterm, otázka 2: co lze předat do f[A >: MyClass](x: A)?',
          html: `Bez explicitního typového argumentu compiler vždy najde vhodné <code>A</code>: pro <code>Sub()</code> zvolí <code>A = MyClass</code>, pro <code>42</code> nadtyp <code>MyClass</code> i <code>Int</code> (ve Scale 3 např. union <code>MyClass | Int</code>, jinak <code>Any</code>).
Správně tedy jsou <strong>všechny možnosti kromě „MyClass only“</strong>: MyClass a nadtřídy, podtřídy, <code>Int</code> i <code>String</code>. Ověřeno scala-cli (viz program níže).`,
          code: `def f[A >: MyClass](x: A): Unit

// □ MyClass only                      ✗
// □ MyClass and all its superclasses  ✓
// □ Int                               ✓
// □ MyClass and all its subclasses    ✓
// □ String                            ✓`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 2' }],
        },
        {
          kind: 'code',
          caption: 'Lower bound na parametru propustí cokoli',
          runnable: true,
          code: `class MyClass
class Sub extends MyClass

def f[A >: MyClass](x: A): Unit = println(x.getClass.getSimpleName)

@main def run() =
  f(MyClass())    // A = MyClass
  f(Sub())        // A = MyClass, Sub <: MyClass
  f(42)           // A = nadtyp MyClass i Int
  f("hello")
  // f[Sub](Sub()) // CE: Sub does not conform to lower bound MyClass`,
        },
        {
          kind: 'code',
          caption: 'Upper bound na třídě (sample midterm, otázka 5 → vypíše 3)',
          runnable: true,
          code: `class A:
  def ma(): Int = 1
class B extends A:
  def mb(): Int = 2
class C extends B:
  def mc(): Int = 3

class Processor[T <: B]:
  def compute(x: T): T = x
  def sum(x: T): Int = x.ma() + x.mb()   // díky T <: B smím volat metody B

@main def run() =
  val processor = Processor[C]()
  println(processor.compute(C()).mc())   // T = C → výsledek je C → mc() jde
  println(processor.sum(C()))
  // Processor[A]()                      // CE: A does not conform to upper bound B`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 5' }],
        },
        {
          kind: 'p',
          html: '<strong>Bounds ve wildcardu.</strong> <code>ArrayList</code> je mutable, tedy invariantní: <code>animals.addAll(cats)</code> s parametrem <code>Collection[T]</code> neprojde. Řešení <code>addAll(src: Collection[? <: T])</code> — ze <code>src</code> jen čteme. Opačně <code>popAll(dst: Collection[? >: T])</code> — do <code>dst</code> jen zapisujeme.',
          sources: [
            { kind: 'slide', doc: 'L4', page: 32 },
            { kind: 'slide', doc: 'L4', page: 33 },
            { kind: 'slide', doc: 'L4', page: 37 },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Get and Put Principle',
          html: `<ul>
<li>Jen <strong>čtu</strong> (producent) → upper bound <code>? <: T</code>. Ven dostanu <code>T</code>, dovnitř nevložím nic (compiler nezná přesný typ, viz Odie na slidu 34).</li>
<li>Jen <strong>zapisuju</strong> (konzument) → lower bound <code>? >: T</code>. Dovnitř vložím <code>T</code>, ven dostanu jen <code>Any</code>.</li>
<li>Čtu i zapisuju → <strong>žádný bound</strong>.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 38, quote: 'use upper bound when you only get values out of a structure,' },
            { kind: 'slide', doc: 'L4', page: 38, quote: "don't use type bounds when you both get and put." },
            { kind: 'slide', doc: 'L4', page: 76, quote: 'Upper bounds (<: T): read values safely from a producer.' },
            { kind: 'slide', doc: 'L4', page: 76, quote: 'Lower bounds (>: T): write values safely to a consumer.' },
          ],
        },
        {
          kind: 'code',
          caption: 'copy[T] podle slidu 38 (s ArrayBuffer ze standardní knihovny)',
          runnable: true,
          code: `import scala.collection.mutable.ArrayBuffer

class Animal(val name: String)
class Cat(name: String) extends Animal(name)
class Dog(name: String) extends Animal(name)

// src: jen čtu (producent) → ? <: T,  dst: jen zapisuju (konzument) → ? >: T
def copy[T](src: ArrayBuffer[? <: T], dst: ArrayBuffer[? >: T]): Unit =
  for x <- src do dst += x

@main def run() =
  val cats = ArrayBuffer(Cat("Garfield"), Cat("Arlene"))
  val animals = ArrayBuffer[Animal](Dog("Odie"))
  copy(cats, animals)
  println(animals.map(_.name).mkString(", "))

  val view: ArrayBuffer[? <: Animal] = cats   // pohled jen pro čtení
  println(view(0).name)                       // čtení OK
  // view += Dog("Odie")                      // CE: Found: Dog, Required: Nothing & Animal`,
          sources: [{ kind: 'slide', doc: 'L4', page: 38 }],
        },
        {
          kind: 'interactive',
          component: 'bounds-lab',
          title: 'Bounds lab: co projde a co zavolám',
          hint: 'Zvol bound (žádný / <: B / >: B) a zkus, které argumenty projdou a které metody jdou zavolat na x.',
        },
        { kind: 'quiz', ids: ['ch4-04', 'ch4-05', 'ch4-06', 'ch4-07'], title: 'Bounds' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-3',
      number: '4.3',
      title: 'Variance: kdy je Box[Cat] podtyp Box[Animal]?',
      blocks: [
        {
          kind: 'p',
          html: '<code>Cat <: Animal</code> automaticky <strong>neznamená</strong> <code>Box[Cat] <: Box[Animal]</code>. Jestli a jak se subtyping „přenese“ na generický typ, určuje <strong>variance annotation</strong> u typového parametru v definici třídy.',
          sources: [{ kind: 'slide', doc: 'L4', page: 75, quote: 'Subtyping does not automatically lift: C[Cat] need not be a subtype of C[Animal].' }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Tři druhy variance (platí A <: B)',
          html: `<ul>
<li><code>Box[+T]</code> <strong>kovariantní</strong>: <code>Box[A] <: Box[B]</code> — směr zachován. „Výstup / producent“ (immutable <code>List[+A]</code>).</li>
<li><code>Box[-T]</code> <strong>kontravariantní</strong>: <code>Box[B] <: Box[A]</code> — směr obrácen. „Vstup / konzument“.</li>
<li><code>Box[T]</code> <strong>invariantní</strong> (default): mezi <code>Box[A]</code> a <code>Box[B]</code> není žádný vztah. Mutable kolekce (<code>ArrayList</code>, <code>ArrayBuffer</code>).</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
            { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
            { kind: 'slide', doc: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
            { kind: 'slide', doc: 'L4', page: 42 },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Zkompiluje se přiřazení val x: Box[X] = (něco typu Box[Y])?',
          html: `<ol>
<li>Najdi v definici <code>Box</code> značku u parametru: <code>+</code>, <code>-</code>, nebo nic.</li>
<li>Porovnej <code>Y</code> (vpravo) s <code>X</code> (vlevo):
<ul>
<li>nic (invariant) → jen když <code>Y = X</code>,</li>
<li><code>+T</code> → když <code>Y <: X</code> (konkrétnější do obecnějšího),</li>
<li><code>-T</code> → když <code>X <: Y</code> (obecnější do konkrétnějšího).</li>
</ul></li>
<li><strong>Pozor na pravou stranu:</strong> je-li to volání konstruktoru <em>bez</em> explicitního <code>[…]</code> (<code>Box(C())</code>), typový argument ještě není pevný — compiler ho přizpůsobí levé straně a projde to i u invariantního <code>Box</code>. Hotová proměnná typu <code>Box[C]</code> nebo <code>Box[C](…)</code> už se nepřizpůsobí.</li>
<li>Pak teprve řeš, jestli jde zavolat metoda / co se vypíše (statický typ, dispatch).</li>
</ol>`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'val b: Box[A] = Box(C()) se zkompiluje i pro invariantní Box',
          html: `<code>class Box[T](val v: T)</code>. <code>val b: Box[A] = Box(C())</code> ✓ (compiler zvolí <code>T = A</code>). Ale <code>val c = Box(C()); val b: Box[A] = c</code> ✗ — <em>Found: Box[C], Required: Box[A]</em>. Na testu si všimni, jestli vpravo je hotová proměnná, nebo konstruktor.`,
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Proč musí být mutable kontejner invariantní',
          html: `Kdyby <code>ArrayList[Cat] <: ArrayList[Animal]</code>, šlo by:
<ol>
<li><code>val animals: ArrayList[Animal] = cats</code></li>
<li><code>animals.add(odie)</code> — pro <code>ArrayList[Animal]</code> legální</li>
<li><code>for cat <- cats do cat.jump()</code> — Odie neumí <code>jump()</code> → díra v typovém systému.</li>
</ol>
Problém je <strong>zápis</strong> (metoda, která bere <code>T</code>). Immutable <code>List[+A]</code> nic nezapisuje, proto může být kovariantní. Java to u polí dovolila (pole jsou kovariantní) a platí za to runtime výjimkou <code>ArrayStoreException</code>.`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 29, quote: 'Given that Cat <: Animal is it the case that' },
            { kind: 'slide', doc: 'L4', page: 43 },
            { kind: 'slide', doc: 'L4', page: 44 },
            { kind: 'slide', doc: 'L4', page: 63, quote: 'All generic types in Java are invariant and implemented using type erasure' },
          ],
        },
        {
          kind: 'code',
          caption: 'Kontravariance: hřiště pro všechna zvířata zvládne i kočku (slidy 52–53)',
          runnable: true,
          code: `class Animal(val name: String):
  def sleep(): Unit = println(s"$name: sleeps")
class Cat(name: String) extends Animal(name):
  def jump(): Unit = println(s"$name: jumps")
class DancingCat(name: String) extends Cat(name):
  def dance(): Unit = println(s"$name: dances")

abstract class Playground[-T]:
  def play(x: T): Unit

class AnimalPlayground extends Playground[Animal]:
  def play(x: Animal) = x.sleep()
class CatPlayground extends Playground[Cat]:
  def play(x: Cat) = x.jump()
class DancingCatPlayground extends Playground[DancingCat]:
  def play(x: DancingCat) = x.dance()

def sendGarfieldToPlay(out: Playground[Cat]): Unit = out.play(Cat("Garfield"))

@main def run() =
  sendGarfieldToPlay(CatPlayground())      // Playground[Cat] <: Playground[Cat]
  sendGarfieldToPlay(AnimalPlayground())   // Playground[Animal] <: Playground[Cat] díky -T
  // sendGarfieldToPlay(DancingCatPlayground()) // CE: Garfield neumí dance()`,
          sources: [{ kind: 'slide', doc: 'L4', page: 53 }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Sample midterm, otázka 10: What will it print?',
          html: `<ol>
<li>Přiřazení: <code>-T</code>, <code>C <: B</code> ⇒ <code>Consumer[B] <: Consumer[C]</code> ✓ — tohle je ta „variance“ návnada.</li>
<li>Ale tělo třídy: <code>x: T</code> a <code>T</code> nemá bound → <code>x.m</code> je <strong>compile error</strong> (<em>value m is not a member of T</em>).</li>
<li>Odpověď: <strong>nezkompiluje se</strong>. Kontroluj vždy i definici třídy, ne jen poslední řádky.</li>
</ol>
S <code>class Consumer[-T <: A]</code> by se to zkompilovalo a vypsalo <code>3</code> (dispatch na <code>C.m</code>).`,
          code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Consumer[-T]:
  def accept(x: T): Int = x.m   // CE

val consumer: Consumer[C] = Consumer[B]()
println(consumer.accept(C()))`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 10' }],
        },
        {
          kind: 'code',
          caption: 'Opravená verze s upper boundem → vypíše 3',
          runnable: true,
          code: `class A:
  def m: Int = 1
class B extends A:
  override def m: Int = 2
class C extends B:
  override def m: Int = 3

class Consumer[-T <: A]:            // upper bound → x.m je povolené
  def accept(x: T): Int = x.m

@main def run() =
  val consumer: Consumer[C] = Consumer[B]()   // -T: C <: B ⇒ Consumer[B] <: Consumer[C]
  println(consumer.accept(C()))`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Sample otázky 6 a 8: směr šipky',
          html: `<ul>
<li><code>Consumer[-T]</code>: pravdivé jsou „T is a contravariant type parameter“, „if A <: B then Consumer[A] >: Consumer[B]“ a „if A <: B then Consumer[B] <: Consumer[A]“ — poslední dvě říkají totéž, jen jinak zapsané. Zaškrtni obě.</li>
<li><code>var animals: Collection[Animal] = dogs</code> (<code>dogs: Collection[Dog]</code>) → potřebuju <code>Collection[Dog] <: Collection[Animal]</code> → jen <strong>Covariant</strong>.</li>
</ul>`,
          sources: [
            { kind: 'official', label: 'Sample midterm 2026, otázka 6' },
            { kind: 'official', label: 'Sample midterm 2026, otázka 8' },
          ],
        },
        {
          kind: 'interactive',
          component: 'variance-lab',
          title: 'Variance lab',
          hint: 'Zvol +T / -T / T a dvojici tříd z hierarchie; tipni si, jestli přiřazení Box[X] = Box[Y] projde.',
        },
        { kind: 'quiz', ids: ['ch4-08', 'ch4-09', 'ch4-10', 'ch4-11'], title: 'Variance' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-4',
      number: '4.4',
      title: 'Variance positions a trik s lower boundem',
      blocks: [
        {
          kind: 'p',
          html: 'Compiler hlídá, aby varianci nešlo zneužít: kovariantní <code>T</code> nesmí být tam, kde se hodnota <em>přijímá</em>. Jinak by šlo přes <code>Cell[Any]</code> zapsat <code>1</code> do <code>Cell[String]</code> (slide 43), nebo přes <code>Cell[Any]</code> poslat <code>"FIT"</code> do overridnuté metody, která čeká <code>Int</code> (slide 45).',
          sources: [
            { kind: 'slide', doc: 'L4', page: 43 },
            { kind: 'slide', doc: 'L4', page: 45, quote: 'A covariant type cannot occur in contravariant positions (method parameters, vars)' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Smí tu být +T / -T? (variance positions)',
          html: `<ul>
<li><strong>Kovariantní pozice (+)</strong>: návratový typ metody, <code>val</code>. Tady smí <code>+T</code>, nesmí <code>-T</code>.</li>
<li><strong>Kontravariantní pozice (−)</strong>: typ parametru metody. Tady smí <code>-T</code>, nesmí <code>+T</code>.</li>
<li><strong>Invariantní pozice</strong>: veřejný <code>var</code> (getter + setter). Nesmí ani <code>+T</code>, ani <code>-T</code>.</li>
<li>Funkce v parametru otáčí znovu: <code>def each(f: T => Unit)</code> je pro <code>+T</code> OK (− × − = +), <code>def make(f: Unit => T)</code> ne.</li>
<li>Lower bound typového parametru metody (<code>[U >: T]</code>) je pro <code>+T</code> v pořádku.</li>
</ul>
Chybové hlášky: <em>covariant type T occurs in contravariant position in type T of parameter x</em>, <em>… occurs in invariant position in type T of variable</em>, <em>contravariant type T occurs in covariant position</em>.`,
          sources: [{ kind: 'slide', doc: 'L4', page: 50 }],
        },
        {
          kind: 'code',
          caption: 'Co compiler odmítne (každý řádek s CE ověřen zvlášť)',
          code: `class Box[+T](init: T):
  def get: T = init                       // OK
  val v: T = init                         // OK
  def each(f: T => Unit): Unit = f(init)  // OK
  def set(x: T): Unit = ()                // CE: covariant T in contravariant position
  var w: T = init                         // CE: covariant T in invariant position
  def make(f: Unit => T): Unit = ()       // CE: covariant T in contravariant position

class Sink[-T]:
  def get: T = ???                        // CE: contravariant T in covariant position`,
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Trik: def add[U >: T](x: U): Box[U]',
          html: `Jak přidat prvek do kovariantního <code>List[+T]</code>, když <code>T</code> nesmí být v parametru? Zavedeme nový parametr <code>U >: T</code> a vrátíme <strong>nový</strong> <code>List[U]</code>:
<ul>
<li>přidám <code>Cat</code> do <code>List[Cat]</code> → <code>U = Cat</code> → <code>List[Cat]</code>,</li>
<li>přidám <code>Dog</code> do <code>List[Cat]</code> → <code>U</code> = nejbližší společný nadtyp = <code>Animal</code> → <code>List[Animal]</code>,</li>
<li>původní seznam se nemění, nic se nerozbije.</li>
</ul>
Přesně tak je definované <code>appended</code> ve standardní knihovně.`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 51, quote: 'T is Cat, R has to be Animal since that is' },
            { kind: 'slide', doc: 'L4', page: 51, quote: 'the closest basetype of both Cat and Dog' },
          ],
        },
        {
          kind: 'code',
          caption: 'Kovariantní zásobník s push[U >: T]',
          runnable: true,
          code: `class Animal:
  def sound: String = "..."
class Cat extends Animal:
  override def sound = "meow"
class Dog extends Animal:
  override def sound = "woof"

class Stack[+T](val items: List[T]):
  def top: T = items.head
  // def push(x: T): Stack[T]          // CE: covariant type T occurs in contravariant position
  def push[U >: T](x: U): Stack[U] = Stack(x :: items)

@main def run() =
  val cats: Stack[Cat] = Stack(List(Cat()))
  val all = cats.push(Dog())            // U = Animal → Stack[Animal]
  println(all.top.sound)                // statický typ Animal, za běhu Dog
  println(all.items.map(_.sound))
  println(cats.items.map(_.sound))      // původní zásobník se nezměnil`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Lower bound nic nezakazuje',
          html: `<code>cats.push("x")</code> se taky zkompiluje — výsledek je <code>Stack[Cat | String]</code> (resp. obecně nějaký společný nadtyp). Lower bound typ výsledku <em>rozšíří</em>, ale argument neodmítne. A na <code>all.top</code> typu <code>Animal</code> nejde zavolat <code>bark()</code>.`,
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'private var',
          html: '<code>private var current: T</code> uvnitř <code>Cell[+T]</code> compiler (Scala 3) toleruje — zvenku do něj nikdo nezapíše. Chyba na slidu 43 vzniká až na veřejné metodě <code>set(x: T)</code>.',
          sources: [{ kind: 'slide', doc: 'L4', page: 43 }],
        },
        { kind: 'quiz', ids: ['ch4-12', 'ch4-13'], title: 'Variance positions' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-5',
      number: '4.5',
      title: 'Subtyping funkcí',
      blocks: [
        {
          kind: 'p',
          html: 'Funkce <code>S => T</code> je ve Scale instance <code>Function1[S, T]</code> s metodou <code>apply(x: S): T</code>. Vstup <code>S</code> je v parametru → kontravariantní, výstup <code>T</code> je návratový typ → kovariantní. Proto <code>trait Function1[-S, +T]</code>.',
          sources: [
            { kind: 'slide', doc: 'L4', page: 54 },
            { kind: 'slide', doc: 'L4', page: 77, quote: 'Function1[-S, +T] combines both directions.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Je (A => B) podtyp (S => T)?',
          html: `<code>(A => B) <: (S => T)</code> ⇔ <code>S <: A</code> <strong>a</strong> <code>B <: T</code>.
<ol>
<li>Vstupy porovnej <strong>obráceně</strong>: dosazovaná funkce musí umět přijmout <em>aspoň</em> to, co se po ní chce (širší vstup je OK).</li>
<li>Výstupy porovnej <strong>normálně</strong>: musí vracet <em>nejvýš</em> to, co se slibuje (užší výstup je OK).</li>
<li>Musí platit obojí.</li>
</ol>
Pomůcka: „accept more, return less“. Příklad: <code>(Animal => Cat) <: (Cat => Animal)</code> ✓, opačně ✗.`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 59, quote: '(A => B) <: (S => T) iff S <: A and B <: T.' },
            { kind: 'slide', doc: 'L4', page: 59, quote: 'Inputs are contravariant, outputs are covariant.' },
            { kind: 'slide', doc: 'L4', page: 56, quote: 'Input contravariance reverses the subtype relation.' },
            { kind: 'slide', doc: 'L4', page: 57, quote: 'Return-type covariance preserves the subtype relation.' },
          ],
        },
        {
          kind: 'code',
          caption: 'Router ze slidů 55–58: všechny tři handlery jdou předat',
          runnable: true,
          code: `class Request(val path: String)
class GetRequest(path: String) extends Request(path)
class Response(val status: Int)
class JsonResponse(status: Int) extends Response(status)

def route(h: GetRequest => Response): Int =
  h(GetRequest("/status")).status

def generalHandler(r: Request): Response = Response(200)
def jsonHandler(r: GetRequest): JsonResponse = JsonResponse(201)
def flexibleHandler(r: Request): JsonResponse = JsonResponse(202)

@main def run() =
  println(route(generalHandler))    // vstup širší   → OK (kontravariance)
  println(route(jsonHandler))       // výstup užší   → OK (kovariance)
  println(route(flexibleHandler))   // obojí najednou → OK`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 56 },
            { kind: 'slide', doc: 'L4', page: 57 },
            { kind: 'slide', doc: 'L4', page: 58 },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Slide 59: které přiřazení se zkompiluje?',
          html: `<ul>
<li><code>x</code>: vstup <code>GetRequest <: Request</code> ✓, výstup <code>JsonResponse <: Response</code> ✓ → <strong>OK</strong>.</li>
<li><code>y</code>: funkce umí jen <code>GetRequest</code>, ale slibuje se libovolný <code>Request</code> ✗ → <strong>CE</strong>.</li>
<li><code>z</code>: vrací <code>Response</code>, slibuje se <code>JsonResponse</code> ✗ → <strong>CE</strong>.</li>
</ul>
Ověřeno scala-cli: chyby hlásí přesně řádky <code>y</code> a <code>z</code>.`,
          code: `val x: GetRequest => Response =
  (r: Request) => JsonResponse(200)      // OK

val y: Request => Response =
  (r: GetRequest) => Response(200)       // CE

val z: GetRequest => JsonResponse =
  (r: Request) => Response(200)          // CE`,
          sources: [{ kind: 'slide', doc: 'L4', page: 59 }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Souvislost s override',
          html: 'Stejná logika jako u pravidel pro override z kapitoly 2: přepisující metoda smí mít užší návratový typ (kovariance). Rozdíl: ve Scale parametr overridu nesmí být širší — to by byl overloading, ne override. U <em>funkčních hodnot</em> (<code>=></code>) širší vstup projde.',
        },
        { kind: 'quiz', ids: ['ch4-14'], title: 'Funkce' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-6',
      number: '4.6',
      title: 'Bounds vs variance',
      blocks: [
        {
          kind: 'p',
          html: 'Na generika se dají položit tři nezávislé otázky: <strong>jaké argumenty jsou přípustné</strong> (bounds), <strong>kdy jsou různé instance zaměnitelné</strong> (variance, wildcardy) a <strong>jak je to implementované</strong> (erasure / reifikace / expanze).',
          sources: [
            { kind: 'slide', doc: 'L4', page: 65, quote: 'What arguments are valid? Bounds, constraints, concepts.' },
            { kind: 'slide', doc: 'L4', page: 65, quote: 'When are different instantiations substitutable? Variance and projections.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Bound není variance',
          html: `<code>class Box[T <: Animal]</code> jen říká, že smím vytvořit <code>Box[Cat]</code>, ale ne <code>Box[Int]</code>, a že na <code>T</code> smím volat metody <code>Animal</code>. <code>Box[Cat]</code> <strong>pořád není</strong> podtyp <code>Box[Animal]</code> — to by udělalo jen <code>+T</code>.`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' },
            { kind: 'slide', doc: 'L4', page: 47, quote: 'Even with the bound, invariant Box[Cat] is not a subtype of Box[Animal].' },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Bound v deklaraci</strong> <code>class Box[T <: Animal]</code> — omezuje <code>T</code> u <em>každé</em> instance.',
            '<strong>Variance</strong> <code>class Box[+T]</code> (declaration-site) — určuje subtyping <em>při každém použití</em>.',
            '<strong>Wildcard</strong> <code>Collection[? <: Animal]</code> (use-site) — omezuje jen <em>tento jeden pohled</em>, třída sama zůstává invariantní.',
          ],
          sources: [
            { kind: 'slide', doc: 'L4', page: 48, quote: 'Declaration-site variance (+T or -T) determines subtyping at every use.' },
            { kind: 'slide', doc: 'L4', page: 48, quote: 'A wildcard/projection (Collection[_ <: Animal]) restricts only that particular view.' },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Jiné jazyky (jen pro orientaci)',
          html: 'Java: generika invariantní, varianci řeší wildcardy <code>? extends</code> / <code>? super</code> (PECS = get/put princip). Kotlin a C#: <code>out T</code> / <code>in T</code> na deklaraci (read-only <code>List</code> kovariantní, <code>MutableList</code> invariantní). C++: kontejnery nejsou kovariantní vůbec, <code>concept</code>/<code>requires</code> je bound, ne variance.',
          sources: [
            { kind: 'slide', doc: 'L4', page: 68, quote: 'T extends Base restricts every Box<T> instantiation.' },
            { kind: 'slide', doc: 'L4', page: 71, quote: 'MutableList<T> is invariant; out projection restricts a view.' },
            { kind: 'slide', doc: 'L4', page: 70 },
          ],
        },
      ],
    },

    // =====================================================================
    {
      id: 'sec-4-7',
      number: '4.7',
      title: 'Type erasure',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Type erasure',
          html: `Typové parametry a argumenty existují <strong>jen při kompilaci</strong>. Za běhu je <code>List[String]</code> i <code>List[Int]</code> prostě <code>List</code>. Odstranění typových argumentů se říká <strong>type erasure</strong> (Java, Scala).
Alternativy: <strong>reifikace</strong> — typ se za běhu uchovává (C#, Java pole); <strong>expanze</strong> — compiler vyrobí pro každý typový argument zvláštní kód (C++ šablony).`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 62, quote: 'for compile-time only, no type parameters are present at runtime' },
            { kind: 'slide', doc: 'L4', page: 62, quote: 'the process of removing type parameters is called type erasure' },
            { kind: 'slide', doc: 'L4', page: 78, quote: 'Type erasure removes generic type arguments at runtime (Java, Scala).' },
            { kind: 'slide', doc: 'L4', page: 78, quote: 'Expansion specializes code at compile time (C++ templates).' },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Zkouška 2026: case _: List[String] pro List[String] a List[Int]',
          html: `<ol>
<li>Za běhu se typový argument nedá zjistit, takže <code>case _: List[String]</code> se vyhodnotí jako „je to <code>List</code>?“.</li>
<li><code>f(List("a"))</code> → <code>true</code>. <code>f(List(1, 2))</code> → taky <strong><code>true</code></strong>.</li>
<li>Kód se zkompiluje, compiler jen varuje: <em>the type test for List[String] cannot be checked at runtime</em>.</li>
</ol>
Odpověď „<code>false</code> pro <code>List[Int]</code>“ je špatně.`,
          code: `def f(x: Any): Boolean = x match
  case _: List[String] => true
  case _               => false`,
          sources: [{ kind: 'wiki', label: 'Zkouška 23. 1. 2026', page: 'oop_zkouska_2026-01-23' }],
        },
        {
          kind: 'code',
          caption: 'Ověření',
          runnable: true,
          code: `def isStrings(x: Any): Boolean = x match
  case _: List[String] => true      // warning: cannot be checked at runtime
  case _               => false

@main def run() =
  println(isStrings(List("a", "b")))
  println(isStrings(List(1, 2)))     // erasure: testuje se jen „je to List?“
  println(isStrings(Vector("a")))`,
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Další důsledky erasure',
          html: `<ul>
<li>Přidáš-li za <code>case _: List[String]</code> ještě <code>case _: List[Int]</code>, compiler ho označí jako <em>Unreachable case</em> — nikdy se nespustí.</li>
<li><code>x.isInstanceOf[List[String]]</code> pro <code>List(1, 2)</code> vrátí <code>true</code> (s varováním).</li>
<li>Overloading jen podle typového argumentu nejde: <code>def f(xs: List[Int])</code> + <code>def f(xs: List[String])</code> → CE <em>Conflicting definitions … have the same type after erasure</em>.</li>
<li>Pole jsou výjimka: <code>case _: Array[Int]</code> funguje, pole si typ prvků za běhu nesou.</li>
</ul>`,
        },
        { kind: 'quiz', ids: ['ch4-15', 'ch4-16'], title: 'Type erasure' },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Shrnutí kapitoly',
          html: `<ul>
<li>Výsledek <code>def f(x: T): T</code> má statický typ dosazeného <code>T</code>; metody podtřídy na něm nezavoláš. Na neomezeném <code>T</code> nejde volat nic kromě <code>Any</code>.</li>
<li><code>[T <: B]</code>: přípustné jen <code>B</code> a podtypy, a smíš volat metody <code>B</code>. <code>[T >: B]</code> na parametru metody: projde cokoli, volat nejde nic.</li>
<li><code>+T</code>: <code>Box[Cat] <: Box[Animal]</code>; <code>-T</code>: <code>Box[Animal] <: Box[Cat]</code>; <code>T</code>: žádný vztah. Mutable ⇒ invariantní.</li>
<li><code>+T</code> nesmí do parametru ani <code>var</code> → trik <code>def add[U >: T](x: U): Box[U]</code>.</li>
<li><code>Function1[-S, +T]</code>: accept more, return less.</li>
<li>Bound ≠ variance. Erasure: <code>List[String]</code> vs <code>List[Int]</code> za běhu nerozlišíš.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 77, quote: 'C[+T] is covariant: subtyping is preserved (safe output).' },
            { kind: 'slide', doc: 'L4', page: 77, quote: 'C[-T] is contravariant: subtyping is reversed (safe input).' },
          ],
        },
      ],
    },
  ],
}
