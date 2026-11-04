'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { wrapForRun } from '@/lib/wrap'
import { Icon } from '../Icon'
import { PdfPage } from '../pdf/PdfPage'
import type { EditorHandle } from './CodeEditor'
import { useWorkbench, type SourceView } from './WorkbenchProvider'

const CodeEditor = dynamic(() => import('./CodeEditor'), { ssr: false, loading: () => <div /> })

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

function EditorPane({ active }: { active: boolean }) {
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
    let final: Partial<Con> | null = null
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
            const mapped = w.lineMap ? w.lineMap[pl - 1] ?? 0 : pl
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
    setCon({ phase: 'done', status: final!.status!, cls: final!.cls ?? '', out, errors, runtime })
    handle.current?.markErrors(errors.map((x) => x.line).filter((x) => x > 0))
  }, [])

  // load requests from code blocks / questions
  useEffect(() => {
    const l = wb.load
    if (!l || l.n === lastLoad.current) return
    const apply = () => {
      if (!handle.current) return false
      lastLoad.current = l.n
      abort.current?.abort()
      orig.current = l.code
      handle.current.set(l.code)
      setCon(IDLE)
      setFlash((f) => f + 1)
      if (l.autorun) setTimeout(run, 350)
      return true
    }
    if (!apply()) {
      const iv = setInterval(() => apply() && clearInterval(iv), 60)
      return () => clearInterval(iv)
    }
  }, [wb.load, run])

  const busy = con.phase === 'send' || con.phase === 'compile' || con.phase === 'run'

  return (
    <div className={`pane${active ? ' on' : ''}`} role="tabpanel" aria-label="Editor">
      <div className={`editor${flash ? ' flash' : ''}`} key={flash}>
        <CodeEditor initial={orig.current} onRun={run} handle={handle} />
      </div>
      <div className="ed-bar">
        <button className="lnk" type="button" onClick={() => handle.current?.set(orig.current)}>
          Obnovit kód
        </button>
        {busy ? (
          <button className="btn" type="button" onClick={() => abort.current?.abort()}>
            Zrušit
          </button>
        ) : (
          <button className="btn" type="button" onClick={run}>
            <Icon name="play" />
            Spustit <kbd>⌘↵</kbd>
          </button>
        )}
      </div>
      <div className="console" aria-live="polite">
        <div className="con-l">Konzole</div>
        <div className={`con-st${con.cls ? ' ' + con.cls : ''}`}>{con.status}</div>
        {con.out && <div className="con-o">{con.out.replace(/\n+$/, '')}</div>}
        {con.errors.length > 0 && (
          <div className="con-e">
            {con.errors.map((e, i) => (
              <div key={i}>
                {e.line > 0 && <b>ř. {e.line}: </b>}
                {e.msg}
              </div>
            ))}
          </div>
        )}
        {con.runtime && <div className="con-e">{con.runtime}</div>}
      </div>
    </div>
  )
}

