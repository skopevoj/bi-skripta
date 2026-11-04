'use client'
// „Editor“ tab of the workbench: CodeMirror (Scala 3) + console. Runs code through /api/run (Scastie proxy).
// Code blocks / questions send code with `wb.openTab('editor', { code, autorun })` (see EditorPayload).
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Icon, useWorkbench } from '@skripta/ui'
import type { WorkbenchTab } from '@skripta/ui/workbench'
import { wrapForRun } from '@/lib/wrap'
import type { EditorHandle } from './CodeEditor'

const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false, loading: () => <div /> })

export const EDITOR_TAB = 'editor'
export type EditorPayload = { code: string; autorun?: boolean }

const DEFAULT_CODE = `class Animal:
  def sound = "..."

class Dog extends Animal:
  override def sound = "haf"

def hello(a: Animal) = "zvíře " + a.sound
def hello(d: Dog) = "pes " + d.sound

@main def run() =
  val a: Animal = Dog()
  println(hello(a))
  println(hello(Dog()))
`

type Diag = { line: number; col: number; msg: string }
type Con = {
  phase: 'idle' | 'send' | 'compile' | 'run' | 'done'
  status: string
  cls: '' | 'ok' | 'bad'
  out: string
  errors: Diag[]
  runtime: string | null
}
const IDLE: Con = { phase: 'idle', status: 'Spustí se na Scastie (Scala 3).', cls: '', out: '', errors: [], runtime: null }

const fmtSecs = (ms: number) => (ms / 1000).toFixed(1).replace('.', ',')

