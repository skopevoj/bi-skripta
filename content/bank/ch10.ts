import type { Question } from '../types'

export const ch10: Question[] = [
  {
    id: 'ch10-01',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 6–11, C10 s. 4–7', why: 'Základní orientace v BPMN: kdo ho spravuje a jaké má prvky.' },
    prompt: 'Vyberte pravdivá tvrzení o BPMN.',
    options: [
      'BPMN je standard spravovaný konsorciem OMG (ISO/IEC 19510).',
      'BPMN modely mohou být vykonávány procesním strojem (orchestrace).',
      'BPMN popisuje především strukturu domény – typy entit a jejich identitu.',
      'Brány (gateways) slouží k řízení toku v procesu.',
      'Notace BPMN je minimální: každou situaci lze vyjádřit právě jedním způsobem.',
    ],
    correct: [0, 1, 3],
    explanation:
      'BPMN spravuje OMG a je ratifikováno jako ISO/IEC 19510:2013; modely lze spouštět procesním strojem (Level 3). Brány řídí toky. Strukturu domény a identitu popisuje OntoUML, ne BPMN. Slidy naopak kritizují, že BPMN obsahuje nadbytečné konstrukty a totéž lze vyjádřit více způsoby.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 6, quote: 'BPMN je spravováno a rozvíjeno konsorciem OMG (Object Management Group)' },
      { kind: 'slide', doc: 'P09', page: 7, quote: 'Obsahuje nadbytečné konstrukty a vzory: je více možností pro vyjádření toho samého' },
      { kind: 'slide', doc: 'C10', page: 7, quote: 'Gateways (brány) slouží k řízení toků (flows) v procesu' },
    ],
  },
  {
    id: 'ch10-02',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 25 (BPMN: Tasks)', why: 'Typy tasků jsou snadný testový chyták (manual × user, service × script).' },
    prompt: 'Které přiřazení typu tasku a jeho významu je <strong>správné</strong>?',
    options: [
      'Manual Task – člověk ho vykoná bez jakéhokoli spojení s procesním strojem.',
      'User (Human) Task – člověk ho vykoná pomocí procesního stroje, např. přes formulář.',
      'Service Task – automatizovaná aktivita, typicky volající jinou službu.',
      'Script Task – člověk podle papírového návodu (skriptu) vykoná činnost.',
      'Service Task – činnost, kterou zaměstnanec poskytuje zákazníkovi osobně.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Manual = člověk bez workflow enginu; User/Human = člověk přes engine (formulář); Service = automaticky, volá jinou službu; Script = automaticky, vykoná přímo procesní stroj. „Script“ ani „Service“ tedy nejsou lidské činnosti.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 25, quote: 'vykonán člověkem ale pomocí workflow engine (např. formulář)' },
      { kind: 'slide', doc: 'P09', page: 25, quote: 'automatizovaná aktivita vykonaná přímo procesním strojem samotným' },
    ],
  },
  {
    id: 'ch10-03',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 70 (Aktivity pojmenovávejte SLOVESO–PŘEDMĚT)', why: 'Doporučený postup, který se hodnotí v semestrálce i na testu.' },
    prompt: 'Které názvy aktivit odpovídají doporučení „SLOVESO–PŘEDMĚT“?',
    options: ['Zkontrolovat bonitu', 'Kontrola bonity', 'Úvěr zamítnut', 'Schválit úvěr', 'Schválit', 'Přijmout zprávu'],
    correct: [0, 3, 5],
    explanation:
      'Aktivita je akce, proto sloveso + předmět: „Zkontrolovat bonitu“, „Schválit úvěr“, „Přijmout zprávu“. „Kontrola bonity“ je funkce, „Úvěr zamítnut“ je stav (spíš název koncové události) a jednoslovné „Schválit“ je nejednoznačné.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P09', page: 70, quote: 'nebo stavy. Proto je pojmenovávejte ve tvaru SLOVESO–PŘEDMĚT.' }],
  },
  {
    id: 'ch10-04',
    topic: 'bpmn',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'P09 s. 39 (End Events – Terminate)', why: 'Rozdíl None end × Terminate end se týká tokenové sémantiky.' },
    prompt:
      'Po AND splitu běží dvě paralelní větve. Jedna dorazí do koncové události <strong>Terminate</strong>. Druhá větev přesto doběhne až do své koncové události.',
    answer: false,
    explanation:
      'Terminate end event ukončí (sub)proces okamžitě, i když jiné paralelní cesty jsou stále aktivní – zbylé tokeny se zruší. Kdyby šlo o None end event, spotřeboval by jen svůj token a druhá větev by pokračovala.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P09', page: 39, quote: 'Terminate: Při dosažení se okamžitě (sub)proces ukončí i pokud některé paralelní' }],
  },
  {
    id: 'ch10-05',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 37, 43, 14; C10 s. 6', why: 'Čtení symbolů událostí: poloha, catch/throw, přerušující/nepřerušující.' },
    prompt: 'Vyberte pravdivá tvrzení o událostech v BPMN.',
    options: [
      'Catching mezilehlá událost znamená, že proces čeká na spouštěč; throwing znamená, že ho proces generuje.',
      'Throwing událost se kreslí s plnou (vyplněnou) ikonou, catching s prázdnou.',
      'Čárkovaný okraj události označuje nepřerušující (non-interrupting) událost.',
      'Subproces obvykle začíná Message start eventem.',
      'Timer start event se hodí pro naplánovaný, pravidelně spouštěný proces.',
      'Signal je komunikace bod–bod mezi jedním odesílatelem a jedním příjemcem.',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'Catch = čeká, throw = generuje; od BPMN 1.1 se rozlišují plností symbolu; BPMN 2.0 přidalo nepřerušující události s čárkovaným kolečkem. Timer start = naplánovaný proces („Weekly“). Subproces má <em>vždy</em> start None. Signal je broadcast (M vysílačů, N přijímačů); bod–bod je Message.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 43, quote: 'Throwing Intermediate Event = proces generuje spouštěcí (trigger) signál' },
      { kind: 'slide', doc: 'P09', page: 14, quote: 'Rozlišuje catch a throw pomocí plnosti symbolu' },
      { kind: 'slide', doc: 'P09', page: 14, quote: 'Přidává nepřerušující události (čárkované kolečko)' },
      { kind: 'slide', doc: 'P09', page: 37, quote: 'None: Není blíže specifikováno nebo začíná manuálně, *vždy* pro subproces' },
      { kind: 'slide', doc: 'P09', page: 51, quote: 'Používá se pro broadcasting událostí, tj. M vysílačů a N přijímačů.' },
    ],
  },
  {
    id: 'ch10-06',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 28, 30, 31', why: 'Jádro tokenové sémantiky – rozlišit XOR, AND, OR split.' },
    prompt:
      'Za aktivitou následuje brána se třemi odchozími větvemi A, B, C. Podmínky A a B jsou splněny, C ne. Kolik tokenů opustí bránu?',
    options: [
      'Exclusive (XOR) brána: právě 1 token (jedna cesta).',
      'Parallel (AND) brána: 3 tokeny – podmínky se u AND nevyhodnocují.',
      'Inclusive (OR) brána: 2 tokeny (A a B).',
      'Inclusive (OR) brána: právě 1 token, první splněná podmínka.',
      'Exclusive (XOR) brána: 2 tokeny (A a B).',
    ],
    correct: [0, 1, 2],
    explanation:
      'XOR vybere přesně jednu cestu. AND pošle token do všech větví bez ohledu na podmínky. OR má podmínky navzájem nezávislé – token jde do každé větve, jejíž podmínka platí (zde A i B).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 28, quote: 'Exclusive (XOR) gateway = přesně jedna cesta je vybrána' },
      { kind: 'slide', doc: 'P09', page: 30, quote: 'Parallel (AND) gateway (parallel split, AND-split) = všechny cesty pokračují' },
      { kind: 'slide', doc: 'P09', page: 31, quote: 'Inclusive (OR) gateway = podmínky jsou navzájem nezávislé (nevylučují se)' },
    ],
  },
  {
    id: 'ch10-07',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 33–35 (Merging Paths)', why: 'Deadlock a chybějící synchronizace jsou nejčastější chyby v modelech.' },
    prompt:
      'Proces se XOR branou rozdělí na tři větve A, B, C, které se pak sloučí <strong>AND branou</strong> před aktivitou Z. Co se stane?',
    options: [
      'Deadlock – AND join čeká na tokeny ze všech tří větví, ale vznikl jen jeden.',
      'Z proběhne třikrát.',
      'Z proběhne jednou, model je v pořádku.',
      'Z proběhne jednou, ale až po dokončení všech tří aktivit A, B, C.',
    ],
    correct: [0],
    explanation:
      'XOR split vytvoří jediný token, AND join čeká na token z každé příchozí větve → proces se zasekne (deadlock). Pravidlo „split with it, merge with it“: po XOR slučuj XOR branou (nebo přímo, token je jen jeden). Vícenásobné spuštění Z je problém OR/AND splitu bez synchronizace.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P09', page: 34 }, { kind: 'slide', doc: 'P09', page: 35 }],
  },
  {
    id: 'ch10-08',
    topic: 'bpmn',
    kind: 'tf',
    origin: { type: 'original', inspiredBy: 'P09 s. 28 (Brány nemohou dělat rozhodnutí)', why: 'Rozdíl BPMN brány oproti flowchartu je oblíbený chyták.' },
    prompt:
      'Model „Draft report → brána Approved? → yes/no“ je v BPMN správně, protože brána Approved? reprezentuje schválení zprávy.',
    answer: false,
    explanation:
      'Brány nemohou dělat rozhodnutí, jen testovat podmínky (rozdíl oproti flowchartu). Schválení je práce – musí ho provést aktivita, např. „Review report“, a teprve za ní brána otestuje výsledek „Approved?“.',
    verified: 'slides',
    sources: [{ kind: 'slide', doc: 'P09', page: 28, quote: 'Brány nemohou dělat rozhodnutí, jen testovat podmínky' }],
  },
  {
    id: 'ch10-09',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'real', seen: ['Přednáška 9 (BPMN), Časté otázky'] },
    prompt:
      'Proces odešle zákazníkovi žádost o doplnění údajů. Pokud do 7 dní nepřijde odpověď, žádost se zamítne. Jak tuto situaci modelovat?',
    options: [
      'Event-based gateway, za ní catching Message „Přijmout odpověď“ a Timer „7 dní“.',
      'Datová XOR brána „Přišla odpověď?“ hned za odesláním žádosti.',
      'AND split na Message a Timer a AND join za nimi.',
      'Inclusive (OR) brána s podmínkami „odpověď“ a „7 dní“.',
    ],
    correct: [0],
    explanation:
      'Datová XOR brána vybírá cestu podle již dostupných údajů – tady ale odpověď ještě nemáme, model by rozhodoval podle informace, kterou nemá. Událostní (event-based) brána čeká, co nastane jako první (vzor „wait for response or timeout“). AND by čekal na obojí, OR podmínky vyhodnocuje okamžitě.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 78, quote: 'Datová XOR brána vybírá cestu podle již dostupných údajů.' },
      { kind: 'slide', doc: 'P09', page: 46, quote: 'Sequence flow je vedeno do události, která nastane jako první:' },
      { kind: 'slide', doc: 'P09', page: 49 },
    ],
  },
  {
    id: 'ch10-10',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 16, 21, 64, 66', why: 'Sekvenční tok × tok zpráv × pooly × lanes – klasická zkoušková látka.' },
    prompt: 'Vyberte pravdivá tvrzení o poolech, lanes a tocích.',
    options: [
      'Sekvenční tok nesmí překročit hranici poolu.',
      'Tok zpráv nesmí spojovat prvky ve stejném poolu.',
      'Sekvenční tok smí vést mezi lanes téhož poolu.',
      'Dvě lanes jednoho poolu spolu komunikují tokem zpráv.',
      'Externího účastníka, jehož vnitřní průběh nás nezajímá, lze zakreslit jako black-box pool.',
    ],
    correct: [0, 1, 2, 4],
    explanation:
      'Pool = proces; sekvenční tok zůstává uvnitř poolu (přes lanes klidně), mezi pooly vede jen tok zpráv. Tok zpráv mezi lanes jednoho poolu je chyba (slide „Budget Process“). Zákazník bývá black-box pool (External Participant).',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 64, quote: 'Sekvenční tok nesmí překročit hranici poolu (procesu)' },
      { kind: 'slide', doc: 'P09', page: 66, quote: 'Tok zpráv nesmí spojovat prvky ve stejném poolu' },
      { kind: 'slide', doc: 'P09', page: 16 },
      { kind: 'slide', doc: 'P09', page: 21 },
    ],
  },
  {
    id: 'ch10-11',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 67–68', why: 'Kardinalita Message vs. Signal vs. Multiple – nový obsah přednášky.' },
    prompt: 'Sklad potřebuje jednu změnu stavu oznámit <strong>třem</strong> různým příjemcům najednou. Co použít?',
    options: [
      'Událost Signal – rozešle podnět všem příjemcům se shodným názvem signálu, bez toku zpráv.',
      'Jednu throwing událost Message se třemi toky zpráv.',
      'Catching událost Multiple u každého příjemce.',
      'Link událost.',
    ],
    correct: [0],
    explanation:
      'Událost Message je komunikace bod–bod (kardinalita 1:1), jedna zpráva pro tři příjemce je chyba. Pro 1:N se použije Signal (broadcast podle názvu), pro N:1 catching Multiple. Link je jen kreslicí zkratka.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 67, quote: 'Událost Message musí mít vždy kardinalitu 1:1' },
      { kind: 'slide', doc: 'P09', page: 68, quote: 'Signal rozešle jeden podnět všem odpovídajícím příjemcům.' },
    ],
  },
  {
    id: 'ch10-12',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 40–42', why: 'Data object × data store × artefakt.' },
    prompt: 'Vyberte pravdivá tvrzení o datech a artefaktech v BPMN.',
    options: [
      'Data Object je lokální proměnná procesu a po skončení procesu zmizí.',
      'Data Store reprezentuje persistentní data, která nezmizí s koncem procesu.',
      'Data Store má reprezentovat celou databázi organizace.',
      'Data Store může být dotazován a aktualizován i entitami mimo proces.',
      'Textová anotace mění průběh procesu, pokud obsahuje podmínku.',
    ],
    correct: [0, 1, 3],
    explanation:
      'Data object = dočasná data procesu (viditelná v procesu a podprocesech), zmizí s koncem procesu. Data store = persistentní, přístupný i zvenku – ale jedna jednotka informace, ne celá databáze. Artefakty (anotace, skupina) průběh procesu nijak neovlivňují.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 40, quote: 'lokální proměnná v procesu (dočasná data)' },
      { kind: 'slide', doc: 'P09', page: 41, quote: 'persistentní data, informace v databázi nebo jiném systému' },
      { kind: 'slide', doc: 'P09', page: 42, quote: 'Objekty Artifact, nijak neovlivňují proces' },
    ],
  },
  {
    id: 'ch10-13',
    topic: 'bpmn',
    kind: 'mc',
    origin: { type: 'original', inspiredBy: 'P09 s. 63–76 (Časté chyby, Doporučené postupy)', why: 'Souhrn chyb ze slidů „přeškrtnuto → správně“.' },
    prompt: 'Které z následujících jsou podle přednášky <strong>chyby</strong> v BPMN modelu?',
    options: [
      'Subproces se dvěma startovními událostmi None, pro každou větev jedna.',
      'Sekvenční tok vedený zvenku přes hranici rozbaleného subprocesu přímo na aktivitu uvnitř něj.',
      'Proces startující přijetím objednávky od zákazníka začíná None start eventem, do kterého nevede tok zpráv.',
      'Dvě koncové události „Schváleno“ a „Zamítnuto“ místo jedné nepojmenované.',
      'Tok zpráv mezi dvěma pooly s popiskem „Objednávka“.',
    ],
    correct: [0, 1, 2],
    explanation:
      'Subproces má jedinou počáteční událost None; sekvenční tok nesmí překročit hranici subprocesu; proces spouštěný zprávou má mít Message start event. Pojmenované koncové stavy a popsané toky zpráv mezi pooly jsou naopak doporučené postupy.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 76, quote: 'Subproces má jedinou počáteční událost None' },
      { kind: 'slide', doc: 'P09', page: 65, quote: 'Sekvenční tok nesmí překročit hranici subprocesu' },
      { kind: 'slide', doc: 'P09', page: 73, quote: 'Používejte správné počáteční události' },
      { kind: 'slide', doc: 'P09', page: 74, quote: 'Každý koncový stav má vlastní pojmenovanou' },
    ],
  },
  {
    id: 'ch10-14',
    topic: 'bpmn',
    kind: 'tf',
    origin: { type: 'real', seen: ['Přednáška 9 (BPMN), Časté otázky'] },
    prompt:
      'Když se proces zruší po odeslání balíku, stačí v BPMN modelovat rollback jako v databázi – vrácením dat do předchozího stavu.',
    answer: false,
    explanation:
      'Odeslaný balík ani poskytnutou službu nelze „odvolat“ vrácením databáze. Kompenzace je další činnost (vrácení peněz, zpětná doprava), napojená na compensation boundary event asociací; i ta má náklady a může selhat.',
    verified: 'slides',
    sources: [
      { kind: 'slide', doc: 'P09', page: 79, quote: 'Kompenzace znamená další činnost, například vrácení peněz či zajištění' },
      { kind: 'slide', doc: 'P09', page: 61, quote: 'Association Link (ne Sequence Flow!).' },
    ],
  },
]
