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
        },
        {
          kind: 'callout',
          type: 'definice',
          number: '11.3',
          title: 'Certifikační autorita (CA)',
          html: 'Důvěryhodná třetí strana, která vydává a spravuje certifikáty. <strong>Registrační autorita (RA)</strong> přijímá žádosti, kontroluje údaje a předává certifikáty žadatelům.',
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
  ],
}
