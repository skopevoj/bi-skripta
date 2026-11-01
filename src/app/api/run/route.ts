// Proxy to Scastie (scastie.scala-lang.org): compiles and runs a Scala 3 program and streams
// simplified progress as NDJSON lines:
//   {t:'accepted'} {t:'running'} {t:'out', line} {t:'err', line, col, msg} {t:'runtime', msg}
//   {t:'done', timeout, sbtError} {t:'error', msg}
// Scastie API (reverse-engineered from its web client):
//   POST /api/run  body {"SbtInputs": {...}}  -> {"base64UUID": "...", "user": null}
//   GET  /api/progress-sse/<id>               -> SSE stream of SnippetProgress JSON, ends with isDone: true

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SCASTIE = process.env.SCASTIE_URL || 'https://scastie.scala-lang.org'
const SCALA_VERSION = process.env.SCASTIE_SCALA_VERSION || '3.9.0'
const MAX_CODE = 20_000
const TOTAL_TIMEOUT_MS = 90_000

// --- naive per-IP rate limit (public deployment; protects Scastie from abuse) ---
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 15
const hits = new Map<string, number[]>()
function limited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
  return arr.length > MAX_PER_WINDOW
}

const ANSI = /\u001b\[[0-9;]*[A-Za-z]/g

type Progress = {
  userOutput: { line: string; tpe: Record<string, unknown> } | null
  buildOutput: { line: string } | null
  compilationInfos: { severity: Record<string, unknown>; line: number | null; startColumn?: number | null; message: string }[]
  runtimeError: { message: string; line: number | null; fullStack: string } | null
  isDone: boolean
  isTimeout: boolean
  isSbtError: boolean
}

export async function POST(req: Request) {
  let code: unknown
  try {
    code = (await req.json())?.code
  } catch {
    return Response.json({ error: 'Neplatný požadavek.' }, { status: 400 })
  }
  if (typeof code !== 'string' || !code.trim()) return Response.json({ error: 'Chybí kód.' }, { status: 400 })
  if (code.length > MAX_CODE) return Response.json({ error: 'Kód je příliš dlouhý.' }, { status: 413 })

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  if (limited(ip)) return Response.json({ error: 'Moc spuštění za minutu – chvilku počkej.' }, { status: 429 })

  const inputs = {
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
  }

  const ac = new AbortController()
  const timer = setTimeout(() => ac.abort(), TOTAL_TIMEOUT_MS)
  req.signal.addEventListener('abort', () => ac.abort())

  let id: string
  try {
    const r = await fetch(`${SCASTIE}/api/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(inputs),
      signal: ac.signal,
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const j = (await r.json()) as { base64UUID?: string }
    if (!j.base64UUID) throw new Error('bez id')
    id = j.base64UUID
  } catch (e) {
    clearTimeout(timer)
    return Response.json({ error: `Scastie teď neodpovídá (${(e as Error).message}). Zkus to za chvíli.` }, { status: 502 })
  }

  const enc = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(ctrl) {
      const send = (o: unknown) => {
        try {
          ctrl.enqueue(enc.encode(JSON.stringify(o) + '\n'))
        } catch {
          /* closed */
        }
      }
      send({ t: 'accepted', id })
      let running = false
      let finished = false
      const seenErr = new Set<string>()
      try {
        const r = await fetch(`${SCASTIE}/api/progress-sse/${encodeURIComponent(id)}`, {
          headers: { Accept: 'text/event-stream' },
          signal: ac.signal,
        })
        if (!r.ok || !r.body) throw new Error(`HTTP ${r.status}`)
        const reader = r.body.getReader()
        const dec = new TextDecoder()
        let buf = ''
        outer: for (;;) {
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
              send({ t: 'running' })
            }
            for (const ci of p.compilationInfos || []) {
              if (!('Error' in (ci.severity || {}))) continue
              const msg = ci.message.replace(ANSI, '')
              const key = `${ci.line}:${msg}`
              if (seenErr.has(key)) continue
              seenErr.add(key)
              send({ t: 'err', line: ci.line ?? 0, col: ci.startColumn ?? 0, msg })
            }
            if (p.userOutput && p.userOutput.line !== undefined) {
              const isErr = 'StdErr' in (p.userOutput.tpe || {})
              // Scastie emits a trailing empty line at the end of the output; drop empties after the last real line
              send({ t: 'out', line: p.userOutput.line.replace(ANSI, ''), err: isErr })
            }
            if (p.runtimeError) {
              const m = (p.runtimeError.fullStack || p.runtimeError.message || '').replace(ANSI, '')
              send({ t: 'runtime', msg: m.split('\n').slice(0, 6).join('\n') })
            }
            if (p.isDone || p.isTimeout) {
              finished = true
              send({ t: 'done', timeout: p.isTimeout, sbtError: p.isSbtError })
              break outer
            }
          }
        }
        reader.cancel().catch(() => {})
        if (!finished) send({ t: 'error', msg: 'Scastie ukončilo spojení bez výsledku.' })
      } catch (e) {
        if (!finished)
          send({ t: 'error', msg: ac.signal.aborted ? 'Časový limit vypršel.' : `Spojení se Scastie selhalo (${(e as Error).message}).` })
      } finally {
        clearTimeout(timer)
        try {
          ctrl.close()
        } catch {
          /* ignore */
        }
      }
    },
    cancel() {
      ac.abort()
      clearTimeout(timer)
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' },
  })
}
