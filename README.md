# Skripta FIT ČVUT

Interaktivní skripta k předmětům BI-KAB, BI-KOM a BI-OOP se sdíleným design systémem.

| Složka | Co | Web |
|---|---|---|
| `apps/kab` | BI-KAB – Kryptografie a bezpečnost (Vite, statický single-file build) | https://kab.skopik.cz |
| `apps/kom` | BI-KOM – Konceptuální modelování (Next.js) | https://kom.skopik.cz |
| `apps/oop` | BI-OOP – Objektově orientované programování (Next.js) | https://oop.skopik.cz |
| `packages/ui` | `@skripta/ui` – shell, obsah, otázky, workbench, kit pro interaktivní widgety, KaTeX | – |

## Vývoj

```bash
npm install          # jen v kořeni (npm workspaces)
npm run dev          # všechna tři skripta naráz, přepínač v liště mezi nimi funguje lokálně
npm run dev:kab      # http://localhost:5173
npm run dev:kom      # http://localhost:3131
npm run dev:oop      # http://localhost:3123
npm run playground   # ukázka komponent kitu, http://localhost:5180
npm run typecheck
```

## Nasazení

Všechna tři skripta jsou statické weby (žádný server; OOP spouští Scalu na Scastie přímo z prohlížeče).
Každé je samostatný projekt ze stejného repa; **kořen projektu = kořen repa** (kvůli sdílenému `packages/ui`).

| Projekt | Build | Výstup | Sledované cesty |
|---|---|---|---|
| kab.skopik.cz | `npm ci && npm run build:kab` | `apps/kab/dist` | `apps/kab/**`, `packages/ui/**`, `package-lock.json` |
| kom.skopik.cz | `npm ci && npm run build:kom` | `apps/kom/out` | `apps/kom/**`, `packages/ui/**`, `package-lock.json` |
| oop.skopik.cz | `npm ci && npm run build:oop` | `apps/oop/out` | `apps/oop/**`, `packages/ui/**`, `package-lock.json` |

Na statickém hostingu (Cloudflare Pages apod.) stačí build + výstupní složka, Node ≥ 20. Kde je potřeba proces
(Railway), start je `npm start -w apps/<kab|kom|oop>` (`serve` na `$PORT`).

API balíčku a pravidla pro interaktivní widgety jsou v [`packages/ui/README.md`](packages/ui/README.md).
