'use client'
import { Html } from '../lib/html'
import { Sources } from './Cite'
import type { SourceRef } from './types'

export function Table({ head, rows, caption, sources, id }: { head: string[]; rows: string[][]; caption?: string; sources?: SourceRef[]; id?: string }) {
  return (
    <div id={id} className="sk-tbl-w">
      <div className="sk-tbl-s">
        <table className="sk-tbl">
          {head.length > 0 && (
            <thead>
              <tr>
                {head.map((h, j) => (
                  <Html key={j} as="th" html={h} label />
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {rows.map((r, j) => (
              <tr key={j}>
                {r.map((c, k) => (
                  <Html key={k} as="td" html={c} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(caption || (sources && sources.length > 0)) && (
        <p className="sk-tbl-c">
          {caption && <Html html={caption} />}
          <Sources refs={sources} />
        </p>
      )}
    </div>
  )
}
