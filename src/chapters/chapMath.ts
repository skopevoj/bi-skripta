import type { Chapter } from '../types'

export const chapMath: Chapter = {
  id: 'chap-0',
  number: '0',
  title: 'Matematický základ',
  intro: [
    {
      kind: 'p',
      html: 'Tato kapitola sbírá minimum z teorie čísel a modulární aritmetiky, na němž stojí prakticky celá kryptografie. Pokud něco hladce čtete, klidně přeskočte — kapitola je jako referenční příručka a pro pohodlí obsahuje interaktivní pomůcky (modulární kalkulačka, Euklidův algoritmus, výpočet inverze, Eulerova funkce).',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        '<strong>Cíl</strong>: rozumět zápisům jako $c = a^{-1}(p - b) \\pmod{26}$, $K = g^{ab} \\bmod p$, $d = e^{-1} \\bmod \\varphi(n)$.',
        '<strong>Předpoklady</strong>: zbytek po dělení, prvočísla, základní pojmy o celých číslech.',
      ],
    },
  ],
  sections: [
    {
      id: 'sec-0-1',
      number: '0.1',
      title: 'Modulární aritmetika',
      blocks: [
        {
          kind: 'p',
          html: 'Když dělíme celé číslo $a$ číslem $n &gt; 0$, dostaneme jednoznačně podíl $q$ a <strong>zbytek</strong> $r$ s vlastností $a = qn + r$ a $0 \\le r &lt; n$. Tento zbytek značíme $a \\bmod n$ a říkáme „a modulo n".',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '0.1',
          title: 'Kongruence modulo n',
          html: 'Pro celá $a, b, n$ s $n &gt; 0$ píšeme $a \\equiv b \\pmod{n}$, právě když $n \\mid (a - b)$ (čteme: $n$ dělí rozdíl). To je totéž jako $a \\bmod n = b \\bmod n$. Množinu zbytků $\\{0, 1, \\dots, n-1\\}$ značíme $\\mathbb{Z}_n$.',
          plain:
            'Říká, že dvě čísla mají stejný zbytek po dělení n. Jako u hodin: 15:00 a 3:00 jsou „stejné“ modulo 12. Tahle aritmetika je základ celé kryptografie — počítáme v omezeném prostoru zbytků, kde se mocniny chovají periodicky.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '0.1',
          title: 'Hodiny',
          html: 'Na ciferníku s 12 hodinami: 7 + 8 = 15, ale ručička ukazuje 3. Formálně $7 + 8 \\equiv 3 \\pmod{12}$. Stejná logika platí pro abecedu o 26 znacích (Caesarova šifra) i pro modulo prvočíslo (RSA, Diffie–Hellman).',
        },
        {
          kind: 'interactive',
          component: 'mod-clock',
          title: 'Modulární kruh',
          hint: 'Operace +, −, · v ℤₙ jako pohyb po kruhu o n dílcích. Šipka ukazuje, kolik kroků se ujde a jak se „přetočí" přes 0.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.1',
          title: 'Pravidla počítání modulo',
          html: 'Pro libovolná celá $a, b, c$ a $n &gt; 0$ platí:<ul><li>$(a + b) \\bmod n = ((a \\bmod n) + (b \\bmod n)) \\bmod n$,</li><li>$(a \\cdot b) \\bmod n = ((a \\bmod n) \\cdot (b \\bmod n)) \\bmod n$,</li><li>z $a \\equiv b \\pmod{n}$ plyne $a + c \\equiv b + c$ a $ac \\equiv bc \\pmod{n}$.</li></ul>Důsledkem můžeme všechny mezivýsledky průběžně brát modulo $n$ a nikdy nepracovat s obrovskými čísly.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '0.1',
          title: 'Krácení neplatí obecně',
          html: 'Z $ac \\equiv bc \\pmod{n}$ neplyne $a \\equiv b \\pmod{n}$, pokud $\\gcd(c, n) \\neq 1$. Příklad: $2 \\cdot 3 \\equiv 4 \\cdot 3 \\pmod{6}$, ale $2 \\not\\equiv 4 \\pmod{6}$. Krátit lze jen prvky <em>invertibilními</em> v $\\mathbb{Z}_n$ — viz sekce <a href="#sec-0-3">0.3</a>.',
        },
      ],
    },
    {
      id: 'sec-0-2',
      number: '0.2',
      title: 'Největší společný dělitel a Euklidův algoritmus',
      blocks: [
        {
          kind: 'p',
          html: 'Pro celá $a, b$ ne obě nulová je <strong>největší společný dělitel</strong> $\\gcd(a, b)$ největší kladné číslo, které dělí $a$ i $b$. Spočítat ho lze rychle (logaritmicky) pomocí Euklidova algoritmu.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.2',
          title: 'Euklidův algoritmus',
          html: 'Pro $a \\ge b &gt; 0$ platí $\\gcd(a, b) = \\gcd(b, a \\bmod b)$. Algoritmus tuto rovnost opakovaně aplikuje: dvojici $(a, b)$ nahradí dvojicí $(b, a \\bmod b)$, dokud druhá složka není 0. Poslední nenulová hodnota je $\\gcd(a, b)$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '0.2',
          title: 'gcd(252, 105)',
          html: '$252 = 2 \\cdot 105 + 42$<br>$105 = 2 \\cdot 42 + 21$<br>$42 = 2 \\cdot 21 + 0$<br>Poslední nenulový zbytek je 21, tedy $\\gcd(252, 105) = 21$.',
        },
        {
          kind: 'interactive',
          component: 'gcd-euclid',
          title: 'Euklidův algoritmus krok po kroku',
          hint: 'Zadejte libovolnou dvojici a postupně klikejte „Další krok" — uvidíte, jak se dvojice (a, b) zmenšuje, dokud b nedosáhne nuly.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '0.2',
          title: 'Nesoudělnost',
          html: 'Čísla $a, b$ jsou <strong>nesoudělná</strong> (coprime), pokud $\\gcd(a, b) = 1$. V kryptografii je nesoudělnost klíče s velikostí abecedy ($\\gcd(a, 26) = 1$ u afinní šifry) nebo nesoudělnost exponentu s $\\varphi(n)$ (u RSA) nutnou podmínkou existence dešifrovacího klíče.',
          plain:
            'Dvě čísla jsou nesoudělná, když nemají žádného společného dělitele kromě jedničky. V kryptografii hlídá, kdy lze vůbec dešifrovat — bez nesoudělnosti by neexistovala modulární inverze a šifra by byla jednosměrná.',
        },
      ],
    },
    {
      id: 'sec-0-3',
      number: '0.3',
      title: 'Modulární inverze a Bézoutova rovnost',
      blocks: [
        {
          kind: 'p',
          html: 'V běžné aritmetice dělíme číslem $a \\neq 0$ tak, že násobíme jeho převrácenou hodnotou $1/a$. V $\\mathbb{Z}_n$ dělit nelze přímo — musíme hledat <strong>modulární inverzi</strong>: takové $x$, že $ax \\equiv 1 \\pmod{n}$. Ne každé $a$ ji má.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.3',
          title: 'Existence inverze v ℤₙ',
          html: '$a$ má v $\\mathbb{Z}_n$ multiplikativní inverzi $a^{-1}$, právě když $\\gcd(a, n) = 1$. Inverze je pak jednoznačná v rozsahu $\\{1, \\dots, n-1\\}$ a značíme ji $a^{-1} \\bmod n$.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.4',
          title: 'Bézoutova rovnost',
          html: 'Pro libovolná celá $a, b$ existují celá $s, t$ taková, že $sa + tb = \\gcd(a, b)$. Koeficienty $(s, t)$ vrací <strong>rozšířený Euklidův algoritmus</strong>: stejné dělení se zbytky jako u základní verze, ale navíc zpětně dosazuje.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '0.1',
          title: 'Inverze z Bézouta',
          html: 'Pokud $\\gcd(a, n) = 1$, dává Bézoutova rovnost $sa + tn = 1$, odkud po vzetí modulo $n$ máme $sa \\equiv 1 \\pmod{n}$, tedy $a^{-1} \\equiv s \\pmod{n}$.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '0.3',
          title: '17⁻¹ mod 26',
          html: 'Hledáme $x$, aby $17x \\equiv 1 \\pmod{26}$. Rozšířeným Euklidem: $26 = 1 \\cdot 17 + 9$, $17 = 1 \\cdot 9 + 8$, $9 = 1 \\cdot 8 + 1$. Zpětně: $1 = 9 - 8 = 9 - (17 - 9) = 2 \\cdot 9 - 17 = 2(26 - 17) - 17 = 2 \\cdot 26 - 3 \\cdot 17$. Tedy $-3 \\cdot 17 \\equiv 1 \\pmod{26}$, čili $17^{-1} \\equiv -3 \\equiv 23 \\pmod{26}$.',
        },
        {
          kind: 'interactive',
          component: 'ext-euclid',
          title: 'Rozšířený Euklid a modulární inverze',
          hint: 'Pro libovolné a, n získáte gcd, Bézoutovy koeficienty (s, t) a — pokud gcd(a, n) = 1 — také inverzi a⁻¹ mod n.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '0.2',
          title: 'Kde se inverze hodí',
          html: '<ul><li><strong>Afinní šifra</strong> ($c = ap + b \\bmod 26$): dešifrování potřebuje $a^{-1} \\bmod 26$, proto je požadováno $\\gcd(a, 26) = 1$.</li><li><strong>Hillova šifra</strong>: dešifrování přes $\\mathbf{A}^{-1}$ v $\\mathbb{Z}_{26}$ funguje jen když $\\gcd(\\det \\mathbf{A}, 26) = 1$.</li><li><strong>RSA</strong>: soukromý exponent $d = e^{-1} \\bmod \\varphi(n)$.</li></ul>',
        },
      ],
    },
    {
      id: 'sec-0-4',
      number: '0.4',
      title: 'Eulerova funkce φ(n)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '0.3',
          title: 'Eulerova funkce',
          html: '$\\varphi(n)$ je počet čísel z $\\{1, 2, \\dots, n\\}$, která jsou nesoudělná s $n$. Ekvivalentně: velikost grupy invertibilních prvků v $\\mathbb{Z}_n$.',
          plain:
            'Říká, kolik čísel menších než n je s n nesoudělných. Klíčový vstup do RSA — z hodnoty φ(n) se počítá dešifrovací klíč z šifrovacího. Bez znalosti rozkladu n nikdo φ(n) rychle nespočítá, a v tom je bezpečnost RSA.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.5',
          title: 'Výpočet φ z prvočíselného rozkladu',
          html: 'Je-li $n = p_1^{e_1} \\cdots p_k^{e_k}$ rozklad na prvočísla, pak $\\varphi(n) = n \\prod_{i=1}^{k} \\bigl(1 - \\tfrac{1}{p_i}\\bigr)$.<br>Speciální případy:<ul><li>Pro prvočíslo $p$: $\\varphi(p) = p - 1$.</li><li>Pro součin dvou různých prvočísel: $\\varphi(pq) = (p-1)(q-1)$.</li></ul>',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '0.4',
          title: 'φ(12) a φ(15)',
          html: '$12 = 2^2 \\cdot 3 \\Rightarrow \\varphi(12) = 12 \\cdot \\tfrac{1}{2} \\cdot \\tfrac{2}{3} = 4$. Skutečně: $\\{1, 5, 7, 11\\}$ jsou nesoudělná s 12.<br>$15 = 3 \\cdot 5 \\Rightarrow \\varphi(15) = (3-1)(5-1) = 8$.',
        },
        {
          kind: 'interactive',
          component: 'euler-totient',
          title: 'Eulerova funkce vizuálně',
          hint: 'Posuvníkem měňte n a sledujte, která čísla jsou s n nesoudělná. Vzorec si můžete ověřit z prvočíselného rozkladu.',
        },
      ],
    },
    {
      id: 'sec-0-5',
      number: '0.5',
      title: 'Modulární umocňování',
      blocks: [
        {
          kind: 'p',
          html: 'Šifrování v RSA i ustanovení klíče v Diffie–Hellmanovi spočívá v jediné operaci: $a^e \\bmod n$. Spočítat ji rychle (logaritmicky vůči $e$) umí algoritmus <strong>square &amp; multiply</strong>.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.6',
          title: 'Malá Fermatova věta',
          html: 'Pro prvočíslo $p$ a celé $a$ nedělitelné $p$ platí $a^{p-1} \\equiv 1 \\pmod{p}$. Speciálně $a^{p} \\equiv a \\pmod{p}$ pro libovolné $a$.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '0.7',
          title: 'Eulerova věta',
          html: 'Pokud $\\gcd(a, n) = 1$, pak $a^{\\varphi(n)} \\equiv 1 \\pmod{n}$. Důsledkem můžeme exponenty redukovat modulo $\\varphi(n)$: $a^k \\equiv a^{k \\bmod \\varphi(n)} \\pmod{n}$ za stejné podmínky.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '0.2',
          title: 'Správnost RSA',
          html: 'V RSA je $n = pq$, $\\varphi(n) = (p-1)(q-1)$ a $ed \\equiv 1 \\pmod{\\varphi(n)}$, tj. $ed = 1 + k\\varphi(n)$. Pro zprávu $m$ nesoudělnou s $n$: $m^{ed} = m \\cdot m^{k\\varphi(n)} = m \\cdot 1^k = m \\pmod{n}$ — dešifrování dává zpět původní zprávu.',
        },
        {
          kind: 'interactive',
          component: 'square-multiply',
          title: 'Square & multiply',
          hint: 'Spočítá $a^b \\bmod m$ logaritmicky. Sledujte, jak se v každém kroku umocní výsledek na druhou a podle příslušného bitu exponentu se případně přinásobí $a$.',
        },
      ],
    },
  ],
}
