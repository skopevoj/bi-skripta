'use client'
import { isValidElement, type ReactNode } from 'react'
import { Html, hasBlockHtml } from '../lib/html'
import { useSkripta } from '../lib/context'
import { Icon, type IconName } from '../lib/icons'
import { calloutDef } from './callouts'
import { CodeBlock } from './Code'
import { Sources } from './Cite'
import type { SourceRef } from './types'

/**
 * Callout: solid coloured header bar „Definice 3.4 (název)“ + icon on the right, content on a neutral background.
 * Pass `html` (content string) or `children`.
 */
export function Callout({
  type,
  number,
  title,
  html,
  plain,
  code,
  lang,
  sources,
  id,
  children,
}: {
  type: string
  number?: string
  title?: string
  html?: string
  plain?: string
  code?: string
  lang?: string
  sources?: SourceRef[]
  id?: string
  children?: ReactNode
}) {
  const cfg = useSkripta()
  const d = calloutDef(type, cfg.callouts)
  const head = [d.label, number].filter(Boolean).join(' ')
  const block = html ? hasBlockHtml(html) : false
  return (
    <div id={id} className="sk-box" data-k={type} data-tone={d.tone}>
      <div className="sk-box-h">
        <span className="sk-box-t">
          <b>{head}</b>
          {title && (
            <>
              {' '}
              <Html html={`(${title})`} className="sk-box-n" label />
            </>
          )}
        </span>
        {isValidElement(d.icon) ? <span className="sk-box-ic" aria-hidden="true">{d.icon}</span> : <Icon name={d.icon as IconName} />}
      </div>
      <div className="sk-box-b">
        {html !== undefined &&
          (block ? (
            <>
              <Html html={html} as="div" className="sk-box-html" />
              {!code && <Sources refs={sources} block />}
            </>
          ) : (
            <p>
              <Html html={html} />
              {!code && <Sources refs={sources} />}
            </p>
          ))}
        {children}
        {code && (
          <>
            <CodeBlock code={code} lang={lang} />
            <Sources refs={sources} block />
          </>
        )}
        {plain && (
          <p className="sk-box-plain">
            <b>Jednoduše:</b> <Html html={plain} label />
          </p>
        )}
      </div>
    </div>
  )
}
