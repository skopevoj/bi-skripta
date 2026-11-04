import type { Chapter } from '../types'

export const chap05: Chapter = {
  id: 'chap-5',
  number: '5',
  title: 'Zapouzdření, ADT a pattern matching',
  lecture: 'L5',
  summary:
    'Umět určit, kdo smí volat private/protected člen (a co se pak zkompiluje), poznat únik mutable stavu, vědět, co case class generuje a jak se chová její ==, a spočítat výsledek match včetně pastí: malé písmeno v patternu, pořadí case, guard a type erasure.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-1',
      number: '5.1',
      title: 'Proč zapouzdření: hlídej invariant na jednom místě',
      blocks: [
        {
          kind: 'p',
          html: 'Běžící příklad: rezervace sedadel. S veřejnými poli <code>var capacity</code>, <code>var reserved</code> může kdokoli napsat <code>seats.reserved += 2</code> a přebookovat (volných −1). Kdo je zodpovědný za <code>0 &lt;= reserved &lt;= capacity</code>? Nikdo.',
          sources: [
            { kind: 'slide', doc: 'L5', page: 4, quote: 'Who is responsible for keeping 0 <= reserved <= capacity?' },
          ],
        },
        {
          kind: 'p',
          html: 'Privátní pole + setter s kontrolou rozsahu je jen první krok – každý klient (pokladna, kiosk, skupinová rezervace) si pořád sám implementuje „je místo? tak přičti“. Řešení: <strong>vystavit doménovou operaci</strong> <code>tryReserve</code>, ne úložiště.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 5,
              quote: 'The setter checks a range. Every client still implements booking.',
            },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'SeatPool: invariant hlídá jen tryReserve; úložiště (free) jde vyměnit bez změny klientů',
          code: `final class SeatPool(val capacity: Int):
  require(capacity >= 0)
  private var free = capacity

  def available: Int = free

  def tryReserve(n: Int): Boolean =
    require(n > 0)
    if n > free then false
    else
      free -= n
      true

@main def run() =
  val seats = SeatPool(3)
  println(seats.tryReserve(2))   // true
  println(seats.tryReserve(2))   // false
  println(seats.available)       // 1`,
          sources: [
            { kind: 'slide', doc: 'L5', page: 7, quote: 'The public contract survives a change from reserved to free.' },
            { kind: 'slide', doc: 'L5', page: 8 },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Zapouzdření (encapsulation)',
          html: 'Ohraničit stav tak, aby jej šlo měnit jen přes operace, které zachovávají invariant. Přínosy: <ul><li>chyba je <strong>lokální</strong> – když test selže, hledáš v <code>SeatPool</code>, ne v celé aplikaci,</li><li>implementaci (<code>reserved</code> → <code>free</code>) jde změnit bez změny klientů.</li></ul><code>private</code> je jen mechanismus; návrh je API.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 8,
              quote: 'A small API turns a whole-application problem into a small object-level test.',
            },
            {
              kind: 'slide',
              doc: 'L5',
              page: 26,
              quote: 'A good boundary makes invalid changes hard and implementation changes local.',
            },
          ],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-2',
      number: '5.2',
      title: 'Access modifiery ve Scale',
      blocks: [
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Kdo smí člen použít',
          html: '<ul><li><strong>public</strong> (výchozí, na rozdíl od Javy) – kdokoli; lze přepsat (pokud není <code>final</code>).</li><li><strong>protected</strong> – třída, její companion a podtřídy; lze přepsat (pokud není <code>final</code>). Na rozdíl od Javy <em>stejný package přístup nedává</em>.</li><li><strong>private</strong> – třída a její companion; <strong>nelze přepsat</strong>.</li></ul>Přístupnost a přepisovatelnost jsou dvě samostatná rozhodnutí: <code>protected final</code> = podtřída smí volat, ale ne přepsat.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 9,
              quote: 'Choose the smallest audience. Accessibility and overriding are separate decisions.',
            },
            { kind: 'slide', doc: 'L5', page: 10, quote: 'Scala default (differs from Java)' },
            { kind: 'slide', doc: 'L5', page: 11, quote: 'Unlike Java, sharing a package does not grant access.' },
            { kind: 'slide', doc: 'L5', page: 11, quote: 'allows calls from subclasses but prevents overriding.' },
            { kind: 'slide', doc: 'L5', page: 13, quote: 'Private members are accessible only from' },
          ],
        },
        {
          kind: 'p',
          html: 'Přednáška ukazuje jen „na sobě“ a „zvenku“. Na testu se ale hodí vědět, co platí pro <strong>jinou instanci</strong> – ověřeno ve Scale 3:',
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'private = celá třída (i cizí instance) + companion; protected v podtřídě jen přes referenci typu podtřídy',
          code: `class Super:
  protected def f(): String = "f"
  private def secret(): String = "secret"
  def peek(other: Super): String = other.secret() // jiná instance téže třídy: OK

object Super:
  def spy(s: Super): String = s.secret()          // companion: OK

class Sub extends Super:
  def viaThis(): String = f()                     // OK: na sobě
  def viaSub(o: Sub): String = o.f()              // OK: přes referenci typu Sub
  // def viaSuper(o: Super): String = o.f()       // CE: přes referenci typu Super ne
  // def bad(): String = secret()                 // CE: Not found: secret

@main def run() =
  val s = Sub()
  println(s.viaThis() + " " + s.viaSub(Sub()))    // f f
  println(s.peek(Super()) + " " + Super.spy(s))   // secret secret
  // println(s.f())                               // CE: protected zvenku`,
          sources: [
            { kind: 'slide', doc: 'L5', page: 11 },
            { kind: 'slide', doc: 'L5', page: 13 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'protected přes referenci typu nadtřídy',
          html: 'Uvnitř <code>Sub</code> smíš volat <code>f()</code> na sobě a na libovolném <code>o: Sub</code>, ale <strong>ne</strong> na <code>o: Super</code> – překladač: <em>„protected method f can only be accessed from class Sub or one of its subclasses“</em>. Důvod: <code>o</code> může být úplně jiná podtřída <code>Super</code>, do které <code>Sub</code> nemá co mluvit.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'private[this] ve Scale 3',
          html: 'Ve Scale 2 <code>private[this]</code> omezilo přístup jen na <code>this</code>. Scala 3.9 kvalifikátor <code>[this]</code> <strong>ignoruje</strong> (warning „Ignoring [this] qualifier“) – chová se jako obyčejné <code>private</code>, takže <code>o.x</code> na jiné instanci projde.',
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Přístupnost a override',
          html: '<ul><li><strong>protected → public</strong>: override bez modifikátoru je <em>public</em>. <code>Sub().f()</code> projde, ale přes statický typ <code>Super</code> je <code>f</code> pořád protected (<code>val s: Super = Sub(); s.f()</code> = CE).</li><li><strong>public → protected</strong> (zúžení) nejde: <em>„weaker access privileges; it should be public“</em>.</li><li><strong>private nejde přepsat</strong>: <code>override def f</code> nad privátní <code>f</code> = CE <em>„method f overrides nothing“</em>.</li><li>Bez <code>override</code> se metoda stejného jména zkompiluje – je to <strong>nová, nesouvisející</strong> metoda. Kód v nadtřídě dál volá svou privátní verzi.</li></ul>',
          code: `class Super:
  protected def f(): String = "parent"

class Sub extends Super:
  override def f(): String = "child"   // bez modifikátoru = public

@main def run() =
  println(Sub().f())     // child
  val s: Super = Sub()
  // println(s.f())      // CE: přes statický typ Super je f protected`,
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 12,
              quote: 'The override is public by default. The parent declaration is still protected.',
            },
            { kind: 'slide', doc: 'L5', page: 14, quote: 'it cannot override a private method!' },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'private + metoda stejného jména',
          html: '<code>Account.total</code> volá privátní <code>fee</code>. <code>Premium</code> definuje vlastní <code>fee</code> bez <code>override</code>. Výsledek: <code>p.fee()</code> = 0 (nová metoda), ale <code>p.total(100)</code> = 110 – <code>total</code> volá privátní <code>Account.fee</code>, žádný dynamic dispatch. S <code>override</code> by to byla chyba překladu.',
          code: `class Account:
  private def fee(): Int = 10
  def total(x: Int): Int = x + fee()

class Premium extends Account:
  def fee(): Int = 0     // nová metoda, NE override

@main def run() =
  val p = Premium()
  println(p.fee())       // 0
  println(p.total(100))  // 110`,
        },
        { kind: 'quiz', ids: ['ch5-01', 'ch5-02', 'ch5-03'], title: 'Ověř si: access modifiery' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-3',
      number: '5.3',
      title: 'Únik stavu, immutabilita a řízená konstrukce',
      blocks: [
        {
          kind: 'p',
          html: '<code>private</code> referenci nestačí, pokud ukazuje na <strong>mutable</strong> objekt. Stav uteče dvěma cestami (aliasy):<ul><li><strong>input alias</strong> – volající si nechá odkaz na objekt, který předal do konstruktoru, a pak ho změní,</li><li><strong>output alias</strong> – getter vrátí odkaz na vnitřní objekt a volající ho změní.</li></ul>Obě mutace obejdou objekt i jeho <code>require</code>.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 15,
              quote: 'Both mutations bypass the object. The start is now after the end.',
            },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Defensive copies: kopíruj na vstupu i na výstupu (java.util.Date je mutable)',
          code: `import java.util.Date

final class LeakyWindow(private val start: Date, private val end: Date):
  require(start.before(end))
  def startsAt: Date = start
  def isValid: Boolean = start.before(end)

final class SafeWindow(start: Date, end: Date):
  private val from = new Date(start.getTime)    // kopie na vstupu
  private val until = new Date(end.getTime)
  require(from.before(until))                   // validuj až kopie
  def startsAt: Date = new Date(from.getTime)   // kopie na výstupu
  def isValid: Boolean = from.before(until)

@main def run() =
  val s1 = new Date(0)
  val leaky = LeakyWindow(s1, new Date(1000))
  s1.setTime(2000)                   // input alias
  println(leaky.isValid)             // false – invariant rozbit zvenku

  val s2 = new Date(0)
  val safe = SafeWindow(s2, new Date(1000))
  s2.setTime(2000)                   // mění jen vstup
  safe.startsAt.setTime(3000)        // mění jen kopii
  println(safe.isValid)              // true`,
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 16,
              quote: 'Copy on entry and on exit. Validate the copies that the object owns.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Immutable hodnoty se dají sdílet bezpečně',
          html: 'Lepší než kopírovat je použít <strong>immutable</strong> typ (<code>java.time.Instant</code> místo <code>Date</code>): „změna“ vytvoří novou hodnotu, sdílená reference nemůže okno změnit. Pak stačí <code>val</code> pole a žádné kopie.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 17,
              quote: 'Instant creates new values. Sharing these references cannot change the window.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Getter kolekce obchází validaci',
          html: 'Getter, který vrací vnitřní <code>ArrayBuffer</code>, dovolí volajícímu přeskočit <code>add</code> i jeho <code>require</code>. Vrátit <code>members.toVector</code> je jen <strong>mělká</strong> oprava: Vector změnit nejde, ale jeho prvky (<code>Role</code> s <code>var active</code>) ano. Plná oprava: immutable kontejner <em>i</em> immutable prvky – pak všechny změny členství jdou přes <code>Team</code>.',
          code: `import scala.collection.mutable.ArrayBuffer

final class Role(val name: String, var active: Boolean)

final class Team:
  private val members = ArrayBuffer.empty[Role]
  def add(role: Role): Unit =
    require(role.active)
    members += role
  def roles: ArrayBuffer[Role] = members   // vrací vnitřní buffer!

@main def run() =
  val team = Team()
  team.roles += Role("guest", false)   // obejde add i require
  println(team.roles.size)             // 1
  println(team.roles.head.active)      // false`,
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 18,
              quote: 'Policy: every member is active. The getter lets callers skip add.',
            },
            { kind: 'slide', doc: 'L5', page: 19, quote: 'The Vector cannot change. Its Role objects can still change.' },
            {
              kind: 'slide',
              doc: 'L5',
              page: 20,
              quote: 'The container and its elements are immutable. All membership changes go through Team.',
            },
          ],
        },
        {
          kind: 'p',
          html: '<strong>Řízená konstrukce přes companion.</strong> Privátní konstruktor + factory v companion objektu = jediný vstupní bod je validovaný. Kdo dostane <code>Percentage</code>, může se spolehnout na <code>0 &lt;= value &lt;= 100</code> a validaci neopakuje.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 21,
              quote: 'A private constructor makes the validated factory the entry point.',
            },
            { kind: 'slide', doc: 'L5', page: 22, quote: 'It does not repeat validation.' },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Companion jako jediný vstupní bod (apply vrací Option)',
          code: `final class Percentage private (val value: Int)

object Percentage:
  def apply(n: Int): Option[Percentage] =
    if 0 <= n && n <= 100 then Some(new Percentage(n))
    else None

def discount(price: BigDecimal, p: Percentage): BigDecimal =
  price * (100 - p.value) / 100

@main def run() =
  println(Percentage(25).map(p => discount(BigDecimal(200), p)))   // Some(150)
  println(Percentage(150).map(p => discount(BigDecimal(200), p)))  // None
  // new Percentage(150)            // CE: private constructor
  // val p: Percentage = Percentage(50)  // CE: apply vrací Option[Percentage]`,
          sources: [{ kind: 'slide', doc: 'L5', page: 21 }, { kind: 'slide', doc: 'L5', page: 22 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Cohesion a coupling na rezervacích',
          html: '<strong>Cohesion</strong> – jak moc k sobě patří prvky uvnitř modulu. <strong>Coupling</strong> – vzájemná závislost modulů. Cíl: vysoká cohesion, nízký coupling.<br>API A (<code>reserved</code>, <code>reserved_=</code>, <code>records: ArrayBuffer</code>) vs. API B (<code>available</code>, <code>tryReserve</code>, <code>bookings: Iterator</code>): B je lepší – stav nemůže zneplatnit nikdo zvenku, a když se změní úložiště, klienti se měnit nemusí. <code>SeatPool</code> drží stav i pravidlo pohromadě (high cohesion), pokladna zná jen <code>tryReserve</code>/<code>available</code> (low coupling).',
          sources: [
            { kind: 'slide', doc: 'L5', page: 25, quote: 'how much elements inside a module belong together?' },
            { kind: 'slide', doc: 'L5', page: 25, quote: 'what is the interdependence between modules?' },
            { kind: 'slide', doc: 'L5', page: 23, quote: 'Which callers must change when storage changes?' },
            {
              kind: 'slide',
              doc: 'L5',
              page: 24,
              quote: 'Keep each rule behind one boundary; expose the smallest useful contract.',
            },
          ],
        },
        { kind: 'quiz', ids: ['ch5-05', 'ch5-06'], title: 'Ověř si: únik stavu a konstrukce' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-4',
      number: '5.4',
      title: 'Case classes: hodnotová sémantika zadarmo',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Co case class vygeneruje',
          html: 'Pro <code>case class Payment(amount: BigDecimal, currency: String)</code>:<ul><li>parametry jsou automaticky <code>val</code> (veřejná pole),</li><li><code>equals</code>/<code>hashCode</code> podle polí → <strong>hodnotová rovnost</strong>,</li><li><code>toString</code> → <code>Payment(120,CZK)</code>,</li><li><code>copy</code> s pojmenovanými parametry (vytvoří novou hodnotu),</li><li>companion s <code>apply</code> (factory, bez <code>new</code>) a <code>unapply</code> (extractor pro pattern matching),</li><li><code>product*</code> metody (<code>productArity</code>…).</li></ul>Case class je scalovská „product“ část ADT. Doporučení: immutable a <code>final</code>.',
          sources: [
            { kind: 'slide', doc: 'L5', page: 30, quote: 'The val keyword is implicit in case classes' },
            { kind: 'slide', doc: 'L5', page: 30, quote: "Scala's take on product part of Algebraic Data Types" },
            { kind: 'slide', doc: 'L5', page: 30 },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Case class v akci',
          code: `final case class Payment(amount: BigDecimal, currency: String)

@main def run() =
  val a = Payment(BigDecimal(120), "CZK")   // bez new: generovaný apply
  val b = Payment(BigDecimal(120), "CZK")
  println(a == b)                    // true  – equals podle polí
  println(a eq b)                    // false – dva různé objekty
  println(a.hashCode == b.hashCode)  // true
  println(a)                         // Payment(120,CZK)
  val corrected = a.copy(amount = BigDecimal(150))
  println(corrected)                 // Payment(150,CZK)
  println(a.amount)                  // 120 – originál se nezměnil
  a match
    case Payment(amt, cur) => println(s"$amt $cur")   // 120 CZK (unapply)`,
          sources: [{ kind: 'slide', doc: 'L5', page: 29, quote: 'copy creates a new value.' }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Obyčejná třída: == porovnává reference',
          html: '<code>class Payment(val amount: BigDecimal, val currency: String)</code> bez <code>case</code> dědí <code>equals</code> z <code>AnyRef</code> → <code>Payment(…) == Payment(…)</code> se stejnými poli je <strong>false</strong>, v <code>Set</code> jsou dva prvky a <code>toString</code> je <code>Payment@1b2c3d</code>. <br>Pozor, slajd 28 u obyčejné třídy píše <code>a == b // true</code> – scala-cli vypíše <code>false</code>. Slajd ukazuje, jak by se rovnost hodnoty <em>měla</em> chovat; to dodá až <code>case</code>.',
          sources: [{ kind: 'slide', doc: 'L5', page: 28, quote: 'A plain class does not generate that API.' }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Generované metody vidí jen parametry konstruktoru',
          html: '<ul><li>Pole v <strong>těle</strong> (<code>var logins = 0</code>) se do <code>equals</code>, <code>hashCode</code>, <code>toString</code> ani <code>copy</code> nepočítá – <code>copy()</code> ho resetuje na výchozí hodnotu.</li><li><code>==</code> polí se deleguje: pole typu <code>Array</code> má referenční rovnost → dvě case class se stejným obsahem pole nejsou rovny. Používej immutable typy polí (<code>List</code>, <code>Vector</code>).</li><li><code>copy</code> je mělká – sdílí reference na vnořené objekty.</li><li>Case class s <code>private</code> konstruktorem má ve Scale 3 privátní i <code>apply</code> a <code>copy</code> (<code>Even(3)</code> zvenku = CE).</li></ul>',
          sources: [{ kind: 'slide', doc: 'L5', page: 29 }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'unapply ve Scale 3',
          html: 'Slajd 30 ukazuje <code>unapply(c): Option[(BigDecimal, String)]</code> – to je podoba ze Scaly 2. Scala 3 pro case class generuje <code>unapply(x: Payment): Payment</code> (vrátí sám objekt, pattern pak čte jeho pole). Pro pattern matching je to jedno.',
          sources: [{ kind: 'slide', doc: 'L5', page: 30 }],
        },
        {
          kind: 'p',
          html: '<strong>Kdy data, kdy objekt.</strong> Case class / ADT použij, když je tvar dat sám kontraktem a volající ho potřebují zkoumat (zprávy, výsledky, konfigurace, snapshoty). Objekt (trait s operacemi) použij, když je kontraktem chování a reprezentace se má skrýt (repository, session, spojení). Kombinují se: repository může ukládat a vracet immutable <code>Payment</code>.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 42,
              quote: 'Choose case classes and ADTs when exposing the cases and',
            },
            {
              kind: 'slide',
              doc: 'L5',
              page: 43,
              quote: 'Combine them: a repository object can store and return immutable Payment values.',
            },
            {
              kind: 'slide',
              doc: 'L5',
              page: 74,
              quote: 'Objects protect operations; case classes and ADTs expose useful information.',
            },
          ],
        },
        { kind: 'quiz', ids: ['ch5-07', 'ch5-08', 'ch5-09'], title: 'Ověř si: case classes' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-5',
      number: '5.5',
      title: 'Modelování dat: product vs. sum',
      blocks: [
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Product, nebo sum?',
          html: '<ul><li><strong>Product</strong> (case class) – nezávislá fakta, která platí <em>současně</em>: <code>Notifications(email: Boolean, sms: Boolean)</code>.</li><li><strong>Sum</strong> (<code>enum</code> / <code>sealed trait</code>) – vybrána je <em>právě jedna</em> alternativa: <code>enum Channel { case Email, Sms }</code>.</li></ul>Každá varianta sumy nese jen pole, která potřebuje → nekompatibilní kombinace (expresní osobní odběr, kurýr bez adresy) jsou nereprezentovatelné.',
          sources: [
            {
              kind: 'slide',
              doc: 'L5',
              page: 32,
              quote: 'Use a product for independent choices; use a sum when exactly one alternative is selected.',
            },
            { kind: 'slide', doc: 'L5', page: 33, quote: 'The variants rule out incompatible' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Option pole a Boolean příznaky',
          html: '<code>case class Order(id, paymentId: Option[String], tracking: Option[String], cancelled: Boolean)</code> se zkompiluje i pro objednávku s trackingem bez platby nebo „odeslanou a zároveň zrušenou“. Product připouští kombinace, které doména zakazuje. Řešení: sum stavů, kde každý stav nese přesně svá fakta.',
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
          kind: 'code',
          runnable: true,
          caption: 'Stavy objednávky jako enum; přechody jako funkce s typy jednotlivých case',
          code: `final case class OrderId(value: String)
final case class PaymentId(value: String)
final case class TrackingCode(value: String)

enum Order:
  case Draft(id: OrderId)
  case Paid(id: OrderId, payment: PaymentId)
  case Shipped(id: OrderId, payment: PaymentId, tracking: TrackingCode)
  case Cancelled(id: OrderId)

def pay(d: Order.Draft, p: PaymentId): Order.Paid =
  Order.Paid(d.id, p)
def dispatch(p: Order.Paid, t: TrackingCode): Order.Shipped =
  Order.Shipped(p.id, p.payment, t)

def status(o: Order): String = o match
  case Order.Draft(id)         => s"\${id.value}: rozpracovaná"
  case Order.Paid(id, _)       => s"\${id.value}: zaplacená"
  case Order.Shipped(id, _, t) => s"\${id.value}: odeslaná (\${t.value})"
  case Order.Cancelled(id)     => s"\${id.value}: zrušená"

@main def run() =
  val draft: Order.Draft = Order.Draft(OrderId("o1"))
  val shipped = dispatch(pay(draft, PaymentId("p8")), TrackingCode("CZ123"))
  println(status(draft))     // o1: rozpracovaná
  println(status(shipped))   // o1: odeslaná (CZ123)
  // dispatch(draft, TrackingCode("X"))   // CE: Found Order.Draft, Required Order.Paid
  // val p: PaymentId = OrderId("o1")     // CE: jiný význam = jiný typ`,
          sources: [
            { kind: 'slide', doc: 'L5', page: 36 },
            { kind: 'slide', doc: 'L5', page: 37, quote: 'These signatures restrict inputs. Protect the application boundary' },
            { kind: 'slide', doc: 'L5', page: 34, quote: 'Products group facts. Wrappers separate meanings;' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Enum case se rozšíří na typ enumu',
          html: '<code>val draft = Order.Draft(OrderId("o1"))</code> má typ <code>Order</code>, ne <code>Order.Draft</code> – Scala 3 výsledek <code>apply</code> u enum case rozšíří na typ celého enumu. <code>pay(draft, …)</code> pak hlásí <em>Found: Order, Required: Order.Draft</em>. Proto slajd (i kód výše) píše typ explicitně: <code>val draft: Order.Draft = …</code>.',
          sources: [{ kind: 'slide', doc: 'L5', page: 37 }],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Wrappery</strong> (<code>OrderId</code>, <code>PaymentId</code>) oddělí významy: <code>val p: PaymentId = OrderId("o1")</code> je chyba překladu.',
            '<strong>Hodnota vs. identita:</strong> <code>old.copy(total = …) == old</code> je <code>false</code>, ale může jít o tutéž objednávku – identitu modeluj explicitně (<code>id</code>).',
            '<strong>Absence:</strong> <code>Option</code> použij, když „je/není“ je celé rozlišení. Když <code>None</code> může znamenat „načítá se“, „neexistuje“ nebo „selhalo“, pojmenuj každý případ v enumu.',
            '<strong>Kolekce jsou doménové rozhodnutí:</strong> <code>Option</code> 0–1, <code>Vector</code> uspořádaná 0+, <code>Set</code> bez duplicit, <code>Map</code> nejvýš jedna hodnota na klíč, <code>NonEmpty(head, tail)</code> aspoň jeden prvek.',
          ],
          sources: [
            { kind: 'slide', doc: 'L5', page: 34 },
            {
              kind: 'slide',
              doc: 'L5',
              page: 38,
              quote: 'A changed snapshot may represent the same entity. Model its identity explicitly.',
            },
            { kind: 'slide', doc: 'L5', page: 39, quote: 'Use Option when absent/present is the complete distinction.' },
            {
              kind: 'slide',
              doc: 'L5',
              page: 40,
              quote: 'Ordering, duplicates and emptiness are domain decisions. Encode them deliberately.',
            },
          ],
        },
        { kind: 'quiz', ids: ['ch5-04'], title: 'Ověř si: modelování' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-5-6',
      number: '5.6',
      title: 'Pattern matching',
      blocks: [
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak vyhodnotit match na papíře',
          html: '<ol><li>Zkoušej case <strong>shora dolů</strong>; vyhraje <strong>první</strong>, který pasuje (další se už nezkoušejí).</li><li>Case pasuje, když sedí tvar <em>a</em> guard (<code>if …</code>) je true.</li><li>Nepasuje-li nic → za běhu <code>scala.MatchError</code>.</li><li>Malé písmeno v patternu = <strong>nová proměnná</strong> (chytí vše). Velké písmeno nebo <code>`backticky`</code> = <strong>porovnání</strong> s existující hodnotou.</li><li>Type pattern <code>x: T</code> pasuje i na podtypy <code>T</code>; typové argumenty (<code>List[String]</code>) se za běhu neověří.</li></ol>',
          sources: [
            { kind: 'slide', doc: 'L5', page: 72, quote: 'Patterns test shape and bind names.' },
            { kind: 'slide', doc: 'L5', page: 72, quote: 'Cases run from top to bottom.' },
            { kind: 'slide', doc: 'L5', page: 72, quote: 'Guards can leave cases uncovered.' },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Match na hodnoty, typy, seznamy a ADT (výraz z case study kalkulačky)',
          code: `enum Expr:
  case Num(value: Double)
  case Var(name: String)
  case Add(left: Expr, right: Expr)
  case Mul(left: Expr, right: Expr)
import Expr.*

def eval(e: Expr, env: Map[String, Double]): Double = e match
  case Num(n)    => n
  case Var(name) => env(name)
  case Add(l, r) => eval(l, env) + eval(r, env)
  case Mul(l, r) => eval(l, env) * eval(r, env)

def describe(x: Any): String = x match
  case 5         => "five"            // hodnota
  case "hello"   => "hi!"
  case n: Int    => s"Int: $n"        // typ
  case s: String => s"String: $s"
  case Nil       => "the empty list"
  case _         => "something else"

def sum(xs: List[Int]): Int = xs match
  case Nil          => 0
  case head :: tail => head + sum(tail)

@main def run() =
  println(describe(5))        // five
  println(describe(7))        // Int: 7
  println(describe("abc"))    // String: abc
  println(describe(Nil))      // the empty list
  println(describe(2.5))      // something else
  println(sum(List(1, 2, 3))) // 6
  val expr = Add(Mul(Var("x"), Var("y")), Mul(Num(2), Num(3)))
  println(eval(expr, Map("x" -> 10.0, "y" -> 4.0)))   // 46.0
  expr match
    case Add(left @ Mul(_, _), _) => println(s"left = $left")
    case _                        => println("jiný tvar")`,
          sources: [
            { kind: 'slide', doc: 'L5', page: 46 },
            { kind: 'slide', doc: 'L5', page: 47 },
            { kind: 'slide', doc: 'L5', page: 53, quote: 'In a pattern, head :: tail extracts a nonempty list.' },
            { kind: 'slide', doc: 'L5', page: 61, quote: 'name @ pattern keeps the matched value as well as testing its structure.' },
            { kind: 'slide', doc: 'L5', page: 62 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Guard a exhaustivita: warning, ne chyba',
          html: 'Pro uzavřené typy (<code>sealed trait</code>, <code>enum</code>, <code>Option</code>) překladač kontroluje úplnost. Neúplný match je ale jen <strong>warning</strong> („match may not be exhaustive. It would fail on pattern case: Some(_)“) – kód se zkompiluje a na nepokrytém vstupu spadne na <code>MatchError</code>. Guard nepokrývá svůj tvar celý: <code>case Some(n) if n &gt; 10</code> nechá <code>Some(5)</code> nepokryté. U obyčejného (ne-sealed) traitu překladač nevaruje vůbec.',
          code: `def onOption(x: Option[Int]): String = x match
  case Some(n) if n > 10 => s"has value $n > 10"
  case None => "no value"

onOption(Some(11))   // "has value 11 > 10"
onOption(Some(5))    // scala.MatchError: Some(5)`,
          sources: [
            { kind: 'slide', doc: 'L5', page: 49, quote: 'match may not be exhaustive.' },
            { kind: 'slide', doc: 'L5', page: 50, quote: 'Prefer explicit ADT cases: a catch-all can hide a newly added variant.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Stable identifier vs. variable pattern (klasika!)',
          html: '<code>case Some(A)</code> s velkým <code>A</code> porovná hodnotu s konstantou <code>A</code>. <code>case Some(limit)</code> s malým písmenem <strong>vytvoří novou proměnnou</strong> <code>limit</code>, která zastíní vnější a chytí cokoli – všechny další <code>Some</code> case jsou nedosažitelné (překladač: „Unreachable case“). Chceš-li porovnat s proměnnou psanou malým písmenem, dej ji do backticků.',
          code: `def withConst(x: Option[Int]): String =
  val A = 10
  x match
    case Some(A) => "has value 10"            // porovná s A
    case Some(a) => s"has some other value $a"
    case None    => "no value"

def trap(x: Option[Int]): String =
  val limit = 10
  x match
    case Some(limit) => s"chyceno $limit"     // NOVÁ proměnná – chytí každé Some
    case _           => "jen None"

def fixed(x: Option[Int]): String =
  val limit = 10
  x match
    case Some(\`limit\`) => "has value 10"     // backticky = porovnání
    case _             => "jiné"

@main def run() =
  println(withConst(Some(10)))   // has value 10
  println(withConst(Some(11)))   // has some other value 11
  println(trap(Some(3)))         // chyceno 3
  println(fixed(Some(3)))        // jiné`,
          sources: [{ kind: 'slide', doc: 'L5', page: 51, quote: 'case Some(A) => "has value 10"' }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Pattern matching a subtyping',
          html: 'Type pattern pasuje i na podtypy, takže obecný case nahoře „spolkne“ specifičtější case pod ním. <code>a</code> je <code>C</code>, ale první varianta vrátí 1 (case <code>B</code> a <code>C</code> jsou „Unreachable“). Pořadí od nejspecifičtějšího vrátí 3.',
          code: `class A
class B extends A
class C extends B

@main def run() =
  val a: A = C()
  val r1 = a match
    case _: A => 1
    case _: B => 2      // Warning: Unreachable case
    case _: C => 3      // Warning: Unreachable case
  val r2 = a match
    case _: C => 3
    case _: B => 2
    case _: A => 1
  println(r1)   // 1
  println(r2)   // 3`,
          sources: [{ kind: 'slide', doc: 'L5', page: 52 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Type erasure v patternech',
          html: 'Typové argumenty za běhu neexistují (type erasure). <code>case _: List[String]</code> se přeloží na „je to <code>List</code>?“ s <em>unchecked</em> warningem – a matchne i <code>List(1, 2)</code>. Spolehlivě jde testovat jen třída (<code>List[?]</code>), případně jednotlivé prvky (<code>case Some(s: String)</code>).',
          code: `def isStrings(x: Any): Boolean = x match
  case _: List[String] => true    // unchecked warning
  case _               => false

@main def run() =
  println(isStrings(List("a")))    // true
  println(isStrings(List(1, 2)))   // true (!)
  println(isStrings(Vector("a")))  // false – není to List`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 78, quote: 'Type erasure removes generic type arguments at runtime (Java, Scala).' },
            { kind: 'wiki', label: 'Zkouška 23. 1. 2026 (match na _: List[String])', page: 'oop_zkouska_2026-01-23' },
          ],
        },
        {
          kind: 'p',
          html: 'Case bloky jsou i funkce: <code>counts.map { case (name, n) =&gt; … }</code> rozloží dvojici, <code>collect { case … if … }</code> filtruje a transformuje zároveň, <code>for case (name, Some(n)) &lt;- rows</code> nepasující řádky přeskočí. Tam je „nepasuje“ záměrné filtrování, ne chyba.',
          sources: [
            { kind: 'slide', doc: 'L5', page: 55, quote: 'The expected type determines the function.' },
            { kind: 'slide', doc: 'L5', page: 57 },
            { kind: 'slide', doc: 'L5', page: 58 },
          ],
        },
        {
          kind: 'quiz',
          ids: ['ch5-10', 'ch5-11', 'ch5-12', 'ch5-13', 'ch5-14'],
          title: 'Ověř si: pattern matching',
        },
      ],
    },
  ],
}
