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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '8.5',
          title: 'Vzdálenost jednoznačnosti',
          html: '$\\delta_U = \\dfrac{H(K)}{D}$ — počet znaků ŠT potřebných k tomu, aby zbýval v průměru jediný OT. Pro jednoduchou substituci v angličtině: $\\delta_U = \\log_2(26!)/3{,}2 \\approx 27{,}6$.',
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
  ],
}
