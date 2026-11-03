'use client'
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { ClassSt, Diagram } from '@content/types'
import { layout, visibleAt } from '@/lib/onto/layout'
import { CLASS_INFO } from '@/lib/onto/info'
import { DiagramSvg, STYLES, type DiagramStyle } from './DiagramSvg'
import { Icon } from '../Icon'

// ---- shared style preference (all diagrams switch together) ----
const KEY = 'kom-dstyle'
const subs = new Set<() => void>()
let cur: DiagramStyle | null = null
function getStyle(): DiagramStyle {
  if (cur) return cur
  try {
    const v = localStorage.getItem(KEY) as DiagramStyle | null
    cur = v && STYLES.some((s) => s.id === v) ? v : 'moderni'
  } catch {
    cur = 'moderni'
  }
  return cur
}
export function setDiagramStyle(s: DiagramStyle) {
  cur = s
  try {
    localStorage.setItem(KEY, s)
  } catch {
    /* ignore */
  }
  subs.forEach((f) => f())
}
export function useDiagramStyle(): DiagramStyle {
  return useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    getStyle,
    () => 'moderni',
  )
}

export function StyleSwitch() {
  const style = useDiagramStyle()
  return (
    <div className="od-seg" role="group" aria-label="Styl diagramů">
      {STYLES.map((s) => (
        <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setDiagramStyle(s.id)} title={`Styl diagramů: ${s.label}`}>
          {s.label}
        </button>
      ))}
    </div>
  )
}

function propsLine(st: ClassSt): string[] {
  const i = CLASS_INFO[st]
  const out: string[] = []
  if (i.sortal === true) out.push('sortál')
  if (i.sortal === false) out.push('ne-sortál')
  if (i.rigidity) out.push(i.rigidity)
  if (i.identity) out.push(i.identity)
  if (i.dependence) out.push(i.dependence)
  return out
}

