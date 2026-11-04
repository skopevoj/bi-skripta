'use client'

import { useEffect, useState } from 'react'
import { Seg, cx } from './ui'
import s from './ix.module.css'

type Gw = 'xor' | 'and' | 'or'
type Join = Gw | 'none'
type Br = 'A' | 'B' | 'C'
type At = 'start' | 'X' | 'split' | Br | 'join' | 'Z' | 'end'
type Tok = { id: number; at: At; left: number; br?: Br }
type St = {
  toks: Tok[]
  next: number
  z: number
  ends: number
  steps: number
  fired: Br[] | null
  msg: string
  tone: '' | 'ok' | 'bad' | 'warn'
  done: boolean
}

const BR: Br[] = ['A', 'B', 'C']
const DUR: Record<string, number> = { X: 1, A: 1, B: 2, C: 3, Z: 1 }
const Y: Record<Br, number> = { A: 60, B: 150, C: 240 }
const GWN: Record<Gw, string> = { xor: 'XOR', and: 'AND', or: 'OR' }

const init = (): St => ({
  toks: [],
  next: 1,
  z: 0,
  ends: 0,
  steps: 0,
  fired: null,
  msg: 'Klikni na „Krok“ — ze startovní události vyjde token.',
  tone: '',
  done: false,
})

function choose(split: Gw, a: boolean, b: boolean): Br[] {
  if (split === 'and') return [...BR]
  if (split === 'xor') return a ? ['A'] : b ? ['B'] : ['C']
  const r: Br[] = []
  if (a) r.push('A')
  if (b) r.push('B')
  return r.length ? r : ['C']
}

function step(st: St, split: Gw, join: Join, a: boolean, b: boolean): St {
  if (st.done) return st
  if (st.steps === 0) return { ...st, steps: 1, toks: [{ id: st.next, at: 'X', left: DUR.X }], next: st.next + 1, msg: 'Token je v úloze X.' }
  let next = st.next
  let z = st.z
  let ends = st.ends
  let fired = st.fired
  let msg = ''
  const out: Tok[] = []
  const atJoin = st.toks.filter((t) => t.at === 'join')
  for (const t of st.toks) {
    if (t.at === 'join' || t.at === 'end') continue
    if (t.at === 'split') {
      fired = choose(split, a, b)
      for (const br of fired) out.push({ id: next++, at: br, left: DUR[br], br })
      msg =
        split === 'and'
          ? 'AND split: token se rozdělí na 3 — pokračují všechny cesty.'
          : split === 'xor'
            ? `XOR split: vybrána právě jedna cesta (${fired[0]}${fired[0] === 'C' ? ', výchozí' : ''}).`
            : `OR split: pokračují cesty, jejichž podmínka platí: ${fired.join(', ')} → ${fired.length} ${fired.length === 1 ? 'token' : 'tokeny'}.`
      continue
    }
    if (t.left > 1) {
      out.push({ ...t, left: t.left - 1 })
      continue
    }
    const to: At = t.at === 'X' ? 'split' : t.at === 'Z' ? 'end' : join === 'none' ? 'Z' : 'join'
    if (to === 'Z') z++
    if (to === 'end') ends++
    out.push({ ...t, at: to, left: to === 'Z' ? DUR.Z : 0 })
  }
  // join semantics for tokens that were already waiting
  const upstream = out.some((t) => ['X', 'split', 'A', 'B', 'C'].includes(t.at))
  const waiting = [...atJoin, ...out.filter((t) => t.at === 'join' && !atJoin.includes(t))]
  let rest = out.filter((t) => t.at !== 'join')
  if (join === 'xor') {
    for (const t of atJoin) {
      rest.push({ ...t, at: 'Z', left: DUR.Z })
      z++
    }
    rest = rest.concat(waiting.filter((t) => !atJoin.includes(t)))
    if (atJoin.length) msg = `XOR join propustil ${atJoin.length === 1 ? 'token' : `${atJoin.length} tokeny`} dál — bez čekání na ostatní.`
  } else if (join === 'and') {
    const have = new Set(atJoin.map((t) => t.br))
    if (BR.every((x) => have.has(x))) {
      rest.push({ id: next++, at: 'Z', left: DUR.Z })
      z++
      rest = rest.concat(waiting.filter((t) => !atJoin.includes(t)))
      msg = 'AND join: dorazily tokeny ze všech 3 cest → synchronizace, dál jde jeden token.'
    } else {
      rest = rest.concat(waiting)
      const n = new Set(waiting.map((t) => t.br)).size
      if (waiting.length) msg = `AND join čeká: dorazil${n === 1 ? '' : 'y'} ${n} ze 3 tokenů.`
    }
  } else if (join === 'or') {
    if (atJoin.length && !upstream && waiting.length === atJoin.length) {
      rest.push({ id: next++, at: 'Z', left: DUR.Z })
      z++
      msg = `OR join: dorazily všechny aktivované tokeny (${atJoin.length}) → dál jde jeden.`
    } else {
      rest = rest.concat(waiting)
      if (waiting.length) msg = `OR join čeká na zbylé aktivované cesty (zatím ${waiting.length}).`
    }
  } else if (out.some((t) => t.at === 'Z' && t.left === DUR.Z && t.br)) msg = 'Bez join brány: každý token vstoupí do Z samostatně.'

  const live = rest.filter((t) => t.at !== 'end')
  let tone: St['tone'] = ''
  let done = false
  if (live.length === 0) {
    done = true
    tone = z === 1 ? 'ok' : 'warn'
    msg =
      z === 1
        ? 'Hotovo: Z proběhla jednou a proces skončil jedním tokenem. Split a join k sobě sedí.'
        : `Bez synchronizace: Z proběhla ${z}× — za každý token zvlášť.`
  } else if (join === 'and' && live.every((t) => t.at === 'join') && !BR.every((x) => live.some((t) => t.br === x))) {
    done = true
    tone = 'bad'
    msg = 'DEADLOCK: AND join čeká na tokeny ze všech cest, ale split některé cesty vůbec neaktivoval. Proces se zasekl.'
  }
  if (!msg) msg = live.some((t) => t.at === 'Z') ? 'Token je v úloze Z.' : 'Tokeny pracují v úlohách…'
  return { toks: rest, next, z, ends, steps: st.steps + 1, fired, msg, tone, done }
}

