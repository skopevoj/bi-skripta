'use client'
// BI-OOP ↔ @skripta/ui: course config (docs, renderers, labs, practice). Functions live here, in a client file.
import { useMemo, type ReactNode } from 'react'
import { docView, type CiteItem, type QuestionLike, type SourceRef } from '@skripta/ui'
import type { PracticeConfig } from '@skripta/ui/practice'
import { NextSkriptaProvider } from '@skripta/ui/next'
import type { Question } from '@content/types'
import { WIDGETS } from '@/components/interactive/registry'
import { outputKind } from '@/components/practice/output'
import { CodeActions, RunInEditor } from '@/components/workbench/OopWorkbench'
import { highlight } from '@/lib/highlight'
import { CALLOUTS, LECTURE_IDS, SAMPLE_PDF, SOURCE_GROUPS, TOPICS, UI_DOCS, VERIFIED, lectureNum, sourceGroup } from '@/lib/meta'

const oop = (q: QuestionLike) => q as unknown as Question
const SAMPLE_DOC = UI_DOCS.find((d) => d.id === 'sample')!

/**
 * "Sample midterm 2026, otázka 3" → „Originál“ badge opening the official sample PDF on that question's page
 * (two questions per page). Hidden when the same refs already cite the PDF as an image with the exact page.
 */
function resolveSource(r: SourceRef, all: SourceRef[]): CiteItem | null | undefined {
  if (r.kind !== 'official' || !/sample midterm/i.test(r.label)) return undefined
  if (all.some((x) => x.kind === 'image' && x.src === SAMPLE_PDF)) return null
  const m = r.label.match(/otázk[ay]\s*(\d+)/i)
  const page = Math.ceil((m ? Number(m[1]) : 1) / 2)
  return { k: 'source', key: `sample-${page}`, label: 'Originál', title: r.label, icon: 'img', view: docView(SAMPLE_DOC, page, {}) }
}

const codeActions = (p: { code: string; runnable?: boolean }) => <CodeActions code={p.code} runnable={p.runnable} />

const TEST_RULES =
  'Každá otázka za 2 body, bez částečných bodů – stejně jako na skutečném testu. Odpovědi se ukážou až po odevzdání. Editor ani slajdy během testu nepoužívej.'

/** `lectureTitles`: lecture id → chapter title (plain data from the server layout, for the bank filter). */
export function OopProvider({ lectureTitles, children }: { lectureTitles: Record<string, string>; children: ReactNode }) {
  const practice = useMemo<PracticeConfig>(
    () => ({
      kinds: { output: outputKind },
      topics: TOPICS,
      verified: VERIFIED,
      sourceGroups: { labels: SOURCE_GROUPS, of: (q) => sourceGroup(oop(q)) },
      bankFilters: [
        {
          id: 'lec', // same key as the old bank filter (kept in oop-bank-filters)
          label: 'Přednáška',
          options: LECTURE_IDS.map((l) => [l, `${lectureNum(l)} · ${lectureTitles[l] ?? l}`]),
          get: (q) => oop(q).lecture,
        },
      ],
      resultExtra: (q) => q.code && <RunInEditor code={q.code} />,
      testDefaults: { minutes: 45, points: 2, partial: false },
      testRules: TEST_RULES,
    }),
    [lectureTitles],
  )
  return (
    <NextSkriptaProvider
      course={{ id: 'bi-oop', code: 'BI-OOP', name: 'Objektově orientované programování', storage: 'oop' }}
      docs={UI_DOCS}
      resolveSource={resolveSource}
      wikiUrl="https://fit-wiki.cz/škola/předměty/bi-oop"
      highlight={highlight}
      defaultLang="scala"
      codeLangs={{ scala: 'Scala' }}
      codeActions={codeActions}
      callouts={CALLOUTS}
      interactive={WIDGETS}
      practice={practice}
    >
      {children}
    </NextSkriptaProvider>
  )
}
