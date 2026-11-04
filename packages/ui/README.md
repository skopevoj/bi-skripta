# @skripta/ui

Sdílený design system pro skripta BI-KAB, BI-KOM, BI-OOP. Pravidla a vlastníci modulů: `PLAN.md`.

## Interaktivní kit (`@skripta/ui/interactive`)

Stavebnice pro interaktivní widgety ve všech skriptech. Čisté CSS s prefixem `ix-` (`src/interactive/interactive.css`,
je už v `@skripta/ui/styles.css`), jen tokeny z `tokens.css` a škála `--s-*`. Komponenty jsou framework-agnostické,
SSR-safe (soubory s hooky mají `'use client'`). Živá ukázka všeho: `playground/` (viz níže).

```tsx
import { Widget, usePresetState, NumberField, StepperBar, useStepper, TraceTable } from '@skripta/ui/interactive'
```

### Rámec

| Komponenta | Podpis | K čemu |
|---|---|---|
| `Widget` | `{ title, lead?, presets?, activePreset?, onPreset?, onRandom?, onReset?, actions?, footer?, footerTitle?, level?, id?, className, children }` | Rámec každého widgetu: hlavička (ikona, název, „Obnovit“), úvodní věta, řada předvoleb („Příklad: … · Náhodně“) s poznámkou aktivní předvolby, tělo (mřížka s mezerou 20 px), patička „Čeho si všimnout“. **Není sbalitelný.** |
| `usePresetState(initial, presets)` | → `{ value, set(patch), apply(i), reset(), active, widget }` | Stav widgetu jako objekt. `initial` = příklad z přednášky. `presets: { label, values: Partial<T>, note? }[]`. Aktivní předvolba se pozná sama (porovnání hodnot). `{...st.widget}` rozbal do `<Widget>` → předvolby + „Obnovit“ fungují bez další práce. |

```tsx
const st = usePresetState({ text: 'UTOK ZA USVITU', k: 3 }, [
  { label: 'Z přednášky', values: { text: 'UTOK ZA USVITU', k: 3 } },
  { label: 'ROT13', values: { k: 13 }, note: 'Šifrování a dešifrování je stejná operace.' },
])
<Widget title="Caesarova šifra" lead="Posuň klíč k a sleduj, kam se posune každé písmeno." {...st.widget}
        onRandom={() => st.set({ k: 1 + Math.floor(Math.random() * 25) })}
        footer={<p>Stačí vyzkoušet 25 klíčů.</p>}>
  …
</Widget>
```

### Ovládací prvky

Všechny mají popisek nad prvkem, výšku 32 px (44 px na dotykových zařízeních — `--ix-h`), hover / focus-visible / pressed / disabled.

| Komponenta | Podpis |
|---|---|
| `Button` | `{ variant?: 'primary'\|'secondary'\|'ghost', size?: 'sm'\|'md', icon?, iconEnd?, …<button> }` — jedna `primary` akce na widget |
| `IconButton` | `{ icon, label, variant? }` — `label` jde do `aria-label` i tooltipu |
| `Field` | `{ label, hint?, error?, value?, htmlFor?, children }` — obal pro vlastní prvky (popisek + nápověda/chyba) |
| `NumberField` | `{ label, value, onChange(n), min?, max?, step?, decimal?, error?, hint?, noStepper?, chars?, onInvalid?(msg \| null) }` — −/+ a šipky ↑/↓. Píše se volně; neplatný mezistav (prázdné, ne-číslo, mimo min…max) se **nepropíše** a pod polem se ukáže „Zadej číslo od 1 do 25.“ Doménovou chybu dodá widget přes `error` („a = 4 není nesoudělné s 26, zkus 5.“). Nic se tiše neořezává. |
| `TextField` | `{ label, value, onChange(s), normalize?, mono? = true, placeholder?, maxLength?, error?, hint?, multiline? }` — `normalize` např. velká písmena / bez diakritiky (a řekni to v `hint`) |
| `Slider` | `{ label, value, onChange, min, max, step?, format?, hint? }` — hodnota vpravo od popisku |
| `Segmented<T>` | `{ label? \| ariaLabel, value, options: { value, label, title?, disabled? }[], onChange, block?, size? }` — 2–6 výlučných možností |
| `Toggle` | `{ label, checked, onChange, hint?, disabled? }` — switch (`role="switch"`) |
| `Select<T>` | `{ label, value, options: { value, label }[], onChange, hint?, error? }` — nativní select, pro > 6 možností |

