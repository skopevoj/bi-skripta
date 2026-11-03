import type { Chapter, DocId, SourceRef } from '../types'

// slide ref helper: quote = verbatim phrase from one line of `pdftotext -layout` of that page
const s = (doc: DocId, page: number, quote?: string): SourceRef =>
  quote ? { kind: 'slide', doc, page, quote } : { kind: 'slide', doc, page }

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

export const chap03: Chapter = {
  id: 'chap-3',
  number: '3',
  title: 'Sortály: identita a rigidita',
  docs: ['P02', 'C03'],
  exam: ['midterm', 'zkouska'],
  summary:
    'Umět rozhodnout, zda typ poskytuje / nese identitu a zda je rigidní, a podle toho zvolit «kind», «subkind», «phase» nebo «role» – včetně pravidel, kdo smí být čím nadtypem, vzoru phase partition a vzoru role s povinným vztahem.',
  sections: [
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-1',
      number: '3.1',
      title: 'Kategorie typů objektů: sortál vs. ne-sortál',
      blocks: [
        {
          kind: 'p',
          html:
            'OntoUML nedělí třídy podle toho, jak se budou implementovat, ale podle toho, <strong>jaké věci v realitě popisují</strong>. Na vrcholu UFO stojí <em>Type</em>, který se dělí na <strong>Endurant Type</strong> (věci, které existují v čase jako celek – osoba, auto; řeší UFO-A) a <strong>Perdurant Type</strong> (události, které se v čase odehrávají; UFO-B). V této i dalších OntoUML kapitolách řešíme jen endurants.',
          sources: [s('P02', 37), s('P02', 12, 'UFO-A: Strukturální aspekty (entity, vlastnosti, vztahy)')],
        },
        {
          kind: 'p',
          html:
            'První a nejdůležitější rozdělení endurantů je podle <strong>principu identity</strong>:<ul><li><strong>Sortal</strong> – má (nějaký) princip identity, umožňuje tedy <em>referenci</em> („tenhle jeden“) a <em>kvantifikaci</em> („jsou tu tři“). Např. Person, Organisation, Student, Teenager.</li><li><strong>Non-Sortal</strong> – princip identity nemá, sdružuje instance s <em>různými</em> principy identity. Např. Customer (zákazníkem může být osoba i firma), Insurable Item (auto, dům, zdraví…). Podrobně v další kapitole.</li></ul>',
          sources: [
            s('P02', 51, 'Sortal Type = Má (nějaký) princip identity, tj. referenci a kvantifikaci.'),
            s('C03', 6, 'Sortální typy = instance mají vždy jeden a ten samý princip identity'),
            s('C03', 6, 'Non-sortální typy = instance mohou mít různé principy identity'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Horní patra taxonomie UFO',
          diagram: {
            classes: [
              { id: 'type', name: 'Type', st: 'none', x: 1.5, y: 0, abstract: true },
              { id: 'end', name: 'Endurant Type', st: 'none', x: 1, y: 1.3, abstract: true, note: 'UFO-A: strukturální aspekty – věci, vlastnosti, vztahy' },
              { id: 'per', name: 'Perdurant Type', st: 'none', x: 2, y: 1.3, abstract: true, mark: 'dim', note: 'UFO-B: události – v OntoUML části kurzu neřešíme' },
              { id: 'sortal', name: 'Sortal', st: 'none', x: 0.5, y: 2.6, abstract: true, mark: 'focus', note: 'Má princip identity: Person, Organisation, Student, Teenager' },
              { id: 'nonsortal', name: 'NonSortal', st: 'none', x: 1.5, y: 2.6, abstract: true, note: 'Nemá princip identity: Intelligent Entity, Customer, Insurable Item' },
            ],
            gens: [
              { general: 'type', specifics: ['end', 'per'], set: { disjoint: true, complete: true } },
              { general: 'end', specifics: ['sortal', 'nonsortal'], set: { name: 'identita', disjoint: true, complete: true } },
            ],
          },
          caption: 'Každý endurant typ je buď sortál, nebo ne-sortál (disjoint, complete). Tato kapitola = levá větev.',
          sources: [s('P02', 37), s('P02', 51)],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak to poznám: sortál, nebo ne-sortál?',
          html:
            'Pomůcka ze slidů: <strong>představí si každý (zhruba) „tu samou věc“?</strong> U slova <em>Jablko</em> ano – víme, jak jablka počítat a odlišit. U slova <em>Červená věc</em> ne: červené jablko, auto i tričko se rozlišují úplně jinak. Proto je <code>Apple</code> s atributem <code>color = red</code> přirozený model, kdežto třída <code>Red</code> s atributem <code>sort = apple</code> ne.',
          sources: [s('P02', 51, 'pomůcka: představí si každý (zhruba) "tu samou věc"?'), s('P02', 38)],
        },
        {
          kind: 'compare',
          title: 'Apple vs. Red (slide 38)',
          items: [
            {
              label: 'Sortál jako třída',
              verdict: 'good',
              note: 'Jablko má jasný princip identity, barva je jen jeho vlastnost.',
              diagram: { classes: [{ id: 'apple', name: 'Apple', st: 'kind', x: 0, y: 0, attrs: ['color = red'] }] },
            },
            {
              label: 'Ne-sortál jako „druh“',
              verdict: 'bad',
              note: '„Červené věci“ nemají společný způsob, jak je rozlišit a spočítat – třída Red nemůže dávat identitu.',
              diagram: { classes: [{ id: 'red', name: 'Red', st: 'none', x: 0, y: 0, attrs: ['sort = apple'], mark: 'bad' }] },
            },
          ],
          sources: [s('P02', 38)],
        },
        { kind: 'quiz', ids: ['ch03-03'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-2',
      number: '3.2',
      title: 'Princip identity',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: 'Princip identity',
          html:
            'Princip identity říká, podle čeho jsme schopni určitou věc identifikovat jako „onu věc“ a odlišit ji od „tamté věci“ – a to <strong>i v čase</strong>, když se mění. Umožňuje <em>referenci</em> (ukázání na) a <em>kvantifikaci</em> (spočítání). V programování odpovídá definování <strong>ekvivalence</strong>.',
          sources: [
            s('P02', 39, 'Princip identity říká, že určitou věc jsme schopni'),
            s('P02', 39, 'V programování odpovídá definování ekvivalence.'),
          ],
        },
        {
          kind: 'p',
          html:
            'Identita je <strong>intersubjektivní</strong> – je to „dohodnutá konceptualizace“, tedy otázka našeho <strong>vnímání a poznávání</strong>, ne technického identifikátoru. Zrak je pro nás hlavní „rozlišovadlo“, ale věc může projít drastickou vizuální změnou a zůstat sama sebou (a naopak). Klasický paradox: <em>Théseova loď</em> – když postupně vyměníme všechna prkna, je to pořád ta samá loď?',
          sources: [
            s('P02', 39, 'konceptualizaci") -- viz Théseova loď.'),
            s('P02', 58, 'Jedná se opět o identitu z hlediska našeho vnímání'),
          ],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Socha vs. hrouda hlíny (slidy 42–45)',
          html:
            '<ol><li>Hliněná busta <em>X</em>. Odštípne se kousek ramene → busta <em>Y</em>. Je <em>X = Y</em>? <strong>Ano</strong>, je to pořád ta samá socha, jen poškozená.</li><li>Bustu zmačkáme do koule. Je to pořád <em>X</em>? Jako <strong>socha ne</strong> – socha zanikla. Ale jako <strong>hrouda hlíny ano</strong> – je to stále tatáž hlína.</li></ol>Závěr: na „té samé věci“ pracují <strong>dva různé principy identity</strong> (socha se pozná podle tvaru, hlína podle materiálu). Proto <em>Statue</em> a <em>Clay</em> musí být v modelu dva různé druhy, ne jedna třída.',
          sources: [s('P02', 42), s('P02', 43), s('P02', 44), s('P02', 45)],
        },
        {
          kind: 'table',
          caption: 'Další příklady ze slidů „Problematika principu identity“',
          head: ['Situace', 'Stejná věc?', 'Proč'],
          rows: [
            ['Štěně → dospělý pes (slide 40)', 'ano', 'vzhled se změní, identita psa ne'],
            ['Housenka → kukla → motýl (slide 41)', 'ano', 'jeden jedinec řádu Lepidoptera v různých fázích'],
            ['„Software“ (slidy 46–50)', 'záleží na pojmu', 'softwarový <strong>kód</strong> se pozná podle syntaxe, <strong>program</strong> podle chování, <strong>softwarový systém</strong> podle požadavků, <strong>softwarový produkt</strong> podle produktové smlouvy → čtyři různé principy identity'],
          ],
          sources: [s('P02', 40), s('P02', 41, 'Housenka, motýl vs Lepidoptera'), s('P02', 50, 'Softwarový produkt: produktová smlouva')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Chyták z midtermu: identita ≠ ID',
          html:
            'Na otázku „IDENTITA entity v OntoUML“ je správně: <strong>„Identita je dána kognitivním mechanismem – naším vnímáním objektu v realitě.“</strong> Špatně je „identita je dána univerzálním identifikátorem OID“. UUID/OID jednoznačně odkáže na <em>záznam</em>, ale neřekne, zda dva záznamy popisují tutéž věc, ani zda auto po výměně motoru je stále stejné auto – to jsou doménová rozhodnutí. Na začátku analýzy navíc není důležité, <em>jak</em> jedince technicky rozlišíme.',
          sources: [
            s('P02', 82, 'UUID nám umožní jednoznačně odkázat na záznam.'),
            s('P02', 58, 'V tomto pojetí "principu identity" není (minimálně na počátku úvah) důležité, jak jedince'),
            { kind: 'image', src: '/sources/wiki/kom_midterm_2022.png', label: 'Midterm 2022 (FIT Wiki), otázka 8' },
          ],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Každý individuál má právě jednu identitu',
          html: 'Každá instance musí mít <strong>právě jeden</strong> princip identity. Proto každý sortál nese právě jeden princip identity a nemůže mít dva „poskytovatele“ najednou (např. být podtypem dvou různých kindů).',
          sources: [
            s('C03', 6, 'Každá instance (individuál) musí mít právě jednu identitu'),
            s('P02', 59, 'Každý Sortal nese právě jeden princip identity.'),
          ],
        },
        { kind: 'quiz', ids: ['ch03-01', 'ch03-02'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-3',
      number: '3.3',
      title: 'Proměnlivost: modální logika a rigidita',
      blocks: [
        {
          kind: 'p',
          html:
            'Druhá otázka po identitě: <strong>může instance typ „opustit“ a zůstat sama sebou?</strong> K tomu OntoUML používá <strong>modální logiku</strong> – rozšíření predikátové logiky o <em>světy</em>. Svět = jedna možná konfigurace reality v čase a prostoru: dnešek, stav před 30 lety, nebo i hypotetická situace „co kdyby“. Nad světy máme dva operátory:<ul><li><strong>◇ možnost</strong>: platí v <em>některém</em> (alespoň jednom) světě,</li><li><strong>□ nutnost</strong>: platí ve <em>všech</em> světech.</li></ul>',
          sources: [
            s('P02', 52, 'Modální logika je rozšířením predikátové logiky.'),
            s('P02', 52, 'možnost: v některém světě (alespoň jednom) platí, že ...'),
            s('P02', 52, 'nutnost: ve všech světech platí, že ...'),
          ],
        },
        {
          kind: 'table',
          caption: 'Příklady ze slidu 53',
          head: ['Výrok', 'Pravda?', 'Proč'],
          rows: [
            ['<code>◇ Ucitel(robert)</code>', 'pravda', 'Robert je nyní učitelem na FIT – takový svět existuje.'],
            ['<code>□ Ucitel(robert)</code>', 'nepravda', 'Před 30 lety učitelem nebyl – existuje svět, kde to neplatí.'],
            ['<code>□ ∀x ∈ Osoba: Muz(x) ∨ Zena(x)</code>', 'pravda', 'Každá osoba je vždy a všude muž, žena, nebo obojí.'],
          ],
          sources: [s('P02', 53, 'Robert nebyl učitelem před 30 lety, existuje svět kde tvrzení neplatí.')],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Rigidní a anti-rigidní typ',
          html:
            '<ul><li><strong>Rigidní</strong> typ T: je-li <em>x</em> instancí T v nějakém světě, je jeho instancí <strong>nutně – ve všech světech</strong>. Person: „jsem instancí člověka po celý svůj život.“</li><li><strong>Anti-rigidní</strong> typ T: pro <strong>každou</strong> instanci je <strong>možné</strong>, že v nějakém světě instancí T není. Student: nebyl jsem studentem od narození a nebudu jím do konce života.</li></ul>',
          code:
            'R+(T) = □(∀x: T(x) ⇒ □ T(x))        rigidita        (Person)\nR−(T) = □(∀x: T(x) ⇒ ◇ ¬T(x))       anti-rigidita   (Student)\n¬R+(T) = ◇(∃x: T(x) ∧ ◇ ¬T(x))      non-rigidita = negace rigidity\nR~(T) = ¬R+(T) ∧ ¬R−(T)             semi-rigidita',
          lang: 'text',
          sources: [
            s('P02', 54, 'Rigidita = neměnnost, neschopnost přizpůsobit se změnám'),
            s('P02', 55),
            s('C03', 8, 'Jsem instancí člověka po celý svůj život.'),
            s('P03', 18),
          ],
        },
        {
          kind: 'table',
          caption: 'Tři druhy rigidity – rozhoduje, co platí pro VŠECHNY instance',
          head: ['Rigidita', 'Pro instance platí', 'Stereotypy'],
          rows: [
            ['<strong>rigidní</strong>', 'všechny instance jsou instancemi nutně (nemohou typ opustit)', '<span class="st">«kind»</span> <span class="st">«subkind»</span> (a <span class="st">«category»</span>)'],
            ['<strong>anti-rigidní</strong>', 'každá instance typ může opustit', '<span class="st">«role»</span> <span class="st">«phase»</span> (a <span class="st">«roleMixin»</span> <span class="st">«phaseMixin»</span>)'],
            ['<strong>semi-rigidní</strong>', 'pro některé instance nutné, pro jiné jen možné', '<span class="st">«mixin»</span> (kap. 4)'],
          ],
          sources: [s('P03', 18), s('P03', 19, 'Mixin jsou semi-rigidní non-sortály')],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Anti-rigidita NENÍ negace rigidity',
          html:
            'Negací rigidity je <strong>non-rigidita</strong> (¬R+): stačí, že <em>aspoň jedna</em> instance může typ opustit. Anti-rigidita je <strong>silnější</strong> – musí to jít u <em>každé</em> instance. Mezi nimi leží <strong>semi-rigidita</strong> = ani rigidní, ani anti-rigidní.',
          sources: [s('P03', 18, 'je logickou negací rigidity.'), s('P03', 18, 'je to "silnější" tvrzení.')],
        },
        {
          kind: 'diagram',
          title: 'Sortály podle rigidity',
          diagram: {
            classes: [
              { id: 'sortal', name: 'Sortal', st: 'none', x: 0.5, y: 0, abstract: true },
              { id: 'rigid', name: 'RigidSortal', st: 'none', x: 0, y: 1.3, abstract: true, note: 'Person, Organisation – instance typ nikdy neopustí' },
              { id: 'anti', name: 'AntiRigidSortal', st: 'none', x: 1, y: 1.3, abstract: true, note: 'Student, Teenager – instance typ opustit může' },
            ],
            gens: [{ general: 'sortal', specifics: ['rigid', 'anti'], set: { name: 'rigidita', disjoint: true, complete: true } }],
          },
          sources: [s('P02', 56)],
        },
        {
          kind: 'interactive',
          component: 'rigidity-timeline',
          title: 'Jedna osoba v různých světech',
          hint: 'Posouvej se v čase: «kind» Person platí pořád, «phase» (Child → Teenager → Adult) a «role» Student se mění. Přesně to je rozdíl mezi rigidním a anti-rigidním typem.',
        },
        {
          kind: 'callout',
          type: 'past',
          title: '„Když někdo zůstane studentem celý život…“',
          html:
            '…je Student pořád <strong>anti-rigidní</strong>. Rozhoduje <strong>možnost</strong> změny (◇), ne to, jestli ke změně skutečně dojde. Daný člověk může přestat být studentem a zůstat týmž člověkem – to stačí.',
          sources: [s('P02', 83, 'Rozhodujeme podle možnosti změny, nikoli')],
        },
        { kind: 'quiz', ids: ['ch03-04', 'ch03-06', 'ch03-05'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-4',
      number: '3.4',
      title: 'Rigidní sortály: «kind» a «subkind»',
      blocks: [
        {
          kind: 'p',
          html:
            'Oba jsou <strong>rigidní sortály</strong>. UML je nerozlišuje, OntoUML ano – rozdíl je v identitě:<ul><li><span class="st">«kind»</span> <strong>poskytuje</strong> identitu (Person, Organisation, Car). Je to „nejvyšší“ sortál.</li><li><span class="st">«subkind»</span> identitu <strong>neposkytuje</strong>, jen ji <strong>dědí</strong> od kindu (Man, Woman, Brazilec…). Lidi rozlišujeme stejně, ať jsou to muži, nebo ženy.</li></ul>',
          sources: [
            s('P02', 58, 'Kind poskytuje ontologickou identitu, zatímco SubKind nikoliv.'),
            s('C03', 9, 'Kind (druh) je rigidní sortál poskytující identitu'),
            s('C03', 9, 'SubKind (poddruh) je rigidní sortál neposkytující identitu'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Kind a subkind',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0.5, y: 0, note: 'Poskytuje identitu: víme, jak rozlišit dva lidi.' },
              { id: 'man', name: 'Man', st: 'subkind', x: 0, y: 1.3, note: 'Rigidní: muž je mužem ve všech světech (biologické pohlaví). Identitu dědí od Person.' },
              { id: 'woman', name: 'Woman', st: 'subkind', x: 1, y: 1.3, note: 'Rigidní, identitu dědí od Person.' },
            ],
            gens: [{ general: 'person', specifics: ['man', 'woman'], set: { disjoint: true, complete: true } }],
          },
          caption: 'Subkind je rigidní specializace kindu – instance ji nikdy neopustí.',
          sources: [s('P02', 65), s('P02', 57)],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Pravidla sortálů (slide 59) – na testu se ptají pořád',
          html:
            '<ol><li>Každý sortál nese <strong>právě jeden</strong> princip identity.</li><li><span class="st">«kind»</span> poskytuje identitu a <strong>nemůže být podtypem jiného sortálu</strong> (nad ním smí být jen ne-sortál: <span class="st">«category»</span>, <span class="st">«mixin»</span>).</li><li><span class="st">«subkind»</span>, <span class="st">«role»</span> a <span class="st">«phase»</span> dědí identitu přímo či nepřímo od <strong>právě jednoho poskytovatele identity</strong>. Cestou mohou mít více rigidních předků.</li><li><strong>Anti-rigidní typ nemůže být nadtypem rigidního typu.</strong></li><li><strong>Ne-sortál nemůže být podtypem sortálu.</strong></li></ol>',
          sources: [
            s('P02', 59, 'Kind poskytuje identitu a nemůže být podtypem jiného sortálu.'),
            s('P02', 59, 'SubKind, Role a Phase dědí identitu přímo či nepřímo od právě jednoho poskytovatele'),
            s('P02', 59, 'Anti-rigidní typ nemůže být nadtypem rigidního typu.'),
            s('P02', 59, 'Non-Sortal nemůže být podtypem sortálu.'),
            wKind,
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Kind není jediný poskytovatel identity',
          html:
            'Identitu poskytují také <span class="st">«relator»</span>, <span class="st">«collective»</span>, <span class="st">«quantity»</span>, <span class="st">«mode»</span> a <span class="st">«quality»</span> (přednášky 3–4). Subkind tedy může specializovat i třeba collective – pravidlo zní „právě jeden poskytovatel identity“, ne „právě jeden kind“.',
          sources: [s('P02', 59, 'Pozn.: Kind není jediný poskytovatel identity.'), wSubkind],
        },
        {
          kind: 'compare',
          title: 'Typické chyby s kind/subkind',
          items: [
            {
              label: 'Kind pod kindem',
              verdict: 'bad',
              note: 'Man a Woman by poskytovaly vlastní identitu a zároveň dědily identitu Person → dva principy identity. Kind nesmí být podtypem sortálu.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'm', name: 'Man', st: 'kind', x: 0, y: 1.3, mark: 'bad' },
                  { id: 'w', name: 'Woman', st: 'kind', x: 1, y: 1.3, mark: 'bad' },
                ],
                gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
              },
            },
            {
              label: 'Subkind bez poskytovatele identity',
              verdict: 'bad',
              note: 'Subkind identitu neposkytuje – bez kindu nad sebou nemá odkud ji zdědit.',
              diagram: {
                classes: [
                  { id: 'm', name: 'Man', st: 'subkind', x: 0, y: 0, mark: 'bad' },
                  { id: 'w', name: 'Woman', st: 'subkind', x: 1, y: 0, mark: 'bad' },
                ],
              },
            },
            {
              label: 'Správně',
              verdict: 'good',
              note: 'Jeden kind poskytuje identitu, subkindy ji dědí.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'm', name: 'Man', st: 'subkind', x: 0, y: 1.3, mark: 'good' },
                  { id: 'w', name: 'Woman', st: 'subkind', x: 1, y: 1.3, mark: 'good' },
                ],
                gens: [{ general: 'p', specifics: ['m', 'w'], set: { disjoint: true, complete: true } }],
              },
            },
          ],
          sources: [s('P02', 59), wKind, wSubkind],
        },
        {
          kind: 'p',
          html:
            'Kindy rozdělují svět na <strong>disjunktní oblasti</strong> (K1…K5 na slidu 75): každý individuál patří <strong>právě jednomu</strong> kindu, a ten mu určuje identitu. Subkindy jsou pevné podoblasti uvnitř jednoho kindu.',
          sources: [s('P02', 75)],
        },
        { kind: 'quiz', ids: ['ch03-07', 'ch03-08', 'ch03-18'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-5',
      number: '3.5',
      title: 'Anti-rigidní sortál «phase»',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: '«phase»',
          html:
            'Anti-rigidní specializace, jejíž podmínka je <strong>intrinsická (vlastní, vnitřní)</strong> – závisí jen na vlastnostech instance samotné (věk, živý/mrtvý, nový/rozbitý). Nad fázemi vždy existuje rozdělení: <strong>Phase Partition</strong>, a to je vždy <code>{disjoint, complete}</code>.',
          sources: [
            s('P02', 61, 'Anti-rigidní specializace taková, že podmínka specializace je intrinsická'),
            s('P02', 61, 'Nad fázemi vždy existuje rozdělení: Phase Partition.'),
            s('C03', 11, 'Vyjadřuje ryze vnitřní vlastnosti, které se v čase mění'),
          ],
        },
        {
          kind: 'p',
          html:
            'Proč <code>disjoint</code> a <code>complete</code>? <strong>complete</strong> = každá osoba je v každém světě v <em>nějaké</em> fázi; <strong>disjoint</strong> = nikdy ve dvou najednou. V průběhu „života“ instance mezi fázemi jen přechází: ve světě <em>W</em> je osoba LivingPerson, ve světě <em>W′</em> už DeceasedPerson – a pořád je to tatáž Person.',
          sources: [s('P02', 62), s('P02', 63), s('P02', 64)],
        },
        {
          kind: 'diagram',
          title: 'Návrhový vzor «phase»: Person → Child / Teenager / Adult',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0, attrs: ['birthDate: Date'], note: 'Rigidní poskytovatel identity. Fáze se počítají z jeho vnitřní vlastnosti (věku).' },
              { id: 'child', name: 'Child', st: 'phase', x: 0, y: 1.3, note: 'věk < 13 – intrinsická podmínka, žádný vztah k ničemu jinému' },
              { id: 'teen', name: 'Teenager', st: 'phase', x: 1, y: 1.3, note: 'věk 13–19' },
              { id: 'adult', name: 'Adult', st: 'phase', x: 2, y: 1.3, note: 'věk ≥ 20' },
            ],
            gens: [{ general: 'person', specifics: ['child', 'teen', 'adult'], set: { name: 'věk', disjoint: true, complete: true } }],
            steps: [
              { label: 'Začni rigidním sortálem, který dává identitu: «kind» Person.', add: ['person'] },
              { label: 'Přidej první fázi – Child. Podmínka (věk) je vnitřní vlastnost osoby → «phase», ne «role».', add: ['child'] },
              { label: 'Doplň zbylé fáze tak, aby pokryly VŠECHNY osoby a nepřekrývaly se: generalization set {disjoint, complete}.', add: ['teen', 'adult'] },
            ],
          },
          caption: 'Vzor ze slidu 68: «kind» A → … → {disjoint, complete} «phase» P1 … Pn. Hranice věku jsou jen ilustrační.',
          sources: [s('P02', 68), wPhase],
        },
        {
          kind: 'diagram',
          title: 'Subkindy a fáze na jednom kindu (slide 65)',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 1.3, y: 0 },
              { id: 'man', name: 'Man', st: 'subkind', x: 0, y: -0.35, note: 'rigidní – nemění se' },
              { id: 'woman', name: 'Woman', st: 'subkind', x: 0, y: 0.35, note: 'rigidní – nemění se' },
              { id: 'living', name: 'LivingPerson', st: 'phase', x: 0.7, y: 1.3, note: 'anti-rigidní – osoba může zemřít' },
              { id: 'dead', name: 'DeceasedPerson', st: 'phase', x: 1.9, y: 1.3, note: 'anti-rigidní' },
            ],
            gens: [
              { general: 'person', specifics: ['man', 'woman'], set: { name: 'pohlaví', disjoint: true, complete: true } },
              { general: 'person', specifics: ['living', 'dead'], set: { name: 'život', disjoint: true, complete: true } },
            ],
          },
          caption: 'Dva nezávislé generalization sety, oba {disjoint, complete}: pohlaví (Man/Woman, vlevo) a život (fáze, dole). Jedna instance je současně např. Man a LivingPerson; později Man a DeceasedPerson.',
          sources: [s('P02', 65), s('P02', 66), s('P02', 67)],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Instance v OntoUML ≠ objekt v UML',
          html:
            'V UML má objekt jednu třídu na celý život. V OntoUML <strong>vazba třída–instance není 1:1</strong>: jedna instance je zároveň instancí Person, Man i LivingPerson a během své existence mění anti-rigidní třídy (fáze, role). Rigidní (Person, Man) nikdy.',
          sources: [s('P02', 17, 'na rozdíl od UML ale není vazba třída-instance 1:1'), s('P02', 65, 'Pozor: rozdíl v chápání instancí UML vs OntoUML')],
        },
        {
          kind: 'compare',
          title: 'Phase partition musí být disjoint i complete',
          items: [
            {
              label: 'Jen {disjoint}',
              verdict: 'bad',
              note: 'Osoba starší 19 let by nebyla v žádné fázi – partition není úplná.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'c', name: 'Child', st: 'phase', x: 0, y: 1.3 },
                  { id: 't', name: 'Teenager', st: 'phase', x: 1, y: 1.3 },
                ],
                gens: [{ general: 'p', specifics: ['c', 't'], set: { disjoint: true }, mark: 'bad' }],
              },
            },
            {
              label: '{disjoint, complete}',
              verdict: 'good',
              note: 'Každá osoba je v každém okamžiku právě v jedné fázi.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0.5, y: 0 },
                  { id: 'c', name: 'Child', st: 'phase', x: 0, y: 1.3 },
                  { id: 'a', name: 'Adult', st: 'phase', x: 1, y: 1.3 },
                ],
                gens: [{ general: 'p', specifics: ['c', 'a'], set: { disjoint: true, complete: true }, mark: 'good' }],
              },
            },
          ],
          sources: [s('P02', 61), wPhase],
        },
        { kind: 'quiz', ids: ['ch03-11', 'ch03-15'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-6',
      number: '3.6',
      title: 'Anti-rigidní sortál «role»',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          title: '«role»',
          html:
            'Anti-rigidní specializace, jejíž podmínka je <strong>vnější</strong> – instance je v roli kvůli <strong>vztahu k jiné entitě</strong> (Student kvůli škole, Husband kvůli manželství). Role podléhá <strong>relační závislosti</strong>: musí mít povinný vztah (min. multiplicita ≥ 1, může být zděděný).',
          code: 'D+(T, P, R) = □(∀x: T(x) ⇒ ∃y: P(y) ∧ R(x, y))\nD+(Student, School, enrolledAt): každý student je zapsán na nějaké škole',
          lang: 'text',
          sources: [
            s('P02', 69, 'Anti-rigidní specializace taková, že podmínka specializace je vnější.'),
            s('P02', 69, 'Role podléhá relační závislosti (musí mít povinný vztah).'),
            s('C03', 11, 'Musí mít povinný vztah, alespoň 1 (může být zděděný)'),
          ],
        },
        {
          kind: 'diagram',
          title: 'Návrhový vzor «role»: Person → Student + vztah s min. 1',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0, note: 'Rigidní poskytovatel identity – Student ji dědí.' },
              { id: 'student', name: 'Student', st: 'role', x: 0, y: 1.3, note: 'Anti-rigidní: Student může přestat studovat a zůstane stejnou osobou.' },
              { id: 'uni', name: 'University', st: 'kind', x: 1.5, y: 1.3 },
            ],
            gens: [{ general: 'person', specifics: ['student'] }],
            assocs: [
              { id: 'enr', from: 'student', to: 'uni', name: 'enrolled at', fromMult: '1..*', toMult: '1..*', mark: 'focus' },
            ],
            steps: [
              { label: 'Role musí mít nad sebou (nepřímo) poskytovatele identity – «kind» Person.', add: ['person'] },
              { label: 'Přidej «role» Student pod Person. Zatím chybí důvod, proč je někdo studentem.', add: ['student'] },
              { label: 'Doplň vnější entitu a vztah, na kterém role závisí. Multiplicita u University musí být m..n s m ≥ 1.', add: ['uni'] },
            ],
          },
          caption: 'Vzor ze slidu 74: «kind» A → … → «role» B, vztah k C s multiplicitou m..n, kde m ≥ 1.',
          sources: [s('P02', 74), s('P02', 70), s('C03', 13)],
        },
        {
          kind: 'p',
          html:
            'Ve světě <em>W</em> je osoba zapsaná na škole → je Student. Ve světě <em>W′</em> zápis skončil → osoba už Student není, ale je to pořád tatáž Person. Ve světě <em>W″</em> může být zapsaná i na dvou školách (proto <code>1..*</code>).',
          sources: [s('P02', 70), s('P02', 71), s('P02', 72)],
        },
        {
          kind: 'compare',
          title: 'Role – časté chyby (slide 73)',
          items: [
            {
              label: 'Role bez nadtypu',
              verdict: 'bad',
              note: 'Role identitu neposkytuje – musí specializovat rigidní sortál (poskytovatele identity).',
              diagram: { classes: [{ id: 's', name: 'Student', st: 'role', x: 0, y: 0, mark: 'bad' }] },
            },
            {
              label: 'Obrácená generalizace',
              verdict: 'bad',
              note: 'Anti-rigidní typ nemůže být nadtypem rigidního: kdyby osoba přestala být studentem, musela by přestat být osobou.',
              diagram: {
                classes: [
                  { id: 's', name: 'Student', st: 'role', x: 0, y: 0 },
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 1.3 },
                ],
                gens: [{ general: 's', specifics: ['p'], mark: 'bad' }],
              },
            },
            {
              label: 'Nepovinný vztah 0..n',
              verdict: 'bad',
              note: 'Se spodní mezí 0 nemá role relační závislost – Student by mohl existovat bez školy.',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 's', name: 'Student', st: 'role', x: 0, y: 1.3 },
                  { id: 'e', name: 'School', st: 'kind', x: 1.5, y: 1.3 },
                ],
                gens: [{ general: 'p', specifics: ['s'] }],
                assocs: [{ from: 's', to: 'e', name: 'enrolled at', toMult: '0..*', mark: 'bad' }],
              },
            },
            {
              label: 'Správně',
              verdict: 'good',
              note: 'Kind nad rolí + povinný vztah (min. 1).',
              diagram: {
                classes: [
                  { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
                  { id: 's', name: 'Student', st: 'role', x: 0, y: 1.3 },
                  { id: 'e', name: 'School', st: 'kind', x: 1.5, y: 1.3 },
                ],
                gens: [{ general: 'p', specifics: ['s'] }],
                assocs: [{ from: 's', to: 'e', name: 'enrolled at', toMult: '1..*', mark: 'good' }],
              },
            },
          ],
          sources: [s('P02', 73), wRole],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Jak to poznám: «role», nebo «phase»?',
          html:
            'Obojí je anti-rigidní a obojí „může skončit“ – to k rozhodnutí <strong>nestačí</strong>. Rozhoduje <strong>důvod klasifikace</strong>:<ul><li>platí to kvůli <strong>vztahu</strong> k něčemu jinému (škola, manželka, zaměstnavatel)? → <span class="st">«role»</span> (Student, Husband, Employee),</li><li>platí to kvůli <strong>vlastní vnitřní vlastnosti</strong> (věk, stav)? → <span class="st">«phase»</span> (Child, Teenager, LivingPerson).</li></ul>',
          sources: [s('P02', 84, 'Rozhodující je důvod klasifikace.'), s('P02', 60)],
        },
        {
          kind: 'diagram',
          title: 'Náhled dopředu: vztah role přes relátor',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 0, y: 0 },
              { id: 'student', name: 'Student', st: 'role', x: 0, y: 1.3 },
              { id: 'enr', name: 'Enrollment', st: 'relator', x: 1.5, y: 1.3, note: 'Zápis – relátor „zhmotňuje“ vztah studenta a univerzity (kap. 4).' },
              { id: 'uni', name: 'University', st: 'kind', x: 3, y: 1.3 },
            ],
            gens: [{ general: 'person', specifics: ['student'] }],
            assocs: [
              { from: 'enr', to: 'student', st: 'mediation', fromMult: '1..*', toMult: '1' },
              { from: 'enr', to: 'uni', st: 'mediation', fromMult: '0..*', toMult: '1' },
            ],
          },
          caption: 'V plném OntoUML se povinný vztah role obvykle modeluje přes «relator» a «mediation» – relační závislost pak zajišťuje multiplicita 1..* u Enrollment.',
          sources: [s('C03', 11, 'Vždy závisí na další entitě – jsou to relačně závislé typy')],
        },
        { kind: 'quiz', ids: ['ch03-12', 'ch03-14', 'ch03-13'] },
      ],
    },
    // -----------------------------------------------------------------------
    {
      id: 'sec-3-7',
      number: '3.7',
      title: 'Shrnutí sortálních typů',
      blocks: [
        {
          kind: 'diagram',
          title: 'Taxonomie sortálů (slide 78)',
          diagram: {
            classes: [
              { id: 'sortal', name: 'Sortal', st: 'none', x: 1.5, y: 0, abstract: true, note: 'nese identitu' },
              { id: 'rigid', name: 'RigidSortal', st: 'none', x: 0.5, y: 1.3, abstract: true, note: 'rigidní' },
              { id: 'anti', name: 'AntiRigidSortal', st: 'none', x: 2.5, y: 1.3, abstract: true, note: 'anti-rigidní' },
              { id: 'kind', name: 'Kind', st: 'none', x: 0, y: 2.6, mark: 'focus', note: 'poskytuje identitu (UltimateSortal); Person, Organisation' },
              { id: 'sub', name: 'Subkind', st: 'none', x: 1, y: 2.6, note: 'identitu dědí; Biological Man, Biological Woman' },
              { id: 'role', name: 'Role', st: 'none', x: 2, y: 2.6, note: 'relačně závislá; Student, Husband' },
              { id: 'phase', name: 'Phase', st: 'none', x: 3, y: 2.6, note: 'relačně nezávislá, intrinsická; Teenager, LivingPerson' },
            ],
            gens: [
              { general: 'sortal', specifics: ['rigid', 'anti'], set: { name: 'rigidita', disjoint: true, complete: true } },
              { general: 'rigid', specifics: ['kind', 'sub'], set: { name: 'identita', disjoint: true, complete: true } },
              { general: 'anti', specifics: ['role', 'phase'], set: { name: 'relační závislost', disjoint: true, complete: true } },
            ],
          },
          caption: 'Tři otázky = tři úrovně stromu: nese identitu? je rigidní? poskytuje identitu / je relačně závislý?',
          sources: [s('P02', 60), s('P02', 78)],
        },
        {
          kind: 'table',
          caption: 'Shrnutí: tabulka sortálních typů (slide 79)',
          head: ['Stereotyp', 'Poskytuje identitu', 'Nese identitu', 'Rigidita', 'Relační závislost', 'Příklad'],
          rows: [
            ['SORTÁL (obecně)', '−', '+', '', '', ''],
            ['<span class="st">«kind»</span>', '<strong>+</strong>', '+', 'rigidní', '−', 'Person, Organisation'],
            ['<span class="st">«subkind»</span>', '−', '+', 'rigidní', '−', 'Man, Woman'],
            ['<span class="st">«role»</span>', '−', '+', 'anti-rigidní', '<strong>+</strong>', 'Student, Husband'],
            ['<span class="st">«phase»</span>', '−', '+', 'anti-rigidní', '−', 'Child, LivingPerson'],
            ['NON-SORTÁL', '−', '−', '', '', 'Customer, Insurable Item'],
          ],
          sources: [s('P02', 79)],
        },
        {
          kind: 'p',
          html:
            'Obrazově (slidy 75–77): kindy rozřežou svět na disjunktní oblasti K1…K5. <strong>Role a fáze</strong> jsou „ostrůvky“ <strong>uvnitř jednoho kindu</strong> – instance do nich vstupují a zase je opouštějí, ale nikdy nepřekročí hranici svého kindu.',
          sources: [s('P02', 75), s('P02', 76), s('P02', 77)],
        },
        {
          kind: 'diagram',
          title: 'Vše dohromady',
          diagram: {
            classes: [
              { id: 'person', name: 'Person', st: 'kind', x: 1.4, y: 0 },
              { id: 'man', name: 'Man', st: 'subkind', x: 0, y: -0.35 },
              { id: 'woman', name: 'Woman', st: 'subkind', x: 0, y: 0.35 },
              { id: 'child', name: 'Child', st: 'phase', x: 0.8, y: 1.3 },
              { id: 'adult', name: 'Adult', st: 'phase', x: 2, y: 1.3 },
              { id: 'student', name: 'Student', st: 'role', x: 3, y: 0, note: 'Role může být i podtypem fáze (např. Adult); tady stačí přímo pod Person.' },
              { id: 'school', name: 'School', st: 'kind', x: 3, y: 1.3 },
            ],
            gens: [
              { general: 'person', specifics: ['man', 'woman'], set: { disjoint: true, complete: true } },
              { general: 'person', specifics: ['child', 'adult'], set: { name: 'věk', disjoint: true, complete: true } },
              { general: 'person', specifics: ['student'] },
            ],
            assocs: [{ from: 'student', to: 'school', name: 'enrolled at', toMult: '1..*', fromMult: '1..*' }],
          },
          caption: 'Jedna Person může být najednou Woman (rigidně), Adult (fáze) a Student (role).',
          sources: [s('P02', 65), s('P02', 70)],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Co si odnést',
          html:
            '<ul><li>Hlavní klíč dělení je <strong>identita</strong> (reference a kvantifikace) – obdoba ekvivalence v programování.</li><li>Modální logika odlišuje <strong>neměnné (rigid)</strong> a <strong>měnící se (anti-rigid)</strong> typy.</li><li>Kind ⟶ jediný poskytovatel identity mezi sortály této kapitoly; nad ním jen ne-sortály.</li><li>Anti-rigidní nad rigidním nikdy. Ne-sortál pod sortálem nikdy.</li><li>Phase = vnitřní podmínka + {disjoint, complete}. Role = vnější podmínka + povinný vztah (min ≥ 1).</li></ul>',
          sources: [
            s('P02', 80, 'Hlavním klíčem dělení je ontologická identita'),
            s('P02', 80, 'OntoUML pracuje v modální logice, kterou používá na rozlišování neměnných (Rigid) a'),
          ],
        },
        {
          kind: 'interactive',
          component: 'stereotype-tree',
          title: 'Rozhodovací strom: který stereotyp?',
          hint: 'Odpověz na otázky „Má identitu? Poskytuje ji? Je rigidní? Je relačně závislý?“ pro Person, Man, Student, Teenager – a zkus i Customer.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: '„Můžeme mít se spolužákem dva různé modely a oba správně?“',
          html:
            '<strong>Ano</strong> – stejnou doménu lze modelovat pro různé účely a s různou podrobností. Rozdíly ale musíš obhájit definicemi, předpoklady a otázkami, na které má model odpovídat. „Každý to vidí jinak“ neospravedlňuje vnitřní rozpor (např. Student nad Person).',
          sources: [s('P02', 81, 'Ano: stejnou doménu lze modelovat pro různé účely a s různou podrobností.')],
        },
        { kind: 'quiz', ids: ['ch03-10', 'ch03-09', 'ch03-16'] },
      ],
    },
  ],
}
