// Runs a Scala 3 program on Scastie (scastie.scala-lang.org) straight from the browser — Scastie sends
// CORS headers for any origin, so no proxy server is needed and the site can be a static export.
// Yields simplified progress events:
//   {t:'accepted'} {t:'running'} {t:'out', line, err} {t:'err', line, col, msg} {t:'runtime', msg} {t:'done', timeout, sbtError}
// Failures are thrown as Error with a Czech message (AbortError when cancelled).
// Scastie API (reverse-engineered from its web client):
//   POST /api/run  body {"SbtInputs": {...}}  -> {"base64UUID": "...", "user": null}
//   GET  /api/progress-sse/<id>               -> SSE stream of SnippetProgress JSON, ends with isDone: true

const SCASTIE = 'https://scastie.scala-lang.org'
const SCALA_VERSION = '3.9.0'
const MAX_CODE = 20_000
const TOTAL_TIMEOUT_MS = 90_000

export type RunEvent =
  | { t: 'accepted'; id: string }
  | { t: 'running' }
  | { t: 'out'; line: string; err: boolean }
  | { t: 'err'; line: number; col: number; msg: string }
  | { t: 'runtime'; msg: string }
  | { t: 'done'; timeout: boolean; sbtError: boolean }

type Progress = {
  userOutput: { line: string; tpe: Record<string, unknown> } | null
  buildOutput: { line: string } | null
  compilationInfos: { severity: Record<string, unknown>; line: number | null; startColumn?: number | null; message: string }[]
  runtimeError: { message: string; line: number | null; fullStack: string } | null
  isDone: boolean
  isTimeout: boolean
  isSbtError: boolean
}

const ANSI = /\u001b\[[0-9;]*[A-Za-z]/g

export async function* runOnScastie(code: string, signal: AbortSignal): AsyncGenerator<RunEvent> {
  if (!code.trim()) throw new Error('Chybí kód.')
  if (code.length > MAX_CODE) throw new Error('Kód je příliš dlouhý.')

  // One controller for both requests: aborted by the caller or by the overall time limit.
  const ac = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => ((timedOut = true), ac.abort()), TOTAL_TIMEOUT_MS)
  const onAbort = () => ac.abort()
  signal.addEventListener('abort', onAbort)

  try {
    let id: string
    try {
      const r = await fetch(`${SCASTIE}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          SbtInputs: {
            isWorksheetMode: false,
            code,
            target: { Scala3: { scalaVersion: SCALA_VERSION } },
            libraries: [],
            librariesFromList: [],
            sbtConfigExtra: '',
            sbtConfigSaved: null,
            sbtPluginsConfigExtra: '',
            sbtPluginsConfigSaved: null,
            isShowingInUserProfile: false,
            forked: null,
          },
        }),
        signal: ac.signal,
      })
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const j = (await r.json()) as { base64UUID?: string }
      if (!j.base64UUID) throw new Error('bez id')
      id = j.base64UUID
    } catch (e) {
      if (signal.aborted) throw e
      throw new Error(timedOut ? 'Časový limit vypršel.' : `Scastie teď neodpovídá (${(e as Error).message}). Zkus to za chvíli.`)
    }
    yield { t: 'accepted', id }

    let running = false
    const seenErr = new Set<string>()
    try {
      const r = await fetch(`${SCASTIE}/api/progress-sse/${encodeURIComponent(id)}`, { headers: { Accept: 'text/event-stream' }, signal: ac.signal })
      if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}`)
      const reader = r.body.getReader()
      const dec = new TextDecoder()
      let buf = ''
      try {
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buf += dec.decode(value, { stream: true })
          let idx: number
          while ((idx = buf.indexOf('\n\n')) >= 0) {
            const chunk = buf.slice(0, idx)
            buf = buf.slice(idx + 2)
            const data = chunk
              .split('\n')
              .filter((l) => l.startsWith('data:'))
              .map((l) => l.slice(5))
              .join('\n')
            if (!data.trim()) continue
            let p: Progress
            try {
              p = JSON.parse(data)
            } catch {
              continue
            }
            if (!running && (p.userOutput || /\brunning\b/i.test(p.buildOutput?.line ?? ''))) {
              running = true
              yield { t: 'running' }
            }
            for (const ci of p.compilationInfos || []) {
              if (!('Error' in (ci.severity || {}))) continue
              const msg = ci.message.replace(ANSI, '')
              const key = `${ci.line}:${msg}`
              if (seenErr.has(key)) continue
              seenErr.add(key)
              yield { t: 'err', line: ci.line ?? 0, col: ci.startColumn ?? 0, msg }
            }
            if (p.userOutput && p.userOutput.line !== undefined) {
              yield { t: 'out', line: p.userOutput.line.replace(ANSI, ''), err: 'StdErr' in (p.userOutput.tpe || {}) }
            }
            if (p.runtimeError) {
              const m = (p.runtimeError.fullStack || p.runtimeError.message || '').replace(ANSI, '')
              yield { t: 'runtime', msg: m.split('\n').slice(0, 6).join('\n') }
            }
            if (p.isDone || p.isTimeout) {
              yield { t: 'done', timeout: p.isTimeout, sbtError: p.isSbtError }
              return
            }
          }
        }
      } finally {
        reader.cancel().catch(() => {})
      }
    } catch (e) {
      if (signal.aborted) throw e
      throw new Error(timedOut ? 'Časový limit vypršel.' : `Spojení se Scastie selhalo (${(e as Error).message}).`)
    }
    throw new Error('Scastie ukončilo spojení bez výsledku.')
  } finally {
    clearTimeout(timer)
    signal.removeEventListener('abort', onAbort)
  }
}