### Krokování algoritmů

| | Podpis |
|---|---|
| `useStepper(count, { initial?, resetKey?, interval? })` | → `{ index, count, atStart, atEnd, go, next, prev, first, last, playing, play, pause, toggle, speed, setSpeed }`. `count` = počet stavů. Změna `resetKey` (např. `` `${a},${b}` ``) vrátí krokování na začátek. Přehrávání se na konci samo zastaví; „Přehrát“ na konci začne znovu. |
| `StepperBar` | `{ stepper, label?(i), noPlay?, noScrubber?, speeds? = [0.5, 1, 2] }` — « · ‹ Zpět · ▶ Přehrát · **Další ›** · „Krok 3 / 9“ · posuvník · rychlost. Klávesy ← → Home End fungují kdekoli ve widgetu (mimo textová pole). |
| `StepNote` | `{ title?, kind?: 'ok'\|'bad'\|'warn'\|'info', children }` — jedna věta, co krok udělal; `aria-live`. |

```tsx
const rows = useMemo(() => euclid(a, b), [a, b])
const s = useStepper(rows.length, { resetKey: `${a},${b}` })
<StepperBar stepper={s} />
<StepNote>{row.a} = {row.q} · {row.b} + {row.r}; zbytek ≠ 0, pokračujeme s ({row.b}, {row.r}).</StepNote>
<TraceTable columns={cols} rows={rows} current={s.index} onRowClick={s.go} />
```

### Zobrazení dat

Tóny (`Tone`): `active` (rámeček v akcentu — právě zpracováváno), `changed` (žluté podbarvení + tečka — změnilo se),
`ok` / `bad` / `warn` (barva + ✓ ✕ ! v rohu), `dim` (nehraje roli). Stejný slovník u buněk, bitů, řádků, štítků, diagramů.

| Komponenta | Podpis |
|---|---|
| `Cells` | `{ items: (string\|number\|{ v, tone?, sub?, title? })[], cols?, columnMajor?, wrap?, size?: 'sm'\|'md'\|'lg', onSelect?(i), selected?, label?, ariaLabel? }` — řada / mřížka hodnot; vybraná buňka se sama posune do viditelné části |
| `ByteGrid` | `{ bytes, prev?, cols? = 4, columnMajor?, format? = hex2, tone?(i), sub?(i), …Cells }` — změny proti `prev` se zvýrazní samy. AES stav: `cols={4} columnMajor` |
| `BitRow` | `{ bits: '0101…'\|(0\|1\|bool)[], compare?, group? = 8, tone?(i), label?, showDiffCount? }` — lavinový efekt: rozdíly proti `compare` + „10 / 40 bitů jinak (25 %)“ |
| `CellRows` | `{ rows: { label, cells, muted? }[], head?, activeCol?, onColSelect?(c), ariaLabel? }` — řádky zarovnané do sloupců (OT → ŠT abeceda, BB84, Vigenère); popisky řádků drží při posunu |
| `TraceTable<R>` | `{ columns: { key, label, render?, align?, mono?, diff? }[], rows, current?, future?: 'blank'\|'dim'\|'show'\|'hide', onRowClick?, rowTone?, caption? }` — průběh algoritmu; budoucí řádky drží místo (`blank`), aby tabulka neposkakovala |
| `KeyValue` | `{ items: { k, v, hint?, tone? }[], cols?: 1–4 }` — pojmenované hodnoty (n, φ(n), d…) |
| `Formula` | `{ steps: ReactNode[], result?, rel? = '=', suffix?, label? }` — `E(U) = (20 + 3) mod 26 = 23 mod 26 = **23 = X**`; články mohou být `<Tex>` |
| `Verdict` | `{ kind: 'ok'\|'bad'\|'warn'\|'info', title, children? }` — ikona + tučné tvrzení + proč |
| `Tag` | `{ tone?, children }` — malá mono hodnota v textu |
| `Panel` | `{ label?, aside?, variant?: 'line'\|'soft'\|'plain' }` — podsekce („Šifrový text“, „Výsledek“); max. 2–3 na widget |
| `Bars` | `{ data: { label, value, tone?, title? }[], compare?, compareLabel?, valueLabel?, max?, height?, format? }` — sloupcový graf (četnosti) |
| `hex2(b)` | bajt → `"0a"` |

