'use client'
import type { ReactNode } from 'react'
import type { BlockRenderer } from '../lib/config'
import { useSkripta } from '../lib/context'
import { Html, hasBlockHtml } from '../lib/html'
import { Icon } from '../lib/icons'
import { QuestionCard } from '../practice/QuestionCard'
import { Callout } from './Callout'
import { Sources } from './Cite'
import { CodeBlock } from './Code'
import { Figure } from './Figure'
import { blockId } from './helpers'
import { Table } from './Table'
import type { BlockLike, CoreBlock, QuestionLike } from './types'

/** Frame for an `interactive` block: lab icon + title, hint, then the widget. */
export function Lab({ id, name, title, hint, children }: { id?: string; name?: string; title?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="sk-lab" id={id} data-lab={name}>
      {title && (
        <div className="sk-lab-h">
          <Icon name="lab" />
          <span>{title}</span>
        </div>
      )}
      {hint && <p className="sk-lab-hint">{hint}</p>}
      {children}
    </div>
  )
}

/** Unknown kind without a renderer: invisible placeholder (keeps ids stable), warns in the console. */
function Unknown({ kind, id }: { kind: string; id: string }) {
  if (typeof window !== 'undefined') console.warn(`[@skripta/ui] no renderer for block kind "${kind}" (register it in SkriptaProvider blocks)`)
  return <div id={id} hidden data-unknown-block={kind} />
}

export type BlocksProps = {
  blocks: readonly BlockLike[]
  /** Section id — block ids are `${secId}-${i + 1}`. */
  secId: string
  /** Chapter number for callout numbering („Definice 3.4“). Omit to number only callouts with explicit `number`. */
  chapter?: string
  /** Callouts before this section in the chapter (see `calloutStart`). */
  calloutStart?: number
  /** Questions referenced by `quiz` blocks. */
  questions?: Record<string, QuestionLike>
  /** Extra renderers (merged over the provider's `blocks`; only usable from client code). */
  renderers?: Record<string, BlockRenderer>
}

/** Renders a section's blocks. Course kinds → `blocks` renderers from the provider. */
export function Blocks({ blocks, secId, chapter, calloutStart = 0, questions, renderers }: BlocksProps) {
  const cfg = useSkripta()
  const custom = renderers ? { ...cfg.blocks, ...renderers } : cfg.blocks
  let n = calloutStart
  return (
    <>
      {blocks.map((raw, i) => {
        const id = blockId(secId, i)
        const R = custom?.[raw.kind]
        if (raw.kind === 'callout' && !(raw as { number?: string }).number) n++
        if (R) return <R key={i} block={raw} id={id} index={i} secId={secId} chapter={chapter} />
        const b = raw as CoreBlock
        switch (b.kind) {
          case 'p':
            // <ul>/<ol> can't live inside <p> (breaks hydration) → render as a div
            if (hasBlockHtml(b.html))
              return (
                <div key={i} id={id} className="sk-pb">
                  <Html html={b.html} as="div" />
                  <Sources refs={b.sources} block />
                </div>
              )
            return (
              <p key={i} id={id}>
                <Html html={b.html} />
                <Sources refs={b.sources} />
              </p>
            )
          case 'h3':
            return (
              <h3 key={i} id={b.id ?? id} className="sk-anchor">
                <a className="sk-hash" href={`#${b.id ?? id}`} aria-hidden="true" tabIndex={-1}>
                  #
                </a>
                {b.number && <span className="sn">{b.number}</span>}
                <Html html={b.title} label />
              </h3>
            )
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul'
            return (
              <div key={i} id={id} className="sk-list">
                <L>
                  {b.items.map((it, j) => (
                    <Html key={j} as="li" html={it} />
                  ))}
                </L>
                <Sources refs={b.sources} block />
              </div>
            )
          }
          case 'code':
            return (
              <div key={i} className="sk-code-w">
                <CodeBlock id={id} code={b.code} lang={b.lang} caption={b.caption} runnable={b.runnable} />
                <Sources refs={b.sources} block />
              </div>
            )
          case 'callout':
            return (
              <Callout
                key={i}
                id={id}
                type={b.type}
                number={b.number ?? (chapter ? `${chapter}.${n}` : undefined)}
                title={b.title}
                html={b.html}
                plain={b.plain}
                code={b.code}
                lang={b.lang}
                sources={b.sources}
              />
            )
          case 'table':
            return <Table key={i} id={id} head={b.head} rows={b.rows} caption={b.caption} sources={b.sources} />
          case 'figure':
            return <Figure key={i} id={id} src={b.src} alt={b.alt} caption={b.caption} sources={b.sources} />
          case 'interactive': {
            const W = cfg.interactive?.[b.component]
            return (
              <Lab key={i} id={id} name={b.component} title={b.title} hint={b.hint}>
                {W ? <W /> : <p className="sk-unknown">Interaktivní prvek „{b.component}“ není k dispozici.</p>}
              </Lab>
            )
          }
          case 'quiz': {
            const qs = b.ids.map((x) => questions?.[x]).filter((q): q is QuestionLike => !!q)
            if (qs.length === 0) return null
            return (
              <section key={i} className="sk-quiz">
                <h3 id={id} className="sk-anchor">
                  <a className="sk-hash" href={`#${id}`} aria-hidden="true" tabIndex={-1}>
                    #
                  </a>
                  {b.title || 'Procvičení'}
                </h3>
                {qs.map((q, j) => (
                  <QuestionCard key={q.id} q={q} n={qs.length > 1 ? `${j + 1} / ${qs.length}` : undefined} />
                ))}
              </section>
            )
          }
          default:
            return <Unknown key={i} kind={raw.kind} id={id} />
        }
      })}
    </>
  )
}
