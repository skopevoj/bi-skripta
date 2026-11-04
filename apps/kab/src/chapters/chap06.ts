import type { Chapter } from '../types'

export const chap06: Chapter = {
  id: 'chap-6',
  number: '6',
  title: 'RSA, DSA, ElGamal',
  intro: [
    {
      kind: 'p',
      html: 'Asymetrická kryptografie (s veřejným klíčem) řeší problém distribuce klíčů. Každý subjekt má pár <strong>veřejný klíč VK</strong> (k šifrování / ověření) a <strong>soukromý klíč SK</strong> (k dešifrování / podpisu). Z VK nelze schůdně vypočítat SK.',
    },
  ],
  sections: [
    {
      id: 'sec-6-1',
      number: '6.1',
      title: 'RSA',
      blocks: [
        {
          kind: 'p',
          html: 'RSA (Rivest, Shamir, Adleman, 1977) je asymetrický kryptosystém založený na modulárním umocňování a problému faktorizace celých čísel.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.1',
          title: 'RSA — generování klíčů',
          html: 'Volíme prvočísla $p, q$, modul $n = pq$, Eulerova funkce $\\Phi(n) = (p-1)(q-1)$. Šifrovací exponent $e$ s $\\gcd(e, \\Phi(n)) = 1$. Dešifrovací exponent $d = |e^{-1}|_{\\Phi(n)}$. <strong>Veřejný klíč:</strong> $VK = (n, e)$. <strong>Soukromý klíč:</strong> $SK = (n, d)$.',
          plain:
            'Klíčová dvojice RSA vznikne vynásobením dvou velkých prvočísel a vypočtením inverzního exponentu. Bezpečnost stojí na tom, že z veřejného modulu nikdo neumí v rozumném čase zpětně zjistit jeho dvě prvočinná složky — a bez nich nedopočítá soukromý klíč.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.2',
          title: 'RSA — šifrování a dešifrování',
          html: 'Šifrování: $c = E(m) = |m^e|_n$. Dešifrování: $m = D(c) = |c^d|_n$.',
          plain:
            'Šifrování je umocnění zprávy veřejným exponentem modulo n, dešifrování je opak — umocnění soukromým exponentem. Stejná operace v obou směrech; co dělá ji asymetrickou, je rozdíl mezi e (veřejný) a d (soukromý).',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '6.1',
          title: 'Korektnost RSA',
          html: '$|c^d|_n = |m^{ed}|_n = |m^{k\\Phi(n)+1}|_n = |(m^{\\Phi(n)})^k m|_n = m$ (Eulerova věta, $\\gcd(m, n) = 1$).',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '6.1',
          title: 'RSA',
          html: 'Pro $p = 43$, $q = 59$ je $n = 2537$, $\\Phi(n) = 2436$. Zvolíme $e = 13$. Pak $d = |13^{-1}|_{2436} = 937$. Šifrování bloku 1520: $c = |1520^{13}|_{2537} = 95$.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-1-1',
          number: '6.1.1',
          title: 'Bezpečnost a faktorizace',
        },
        {
          kind: 'p',
          html: 'Znalost $p, q$ umožňuje spočítat $\\Phi(n)$ a tím $d$. Pro neznámé $p, q$ je výpočet $\\Phi(n)$ ekvivalentní faktorizaci $n$. Dosud nebyl prokázán způsob, jak prolomit RSA bez faktorizace.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '6.1',
          title: 'Doporučení pro výběr p, q',
          html: '$|p - q| > 2^{\\text{len}(n)/2 - 100}$ (FIPS 186-4). Obě hodnoty $p - 1, q - 1$ by měly mít velký prvočinitel. $\\gcd(p-1, q-1)$ by mělo být malé.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-1-2',
          number: '6.1.2',
          title: 'RSA-CRT (urychlení dešifrování)',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.3',
          title: 'RSA-CRT',
          html: 'Předpočítáme $d_p = |d|_{p-1}$, $d_q = |d|_{q-1}$, $q_{inv} = |q^{-1}|_p$. Dešifrování:<br>(1) $m_1 = |c^{d_p}|_p$, $m_2 = |c^{d_q}|_q$;<br>(2) $h = |q_{inv}(m_1 - m_2)|_p$;<br>(3) $m = m_2 + h\\cdot q$. Zrychlení 4–8× díky polovičním délkám čísel.',
          plain:
            'Trik, jak dešifrovat RSA 4-8× rychleji. Místo umocňování modulo velké n se počítá zvlášť modulo p a modulo q (poloviční čísla), výsledky se pak složí podle Čínské věty o zbytcích. Funguje jen vlastník soukromého klíče — útočník bez rozkladu n tohle nedokáže.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-1-3',
          number: '6.1.3',
          title: 'Digitální podpis pomocí RSA',
        },
        {
          kind: 'p',
          html: 'Podepsání zprávy $m$ subjektem A: $S = D_{SK_A}(m) = |m^{d_A}|_{n_A}$. Ověření: $m = E_{VK_A}(S) = |S^{e_A}|_{n_A}$. Kombinace $(m, S)$ poskytuje autentizaci a <strong>nepopiratelnost</strong> — pouze A zná $d_A$.',
        },
        {
          kind: 'interactive',
          component: 'rsa',
          title: 'RSA na malých číslech',
          hint: 'Zvol prvočísla p, q a exponent e: hned uvidíš soukromý klíč d a jak dešifrování vrátí zprávu m.',
        },
      ],
    },
    {
      id: 'sec-6-2',
      number: '6.2',
      title: 'Digitální podpis — vlastnosti',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Nezfalšovatelnost / autentizace</strong> — podpis vyžaduje soukromý klíč.',
            '<strong>Integrita</strong> — modifikace zprávy zneplatní podpis (podepisuje se haš).',
            '<strong>Nepopiratelnost</strong> — podepisující nemůže popřít, že dokument podepsal.',
            '<strong>Ověřitelnost</strong> — pomocí veřejného klíče.',
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '6.2',
          title: 'Kategorie podpisů',
          html: '<ul><li><strong>Přímé</strong> — mezi dvěma subjekty, problém s popíratelností (chybí třetí strana).</li><li><strong>Verifikované (arbitrated)</strong> — důvěryhodný arbitr ověřuje všechny podpisy.</li></ul>',
        },
      ],
    },
    {
      id: 'sec-6-3',
      number: '6.3',
      title: 'ElGamal',
      blocks: [
        {
          kind: 'p',
          html: 'ElGamal (Taher ElGamal) je asymetrické šifrování i schéma podpisu založené na <strong>Diffie-Hellmanově problému</strong> (potažmo PDL). Umožňuje šifrování i digitální podpis (DSS/DSA je odvozenina).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.4',
          title: 'ElGamal — příprava klíče',
          html: 'Alice zvolí grupu řádu $m-1$ a generátor $g$, soukromý klíč $k_A < m$. Spočítá $y_A = |g^{k_A}|_m$. <strong>VK Alice:</strong> $(m, g, y_A)$. <strong>SK Alice:</strong> $k_A$.',
          plain:
            'Alice si zvolí tajné číslo a zveřejní mocninu generátoru tímto číslem. Bezpečnost stojí na diskrétním logaritmu — z veřejné mocniny nikdo zpětně neumí spočítat samotný exponent.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.5',
          title: 'ElGamal — šifrování',
          html: 'Bob chce poslat zprávu $p$. Volí $k_B$, spočítá $y_B = |g^{k_B}|_m$ a sdílený klíč $K = |y_A^{k_B}|_m$. Šifruje $c = |p \\cdot K|_m$. Posílá dvojici $(y_B, c)$.',
          plain:
            'Bob si pro jednu zprávu vytvoří jednorázový Diffie-Hellman se svou stranou, použije výsledný sdílený klíč k „maskování“ zprávy (vynásobením modulo m) a pošle Alici i svou veřejnou polovinu. Důležité: jednorázové k_B se nesmí opakovat, jinak by ze dvou zpráv šel klíč dopočítat.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.6',
          title: 'ElGamal — dešifrování',
          html: 'Alice spočítá $K = |y_B^{k_A}|_m$, najde inverzi $K^{-1}$ rozšířeným Euklidovým algoritmem a dešifruje $p = |c \\cdot K^{-1}|_m$.',
          plain:
            'Alice si z Bobovy veřejné poloviny a svého tajného klíče dopočítá stejný sdílený klíč jako on a vynásobením inverzí ho ze šifrové zprávy odečte. Útočník toto neumí — chybí mu Alicin tajný klíč.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '6.2',
          title: 'ElGamal',
          html: 'Pro $m = 2543$, $g = 5$, $k_A = 10$ je $y_A = 505$. Bob s $k_B = 123$ má $y_B = 308$ a $K = 1883$. Šifruje „EL“ (= 0511): $c = |511 \\cdot 1883|_{2543} = 959$. Alice spočítá $K^{-1} = 1337$ a dešifruje $|959 \\cdot 1337|_{2543} = 511 = $ „EL“.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '6.3',
          title: 'Bezpečné použití ElGamalu',
          html: 'Volba $k_B$ <strong>musí být náhodná a jednorázová</strong> — nesmí se opakovat napříč zprávami, jinak útočník dokáže porovnáním ŠT odhalit OT. Příklad v přednášce s pevným $k_B$ je čistě didaktický.',
        },
      ],
    },
    {
      id: 'sec-6-4',
      number: '6.4',
      title: 'DSA (DSS)',
      blocks: [
        {
          kind: 'p',
          html: '<strong>DSS</strong> (Digital Signature Standard) využívá algoritmus <strong>DSA</strong> — variantu ElGamalu specializovanou pro podpis. Zpráva se nejprve hašuje, podepisuje se haš spolu s náhodným nonce. Výstupem podpisu je dvojice $(r, s)$. Veřejné parametry: prvočíslo $p$, $q | (p-1)$, generátor $g$. Pro ověření se použije VK podepisujícího.',
        },
      ],
    },
    {
      id: 'sec-6-5',
      number: '6.5',
      title: 'Příklady',
      blocks: [
        {
          kind: 'p',
          html: 'Praktické úlohy ze zápočtů — sestavení klíčů, dešifrování i podvodná manipulace s ElGamalem.',
        },
        {
          kind: 'exercise',
          number: '6.3',
          title: 'RSA — výpočet soukromého klíče a dešifrování',
          source: '1. selftest 2025/26',
          problem:
            'Mějme RSA s $p = 7$, $q = 13$ a veřejným exponentem $e = 59$. Spočítejte $d$ a dešifrujte $c = 10$. Odpověď: $n, d, m$.',
          solution:
            '<p>$n = 7 \\cdot 13 = 91$. $\\varphi(n) = 6 \\cdot 12 = 72$.</p><p>$d = e^{-1} \\bmod 72$. Rozšířený Eukleides: $72 = 1\\cdot 59 + 13$, $59 = 4\\cdot 13 + 7$, $13 = 1\\cdot 7 + 6$, $7 = 1\\cdot 6 + 1$. Zpětně: $1 = 7 - 6 = 7 - (13 - 7) = 2\\cdot 7 - 13 = 2(59 - 4\\cdot 13) - 13 = 2\\cdot 59 - 9\\cdot 13 = 2\\cdot 59 - 9(72 - 59) = 11\\cdot 59 - 9\\cdot 72$. Tedy $d \\equiv 11 \\pmod{72}$.</p><p>$m = |c^d|_n = |10^{11}|_{91}$. Pomocí RSA-CRT: $10 \\bmod 7 = 3$, $3^{11} \\bmod 7 = 3^{11 \\bmod 6} = 3^5 \\bmod 7 = 5$ (z Malé Fermatovy věty). $10 \\bmod 13 = 10$, $10^{11} \\bmod 13 = 10^{11 \\bmod 12} = 10^{11} \\bmod 13$; postupně $10^2 \\equiv 9$, $10^4 \\equiv 3$, $10^8 \\equiv 9$, $10^{11} = 10^8 \\cdot 10^2 \\cdot 10 \\equiv 9 \\cdot 9 \\cdot 10 = 810 \\equiv 4 \\pmod{13}$. CRT: hledáme $m$ s $m \\equiv 5 \\pmod 7$, $m \\equiv 4 \\pmod{13}$. $m = 13 k + 4$, $13k + 4 \\equiv 5 \\pmod 7 \\Rightarrow 6k \\equiv 1 \\pmod 7 \\Rightarrow k \\equiv 6 \\pmod 7$, $k = 6$, $m = 82$.</p>',
          result: '$n = 91,\\ d = 11,\\ m = 82$',
          answer: {
            type: 'open',
            accept: ['91,11,82'],
            placeholder: 'n, d, m',
          },
        },
        {
          kind: 'exercise',
          number: '6.4',
          title: 'RSA — Alenka generuje klíče',
          source: '2. test 02.05.2025',
          problem:
            'Alenka si pro RSA volí $p = 13$, $q = 17$. Rozhodněte o pravdivosti tvrzení.',
          solution:
            '<p>$n = 221$, $\\varphi(n) = 12 \\cdot 16 = 192$. Veřejný exponent musí splňovat $\\gcd(e, 192) = 1$. $192 = 2^6 \\cdot 3$, takže $e$ musí být liché a nedělitelné 3.</p><p>$e = 7$: $\\gcd(7, 192) = 1$, lze.</p><p>$e = 48$: $\\gcd(48, 192) = 48 \\ne 1$, <em>nelze</em>.</p><p>$e = 31$: $\\gcd(31, 192) = 1$. $d = 31^{-1} \\bmod 192$. $31 \\cdot 31 = 961 = 5 \\cdot 192 + 1$, takže $d = 31$. (Hezká samoinverzní volba.)</p>',
          result: '$\\varphi(n) = 192$. Lze $e = 7$ a $e = 31$ (pak $d = 31$). $e = 48$ nelze.',
          answer: {
            type: 'multichoice',
            options: [
              { text: 'Eulerova funkce modulu je $\\varphi(n) = 192$.', correct: true },
              { text: 'Jako veřejný exponent lze zvolit $e = 7$.', correct: true },
              {
                text: 'Pokud zvolíme $e = 31$, soukromý exponent je $d = 31$.',
                correct: true,
              },
              {
                text: 'Pokud zvolíme $e = 48$, soukromý exponent je $d = 16$.',
                correct: false,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '6.5',
          title: 'RSA-CRT — dešifrování',
          source: '2. test 02.05.2025',
          problem:
            'RSA-CRT s $p = 11$, $q = 13$, $CT = 61$, $d = 37$. Dešifrujte $CT$ metodou CRT. Odpovězte $m_p, m_q, OT$.',
          solution:
            '<p>$d_p = d \\bmod (p-1) = 37 \\bmod 10 = 7$. $d_q = d \\bmod (q-1) = 37 \\bmod 12 = 1$.</p><p>$m_p = |CT^{d_p}|_p = |61^7|_{11}$. $61 \\equiv 6 \\pmod{11}$. $6^2 = 36 \\equiv 3$, $6^4 \\equiv 9$, $6^7 = 6^4 \\cdot 6^2 \\cdot 6 \\equiv 9 \\cdot 3 \\cdot 6 = 162 \\equiv 8 \\pmod{11}$.</p><p>$m_q = |CT^{d_q}|_q = |61^1|_{13} = 61 \\bmod 13 = 9$.</p><p>CRT: hledáme $OT$ s $OT \\equiv 8 \\pmod{11}$, $OT \\equiv 9 \\pmod{13}$. $OT = 11 k + 8$, $11k + 8 \\equiv 9 \\pmod{13} \\Rightarrow 11k \\equiv 1 \\pmod{13} \\Rightarrow k \\equiv 6 \\pmod{13}$ (protože $11 \\cdot 6 = 66 = 5\\cdot 13 + 1$). $k = 6$, $OT = 66 + 8 = 74$.</p>',
          result: '$m_p = 8,\\ m_q = 9,\\ OT = 74$',
          answer: {
            type: 'open',
            accept: ['8,9,74'],
            placeholder: 'm_p, m_q, OT',
          },
        },
        {
          kind: 'exercise',
          number: '6.6',
          title: 'ElGamal — útok na malleability',
          source: '2. test 02.05.2025',
          problem:
            'Mějme ElGamal s $m = 821$. Zadrželi jsme šifrovanou zprávu $c = 678$, o které víme, že obsahuje počet diamantů. Chceme zasílaný počet zdesetinásobit (aniž bychom znali OT). Jaká musí být hodnota $c$?',
          solution:
            '<p>ElGamal je <strong>multiplikativně homomorfní</strong>: zašifrovaný $c = |p \\cdot K|_m$, takže $|c \\cdot 10|_m = |10p \\cdot K|_m$ je platný šifrový text zprávy $10p$ (se stejným $y_B$).</p><p>$|678 \\cdot 10|_{821} = |6780|_{821}$. $6780 = 8 \\cdot 821 + 212 = 6568 + 212$. Tedy $c\' = 212$.</p>',
          result: '$c\' = 212$',
          answer: {
            type: 'open',
            accept: ['212'],
            placeholder: "c' = ?",
          },
        },
      ],
    },
    {
      id: 'sec-6-6',
      number: '6.6',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Asymetrické šifrovací systémy veřejného klíče. RSA: matematický princip, důkaz správnosti dešifrování, vztah šifrovacího a dešifrovacího klíče. Generování klíčů pro RSA, bezpečnost a problém faktorizace. Šifrování a autentizace pomocí RSA, jednoduchý digitální podpis. RSA–CRT, popis generování klíčů a urychlení dešifrování. Srovnání symetrických kryptografických systémů a asymetrických kryptografických systémů. Digitální podpis a jeho vlastnosti. Šifra El Gamal, vzájemný vztah s Diffie-Hellmanem.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-1',
          number: '6.6.1',
          title: 'Asymetrické šifrovací systémy veřejného klíče',
        },
        {
          kind: 'p',
          html: 'Asymetrická (též <strong>veřejnoklíčová</strong>) kryptografie přiřazuje každému subjektu dvojici klíčů — <strong>veřejný klíč</strong> $VK$ (publikovaný, slouží k šifrování nebo k ověření podpisu) a <strong>soukromý klíč</strong> $SK$ (utajený, slouží k dešifrování nebo k podpisu). Z $VK$ nelze v rozumném čase odvodit $SK$ — bezpečnost se opírá o předpokládanou výpočetní obtížnost vybraného matematického problému (faktorizace, diskrétní logaritmus, problém eliptické křivky). Hlavní motivací je řešení <em>problému distribuce klíčů</em>: dvě strany mohou bezpečně komunikovat bez předem sdíleného tajemství.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-2',
          number: '6.6.2',
          title: 'RSA — matematický princip a vztah klíčů',
        },
        {
          kind: 'p',
          html: 'RSA (Rivest, Shamir, Adleman, 1977) pracuje v okruhu $\\mathbb{Z}_n$, kde $n = pq$ je součin dvou velkých prvočísel. Eulerova funkce modulu je $\\varphi(n) = (p-1)(q-1)$. Volíme <strong>šifrovací exponent</strong> $e$ s $\\gcd(e, \\varphi(n)) = 1$ a dopočítáme <strong>dešifrovací exponent</strong> $d$ jako jeho multiplikativní inverzi modulo $\\varphi(n)$, tedy $ed \\equiv 1 \\pmod{\\varphi(n)}$. Šifrování: $c = |m^e|_n$; dešifrování: $m = |c^d|_n$. Veřejný klíč je $(n, e)$, soukromý $(n, d)$.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-3',
          number: '6.6.3',
          title: 'Důkaz správnosti dešifrování',
        },
        {
          kind: 'p',
          html: 'Z definice $ed \\equiv 1 \\pmod{\\varphi(n)}$ existuje $k \\in \\mathbb{Z}$ takové, že $ed = k\\varphi(n) + 1$. Pak pro $\\gcd(m, n) = 1$ platí podle <strong>Eulerovy věty</strong> $m^{\\varphi(n)} \\equiv 1 \\pmod n$, a tedy:',
        },
        {
          kind: 'math',
          tex: '|c^d|_n = |m^{ed}|_n = |m^{k\\varphi(n)+1}|_n = |(m^{\\varphi(n)})^k \\cdot m|_n = |1^k \\cdot m|_n = m.',
        },
        {
          kind: 'p',
          html: 'Pro $\\gcd(m, n) > 1$ (zpráva dělitelná $p$ nebo $q$) lze rovnost dokázat zvlášť modulo $p$ a modulo $q$ pomocí Malé Fermatovy věty a složit Čínskou větou o zbytcích — výsledek platí pro každé $m \\in \\mathbb{Z}_n$.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-4',
          number: '6.6.4',
          title: 'Generování klíčů pro RSA',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Vyber dvě velká náhodná prvočísla $p, q$ podobné bitové délky (typicky 1024 b při $n$ o 2048 b). Generuj náhodný kandidát a otestuj Miller–Rabinovým testem prvočíselnosti.',
            'Spočítej $n = pq$ a $\\varphi(n) = (p-1)(q-1)$.',
            'Zvol veřejný exponent $e$ s $\\gcd(e, \\varphi(n)) = 1$. V praxi $e = 65537 = 2^{16}+1$ (rychlé šifrování, dostatečně velké).',
            'Spočítej $d = e^{-1} \\bmod \\varphi(n)$ rozšířeným Euklidovým algoritmem.',
            'Zveřejni $(n, e)$, $d$ udrž v tajnosti. Prvočísla $p, q$ je vhodné po vygenerování bezpečně smazat (pokud nepoužíváme CRT).',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-5',
          number: '6.6.5',
          title: 'Bezpečnost a problém faktorizace',
        },
        {
          kind: 'p',
          html: 'Znalost dvojice $(p, q)$ umožňuje útočníkovi spočítat $\\varphi(n)$ a tím i $d = e^{-1} \\bmod \\varphi(n)$ — tedy úplný rozbití systému. Naopak je <strong>dokázáno</strong>, že znalost $\\varphi(n)$ je výpočetně ekvivalentní faktorizaci $n$. Bezpečnost RSA proto stojí na <strong>problému faktorizace</strong>: pro dostatečně velká $n$ (dnes $\\ge 2048$ b) není znám klasický algoritmus, který by jej rozložil v polynomiálním čase. Nejlepší známé metody jsou GNFS (General Number Field Sieve) se subexponenciální složitostí. Pozor: <em>není dokázáno</em>, že prolomení RSA <em>vyžaduje</em> faktorizaci — jen že ji umožňuje.',
        },
        {
          kind: 'p',
          html: 'Doporučení pro výběr $p, q$ (FIPS 186-4): $|p-q|$ dostatečně velké (aby selhala Fermatova faktorizace), $p-1, q-1$ mají velký prvočinitel (proti Pollardově $p-1$ metodě), $\\gcd(p-1, q-1)$ malé. Kvantový <strong>Shorův algoritmus</strong> faktorizuje v polynomiálním čase — RSA tedy není postkvantově bezpečné.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-6',
          number: '6.6.6',
          title: 'Šifrování, autentizace a jednoduchý digitální podpis',
        },
        {
          kind: 'p',
          html: '<strong>Šifrování</strong> (důvěrnost): odesílatel B šifruje veřejným klíčem příjemce A — $c = |m^{e_A}|_{n_A}$. Pouze A se svým $d_A$ dešifruje. <strong>Podpis / autentizace</strong>: odesílatel A „šifruje“ svým <em>soukromým</em> klíčem — $S = |m^{d_A}|_{n_A}$. Kdokoli pomocí $VK_A$ ověří $m \\stackrel{?}{=} |S^{e_A}|_{n_A}$. Jelikož $d_A$ zná pouze A, je dvojice $(m, S)$ důkazem původu zprávy. <strong>Kombinace</strong>: pro důvěrné <em>a</em> autentizované zaslání A nejprve podepíše svým $SK$ a poté zašifruje veřejným klíčem B: $c = |S^{e_B}|_{n_B}$, kde $S = |m^{d_A}|_{n_A}$.',
        },
        {
          kind: 'p',
          html: 'V praxi se nepodepisuje přímo zpráva (drahé a otevřené existenciálnímu padělání), ale její <strong>haš</strong>: $S = |H(m)^{d_A}|_{n_A}$ s vhodným paddingem (PKCS#1 v1.5, PSS).',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-7',
          number: '6.6.7',
          title: 'RSA-CRT — generování klíčů a urychlení dešifrování',
        },
        {
          kind: 'p',
          html: 'RSA-CRT využívá Čínskou větu o zbytcích k urychlení dešifrování (a podepisování). Vlastník soukromého klíče zná $p, q$ a předpočítá:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '$d_p = d \\bmod (p-1)$',
            '$d_q = d \\bmod (q-1)$',
            '$q_{\\text{inv}} = q^{-1} \\bmod p$',
          ],
        },
        {
          kind: 'p',
          html: 'Dešifrování probíhá ve třech krocích: (1) $m_1 = |c^{d_p}|_p$, $m_2 = |c^{d_q}|_q$; (2) $h = |q_{\\text{inv}}(m_1 - m_2)|_p$; (3) $m = m_2 + h\\cdot q$. Místo jednoho umocňování modulo $n$ ($\\sim 2048$ b) provádíme dvě umocňování modulo $p$ a $q$ (po $\\sim 1024$ b). Složitost modulárního umocňování je $O(\\log^3 n)$, takže poloviční čísla dávají osminové náklady na operaci, dvě operace ale = <strong>čtyřnásobné</strong> zrychlení v praxi (typicky 3–4×).',
        },
        {
          kind: 'p',
          html: 'Pozor: RSA-CRT je citlivé na <strong>chybové útoky</strong> (Bellcoreův útok) — vzniknou-li během výpočtu hardwarové chyby v $m_1$ nebo $m_2$, lze z výsledku spočítat $\\gcd(m^e - c, n)$ a faktorizovat $n$. Implementace proto výsledek kontrolují.',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-8',
          number: '6.6.8',
          title: 'Srovnání symetrických a asymetrických kryptosystémů',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Klíče</strong>: symetrické sdílejí jeden tajný klíč mezi stranami; asymetrické pracují s veřejně-soukromou dvojicí.',
            '<strong>Distribuce klíčů</strong>: symetrické vyžadují bezpečný kanál (nebo PKI/KDC); asymetrické řeší distribuci přirozeně.',
            '<strong>Počet klíčů v síti $N$ uživatelů</strong>: symetrické $\\binom{N}{2} = O(N^2)$; asymetrické $O(N)$.',
            '<strong>Rychlost</strong>: symetrické (AES, ChaCha20) jsou o 2–3 řády rychlejší než asymetrické (RSA, ECC); typicky stovky MB/s vs. jednotky tisíc operací/s.',
            '<strong>Délka klíče</strong> pro srovnatelnou bezpečnost: AES 128 b ≈ RSA 3072 b ≈ ECC 256 b.',
            '<strong>Použití</strong>: symetrické šifrují velký objem dat; asymetrické se používají pro distribuci sezónních klíčů, digitální podpis a autentizaci.',
            '<strong>Hybridní schémata</strong> (TLS, PGP) kombinují obojí: asymetricky se vymění symetrický klíč, ten pak šifruje vlastní obsah.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-9',
          number: '6.6.9',
          title: 'Digitální podpis a jeho vlastnosti',
        },
        {
          kind: 'p',
          html: 'Digitální podpis je kryptografický mechanismus, který ke zprávě připojuje data umožňující ověřit její původ a integritu. Standardně se počítá z haše zprávy a vyžaduje soukromý klíč podepisujícího. Hlavní vlastnosti:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Autentizace (nezfalšovatelnost)</strong> — podpis dokáže vytvořit jen ten, kdo zná příslušný soukromý klíč.',
            '<strong>Integrita</strong> — jakákoli změna zprávy zneplatní podpis (podepisuje se haš zprávy).',
            '<strong>Nepopiratelnost</strong> — podepisující nemůže později popřít, že zprávu podepsal; zásadní rozdíl oproti symetrickým MAC, které tuto vlastnost nemají (MAC umí ověřit obě strany, takže žádná nemá průkazný důkaz vůči třetí straně).',
            '<strong>Ověřitelnost</strong> — kdokoli s veřejným klíčem může podpis ověřit.',
            '<strong>Vázanost na zprávu</strong> — podpis $S$ je platný pouze pro konkrétní $m$; nelze ho odpojit a přilepit k jiné zprávě.',
          ],
        },
        {
          kind: 'p',
          html: 'Konkrétní algoritmy: RSA (PKCS#1, PSS), DSA, ECDSA, EdDSA. V právním smyslu se rozlišuje <em>elektronický podpis</em>, <em>zaručený elektronický podpis</em> a <em>kvalifikovaný elektronický podpis</em> (eIDAS) — poslední vyžaduje certifikát vydaný kvalifikovaným poskytovatelem a kvalifikovaný prostředek (QSCD).',
        },
        {
          kind: 'h3',
          id: 'subsec-6-6-10',
          number: '6.6.10',
          title: 'ElGamal a vztah k Diffie–Hellmanovi',
        },
        {
          kind: 'p',
          html: 'ElGamalovo šifrování pracuje v cyklické grupě $\\mathbb{Z}_m^{*}$ (typicky $m$ velké prvočíslo) s generátorem $g$. Alice má soukromý klíč $k_A \\in \\{1, \\dots, m-2\\}$ a veřejný $y_A = |g^{k_A}|_m$, $VK_A = (m, g, y_A)$. Bob při šifrování zprávy $p$:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Zvolí náhodné <strong>jednorázové</strong> $k_B$ (efemérní klíč).',
            'Spočítá $c_1 = |g^{k_B}|_m$ a sdílený klíč $K = |y_A^{k_B}|_m = |g^{k_A k_B}|_m$.',
            'Šifruje $c_2 = |p \\cdot K|_m$ a posílá dvojici $(c_1, c_2)$.',
          ],
        },
        {
          kind: 'p',
          html: 'Alice dešifruje výpočtem $K = |c_1^{k_A}|_m = |g^{k_B k_A}|_m$ a $p = |c_2 \\cdot K^{-1}|_m$. Bezpečnost stojí na <strong>výpočetním Diffie–Hellmanově problému (CDH)</strong>: z $g^{k_A}$ a $g^{k_B}$ nelze efektivně spočítat $g^{k_A k_B}$ (potažmo na problému diskrétního logaritmu, PDL).',
        },
        {
          kind: 'p',
          html: '<strong>Vztah k Diffie–Hellmanovi</strong>: ElGamalovo šifrování je v podstatě „Diffie–Hellman provedený v rámci jedné zprávy“ — Alice má statickou DH polovinu $y_A$, Bob pro každou zprávu vytvoří efemérní DH polovinu $c_1 = g^{k_B}$, vypočte sdílené tajemství $K = g^{k_A k_B}$ a tím <em>maskuje</em> zprávu vynásobením modulo $m$. Pokud bychom v DH protokolu nahradili interaktivní výměnu zveřejněním Aliciny statické poloviny, dostaneme přesně ElGamal. Z toho plynou i důsledky: <em>$k_B$ se nikdy nesmí opakovat</em> (jinak ze dvou ŠT $c_2, c_2\'$ pro různá $p, p\'$ útočník spočítá poměr $p/p\'$); šifrový text je dvojnásobně delší než zpráva (přibývá $c_1$); ElGamal je <em>multiplikativně homomorfní</em> ($\\text{Enc}(p_1) \\cdot \\text{Enc}(p_2) = \\text{Enc}(p_1 p_2)$), což je užitečné, ale i nebezpečné (malleability útoky). Z ElGamalova podpisového schématu pak vychází standard <strong>DSA/DSS</strong>.',
        },
      ],
    },
  ],
}

