'use client'
import { createContext, createElement, forwardRef, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { WorkbenchProvider } from '../workbench/context'
import type { HtmlRenderer, LinkComponent, LinkProps, NavigateOptions, SkriptaConfig } from './config'

export type Skripta = Required<Pick<SkriptaConfig, 'Link' | 'pathname' | 'navigate' | 'useSearchParam' | 'renderHtml' | 'docs'>> &
  Omit<SkriptaConfig, 'Link' | 'pathname' | 'navigate' | 'useSearchParam' | 'renderHtml' | 'docs'>

/** Plain `<a>`; drops router-only props. */
export const PlainLink: LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(function PlainLink(
  { replace: _r, scroll: _s, prefetch: _p, ...rest },
  ref,
) {
  return <a ref={ref} {...rest} />
}) as LinkComponent

export const defaultRenderHtml: HtmlRenderer = ({ html, as, className, id }) =>
  createElement(as, { className, id, dangerouslySetInnerHTML: { __html: html } })

function subscribeLocation(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener('sk:navigate', cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener('sk:navigate', cb)
  }
}
/** Default query-param hook (no router): reads `location.search`, follows popstate / `sk:navigate`. */
export function useLocationSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribeLocation,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  )
}

const defaultNavigate = (href: string, opts?: NavigateOptions) => {
  if (opts?.replace) window.history.replaceState(null, '', href)
  else window.history.pushState(null, '', href)
  window.dispatchEvent(new Event('sk:navigate'))
  if (opts?.scroll !== false) window.scrollTo({ top: 0 })
}

const DEFAULTS: Skripta = {
  course: { id: 'skripta', code: 'Skripta', storage: 'skripta' },
  Link: PlainLink,
  pathname: '/',
  navigate: defaultNavigate,
  useSearchParam: useLocationSearchParam,
  renderHtml: defaultRenderHtml,
  docs: [],
}

const Ctx = createContext<Skripta>(DEFAULTS)

/** Resolved course config (defaults filled in). Works without a provider. */
export function useSkripta(): Skripta {
  return useContext(Ctx)
}

export type SkriptaProviderProps = SkriptaConfig & { children: ReactNode }

/**
 * Root provider: course config, navigation (Link / pathname / navigate), HTML renderer,
 * course renderers, practice config. Also mounts the Workbench (source panel) state.
 * Must be rendered from a client file — config contains functions/components.
 */
const KEYS: (keyof SkriptaConfig)[] = [
  'course', 'Link', 'pathname', 'navigate', 'useSearchParam', 'renderHtml', 'docs', 'docHref', 'resolveSource', 'webLabel',
  'wikiUrl', 'blocks', 'interactive', 'callouts', 'highlight', 'codeLangs', 'defaultLang', 'codeActions', 'practice', 'pdfWorker',
]

export function SkriptaProvider({ children, ...cfg }: SkriptaProviderProps) {
  const deps = KEYS.map((k) => cfg[k])
  const value = useMemo<Skripta>(() => {
    const out = { ...DEFAULTS } as Skripta
    KEYS.forEach((k, i) => {
      if (deps[i] !== undefined) (out as Record<string, unknown>)[k] = deps[i]
    })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return (
    <Ctx.Provider value={value}>
      <WorkbenchProvider>{children}</WorkbenchProvider>
    </Ctx.Provider>
  )
}

/** `<Link>` from the provider. */
export function Link(props: LinkProps) {
  const { Link: L } = useSkripta()
  return <L {...props} />
}
