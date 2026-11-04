'use client'
import { useState } from 'react'
import { useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'

export const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Code block with a header (language / caption, course actions, copy) and highlighted source. */
export function CodeBlock({
  code,
  lang,
  caption,
  runnable,
  id,
  actions = true,
}: {
  code: string
  lang?: string
  caption?: string
  runnable?: boolean
  id?: string
  /** show course `codeActions` (e.g. "Spustit") */
  actions?: boolean
}) {
  const cfg = useSkripta()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      /* ignore */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  const l = lang ?? cfg.defaultLang
  const label = caption || (l ? (cfg.codeLangs?.[l] ?? l.toUpperCase()) : 'Kód')
  const html = cfg.highlight ? cfg.highlight(code, l) : escapeHtml(code)
  return (
    <div className="sk-code" id={id}>
      <div className="sk-code-h">
        <span className="sk-code-l">{label}</span>
        {actions && cfg.codeActions?.({ code, lang: l, runnable })}
        <button type="button" className="sk-cbtn" onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'copy'} />
          <span>{copied ? 'Zkopírováno' : 'Kopírovat'}</span>
        </button>
      </div>
      <pre className="sk-pre" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
