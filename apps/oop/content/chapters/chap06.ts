import type { Chapter, SourceRef } from '../types'

const s = (page: number, quote?: string): SourceRef =>
  quote ? { kind: 'slide', lecture: 'L6', page, quote } : { kind: 'slide', lecture: 'L6', page }

export const chap06: Chapter = {
  id: 'chap-6',
  number: '6',
  title: 'Kompozice, dědičnost a ad-hoc polymorfismus',
  lecture: 'L6',
  summary:
    'Umět obhájit kompozici vs. dědičnost, spočítat „co vypíše“ u fragile base class a u stacku traitů (linearizace + super), poznat konflikty, které nejdou přeložit, a vysvětlit přetěžování operátorů, implicitní konverze a type classes (given/using).',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-1',
      number: '6.1',
      title: 'Kompozice: skládej chování místo dědění',
      blocks: [
        {
          kind: 'p',
          html: 'Motivace z přednášky: vektorový editor ukládá plátno přes <code>CanvasSerializer</code>. Kompresi přidáme podtřídou <code>CompressedCanvasSerializer extends CanvasSerializer</code>, která zavolá <code>super.serialize</code> a výsledek zkomprimuje. Dokud existuje jediný formát, funguje to.',
          sources: [s(7)],
        },
        {
          kind: 'p',
          html: 'Pak přibude PDF a SVG. Kompresní podtřída dědí <strong>pevně jeden</strong> formát, takže pro každý formát potřebuješ další podtřídu se stejným tělem (<code>CompressedPDF…</code>, <code>CompressedSVG…</code>). Přidej šifrování a máš <code>EncryptedCompressedPDFCanvasSerializer</code>: počet tříd roste jako <em>formáty × kombinace efektů</em>.',
          sources: [
            s(9, 'The compressed serializer always uses the default format.'),
            s(10, 'A third format needs another compression subclass.'),
            s(13),
          ],
        },
        {
          kind: 'code',
          caption: 'Řešení kompozicí (slide 11–12): komprese obalí libovolný serializer',
          code: `abstract class CanvasSerializer:
  def serialize(c: Canvas): Array[Byte]

class PDFCanvasSerializer extends CanvasSerializer:
  def serialize(c: Canvas) = encodePDF(c)

// dekorátor: JE CanvasSerializer a MÁ CanvasSerializer
class CompressedCanvasSerializer(next: CanvasSerializer) extends CanvasSerializer:
  def serialize(c: Canvas) = compress(next.serialize(c))

class EncryptedCanvasSerializer(next: CanvasSerializer) extends CanvasSerializer:
  def serialize(c: Canvas) = encrypt(next.serialize(c))

// PDF → compress → encrypt
val serializer = EncryptedCanvasSerializer(CompressedCanvasSerializer(PDFCanvasSerializer()))`,
          sources: [
            s(11, 'use composition for stacking the behavior'),
            s(12, 'Bonus: it scales, adding encryption works with every format'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Dekorátor (wrapper)',
          html: 'Objekt, který <strong>implementuje stejné rozhraní</strong> jako komponenta, kterou drží (<code>next</code>), a před/po delegování na ni přidá chování. Sdílí kontrakt (subtyping přes rozhraní), ale <em>nedědí implementaci</em> komponenty. Volitelná chování se kombinují vnořováním — bez podtřídy pro každou kombinaci.',
          sources: [
            s(31, 'A wrapper can implement the same interface as its component.'),
            s(31, 'That design shares the contract without inheritance of the component implementation.'),
            s(17, 'Use decorators to combine optional behavior without a subclass for each combination'),
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Pořadí dekorátorů = pořadí efektů',
          html: 'Data tečou <strong>zevnitř ven</strong>: nejvnitřnější objekt pracuje první. <code>Encrypted(Compressed(Pdf()))</code> = PDF → komprese → šifrování. Obrácené vnoření nejdřív šifruje a pak komprimuje — a zašifrovaná data se komprimují špatně. Pořadí je tedy návrhové rozhodnutí, které je potřeba zvolit a zdokumentovat.',
          sources: [
            s(17, 'Choose and document the sequence of effects when you combine decorators.'),
            s(17, 'The reverse nesting encrypts ﬁrst, then compresses.'),
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Nejdřív navrhni malé rozhraní, teprve pak implementace.',
            'Chování, která se mění nezávisle (formát × komprese × šifrování), dej do samostatných komponent.',
            'Volitelná chování kombinuj dekorátory, ne podtřídou pro každou kombinaci.',
          ],
          sources: [s(17, 'If behaviors vary independently, put them in separate components.')],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-2',
      number: '6.2',
      title: 'Dědičnost a fragile base class',
      blocks: [
        {
          kind: 'p',
          html: 'Dědičnost spojuje třídy vztahem <strong>is-a</strong> a slouží ke znovupoužití kódu i k polymorfismu. Rozlišuj dvě formy:<ul><li><strong>implementation inheritance</strong> — podtřída převezme kód báze <em>i</em> její typ; virtuální volání v bázi může doskočit do override v podtřídě,</li><li><strong>interface inheritance</strong> — sdílený kontrakt bez sdílené implementace; každý podtyp musí dodržet sliby rozhraní.</li></ul>',
          sources: [
            s(19, 'Relates objects or classes together using is-a relationship'),
            s(20, 'Implementation inheritance reuses base code and gives the subclass the base type.'),
            s(20, 'A virtual call can reach an override in the subclass.'),
            s(20, 'Every subtype must keep the promises of its interface.'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Abstraction leak: Stack extends ArrayList',
          html: 'Podtřída dědí <strong>celé veřejné API</strong> báze. <code>Stack</code> postavený děděním z <code>ArrayList</code> má najednou i <code>add(0, x)</code> a <code>remove(1)</code> — klient může vložit/odebrat prvek uprostřed a rozbít zásobník. Oprava: seznam drž jako <em>privátní komponentu</em> a vystav jen <code>push</code>/<code>pop</code>. Tím ale <code>Stack</code> vypadne z hierarchie kolekcí — pokud subtyping chceš, implementuj malé rozhraní a operace deleguj (interface inheritance + kompozice).',
          code: `class Stack[T] extends java.util.ArrayList[T]:
  def push(x: T): Unit = { add(x); () }
  def pop(): T = remove(size() - 1)

val s = Stack[String]()
s.add(0, "X")   // projde — zásobník je rozbitý`,
          sources: [
            s(22, 'Lesson: code reuse also exposes the base API.'),
            s(23, 'Expose only operations that preserve the stack abstraction.'),
            s(23, 'On the other hand the Stack is no longer part of the collection hierarchy.'),
            s(24, 'Lesson: combine interface inheritance with composition.'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Fragile base class problem',
          html: 'Podtřída nevědomky závisí na tom, <strong>jak báze volá své vlastní metody</strong> (self-calls). Zděděná metoda může zavolat tvůj override, a změna implementace báze (bez změny API!) změní chování podtřídy. Proto musíš chování nadtřídy plně znát — nebo nedědit.',
          sources: [
            s(25, 'A counter depends on base self-calls'),
            s(27, 'Lesson: an inherited method can call your override.'),
            s(27, 'A base implementation change can change subclass behavior.'),
          ],
        },
        {
          kind: 'code',
          caption: 'Klasika ze slidů: CounterSet počítá vložené prvky (včetně duplicit). Kolik je count?',
          runnable: true,
          code: `import java.util.{Collection, HashSet}

class CounterSet[T] extends HashSet[T]:
  private var attempts = 0
  def count: Int = attempts

  override def add(x: T): Boolean =
    attempts += 1
    super.add(x)

  override def addAll(xs: Collection[? <: T]): Boolean =
    attempts += xs.size()
    super.addAll(xs)

@main def run() =
  val c = CounterSet[Int]()
  c.addAll(java.util.List.of(1, 2, 3))
  println(c.size())  // 3
  println(c.count)   // 6 !`,
          sources: [s(27)],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak krokovat override + self-calls na papíře',
          html: '<ol><li>Každé volání <code>m(...)</code> uvnitř báze je ve skutečnosti <code>this.m(...)</code> a <code>this</code> je objekt <strong>podtřídy</strong> → jde dynamicky na nejspodnější override.</li><li><code>super.m(...)</code> ve třídě jde staticky na metodu rodiče — ale jakmile ta zavolá <code>this.něco</code>, jsi zase dole v podtřídě.</li><li>Kresli si zásobník volání a u každého patra připisuj vedlejší efekty (<code>count += …</code>).</li></ol>U CounterSet: <code>addAll</code> přičte 3 → <code>super.addAll</code> (z <code>AbstractCollection</code>) volá pro každý prvek <code>this.add</code> → tvůj override přičte ještě 3× 1. Výsledek <strong>6</strong>, ne 3.',
          sources: [s(20, 'A virtual call can reach an override in the subclass.'), s(27, 'c.count // 6')],
        },
        {
          kind: 'code',
          caption: 'Příklad 1: totéž s vlastní bází — dědičnost vs. wrapper',
          runnable: true,
          code: `// Bázová třída: addAll je implementované pomocí add (self-call)
class Bag:
  private var items = List[Int]()
  def add(x: Int): Unit = items = x :: items
  def addAll(xs: List[Int]): Unit = xs.foreach(add)
  def size: Int = items.size

// Dědičnost: počítá dvakrát
class CountingBag extends Bag:
  var count = 0
  override def add(x: Int): Unit =
    count += 1
    super.add(x)
  override def addAll(xs: List[Int]): Unit =
    count += xs.size
    super.addAll(xs) // Bag.addAll volá this.add → CountingBag.add!

// Kompozice: wrapper drží Bag jako privátní komponentu
class CountingBagW:
  private val inner = Bag()
  var count = 0
  def add(x: Int): Unit =
    count += 1
    inner.add(x)
  def addAll(xs: List[Int]): Unit =
    count += xs.size
    inner.addAll(xs) // inner.add je Bag.add, wrapper už nic nepřičte
  def size: Int = inner.size

@main def run() =
  val a = CountingBag()
  a.addAll(List(1, 2, 3))
  println(s"\${a.size} \${a.count}")
  val b = CountingBagW()
  b.addAll(List(1, 2, 3))
  println(s"\${b.size} \${b.count}")`,
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 1',
          html: '<strong>Dědičnost:</strong> <code>a.addAll</code> → <code>count = 3</code> → <code>super.addAll</code> → <code>xs.foreach(add)</code>, kde <code>add</code> = <code>this.add</code> = <code>CountingBag.add</code> → 3× <code>count += 1</code> → <code>count = 6</code>. Vypíše <code>3 6</code>.<br><strong>Wrapper:</strong> <code>inner</code> je obyčejný <code>Bag</code>, jeho <code>this</code> je <code>inner</code>, ne wrapper → self-call skončí v <code>Bag.add</code>. Vypíše <code>3 3</code>.<br>Výstup: <code>3 6</code> a <code>3 3</code> (ověřeno scala-cli).',
          sources: [s(28, 'Lesson: use composition and interface inheritance, delegate where reasonable')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Delegát má svůj vlastní this',
          html: 'Kompozice chrání před self-calls, ale funguje to i obráceně: když wrapper hromadnou operaci jen <em>přepošle</em> (<code>next.printTwice(s)</code>), delegát volá <strong>svůj</strong> <code>print</code> a logování wrapperu se obejde. Politiku wrapperu aplikuj na každém veřejném vstupu — <code>printTwice</code> musí jít přes <code>this.print</code> wrapperu.',
          sources: [
            s(29, 'a delegate keeps its own this. A forwarded bulk operation can bypass the wrapper policy'),
            s(30, 'Lesson: apply the policy at every public entry point.'),
          ],
        },
        {
          kind: 'code',
          caption: 'Příklad 2: LoggedPrinter — bez logu vs. se dvěma logy',
          runnable: true,
          code: `trait Printer:
  def print(s: String): Unit
  def printTwice(s: String): Unit

class BasicPrinter extends Printer:
  def print(s: String): Unit = println(s)
  def printTwice(s: String): Unit =
    print(s)
    print(s)

// Varianta 1: printTwice jen přeposílá → delegát volá SVŮJ print
class LoggedPrinter(next: Printer) extends Printer:
  def print(s: String): Unit =
    println("log")
    next.print(s)
  def printTwice(s: String): Unit = next.printTwice(s)

// Varianta 2: printTwice jde přes wrapper
class LoggedPrinter2(next: Printer) extends Printer:
  def print(s: String): Unit =
    println("log")
    next.print(s)
  def printTwice(s: String): Unit =
    print(s)
    print(s)

@main def run() =
  LoggedPrinter(BasicPrinter()).printTwice("Hi")
  println("---")
  LoggedPrinter2(BasicPrinter()).printTwice("Hi")`,
          sources: [s(29), s(30)],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 2',
          html: 'Varianta 1: <code>next.printTwice</code> běží v <code>BasicPrinter</code>, jeho <code>print</code> je <code>BasicPrinter.print</code> → <code>Hi</code>, <code>Hi</code> (žádné <code>log</code>). Varianta 2: <code>printTwice</code> volá <code>this.print</code> wrapperu → <code>log</code>, <code>Hi</code>, <code>log</code>, <code>Hi</code>.',
        },
        {
          kind: 'p',
          html: 'Kdy je dědičnost naopak vhodná: <strong>stabilní algoritmus frameworku</strong> s malými zdokumentovanými hooky. Např. <code>TestCase.run()</code> je <code>final</code> (setUp → test → tearDown) a podtřída jen doplní <code>protected</code> hook <code>test()</code>. Podtřída nemůže algoritmus rozbít, protože ho nemůže přepsat.',
          sources: [s(32, 'use inheritance for a stable framework algorithm with small, documented hooks')],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Než podědíš (Before you extend a class)',
          html: '<ol><li>Sepiš kontrakt báze jako <em>pozorovatelné chování</em>.</li><li>Ověř, že <strong>každá</strong> operace báze dává smysl pro podtyp (jinak abstraction leak).</li><li>Ověř, že podtyp přijme stejné vstupy a dodrží slíbené výsledky (LSP).</li><li>Používej jen zdokumentované hooky a <code>protected</code> API.</li><li>Pokud báze na rozšiřování navržená není → použij komponentu.</li></ol>Navíc: konstruktor nesmí volat metody, které podtřída přepisuje; algoritmy frameworku drž <code>final</code>; testuj i volání mezi operacemi (bulk vs. single).',
          sources: [
            s(33, 'Write the base contract as observable behavior.'),
            s(33, 'Check that every base operation makes sense for the subtype.'),
            s(33, 'If the base class does not support extension, use a component instead.'),
            s(34, 'Keep constructors free of calls to subclass overrides.'),
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Kompozice vs. dědičnost — odpověď na zkoušku (3 věty)',
          html: '<strong>1.</strong> Dědičnost (is-a) použij jen tehdy, když je podtřída skutečným podtypem — každá operace báze pro ni dává smysl a dodrží kontrakt — a báze je na rozšíření navržená (typicky stabilní <code>final</code> algoritmus frameworku s dokumentovanými hooky).<br><strong>2.</strong> Jinak preferuj kompozici (has-a): komponentu drž privátně a vystav jen operace, které chceš (žádný abstraction leak), a nezávisíš na tom, jak báze volá sama sebe (fragile base class).<br><strong>3.</strong> Chování, která se mění nezávisle, skládej dekorátory přes malé rozhraní (interface inheritance + delegace) místo podtřídy pro každou kombinaci — subtyping zůstane a kombinace se dají měnit i za běhu.',
          sources: [
            s(34, 'If you only need code reuse, start with a private component.'),
            s(34, 'Choose a base class only if every subtype can keep its contract.'),
            s(32, 'use inheritance for a stable framework algorithm with small, documented hooks'),
            s(17, 'Use decorators to combine optional behavior without a subclass for each combination'),
          ],
        },
        { kind: 'quiz', ids: ['ch6-01', 'ch6-02', 'ch6-03', 'ch6-04'], title: 'Procvič: dědičnost vs. kompozice' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-3',
      number: '6.3',
      title: 'Vícenásobná dědičnost a diamond problem',
      blocks: [
        {
          kind: 'p',
          html: 'Jednoduchá dědičnost je jednoduchá, ale málo výrazná (chceš <code>InputOutputStream</code> z <code>InputStream</code> i <code>OutputStream</code>). Vícenásobná dědičnost je výrazná, ale složitá: nejednoznačnosti (diamond) a jedno <code>super</code> nestačí, když je rodičů víc.',
          sources: [
            s(36, 'e.g., you have InputStream, OutputStream and want InputOutputStream'),
            s(36, 'Ambiguity problems (the diamond problem)'),
            s(36, 'one super is not enough in presence of multiple superclasses'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Diamond problem',
          html: '<code>B</code> a <code>C</code> dědí z <code>A</code>, <code>D</code> dědí z <code>B</code> i <code>C</code>. Metodu z <code>A</code> přepíšou <code>B</code> i <code>C</code>, <code>D</code> ne. Kterou verzi <code>D</code> zdědí — z <code>B</code>, nebo z <code>C</code>?',
          sources: [s(39, 'then which version of the method does D inherit: that of B, or that of C?')],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>C++</strong> (skutečná vícenásobná dědičnost): bez <code>virtual</code> má <code>D</code> dva podobjekty <code>A</code> (<code>d.x</code> je nejednoznačné, píše se <code>d.B::x</code>); s <code>virtual</code> dědičností jeden sdílený. Konflikt přepsaných metod musí <code>D</code> vyřešit.',
            '<strong>Python</strong>: C3 linearizace (MRO) — potomci před rodiči, rodiče v pořadí zápisu. Pro <code>class D(B, C)</code> je MRO <code>D, B, C, A</code>.',
            '<strong>Java</strong>: jednoduchá dědičnost + rozhraní. Od Javy 8 mají rozhraní <code>default</code> metody → diamond se vrátil; konflikt je compile error a řeší se ručně overridem, např. <code>B.super.m()</code>.',
            '<strong>Scala</strong>: jednoduchá dědičnost tříd + traity, konflikt řeší linearizace (viz 6.5–6.6).',
          ],
          sources: [
            s(38, 'Single inheritance with traits (Scala)'),
            s(40, 'Two separate A subobjects.'),
            s(41, 'E.g.: the Method Resolution Order (MRO) is: D, B, C, A'),
            s(43, 'class D inherits unrelated defaults for m() from types B and C'),
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Design rules',
          html: 'Nezávislé schopnosti vyjadřuj více rozhraními; konflikty metod řeš explicitně; nepředpokládej, že diamond ve všech jazycích sdílí stav; potřebují-li části samostatnou identitu/životnost, slož oddělené objekty.',
          sources: [
            s(44, 'Use several interfaces to express independent capabilities.'),
            s(44, 'Do not assume that a diamond shares state in every language.'),
          ],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-4',
      number: '6.4',
      title: 'Traity: thin vs. rich rozhraní',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Trait',
          html: 'Základní jednotka znovupoužití, nezávislá na hierarchii tříd. Trait <strong>poskytuje</strong> metody/pole a <strong>vyžaduje</strong> metody/pole (použité, ale nedefinované). Třída může vmíchat (mix in) libovolný počet traitů, konflikty se řeší overridem. Oproti abstraktní třídě: nejde instanciovat a <strong><code>super</code> se v traitu váže dynamicky</strong> (ve třídě staticky).',
          sources: [
            s(46, 'Fundamental units of reuse (that can be divorced from any class hierarchy)'),
            s(46, 'A class can mix in any number of traits and'),
            s(46, 'the calls to super are resolved dynamically (unlike in a class where it is static)'),
          ],
        },
        {
          kind: 'p',
          html: 'Dvě typická použití traitů: <strong>rozšíření tenkého rozhraní</strong> (widen thin interfaces) a <strong>stackable modifications</strong> (6.5). Trade-off: <em>rich</em> rozhraní (hodně metod) je pohodlné pro klienty, <em>thin</em> (málo metod) pro implementátory. Trait dá obojí: implementátor napíše minimum, klient dostane bohaté API.',
          sources: [
            s(47, 'rich interfaces are convenient for clients (more methods to pick from)'),
            s(47, 'thin interfaces are convenient for implementers (less code to write)'),
          ],
        },
        {
          kind: 'code',
          caption: 'Jedna required metoda, dvě provided (slide 51)',
          runnable: true,
          code: `trait TextSink:
  def write(text: String): Unit                      // required
  def writeLine(line: String): Unit = write(line + "\\n") // provided
  def writeLines(lines: Iterable[String]): Unit =     // provided
    lines.foreach(writeLine)

class ConsoleSink extends TextSink:
  def write(text: String): Unit = print(text)

class BufferSink extends TextSink:
  val buffer = StringBuilder()
  def write(text: String): Unit = { buffer.append(text); () }

@main def run() =
  val sink = BufferSink()
  sink.writeLines(List("A", "B"))
  println(sink.buffer.toString == "A\\nB\\n") // true
  ConsoleSink().writeLines(List("C", "D"))`,
          sources: [s(51, 'Implement write once for each destination. The trait supplies writeLine and writeLines.')],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Thin → rich přes trait',
          html: '<ol><li>Najdi minimum, ze kterého jde zbytek odvodit → abstraktní (<em>required</em>) metody traitu.</li><li>Ostatní (<em>provided</em>) metody napiš v traitu pomocí required.</li><li>Třídy implementují jen required metody.</li></ol>Učebnicový příklad: <code>Rectangular</code> (required <code>topLeft</code>, <code>bottomRight</code> → provided <code>left</code>, <code>width</code>, …) a <code>Ordered[A]</code> (required <code>compare</code> → provided <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>).',
          sources: [s(48), s(75, 'One compare method supplies <, >, <=, and >=.')],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-5',
      number: '6.5',
      title: 'Stackable modifications, linearizace a super',
      blocks: [
        {
          kind: 'p',
          html: 'Trait může reprezentovat <strong>modifikaci</strong> (v podstatě dekorátor) a modifikace jde skládat za sebe. Každý trait přepíše <code>push</code> a předá upravenou hodnotu dál přes <code>super.push</code>. Kam <code>super</code> vede, určí až konkrétní kombinace — <strong>linearizace</strong>.',
          sources: [s(52, 'Traits can represent modiﬁcations (essentially a decorator)'), s(58, 'Method call is determined by linearization')],
        },
        {
          kind: 'code',
          caption: 'IntStack ze slidů 54–58: Incrementing, Doubling, FilteringNegative, Filtering(p)',
          runnable: true,
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

trait Filtering(p: Int => Boolean) extends IntStack:   // Scala 3: trait s parametrem
  abstract override def push(e: Int): IntStack =
    if p(e) then super.push(e) else this

class MyStack extends BasicIntStack with Doubling with Incrementing with FilteringNegative

@main def run() =
  val a = new BasicIntStack with Incrementing with Doubling
  a.push(2)
  println(a.pop()) // 5

  val b = new BasicIntStack with Doubling with Incrementing
  b.push(2)
  println(b.pop()) // 6

  val s3 = new MyStack() with Filtering(x => (x & 1) == 0)
  s3.push(1)
  s3.push(2)
  s3.push(3)
  println(s3)      // Stack(6)`,
          sources: [s(56), s(57, 'class MyStack extends BasicIntStack with Doubling with Incrementing with FilteringNegative'), s(58)],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'abstract override',
          html: 'Trait, který volá <code>super.push</code>, ačkoli je <code>push</code> v rodiči (<code>IntStack</code>) abstraktní, musí mít modifikátor <code>abstract override</code>. Znamená: „konkrétní implementaci dodá někdo, kdo bude v linearizaci <em>za mnou</em>“. Proto ho lze vmíchat jen do třídy, která konkrétní <code>push</code> už má (<code>BasicIntStack with Doubling</code>).<ul><li>jen <code>override</code> + <code>super.push</code> na abstraktní metodu → <strong>CE</strong> („may not be abstract unless it is overridden by a member declared abstract and override“),</li><li><code>class S extends Doubling</code> bez konkrétního <code>push</code> → <strong>CE</strong> („class S needs to be abstract“).</li></ul>',
          sources: [s(56, 'abstract override def push(e: Int): IntStack = super.push(e * 2)'), s(56)],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Linearizace krok za krokem',
          html: '<ol><li>Přepiš deklaraci na <code>C extends P1 with P2 with … with Pn</code> (Scala 3 čárky <code>extends P1, P2</code> = <code>with</code>). U <code>new X with T1 with T2</code> ber anonymní třídu <code>anon extends X with T1 with T2</code>.</li><li>Seznam začni třídou <code>C</code>.</li><li>Procházej rodiče <strong>zprava doleva</strong> (Pn, …, P1) a za seznam vždy připiš <strong>celou linearizaci</strong> daného rodiče (rekurzivně stejným postupem; třída bez rodičů = <code>X, AnyRef, Any</code>).</li><li>Škrtni duplicity — z každého typu nech <strong>jen poslední výskyt</strong>.</li><li>Hotovo: <code>C, …, AnyRef, Any</code>. Čti zleva doprava jako „kdo je blíž objektu“.</li></ol>Kontrola: každý typ stojí <em>před</em> všemi svými rodiči; poslední rodič v <code>extends</code> je hned za <code>C</code>.',
          sources: [
            s(59, "Method are resolved using a right-ﬁrst depth-ﬁrst search of extended 'traits',"),
            s(59, 'before eliminating all but the last occurrence of each module in the resulting list'),
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Kam skočí volání a kam super',
          html: '<ul><li><code>obj.m()</code> začne u <strong>prvního</strong> typu v linearizaci (zleva), který <code>m</code> definuje → ten nejpravější vmíchaný trait běží první.</li><li><code>super.m()</code> uvnitř traitu <code>T</code> jde na <strong>nejbližší typ vpravo od T</strong> v linearizaci <em>skutečné třídy objektu</em>, který <code>m</code> definuje. Ne na rodiče z deklarace <code>T</code>!</li><li>Pro výsledek si napiš řetěz: <code>T_první → T_další → … → konkrétní třída</code> a aplikuj úpravy v tomto pořadí na argument (u push) nebo poskládej návratovou hodnotu odzadu (u <code>"X" + super.m</code>).</li></ul>',
          sources: [
            s(58, 'In traits super uses late binding - dispatched dynamically'),
            s(65, 'Each modiﬁer calls the next implementation through super.'),
            s(66, 'Trace the rightmost trait ﬁrst when you reason about a mixed class.'),
          ],
        },
        {
          kind: 'code',
          caption: 'Příklad 3: linearizace Cat ze slidu 59, ověřená řetězem super',
          runnable: true,
          code: `class Animal:
  def path: String = "Animal"

trait Furry extends Animal:
  override def path: String = "Furry > " + super.path

trait HasLegs extends Animal:
  override def path: String = "HasLegs > " + super.path

trait FourLegged extends HasLegs:
  override def path: String = "FourLegged > " + super.path

class Cat extends Animal with Furry with FourLegged:
  override def path: String = "Cat > " + super.path

@main def run() =
  println(Cat().path)
  val f: Furry = Cat()
  println(f.path)                        // dynamický dispatch: stejné
  println((new Animal with HasLegs with Furry).path)`,
          sources: [s(59)],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 3 (postup na papíře)',
          html: '<code>Cat extends Animal with Furry with FourLegged</code>. Rodiče zprava doleva:<ul><li>L(FourLegged) = FourLegged, HasLegs, Animal, AnyRef, Any</li><li>L(Furry) = Furry, Animal, AnyRef, Any</li><li>L(Animal) = Animal, AnyRef, Any</li></ul>Spojeno: Cat, <em>FourLegged, HasLegs, Animal, AnyRef, Any</em>, <em>Furry, Animal, AnyRef, Any</em>, <em>Animal, AnyRef, Any</em>. Necháme poslední výskyty: <strong>Cat, FourLegged, HasLegs, Furry, Animal, AnyRef, Any</strong> — přesně jako na slidu.<br>Výstup: <code>Cat &gt; FourLegged &gt; HasLegs &gt; Furry &gt; Animal</code> (dvakrát — statický typ <code>Furry</code> nic nemění) a pro <code>new Animal with HasLegs with Furry</code>: anon, Furry, HasLegs, Animal → <code>Furry &gt; HasLegs &gt; Animal</code>.',
          sources: [s(59, 'Cat -> FourLegged -> HasLegs -> Furry -> Animal -> AnyRef -> Any')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'super v traitu ≠ rodič z deklarace',
          html: '<code>HasLegs extends Animal</code>, a přesto v objektu <code>Cat</code> vede <code>super.path</code> z <code>HasLegs</code> do <strong><code>Furry</code></strong>, ne do <code>Animal</code>. Kdo je „super“, se pozná až z linearizace konkrétní třídy. Na testu nikdy neodpovídej podle deklarace traitu.',
          sources: [s(46, 'the calls to super are resolved dynamically (unlike in a class where it is static)')],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Příklad 4: IntStack (kód výše) postupem',
          html: '<ul><li><code>a = BasicIntStack with Incrementing with Doubling</code>: linearizace anon, <strong>Doubling, Incrementing</strong>, BasicIntStack. <code>push(2)</code>: Doubling 2→4, Incrementing 4→5, Basic uloží 5. <code>pop()</code> = <strong>5</strong>.</li><li><code>b = … with Doubling with Incrementing</code>: Incrementing 2→3, Doubling 3→6 → <strong>6</strong>.</li><li><code>s3 = MyStack with Filtering(sudé)</code>: anon, Filtering, MyStack, FilteringNegative, Incrementing, Doubling, BasicIntStack. <code>push(1)</code>: liché → zahozeno. <code>push(2)</code>: sudé, ≥ 0, +1 = 3, ×2 = 6 → uloženo. <code>push(3)</code>: liché → zahozeno. Výstup <strong><code>Stack(6)</code></strong> (slide 57 říká 6).</li></ul>Pozor: filtr testuje hodnotu v okamžiku, kdy k němu dorazí — modifikace vlevo od něj už proběhly, vpravo ještě ne.',
          sources: [
            s(65, 'a.pop() // 5: first double 2, then add 1.'),
            s(65, 'b.pop() // 6: first add 1, then double 3.'),
            s(57, 's3 // ???   6'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Nejpravější běží první',
          html: '<code>new BasicIntStack with Incrementing with Doubling</code> se čte jako „nejdřív <strong>Doubling</strong>, pak Incrementing“. Intuice „zleva doprava“ dá opačný (špatný) výsledek. Stejně tak u <code>class D extends B, C</code> vyhrává <code>C</code>.',
          sources: [s(65, 'The rightmost modiﬁer runs ﬁrst.')],
        },
        {
          kind: 'interactive',
          component: 'linearization',
          title: 'Linearizace a super řetěz',
          hint: 'Poskládej třídu z traitů, spočítej linearizaci ručně (zprava doleva, nech poslední výskyty) a pak krokuj, kam vede každé super.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Bonus: pořadí inicializace',
          html: 'Těla traitů/tříd (kód konstruktoru) se spouštějí v <strong>opačném</strong> pořadí linearizace: nejdřív nejvzdálenější rodič. Pro <code>class C extends Base with T1 with T2</code>, kde každé tělo dělá <code>println</code>, vyjde <code>Base, T1, T2, C</code> (ověřeno scala-cli; na slidech to explicitně není).',
        },
        { kind: 'quiz', ids: ['ch6-05', 'ch6-06', 'ch6-07', 'ch6-10'], title: 'Procvič: linearizace a super' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-6',
      number: '6.6',
      title: 'Konflikty, diamond ve Scale a „trait, nebo ne?“',
      blocks: [
        {
          kind: 'p',
          html: 'Traity řeší diamond linearizací: <code>class D extends B, C</code>, kde <code>B</code> i <code>C</code> přepisují <code>A.m</code>, má linearizaci <code>D, C, B, A</code> → <code>d.m()</code> vypíše <strong><code>C</code></strong>. Žádná nejednoznačnost.',
          sources: [s(60, 'It resolves method through linearization using right-ﬁrst, depth-ﬁrst')],
        },
        {
          kind: 'code',
          caption: 'Příklad 5: diamond, konflikt vyřešený overridem, kvalifikované super',
          runnable: true,
          code: `trait A:
  def m(): String = "A"
trait B extends A:
  override def m(): String = "B"
trait C extends A:
  override def m(): String = "C"
class D extends B, C          // diamond: vyhrává C

trait X:
  def m(): String = "X"
trait Y:
  def m(): String = "Y"
// class Z extends X, Y       // CE: inherits conflicting members
class Z1 extends X, Y:
  override def m(): String = super.m()     // super = další v linearizaci = Y
class Z2 extends X, Y:
  override def m(): String = super[X].m()  // kvalifikované super

@main def run() =
  println(D().m())
  println(Z1().m())
  println(Z2().m())`,
          sources: [s(60), s(62), s(63, 'Scala supports qualiﬁed super')],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 5',
          html: '<code>C</code>, <code>Y</code>, <code>X</code>. U <code>D</code> rozhoduje linearizace (C je napravo). <code>Z1</code>: linearizace <code>Z1, Y, X</code>, takže <code>super.m()</code> = <code>Y.m()</code>. <code>Z2</code>: <code>super[X]</code> vybere konkrétního rodiče natvrdo.',
          sources: [s(62, 'd.m() // C.m()'), s(63, 'd.m() // B.m()')],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Kdy kombinace traitů NEJDE přeložit',
          html: '<ol><li><strong>Dvě nesouvisející konkrétní metody</strong> stejné signatury (<code>X.m</code>, <code>Y.m</code> bez společného předka s <code>m</code>) a třída je nepřepíše → CE „inherits conflicting members“. Oprava: <code>override</code> ve třídě (uvnitř <code>super.m()</code> = nejpravější, nebo <code>super[X].m()</code>).</li><li><strong>Chybí modifikátor <code>override</code></strong>: pokud by v linearizaci konkrétní <code>m</code> traitu přepsalo jiné konkrétní <code>m</code>, musí mít <code>override</code>. Pro <code>trait A { def m(): String }</code> (abstraktní), <code>B extends A { def m() = "B" }</code>, <code>C extends A { override def m() = "C" }</code>: <code>class D extends B, C</code> projde (vypíše <code>C</code>), ale <code>class D extends C, B</code> je CE — <code>B.m</code> by přepsalo <code>C.m</code> bez <code>override</code>. Když chybí <code>override</code> u obou, je CE v obou pořadích.</li><li><strong><code>abstract override</code> bez konkrétní implementace</strong> pod sebou → CE (6.5).</li><li>V <code>extends A, B, C</code> smí být třída jen <strong>první</strong>; <code>class R extends Trait, SomeClass</code> → CE „SomeClass is not a trait“.</li></ol>',
          sources: [
            s(61, '(Note: this can be resolved by declaring an override in class D.)'),
            s(62, 'Still there can be a conﬂict that needs an explicit'),
            s(66, 'Use an explicit override to resolve an unrelated method conﬂict.'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Traity vs. vícenásobná dědičnost — v čem je rozdíl',
          html: 'Ve třídě je <code>super</code> statické (vždy přímý rodič). V traitu je <code>super</code> <strong>late binding</strong>: cíl určí až linearizace třídy, do které je trait vmíchán. Proto stejný trait může v různých třídách volat různé „super“ a modifikace jdou skládat. Při vícenásobné dědičnosti (C++) by <code>D</code> musel konflikt <code>B</code>/<code>C</code> řešit ručně; Scala vybere podle linearizace a CE hlásí jen u nesouvisejících metod nebo chybějícího <code>override</code>.',
          sources: [
            s(58, 'In traits super uses late binding - dispatched dynamically'),
            s(46, 'the calls to super are resolved dynamically (unlike in a class where it is static)'),
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'To trait or not to trait',
          html: '<ul><li>Chování se nebude znovupoužívat → <strong>konkrétní třída</strong>.</li><li>Může se použít ve více <em>nesouvisejících</em> třídách → <strong>trait</strong>.</li><li>Chceš z něj dědit v Java kódu → <strong>abstraktní třída</strong>.</li><li>Nevíš → <strong>trait</strong> (nechává víc možností otevřených).</li></ul>A pokud se má chování měnit za běhu, traity (pevně dané při kompilaci) nestačí → vyměnitelné komponenty (kompozice).',
          sources: [
            s(64, 'If it might be reused in multiple, unrelated classes: a trait'),
            s(64, 'If you want to inherit from it in Java code: an abstract class'),
            s(64, 'If you still do not know: a trait (keeps more options open)'),
            s(66, 'If behavior must change at run time, use replaceable components.'),
          ],
        },
        { kind: 'quiz', ids: ['ch6-08', 'ch6-09', 'ch6-11'], title: 'Procvič: konflikty a abstract override' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-7',
      number: '6.7',
      title: 'Ad-hoc polymorfismus: operátory, konverze, Ordered',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Ad-hoc polymorfismus',
          html: 'Jedna operace má <strong>různé implementace pro různé typy</strong>, které nemusí mít společnou nadtřídu (sčítání Intů, Doublů, spojování Stringů). Dvě formy: <strong>overloading</strong> (přetěžování) a <strong>type classes</strong>.',
          sources: [
            s(68, 'One operation has different implementations for different types.'),
            s(68, 'The types do not need a common superclass.'),
            s(68, 'Overloads and type classes provide two forms of ad-hoc polymorphism.'),
          ],
        },
        {
          kind: 'p',
          html: 'Ve Scale jsou <strong>operátory obyčejné metody</strong>: <code>half + 2</code> je <code>half.+(2)</code>. <code>Rational</code> má přetížené <code>+(r: Rational)</code> a <code>+(x: Int)</code>; kompilátor vybere variantu <em>staticky</em> podle typu argumentu (stejně jako u každého overloadingu).',
          sources: [s(70, 'Operators are methods.'), s(70, 'half + 2 // The compiler selects +(Int).')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Levý operand vybírá příjemce: 2 * half',
          html: '<code>2 * half</code> je <code>2.*(half)</code> — hledá se metoda <code>*</code> na <strong><code>Int</code></strong>, a ta žádné přetížení pro <code>Rational</code> nemá → <strong>CE</strong> („None of the overloaded alternatives of method * in class Int … match arguments“). Přetížení v <code>Rational</code> nepomůže a do <code>Int</code> metody přidat nemůžeš. Řešení: implicitní konverze (nebo extension metoda).',
          sources: [
            s(71, 'Int has no applicable *(Rational) overload.'),
            s(71, 'We cannot add overloads to Int or Double. An implicit conversion can adapt the receiver.'),
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak kompilátor vkládá implicitní konverzi',
          html: '<ol><li>Nejdřív zkusí výraz s původními typy.</li><li>Když nesedí očekávaný typ nebo volaný člen (<code>2.*(half)</code>), hledá použitelnou konverzi — <code>given Conversion[Int, Rational]</code>, která je <strong>vidět</strong> (definovaná/importovaná v scope, nebo v relevantním companion objektu).</li><li>Vloží volání konverze: <code>intToRational(2) * half</code>. Konverze proběhne za běhu.</li><li>Žádná konverze, nebo víc stejně dobrých → <strong>CE</strong>.</li></ol>',
          sources: [
            s(73, 'The compiler ﬁrst tries the expression with its original types.'),
            s(73, 'If the expected type or a member call does not ﬁt, it searches for an applicable conversion.'),
            s(73, 'The compiler inserts a conversion call. The program executes that call at run time.'),
            s(73, 'A missing conversion or an unresolved ambiguity causes a compile error.'),
          ],
        },
        {
          kind: 'code',
          caption: 'Příklad 6: Rational s overloady, Conversion a Ordered',
          runnable: true,
          code: `import scala.language.implicitConversions

final class Rational private (val n: BigInt, val d: BigInt) extends Ordered[Rational]:
  def +(r: Rational): Rational = Rational(n * r.d + r.n * d, d * r.d)
  def *(r: Rational): Rational = Rational(n * r.n, d * r.d)
  def +(x: Int): Rational = this + Rational(x, 1)   // overload pro Int
  def *(x: Int): Rational = this * Rational(x, 1)
  def compare(r: Rational): Int = (n * r.d).compare(r.n * d)
  override def toString = s"$n/$d"

object Rational:
  def apply(n: BigInt, d: BigInt): Rational =
    val g = n.gcd(d)
    new Rational(n / g, d / g)

object RationalConversions:
  given intToRational: Conversion[Int, Rational] with
    def apply(x: Int): Rational = Rational(x, 1)

@main def run() =
  val half = Rational(1, 2)
  println(half + Rational(1, 3))   // +(Rational)
  println(half + 2)                // +(Int) – overload
  import RationalConversions.given
  println(2 * half)                // intToRational(2) * half
  println(half < Rational(2, 3))   // z Ordered
  println(half >= Rational(2, 4))`,
          sources: [
            s(72, 'given intToRational: Conversion[Int, Rational] with'),
            s(75, 'One compare method supplies <, >, <=, and >=.'),
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 6',
          html: '<code>5/6</code> (1/2 + 1/3), <code>5/2</code> (overload <code>+(Int)</code>), <code>1/1</code> (<code>2 * half</code> projde jen díky importované konverzi; bez řádku <code>import RationalConversions.given</code> je to CE), <code>true</code>, <code>true</code> (<code>&lt;</code> a <code>&gt;=</code> dodá <code>Ordered</code> z jediné metody <code>compare</code>).',
          sources: [s(69, 'half + Rational(1, 3)   // 5/6')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Konverze musí být vidět',
          html: '<ul><li><code>given Conversion</code> definovaná v <code>object Conv</code>, ale neimportovaná (<code>import Conv.given</code>) → <code>2 * half</code> je <strong>CE</strong>. Pozor: <code>import Conv.*</code> givens <em>neimportuje</em>, je potřeba <code>.given</code>.</li><li>Bez <code>import scala.language.implicitConversions</code> to ve Scale 3 projde, kompilátor jen vypíše <em>feature warning</em> (ověřeno scala-cli).</li></ul>',
          sources: [s(72, 'import scala.language.implicitConversions')],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Extension metoda místo konverze',
          html: 'Potřebuješ-li jen novou syntaxi, stačí <code>extension (x: Int) def *(r: Rational) = Rational(x, 1) * r</code>; pak <code>2 * half</code> projde a <code>2 * 3</code> dál vrací <code>6</code>. Konverze ať jsou malé a předvídatelné; když by konverze ztrácela informaci, udělej ji explicitní.',
          sources: [
            s(76, 'Use an extension method if you only need new method syntax.'),
            s(76, 'Keep implicit conversions small and predictable.'),
          ],
        },
        { kind: 'quiz', ids: ['ch6-12', 'ch6-13'], title: 'Procvič: operátory a konverze' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-6-8',
      number: '6.8',
      title: 'Type classes (given / using)',
      blocks: [
        {
          kind: 'p',
          html: 'Úkol: uložit <code>Player</code> jako JSON, i sekvence hráčů. <strong>Interface inheritance</strong> (<code>Player extends Jsonable</code>) funguje, ale <code>Player</code> pak závisí na JSONu a musíš měnit jeho zdroják. <strong>Adaptér</strong> zdroják nemění, ale balí každou hodnotu zvlášť. Type class oddělí schopnost od dat úplně.',
          sources: [
            s(79, 'Player now depends on JSON. We must change its source to add this behavior.'),
            s(80, 'The adapter wraps each value.'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Type class pattern',
          html: '<ul><li><strong>Type class</strong> definuje operace: <code>trait Jsonable[T] { def toJSON(x: T): String }</code>.</li><li><strong>Instance</strong> je implementuje pro konkrétní typ: <code>given Jsonable[Player]</code>.</li><li>Generická funkce si schopnost <strong>vyžádá</strong>: <code>(using Jsonable[T])</code>.</li><li>Kompilátor vybere instanci podle <strong>statických typů</strong> a kontextu.</li><li>Hodnota si nechá svůj typ — <strong>žádná konverze na Jsonable</strong> neproběhne.</li><li>Typ i operaci lze přidat bez společné doménové nadtřídy.</li></ul>',
          sources: [
            s(87, 'The compiler selects the instance from the static types and the context.'),
            s(87, 'The value keeps its original type. No conversion to Jsonable takes place.'),
            s(87, 'We can add a type or an operation without a common domain superclass.'),
          ],
        },
        {
          kind: 'code',
          caption: 'Příklad 7: Jsonable[T] s givens, podmíněnou instancí pro Seq a extension syntaxí',
          runnable: true,
          code: `def quote(s: String): String = "\\"" + s + "\\""

trait Jsonable[T]:
  def toJSON(x: T): String

case class Player(name: String, score: Seq[Int]) // nezávisí na JSON

given intJson: Jsonable[Int] = x => x.toString
given stringJson: Jsonable[String] = x => quote(x)
given playerJson: Jsonable[Player] = p =>
  val scores = p.score.mkString("[", ",", "]")
  s"""{"name":\${quote(p.name)},"score":$scores}"""
// podmíněná instance: z Jsonable[T] udělá Jsonable[Seq[T]]
given seqJson[T](using item: Jsonable[T]): Jsonable[Seq[T]] =
  xs => xs.map(item.toJSON).mkString("[", ",", "]")

def save[T](x: T)(using format: Jsonable[T]): Unit =
  println(format.toJSON(x))

extension [T](x: T)
  def toJSON(using format: Jsonable[T]): String = format.toJSON(x)

@main def run() =
  val alice = Player("Alice", Seq(1, 2))
  val bob = Player("Bob", Seq(3, 4))
  val players = Seq(alice, bob)
  save(alice)
  save(players)                     // seqJson(using playerJson)
  save(Seq(Seq(1, 2), Seq(3)))      // seqJson(using seqJson(using intJson))
  save(alice)(using (p: Player) => quote(p.name)) // explicitní instance
  println(bob.toJSON)`,
          sources: [
            s(84, 'given supplies a candidate. using requests an argument of that type.'),
            s(85),
            s(90, 'The syntax feels like a member method.'),
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 7',
          html: '<code>{"name":"Alice","score":[1,2]}</code><br><code>[{"name":"Alice","score":[1,2]},{"name":"Bob","score":[3,4]}]</code><br><code>[[1,2],[3]]</code><br><code>"Alice"</code> (explicitní <code>using</code> přebije given)<br><code>{"name":"Bob","score":[3,4]}</code>',
          sources: [s(88, 'An explicit choice always remains possible.')],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak kompilátor najde instanci (na papíře)',
          html: '<ol><li>Urči <strong>statický</strong> typ argumentu → potřebuji <code>Jsonable[ten typ]</code>.</li><li>Hledej viditelný <code>given</code> přesně tohoto typu (scope, importy <code>X.given</code>, companion objekty).</li><li>Je-li to kontejner (<code>Seq[U]</code>), použij podmíněnou instanci <code>seqJson[U]</code>, která potřebuje <code>Jsonable[U]</code> → opakuj krok 2 rekurzivně.</li><li>Nic / víc stejně dobrých kandidátů → <strong>CE</strong> (ne výjimka za běhu!).</li></ol><code>save(Seq(players))</code>: potřebuju <code>Jsonable[Seq[Seq[Player]]]</code> → <code>seqJson[Seq[Player]]</code> → <code>Jsonable[Seq[Player]]</code> → <code>seqJson[Player]</code> → <code>Jsonable[Player]</code> → <code>playerFormat</code> (v příkladu 7 <code>playerJson</code>). Hledání probíhá při kompilaci, převod na JSON za běhu.',
          sources: [
            s(85, 'The compiler applies the sequence rule recursively until it ﬁnds an instance for each element type.'),
            s(86, 'The search follows types at compile time. JSON conversion takes place at run time.'),
            s(88, 'If no best candidate exists, compilation fails.'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Context bound není dědičnost',
          html: '<code>def save[T: Jsonable](x: T)</code> je zkratka za <code>def save[T](x: T)(using Jsonable[T])</code>; instanci získáš přes <code>summon[Jsonable[T]]</code>. Bound žádá <em>důkaz</em> (instanci), <strong>neříká, že <code>T extends Jsonable[T]</code></strong>. Ve Scale 2 se totéž psalo <code>(implicit …)</code> a <code>implicitly[…]</code>.',
          sources: [
            s(89, 'The bound requests evidence. It does not state that T extends Jsonable[T].'),
            s(89, 'The context bound is shorthand for:'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Instance se vybírá staticky, metoda dynamicky',
          html: 'Virtuální metoda (<code>a.describe</code>) se vybírá podle <strong>runtime</strong> třídy objektu. Instance type classy se vybírá při kompilaci podle <strong>statického</strong> typu výrazu — přesně jako overloading. Proměnná typu <code>Animal</code> obsahující <code>Dog</code> dostane instanci pro <code>Animal</code>.',
          sources: [s(87, 'The compiler selects the instance from the static types and the context.')],
        },
        {
          kind: 'p',
          html: 'Standardní type class: <code>Ordering[T]</code>. <code>players.sorted</code> a <code>players.max</code> použijí <code>given Ordering[Player]</code>, jiný řád předáš explicitně: <code>players.sorted(using byName.reverse)</code>. Řazení tak žije mimo <code>Player</code> a může se lišit pro každé použití (na rozdíl od <code>Ordered</code>, které třída dědí jednou provždy).',
          sources: [s(91, 'We can select a different order for each use.')],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Type class vs. interface inheritance',
          html: '<ul><li><strong>Interface inheritance</strong> (<code>Player extends Jsonable</code>): typ musíš změnit ve zdrojáku; jedna implementace na třídu; výběr za běhu (dynamic dispatch); hodnota <em>je</em> <code>Jsonable</code>.</li><li><strong>Type class</strong> (<code>given Jsonable[Player]</code>): typ zůstane nedotčený (i cizí typy jako <code>Int</code>); víc instancí, volí se importem nebo <code>using</code>; výběr při kompilaci podle statického typu; instance pro kontejnery se skládají z instancí prvků (<code>Seq[T]</code> z <code>T</code>); chybějící instance = CE.</li></ul>',
          sources: [
            s(81, 'Jsonable[T] describes a capability of T. An instance holds the implementation for that type.'),
            s(83, 'An instance for T gives us an instance for Seq[T].'),
          ],
        },
        { kind: 'quiz', ids: ['ch6-14', 'ch6-15', 'ch6-16'], title: 'Procvič: type classes' },
      ],
    },
  ],
}
