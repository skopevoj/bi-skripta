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
          plain:
            'Z krátkého klíče se vyrobí dlouhý proud „náhodně vypadajících“ dat (tzv. heslo) a XOR-uje se po bitech se zprávou. Hodí se na proudy dat (hovor, video), kde nelze čekat na celý blok.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.2',
          title: 'Vernamova šifra (one-time pad)',
          html: 'Heslo je <strong>zcela náhodné</strong> a stejně dlouhé jako OT, použije se právě jednou. Vlastnost <strong>absolutní bezpečnosti</strong> — ŠT nenese žádnou informaci o OT.',
          plain:
            'Jediná šifra, kterou nelze prolomit ani s nekonečným výpočetním výkonem. Cenou je, že heslo musí být opravdu náhodné, stejně dlouhé jako zpráva a nikdy nepoužité podruhé — proto se v praxi nepoužívá.',
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
          plain:
            'První krok RC4: pomocí klíče se zamíchá pole 256 bajtů tak, aby z něj vzniklo „náhodné“ pořadí. Z tohoto pomíchaného pole se pak generuje proud hesla.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '3.4',
          title: 'RC4 — generování hesla',
          html: 'V cyklu: $i = |i+1|_{256}$, $j = |j + S[i]|_{256}$, swap $S[i] \\leftrightarrow S[j]$, výstup $h = S[|S[i] + S[j]|_{256}]$.',
          plain:
            'Druhý krok RC4: opakovaně se v poli prohazují bajty podle pravidel a každý průchod vyplivne jeden bajt hesla. Tento bajt se pak XOR-uje s bajtem zprávy.',
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
          plain:
            'Základní mixovací krok šifry Salsa20 — čtyřice slov se postupně mění operacemi sčítání, rotace a XOR. Opakováním této čtveřice ve sloupcích a řádcích matice vznikne důkladně promíchaný stav.',
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
        {
          kind: 'diagram',
          component: 'salsa-chacha-flow',
          caption:
            'Salsa20/ChaCha jako synchronní proudová šifra: klíč, nonce a čítač určují blok hesla; ten se XORuje s otevřeným textem.',
        },
        {
          kind: 'interactive',
          component: 'salsa-chacha',
          title: 'Salsa20 a ChaCha krok za krokem',
          hint: 'Co se děje uvnitř generátoru hesla: animovaný průchod quarter-roundem ukazuje, která slova se v ARX kroku mění a jak se změna šíří přes matici.',
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
    {
      id: 'sec-3-7',
      number: '3.7',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Principy proudových šifer, srovnání s blokovými šiframi. Vernamova šifra, pojem absolutní bezpečnosti, definice absolutně bezpečné šifry. Algoritmické proudové šifry a jejich principy. Problém dvojího použití hesla u aditivních šifer. Synchronní a asynchronní proudové šifry. Demonstrace samosynchronizace pomocí Vigenèrova autoklávu. Charakteristiky proudových šifer Salsa20 a Chacha. Základní popis proudové šifry A5/1, použití LFSR, zavedení nelinearity, inicializace.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-1',
          number: '3.7.1',
          title: 'Principy proudových šifer, srovnání s blokovými',
        },
        {
          kind: 'p',
          html: 'Proudová šifra z klíče $k$ generuje pomocí generátoru $G$ posloupnost <em>hesla</em> $h_1, h_2, \\dots$ (keystream) a šifruje znak po znaku: $c_i = E_{h_i}(m_i)$. U moderních binárních proudových šifer je $E_{h_i}$ XOR, tedy $c_i = m_i \\oplus h_i$. Dešifrování je symetrické: $m_i = c_i \\oplus h_i$. Bloková šifra naopak šifruje celé bloky pevné délky (typ. 64 nebo 128 b) <strong>toutéž transformací</strong> $E_k$ a vyžaduje provozní mód (ECB, CBC, CFB, OFB, CTR).',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Granularita</strong>: proudová pracuje po bitu/bajtu, bloková po blocích.',
            '<strong>Propagace chyby</strong>: u proudové (synchronní) chyba v 1 bitu ŠT naruší jen 1 bit OT; u blokové celý blok.',
            '<strong>Rychlost</strong>: proudové šifry jsou typicky rychlejší a vhodné pro proudová data (hlas, video, terminál).',
            '<strong>HW nároky</strong>: proudové (zejm. LFSR-based) jsou levné v hardware.',
            '<strong>Bezpečnost</strong>: bloková je samostatně bezpečnější — proudová stojí a padá na kvalitě generátoru a unikátnosti hesla.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-2',
          number: '3.7.2',
          title: 'Vernamova šifra a absolutní bezpečnost',
        },
        {
          kind: 'p',
          html: '<strong>Vernamova šifra (one-time pad)</strong>: heslo $h$ je <em>zcela náhodné</em>, stejně dlouhé jako OT a použité <em>právě jednou</em>. Šifrování: $c = m \\oplus h$. Vernam ji patentoval 1917 pro telegrafii.',
        },
        {
          kind: 'p',
          html: '<strong>Absolutní (perfektní) bezpečnost</strong> dle Shannona (1949): šifra je absolutně bezpečná, právě když pro každý OT $m$ a každý ŠT $c$ platí $\\Pr[M = m \\mid C = c] = \\Pr[M = m]$. Jinými slovy znalost ŠT nedává útočníkovi žádnou informaci o OT — apriorní a aposteriorní rozdělení jsou shodná.',
        },
        {
          kind: 'math',
          tex: '\\Pr[M = m \\mid C = c] = \\Pr[M = m] \\quad \\forall m, c',
        },
        {
          kind: 'p',
          html: 'Shannon dokázal, že nutnou podmínkou je $|K| \\ge |M|$ — klíč musí být alespoň tak dlouhý jako zpráva. One-time pad tuto podmínku splňuje a je absolutně bezpečný. Cenou je nepoužitelnost v praxi: distribuce stejně dlouhého náhodného klíče je stejně těžká jako přenos samotné zprávy.',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-3',
          number: '3.7.3',
          title: 'Algoritmické proudové šifry a IV',
        },
        {
          kind: 'p',
          html: '<strong>Algoritmická proudová šifra</strong> nahrazuje opravdu náhodné heslo <em>pseudonáhodným</em> proudem generovaným deterministickým algoritmem ze short-term klíče. Generátor $G$ se inicializuje klíčem $k$ a <strong>inicializačním vektorem (IV)</strong>, IV je veřejný a pro každou zprávu jiný — zajistí, že stejný klíč produkuje různá hesla, takže klíč nemusíme měnit po každé zprávě. Příklady: RC4, A5/1, Salsa20, ChaCha, eSTREAM portfolio (Grain, Trivium, MICKEY).',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-4',
          number: '3.7.4',
          title: 'Problém dvojího použití hesla (two-time pad)',
        },
        {
          kind: 'p',
          html: 'Pokud je stejné heslo $h$ použito ke šifrování dvou OT $m$ a $m\'$, dostaneme $c = m \\oplus h$ a $c\' = m\' \\oplus h$. XORem ŠT:',
        },
        {
          kind: 'math',
          tex: 'c \\oplus c\' = (m \\oplus h) \\oplus (m\' \\oplus h) = m \\oplus m\'',
        },
        {
          kind: 'p',
          html: 'Heslo se zcela eliminuje a útočník získá XOR dvou OT — to je tzv. <em>knižní šifra</em>, kterou lze luštit statisticky (známé fráze, redundance přirozeného jazyka, crib-dragging). Důsledek: heslo aditivní proudové šifry nesmí být <strong>nikdy</strong> použito dvakrát. Proto se v praxi spolu s klíčem vždy posílá unikátní IV/nonce.',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-5',
          number: '3.7.5',
          title: 'Synchronní a asynchronní (samosynchronizující) šifry',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Synchronní</strong>: heslo $h_i$ závisí jen na klíči (a IV), nikoli na OT/ŠT. Odesílatel a příjemce musí být přesně synchronizováni — ztráta nebo vložení znaku ŠT rozhodí veškerý další OT, dokud se synchronizace ručně neobnoví. Chyba v 1 bitu ŠT způsobí chybu v 1 bitu OT (žádná propagace).',
            '<strong>Asynchronní (samosynchronizující)</strong>: heslo závisí na posledních $n$ znacích ŠT, tj. $h_i = f(k, c_{i-n}, \\dots, c_{i-1})$. Po přijetí $n+1$ správných znaků se příjemce sám zresynchronizuje. Cenou je propagace chyby na $n+1$ následujících znaků.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-6',
          number: '3.7.6',
          title: 'Vigenèrův autokláv — demonstrace samosynchronizace',
        },
        {
          kind: 'p',
          html: 'Vigenèrův <strong>autokláv</strong> je historický příklad samosynchronizující šifry. Klíčem je krátké heslo $k_1 \\dots k_t$ a od pozice $t+1$ se jako další znaky hesla použijí samotné znaky ŠT: $h_{i} = c_{i-t}$ pro $i > t$. Šifrování je Vigenèrovo, tj. $c_i = (m_i + h_i) \\bmod 26$.',
        },
        {
          kind: 'p',
          html: 'Ztratíme-li nebo poškodíme 1 znak ŠT, špatně dešifrujeme následujících $t$ znaků (zatímco poškozený znak prochází posuvným registrem). Jakmile chybný znak „vypadne“ z okna, generátor hesla je opět ve správném stavu a dešifrování pokračuje korektně — šifra se sama zresynchronizovala bez zásahu příjemce.',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-7',
          number: '3.7.7',
          title: 'Salsa20 a ChaCha',
        },
        {
          kind: 'p',
          html: '<strong>Salsa20</strong> (D. J. Bernstein, 2005, eSTREAM Profile 1) je moderní synchronní proudová šifra postavená na operacích <strong>ARX</strong> (Add — modulární sčítání mod $2^{32}$; Rotate — bitová rotace; XOR). Stav tvoří matice $4\\times4$ šestnácti 32-bitových slov (512 b), obsahuje 4 konstanty „expand 32-byte k“, 256-bitový klíč, 64-bitový nonce a 64-bitový čítač bloku. Jádrem je <em>quarter-round</em> aktualizující 4 slova, který se aplikuje střídavě na sloupce (liché rundy) a řádky (sudé rundy), celkem 20 rund (10 dvourund). Výsledek se sečte se vstupní maticí (Davies-Meyer-like). Varianty Salsa20/8 a Salsa20/12 mají redukovaný počet rund; XSalsa20 rozšiřuje nonce na 192 b.',
        },
        {
          kind: 'p',
          html: '<strong>ChaCha</strong> (Bernstein, 2008) je úprava Salsa20 s lepším rozptylem — quarter-round aktualizuje každé slovo <em>dvakrát</em> (Salsa pouze jednou). Rotace 16, 12, 8, 7. Liché rundy se aplikují na sloupce, sudé na <em>diagonály</em>. Nejpoužívanější varianta <strong>ChaCha20</strong> má 20 rund, 256b klíč a 96b nonce + 32b čítač. Společně s autentizátorem Poly1305 tvoří AEAD konstrukci <strong>ChaCha20-Poly1305</strong> (RFC 8439), nasazenou v TLS 1.3, QUIC, OpenSSH a WireGuard. Výhody: rychlost v software (i bez AES-NI), konstantní čas, jednoduchost.',
        },
        {
          kind: 'h3',
          id: 'subsec-3-7-8',
          number: '3.7.8',
          title: 'A5/1 — LFSR, nelinearita, inicializace',
        },
        {
          kind: 'p',
          html: '<strong>A5/1</strong> (1987) je synchronní proudová šifra pro šifrování komunikace mezi mobilním telefonem a základnovou stanicí v <strong>GSM</strong>. Specifikace byla původně utajována, v roce 1999 byla rekonstruována reverzní analýzou (Briceno, Goldberg, Wagner). Klíč má <strong>64 b</strong> (efektivně 54 — posledních 10 b je v některých implementacích nulových), IV je 22-bitové číslo rámce.',
        },
        {
          kind: 'p',
          html: 'Šifra se skládá ze <strong>tří LFSR</strong> (Linear Feedback Shift Register) délek <strong>19, 22 a 23</strong> bitů. LFSR sám o sobě je lineární — celá jeho budoucí posloupnost je dána počátečním stavem a zpětnovazebním polynomem, lze ji algebraicky dopočítat z $2L$ známých bitů (Berlekamp-Massey). Proto musí být do schématu zavedena <strong>nelinearita</strong>.',
        },
        {
          kind: 'p',
          html: 'V A5/1 je nelinearita zavedena <strong>nelineárním taktováním</strong> (stop-and-go / majority clocking). Z každého registru se odebere taktovací bit — $R_1[8]$, $R_2[10]$, $R_3[10]$. Posunou se právě ty registry, jejichž taktovací bit se shoduje s <strong>většinou</strong> (majoritní funkce $\\mathrm{maj}(a,b,c)$). V průměru se v každém kroku posunou 2 ze 3 registrů. Výstupní bit hesla:',
        },
        {
          kind: 'math',
          tex: 'k_i = R_1[18] \\oplus R_2[21] \\oplus R_3[22]',
        },
        {
          kind: 'p',
          html: '<strong>Inicializace</strong> probíhá ve čtyřech fázích: (1) všechny tři registry se vynulují; (2) postupně se po bitech XORuje 64-bitový tajný klíč do nejnižších bitů všech registrů, registry se taktují <em>bez majority</em> (taktují se všechny); (3) totéž s 22-bitovým IV (číslo rámce); (4) provede se 100 taktů „naprázdno“ s majoritním taktováním a zahazují se výstupy, čímž se stav promíchá. Pak se generuje 228 bitů hesla pro daný GSM rámec (114 b pro každý směr). Pro každý další rámec se opakuje inicializace se stejným klíčem a novým IV.',
        },
        {
          kind: 'p',
          html: 'Známé útoky: korelační útoky, time-memory-tradeoff útok Birykova–Shamira–Wagnera (rainbow tables nad stavy registrů), prakticky útoky Karstena Nohla s GSM rainbow tables (2009). A5/1 je dnes považována za prolomenou a v GSM ji nahrazují A5/3 (KASUMI) a v LTE/5G modernější šifry (SNOW 3G, ZUC, AES).',
        },
      ],
    },
  ],
}
