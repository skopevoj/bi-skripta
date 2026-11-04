import { Link, Page } from '@skripta/ui'

export default function NotFound() {
  return (
    <Page>
      <header className="sk-doc-h">
        <h1>Stránka neexistuje</h1>
        <p className="sk-lede" style={{ marginTop: 'var(--s-5)' }}>
          Tahle adresa nikam nevede. Možná jen překlep v URL.
        </p>
        <div className="sk-actions" style={{ margin: 0 }}>
          <Link className="sk-btn" href="/">
            Na úvod
          </Link>
          <Link className="sk-btn ghost" href="/kapitola/1/1">
            Začít číst
          </Link>
        </div>
      </header>
    </Page>
  )
}
