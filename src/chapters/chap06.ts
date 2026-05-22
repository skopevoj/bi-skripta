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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.2',
          title: 'RSA — šifrování a dešifrování',
          html: 'Šifrování: $c = E(m) = |m^e|_n$. Dešifrování: $m = D(c) = |c^d|_n$.',
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
          title: 'RSA krok za krokem',
          hint: 'Zvolte prvočísla a sledujte generování klíče, šifrování a dešifrování.',
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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.5',
          title: 'ElGamal — šifrování',
          html: 'Bob chce poslat zprávu $p$. Volí $k_B$, spočítá $y_B = |g^{k_B}|_m$ a sdílený klíč $K = |y_A^{k_B}|_m$. Šifruje $c = |p \\cdot K|_m$. Posílá dvojici $(y_B, c)$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '6.6',
          title: 'ElGamal — dešifrování',
          html: 'Alice spočítá $K = |y_B^{k_A}|_m$, najde inverzi $K^{-1}$ rozšířeným Euklidovým algoritmem a dešifruje $p = |c \\cdot K^{-1}|_m$.',
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
  ],
}
