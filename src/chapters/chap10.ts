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
          plain:
            'Číslo, které je modulo m něčí druhou mocninou. Slouží jako stavební kámen pro Solovay-Strassenův test prvočíselnosti a pro generátor Blum-Blum-Shub — bezpečnost obojího stojí na rozeznávání residuí od nonresiduí.',
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
          plain:
            'Vrátí +1 nebo -1 podle toho, zda je číslo druhou mocninou modulo prvočíslo. Důležité pro testy prvočíselnosti — pomocí Eulerova kritéria se rychle spočítá umocněním.',
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
          plain:
            'Rozšíření Legendreova symbolu i na liché složené moduly. Klíčové pro Solovay-Strassenův test — počítá se rychle Eukleidovým algoritmem, aniž bychom znali rozklad n.',
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
          plain:
            'Prvek, jehož mocniny postupně „obsahují“ všechna nenulová čísla modulo p. Bez generátoru by Diffie-Hellman ani ElGamal nefungovaly — potřebujeme prostor, ve kterém má diskrétní logaritmus smysl.',
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
          plain:
            'Pravděpodobnostní test prvočíselnosti — porovnává mocninu a^((p-1)/2) s Jacobiho symbolem. Pokud se neshodují, p prvočíslo není; pokud ano, není to jistota, ale po několika nezávislých kolech klesá pravděpodobnost falešného úspěchu na zanedbatelnou.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.6',
          title: 'Lehmannův test',
          html: 'Místo Legendreova symbolu se kontroluje pouze $a^{(p-1)/2} \\equiv \\pm 1 \\pmod p$. Stejná složitost, jednodušší implementace.',
          plain:
            'Zjednodušená verze Solovay-Strassena, která nepotřebuje počítat Legendreův symbol. V praxi se moc nepoužívá — Miller-Rabin je silnější a stejně rychlý.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '10.7',
          title: 'Rabin–Millerův test',
          html: 'Zapíšeme $p = 1 + 2^b m$ s lichým $m$. Pro náhodné $a$: $z := |a^m|_p$. Pokud $z = 1$, pokračuj iterací. Jinak postupně $z := |z^2|_p$ a kontroluj zda $z = p - 1$. Pokud po $b - 1$ krocích není $z = p - 1$, pak $p$ není prvočíslo. Pravděpodobnost, že složené $p$ projde, je $\\le 1/4$ — po $t$ testech $4^{-t}$.',
          plain:
            'Dnes standardní test prvočíselnosti — pravděpodobnost falešného úspěchu je 1/4 na test, takže po 5-10 testech je jistota dostatečná. Bez něj by RSA neuměla rychle vygenerovat klíče: nikdo nemá čas hledat prvočíslo deterministicky.',
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
          plain:
            'Kolik bitů „skutečné náhodnosti“ v hodnotě je. Bez dostatečné entropie ve zdroji nelze vyrobit bezpečný klíč — útočník by ho jednoduše uhádnul. Praktický příklad: známá zranitelnost Debianu 2008 vznikla z chyby v entropii.',
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
          plain:
            'Jeden z nejjednodušších generátorů pseudonáhodných čísel — každé další číslo vznikne lineárním vzorcem z předchozího. Rychlý a vhodný pro simulace, ale pro kryptografii zcela nepoužitelný — útočník z pár výstupů dopočítá další.',
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
          plain:
            'PRNG, který útočník nedokáže předpovídat — ani když vidí dlouhou historii výstupu. Tohle je vlastnost, kterou musí splňovat všechny generátory klíčů, nonces a podobně, aby je nešlo uhádnout.',
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
          plain:
            'Trik, jak z proudu mírně předpojatých bitů (např. 60 % jedniček) vyrobit férový. Dvojice 00 a 11 se zahodí, asymetrické 01/10 dají férový bit. Cena: pomalejší rychlost.',
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
    {
      id: 'sec-10-9',
      number: '10.9',
      title: 'Příklady',
      blocks: [
        {
          kind: 'p',
          html: 'Klasická úloha k Rabin-Millerovu testu: rozložit $p - 1 = 2^b \\cdot m$ na sudou a lichou část a říct, kolik mocnin v testu spočítáme.',
        },
        {
          kind: 'exercise',
          number: '10.2',
          title: 'Rabin–Miller pro $p = 401$',
          source: '1. selftest 2025/26',
          problem:
            'Jaký největší exponent $m$ a kolik mocnin nejvýše musíme spočítat pro Rabinův–Millerův test čísla $401$? Odpovězte „m, počet“.',
          solution:
            '<p>$p - 1 = 400 = 2^4 \\cdot 25$. Tedy $b = 4$ a lichý zbytek $m = 25$.</p><p>„Největší exponent“ ve smyslu mocniny báze v průběhu testu: $a^{2^{b-1} m} = a^{8\\cdot 25} = a^{200}$. Postupně počítáme $a^m, a^{2m}, a^{4m}, a^{8m}$, tj. <strong>4 mocniny</strong> (po výpočtu $a^m$ stačí $b - 1$ umocnění na druhou).</p>',
          result: '$m_{\\max} = 200$, počet mocnin $= 4$.',
          answer: {
            type: 'open',
            accept: ['200,4'],
            placeholder: 'm, počet',
          },
        },
        {
          kind: 'exercise',
          number: '10.3',
          title: 'Rabin–Miller pro $p = 481$',
          source: '2. test 02.05.2025',
          problem:
            'Jaký nejmenší exponent $m$ a kolik mocnin nejvýše musíme spočítat pro Rabin-Millerův test čísla $481$? Odpovězte „m, počet“.',
          solution:
            '<p>$p - 1 = 480 = 2^5 \\cdot 15$. Tedy $b = 5$ a lichá část $m = 15$ (nejmenší exponent v posloupnosti).</p><p>Postupně počítáme $a^{15}, a^{30}, a^{60}, a^{120}, a^{240}$ — celkem <strong>5 mocnin</strong>.</p>',
          result: '$m_{\\min} = 15$, počet mocnin $= 5$.',
          answer: {
            type: 'open',
            accept: ['15,5'],
            placeholder: 'm, počet',
          },
        },
        {
          kind: 'exercise',
          number: '10.4',
          title: 'Rabin–Miller pro $p = 281$',
          source: '2. test 02.05.2025',
          problem:
            'Jaký nejmenší exponent a kolik mocnin musíme spočítat pro Rabin-Millerův test čísla $281$?',
          solution:
            '<p>$p - 1 = 280 = 2^3 \\cdot 35$. Lichá část $m = 35$, $b = 3$.</p><p>Posloupnost: $a^{35}, a^{70}, a^{140}$ — celkem <strong>3 mocniny</strong>.</p>',
          result: '$m_{\\min} = 35$, počet mocnin $= 3$.',
          answer: {
            type: 'open',
            accept: ['35,3'],
            placeholder: 'm, počet',
          },
        },
        {
          kind: 'exercise',
          number: '10.5',
          title: 'Báze v Rabin-Millerově testu',
          source: '2. test 02.05.2025',
          problem:
            'Mějme $p = 39$ a báze $a_1 = 4$, $a_2 = 11$. Jsou tyto báze silnými svědky složenosti? Jaká je pravděpodobnost, že $p$ je prvočíslo? (Odpověď: „ano/ne, ano/ne, pravděpodobnost“.)',
          solution:
            '<p>$39 = 3 \\cdot 13$ — tedy <em>nikdy</em> není prvočíslo, pravděpodobnost $= 0$ bez ohledu na výsledky.</p><p>$p - 1 = 38 = 2 \\cdot 19$, $b = 1$, $m = 19$.</p><p>$a_1 = 4$: $4^{19} \\bmod 39$. $4^2 = 16$, $4^4 = 256 \\equiv 256 - 6\\cdot 39 = 22$, $4^8 \\equiv 22^2 = 484 \\equiv 484 - 12\\cdot 39 = 16$, $4^{16} \\equiv 16^2 = 256 \\equiv 22$. $4^{19} = 4^{16} \\cdot 4^2 \\cdot 4 \\equiv 22 \\cdot 16 \\cdot 4 = 1408 \\equiv 1408 - 36 \\cdot 39 = 4$. Hodnota není $\\pm 1 \\bmod 39$, takže $a_1$ je silný svědek složenosti. ✓</p><p>$a_2 = 11$: $11^2 = 121 \\equiv 121 - 3\\cdot 39 = 4$, $11^4 \\equiv 16$, $11^8 \\equiv 22$, $11^{16} \\equiv 22^2 = 484 \\equiv 16$. $11^{19} = 11^{16} \\cdot 11^2 \\cdot 11 \\equiv 16 \\cdot 4 \\cdot 11 = 704 \\equiv 704 - 18\\cdot 39 = 2$. Není $\\pm 1$, takže i $a_2$ je silný svědek složenosti. ✓</p>',
          result: 'ano, ano, $0$',
          answer: {
            type: 'open',
            accept: ['ano,ano,0'],
            placeholder: 'ano/ne, ano/ne, P',
          },
        },
        {
          kind: 'exercise',
          number: '10.6',
          title: 'Fermat lhář vs. silný svědek',
          source: '2. test 02.05.2025',
          problem:
            'Které z následujících bází budou <em>lhát</em> u Fermatova testu nad $p = 35$, ale budou <em>silným svědkem složenosti</em> u Rabin-Millerova testu? Vyberte všechny správné.',
          solution:
            '<p>$35 = 5 \\cdot 7$. $\\varphi(35) = 24$. Fermatův lhář $a$: $a^{34} \\equiv 1 \\pmod{35}$ přes Carmichaelovu $\\lambda(35) = \\mathrm{lcm}(4, 6) = 12$. $34 \\bmod 12 = 10$, takže $a$ je lhář, právě když $a^{10} \\equiv 1 \\pmod{35}$.</p><p>$p-1 = 34 = 2 \\cdot 17$, $b = 1$, $m = 17$. R-M projde, pokud $a^{17} \\equiv \\pm 1 \\pmod{35}$ — jinak je silný svědek.</p><p>Pro $a = 29$: $29 \\equiv -6 \\pmod{35}$. $29^2 \\equiv 36 \\equiv 1$. Takže $29^{17} = 29 \\cdot (29^2)^8 \\equiv 29 \\cdot 1 = 29 \\equiv -6 \\pmod{35}$. To není $\\pm 1$ → silný svědek. Fermat: $29^{10} = (29^2)^5 \\equiv 1$ → lhář. ✓</p><p>Pro $a = 6$: $6^2 = 36 \\equiv 1$. $6^{17} = 6 \\cdot (6^2)^8 \\equiv 6$, není $\\pm 1$ → silný svědek. Fermat: $6^{10} \\equiv 1$ → lhář. ✓</p><p>Pro $a = 7$: $\\gcd(7, 35) = 7$, není nesoudělné — báze nemá smysl pro testy. Není ani lhář, ani svědek v běžném smyslu.</p><p>Pro $a = 34 \\equiv -1$: $34^{17} \\equiv -1 \\equiv 34 \\pmod{35}$ → není silný svědek (R-M projde, $\\pm 1$).</p>',
          result: 'Báze $a = 29$ a $a = 6$.',
          answer: {
            type: 'multichoice',
            options: [
              { text: '$a = 29$', correct: true },
              { text: '$a = 6$', correct: true },
              { text: '$a = 7$', correct: false },
              { text: '$a = 34$', correct: false },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '10.7',
          title: 'Pravděpodobnost prvočíselnosti',
          source: '2. test 02.05.2025',
          problem:
            'Testujeme prvočíselnost $p$ Rabin-Millerovým testem se 4 různými bázemi. 3 testy proběhly úspěšně, 4. test selhal. Jaká je pravděpodobnost, že $p$ je prvočíslo?',
          solution:
            '<p>Jakmile <em>jediný</em> R-M test selže (báze je svědek složenosti), víme s jistotou, že $p$ je složené.</p><p>Pravděpodobnost prvočíselnosti je proto $0$ — bez ohledu na to, kolik testů předtím proběhlo úspěšně.</p>',
          result: '$P = 0$',
          answer: {
            type: 'open',
            accept: ['0', 'p=0'],
            placeholder: 'P = ?',
          },
        },
      ],
    },
  ],
}
