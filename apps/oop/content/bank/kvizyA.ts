import type { Question, SourceRef } from '../types'

// Otázky z kvízů 1–5 (akademický rok 2023/24), screenshoty poscrapované z FIT Discordu
// a nahrané na FIT Wiki jako oop.zip. Kvíz 3 obsahoval jen opakované otázky z kvízů 1 a 2.

// oop.zip ("Kvizy poscrapovane z threadov na FIT# discorde") je odkázaný z této stránky; přímé URL
// souboru (/_media/… i /lib/exe/fetch.php?media=…) vrací anonymně 403/400, proto odkazujeme na stránku.
const ZIP_URL = 'https://fit-wiki.cz/škola/předměty/bi-oop'

const WIKI: SourceRef = {
  kind: 'wiki',
  label: 'FIT Wiki – BI-OOP (kvízy 2023/24 z Discordu)',
  url: 'https://fit-wiki.cz/škola/předměty/bi-oop',
}

// shot(1, '1_0') → /sources/kvizy/q1/quiz_1_0.png
const shot = (quiz: number, file: string): SourceRef => ({
  kind: 'image',
  src: `/sources/kvizy/q${quiz}/quiz_${file}.png`,
  label: `Kvíz ${quiz} (2023/24, Discord) – screenshot`,
  url: ZIP_URL,
})

const seen = (...quizzes: number[]) => ({
  type: 'real' as const,
  seen: quizzes.map((n) => `Kvíz ${n} (2023/24, Discord)`),
})

const ABCD = `class A {
  def ma(): Unit = {}
}

class B extends A {
  def mb(): Unit = {}
}

class C extends B {
  def mc(): Unit = {}
}

class D extends A {
  def md(): Unit = {}
}`

