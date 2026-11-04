'use client'
import { useState } from 'react'
import { highlight } from '@/lib/highlight'
import { Icon } from './Icon'

// Every option verified with scala-cli 3.9: println(expr == List(1, 2, 3)) prints true.
const LIST_OPTS: { code: string; looks: string }[] = [
  { code: 'List(1, 2, 3)', looks: 'podezřele normální' },
  { code: '1 :: 2 :: 3 :: Nil', looks: 'Haskell' },
  { code: 'Nil.::(3).::(2).::(1)', looks: 'Lisp pozpátku' },
  { code: 'new ::(1, new ::(2, new ::(3, Nil)))', looks: 'C++' },
  { code: 'List.newBuilder[Int].addOne(1).addOne(2).addOne(3).result()', looks: 'Java' },
  { code: 'List.from(1 until 4)', looks: 'Python' },
  { code: '(for i <- 1 to 3 yield i).toList', looks: 'Python po škole' },
  { code: 'List.tabulate(3)(_ + 1)', looks: 'Excel' },
]

export function ListQuiz() {
  const [sel, setSel] = useState<number[]>([])
  const [done, setDone] = useState(false)
  return (
    <section className="mcard" aria-label="Zkoušková otázka">
      <p className="mcard-k">Zkoušková otázka</p>
      <p className="mcard-q">Jak ve Scale vytvoříš seznam 1, 2, 3? Označ všechny správné odpovědi.</p>
      <ul className="opts lq">
        {LIST_OPTS.map((o, i) => {
          const on = sel.includes(i)
          return (
            <li key={o.code}>
              <label className={['opt', on && 'picked', done && 'right', done && 'locked'].filter(Boolean).join(' ')}>
                <input type="checkbox" checked={on} disabled={done} onChange={() => setSel(on ? sel.filter((x) => x !== i) : [...sel, i])} />
                <code dangerouslySetInnerHTML={{ __html: highlight(o.code) }} />
                <span className="lq-l">{o.looks}</span>
              </label>
            </li>
          )
        })}
      </ul>
      {done ? (
        <div className="lq-a">
          <span className="verdict ok" style={{ margin: 0 }}>
            <Icon name="check" />
            Správně jsou všechny.
          </span>
          <span className="badge ok">
            <Icon name="check" />
            Ověřeno kompilátorem
          </span>
          <span className="lq-p">Ve Scale je na všechno 8 způsobů a na midtermu dostaneš ten devátý.</span>
        </div>
      ) : (
        <button type="button" className="btn ghost sm" onClick={() => setDone(true)}>
          Zkontrolovat
        </button>
      )}
    </section>
  )
}