function SourcePane({ active }: { active: boolean }) {
  const wb = useWorkbench()
  const src = wb.source
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [found, setFound] = useState<boolean | null>(null)
  const [pageIn, setPageIn] = useState('1')

  useEffect(() => {
    if (src?.kind === 'pdf') {
      setPage(src.page)
      setPageIn(String(src.page))
      setFound(null)
    }
  }, [src])

  const go = (p: number) => {
    const n = Math.min(Math.max(1, p), pages ?? 9999)
    setPage(n)
    setPageIn(String(n))
  }

  const back = () => {
    const el = wb.anchor.current
    if (!el || !document.contains(el)) return
    if (matchMedia('(max-width: 820px)').matches) wb.close()
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.remove('pulse')
    void el.offsetWidth
    el.classList.add('pulse')
  }

  const quotes = src?.kind === 'pdf' && page === src.page ? src.quotes ?? [] : []

  return (
    <div className={`pane${active ? ' on' : ''}`} role="tabpanel" aria-label="Zdroj">
      {!src ? (
        <div className="sv-stage">
          <p className="pg-msg">Klikni na odkaz na slajd (např. „P2 · 18“) a otevře se tady.</p>
        </div>
      ) : src.kind === 'pdf' ? (
        <>
          <div className="sv-bar">
            {src.href ? (
              <Link href={`${src.href}?page=${page}`} title="Otevřít v knihovně přednášek" style={{ color: 'var(--ink-2)', fontSize: 14 }}>
                {src.title}
              </Link>
            ) : (
              <span>{src.title}</span>
            )}
            <span className="sp" />
            <div className="pnav">
              <button type="button" aria-label="Předchozí strana" onClick={() => go(page - 1)}>
                <Icon name="l" />
              </button>
              <input
                inputMode="numeric"
                aria-label="Strana"
                value={pageIn}
                onChange={(e) => setPageIn(e.target.value)}
                onBlur={() => go(parseInt(pageIn, 10) || page)}
                onKeyDown={(e) => e.key === 'Enter' && go(parseInt(pageIn, 10) || page)}
              />
              <span>/ {pages ?? '…'}</span>
              <button type="button" aria-label="Další strana" onClick={() => go(page + 1)}>
                <Icon name="r" />
              </button>
            </div>
          </div>
          <div className="sv-stage">
            <PdfPage file={src.file} page={page} quotes={quotes} onPages={setPages} onFound={setFound} />
            {(src.quotes?.length || wb.anchor.current) && (
              <div className="quote">
                {src.quotes?.map((q, i) => (
                  <div key={i}>„{q}“</div>
                ))}
                {found === false && page === src.page && (
                  <small style={{ color: 'var(--ink-3)' }}>Citaci se na stránce nepodařilo zvýraznit.</small>
                )}
                {wb.anchor.current && (
                  <small>
                    <button className="lnk" type="button" onClick={back}>
                      ← Zpět na místo v textu
                    </button>
                  </small>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <SourceImage src={src} back={wb.anchor.current ? back : undefined} />
      )}
    </div>
  )
}

function SourceImage({ src, back }: { src: Extract<SourceView, { kind: 'img' }>; back?: () => void }) {
  return (
    <>
      <div className="sv-bar">
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.label}</span>
        <span className="sp" />
        <a href={src.src} target="_blank" rel="noopener noreferrer">
          Otevřít obrázek
        </a>
      </div>
      <div className="sv-stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="img-src" src={src.src} alt={src.label} />
        <div className="quote">
          {src.url && (
            <small>
              <a href={src.url} target="_blank" rel="noopener noreferrer">
                Kde to najdeš online
              </a>
            </small>
          )}
          {back && (
            <small>
              <button className="lnk" type="button" onClick={back}>
                ← Zpět na místo v textu
              </button>
            </small>
          )}
        </div>
      </div>
    </>
  )
}

export function Workbench() {
  const wb = useWorkbench()
  const grip = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const g = grip.current
    if (!g) return
    let drag = false
    const down = (e: PointerEvent) => {
      drag = true
      g.classList.add('drag')
      g.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!drag) return
      const w = Math.min(Math.max(window.innerWidth - e.clientX, 360), window.innerWidth * 0.62)
      document.documentElement.style.setProperty('--wb-w', `${w}px`)
    }
    const up = () => {
      drag = false
      g.classList.remove('drag')
    }
    g.addEventListener('pointerdown', down)
    g.addEventListener('pointermove', move)
    g.addEventListener('pointerup', up)
    g.addEventListener('pointercancel', up)
    return () => {
      g.removeEventListener('pointerdown', down)
      g.removeEventListener('pointermove', move)
      g.removeEventListener('pointerup', up)
      g.removeEventListener('pointercancel', up)
    }
  }, [])

  return (
    <aside className="wb" aria-label="Pracovní panel" aria-hidden={!wb.open}>
      <div className="grip" ref={grip} />
      <div className="wb-h">
        <span className="handle" onClick={wb.close} />
        <div className="tabs" role="tablist">
          <button role="tab" type="button" aria-selected={wb.tab === 'editor'} onClick={() => wb.setTab('editor')}>
            <Icon name="code" />
            Editor
          </button>
          <button role="tab" type="button" aria-selected={wb.tab === 'source'} onClick={() => wb.setTab('source')}>
            <Icon name="slides" />
            Zdroj
          </button>
        </div>
        <span className="sp" />
        <button className="icon-btn" type="button" aria-label="Zavřít panel" title="Zavřít (Esc)" onClick={wb.close}>
          <Icon name="x" />
        </button>
      </div>
      <EditorPane active={wb.tab === 'editor'} />
      <SourcePane active={wb.tab === 'source'} />
    </aside>
  )
}