function pos(t: Tok, i: number): [number, number] {
  switch (t.at) {
    case 'start':
      return [36, 150]
    case 'X':
      return [88, 150]
    case 'split':
      return [212, 150]
    case 'A':
    case 'B':
    case 'C':
      return [298, Y[t.at]]
    case 'join':
      return t.br === 'A' ? [448, 104] : t.br === 'C' ? [448, 196] : [412 - i * 4, 150]
    case 'Z':
      return [514 + i * 5, 150]
    default:
      return [640, 150]
  }
}

function Mark({ g, cx: x, cy: y }: { g: Gw; cx: number; cy: number }) {
  if (g === 'xor') return <path className={s.mk} d={`M${x - 7},${y - 7} L${x + 7},${y + 7} M${x + 7},${y - 7} L${x - 7},${y + 7}`} />
  if (g === 'and') return <path className={s.mk} d={`M${x},${y - 10} V${y + 10} M${x - 10},${y} H${x + 10}`} />
  return <circle className={s.mk} cx={x} cy={y} r={9} />
}

function Diamond({ x, g, cls }: { x: number; g: Gw; cls?: string | false }) {
  return (
    <g className={cx(s.bpGw, cls)}>
      <polygon points={`${x},124 ${x + 26},150 ${x},176 ${x - 26},150`} />
      <Mark g={g} cx={x} cy={150} />
    </g>
  )
}