export function OntoDiagram({
  diagram,
  title,
  caption,
  compact,
  toolbar = true,
}: {
  diagram: Diagram
  title?: string
  caption?: string
  compact?: boolean
  toolbar?: boolean
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const style = useDiagramStyle()
  const g = useMemo(() => layout(diagram), [diagram])
  const nSteps = diagram.steps?.length ?? 0
  const [step, setStep] = useState<number | null>(nSteps ? 0 : null)
  const [hover, setHover] = useState<string | null>(null)
  const [focus, setFocus] = useState<string | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<{ x: number; y: number; below: boolean } | null>(null)

  const visible = useMemo(() => visibleAt(diagram, step), [diagram, step])
  const related = useMemo(() => {
    if (!hover) return null
    const s = new Set<string>([hover])
    for (const e of g.edges) {
      if (!e.ends.includes(hover)) continue
      // generalization tree: a subtype relates to its supertype only, not to its siblings
      if (e.kind === 'gen' && e.ends[0] !== hover) s.add(e.ends[0])
      else e.ends.forEach((x) => s.add(x))
    }
    return s
  }, [hover, g])

  const stereotypes = useMemo(() => {
    const seen: ClassSt[] = []
    for (const c of diagram.classes) if (c.st !== 'none' && !seen.includes(c.st)) seen.push(c.st)
    return seen
  }, [diagram])

  const place = useCallback(
    (id: string | null) => {
      setHover(id)
      if (!id || !wrap.current) return setTip(null)
      const b = g.byId.get(id)
      const svg = wrap.current.querySelector('svg')
      if (!b || !svg) return setTip(null)
      const r = svg.getBoundingClientRect()
      const host = wrap.current.getBoundingClientRect()
      const k = r.width / g.view.w
      const x = r.left - host.left + (b.cx - g.view.x) * k
      const yTop = r.top - host.top + (b.y0 - g.view.y) * k
      const yBot = r.top - host.top + (b.y1 - g.view.y) * k
      const below = yTop < 150
      setTip({ x, y: below ? yBot + 8 : yTop - 8, below })
    },
    [g],
  )

  useEffect(() => {
    if (!hover) return
    const off = () => place(null)
    window.addEventListener('scroll', off, { passive: true })
    return () => window.removeEventListener('scroll', off)
  }, [hover, place])

  const over = (e: React.PointerEvent | React.FocusEvent) => {
    const n = (e.target as Element).closest?.('.od-n') as SVGGElement | null
    const id = n?.dataset.id ?? null
    if (id !== hover) place(id)
  }

  const hb = hover ? g.byId.get(hover) : null
  const go = (s: number | null) => {
    setStep(s)
  }

  return (
    <figure className={`od${compact ? ' od-compact' : ''}`} data-style={style}>
      {toolbar && (
        <div className="od-bar">
          {title && <span className="od-title">{title}</span>}
          <div className="od-legend" onPointerLeave={() => setFocus(null)}>
            {stereotypes.map((st) => (
              <button
                key={st}
                type="button"
                className="od-chip"
                data-fam={CLASS_INFO[st].family}
                aria-pressed={focus === st}
                onPointerEnter={() => setFocus(st)}
                onFocus={() => setFocus(st)}
                onBlur={() => setFocus(null)}
                title={CLASS_INFO[st].desc}
              >
                «{CLASS_INFO[st].label}»
              </button>
            ))}
          </div>
          <span className="od-sp" />
          {!compact && <StyleSwitch />}
        </div>
      )}
      <div
        className="od-stage"
        ref={wrap}
        onPointerOver={over}
        onPointerLeave={() => place(null)}
        onFocus={over}
        onBlur={() => place(null)}
      >
        <div className="od-scroll">
          <div style={{ minWidth: Math.min(g.view.w, Math.max(320, g.view.w * 0.62)) }}>
            <DiagramSvg g={g} style={style} uid={uid} state={{ visible, hover, related, famFocus: focus }} title={title} />
          </div>
        </div>
        {hb && tip && (
          <div className="od-tip" data-below={tip.below || undefined} style={{ left: tip.x, top: tip.y }} role="tooltip">
            <div className="od-tip-h">
              {hb.cls.st !== 'none' && <span className="od-chip" data-fam={CLASS_INFO[hb.cls.st].family}>«{CLASS_INFO[hb.cls.st].label}»</span>}
              <b>{hb.cls.name}</b>
            </div>
            {propsLine(hb.cls.st).length > 0 && <div className="od-tip-p">{propsLine(hb.cls.st).join(' · ')}</div>}
            <div className="od-tip-d">{hb.cls.note ?? CLASS_INFO[hb.cls.st].desc}</div>
          </div>
        )}
      </div>
      {nSteps > 0 && (
        <div className="od-steps">
          <button type="button" className="icon-btn" aria-label="Předchozí krok" disabled={step === 0} onClick={() => go(Math.max(0, (step ?? nSteps) - 1))}>
            <Icon name="l" />
          </button>
          <span className="od-step-n">
            {step === null ? 'Celý diagram' : `Krok ${step + 1} / ${nSteps}`}
          </span>
          <button type="button" className="icon-btn" aria-label="Další krok" disabled={step === null || step >= nSteps - 1} onClick={() => go((step ?? 0) + 1)}>
            <Icon name="r" />
          </button>
          <span className="od-step-l">{step === null ? '' : diagram.steps![step].label}</span>
          <span className="od-sp" />
          {step !== null && step < nSteps - 1 ? (
            <button type="button" className="lnk" onClick={() => go(null)}>
              Ukázat vše
            </button>
          ) : (
            <button type="button" className="lnk" onClick={() => go(0)}>
              Znovu od začátku
            </button>
          )}
        </div>
      )}
      {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
    </figure>
  )
}

export function CompareDiagrams({
  items,
  title,
}: {
  title?: string
  items: { label: string; verdict?: 'good' | 'bad' | 'neutral'; note?: string; diagram: Diagram }[]
}) {
  return (
    <div className="od-compare" data-n={items.length}>
      {title && (
        <div className="od-cmp-h">
          <span>{title}</span>
          <StyleSwitch />
        </div>
      )}
      <div className="od-cmp-g">
        {items.map((it, i) => (
          <div key={i} className="od-cmp-i" data-verdict={it.verdict ?? 'neutral'}>
            <div className="od-cmp-l">
              {it.verdict === 'good' && <Icon name="check" />}
              {it.verdict === 'bad' && <Icon name="x" />}
              <span>{it.label}</span>
            </div>
            <OntoDiagram diagram={it.diagram} compact />
            {it.note && <p className="od-cmp-n" dangerouslySetInnerHTML={{ __html: it.note }} />}
          </div>
        ))}
      </div>
    </div>
  )
}
