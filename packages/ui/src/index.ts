// @skripta/ui — core: provider, shell, content blocks, practice, progress, search, courses.
// Optional-dependency parts live in subpaths: ./workbench (pdfjs-dist), ./next (next), ./math (katex), ./interactive.

// provider / config
export { SkriptaProvider, useSkripta, Link, PlainLink, defaultRenderHtml, useLocationSearchParam, type Skripta, type SkriptaProviderProps } from './lib/context'
export type {
  SkriptaConfig, CourseRef, LinkComponent, LinkProps, NavigateOptions, HtmlRenderer, CalloutDef, CalloutTone,
  BlockRenderer, BlockRenderProps, CiteItem, SourceView,
} from './lib/config'
export { Html, hasBlockHtml } from './lib/html'
export { Icon, IconSprite, type IconName } from './lib/icons'
export { COURSES, ROZSTREL_URL, REPO_URL, type CourseLink } from './courses'

// lib
export { useProgress, useProgressActions, progressApi, storageKey, loadJSON, saveJSON, type Progress } from './lib/progress'
export { buildSearchIndex, searchItems, type SearchItem } from './lib/search'
export { plain, fold, plural, readingMinutes } from './lib/text'
export { themeInitScript, applyTheme, applyFontSize, currentTheme, resolvedTheme, type Theme, type FontSize } from './lib/theme'

// shell
export { Shell, type ShellProps, type ShellTab } from './shell/Shell'
export { Sidebar, currentOf, type SideLink } from './shell/Sidebar'
export { Toc } from './shell/Toc'
export { Search } from './shell/Search'
export { Settings, ThemeToggle } from './shell/Settings'
export { CourseSwitcher } from './shell/CourseSwitcher'
export { CourseLogo } from './shell/logos'

// content
export * from './content/types'
export { Blocks, Lab, type BlocksProps } from './content/Blocks'
export { Callout } from './content/Callout'
export { CALLOUTS, calloutDef } from './content/callouts'
export { Table } from './content/Table'
export { Figure } from './content/Figure'
export { Comics, type Comic } from './content/Comics'
export { CodeBlock, escapeHtml } from './content/Code'
export { Cite, Sources, citeItems, docView, defaultWebLabel } from './content/Cite'
export { Page, DocHeader, PrevNext, ReadMarker, Rows, ChapterList, Facts, type MetaItem, type RowItem } from './content/Article'
export {
  blockId, countCallouts, calloutStart, sectionQuestionIds, tocEntries, navChapters, prevNext, defaultSectionHref,
  type TocEntry, type PageLink,
} from './content/helpers'

// workbench state (the panel UI itself is in ./workbench)
export { WorkbenchProvider, useWorkbench, type WorkbenchCtx, type WorkbenchPayload } from './workbench/context'

// practice
export * from './practice/index'
