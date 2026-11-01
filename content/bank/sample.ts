import type { Question, SourceRef } from '../types'

// Oficiální ukázkový midterm 2026 (sample-midterm.pdf, 5 stran, 10 otázek × 2 body).
// Kód je přepsaný doslova; každá odpověď ověřena ve Scala 3 (scala-cli), včetně každé
// možnosti u otázek s výběrem zvlášť.

const SAMPLE = 'Sample midterm 2026 (oficiální)'

const pdf = (q: number, page: number): SourceRef[] => [
  { kind: 'official', label: `Sample midterm 2026, otázka ${q}` },
  { kind: 'image', src: '/slides/sample-midterm.pdf', label: `Sample midterm 2026 – PDF, strana ${page}` },
]

export const sample: Question[] = [
  // ------------------------------------------------------------------ 1
  {
    id: 'sample-01',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
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

println(v.m3)`,
    answer: 'CE',
    explanation:
      '<ol>' +
      '<li><code>Container[B]()</code> ⇒ <code>T = B</code>, takže metoda má pro tento objekt signaturu <code>store(x: B): B</code>.</li>' +
      '<li><code>store(C())</code> projde – <code>C &lt;: B</code>, podtyp smíme předat tam, kde se čeká nadtyp.</li>' +
      '<li>Návratový typ je ale <code>T = B</code>, takže <code>v</code> má <strong>statický typ B</strong>. Kompilátor nezajímá, že za běhu v proměnné leží instance C.</li>' +
      '<li><code>v.m3</code>: jaké členy smíš zavolat, určuje statický typ. B má jen <code>m1</code> a <code>m2</code> ⇒ <strong>chyba kompilace</strong> (<em>value m3 is not a member of B</em>).</li>' +
      '</ol>' +
      '<strong>Past:</strong> „uložil jsem tam C, takže vypíše 3“ – ne. Generická metoda vrací <code>T</code>, ne „to, co jsi tam dal“. Kdyby tam bylo <code>println(v.m2)</code>, vypíše se <code>2</code>.',
    verified: 'scala',
    sources: [
      ...pdf(1, 1),
      { kind: 'slide', lecture: 'L2', page: 15, quote: 'The static type controls which members are' },
      { kind: 'slide', lecture: 'L4', page: 23, quote: 'values are provided at call sites' },
    ],
  },
  // ------------------------------------------------------------------ 2
  {
    id: 'sample-02',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Sample midterm 2026 (oficiální)', 'FIT Wiki – Marast 22. 10. 2020', 'Ukázkový midterm 2026, otázka 2 (s možností Int)'] },
    prompt:
      'Instance kterých tříd lze předat jako parametr <code>x</code> následující funkci? Označte všechny správné odpovědi. <em>(Instances of which classes can be passed as parameter x in the following function? Mark all correct answers.)</em>',
    code: `def f[A >: MyClass](x: A): Unit`,
    options: ['Pouze MyClass (MyClass only)', 'MyClass a všechny její nadtřídy (MyClass and all its superclasses)', 'Int', 'MyClass a všechny její podtřídy (MyClass and all its subclasses)', 'String'],
    correct: [1, 2, 3, 4],
    explanation:
      '<strong>Klíč:</strong> dolní mez <code>A &gt;: MyClass</code> omezuje <em>typový argument</em> <code>A</code>, ne přímo hodnotu <code>x</code>. Typ <code>A</code> si při volání bez hranatých závorek <strong>odvodí kompilátor</strong> – a ten ho klidně rozšíří.<ol>' +
      '<li><code>f(MyClass())</code> ⇒ <code>A = MyClass</code> ✔</li>' +
      '<li>nadtřída, např. <code>f(Object())</code> ⇒ <code>A = Object</code> ✔ (Object &gt;: MyClass)</li>' +
      '<li>podtřída <code>f(Sub())</code> ⇒ <code>A = MyClass</code>, hodnota typu Sub do parametru typu MyClass projde díky subtypingu ✔</li>' +
      '<li><code>f(42)</code> ⇒ kompilátor hledá typ, který je nadtypem <code>MyClass</code> i <code>Int</code> ⇒ <code>A = Any</code> ✔</li>' +
      '<li><code>f("hello")</code> ⇒ <code>A</code> = společný nadtyp String a MyClass (Object) ✔</li></ol>' +
      'Vše ověřeno ve Scale 3 – zkompiluje se <strong>všechno</strong>, takže neplatí jen „pouze MyClass“. Stejný trik je na slidu s <code>appended[R &gt;: T]</code>: do <code>List[Cat]</code> přidáš psa a <code>R</code> se odvodí jako <code>Animal</code>.<br>' +
      '<strong>Past:</strong> „dolní mez ⇒ jen MyClass a nadtřídy“ platí jen při <em>explicitním</em> typovém argumentu: <code>f[Sub](Sub())</code> i <code>f[Int](1)</code> skončí chybou <em>Type argument … does not conform to lower bound MyClass</em>. Uvnitř <code>f</code> pak na <code>x</code> nejde volat nic kromě metod <code>Any</code> (A může být cokoli nad MyClass).<br>' +
      'Na FIT Wiki (Marast 2020) je u varianty bez Int označeno „nadtřídy + String + podtřídy“ – to s kompilátorem souhlasí.',
    verified: 'scala',
    sources: [
      ...pdf(2, 1),
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'T is Cat, R has to be Animal since that is' },
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'the closest basetype of both Cat and Dog' },
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' },
      // sloučeno z duplicit: wiki-marast_22_10_20-01
      { kind: 'wiki', label: 'FIT Wiki – Marast 22. 10. 2020', page: 'marast_22_10_20', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_22_10_20' },
      { kind: 'image', src: '/sources/wiki/bi-oop_marast_22_10_20.png', label: 'Marast 22. 10. 2020 – screenshot' },
    ],
  },
  // ------------------------------------------------------------------ 3
  {
    id: 'sample-03',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
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

val obj: C = D()
println(eval(obj))`,
    answer: '70',
    explanation:
      '<ol>' +
      '<li><strong>Který <code>eval</code>?</strong> Overloading se rozhoduje při kompilaci podle <em>statického</em> typu argumentu. <code>obj: C</code> ⇒ připadá v úvahu <code>eval(A)</code> a <code>eval(C)</code>, nejkonkrétnější je <code>eval(x: C)</code>. Že je to za běhu D, nehraje roli – <code>eval(D)</code> se nevybere.</li>' +
      '<li><strong>Kolik je <code>x.m</code>?</strong> Volání metody na objektu je dynamické ⇒ <code>D.m</code>. Řetěz <code>super</code> je statický (vždy o třídu výš): D: <code>super.m + 3</code> → C: <code>super.m + 2</code> → B: <code>super.m + 1</code> → A: <code>1</code>. Tedy 1 + 1 + 2 + 3 = 7.</li>' +
      '<li><code>eval(C)</code> vrátí 7 · 10 = <strong>70</strong>.</li></ol>' +
      '<strong>Past:</strong> 700 (vybral by ses podle runtime typu D) nebo 30 (zapomněl bys, že <code>m</code> se volá na D).',
    verified: 'scala',
    sources: [
      ...pdf(3, 2),
      { kind: 'slide', lecture: 'L2', page: 18, quote: 'Different parameter types create overloads, static types choose between them.' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L2', page: 15, quote: 'The runtime receiver selects an overridden body.' },
    ],
  },
  // ------------------------------------------------------------------ 4
  {
    id: 'sample-04',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt:
      'Jaký typ lze použít pro parametr <code>b</code> ve třídě <code>Y</code> (místo <code>?</code>)? <em>(Which type can be used for parameter b in class Y?)</em> V originále je to otevřená otázka; zde vyber všechny typy, se kterými se kód zkompiluje.',
    code: `class A
class B extends A
class C extends B

class X {
  def f(b: B): B = new B
}

class Y extends X {
  override def f(b: ?): B
}`,
    options: ['A', 'B', 'C'],
    correct: [1],
    explanation:
      '<strong>Odpověď: jen <code>B</code></strong> – ve Scale musí mít override <em>přesně stejné</em> typy parametrů.<ol>' +
      '<li><code>C</code> (užší typ): porušilo by LSP – klient přes <code>X</code> smí předat libovolné B, ale Y by umělo jen C. Kompilátor: <em>method f has a different signature than the overridden declaration</em>.</li>' +
      '<li><code>A</code> (širší typ): teoreticky bezpečné (parametr je kontravariantní pozice), <strong>ale Scala/Java/C++ to nedovolí</strong> – metoda s jiným typem parametru je nové <em>přetížení</em> (overload), ne override. S klíčovým slovem <code>override</code> ⇒ stejná chyba jako u C.</li>' +
      '<li><code>B</code> ✔</li></ol>' +
      'Pro srovnání: <strong>návratový typ</strong> se zúžit smí (kovariance) – <code>override def f(b: B): C</code> projde, <code>…: A</code> ne.<br>' +
      '<strong>Past:</strong> „parametry jsou kontravariantní, tak A“ – to je teorie ze slidu, ale ten hned dodává, že v jazycích s overloadingem to nejde. Pozn.: v zadání chybí tělo metody; v neabstraktní třídě by kompilátor navíc hlásil <em>class Y needs to be abstract</em> – na testu předpokládej, že tělo tam je.',
    verified: 'scala',
    sources: [
      ...pdf(4, 2),
      { kind: 'slide', lecture: 'L2', page: 61, quote: 'Java/Scala/C++ do not allow contravariance in override method parameters because of' },
      { kind: 'slide', lecture: 'L2', page: 62, quote: 'ERROR - it is not an override but overload' },
      { kind: 'slide', lecture: 'L2', page: 62, quote: 'Parameter types are in contravariant position' },
      { kind: 'slide', lecture: 'L2', page: 59 },
    ],
  },
  // ------------------------------------------------------------------ 5
  {
    id: 'sample-05',
    kind: 'output',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
    code: `class A:
  def ma(): Int = 1

class B extends A:
  def mb(): Int = 2

class C extends B:
  def mc(): Int = 3

class Processor[T <: B]:
  def compute(x: T): T = x

val processor = Processor[C]()
println(processor.compute(C()).mc())`,
    answer: '3',
    explanation:
      '<ol>' +
      '<li><code>Processor[C]</code>: horní mez <code>T &lt;: B</code> je splněna (C &lt;: B) ⇒ zkompiluje se.</li>' +
      '<li>Pro tento objekt je <code>T = C</code>, tedy <code>compute(x: C): C</code>.</li>' +
      '<li>Výsledek <code>compute(C())</code> má statický typ <strong>C</strong> ⇒ <code>.mc()</code> je dostupná ⇒ vypíše <strong>3</strong>.</li></ol>' +
      'Srovnej s otázkou 1: tam bylo <code>T = B</code>, proto <code>m3</code> neprošlo. Horní mez sama nic „neořezává“ – návratový typ je pořád <code>T</code>, tedy C. Mez jen zakazuje <code>Processor[A]</code> a uvnitř třídy dovoluje volat na <code>x</code> metody B (<code>ma</code>, <code>mb</code>).',
    verified: 'scala',
    sources: [
      ...pdf(5, 3),
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' },
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' },
    ],
  },
  // ------------------------------------------------------------------ 6
  {
    id: 'sample-06',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Sample midterm 2026 (oficiální)', 'Kvíz 2 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K4 (2024/25)', 'Ukázkový midterm 2026, otázka 6 (s více možnostmi)'] },
    prompt:
      'Je dána definice <code>class Consumer[-T]</code>. Označte všechna správná tvrzení. <em>(Given the definition class Consumer[-T], mark all correct statements.)</em>',
    code: `class Consumer[-T]`,
    options: [
      'T je kovariantní typový parametr (T is a covariant type parameter)',
      'Pro libovolné třídy A a B: pokud A <: B, pak Consumer[A] >: Consumer[B]',
      'Pro libovolné třídy A a B: pokud A <: B, pak Consumer[A] <: Consumer[B]',
      'T je kontravariantní typový parametr (T is a contravariant type parameter)',
      'T je invariantní typový parametr (T is an invariant type parameter)',
      'Pro libovolné třídy A a B: pokud A <: B, pak Consumer[B] <: Consumer[A]',
    ],
    correct: [1, 3, 5],
    explanation:
      '<code>-T</code> = <strong>kontravariance</strong>: subtyping se u <code>Consumer</code> <em>otočí</em>. Z <code>A &lt;: B</code> plyne <code>Consumer[B] &lt;: Consumer[A]</code>.<ul>' +
      '<li>Možnost 2 (<code>Consumer[A] &gt;: Consumer[B]</code>) a možnost 6 (<code>Consumer[B] &lt;: Consumer[A]</code>) jsou <strong>totéž tvrzení</strong>, jen zapsané z druhé strany ⇒ obě ✔.</li>' +
      '<li>Možnost 3 popisuje kovarianci (<code>+T</code>) ✘.</li>' +
      '<li>Kovariantní/invariantní ✘, kontravariantní ✔.</li></ul>' +
      'Intuice: kdo umí zpracovat libovolné zvíře (<code>Consumer[Animal]</code>), zvládne i kočku ⇒ <code>Consumer[Animal]</code> lze použít tam, kde se čeká <code>Consumer[Cat]</code>. Ověřeno: <code>val x: Consumer[B] = Consumer[A]()</code> projde, opačně ne.<br>' +
      '<strong>Past:</strong> přehlédnout, že správně jsou <em>dvě</em> formulace téže relace.',
    verified: 'scala',
    sources: [
      ...pdf(6, 3),
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[-T] means that the class C is contravariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
      // sloučeno z duplicit: kv2-01, anki-42, wiki-k4-04
      { kind: 'image', src: '/sources/kvizy/q2/quiz_2_0.png', label: 'Kvíz 2 (2023/24, Discord) – screenshot', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'image', src: '/sources/kvizy/q2/quiz_2_2.png', label: 'Kvíz 2 (2023/24, Discord) – screenshot', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – BI-OOP (kvízy 2023/24 z Discordu)', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K4 (2024/25)', page: 'k4', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k4' },
      { kind: 'image', src: '/sources/wiki/2024-11-10_17-05.png', label: 'Kvíz K4 (2024/25) – screenshot' },
    ],
  },
  // ------------------------------------------------------------------ 7
  {
    id: 'sample-07',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
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

val v: B = C()
println(compute(v))`,
    answer: '320',
    explanation:
      '<ol>' +
      '<li><strong>Který <code>compute</code>?</strong> Statický typ <code>v</code> je <code>B</code> ⇒ <code>compute(obj: B)</code> (C by se vybralo jen pro statický typ C) ⇒ výsledek je <code>obj.z * 10</code>.</li>' +
      '<li><strong><code>obj.z</code> na objektu C</strong>: <code>z</code> je jen v A: <code>y + 2</code>, kde <code>y</code> = <code>this.y</code> ⇒ dynamicky <code>C.y</code>.</li>' +
      '<li><code>C.y</code> = <code>super.y * 10</code> ⇒ <code>A.y</code> = <code>x + 1</code>, kde <code>x</code> je opět <code>this.x</code> ⇒ <code>B.x</code> = 2 ⇒ <code>A.y</code> = 3 ⇒ <code>C.y</code> = 30.</li>' +
      '<li><code>z</code> = 30 + 2 = 32 ⇒ <code>compute(B)</code> = 32 · 10 = <strong>320</strong>.</li></ol>' +
      '<strong>Pravidlo:</strong> <code>super.y</code> skočí staticky do A, ale <em>uvnitř</em> A.y se <code>x</code> volá na <code>this</code>, tedy zase dynamicky (na C, které dědí B.x).<br>' +
      '<strong>Pasti:</strong> 132 (vybral bys <code>compute(C)</code>), 220 (vzal bys <code>x = 1</code> z A místo dynamického <code>B.x</code>).',
    verified: 'scala',
    sources: [
      ...pdf(7, 4),
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of this is dynamic - I can only' },
      { kind: 'slide', lecture: 'L2', page: 16, quote: 'The meaning of super is static - I always' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
    ],
  },
  // ------------------------------------------------------------------ 8
  {
    id: 'sample-08',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Sample midterm 2026 (oficiální)', 'FIT Wiki – Kvíz K4 (2024/25)', 'Kvíz 2 (2023/24, Discord) – varianta, kde Dog a Animal nemají vztah', 'Ukázkový midterm 2026, otázka 8'] },
    prompt:
      'Představte si generickou třídu <code>Collection[T]</code> reprezentující kolekci prvků typu <code>T</code>. Jaká varianční anotace je potřeba, aby se následující kód zkompiloval? Označte všechny správné odpovědi. <em>(What variance annotation is needed for the following code to compile?)</em>',
    code: `class Dog extends Animal

var dogs: Collection[Dog] = ...
var animals: Collection[Animal] = dogs`,
    options: ['Kovariance (Covariant)', 'Kontravariance (Contravariant)', 'Invariance (Invariant)', 'Zkompiluje se vždy (Will always compile)', 'Nezkompiluje se nikdy (Will never compile)'],
    correct: [0],
    explanation:
      'Přiřazení <code>Collection[Animal] = Collection[Dog]</code> potřebuje <code>Collection[Dog] &lt;: Collection[Animal]</code>. Víme <code>Dog &lt;: Animal</code>.<ul>' +
      '<li><code>+T</code> (kovariance) zachová směr ⇒ <code>Collection[Dog] &lt;: Collection[Animal]</code> ✔</li>' +
      '<li><code>-T</code> otočí směr ⇒ <code>Collection[Animal] &lt;: Collection[Dog]</code> ✘</li>' +
      '<li><code>T</code> (invariance, výchozí) ⇒ žádný vztah ✘ (<em>Found: Collection[Dog], Required: Collection[Animal]</em>)</li>' +
      '<li>„vždy“ ✘ (záleží na anotaci), „nikdy“ ✘ (s <code>+T</code> projde).</li></ul>' +
      'Ověřeno všemi třemi variantami. <strong>Past:</strong> v kvízu 2023/24 byla verze, kde Dog a Animal <em>nemají žádný vztah</em> – tam je správně „nezkompiluje se nikdy“. Vždy si přečti první řádek kódu.',
    verified: 'scala',
    sources: [
      ...pdf(8, 4),
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[+T] means that the class C is covariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
      // sloučeno z duplicit: wiki-k4-02
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K4 (2024/25)', page: 'k4', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k4' },
      { kind: 'image', src: '/sources/wiki/oop_marast_4_parametric_01.png', label: 'Kvíz K4 (2024/25) – screenshot' },
    ],
  },
  // ------------------------------------------------------------------ 9
  {
    id: 'sample-09',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
    code: `class A:
  def f(a: A): Int = 1

class B extends A:
  def f(b: B): Int = 2
  override def f(a: A): Int = 3

val x: A = B()
val y: B = B()

println(y.f(x))`,
    answer: '3',
    explanation:
      '<strong>Single dispatch: nejdřív signatura (kompilace), pak příjemce (běh).</strong><ol>' +
      '<li>Příjemce <code>y</code> má statický typ <code>B</code> ⇒ kandidáti jsou <code>f(b: B)</code> a <code>f(a: A)</code>.</li>' +
      '<li>Argument <code>x</code> má statický typ <code>A</code> ⇒ <code>f(b: B)</code> nejde (A není podtyp B) ⇒ vybrána signatura <strong><code>f(a: A)</code></strong>.</li>' +
      '<li>Za běhu je příjemce B a ten má override <code>f(a: A)</code> ⇒ <strong>3</strong>.</li></ol>' +
      '<strong>Past:</strong> 2 – „x je přece za běhu B“. Runtime typ <em>argumentu</em> se při výběru přetížení nikdy nebere v úvahu. A 1 by vyšlo jen, kdyby B metodu <code>f(a: A)</code> nepřepisovala.',
    verified: 'scala',
    sources: [
      ...pdf(9, 5),
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Runtime: for a virtual call, select the override for that signature' },
      { kind: 'slide', lecture: 'L2', page: 19 },
    ],
  },
  // ------------------------------------------------------------------ 10
  {
    id: 'sample-10',
    kind: 'output',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: [SAMPLE] },
    prompt: 'Co se vypíše? <em>(What will it print?)</em>',
    code: `class A:
  def m: Int = 1

class B extends A:
  override def m: Int = 2

class C extends B:
  override def m: Int = 3

class Consumer[-T]:
  def accept(x: T): Int = x.m

val consumer: Consumer[C] = Consumer[B]()
println(consumer.accept(C()))`,
    answer: 'CE',
    explanation:
      '<ol>' +
      '<li>Přiřazení <code>Consumer[C] = Consumer[B]()</code> je v pořádku: <code>-T</code> a <code>C &lt;: B</code> ⇒ <code>Consumer[B] &lt;: Consumer[C]</code>.</li>' +
      '<li>Problém je už v <strong>definici třídy</strong>: <code>T</code> nemá žádnou horní mez, takže uvnitř <code>Consumer</code> o něm kompilátor nic neví – <code>T</code> může být klidně <code>Int</code> nebo <code>Any</code>. Na <code>x: T</code> jdou volat jen metody <code>Any</code>.</li>' +
      '<li><code>x.m</code> ⇒ <strong>chyba kompilace</strong> (<em>value m is not a member of T</em>).</li></ol>' +
      '<strong>Past:</strong> spočítat dispatch a odpovědět 3. Kontroluj nejdřív, jestli se to vůbec přeloží – variance neříká nic o tom, jaké metody má <code>T</code>, to dělá jen bound. S <code>class Consumer[-T &lt;: A]</code> by se vypsalo <code>3</code> (dynamicky <code>C.m</code>) – ověřeno.',
    verified: 'scala',
    sources: [
      ...pdf(10, 5),
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
    ],
  },
]
