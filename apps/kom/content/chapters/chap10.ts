import type { Chapter } from '../types'

export const chap10: Chapter = {
  id: 'chap-10',
  number: '10',
  title: 'BPMN',
  docs: ['P09', 'C10', 'C11'],
  exam: ['zkouska'],
  summary:
    'Umět přečíst a nakreslit procesní model v BPMN: události, aktivity, brány a jejich tokenová sémantika, sekvenční tok vs. tok zpráv, pooly a lanes, data – a poznat typické chyby (deadlock, tok přes hranici poolu, brána, která „rozhoduje“).',
  sections: [
    // ------------------------------------------------------------------
    {
      id: 'sec-10-1',
      number: '10.1',
      title: 'Proces a BPMN v kostce',
      blocks: [
        {
          kind: 'p',
          html:
            'OntoUML popisuje, <strong>co</strong> v doméně existuje (vůz, nájemce, nájem). BPMN popisuje <strong>chování</strong>: kdo co dělá, v jakém pořadí, na jaké události čeká a co se stane při výjimce. <strong>Proces</strong> je opakovatelný soubor navazujících činností, které ze vstupů pomocí zdrojů vyrábějí výstup pro zákazníka (i interního).',
          sources: [
            { kind: 'slide', doc: 'P09', page: 3, quote: 'Proces je soubor vzájemně souvisejících nebo vzájemně' },
            { kind: 'slide', doc: 'C10', page: 3 },
          ],
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>BPMN</strong> = Business Process Model and Notation, spravuje ho <strong>OMG</strong>, je to standard <strong>ISO/IEC 19510:2013</strong>.',
            'Navrženo jako „business-friendly“, ale model lze i <strong>vykonávat</strong> procesním strojem (orchestrace).',
            'Notace je kompromis: obsahuje nadbytečné konstrukty, totéž lze často vyjádřit více způsoby – proto je potřeba <strong>metoda a styl</strong>.',
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 6, quote: 'Ratifikovaný standard ISO/IEC 19510:2013' },
            { kind: 'slide', doc: 'P09', page: 7, quote: 'Obsahuje nadbytečné konstrukty a vzory: je více možností pro vyjádření toho samého' },
            { kind: 'web', label: 'OMG: BPMN 2.0 specification', url: 'https://www.omg.org/spec/BPMN/2.0/' },
          ],
        },
        {
          kind: 'table',
          head: ['Úroveň (Bruce Silver)', 'Pro koho', 'Co obsahuje'],
          rows: [
            ['<strong>Level 1</strong> – deskriptivní', 'netechničtí uživatelé', 'základní notace, mapování procesů shora dolů'],
            ['<strong>Level 2</strong> – analytické', 'společný jazyk business + IT', 'plná paleta symbolů: události, výjimky…'],
            ['<strong>Level 3</strong> – spustitelné', 'procesní stroj (BPMS)', 'navíc data, služby, zprávy, lidské úkoly pro spuštění'],
          ],
          caption: 'Tři úrovně použití BPMN',
          sources: [
            { kind: 'slide', doc: 'P09', page: 9, quote: 'Level 1: deskriptivní BPMN' },
            { kind: 'slide', doc: 'P09', page: 10, quote: 'Level 2: analytické BPMN' },
            { kind: 'slide', doc: 'P09', page: 11, quote: 'Level 3: executable (spustitelné) BPMN' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-order-level1.png',
          alt: 'Dva BPMN diagramy objednávky: nahoře lineární sekvence Receive Order, Check credit, Fulfill Order, Send invoice; dole totéž s XOR branami Enough credit? a In stock?, větve No vedou do koncové události Order failed.',
          caption:
            'Nejjednodušší procesní model (Level 1): start (tenký kroužek) → aktivity → konec (tlustý kroužek). Dole přibyly XOR brány, které testují podmínky „Enough credit?“ a „In stock?“, a druhý pojmenovaný konec „Order failed“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 15 }],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Čtyři základní stavební kameny',
          html:
            '<ul><li><strong>Události</strong> (kroužky) – něco <em>nastane</em>: start, mezilehlá, konec.</li><li><strong>Aktivity</strong> (zaoblené obdélníky) – <em>práce</em>: task nebo subproces.</li><li><strong>Brány</strong> (kosočtverce) – <em>řízení toku</em>: větvení a slučování.</li><li><strong>Spojnice</strong> – sekvenční tok (plná čára) uvnitř procesu, tok zpráv (čárkovaná) mezi pooly, asociace (tečkovaná) k datům a anotacím.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'C10', page: 5 },
            { kind: 'slide', doc: 'C10', page: 6 },
            { kind: 'slide', doc: 'C10', page: 7, quote: 'Gateways (brány) slouží k řízení toků (flows) v procesu' },
          ],
        },
        { kind: 'quiz', ids: ['ch10-01'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-2',
      number: '10.2',
      title: 'Aktivity: task a subproces',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Aktivita</strong> je jednotka práce v procesu. Atomická aktivita je <strong>task</strong>; aktivitu, která má vlastní vnitřní průběh, modelujeme jako <strong>subproces</strong> – sbalený (malé <code>+</code> dole) nebo rozbalený (vnitřek vidět v rámečku).',
          sources: [
            { kind: 'slide', doc: 'C10', page: 5, quote: 'Mohou být dále strukturovány pomocí subprocesu' },
            { kind: 'slide', doc: 'P09', page: 17 },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-activities-symbols.png',
          alt: 'Symboly aktivit: Activity (zaoblený obdélník), Sub-Process (čárkovaný), Transaction (dvojitý okraj), Call (tlustý okraj).',
          caption: 'Varianty aktivit: běžná aktivita, subproces, transakce (dvojitý okraj), call activity (tlustý okraj – volá jinde definovaný proces).',
          sources: [{ kind: 'slide', doc: 'C10', page: 5 }],
        },
        {
          kind: 'table',
          head: ['Typ tasku (ikonka vlevo nahoře)', 'Kdo ho vykoná'],
          rows: [
            ['<strong>Manual</strong> (ruka)', 'člověk, <em>bez</em> jakéhokoli spojení s procesním strojem'],
            ['<strong>User / Human</strong> (postavička)', 'člověk, ale <em>přes</em> procesní stroj (např. formulář)'],
            ['<strong>Service</strong> (ozubená kola)', 'automaticky, typicky voláním jiné služby'],
            ['<strong>Script</strong> (svitek)', 'automaticky, přímo procesní stroj sám'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 25, quote: 'vykonán bez jakéhokoliv spojení s workflow engine (procesním strojem)' },
            { kind: 'slide', doc: 'P09', page: 25, quote: 'automatizovaná aktivita vykonaná přímo procesním strojem samotným' },
          ],
        },
        {
          kind: 'table',
          head: ['Značka dole na aktivitě', 'Význam'],
          rows: [
            ['<strong>Loop</strong> (kruhová šipka)', 'opakuj, dokud neplatí podmínka (např. „Until approved“) – totéž jako aktivita + XOR brána se zpětnou větví'],
            ['<strong>Multi-instance</strong> paralelní <code>|||</code>', 'spusť N instancí najednou (např. „For each order item“) – totéž jako AND split → A1…An → AND join'],
            ['<strong>Multi-instance</strong> sekvenční <code>≡</code>', 'N instancí postupně za sebou'],
            ['<strong>Parallel box</strong>', 'všechny vnitřní aktivity začnou paralelně, pořadí není dané, všechny musí skončit'],
            ['<strong>Ad-hoc</strong> <code>~</code>', 'ne všechny aktivity musí proběhnout – určí vykonavatel'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 55 },
            { kind: 'slide', doc: 'P09', page: 56 },
            { kind: 'slide', doc: 'P09', page: 58 },
            { kind: 'slide', doc: 'P09', page: 26, quote: 'Ne všechny aktivity musí skončit (určí vykonavatel)' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-loop-multi.png',
          alt: 'Proces náboru: Post job, Receive and Screen (loop, Until 5 viable), Interview (multi-instance), Make offer; toky zpráv k black-box poolu Applicant.',
          caption: '„Receive and Screen“ se opakuje (loop), dokud není 5 vhodných kandidátů („Until 5 viable“); „Interview“ proběhne pro každého z nich (multi-instance).',
          sources: [{ kind: 'slide', doc: 'P09', page: 57 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Pojmenování: SLOVESO–PŘEDMĚT',
          html:
            'Aktivita je <em>akce</em>, ne funkce ani stav: <strong>Zkontrolovat bonitu</strong>, ne „Kontrola bonity“ (funkce) ani „Bonita v pořádku“ (stav). Vyhněte se jednoslovným názvům jako „Schválit“ nebo „Zpráva“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 70, quote: 'nebo stavy. Proto je pojmenovávejte ve tvaru SLOVESO–PŘEDMĚT.' }],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          title: 'Transakce a kompenzace',
          html:
            '<strong>Transakční subproces</strong> (dvojitý okraj) se chová jako ACID transakce v databázi. V reálném světě ale nejde vždy „vrátit stav“ – odeslaný balík zpět nezmizí. Proto <strong>kompenzace</strong>: na aktivitu se připojí <em>compensation boundary event</em> a <strong>asociací</strong> (ne sekvenčním tokem!) se propojí s kompenzační aktivitou (např. Charge credit card → Reverse charge), která se zavolá <em>po</em> selhání.',
          sources: [
            { kind: 'slide', doc: 'P09', page: 60, quote: 'reprezentuje atomické, konzistentní, izolované a trvalé akce (ACID)' },
            { kind: 'slide', doc: 'P09', page: 61, quote: 'Compensation Activity je volána po selhání aktivity.' },
            { kind: 'slide', doc: 'P09', page: 79, quote: 'Kompenzace znamená další činnost, například vrácení peněz či zajištění' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-compensation.png',
          alt: 'Service task Charge credit card s kompenzační boundary událostí, tečkovaná asociace vede ke kompenzační aktivitě Reverse charge.',
          caption: 'Kompenzace: boundary událost + kompenzační aktivita spojené tečkovanou asociací.',
          sources: [{ kind: 'slide', doc: 'P09', page: 61, quote: 'Association Link (ne Sequence Flow!).' }],
        },
        { kind: 'quiz', ids: ['ch10-02', 'ch10-03'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-3',
      number: '10.3',
      title: 'Události',
      blocks: [
        {
          kind: 'p',
          html:
            'Událost je něco, co <em>nastane</em> (na rozdíl od aktivity, kterou někdo <em>dělá</em>). Podle polohy v procesu: <strong>start</strong> (tenký kroužek), <strong>mezilehlá</strong> (dvojitý kroužek), <strong>koncová</strong> (tlustý kroužek). Ikonka uvnitř říká <strong>typ</strong> (zpráva, časovač, signál…).',
          sources: [{ kind: 'slide', doc: 'C10', page: 6, quote: 'Události typů: start, intermediary, end' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-events-table.png',
          alt: 'Tabulka typů událostí BPMN (Message, Timer, Error, Escalation, Cancel, Compensation, Conditional, Link, Signal, Terminate, Multiple, Parallel Multiple) ve sloupcích Catching, Throwing a Non-Interrupting.',
          caption: 'Přehled typů událostí. Catching = prázdná ikona (čeká), throwing = plná ikona (vysílá), non-interrupting = čárkovaný okraj.',
          sources: [{ kind: 'slide', doc: 'C10', page: 6 }],
        },
        {
          kind: 'table',
          head: ['Kde', 'Typ', 'Význam'],
          rows: [
            ['Start', '<strong>None</strong>', 'nespecifikováno / ruční spuštění; <strong>vždy</strong> pro subproces'],
            ['Start', '<strong>Message</strong>', 'proces začne přijetím zprávy zvenku („Receive X…“)'],
            ['Start', '<strong>Timer</strong>', 'naplánovaný proces („Weekly“, „Every 4 hours“)'],
            ['Start / konec', '<strong>Multiple</strong>', 'kombinace více spouštěčů / více výsledků'],
            ['Konec', '<strong>None</strong>', 'nic se neposílá; jen ukončí danou cestu'],
            ['Konec', '<strong>Message</strong>', 'při dosažení se odešle zpráva (obvykle výsledek procesu)'],
            ['Konec', '<strong>Terminate</strong>', '(sub)proces se <strong>okamžitě</strong> ukončí, i když jiné paralelní cesty ještě běží'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 37, quote: 'None: Není blíže specifikováno nebo začíná manuálně, *vždy* pro subproces' },
            { kind: 'slide', doc: 'P09', page: 39, quote: 'Terminate: Při dosažení se okamžitě (sub)proces ukončí i pokud některé paralelní' },
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          title: 'Catching × throwing',
          html:
            '<strong>Catching</strong> mezilehlá událost = proces <em>čeká</em> na spouštěč (prázdná ikona). <strong>Throwing</strong> = proces spouštěč <em>generuje</em> (plná ikona). Rozlišení „plností symbolu“ zavedlo BPMN 1.1; BPMN 2.0 přidalo <strong>nepřerušující</strong> události (čárkované kolečko).',
          sources: [
            { kind: 'slide', doc: 'P09', page: 43, quote: 'Catching Intermediate Event = proces čeká na spouštěcí signál' },
            { kind: 'slide', doc: 'P09', page: 14, quote: 'Přidává nepřerušující události (čárkované kolečko)' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-throw-catch.png',
          alt: 'Proces vydání karty: Receive application, Verify completeness, XOR Info complete?; větev no: throwing message Request info, catching message Receive response; pak Process application a message end Card issued.',
          caption: '„Request info“ je throwing message (plná obálka, zpráva odchází), „Receive response“ catching message (prázdná obálka, proces čeká).',
          sources: [{ kind: 'slide', doc: 'P09', page: 45 }],
        },
        {
          kind: 'table',
          head: ['Další typy', 'Jak si je zapamatovat'],
          rows: [
            ['<strong>Timer</strong> (mezilehlý)', 'proces čeká danou dobu nebo do data („10 min“, „15th or 30th of month“)'],
            ['<strong>Signal</strong>', 'broadcast M vysílačů → N přijímačů; žádné spojnice, páruje se <strong>názvem</strong>'],
            ['<strong>Escalation</strong>', 'non-interrupting výjimka uvnitř aktivity – běží paralelně (např. „Consult tech specialist“)'],
            ['<strong>Conditional</strong>', 'průběžně hlídaná datová podmínka; když začne platit, událost nastane'],
            ['<strong>Link</strong>', 'jen kreslicí zkratka místo dlouhé čáry, bez významu'],
            ['<strong>Error</strong>, <strong>Cancel</strong>, <strong>Compensation</strong>', 'chyba / zrušení transakce / spuštění kompenzace'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 44 },
            { kind: 'slide', doc: 'P09', page: 51, quote: 'Používá se pro broadcasting událostí, tj. M vysílačů a N přijímačů.' },
            { kind: 'slide', doc: 'P09', page: 50, quote: 'jedná se o non-interrupting výjimku v rámci' },
            { kind: 'slide', doc: 'P09', page: 52, quote: 'Kontinuálně monitorovaná datová podmínka' },
            { kind: 'slide', doc: 'P09', page: 53, quote: 'Nemá žádný speciální význam, jedná se jen pomůcku pro malování.' },
          ],
        },
        { kind: 'quiz', ids: ['ch10-04', 'ch10-05'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-4',
      number: '10.4',
      title: 'Brány a tokeny',
      blocks: [
        {
          kind: 'p',
          html:
            'Sémantiku BPMN si nejlépe představíš pomocí <strong>tokenů</strong>: startovní událost vytvoří token, ten putuje po sekvenčním toku, aktivita ho „spotřebuje“ a po dokončení pošle dál. <strong>Brány</strong> rozhodují, kolik tokenů a kam odejde (split) a na kolik se čeká (join). Alternativní cesty se v BPMN dělají <strong>vždy branou</strong> – ne podmíněnými šipkami přímo z aktivity.',
          sources: [{ kind: 'slide', doc: 'P09', page: 27, quote: 'Pro alternativní cesty v procesu je nutné využít brány (Gateway)' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-gateways-symbols.png',
          alt: 'Symboly bran: Exclusive (X), Event-based (pětiúhelník v kroužku), Parallel (+), Inclusive (kroužek), Exclusive Event-based, Parallel Event-based.',
          caption: 'Typy bran. Prázdný kosočtverec bez značky = XOR.',
          sources: [{ kind: 'slide', doc: 'C10', page: 7 }],
        },
        {
          kind: 'table',
          head: ['Brána', 'Split (větvení)', 'Join (slučování)'],
          rows: [
            ['<strong>XOR</strong> (exclusive) <code>X</code> / prázdná', 'token jde <strong>přesně jednou</strong> cestou – první platná podmínka, jinak default', 'každý příchozí token propustí hned, nečeká'],
            ['<strong>AND</strong> (parallel) <code>+</code>', 'token se rozdělí do <strong>všech</strong> větví', 'čeká, až dorazí token z <strong>každé</strong> větve (synchronizace)'],
            ['<strong>OR</strong> (inclusive) <code>○</code>', 'token do <strong>každé</strong> větve, jejíž podmínka platí (1 až všechny)', 'čeká na všechny tokeny, které skutečně vznikly'],
            ['<strong>Event-based</strong>', 'token čeká; pokračuje větev té události, která nastane <strong>první</strong>', '—'],
            ['<strong>Complex</strong> <code>✱</code>', 'chování, které jiná brána nevyjádří – podmínka v textové anotaci („Whichever completes first“)', ''],
          ],
          caption: 'Tokenová sémantika bran',
          sources: [
            { kind: 'slide', doc: 'P09', page: 28, quote: 'Exclusive (XOR) gateway = přesně jedna cesta je vybrána' },
            { kind: 'slide', doc: 'P09', page: 30, quote: 'Parallel (AND) gateway (parallel split, AND-split) = všechny cesty pokračují' },
            { kind: 'slide', doc: 'P09', page: 31, quote: 'Inclusive (OR) gateway = podmínky jsou navzájem nezávislé (nevylučují se)' },
            { kind: 'slide', doc: 'P09', page: 36, quote: 'Chování, které nemůže být vystiženo jinou bránou' },
          ],
        },
        {
          kind: 'interactive',
          component: 'bpmn-tokens',
          title: 'Pusť tokeny branami',
          hint: 'Zkus kombinace split/join: XOR split + AND join (deadlock), OR split bez joinu (aktivita za ním proběhne vícekrát), AND split + AND join (synchronizace).',
        },
        {
          kind: 'figure',
          src: '/figures/ch10-and-gateway.png',
          alt: 'Enter vehicle data, AND split na Pass smog check a Provide proof of insurance, AND join, Pay renewal fee.',
          caption: 'AND: obě kontroly běží souběžně; „Pay renewal fee“ začne až po dokončení obou. Za parallel split vždy následuje parallel join.',
          sources: [{ kind: 'slide', doc: 'P09', page: 30, quote: 'Vždy následuje parallel join (synchronizace)' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-or-gateway.png',
          alt: 'Draft contract, OR split: větev Always na Conduct financial review a větev If technical contract na Conduct technical review, OR join.',
          caption: 'OR: finanční revize proběhne vždy, technická jen u technické smlouvy. OR join počká na obě, jen pokud obě vznikly.',
          sources: [{ kind: 'slide', doc: 'P09', page: 31 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Default větev',
          html:
            'Větev s lomítkem u brány je <strong>default</strong>: použije se jen tehdy, když <em>žádná</em> jiná podmínka neplatí. U XOR: „(A nebo B), jinak C“; u OR: „pokud ani A ani B, pak C“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 32 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-merging-paths.png',
          alt: 'Best Practice: Split with it, Merge with it. Správně: XOR split a slití přímo do Z nebo XOR merge. Špatně: XOR split a AND merge – deadlock. Špatně: OR split a slití přímo do Z – no synchronization.',
          caption: '„Split with it, merge with it“ – slučuj stejným typem brány, jakým jsi větvil.',
          sources: [{ kind: 'slide', doc: 'P09', page: 35 }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Deadlock a chybějící synchronizace',
          html:
            '<ul><li><strong>XOR split → AND join</strong>: vznikne jediný token, AND join ale čeká na token z každé větve → <strong>deadlock</strong>, proces se zasekne.</li><li><strong>OR (nebo AND) split → slití bez brány</strong>: do Z dorazí několik tokenů, každý ho spustí znovu → <strong>žádná synchronizace</strong>, Z proběhne vícekrát.</li><li><strong>XOR split → slití bez brány</strong> je v pořádku: token je vždy jen jeden.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P09', page: 34 },
            { kind: 'slide', doc: 'P09', page: 35 },
          ],
        },
        {
          kind: 'callout',
          type: 'past',
          title: 'Brána nerozhoduje, jen testuje',
          html:
            'Na rozdíl od vývojového diagramu (flowchart) brána <strong>nedělá rozhodnutí</strong>. Někdo (aktivita) musí rozhodnout – brána jen otestuje výsledek. Proto „Draft report → Approved?“ je špatně, správně „Draft report → <strong>Review report</strong> → Approved?“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 28, quote: 'Brány nemohou dělat rozhodnutí, jen testovat podmínky' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-xor-test-not-decide.png',
          alt: 'Přeškrtnuto: Draft report přímo do brány Approved?. Správně: Draft report, Review report, brána Approved?.',
          caption: 'Nahoře špatně (kdo schvaluje?), dole správně – rozhodnutí je aktivita „Review report“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 28 }],
        },
        { kind: 'quiz', ids: ['ch10-06', 'ch10-07', 'ch10-08'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-5',
      number: '10.5',
      title: 'Čekání na událost: event-based gateway',
      blocks: [
        {
          kind: 'p',
          html:
            'Datová XOR brána vybírá cestu podle údajů, které <strong>už máme</strong>. Když ale proces na odpověď teprve <strong>čeká</strong> a neví, co přijde (odpověď? zamítnutí? nic?), použijeme <strong>event-based gateway</strong>: za ní stojí <em>catching</em> události nebo receive tasky a pokračuje ta větev, jejíž událost nastane <strong>jako první</strong>; ostatní se zahodí.',
          sources: [
            { kind: 'slide', doc: 'P09', page: 46, quote: 'Tato brána je vždy následována catching událostmi nebo receive tasky.' },
            { kind: 'slide', doc: 'P09', page: 78, quote: 'Datová XOR brána vybírá cestu podle již dostupných údajů.' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-event-gateway-timeout.png',
          alt: 'Wait for response or timeout: po Request info následuje event-based brána, jedna větev Receive response (zpráva od zákazníka), druhá timer 7 days vedoucí do message end Rejected.',
          caption: 'Vzor „čekej na odpověď, nebo timeout“: buď do 7 dní přijde „Info response“, nebo vyprší časovač a žádost se zamítne.',
          sources: [{ kind: 'slide', doc: 'P09', page: 49 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-no-event-gateway.png',
          alt: 'Horší alternativa: Submit for approval, Receive Response (jedna zpráva), pak datová brána Approved? s větvemi no (Rejected) a yes (Continue).',
          caption: 'Horší alternativa: jedna obecná zpráva „Response“ a pak datová brána. Větvení de facto probíhá podle rozhodnutí odesílatele – méně konceptuálně čisté než dvě různé zprávy (Approval / Rejection) za event-based gateway.',
          sources: [{ kind: 'slide', doc: 'P09', page: 48, quote: 'větvení de-facto probíhá na základě rozhodování odesílatele' }],
        },
        {
          kind: 'callout',
          type: 'past',
          title: '„Rozhodni podle odpovědi“ ≠ „počkej na odpověď“',
          html:
            'Pokud za „Request info“ dáš rovnou datovou XOR bránu „Odpověď přišla?“, model rozhoduje podle informace, kterou <strong>ještě nemá</strong>. Čekání na první z několika událostí (zpráva × časovač) = <strong>event-based gateway</strong>.',
          sources: [{ kind: 'slide', doc: 'P09', page: 78 }],
        },
        { kind: 'quiz', ids: ['ch10-09'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-6',
      number: '10.6',
      title: 'Pooly, lanes a toky zpráv',
      blocks: [
        {
          kind: 'p',
          html:
            '<strong>Pool</strong> = jeden účastník a jeho proces. <strong>Lanes</strong> (swimlanes) dělí pool podle rolí nebo oddělení, které aktivity vykonávají. Uvnitř poolu vede <strong>sekvenční tok</strong> (plná čára se šipkou) i přes hranice lanes.',
          sources: [{ kind: 'slide', doc: 'P09', page: 16 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-pool-lanes.png',
          alt: 'Pool Order Process s lanes Sales, Finance, Warehouse; Receive Order (user task), Check Credit (service task), brána Credit OK?, Fulfill Order (subproces), In stock?, Send Invoice, koncové události Order failed a Order complete.',
          caption: 'Jeden pool „Order Process“, tři lanes. Sekvenční tok přechází mezi lanes bez problému. Popsané prvky: user task, service task, subproces.',
          sources: [{ kind: 'slide', doc: 'P09', page: 16 }],
        },
        {
          kind: 'table',
          head: ['', 'Sekvenční tok', 'Tok zpráv (message flow)'],
          rows: [
            ['Kresba', 'plná čára, plná šipka', 'čárkovaná čára, kolečko na začátku, prázdná šipka'],
            ['Spojuje', 'prvky <strong>v jednom</strong> poolu (i přes lanes)', 'prvky <strong>různých</strong> poolů'],
            ['Význam', 'pořadí – co následuje po čem', 'komunikace – kdo komu posílá zprávu'],
            ['Hranice poolu', '<strong>nesmí</strong> překročit', 'vždy ji překračuje'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 64, quote: 'Sekvenční tok nesmí překročit hranici poolu (procesu)' },
            { kind: 'slide', doc: 'P09', page: 66, quote: 'Tok zpráv nesmí spojovat prvky ve stejném poolu' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-message-flow.png',
          alt: 'Black-box pool Customer nahoře, pod ním pool Order process s lanes; toky zpráv Order, Offer, Offer response, Rejection notice, Invoice; message start event Receive order a message end events.',
          caption: 'Zákazník jako black-box pool (externí účastník, jeho vnitřek nás nezajímá). Proces startuje message start eventem „Receive order“ a končí message end eventy.',
          sources: [{ kind: 'slide', doc: 'P09', page: 21 }],
        },
        {
          kind: 'callout',
          type: 'pravidlo',
          title: 'Zpráva je komunikace bod–bod',
          html:
            'Událost <strong>Message</strong> má kardinalitu <strong>1:1</strong> – jeden odesílatel, jeden příjemce. Pro <strong>1:N</strong> (rozeslat všem) použij <strong>Signal</strong>; pro <strong>N:1</strong> (zachytit kterýkoli z několika podnětů) catching <strong>Multiple</strong>.',
          sources: [
            { kind: 'slide', doc: 'P09', page: 67, quote: 'Událost Message musí mít vždy kardinalitu 1:1' },
            { kind: 'slide', doc: 'P09', page: 68, quote: 'Signal rozešle jeden podnět všem odpovídajícím příjemcům.' },
            { kind: 'slide', doc: 'P09', page: 68, quote: 'Multiple zachytí jeden z několika explicitně definovaných podnětů.' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-message-1to1.png',
          alt: 'Přeškrtnuto: jedna událost Message s toky zpráv ke třem příjemcům (1:N) a tři odesílatelé posílající zprávy do jedné události Message (N:1).',
          caption: 'Špatně: jedna událost Message pro více příjemců (1:N) nebo sloučení více odesílatelů do jedné události Message (N:1).',
          sources: [{ kind: 'slide', doc: 'P09', page: 67, quote: 'Každou událost Message modelujte jako komunikaci jednoho odesílatele s jedním' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-signal-multiple.png',
          alt: 'Vlevo Signal: vysílač rozešle Změna stavu příjemcům A, B, C bez toku zpráv. Vpravo Multiple: proces objednávky zachytí jednu ze zpráv od Platební služby, Skladu nebo Zákazníka.',
          caption: 'Správná řešení pro 1:N (Signal, páruje se názvem, bez toku zpráv) a N:1 (catching Multiple).',
          sources: [{ kind: 'slide', doc: 'P09', page: 68 }],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Doporučení k tokům zpráv',
          html:
            '<ul><li>Toky zpráv jsou v BPMN volitelné, ale v hotovém modelu je kresli ke <strong>všem</strong> událostem Message. Pokud odesílatele nechceš kreslit, zvaž událost <strong>Conditional</strong>.</li><li><strong>Popisuj</strong> všechny toky zpráv – u black-box poolů je to nezbytné.</li><li>Když proces startuje přijetím zprávy, použij <strong>Message start event</strong>, ne None start.</li></ul>',
          sources: [
            { kind: 'slide', doc: 'P09', page: 71, quote: 'Toky zpráv jsou v BPMN volitelné.' },
            { kind: 'slide', doc: 'P09', page: 72, quote: 'U black-box poolů jsou' },
            { kind: 'slide', doc: 'P09', page: 73, quote: 'Používejte správné počáteční události' },
          ],
        },
        { kind: 'quiz', ids: ['ch10-10', 'ch10-11'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-7',
      number: '10.7',
      title: 'Data a artefakty',
      blocks: [
        {
          kind: 'table',
          head: ['', 'Data Object (list papíru)', 'Data Store (válec)'],
          rows: [
            ['Co to je', '<strong>lokální proměnná</strong> procesu – dočasná data', '<strong>persistentní</strong> data v databázi či jiném systému'],
            ['Kdo vidí', 'prvky stejného procesu a jeho podprocesů', 'proces i entity <strong>zvenku</strong> (dotazy, aktualizace)'],
            ['Po skončení procesu', '<strong>zmizí</strong>', '<strong>nezmizí</strong>'],
            ['Pozor', '', 'jedna jednotka informace (např. Customer Account), <strong>ne celá databáze</strong>'],
          ],
          sources: [
            { kind: 'slide', doc: 'P09', page: 40, quote: 'lokální proměnná v procesu (dočasná data)' },
            { kind: 'slide', doc: 'P09', page: 41, quote: 'může být dotazován a aktualizován procesem i entitami z vnějšku' },
            { kind: 'slide', doc: 'P09', page: 41, quote: 'nezmizí s koncem procesu' },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-data-store.png',
          alt: 'Check Credit zapisuje data object Order, Process Order ho čte; Process Order aktualizuje data store Customer Account (Update balance).',
          caption: 'Data se připojují tečkovanou datovou asociací, ne sekvenčním tokem. Order = data object, Customer Account = data store.',
          sources: [{ kind: 'slide', doc: 'P09', page: 41 }],
        },
        {
          kind: 'p',
          html:
            '<strong>Artefakty</strong> – <em>textová anotace</em> (hranatá závorka s tečkovanou čarou) a <em>skupina</em> (čerchovaný rámeček) – průběh procesu <strong>nijak neovlivňují</strong>, jen ho vysvětlují.',
          sources: [{ kind: 'slide', doc: 'P09', page: 42, quote: 'Objekty Artifact, nijak neovlivňují proces' }],
        },
        { kind: 'quiz', ids: ['ch10-12'] },
      ],
    },
    // ------------------------------------------------------------------
    {
      id: 'sec-10-8',
      number: '10.8',
      title: 'Typické chyby a doporučené postupy',
      blocks: [
        {
          kind: 'p',
          html:
            'Tyhle chyby se opakují v semestrálkách i na cvičení (taxislužba, vlastní doména). Každá má na slidech dvojici „přeškrtnuto → správně“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 63 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-err-pool-boundary.png',
          alt: 'Přeškrtnuto: sekvenční tok z konce Process 1 do startu Process 2. Správně: message end event v Process 1, tok zpráv do message start eventu v Process 2.',
          caption: '① Sekvenční tok nesmí překročit hranici poolu. Mezi procesy komunikuje jen tok zpráv (message end → message start).',
          sources: [{ kind: 'slide', doc: 'P09', page: 64 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-err-message-same-pool.png',
          alt: 'Přeškrtnuto: tok zpráv Request resubmit mezi lanes Manager a Employee téhož poolu Budget Process. Správně: brána OK? a aktivita Request resubmit se sekvenčním tokem zpět na Prepare Budget.',
          caption: '② Tok zpráv nesmí spojovat prvky ve stejném poolu – lanes jednoho procesu spojuje sekvenční tok.',
          sources: [{ kind: 'slide', doc: 'P09', page: 66 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-err-no-gateway.png',
          alt: 'Přeškrtnuto: z aktivity Review claim vedou dvě podmíněné šipky Info incomplete a Info complete bez brány.',
          caption: '③ Alternativní cesty bez brány (podmíněné šipky přímo z aktivity) – použij XOR bránu „Info complete?“.',
          sources: [{ kind: 'slide', doc: 'P09', page: 27 }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-end-events-named.png',
          alt: 'Přeškrtnuto: obě větve Approved? vedou do jedné nepojmenované koncové události. Správně: dvě koncové události Approved a Rejected.',
          caption: '④ Každý koncový stav má vlastní pojmenovanou koncovou událost (Approved / Rejected).',
          sources: [{ kind: 'slide', doc: 'P09', page: 74, quote: 'Každý koncový stav má vlastní pojmenovanou' }],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-subprocess-start.png',
          alt: 'Přeškrtnuto: subproces Register applicant se dvěma startovními událostmi. Správně: jediná None start, po ní brána Application on file?.',
          caption: '⑤ Subproces má jedinou počáteční událost None; větvení uvnitř řeší brána. (A sekvenční tok nesmí překročit hranici subprocesu.)',
          sources: [
            { kind: 'slide', doc: 'P09', page: 76, quote: 'Subproces má jedinou počáteční událost None' },
            { kind: 'slide', doc: 'P09', page: 65, quote: 'Sekvenční tok nesmí překročit hranici subprocesu' },
          ],
        },
        {
          kind: 'callout',
          type: 'shrnuti',
          title: 'Kontrolní seznam před odevzdáním',
          html:
            '<ol><li>Sekvenční tok jen uvnitř poolu, tok zpráv jen mezi pooly.</li><li>Žádný sekvenční tok přes hranici subprocesu; subproces má jediný None start.</li><li>Větvení vždy branou; brána jen testuje – rozhodnutí je aktivita před ní.</li><li>Slučuj stejným typem brány, jakým jsi větvil (žádný XOR→AND deadlock).</li><li>Čekání na odpověď / timeout = event-based gateway.</li><li>Aktivity SLOVESO–PŘEDMĚT, koncové události pojmenované podle stavu.</li><li>Message start, když proces začíná zprávou; všechny toky zpráv popsané.</li><li>Rozlišuj koncové stavy subprocesu, aby za ním brána měla co testovat.</li></ol>',
          sources: [
            { kind: 'slide', doc: 'P09', page: 75, quote: 'Rozlišujte koncové stavy subprocesu' },
            { kind: 'slide', doc: 'P09', page: 70 },
          ],
        },
        {
          kind: 'figure',
          src: '/figures/ch10-bank-example.png',
          alt: 'Příklad z cvičení: black-box pool Customer a pool Bank s lanes Sales rep, Sales manager, Risk Analyst; Credit request, Review request, AND split, XOR Standard terms applicable?, Calculate terms nebo Prepare special terms, XOR merge, Prepare contract, AND join s Assess risks, Send quote, Quote sent.',
          caption: 'Ukázkový model z cvičení – všimni si párování bran: AND split ↔ AND join (souběžné posouzení rizik), XOR split ↔ XOR merge (standardní / speciální podmínky).',
          sources: [{ kind: 'slide', doc: 'C10', page: 8 }],
        },
        {
          kind: 'callout',
          type: 'priklad',
          title: 'Cvičení: taxislužba',
          html:
            'Zadání: zákazník (externí participant) objedná taxi u dispečera, dispečer naplánuje jízdu do směny řidiče, řidič zákazníka vyzvedne (pokud tam je) a hlásí stav, po dojetí zákazník zaplatí. <strong>Náš tip k řešení:</strong> Zákazník = black-box pool s toky zpráv (objednávka, platba); dispečer a řidič = lanes poolu taxislužby spojené sekvenčním tokem; „pokud tam je“ = aktivita „Zkontrolovat přítomnost zákazníka“ + XOR brána (nebo event-based brána s časovačem, pokud řidič na zákazníka čeká); dva pojmenované konce „Jízda dokončena“ / „Jízda zrušena“.',
          sources: [{ kind: 'slide', doc: 'C10', page: 9, quote: 'Zákazník (externí participant) objednává taxi od dispečera' }],
        },
        { kind: 'quiz', ids: ['ch10-13', 'ch10-14'] },
      ],
    },
  ],
}
