// Kurátorský seznam otázek, které zůstávají v bankách (content/bank/*.ts), ale aplikace je nezobrazuje
// (filtruje je content/index.ts). Důvody: duplicita s otázkou v bance kapitoly (ta je zařazená v quiz
// blocích kapitol, proto se ponechává ona) a úlohy o DEMO, které v BI-KOM 2026/27 nejsou.
// U duplicit byly obrázky (/sources/wiki/…png) a štítky `seen` z wiki verze převzaty do ponechané otázky.
export const EXCLUDED_IDS: ReadonlySet<string> = new Set([
  // --- Reálné otázky z FIT Wiki (wiki.ts), které jsou zároveň v bankách kapitol ------------------------
  // Midterm 2022
  'mid22-01', // duplicate of ch05-14 (KVALITA je intrinsický aspekt)
  'mid22-02', // duplicate of ch03-08 / ch04-03 (nadtyp Kind)
  'mid22-03', // duplicate of ch03-09 / ch04-06 (podtyp Role)
  'mid22-04', // duplicate of ch04-04 / ch05-07 (nadtyp Quantity)
  'mid22-05', // duplicate of ch01-06 (modularizace domény)
  'mid22-06', // duplicate of ch05-03 (povinnosti ve vztazích celek–část)
  'mid22-07', // duplicate of ch04-05 (podtyp Category; ch04-05 opraven na „všechny možnosti“ dle P03 s. 6)
  'mid22-08', // duplicate of ch03-01 (IDENTITA entity)
  'mid22-09', // duplicate of ch02-12 (násobnost 1..*)
  'mid22-10', // duplicate of ch04-02 (charakteristiky CATEGORY)
  // Samostatné screenshoty
  'wq-01', // duplicate of ch04-18 (stereotypy asociací mimo celek–část)
  'wq-02', // duplicate of ch06-01 (stereotypy poskytující identitu)
  // Zkouška – OntoUML
  'ex-19', // duplicate of ch03-07 (charakteristiky KIND)
  'ex-50', // duplicate of ch04-07 / ch06-02 (charakteristiky ROLEMIXIN)
  'ex-67', // duplicate of ch04-10 (podtyp RoleMixin)
  'ex-72', // duplicate of ch03-11 (charakteristiky PHASE)
  'ex-96', // duplicate of ch03-04 (definice rigidity R+)
  'ex-101', // duplicate of ch03-12 (charakteristiky ROLE)
  'ex-106', // duplicate of ch03-10 (nadtyp Role)
  // Zkouška – úvod, transformace
  'ex-31', // duplicate of ch01-03 (pořadí činností při tvorbě business IS)
  'ex-61', // duplicate of ch07-01 (na co se OntoUML převádí v čistém OO modelu)
  // Zkouška – OCL
  'ex-47', // duplicate of ch08-01
  'ex-69', // duplicate of ch08-08
  'ex-79', // duplicate of ch08-03
  'ex-86', // duplicate of ch08-11 (operace s kolekcemi)
  'ex-121', // duplicate of ch08-02
  'ex-122', // duplicate of ch08-07 (typy omezení)
  // Zkouška – RDF / OWL / SPARQL
  'ex-04', // duplicate of ch09-01
  'ex-10', // duplicate of ch09-11 (SPARQL)
  'ex-40', // duplicate of ch09-05 (textové formáty RDF)
  'ex-52', // duplicate of ch09-09 (OWL)
  'ex-54', // duplicate of ch09-14 (sémantický web, FAIR)
  'ex-81', // duplicate of ch09-07 (RDFS)
  'ex-97', // duplicate of ch09-03 (URI / IRI)
  // Zkouška – BPMN
  'ex-18', // duplicate of ch10-02 (typy tasků)

  // --- Vlastní otázky z mocks.ts, téměř totožné s otázkou v bance kapitoly ---------------------------------
  'mock-03', // duplicate of ch06-08 (definice MultDep)
  'mock-06', // duplicate of ch05-01 (prázdný diamant = sdílitelná část)
  'mock-08', // duplicate of ch04-09 (Customer jako role nad Person a Organisation → roleMixin)
  'mock-09', // duplicate of ch06-14 (fáze tvoří {disjoint, complete})
  'mock-11', // duplicate of ch04-15 (derivation spojuje material s relátorem)
  'mock-15', // duplicate of ch03-05 (celoživotní student ≠ rigidní)
  'mock-16', // duplicate of ch03-02 (UUID neřeší identitu)
  'mock-25', // duplicate of ch08-06 (postcondition nic neprovádí)
  'mock-28', // duplicate of ch09-12 (typy SPARQL dotazů)
  'mock-29', // duplicate of ch10-10 (sekvenční tok / tok zpráv a pooly)
  'mock-30', // duplicate of ch10-09 (event-based gateway, lhůta 7 dní)
  'mock-33', // duplicate of ch11-07 (AI model prošel kontrolami – co ověří člověk)

  // --- DEMO (Enterprise Engineering): není v BI-KOM 2026/27 ---------------------------------------------
  'ex-01', // DEMO: role aktora
  'ex-09', // DEMO: P-fact
  'ex-11', // DEMO: aktor
  'ex-24', // DEMO: intersikce / interakce
  'ex-28', // DEMO: interakce
  'ex-30', // DEMO: transakční vzor S9–S12
  'ex-35', // DEMO: princip fungování organizací
  'ex-36', // DEMO: transakční vzor S3–S6
  'ex-38', // DEMO: kompetence (produkční / koordinační akty)
  'ex-43', // DEMO: fáze transakce
  'ex-57', // DEMO: kompetence
  'ex-63', // DEMO: autorita
  'ex-71', // DEMO: typy modelů
  'ex-73', // DEMO: referenční modely transakcí
  'ex-77', // DEMO: transakční vzor S13–S16
  'ex-83', // DEMO: transakční vzor S1, S2, S7, S8
  'ex-87', // DEMO: koordinační vs. produkční akt
  'ex-88', // DEMO: odpovědnost
  'ex-90', // DEMO: závazky (commitments)
  'ex-98', // DEMO: P-událost
  'ex-103', // DEMO: transakce, iniciátor, executor
  'ex-104', // DEMO: esenciální model organizace
  'ex-105', // DEMO: subjekt a role aktora
  'ex-108', // DEMO: struktura business procesu
  'ex-110', // DEMO: intersikce
])
