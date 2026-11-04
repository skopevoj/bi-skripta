// Content schema for the BI-KOM skripta. Plain TS data, imported by the Next.js app.
// All `html` fields take inline HTML only: <strong>, <em>, <code>, <br>, <ul>/<ol>/<li>,
// <span class="st">«kind»</span> (a stereotype chip). No markdown.

// ---------------------------------------------------------------------------
// Documents (PDFs in app/public/slides/<DocId>.pdf)

//  Přednášky (lectures)                         Cvičení (labs)
//  P01 Úvod do konceptuálního modelování        C01 Úvod, Costy Taxi
//  P02 OntoUML: základy, rigidní/anti-r. sortály C02 UML recap, OpenPonk
//  P03 OntoUML: ne-sortály, vztahy               C03 OntoUML: sortály
//  P04 OntoUML: celek–část, aspekty               C04 OntoUML: ne-sortály, vztahy
//  P05 OntoUML: shrnutí, antipatterny             C05 OntoUML: celek–část, aspekty
//  P06 Transformace OntoUML → UML                 C06 Shrnutí, antipatterny, transformace
//  P07 OCL                                        C06-eshop  E-shop zadání (1 strana)
//  P08 RDF, OWL                                   C07 OCL (+ midterm info)
//  P09 BPMN                                       C08 Konzultace, midterm
//  P11 Shrnutí, příklady, AI v KM                 C09 RDF   C10 BPMN   C11 BPMN 2   C12 Konzultace
//  W-suhrn  Studentský souhrn OntoUML z FIT Wiki (může obsahovat chyby)
export type DocId =
  | 'P01' | 'P02' | 'P03' | 'P04' | 'P05' | 'P06' | 'P07' | 'P08' | 'P09' | 'P11'
  | 'C01' | 'C02' | 'C03' | 'C04' | 'C05' | 'C06' | 'C06-eshop' | 'C07' | 'C08'
  | 'C09' | 'C10' | 'C11' | 'C12'
  | 'W-suhrn'

export type SourceRef =
  | {
      kind: 'slide'
      doc: DocId
      page: number // 1-based PDF page number
      // Short contiguous phrase (4–15 words) copied VERBATIM from that page as printed by
      // `pdftotext -f N -l N -layout`, from ONE line of that output. The viewer highlights it.
      // Omit when citing a whole slide (a picture / diagram).
      quote?: string
    }
  // Official external documentation, e.g. the OntoUML spec:
  // { kind: 'web', label: 'OntoUML docs: Kind', url: 'https://ontouml.readthedocs.io/en/latest/classes/sortals/kind/index.html' }
  | { kind: 'web'; label: string; url: string }
  // FIT Wiki page (student-sourced)
  | { kind: 'wiki'; label: string; url?: string }
  // The original image a question was transcribed from; file copied to app/public/sources/<group>/
  | { kind: 'image'; src: string; label: string; url?: string }

// ---------------------------------------------------------------------------
// OntoUML diagrams — declarative, rendered by the app as SVG.
//
// Layout is a GRID: each class has `x` (column) and `y` (row) — numbers, fractions allowed
// (e.g. x: 1.5 to center between two columns). One column ≈ 210 px, one row ≈ 130 px.
// Conventions (follow them, the diagrams must look clean):
//  - supertypes ABOVE subtypes (smaller y). Generalization arrows point up.
//  - children of one generalization (set) share one row and are spread symmetrically under the parent
//    (parent at x = 1, children at x = 0 and x = 2, or parent at x = 1.5 with children 0,1,2,3 …).
//  - relators sit BETWEEN the things they mediate, usually in the same row as them.
//  - avoid crossings; keep diagrams small (≤ 9 classes). Two small diagrams beat one big one.

export type ClassSt =
  // sortals
  | 'kind' | 'subkind' | 'role' | 'phase' | 'collective' | 'quantity' | 'relator'
  // non-sortals
  | 'category' | 'mixin' | 'roleMixin' | 'phaseMixin'
  // aspects (moments)
  | 'mode' | 'quality'
  // other
  | 'event' | 'type' | 'datatype' | 'enumeration'
  | 'none' // plain UML class without stereotype

