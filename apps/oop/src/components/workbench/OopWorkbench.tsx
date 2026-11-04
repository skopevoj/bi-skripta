'use client'
// Right panel: Scala editor + source viewer. Lives in a client file because tabs carry render functions.
import { Icon } from '@skripta/ui'
import { Workbench, sourceTab } from '@skripta/ui/workbench'
import { editorTab, useOpenEditor } from './EditorPane'

const TABS = [editorTab, sourceTab]

export function OopWorkbench() {
  return <Workbench tabs={TABS} />
}

/** „Otevřít editor“ button (TOC rail). */
export function OpenEditorButton() {
  const open = useOpenEditor()
  return (
    <button type="button" className="sk-open-doc" onClick={() => open()}>
      <Icon name="code" />
      <span>Otevřít editor</span>
    </button>
  )
}

/** Code block header buttons: „Spustit“ for runnable programs, otherwise „Upravit v editoru“. */
export function CodeActions({ code, runnable }: { code: string; runnable?: boolean }) {
  const open = useOpenEditor()
  return runnable ? (
    <button type="button" className="sk-cbtn run" onClick={() => open(code, true)}>
      <Icon name="play" />
      <span>Spustit</span>
    </button>
  ) : (
    <button type="button" className="sk-cbtn" onClick={() => open(code)}>
      <Icon name="code" />
      <span>Upravit v editoru</span>
    </button>
  )
}

/** „Spustit v editoru →“ under a checked question with code. */
export function RunInEditor({ code }: { code: string }) {
  const open = useOpenEditor()
  return (
    <button type="button" className="sk-lnk" onClick={() => open(code, true)}>
      Spustit v editoru →
    </button>
  )
}
