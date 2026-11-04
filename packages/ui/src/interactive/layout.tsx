import type { CSSProperties, ReactNode } from 'react'
import { cx } from './util'

/** Index do škály mezer `--s-*` (1 = 4 px, 2 = 8, 3 = 12, 4 = 16, 5 = 20, 6 = 24, 8 = 32). */
export type Gap = 1 | 2 | 3 | 4 | 5 | 6 | 8

const gapVar = (g: Gap) => `var(--s-${g})`

type Common = { gap?: Gap; className?: string; style?: CSSProperties; children: ReactNode }

/** Svislý sloupec s mezerami (výchozí 16 px). */
export function Stack({ gap = 4, className, style, children }: Common) {
  return (
    <div className={cx('ix-stack', className)} style={{ gap: gapVar(gap), ...style }}>
      {children}
    </div>
  )
}

/** Vodorovná řada, která se zalamuje (výchozí mezera 12 px, zarovnání dolů — popisky polí nad sebou sedí). */
export function Row({
  gap = 3,
  align = 'end',
  justify,
  nowrap,
  className,
  style,
  children,
}: Common & { align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch'; justify?: 'start' | 'between' | 'end'; nowrap?: boolean }) {
  return (
    <div
      className={cx('ix-row', nowrap && 'ix-row-nowrap', className)}
      style={{
        gap: gapVar(gap),
        alignItems: align === 'start' || align === 'end' ? `flex-${align}` : align,
        justifyContent: justify === 'between' ? 'space-between' : justify ? `flex-${justify}` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Mřížka s automatickým počtem sloupců (každý aspoň `min`, výchozí 200 px). Na 375 px spadne do jednoho sloupce. */
export function Grid({ gap = 4, min = 200, className, style, children }: Common & { min?: number }) {
  return (
    <div className={cx('ix-grid', className)} style={{ gap: gapVar(gap), gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))`, ...style }}>
      {children}
    </div>
  )
}

/** Vodorovně posuvný kontejner pro široký obsah (diagram, dlouhá řada). Stránka se nikdy neposouvá do strany. */
export function Scroll({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('ix-scroll', className)}>{children}</div>
}

/** Text pro čtečky obrazovky (vizuálně skrytý). */
export function SrOnly({ children }: { children: ReactNode }) {
  return <span className="ix-sr">{children}</span>
}

/** Vedlejší text (šedý, menší). */
export function Muted({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('ix-muted', className)}>{children}</p>
}
