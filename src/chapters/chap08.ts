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
  ],
}
