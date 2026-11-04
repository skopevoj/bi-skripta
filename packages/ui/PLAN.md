# @skripta/ui — plán a pravidla pro práci (pro agenty)

Cíl: jeden design system pro skripta BI-KAB, BI-KOM, BI-OOP. Vzhled = koncept **„b-reference“**
(`/Users/vojta/Desktop/cvut/BI-KOM/design/b-reference.html`, screenshoty `…/design/shots/b-reference*.png`).
Pravidla měření a typografie: `…/design/RESEARCH.md`, architektura: `…/design/SHARED-UI.md`.
Callouty (bloky) mají vlastní rozhodnutí uživatele — viz konec `SHARED-UI.md` a dnešní implementace
v `BI-KOM/app/src/app/globals.css` (`.box`, `.box-h`, `.box-b`, `data-k`).

## Monorepo `/Users/vojta/Desktop/bi-skripta` (veřejné repo github.com/skopevoj/bi-skripta)

| Cesta | Co | Stack |
|---|---|---|
| `packages/ui` | tento balíček `@skripta/ui` (`~/Desktop/skripta-ui` je jen symlink sem) | TS zdroj bez buildu, čisté CSS |
| `packages/ui/playground` | ukázka kitu, port 5180 | Vite |
| `apps/kab` | KAB skripta (živě na kab.skopik.cz) | Vite 6, React 19, Tailwind 3 (na odchodu), KaTeX, single-file build |
| `apps/kom` | KOM skripta | Next 16 (statický export), React 19 |
| `apps/oop` | OOP skripta (oop.skopik.cz) | Next 16 (statický export), React 19, CodeMirror, Scala přes Scastie z prohlížeče |

`/Users/vojta/Desktop/cvut/BI-KOM/app`, `cvut/BI-OOP/app`, `cvut/BI-KAB/zkouska/app` jsou **staré kopie — nesahat**.

## Rozhodnutí (neměnit bez důvodu)

- **Distribuce**: npm workspaces v kořeni monorepa (`npm install` jen v kořeni; závislosti se hoistují, takže
  React/Next/pdfjs je jedna kopie). Balíček se dodává jako TypeScript zdroj (`exports` míří do `src/`), žádný build.
  Aplikace mají `"@skripta/ui": "*"`.
  - Next: `transpilePackages: ['@skripta/ui']`, `turbopack.root` + `outputFileTracingRoot` = kořen monorepa (`path.resolve(__dirname, '../..')`).
  - Vite: `resolve.dedupe: ['react','react-dom']`.
- **Framework-agnostické komponenty**: nic v `src/` kromě `src/next/` neimportuje `next/*`.
  Navigace jde přes kontext (`<SkriptaProvider link={…} pathname={…}>` nebo podobně) — Next adaptér je v
  `@skripta/ui/next`, Vite aplikace dodá vlastní `Link`.
- **Styly**: čisté CSS s tokeny (`src/tokens/tokens.css` = barvy a písma konceptu b-reference, světlý i tmavý),
  žádný Tailwind a žádné CSS moduly v balíčku. Aplikace importuje jednou `@skripta/ui/styles.css`.
  Třídy komponent mají prefix podle modulu (např. `sk-…` pro shell/obsah, `ix-…` pro interaktivní kit),
  aby se nebily se styly aplikací během migrace.
- **Volitelné závislosti** (katex, pdfjs-dist, next) jsou jen v podcestách `./math`, `./workbench`, `./next`,
  aby je KOM/OOP nemusely tahat (KaTeX potřebuje jen KAB).
- **Přepínač předmětů** v horní liště: název kurzu (např. „BI-KAB“) je dropdown se všemi skripty
  (BI-KAB → https://kab.skopik.cz, BI-KOM → https://kom.skopik.cz (zatím nenasazeno), BI-OOP → https://oop.skopik.cz)
  a v něm (nebo vedle) odkaz **„Příprava na rozstřel“** →
  `https://skopevoj.github.io/cvut-marasty/?addSource=https://raw.githubusercontent.com/CoconutBigNut/cvut-otazky/refs/heads/main/questions/questions.json`
  (nová karta). Seznam je v jednom souboru v balíčku (`src/courses.ts`).
- **Barvy calloutů**: definice zelená; věta / pravidlo / lemma / důsledek modrá; příklad žlutá;
  past / pozor korálově červená; poznámka fialová; shrnutí a důkaz šedá.
- Kontrola každé komponenty (z SHARED-UI §3.4): jen hodnoty ze škály mezer (`--s-*`) a rádiusů (`--r-1..3`),
  max. 3 velikosti textu na komponentu, hover / focus-visible / pressed u všeho klikacího, tmavý režim zvlášť,
  375 px bez vodorovného scrollu.

## Moduly balíčku a vlastníci (paralelní agenti — needitujte cizí složky)

| Složka | Obsah | Vlastník |
|---|---|---|
| `src/tokens/` | `tokens.css` (hotové, b-reference), `base.css` (reset, typografie článku, ikonky, focus) | agent „core“ |
| `src/interactive/` | kit pro interaktivní widgety (rámec, ovládací prvky, krokování, buňky…), `interactive.css` | agent „kit“ |
| `src/math/` | KaTeX: `<Math>`, renderer HTML s `$…$` / `$$…$$` | agent „kit“ |
| `playground/` | samostatná Vite stránka se všemi komponentami kitu (světle/tmavě), port 5180 | agent „kit“ |
| `src/shell/`, `src/content/`, `src/practice/`, `src/workbench/`, `src/lib/`, `src/next/`, `src/courses.ts`, `src/index.ts` | shell, renderer bloků, callouty, otázky, testy, workbench + PDF, progress, Next adaptér | agent „core“ |
| `src/styles.css` | jen `@import` řádky — každý agent si přidá své, nic jiného neměnit | sdílené |
| `package.json` | závislosti / exports — měnit jen aditivně a znovu načíst před editací | sdílené |

Nic necommitovat — commit udělá uživatel.
Dev servery: KOM 3130, OOP 3123, KAB 5173 (Vite). Placené API nespouštět.
Dokumentaci API zapisovat do `README.md` (každý agent svou sekci).