### Diagramy (SVG)

`Flow { width, height, title, minWidth? }` (viewBox, škáluje se, pod `minWidth` se posouvá uvnitř; `title` = popis pro čtečky),
`FlowBox { x, y (střed), w?, h?, label, sub?, kind?: 'data'\|'op'\|'key', tone? }`, `FlowOp { x, y, r?, symbol? = '⊕', tone? }`,
`FlowArrow { points: [x, y][], tone?: 'active'\|'dim', dashed?, label? }`, `FlowText { x, y, anchor?, muted? }`.
Barvy jen přes tokeny → tmavý režim zadarmo. Ukázka: režim CBC v playgroundu.

### Rozvržení a drobnosti

`Stack { gap? = 4 }`, `Row { gap? = 3, align? = 'end', justify?, nowrap? }`, `Grid { min? = 200, gap? = 4 }` (auto-fit; na 375 px jeden sloupec),
`Scroll` (vodorovný posun uvnitř), `SrOnly`, `Muted`, `IxIcon { name }`, `cx(...)`, `mod(a, n)` (vždy 0…n−1).
`gap` je index škály: 1 = 4 px, 2 = 8, 3 = 12, 4 = 16, 5 = 20, 6 = 24, 8 = 32.

### Pravidla pro interaktivní widgety

Závazná pro všechny nové i přepisované widgety (KAB, KOM, OOP):

1. **Jedna otázka na widget.** Widget ukazuje jednu věc. `title` = 2–5 slov, `lead` = jedna věta v rozkazovacím způsobu, co zkusit („Posuň klíč k a sleduj…“). Když je potřeba víc vět, je to na dva widgety nebo na text okolo.
2. **Vstupy nahoře, výsledek hned pod nimi, živě.** Žádné tlačítko „Spočítat“ — výsledek se přepočítá při každé změně. Výjimka: algoritmus, který se krokuje.
3. **Výchozí stav = příklad z přednášky** (`usePresetState(initial, …)`, první předvolba „Z přednášky“). Další 1–3 předvolby jen pro zajímavé případy, každá s `note` (proč je zajímavá). „Obnovit“ vždy (dostaneš ho z `{...st.widget}`); „Náhodně“ jen tam, kde náhoda dává smysl.
4. **Algoritmy se krokují**: `useStepper` + `StepperBar` + `StepNote` s **jednou větou**, co krok udělal a proč. Změněné hodnoty mají tón `changed`, právě zpracovávané `active`. Při změně vstupů `resetKey`. Tabulka průběhu = `TraceTable` s `current` a `onRowClick={s.go}`.
5. **Neplatný vstup se vysvětlí u pole a řekne, co změnit** („a = 4 není nesoudělné s 26, zkus 5.“), nikdy tiše neořezat ani nenahradit. Rozsah dej do `min`/`max` (`NumberField` hlášku napíše sám), doménovou podmínku do `error`. U doménové chyby ukaž místo výsledku `Verdict kind="bad"` s důvodem, ne nesmyslné číslo. U chyby rozsahu `NumberField` drží poslední platnou hodnotu (výsledek k ní pořád sedí); kdo potřebuje víc, má `onInvalid`.
6. **Vzorec s dosazením** tam, kde pomáhá pochopit výpočet: `Formula` (obecný tvar → dosazené hodnoty → výsledek), u matematiky `<Tex>`.
7. **Barva jen pro stav a vždy s tvarem/ikonou/textem.** Jeden akcent; ok/bad/warn jen pro výsledky. Stejný slovník tónů všude (`active`, `changed`, `ok`, `bad`, `warn`, `dim`). Žádné vlastní barvy ani hexy ve widgetu — jen tokeny. Žádné vlastní třídy, pokud to jde poskládat z kitu; když ne, prefix `ix-<widget>-` a jen tokeny / `--s-*` / `--r-*`.
8. **Výsledek je vizuálně nejsilnější věc** (Verdict, `Formula result`, zvýrazněná buňka); vysvětlující text je `ink-2`. Max. 2–3 `Panel`y — ne všechno musí být v rámečku.
9. **375 px a tmavý režim**: nic nesmí posunout stránku do strany; široké věci (abeceda, bity, diagram, tabulka) jsou v kitu posuvné uvnitř. Ověř v playgroundu nebo aplikaci v obou režimech.
10. **Česky, stejná slova všude**: „Další“, „Zpět“, „Přehrát“, „Obnovit“, „Náhodně“, „Příklad“, OT / ŠT, „Čeho si všimnout“. Popisky polí jako ve skriptech (symbol + význam: „Klíč k“, „Modul n“).
11. **Ovládání klávesnicí**: všechno klikací je `<button>` (kit to dělá), krokování ← →; nic jen na hover.
12. **Widget si kreslí rámec sám** (`<Widget>`); obsahový renderer ho jen vloží. Název a úvod žijí ve widgetu (případně je přebíjí props z obsahu), ne v dalším obalu kolem.

