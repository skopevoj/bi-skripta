import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="content">
      <div className="doc">
        <h1>Stránka neexistuje</h1>
        <p className="lede">Tahle adresa nikam nevede. Možná jen překlep v URL.</p>
        <div className="actions" style={{ marginTop: 24 }}>
          <Link className="btn" href="/">
            Na úvod
          </Link>
          <Link className="btn ghost" href="/kapitola/1/1">
            Začít číst
          </Link>
        </div>
      </div>
    </main>
  )
}
