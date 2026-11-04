# BI-KOM skripta — shared brief for content agents

## Goal
An interactive study app ("skripta") for the FIT ČVUT course **BI-KOM Konceptuální modelování**
(zimní semestr 2026/27). The student wants to **understand** the material before the tests — not a detailed
reference. Short, clear, visual, with OntoUML diagrams, interactive blocks and check questions in the text.

Tests (both in Moodle, multiple choice / true-false, Czech):
- **Midterm** (cvičení 8): 10 otázek, 15+5 min, min 5 / max 10 bodů, "zopakovat si OntoUML".
  Example: `/Users/vojta/Desktop/cvut/BI-KOM/fit-wiki/kom_midterm_2022.png` (look at it — calibrates the style:
  "Nadtypem «Kind» může být typ se stereotypem…", "Vyberte správné charakteristiky pro CATEGORY", "KVALITA je intrinsický aspekt").
- **Zkouška** (40 bodů): whole course (OntoUML, transformace, OCL, RDF/OWL, BPMN…).

## Schema
Everything must type-check against `/Users/vojta/Desktop/cvut/BI-KOM/app/content/types.ts`. Read it fully,
especially the **Diagram** section and its layout conventions. Files import only from `'../types'`.
Check your files compile:
`cd /Users/vojta/Desktop/cvut/BI-KOM/app && npx -y -p typescript@5.6.3 tsc --noEmit --strict --skipLibCheck --target es2022 --moduleResolution bundler --module esnext content/types.ts <your files>`
Write ONLY the files your task names. Never edit types.ts — if the schema can't express something, say so in your final report.

Export names: chapter file `content/chapters/chapNN.ts` exports `export const chapNN: Chapter = {...}`;
bank file `content/bank/chNN.ts` exports `export const chNN: Question[] = [...]`. (NN = two digits: 01, 02 …)

## Sources
Lecture/lab PDFs: `/Users/vojta/Desktop/cvut/BI-KOM/app/public/slides/<DocId>.pdf` (DocId list in types.ts).
Pre-extracted per-page text (pages marked `=== PAGE N ===`):
`/private/tmp/claude-501/-Users-vojta-Desktop-cvut/9962fab0-3554-48ff-acda-96f8d45dc6a4/scratchpad/text/`
(`prednasky_02-ontouml-basics-sortals.txt` = P02, `cviceni_03-ontouml-basics-sortals.txt` = C03, …; note that
lecture and lab numbers are shifted: P02 ↔ C03, P03 ↔ C04, P04 ↔ C05, P05+P06 ↔ C06, P07 ↔ C07, P08 ↔ C09, P09 ↔ C10/C11).
- Slide diagrams are images — Read the PDF with the `pages` parameter to SEE them. Many slides are diagram-only.
- A `slide` SourceRef needs the right `page`; when citing a statement add `quote`: a contiguous phrase (4–15 words)
  copied VERBATIM from ONE line of that page's pdftotext output (the viewer highlights it). Don't paraphrase in `quote`.
- Every claim from the course carries `sources`. Prefer lecture (P..) refs; add lab (C..) refs when the lab explains it better.
- **Official OntoUML docs** (cite with `{kind:'web', label, url}`): https://ontouml.readthedocs.io/en/latest/ —
  e.g. classes/sortals/kind/index.html, classes/sortals/role/index.html, relations/…, anti-patterns/… .
  Verify every URL you cite with WebFetch (must not 404). For OCL/RDF/OWL/BPMN, official specs (omg.org, w3.org) are fine.
- FIT Wiki student summary: `/Users/vojta/Desktop/cvut/BI-KOM/app/public/slides/W-suhrn.pdf` (DocId 'W-suhrn') — student-made,
  may contain errors; slides win.

## Language & style
- Czech prose. Keep OntoUML/UFO terms in English as on slides: kind, subkind, role, phase, relator, mediation,
  rigidita / anti-rigidita, identita, sortál, generalization set, componentOf…
- Skripta, NOT documentation: short paragraphs, concrete examples (Person / Student / Child / Adult / Marriage / Enrollment…),
  "jak to poznám", typical traps. Prefer a diagram, a table or a callout to a paragraph. If a sentence doesn't help
  understanding or answering a test question, cut it.
- Each section ≈ 3–8 blocks. Each chapter 4–8 sections.
- **Per section put at least one `quiz` block** (1–2 question ids from your bank) right after the explanation —
  these are the "průběžné otázky". Put `interactive` blocks where the task says.
- Stereotype chips in html: `<span class="st">«kind»</span>`.

## Diagrams — make them beautiful
- Use `diagram` blocks generously (every key concept deserves one) and `compare` blocks for špatně → správně.
- Follow the grid conventions in types.ts precisely. Think about every coordinate: symmetric trees, no crossings,
  labels not colliding. Prefer 3–7 classes per diagram.
- Add `note` to classes where a hover tooltip helps ("anti-rigidní: Student může přestat studovat").
- Use `steps` for a diagram that is best explained by building it up (e.g. the role pattern, relator + derivation).
- Use `mark` to point at the important/bad part.
- Preview: when `/Users/vojta/Desktop/cvut/BI-KOM/app/scripts/preview-diagrams.ts` exists, run
  `cd /Users/vojta/Desktop/cvut/BI-KOM/app && npx tsx scripts/preview-diagrams.ts content/chapters/chapNN.ts <outdir>`
  — it writes one PNG per diagram into <outdir> (use your scratchpad folder). Look at them and fix layouts.
  If it doesn't exist yet when you finish, just make sure the coordinates are sensible.

## Questions (bank)
Moodle style: `mc` (one or more correct, 4–8 options) and `tf`. Czech. Every question has an `explanation` (why each
option is right/wrong, briefly) and `sources`. Your own questions: `origin: {type:'original', inspiredBy, why}`.
Questions from the slides' "Časté otázky"/quiz pages: `origin: {type:'real', seen:['Přednáška 2, Časté otázky']}`.
Ids: `chNN-01`, `chNN-02`, … Aim for 10–16 questions per chapter, covering what a midterm/exam would ask.

## Scratch files
Your own folder under `/private/tmp/claude-501/-Users-vojta-Desktop-cvut/9962fab0-3554-48ff-acda-96f8d45dc6a4/scratchpad/<your-task>/`.

## Do not
Do not call paid APIs. Do not edit files outside your task. Do not install global packages. Do not git commit.
