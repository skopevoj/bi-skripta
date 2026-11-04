// Tiny history-API router (paths `/`, `/:chapterId`, `/:chapterId/:sectionId`) wired into
// @skripta/ui through `SkriptaProvider` (`Link`, `pathname`, `navigate`).
import { forwardRef, useSyncExternalStore } from 'react'
import type { LinkComponent, LinkProps, NavigateOptions } from '@skripta/ui'

export type Route =
  | { kind: 'home' }
  | { kind: 'chapter'; chapterId: string }
  | { kind: 'section'; chapterId: string; sectionId: string }
  | { kind: 'notFound'; path: string }

export function parsePath(pathname: string): Route {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean).map(decodeURIComponent)
  if (parts.length === 0) return { kind: 'home' }
  if (parts.length === 1) return { kind: 'chapter', chapterId: parts[0]! }
  if (parts.length === 2) return { kind: 'section', chapterId: parts[0]!, sectionId: parts[1]! }
  return { kind: 'notFound', path: pathname }
}

export function pathFor(chapterId: string, sectionId?: string) {
  return sectionId ? `/${chapterId}/${sectionId}` : `/${chapterId}`
}

// `sk:navigate` is the event @skripta/ui listens to for query params; we use it for the pathname too.
const EVENT = 'sk:navigate'

function subscribe(cb: () => void) {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

/** Current `location.pathname` + hash (re-renders on navigation). */
export function useLocation(): { pathname: string; hash: string } {
  const href = useSyncExternalStore(
    subscribe,
    () => window.location.pathname + window.location.hash,
    () => '/',
  )
  const i = href.indexOf('#')
  return i < 0 ? { pathname: href, hash: '' } : { pathname: href.slice(0, i), hash: href.slice(i + 1) }
}

/** Scroll to `#hash` (or to the top) after the next paint. */
export function scrollToHash(hash: string) {
  requestAnimationFrame(() => {
    const el = hash ? document.getElementById(decodeURIComponent(hash)) : null
    if (el) el.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  })
}

export function navigate(href: string, opts: NavigateOptions = {}) {
  const url = new URL(href, window.location.href)
  if (url.origin !== window.location.origin) {
    window.location.href = href
    return
  }
  const to = url.pathname + url.search + url.hash
  const cur = window.location.pathname + window.location.search + window.location.hash
  if (to !== cur) {
    if (opts.replace) window.history.replaceState(null, '', to)
    else window.history.pushState(null, '', to)
    window.dispatchEvent(new Event(EVENT))
  }
  if (opts.scroll !== false) scrollToHash(url.hash.slice(1))
}

/** `<a>` that navigates client-side (modifier / middle clicks, new tabs and external links behave normally). */
export const RouterLink: LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(function RouterLink(
  { href, replace, scroll, prefetch: _prefetch, onClick, target, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      target={target}
      {...rest}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (target && target !== '_self') return
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) && !href.startsWith(window.location.origin)) return
        e.preventDefault()
        navigate(href, { replace, scroll })
      }}
    />
  )
}) as LinkComponent
