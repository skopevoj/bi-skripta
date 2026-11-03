'use client'

import { useMemo, useState } from 'react'
import { Seg, cx } from './ui'
import { layoutGraph, parse, type TokT } from './lib/turtle'
import s from './ix.module.css'

const EX = {
  taxi: {
    label: 'Taxi: ; a ,',
    note: 'Středník opakuje subjekt, čárka opakuje subjekt i predikát. „a“ je zkratka pro rdf:type.',
    src: `@prefix : <http://example.com/taxi#> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

:anna a :Driver ;
    foaf:name "Anna" ;
    :age 34 ;
    :drives :car1, :car2 .
:car1 :plate "1AB 2345" .
:ride1 :driver :anna ;
    :price 250 .`,
  },
  ema: {
    label: 'Ema: prázdný uzel',
    note: 'Příklad z přednášky: maso, které Ema mele, nemá vlastní IRI → prázdný uzel [ … ]. "300"^^xsd:int je typovaný literál.',
    src: `@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix bi-kom-rdf: <http://example.com/bi-kom/rdf/example#> .
@prefix measure: <http://ontol.com/measures#> .

bi-kom-rdf:ema
    bi-kom-rdf:isMincing [
        bi-kom-rdf:isMeat <http://ontology.com/meats#Beef> ;
        measure:weight "300"^^xsd:int
    ] ;
    bi-kom-rdf:hasName "Ema" .`,
  },
  rdfs: {
    label: 'RDFS: třídy',
    note: 'Schéma je zase jen graf trojic: třídy (rdfs:Class), podtřídy (rdfs:subClassOf), domain/range vlastnosti, jazykové literály @en / @cs.',
    src: `@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ex: <http://example.com/bi-kom/rdf/example#> .

ex:Person a rdfs:Class ;
    rdfs:label "Person"@en, "Osoba"@cs .
ex:Woman a rdfs:Class ;
    rdfs:subClassOf ex:Person .
ex:hasName a rdf:Property ;
    rdfs:domain ex:Person ;
    rdfs:range xsd:string .`,
  },
} as const
type ExKey = keyof typeof EX | 'own'

const CLS: Partial<Record<TokT, string>> = { com: 'c', lit: 's', dir: 'k', a: 'k', iri: 'a', pn: 't', num: 'n', err: 'err' }

