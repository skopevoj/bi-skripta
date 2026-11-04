'use client'
// BI-KOM ↔ @skripta/ui: course config (docs, renderers, labs, practice). Functions live here, in a client file.
import type { ReactNode } from 'react'
import { CodeBlock, type QuestionLike } from '@skripta/ui'
import { NextSkriptaProvider } from '@skripta/ui/next'
import type { CodeLang, Question } from '@content/types'
import { CompareBlockView, DiagramBlockView } from '@/components/onto/blocks'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { WIDGETS } from '@/components/interactive/registry'
import { highlight } from '@/lib/highlight'
import { SOURCE_GROUPS, TOPICS, UI_DOCS, VERIFIED, sourceGroup } from '@/lib/meta'

const LANGS: Record<CodeLang, string> = { ocl: 'OCL', turtle: 'Turtle', sparql: 'SPARQL', xml: 'XML', text: 'Text' }
const kom = (q: QuestionLike) => q as Question

function webLabel(url: string) {
  if (/ontouml/i.test(url)) return 'OntoUML'
  if (/w3\.org/.test(url)) return 'W3C'
  if (/omg\.org/.test(url)) return 'OMG'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'Web'
  }
}

export function KomProvider({ children }: { children: ReactNode }) {
  return (
    <NextSkriptaProvider
      course={{ id: 'bi-kom', code: 'BI-KOM', name: 'Konceptuální modelování', storage: 'kom' }}
      docs={UI_DOCS}
      wikiUrl="https://fit-wiki.cz/škola/předměty/bi-kom"
      webLabel={webLabel}
      highlight={(code, lang) => highlight(code, (lang ?? 'text') as CodeLang)}
      codeLangs={LANGS}
      blocks={{ diagram: DiagramBlockView, compare: CompareBlockView }}
      interactive={WIDGETS}
      practice={{
        topics: TOPICS,
        verified: VERIFIED,
        sourceGroups: { labels: SOURCE_GROUPS, of: (q) => sourceGroup(kom(q)) },
        promptExtra: (q) => {
          const k = kom(q)
          return (
            <>
              {k.diagram && <OntoDiagram diagram={k.diagram} compact />}
              {k.code && <CodeBlock code={k.code} lang={k.lang ?? 'ocl'} actions={false} />}
            </>
          )
        },
        testDefaults: { minutes: 20, points: 1, partial: true },
        testRules:
          'Jako v Moodle: každá otázka za 1 bod, u otázek s více správnými odpověďmi dostaneš část bodu (špatně zaškrtnutá možnost body ubírá). Odpovědi se ukážou až po odevzdání. Slajdy během testu nepoužívej.',
      }}
    >
      {children}
    </NextSkriptaProvider>
  )
}


