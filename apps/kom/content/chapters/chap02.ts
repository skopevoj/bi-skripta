import type { Chapter, SourceRef, Diagram } from '../types'

const P02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P02', page, quote })
const C02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'C02', page, quote })

// Person → Man, Woman with a given generalization set (P02 slides 23–26)
const gsDiagram = (set: { disjoint?: boolean; complete?: boolean } | undefined, abstract = false): Diagram => ({
  classes: [
    { id: 'person', name: 'Person', st: 'none', x: 0.5, y: 0, abstract },
    { id: 'man', name: 'Man', st: 'none', x: 0, y: 1 },
    { id: 'woman', name: 'Woman', st: 'none', x: 1, y: 1 },
  ],
  gens: [{ general: 'person', specifics: ['man', 'woman'], set }],
})

export const chap02: Chapter = {
  id: 'chap-2',
  number: '2',
  title: 'UML a základy OntoUML',
  docs: ['P02', 'C02'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Umíš přečíst diagram tříd: typ entity, atributy a jejich typy, abstraktní typ, specializaci. Víš, co znamená {disjoint} a {complete} (všechny 4 kombinace), umíš číst multiplicitu (spodní mez = povinnost) a znáš metaatributy, role entit a typy asociací 1:1 / 1:N / M:N.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-1',
      number: '2.1',
      title: 'UML, profily a anatomie třídy',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>UML</strong> (Unified Modeling Language) – jazyk pro modelování informačních, výrobních i organizačních systémů a business procesů; standard spravuje <strong>OMG</strong>.',
            'Je založen na metamodelu <strong>MOF</strong> (MetaObject Facility), který definuje základní typy: třída, instance, atribut…',
            '<strong>UML profil</strong> = významové rozšíření UML (jemnější dělení typů entit pomocí stereotypů). OntoUML je jeden z profilů.',
          ],
          sources: [
            P02(3, 'Založen na metamodelu MOF (MetaObject Facility), definuje základní typy entit třída,'),
            P02(3, 'Standard jazyka UML je spravován Object Management Group (OMG).'),
            P02(3, 'Umožňuje významové rozšíření pomocí tzv. UML profilů = definice diagramů a'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'UML ≠ UML pro softwarové inženýrství',
          html:
            'Diagram tříd, jak ho znáš z programování, je <em>UML profil pro softwarové inženýrství</em> (UML SE) – grafické znázornění objektově orientovaného systému. Z historických důvodů se nesprávně ztotožňuje s celým UML. OntoUML je jiný profil: podobný diagramu tříd UML SE, ale s jinou a přesnější sémantikou.',
          sources: [
            P02(4, 'Často bývá z historických důvodů nesprávně zaměňováno UML = UML profil pro'),
            P02(5, 'Profil UML podobný diagramu tříd UML SE, ovšem s trochu jinou a přesnější'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Anatomie třídy',
          caption:
            'Třída: (stereotyp), název, atributy, operace. Viditelnost: + public, − private, # protected, ~ package. Lomítko / = odvozený (derived) atribut. Výčtový typ má místo atributů literály.',
          diagram: {
            classes: [
              {
                id: 'person',
                name: 'Person',
                st: 'none',
                x: 0,
                y: 0,
                attrs: ['+ firstName: String', '+ lastName: String', '- birthDate: Date', '# email: String', '/ age: Integer'],
                note: 'age je odvozený (/) z birthDate – v C01 příkladu „birthdate (to calculate age)“.',
              },
              {
                id: 'state',
                name: 'EnrollmentState',
                st: 'enumeration',
                x: 1,
                y: 0,
                literals: ['planned', 'active', 'finished'],
              },
            ],
          },
          sources: [C02(6), C02(7), { kind: 'slide', doc: 'C01', page: 8 }],
        },
        {
          kind: 'table',
          head: ['Symbol', 'Význam'],
          rows: [
            ['<code>+</code>', 'public'],
            ['<code>-</code>', 'private'],
            ['<code>#</code>', 'protected'],
            ['<code>~</code>', 'package (public ve stejném balíčku)'],
            ['<code>/</code>', 'derived – odvozený atribut'],
            ['<em>kurzíva</em>', 'abstraktní třída'],
          ],
          sources: [C02(6, '~ public in same package')],
        },
        { kind: 'quiz', ids: ['ch02-01', 'ch02-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-2',
      number: '2.2',
      title: 'Typ entity, atributy a instance',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Typ entity</strong> (třída) popisuje vlastnosti společné určitým entitám. <strong>Atributy</strong> reprezentují (více či méně intrinsické = vlastní, vnitřní) vlastnosti. Entita má hodnoty atributů podle svého typu – v souladu s typem a multiplicitou atributu.',
          sources: [
            P02(14, 'Entity obsahují hodnoty atributů definované svým typem v souladu s charakteristikou'),
            P02(14, 'Atributy reprezentují (více či méně intrinsické = vlastní, vnitřní) vlastnosti sdílené'),
          ],
        },
        {
          kind: 'table',
          caption: 'Typy atributů ze slidů',
          head: ['Typ', 'Příklad'],
          rows: [
            ['String', '"Petr"'],
            ['Integer', '10, −5'],
            ['Float / Real', '10.1, 2e3'],
            ['Percent', '10 % či 0.1'],
            ['Boolean', 'true, false'],
            ['Date / Time', '2.6.2012 / 21:00'],
            ['Timestamp', 'datum a čas s vysokou přesností (ms)'],
            ['Currency', '56,00 Kč, $102'],
          ],
          sources: [P02(15, 'Currency – peněžní částka v určité měně')],
        },
        {
          kind: 'diagram',
          title: 'Typ a jedna jeho entita',
          caption:
            'Vlevo typ (třída), vpravo jedinec s konkrétními hodnotami. Diagramy OntoUML specifikují jen typy; příklad jedince slouží k validaci, simulaci a prototypování.',
          diagram: {
            classes: [
              { id: 'dog', name: 'Dog', st: 'kind', x: 0, y: 0, attrs: ['name: String', 'age: Integer', 'breed: String'] },
              {
                id: 'hachiko',
                name: 'hačiko : Dog',
                st: 'none',
                x: 1.2,
                y: 0,
                attrs: ['name = "ハチ公"', 'age = 7', 'breed = "Akita Inu"'],
                note: 'Ilustrace jedince, ne objektový diagram OntoUML.',
              },
            ],
          },
          sources: [P02(16, 'Příklady jedinců pomáhají při validaci, simulaci a prototypování.')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Vazba třída–instance NENÍ 1:1',
          html:
            'V UML SE je objekt instancí jedné třídy (vytvořené přes <code>new</code>). V OntoUML je jeden jedinec <strong>současně instancí mnoha typů</strong> – a v různých situacích (světech) různých. Mick Jagger je Person, Man, Singer; v jiném čase Young Boy, později Adult Man; v jiném světě třeba Economist.',
          sources: [
            P02(17, 'POZOR: na rozdíl od UML ale není vazba třída-instance 1:1'),
            { kind: 'web', label: 'OntoUML docs: Types and Individuals', url: 'https://ontouml.readthedocs.io/en/latest/theory/individuals.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Atributy typu (třídní atributy)',
          caption:
            'fixRateSalary je na slidu podtržený: stejná hodnota pro všechny profesory = vlastnost typu, ne jednotlivce (třídní atribut v UML). Hranaté závorky jsou multiplicita atributu: [0..1] = nepovinný.',
          diagram: {
            classes: [
              {
                id: 'prof',
                name: 'Professor',
                st: 'none',
                x: 0,
                y: 0,
                attrs: ['headOfDept: Boolean [1]', 'startDate: Date [1]', 'fixRateSalary: Currency [1]', 'bonusSalary: Currency [0..1]'],
                note: 'fixRateSalary = atribut typu entity: na úrovni jednotlivých entit konstanta.',
              },
            ],
          },
          sources: [
            P02(18, 'Atribut typu entity vyjadřuje vlastnosti, které jsou společné všem entitám, jsou tedy'),
            P02(18, 'Syntakticky odpovídají třídním atributům v UML - značíme podtrženě:'),
          ],
        },
        { kind: 'quiz', ids: ['ch02-04', 'ch02-07'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-3',
      number: '2.3',
      title: 'Abstraktní typy a metody',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Abstraktní typ entity',
          html:
            'Nemá v realitě <strong>samostatné</strong> instance (jako abstraktní třída v UML). Instanci tvoří jen spolu s alespoň jedním svým podtypem. Značí se názvem v <em>kurzívě</em>.',
          sources: [
            P02(19, 'Abstraktní typ entity nemá v realitě samostatné instance. (V UML odpovídá abstraktní'),
            P02(19, 'Instanci tvoří jen spolu s alespoň jedním svým podtypem.'),
            P02(19, 'Abstraktní typ entity se značí názvem psaným kurzívou.'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Abstraktní Person',
          caption: 'Každá osoba je buď živá, nebo zesnulá – „jen Person“ neexistuje.',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0.5, y: 0, abstract: true, note: 'Kurzíva = abstraktní: instance jen spolu s podtypem.' },
              { id: 'living', name: 'LivingPerson', st: 'phase', x: 0, y: 1 },
              { id: 'deceased', name: 'DeceasedPerson', st: 'phase', x: 1, y: 1 },
            ],
            gens: [{ general: 'person', specifics: ['living', 'deceased'], set: { disjoint: true, complete: true } }],
          },
          sources: [P02(19)],
        },
        {
          kind: 'compare',
          title: 'Metody: UML ano, OntoUML ne',
          items: [
            {
              label: 'UML (objektový model)',
              verdict: 'neutral',
              note: 'Metoda bere parametry, mění stav objektu, vrací hodnotu. (Operace jsou zde zapsány mezi atributy.)',
              diagram: {
                classes: [
                  { id: 'animal', name: 'Animal', st: 'none', x: 0.5, y: 0, attrs: ['name: String', 'age: Int', 'sound(): String'] },
                  { id: 'dog', name: 'Dog', st: 'none', x: 0, y: 1, attrs: ['total_height: Int', 'sound(): String'] },
                  { id: 'cat', name: 'Cat', st: 'none', x: 1, y: 1, attrs: ['sound(): String'] },
                ],
                gens: [{ general: 'animal', specifics: ['dog', 'cat'] }],
              },
            },
            {
              label: 'OntoUML (UFO-A)',
              verdict: 'good',
              note: 'Jen struktura. Chování se modeluje pomocí UFO-B (události), ne metodami.',
              diagram: {
                classes: [
                  { id: 'animal', name: 'Animal', st: 'kind', x: 0.5, y: 0, attrs: ['name: String', 'age: Int'] },
                  { id: 'dog', name: 'Dog', st: 'subkind', x: 0, y: 1, attrs: ['totalHeight: Int'] },
                  { id: 'cat', name: 'Cat', st: 'subkind', x: 1, y: 1 },
                ],
                gens: [{ general: 'animal', specifics: ['dog', 'cat'] }],
              },
            },
          ],
          sources: [P02(20, 'OntoUML (UFO-A) nevyužívá, pro modelování chování slouží UFO-B.')],
        },
        { kind: 'quiz', ids: ['ch02-05', 'ch02-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-4',
      number: '2.4',
      title: 'Specializace (dědění)',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            'Specializace vytváří <strong>taxonomii</strong>. Nadtyp = <em>general</em>, podtyp = <em>specific</em>; trojúhelníková šipka je u <strong>nadtypu</strong>.',
            'Podtyp dědí <strong>všechny vlastnosti</strong> – atributy i vztahy – přes celý řetěz specializace. Podtyp lze použít všude, kde se čeká nadtyp (substituce).',
            '<strong>Antisymetrická:</strong> je-li B specializací A, A nemůže být specializací B.',
            '<strong>Tranzitivní:</strong> je-li B specializací A a C specializací B, je C specializací A.',
            'UML povoluje <strong>vícenásobné dědění</strong> (obojživelné auto je Car i Ship).',
          ],
          sources: [
            P02(21, 'Třídy mohou být navzájem ve vztahu specializace = taxonomická struktura.'),
            P02(21, 'Všechny vlastnosti třídy (atributy a vztahy) se dědí přes řetěz specializace.'),
            C02(8, 'Trojúhelníková šipka u nadtypu'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Taxonomie vozidel s vícenásobným děděním',
          caption:
            'Díky tranzitivitě je Amphibious car (přes Car i Ship) také Vehicle a dědí colour, speed, weight. Abstraktní typy jsou v kurzívě.',
          diagram: {
            classes: [
              { id: 'vehicle', name: 'Vehicle', st: 'none', x: 1.5, y: 0, abstract: true, attrs: ['colour', 'speed', 'weight'] },
              { id: 'ground', name: 'Ground vehicle', st: 'none', x: 0.5, y: 1, abstract: true },
              { id: 'water', name: 'Water vehicle', st: 'none', x: 2.5, y: 1, abstract: true },
              { id: 'moto', name: 'Motorbike', st: 'none', x: 0, y: 2 },
              { id: 'car', name: 'Car', st: 'none', x: 1, y: 2 },
              { id: 'ship', name: 'Ship', st: 'none', x: 2, y: 2 },
              { id: 'jet', name: 'Jet ski', st: 'none', x: 3, y: 2 },
              { id: 'amph', name: 'Amphibious car', st: 'none', x: 1.5, y: 3, mark: 'focus', note: 'Vícenásobné dědění: podtyp dvou nadtypů.' },
            ],
            gens: [
              { general: 'vehicle', specifics: ['ground', 'water'] },
              { general: 'ground', specifics: ['moto', 'car'] },
              { general: 'water', specifics: ['ship', 'jet'] },
              { general: 'car', specifics: ['amph'] },
              { general: 'ship', specifics: ['amph'] },
            ],
          },
          sources: [C02(9), C02(10)],
        },
        { kind: 'quiz', ids: ['ch02-08'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-5',
      number: '2.5',
      title: 'Generalization sets: {disjoint} a {complete}',
      blocks: [
        {
          kind: 'p',
          html:
            'Podtypy se společným nadtypem lze sdružit do <strong>generalization set</strong> (množina nadtypu) a upřesnit dvěma meta-atributy. V UML ho najdeš také, ale v OntoUML se používá mnohem víc.',
          sources: [P02(22, 'Pozn: Tento konstrukt obsahuje i UML, ale v OntoUML je více využíván.')],
        },
        {
          kind: 'table',
          head: ['Meta-atribut', 'Znamená', 'Jak si to zapamatovat'],
          rows: [
            ['<code>complete</code>', 'každá instance nadtypu je instancí <strong>alespoň jednoho</strong> podtypu (UML: <code>isCovering = true</code>)', 'podtypy <em>pokryjí</em> celý nadtyp – nikdo „jen Person“'],
            ['<code>disjoint</code>', 'žádná instance není instancí <strong>více než jednoho</strong> podtypu', 'podtypy se <em>nepřekrývají</em> – nikdo „Man i Woman“'],
          ],
          sources: [
            P02(22, 'complete = každá instance nadtypu je také instancí alespoň jednoho z podtypů.'),
            P02(22, 'disjoint = neexistuje instance, která by byla instancí více než jednoho z podtypů.'),
            P02(22, 'V UML terminologii odpovídá isCovering = true'),
          ],
        },
        { kind: 'quiz', ids: ['ch02-11'] },
        {
          kind: 'compare',
          title: 'Čtyři kombinace na příkladu Person → Man, Woman',
          items: [
            {
              label: 'bez disjoint a complete',
              verdict: 'neutral',
              note: 'Instance může být Man, Woman, obojí, nebo jen Person.',
              diagram: gsDiagram(undefined),
            },
            {
              label: '{complete}',
              verdict: 'neutral',
              note: 'Man, Woman, nebo obojí. „Jen Person“ ne – nadtyp je de facto abstraktní.',
              diagram: gsDiagram({ complete: true }),
            },
            {
              label: '{disjoint}',
              verdict: 'neutral',
              note: 'Buď Man, nebo Woman, nebo jen Person – ale ne kombinace.',
              diagram: gsDiagram({ disjoint: true }),
            },
            {
              label: '{disjoint, complete}',
              verdict: 'neutral',
              note: 'Právě jeden podtyp: buď Man, nebo Woman. Person je abstraktní (kurzíva).',
              diagram: gsDiagram({ disjoint: true, complete: true }, true),
            },
          ],
          sources: [
            P02(23, 'Instance může být Žena, Muž, obojí, nebo jen Člověk.'),
            P02(24, 'Instance může být Žena, Muž a nebo obojí.'),
            P02(25, 'Instance může být buď Žena, Muž a nebo jen Člověk (ale ne kombinace).'),
            P02(26, 'Instance může být buď Žena nebo Muž (ale ne obojí).'),
          ],
        },
        {
          kind: 'interactive',
          component: 'gs-venn',
          title: 'Vyzkoušej si generalization set',
          hint: 'Zapínej disjoint a complete a sleduj, které oblasti Vennova diagramu (jen Person / jen Man / jen Woman / Man i Woman) mohou obsahovat instance.',
        },
        {
          kind: 'table',
          caption: 'Kdo může existovat?',
          head: ['', 'jen Person', 'jen Man / jen Woman', 'Man i Woman'],
          rows: [
            ['nic', '✓', '✓', '✓'],
            ['{complete}', '✗', '✓', '✓'],
            ['{disjoint}', '✓', '✓', '✗'],
            ['{disjoint, complete}', '✗', '✓', '✗'],
          ],
          sources: [P02(23), P02(24), P02(25), P02(26)],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Typické chytáky',
          html:
            '<ul><li><code>complete</code> zakazuje instance „jen nadtypu“ → nadtyp je de facto abstraktní (i když není psán kurzívou).</li><li><code>disjoint</code> nic neříká o tom, zda musí být instance v některém podtypu.</li><li>Bez meta-atributů je povoleno všechno, včetně překryvu.</li></ul>',
          sources: [P02(24, 'Mohou existovat instance podtříd a jejich kombinací (nadtřída je de-facto abstraktní).')],
        },
        { kind: 'quiz', ids: ['ch02-09', 'ch02-10'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-6',
      number: '2.6',
      title: 'Asociace a multiplicita',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Asociace</strong> modelují vztahy mezi entitami. Jsou to relace: instance binární asociace je <em>dvojice</em> entit. Omezujeme se na binární vztahy.',
          sources: [P02(27, 'Asociace modelují vztahy mezi entitami.')],
        },
        {
          kind: 'diagram',
          title: 'Asociace a její instance',
          caption: 'Každé auto vyrobil právě jeden výrobce, výrobce vyrobil alespoň jedno auto.',
          diagram: {
            classes: [
              { id: 'car', name: 'Car', st: 'kind', x: 0, y: 0, attrs: ['type: String'] },
              { id: 'man', name: 'Manufacturer', st: 'kind', x: 1.8, y: 0, attrs: ['name: String'] },
            ],
            assocs: [{ from: 'car', to: 'man', name: 'manufactured by ▶', fromMult: '1..*', toMult: '1' }],
          },
          sources: [P02(27)],
        },
        {
          kind: 'code',
          lang: 'text',
          caption: 'Instance asociace „manufactured by“ = dvojice (Car, Manufacturer)',
          code: '(Fabia, Skoda)\n(Octavia, Skoda)\n(9-5, Saab)\n(900, Saab)',
          sources: [P02(27)],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Název a multiplicita',
          html:
            '<strong>Název</strong> má šipku ▶ určující směr čtení. <strong>Multiplicita</strong> = povolená násobnost na obou stranách. Čte se ve směru čtení: „Osoba (jedna) vlastní 0..* aut“ – číslo u <em>druhé</em> třídy říká, kolik jejích instancí má jedna instance první třídy.',
          sources: [
            P02(28, 'název = upřesňující údaj se šipkou značící směr čtení'),
            P02(28, 'multiplicita = povolená násobnost vztahu na obou stranách asociace'),
            P02(28, 'Multiplicita se zapisuje ve směru čtení (např. Osoba (jedna) vlastní 0..n Aut.)!'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Person owns Car',
          caption: '0..* u Car: osoba nemusí vlastnit žádné auto, ale může libovolně mnoho. 1..1 u Person: auto má právě jednoho vlastníka.',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'none', x: 0, y: 0 },
              { id: 'car', name: 'Car', st: 'none', x: 1.5, y: 0 },
            ],
            assocs: [{ from: 'person', to: 'car', name: 'owns ▶', fromMult: '1..1', toMult: '0..*' }],
          },
          sources: [P02(28)],
        },
        {
          kind: 'table',
          caption: 'Spodní mez = povinnost, horní mez = maximum',
          head: ['Zápis', 'Význam', 'Povinný?'],
          rows: [
            ['<code>0..1</code>', 'nejvýše jeden', 'ne'],
            ['<code>1</code> (= <code>1..1</code>)', 'právě jeden', '<strong>ano</strong>'],
            ['<code>*</code> (= <code>0..*</code>)', 'libovolně mnoho, i žádný', 'ne'],
            ['<code>1..*</code>', 'alespoň jeden, bez horní meze', '<strong>ano – vždy</strong>'],
            ['<code>x..y</code>', 'nejméně x, nejvíce y', 'ano, pokud x ≥ 1'],
          ],
          sources: [
            P02(29, 'spodní mez – typicky určuje povinnost ve vztahu:'),
            P02(29, 'horní mez – určuje maximální počet instancí relace, kde se daná entita vyskytuje. Je'),
            C02(11, 'x..* = nejméně x, maximum bez omezení'),
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Midterm: 1..* znamená…',
          html:
            '…že vztah je pro entitu <strong>vždy povinný</strong>. Žádné „toleruje krátké výjimky“ ani „doporučen jako povinný“ – spodní mez 1 je tvrdé omezení. Zkrácené zápisy používej konzistentně: <code>1..1</code> = <code>1</code>, <code>0..*</code> = <code>*</code>.',
          sources: [P02(29, 'Auto musí mít osobu (vlastníka) (1..).'), { kind: 'wiki', label: 'FIT Wiki: BI-KOM midterm 2022 (screenshot)' }],
        },
        { kind: 'quiz', ids: ['ch02-12', 'ch02-13'] },
        {
          kind: 'compare',
          title: 'Typy asociací podle horních mezí',
          items: [
            {
              label: '1:1',
              verdict: 'neutral',
              note: 'Každá instance A má nejvýše jednu instanci B a naopak.',
              diagram: {
                classes: [
                  { id: 'a', name: 'Person', st: 'none', x: 0, y: 0 },
                  { id: 'b', name: 'Passport', st: 'none', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'a', to: 'b', name: 'holds ▶', fromMult: '1', toMult: '0..1' }],
              },
            },
            {
              label: '1:N',
              verdict: 'neutral',
              note: 'A může mít více B, každá B má nejvýše jednu A.',
              diagram: {
                classes: [
                  { id: 'a', name: 'Person', st: 'none', x: 0, y: 0 },
                  { id: 'b', name: 'Car', st: 'none', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'a', to: 'b', name: 'owns ▶', fromMult: '1', toMult: '*' }],
              },
            },
            {
              label: 'M:N',
              verdict: 'neutral',
              note: 'A může mít více B a B může mít více A.',
              diagram: {
                classes: [
                  { id: 'a', name: 'Student', st: 'none', x: 0, y: 0 },
                  { id: 'b', name: 'Course', st: 'none', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'a', to: 'b', name: 'attends ▶', fromMult: '*', toMult: '*' }],
              },
            },
          ],
          sources: [P02(33, 'Asociace je vztah oboustranný, který má název a 4 charakteristiky (spodní-horní mez,')],
        },
        { kind: 'quiz', ids: ['ch02-14'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-2-7',
      number: '2.7',
      title: 'Metaatributy, role entit, poznámky a celek–část v UML',
      blocks: [
        {
          kind: 'table',
          caption: 'Metaatributy konce asociace',
          head: ['Metaatribut', 'Význam', 'Default?'],
          rows: [
            ['<code>unordered</code>', 'neuspořádaná množina (<code>isOrdered = false</code>)', '<strong>ano</strong>'],
            ['<code>ordered</code>', 'uspořádané pole podle pořadí vkládání', 'ne'],
            ['<code>unique</code>', 'prvky musí být unikátní', '<strong>ano</strong>'],
            ['<code>nonunique</code>', 'prvky se mohou opakovat (<code>isUnique = false</code>)', 'ne'],
          ],
          sources: [P02(30, 'unordered – neuspořádaná množina (default, isOrdered = false )'), P02(30, 'unique – prvky musí být unikátní (default)')],
        },
        {
          kind: 'diagram',
          title: 'Role entit ve vztahu a metaatribut',
          caption: 'Kromě názvu vztahu (owns) lze pojmenovat roli každé strany: osoba je owner, auto je family car. Auta osoby jsou uspořádaná.',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'none', x: 0, y: 0 },
              { id: 'car', name: 'Car', st: 'none', x: 1.6, y: 0 },
            ],
            assocs: [
              {
                from: 'person',
                to: 'car',
                name: 'owns ▶',
                fromRole: 'owner',
                toRole: 'family car',
                fromMult: '1..1',
                toMult: '0..*',
                meta: ['ordered'],
              },
            ],
          },
          sources: [P02(31, 'Mimo názvu vztahu lze navíc pojmenovat roli entity ve vztahu')],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Multiplicity určuje doména, ne diagram',
          html:
            'Jen z pohledu na model <strong>nelze</strong> říct, zda jsou multiplicity správně – musíš znát účel systému a pravidla v realitě. Databáze autoklubu: každá osoba vlastní <code>1..*</code> aut (podmínka členství). Vlastník jako uživatel (ne „de jure“): jedno auto může mít více vlastníků (otec, manželka, syn).',
          sources: [
            P02(32, 'Multiplicity jsou určeny problémovou doménou a jsou tedy výsledkem konceptuální'),
            P02(32, 'Pokud např. bude asociace z předchozího slide modelovat databázi autoklubu,'),
          ],
        },
        { kind: 'quiz', ids: ['ch02-15', 'ch02-16'] },
        {
          kind: 'compare',
          title: 'Celek–část v UML: agregace × kompozice',
          items: [
            {
              label: 'Agregace (prázdný kosočtverec)',
              verdict: 'neutral',
              note: 'Celek i část mohou existovat odděleně: koš s jablky, les se stromy.',
              diagram: {
                classes: [
                  { id: 'basket', name: 'Basket', st: 'none', x: 0, y: 0 },
                  { id: 'apple', name: 'Apple', st: 'none', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'basket', to: 'apple', name: 'contains', whole: 'from', shareable: true, fromMult: '0..1', toMult: '*' }],
              },
            },
            {
              label: 'Kompozice (plný kosočtverec)',
              verdict: 'neutral',
              note: 'Část nemůže existovat bez celku: tabulka a její sloupce.',
              diagram: {
                classes: [
                  { id: 'table', name: 'Table', st: 'none', x: 0, y: 0 },
                  { id: 'col', name: 'Column', st: 'none', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'table', to: 'col', whole: 'from', shareable: false, fromMult: '1', toMult: '1..*' }],
              },
            },
          ],
          sources: [C02(12, 'Celek i část mohou existovat odděleně'), C02(13, 'Část nemůže existovat bez celku')],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'V OntoUML přesněji',
          html:
            'UML zná jen agregaci a kompozici. OntoUML rozlišuje druhy celek–část (<span class="st">«componentOf»</span>, <span class="st">«memberOf»</span>, <span class="st">«subCollectionOf»</span>, <span class="st">«subQuantityOf»</span>) a meta-atributy jako <code>{essential}</code> a <code>{inseparable}</code> – viz kapitola o vztazích celek–část. Stejně tak obyčejná asociace sama nevyjadřuje přesně sémantiku vztahu – to řeší relátory.',
          sources: [P02(28, 'nevyjadřují dostatečně přesně sémantiku vztahů -- stay tuned for Relators ;-).')],
        },
        { kind: 'quiz', ids: ['ch02-03'] },
      ],
    },
  ],
}