export default function RdfGraph() {
  const [ex, setEx] = useState<ExKey>('taxi')
  const [own, setOwn] = useState<string>(EX.taxi.src)
  const [hot, setHot] = useState<Set<number> | null>(null)
  const src = ex === 'own' ? own : EX[ex].src
  const parsed = useMemo(() => parse(src), [src])
  const g = useMemo(() => layoutGraph(parsed.triples), [parsed])

  const tokTriples = useMemo(() => {
    const m = new Map<number, number[]>()
    parsed.triples.forEach((t, i) => t.toks.forEach((ti) => m.set(ti, [...(m.get(ti) ?? []), i])))
    return m
  }, [parsed])
  const hotToks = useMemo(() => {
    const st = new Set<number>()
    hot?.forEach((i) => parsed.triples[i]?.toks.forEach((t) => st.add(t)))
    return st
  }, [hot, parsed])
  const hotNodes = useMemo(() => {
    const st = new Set<string>()
    hot?.forEach((i) => {
      const t = parsed.triples[i]
      if (t) st.add(t.s.key).add(t.o.key)
    })
    return st
  }, [hot, parsed])

  const pick = (k: ExKey) => {
    if (k === 'own' && ex !== 'own') setOwn(EX[ex].src)
    setEx(k)
    setHot(null)
  }
  const on = (i: number) => () => setHot(new Set([i]))
  const off = () => setHot(null)

  return (
    <div className={s.stack}>
      <div className={s.bar}>
        <Seg
          sans
          label="Příklad"
          value={ex}
          onChange={pick}
          options={[...(Object.keys(EX) as (keyof typeof EX)[]).map((k) => ({ v: k as ExKey, label: EX[k].label })), { v: 'own' as ExKey, label: 'Vlastní ✎' }]}
        />
      </div>
      <p className={s.small}>
        {ex === 'own' ? 'Uprav Turtle — graf se překreslí hned. Parser zvládá @prefix, IRI, prefixy, a, ; , [ ], literály s @jazyk a ^^typ.' : EX[ex].note}
      </p>

      <div className={s.rdfGrid}>
        <div className={s.stack}>
          {ex === 'own' ? (
            <textarea className={s.ttlEdit} value={own} onChange={(e) => setOwn(e.target.value)} spellCheck={false} aria-label="Turtle zdroj" />
          ) : (
            <pre className={s.ttl} onPointerLeave={off} aria-label="Turtle zdroj">
              {parsed.toks.map((t, i) => {
                const tr = tokTriples.get(i)
                return (
                  <span key={i} className={cx(CLS[t.t], tr && s.tok, hotToks.has(i) && s.tokOn)} onPointerEnter={tr ? () => setHot(new Set(tr)) : undefined}>
                    {t.text}
                  </span>
                )
              })}
            </pre>
          )}
          {parsed.errors.length > 0 && (
            <pre className={s.errs} role="status">
              {parsed.errors.slice(0, 4).join('\n')}
            </pre>
          )}
        </div>
        <div className={s.tblWrap}>
          <table className={s.triples} aria-label="Trojice (subjekt, predikát, objekt)">
            <tbody onPointerLeave={off}>
              {parsed.triples.map((t, i) => (
                <tr key={i} tabIndex={0} className={cx(hot?.has(i) && s.hot)} onPointerEnter={on(i)} onFocus={on(i)} onBlur={off}>
                  <td>{i + 1}</td>
                  <td>{t.s.label}</td>
                  <td>{t.p.label}</td>
                  <td>{t.o.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={s.svgBox} style={{ background: 'var(--bg-2)' }}>
        {parsed.triples.length === 0 ? (
          <p className={s.small} style={{ padding: 16, margin: 0 }}>
            Žádné trojice.
          </p>
        ) : (
          <div className={s.svgIn} style={{ ['--minw' as string]: `${Math.min(g.w, 520)}px` }}>
            <svg
              className={cx(s.graph, hot && s.hasHot)}
              viewBox={`0 0 ${g.w} ${g.h}`}
              style={{ maxWidth: g.w * 1.15, margin: '0 auto' }}
              role="img"
              aria-label={`Graf: ${parsed.triples.length} trojic`}
              onPointerLeave={off}
            >
              {g.edges.map((e) => (
                <g key={e.i} className={cx(s.gEdge, hot?.has(e.i) && s.hot)} onPointerEnter={on(e.i)}>
                  <path className={s.hitp} d={e.d} />
                  <path d={e.d} />
                  <polygon points={e.arrow} />
                  <text x={e.lx} y={e.ly} textAnchor="middle">
                    {e.label}
                  </text>
                </g>
              ))}
              {g.nodes.map((n) => (
                <g
                  key={n.key}
                  className={cx(s.gNode, n.term.kind === 'lit' ? s.gLit : n.term.kind === 'blank' ? s.gBlank : s.gIri, hotNodes.has(n.key) && s.hot)}
                >
                  <title>{n.term.full}</title>
                  {n.term.kind === 'lit' ? (
                    <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} />
                  ) : (
                    <ellipse cx={n.x + n.w / 2} cy={n.y + n.h / 2} rx={n.w / 2} ry={n.h / 2} />
                  )}
                  <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 4} textAnchor="middle">
                    {n.term.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </div>
      <p className={s.small}>
        Elipsa = zdroj s IRI, čárkovaná elipsa = prázdný uzel, obdélník = literál. Hrana = predikát (subjekt → objekt). Najeď na trojici v kódu, v tabulce nebo
        v grafu.
      </p>
    </div>
  )
}
