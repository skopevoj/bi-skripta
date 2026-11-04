'use client'
// Home page teaser: one „exam question“ where every option is right.
import { useState } from 'react'
import { Icon } from '@skripta/ui'
import { highlight } from '@/lib/highlight'

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
    <section className="sk-q oop-lq" aria-label="Zkoušková otázka">
      <div className="sk-q-h">
        <span className="sk-q-k">Zkoušková otázka</span>
      </div>
      <p className="sk-q-p">Jak ve Scale vytvoříš seznam 1, 2, 3? Označ všechny správné odpovědi.</p>
      <ul className="sk-opts">
        {LIST_OPTS.map((o, i) => {
          const on = sel.includes(i)
          return (
            <li key={o.code}>
              <button
                type="button"
                className={done ? `sk-opt right ${on ? 'picked' : 'missed'}` : 'sk-opt'}
                aria-pressed={on}
                disabled={done}
                onClick={() => setSel(on ? sel.filter((x) => x !== i) : [...sel, i])}
              >
                <span className="sk-chk">
                  <Icon name="check" />
                </span>
                <code className="sk-ot oop-hl" dangerouslySetInnerHTML={{ __html: highlight(o.code) }} />
                <span className="oop-lq-l">{o.looks}</span>
              </button>
            </li>
          )
        })}
      </ul>
      {done ? (
        <div className="sk-res on ok">
          <div className="oop-lq-a">
            <p className="sk-verdict">
              <Icon name="check" />
              <b>Správně jsou všechny.</b>
            </p>
            <span className="sk-badge ok">
              <Icon name="check" />
              Ověřeno kompilátorem
            </span>
          </div>
          <p className="sk-expl">Ve Scale je na všechno 8 způsobů a na midtermu dostaneš ten devátý.</p>
        </div>
      ) : (
        <div className="sk-q-f">
          <button type="button" className="sk-btn ghost sm" onClick={() => setDone(true)}>
            Zkontrolovat
          </button>
        </div>
      )}
    </section>
  )
}