export type RelSt =
  | 'material' | 'formal' | 'mediation' | 'characterization' | 'derivation'
  | 'componentOf' | 'memberOf' | 'subCollectionOf' | 'subQuantityOf' | 'containment'
  | 'externalDependence' | 'instantiation'
  | 'none' // plain UML association

// Visual emphasis, used e.g. in antipattern "before/after" diagrams.
export type Mark = 'focus' | 'good' | 'bad' | 'dim'

export type DClass = {
  id: string
  name: string
  st: ClassSt
  x: number
  y: number
  attrs?: string[] // e.g. ["name: String", "birthDate: Date"]
  literals?: string[] // for enumerations
  abstract?: boolean // name in italics
  mark?: Mark
  note?: string // tooltip shown on hover (plain text, Czech), e.g. why it is a «role»
}

export type DGen = {
  id?: string
  general: string // class id of the supertype
  specifics: string[] // class ids of subtypes (one arrow tree)
  set?: { name?: string; disjoint?: boolean; complete?: boolean } // generalization set
  mark?: Mark
}

export type DAssoc = {
  id?: string
  from: string
  to: string
  st?: RelSt
  name?: string // label in the middle, e.g. "studies at"
  fromMult?: string // multiplicity at `from` end, e.g. "1..*"
  toMult?: string
  fromRole?: string
  toRole?: string
  // part–whole relations: which end is the WHOLE (diamond is drawn there).
  whole?: 'from' | 'to'
  shareable?: boolean // part–whole: true = hollow diamond, false/undefined = filled
  meta?: string[] // meta-attributes shown in braces next to the line, e.g. ["essential"], ["inseparable"], ["readOnly"]
  route?: 'auto' | 'straight' | 'hv' | 'vh' // auto = straight if aligned, else orthogonal elbow
  mark?: Mark
}

// «derivation»: dashed line from a «material» association (by its id) to the «relator» it is derived from.
export type DDerivation = { relator: string; assoc: string }

export type DNote = { id: string; text: string; x: number; y: number; attach?: string[] }

export type Diagram = {
  classes: DClass[]
  gens?: DGen[]
  assocs?: DAssoc[]
  derivations?: DDerivation[]
  notes?: DNote[]
  // Optional build-up: each step lists the class ids visible from that step on
  // (cumulative = steps[0] ∪ … ∪ steps[i]). Edges appear once both ends are visible.
  steps?: { label: string; add: string[] }[]
}

// ---------------------------------------------------------------------------
// Chapters ("skripta")

export type CalloutKind =
  | 'definice' // pojem, který musíš umět definovat
  | 'pravidlo' // pravidlo / postup (např. "role musí mít relační závislost")
  | 'priklad' // vyřešený příklad
  | 'past' // typický chyták na testu
  | 'poznamka' // doplňující poznámka
  | 'shrnuti' // shrnutí na konci sekce

export type CodeLang = 'ocl' | 'turtle' | 'sparql' | 'xml' | 'text'

export type Block =
  | { kind: 'p'; html: string; sources?: SourceRef[] }
  | { kind: 'list'; ordered: boolean; items: string[]; sources?: SourceRef[] }
  | { kind: 'code'; code: string; lang: CodeLang; caption?: string; sources?: SourceRef[] }
  | { kind: 'callout'; type: CalloutKind; title: string; html: string; code?: string; lang?: CodeLang; sources?: SourceRef[] }
  // A table. Cells are inline html. Great for "stereotyp × vlastnosti" overviews.
  | { kind: 'table'; head: string[]; rows: string[][]; caption?: string; sources?: SourceRef[] }
  // One OntoUML diagram.
  | { kind: 'diagram'; diagram: Diagram; title?: string; caption?: string; sources?: SourceRef[] }
  // Side-by-side variants (špatně → správně, or alternatives). Usually 2 items.
  | {
      kind: 'compare'
      title?: string
      items: { label: string; verdict?: 'good' | 'bad' | 'neutral'; note?: string; diagram: Diagram }[]
      sources?: SourceRef[]
    }
  // A picture rendered from a slide (BPMN diagrams, RDF graphs…): file in app/public/figures/.
  | { kind: 'figure'; src: string; alt: string; caption?: string; sources?: SourceRef[] }
  | { kind: 'interactive'; component: InteractiveName; title?: string; hint?: string }
  // Inline check questions from the bank (by id) — "průběžné otázky v látce". 1–3 ids.
  | { kind: 'quiz'; ids: string[]; title?: string }

