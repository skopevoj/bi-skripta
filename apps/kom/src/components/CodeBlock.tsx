'use client'
import { useState } from 'react'
import type { CodeLang } from '@content/types'
import { highlight } from '@/lib/highlight'
import { Icon } from './Icon'

const LANG: Record<CodeLang, string> = { ocl: 'OCL', turtle: 'Turtle', sparql: 'SPARQL', xml: 'XML', text: 'Text' }

export function CodeBlock({ code, lang = 'text', caption, id }: { code: string; lang?: CodeLang; caption?: string; id?: string }) {
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
  return (
    <div className="code" id={id}>
      <div className="code-h">
        <span className="lang">{caption || LANG[lang]}</span>
        <button type="button" className="cbtn copy" onClick={copy}>
          <Icon name="copy" />
          <span>{copied ? 'Zkopírováno' : 'Kopírovat'}</span>
        </button>
      </div>
      <pre className="src" dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
    </div>
  )
}
