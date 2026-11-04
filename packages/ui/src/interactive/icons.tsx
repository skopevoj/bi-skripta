import type { ReactNode } from 'react'

/** Malé ikonky kitu (16 px, tah = currentColor). Názvy jsou stabilní API. */
export type IxIconName =
  | 'reset'
  | 'shuffle'
  | 'prev'
  | 'next'
  | 'first'
  | 'last'
  | 'play'
  | 'pause'
  | 'minus'
  | 'plus'
  | 'ok'
  | 'bad'
  | 'warn'
  | 'info'
  | 'lab'
  | 'chevron'

const P: Record<IxIconName, ReactNode> = {
  reset: (
    <>
      <path d="M3 8a5 5 0 1 0 1.5-3.6" />
      <path d="M3 2.5v2.8h2.8" />
    </>
  ),
  shuffle: (
    <>
      <path d="M2 4.5h2.2c1.2 0 2 .6 2.7 1.6l2.2 3.8c.6 1 1.4 1.6 2.6 1.6H14" />
      <path d="M2 11.5h2.2c1.2 0 2-.6 2.7-1.6M9.1 6.1c.6-1 1.4-1.6 2.6-1.6H14" />
      <path d="M12.2 2.8 14 4.5l-1.8 1.7M12.2 9.8l1.8 1.7-1.8 1.7" />
    </>
  ),
  prev: <path d="M10 3.5 5.5 8l4.5 4.5" />,
  next: <path d="M6 3.5 10.5 8 6 12.5" />,
  first: (
    <>
      <path d="M8 3.5 3.5 8 8 12.5" />
      <path d="M12.5 3.5 8 8l4.5 4.5" />
    </>
  ),
  last: (
    <>
      <path d="M8 3.5 12.5 8 8 12.5" />
      <path d="M3.5 3.5 8 8l-4.5 4.5" />
    </>
  ),
  play: <path d="M5 3.2v9.6L12.5 8z" fill="currentColor" />,
  pause: (
    <>
      <path d="M5.5 3.5v9M10.5 3.5v9" />
    </>
  ),
  minus: <path d="M3.5 8h9" />,
  plus: <path d="M3.5 8h9M8 3.5v9" />,
  ok: <path d="M3 8.5 6.5 12 13 4.5" />,
  bad: <path d="M4 4l8 8M12 4l-8 8" />,
  warn: (
    <>
      <path d="M8 2.2 14.5 13.5h-13z" />
      <path d="M8 6.5v3M8 11.6v.1" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 7.2v4M8 4.9v.1" />
    </>
  ),
  lab: (
    <>
      <path d="M6 2h4M6.5 2v4L2.8 12.4A1.1 1.1 0 0 0 3.8 14h8.4a1.1 1.1 0 0 0 1-1.6L9.5 6V2" />
      <path d="M4.6 10h6.8" />
    </>
  ),
  chevron: <path d="M4 6l4 4 4-4" />,
}

export function IxIcon({ name, className }: { name: IxIconName; className?: string }) {
  return (
    <svg className={className ? `ix-ic ${className}` : 'ix-ic'} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      {P[name]}
    </svg>
  )
}
