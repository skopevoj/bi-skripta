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
          hint: 'Klikněte v grafu na dva body P a Q (dvakrát na stejný bod = zdvojení) a sledujte výpočet směrnice s a souřadnic R = P + Q.',
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
          hint: 'Projděte protokol krok po kroku, pak zapněte odposlech a porovnejte chybovost prosetého klíče.',
        },
      ],
    },
    {
      id: 'sec-9-6',
      number: '9.6',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Eliptické křivky: geometrická interpretace součtu 2 bodů na eliptické křivce. Eliptické křivky v šifrování, pojmy řád bodu, řád křivky, kofaktor. Problém diskrétního logaritmu u eliptických křivek a bezpečnost. Diffie-Hellman na eliptických křivkách. Klasická a kvantová informace, rozdíly. Kvantový bit – qubit, polarizační kódování fotonu a jeho využití v protokolu BB84 pro zřízení společného klíče a detekce odposlechu.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-1',
          number: '9.6.1',
          title: 'Geometrická interpretace součtu bodů',
        },
        {
          kind: 'p',
          html: 'Eliptická křivka v <strong>krátké Weierstrassově</strong> tvaru je dána rovnicí $y^2 = x^3 + ax + b$ s podmínkou nesingularity $4a^3 + 27b^2 \\ne 0$. K množině bodů $(x, y)$ vyhovujících této rovnici se přidává jeden formální <strong>bod v nekonečnu</strong> $\\mathcal{O}$, který slouží jako neutrální prvek grupy.',
        },
        {
          kind: 'p',
          html: 'Sčítání bodů $P + Q = R$ má názornou <strong>geometrickou interpretaci „tětivy a tečny“</strong>: bodem $P$ a $Q$ vedeme přímku (pro $P = Q$ tečnu ke křivce v bodě $P$), ta protne křivku ve třetím bodě $-R$. Hledaný součet $R$ je <strong>zrcadlový obraz</strong> $-R$ podle osy $x$, tedy $R = (x_{-R}, -y_{-R})$. Pokud $Q = -P$ (tedy oba body mají stejné $x$ a opačná $y$), je spojnice svislá, „třetí průsečík“ leží v nekonečnu a definujeme $P + (-P) = \\mathcal{O}$.',
        },
        {
          kind: 'p',
          html: 'Tato operace činí z bodů křivky <strong>komutativní (Abelovu) grupu</strong>: $\\mathcal{O}$ je neutrální prvek ($P + \\mathcal{O} = P$), opačný prvek $-P$ vznikne překlopením přes osu $x$, asociativita se ověří algebraicky. Násobek $kP$ definujeme jako $k$-krát opakované sčítání bodu $P$ se sebou samým.',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-2',
          number: '9.6.2',
          title: 'Řád bodu, řád křivky, kofaktor',
        },
        {
          kind: 'p',
          html: '<strong>Řád bodu</strong> $P$, značený $|P| = n$, je nejmenší kladné celé číslo $n$ takové, že $nP = \\mathcal{O}$. Body s vyšším řádem generují větší podgrupu a poskytují větší prostor možných tajných exponentů.',
        },
        {
          kind: 'p',
          html: '<strong>Řád křivky</strong> $\\#E$ je celkový počet bodů na křivce nad konečným tělesem $GF(p)$ (včetně $\\mathcal{O}$). Podle Hasseho věty platí $\\#E = p + 1 - t$, kde $|t| \\le 2\\sqrt{p}$, takže $\\#E$ leží blízko $p$. Podle Lagrangeovy věty řád každého bodu dělí $\\#E$.',
        },
        {
          kind: 'p',
          html: '<strong>Kofaktor</strong> $h$ vyjadřuje poměr řádu křivky a řádu zvoleného generátoru: $h = \\#E / n$. Pro kryptografické účely volíme bod $P$, jehož řád $n$ je <strong>velké prvočíslo</strong>, a kofaktor je co nejmenší (ideálně $h = 1$, prakticky $h \\in \\{1, 2, 4, 8\\}$). Velký kofaktor by umožnil rozložit ECDLP na menší podproblémy v menších podgrupách (Pohlig–Hellman) a snížit bezpečnost.',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-3',
          number: '9.6.3',
          title: 'Problém diskrétního logaritmu (ECDLP) a bezpečnost',
        },
        {
          kind: 'p',
          html: '<strong>Problém diskrétního logaritmu na eliptické křivce (ECDLP)</strong> zní: pro dané body $P, Q \\in E$ s $Q = kP$ najít celé číslo $k$. Sčítání bodů (a tedy výpočet $kP$ pomocí double-and-add) je rychlé, opačný směr je výpočetně obtížný.',
        },
        {
          kind: 'p',
          html: 'Na rozdíl od klasického DLP v $\\mathbb{Z}_p^*$ <strong>neznáme</strong> pro ECDLP žádný subexponenciální útok (index calculus zde nefunguje). Nejlepší známé generické algoritmy — <strong>Pollardovo $\\rho$</strong> a jeho paralelní varianty — mají složitost $O(\\sqrt{n})$, kde $n$ je řád bodu $P$. Pro $n \\approx 2^{256}$ je to asi $2^{128}$ operací, což odpovídá bezpečnosti 128-bitové symetrické šifry. Proto ECC s klíčem délky 256 bitů poskytuje srovnatelnou bezpečnost jako 3072-bitový RSA — kratší klíče, menší podpisy, rychlejší operace.',
        },
        {
          kind: 'p',
          html: 'Bezpečnost ECC navíc vyžaduje pečlivý výběr křivky: vyhnout se <em>singulárním</em> křivkám, <em>anomálním</em> ($\\#E = p$) a křivkám s malým <em>embedding degree</em> (zranitelnost MOV redukcí na DLP v rozšiřujícím tělese). V praxi se používají standardizované křivky (NIST P-256, Curve25519, secp256k1).',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-4',
          number: '9.6.4',
          title: 'Diffie–Hellman na eliptických křivkách (ECDH)',
        },
        {
          kind: 'p',
          html: 'ECDH je přímou analogií klasického Diffie–Hellmanova protokolu. Účastníci se předem dohodnou na <strong>doménových parametrech</strong>: křivce $E$ nad $GF(p)$ a generujícím bodě $G$ řádu $n$. Pak:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Alice zvolí náhodné soukromé $a \\in \\{1, \\dots, n-1\\}$ a vypočítá veřejný bod $A = aG$.',
            'Bob zvolí náhodné soukromé $b \\in \\{1, \\dots, n-1\\}$ a vypočítá veřejný bod $B = bG$.',
            'Alice i Bob si veřejně vymění body $A$ a $B$.',
            'Alice spočítá $K = aB = a(bG) = (ab)G$, Bob spočítá $K = bA = b(aG) = (ab)G$. Oba získají stejný bod $K$, jehož $x$-souřadnice slouží jako sdílené tajemství (typicky se ještě protáhne KDF).',
          ],
        },
        {
          kind: 'p',
          html: 'Útočník odposlouchávající kanál vidí $G$, $A = aG$ a $B = bG$, ale k získání $(ab)G$ by musel vyřešit <strong>ECDH problém</strong>, který je v praxi ekvivalentní ECDLP — najít $a$ z $A = aG$ (nebo $b$ z $B$). Tento úkol je výpočetně neřešitelný pro správně zvolené parametry.',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-5',
          number: '9.6.5',
          title: 'Klasická vs. kvantová informace',
        },
        {
          kind: 'p',
          html: '<strong>Klasická informace</strong> (bit) nabývá vždy jedné ze dvou hodnot 0/1, lze ji libovolně <em>kopírovat</em>, číst bez ovlivnění a přenášet bez principiálních omezení. Bezpečnost klasické kryptografie proto vždy závisí buď na výpočetní složitosti, nebo na délce klíče (one-time pad).',
        },
        {
          kind: 'p',
          html: '<strong>Kvantová informace</strong> se chová zásadně jinak: stav je popsán vektorem v Hilbertově prostoru a může být v <em>superpozici</em> více klasických hodnot zároveň. Měření stav nevratně mění (kolaps vlnové funkce), a podle <strong>no-cloning teorému</strong> nelze obecný neznámý kvantový stav identicky zkopírovat. Pokus odposlechu se tak nutně projeví měřitelnou poruchou — to je základem kvantové distribuce klíčů.',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-6',
          number: '9.6.6',
          title: 'Qubit a polarizační kódování fotonu',
        },
        {
          kind: 'p',
          html: '<strong>Qubit</strong> je kvantová jednotka informace, jejíž stav lze zapsat jako $|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle$, kde $\\alpha, \\beta \\in \\mathbb{C}$ splňují $|\\alpha|^2 + |\\beta|^2 = 1$. Měřením ve výpočetní bázi získáme $|0\\rangle$ s pravděpodobností $|\\alpha|^2$ nebo $|1\\rangle$ s pravděpodobností $|\\beta|^2$; po měření je stav fixován a původní superpozici nelze rekonstruovat.',
        },
        {
          kind: 'p',
          html: 'Fyzicky se qubit často realizuje <strong>polarizací jednoho fotonu</strong>. Použijeme dvě vzájemně <em>konjugované</em> báze:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Lineární (rektilineární) báze +</strong>: $|0\\rangle$ = svislá polarizace $|$, $|1\\rangle$ = vodorovná polarizace $-$.',
            '<strong>Diagonální báze ×</strong>: $|0\\rangle$ = polarizace $\\nwarrow$ ($-45^\\circ$), $|1\\rangle$ = polarizace $\\nearrow$ ($+45^\\circ$).',
          ],
        },
        {
          kind: 'p',
          html: 'Báze jsou konjugované — vektor báze + lze vyjádřit jako rovnoměrnou superpozici vektorů báze × a naopak. Měření fotonu ve „špatné“ bázi proto dává zcela <strong>náhodný</strong> výsledek (s pravděpodobností 1/2 každý) a navíc původní stav nenávratně přepíše.',
        },
        {
          kind: 'h3',
          id: 'subsec-9-6-7',
          number: '9.6.7',
          title: 'Protokol BB84 — zřízení klíče a detekce odposlechu',
        },
        {
          kind: 'p',
          html: 'BB84 (Bennett a Brassard, 1984) využívá obou popsaných bází ke kvantové distribuci klíče (QKD). Průběh:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Alice si vygeneruje náhodnou posloupnost klasických bitů a pro každý bit nezávisle náhodně zvolí jednu ze dvou bází (+ nebo ×). Bit zakóduje do polarizace fotonu odpovídající zvolené bázi a foton pošle Bobovi kvantovým kanálem.',
            'Bob pro každý přijatý foton náhodně nezávisle zvolí měřicí bázi (+ nebo ×) a foton změří. Pokud zvolil stejnou bázi jako Alice, dostane správný bit; pokud jinou, dostane náhodný výsledek.',
            'Po přenosu si přes veřejný, ale <strong>autentizovaný</strong> klasický kanál sdělí, kterou bázi pro každý foton použili (nikoli však naměřené bity).',
            'Bity, kde se báze neshodly, vyřadí (tzv. <em>sifting</em>). Ze zbývajících bitů, kde báze souhlasí, vznikne <strong>surový sdílený klíč</strong>; v průměru jím projde polovina původních bitů.',
            'Část surového klíče veřejně porovnají a odhadnou <strong>QBER</strong> (quantum bit error rate). Pokud je chybovost pod prahem, zbytek prožene procedurami opravy chyb (information reconciliation) a zesílení soukromí (privacy amplification, např. hašováním) a získají konečný tajný klíč.',
          ],
        },
        {
          kind: 'p',
          html: '<strong>Detekce odposlechu</strong>: kdyby útočník (Eve) zachytával fotony a měřil je ve své vlastní náhodně zvolené bázi, v polovině případů by zvolil špatnou bázi a měření by zničilo původní stav. I když pak pošle Bobovi nový foton ve stavu, který sám naměřil, v polovině těchto případů Bob (pokud zvolí stejnou bázi jako Alice) naměří chybný bit. Eve tedy zavádí chybu do sdíleného klíče s pravděpodobností $\\tfrac{1}{2} \\cdot \\tfrac{1}{2} = 25\\%$ na bit, který by jinak souhlasil.',
        },
        {
          kind: 'p',
          html: 'Pravděpodobnost, že při soustavném odposlechu zůstane $n$ porovnávaných bitů náhodou bez chyby, je tedy $(3/4)^n$ a jde k nule s rostoucím $n$. Pokud Alice a Bob naměří QBER výrazně nad přirozenou úroveň kanálu, klíč zahodí. Doplněním BB84 o one-time pad získávají <strong>nepodmíněně bezpečný</strong> systém odolný i vůči budoucím kvantovým počítačům.',
        },
      ],
    },
  ],
}
