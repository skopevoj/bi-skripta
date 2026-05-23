import type { Chapter } from '../types'

export const chap07: Chapter = {
  id: 'chap-7',
  number: '7',
  title: 'Čipové karty',
  intro: [
    {
      kind: 'p',
      html: 'Čipová karta je obvykle plastová kartička s integrovaným obvodem. Nosí informaci spojenou s konkrétním účelem — bezpečnou identifikaci, autentizaci, uchování a zpracování dat. Je odolná proti padělání a slouží jako druhý faktor autentizace (co máme).',
    },
    {
      kind: 'list',
      ordered: false,
      items: [
        '<strong>Faktory autentizace:</strong> co víme (heslo, PIN), co máme (ČK), co jsme (biometrie).',
        '<strong>Příklady použití:</strong> SIM/UICC, platební karty (EMV), elektronická peněženka, jízdenka, vstupenka, věrnostní karta, přístupový průkaz, karta pro digitální podpis (PKI), NFC Secure Element.',
      ],
    },
  ],
  sections: [
    {
      id: 'sec-7-1',
      number: '7.1',
      title: 'Rozhraní a fyzická vrstva',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Kontaktní</strong> — ISO 7816-2, USB.',
            '<strong>Bezkontaktní</strong> — ISO 14443 (proximity, 13,56 MHz, základ NFC), ISO 15693 (vicinity), LF 125/135 kHz, UHF.',
            '<strong>Hybridní</strong> (dva čipy) a <strong>duální</strong> (jeden čip se dvěma rozhraními).',
          ],
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '7.1',
          title: 'ISO 14443',
          html: 'Frekvence 13,56 MHz, indukční vazba, modulace typu A nebo B. Z hlediska procesorových karet s kryptografickými funkcemi nás zajímá zejména tento standard (EMV bezkontakt, biometrický pas, FIDO2 NFC tokeny). MIFARE Classic je proprietární protokol nad ISO 14443, NEodpovídá ISO 7816-4.',
        },
      ],
    },
    {
      id: 'sec-7-2',
      number: '7.2',
      title: 'Architektura — co je uvnitř',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Paměťové karty</strong> — ROM se sériovým číslem, EEPROM, zabezpečená paměť (např. MIFARE Classic).',
            '<strong>Procesorové karty</strong> — CPU, kryptografický koprocesor, RAM/ROM/EEPROM, komunikační obvody a senzory. Programovatelné v terénu (Java Card).',
            '<strong>GlobalPlatform</strong> (dříve OpenPlatform) — standard pro správu aplikací (appletů) na kartě.',
          ],
        },
        {
          kind: 'diagram',
          component: 'smartcard-arch',
          caption: 'Obr. 7.1: Architektura procesorové čipové karty. CPU, kryptografický koprocesor a paměti (ROM/RAM/EEPROM) jsou propojeny vnitřní sběrnicí; I/O rozhraní komunikuje s terminálem standardem ISO 7816/14443.',
        },
      ],
    },
    {
      id: 'sec-7-3',
      number: '7.3',
      title: 'Komunikace — APDU (ISO 7816-4)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '7.1',
          title: 'APDU',
          html: '<strong>Command APDU</strong> = hlavička <code>CLA INS P1 P2</code> + volitelné tělo <code>Lc DATA Le</code>. Rozlišujeme 4 případy podle přítomnosti dat a očekávané odpovědi.<br><strong>Response APDU</strong> = volitelné tělo + povinné zápatí <code>SW1 SW2</code>. Status <code>9000</code> = úspěch, <code>6A81</code> = file not found atd.',
          plain:
            'Standardizovaný formát zpráv mezi terminálem a čipovou kartou. Bez něj by terminál nevěděl, jak kartě říct „podepiš tuhle hodnotu“ nebo „vrať mi PIN“. Karta vždy odpoví dvěma stavovými bajty, podle kterých terminál pozná, jestli příkaz prošel.',
        },
        {
          kind: 'diagram',
          component: 'apdu-frame',
          caption: 'Obr. 7.2: Struktura APDU. Command APDU má povinnou hlavičku (CLA, INS, P1, P2) a volitelné tělo (Lc, Data, Le). Response APDU má volitelné tělo a povinné zápatí SW1 SW2.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '7.1',
          title: 'SELECT appletu',
          html: 'APDU <code>00 A4 04 00 08 A0 00 00 06 47 2F 00 01</code> vybere FIDO2 CTAP2 applet podle jeho AID. Odpověď <code>46 49 44 4F 5F 32 5F 30 9000</code> = „FIDO_2_0“ + Success.',
        },
      ],
    },
    {
      id: 'sec-7-4',
      number: '7.4',
      title: 'Prvky zabezpečení',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Žádná ochrana</strong> — spoléhá na to, že nikdo neposlouchá. Slabé.',
            '<strong>Symetrická</strong> autentizace a šifrování — sdílený tajný klíč.',
            '<strong>Asymetrická</strong> schémata — PKI, certifikáty, řetěz důvěry; karta generuje pár klíčů pro každou aplikaci (FIDO2).',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '7.2',
          title: 'Diverzifikace klíčů',
          html: 'Z jednoho hlavního klíče (Master Key) a diverzifikačních dat (sériové číslo karty, identifikátor aplikace) se jednosměrnou funkcí (HMAC, CMAC) odvodí klíč specifický pro kartu: $k = \\mathrm{KDF}(MK, \\text{SerialNo})$. Prolomení odvozeného klíče <strong>neprozradí MasterKey</strong> a ostatní karty zůstávají bezpečné.',
          plain:
            'Z jednoho hlavního klíče vydavatele se pro každou kartu odvodí vlastní klíč podle jejího sériového čísla. Pokud útočník dostane klíč z jedné karty, ostatní karty zůstanou v bezpečí — vydavatel nemusí měnit hlavní klíč.',
        },
      ],
    },
    {
      id: 'sec-7-5',
      number: '7.5',
      title: 'Secure Messaging',
      blocks: [
        {
          kind: 'p',
          html: 'Zabezpečení přenosu APDU mezi terminálem a kartou:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            'Bez autentizace, bez utajení.',
            'Pouze ochrana proti modifikaci pomocí <strong>MAC</strong> (typicky CMAC nad APDU + padding).',
            'MAC + šifrování datového pole (3DES/AES).',
          ],
        },
        {
          kind: 'p',
          html: 'Data v APDU se zabalí do TLV struktur (Tag-Length-Value).',
        },
      ],
    },
    {
      id: 'sec-7-6',
      number: '7.6',
      title: 'Souborový systém ISO 7816-4',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>MF</strong> (Master File) — kořen, FID <code>3F 00</code>.',
            '<strong>DF</strong> (Dedicated File) — adresář / kontejner aplikace.',
            '<strong>EF</strong> (Elementary File) — datový soubor (transparentní nebo strukturovaný po záznamech, případně cyklický).',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '7.3',
          title: 'Jména souborů',
          html: '<ul><li><strong>FID</strong> (File Identifier) — 2 bajty, libovolný soubor.</li><li><strong>SFI</strong> (Short File Identifier) — 5 bitů, jen EF, přímý výběr v příkazu.</li><li><strong>DF name (AID)</strong> — až 16 bajtů pro adresář / aplikaci.</li></ul>',
          plain:
            'Tři druhy „adres“, pod kterými terminál najde data na kartě. FID je krátký pro běžné soubory, SFI ještě kratší pro rychlý přístup, AID slouží jako „doménové jméno“ aplikace na kartě.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>SELECT</strong> <code>00 A4 ...</code> — výběr MF / DF / EF.',
            '<strong>READ BINARY</strong> <code>00 B0</code>, <strong>UPDATE BINARY</strong> <code>00 D6</code> — transparentní soubory.',
            '<strong>READ RECORD</strong> <code>00 B2</code>, <strong>UPDATE RECORD</strong> <code>00 DC</code> — záznamové soubory.',
          ],
        },
      ],
    },
    {
      id: 'sec-7-7',
      number: '7.7',
      title: 'Autentizace — FIDO2 / WebAuthn',
      blocks: [
        {
          kind: 'p',
          html: 'FIDO2 je standard pro silnou autentizaci pomocí kryptografických tokenů („security keys“). Protokol <strong>CTAP2</strong> řídí komunikaci klient (prohlížeč) ↔ authenticator (USB, NFC, BLE).',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Relying Party (RP)</strong> — server autentizující uživatele.',
            '<strong>Client</strong> — prohlížeč (WebAuthn API).',
            '<strong>Authenticator</strong> — HW/SW prostředek uživatele.',
          ],
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '7.4',
          title: 'FIDO2 — registrace',
          html: 'RP pošle výzvu (challenge), RP ID a parametry. Uživatel potvrdí přítomnost / ověření. Authenticator vygeneruje pár klíčů per-RP, uloží soukromý klíč a vrátí <em>attestation</em> + veřejný klíč + credential ID.',
          plain:
            'První návštěva: token (YubiKey) si pro daný server vyrobí nový pár klíčů, soukromý si nechá u sebe, veřejný předá serveru. Pro každý web tak má token jiný klíč — únik z jednoho webu neohrozí účty jinde.',
        },
        {
          kind: 'diagram',
          component: 'fido2-register',
          caption: 'Obr. 7.3: FIDO2 registrace. Authenticator vygeneruje pár klíčů per-RP, vrátí attestation + veřejný klíč + credential ID; soukromý klíč zůstává v zařízení.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '7.5',
          title: 'FIDO2 — autentizace (assertion)',
          html: 'RP pošle challenge a seznam credential ID. Authenticator vybere odpovídající credential, podepíše challenge + metadata (sign counter) soukromým klíčem. RP ověří podpis veřejným klíčem z registrace.',
          plain:
            'Přihlášení: server pošle náhodnou výzvu, token ji podepíše uloženým soukromým klíčem a vrátí podpis. Server ho ověří veřejným klíčem z registrace. Phishingová stránka by dostala podpis pro jiné jméno domény — proto FIDO2 nelze phishingovat.',
        },
        {
          kind: 'diagram',
          component: 'fido2-auth',
          caption: 'Obr. 7.4: FIDO2 autentizace (assertion). Authenticator podepíše challenge + sign counter pomocí SK; RP ověří podpis veřejným klíčem uloženým při registraci.',
        },
      ],
    },
    {
      id: 'sec-7-8',
      number: '7.8',
      title: 'Java Card',
      blocks: [
        {
          kind: 'list',
          ordered: false,
          items: [
            'Karta obsahuje Java VM (JCVM) — podmnožinu jazyka Java.',
            'Typy: <code>byte</code>, <code>short</code>, volitelně <code>int</code>. Nepodporováno: <code>long</code>, <code>float</code>, <code>double</code>, řetězce, vícerozměrná pole, GC, serializace, klonování.',
            'Persistence: „heap je v EEPROM“; podpora transakčního zpracování.',
            'API: <code>java.lang</code>, <code>javacard.framework</code>, <code>javacard.security</code>, <code>javacardx.crypto</code>.',
            'Aplikace = <strong>applet</strong>. Mezi applety izolace pomocí firewallu JCRE.',
          ],
        },
      ],
    },
    {
      id: 'sec-7-9',
      number: '7.9',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Co je a k čemu slouží čipová karta. Faktory autentizace — 3 základní faktory, příklady. Typy čipových karet z hlediska rozhraní. Vnitřní složení čipové karty. Zabezpečení čipové karty — symetrická a asymetrická kryptografie, odvozování klíče. Zabezpečení komunikace čipové karty — autentizace zprávy a šifrování (jen princip).</strong>',
        },
        {
          kind: 'h3',
          id: 'sec-7-9-1',
          number: '7.9.1',
          title: 'Co je a k čemu slouží čipová karta',
        },
        {
          kind: 'p',
          html: 'Čipová karta je obvykle plastová kartička s integrovaným obvodem, který představuje <strong>tamper-resistant kryptografický procesor</strong> — tj. hardware, jenž je fyzicky i logicky chráněn proti vyčtení a manipulaci. Cílem je provádět citlivé operace (uložení klíče, podpis, šifrování, ověření PINu) na kartě tak, aby klíč nikdy neopustil čip.',
        },
        {
          kind: 'p',
          html: 'Typické využití: SIM/UICC v mobilech, platební karty (EMV), biometrický pas (ePassport), karty pro digitální podpis (PKI), zaměstnanecké přístupové průkazy, dopravní karty, FIDO2 hardwarové tokeny (YubiKey), Secure Element v telefonech pro NFC platby.',
        },
        {
          kind: 'h3',
          id: 'sec-7-9-2',
          number: '7.9.2',
          title: 'Faktory autentizace',
        },
        {
          kind: 'p',
          html: 'Autentizace prokazuje identitu uživatele. Rozlišujeme <strong>tři základní faktory</strong>; silná (vícefaktorová) autentizace kombinuje alespoň dva různé:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Něco vím</strong> (knowledge) — heslo, PIN, odpověď na bezpečnostní otázku, passphrase.',
            '<strong>Něco mám</strong> (possession) — čipová karta, SIM, hardwarový token (YubiKey, RSA SecurID), mobil přijímající SMS/push notifikaci.',
            '<strong>Něco jsem</strong> (inherence, biometrie) — otisk prstu, sken duhovky či obličeje, hlas, žilní vzor, dynamika podpisu.',
          ],
        },
        {
          kind: 'p',
          html: 'Čipová karta je tedy klasickým reprezentantem faktoru „něco mám“. V kombinaci s PINem („něco vím“) tvoří dvoufaktorovou autentizaci — útočník musí získat fyzicky kartu <em>i</em> znát PIN.',
        },
        {
          kind: 'h3',
          id: 'sec-7-9-3',
          number: '7.9.3',
          title: 'Typy čipových karet z hlediska rozhraní',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Kontaktní</strong> — kovové kontakty podle <strong>ISO 7816-2</strong>, fyzické zasunutí do čtečky (klasická bankovní karta, SIM). Sem patří i <strong>USB tokeny</strong>, které jsou v podstatě čipová karta s USB rozhraním.',
            '<strong>Bezkontaktní</strong> — radiová komunikace, napájení indukčně z čtečky. <strong>ISO 14443</strong> (proximity, 13,56 MHz, do ~10 cm; základ NFC, EMV bezkontakt, biometrický pas, FIDO2 NFC), <strong>ISO 15693</strong> (vicinity, do ~1 m), <strong>LF 125 kHz</strong> (přístupové systémy), <strong>UHF</strong> (logistika).',
            '<strong>Hybridní</strong> — v kartě jsou <em>dva nezávislé čipy</em>, jeden kontaktní a jeden bezkontaktní (typicky pro různé aplikace).',
            '<strong>Duální (dual-interface)</strong> — <em>jeden čip</em> se dvěma rozhraními (kontaktním i bezkontaktním); sdílí stav, soubory i klíče. Dnes nejběžnější u platebních karet.',
          ],
        },
        {
          kind: 'h3',
          id: 'sec-7-9-4',
          number: '7.9.4',
          title: 'Vnitřní složení čipové karty',
        },
        {
          kind: 'p',
          html: 'Procesorová čipová karta je miniaturní počítač na jednom čipu (typicky < 25 mm$^2$). Hlavní komponenty:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>CPU</strong> — řídicí mikroprocesor (8/16/32 bit), vykonává operační systém a aplikace.',
            '<strong>ROM</strong> — neměnná maskovaná paměť obsahující operační systém karty (COS), případně knihovny.',
            '<strong>EEPROM / Flash</strong> — perzistentní přepisovatelná paměť pro soubory (ISO 7816-4: MF/DF/EF), uživatelská data, klíče, PIN, aplikace (applety u Java Card).',
            '<strong>RAM</strong> — operační paměť pro mezivýsledky a relační (session) klíče; po odpojení napájení se vymaže.',
            '<strong>Kryptografický koprocesor</strong> — akcelerace symetrických (DES/3DES, AES) i asymetrických operací (RSA, ECC); bez něj by RSA na malém CPU trvala neúnosně dlouho.',
            '<strong>Hardwarový generátor náhodných čísel (TRNG)</strong> — zdroj entropie pro klíče, nonce a challenge.',
            '<strong>I/O rozhraní</strong> — UART pro ISO 7816, případně RF front-end pro ISO 14443.',
            '<strong>Senzory a ochrany</strong> — proti napěťovým, teplotním a frekvenčním útokům, stínění proti sondování, detekce světla po odhalení čipu.',
          ],
        },
        {
          kind: 'h3',
          id: 'sec-7-9-5',
          number: '7.9.5',
          title: 'Zabezpečení čipové karty — symetrická a asymetrická kryptografie, odvozování klíče',
        },
        {
          kind: 'p',
          html: '<strong>Symetrická kryptografie</strong> (3DES, AES) — karta a vydavatel (resp. terminál) sdílí tajný klíč. Karta jej drží v EEPROM a používá ho pro vzájemnou autentizaci (challenge-response: terminál pošle náhodnou výzvu $r$, karta vrátí $E_k(r)$), případně pro ověření PINu nebo MAC zpráv. Výhoda: rychlost a malé nároky. Nevýhoda: každá strana musí klíč znát — jeho distribuce je problém.',
        },
        {
          kind: 'p',
          html: '<strong>Odvozování klíče (diverzifikace)</strong> řeší škálovatelnost. Vydavatel má jediný <strong>master key</strong> $MK$. Pro každou kartu se odvodí individuální klíč na základě <em>diverzifikačních dat</em> (sériové číslo karty, AID aplikace) pomocí jednosměrné funkce (HMAC, CMAC, 3DES v režimu KDF):',
        },
        {
          kind: 'math',
          tex: 'k_{\\text{karta}} = \\mathrm{KDF}(MK,\\; \\text{ID}_{\\text{karta}}) = E_{MK}(\\text{ID}_{\\text{karta}})',
        },
        {
          kind: 'p',
          html: 'Terminál (nebo HSM vydavatele) si odvozený klíč spočítá pokaždé znovu z $MK$ a ID karty; karta jej má uložený trvale. <strong>Kompromitace jedné karty</strong> prozradí pouze její odvozený klíč — $MK$ ani klíče ostatních karet zůstávají v bezpečí, protože $\\mathrm{KDF}$ je jednosměrná.',
        },
        {
          kind: 'p',
          html: '<strong>Asymetrická kryptografie</strong> (RSA, ECDSA) — karta si přímo na čipu vygeneruje <strong>pár klíčů</strong> $(sk, pk)$ pomocí TRNG. Soukromý klíč $sk$ <em>nikdy</em> neopustí kartu (provádí se s ním podpis/dešifrování přímo v kryptokoprocesoru), veřejný $pk$ se exportuje a obvykle podepíše certifikační autoritou (PKI, řetěz důvěry). Použití: digitální podpis (eObčanka, datová schránka), TLS klientská autentizace, FIDO2 (per-RP pár klíčů). Distribuce klíčů je triviální (sdílí se jen veřejné klíče), ale operace jsou pomalejší a paměťově náročnější než symetrické.',
        },
        {
          kind: 'h3',
          id: 'sec-7-9-6',
          number: '7.9.6',
          title: 'Zabezpečení komunikace — Secure Messaging (princip)',
        },
        {
          kind: 'p',
          html: 'APDU mezi terminálem a kartou se přenáší po snadno odposlechnutelné lince (USB, RF), proto je třeba je kryptograficky chránit. Tomu se říká <strong>Secure Messaging (SM)</strong> a má dvě nezávislé složky:',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Autentizace zprávy (integrita + autentičnost)</strong> — ke každé APDU se připojí <strong>MAC</strong> (např. CMAC s AES, dříve Retail-MAC s 3DES) spočtený nad hlavičkou i tělem. Příjemce MAC přepočítá a porovná; jakákoli změna v přenosu nebo vložení cizí zprávy se odhalí. MAC se počítá s <em>relačním klíčem</em> $k_{\\text{MAC}}$ a obvykle zahrnuje rostoucí čítač zpráv, čímž se brání i replay útokům.',
            '<strong>Šifrování (důvěrnost)</strong> — datové pole APDU se zašifruje symetrickou šifrou (3DES/AES v CBC) relačním klíčem $k_{\\text{ENC}}$. Hlavička APDU obvykle zůstává v plaintextu (kvůli směrování), zašifrovaná data se zabalí do TLV struktur.',
          ],
        },
        {
          kind: 'p',
          html: '<strong>Princip ustavení relačních klíčů.</strong> Před zahájením chráněné komunikace proběhne <em>vzájemná autentizace</em> challenge-response: terminál pošle náhodnou výzvu $r_T$, karta vrátí $r_C$ a oba ji ověří pomocí společného (typicky diverzifikovaného) klíče. Z výzev $r_T, r_C$ se pak deterministicky odvodí dvojice relačních klíčů $k_{\\text{ENC}}, k_{\\text{MAC}}$ (KDF), které platí jen pro jednu relaci. Stejnou logiku používá EMV i biometrický pas (BAC, PACE).',
        },
        {
          kind: 'p',
          html: 'V praxi se nasazují tři úrovně SM: bez ochrany; pouze MAC (integrita, ale data jsou čitelná); MAC + šifrování (plná ochrana). Pro citlivé operace (změna PINu, klíčový materiál) se vždy používá nejvyšší úroveň.',
        },
      ],
    },
  ],
}
