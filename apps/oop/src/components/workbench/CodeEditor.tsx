'use client'
import { useEffect, useRef } from 'react'
import { EditorState, StateEffect, StateField, RangeSetBuilder } from '@codemirror/state'
import { EditorView, keymap, lineNumbers, drawSelection, Decoration, type DecorationSet } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { StreamLanguage, HighlightStyle, syntaxHighlighting, bracketMatching, indentOnInput, indentUnit } from '@codemirror/language'
import { scala } from '@codemirror/legacy-modes/mode/clike'
import { tags as t } from '@lezer/highlight'

const style = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.controlKeyword, t.definitionKeyword, t.operatorKeyword, t.meta, t.annotation], color: 'var(--hl-kw)' },
  { tag: [t.typeName, t.className, t.namespace], color: 'var(--hl-ty)' },
  { tag: [t.number, t.bool, t.atom], color: 'var(--hl-num)' },
  { tag: [t.string, t.character, t.special(t.string)], color: 'var(--hl-str)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--hl-com)', fontStyle: 'italic' },
])

// error-line decorations
const setErr = StateEffect.define<number[]>()
const errField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(deco, tr) {
    for (const e of tr.effects)
      if (e.is(setErr)) {
        const b = new RangeSetBuilder<Decoration>()
        const lines = [...new Set(e.value)].sort((a, c) => a - c)
        for (const ln of lines) {
          if (ln < 1 || ln > tr.state.doc.lines) continue
          const l = tr.state.doc.line(ln)
          b.add(l.from, l.from, Decoration.line({ class: 'cm-errline' }))
        }
        return b.finish()
      }
    if (tr.docChanged) return Decoration.none
    return deco.map(tr.changes)
  },
  provide: (f) => EditorView.decorations.from(f),
})

export type EditorHandle = { get: () => string; set: (code: string) => void; markErrors: (lines: number[]) => void; focus: () => void }

export default function CodeEditor({
  initial,
  onRun,
  handle,
}: {
  initial: string
  onRun: () => void
  handle: React.MutableRefObject<EditorHandle | null>
}) {
  const host = useRef<HTMLDivElement>(null)
  const runRef = useRef(onRun)
  runRef.current = onRun

  useEffect(() => {
    const view = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: initial,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          indentUnit.of('  '),
          EditorState.tabSize.of(2),
          StreamLanguage.define(scala),
          syntaxHighlighting(style),
          errField,
          keymap.of([
            { key: 'Mod-Enter', preventDefault: true, run: () => (runRef.current(), true) },
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.contentAttributes.of({ 'aria-label': 'Scala kód', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' }),
        ],
      }),
    })
    handle.current = {
      get: () => view.state.doc.toString(),
      set: (code) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code }, selection: { anchor: 0 }, scrollIntoView: true }),
      markErrors: (lines) => view.dispatch({ effects: setErr.of(lines) }),
      focus: () => view.focus(),
    }
    return () => {
      handle.current = null
      view.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={host} />
}
