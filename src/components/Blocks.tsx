import type { Block, CalloutKind, Question } from '@content/types'
import { CodeBlock } from './CodeBlock'
import { Icon, type IconName } from './Icon'
import { QuestionCard } from './Question'
import { Sources } from './Sources'
import { Interactive } from './labs/Interactive'
import { CompareDiagrams, OntoDiagram } from './onto/OntoDiagram'

export const CALLOUT: Record<CalloutKind, { icon: IconName; label: string }> = {
  definice: { icon: 'book', label: 'Definice' },
  pravidlo: { icon: 'steps', label: 'Pravidlo' },
  past: { icon: 'warn', label: 'Pozor' },
  priklad: { icon: 'bulb', label: 'Příklad' },
  poznamka: { icon: 'note', label: 'Poznámka' },
  shrnuti: { icon: 'sum', label: 'Shrnutí' },
}

/** Callouts are numbered per chapter (Definice 3.4, Příklad 3.5 …), one counter for all kinds. */
export const countCallouts = (blocks: Block[]) => blocks.filter((b) => b.kind === 'callout').length

const hasBlockHtml = (html: string) => /<(ul|ol|p|div|table|pre)\b/i.test(html)

export const blockId = (secId: string, i: number) => `${secId}-${i + 1}`

/** Entries for "Na této stránce". */
export function tocEntries(secId: string, blocks: Block[]): { id: string; title: string }[] {
  const out: { id: string; title: string }[] = []
  blocks.forEach((b, i) => {
    if (b.kind === 'callout' && (b.type === 'definice' || b.type === 'pravidlo' || b.type === 'past'))
      out.push({ id: blockId(secId, i), title: b.type === "past" ? `Pozor: ${b.title}` : b.title })
    else if (b.kind === 'interactive') out.push({ id: blockId(secId, i), title: b.title || 'Interaktivně' })
    else if ((b.kind === 'diagram' || b.kind === 'compare') && b.title) out.push({ id: blockId(secId, i), title: b.title })
    else if (b.kind === 'quiz') out.push({ id: blockId(secId, i), title: b.title || 'Procvičení' })
  })
  return out
}

export function Blocks({
  secId,
  blocks,
  qmap,
  chapter,
  calloutStart = 0,
}: {
  secId: string
  blocks: Block[]
  qmap: Record<string, Question>
  chapter?: string
  calloutStart?: number
}) {
  let calloutN = calloutStart
  return (
    <>
      {blocks.map((b, i) => {
        const id = blockId(secId, i)
        switch (b.kind) {
          case 'p':
            // <ul>/<ol> can't live inside <p> (breaks hydration) → render as a div
            if (hasBlockHtml(b.html))
              return (
                <div key={i} id={id} className="pb">
                  <div dangerouslySetInnerHTML={{ __html: b.html }} />
                  <Sources refs={b.sources} block />
                </div>
              )
            return (
              <p key={i} id={id}>
                <span dangerouslySetInnerHTML={{ __html: b.html }} />
                <Sources refs={b.sources} />
              </p>
            )
          case 'list': {
            const L = b.ordered ? 'ol' : 'ul'
            return (
              <div key={i} id={id}>
                <L className={b.ordered ? 'ol' : 'ul'}>
                  {b.items.map((it, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </L>
                {b.sources && b.sources.length > 0 && (
                  <div style={{ marginTop: -10, marginBottom: 18 }}>
                    <Sources refs={b.sources} block />
                  </div>
                )}
              </div>
            )
          }
          case 'code':
            return (
              <div key={i}>
                <CodeBlock id={id} code={b.code} lang={b.lang} caption={b.caption} />
                {b.sources && b.sources.length > 0 && (
                  <div style={{ marginTop: -18, marginBottom: 24 }}>
                    <Sources refs={b.sources} block />
                  </div>
                )}
              </div>
            )
          case 'callout': {
            const c = CALLOUT[b.type]
            const block = hasBlockHtml(b.html)
            calloutN++
            return (
              <div key={i} id={id} className="box" data-k={b.type}>
                <div className="box-h">
                  <span className="box-t">
                    <b>
                      {c.label}
                      {chapter ? ` ${chapter}.${calloutN}` : ''}
                    </b>
                    {b.title && <span> ({b.title})</span>}
                  </span>
                  <Icon name={c.icon} />
                </div>
                <div className="box-b">
                  {block ? (
                    <>
                      <div className="bh" dangerouslySetInnerHTML={{ __html: b.html }} />
                      {!b.code && <Sources refs={b.sources} block />}
                    </>
                  ) : (
                    <p>
                      <span dangerouslySetInnerHTML={{ __html: b.html }} />
                      {!b.code && <Sources refs={b.sources} />}
                    </p>
                  )}
                  {b.code && (
                    <>
                      <CodeBlock code={b.code} lang={b.lang ?? 'ocl'} />
                      <Sources refs={b.sources} block />
                    </>
                  )}
                </div>
              </div>
            )
          }
          case 'table':
            return (
              <div key={i} id={id} className="tbl-w">
                <div className="tbl-s">
                  <table className="tbl">
                    <thead>
                      <tr>
                        {b.head.map((h, j) => (
                          <th key={j} dangerouslySetInnerHTML={{ __html: h }} />
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {b.rows.map((r, j) => (
                        <tr key={j}>
                          {r.map((c, k) => (
                            <td key={k} dangerouslySetInnerHTML={{ __html: c }} />
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {(b.caption || b.sources) && (
                  <p className="tbl-c">
                    {b.caption && <span dangerouslySetInnerHTML={{ __html: b.caption }} />}
                    <Sources refs={b.sources} />
                  </p>
                )}
              </div>
            )
          case 'diagram':
            return (
              <div key={i} id={id} className="dg-w">
                <OntoDiagram diagram={b.diagram} title={b.title} caption={b.caption} />
                {b.sources && b.sources.length > 0 && (
                  <div className="dg-src">
                    <Sources refs={b.sources} block />
                  </div>
                )}
              </div>
            )
          case 'compare':
            return (
              <div key={i} id={id} className="dg-w">
                <CompareDiagrams title={b.title} items={b.items} />
                {b.sources && b.sources.length > 0 && (
                  <div className="dg-src">
                    <Sources refs={b.sources} block />
                  </div>
                )}
              </div>
            )
          case 'figure':
            return (
              <figure key={i} id={id} className="fig">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" />
                {(b.caption || b.sources) && (
                  <figcaption>
                    {b.caption && <span dangerouslySetInnerHTML={{ __html: b.caption }} />}
                    <Sources refs={b.sources} />
                  </figcaption>
                )}
              </figure>
            )
          case 'interactive':
            return <Interactive key={i} id={id} name={b.component} title={b.title} hint={b.hint} />
          case 'quiz': {
            const qs = b.ids.map((x) => qmap[x]).filter(Boolean)
            if (qs.length === 0) return null
            return (
              <div key={i}>
                <h3 id={id} className="anchor">
                  <a className="hash" href={`#${id}`} aria-hidden="true">
                    #
                  </a>
                  {b.title || 'Procvičení'}
                </h3>
                {qs.map((q, j) => (
                  <QuestionCard key={q.id} q={q} n={qs.length > 1 ? `${j + 1} / ${qs.length}` : undefined} />
                ))}
              </div>
            )
          }
        }
      })}
    </>
  )
}
