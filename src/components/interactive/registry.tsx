'use client'

import dynamic from 'next/dynamic'
import type { ComponentType } from 'react'
import type { InteractiveName } from '@content/types'

function Loading() {
  return <div className="ix-loading" aria-busy="true" style={{ minHeight: 160 }} />
}

const WIDGETS: Record<InteractiveName, ComponentType> = {
  'stereotype-tree': dynamic(() => import('./StereotypeTree'), { ssr: false, loading: Loading }),
  'gs-venn': dynamic(() => import('./GsVenn'), { ssr: false, loading: Loading }),
  'rigidity-timeline': dynamic(() => import('./RigidityTimeline'), { ssr: false, loading: Loading }),
  'part-whole': dynamic(() => import('./PartWhole'), { ssr: false, loading: Loading }),
  'ocl-playground': dynamic(() => import('./OclPlayground'), { ssr: false, loading: Loading }),
  'rdf-graph': dynamic(() => import('./RdfGraph'), { ssr: false, loading: Loading }),
  'bpmn-tokens': dynamic(() => import('./BpmnTokens'), { ssr: false, loading: Loading }),
  transform: dynamic(() => import('./Transform'), { ssr: false, loading: Loading }),
}

export function InteractiveWidget({ name }: { name: InteractiveName }) {
  const W = WIDGETS[name]
  if (!W) return null
  return <W />
}

export default InteractiveWidget
