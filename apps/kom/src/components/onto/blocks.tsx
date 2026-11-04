'use client'
import { Sources, type BlockRenderProps } from '@skripta/ui'
import type { Block } from '@content/types'
import { CompareDiagrams, OntoDiagram } from './OntoDiagram'

type DiagramBlock = Extract<Block, { kind: 'diagram' }>
type CompareBlock = Extract<Block, { kind: 'compare' }>

/** `diagram` block → interactive OntoUML diagram (+ citations). */
export function DiagramBlockView({ block: b, id }: BlockRenderProps<DiagramBlock>) {
  return (
    <div id={id} className="sk-fig-w dg-w">
      <OntoDiagram diagram={b.diagram} title={b.title} caption={b.caption} />
      <Sources refs={b.sources} block />
    </div>
  )
}

/** `compare` block → side-by-side diagram variants. */
export function CompareBlockView({ block: b, id }: BlockRenderProps<CompareBlock>) {
  return (
    <div id={id} className="sk-fig-w dg-w">
      <CompareDiagrams title={b.title} items={b.items} />
      <Sources refs={b.sources} block />
    </div>
  )
}
