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
      kind: 'table'
      caption?: string
      headers: string[]
      rows: string[][]
    }
  | {
      kind: 'callout'
      type: CalloutKind
      number: string // "5.5", "8.6"
      title: string // "Injektivita, důkaz"
      html: string
      // Optional plain-Czech follow-up rendered under the main body. Used for
      // definitions to give a no-symbols "what it does + why it exists" gloss
      // for readers overwhelmed by the formal text.
      plain?: string
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
  | {
      kind: 'diagram'
      // Registered component name (see components/diagram/registry.ts)
      component: DiagramName
      // Optional caption rendered below the figure (e.g. "Obr. 4.1: …").
      caption?: string
    }
  | {
      // Auto-rendered list of glossary terms grouped by category. The content
      // is sourced from `src/glossary.ts`; this block type exists so we can
      // bypass the MathHTML processor (which would otherwise turn every term
      // in its own definition into a tooltip).
      kind: 'glossary'
    }
  | {
      // Real exam-style exercise rendered as a multi-step card:
      // Zadání → (optional) interactive guess → Výpočet → Výsledek.
      kind: 'exercise'
      number: string // "1.7", "2.1"
      title?: string // optional short label, e.g. "Diffie–Hellman, 3 účastníci"
      source?: string // optional, e.g. "1. test 21.03.2025"
      // Problem statement (HTML, supports math).
      problem: string
      // Optional worked solution shown on the "Výpočet" tab.
      solution?: string
      // Final answer shown on the "Výsledek" tab.
      result: string
      // Optional answer-checking widget on the Zadání tab.
      // - 'open': free-text input; user input is compared against `accept`.
      // - 'multichoice': user toggles a set of options; checked set must equal correct set.
      answer?:
        | {
            type: 'open'
            // Accepted answers (case- and whitespace-insensitive). The first
            // value is treated as the canonical form shown on the Výsledek tab
            // if `result` is not given.
            accept: string[]
            // Optional short hint shown next to the input (e.g. format).
            placeholder?: string
          }
        | {
            type: 'multichoice'
            options: { text: string; correct: boolean }[]
          }
    }

export type InteractiveName =
  | 'mod-clock'
  | 'gcd-euclid'
  | 'ext-euclid'
  | 'euler-totient'
  | 'caesar'
  | 'affine'
  | 'hill'
  | 'vigenere'
  | 'frequency'
  | 'diffie-hellman'
  | 'square-multiply'
  | 'ecb-vs-cbc'
  | 'mode-ecb'
  | 'mode-cbc'
  | 'mode-cfb'
  | 'mode-ofb'
  | 'mode-ctr'
  | 'aes-round'
  | 'avalanche'
  | 'birthday'
  | 'sha1'
  | 'rsa'
  | 'miller-rabin'
  | 'ec-add'
  | 'bb84'

export type DiagramName =
  | 'feistel'
  | 'des-round'
  | 'merkle-damgard'
  | 'stream-sync'
  | 'apdu-frame'
  | 'smartcard-arch'
  | 'fido2-register'
  | 'fido2-auth'
  | 'cert-tree'
  | 'pubkey-authority'
  | 'qubit-bases'

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
  subtitle?: string
  chapters: Chapter[]
}
