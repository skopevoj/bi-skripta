'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { InteractiveName } from '@content/types'

function Loading() {
  return <div className="ix-loading" aria-busy="true" style={{ minHeight: 160 }} />
}

export const WIDGETS: Record<InteractiveName, ComponentType> = {
  'variance-lab': dynamic(() => import('./VarianceLab'), { ssr: false, loading: Loading }),
  'bounds-lab': dynamic(() => import('./BoundsLab'), { ssr: false, loading: Loading }),
  'dispatch-tracer': dynamic(() => import('./DispatchTracer'), { ssr: false, loading: Loading }),
  linearization: dynamic(() => import('./Linearization'), { ssr: false, loading: Loading }),
  'override-rules': dynamic(() => import('./OverrideRules'), { ssr: false, loading: Loading }),
}

export function InteractiveWidget({ name }: { name: InteractiveName }) {
  const W = WIDGETS[name]
  if (!W) return null
  return <W />
}

export default InteractiveWidget
