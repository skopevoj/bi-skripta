'use client'
import type { InteractiveName } from '@content/types'
import { InteractiveWidget } from '../interactive/registry'
import { Icon } from '../Icon'

export function Interactive({ id, name, title, hint }: { id: string; name: InteractiveName; title?: string; hint?: string }) {
  return (
    <div className="lab" id={id} data-lab={name}>
      {title && (
        <div className="lab-h">
          <Icon name="lab" />
          {title}
        </div>
      )}
      {hint && <p className="lab-hint">{hint}</p>}
      <InteractiveWidget name={name} />
    </div>
  )
}
