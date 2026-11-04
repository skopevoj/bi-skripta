import type { Question, SourceRef } from '../types'

// Kvízy 6–10 (2023/24, screenshoty z FIT Discordu).
// Kvíz 6 = výjimky, 7 = testování, 8 = refaktoring + návrhové vzory, 9 = reflexe → mimo rozsah midtermu.
// V rozsahu je jen kvíz 10 (dispatch, class-based vs prototype-based dědičnost).

const SEEN = ['Kvíz 10 (2023/24, Discord)']

// Původní zdroj: oop.zip na FIT Wiki (kvízy poscrapované z FIT Discordu).
// Přímé URL oop.zip vrací anonymně 403/400 → odkaz na stránku, kde je soubor uveden.
const ZIP_URL = 'https://fit-wiki.cz/škola/předměty/bi-oop'
const WIKI: SourceRef = {
  kind: 'wiki',
  label: 'FIT Wiki – BI-OOP (kvízy 2023/24 z Discordu)',
  url: 'https://fit-wiki.cz/škola/předměty/bi-oop',
}
const shots = (...files: string[]): SourceRef[] => [
  ...files.map(
    (f): SourceRef => ({
      kind: 'image',
      src: `/sources/kvizy/q10/${f}`,
      label: 'Kvíz 10 (2023/24, Discord) – screenshot',
      url: ZIP_URL,
    }),
  ),
  WIKI,
]

