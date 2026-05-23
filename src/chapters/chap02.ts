import type { Chapter } from '../types'

export const chap02: Chapter = {
  id: 'chap-2',
  number: '2',
  title: 'Exponenciální šifra, Diffie–Hellman a DLP',
  intro: [
    {
      kind: 'p',
      html: 'Exponenciální šifry (Pohlig–Hellman, 1978) jsou založené na modulárním umocňování. Tvoří základ pro asymetrickou kryptografii a algoritmus výměny klíče Diffie–Hellman.',
    },
  ],
  sections: [
    {
      id: 'sec-2-1',
      number: '2.1',
      title: 'Exponenciální šifra',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '2.1',
          title: 'Exponenciální šifra (Pohlig–Hellman)',
          html: 'Nechť $m$ je prvočíslo, $e$ klíč splňující $\\gcd(e, m-1) = 1$. Šifrování bloku $p$ ($0 \\le p < m$): $c = |p^e|_m$. Dešifrování: $p = |c^d|_m$, kde $d = |e^{-1}|_{m-1}$.',
          plain:
            'Zpráva se převede na číslo a umocní se na klíč modulo velké prvočíslo. Předchůdce RSA — ukazuje myšlenku „šifruji mocněním, dešifruji jinou mocninou“ ještě nad jedním prvočíslem.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '2.1',
          title: 'Korektnost dešifrování',
          html: 'Z malé Fermatovy věty $p^{m-1} \\equiv 1 \\pmod m$ plyne $|c^d|_m = |p^{ed}|_m = |p^{k(m-1)+1}|_m = |p|_m$, kde $ed \\equiv 1 \\pmod{m-1}$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '2.1',
          title: 'Výpočet',
          html: 'Pro $m = 2633$, $e = 29$ je $\\gcd(29, 2632) = 1$. Inverze $d = |29^{-1}|_{2632} = 2269$. Šifrování bloku 1907: $c = |1907^{29}|_{2633} = 2199$. Zpětně $|2199^{2269}|_{2633} = 1907$.',
        },
        {
          kind: 'p',
          html: 'Modulární umocňování se efektivně počítá algoritmem <strong>Square &amp; Multiply</strong> se složitostí $O(k^3)$ bitových operací pro $k = \\lceil \\log_2 m\\rceil$. Inverzi $d$ zjistíme rozšířeným Eukleidovým algoritmem.',
        },
        {
          kind: 'interactive',
          component: 'square-multiply',
          title: 'Square & Multiply',
          hint: 'Modulární umocňování po jednotlivých bitech exponentu.',
        },
        {
          kind: 'exercise',
          number: '2.1',
          title: 'Eulerova funkce',
          source: '1. selftest 2025/26',
          problem: 'Vypočítejte hodnotu Eulerovy funkce čísla $3575$.',
          solution:
            '<p>Rozklad: $3575 = 5^2 \\cdot 11 \\cdot 13$.</p><p>Pro $n = p_1^{a_1} \\cdots p_k^{a_k}$ platí $\\varphi(n) = n \\prod (1 - 1/p_i)$.</p><p>$\\varphi(3575) = 3575 \\cdot \\tfrac{4}{5} \\cdot \\tfrac{10}{11} \\cdot \\tfrac{12}{13} = 5 \\cdot 4 \\cdot 10 \\cdot 12 \\cdot \\tfrac{5}{5} = 2400.$</p><p>Alternativně: $\\varphi(5^2) = 20$, $\\varphi(11) = 10$, $\\varphi(13) = 12$, součin $= 2400$.</p>',
          result: '$\\varphi(3575) = 2400$',
          answer: {
            type: 'multichoice',
            options: [
              { text: '$2400$', correct: true },
              { text: '$1200$', correct: false },
              { text: '$480$', correct: false },
              { text: '$1920$', correct: false },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '2.2',
          title: 'Exponenciální šifra — Jů a Hele',
          source: '1. selftest 2025/26',
          problem:
            'Jů a Hele používají exponenciální šifru s modulem $m = 23$. Která z následujících tvrzení jsou pravdivá?',
          solution:
            '<p>Modul $m - 1 = 22 = 2 \\cdot 11$. Šifrovací exponent $e$ musí splňovat $\\gcd(e, 22) = 1$, takže $e = 2$ je <strong>nepřípustné</strong> ($\\gcd(2, 22) = 2$).</p><p>Pro $e = 7$ je $\\gcd(7, 22) = 1$. Dešifrovací klíč $d = |7^{-1}|_{22}$. Z $7 \\cdot 19 = 133 = 6\\cdot 22 + 1$ dostáváme $d = 19$.</p><p>Šifrování $OT = 3$ exponentem $e = 7$: $|3^7|_{23} = |2187|_{23} = |2187 - 95\\cdot 23|_{23} = |2|_{23} = 2$. Takže $ST = 2 \\Leftrightarrow OT = 3$, nikoli $OT = 5$.</p>',
          result: 'Pravdivá jsou tvrzení o $OT = 3$ pro $ST = 2$ a $d = 19$ pro $e = 7$.',
          answer: {
            type: 'multichoice',
            options: [
              { text: 'Pro exponent $e = 7$ a $ST = 2$ je $OT = 3$.', correct: true },
              { text: 'Pro $e = 7$ je dešifrovací klíč $d = 19$.', correct: true },
              { text: 'Pro exponent $e = 7$ a $ST = 2$ je $OT = 5$.', correct: false },
              { text: 'Exponent $e = 2$ může být použit jako šifrovací klíč.', correct: false },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-2-2',
      number: '2.2',
      title: 'Zřízení společného klíče — Diffie–Hellman',
      blocks: [
        {
          kind: 'p',
          html: 'Doporučuje se použít prvočíslo tvaru $m = 2q + 1$, kde $q$ je opět prvočíslo (silná prvočísla), aby $m - 1$ neobsahovalo pouze malé prvočinitele.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '2.2',
          title: 'Diffie–Hellmanův protokol',
          html: '<ol><li>Veřejné parametry: prvočíslo $m$ a generátor $a$ grupy $\\mathbb{Z}_m^*$.</li><li>Alice volí $k_A$, posílá $y_1 = |a^{k_A}|_m$.</li><li>Bob volí $k_B$, posílá $y_2 = |a^{k_B}|_m$.</li><li>Společný klíč $K = |y_2^{k_A}|_m = |y_1^{k_B}|_m = |a^{k_A k_B}|_m$.</li></ol>',
          plain:
            'Postup, jak si dvě strany dohodnou společný tajný klíč i přes nezabezpečenou linku. Bez něj by HTTPS nemělo z čeho začít — odposlech vidí jen výsledky mocnin a nedokáže z nich spočítat klíč.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '2.2',
          title: 'D-H výměna',
          html: 'Pro $m = 13$, $a = 2$, $k_1 = 7$, $k_2 = 11$: $y_1 = |2^7|_{13} = 11$, $y_2 = |2^{11}|_{13} = 7$, sdílený klíč $K = |7^7|_{13} = |11^{11}|_{13} = 6$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '2.1',
          title: 'Více účastníků',
          html: 'Pro $n$ účastníků platí $K = |a^{k_1 k_2 \\cdots k_n}|_m$.',
        },
        {
          kind: 'interactive',
          component: 'diffie-hellman',
          title: 'Diffie–Hellman',
          hint: 'Změňte soukromé klíče a sledujte, jak Alice a Bob dojdou ke stejnému tajemství.',
        },
        {
          kind: 'exercise',
          number: '2.3',
          title: 'D-H pro tři účastníky',
          source: '1. selftest 2025/26',
          problem:
            'Anička, Bob a Cyril chtějí pomocí Diffie–Hellmanova algoritmu domluvit sdílený klíč $K$. Společné parametry: $a = 5$, $m = 23$. Subklíče: $k_A = 5$, $k_B = 2$, $k_C = 3$. Jaký bude jejich sdílený klíč $K$?',
          solution:
            '<p>Pro $n$ účastníků platí $K = |a^{k_A k_B k_C}|_m = |5^{5 \\cdot 2 \\cdot 3}|_{23} = |5^{30}|_{23}$.</p><p>Z malé Fermatovy věty $5^{22} \\equiv 1 \\pmod{23}$, takže $5^{30} \\equiv 5^8 \\pmod{23}$.</p><p>$5^2 = 25 \\equiv 2$, $5^4 \\equiv 4$, $5^8 \\equiv 16 \\pmod{23}$.</p>',
          result: '$K = 16$',
          answer: {
            type: 'open',
            accept: ['16'],
            placeholder: 'K = ?',
          },
        },
        {
          kind: 'exercise',
          number: '2.4',
          title: 'D-H — odvození sdíleného klíče',
          source: '2. test 02.05.2025',
          problem:
            'Alice a Bob používají D-H s parametry $m = 13$ a $a = 2$. Alice posílá $y_A = 6$, Bob posílá $y_B = 3$. Jaká je hodnota sdíleného klíče $K$?',
          solution:
            '<p>Z předaných hodnot lze nepřímo dopočítat soukromý klíč ($y_A = 2^{k_A}$, atd.) nebo přímo využít $K = |y_B^{k_A}|_m = |y_A^{k_B}|_m$.</p><p>Hledáme $k_A$ tak, aby $2^{k_A} \\equiv 6 \\pmod{13}$. Postupně: $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16 \\equiv 3$, $2^5 = 6$. Takže $k_A = 5$.</p><p>$K = |y_B^{k_A}|_m = |3^5|_{13} = |243|_{13} = |243 - 18\\cdot 13|_{13} = 9$.</p>',
          result: '$K = 9$',
          answer: {
            type: 'open',
            accept: ['9'],
            placeholder: 'K = ?',
          },
        },
      ],
    },
    {
      id: 'sec-2-3',
      number: '2.3',
      title: 'Problém diskrétního logaritmu (PDL)',
      blocks: [
        {
          kind: 'p',
          html: 'V konečné grupě $\\mathbb{Z}_n^*$ je výpočet mocniny rychlý („Square &amp; Multiply“), ale inverzní úloha — najít $k$ takové, že $b^k = m$ — je výpočetně náročná.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '2.3',
          title: 'Diskrétní logaritmus',
          html: 'V cyklické grupě $G$ s generátorem $b$ je diskrétní logaritmus prvku $y$ o základu $b$ číslo $k$, pro které $b^k = y$. Značíme $\\log_b y = k$.',
          plain:
            'Najít exponent k, když znáte výsledek mocniny v cyklické grupě. Umocňování je snadné, ale obrácená úloha (najít k) je tak těžká, že na ní stojí Diffie-Hellman i ElGamal.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '2.2',
          title: 'Vlastnosti diskrétního logaritmu',
          html: '$\\log_g 1 = 0$, $\\log_g g^k = k$, $\\log_g(a^k) = k \\cdot \\log_g a$, $\\log_g(ab) = \\log_g a + \\log_g b$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '2.3',
          title: 'PDL v různých grupách',
          html: 'V $\\mathbb{Z}_{17}^*$ s násobením a generátorem $g = 3$ je $\\log_3 7 = 11$ (protože $3^{11} \\equiv 7 \\pmod{17}$). V aditivní grupě $\\mathbb{Z}_{17}$ je naopak $\\log_3 7 = 8$ (protože $3 \\cdot 8 \\equiv 7$) a PDL se zde řeší lineárně Euklidovým algoritmem.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '2.2',
          title: 'Algoritmy pro PDL',
          html: 'Naivní brute-force má složitost $O(n)$. Subexponenciální algoritmy: <strong>Baby step – giant step</strong>, <strong>Pollardovo $\\rho$</strong>, <strong>Pohlig–Hellman</strong>, <strong>Index kalkulus</strong>, <strong>Funkční síto</strong> (nejrychlejší). Pro náhodné $p$ má funkční síto složitost $\\exp(\\sqrt{\\log m \\log \\log m})$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '2.3',
          title: 'Bezpečnost D-H a délka klíče',
          html: 'Bezpečnost Diffie–Hellmanova protokolu závisí na obtížnosti PDL. Typicky se používá prvočíslo $p \\approx 2^{4096}$. Pro 100-ciferné $m$ trvá výpočet diskrétního logaritmu desítky let, pro 200-ciferné cca $10^8$ let.',
        },
        {
          kind: 'exercise',
          number: '2.5',
          title: 'Diskrétní logaritmus',
          source: '2. test 02.05.2025',
          problem:
            'Spočtěte $|\\log_{7} 11|_{13}$ v multiplikativní grupě $\\mathbb{Z}_{13}^*$.',
          solution:
            '<p>Hledáme nejmenší $k$, pro které $7^k \\equiv 11 \\pmod{13}$.</p><p>$7^1 = 7$. $7^2 = 49 \\equiv 10$. $7^3 \\equiv 70 \\equiv 5$. $7^4 \\equiv 35 \\equiv 9$. $7^5 \\equiv 63 \\equiv 11.$ Hotovo: $k = 5$.</p>',
          result: '$|\\log_7 11|_{13} = 5$',
          answer: {
            type: 'open',
            accept: ['5'],
            placeholder: 'k = ?',
          },
        },
      ],
    },
    {
      id: 'sec-2-4',
      number: '2.4',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Exponenciální šifra, vztah dešifrovacího a šifrovacího klíče, důkaz správnosti dešifrování, bezpečnost této šifry. Pojem problému diskrétního logaritmu. Zřízení společného klíče s použitím Diffie–Hellmanova kryptografického algoritmu.</strong>',
        },
        {
          kind: 'h3',
          id: 'sec-2-4-1',
          number: '2.4.1',
          title: 'Exponenciální šifra',
        },
        {
          kind: 'p',
          html: 'Exponenciální (Pohlig–Hellmanova) šifra z roku 1978 je symetrická bloková šifra pracující nad konečným tělesem $\\mathbb{Z}_m$, kde $m$ je velké prvočíslo. Otevřený text je rozdělen na bloky $p$ splňující $0 \\le p < m$ (typicky se kóduje skupina písmen jako jedno číslo v bázi velikosti abecedy). Klíčem je dvojice $(m, e)$, kde šifrovací exponent $e$ musí splňovat podmínku $\\gcd(e, m-1) = 1$ — tato podmínka zaručuje, že $e$ má v grupě $\\mathbb{Z}_{m-1}^*$ inverzi.',
        },
        {
          kind: 'p',
          html: 'Šifrování bloku $p$ je dáno modulárním umocněním $c = |p^e|_m$, dešifrování pak $p = |c^d|_m$, kde $d$ je dešifrovací klíč. Mocnění se počítá efektivně algoritmem <strong>Square &amp; Multiply</strong> se složitostí $O(k^3)$ bitových operací pro $k = \\lceil \\log_2 m \\rceil$.',
        },
        {
          kind: 'h3',
          id: 'sec-2-4-2',
          number: '2.4.2',
          title: 'Vztah dešifrovacího a šifrovacího klíče',
        },
        {
          kind: 'p',
          html: 'Dešifrovací klíč $d$ je <strong>multiplikativní inverzí šifrovacího klíče $e$ modulo $m-1$</strong>, tedy $d = |e^{-1}|_{m-1}$, ekvivalentně $e \\cdot d \\equiv 1 \\pmod{m-1}$. Inverze se počítá <strong>rozšířeným Eukleidovým algoritmem</strong> — najdou se koeficienty $u, v$ tak, aby $u \\cdot e + v \\cdot (m-1) = 1$, a pak $d = |u|_{m-1}$. Existence $d$ je zaručena právě podmínkou $\\gcd(e, m-1) = 1$.',
        },
        {
          kind: 'p',
          html: 'Šifrovací i dešifrovací klíč jsou tedy navzájem provázané — kdo zná jeden a parametr $m$, snadno dopočítá druhý. Proto jde o <strong>symetrickou</strong> šifru a oba klíče musí zůstat utajeny.',
        },
        {
          kind: 'h3',
          id: 'sec-2-4-3',
          number: '2.4.3',
          title: 'Důkaz správnosti dešifrování',
        },
        {
          kind: 'p',
          html: 'Chceme ukázat, že pro libovolný blok $p$ platí $|c^d|_m = p$, kde $c = |p^e|_m$ a $ed \\equiv 1 \\pmod{m-1}$.',
        },
        {
          kind: 'p',
          html: 'Z rovnosti $ed \\equiv 1 \\pmod{m-1}$ existuje celé číslo $k \\ge 0$ tak, že $ed = k(m-1) + 1$. Pak',
        },
        {
          kind: 'math',
          tex: '|c^d|_m = |(p^e)^d|_m = |p^{ed}|_m = |p^{k(m-1)+1}|_m = |(p^{m-1})^k \\cdot p|_m.',
        },
        {
          kind: 'p',
          html: 'Nyní použijeme <strong>malou Fermatovu větu</strong>: pro prvočíslo $m$ a $p$ nesoudělné s $m$ platí $p^{m-1} \\equiv 1 \\pmod{m}$. Dostaneme $|(p^{m-1})^k \\cdot p|_m = |1^k \\cdot p|_m = |p|_m = p$, protože $0 \\le p < m$.',
        },
        {
          kind: 'p',
          html: 'Případ $p \\equiv 0 \\pmod m$ (tj. $p = 0$) je triviální: $0^e = 0$ a $0^d = 0$, takže $|c^d|_m = 0 = p$. Obecněji platí věta i v Eulerově podobě: pro modul $n$ (nemusí být prvočíslo) a $\\gcd(p,n)=1$ je $p^{\\varphi(n)} \\equiv 1 \\pmod n$ a stačí $ed \\equiv 1 \\pmod{\\varphi(n)}$ — to je princip pozdější RSA šifry.',
        },
        {
          kind: 'h3',
          id: 'sec-2-4-4',
          number: '2.4.4',
          title: 'Bezpečnost exponenciální šifry',
        },
        {
          kind: 'p',
          html: 'Útočník zná pouze veřejně přenášený šifrový text $c$ (a v útoku se známým otevřeným textem i $p$) a chce zjistit klíč. Z dvojice $(p, c)$ splňující $c = |p^e|_m$ je nalezení $e$ úloha <strong>diskrétního logaritmu</strong>: $e = \\log_p c$ v grupě $\\mathbb{Z}_m^*$. Bezpečnost šifry tedy stojí na obtížnosti PDL.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Modul $m$ musí být dostatečně velké prvočíslo (typicky $m \\approx 2^{2048}$ a více).',
            'Doporučují se <strong>silná prvočísla</strong> tvaru $m = 2q + 1$, kde $q$ je rovněž prvočíslo, aby $m-1$ nemělo pouze malé prvočinitele (jinak je útok Pohlig–Hellman rychlý).',
            'Šifra je symetrická — klíč $e$ (i $d$) musí být přenesen zabezpečeným kanálem nebo dohodnut zvlášť (např. právě Diffie–Hellmanem).',
            'Stejný blok $p$ se vždy zašifruje na stejné $c$ (ECB-like vlastnost), což může v praxi unikat informace o struktuře zprávy.',
          ],
        },
        {
          kind: 'h3',
          id: 'sec-2-4-5',
          number: '2.4.5',
          title: 'Problém diskrétního logaritmu (PDL)',
        },
        {
          kind: 'p',
          html: 'V cyklické grupě $G$ řádu $n$ s generátorem $g$ je <strong>diskrétní logaritmus</strong> prvku $y \\in G$ o základu $g$ takové celé číslo $k$, $0 \\le k < n$, že $g^k = y$. Značíme $k = \\log_g y$. V multiplikativní grupě $\\mathbb{Z}_m^*$ tedy hledáme $k$ takové, že $|g^k|_m = y$.',
        },
        {
          kind: 'p',
          html: 'Klíčová asymetrie: zatímco modulární umocnění $g^k \\bmod m$ se dá počítat rychle (Square &amp; Multiply, $O(\\log k)$ násobení), zpětná úloha — najít $k$ — je výpočetně náročná. Pro náhodně volené prvočíslo $m$ je nejlepší známý algoritmus (<strong>funkční síto</strong>, NFS) subexponenciální se složitostí přibližně $\\exp(c \\cdot (\\log m)^{1/3} (\\log \\log m)^{2/3})$. Další algoritmy: <strong>Baby-step giant-step</strong> ($O(\\sqrt{n})$ čas i paměť), <strong>Pollardovo $\\rho$</strong> ($O(\\sqrt{n})$ čas, konstantní paměť), <strong>Pohlig–Hellman</strong> (rychlé, pokud $n$ má pouze malé prvočinitele).',
        },
        {
          kind: 'p',
          html: 'Na předpokládané obtížnosti PDL stojí bezpečnost exponenciální šifry, Diffie–Hellmanova protokolu i ElGamalovy šifry a podpisu.',
        },
        {
          kind: 'h3',
          id: 'sec-2-4-6',
          number: '2.4.6',
          title: 'Diffie–Hellmanův protokol zřízení společného klíče',
        },
        {
          kind: 'p',
          html: 'Diffie a Hellman v roce 1976 navrhli protokol, který umožňuje dvěma stranám (Alici a Bobovi) dohodnout se na <strong>společném tajném klíči</strong> přes nezabezpečený kanál, aniž by si jej musely předem vyměnit. Sleduje-li komunikaci pasivní odposlech, není schopen klíč zrekonstruovat — pokud platí předpoklad těžkosti PDL.',
        },
        {
          kind: 'p',
          html: '<strong>Veřejné parametry</strong> (dohodnuté předem, mohou být sdíleny celou skupinou uživatelů): velké prvočíslo $m$ (doporučeno $m = 2q+1$, $q$ prvočíslo) a generátor $a$ grupy $\\mathbb{Z}_m^*$ (nebo její dostatečně velké cyklické podgrupy).',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Alice zvolí náhodný soukromý klíč $k_A$, $1 < k_A < m-1$, vypočte $y_A = |a^{k_A}|_m$ a pošle $y_A$ Bobovi.',
            'Bob zvolí náhodný soukromý klíč $k_B$, vypočte $y_B = |a^{k_B}|_m$ a pošle $y_B$ Alici.',
            'Alice spočítá $K = |y_B^{k_A}|_m$, Bob spočítá $K = |y_A^{k_B}|_m$.',
            'Oba dostanou stejnou hodnotu $K = |a^{k_A k_B}|_m$, která je jejich společným tajným klíčem.',
          ],
        },
        {
          kind: 'p',
          html: 'Korektnost vyplývá z asociativity mocnění v grupě: $|y_B^{k_A}|_m = |(a^{k_B})^{k_A}|_m = |a^{k_A k_B}|_m = |(a^{k_A})^{k_B}|_m = |y_A^{k_B}|_m$.',
        },
        {
          kind: 'p',
          html: 'Odposlech získá $m, a, y_A, y_B$, ale nikoli $k_A$ ani $k_B$. Pro výpočet $K$ by potřeboval vyřešit PDL (najít $k_A$ z $y_A = a^{k_A}$) nebo přímo tzv. <strong>Diffie–Hellmanův problém</strong> (CDH): z $a, a^{k_A}, a^{k_B}$ spočítat $a^{k_A k_B}$. Oba problémy jsou považovány za výpočetně neřešitelné pro vhodně velké $m$.',
        },
        {
          kind: 'p',
          html: 'Protokol se přirozeně rozšiřuje na $n$ účastníků — výsledný klíč má tvar $K = |a^{k_1 k_2 \\cdots k_n}|_m$ a získá se postupným umocňováním předaných mezivýsledků. <strong>Slabinou</strong> základní verze je, že protokol neautentizuje strany: aktivní útočník uprostřed (man-in-the-middle) může s každou stranou ustavit jiný klíč. V praxi se proto kombinuje s digitálními podpisy nebo certifikáty (např. station-to-station protocol, TLS).',
        },
      ],
    },
  ],
}
