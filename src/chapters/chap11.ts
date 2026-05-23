import type { Chapter } from '../types'

export const chap11: Chapter = {
  id: 'chap-11',
  number: '11',
  title: 'Infrastruktura veřejného klíče (PKI)',
  intro: [
    {
      kind: 'p',
      html: 'Distribuce veřejných klíčů a tajných klíčů pomocí asymetrické kryptografie. Klíčovou hrozbou je <strong>podvržení veřejného klíče</strong> — útok typu man-in-the-middle.',
    },
  ],
  sections: [
    {
      id: 'sec-11-1',
      number: '11.1',
      title: 'Podvržení veřejného klíče',
      blocks: [
        {
          kind: 'p',
          html: 'A pošle B svůj $VK_A$ a $ID_A$. Aktivní útočník U zachytí zprávu a podstrčí B vlastní $VK_U$. B šifruje zprávy klíčem $VK_U$, U je dešifruje, přečte/změní a přepošle A zašifrované $VK_A$. Útok je pro B nedetekovatelný.',
        },
        {
          kind: 'p',
          html: 'Distribuce veřejných klíčů má 4 techniky:',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Zveřejnění</strong> (public announcement) — email, web. Jednoduché, ale zranitelné.',
            '<strong>Veřejně dostupný adresář</strong> spravovaný důvěryhodnou autoritou.',
            '<strong>Autorita pro veřejné klíče</strong> (online služba).',
            '<strong>Certifikáty</strong> vydávané certifikační autoritou.',
          ],
        },
      ],
    },
    {
      id: 'sec-11-2',
      number: '11.2',
      title: 'Autorita pro veřejné klíče (online)',
      blocks: [
        {
          kind: 'p',
          html: 'Každý zná veřejný klíč Autority $VK_{Aut}$. Pro získání VK protějšku posílá A žádost s časovou značkou $T_1$, Autorita odpoví $E_{SK_{Aut}}(VK_B \\| \\text{Req.} \\| T_1)$ — podepsaná odpověď s časovou značkou a kopií žádosti.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '11.1',
          title: 'Výměna VK s autoritou (7 zpráv)',
          html: '(1) A → Aut: Req. ‖ $T_1$. (2) Aut → A: $E_{SK_{Aut}}(VK_B \\| \\text{Req.} \\| T_1)$. (3) A → B: $E_{VK_B}(ID_A \\| N_1)$. (4) B → Aut: Req. ‖ $T_2$. (5) Aut → B: $E_{SK_{Aut}}(VK_A \\| \\text{Req.} \\| T_2)$. (6) B → A: $E_{VK_A}(N_1 \\| N_2)$. (7) A → B: $E_{VK_B}(N_2)$.',
          plain:
            'Postup, jak si dvě strany získají autentický veřejný klíč protějšku přes důvěryhodnou autoritu. Pomocí jednorázových hodnot (nonces) si pak ověří, že na druhé straně opravdu je ten, kdo vlastní příslušný soukromý klíč.',
        },
        {
          kind: 'diagram',
          component: 'pubkey-authority',
          caption: 'Obr. 11.1: Výměna veřejných klíčů přes Autoritu. Sedm zpráv mezi A, Autoritou a B — kroky 1–2 a 4–5 získávají autentizovaný VK protějšku, kroky 3, 6, 7 tvoří vzájemnou autentizaci nonci N₁, N₂.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '11.1',
          title: 'Nevýhoda',
          html: 'Autorita je „úzké hrdlo“ — každý uživatel musí pro každý kontakt s Autoritou komunikovat. Řešením jsou <strong>certifikáty</strong>.',
        },
      ],
    },
    {
      id: 'sec-11-3',
      number: '11.3',
      title: 'Certifikáty a certifikační autorita (CA)',
      blocks: [
        {
          kind: 'callout',
          type: 'definice',
          number: '11.2',
          title: 'Certifikát',
          html: 'Datová struktura obsahující veřejný klíč žadatele, jeho identifikační údaje, dobu platnosti a další údaje. Celé je podepsáno soukromým klíčem CA — kdokoli s $VK_{Aut}$ může ověřit jeho pravost.',
          plain:
            'Veřejný klíč spojený s identitou (např. „www.banka.cz“) a podepsaný autoritou. Funguje jako „občanka“ veřejného klíče — díky podpisu autority si kdokoli ověří, že daný klíč opravdu patří konkrétnímu subjektu.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '11.3',
          title: 'Certifikační autorita (CA)',
          html: 'Důvěryhodná třetí strana, která vydává a spravuje certifikáty. <strong>Registrační autorita (RA)</strong> přijímá žádosti, kontroluje údaje a předává certifikáty žadatelům.',
          plain:
            'Důvěryhodná třetí strana, která ručí svým podpisem za pravost certifikátů. V prohlížeči vidíte zelený zámeček díky tomu, že některá CA podepsala certifikát serveru. Bez CA by web nemohl prokázat svou identitu.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '11.1',
          title: 'Struktura certifikátu',
          html: '$C_A = E_{SK_{Aut}}(T_1, ID_A, VK_A)$. Pro ověření: $D_{VK_{Aut}}(C_A) = (T_1, ID_A, VK_A)$.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-3-1',
          number: '11.3.1',
          title: 'Formát X.509',
        },
        {
          kind: 'p',
          html: 'ITU-T X.509 (součást X.500) definuje formáty certifikátů. Verze 3 obsahuje pole: formát certifikátu, sériové číslo, algoritmus podpisu, ID CA, dobu platnosti, ID uživatele, veřejný klíč uživatele, jednoznačné identifikátory CA a uživatele, rozšíření a podpis CA.',
        },
      ],
    },
    {
      id: 'sec-11-4',
      number: '11.4',
      title: 'Certifikační strom',
      blocks: [
        {
          kind: 'p',
          html: 'Pro velký počet uživatelů se zavádí <strong>hierarchie CA</strong>. Strom začíná kořenovou CA s kořenovým certifikátem (self-signed). Posloupnost certifikátů od certifikátu uživatele ke kořenovému se nazývá <strong>řetěz certifikátů</strong>.',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '11.4',
          title: 'Křížová certifikace',
          html: 'Spojení dvou stromů: CA$_1$ podepíše veřejný klíč CA$_2$ a naopak.<ul><li><strong>Jednosměrná</strong> — důvěra pouze v jednom směru.</li><li><strong>Obousměrná</strong> — vzájemná důvěra.</li></ul>',
          plain:
            'Dvě hierarchie CA si vzájemně podepíší veřejné klíče, aby si uživatelé z různých systémů mohli důvěřovat. Bez křížové certifikace by museli mít každou „cizí“ kořenovou CA předem nainstalovanou jako důvěryhodnou.',
        },
        {
          kind: 'diagram',
          component: 'cert-tree',
          caption: 'Obr. 11.2: Dvě hierarchie CA spojené obousměrnou křížovou certifikací. Každá hierarchie má kořen, sub-CA a koncové uživatele; kořeny si vzájemně podepisují veřejné klíče.',
        },
        {
          kind: 'callout',
          type: 'priklad',
          number: '11.2',
          title: 'Komunikace mezi stromy',
          html: 'C (ze stromu CA$_2$) chce komunikovat s A (ze stromu CA$_1$). A pošle: (1) certifikát A podepsaný CA$_1$, (2) kořenový certifikát CA$_1$, (3) křížový certifikát CA$_1$ podepsaný CA$_2$. Kořenový certifikát CA$_2$ C zná.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '11.2',
          title: 'Platnost certifikátu',
          html: 'Každý certifikát má vymezenou dobu platnosti. <strong>Odvolání</strong> (revocation) — držitel požádá CA o odvolání před koncem platnosti (kompromitace SK, změna CA). CA zveřejňuje <strong>seznam odvolaných certifikátů (CRL)</strong>.',
        },
        {
          kind: 'callout',
          type: 'poznamka',
          number: '11.3',
          title: 'PKI (Public Key Infrastructure)',
          html: 'Norma pro Internet vycházející z X.500. Specifikuje technická a organizační opatření pro vydávání, správu, používání a odvolávání klíčů a certifikátů. Cíl: kompatibilita SW.',
        },
      ],
    },
    {
      id: 'sec-11-5',
      number: '11.5',
      title: 'Distribuce tajných klíčů',
      blocks: [
        {
          kind: 'p',
          html: 'Asymetrická kryptografie umožňuje bezpečně přenést <strong>symetrický klíč relace</strong> $k_s$. Naivně: A pošle B svůj $VK_A$, B vrátí $E_{VK_A}(k_s)$. Bez ověření VK je tento postup zranitelný vůči podvržení (MITM).',
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '11.5',
          title: 'Distribuce s utajením a autentizací',
          html: 'Předpoklad: A a B si bezpečně vyměnili $VK_A$ a $VK_B$ (pomocí certifikátů). <br>(1) A → B: $E_{VK_B}(N_1 \\| ID_A)$. (2) B → A: $E_{VK_A}(N_1 \\| N_2)$. (3) A → B: $E_{VK_B}(N_2)$. (4) A → B: $E_{VK_B}(E_{SK_A}(k_s))$ — klíč $k_s$ je podepsán A a šifrován $VK_B$.',
          plain:
            'Bezpečný způsob, jak Alice pošle Bobovi symetrický klíč relace. Klíč nejprve podepíše (důkaz, že je od ní), pak ho zašifruje veřejným klíčem Boba (jen Bob ho přečte). Nonces N1, N2 přitom brání replay útokům.',
        },
        {
          kind: 'callout',
          type: 'dusledek',
          number: '11.1',
          title: 'Vlastnosti protokolu',
          html: 'Tato koncepce zaručuje <strong>důvěrnost</strong> (jen B umí dešifrovat) i <strong>autentizaci původu</strong> (jen A umí podepsat). Hodnoty $N_1, N_2$ brání replay útokům.',
        },
      ],
    },
    {
      id: 'sec-11-6',
      number: '11.6',
      title: 'Otázky k ústní zkoušce',
      blocks: [
        {
          kind: 'p',
          html: 'Tato otázka se může vyskytnout u ústní zkoušky — níže je shrnutí všech bodů, na které je dobré umět odpovědět.',
        },
        {
          kind: 'p',
          html: '<strong>Distribuce veřejných a tajných klíčů. Podvržení veřejného a tajného klíče. Způsoby distribuce veřejných klíčů: zveřejnění, veřejně dostupný adresář, autorita pro veřejné klíče a certifikace veřejných klíčů. Certifikace veřejných klíčů: definice certifikátu, certifikační autority a registrační autority. Princip komunikace pomocí certifikátů. Vlastnosti certifikátu, řetězec certifikátů, kořenová certifikační autorita, kořenový certifikát, křížová certifikace.</strong>',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-1',
          number: '11.6.1',
          title: 'Distribuce veřejných a tajných klíčů',
        },
        {
          kind: 'p',
          html: 'U <strong>tajných (symetrických) klíčů</strong> je hlavním problémem <em>utajení</em> klíče při přenosu. Klasické možnosti jsou: (a) fyzické předání mimo kanál (out-of-band), (b) použití dříve sdíleného klíče k zašifrování nového (key wrapping), (c) distribuce přes důvěryhodné centrum klíčů KDC (Key Distribution Center), (d) <strong>balení symetrického klíče asymetrickou kryptografií</strong> — A vygeneruje klíč relace $k_s$ a pošle B hodnotu $E_{VK_B}(k_s)$, kterou rozšifruje jen B pomocí $SK_B$.',
        },
        {
          kind: 'p',
          html: 'U <strong>veřejných klíčů</strong> není problémem utajení (klíč je veřejný), ale <em>autenticita</em> — příjemce musí mít jistotu, že obdržený VK opravdu patří uvedené identitě.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-2',
          number: '11.6.2',
          title: 'Podvržení veřejného a tajného klíče',
        },
        {
          kind: 'p',
          html: 'Pokud A pošle B veřejný klíč $VK_A$ bez ochrany, může aktivní útočník U provést <strong>man-in-the-middle</strong>: zachytí $VK_A$, podstrčí B vlastní $VK_U$ a obdobně podvrhne A klíč $VK_U$ místo $VK_B$. B pak šifruje zprávy klíčem $VK_U$, U je dešifruje, případně změní a přepošle A zašifrované pravým $VK_A$. Útok je pro B i A nedetekovatelný, dokud nemají žádný autentický odkaz na pravý VK protějšku.',
        },
        {
          kind: 'p',
          html: 'Analogicky lze podvrhnout i tajný klíč — pokud A pošle klíč relace $k_s$ pouze zašifrovaný podvrženým $VK_U$, dostane jej útočník místo B. Bez autentizace veřejného klíče je tedy i distribuce tajného klíče zranitelná.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-3',
          number: '11.6.3',
          title: 'Způsoby distribuce veřejných klíčů',
        },
        {
          kind: 'list',
          ordered: true,
          items: [
            '<strong>Zveřejnění (public announcement)</strong> — uživatel rozešle svůj VK e-mailem, zveřejní na osobní stránce, v diskusi apod. Jednoduché, ale zcela nechráněné proti podvržení — kdokoli může vystupovat pod cizí identitou.',
            '<strong>Veřejně dostupný adresář</strong> — důvěryhodná organizace provozuje seznam dvojic $(ID, VK)$. Uživatelé se registrují osobně a mohou si svůj záznam aktualizovat. Bezpečnější než zveřejnění, ale jediný adresář se stává cílem útoku — kompromitace adresáře umožní podvrhnout libovolný VK.',
            '<strong>Autorita pro veřejné klíče (online)</strong> — Aut udržuje adresář a zájemce o cizí VK získá od Aut <em>podepsanou</em> odpověď. Každý uživatel zná pouze $VK_{Aut}$. Pro získání $VK_B$ pošle A: Req. ‖ $T_1$; Aut vrátí $E_{SK_{Aut}}(VK_B \\| \\text{Req.} \\| T_1)$. Časová značka $T_1$ brání replay útokům. Nevýhoda: Autorita je úzké hrdlo a musí být stále online.',
            '<strong>Certifikace veřejných klíčů</strong> — uživatel získá od důvěryhodné CA podepsaný certifikát, který může předat komukoli sám. CA nemusí být online při každém spojení; ověření je lokální záležitostí pomocí předem známého $VK_{CA}$.',
          ],
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-4',
          number: '11.6.4',
          title: 'Certifikát, certifikační autorita, registrační autorita',
        },
        {
          kind: 'p',
          html: '<strong>Certifikát</strong> je datová struktura obsahující veřejný klíč žadatele, jeho identifikační údaje, dobu platnosti a další metadata. Celý záznam je <em>digitálně podepsán</em> soukromým klíčem CA, takže kdokoli s autentickým $VK_{CA}$ může ověřit jeho pravost. Schematicky $C_A = E_{SK_{CA}}(T_1, ID_A, VK_A)$ a ověření $D_{VK_{CA}}(C_A) = (T_1, ID_A, VK_A)$.',
        },
        {
          kind: 'p',
          html: '<strong>Certifikační autorita (CA)</strong> je důvěryhodná třetí strana, která vystavuje, podepisuje, distribuuje a odvolává certifikáty. <strong>Registrační autorita (RA)</strong> je organizační složka (typicky kontaktní místo) odpovědná za <em>ověření totožnosti</em> žadatele, příjem žádosti a předání hotového certifikátu. RA tedy provádí byrokratickou a identifikační část procesu, samotný kryptografický podpis vystavuje CA.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-5',
          number: '11.6.5',
          title: 'Princip komunikace pomocí certifikátů',
        },
        {
          kind: 'p',
          html: 'Při navázání spojení si strany vymění certifikáty (např. v rámci TLS handshake). Každá strana ověří podpisem $VK_{CA}$ pravost certifikátu protějšku, zkontroluje platnost (časový rozsah, CRL/OCSP) a soulad identity (např. doménové jméno). Pokud certifikát vystavila CA, kterou strana přímo nezná, ověřuje se celý <strong>řetězec certifikátů</strong> až ke kořenové CA, jejíž kořenový certifikát má strana předem nainstalován v <em>úložišti důvěryhodných certifikátů</em> (trust store).',
        },
        {
          kind: 'p',
          html: 'Po ověření identity se ověřený veřejný klíč použije k ustanovení klíče relace — buď přímo zašifrováním symetrického klíče (key transport), nebo jako autentizační prvek v Diffie–Hellmanově výměně (authenticated key agreement). Tím se získá symetrický klíč $k_s$ pro vlastní šifrování dat.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-6',
          number: '11.6.6',
          title: 'Vlastnosti certifikátu (X.509)',
        },
        {
          kind: 'p',
          html: 'Standard ITU-T <strong>X.509</strong> (součást X.500) definuje formát certifikátů. Verze 3 obsahuje zejména: verzi formátu, sériové číslo certifikátu, identifikátor algoritmu podpisu, jméno vystavitele (CA), dobu platnosti (not before / not after), jméno subjektu (vlastníka), veřejný klíč subjektu spolu s identifikátorem algoritmu, volitelné jednoznačné identifikátory vystavitele a subjektu, rozšíření (extensions, např. použití klíče, alternativní jména) a digitální podpis CA přes všechna předchozí pole.',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-7',
          number: '11.6.7',
          title: 'Řetězec certifikátů, kořenová CA, kořenový certifikát',
        },
        {
          kind: 'p',
          html: 'Při velkém počtu uživatelů se CA organizují do <strong>hierarchického stromu</strong>: kořenová CA podepisuje certifikáty podřízených (intermediate) CA, ty dále podepisují certifikáty koncových subjektů. <strong>Řetězec certifikátů</strong> je posloupnost od certifikátu uživatele přes všechny mezilehlé CA až po <strong>kořenový certifikát</strong>.',
        },
        {
          kind: 'p',
          html: '<strong>Kořenová certifikační autorita</strong> stojí na vrcholu hierarchie a její certifikát je <em>self-signed</em> — podepsaný vlastním soukromým klíčem, protože nad ní již žádná vyšší autorita není. Důvěra v kořenový certifikát se nezakládá kryptograficky, ale tím, že je předem nainstalován v <strong>úložišti důvěryhodných kořenů</strong> operačního systému či prohlížeče (out-of-band distribuce, typicky spolu s instalací systému).',
        },
        {
          kind: 'h3',
          id: 'subsec-11-6-8',
          number: '11.6.8',
          title: 'Křížová certifikace',
        },
        {
          kind: 'p',
          html: '<strong>Křížová certifikace (cross-certification)</strong> umožňuje propojit dvě nezávislé hierarchie CA tak, aby si jejich uživatelé mohli vzájemně důvěřovat, aniž by každý měl ve svém úložišti druhou kořenovou CA. Kořenové CA si vzájemně podepíší veřejné klíče — vzniknou tzv. <em>křížové certifikáty</em>.',
        },
        {
          kind: 'list',
          ordered: false,
          items: [
            '<strong>Jednosměrná</strong> — pouze CA$_1$ podepíše VK CA$_2$, důvěra je jednostranná.',
            '<strong>Obousměrná</strong> — obě strany se podepíší navzájem, důvěra je symetrická.',
          ],
        },
        {
          kind: 'p',
          html: 'Příklad: uživatel C ze stromu CA$_2$ chce komunikovat s A ze stromu CA$_1$. A pošle C: vlastní certifikát podepsaný CA$_1$, případné mezilehlé certifikáty, kořenový certifikát CA$_1$ a křížový certifikát CA$_1$ podepsaný CA$_2$. C ověří řetězec od svého důvěryhodného kořene CA$_2$ přes křížový certifikát až k certifikátu uživatele A. Křížová certifikace tak vytváří „most“ mezi oddělenými oblastmi důvěry (např. mezi PKI různých států nebo organizací).',
        },
      ],
    },
  ],
}