export const kvizyB: Question[] = [
  {
    id: 'kv10-01',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 10 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Single dispatch:',
    options: [
      'Volá dynamicky podle prvního argumentu a staticky na zbytek.',
      'Je volání užitečné pouze pro OOP s jednoduchou dědičností.',
      'Volá staticky podle typu prvního argumentu a dynamicky na zbytek.',
      'Je hybrid mezi statickým a dynamickým voláním.',
    ],
    correct: [0, 3],
    explanation: `Volání <code>x.m(a, b)</code> ber jako <code>m(x, a, b)</code> — příjemce <code>x</code> je „první argument“.
<ol>
<li><strong>Při kompilaci</strong> se podle <em>statických</em> typů <code>x</code>, <code>a</code>, <code>b</code> vybere signatura (overload).</li>
<li><strong>Za běhu</strong> se pro tuto signaturu vybere override podle <em>runtime</em> třídy příjemce. Runtime typy <code>a</code>, <code>b</code> se už neuvažují.</li>
</ol>
Takže: dynamicky podle prvního argumentu (příjemce), staticky podle zbytku → možnost 1 platí, a protože kombinuje obojí, je to hybrid → možnost 4 platí.<br>
<strong>Past:</strong> možnost 3 je přesně obráceně. Možnost 2 nedává smysl — single dispatch funguje stejně i s traity / vícenásobnou dědičností rozhraní (Scala, Java).`,
    verified: 'slides',
    sources: [
      ...shots('quiz_10_0.png', 'quiz_10_3.png', 'quiz_10_4.png'),
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'do not reconsider explicit argument types' },
      { kind: 'slide', lecture: 'L2', page: 74 },
      // sloučeno z duplicit: anki-88
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv10-02',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 10 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'V dynamickém volání (dynamic dispatch):',
    options: [
      'Je výchozí volání v jazyce Scala.',
      'Je k dispozici pouze v dynamických jazycích.',
      'Skutečná metoda, která se bude volat, se řeší až za běhu.',
      'Jaká metoda se zavolá, závisí na aktuálně použitých hodnotách argumentů za běhu programu.',
      'Je výchozí volání v jazyce C++.',
    ],
    correct: [0, 2, 3],
    explanation: `<ul>
<li><strong>Výchozí ve Scale — ano.</strong> Na JVM je většina volání dynamická; výjimky jsou jen <code>private</code> a <code>final</code> metody a metody companion objectu.</li>
<li><strong>Jen v dynamických jazycích — ne.</strong> Scala i Java jsou staticky typované, a přesto mají dynamic dispatch (override).</li>
<li><strong>Řeší se až za běhu — ano.</strong> To je definice.</li>
<li><strong>Závisí na runtime hodnotách argumentů — ano</strong>, v obecné definici (jako v kvízu na single dispatch se příjemce počítá jako první argument). <strong>Pozor:</strong> ve Scale (single dispatch) rozhoduje jen runtime třída <em>příjemce</em>, runtime typy ostatních argumentů ne — overload se vybere staticky.</li>
<li><strong>Výchozí v C++ — ne.</strong> V C++ jsou metody defaultně nevirtuální (statický dispatch), dynamický je až s <code>virtual</code>.</li>
</ul>`,
    verified: 'slides',
    sources: [
      ...shots('quiz_10_3.png', 'quiz_10_6.png'),
      { kind: 'slide', lecture: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'for a virtual call, select the override for that signature' },
      // sloučeno z duplicit: anki-85
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv10-03',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 10 (2023/24, Discord)', 'FIT Wiki – Marast 2021/22 (mix)'] },
    prompt: 'Ve statickém volání (static dispatch):',
    options: [
      'Je to výchozí volání metod ve Scale.',
      'Metoda musí být statická, tj. definována ve Scala <code>object</code>.',
      'V traitech se volání <code>super</code> řeší staticky.',
      'Vlastní metoda je vyřešena v době kompilace.',
    ],
    correct: [3],
    explanation: `<ul>
<li><strong>Výchozí ve Scale — ne.</strong> Výchozí je dynamický dispatch; staticky jen <code>private</code>, <code>final</code> a metody companion objectu.</li>
<li><strong>Musí být v <code>object</code> — ne.</strong> Staticky se volají i <code>private</code> a <code>final</code> metody obyčejné třídy.</li>
<li><strong><code>super</code> v traitu staticky — ne (to je ta past).</strong> Ve <em>třídě</em> je <code>super</code> statický (vždy přímý předek). V <em>traitu</em> je <code>super</code> late-bound: kam vede, určí až linearizace konkrétní třídy, do které trait vmícháš. Stejný kód <code>trait T extends Base { override def m = "T>" + super.m }</code> dá v <code>new Base with T</code> výsledek <code>T&gt;Base</code>, ale v <code>new Base with Mid with T</code> výsledek <code>T&gt;Mid&gt;Base</code> (ověřeno ve scala-cli).</li>
<li><strong>Vyřešena při kompilaci — ano.</strong> To je definice statického volání: cíl je pevný.</li>
</ul>
Na screenshotu student označil i možnost se <code>super</code> v traitu a dostal jen 1 bod ze 2 — správně je pouze poslední možnost.`,
    verified: 'slides',
    sources: [
      ...shots('quiz_10_5.png'),
      { kind: 'slide', lecture: 'L2', page: 22, quote: 'On JVM, most dispatch is dynamic with some' },
      { kind: 'slide', lecture: 'L6', page: 46, quote: 'the calls to super are resolved dynamically (unlike in a class where it is static)' },
      { kind: 'slide', lecture: 'L6', page: 58, quote: 'In traits super uses late binding - dispatched dynamically' },
      // sloučeno z duplicit: wiki-marast_2021_2022_mix-05
      { kind: 'wiki', label: 'FIT Wiki – Marast 2021/22 (mix)', page: 'marast_2021_2022_mix', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_2021_2022_mix' },
      { kind: 'image', src: '/sources/wiki/bi-oop_21-22_quiz09.jpg', label: 'Marast 2021/22 – screenshot (static dispatch)' },
    ],
  },
  {
    id: 'kv10-04',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: SEEN },
    prompt: 'Class-based (CBI) vs prototype-based inheritance (PBI). Která tvrzení platí?',
    options: [
      'Každý čistě objektově orientovaný jazyk je postavený na PBI.',
      'Každý čistě objektově orientovaný jazyk je postavený na CBI.',
      'Pro CBI platí, že každý objekt je instancí nějaké třídy.',
      'Pro PBI platí, že každý objekt má prototype.',
      'Pro PBI platí, že každý objekt je instancí jediné třídy.',
    ],
    correct: [2, 3],
    explanation: `Hierarchie OOP z přednášky: objektově orientované jazyky se dělí na <em>class-based</em> a <em>object-based</em> (prototypy, closures). Ani jedna větev není „ta jediná správná“ → obě tvrzení „každý čistě OO jazyk je postavený na …“ jsou špatně (čistě OO je Smalltalk = CBI i Self = PBI).
<ul>
<li><strong>CBI:</strong> objekt je runtime instance nějaké třídy — ano.</li>
<li><strong>PBI:</strong> objekt nemá třídu, má prototyp (jiný objekt), na který deleguje — ano. (Detail: na konci řetězce je prototyp <code>null</code>; kvíz to ale bere jako platné.)</li>
<li>„V PBI je každý objekt instancí jediné třídy“ — ne, v PBI třídy vůbec nejsou; to je popis CBI.</li>
</ul>`,
    verified: 'reasoning',
    sources: [
      ...shots('quiz_10_2.png', 'quiz_10_5.png'),
      { kind: 'slide', lecture: 'L1', page: 96 },
      { kind: 'slide', lecture: 'L2', page: 11, quote: 'In the class-based system, it is a runtime instance of some class' },
      { kind: 'slide', lecture: 'L2', page: 12, quote: 'In this course we will focus primarily on class-based languages' },
    ],
  },
  {
    id: 'kv10-05',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: SEEN },
    prompt: 'Class-based (CBI) vs prototype-based inheritance (PBI). Která tvrzení platí?',
    options: [
      'JavaScript implementuje PBI.',
      'C++ implementuje PBI.',
      'Smalltalk implementuje CBI.',
      'Scala implementuje CBI.',
    ],
    correct: [0, 2, 3],
    explanation: `<ul>
<li><strong>JavaScript — PBI.</strong> Objekty dědí přes řetězec prototypů; i syntaxe <code>class</code> (ES6) je jen cukr nad prototypy.</li>
<li><strong>C++ — CBI</strong>, ne PBI: objekty vznikají z tříd.</li>
<li><strong>Smalltalk — CBI</strong>: čistě OO a všechno je instance nějaké třídy (i třída sama).</li>
<li><strong>Scala — CBI</strong>: třídy (+ traity) jsou šablony objektů a zároveň typy.</li>
</ul>
<strong>Past:</strong> „čistě OO“ neznamená „prototypový“ — Smalltalk je čistě OO a je class-based.`,
    verified: 'reasoning',
    sources: [
      ...shots('quiz_10_6.png'),
      { kind: 'slide', lecture: 'L1', page: 96 },
      { kind: 'slide', lecture: 'L2', page: 12, quote: 'In this course we will focus primarily on class-based languages' },
    ],
  },
  {
    id: 'kv10-06',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: SEEN },
    prompt: 'Prototype-based inheritance. Která tvrzení platí? <em>(V kvízu se losovaly vždy 4 z těchto možností.)</em>',
    options: [
      'Každý objekt má prototype, který je navštíven v případě, že odpovídající atribut není nalezen na instanci daného objektu.',
      'Funkce mohou sloužit jako konstruktory objektů.',
      'Ke „code reuse“ slouží duplikace kódu.',
      'Ke „code reuse“ slouží prototypy.',
      'K zapouzdření se používají prototypy.',
      'K zapouzdření mohou sloužit closures.',
      'Objekt je v podstatě mapa, klíče jsou symboly (jména atributů/metod) a hodnoty jsou samotné hodnoty atributů (data, metody).',
    ],
    correct: [0, 1, 3, 5, 6],
    explanation: `Představ si JavaScript:
<ul>
<li><strong>Objekt = mapa</strong> jméno → hodnota (data i funkce) — ano.</li>
<li><strong>Lookup:</strong> nenajde-li se atribut na instanci, hledá se v prototypu (a dál po řetězci) — ano.</li>
<li><strong>Code reuse</strong> zajišťují prototypy: metodu dáš jednou do prototypu a sdílí ji všechny objekty → ano; duplikace kódu je opak reuse → ne.</li>
<li><strong>Funkce jako konstruktor</strong> (<code>function Animal(n) { this.name = n }</code>, <code>new Animal("a")</code>) — ano. Stejná myšlenka je v přednášce: „třída“ je jen funkce, která vrací record.</li>
<li><strong>Zapouzdření:</strong> prototyp nic neskrývá (je to normální veřejný objekt) → ne. Skrytý stav dělají closures: lokální proměnná, na kterou vidí jen funkce v objektu → ano.</li>
</ul>`,
    verified: 'reasoning',
    sources: [
      ...shots('quiz_10_0.png', 'quiz_10_1.png', 'quiz_10_4.png'),
      { kind: 'slide', lecture: 'L1', page: 96 },
      { kind: 'slide', lecture: 'L1', page: 65, quote: 'A class, here, is nothing but a function that returns a record.' },
      { kind: 'slide', lecture: 'L1', page: 78, quote: 'The state is reachable only through the methods.' },
      { kind: 'slide', lecture: 'L1', page: 78, quote: 'An object hides it with a scope, and there is nothing left to enforce' },
    ],
  },
  {
    id: 'kv10-07',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: SEEN },
    prompt: 'Předpokládejte prototype-based inheritance. Pokud na instanci objektu zavoláme metodu či vyžádáme atribut, stane se…',
    options: [
      'Daný prvek (member field) je hledán nejprve na instanci, pokud hledání neuspěje, je hledán v prototypu instance a pokud hledání neuspěje, pokračuje se po řetězu prototypů, dokud se nenajde nebo nenarazí na konec.',
      'Daný prvek (member field) je hledán pouze na instanci. Pokud hledání selže, musí dojít k chybě běhu programu.',
      'Nehledě na to, kde v řetězu prototypů (prototype chain) je metoda nalezena, bude za hodnotu <code>this</code> brána původní instance, na které hledání začalo.',
      'Daný prvek (member field) je hledán pouze na instanci, pokud je to atribut. Pokud je to metoda, případný neúspěch způsobí hledání v prototypu dané instance, kde je metoda buďto nalezena, nebo dojde k chybě běhu programu.',
    ],
    correct: [0, 2],
    explanation: `<ol>
<li>Lookup jde <strong>instance → prototyp → prototyp prototypu → …</strong> až do konce řetězce. Atributy a metody se hledají stejně (metoda je jen atribut, jehož hodnota je funkce) → možnost 1 ano, možnosti 2 a 4 ne (hledá se dál než na instanci a ne jen o jednu úroveň).</li>
<li><code>this</code> je vždy <strong>původní příjemce</strong>, ne objekt, kde se metoda našla → možnost 3 ano. Díky tomu metoda v prototypu pracuje s daty konkrétní instance (<code>a.speak()</code> vypíše jméno <code>a</code>) — je to totéž „late binding of self“ jako u <code>this</code> v class-based jazycích.</li>
</ol>`,
    verified: 'reasoning',
    sources: [
      ...shots('quiz_10_2.png'),
      { kind: 'slide', lecture: 'L1', page: 96 },
    ],
  },
  {
    id: 'kv10-08',
    kind: 'mc',
    topic: 'principy',
    lecture: 'L1',
    origin: { type: 'real', seen: SEEN },
    prompt: 'Předpokládejte prototype-based inheritance. Co platí o atributech a metodách prototypů?',
    options: [
      'Pokud změníme hodnotu atributu v prototypu přes jednu konkrétní instanci, změníme tuto hodnotu pro všechny existující i budoucí instance se stejným prototypem.',
      'V době běhu programu už nesmíme do prototypu nic přidávat.',
      'Změnou hodnoty atributu v prototypu přes jednu konkrétní instanci nemůžeme ovlivnit stavy existujících instancí, změna se projeví jen pro naši instanci a všechny nově vzniklé.',
      'V době běhu smíme do prototypu cokoliv přidat pouze a jedině, pokud zatím neexistuje žádná instance s daným prototypem. Jinak bychom vytvořili nekonzistentní stav.',
    ],
    correct: [0],
    explanation: `Prototyp je <strong>jeden sdílený objekt</strong>; instance si ho nekopírují, jen na něj odkazují. Kdo ho změní (ať přes kteroukoli instanci), změní ho všem — existujícím i budoucím → možnost 1 ano, možnost 3 ne.<br>
Prototyp je obyčejný objekt (mapa), takže do něj lze za běhu kdykoli přidávat atributy i metody a hned je uvidí všechny instance → možnosti 2 a 4 ne.<br>
<strong>Past (JavaScript):</strong> <code>a.legs = 3</code> prototyp <em>nemění</em> — vytvoří vlastní atribut na <code>a</code>, který prototyp jen zastíní. Změnit prototyp přes instanci znamená např. <code>Object.getPrototypeOf(a).legs = 4</code>; pak <code>b.legs</code> i nově vytvořená instance vrátí 4 (ověřeno v Node.js).`,
    verified: 'reasoning',
    sources: [
      ...shots('quiz_10_1.png'),
      { kind: 'slide', lecture: 'L1', page: 96 },
    ],
  },
]
