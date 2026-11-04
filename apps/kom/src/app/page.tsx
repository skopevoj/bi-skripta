import { ChapterList, Comics, Facts, Icon, Link, Page } from '@skripta/ui'
import type { Diagram } from '@content/types'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { navChapters, questions, tests } from '@/lib/content'
import { XKCD } from '@/lib/xkcd'

const HERO: Diagram = {
  classes: [
    { id: 'person', name: 'Person', st: 'kind', x: 1, y: 0, note: 'Kind dává osobě princip identity — Jan je pořád tentýž člověk.' },
    { id: 'child', name: 'Child', st: 'phase', x: 0.4, y: 1.25, note: 'Fáze: Jan jí projde a přestane v ní být (anti-rigidní, podle vnitřní vlastnosti — věku).' },
    { id: 'adult', name: 'Adult', st: 'phase', x: 1.6, y: 1.25, note: 'Fáze: spolu s Child tvoří disjunktní a úplný rozklad.' },
    { id: 'student', name: 'Student', st: 'role', x: 2.75, y: 1.25, note: 'Role: studentem je Jan jen díky vztahu k univerzitě (relační závislost).' },
    { id: 'enr', name: 'Enrollment', st: 'relator', x: 4.35, y: 1.25, attrs: ['since: Date'], note: 'Relátor: zápis je „věc“, která drží vztah studenta a univerzity pohromadě.' },
    { id: 'uni', name: 'University', st: 'kind', x: 4.35, y: 0 },
  ],
  gens: [
    { general: 'person', specifics: ['child', 'adult'], set: { name: 'age', disjoint: true, complete: true } },
    { general: 'person', specifics: ['student'] },
  ],
  assocs: [
    { from: 'enr', to: 'student', st: 'mediation', fromMult: '1..*', toMult: '1' },
    { from: 'enr', to: 'uni', st: 'mediation', fromMult: '1..*', toMult: '1' },
  ],
}

export default function Home() {
  return (
    <Page>
      <Comics items={XKCD} label="xkcd" credit={
          <>
            Komiksy <a href="https://xkcd.com/">xkcd</a> od Randalla Munroea, licence{' '}
            <a href="https://creativecommons.org/licenses/by-nc/2.5/">CC BY-NC 2.5</a>.
          </>
        } />
      <header className="sk-doc-h">
        <p className="sk-eyebrow">BI-KOM · FIT ČVUT</p>
        <h1>Konceptuální modelování, ať tomu rozumíš.</h1>
        <p className="sk-lede" style={{ marginTop: 'var(--s-5)' }}>
          Skripta z BI-KOM: OntoUML, OCL, RDF a BPMN. Krátce, s diagramy, na které můžeš najet myší, a s otázkami přímo v textu. Každé tvrzení vede na
          konkrétní slajd.
        </p>
        <div className="sk-actions" style={{ margin: 0 }}>
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
            Slajdy
          </Link>
        </div>
      </header>

      <div className="sk-fig-w dg-w">
        <OntoDiagram diagram={HERO} title="Najeď myší na třídu" />
      </div>

      <h2>Testy</h2>
      <Facts>
        <li>
          <b>Midterm</b> v Moodle: <b>10</b> otázek, <b>15+5</b> min, min. <b>5</b> z 10 b — OntoUML
        </li>
        <li>
          <b>Zkouška</b>: <b>40</b> b — celý předmět
        </li>
      </Facts>

      <h2>Kapitoly</h2>
      <ChapterList chapters={navChapters()} />
      <p className="sk-fine">
        Obsah vygenerovala AI ze slajdů přednášek a cvičení, z oficiální dokumentace OntoUML a ze studentských materiálů na FIT Wiki. Můžou tu být chyby. Když si
        nejsi jistý, klikni na odkaz na slajd.
      </p>
    </Page>
  )
}