## Matematika (`@skripta/ui/math`)

KaTeX je volitelný peer — tuhle podcestu importuj jen v aplikaci, která má `katex` nainstalovaný (KAB).

| | Podpis |
|---|---|
| `Tex` (alias `Math`) | `{ tex, display?, macros?, className? }` — jeden vzorec (`<span>` / `<div class="mx-display">`, široký se posouvá uvnitř). Alias `Math` přepíše globální `Math` v souboru, kde ho importuješ — raději `Tex`. |
| `MathHTML` | `{ html, as?: 'div'\|'span'\|'p', className?, transformText?, macros? }` — HTML s `$…$` a `$$…$$` (`\$` = dolar). Uvnitř `<code>/<pre>/<kbd>` se nic nevykresluje. |
| `renderTex(tex, display?, opts?)`, `renderMathInHtml(html, opts?)`, `tokenizeMath(s)` | totéž bez Reactu (do stringu) |
| `createTermWrapper(entries)` | z glosáře `{ term, definition, aliases? }[]` udělá `transformText`: pojmy (celá slova, s diakritikou) dostanou tooltip `.mx-term` (hover i fokus Tab). Mimo odkazy, nadpisy a kód. Data glosáře zůstávají v aplikaci. Vytvoř jednou na úrovni modulu (kvůli `useMemo`). |

```tsx
// main.tsx (jednou)
import 'katex/dist/katex.min.css'     // KaTeX CSS + fonty importuje aplikace ze svého katexu
import '@skripta/ui/styles.css'       // obsahuje i drobné .mx-* styly (bez závislosti na katexu)

// KAB: glosář
import { MathHTML, createTermWrapper } from '@skripta/ui/math'
import { glossary } from './glossary'
const gloss = createTermWrapper(glossary)
<MathHTML html={block.html} transformText={gloss} />   // nadpisy: bez transformText
```

## Playground (`playground/`)

Samostatná Vite + React stránka se všemi komponentami kitu a dvěma ukázkovými widgety postavenými jen z kitu
(Caesar — živý výstup; Eukleides — krokování). Přepínač motivu Systém / Světlý / Tmavý (`data-theme` na `<html>`).
Bere zdroj balíčku přímo (`vite.config.ts` aliasy) a `react` / `react-dom` / `katex` z `../node_modules`
(devDependencies balíčku) — v playgroundu se proto neinstalují znovu.

```sh
cd playground && npm install && npm run dev     # http://localhost:5180
npm run build                                   # kontrola, že se vše sestaví
```

## Jádro (`@skripta/ui`, `/practice`, `/workbench`, `/next`) — agent „core“

Vzhled = koncept b-reference (`BI-KOM/design/b-reference.html`). Třídy mají prefix `sk-`. Styly: jednou
`import '@skripta/ui/styles.css'` (tokeny, base, shell, obsah, otázky, panel, kit, math).

### Podcesty

