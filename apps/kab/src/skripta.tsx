// BI-KAB ↔ @skripta/ui: course config for the Vite app — router (Link / pathname / navigate),
// KaTeX + glossary-aware HTML rendering and the KAB block renderers.
import { createElement, useMemo, type ElementType, type ReactNode } from 'react'
import { SkriptaProvider, type BlockRenderProps, type BlockRenderer, type HtmlRenderer } from '@skripta/ui'
import { Tex, createTermWrapper, renderMathInHtml } from '@skripta/ui/math'
import { Exercise } from './components/Exercise'
import { GlossaryList } from './components/GlossaryList'
import { DiagramBlock } from './components/diagram/registry'
import { InteractiveBlock } from './components/interactive/registry'
import { glossary } from './glossary'
import { RouterLink, navigate, useLocation } from './router'
import type { Block } from './types'

// Glossary terms in body text get a tooltip (`.mx-term`); created once so rendered HTML stays memoised.
const gloss = createTermWrapper(glossary)

function KabHtml({ html, as, className, id, label }: { html: string; as: ElementType; className?: string; id?: string; label?: boolean }) {
  const out = useMemo(() => renderMathInHtml(html, { transformText: label ? undefined : gloss }), [html, label])
  return createElement(as, { className, id, dangerouslySetInnerHTML: { __html: out } })
}

const renderHtml: HtmlRenderer = (p) => <KabHtml {...p} />

type Of<K extends Block['kind']> = BlockRenderProps<Extract<Block, { kind: K }>>

const MathBlock = ({ id, block }: Of<'math'>) => (
  <div id={id}>
    <Tex tex={block.tex} display />
  </div>
)

const BLOCKS: Record<string, BlockRenderer> = {
  math: MathBlock,
  diagram: DiagramBlock,
  interactive: InteractiveBlock,
  glossary: ({ id }: Of<'glossary'>) => <GlossaryList id={id} />,
  exercise: ({ id, block }: Of<'exercise'>) => <Exercise id={id} block={block} />,
}

const COURSE = { id: 'bi-kab', code: 'BI-KAB', name: 'Kryptografie a bezpečnost', storage: 'kab' }

export function KabProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <SkriptaProvider course={COURSE} Link={RouterLink} pathname={pathname} navigate={navigate} renderHtml={renderHtml} blocks={BLOCKS}>
      {children}
    </SkriptaProvider>
  )
}
