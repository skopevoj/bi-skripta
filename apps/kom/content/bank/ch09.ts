import type { Question } from '../types'

const EXAM = 'Zkouška BI-KOM (FIT Wiki, kom_zkouška_zabarveno.png)'
const RDF_CONCEPTS = { kind: 'web', label: 'W3C: RDF 1.1 Concepts and Abstract Syntax', url: 'https://www.w3.org/TR/rdf11-concepts/' } as const
const TURTLE = { kind: 'web', label: 'W3C: RDF 1.1 Turtle', url: 'https://www.w3.org/TR/turtle/' } as const

export const ch09: Question[] = [
  // ---------------------------------------------------------------- 9.1
  {
    id: 'ch09-01',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 4`] },
    prompt: 'Vyberte pravdivá tvrzení o RDF.',
    options: [
      'Technologie RDF využívají jednoduchý formát popisu pomocí trojic podmět, přísudek, předmět.',
      'RDF je modelovací jazyk specifikovaný OMG pro popis entity a jejich vlastností.',
      'Technologie RDF využívají popis v přirozeném jazyce a syntaktickou analýzu větné struktury.',
      'RDF a obecně sémantický web pracuje s tzv. Open-World Assumptions (co není specifikováno nebo odvozeno může být pravda).',
      'RDF je systém pro popis zdrojů (původně pro tvorbu metadat) specifikovaný W3C.',
      'RDF a obecně sémantický web pracuje s tzv. Closed-World Assumptions (co není specifikováno nebo odvozeno je nepravda).',
    ],
    correct: [0, 3, 4],
    explanation:
      'RDF popisuje zdroje <strong>trojicemi</strong> subject–predicate–object (podmět–přísudek–předmět). Specifikuje ho <strong>W3C</strong> (ne OMG), původně jako model metadat. Sémantický web pracuje s <strong>otevřeným světem</strong>: nevyřčené tvrzení je neznámé, ne nepravdivé. S přirozeným jazykem a větným rozborem RDF nepracuje (c).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-04.png', label: 'Zkouška (FIT Wiki), úloha 4' },
      { kind: 'slide', doc: 'P08', page: 9 },
      { kind: 'slide', doc: 'P08', page: 15, quote: 'Specifikován W3C původně jako model metadat' },
      { kind: 'slide', doc: 'P08', page: 13, quote: 'Typické pro sémantický web (RDF, OWL, ...) ale i reálný svět' },
    ],
  },
  {
    id: 'ch09-02',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 9–10 (trojice a graf)',
      why: 'Ověřuje, že student umí v trojici najít subjekt, predikát a objekt a ví, co je v grafu uzel a co hrana.',
    },
    prompt: 'Vyberte pravdivá tvrzení o této trojici.',
    code: 'bi-kom-rdf:ema  bi-kom-rdf:hasName  "Ema" .',
    lang: 'turtle',
    options: [
      '<code>bi-kom-rdf:ema</code> je subjekt.',
      '<code>bi-kom-rdf:hasName</code> je v RDF grafu orientovaná hrana.',
      '<code>"Ema"</code> je literál a v grafu tvoří uzel.',
      '<code>bi-kom-rdf:hasName</code> je uzel grafu, který spojuje subjekt s literálem.',
      'Trojici lze bez změny významu zapsat obráceně: <code>"Ema" bi-kom-rdf:hasName bi-kom-rdf:ema .</code>',
    ],
    correct: [0, 1, 2],
    explanation:
      'Subjekt a objekt tvoří <strong>uzly</strong>, predikát <strong>orientovanou hranu</strong> od subjektu k objektu (d špatně). Objektem je tu literál. Prohození změní význam, navíc literál nesmí být subjektem (e).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P08', page: 10, quote: 'subject a object tvoří uzly' },
      { kind: 'slide', doc: 'P08', page: 10, quote: 'predicate tvoří orientované hrany mezi uzly' },
      RDF_CONCEPTS,
    ],
  },
  // ---------------------------------------------------------------- 9.2
  {
    id: 'ch09-03',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 97`] },
    prompt: 'Vyberte pravdivá tvrzení o RDF.',
    options: [
      'Každý zdroj v RDF je identifikován pomocí UUID (Universally Unique Identifier), pomocí kterého se na něj odkazuje.',
      'URI označuje identifikátor zdroje včetně cesty, může obsahovat jen omezenou sadu povolených znaků.',
      'Každý zdroj v RDF je identifikován pomocí URI (Universally Resource Identifier) případně IRI mimo tzv. prázdných uzlů (blank node), které nemají tento identifikátor přiřazen.',
      'URI označuje identifikátor zdroje včetně cesty, může obsahovat libovolné znaky UTF-8.',
      'URI označuje název zdroje ale nikoliv cestu k němu, může obsahovat libovolné znaky UTF-8.',
      'Každý zdroj v RDF je identifikován pomocí URI (Universally Resource Identifier) případně IRI, a to včetně dočasných a pomocných zdrojů.',
    ],
    correct: [1, 2],
    explanation:
      'Zdroje se identifikují <strong>URI / IRI</strong>, ne UUID (a). Výjimkou jsou <strong>prázdné uzly</strong> pro pomocné zdroje, ty IRI nemají (f špatně). URI spojuje URL a URN, tedy i cestu, a dovoluje jen omezenou sadu znaků (+ percent-encoding). Libovolné Unicode znaky povoluje až <strong>IRI</strong> (d). „Název bez cesty“ je URN (e).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-97.png', label: 'Zkouška (FIT Wiki), úloha 97' },
      { kind: 'slide', doc: 'P08', page: 16, quote: 'URI = spojení URL a URN pro přesnou specifikaci zdroje' },
      { kind: 'slide', doc: 'P08', page: 16, quote: 'IRI = rozšiřuje povolené znaky dle RFC3987 nad rámec URI' },
      { kind: 'slide', doc: 'P08', page: 17, quote: 'Někdy chceme dělat ale tvrzení o nějakém pomocném zdroji' },
    ],
  },
  {
    id: 'ch09-04',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 17, RDF 1.1 Concepts',
      why: 'Rozlišení IRI / literál / prázdný uzel a jejich pozic v trojici je základ čtení Turtle.',
    },
    prompt: 'Co smí v Turtle stát na pozici <strong>predikátu</strong>?',
    options: [
      'IRI v lomených závorkách, např. <code>&lt;http://xmlns.com/foaf/0.1/name&gt;</code>',
      'literál, např. <code>"name"</code>',
      'prázdný uzel, např. <code>_:p</code>',
      'jméno s prefixem, např. <code>foaf:name</code>',
      'klíčové slovo <code>a</code>',
    ],
    correct: [0, 3, 4],
    explanation:
      'Predikát je v RDF vždy <strong>IRI</strong>. <code>foaf:name</code> je jen zkrácený zápis IRI pomocí prefixu a <code>a</code> je v Turtle zkratka za <code>rdf:type</code>. Literály smí být jen objektem, prázdné uzly subjektem nebo objektem.',
    verified: 'slides',
    sources: [RDF_CONCEPTS, TURTLE, { kind: 'slide', doc: 'P08', page: 17, quote: 'V zápise RDF se často využívá prefixů pro následné zkracování URI' }],
  },
  // ---------------------------------------------------------------- 9.3
  {
    id: 'ch09-05',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 40`] },
    prompt: 'Vyberte pravdivá tvrzení o RDF.',
    options: [
      'Notation3, TRiG, Turtle a N-Triples jsou podobné textové formáty pro reprezentaci RDF, mají společný základ ale některé jsou rozšířením jiných.',
      'Specifikace RDF současně definuje XML formát a označuje jej jako jediný podporovaný ačkoliv je formátů více.',
      'RDF data lze reprezentovat pouze v grafické podobě jako grafy s orientovanými grafy, textová reprezentace není z povahy možná.',
      'RDF lze zapisovat textově pomocí různých definovaných formátů, některé jsou nezávislé, jiné jsou rozšířením/zjednodušením jiných.',
      'JSON-LD je rozšíření formátu Turtle, kde jsou zdroje popsány pomocí JSON-serializovaných objektů.',
      'RDF formát Turtle umožňuje zapisovat také čtveřice, tzv. quads.',
    ],
    correct: [0, 3],
    explanation:
      'RDF je nezávislé na syntaxi a má víc textových formátů: Turtle je podmnožina N3, TriG rozšiřuje Turtle o grafy, N-Triples je podmnožina Turtle. RDF/XML není „jediný podporovaný“ (b). JSON-LD je samostatný formát nad JSON, ne rozšíření Turtle (e). Čtveřice zapisuje <strong>TriG</strong> nebo <strong>N-Quads</strong>, ne Turtle (f).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-40.png', label: 'Zkouška (FIT Wiki), úloha 40' },
      { kind: 'slide', doc: 'P08', page: 18, quote: 'Tudíž je specifikace RDF nezávislá na syntaxi' },
      { kind: 'slide', doc: 'P08', page: 20, quote: 'Jeho zjednodušená podmnožina (pro běžné RDF) se nazývá Turtle' },
      { kind: 'slide', doc: 'P08', page: 21, quote: 'TriG je rozšířením Turtle pro reprezentaci datasetů / grafů' },
      { kind: 'slide', doc: 'P08', page: 22, quote: 'N-Triples je podmnožina Turtle pro snadné parsování' },
    ],
  },
  {
    id: 'ch09-06',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 20 (Turtle), W3C Turtle (predicate a object lists)',
      why: 'Čtení zkratek ; a , v Turtle se dá snadno ověřit spočítáním trojic.',
    },
    prompt: 'Kolik RDF trojic obsahuje tento zápis?',
    code:
      '@prefix ex: <http://example.com/> .\n\nex:ema a ex:Woman ;\n  ex:hasName "Ema" ;\n  ex:knows ex:marek , ex:petr .',
    lang: 'turtle',
    options: ['1', '2', '3', '4', '5'],
    correct: [3],
    explanation:
      '<code>@prefix</code> je direktiva, ne trojice. Pak: <code>ex:ema rdf:type ex:Woman</code>, <code>ex:ema ex:hasName "Ema"</code>, <code>ex:ema ex:knows ex:marek</code>, <code>ex:ema ex:knows ex:petr</code>. Středník opakuje subjekt, čárka subjekt i predikát. Celkem <strong>4</strong>.',
    verified: 'reasoning',
    sources: [TURTLE],
  },
  // ---------------------------------------------------------------- 9.4
  {
    id: 'ch09-07',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 81`] },
    prompt: 'Vyberte pravdivá tvrzení o RDFS.',
    options: [
      'RDFS (RDF Schema) je jednoduchý ontologický jazyk patřící do rodiny RDF.',
      'RDFS (RDF Schema) je rozšíření RDF o možnost tzv. čtveřic neboli quads pro identifikaci jednotlivých RDF grafů.',
      'OWL je podmnožinou RDFS, RDFS má tudíž větší výrazové schopnosti.',
      'Expresivita RDFS není dostatečná pro složitější případy, OWL poskytuje větší výrazové schopnosti.',
      'RDFS (RDF Schema) je specifikace pro zakreslování RDF dat do grafických schémat.',
      'RDFS je moc složitý na použití, a proto ho nahrazuje RDF.',
    ],
    correct: [0, 3],
    explanation:
      'RDFS je jednoduchý ontologický jazyk z rodiny RDF pro třídy a vlastnosti. Na multiplicitu, ekvivalenci nebo disjoint/complete nestačí, proto <strong>OWL</strong>, postavený na RDF a RDFS, je výrazově silnější (c je obráceně). Čtveřice řeší pojmenované grafy (TriG, N-Quads), ne RDFS (b). RDFS není kreslicí notace (e).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-81.png', label: 'Zkouška (FIT Wiki), úloha 81' },
      { kind: 'slide', doc: 'P08', page: 25, quote: 'RDFS je jednoduchý ontologický jazyk patřící do rodiny RDF' },
      { kind: 'slide', doc: 'P08', page: 30, quote: 'Jazyky OWL jsou postaveny na RDF a RDFS' },
    ],
  },
  {
    id: 'ch09-08',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 27–28 (rdfs:domain, rdfs:subClassOf), P08 str. 48',
      why: 'Typické nedorozumění: domain/range nejsou kontrola typů, ale pravidla pro odvozování.',
    },
    prompt: 'Co z těchto trojic <strong>odvodí</strong> RDFS reasoner?',
    code:
      'bi-kom-rdf:hasName  rdfs:domain      bi-kom-rdf:Person .\nbi-kom-rdf:Woman    rdfs:subClassOf  bi-kom-rdf:Person .\n\nbi-kom-rdf:rex  bi-kom-rdf:hasName  "Rex" .\nbi-kom-rdf:ema  a                   bi-kom-rdf:Woman .',
    lang: 'turtle',
    options: [
      '<code>bi-kom-rdf:rex a bi-kom-rdf:Person</code>',
      '<code>bi-kom-rdf:ema a bi-kom-rdf:Person</code>',
      'Chybu, protože <code>rex</code> není nikde deklarován jako Person.',
      'Že <code>ema</code> má nějaké jméno (<code>hasName</code>).',
      '<code>bi-kom-rdf:rex a bi-kom-rdf:Woman</code>',
    ],
    correct: [0, 1],
    explanation:
      '<code>rdfs:domain</code> říká, že každý subjekt vlastnosti <code>hasName</code> je Person, takže reasoner odvodí, že rex je Person. Žádnou chybu nehlásí (c). Z <code>subClassOf</code> plyne, že každá Woman je Person (b). RDFS neříká, co data <em>musí</em> obsahovat, tedy ani to, že ema má jméno (d). Že je rex Woman, nic neříká (e).',
    verified: 'slides',
    sources: [
      { kind: 'web', label: 'W3C: RDF Schema 1.1 (rdfs:domain)', url: 'https://www.w3.org/TR/rdf-schema/' },
      { kind: 'slide', doc: 'P08', page: 27 },
      { kind: 'slide', doc: 'P08', page: 48, quote: 'RDFS a OWL říkají, co lze odvodit, ne co data musí obsahovat' },
    ],
  },
  // ---------------------------------------------------------------- 9.5
  {
    id: 'ch09-09',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 52`] },
    prompt: 'Vyberte pravdivá tvrzení o OWL.',
    options: [
      'OWL DL je varianta/jazyk postavený na formalismech z deskriptivní logiky.',
      'OWL Full je varianta/jazyk OWL verze 2, který plně zaručuje rozhodnutelnost a úplnost.',
      'Web Ontology Language (OWL) je rodina jazyků pro reprezentaci znalostí v rámci ontologií, tedy jako specifikaci typů objektů a vztahů mezi nimi.',
      'Web Ontology Language (OWL) využívá UML modely pro popis RDF dat.',
      'OWL DL je varianta/jazyk OWL určená pro datovou vrstvu enterprise aplikací (Data Layer).',
      'OWL Full je nadmnožina OWL DL i OWL lite, která ale nezaručuje rozhodnutelnost a úplnost.',
    ],
    correct: [0, 2, 5],
    explanation:
      'OWL je rodina jazyků pro ontologie postavená na RDF/RDFS (ne na UML, d). <strong>DL</strong> = Description Logic, je rozhodnutelný. <strong>Full</strong> je nadmnožina DL i Lite, dovoluje meta-modelování, a proto rozhodnutelnost zaručena není (b špatně). OWL Full není „verze 2“: OWL 2 se dělí na profily EL, QL, RL. „Data Layer“ (e) je nesmysl.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-52.png', label: 'Zkouška (FIT Wiki), úloha 52' },
      { kind: 'slide', doc: 'P08', page: 30 },
      { kind: 'slide', doc: 'P08', page: 32, quote: 'Název se odkazuje na Description Logic, z něhož čerpá své formální základy' },
      { kind: 'slide', doc: 'P08', page: 33, quote: 'Každá platná OWL DL ontologie je také platnou OWL Full ontologií' },
      { kind: 'slide', doc: 'P08', page: 33, quote: 'Kvůli rozvolnění pravidel již není zajištěna rozhodnutelnost' },
    ],
  },
  {
    id: 'ch09-10',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'C09 str. 5–6 (Od OntoUML k OWL)',
      why: 'Převod OntoUML → OWL je náplní semestrální práce a přímo navazuje na OntoUML část zkoušky.',
    },
    prompt: 'Která přiřazení <em>konstrukt OntoUML → OWL</em> odpovídají korespondenci ze cvičení?',
    options: [
      'generalization set <code>{disjoint}</code> → <code>owl:disjointWith</code>',
      'generalization set <code>{complete}</code> → <code>owl:disjointUnionOf</code>',
      'atribut → <code>owl:DatatypeProperty</code>',
      'asociace → <code>owl:ObjectProperty</code> s <code>rdfs:domain</code> a <code>rdfs:range</code>',
      '<span class="st">«role»</span> → <code>owl:DatatypeProperty</code>',
      'multiplicita → <code>rdfs:label</code>',
      'role Driver a Customer téže Person → <code>ct:Driver owl:disjointWith ct:Customer</code>',
    ],
    correct: [0, 1, 2, 3],
    explanation:
      'Typy (kind, subkind, role, phase…) jsou <code>owl:Class</code> s <code>rdfs:subClassOf</code>, ne vlastnosti (e). Multiplicita se zapíše <code>owl:Restriction</code> s min/maxCardinality, <code>rdfs:label</code> je jen popisek (f). Role disjunktní nejsou: tentýž člověk může být řidič i zákazník (g).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C09', page: 5, quote: 'Přibližná korespondence (ne mechanické 1:1 mapování!):' },
      { kind: 'slide', doc: 'C09', page: 6, quote: 'Pozn.: «Role» disjunktní nejsou — tentýž člověk může být řidič i zákazník.' },
    ],
  },
  // ---------------------------------------------------------------- 9.6
  {
    id: 'ch09-11',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 10`] },
    prompt: 'Vyberte pravdivá tvrzení o SPARQL.',
    options: [
      'Syntaxe SPARQL je naprosto totožná s SQL, jen místo obecných tabulek z relačních DB se dělají dotazy nad trojicemi v RDF (což jsou také relační data - relace mezi subjektem a objektem).',
      'SPARQL je sémantický dotazovací jazyk pro data uchovaná ve formátu RDF.',
      'SPARQL umí mimo práce s klasickými RDF trojicemi pracovat i se čtveřicemi (tzv. quads) - pojmenovanými grafy.',
      'Syntaxe SPARQL je podobná syntaxi SQL, což usnadňuje její pochopení, ale jsou zde výrazné odlišnosti reflektující odlišnosti relačních dat a RDF dat.',
      'SPARQL je pouze dotazovací jazyk, neumí tudíž konstrukce CREATE ani UPDATE.',
      'SPARQL je rozšířením SQL o dotazy typu ASK, DESCRIBE a CONSTRUCT.',
    ],
    correct: [1, 2, 3],
    explanation:
      'SPARQL je sémantický dotazovací jazyk pro RDF. Syntaxí <em>připomíná</em> SQL, ale není s ním totožný (a) ani není jeho rozšířením (f). Umí i úpravy dat (<code>INSERT</code>, <code>DELETE</code>, <code>CREATE</code>, <code>DROP</code>…), a to včetně čtveřic / pojmenovaných grafů, takže e) neplatí.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-10.png', label: 'Zkouška (FIT Wiki), úloha 10' },
      { kind: 'slide', doc: 'P08', page: 41, quote: 'Sémantický dotazovací jazyk pro data uchovaná ve formátu RDF' },
      { kind: 'slide', doc: 'P08', page: 41, quote: 'Na první pohled podstatná podobnost s SQL' },
      { kind: 'slide', doc: 'P08', page: 46, quote: 'SPARQL umožňuje i úpravy dat a to včetně čtveřic (pojmenovaných grafů)' },
    ],
  },
  {
    id: 'ch09-12',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 41–45 (SELECT, CONSTRUCT, ASK, DESCRIBE)',
      why: 'Čtyři typy dotazů a to, co vracejí, jsou snadno testovatelná fakta.',
    },
    prompt: 'Vyberte pravdivá tvrzení o typech SPARQL dotazů.',
    options: [
      '<code>SELECT</code> vrací výsledek ve formě tabulky hodnot proměnných.',
      '<code>ASK</code> vrací pravdivostní hodnotu true nebo false.',
      '<code>CONSTRUCT</code> vrací výsledek jako RDF graf vytvořený podle šablony.',
      '<code>DESCRIBE</code> vrací true, pokud zdroj v datech existuje.',
      '<code>SELECT</code> vrací vždy RDF graf.',
      '<code>CONSTRUCT</code> trvale vloží vytvořené trojice do úložiště.',
    ],
    correct: [0, 1, 2],
    explanation:
      'SELECT = tabulka, CONSTRUCT = RDF podle šablony, ASK = true/false, DESCRIBE = RDF popis nalezených zdrojů (d). CONSTRUCT data jen vrací, nic neukládá. Ukládání dělá <code>INSERT</code> / <code>INSERT DATA</code> (f).',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P08', page: 41 }, { kind: 'slide', doc: 'P08', page: 46 }],
  },
  {
    id: 'ch09-16',
    kind: 'tf',
    topic: 'rdf',
    origin: { type: 'real', seen: ['Přednáška 8, Časté otázky'] },
    prompt: 'Když SPARQL dotaz nic nevrátí, znamená to, že taková věc neexistuje.',
    answer: false,
    explanation:
      'Nepravda. Dotaz jen v daném datasetu a při daném vyhodnocení nenašel shodu. Příčinou mohou být chybějící data, jiný pojmenovaný graf nebo neprovedené odvození (na cvičení <code>ct:partOfOrder</code> bez reasoneru). Závěr o neexistenci potřebuje předpoklad úplnosti dat, a ten v otevřeném světě nemáme.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P08', page: 63, quote: 'Znamená to, že dotaz v daném datasetu a při daném způsobu vyhodnocení nenašel shodu.' },
      { kind: 'slide', doc: 'C09', page: 13, quote: 'ct:partOfOrder v datech nenajdete: odvodí jej reasoner z owl:inverseOf , bez' },
    ],
  },
  // ---------------------------------------------------------------- 9.7
  {
    id: 'ch09-13',
    kind: 'tf',
    topic: 'rdf',
    origin: { type: 'real', seen: ['Přednáška 8, Časté otázky'] },
    prompt: 'OWL reasoner ohlásí chybu, když v datech u osoby chybí povinný údaj (např. jméno), který podle ontologie mít má.',
    answer: false,
    explanation:
      'Nepravda. OWL pracuje v <strong>otevřeném světě</strong>: chybějící tvrzení neznamená, že skutečnost neexistuje, hodnota může existovat, i když v datech uvedená není. Požadavek, aby údaj v grafu <em>byl</em>, se vyjádří <strong>SHACL</strong> pravidlem (např. <code>sh:minCount 1</code>).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P08', page: 62, quote: 'V otevřeném světě chybějící tvrzení samo o sobě neznamená, že daná skutečnost' },
      { kind: 'slide', doc: 'P08', page: 49 },
    ],
  },
  {
    id: 'ch09-14',
    kind: 'mc',
    topic: 'rdf',
    origin: { type: 'real', seen: [`${EXAM}, úloha 54`] },
    prompt: 'Vyberte pravdivá tvrzení o sémantickém webu a FAIR datech.',
    options: [
      'FAIR (meta)data, která jsou nalezitelná pomocí persistentního identifikátoru (Findable), přístupná (Accessible), interoperabilní (Interoperable) a znovu-použitelná (Re-usable).',
      'Podle modelu 5* otevřených dat, dostane 5* publikování výzkumných dat v souboru XLS, protože s ním lze snadno pracovat a rovnou v něm provádět výpočty.',
      'Podle modelu 5* otevřených dat, dostane 5* publikování výzkumných dat v souboru RDF jen pokud je prolinkován s jinými daty ve smyslu Linked Data (tzn. pro uvedení kontextu).',
      'Základem sémantického webu je použití XML, RDF a URI za účelem konceptualizace dat (např. pomocí mikroformátů).',
      'Podle modelu 5* otevřených dat, dostane 5* publikování výzkumných dat v souboru RDF bez ohledu na další parametry.',
      'FAIR (meta)data jsou dokončená/neměnná (Finished), přesná (Accurate), použitelná kdekoliv (International) a reálná (Real), tzn. nejedná se o podvodná data - lze ověřit jejich pravost.',
    ],
    correct: [0, 2, 3],
    explanation:
      'FAIR = Findable, Accessible, Interoperable, Re-usable (f je vymyšlený výklad). V 5★ schématu je XLS teprve ★★ (strukturovaná data), RDF / URI ★★★★ a pátou hvězdu dá až <strong>propojení s jinými daty</strong> (Linked Data), takže b) a e) neplatí. Sémantický web stojí na XML, RDF a URI a konceptualizuje data ontologiemi.',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-54.png', label: 'Zkouška (FIT Wiki), úloha 54' },
      { kind: 'slide', doc: 'P08', page: 55, quote: 'Sémantický web je postavený na XML, RDF a URI' },
      { kind: 'slide', doc: 'P08', page: 56 },
      { kind: 'slide', doc: 'P08', page: 57 },
    ],
  },
  {
    id: 'ch09-15',
    kind: 'mc',
    topic: 'rdf',
    origin: {
      type: 'original',
      inspiredBy: 'P08 str. 13–14 (OWA/CWA), 48–49 (SHACL vs. OWL), 52 (Totéž „2“ ve třech jazycích)',
      why: 'Rozdíl otevřeného a uzavřeného světa propojuje RDF/OWL s OCL a konceptuálními modely.',
    },
    prompt: 'Vyberte pravdivá tvrzení.',
    options: [
      'RDF a OWL pracují s předpokladem otevřeného světa (OWA).',
      'SHACL validuje data v uzavřeném světě daného grafu: chybějící povinná hodnota je porušení.',
      'Má-li osoba podle OWL nejvýše 2 předky a v datech má 3, reasoner může odvodit, že dva z nich jsou tentýž.',
      'SHACL je náhrada OWL, oba jazyky odpovídají na stejnou otázku.',
      'Databáze a konceptuální modely obvykle předpokládají uzavřený svět (co v nich není, neplatí).',
      'Při OWA je nevyřčené tvrzení nepravdivé.',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'OWL slouží k <strong>odvozování</strong> v otevřeném světě, takže „třetí předek“ není chyba (c). SHACL slouží k <strong>validaci</strong> v uzavřeném světě grafu. Nejsou to alternativy, používají se společně (d). Nevyřčené tvrzení je při OWA <em>neznámé</em>, nepravdivé je až při CWA (f).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P08', page: 13, quote: 'To, že jsme tvrzení Ema studuje ČVUT nevyřkli neznamená, že není pravdivé' },
      { kind: 'slide', doc: 'P08', page: 14, quote: 'Typické pro deklarativní programování, databáze, ... a příslušné (i konceptuální)' },
      { kind: 'slide', doc: 'P08', page: 49, quote: 'Nejsou to alternativy — odpovídají na jiné otázky a používají se společně' },
      { kind: 'slide', doc: 'P08', page: 52 },
    ],
  },
]