export default function BpmnTokens() {
  const [split, setSplit] = useState<Gw>('and')
  const [join, setJoin] = useState<Join>('and')
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [st, setSt] = useState<St>(init)
  const [play, setPlay] = useState(false)

  const reset = () => {
    setSt(init())
    setPlay(false)
  }
  const cfg = (sp: Gw, jn: Join) => {
    setSplit(sp)
    setJoin(jn)
    setSt(init())
    setPlay(false)
  }
  useEffect(() => {
    if (!play) return
    if (st.done) {
      setPlay(false)
      return
    }
    const h = setTimeout(() => setSt((x) => step(x, split, join, a, b)), 750)
    return () => clearTimeout(h)
  }, [play, st, split, join, a, b])

  const on = (br: Br) => st.fired?.includes(br)
  const fl = (br: Br) => cx(s.bpFlow, st.fired && (on(br) ? s.on : s.off))
  const busy = (n: At) => st.toks.some((t) => t.at === n)
  const joinWait = st.toks.some((t) => t.at === 'join')
  const conds = split !== 'and'

  return (
    <div className={s.stack}>
      <div className={s.ctlRow}>
        <span>Split</span>
        <Seg
          label="Typ rozdělující brány"
          value={split}
          onChange={(v) => cfg(v, join)}
          options={(['xor', 'and', 'or'] as Gw[]).map((g) => ({ v: g, label: GWN[g] }))}
        />
        <span>Join</span>
        <Seg
          label="Typ spojující brány"
          value={join}
          onChange={(v) => cfg(split, v)}
          options={[...(['xor', 'and', 'or'] as Gw[]).map((g) => ({ v: g as Join, label: GWN[g] })), { v: 'none' as Join, label: 'žádná' }]}
        />
      </div>
      <div className={s.ctlRow}>
        <span>Podm.</span>
        <button
          type="button"
          className={s.tgl}
          aria-pressed={a}
          disabled={!conds}
          onClick={() => {
            setA(!a)
            reset()
          }}
          style={{ opacity: conds ? 1 : 0.45 }}
        >
          a
        </button>
        <button
          type="button"
          className={s.tgl}
          aria-pressed={b}
          disabled={!conds}
          onClick={() => {
            setB(!b)
            reset()
          }}
          style={{ opacity: conds ? 1 : 0.45 }}
        >
          b
        </button>
        <span className={s.small} style={{ fontWeight: 400 }}>
          {conds ? 'C je výchozí cesta (default) — jen když a ani b neplatí.' : 'AND split podmínky neřeší: jdou vždy všechny cesty.'}
        </span>
      </div>

      <div className={s.svgBox} style={{ background: 'var(--bg-2)' }}>
        <div className={s.svgIn} style={{ ['--minw' as string]: '560px' }}>
          <svg
            className={s.bp}
            viewBox="0 0 680 290"
            role="img"
            aria-label={`BPMN proces: ${GWN[split]} split, ${join === 'none' ? 'bez join brány' : GWN[join] + ' join'}. ${st.msg}`}
          >
            <defs>
              <marker id="bp-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className={s.bpArrow} />
              </marker>
            </defs>
            <g markerEnd="url(#bp-arr)">
              <path className={s.bpFlow} d="M52,150 H72" />
              <path className={s.bpFlow} d="M162,150 H186" />
              <path className={fl('A')} d="M212,124 V60 H280" />
              <path className={fl('B')} d="M238,150 H280" />
              <path className={fl('C')} d="M212,176 V240 H280" />
              {join === 'none' ? (
                <>
                  <path className={fl('A')} d="M380,60 H470 V140 H498" />
                  <path className={fl('B')} d="M380,150 H498" />
                  <path className={fl('C')} d="M380,240 H470 V160 H498" />
                </>
              ) : (
                <>
                  <path className={fl('A')} d="M380,60 H448 V124" />
                  <path className={fl('B')} d="M380,150 H422" />
                  <path className={fl('C')} d="M380,240 H448 V176" />
                  <path className={s.bpFlow} d="M474,150 H498" />
                </>
              )}
              <path className={s.bpFlow} d="M588,150 H624" />
            </g>
            {conds && (
              <>
                <text className={s.bpLab} x="244" y="52">
                  [a]
                </text>
                <text className={s.bpLab} x="246" y="142">
                  [b]
                </text>
                <text className={s.bpLab} x="222" y="232">
                  výchozí
                </text>
                <path d="M206,190 L218,184" stroke="var(--ink-3)" strokeWidth="1.4" />
              </>
            )}
            <circle className={s.bpEv} cx="36" cy="150" r="16" />
            <g className={cx(s.bpTask, busy('X') && s.busy)}>
              <rect x="72" y="125" width="90" height="50" rx="9" />
              <text x="117" y="155" textAnchor="middle">
                X
              </text>
            </g>
            <Diamond x={212} g={split} />
            {BR.map((br) => (
              <g key={br} className={cx(s.bpTask, busy(br) && s.busy)}>
                <rect x="280" y={Y[br] - 24} width="100" height="48" rx="9" />
                <text x="330" y={Y[br] + 2} textAnchor="middle">
                  {br}
                </text>
                <text className={s.cnt} x="330" y={Y[br] + 16} textAnchor="middle">
                  {DUR[br]} {DUR[br] === 1 ? 'krok' : 'kroky'}
                </text>
              </g>
            ))}
            {join !== 'none' && <Diamond x={448} g={join} cls={st.done && st.tone === 'bad' ? s.dead : joinWait && s.wait} />}
            <g className={cx(s.bpTask, busy('Z') && s.busy, st.z > 1 && s.twice)}>
              <rect x="498" y="125" width="90" height="50" rx="9" />
              <text x="543" y="153" textAnchor="middle">
                Z
              </text>
              {st.z > 0 && (
                <text className={s.cnt} x="543" y="168" textAnchor="middle">
                  proběhla {st.z}×
                </text>
              )}
            </g>
            <circle className={s.bpEnd} cx="640" cy="150" r="15" />
            {st.toks.map((t, i) => {
              const [x, y] = pos(t, i)
              return <circle key={t.id} className={cx(s.bpTok, t.at === 'Z' && s.z)} r="8" cx="0" cy="0" style={{ transform: `translate(${x}px, ${y}px)` }} />
            })}
          </svg>
        </div>
      </div>

      <div className={s.bar}>
        <button type="button" className="btn sm" onClick={() => setSt((x) => step(x, split, join, a, b))} disabled={st.done}>
          Krok
        </button>
        <button type="button" className="btn ghost sm" onClick={() => (st.done ? (setSt(init()), setPlay(true)) : setPlay(!play))}>
          {play ? 'Pauza' : 'Přehrát'}
        </button>
        <button type="button" className="lnk" onClick={reset}>
          Znovu
        </button>
        <span className={s.sp} />
        <span className={s.bpCnt}>
          <span>
            krok <b>{st.steps}</b>
          </span>
          <span>
            tokenů v procesu <b>{st.toks.length}</b>
          </span>
          <span>
            Z proběhla <b>{st.z}×</b>
          </span>
        </span>
      </div>
      <p className={cx(s.bpMsg, st.tone && s[st.tone])} aria-live="polite">
        {st.msg}
      </p>

      <div className={s.bar}>
        <span className={s.small}>Zkus:</span>
        {(
          [
            ['and', 'and', 'AND → AND'],
            ['xor', 'xor', 'XOR → XOR'],
            ['xor', 'and', 'XOR → AND'],
            ['or', 'none', 'OR → bez joinu'],
            ['and', 'xor', 'AND → XOR'],
          ] as [Gw, Join, string][]
        ).map(([sp, jn, l]) => (
          <button
            key={l}
            type="button"
            className={cx(s.opt, s.mono)}
            aria-pressed={split === sp && join === jn}
            onClick={() => cfg(sp, jn)}
            style={{ minHeight: 30, fontSize: 12.5 }}
          >
            {l}
          </button>
        ))}
      </div>
      <p className={s.small}>
        Pravidlo: „split with it, merge with it“ — čím rozdělíš, tím spoj. Jinak hrozí deadlock (AND join po XOR/OR splitu) nebo chybějící synchronizace
        (aktivita za spojením proběhne vícekrát).
      </p>
    </div>
  )
}
