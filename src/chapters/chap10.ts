import type { Chapter } from '../types'

export const chap10: Chapter = {
  id: 'chap-10',
  number: '10',
  title: 'Generování klíčů a náhodná čísla',
  sections: [
    {
      id: 'sec-10-1',
      number: '10.1',
      title: 'Čínská věta o zbytcích',
      blocks: [
        {
          kind: 'callout',
          type: 'veta',
          number: '10.1',
          title: 'Čínská věta o zbytcích',
          html: 'Nechť $m_1, \\dots, m_r$ jsou po dvou nesoudělná. Pak soustava kongruencí $x \\equiv a_i \\pmod{m_i}$ ($i = 1, \\dots, r$) má jediné řešení modulo $M = m_1 \\cdots m_r$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '10.1',
          title: 'CRT',
          html: 'Pro $|x|_3 = 1$, $|x|_5 = 2$, $|x|_7 = 3$ je $M = 105$. S $M_3 = 35$, $M_5 = 21$, $M_7 = 15$ řešíme $35y_3 \\equiv 1 \\pmod 3$ ($y_3 = 2$), $21 y_5 \\equiv 1 \\pmod 5$ ($y_5 = 1$), $15 y_7 \\equiv 1 \\pmod 7$ ($y_7 = 1$). Pak $x = |1\\cdot70 + 2\\cdot21 + 3\\cdot15|_{105} = 52$.',
        },
      ],
    },
    {
      id: 'sec-10-2',
      number: '10.2',
      title: 'Kvadratická residua, Legendre a Jacobi',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '10.1',
          title: 'Kvadratické residuum',
          html: 'Celé $a$ je <strong>kvadratickým residuem</strong> modulo $m$, pokud $\\gcd(a, m) = 1$ a kongruence $x^2 \\equiv a \\pmod m$ má řešení. Jinak je <strong>nonresiduum</strong>.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '10.2',
          title: 'Počet kořenů',
          html: 'Pro liché prvočíslo $p$ má $x^2 \\equiv a \\pmod p$ buď 2 řešení, nebo žádné. Pro $n = pq$ (součin dvou prvočísel) má kvadratické residuum přesně 4 kořeny.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.2',
          title: 'Legendreův symbol',
          html: '$\\left(\\dfrac{a}{p}\\right) = +1$ pokud je $a$ kvadratickým residuem mod $p$, $-1$ jinak.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '10.3',
          title: 'Eulerovo kritérium',
          html: '$\\left(\\dfrac{a}{p}\\right) \\equiv a^{(p-1)/2} \\pmod p$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.3',
          title: 'Jacobiho symbol',
          html: 'Zobecnění pro liché $n = p_1^{\\alpha_1} \\cdots p_k^{\\alpha_k}$: $\\left[\\dfrac{a}{n}\\right] = \\prod_i \\left(\\dfrac{a}{p_i}\\right)^{\\alpha_i}$.',
        },
      ],
    },
    {
      id: 'sec-10-3',
      number: '10.3',
      title: 'Generátory',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '10.4',
          title: 'Generátor',
          html: '$g$ je <strong>generátorem</strong> $\\mathbb{Z}_p^*$, pokud pro každé $b \\in \\{1, \\dots, p-1\\}$ existuje $a$ tak, že $g^a \\equiv b \\pmod p$.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '10.4',
          title: 'Test generátoru',
          html: 'Nechť $p - 1 = p_1^{\\alpha_1} \\cdots p_k^{\\alpha_k}$. Číslo $g$ je generátorem mod $p$ právě tehdy, když pro každé $i$ platí $|g^{(p-1)/p_i}|_p \\ne 1$.',
        },
      ],
    },
    {
      id: 'sec-10-4',
      number: '10.4',
      title: 'Faktorizace a testy prvočíselnosti',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>NFS</strong> (Number Field Sieve) — rychlý pro čísla ≥ 110 míst.',
            '<strong>QS</strong> (Quadratic Sieve) — do 110 míst.',
            '<strong>ECM</strong> (Elliptic Curve Method) — do 43 míst.',
            '<strong>TD</strong> (Trial Division), Pollard, řetězové zlomky — méně používané.',
          ],
        },
        {
          kind: 'p',
          html: 'Pro RSA generujeme prvočísla testováním náhodných lichých čísel. $\\pi(2^{512}) \\approx 10^{151}$ — prvočísel je dost. Hustota: pravděpodobnost, že náhodné liché číslo s 340 ciframi je prvočíslo, je $\\approx 2/\\log(10^{340})$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.5',
          title: 'Solovay–Strassenův test',
          html: 'Vybereme náhodné liché $a < p$. Spočteme $j = |a^{(p-1)/2}|_p$. Pokud $j \\ne \\left[\\dfrac{a}{p}\\right]$, $p$ není prvočíslo. Pravděpodobnost, že složené $p$ projde, je $\\le 1/2$. Po $t$ testech klesá na $2^{-t}$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.6',
          title: 'Lehmannův test',
          html: 'Místo Legendreova symbolu se kontroluje pouze $a^{(p-1)/2} \\equiv \\pm 1 \\pmod p$. Stejná složitost, jednodušší implementace.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.7',
          title: 'Rabin–Millerův test',
          html: 'Zapíšeme $p = 1 + 2^b m$ s lichým $m$. Pro náhodné $a$: $z := |a^m|_p$. Pokud $z = 1$, pokračuj iterací. Jinak postupně $z := |z^2|_p$ a kontroluj zda $z = p - 1$. Pokud po $b - 1$ krocích není $z = p - 1$, pak $p$ není prvočíslo. Pravděpodobnost, že složené $p$ projde, je $\\le 1/4$ — po $t$ testech $4^{-t}$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '10.1',
          title: 'Praktické generování prvočísla',
          html: '(1) Vygenerovat náhodné liché číslo s MSB = LSB = 1. (2) Otestovat dělitelnost malými prvočísly (do 1000) — vyloučí ~80&nbsp;% složených. (3) Rabin–Millerův test opakovaně (≥ 5×). (4) Při neúspěchu vygenerovat jiné.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '10.2',
          title: 'Silná prvočísla pro RSA',
          html: 'Pro $n = pq$ je vhodné, aby $(p-1)$ a $(q-1)$ měly velké prvočinitele $p\', q\'$ a aby $\\gcd(p-1, q-1)$ byl malý. Délka klíče je však považována za důležitější než zvláštní struktura.',
        },
      ],
    },
    {
      id: 'sec-10-5',
      number: '10.5',
      title: 'Náhodná čísla v kryptografii',
      blocks: [
        {
          kind: 'p',
          html: 'Náhodná čísla jsou potřeba pro generování klíčů, nonces, salt, výplní a Vernamovu šifru. Pravidlo: <em>kryptosystém je jen tak silný, jak silný je jeho nejslabší článek.</em> Chybný RNG je fatální slabinou.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.8',
          title: 'Entropie',
          html: 'Míra náhodnosti — jak obtížné je hodnotu uhodnout. Vždy se vztahuje k útočníkovi. Maximální entropie generátoru: rovnoměrné rozdělení všech možných posloupností.',
        },
      ],
    },
    {
      id: 'sec-10-6',
      number: '10.6',
      title: 'Pseudonáhodné generátory (PRNG)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '10.9',
          title: 'Lineární kongruenční generátor',
          html: '$X_{n+1} = (a X_n + c) \\bmod m$. Maximální periody $m$ dosáhneme, když $\\gcd(c, m) = 1$, $a - 1$ je dělitelné všemi prvočiniteli $m$ a navíc 4 dělí $a - 1$ pokud 4 | $m$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '10.3',
          title: 'Slabiny LCG',
          html: 'Body $(X_n, X_{n+1}, \\dots)$ leží v $n$-rozměrném prostoru na nejvýše $m^{1/n}$ hyperrovinách. Pokud $m$ je mocnina 2, nízké bity $X$ mají krátkou periodu. <strong>LCG není kryptograficky bezpečný.</strong>',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.10',
          title: 'Kryptograficky bezpečný PRNG',
          html: '<ul><li><strong>Next-bit test:</strong> z $k$ bitů nelze polynomiálním algoritmem uhodnout $(k+1)$-tý bit s pravděpodobností > 1/2.</li><li><strong>State compromise:</strong> ze znalosti vnitřního stavu nelze rekonstruovat dříve vygenerovaná data ani předpovědět budoucí (pokud do generátoru vstupuje entropie).</li></ul>',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Bloková šifra v CTR módu</strong> — náhodný klíč (seed) a počáteční čítač.',
            '<strong>Hešovací funkce nad čítačem</strong>.',
            '<strong>Proudové šifry</strong> jsou v podstatě PRNG.',
            '<strong>Blum–Blum–Shub</strong> — $X_{n+1} = X_n^2 \\bmod m$, $m = pq$, $p, q \\equiv 3 \\pmod 4$. Bezpečnost spojena s faktorizací.',
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '10.4',
          title: 'Entropie a PRNG',
          html: 'PRNG <strong>nemůže zvyšovat entropii</strong>. Entropie výstupu je dána entropií vstupního seedu.',
        },
      ],
    },
    {
      id: 'sec-10-7',
      number: '10.7',
      title: 'Skutečně náhodné generátory (TRNG)',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            'Zdroje entropie: radioaktivní rozpad, atmosférický šum, teplotní šum, pohyby myši, prodlevy klávesnice.',
            'Výstup není předvídatelný ani při znalosti všech parametrů.',
            'Horší statistické vlastnosti → nutný <strong>post-processing</strong>.',
            'Zdroj entropie je třeba průběžně testovat — jeho vlastnosti se mohou zhoršit.',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.11',
          title: 'Von Neumannův dekorelátor',
          html: 'Bity se odebírají po dvou: 00 a 11 se zahodí, 01 → 0, 10 → 1. Eliminuje nevyváženost a korelaci.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'XOR výstupu TRNG s výstupem silného PRNG.',
            'XOR výstupů více TRNG (software whitening).',
            'Hešování výstupu TRNG kvalitní hašovací funkcí.',
          ],
        },
      ],
    },
    {
      id: 'sec-10-8',
      number: '10.8',
      title: 'Testování náhodnosti',
      blocks: [
        {
          kind: 'callout',
          type: 'poznamka',
          number: '10.5',
          title: 'Co umí statistické testy',
          html: 'Statistické testy mohou prokázat, že generátor <strong>NENÍ kvalitní</strong>, ale nikoli to, že je kvalitní. Pracují s p-hodnotou na zvolené hladině významnosti.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Frekvenční test</strong> — počet 0 a 1.',
            '<strong>Runs test</strong> — počet a délka řetězců stejných bitů.',
            '<strong>Test hodností matic</strong> — lineární závislost podposloupností.',
            '<strong>Spektrální test (DFT)</strong> — periodicita.',
            '<strong>Maurerův univerzální test</strong> — komprimovatelnost.',
          ],
        },
        {
          kind: 'p',
          html: 'Známé sady: <strong>Diehard</strong>, <strong>Dieharder</strong>, <strong>NIST</strong>. Pro TRNG je nutné analyzovat zdroj entropie a navrhnout cílené testy specifické pro daný zdroj.',
        },
      ],
    },
  ],
}
