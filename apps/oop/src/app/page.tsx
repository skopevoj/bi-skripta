import { ChapterList, Facts, Icon, Link, Page } from '@skripta/ui'
import { ListQuiz } from '@/components/ListQuiz'
import { navChapters, questions, tests } from '@/lib/content'

export default function Home() {
  return (
    <Page className="oop-home">
      <figure className="oop-homies">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/memes/homies-hate-scala.jpg" alt="Meme „Me and my homies hate Scala“: parta kluků před obchodem." width={1106} height={1000} />
      </figure>
      <header className="sk-doc-h">
        <p className="sk-eyebrow">BI-OOP · FIT ČVUT</p>
        <h1>Vypromptěný skripta na midterm z BI-OOP.</h1>
      </header>

      <ListQuiz />

      <h2>Midterm</h2>
      <Facts>
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
      </Facts>
      <div className="sk-actions">
        <Link className="sk-btn" href="/kapitola/1/1">
          Začít číst
        </Link>
        {tests.length > 0 && (
          <Link className="sk-btn ghost" href="/testy">
            <Icon name="timer" />
            Testy nanečisto
          </Link>
        )}
        <Link className="sk-btn ghost" href="/otazky">
          <Icon name="bank" />
          Banka otázek · {questions.length}
        </Link>
        <Link className="sk-btn ghost" href="/prednasky">
          <Icon name="slides" />
          Přednášky
        </Link>
      </div>

      <h2>Kapitoly</h2>
      <ChapterList chapters={navChapters()} />
      <p className="sk-fine">
        Obsah vygenerovala AI z oficiálních slajdů a kvízů; kód, na kterém záleží, je ověřený kompilátorem (scala-cli). I tak tu můžou být chyby – když si
        nejsi jistý, klikni na odkaz na slajd.
      </p>
    </Page>
  )
}
