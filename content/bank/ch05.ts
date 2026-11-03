import type { Question } from '../types'

export const ch05: Question[] = [
  // ---------------------------------------------------------------- 5.1
  {
    id: 'ch05-01',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 30 (Sdílitelnost)',
      why: 'Význam diamantu se v OntoUML liší od UML, typický chyták.',
    },
    prompt: 'Co v OntoUML vyjadřuje <strong>prázdný diamant</strong> u vztahu celek–část (viz diagram)?',
    diagram: {
      classes: [
        { id: 'res', name: 'Researcher', st: 'role', x: 0, y: 0 },
        { id: 'rg', name: 'ResearchGroup', st: 'collective', x: 2.2, y: 0 },
      ],
      assocs: [{ from: 'res', to: 'rg', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*' }],
    },
    options: [
      'Část je sdílitelná: může být současně částí více celků.',
      'Maximální multiplicita na straně celku je větší než 1.',
      'Část může existovat bez celku (slabší vazba, agregace jako v UML).',
      'Část je esenciální pro celek.',
      'Celek je kolektiv (prázdný diamant se používá jen u memberOf).',
    ],
    correct: [0, 1],
    explanation:
      'Prázdný diamant = <code>{isShareable = true}</code>: část může patřit více celkům, což se pozná z multiplicity na straně celku (max. &gt; 1, zde 1..*). Neříká nic o tom, zda část bez celku přežije (to určuje dolní mez na straně celku a {inseparable}), ani o esencialitě. Prázdný diamant může mít i componentOf nebo subCollectionOf.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 30, quote: 'sdílitelná část, multiplicita max. > 1' },
      { kind: 'slide', doc: 'C05', page: 4, quote: 'plný diamant = část není sdílitelná více celky' },
    ],
  },
  {
    id: 'ch05-02',
    kind: 'tf',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 4 a 30',
      why: 'Studenti si plný diamant pletou s UML kompozicí.',
    },
    prompt:
      'Plný diamant ve vztahu celek–část v OntoUML znamená, že část nemůže existovat bez celku (stejně jako kompozice v UML).',
    answer: false,
    explanation:
      'Nepravda. V OntoUML plný diamant znamená jen <strong>nesdílitelnost</strong> (část patří nejvýše jednomu celku, max. multiplicita na straně celku = 1). Že část bez celku existovat nemůže, vyjadřuje povinný celek (dolní mez ≥ 1 na straně celku), resp. <code>{inseparable}</code> pro určitý celek. Viz Car–Chassis: plný diamant, ale na straně celku 0..1.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 30, quote: 'nesdílitelná část, multiplicita max. 1' },
      { kind: 'slide', doc: 'P04', page: 20, quote: 'Část může existovat bez Celku.' },
    ],
  },
  // ---------------------------------------------------------------- 5.2
  {
    id: 'ch05-03',
    kind: 'mc',
    topic: 'celek-cast',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), úloha 6', 'Zkouška (FIT Wiki), úloha 42'] },
    prompt: 'Pro vztahy Celek–Část:',
    options: [
      'existuje několik typů „povinnosti“ z hlediska Celku.',
      'je třeba analyzovat směr vztahu Část → Celek.',
      'je třeba analyzovat směr vztahu Celek → Část.',
      'existuje několik typů „povinností“ z hlediska Části.',
    ],
    correct: [0, 1, 2, 3],
    explanation:
      'Vše platí. Z hlediska celku: volitelná, povinná a esenciální část. Z hlediska části: nepovinný celek, povinný celek a neoddělitelná část. Proto se musí analyzovat oba směry (Celek → Část i Část → Celek).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/mid22-06.png', label: 'Midterm 2022 (FIT Wiki), úloha 6' },
      { kind: 'image', src: '/sources/wiki/ex-42.png', label: 'Zkouška (FIT Wiki), úloha 42' },
      { kind: 'slide', doc: 'P04', page: 31, quote: 'Směrem od Celku k Částem (optional, mandatory, essential).' },
      { kind: 'slide', doc: 'P04', page: 31, quote: 'Směrem od Části k Celku (optional, mandatory, inseparable part)' },
      { kind: 'image', src: '/sources/wiki/kom_midterm_2022.png', label: 'Midterm 2022 (FIT Wiki)' },
    ],
  },
  {
    id: 'ch05-04',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 8–10 a 24 (srdce vs. mozek)',
      why: 'Ověřuje rozdíl generické a existenční závislosti.',
    },
    prompt:
      'Doména: „Každý člověk musí mít srdce, ale srdce lze transplantovat (vyměnit za jiné). Mozek vyměnit nelze, jiný mozek = jiný člověk.“ Které modelování je správné?',
    options: [
      'Person – Heart: multiplicita 1 na straně části, bez meta-atributu {essential}.',
      'Person – Heart: {essential}.',
      'Person – Brain: {essential}.',
      'Person – Brain: stačí multiplicita 1, žádný meta-atribut.',
      'Person – Heart: {immutablePart}.',
    ],
    correct: [0, 2],
    explanation:
      'Srdce je <strong>povinná</strong> část: člověk potřebuje <em>nějaké</em> srdce (generická závislost), na to stačí multiplicita 1. {essential} by znamenalo závislost na <em>určitém</em> srdci, takže by transplantace nebyla možná. Mozek je <strong>esenciální</strong>: člověk je existenčně závislý na tomto konkrétním mozku. {immutablePart} se používá jen u anti-rigidního celku, Person je kind.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 10, quote: 'Rozdíl spočívá v závislosti na typu vs závislosti na konkrétní instanci.' },
      { kind: 'slide', doc: 'P04', page: 24 },
    ],
  },
  {
    id: 'ch05-05',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 18, 22 a 25',
      why: 'Implikace mezi druhy povinnosti jsou klasický typ teoretické otázky.',
    },
    prompt: 'Které implikace mezi meta-vlastnostmi vztahu celek–část platí?',
    options: [
      'Esenciální část ⇒ povinná část.',
      'Neoddělitelná část ⇒ povinný celek.',
      'Esenciální část ⇒ neoddělitelná část.',
      'Neoddělitelná část ⇒ esenciální část.',
      'Povinná část ⇒ esenciální část.',
    ],
    correct: [0, 1],
    explanation:
      'Esencialita je silnější než povinnost, takže ji implikuje. Neoddělitelnost implikuje povinnost celku. Esencialita a neoddělitelnost jsou ale nezávislé: „Sebrané dílo“ má esenciální části, které existovaly už předtím (nejsou neoddělitelné), a díra ve zdi je neoddělitelná, ale ne esenciální. Povinná část esencialitu neimplikuje (srdce lze vyměnit).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 18, quote: 'a tudíž esencialita implikuje povinnost' },
      { kind: 'slide', doc: 'P04', page: 22, quote: 'Neoddělitelnost implikuje povinnost Celku.' },
      { kind: 'slide', doc: 'P04', page: 25, quote: 'Díra ve zdi je její neoddělitelná Část, ale nikoliv esenciální.' },
    ],
  },
  // ---------------------------------------------------------------- 5.3
  {
    id: 'ch05-06',
    kind: 'tf',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Cvičení 5, slajd 6 ({immutableWhole} a {immutablePart})',
      why: 'Rozdíl essential vs. immutablePart podle rigidity celku.',
    },
    prompt:
      'Je-li celek <span class="st">«phase»</span> (např. LivingPerson) a chceme vyjádřit, že po celou dobu této fáze má stále tutéž část, použijeme meta-atribut <code>{essential}</code>.',
    answer: false,
    explanation:
      'Nepravda. {essential} platí ve všech světech, kde celek existuje, a dává smysl jen pro rigidní celek. Pro anti-rigidní celek (role, phase) se místo něj používá <code>{immutablePart}</code>: „vždy když je John žijící, je Johnův mozek jeho částí“.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C05', page: 6, quote: '{immutablePart} pokud je celek' },
      { kind: 'slide', doc: 'C05', page: 6, quote: 'Vždy když je osoba John žijící (fáze), pak je Johnův mozek jeho částí.' },
      { kind: 'slide', doc: 'P04', page: 26 },
    ],
  },
  // ---------------------------------------------------------------- 5.4
  {
    id: 'ch05-07',
    kind: 'mc',
    topic: 'celek-cast',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), úloha 4', 'Zkouška (FIT Wiki), úloha 68'] },
    prompt: 'Nadtypem typu entity v OntoUML označené stereotypem <strong>Quantity</strong> může být typ se stereotypem:',
    options: ['Quality', 'Category', 'Quantity', 'Kind', 'Relator', 'Collective', 'Mixin', 'Phase'],
    correct: [1, 6],
    explanation:
      '«quantity» je rigidní sortál, který poskytuje identitu (stejně jako kind). Nad sebou proto může mít jen ne-sortály, které nedávají identitu a nejsou anti-rigidní: <strong>Category</strong> a <strong>Mixin</strong>. Jiný poskytovatel identity (Kind, Quantity, Collective, Relator, Quality) by znamenal dvě identity, Phase je anti-rigidní a navíc sortál.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/mid22-04.png', label: 'Midterm 2022 (FIT Wiki), úloha 4' },
      { kind: 'image', src: '/sources/wiki/ex-68.png', label: 'Zkouška (FIT Wiki), úloha 68' },
      { kind: 'slide', doc: 'P04', page: 53, quote: 'Quantity a Collective jsou stejně jako Kind a Relator rigidní sortály poskytující' },
      { kind: 'web', label: 'OntoUML docs: Quantity', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/quantity/index.html' },
      { kind: 'image', src: '/sources/wiki/kom_midterm_2022.png', label: 'Midterm 2022 (FIT Wiki)' },
    ],
  },
  {
    id: 'ch05-08',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 38–42 a 53',
      why: 'Midterm se ptá „Vyberte správné charakteristiky pro X“, zde pro COLLECTIVE.',
    },
    prompt: 'Vyberte správné charakteristiky pro <strong>COLLECTIVE</strong>:',
    options: [
      'Poskytuje identitu.',
      'Je rigidní.',
      'Všechny jeho prvky hrají v celku stejnou roli.',
      'Musí mít alespoň 2 členy.',
      'Je vymezen topologicky (maximální spojitý objekt).',
      'Jeho části jsou stejného typu jako on sám (část lesa je les).',
      'Je anti-rigidní.',
    ],
    correct: [0, 1, 2, 3],
    explanation:
      '«collective» je rigidní sortál poskytující identitu. Prvky hrají stejnou roli (na rozdíl od funkčního celku) a kolektiv potřebuje alespoň 2 členy, aby existovala sjednocující relace. Topologicky vymezená je <strong>kvantita</strong>, kolektiv drží pohromadě sjednocující relace. Části kolektivu nejsou téhož typu jako celek (strom není les). Pozor: „severní cíp lesa“ je podkolektiv (subCollectionOf), ne prvek.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 38, quote: 'Kolektiv je oproti Kvantitě složen z částí, které nejsou stejného typu jako on sám' },
      { kind: 'slide', doc: 'P04', page: 41 },
      { kind: 'slide', doc: 'P04', page: 42, quote: 'Kolektiv musí mít alespoň 2 členy' },
      { kind: 'slide', doc: 'P04', page: 53 },
    ],
  },
  // ---------------------------------------------------------------- 5.6 (transitivity)
  {
    id: 'ch05-09',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 54 (Jak vybrat relaci celek–část)',
      why: 'Tranzitivita je hlavní rozlišující vlastnost relací celek–část.',
    },
    prompt: 'Které z relací celek–část jsou <strong>vždy tranzitivní</strong>?',
    options: ['«subCollectionOf»', '«subQuantityOf»', '«memberOf»', '«componentOf»', '«containment»'],
    correct: [0, 1],
    explanation:
      'subCollectionOf je tranzitivní (všichni členové podkolektivu jsou členy kolektivu), subQuantityOf také (vyplývá z maximality, je vždy esenciální). memberOf je netranzitivní (člen klubu není členem federace klubů). componentOf není obecně tranzitivní (záleží na případu). containment podle přehledu na slajdu 54 tranzitivní není.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 54 },
      { kind: 'slide', doc: 'P04', page: 37, quote: 'Relace je tranzitivní a irreflexivní (vyplývá z maximality).' },
      { kind: 'slide', doc: 'P04', page: 44, quote: 'Relace MemberOf je irreflexivní, anti-symetrická a NEtranzitivní' },
      { kind: 'slide', doc: 'P04', page: 51, quote: 'Není obecně tranzitivní (v některých případech je, v jiných není).' },
    ],
  },
  // ---------------------------------------------------------------- 5.5
  {
    id: 'ch05-10',
    kind: 'tf',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 44 (Club Federation)',
      why: 'Netranzitivita memberOf na konkrétním modelu.',
    },
    prompt:
      'Z uvedeného modelu plyne, že každý Club Member je (nepřímo) členem Club Federation.',
    diagram: {
      classes: [
        { id: 'fed', name: 'Club Federation', st: 'collective', x: 0, y: 0 },
        { id: 'club', name: 'Club', st: 'collective', x: 0, y: 1.8 },
        { id: 'person', name: 'Person', st: 'kind', x: 2.1, y: 0 },
        { id: 'cm', name: 'Club Member', st: 'role', x: 2.1, y: 1.8 },
      ],
      gens: [{ general: 'person', specifics: ['cm'] }],
      assocs: [
        { from: 'club', to: 'fed', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*' },
        { from: 'cm', to: 'club', st: 'memberOf', whole: 'to', shareable: true, fromMult: '2..*', toMult: '1..*' },
      ],
    },
    answer: false,
    explanation:
      'Nepravda. «memberOf» je <strong>netranzitivní</strong>: členy federace jsou kluby, ne jednotlivci. Tranzitivitu by zachovala kombinace memberOf + subCollectionOf (člen podkolektivu je členem kolektivu), ne dvě memberOf za sebou.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 44, quote: 'nevyplývá, že jsem členem Federace, protože členové Federace mohou být pouze kluby,' },
      { kind: 'slide', doc: 'P04', page: 48, quote: 'Kombinace relace MemberOf a SubCollectionOf zachovává tranzitivitu' },
    ],
  },
  // ---------------------------------------------------------------- 5.6
  {
    id: 'ch05-11',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 33 (příklady typů agregací); aktivita na cvičení 5',
      why: 'Na cvičení se identifikují vztahy celek–část, v testu jde o správné přiřazení relace.',
    },
    prompt: 'Které dvojice (část – celek) mají správně přiřazenou relaci?',
    options: [
      'strom – les: «memberOf»',
      'alkohol – víno: «subQuantityOf»',
      'motor – automobil: «componentOf»',
      'severní cíp lesa – les: «subCollectionOf»',
      'víno – láhev: «subQuantityOf»',
      'student – paralelka: «componentOf»',
    ],
    correct: [0, 1, 2, 3],
    explanation:
      'Strom je prvek kolektivu les (memberOf), alkohol je podkvantita vína (subQuantityOf), motor je komponenta funkčního celku auto (componentOf), severní cíp lesa je podkolektiv (subCollectionOf). Víno v láhvi je «containment» (láhev není kvantita). Student v paralelce je člen kolektivu (memberOf): všichni studenti v ní hrají stejnou roli.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 33, quote: 'memberOf : strom-les, student-paralelka, pták-hejno' },
      { kind: 'slide', doc: 'P04', page: 54 },
    ],
  },
  {
    id: 'ch05-12',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 37 (Relace SubQuantityOf)',
      why: 'Slajd vyjmenovává pět vlastností subQuantityOf, ideální materiál na otázku.',
    },
    prompt: 'Které vlastnosti má relace <strong>«subQuantityOf»</strong>?',
    options: [
      'Na straně části je multiplicita vždy právě 1.',
      'Jde vždy o esenciální část.',
      'Je tranzitivní.',
      'Je sdílitelná (prázdný diamant): táž podkvantita může být ve více kvantitách.',
      'Může spojovat «quantity» (část) a «kind» (celek), např. víno a láhev.',
      'Je reflexivní: každá kvantita je svou vlastní podkvantitou.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Podkvantity jsou maximální, proto na straně části právě 1. Je vždy esenciální (vyměníš alkohol ve víně a není to totéž víno) a tranzitivní. Je <strong>nesdílitelná</strong> (kvantity jsou topologicky spojité). Spojuje jen dvě kvantity, víno–láhev je «containment». Je irreflexivní.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 37, quote: 'Vždy se jedná o esenciální část' },
      { kind: 'slide', doc: 'P04', page: 54, quote: 'Právě 1 na straně části; esenciální, nesdílená' },
      { kind: 'web', label: 'OntoUML docs: SubQuantityOf', url: 'https://ontouml.readthedocs.io/en/latest/relationships/aggregations/subQuantityOf/index.html' },
    ],
  },
  {
    id: 'ch05-13',
    kind: 'mc',
    topic: 'celek-cast',
    origin: {
      type: 'original',
      inspiredBy: 'Vzorové řešení cvičení 5 (vozový park)',
      why: 'Ve vzorovém řešení je motor připojen k fázi s {immutablePart}, ověřuje pochopení proč.',
    },
    prompt:
      'Ve vzorovém řešení cvičení 5 je motor připojen k fázi <em>Operable Car</em> s meta-atributem <code>{immutablePart}</code>. Která tvrzení jsou správná?',
    diagram: {
      classes: [
        { id: 'car', name: 'Car', st: 'kind', x: 0.6, y: 0 },
        { id: 'inop', name: 'Inoperable Car', st: 'phase', x: 0, y: 1.25 },
        { id: 'op', name: 'Operable Car', st: 'phase', x: 1.2, y: 1.25 },
        { id: 'eng', name: 'Engine', st: 'kind', x: 3, y: 1.25 },
      ],
      gens: [{ general: 'car', specifics: ['inop', 'op'], set: { disjoint: true, complete: true } }],
      assocs: [{ from: 'eng', to: 'op', st: 'componentOf', whole: 'to', fromMult: '1', toMult: '1', meta: ['immutablePart'] }],
    },
    options: [
      '{essential} zde nelze použít, protože celek Operable Car je «phase» (anti-rigidní).',
      'Dokud je auto provozuschopné, má stále tentýž motor.',
      '{immutablePart} znamená, že motor nemůže existovat mimo toto auto.',
      '{immutablePart} je jen jiný název pro {essential}.',
      'Kdyby byl celkem rigidní «kind» Car, odpovídal by tomuto významu {essential}.',
    ],
    correct: [0, 1, 4],
    explanation:
      'Celek je fáze (anti-rigidní), takže místo {essential} použijeme {immutablePart}: pokud je instance v této fázi, má stále tutéž část. U rigidního celku by stejné tvrzení vyjadřoval {essential}. „Motor nemůže existovat mimo auto“ je význam {inseparable} (směr část → celek). Pojmy nejsou synonyma, liší se tím, pro jaký celek platí.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/c05-reseni.jpg', label: 'Cvičení 5: vzorové řešení (vozový park)' },
      { kind: 'slide', doc: 'C05', page: 6, quote: '{immutablePart} pokud je celek' },
      { kind: 'slide', doc: 'P04', page: 26 },
    ],
  },
  // ---------------------------------------------------------------- 5.7
  {
    id: 'ch05-14',
    kind: 'tf',
    topic: 'aspekty',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki), úloha 1', 'Zkouška (FIT Wiki), úloha 82'] },
    prompt: 'KVALITA je intrinsický aspekt.',
    answer: true,
    explanation:
      'Pravda. Aspekty se dělí na intrinsické («quality», «mode»: závisí na jediném nositeli) a relační («relator»). Kvalita je intrinsický aspekt se strukturovaným prostorem hodnot.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/mid22-01.png', label: 'Midterm 2022 (FIT Wiki), úloha 1' },
      { kind: 'image', src: '/sources/wiki/ex-82.png', label: 'Zkouška (FIT Wiki), úloha 82' },
      { kind: 'slide', doc: 'P04', page: 61 },
      { kind: 'slide', doc: 'P04', page: 62, quote: 'Intrinsické aspekty se strukturovaným prostorem hodnot' },
      { kind: 'image', src: '/sources/wiki/kom_midterm_2022.png', label: 'Midterm 2022 (FIT Wiki)' },
    ],
  },
  {
    id: 'ch05-15',
    kind: 'mc',
    topic: 'aspekty',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 62–66; Cvičení 5, slajd 11',
      why: 'Rozpoznání mode vs. quality (vs. relator) na příkladech.',
    },
    prompt: 'Které z následujících pojmů bychom typicky modelovali jako <span class="st">«mode»</span>?',
    options: [
      'konkrétní onemocnění (např. Johnova chřipka)',
      'dovednost (např. znalost Javy)',
      'verze knihy (Book Version s ISBN a jazykem)',
      'barva auta (RGB)',
      'hmotnost jablka',
      'manželství (Marriage)',
      'jméno osoby',
    ],
    correct: [0, 1, 2],
    explanation:
      'Módy jsou intrinsické aspekty <strong>bez</strong> strukturovaného prostoru hodnot: nemoc, dovednost, verze, stav, nálada. Barva a hmotnost jsou kvality (strukturovaný prostor hodnot), jméno je nominální kvalita. Manželství závisí na více osobách, je to «relator» (relační aspekt).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 64, quote: 'Módy jsou intrinsické aspekty bez strukturovaného prostoru hodnot, např. dovednost' },
      { kind: 'slide', doc: 'P04', page: 62 },
      { kind: 'slide', doc: 'C05', page: 11, quote: '«Mode» = neměřitelné (odbornost, zkušenosti, stavy, verze, symptomy, ...)' },
    ],
  },
  {
    id: 'ch05-16',
    kind: 'tf',
    topic: 'aspekty',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 64 a 66 vs. Cvičení 5, slajd 11',
      why: 'Cvičení zjednodušuje (měřitelné = quality), přednáška to výslovně opravuje.',
    },
    prompt:
      'Má-li aspekt měřitelnou vlastnost (např. bolest hlavy má intenzitu 1–10), jde vždy o <span class="st">«quality»</span>.',
    answer: false,
    explanation:
      'Nepravda. Rozhoduje <strong>strukturovaný prostor hodnot</strong> samotného aspektu, ne to, že má nějaký měřitelný atribut. Bolest hlavy je mód (konkrétní stav osoby s vlastními vlastnostmi). Přednáška: měřitelné vlastnosti módu z něj ještě nedělají kvalitu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 64, quote: 'Měřitelné vlastnosti módu z něj ještě nedělají Kvalitu.' },
      { kind: 'slide', doc: 'P04', page: 66 },
    ],
  },
  // ---------------------------------------------------------------- 5.8
  {
    id: 'ch05-17',
    kind: 'mc',
    topic: 'aspekty',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajdy 58–65 (aspekty a characterization)',
      why: 'Základní vlastnosti aspektů a «characterization».',
    },
    prompt: 'Která tvrzení o aspektech a vztahu <span class="st">«characterization»</span> jsou správná?',
    options: [
      'Na straně nositele má «characterization» multiplicitu právě 1.',
      'Aspekt je existenčně závislý na svém nositeli; zanikne-li nositel, zanikne i aspekt.',
      'Na straně módu může být multiplicita 1..* (např. Person – Person State).',
      'Jedna instance «quality» může charakterizovat více nositelů zároveň.',
      '«characterization» spojuje «relator» s rolemi, které propojuje.',
      'Nositelem aspektu může být i jiný aspekt (barva → odstín).',
    ],
    correct: [0, 1, 2, 5],
    explanation:
      'Characterization spojuje kvalitu či mód s <strong>právě jedním</strong> nositelem, takže jedna kvalita nemůže patřit více nositelům. Aspekt je existenčně závislý (inherence), zánik nositele = zánik aspektů. Nositel může mít více módů (stavy, verze, 1..*), nositelem může být i aspekt (nepřímé aspekty). Relátor se s rolemi spojuje přes «mediation», ne characterization.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 62, quote: 'spojuje Kvalitu či Mód s právě jedním nositelem' },
      { kind: 'slide', doc: 'P04', page: 59, quote: 'Existenční povaha inherence navíc vyžaduje, aby při zániku Objektu zanikly i všechny' },
      { kind: 'slide', doc: 'P04', page: 60, quote: 'Nositel Aspektu může být sám Aspektem:' },
      { kind: 'slide', doc: 'P04', page: 65 },
    ],
  },
  {
    id: 'ch05-18',
    kind: 'mc',
    topic: 'aspekty',
    origin: {
      type: 'original',
      inspiredBy: 'Přednáška 4, slajd 61 (Typy aspektů)',
      why: 'Mode i relator jsou aspekty, liší se počtem entit, na kterých závisí.',
    },
    prompt: 'Porovnání <span class="st">«mode»</span> a <span class="st">«relator»</span>. Která tvrzení platí?',
    options: [
      'Oba jsou aspekty, tedy existenčně závislé entity.',
      '«mode» je intrinsický aspekt, závisí na jediném nositeli.',
      '«relator» je relační aspekt, závisí na více entitách, které propojuje.',
      '«mode» se k nositeli připojuje přes «mediation».',
      '«relator» je anti-rigidní, protože relace může zaniknout.',
      '«mode» a «phase» jsou totéž, oba popisují stav objektu.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Quality, mode i relator jsou aspekty (existenčně závislé). Mode je intrinsický (jeden nositel, «characterization»), relator je relační (propojuje více entit přes «mediation»). Relator je rigidní sortál poskytující identitu. Phase je anti-rigidní podtyp kindu, ne aspekt: „stav“ je ontologicky nepřesný pojem.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P04', page: 61 },
      { kind: 'slide', doc: 'P04', page: 66, quote: 'Patří mezi ně «Relator», «Quality» a «Mode».' },
      { kind: 'slide', doc: 'P04', page: 65 },
    ],
  },
]
