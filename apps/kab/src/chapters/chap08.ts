import type { Chapter } from '../types'

export const chap08: Chapter = {
  id: 'chap-8',
  number: '8',
  title: 'Bezpečnost kryptografických systémů',
  intro: [
    {
      kind: 'p',
      html: 'Odolnost šifry vůči útokům je dána její vnitřní strukturou, použitou abecedou (která ovlivňuje frekvenční analýzu) a složitostí matematického problému, na němž je šifra postavena. <strong>Teorie informace</strong> řeší, za jakých podmínek lze šifru rozluštit. <strong>Teorie složitosti</strong> řeší, s jakou náročností.',
    },
  ],
  sections: [
    {
      id: 'sec-8-1',
      number: '8.1',
      title: 'Hodnocení odolnosti šifry',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '8.1',
          title: 'Nepodmíněná bezpečnost',
          html: 'Kryptosystém je <strong>nepodmíněně bezpečný</strong>, pokud jej nelze prolomit <em>bez ohledu na prostředky útočníka</em>. Pokud útočník nezíská žádnou novou informaci ani opakovaným použitím, mluvíme o <strong>absolutní bezpečnosti</strong>. Asymetrické šifry nemohou být nepodmíněně bezpečné (VK nese informaci o SK).',
          plain:
            'Šifru nelze prolomit ani s nekonečným výpočetním výkonem. Splňuje to jen one-time pad. Asymetrické šifry tohle splnit nemohou — veřejný klíč nese informaci o soukromém, takže by stačil dostatečně silný útočník.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '8.1',
          title: 'Vernamova šifra',
          html: 'One-time pad s náhodným heslem stejné délky jako OT je absolutně bezpečný — ŠT je rovnoměrně rozdělen na všech možných OT.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '8.2',
          title: 'Podmíněná bezpečnost',
          html: 'Kryptosystém je <strong>podmíněně bezpečný</strong>, pokud jeho prolomení vyžaduje prostředky, které útočník nemá. Dělíme na <strong>prokazatelnou</strong> (matematický důkaz redukce na NP-těžký problém) a <strong>výpočetní</strong> (čas/náklady přesahují cenu informace).',
          plain:
            'Šifra je „prakticky bezpečná“ — útočník teoreticky existuje, ale potřeboval by neúnosně velkou výpočetní sílu. Tahle míra stačí v praxi pro všechno krom utajení nejvyššího stupně.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '8.2',
          title: 'Bezpečnost AES a RSA',
          html: '<strong>AES</strong> je podmíněně (výpočetně) bezpečný — brute force klíče není proveditelný v rozumném čase. <strong>RSA</strong> je prokazatelně bezpečný za předpokladu, že prolomení vyžaduje vyřešit faktorizaci (NP-problém).',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '8.1',
          title: 'Kerckhoffsův princip (1883)',
          html: 'Bezpečnost šifrového systému nesmí záviset na utajení algoritmu, pouze na utajení klíče. Předpokládáme, že útočník zná celý systém; <em>security through obscurity</em> samo o sobě nestačí.',
        },
      ],
    },
    {
      id: 'sec-8-2',
      number: '8.2',
      title: 'Teorie informace — entropie a redundance',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '8.3',
          title: 'Entropie',
          html: 'Entropie zprávy ze zdroje $X$ s pravděpodobnostmi $p_1, \\dots, p_n$ je $H(X) = -\\sum_{i=1}^n p_i \\log_2 p_i$. Vyjadřuje průměrný počet bitů potřebných k optimálnímu zakódování — také <strong>míru neurčitosti</strong> zprávy.',
          plain:
            'Měří, kolik informace zpráva nese — kolik bitů by stačilo k jejímu optimálnímu zakódování. Čím vyšší entropie klíče, tím těžší prolomení. Tahle veličina od Shannona je základ celé teorie informace.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '8.1',
          title: 'Maximum entropie',
          html: 'Maximální entropie zdroje s $n$ stejně pravděpodobnými zprávami je $\\log_2 n$. Zdroj s jedinou možnou zprávou ($p = 1$) má entropii $0$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '8.3',
          title: 'Výpočet entropie',
          html: 'Mince: $H = -2 \\cdot 0{,}5 \\log_2 0{,}5 = 1$ bit. Nesymetrický zdroj $p_1 = 1/4$, $p_2 = 3/4$: $H = 0{,}25 \\cdot 2 + 0{,}75 \\cdot 0{,}41 \\approx 0{,}81$ bit.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '8.4',
          title: 'Obsažnost a redundance jazyka',
          html: '<ul><li><strong>Obsažnost</strong>: $R_N = H(X)/N$, průměrný počet bitů informace na 1 znak ($N \\to \\infty$ dává $r$).</li><li><strong>Absolutní obsažnost</strong>: $R = \\log_2 L$ pro abecedu velikosti $L$.</li><li><strong>Redundance</strong>: $D = R - r$.</li></ul>Pro angličtinu $r \\approx 1{,}5$, $R = 4{,}7$, $D = 3{,}2$ b/znak (~68&nbsp;%).',
          plain:
            'Rozdíl mezi tím, co by jazyk teoreticky mohl nést (kdyby všechna písmena byla rovnoměrná), a kolik reálně nese. Angličtina má redundanci přes 68 % — proto ji jde dobře komprimovat a proto frekvenční analýza funguje.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '8.5',
          title: 'Vzdálenost jednoznačnosti',
          html: '$\\delta_U = \\dfrac{H(K)}{D}$ — počet znaků ŠT potřebných k tomu, aby zbýval v průměru jediný OT. Pro jednoduchou substituci v angličtině: $\\delta_U = \\log_2(26!)/3{,}2 \\approx 27{,}6$.',
          plain:
            'Kolik znaků šifry musí útočník vidět, než zbude jediný smysluplný kandidát na otevřený text. Pod touhle hranicí existuje víc možných výkladů — útočník nemá jak se rozhodnout, který je správný.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '8.2',
          title: 'Konfúze a difúze (Shannon)',
          html: '<ul><li><strong>Konfúze</strong> maří vztah mezi ŠT a klíčem (typicky substituce, S-boxy).</li><li><strong>Difúze</strong> rozprostírá redundanci OT po celém ŠT (transpozice, MixColumns).</li></ul>Moderní šifry kombinují obě techniky.',
        },
      ],
    },
    {
      id: 'sec-8-3',
      number: '8.3',
      title: 'Teorie složitosti',
      blocks: [
        {
          kind: 'p',
          html: 'Výpočetní složitost algoritmu zahrnuje časovou $T(n)$ a prostorovou $S(n)$ náročnost vzhledem k velikosti vstupu $n$. Vyjadřuje se řádem $O$, přičemž zanedbáváme členy nižšího řádu.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Konstantní $O(1)$, lineární $O(n)$, polynomiální $O(n^m)$.',
            'Exponenciální $O(t^{f(n)})$ pro lineární $f$.',
            'Superpolynomiální (subexponenciální) složitost $O(t^{f(n)})$ pro $f$ menší než lineární — typická pro luštitelské algoritmy (faktorizace, PDL).',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '8.6',
          title: 'Třídy složitosti',
          html: '<ul><li><strong>P</strong> — řešitelné v polynomiálním čase deterministickým TS.</li><li><strong>NP</strong> — řešitelné v polynomiálním čase nedeterministickým TS (nebo „ověřitelné“ v PT).</li><li><strong>NP-úplné</strong> — leží v NP a každý problém z NP se na ně dá polynomiálně redukovat.</li><li><strong>PSPACE</strong> — polynomiální paměť.</li><li><strong>EXPTIME</strong> — exponenciální čas.</li><li><strong>CoNP</strong> — doplňky NP.</li></ul>',
          plain:
            'Třídy „jak těžký je daný problém“. P jsou problémy, které počítač spolehlivě zvládne v rozumném čase, NP jsou ty, kde řešení rychle ověříte, ale najít je je zřejmě těžké. Kryptografie staví právě na NP problémech (faktorizace, diskrétní logaritmus).',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '8.3',
          title: 'Kryptografie a P vs. NP',
          html: 'Většina šifer (symetrických i asymetrických) je v NP. Útočník odhaduje OT/klíč nedeterministicky a v PT ověří shodu se ŠT. Pokud by platilo P = NP, většina dnešních šifer by byla luštitelná polynomiálně. Známé luštitelské algoritmy jsou (sub)exponenciální.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '8.4',
          title: 'Doba prolomení 56b klíče',
          html: 'Pro $n = 56$ b a 1 operaci = $0{,}1\\,\\mu$s je $O(2^{56}) \\approx 7{,}2 \\cdot 10^{16}$ operací ≈ 81 000 dnů. S 1000 procesory paralelně cca 3 měsíce (DES-Cracker, 1998).',
        },
      ],
    },
    {
      id: 'sec-8-4',
      number: '8.4',
      title: 'Příklady',
      blocks: [
        {
          kind: 'p',
          html: 'Úlohy se opakují na zápočtech — všechny se točí kolem dvou vzorců: $H(X) = -\\sum p_i \\log_2 p_i$ a $\\delta_U = H(K) / D$, kde $D = R - r$.',
        },
        {
          kind: 'exercise',
          number: '8.5',
          title: 'Entropie po odebrání zprávy',
          source: '2. test 02.05.2025',
          problem:
            'Zdroj $X$ generoval 17 zpráv (rovnoměrně). Pak jedna zpráva přestala být generována ($p=0$), zbylé zůstaly stejně pravděpodobné. Jaká je nyní $H(X)$?',
          solution:
            '<p>Po změně máme 16 stejně pravděpodobných zpráv, každá $p = 1/16$.</p><p>$H(X) = -16 \\cdot \\tfrac{1}{16} \\log_2 \\tfrac{1}{16} = \\log_2 16 = 4$ bity.</p>',
          result: '$H(X) = 4$',
          answer: {
            type: 'open',
            accept: ['4'],
            placeholder: 'H(X) = ?',
          },
        },
        {
          kind: 'exercise',
          number: '8.6',
          title: 'Entropie — degenerovaný zdroj',
          source: '1. selftest 2025/26',
          problem:
            'Zdroj $X$ generoval 16 zpráv. Pak došlo ke změně — kromě dvou zpráv se všechny ostatní přestaly generovat ($p=0$). Zbylé dvě jsou stejně pravděpodobné. Jaká je $H(X)$?',
          solution:
            '<p>Zbyly 2 zprávy, každá $p = 1/2$. $H(X) = -2 \\cdot 0{,}5 \\log_2 0{,}5 = 1$ bit.</p>',
          result: '$H(X) = 1$',
          answer: {
            type: 'open',
            accept: ['1'],
            placeholder: 'H(X) = ?',
          },
        },
        {
          kind: 'exercise',
          number: '8.7',
          title: 'Entropie geometrické řady',
          source: '2. test 02.05.2025',
          problem:
            'Zdroj posílá 5 různých zpráv s pravděpodobnostmi $p_1 = \\tfrac{2}{32}, p_2 = \\tfrac{1}{16}, p_3 = \\tfrac{1}{8}, p_4 = \\tfrac{1}{4}, p_5 = \\tfrac{1}{2}$. Spočítejte $H(X)$.',
          solution:
            '<p>$p_1 = p_2 = 1/16$, takže pravděpodobnosti jsou $\\{1/16, 1/16, 1/8, 1/4, 1/2\\}$ a součet $= 1$. ✓</p><p>$H = 2 \\cdot \\tfrac{1}{16} \\cdot 4 + \\tfrac{1}{8} \\cdot 3 + \\tfrac{1}{4} \\cdot 2 + \\tfrac{1}{2} \\cdot 1$</p><p>$= \\tfrac{8}{16} + \\tfrac{3}{8} + \\tfrac{1}{2} + \\tfrac{1}{2} = 0{,}5 + 0{,}375 + 0{,}5 + 0{,}5 = 1{,}875$ bitů.</p>',
          result: '$H(X) = 1{,}875$ bitu',
          answer: {
            type: 'open',
            accept: ['1.875', '1,875', '15/8'],
            placeholder: 'H(X) = ?',
          },
        },
        {
          kind: 'exercise',
          number: '8.8',
          title: 'Entropie — sdružené pravděpodobnosti',
          source: '2. test 02.05.2025',
          problem:
            'Zdroj $X$ generuje 7 zpráv. Tři z nich mají pravděpodobnost $\\tfrac{1}{4}$ a zbylé čtyři $\\tfrac{1}{16}$. Spočítejte $H(X)$.',
          solution:
            '<p>Kontrola: $3 \\cdot \\tfrac{1}{4} + 4 \\cdot \\tfrac{1}{16} = \\tfrac{3}{4} + \\tfrac{1}{4} = 1$. ✓</p><p>$H = 3 \\cdot \\tfrac{1}{4} \\cdot 2 + 4 \\cdot \\tfrac{1}{16} \\cdot 4 = \\tfrac{3}{2} + 1 = 2{,}5$ bitu.</p>',
          result: '$H(X) = 2{,}5$ bitu',
          answer: {
            type: 'open',
            accept: ['2.5', '2,5', '5/2'],
            placeholder: 'H(X) = ?',
          },
        },
        {
          kind: 'exercise',
          number: '8.9',
          title: 'Maximální entropie',
          source: '2. test 02.05.2025',
          problem:
            'Máme dáno $H(X) = 5$, přičemž tato entropie je maximální možná. Kolik různých zpráv produkuje zdroj a jaká je pravděpodobnost každé z nich?',
          solution:
            '<p>Maximální entropie $\\log_2 N = 5$ je dosažena při rovnoměrném rozdělení, $N = 2^5 = 32$.</p><p>Každá zpráva má pravděpodobnost $p_i = 1/32 = 0{,}03125$.</p>',
          result: 'N = 32, $p_i = 1/32$',
          answer: {
            type: 'open',
            accept: ['32,1/32', '32,0.03125', 'N=32,p=1/32'],
            placeholder: 'N, p_i',
          },
        },
        {
          kind: 'exercise',
          number: '8.10',
          title: 'Minimální entropie',
          source: '2. test 02.05.2025',
          problem:
            'Zdroj generuje nenulové množství zpráv a má minimální možnou entropii. Kolik různých zpráv s nenulovou pravděpodobností generuje a jaká je jejich pravděpodobnost?',
          solution:
            '<p>$H(X) = 0$ právě tehdy, když je rozdělení degenerované — tj. existuje jediná zpráva s $p = 1$ (a všechny ostatní s $p = 0$).</p>',
          result: '$N = 1,\\ p = 1$',
          answer: {
            type: 'open',
            accept: ['1,1'],
            placeholder: 'N, p',
          },
        },
        {
          kind: 'exercise',
          number: '8.11',
          title: 'Vzdálenost jednoznačnosti — Mordor',
          source: '2. test 02.05.2025',
          problem:
            'Jaká musí být délka klíče šifry, aby pro zprávy v jazyce Mordoru ($r = 2{,}5$) v kódování HOBIT-12bit byla vzdálenost jednoznačnosti $\\delta_U \\approx 30$ znaků? Klíče vybíráme rovnoměrně náhodně.',
          solution:
            '<p>$\\delta_U = H(K)/D$, kde $D = R - r$ a $R = \\log_2 L$ pro abecedu velikosti $L$.</p><p>HOBIT-12bit: $R = 12$ bitů/znak. Redundance $D = 12 - 2{,}5 = 9{,}5$ b/znak.</p><p>$H(K) = \\delta_U \\cdot D = 30 \\cdot 9{,}5 = 285$ bitů.</p><p>Pro rovnoměrný náhodný klíč $H(K) = \\log_2(\\text{počet klíčů})$, tj. délka klíče je $285$ bitů.</p>',
          result: 'Délka klíče $= 285$ bitů.',
          answer: {
            type: 'open',
            accept: ['285'],
            placeholder: 'délka klíče [b]',
          },
        },
        {
          kind: 'exercise',
          number: '8.12',
          title: 'Vzdálenost jednoznačnosti — výběr šifry',
          source: '2. test 02.05.2025',
          problem:
            'Jakou symetrickou šifru použít, pokud chceme $\\delta_U \\approx 39$ znaků pro angličtinu ($r = 1{,}5$) v ASCII-8bit?',
          solution:
            '<p>$R = 8$, $D = 8 - 1{,}5 = 6{,}5$ b/znak.</p><p>$H(K) = 39 \\cdot 6{,}5 = 253{,}5$ bitů. Nejbližší (větší nebo rovno) standardní velikost je $256$ bitů.</p><p>→ <strong>AES-256</strong> (3DES-168 by stačil pro $H(K) = 168$, což odpovídá $\\delta_U \\approx 25{,}8$).</p>',
          result: 'AES-256',
          answer: {
            type: 'open',
            accept: ['AES-256', 'AES256', 'aes-256', 'aes 256'],
            placeholder: 'název šifry',
          },
        },
        {
          kind: 'exercise',
          number: '8.13',
          title: 'Vzdálenost jednoznačnosti — 3DES',
          source: '2. test 02.05.2025',
          problem:
            'Šifra 3DES-168, angličtina ($r = 1{,}5$), klíče vybírány rovnoměrně. Která tvrzení o vzdálenosti jednoznačnosti jsou pravdivá?',
          solution:
            '<p>$H(K) = 168$ b. Postupně:</p><ul><li>ASCII-8bit: $D = 8 - 1{,}5 = 6{,}5$, $\\delta_U = 168/6{,}5 \\approx 25{,}85$ znaků.</li><li>UTF-16: $R = 16$, $D = 14{,}5$, $\\delta_U \\approx 11{,}59$ znaků.</li><li>UTF-32: $R = 32$, $D = 30{,}5$, $\\delta_U \\approx 5{,}51$ znaků.</li></ul><p>Tvrzení s jednotkou „bitů“ místo „znaků“ jsou chybná.</p>',
          result:
            '$\\delta_U \\approx 25{,}85$ pro ASCII-8bit, $\\approx 11{,}59$ pro UTF-16, $\\approx 5{,}51$ pro UTF-32.',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: 'Při kódování ASCII-8bit je $\\delta_U \\approx 25{,}85$ znaků.',
                correct: true,
              },
              {
                text: 'Při kódování UTF-16 je $\\delta_U \\approx 11{,}59$ znaků.',
                correct: true,
              },
              {
                text: 'Při kódování UTF-32 je $\\delta_U \\approx 5{,}51$ znaků.',
                correct: true,
              },
              {
                text: 'Při kódování ASCII-8bit je $\\delta_U \\approx 21$ bitů.',
                correct: false,
              },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-8-5',
      number: '8.5',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Hodnocení odolnosti šifry vůči útokům, pojmy jako teoretická bezpečnost, nepodmíněná bezpečnost, podmíněná bezpečnost, prokazatelná bezpečnost, výpočetní bezpečnost, Kerckhoffsův princip. Teorie informace: entropie, obsažnost jazyka, nadbytečnost jazyka, vzdálenost jednoznačnosti a jeho význam pro luštění šifer. Teorie složitosti a její vztah k bezpečnosti šifrovacích algoritmů.</strong>',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-1',
          number: '8.5.1',
          title: 'Hodnocení odolnosti šifry vůči útokům',
        },
        {
          kind: 'p',
          html: 'Odolnost šifry posuzujeme z několika hledisek: <strong>vnitřní struktury</strong> algoritmu (konfúze a difúze, počet rund), <strong>velikosti a kvality klíče</strong> (entropie, způsob generování), <strong>složitosti matematického problému</strong>, na němž šifra stojí (faktorizace, PDL), a <strong>délky zprávy</strong> ve vztahu k vzdálenosti jednoznačnosti. Útočník je hodnocen podle toho, co má k dispozici (jen ŠT, dvojice OT–ŠT, zvolený OT, zvolený ŠT) a kolik výpočetní síly mu přiznáváme.',
        },
        {
          kind: 'p',
          html: 'Podle míry odolnosti dělíme bezpečnost na <strong>teoretickou</strong> (odpověď dává teorie informace — co je v principu možné, bez ohledu na čas) a <strong>praktickou</strong> (odpověď dává teorie složitosti — co je proveditelné v rozumném čase).',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-2',
          number: '8.5.2',
          title: 'Nepodmíněná (teoretická, absolutní) bezpečnost',
        },
        {
          kind: 'p',
          html: 'Kryptosystém je <strong>nepodmíněně bezpečný</strong>, pokud jej nelze prolomit <em>bez ohledu na výpočetní prostředky</em> útočníka — ani s nekonečným časem a pamětí. Útočník po obdržení ŠT nezíská žádnou novou informaci o OT, formálně $H(P \\mid C) = H(P)$. Pokud tato vlastnost platí i při opakovaném použití systému, mluvíme o <strong>absolutní bezpečnosti</strong>.',
        },
        {
          kind: 'p',
          html: 'Jediným prakticky známým absolutně bezpečným kryptosystémem je <strong>Vernamova šifra (one-time pad)</strong> — pokud je heslo skutečně náhodné, stejně dlouhé jako OT a použité jen jednou. Pak je ŠT rovnoměrně rozdělen na všech možných OT a útočník nemá jak rozhodnout, který OT je správný. Asymetrické šifry <em>nemohou</em> být nepodmíněně bezpečné: veřejný klíč jednoznačně určuje klíč soukromý, takže útočník s dostatečnou silou jej dopočítá.',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-3',
          number: '8.5.3',
          title: 'Podmíněná bezpečnost: prokazatelná a výpočetní',
        },
        {
          kind: 'p',
          html: 'Kryptosystém je <strong>podmíněně bezpečný</strong>, pokud jeho prolomení sice teoreticky možné je, ale vyžaduje prostředky, které útočník nemá. Rozlišujeme dva podtypy:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Prokazatelná bezpečnost</strong> — existuje matematický důkaz redukce: pokud útočník dokáže šifru prolomit, dokáže zároveň vyřešit nějakou obecně považovanou těžkou (typicky NP-těžkou) úlohu, např. faktorizaci velkého čísla nebo problém diskrétního logaritmu. Příkladem je RSA (faktorizace) nebo ElGamal (PDL).',
            '<strong>Výpočetní bezpečnost</strong> — odhad obtížnosti je založen na <em>předpokládaných</em> limitech známých útoků a hardwaru. Důkaz redukce není znám, ale nejlepší známý útok je výpočetně neproveditelný (typicky brute-force klíče). Příkladem je AES, kde $2^{128}$ klíčů je v dnešním měřítku za hranicí proveditelnosti.',
          ],
        },
        {
          kind: 'p',
          html: 'Pro praxi obvykle stačí výpočetní bezpečnost: cena prolomení musí být řádově vyšší než hodnota chráněné informace po dobu její životnosti.',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-4',
          number: '8.5.4',
          title: 'Kerckhoffsův princip',
        },
        {
          kind: 'p',
          html: 'Auguste Kerckhoffs formuloval roku 1883 zásadu, že <strong>bezpečnost kryptografického systému nesmí záviset na utajení algoritmu, pouze na utajení klíče</strong>. Předpokládáme, že útočník zná úplný popis systému (algoritmus, parametry, formát zpráv); jediným tajemstvím je klíč. Shannon to později přeformuloval jako „nepřítel zná systém“.',
        },
        {
          kind: 'p',
          html: 'Důvodem je praktická realita: algoritmy nelze trvale utajit (reverzní inženýrství, úniky, publikace). „<em>Security through obscurity</em>“ jako jediná obrana je nedostatečná. Standardizované a veřejně analyzované šifry (AES, RSA) jsou proto považovány za bezpečnější než tajné proprietární řešení.',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-5',
          number: '8.5.5',
          title: 'Teorie informace: entropie',
        },
        {
          kind: 'p',
          html: 'Teorie informace (Shannon, 1948) zavádí pojem <strong>entropie</strong> jako míry neurčitosti zdroje. Pro diskrétní náhodnou veličinu $X$ s pravděpodobnostmi $p_1, \\dots, p_n$ je entropie definována jako:',
        },
        {
          kind: 'math',
          tex: 'H(X) = -\\sum_{i=1}^{n} p_i \\log_2 p_i \\quad [\\text{bit}].',
        },
        {
          kind: 'p',
          html: 'Entropie udává průměrný počet bitů potřebných k optimálnímu zakódování zprávy ze zdroje. Maximum $H(X) = \\log_2 n$ nastává při rovnoměrném rozdělení, minimum $H(X) = 0$ při degenerovaném rozdělení (jediná zpráva s $p = 1$). V kryptografii nás zajímá zejména <strong>entropie klíče $H(K)$</strong> — čím vyšší, tím nepředvídatelnější je klíč a tím obtížnější je jeho uhodnutí.',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-6',
          number: '8.5.6',
          title: 'Obsažnost a nadbytečnost (redundance) jazyka',
        },
        {
          kind: 'p',
          html: 'Pro zdroj generující zprávy délky $N$ definujeme:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Obsažnost jazyka</strong> (rate) $R_N = H(X)/N$ — průměrný počet bitů informace na jeden znak. Limitou $r = \\lim_{N \\to \\infty} R_N$ získáme skutečnou obsažnost daného jazyka.',
            '<strong>Absolutní obsažnost</strong> $R = \\log_2 L$ — maximum, kterého by zdroj nad abecedou velikosti $L$ mohl dosáhnout při rovnoměrném výběru znaků.',
            '<strong>Nadbytečnost (redundance)</strong> $D = R - r$ — rozdíl mezi tím, co by jazyk mohl nést, a tím, co reálně nese.',
          ],
        },
        {
          kind: 'p',
          html: 'Pro angličtinu je $R = \\log_2 26 \\approx 4{,}7$ b/znak, $r \\approx 1{,}5$ b/znak, tedy $D \\approx 3{,}2$ b/znak (asi 68 % redundance). Vysoká redundance je důvodem, proč lze přirozený text dobře komprimovat a proč klasická frekvenční analýza funguje — útočník využívá statistických zákonitostí jazyka.',
        },
        {
          kind: 'h3',
          id: 'sec-8-5-7',
          number: '8.5.7',
          title: 'Vzdálenost jednoznačnosti a její význam',
        },
        {
          kind: 'p',
          html: '<strong>Vzdálenost jednoznačnosti</strong> $\\delta_U$ je minimální délka ŠT (v počtu znaků), při níž v průměru zbývá pouze <em>jediný smysluplný</em> kandidát na OT — útočník tedy může klíč jednoznačně určit (pokud má dostatečný výpočetní výkon). Definuje se vztahem:',
        },
        {
          kind: 'math',
          tex: '\\delta_U = \\frac{H(K)}{D},',
        },
        {
          kind: 'p',
          html: 'kde $H(K)$ je entropie klíče a $D = R - r$ je redundance jazyka. Pro jednoduchou substituci v angličtině ($H(K) = \\log_2(26!) \\approx 88{,}4$ bitů, $D \\approx 3{,}2$) vychází $\\delta_U \\approx 27{,}6$ znaků.',
        },
        {
          kind: 'p',
          html: 'Význam pro luštění šifer:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Pokud je délka ŠT <em>menší</em> než $\\delta_U$, existuje více klíčů, které šifrový text dešifrují na smysluplný (gramaticky správný) otevřený text. Útočník nemá jak rozhodnout, který je správný — i bez ohledu na výpočetní sílu je úloha nejednoznačná.',
            'Pokud je délka ŠT <em>větší nebo rovna</em> $\\delta_U$, zbývá v průměru jediný klíč a jediný smysluplný OT. Šifra je v principu prolomitelná (potřebná je „jen“ dostatečná výpočetní síla).',
            'Vzdálenost jednoznačnosti tedy odděluje úlohy nepodmíněně bezpečné od úloh prolomitelných (alespoň informačně). Pro one-time pad je $H(K) = \\infty$ vzhledem k délce zprávy a $\\delta_U = \\infty$ — proto je absolutně bezpečný.',
            'Pro zvýšení $\\delta_U$ pomáhá: větší klíč ($H(K) \\uparrow$), <strong>komprese OT před šifrováním</strong> ($r \\uparrow$, tedy $D \\downarrow$), případně doplnění OT náhodnými znaky.',
          ],
        },
        {
          kind: 'h3',
          id: 'sec-8-5-8',
          number: '8.5.8',
          title: 'Teorie složitosti a její vztah k bezpečnosti',
        },
        {
          kind: 'p',
          html: 'Zatímco teorie informace říká, <em>zda</em> lze šifru v principu prolomit, <strong>teorie složitosti</strong> řeší, <em>jak náročné</em> to je. Hodnotí algoritmy podle časové $T(n)$ a prostorové $S(n)$ náročnosti vzhledem k velikosti vstupu $n$, obvykle pomocí asymptotického zápisu $O(\\cdot)$.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>P</strong> — problémy řešitelné v polynomiálním čase deterministickým Turingovým strojem ($O(n^k)$ pro nějaké $k$).',
            '<strong>NP</strong> — problémy, jejichž řešení lze v polynomiálním čase <em>ověřit</em> (ekvivalentně: vyřešit nedeterministickým TS).',
            '<strong>NP-úplné</strong> — nejtěžší problémy v NP; každý problém z NP se na ně dá polynomiálně redukovat (např. SAT, faktorizace se mezi NP-úplnými neřadí, ale leží v NP $\\cap$ coNP).',
            '<strong>NP-těžké</strong> — alespoň tak těžké jako NP-úplné, nemusejí být v NP.',
            '<strong>EXPTIME</strong> — exponenciální čas $O(2^{p(n)})$ pro polynom $p$.',
          ],
        },
        {
          kind: 'p',
          html: 'Otevřená otázka <strong>P vs. NP</strong> je pro kryptografii zásadní: kdyby platilo $\\text{P} = \\text{NP}$, většina dnešních šifer (jak symetrických, tak asymetrických) by byla luštitelná polynomiálně — útočník hledá klíč nedeterministicky a v polynomiálním čase ověří shodu se ŠT, takže úloha luštění je v NP. Obecně se věří, že $\\text{P} \\neq \\text{NP}$, a kryptografie staví právě na předpokládané existenci tzv. <strong>jednosměrných funkcí</strong> — funkcí snadno vyčíslitelných, ale prakticky neinvertovatelných.',
        },
        {
          kind: 'p',
          html: 'Konkrétní příklady „těžkých“ problémů, na nichž stojí moderní šifry:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Faktorizace</strong> velkého čísla $n = p \\cdot q$ — základ RSA. Nejlepší známý algoritmus (GNFS) má subexponenciální složitost $\\exp(O((\\log n)^{1/3} (\\log\\log n)^{2/3}))$.',
            '<strong>Problém diskrétního logaritmu (PDL)</strong> — základ Diffie–Hellmana, ElGamala. Pro multiplikativní grupu modulo prvočíslo je nejlepší algoritmus opět GNFS, pro eliptické křivky pouze $O(\\sqrt{n})$.',
            '<strong>Hledání klíče u symetrické šifry</strong> — brute-force má složitost $O(2^k)$ pro $k$-bitový klíč. Pro $k = 128$ a více je úloha výpočetně neproveditelná.',
          ],
        },
        {
          kind: 'p',
          html: 'Vztah mezi teorií složitosti a bezpečností je tedy přímý: <strong>výpočetní bezpečnost</strong> šifry znamená, že nejlepší známý útok má superpolynomiální složitost a pro reálné délky klíčů jej není možné v rozumném čase provést. <strong>Prokazatelná bezpečnost</strong> jde dále — formálně redukuje prolomení šifry na předpokládaně těžký problém, takže by jeho vyřešení (např. faktorizace) bylo důkazem prolomení šifry a obráceně.',
        },
      ],
    },
  ],
}
