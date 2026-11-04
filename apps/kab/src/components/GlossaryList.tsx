// Glossary chapter: every term from `src/glossary.ts`, grouped by category. Plain text — no tooltips here.
import { glossary, type GlossaryEntry } from '../glossary'

// Stable order of categories — ones not listed here are appended in first-seen order.
const CATEGORY_ORDER = [
  'Základní pojmy',
  'Pojmy o textu',
  'Kryptoanalýza',
  'Modely útočníka',
  'Klasické šifry',
  'Symetrická kryptografie',
  'Bloková kryptografie',
  'Proudové šifry',
  'Operační módy',
  'Hašovací funkce',
  'Asymetrická kryptografie',
  'Eliptické křivky',
  'Teorie čísel',
  'Teorie informace',
  'Teorie složitosti',
  'Bezpečnost',
  'Algoritmy',
  'Generování klíčů',
  'PKI',
  'Čipové karty',
  'Kvantová kryptografie',
]

function grouped(): [string, GlossaryEntry[]][] {
  const by = new Map<string, GlossaryEntry[]>()
  for (const e of glossary) by.set(e.category, [...(by.get(e.category) ?? []), e])
  const order = [...CATEGORY_ORDER.filter((c) => by.has(c)), ...[...by.keys()].filter((c) => !CATEGORY_ORDER.includes(c))]
  return order.map((c) => [c, by.get(c)!])
}

export function GlossaryList({ id }: { id?: string }) {
  return (
    <div id={id} className="kab-gl">
      {grouped().map(([cat, entries]) => (
        <section key={cat}>
          <h3>{cat}</h3>
          <dl>
            {entries.map((e) => (
              <div key={e.term} className="kab-gl-row">
                <dt>{e.term}</dt>
                <dd>
                  {e.definition}
                  <span className="kab-gl-plain">{e.plain}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  )
}
