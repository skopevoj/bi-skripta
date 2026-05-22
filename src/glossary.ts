// Glossary of terms used throughout the skripta. Each entry registers a
// canonical display term plus optional aliases (Czech declensions, English
// variants). The MathHTML renderer scans text nodes for any of these tokens
// and wraps them in a tooltip <span> so the reader can hover for an inline
// explanation.

export type GlossaryEntry = {
  term: string
  aliases?: string[]
  definition: string // plain text; no math / no HTML
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
  },
  {
    term: 'Kryptografie',
    aliases: ['kryptografie', 'kryptografii', 'kryptografií'],
    category: 'Základní pojmy',
    definition: 'Obor zabývající se konstrukcí šifer a kryptografických protokolů.',
  },
  {
    term: 'Kryptoanalýza',
    aliases: ['kryptoanalýzy', 'kryptoanalýze', 'kryptoanalýzou'],
    category: 'Základní pojmy',
    definition:
      'Luštění šifer — identifikace systému, prolomení způsobu šifrování a nalezení klíče.',
  },
  {
    term: 'Otevřený text',
    aliases: ['otevřeného textu', 'otevřeném textu', 'OT'],
    category: 'Základní pojmy',
    definition: 'Vstupní zpráva před zašifrováním. Často značeno zkratkou OT.',
  },
  {
    term: 'Šifrový text',
    aliases: ['šifrového textu', 'šifrovém textu', 'ŠT'],
    category: 'Základní pojmy',
    definition: 'Výsledek šifrování otevřeného textu. Často značeno ŠT.',
  },
  {
    term: 'Šifrování',
    aliases: ['šifrování', 'šifrováním'],
    category: 'Základní pojmy',
    definition: 'Proces převádějící otevřený text na šifrový pomocí klíče.',
  },
  {
    term: 'Dešifrování',
    aliases: ['dešifrování', 'dešifrováním'],
    category: 'Základní pojmy',
    definition: 'Inverzní proces k šifrování — obnova otevřeného textu pomocí klíče.',
  },
  {
    term: 'Steganografie',
    aliases: ['steganografie', 'steganografii', 'steganografií'],
    category: 'Základní pojmy',
    definition:
      'Ukrytí samotné existence zprávy (např. v obrázku či textu). Doplněk šifrování.',
  },
  {
    term: 'Monogram',
    category: 'Pojmy o textu',
    definition: 'Jedno písmeno.',
  },
  {
    term: 'Bigram',
    category: 'Pojmy o textu',
    definition: 'Dvojice sousedních písmen.',
  },
  {
    term: 'Trigram',
    category: 'Pojmy o textu',
    definition: 'Trojice sousedních písmen.',
  },
  {
    term: 'Polygram',
    category: 'Pojmy o textu',
    definition: 'Obecná posloupnost znaků (n-gram).',
  },
  {
    term: 'Frekvenční analýza',
    aliases: ['frekvenční analýzy', 'frekvenční analýze', 'frekvenční analýzou'],
    category: 'Kryptoanalýza',
    definition:
      'Útok porovnávající četnost znaků v šifrovém textu s referenční četností jazyka — slabina monoalfabetických šifer.',
  },

  // --- Modely útočníka --------------------------------------------------
  {
    term: 'COA',
    aliases: ['ciphertext-only'],
    category: 'Modely útočníka',
    definition: 'Ciphertext-only attack — útočník zná pouze šifrový text.',
  },
  {
    term: 'KPA',
    aliases: ['known-plaintext'],
    category: 'Modely útočníka',
    definition: 'Known-plaintext attack — útočník zná dvojice (OT, ŠT).',
  },
  {
    term: 'CPA',
    aliases: ['chosen-plaintext'],
    category: 'Modely útočníka',
    definition: 'Chosen-plaintext attack — útočník si může zvolit OT k zašifrování.',
  },
  {
    term: 'CCA',
    aliases: ['chosen-ciphertext'],
    category: 'Modely útočníka',
    definition: 'Chosen-ciphertext attack — útočník si může zvolit ŠT k dešifrování.',
  },
  {
    term: 'Brute force',
    aliases: ['hrubá síla', 'hrubou silou'],
    category: 'Modely útočníka',
    definition:
      'Útok hrubou silou — postupné zkoušení všech možných klíčů. Účinný proti krátkým klíčům.',
  },
  {
    term: 'MITM',
    aliases: ['man-in-the-middle', 'Man-in-the-middle'],
    category: 'Modely útočníka',
    definition:
      'Útok „prostředníka“ — útočník se vetře mezi dvě komunikující strany a může číst i modifikovat zprávy.',
  },
  {
    term: 'Replay útok',
    aliases: ['replay útoku', 'replay útoky', 'replay attack'],
    category: 'Modely útočníka',
    definition: 'Opětovné zaslání dříve zachycené platné zprávy. Bráníme se nonci / timestampy.',
  },

  // --- Klasické šifry ---------------------------------------------------
  {
    term: 'Substituční šifra',
    aliases: ['substituční šifry', 'substituce', 'substituční'],
    category: 'Klasické šifry',
    definition: 'Šifra nahrazující znaky OT jinými znaky. Identita písmen se mění, pořadí ne.',
  },
  {
    term: 'Transpoziční šifra',
    aliases: ['transpoziční šifry', 'transpozice'],
    category: 'Klasické šifry',
    definition:
      'Šifra permutující pořadí znaků OT. Identita písmen zůstává, mění se pozice (difúze).',
  },
  {
    term: 'Monoalfabetická',
    aliases: ['monoalfabetické', 'monoalfabetické substituce'],
    category: 'Klasické šifry',
    definition: 'Substituční šifra, v níž dané písmeno OT je vždy nahrazeno týmž písmenem ŠT.',
  },
  {
    term: 'Polyalfabetická',
    aliases: ['polyalfabetické', 'polyalfabetickou'],
    category: 'Klasické šifry',
    definition: 'Šifra s více substitučními abecedami střídanými dle klíče (např. Vigenère).',
  },
  {
    term: 'Polygrafická',
    aliases: ['polygrafické'],
    category: 'Klasické šifry',
    definition: 'Bloková šifra zpracovávající celé skupiny znaků najednou (např. Hill).',
  },
  {
    term: 'Caesarova šifra',
    aliases: ['Caesarovy šifry', 'Caesarova', 'Caesar'],
    category: 'Klasické šifry',
    definition: 'Posuvná substituce: c = |p + 3|₂₆. Speciální případ šifry s posunem.',
  },
  {
    term: 'Afinní šifra',
    aliases: ['afinní šifry', 'afinní transformace'],
    category: 'Klasické šifry',
    definition: 'Šifrování c = |a·p + b|₂₆ s gcd(a, 26) = 1. Celkem 312 různých klíčů.',
  },
  {
    term: 'Hillova šifra',
    aliases: ['Hillovy šifry', 'Hillova'],
    category: 'Klasické šifry',
    definition:
      'Bloková lineární šifra c = A·p mod 26 nad maticí A. Zranitelná známým-OT útokem.',
  },
  {
    term: 'Vigenèrova šifra',
    aliases: ['Vigenèrovy šifry', 'Vigenère', 'Vigenèrova'],
    category: 'Klasické šifry',
    definition: 'Polyalfabetická šifra: posloupnost Caesarových posunů řízená heslem délky n.',
  },
  {
    term: 'Vernamova šifra',
    aliases: ['Vernamovy šifry', 'Vernamova'],
    category: 'Klasické šifry',
    definition:
      'One-time pad. Heslo je zcela náhodné a stejně dlouhé jako OT, použito právě jednou. Absolutně bezpečná.',
  },
  {
    term: 'One-time pad',
    aliases: ['OTP'],
    category: 'Klasické šifry',
    definition:
      'Jednorázové heslo (Vernamova šifra). Náhodné, stejně dlouhé jako OT, jednou použité.',
  },

  // --- Symetrické šifry -------------------------------------------------
  {
    term: 'Symetrická šifra',
    aliases: ['symetrická', 'symetrické', 'symetrické šifry'],
    category: 'Symetrická kryptografie',
    definition: 'Šifra, kde odesílatel i příjemce sdílí týž tajný klíč.',
  },
  {
    term: 'Bloková šifra',
    aliases: ['blokové šifry', 'bloková', 'blokové'],
    category: 'Symetrická kryptografie',
    definition:
      'Šifra zpracovávající bloky pevné délky toutéž transformací Eₖ (dnes obvykle 128 b).',
  },
  {
    term: 'Proudová šifra',
    aliases: ['proudové šifry', 'proudová', 'proudové'],
    category: 'Symetrická kryptografie',
    definition:
      'Šifra, která z klíče generuje posloupnost (heslo) a každý znak OT šifruje jinou transformací — typicky XOR.',
  },
  {
    term: 'IV',
    aliases: ['inicializační vektor', 'inicializačního vektoru', 'inicializačním vektorem'],
    category: 'Symetrická kryptografie',
    definition:
      'Inicializační vektor — náhodná hodnota nastavující šifru do počátečního stavu. Posílá se otevřeně.',
  },
  {
    term: 'Nonce',
    aliases: ['nonci', 'nonce'],
    category: 'Symetrická kryptografie',
    definition: '„Number used once“ — jednorázová hodnota proti replay útokům a opakování keystreamu.',
  },
  {
    term: 'Feistelův kryptosystém',
    aliases: ['Feistelova síť', 'Feistelovy sítě', 'Feistel', 'Feistelovského'],
    category: 'Bloková kryptografie',
    definition:
      'Konstrukce blokové šifry: data se rozdělí na L a R, v každé rundě L_{i+1} = R_i, R_{i+1} = L_i ⊕ f(R_i, k_i). Dešifrování stejně, jen s opačným pořadím klíčů.',
  },
  {
    term: 'S-box',
    aliases: ['S-boxů', 'S-boxy', 'S-boxech', 'SubBytes'],
    category: 'Bloková kryptografie',
    definition:
      'Substituční tabulka — jediný nelineární prvek blokových šifer (DES, AES). Poskytuje konfúzi.',
  },
  {
    term: 'DES',
    category: 'Bloková kryptografie',
    definition:
      'Data Encryption Standard (FIPS 46-3, 1977). Feistelova šifra, 64b blok, klíč jen 56 b — dnes prolomený hrubou silou.',
  },
  {
    term: '3DES',
    aliases: ['Triple DES', '3DES-EDE'],
    category: 'Bloková kryptografie',
    definition:
      'Triple DES (EDE) — trojnásobné použití DES s 2 nebo 3 klíči. Posiluje DES proti hrubé síle.',
  },
  {
    term: 'AES',
    aliases: ['Rijndael'],
    category: 'Bloková kryptografie',
    definition:
      'Advanced Encryption Standard (FIPS 197). Není Feistel; 128b blok, klíč 128/192/256 b. Vítěz soutěže NIST (Daemen, Rijmen).',
  },
  {
    term: 'MixColumns',
    category: 'Bloková kryptografie',
    definition:
      'Krok AES: lineární substituce sloupců násobením maticí v GF(2⁸). Poskytuje difúzi.',
  },
  {
    term: 'ShiftRows',
    category: 'Bloková kryptografie',
    definition: 'Krok AES: cyklický posun řádků matice stavu o 0/1/2/3 bajty doleva.',
  },
  {
    term: 'AddRoundKey',
    category: 'Bloková kryptografie',
    definition: 'Krok AES: XOR stavu s rundovním klíčem (128 b).',
  },
  {
    term: 'RC4',
    category: 'Proudové šifry',
    definition:
      'Proudová šifra (Rivest, 1987) s tajnou permutací 256 bajtů. Historicky používaná v SSL, dnes prolomená.',
  },
  {
    term: 'Salsa20',
    category: 'Proudové šifry',
    definition:
      'Moderní proudová šifra (Bernstein, 2005). 20 rund ARX operací nad maticí 4×4 z 32b slov.',
  },
  {
    term: 'ChaCha',
    aliases: ['ChaCha20'],
    category: 'Proudové šifry',
    definition:
      'Vylepšení Salsa20 (Bernstein, 2008) s lepší difúzí na rundu. Základ ChaCha20-Poly1305.',
  },
  {
    term: 'ChaCha20-Poly1305',
    category: 'Proudové šifry',
    definition: 'AEAD šifra používaná v QUIC, TLS a OpenSSH (ChaCha20 + Poly1305 MAC).',
  },
  {
    term: 'A5/1',
    category: 'Proudové šifry',
    definition: 'Proudová šifra pro GSM (1987). 3 LFSR délek 19/22/23 s nelineárním taktováním.',
  },
  {
    term: 'LFSR',
    category: 'Proudové šifry',
    definition:
      'Linear-feedback shift register — posuvný registr s lineární zpětnou vazbou, stavební blok proudových šifer.',
  },

  // --- Operační módy ----------------------------------------------------
  {
    term: 'ECB',
    aliases: ['Electronic Codebook'],
    category: 'Operační módy',
    definition:
      'Electronic Codebook — každý blok šifrován nezávisle. Stejné bloky OT dávají stejné ŠT. Neskrývá strukturu.',
  },
  {
    term: 'CBC',
    aliases: ['Cipher Block Chaining'],
    category: 'Operační módy',
    definition:
      'Cipher Block Chaining — každý blok OT je XORován s předchozím ŠT a teprve pak šifrován. Vyžaduje IV.',
  },
  {
    term: 'CFB',
    aliases: ['Cipher Feedback'],
    category: 'Operační módy',
    definition:
      'Cipher Feedback — převádí blokovou šifru na samosynchronizující proudovou. ŠTᵢ = OTᵢ ⊕ Eₖ(ŠTᵢ₋₁).',
  },
  {
    term: 'OFB',
    aliases: ['Output Feedback'],
    category: 'Operační módy',
    definition:
      'Output Feedback — synchronní proudový režim. Heslo H := Eₖ(H), ŠTᵢ = OTᵢ ⊕ H.',
  },
  {
    term: 'CTR',
    aliases: ['Counter mode'],
    category: 'Operační módy',
    definition:
      'Counter — heslo Hᵢ = Eₖ(IV + i). Lze počítat paralelně, čítač se v rámci klíče nesmí opakovat.',
  },
  {
    term: 'CBC-MAC',
    category: 'Operační módy',
    definition:
      'Autentizační kód: zpráva se šifruje v CBC s nulovým IV a vrací se poslední blok (Eₖ₂ z něj).',
  },

  // --- Hašovací funkce --------------------------------------------------
  {
    term: 'Hašovací funkce',
    aliases: ['hašovací funkce', 'hašovací funkci', 'hašovací funkcí', 'hašování', 'hašuje'],
    category: 'Hašovací funkce',
    definition:
      'Funkce h: X → {0,1}ⁿ, jednosměrná a bezkolizní. Mapuje libovolně dlouhý vstup na haš pevné délky.',
  },
  {
    term: 'Haš',
    aliases: ['haše', 'haš'],
    category: 'Hašovací funkce',
    definition: 'Výstup hašovací funkce — řetězec pevné délky (typicky 128–512 bitů).',
  },
  {
    term: 'Bezkoliznost',
    aliases: ['bezkolizní', 'bezkolizní'],
    category: 'Hašovací funkce',
    definition:
      'Vlastnost hašovací funkce: výpočetně nemožné najít dvě různé zprávy se stejným hašem.',
  },
  {
    term: 'Kolize 1. řádu',
    aliases: ['kolizi 1. řádu', 'collision resistance'],
    category: 'Hašovací funkce',
    definition:
      'Nalezení libovolných dvou zpráv M ≠ M′ s h(M) = h(M′). Pro náhodný haš složitost ≈ 2^(n/2).',
  },
  {
    term: 'Kolize 2. řádu',
    aliases: ['kolizi 2. řádu', '2nd preimage'],
    category: 'Hašovací funkce',
    definition: 'Pro daný vzor x najít y ≠ x s h(x) = h(y). Složitost ≈ 2ⁿ.',
  },
  {
    term: 'Lavinový efekt',
    aliases: ['lavinového efektu', 'lavinovým efektem'],
    category: 'Hašovací funkce',
    definition:
      'Vlastnost dobré hašovací nebo blokové šifry: změna 1 bitu vstupu mění zhruba polovinu výstupních bitů.',
  },
  {
    term: 'Narozeninový paradox',
    aliases: ['narozeninového paradoxu', 'narozeninovým paradoxem'],
    category: 'Hašovací funkce',
    definition:
      'Při √n výběrech z n hodnot je pravděpodobnost nalezení kolize ≈ 50 %. Limituje bezpečnost hašů na n/2 bitů.',
  },
  {
    term: 'Damgård-Merklova konstrukce',
    aliases: ['Damgård-Merkle', 'Damgård–Merklova', 'Damgård-Merklovo zesílení'],
    category: 'Hašovací funkce',
    definition:
      'Iterativní konstrukce hašovací funkce: kontext H₀ = IV, Hᵢ = f(Hᵢ₋₁, Mᵢ). Bezkolizní f → bezkolizní haš.',
  },
  {
    term: 'Davies-Meyerova konstrukce',
    aliases: ['Davies-Meyer'],
    category: 'Hašovací funkce',
    definition: 'Kompresní funkce z blokové šifry: Hᵢ = E_{Mᵢ}(Hᵢ₋₁) ⊕ Hᵢ₋₁.',
  },
  {
    term: 'SHA-1',
    category: 'Hašovací funkce',
    definition: '160bitový haš (FIPS 180-1, 1995). Kolize nalezena 2017 — dnes nepoužívat.',
  },
  {
    term: 'SHA-2',
    aliases: ['SHA-256', 'SHA-384', 'SHA-512'],
    category: 'Hašovací funkce',
    definition: 'Rodina hašovacích funkcí (FIPS 180-2): SHA-256, SHA-384, SHA-512.',
  },
  {
    term: 'HMAC',
    category: 'Hašovací funkce',
    definition:
      'Klíčovaný autentizační kód postavený nad hašovací funkcí: HMACₖ(M) = h((K⁺⊕opad) ‖ h((K⁺⊕ipad) ‖ M)).',
  },
  {
    term: 'MAC',
    aliases: ['MACu', 'MACem'],
    category: 'Hašovací funkce',
    definition:
      'Message Authentication Code — symetrický autentizační kód. Zaručuje integritu a autentizaci původu (nikoli nepopiratelnost).',
  },
  {
    term: 'CMAC',
    category: 'Hašovací funkce',
    definition: 'MAC založený na blokové šifře (AES-CMAC); varianta CBC-MAC pro proměnnou délku zprávy.',
  },
  {
    term: 'Sůl',
    aliases: ['salt', 'soli'],
    category: 'Hašovací funkce',
    definition:
      'Náhodná hodnota přidávaná při hašování hesla. Brání slovníkovým útokům a rainbow tabulkám.',
  },

  // --- Asymetrická kryptografie -----------------------------------------
  {
    term: 'Asymetrická kryptografie',
    aliases: ['asymetrické', 'asymetrické kryptografie', 'asymetrická'],
    category: 'Asymetrická kryptografie',
    definition:
      'Kryptografie s veřejným klíčem: každý uživatel má pár VK (veřejný) + SK (soukromý). Z VK nelze prakticky spočítat SK.',
  },
  {
    term: 'Veřejný klíč',
    aliases: ['veřejného klíče', 'veřejným klíčem', 'VK'],
    category: 'Asymetrická kryptografie',
    definition: 'Část páru asymetrického klíče určená ke zveřejnění (šifrování / ověřování podpisu).',
  },
  {
    term: 'Soukromý klíč',
    aliases: ['soukromého klíče', 'soukromým klíčem', 'SK'],
    category: 'Asymetrická kryptografie',
    definition: 'Tajná část páru asymetrického klíče (dešifrování / podpis).',
  },
  {
    term: 'RSA',
    category: 'Asymetrická kryptografie',
    definition:
      'Asymetrický kryptosystém (Rivest, Shamir, Adleman, 1977). Bezpečnost závisí na obtížnosti faktorizace n = pq.',
  },
  {
    term: 'RSA-CRT',
    category: 'Asymetrická kryptografie',
    definition:
      'Urychlené dešifrování RSA pomocí Čínské věty o zbytcích — 4–8× rychlejší než přímý mod n.',
  },
  {
    term: 'Diffie-Hellman',
    aliases: ['Diffie–Hellman', 'Diffie-Hellmanova', 'Diffie-Hellmanův protokol', 'D-H'],
    category: 'Asymetrická kryptografie',
    definition:
      'Protokol pro ustavení sdíleného tajemství přes veřejný kanál. Bezpečnost závisí na obtížnosti PDL.',
  },
  {
    term: 'ElGamal',
    category: 'Asymetrická kryptografie',
    definition:
      'Asymetrické šifrování i podpis založený na Diffie-Hellmanově problému (potažmo PDL).',
  },
  {
    term: 'DSA',
    aliases: ['DSS'],
    category: 'Asymetrická kryptografie',
    definition:
      'Digital Signature Algorithm — varianta ElGamalu specializovaná pro podpis (Digital Signature Standard).',
  },
  {
    term: 'Pohlig-Hellman',
    aliases: ['Pohlig–Hellman'],
    category: 'Asymetrická kryptografie',
    definition:
      'Exponenciální šifra c = pᵉ mod m. Také algoritmus pro výpočet PDL ve skupinách s hladkým řádem.',
  },
  {
    term: 'Eulerova funkce',
    aliases: ['Eulerovy funkce', 'φ(n)', 'Φ(n)'],
    category: 'Teorie čísel',
    definition: 'φ(n) = počet čísel z {1,…,n} nesoudělných s n. Pro prvočíslo: φ(p) = p − 1.',
  },
  {
    term: 'Malá Fermatova věta',
    aliases: ['malé Fermatovy věty', 'Fermatova malá věta'],
    category: 'Teorie čísel',
    definition: 'Pro prvočíslo p a a nesoudělné s p platí a^{p−1} ≡ 1 (mod p).',
  },
  {
    term: 'Eulerova věta',
    category: 'Teorie čísel',
    definition: 'Pro gcd(a, n) = 1 platí a^{φ(n)} ≡ 1 (mod n). Zobecnění Fermatovy věty.',
  },
  {
    term: 'Eukleidův algoritmus',
    aliases: ['Eukleidova algoritmu', 'Euklidovým algoritmem', 'Eukleidovým algoritmem'],
    category: 'Teorie čísel',
    definition: 'Rychlý algoritmus výpočtu největšího společného dělitele gcd(a, b).',
  },
  {
    term: 'Rozšířený Eukleidův algoritmus',
    aliases: ['rozšířeným Eukleidovým algoritmem', 'rozšířeným Euklidovým algoritmem'],
    category: 'Teorie čísel',
    definition:
      'Varianta Euklidova alg., která vrátí i koeficienty x, y s ax + by = gcd(a, b). Umožňuje výpočet modulární inverze.',
  },
  {
    term: 'Square & Multiply',
    aliases: ['Square &amp; Multiply', 'square-and-multiply'],
    category: 'Algoritmy',
    definition:
      'Algoritmus rychlého modulárního umocňování po bitech exponentu. Složitost O(k³) bitových operací pro k-bitové číslo.',
  },
  {
    term: 'PDL',
    aliases: ['diskrétní logaritmus', 'diskrétního logaritmu', 'problému diskrétního logaritmu'],
    category: 'Teorie čísel',
    definition:
      'Problém diskrétního logaritmu — pro dané b, y v cyklické grupě najít k s b^k = y. Základ Diffie-Hellmana a ElGamalu.',
  },
  {
    term: 'ECDLP',
    category: 'Eliptické křivky',
    definition:
      'Eliptická varianta PDL: pro P, Q ∈ E najít k s Q = kP. Bezpečnostní základ ECC.',
  },
  {
    term: 'ECC',
    aliases: ['kryptografie eliptických křivek'],
    category: 'Eliptické křivky',
    definition:
      'Asymetrická kryptografie nad eliptickými křivkami. Bezpečnost srovnatelná s RSA při kratším klíči (256 b ≈ 3072 b RSA).',
  },
  {
    term: 'Eliptická křivka',
    aliases: ['eliptické křivky', 'eliptickou křivku'],
    category: 'Eliptické křivky',
    definition:
      'Množina bodů (x, y) splňujících y² = x³ + ax + b nad daným tělesem, doplněná o bod v nekonečnu O.',
  },
  {
    term: 'Galoisovo těleso',
    aliases: ['Galoisova tělesa', 'GF(2⁸)', 'GF(p)'],
    category: 'Teorie čísel',
    definition: 'Konečné těleso. AES počítá nad GF(2⁸) s redukčním polynomem x⁸ + x⁴ + x³ + x + 1.',
  },

  // --- Bezpečnost / teorie ----------------------------------------------
  {
    term: 'Jednosměrná funkce',
    aliases: ['jednosměrné funkce', 'jednosměrnou funkci'],
    category: 'Bezpečnost',
    definition:
      'Funkce f: snadno vypočítatelná, ale prakticky neinvertovatelná (např. násobení vs. faktorizace).',
  },
  {
    term: 'Padací vrátka',
    aliases: ['padacími vrátky'],
    category: 'Bezpečnost',
    definition: 'Jednosměrná funkce, kterou lze invertovat jen se znalostí tajné informace.',
  },
  {
    term: 'Kerckhoffsův princip',
    aliases: ['Kerckhoffsova principu'],
    category: 'Bezpečnost',
    definition:
      'Bezpečnost šifry musí záviset jen na utajení klíče, ne algoritmu. Útočník zná systém.',
  },
  {
    term: 'Nepodmíněná bezpečnost',
    aliases: ['nepodmíněně bezpečný'],
    category: 'Bezpečnost',
    definition: 'Šifru nelze prolomit bez ohledu na výpočetní prostředky útočníka (např. one-time pad).',
  },
  {
    term: 'Absolutní bezpečnost',
    aliases: ['absolutně bezpečný'],
    category: 'Bezpečnost',
    definition: 'Útočník nezíská žádnou novou informaci o OT ani opakovaným použitím šifry.',
  },
  {
    term: 'Podmíněná bezpečnost',
    aliases: ['podmíněně bezpečný'],
    category: 'Bezpečnost',
    definition:
      'Prolomení vyžaduje výpočetní prostředky, které útočník nemá. Dělíme na prokazatelnou a výpočetní.',
  },
  {
    term: 'Entropie',
    aliases: ['entropii', 'entropií'],
    category: 'Teorie informace',
    definition:
      'H(X) = −Σ pᵢ log₂ pᵢ. Míra neurčitosti / průměrný počet bitů potřebných k optimálnímu zakódování.',
  },
  {
    term: 'Redundance',
    aliases: ['redundanci', 'redundancí'],
    category: 'Teorie informace',
    definition: 'Rozdíl absolutní a skutečné obsažnosti: D = R − r. Pro angličtinu ~3,2 b/znak.',
  },
  {
    term: 'Vzdálenost jednoznačnosti',
    aliases: ['vzdálenosti jednoznačnosti'],
    category: 'Teorie informace',
    definition: 'δᵤ = H(K)/D — počet znaků ŠT potřebných, aby zbýval v průměru jediný OT.',
  },
  {
    term: 'Konfúze',
    aliases: ['konfúzi', 'konfúzí'],
    category: 'Bezpečnost',
    definition:
      'Shannonův princip: vztah mezi ŠT a klíčem má být složitý. Realizuje se substitucí, S-boxy.',
  },
  {
    term: 'Difúze',
    aliases: ['difúzi', 'difúzí'],
    category: 'Bezpečnost',
    definition:
      'Shannonův princip: redundance OT má být rozprostřena po celém ŠT. Realizuje se transpozicí, MixColumns.',
  },
  {
    term: 'P',
    category: 'Teorie složitosti',
    definition: 'Třída problémů řešitelných v polynomiálním čase deterministickým Turingovým strojem.',
  },
  {
    term: 'NP',
    category: 'Teorie složitosti',
    definition: 'Problémy řešitelné v polynomiálním čase nedeterministickým TS, resp. ověřitelné v PT.',
  },
  {
    term: 'NP-úplné',
    aliases: ['NP-úplný', 'NP-těžký'],
    category: 'Teorie složitosti',
    definition: 'Problémy v NP, na něž lze polynomiálně redukovat každý problém z NP.',
  },

  // --- Teorie čísel / generování ----------------------------------------
  {
    term: 'Kvadratické residuum',
    aliases: ['kvadratickým residuem', 'kvadratickými residui'],
    category: 'Teorie čísel',
    definition: 'a je QR mod m, pokud gcd(a, m) = 1 a x² ≡ a (mod m) má řešení.',
  },
  {
    term: 'Legendreův symbol',
    aliases: ['Legendreova symbolu'],
    category: 'Teorie čísel',
    definition: '(a/p) = +1, je-li a kvadratickým residuem mod p; −1 jinak (pro liché prvočíslo p).',
  },
  {
    term: 'Jacobiho symbol',
    category: 'Teorie čísel',
    definition: 'Zobecnění Legendreova symbolu pro liché složené n: [a/n] = Π (a/pᵢ)^αᵢ.',
  },
  {
    term: 'Čínská věta o zbytcích',
    aliases: ['CRT', 'čínské věty o zbytcích'],
    category: 'Teorie čísel',
    definition:
      'Soustava x ≡ aᵢ (mod mᵢ) s po dvou nesoudělnými mᵢ má jediné řešení mod M = m₁·…·mᵣ.',
  },
  {
    term: 'Generátor',
    aliases: ['generátoru', 'generátorem', 'generátory'],
    category: 'Teorie čísel',
    definition: 'Prvek g cyklické grupy, jehož mocniny pokrývají celou grupu.',
  },
  {
    term: 'Solovay-Strassenův test',
    aliases: ['Solovay–Strassenův test'],
    category: 'Generování klíčů',
    definition:
      'Pravděpodobnostní test prvočíselnosti porovnávající a^{(p−1)/2} mod p a Jacobiho symbol. Chyba ≤ 1/2.',
  },
  {
    term: 'Rabin-Millerův test',
    aliases: ['Rabin–Millerův test', 'Miller-Rabin'],
    category: 'Generování klíčů',
    definition: 'Nejpoužívanější test prvočíselnosti. Pravděpodobnost falešného úspěchu ≤ 1/4 na test.',
  },
  {
    term: 'Lehmannův test',
    category: 'Generování klíčů',
    definition: 'Jednodušší variantou Solovay-Strassena: kontroluje pouze a^{(p−1)/2} ≡ ±1 (mod p).',
  },
  {
    term: 'NFS',
    aliases: ['Number Field Sieve', 'funkční síto'],
    category: 'Generování klíčů',
    definition:
      'Number Field Sieve — nejrychlejší známý algoritmus pro faktorizaci velkých čísel (≥ 110 cifer).',
  },
  {
    term: 'QS',
    aliases: ['Quadratic Sieve'],
    category: 'Generování klíčů',
    definition: 'Quadratic Sieve — faktorizační algoritmus pro čísla do ~110 cifer.',
  },
  {
    term: 'ECM',
    aliases: ['Elliptic Curve Method'],
    category: 'Generování klíčů',
    definition: 'Elliptic Curve Method — faktorizační algoritmus využívající eliptické křivky.',
  },
  {
    term: 'LCG',
    aliases: ['lineární kongruenční generátor', 'lineárního kongruenčního generátoru'],
    category: 'Generování klíčů',
    definition:
      'Linear congruential generator: Xₙ₊₁ = (a·Xₙ + c) mod m. Rychlý, ale kryptograficky nebezpečný.',
  },
  {
    term: 'PRNG',
    aliases: ['pseudonáhodný generátor', 'pseudonáhodné generátory'],
    category: 'Generování klíčů',
    definition: 'Pseudo-Random Number Generator — deterministický generátor s vlastnostmi náhodnosti.',
  },
  {
    term: 'TRNG',
    aliases: ['skutečně náhodný generátor'],
    category: 'Generování klíčů',
    definition: 'True Random Number Generator — využívá fyzický zdroj entropie (šum, rozpad atd.).',
  },
  {
    term: 'Blum-Blum-Shub',
    aliases: ['Blum–Blum–Shub'],
    category: 'Generování klíčů',
    definition:
      'Kryptograficky bezpečný PRNG: Xₙ₊₁ = Xₙ² mod m, kde m = pq, p, q ≡ 3 (mod 4). Bezpečnost závisí na faktorizaci.',
  },
  {
    term: 'Von Neumannův dekorelátor',
    category: 'Generování klíčů',
    definition: 'Postprocessing TRNG: bity po dvojicích, 00/11 zahodit, 01→0, 10→1.',
  },

  // --- PKI / podpisy ----------------------------------------------------
  {
    term: 'PKI',
    aliases: ['Public Key Infrastructure'],
    category: 'PKI',
    definition:
      'Infrastruktura veřejného klíče — soubor opatření pro vydávání, správu a odvolávání klíčů a certifikátů.',
  },
  {
    term: 'Certifikát',
    aliases: ['certifikátu', 'certifikátem', 'certifikáty'],
    category: 'PKI',
    definition:
      'Datová struktura s veřejným klíčem, identifikací uživatele a podpisem certifikační autority.',
  },
  {
    term: 'Certifikační autorita',
    aliases: ['CA', 'certifikační autority', 'certifikačním autoritám'],
    category: 'PKI',
    definition: 'Důvěryhodná třetí strana, která vydává, podepisuje a odvolává certifikáty.',
  },
  {
    term: 'Registrační autorita',
    aliases: ['RA', 'registrační autority'],
    category: 'PKI',
    definition: 'Subjekt CA přijímající žádosti, kontrolující údaje a předávající certifikáty.',
  },
  {
    term: 'X.509',
    category: 'PKI',
    definition: 'Standard ITU-T formátu digitálních certifikátů (součást X.500). Verze 3 nejrozšířenější.',
  },
  {
    term: 'CRL',
    aliases: ['seznam odvolaných certifikátů'],
    category: 'PKI',
    definition: 'Certificate Revocation List — seznam předčasně odvolaných certifikátů.',
  },
  {
    term: 'Křížová certifikace',
    aliases: ['křížové certifikace', 'křížový certifikát'],
    category: 'PKI',
    definition: 'CA₁ podepíše VK CA₂ a naopak — spojení dvou hierarchií certifikátů.',
  },
  {
    term: 'Digitální podpis',
    aliases: ['digitálního podpisu', 'digitálním podpisem'],
    category: 'PKI',
    definition:
      'Kryptografická značka vytvořená SK podepisujícího; ověřitelná jeho VK. Zaručuje integritu, autentizaci a nepopiratelnost.',
  },
  {
    term: 'Nepopiratelnost',
    aliases: ['nepopiratelností'],
    category: 'PKI',
    definition: 'Podepisující nemůže popřít autorství. Vlastnost asymetrického podpisu, ne MAC.',
  },
  {
    term: 'Integrita',
    aliases: ['integritu', 'integritou'],
    category: 'Bezpečnost',
    definition: 'Záruka, že zpráva nebyla po cestě pozměněna. Realizuje se hašem, MAC nebo podpisem.',
  },
  {
    term: 'Autentizace',
    aliases: ['autentizaci', 'autentizací'],
    category: 'Bezpečnost',
    definition:
      'Ověření identity strany či původu dat. Faktory: co víme (heslo), co máme (token), co jsme (biometrie).',
  },
  {
    term: 'Důvěrnost',
    aliases: ['důvěrnost', 'důvěrnosti'],
    category: 'Bezpečnost',
    definition: 'Záruka, že obsah zprávy zná jen oprávněný příjemce. Realizuje se šifrováním.',
  },

  // --- Čipové karty / FIDO2 ---------------------------------------------
  {
    term: 'Čipová karta',
    aliases: ['čipové karty', 'čipovou kartu', 'ČK'],
    category: 'Čipové karty',
    definition: 'Plastová karta s integrovaným obvodem (paměťovým nebo procesorovým).',
  },
  {
    term: 'APDU',
    aliases: ['APDU'],
    category: 'Čipové karty',
    definition:
      'Application Protocol Data Unit (ISO 7816-4) — formát zpráv mezi terminálem a čipovou kartou.',
  },
  {
    term: 'ISO 7816',
    category: 'Čipové karty',
    definition: 'Norma pro kontaktní čipové karty (fyzika, protokoly, příkazy, souborový systém).',
  },
  {
    term: 'ISO 14443',
    category: 'Čipové karty',
    definition: 'Norma pro bezkontaktní karty (proximity, 13,56 MHz). Základ NFC.',
  },
  {
    term: 'NFC',
    category: 'Čipové karty',
    definition: 'Near Field Communication — bezkontaktní komunikace na krátkou vzdálenost (13,56 MHz).',
  },
  {
    term: 'EMV',
    category: 'Čipové karty',
    definition: 'Europay-Mastercard-Visa — standard platebních čipových karet.',
  },
  {
    term: 'FIDO2',
    aliases: ['WebAuthn'],
    category: 'Čipové karty',
    definition: 'Standard pro silnou autentizaci hardwarovými tokeny (security keys, passkeys).',
  },
  {
    term: 'CTAP2',
    category: 'Čipové karty',
    definition: 'Client-to-Authenticator Protocol v2 — protokol mezi klientem (prohlížečem) a FIDO2 tokenem.',
  },
  {
    term: 'Java Card',
    category: 'Čipové karty',
    definition: 'Podmnožina Java běžící na čipové kartě s JCVM. Aplikace se nazývají applety.',
  },
  {
    term: 'GlobalPlatform',
    category: 'Čipové karty',
    definition: 'Standard pro správu aplikací (appletů) na čipové kartě (dříve OpenPlatform).',
  },
  {
    term: 'MF',
    aliases: ['Master File'],
    category: 'Čipové karty',
    definition: 'Master File — kořen souborového systému čipové karty (FID 3F00).',
  },
  {
    term: 'DF',
    aliases: ['Dedicated File'],
    category: 'Čipové karty',
    definition: 'Dedicated File — adresář / kontejner aplikace na kartě.',
  },
  {
    term: 'EF',
    aliases: ['Elementary File'],
    category: 'Čipové karty',
    definition:
      'Elementary File — datový soubor na čipové kartě (transparentní nebo strukturovaný po záznamech).',
  },
  {
    term: 'AID',
    category: 'Čipové karty',
    definition: 'Application Identifier — až 16bajtový identifikátor appletu / DF.',
  },
  {
    term: 'TLV',
    category: 'Čipové karty',
    definition: 'Tag-Length-Value — formát strukturovaných dat v APDU.',
  },
  {
    term: 'Secure Messaging',
    category: 'Čipové karty',
    definition: 'Zabezpečení APDU mezi terminálem a kartou: MAC, případně i šifrování.',
  },
  {
    term: 'Diverzifikace klíčů',
    aliases: ['diverzifikace klíčů', 'diverzifikaci klíčů'],
    category: 'Čipové karty',
    definition:
      'Z jednoho Master Key se KDF odvodí klíč pro konkrétní kartu; kompromitace 1 karty neohrozí ostatní.',
  },

  // --- Kvantová ---------------------------------------------------------
  {
    term: 'Qubit',
    aliases: ['qubity', 'qubitu'],
    category: 'Kvantová kryptografie',
    definition:
      'Kvantový bit — stav |ψ⟩ = ω₀|0⟩ + ω₁|1⟩ s |ω₀|² + |ω₁|² = 1. Měření kolabuje do |0⟩ nebo |1⟩.',
  },
  {
    term: 'BB84',
    category: 'Kvantová kryptografie',
    definition:
      'Protokol kvantové distribuce klíče (Bennett-Brassard, 1984) využívající dvě konjugované polarizační báze.',
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
