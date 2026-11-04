// Content schema for the BI-OOP midterm kuchařka. Framework-agnostic: plain TS data,
// imported by the (future) Next.js app. All `html` fields take inline HTML only:
// <strong>, <em>, <code>, <br>, <ul>/<ol>/<li>. No markdown.
// Scala code goes into `code` fields as plain text (Scala 3 syntax, 2-space indent).

// ---------------------------------------------------------------------------
// Sources — every claim taken from course material must point to it.

// Lecture PDFs live in app/public/slides/<LectureId>.pdf
//   L1 = 1. Principles of OOP           L2 = 2. Subtyping polymorphism
//   L4 = 4. Parametric polymorphism     L5 = 5. Encapsulation, ADTs, pattern matching
//   L6 = 6. Composition, inheritance, ad-hoc polymorphism
// (Lecture 3 was a guest talk without slides and is not on the midterm.)
export type LectureId = 'L1' | 'L2' | 'L4' | 'L5' | 'L6'

export type SourceRef =
  | {
      kind: 'slide'
      lecture: LectureId
      page: number // 1-based PDF page number
      // Short contiguous phrase (5–15 words) copied VERBATIM from that page as printed
      // by `pdftotext -f N -l N -layout`. The PDF viewer searches for it to highlight
      // the cited spot. Omit when citing a whole slide (e.g. a picture).
      quote?: string
    }
  | { kind: 'official'; label: string } // e.g. "Sample midterm 2026, otázka 3"
  // FIT Wiki page, e.g. label "Kvíz K2 2024/25", page "k2",
  // url "https://fit-wiki.cz/škola/předměty/bi-oop/k2"
  | { kind: 'wiki'; label: string; page?: string; url?: string }
  // The original image a question was transcribed from (screenshot, photo of a test, Anki card image).
  // The file is copied into app/public/sources/<group>/ and `src` is its public path,
  // e.g. "/sources/kvizy/q2/quiz_2_3.png". `url` = where it can be found online, if known.
  | { kind: 'image'; src: string; label: string; url?: string }

// ---------------------------------------------------------------------------
// Chapters ("skripta")

export type CalloutKind =
  | 'definice' // pojem, který musíš umět definovat
  | 'pravidlo' // mechanické pravidlo / postup, podle kterého se počítá odpověď
  | 'priklad' // vyřešený příklad
  | 'past' // typický chyták na testu
  | 'poznamka' // doplňující poznámka
  | 'shrnuti' // shrnutí na konci sekce

export type Block =
  | { kind: 'p'; html: string; sources?: SourceRef[] }
  | { kind: 'list'; ordered: boolean; items: string[]; sources?: SourceRef[] }
  // `runnable: true` → the UI offers "Spustit / Otevřít v editoru" (Scastie). Must then be
  // a complete program (top-level code inside `@main def run() = ...`) verified with scala-cli.
  | { kind: 'code'; code: string; caption?: string; runnable?: boolean; sources?: SourceRef[] }
  | {
      kind: 'callout'
      type: CalloutKind
      title: string
      html: string
      code?: string
      sources?: SourceRef[]
    }
  | { kind: 'interactive'; component: InteractiveName; title?: string; hint?: string }
  // Embeds questions from the bank (by id) as an inline mini-quiz.
  | { kind: 'quiz'; ids: string[]; title?: string }

export type InteractiveName =
  | 'variance-lab' // Box[+T]/[-T]/[T] subtyping drill
  | 'bounds-lab' // upper/lower bounds — what can be passed / called
  | 'dispatch-tracer' // overloading (static) vs overriding (dynamic), step by step
  | 'linearization' // trait linearization + super chain
  | 'override-rules' // which param/return types are allowed in override

export type Section = {
  id: string // anchor, e.g. "sec-4-3"
  number: string // "4.3"
  title: string
  blocks: Block[]
}

export type Chapter = {
  id: string // "chap-4"
  number: string // "4"
  title: string
  lecture: LectureId
  summary: string // 1–2 sentences: what you must be able to do after this chapter
  sections: Section[]
}

// ---------------------------------------------------------------------------
// Question bank

export type Topic =
  | 'principy' // L1: principy OOP, coupling/cohesion, ADT vs objekty
  | 'objekty' // L2: třídy, konstruktory, val/var, object, this/super
  | 'dispatch' // L2: overloading vs overriding, static/dynamic/double dispatch
  | 'subtyping' // L2: subtyping, LSP, nominal vs structural, override rules
  | 'generics' // L4: generické třídy, upper/lower bounds
  | 'variance' // L4: co/contra/invariance, variance positions, function subtyping
  | 'erasure' // L4: type erasure
  | 'encapsulation' // L5: access modifiers, leaking state, immutability
  | 'adt' // L5: case classes, ADT, data modelling
  | 'pattern' // L5: pattern matching
  | 'composition' // L6: composition vs inheritance, decorator, delegation
  | 'traits' // L6: traits, linearization, stackable, diamond problem
  | 'adhoc' // L6: operator overloading, implicit conversions, type classes

// Where the question comes from — shown to the student as a badge.
export type Origin =
  // Appeared in real course material. `seen` lists every place it (or a near-identical
  // variant) appeared, e.g. ["Kvíz 2 (2023/24, Discord)", "Anki 2023/24"].
  | { type: 'real'; seen: string[] }
  // Written by us. `inspiredBy` = which real question/slide it imitates,
  // `why` = what skill it drills and why it is worth having (1 sentence, Czech).
  | { type: 'original'; inspiredBy: string; why: string }

// How confident we are that the stored answer is right.
//  'scala'     : compiled/run with Scala 3 (scala-cli) and the answer matches the output
//  'slides'    : backed by a specific statement in the lecture slides (put it in `sources`)
//  'reasoning' : our reasoning only, not mechanically checked
export type Verified = 'scala' | 'slides' | 'reasoning'

type QuestionBase = {
  id: string // unique, e.g. "anki-17", "kv2-05", "wiki-k2-01", "ch4-03"
  topic: Topic
  lecture: LectureId
  origin: Origin
  prompt: string // html
  code?: string // Scala snippet shown under the prompt (as on the paper test)
  explanation: string // html — WHY, step by step, the way you'd reason on paper
  verified: Verified
  sources?: SourceRef[]
}

export type Question =
  // Multiple choice, possibly several correct options (as on the real test).
  | (QuestionBase & { kind: 'mc'; options: string[]; correct: number[] })
  // "What will it print?" — answer is the exact stdout (trimmed),
  // or the sentinel 'CE' when the code does not compile.
  | (QuestionBase & { kind: 'output'; answer: string })
  // Open question, self-graded against a model answer.
  | (QuestionBase & { kind: 'open'; modelAnswer: string })

export const COMPILE_ERROR = 'CE'

// ---------------------------------------------------------------------------
// Mock tests

export type MockTest = {
  id: string // "sample", "mock-1"
  title: string
  description: string
  questionIds: string[] // exactly 10, each worth 2 points
}
