import type { Chapter } from '../types'

export const chap03: Chapter = {
  id: 'chap-3',
  number: '3',
  title: 'Rozdělení šifer a proudové šifry',
  intro: [
    {
      kind: 'p',
      html: 'Symetrické šifry dělíme na <strong>klasické</strong> (substituční a transpoziční), <strong>proudové</strong> (RC4, Salsa20, ChaCha, A5/1) a <strong>blokové</strong> (DES, AES). Substituční dále na monoalfabetické a polyalfabetické.',
    },
  ],
  sections: [
    {
      id: 'sec-3-1',
      number: '3.1',
      title: 'Princip proudových šifer',
      blocks: [
        {
          kind: 'p',
          html: 'Bloková šifra šifruje všechny bloky toutéž transformací $E_k$. <strong>Proudová šifra</strong> naopak z klíče $k$ vygeneruje posloupnost <em>hesla</em> $h_1, h_2, \\dots$ a každý znak OT šifruje jinou transformací $E_{h_i}$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.1',
          title: 'Symetrická proudová šifra',
          html: 'Skládá se z generátoru $G$, který z klíče $k$ produkuje posloupnost $h_1, h_2, \\dots$ Šifrování: $c_i = E_{h_i}(m_i)$. Dešifrování: $m_i = D_{h_i}(c_i)$. U moderních šifer nad $\\{0,1\\}$ je transformací XOR: $c_i = m_i \\oplus h_i$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.2',
          title: 'Vernamova šifra (one-time pad)',
          html: 'Heslo je <strong>zcela náhodné</strong> a stejně dlouhé jako OT, použije se právě jednou. Vlastnost <strong>absolutní bezpečnosti</strong> — ŠT nenese žádnou informaci o OT.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '3.1',
          title: 'Algoritmické proudové šifry — IV',
          html: 'Aby klíč nemusel být měněn po každé zprávě, používá se <strong>inicializační vektor (IV)</strong>. IV je pro každou zprávu náhodný, přenáší se otevřeně před ŠT a nastavuje šifrátor do náhodného počátečního stavu. Za různost hesla zodpovídá IV, za utajení tajný klíč.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '3.1',
          title: 'Dvojí použití hesla',
          html: 'Pokud jsou dva ŠT $c, c\'$ šifrovány stejným heslem $h$ pomocí XOR, pak $c_i \\oplus c\'_i = m_i \\oplus m\'_i$ — heslo se eliminuje a oba OT lze luštit metodou knižní šifry. Heslo proudové šifry nesmí být <strong>nikdy</strong> použito dvakrát.',
        },
      ],
    },
    {
      id: 'sec-3-2',
      number: '3.2',
      title: 'Synchronní a samosynchronizující šifry',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Synchronní</strong> — heslo nezávisí na OT/ŠT. Odesílatel a příjemce musí být přesně synchronizováni; výpadek znaku ŠT naruší veškerý další OT.',
            '<strong>Samosynchronizující</strong> — heslo závisí na předchozích $n$ znacích ŠT: $h_i = f(k, c_{i-n}, \\dots, c_{i-1})$. K obnovení dojde po přijetí $n+1$ správných znaků. Historický příklad: Vigenèrův autokláv.',
          ],
        },
        {
          kind: 'diagram',
          component: 'stream-sync',
          caption: 'Obr. 3.1: Šifrovací strana proudové šifry. Vlevo synchronní — generátor nezávisí na ŠT. Vpravo samosynchronizující — předchozích n znaků ŠT vstupuje zpět do generátoru přes posuvný registr.',
        },
      ],
    },
    {
      id: 'sec-3-3',
      number: '3.3',
      title: 'RC4',
      blocks: [
        {
          kind: 'p',
          html: 'RC4 (Rivest, 1987) byla jednou z nejpoužívanějších proudových šifer (SSL, S/MIME). Dnes je <strong>považována za prolomenou</strong>. Pracuje s bajty (klíč 40–128 b), využívá tajnou permutaci $S$ množiny $\\{0,\\dots,255\\}$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.3',
          title: 'RC4 — inicializace permutace S',
          html: 'Pole $S$ se naplní identickou permutací $S[i] = i$. Poté pomocí klíče $k$ délky $n$ proběhne $j = |j + S[i] + k[|i|_n]|_{256}$ a swap $S[i] \\leftrightarrow S[j]$ pro $i = 0, \\dots, 255$.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.4',
          title: 'RC4 — generování hesla',
          html: 'V cyklu: $i = |i+1|_{256}$, $j = |j + S[i]|_{256}$, swap $S[i] \\leftrightarrow S[j]$, výstup $h = S[|S[i] + S[j]|_{256}]$.',
        },
      ],
    },
    {
      id: 'sec-3-4',
      number: '3.4',
      title: 'Salsa20 a ChaCha',
      blocks: [
        {
          kind: 'p',
          html: '<strong>Salsa20</strong> (D. J. Bernstein, 2005) — moderní proudová šifra z portfolia eSTREAM Profile 1. Operace ARX (Add-Rotate-XOR) na 16 32-bitových slovech v matici 4×4. Klíč 256 b, nonce 64 b, čítač 64 b → 512 b keystream.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.5',
          title: 'Salsa20 Quarter-Round',
          html: '$b := b \\oplus ((a \\boxplus d) \\lll 7)$; $c := c \\oplus ((b \\boxplus a) \\lll 9)$; $d := d \\oplus ((c \\boxplus b) \\lll 13)$; $a := a \\oplus ((d \\boxplus c) \\lll 18)$.',
        },
        {
          kind: 'p',
          html: 'Salsa20 střídá liché rundy aplikované na sloupce a sudé na řádky, celkem 20 rund (10 dvourund). Pevná konstanta v matici je „expand 32-byte k“. Po rundách se přičte vstup — Davies-Meyerova konstrukce.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '3.2',
          title: 'Varianty Salsa20',
          html: '<strong>Salsa20/8</strong> a <strong>Salsa20/12</strong> mají redukovaný počet rund — rychlejší, ale nižší bezpečnost. <strong>XSalsa20</strong> má 192-bitový nonce.',
        },
        {
          kind: 'p',
          html: '<strong>ChaCha</strong> (Bernstein, 2008) je úprava Salsa20 s lepším rozptylem v jedné rundě. QR aktualizuje každé slovo 2× (Salsa pouze 1×). Rotace 16, 12, 8, 7. Liché rundy na sloupce, sudé na diagonály. Používá ji <strong>ChaCha20-Poly1305</strong> v QUIC, TLS a OpenSSH.',
        },
      ],
    },
    {
      id: 'sec-3-5',
      number: '3.5',
      title: 'A5/1',
      blocks: [
        {
          kind: 'p',
          html: '<strong>A5/1</strong> (1987) — synchronní proudová šifra pro zabezpečení GSM. Struktura utajována, rekonstruována reverzní analýzou v roce 1999. Skládá se ze 3 LFSR délek 19, 22 a 23 bitů s nelineárním taktováním.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Taktovací bity $R_1[8]$, $R_2[10]$, $R_3[10]$ určují, který registr se posune (většinová funkce).',
            'Výstupní bit: $k_i = R_1[18] \\oplus R_2[21] \\oplus R_3[22]$.',
            'Inicializace: registry vynulovány, postupně se XORuje 64 bitů klíče a 22 bitů IV, pak 100 taktů „naprázdno“.',
            'Pro každý rámec (228 bitů) se používá stejný klíč a jiný IV.',
          ],
        },
      ],
    },
    {
      id: 'sec-3-6',
      number: '3.6',
      title: 'Použití proudových šifer',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            'Linkové šifrátory — okamžitý přenos jednotlivých znaků (terminálová spojení).',
            'Šifrovací zařízení s omezenou pamětí.',
            'Výhoda oproti blokovým šifrám: <strong>malá propagace chyby</strong> — chyba v 1 znaku ŠT naruší jen 1 znak OT (u blokové šifry celý blok).',
          ],
        },
      ],
    },
  ],
}
