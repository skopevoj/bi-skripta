import type { Question, SourceRef } from '../types'

// Původní otázky pro „Midterm nanečisto 1–4“. Každá napodobuje konkrétní reálnou otázku
// (oficiální sample 2026 nebo kvízy / wiki) a byla ověřena ve Scala 3 (scala-cli):
// kód níže je přesně ten, který běžel, jen bez obalu `@main def run() = ...`.
// U otázek s výběrem byla každá možnost zkompilována zvlášť.

const L2 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', lecture: 'L2', page, ...(quote ? { quote } : {}) })
const L4 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', lecture: 'L4', page, ...(quote ? { quote } : {}) })
const L5 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', lecture: 'L5', page, ...(quote ? { quote } : {}) })
const L6 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', lecture: 'L6', page, ...(quote ? { quote } : {}) })

const OVERLOAD_STATIC = L2(20, 'Use the method name and static argument types to choose an overload')
const OVERRIDE_RUNTIME = L2(20, 'Runtime: for a virtual call, select the override for that signature')
const THIS_DYNAMIC = L2(16, 'The meaning of this is dynamic - I can only')
const SUPER_STATIC = L2(16, 'The meaning of super is static - I always')
const STATIC_MEMBERS = L2(15, 'The static type controls which members are')
const BOUND_OPS = L4(47, 'It also tells the compiler which operations on T are available.')

