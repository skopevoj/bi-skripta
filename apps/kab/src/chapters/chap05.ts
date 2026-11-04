import type { Chapter } from '../types'

export const chap05: Chapter = {
  id: 'chap-5',
  number: '5',
  title: 'Hašovací funkce, SHA-x, HMAC',
  sections: [
    {
      id: 'sec-5-1',
      number: '5.1',
      title: 'Jednosměrné funkce a hašovací funkce',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '5.1',
          title: 'Jednosměrná funkce',
          html: 'Funkce $f: X \\to Y$, kde je snadné spočítat $y = f(x)$, ale pro náhodně zvolené $y$ je výpočetně nemožné nalézt vzor $x$. Dva typy: <strong>(1)</strong> jen jednosměrná (teoreticky lze, ale ne v rozumném čase — např. násobení vs. faktorizace), <strong>(2)</strong> s padacími vrátky (inverzi zvládne pouze ten, kdo zná klíč).',
          plain:
            'Funkce, která se snadno spočítá jedním směrem, ale prakticky se nedá obrátit. Příklad: snadno spočítáte součin dvou prvočísel, ale rozklad zpět je peklo. Padací vrátka jsou trik, který se znalostí tajné informace inverzi umožní — to je podstata asymetrické kryptografie.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.2',
          title: 'Hašovací funkce',
          html: 'Funkce $h: X \\to \\{0,1\\}^n$, kde $X$ je množina všech binárních řetězců délky $0$ až $d$. Musí být <strong>jednosměrná 1. typu</strong> a <strong>bezkolizní</strong>. Výstup délky $n$ se nazývá <em>haš</em>.',
          plain:
            'Vyrobí z libovolně dlouhých dat krátký „otisk“ pevné délky. Slouží k ověření, že se data nezměnila — i drobná změna mění celý haš. Používá se třeba u stažených souborů: zveřejněný haš si stáhnete a porovnáte s tím, který si spočítáte sami.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.3',
          title: 'Bezkoliznost',
          html: '<ul><li><strong>1. řádu (collision resistance):</strong> výpočetně nemožné nalézt libovolné $M \\ne M\'$ s $h(M) = h(M\')$.</li><li><strong>2. řádu (2nd preimage):</strong> pro daný vzor $x$ je nemožné najít $y \\ne x$ s $h(x) = h(y)$.</li></ul>',
          plain:
            'Bez kolizí by haš neměl smysl jako důkaz nezměněnosti. 1. řád = útočník najde libovolné dva soubory se stejným hašem; 2. řád = pro konkrétní soubor najde jiný se stejným hašem. Druhý útok je mnohem těžší — kdo by to uměl, mohl by podvrhnout konkrétní dokument.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '5.1',
          title: 'Odolnost vůči nalezení kolize',
          html: 'Pokud se hašovací funkce chová jako náhodné orákulum, složitost nalezení kolize 1. řádu je $\\approx 2^{n/2}$ (z narozeninového paradoxu), kolize 2. řádu $\\approx 2^n$. Pro SHA-1 (160 b) je to $2^{80}$ resp. $2^{160}$.',
        },
        {
          kind: 'interactive',
          component: 'avalanche',
          title: 'Lavinový efekt',
          hint: 'Změňte jedno písmeno a sledujte, jak se přepíše polovina bitů haše.',
        },
      ],
    },
    {
      id: 'sec-5-2',
      number: '5.2',
      title: 'Narozeninový paradox',
      blocks: [
        {
          kind: 'callout',
          type: 'veta',
          number: '5.1',
          title: 'Narozeninový paradox',
          html: 'Pro $n$ velkých a $k = O(n^{1/2})$ je pravděpodobnost nalezení 2 shodných prvků při výběru $P(n, k) \\approx 1 - \\exp(-k^2/(2n))$. Pro $b$-bitovou hašovací funkci stačí cca $2^{b/2}$ zpráv ke kolizi s pravděpodobností ~50&nbsp;%.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '5.1',
          title: 'Narozeniny',
          html: 'Pro 23 osob je $P(365, 23) = 0{,}507$ — větší než 50&nbsp;% šance, že 2 mají narozeniny ve stejný den. Paradox plyne z toho, že obvykle intuitivně hledáme „k danému člověku“ (kolize 2. řádu) místo „jakékoli dvojici“ (kolize 1. řádu).',
        },
        {
          kind: 'interactive',
          component: 'birthday',
          title: 'Narozeninový paradox',
          hint: 'Posouvejte počet lidí k a sledujte, jak rychle roste šance, že se libovolní dva shodují.',
        },
      ],
    },
    {
      id: 'sec-5-3',
      number: '5.3',
      title: 'Damgård–Merklova konstrukce',
      blocks: [
        {
          kind: 'p',
          html: 'Vstupní zpráva může být velmi dlouhá → nutnost <strong>zpracování po blocích</strong>. Před hašováním se zpráva zarovná: připojí se bit 1, doplní bity 0 a 64 bitů s délkou původní zprávy (<strong>Damgård-Merklovo zesílení</strong>, blok 512 b).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.4',
          title: 'Iterativní hašovací funkce',
          html: '$H_0 = \\text{IV}$, $H_i = f(H_{i-1}, M_i)$ pro $i = 1, \\dots, N$. Hodnota $H_i$ se nazývá <em>kontext</em>. Funkce $f$ je <strong>kompresní</strong> — má dva vstupy (kontext + blok) a výstup velikosti kontextu.',
          plain:
            'Recept, jak z malé „kompresní“ funkce postavit haš pro libovolně dlouhou zprávu. Zpráva se rozdělí na bloky a každý blok pomalu mixuje běžící mezivýsledek (kontext). Tahle myšlenka stojí za MD5, SHA-1 i SHA-2.',
        },
        {
          kind: 'diagram',
          component: 'merkle-damgard',
          caption: 'Obr. 5.1: Damgård–Merklova konstrukce. Kontext Hᵢ se řetězí zleva doprava od IV; každý blok zprávy Mᵢ vstupuje do kompresní funkce f shora, finální Hₙ = h(M).',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '5.2',
          title: 'Bezpečnost DM konstrukce',
          html: 'Je-li kompresní funkce $f$ bezkolizní, je <strong>bezkolizní i celá iterovaná hašovací funkce</strong>. Toto tvrzení je bezpečnostním základem všech moderních hašovacích funkcí (vyjma SHA-3).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.5',
          title: 'Davies-Meyerova konstrukce',
          html: 'Kompresní funkce z blokové šifry $E_M$: $H_i = E_{M_i}(H_{i-1}) \\oplus H_{i-1}$. Přičtení vstupu maskuje výstup a posiluje jednosměrnost.',
          plain:
            'Recept, jak z blokové šifry udělat kompresní funkci pro haš. Blok zprávy se použije jako klíč a šifruje se s ním kontext — výsledek se ještě XOR-uje se vstupem, aby šel proces obtížně obrátit.',
        },
      ],
    },
    {
      id: 'sec-5-4',
      number: '5.4',
      title: 'SHA-1',
      blocks: [
        {
          kind: 'p',
          html: 'SHA-1 (FIPS 180-1, 1995) má 160-bitový haš, zpracovává bloky 512 b, zprávy do $2^{64}-1$ b. <strong>Prolomena</strong> (kolize 1. řádu nalezena 2017). Kontext: 5 × 32 b slov $A, B, C, D, E$. Kompresní funkce: 80 rund (4 skupiny po 20).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.6',
          title: 'SHA-1 — expanze zprávy',
          html: 'Pro $t = 0, \\dots, 15$: $W_t = m_t$. Pro $t = 16, \\dots, 79$: $W_t = (W_{t-16} \\oplus W_{t-14} \\oplus W_{t-8} \\oplus W_{t-3}) \\lll 1$.',
          plain:
            'Z 16 slov vstupního bloku se „natáhne“ 80 slov potřebných pro všech 80 rund SHA-1. Slouží k tomu, aby se každý bit zprávy zapojil do více rund a více se „rozléval“ po výstupu.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.7',
          title: 'SHA-1 — runda',
          html: 'V každé rundě $E := D$; $D := C$; $C := B \\lll 30$; $B := A$; $A := (A \\lll 5) \\boxplus F_t(B,C,D) \\boxplus E \\boxplus W_t \\boxplus K_t$. Funkce $F_t$: rundy 0–19 $(b\\wedge c) \\vee (\\bar b \\wedge d)$; 20–39, 60–79 $b \\oplus c \\oplus d$; 40–59 majorita.',
          plain:
            'Jeden krok promíchání kontextu SHA-1. Pět slov A-E se v každé rundě cyklicky posune a do nového A se namixují všechny ostatní spolu se slovem zprávy a konstantou. Opakuje se 80×, aby se každý bit zprávy promítl do celého výstupu.',
        },
        {
          kind: 'interactive',
          component: 'sha1',
          title: 'SHA-1 krok za krokem',
          hint: 'Napište zprávu, podívejte se na její zarovnání na 512bitový blok a krokujte 80 rund kompresní funkce.',
        },
      ],
    },
    {
      id: 'sec-5-5',
      number: '5.5',
      title: 'SHA-2 (SHA-256, 384, 512)',
      blocks: [
        {
          kind: 'p',
          html: 'Sada SHA-2 (FIPS 180-2) zavedla bezpečné nástupce SHA-1. Stejná DM konstrukce, jiné parametry:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>SHA-256</strong>: blok 512 b, slovo 32 b, kontext 256 b, 64 rund, bezpečnost 128 b.',
            '<strong>SHA-384</strong>: blok 1024 b, slovo 64 b, kontext 384 b, 80 rund, bezpečnost 192 b.',
            '<strong>SHA-512</strong>: blok 1024 b, slovo 64 b, kontext 512 b, 80 rund, bezpečnost 256 b.',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.8',
          title: 'SHA-256 — pomocné funkce',
          html: '$Ch(x,y,z) = (x\\wedge y) \\oplus (\\bar x \\wedge z)$; $Ma(x,y,z) = (x\\wedge y) \\oplus (x\\wedge z) \\oplus (y\\wedge z)$; $\\Sigma_0 = ROTR_2 \\oplus ROTR_{13} \\oplus ROTR_{22}$; $\\Sigma_1 = ROTR_6 \\oplus ROTR_{11} \\oplus ROTR_{25}$; $\\sigma_0 = ROTR_7 \\oplus ROTR_{18} \\oplus SHR_3$; $\\sigma_1 = ROTR_{17} \\oplus ROTR_{19} \\oplus SHR_{10}$.',
          plain:
            'Šest pomocných bitových funkcí, ze kterých se v SHA-256 v každé rundě skládá nová hodnota kontextu. Ch („choice“) vybírá bity podle jednoho slova, Ma rozhoduje majoritou, sigmy a Sigmy jsou XOR-y různě rotovaných slov.',
        },
      ],
    },
    {
      id: 'sec-5-6',
      number: '5.6',
      title: 'Využití hašovacích funkcí',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Kontrola integrity</strong> velkých souborů.',
            '<strong>Ukládání hesel</strong> spolu s náhodnou „solí“: dvojice $(\\text{sůl}, h(\\text{heslo}, \\text{sůl}))$ brání slovníkovým útokům.',
            '<strong>Jednoznačná identifikace dat</strong> — digitální podpisy se aplikují na haš zprávy, nikoli na zprávu samotnou.',
            '<strong>Prokazování znalosti</strong>, autentizace původu dat, pseudonáhodné generátory, odvozování klíčů.',
          ],
        },
      ],
    },
    {
      id: 'sec-5-7',
      number: '5.7',
      title: 'HMAC',
      blocks: [
        {
          kind: 'p',
          html: '<strong>HMAC</strong> (FIPS PUB 198) je klíčovaný autentizační kód využívající obecnou hašovací funkci $h$. Slouží k integritě i autentizaci původu dat.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '5.2',
          title: 'HMAC',
          html: 'Klíč $K$ doplníme nulami zleva na $K^+$ délky $b$ (např. 512 b pro SHA-256). Výpočet $h\\bigl((K^+ \\oplus opad) \\,\\|\\, h((K^+ \\oplus ipad) \\,\\|\\, M)\\bigr)$ provedeme dvojím průchodem hašovací funkce. Bez znalosti $K$ útočník nemůže přepočítat HMAC.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '5.9',
          title: 'HMAC',
          html: 'Konstanty $ipad = \\texttt{0x36}^{\\,b/8}$, $opad = \\texttt{0x5C}^{\\,b/8}$, kde $b$ je velikost bloku kompresní funkce. Klíč $K$ doplněn nulami zleva na $K^+$ délky $b$. Pak $\\text{HMAC}_K(M) = h\\bigl((K^+ \\oplus opad) \\,\\|\\, h((K^+ \\oplus ipad) \\,\\|\\, M)\\bigr)$.',
          plain:
            'Klíčovaný autentizační kód postavený dvojím hašováním zprávy s namixovaným tajným klíčem. Bez znalosti klíče útočník HMAC nepřepočítá — proto se používá v HTTPS i v API podpisech k ověření, že zprávu poslal opravdu ten, kdo zná klíč.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Nepadělatelný integritní kód</strong> — útočník bez znalosti $K$ nemůže přepočítat HMAC po změně zprávy.',
            '<strong>Autentizace původu</strong> — správný HMAC dokazuje, že odesílatel zná $K$.',
            '<strong>Důkaz znalosti (challenge–response)</strong>: výzva $\\to$ odpověď $= \\text{HMAC}_K(\\text{challenge})$. Útočník na kanále neumí odvodit $K$.',
          ],
        },
      ],
    },
    {
      id: 'sec-5-8',
      number: '5.8',
      title: 'Příklady',
      blocks: [
        {
          kind: 'p',
          html: 'Úlohy zaměřené na narozeninový paradox, řády bezkoliznosti a vlastnosti odvozovacích funkcí.',
        },
        {
          kind: 'exercise',
          number: '5.2',
          title: 'Kolize SHA-384 (1. řád)',
          source: '1. selftest 2025/26',
          problem:
            'Označme $h$ jako SHA-384. Chceme nalézt dvě <em>libovolné</em> různé zprávy $x_1, x_2$ tak, aby $h(x_1) = h(x_2)$. Která tvrzení platí?',
          solution:
            '<p>Jelikož hledáme jakoukoli kolizní dvojici (bez fixované zprávy), jde o <strong>kolizi 1. řádu</strong>.</p><p>Délka výstupu SHA-384 je $n = 384$ bitů. Z narozeninového paradoxu je očekávaný počet operací $\\approx 2^{n/2} = 2^{192}$.</p>',
          result: 'Kolize 1. řádu, složitost $\\approx 2^{192}$ operací.',
          answer: {
            type: 'multichoice',
            options: [
              { text: 'Jedná se o kolizi prvního řádu.', correct: true },
              {
                text: 'Počet hashovacích operací (pro 50% pravděpodobnost) je zhruba $2^{192}$.',
                correct: true,
              },
              {
                text: 'Počet hashovacích operací (pro 50% pravděpodobnost) je zhruba $2^{383}$.',
                correct: false,
              },
              { text: 'Jedná se o kolizi druhého řádu.', correct: false },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '5.3',
          title: 'Kolize SHA-1 (2. řád)',
          source: '2. test 02.05.2025',
          problem:
            'Označme $h$ jako SHA-1. Chceme k dané zprávě $x_1$ nalézt zprávu $x_2 \\ne x_1$ s $h(x_1) = h(x_2)$. Která tvrzení platí?',
          solution:
            '<p>Jelikož $x_1$ je <em>pevně daná</em>, jde o kolizi 2. řádu (2nd preimage).</p><p>Pro náhodné orákulum je očekávaná složitost $\\approx 2^n = 2^{160}$, nikoli $2^{n/2}$.</p>',
          result: 'Kolize 2. řádu, složitost $\\approx 2^{160}$.',
          answer: {
            type: 'multichoice',
            options: [
              { text: 'Jedná se o kolizi 2. řádu.', correct: true },
              {
                text: 'Počet hashovacích operací (pro 50% pravděpodobnost) je zhruba $2^{160}$.',
                correct: true,
              },
              { text: 'Jedná se o kolizi 1. řádu.', correct: false },
              {
                text: 'Počet hashovacích operací (pro 50% pravděpodobnost) je zhruba $2^{256}$.',
                correct: false,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '5.4',
          title: 'Bezkoliznost 1. řádu',
          source: '2. test 02.05.2025',
          problem: 'Posuďte pravdivost tvrzení o bezkoliznosti 1. řádu (preimage resistance).',
          solution:
            '<p>Bezkoliznost 1. řádu znamená: je výpočetně neproveditelné nalézt <em>libovolný</em> pár $(x_1, x_2)$ s $x_1 \\ne x_2$ a $h(x_1) = h(x_2)$. Pozor — bezkoliznost <strong>nezaručuje neexistenci</strong> kolizí, kolize z principu existují (vstupů je mnohem víc než výstupů).</p><p>Tvrzení o „pro danou $x_1$ najít $x_2$“ patří k bezkoliznosti 2. řádu, nikoli 1. řádu.</p>',
          result:
            'Pravdivé: nelze najít libovolný pár $(x_1, x_2)$ s kolizí.',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: 'Je výpočetně neproveditelné najít libovolný pár $(x_1, x_2)$ s $x_1 \\ne x_2$ a $h(x_1) = h(x_2)$.',
                correct: true,
              },
              {
                text: 'Je výpočetně neproveditelné najít pro danou zprávu $x_1$ jinou zprávu $x_2$ s $x_1 \\ne x_2$ a $h(x_1) = h(x_2)$.',
                correct: false,
              },
              {
                text: 'Existuje jen několik kolizí — pro danou $x_1$ existuje právě jedna $x_2$.',
                correct: false,
              },
              {
                text: 'Kolize neexistují — pro danou $x_1$ nelze najít $x_2 \\ne x_1$ s $h(x_1) = h(x_2)$.',
                correct: false,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '5.5',
          title: 'Key Derivation Function',
          source: '2. test 02.05.2025',
          problem:
            'Mějme KDF definovanou jako $\\text{kdf}(\\text{passwd},\\text{salt},\\text{rounds}) = \\text{SHA512}^{\\text{rounds}}(\\text{passwd} \\| \\text{salt})$. Která tvrzení jsou pravdivá?',
          solution:
            '<p><strong>Salt</strong> způsobí, že stejné heslo má pokaždé jiný výstup KDF — předpočítaná tabulka (rainbow) by musela existovat pro každý salt zvlášť, takže její velikost roste exponenciálně.</p><p><strong>Rounds</strong> zvyšují čas potřebný k výpočtu KDF (lineárně), čímž ztěžují slovníkový útok. Velikost výstupu KDF se však s počtem rund <em>nemění</em> (stále výstup SHA-512 = 512 bitů). Salt + rounds slovníkový útok ztěžují, ale <em>neznemožní</em>.</p>',
          result: 'Vhodná volba salt a rounds ztěžuje slovníkový útok.',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: 'Vhodná volba salt a rounds ztěžuje slovníkový útok.',
                correct: true,
              },
              {
                text: 'S rostoucím parametrem rounds roste velikost výstupu KDF.',
                correct: false,
              },
              {
                text: 'Velikost předpočítané tabulky pro KDF závisí na parametru rounds.',
                correct: false,
              },
              {
                text: 'Vhodná volba salt a rounds <em>znemožní</em> slovníkový útok.',
                correct: false,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '5.6',
          title: 'Proudová šifra a porucha přenosu',
          source: '1. selftest 2025/26',
          problem:
            'Mějme proudovou šifru, kde hodnoty hesla $h_i$ jsou generovány náhodně. Alice pošle Bobovi $ST = c_1 c_2 c_3 c_4 c_5$. Při přenosu se narušil pouze znak $c_2$. Které znaky OT Bob dešifruje správně?',
          solution:
            '<p>U synchronní proudové šifry s XOR platí $p_i = c_i \\oplus h_i$. Generátor hesla $h_i$ <em>nezávisí</em> na ŠT, takže chyba v $c_2$ ovlivní pouze $p_2$ (lokální propagace chyby — jeden z hlavních důvodů, proč se proudové šifry hodí pro nespolehlivé kanály).</p><p>Bob správně dešifruje $p_1, p_3, p_4, p_5$, ale ne $p_2$.</p>',
          result: '$p_1, p_3, p_4, p_5$',
          answer: {
            type: 'open',
            accept: ['p1,p3,p4,p5'],
            placeholder: 'p1,p2,...',
          },
        },
      ],
    },
    {
      id: 'sec-5-9',
      number: '5.9',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>U hašovacích funkcí: definice jednosměrné funkce, definice hašovací funkce, orákula a bezkoliznosti. Odolnost proti nalezení kolizí u hashovacích funkcí, narozeninový paradox. Konstrukce moderních hašovacích funkcí: zarovnání vstupní zprávy, Damgård-Merklovo zesílení, Damgård-Merklova konstrukce hašovací funkce, Davies-Meyerova konstrukce kompresní funkce. Základní charakteristika algoritmu SHA-1 a SHA-256, zpracování bloku zprávy. HMAC.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-5-9-1',
          number: '5.9.1',
          title: 'Jednosměrná funkce, hašovací funkce, orákulum, bezkoliznost',
        },
        {
          kind: 'p',
          html: '<strong>Jednosměrná funkce</strong> $f: X \\to Y$ je taková, u které je snadné spočítat $y = f(x)$, ale pro náhodně zvolené $y$ je výpočetně nemožné nalézt vzor $x$ s $f(x) = y$. Rozlišujeme dva typy: <strong>(1)</strong> jednosměrné bez padacích vrátek (např. násobení vs. faktorizace) a <strong>(2)</strong> s padacími vrátky, kde inverzi zvládne pouze ten, kdo zná tajný klíč (základ asymetrické kryptografie).',
        },
        {
          kind: 'p',
          html: '<strong>Hašovací funkce</strong> je zobrazení $h: X \\to \\{0,1\\}^n$, kde $X$ je množina binárních řetězců délky $0$ až $d$ (typicky $d = 2^{64}-1$). Musí být <strong>jednosměrná 1. typu</strong> a <strong>bezkolizní</strong>. Výstup pevné délky $n$ se nazývá <em>haš</em> (otisk).',
        },
        {
          kind: 'p',
          html: '<strong>Náhodné orákulum</strong> je idealizovaný model: hašovací funkce je černá skříňka, která pro každý nový vstup vrátí rovnoměrně náhodný výstup délky $n$ a pro stejný vstup vždy stejný výstup. Slouží jako referenční model pro analýzu bezpečnosti (útoky proti reálné hašovací funkci nesmí být snazší než proti orákulu).',
        },
        {
          kind: 'p',
          html: '<strong>Bezkoliznost</strong> má dva řády:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>1. řád (collision resistance):</strong> je výpočetně nemožné najít <em>libovolnou</em> dvojici $M \\ne M\'$ s $h(M) = h(M\')$.',
            '<strong>2. řád (2nd preimage):</strong> pro <em>danou</em> zprávu $x$ je výpočetně nemožné najít $y \\ne x$ s $h(x) = h(y)$.',
            '<strong>Odolnost vůči vzoru (preimage):</strong> pro daný haš $y$ je výpočetně nemožné najít $x$ s $h(x) = y$ — odpovídá jednosměrnosti.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-5-9-2',
          number: '5.9.2',
          title: 'Odolnost proti kolizím a narozeninový paradox',
        },
        {
          kind: 'p',
          html: 'Pro hašovací funkci s $n$-bitovým výstupem chovající se jako náhodné orákulum je složitost nalezení kolize <strong>1. řádu</strong> $\\approx 2^{n/2}$ operací (z narozeninového paradoxu), zatímco složitost nalezení kolize <strong>2. řádu</strong> i preimage je $\\approx 2^n$. Bezpečnostní úroveň hašovací funkce je proto pouze $n/2$ bitů.',
        },
        {
          kind: 'math',
          tex: 'P(n, k) \\approx 1 - \\exp\\!\\left(-\\frac{k^2}{2n}\\right)',
        },
        {
          kind: 'p',
          html: '<strong>Narozeninový paradox:</strong> pro $n$ velkých a počet pokusů $k = O(\\sqrt{n})$ dosáhne pravděpodobnost shody dvou prvků zhruba 50 %. Klasický příklad: ve skupině 23 osob je pravděpodobnost společných narozenin už $0{,}507$. U hašovací funkce stačí cca $2^{n/2}$ náhodných zpráv ke kolizi s pravděpodobností $\\approx 50\\,\\%$ — proto SHA-1 (160 b) poskytuje jen $2^{80}$ bezpečnosti proti kolizím a SHA-256 (256 b) jen $2^{128}$.',
        },
        {
          kind: 'h3',
          id: 'subsec-5-9-3',
          number: '5.9.3',
          title: 'Konstrukce moderních hašovacích funkcí',
        },
        {
          kind: 'p',
          html: '<strong>Zarovnání vstupní zprávy (padding):</strong> zpráva libovolné délky se musí doplnit na násobek velikosti bloku (např. 512 b u SHA-1/SHA-256). Postup: připojí se bit <code>1</code>, doplní se potřebný počet bitů <code>0</code> a nakonec se přidá pevný počet bitů (typicky 64) s <strong>původní délkou zprávy</strong>. Toto doplnění se nazývá <strong>Damgård-Merklovo zesílení</strong> a je klíčové pro bezpečnost: znemožňuje útoky pomocí prodloužení zprávy a útoky na shodný padding různě dlouhých zpráv.',
        },
        {
          kind: 'p',
          html: '<strong>Damgård-Merklova konstrukce</strong> staví celou hašovací funkci z menší <em>kompresní funkce</em> $f$, která má dva vstupy (kontext $H_{i-1}$ a blok zprávy $M_i$) a jeden výstup velikosti kontextu. Zpráva se po zarovnání rozdělí na bloky $M_1, \\dots, M_N$ a iterativně se počítá:',
        },
        {
          kind: 'math',
          tex: 'H_0 = \\mathrm{IV}, \\qquad H_i = f(H_{i-1}, M_i) \\quad \\text{pro } i = 1, \\dots, N, \\qquad h(M) = H_N',
        },
        {
          kind: 'p',
          html: 'Hodnota $H_i$ se nazývá <em>kontext</em>, $\\mathrm{IV}$ je pevný počáteční vektor. Klíčová vlastnost: <strong>je-li kompresní funkce $f$ bezkolizní, je bezkolizní i celá iterovaná hašovací funkce</strong>. Konstrukci používají MD5, SHA-1 i celá rodina SHA-2.',
        },
        {
          kind: 'p',
          html: '<strong>Davies-Meyerova konstrukce</strong> umožňuje postavit kompresní funkci z libovolné <em>blokové šifry</em> $E$. Blok zprávy $M_i$ se použije jako <em>klíč</em> a šifruje se s ním kontext $H_{i-1}$, výsledek je ještě XOR-ován se vstupním kontextem:',
        },
        {
          kind: 'math',
          tex: 'H_i = E_{M_i}(H_{i-1}) \\oplus H_{i-1}',
        },
        {
          kind: 'p',
          html: 'XOR se vstupem maskuje výstup a posiluje jednosměrnost — bez něj by šlo kompresní funkci snadno invertovat pomocí dešifrování blokové šifry. Tato konstrukce je základem kompresních funkcí v SHA-1 i SHA-2.',
        },
        {
          kind: 'h3',
          id: 'subsec-5-9-4',
          number: '5.9.4',
          title: 'SHA-1 a SHA-256 — základní charakteristika',
        },
        {
          kind: 'p',
          html: '<strong>SHA-1</strong> (FIPS 180-1, 1995) produkuje 160-bitový haš, zpracovává bloky 512 b a zprávy do $2^{64}-1$ b. Kontext: pět 32-bitových slov $A, B, C, D, E$. Kompresní funkce má <strong>80 rund</strong> rozdělených do 4 skupin po 20, každá skupina používá jinou nelineární funkci $F_t$ (výběr, XOR, majorita) a jinou konstantu $K_t$. Z 16 slov bloku se expanzí získá 80 slov $W_t$ pro jednotlivé rundy. V každé rundě se kontext cyklicky posune a do nového $A$ se namixuje $W_t$ a $K_t$. SHA-1 je dnes <strong>prolomena</strong> (kolize 1. řádu publikována 2017, útok SHAttered) a nepoužívá se pro nové aplikace.',
        },
        {
          kind: 'p',
          html: '<strong>SHA-256</strong> (FIPS 180-2, součást rodiny SHA-2) má 256-bitový haš, blok 512 b, slovo 32 b a <strong>64 rund</strong>. Kontext tvoří osm 32-bitových slov $A, \\dots, H$. Bezpečnost proti kolizím je $2^{128}$. Pro každý blok se nejprve expanduje 16 slov vstupu na 64 slov $W_t$ pomocí funkcí $\\sigma_0, \\sigma_1$ (XOR rotací a posunů), pak se v každé rundě aplikují pomocné funkce $Ch$ (volba), $Ma$ (majorita) a $\\Sigma_0, \\Sigma_1$ (XOR tří rotací). Slova kontextu se cyklicky posunou a po 64 rundách se výstup XOR-uje s vstupním kontextem (Davies-Meyer).',
        },
        {
          kind: 'p',
          html: 'Společné rysy zpracování bloku: zarovnání zprávy → rozdělení na bloky → pro každý blok expanze a iterativní mixování v rundách → kombinace s předchozím kontextem (DM) → výstupem posledního bloku je výsledný haš.',
        },
        {
          kind: 'h3',
          id: 'subsec-5-9-5',
          number: '5.9.5',
          title: 'HMAC',
        },
        {
          kind: 'p',
          html: '<strong>HMAC</strong> (FIPS PUB 198) je <em>klíčovaný autentizační kód</em> postavený nad libovolnou hašovací funkcí $h$. Slouží k <strong>integritě</strong> i <strong>autentizaci původu</strong> zprávy. Klíč $K$ se zleva doplní nulami na $K^+$ o délce bloku $b$ kompresní funkce (např. 512 b pro SHA-256). Definujeme konstanty $ipad = \\texttt{0x36}^{\\,b/8}$ a $opad = \\texttt{0x5C}^{\\,b/8}$. Pak:',
        },
        {
          kind: 'math',
          tex: '\\mathrm{HMAC}_K(M) = h\\bigl((K^+ \\oplus opad) \\,\\|\\, h((K^+ \\oplus ipad) \\,\\|\\, M)\\bigr)',
        },
        {
          kind: 'p',
          html: 'Výpočet probíhá <strong>dvojím průchodem</strong> hašovací funkce (vnitřní a vnější), což jednak zabraňuje útokům prodloužením zprávy (length-extension attack) na DM konstrukci, jednak umožňuje formální důkaz bezpečnosti za rozumných předpokladů o kompresní funkci. Bez znalosti $K$ útočník HMAC nemůže přepočítat — proto se HMAC používá v TLS, IPsec i v podpisech API požadavků.',
        },
      ],
    },
  ],
}