export type InteractiveName =
  | 'stereotype-tree' // rozhodovací strom: identita? rigidita? závislost? → stereotyp
  | 'gs-venn' // generalization set: disjoint × complete, Vennův diagram + příklady instancí
  | 'rigidity-timeline' // jedna entita v čase/světech: kind zůstává, phase/role se mění
  | 'part-whole' // která celek–část relace? (componentOf / memberOf / subCollectionOf / subQuantityOf)
  | 'ocl-playground' // OCL kolekce: select/reject/collect/forAll/exists/size nad malým objektovým modelem
  | 'rdf-graph' // Turtle trojice ↔ graf
  | 'bpmn-tokens' // tokeny přes brány XOR / AND / OR
  | 'transform' // OntoUML → UML: strategie transformace (fáze, role, relátor…)

export type Section = {
  id: string // anchor, e.g. "sec-2-3"
  number: string // "2.3"
  title: string
  blocks: Block[]
}

export type Chapter = {
  id: string // "chap-2"
  number: string // "2"
  title: string
  docs: DocId[] // main lectures/labs this chapter is built from
  exam: ('midterm' | 'zkouska')[] // where this is tested
  summary: string // 1–2 sentences: what you must be able to do after this chapter
  sections: Section[]
}

// ---------------------------------------------------------------------------
// Question bank (tests in Moodle are multiple-choice / true-false)

export type Topic =
  | 'km' // úvod do konceptuálního modelování, účel, modularizace, UFO
  | 'uml' // UML recap, asociace, multiplicita, generalization sets
  | 'sortaly' // kind, subkind, role, phase, identita, rigidita
  | 'nesortaly' // category, mixin, roleMixin, phaseMixin
  | 'vztahy' // material, formal, mediation, relator, derivation
  | 'celek-cast' // componentOf, memberOf, subCollectionOf, subQuantityOf, collective, quantity
  | 'aspekty' // mode, quality, characterization
  | 'antipatterny'
  | 'transformace' // OntoUML → UML / implementace
  | 'ocl'
  | 'rdf' // RDF, RDFS, OWL, SPARQL
  | 'bpmn'

export type Origin =
  // Appeared in real course material (midterm/exam screenshot on FIT Wiki, slides "Časté otázky"…).
  | { type: 'real'; seen: string[] }
  // Written by us.
  | { type: 'original'; inspiredBy: string; why: string }

// 'slides' : the answer is backed by a statement in the slides / official docs (put it in `sources`)
// 'reasoning' : our reasoning only
export type Verified = 'slides' | 'reasoning'

type QuestionBase = {
  id: string // unique, e.g. "mid22-03", "ex-14", "ch2-05"
  topic: Topic
  origin: Origin
  prompt: string // html
  diagram?: Diagram // optional diagram shown under the prompt
  code?: string // optional OCL/Turtle snippet shown under the prompt
  lang?: CodeLang
  explanation: string // html — WHY
  verified: Verified
  sources?: SourceRef[]
}

export type Question =
  // Multiple choice, possibly several correct options (like Moodle "Vyberte jednu nebo více možností").
  | (QuestionBase & { kind: 'mc'; options: string[]; correct: number[] })
  // Pravda / Nepravda
  | (QuestionBase & { kind: 'tf'; answer: boolean })
  // Open question, self-graded against a model answer.
  | (QuestionBase & { kind: 'open'; modelAnswer: string })

// ---------------------------------------------------------------------------
// Mock tests

export type MockTest = {
  id: string // "midterm-1", "zkouska-1"
  title: string
  description: string
  minutes: number
  questionIds: string[]
}
