import type { Chapter } from '../types'

export const chap07: Chapter = {
  id: 'chap-7',
  number: '7',
  title: 'Transformace OntoUML → UML',
  docs: ['P06', 'C06'],
  exam: ['zkouska'],
  summary:
    'Umíš převést každý konstrukt OntoUML na čistý objektový model (třídy, skládání, dědění) a vysvětlit proč: dědičnost v OOP je rigidní, takže role a fáze se emulují skládáním, non-disjoint a non-sortály vedou na kombinace/delegaci a omezení (multiplicity, {essential}) se hlídají v kódu.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-1',
      number: '7.1',
      title: 'Od konceptuálního modelu k implementaci',
      blocks: [
        {
          kind: 'p',
          html:
            'Konceptuální model slouží hlavně k <strong>porozumění a komunikaci</strong>. Můžeme ho ale použít i jako podklad pro datový model informačního systému – tím se zabývá <em>Model-Driven Development</em> (MDD). Model postupně „sestupuje“ k implementaci:',
          sources: [
            { kind: 'slide', doc: 'C06', page: 28, quote: 'Konceptuální model lze ale využít jako podklad pro datový model informačního systému' },
          ],
        },
        {
          kind: 'table',
          caption: 'Úrovně modelů v MDD (podle Rybola 2017)',
          head: ['Model', 'Jinak', 'Co popisuje'],
          rows: [
            ['<strong>CIM</strong> – Computation Independent Model', 'doménový model', 'prostředí, procesy a požadavky byznysu, bez ohledu na implementaci (tady je OntoUML)'],
            ['<strong>PIM</strong> – Platform Independent Model', 'analytický model', 'požadavky a specifikace systému, pořád bez technologií'],
            ['<strong>PSM</strong> – Platform Specific Model', 'logický model', 'návrh pro konkrétní platformu – jak se PIM realizuje danou technologií'],
            ['<strong>ISM</strong> – Implementation Specific Model', 'fyzický model', 'samotný kód systému a jeho dokumentace'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 3, quote: 'Computation Independent Model (Domain' },
            { kind: 'slide', doc: 'P06', page: 4, quote: 'Platform Independent Model (Analytical' },
            { kind: 'slide', doc: 'P06', page: 5, quote: 'Platform Specific Model (Logical Model)' },
            { kind: 'slide', doc: 'P06', page: 6, quote: 'Implementation Specific Model (Physical' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Model „degeneruje“ na tři konstrukty',
          html:
            'Čistý objektový model zná jen: <ol><li><strong>třídu</strong> s atributy (a metodami),</li><li><strong>skládání</strong> objektů (atribut odkazující na jiný objekt),</li><li><strong>dědění</strong> mezi třídami.</li></ol>Má méně konstruktů než OntoUML, takže se některé detaily přirozeně ztratí – úkolem transformace je zachovat význam a omezení. (Převod do relační DB je mimo předmět.)',
          sources: [
            { kind: 'slide', doc: 'P06', page: 7, quote: 'Objektový model obsahuje méně konstruktů než OntoUML' },
            { kind: 'slide', doc: 'P06', page: 7, quote: 'Transformace do relační DB je již mimo obsah tohoto předmětu.' },
            { kind: 'slide', doc: 'C06', page: 28, quote: 'Objektový model je méně expresivní než OntoUML a tak se přirozeně ztratí některé' },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Proč to nejde „třídu za třídou“?',
          html:
            'Některé konstrukce mají jinou sémantiku: člověk může získávat a ztrácet role, ale <strong>objekt v Javě svou třídu za života nemění</strong>. Kdo přepíše <span class="st">«role»</span> na podtřídu, ztratí anti-rigiditu. Proto se role převádí skládáním.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 58, quote: 'zatímco běžný objekt v Javě za života svou třídu nemění.' },
            { kind: 'slide', doc: 'P06', page: 58, quote: 'Cílem transformace je zachovat význam a omezení.' },
          ],
        },
        { kind: 'quiz', ids: ['ch07-01', 'ch07-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-2',
      number: '7.2',
      title: 'Třídy, atributy a asociace',
      blocks: [
        {
          kind: 'p',
          html:
            'Všechny typy entit (<span class="st">«kind»</span>, <span class="st">«role»</span>, <span class="st">«mixin»</span>…) se převádějí na <strong>třídy</strong>. Atributy se přenesou 1:1; datové typy můžeš namapovat na konkrétní jazyk nebo je nechat konceptuální. Rozhoduje multiplicita:',
          sources: [
            { kind: 'slide', doc: 'P06', page: 8, quote: 'Různé typy entit OntoUML («Kind», «Role», «Mixin», ...) se transformují na třídy.' },
          ],
        },
        {
          kind: 'table',
          caption: 'Multiplicita atributu → implementace',
          head: ['Multiplicita', 'Implementace', 'Co hlídat'],
          rows: [
            ['<code>0..1</code>', 'instanční proměnná', 'nic – smí být prázdná'],
            ['<code>1..1</code>', 'instanční proměnná', '<strong>neprázdná hodnota</strong>'],
            ['<code>0..*</code>', 'typ kolekce', 'nic'],
            ['<code>1..*</code>', 'typ kolekce', '<strong>neprázdná kolekce</strong>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 8, quote: 'Multiplicity atributů 0..1 vedou na instanční proměnné.' },
            { kind: 'slide', doc: 'P06', page: 8, quote: 'Multiplicity atributů 0..* vedou na typ kolekce.' },
            { kind: 'slide', doc: 'P06', page: 8, quote: 'U multiplicit atributů 1..* je nutno zajistit neprázdnost kolekce.' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Povinnost (multiplicita 1..): hard × soft',
          html:
            '<strong>Hard metoda</strong> – hodnotu vynutíš při vytváření objektu: předáš ji v <em>konstruktoru</em> (případně zakážeš vytvoření instance bez ní). Objekt je vždy validní.<br><strong>Soft metoda</strong> – při vytváření to neřešíš; objekt může být chvíli nevalidní (uživatel vyplňuje formulář) a konzistenci kontrolují metody v určitý okamžik, např. před použitím.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 9, quote: 'Hard metoda: vynucení zapsáním hodnoty při vytváření objektu:' },
            { kind: 'slide', doc: 'P06', page: 9, quote: 'Soft metoda: při vytváření objektu neřešíme, ale implementujeme kontroly konzistence' },
            { kind: 'slide', doc: 'C06', page: 29, quote: 'Hard = předání v konstruktoru, objekt je vždy validní' },
          ],
        },
        {
          kind: 'p',
          html:
            'Asociace je <strong>obousměrná</strong> (název + multiplicity na obou koncích), ale skládání v OOP je <strong>jednosměrné</strong> – atribut má jen jeden z objektů. Musíš tedy zvolit <em>směr navigace</em> podle toho, jak budeš data používat (databáze osob s pasy × databáze pasů s osobami).',
          sources: [
            { kind: 'slide', doc: 'P06', page: 10, quote: 'Skládání je však vztah jednosměrný...' },
            { kind: 'slide', doc: 'P06', page: 13 },
          ],
        },
        {
          kind: 'compare',
          title: 'Asociace 1:1 Person – Passport',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 'pp', name: 'Passport', st: 'kind', x: 1, y: 0 },
                ],
                assocs: [{ from: 'p', to: 'pp', name: 'has', fromMult: '1', toMult: '1' }],
              },
            },
            {
              label: 'UML: navigace Person → Passport',
              verdict: 'neutral',
              note: 'Referenci drží Person (atribut passport).',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 0, attrs: ['passport: Passport'], mark: 'focus' },
                  { id: 'pp', name: 'Passport', st: 'none', x: 1, y: 0 },
                ],
                assocs: [{ from: 'p', to: 'pp', st: 'none', toRole: 'passport', fromMult: '1', toMult: '1' }],
              },
            },
            {
              label: 'UML: navigace Passport → Person',
              verdict: 'neutral',
              note: 'Referenci drží Passport (atribut person).',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 0 },
                  { id: 'pp', name: 'Passport', st: 'none', x: 1, y: 0, attrs: ['person: Person'], mark: 'focus' },
                ],
                assocs: [{ from: 'pp', to: 'p', st: 'none', toRole: 'person', fromMult: '1', toMult: '1' }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 11 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Obousměrná navigace = „brusle“',
          html:
            'Když drží referenci oba objekty (Person.passport i Passport.person), musíš vkládání i odebírání vazby ošetřit <strong>u obou</strong> – hrozí nekonzistence. Snažíme se tomu vyhnout. Řešením je <strong>Relationship Object Pattern</strong> (vazby spravuje samostatný objekt, funguje i pro 1:N a M:N), ale přidává složitost – nasazuj ho až jako optimalizaci, když potřebuješ efektivní dotazy z obou stran. Jinak KISS: vhodně zvolená jednosměrná navigace.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 13, quote: 'Vkládání a odebírání asociace je třeba ošetřit u obou objektů' },
            { kind: 'slide', doc: 'P06', page: 15, quote: 'Tento návrhový vzor řeší riziko nekonzistencí.' },
            { kind: 'slide', doc: 'P06', page: 15, quote: 'Implementujeme až jako optimalizaci, kdy potřebujeme provádět efektivně dotazy z' },
            { kind: 'slide', doc: 'P06', page: 14 },
          ],
        },
        {
          kind: 'table',
          caption: 'Multiplicita na straně „bez šipky“ (kolik celků smí odkazovat na tutéž instanci) se hlídá programově',
          head: ['Multiplicita', 'Kontrola v kódu'],
          rows: [
            ['<code>0..1</code>', 'instance je obsažena nejvýš v jednom celku'],
            ['<code>1</code>', 'instance je obsažena právě v jednom celku'],
            ['<code>0..n</code>', 'žádná kontrola'],
            ['<code>1..n</code>', 'prvek musí být alespoň v jedné kolekci'],
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 20, quote: '0..1 – instance byla obsažena max. v jednom celku,' }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'M:N',
          html:
            'Materiální vztahy M:N v OntoUML už rozkládá <span class="st">«relator»</span> na dva vztahy 1:N. M:N tak potkáš hlavně u celek–část (Motherboard – PartType). Na rozdíl od relační DB ho v OO implementuješ přímo – kolekcemi na jedné nebo obou stranách, bez vazebního objektu.',
          sources: [{ kind: 'slide', doc: 'P06', page: 21, quote: 'materiální vztahy M:N se použitím' }],
        },
        { kind: 'quiz', ids: ['ch07-03', 'ch07-04'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-3',
      number: '7.3',
      title: 'Generalizace: complete, disjoint a non-disjoint',
      blocks: [
        {
          kind: 'table',
          caption: 'Meta-atributy generalization setu v OO',
          head: ['OntoUML', 'Význam', 'OO implementace'],
          rows: [
            ['<code>{complete}</code>', 'žádná instance není jen instancí nadtřídy', 'nadtřída je <strong>abstraktní</strong>'],
            ['bez <code>complete</code>', 'smí existovat „čistá“ instance nadtřídy', 'nadtřída není abstraktní'],
            ['<code>{disjoint}</code>', 'instance je v nejvýš jedné podtřídě', '<strong>standardní chování OO</strong> – nic neřešíš'],
            ['bez <code>disjoint</code>', 'instance může být ve více podtřídách zároveň', 'v OO přímo nejde → kombinační třídy nebo skládání'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 22, quote: 'V OO implementujeme jako abstraktní třídu.' },
            { kind: 'slide', doc: 'P06', page: 23, quote: 'Toto je standardní chování objektového systému.' },
            { kind: 'slide', doc: 'P06', page: 23, quote: 'Toto nelze v OO systému obvykle přímo realizovat.' },
          ],
        },
        {
          kind: 'compare',
          title: '{complete} → abstraktní třída',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'm', name: 'Man', st: 'subkind', x: 0, y: 1 },
                  { id: 'w', name: 'Woman', st: 'subkind', x: 1, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true }, mark: 'focus' }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0.5, y: 0, abstract: true, mark: 'focus', note: 'complete → abstract: nejde vytvořit „jen Person“.' },
                  { id: 'm', name: 'Man', st: 'none', x: 0, y: 1 },
                  { id: 'w', name: 'Woman', st: 'none', x: 1, y: 1 },
                ],
                gens: [{ general: 'p', specifics: ['m', 'w'] }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 22 }, { kind: 'slide', doc: 'C06', page: 30, quote: 'Při {complete} je nadtřída abstraktní' }],
        },
        {
          kind: 'p',
          html:
            'Problém je <strong>non-disjoint</strong> dědění: instance může být libovolnou kombinací Being, Human a Animal. Možnosti jsou tři – každá něco stojí:',
          sources: [{ kind: 'slide', doc: 'P06', page: 24 }],
        },
        {
          kind: 'compare',
          title: 'Non-disjoint: čisté skládání',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              note: 'Bez {disjoint}: někdo může být Human i Animal zároveň.',
              diagram: {
                classes: [
                  { id: 'b', name: 'Being', st: 'kind', x: 0.5, y: 0, attrs: ['name: String'] },
                  { id: 'h', name: 'Human', st: 'subkind', x: 0, y: 1, attrs: ['speak(): String'] },
                  { id: 'a', name: 'Animal', st: 'subkind', x: 1, y: 1, attrs: ['doSound(): String'] },
                ],
                gens: [{ general: 'b', specifics: ['h', 'a'], mark: 'focus' }],
              },
            },
            {
              label: 'UML: čisté skládání',
              verdict: 'neutral',
              note: 'Počet tříd roste lineárně, ale ztrácíme vazbu dědění a Being nemůže být abstraktní (nejde pro complete).',
              diagram: {
                classes: [
                  { id: 'b', name: 'Being', st: 'none', x: 0.5, y: 0, attrs: ['name: String', 'human: Human [0..1]', 'animal: Animal [0..1]'] },
                  { id: 'h', name: 'Human', st: 'none', x: 0, y: 1, attrs: ['speak(): String'] },
                  { id: 'a', name: 'Animal', st: 'none', x: 1, y: 1, attrs: ['doSound(): String'] },
                ],
                assocs: [
                  { from: 'b', to: 'h', st: 'none', toRole: 'human', fromMult: '1', toMult: '0..1' },
                  { from: 'b', to: 'a', st: 'none', toRole: 'animal', fromMult: '1', toMult: '0..1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 24 }, { kind: 'slide', doc: 'P06', page: 27 }],
        },
        {
          kind: 'compare',
          title: 'Non-disjoint: kombinační podtřídy',
          items: [
            {
              label: 'UML: dědění',
              verdict: 'neutral',
              note: 'Podtřída pro každou kombinaci. HumanAnimal kopíruje metody → závažné porušení DRY, počet tříd roste exponenciálně.',
              diagram: {
                classes: [
                  { id: 'b', name: 'Being', st: 'none', x: 1, y: 0, attrs: ['name: String'] },
                  { id: 'h', name: 'Human', st: 'none', x: 0, y: 1, attrs: ['speak(): String'] },
                  { id: 'a', name: 'Animal', st: 'none', x: 1, y: 1, attrs: ['doSound(): String'] },
                  { id: 'ha', name: 'HumanAnimal', st: 'none', x: 2, y: 1, attrs: ['speak(): String', 'doSound(): String'], mark: 'focus' },
                ],
                gens: [{ general: 'b', specifics: ['h', 'a', 'ha'] }],
              },
            },
            {
              label: 'UML: dědění + skládání',
              verdict: 'neutral',
              note: 'HumanAnimal deleguje na Human a Animal → neporušuje DRY, ale tříd je pořád exponenciálně.',
              diagram: {
                classes: [
                  { id: 'b', name: 'Being', st: 'none', x: 1, y: 0, attrs: ['name: String'] },
                  { id: 'h', name: 'Human', st: 'none', x: 0, y: 1, attrs: ['speak(): String'] },
                  { id: 'ha', name: 'HumanAnimal', st: 'none', x: 1, y: 1, attrs: ['human: Human', 'animal: Animal'], mark: 'focus' },
                  { id: 'a', name: 'Animal', st: 'none', x: 2, y: 1, attrs: ['doSound(): String'] },
                ],
                gens: [{ general: 'b', specifics: ['h', 'ha', 'a'] }],
                assocs: [
                  { from: 'ha', to: 'h', st: 'none', toRole: 'human', fromMult: '1', toMult: '1' },
                  { from: 'ha', to: 'a', st: 'none', toRole: 'animal', fromMult: '1', toMult: '1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 25 }, { kind: 'slide', doc: 'P06', page: 26 }],
        },
        {
          kind: 'table',
          caption: 'Non-disjoint: srovnání strategií',
          head: ['Strategie', 'Výhoda', 'Nevýhoda'],
          rows: [
            ['dědění (kombinační třídy)', 'vidíme typy instancí', 'exponenciálně tříd, porušení DRY → jen pro málo tříd, nevytvářet nemožné kombinace'],
            ['dědění + skládání', 'delegování, neporušuje DRY', 'pořád exponenciálně podtříd'],
            ['čisté skládání', 'počet instancí roste lineárně', 'ztrácíme přehled o dědění; nelze pro <code>complete</code> (nadtřída nesmí být abstract)'],
            ['trait / mixin jazyka', 'skládání z „balíčků metod“ (Pharo, Scala: trait; Ruby, JS: mixin; Java 8+: default metody)', 'závisí na jazyku'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 25, quote: 'Počet kombinací ale roste exponenciálně (závažné porušení DRY):' },
            { kind: 'slide', doc: 'P06', page: 26, quote: 'Stále obecně nutný exponenciální počet podtříd.' },
            { kind: 'slide', doc: 'P06', page: 27, quote: 'Nelze použít pro complete (nadtřída nemůže být abstract).' },
            { kind: 'slide', doc: 'P06', page: 28, quote: 'Některé OO jazyky obsahují speciální jazykový konstrukt, který nabízí skládání tříd z' },
          ],
        },
        { kind: 'quiz', ids: ['ch07-05', 'ch07-06'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-4',
      number: '7.4',
      title: 'Sortály: identita, role a fáze',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Identita.</strong> Sortál říká jen „existuje jednoznačný princip identity“ – a ten je čistě kognitivní. V implementaci ho musíš zvolit: <strong>umělý identifikátor</strong> (primární klíč, OID, UUID) nebo <strong>přirozený identifikátor</strong> (soubor identifikujících vlastností, např. jméno + příjmení + datum narození). Často obojí.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 29, quote: 'Přirozený identifikátor -- soubor identifikujících vlastností, např. implementace' },
            { kind: 'slide', doc: 'C06', page: 31, quote: 'Zachycení identity pomocí atributů, často ale volíme (zároveň) umělé identifikátory' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Klíčová věta celé kapitoly',
          html:
            '<strong>Dědění v OOP je vždy rigidní</strong>: instanci podtřídy nezrušíš, aniž bys zrušil i její část z nadtřídy. Anti-rigidní typy (<span class="st">«role»</span>, <span class="st">«phase»</span>) proto <strong>nelze</strong> implementovat děděním – dědění nahradíme <strong>skládáním</strong>.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 30, quote: 'protože dědění v OOP je vždy rigidní' },
            { kind: 'slide', doc: 'P06', page: 56, quote: 'V OOP je dědičnost vždy rigidní' },
          ],
        },
        {
          kind: 'compare',
          title: '«role» – varianta 1: hráč drží své role',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'pr', name: 'Professor', st: 'kind', x: 0.5, y: 0 },
                  { id: 't', name: 'Teacher', st: 'role', x: 0, y: 1, mark: 'focus' },
                  { id: 'r', name: 'Researcher', st: 'role', x: 1, y: 1, mark: 'focus' },
                  { id: 's', name: 'Subject', st: 'kind', x: 0, y: 2 },
                  { id: 'pj', name: 'Project', st: 'kind', x: 1, y: 2 },
                ],
                gens: [{ general: 'pr', specifics: ['t', 'r'] }],
                assocs: [
                  { from: 't', to: 's', fromMult: '0..*', toMult: '1..*' },
                  { from: 'r', to: 'pj', fromMult: '1..*', toMult: '1..*' },
                ],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Dědění Professor → Teacher se změnilo na skládání: Professor má 0..1 TeacherRole, kterou lze přidat i odebrat.',
              diagram: {
                classes: [
                  { id: 'pr', name: 'Professor', st: 'none', x: 0.5, y: 0, attrs: ['teacherRole: TeacherRole [0..1]', 'researcherRole: ResearcherRole [0..1]'] },
                  { id: 't', name: 'TeacherRole', st: 'none', x: 0, y: 1, attrs: ['subjects: Set'], mark: 'focus' },
                  { id: 'r', name: 'ResearcherRole', st: 'none', x: 1, y: 1, attrs: ['projects: Set'], mark: 'focus' },
                  { id: 's', name: 'Subject', st: 'none', x: 0, y: 2 },
                  { id: 'pj', name: 'Project', st: 'none', x: 1, y: 2 },
                ],
                assocs: [
                  { from: 'pr', to: 't', st: 'none', toRole: 'teacherRole', fromMult: '1', toMult: '0..1' },
                  { from: 'pr', to: 'r', st: 'none', toRole: 'researcherRole', fromMult: '1', toMult: '0..1' },
                  { from: 't', to: 's', st: 'none', toRole: 'subjects', fromMult: '0..*', toMult: '1..*' },
                  { from: 'r', to: 'pj', st: 'none', toRole: 'projects', fromMult: '1..*', toMult: '1..*' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 31 }],
        },
        {
          kind: 'compare',
          title: '«role» – varianty 2 a 3',
          items: [
            {
              label: 'UML varianta 2: kolekce rolí',
              verdict: 'neutral',
              note: 'Flexibilní práce s libovolným počtem rolí, ale složitější přístup ke konkrétní roli.',
              diagram: {
                classes: [
                  { id: 'pr', name: 'Professor', st: 'none', x: 0.5, y: 0, attrs: ['roles: OrderedCollection'] },
                  { id: 'oc', name: 'OrderedCollection', st: 'none', x: 0.5, y: 1 },
                  { id: 't', name: 'TeacherRole', st: 'none', x: 0, y: 2 },
                  { id: 'r', name: 'ResearcherRole', st: 'none', x: 1, y: 2 },
                ],
                assocs: [
                  { from: 'pr', to: 'oc', st: 'none', toRole: 'roles', fromMult: '1', toMult: '1' },
                  { from: 'oc', to: 't', st: 'none', fromMult: '1', toMult: '0..*' },
                  { from: 'oc', to: 'r', st: 'none', fromMult: '1', toMult: '0..*' },
                ],
              },
            },
            {
              label: 'UML varianta 3: role zná hráče',
              verdict: 'neutral',
              note: 'Navigace opačným směrem – z role na Professor.',
              diagram: {
                classes: [
                  { id: 'pr', name: 'Professor', st: 'none', x: 0.5, y: 0 },
                  { id: 't', name: 'TeacherRole', st: 'none', x: 0, y: 1, attrs: ['professor: Professor'] },
                  { id: 'r', name: 'ResearcherRole', st: 'none', x: 1, y: 1, attrs: ['professor: Professor'] },
                ],
                assocs: [
                  { from: 't', to: 'pr', st: 'none', toRole: 'professor', fromMult: '0..*', toMult: '1' },
                  { from: 'r', to: 'pr', st: 'none', toRole: 'professor', fromMult: '0..*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 32, quote: 'Flexibilní práce s kolekcí rolí, ale složitější přístup k rolím.' },
            { kind: 'slide', doc: 'P06', page: 33, quote: 'Pro případ, kdy potřebujeme snadnou navigaci opačným směrem.' },
          ],
        },
        {
          kind: 'compare',
          title: 'Podrole: role, která má další role',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
                  { id: 'pr', name: 'Professor', st: 'role', x: 1, y: 1 },
                  { id: 't', name: 'Teacher', st: 'role', x: 0, y: 2 },
                  { id: 'g', name: 'Subject Guarantor', st: 'role', x: 1, y: 2 },
                  { id: 'r', name: 'Researcher', st: 'role', x: 2, y: 2 },
                ],
                gens: [{ general: 'p', specifics: ['pr'] }, { general: 'pr', specifics: ['t', 'g', 'r'] }],
              },
            },
            {
              label: 'UML (varianta 1)',
              verdict: 'neutral',
              note: 'Řetěz skládání: Person → ProfessorRole → jednotlivé podrole. Varianta 2 vloží mezi ProfessorRole a podrole kolekci subroles: Set.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 1, y: 0, attrs: ['professorRole: ProfessorRole [0..1]'] },
                  { id: 'pr', name: 'ProfessorRole', st: 'none', x: 1, y: 1 },
                  { id: 't', name: 'TeacherRole', st: 'none', x: 0, y: 2 },
                  { id: 'g', name: 'SubjectGuarantorRole', st: 'none', x: 1, y: 2 },
                  { id: 'r', name: 'ResearcherRole', st: 'none', x: 2, y: 2 },
                ],
                assocs: [
                  { from: 'p', to: 'pr', st: 'none', toRole: 'professorRole', fromMult: '1', toMult: '0..1' },
                  { from: 'pr', to: 't', st: 'none', toRole: 'teacherRole', fromMult: '1', toMult: '0..1' },
                  { from: 'pr', to: 'g', st: 'none', toRole: 'subjectGuarantorRole', fromMult: '1', toMult: '0..1' },
                  { from: 'pr', to: 'r', st: 'none', toRole: 'researcherRole', fromMult: '1', toMult: '0..1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 34 }, { kind: 'slide', doc: 'P06', page: 35 }, { kind: 'slide', doc: 'P06', page: 36 }],
        },
        {
          kind: 'interactive',
          component: 'transform',
          title: 'Vyzkoušej si: OntoUML → UML',
          hint: 'Vyber konstrukt (role, phase, relator, generalization set…) a strategii převodu. Sleduj, co se ze sémantiky ztratí a co pak musíš hlídat v kódu.',
        },
        {
          kind: 'compare',
          title: '«phase» – varianta 1: návrhový vzor State',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'h', name: 'House', st: 'kind', x: 0.5, y: 0, attrs: ['value: Currency', 'computeDamageCost(damageRatio): Currency'] },
                  { id: 'i', name: 'Insured House', st: 'phase', x: 0, y: 1, attrs: ['insuranceLevel: Percent'], mark: 'focus' },
                  { id: 'u', name: 'Uninsured House', st: 'phase', x: 1, y: 1, mark: 'focus' },
                ],
                gens: [{ general: 'h', specifics: ['i', 'u'], set: { disjoint: true, complete: true } }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'House drží aktuální fázi (XOR: právě jednu) a chování na ní závislé deleguje: computeDamageCost volá phase.computeDamageCostValue(…).',
              diagram: {
                classes: [
                  { id: 'h', name: 'House', st: 'none', x: 0.5, y: 0, attrs: ['value: Currency', 'phase: Object', 'computeDamageCost(damageRatio): Currency'] },
                  { id: 'i', name: 'InsuredHousePhase', st: 'none', x: 0, y: 1, attrs: ['insuranceLevel: Percent', 'computeDamageCostValue(…)'], mark: 'focus' },
                  { id: 'u', name: 'UninsuredHousePhase', st: 'none', x: 1, y: 1, attrs: ['computeDamageCostValue(…)'], mark: 'focus' },
                ],
                assocs: [
                  { from: 'h', to: 'i', st: 'none', toRole: 'phase', fromMult: '1', toMult: '0..1' },
                  { from: 'h', to: 'u', st: 'none', toRole: 'phase', fromMult: '1', toMult: '0..1' },
                ],
                notes: [{ id: 'xor', text: '{XOR} právě jedna fáze', x: 0.5, y: 2, attach: ['i', 'u'] }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 37, quote: 'Fázi implementujeme pomocí návrhového vzoru State (Stav).' },
            { kind: 'slide', doc: 'P06', page: 39, quote: 'Chování objektu na základě fáze je realizováno delegováním.' },
            { kind: 'slide', doc: 'P06', page: 38 },
          ],
        },
        {
          kind: 'compare',
          title: '«phase» – varianta 2 a degradace na atribut',
          items: [
            {
              label: 'UML varianta 2: fáze zná dům',
              verdict: 'neutral',
              note: 'Navigace v opačném směru. Pravidlo XOR (dům je v právě jedné fázi) je nutné ošetřit programově.',
              diagram: {
                classes: [
                  { id: 'h', name: 'House', st: 'none', x: 0.5, y: 0, attrs: ['value: Currency'] },
                  { id: 'i', name: 'InsuredHouse', st: 'none', x: 0, y: 1, attrs: ['house: House', 'insuranceLevel: Percent'] },
                  { id: 'u', name: 'UninsuredHouse', st: 'none', x: 1, y: 1, attrs: ['house: House'] },
                ],
                assocs: [
                  { from: 'i', to: 'h', st: 'none', toRole: 'house', fromMult: '0..1', toMult: '1' },
                  { from: 'u', to: 'h', st: 'none', toRole: 'house', fromMult: '0..1', toMult: '1' },
                ],
              },
            },
            {
              label: 'UML: degradace na atribut',
              verdict: 'neutral',
              note: 'Nejjednodušší: fáze je jen hodnota atributu. Ztrácíme polymorfismus – chování podle fáze řeší if/switch.',
              diagram: {
                classes: [
                  { id: 'h', name: 'House', st: 'none', x: 0, y: 0, attrs: ['value: Currency', 'phase: HousePhaseKind', 'insuranceLevel: Percent [0..1]'] },
                  { id: 'e', name: 'HousePhaseKind', st: 'enumeration', x: 1, y: 0, literals: ['INSURED', 'UNINSURED'] },
                ],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 40, quote: 'Podobně jako v případě «Role» můžeme potřebovat navigaci v opačném směru.' },
            { kind: 'slide', doc: 'C06', page: 31, quote: 'Phase: state pattern, degradace na atribut (ztráta polymorfismu)' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Role × phase v implementaci',
          html:
            '<ul><li><strong>Role:</strong> 3 alternativy podle use-case – hráč drží role (var. 1), kolekce rolí (var. 2), role zná hráče (var. 3).</li><li><strong>Phase:</strong> State pattern s delegováním (var. 1), opačná navigace + programové XOR (var. 2), nebo jen atribut (ztráta polymorfismu).</li><li>State pattern se hodí i pro <em>disjunktní</em> role.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'C06', page: 31, quote: 'Role: 3 alternativy podle use-case (přístupnost a flexibilita)' },
            { kind: 'slide', doc: 'P06', page: 39, quote: 'Tento návrhový vzor je použitelný i pro disjunktní role.' },
          ],
        },
        { kind: 'quiz', ids: ['ch07-07', 'ch07-08'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-5',
      number: '7.5',
      title: 'Non-sortály: category, roleMixin, mixin',
      blocks: [
        {
          kind: 'p',
          html:
            'Non-sortály jsou další dimenze kategorizace, takže typicky vedou na <strong>vícenásobnou dědičnost</strong>. V jazycích, které ji nemají, ji nahradíš <strong>skládáním</strong> (a delegováním zpráv) nebo konstruktem <code>trait</code>/<code>mixin</code>. Kterou třídu „složit“ a ze které dědit? Vodítkem je <strong>počet metod</strong>, které bys musel delegovat. Když se non-sortál stane složenou částí, už není abstraktní.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 41, quote: 'Jelikož non-sortály slouží jako další dimenze kategorizace, typicky budou vytvářet' },
            { kind: 'slide', doc: 'P06', page: 42, quote: 'U systémů, které nepodporují vícenásobnou dědičnost, je třeba dědičnost(i) nahradit' },
            { kind: 'slide', doc: 'C06', page: 32, quote: 'V takovém případě již není abstraktní' },
          ],
        },
        {
          kind: 'compare',
          title: '«category» Gluten Free',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              note: 'Fruit i Meat dědí ze dvou nadtypů – Food a Gluten Free.',
              diagram: {
                classes: [
                  { id: 'gf', name: 'Gluten Free', st: 'category', x: 0, y: 0.35, abstract: true, mark: 'focus' },
                  { id: 'f', name: 'Food', st: 'kind', x: 1.5, y: 0 },
                  { id: 'fr', name: 'Fruit', st: 'subkind', x: 0.5, y: 1 },
                  { id: 'm', name: 'Meat', st: 'subkind', x: 1.5, y: 1 },
                  { id: 'b', name: 'Bakery', st: 'subkind', x: 2.5, y: 1 },
                ],
                gens: [{ general: 'gf', specifics: ['fr', 'm'] }, { general: 'f', specifics: ['fr', 'm', 'b'] }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Je-li Gluten Free jen indikace, stačí metoda isGlutenFree(): Boolean. Má-li vlastní chování, složíme ji (Food má víc metod, takže dědíme z Food).',
              diagram: {
                classes: [
                  { id: 'f', name: 'Food', st: 'none', x: 1, y: 0, abstract: true, attrs: ['isGlutenFree(): Boolean'], mark: 'focus' },
                  { id: 'fr', name: 'Fruit', st: 'none', x: 0, y: 1, attrs: ['isGlutenFree() = true'] },
                  { id: 'm', name: 'Meat', st: 'none', x: 1, y: 1, attrs: ['isGlutenFree() = true'] },
                  { id: 'b', name: 'Bakery', st: 'none', x: 2, y: 1, attrs: ['isGlutenFree() = false'] },
                ],
                gens: [{ general: 'f', specifics: ['fr', 'm', 'b'] }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 42 },
            { kind: 'slide', doc: 'P06', page: 43, quote: 'jednoduše i jen např. jako metodu isGlutenFree(): boolean třídní metodu.' },
          ],
        },
        {
          kind: 'compare',
          title: '«roleMixin» Customer',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'o', name: 'Order', st: 'none', x: 1.5, y: 0 },
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 1 },
                  { id: 'c', name: 'Customer', st: 'roleMixin', x: 1.5, y: 1, abstract: true },
                  { id: 'org', name: 'Organisation', st: 'kind', x: 3, y: 1 },
                  { id: 'pc', name: 'PersonalCustomer', st: 'role', x: 0.5, y: 2, mark: 'focus' },
                  { id: 'cc', name: 'CorporateCustomer', st: 'role', x: 2.5, y: 2, mark: 'focus' },
                ],
                gens: [{ general: 'c', specifics: ['pc', 'cc'] }, { general: 'p', specifics: ['pc'], mark: 'focus' }, { general: 'org', specifics: ['cc'], mark: 'focus' }],
                assocs: [{ from: 'o', to: 'c', fromMult: '1..*', toMult: '1' }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Anti-rigidní dědění Person → PersonalCustomer se změní na skládání; tím zmizí i vícenásobná dědičnost. Z Customer se dál dědí.',
              diagram: {
                classes: [
                  { id: 'c', name: 'Customer', st: 'none', x: 1, y: 0, abstract: true },
                  { id: 'o', name: 'Order', st: 'none', x: 2, y: 0 },
                  { id: 'pc', name: 'PersonalCustomer', st: 'none', x: 0, y: 1 },
                  { id: 'cc', name: 'CorporateCustomer', st: 'none', x: 2, y: 1 },
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 2, attrs: ['customerRole: PersonalCustomer [0..1]'], mark: 'focus' },
                  { id: 'org', name: 'Organisation', st: 'none', x: 2, y: 2, attrs: ['customerRole: CorporateCustomer [0..1]'], mark: 'focus' },
                ],
                gens: [{ general: 'c', specifics: ['pc', 'cc'] }],
                assocs: [
                  { from: 'o', to: 'c', st: 'none', toRole: 'customer', fromMult: '1..*', toMult: '1' },
                  { from: 'p', to: 'pc', st: 'none', toRole: 'customerRole', fromMult: '1', toMult: '0..1' },
                  { from: 'org', to: 'cc', st: 'none', toRole: 'customerRole', fromMult: '1', toMult: '0..1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 44, quote: 'Anti-rigidní dědění Person -- PersonalCustomer se změní na skládání, čímž zanikne' }],
        },
        {
          kind: 'compare',
          title: '«mixin» Insured item',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'ii', name: 'Insured item', st: 'mixin', x: 0.5, y: 0, abstract: true },
                  { id: 'h', name: 'House', st: 'kind', x: 1.5, y: 0 },
                  { id: 'car', name: 'Car', st: 'kind', x: 0, y: 1 },
                  { id: 'ih', name: 'Insured House', st: 'role', x: 1, y: 1, mark: 'focus' },
                  { id: 'ins', name: 'Insurance', st: 'relator', x: 2.5, y: 1 },
                ],
                gens: [{ general: 'ii', specifics: ['car', 'ih'], set: { disjoint: true } }, { general: 'h', specifics: ['ih'], mark: 'focus' }],
                assocs: [{ from: 'ins', to: 'ih', st: 'mediation', fromMult: '1..*', toMult: '1' }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Anti-rigidní dědění House → InsuredHouse se změní na skládání; InsuredHouse pak dědí už jen z InsuredItem.',
              diagram: {
                classes: [
                  { id: 'ii', name: 'InsuredItem', st: 'none', x: 0.5, y: 0, abstract: true },
                  { id: 'car', name: 'Car', st: 'none', x: 0, y: 1 },
                  { id: 'ih', name: 'InsuredHouse', st: 'none', x: 1, y: 1 },
                  { id: 'ins', name: 'Insurance', st: 'none', x: 2, y: 1 },
                  { id: 'h', name: 'House', st: 'none', x: 1, y: 2, attrs: ['insuredRole: InsuredHouse [0..1]'], mark: 'focus' },
                ],
                gens: [{ general: 'ii', specifics: ['car', 'ih'] }],
                assocs: [
                  { from: 'ih', to: 'ins', st: 'none', fromMult: '1', toMult: '1..*' },
                  { from: 'h', to: 'ih', st: 'none', toRole: 'insuredRole', fromMult: '1', toMult: '0..1' },
                ],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 45, quote: 'Anti-rigidní dědění House - InsuredHouse se změní na skládání, čímž zanikne problém' }],
        },
        { kind: 'quiz', ids: ['ch07-09'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-6',
      number: '7.6',
      title: 'Celek–část, kolektivy a aspekty',
      blocks: [
        {
          kind: 'compare',
          title: '«quantity», «containment» a «subQuantityOf»',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'b', name: 'Bottle', st: 'kind', x: 0, y: 0 },
                  { id: 'w', name: 'Wine', st: 'quantity', x: 1.5, y: 0 },
                  { id: 'a', name: 'Alcohol', st: 'quantity', x: 3, y: 0 },
                ],
                assocs: [
                  { from: 'b', to: 'w', st: 'containment', fromMult: '1', toMult: '1' },
                  { from: 'w', to: 'a', st: 'subQuantityOf', whole: 'from', fromMult: '1', toMult: '1', meta: ['essential'] },
                ],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Quantity je obyčejná třída; containment i subQuantityOf jsou skládání (atribut content, alcoholSubQuantity).',
              diagram: {
                classes: [
                  { id: 'b', name: 'Bottle', st: 'none', x: 0, y: 0, attrs: ['colour: Color', 'maxVolume_ml: Float', 'content: Wine'] },
                  { id: 'w', name: 'Wine', st: 'none', x: 1.5, y: 0, attrs: ['name: String', 'year: Integer', 'volume_ml: Float', 'alcoholSubQuantity: Alcohol'] },
                  { id: 'a', name: 'Alcohol', st: 'none', x: 3, y: 0, attrs: ['percent: Float', 'purity: Float'] },
                ],
                assocs: [
                  { from: 'b', to: 'w', st: 'none', toRole: 'content', fromMult: '1', toMult: '1' },
                  { from: 'w', to: 'a', st: 'none', toRole: 'alcoholSubQuantity', fromMult: '1', toMult: '1' },
                ],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 46, quote: 'Relaci «containment» implementujeme skládáním a nazýváme obvykle content (obsah).' },
            { kind: 'slide', doc: 'P06', page: 47, quote: '«Quantity» navázaná vztahem «subQuantityOf» je analogicky třída.' },
          ],
        },
        {
          kind: 'compare',
          title: '«collective» → kolekce',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'f', name: 'Friends', st: 'collective', x: 0, y: 0 },
                  { id: 'p', name: 'Person', st: 'kind', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'f', to: 'p', st: 'memberOf', whole: 'from', shareable: true, fromMult: '0..*', toMult: '2..*' }],
              },
            },
            {
              label: 'UML: instance kolekce',
              verdict: 'neutral',
              note: 'Kolektiv = instance kolekce (Set) uložená v instanční proměnné, např. friends: Set.',
              diagram: {
                classes: [
                  { id: 's', name: 'Set', st: 'none', x: 0, y: 0, note: 'Knihovní kolekce, např. proměnná friends: Set.' },
                  { id: 'p', name: 'Person', st: 'none', x: 1, y: 0 },
                ],
                assocs: [{ from: 's', to: 'p', st: 'none', toRole: 'elements', fromMult: '0..*', toMult: '0..*' }],
              },
            },
            {
              label: 'UML: obalená třída',
              verdict: 'neutral',
              note: 'Když kolektiv potřebuje vlastní atributy nebo metody, obalíme kolekci třídou.',
              diagram: {
                classes: [
                  { id: 'f', name: 'Friends', st: 'none', x: 0, y: 0, attrs: ['members: Set', 'since: Date'] },
                  { id: 'p', name: 'Person', st: 'none', x: 1, y: 0 },
                ],
                assocs: [{ from: 'f', to: 'p', st: 'none', toRole: 'members', fromMult: '0..*', toMult: '2..*' }],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 48, quote: 'Použijeme přímo nějakou variantu kolekce (collection) nabízenou v OOP' },
            { kind: 'slide', doc: 'P06', page: 49, quote: 'Kolektiv se tedy transformuje na instanci kolekce, kterou uložíme do instanční' },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Kolekce různých typů a funkční celek',
          html:
            'Mají-li členové kolektivu různé typy, v dynamicky typovaných jazycích (Pharo, Python) to nevadí; ve staticky typovaných (Java, C#, C++) potřebuješ navíc společné rozhraní nebo umělou nadtřídu. Soubor všech kolektivů v modelu je vlastně objektová databáze.<br><strong>Funkční celek</strong> (<span class="st">«componentOf»</span>) je „dobrá zpráva“ – je to přímo skládání, jen ošetříš multiplicity.',
          sources: [
            { kind: 'slide', doc: 'P06', page: 48 },
            { kind: 'slide', doc: 'P06', page: 49, quote: 'Lze říci, že soubor všech kolektivů z modelu představuje objektovou databázi.' },
            { kind: 'slide', doc: 'P06', page: 50, quote: 'Dobrá zpráva: funkční celek představuje skládání, tedy je implementován zcela' },
          ],
        },
        {
          kind: 'table',
          caption: 'Meta-atributy celek–část v kódu',
          head: ['Meta-atribut', 'Význam', 'Implementace'],
          rows: [
            ['<code>{essential}</code>', 'celek nemůže existovat bez stále stejné části', '(i) konstruktor celku bere esenciální část jako parametr, (ii) <strong>žádný setter</strong> pro část, (iii) žádná metoda celku část nevymění'],
            ['<code>{inseparable}</code>', 'část nemůže existovat bez stále stejného celku', 'netriviální – z části neovlivníš celek; zajistíš aspoň, že původní celek část „nepustí“'],
            ['<code>{immutablePart}</code>', 'jako essential, ale pro anti-rigidní celek', 'celek při zániku role/fáze <strong>nemazat, jen archivovat</strong> – při návratu použiješ původní část'],
            ['<code>{immutableWhole}</code>', 'jako inseparable, ale pro anti-rigidní část', 'analogicky (archivace)'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 52, quote: 'Vyrobit konstruktor Celku přijímající jako parametr esenciální Část.' },
            { kind: 'slide', doc: 'P06', page: 52, quote: 'Nevyrábět setter pro Část (tj. nepůjde zvenku změnit).' },
            { kind: 'slide', doc: 'P06', page: 53, quote: 'Implementace {inseparable} části není triviální, jelikož z Části nejsme schopni přímo' },
            { kind: 'slide', doc: 'P06', page: 54, quote: 'že Celek při zániku nebudeme mazat, ale pouze archivovat.' },
          ],
        },
        {
          kind: 'compare',
          title: '{essential}: Person – Brain',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 'b', name: 'Brain', st: 'kind', x: 1.5, y: 0 },
                ],
                assocs: [{ from: 'p', to: 'b', st: 'componentOf', whole: 'from', fromMult: '1', toMult: '1', meta: ['essential'], mark: 'focus' }],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 0, attrs: ['brain: Brain {readOnly}', '«create» Person(brain: Brain)'], mark: 'focus', note: 'Brain se předá v konstruktoru a nemá setter.' },
                  { id: 'b', name: 'Brain', st: 'none', x: 1.7, y: 0 },
                ],
                assocs: [{ from: 'p', to: 'b', st: 'none', toRole: 'brain', fromMult: '1', toMult: '1', meta: ['readOnly'] }],
              },
            },
          ],
          sources: [{ kind: 'slide', doc: 'P06', page: 51 }, { kind: 'slide', doc: 'P06', page: 52 }],
        },
        {
          kind: 'compare',
          title: 'Aspekty: relator, quality, mode',
          items: [
            {
              label: 'OntoUML',
              verdict: 'neutral',
              diagram: {
                classes: [
                  { id: 'h', name: 'Height', st: 'quality', x: 0, y: 0 },
                  { id: 'p', name: 'Person', st: 'kind', x: 1.5, y: 0 },
                  { id: 'e', name: 'Enrollment', st: 'relator', x: 3, y: 0, attrs: ['since: Date'] },
                  { id: 'u', name: 'University', st: 'kind', x: 4.5, y: 0 },
                  { id: 's', name: 'Skill', st: 'mode', x: 1.5, y: 1 },
                ],
                assocs: [
                  { from: 'p', to: 'h', st: 'characterization', fromMult: '1', toMult: '1' },
                  { from: 'p', to: 's', st: 'characterization', fromMult: '1', toMult: '0..*' },
                  { from: 'e', to: 'p', st: 'mediation', fromMult: '0..*', toMult: '1' },
                  { from: 'e', to: 'u', st: 'mediation', fromMult: '0..*', toMult: '1' },
                ],
              },
            },
            {
              label: 'UML',
              verdict: 'neutral',
              note: 'Relátor = obyčejná třída (řešíš jen směry vazeb). Quality se zoptimalizovala na atribut, mode zůstal třídou (má vlastní strukturu).',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'none', x: 0, y: 0, attrs: ['height: Float'], mark: 'focus' },
                  { id: 'e', name: 'Enrollment', st: 'none', x: 1.5, y: 0, attrs: ['since: Date'] },
                  { id: 'u', name: 'University', st: 'none', x: 3, y: 0 },
                  { id: 's', name: 'Skill', st: 'none', x: 0, y: 1, attrs: ['level: Integer'] },
                ],
                assocs: [
                  { from: 'p', to: 's', st: 'none', toRole: 'skills', fromMult: '1', toMult: '0..*' },
                  { from: 'e', to: 'p', st: 'none', toRole: 'student', fromMult: '0..*', toMult: '1' },
                  { from: 'e', to: 'u', st: 'none', toRole: 'university', fromMult: '0..*', toMult: '1' },
                ],
              },
            },
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 55, quote: '«Relator» -- přímočaré, opět jen je třeba řešit směry vazeb' },
            { kind: 'slide', doc: 'P06', page: 55, quote: 'Interní Aspekty («Quality», «Mode») -- přímočaré + možnost optimalizace na atributy' },
          ],
        },
        { kind: 'quiz', ids: ['ch07-10', 'ch07-11'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-7-7',
      number: '7.7',
      title: 'Tahák: co se na co převádí',
      blocks: [
        {
          kind: 'table',
          caption: 'OntoUML → objektový model',
          head: ['OntoUML', 'UML / OO', 'Pozor na'],
          rows: [
            ['<span class="st">«kind»</span>, <span class="st">«subkind»</span>', 'třída, dědění (obojí rigidní – sedí)', 'zvolit identifikátor (umělý / přirozený)'],
            ['<span class="st">«role»</span>', 'samostatná třída + <strong>skládání</strong> (3 varianty)', 'dědění by bylo rigidní'],
            ['<span class="st">«phase»</span>', 'State pattern / XOR asociace / atribut', 'XOR hlídat v kódu; atribut = ztráta polymorfismu'],
            ['<code>{complete}</code> / <code>{disjoint}</code>', 'abstraktní nadtřída / standardní OO', 'non-disjoint → kombinační třídy nebo skládání'],
            ['<span class="st">«category»</span>, <span class="st">«mixin»</span>, <span class="st">«roleMixin»</span>', 'abstraktní třída; vícenásobné dědění → skládání, trait, mixin', 'anti-rigidní hrany vždy na skládání'],
            ['<span class="st">«relator»</span>', 'obyčejná třída s vazbami na mediované', 'směry navigace'],
            ['<span class="st">«quality»</span>, <span class="st">«mode»</span>', 'atribut nebo třída', 'podle potřeby'],
            ['<span class="st">«quantity»</span>, <span class="st">«collective»</span>', 'třída / instance kolekce (příp. obalená)', 'statické typování a různé typy členů'],
            ['<span class="st">«componentOf»</span> a spol.', 'skládání', 'multiplicity, <code>{essential}</code> = konstruktor bez setteru'],
          ],
          sources: [
            { kind: 'slide', doc: 'P06', page: 56 },
            { kind: 'slide', doc: 'P06', page: 57, quote: 'Aspekty dle potřeby implementujeme jako atributy nebo třídy.' },
            { kind: 'slide', doc: 'C06', page: 34, quote: 'Implementaci rolí a fází řešíme vhodnou variantou dle situace.' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Čtyři věty na zkoušku',
          html:
            '<ol><li>V OOP je dědičnost vždy rigidní → anti-rigidní typy emulujeme <strong>skládáním</strong>; směr skládání volíme jako u asociací.</li><li>Vícenásobnou dědičnost (non-sortály, non-disjoint) řešíme skládáním nebo <code>trait</code>/<code>mixin</code>.</li><li>Strukturální omezení (povinnost, XOR, {essential}) zajišťujeme v kódu – hard (konstruktor) nebo soft (kontrola konzistence).</li><li>„Recepty“ smíme po úvaze zjednodušit – zbytečná třída může být jen atribut nebo metoda.</li></ol>',
          sources: [
            { kind: 'slide', doc: 'P06', page: 56 },
            { kind: 'slide', doc: 'P06', page: 57, quote: 'Obecně platí, že uvedené "recepty" můžeme po úvaze zjednodušit.' },
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'K zamyšlení',
          html: 'Dědění (i <code>trait</code> a <code>mixin</code>) v OOP není nic jiného než skládání, které za tebe dělá runtime systém.',
          sources: [{ kind: 'slide', doc: 'P06', page: 57 }],
        },
        { kind: 'quiz', ids: ['ch07-12', 'ch07-13'] },
        { kind: 'quiz', ids: ['ch07-14', 'ch07-15'] },
      ],
    },
  ],
}
