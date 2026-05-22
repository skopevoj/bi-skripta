import type { Chapter } from '../types'

export const chap04: Chapter = {
  id: 'chap-4',
  number: '4',
  title: 'Blokové šifry, DES, 3DES, AES, operační módy',
  intro: [
    {
      kind: 'p',
      html: 'Bloková šifra šifruje bloky pevné délky (dnes 128 b) toutéž transformací $E_k$. Známé blokové šifry: DES (64 b blok), 3DES, IDEA, CAST, AES (128 b blok).',
    },
  ],
  sections: [
    {
      id: 'sec-4-1',
      number: '4.1',
      title: 'Bloková šifra a Feistelovy konstrukce',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '4.1',
          title: 'Bloková šifra',
          html: 'Šifrovací systém $(M, C, K, E, D)$, kde $M = C$ je množina řetězců délky $t$ nad abecedou $A$. Pro každý klíč $k \\in K$ existují transformace $E_k$, $D_k$ a všechny bloky jsou šifrovány toutéž $E_k$.',
          plain:
            'Šifra, která pracuje s bloky pevné velikosti (typicky 128 bitů u AES). Hodí se na soubory a disky — celá zpráva se rozkrájí na bloky a každý se zašifruje stejnou transformací.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '4.2',
          title: 'Feistelův kryptosystém',
          html: 'Zpráva $m = (m_0, m_1) \\in V_{2n}$ se transformuje rekurentně: $m_{i+1} = m_{i-1} \\oplus f_i(m_i)$ pro $i = 1, \\dots, h$. Výstup $T_k(m) = (m_h, m_{h+1})$. Funkce $f_i$ nemusí být prostá — dešifrování probíhá stejně s obráceným pořadím klíčů.',
          plain:
            'Konstrukce blokových šifer, kde se blok rozdělí na dvě poloviny a v každé rundě se míchá jen jedna z nich. Krásné je, že dešifrování běží stejným kódem jako šifrování — stačí obrátit pořadí rundovních klíčů.',
        },
        {
          kind: 'diagram',
          component: 'feistel',
          caption: 'Obr. 4.1: Schéma Feistelovy sítě. Bloky L a R se v každé rundě prohazují; rundovní funkce F dostává polovinu R a klíč Kᵢ, výstup se sčítá XOR s druhou polovinou.',
        },
      ],
    },
    {
      id: 'sec-4-2',
      number: '4.2',
      title: 'DES (Data Encryption Standard)',
      blocks: [
        {
          kind: 'p',
          html: 'DES (FIPS 46-3, 1977) je iterovaná Feistelova šifra s 16 rundami, blokem 64 b a klíčem <strong>56 b</strong> (z 64 b je 8 bitů parity). Krátký klíč byl důsledkem zásahu NSA.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-2-1',
          number: '4.2.1',
          title: 'Struktura DES',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Úvodní permutace IP (bez klíče).',
            'Rozdělení na $L_0, R_0$ (32+32 b).',
            '16 rund: $(L_{i+1}, R_{i+1}) = (R_i,\\ L_i \\oplus f(R_i, k_{i+1}))$.',
            'Po 16. rundě záměna stran $(R_{16}, L_{16})$.',
            'Závěrečná permutace IP$^{-1}$.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-4-2-2',
          number: '4.2.2',
          title: 'Rundovní funkce f',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            'Expanze E: $R_{i-1}$ (32 b) → 48 b.',
            'XOR s rundovním klíčem $k_i$ (48 b).',
            '8 <strong>S-boxů</strong> redukuje 48 b zpět na 32 b — jediný nelineární prvek.',
            'Permutace P (32 → 32 b).',
          ],
        },
        {
          kind: 'diagram',
          component: 'des-round',
          caption: 'Obr. 4.2: Rundovní funkce DES f(R, Kᵢ). Expanze E rozšíří 32 b na 48 b, XOR s rundovním klíčem Kᵢ, osm S-boxů zúží zpět na 32 b, permutace P uspořádá výstup.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '4.1',
          title: 'Bezpečnost DES',
          html: 'Hlavní slabinou je krátký klíč (56 b). 1998: stroj DES-Cracker prolomil DES hrubou silou. Lineární a diferenciální kryptoanalýza odhalily teoretické slabiny, ale praktickým limitem zůstává délka klíče.',
        },
      ],
    },
    {
      id: 'sec-4-3',
      number: '4.3',
      title: 'Triple DES (3DES, EDE)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '4.3',
          title: '3DES-EDE',
          html: '$\\text{ŠT} = E_{K_3}(D_{K_2}(E_{K_1}(\\text{OT})))$. Volba $K_1 = K_2 = K_3$ → kompatibilní s DES. Volba $K_1 = K_3 \\ne K_2$ → 112 b klíč. Tři různé klíče → 168 b klíč.',
          plain:
            'Aplikuje DES třikrát za sebou — šifrovat, dešifrovat, šifrovat — s několika klíči. Vznikl jako rychlá záplata na slabý 56bitový klíč DES, než se dohodl AES; dnes se postupně vyřazuje.',
        },
        {
          kind: 'p',
          html: 'Schéma EDE bylo zavedeno kvůli zpětné kompatibilitě (FIPS PUB 46-3). 3DES lze používat v libovolném operačním módu (např. 3DES-EDE-CBC).',
        },
      ],
    },
    {
      id: 'sec-4-4',
      number: '4.4',
      title: 'AES (Rijndael)',
      blocks: [
        {
          kind: 'p',
          html: 'AES (FIPS 197, účinnost od 26. 5. 2002) byl vybrán z 15 kandidátů v soutěži NIST. Vítěz: <strong>Rijndael</strong> (Daemen, Rijmen). <strong>Není Feistelovského typu.</strong> Blok 128 b, klíč 128/192/256 b, počet rund $N_r = N_k + 6 = 10/12/14$.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-4-1',
          number: '4.4.1',
          title: 'Stavební bloky AES',
        },
        {
          kind: 'p',
          html: 'AES pracuje s prvky Galoisova tělesa $GF(2^8)$ s redukčním polynomem $m(x) = x^8 + x^4 + x^3 + x + 1$. Stav je matice 4×4 bajtů.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>SubBytes</strong> — nelineární substituce bajt → bajt (S-box).',
            '<strong>ShiftRows</strong> — cyklický posun řádků matice o 0, 1, 2, 3 bajty doleva.',
            '<strong>MixColumns</strong> — lineární substituce sloupců (násobení maticí v $GF(2^8)$). V poslední rundě se neprovádí.',
            '<strong>AddRoundKey</strong> — XOR s rundovním klíčem (128 b).',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '4.4',
          title: 'MixColumns',
          html: '$\\begin{pmatrix}b_0\\\\b_1\\\\b_2\\\\b_3\\end{pmatrix} = \\begin{pmatrix}02 & 03 & 01 & 01\\\\01 & 02 & 03 & 01\\\\01 & 01 & 02 & 03\\\\03 & 01 & 01 & 02\\end{pmatrix} \\cdot \\begin{pmatrix}a_0\\\\a_1\\\\a_2\\\\a_3\\end{pmatrix}$, kde konstanty jsou v hex zápisu $GF(2^8)$.',
          plain:
            'Krok AES, který „rozmaže“ jednotlivé sloupce stavu vynásobením pevnou maticí. Stará se o difúzi — drobná změna jednoho bajtu se promítne do všech čtyř bajtů sloupce.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '4.2',
          title: 'Vlastnosti AES',
          html: 'AES je rychlý v HW i SW, malé nároky na paměť, vhodný pro paralelní zpracování. <strong>Nemá slabé klíče</strong> a je odolný proti lineární a diferenciální kryptoanalýze. Jediný nelineární prvek (SubBytes) lze popsat implicitními rovnicemi pouze 2. řádu.',
        },
      ],
    },
    {
      id: 'sec-4-5',
      number: '4.5',
      title: 'Operační módy blokových šifer',
      blocks: [
        {
          kind: 'h3',
          id: 'subsec-4-5-1',
          number: '4.5.1',
          title: 'ECB (Electronic Codebook)',
        },
        {
          kind: 'math',
          tex: '\\text{ŠT}_i = E_K(\\text{OT}_i)',
        },
        {
          kind: 'p',
          html: 'Každý blok šifrován nezávisle. <strong>Slabina:</strong> stejné bloky OT dají stejné ŠT — odhaluje strukturu. Šifrováním se nezajišťuje integrita; útočník může bloky přeskupovat.',
        },
        {
          kind: 'interactive',
          component: 'mode-ecb',
          title: 'Schéma ECB',
        },
        {
          kind: 'h3',
          id: 'subsec-4-5-2',
          number: '4.5.2',
          title: 'CBC (Cipher Block Chaining)',
        },
        {
          kind: 'math',
          tex: '\\text{ŠT}_0 = \\text{IV},\\quad \\text{ŠT}_i = E_K(\\text{OT}_i \\oplus \\text{ŠT}_{i-1})',
        },
        {
          kind: 'p',
          html: 'Nejpoužívanější mód. Náhodný IV zajišťuje, že stejný OT 2× dá různý ŠT. Dešifrování: $\\text{OT}_i = \\text{ŠT}_{i-1} \\oplus D_K(\\text{ŠT}_i)$. Samosynchronizující — chyba se „opraví“ po 2 správných ŠT.',
        },
        {
          kind: 'interactive',
          component: 'mode-cbc',
          title: 'Schéma CBC',
        },
        {
          kind: 'h3',
          id: 'subsec-4-5-3',
          number: '4.5.3',
          title: 'CFB a OFB (Feedback módy)',
        },
        {
          kind: 'p',
          html: 'Převádí blokovou šifru na proudovou. <strong>OFB</strong>: heslo $H = E_K(\\text{IV})$, dále $H := E_K(H)$, $\\text{ŠT}_i = \\text{OT}_i \\oplus H$. Synchronní — heslo nezávisí na OT/ŠT. <strong>CFB</strong>: $\\text{ŠT}_i = \\text{OT}_i \\oplus E_K(\\text{ŠT}_{i-1})$ — samosynchronizující.',
        },
        {
          kind: 'interactive',
          component: 'mode-cfb',
          title: 'Schéma CFB',
        },
        {
          kind: 'interactive',
          component: 'mode-ofb',
          title: 'Schéma OFB',
        },
        {
          kind: 'h3',
          id: 'subsec-4-5-4',
          number: '4.5.4',
          title: 'CTR (Counter)',
        },
        {
          kind: 'math',
          tex: 'CTR_i = |IV + i - 1|_{2^B},\\ H_i = E_K(CTR_i),\\ \\text{ŠT}_i = \\text{OT}_i \\oplus H_i',
        },
        {
          kind: 'p',
          html: 'Heslo lze počítat <strong>nezávisle</strong> na předchozích blocích (na rozdíl od OFB) — paralelizovatelné. Hodnota čítače nesmí být v rámci jednoho klíče opakována.',
        },
        {
          kind: 'interactive',
          component: 'mode-ctr',
          title: 'Schéma CTR',
        },
        {
          kind: 'h3',
          id: 'subsec-4-5-5',
          number: '4.5.5',
          title: 'CBC-MAC',
        },
        {
          kind: 'p',
          html: 'Šifrování ≠ integrita. CBC-MAC počítá autentizační kód: zpráva se „šifruje“ v módu CBC s nulovým IV, ale průběžný ŠT se neodesílá. Výsledný kód: $\\text{CBC-MAC} = E_{K_2}(\\text{ŠT}_n)$. <strong>Klíč $K_2$ musí být odlišný od šifrovacího klíče.</strong>',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '4.3',
          title: 'Vlastnosti CBC-MAC',
          html: 'Zajišťuje autentizaci původu dat a integritu. Protože jde o symetrickou techniku, <strong>nezaručuje nepopiratelnost</strong> — kdokoli se sdíleným klíčem může MAC vytvořit.',
        },
        {
          kind: 'interactive',
          component: 'ecb-vs-cbc',
          title: 'ECB vs. CBC',
          hint: 'Nakreslete vzor a porovnejte, jak ho zachovává ECB a maskuje CBC.',
        },
      ],
    },
    {
      id: 'sec-4-6',
      number: '4.6',
      title: 'Příklady',
      blocks: [
        {
          kind: 'p',
          html: 'Vybrané úlohy ze zápočtů a selftestů — k procvičení Hillovy šifry, výpočtů v operačních módech a vlastností DES/AES.',
        },
        {
          kind: 'exercise',
          number: '4.1',
          title: 'Inverze klíčové matice Hillovy šifry',
          source: '1. selftest 2025/26',
          problem:
            'Mějme Hillovu šifru nad abecedou 26 znaků určenou maticí $$\\mathbb{A} = \\begin{pmatrix} 3 & 2 \\\\ 7 & 5 \\end{pmatrix}.$$ Vyberte všechny správné dešifrovací matice $\\mathbb{A}^{-1}$ (modulo $26$).',
          solution:
            '<p>$\\det \\mathbb{A} = 15 - 14 = 1$, takže $\\det^{-1} = 1$.</p><p>Adjugovaná matice: $\\mathrm{adj}(\\mathbb{A}) = \\begin{pmatrix} 5 & -2 \\\\ -7 & 3 \\end{pmatrix}$.</p><p>$\\mathbb{A}^{-1} = \\det^{-1} \\cdot \\mathrm{adj}(\\mathbb{A}) = \\begin{pmatrix} 5 & -2 \\\\ -7 & 3 \\end{pmatrix} \\equiv \\begin{pmatrix} 5 & 24 \\\\ 19 & 3 \\end{pmatrix} \\pmod{26}$.</p><p>Pozor: $-2 \\equiv 24$, $-7 \\equiv 19$. Možnost s prvkem 17 nebo 21 v levém dolním rohu je chybná.</p>',
          result: '$\\mathbb{A}^{-1} \\equiv \\begin{pmatrix} 5 & 24 \\\\ 19 & 3 \\end{pmatrix} \\pmod{26}$',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: '$\\mathbb{A}^{-1} = \\begin{pmatrix} 5 & 24 \\\\ 19 & 3 \\end{pmatrix}$',
                correct: true,
              },
              {
                text: '$\\mathbb{A}^{-1} = \\begin{pmatrix} 5 & -2 \\\\ 19 & 20 \\end{pmatrix}$',
                correct: false,
              },
              {
                text: '$\\mathbb{A}^{-1} = \\begin{pmatrix} 5 & 24 \\\\ 17 & 3 \\end{pmatrix}$',
                correct: false,
              },
              {
                text: '$\\mathbb{A}^{-1} = \\begin{pmatrix} 5 & 24 \\\\ 21 & 3 \\end{pmatrix}$',
                correct: false,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '4.2',
          title: 'Výpočet dešifrovací matice',
          source: '2. test 02.05.2025',
          problem:
            'Je dán šifrovací klíč Hillovy šifry $$\\mathbb{A} = \\begin{pmatrix} 3 & 7 \\\\ 5 & 2 \\end{pmatrix}$$ pro 26-znakovou abecedu. Spočítejte $\\mathbb{A}^{-1}$ a zapište po řádcích jako kladná čísla „a,b,c,d“.',
          solution:
            '<p>$\\det \\mathbb{A} = 6 - 35 = -29 \\equiv -29 + 26 = -3 \\equiv 23 \\pmod{26}$.</p><p>Hledáme $23^{-1} \\pmod{26}$. Rozšířený Eukleides: $26 = 23 + 3$, $23 = 7\\cdot 3 + 2$, $3 = 2 + 1$. Zpětně: $1 = 3 - 2 = 3 - (23 - 7\\cdot 3) = 8\\cdot 3 - 23 = 8(26 - 23) - 23 = 8\\cdot 26 - 9\\cdot 23$. Tedy $23^{-1} \\equiv -9 \\equiv 17 \\pmod{26}$.</p><p>$\\mathrm{adj}(\\mathbb{A}) = \\begin{pmatrix} 2 & -7 \\\\ -5 & 3 \\end{pmatrix} \\equiv \\begin{pmatrix} 2 & 19 \\\\ 21 & 3 \\end{pmatrix} \\pmod{26}$.</p><p>$\\mathbb{A}^{-1} = 17 \\cdot \\begin{pmatrix} 2 & 19 \\\\ 21 & 3 \\end{pmatrix} = \\begin{pmatrix} 34 & 323 \\\\ 357 & 51 \\end{pmatrix} \\equiv \\begin{pmatrix} 8 & 11 \\\\ 19 & 25 \\end{pmatrix} \\pmod{26}$.</p>',
          result: '$\\mathbb{A}^{-1} \\equiv \\begin{pmatrix} 8 & 11 \\\\ 19 & 25 \\end{pmatrix} \\pmod{26}$, tedy „8,11,19,25“.',
          answer: {
            type: 'open',
            accept: ['8,11,19,25'],
            placeholder: 'a,b,c,d',
          },
        },
        {
          kind: 'exercise',
          number: '4.3',
          title: 'Dešifrování Hillovou šifrou',
          source: '2. test 02.05.2025',
          problem:
            'Šifrový text $ST = \\text{GWGTENYR}$ je zašifrován Hillovou šifrou ($26$ znaků) maticí $$\\mathbb{A} = \\begin{pmatrix} 3 & 2 \\\\ 7 & 5 \\end{pmatrix}.$$ Určete $OT$.',
          solution:
            '<p>Z příkladu 4.1: $\\mathbb{A}^{-1} = \\begin{pmatrix} 5 & 24 \\\\ 19 & 3 \\end{pmatrix} \\pmod{26}$.</p><p>Bloky po dvou znacích: $GW = (6,22)$, $GT = (6, 19)$, $EN = (4, 13)$, $YR = (24, 17)$.</p><p>Aplikujeme $\\mathbb{A}^{-1}$:</p><ul><li>$(6,22) \\to (5\\cdot 6 + 24\\cdot 22,\\ 19\\cdot 6 + 3\\cdot 22) = (558, 180) \\equiv (12, 24) = MY$.</li><li>$(6,19) \\to (5\\cdot 6 + 24\\cdot 19,\\ 19\\cdot 6 + 3\\cdot 19) = (486, 171) \\equiv (18, 15) = SP$.</li><li>$(4,13) \\to (5\\cdot 4 + 24\\cdot 13,\\ 19\\cdot 4 + 3\\cdot 13) = (332, 115) \\equiv (20, 11) = UL$.</li><li>$(24,17) \\to (5\\cdot 24 + 24\\cdot 17,\\ 19\\cdot 24 + 3\\cdot 17) = (528, 507) \\equiv (8, 13) = IN$.</li></ul>',
          result: 'OT = <code>MYSPULIN</code>',
          answer: {
            type: 'open',
            accept: ['MYSPULIN'],
            placeholder: 'otevřený text',
          },
        },
        {
          kind: 'exercise',
          number: '4.4',
          title: 'OFB — výpočet bloku ŠT',
          source: '2. test 02.05.2025',
          problem:
            'Mějme operační mód OFB. $i$-tý blok keystreamu označme $H_i$. Známe $ST_2 = 1101_2$, $E_K(H_2) = 0111_2$, $OT_3 = 1001_2$. Spočítejte $ST_3$.',
          solution:
            '<p>V OFB platí $H_{i+1} = E_K(H_i)$ a $ST_i = OT_i \\oplus H_i$. Takže $H_3 = E_K(H_2) = 0111_2$.</p><p>$ST_3 = OT_3 \\oplus H_3 = 1001 \\oplus 0111 = 1110_2$.</p>',
          result: '$ST_3 = 1110_2$',
          answer: {
            type: 'open',
            accept: ['1110', '1110_2'],
            placeholder: 'ST_3 binárně',
          },
        },
        {
          kind: 'exercise',
          number: '4.5',
          title: 'Vlastnosti operačních módů',
          source: '2. test 02.05.2025',
          problem:
            'Označte všechna pravdivá tvrzení o operačních módech blokových šifer.',
          solution:
            '<p><strong>CBC-MAC</strong> je standardní autentizační kód postavený na CBC s odlišným klíčem než šifrování. Zajišťuje autentizaci dat.</p><p><strong>OFB</strong> převádí blokovou šifru na <em>synchronní</em> proudovou — keystream nezávisí na OT/ŠT. Naopak <strong>CTR</strong> je také synchronní (čítač nezávisí na ŠT), nikoli asynchronní.</p><p><strong>ECB</strong> nemá řetězení — útočník může bloky přeskupovat, mazat a vkládat, aniž by to bylo detekovatelné.</p><p><strong>CFB</strong>: změna 1 bitu v $ST_1$ změní 1 bit v $OT_1$ (přímý XOR s $E_K(ST_0)$, ten není narušen) a celý $OT_2$ (protože $ST_1$ vstupuje do dešifrování dalšího bloku).</p><p><strong>MAC</strong> sám o sobě <em>nezaručuje nepopiratelnost</em> — sdílený klíč může použít kterákoli strana.</p>',
          result:
            'Pravdivá: ECB umožňuje přeskupování bloků, CBC-MAC pro autentizaci, OFB → synchronní proudová, CFB šíří chybu do $OT_2$.',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: 'Operační mód ECB umožňuje útočníkovi snadno měnit pořadí bloků ŠT, nebo je mazat a vkládat.',
                correct: true,
              },
              {
                text: 'Pro zajištění autentizace dat lze použít mód CBC-MAC.',
                correct: true,
              },
              {
                text: 'Operační mód OFB převádí blokovou šifru na synchronní proudovou šifru.',
                correct: true,
              },
              {
                text: 'Máme-li mód CFB, změna 1 bitu v bloku $ST_1$ může způsobit změnu 1 bitu v $OT_1$ a více bitů v $OT_2$.',
                correct: true,
              },
            ],
          },
        },
        {
          kind: 'exercise',
          number: '4.6',
          title: 'Šifra DES',
          source: '2. test 02.05.2025',
          problem: 'Která tvrzení o DES jsou pravdivá?',
          solution:
            '<p>DES má klíč $56$ bitů (z 64 je 8 paritních), což je z dnešního pohledu nedostatečné — DES byl prolomen brute-force útokem už 1998.</p><p>DES je Feistelova šifra, takže dešifrování probíhá stejně jako šifrování, jen s obráceným pořadím rundovních klíčů. Použití stejného obvodu pro $E$ i $D$ bylo cílem návrhu.</p><p>S-boxy jsou nelineární prvkem, ale nikoli jediným — funkce $f$ obsahuje i expanzi a permutaci, které jsou lineární.</p>',
          result: 'Krátký klíč jako slabina + dešifrování přes obrácené pořadí klíčů.',
          answer: {
            type: 'multichoice',
            options: [
              {
                text: 'Má krátký klíč, který je zásadní bezpečnostní slabinou.',
                correct: true,
              },
              {
                text: 'Pro dešifrování používá stejný způsob jako pro šifrování, pouze obrátí pořadí výběru rundovních klíčů.',
                correct: true,
              },
              {
                text: 'Není šifra Feistelova typu.',
                correct: false,
              },
              {
                text: 'Obsahuje S-boxy, které jsou jediným nelineárním prvkem šifry.',
                correct: false,
              },
            ],
          },
        },
      ],
    },
  ],
}
