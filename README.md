# BI-KAB · Skripta

Šablona pro studijní skripta s dark theme, sticky TOC sidebarem, KaTeX a barevně
odlišenými boxy (Definice, Věta, Příklad, Poznámka, Lemma, Důsledek, Důkaz).

## Spuštění

```bash
pnpm install      # nebo: npm install
pnpm dev          # vývojový server
pnpm build        # produkční single-file HTML do dist/
```

Build vznikne jako jeden statický `dist/index.html` (díky `vite-plugin-singlefile`),
takže se dá hodit kamkoli na statický hosting (Pages, Netlify, drag&drop).

## Plnění obsahu

Veškerý obsah žije v `src/data.ts`. LLM dostane schéma z `src/types.ts` a
vyplní pole `chapters`. Žádný JSX, žádný markdown — jen TypeScript struktura.

### Datový model (zjednodušeně)

```ts
Skripta = {
  title: string
  subtitle?: string
  chapters: Chapter[]
}

Chapter = { id, number, title, intro?, sections: Section[] }
Section = { id, number, title, blocks: Block[] }

Block =
  | { kind: 'p',       html }
  | { kind: 'h3',      id, number, title }       // pod-podsekce (5.5.1)
  | { kind: 'math',    tex }                      // samostatná display math
  | { kind: 'list',    ordered, items }
  | { kind: 'callout', type, number, title, html }

CalloutKind = 'definice' | 'veta' | 'priklad' | 'poznamka'
            | 'lemma'    | 'dusledek' | 'dukaz'
```

### Konvence pro `html` pole

- **Inline math**: `$ ... $` nebo `\( ... \)`
- **Display math**: `$$ ... $$` nebo `\[ ... \]` (uvnitř bloku `p` či `callout`)
- **Zvýraznění**: `<strong>`, `<em>`, `<code>`
- **Cross-ref**: `<a href="#sec-5-5">5.5</a>` — všechny `id` ze schématu jsou validní kotvy
- **Footnote**: `<sup><a class="footnote-ref" href="#fn-1">1</a></sup>` + zápis do `footnotes`

### ID konvence

- Kapitoly: `chap-1`, `chap-2`, …
- Sekce: `sec-2-1`, `sec-2-2`, …
- Podsekce (h3): `subsec-2-2-1`, …

Tím má sidebar i scroll-spy konzistentní cíle a cross-refs fungují bez extra práce.

## Prompt pro LLM (návrh)

> Dostaneš surový text přednášky. Převeď ho do TypeScript struktury podle schématu
> v `src/types.ts`. Použij callout typy `definice`/`veta`/`priklad`/`poznamka`/
> `lemma`/`dusledek`/`dukaz` všude, kde to dává smysl. Matematiku piš v KaTeX
> syntaxi mezi `$...$` (inline) a `$$...$$` (display). Zachovej číslování z
> originálu. Vrať jen obsah pole `chapters: Chapter[] = [ ... ]`.

## Struktura projektu

```
app/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig*.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx               ← layout, scroll-spy, block dispatcher
    ├── index.css             ← Tailwind + KaTeX + prose styling
    ├── types.ts              ← datové schéma
    ├── data.ts               ← OBSAH (LLM editovatelný)
    └── components/
        ├── Sidebar.tsx       ← sticky TOC s active highlightem
        ├── Callout.tsx       ← 7 barevných boxů + ikony
        └── MathHTML.tsx      ← KaTeX auto-render přes innerHTML
```
