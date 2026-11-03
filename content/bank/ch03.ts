import type { DocId, Question, SourceRef } from '../types'

const s = (doc: DocId, page: number, quote?: string): SourceRef =>
  quote ? { kind: 'slide', doc, page, quote } : { kind: 'slide', doc, page }

const midterm22: SourceRef = { kind: 'image', src: '/sources/wiki/kom_midterm_2022.png', label: 'Midterm 2022 (FIT Wiki)' }
const wKind: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Kind',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/kind/index.html',
}
const wSubkind: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Subkind',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/subkind/index.html',
}
const wPhase: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Phase',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/phase/index.html',
}
const wRole: SourceRef = {
  kind: 'web',
  label: 'OntoUML docs: Role',
  url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/role/index.html',
}

export const ch03: Question[] = [
  {
    id: 'ch03-01',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), otázka 8'] },
    prompt: 'IDENTITA entity v OntoUML:',
    options: [
      'Identita je dána kognitivním mechanismem – naším vnímáním objektu v realitě.',
      'Potřebujeme identitu, abychom mohli manipulovat s entitou.',
      'Identita je dána univerzálním identifikátorem OID (např. číselným).',
      'Potřebujeme identitu, abychom mohli entitu provázat s dalšími entitami.',
    ],
    correct: [0],
    explanation:
      'Princip identity v OntoUML je otázka <strong>našeho vnímání</strong> (intersubjektivní, „dohodnutá konceptualizace“) – podle čeho věc poznáme jako „tu samou“. <br>b, d: identita slouží k referenci a kvantifikaci (odlišit a spočítat), ne k „manipulaci“ ani k propojování – to je implementační pohled. <br>c: OID/UUID je technický identifikátor záznamu, ne princip identity; na začátku úvah není důležité, jak jedince technicky rozlišíme.',
    verified: 'slides',
    sources: [
      midterm22,
      s('P02', 58, 'Jedná se opět o identitu z hlediska našeho vnímání'),
      s('P02', 39, 'Princip identity umožňuje referenci (tj. "ukázání na") a'),
    ],
  },
  {
    id: 'ch03-02',
    topic: 'sortaly',
    kind: 'tf',
    origin: { type: 'real', seen: ['Přednáška 2, Časté otázky'] },
    prompt: 'Problém identity v konceptuálním modelu vyřešíme tím, že každé věci přidělíme UUID.',
    answer: false,
    explanation:
      'UUID umožní jednoznačně odkázat na <em>záznam</em>, ale nevyřeší, zda dva záznamy popisují tutéž věc, ani zda po výměně motoru stále evidujeme stejné auto. To jsou <strong>doménová rozhodnutí</strong> (princip identity), která musí technická identifikace respektovat.',
    verified: 'slides',
    sources: [s('P02', 82, 'UUID nám umožní jednoznačně odkázat na záznam.')],
  },
  {
    id: 'ch03-03',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slide 51 (příklady Sortal / NonSortal)',
      why: 'Procvičuje první rozhodnutí při volbě stereotypu: má typ princip identity?',
    },
    prompt: 'Které z následujících typů jsou <strong>sortály</strong> (mají princip identity)?',
    options: ['Person', 'Organisation', 'Student', 'Teenager', 'Customer', 'Insurable Item', 'Intelligent Entity'],
    correct: [0, 1, 2, 3],
    explanation:
      'Person, Organisation, Student i Teenager mají jeden princip identity – Student a Teenager ho dědí od Person (anti-rigidita na sortalitě nic nemění). <br>Customer (osoba i firma), Insurable Item (auto, dům, zdraví…) a Intelligent Entity sdružují instance s <strong>různými</strong> principy identity → ne-sortály.',
    verified: 'slides',
    sources: [s('P02', 51), s('C03', 6, 'Non-sortální typy = instance mohou mít různé principy identity')],
  },
  {
    id: 'ch03-04',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slidy 52–55 (modální logika, rigidita)',
      why: 'Definice rigidity přes možné světy je základ pro všechny otázky „je rigidní / anti-rigidní“.',
    },
    prompt: 'Typ <em>T</em> je <strong>rigidní</strong>, právě když…',
    options: [
      '…každá jeho instance je jeho instancí nutně, tj. ve všech možných světech, ve kterých existuje.',
      '…pro každou jeho instanci je možné, že v nějakém světě jeho instancí není.',
      '…existuje aspoň jedna instance, která typ může opustit.',
      '…je to typ, jehož instance se v čase nemění žádnými vlastnostmi.',
      '…má povinný vztah k jinému typu.',
    ],
    correct: [0],
    explanation:
      'a) R+(T) = □(∀x: T(x) ⇒ □T(x)) – přesně rigidita. <br>b) je definice <strong>anti-rigidity</strong>. <br>c) je <strong>non-rigidita</strong> (negace rigidity). <br>d) rigidita se týká příslušnosti k typu, ne neměnnosti atributů – osoba stárne, a přesto je rigidně Person. <br>e) povinný vztah = relační závislost (role), s rigiditou nesouvisí.',
    verified: 'slides',
    sources: [s('P02', 54), s('P02', 55), s('P03', 18, 'je logickou negací rigidity.')],
  },
  {
    id: 'ch03-05',
    topic: 'sortaly',
    kind: 'tf',
    origin: { type: 'real', seen: ['Přednáška 2, Časté otázky'] },
    prompt: 'Když někdo zůstane studentem celý život, je pro něj typ <em>Student</em> rigidní.',
    answer: false,
    explanation:
      'Anti-rigidita říká, že daný člověk <strong>může</strong> přestat být studentem a zůstat týmž člověkem. Nevyžaduje, aby k tomu skutečně došlo. Rozhoduje <strong>možnost změny</strong> (◇), ne pozorovaná délka členství.',
    verified: 'slides',
    sources: [s('P02', 83, 'Rozhodujeme podle možnosti změny, nikoli')],
  },
  {
    id: 'ch03-06',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'P03 slide 18 (non-rigidita, semi-rigidita)',
      why: 'Častý chyták: anti-rigidita vs. non-rigidita vs. semi-rigidita.',
    },
    prompt: 'Vyberte pravdivá tvrzení o rigiditě.',
    options: [
      'Anti-rigidita je logickou negací rigidity.',
      'Non-rigidita je logickou negací rigidity.',
      'Anti-rigidita je silnější tvrzení než non-rigidita.',
      'Semi-rigidní typ není ani rigidní, ani anti-rigidní.',
      'Semi-rigidní typ je nutný pro některé své instance a pro jiné jen možný.',
      'Každý typ je buď rigidní, nebo anti-rigidní.',
    ],
    correct: [1, 2, 3, 4],
    explanation:
      'Negací rigidity (¬R+) je <strong>non-rigidita</strong>: stačí jedna instance, která typ může opustit. Anti-rigidita (R−) to požaduje pro <strong>každou</strong> instanci, je tedy silnější. Semi-rigidita R~ = ¬R+ ∧ ¬R− – typ, který je pro některé instance nutný a pro jiné jen možný («mixin», např. Seatable: Chair vždy, Crate jen dokud není rozbitá). Proto f) neplatí – existuje třetí možnost.',
    verified: 'slides',
    sources: [
      s('P03', 18, 'je logickou negací rigidity.'),
      s('P03', 18, 'je to "silnější" tvrzení.'),
      s('P03', 19, 'Mixin jsou semi-rigidní non-sortály'),
    ],
  },
  {
    id: 'ch03-07',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'Midterm 2022, otázka 10 („Vyberte správné charakteristiky pro CATEGORY“)',
      why: 'Stejný formát otázky jako v reálném midtermu, ale pro KIND.',
    },
    prompt: 'Vyberte správné charakteristiky pro KIND:',
    options: ['Poskytuje identitu', 'Je rigidní', 'Je relačně závislý', 'Je semi-rigidní', 'Má identitu', 'Je anti-rigidní', 'Je existenčně závislý'],
    correct: [0, 1, 4],
    explanation:
      'Kind je rigidní sortál, který identitu <strong>poskytuje</strong> (a tedy ji i má/nese). Relačně závislý není (v tabulce sortálů „−“; vztahy mít může, ale nemusí). Semi-/anti-rigidní není. Existenční závislost se týká aspektů (mode, quality), ne kindu.',
    verified: 'slides',
    sources: [s('P02', 79), s('C03', 9, 'Kind (druh) je rigidní sortál poskytující identitu'), wKind],
  },
  {
    id: 'ch03-08',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), otázka 2'] },
    prompt: 'Nadtypem typu entity v OntoUML označené stereotypem <strong>Kind</strong> může být typ se stereotypem:',
    options: ['Role', 'Subkind', 'Relator', 'Phase', 'Mixin', 'RoleMixin', 'Category', 'Mode'],
    correct: [4, 6],
    explanation:
      'Kind <strong>nemůže být podtypem jiného sortálu</strong> → vypadá Subkind, Role, Phase, Relator, Mode (sortály / poskytovatelé identity). Role, Phase a RoleMixin jsou navíc anti-rigidní, a anti-rigidní typ nemůže být nadtypem rigidního. Zbývají rigidní / semi-rigidní ne-sortály <strong>Category</strong> a <strong>Mixin</strong>.',
    verified: 'slides',
    sources: [
      midterm22,
      s('P02', 59, 'Kind poskytuje identitu a nemůže být podtypem jiného sortálu.'),
      s('P02', 59, 'Anti-rigidní typ nemůže být nadtypem rigidního typu.'),
      wKind,
    ],
  },
  {
    id: 'ch03-09',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), otázka 3'] },
    prompt: 'Podtypem typu entity v OntoUML označené stereotypem <strong>Role</strong> může být typ se stereotypem:',
    options: ['Role', 'Subkind', 'Relator', 'Category', 'RoleMixin', 'Mixin', 'Mode', 'Quality'],
    correct: [0],
    explanation:
      'Role je anti-rigidní → pod ní nesmí být rigidní typ (Subkind, Category; ani poskytovatelé identity Relator, Mode, Quality, kteří navíc nesmí být podtypem sortálu). Role je sortál → pod ní nesmí být ne-sortál (Category, RoleMixin, Mixin). Zbývá jen <strong>Role</strong> (např. Student → GraduateStudent).',
    verified: 'slides',
    sources: [
      midterm22,
      s('P02', 59, 'Anti-rigidní typ nemůže být nadtypem rigidního typu.'),
      s('P02', 59, 'Non-Sortal nemůže být podtypem sortálu.'),
      wRole,
    ],
  },
  {
    id: 'ch03-10',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'Midterm 2022, otázky 2–3 (nadtyp/podtyp)',
      why: 'Obrácená varianta reálné otázky – kdo smí stát NAD rolí.',
    },
    prompt: 'Nadtypem typu se stereotypem <strong>Role</strong> může být typ se stereotypem:',
    options: ['Kind', 'Subkind', 'Role', 'Phase', 'RoleMixin', 'Žádný – role nadtyp nepotřebuje, stojí samostatně.'],
    correct: [0, 1, 2, 3, 4],
    explanation:
      'Role identitu neposkytuje, musí ji zdědit od (právě jednoho) poskytovatele identity – takže nadtyp mít <strong>musí</strong>. Anti-rigidní typ smí být pod rigidním (Kind, Subkind) i pod jiným anti-rigidním (Role, Phase – např. Adult → Voter). RoleMixin je ne-sortál, nad sortálem stát smí (kap. 4). Samostatná role je chyba ze slidu „časté chyby“.',
    verified: 'slides',
    sources: [
      s('P02', 59, 'SubKind, Role a Phase dědí identitu přímo či nepřímo od právě jednoho poskytovatele'),
      s('P02', 73),
      s('C03', 11, 'Musí být podtypem rigidního sortálu (aby mohly vznikat instance)'),
      wRole,
    ],
  },
  {
    id: 'ch03-11',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'Midterm 2022, otázka 10 (formát „charakteristiky pro …“)',
      why: 'Reálný formát otázky aplikovaný na PHASE.',
    },
    prompt: 'Vyberte správné charakteristiky pro PHASE:',
    options: [
      'Poskytuje identitu',
      'Je rigidní',
      'Je relačně závislá',
      'Je semi-rigidní',
      'Má identitu',
      'Je anti-rigidní',
      'Podmínka specializace je intrinsická (vnitřní)',
      'Fáze tvoří generalization set {disjoint, complete}',
    ],
    correct: [4, 5, 6, 7],
    explanation:
      'Phase je anti-rigidní sortál: identitu <strong>má</strong> (dědí), ale neposkytuje. Podmínka je vnitřní (věk, živý/mrtvý), proto <strong>není</strong> relačně závislá – to je rozdíl oproti roli. Fáze vždy tvoří phase partition {disjoint, complete}.',
    verified: 'slides',
    sources: [
      s('P02', 61, 'Anti-rigidní specializace taková, že podmínka specializace je intrinsická'),
      s('P02', 61, 'Nad fázemi vždy existuje rozdělení: Phase Partition.'),
      s('P02', 79),
      wPhase,
    ],
  },
  {
    id: 'ch03-12',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'Midterm 2022, otázka 10 (formát „charakteristiky pro …“)',
      why: 'Reálný formát otázky aplikovaný na ROLE.',
    },
    prompt: 'Vyberte správné charakteristiky pro ROLE:',
    options: ['Poskytuje identitu', 'Je rigidní', 'Je relačně závislá', 'Je semi-rigidní', 'Má identitu', 'Je anti-rigidní', 'Podmínka specializace je intrinsická (vnitřní)'],
    correct: [2, 4, 5],
    explanation:
      'Role je anti-rigidní sortál: identitu má (dědí od kindu), neposkytuje ji. Podmínka je <strong>vnější</strong> – role je relačně závislá (povinný vztah, min ≥ 1). Intrinsická podmínka je znak fáze.',
    verified: 'slides',
    sources: [
      s('P02', 69, 'Anti-rigidní specializace taková, že podmínka specializace je vnější.'),
      s('P02', 69, 'Role podléhá relační závislosti (musí mít povinný vztah).'),
      s('P02', 79),
    ],
  },
  {
    id: 'ch03-13',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Přednáška 2, Časté otázky'] },
    prompt: 'Proč je v příkladu z přednášky <em>Student</em> modelován jako «role», ale <em>Dítě</em> jako «phase», když obojí může časem skončit?',
    options: [
      'Rozhoduje důvod klasifikace: studentem je člověk díky vztahu ke vzdělávací instituci, dítětem podle svého věku.',
      'Student je rigidní, Dítě anti-rigidní.',
      'Dítě trvá kratší dobu než studium.',
      'Role je pro typy, které mohou skončit, fáze pro typy, které skončit nemohou.',
      'Je to jen konvence, oba typy lze libovolně zaměnit.',
    ],
    correct: [0],
    explanation:
      'Samotné „dočasný stav“ k výběru stereotypu nestačí – obojí je anti-rigidní. Rozhoduje <strong>důvod klasifikace</strong>: vnější vztah → role, vnitřní vlastnost (věk) → fáze. Délka trvání ani konvence roli nehrají; Student rigidní není.',
    verified: 'slides',
    sources: [s('P02', 84, 'Rozhodující je důvod klasifikace.')],
  },
  {
    id: 'ch03-14',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slide 73 (Role – časté chyby)',
      why: 'Chyba s multiplicitou 0..n u role je přesně to, co se na slidu ukazuje jako „NO!“.',
    },
    prompt: 'Co je v modelu špatně?',
    diagram: {
      classes: [
        { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
        { id: 's', name: 'Student', st: 'role', x: 0, y: 1.3 },
        { id: 'e', name: 'EducationalInstitution', st: 'kind', x: 1.5, y: 1.3 },
      ],
      gens: [{ general: 'p', specifics: ['s'] }],
      assocs: [{ from: 's', to: 'e', name: 'enrolled at', toMult: '0..*' }],
    },
    options: [
      'Spodní mez multiplicity u EducationalInstitution je 0 – role by neměla relační závislost.',
      'Student by měl být «phase».',
      'Person by měl být «subkind».',
      'Role nesmí být podtypem kindu.',
      'Model je v pořádku.',
    ],
    correct: [0],
    explanation:
      'Role musí mít povinný vztah – spodní mez multiplicity na straně „vnější“ entity musí být ≥ 1 (vzor m..n, m ≥ 1). S 0..* by mohl existovat Student, který není nikde zapsán. Student je správně role (vnější podmínka), Person správně kind, role pod kindem je přesně vzor.',
    verified: 'slides',
    sources: [s('P02', 73), s('P02', 74), s('C03', 11, 'Musí mít povinný vztah, alespoň 1 (může být zděděný)'), wRole],
  },
  {
    id: 'ch03-15',
    topic: 'sortaly',
    kind: 'tf',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slide 61 (Phase Partition)',
      why: 'Ověřuje, že student ví, že phase partition musí být disjoint i complete.',
    },
    prompt: 'Model na obrázku je správně: fáze Child a Teenager tvoří generalization set <code>{disjoint}</code>.',
    diagram: {
      classes: [
        { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
        { id: 'c', name: 'Child', st: 'phase', x: 0, y: 1.3 },
        { id: 't', name: 'Teenager', st: 'phase', x: 1, y: 1.3 },
      ],
      gens: [{ general: 'p', specifics: ['c', 't'], set: { disjoint: true } }],
    },
    answer: false,
    explanation:
      'Phase partition musí být vždy <strong>disjoint a complete</strong>. Tady chybí complete (a s ním i fáze pro dospělé) – dospělá osoba by nebyla v žádné fázi.',
    verified: 'slides',
    sources: [s('P02', 61, 'Nad fázemi vždy existuje rozdělení: Phase Partition.'), wPhase],
  },
  {
    id: 'ch03-16',
    topic: 'sortaly',
    kind: 'mc',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slide 60 (příklady Role / Phase / Subkind)',
      why: 'Rozlišení role vs. fáze vs. subkind na konkrétních pojmech.',
    },
    prompt: 'Které z typů (podtypů «kind» Person) bys modeloval jako <strong>«phase»</strong>?',
    options: ['Teenager', 'LivingPerson', 'Adult', 'Student', 'Husband', 'Employee', 'Woman'],
    correct: [0, 1, 2],
    explanation:
      'Teenager, Adult (věk) a LivingPerson (živý/mrtvý) jsou dány <strong>vnitřní</strong> vlastností → fáze. Student, Husband a Employee existují díky vztahu (škola, manželka, zaměstnavatel) → role. Woman (biologicky) je rigidní → subkind.',
    verified: 'slides',
    sources: [s('P02', 60), s('P02', 61), s('P02', 69)],
  },
  {
    id: 'ch03-17',
    topic: 'km',
    kind: 'tf',
    origin: { type: 'real', seen: ['Přednáška 2, Časté otázky'] },
    prompt: 'Dva různé konceptuální modely téže domény mohou být oba správné.',
    answer: true,
    explanation:
      'Ano – stejnou doménu lze modelovat pro různé účely a s různou podrobností. Rozdíly je ale nutné obhájit definicemi, předpoklady a otázkami, na které má model odpovídat. „Každý to vidí jinak“ neospravedlňuje vnitřní rozpor.',
    verified: 'slides',
    sources: [s('P02', 81, 'Ano: stejnou doménu lze modelovat pro různé účely a s různou podrobností.')],
  },
  {
    id: 'ch03-18',
    topic: 'sortaly',
    kind: 'tf',
    origin: {
      type: 'original',
      inspiredBy: 'P02 slide 58 (Kind vs. SubKind)',
      why: 'Nejčastější záměna: subkind je rigidní jako kind, ale identitu neposkytuje.',
    },
    prompt: '«subkind» poskytuje svým instancím princip identity.',
    answer: false,
    explanation:
      'Subkind je rigidní sortál, ale identitu <strong>neposkytuje</strong> – dědí ji (přímo či nepřímo) od právě jednoho poskytovatele identity, typicky «kind». Muže a ženy rozlišujeme stejně jako lidi obecně.',
    verified: 'slides',
    sources: [
      s('P02', 58, 'Kind poskytuje ontologickou identitu, zatímco SubKind nikoliv.'),
      s('C03', 9, 'SubKind (poddruh) je rigidní sortál neposkytující identitu'),
      wSubkind,
    ],
  },
]
