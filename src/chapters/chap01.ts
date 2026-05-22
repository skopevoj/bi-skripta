import type { Chapter } from '../types'

export const chap01: Chapter = {
  id: 'chap-1',
  number: '1',
  title: 'Základní pojmy, substituční a transpoziční šifry',
  intro: [
    {
      kind: 'p',
      html: '<strong>Kryptologie</strong> – věda o tvorbě a luštění šifer. Dělí se na <strong>kryptografii</strong> (tvorba šifer) a <strong>kryptoanalýzu</strong> (luštění).',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        '<strong>Otevřený text (OT)</strong> – text určený k utajení.',
        '<strong>Šifrový text (ŠT)</strong> – výsledek šifrování OT.',
        '<strong>Šifrování</strong> – proces převádějící OT do ŠT.',
        '<strong>Dešifrování</strong> – inverzní proces založený na znalosti šifry a klíče.',
        '<strong>Kód</strong> – na rozdíl od šifry neutajuje zprávu, jen ji upravuje pro přenos (paritní, Hammingovy kódy).',
      ],
    },
  ],
  sections: [
    {
      id: 'sec-1-1',
      number: '1.1',
      title: 'Klasifikace luštění a útoků',
      blocks: [
        {
          kind: 'p',
          html: 'Luštění (kryptoanalýza) zahrnuje <em>identifikaci</em> šifrovacího systému, <em>prolomení</em> způsobu šifrování a <em>nastavení</em> proměnných částí kryptosystému.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.1',
          title: 'Modely útočníka',
          html: 'Odolnost šifry posuzujeme v 5 situacích:<ul><li><strong>COA</strong> (ciphertext-only) — útočník zná jen ŠT.</li><li><strong>KPA</strong> (known-plaintext) — zná ŠT a odpovídající OT.</li><li><strong>CPA</strong> (chosen-plaintext) — může si zvolit OT k zašifrování.</li><li><strong>CCA</strong> (chosen-ciphertext) — může si zvolit ŠT k dešifrování.</li><li><strong>Chosen-text attack</strong> — kombinace CPA a CCA.</li></ul>',
          plain:
            'Škála toho, kolik útočník o šifře ví — od „vidí jen šifrový text“ až po „může si nechat šifrovat i dešifrovat, co si vybere“. Slouží k tomu, abychom dokázali říct, proti jakému útoku je daná šifra odolná.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '1.1',
          title: 'Steganografie',
          html: 'Vedle šifer existuje <strong>steganografie</strong>, která ukrývá samotnou existenci zprávy vložením do běžných objektů (text, obrázek, program).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.2',
          title: 'Základní pojmy o textu',
          html: '<ul><li><strong>Monogram</strong> – 1 písmeno.</li><li><strong>Bigram</strong> – 2 sousední písmena.</li><li><strong>Trigram</strong> – 3 sousední písmena.</li><li><strong>Polygram</strong> – obecná posloupnost znaků.</li><li><strong>Symbol</strong> – libovolný znak (písmeno, číslice, interpunkce).</li><li><strong>Řetězec</strong> – posloupnost symbolů.</li></ul>',
          plain:
            'Jednotná slovní zásoba pro popis textu — jedno písmeno, dvojice, trojice, obecná skupina. Pojmy slouží hlavně pro statistiku jazyka (které trojice se vyskytují nejčastěji) a pro frekvenční analýzu.',
        },
      ],
    },
    {
      id: 'sec-1-2',
      number: '1.2',
      title: 'Monoalfabetické substituční šifry',
      blocks: [
        {
          kind: 'p',
          html: 'V <strong>monoalfabetické</strong> substituci je dané písmeno OT vždy nahrazeno týmž písmenem ŠT. Anglická abeceda se mapuje na čísla $0,\\dots,25$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.3',
          title: 'Caesarova šifra',
          html: 'Šifrování: $c = |p + 3|_{26}$, dešifrování: $p = |c - 3|_{26}$.',
          plain:
            'Posun každého písmene o tři místa v abecedě (A→D, B→E…). Historicky ji používal Caesar — dnes ji rozluští každý za pár minut tužkou, protože stačí vyzkoušet všech 25 posunů.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.1',
          title: 'Caesarova šifra',
          html: 'OT <code>THISMESSAGEISTOPSECRET</code> má numerický ekvivalent 19 7 8 18 12 …. Po přičtení 3 modulo 26 a převodu zpět na písmena dostáváme ŠT <code>WKLVPHVVDJHLVWRSVHFUHW</code>.',
        },
        {
          kind: 'interactive',
          component: 'caesar',
          title: 'Posuvná šifra',
          hint: 'Posuňte slider a sledujte, jak se mění mapování abecedy.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.4',
          title: 'Šifra s posunem',
          html: 'Obecně $c = |p + k|_{26}$ s klíčem $k$. Existuje 26 různých posunutí.',
          plain:
            'Zobecnění Caesarovy šifry — posun místo o 3 je o libovolné číslo k. Pořád velmi slabá, protože všech 26 posunů lze rychle zkusit hrubou silou.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.5',
          title: 'Afinní transformace',
          html: 'Šifrování: $c = |ap + b|_{26}$, kde $a, b \\in \\mathbb{Z}$ a $\\gcd(a, 26) = 1$. Dešifrování: $p = |a^{-1}(c - b)|_{26}$. Existuje $\\varphi(26) \\cdot 26 = 12 \\cdot 26 = 312$ afinních transformací.',
          plain:
            'Trochu obecnější Caesarova šifra — písmeno se nejdřív vynásobí a teprve pak posune. Pořád prolomitelná frekvenční analýzou, protože klíčů je jen 312.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.2',
          title: 'Afinní šifra',
          html: 'Pro $a = 7$, $b = 10$ máme $c = |7p + 10|_{26}$ a $p = |15(c - 10)|_{26} = |15c + 6|_{26}$, protože $7^{-1} \\equiv 15 \\pmod{26}$.',
        },
        {
          kind: 'interactive',
          component: 'affine',
          title: 'Afinní šifra',
          hint: 'Volte koeficient a (jen hodnoty nesoudělné s 26) a posun b; sledujte mapování abecedy.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '1.2',
          title: 'Frekvenční analýza',
          html: 'Klíčový nástroj kryptoanalýzy. V angličtině má písmeno E četnost ~13&nbsp;%, T, N, R, I, O, A okolo 7–9&nbsp;%. Porovnáním četnosti znaků v ŠT a OT lze odhadnout klíč.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.3',
          title: 'Luštění Caesarovy šifry',
          html: 'V ŠT „YFXMP CESPZ…“ je nejčastější písmeno P (četnost 7). Předpoklad P↔E dává $|4+k|_{26} = 15$, tedy $k = 11$. Dešifrováním vznikne smysluplný OT <code>NUMBERTHEORYISUSEFULFOR…</code>',
        },
        {
          kind: 'interactive',
          component: 'frequency',
          title: 'Frekvenční analýza',
          hint: 'Zkuste upravit ŠT a porovnat naměřenou distribuci s referenční četností češtiny.',
        },
        {
          kind: 'exercise',
          number: '1.1',
          title: 'Kryptoanalýza afinní šifry',
          source: '1. selftest 2025/26',
          problem:
            'Frekvenční analýzou jsme zjistili, že nejčetnějším písmenem v ŠT (abeceda 26 znaků) je $B$, druhé nejčetnější $K$. OT je anglický (nejčetnější $E$, druhý $T$). Šifrováno afinní šifrou: $ST = \\text{IBAAH}$. Určete $a$, $b$ a dešifrujte. Odpověď ve formátu „a,b,OT“.',
          solution:
            '<p>Z předpokladu četností párujeme $B \\leftrightarrow E$ a $K \\leftrightarrow T$, tj. $|a\\cdot 4 + b|_{26} = 1$ a $|a\\cdot 19 + b|_{26} = 10$.</p><p>Odečtením rovnic: $|15a|_{26} = 9$. Inverze $15^{-1} \\equiv 7 \\pmod{26}$, takže $a = |7\\cdot 9|_{26} = 11$. Dosazením do první rovnice: $b = |1 - 44|_{26} = 9$.</p><p>Dešifrovací předpis: $p = |a^{-1}(c - b)|_{26} = |19(c-9)|_{26}$, protože $11^{-1} \\equiv 19 \\pmod{26}$.</p><p>$ST = $ I(8), B(1), A(0), A(0), H(7) → $|19\\cdot(8-9)|_{26}=7$ (H), $|19\\cdot(1-9)|_{26}=4$ (E), $|19\\cdot(-9)|_{26}=11$ (L), 11 (L), $|19\\cdot(-2)|_{26}=14$ (O). OT = HELLO.</p>',
          result: '$a = 11,\\ b = 9,\\ OT = \\text{HELLO}$',
          answer: {
            type: 'open',
            accept: ['11,9,HELLO', '11, 9, HELLO'],
            placeholder: 'a, b, OT',
          },
        },
        {
          kind: 'exercise',
          number: '1.2',
          title: 'Počet klíčů afinní šifry',
          source: '2. selftest 2025/26',
          problem:
            'Mějme abecedu o $45$ znacích. Kolik existuje různých klíčů pro afinní šifru (různých = různých šifrovacích předpisů)?',
          solution:
            '<p>Klíčem je dvojice $(a, b)$, kde $\\gcd(a, 45) = 1$ a $b \\in \\{0, \\dots, 44\\}$.</p><p>Počet přípustných $a$ je $\\varphi(45) = \\varphi(9)\\varphi(5) = 6 \\cdot 4 = 24$. Počet $b$ je $45$. Celkem $24 \\cdot 45 = 1080$.</p>',
          result: '$\\varphi(45) \\cdot 45 = 24 \\cdot 45 = 1080$',
          answer: {
            type: 'multichoice',
            options: [
              { text: '$24 \\cdot 45$', correct: true },
              { text: '$1080$', correct: true },
              { text: '$24 \\cdot 24$', correct: false },
              { text: '$2025$', correct: false },
            ],
          },
        },
      ],
    },
    {
      id: 'sec-1-3',
      number: '1.3',
      title: 'Polygrafické (blokové) šifry — Hillova šifra',
      blocks: [
        {
          kind: 'p',
          html: 'Afinní šifry jsou zranitelné frekvenční analýzou. <strong>Polygrafické</strong> šifry zpracovávají bloky znaků najednou. Hillova šifra (1930) je založena na lineární algebře modulo $n$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.6',
          title: 'Hillova šifra',
          html: 'Pro blok délky $n$ a matici $\\mathbf{A}$ rozměru $n \\times n$ s $\\gcd(\\det \\mathbf{A}, 26) = 1$ platí $|\\mathbf{c}|_{26} = |\\mathbf{A}\\mathbf{p}|_{26}$, dešifrování $|\\mathbf{p}|_{26} = |\\mathbf{A}^{-1}\\mathbf{c}|_{26}$.',
          plain:
            'Šifruje se rovnou blok n písmen najednou — vynásobí se maticí klíče v modulární aritmetice. Lepší než jednoduchá substituce, ale stále lineární — známá-OT útokem se klíč dopočítá řešením soustavy.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.4',
          title: 'Hillova šifra pro $n=2$',
          html: 'Šifrování OT <code>THE GOLD IS BURIED IN ORONO</code> s rovnicemi $c_1 = |5p_1 + 17p_2|_{26}$, $c_2 = |4p_1 + 15p_2|_{26}$. První blok TH = (19,7) → (6,25) = GZ. Dešifrovací matice je $\\begin{pmatrix}17 & 5\\\\18 & 23\\end{pmatrix}$.',
        },
        {
          kind: 'interactive',
          component: 'hill',
          title: 'Hillova šifra (n = 2)',
          hint: 'Upravujte klíčovou matici A; sledujte determinant, inverzi a šifrování po dvojicích písmen.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '1.1',
          title: 'Slabiny Hillovy šifry',
          html: 'Hillova šifra <strong>není odolná vůči known-plaintext útoku</strong>. Z dostatečného počtu dvojic (OT, ŠT) lze sestavit soustavu $|\\mathbf{AP}|_{26} = |\\mathbf{C}|_{26}$ a získat klíč $\\mathbf{A} = |\\mathbf{CP}^{-1}|_{26}$. Při chosen-plaintext útoku stačí zvolit $\\mathbf{P} = \\mathbf{E}$, čímž přímo $\\mathbf{C} = \\mathbf{A}$.',
        },
      ],
    },
    {
      id: 'sec-1-4',
      number: '1.4',
      title: 'Polyalfabetická Vigenèrova šifra',
      blocks: [
        {
          kind: 'p',
          html: 'Polyalfabetické šifry řeší slabinu monoalfabetických — odraz frekvenční distribuce OT v ŠT. <strong>Vigenèrova šifra</strong> je posloupností Caesarových posunů řízených heslem.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.7',
          title: 'Vigenèrova šifra',
          html: 'Heslo $K = (k_1, \\dots, k_n)$ délky $n$. Šifrování: $c_j = |p_j + k_{((j-1) \\bmod n) + 1}|_N$. Délka $n$ se nazývá <em>perioda</em>.',
          plain:
            'Vezme krátké heslo a opakovaně jím posouvá písmena otevřeného textu (jako Caesar, ale jiná hodnota posunu pro každé písmeno hesla). Tím se rozbije jednoduchá frekvenční analýza — jedno písmeno se může šifrovat různě podle své pozice.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.5',
          title: 'Vigenère',
          html: 'Klíč „BRIDGE“ = (1,17,8,3,6,4). OT „THE LITERATURE OF…“ → ŠT „UYM OOXFII…“. Šifra dostatečně vyhlazuje frekvenční charakteristiky pro periodu ≥ 3, ale konečný klíč ze slov přirozeného jazyka je slabina.',
        },
        {
          kind: 'interactive',
          component: 'vigenere',
          title: 'Vigenèrova šifra',
          hint: 'Klíč se opakuje po celé délce zprávy a každé písmeno posouvá samostatně.',
        },
      ],
    },
    {
      id: 'sec-1-5',
      number: '1.5',
      title: 'Transpoziční šifry',
      blocks: [
        {
          kind: 'p',
          html: '<strong>Transpoziční šifra</strong> permutuje pořadí znaků OT, nikoli jejich identitu. Cílem je <strong>difúze</strong> — rozptyl redundance po celém ŠT — na rozdíl od <strong>konfúze</strong> u substitucí.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '1.8',
          title: 'Sloupcová transpozice',
          html: 'OT se zapíše po řádcích do tabulky s pevným počtem sloupců. ŠT vznikne čtením po sloupcích. Příklad pro 5 sloupců: ŠT je $p_1 p_6 p_{11} \\dots\\, p_2 p_7 p_{12} \\dots$',
          plain:
            'Otevřený text se zapíše do tabulky po řádcích a šifrový text se přečte po sloupcích. Písmena se zachovají, jen se prohází jejich pořadí — proto má šifrový text stejnou frekvenci znaků jako otevřený.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '1.6',
          title: '5-sloupcová transpozice',
          html: 'OT „THIS IS THE MESSAGE TO SHOW HOW A COLUMNAR TRANSPOSITION WORKS“ doplněný písmeny X do plné tabulky 11×5 dá ŠT <code>TSEEO AMROO KHTST WCNAS NSIHS OHOAN IWXSE ASOLR STOXI MGHWU TPIRX</code>.',
        },
        {
          kind: 'exercise',
          number: '1.3',
          title: 'Luštění transpoziční šifry',
          source: '2. test 02.05.2025',
          problem:
            'Zachytili jsme zašifrovanou zprávu $ST = \\text{NLSEJEUSXCEXIMX}$. Víme, že byla použita transpoziční šifra. Určete $OT$.',
          solution:
            '<p>Délka ŠT je $15 = 3 \\cdot 5$. Zkusíme zápis po sloupcích do tabulky $3 \\times 5$ (5 sloupců, 3 řádky): N L S E J / E U S X C / E X I M X.</p><p>Čtení po řádcích zleva doprava ale zatím nedává smysl. Zkusíme tedy obrácený postup: ŠT byl získán <em>čtením po sloupcích</em>, takže zapíšeme ŠT po sloupcích do tabulky $5 \\times 3$ a OT čteme po řádcích: sloupce „NLSEJ“, „EUSXC“, „EXIMX“ → tabulka řádek 1: N E E, řádek 2: L U X, řádek 3: S S I, řádek 4: E X M, řádek 5: J C X.</p><p>Po řádcích zleva: <code>NEU CIL JSE MSE XXX</code> = <strong>NEUCILJSEMSEXXX</strong>. X je padding.</p>',
          result: 'OT = <code>NEUCILJSEMSEXXX</code> (česky: „neučil jsem se“, doplněno XXX).',
          answer: {
            type: 'open',
            accept: ['NEUCILJSEMSEXXX', 'neucilejsemsexxx', 'neucilJSEMSExxx'],
            placeholder: 'otevřený text',
          },
        },
      ],
    },
  ],
}
