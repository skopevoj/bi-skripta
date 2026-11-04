import type { Chapter, SourceRef } from '../types'

const P01 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P01', page, quote })
const P02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P02', page, quote })
const C01 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'C01', page, quote })
const W = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'W-suhrn', page, quote })

export const chap01: Chapter = {
  id: 'chap-1',
  number: '1',
  title: 'Úvod do konceptuálního modelování',
  docs: ['P01', 'C01', 'P02'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Umíš říct, co je konceptuální model a proč ho děláme, rozlišit typy ontologií, popsat postup konceptuální analýzy (účel → modelování → transformace, včetně modularizace a verifikace × validace) a vysvětlit, co je UFO a proč OntoUML přidává k UML stereotypy.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-1',
      number: '1.1',
      title: 'Co je konceptuální model a k čemu je',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Konceptuální modelování (Mylopoulos, 1992)',
          html:
            'Činnost popisující aspekty <strong>fyzického a sociálního světa</strong> za účelem <strong>porozumění a komunikace</strong>. Notace je dobrá tehdy, když podporuje porozumění světu mezi jejími <em>lidskými</em> uživateli.',
          sources: [P01(6, 'Konceptuální modelování je činnost popisující aspekty')],
        },
        {
          kind: 'p',
          html:
            'Model je tedy hlavně <strong>pro lidi</strong>: doménový expert (zná byznys), analytik a vývojář nad ním mluví stejným jazykem. Překlenuje mezeru mezi tím, jak funguje <em>doména</em> (data, procesy, pravidla ve firmě či instituci), a tím, jak bude vypadat <em>software</em>.',
          sources: [P01(4)],
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Doména</strong> – data, procesy a pravidla ve firmách, institucích a sociální realitě.',
            '<strong>Konceptuální model</strong> – struktury + chování (procesy) + pravidla + omezení; notace (Onto)UML, BPMN, ArchiMate…',
            '<strong>Implementační modely</strong> – objektově orientovaný model, relační model (E-R), model UI, implementační model chování.',
            '<strong>Implementace</strong> – objektová implementace, relační databáze, UI, program.',
          ],
          sources: [P01(4), W(1, 'Pořadí činností při vytváření business informačního systému')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Pořadí činností',
          html:
            'Analýza business dat, procesů a uživatelů → <strong>konceptuální model</strong> → <strong>implementační model</strong> → implementace. Konceptuální model je <em>před</em> implementačním, nikdy naopak.',
          sources: [W(1, 'Pořadí činností při vytváření business informačního systému')],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: '„Proč model, když mám databázové schéma?“',
          html:
            'Schéma zachycuje, <em>jak</em> se data ukládají, ale ne nutně, co <em>znamenají</em>. Tabulka <code>Customer</code> neřekne, jestli evidujeme registrovaného zájemce, současného nájemce, nebo kohokoli, kdo kdy nakoupil. Konceptuální model tyto významy vyjasní.',
          sources: [P01(62, 'Databázové schéma zachycuje způsob uložení dat, ale nemusí vysvětlovat jejich doménový')],
        },
        {
          kind: 'table',
          caption: 'Ullmannův (sémiotický) trojúhelník: model není realita, ale reprezentace naší konceptualizace reality.',
          head: ['Vrchol', 'Co to je', 'Příklad'],
          rows: [
            ['<strong>Symbol</strong> (model)', 'zápis, diagram, slovo', 'diagram tříd, slovo „strom“'],
            ['<strong>Myšlenka</strong> (konceptualizace)', 'pojem v hlavě', 'naše představa stromu'],
            ['<strong>Referent</strong> (realita)', 'věc ve světě', 'konkrétní strom na louce'],
          ],
          sources: [P01(7, 'Někdy také označován jako sémiotický trojúhelník nebo trojúhelník reference'), P01(8)],
        },
        {
          kind: 'p',
          html:
            'Hrany trojúhelníku: model je <em>modelOf</em> konceptualizace, konceptualizace je <em>conceptualizationOf</em> reality a význam (<em>meaningOf</em>) modelu je realita – ale jen nepřímo, přes konceptualizaci.',
          sources: [P01(8)],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Proč nestačí „rovnou programovat“',
          html:
            'Programátoři (i generativní AI) mají bez dobré ontologie příliš velký prostor pro „kreativitu“. Ontolog je jako právník u smlouvy: odstraňuje vágnost a nejednoznačnosti dřív, než vzniknou rozporné interpretace.',
          sources: [P01(18, 'Programátoři (a generativní AI) jsou náchylní k následkům podcenění přípravy dobré')],
        },
        { kind: 'quiz', ids: ['ch01-01', 'ch01-02', 'ch01-03'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-2',
      number: '1.2',
      title: 'Ontologie a typy ontologií',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Ontologie',
          html:
            '<strong>Filozofie:</strong> věda o tom, co je – o druzích a strukturách objektů, vlastností, událostí, procesů a vztahů.<br><strong>Informatika:</strong> reprezentace a definice kategorií, vlastností a vztahů mezi koncepty.',
          sources: [P01(12, 'V informatice označuje ontologie reprezentaci a definici kategorií, vlastností a vztahů')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Ontologii se nevyhneš',
          html:
            'Každý popis reality vytváří <strong>ontologický závazek</strong> (určitý pohled na svět) – i obyčejné databázové schéma. Proto: „Opakem ontologie není ne-ontologie, ale <strong>špatná ontologie</strong>.“',
          sources: [
            P01(12, 'Opakem ontologie není ne-ontologie, ale špatná ontologie!'),
            P01(61, 'Každý popis reality vytváří ontologický závazek (zachycuje určitý pohled na svět).'),
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>WTC 11. 9. 2001:</strong> jsou dva nárazy letadel jedna, nebo dvě události? Na odpovědi záviselo pojistné 3,5 vs. 7 mld. dolarů.',
            '<strong>Clo v USA:</strong> „doll“ (představuje lidskou bytost, 12 %) vs. „toy“ (6,8 %) – jsou figurky mutantů X-Men lidské bytosti?',
            'Je burrito sendvič? Je golf sport? – spory o <em>klasifikaci</em>, ne o fakta.',
          ],
          sources: [P01(13), P01(14), P01(16)],
        },
        {
          kind: 'table',
          caption: 'Typy ontologií',
          head: ['Typ', 'Co popisuje', 'Příklad'],
          rows: [
            [
              '<strong>Fundamentální</strong> (vyšší, <em>foundational / upper</em>)',
              'doménově i aplikačně nezávislé obecné koncepty a vztahy',
              'UFO',
            ],
            ['<strong>Doménová</strong>', 'konkrétní doménu (oblast)', 'těžba ropy'],
            [
              '<strong>Jádrová / referenční</strong> (<em>core / reference</em>)',
              'doménová ontologie s klíčovým (obecným) významem pro celé odvětví',
              'Legal Core Ontology, UFO-S (služby)',
            ],
          ],
          sources: [
            P01(43, 'Doménové ontologie: ontologie popisující určitou doménu (oblast), např. těžbu ropy.'),
            P01(46),
          ],
        },
        { kind: 'quiz', ids: ['ch01-04', 'ch01-05'] },
        {
          kind: 'p',
          html:
            '<strong>Doménová ontologie × model:</strong> ontologie je konceptualizace domény (co v ní existuje a jak to spolu souvisí), konceptuální model je konkrétní <em>artefakt</em> (diagram), který ji zachycuje pro daný účel. Pro jednu doménu proto může vzniknout <strong>více správných</strong> modelů – liší se účelem a podrobností, ne vnitřními rozpory.',
          sources: [
            P02(7, 'Klíčový aspekt, jelikož vícero (správných!) ontologií může být vytvořeno pro jednu'),
            P02(81, 'Můžeme mít se spolužákem dva různé modely a oba správně?'),
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Problém intersubjektivity',
          html:
            'Fyzikální realitu lze popsat objektivně, problém je její <em>interpretace</em> lidskými kategoriemi. Neexistuje experiment, který by dokázal správnost – jediná cesta je <strong>vyjasnit koncepty a vyjednat významy</strong> nad dohodnutým systémem kategorií. Když se experti neshodnou: nejdřív ověř, jestli mluví o stejném kontextu a významu (např. zákazník pro marketing vs. pro účetnictví); skutečný rozpor rozhodnou odpovědní lidé, model ho jen přesně formuluje.',
          sources: [
            P01(17, 'Jedinou cestou je vyjasnit koncepty a vyjednat významy na základě dohodnutého'),
            P01(63, 'Nejprve ověříme, zda mluví o stejném kontextu, období a významu pojmu.'),
          ],
        },
        { kind: 'quiz', ids: ['ch01-08', 'ch01-14'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-3',
      number: '1.3',
      title: 'Postup konceptuální analýzy',
      blocks: [
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Identifikace účelu a cíle</strong> (<em>Requirements Engineering</em>) – rozsah, cíl a aplikace ontologie, otázky, na které má model odpovídat; případně <em>modularizace domény</em>.',
            '<strong>Ontologické konceptuální modelování</strong> – nad základní ontologií (UFO-A, notace OntoUML): slovník pojmů → ontologie podle vzorů → kontrola modelu.',
            '<strong>Transformace na implementační model</strong> – typicky relační nebo objektový (Model-Driven Engineering).',
          ],
          sources: [
            P02(7, 'Postup konceptuální analýzy: Identifikace účelu a cíle'),
            P02(9, 'Krok: Ontologické konceptuální modelování'),
            P02(10, 'Krok: Transformace na implementační model'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Kompetence ontologie',
          html:
            'Vymezení <strong>rozsahu, cíle a aplikace</strong> (dokumentace / reinženýring / návrh IS…) a <strong>otázek, na které chceme znát odpovědi</strong>. Tytéž otázky pak slouží i při validaci. Účel je klíčový, protože pro jednu doménu lze vytvořit více (správných!) ontologií pro různé účely.',
          sources: [
            P02(7, 'Vymezení rozsahu ontologie, cíle a aplikace: kompetence ontologie.'),
            P02(7, 'Identifikace otázek, na které chceme znát odpovědi (využití i při validaci).'),
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>Modularizace domény:</strong> když je doména příliš komplexní, rozdělíme ji na několik <em>subontologií</em>, z nichž každá zachycuje jiný (ideálně ortogonální) aspekt. Subontologie stojí na společném základu a mohou se navzájem používat – nejsou tedy nezávislé.',
          sources: [P02(7, 'Pokud je doména příliš komplexní, použijeme techniku modularizace domény: vytvoříme')],
        },
        {
          kind: 'diagram',
          title: 'Modularizace ontologie (kardiologie)',
          caption:
            'Schéma, ne diagram tříd: boxy jsou subontologie (Anatomy, Heart Electrophysiology, ECG), čáry „staví na / používá“. Na slidu ECG subontologie používá i Anatomy (vynecháno kvůli přehlednosti).',
          diagram: {
            classes: [
              { id: 'base', name: 'UFO & OBO Relation Ontology', st: 'none', x: 1.4, y: 0, note: 'Společný základ: fundamentální ontologie UFO + OBO Relation Ontology.' },
              { id: 'anat', name: 'Anatomy', st: 'none', x: 0, y: 1 },
              { id: 'heart', name: 'Heart Electrophysiology', st: 'none', x: 1.4, y: 1 },
              { id: 'ecg', name: 'ECG', st: 'none', x: 2.8, y: 1 },
            ],
            assocs: [
              { from: 'anat', to: 'base', name: 'staví na' },
              { from: 'heart', to: 'base', name: 'staví na' },
              { from: 'ecg', to: 'base', name: 'staví na' },
              { from: 'heart', to: 'anat', name: 'používá' },
              { from: 'ecg', to: 'heart', name: 'používá' },
            ],
          },
          sources: [P02(8)],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Midterm: K čemu je modularizace?',
          html:
            'Správně: <strong>abychom se vypořádali se složitostí a komplexností domény</strong>. Ne „abychom doménu zjednodušili“ (doménu neměníme), ne „namapovali na softwarové moduly“ (to není implementace) a ne „rozdělili na nezávislé moduly“ (subontologie na sobě závisí).',
          sources: [
            W(1, 'Modularizaci domény využíváme abychom se vypořádali se složitostí a komplexností domény.'),
            P02(7, 'Pokud je doména příliš komplexní, použijeme techniku modularizace domény: vytvoříme'),
          ],
        },
        {
          kind: 'table',
          caption: 'Kontrola modelu – dvě různé věci',
          head: ['', 'Verifikace', 'Validace'],
          rows: [
            ['Otázka', '„Model je správný“', '„V modelu jsou správné věci“'],
            ['Kdo / jak', 'kontrola syntaktické správnosti (i nástrojem)', 'se zadavatelem – doménovým expertem'],
            ['Příklad chyby', '«role» bez vztahu «mediation»', 'model říká, že auto má max. 1 řidiče, realita jinak'],
          ],
          sources: [
            P02(9, 'Verifikace modelu: kontrola syntaktické správnosti'),
            P02(9, 'Validace modelu se zadavatelem (doménový expert)'),
            P01(33, 'Syntaktická verifikace odhalí závazky, které model nesplňuje – například roli bez'),
          ],
        },
        {
          kind: 'p',
          html:
            '<strong>Transformace:</strong> v softwarovém inženýrství převedeme ontologický model na implementační (relační, objektový) – obecně <strong>Model-Driven Engineering</strong>, konkrétně např. <strong>Model-Driven Architecture</strong> (OMG). Konceptuální model ale má cenu i bez softwaru: ontologická klarifikace, komunikace, (re)organizace podniku.',
          sources: [
            P02(10, 'Tento přístup se obecně nazývá Model-Driven Engineering. Konkrétním příkladem v SI'),
            P02(10, 'Konceptuální modely ale lze využít i pro ne-softwarové úlohy, např. ontologickou'),
          ],
        },
        { kind: 'quiz', ids: ['ch01-06', 'ch01-07', 'ch01-09'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-4',
      number: '1.4',
      title: 'UFO a OntoUML v kostce',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>UFO</strong> (<em>Unified Foundational Ontology</em>, od 2005, prof. Giancarlo Guizzardi a tým) je fundamentální ontologie, která spojuje myšlenky z GFO, DOLCE a Ontology of Universals (OntoClean). Používá se k analýze, re-designu a integraci konceptuálních modelů ve složitých doménách.',
          sources: [
            P02(11, 'Zapracovává myšlenky z ontologií GFO, DOLCE a Ontology of'),
            { kind: 'web', label: 'OntoUML docs: UFO', url: 'https://ontouml.readthedocs.io/en/latest/intro/ufo.html' },
          ],
        },
        {
          kind: 'table',
          caption: 'Vrstvy UFO (dole základ, nahoře specializace)',
          head: ['Část', 'Zabývá se', 'Příklady pojmů'],
          rows: [
            ['<strong>UFO-A</strong> (Endurants)', 'strukturální aspekty', 'entity, vlastnosti, vztahy → <strong>OntoUML</strong>'],
            ['<strong>UFO-B</strong> (Events)', 'behaviorální aspekty', 'chování, události, kauzalita'],
            ['<strong>UFO-C</strong> (Social Reality)', 'sociální aspekty', 'agenti, akce, organizace'],
            ['UFO-S, UFO-L', 'služby, právní vztahy (staví na UFO-C)', 'poskytovatel služby, smlouva o službě'],
          ],
          sources: [
            P02(12, 'UFO-A: Strukturální aspekty (entity, vlastnosti, vztahy)'),
            P02(12, 'UFO-B: Behaviorální aspekty (chování, události, kauzalita)'),
            P02(12, 'UFO-C: Sociální aspekty (agenti, akce, organizace)'),
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'OntoUML',
          html:
            '<strong>UML profil</strong> založený na UFO pro <em>Ontology-Driven Conceptual Modelling</em>. Vypadá jako diagram tříd UML, ale má přesnější sémantiku: slouží pro ontologické modelování pomocí základní ontologie <strong>UFO-A</strong>, a proto je pro strukturální modelování výrazově přesnější a bohatší než UML.',
          sources: [
            P02(13, 'UML profil založený na UFO pro Ontology-Driven Conceptual Modelling'),
            P02(5, 'Slouží pro ontologické konceptuální modelování pomocí základní ontologie UFO-A.'),
            { kind: 'web', label: 'OntoUML docs: OntoUML', url: 'https://ontouml.readthedocs.io/en/latest/intro/ontouml.html' },
          ],
        },
        {
          kind: 'p',
          html:
            'Jak se z UML stane OntoUML? Standardním mechanismem rozšíření UML – <strong>stereotypy</strong> (<span class="st">«kind»</span>, <span class="st">«role»</span>, <span class="st">«phase»</span>, <span class="st">«relator»</span>…). Samotný stereotyp ale sémantiku nevytvoří: „UML poskytuje mechanismus, nikoli sémantiku“. Významy a omezení stereotypů dodává právě UFO. Vztah: UFO je <em>reprezentováno</em> OntoUML, OntoUML se <em>interpretuje</em> jako UFO.',
          sources: [
            P01(49, 'UML poskytuje mechanismus, nikoli sémantiku'),
            P01(49, 'Právě jsme použili standardní mechanismus pro rozšíření UML: stereotypy.'),
            P02(13),
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Co si odnést',
          html:
            '<ul><li>UFO = ontologie (teorie), OntoUML = jazyk (notace).</li><li>OntoUML = UML diagram tříd + stereotypy s významem z UFO-A.</li><li>Chování (události) patří do UFO-B, ne do OntoUML diagramu tříd.</li></ul>',
          sources: [P02(5), P02(12), P02(20, 'OntoUML (UFO-A) nevyužívá, pro modelování chování slouží UFO-B.')],
        },
        { kind: 'quiz', ids: ['ch01-10', 'ch01-11'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-1-5',
      number: '1.5',
      title: 'Proč nestačí UML: stejná šipka, různé významy',
      blocks: [
        {
          kind: 'diagram',
          title: 'Motivační příklad: je na tomto UML něco špatně?',
          caption:
            'Syntakticky je diagram v pořádku. Problém je ve významu: všechny generalizace vypadají stejně, ale říkají různé věci.',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'none', x: 0.5, y: 0 },
              { id: 'driver', name: 'Driver', st: 'none', x: 0, y: 1 },
              { id: 'customer', name: 'Customer', st: 'none', x: 1, y: 1, mark: 'focus', note: 'Může Robert přestat být zákazníkem a zůstat stejnou osobou? Ano – UML to ale neříká.' },
              { id: 'vehicle', name: 'Vehicle', st: 'none', x: 2.5, y: 0 },
              { id: 'car', name: 'Car', st: 'none', x: 2, y: 1 },
              { id: 'van', name: 'Van', st: 'none', x: 3, y: 1 },
              { id: 'rented', name: 'RentedCar', st: 'none', x: 1.5, y: 2, mark: 'focus', note: 'Auto je pronajaté kvůli vnějšímu vztahu (smlouvě).' },
              { id: 'damaged', name: 'DamagedCar', st: 'none', x: 2.5, y: 2, mark: 'focus', note: 'Auto je poškozené kvůli svému vnitřnímu stavu.' },
            ],
            gens: [
              { general: 'person', specifics: ['driver', 'customer'] },
              { general: 'vehicle', specifics: ['car', 'van'] },
              { general: 'car', specifics: ['rented', 'damaged'] },
            ],
            assocs: [{ from: 'customer', to: 'car', name: '/rents ▶', fromMult: '*', toMult: '*' }],
          },
          sources: [P01(23)],
        },
        {
          kind: 'compare',
          title: 'Tentýž symbol generalizace skrývá dva odlišné závazky',
          items: [
            {
              label: 'Obyčejné UML',
              verdict: 'neutral',
              note: 'Neříká, zda Customer je trvalý, nebo dočasný.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 0 },
                  { id: 'c', name: 'Customer', st: 'none', x: 0, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['c'] }],
              },
            },
            {
              label: 'OntoUML',
              verdict: 'good',
              note: 'Person dává identitu a je rigidní; Customer je nahodilý – osoba ho může získat i opustit.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0, note: 'Poskytuje identitu, rigidní: osoba nemůže přestat být osobou.' },
                  { id: 'c', name: 'Customer', st: 'role', x: 0, y: 1, note: 'Anti-rigidní: Robert může přestat být zákazníkem a zůstane stejnou osobou.' },
                ],
                gens: [{ general: 'p', specifics: ['c'] }],
              },
            },
          ],
          sources: [P01(24, 'Tentýž symbol generalizace skrývá dva odlišné závazky:')],
        },
        {
          kind: 'table',
          caption: 'Notace stejná, důvody klasifikace zásadně odlišné',
          head: ['Podtřída v UML', 'Proč klasifikace platí?', 'OntoUML'],
          rows: [
            ['Car → RentedCar', 'auto se účastní smlouvy o nájmu (<strong>vnější</strong> vztah)', '<span class="st">«role»</span>'],
            ['Car → DamagedCar', 'změnil se <strong>vnitřní</strong> stav auta', '<span class="st">«phase»</span>'],
          ],
          sources: [P01(31, 'Notace vypadá stejně, ale důvody se zásadně liší.'), P01(32)],
        },
        {
          kind: 'diagram',
          title: 'OntoUML verze autopůjčovny',
          caption:
            'Role mají kontext (smlouvu RentalAgreement), fáze má vnitřní kritérium (stav vozidla). Detaily relátorů a fází přijdou v dalších kapitolách.',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
              { id: 'vehicle', name: 'Vehicle', st: 'kind', x: 3.1, y: 0 },
              { id: 'renter', name: 'Renter', st: 'role', x: 0, y: 1, note: 'Nájemce = osoba, která je právě vázána smlouvou o nájmu.' },
              { id: 'ra', name: 'RentalAgreement', st: 'relator', x: 1.3, y: 1, attrs: ['startDate: Date', 'price: Money'], note: 'Relátor = pravdivostní činitel: musí existovat, aby mezi nájemcem a vozidlem platil vztah.' },
              { id: 'rv', name: 'RentedVehicle', st: 'role', x: 2.6, y: 1, note: 'Vnější důvod: vozidlo se účastní smlouvy.' },
              { id: 'dv', name: 'DamagedVehicle', st: 'phase', x: 3.6, y: 1, note: 'Vnitřní důvod: změnil se stav vozidla.' },
            ],
            gens: [
              { general: 'person', specifics: ['renter'] },
              { general: 'vehicle', specifics: ['rv', 'dv'] },
            ],
            assocs: [
              { from: 'ra', to: 'renter', st: 'mediation', fromMult: '1..*', toMult: '1' },
              { from: 'ra', to: 'rv', st: 'mediation', fromMult: '1..*', toMult: '1' },
            ],
            steps: [
              { label: 'Druhy (kinds) dávají identitu', add: ['person', 'vehicle'] },
              { label: 'Role vznikají ve vztahovém kontextu – smlouvě', add: ['renter', 'ra', 'rv'] },
              { label: 'Fáze vzniká změnou vnitřního stavu', add: ['dv'] },
            ],
          },
          sources: [P01(28), P01(32)],
        },
        {
          kind: 'compare',
          title: 'Příklad „Cena banky“: co přesně znamená atribut cena?',
          items: [
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Nejednoznačné: cena budovy? instituce? služeb?',
              diagram: { classes: [{ id: 'b', name: 'Banka', st: 'none', x: 0, y: 0, attrs: ['cena: number'] }] },
            },
            {
              label: 'Banka jako budova',
              verdict: 'neutral',
              note: 'Banka je «role» budovy – cena patří budově.',
              diagram: {
                classes: [
                  { id: 'bud', name: 'Budova', st: 'kind', x: 0, y: 0, attrs: ['cena: number'] },
                  { id: 'b', name: 'Banka', st: 'role', x: 0, y: 1 },
                ],
                gens: [{ general: 'bud', specifics: ['b'] }],
              },
            },
            {
              label: 'Banka jako instituce',
              verdict: 'neutral',
              note: 'Banka je «subkind» instituce – cena instituce (např. při prodeji).',
              diagram: {
                classes: [
                  { id: 'i', name: 'Instituce', st: 'kind', x: 0, y: 0 },
                  { id: 'b', name: 'Banka', st: 'subkind', x: 0, y: 1, attrs: ['cena: number'] },
                ],
                gens: [{ general: 'i', specifics: ['b'] }],
              },
            },
            {
              label: 'Cena služeb banky',
              verdict: 'neutral',
              note: 'Cena patří finančním službám, které jsou neoddělitelnou částí banky.',
              diagram: {
                classes: [
                  { id: 'i', name: 'Instituce', st: 'kind', x: 0, y: 0 },
                  { id: 'b', name: 'Banka', st: 'subkind', x: 0, y: 1 },
                  { id: 'fs', name: 'Finanční služby', st: 'collective', x: 1.5, y: 1, attrs: ['cena: number'] },
                ],
                gens: [{ general: 'i', specifics: ['b'] }],
                assocs: [
                  { from: 'b', to: 'fs', whole: 'from', fromMult: '1', toMult: '1', meta: ['inseparable'] },
                ],
              },
            },
          ],
          sources: [P02(6)],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Proč tedy OntoUML?',
          html:
            'Zkušený modelář umí totéž zakódovat i v UML (třídami rolí, asociacemi, omezeními). OntoUML ale dává explicitní vodítka: <ul><li>stereotypy s explicitními sémantickými závazky,</li><li>omezení odhalující neúplné struktury (např. role bez «mediation»),</li><li>vzory pro modelovací rozhodnutí,</li><li>anti-vzory, které mění podezřelé struktury na doménové otázky.</li></ul>',
          sources: [
            P01(41, 'OntoUML poskytuje explicitní vodítka pro tvorbu lepších konceptuálních modelů:'),
            P01(25, 'Každá «role» musí být přímo nebo nepřímo spojena vztahem «mediation» . První'),
          ],
        },
        { kind: 'quiz', ids: ['ch01-12', 'ch01-13'] },
      ],
    },
  ],
}
