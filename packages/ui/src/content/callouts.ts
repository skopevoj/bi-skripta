import type { CalloutDef } from '../lib/config'

/** Built-in callout kinds: label, icon, colour tone (see PLAN: definice zelená, věta/pravidlo modrá…). */
export const CALLOUTS: Record<string, CalloutDef> = {
  definice: { label: 'Definice', icon: 'book', tone: 'green', toc: true },
  veta: { label: 'Věta', icon: 'star', tone: 'blue', toc: true },
  pravidlo: { label: 'Pravidlo', icon: 'steps', tone: 'blue', toc: true },
  lemma: { label: 'Lemma', icon: 'star', tone: 'blue' },
  dusledek: { label: 'Důsledek', icon: 'arrow', tone: 'blue' },
  priklad: { label: 'Příklad', icon: 'bulb', tone: 'yellow' },
  past: { label: 'Pozor', icon: 'warn', tone: 'coral', toc: true, tocPrefix: 'Pozor' },
  pozor: { label: 'Pozor', icon: 'warn', tone: 'coral', toc: true, tocPrefix: 'Pozor' },
  poznamka: { label: 'Poznámka', icon: 'note', tone: 'purple' },
  shrnuti: { label: 'Shrnutí', icon: 'sum', tone: 'gray' },
  dukaz: { label: 'Důkaz', icon: 'proof', tone: 'gray' },
}

export function calloutDef(type: string, extra?: Record<string, CalloutDef>): CalloutDef {
  return extra?.[type] ?? CALLOUTS[type] ?? { label: type.charAt(0).toUpperCase() + type.slice(1), icon: 'note', tone: 'gray' }
}
