import type { Chapter, Diagram } from '../types'

// OntoUML výřezy, které v kapitole převádíme do RDFS/OWL.

const genderModel: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0, attrs: ['hasName: String'], note: 'v RDFS: bi-kom-rdf:Person rdf:type rdfs:Class' },
    { id: 'woman', name: 'Woman', st: 'subkind', x: 0, y: 1.25, note: 'rdfs:subClassOf bi-kom-rdf:Person' },
    { id: 'man', name: 'Man', st: 'subkind', x: 2, y: 1.25, note: 'rdfs:subClassOf bi-kom-rdf:Person' },
  ],
  gens: [{ general: 'person', specifics: ['woman', 'man'], set: { disjoint: true, complete: true } }],
}

const taxiModel: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0, note: 'owl:Class' },
    { id: 'driver', name: 'Driver', st: 'role', x: 0.5, y: 1.25, note: 'owl:Class + rdfs:subClassOf ct:Person; role nejsou disjunktní' },
    { id: 'customer', name: 'Customer', st: 'role', x: 1.5, y: 1.25, note: 'owl:Class + rdfs:subClassOf ct:Person' },
    { id: 'ride', name: 'TaxiRide', st: 'relator', x: 0.5, y: 2.65, note: 'owl:Class; mediation → ObjectProperty ct:drivenBy' },
    { id: 'vehicle', name: 'Vehicle', st: 'kind', x: 3, y: 0, note: 'owl:Class' },
    { id: 'car', name: 'PersonalCar', st: 'subkind', x: 2.5, y: 1.25, mark: 'focus', note: 'owl:disjointWith ct:Van' },
    { id: 'van', name: 'Van', st: 'subkind', x: 3.5, y: 1.25, mark: 'focus' },
  ],
  gens: [
    { general: 'person', specifics: ['driver', 'customer'] },
    { general: 'vehicle', specifics: ['car', 'van'], set: { disjoint: true, complete: true } },
  ],
  assocs: [
    { from: 'ride', to: 'driver', st: 'mediation', name: 'drivenBy', fromMult: '1..*', toMult: '1', mark: 'focus' },
    { from: 'ride', to: 'customer', st: 'mediation', fromMult: '1..*', toMult: '1..*', route: 'hv' },
  ],
}

