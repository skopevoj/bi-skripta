import type { Chapter } from '../types'

export const chap09: Chapter = {
  id: 'chap-9',
  number: '9',
  title: 'Kryptografie eliptických křivek a kvantová kryptografie',
  intro: [
    {
      kind: 'p',
      html: 'Kryptografie eliptických křivek (ECC, Miller a Koblitz 1985) nabízí stejnou bezpečnost jako klasické asymetrické systémy při výrazně kratších klíčích. Eliptická křivka je speciální podtřída kubických křivek. Kvantová kryptografie využívá jevy kvantové mechaniky pro distribuci klíčů s nepodmíněnou bezpečností.',
    },
  ],
  sections: [
    {
      id: 'sec-9-1',
      number: '9.1',
      title: 'Eliptická křivka nad GF(p)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '9.1',
          title: 'Eliptická křivka',
          html: 'Množina bodů $[x, y]$ vyhovujících rovnici $y^2 = x^3 + ax + b$, doplněná o „bod v nekonečnu“ $O$. Nad tělesem $GF(p)$ platí $y^2 \\equiv x^3 + ax + b \\pmod p$ s podmínkou $|4a^3 + 27b^2|_p \\ne 0$.',
          plain:
            'Speciální křivka v rovině, na které lze pomocí sčítání bodů vybudovat „grupu“ podobnou Z_p*. Tahle algebraická struktura tvoří základ ECC — kratší klíče pro stejnou bezpečnost než RSA.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '9.2',
          title: 'Součet bodů',
          html: 'Pro $P + Q = R$, $P \\ne Q$: směrnice $s = |(y_Q - y_P)(x_Q - x_P)^{-1}|_p$. Pro $P = Q$ (zdvojení): $s = |(3x_P^2 + a)(2y_P)^{-1}|_p$. Souřadnice: $x_R = |s^2 - x_P - x_Q|_p$, $y_R = |s(x_P - x_R) - y_P|_p$. Inverze: $-P = [x_P, |-y_P|_p]$. Identita: $P + (-P) = O$, $P + O = P$.',
          plain:
            'Geometrický recept, jak ze dvou bodů na křivce vyrobit třetí: spojím je sečnou, najdu třetí průsečík s křivkou a překlopím přes osu x. Tato „sčítací“ operace dělá z bodů na křivce grupu, ve které jdou počítat mocniny.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '9.1',
          title: 'Zdvojení bodu',
          html: 'Pro $E: y^2 \\equiv x^3 + 2x + 2 \\pmod{17}$ a $P = [5, 1]$: $s = |(2)^{-1}(3 \\cdot 25 + 2)|_{17} = |9 \\cdot 9|_{17} = 13$. $x_{2P} = |13^2 - 10|_{17} = 6$, $y_{2P} = |13(5 - 6) - 1|_{17} = 3$. Kontrola: $3^2 = 9 \\equiv 6^3 + 2 \\cdot 6 + 2 \\pmod{17}$. ✓',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '9.3',
          title: 'Řád bodu a křivky',
          html: '<strong>Řád bodu</strong> $P$ je nejmenší $r$ takové, že $rP = O$. <strong>Řád křivky</strong> $\\#E$ je počet bodů na $E$. Řád bodu dělí řád křivky. V kryptografii volíme bod, jehož řád je nejvyšší prvočinitel $\\#E$ (kofaktor musí být malý).',
          plain:
            'Kolikrát musíme bod sčítat sám se sebou, než se dostaneme zpět na nulu. Pro ECC potřebujeme bod s velkým prvočíselným řádem — jinak by se dal diskrétní logaritmus rozdělit na menší (snadnější) podproblémy.',
        },
        {
          kind: 'interactive',
          component: 'ec-add',
          title: 'Sčítání bodů na eliptické křivce',
          hint: 'Klikněte na dva body na křivce; sledujte konstrukci tečny/sečny.',
        },
      ],
    },
    {
      id: 'sec-9-2',
      number: '9.2',
      title: 'ECC a problém diskrétního logaritmu',
      blocks: [
        {
          kind: 'p',
          html: 'V ECC se diskrétní logaritmus formuluje jako: pro dané body $P, Q \\in E$ najít $k$ tak, že $Q = kP$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '9.1',
          title: 'Bezpečnost ECDLP',
          html: 'Nejúčinnější algoritmus — <strong>Pollardovo $\\rho$</strong> — má složitost $(\\pi r / 2)^{1/2}$ kroků. Pro $r \\approx 2^{256}$ je to $\\approx 2^{128}$ — srovnatelné s prolomením 128-bitové symetrické šifry. Proto ECC s 256-bitovým klíčem poskytuje bezpečnost srovnatelnou s 3072-bitovým RSA.',
        },
      ],
    },
    {
      id: 'sec-9-3',
      number: '9.3',
      title: 'Šifrování s ECC (analogie D-H)',
      blocks: [
        {
          kind: 'p',
          html: 'Účastníci $i$ a $j$ sdílí stejnou křivku $E$ a generátor $P$. Soukromé klíče $d_i, d_j$, veřejné $Q_i = d_i P$, $Q_j = d_j P$. Společný klíč: $Z = d_i Q_j = d_j Q_i = (d_i d_j) P$. Útočník bez znalosti $d_i, d_j$ nedokáže $Z$ spočítat (ECDH problém).',
        },
      ],
    },
    {
      id: 'sec-9-4',
      number: '9.4',
      title: 'Kvantová kryptografie',
      blocks: [
        {
          kind: 'p',
          html: 'Klasickou informaci lze libovolně kopírovat → klasická kryptografie se musí spoléhat na výpočetní složitost nebo extrémně dlouhé klíče. Kvantovou informaci <strong>nelze identicky kopírovat</strong> (no-cloning) a její čtení mění její stav (Heisenbergův princip neurčitosti).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '9.4',
          title: 'Qubit',
          html: 'Stav $|\\psi\\rangle = \\omega_0 |0\\rangle + \\omega_1 |1\\rangle$ v 2-rozměrném Hilbertově prostoru, $|\\omega_0|^2 + |\\omega_1|^2 = 1$. Měřením qubit kolabuje do jednoho z vlastních stavů s pravděpodobností $|\\omega_i|^2$ — superpozici nelze přímo „vidět“.',
          plain:
            'Kvantová obdoba bitu — místo „buď 0 nebo 1“ je v superpozici obou. Po měření se ale vždy zafixuje jen jedna z hodnot — superpozici není možné odpozorovat. To je klíč k tomu, proč jde kvantově detekovat odposlech.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '9.5',
          title: 'Polarizační kódování',
          html: '<ul><li><strong>Lineární báze (+)</strong>: $|0\\rangle = $ „|“, $|1\\rangle = $ „—“.</li><li><strong>Diagonální báze (×)</strong>: $|0\\rangle = $ „\\“, $|1\\rangle = $ „/“.</li></ul>Báze jsou navzájem konjugované — měření v nesprávné bázi dává náhodný výsledek.',
          plain:
            'Bit se zakóduje do polarizace fotonu jednou ze dvou bází (svislé+vodorovné, nebo diagonální). Klíč je v tom, že kdo měří ve špatné bázi, dostane náhodný výsledek — toho protokol BB84 využívá k detekci odposlechu.',
        },
        {
          kind: 'diagram',
          component: 'qubit-bases',
          caption: 'Obr. 9.1: Dvě konjugované polarizační báze v BB84. Vlevo lineární (+) s vertikálním |0⟩ a horizontálním |1⟩; vpravo diagonální (×) otočená o 45°.',
        },
      ],
    },
    {
      id: 'sec-9-5',
      number: '9.5',
      title: 'Protokol BB84 (Bennett–Brassard, 1984)',
      blocks: [
        {
          kind: 'p',
          html: 'BB84 slouží k dohodě na symetrickém klíči pro one-time pad. Využívá nemožnosti měřit qubit současně v obou bázích.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '9.6',
          title: 'Průběh BB84',
          html: '<ol><li>Alice posílá náhodnou binární posloupnost zakódovanou náhodně volenou bází pro každý bit.</li><li>Bob měří v náhodně zvolených bázích.</li><li>Veřejným autentizovaným kanálem si oznámí použité báze; bity, kde se neshodli, vyřadí. Zbývající bity tvoří sdílený klíč.</li></ol>',
          plain:
            'Alice posílá fotony s náhodně zvolenými bity v náhodných bázích, Bob měří v náhodných bázích. Pak si veřejně řeknou, jaké báze použili, a nechají si jen bity, kde báze náhodou souhlasily — z těch sestaví sdílený klíč.',
        },
        {
          kind: 'callout',
          type: 'veta',
          number: '9.1',
          title: 'Detekce odposlechu',
          html: 'Útočníkovo měření kolabuje qubit a v 1/4 případů zavede chybu, i když Bob zvolí stejnou bázi jako Alice. Pravděpodobnost správného přenosu při odposlechu je 0,75. Obětováním $n$ bitů k porovnání lze odhalit soustavný odposlech s pravděpodobností $1 - (3/4)^n$.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '9.2',
          title: 'Implementace BB84',
          html: 'Komunikace má dvě části: <strong>kvantovou</strong> (optický kabel bez infrastrukturních prvků, znalost modelu chyb, synchronizace) a <strong>klasickou</strong> (běžná síť; musí být autentizována, např. MAC s předsdíleným malým klíčem). Experimentální dosah dnes desítky až stovky km optickým vláknem.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '9.1',
          title: 'Nepodmíněná bezpečnost',
          html: 'Pokud je BB84 doplněn one-time padem se získaným klíčem, je systém v teoretické rovině <strong>nepodmíněně bezpečný</strong> a odolný i vůči budoucím kvantovým počítačům.',
        },
        {
          kind: 'interactive',
          component: 'bb84',
          title: 'BB84 — kvantová distribuce klíče',
          hint: 'Zapněte odposlech a sledujte, jak Eve vnese chybu do sdíleného klíče.',
        },
      ],
    },
  ],
}
