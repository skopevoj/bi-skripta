import type { Question } from '../types'

const AP = 'https://ontouml.readthedocs.io/en/latest/anti-patterns/'

export const ch06: Question[] = [
  {
    id: 'ch06-01',
    topic: 'sortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Zkouška (FIT Wiki), úloha 22 (zde upravená verze)'] },
    prompt: 'Které stereotypy OntoUML jsou <strong>poskytovateli identity</strong> (identity provider)?',
    options: ['«Kind»', '«Subkind»', '«Collective»', '«Quantity»', '«Relator»', '«Role»', '«Mode» a «Quality»', '«Category»'],
    correct: [0, 2, 3, 4, 6],
    explanation:
      'Přednáška vyjmenovává poskytovatele identity: Kind, Collective, Quantity, Relator, Mode a Quality. Subkind a Role identitu jen <em>dědí</em>; Category je non-sortál, identitu nemá (agreguje typy s různou identitou).',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/image_1_.png', label: 'FIT Wiki – screenshot otázky (Moodle zpětná vazba)' },
      { kind: 'image', src: '/sources/wiki/ex-22.png', label: 'Zkouška (FIT Wiki), úloha 22' },
      { kind: 'slide', doc: 'P05', page: 5 }],
  },
  {
    id: 'ch06-02',
    topic: 'nesortaly',
    kind: 'mc',
    origin: { type: 'real', seen: ['Zkouška (FIT Wiki), úloha 50 (zde upravená verze)'] },
    prompt: 'Vyberte správné charakteristiky pro <strong>ROLEMIXIN</strong>:',
    options: ['Poskytuje identitu', 'Je rigidní', 'Je relačně závislý', 'Je semi-rigidní', 'Je anti-rigidní', 'Je non-sortál'],
    correct: [2, 4, 5],
    explanation:
      '«RoleMixin» je anti-rigidní, relačně závislý non-sortál – nadtyp rolí různých druhů (např. Customer nad PersonalCustomer a CorporateCustomer). Identitu neposkytuje ani nemá; semi-rigidní je «Mixin», rigidní «Category».',
    verified: 'slides',
    sources: [
      { kind: 'image', src: '/sources/wiki/ex-50.png', label: 'Zkouška (FIT Wiki), úloha 50' },
      { kind: 'slide', doc: 'C06', page: 7, quote: '«RoleMixin» = anti-rigidní non-sortál, relačně závislý, pro «Role» různých druhů' }],
  },
  {
    id: 'ch06-03',
    topic: 'nesortaly',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'C06 s. 7 (Non-sortály)', why: 'Typická pravda/nepravda o rigiditě mixinu.' },
    prompt: '«Mixin» je semi-rigidní non-sortál, který zastřešuje rigidní i anti-rigidní podtypy.',
    answer: true,
    explanation:
      'Ano. Mixin je semi-rigidní: pro některé instance se chová jako rigidní, pro jiné jako anti-rigidní. Proto musí mít aspoň dva podtypy s různou rigiditou (jinak jde o antipattern MixRig).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C06', page: 7, quote: '«Mixin» = semi-rigidní non-sortál, pro rigidní a současně anti-rigidní podtypy' },
      { kind: 'slide', doc: 'P05', page: 31, quote: 'Mixin musí mít minimálně dva podtypy s různou rigiditou.' },
    ],
  },
  {
    id: 'ch06-04',
    topic: 'km',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 12–15 (Princip reifikace)', why: 'Ověřuje pochopení pojmu reifikace a role volitelné multiplicity.' },
    prompt: 'Co platí o <strong>principu reifikace</strong> v konceptuálním modelování?',
    options: [
      'Do modelu zavádíme dosud nevyjádřené pojmy (např. skryté role nebo relátory).',
      'Model zpřesňujeme a zvyšujeme jeho výrazovost.',
      'Jde o odstranění všech volitelných multiplicit 0..1 z modelu.',
      'Volitelná multiplicita 0..1 je podnět k otázce, zda nechybí role či vztah s vlastní identitou.',
      'Reifikace je převod OntoUML modelu na objektový model.',
    ],
    correct: [0, 1, 3],
    explanation:
      'Reifikace = zavádění dosud nevyjádřených pojmů, model se zpřesňuje a roste výrazovost. Multiplicita 0..1 je jen <em>signál</em> („samotná volitelnost nerozhoduje“), nejde o mechanické odstranění. Převod na OO model je transformace (kapitola 7), ne reifikace.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 12, quote: 'je postup, kdy do modelu zavádíme dosud nevyjádřené pojmy' },
      { kind: 'slide', doc: 'P05', page: 15, quote: 'dobou trvání nebo vlastnostmi? Samotná volitelnost nerozhoduje.' },
    ],
  },
  {
    id: 'ch06-05',
    topic: 'antipatterny',
    kind: 'tf',
    origin: { type: 'real', seen: ['Přednáška 5, Časté otázky'] },
    prompt: 'Když nástroj (OpenPonk) v modelu najde anti-pattern, musím model vždy opravit.',
    answer: false,
    explanation:
      'Nepravda. Nález antipatternu je podnět k prověření konkrétního rizika, ne automatický rozsudek – musíš zjistit, jaké nežádoucí situace struktura připouští a zda jsou v doméně nepřípustné. Povinně opravit se musí <em>syntaktické</em> chyby (verifikace).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 60, quote: 'Nález je podnět k prověření konkrétního rizika, nikoli automatický rozsudek.' },
      { kind: 'slide', doc: 'P05', page: 20, quote: 'Všechny syntaktické chyby je nutno opravit!' },
    ],
  },
  {
    id: 'ch06-06',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 18–21, 39; C06 s. 13', why: 'Rozlišení verifikace, detekce antipatternů a validace.' },
    prompt: 'Co platí o kontrole OntoUML modelu?',
    options: [
      'Verifikace kontroluje pravidla jazyka (např. dovolené generalizace); nalezené chyby je nutné opravit.',
      'Detekce antipatternů je sémantická kontrola, která hledá podezřelé struktury.',
      'Kontrolu souladu s doménou (validaci s doménovým expertem) za nás udělá nástroj.',
      'V OpenPonku „Verify model“ obarví nálezy červeně a „Detect anti-patterns“ žlutě.',
      'Otázka „Je každá Phase součástí disjoint a complete generalization setu?“ patří k syntaktické kontrole.',
    ],
    correct: [0, 1, 3, 4],
    explanation:
      'Verifikace = syntax jazyka, chyby se musí opravit (červeně). Antipatterny = sémantická kontrola (žlutě). Otázka na phase partition je na slajdu „Syntaktická kontrola“. Soulad s doménou je nutné ověřovat <strong>ručně</strong> – nástroj nerozhodne, zda model vystihuje zamýšlenou doménu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 18, quote: 'Nástroj nerozhodne, zda model vystihuje zamýšlenou doménu.' },
      { kind: 'slide', doc: 'P05', page: 19, quote: 'Je každá Phase součástí disjoint a complete generalization setu?' },
      { kind: 'slide', doc: 'P05', page: 39, quote: 'syntaktická kontrola, nálezy obarví elementy na červeno' },
    ],
  },
  {
    id: 'ch06-07',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 35–36 (RelRig)', why: 'Poznat antipattern z diagramu a vybrat opravu.' },
    prompt: 'Který antipattern obsahuje model a jak ho typicky opravíme?',
    diagram: {
      classes: [
        { id: 'p', name: 'Person', st: 'kind', x: 0, y: 0 },
        { id: 'c', name: 'Customer', st: 'role', x: 0, y: 1 },
        { id: 'o', name: 'Food order', st: 'relator', x: 1.5, y: 1 },
        { id: 'r', name: 'Restaurant', st: 'kind', x: 3, y: 1 },
      ],
      gens: [{ general: 'p', specifics: ['c'] }],
      assocs: [
        { from: 'o', to: 'c', st: 'mediation', fromMult: '1..*', toMult: '1' },
        { from: 'o', to: 'r', st: 'mediation', fromMult: '*', toMult: '1' },
      ],
    },
    options: [
      'RelRig – relátor přímo mediuje rigidní typ',
      'DepPhase – phase s mediation',
      'Oprava: zavést «role» (např. Restaurant jako role kindu Company) a mediation přesunout na ni',
      'Oprava: změnit «relator» Food order na «kind»',
      'MultDep – Customer je mediován dvěma relátory',
    ],
    correct: [0, 2],
    explanation:
      'Food order mediuje «kind» Restaurant → Relator mediating rigid types (RelRig). Většinou značí chybějící roli (příp. roleMixin), takže Restaurant se stane rolí nad kindem Company. Phase tu není (DepPhase ne) a Customer je mediován jen jedním relátorem (MultDep ne).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 35, quote: 'Většinou značí chybějící roli, případně rolemixin.' },
      { kind: 'slide', doc: 'P05', page: 36 },
      { kind: 'web', label: 'OntoUML docs: RelRig', url: AP + 'RelRig/index.html' },
    ],
  },
  {
    id: 'ch06-08',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 33 (MultDep)', why: 'Definice MultDep se snadno plete s FreeRole a RelRig.' },
    prompt: 'Antipattern <strong>Multiple relational dependency (MultDep)</strong> nastává, když:',
    options: [
      'typ je propojen mediation se dvěma a více různými relátory, které nejsou nadtypem/podtypem jeden druhého',
      'relátor mediuje dva a více rigidních typů',
      'role má více než jednu asociaci s multiplicitou 1',
      'role je podtypem jiné role a nemá vlastní mediation',
    ],
    correct: [0],
    explanation:
      'MultDep = jeden typ mediovaný ≥ 2 nesouvisejícími relátory (často redundance, přílišné zjednodušení nebo špatná granularita). Relátor mediující rigidní typy je RelRig, podrole bez vlastní mediation je FreeRole.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 33, quote: 'propojen pomocí mediation s dvěma a více různými relatory' },
      { kind: 'web', label: 'OntoUML docs: MultDep', url: AP + 'MultDep/index.html' },
    ],
  },
  {
    id: 'ch06-09',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 24, 27–28; OntoUML docs BinOver, FreeRole', why: 'Poznat antipattern podle popisu situace.' },
    prompt: 'Která tvrzení o antipatternech <strong>BinOver</strong> a <strong>FreeRole</strong> jsou pravdivá?',
    options: [
      'BinOver: na obou koncích vztahu může být tentýž jedinec (např. role Guard a Prisoner téhož kindu bez {disjoint}).',
      'BinOver lze řešit disjunktním generalization setem nebo OCL invariantem (např. ireflexivita).',
      'FreeRole: podrole nemá vlastní mediation, takže není definováno, čím instance do podrole vstupuje.',
      'FreeRole je syntaktická chyba – role bez vlastní mediation je v OntoUML zakázaná.',
      'FreeRole lze opravit přidáním relátoru (např. subkindu původního relátoru), který podrolu mediuje.',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'Relační závislost role je splněna i tím, že je podtypem jiné role se splněnou závislostí – FreeRole proto <em>není</em> syntaktická chyba, jen podezřelá struktura. Opravy dle katalogu: nový relátor, redefinující materiální vztah, nebo odvozovací pravidlo. BinOver se řeší disjunkcí, OCL nebo změnou stereotypu vztahu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 24, quote: 'Overlapping typy = dva typy, které mohou být instancovány stejným individualem.' },
      { kind: 'slide', doc: 'P05', page: 27, quote: 'Role je podtypem jiné role, která má splněnou relační závislost' },
      { kind: 'web', label: 'OntoUML docs: BinOver', url: AP + 'BinOver/index.html' },
      { kind: 'web', label: 'OntoUML docs: FreeRole', url: AP + 'FreeRole/index.html' },
    ],
  },
  {
    id: 'ch06-10',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 25–26, 37–38 (DepPhase, UndefPhase)', why: 'Dva antipatterny fází v jedné otázce s diagramem.' },
    prompt: 'Které antipatterny tento model obsahuje?',
    diagram: {
      classes: [
        { id: 'p', name: 'Person', st: 'kind', x: 1, y: 0 },
        { id: 'h', name: 'Healthy patient', st: 'phase', x: 0, y: 1 },
        { id: 'i', name: 'Ill patient', st: 'phase', x: 1, y: 1 },
        { id: 'd', name: 'Doctor', st: 'role', x: 2, y: 1 },
        { id: 'card', name: 'Patient card', st: 'relator', x: 1, y: 2 },
      ],
      gens: [{ general: 'p', specifics: ['h', 'i'], set: { disjoint: true, complete: true } }, { general: 'p', specifics: ['d'] }],
      assocs: [
        { from: 'card', to: 'h', st: 'mediation', fromMult: '1', toMult: '0..1' },
        { from: 'card', to: 'i', st: 'mediation', fromMult: '1', toMult: '0..1' },
        { from: 'card', to: 'd', st: 'mediation', fromMult: '*', toMult: '1' },
      ],
    },
    options: ['DepPhase', 'UndefPhase', 'RelRig', 'MixRig', 'HetColl'],
    correct: [0, 1],
    explanation:
      'Fáze Healthy/Ill patient jsou konci mediation → DepPhase (fáze má být určena vnitřní vlastností, ne vztahem; správně role Patient). A Person nemá žádný atribut, quality ani mode, podle kterého by se fáze určily → UndefPhase. Relátor mediuje jen anti-rigidní typy (ne RelRig), mixin ani collective v modelu není.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 25, quote: 'Phase, která je součástí jedné nebo více asociací typu mediation.' },
      { kind: 'slide', doc: 'P05', page: 37, quote: 'Množina entit stereotypovaných jako phase, jejichž společný nadtyp nemá žádný' },
    ],
  },
  {
    id: 'ch06-11',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 31–32; OntoUML docs MixRig', why: 'Opravy MixRig se na testu dají ptát jako výběr více možností.' },
    prompt: '«Mixin» InsurableItem má podtypy pouze «kind» Car a «kind» House. Jak lze tento antipattern (MixRig) opravit?',
    options: [
      'Změnit «mixin» na «category», pokud se žádný anti-rigidní podtyp neočekává.',
      'Pod mixin místo House zavěsit anti-rigidní podtyp, o který skutečně jde (např. «role» InsuredHouse jako podtyp House).',
      'Změnit «mixin» na «roleMixin».',
      'Změnit «kind» Car na «subkind».',
    ],
    correct: [0, 1],
    explanation:
      'Samé rigidní podtypy → buď je správně «category», nebo je semi-rigidita oprávněná a chybí/je špatně stereotypovaný anti-rigidní podtyp. «roleMixin» by šel jen při samých anti-rigidních podtypech. Subkind bez nadřazeného kindu nemá odkud dědit identitu.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 31, quote: 'Mixin musí mít minimálně dva podtypy s různou rigiditou.' },
      { kind: 'web', label: 'OntoUML docs: MixRig', url: AP + 'MixRig/index.html' },
    ],
  },
  {
    id: 'ch06-12',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P05 s. 29–30 (HetColl)', why: 'Rozdíl collective × funkční celek je častý chyták.' },
    prompt: '«Collective» Orchestra má přes «memberOf» tři různé typy částí: Conductor, Soloist a Violinist. Co platí?',
    options: [
      'Jde o antipattern HetColl (Heterogeneous collective).',
      'Části mají různé role, takže jde spíš o funkční celek – «kind» s «componentOf».',
      'Jiná oprava: nechat collective a členy sjednotit společným «roleMixin» (např. Musician).',
      'Model je v pořádku, collective smí mít libovolně mnoho typů členů.',
      'Opačným antipatternem je HomoFunc (funkční celek se stejnorodými částmi).',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'V kolektivu se na všechny části nahlíží stejně; ≥ 2 různé typy členů = HetColl. Opravy ze slajdu: funkční celek s componentOf, nebo collective se stejnorodými členy přes roleMixin Musician. Opakem je Homogeneous Functional Complex (HomoFunc).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P05', page: 29, quote: 'Collective s dvěma či více rozdílnými typy částí.' },
      { kind: 'slide', doc: 'P05', page: 30 },
    ],
  },
  {
    id: 'ch06-13',
    topic: 'antipatterny',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'C06-eshop (úkol 6)', why: 'Aplikace antipatternů na model ze cvičení.' },
    prompt:
      'V modelu e-shopu je «role» Expedition assistant (podrole «role» Employee, který je mediován relátorem Employment contract) spojena s «kind» Order jen obyčejnou asociací bez stereotypu. Co platí?',
    options: [
      'Jde o FreeRole – podrole nemá vlastní definující mediation.',
      'Jde o syntaktickou chybu, protože Expedition assistant nemá žádnou relační závislost.',
      'Vhodnou opravou je udělat z Order «relator», který mediuje zákazníka i asistenta expedice.',
      'Jde o HetColl.',
    ],
    correct: [0, 2],
    explanation:
      'Relační závislost je formálně splněna přes nadrolu Employee (proto to není syntaktická chyba), ale není definováno, čím se zaměstnanec stane asistentem expedice → FreeRole. Objednávka zakládá vztah zákazník – asistent, takže je přirozeným relátorem.',
    verified: 'reasoning',
    sources: [
      { kind: 'slide', doc: 'C06-eshop', page: 1, quote: 'Zákazník vytváří v systému objednávku, kterou přebírá asistent' },
      { kind: 'slide', doc: 'P05', page: 27 },
    ],
  },
  {
    id: 'ch06-14',
    topic: 'sortaly',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'C06 s. 6; P05 s. 19', why: 'Pravidlo o phase partition je oblíbená T/F otázka.' },
    prompt: 'Fáze («phase») vždy tvoří phase partition, která musí být {disjoint, complete}.',
    answer: true,
    explanation:
      'Ano – instance kindu je v každém okamžiku právě v jedné fázi dané partition (např. Alive × Deceased). OpenPonk to kontroluje syntakticky.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'C06', page: 6, quote: 'Vždy tvoří phase partition, který musí být {disjoint, complete}' },
      { kind: 'slide', doc: 'P05', page: 19, quote: 'Je každá Phase součástí disjoint a complete generalization setu?' },
    ],
  },
]
