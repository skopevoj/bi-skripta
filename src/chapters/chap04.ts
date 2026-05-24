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
          kind: 'interactive',
          component: 'aes-round',
          title: 'AES Round Explorer',
          hint: 'Projděte si AES-128 po rundách: matice stavu ukazuje aktuální bajty, přepínač kroků zvýrazní SubBytes, ShiftRows, MixColumns a AddRoundKey.',
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
    {
      id: 'sec-4-7',
      number: '4.7',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Principy blokových šifer, algoritmus Feistela – příklad. Základní charakteristiky šifry DES a TripleDES, nelinearita DES. Základní popis šifry AES, složení rundy, vlastnosti jednotlivých operací. Operační mody blokových šifer, popis použití a vlastnosti. MAC.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-1',
          number: '4.7.1',
          title: 'Principy blokových šifer',
        },
        {
          kind: 'p',
          html: 'Bloková šifra je symetrický kryptosystém $(M, C, K, E, D)$, kde $M = C$ jsou řetězce pevné délky $t$ (dnes obvykle $t = 128$ b). Pro každý klíč $k \\in K$ se používá stejná transformace $E_k$ na všechny bloky otevřeného textu. Návrh by měl zajistit dva základní principy podle Shannona: <strong>konfúzi</strong> (nelineární vztah mezi klíčem a šifrovým textem) a <strong>difúzi</strong> (rozptýlení statistických závislostí — změna jednoho bitu OT mění v průměru polovinu bitů ŠT, tzv. <em>lavinový efekt</em>). Pro zpracování zpráv delších než jeden blok se kombinují s <em>operačními módy</em>.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-2',
          number: '4.7.2',
          title: 'Feistelova konstrukce — příklad',
        },
        {
          kind: 'p',
          html: 'Feistelova síť rozdělí blok délky $2n$ na dvě poloviny $(L_0, R_0)$ a v každé z $h$ rund aplikuje rundovní funkci $f_i$ závislou na rundovním klíči $K_i$:',
        },
        {
          kind: 'math',
          tex: 'L_{i+1} = R_i, \\quad R_{i+1} = L_i \\oplus f(R_i, K_i).',
        },
        {
          kind: 'p',
          html: 'Klíčová výhoda: rundovní funkce $f$ nemusí být prostá — k dešifrování stačí spustit tutéž síť s <strong>obráceným pořadím rundovních klíčů</strong> $K_h, K_{h-1}, \\dots, K_1$. Tím se v HW i SW šetří — stejný obvod slouží pro $E$ i $D$. Příkladem je DES (16 rund, $n = 32$). Mini-příklad pro 1 rundu na 8bitovém bloku $(L_0, R_0) = (1010, 1100)$ s $f(R_0, K_1) = R_0 \\oplus K_1$ a $K_1 = 0110$: $f = 1010$, $L_1 = R_0 = 1100$, $R_1 = L_0 \\oplus f = 1010 \\oplus 1010 = 0000$, výstup $(1100, 0000)$.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-3',
          number: '4.7.3',
          title: 'DES a 3DES, nelinearita DES',
        },
        {
          kind: 'p',
          html: '<strong>DES</strong> (FIPS 46-3, 1977): iterovaná Feistelova šifra, <strong>blok 64 b</strong>, <strong>klíč 56 b</strong> (z 64 b vstupního klíče je 8 bitů parity), <strong>16 rund</strong>. Struktura: úvodní permutace IP, 16 rund Feistela, záměna stran, závěrečná permutace $\\text{IP}^{-1}$. Rundovní funkce $f(R, K)$: expanze E (32 → 48 b), XOR s rundovním klíčem, 8 S-boxů (48 → 32 b), permutace P.',
        },
        {
          kind: 'p',
          html: '<strong>Nelinearita DES:</strong> všechny operace v $f$ kromě S-boxů (expanze, XOR, permutace P, IP, klíčový rozvrh) jsou <strong>lineární</strong> nad $\\mathbb{F}_2$. Jediným zdrojem nelinearity jsou <strong>S-boxy</strong> — osm tabulek $6 \\to 4$ b, jejichž výstup nelze popsat jako lineární funkci vstupních bitů. Bez S-boxů by celý DES byl afinní transformace a útočník by ji rozbil řešením soustavy lineárních rovnic. Konstrukce S-boxů (jejich konkrétní hodnoty navrhla IBM/NSA) je navíc odolná proti diferenciální kryptoanalýze, která byla v době návrhu utajena.',
        },
        {
          kind: 'p',
          html: 'Hlavní slabinou DES je krátký klíč 56 b — v roce 1998 byl prolomen hrubou silou strojem DES-Cracker za méně než 3 dny.',
        },
        {
          kind: 'p',
          html: '<strong>3DES (TripleDES, EDE)</strong>: rychlá záplata krátkého klíče DES bez nutnosti měnit existující HW. Definice:',
        },
        {
          kind: 'math',
          tex: '\\text{ŠT} = E_{K_3}(D_{K_2}(E_{K_1}(\\text{OT}))).',
        },
        {
          kind: 'p',
          html: 'Schéma <em>Encrypt-Decrypt-Encrypt</em> bylo zvoleno kvůli zpětné kompatibilitě: pokud $K_1 = K_2 = K_3$, redukuje se na obyčejný DES. Volba $K_1 = K_3 \\ne K_2$ dává 2-key 3DES (efektivní bezpečnost ~112 b kvůli meet-in-the-middle), tři různé klíče dávají 3-key 3DES (168 b klíče, efektivní bezpečnost ~112 b). 3DES lze používat v libovolném operačním módu (např. 3DES-EDE-CBC), dnes je postupně vyřazován ve prospěch AES.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-4',
          number: '4.7.4',
          title: 'AES — popis, runda a vlastnosti operací',
        },
        {
          kind: 'p',
          html: '<strong>AES</strong> (FIPS 197, 2002) vznikl z algoritmu <strong>Rijndael</strong> (Daemen, Rijmen) vítězstvím v otevřené soutěži NIST. <strong>Není Feistelovského typu</strong> — jde o tzv. SP-síť (substitučně-permutační). Blok je vždy <strong>128 b</strong> (matice 4×4 bajtů, „state“), klíč $128/192/256$ b, počet rund $N_r = N_k + 6$, tedy <strong>10 / 12 / 14</strong> rund. AES pracuje nad Galoisovým tělesem $GF(2^8)$ s redukčním polynomem $m(x) = x^8 + x^4 + x^3 + x + 1$.',
        },
        {
          kind: 'p',
          html: 'Každá <strong>standardní runda</strong> obsahuje čtyři operace v pořadí <em>SubBytes → ShiftRows → MixColumns → AddRoundKey</em>. Před první rundou je předřazen AddRoundKey s počátečním klíčem; <strong>v poslední rundě se MixColumns vynechává</strong> (aby šlo dešifrování složit z inverzních operací ve stejné struktuře).',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>SubBytes</strong> — nelineární substituce bajt → bajt aplikovaná na každý bajt stavu zvlášť (S-box odvozený z inverze v $GF(2^8)$ s následnou afinní transformací). <em>Zajišťuje konfúzi</em> a je jediným nelineárním prvkem šifry.',
            '<strong>ShiftRows</strong> — cyklický posun řádků matice o $0, 1, 2, 3$ bajty doleva. Lineární operace, která <em>rozptyluje bajty mezi sloupci</em> a tím připraví terén pro MixColumns.',
            '<strong>MixColumns</strong> — lineární transformace každého sloupce vynásobením pevnou maticí v $GF(2^8)$. <em>Hlavní zdroj difúze</em> — změna jednoho bajtu se promítne do všech čtyř bajtů sloupce. V poslední rundě se neprovádí.',
            '<strong>AddRoundKey</strong> — XOR stavu s rundovním klíčem (128 b) získaným z klíčového rozvrhu. Jediná operace, která <em>zavádí závislost na klíči</em>.',
          ],
        },
        {
          kind: 'p',
          html: 'Vlastnosti AES: rychlý v HW i SW, malé paměťové nároky, snadno paralelizovatelný (zejm. v módu CTR), nemá známé slabé klíče, odolný vůči lineární i diferenciální kryptoanalýze. Moderní CPU mají dedikované instrukce (AES-NI).',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-5',
          number: '4.7.5',
          title: 'Operační módy a jejich vlastnosti',
        },
        {
          kind: 'p',
          html: 'Operační mód určuje, jak se zpráva delší než jeden blok zpracuje pomocí blokové šifry $E_K$. Liší se v paralelizovatelnosti, šíření chyb, potřebě IV a odolnosti vůči manipulaci.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>ECB</strong> (Electronic Codebook): $\\text{ŠT}_i = E_K(\\text{OT}_i)$. Plně paralelizovatelný, ale stejné bloky OT dají stejné bloky ŠT — odhaluje vzory. Útočník může bloky přeskupovat, mazat a vkládat. <em>Použití:</em> pouze pro krátká nezávislá data (klíče, hesla), nikdy pro souvislé zprávy.',
            '<strong>CBC</strong> (Cipher Block Chaining): $\\text{ŠT}_i = E_K(\\text{OT}_i \\oplus \\text{ŠT}_{i-1})$, $\\text{ŠT}_0 = \\text{IV}$. Náhodný (nepředvídatelný) IV zajistí, že stejný OT 2× dá různý ŠT. Šifrování je sériové, <em>dešifrování paralelizovatelné</em>. Samosynchronizující — chyba se po 2 správných blocích „opraví“. <em>Použití:</em> šifrování souborů, TLS (dříve), diskové šifrování.',
            '<strong>CFB</strong> (Cipher Feedback): $\\text{ŠT}_i = \\text{OT}_i \\oplus E_K(\\text{ŠT}_{i-1})$. Převádí blokovou šifru na proudovou, samosynchronizující (chyba se „rozpadne“ po jednom bloku). Nevyžaduje padding.',
            '<strong>OFB</strong> (Output Feedback): heslo $H_1 = E_K(\\text{IV})$, $H_{i+1} = E_K(H_i)$, $\\text{ŠT}_i = \\text{OT}_i \\oplus H_i$. <em>Synchronní</em> proudová šifra — keystream nezávisí na OT/ŠT a lze ho předpočítat. Chyba v 1 bitu ŠT zasáhne pouze 1 bit OT (nešíří se). Ztráta synchronizace je fatální.',
            '<strong>CTR</strong> (Counter): $\\text{ŠT}_i = \\text{OT}_i \\oplus E_K(\\text{IV} + i - 1)$. Plně <strong>paralelizovatelný</strong> v obou směrech, lze přistupovat náhodně (vhodné pro disky). Čítač se v rámci jednoho klíče nesmí opakovat (jinak XOR dvou ŠT odhalí XOR OT).',
          ],
        },
        {
          kind: 'p',
          html: 'Žádný z výše uvedených módů sám o sobě <strong>nezajišťuje integritu</strong> — k tomu slouží MAC nebo autenticated módy (GCM, CCM), které kombinují šifrování a autentizaci.',
        },
        {
          kind: 'h3',
          id: 'subsec-4-7-6',
          number: '4.7.6',
          title: 'MAC (Message Authentication Code)',
        },
        {
          kind: 'p',
          html: '<strong>MAC</strong> je krátký autentizační kód odvozený ze zprávy a tajného klíče, který slouží k ověření <em>integrity</em> a <em>autenticity původu</em> dat. Symetrická povaha klíče znamená, že MAC <strong>nezaručuje nepopiratelnost</strong> — odesílatel i příjemce mohou MAC vytvořit, takže před třetí stranou nelze rozhodnout, kdo zprávu autentizoval (na rozdíl od digitálního podpisu).',
        },
        {
          kind: 'p',
          html: '<strong>CBC-MAC</strong>: zpráva se „šifruje“ blokovou šifrou v módu CBC s nulovým IV, ale průběžné bloky ŠT se neposílají — výstupem je poslední blok $\\text{ŠT}_n$, případně dodatečně zašifrovaný druhým klíčem: $\\text{MAC} = E_{K_2}(\\text{ŠT}_n)$. Klíč $K_2$ <strong>musí být odlišný</strong> od šifrovacího klíče. Klasický CBC-MAC je bezpečný pouze pro zprávy <em>pevné délky</em>; pro proměnnou délku se používá <strong>CMAC</strong> (NIST SP 800-38B), který odvozuje dva pomocné podklíče a XORuje je s posledním blokem.',
        },
        {
          kind: 'p',
          html: 'Další běžné konstrukce: <strong>HMAC</strong> (postavený na hashovací funkci, RFC 2104) a <strong>GMAC</strong> (autentizační část GCM, založená na násobení v $GF(2^{128})$). Při ověřování příjemce spočítá MAC nad přijatou zprávou stejným klíčem a porovná v <em>konstantním čase</em> s přijatou hodnotou — odlišnost znamená, že zpráva byla pozměněna nebo nepochází od držitele klíče.',
        },
      ],
    },
  ],
}
