import type { Metadata, Viewport } from 'next'
import { Instrument_Sans, Source_Code_Pro } from 'next/font/google'
import { Shell, themeInitScript } from '@skripta/ui'
import { Workbench } from '@skripta/ui/workbench'
import '@skripta/ui/styles.css'
import '@/components/onto/onto.css'
import './kom.css'
import { DiagramStyleSetting } from '@/components/onto/DiagramStyleSetting'
import { navChapters, questions, searchIndex, tests } from '@/lib/content'
import { DOCS } from '@/lib/meta'
import { KomProvider } from '@/skripta'

const sans = Instrument_Sans({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-sans', display: 'swap' })
const mono = Source_Code_Pro({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'BI-KOM skripta', template: '%s · BI-KOM skripta' },
  description: 'Skripta z BI-KOM (FIT ČVUT): OntoUML, OCL, RDF a BPMN s interaktivními diagramy, otázkami z midtermu a testy nanečisto.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript('kom') }} />
      </head>
      <body>
        <KomProvider>
          <Shell
            nav={navChapters()}
            search={searchIndex()}
            tabs={[
              { href: '/kapitola/1/1', label: 'Skripta', match: ['/', '/kapitola'] },
              { href: '/otazky', label: 'Banka otázek' },
              { href: '/testy', label: 'Testy nanečisto' },
              { href: '/prednasky', label: 'Slajdy' },
            ]}
            links={[
              { href: '/otazky', label: 'Banka otázek', icon: 'bank', count: questions.length },
              { href: '/testy', label: 'Testy nanečisto', icon: 'timer', count: tests.length },
              { href: '/prednasky', label: 'Slajdy (PDF)', icon: 'slides', count: DOCS.length },
            ]}
            settings={<DiagramStyleSetting />}
            panel={<Workbench />}
          >
            {children}
          </Shell>
        </KomProvider>
      </body>
    </html>
  )
}
