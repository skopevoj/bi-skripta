import type { Question, SourceRef } from '../types'

const s = (page: number, quote?: string): SourceRef =>
  quote ? { kind: 'slide', doc: 'L6', page, quote } : { kind: 'slide', doc: 'L6', page }

export const ch6: Question[] = [
  // -------------------------------------------------------------------------
  {
    id: 'ch6-01',
    kind: 'output',
    topic: 'composition',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 25–27 (CounterSet extends HashSet)',
      why: 'Drilluje fragile base class: zděděné addAll volá přes this tvůj override add a počítá se dvakrát.',
    },
    prompt: 'What will it print?',
    code: `class Log:
  private var lines = List[String]()
  def add(s: String): Unit = lines = s :: lines
  def addAll(ss: List[String]): Unit = for s <- ss do add(s)
  def size: Int = lines.size

class CountingLog extends Log:
  var count = 0
  override def add(s: String): Unit =
    count += 1
    super.add(s)
  override def addAll(ss: List[String]): Unit =
    count += ss.size
    super.addAll(ss)

@main def run() =
  val l = CountingLog()
  l.add("a")
  l.addAll(List("b", "c"))
  println(s"\${l.count} \${l.size}")`,
    answer: '5 3',
    explanation:
      '<code>l.add("a")</code>: count = 1, uloží „a“.<br><code>l.addAll(List("b","c"))</code>: <code>CountingLog.addAll</code> přičte 2 → count = 3, pak <code>super.addAll</code> = <code>Log.addAll</code>, které pro každý prvek volá <code>add(s)</code> = <code>this.add(s)</code>. <code>this</code> je <code>CountingLog</code> → jeho override přičte 2× 1 → count = 5. Prvky jsou 3.<br>Výstup <code>5 3</code>.',
    verified: 'scala',
    sources: [s(27, 'Lesson: an inherited method can call your override.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-02',
    kind: 'output',
    topic: 'composition',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 27 („A base implementation change can change subclass behavior“)',
      why: 'Stejná podtřída jako v ch6-01, jen báze má self-call obráceně — ukazuje, že výsledek závisí na implementaci báze.',
    },
    prompt: 'The base class from the previous question was refactored: now <code>add</code> calls <code>addAll</code>. The subclass is unchanged. What will it print?',
    code: `class Log:
  private var lines = List[String]()
  def addAll(ss: List[String]): Unit = lines = ss.reverse ++ lines
  def add(s: String): Unit = addAll(List(s))
  def size: Int = lines.size

class CountingLog extends Log:
  var count = 0
  override def add(s: String): Unit =
    count += 1
    super.add(s)
  override def addAll(ss: List[String]): Unit =
    count += ss.size
    super.addAll(ss)

@main def run() =
  val l = CountingLog()
  l.add("a")
  l.addAll(List("b", "c"))
  println(s"\${l.count} \${l.size}")`,
    answer: '4 3',
    explanation:
      '<code>l.add("a")</code>: override přičte 1 → <code>super.add</code> = <code>Log.add</code> volá <code>this.addAll(List("a"))</code> → override <code>CountingLog.addAll</code> přičte 1 → count = 2.<br><code>l.addAll(List("b","c"))</code>: přičte 2 → <code>Log.addAll</code> už nic nevolá → count = 4.<br>Výstup <code>4 3</code>. Podtřída se nezměnila, a přesto počítá jinak než v ch6-01 (5) — to je fragile base class.',
    verified: 'scala',
    sources: [s(27, 'A base implementation change can change subclass behavior.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-03',
    kind: 'output',
    topic: 'composition',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 29 (LoggedPrinter — „a delegate keeps its own this“)',
      why: 'Kontrastuje self-call přes dědičnost (doskočí do podtřídy) a přes delegaci (zůstane v delegátovi).',
    },
    prompt: 'What will it print?',
    code: `trait Greeter:
  def name: String
  def greet(): String

class Basic extends Greeter:
  def name = "basic"
  def greet() = s"Hello from $name"

class Wrapper(inner: Greeter) extends Greeter:
  def name = "wrapper"
  def greet() = inner.greet()

class Sub extends Basic:
  override def name = "sub"

@main def run() =
  println(Wrapper(Basic()).greet())
  println(Sub().greet())`,
    answer: 'Hello from basic\nHello from sub',
    explanation:
      '<code>Wrapper.greet</code> přepošle volání na <code>inner</code>. V <code>Basic.greet</code> je <code>name</code> = <code>this.name</code> a <code>this</code> je <code>inner</code> (instance <code>Basic</code>) → „basic“. Wrapperovo <code>name</code> se nikdy nepoužije.<br><code>Sub</code> dědí: <code>this</code> je <code>Sub</code>, <code>name</code> se vybere dynamicky → „sub“.',
    verified: 'scala',
    sources: [s(29, 'a delegate keeps its own this. A forwarded bulk operation can bypass the wrapper policy')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-04',
    kind: 'mc',
    topic: 'composition',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'Zkouška 23. 1. 2026 („Vysvětlete composition/inheritance, v jakém případě je vhodnější který přístup?“) + L6 slidy 17–34',
      why: 'Shrnuje argumenty pro/proti kompozici a dědičnosti ve formátu multiple choice.',
    },
    prompt: 'Mark all correct statements about composition and inheritance.',
    options: [
      'Inheriting from a class exposes its whole public API, including operations that make no sense for the subtype.',
      'A wrapper (composition) automatically intercepts calls the delegate makes on itself.',
      'Decorators let you combine optional behaviors without a subclass for each combination.',
      'With composition the wrapper can never be used where the component type is expected.',
      'Inheritance fits a stable framework algorithm (a final method) with small documented hooks.',
      'A subclass that overrides methods does not depend on how the base class calls its own methods.',
    ],
    correct: [0, 2, 4],
    explanation:
      '<ul><li>A — pravda: abstraction leak (<code>Stack extends ArrayList</code> má <code>add(0, x)</code>).</li><li>B — nepravda: delegát má svůj vlastní <code>this</code>, jeho self-calls wrapper obejdou.</li><li>C — pravda: <code>Encrypted(Compressed(Pdf()))</code>.</li><li>D — nepravda: wrapper může implementovat stejné rozhraní jako komponenta.</li><li>E — pravda: <code>TestCase.run()</code> je <code>final</code>, hooky <code>setUp/test/tearDown</code>.</li><li>F — nepravda: přesně to je fragile base class problem.</li></ul>',
    verified: 'slides',
    sources: [
      s(22, 'Lesson: code reuse also exposes the base API.'),
      s(29, 'a delegate keeps its own this. A forwarded bulk operation can bypass the wrapper policy'),
      s(17, 'Use decorators to combine optional behavior without a subclass for each combination'),
      s(31, 'A wrapper can implement the same interface as its component.'),
      s(32, 'use inheritance for a stable framework algorithm with small, documented hooks'),
      s(27, 'A base implementation change can change subclass behavior.'),
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-05',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 58/65 (stackable IntStack) + sample midterm otázka 3 (super řetěz)',
      why: 'Procvičuje pořadí stackable modifikací: nejpravější trait upravuje argument první.',
    },
    prompt: 'What will it print?',
    code: `class Base:
  def show(s: String): String = s"[$s]"
trait Upper extends Base:
  override def show(s: String) = super.show(s.toUpperCase)
trait Exclaim extends Base:
  override def show(s: String) = super.show(s + "!")
trait Twice extends Base:
  override def show(s: String) = super.show(s + s)

@main def run() =
  println((new Base with Upper with Exclaim).show("hi"))
  println((new Base with Exclaim with Twice with Upper).show("ab"))`,
    answer: '[HI!]\n[ABAB!]',
    explanation:
      '1) Linearizace: anon, <strong>Exclaim, Upper</strong>, Base. Exclaim: "hi" → "hi!", Upper: → "HI!", Base: → <code>[HI!]</code>.<br>2) Linearizace: anon, <strong>Upper, Twice, Exclaim</strong>, Base. Upper: "ab" → "AB", Twice: → "ABAB", Exclaim: → "ABAB!", Base → <code>[ABAB!]</code>.<br>Postup: nejpravější trait běží první a svou úpravu předá přes <code>super</code> doleva.',
    verified: 'scala',
    sources: [s(65, 'The rightmost modiﬁer runs ﬁrst.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-06',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 59 (linearizace Cat) + slide 60 (diamond ve Scale)',
      why: 'Testuje, že super v traitu B nevede do jeho deklarovaného rodiče A, ale na další typ v linearizaci (C).',
    },
    prompt: 'What will it print?',
    code: `trait A:
  def m: String = "A"
trait B extends A:
  override def m = "B" + super.m
trait C extends A:
  override def m = "C" + super.m
trait D extends B:
  override def m = "D" + super.m
class X extends C, D:
  override def m = "X" + super.m

@main def run() = println(X().m)`,
    answer: 'XDBCA',
    explanation:
      'Linearizace <code>X extends C, D</code>: X, pak L(D) = D, B, A, pak L(C) = C, A → X, D, B, A, C, A → necháme poslední výskyty: <strong>X, D, B, C, A</strong>.<br>Řetěz <code>super</code>: X → D → B → <strong>C</strong> → A. Tedy <code>"X" + "D" + "B" + "C" + "A"</code>.<br>Past: <code>B extends A</code>, ale <code>super.m</code> v B vede do C, protože C je v linearizaci hned za B.',
    verified: 'scala',
    sources: [
      s(59, 'before eliminating all but the last occurrence of each module in the resulting list'),
      s(58, 'In traits super uses late binding - dispatched dynamically'),
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-07',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 57 (MyStack s Filtering, „s3 // ???“)',
      why: 'Kombinuje pořadí modifikací s filtrem, který vidí už upravenou hodnotu.',
    },
    prompt: 'What will it print?',
    code: `trait IntStack:
  def push(e: Int): IntStack
  def pop(): Int

class BasicIntStack extends IntStack:
  private var elems = List[Int]()
  def push(e: Int): IntStack =
    elems = e :: elems
    this
  def pop(): Int = elems match
    case x :: xs =>
      elems = xs
      x
    case Nil => throw new NoSuchElementException
  override def toString = elems.mkString("Stack(", ",", ")")

trait Incrementing extends IntStack:
  abstract override def push(e: Int): IntStack = super.push(e + 1)
trait Doubling extends IntStack:
  abstract override def push(e: Int): IntStack = super.push(e * 2)
trait FilteringNegative extends IntStack:
  abstract override def push(e: Int): IntStack =
    if e >= 0 then super.push(e) else this

@main def run() =
  val s = new BasicIntStack with Doubling with FilteringNegative with Incrementing
  s.push(-1)
  s.push(-3)
  s.push(2)
  println(s)`,
    answer: 'Stack(6,0)',
    explanation:
      'Linearizace: anon, <strong>Incrementing, FilteringNegative, Doubling</strong>, BasicIntStack. Pořadí úprav: +1 → filtr ≥ 0 → ×2.<ul><li><code>push(-1)</code>: 0 → projde (0 ≥ 0) → 0 → uloženo 0.</li><li><code>push(-3)</code>: -2 → zahozeno.</li><li><code>push(2)</code>: 3 → projde → 6 → uloženo.</li></ul><code>elems</code> má poslední push na začátku → <code>Stack(6,0)</code>. Kdo čte zleva doprava (×2, filtr, +1), dostane špatně <code>Stack(5)</code>.',
    verified: 'scala',
    sources: [s(65, 'The rightmost modiﬁer runs ﬁrst.'), s(57)],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-08',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 61 (class D extends B, C s nesouvisejícími m)',
      why: 'Compile error je platná odpověď: dvě nesouvisející konkrétní metody bez override ve třídě.',
    },
    prompt: 'What will it print? (Write <code>CE</code> if it does not compile.)',
    code: `trait Logger:
  def log(msg: String): String = "L:" + msg
trait Printer:
  def log(msg: String): String = "P:" + msg

class Service extends Logger, Printer

@main def run() = println(Service().log("x"))`,
    answer: 'CE',
    explanation:
      '<code>Logger.log</code> a <code>Printer.log</code> jsou dvě konkrétní metody, které spolu nesouvisejí (žádný společný předek s <code>log</code>), a <code>Printer.log</code> nemá <code>override</code>. Kompilátor: „class Service inherits conflicting members … this can be resolved by declaring an override in class Service“. Linearizace tady nepomůže — ta rozhoduje jen mezi metodami, které se navzájem přepisují.',
    verified: 'scala',
    sources: [s(61, '(Note: this can be resolved by declaring an override in class D.)')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-09',
    kind: 'output',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slidy 62–63 (override s super.m() a super[B].m())',
      why: 'Rozlišuje nekvalifikované super (podle linearizace) a kvalifikované super[T].',
    },
    prompt: 'What will it print?',
    code: `trait Logger:
  def log(msg: String): String = "L:" + msg
trait Printer:
  def log(msg: String): String = "P:" + msg

class Service extends Logger, Printer:
  override def log(msg: String): String =
    super[Logger].log(msg) + "|" + super.log(msg)

@main def run() = println(Service().log("x"))`,
    answer: 'L:x|P:x',
    explanation:
      'Konflikt je vyřešen overridem ve třídě, takže se přeloží. <code>super[Logger].log</code> volá natvrdo <code>Logger.log</code> → „L:x“. Nekvalifikované <code>super.log</code> jde na další typ v linearizaci <code>Service, Printer, Logger</code>, tj. <code>Printer</code> → „P:x“.',
    verified: 'scala',
    sources: [s(62, 'd.m() // C.m()'), s(63, 'Scala supports qualiﬁed super')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-10',
    kind: 'mc',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 59 (Cat extends Animal with Furry with FourLegged) — prohozené pořadí traitů',
      why: 'Mechanický výpočet linearizace; distraktory odpovídají typickým chybám (slide naslepo, neškrtnuté duplicity).',
    },
    prompt: 'What is the linearization of <code>Cat</code>? Mark the correct answer.',
    code: `class Animal
trait Furry extends Animal
trait HasLegs extends Animal
trait FourLegged extends HasLegs
class Cat extends Animal with FourLegged with Furry`,
    options: [
      'Cat, FourLegged, HasLegs, Furry, Animal, AnyRef, Any',
      'Cat, Furry, FourLegged, HasLegs, Animal, AnyRef, Any',
      'Cat, Animal, FourLegged, HasLegs, Furry, AnyRef, Any',
      'Cat, Furry, Animal, FourLegged, HasLegs, Animal, AnyRef, Any',
      'Cat, Furry, HasLegs, FourLegged, Animal, AnyRef, Any',
    ],
    correct: [1],
    explanation:
      'Rodiče zprava doleva: L(Furry) = Furry, Animal, AnyRef, Any; L(FourLegged) = FourLegged, HasLegs, Animal, AnyRef, Any; L(Animal) = Animal, AnyRef, Any. Spojeno a s ponecháním posledních výskytů: <strong>Cat, Furry, FourLegged, HasLegs, Animal, AnyRef, Any</strong>.<br>Možnost A je odpověď ze slidu pro opačné pořadí (<code>with Furry with FourLegged</code>). D zapomněla škrtnout duplicitu. E porušuje pravidlo „typ stojí před svými rodiči“. Ověřeno řetězem <code>super</code> ve scala-cli: <code>Cat, Furry, FourLegged, HasLegs, Animal</code>.',
    verified: 'scala',
    sources: [
      s(59, "Method are resolved using a right-ﬁrst depth-ﬁrst search of extended 'traits',"),
      s(59, 'Cat -> FourLegged -> HasLegs -> Furry -> Animal -> AnyRef -> Any'),
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-11',
    kind: 'mc',
    topic: 'traits',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 56 („This trait must be mixed into some class that has a concrete definition of the method“)',
      why: 'Procvičuje, kdy jde abstract override trait vmíchat a kde smí v extends stát třída.',
    },
    prompt: 'Given the definitions below, which of the following lines compile? Mark all correct answers.',
    code: `trait Counter:
  def next(): Int
trait Plus10 extends Counter:
  abstract override def next(): Int = super.next() + 10
class Simple extends Counter:
  private var i = 0
  def next(): Int = { i += 1; i }`,
    options: [
      'val a = new Simple with Plus10',
      'class P extends Simple, Plus10',
      'class Q extends Plus10',
      'class R extends Plus10, Simple',
      'val b = new Plus10 {}',
    ],
    correct: [0, 1],
    explanation:
      '<ul><li>A, B — ano: <code>Plus10</code> je v linearizaci před <code>Simple</code>, takže jeho <code>super.next()</code> má konkrétní cíl. (<code>a.next()</code> vrátí 11, další 12.)</li><li>C, E — CE: „needs to be abstract, since def next() … is not defined“ — pod <code>abstract override</code> není žádná konkrétní implementace.</li><li>D — CE: „class Simple is not a trait“; třída smí být v <code>extends</code> jen první.</li></ul>',
    verified: 'scala',
    sources: [s(56)],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-12',
    kind: 'output',
    topic: 'adhoc',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 71 (2 * half — the left operand selects the receiver)',
      why: 'Ověřuje, že operátor je metoda levého operandu a overload v pravém typu nepomůže.',
    },
    prompt: 'What will it print? (Write <code>CE</code> if it does not compile.)',
    code: `class Money(val cents: Int):
  def +(o: Money): Money = Money(cents + o.cents)
  def +(x: Int): Money = Money(cents + x)
  override def toString = s"$cents c"

@main def run() =
  val m = Money(100)
  println(m + 5)
  println(5 + m)`,
    answer: 'CE',
    explanation:
      '<code>m + 5</code> = <code>m.+(5)</code> → overload <code>+(x: Int)</code>, to je v pořádku. Ale <code>5 + m</code> = <code>5.+(m)</code>: hledá se <code>+</code> na <code>Int</code> a žádné z jeho přetížení (<code>Int</code>, <code>Long</code>, <code>Double</code>, …) nebere <code>Money</code>. Konverze není k dispozici → <strong>CE</strong>, program se nepřeloží celý (nic se nevypíše).',
    verified: 'scala',
    sources: [s(71, 'Int has no applicable *(Rational) overload.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-13',
    kind: 'output',
    topic: 'adhoc',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slidy 72–73 (given Conversion[Int, Rational])',
      why: 'Ukazuje, že konverze se vloží jak pro argument (m + 2), tak pro příjemce (2 + m).',
    },
    prompt: 'What will it print?',
    code: `import scala.language.implicitConversions

class Money(val cents: Int):
  def +(o: Money): Money = Money(cents + o.cents)
  override def toString = s"$cents c"

given Conversion[Int, Money] = x => Money(x * 100)

@main def run() =
  val m = Money(50)
  println(m + 2)
  println(2 + m)`,
    answer: '250 c\n250 c',
    explanation:
      '<code>m + 2</code>: <code>Money.+</code> čeká <code>Money</code>, dostal <code>Int</code> → kompilátor vloží konverzi argumentu: <code>m + Money(200)</code> = 250 c.<br><code>2 + m</code>: <code>Int</code> nemá <code>+(Money)</code> → konverze příjemce: <code>Money(200) + m</code> = 250 c.<br>Pozor, konverze násobí 100 (eura → centy), proto ne 52.',
    verified: 'scala',
    sources: [
      s(73, 'If the expected type or a member call does not ﬁt, it searches for an applicable conversion.'),
      s(73, 'The compiler inserts a conversion call. The program executes that call at run time.'),
    ],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-14',
    kind: 'output',
    topic: 'adhoc',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slidy 85–86 (given seqJson[T](using Jsonable[T]), hledání instance pro Seq[Seq[Player]])',
      why: 'Procvičuje rekurzivní skládání podmíněných instancí type classy.',
    },
    prompt: 'What will it print?',
    code: `trait Show[T]:
  def show(x: T): String

given Show[Int] = x => s"i$x"
given Show[String] = x => s"s'$x'"
given listShow[T](using s: Show[T]): Show[List[T]] =
  xs => xs.map(s.show).mkString("<", ";", ">")

def render[T](x: T)(using s: Show[T]): String = s.show(x)

@main def run() =
  println(render(List(1, 2)))
  println(render(List(List("a"), Nil)))`,
    answer: '<i1;i2>\n<<s\'a\'>;<>>',
    explanation:
      '1) Potřebuji <code>Show[List[Int]]</code> → <code>listShow[Int](using Show[Int])</code> → <code>&lt;i1;i2&gt;</code>.<br>2) Typ je <code>List[List[String]]</code> (<code>Nil</code> se přizpůsobí) → <code>listShow[List[String]](using listShow[String](using Show[String]))</code>. Vnitřní seznamy: <code>&lt;s\'a\'&gt;</code> a prázdný <code>&lt;&gt;</code>; obalené: <code>&lt;&lt;s\'a\'&gt;;&lt;&gt;&gt;</code>.',
    verified: 'scala',
    sources: [s(85, 'The compiler applies the sequence rule recursively until it ﬁnds an instance for each element type.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-15',
    kind: 'output',
    topic: 'adhoc',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slide 87 („The compiler selects the instance from the static types and the context“) + sample midterm otázky na static vs dynamic dispatch',
      why: 'Kontrastuje dynamický výběr virtuální metody se statickým výběrem instance type classy.',
    },
    prompt: 'What will it print?',
    code: `trait Show[T]:
  def show(x: T): String

def render[T](x: T)(using s: Show[T]): String = s.show(x)

trait Animal:
  def describe: String = "animal"
class Dog extends Animal:
  override def describe: String = "dog"

given Show[Animal] = _ => "animal"
given Show[Dog] = _ => "dog"

@main def run() =
  val a: Animal = Dog()
  println(a.describe + " " + render(a))`,
    answer: 'dog animal',
    explanation:
      '<code>a.describe</code> je virtuální volání → rozhoduje runtime třída <code>Dog</code> → „dog“.<br><code>render(a)</code>: <code>T</code> se odvodí ze <strong>statického</strong> typu <code>a</code>, tj. <code>Animal</code> → kompilátor hledá <code>Show[Animal]</code> → „animal“. Runtime typ na výběr instance vliv nemá (stejně jako u overloadingu).',
    verified: 'scala',
    sources: [s(87, 'The compiler selects the instance from the static types and the context.')],
  },
  // -------------------------------------------------------------------------
  {
    id: 'ch6-16',
    kind: 'mc',
    topic: 'adhoc',
    lecture: 'L6',
    origin: {
      type: 'original',
      inspiredBy: 'L6 slidy 87–89 (type class pattern, context bounds, summon)',
      why: 'Ověřuje pojmy type class vs. interface inheritance ve formátu „mark all correct“.',
    },
    prompt: 'Given <code>trait Jsonable[T]</code>, <code>given playerJson: Jsonable[Player]</code> and <code>def save[T: Jsonable](x: T): Unit</code>, mark all correct statements.',
    options: [
      'The bound T: Jsonable requires that T extends Jsonable[T].',
      'The compiler selects the Jsonable instance based on the static type of the argument.',
      'In save(alice) the value alice is converted to a Jsonable.',
      'The instance can also be passed explicitly: save(alice)(using playerJson).',
      'If no suitable given instance exists, the program throws an exception at run time.',
      'A type class lets you add a capability to a type without changing its source code.',
    ],
    correct: [1, 3, 5],
    explanation:
      '<ul><li>A — nepravda: context bound žádá <em>důkaz</em> (instanci <code>Jsonable[T]</code>), ne dědičnost.</li><li>B — pravda.</li><li>C — nepravda: hodnota si drží svůj typ, žádná konverze.</li><li>D — pravda: context bound je zkratka za <code>(using Jsonable[T])</code>, explicitní argument jde vždy.</li><li>E — nepravda: chybějící instance = compile error.</li><li>F — pravda: <code>Player</code> zůstane beze změny (na rozdíl od <code>Player extends Jsonable</code>).</li></ul>',
    verified: 'slides',
    sources: [
      s(89, 'The bound requests evidence. It does not state that T extends Jsonable[T].'),
      s(87, 'The compiler selects the instance from the static types and the context.'),
      s(87, 'The value keeps its original type. No conversion to Jsonable takes place.'),
      s(88, 'An explicit choice always remains possible.'),
      s(88, 'If no best candidate exists, compilation fails.'),
      s(82, 'The Player class stays unchanged.'),
    ],
  },
]
