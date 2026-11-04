import Link from 'next/link'
import type { Diagram } from '@content/types'
import { HomeChapters } from '@/components/HomeChapters'
import { Icon } from '@/components/Icon'
import { OntoDiagram } from '@/components/onto/OntoDiagram'
import { chapters, navChapters, questions, tests } from '@/lib/content'

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
  const nav = navChapters()
  return (
    <main className="content">
      <div className="doc home">
        <h1 className="home-h">Konceptuální modelování, ať tomu rozumíš.</h1>
        <p className="lede">
          Skripta z BI-KOM: OntoUML, OCL, RDF a BPMN. Krátce, s diagramy, na které můžeš najet myší, a s otázkami přímo v textu. Každé tvrzení vede na
          konkrétní slajd.
        </p>
        <OntoDiagram diagram={HERO} title="Najeď myší na třídu" />

        <h2>Testy</h2>
        <ul className="facts">
          <li>
            <b>Midterm</b> v Moodle: <b>10</b> otázek, <b>15+5</b> min, min. <b>5</b> z 10 b — OntoUML
          </li>
          <li>
            <b>Zkouška</b>: <b>40</b> b — celý předmět
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
            Slajdy
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
          Obsah vygenerovala AI ze slajdů přednášek a cvičení, z oficiální dokumentace OntoUML a ze studentských materiálů na FIT Wiki. Můžou tu být chyby. Když
          si nejsi jistý, klikni na odkaz na slajd.
        </p>
      </div>
    </main>
  )
}
