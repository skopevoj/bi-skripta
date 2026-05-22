import type { ReactNode } from 'react'

// Sterile LaTeX-style container for interactive widgets.
// Thin border, paper background, sans-serif label — matches the surrounding
// skripta typography without competing for attention.
export function InteractiveCard({
  title,
  hint,
  children,
}: {
  title?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <figure className="my-6 rounded-md border border-ink-800 bg-ink-900/30">
      <figcaption className="flex items-baseline justify-between gap-3 px-4 py-2 border-b border-ink-800 font-sans">
        <span className="text-[11px] tracking-[0.22em] uppercase text-ink-500">
          Interaktivní
        </span>
        {title && (
          <span className="text-[13px] font-medium text-ink-300 text-right">
            {title}
          </span>
        )}
      </figcaption>
      {hint && (
        <div className="px-4 pt-3 text-[13px] text-ink-400 font-sans">
          {hint}
        </div>
      )}
      <div className="px-4 py-4">{children}</div>
    </figure>
  )
}

// Shared utility classes for sterile controls. Use these inside interactive
// components so spacing and typography stay consistent across widgets.
export const ui = {
  label: 'block text-[11px] tracking-[0.18em] uppercase text-ink-500 font-sans mb-1',
  input:
    'w-full px-2.5 py-1.5 bg-ink-950 border border-ink-800 rounded text-ink-100 font-mono text-[13px] focus:outline-none focus:border-ink-600',
  slider:
    'w-full accent-ink-400 cursor-pointer',
  button:
    'px-3 py-1.5 bg-ink-900 hover:bg-ink-850 border border-ink-800 hover:border-ink-700 rounded text-ink-100 font-sans text-[13px] font-medium transition-colors',
  buttonPrimary:
    'px-3 py-1.5 bg-ink-100 hover:bg-ink-200 text-ink-950 rounded font-sans text-[13px] font-medium transition-colors',
  mono: 'font-mono text-[13px] text-ink-100',
  monoMuted: 'font-mono text-[13px] text-ink-400',
  chip:
    'inline-block px-1.5 py-0.5 rounded bg-ink-900 border border-ink-800 text-ink-200 font-mono text-[12px]',
  panel:
    'rounded border border-ink-800 bg-ink-950/50 px-3 py-2',
  rowLabel: 'text-[11px] tracking-[0.18em] uppercase text-ink-500 font-sans',
}