export const chap09: Chapter = {
  id: 'chap-9',
  number: '9',
  title: 'RDF, RDFS, OWL a SPARQL',
  docs: ['P08', 'C09'],
  exam: ['zkouska'],
  summary:
    'Rozumět RDF trojicím a jejich zápisu v Turtle (IRI, literály, prázdné uzly), vědět, co přidává RDFS a OWL a jak se do nich převádí OntoUML, přečíst jednoduchý SPARQL dotaz a znát rozdíl mezi otevřeným a uzavřeným světem (OWL vs. SHACL / OCL).',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-1',
      number: '9.1',
      title: 'Trojice a graf',
      blocks: [
        {
          kind: 'p',
          html:
            'Studijní systém, knihovna i personální systém mají každý vlastní databázi a vlastní identifikátor pro tutéž osobu. Problém není nedostatek dat, ale chybějící <strong>sdílený a explicitně vyjádřený význam</strong>. RDF to řeší jednotným zápisem tvrzení a globálními identifikátory.',
          sources: [{ kind: 'slide', doc: 'P08', page: 3, quote: 'Nechybí nám data, ale sdílený a explicitně vyjádřený význam dat' }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Trojice (triple)',
          html:
            'Nejjednodušší univerzální tvrzení: <strong>subject – predicate – object</strong> (podmět – přísudek – předmět). <em>Ema mele maso.</em>',
          sources: [{ kind: 'slide', doc: 'P08', page: 9, quote: 'Nejjednodušší a nejuniverzálnější forma tvrzení = trojice / triple:' }],
        },
        {
          kind: 'table',
          head: ['', 'subject', 'predicate', 'object'],
          rows: [
            ['česky', 'podmět', 'přísudek', 'předmět'],
            ['příklad', 'Ema', 'mele', 'maso'],
            ['v grafu', '<strong>uzel</strong>', '<strong>orientovaná hrana</strong> (subject → object)', '<strong>uzel</strong>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 9 },
            { kind: 'slide', doc: 'P08', page: 10, quote: 'predicate tvoří orientované hrany mezi uzly' },
          ],
        },
        {
          kind: 'p',
          html:
            'Trojice se propojují přes společné uzly (<em>Ema mele maso</em>, <em>Ema je žena</em>), takže se můžeme ptát „existuje žena, která mele maso?“. Spojit dva RDF grafy znamená jen <strong>sjednotit jejich trojice</strong>, bez mapování schémat.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 11 },
            { kind: 'slide', doc: 'P08', page: 7, quote: 'Integrace slučováním = spojení dvou RDF grafů je sjednocení tripletů, bez mapování' },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Kontext: pojmenované grafy a quads',
          html:
            'Když potřebuješ říct, <em>k čemu</em> se tvrzení vztahují (odkud jsou, ke kterému příkladu patří), vložíš je do <strong>pojmenovaného grafu</strong> (named graph). Pak už nemluvíme o trojicích, ale o <strong>čtveřicích (quads)</strong>: čtvrtý prvek je identifikátor grafu. O grafu jako celku lze dělat další tvrzení.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 12, quote: 'K tomuto účelu slouží pojmenovaný graf (named graph)' },
            { kind: 'slide', doc: 'P08', page: 12, quote: 'Poté se nebavíme o trojicích, ale o čtveřicích (quads)' },
          ],
        },
        { kind: 'quiz', ids: ['ch09-01', 'ch09-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-2',
      number: '9.2',
      title: 'IRI, prefixy, literály a prázdné uzly',
      blocks: [
        {
          kind: 'p',
          html:
            'RDF popisuje <strong>zdroje</strong> (resources). Zdroj je cokoliv, co má jednoznačný identifikátor URI, např. <code>http://example.com/bi-kom/rdf/example#ema</code> nebo ORCID <code>https://orcid.org/0000-0001-7525-9218</code>. Na adrese nemusí nic ležet, ale je to vhodné.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 15, quote: 'Zdroj = cokoliv unikátně identifikováno pomocí URI' },
            { kind: 'slide', doc: 'P08', page: 15, quote: 'Specifikován W3C původně jako model metadat' },
          ],
        },
        {
          kind: 'table',
          caption: 'URL, URN, URI, IRI',
          head: ['Zkratka', 'Co určuje', 'Příklad'],
          rows: [
            ['<strong>URL</strong>', '<em>umístění</em> zdroje (kde ho najdu)', '<code>http://example.com/bi-kom/rdf/example</code>'],
            ['<strong>URN</strong>', 'samotný zdroj (název), ale <em>ne cestu</em> k němu', '<code>example.com/bi-kom/rdf/example#ema</code>'],
            ['<strong>URI</strong>', 'spojení URL a URN: přesná identifikace zdroje; jen omezená sada znaků (+ percent-encoding)', '<code>http://example.com/bi-kom/rdf/example#ema</code>'],
            ['<strong>IRI</strong>', 'URI s rozšířenou sadou znaků (Unicode, RFC 3987)', '<code>https://en.wiktionary.org/wiki/Ῥόδος</code>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 16, quote: 'URN = specifikuje samotný zdroj ale ne cestu k jeho dosažení' },
            { kind: 'slide', doc: 'P08', page: 16, quote: 'IRI = rozšiřuje povolené znaky dle RFC3987 nad rámec URI' },
          ],
        },
        {
          kind: 'table',
          caption: 'Tři druhy uzlů v RDF',
          head: ['Druh', 'Zápis v Turtle', 'Kde smí být', 'Poznámka'],
          rows: [
            ['<strong>IRI</strong>', '<code>&lt;http://…#ema&gt;</code> nebo s prefixem <code>bi-kom-rdf:ema</code>', 'subject, predicate, object', 'globálně jednoznačné jméno'],
            ['<strong>literál</strong>', '<code>"Ema"</code>, <code>"300"^^xsd:integer</code>, <code>"Osoba"@cs</code>', 'jen object', 'hodnota s datovým typem nebo jazykem'],
            ['<strong>prázdný uzel</strong> (blank node)', '<code>_:maso</code> nebo <code>[ … ]</code>', 'subject, object', 'pomocný zdroj <em>bez</em> IRI, platí jen v rámci dokumentu'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 17 },
            { kind: 'web', label: 'W3C: RDF 1.1 Concepts and Abstract Syntax', url: 'https://www.w3.org/TR/rdf11-concepts/' },
          ],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'Ema mele 300 g hovězího: maso nemá vlastní IRI, proto prázdný uzel _:maso',
          code:
            '@prefix bi-kom-rdf: <http://example.com/bi-kom/rdf/example#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n\nbi-kom-rdf:ema  bi-kom-rdf:mele    _:maso .\n_:maso          bi-kom-rdf:jeMaso  <http://ontology.com/meats#Beef> .\n_:maso          bi-kom-rdf:vaziGramu "300"^^xsd:integer .\nbi-kom-rdf:ema  bi-kom-rdf:maJmeno "Ema" .',
          sources: [
            { kind: 'slide', doc: 'P08', page: 17, quote: 'Někdy chceme dělat ale tvrzení o nějakém pomocném zdroji' },
            { kind: 'slide', doc: 'P08', page: 17, quote: 'V zápise RDF se často využívá prefixů pro následné zkracování URI' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Ne každý zdroj má IRI',
          html:
            'Tvrzení „každý zdroj v RDF je identifikován URI“ je na testu past: <strong>prázdné uzly</strong> žádné IRI nemají. Literál nemůže být subjektem a predikát je vždy IRI.',
          sources: [{ kind: 'web', label: 'W3C: RDF 1.1 Concepts and Abstract Syntax', url: 'https://www.w3.org/TR/rdf11-concepts/' }],
        },
        { kind: 'quiz', ids: ['ch09-03', 'ch09-04'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-3',
      number: '9.3',
      title: 'Turtle a další formáty',
      blocks: [
        {
          kind: 'p',
          html:
            'RDF je abstraktní model (trojice), specifikace je <strong>nezávislá na syntaxi</strong>. Kvůli výměně dat mezi nástroji existuje víc formátů. Nejčitelnější a na cvičení psaný ručně je <strong>Turtle</strong>, zjednodušená podmnožina Notation3.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 18, quote: 'Tudíž je specifikace RDF nezávislá na syntaxi' },
            { kind: 'slide', doc: 'P08', page: 20, quote: 'Jeho zjednodušená podmnožina (pro běžné RDF) se nazývá Turtle' },
          ],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'Stejný příklad v Turtle: [ … ] je prázdný uzel, ; opakuje subjekt',
          code:
            '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix bi-kom-rdf: <http://example.com/bi-kom/rdf/example#> .\n@prefix measure: <http://ontol.com/measures#> .\n\nbi-kom-rdf:ema\n  bi-kom-rdf:isMincing [\n    bi-kom-rdf:isMeat <http://ontology.com/meats#Beef> ;\n    measure:weight "300"^^xsd:int\n  ] ;\n  bi-kom-rdf:hasName "Ema" .',
          sources: [{ kind: 'slide', doc: 'P08', page: 20 }],
        },
        {
          kind: 'table',
          caption: 'Turtle v kostce',
          head: ['Zápis', 'Význam'],
          rows: [
            ['<code>@prefix ex: &lt;http://…#&gt; .</code>', 'zkratka: <code>ex:ema</code> = <code>&lt;http://…#ema&gt;</code>'],
            ['<code>s p o .</code>', 'jedna trojice, končí tečkou'],
            ['<code>s p1 o1 ; p2 o2 .</code>', '<code>;</code> = stejný <em>subjekt</em>, další predikát'],
            ['<code>s p o1 , o2 .</code>', '<code>,</code> = stejný subjekt i predikát, další objekt'],
            ['<code>s a ex:Person .</code>', '<code>a</code> = zkratka za <code>rdf:type</code>'],
            ['<code>[ p o ]</code>', 'prázdný uzel s vlastnostmi'],
            ['<code>"Osoba"@cs</code>, <code>"300"^^xsd:int</code>', 'literál s jazykem / s datovým typem'],
            ['<code># …</code>', 'komentář'],
          ],
          sources: [{ kind: 'web', label: 'W3C: RDF 1.1 Turtle', url: 'https://www.w3.org/TR/turtle/' }],
        },
        {
          kind: 'interactive',
          component: 'rdf-graph',
          title: 'Turtle ↔ graf',
          hint: 'Uprav Turtle a sleduj, jak se mění graf: subjekty a objekty jsou uzly, predikáty hrany. Kolik trojic vznikne z jednoho řádku se středníkem?',
        },
        {
          kind: 'table',
          caption: 'Formáty RDF',
          head: ['Formát', 'Charakteristika'],
          rows: [
            ['<strong>RDF/XML</strong>', 'XML zápis (<code>rdf:Description</code>, <code>rdf:about</code>); jeden z formátů, ne jediný'],
            ['<strong>Notation3 (N3)</strong>', 'čitelná syntaxe s rozšířeními nad rámec RDF'],
            ['<strong>Turtle</strong>', 'zjednodušená podmnožina N3 pro běžné RDF; jen trojice'],
            ['<strong>TriG</strong>', 'rozšíření Turtle o datasety / pojmenované grafy'],
            ['<strong>N-Triples</strong>', 'podmnožina Turtle: jedna trojice na řádek, celá IRI, bez prefixů, snadné parsování'],
            ['<strong>N-Quads</strong>', 'jako N-Triples, ale čtveřice (4. prvek = graf)'],
            ['<strong>JSON-LD</strong>', 'JSON pro linked data (<code>@context</code>, <code>@id</code>, <code>@type</code>); používá ho např. Schema.org'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 19 },
            { kind: 'slide', doc: 'P08', page: 21, quote: 'TriG je rozšířením Turtle pro reprezentaci datasetů / grafů' },
            { kind: 'slide', doc: 'P08', page: 22, quote: 'N-Triples je podmnožina Turtle pro snadné parsování' },
            { kind: 'slide', doc: 'P08', page: 23, quote: 'Místo trojic jsou zde čtveřice, kde čtvrtý prvek je identifikátor grafu' },
            { kind: 'slide', doc: 'P08', page: 24, quote: 'JSON for Linking Data využívá JSON pro reprezentaci linked data' },
          ],
        },
        {
          kind: 'code',
          lang: 'text',
          caption: 'Totéž v N-Triples: žádné prefixy, žádné ; ani [ ]',
          code:
            '<http://example.com/bi-kom/rdf/example#ema> <http://example.com/bi-kom/rdf/example#isMincing> _:a .\n_:a <http://example.com/bi-kom/rdf/example#isMeat> <http://ontology.com/meats#Beef> .\n_:a <http://ontol.com/measures#weight> "300"^^<http://www.w3.org/2001/XMLSchema#int> .\n<http://example.com/bi-kom/rdf/example#ema> <http://example.com/bi-kom/rdf/example#hasName> "Ema" .',
          sources: [{ kind: 'slide', doc: 'P08', page: 22 }],
        },
        { kind: 'quiz', ids: ['ch09-05', 'ch09-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-4',
      number: '9.4',
      title: 'RDFS: třídy a vlastnosti',
      blocks: [
        {
          kind: 'p',
          html:
            'Samotné RDF dává naprostou volnost, jak trojice skládat. <strong>RDFS</strong> (RDF Schema) je jednoduchý ontologický jazyk z rodiny RDF: přidává slovník pro <strong>třídy</strong> a <strong>vlastnosti</strong> a vztahy mezi nimi.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 25, quote: 'RDFS je jednoduchý ontologický jazyk patřící do rodiny RDF' },
            { kind: 'slide', doc: 'P08', page: 25, quote: 'Umožňuje definovat a rozlišovat typy zdrojů (třídy) a jejich vlastnosti' },
          ],
        },
        {
          kind: 'table',
          caption: 'Slovník RDFS (prefix rdfs: = http://www.w3.org/2000/01/rdf-schema#)',
          head: ['Pojem', 'Význam'],
          rows: [
            ['<code>rdfs:Resource</code>', 'všechny zdroje (implicitně je členem každý)'],
            ['<code>rdfs:Class</code>', 'zdroje, které jsou samy třídami'],
            ['<code>rdfs:Literal</code>, <code>rdfs:Datatype</code>', 'literály, datové typy'],
            ['<code>rdf:Property</code>', 'vlastnosti (predikáty)'],
            ['<code>rdf:type</code>', 'subjekt je instancí třídy (v Turtle <code>a</code>)'],
            ['<code>rdfs:subClassOf</code>', 'podtřída → nadtřída'],
            ['<code>rdfs:subPropertyOf</code>', 'podvlastnost → nadvlastnost'],
            ['<code>rdfs:domain</code>', 'třída <strong>subjektu</strong> vlastnosti'],
            ['<code>rdfs:range</code>', 'třída (typ) <strong>objektu</strong> vlastnosti'],
            ['<code>rdfs:label</code>, <code>rdfs:comment</code>', 'popis pro lidi (lokalizovatelný), podrobnější popis'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 26 },
            { kind: 'slide', doc: 'P08', page: 27 },
          ],
        },
        {
          kind: 'diagram',
          title: 'OntoUML, které zapíšeme v RDFS',
          diagram: genderModel,
          caption: 'RDFS zvládne třídy, hierarchii a vlastnost s domain/range. Generalization set {disjoint, complete} už ne, na to je OWL.',
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'RDFS příklad ze slidů (na slidu je u hasName „rdfs:Property“, správně je rdf:Property)',
          code:
            '@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix bi-kom-rdf: <http://example.com/bi-kom/rdf/example#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n\nbi-kom-rdf:Person rdf:type rdfs:Class .\nbi-kom-rdf:Person rdfs:label "Person"@en .\nbi-kom-rdf:Person rdfs:label "Osoba"@cs .\n\nbi-kom-rdf:Woman rdf:type rdfs:Class .\nbi-kom-rdf:Woman rdfs:subClassOf bi-kom-rdf:Person .\n\nbi-kom-rdf:Man rdf:type rdfs:Class .\nbi-kom-rdf:Man rdfs:subClassOf bi-kom-rdf:Person .\n\nbi-kom-rdf:hasName rdf:type rdf:Property .\nbi-kom-rdf:hasName rdfs:domain bi-kom-rdf:Person .\nbi-kom-rdf:hasName rdfs:range xsd:string .',
          sources: [{ kind: 'slide', doc: 'P08', page: 28 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'domain a range odvozují, nekontrolují',
          html:
            'Když napíšeš <code>:rex bi-kom-rdf:hasName "Rex"</code> a <code>:rex</code> není nikde označený jako Person, RDFS to <strong>nehlásí jako chybu</strong>. Reasoner naopak <strong>odvodí</strong>, že <code>:rex</code> je Person. A <code>rdfs:range xsd:string</code> neznamená, že každá osoba jméno <em>má</em>.',
          sources: [
            { kind: 'web', label: 'W3C: RDF Schema 1.1 (rdfs:domain)', url: 'https://www.w3.org/TR/rdf-schema/' },
            { kind: 'slide', doc: 'P08', page: 48, quote: 'RDFS a OWL říkají, co lze odvodit, ne co data musí obsahovat' },
          ],
        },
        {
          kind: 'p',
          html: 'Hotové RDFS slovníky, které se běžně znovupoužívají: <strong>Dublin Core</strong> (metadata dokumentů), <strong>FOAF</strong> (lidé a vztahy), <strong>vCard</strong> (osoby a organizace).',
          sources: [{ kind: 'slide', doc: 'P08', page: 29 }],
        },
        { kind: 'quiz', ids: ['ch09-07', 'ch09-08'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-5',
      number: '9.5',
      title: 'OWL a cesta z OntoUML',
      blocks: [
        {
          kind: 'p',
          html:
            'RDFS nestačí na multiplicitu, povinnost vztahu, ekvivalenci tříd nebo complete/disjoint. <strong>OWL</strong> (Web Ontology Language) je rodina jazyků pro reprezentaci znalostí v ontologiích, postavená <strong>na RDF a RDFS</strong>. Dnes se tím obvykle myslí OWL 2 (2009).',
          sources: [
            { kind: 'slide', doc: 'P08', page: 30, quote: '...multiplicita, povinnost vztahu, ekvivalence tříd, complete/disjoint atd.' },
            { kind: 'slide', doc: 'P08', page: 30, quote: 'Jazyky OWL jsou postaveny na RDF a RDFS' },
          ],
        },
        {
          kind: 'table',
          caption: 'Varianty OWL (Lite ⊂ DL ⊂ Full)',
          head: ['Varianta', 'Co je zač', 'Rozhodnutelnost'],
          rows: [
            ['<strong>OWL Lite</strong>', 'třídní hierarchie a základní omezení (kardinalita jen 0/1); prakticky se nepoužívá', 'ano'],
            ['<strong>OWL DL</strong>', 'založený na <strong>deskripční logice</strong>; všechny konstrukty, ale s omezeními (např. bez meta-modelování)', '<strong>ano</strong> (úplnost a rozhodnutelnost)'],
            ['<strong>OWL Full</strong>', 'nadmnožina DL, kompatibilní s RDFS; dovoluje meta-modelování (třída může být instancí)', '<strong>není zaručena</strong>'],
            ['OWL 2 profily <strong>EL, QL, RL</strong>', 'podmnožiny OWL 2 DL pro konkrétní použití (např. SNOMED CT je v OWL 2 EL)', 'ano'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 31, quote: 'OWL Lite se prakticky nevyužívá, resp. jen jako subset OWL DL' },
            { kind: 'slide', doc: 'P08', page: 32, quote: 'Název se odkazuje na Description Logic, z něhož čerpá své formální základy' },
            { kind: 'slide', doc: 'P08', page: 33, quote: 'Kvůli rozvolnění pravidel již není zajištěna rozhodnutelnost' },
            { kind: 'slide', doc: 'P08', page: 34 },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>vlastnosti</strong>: <code>owl:ObjectProperty</code> (mezi zdroji) vs. <code>owl:DatatypeProperty</code> (na literál)',
            '<strong>charakteristiky vlastností</strong>: Functional, Irreflexive, Symmetric / Asymmetric, Transitive',
            '<strong>kardinalita</strong>: <code>owl:minCardinality</code>, <code>owl:maxCardinality</code> (přes <code>owl:Restriction</code>)',
            '<strong>mezi vlastnostmi</strong>: <code>owl:inverseOf</code> (drives ↔ hasDriver), <code>subPropertyOf</code>, <code>equivalentProperty</code>',
            '<strong>mezi třídami</strong>: <code>subClassOf</code>, <code>owl:equivalentClass</code>, <code>owl:disjointWith</code>, <code>unionOf</code>, <code>intersectionOf</code>, <code>owl:disjointUnionOf</code>',
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 35, quote: 'Rozlišuje ObjectProperty a DatatypeProperty' },
            { kind: 'slide', doc: 'P08', page: 36 },
          ],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'OWL: ontologie, disjunktní a úplné rozdělení, tranzitivní vlastnost',
          code:
            '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix : <http://example.com/bi-kom/rdf/example#> .\n\n<http://example.com/bi-kom/rdf/example> a owl:Ontology .\n\n:Person a owl:Class ; rdfs:label "Person"@en , "Osoba"@cs .\n:Woman a owl:Class ; rdfs:subClassOf :Person .\n:Man a owl:Class ; rdfs:subClassOf :Person ; owl:disjointWith :Woman .\n:Person owl:equivalentClass [ owl:disjointUnionOf ( :Woman :Man ) ] .\n\n:hasName a owl:DatatypeProperty ; rdfs:domain :Person ; rdfs:range xsd:string .\n\n:ancestor a owl:ObjectProperty , owl:TransitiveProperty ;\n  rdfs:domain :Person ; rdfs:range :Person ;\n  owl:inverseOf :descendant .',
          sources: [
            { kind: 'slide', doc: 'P08', page: 37 },
            { kind: 'slide', doc: 'P08', page: 38 },
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>Od OntoUML k OWL.</strong> Na cvičení převádíš aspoň 10 tříd svého OntoUML modelu. Korespondence je <em>přibližná</em>, ne mechanické 1:1 mapování:',
          sources: [{ kind: 'slide', doc: 'C09', page: 5, quote: 'Přibližná korespondence (ne mechanické 1:1 mapování!):' }],
        },
        {
          kind: 'table',
          head: ['OntoUML', 'OWL'],
          rows: [
            ['<span class="st">«kind»</span>, <span class="st">«subkind»</span>, <span class="st">«role»</span>, <span class="st">«phase»</span>…', '<code>owl:Class</code> + <code>rdfs:subClassOf</code>'],
            ['generalization set <code>{disjoint}</code>', '<code>owl:disjointWith</code>'],
            ['generalization set <code>{complete}</code>', '<code>owl:disjointUnionOf</code>'],
            ['asociace', '<code>owl:ObjectProperty</code> s <code>rdfs:domain</code> a <code>rdfs:range</code>'],
            ['atribut', '<code>owl:DatatypeProperty</code>'],
            ['multiplicita', '<code>owl:Restriction</code> s min / maxCardinality'],
          ],
          sources: [{ kind: 'slide', doc: 'C09', page: 5 }],
        },
        { kind: 'diagram', title: 'Výřez Costy Taxi pro převod do OWL', diagram: taxiModel },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'Tentýž výřez v OWL (cvičení 9)',
          code:
            '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix ct: <https://kom.fit.cvut.cz/costy-taxi#> .\n\n<https://kom.fit.cvut.cz/costy-taxi> a owl:Ontology ;\n    rdfs:label "Ontologie taxislužby"@cs ;\n    owl:versionInfo "1.0.0" .\n\nct:Person a owl:Class ; rdfs:label "Person"@en , "Osoba"@cs .\nct:Driver a owl:Class ; rdfs:subClassOf ct:Person ; rdfs:label "Řidič"@cs .\nct:Customer a owl:Class ; rdfs:subClassOf ct:Person ; rdfs:label "Zákazník"@cs .\n\nct:PersonalCar owl:disjointWith ct:Van .   # kindy, ne role\n\nct:drivenBy a owl:ObjectProperty , owl:FunctionalProperty ;\n    rdfs:domain ct:TaxiRide ; rdfs:range ct:Driver .',
          sources: [{ kind: 'slide', doc: 'C09', page: 6 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Role nejsou disjunktní',
          html:
            '<code>owl:disjointWith</code> dáváš jen tam, kde to platí i v OntoUML (PersonalCar vs. Van). Role Driver a Customer disjunktní <strong>nejsou</strong>: tentýž člověk může být řidič i zákazník. <code>owl:FunctionalProperty</code> u <code>drivenBy</code> odpovídá multiplicitě 1 na straně řidiče.',
          sources: [{ kind: 'slide', doc: 'C09', page: 6, quote: 'Pozn.: «Role» disjunktní nejsou — tentýž člověk může být řidič i zákazník.' }],
        },
        {
          kind: 'p',
          html:
            '<strong>gUFO</strong> je OWL 2 DL reprezentace ontologie UFO. Použiješ ji jako slovník: tvoje třída je <code>rdfs:subClassOf gufo:Object</code> a zároveň instancí meta-třídy <code>gufo:Kind</code>. Zapisuješ sémanticky totéž co v OntoUML, jen jiným jazykem.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 39, quote: 'Pro ontologii UFO existuje gUFO (OWL 2 DL reprezentace)' },
            { kind: 'slide', doc: 'P08', page: 40, quote: 'Zapisujeme sémanticky to samé, co v OntoUML, ale jiným jazykem.' },
            { kind: 'web', label: 'gUFO: A Lightweight Implementation of UFO', url: 'https://nemo-ufes.github.io/gufo/' },
          ],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: '«kind» Person v gUFO',
          code:
            '@prefix owl: <http://www.w3.org/2002/07/owl#> .\n@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix gufo: <http://purl.org/nemo/gufo#> .\n@prefix : <http://purl.org/nemo/example#> .\n\n:Person a owl:Class ;\n    rdfs:subClassOf gufo:Object ;\n    rdf:type gufo:Kind .\n\n:olderThan a owl:ObjectProperty ;\n    rdfs:subPropertyOf gufo:ComparativeRelationshipType ;\n    rdfs:domain :Person ;\n    rdfs:range :Person .',
          sources: [{ kind: 'slide', doc: 'P08', page: 40 }],
        },
        { kind: 'quiz', ids: ['ch09-09', 'ch09-10'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-6',
      number: '9.6',
      title: 'SPARQL',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>SPARQL</strong> je sémantický dotazovací jazyk pro data v RDF. Na první pohled připomíná SQL, ale místo tabulek píšeš <strong>vzory trojic</strong> s proměnnými (<code>?name</code>) a databáze hledá shodu v subject, predicate a object.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 41, quote: 'Sémantický dotazovací jazyk pro data uchovaná ve formátu RDF' },
            { kind: 'slide', doc: 'P08', page: 41, quote: 'Dotazování funguje na základě shody v subject, predicate a object' },
          ],
        },
        {
          kind: 'table',
          caption: 'Čtyři typy dotazů',
          head: ['Dotaz', 'Vrací', 'Příklad otázky'],
          rows: [
            ['<code>SELECT</code>', '<strong>tabulku</strong> hodnot proměnných', 'jména a váhy masa'],
            ['<code>CONSTRUCT</code>', 'nový <strong>RDF graf</strong> podle šablony', 'přepiš jména do FOAF'],
            ['<code>ASK</code>', '<strong>true / false</strong>', 'existuje žena, která mele maso?'],
            ['<code>DESCRIBE</code>', '<strong>RDF popis</strong> nalezených zdrojů', 'popiš osobu jménem Ema'],
          ],
          sources: [{ kind: 'slide', doc: 'P08', page: 41 }],
        },
        {
          kind: 'code',
          lang: 'sparql',
          caption: 'SELECT: kdo mele víc než 100 g masa',
          code:
            'PREFIX bi-kom-rdf: <http://example.com/bi-kom/rdf/example#>\nPREFIX measure: <http://onto.com/measures#>\n\nSELECT ?name ?weight\nWHERE {\n   ?person a bi-kom-rdf:Person ;\n           bi-kom-rdf:isMincing ?meat ;\n           bi-kom-rdf:hasName ?name .\n   ?meat measure:weight ?weight .\n   FILTER (?weight > 100)\n}\nORDER BY DESC(?weight)\nLIMIT 10',
          sources: [{ kind: 'slide', doc: 'P08', page: 42 }],
        },
        {
          kind: 'code',
          lang: 'sparql',
          caption: 'ASK a CONSTRUCT',
          code:
            'PREFIX bi-kom-rdf: <http://example.com/bi-kom/rdf/example#>\nPREFIX foaf: <http://xmlns.com/foaf/spec/>\n\n# Existuje žena, která mele maso?\nASK {\n   ?woman a bi-kom-rdf:Woman ;\n          bi-kom-rdf:isMincing ?meat .\n   ?meat a bi-kom-rdf:Meat .\n}\n\n# Vytvoř FOAF trojice se jménem, ale jen pro muže\nCONSTRUCT { ?man foaf:name ?name }\nWHERE {\n  ?man a bi-kom-rdf:Man ;\n       bi-kom-rdf:hasName ?name .\n}',
          sources: [
            { kind: 'slide', doc: 'P08', page: 43 },
            { kind: 'slide', doc: 'P08', page: 44 },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Úpravy dat</strong> (i v pojmenovaných grafech): <code>INSERT DATA</code>, <code>DELETE DATA</code>, <code>DELETE</code>, <code>INSERT</code>, <code>LOAD</code>, <code>CLEAR</code>; práce s grafem: <code>CREATE</code>, <code>DROP</code>, <code>COPY</code>, <code>MOVE</code>, <code>ADD</code>.',
            '<strong>Další konstrukce</strong>: <code>OPTIONAL</code> (nepovinná část vzoru), <code>FILTER</code>, <code>UNION</code>, <code>DISTINCT</code>, <code>COUNT</code>, <code>GROUP BY</code> / <code>HAVING</code>, <code>ORDER BY</code>.',
            '<strong>Federated query</strong>: <code>SERVICE</code> pošle část dotazu na jiný SPARQL endpoint (SPARQL 1.1).',
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 46, quote: 'SPARQL umožňuje i úpravy dat a to včetně čtveřic (pojmenovaných grafů)' },
            { kind: 'slide', doc: 'C09', page: 9 },
            { kind: 'web', label: 'W3C: SPARQL 1.1 Query Language', url: 'https://www.w3.org/TR/sparql11-query/' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Prázdný výsledek ≠ „neexistuje“',
          html:
            'Když dotaz nic nevrátí, znamená to jen, že <em>v tomto datasetu a při tomto vyhodnocení</em> nenašel shodu. Příčinou mohou být chybějící data, jiný pojmenovaný graf nebo neprovedené odvození. Na cvičení: <code>ct:partOfOrder</code> v datech není, odvodí ho až reasoner z <code>owl:inverseOf</code>, bez reasoneru je výsledek prázdný.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 63, quote: 'Znamená to, že dotaz v daném datasetu a při daném způsobu vyhodnocení nenašel shodu.' },
            { kind: 'slide', doc: 'C09', page: 13, quote: 'ct:partOfOrder v datech nenajdete: odvodí jej reasoner z owl:inverseOf , bez' },
          ],
        },
        { kind: 'quiz', ids: ['ch09-11', 'ch09-12', 'ch09-16'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-9-7',
      number: '9.7',
      title: 'Otevřený svět, SHACL a OCL',
      blocks: [
        {
          kind: 'p',
          html:
            'Máme tvrzení „Ema studuje na ZŠ“. Platí „Ema studuje na ČVUT“? Odpověď závisí na předpokladu o tom, co platí o <strong>nevyřčených</strong> tvrzeních.',
          sources: [{ kind: 'slide', doc: 'P08', page: 13 }],
        },
        {
          kind: 'table',
          head: ['', 'Open-world assumption (OWA)', 'Closed-world assumption (CWA)'],
          rows: [
            ['nevyřčené tvrzení', 'je <strong>neznámé</strong>, může platit', 'je <strong>nepravdivé</strong>'],
            ['co musím zapsat', 'jen to, co vím; zbytek se může odvodit', 'všechno, co platí'],
            ['kde', 'sémantický web: RDF, OWL (a reálný svět)', 'databáze, deklarativní programování, konceptuální modely, OCL, SHACL'],
          ],
          sources: [
            { kind: 'slide', doc: 'P08', page: 13, quote: 'Typické pro sémantický web (RDF, OWL, ...) ale i reálný svět' },
            { kind: 'slide', doc: 'P08', page: 14, quote: 'Typické pro deklarativní programování, databáze, ... a příslušné (i konceptuální)' },
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>SHACL</strong> (W3C, 2017) validuje RDF graf proti <strong>shapes</strong>: „uzly tohoto druhu musí mít tyto vlastnosti“. Pracuje v uzavřeném světě daného grafu, takže chybějící údaj je <strong>porušení</strong>. Shapes se píšou taky v Turtle. Pro RDF data je SHACL zhruba tím, čím je OCL pro (Onto)UML model.',
          sources: [
            { kind: 'slide', doc: 'P08', page: 48 },
            { kind: 'slide', doc: 'P08', page: 49, quote: 'SHACL je pro RDF data zhruba tím, čím je OCL pro UML/OntoUML model' },
          ],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'SHACL shape z cvičení: objednávku zadá právě jeden zákazník, stav je z výčtu',
          code:
            '@prefix sh: <http://www.w3.org/ns/shacl#> .\n@prefix ct: <https://kom.fit.cvut.cz/costy-taxi#> .\n@prefix ctsh: <https://kom.fit.cvut.cz/costy-taxi/shapes#> .\n\nctsh:OrderShape a sh:NodeShape ;\n    sh:targetClass ct:Order ;\n    sh:property [\n        sh:path ct:orderedBy ; sh:class ct:Customer ;\n        sh:minCount 1 ; sh:maxCount 1 ;\n        sh:message "Objednávku musí zadat právě jeden zákazník."@cs ;\n    ] ;\n    sh:property [\n        sh:path ct:orderStatus ;\n        sh:in ( "created" "cancelled" "completed" "paid" ) ;\n    ] .',
          sources: [
            { kind: 'slide', doc: 'C09', page: 11, quote: 'sh:in je přesně to, co OWL neumí — v otevřeném světě není neznámý stav chybný' },
            { kind: 'web', label: 'W3C: Shapes Constraint Language (SHACL)', url: 'https://www.w3.org/TR/shacl/' },
          ],
        },
        {
          kind: 'p',
          html: '<strong>Totéž „2“ ve třech jazycích.</strong> Věta „osoba má nejvýše dva předky“ má v každém jazyce jiný důsledek:',
          sources: [{ kind: 'slide', doc: 'P08', page: 52 }],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'OWL (otevřený svět): třetí předek není chyba, reasoner odvodí, že dva z nich jsou tentýž',
          code:
            '_:x1 rdf:type owl:Restriction ;\n     owl:onProperty :ancestor ;\n     owl:maxCardinality "2"^^xsd:nonNegativeInteger .',
          sources: [{ kind: 'slide', doc: 'P08', page: 52 }],
        },
        {
          kind: 'code',
          lang: 'ocl',
          caption: 'OCL: invariant nad uzavřeným UML modelem',
          code: 'context Person inv:\n  self.ancestor->size() <= 2',
          sources: [{ kind: 'slide', doc: 'P08', page: 52 }],
        },
        {
          kind: 'code',
          lang: 'turtle',
          caption: 'SHACL: nad konkrétními daty, třetí předek je nahlášen jako porušení',
          code: ':PersonShape a sh:NodeShape ;\n    sh:targetClass :Person ;\n    sh:property [ sh:path :ancestor ; sh:maxCount 2 ] .',
          sources: [{ kind: 'slide', doc: 'P08', page: 52 }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Sémantický web, 5★ a FAIR',
          html:
            '<ul><li><strong>Sémantický web</strong> stojí na XML, RDF a URI; data na webu konceptualizuje pomocí ontologií (značkování např. přes Schema.org).</li><li><strong>5★ otevřená data</strong> (Tim Berners-Lee): ★ otevřená licence (PDF), ★★ strukturovaná (XLS), ★★★ otevřený formát (CSV), ★★★★ URI / RDF, ★★★★★ <strong>propojená</strong> s jinými daty (Linked Data).</li><li><strong>FAIR</strong>: Findable, Accessible, Interoperable, Re-usable; IRI zdrojů má být resolvable a persistentní (purl.org, w3id.org).</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P08', page: 55, quote: 'Sémantický web je postavený na XML, RDF a URI' },
            { kind: 'slide', doc: 'P08', page: 56 },
            { kind: 'slide', doc: 'P08', page: 57 },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Kapitola na jednu obrazovku',
          html:
            '<ol><li>RDF = trojice subject–predicate–object; uzly jsou IRI, literály a prázdné uzly.</li><li>Turtle: <code>@prefix</code>, <code>;</code> stejný subjekt, <code>,</code> stejný predikát, <code>a</code> = rdf:type, <code>[ ]</code> prázdný uzel.</li><li>RDFS = třídy, subClassOf, domain/range (odvozují, nekontrolují).</li><li>OWL = navíc disjointWith, disjointUnionOf, kardinalita, inverseOf, Functional…; Lite ⊂ DL (rozhodnutelné) ⊂ Full.</li><li>SPARQL: SELECT (tabulka), CONSTRUCT (graf), ASK (bool), DESCRIBE (popis).</li><li>OWL = otevřený svět (odvozování), SHACL / OCL = uzavřený svět (validace).</li></ol>',
        },
        { kind: 'quiz', ids: ['ch09-13', 'ch09-14', 'ch09-15'] },
      ],
    },
  ],
}
