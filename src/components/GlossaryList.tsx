import { glossary } from '../glossary'

// Stable order of categories — ones not listed here are appended at the end
// in first-seen order.
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

export function GlossaryList() {
  const byCategory = new Map<string, typeof glossary>()
  for (const e of glossary) {
    const list = byCategory.get(e.category) ?? []
    list.push(e)
    byCategory.set(e.category, list)
  }

  const seen = new Set<string>()
  const ordered: string[] = []
  for (const cat of CATEGORY_ORDER) {
    if (byCategory.has(cat)) {
      ordered.push(cat)
      seen.add(cat)
    }
  }
  for (const cat of byCategory.keys()) {
    if (!seen.has(cat)) ordered.push(cat)
  }

  return (
    <div className="glossary-list">
      {ordered.map((cat) => {
        const entries = byCategory.get(cat)!
        return (
          <section key={cat}>
            <h3 className="gloss-category">{cat}</h3>
            <dl>
              {entries.map((e) => (
                <FragmentRow key={e.term} term={e.term} def={e.definition} />
              ))}
            </dl>
          </section>
        )
      })}
    </div>
  )
}

function FragmentRow({ term, def }: { term: string; def: string }) {
  return (
    <>
      <dt>{term}</dt>
      <dd>{def}</dd>
    </>
  )
}
