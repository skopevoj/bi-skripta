import type { Question } from '../types'

export const ch5: Question[] = [
  {
    id: 'ch5-01',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 9–13 (protected/private) a sample midterm (otázky „co se zkompiluje“)',
      why: 'Procvičí přesná pravidla Scaly pro protected (jen přes referenci typu podtřídy) a private (celá třída, ne jen this).',
    },
    prompt: 'Které z označených řádků (A)–(F) se zkompilují? Každý řádek posuzuj samostatně. Označ všechny správné.',
    code: `class Super:
  protected def f(): Int = 1
  private def g(): Int = 2
  def h(o: Super): Int = o.g()      // (A)

class Sub extends Super:
  def a(): Int = f()                // (B)
  def b(o: Sub): Int = o.f()        // (C)
  def c(o: Super): Int = o.f()      // (D)
  def d(): Int = g()                // (E)

@main def run() =
  println(Sub().f())                // (F)`,
    options: ['(A)', '(B)', '(C)', '(D)', '(E)', '(F)'],
    correct: [0, 1, 2],
    explanation:
      '<strong>(A)</strong> ✓ – <code>private</code> ve Scale znamená „uvnitř třídy (a companionu)“, ne „jen na <code>this</code>“. Metoda <code>Super</code> smí volat <code>g</code> na <em>jiné</em> instanci <code>Super</code>. <br><strong>(B)</strong> ✓ – protected člen na sobě v podtřídě. <br><strong>(C)</strong> ✓ – přes referenci typu <code>Sub</code> (nebo jeho podtypu) to jde. <br><strong>(D)</strong> ✗ – z <code>Sub</code> nesmíš volat protected člen přes referenci typu <code>Super</code> (scalac: „protected method f can only be accessed from class Sub or one of its subclasses“). <br><strong>(E)</strong> ✗ – private člen podtřída nevidí (<code>Not found: g</code>). <br><strong>(F)</strong> ✗ – protected zvenku nejde, ani přes podtřídu.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 11, quote: 'Unlike Java, sharing a package does not grant access.' },
      { kind: 'slide', doc: 'L5', page: 13, quote: 'Private members are accessible only from' },
    ],
  },
  {
    id: 'ch5-02',
    kind: 'output',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 14 (Private methods cannot be overridden)',
      why: 'Klasický chyták: override privátní metody je chyba překladu, ne dynamic dispatch.',
    },
    prompt: 'Co program vypíše? (Pokud se nezkompiluje, odpověz CE.)',
    code: `class Account:
  private def fee(): Int = 10
  def total(x: Int): Int = x + fee()

class Premium extends Account:
  override def fee(): Int = 0

@main def run() =
  println(Premium().total(100))`,
    answer: 'CE',
    explanation:
      'Privátní metoda není v podtřídě vidět, takže ji nelze přepsat. <code>override</code> nemá co přepisovat → chyba <em>„method fee overrides nothing“</em> na řádku definice v <code>Premium</code>.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 14, quote: 'it cannot override a private method!' }],
  },
  {
    id: 'ch5-03',
    kind: 'output',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 14 (private + override) a sample midterm otázka 7 (self-call z nadtřídy)',
      why: 'Ukáže, že metoda se stejným jménem jako privátní metoda nadtřídy je nová nesouvisející metoda – žádný dynamic dispatch.',
    },
    prompt: 'Co program vypíše? (Pokud se nezkompiluje, odpověz CE.)',
    code: `class Account:
  private def fee(): Int = 10
  def total(x: Int): Int = x + fee()

class Premium extends Account:
  def fee(): Int = 0

@main def run() =
  val p = Premium()
  println(p.fee())
  println(p.total(100))`,
    answer: '0\n110',
    explanation:
      'Bez <code>override</code> se to zkompiluje: <code>Premium.fee</code> je <strong>nová</strong> veřejná metoda, která s privátní <code>Account.fee</code> nemá nic společného (privátní metoda se nepřepisuje). <br><code>p.fee()</code> → 0. <br><code>total</code> je definovaná v <code>Account</code> a volá <em>svou</em> privátní <code>fee</code> → 100 + 10 = 110. Kdyby <code>fee</code> v <code>Account</code> byla public a v <code>Premium</code> s <code>override</code>, vyšlo by 100.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 14 }],
  },
  {
    id: 'ch5-04',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 35–36 (Use optional fields with care / Give each order state exactly its required facts)',
      why: 'Procvičí rozhodnutí sum vs. product: neplatné stavy mají být nereprezentovatelné.',
    },
    prompt:
      'Objednávka je buď rozpracovaná, zaplacená (má payment id), odeslaná (má payment id i tracking), nebo zrušená (jen před zaplacením). Který model <strong>typově znemožní</strong> objednávku, která je zároveň odeslaná i zrušená, nebo má tracking bez platby?',
    options: [
      '<code>case class Order(id: String, paymentId: Option[String], tracking: Option[String], cancelled: Boolean)</code>',
      '<code>enum Order { case Draft(info: OrderInfo); case Paid(info: OrderInfo, payment: PaymentId); case Shipped(info: OrderInfo, payment: PaymentId, tracking: TrackingCode); case Cancelled(info: OrderInfo) }</code>',
      '<code>case class Order(id: String, state: String, paymentId: Option[String], tracking: Option[String])</code>',
      '<code>case class Order(id: String, paid: Boolean, shipped: Boolean, cancelled: Boolean)</code>',
    ],
    correct: [1],
    explanation:
      'Produkt s <code>Option</code>/<code>Boolean</code> poli připouští všechny kombinace – i ty, které doména zakazuje (<code>Order("o1", None, Some("trk7"), false)</code> má tracking bez platby a typově je v pořádku). <br><strong>Sum</strong> (enum) vybírá stav a každý případ nese <em>přesně</em> fakta, která v něm platí: <code>Shipped</code> nemůže nemít platbu, <code>Cancelled</code> nemá tracking.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'L5', page: 35, quote: 'The product permits combinations that the domain rules forbid.' },
      {
        kind: 'slide',
        doc: 'L5',
        page: 36,
        quote: 'The sum chooses the state; each product supplies the facts required in that state.',
      },
    ],
  },
  {
    id: 'ch5-05',
    kind: 'output',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 18–19 (A collection getter can bypass validation / An immutable container is a shallow fix)',
      why: 'Ukáže, že immutable kolekce chrání jen kontejner, ne mutable prvky – a že :+ vrací novou kolekci.',
    },
    prompt: 'Co program vypíše?',
    code: `import scala.collection.mutable.ArrayBuffer

final class Role(val name: String, var active: Boolean)

final class Team:
  private val members = ArrayBuffer.empty[Role]
  def add(role: Role): Unit =
    require(role.active)
    members += role
  def roles: Vector[Role] = members.toVector

@main def run() =
  val admin = Role("admin", true)
  val team = Team()
  team.add(admin)
  team.roles :+ Role("guest", false)
  team.roles.head.active = false
  println(team.roles.size)
  println(team.roles.head.active)`,
    answer: '1\nfalse',
    explanation:
      '<code>roles</code> vrací <em>kopii</em> jako immutable <code>Vector</code>. <code>:+</code> vytvoří nový Vector, který se zahodí – tým má pořád 1 člena. <br>Ale prvky jsou tytéž objekty <code>Role</code> a ty jsou mutable: <code>team.roles.head.active = false</code> změní roli přímo v týmu → <code>false</code>. Immutable kontejner je jen <strong>mělká</strong> oprava; plná oprava = immutable <code>Role</code> (<code>val active</code>).',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 19, quote: 'The Vector cannot change. Its Role objects can still change.' },
    ],
  },
  {
    id: 'ch5-06',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 21 (Control construction with a companion)',
      why: 'Procvičí, co privátní konstruktor + companion apply dovolí a že apply vrací Option, ne Percentage.',
    },
    prompt:
      'Mějme níže uvedenou třídu. Které z řádků (umístěných v <code>@main</code> mimo třídu i companion) se zkompilují? Označ všechny.',
    code: `final class Percentage private (val value: Int)

object Percentage:
  def apply(n: Int): Option[Percentage] =
    if 0 <= n && n <= 100 then Some(new Percentage(n))
    else None`,
    options: [
      '<code>val a = Percentage(25)</code>',
      '<code>val b = Percentage(150)</code>',
      '<code>val c = new Percentage(50)</code>',
      '<code>val d: Percentage = Percentage(50)</code>',
      '<code>val e = Percentage(25).map(p =&gt; p.value)</code>',
    ],
    correct: [0, 1, 4],
    explanation:
      '<code>Percentage(n)</code> volá companion <code>apply</code> – to jde vždy; pro 150 se jen vrátí <code>None</code> (to je běh, ne překlad). <br><code>new Percentage(50)</code> ✗ – konstruktor je <code>private</code>, smí ho volat jen třída a companion. <br><code>val d: Percentage = Percentage(50)</code> ✗ – <code>apply</code> vrací <code>Option[Percentage]</code>, ne <code>Percentage</code> (type mismatch). <br><code>.map(p =&gt; p.value)</code> ✓ – <code>Some(25)</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 21, quote: 'A private constructor makes the validated factory the entry point.' },
    ],
  },
  {
    id: 'ch5-07',
    kind: 'output',
    topic: 'adt',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 28–29 (plain class vs. case class Payment)',
      why: 'Nejčastější chyták u case classes: == u obyčejné třídy porovnává reference, ne pole.',
    },
    prompt: 'Co program vypíše?',
    code: `class Point(val x: Int, val y: Int)
case class CPoint(x: Int, y: Int)

@main def run() =
  println(Point(1, 2) == Point(1, 2))
  println(CPoint(1, 2) == CPoint(1, 2))
  println(Set(Point(1, 2), Point(1, 2)).size)
  println(Set(CPoint(1, 2), CPoint(1, 2)).size)`,
    answer: 'false\ntrue\n2\n1',
    explanation:
      'Obyčejná třída dědí <code>equals</code>/<code>hashCode</code> z <code>AnyRef</code> → porovnává identitu objektů → <code>false</code>, a v <code>Set</code> jsou dva různé prvky. <br>Case class generuje <code>equals</code>/<code>hashCode</code> podle polí → <code>true</code> a <code>Set</code> má jeden prvek. <br>Pozor: slajd 28 u obyčejné třídy <code>Payment</code> uvádí <code>a == b // true</code>, ale Scala 3 vypíše <code>false</code> – slajd tím ukazuje, jak by rovnost <em>měla</em> fungovat pro hodnotu.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 28, quote: 'A plain class does not generate that API.' },
      { kind: 'slide', doc: 'L5', page: 29 },
    ],
  },
  {
    id: 'ch5-08',
    kind: 'output',
    topic: 'adt',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 30 (co case class generuje z parametrů konstruktoru)',
      why: 'Odhalí, že equals, toString i copy pracují jen s parametry konstruktoru, ne s poli v těle.',
    },
    prompt: 'Co program vypíše?',
    code: `case class User(name: String):
  var logins: Int = 0

@main def run() =
  val a = User("eva")
  a.logins = 5
  val b = a.copy()
  println(a == b)
  println(b.logins)
  println(b)`,
    answer: 'true\n0\nUser(eva)',
    explanation:
      'Vše generované (<code>equals</code>, <code>hashCode</code>, <code>toString</code>, <code>copy</code>, <code>unapply</code>) bere v úvahu jen <strong>parametry primárního konstruktoru</strong>. <br><code>copy()</code> zavolá konstruktor s <code>name = "eva"</code> → nový objekt má <code>logins = 0</code>. <br><code>a == b</code> porovná jen <code>name</code> → <code>true</code>, i když se <code>logins</code> liší. <br><code>toString</code> → <code>User(eva)</code> (řetězec bez uvozovek).',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 30 }],
  },
  {
    id: 'ch5-09',
    kind: 'output',
    topic: 'adt',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 29 (Constructor fields are val by default; use immutable field types)',
      why: 'Ukáže, že rovnost case class deleguje na == polí – a Array má referenční rovnost.',
    },
    prompt: 'Co program vypíše?',
    code: `case class Tags(xs: Array[String])
case class TagList(xs: List[String])

@main def run() =
  println(Tags(Array("a")) == Tags(Array("a")))
  println(TagList(List("a")) == TagList(List("a")))`,
    answer: 'false\ntrue',
    explanation:
      'Vygenerované <code>equals</code> porovná pole pomocí <code>==</code>. <code>Array</code> je Java pole s <strong>referenční</strong> rovností → dvě různá pole nejsou rovna → <code>false</code>. <code>List</code> má strukturální rovnost → <code>true</code>. Další důvod, proč do case class dávat immutable typy polí.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 29, quote: 'copy creates a new value.' }],
  },
  {
    id: 'ch5-10',
    kind: 'output',
    topic: 'pattern',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 51 (Stable identifiers and variable patterns)',
      why: 'Klasická past: malé písmeno v patternu je nová proměnná, ne porovnání s existující hodnotou.',
    },
    prompt: 'Co program vypíše?',
    code: `def check(x: Option[Int]): String =
  val expected = 42
  x match
    case Some(expected) => s"hit $expected"
    case Some(other)    => s"miss $other"
    case None           => "none"

@main def run() =
  println(check(Some(7)))
  println(check(None))`,
    answer: 'hit 7\nnone',
    explanation:
      'Identifikátor začínající <strong>malým písmenem</strong> je v patternu <em>variable pattern</em>: chytí cokoli a zastíní vnější <code>expected</code>. <code>Some(expected)</code> tedy matchne každé <code>Some</code> a naváže <code>expected = 7</code> → <code>hit 7</code>. Druhý case je nedosažitelný (překladač hlásí warning „Unreachable case“). <br>Oprava: <code>case Some(`expected`)</code> (backticky) nebo pojmenovat konstantu velkým písmenem.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 51, quote: 'case Some(A) => "has value 10"' }],
  },
  {
    id: 'ch5-11',
    kind: 'output',
    topic: 'pattern',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 51 (Stable identifiers and variable patterns)',
      why: 'Druhá strana téže pasti: velké písmeno a backticky dělají stable identifier, který se porovnává.',
    },
    prompt: 'Co program vypíše?',
    code: `object Limits:
  val Max = 3

def check(n: Int): String =
  import Limits.Max
  n match
    case Max => "max"
    case m   => s"other $m"

def check2(n: Int, max: Int): String = n match
  case \`max\` => "max"
  case m     => s"other $m"

@main def run() =
  println(check(5))
  println(check2(3, 3))`,
    answer: 'other 5\nmax',
    explanation:
      '<code>Max</code> začíná velkým písmenem → <strong>stable identifier</strong>: case se porovná <code>n == Max</code>. 5 ≠ 3 → <code>other 5</code>. <br>V <code>check2</code> je <code>max</code> malým písmenem, ale v backticích → také stable identifier → 3 == 3 → <code>max</code>. Bez backticků by <code>case max</code> chytil vše.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 51, quote: 'case Some(A) => "has value 10"' }],
  },
  {
    id: 'ch5-12',
    kind: 'output',
    topic: 'pattern',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 52 (Pattern matching and subtyping)',
      why: 'Procvičí pravidlo „první case, který pasuje, vyhrává“ u type patternů v hierarchii.',
    },
    prompt: 'Co program vypíše?',
    code: `class A
class B extends A
class C extends B

def m(a: A): String = a match
  case _: B => "B"
  case _: C => "C"
  case _    => "A"

@main def run() =
  println(m(C()) + m(A()) + m(B()))`,
    answer: 'BAB',
    explanation:
      'Case se zkouší <strong>shora dolů</strong> a vyhraje první, který pasuje. Type pattern <code>_: B</code> pasuje na <code>B</code> i všechny podtypy. <br><code>m(C())</code>: C je B → <code>"B"</code> (case <code>_: C</code> je nedosažitelný, překladač varuje). <code>m(A())</code>: není B ani C → <code>"A"</code>. <code>m(B())</code> → <code>"B"</code>. Výsledek <code>BAB</code>. Chceš-li rozlišit C, dej specifičtější case nahoru.',
    verified: 'scala',
    sources: [{ kind: 'slide', doc: 'L5', page: 52 }, { kind: 'slide', doc: 'L5', page: 72, quote: 'Cases run from top to bottom.' }],
  },
  {
    id: 'ch5-13',
    kind: 'output',
    topic: 'erasure',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'Zkouška 23. 1. 2026 (FIT Wiki: match na _: List[String] s argumentem List[Int]) a L4 s. 78 (type erasure)',
      why: 'Type erasure v patternech: typový argument se za běhu neověří, matchne jakýkoli List.',
    },
    prompt: 'Co program vypíše?',
    code: `def describe(x: Any): String = x match
  case _: List[String] => "strings"
  case _: Seq[?]       => "seq"
  case _               => "other"

@main def run() =
  println(describe(List(1, 2, 3)))
  println(describe(Vector("a")))
  println(describe(Nil))`,
    answer: 'strings\nseq\nstrings',
    explanation:
      'Kvůli <strong>type erasure</strong> za běhu neexistuje <code>List[String]</code>, jen <code>List</code>. Test se přeloží na „je to <code>List</code>?“ a překladač vypíše jen <em>unchecked</em> warning. <br><code>List(1, 2, 3)</code> je List → <code>strings</code> (!). <code>Vector("a")</code> není List, ale je Seq → <code>seq</code>. <code>Nil</code> je List → <code>strings</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L4', page: 78, quote: 'Type erasure removes generic type arguments at runtime (Java, Scala).' },
      { kind: 'wiki', label: 'Zkouška 23. 1. 2026', page: 'oop_zkouska_2026-01-23' },
    ],
  },
  {
    id: 'ch5-14',
    kind: 'mc',
    topic: 'pattern',
    lecture: 'L5',
    origin: {
      type: 'original',
      inspiredBy: 'L5 s. 49–50 (A guard can leave an ADT case uncovered)',
      why: 'Ověří, že neúplný match je ve Scale warning (ne chyba) a za běhu končí MatchError; a co na tom mění sealed.',
    },
    prompt: 'Mějme následující kód. Označ všechna pravdivá tvrzení.',
    code: `sealed trait Shape
case class Circle(r: Double) extends Shape
case class Rect(w: Double, h: Double) extends Shape
case object Dot extends Shape

def area(s: Shape): Double = s match
  case Circle(r)           => 3 * r * r
  case Rect(w, h) if w > 0 => w * h

@main def run() =
  println(area(Rect(2, 3)))
  println(area(Rect(0, 3)))`,
    options: [
      'Kód se nezkompiluje, protože match není exhaustivní.',
      'Překladač vypíše warning, že match nemusí být exhaustivní.',
      'Program vypíše <code>6.0</code> a pak spadne na <code>MatchError</code>.',
      'Program vypíše <code>6.0</code> a <code>0.0</code>.',
      'Kdyby <code>Shape</code> nebyl <code>sealed</code>, překladač by na chybějící případy neupozornil.',
    ],
    correct: [1, 2, 4],
    explanation:
      'Neúplný match je ve Scale <strong>warning</strong>, ne chyba: „match may not be exhaustive. It would fail on pattern case: Rect(_, _), Dot“. Guard <code>if w &gt; 0</code> nechává <code>Rect</code> s <code>w &lt;= 0</code> nepokrytý a <code>Dot</code> chybí úplně. <br>Za běhu: <code>Rect(2, 3)</code> → 6.0; <code>Rect(0, 3)</code> nepasuje na nic → <code>scala.MatchError</code>. <br>Kontrola exhaustivity funguje jen pro uzavřené hierarchie (<code>sealed</code>, <code>enum</code>, <code>Option</code>…); u obyčejného <code>trait</code> překladač nic nehlásí.',
    verified: 'scala',
    sources: [
      { kind: 'slide', doc: 'L5', page: 49, quote: 'match may not be exhaustive.' },
      { kind: 'slide', doc: 'L5', page: 72, quote: 'Guards can leave cases uncovered.' },
    ],
  },
]
