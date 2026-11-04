import type { Chapter } from '../types'

export const chap11: Chapter = {
  id: 'chap-11',
  number: '11',
  title: 'Shrnutí předmětu',
  docs: ['P11'],
  exam: ['zkouska'],
  summary:
    'Vidět předmět jako jeden celek: OntoUML, OCL, BPMN a RDF/OWL odpovídají na různé otázky o téže doméně. Umět vysvětlit klíčové lekce (účel, závazky rozhodnutí, testování povolených i zakázaných situací, svět × znalost × záznam) a rozpoznat ontologické přetížení asociace.',
  sections: [
    // ------------------------------------------------------------------
    {
      id: 'sec-11-1',
      number: '11.1',
      title: 'Jeden propojený celek: autopůjčovna',
      blocks: [
        {
          kind: 'p',
          html:
            'Celý semestr lze shrnout jednou otázkou: <strong>co potřebujeme vědět, abychom mohli předat vůz?</strong> Každý jazyk z předmětu odpovídá na jinou její část – žádný nestačí sám.',
          sources: [{ kind: 'slide', doc: 'P11', page: 3, quote: 'Autopůjčovna: co potřebujeme vědět, abychom mohli předat vůz?' }],
        },
        {
          kind: 'table',
          head: ['Pohled', 'Otázka, kterou pomáhá zodpovědět'],
          rows: [
            ['<strong>OntoUML / UFO</strong>', 'Co je vůz, nájemce a nájemní vztah? Co je spojuje?'],
            ['<strong>OCL</strong>', 'Jaké stavy a změny odpovídají zvoleným pravidlům?'],
            ['<strong>BPMN</strong>', 'Kdo vůz předá, v jakém pořadí a co při výjimce?'],
            ['<strong>RDF / OWL + SPARQL</strong>', 'Co o situaci víme, co odvodíme a jak se na to zeptáme?'],
            ['<strong>SHACL</strong>', 'Splňují dostupná data požadavky pro dané použití?'],
          ],
          caption: 'Společným výsledkem je soulad významu, pravidel, dat a činností.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 3, quote: 'Co je vůz, nájemce a nájemní vztah? Co je spojuje?' },
            { kind: 'slide', doc: 'P11', page: 3, quote: 'Společným výsledkem je soulad významu, pravidel, dat a činností.' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Jádro autopůjčovny v OntoUML',
          caption:
            'Každý stereotyp je rozhodnutí s důsledky: Vůz je «kind» (má identitu), Nájemce «role» (anti-rigidní, relačně závislá), Nájem «relator» (zakládá vztah), Motor je nahraditelná součást.',
          diagram: {
            classes: [
              { id: 'osoba', name: 'Osoba', st: 'kind', x: 0, y: 0, note: 'Rigidní: osobou je člověk po celou dobu existence.' },
              {
                id: 'najemce',
                name: 'Nájemce',
                st: 'role',
                x: 0,
                y: 1,
                note: 'Anti-rigidní a relačně závislá: člověk může přestat být nájemcem a zůstane týmž člověkem.',
              },
              {
                id: 'najem',
                name: 'Nájem',
                st: 'relator',
                x: 1.5,
                y: 1,
                attrs: ['od: DateTime', 'dohodnutyTermin: DateTime'],
                note: 'Musíme určit, co vztah zakládá, koho váže a kdy končí.',
              },
              {
                id: 'vuz',
                name: 'Vůz',
                st: 'kind',
                x: 3,
                y: 1,
                attrs: ['spz: String'],
                note: 'Identita vozu: změna registrační značky sama o sobě nevytvoří jiné auto.',
              },
              {
                id: 'motor',
                name: 'Motor',
                st: 'kind',
                x: 3,
                y: 2,
                note: 'Nahraditelná součást: výměna motoru zachová identitu vozu, konkrétní motor není esenciální částí.',
              },
            ],
            gens: [{ general: 'osoba', specifics: ['najemce'] }],
            assocs: [
              { from: 'najem', to: 'najemce', st: 'mediation', fromMult: '1..*', toMult: '1' },
              { from: 'najem', to: 'vuz', st: 'mediation', fromMult: '0..*', toMult: '1' },
              { from: 'vuz', to: 'motor', st: 'componentOf', whole: 'from', fromMult: '0..1', toMult: '1' },
            ],
            steps: [
              { label: 'Co existuje: osoby a vozy (kinds)', add: ['osoba', 'vuz'] },
              { label: 'Role nájemce – závisí na vztahu', add: ['najemce'] },
              { label: 'Relátor Nájem spojuje nájemce a vůz', add: ['najem'] },
              { label: 'Nahraditelná součást (ne esenciální)', add: ['motor'] },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P11', page: 5, quote: 'Člověk může přestat být nájemcem a zůstane týmž člověkem.' },
            { kind: 'slide', doc: 'P11', page: 5, quote: 'Výměna motoru zachová identitu vozu; konkrétní motor není esenciální částí.' },
          ],
        },
        {
          kind: 'table',
          head: ['Krok procesu (BPMN)', 'Doménový účinek (OntoUML)', 'Co ověřit (OCL)'],
          rows: [
            ['<strong>Předat vůz</strong>', 'začíná skutečné užívání konkrétního vozu', 'vůz je připraven, převzetí potvrzeno'],
            ['<strong>Převzít vrácený vůz</strong>', 'užívání končí, vzniká záznam o stavu vozu', 'jde o správný vůz i nájem'],
            ['<strong>Řešit zpoždění</strong>', 'evidujeme prodlení, užívání může trvat dál', 'uplynutí termínu nenahrazuje vrácení'],
          ],
          caption: 'Proces mění stav doménových entit.',
          sources: [{ kind: 'slide', doc: 'P11', page: 9, quote: 'Každý důležitý krok procesu musí mít vysvětlitelný účinek v doménovém modelu.' }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak se jazyky propojují',
          html:
            'OntoUML vysvětluje entity, jejich klasifikace a vztahy; BPMN průběh činností, komunikaci a reakce na události; OCL invarianty a podmínky před/po operaci. Propojíme je tím, že u aktivity „Předat vůz“ řekneme, <strong>které entity používá a jakou změnu v doméně způsobí</strong>.',
          sources: [
            { kind: 'slide', doc: 'P09', page: 77, quote: 'OntoUML vysvětluje entity, jejich klasifikace a vztahy' },
            { kind: 'slide', doc: 'P11', page: 9 },
          ],
        },
        { kind: 'quiz', ids: ['ch11-01', 'ch11-02'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-11-2',
      number: '11.2',
      title: 'Modelovací rozhodnutí: účel, závazky, dohoda',
      blocks: [
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Účel určuje, které rozdíly zachovat',
          html:
            'Tentýž automobil popisujeme jinak pro <strong>provoz</strong> (kdo ho užívá a kdy se vrátí), <strong>servis</strong> (které součásti byly vyměněny) a <strong>účetnictví</strong> (k jakému majetku patří náklady). Rozsah vymezují <strong>kompetenční otázky</strong>; chemické složení pneumatik pro předávání vozů nepotřebujeme. Úplnost se posuzuje vůči účelu – zjednodušení musí zachovat rozdíly důležité pro naše otázky.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 4, quote: 'Zjednodušení musí zachovat rozdíly důležité pro naše otázky.' },
            { kind: 'slide', doc: 'P11', page: 4, quote: 'Kompetenční otázky vymezují rozsah.' },
          ],
        },
        {
          kind: 'table',
          head: ['Rozhodnutí v modelu', 'Důsledek, který musíme umět vysvětlit'],
          rows: [
            ['<strong>Identita</strong> automobilu (<span class="st">«kind»</span>)', 'Změna registrační značky sama o sobě nevytvoří jiné auto.'],
            ['<strong>Role</strong> nájemce (<span class="st">«role»</span>)', 'Člověk může přestat být nájemcem a zůstane týmž člověkem.'],
            ['<strong>Relátor</strong> nájemního vztahu (<span class="st">«relator»</span>)', 'Musíme určit, co vztah zakládá, koho váže a kdy končí.'],
            ['<strong>Nahraditelná součást</strong> (componentOf bez <code>{essential}</code>)', 'Výměna motoru zachová identitu vozu; konkrétní motor není esenciální částí.'],
          ],
          caption: 'Rozhodnutí v modelu zavazují. Ptejte se: co se může změnit a přitom zůstane zachována identita? Na čem závisí existence?',
          sources: [
            { kind: 'slide', doc: 'P11', page: 5, quote: 'Změna registrační značky sama o sobě nevytvoří jiné auto.' },
            { kind: 'slide', doc: 'P11', page: 5, quote: 'Musíme určit, co vztah zakládá, koho váže a kdy končí.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Význam vzniká dohodou lidí',
          html:
            'Kdo je „zákazník“? Pro marketing každý registrovaný zájemce, pro provoz účastník probíhajícího nájmu, pro účetnictví odběratel na faktuře. <strong>Shodný název nestačí pro sloučení tříd ani identifikátorů</strong> – výsledkem analýzy může být zdůvodněné rozlišení tří pojmů.',
          sources: [{ kind: 'slide', doc: 'P11', page: 11, quote: 'Shodný název nestačí pro sloučení tříd ani identifikátorů.' }],
        },
        {
          kind: 'p',
          html:
            '<strong>Změna významu zasahuje celé řešení.</strong> „Nově si vůz může pronajmout firma. Řidičem zůstává člověk.“ Nájemce už není jen role osoby – je to společná role osoby i organizace, tedy <span class="st">«roleMixin»</span>. A nájemce je nutné odlišit od řidiče. Změna se pak propíše do procesu (kdo za firmu jedná a přebírá vůz), dat (mapování, dotazy, validace) i správy (stará data, verze).',
          sources: [
            { kind: 'slide', doc: 'P11', page: 13, quote: 'Nově si vůz může pronajmout firma. Řidičem zůstává člověk.' },
            { kind: 'web', label: 'OntoUML docs: RoleMixin', url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/rolemixin/index.html' },
          ],
        },
        {
          kind: 'diagram',
          title: 'Nájemce jako «roleMixin»',
          caption:
            'Nájemce sdružuje instance s různým principem identity (osoby i organizace), proto je to «roleMixin», ne «role». Konkrétní identitu dodávají role Soukromý nájemce (osoba) a Firemní nájemce (organizace). Nájem dál zprostředkovává i Vůz (viz předchozí diagram); Řidič zůstává samostatnou rolí osoby.',
          diagram: {
            classes: [
              { id: 'najem', name: 'Nájem', st: 'relator', x: 0, y: 0 },
              { id: 'osoba', name: 'Osoba', st: 'kind', x: 0, y: 1 },
              {
                id: 'najemce',
                name: 'Nájemce',
                st: 'roleMixin',
                x: 1.5,
                y: 0,
                abstract: true,
                mark: 'focus',
                note: 'Ne-sortál: osoba a organizace mají různé principy identity. Anti-rigidní a relačně závislý (na Nájmu).',
              },
              { id: 'org', name: 'Organizace', st: 'kind', x: 3, y: 1 },
              { id: 'soukr', name: 'Soukromý nájemce', st: 'role', x: 1, y: 2, note: 'Role osoby – identitu dědí z Osoby.' },
              { id: 'firem', name: 'Firemní nájemce', st: 'role', x: 2, y: 2, note: 'Role organizace – identitu dědí z Organizace.' },
            ],
            gens: [
              { general: 'najemce', specifics: ['soukr', 'firem'], set: { disjoint: true, complete: true } },
              { general: 'osoba', specifics: ['soukr'] },
              { general: 'org', specifics: ['firem'] },
            ],
            assocs: [
              { from: 'najem', to: 'najemce', st: 'mediation', fromMult: '1..*', toMult: '1' },
            ],
          },
          sources: [
            { kind: 'slide', doc: 'P11', page: 13 },
            { kind: 'web', label: 'OntoUML docs: RoleMixin', url: 'https://ontouml.readthedocs.io/en/latest/classes/nonsortals/rolemixin/index.html' },
          ],
        },
        { kind: 'quiz', ids: ['ch11-03', 'ch11-04'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-11-3',
      number: '11.3',
      title: 'Pravidla, data a ověřování',
      blocks: [
        {
          kind: 'table',
          head: ['Co musí model připustit?', 'Co musí kontrola odhalit?'],
          rows: [
            ['Dvě rezervace jednoho vozu v různých termínech.', 'Dvě překrývající se rezervace téhož vozu.'],
            ['Jeden člověk je nájemcem i řidičem.', 'Rezervaci, jejíž konec předchází začátku.'],
            ['Po vrácení vozu zůstane dostupná historie nájmů.', 'Omezení, které omylem zakáže i opakovaný pronájem.'],
          ],
          caption: 'Testujte povolené i zakázané situace. Pravidlo: rezervace téhož vozu se nesmějí časově překrývat. Ke každému pravidlu uchovávejte příklady, protipříklady a očekávaný výsledek kontroly.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 6, quote: 'Zvolené pravidlo: rezervace téhož vozu se nesmějí časově překrývat.' },
            { kind: 'slide', doc: 'P11', page: 6, quote: 'Ke každému pravidlu uchovávejte příklady, protipříklady a očekávaný výsledek kontroly.' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Porušení pravidla je také skutečnost',
          html:
            'Rozlišuj, co omezení dělá: <strong>vymezuje pojem</strong> (nájemce je účastníkem nájmu – bez toho role neplatí), <strong>kontroluje provozní povinnost</strong> (vrátit vůz včas – pozdní vrácení musíme evidovat a řešit), nebo <strong>hlídá kvalitu záznamu</strong> (převzetí určuje vůz a čas – neúplný záznam doplnit). Invariant „skutečné vrácení ≤ dohodnutý termín“ by znemožnil zaznamenat právě situaci, kterou potřebujeme řešit.',
          code:
            '-- ✗ nevhodný invariant nad evidencí: pozdní vrácení nejde ani zapsat\ncontext Najem\ninv vracenoVcas: self.skutecneVraceni <= self.dohodnutyTermin\n\n-- ✓ porušení evidujeme jako skutečnost a navážeme proces „Řešit zpoždění“\ncontext Najem::vProdleni : Boolean\nderive: self.skutecneVraceni > self.dohodnutyTermin',
          lang: 'ocl',
          sources: [
            { kind: 'slide', doc: 'P11', page: 7, quote: 'Nevhodný invariant nad evidencí: skutečné vrácení ≤ dohodnutý termín.' },
            { kind: 'slide', doc: 'P11', page: 7, quote: 'U každého omezení určete, zda vymezuje pojem, kontroluje povinnost, nebo kvalitu záznamu.' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Svět, naše znalost a záznam',
          html:
            '„V databázi není aktivní nájem. Je vůz k dispozici?“ Ne nutně:<ol><li><strong>Ve světě</strong> může být vůz stále u zákazníka nebo v servisu.</li><li><strong>Naše znalost</strong> může být neúplná – zpráva o předání ještě nedorazila.</li><li><strong>Záznam</strong> je tvrzení určitého zdroje k určitému času.</li></ol>V <strong>otevřeném světě</strong> (RDF/OWL) absence tvrzení neprokazuje jeho nepravdivost. A pozor: ukončení vztahu, smazání záznamu a oprava chybného tvrzení jsou <strong>tři různé změny</strong>.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 8, quote: 'V otevřeném světě absence tvrzení neprokazuje jeho nepravdivost.' },
            { kind: 'slide', doc: 'P11', page: 8, quote: 'Ukončení vztahu, smazání záznamu a oprava chybného tvrzení jsou tři různé změny.' },
          ],
        },
        {
          kind: 'table',
          head: ['Reprezentace', 'Požadavek „dokončený záznam převzetí určuje právě jeden vůz“ znamená…'],
          rows: [
            ['<strong>UML / OCL</strong>', 'každý dokončený záznam má v daném modelu právě jednu vazbu na vůz'],
            ['<strong>OWL</strong>', 'kardinalita 1 vyžaduje existenci jediného vozu; nemusí být v datech explicitně pojmenován'],
            ['<strong>SHACL</strong>', '<code>minCount 1</code> + <code>maxCount 1</code> kontrolují počet hodnot v posuzovaném grafu'],
            ['<strong>Implementace</strong>', 'dokončení záznamu musí vazbu zajistit; pravidlo pokrývají testy'],
          ],
          caption: 'Při převodu sledujte zachování významu: stejná číslice nebo název nezaručují stejnou sémantiku. Po převodu znovu ověřte původní příklady.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 10, quote: 'Po převodu znovu ověřte původní příklady.' },
          ],
        },
        {
          kind: 'table',
          head: ['Vrstva správnosti', 'Kontrolní otázka', 'Vhodná kontrola'],
          rows: [
            ['Syntax', 'Lze model vůbec načíst?', 'parser, schéma, metamodel'],
            ['Pravidla jazyka', 'Jsou stereotypy a vazby přípustné?', 'OntoUML validátor, OCL'],
            ['Doménový význam', 'Odpovídá model skutečným pravidlům?', 'expert, kompetenční otázky, protipříklady'],
            ['Účel a srozumitelnost', 'Obsahuje správné detaily pro dané publikum?', 'revize s uživateli modelu'],
          ],
          caption: 'Úspěšný import (nebo prošlý validátor) dokládá čitelnost zápisu, ne správnost doménových rozhodnutí – platí i pro modely navržené pomocí AI.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 47, quote: 'Úspěšný import dokládá čitelnost zápisu. Správnost doménových rozhodnutí tím doložena není.' },
            { kind: 'slide', doc: 'P11', page: 54, quote: 'LLM navrhuje, nástroje kontrolují, lidé fundovaně rozhodují.' },
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Kontroly prošly. Proč auto není k dispozici?',
          html:
            '14:00 – plánovaný konec nájmu, proces označí vůz za dostupný. 14:05 – přichází další zákazník, předchozí vůz nevrátil. Validátor, OWL i SHACL jsou spokojené. Chyba: řešení zaměnilo <strong>plánovaný konec</strong> nájmu se <strong>skutečným vrácením</strong> (potvrzené tvrzení o voze zatím nemáme). Opravit je třeba strukturu (rozlišit oba okamžiky), pravidla i proces (dostupnost až po „Převzít vrácený vůz“).',
          sources: [
            { kind: 'slide', doc: 'P11', page: 14, quote: 'Konceptuálně přesné myšlení propojuje význam pojmů s důsledky pro fungování systému.' },
            { kind: 'slide', doc: 'P11', page: 9 },
          ],
        },
        { kind: 'quiz', ids: ['ch11-05', 'ch11-06', 'ch11-07'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-11-4',
      number: '11.4',
      title: 'Příklady z praxe: přetížená asociace a specializace relátorů',
      blocks: [
        {
          kind: 'p',
          html:
            'Případová studie z ropného průmyslu (Petrobras): formální OWL ontologie ložisek byla konzistentní, a přesto nejasná. Asociace <code>Conduct_Fluid</code> se opakovala mezi Duct–Fluid, Gas Pipeline–Gas i Oil Pipeline–Oil a nikdo neuměl říct, <strong>co ji činí pravdivou</strong>: jedna přeprava, nebo více dějů v čase? Jakou identitu a účastníky má tento kontext? To je <strong>ontologické přetížení asociace</strong>.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 19 },
            { kind: 'slide', doc: 'P11', page: 20, quote: 'Co činí vztah duct conducts fluid' },
          ],
        },
        {
          kind: 'compare',
          title: 'Ontologické přetížení asociace → relátor jako truth-maker',
          items: [
            {
              label: 'Přetížená asociace',
              verdict: 'bad',
              note: 'Totéž jméno Conduct_Fluid na více úrovních (a ještě pro Oil Pipeline – Oil). Co je „vedení tekutiny“, kdy začíná a kdy končí, model neříká.',
              diagram: {
                classes: [
                  { id: 'duct', name: 'Duct', st: 'none', x: 0, y: 0 },
                  { id: 'fluid', name: 'Fluid', st: 'none', x: 1.5, y: 0 },
                  { id: 'gp', name: 'Gas Pipeline', st: 'none', x: 0, y: 1 },
                  { id: 'gas', name: 'Gas', st: 'none', x: 1.5, y: 1 },
                ],
                gens: [
                  { general: 'duct', specifics: ['gp'] },
                  { general: 'fluid', specifics: ['gas'] },
                ],
                assocs: [
                  { from: 'duct', to: 'fluid', name: 'Conduct_Fluid*', mark: 'bad' },
                  { from: 'gp', to: 'gas', name: 'Conduct_Fluid*', mark: 'bad' },
                ],
              },
            },
            {
              label: 'Relátor Fluid_Transportation',
              verdict: 'good',
              note: 'Přeprava tekutiny je samostatná entita s identitou a účastníky; material Conduct_Fluid je z ní odvozená (derivation).',
              diagram: {
                classes: [
                  { id: 'ft', name: 'Fluid_Transportation', st: 'relator', x: 1, y: 0, mark: 'good', note: 'Truth-maker: Duct vede Fluid právě tehdy, když existuje přeprava, která je obě spojuje.' },
                  { id: 'duct', name: 'Duct', st: 'kind', x: 0, y: 1 },
                  { id: 'fluid', name: 'Fluid', st: 'quantity', x: 2, y: 1 },
                ],
                assocs: [
                  { from: 'ft', to: 'duct', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'ft', to: 'fluid', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { id: 'cf', from: 'duct', to: 'fluid', st: 'material', name: 'Conduct_Fluid', fromMult: '1..*', toMult: '1..*' },
                ],
                derivations: [{ relator: 'ft', assoc: 'cf' }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P11', page: 20 },
            { kind: 'slide', doc: 'P11', page: 21 },
            { kind: 'web', label: 'OntoUML docs: Relator', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/relator/index.html' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Relátor je „truth-maker“ materiálního vztahu',
          html:
            'Materiální vztah (Duct <em>vede</em> Fluid) neplatí sám od sebe – platí proto, že existuje něco, co ho zakládá: konkrétní <span class="st">«relator»</span> Fluid_Transportation. Jakmile relátor zavedeme, musíme odpovědět na otázky, které asociace skrývala: kolik trubek a kolik tekutiny jedna přeprava zahrnuje, kdy vzniká a kdy končí.',
          sources: [
            { kind: 'slide', doc: 'P11', page: 20 },
            { kind: 'web', label: 'OntoUML docs: Relator', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/relator/index.html' },
          ],
        },
        {
          kind: 'compare',
          title: 'Alternativní ontologické klarifikace (kardinality ze slidu)',
          items: [
            {
              label: 'Varianta A',
              verdict: 'neutral',
              note: 'Každá přeprava spojuje právě jednu trubku a jednu tekutinu.',
              diagram: {
                classes: [
                  { id: 'ft', name: 'Fluid_Transportation', st: 'relator', x: 1, y: 0 },
                  { id: 'duct', name: 'Duct', st: 'kind', x: 0, y: 1 },
                  { id: 'fluid', name: 'Fluid', st: 'quantity', x: 2, y: 1 },
                ],
                assocs: [
                  { from: 'ft', to: 'duct', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { from: 'ft', to: 'fluid', st: 'mediation', fromMult: '1..*', toMult: '1' },
                  { id: 'cf', from: 'duct', to: 'fluid', st: 'material', name: 'Conduct_Fluid', fromMult: '1..*', toMult: '1..*' },
                ],
                derivations: [{ relator: 'ft', assoc: 'cf' }],
              },
            },
            {
              label: 'Varianta B',
              verdict: 'neutral',
              note: 'Jedna přeprava může vést více trubkami; jiná volba kardinalit = jiný význam „přepravy“.',
              diagram: {
                classes: [
                  { id: 'ft', name: 'Fluid_Transportation', st: 'relator', x: 1, y: 0 },
                  { id: 'duct', name: 'Duct', st: 'kind', x: 0, y: 1 },
                  { id: 'fluid', name: 'Fluid', st: 'quantity', x: 2, y: 1 },
                ],
                assocs: [
                  { from: 'ft', to: 'duct', st: 'mediation', fromMult: '1..*', toMult: '1..*' },
                  { from: 'ft', to: 'fluid', st: 'mediation', fromMult: '1', toMult: '1..*' },
                  { id: 'cf', from: 'duct', to: 'fluid', st: 'material', name: 'Conduct_Fluid', fromMult: '1..*', toMult: '1..*' },
                ],
                derivations: [{ relator: 'ft', assoc: 'cf' }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P11', page: 21 }],
        },
        {
          kind: 'diagram',
          title: 'Specializace relátorů',
          caption:
            'Místo opakování asociace na každé úrovni se specializuje relátor: Oil_Transportation je podtyp Fluid_Transportation a zprostředkovává jen Oil Pipeline a Oil. (Na slidu ještě analogicky Gas_Transportation mezi Gas Pipeline a Gas.)',
          diagram: {
            classes: [
              { id: 'duct', name: 'Duct', st: 'kind', x: 0, y: 0 },
              { id: 'ft', name: 'Fluid_Transportation', st: 'relator', x: 1.5, y: 0 },
              { id: 'fluid', name: 'Fluid', st: 'quantity', x: 3, y: 0 },
              { id: 'oilp', name: 'Oil Pipeline', st: 'subkind', x: 0, y: 1 },
              { id: 'ot', name: 'Oil_Transportation', st: 'relator', x: 1.5, y: 1, mark: 'focus', note: 'Specializovaný relátor: dědí z Fluid_Transportation, ale zúží účastníky na Oil Pipeline a Oil.' },
              { id: 'oil', name: 'Oil', st: 'subkind', x: 3, y: 1 },
            ],
            gens: [
              { general: 'duct', specifics: ['oilp'] },
              { general: 'ft', specifics: ['ot'] },
              { general: 'fluid', specifics: ['oil'] },
            ],
            assocs: [
              { from: 'ft', to: 'duct', st: 'mediation', fromMult: '*', toMult: '1' },
              { from: 'ft', to: 'fluid', st: 'mediation', fromMult: '*', toMult: '1' },
              { from: 'ot', to: 'oilp', st: 'mediation', fromMult: '*', toMult: '1' },
              { from: 'ot', to: 'oil', st: 'mediation', fromMult: '*', toMult: '1' },
            ],
            notes: [{ id: 'n-gas', text: 'Analogicky: Gas_Transportation mezi Gas Pipeline a Gas', x: 1.5, y: 2, attach: ['ot'] }],
          },
          sources: [{ kind: 'slide', doc: 'P11', page: 22 }],
        },
        {
          kind: 'diagram',
          title: 'SAREF4health: správná role',
          caption:
            'Monitorovaný řidič v přístavu není nutně pacient. Místo příliš úzkého Patient vznikla «role» Person Under ECG Monitoring (dočasný, relační kontext). Na slidu je ECG Recording Session stereotyp «complexAction»; schéma těchto skript ho nemá, proto je zde jako «event».',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
              { id: 'living', name: 'Living Person', st: 'phase', x: 0, y: 1 },
              { id: 'pecg', name: 'Person Under ECG Monitoring', st: 'role', x: 0, y: 2, mark: 'good', note: 'Role = dočasný relační kontext. Monitorovaný řidič není nutně pacient.' },
              { id: 'sess', name: 'ECG Recording Session', st: 'event', x: 2.2, y: 2, note: 'Na slidu «complexAction».' },
            ],
            gens: [
              { general: 'person', specifics: ['living'] },
              { general: 'living', specifics: ['pecg'] },
            ],
            assocs: [{ from: 'pecg', to: 'sess', name: 'has participant', fromMult: '1', toMult: '0..*' }],
          },
          sources: [{ kind: 'slide', doc: 'P11', page: 27, quote: 'Person Under ECG Monitoring místo' }],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Co si z ukázek odnést',
          html:
            '<ul><li><strong>Sjednotit význam</strong> dřív, než se z něj stanou pole API a datové formáty.</li><li><strong>Odhalit skryté pojmy</strong> – role, relátory a identity, které běžný datový model přehlédne.</li><li><strong>Přenést sémantiku dál</strong> – do RDF, schémat zpráv a validačních pravidel.</li></ul>Nejde o více „krabiček“, ale o méně nedorozumění, která by se jinak stala chybami dat, API a integrací.',
          sources: [{ kind: 'slide', doc: 'P11', page: 28 }],
        },
        { kind: 'quiz', ids: ['ch11-08', 'ch11-09', 'ch11-10'] },
      ],
    },
  ],
}