export const mocks: Question[] = [
  // ======================================================================= MOCK 1
  {
    id: 'mock1-01',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 1',
      why: 'Procvičuje, že statický typ výsledku generické metody je T (odvozené nebo zadané), ne runtime třída uložené hodnoty.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def m1: Int = 1

class B extends A:
  def m2: Int = 2

class C extends B:
  def m3: Int = 3

class Box[T](val item: T):
  def get: T = item

val b1 = Box(C())
val b2 = Box[B](C())
println(b1.get.m3 + b2.get.m2)`,
    answer: '5',
    explanation:
      '<ol>' +
      '<li><code>Box(C())</code> bez hranatých závorek ⇒ kompilátor odvodí <code>T = C</code> ⇒ <code>b1.get</code> má statický typ C ⇒ <code>m3</code> je dostupné = 3.</li>' +
      '<li><code>Box[B](C())</code> ⇒ <code>T = B</code> zadané explicitně ⇒ <code>b2.get</code> má statický typ B ⇒ smíš volat <code>m1</code> a <code>m2</code>; <code>m2</code> = 2.</li>' +
      '<li>3 + 2 = <strong>5</strong>.</li></ol>' +
      '<strong>Past:</strong> kdyby tam bylo <code>b2.get.m3</code>, je to chyba kompilace (<em>value m3 is not a member of B</em>), přestože uvnitř leží C – přesně jako v ot. 1 ukázkového testu.',
    verified: 'scala',
    sources: [STATIC_MEMBERS, L4(23, 'values are provided at call sites')],
  },
  {
    id: 'mock1-02',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 5',
      why: 'Spojuje horní mez (co smím na x volat) s dynamickým dispatchem (která implementace se zavolá).',
    },
    prompt: 'Co se vypíše?',
    code: `class Animal:
  def sound: String = "..."
  def name: String = "animal"

class Dog extends Animal:
  override def sound: String = "haf"

class Puppy extends Dog:
  override def name: String = "puppy"

class Shelter[T <: Animal]:
  def describe(x: T): String = x.name + ":" + x.sound

val s = Shelter[Dog]()
println(s.describe(Puppy()))`,
    answer: 'puppy:haf',
    explanation:
      '<ol>' +
      '<li>Díky horní mezi <code>T &lt;: Animal</code> smí <code>describe</code> volat na <code>x</code> metody Animal (<code>name</code>, <code>sound</code>) – zkompiluje se.</li>' +
      '<li><code>Shelter[Dog]</code> ⇒ <code>describe(x: Dog)</code>; <code>Puppy &lt;: Dog</code> ⇒ smí se předat.</li>' +
      '<li>Volání jsou dynamická podle runtime třídy Puppy: <code>name</code> → Puppy = "puppy", <code>sound</code> → zděděno z Dog = "haf".</li></ol>' +
      'Výsledek: <strong>puppy:haf</strong>. Bound říká jen <em>co</em> smíš volat; <em>která</em> implementace poběží, určí objekt. (Kdyby se předalo <code>Animal()</code>, chyba kompilace – Animal není podtyp Dog.)',
    verified: 'scala',
    sources: [BOUND_OPS, L2(15, 'The runtime receiver selects an overridden body.')],
  },
  {
    id: 'mock1-03',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 4 (zrcadlová verze pro návratový typ, slidy L2 s. 53–56)',
      why: 'Doplňuje ot. 4 ze sample: u návratového typu override dovoluje zúžení (kovariance), u parametru ne.',
    },
    prompt: 'Které typy lze použít místo <code>?</code> jako návratový typ přepsané metody ve třídě <code>Y</code>? Označte všechny správné odpovědi.',
    code: `class A
class B extends A
class C extends B

class X:
  def f(b: B): B = B()

class Y extends X:
  override def f(b: B): ? = ???`,
    options: ['A', 'B', 'C', 'Any'],
    correct: [1, 2],
    explanation:
      'Návratový typ je v <strong>kovariantní pozici</strong>: override smí vracet stejný typ nebo jeho podtyp.<ul>' +
      '<li><code>B</code> ✔ (beze změny)</li>' +
      '<li><code>C</code> ✔ – klient, který volá přes <code>X</code>, čeká B a dostane C, což je B (C umí vše, co B).</li>' +
      '<li><code>A</code> ✘ – klient by mohl volat metody B, které A nemá (<em>method f … has incompatible type</em>).</li>' +
      '<li><code>Any</code> ✘ – ze stejného důvodu.</li></ul>' +
      '<strong>Past:</strong> plést si to s parametrem – tam ve Scale musí typ zůstat <em>přesně</em> stejný (ot. 4 ukázkového testu).',
    verified: 'scala',
    sources: [
      L2(62, 'Return type is in covariant position'),
      L2(62, 'ERROR - A is not a subtype of B'),
      L2(55),
      L2(56),
    ],
  },
  {
    id: 'mock1-04',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 3',
      why: 'Drilluje kombinaci overloadingu (statický typ argumentu) a řetězu super uvnitř přepsané metody.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def v = 2

class B extends A:
  override def v = super.v * 3

class C extends B:
  override def v = super.v + 1

def show(x: A) = x.v
def show(x: B) = x.v + 100

val obj: A = C()
println(show(obj))
println(show(C()))`,
    answer: '7\n107',
    explanation:
      '<strong>Hodnota <code>v</code> na objektu C</strong> (stejná v obou řádcích): C: <code>super.v + 1</code> → B: <code>super.v * 3</code> → A: 2 ⇒ 2 · 3 + 1 = 7.<ol>' +
      '<li><code>show(obj)</code>: statický typ <code>obj</code> je <code>A</code> ⇒ jediný použitelný je <code>show(x: A)</code> ⇒ <strong>7</strong>.</li>' +
      '<li><code>show(C())</code>: statický typ argumentu je <code>C</code> ⇒ použitelné jsou <code>show(A)</code> i <code>show(B)</code>, vybere se nejkonkrétnější <code>show(B)</code> ⇒ 7 + 100 = <strong>107</strong>.</li></ol>' +
      '<strong>Past:</strong> u <code>show(obj)</code> odpovědět 107 („je to přece C“) – přetížení se vybírá podle typu proměnné, ne objektu.',
    verified: 'scala',
    sources: [OVERLOAD_STATIC, SUPER_STATIC, L2(18, 'Different parameter types create overloads, static types choose between them.')],
  },
  {
    id: 'mock1-05',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 9',
      why: 'Trénuje „nejdřív signatura podle statických typů, pak override podle runtime příjemce“ na třech kombinacích.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def g(x: A): String = "A.g(A)"

class B extends A:
  override def g(x: A): String = "B.g(A)"
  def g(x: B): String = "B.g(B)"

val a: A = B()
val b: B = B()
println(a.g(b))
println(b.g(a))
println(b.g(b))`,
    answer: 'B.g(A)\nB.g(A)\nB.g(B)',
    explanation:
      '<ol>' +
      '<li><code>a.g(b)</code>: příjemce má statický typ A ⇒ A zná jen <code>g(x: A)</code> ⇒ signatura <code>g(A)</code>. Za běhu je příjemce B, který ji přepisuje ⇒ <strong>B.g(A)</strong>. (Přetížení <code>g(B)</code> přes typ A vůbec nevidíš.)</li>' +
      '<li><code>b.g(a)</code>: příjemce B ⇒ kandidáti <code>g(A)</code>, <code>g(B)</code>; argument má statický typ A ⇒ jen <code>g(A)</code> ⇒ <strong>B.g(A)</strong>.</li>' +
      '<li><code>b.g(b)</code>: oba statické typy B ⇒ nejkonkrétnější <code>g(B)</code> ⇒ <strong>B.g(B)</strong>.</li></ol>' +
      '<strong>Past:</strong> u prvního řádku napsat B.g(B) – výběr přetížení se dělá jen ze signatur statického typu příjemce.',
    verified: 'scala',
    sources: [OVERLOAD_STATIC, OVERRIDE_RUNTIME, L2(19), L2(21)],
  },
  {
    id: 'mock1-06',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 8 a 10',
      why: 'Ověřuje, že kovariance povolí přiřazení Box[C] do Box[A] a že pak se metoda stejně volá dynamicky na skutečném objektu.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Box[+T](val value: T)

val boxC: Box[C] = Box(C())
val boxA: Box[A] = boxC
println(boxA.value.m)`,
    answer: '3',
    explanation:
      '<ol>' +
      '<li><code>Box[+T]</code> je kovariantní a <code>C &lt;: A</code> ⇒ <code>Box[C] &lt;: Box[A]</code> ⇒ přiřazení projde.</li>' +
      '<li><code>boxA.value</code> má statický typ <code>A</code> ⇒ <code>m</code> smím volat (A ho má).</li>' +
      '<li>Za běhu je tam pořád objekt C ⇒ dynamický dispatch ⇒ <strong>3</strong>.</li></ol>' +
      '<strong>Past:</strong> bez <code>+</code> (invariantní <code>Box[T]</code>) by druhý řádek neprošel – <em>Found: Box[C], Required: Box[A]</em> – odpověď by byla chyba kompilace. Variance nemění objekt, jen to, kam smíš referenci přiřadit.',
    verified: 'scala',
    sources: [
      L4(46, 'C[+T] means that the class C is covariant in T'),
      L4(46, 'given A <: B there is no relation between C[A] and C[B]'),
      L2(15, 'The runtime receiver selects an overridden body.'),
    ],
  },

  // ======================================================================= MOCK 2
  {
    id: 'mock2-01',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 2 (dolní mez) + slide L4 s. 51 (List.appended)',
      why: 'Ukazuje, jak dolní mez R >: T rozšíří typ výsledku na nejbližší společný nadtyp a co pak smíš volat.',
    },
    prompt: 'Co se vypíše?',
    code: `class Animal:
  def name: String = "animal"

class Cat extends Animal:
  override def name: String = "cat"
  def meow: String = "meow"

class Dog extends Animal:
  override def name: String = "dog"

class Pair[+T](val first: T, val second: T):
  def withSecond[R >: T](x: R): Pair[R] = Pair(first, x)

val cats = Pair(Cat(), Cat())
val mixed = cats.withSecond(Dog())
println(mixed.first.name + " " + mixed.second.name)`,
    answer: 'cat dog',
    explanation:
      '<ol>' +
      '<li><code>cats</code> je <code>Pair[Cat]</code>, takže <code>T = Cat</code>.</li>' +
      '<li><code>withSecond(Dog())</code>: <code>R</code> musí být nadtyp Cat <em>a</em> zároveň musí pojmout Dog ⇒ kompilátor odvodí nejbližší společný nadtyp <code>R = Animal</code> ⇒ <code>mixed: Pair[Animal]</code>. Žádná chyba!</li>' +
      '<li><code>name</code> je v Animal ⇒ smí se volat; dispatch je dynamický ⇒ <code>first</code> (Cat) = "cat", <code>second</code> (Dog) = "dog".</li></ol>' +
      'Vypíše <strong>cat dog</strong>.<br><strong>Past:</strong> kdyby tam bylo <code>mixed.first.meow</code>, je to chyba kompilace – statický typ je už jen Animal.',
    verified: 'scala',
    sources: [
      L4(51, 'T is Cat, R has to be Animal since that is'),
      L4(51, 'the closest basetype of both Cat and Dog'),
      L4(76, 'Lower bounds (>: T): write values safely to a consumer.'),
    ],
  },
  {
    id: 'mock2-02',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 6',
      why: 'Převádí abstraktní tvrzení o kontravarianci na konkrétní přiřazení a volání, která se na papíře musí rozhodnout.',
    },
    prompt: 'Které řádky se zkompilují? Označte všechny správné odpovědi.',
    code: `class A
class B extends A
class C extends B

class Printer[-T]:
  def print(x: T): Unit = println("printing")`,
    options: [
      '<code>val p1: Printer[B] = Printer[A]()</code>',
      '<code>val p2: Printer[B] = Printer[C]()</code>',
      '<code>val p3: Printer[C] = Printer[A]()</code>',
      '<code>val p4: Printer[A] = Printer[B]()</code>',
      '<code>Printer[B]().print(C())</code>',
      '<code>Printer[B]().print(A())</code>',
    ],
    correct: [0, 2, 4],
    explanation:
      '<code>-T</code>: z <code>X &lt;: Y</code> plyne <code>Printer[Y] &lt;: Printer[X]</code> – tiskárna obecnějšího typu může zastoupit tiskárnu konkrétnějšího.<ul>' +
      '<li>p1: B &lt;: A ⇒ <code>Printer[A] &lt;: Printer[B]</code> ✔</li>' +
      '<li>p2: potřebuje <code>Printer[C] &lt;: Printer[B]</code>, tj. B &lt;: C ✘</li>' +
      '<li>p3: C &lt;: A ⇒ <code>Printer[A] &lt;: Printer[C]</code> ✔ (tranzitivita)</li>' +
      '<li>p4: potřebuje A &lt;: B ✘</li>' +
      '<li><code>print(C())</code> na <code>Printer[B]</code>: parametr typu B, C &lt;: B ⇒ ✔ (obyčejný subtyping argumentu)</li>' +
      '<li><code>print(A())</code>: A není podtyp B ✘</li></ul>' +
      '<strong>Past:</strong> přenést směr z kovariance („Printer[C] je konkrétnější, tak ho dám do Printer[B]“) – u <code>-T</code> je to obráceně.',
    verified: 'scala',
    sources: [
      L4(46, 'C[-T] means that the class C is contravariant in T'),
      L4(46, 'given A <: B then C[B] <: C[A]'),
      L4(77, 'C[-T] is contravariant: subtyping is reversed (safe input).'),
    ],
  },
  {
    id: 'mock2-03',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 7',
      why: 'Trénuje trasování this-volání uvnitř zděděných metod a výběr přetížení podle statického typu proměnné.',
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

def run(x: A) = x.c
def run(x: C) = x.c * 2

val v: B = C()
println(run(v))`,
    answer: '27',
    explanation:
      '<ol>' +
      '<li><strong>Který <code>run</code>?</strong> <code>v: B</code>; <code>run(x: C)</code> nejde (B není podtyp C) ⇒ <code>run(x: A)</code> ⇒ výsledek je jen <code>x.c</code>.</li>' +
      '<li><code>c</code> (z A) = <code>b + a</code>, obojí přes <code>this</code> ⇒ dynamicky na C.</li>' +
      '<li><code>b</code> → <code>C.b</code> = <code>super.b + 5</code>; <code>A.b</code> = <code>a * 10</code>, kde <code>a</code> je dynamicky <code>B.a</code> = 2 ⇒ 20 ⇒ <code>C.b</code> = 25.</li>' +
      '<li><code>a</code> → <code>B.a</code> = 2 ⇒ <code>c</code> = 25 + 2 = <strong>27</strong>.</li></ol>' +
      '<strong>Pasti:</strong> 54 (vybrat <code>run(C)</code> podle runtime typu), 16 (počítat s <code>a = 1</code> z A).',
    verified: 'scala',
    sources: [THIS_DYNAMIC, SUPER_STATIC, OVERLOAD_STATIC],
  },
  {
    id: 'mock2-04',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 4',
      why: 'Shrnuje všechna pravidla pro override (parametr, návratový typ, klíčové slovo override) do jedné otázky s více odpověďmi.',
    },
    prompt: 'Která z následujících definic uvnitř <code>class Y extends X:</code> se zkompiluje? Každou možnost posuzuj samostatně (ve třídě Y je vždy jen ona). Označte všechny správné odpovědi.',
    code: `class A
class B extends A
class C extends B

class X:
  def f(b: B): B = B()

class Y extends X:
  // sem přijde jedna z možností`,
    options: [
      '<code>override def f(b: B): C = C()</code>',
      '<code>override def f(b: A): B = B()</code>',
      '<code>override def f(b: B): A = A()</code>',
      '<code>def f(b: A): B = B()</code>',
      '<code>override def f(b: C): B = B()</code>',
      '<code>def f(b: B): B = B()</code>',
    ],
    correct: [0, 3],
    explanation:
      '<ul>' +
      '<li>① ✔ – návratový typ smí být podtyp (kovariance).</li>' +
      '<li>② ✘ – jiný typ parametru = jiná signatura, tedy overload, a ten nic nepřepisuje: <em>method f has a different signature than the overridden declaration</em>.</li>' +
      '<li>③ ✘ – návratový typ A není podtyp B (<em>incompatible type</em>).</li>' +
      '<li>④ ✔ – <strong>bez</strong> <code>override</code> je to legální <em>nové přetížení</em> <code>f(A)</code> vedle zděděného <code>f(B)</code>.</li>' +
      '<li>⑤ ✘ – stejně jako ②.</li>' +
      '<li>⑥ ✘ – stejná signatura jako v X, ale chybí klíčové slovo: <em>needs `override` modifier</em>.</li></ul>' +
      '<strong>Past:</strong> ② a ④ mají stejný kód, liší se jen slovem <code>override</code> – a právě to rozhoduje.',
    verified: 'scala',
    sources: [
      L2(62, 'ERROR - it is not an override but overload'),
      L2(62, 'Return type is in covariant position'),
      L2(61, 'Java/Scala/C++ do not allow contravariance in override method parameters because of'),
    ],
  },
  {
    id: 'mock2-05',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'FIT Wiki – Marast 12. 11. 2020 (wiki-marast_12_11_20-01) + slide L6 s. 65',
      why: 'Procvičuje, že u stackable traitů běží jako první ten nejvíc vpravo a super jde po linearizaci.',
    },
    prompt: 'Co se vypíše?',
    code: `trait Greeter:
  def greet: String = "ahoj"

trait Loud extends Greeter:
  override def greet: String = super.greet.toUpperCase

trait Polite extends Greeter:
  override def greet: String = super.greet + " pane"

class P1 extends Greeter with Loud with Polite
class P2 extends Greeter with Polite with Loud

println(P1().greet)
println(P2().greet)`,
    answer: 'AHOJ pane\nAHOJ PANE',
    explanation:
      '<strong>Pravidlo:</strong> volání začne u traitu nejvíc vpravo, <code>super</code> v traitu ukazuje na předchozí prvek linearizace (určí se až podle konkrétní třídy).<ol>' +
      '<li><code>P1</code>: linearizace P1 → Polite → Loud → Greeter. <code>Polite.greet</code> = <code>Loud.greet + " pane"</code>; <code>Loud.greet</code> = <code>"ahoj".toUpperCase</code> = "AHOJ" ⇒ <strong>AHOJ pane</strong>.</li>' +
      '<li><code>P2</code>: P2 → Loud → Polite → Greeter. <code>Loud.greet</code> = <code>(Polite.greet).toUpperCase</code> = <code>"ahoj pane".toUpperCase</code> ⇒ <strong>AHOJ PANE</strong>.</li></ol>' +
      '<strong>Past:</strong> číst traity zleva doprava. Pořadí za <code>with</code> mění výsledek.',
    verified: 'scala',
    sources: [
      L6(58, 'In traits super uses late binding - dispatched dynamically'),
      L6(58, 'Method call is determined by linearization'),
      L6(65),
    ],
  },
  {
    id: 'mock2-06',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 9 + Kvíz 1 (2023/24), kv1-08',
      why: 'Ukazuje, že overloading uvnitř generické metody se vybírá podle meze T, ne podle typu, se kterým ji zavoláš.',
    },
    prompt: 'Co se vypíše?',
    code: `class A
class B extends A

def describe(x: A): String = "A"
def describe(x: B): String = "B"

def viaGeneric[T <: A](x: T): String = describe(x)

println(describe(B()) + viaGeneric(B()))`,
    answer: 'BA',
    explanation:
      '<ol>' +
      '<li><code>describe(B())</code>: statický typ argumentu je B ⇒ nejkonkrétnější <code>describe(B)</code> ⇒ "B".</li>' +
      '<li><code>viaGeneric</code> se kompiluje <strong>jednou</strong> pro všechna T. Uvnitř má <code>x</code> statický typ <code>T</code> a o něm víme jen <code>T &lt;: A</code> ⇒ použitelné je jen <code>describe(A)</code>. To je rozhodnuto při kompilaci těla, nezávisle na tom, že ji později zavoláš s B ⇒ "A".</li></ol>' +
      'Výsledek <strong>BA</strong>.<br><strong>Past:</strong> „T bude B, tak se zavolá describe(B)“ – tak by to fungovalo u C++ šablon (expanze), ne ve Scale/Javě (erasure, jeden kód).',
    verified: 'scala',
    sources: [
      OVERLOAD_STATIC,
      L4(78, 'Expansion specializes code at compile time (C++ templates).'),
      L4(78, 'Type erasure removes generic type arguments at runtime (Java, Scala).'),
    ],
  },

  // ======================================================================= MOCK 3
  {
    id: 'mock3-01',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 10',
      why: 'Opravená verze ot. 10: s horní mezí se kontravariantní třída zkompiluje a je třeba dotrasovat dispatch.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def m: String = "A"

class B extends A:
  override def m: String = "B"

class C extends B:
  override def m: String = "C"

class Handler[-T <: A]:
  def handle(x: T): String = "handled " + x.m

val h: Handler[C] = Handler[B]()
println(h.handle(C()))`,
    answer: 'handled C',
    explanation:
      '<ol>' +
      '<li>Na rozdíl od ot. 10 ze sample má <code>T</code> horní mez <code>&lt;: A</code> ⇒ <code>x.m</code> se zkompiluje (bound říká, jaké metody T má). Variance a bound jdou kombinovat: <code>-T &lt;: A</code>.</li>' +
      '<li><code>Handler[C] = Handler[B]()</code>: kontravariance a C &lt;: B ⇒ <code>Handler[B] &lt;: Handler[C]</code> ✔.</li>' +
      '<li><code>h.handle(C())</code>: argument C; za běhu se volá <code>x.m</code> na objektu C ⇒ "C".</li></ol>' +
      'Vypíše <strong>handled C</strong>. <strong>Past:</strong> „handler je pro B, tak B“ – typový parametr nemění objekt, který do metody přišel.',
    verified: 'scala',
    sources: [BOUND_OPS, L4(46, 'given A <: B then C[B] <: C[A]')],
  },
  {
    id: 'mock3-02',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slide L4 s. 45 (Cell[+T]) + Sample midterm 2026, ot. 8',
      why: 'Procvičuje variance positions: kovariantní T nesmí být typ parametru metody, chyba vzniká už v definici třídy.',
    },
    prompt: 'Co se vypíše?',
    code: `class Box[+T](val value: T):
  def replace(x: T): Box[T] = Box(x)

val b: Box[Any] = Box[String]("FIT")
println(b.replace(42).value)`,
    answer: 'CE',
    explanation:
      '<ol>' +
      '<li>Chyba je už v <strong>definici třídy</strong>: <code>T</code> je kovariantní (<code>+T</code>), ale vyskytuje se jako typ parametru metody (<code>replace(x: T)</code>) = <em>kontravariantní pozice</em>.</li>' +
      '<li>Kompilátor: <em>covariant type T occurs in contravariant position in type T of parameter x</em>.</li></ol>' +
      '<strong>Proč to hlídá:</strong> přesně tento program by jinak do Boxu se Stringem vložil <code>42</code> přes pohled <code>Box[Any]</code> – porušení typové bezpečnosti.<br>' +
      '<strong>Oprava ze slidů:</strong> <code>def replace[R &gt;: T](x: R): Box[R]</code> – pak se zkompiluje a vypíše <code>42</code> (ověřeno).',
    verified: 'scala',
    sources: [
      L4(45, 'A covariant type cannot occur in contravariant positions (method parameters, vars)'),
      L4(51),
    ],
  },
  {
    id: 'mock3-03',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Slide L2 s. 17 („Quiz: trace this and super“) + Kvíz 1 (2023/24), kv1-05',
      why: 'Procvičuje trasování this (dynamicky) vs super (staticky) přes tři úrovně dědičnosti.',
    },
    prompt: 'Co se vypíše?',
    code: `class Counter:
  var count = 0
  def inc(): Unit = count += 1
  def twice(): Unit =
    inc()
    inc()

class DoubleCounter extends Counter:
  override def inc(): Unit =
    super.inc()
    super.inc()

class TripleCounter extends DoubleCounter:
  override def twice(): Unit =
    super.twice()
    super.inc()

val c: Counter = TripleCounter()
c.inc()
c.twice()
println(c.count)`,
    answer: '8',
    explanation:
      '<ol>' +
      '<li><code>c.inc()</code>: objekt je TripleCounter, ten <code>inc</code> nepřepisuje ⇒ <code>DoubleCounter.inc</code> ⇒ 2× <code>Counter.inc</code> ⇒ count = <strong>2</strong>.</li>' +
      '<li><code>c.twice()</code> ⇒ <code>TripleCounter.twice</code>:<ul>' +
      '<li><code>super.twice()</code> ⇒ <code>Counter.twice</code> (DoubleCounter ji nemá). Uvnitř je <code>inc()</code> = <code>this.inc()</code> ⇒ dynamicky <code>DoubleCounter.inc</code> (+2), dvakrát ⇒ +4 ⇒ count = 6.</li>' +
      '<li><code>super.inc()</code> ⇒ staticky o úroveň výš = <code>DoubleCounter.inc</code> ⇒ +2 ⇒ count = <strong>8</strong>.</li></ul></li></ol>' +
      '<strong>Pasti:</strong> 6 (myslet si, že <code>inc()</code> v <code>Counter.twice</code> volá Counter.inc – ne, je to <code>this.inc()</code>), 7 (že <code>super.inc()</code> v TripleCounter přidá jen 1).',
    verified: 'scala',
    sources: [THIS_DYNAMIC, SUPER_STATIC, L2(17)],
  },
  {
    id: 'mock3-04',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Kvíz 2 (2023/24), kv2-04 (Function1[-A, +B]) + slide L4 s. 59',
      why: 'Aplikuje pravidlo pro subtyping funkcí (vstup kontravariantně, výstup kovariantně) na konkrétní přiřazení.',
    },
    prompt: 'Které řádky se zkompilují? Označte všechny správné odpovědi.',
    code: `class A
class B extends A
class C extends B`,
    options: [
      '<code>val f1: B =&gt; B = (x: A) =&gt; C()</code>',
      '<code>val f2: B =&gt; B = (x: C) =&gt; B()</code>',
      '<code>val f3: B =&gt; A = (x: B) =&gt; C()</code>',
      '<code>val f4: B =&gt; C = (x: A) =&gt; B()</code>',
      '<code>val f5: A =&gt; A = (x: B) =&gt; B()</code>',
    ],
    correct: [0, 2],
    explanation:
      'Pravidlo: <code>(P =&gt; R) &lt;: (S =&gt; T)</code> právě když <code>S &lt;: P</code> (vstup se smí <em>rozšířit</em>) a <code>R &lt;: T</code> (výstup se smí <em>zúžit</em>). Lambda vlevo má typ podle anotace parametru a vráceného objektu.<ul>' +
      '<li>f1: <code>A =&gt; C</code> do <code>B =&gt; B</code>: B &lt;: A ✔, C &lt;: B ✔ ⇒ ✔</li>' +
      '<li>f2: <code>C =&gt; B</code> do <code>B =&gt; B</code>: potřeba B &lt;: C ✘ (funkce umí jen C, ale dostala by libovolné B)</li>' +
      '<li>f3: <code>B =&gt; C</code> do <code>B =&gt; A</code>: B &lt;: B ✔, C &lt;: A ✔ ⇒ ✔</li>' +
      '<li>f4: vstup OK, ale vrací B a čeká se C ✘</li>' +
      '<li>f5: <code>B =&gt; B</code> do <code>A =&gt; A</code>: potřeba A &lt;: B ✘</li></ul>' +
      '<strong>Past:</strong> u parametru uvažovat jako u návratového typu („C je konkrétnější, tak lepší“).',
    verified: 'scala',
    sources: [
      L4(59, '(A => B) <: (S => T) iff S <: A and B <: T.'),
      L4(59, 'Inputs are contravariant, outputs are covariant.'),
    ],
  },
  {
    id: 'mock3-05',
    kind: 'output',
    topic: 'pattern',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'Kvíz 5 (2023/24), kv5-07',
      why: 'Procvičuje pořadí case větví, guard, copy a strukturální rovnost case class v jednom krátkém výpisu.',
    },
    prompt: 'Co se vypíše?',
    code: `sealed trait Shape
case class Circle(r: Int) extends Shape
case class Rect(w: Int, h: Int) extends Shape

def kind(s: Shape): String = s match
  case Rect(w, h) if w == h => "square"
  case Circle(0) => "dot"
  case Rect(w, _) => "rect" + w
  case Circle(r) => "circle" + r

val a = Rect(2, 2)
val b = a.copy(h = 3)
println(kind(a) + " " + kind(b) + " " + kind(Circle(0)) + " " + (a == Rect(2, 2)))`,
    answer: 'square rect2 dot true',
    explanation:
      'Větve se zkouší <strong>shora dolů</strong>, vyhraje první, která sedí (včetně guardu).<ol>' +
      '<li><code>kind(a)</code>, a = Rect(2, 2): první větev, guard 2 == 2 ✔ ⇒ "square".</li>' +
      '<li><code>b = a.copy(h = 3)</code> = Rect(2, 3) (nová hodnota, a se nemění). Guard ✘, <code>Circle(0)</code> ✘, <code>Rect(w, _)</code> ✔ ⇒ "rect2".</li>' +
      '<li><code>kind(Circle(0))</code>: Rect větve nesedí, <code>Circle(0)</code> ✔ ⇒ "dot" (ke <code>Circle(r)</code> se nedojde).</li>' +
      '<li><code>a == Rect(2, 2)</code>: case class má vygenerované <code>equals</code> po složkách ⇒ <strong>true</strong> (i když jsou to dva různé objekty).</li></ol>' +
      'Výsledek: <strong>square rect2 dot true</strong>.',
    verified: 'scala',
    sources: [
      L5(29, 'A case class gives the payment value semantics'),
      L5(30, 'The val keyword is implicit in case classes'),
      L5(50, 'Cover the cases that fail the guard'),
    ],
  },
  {
    id: 'mock3-06',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 1',
      why: 'Procvičuje odvození typového parametru jako nejbližšího společného nadtypu a jeho dopad na dostupné metody.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def ma: Int = 1

class B extends A:
  def mb: Int = 2

class C extends B:
  def mc: Int = 3

def pick[T](x: T, y: T): T = y

val r = pick(B(), C())
println(r.mc)`,
    answer: 'CE',
    explanation:
      '<ol>' +
      '<li><code>pick(B(), C())</code>: oba argumenty musí být typu <code>T</code> ⇒ kompilátor odvodí nejbližší společný nadtyp B a C ⇒ <code>T = B</code>.</li>' +
      '<li>Návratový typ je <code>T</code> ⇒ <code>r</code> má statický typ <strong>B</strong> (přestože vrácený objekt je C).</li>' +
      '<li><code>r.mc</code>: B metodu <code>mc</code> nemá ⇒ <strong>chyba kompilace</strong> (<em>value mc is not a member of B</em>).</li></ol>' +
      '<strong>Past:</strong> odpovědět 3, protože se vrací <code>y</code>, což je C. S <code>r.mb</code> by se vypsalo 2.',
    verified: 'scala',
    sources: [STATIC_MEMBERS, L4(51, 'the closest basetype of both Cat and Dog')],
  },

  // ======================================================================= MOCK 4
  {
    id: 'mock4-01',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Slidy L2 s. 24–27 (double dispatch, SpaceObject) + FIT Wiki – Zkouška 13. 1. 2026',
      why: 'Testuje double dispatch a jeho nejčastější chybu: zděděná metoda má this se statickým typem nadtřídy, takže vybere obecné přetížení.',
    },
    prompt: 'Co se vypíše?',
    code: `class Obj:
  def collide(o: Obj): String = o.hitBy(this)
  def hitBy(o: Obj): String = "O"
  def hitBy(r: Rock): String = "R"

class Rock extends Obj:
  override def collide(o: Obj): String = o.hitBy(this)
  override def hitBy(o: Obj): String = "O>R"
  override def hitBy(r: Rock): String = "R>R"

class Ship extends Obj:
  override def hitBy(o: Obj): String = "O>S"
  override def hitBy(r: Rock): String = "R>S"

val r: Obj = Rock()
val s: Obj = Ship()
println(r.collide(s) + " " + s.collide(r) + " " + s.hitBy(r))`,
    answer: 'R>S O>R O>S',
    explanation:
      'U každého volání: (1) přetížení podle <em>statických</em> typů, (2) override podle runtime příjemce.<ol>' +
      '<li><code>r.collide(s)</code> ⇒ dynamicky <code>Rock.collide</code>. Uvnitř Rock má <code>this</code> statický typ <strong>Rock</strong> ⇒ <code>o.hitBy(this)</code> vybere <code>hitBy(r: Rock)</code>; příjemce <code>o</code> je za běhu Ship ⇒ <strong>R&gt;S</strong>.</li>' +
      '<li><code>s.collide(r)</code> ⇒ Ship <code>collide</code> nepřepisuje ⇒ <code>Obj.collide</code>. Tam má <code>this</code> statický typ jen <strong>Obj</strong> ⇒ vybere se <code>hitBy(o: Obj)</code>; příjemce je Rock ⇒ <strong>O&gt;R</strong>.</li>' +
      '<li><code>s.hitBy(r)</code>: <code>r</code> má statický typ Obj ⇒ <code>hitBy(o: Obj)</code>; příjemce Ship ⇒ <strong>O&gt;S</strong>.</li></ol>' +
      '<strong>Pasti:</strong> u 3. volání R&gt;S („r je přece Rock“) – runtime typ argumentu přetížení nevybírá; u 1. volání O&gt;S – přehlédnout, že v přepsaném <code>Rock.collide</code> má <code>this</code> statický typ Rock. Proto musí double dispatch mít <code>collide</code> přepsané v <em>každé</em> třídě (Ship ho nemá, a tak 2. volání skončí v obecném <code>hitBy(Obj)</code>).',
    verified: 'scala',
    sources: [
      L2(24, 'runtime class does not select an overload.'),
      L2(25, 'Its override calls a second method on the other object.'),
      L2(27, 'Two ordinary virtual calls; no runtime overload selection.'),
    ],
  },
  {
    id: 'mock4-02',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 9',
      why: 'Těžší verze ot. 9: třetí úroveň dědičnosti přepisuje jen jedno ze dvou přetížení, takže je nutné oddělit výběr signatury od výběru těla.',
    },
    prompt: 'Co se vypíše?',
    code: `class A:
  def f(a: A): Int = 1

class B extends A:
  def f(b: B): Int = 2
  override def f(a: A): Int = 3

class C extends B:
  override def f(b: B): Int = 4

val x: A = C()
val y: B = C()
println(s"\${x.f(y)} \${y.f(y)} \${y.f(x)}")`,
    answer: '3 4 3',
    explanation:
      'Všechny objekty jsou C. C přepisuje jen <code>f(B)</code>; <code>f(A)</code> dědí z B (= 3).<ol>' +
      '<li><code>x.f(y)</code>: příjemce statický typ A ⇒ jediná signatura <code>f(A)</code> (o <code>f(B)</code> typ A neví, i když argument je B) ⇒ za běhu C → zděděné <code>B.f(A)</code> ⇒ <strong>3</strong>.</li>' +
      '<li><code>y.f(y)</code>: příjemce B, argument B ⇒ nejkonkrétnější <code>f(B)</code> ⇒ za běhu C přepisuje ⇒ <strong>4</strong>.</li>' +
      '<li><code>y.f(x)</code>: argument statický typ A ⇒ <code>f(A)</code> ⇒ <strong>3</strong>.</li></ol>' +
      '<strong>Pasti:</strong> „4 4 4“ (výběr podle runtime typů) nebo „1 …“ (zapomenout, že B přepsala <code>f(A)</code>).',
    verified: 'scala',
    sources: [OVERLOAD_STATIC, OVERRIDE_RUNTIME, L2(20, 'An overloaded method can also be overridden')],
  },
  {
    id: 'mock4-03',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 2',
      why: 'Kombinuje dolní i horní mez a rozdíl mezi explicitním a odvozeným typovým argumentem.',
    },
    prompt: 'Která volání se zkompilují? Označte všechny správné odpovědi.',
    code: `class A
class B extends A
class C extends B
class D extends A

def f[T >: C <: A](x: T): T = x`,
    options: [
      '<code>f[A](B())</code>',
      '<code>f[B](C())</code>',
      '<code>f[D](D())</code>',
      '<code>f[Any](A())</code>',
      '<code>f(D())</code>',
      '<code>f("x")</code>',
    ],
    correct: [0, 1, 4],
    explanation:
      '<code>T</code> musí ležet „mezi“ C a A: <code>C &lt;: T &lt;: A</code>, tedy T ∈ {C, B, A}.<ul>' +
      '<li><code>f[A](B())</code> ✔ – A je v rozsahu, B &lt;: A.</li>' +
      '<li><code>f[B](C())</code> ✔ – B je v rozsahu, C &lt;: B.</li>' +
      '<li><code>f[D](D())</code> ✘ – D není nadtyp C (<em>does not conform to lower bound C</em>).</li>' +
      '<li><code>f[Any](A())</code> ✘ – Any není podtyp A (<em>does not conform to upper bound A</em>).</li>' +
      '<li><code>f(D())</code> ✔ – bez explicitního argumentu kompilátor hledá T ⊇ C i D a zároveň ⊆ A ⇒ <strong>T = A</strong>. Projde!</li>' +
      '<li><code>f("x")</code> ✘ – společný nadtyp String a C už není podtyp A ⇒ žádné T neexistuje.</li></ul>' +
      '<strong>Past:</strong> <code>f(D())</code> – stejně jako v ot. 2 ze sample odvození typu „vytáhne“ T nahoru; tady ho ale zastaví horní mez A, proto <code>"x"</code> neprojde.',
    verified: 'scala',
    sources: [
      L4(47, 'A bound (T <: Animal) restricts admissible type arguments.'),
      L4(51, 'the closest basetype of both Cat and Dog'),
      L4(76, 'Upper bounds (<: T): read values safely from a producer.'),
    ],
  },
  {
    id: 'mock4-04',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Sample midterm 2026, ot. 6 a 10',
      why: 'Spojuje kontravarianci (co smí do List[Vet[Dog]]) s overridingem a dynamickým dispatchem uvnitř kolekce.',
    },
    prompt: 'Co se vypíše?',
    code: `class Animal:
  def name = "animal"

class Dog extends Animal:
  override def name = "dog"

class Vet[-T]:
  def treat(x: T): String = "vet"

class DogVet extends Vet[Dog]:
  override def treat(x: Dog): String = "dogvet " + x.name

class AnimalVet extends Vet[Animal]:
  override def treat(x: Animal): String = "animalvet " + x.name

val vets: List[Vet[Dog]] = List(DogVet(), AnimalVet(), Vet[Animal]())
println(vets.map(v => v.treat(Dog())).mkString(", "))`,
    answer: 'dogvet dog, animalvet dog, vet',
    explanation:
      '<ol>' +
      '<li><strong>Zkompiluje se?</strong> <code>DogVet</code> je <code>Vet[Dog]</code> ✔. <code>AnimalVet</code> je <code>Vet[Animal]</code> a díky <code>-T</code> platí <code>Vet[Animal] &lt;: Vet[Dog]</code> (veterinář na všechna zvířata ošetří i psa) ✔. Totéž <code>Vet[Animal]()</code> ✔.</li>' +
      '<li>Overridy jsou legální: v <code>DogVet</code> je <code>T = Dog</code>, takže <code>treat(x: Dog)</code> má přesně stejnou signaturu jako zděděná metoda.</li>' +
      '<li>Volání <code>v.treat(Dog())</code> jsou dynamická: DogVet ⇒ "dogvet " + <code>Dog.name</code>; AnimalVet ⇒ "animalvet " + <code>x.name</code>, kde x je za běhu Dog ⇒ "dog"; obyčejný Vet ⇒ "vet".</li></ol>' +
      'Výsledek: <strong>dogvet dog, animalvet dog, vet</strong>.<br><strong>Pasti:</strong> „chyba kompilace, AnimalVet není Vet[Dog]“ (směr kontravariance) a „animalvet animal“ (statický typ parametru nerozhoduje o dispatchi <code>name</code>).',
    verified: 'scala',
    sources: [
      L4(46, 'given A <: B then C[B] <: C[A]'),
      L4(77, 'C[-T] is contravariant: subtyping is reversed (safe input).'),
      L4(53),
    ],
  },
  {
    id: 'mock4-05',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'FIT Wiki – Midterm 4. 11. 2019, cvičení 4 (wiki-test_04_11_19-02)',
      why: 'Procvičuje linearizaci s traitem, který se v hierarchii objeví dvakrát (X přímo i přes Z), a vynechání duplicit.',
    },
    prompt: 'Co se vypíše?',
    code: `class Base:
  def tag: String = "Base"

trait X extends Base:
  override def tag: String = "X>" + super.tag

trait Y extends Base:
  override def tag: String = "Y>" + super.tag

trait Z extends X:
  override def tag: String = "Z>" + super.tag

class K extends Base with Z with Y with X

println(K().tag)`,
    answer: 'Y>Z>X>Base',
    explanation:
      '<strong>Linearizace podle slidu</strong> (zprava, do hloubky, pak ponechat jen <em>poslední</em> výskyt):<ol>' +
      '<li>K, pak zprava: X → [X, Base], Y → [Y, Base], Z → [Z, X, Base], Base → [Base]. (AnyRef, Any vynechávám.)</li>' +
      '<li>Celý seznam: K, <s>X</s>, <s>Base</s>, Y, <s>Base</s>, Z, X, <s>Base</s>, Base.</li>' +
      '<li>Po smazání všech výskytů kromě posledního: <strong>K → Y → Z → X → Base</strong>. X se „posune“ za Z, protože Z na X závisí.</li></ol>' +
      'K <code>tag</code> nemá ⇒ začíná Y: "Y&gt;" + super (Z) ⇒ "Z&gt;" + super (X) ⇒ "X&gt;" + Base ⇒ <strong>Y&gt;Z&gt;X&gt;Base</strong>.<br>' +
      '<strong>Pasti:</strong> „X&gt;Y&gt;Z&gt;X&gt;Base“ (X dvakrát – každý trait je v linearizaci jen jednou), „X&gt;Y&gt;Z&gt;Base“ (ponechat první výskyt místo posledního).',
    verified: 'scala',
    sources: [
      L6(59, 'before eliminating all but the last occurrence of each module in the resulting list'),
      L6(58, 'Method call is determined by linearization'),
      L6(46, 'the calls to super are resolved dynamically (unlike in a class where it is static)'),
    ],
  },
  {
    id: 'mock4-06',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: {
      type: 'original',
      inspiredBy: 'Slidy L4 s. 45 a 51 (variance positions) + Sample midterm 2026, ot. 8',
      why: 'Testuje, kde smí stát kovariantní a kontravariantní typový parametr (val, var, parametr, návratový typ, dolní mez).',
    },
    prompt: 'Které definice tříd se zkompilují? Označte všechny správné odpovědi.',
    options: [
      '<code>class P1[+T](val x: T)</code>',
      '<code>class P2[+T] { def put(x: T): Unit = () }</code>',
      '<code>class P3[-T] { def get: T = ??? }</code>',
      '<code>class P4[+T](x: T) { def add[R &gt;: T](y: R): List[R] = List(x, y) }</code>',
      '<code>class P5[-T] { def use(x: T): Unit = () }</code>',
      '<code>class P6[+T](var x: T)</code>',
    ],
    correct: [0, 3, 4],
    explanation:
      '<strong>Pravidlo:</strong> <code>+T</code> jen ve výstupních (kovariantních) pozicích – návratový typ, <code>val</code>. <code>-T</code> jen ve vstupních – typ parametru.<ul>' +
      '<li>P1 ✔ – <code>val x: T</code> se jen čte (výstup).</li>' +
      '<li>P2 ✘ – <em>covariant type T occurs in contravariant position</em> (parametr).</li>' +
      '<li>P3 ✘ – <em>contravariant type T occurs in covariant position</em> (návratový typ).</li>' +
      '<li>P4 ✔ – trik ze slidu: parametr má typ <code>R &gt;: T</code>, ne T.</li>' +
      '<li>P5 ✔ – kontravariantní T jako parametr je přesně jeho místo.</li>' +
      '<li>P6 ✘ – <code>var</code> má getter i setter ⇒ T je v <em>invariantní</em> pozici (<em>covariant type T occurs in invariant position</em>).</li></ul>' +
      '<strong>Past:</strong> P1 vs P6 – liší se jen <code>val</code>/<code>var</code>.',
    verified: 'scala',
    sources: [
      L4(45, 'A covariant type cannot occur in contravariant positions (method parameters, vars)'),
      L4(51),
      L4(60),
    ],
  },
]
