import type { ReactNode } from 'react'

// Classic textbook figure: centered content with a muted caption underneath.
// No card chrome — diagrams flow inline with the text.
export function Figure({
  caption,
  children,
}: {
  caption?: string
  children: ReactNode
}) {
  return (
    <figure className="my-8 flex flex-col items-center gap-3">
      <div className="max-w-full overflow-x-auto">{children}</div>
      {caption && (
        <figcaption className="text-[13px] text-ink-500 font-serif italic text-center max-w-prose">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Shared SVG tokens — keep diagrams visually consistent.
// Colors derive from the ink palette so diagrams sit in the page, not on top of it.
export const svg = {
  // Stroke + fill defaults
  stroke: '#3a3a36', // ink-300
  strokeMuted: '#9c9a91', // ink-600
  strokeFaint: '#c4c2b8', // ink-700
  fillBox: '#f4f2ec', // ink-900
  fillBoxAlt: '#ecebe5', // ink-850
  fillEmphasis: '#dedcd3', // ink-800
  text: '#16161a', // ink-100
  textMuted: '#52524d', // ink-400
  textFaint: '#71706a', // ink-500
  accent: '#71706a', // muted accent for highlights
} as const
