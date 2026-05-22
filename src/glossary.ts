// Glossary of terms used throughout the skripta. Each entry registers a
// canonical display term plus optional aliases (Czech declensions, English
// variants). The MathHTML renderer scans text nodes for any of these tokens
// and wraps them in a tooltip <span> so the reader can hover for an inline
// explanation.

export type GlossaryEntry = {
  term: string
  aliases?: string[]
  definition: string // plain text; no math / no HTML
  // Plain-Czech follow-up: "what it does + why it exists", aimed at readers
  // overwhelmed by the symbol-heavy definition. Rendered under definition.
  plain: string
  category: string
}

export const glossary: GlossaryEntry[] = [
  // --- Základní pojmy ---------------------------------------------------
  {
    term: 'Kryptologie',
    aliases: ['kryptologie', 'kryptologii', 'kryptologií'],
    category: 'Základní pojmy',
    definition:
      'Věda o tvorbě a luštění šifer. Zastřešuje kryptografii (tvorba) a kryptoanalýzu (luštění).',
    plain:
      'Zastřešující obor pro vše kolem šifer — jak je vyrábět i jak je luštit. Pojem existuje proto, aby pojmenoval celé pole, ne jen jednu jeho stranu.',
  },
  {
    term: 'Kryptografie',
    aliases: ['kryptografie', 'kryptografii', 'kryptografií'],
    category: 'Základní pojmy',
    definition: 'Obor zabývající se konstrukcí šifer a kryptografických protokolů.',
    plain:
      'Praktická stavba šifer a bezpečnostních protokolů. Cílem je navrhnout systémy, které jdou bezpečně použít v reálném světě.',
  },
  {
    term: 'Kryptoanalýza',
    aliases: ['kryptoanalýzy', 'kryptoanalýze', 'kryptoanalýzou'],
    category: 'Základní pojmy',
    definition:
      'Luštění šifer — identifikace systému, prolomení způsobu šifrování a nalezení klíče.',
    plain:
      'Hledání slabin v šifrách a způsobů, jak je prolomit. Slouží jak útočníkům, tak obráncům, kteří potřebují vědět, zda jejich šifra obstojí.',
  },
  {
    term: 'Otevřený text',
    aliases: ['otevřeného textu', 'otevřeném textu', 'OT'],
    category: 'Základní pojmy',
    definition: 'Vstupní zpráva před zašifrováním. Často značeno zkratkou OT.',
    plain:
      'Původní čitelná zpráva, kterou chcete ochránit. Pojem existuje, aby bylo jasné, o jakou data v procesu šifrování jde.',
  },
  {
    term: 'Šifrový text',
    aliases: ['šifrového textu', 'šifrovém textu', 'ŠT'],
    category: 'Základní pojmy',
    definition: 'Výsledek šifrování otevřeného textu. Často značeno ŠT.',
    plain:
      'Zašifrovaná podoba zprávy, jak ji vidí případný odposlouchávač. Pojem odděluje "co se posílá po lince" od "co se ve skutečnosti říká".',
  },
  {
    term: 'Šifrování',
    aliases: ['šifrování', 'šifrováním'],
    category: 'Základní pojmy',
    definition: 'Proces převádějící otevřený text na šifrový pomocí klíče.',
    plain:
      'Proces, který z čitelné zprávy a klíče udělá nečitelný šifrový text. Slouží k tomu, aby zprávu nemohl číst nikdo bez klíče.',
  },
  {
    term: 'Dešifrování',
    aliases: ['dešifrování', 'dešifrováním'],
    category: 'Základní pojmy',
    definition: 'Inverzní proces k šifrování — obnova otevřeného textu pomocí klíče.',
    plain:
      'Opačný proces k šifrování — pomocí klíče vrátí šifrový text zpět na čitelný. Tohle dělá legitimní příjemce.',
  },
  {
    term: 'Steganografie',
    aliases: ['steganografie', 'steganografii', 'steganografií'],
    category: 'Základní pojmy',
    definition:
      'Ukrytí samotné existence zprávy (např. v obrázku či textu). Doplněk šifrování.',
    plain:
      'Skrývá samotnou existenci zprávy (např. v obrázku), místo aby ji jen šifrovala. Hodí se tam, kde už pouhý fakt komunikace by byl problém.',
  },
  {
    term: 'Monogram',
    category: 'Pojmy o textu',
    definition: 'Jedno písmeno.',
    plain:
      'Jedno písmeno jako jednotka pro statistiku jazyka. Slouží k tomu, abychom mohli říct, jak často se která písmena vyskytují.',
  },
  {
    term: 'Bigram',
    category: 'Pojmy o textu',
    definition: 'Dvojice sousedních písmen.',
    plain:
      'Dvojice sousedních písmen. Frekvenční analýza s bigramy lépe odhalí strukturu textu než s jednotlivými písmeny.',
  },
  {
    term: 'Trigram',
    category: 'Pojmy o textu',
    definition: 'Trojice sousedních písmen.',
    plain:
      'Trojice sousedních písmen. Nesou ještě víc informace o jazyku — typické trojice jako "ist" nebo "the" prozradí angličtinu.',
  },
  {
    term: 'Polygram',
    category: 'Pojmy o textu',
    definition: 'Obecná posloupnost znaků (n-gram).',
    plain:
      'Obecná skupina sousedních písmen libovolné délky. Pojem zastřešuje vše od monogramu nahoru.',
  },
  {
    term: 'Frekvenční analýza',
    aliases: ['frekvenční analýzy', 'frekvenční analýze', 'frekvenční analýzou'],
    category: 'Kryptoanalýza',
    definition:
      'Útok porovnávající četnost znaků v šifrovém textu s referenční četností jazyka — slabina monoalfabetických šifer.',
    plain:
      'Útok, který porovná, jak často se znaky vyskytují v šifrovém textu a v daném jazyce. Funguje proto, že každý jazyk má charakteristické rozložení písmen.',
  },

  // --- Modely útočníka --------------------------------------------------
  {
    term: 'COA',
    aliases: ['ciphertext-only'],
    category: 'Modely útočníka',
    definition: 'Ciphertext-only attack — útočník zná pouze šifrový text.',
    plain:
      'Útočník vidí jen šifrový text — nic víc. Nejslabší pozice útočníka, kterou by šifra měla bezpečně přežít.',
  },
  {
    term: 'KPA',
    aliases: ['known-plaintext'],
    category: 'Modely útočníka',
    definition: 'Known-plaintext attack — útočník zná dvojice (OT, ŠT).',
    plain:
      'Útočník zná páry "co se šifrovalo → jak to dopadlo". V reálu nastává, když útočník zná části obsahu (např. hlavičky e-mailů).',
  },
  {
    term: 'CPA',
    aliases: ['chosen-plaintext'],
    category: 'Modely útočníka',
    definition: 'Chosen-plaintext attack — útočník si může zvolit OT k zašifrování.',
    plain:
      'Útočník si sám vybere otevřený text a nechá si ho zašifrovat. Modeluje situaci, kdy útočník dokáže ovlivnit, co druhá strana šifruje.',
  },
  {
    term: 'CCA',
    aliases: ['chosen-ciphertext'],
    category: 'Modely útočníka',
    definition: 'Chosen-ciphertext attack — útočník si může zvolit ŠT k dešifrování.',
    plain:
      'Útočník si vybere šifrový text a nechá si ho dešifrovat. Modeluje útoky proti systémům, které automaticky zpracovávají příchozí zašifrovaná data.',
  },
  {
    term: 'Brute force',
    aliases: ['hrubá síla', 'hrubou silou'],
    category: 'Modely útočníka',
    definition:
      'Útok hrubou silou — postupné zkoušení všech možných klíčů. Účinný proti krátkým klíčům.',
    plain:
      'Zkoušení všech možných klíčů, dokud jeden nesedne. Nejhloupější útok — slouží hlavně jako měřítko, jak dlouhý musí klíč být, aby tahle taktika selhala.',
  },
  {
    term: 'MITM',
    aliases: ['man-in-the-middle', 'Man-in-the-middle'],
    category: 'Modely útočníka',
    definition:
      'Útok „prostředníka“ — útočník se vetře mezi dvě komunikující strany a může číst i modifikovat zprávy.',
    plain:
      'Útočník se vetře mezi dvě strany a tváří se jako každá z nich vůči té druhé. Nebezpečné hlavně při výměně klíčů — útočník může klíč podvrhnout.',
  },
  {
    term: 'Replay útok',
    aliases: ['replay útoku', 'replay útoky', 'replay attack'],
    category: 'Modely útočníka',
    definition: 'Opětovné zaslání dříve zachycené platné zprávy. Bráníme se nonci / timestampy.',
    plain:
      'Útočník zachytí platnou zašifrovanou zprávu a pošle ji znovu. Funguje proti systémům, které nepoznají, že zprávu už jednou zpracovaly.',
  },

  // --- Klasické šifry ---------------------------------------------------
  {
    term: 'Substituční šifra',
    aliases: ['substituční šifry', 'substituce', 'substituční'],
    category: 'Klasické šifry',
    definition: 'Šifra nahrazující znaky OT jinými znaky. Identita písmen se mění, pořadí ne.',
    plain:
      'Každé písmeno se nahradí jiným podle nějakého pravidla. Pořadí znaků zůstává — proto frekvenční analýza obvykle stačí na prolomení.',
  },
  {
    term: 'Transpoziční šifra',
    aliases: ['transpoziční šifry', 'transpozice'],
    category: 'Klasické šifry',
    definition:
      'Šifra permutující pořadí znaků OT. Identita písmen zůstává, mění se pozice (difúze).',
    plain:
      'Písmena se zamíchají, ale neztratí svoji identitu. Frekvence písmen v textu zůstane stejná — což transpoziční povahu šifry rovnou prozradí.',
  },
  {
    term: 'Monoalfabetická',
    aliases: ['monoalfabetické', 'monoalfabetické substituce'],
    category: 'Klasické šifry',
    definition: 'Substituční šifra, v níž dané písmeno OT je vždy nahrazeno týmž písmenem ŠT.',
    plain:
      'Každé písmeno se nahradí vždy stejným jiným písmenem. Snadno se rozluští frekvenční analýzou — vzor se v celém textu opakuje.',
  },
  {
    term: 'Polyalfabetická',
    aliases: ['polyalfabetické', 'polyalfabetickou'],
    category: 'Klasické šifry',
    definition: 'Šifra s více substitučními abecedami střídanými dle klíče (např. Vigenère).',
    plain:
      'Pro různé pozice v textu se používá různá náhradní abeceda. Tím se rozbije jednoduchá frekvenční analýza — "e" se na různých místech šifruje různě.',
  },
  {
    term: 'Polygrafická',
    aliases: ['polygrafické'],
    category: 'Klasické šifry',
    definition: 'Bloková šifra zpracovávající celé skupiny znaků najednou (např. Hill).',
    plain:
      'Šifruje celé skupiny písmen najednou (např. dvojice). Skrývá víc — i bigramy se promíchají, takže statistika dvojic už nepomůže.',
  },
  {
    term: 'Caesarova šifra',
    aliases: ['Caesarovy šifry', 'Caesarova', 'Caesar'],
    category: 'Klasické šifry',
    definition: 'Posuvná substituce: c = |p + 3|₂₆. Speciální případ šifry s posunem.',
    plain:
      'Posun každého písmene o tři místa v abecedě. Historická šifra Caesara — dnes hračka, prolomí se tužkou.',
  },
  {
    term: 'Afinní šifra',
    aliases: ['afinní šifry', 'afinní transformace'],
    category: 'Klasické šifry',
    definition: 'Šifrování c = |a·p + b|₂₆ s gcd(a, 26) = 1. Celkem 312 různých klíčů.',
    plain:
      'Šifrování pomocí dvou čísel (násobení a posunu) v modulární aritmetice. Trochu obecnější než Caesarova, ale pořád jen 312 klíčů — snadno prolomitelná.',
  },
  {
    term: 'Hillova šifra',
    aliases: ['Hillovy šifry', 'Hillova'],
    category: 'Klasické šifry',
    definition:
      'Bloková lineární šifra c = A·p mod 26 nad maticí A. Zranitelná známým-OT útokem.',
    plain:
      'Lineární maticová šifra šifrující bloky písmen najednou. Inovativní v 20. letech, dnes slabá kvůli své lineární struktuře.',
  },
  {
    term: 'Vigenèrova šifra',
    aliases: ['Vigenèrovy šifry', 'Vigenère', 'Vigenèrova'],
    category: 'Klasické šifry',
    definition: 'Polyalfabetická šifra: posloupnost Caesarových posunů řízená heslem délky n.',
    plain:
      'Posun každého písmene podle hesla, které se cyklicky opakuje. Dlouho považována za "nerozluštitelnou", než Kasiski přišel na to, jak najít délku hesla.',
  },
  {
    term: 'Vernamova šifra',
    aliases: ['Vernamovy šifry', 'Vernamova'],
    category: 'Klasické šifry',
    definition:
      'One-time pad. Heslo je zcela náhodné a stejně dlouhé jako OT, použito právě jednou. Absolutně bezpečná.',
    plain:
      'Šifrování s heslem stejně dlouhým jako zpráva, použitým jen jednou. Jediná šifra, kterou nelze prolomit ani s nekonečným výpočetním výkonem.',
  },
  {
    term: 'One-time pad',
    aliases: ['OTP'],
    category: 'Klasické šifry',
    definition:
      'Jednorázové heslo (Vernamova šifra). Náhodné, stejně dlouhé jako OT, jednou použité.',
    plain:
      'Jiný název pro Vernamovu šifru — jednorázové heslo. Bezpečné jen pokud opravdu vygenerujete náhodné heslo a nepoužijete ho dvakrát.',
  },

  // --- Symetrické šifry -------------------------------------------------
  {
    term: 'Symetrická šifra',
    aliases: ['symetrická', 'symetrické', 'symetrické šifry'],
    category: 'Symetrická kryptografie',
    definition: 'Šifra, kde odesílatel i příjemce sdílí týž tajný klíč.',
    plain:
      'Obě strany sdílí stejný tajný klíč. Rychlá, ale problém je předat klíč protistraně bezpečně.',
  },
  {
    term: 'Bloková šifra',
    aliases: ['blokové šifry', 'bloková', 'blokové'],
    category: 'Symetrická kryptografie',
    definition:
      'Šifra zpracovávající bloky pevné délky toutéž transformací Eₖ (dnes obvykle 128 b).',
    plain:
      'Šifruje data po blocích pevné délky (typicky 128 bitů). Hodí se na šifrování souborů nebo disků.',
  },
  {
    term: 'Proudová šifra',
    aliases: ['proudové šifry', 'proudová', 'proudové'],
    category: 'Symetrická kryptografie',
    definition:
      'Šifra, která z klíče generuje posloupnost (heslo) a každý znak OT šifruje jinou transformací — typicky XOR.',
    plain:
      'Z klíče vyrobí proud "hesla" stejně dlouhý jako data a XOR-uje s nimi. Rychlá pro proudy dat (telefonní hovor, video).',
  },
  {
    term: 'IV',
    aliases: ['inicializační vektor', 'inicializačního vektoru', 'inicializačním vektorem'],
    category: 'Symetrická kryptografie',
    definition:
      'Inicializační vektor — náhodná hodnota nastavující šifru do počátečního stavu. Posílá se otevřeně.',
    plain:
      'Náhodná hodnota, která zaručí, že dvě stejné zprávy zašifrované stejným klíčem vypadají jinak. Posílá se otevřeně spolu se šifrou.',
  },
  {
    term: 'Nonce',
    aliases: ['nonci', 'nonce'],
    category: 'Symetrická kryptografie',
    definition: '„Number used once“ — jednorázová hodnota proti replay útokům a opakování keystreamu.',
    plain:
      'Hodnota použitá jednou — zabraňuje, aby se stejný stav šifry opakoval. Bez ní by proudová šifra mohla nasvítit stejný keystream na dvě různé zprávy.',
  },
  {
    term: 'Feistelův kryptosystém',
    aliases: ['Feistelova síť', 'Feistelovy sítě', 'Feistel', 'Feistelovského'],
    category: 'Bloková kryptografie',
    definition:
      'Konstrukce blokové šifry: data se rozdělí na L a R, v každé rundě L_{i+1} = R_i, R_{i+1} = L_i ⊕ f(R_i, k_i). Dešifrování stejně, jen s opačným pořadím klíčů.',
    plain:
      'Konstrukce blokových šifer, kde se v každém kole zamíchá jen polovina dat. Krásné je, že dešifrování používá stejný kód jako šifrování, jen s opačným pořadím klíčů.',
  },
  {
    term: 'S-box',
    aliases: ['S-boxů', 'S-boxy', 'S-boxech', 'SubBytes'],
    category: 'Bloková kryptografie',
    definition:
      'Substituční tabulka — jediný nelineární prvek blokových šifer (DES, AES). Poskytuje konfúzi.',
    plain:
      'Substituční tabulka, která dělá z blokové šifry nelineární. Bez S-boxu by se šifra prolomila lineární algebrou.',
  },
  {
    term: 'DES',
    category: 'Bloková kryptografie',
    definition:
      'Data Encryption Standard (FIPS 46-3, 1977). Feistelova šifra, 64b blok, klíč jen 56 b — dnes prolomený hrubou silou.',
    plain:
      'Stará americká bloková šifra ze 70. let s 56bitovým klíčem. Dnes prolomitelná za pár hodin — slouží už jen jako učebnicový příklad.',
  },
  {
    term: '3DES',
    aliases: ['Triple DES', '3DES-EDE'],
    category: 'Bloková kryptografie',
    definition:
      'Triple DES (EDE) — trojnásobné použití DES s 2 nebo 3 klíči. Posiluje DES proti hrubé síle.',
    plain:
      'DES aplikovaný třikrát za sebou s několika klíči. Náhradník DES, než byl hotový AES — dnes pomalý a postupně se vyřazuje.',
  },
  {
    term: 'AES',
    aliases: ['Rijndael'],
    category: 'Bloková kryptografie',
    definition:
      'Advanced Encryption Standard (FIPS 197). Není Feistel; 128b blok, klíč 128/192/256 b. Vítěz soutěže NIST (Daemen, Rijmen).',
    plain:
      'Současný standard symetrického šifrování — všude od HTTPS po šifrování disků. Vznikl v roce 2001 jako vítěz veřejné soutěže NIST.',
  },
  {
    term: 'MixColumns',
    category: 'Bloková kryptografie',
    definition:
      'Krok AES: lineární substituce sloupců násobením maticí v GF(2⁸). Poskytuje difúzi.',
    plain:
      'Krok AES, který "rozmaže" hodnoty mezi sloupci stavu. Stará se o difúzi — drobná změna na vstupu ovlivní velkou část výstupu.',
  },
  {
    term: 'ShiftRows',
    category: 'Bloková kryptografie',
    definition: 'Krok AES: cyklický posun řádků matice stavu o 0/1/2/3 bajty doleva.',
    plain:
      'Krok AES, který přesune bajty mezi řádky stavu. Spolu s MixColumns rozprostírá změny po celém bloku.',
  },
  {
    term: 'AddRoundKey',
    category: 'Bloková kryptografie',
    definition: 'Krok AES: XOR stavu s rundovním klíčem (128 b).',
    plain:
      'Krok AES, který XOR-uje stav s aktuálním rundovním klíčem. Tady do šifrování vstupuje samotný klíč.',
  },
  {
    term: 'RC4',
    category: 'Proudové šifry',
    definition:
      'Proudová šifra (Rivest, 1987) s tajnou permutací 256 bajtů. Historicky používaná v SSL, dnes prolomená.',
    plain:
      'Stará proudová šifra, kdysi v SSL a WEP. Dnes prolomená kvůli slabinám — nikdy nepoužívat.',
  },
  {
    term: 'Salsa20',
    category: 'Proudové šifry',
    definition:
      'Moderní proudová šifra (Bernstein, 2005). 20 rund ARX operací nad maticí 4×4 z 32b slov.',
    plain:
      'Moderní proudová šifra zaměřená na rychlost na běžných procesorech. Předchůdce ChaCha, dodnes bezpečná.',
  },
  {
    term: 'ChaCha',
    aliases: ['ChaCha20'],
    category: 'Proudové šifry',
    definition:
      'Vylepšení Salsa20 (Bernstein, 2008) s lepší difúzí na rundu. Základ ChaCha20-Poly1305.',
    plain:
      'Vylepšení Salsa20 s lepším mícháním v každém kole. Používá ji Google v TLS jako rychlou alternativu k AES tam, kde není hardwarová akcelerace.',
  },
  {
    term: 'ChaCha20-Poly1305',
    category: 'Proudové šifry',
    definition: 'AEAD šifra používaná v QUIC, TLS a OpenSSH (ChaCha20 + Poly1305 MAC).',
    plain:
      'ChaCha pro šifrování plus Poly1305 pro autentizaci v jednom balíku. Standard v moderních protokolech jako QUIC a OpenSSH.',
  },
  {
    term: 'A5/1',
    category: 'Proudové šifry',
    definition: 'Proudová šifra pro GSM (1987). 3 LFSR délek 19/22/23 s nelineárním taktováním.',
    plain:
      'Proudová šifra v GSM hovorech (2G mobil). Je známo, že je prolomitelná v reálném čase — proto se dnes nahrazuje.',
  },
  {
    term: 'LFSR',
    category: 'Proudové šifry',
    definition:
      'Linear-feedback shift register — posuvný registr s lineární zpětnou vazbou, stavební blok proudových šifer.',
    plain:
      'Posuvný registr generující pseudonáhodnou posloupnost bitů. Stavební kámen mnoha proudových šifer kvůli jeho hardwarové jednoduchosti.',
  },

  // --- Operační módy ----------------------------------------------------
  {
    term: 'ECB',
    aliases: ['Electronic Codebook'],
    category: 'Operační módy',
    definition:
      'Electronic Codebook — každý blok šifrován nezávisle. Stejné bloky OT dávají stejné ŠT. Neskrývá strukturu.',
    plain:
      'Každý blok se šifruje nezávisle, stejně. Problém je, že opakované úseky v datech (např. v obrázku) zůstanou viditelné — proto se nepoužívá.',
  },
  {
    term: 'CBC',
    aliases: ['Cipher Block Chaining'],
    category: 'Operační módy',
    definition:
      'Cipher Block Chaining — každý blok OT je XORován s předchozím ŠT a teprve pak šifrován. Vyžaduje IV.',
    plain:
      'Každý blok se před šifrováním XOR-uje s předchozím šifrovým blokem. Rozbíjí opakování, ale šifrovat se musí postupně — nelze paralelizovat.',
  },
  {
    term: 'CFB',
    aliases: ['Cipher Feedback'],
    category: 'Operační módy',
    definition:
      'Cipher Feedback — převádí blokovou šifru na samosynchronizující proudovou. ŠTᵢ = OTᵢ ⊕ Eₖ(ŠTᵢ₋₁).',
    plain:
      'Předchozí šifrový blok se zašifruje a XOR-uje s otevřeným textem. Dělá z blokové šifry samosynchronizující proudovou.',
  },
  {
    term: 'OFB',
    aliases: ['Output Feedback'],
    category: 'Operační módy',
    definition:
      'Output Feedback — synchronní proudový režim. Heslo H := Eₖ(H), ŠTᵢ = OTᵢ ⊕ H.',
    plain:
      'Šifra generuje proud hesla nezávisle na datech a XOR-uje s nimi. Chyba v jednom bitu šifry zkazí jen jeden bit otevřeného textu.',
  },
  {
    term: 'CTR',
    aliases: ['Counter mode'],
    category: 'Operační módy',
    definition:
      'Counter — heslo Hᵢ = Eₖ(IV + i). Lze počítat paralelně, čítač se v rámci klíče nesmí opakovat.',
    plain:
      'Šifruje se počítadlo (1, 2, 3, …) a XOR-uje s daty. Lze paralelizovat — nejmodernější mód.',
  },
  {
    term: 'CBC-MAC',
    category: 'Operační módy',
    definition:
      'Autentizační kód: zpráva se šifruje v CBC s nulovým IV a vrací se poslední blok (Eₖ₂ z něj).',
    plain:
      'Vytvoří autentizační kód tím, že zprávu prožene CBC a vezme poslední blok. Zaručí, že zpráva nebyla po cestě pozměněna.',
  },

  // --- Hašovací funkce --------------------------------------------------
  {
    term: 'Hašovací funkce',
    aliases: ['hašovací funkce', 'hašovací funkci', 'hašovací funkcí', 'hašování', 'hašuje'],
    category: 'Hašovací funkce',
    definition:
      'Funkce h: X → {0,1}ⁿ, jednosměrná a bezkolizní. Mapuje libovolně dlouhý vstup na haš pevné délky.',
    plain:
      'Vyrobí z libovolně dlouhých dat krátký "otisk" pevné délky. Slouží k ověření, že se data nezměnila — i drobná změna mění celý haš.',
  },
  {
    term: 'Haš',
    aliases: ['haše', 'haš'],
    category: 'Hašovací funkce',
    definition: 'Výstup hašovací funkce — řetězec pevné délky (typicky 128–512 bitů).',
    plain:
      'Krátký otisk dat vyrobený hašovací funkcí. Posílá se třeba spolu se souborem, aby si příjemce ověřil, že soubor přišel nepoškozen.',
  },
  {
    term: 'Bezkoliznost',
    aliases: ['bezkolizní', 'bezkolizní'],
    category: 'Hašovací funkce',
    definition:
      'Vlastnost hašovací funkce: výpočetně nemožné najít dvě různé zprávy se stejným hašem.',
    plain:
      'Vlastnost hašovací funkce — nikdo nedokáže najít dva soubory se stejným hašem. Bez toho by haš nebyl důkazem nezměněnosti.',
  },
  {
    term: 'Kolize 1. řádu',
    aliases: ['kolizi 1. řádu', 'collision resistance'],
    category: 'Hašovací funkce',
    definition:
      'Nalezení libovolných dvou zpráv M ≠ M′ s h(M) = h(M′). Pro náhodný haš složitost ≈ 2^(n/2).',
    plain:
      'Útočník najde libovolné dvě zprávy se stejným hašem. Tahle slabina už zabila SHA-1.',
  },
  {
    term: 'Kolize 2. řádu',
    aliases: ['kolizi 2. řádu', '2nd preimage'],
    category: 'Hašovací funkce',
    definition: 'Pro daný vzor x najít y ≠ x s h(x) = h(y). Složitost ≈ 2ⁿ.',
    plain:
      'Útočník dostane konkrétní zprávu a najde k ní jinou se stejným hašem. Mnohem silnější útok — kdo by to uměl, mohl by podvrhnout konkrétní soubor.',
  },
  {
    term: 'Lavinový efekt',
    aliases: ['lavinového efektu', 'lavinovým efektem'],
    category: 'Hašovací funkce',
    definition:
      'Vlastnost dobré hašovací nebo blokové šifry: změna 1 bitu vstupu mění zhruba polovinu výstupních bitů.',
    plain:
      'Změna jednoho bitu vstupu změní zhruba polovinu bitů výstupu. Podle toho se pozná dobrá hašovací funkce nebo šifra.',
  },
  {
    term: 'Narozeninový paradox',
    aliases: ['narozeninového paradoxu', 'narozeninovým paradoxem'],
    category: 'Hašovací funkce',
    definition:
      'Při √n výběrech z n hodnot je pravděpodobnost nalezení kolize ≈ 50 %. Limituje bezpečnost hašů na n/2 bitů.',
    plain:
      'U výběru z N hodnot se kolize objeví už po zhruba odmocnině z N pokusů. Proto haš o n bitech reálně chrání jen na n/2 bitů bezpečnosti.',
  },
  {
    term: 'Damgård-Merklova konstrukce',
    aliases: ['Damgård-Merkle', 'Damgård–Merklova', 'Damgård-Merklovo zesílení'],
    category: 'Hašovací funkce',
    definition:
      'Iterativní konstrukce hašovací funkce: kontext H₀ = IV, Hᵢ = f(Hᵢ₋₁, Mᵢ). Bezkolizní f → bezkolizní haš.',
    plain:
      'Postup, jak z malé kompresní funkce postavit haš pro libovolně dlouhý vstup. Použito v MD5, SHA-1, SHA-2.',
  },
  {
    term: 'Davies-Meyerova konstrukce',
    aliases: ['Davies-Meyer'],
    category: 'Hašovací funkce',
    definition: 'Kompresní funkce z blokové šifry: Hᵢ = E_{Mᵢ}(Hᵢ₋₁) ⊕ Hᵢ₋₁.',
    plain:
      'Jak z blokové šifry vyrobit kompresní funkci pro haš. Recept používaný uvnitř SHA-2.',
  },
  {
    term: 'SHA-1',
    category: 'Hašovací funkce',
    definition: '160bitový haš (FIPS 180-1, 1995). Kolize nalezena 2017 — dnes nepoužívat.',
    plain:
      'Stará 160bitová hašovací funkce. V roce 2017 se podařilo najít kolizi — od té doby je oficiálně mrtvá.',
  },
  {
    term: 'SHA-2',
    aliases: ['SHA-256', 'SHA-384', 'SHA-512'],
    category: 'Hašovací funkce',
    definition: 'Rodina hašovacích funkcí (FIPS 180-2): SHA-256, SHA-384, SHA-512.',
    plain:
      'Rodina moderních hašovacích funkcí (SHA-256, SHA-512). Dnes standard pro digitální podpisy, blockchain i certifikáty.',
  },
  {
    term: 'HMAC',
    category: 'Hašovací funkce',
    definition:
      'Klíčovaný autentizační kód postavený nad hašovací funkcí: HMACₖ(M) = h((K⁺⊕opad) ‖ h((K⁺⊕ipad) ‖ M)).',
    plain:
      'Hašovací funkce zkombinovaná s tajným klíčem — vznikne autentizační kód. Používá se třeba v HTTPS k ověření zpráv.',
  },
  {
    term: 'MAC',
    aliases: ['MACu', 'MACem'],
    category: 'Hašovací funkce',
    definition:
      'Message Authentication Code — symetrický autentizační kód. Zaručuje integritu a autentizaci původu (nikoli nepopiratelnost).',
    plain:
      'Krátký kód zaručující, že zprávu poslal ten, kdo zná klíč. Liší se od podpisu tím, že tentýž klíč mají obě strany — proto nemá nepopiratelnost.',
  },
  {
    term: 'CMAC',
    category: 'Hašovací funkce',
    definition: 'MAC založený na blokové šifře (AES-CMAC); varianta CBC-MAC pro proměnnou délku zprávy.',
    plain:
      'MAC postavený nad blokovou šifrou (typicky AES). Hodí se tam, kde už máte AES a nechcete přidávat zvlášť hašovací funkci.',
  },
  {
    term: 'Sůl',
    aliases: ['salt', 'soli'],
    category: 'Hašovací funkce',
    definition:
      'Náhodná hodnota přidávaná při hašování hesla. Brání slovníkovým útokům a rainbow tabulkám.',
    plain:
      'Náhodná hodnota přimíchaná k heslu před hašováním. Brání útočníkovi předem si připravit tabulku haší známých hesel (tzv. rainbow tabulky).',
  },

  // --- Asymetrická kryptografie -----------------------------------------
  {
    term: 'Asymetrická kryptografie',
    aliases: ['asymetrické', 'asymetrické kryptografie', 'asymetrická'],
    category: 'Asymetrická kryptografie',
    definition:
      'Kryptografie s veřejným klíčem: každý uživatel má pár VK (veřejný) + SK (soukromý). Z VK nelze prakticky spočítat SK.',
    plain:
      'Každý má pár klíčů — veřejný a soukromý. Řeší starý problém symetrické kryptografie: nemusíte se předem osobně potkat, abyste si vyměnili klíč.',
  },
  {
    term: 'Veřejný klíč',
    aliases: ['veřejného klíče', 'veřejným klíčem', 'VK'],
    category: 'Asymetrická kryptografie',
    definition: 'Část páru asymetrického klíče určená ke zveřejnění (šifrování / ověřování podpisu).',
    plain:
      'Klíč určený ke zveřejnění — kdokoli ho může mít. Slouží k zašifrování zprávy pro vás nebo ověření vašeho podpisu.',
  },
  {
    term: 'Soukromý klíč',
    aliases: ['soukromého klíče', 'soukromým klíčem', 'SK'],
    category: 'Asymetrická kryptografie',
    definition: 'Tajná část páru asymetrického klíče (dešifrování / podpis).',
    plain:
      'Tajná polovina páru, kterou znáte jen vy. Slouží k dešifrování zpráv adresovaných vám a k podepisování.',
  },
  {
    term: 'RSA',
    category: 'Asymetrická kryptografie',
    definition:
      'Asymetrický kryptosystém (Rivest, Shamir, Adleman, 1977). Bezpečnost závisí na obtížnosti faktorizace n = pq.',
    plain:
      'Nejstarší prakticky používaný asymetrický systém. Bezpečnost stojí na tom, že je extrémně těžké rozložit velké číslo na prvočísla.',
  },
  {
    term: 'RSA-CRT',
    category: 'Asymetrická kryptografie',
    definition:
      'Urychlené dešifrování RSA pomocí Čínské věty o zbytcích — 4–8× rychlejší než přímý mod n.',
    plain:
      'Trik, jak zrychlit dešifrování RSA — 4 až 8× rychleji. Využívá toho, že soukromá strana zná rozklad modulu na dvě prvočísla.',
  },
  {
    term: 'Diffie-Hellman',
    aliases: ['Diffie–Hellman', 'Diffie-Hellmanova', 'Diffie-Hellmanův protokol', 'D-H'],
    category: 'Asymetrická kryptografie',
    definition:
      'Protokol pro ustavení sdíleného tajemství přes veřejný kanál. Bezpečnost závisí na obtížnosti PDL.',
    plain:
      'Protokol, kterým si dvě strany dohodnou společný klíč po veřejné lince. Bez něj by HTTPS nemohlo začít se šifrovanou komunikací.',
  },
  {
    term: 'ElGamal',
    category: 'Asymetrická kryptografie',
    definition:
      'Asymetrické šifrování i podpis založený na Diffie-Hellmanově problému (potažmo PDL).',
    plain:
      'Asymetrický systém pro šifrování i podpisy, stojící na obtížnosti diskrétního logaritmu. Alternativa k RSA.',
  },
  {
    term: 'DSA',
    aliases: ['DSS'],
    category: 'Asymetrická kryptografie',
    definition:
      'Digital Signature Algorithm — varianta ElGamalu specializovaná pro podpis (Digital Signature Standard).',
    plain:
      'Standard pro digitální podpisy, varianta ElGamala. Specializovaná jen na podpisy — neumí šifrovat.',
  },
  {
    term: 'Pohlig-Hellman',
    aliases: ['Pohlig–Hellman'],
    category: 'Asymetrická kryptografie',
    definition:
      'Exponenciální šifra c = pᵉ mod m. Také algoritmus pro výpočet PDL ve skupinách s hladkým řádem.',
    plain:
      'Algoritmus na řešení diskrétního logaritmu, který využívá rozklad řádu grupy na malé prvočísla. Učí nás, že "hladká" čísla jsou pro Diffie-Hellmana nebezpečná.',
  },
  {
    term: 'Eulerova funkce',
    aliases: ['Eulerovy funkce', 'φ(n)', 'Φ(n)'],
    category: 'Teorie čísel',
    definition: 'φ(n) = počet čísel z {1,…,n} nesoudělných s n. Pro prvočíslo: φ(p) = p − 1.',
    plain:
      'Říká, kolik čísel menších než n je s n nesoudělných. Klíčový vstup do RSA — určuje, jak spočítat dešifrovací klíč z šifrovacího.',
  },
  {
    term: 'Malá Fermatova věta',
    aliases: ['malé Fermatovy věty', 'Fermatova malá věta'],
    category: 'Teorie čísel',
    definition: 'Pro prvočíslo p a a nesoudělné s p platí a^{p−1} ≡ 1 (mod p).',
    plain:
      'Když je p prvočíslo, mocnina a na p-1 modulo p je vždycky 1. Z této věty plynou rychlé testy prvočíselnosti.',
  },
  {
    term: 'Eulerova věta',
    category: 'Teorie čísel',
    definition: 'Pro gcd(a, n) = 1 platí a^{φ(n)} ≡ 1 (mod n). Zobecnění Fermatovy věty.',
    plain:
      'Zobecnění Fermatovy věty pro libovolné n, ne jen prvočísla. Tvoří matematický základ, proč RSA funguje.',
  },
  {
    term: 'Eukleidův algoritmus',
    aliases: ['Eukleidova algoritmu', 'Euklidovým algoritmem', 'Eukleidovým algoritmem'],
    category: 'Teorie čísel',
    definition: 'Rychlý algoritmus výpočtu největšího společného dělitele gcd(a, b).',
    plain:
      'Klasický rychlý postup pro nalezení největšího společného dělitele dvou čísel. Funguje opakovaným dělením se zbytkem.',
  },
  {
    term: 'Rozšířený Eukleidův algoritmus',
    aliases: ['rozšířeným Eukleidovým algoritmem', 'rozšířeným Euklidovým algoritmem'],
    category: 'Teorie čísel',
    definition:
      'Varianta Euklidova alg., která vrátí i koeficienty x, y s ax + by = gcd(a, b). Umožňuje výpočet modulární inverze.',
    plain:
      'Rozšíření Eukleidova algoritmu, které navíc vypočítá modulární inverzi. Bez něj by RSA neuměla spočítat soukromý klíč z veřejného.',
  },
  {
    term: 'Square & Multiply',
    aliases: ['Square &amp; Multiply', 'square-and-multiply'],
    category: 'Algoritmy',
    definition:
      'Algoritmus rychlého modulárního umocňování po bitech exponentu. Složitost O(k³) bitových operací pro k-bitové číslo.',
    plain:
      'Rychlý postup pro umocnění čísla na velký exponent v modulární aritmetice. Bez něj by RSA šifrování bylo nepraktické.',
  },
  {
    term: 'PDL',
    aliases: ['diskrétní logaritmus', 'diskrétního logaritmu', 'problému diskrétního logaritmu'],
    category: 'Teorie čísel',
    definition:
      'Problém diskrétního logaritmu — pro dané b, y v cyklické grupě najít k s b^k = y. Základ Diffie-Hellmana a ElGamalu.',
    plain:
      'Problém diskrétního logaritmu — najít exponent k, když znáte výsledek mocniny. Považuje se za "těžký" problém a stojí na něm Diffie-Hellman i ElGamal.',
  },
  {
    term: 'ECDLP',
    category: 'Eliptické křivky',
    definition:
      'Eliptická varianta PDL: pro P, Q ∈ E najít k s Q = kP. Bezpečnostní základ ECC.',
    plain:
      'Verze diskrétního logaritmu na eliptických křivkách. Ještě těžší problém než klasické PDL — proto stačí kratší klíče.',
  },
  {
    term: 'ECC',
    aliases: ['kryptografie eliptických křivek'],
    category: 'Eliptické křivky',
    definition:
      'Asymetrická kryptografie nad eliptickými křivkami. Bezpečnost srovnatelná s RSA při kratším klíči (256 b ≈ 3072 b RSA).',
    plain:
      'Asymetrická kryptografie na eliptických křivkách. Dosáhne stejné bezpečnosti jako RSA s mnohem kratším klíčem (256 b ECC ≈ 3072 b RSA).',
  },
  {
    term: 'Eliptická křivka',
    aliases: ['eliptické křivky', 'eliptickou křivku'],
    category: 'Eliptické křivky',
    definition:
      'Množina bodů (x, y) splňujících y² = x³ + ax + b nad daným tělesem, doplněná o bod v nekonečnu O.',
    plain:
      'Speciální křivka v rovině, na které lze definovat "sčítání bodů". Tato algebraická struktura tvoří základ ECC.',
  },
  {
    term: 'Galoisovo těleso',
    aliases: ['Galoisova tělesa', 'GF(2⁸)', 'GF(p)'],
    category: 'Teorie čísel',
    definition: 'Konečné těleso. AES počítá nad GF(2⁸) s redukčním polynomem x⁸ + x⁴ + x³ + x + 1.',
    plain:
      'Konečné těleso s pevným počtem prvků, kde se dá počítat skoro jako s běžnými čísly. AES počítá v GF(2⁸) nad bajty.',
  },

  // --- Bezpečnost / teorie ----------------------------------------------
  {
    term: 'Jednosměrná funkce',
    aliases: ['jednosměrné funkce', 'jednosměrnou funkci'],
    category: 'Bezpečnost',
    definition:
      'Funkce f: snadno vypočítatelná, ale prakticky neinvertovatelná (např. násobení vs. faktorizace).',
    plain:
      'Snadno se spočítá, ale prakticky nejde obrátit. Příklad: snadno spočítáte součin dvou prvočísel, ale rozklad zpět je peklo.',
  },
  {
    term: 'Padací vrátka',
    aliases: ['padacími vrátky'],
    category: 'Bezpečnost',
    definition: 'Jednosměrná funkce, kterou lze invertovat jen se znalostí tajné informace.',
    plain:
      'Jednosměrná funkce s tajnou "zkratkou" pro toho, kdo ji zná. Tohle je podstata asymetrické kryptografie — vlastník soukromého klíče má zkratku.',
  },
  {
    term: 'Kerckhoffsův princip',
    aliases: ['Kerckhoffsova principu'],
    category: 'Bezpečnost',
    definition:
      'Bezpečnost šifry musí záviset jen na utajení klíče, ne algoritmu. Útočník zná systém.',
    plain:
      'Bezpečnost musí být v klíči, ne v utajení algoritmu. Algoritmus se časem stejně dostane na veřejnost, klíč nikoli.',
  },
  {
    term: 'Nepodmíněná bezpečnost',
    aliases: ['nepodmíněně bezpečný'],
    category: 'Bezpečnost',
    definition: 'Šifru nelze prolomit bez ohledu na výpočetní prostředky útočníka (např. one-time pad).',
    plain:
      'Šifru nelze prolomit ani s nekonečným výpočetním výkonem. Krom one-time padu to v praxi nikdo nemá.',
  },
  {
    term: 'Absolutní bezpečnost',
    aliases: ['absolutně bezpečný'],
    category: 'Bezpečnost',
    definition: 'Útočník nezíská žádnou novou informaci o OT ani opakovaným použitím šifry.',
    plain:
      'Útočník se z šifrového textu nedozví o otevřeném textu vůbec nic. Splňuje to jen one-time pad.',
  },
  {
    term: 'Podmíněná bezpečnost',
    aliases: ['podmíněně bezpečný'],
    category: 'Bezpečnost',
    definition:
      'Prolomení vyžaduje výpočetní prostředky, které útočník nemá. Dělíme na prokazatelnou a výpočetní.',
    plain:
      'Šifra je bezpečná, dokud útočník nemá obrovskou výpočetní sílu. Tahle míra stačí v praxi pro vše krom utajení nejvyššího stupně.',
  },
  {
    term: 'Entropie',
    aliases: ['entropii', 'entropií'],
    category: 'Teorie informace',
    definition:
      'H(X) = −Σ pᵢ log₂ pᵢ. Míra neurčitosti / průměrný počet bitů potřebných k optimálnímu zakódování.',
    plain:
      'Měří, kolik informace zpráva nese — kolik bitů by stačilo k jejímu zakódování. Čím vyšší entropie klíče, tím těžší prolomení.',
  },
  {
    term: 'Redundance',
    aliases: ['redundanci', 'redundancí'],
    category: 'Teorie informace',
    definition: 'Rozdíl absolutní a skutečné obsažnosti: D = R − r. Pro angličtinu ~3,2 b/znak.',
    plain:
      'Rozdíl mezi maximální a skutečnou informací v jazyce. Čeština má redundanci přes 70 % — proto ji jde dobře komprimovat.',
  },
  {
    term: 'Vzdálenost jednoznačnosti',
    aliases: ['vzdálenosti jednoznačnosti'],
    category: 'Teorie informace',
    definition: 'δᵤ = H(K)/D — počet znaků ŠT potřebných, aby zbýval v průměru jediný OT.',
    plain:
      'Kolik znaků šifry musí útočník vidět, aby měl jednoznačné řešení. Pod touhle hranicí má víc kandidátů na otevřený text.',
  },
  {
    term: 'Konfúze',
    aliases: ['konfúzi', 'konfúzí'],
    category: 'Bezpečnost',
    definition:
      'Shannonův princip: vztah mezi ŠT a klíčem má být složitý. Realizuje se substitucí, S-boxy.',
    plain:
      'Vztah mezi šifrovým textem a klíčem musí být co nejsložitější. Tohle dělají S-boxy v AES.',
  },
  {
    term: 'Difúze',
    aliases: ['difúzi', 'difúzí'],
    category: 'Bezpečnost',
    definition:
      'Shannonův princip: redundance OT má být rozprostřena po celém ŠT. Realizuje se transpozicí, MixColumns.',
    plain:
      'Změna v jednom bitu vstupu se musí promítnout do celého výstupu. Tohle dělají MixColumns a ShiftRows v AES.',
  },
  {
    term: 'P',
    category: 'Teorie složitosti',
    definition: 'Třída problémů řešitelných v polynomiálním čase deterministickým Turingovým strojem.',
    plain:
      'Problémy, které počítač spolehlivě vyřeší v rozumném čase. Sem patří všechny běžné úlohy (třídění, hledání cesty…).',
  },
  {
    term: 'NP',
    category: 'Teorie složitosti',
    definition: 'Problémy řešitelné v polynomiálním čase nedeterministickým TS, resp. ověřitelné v PT.',
    plain:
      'Problémy, jejichž řešení se ověří rychle, ale najít ho je zřejmě těžké. Sem patří faktorizace nebo diskrétní logaritmus — základ kryptografie.',
  },
  {
    term: 'NP-úplné',
    aliases: ['NP-úplný', 'NP-těžký'],
    category: 'Teorie složitosti',
    definition: 'Problémy v NP, na něž lze polynomiálně redukovat každý problém z NP.',
    plain:
      'Nejtěžší problémy v NP — vyřešit jeden by znamenalo vyřešit všechny. Kdyby se to povedlo, padla by velká část kryptografie.',
  },

  // --- Teorie čísel / generování ----------------------------------------
  {
    term: 'Kvadratické residuum',
    aliases: ['kvadratickým residuem', 'kvadratickými residui'],
    category: 'Teorie čísel',
    definition: 'a je QR mod m, pokud gcd(a, m) = 1 a x² ≡ a (mod m) má řešení.',
    plain:
      'Číslo, které je modulo m něčí druhou mocninou. Důležité pro generátory pseudonáhodných čísel a některá podpisová schémata.',
  },
  {
    term: 'Legendreův symbol',
    aliases: ['Legendreova symbolu'],
    category: 'Teorie čísel',
    definition: '(a/p) = +1, je-li a kvadratickým residuem mod p; −1 jinak (pro liché prvočíslo p).',
    plain:
      'Vrátí +1 nebo -1 podle toho, zda je číslo kvadratickým residuem modulo prvočíslo. Slouží jako rychlý test pro Solovay-Strassen.',
  },
  {
    term: 'Jacobiho symbol',
    category: 'Teorie čísel',
    definition: 'Zobecnění Legendreova symbolu pro liché složené n: [a/n] = Π (a/pᵢ)^αᵢ.',
    plain:
      'Rozšíření Legendreova symbolu na složená čísla. Klíčové pro testy prvočíselnosti.',
  },
  {
    term: 'Čínská věta o zbytcích',
    aliases: ['CRT', 'čínské věty o zbytcích'],
    category: 'Teorie čísel',
    definition:
      'Soustava x ≡ aᵢ (mod mᵢ) s po dvou nesoudělnými mᵢ má jediné řešení mod M = m₁·…·mᵣ.',
    plain:
      'Pokud znáte zbytky čísla po dělení několika nesoudělnými čísly, lze složit zpět původní hodnotu. Tahle věta zrychluje RSA-CRT a sjednocuje práci s velkými moduly.',
  },
  {
    term: 'Generátor',
    aliases: ['generátoru', 'generátorem', 'generátory'],
    category: 'Teorie čísel',
    definition: 'Prvek g cyklické grupy, jehož mocniny pokrývají celou grupu.',
    plain:
      'Prvek grupy, jehož mocniny pokryjí celou grupu. Bez generátoru by Diffie-Hellman nefungoval.',
  },
  {
    term: 'Solovay-Strassenův test',
    aliases: ['Solovay–Strassenův test'],
    category: 'Generování klíčů',
    definition:
      'Pravděpodobnostní test prvočíselnosti porovnávající a^{(p−1)/2} mod p a Jacobiho symbol. Chyba ≤ 1/2.',
    plain:
      'Pravděpodobnostní test, zda je číslo prvočíslem. Rychlý, ale slabší než Miller-Rabin — dnes se moc nepoužívá.',
  },
  {
    term: 'Rabin-Millerův test',
    aliases: ['Rabin–Millerův test', 'Miller-Rabin'],
    category: 'Generování klíčů',
    definition: 'Nejpoužívanější test prvočíselnosti. Pravděpodobnost falešného úspěchu ≤ 1/4 na test.',
    plain:
      'Pravděpodobnostní test prvočíselnosti, který je dnes standardem. Bez něj by RSA neuměla rychle vygenerovat klíče.',
  },
  {
    term: 'Lehmannův test',
    category: 'Generování klíčů',
    definition: 'Jednodušší variantou Solovay-Strassena: kontroluje pouze a^{(p−1)/2} ≡ ±1 (mod p).',
    plain:
      'Jednodušší verze Solovay-Strassena. Užitečné jen pedagogicky — v praxi se nepoužívá.',
  },
  {
    term: 'NFS',
    aliases: ['Number Field Sieve', 'funkční síto'],
    category: 'Generování klíčů',
    definition:
      'Number Field Sieve — nejrychlejší známý algoritmus pro faktorizaci velkých čísel (≥ 110 cifer).',
    plain:
      'Nejrychlejší známý algoritmus pro rozklad velkých čísel. Určuje, jak dlouhý musí být RSA klíč, aby byl bezpečný.',
  },
  {
    term: 'QS',
    aliases: ['Quadratic Sieve'],
    category: 'Generování klíčů',
    definition: 'Quadratic Sieve — faktorizační algoritmus pro čísla do ~110 cifer.',
    plain:
      'Rozkladový algoritmus pro středně velká čísla (do 110 cifer). Historický předchůdce NFS.',
  },
  {
    term: 'ECM',
    aliases: ['Elliptic Curve Method'],
    category: 'Generování klíčů',
    definition: 'Elliptic Curve Method — faktorizační algoritmus využívající eliptické křivky.',
    plain:
      'Rozklad čísla pomocí eliptických křivek. Hodí se tam, kde má číslo malé prvočinitele.',
  },
  {
    term: 'LCG',
    aliases: ['lineární kongruenční generátor', 'lineárního kongruenčního generátoru'],
    category: 'Generování klíčů',
    definition:
      'Linear congruential generator: Xₙ₊₁ = (a·Xₙ + c) mod m. Rychlý, ale kryptograficky nebezpečný.',
    plain:
      'Jednoduchý generátor pseudonáhodných čísel pomocí lineárního vztahu. Rychlý, ale nikdy ho nepoužívejte pro kryptografii — útočník dokáže dopočítat další čísla.',
  },
  {
    term: 'PRNG',
    aliases: ['pseudonáhodný generátor', 'pseudonáhodné generátory'],
    category: 'Generování klíčů',
    definition: 'Pseudo-Random Number Generator — deterministický generátor s vlastnostmi náhodnosti.',
    plain:
      'Generátor čísel, který vypadá náhodně, ale jede z předem zvoleného semínka. Hodí se na simulace, hry a (s kryptografickou verzí) na klíče.',
  },
  {
    term: 'TRNG',
    aliases: ['skutečně náhodný generátor'],
    category: 'Generování klíčů',
    definition: 'True Random Number Generator — využívá fyzický zdroj entropie (šum, rozpad atd.).',
    plain:
      'Generátor čísel z fyzikálního zdroje (šum, radioaktivita). Skutečně náhodný — používá se jako zdroj počátečních hodnot pro PRNG.',
  },
  {
    term: 'Blum-Blum-Shub',
    aliases: ['Blum–Blum–Shub'],
    category: 'Generování klíčů',
    definition:
      'Kryptograficky bezpečný PRNG: Xₙ₊₁ = Xₙ² mod m, kde m = pq, p, q ≡ 3 (mod 4). Bezpečnost závisí na faktorizaci.',
    plain:
      'Pomalý, ale kryptograficky bezpečný PRNG. Bezpečnost stojí na obtížnosti rozkladu velkého čísla na prvočísla.',
  },
  {
    term: 'Von Neumannův dekorelátor',
    category: 'Generování klíčů',
    definition: 'Postprocessing TRNG: bity po dvojicích, 00/11 zahodit, 01→0, 10→1.',
    plain:
      'Postup, jak z proudu mírně předpojatých bitů udělat férový. Hodí se na výstup z fyzikálního generátoru, který sám o sobě generuje trochu víc 1 než 0 (nebo naopak).',
  },

  // --- PKI / podpisy ----------------------------------------------------
  {
    term: 'PKI',
    aliases: ['Public Key Infrastructure'],
    category: 'PKI',
    definition:
      'Infrastruktura veřejného klíče — soubor opatření pro vydávání, správu a odvolávání klíčů a certifikátů.',
    plain:
      'Systém certifikátů, autorit a pravidel, který umožňuje důvěřovat veřejným klíčům. Bez něj byste nevěděli, že www.banka.cz je opravdu banka.',
  },
  {
    term: 'Certifikát',
    aliases: ['certifikátu', 'certifikátem', 'certifikáty'],
    category: 'PKI',
    definition:
      'Datová struktura s veřejným klíčem, identifikací uživatele a podpisem certifikační autority.',
    plain:
      'Veřejný klíč spojený s identitou a podepsaný autoritou. Funguje jako "občanka" veřejného klíče.',
  },
  {
    term: 'Certifikační autorita',
    aliases: ['CA', 'certifikační autority', 'certifikačním autoritám'],
    category: 'PKI',
    definition: 'Důvěryhodná třetí strana, která vydává, podepisuje a odvolává certifikáty.',
    plain:
      'Důvěryhodná třetí strana, která ručí za pravost certifikátů. V prohlížeči vidíte zelený zámeček díky tomu, že CA podepsala certifikát serveru.',
  },
  {
    term: 'Registrační autorita',
    aliases: ['RA', 'registrační autority'],
    category: 'PKI',
    definition: 'Subjekt CA přijímající žádosti, kontrolující údaje a předávající certifikáty.',
    plain:
      'Pomocná složka CA, která přijímá žádosti a kontroluje identitu žadatele. Existuje proto, aby samotná CA nemusela řešit administrativu.',
  },
  {
    term: 'X.509',
    category: 'PKI',
    definition: 'Standard ITU-T formátu digitálních certifikátů (součást X.500). Verze 3 nejrozšířenější.',
    plain:
      'Standardní formát digitálních certifikátů. Používá ho dnes prakticky vše — HTTPS, e-mail, VPN…',
  },
  {
    term: 'CRL',
    aliases: ['seznam odvolaných certifikátů'],
    category: 'PKI',
    definition: 'Certificate Revocation List — seznam předčasně odvolaných certifikátů.',
    plain:
      'Seznam certifikátů, kterým autorita odebrala důvěru ještě před jejich expirací. Důvod: ztracený klíč, kompromitace, ukončení služby.',
  },
  {
    term: 'Křížová certifikace',
    aliases: ['křížové certifikace', 'křížový certifikát'],
    category: 'PKI',
    definition: 'CA₁ podepíše VK CA₂ a naopak — spojení dvou hierarchií certifikátů.',
    plain:
      'Dvě CA si vzájemně podepíší veřejné klíče. Slouží k propojení hierarchií, aby si uživatelé z různých systémů vzájemně důvěřovali.',
  },
  {
    term: 'Digitální podpis',
    aliases: ['digitálního podpisu', 'digitálním podpisem'],
    category: 'PKI',
    definition:
      'Kryptografická značka vytvořená SK podepisujícího; ověřitelná jeho VK. Zaručuje integritu, autentizaci a nepopiratelnost.',
    plain:
      'Kryptografická "značka" autora — kdokoli s veřejným klíčem si ověří, že zpráva je opravdu od něj. Zaručuje, že autor nemůže autorství popřít.',
  },
  {
    term: 'Nepopiratelnost',
    aliases: ['nepopiratelností'],
    category: 'PKI',
    definition: 'Podepisující nemůže popřít autorství. Vlastnost asymetrického podpisu, ne MAC.',
    plain:
      'Záruka, že podepisující nemůže své autorství popřít. Tahle vlastnost odlišuje digitální podpis od MAC, kde klíč mají obě strany.',
  },
  {
    term: 'Integrita',
    aliases: ['integritu', 'integritou'],
    category: 'Bezpečnost',
    definition: 'Záruka, že zpráva nebyla po cestě pozměněna. Realizuje se hašem, MAC nebo podpisem.',
    plain:
      'Záruka, že zpráva po cestě nezměnila ani jeden bit. Realizuje se hašem, MAC nebo podpisem.',
  },
  {
    term: 'Autentizace',
    aliases: ['autentizaci', 'autentizací'],
    category: 'Bezpečnost',
    definition:
      'Ověření identity strany či původu dat. Faktory: co víme (heslo), co máme (token), co jsme (biometrie).',
    plain:
      'Ověření, že druhá strana je tím, za koho se vydává. Klasické faktory: něco víš (heslo), něco máš (token), něco jsi (biometrie).',
  },
  {
    term: 'Důvěrnost',
    aliases: ['důvěrnost', 'důvěrnosti'],
    category: 'Bezpečnost',
    definition: 'Záruka, že obsah zprávy zná jen oprávněný příjemce. Realizuje se šifrováním.',
    plain:
      'Záruka, že obsah zprávy nezná nikdo nepovolaný. Tahle vlastnost vzniká šifrováním.',
  },

  // --- Čipové karty / FIDO2 ---------------------------------------------
  {
    term: 'Čipová karta',
    aliases: ['čipové karty', 'čipovou kartu', 'ČK'],
    category: 'Čipové karty',
    definition: 'Plastová karta s integrovaným obvodem (paměťovým nebo procesorovým).',
    plain:
      'Plastová karta s mini-počítačem uvnitř. Umí bezpečně držet klíče tak, aby se z karty nikdy nedostaly ven.',
  },
  {
    term: 'APDU',
    aliases: ['APDU'],
    category: 'Čipové karty',
    definition:
      'Application Protocol Data Unit (ISO 7816-4) — formát zpráv mezi terminálem a čipovou kartou.',
    plain:
      'Formát zpráv, které si terminál a karta vyměňují. Bez APDU by terminál nevěděl, jak kartě říct "podepiš tuhle hodnotu".',
  },
  {
    term: 'ISO 7816',
    category: 'Čipové karty',
    definition: 'Norma pro kontaktní čipové karty (fyzika, protokoly, příkazy, souborový systém).',
    plain:
      'Norma definující vše kolem kontaktních čipových karet. Říká, jak vypadá karta, jak komunikuje a jaké příkazy umí.',
  },
  {
    term: 'ISO 14443',
    category: 'Čipové karty',
    definition: 'Norma pro bezkontaktní karty (proximity, 13,56 MHz). Základ NFC.',
    plain:
      'Norma pro bezkontaktní karty fungující na 13,56 MHz. Na ní stojí NFC v telefonech a platby kartou přiložením.',
  },
  {
    term: 'NFC',
    category: 'Čipové karty',
    definition: 'Near Field Communication — bezkontaktní komunikace na krátkou vzdálenost (13,56 MHz).',
    plain:
      'Bezkontaktní komunikace na vzdálenost pár centimetrů. Praktické pro platby, vstupenky a párování zařízení.',
  },
  {
    term: 'EMV',
    category: 'Čipové karty',
    definition: 'Europay-Mastercard-Visa — standard platebních čipových karet.',
    plain:
      'Globální standard platebních karet (Europay-Mastercard-Visa). Říká, jak mají karta a terminál ověřit a autorizovat platbu.',
  },
  {
    term: 'FIDO2',
    aliases: ['WebAuthn'],
    category: 'Čipové karty',
    definition: 'Standard pro silnou autentizaci hardwarovými tokeny (security keys, passkeys).',
    plain:
      'Standard pro silné přihlašování pomocí hardwarového klíče (YubiKey, Passkey). Nahrazuje hesla — nelze ho phishingovat.',
  },
  {
    term: 'CTAP2',
    category: 'Čipové karty',
    definition: 'Client-to-Authenticator Protocol v2 — protokol mezi klientem (prohlížečem) a FIDO2 tokenem.',
    plain:
      'Protokol, kterým prohlížeč komunikuje s FIDO2 tokenem. Bez něj by web nemohl požádat YubiKey, ať něco podepíše.',
  },
  {
    term: 'Java Card',
    category: 'Čipové karty',
    definition: 'Podmnožina Java běžící na čipové kartě s JCVM. Aplikace se nazývají applety.',
    plain:
      'Operační systém pro čipové karty s aplikacemi v Javě. Díky němu lze do jedné karty nahrát víc aplikací (platba + průkaz + klíč).',
  },
  {
    term: 'GlobalPlatform',
    category: 'Čipové karty',
    definition: 'Standard pro správu aplikací (appletů) na čipové kartě (dříve OpenPlatform).',
    plain:
      'Standard pro správu aplikací na čipové kartě (instalace, mazání, podpis). Bez něj by si banka nemohla bezpečně nahrát svůj applet na vaši kartu.',
  },
  {
    term: 'MF',
    aliases: ['Master File'],
    category: 'Čipové karty',
    definition: 'Master File — kořen souborového systému čipové karty (FID 3F00).',
    plain:
      'Kořenový adresář souborového systému karty. Pod ním se větví všechny aplikace na kartě.',
  },
  {
    term: 'DF',
    aliases: ['Dedicated File'],
    category: 'Čipové karty',
    definition: 'Dedicated File — adresář / kontejner aplikace na kartě.',
    plain:
      'Adresář na čipové kartě obsahující jednu aplikaci. Jako by každá aplikace měla svůj samostatný "folder".',
  },
  {
    term: 'EF',
    aliases: ['Elementary File'],
    category: 'Čipové karty',
    definition:
      'Elementary File — datový soubor na čipové kartě (transparentní nebo strukturovaný po záznamech).',
    plain:
      'Datový soubor uvnitř DF na čipové kartě. Tady jsou uložená vlastní data aplikace (klíče, certifikáty, čítače…).',
  },
  {
    term: 'AID',
    category: 'Čipové karty',
    definition: 'Application Identifier — až 16bajtový identifikátor appletu / DF.',
    plain:
      'Identifikátor aplikace na kartě, kterým ji terminál vybere. Něco jako "doménové jméno" pro applety.',
  },
  {
    term: 'TLV',
    category: 'Čipové karty',
    definition: 'Tag-Length-Value — formát strukturovaných dat v APDU.',
    plain:
      'Formát strukturovaných dat (tag + délka + hodnota). Používá ho APDU pro přenášení dat spolu s jejich popisem.',
  },
  {
    term: 'Secure Messaging',
    category: 'Čipové karty',
    definition: 'Zabezpečení APDU mezi terminálem a kartou: MAC, případně i šifrování.',
    plain:
      'Šifrované a autentizované APDU mezi terminálem a kartou. Brání odposlechu komunikace mezi terminálem a kartou.',
  },
  {
    term: 'Diverzifikace klíčů',
    aliases: ['diverzifikace klíčů', 'diverzifikaci klíčů'],
    category: 'Čipové karty',
    definition:
      'Z jednoho Master Key se KDF odvodí klíč pro konkrétní kartu; kompromitace 1 karty neohrozí ostatní.',
    plain:
      'Z jednoho hlavního klíče se pro každou kartu odvodí vlastní. Pokud útočník dostane klíč z jedné karty, ostatní zůstanou v bezpečí.',
  },

  // --- Kvantová ---------------------------------------------------------
  {
    term: 'Qubit',
    aliases: ['qubity', 'qubitu'],
    category: 'Kvantová kryptografie',
    definition:
      'Kvantový bit — stav |ψ⟩ = ω₀|0⟩ + ω₁|1⟩ s |ω₀|² + |ω₁|² = 1. Měření kolabuje do |0⟩ nebo |1⟩.',
    plain:
      'Kvantová obdoba bitu — místo "buď 0 nebo 1" je v superpozici obou. Kvantové počítače pracují s qubity, dokud se neudělá měření, které stav zafixuje.',
  },
  {
    term: 'BB84',
    category: 'Kvantová kryptografie',
    definition:
      'Protokol kvantové distribuce klíče (Bennett-Brassard, 1984) využívající dvě konjugované polarizační báze.',
    plain:
      'První protokol pro výměnu klíčů přes kvantový kanál. Bezpečnost stojí na zákonech fyziky — útočník nemůže odposlouchávat bez toho, aby se odhalil.',
  },
]

// Build a fast lookup from any alias / canonical term → entry, keys lowercased.
export const glossaryLookup: Map<string, GlossaryEntry> = (() => {
  const m = new Map<string, GlossaryEntry>()
  for (const entry of glossary) {
    m.set(entry.term.toLowerCase(), entry)
    for (const alias of entry.aliases ?? []) {
      m.set(alias.toLowerCase(), entry)
    }
  }
  return m
})()

// Build a single regex that matches any term / alias as a whole word.
// Czech letters are matched via \p{L} so we don't get partial matches inside
// words like "kryptografie" appearing inside "kryptografii" when only "kryptografie"
// is registered (we instead register the declensions explicitly as aliases).
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const glossaryPattern: RegExp = (() => {
  const all: string[] = []
  for (const entry of glossary) {
    all.push(entry.term)
    for (const alias of entry.aliases ?? []) all.push(alias)
  }
  // sort by length desc to prefer longer matches
  all.sort((a, b) => b.length - a.length)
  const alternation = all.map(escapeRegex).join('|')
  return new RegExp(`(?<![\\p{L}\\p{N}])(${alternation})(?![\\p{L}\\p{N}])`, 'giu')
})()