export function EditorPane() {
  const wb = useWorkbench()
  const handle = useRef<EditorHandle | null>(null)
  const [con, setCon] = useState<Con>(IDLE)
  const [flash, setFlash] = useState(0)
  const orig = useRef(DEFAULT_CODE)
  const running = useRef(false)
  const abort = useRef<AbortController | null>(null)
  const lastLoad = useRef(0)

  const run = useCallback(async () => {
    if (running.current || !handle.current) return
    running.current = true
    const code = handle.current.get()
    const w = wrapForRun(code)
    handle.current.markErrors([])
    const t0 = performance.now()
    setCon({ ...IDLE, phase: 'send', status: 'Odesílám na Scastie…' })
    const ac = new AbortController()
    abort.current = ac
    let out = ''
    const errors: Diag[] = []
    let runtime: string | null = null
    let final: Pick<Con, 'status' | 'cls'> | null = null
    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: w.program }),
        signal: ac.signal,
      })
      if (!res.ok || !res.body) {
        let msg = `Scastie neodpovídá (HTTP ${res.status}).`
        try {
          const j = await res.json()
          if (j?.error) msg = j.error
        } catch {
          /* ignore */
        }
        throw new Error(msg)
      }
      const reader = res.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        let nl: number
        while ((nl = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, nl).trim()
          buf = buf.slice(nl + 1)
          if (!line) continue
          let ev: { t: string; [k: string]: unknown }
          try {
            ev = JSON.parse(line)
          } catch {
            continue
          }
          if (ev.t === 'accepted') setCon((c) => ({ ...c, phase: 'compile', status: 'Kompiluji…' }))
          else if (ev.t === 'running') setCon((c) => ({ ...c, phase: 'run', status: 'Spouštím…' }))
          else if (ev.t === 'out') {
            out += String(ev.line) + '\n'
            setCon((c) => ({ ...c, phase: 'run', status: 'Spouštím…', out }))
          } else if (ev.t === 'err') {
            const pl = Number(ev.line) || 0
            const mapped = w.lineMap ? (w.lineMap[pl - 1] ?? 0) : pl
            errors.push({ line: mapped, col: Number(ev.col) || 0, msg: String(ev.msg) })
            setCon((c) => ({ ...c, errors: [...errors] }))
          } else if (ev.t === 'runtime') {
            runtime = String(ev.msg)
          } else if (ev.t === 'done') {
            const secs = fmtSecs(performance.now() - t0)
            if (ev.timeout) final = { status: 'Časový limit vypršel.', cls: 'bad' }
            else if (errors.length) final = { status: 'Nezkompiluje se.', cls: 'bad' }
            else if (runtime) final = { status: `Výjimka za běhu (${secs} s)`, cls: 'bad' }
            else if (ev.sbtError) final = { status: 'Chyba sestavení na Scastie.', cls: 'bad' }
            else final = { status: `Hotovo za ${secs} s`, cls: 'ok' }
          } else if (ev.t === 'error') {
            throw new Error(String(ev.msg))
          }
        }
      }
      if (!final) final = { status: 'Spojení se Scastie se přerušilo.', cls: 'bad' }
    } catch (e) {
      if ((e as Error).name === 'AbortError') final = { status: 'Zrušeno.', cls: '' }
      else final = { status: (e as Error).message || 'Spuštění selhalo.', cls: 'bad' }
    } finally {
      running.current = false
      abort.current = null
    }
    setCon({ phase: 'done', status: final.status, cls: final.cls, out, errors, runtime })
    handle.current?.markErrors(errors.map((x) => x.line).filter((x) => x > 0))
  }, [])

  // code sent from code blocks / questions
  const load = wb.payload(EDITOR_TAB)
  useEffect(() => {
    if (!load || load.n === lastLoad.current) return
    const data = load.data as EditorPayload
    const apply = () => {
      if (!handle.current) return false
      lastLoad.current = load.n
      abort.current?.abort()
      orig.current = data.code
      handle.current.set(data.code)
      setCon(IDLE)
      setFlash((f) => f + 1)
      if (data.autorun) setTimeout(run, 350)
      return true
    }
    if (!apply()) {
      const iv = setInterval(() => apply() && clearInterval(iv), 60)
      return () => clearInterval(iv)
    }
  }, [load, run])

  const busy = con.phase === 'send' || con.phase === 'compile' || con.phase === 'run'

  return (
    <div className="oop-ed-pane">
      <div className={`oop-ed${flash ? ' flash' : ''}`} key={flash}>
        <CodeEditor initial={orig.current} onRun={run} handle={handle} />
      </div>
      <div className="oop-ed-bar">
        <button className="sk-lnk" type="button" onClick={() => handle.current?.set(orig.current)}>
          Obnovit kód
        </button>
        <span className="sk-sp" />
        {busy ? (
          <button className="sk-btn sm ghost" type="button" onClick={() => abort.current?.abort()}>
            Zrušit
          </button>
        ) : (
          <button className="sk-btn sm" type="button" onClick={run}>
            <Icon name="play" />
            Spustit <kbd>⌘↵</kbd>
          </button>
        )}
      </div>
      <div className="oop-con" aria-live="polite">
        <p className="sk-label">Konzole</p>
        <div className={`oop-con-st${con.cls ? ' ' + con.cls : ''}`}>{con.status}</div>
        {con.out && <div className="oop-con-o">{con.out.replace(/\n+$/, '')}</div>}
        {con.errors.length > 0 && (
          <div className="oop-con-e">
            {con.errors.map((e, i) => (
              <div key={i}>
                {e.line > 0 && <b>ř. {e.line}: </b>}
                {e.msg}
              </div>
            ))}
          </div>
        )}
        {con.runtime && <div className="oop-con-e">{con.runtime}</div>}
      </div>
    </div>
  )
}

export const editorTab: WorkbenchTab = { id: EDITOR_TAB, label: 'Editor', icon: 'code', render: () => <EditorPane /> }

/** Opens the editor with a snippet; test-style snippets get wrapped into `@main def run()`. */
export function useOpenEditor() {
  const wb = useWorkbench()
  return useCallback(
    (code?: string, autorun = false) => wb.openTab(EDITOR_TAB, code === undefined ? undefined : ({ code: wrapForRun(code).program, autorun } satisfies EditorPayload)),
    [wb],
  )
}
