import type { Metadata, Viewport } from 'next'
import { Onest, JetBrains_Mono } from 'next/font/google'
import { Shell } from '@/components/Shell'
import { IconSprite } from '@/components/Icon'
import { WorkbenchProvider } from '@/components/workbench/WorkbenchProvider'
import { navChapters, questions, tests } from '@/lib/content'
import { buildSearchIndex } from '@/lib/search-index'
import './globals.css'

const onest = Onest({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '700'], variable: '--font-onest', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], weight: ['400', '500'], variable: '--font-jbmono', display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'BI-OOP skripta', template: '%s · BI-OOP skripta' },
  description: 'Kuchařka na midterm z BI-OOP (FIT ČVUT): skripta, otázky z kvízů a testy nanečisto se spouštěním Scaly.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#141619' },
  ],
}

const themeInit = `try{var t=localStorage.getItem('oop-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${onest.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <IconSprite />
        <WorkbenchProvider>
          <Shell nav={navChapters()} search={buildSearchIndex()} counts={{ questions: questions.length, tests: tests.length }}>
            {children}
          </Shell>
        </WorkbenchProvider>
      </body>
    </html>
  )
}
