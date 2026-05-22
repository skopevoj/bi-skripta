import type { ReactNode } from 'react'
import type { CalloutKind } from '../types'
import { MathHTML } from './MathHTML'

const META: Record<
  CalloutKind,
  { label: string; bar: string; icon: ReactNode }
> = {
  definice: {
    label: 'Definice',
    bar: 'bg-accent-definice text-ink-100',
    icon: <AnchorIcon />,
  },
  veta: {
    label: 'Věta',
    bar: 'bg-accent-veta text-ink-100',
    icon: <RocketIcon />,
  },
  priklad: {
    label: 'Příklad',
    bar: 'bg-accent-priklad text-ink-100',
    icon: <CoffeeIcon />,
  },
  poznamka: {
    label: 'Poznámka',
    bar: 'bg-accent-poznamka text-ink-100',
    icon: <SparkleIcon />,
  },
  lemma: {
    label: 'Lemma',
    bar: 'bg-accent-lemma text-ink-100',
    icon: <FlameIcon />,
  },
  dusledek: {
    label: 'Důsledek',
    bar: 'bg-accent-dusledek text-ink-100',
    icon: <ArrowIcon />,
  },
  dukaz: {
    label: 'Důkaz',
    bar: 'bg-accent-dukaz text-ink-100',
    icon: <CheckIcon />,
  },
}

export function Callout({
  type,
  number,
  title,
  html,
}: {
  type: CalloutKind
  number: string
  title: string
  html: string
}) {
  const meta = META[type]
  const header = [meta.label, number].filter(Boolean).join(' ')
  const hasHeader = !!header || !!title
  return (
    <section className="my-5 rounded-lg border border-ink-800 bg-ink-900/40">
      {hasHeader && (
        <header
          className={
            'flex items-center justify-between gap-3 px-4 py-2.5 font-sans font-semibold rounded-t-lg ' +
            meta.bar
          }
        >
          <span className="text-[15px] flex items-baseline gap-1">
            <span>{header}</span>
            {title && (
              <MathHTML
                as="span"
                className="font-medium opacity-90"
                html={`(${title})`}
                noGloss
              />
            )}
          </span>
          <span className="opacity-90" aria-hidden="true">
            {meta.icon}
          </span>
        </header>
      )}
      <div className="px-5 py-4">
        <MathHTML className="skripta-prose" html={html} />
      </div>
    </section>
  )
}

function CoffeeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <path d="M6 2v3M10 2v3M14 2v3" />
    </svg>
  )
}
function RocketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}
function AnchorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="22" x2="12" y2="8" />
      <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
    </svg>
  )
}
function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  )
}
function FlameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z" />
    </svg>
  )
}
function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
