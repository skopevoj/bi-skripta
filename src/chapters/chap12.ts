import type { Block, Chapter } from '../types'

function alg(number: string, id: string, title: string, html: string): Block[] {
  return [
    { kind: 'h3', id, number, title },
    { kind: 'p', html },
  ]
}

export const chap12: Chapter = {
  id: 'chap-12',
  number: '12',
  title: 'Rychlý přehled algoritmů',
  intro: [
    {
      kind: 'p',
      html: 'Jednostránkový tahák k algoritmům: u každého je krátce řečeno, k čemu je, jaká čísla si pamatovat a hlavně co by u zkoušky mělo zaznít. Je to mapa před ústní odpovědí, ne náhrada detailních kapitol.',
    },
    {
      kind: 'table',
      caption: 'Rychlé bezpečnostní ekvivalence',
      headers: ['Síla', 'Symetrika', 'RSA / DH', 'ECC'],
      rows: [
        ['112 b', '3DES / minimum legacy', '2048 b', '224-255 b'],
        ['128 b', 'AES-128', '3072 b', 'P-256'],
        ['192 b', 'AES-192', '7680 b', 'P-384'],
        ['256 b', 'AES-256', '15360 b', 'P-521'],
      ],
    },
    ...alg(
      '12.1',
      'subsec-12-caesar',
      'Caesarova a posuvná šifra',
      '<strong>U zkoušky:</strong> monoalfabetická substituce, kde se každé písmeno posune o konstantu modulo velikost abecedy. Umět napsat $c = p + k \\pmod{26}$ a říct, že klíčový prostor je směšně malý: pro anglickou abecedu jen 26 posunů. <strong>Slabina:</strong> hrubá síla a frekvenční analýza, protože stejné písmeno se vždy šifruje stejně.',
    ),
    ...alg(
      '12.2',
      'subsec-12-affine',
      'Afinní šifra',
      '<strong>U zkoušky:</strong> zobecnění posuvné šifry ve tvaru $c = ap + b \\pmod{m}$, kde $a$ musí být nesoudělné s $m$, aby existovala inverze. Pro abecedu 26 znaků je počet klíčů $\\varphi(26) \\cdot 26 = 312$. <strong>Slabina:</strong> pořád zachovává frekvenční strukturu jazyka a stačí málo známého nebo odhadnutého otevřeného textu.',
    ),
    ...alg(
      '12.3',
      'subsec-12-hill',
      'Hillova šifra',
      '<strong>U zkoušky:</strong> bloková klasická šifra založená na násobení vektoru písmen maticí modulo $m$. Klíčem je invertibilní matice, tedy determinant musí mít inverzi modulo $m$. <strong>Co zdůraznit:</strong> přidává difúzi, protože jedno písmeno šifrového textu závisí na celém bloku. <strong>Slabina:</strong> je lineární, takže známý otevřený text vede na soustavu rovnic pro klíč.',
    ),
    ...alg(
      '12.4',
      'subsec-12-vigenere',
      'Vigenèrova šifra',
      '<strong>U zkoušky:</strong> polyalfabetická substituce: opakované heslo určuje různý posun pro různé pozice zprávy. Umět říct, že po zjištění délky hesla se problém rozpadne na několik Caesarových šifer. <strong>Slabina:</strong> perioda hesla; Kasiskiho metoda nebo index koincidence pomáhají odhadnout délku klíče.',
    ),
    ...alg(
      '12.5',
      'subsec-12-transposition',
      'Transpoziční šifry',
      '<strong>U zkoušky:</strong> nemění symboly, pouze jejich pořadí. U sloupcové transpozice je klíčem permutace sloupců. <strong>Důležité rozlišení:</strong> substituce mění znaky, transpozice mění pozice. <strong>Slabina:</strong> četnosti jednotlivých písmen zůstávají přesně stejné, takže šifra sama o sobě dobře neutají jazykové statistiky.',
    ),
    ...alg(
      '12.6',
      'subsec-12-vernam',
      'Vernamova šifra / one-time pad',
      '<strong>U zkoušky:</strong> XOR otevřeného textu s náhodným klíčem stejné délky. Při dokonale náhodném, tajném a jednorázově použitém klíči má nepodmíněnou bezpečnost. <strong>Čísla:</strong> klíč musí být stejně dlouhý jako zpráva. <strong>Slabina v praxi:</strong> distribuce klíče; opakované použití klíče vytvoří two-time pad.',
    ),
    ...alg(
      '12.7',
      'subsec-12-stream',
      'Proudové šifry obecně',
      '<strong>U zkoušky:</strong> generují proud klíče, který se obvykle XORuje s otevřeným textem. Jsou rychlé a šifrují po bitech nebo bajtech. Rozlišit synchronní a samosynchronizující proudové šifry. <strong>Nejdůležitější věta:</strong> stejný proud klíče se nesmí použít dvakrát, jinak XOR dvou šifrových textů odhalí XOR otevřených textů.',
    ),
    ...alg(
      '12.8',
      'subsec-12-rc4',
      'RC4',
      '<strong>U zkoušky:</strong> historická proudová šifra se stavem jako permutace 256 bajtů. Má inicializační algoritmus KSA a generátor PRGA. <strong>Co říct dnes:</strong> RC4 je prakticky opuštěná kvůli biasům a slabinám, zejména ve starých protokolech typu WEP/TLS.',
    ),
    ...alg(
      '12.9',
      'subsec-12-salsa-chacha',
      'Salsa20 a ChaCha20',
      '<strong>U zkoušky:</strong> moderní proudové šifry založené na ARX operacích: sčítání, rotace, XOR. Pracují s vnitřním stavem a quarter-round funkcí, která míchá slova. <strong>Čísla:</strong> typicky 256bitový klíč a nonce; výstup se používá jako keystream. <strong>Past:</strong> nikdy neopakovat nonce se stejným klíčem.',
    ),
    ...alg(
      '12.10',
      'subsec-12-a51',
      'A5/1',
      '<strong>U zkoušky:</strong> proudová šifra z GSM založená na LFSR registrech a nepravidelném taktování většinovou funkcí. Je dobrá na vysvětlení, jak lze z lineárních registrů vyrobit nelineární chování. <strong>Co dodat:</strong> dnes je považovaná za prolomenou historickou konstrukci.',
    ),
    ...alg(
      '12.11',
      'subsec-12-block',
      'Blokové šifry obecně',
      '<strong>U zkoušky:</strong> šifrují pevně dlouhý blok pomocí tajného klíče a realizují permutaci prostoru bloků. Samy o sobě neumí bezpečně šifrovat libovolně dlouhou zprávu; k tomu potřebují operační mód. Zmínit konfúzi, difúzi, rundy a rozdíl proti proudovým šifrám.',
    ),
    ...alg(
      '12.12',
      'subsec-12-des',
      'DES',
      '<strong>U zkoušky:</strong> Feistelova bloková šifra se 64bitovým blokem, efektivním 56bitovým klíčem a 16 rundami. Dešifrování používá stejnou strukturu s rundovními klíči v opačném pořadí. <strong>Co říct dnes:</strong> 56bitový klíč je příliš krátký, DES je prolomitelný hrubou silou.',
    ),
    ...alg(
      '12.13',
      'subsec-12-3des',
      'Triple DES / 3DES',
      '<strong>U zkoušky:</strong> opakované použití DES, typicky EDE: encrypt-decrypt-encrypt. Je zpětně kompatibilní s DES při stejných klíčích. <strong>Čísla:</strong> blok zůstává 64 bitů, efektivní bezpečnost je u běžné varianty kolem 112 bitů. <strong>Co dodat:</strong> legacy, pomalé a s malým blokem.',
    ),
    ...alg(
      '12.14',
      'subsec-12-aes',
      'AES',
      '<strong>U zkoušky:</strong> moderní bloková šifra Rijndael, ne Feistel. Má 128bitový blok, klíče 128/192/256 bitů a 10/12/14 rund. Runda používá SubBytes, ShiftRows, MixColumns a AddRoundKey. <strong>Důležité:</strong> bezpečnost v praxi závisí i na správném módu a zacházení s IV/nonce.',
    ),
    ...alg(
      '12.15',
      'subsec-12-ecb',
      'ECB',
      '<strong>U zkoušky:</strong> nejjednodušší mód blokové šifry: každý blok se šifruje nezávisle. <strong>Hlavní věta:</strong> stejné bloky otevřeného textu dávají stejné bloky šifrového textu, takže ECB zachovává vzory. <strong>Závěr:</strong> pro strukturovaná data nepoužívat.',
    ),
    ...alg(
      '12.16',
      'subsec-12-cbc',
      'CBC',
      '<strong>U zkoušky:</strong> každý otevřený blok se před šifrováním XORuje s předchozím šifrovým blokem; první blok používá IV. <strong>Čísla:</strong> IV má délku bloku a má být náhodné/nepředvídatelné. <strong>Vlastnosti:</strong> skryje opakované bloky, chyba v šifrovém textu ovlivní dešifrování daného a následujícího bloku.',
    ),
    ...alg(
      '12.17',
      'subsec-12-cfb',
      'CFB',
      '<strong>U zkoušky:</strong> feedback mód, který z blokové šifry dělá proudovou šifru; šifruje se předchozí šifrový blok nebo IV a výsledek se XORuje se zprávou. <strong>Co zmínit:</strong> umí pracovat po menších jednotkách a po chybě se po určité době znovu synchronizuje.',
    ),
    ...alg(
      '12.18',
      'subsec-12-ofb',
      'OFB',
      '<strong>U zkoušky:</strong> generuje keystream opakovaným šifrováním vnitřního stavu, nezávisle na šifrovém textu. Chyba v přenosu změní jen odpovídající bity otevřeného textu. <strong>Past:</strong> opakované IV se stejným klíčem znamená opakovaný proud klíče.',
    ),
    ...alg(
      '12.19',
      'subsec-12-ctr',
      'CTR',
      '<strong>U zkoušky:</strong> šifruje nonce a čítač, čímž vzniká proud klíče; ten se XORuje s otevřeným textem. <strong>Výhody:</strong> paralelizace, náhodný přístup, jednoduché šifrování i dešifrování. <strong>Nejdůležitější:</strong> nikdy neopakovat stejný nonce/čítač se stejným klíčem.',
    ),
    ...alg(
      '12.20',
      'subsec-12-cbc-mac',
      'CBC-MAC',
      '<strong>U zkoušky:</strong> autentizační kód založený na CBC, kde se jako značka bere poslední blok. <strong>Co říct:</strong> pro pevnou délku zpráv může být bezpečný, pro proměnlivou délku je potřeba upravená konstrukce. MAC řeší integritu a autenticitu se sdíleným tajným klíčem.',
    ),
    ...alg(
      '12.21',
      'subsec-12-hash',
      'Hašovací funkce',
      '<strong>U zkoušky:</strong> jednosměrná funkce, která z libovolně dlouhého vstupu dělá pevně dlouhý otisk. Vlastnosti: odolnost vůči nalezení preimage, second preimage a kolize. <strong>Číslo:</strong> u n-bitového hashe se kolize hledají řádově za $2^{n/2}$ pokusů kvůli narozeninovému paradoxu.',
    ),
    ...alg(
      '12.22',
      'subsec-12-sha1',
      'SHA-1',
      '<strong>U zkoušky:</strong> iterativní hašovací funkce Merkle-Damgardova typu s 160bitovým výstupem. Umět zmínit expanzi zprávy a rundovou strukturu. <strong>Současný stav:</strong> kolize jsou prakticky dosažitelné, proto SHA-1 nepoužívat tam, kde záleží na bezkoliznosti.',
    ),
    ...alg(
      '12.23',
      'subsec-12-sha2',
      'SHA-2 / SHA-256 / SHA-512',
      '<strong>U zkoušky:</strong> modernější rodina hašovacích funkcí. SHA-256 má 256bitový výstup, takže kolizní odolnost je zhruba 128 bitů; SHA-512 má 512bitový výstup. <strong>Co zdůraznit:</strong> hash sám nedokazuje původ zprávy, k tomu je potřeba MAC nebo podpis.',
    ),
    ...alg(
      '12.24',
      'subsec-12-hmac',
      'HMAC',
      '<strong>U zkoušky:</strong> konstrukce MAC z hašovací funkce a sdíleného tajného klíče, používá vnitřní a vnější padding. <strong>Účel:</strong> integrita a autenticita zprávy mezi stranami, které sdílí klíč. <strong>Rozlišení:</strong> není to digitální podpis, protože příjemce umí značku také vytvořit.',
    ),
    ...alg(
      '12.25',
      'subsec-12-kdf',
      'KDF',
      '<strong>U zkoušky:</strong> key derivation function odvozuje jeden nebo více klíčů ze sdíleného tajemství, hesla nebo master klíče. <strong>Co zmínit:</strong> oddělení účelů klíčů, sůl/kontext a to, že obyčejný hash hesla není dobrá password KDF.',
    ),
    ...alg(
      '12.26',
      'subsec-12-dh',
      'Diffie-Hellman',
      '<strong>U zkoušky:</strong> protokol pro dohodu sdíleného tajemství přes veřejný kanál. Strany zveřejní $g^a$ a $g^b$ a obě dopočítají $g^{ab}$. <strong>Bezpečnost:</strong> stojí na problému diskrétního logaritmu. <strong>Past:</strong> bez autentizace je zranitelný man-in-the-middle útokem.',
    ),
    ...alg(
      '12.27',
      'subsec-12-rsa',
      'RSA',
      '<strong>U zkoušky:</strong> veřejný modul $n = pq$, Eulerova funkce $\\varphi(n)$, veřejný exponent $e$ a soukromý exponent $d = e^{-1} \\pmod{\\varphi(n)}$. Šifrování $c = m^e \\bmod n$, dešifrování $m = c^d \\bmod n$. <strong>Bezpečnost:</strong> faktorizace $n$. <strong>Prakticky:</strong> nepoužívat učebnicové RSA bez paddingu.',
    ),
    ...alg(
      '12.28',
      'subsec-12-rsa-crt',
      'RSA-CRT',
      '<strong>U zkoušky:</strong> urychlení RSA tím, že se dešifrování počítá zvlášť modulo $p$ a modulo $q$, pak se výsledky složí Čínskou větou o zbytcích. <strong>Proč:</strong> menší moduly znamenají rychlejší mocnění. <strong>Past:</strong> v praxi je potřeba chránit se proti chybovým útokům.',
    ),
    ...alg(
      '12.29',
      'subsec-12-elgamal',
      'ElGamal',
      '<strong>U zkoušky:</strong> asymetrické šifrování založené na diskrétním logaritmu a příbuzné Diffie-Hellmanovi. Používá náhodné jednorázové $k$, takže stejné zprávy se mohou šifrovat pokaždé jinak. <strong>Co zdůraznit:</strong> náhodnost je kritická a šifrový text je větší než otevřený text.',
    ),
    ...alg(
      '12.30',
      'subsec-12-dsa',
      'DSA',
      '<strong>U zkoušky:</strong> algoritmus digitálního podpisu založený na diskrétním logaritmu. Podpis používá jednorázovou náhodnou hodnotu $k$. <strong>Nejdůležitější věta:</strong> když se $k$ zopakuje nebo unikne, lze získat soukromý klíč. DSA slouží k podpisu, ne k šifrování.',
    ),
    ...alg(
      '12.31',
      'subsec-12-ecc',
      'Eliptické křivky / ECC',
      '<strong>U zkoušky:</strong> místo násobení v konečné grupě modulo prvočíslo pracujeme s body na eliptické křivce a jejich sčítáním. Bezpečnost stojí na ECDLP, problému diskrétního logaritmu na křivce. <strong>Výhoda:</strong> kratší klíče při stejné bezpečnostní síle, např. P-256 zhruba odpovídá 128bitové síle.',
    ),
    ...alg(
      '12.32',
      'subsec-12-ecdh-ecdsa',
      'ECDH a ECDSA',
      '<strong>U zkoušky:</strong> ECDH je Diffie-Hellman na eliptických křivkách pro dohodu klíče, ECDSA je podpisová varianta DSA nad eliptickou křivkou. <strong>Čísla:</strong> P-256 přibližně 128 bitů, P-384 přibližně 192 bitů. <strong>Past:</strong> validace bodů a neopakování nonce u ECDSA.',
    ),
    ...alg(
      '12.33',
      'subsec-12-pki',
      'PKI a certifikáty',
      '<strong>U zkoušky:</strong> PKI není šifra, ale infrastruktura důvěry: certifikát svazuje veřejný klíč s identitou a certifikační autorita tuto vazbu podepisuje. Umět popsat řetězec důvěry, kořenovou CA, platnost a revokaci. <strong>Hlavní myšlenka:</strong> kryptografie řeší matematiku, PKI řeší komu klíč patří.',
    ),
    ...alg(
      '12.34',
      'subsec-12-bb84',
      'BB84',
      '<strong>U zkoušky:</strong> kvantový protokol pro distribuci klíče, ne šifra pro přímé šifrování zprávy. Používá měření qubitů v různých bázích; odposlech se projeví zvýšenou chybovostí. <strong>Co dodat:</strong> po kvantové části následuje porovnání bází, odhad chyb, oprava a zesílení soukromí.',
    ),
  ],
  sections: [],
}
