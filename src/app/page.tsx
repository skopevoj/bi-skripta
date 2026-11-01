import Link from 'next/link'
import { ListQuiz } from '@/components/ListQuiz'
import { HomeChapters } from '@/components/HomeChapters'
import { Icon } from '@/components/Icon'
import { chapters, navChapters, questions, tests } from '@/lib/content'

export default function Home() {
  const nav = navChapters()
  return (
    <main className="content">
      <div className="doc home">
        <figure className="homies">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/memes/homies-hate-scala.jpg" alt="Meme „Me and my homies hate Scala“: parta kluků před obchodem." width={1106} height={1000} />
        </figure>
        <p className="lede">Vypromptěný skripta na midterm z BI-OOP.</p>
        <div style={{ height: 24 }} />
        <ListQuiz />

        <h2>Midterm</h2>
        <ul className="facts">
          <li>
            <b>10. 11. 2026</b>
          </li>
          <li>
            <b>10</b> otázek × <b>2</b> b, na projití <b>10</b>
          </li>
          <li>
            <b>45</b> minut, na papíře
          </li>
          <li>
            přednášky <b>1–6</b> (bez 3)
          </li>
        </ul>
        <div className="actions">
          <Link className="btn" href="/kapitola/1/1">
            Začít číst
          </Link>
          {tests.length > 0 && (
            <Link className="btn ghost" href="/testy">
              <Icon name="clock" />
              Testy nanečisto
            </Link>
          )}
          <Link className="btn ghost" href="/otazky">
            <Icon name="list" />
            Banka otázek · {questions.length}
          </Link>
          <Link className="btn ghost" href="/prednasky">
            <Icon name="file" />
            Přednášky
          </Link>
        </div>

        <h2>Kapitoly</h2>
        <HomeChapters
          chapters={nav.map((c) => ({
            ...c,
            summary: chapters.find((x) => x.number === c.number)!.summary,
          }))}
        />
        <p className="fine">
          Obsah vygenerovala AI z oficiálních slajdů a kvízů; kód, na kterém záleží, je ověřený kompilátorem (scala-cli). I tak tu můžou být chyby –
          když si nejsi jistý, klikni na odkaz na slajd.
        </p>
      </div>
    </main>
  )
}
