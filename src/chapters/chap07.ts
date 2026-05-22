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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '7.5',
          title: 'FIDO2 — autentizace (assertion)',
          html: 'RP pošle challenge a seznam credential ID. Authenticator vybere odpovídající credential, podepíše challenge + metadata (sign counter) soukromým klíčem. RP ověří podpis veřejným klíčem z registrace.',
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
  ],
}
