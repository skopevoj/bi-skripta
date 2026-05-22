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
  ],
}
