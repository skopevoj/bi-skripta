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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '4.2',
          title: 'Feistelův kryptosystém',
          html: 'Zpráva $m = (m_0, m_1) \\in V_{2n}$ se transformuje rekurentně: $m_{i+1} = m_{i-1} \\oplus f_i(m_i)$ pro $i = 1, \\dots, h$. Výstup $T_k(m) = (m_h, m_{h+1})$. Funkce $f_i$ nemusí být prostá — dešifrování probíhá stejně s obráceným pořadím klíčů.',
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
  ],
}