export const kvizyA: Question[] = [
  // ------------------------------------------------------------------ Kvíz 1
  {
    id: 'kv1-01',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Uvažujte následující kód. Která tvrzení o proměnné <code>x</code> jsou pravdivá?',
    code: `val x: A = ???

def f(y: A) = ???`,
    options: [
      'Proměnná x může nabývat pouze hodnoty typu A',
      'Proměnné x lze přiřadit hodnotu typu A',
      'Proměnné x lze přiřadit hodnotu jakéhokoli podtypu A',
      'Proměnné x lze přiřadit hodnotu typu A a jakýkoli nadtypů A',
    ],
    correct: [1, 2],
    explanation:
      'Pravidlo přiřazení: do proměnné typu <code>A</code> smí jít hodnota typu <code>A</code> <strong>nebo libovolného podtypu</strong> (<code>B &lt;: A</code> ⇒ <code>val x: A = new B</code> projde). ' +
      'Nadtyp nesmí – <code>val x: A = new Object</code> je chyba při kompilaci, protože objekt nadtypu nemusí umět všechno, co umí <code>A</code>.<br>' +
      '<strong>Past:</strong> „pouze hodnoty typu A“ – slovo <em>pouze</em> vylučuje podtypy, takže neplatí. (To, že <code>x</code> je <code>val</code>, nevadí – „přiřadit“ tu znamená inicializovat.)',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      shot(1, '1_0'),
      shot(1, '1_9'),
      shot(1, '1_12'),
      WIKI,
      // sloučeno z duplicit: anki-27, wiki-k1-07
      { kind: 'image', src: '/sources/anki/paste-a8e7d0ebe5e0a26ba99eb9870a3d4055113c3fbb.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K1 (2024/25)', page: 'k1', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k1' },
      { kind: 'image', src: '/sources/wiki/oop_2024_10_14_marast_001.png', label: 'Kvíz K1 (2024/25), Marast 14. 10. 2024 – screenshot' },
    ],
  },
  {
    id: 'kv1-02',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Uvažujte následující kód. Která tvrzení o parametru <code>y</code> jsou pravdivá?',
    code: `val x: A = ???

def f(y: A) = ???`,
    options: [
      'Parametru y lze přiřadit hodnotu typu A',
      'Parametru y lze přiřadit hodnotu jakéhokoli podtypu A',
      'Parametru y lze přiřadit hodnotu typu A a jakýkoli nadtypů A',
      'Parametru y lze přiřadit pouze hodnotu typu A',
    ],
    correct: [0, 1],
    explanation:
      'Předání argumentu je jen další „přiřazení“: <code>f(arg)</code> se zkompiluje, když <code>typ(arg) &lt;: A</code>. Tedy <code>A</code> i všechny podtypy ano, nadtypy ne.<br>' +
      '<strong>Past:</strong> varianta „pouze hodnotu typu A“ – podtypy jsou taky povolené, takže „pouze“ je špatně.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 31, quote: 'Invoked with a subtype argument, or returning a subtype instance.' },
      shot(1, '1_9'),
      shot(1, '1_12'),
      shot(1, '1_15'),
      WIKI,
      // sloučeno z duplicit: wiki-k1-07
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K1 (2024/25)', page: 'k1', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k1' },
      { kind: 'image', src: '/sources/wiki/oop_2024_10_14_marast_001.png', label: 'Kvíz K1 (2024/25), Marast 14. 10. 2024 – screenshot' },
    ],
  },
  {
    id: 'kv1-03',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Vyberte vše, co platí o následujícím kódu: <code>class A extends B</code>',
    options: [
      'Třída A je nadtyp třídy B',
      'Instance třídy A se mohou použít kdekoliv, kde je potřeba instance třídy B',
      'Vytvoří novou is-a relaci mezi A a B',
      'Třída A je podtyp třídy B',
    ],
    correct: [1, 2, 3],
    explanation:
      '<code>A extends B</code> deklaruje nominální subtyping <code>A &lt;: B</code> („A is-a B“). Z definice subtypingu: hodnotu podtypu lze použít všude, kde se čeká nadtyp.<br>' +
      '<strong>Past:</strong> otočený směr – A je <em>podtyp</em>, ne nadtyp (ten, kdo <code>extends</code>, je ten „menší“).',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 30, quote: 'means that any variable of type B can safely be' },
      { kind: 'slide', lecture: 'L6', page: 19, quote: 'Relates objects or classes together using is-a relationship' },
      shot(1, '1_4'),
      WIKI,
      // sloučeno z duplicit: anki-33, wiki-k1-05
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K1 (2024/25)', page: 'k1', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k1' },
      { kind: 'image', src: '/sources/wiki/bi_oop_24_25_quiz1.png', label: 'Kvíz K1 (2024/25) – screenshot' },
    ],
  },
  {
    id: 'kv1-04',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Uvažujte následující kód, rozhodněte, která tvrzení jsou správně:',
    code: `class A

class B extends A

class C extends B

class D extends A`,
    options: ['(A >: C)', '(B <: D)', '(A >: B)', '(B >: B)', '(D >: C)'],
    correct: [0, 2, 3],
    explanation:
      'Nakresli strom: <code>A</code> nahoře, pod ním <code>B</code> a <code>D</code>, pod <code>B</code> je <code>C</code>. <code>X &gt;: Y</code> čti „X je nadtyp Y“ = „Y leží pod X“.<br>' +
      '<ul><li><code>A &gt;: C</code> ✔ – tranzitivita: <code>C &lt;: B &lt;: A</code>.</li>' +
      '<li><code>B &lt;: D</code> ✘ – B a D jsou sourozenci, žádný vztah.</li>' +
      '<li><code>A &gt;: B</code> ✔ – přímo z <code>extends</code>.</li>' +
      '<li><code>B &gt;: B</code> ✔ – subtyping je <strong>reflexivní</strong> (tohle je ta past).</li>' +
      '<li><code>D &gt;: C</code> ✘ – C je pod B, ne pod D.</li></ul>' +
      'Ověřeno přes <code>summon[C &lt;:&lt; A]</code> apod. ve Scale 3.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 30, quote: 'if B <: A and C <: B then C <: A' },
      { kind: 'slide', lecture: 'L2', page: 30, quote: 'For every B <: A there is an inverse relation A >: B' },
      shot(1, '1_3'),
      shot(1, '1_4'),
      shot(1, '1_6'),
      shot(1, '1_10'),
      shot(3, '3_1'),
      WIKI,
      // sloučeno z duplicit: anki-30, wiki-k1-01
      { kind: 'image', src: '/sources/anki/paste-1e9869c967eb5823000f514492b50f0c39cf034f.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K1 (2024/25)', page: 'k1', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k1' },
    ],
  },
  {
    id: 'kv1-05',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Jaký bude výsledek spuštění následujícího programu?',
    code: `class A {
  def f: Int = 7
}

class B extends A {
  override def f: Int = super.f + this.g
  def g: Int = 5
}

class C extends B {
  override def g: Int = 6
}

println(new C().f)`,
    options: ['Chyba během kompilace', '12', 'Chyba za běhu', '13', '35', '42'],
    correct: [3],
    explanation:
      '<ol><li><code>new C().f</code> – C nemá vlastní <code>f</code>, použije se <code>B.f</code>.</li>' +
      '<li><code>super.f</code> v B je staticky <code>A.f</code> = 7.</li>' +
      '<li><code>this.g</code> je dynamický dispatch podle <em>runtime</em> třídy objektu, což je C ⇒ <code>C.g</code> = 6.</li>' +
      '<li>7 + 6 = <strong>13</strong>.</li></ol>' +
      '<strong>Past:</strong> 12 vyjde, když vezmeš <code>B.g</code> = 5 jen proto, že kód stojí v třídě B. <code>this</code> ale ukazuje na instanci C.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Runtime: for a virtual call, select the override for that signature' },
      shot(1, '1_1'),
      shot(1, '1_2'),
      shot(1, '1_15'),
      WIKI,
      // sloučeno z duplicit: anki-34
      { kind: 'image', src: '/sources/anki/paste-326a955c5b9a31b191fce23782c2c0f42a003ce5.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv1-06',
    kind: 'mc',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Jaký bude výsledek spuštění následujícího programu?',
    code: `class A {
  def m: Int = 7
  def n: Int = 6
}

class B extends A {
  override def m: Int = m * n
  override def n: Int = 5
}

println(new B().m)`,
    options: ['35', 'Chyba za běhu', '42', 'Chyba během kompilace'],
    correct: [1],
    explanation:
      'V těle <code>B.m</code> znamená <code>m</code> totéž co <code>this.m</code> – a to je zase <code>B.m</code> (dynamický dispatch, objekt je B). ' +
      'Metoda tedy volá sama sebe bez konce ⇒ <code>java.lang.StackOverflowError</code> = <strong>chyba za běhu</strong>. Kompilátor to pustí (nekonečná rekurze není typová chyba).<br>' +
      '<strong>Past:</strong> 35 = 7·5 by vyšlo jen se <code>super.m * n</code>. Bez <code>super</code> se na rodičovskou verzi nedostaneš.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Runtime: for a virtual call, select the override for that signature' },
      shot(1, '1_5'),
      WIKI,
      // sloučeno z duplicit: anki-31
      { kind: 'image', src: '/sources/anki/paste-f84da0b6094037f3cbc1cc8e74d61a18fb093694.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv1-07',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co musí platit, aby se následující kód zkompiloval?',
    code: `def f(x: S): A = {
  val y: T = x

  y.g()
}`,
    options: [
      'T musí mít metodu g',
      'Metoda g musí vracet hodnotu typu A nebo její podtyp',
      'S <: T',
      'S musí overridnout metodu g',
      'S >: T',
    ],
    correct: [0, 1, 2],
    explanation:
      'Projdi řádek po řádku, co kontroluje kompilátor:<ol>' +
      '<li><code>val y: T = x</code> – přiřazení ⇒ typ <code>x</code> musí být podtyp <code>T</code>: <strong>S &lt;: T</strong> (stačí i S = T, subtyping je reflexivní).</li>' +
      '<li><code>y.g()</code> – volání se hledá podle <em>statického</em> typu <code>y</code>, tj. <code>T</code> ⇒ <strong>T musí mít g</strong>.</li>' +
      '<li>Výsledek <code>y.g()</code> je návratová hodnota funkce typu <code>A</code> ⇒ <strong>g vrací A nebo podtyp</strong>.</li></ol>' +
      'S nemusí nic overridovat – zdědí <code>g</code> z T. <code>S &gt;: T</code> je opačný směr. (Ověřeno: <code>class S extends T</code> bez vlastního <code>g</code> se zkompiluje.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 31, quote: 'A variable of a given type may be assigned a value of any subtype of' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Compile time: select an accessible signature from the receiver’s static type' },
      shot(1, '1_7'),
      shot(3, '3_2'),
      WIKI,
      // sloučeno z duplicit: anki-29
      { kind: 'image', src: '/sources/anki/paste-4c27f39ede28dc9ae2eb8b1372d584028f5e485e.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv1-08',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K1 (2024/25)'] },
    prompt: 'Jaký bude výsledek spuštění následujícího programu (hodnota posledního výrazu)?',
    code: `class A {
  def f = 1 + this.g
  def g = 1
}

class B extends A {
  override def f = super.f * 2
}

class C extends B {
  override def g = 2
}

def test(x: A) = x.f
def test(x: B) = x.f + 2
def test(x: C) = x.f + 4

val u: A = new C
val w: B = new C
val v: C = new C

test(u) + test(v) + test(w)`,
    answer: '24',
    explanation:
      '<strong>1) Hodnota <code>f</code> na objektu C</strong> (všechny tři proměnné drží <code>new C</code>): <code>B.f</code> = <code>super.f * 2</code> = <code>(1 + this.g) * 2</code>; <code>this.g</code> je <code>C.g</code> = 2 ⇒ (1 + 2)·2 = 6.<br>' +
      '<strong>2) Overloading <code>test</code></strong> se vybírá při kompilaci podle <em>statického</em> typu argumentu:<ul>' +
      '<li><code>test(u)</code>, u: A ⇒ <code>test(x: A)</code> = 6</li>' +
      '<li><code>test(v)</code>, v: C ⇒ <code>test(x: C)</code> = 6 + 4 = 10</li>' +
      '<li><code>test(w)</code>, w: B ⇒ <code>test(x: B)</code> = 6 + 2 = 8</li></ul>' +
      '6 + 10 + 8 = <strong>24</strong>.<br><strong>Past:</strong> overloading ≠ overriding – runtime třída (C) rozhoduje o <code>f</code>/<code>g</code>, ale <em>ne</em> o tom, která přetížená <code>test</code> se zavolá. Pozor i na prohozené názvy <code>w</code>/<code>v</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the method name and static argument types to choose an overload' },
      shot(1, '1_8'),
      shot(1, '1_13'),
      shot(3, '3_4'),
      WIKI,
      // sloučeno z duplicit: anki-28, wiki-k1-06
      { kind: 'image', src: '/sources/anki/paste-2f75548fcb9f39a7014c8db90e5ce59b90401404.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K1 (2024/25)', page: 'k1', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k1' },
      { kind: 'image', src: '/sources/wiki/1_quiz.png', label: 'Kvíz K1 (2024/25) – zadání kódu' },
    ],
  },
  {
    id: 'kv1-09',
    kind: 'output',
    topic: 'dispatch',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 1 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – stránka „poly“ (kvíz)'] },
    prompt: 'Co vypíše následující program?',
    code: `class A {
  def f = 1
}

class B extends A {
  override def f = 20
}

class X {
  def m(x: A): Int = this.n(x)
  def n(x: A): Int = x.f
}

class Y extends X {
  def m(x: B): Int = 30
  override def n(x: A): Int = super.n(x) + 1
}

val a: A = new A
val b: A = new B
val c: X = new Y

println(c.m(a) + c.m(b))`,
    answer: '23',
    explanation:
      '<ol><li><strong>Výběr signatury (kompilace):</strong> <code>c</code> má statický typ <code>X</code> a X zná jen <code>m(x: A)</code>. <code>Y.m(x: B)</code> je nová <em>přetížená</em> metoda, ne override – přes typ X ji vůbec nevidíš. Navíc <code>b</code> má statický typ A.</li>' +
      '<li><strong>Runtime:</strong> <code>m(A)</code> Y nepřepisuje ⇒ běží <code>X.m</code> ⇒ <code>this.n(x)</code>; <code>this</code> je Y ⇒ <code>Y.n</code> = <code>super.n(x) + 1</code> = <code>x.f + 1</code>.</li>' +
      '<li><code>c.m(a)</code> = <code>A.f</code> + 1 = 2; <code>c.m(b)</code> = <code>B.f</code> + 1 = 21 (f je přepsané, b je za běhu B).</li></ol>' +
      '2 + 21 = <strong>23</strong>.<br><strong>Past:</strong> odpověď 32 (2 + 30) – <code>m(x: B)</code> se nikdy nezavolá, protože overloading se řeší podle statických typů (X, A).',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Use the receiver’s runtime class; do not reconsider explicit argument types' },
      shot(1, '1_11'),
      shot(1, '1_14'),
      shot(3, '3_0'),
      WIKI,
      // sloučeno z duplicit: anki-35, wiki-poly-01
      { kind: 'image', src: '/sources/anki/paste-82336ba489e6a7a05ab772f26170400bf46cb270.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – stránka „poly“ (kvíz)', page: 'poly', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/poly' },
      { kind: 'image', src: '/sources/wiki/quiz2.png', label: 'Stránka „poly“ – screenshot kvízu' },
    ],
  },

  // ------------------------------------------------------------------ Kvíz 2
  {
    id: 'kv2-01',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: seen(2),
    prompt: 'Uvažujte následující definici: <code>class Consumer[-T]</code> a rozhodněte, která tvrzení jsou správná.',
    options: [
      'T je kovariantní typový parametr',
      'T je invariantní typový parametr',
      'T je kontravariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak Consumer[A] <: Consumer[B]',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak Consumer[A] >: Consumer[B]',
    ],
    correct: [2, 4],
    explanation:
      '<code>-T</code> = kontravariance: relace se <strong>otáčí</strong>. Z <code>A &lt;: B</code> plyne <code>Consumer[B] &lt;: Consumer[A]</code>, což je totéž jako <code>Consumer[A] &gt;: Consumer[B]</code>.<br>' +
      'Intuice: kdo umí zkonzumovat jakékoli zvíře, poslouží i tam, kde se čeká konzument psů.<br>' +
      '<strong>Past:</strong> zápis přes <code>&gt;:</code> – je to stejná (správná) relace, jen zapsaná zprava doleva.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[-T] means that the class C is contravariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[B] <: C[A]' },
      shot(2, '2_0'),
      shot(2, '2_2'),
      WIKI,
    ],
  },
  {
    id: 'kv2-02',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt:
      'Uvažujte třídu <code>Collection</code> s generickým typem <code>T</code> (kolekce hodnot <code>T</code>). Víme, že třídy <code>Animal</code> a <code>Dog</code> k sobě nemají žádný vztah. Jaký typ variance může typ <code>T</code> být, aby se následující kód zkompiloval?',
    code: `var dogs: Collection[Dog] = ...

var animals: Collection[Animal] = dogs`,
    options: ['Nikdy se nezkompiluje', 'Covariant', 'Invariant', 'Contravariant', 'Vždy se zkompiluje'],
    correct: [0],
    explanation:
      'Variance jen <em>přenáší</em> existující vztah mezi typovými argumenty na kolekce (kovariance ho zachová, kontravariance otočí, invariance zahodí). ' +
      'Tady ale mezi <code>Dog</code> a <code>Animal</code> <strong>žádný vztah není</strong> – není co přenést, takže <code>Collection[Dog]</code> nikdy není podtyp <code>Collection[Animal]</code>.<br>' +
      '<strong>Past:</strong> automaticky odpovědět „Covariant“, protože „pes je zvíře“. Zadání výslovně říká, že tady není. (Ověřeno se <code>+T</code>, <code>-T</code> i <code>T</code> – vždy chyba při kompilaci.)',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B there is no relation between C[A] and C[B]' },
      shot(2, '2_0'),
      shot(3, '3_0'),
      shot(3, '3_3'),
      WIKI,
      // sloučeno z duplicit: anki-43
      { kind: 'image', src: '/sources/anki/paste-8cc6d7dd723edf1b7a76e4a6e41c89155eced8cc.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv2-03',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Instance které třídy mohou být dodány jako parametr <code>x</code> pro následující funkci: <code>def f[A &lt;: MyClass](x: A): Unit</code>',
    options: [
      'pouze MyClass',
      'Všechny nadtřídy kromě MyClass',
      'MyClass a všechny její nadtřídy',
      'Všechny podtřídy kromě MyClass',
      'MyClass a všechny její podtřídy',
    ],
    correct: [4],
    explanation:
      '<code>A &lt;: MyClass</code> je <strong>horní mez</strong>: za A smí kompilátor dosadit jen typ, který je podtypem MyClass. Subtyping je reflexivní, takže i MyClass sama. ' +
      'Nadtřída (např. <code>Any</code>) mez poruší ⇒ chyba při kompilaci.<br>' +
      '<strong>Past:</strong> „kromě MyClass“ – <code>MyClass &lt;: MyClass</code> platí, takže MyClass vyloučit nejde.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'A bound (T <: Animal) restricts admissible type arguments.' },
      shot(2, '2_1'),
      shot(2, '2_12'),
      shot(3, '3_2'),
      WIKI,
      // sloučeno z duplicit: anki-37
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv2-04',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Kvíz 3 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt:
      'Funkce s jedním parametrem typu <code>A =&gt; B</code> je definována jako parametrizovaný typ <code>Function1[A, B]</code>. Oba typové parametry obsahují varianční anotace. Vyberte které.',
    options: ['+A', '-A', '+B', '-B'],
    correct: [1, 2],
    explanation:
      '<code>trait Function1[-A, +B]</code>: <strong>vstup kontravariantní, výstup kovariantní</strong>.<br>' +
      'Proč: funkci <code>Animal =&gt; Dog</code> můžu použít tam, kde se čeká <code>Dog =&gt; Animal</code> – přijme víc vstupů (každý Dog je Animal) a vrátí konkrétnější výsledek (Dog je Animal). ' +
      'Ověřeno: <code>summon[(Animal =&gt; Dog) &lt;:&lt; (Dog =&gt; Animal)]</code> projde, opačně ne.<br>' +
      '<strong>Mnemotechnika:</strong> „bere míň specifické, vrací víc specifické“.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 59, quote: 'Inputs are contravariant, outputs are covariant.' },
      shot(2, '2_3'),
      shot(2, '2_6'),
      shot(3, '3_5'),
      WIKI,
      // sloučeno z duplicit: anki-41
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv2-05',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Jaké metody na proměnné <code>x</code> mohu volat v metodě <code>test</code>?',
    code: `${ABCD}

class Test[T] {
  def test[R >: T](x: R): Unit = {
    // what can I call on x?
  }
}

val t = new Test[B]
t.test(new B)`,
    options: ['mb', 'žádné z uvedených', 'ma', 'test'],
    correct: [1],
    explanation:
      'Uvnitř <code>test</code> kompilátor nezná konkrétní <code>R</code> ani <code>T</code> – ví jen to, co říkají meze. <code>R &gt;: T</code> je <strong>dolní</strong> mez: R je „něco nad T“, ale shora omezené není, takže to může být klidně <code>Any</code>. ' +
      'Na <code>x</code> jde volat jen metody <code>Any</code> (<code>toString</code>, <code>==</code>…), nic z A/B.<br>' +
      '<strong>Past:</strong> řádek <code>new Test[B]</code> – tělo třídy se typuje jednou pro všechna T, konkrétní <code>B</code> u volání nic nemění. A <code>test</code> je metoda třídy Test, ne typu x.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' },
      shot(2, '2_4'),
      WIKI,
      // sloučeno z duplicit: wiki-k2-02
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K2 (2024/25)', page: 'k2', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k2' },
    ],
  },
  {
    id: 'kv2-06',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Jaké metody na proměnné <code>x</code> mohu volat v metodě <code>test</code>?',
    code: `${ABCD}

class Test[T] {
  def test(x: T): Unit = {
    // which methods can I call on x
  }
}

val t = new Test[B]
t.test(new B)`,
    options: ['žádné z uvedených', 'mb', 'ma', 'mc', 'test'],
    correct: [0],
    explanation:
      '<code>T</code> nemá žádnou mez ⇒ uvnitř třídy je to „libovolný typ“ a na <code>x: T</code> jdou volat jen metody <code>Any</code>. Že se později vytvoří <code>Test[B]</code>, tělo třídy neovlivní.<br>' +
      'Kdyby byla deklarace <code>class Test[T &lt;: B]</code>, šlo by volat <code>ma</code> i <code>mb</code> (horní mez říká, co T umí).<br>' +
      '<strong>Past:</strong> myslet si, že <code>new Test[B]</code> „dosadí“ B do těla – generika se typují obecně, ne pro každé použití zvlášť.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 47, quote: 'It also tells the compiler which operations on T are available.' },
      shot(2, '2_6'),
      shot(2, '2_9'),
      WIKI,
      // sloučeno z duplicit: anki-36
      { kind: 'image', src: '/sources/anki/paste-0c71a822b48ed5daf5d3d7fb538c4c22df970312.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv2-07',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: seen(2),
    prompt: 'Uvažujte definici <code>class CP[T]</code>. Vyberte pravdivá tvrzení.',
    options: [
      'T je invariantní typový parametr',
      'T je covariantní typový parametr',
      'T je contravariantní typový parametr',
      'pokud A <: B pak CP[A] >: CP[B]',
      'pokud A <: B pak CP[A] <: CP[B]',
    ],
    correct: [0],
    explanation:
      'Bez anotace (<code>+</code>/<code>-</code>) je typový parametr <strong>invariantní</strong> – to je výchozí stav. Mezi <code>CP[A]</code> a <code>CP[B]</code> pak není <em>žádný</em> vztah, ani jedním směrem.<br>' +
      '<strong>Past:</strong> „CP[A] &lt;: CP[B]“ zní přirozeně (jako u <code>List</code>), ale <code>List</code> je deklarovaný jako <code>List[+A]</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[T] means that the class C is invariant in T (the default)' },
      shot(2, '2_5'),
      shot(2, '2_11'),
      WIKI,
    ],
  },
  {
    id: 'kv2-08',
    kind: 'mc',
    topic: 'variance',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K4 (2024/25)'] },
    prompt: 'Uvažujte následující definici: <code>class Producer[+T]</code> a rozhodněte, která tvrzení jsou správná.',
    options: [
      'T je kontravariantní typový parametr',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak i Producer[A] >: Producer[B]',
      'Pro jakékoliv dvě třídy A a B, pokud A <: B pak i Producer[A] <: Producer[B]',
      'T je kovariantní typový parametr',
    ],
    correct: [2, 3],
    explanation:
      '<code>+T</code> = kovariance: relace se <strong>zachová</strong> ve stejném směru. <code>A &lt;: B</code> ⇒ <code>Producer[A] &lt;: Producer[B]</code>.<br>' +
      'Intuice: kdo produkuje psy, poslouží i tam, kde se čeká producent zvířat.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'C[+T] means that the class C is covariant in T' },
      { kind: 'slide', lecture: 'L4', page: 46, quote: 'given A <: B then C[A] <: C[B]' },
      shot(2, '2_7'),
      WIKI,
      // sloučeno z duplicit: anki-40, wiki-k4-01
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K4 (2024/25)', page: 'k4', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k4' },
      { kind: 'image', src: '/sources/wiki/oop_marast_4_parametric_01.png', label: 'Kvíz K4 (2024/25) – screenshot' },
    ],
  },
  {
    id: 'kv2-09',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: seen(2, 3),
    prompt: 'Instance kterých tříd mohu použít pro parametr <code>x</code> při volání metody <code>test</code> na posledním řádku?',
    code: `${ABCD}

class Test[T] {
  def test[R >: T](x: R): Unit = {}
}

val t = new Test[B]
t.test(???)`,
    options: ['A', 'B', 'C', 'Jakéhokoliv typu', 'Jenom B', 'Jenom B a jeho nadtřídy', 'Žádné z uvedených'],
    correct: [0, 1, 2, 3],
    explanation:
      'Tady je T = B, takže potřebujeme <code>R &gt;: B</code> a zároveň <code>typ(x) &lt;: R</code>. <strong>R si kompilátor odvodí sám</strong> – vezme nejbližší společný nadtyp B a typu argumentu:<ul>' +
      '<li><code>new C</code> ⇒ R = B (C &lt;: B) ✔</li>' +
      '<li><code>new A</code> ⇒ R = A ✔; <code>new D</code> ⇒ R = A ✔</li>' +
      '<li><code>1</code>, <code>"s"</code> ⇒ R = Any ✔</li></ul>' +
      'Vždy se najde R (nejhůř <code>Any</code>), takže projde <strong>jakýkoli typ</strong>. Ověřeno kompilací každé varianty.<br>' +
      '<strong>Past:</strong> číst <code>R &gt;: T</code> jako „argument musí být nadtyp B“ ⇒ „Jenom B a jeho nadtřídy“. Na screenshotu z kvízu 2 to student zaškrtl (a C ne) a dostal jen 1 bod – kompilátor C (i cokoli jiného) přijme. Stejný trik je u <code>List.appended[R &gt;: T]</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L4', page: 51, quote: 'T is Cat, R has to be Animal since that is' },
      shot(2, '2_8'),
      shot(3, '3_1'),
      WIKI,
    ],
  },
  {
    id: 'kv2-10',
    kind: 'mc',
    topic: 'generics',
    lecture: 'L4',
    origin: { type: 'real', seen: ['Kvíz 2 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Instance kterých tříd mohu použít pro parametr <code>x</code> při volání metody <code>test</code> na posledním řádku?',
    code: `${ABCD}

class Test[T] {
  def test(x: T): Unit = { }
}

new Test[B]().test(???)`,
    options: ['A', 'B', 'C', 'Int', 'Any', 'String'],
    correct: [1, 2],
    explanation:
      'Pro <code>Test[B]</code> má <code>test</code> parametr typu <code>B</code>. Argument musí být <code>B</code> nebo podtyp ⇒ <strong>B a C</strong>. ' +
      '<code>A</code> (nadtyp), <code>Any</code>, <code>Int</code>, <code>String</code> neprojdou – chyba při kompilaci.<br>' +
      '<strong>Srovnej</strong> s <code>test[R &gt;: T](x: R)</code> (kv2-09), kde díky odvozenému R projde cokoli.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 31, quote: 'Invoked with a subtype argument, or returning a subtype instance.' },
      shot(2, '2_10'),
      shot(2, '2_11'),
      shot(2, '2_12'),
      WIKI,
      // sloučeno z duplicit: anki-38, wiki-k2-04
      { kind: 'image', src: '/sources/anki/paste-ff16f46c56120d0e74c2c0be135cb8c6e3a88812.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K2 (2024/25)', page: 'k2', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k2' },
      { kind: 'image', src: '/sources/wiki/snímek_obrazovky_2024-10-20_163821.png', label: 'Kvíz K2 (2024/25) – screenshot' },
    ],
  },

  // ------------------------------------------------------------------ Kvíz 4
  {
    id: 'kv4-01',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K2 (2024/25)'] },
    prompt: 'Co můžeme říci o nominálním a strukturovaném typovém systému?',
    options: [
      'Strukturální typový systém kontroluje typovaní za běhu programu',
      'Nominální typový systém určuje kompatibilitu typů pomocí explicitních deklarací',
      'Strukturální typovaní je stejné jako duck typing',
      'Nominální typový systém určuje kompatibilitu typu na základě struktury typu',
      'Strukturální typový systém určuje kompatibilitu typů pouze podle kompatibility struktury těch typů',
      'Strukturální typový systém určuje kompatibilitu typů pomocí explicitních deklarací',
    ],
    correct: [1, 4],
    explanation:
      '<ul><li><strong>Nominální</strong> (Scala, Java): <code>B &lt;: A</code> jen když to někde deklaruješ (<code>extends</code>).</li>' +
      '<li><strong>Strukturální</strong> (Go, TypeScript): stačí, že typ má potřebné členy – deklarace není potřeba.</li>' +
      '<li><strong>Duck typing</strong> (Python, JS) vypadá podobně jako strukturální, ale kontroluje se <em>za běhu</em>.</li></ul>' +
      '<strong>Past:</strong> „strukturální = duck typing“ a „strukturální kontroluje za běhu“ – strukturální typování je statické (při kompilaci), za běhu je duck typing.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 64, quote: 'type equivalence and compatibility is determined by explicit declarations' },
      { kind: 'slide', lecture: 'L2', page: 64, quote: "type equivalence and compatibility is determined by type's actual structure" },
      { kind: 'slide', lecture: 'L2', page: 64, quote: 'looks like structural typing, but it is a runtime characteristics' },
      shot(4, '4_0'),
      shot(4, '4_2'),
      shot(4, '4_4'),
      shot(4, '4_8'),
      WIKI,
      // sloučeno z duplicit: anki-46, wiki-k2-03
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K2 (2024/25)', page: 'k2', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k2' },
      { kind: 'image', src: '/sources/wiki/oop-2024-marast-2-parametric.png', label: 'Kvíz K2 (2024/25) – varianta 2, screenshot' },
      { kind: 'image', src: '/sources/wiki/snímek_obrazovky_2024-10-20_163821.png', label: 'Kvíz K2 (2024/25) – varianta 3, screenshot' },
    ],
  },
  {
    id: 'kv4-02',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Case classes…',
    options: [
      'nemohou být měnitelné',
      'jsou ve výchozím nastavení neměnitelné',
      'dávají způsob, jak vytvářet algebraické datové typy',
      'nemohou dědit z jiných tříd',
      'jsou užitečné pro ukládání obyčejných dat',
      'jsou ve výchozím nastavení měnitelné',
    ],
    correct: [1, 2, 4],
    explanation:
      '<ul><li>Parametry konstruktoru case class jsou implicitně <code>val</code> ⇒ <strong>výchozí je immutable</strong>.</li>' +
      '<li>Ale <em>můžou</em> být měnitelné: <code>case class M(var z: Int)</code> se zkompiluje (jen se to nedoporučuje).</li>' +
      '<li>Case class = „product“ část ADT (spolu se <code>sealed trait</code>/<code>enum</code> jako „sum“).</li>' +
      '<li>Dědit z obyčejné třídy smí (<code>case class P(x: Int) extends Base(x)</code> projde). Zakázané je jen dědění case class z case class, a slajdy doporučují je dělat <code>final</code>.</li></ul>' +
      '<strong>Past:</strong> „nemohou být měnitelné“ – screenshot z kvízu 5, kde to student zaškrtl, je hodnocený jen 1 bodem.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 30, quote: "Scala's take on product part of Algebraic Data Types" },
      { kind: 'slide', lecture: 'L5', page: 30, quote: 'Model plain data aggregates with less ceremony' },
      { kind: 'slide', lecture: 'L5', page: 30, quote: 'The val keyword is implicit in case classes' },
      shot(4, '4_0'),
      shot(4, '4_1'),
      shot(4, '4_9'),
      shot(4, '4_10'),
      shot(5, '5_5'),
      shot(5, '5_9'),
      WIKI,
      // sloučeno z duplicit: anki-45
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv4-03',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Marast 2021/22 (mix, několik screenshotů)'] },
    prompt: 'Case classes…',
    options: [
      'Mají implementaci ekvivalence, která porovná všechny stavové proměnné.',
      'Ve výchozím nastavení jsou měnitelné (mutable).',
      'Pro rovnost, pokud chceme porovnávat obsah spíše než umístění v paměti, musíme přepsat equals a hashCode, jako u jakékoli jiné třídy.',
      'Ve výchozím nastavení jsou neměnné (immutable).',
      'Jsou užitečné pro datové modelování a použití při pattern matchingu.',
    ],
    correct: [0, 3, 4],
    explanation:
      'Kompilátor case class vygeneruje <code>equals</code>/<code>hashCode</code>, <code>toString</code>, <code>copy</code>, <code>apply</code> a <code>unapply</code> (extraktor pro pattern matching). ' +
      'Rovnost je tedy <strong>strukturální</strong> (<code>Payment(120, "CZK") == Payment(120, "CZK")</code> je <code>true</code>) a sám <code>equals</code> přepisovat nemusíš.<br>' +
      '<strong>Drobnost:</strong> „všechny stavové proměnné“ = parametry (prvního seznamu) konstruktoru. Pole deklarované v těle (<code>case class P(x: Int) { var y = 0 }</code>) se do <code>equals</code> nepočítá – ověřeno, <code>P(1)</code> s různým <code>y</code> jsou si rovny. Kvíz tuto možnost bral jako správnou.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 29, quote: 'true: the fields are equal' },
      { kind: 'slide', lecture: 'L5', page: 30 },
      shot(4, '4_3'),
      shot(4, '4_4'),
      shot(4, '4_6'),
      shot(5, '5_0'),
      shot(5, '5_1'),
      shot(5, '5_8'),
      WIKI,
      // sloučeno z duplicit: anki-09, anki-49, wiki-marast_2021_2022_mix-02
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Marast 2021/22 (mix)', page: 'marast_2021_2022_mix', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_2021_2022_mix' },
      { kind: 'image', src: '/sources/wiki/bi-oop_21-22_quiz4.png', label: 'Marast 2021/22, Kvíz K4 – screenshot (vyhodnocený)' },
      { kind: 'image', src: '/sources/wiki/7.png', label: 'Marast 2021/22 – screenshot' },
      { kind: 'image', src: '/sources/wiki/8.png', label: 'Marast 2021/22, Kvíz K4 – screenshot' },
      { kind: 'image', src: '/sources/wiki/10.png', label: 'Marast 2021/22 – screenshot' },
    ],
  },
  {
    id: 'kv4-04',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Proč chceme zapouzdřit?',
    options: [
      'Aby se zabránilo narušení třídní invariance',
      'Abychom umožnili polymorfismus',
      'Zabránit přímému přístupu k vnitřnímu stavu objektu',
      'Aby se ujistil, že objekt je jediný, kdo může změnit svůj stav',
      'Abychom mohli později změnit podrobnosti implementace',
      'Povolit přímý přístup k vnitřnímu stavu objektu',
    ],
    correct: [0, 2, 3, 4],
    explanation:
      'Zapouzdření = stav schovaný za operacemi, které hlídají invariant (např. <code>0 ≤ reserved ≤ capacity</code>). Důsledky: nikdo zvenku invariant nerozbije, stav mění jen objekt sám, ' +
      'a implementaci (reprezentaci dat) můžeš změnit, aniž by se to dotklo klientů.<br>' +
      '<strong>Past:</strong> „umožnit polymorfismus“ – to je úkol subtypingu/dědičnosti, ne zapouzdření. „Povolit přímý přístup“ je přesný opak.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 26, quote: 'A good boundary makes invalid changes hard and implementation changes local.' },
      { kind: 'slide', lecture: 'L5', page: 73, quote: 'Encapsulation makes the contract stable and reasoning about its implementation local.' },
      { kind: 'slide', lecture: 'L5', page: 4, quote: 'Who is responsible for keeping 0 <= reserved <= capacity?' },
      shot(4, '4_1'),
      shot(4, '4_7'),
      WIKI,
      // sloučeno z duplicit: anki-48
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv4-05',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co bude výsledek následujícího kódu?',
    code: `class A {
  protected def m: Int = 1
}

class B extends A {
  override def m: Int = 2
}

val y: B = new B()

y.m`,
    options: ['1', 'Compile-time exception', 'Runtime exception', '2'],
    correct: [3],
    explanation:
      'Override smí přístup <strong>rozšířit</strong>: <code>override def m</code> bez modifikátoru je v B <em>public</em>. Statický typ <code>y</code> je B ⇒ přístup je povolený, za běhu se zavolá <code>B.m</code> = <strong>2</strong>.<br>' +
      '<strong>Past:</strong> přehlédnout, že override „zapomněl“ <code>protected</code>. Srovnej s kv4-06, kde je <code>y: A</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 12, quote: 'The override is public by default. The parent declaration is still protected.' },
      shot(4, '4_2'),
      WIKI,
      // sloučeno z duplicit: anki-50
      { kind: 'image', src: '/sources/anki/paste-6b55578bae908da98e3e206da64edfdddfe8779a.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv4-06',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co bude výsledek následujícího kódu?',
    code: `class A {
  protected def m: Int = 1
}

class B extends A {
  override def m: Int = 2
}

val y: A = new B()

y.m`,
    options: ['2', '1', 'Runtime exception', 'Compile-time exception'],
    correct: [3],
    explanation:
      'Přístupová práva kontroluje kompilátor podle <strong>statického typu</strong>. <code>y</code> je typu <code>A</code> a v A je <code>m</code> <code>protected</code> ⇒ zvenku (mimo A a podtřídy) volat nejde ⇒ <strong>chyba při kompilaci</strong>. ' +
      'Že by za běhu běžela veřejná <code>B.m</code>, nehraje roli – k běhu se nedojde.<br>' +
      '<strong>Past:</strong> odpovědět 2 podle runtime třídy. Dynamický dispatch řeší jen <em>kterou</em> implementaci, ne <em>jestli</em> smíš volat.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 12, quote: 'The override is public by default. The parent declaration is still protected.' },
      { kind: 'slide', lecture: 'L2', page: 20, quote: 'Compile time: select an accessible signature from the receiver’s static type' },
      shot(4, '4_9'),
      WIKI,
      // sloučeno z duplicit: anki-44
      { kind: 'image', src: '/sources/anki/paste-90c96a9b3f83b9072d2caa3b3a7ab14910782797.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv4-07',
    kind: 'mc',
    topic: 'encapsulation',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Marast 2021/22 (Kvíz K2 – zapouzdření)'] },
    prompt: 'V následujícím kódu, které metody na <code>x</code> mohu zavolat z metody <code>test</code> na řádku 8?',
    code: `class C {
  private def m1: Unit = {}
  private[this] def m2: Unit = {}
  protected def m3: Unit = {}
  def m4: Unit = {}

  def test(x: C) = {
    x.???
  }
}`,
    options: ['m1', 'm2', 'm3', 'm4'],
    correct: [0, 1, 2, 3],
    explanation:
      'Kód je uvnitř třídy C, <code>x</code> je jiná instance C:<ul>' +
      '<li><code>m1</code> (private) ✔ – private je soukromé pro <em>třídu</em>, ne pro objekt, takže jiná instance téže třídy je OK.</li>' +
      '<li><code>m3</code> (protected) ✔, <code>m4</code> (public) ✔.</li>' +
      '<li><code>m2</code> (<code>private[this]</code>): ve <strong>Scale 2</strong> „object-private“ – jen přes <code>this</code>, takže <code>x.m2</code> je chyba (ověřeno se Scalou 2.13). Kvíz z 2023/24 proto čekal odpověď <strong>m1, m3, m4</strong>.</li></ul>' +
      '<strong>Ve Scale 3 (na čem je midterm)</strong> ale kompilátor kvalifikátor <code>[this]</code> ignoruje s varováním „Ignoring [this] qualifier… just write private instead“ a <code>x.m2</code> se zkompiluje (ověřeno ve Scale 3.3 i 3.9). Uložená odpověď proto platí pro Scalu 3: všechny čtyři.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 13, quote: 'Private members are accessible only from' },
      shot(4, '4_5'),
      shot(4, '4_8'),
      WIKI,
      // sloučeno z duplicit: anki-03, wiki-marast_2021_2022_mix-01
      { kind: 'image', src: '/sources/anki/paste-8bf1ea130b0c0ff1c4fb8117a3307a1948f05ba6.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'image', src: '/sources/anki/paste-c338055ea7dfc912f85198596d03a31221a9f292.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Marast 2021/22 (mix)', page: 'marast_2021_2022_mix', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_2021_2022_mix' },
      { kind: 'image', src: '/sources/wiki/bi-oop_21-22_quiz2.png', label: 'Marast 2021/22, Kvíz K2 – zapouzdření – screenshot' },
    ],
  },
  {
    id: 'kv4-08',
    kind: 'mc',
    topic: 'pattern',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 4 (2023/24, Discord)', 'Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co z následujícího platí o pattern matchingu?',
    options: [
      'Může se použít pro matching typů, kdy poskytuje bezpečnější alternativu k isInstanceOf a asInstanceOf.',
      'Každý případ (case) za šipkou (=>) může obsahovat pouze jeden výraz.',
      'Je to statement.',
      'Je to výraz, takže pokud se žádný případ (case) neshoduje, dostaneme výjimku.',
      'Za každým případem (case) může následovat booleovský výraz, který dále omezuje kdy je daný případ (case) aplikovatelný.',
      'Každý případ (case) musí být buď zabalen do bloku nebo musí následovat příkaz break jako u switche v C++/Java.',
    ],
    correct: [0, 3, 4],
    explanation:
      '<ul><li><code>case n: Int =&gt; …</code> otestuje typ a rovnou naváže proměnnou – bez ručního <code>isInstanceOf</code>/<code>asInstanceOf</code>.</li>' +
      '<li><code>match</code> je <strong>výraz</strong> (vrací hodnotu); když žádný case nesedí, hodí <code>MatchError</code>.</li>' +
      '<li>Guard: <code>case Some(n) if n &gt; 10 =&gt; …</code>.</li>' +
      '<li>Za <code>=&gt;</code> může být víc řádků (výrazů) i bez složených závorek, platí hodnota posledního. Žádný <code>break</code> ani fall-through neexistuje.</li></ul>' +
      'Ověřeno: case se dvěma <code>println</code> a vrácenou hodnotou se zkompiluje, nepokrytý case hodí <code>MatchError</code>.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 49, quote: 'A guard can leave an ADT case uncovered' },
      { kind: 'slide', lecture: 'L5', page: 72, quote: 'Patterns test shape and bind names.' },
      { kind: 'slide', lecture: 'L5', page: 47 },
      shot(4, '4_10'),
      shot(5, '5_2'),
      shot(5, '5_3'),
      WIKI,
      // sloučeno z duplicit: anki-51
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },

  // ------------------------------------------------------------------ Kvíz 5
  {
    id: 'kv5-01',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Když třída A dědí od třídy B (<code>class A extends B</code>), zdědí vše kromě…',
    options: [
      'abstraktních členů (abstract members)',
      'konečných členů (final members)',
      'přepsaných členů (overriden members – jsou přepsány a tak nejsou zděděny)',
      'privátních členů (private members)',
    ],
    correct: [2, 3],
    explanation:
      'Podle slajdu podtřída dědí všechny <code>public</code> a <code>protected</code> členy; <strong>ne</strong> privátní a <strong>ne</strong> ty, které sama přepíše (má vlastní definici).<br>' +
      'Abstraktní členy se dědí (proto je konkrétní podtřída musí implementovat), finální taky (jen je nejde přepsat).<br>' +
      '<strong>Pozor na formulaci:</strong> privátní <em>stav</em> v objektu fyzicky existuje, podtřída k němu jen nemá přístup. „Nezděděný“ tu znamená „není členem podtřídy“.',
    verified: 'slides',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'no private (because you do not even know that they are in)' },
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'no overridden members (because you change the' },
      { kind: 'slide', lecture: 'L2', page: 35, quote: 'Inherited private state still exists, but subclasses cannot access it directly.' },
      shot(5, '5_0'),
      WIKI,
      // sloučeno z duplicit: anki-59
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-02',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co bude výsledek následujícího kódu?',
    code: `class Person(val name: String)


val xs = List(new Person("Alice"), new Person("Bob"))
val ys = xs

xs == ys`,
    options: ['true', 'Runtime exception', 'Compile-time exception', 'false'],
    correct: [0],
    explanation:
      '<code>ys = xs</code> nekopíruje – obě proměnné ukazují na <strong>tentýž</strong> seznam. <code>==</code> volá <code>equals</code>, a ten je pro identický objekt vždy <code>true</code> (prvky se porovnají samy se sebou).<br>' +
      'Srovnej s kv5-03, kde jsou to dva různé seznamy.',
    verified: 'scala',
    sources: [shot(5, '5_1'), shot(5, '5_8'), WIKI,
      // sloučeno z duplicit: anki-53
      { kind: 'image', src: '/sources/anki/paste-af6c93009e1dcef9fca8b6ef2f41c737de7108e8.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-03',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co bude výsledek následujícího kódu?',
    code: `class Person(val name: String)

val xs = List(new Person("Alice"), new Person("Bob"))
val ys = List(new Person("Alice"), new Person("Bob"))

xs == ys`,
    options: ['Runtime exception', 'true', 'false', 'Compile-time exception'],
    correct: [2],
    explanation:
      '<code>List.==</code> porovnává prvky po dvojicích přes <code>equals</code>. <code>Person</code> je <em>obyčejná</em> třída, ne case class ⇒ zděděný <code>equals</code> z <code>AnyRef</code> porovnává <strong>identitu</strong>. Každé <code>new Person("Alice")</code> je jiný objekt ⇒ <strong>false</strong>.<br>' +
      '<strong>Past:</strong> se <code>case class Person(name: String)</code> by výsledek byl <code>true</code>. Bez <code>case</code> (nebo vlastního <code>equals</code>) žádná rovnost podle obsahu není.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 29, quote: 'true: the fields are equal' },
      shot(5, '5_6'),
      WIKI,
      // sloučeno z duplicit: anki-55
      { kind: 'image', src: '/sources/anki/paste-b9f8fad6ce0a982cbaa0da59769afa9dfd5a73ac.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-04',
    kind: 'mc',
    topic: 'adt',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Který z následujících výrazů je pravdivý?',
    code: `class Person(val name: String) {

  override def equals(other: Any): Boolean = other match {
    case that: Person => name == that.name
    case _ => false
  }

  override def hashCode(): Int = java.util.Objects.hash(name)
}

val p1 = new Person("Alice")
val p2 = new Person("Bob")
val p3 = p1
val p4 = new Person("Alice")`,
    options: ['p1 eq p3', 'p1 == p2', 'p1 eq p4', 'p1 == p4', 'p1 eq p2'],
    correct: [0, 3],
    explanation:
      '<ul><li><code>eq</code> = <strong>identita</strong> (stejný objekt v paměti): pravda jen pro <code>p1 eq p3</code> (p3 je alias p1).</li>' +
      '<li><code>==</code> volá přepsaný <code>equals</code> = porovnání jmen: <code>p1 == p4</code> („Alice“ = „Alice“) ✔, <code>p1 == p2</code> ✘.</li></ul>' +
      '<strong>Past:</strong> <code>p1 eq p4</code> – stejný obsah, ale dva různé objekty (dvě <code>new</code>).',
    verified: 'scala',
    sources: [shot(5, '5_3'), shot(5, '5_4'), WIKI,
      // sloučeno z duplicit: anki-58
      { kind: 'image', src: '/sources/anki/paste-7d9b1f2273e958a31ee181662b1526052c5ff8c5.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-05',
    kind: 'mc',
    topic: 'subtyping',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Co se stane, když spustíme následující kód:',
    code: `class A {
  def hi = "Hi from A"
}

class B extends A {
  def hi = "Hi from B"
}

val x: A = new B
println(x.hi)`,
    options: ['Chyba za běhu programu.', 'Chyba při kompilaci.', 'Vytiskne "Hi from B".', 'Vytiskne "Hi from A".'],
    correct: [1],
    explanation:
      'B definuje <code>hi</code> se stejnou signaturou jako konkrétní <code>A.hi</code>, ale <strong>chybí <code>override</code></strong>. Ve Scale je <code>override</code> u přepisu konkrétního člena povinné ⇒ <strong>chyba při kompilaci</strong> (ověřeno).<br>' +
      '<strong>Past:</strong> odpovědět „Hi from B“ podle dynamického dispatche. S <code>override def hi</code> by to opravdu vytisklo „Hi from B“, ale takhle se program vůbec nepřeloží.',
    verified: 'scala',
    sources: [shot(5, '5_2'), shot(5, '5_9'), WIKI,
      // sloučeno z duplicit: anki-52
      { kind: 'image', src: '/sources/anki/paste-d4c464a1b6124584491538c515d38e378d520c57.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-06',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Marast 15. 10. 2020'] },
    prompt: 'Neabstraktní třída A, která dědí od třídy B…',
    options: [
      'pokud definuje svůj vlastní konstruktor, tak nemusí volat konstruktor třídy B',
      'musí zavolat primární konstruktor třídy B',
      'musí implementovat všechny abstraktní členy',
      'musí zavolat jeden z konstruktorů třídy B',
      'může přepsat definici všech non-final členů',
    ],
    correct: [2, 3, 4],
    explanation:
      '<ul><li>Konkrétní třída nesmí mít nic abstraktního ⇒ musí implementovat všechny zděděné abstraktní členy.</li>' +
      '<li>Konstrukce vždy prochází řetězem konstruktorů nadtříd ⇒ <em>nějaký</em> konstruktor B se zavolat musí (v <code>extends B(...)</code>, i implicitně).</li>' +
      '<li>Nemusí to být primární: <code>class Impl extends Abs()</code>, kde <code>Abs()</code> je pomocný <code>def this() = this(0)</code>, se zkompiluje (ověřeno).</li>' +
      '<li>Přepsat lze každý zděděný člen, který není <code>final</code>. Privátní členy se nedědí (kv5-01), takže se do „všech“ nepočítají.</li></ul>' +
      '<strong>Past:</strong> „primární“ – stačí libovolný konstruktor B.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L2', page: 37, quote: 'It has to call superclass constructor (implicitly or explicitly)' },
      shot(5, '5_4'),
      shot(5, '5_7'),
      WIKI,
      // sloučeno z duplicit: anki-54, wiki-marast_15_10_20-02
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Marast 15. 10. 2020', page: 'marast_15_10_20', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_15_10_20' },
      { kind: 'image', src: '/sources/wiki/bi-oop_marast_15.png', label: 'Marast 15. 10. 2020 – screenshot' },
    ],
  },
  {
    id: 'kv5-07',
    kind: 'mc',
    topic: 'pattern',
    lecture: 'L5',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)'] },
    prompt: 'Jaký bude výstup následujícího kódu?',
    code: `case class Num(x: Int)
val xs = List(Num(1), Num(2))

xs match {
  case Num(x) :: _ => print(x)
  case Num(x) :: Num(y) :: _ => print(x + y)
  case x :: y :: Nil => print(0)
  case _ => print(2)
}`,
    options: ['2', '1', '0', '3'],
    correct: [1],
    explanation:
      'Case se zkoušejí <strong>shora dolů</strong> a vyhraje první, který sedí. <code>Num(x) :: _</code> = „neprázdný seznam, jehož hlava je Num“ – <code>List(Num(1), Num(2))</code> sedí, x = 1 ⇒ vytiskne <strong>1</strong>.<br>' +
      '<strong>Past:</strong> 3 by vyšlo, kdybys hledal „nejpřesnější“ case. Kompilátor dokonce varuje, že druhý a třetí case jsou nedosažitelné.',
    verified: 'scala',
    sources: [
      { kind: 'slide', lecture: 'L5', page: 72, quote: 'Cases run from top to bottom.' },
      { kind: 'slide', lecture: 'L5', page: 53, quote: 'In a pattern, head :: tail extracts a nonempty list.' },
      shot(5, '5_5'),
      WIKI,
      // sloučeno z duplicit: anki-57
      { kind: 'image', src: '/sources/anki/paste-5f9718e26435d760b57622095ac81e3d98c5f13c.jpg', label: 'Anki kartička – původní obrázek', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
    ],
  },
  {
    id: 'kv5-08',
    kind: 'mc',
    topic: 'objekty',
    lecture: 'L2',
    origin: { type: 'real', seen: ['Kvíz 5 (2023/24, Discord)', 'Anki (kvízy 2023/24)', 'FIT Wiki – Kvíz K7 (2024/25)', 'FIT Wiki – Marast 2021/22 (mix)'] },
    prompt: 'Co je z následujícího pravdivé o abstraktní třídě?',
    options: [
      'Může definovat instanční proměnné a metody.',
      'Může definovat pouze abstraktní instanční proměnné a metody.',
      'Nemůže být použita k vytvoření instancí.',
      'Může definovat abstraktní instanční proměnné a metody.',
    ],
    correct: [0, 2, 3],
    explanation:
      'Abstraktní třída může mít konkrétní i abstraktní členy (pole s hodnotou, metody s tělem i bez) a konstruktor. Jen ji nejde přímo instancovat: <code>new Abs</code> ⇒ „Abs is abstract; it cannot be instantiated“ (ověřeno). Instance vznikají přes konkrétní podtřídy.<br>' +
      '<strong>Past:</strong> „pouze abstraktní“ – to by byl spíš čistý interface. Abstraktní třída smí mít i implementaci.',
    verified: 'scala',
    sources: [shot(5, '5_6'), WIKI,
      // sloučeno z duplicit: anki-56, anki-06, wiki-k7-02
      { kind: 'wiki', label: 'FIT Wiki – Anki kartičky BI-OOP', url: 'https://fit-wiki.cz/škola/předměty/bi-oop' },
      { kind: 'wiki', label: 'FIT Wiki – Kvíz K7 (2024/25)', page: 'k7', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/k7' },
      { kind: 'wiki', label: 'FIT Wiki – Marast 2021/22 (mix)', page: 'marast_2021_2022_mix', url: 'https://fit-wiki.cz/škola/předměty/bi-oop/marast_2021_2022_mix' },
      { kind: 'image', src: '/sources/wiki/oop_2024_k7_01.png', label: 'Kvíz K7 (2024/25) – screenshot' },
      { kind: 'image', src: '/sources/wiki/bi-oop_21-22_quiz3.png', label: 'Marast 2021/22 – screenshot' },
    ],
  },
]
