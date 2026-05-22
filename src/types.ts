// Content schema for skripta. LLM-friendly: chapters → sections → blocks.
// All `html` fields support inline math via $...$ and display math via $$...$$.
// Inline HTML allowed: <strong>, <em>, <code>, <a href="#anchor">, <sup>, <sub>.

export type CalloutKind =
  | 'definice'
  | 'veta'
  | 'priklad'
  | 'poznamka'
  | 'lemma'
  | 'dusledek'
  | 'dukaz'

export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'h3'; id: string; number: string; title: string } // e.g. "5.5.1 Injektivita"
  | { kind: 'math'; tex: string } // standalone display math
  | { kind: 'list'; ordered: boolean; items: string[] }
  | {
      kind: 'callout'
      type: CalloutKind
      number: string // "5.5", "8.6"
      title: string // "Injektivita, důkaz"
      html: string
    }
  | {
      kind: 'interactive'
      // Registered component name (see components/interactive/registry.ts)
      component: InteractiveName
      // Optional caption rendered above the widget body.
      title?: string
      // Optional short hint shown below the title.
      hint?: string
    }

export type InteractiveName =
  | 'caesar'
  | 'vigenere'
  | 'frequency'
  | 'diffie-hellman'
  | 'square-multiply'
  | 'ecb-vs-cbc'
  | 'avalanche'
  | 'birthday'
  | 'rsa'
  | 'ec-add'
  | 'bb84'

export type Section = {
  id: string // anchor, used by sidebar (e.g. "sec-5-5")
  number: string // "5.5"
  title: string // "Ověřování injektivity a surjektivity"
  blocks: Block[]
}

export type Chapter = {
  id: string // "chap-5"
  number: string // "5"
  title: string // "Množiny a zobrazení"
  intro?: Block[] // optional content before first numbered section
  sections: Section[]
}

export type Skripta = {
  title: string
  subtitle?: string
  chapters: Chapter[]
}