| Import | Co | Závislosti |
|---|---|---|
| `@skripta/ui` | provider, `Shell`, `Sidebar`, `Toc`, `Search`, `Settings`, `CourseSwitcher`, obsah (`Blocks`, `Callout`, `Table`, `Figure`, `CodeBlock`, `Sources`/`Cite`, `Page`, `DocHeader`, `PrevNext`, `ReadMarker`, `Rows`, `ChapterList`, `Facts`), typy obsahu, helpery (`navChapters`, `tocEntries`, `prevNext`, `calloutStart`, `buildSearchIndex`, `readingMinutes`, `plural`, `plain`), progress (`useProgress`, `useProgressActions`, `storageKey`), téma (`themeInitScript`), `useWorkbench`, `COURSES`, `ROZSTREL_URL`, `REPO_URL`, vše z `/practice` | react |
| `@skripta/ui/practice` | `QuestionCard`, `Bank`, `TestRunner`, `TestList`, `AnswerInputs`, `Result`, `QuestionPrompt`, `QuestionHead`, `OriginBadges`, `CORE_KINDS`, `emptyAnswer`, typy `QuestionKindDef`, `AnswerInputsProps`, `PracticeConfig`, `BankFilter` | react |
| `@skripta/ui/workbench` | `Workbench` (pravý panel / bottom sheet), `sourceTab`, `SourcePane`, `PdfPage`, `PdfViewer`, `setPdfWorker` | `pdfjs-dist` |
| `@skripta/ui/next` | `NextSkriptaProvider`, `NextLinkAdapter`, `useNextSearchParam` | `next` |

Helpery bez `'use client'` (`navChapters`, `tocEntries`, `prevNext`, `calloutStart`, `buildSearchIndex`, `readingMinutes`,
`plural`, `plain`, `themeInitScript`, `calloutDef`) jdou volat i v serverových komponentách. Ostatní jsou klientské.

### Provider = jediné místo, kde kurz napojí framework a svoje renderery

Konfigurace obsahuje funkce, takže ji kurz drží ve **vlastním `'use client'` souboru** (Next nepředá funkce ze
serverové komponenty) a ten pak použije v layoutu:

```tsx
'use client' // BI-KOM/app/src/skripta.tsx
import { NextSkriptaProvider } from '@skripta/ui/next'
export function KomProvider({ children }) {
  return (
    <NextSkriptaProvider
      course={{ id: 'bi-kom', code: 'BI-KOM', name: 'Konceptuální modelování', storage: 'kom' }} // storage = prefix localStorage
      docs={UI_DOCS}                         // [{ id:'P02', short:'P2', long:'Přednáška 2', title, file:'/slides/P02.pdf', pages }]
      highlight={(code, lang) => html}       // tokeny .k .t .n .s .c .a
      codeLangs={{ ocl: 'OCL' }}
      blocks={{ diagram: DiagramBlockView }} // vlastní druhy bloků (a přepis vestavěných)
      interactive={{ 'gs-venn': GsVenn }}    // blok { kind: 'interactive', component: 'gs-venn' }
      callouts={{ /* další druhy calloutů */ }}
      practice={{ topics, verified, sourceGroups, promptExtra, testDefaults, testRules }}
    >{children}</NextSkriptaProvider>
  )
}
```

Všechny klíče (`SkriptaConfig` v `src/lib/config.ts`): `course`, `Link`, `pathname`, `navigate`, `useSearchParam`,
`renderHtml`, `docs`, `docHref`, `resolveSource`, `webLabel`, `wikiUrl`, `blocks`, `interactive`, `callouts`,
`highlight`, `codeLangs`, `defaultLang` (jazyk bloků kódu bez `lang`, např. OOP `'scala'`), `codeActions`, `practice`, `pdfWorker`.
`SkriptaProvider` v sobě drží i stav Workbenche.

- **Navigace**: `Link` (komponenta odkazu), `pathname`, `navigate(href, { replace, scroll })`, `useSearchParam(name)` (hook).
  `NextSkriptaProvider` je dodá z `next/link` + `next/navigation`. Bez nich: obyčejné `<a>`, `history.pushState`, `location.search`.
  Komponenty, které čtou query (`Bank` – `?id=`, `PdfViewer` – `?page=`), dej v Nextu do `<Suspense>`.
- **HTML obsahu**: každý `html` řetězec jde přes `renderHtml({ html, as, className, id })` (default `dangerouslySetInnerHTML`).
  KAB: `renderHtml={({ html, as, className }) => <MathHTML html={html} as={as} className={className} />}` z `@skripta/ui/math`.
