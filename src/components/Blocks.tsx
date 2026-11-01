import type { Block, CalloutKind, Question } from '@content/types'
import { CodeBlock } from './CodeBlock'
import { Icon, type IconName } from './Icon'
import { QuestionCard } from './Question'
import { Sources } from './Sources'
import { Interactive } from './labs/Interactive'

export const CALLOUT: Record<CalloutKind, { cls: string; icon: IconName; label: string }> = {
  definice: { cls: 'def', icon: 'book', label: 'Definice' },
  pravidlo: { cls: 'rul', icon: 'steps', label: 'Pravidlo' },
  past: { cls: 'pst', icon: 'warn', label: 'Past' },
  priklad: { cls: 'qt', icon: 'bulb', label: 'Příklad' },
  poznamka: { cls: 'qt', icon: 'note', label: 'Poznámka' },
  shrnuti: { cls: 'qt', icon: 'sum', label: 'Shrnutí' },
}

const hasBlockHtml = (html: string) => /<(ul|ol|p|div|table|pre)\b/i.test(html)

export const blockId = (secId: string, i: number) => `${secId}-${i + 1}`

/** Entries for "Na této stránce". */
export function tocEntries(secId: string, blocks: Block[]): { id: string; title: string }[] {
  const out: { id: string; title: string }[] = []
  blocks.forEach((b, i) => {
    if (b.kind === 'callout' && (b.type === 'definice' || b.type === 'pravidlo' || b.type === 'past'))
      out.push({ id: blockId(secId, i), title: b.type === 'past' ? `Past: ${b.title}` : b.title })
    else if (b.kind === 'interactive') out.push({ id: blockId(secId, i), title: b.title || 'Interaktivně' })
    else if (b.kind === 'quiz') out.push({ id: blockId(secId, i), title: b.title || 'Procvičení' })
  })
  return out
}

export function Blocks({ secId, blocks, qmap }: { secId: string; blocks: Block[]; qmap: Record<string, Question> }) {
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
                <CodeBlock id={id} code={b.code} runnable={b.runnable} caption={b.caption} />
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
            return (
              <div key={i} id={id} className={`box ${c.cls}`}>
                <div className="box-h">
                  <Icon name={c.icon} />
                  <b>{c.label}</b>
                  <span>{b.title}</span>
                </div>
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
                    <CodeBlock code={b.code} />
                    <Sources refs={b.sources} block />
                  </>
                )}
              </div>
            )
          }
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
