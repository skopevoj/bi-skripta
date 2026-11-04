import type { Question } from '../types'

export const ch11: Question[] = [
  {
    id: 'ch11-01',
    topic: 'km',
    kind: 'mc',
    origin: { type: 'real', seen: ['Přednáška 9 (BPMN), Časté otázky'] },
    prompt: 'Proč v předmětu potřebujeme OntoUML <strong>i</strong> BPMN? Vyberte správná tvrzení.',
    options: [
      'OntoUML vysvětluje entity, jejich klasifikace a vztahy.',
      'BPMN popisuje průběh činností, komunikaci a reakce na události.',
      'Propojíme je např. tím, že u aktivity „Předat vůz“ vysvětlíme, které entity používá a jakou změnu v doméně způsobí.',
      'Stačil by jeden velký BPMN diagram, protože data objekty v BPMN nahrazují doménový model.',
      'OntoUML je jen starší notace pro totéž, co BPMN.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Oba jazyky odpovídají na jiné otázky: OntoUML na „co existuje a jak to souvisí“, BPMN na „kdo co dělá, v jakém pořadí a co při výjimce“. Spojuje je doménový účinek aktivit. Data object v BPMN je jen lokální proměnná procesu, doménový model nenahradí.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 77, quote: 'OntoUML vysvětluje entity, jejich klasifikace a vztahy' },
      { kind: 'slide', doc: 'P11', page: 9, quote: 'Každý důležitý krok procesu musí mít vysvětlitelný účinek v doménovém modelu.' },
    ],
  },
  {
    id: 'ch11-02',
    topic: 'km',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P11 s. 3 (Shrnutí předmětu: jeden propojený celek)', why: 'Přiřazení jazyka k otázce, na kterou odpovídá, je typická souhrnná otázka.' },
    prompt: 'Které přiřazení „pohled → otázka, na kterou odpovídá“ je správné?',
    options: [
      'BPMN → Kdo vůz předá, v jakém pořadí a co při výjimce?',
      'OCL → Jaké stavy a změny odpovídají zvoleným pravidlům?',
      'RDF / OWL + SPARQL → Co o situaci víme, co odvodíme a jak se na to zeptáme?',
      'SHACL → Kdo je nájemce a jakou má identitu?',
      'OntoUML → V jakém pořadí se provádějí činnosti při vrácení vozu?',
    ],
    correct: [0, 1, 2],
    explanation:
      'Podle slidu: OntoUML/UFO – co je vůz, nájemce, nájemní vztah; OCL – stavy a změny podle pravidel; BPMN – kdo, v jakém pořadí, co při výjimce; RDF/OWL+SPARQL – co víme, odvodíme, jak se zeptáme; SHACL – zda data splňují požadavky pro dané použití. Poslední dvě možnosti mají pohledy prohozené.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P11', page: 3, quote: 'Co je vůz, nájemce a nájemní vztah? Co je spojuje?' }],
  },
  {
    id: 'ch11-03',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P11 s. 5 (Rozhodnutí v modelu zavazují)', why: 'Ověřuje, že student umí vysvětlit důsledky stereotypů na konkrétní doméně.' },
    prompt: 'Autopůjčovna: Vůz je <span class="st">«kind»</span>, Nájemce <span class="st">«role»</span> osoby a motor je nahraditelná součást vozu. Které důsledky z toho plynou?',
    options: [
      'Změna registrační značky sama o sobě nevytvoří jiné auto.',
      'Člověk může přestat být nájemcem a zůstane týmž člověkem.',
      'Výměna motoru zachová identitu vozu.',
      'Po skončení nájmu přestane daný člověk existovat jako instance třídy Osoba.',
      'Konkrétní motor je esenciální částí vozu – jeho výměnou vznikne jiný vůz.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Kind dodává identitu – ta nezávisí na SPZ. Role je anti-rigidní: člověk ji může ztratit a zůstane týmž člověkem (Osoba je rigidní). Nahraditelná součást není esenciální, výměna motoru identitu vozu zachová.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P11', page: 5, quote: 'Změna registrační značky sama o sobě nevytvoří jiné auto.' },
      { kind: 'slide', doc: 'P11', page: 5, quote: 'Výměna motoru zachová identitu vozu; konkrétní motor není esenciální částí.' },
    ],
  },
  {
    id: 'ch11-04',
    topic: 'km',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'P11 s. 11 (Význam vzniká dohodou lidí)', why: 'Chyták na slučování pojmů podle názvu.' },
    prompt:
      'Marketing, provoz i účetnictví autopůjčovny používají pojem „zákazník“. Protože jde o stejný název, je správné jejich třídy i identifikátory sloučit do jedné.',
    answer: false,
    explanation:
      'Pro marketing je zákazník každý registrovaný zájemce, pro provoz účastník probíhajícího nájmu, pro účetnictví odběratel na faktuře. Shodný název nestačí pro sloučení tříd ani identifikátorů; nejprve je třeba vyjasnit definice, kontext a vztahy – výsledkem může být rozlišení tří pojmů.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P11', page: 11, quote: 'Shodný název nestačí pro sloučení tříd ani identifikátorů.' }],
  },
  {
    id: 'ch11-05',
    topic: 'ocl',
    kind: 'mc',
    origin: { type: 'real', seen: ['Přednáška 11 (Shrnutí), Časté otázky'] },
    prompt: 'Má model autopůjčovny invariantem zakázat pozdní vrácení auta, když ho zakazují pravidla půjčovny?',
    options: [
      'Ne – evidence musí umět zaznamenat i porušení provozní povinnosti; pozdní vrácení rozpoznáme jako prodlení a navážeme proces.',
      'Ano – invariant „skutečné vrácení ≤ dohodnutý termín“ přesně vyjadřuje pravidlo půjčovny.',
      'Ano – co je zakázané pravidly, nesmí model připustit.',
      'Ne – pravidla půjčovny do konceptuálního modelu nepatří vůbec.',
    ],
    correct: [0],
    explanation:
      'Provozní povinnost (vrátit včas) není definice pojmu. Invariant nad evidencí by znemožnil zaznamenat právě situaci, kterou potřebujeme řešit. Pravidlo do modelu patří – ale jako rozpoznatelné porušení (prodlení), ne jako zákaz zápisu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P11', page: 55, quote: 'Evidence musí umět zaznamenat i porušení provozní povinnosti.' },
      { kind: 'slide', doc: 'P11', page: 7, quote: 'Znemožnil by zaznamenat právě situaci, kterou potřebujeme řešit.' },
    ],
  },
  {
    id: 'ch11-06',
    topic: 'rdf',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'P11 s. 8 (Svět, naše znalost a záznam)', why: 'Spojuje předpoklad otevřeného světa z RDF/OWL s praktickým rozhodnutím.' },
    prompt: 'V databázi není žádný aktivní nájem vozu. Z toho lze v otevřeném světě s jistotou vyvodit, že vůz je k dispozici.',
    answer: false,
    explanation:
      'Ve světě může být vůz stále u zákazníka nebo v servisu, naše znalost může být neúplná (zpráva o předání nedorazila) a záznam je jen tvrzení zdroje k určitému času. V otevřeném světě absence tvrzení neprokazuje jeho nepravdivost.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P11', page: 8, quote: 'V otevřeném světě absence tvrzení neprokazuje jeho nepravdivost.' }],
  },
  {
    id: 'ch11-07',
    topic: 'km',
    kind: 'mc',
    origin: { type: 'real', seen: ['Přednáška 11 (Shrnutí), Časté otázky'] },
    prompt: 'Model vygenerovala AI a všechny kontroly (import, OntoUML validátor, OCL) prošly. Co ještě musí udělat člověk?',
    options: [
      'Ověřit, zda model odpovídá zamýšlené doméně a účelu.',
      'Posoudit předpoklady, chybějící pravidla a konkrétní příklady i protipříklady.',
      'Nic – prošlý validátor dokládá správnost doménových rozhodnutí.',
      'Jen zkontrolovat, že model jde načíst v OpenPonku.',
    ],
    correct: [0, 1],
    explanation:
      'Konzistentní model může dokonale popisovat půjčovnu, která funguje jinak než ta naše. Úspěšný import dokládá čitelnost zápisu, pravidla jazyka hlídá validátor – doménový význam a účel ale musí posoudit expert pomocí kompetenčních otázek a protipříkladů.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P11', page: 56, quote: 'Ověřit, zda model odpovídá zamýšlené doméně a účelu.' },
      { kind: 'slide', doc: 'P11', page: 47, quote: 'Úspěšný import dokládá čitelnost zápisu. Správnost doménových rozhodnutí tím doložena není.' },
    ],
  },
  {
    id: 'ch11-08',
    topic: 'vztahy',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P11 s. 20–21 (Ontologické přetížení asociace)', why: 'Hlavní praktický příklad přednášky; spojuje relátor, material a derivation.' },
    prompt:
      'Asociace <code>Conduct_Fluid</code> se v ontologii opakuje mezi Duct–Fluid, Gas Pipeline–Gas i Oil Pipeline–Oil. Jak tento problém správně vyřešit v OntoUML?',
    options: [
      'Zavést <span class="st">«relator»</span> Fluid_Transportation, který zprostředkovává (mediation) Duct a Fluid; <span class="st">«material»</span> Conduct_Fluid je z něj odvozená (derivation).',
      'Ponechat asociace a označit je jako <span class="st">«formal»</span>.',
      'Nahradit asociace vztahem <span class="st">«componentOf»</span>, protože tekutina je částí trubky.',
      'Smazat asociace u podtypů a spoléhat na dědičnost bez dalšího vysvětlení.',
    ],
    correct: [0],
    explanation:
      'Jde o ontologické přetížení: nevíme, co činí vztah pravdivým, zda jde o jednu přepravu nebo více dějů, jaké má identitu a účastníky. Odpovědí je relátor jako truth-maker materiálního vztahu. Formal by vztah prohlásil za odvoditelný z vlastností účastníků (není), componentOf je nesmysl – tekutina není komponentou trubky.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P11', page: 20, quote: 'Co činí vztah duct conducts fluid' },
      { kind: 'slide', doc: 'P11', page: 21 },
      { kind: 'web', label: 'OntoUML docs: Relator', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/relator/index.html' },
    ],
  },
  {
    id: 'ch11-09',
    topic: 'vztahy',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P11 s. 22 (Specializace relátorů)', why: 'Ověřuje pochopení, že i relátory se dají specializovat.' },
    prompt: 'V modelu ze slidu „Specializace relátorů“ je <span class="st">«relator»</span> Oil_Transportation. Která tvrzení platí?',
    options: [
      'Oil_Transportation je podtypem (specializací) relátoru Fluid_Transportation.',
      'Oil_Transportation zprostředkovává (mediation) Oil Pipeline a Oil.',
      'Oil Pipeline je <span class="st">«subkind»</span> Duct a Oil je <span class="st">«subkind»</span> Fluid.',
      'Oil_Transportation je <span class="st">«role»</span> relátoru Fluid_Transportation.',
      'Specializace relátoru znamená, že Oil_Transportation už nemá žádné mediation.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Na slidu se generalizace vede od Oil_Transportation i Gas_Transportation k Fluid_Transportation; každý specializovaný relátor má vlastní mediation na odpovídající subkind trubky a tekutiny. Stereotyp zůstává «relator», nejde o roli, a mediation má.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P11', page: 22 }],
  },
  {
    id: 'ch11-10',
    topic: 'sortaly',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'P11 s. 27 (SAREF4health: Správná role změnila model i implementaci)', why: 'Role jako dočasný relační kontext na praktickém příkladu.' },
    prompt:
      'V ontologii SAREF4health je monitorovaný řidič modelován jako <span class="st">«role»</span> „Person Under ECG Monitoring“, protože monitorovaný řidič není nutně pacient a pojem Patient by byl příliš úzký.',
    answer: true,
    explanation:
      'Slide uvádí Person Under ECG Monitoring místo příliš úzkého Patient; role je dočasný, relační kontext (účast na ECG Recording Session). Přesnější role vedla k přesnějším datům a integraci.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P11', page: 27, quote: 'Person Under ECG Monitoring místo' }],
  },
]
