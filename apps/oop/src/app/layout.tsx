import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Source_Code_Pro } from 'next/font/google'
import { Shell, themeInitScript } from '@skripta/ui'
import '@skripta/ui/styles.css'
import './oop.css'
import { OopWorkbench } from '@/components/workbench/OopWorkbench'
import { chapters, navChapters, questions, searchIndex, tests } from '@/lib/content'
import { DOCS } from '@/lib/meta'
import { OopProvider } from '@/skripta'

const sans = Instrument_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' })
const mono = Source_Code_Pro({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'BI-OOP skripta', template: '%s · BI-OOP skripta' },
  description: 'Kuchařka na midterm z BI-OOP (FIT ČVUT): skripta, otázky z kvízů a testy nanečisto se spouštěním Scaly.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#11141a' },
  ],
}

const lectureTitles = Object.fromEntries(chapters.map((c) => [c.lecture, c.title]))

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript('oop') }} />
      </head>
      <body>
        <OopProvider lectureTitles={lectureTitles}>
          <Shell
            nav={navChapters()}
            search={searchIndex()}
            tabs={[
              { href: '/kapitola/1/1', label: 'Skripta', match: ['/', '/kapitola'] },
              { href: '/otazky', label: 'Banka otázek' },
              { href: '/testy', label: 'Testy nanečisto' },
              { href: '/prednasky', label: 'Přednášky' },
            ]}
            links={[
              { href: '/otazky', label: 'Banka otázek', icon: 'bank', count: questions.length },
              { href: '/testy', label: 'Testy nanečisto', icon: 'timer', count: tests.length },
              { href: '/prednasky', label: 'Přednášky (PDF)', icon: 'slides', count: DOCS.length },
            ]}
            panel={<OopWorkbench />}
          >
            {children}
          </Shell>
        </OopProvider>
      </body>
    </html>
  )
}
