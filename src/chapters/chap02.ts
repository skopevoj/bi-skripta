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
      ],
    },
  ],
}
