/** All skripta sites — the course switcher in the top bar lists these. */
export type CourseLink = {
  id: string
  code: string
  name: string
  url: string
  live: boolean
  /** Local dev server (`npm run dev` in the monorepo root); used by the switcher when running on localhost. */
  devUrl?: string
}

export const COURSES: CourseLink[] = [
  { id: 'bi-kab', code: 'BI-KAB', name: 'Kryptografie a bezpečnost', url: 'https://kab.skopik.cz', live: true, devUrl: 'http://localhost:5173' },
  { id: 'bi-kom', code: 'BI-KOM', name: 'Konceptuální modelování', url: 'https://kom.skopik.cz', live: true, devUrl: 'http://localhost:3131' },
  { id: 'bi-oop', code: 'BI-OOP', name: 'Objektově orientované programování', url: 'https://oop.skopik.cz', live: true, devUrl: 'http://localhost:3123' },
]

/** „Příprava na rozstřel“ — question drill across courses (opens in a new tab). */
export const ROZSTREL_URL =
  'https://skopevoj.github.io/cvut-marasty/?addSource=https://raw.githubusercontent.com/CoconutBigNut/cvut-otazky/refs/heads/main/questions/questions.json'

/** Source code of all skripta (icon button in the top bar). */
export const REPO_URL = 'https://github.com/skopevoj/bi-skripta'
