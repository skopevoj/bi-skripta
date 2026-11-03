import type { Question, SourceRef } from '../types'

const P01 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P01', page, quote })
const P02 = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'P02', page, quote })
const W = (page: number, quote?: string): SourceRef => ({ kind: 'slide', doc: 'W-suhrn', page, quote })

export const ch01: Question[] = [
  {
    id: 'ch01-01',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P01, slide 6 (definice Mylopoulos)', why: 'Základní definice předmětu – typická úvodní otázka.' },
    prompt: 'Konceptuální modelování je podle definice z přednášky činnost, která:',
    options: [
      'popisuje aspekty fyzického a sociálního světa za účelem porozumění a komunikace',
      'převádí požadavky na databázové schéma a zdrojový kód',
      'optimalizuje výkon informačního systému',
      'vytváří grafické uživatelské rozhraní podle požadavků zákazníka',
      'dokazuje matematickou správnost softwaru',
    ],
    correct: [0],
    explanation:
      'Mylopoulos: konceptuální modelování popisuje aspekty <strong>fyzického a sociálního světa</strong> za účelem <strong>porozumění a komunikace</strong> mezi lidmi. Databázové schéma, kód a UI jsou až implementační modely. Správnost modelu nelze dokázat experimentem ani formálně – validuje se s doménovým expertem.',
    verified: 'slides',
    sources: [P01(6, 'Konceptuální modelování je činnost popisující aspekty')],
  },
  {
    id: 'ch01-02',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'real', seen: ['Přednáška 1, Časté otázky'] },
    prompt: '„Proč mám dělat konceptuální model, když už mám databázové schéma?“ Vyberte správné odpovědi.',
    options: [
      'Databázové schéma zachycuje způsob uložení dat, ale nemusí vysvětlovat jejich doménový význam.',
      'Konceptuální model vyjasní, co pojem (např. Customer) v doméně skutečně znamená.',
      'Konceptuální model je jen jiný zápis téhož schématu, takže nepřináší nic nového.',
      'Databázové schéma neobsahuje žádný ontologický závazek.',
      'Z konceptuálního modelu lze databázové schéma (i jiné implementační modely) odvodit transformací.',
    ],
    correct: [0, 1, 4],
    explanation:
      'Tabulka <code>Customer</code> sama neřekne, zda jde o registrovaného zájemce, současného nájemce, nebo kohokoli, kdo kdy nakoupil – to vyjasní konceptuální model. Ten se pak dá transformovat na relační či objektový model. Každý popis reality (i schéma) nese ontologický závazek, jen často skrytý.',
    verified: 'slides',
    sources: [
      P01(62, 'Databázové schéma zachycuje způsob uložení dat, ale nemusí vysvětlovat jejich doménový'),
      P01(61, 'Každý popis reality vytváří ontologický závazek (zachycuje určitý pohled na svět).'),
      P02(10),
    ],
  },
  {
    id: 'ch01-03',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'FIT Wiki souhrn: pořadí činností; P01 slide 4', why: 'Souhrn ze zkoušky uvádí pořadí činností jako zapamatovatelný fakt.' },
    prompt: 'Jaké je správné pořadí činností při vytváření business informačního systému?',
    options: [
      'analýza business dat, procesů a uživatelů → konceptuální model → implementační model → implementace',
      'analýza business dat, procesů a uživatelů → implementační model → konceptuální model → implementace',
      'konceptuální model → analýza business dat, procesů a uživatelů → implementace → implementační model',
      'implementace → implementační model → konceptuální model',
    ],
    correct: [0],
    explanation:
      'Nejdřív porozumíme doméně (analýza), z ní vznikne <strong>konceptuální</strong> model (nezávislý na technologii), ten se transformuje na <strong>implementační</strong> model (relační, objektový…) a teprve pak se implementuje.',
    verified: 'slides',
    sources: [W(1, 'Pořadí činností při vytváření business informačního systému'), P01(4)],
  },
  {
    id: 'ch01-04',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P01, slide 43 (Typy ontologií)', why: 'Rozlišení fundamentální / doménové / jádrové ontologie.' },
    prompt: 'Unified Foundational Ontology (UFO) je příkladem:',
    options: [
      'fundamentální (vyšší, upper) ontologie',
      'doménové ontologie',
      'jádrové (referenční) ontologie konkrétního odvětví',
      'databázového schématu',
      'implementačního modelu',
    ],
    correct: [0],
    explanation:
      'UFO definuje doménově a aplikačně <strong>nezávislé</strong> koncepty a vztahy – je to fundamentální (upper / foundational) ontologie. Doménová ontologie popisuje konkrétní oblast (např. těžbu ropy), jádrová/referenční má klíčový význam pro odvětví (např. Legal Core Ontology).',
    verified: 'slides',
    sources: [P01(43, 'Doménové ontologie: ontologie popisující určitou doménu (oblast), např. těžbu ropy.'), P01(43)],
  },
  {
    id: 'ch01-05',
    kind: 'tf',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P01, slide 12', why: 'Citát ze slidu se dobře převrací na chyták.' },
    prompt: 'Opakem ontologie je ne-ontologie: model, který nenese žádný ontologický závazek.',
    answer: false,
    explanation:
      'Podle přednášky „opakem ontologie není ne-ontologie, ale <strong>špatná ontologie</strong>“. Každý popis reality vytváří ontologický závazek – otázka je jen, zda je explicitní a dobrý.',
    verified: 'slides',
    sources: [
      P01(12, 'Opakem ontologie není ne-ontologie, ale špatná ontologie!'),
      P01(61, 'Každý popis reality vytváří ontologický závazek (zachycuje určitý pohled na svět).'),
    ],
  },
  {
    id: 'ch01-06',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'real', seen: ['Midterm 2022 (FIT Wiki)'] },
    prompt: 'MODULARIZACI DOMÉNY využíváme, abychom:',
    options: [
      'zjednodušili doménu.',
      'namapovali doménu na softwarové moduly.',
      'Žádná z nabízených možností není správná.',
      'rozdělili doménu na nezávislé moduly.',
      'se vypořádali se složitostí a komplexností domény.',
      'překonali mezeru mezi business a softwarem.',
    ],
    correct: [4],
    explanation:
      'Modularizace se použije, když je doména <strong>příliš komplexní</strong>: vytvoříme více subontologií pro různé (ideálně ortogonální) aspekty. Doménu nezjednodušujeme (modelujeme ji celou), nejde o softwarové moduly a subontologie nejsou nezávislé – stojí na společném základu a navzájem se používají. Mezeru business ↔ software překlenuje konceptuální model obecně, ne modularizace.',
    verified: 'slides',
    sources: [
      P02(7, 'Pokud je doména příliš komplexní, použijeme techniku modularizace domény: vytvoříme'),
      P02(8),
      W(1, 'Modularizaci domény využíváme abychom se vypořádali se složitostí a komplexností domény.'),
      { kind: 'wiki', label: 'FIT Wiki: BI-KOM midterm 2022 (screenshot)' },
    ],
  },
  {
    id: 'ch01-07',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P02, slide 9 (Kontrola modelu)', why: 'Verifikace × validace se snadno zamění.' },
    prompt: '<strong>Validace</strong> konceptuálního modelu znamená:',
    options: [
      'kontrolu syntaktické správnosti modelu („model je správný“)',
      'ověření se zadavatelem (doménovým expertem), že v modelu jsou správné věci',
      'transformaci modelu na implementační model',
      'automatický důkaz, že model je bezchybný',
      'vytvoření slovníku pojmů domény',
    ],
    correct: [1],
    explanation:
      '<strong>Validace</strong> = se zadavatelem / doménovým expertem, „v modelu jsou správné věci“. <strong>Verifikace</strong> = kontrola syntaktické správnosti, „model je správný“ (umí ji i nástroj). Slovník pojmů je krok modelování, transformace je samostatný krok. Ani anti-vzory nejsou automatický důkaz chyby.',
    verified: 'slides',
    sources: [
      P02(9, 'Verifikace modelu: kontrola syntaktické správnosti'),
      P02(9, 'Validace modelu se zadavatelem (doménový expert)'),
      P01(33, 'Sémantická analýza anti-vzorů odhalí potenciálně nezamýšlenou strukturu a vyzve'),
    ],
  },
  {
    id: 'ch01-08',
    kind: 'tf',
    topic: 'km',
    origin: { type: 'real', seen: ['Přednáška 2, Časté otázky'] },
    prompt: 'Pro jednu doménu mohou existovat dva různé konceptuální modely, které jsou oba správné.',
    answer: true,
    explanation:
      'Ano – stejnou doménu lze modelovat pro různé <strong>účely</strong> a s různou podrobností („vícero správných ontologií pro jednu doménu“). Rozdíly ale musí jít obhájit definicemi, předpoklady a otázkami, na které má model odpovídat; vnitřní rozpor omluvit nelze.',
    verified: 'slides',
    sources: [
      P02(81, 'Můžeme mít se spolužákem dva různé modely a oba správně?'),
      P02(7, 'Klíčový aspekt, jelikož vícero (správných!) ontologií může být vytvořeno pro jednu'),
    ],
  },
  {
    id: 'ch01-09',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P02, slides 7–10 (Postup konceptuální analýzy)', why: 'Přiřazení činností ke krokům postupu.' },
    prompt: 'Které činnosti patří do prvního kroku konceptuální analýzy – <em>Identifikace účelu a cíle</em>?',
    options: [
      'vymezení rozsahu, cíle a aplikace ontologie (kompetence ontologie)',
      'identifikace otázek, na které chceme znát odpovědi',
      'případná modularizace příliš komplexní domény',
      'vytváření ontologie na základě ontologických vzorů',
      'verifikace syntaktické správnosti modelu',
      'transformace na relační model',
    ],
    correct: [0, 1, 2],
    explanation:
      'Krok 1 (<em>Requirements Engineering</em>): rozsah, cíl, aplikace, otázky (použijí se i při validaci) a modularizace, je-li doména příliš složitá. Vzory a verifikace patří do kroku 2 (ontologické konceptuální modelování), transformace je krok 3.',
    verified: 'slides',
    sources: [
      P02(7, 'Vymezení rozsahu ontologie, cíle a aplikace: kompetence ontologie.'),
      P02(7, 'Identifikace otázek, na které chceme znát odpovědi (využití i při validaci).'),
      P02(9),
      P02(10),
    ],
  },
  {
    id: 'ch01-10',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P02, slide 12 (Unified Foundational Ontology)', why: 'Části UFO a co pokrývají.' },
    prompt: 'Čím se zabývá <strong>UFO-A</strong>, na které stojí OntoUML?',
    options: [
      'strukturálními aspekty (entity, vlastnosti, vztahy)',
      'behaviorálními aspekty (chování, události, kauzalita)',
      'sociálními aspekty (agenti, akce, organizace)',
      'službami (poskytovatel, zákazník, smlouva o službě)',
      'právními vztahy',
    ],
    correct: [0],
    explanation:
      'UFO-A = <em>Endurants</em>, strukturální aspekty – základ OntoUML. UFO-B = události a chování, UFO-C = sociální realita, UFO-S = služby, UFO-L = právní vztahy.',
    verified: 'slides',
    sources: [
      P02(12, 'UFO-A: Strukturální aspekty (entity, vlastnosti, vztahy)'),
      P02(5, 'Slouží pro ontologické konceptuální modelování pomocí základní ontologie UFO-A.'),
    ],
  },
  {
    id: 'ch01-11',
    kind: 'tf',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P02, slides 3, 5, 13; P01, slide 49', why: 'Ověřuje, že student chápe OntoUML jako UML profil se stereotypy.' },
    prompt:
      'OntoUML je profil UML: rozšiřuje UML standardním mechanismem stereotypů a jejich význam (sémantiku) přebírá z fundamentální ontologie UFO.',
    answer: true,
    explanation:
      'OntoUML je „UML profil založený na UFO“. Stereotypy jsou standardní mechanismus rozšíření UML, ale „UML poskytuje mechanismus, nikoli sémantiku“ – tu dodává UFO (konkrétně UFO-A).',
    verified: 'slides',
    sources: [
      P02(13, 'UML profil založený na UFO pro Ontology-Driven Conceptual Modelling'),
      P02(3, 'Umožňuje významové rozšíření pomocí tzv. UML profilů = definice diagramů a'),
      P01(49, 'UML poskytuje mechanismus, nikoli sémantiku'),
    ],
  },
  {
    id: 'ch01-12',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P02, slide 6 (Cena banky UML vs. OntoUML)', why: 'Příklad ukazuje, že stereotypy odstraňují nejednoznačnost.' },
    prompt: 'V OntoUML modelu níže má atribut <code>cena</code> typ <span class="st">«kind»</span> Budova a Banka je její <span class="st">«role»</span>. Co tedy vyjadřuje „cena banky“?',
    diagram: {
      classes: [
        { id: 'bud', name: 'Budova', st: 'kind', x: 0, y: 0, attrs: ['cena: number'] },
        { id: 'b', name: 'Banka', st: 'role', x: 0, y: 1 },
      ],
      gens: [{ general: 'bud', specifics: ['b'] }],
    },
    options: [
      'cenu budovy, ve které banka sídlí',
      'cenu banky jako instituce (např. při akvizici)',
      'cenu finančních služeb, které banka poskytuje',
      'nic – OntoUML atributy nemá',
    ],
    correct: [0],
    explanation:
      'Banka je zde <em>role</em> budovy a atribut patří typu Budova – jde o cenu budovy. V dalších variantách slidu je Banka <span class="st">«subkind»</span> Instituce s cenou (cena instituce), nebo má cenu <span class="st">«collective»</span> Finanční služby. Prostý UML model „Banka: cena“ nerozliší, která interpretace platí.',
    verified: 'slides',
    sources: [P02(6)],
  },
  {
    id: 'ch01-13',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'original', inspiredBy: 'P01, slides 31–32 (Externí účast vs. vnitřní stav)', why: 'Hlavní motivace OntoUML: stejná UML generalizace, různé důvody.' },
    prompt: 'Proč je v OntoUML RentedVehicle <span class="st">«role»</span>, ale DamagedVehicle <span class="st">«phase»</span>?',
    options: [
      'Vozidlo je pronajaté kvůli vnějšímu vztahu (účast ve smlouvě), poškozené kvůli změně svého vnitřního stavu.',
      'Pronájem trvá kratší dobu než poškození.',
      'RentedVehicle má atributy, DamagedVehicle ne.',
      'Role se používá pro osoby i věci, fáze jen pro osoby.',
      'Je to jen konvence, obojí by šlo zaměnit.',
    ],
    correct: [0],
    explanation:
      'Rozhoduje <strong>důvod</strong> klasifikace: role vzniká ve vztahovém kontextu (smlouva RentalAgreement), fáze změnou vnitřní vlastnosti (stav vozidla). Délka trvání ani atributy nerozhodují.',
    verified: 'slides',
    sources: [P01(31, 'Notace vypadá stejně, ale důvody se zásadně liší.'), P01(32)],
  },
  {
    id: 'ch01-14',
    kind: 'mc',
    topic: 'km',
    origin: { type: 'real', seen: ['Přednáška 1, Časté otázky'] },
    prompt: 'Dva doménoví experti se neshodnou, jak má model vypadat. Jak postupovat? Vyberte správné možnosti.',
    options: [
      'Nejprve ověřit, zda mluví o stejném kontextu, období a významu pojmu.',
      'Rozdíl může odhalit dvě potřebné konceptualizace (např. zákazník pro marketing a pro účetnictví).',
      'Při skutečném rozporu pomůže model rozpor přesně formulovat, rozhodnout ale musí odpovědní lidé.',
      'Rozhodne modelář, protože model vytváří on.',
      'Správnost rozhodne experiment s prototypem.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Podle přednášky nejdřív vyjasníme kontext a význam pojmů; rozdíl může znamenat dvě legitimní konceptualizace. Skutečný rozpor v požadavcích model jen formuluje, rozhodují odpovědní lidé. Žádný experiment správnost konceptualizace nedokáže (problém intersubjektivity).',
    verified: 'slides',
    sources: [
      P01(63, 'Nejprve ověříme, zda mluví o stejném kontextu, období a významu pojmu.'),
      P01(17, 'Neexistuje žádný experiment, který by dokázal správnost.'),
    ],
  },
]
