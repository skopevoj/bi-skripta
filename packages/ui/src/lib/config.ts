import type { AnchorHTMLAttributes, ComponentType, ElementType, ReactElement, ReactNode } from 'react'
import type { DocInfo, SourceRef } from '../content/types'
import type { PracticeConfig } from '../practice/types'
import type { IconName } from './icons'

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
}
/** Framework link (Next `Link`, a Vite router link…). Default: plain `<a>`. */
export type LinkComponent = ComponentType<LinkProps>

export type NavigateOptions = { replace?: boolean; scroll?: boolean }

/** How an `html` string becomes React. Default: `dangerouslySetInnerHTML` on `as`. */
export type HtmlRenderer = (props: {
  html: string
  as: ElementType
  className?: string
  id?: string
  /** The string is a heading / label / caption (h3 title, callout title, table head…): render math, skip body-text
   *  decorations such as glossary tooltips. */
  label?: boolean
}) => ReactNode

export type CourseRef = {
  /** "bi-kom" — must match an id in `courses.ts` for the switcher to mark it. */
  id: string
  /** "BI-KOM" */
  code: string
  /** "Konceptuální modelování" */
  name?: string
  /** localStorage prefix, e.g. "kom" → keys "kom-progress-v1", "kom-theme"… */
  storage: string
}

export type CalloutTone = 'green' | 'blue' | 'yellow' | 'coral' | 'purple' | 'gray'
export type CalloutDef = {
  label: string
  icon: IconName | ReactElement
  tone: CalloutTone
  /** Listed in "Na této stránce" (default: definice, věta, pravidlo, pozor). */
  toc?: boolean
  /** Prefix used in the TOC entry, e.g. "Pozor: …". */
  tocPrefix?: string
}

export type BlockRenderProps<B = any> = {
  block: B
  /** DOM id of the block (`${secId}-${index + 1}`) — put it on the outer element. */
  id: string
  index: number
  secId: string
  chapter?: string
}
export type BlockRenderer<B = any> = ComponentType<BlockRenderProps<B>>

/** A resolved citation badge. */
export type CiteItem =
  | { k: 'source'; key: string; label: string; title: string; icon?: IconName; view: SourceView }
  | { k: 'ext'; key: string; label: string; title: string; href: string }
  | { k: 'text'; key: string; label: string; title: string }

export type SourceView =
  | { kind: 'pdf'; file: string; title: string; page: number; quotes?: string[]; doc?: string; href?: string; kicker?: string }
  | { kind: 'img'; src: string; label: string; url?: string }

export type SkriptaConfig = {
  course: CourseRef
  Link?: LinkComponent
  pathname?: string
  navigate?: (href: string, opts?: NavigateOptions) => void
  /** Hook returning a query param; Next adapter wires `useSearchParams` (needs a Suspense boundary). */
  useSearchParam?: (name: string) => string | null
  renderHtml?: HtmlRenderer
  /** Course PDFs (slides). Used by citations, TOC "Slajdy" buttons and the source panel. */
  docs?: DocInfo[]
  /** Library page of a doc (link from the source panel). Default `/prednasky/<id>`; return undefined to hide. */
  docHref?: (id: string) => string | undefined
  /** Custom citation handling: return an item, `null` to hide the ref, `undefined` for the default. */
  resolveSource?: (ref: SourceRef, all: SourceRef[]) => CiteItem | null | undefined
  /** Short badge label for a web link. */
  webLabel?: (url: string) => string
  /** Default FIT Wiki link for `wiki` refs without url. */
  wikiUrl?: string
  /** Renderers for course block kinds (`diagram`, `math`, `exercise`…) and overrides of built-ins. */
  blocks?: Record<string, BlockRenderer>
  /** `interactive` block → component by name. */
  interactive?: Record<string, ComponentType<Record<string, never>>>
  /** Extra / overridden callout kinds. */
  callouts?: Record<string, CalloutDef>
  /** Code highlighter → HTML (token classes .k .t .n .s .c .a). Default: escape only. */
  highlight?: (code: string, lang?: string) => string
  /** Code block header label per language. */
  codeLangs?: Record<string, string>
  /** Language of code blocks without `lang` (single-language courses, e.g. OOP: 'scala'). */
  defaultLang?: string
  /** Extra buttons in a code block header (OOP: "Spustit", "Upravit v editoru"). */
  codeActions?: (p: { code: string; lang?: string; runnable?: boolean }) => ReactNode
  practice?: PracticeConfig
  /** pdf.js worker URL (default `/pdf.worker.min.mjs`). */
  pdfWorker?: string
}
