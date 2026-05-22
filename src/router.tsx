import { useEffect, useState } from 'react'
import type React from 'react'

export type Route =
  | { kind: 'home' }
  | { kind: 'chapter'; chapterId: string }
  | { kind: 'section'; chapterId: string; sectionId: string }
  | { kind: 'notFound'; path: string }

function parsePath(pathname: string): Route {
  const parts = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (parts.length === 0) return { kind: 'home' }
  if (parts.length === 1) return { kind: 'chapter', chapterId: parts[0]! }
  if (parts.length === 2)
    return { kind: 'section', chapterId: parts[0]!, sectionId: parts[1]! }
  return { kind: 'notFound', path: pathname }
}

const subscribers = new Set<() => void>()

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (window.location.pathname === to && !opts.replace) return
  if (opts.replace) window.history.replaceState({}, '', to)
  else window.history.pushState({}, '', to)
  subscribers.forEach((cb) => cb())
}

export function useRoute(): Route {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    subscribers.add(update)
    window.addEventListener('popstate', update)
    return () => {
      subscribers.delete(update)
      window.removeEventListener('popstate', update)
    }
  }, [])
  return parsePath(pathname)
}

export function pathFor(chapterId: string, sectionId?: string) {
  return sectionId ? `/${chapterId}/${sectionId}` : `/${chapterId}`
}

export function Link({
  to,
  className,
  children,
  onClick,
  title,
}: {
  to: string
  className?: string
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  title?: string
}) {
  return (
    <a
      href={to}
      title={title}
      className={className}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        if (e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
