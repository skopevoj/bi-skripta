'use client'
// @skripta/ui/next — Next.js App Router adapter: wires next/link, usePathname, useRouter, useSearchParams.
import NextLink from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { forwardRef, useCallback } from 'react'
import type { LinkComponent, LinkProps, NavigateOptions } from '../lib/config'
import { SkriptaProvider, type SkriptaProviderProps } from '../lib/context'

export const NextLinkAdapter: LinkComponent = forwardRef<HTMLAnchorElement, LinkProps>(function NextLinkAdapter(props, ref) {
  return <NextLink ref={ref} {...props} />
}) as LinkComponent

/** Query param hook — the component that calls it must sit under <Suspense> in statically rendered pages. */
export function useNextSearchParam(name: string): string | null {
  return useSearchParams().get(name)
}

export type NextSkriptaProviderProps = Omit<SkriptaProviderProps, 'Link' | 'pathname' | 'navigate' | 'useSearchParam'>

/**
 * <SkriptaProvider> for Next.js. Render it from a course-owned 'use client' file
 * (config holds functions: renderers, highlighter…), then use that wrapper in app/layout.tsx.
 */
export function NextSkriptaProvider(props: NextSkriptaProviderProps) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const navigate = useCallback(
    (href: string, o?: NavigateOptions) => (o?.replace ? router.replace(href, { scroll: o.scroll ?? true }) : router.push(href, { scroll: o?.scroll ?? true })),
    [router],
  )
  return <SkriptaProvider {...props} Link={NextLinkAdapter} pathname={pathname} navigate={navigate} useSearchParam={useNextSearchParam} />
}
