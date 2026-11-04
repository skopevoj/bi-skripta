import type { Chapter } from '../types'

// Chapter 2 — Lecture 2 "Subtyping polymorphism".
// All runnable code and every claimed output/compile error was verified with scala-cli (Scala 3.9.0).

export const chap02: Chapter = {
  id: 'chap-2',
  number: '2',
  title: 'Subtyping polymorphism: dispatch, overloading, overriding',
  lecture: 'L2',
  summary:
    'Po této kapitole umíš na papíře mechanicky vyřešit „Co to vypíše?“ s overloadingem, overridingem, this a super (včetně odpovědi „nezkompiluje se“) a víš, jaké typy parametrů a návratu smí mít override a co říká LSP.',
  sections: [
    // =====================================================================
    {
      id: 'sec-2-1',
      number: '2.1',
      title: 'Objekty a třídy – minimum pro test',
      blocks: [
        {
          kind: 'p',
          html: 'Objekt má <strong>stav</strong> (pole), <strong>chování</strong> (metody) a <strong>identitu</strong>. Dva objekty se stejným stavem jsou pořád dva různé objekty: <code>a eq b</code> porovnává identitu (stejná reference).',
          sources: [{ kind: 'slide', doc: 'L2', page: 3, quote: 'A object has state, behavior, and identity' }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Parametr konstruktoru vs. člen',
          html: `<ul>
<li><code>class C(x: Int)</code> – <code>x</code> je jen <strong>vstup konstruktoru</strong>, viditelný uvnitř třídy. <code>c.x</code> zvenku → CE.</li>
<li><code>class C(val x: Int)</code> – veřejný <strong>read-only</strong> člen. <code>c.x</code> OK, <code>c.x = 5</code> → CE.</li>
<li><code>class C(var x: Int)</code> – veřejný člen <strong>i se setterem</strong>. <code>c.x = 5</code> OK.</li>
<li><code>private var count</code> v těle – stav, ke kterému zvenku (ani z podtřídy) nepřistoupíš.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 5, quote: 'init: constructor input, available inside the' },
            { kind: 'slide', doc: 'L2', page: 4, quote: 'val step exposes a read-only member.' },
            { kind: 'slide', doc: 'L2', page: 5, quote: 'A constructor parameter declared var also' },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Konstrukce spouští tělo třídy</strong>: inicializace polí a příkazy (např. <code>println</code>) v těle běží shora dolů při každém <code>new</code>/<code>C(...)</code>. Těla metod běží až při zavolání.',
            '<strong><code>val</code> fixuje referenci, ne objekt</strong>: <code>val a = Counter(); a.inc()</code> je OK (objekt je mutable), ale <code>a = Counter()</code> je CE. Přiřazení <code>var b = a</code> zkopíruje referenci – oba ukazují na tentýž objekt.',
            '<strong><code>object X</code></strong> = jediná pojmenovaná instance (singleton). Se stejným jménem jako třída je to <em>companion object</em>; slouží jako místo pro „statické“ věci (továrny, sdílené hodnoty).',
            'Ve Scale 3 lze u tříd vynechat <code>new</code>: <code>Counter()</code> = <code>new Counter()</code>.',
          ],
          sources: [
            { kind: 'slide', doc: 'L2', page: 8, quote: 'Field initializers and statements run in source' },
            { kind: 'slide', doc: 'L2', page: 9, quote: 'Assignment copies a reference, not the object.' },
            { kind: 'slide', doc: 'L2', page: 10, quote: 'object is placeholder for static items' },
            { kind: 'slide', doc: 'L2', page: 7, quote: 'For this class, Scala 3 allows omitting new.' },
          ],
        },
        {
          kind: 'code',
          caption: 'Továrna v companion objectu vytváří pokaždé nový objekt, sdílená hodnota je jedna.',
          runnable: true,
          code: `class Counter(init: Int = 0, val step: Int = 1):
  private var count: Int = init
  def get: Int = count

object Counter:
  def zero(): Counter = new Counter()
  val SharedCounter = new Counter()

@main def run() =
  val a = Counter.zero()
  val b = Counter.zero()
  println(a eq b)                                         // false
  println(Counter.SharedCounter eq Counter.SharedCounter) // true`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 10, quote: 'Calling its factory can still create many Counters.' },
          ],
        },
        { kind: 'quiz', ids: ['ch2-01', 'ch2-02'], title: 'Ověř si: objekty' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-2',
      number: '2.2',
      title: 'Statický a dynamický typ, this a super',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Statický vs. dynamický (runtime) typ',
          html: `V <code>val c: Counter = DoubleCounter()</code>:
<ul>
<li><strong>statický typ</strong> <code>c</code> = <code>Counter</code> – to, co je napsané u proměnné/parametru (nebo co kompilátor odvodil). Zná ho kompilátor.</li>
<li><strong>runtime třída</strong> = <code>DoubleCounter</code> – co se skutečně vytvořilo. Pozná se až za běhu.</li>
</ul>
Upcast mění jen „pohled“, objekt je pořád tentýž (<code>c eq d</code> je <code>true</code>).`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 15, quote: 'Upcasting changes the view, not the object.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Kdo co rozhoduje',
          html: `<ul>
<li><strong>Statický typ</strong> rozhoduje, <em>jaké metody smíš zavolat</em> (a který overload). Metoda, která ve statickém typu není → CE.</li>
<li><strong>Runtime třída příjemce</strong> rozhoduje, <em>které tělo (override) se spustí</em>.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 15, quote: 'The static type controls which members are' },
            { kind: 'slide', doc: 'L2', page: 15, quote: 'The runtime receiver selects an overridden body.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'this je dynamické, super je statické',
          html: `<ul>
<li><code>this.m()</code> – a stejně tak holé <code>m()</code> – je normální virtuální volání na <strong>tentýž objekt</strong>. I když je kód napsaný v předkovi, spustí se override z runtime třídy objektu.</li>
<li><code>super.m()</code> je pevně dané už při překladu: implementace <code>m</code> nejblíž <strong>nad třídou, ve které je ten kód napsaný</strong> (ne nad runtime třídou!). Pokud ji přímý předek nemá, jde se dál nahoru.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
            { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
          ],
        },
        {
          kind: 'code',
          caption: 'Kvíz ze slidů: c.get po c.inc() a po c.twice().',
          runnable: true,
          code: `class Counter:
  private var count: Int = 0
  def get: Int = count
  def inc(): Unit = count += 1
  def twice(): Unit =
    this.inc()
    this.inc()

class DoubleCounter extends Counter:
  override def inc(): Unit =
    super.inc()
    super.inc()

@main def run() =
  val c: Counter = new DoubleCounter
  c.inc()
  println(c.get) // 2
  c.twice()
  println(c.get) // 6`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 17,
              quote: 'what is the value of c.get() after the subsequent c.twice()?',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'this.inc() uvnitř předka volá override podtřídy',
          html: '<code>twice</code> je napsané v <code>Counter</code>, ale <code>this.inc()</code> jde na <code>DoubleCounter.inc</code> (+2). Takže <code>twice</code> přičte 4, ne 2: 2 → 6. V Scale/Javě neexistuje běžná syntaxe, jak z <code>twice</code> „natvrdo“ zavolat <code>Counter.inc</code>, dokud jde přepsat (řešení: <code>final</code>, <code>private</code> nebo privátní pomocná metoda).',
          sources: [
            { kind: 'slide', doc: 'L2', page: 17 },
            {
              kind: 'slide',
              doc: 'L4',
              page: 5,
              quote: 'No ordinary source syntax selects Counter.inc() if it remains overridable.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Super řetěz + this (warm-up Q2–Q4 z L4)',
          html: `<code>x.f</code> s runtime třídou <code>B</code>: <code>B.f</code> = <code>super.f * this.g</code> = <code>A.f</code> (7) × <code>B.g</code> (5) = <strong>35</strong> – nezáleží, jestli je <code>x</code> typu <code>A</code> nebo <code>B</code>.<br>
Přidáme <code>class C extends B { override def g = 6 }</code> a <code>val x: B = C()</code>: <code>f</code> se bere z <code>B</code> (C ho nepřepisuje), <code>super.f</code> = 7, ale <code>this.g</code> je teď <code>C.g</code> = 6 → <strong>42</strong>.`,
          code: `class A:
  def f: Int = 7
  def g: Int = 2

class B extends A:
  override def f: Int = super.f * this.g
  override def g: Int = 5`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 11 },
            { kind: 'slide', doc: 'L4', page: 12 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'f = f * g → StackOverflowError (zkompiluje se!)',
          html: 'Když v <code>B</code> napíšeš <code>override def f: Int = f * g</code> (bez <code>super</code>), <code>f</code> volá samo sebe (<code>this.f</code> → zase <code>B.f</code>) → nekonečná rekurze → za běhu <code>StackOverflowError</code>. Je to chyba za běhu, ne CE – kompilátor (Scala 3.9) to ani nevaruje.',
          sources: [{ kind: 'slide', doc: 'L4', page: 9 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'private a final = statický dispatch',
          html: `Volání <code>private</code> a <code>final</code> metod (a metod z <code>object</code>) má pevný cíl. Metoda se stejným jménem v podtřídě <strong>nepřepisuje</strong> private metodu předka – je to úplně nová metoda (proto ani nepotřebuje <code>override</code>) a volání uvnitř předka jde dál na původní private verzi. Override <code>final</code> metody je CE.`,
          code: `class A:
  private def secret = 1
  def show = secret        // vždy A.secret

class B extends A:
  def secret = 2           // nová metoda, ne override

// B().show == 1, B().secret == 2`,
          sources: [{ kind: 'slide', doc: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Pole ve Scale se chovají jako metody',
          html: `Ve Scale sdílí pole a metody jeden jmenný prostor (uniform access), takže <code>override val x</code> se resolvuje <strong>dynamicky</strong> jako metoda: <code>val ab: A = B(); ab.x</code> dá hodnotu z <code>B</code>. (V Javě se pole resolvují staticky – na testu je ale Scala.)<br>
Bonusová past (ověřeno): když <code>A</code> má <code>val x = 1; val y = x + 1</code> a <code>B</code> má <code>override val x = 10</code>, pak <code>B().y</code> je <strong>1</strong> – při běhu těla <code>A</code> ještě pole <code>x</code> z <code>B</code> není inicializované (je 0).`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 82, quote: 'Fields and methods share the same namespace' },
            { kind: 'slide', doc: 'L2', page: 80 },
          ],
        },
        { kind: 'quiz', ids: ['ch2-03', 'ch2-04'], title: 'Ověř si: this a super' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-3',
      number: '2.3',
      title: 'Overloading vs. overriding',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Overloading (přetížení)',
          html: `Více metod se <strong>stejným jménem a jinými typy parametrů</strong>. Který overload se zavolá, rozhodne <strong>kompilátor podle statických typů argumentů</strong>. Lišit se jen návratovým typem nestačí (CE: „Conflicting definitions … have matching parameter types“).`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 18,
              quote: 'Different parameter types create overloads, static types choose between them.',
            },
            { kind: 'slide', doc: 'L2', page: 18, quote: 'Return type alone is insufficient.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Overriding (přepsání)',
          html: `Podtřída nahradí implementaci metody se <strong>stejnou signaturou</strong> (jméno + stejné typy parametrů; návratový typ stejný nebo podtyp). Které tělo poběží, rozhodne <strong>runtime třída příjemce</strong>. Ve Scale je u přepsání konkrétní metody povinné <code>override</code> (bez něj CE „needs override modifier“); u implementace abstraktní metody je volitelné.`,
          sources: [{ kind: 'slide', doc: 'L2', page: 19, quote: 'Overriding replaces an inherited implementation' }],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Overloading</strong>: jiná signatura · vybírá kompilátor · podle statických typů argumentů · „ad-hoc polymorfismus“.',
            '<strong>Overriding</strong>: stejná signatura · vybírá runtime · podle runtime třídy příjemce · „subtyping polymorfismus“.',
            'Jedna metoda může být zároveň overloadovaná i overridnutá (viz <code>label</code> níže).',
          ],
          sources: [
            { kind: 'slide', doc: 'L2', page: 20, quote: 'An overloaded method can also be overridden' },
            { kind: 'slide', doc: 'L2', page: 29 },
          ],
        },
        {
          kind: 'code',
          caption: 'Kvíz ze slidů – všechny tři reference ukazují na jeden objekt.',
          runnable: true,
          code: `class Counter:
  def label(other: Counter): String = "C/C"

class DoubleCounter extends Counter:
  override def label(other: Counter): String = "D/C"
  def label(other: DoubleCounter): String = "D/D"

@main def run() =
  val d: DoubleCounter = new DoubleCounter()
  val c: Counter = d
  val a: Counter = d
  println(d.label(d)) // D/D
  println(d.label(a)) // D/C
  println(c.label(d)) // D/C
  println(c.label(a)) // D/C`,
          sources: [{ kind: 'slide', doc: 'L2', page: 21 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Overload v podtřídě není override',
          html: `<code>c.label(d)</code>: statický typ příjemce je <code>Counter</code>, a ten zná jen <code>label(Counter)</code>. Overload <code>label(DoubleCounter)</code> existuje jen v <code>DoubleCounter</code> → přes <code>c</code> není vidět, i když argument <em>je</em> DoubleCounter. Za běhu se už nic nepřevybírá → <code>"D/C"</code>.<br>
Bez <code>override def label(other: Counter)</code> v podtřídě (varianta ze slidu 18) by <code>c.label(d)</code> vrátilo <code>"C/C"</code>.`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 19,
              quote: 'Counter’s static API exposes label(Counter); c’s runtime class supplies its override.',
            },
            { kind: 'slide', doc: 'L2', page: 18, quote: 'The same argument object can select different overloads.' },
          ],
        },
        { kind: 'quiz', ids: ['ch2-05', 'ch2-06'], title: 'Ověř si: overloading vs. overriding' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-4',
      number: '2.4',
      title: 'Algoritmus: nejdřív signatura, pak příjemce',
      blocks: [
        {
          kind: 'p',
          html: 'Každé volání metody se vyhodnocuje ve dvou oddělených fázích (single dispatch). Na tomhle stojí většina otázek „Co to vypíše?“.',
          sources: [{ kind: 'slide', doc: 'L2', page: 20, quote: 'Single dispatch: signature ﬁrst, receiver second' }],
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Compile time</strong>: ze <em>statického typu příjemce</em> vezmi viditelné metody daného jména a podle <em>statických typů argumentů</em> vyber overload (signaturu).',
            '<strong>Runtime</strong>: podle <em>runtime třídy příjemce</em> najdi override <em>té vybrané signatury</em>. Argumenty se už znovu nezkoumají.',
          ],
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 20,
              quote: 'Compile time: select an accessible signature from the receiver’s static type',
            },
            {
              kind: 'slide',
              doc: 'L2',
              page: 20,
              quote: 'Runtime: for a virtual call, select the override for that signature',
            },
            {
              kind: 'slide',
              doc: 'L2',
              page: 20,
              quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Postup: Co to vypíše?',
          html: `<ol>
<li><strong>Tabulka.</strong> Nakresli hierarchii a ke každé třídě napiš, které metody <em>definuje/přepisuje</em> a co v nich je (<code>this.x</code>, <code>super.x</code>). Overloady piš s typy parametrů: <code>f(A)</code>, <code>f(B)</code> jsou dvě různé metody.</li>
<li><strong>Statické typy.</strong> U každého volání zjisti statický typ příjemce (deklarovaný typ proměnné/parametru, <em>ne</em> to, co je za <code>new</code>) a statické typy argumentů.</li>
<li><strong>Výběr signatury (compile time).</strong> Ze všech metod toho jména viditelných ve statickém typu příjemce (vlastní + zděděné) vyber nejspecifičtější použitelnou. Žádná → <strong>CE</strong>. Dvě stejně dobré → <strong>CE</strong> (ambiguous). U top-level funkcí (<code>def eval(x: A)</code>…) rozhoduje jen statický typ argumentu.</li>
<li><strong>Výběr těla (runtime).</strong> Vezmi runtime třídu příjemce a jdi od ní nahoru, dokud nenajdeš implementaci <em>přesně té signatury</em>. Výjimky: <code>private</code>, <code>final</code> a metody z <code>object</code> mají pevný cíl.</li>
<li><strong>Uvnitř těla.</strong> <code>x</code>/<code>this.x</code> = nové volání na <em>tentýž objekt</em> → znovu krok 3–4 (runtime třída se nemění, statický typ <code>this</code> = třída, kde je kód napsaný). <code>super.x</code> = implementace nad třídou, kde je kód napsaný (bez dynamiky).</li>
<li><strong>Dopočítej</strong> zevnitř ven a teprve na konci aplikuj, co dělá vnější funkce (<code>* 10</code>, <code>+ 100</code>…).</li>
</ol>`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 78, quote: 'What is the receiver’s static type, if the language has one?' },
            { kind: 'slide', doc: 'L2', page: 78, quote: 'What are the static types of the explicit arguments?' },
            { kind: 'slide', doc: 'L2', page: 78, quote: 'Is the call virtual, and what is the receiver’s runtime class?' },
            { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
          ],
        },
        {
          kind: 'interactive',
          component: 'dispatch-tracer',
          title: 'Krokuj dispatch',
          hint: 'U každého volání nejdřív urči statický typ příjemce a argumentů a vyber signaturu, teprve pak podle runtime třídy vyber tělo.',
        },

        // ---- Příklad 1: sample Q3
        {
          kind: 'code',
          caption: 'Příklad 1 – sample midterm, otázka 3',
          runnable: true,
          code: `class A:
  def m = 1

class B extends A:
  override def m = super.m + 1

class C extends B:
  override def m = super.m + 2

class D extends C:
  override def m = super.m + 3

def eval(x: A) = x.m
def eval(x: C) = x.m * 10
def eval(x: D) = x.m * 100

@main def run() =
  val obj: C = D()
  println(eval(obj))`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 3' }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 1 → 70',
          html: `<ol>
<li>Overload <code>eval</code>: statický typ <code>obj</code> je <code>C</code> (deklarovaný!). Použitelné jsou <code>eval(A)</code> a <code>eval(C)</code>; <code>eval(D)</code> ne, protože <code>C</code> není podtyp <code>D</code>. Nejspecifičtější: <code>eval(C)</code> → <code>x.m * 10</code>.</li>
<li><code>x.m</code>: runtime třída <code>D</code> → <code>D.m</code> = <code>super.m + 3</code>.</li>
<li>Super řetěz: <code>C.m</code> = <code>B.m + 2</code>, <code>B.m</code> = <code>A.m + 1</code> = 2 → <code>C.m</code> = 4 → <code>D.m</code> = 7.</li>
<li>7 × 10 = <strong>70</strong>.</li>
</ol>`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 3' }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Statický typ je napsaný u proměnné, ne za new',
          html: 'Kdo v příkladu 1 vezme <code>eval(D)</code>, protože „je to přece D“, dostane 700 – špatně. Overload se vybírá při překladu a kompilátor ví jen <code>obj: C</code>. Runtime třída <code>D</code> se uplatní až o krok později – při výběru těla <code>m</code>.',
          sources: [
            { kind: 'slide', doc: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
          ],
        },

        // ---- Příklad 2: sample Q7
        {
          kind: 'code',
          caption: 'Příklad 2 – sample midterm, otázka 7',
          runnable: true,
          code: `class A:
  def x = 1
  def y = x + 1
  def z = y + 2

class B extends A:
  override def x = 2

class C extends B:
  override def y = super.y * 10

def compute(obj: A) = obj.z
def compute(obj: B) = obj.z * 10
def compute(obj: C) = obj.z + 100

@main def run() =
  val v: B = C()
  println(compute(v))`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 7' }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 2 → 320',
          html: `Tabulka: <code>A</code>: x=1, y=x+1, z=y+2 · <code>B</code>: x=2 · <code>C</code>: y=super.y*10. Objekt je <code>C</code>.
<ol>
<li>Statický typ <code>v</code> je <code>B</code> → <code>compute(B)</code> → <code>obj.z * 10</code>.</li>
<li><code>z</code>: C ani B ho nepřepisují → <code>A.z</code> = <code>y + 2</code>.</li>
<li><code>y</code> je <code>this.y</code> → dynamicky <code>C.y</code> = <code>super.y * 10</code>; super v C = B, B nemá <code>y</code> → <code>A.y</code> = <code>x + 1</code>.</li>
<li><code>x</code> dynamicky: C nemá, B má → 2. Tedy <code>A.y</code> = 3, <code>C.y</code> = 30, <code>z</code> = 32.</li>
<li>32 × 10 = <strong>320</strong>.</li>
</ol>`,
          sources: [
            { kind: 'official', label: 'Sample midterm 2026, otázka 7' },
            { kind: 'slide', doc: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
          ],
        },

        // ---- Příklad 3: sample Q9
        {
          kind: 'code',
          caption: 'Příklad 3 – sample midterm, otázka 9',
          runnable: true,
          code: `class A:
  def f(a: A): Int = 1

class B extends A:
  def f(b: B): Int = 2
  override def f(a: A): Int = 3

@main def run() =
  val x: A = B()
  val y: B = B()
  println(y.f(x))`,
          sources: [{ kind: 'official', label: 'Sample midterm 2026, otázka 9' }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 3 → 3',
          html: `<ol>
<li>Příjemce <code>y</code> má statický typ <code>B</code> → kandidáti <code>f(A)</code> (zděděná/přepsaná) a <code>f(B)</code>.</li>
<li>Argument <code>x</code> má statický typ <code>A</code> → <code>f(B)</code> nejde použít (A není podtyp B). Zbývá signatura <code>f(A)</code>.</li>
<li>Runtime třída <code>y</code> je <code>B</code>, která <code>f(A)</code> přepisuje → <strong>3</strong>.</li>
</ol>Že je v <code>x</code> ve skutečnosti objekt <code>B</code>, je irelevantní – „do not reconsider explicit argument types“. Pro kontrolu (ověřeno): <code>x.f(y)</code> = 3, <code>y.f(y)</code> = 2, <code>x.f(x)</code> = 3.`,
          sources: [
            { kind: 'official', label: 'Sample midterm 2026, otázka 9' },
            {
              kind: 'slide',
              doc: 'L2',
              page: 20,
              quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types',
            },
          ],
        },

        // ---- Příklad 4: L4 warm-up Q5–Q8
        {
          kind: 'code',
          caption: 'Příklad 4 – warm-up kvíz z L4 (Q5–Q8): stejný objekt, tři různé statické typy',
          runnable: true,
          code: `class A:
  def f = 1 + this.g
  def g = 1

class B extends A:
  override def f = super.f * 2

class C extends B:
  override def g = 2

def test(x: A) = println(x.f)
def test(x: C) = println(x.f + 2)

@main def run() =
  val u: A = new C
  test(u) // 6
  val v: B = new C
  test(v) // 6
  val w: C = new C
  test(w) // 8`,
          sources: [
            { kind: 'slide', doc: 'L4', page: 14 },
            { kind: 'slide', doc: 'L4', page: 15 },
            { kind: 'slide', doc: 'L4', page: 16 },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Řešení příkladu 4 → 6, 6, 8',
          html: `<ol>
<li>Hodnota <code>x.f</code> je pro objekt <code>C</code> vždy stejná: <code>B.f</code> = <code>super.f * 2</code> = <code>A.f * 2</code>; <code>A.f</code> = <code>1 + this.g</code> = 1 + <code>C.g</code> = 3 → 6.</li>
<li>Liší se jen overload <code>test</code>: <code>u: A</code> → <code>test(A)</code> → 6. <code>v: B</code> → <code>test(C)</code> nejde (B není podtyp C) → <code>test(A)</code> → 6. <code>w: C</code> → <code>test(C)</code> → 6 + 2 = 8.</li>
</ol>`,
          sources: [{ kind: 'slide', doc: 'L4', page: 15 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'this uvnitř předka má statický typ předka',
          html: 'Když metoda napsaná v <code>A</code> volá <code>who(this)</code> a <code>who</code> je overloadovaná pro <code>A</code> i <code>B</code>, kompilátor vybere <code>who(A)</code> – v kódu třídy <code>A</code> je <code>this</code> typu <code>A</code>, i když za běhu je to objekt <code>B</code>. Runtime pak vybere jen override <em>této</em> signatury. (Přesně proto je potřeba double dispatch, viz 2.6.)',
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 25,
              quote: 'Inside each class, this has a speciﬁc static type, so the hitBy overload is known.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Shrnutí',
          html: '<strong>Overload</strong> = statický typ (příjemce i argumentů), compile time. <strong>Override</strong> = runtime třída příjemce, runtime. <code>this</code> dynamické, <code>super</code> statické. Statický typ = deklarace, ne <code>new</code>.',
          sources: [{ kind: 'slide', doc: 'L2', page: 74 }],
        },
        { kind: 'quiz', ids: ['ch2-07', 'ch2-08'], title: 'Ověř si: celý algoritmus' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-5',
      number: '2.5',
      title: 'Kdy se to nezkompiluje',
      blocks: [
        {
          kind: 'p',
          html: '„Nezkompiluje se“ je na testu legitimní odpověď. Když kód obsahuje chybu překladu, nevypíše se <em>nic</em> – ani řádky před ní. Všechny případy níže jsou ověřené ve Scale 3.',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Metoda není ve statickém typu příjemce</strong>: <code>val a: A = B(); a.onlyInB</code> → CE („value … is not a member of A“). Pozor i na odvozené typy: <code>val x = if flag then B() else A()</code> má typ <code>A</code>.',
            '<strong>Žádný overload nesedí</strong> – statický typ argumentu je moc obecný: <code>def f(b: B)</code>, volání <code>f(a)</code> s <code>a: A</code> → CE.',
            '<strong>Ambiguous overload</strong> – <code>f(A, B)</code> a <code>f(B, A)</code>, volání <code>f(B(), B())</code> → CE.',
            '<strong>Overloady liší jen návratovým typem</strong> → CE („Conflicting definitions“).',
            '<strong><code>override</code>, který nic nepřepisuje</strong> – překlep ve jménu („overrides nothing“) nebo jiné typy parametrů („different signature than the overridden declaration“).',
            '<strong>Chybí <code>override</code></strong> u přepsání konkrétní metody → CE („needs override modifier“). U implementace abstraktní metody není potřeba.',
            '<strong>Override s nekompatibilním návratovým typem</strong> (nadtyp původního) → CE („has incompatible type“).',
            '<strong>Override <code>final</code> metody</strong> → CE („cannot override final member“).',
            '<strong>Přiřazení nadtypu do podtypu</strong>: <code>val b: B = A()</code> → CE. Opačně (<code>val a: A = B()</code>) je to v pořádku.',
            '<strong>Zápis do <code>val</code></strong>, čtení parametru konstruktoru bez <code>val</code>, přístup k <code>private</code> → CE (viz 2.1).',
          ],
          sources: [
            { kind: 'slide', doc: 'L2', page: 15, quote: 'The static type controls which members are' },
            { kind: 'slide', doc: 'L2', page: 18, quote: 'Return type alone is insufficient.' },
            { kind: 'slide', doc: 'L2', page: 62, quote: 'ERROR - it is not an override but overload' },
            { kind: 'slide', doc: 'L2', page: 56, quote: 'A does not have method g' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Sample midterm, otázka 1: v.m3 → CE',
          html: `<code>Container[B]</code> má <code>store(x: B): B</code>. Předat <code>C()</code> je OK (C &lt;: B), ale návratový typ je <code>B</code>, takže <code>v</code> má statický typ <code>B</code>. <code>B</code> metodu <code>m3</code> nemá → <strong>nezkompiluje se</strong> („value m3 is not a member of B“), přestože za běhu by v <code>v</code> byl objekt <code>C</code>.`,
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
          sources: [
            { kind: 'official', label: 'Sample midterm 2026, otázka 1' },
            { kind: 'slide', doc: 'L2', page: 15, quote: 'The static type controls which members are' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Chyba za běhu ≠ chyba překladu',
          html: 'Nekonečná rekurze (<code>f = f * g</code>) nebo <code>???</code> se <strong>zkompilují</strong> a spadnou až za běhu (<code>StackOverflowError</code>, <code>NotImplementedError</code>). Odpověď „CE“ dávej jen tehdy, když porušíš typová/deklarační pravidla.',
          sources: [{ kind: 'slide', doc: 'L4', page: 9 }],
        },
        { kind: 'quiz', ids: ['ch2-09', 'ch2-10'], title: 'Ověř si: zkompiluje se to?' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-6',
      number: '2.6',
      title: 'Double dispatch',
      blocks: [
        {
          kind: 'p',
          html: 'Problém: chceme chování podle runtime tříd <em>obou</em> objektů (asteroid × loď). Overload <code>collide(o: Spaceship)</code> nepomůže – overload se vybírá podle <em>statického</em> typu argumentu, a ten je <code>SpaceObject</code>.',
          sources: [
            { kind: 'slide', doc: 'L2', page: 24, quote: 'the argument’s runtime class does not select an overload' },
          ],
        },
        {
          kind: 'code',
          caption: 'Naivní pokus: zkompiluje se, ale runtime třída argumentu nic nevybírá.',
          runnable: true,
          code: `abstract class SpaceObject:
  def collide(o: SpaceObject): String = "generic collision"

class Asteroid extends SpaceObject:
  def collide(o: Spaceship): String = "ship damaged"

class Spaceship extends SpaceObject:
  def collide(o: Asteroid): String = "ship damaged"

@main def run() =
  val a: SpaceObject = new Asteroid()
  val b: SpaceObject = new Spaceship()
  println(a.collide(b))       // generic collision
  val rock = new Asteroid()
  val ship = new Spaceship()
  println(rock.collide(ship)) // ship damaged
  println(rock.collide(b))    // generic collision`,
          sources: [{ kind: 'slide', doc: 'L2', page: 24 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Double dispatch = dvě obyčejná virtuální volání',
          html: `<ol>
<li><strong>1. dispatch</strong>: <code>a.collide(b)</code> – runtime třída <code>a</code> vybere <code>Asteroid.collide</code>.</li>
<li>Uvnitř zavolá <code>o.hitBy(this)</code>. V <code>Asteroid</code> má <code>this</code> statický typ <code>Asteroid</code> → kompilátor vybere overload <code>hitBy(Asteroid)</code>. Tím je „zapamatovaný“ první typ.</li>
<li><strong>2. dispatch</strong>: runtime třída <code>o</code> vybere override <code>hitBy(Asteroid)</code> – např. <code>Spaceship.hitBy(Asteroid)</code>.</li>
</ol>Za běhu se žádný overload nevybírá – jen dvakrát override.`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 25,
              quote: 'First dispatch: the receiver chooses Asteroid.collide or Spaceship.collide.',
            },
            {
              kind: 'slide',
              doc: 'L2',
              page: 26,
              quote: 'Second dispatch: o’s runtime class chooses the override of the selected hitBy signature.',
            },
            { kind: 'slide', doc: 'L2', page: 27, quote: 'Two ordinary virtual calls; no runtime overload selection.' },
          ],
        },
        {
          kind: 'code',
          caption: 'Double dispatch ze slidů (space simulator).',
          runnable: true,
          code: `abstract class SpaceObject:
  def collide(o: SpaceObject): String
  def hitBy(a: Asteroid): String
  def hitBy(s: Spaceship): String

class Asteroid extends SpaceObject:
  override def collide(o: SpaceObject): String = o.hitBy(this)
  override def hitBy(a: Asteroid): String = "rocks fragment"
  override def hitBy(s: Spaceship): String = "ship damaged"

class Spaceship extends SpaceObject:
  override def collide(o: SpaceObject): String = o.hitBy(this)
  override def hitBy(a: Asteroid): String = "ship damaged"
  override def hitBy(s: Spaceship): String = "ships bounce"

@main def run() =
  val a: SpaceObject = new Asteroid()
  val b: SpaceObject = new Spaceship()
  println(a.collide(b)) // Asteroid.collide -> b.hitBy(Asteroid) -> ship damaged
  println(b.collide(a)) // Spaceship.collide -> a.hitBy(Spaceship) -> ship damaged
  println(a.collide(a)) // rocks fragment
  println(b.collide(b)) // ships bounce`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 26 },
            { kind: 'slide', doc: 'L2', page: 27 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Při trasování si hlídej, kdo je příjemce',
          html: 'V <code>b.collide(a)</code> je 1. příjemce <code>b</code> (Spaceship), ale 2. příjemce je <code>a</code> → tělo se bere z <code>Asteroid.hitBy(Spaceship)</code>, ne ze Spaceship. Výsledek druhého volání určuje třída <em>argumentu</em> původního volání.',
          sources: [
            { kind: 'slide', doc: 'L2', page: 26, quote: 'The hitBy parameter records the ﬁrst kind; the receiver supplies the second kind.' },
          ],
        },
        { kind: 'quiz', ids: ['ch2-11'], title: 'Ověř si: double dispatch' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-7',
      number: '2.7',
      title: 'Subtyping, subclassing, dědičnost a LSP',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Subtyping B <: A',
          html: `<code>B &lt;: A</code> znamená: hodnotu typu <code>B</code> lze bezpečně použít všude, kde se čeká <code>A</code> – v přiřazení, jako argument i jako návratovou hodnotu. Relace je <strong>reflexivní</strong> (<code>A &lt;: A</code>) a <strong>tranzitivní</strong>. <code>A &gt;: B</code> = A je nadtyp B.`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 30, quote: 'means that any variable of type B can safely be' },
            { kind: 'slide', doc: 'L2', page: 30, quote: 'if B <: A and C <: B then C <: A' },
            { kind: 'slide', doc: 'L2', page: 31, quote: 'Invoked with a subtype argument, or returning a subtype instance.' },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Subclassing</strong> = deklarace <code>class B extends A</code> (syntaktický mechanismus).',
            '<strong>Dědičnost (inheritance)</strong> = samotné převzetí kódu/rozhraní předka.',
            '<strong>Nominální subtyping</strong> = typová relace, kterou deklarace zavede. Ve Scale/Javě <code>extends</code> automaticky dává <code>B &lt;: A</code>, ale obecně subclassing ≠ subtyping (např. neveřejné dědění v C++ podtyp nevytvoří).',
            '<strong>Behavioral subtyping</strong> = podtyp navíc dodržuje vše, co předek slibuje klientům. Kompilátor ověří nominální vztah, ne chování.',
            'Podtřída dědí public a protected členy. <code>private</code> stav v objektu je, ale podtřída k němu nemá přístup. Podtřída musí zavolat konstruktor předka.',
          ],
          sources: [
            { kind: 'slide', doc: 'L2', page: 35, quote: 'Subclassing is a declaration: DoubleCounter extends Counter.' },
            { kind: 'slide', doc: 'L2', page: 77, quote: 'Inheritance is the actual process of reusing the code or interface.' },
            { kind: 'slide', doc: 'L2', page: 76, quote: 'But in principle, subclassing ≠ subtyping.' },
            { kind: 'slide', doc: 'L2', page: 33, quote: 'It does not always create a subtype' },
            {
              kind: 'slide',
              doc: 'L2',
              page: 35,
              quote: 'A compiler can establish the nominal relation without proving the behavioral one.',
            },
            { kind: 'slide', doc: 'L2', page: 37, quote: 'A subclass inherits all protected and public members' },
            { kind: 'slide', doc: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Liskov Substitution Principle (LSP)',
          html: 'Pokud o objektech typu <code>A</code> platí (dá se dokázat) vlastnost Φ, musí platit i pro objekty každého podtypu <code>B &lt;: A</code>. Česky: behavioral podtyp dodrží sliby, na které klienti předka spoléhají – hodnota B může zastoupit A, aniž by se rozbil kontrakt A.',
          sources: [
            { kind: 'slide', doc: 'L2', page: 36, quote: 'A behavioral subtype preserves the promises clients rely on.' },
            {
              kind: 'slide',
              doc: 'L2',
              page: 36,
              quote: 'The compiler’s nominal subtype check does not prove this behavioral relationship.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Povinnosti overridu (kontrakt)',
          html: `<ul>
<li><strong>Precondition nesmí zesílit</strong> – přijmi aspoň všechno, co přijímal předek („neptej se klienta na nic navíc“).</li>
<li><strong>Postcondition nesmí zeslabit</strong> – zaruč aspoň to, co předek (můžeš slíbit víc).</li>
<li>Zachovej invarianty a sliby o vedlejších efektech; i nové metody musí invarianty respektovat.</li>
<li>Výjimky: žádné nové, existující lze nahradit podtypy nebo odebrat.</li>
</ul>`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 51,
              quote: 'Accept at least every input accepted by the base contract: no stronger precondition.',
            },
            { kind: 'slide', doc: 'L2', page: 51, quote: 'Guarantee at least the base result: no weaker postcondition.' },
            { kind: 'slide', doc: 'L2', page: 52, quote: 'Weaker precondition = Ask nothing extra of client' },
            { kind: 'slide', doc: 'L2', page: 52, quote: 'Stronger postcondition = Guarantee at least as much' },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Square extends Rectangle porušuje LSP',
          html: `Klient předpokládá, že šířku a výšku obdélníku nastaví nezávisle. Pro <code>Rectangle</code> projde, pro <code>Square</code> (setWidth/setHeight nastaví obě strany) je area 16 ≠ 20. Typově je vše v pořádku, behaviorálně ne. Opačně (<code>Rectangle extends Square</code>) to taky nejde → jsou to <strong>nesouvisející typy</strong>. Řešení: plochá hierarchie pod <code>Shape</code> (+ kompozice), nebo společný předek <code>RectangularShape</code>, pokud je co sdílet.`,
          code: `def test(r: Rectangle) =
  r.setWidth(5)
  r.setHeight(4)
  assert(r.area == 20)

test(Rectangle(1, 2)) // OK
test(Square(1))       // assert selže`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 43, quote: 'Violating behavioral subtyping. Subclasses should satisfy the' },
            { kind: 'slide', doc: 'L2', page: 44, quote: 'Square is not a true subtype of Rectangle' },
            { kind: 'slide', doc: 'L2', page: 45 },
            { kind: 'slide', doc: 'L2', page: 46 },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'BoundedCounter (kvíz ze slidů)',
          html: `Kontrakt <code>Counter.set(n)</code>: přijme každé <code>n ≥ 0</code>, potom <code>get == n</code>. Může podtřída <code>BoundedCounter(10)</code>…
<ul>
<li>odmítnout <code>set(20)</code>? <strong>Ne</strong> – zesiluje precondition.</li>
<li>potichu oříznout na 10? <strong>Ne</strong> – porušuje slíbený výsledek.</li>
<li>dodržet kontrakt Counteru a zároveň zaručit <code>get ≤ 10</code>? <strong>Ne</strong> – kontrakty si odporují.</li>
</ul>Řešení: <strong>kompozice</strong> – BoundedCounter obsahuje Counter (není jeho podtyp) a nabízí jiné API (<code>tryInc(): Boolean</code>).`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 49, quote: 'No: that strengthens the precondition.' },
            { kind: 'slide', doc: 'L2', page: 49, quote: 'No: that violates the promised result.' },
            { kind: 'slide', doc: 'L2', page: 50, quote: 'The bounded counter contains a Counter; it is not' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: '„Shodné signatury“ ≠ substituovatelnost',
          html: 'DoubleCounter, jehož <code>inc()</code> přičte 2, kontrakt „zvýší <em>alespoň</em> o step“ splňuje. Kdyby kontrakt zněl „přesně o 1“, byl by to už porušený LSP – i když se kód přeloží úplně stejně. Vždy se ptej, co přesně předek slibuje.',
          sources: [
            { kind: 'slide', doc: 'L2', page: 47, quote: 'An exactly-one-step promise would be violated.' },
            { kind: 'slide', doc: 'L2', page: 47, quote: 'Matching signatures alone does not prove' },
          ],
        },
        { kind: 'quiz', ids: ['ch2-12', 'ch2-13'], title: 'Ověř si: subtyping a LSP' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-8',
      number: '2.8',
      title: 'Override: jaké typy parametru a návratu jsou povolené',
      blocks: [
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Pravidlo pro Scalu (a Javu)',
          html: `<ul>
<li><strong>Návratový typ</strong>: stejný nebo <strong>podtyp</strong> (kovariantní pozice). Klient dostane aspoň to, co čekal.</li>
<li><strong>Typy parametrů</strong>: <strong>přesně stejné</strong>. Teoreticky (LSP) by šel i nadtyp – parametr je v kontravariantní pozici – ale Scala/Java/C++ to nedovolí kvůli overloadingu: jiný typ parametru = jiná signatura = overload.</li>
</ul>`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 62, quote: 'Return type is in covariant position' },
            { kind: 'slide', doc: 'L2', page: 62, quote: 'Parameter types are in contravariant position' },
            {
              kind: 'slide',
              doc: 'L2',
              page: 61,
              quote: 'do not allow contravariance in override method parameters because of',
            },
          ],
        },
        {
          kind: 'code',
          caption: 'Báze: class T1 { def m(x: B): B }, hierarchie A >: B >: C. Každý řádek v T2 zvlášť, ověřeno scala-cli.',
          code: `class A
class B extends A
class C extends B

class T1:
  def m(x: B): B = new B

class T2 extends T1:
  override def m(x: B): B = ???  // OK – stejná signatura
  override def m(x: B): C = ???  // OK – kovariantní návrat
  override def m(x: B): A = ???  // CE – "has incompatible type"
  override def m(x: A): B = ???  // CE – "different signature than the overridden declaration"
  override def m(x: C): B = ???  // CE – totéž
  def m(x: A): B = ???           // zkompiluje se – je to OVERLOAD, ne override
  def m(x: B): B = ???           // CE – "needs override modifier"`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 62, quote: 'ERROR - it is not an override but overload' },
            { kind: 'slide', doc: 'L2', page: 55, quote: 'A subtype has all methods of the' },
            { kind: 'slide', doc: 'L2', page: 56, quote: 'A does not have method g' },
          ],
        },
        {
          kind: 'interactive',
          component: 'override-rules',
          title: 'Co smí override změnit?',
          hint: 'Návrat: stejný nebo podtyp. Parametr: ve Scale jen přesně stejný typ – cokoli jiného je overload (bez override) nebo CE (s override).',
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Sample midterm, otázka 4 → jen B',
          html: `<code>class X { def f(b: B): B }</code>, <code>class Y extends X { override def f(b: ?): B }</code>. Za <code>?</code> lze dát <strong>jen <code>B</code></strong>. <code>A</code> i <code>C</code> → CE („method f has a different signature than the overridden declaration“). <code>C</code> by navíc porušilo LSP (zesílená precondition); <code>A</code> by teoreticky LSP splňovalo, ale Scala kontravariantní parametr nepovolí.`,
          sources: [
            { kind: 'official', label: 'Sample midterm 2026, otázka 4' },
            { kind: 'slide', doc: 'L2', page: 59 },
            { kind: 'slide', doc: 'L2', page: 61, quote: 'Conceptually it would make sense to be able to use super type, but' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Parametr vs. návrat – opačná pravidla',
          html: 'Otázka na <strong>návratový typ</strong> má odpověď „stejný nebo podtyp“ (B, C, i <code>Nothing</code>). Otázka na <strong>parametr</strong> má ve Scale odpověď „jen přesně stejný“. Přečti si pořádně, na co se ptají.',
          sources: [{ kind: 'slide', doc: 'L2', page: 62, quote: 'Return type is in covariant position' }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Overload s obecnějším parametrem v podtřídě → nejednoznačné volání (Scala)',
          html: `Slide říká, že <code>def m(x: A)</code> v podtřídě je overload. Platí – ale pozor: ve Scale pak <code>T2().m(B())</code> <strong>nezkompiluje</strong> („Ambiguous overload“). Při výběru overloadu Scala bere v potaz i to, ve které třídě je alternativa definovaná: <code>m(A)</code> z podtřídy vyhraje „podle třídy“, <code>m(B)</code> z předka „podle typu parametru“ → remíza. Java by vybrala <code>m(B)</code>. (Přes <code>val t: T1</code> je vidět jen <code>m(B)</code>, takže <code>t.m(B())</code> projde.)<br>
Opačný případ (<code>def m(x: C)</code> v podtřídě, volání s <code>C</code>) problém nemá – podtřídní alternativa je specifičtější v obou ohledech; stejně tak <code>label(DoubleCounter)</code> ze slidu 18.`,
          code: `class A
class B extends A

class T1:
  def m(x: B): String = "T1"

class T2 extends T1:
  def m(x: A): String = "T2"

val t: T1 = T2()
t.m(B())      // "T1"
T2().m(A())   // "T2"
T2().m(B())   // CE: Ambiguous overload`,
          sources: [{ kind: 'slide', doc: 'L2', page: 62, quote: 'ERROR - it is not an override but overload' }],
        },
        { kind: 'quiz', ids: ['ch2-14', 'ch2-15'], title: 'Ověř si: pravidla pro override' },
      ],
    },

    // =====================================================================
    {
      id: 'sec-2-9',
      number: '2.9',
      title: 'Nominální vs. strukturální typování',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Tři způsoby, jak rozhodnout „je X typu T?“',
          html: `<ul>
<li><strong>Nominální</strong>: kompatibilitu určují <em>explicitní deklarace</em> (<code>extends</code>, <code>implements</code>). C++, Java, Kotlin, Scala – na tom stojí kurz.</li>
<li><strong>Strukturální</strong>: kompatibilitu určuje <em>skutečná struktura</em> typu (má požadované metody). Go, TypeScript, Scala 3 (strukturální typy). Kontroluje se při překladu.</li>
<li><strong>Duck typing</strong>: „chodí jako kachna, kváká jako kachna → je to kachna“ – vypadá jako strukturální, ale je to vlastnost <em>běhu</em> (Python, JavaScript).</li>
</ul>`,
          sources: [
            {
              kind: 'slide',
              doc: 'L2',
              page: 64,
              quote: 'type equivalence and compatibility is determined by explicit declarations',
            },
            {
              kind: 'slide',
              doc: 'L2',
              page: 64,
              quote: "type equivalence and compatibility is determined by type's actual structure",
            },
            {
              kind: 'slide',
              doc: 'L2',
              page: 64,
              quote: 'looks like structural typing, but it is a runtime characteristics',
            },
            { kind: 'slide', doc: 'L2', page: 34, quote: 'Structural subtyping: Go, TypeScript, Scala 3' },
          ],
        },
        {
          kind: 'code',
          caption: 'Strukturální typ ve Scale: Cat nemá s Animal žádný vztah, stačí metoda speak. Volání jde přes reflexi.',
          runnable: true,
          code: `import scala.reflect.Selectable.reflectiveSelectable

type Animal = { def speak: String }

class Cat(name: String):
  def speak = this.name + " mnau!"

def speak(pet: Animal) = "Animal says " + pet.speak

@main def run() =
  println(speak(Cat("Garfield"))) // Animal says Garfield mnau!`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 68 },
            { kind: 'slide', doc: 'L2', page: 69 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Stejná metoda nestačí u nominálního typu',
          html: `Když je <code>Animal</code> <code>abstract class</code>/<code>trait</code>, třída <code>Robot</code> s metodou <code>speak: String</code>, ale bez <code>extends Animal</code>, do <code>def speak(pet: Animal)</code> <strong>nejde</strong> předat → CE („Found: Robot, Required: Animal“). Strukturální typ <code>{ def speak: String }</code> ji přijme – ale jen s importem <code>reflectiveSelectable</code>, jinak CE.`,
          sources: [
            { kind: 'slide', doc: 'L2', page: 65 },
            { kind: 'slide', doc: 'L2', page: 64, quote: 'In this course we focus primarily on static type systems with nominal typing' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Shrnutí kapitoly',
          html: `<ul>
<li>Overload = statické typy, compile time. Override = runtime třída příjemce. „Signature first, receiver second.“</li>
<li><code>this.x()</code> v předkovi je dynamické; <code>super.x()</code> statické; <code>private</code>/<code>final</code> statické.</li>
<li>Metoda mimo statický typ, nejednoznačný overload, špatný override → CE.</li>
<li>Override: návrat stejný/podtyp, parametr přesně stejný. LSP: slabší pre, silnější post.</li>
<li>Scala je nominální; strukturální typy volitelně přes reflexi.</li>
</ul>`,
          sources: [{ kind: 'slide', doc: 'L2', page: 74 }],
        },
        { kind: 'quiz', ids: ['ch2-16'], title: 'Ověř si: nominální vs. strukturální' },
      ],
    },
  ],
}
