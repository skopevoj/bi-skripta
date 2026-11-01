'use client'
import { useState } from 'react'
import { highlight } from '@/lib/highlight'
import { wrapForRun } from '@/lib/wrap'
import { Icon } from './Icon'
import { useWorkbench } from './workbench/WorkbenchProvider'

export function CodeBlock({
  code,
  runnable,
  caption,
  edit = true,
  id,
}: {
  code: string
  runnable?: boolean
  caption?: string
  /** offer "Upravit v editoru" for non-runnable snippets */
  edit?: boolean
  id?: string
}) {
  const wb = useWorkbench()
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
        <span className="lang">{caption || 'Scala'}</span>
        <button type="button" className="cbtn copy" onClick={copy}>
          <Icon name="copy" />
          <span>{copied ? 'Zkopírováno' : 'Kopírovat'}</span>
        </button>
        {runnable ? (
          <button type="button" className="cbtn run" onClick={() => wb.openEditor(wrapForRun(code).program, { autorun: true })}>
            <Icon name="play" />
            Spustit
          </button>
        ) : edit ? (
          <button type="button" className="cbtn" onClick={() => wb.openEditor(wrapForRun(code).program)}>
            <Icon name="code" />
            Upravit v editoru
          </button>
        ) : null}
      </div>
      <pre className="src" dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </div>
  )
}
