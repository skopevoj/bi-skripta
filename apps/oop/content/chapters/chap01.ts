import type { Chapter } from '../types'

export const chap01: Chapter = {
  id: 'chap-1',
  number: '1',
  title: 'Principy OOP',
  lecture: 'L1',
  summary:
    'Umět pojmenovat symptomy špatného návrhu, vysvětlit coupling a cohesion, říct, co je objekt, a porovnat ADT s objekty na příkladu množin: co je v kterém stylu levné a co drahé.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-1',
      number: '1.1',
      title: 'Návrh je o změně: symptomy hnijícího designu',
      blocks: [
        {
          kind: 'p',
          html: 'Základní teze přednášky: <strong>software design je celý o změně</strong>. Kdyby kód nikdo nemusel měnit, na jeho návrhu by nezáleželo. Dobrý návrh se měří tím, jak snadno přijme změnu – a změna začíná tím, že kód pochopíš. Pochopení je pomalé, takže chceme zmenšit objem kódu, který musíš chápat najednou.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 29, quote: 'If no one needs to touch the code (because it is' },
            {
              kind: 'slide',
              doc: 'L1',
              page: 32,
              quote: 'We need strategies to reduce the volume of code we need to understand at once.',
            },
            { kind: 'slide', doc: 'L1', page: 35, quote: 'Minimize the amount of knowledge you need to have before' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Symptomy hnijícího designu (Rotting Design)',
          html: '<ul><li><strong>Rigidity</strong> – kód se těžko mění i v jednoduchých věcech; každá změna vyvolá kaskádu dalších změn v závislých modulech.</li><li><strong>Fragility</strong> – při každé změně se software rozbije na mnoha místech, často i tam, kde se změnou koncepčně nesouvisí.</li><li><strong>Immobility</strong> – kód nejde znovu použít v jiném projektu ani v jiné části téhož projektu.</li><li><strong>High design viscosity</strong> – postup, který zachovává návrh, je pracnější než hack. Špatnou věc je snadné udělat, správnou těžké.</li><li><strong>High environment viscosity</strong> – pomalé, neefektivní prostředí (např. dlouhá kompilace) vede k menším, horším změnám.</li></ul>',
          sources: [
            {
              kind: 'slide',
              doc: 'L1',
              page: 42,
              quote: 'the tendency for software to be difficult to change, even in simple ways',
            },
            {
              kind: 'slide',
              doc: 'L1',
              page: 42,
              quote: 'the tendency of the software to break in many places every time it is changed',
            },
            {
              kind: 'slide',
              doc: 'L1',
              page: 42,
              quote: 'inability to reuse software from other projects or from parts of the same project',
            },
            {
              kind: 'slide',
              doc: 'L1',
              page: 42,
              quote: 'it is easy to do the wrong thing, but hard to do the right thing',
            },
            { kind: 'slide', doc: 'L1', page: 42, quote: 'when the development environment is slow and inefficient' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Rigidity vs. fragility',
          html: 'Obojí se týká změny, ale liší se výsledkem. <strong>Rigidity</strong>: změnu musíš <em>propsat</em> do mnoha závislých modulů (je to pracné). <strong>Fragility</strong>: změnu uděláš, ale <em>rozbije</em> se něco jinde, často nesouvisejícího.',
          sources: [{ kind: 'slide', doc: 'L1', page: 42 }],
        },
        {
          kind: 'p',
          html: 'Oddělování kódu ale není zadarmo. Každá abstrakce je <strong>spekulace</strong>, že flexibilitu budeš později potřebovat, odvádí pozornost od hlavního problému, nová vrstva obvykle stojí výkon a organizaci kódu je třeba udržovat. Doporučený postup: <em>make it work → make it right → make it fast</em>.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 37, quote: 'it is essentially a speculation that you will need the' },
            { kind: 'slide', doc: 'L1', page: 37, quote: 'every new layer of abstraction can (and usually' },
            { kind: 'slide', doc: 'L1', page: 38 },
          ],
        },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-2',
      number: '1.2',
      title: 'Coupling a cohesion',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Coupling a cohesion',
          html: '<strong>Coupling</strong> – míra vzájemné závislosti modulů. Dva kusy kódu jsou coupled, když jeden nepochopíš bez pochopení druhého. Čím méně couplingu, tím méně se nutná změna šíří (ripple) do zbytku kódu.<br><strong>Cohesion</strong> – jak moc k sobě patří prvky uvnitř jednoho modulu (malé metody, související činnosti).<br><strong>Cíl: vysoká cohesion, nízký coupling.</strong>',
          sources: [
            { kind: 'slide', doc: 'L1', page: 33, quote: 'understand one without understanding the other.' },
            { kind: 'slide', doc: 'L1', page: 33, quote: 'coupling we have, the less that change ripples' },
            { kind: 'slide', doc: 'L5', page: 25, quote: 'how much elements inside a module belong together?' },
            { kind: 'slide', doc: 'L5', page: 25, quote: 'what is the interdependence between modules?' },
            { kind: 'slide', doc: 'L5', page: 25, quote: 'Aim at high cohesion and low coupling' },
          ],
        },
        {
          kind: 'p',
          html: 'Proč na tom záleží: velká část návrhu je <strong>správa závislostí</strong> – rozmístit kód tak, aby závislosti nevedly na podivná, nečekaná místa. Architektura není ani tak o funkcionalitě, jako o organizaci kódu, která umožňuje údržbu.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 34, quote: 'Much of software design is managing' },
            { kind: 'slide', doc: 'L1', page: 34, quote: 'do not run to strange and unexpected places.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Polymorfismus obrací závislosti',
          html: 'Bez abstrakce závislosti kopírují tok řízení: <code>main</code> → high-level → mid-level → low-level moduly. Když modul M nezávisí přímo na N, ale na <strong>rozhraní</strong>, které N implementuje, šipka M → N zmizí a M je od N oddělený (decoupled).',
          sources: [
            { kind: 'slide', doc: 'L1', page: 92, quote: 'The dependencies follow the control' },
            { kind: 'slide', doc: 'L1', page: 93, quote: 'Polymorphism which allows us to reverse the dependencies!' },
          ],
        },
        {
          kind: 'p',
          html: 'Shrnutí přednášky: OOP pomáhá s disciplínou – organizovat kód tak, aby byl cohesive, znovu používat kód přes dědičnost a řídit závislosti, aby byl decoupled. Je to ale dvousečná zbraň: každá vrstva abstrakce stojí údržbu i výkon.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 94, quote: 'organize code so we can write cohesive code' },
            { kind: 'slide', doc: 'L1', page: 94, quote: 'manage dependencies so we can decouple code' },
          ],
        },
        { kind: 'quiz', ids: ['ch1-01', 'ch1-03', 'ch1-02'], title: 'Ověř si: design a coupling' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-3',
      number: '1.3',
      title: 'Co je objekt',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Objekt',
          html: '<strong>Objekt je hodnota, jejíž celé veřejné rozhraní tvoří množina procedur.</strong> Nic dalšího není potřeba – žádná třída, dědičnost, ani statický typový systém; stačí first-class funkce. Objekt skrývá data <em>procedurální</em> abstrakcí (za funkcemi), ne typovou.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 74, quote: 'An object is a value whose entire public surface is a set' },
            { kind: 'slide', doc: 'L1', page: 74, quote: 'Objects hide with procedural abstraction, not type abstraction.' },
            { kind: 'slide', doc: 'L1', page: 74, quote: 'They need no static type system at all' },
          ],
        },
        {
          kind: 'p',
          html: 'Přednáška to staví od nuly: objekt = <strong>record funkcí</strong> (closures), které sdílejí skrytý stav. Aby metoda mohla volat jiné metody téhož objektu, potřebuje odkaz na „hotový“ objekt – <code>this</code>/<code>self</code>. Ten se získá jako pevný bod (fixed point) – proto Y/Z kombinátor: je to jen trik, jak udělat rekurzi (odkaz na sebe) bez jména; v reálném jazyce to za tebe při konstrukci objektu udělá runtime a výsledek nazve <code>this</code>.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 61, quote: 'Remaining question: how do you take a fixed point of something' },
            { kind: 'slide', doc: 'L1', page: 64, quote: 'In a real object-oriented language you never write this' },
            { kind: 'slide', doc: 'L1', page: 70, quote: 'a record of closures, plus a fixed point for self.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Pět vlastností objektově orientovaného jazyka',
          html: '<ol><li><strong>Multiple representations</strong> – kód vybírá objekt, ne místo volání (jedno rozhraní, různé reprezentace).</li><li><strong>Encapsulation</strong> – stav je dosažitelný jen přes metody.</li><li><strong>Subtyping</strong> – objekt s více metodami může stát tam, kde se čeká méně metod.</li><li><strong>Inheritance</strong> – sdílení těl metod mezi třídami.</li><li><strong>Open recursion</strong> – <code>self</code> se váže až při vytvoření objektu, takže zděděná metoda volající <code>self.m()</code> zavolá i přepsanou verzi <code>m</code>.</li></ol>Třída jako typ, <code>new</code>, mutable state ani dispatch table mezi podstatné vlastnosti nepatří.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 75 },
            { kind: 'slide', doc: 'L1', page: 78, quote: 'The state is reachable only through the methods.' },
            { kind: 'slide', doc: 'L1', page: 80, quote: 'A record with more fields may stand in for one with fewer.' },
            { kind: 'slide', doc: 'L1', page: 70 },
          ],
        },
        {
          kind: 'p',
          html: 'Pro midterm je z toho nejdůležitější <strong>open recursion</strong>: přesně ona stojí za tím, že v „co to vypíše“ úlohách zděděná metoda zavolá přepsanou metodu podtřídy. Přednáška ukazuje čítač, kde zděděné <code>inc</code> volá <code>set</code> – a podtřída, která přepíše jen <code>set</code>, tím změní chování i <code>inc</code>. Ve Scale vypadá stejná věc takto:',
          sources: [
            { kind: 'slide', doc: 'L1', page: 83, quote: 'That is open recursion. It is also the whole of' },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Open recursion: zděděné inc volá přepsané set (podle InstrCounter z přednášky)',
          code: `class SetCounter:
  protected var x = 1
  def get(): Int = x
  def set(i: Int): Unit = x = i
  def inc(): Unit = set(get() + 1)      // volá this.set – pozdní vazba

class InstrCounter extends SetCounter:
  var accesses = 0
  override def set(i: Int): Unit =
    accesses += 1
    super.set(i)

@main def run() =
  val ic = InstrCounter()
  ic.inc()
  ic.inc()
  println(ic.get())       // 3
  println(ic.accesses)    // 2 – zděděné inc spustilo PŘEPSANÉ set`,
          sources: [{ kind: 'slide', doc: 'L1', page: 83 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Proč je dědičnost křehká',
          html: 'Stačí v nadtřídě změnit, které metody volá sama na sobě (třeba <code>inc</code> přestane volat <code>set</code> a zapíše <code>x</code> přímo), a každá podtřída tiše změní chování – <code>accesses</code> by zůstalo 0, aniž by kdo sáhl na <code>InstrCounter</code>.',
          sources: [{ kind: 'slide', doc: 'L1', page: 83, quote: 'And it is why inheritance is fragile: change' }],
        },
        { kind: 'quiz', ids: ['ch1-05', 'ch1-04', 'ch1-06'], title: 'Ověř si: objekty' },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-4',
      number: '1.4',
      title: 'Datová abstrakce: ADT vs. objekty',
      blocks: [
        {
          kind: 'p',
          html: '<strong>Datová abstrakce</strong> = jakýkoli mechanismus, který skrývá, jak jsou data implementována. Existují dvě formy: <strong>abstraktní datové typy (ADT)</strong> a <strong>objekty</strong>. Ani jedno není variantou druhého – doplňují se: silné stránky jednoho jsou slabinami druhého.',
          sources: [
            {
              kind: 'slide',
              doc: 'L1',
              page: 49,
              quote: 'Objects and abstract data types are two different forms of data abstraction.',
            },
            {
              kind: 'slide',
              doc: 'L1',
              page: 49,
              quote: 'They are complementary: the strengths of one are the weaknesses of the other.',
            },
          ],
        },
        {
          kind: 'p',
          html: 'Běžící příklad: množina celých čísel s operacemi <code>empty</code>, <code>isEmpty</code>, <code>insert</code>, <code>contains</code>, <code>union</code>. Sleduj <code>union</code> – jako jediná pracuje se <em>dvěma</em> množinami najednou (binární operace) a z ní plyne většina rozdílů.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 50, quote: 'It is the only operation that touches two sets at once.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'ADT (C: set.h + set.c)',
          html: 'Veřejné jméno typu, <strong>skrytá reprezentace</strong> (opaque pointer <code>struct set_rep*</code>) a operace. Skrývání zajišťuje <strong>typová abstrakce</strong> hlídaná překladačem. V celém programu má každá množina <strong>jednu</strong> reprezentaci (seřazený seznam) a každá operace smí nahlédnout dovnitř – <code>set_union</code> čte <code>s1-&gt;head</code> i <code>s2-&gt;head</code> naráz, a proto umí lineární merge.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 51 },
            { kind: 'slide', doc: 'L1', page: 52, quote: 'One representation type. Every set in the whole' },
            { kind: 'slide', doc: 'L1', page: 53, quote: 'The ability to inspect several representations' },
            {
              kind: 'slide',
              doc: 'L1',
              page: 54,
              quote: 'The hiding mechanism is type abstraction, enforced by the compiler.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Cena ADT',
          html: '<ul><li><strong>Jedna implementace na program.</strong> Jméno <code>set</code> je globálně svázané s jednou reprezentací. Druhou implementaci (<code>set2</code>) musíš přejmenovat a hodnoty obou nejde míchat – <code>union(set, set2)</code> nejde ani napsat.</li><li><strong>Žádné nové druhy množin.</strong> Přidat „všechna sudá čísla“ znamená přidat do reprezentace tag, do každé operace větev (do <code>union</code> větev pro každou <em>dvojici</em> variant) a překompilovat všechno.</li></ul>Nové operace jsou levné, nové druhy hodnot ne.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 55, quote: 'The type name set is globally bound to one hidden' },
            { kind: 'slide', doc: 'L1', page: 56, quote: 'New operations are cheap, new kinds of value are not.' },
          ],
        },
        {
          kind: 'p',
          html: 'Objektový pohled to otočí: množina <em>je</em> svou charakteristickou funkcí. Nic se neskrývá za typem, všechno se skrývá za funkcí – operace <code>contains</code> neexistuje, množina <em>je</em> operace <code>contains</code>.',
          sources: [
            { kind: 'slide', doc: 'L1', page: 57, quote: 'There is no contains operation, the set is the' },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Množina jako funkce Int => Boolean (podle slajdu 57)',
          code: `type ISet = Int => Boolean

val Empty: ISet = i => false
def Insert(s: ISet, n: Int): ISet = i => i == n || s(i)
def Union(s1: ISet, s2: ISet): ISet = i => s1(i) || s2(i)

@main def run() =
  val b = Insert(Insert(Empty, 1), 3)
  val evens: ISet = i => i % 2 == 0
  println(b(3))               // true
  println(Union(b, evens)(8)) // true
  println(b(8))               // false`,
          sources: [{ kind: 'slide', doc: 'L1', page: 57 }],
        },
        {
          kind: 'p',
          html: 'Rozšířením na record funkcí (<code>isEmpty</code>, <code>contains</code>, <code>insert</code>, <code>union</code>) dostaneme objektové rozhraní. Přednáška ho píše jako record funkcí s ručním <code>fix</code>; ve Scale je přirozené použít trait (dědičnost tu jen ušetří opakování <code>insert</code>/<code>union</code> – je to pohodlí, ne podstata):',
          sources: [
            { kind: 'slide', doc: 'L1', page: 58, quote: 'are all public. The hiding is procedural.' },
            { kind: 'slide', doc: 'L1', page: 65, quote: 'the repetition in insert/union, it is convenient, not' },
          ],
        },
        {
          kind: 'code',
          runnable: true,
          caption: 'Objektové množiny: různé reprezentace spolupracují (výstup jako na slajdu 69)',
          code: `// Objektové rozhraní množiny: jen chování, žádná reprezentace.
trait ISet:
  def isEmpty: Boolean
  def contains(i: Int): Boolean
  def insert(i: Int): ISet = Insert(this, i)
  def union(s: ISet): ISet = Union(this, s)

object Empty extends ISet:
  def isEmpty = true
  def contains(i: Int) = false
  override def union(s: ISet) = s           // lokální optimalizace

class Insert(s: ISet, n: Int) extends ISet:
  def isEmpty = false
  def contains(i: Int) = i == n || s.contains(i)

class Union(s1: ISet, s2: ISet) extends ISet:
  def isEmpty = s1.isEmpty && s2.isEmpty
  def contains(i: Int) = s1.contains(i) || s2.contains(i)

// Nové reprezentace – nic existujícího se nemění:
object Even extends ISet:
  def isEmpty = false
  def contains(i: Int) = i % 2 == 0

class Interval(n: Int, m: Int) extends ISet:
  def isEmpty = n > m
  def contains(i: Int) = n <= i && i <= m

@main def run() =
  val a = Empty.insert(3).insert(1)
  val b = a.union(Interval(10, 12)).union(Even)
  println(b.contains(3))     // true  – z a
  println(b.contains(11))    // true  – z intervalu
  println(b.contains(7))     // false – nikdo
  println(b.contains(1000))  // true  – z nekonečné množiny Even`,
          sources: [
            { kind: 'slide', doc: 'L1', page: 68, quote: 'Nothing that already existed is edited, recompiled, or even read' },
            { kind: 'slide', doc: 'L1', page: 69 },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Kontrakt čistého objektu',
          html: 'Objekt sahá na jiné objekty <strong>jen přes jejich veřejné rozhraní</strong>. Svou reprezentaci zná, všechny ostatní objekty jsou pro něj abstraktní. <code>Union</code> proto neumí merge – všechno, co ví o <code>s1</code> a <code>s2</code>, zjistil voláním jejich metod. Vytvořit sjednocení je levné, používat ho drahé.',
          sources: [
            {
              kind: 'slide',
              doc: 'L1',
              page: 67,
              quote: 'An object reaches other objects only through their public interfaces.',
            },
            {
              kind: 'slide',
              doc: 'L1',
              page: 66,
              quote: 'Everything it knows about s1 and s2, it learned by calling them.',
            },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Cena objektů',
          html: '<ul><li><strong>Binární operace jsou těžké.</strong> <code>intersect</code> nedokáže odpovědět na <code>isEmpty</code>; standardní oprava (přidat iterátor) vyřadí nekonečné množiny jako <code>Even</code>. Dobrá rozhraní se navrhují těžko.</li><li><strong>Optimalizace jen lokálně.</strong> ADT optimalizuje napříč reprezentacemi (merge), objekt jen sám u sebe (<code>Empty.union</code> = identita).</li><li><strong>Nic není zadarmo</strong> – žádná rovnost, tisk ani serializace, pokud je rozhraní nenabízí.</li><li><strong>Verifikace.</strong> Objekt <code>Bad</code> s náhodným <code>isEmpty</code> má přesně správný typ, ale není to množina. Typy hlídají strukturu, ne specifikaci.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'L1', page: 71, quote: 'Good interfaces are hard to design.' },
            { kind: 'slide', doc: 'L1', page: 72, quote: 'With abstract data types you optimise across representations.' },
            { kind: 'slide', doc: 'L1', page: 72, quote: 'With objects you optimise locally.' },
            { kind: 'slide', doc: 'L1', page: 87, quote: 'No equality, no printing, no serialisation,' },
            { kind: 'slide', doc: 'L1', page: 73, quote: 'Type systems enforce structure, not specification.' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Problém rozšiřitelnosti (matice)',
          html: 'Představ si matici: <strong>řádky = reprezentace</strong> (Empty, Insert, Union, Even), <strong>sloupce = operace</strong> (isEmpty, contains, insert, union).<ul><li><strong>Objekt</strong> seskupuje po řádcích → nová <em>reprezentace</em> je levná (jedna nová hodnota), nová <em>operace</em> drahá (rozbije všechny implementace).</li><li><strong>ADT</strong> seskupuje po sloupcích → nová <em>operace</em> je levná (jedna nová funkce), nová <em>reprezentace</em> drahá (větev v každé operaci).</li></ul>ADT skrývá typem, objekt funkcemi (scope).',
          sources: [
            { kind: 'slide', doc: 'L1', page: 86, quote: 'an object groups by row:' },
            { kind: 'slide', doc: 'L1', page: 86, quote: 'an ADT groups by column:' },
            { kind: 'slide', doc: 'L1', page: 84 },
            { kind: 'slide', doc: 'L1', page: 85 },
          ],
        },
        {
          kind: 'p',
          html: 'Reálné jazyky obojí míchají: v C se dají psát objekty (record ukazatelů na funkce + <code>self</code>, např. <code>struct file_operations</code> v Linuxu), v Javě ADT – jakmile použiješ jméno <em>třídy</em> jako typ, zvolil jsi ADT.',
          sources: [
            {
              kind: 'slide',
              doc: 'L1',
              page: 88,
              quote: 'The moment a class name is used as a type, you have chosen an',
            },
          ],
        },
        { kind: 'quiz', ids: ['ch1-07', 'ch1-08'], title: 'Ověř si: ADT vs. objekty' },
      ],
    },
  ],
}
