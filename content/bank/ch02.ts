import type { Question, SourceRef, Diagram } from '../types'

const P02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P02', page, quote })
const C02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'C02', page, quote })

const manWoman = (set: { disjoint?: boolean; complete?: boolean }): Diagram => ({
  classes: [
    { id: 'person', name: 'Person', st: 'none', x: 0.5, y: 0 },
    { id: 'man', name: 'Man', st: 'none', x: 0, y: 1 },
    { id: 'woman', name: 'Woman', st: 'none', x: 1, y: 1 },
  ],
  gens: [{ general: 'person', specifics: ['man', 'woman'], set }],
})

export const ch02: Question[] = [
  {
    id: 'ch02-01',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slides 3–5 (UML, UML SE, OntoUML)', why: 'Základní fakta o UML a profilech.' },
    prompt: 'Která tvrzení o UML jsou pravdivá?',
    options: [
      'Standard UML spravuje Object Management Group (OMG).',
      'UML je založeno na metamodelu MOF (MetaObject Facility).',
      'UML umožňuje významové rozšíření pomocí UML profilů.',
      'UML je totéž co UML profil pro softwarové inženýrství.',
      'OntoUML je UML profil.',
      'UML nelze rozšiřovat, proto OntoUML definuje zcela nový jazyk.',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'UML spravuje OMG, stojí na MOF a rozšiřuje se profily – jedním z nich je OntoUML. Ztotožnění UML s UML SE (diagram tříd pro OOP) je podle přednášky častá, ale <strong>nesprávná</strong> záměna. OntoUML nevzniklo jako nový jazyk, ale jako profil (stereotypy).',
    verified: 'slides',
    sources: [
      P02(3, 'Standard jazyka UML je spravován Object Management Group (OMG).'),
      P02(3, 'Založen na metamodelu MOF (MetaObject Facility), definuje základní typy entit třída,'),
      P02(4, 'Často bývá z historických důvodů nesprávně zaměňováno UML = UML profil pro'),
      P02(13, 'UML profil založený na UFO pro Ontology-Driven Conceptual Modelling'),
    ],
  },
  {
    id: 'ch02-02',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'C02, slide 6 (Třída)', why: 'Notace třídy z cvičení.' },
    prompt: 'Co v UML třídě znamená atribut zapsaný jako <code># email: String</code>?',
    options: ['protected atribut', 'private atribut', 'public atribut', 'atribut viditelný v rámci balíčku (package)', 'odvozený (derived) atribut'],
    correct: [0],
    explanation:
      '<code>#</code> = protected, <code>-</code> = private, <code>+</code> = public, <code>~</code> = package, <code>/</code> = derived.',
    verified: 'slides',
    sources: [C02(6, '~ public in same package')],
  },
  {
    id: 'ch02-03',
    kind: 'tf',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'C02, slides 12–13 (Agregace, Kompozice)', why: 'Rozdíl prázdný × plný kosočtverec.' },
    prompt: 'U <strong>kompozice</strong> (plný kosočtverec na straně celku) nemůže část existovat bez celku, zatímco u agregace (prázdný kosočtverec) mohou celek i část existovat odděleně.',
    answer: true,
    explanation:
      'Agregace: prázdný kosočtverec, celek i část existují odděleně (koš s jablky). Kompozice: plný kosočtverec, část nemůže existovat bez celku (tabulka a sloupce). Kosočtverec je vždy na straně <em>celku</em>.',
    verified: 'slides',
    sources: [C02(12, 'Celek i část mohou existovat odděleně'), C02(13, 'Část nemůže existovat bez celku')],
  },
  {
    id: 'ch02-04',
    kind: 'tf',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 17 (Instance v OntoUML)', why: 'Slide je označen POZOR – zásadní rozdíl UML × OntoUML.' },
    prompt: 'V OntoUML, stejně jako v UML, je každý jedinec instancí právě jedné třídy (vazba třída–instance je 1:1).',
    answer: false,
    explanation:
      'POZOR ze slidu: v OntoUML vazba třída–instance <strong>není 1:1</strong>. Tentýž jedinec (Mick Jagger) je současně Person, Man, Singer…, a v různých světech (časech) navíc Young Boy, Adult Man, British Citizen či Economist.',
    verified: 'slides',
    sources: [
      P02(17, 'POZOR: na rozdíl od UML ale není vazba třída-instance 1:1'),
      { kind: 'web', label: 'OntoUML docs: Types and Individuals', url: 'https://ontouml.readthedocs.io/en/latest/theory/individuals.html' },
    ],
  },
  {
    id: 'ch02-05',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 19 (Abstraktní typy entit)', why: 'Definice a značení abstraktního typu.' },
    prompt: 'Co platí o <strong>abstraktním</strong> typu entity?',
    options: [
      'Nemá v realitě samostatné instance.',
      'Instanci tvoří jen spolu s alespoň jedním svým podtypem.',
      'Značí se názvem psaným kurzívou.',
      'Značí se podtrženým názvem.',
      'Nesmí mít žádné atributy.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Abstraktní typ (jako abstraktní třída v UML) nemá samostatné instance, instance vzniká jen spolu s podtypem, značí se <em>kurzívou</em>. Podtržení značí třídní atribut, ne abstraktní typ. Atributy mít může (dědí je podtypy).',
    verified: 'slides',
    sources: [
      P02(19, 'Abstraktní typ entity nemá v realitě samostatné instance. (V UML odpovídá abstraktní'),
      P02(19, 'Instanci tvoří jen spolu s alespoň jedním svým podtypem.'),
      P02(19, 'Abstraktní typ entity se značí názvem psaným kurzívou.'),
    ],
  },
  {
    id: 'ch02-06',
    kind: 'tf',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 20 (Metody)', why: 'Častá záměna UML SE a OntoUML.' },
    prompt: 'OntoUML (UFO-A) využívá metody tříd k modelování chování entit.',
    answer: false,
    explanation:
      'Metody má UML / objektový model. OntoUML (UFO-A) je <strong>nevyužívá</strong> – pro modelování chování slouží UFO-B (události).',
    verified: 'slides',
    sources: [P02(20, 'OntoUML (UFO-A) nevyužívá, pro modelování chování slouží UFO-B.')],
  },
  {
    id: 'ch02-07',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 18 (Atributy typů entit)', why: 'Podtržený atribut – snadno přehlédnutelný detail.' },
    prompt: 'V typu <code>Professor</code> je atribut <code>fixRateSalary: Currency[1]</code> zapsán podtrženě. Co to znamená?',
    options: [
      'Je to atribut typu entity: vlastnost společná všem entitám, na úrovni jednotlivých entit konstanta.',
      'Je to povinný atribut, každý profesor má vlastní hodnotu.',
      'Je to odvozený atribut.',
      'Je to identifikátor entity.',
      'Typ Professor je abstraktní.',
    ],
    correct: [0],
    explanation:
      'Podtržení = atribut <strong>typu</strong> entity (v UML třídní / statický atribut): hodnota je společná všem profesorům. Povinnost vyjadřuje multiplicita <code>[1]</code>, odvozenost lomítko <code>/</code>, abstraktnost kurzíva.',
    verified: 'slides',
    sources: [
      P02(18, 'Atribut typu entity vyjadřuje vlastnosti, které jsou společné všem entitám, jsou tedy'),
      P02(18, 'Syntakticky odpovídají třídním atributům v UML - značíme podtrženě:'),
    ],
  },
  {
    id: 'ch02-08',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 21 (Specializace)', why: 'Vlastnosti relace specializace.' },
    prompt: 'Která tvrzení o specializaci (dědění) platí?',
    options: [
      'Je antisymetrická: je-li B specializací A, A nemůže být specializací B.',
      'Je tranzitivní: je-li B specializací A a C specializací B, je C specializací A.',
      'Je symetrická.',
      'Dědí se atributy i vztahy nadtypu.',
      'Dědí se pouze atributy, vztahy ne.',
      'UML neumožňuje vícenásobné dědění.',
    ],
    correct: [0, 1, 3],
    explanation:
      'Specializace je antisymetrická a tranzitivní relace a přes řetěz specializace se dědí <strong>všechny</strong> vlastnosti – atributy i vztahy. UML vícenásobné dědění povoluje (Amphibious car z Car i Ship).',
    verified: 'slides',
    sources: [
      P02(21, 'Všechny vlastnosti třídy (atributy a vztahy) se dědí přes řetěz specializace.'),
      P02(21),
      C02(8),
    ],
  },
  {
    id: 'ch02-09',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 24 (Generalization Set: jen complete)', why: 'Výčet povolených instancí – typický test porozumění.' },
    prompt: 'Generalization set je označen jen <code>{complete}</code>. Čím může být instance?',
    diagram: manWoman({ complete: true }),
    options: ['jen Person (bez podtypu)', 'jen Man', 'jen Woman', 'Man i Woman zároveň'],
    correct: [1, 2, 3],
    explanation:
      '<code>complete</code>: každá instance nadtypu je instancí alespoň jednoho podtypu → „jen Person“ nejde (nadtyp je de facto abstraktní). Bez <code>disjoint</code> je povolen překryv, takže Man i Woman zároveň ano.',
    verified: 'slides',
    sources: [
      P02(24, 'Instance může být Žena, Muž a nebo obojí.'),
      P02(24, 'Mohou existovat instance podtříd a jejich kombinací (nadtřída je de-facto abstraktní).'),
    ],
  },
  {
    id: 'ch02-10',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 25 (Generalization Set: jen disjoint)', why: 'Doplněk k otázce na complete.' },
    prompt: 'Generalization set je označen jen <code>{disjoint}</code>. Čím může být instance?',
    diagram: manWoman({ disjoint: true }),
    options: ['jen Person (bez podtypu)', 'jen Man', 'jen Woman', 'Man i Woman zároveň'],
    correct: [0, 1, 2],
    explanation:
      '<code>disjoint</code>: žádná instance nepatří do více podtypů → kombinace ne. Bez <code>complete</code> může instance zůstat „jen Person“.',
    verified: 'slides',
    sources: [P02(25, 'Instance může být buď Žena, Muž a nebo jen Člověk (ale ne kombinace).')],
  },
  {
    id: 'ch02-11',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 22 (Dědění z hlediska množinové sémantiky)', why: 'Definice meta-atributů generalization set.' },
    prompt: 'Co znamená meta-atribut <code>complete</code> u generalization set?',
    options: [
      'Každá instance nadtypu je také instancí alespoň jednoho z podtypů.',
      'V UML terminologii odpovídá isCovering = true.',
      'Neexistuje instance, která by byla instancí více než jednoho z podtypů.',
      'Model obsahuje všechny podtypy, které v doméně existují, a další nelze přidat do žádného modelu.',
      'Každá instance je instancí právě jednoho podtypu.',
    ],
    correct: [0, 1],
    explanation:
      '<code>complete</code> = pokrytí (UML <code>isCovering = true</code>): každá instance nadtypu je v alespoň jednom podtypu. Možnost C je definice <code>disjoint</code>, možnost E platí až pro <code>{disjoint, complete}</code>.',
    verified: 'slides',
    sources: [
      P02(22, 'complete = každá instance nadtypu je také instancí alespoň jednoho z podtypů.'),
      P02(22, 'V UML terminologii odpovídá isCovering = true'),
      P02(22, 'disjoint = neexistuje instance, která by byla instancí více než jednoho z podtypů.'),
    ],
  },
  {
    id: 'ch02-12',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki)', 'Zkouška (FIT Wiki), úloha 27'] },
    prompt: 'Násobnost vztahu 1..* v OntoUML modelu pro danou entitu znamená:',
    options: [
      'Vztah je pro entitu vždy povinný.',
      'Vztah je pro entitu povinný, nicméně toleruje krátké výjimky.',
      'Vztah je povinný v závislosti na dalších meta-atributech vztahu.',
      'Vztah je pro entitu doporučen jako povinný.',
      'Násobnost nespecifikuje povinnost vztahu.',
    ],
    correct: [0],
    explanation:
      'Spodní mez určuje povinnost: 1 znamená, že entita musí být ve vztahu s alespoň jednou entitou – <strong>vždy</strong>, bez výjimek. Horní mez * jen říká, že maximum není omezeno.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/mid22-09.png', label: 'Midterm 2022 (FIT Wiki), úloha 9' },
      { kind: 'image', src: '/sources/wiki/ex-27.png', label: 'Zkouška (FIT Wiki), úloha 27' },
      P02(29, 'spodní mez – typicky určuje povinnost ve vztahu:'),
      C02(11, 'x..* = nejméně x, maximum bez omezení'),
      { kind: 'wiki', label: 'FIT Wiki: BI-KOM midterm 2022 (screenshot)' },
    ],
  },
  {
    id: 'ch02-13',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slides 28–29 (Multiplicita)', why: 'Čtení multiplicity ve směru čtení je častý zdroj chyb.' },
    prompt: 'Co podle diagramu platí?',
    diagram: {
      classes: [
        { id: 'person', name: 'Person', st: 'none', x: 0, y: 0 },
        { id: 'car', name: 'Car', st: 'none', x: 1.5, y: 0 },
      ],
      assocs: [{ from: 'person', to: 'car', name: 'owns ▶', fromMult: '1..1', toMult: '0..*' }],
    },
    options: [
      'Osoba nemusí vlastnit žádné auto.',
      'Každé auto má právě jednoho vlastníka.',
      'Osoba vlastní nejvýše jedno auto.',
      'Auto nemusí mít žádného vlastníka.',
      'Osoba může vlastnit libovolný počet aut.',
    ],
    correct: [0, 1, 4],
    explanation:
      'Čte se ve směru čtení: Osoba (jedna) vlastní 0..* aut → osoba nemusí mít auto a může jich mít libovolně. U Person je 1..1 → každé auto má právě jednoho vlastníka (povinně).',
    verified: 'slides',
    sources: [
      P02(28, 'Multiplicita se zapisuje ve směru čtení (např. Osoba (jedna) vlastní 0..n Aut.)!'),
      P02(29, 'Osoba nemusí vlastnit žádné auto (0..).'),
      P02(29, 'Auto musí mít osobu (vlastníka) (1..).'),
    ],
  },
  {
    id: 'ch02-14',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 33 (Asociace – typy)', why: 'Klasifikace 1:1 / 1:N / M:N podle horních mezí.' },
    prompt: 'Asociace má na straně A multiplicitu <code>0..1</code> a na straně B multiplicitu <code>1..*</code>. O jaký typ asociace jde?',
    options: ['1:1', '1:N', 'M:N', 'nelze určit bez dolních mezí'],
    correct: [1],
    explanation:
      'O typu rozhodují <strong>horní</strong> meze: na straně A je max. 1, na straně B * → instance A může mít více instancí B, každá B má max. jednu A = 1:N. Dolní meze určují povinnost, ne typ.',
    verified: 'slides',
    sources: [P02(33, 'Asociace je vztah oboustranný, který má název a 4 charakteristiky (spodní-horní mez,'), P02(33)],
  },
  {
    id: 'ch02-15',
    kind: 'tf',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 32 (Asociace – poznámky)', why: 'Princip „multiplicity určuje doména“.' },
    prompt: 'Pouze na základě pohledu na model lze rozhodnout, zda jsou multiplicity asociací správně.',
    answer: false,
    explanation:
      'Multiplicity jsou určeny problémovou doménou a jsou výsledkem konceptuální analýzy. Bez znalosti účelu systému a pravidel v realitě je nelze posoudit (autoklub: každá osoba vlastní 1..* aut; vlastník jako uživatel: auto může mít více vlastníků).',
    verified: 'slides',
    sources: [P02(32, 'Multiplicity jsou určeny problémovou doménou a jsou tedy výsledkem konceptuální')],
  },
  {
    id: 'ch02-16',
    kind: 'mc',
    topic: 'uml',
    origin: { type: 'original', inspiredBy: 'P02, slide 30 (Asociace – metaatributy)', why: 'Výchozí hodnoty metaatributů.' },
    prompt: 'Které metaatributy konce asociace platí jako výchozí (default), když nic neuvedeme?',
    options: ['unordered', 'ordered', 'unique', 'nonunique'],
    correct: [0, 2],
    explanation:
      'Default je <code>unordered</code> (<code>isOrdered = false</code>) a <code>unique</code>. <code>ordered</code> (pořadí vkládání) a <code>nonunique</code> (<code>isUnique = false</code>, prvky se mohou opakovat) je třeba uvést explicitně.',
    verified: 'slides',
    sources: [
      P02(30, 'unordered – neuspořádaná množina (default, isOrdered = false )'),
      P02(30, 'unique – prvky musí být unikátní (default)'),
    ],
  },
]