- **Bloky**: `<Blocks blocks secId chapter calloutStart questions />` vykreslí `p`, `h3`, `list`, `code`, `callout`, `table`,
  `figure`, `interactive`, `quiz`; jiné `kind` → `blocks[kind]` z provideru (`BlockRenderProps = { block, id, index, secId, chapter }`,
  `id` dej na vnější prvek). Neznámý druh bez rendereru = neviditelný placeholder + varování v konzoli.
- **Callouty**: barevná lišta „Definice 3.4 (název)“ + ikona vpravo, obsah na neutrálním pozadí. Vestavěné druhy:
  `definice` (zelená), `veta`/`pravidlo`/`lemma`/`dusledek` (modrá), `priklad` (žlutá), `past`/`pozor` (korálová),
  `poznamka` (fialová), `shrnuti`/`dukaz` (šedá). Číslo = `block.number`, jinak `chapter.n` (jeden čítač pro všechny druhy
  v kapitole — pro sekci n předej `calloutStart(chapter, n)`). Volitelně `plain` („Jednoduše: …“). Vlastní druh / popisek:
  `callouts={{ past: { label: 'Past', icon: 'warn', tone: 'coral', toc: true } }}` (ikona = `IconName` nebo React element).
- **Citace** (`SourceRef`): `slide { doc, page, quote? }`, `web`, `wiki`, `image`, `official`. `docs` dodá štítky a PDF;
  `resolveSource(ref, all)` vrátí vlastní `CiteItem` / `null` (skrýt) / `undefined` (výchozí). Klik na slajd otevře panel
  „Zdroj“ se stránkou PDF, zvýrazněnou citací, „Citace z tohoto slajdu“ a „Zpět na místo v textu“.

### Shell (layout)

```tsx
<KomProvider>
  <Shell nav={navChapters(chapters)} search={buildSearchIndex(…)}
         tabs={[{ href: '/kapitola/1/1', label: 'Skripta', match: ['/', '/kapitola'] }, { href: '/otazky', label: 'Banka otázek' }]}
         links={[{ href: '/otazky', label: 'Banka otázek', icon: 'bank', count: 253 }]}
         settings={<DiagramStyleSetting />}   // další sekce v popoveru nastavení
         panel={<Workbench />}                // z @skripta/ui/workbench
         logo={…} topExtra={…} repo={null} currentSection={…}>
    {children}
  </Shell>
</KomProvider>
```

Horní lišta: logo (→ `/`), název kurzu jako **přepínač skript** (`COURSES` + „Příprava na rozstřel“), hledání (⌘K),
odkaz na GitHub (`REPO_URL`), světlý/tmavý režim, ozubené kolo (vzhled Auto/Světlý/Tmavý, velikost textu, sekce kurzu).
Do `<head>` patří `themeInitScript(prefix)` (bez probliknutí). Stránka: `<Page>` (`main.sk-content > article.sk-doc`) a vedle
ní `<Toc entries={tocEntries(sec.id, sec.blocks)} docs={['P02']}>{extra tlačítka}</Toc>`; bez `Toc` má layout 2 sloupce.
Navigace kapitol: `NavChapter { number, title, href, summary?, sections: { id, number, title, href }[] }` — aktuální
sekce podle `pathname` (nebo `currentSection` u jednostránkových kapitol), postup čtení podle `ReadMarker`.

### Otázky a testy

Typy: `McQuestion`, `TfQuestion`, `OpenQuestion` (+ `QuestionLike` pro vlastní druhy). Stav odpovědi `AnswerState
{ sel, text, ce, revealed, self }` se ukládá do `<prefix>-progress-v1` (kompatibilní se starými KOM/OOP klíči).
Vlastní druh otázky (OOP `output`):

```tsx
practice={{
  kinds: { output: { label: 'Co se vypíše?', Inputs: OutputInputs, isAnswered, grade, expected: (q) => <>Vypíše <code>{q.answer}</code>.</> } },
  verified: { scala: { label: 'Kompilátorem', badge: 'Ověřeno kompilátorem' }, slides: { label: 'Slajdy' } },
  bankFilters: [{ id: 'lec', label: 'Přednáška', options: [['L1', '1 · …']], get: (q) => q.lecture }],
  promptExtra: (q) => q.code && <CodeBlock code={q.code} actions={false} />,
  resultExtra: (q) => q.code && <button className="sk-lnk" onClick={…}>Spustit v editoru →</button>,
  testDefaults: { minutes: 45, points: 2, partial: false },
}}
```

