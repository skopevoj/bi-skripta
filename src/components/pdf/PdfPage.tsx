'use client'
import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy } from 'pdfjs-dist'

type PdfJs = typeof import('pdfjs-dist')
let pdfjsP: Promise<PdfJs> | null = null
function pdfjs(): Promise<PdfJs> {
  if (!pdfjsP)
    pdfjsP = import('pdfjs-dist').then((m) => {
      m.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
      return m
    })
  return pdfjsP
}

const docs = new Map<string, Promise<PDFDocumentProxy>>()
export function loadPdf(file: string): Promise<PDFDocumentProxy> {
  let d = docs.get(file)
  if (!d) {
    d = pdfjs().then((m) => m.getDocument({ url: file }).promise)
    d.catch(() => docs.delete(file))
    docs.set(file, d)
  }
  return d
}

// ---- quote matching ---------------------------------------------------------
const LIG: Record<string, string> = { 'ﬁ': 'fi', 'ﬂ': 'fl', 'ﬀ': 'ff', 'ﬃ': 'ffi', 'ﬄ': 'ffl', 'ﬅ': 'st', 'ﬆ': 'st' }
const PUNCT: Record<string, string> = { '’': "'", '‘': "'", '“': '"', '”': '"', '„': '"', '–': '-', '—': '-', '−': '-', '…': '...', '­': '' }

/** Normalise one character to its comparable form ('' = skip). Whitespace is dropped entirely. */
function normChar(ch: string): string {
  if (/\s/.test(ch)) return ''
  if (LIG[ch]) return LIG[ch]
  if (ch in PUNCT) return PUNCT[ch]
  return ch.toLowerCase()
}
function normString(s: string): string {
  let o = ''
  for (const ch of s) o += normChar(ch)
  return o
}

type Pos = { node: Text; off: number }

/** Highlight `quotes` inside a rendered text layer; returns the boxes relative to `wrap`. */
function findBoxes(layer: HTMLElement, wrap: HTMLElement, quotes: string[]): { x: number; y: number; w: number; h: number }[] {
  const walker = document.createTreeWalker(layer, NodeFilter.SHOW_TEXT)
  let hay = ''
  const map: Pos[] = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text
    const s = t.data
    for (let i = 0; i < s.length; i++) {
      const nc = normChar(s[i])
      for (let k = 0; k < nc.length; k++) {
        hay += nc[k]
        map.push({ node: t, off: i })
      }
    }
  }
  const base = wrap.getBoundingClientRect()
  const boxes: { x: number; y: number; w: number; h: number }[] = []
  for (const q of quotes) {
    const needle = normString(q)
    if (needle.length < 3) continue
    let at = hay.indexOf(needle)
    if (at < 0) {
      // tolerate small differences at the edges: try a shorter middle chunk
      const cut = Math.floor(needle.length * 0.15)
      const mid = needle.slice(cut, needle.length - cut)
      if (mid.length >= 8) at = hay.indexOf(mid)
      if (at < 0) continue
      const a = map[at]
      const b = map[at + mid.length - 1]
      pushRange(a, b)
      continue
    }
    pushRange(map[at], map[at + needle.length - 1])
  }
  function pushRange(a: Pos, b: Pos) {
    const r = document.createRange()
    r.setStart(a.node, a.off)
    r.setEnd(b.node, Math.min(b.off + 1, b.node.data.length))
    for (const rc of Array.from(r.getClientRects())) {
      if (rc.width < 1 || rc.height < 1) continue
      boxes.push({ x: rc.left - base.left - 1, y: rc.top - base.top - 1, w: rc.width + 2, h: rc.height + 2 })
    }
  }
  return boxes
}

// ---- component ----------------------------------------------------------------
export function PdfPage({
  file,
  page,
  quotes,
  onPages,
  onFound,
}: {
  file: string
  page: number
  quotes?: string[]
  onPages?: (n: number) => void
  onFound?: (found: boolean) => void
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [boxes, setBoxes] = useState<{ x: number; y: number; w: number; h: number }[]>([])
  const [width, setWidth] = useState(0)
  const qkey = (quotes ?? []).join('\u0001')

  // track width
  useEffect(() => {
    const el = wrap.current?.parentElement
    if (!el) return
    const ro = new ResizeObserver(() => {
      const w = Math.floor(el.clientWidth - parseFloat(getComputedStyle(el).paddingLeft) - parseFloat(getComputedStyle(el).paddingRight))
      setWidth((prev) => (Math.abs(prev - w) > 4 ? w : prev))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!width) return
    let cancelled = false
    let task: { cancel: () => void } | null = null
    let tl: { cancel: () => void } | null = null
    ;(async () => {
      try {
        const m = await pdfjs()
        const doc = await loadPdf(file)
        if (cancelled) return
        onPages?.(doc.numPages)
        const p = await doc.getPage(Math.min(Math.max(1, page), doc.numPages))
        if (cancelled) return
        const v1 = p.getViewport({ scale: 1 })
        const scale = width / v1.width
        const vp = p.getViewport({ scale })
        const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
        const c = canvas.current!
        c.width = Math.floor(vp.width * dpr)
        c.height = Math.floor(vp.height * dpr)
        c.style.width = `${Math.floor(vp.width)}px`
        c.style.height = `${Math.floor(vp.height)}px`
        const w = wrap.current!
        w.style.width = `${Math.floor(vp.width)}px`
        const rt = p.render({ canvas: c, viewport: vp, transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : undefined })
        task = rt
        await rt.promise
        if (cancelled) return
        const L = layer.current!
        L.replaceChildren()
        L.style.setProperty('--scale-factor', String(scale))
        L.style.setProperty('--total-scale-factor', String(scale))
        L.style.setProperty('--user-unit', '1')
        const text = await p.getTextContent()
        if (cancelled) return
        const t = new m.TextLayer({ textContentSource: text, container: L, viewport: vp })
        tl = t
        await t.render()
        if (cancelled) return
        setState('ok')
        const qs = (quotes ?? []).filter(Boolean)
        if (qs.length) {
          const b = findBoxes(L, w, qs)
          setBoxes(b)
          onFound?.(b.length > 0)
          if (b.length) {
            const top = Math.min(...b.map((x) => x.y))
            const scroller = w.closest('.sv-stage') as HTMLElement | null
            if (scroller) scroller.scrollTo({ top: Math.max(0, top - 80), behavior: 'smooth' })
          }
        } else setBoxes([])
      } catch (e) {
        if (cancelled) return
        if ((e as { name?: string })?.name === 'RenderingCancelledException') return
        console.error(e)
        setState('error')
      }
    })()
    return () => {
      cancelled = true
      task?.cancel()
      tl?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, page, qkey, width])

  return (
    <div className="pg-wrap" ref={wrap} style={{ minHeight: state === 'loading' ? 200 : undefined }}>
      {state === 'error' && <div className="pg-msg">PDF se nepodařilo načíst.</div>}
      <canvas ref={canvas} />
      {boxes.map((b, i) => (
        <span key={`${qkey}-${page}-${i}`} className="hlbox" style={{ left: b.x, top: b.y, width: b.w, height: b.h }} />
      ))}
      <div className="textLayer" ref={layer} />
    </div>
  )
}
