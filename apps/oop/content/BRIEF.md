# BI-OOP midterm kuchařka — shared brief for content agents

## Goal
An interactive study app ("skripta") for the FIT ČVUT course BI-OOP that gets a student
ready for the **midterm on 10. 11. 2026** fast. It will be deployed publicly for other students.

Midterm format (from the course page and the official sample):
- 10 questions × 2 points, min 10/20 to pass, on paper, 45 minutes, code is **Scala 3**.
- Mostly "What will it print?" (dispatch, overloading vs overriding, super chains, generics, variance,
  compile errors are valid answers) and multi-answer multiple choice (bounds, variance, override rules).
- Official sample: `/Users/vojta/Desktop/cvut/BI-OOP/sample-midterm.pdf` — read it to calibrate.
- Covers lectures 1, 2, 4, 5, 6 (lecture 3 was a guest talk, not tested).

## Schema
Everything you write must type-check against `/Users/vojta/Desktop/cvut/BI-OOP/app/content/types.ts`.
Read it fully. Files import only from `'../types'`. Use template literals for `code` (escape backticks and `${`).
Check your file compiles: `cd /Users/vojta/Desktop/cvut/BI-OOP/app && npx -y -p typescript@5.6.3 tsc --noEmit --strict --skipLibCheck --target es2022 --moduleResolution bundler --module esnext content/types.ts <your files>`.
Write ONLY the files your task names. Never edit types.ts — if the schema can't express something, say so in your final report.

## Sources (lecture slides)
PDFs: `/Users/vojta/Desktop/cvut/BI-OOP/app/public/slides/{L1,L2,L4,L5,L6}.pdf`
- L1 = Principles of OOP, L2 = Subtyping polymorphism, L4 = Parametric polymorphism,
  L5 = Encapsulation, ADTs and pattern matching, L6 = Composition, inheritance and ad-hoc polymorphism.
- Get exact per-page text with `pdftotext -f N -l N -layout <pdf> -` (N = 1-based page). You can also Read the
  PDF with the `pages` parameter to see diagrams/code that are images.
- A `SourceRef` of kind `slide` needs the right `page` and, when you cite a statement, a `quote`: a short
  contiguous phrase (5–15 words) copied verbatim from that page's pdftotext output, on ONE line of that output
  (the viewer highlights it). Do not paraphrase inside `quote`.
- FIT Wiki copy (student-sourced, answers may be wrong!): `/Users/vojta/Desktop/cvut/BI-OOP/fit-wiki/`
  (`zdroj/*.txt` = page source, `stranky/*.html`, `media/` = images).

## Language & style
- Czech prose. Keep established English terms (override, overloading, covariance, trait, bound, case class…).
- Skripta, NOT documentation. Short, concrete, exam-oriented: "how do I compute the answer on paper",
  worked examples, typical traps. No walls of text, no Scala reference dumps. If a sentence doesn't help
  someone answer a midterm question or understand why, cut it.
- Every claim that comes from the course must carry `sources` pointing to the slide.

## Correctness
- `scala-cli` is installed (Scala 3.9). Any code whose output or compilability matters MUST be run:
  put top-level code in `@main def run() = ...`, run `scala-cli run --server=false file.scala`.
  Keep scratch files in your own folder under
  `/private/tmp/claude-501/-Users-vojta-Desktop-cvut/07b79c13-ddc4-4f6c-942f-0e494eea79f1/scratchpad/<your-task>/`.
- Student answers on FIT Wiki / Discord / Anki are hints, never truth. Compiler wins; mention disagreements
  in the explanation ("na wiki je uvedeno X, ale ve skutečnosti…").
- `verified`: 'scala' only if you actually ran it.

## Original sources of real questions
A question transcribed from an image (screenshot, photo, Anki card image, PDF page) must carry the original:
copy the file into `app/public/sources/<group>/` and add a `{ kind: 'image', src: '/sources/<group>/<file>', label, url? }`
source, plus a `wiki` source with the page `url` where it was published (e.g. `https://fit-wiki.cz/škola/předměty/bi-oop/k2`).

## Provenance (Origin)
- Real question from course material → `{ type: 'real', seen: [...] }` listing every place it appeared.
- Your own question → `{ type: 'original', inspiredBy: '<which real question / slide>', why: '<what it drills, 1 sentence>' }`.

## Out of scope (skip entirely)
Unit testing / mocks / stubs / fakes, error handling (exceptions, Try, Either), reflection, design patterns,
UML, refactoring, modules / UI / persistence layers, the semester project, lab-specific project code.

## Do not
- Do not call paid APIs. Do not edit files outside your task. Do not install global packages.