`Inputs` dostane `AnswerInputsProps { q, st, set, locked, showTruth, onSubmit(next?), submitLabel }`; pro textová pole
jsou připravené třídy `.sk-ans` (input/textarea) a `.sk-chk-l` (checkbox s popiskem). Test: `MockTest { id, title,
description, questionIds, minutes?, points?, partial?, pass? }` — chybějící hodnoty z `practice.testDefaults`.

### Workbench (pravý panel)

`<Workbench tabs={[editorTab, sourceTab]} />` — `WorkbenchTab { id, label, icon?, render(), heading?() }`; všechny záložky
zůstávají namountované (editor si drží stav). Ovládání z libovolné komponenty: `const wb = useWorkbench()` →
`wb.openTab('editor', { code, autorun: true })` (data čte záložka přes `wb.payload('editor')` → `{ data, n }`, `n` roste
s každým odesláním), `wb.openSource(view, anchorEl)`, `wb.close()`, `wb.open`, `wb.tab`. Panel jde roztáhnout tažením
levého okraje (`--pn-w`), na telefonu je to bottom sheet. pdf.js worker: aplikace ho zkopíruje do `public/`
(`/pdf.worker.min.mjs`, jinak `pdfWorker` v provideru) — **stejná verze** jako `pdfjs-dist`, které se bundluje.

### Spotřeba z Next.js (KOM, OOP)

```ts
// next.config.ts — balíček je TS zdroj mimo aplikaci (file: → symlink)
const root = path.resolve(__dirname, '../../..')   // kořen, který obsahuje app i balíček (v monorepu '../..')
const own = (m: string) => `./node_modules/${m}`   // jedna kopie sdílených závislostí (balíček má vlastní dev kopie)
export default {
  transpilePackages: ['@skripta/ui'],
  outputFileTracingRoot: root,
  turbopack: { root, resolveAlias: { react: own('react'), 'react-dom': own('react-dom'), next: own('next'), 'pdfjs-dist': own('pdfjs-dist') } },
}
```

Písma přes `next/font/google` s `variable: '--font-sans'` (Instrument Sans) a `'--font-mono'` (Source Code Pro) na `<html>` —
tokeny je převezmou samy. Layout: `import '@skripta/ui/styles.css'`, pak CSS kurzu.

### Spotřeba z Vite (KAB)

```ts
// vite.config.ts
server: { fs: { allow: ['..', '../skripta-ui'] } },
resolve: { dedupe: ['react', 'react-dom'] },
```

```tsx
<SkriptaProvider course={{ id: 'bi-kab', code: 'BI-KAB', storage: 'kab' }}
  Link={RouterLink} pathname={pathname} navigate={navigate}   // vlastní router (history.pushState)
  renderHtml={kaTeXRenderer} blocks={{ math, glossary, exercise }} interactive={WIDGETS}>
  <Shell nav={nav} currentSection={spySectionId}>…</Shell>
</SkriptaProvider>
```

KAB (`apps/kab/src/router.tsx`, `src/skripta.tsx`): `pathname` z `useSyncExternalStore` nad `popstate` + `sk:navigate`,
`navigate` = `pushState` + `sk:navigate` + posun na `#kotvu`, `Link` = `<a>` s `preventDefault` (modifikátory / nová karta normálně).
`renderHtml` dostává i `label` (true u nadpisu h3, titulku a „Jednoduše:“ calloutu, hlavičky tabulky, popisku obrázku) —
KAB tam vykreslí matematiku, ale vynechá glosářové tooltipy. Vestavěný `interactive` blok balí widget do `Lab` a nepředá mu
`title`/`hint`; KAB ho proto přebíjí vlastním rendererem v `blocks` (widget si kreslí `<Widget>` sám).
`<Search>`: dlouhý popis (`d`, fulltextové položky) se zobrazí od místa první shody.

Bez `useSearchParam` provider čte `location.search` (sleduje `popstate` a vlastní `sk:navigate` událost, kterou výchozí
`navigate` posílá). Vlastní `navigate` může po `pushState` poslat `window.dispatchEvent(new Event('sk:navigate'))`.
