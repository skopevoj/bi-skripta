// Renders every OntoUML diagram in a content file to PNG for visual checking.
// Usage: npx tsx scripts/preview-diagrams.ts content/chapters/chap03.ts <outdir> [style]
//        (style: moderni | klasik | vyrazny | tisk; default moderni)
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import type { Diagram } from '../content/types'
import { layout } from '../src/lib/onto/layout'
import { DiagramSvg, type DiagramStyle } from '../src/components/onto/DiagramSvg'

const here = __dirname
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [file, outdir, styleArg, themeArg] = process.argv.slice(2)
const dark = themeArg === 'dark'
if (!file || !outdir) {
  console.error('usage: tsx scripts/preview-diagrams.ts <content file> <outdir> [style]')
  process.exit(1)
}
const style = (styleArg ?? 'moderni') as DiagramStyle

let css = readFileSync(join(here, '../src/components/onto/onto.css'), 'utf8')
if (!dark) css = css.replace(/\/\* ---------- dark mode[\s\S]*?(?=\/\* ---------- marks)/, '')
const BG = dark ? '#141619' : '#fcfcfd'
const VARS = dark ? ':root{--bg:#141619;--bg-2:#1b1e22;--ink:#e9ebee;--ink-2:#b9bec6;--ink-3:#8b919a;--line:#2a2e34}' : ''

type Found = { name: string; d: Diagram }
function collect(v: unknown, path: string, out: Found[]) {
  if (!v || typeof v !== 'object') return
  const o = v as Record<string, unknown>
  if (Array.isArray(o.classes) && o.classes.length && typeof (o.classes[0] as { st?: unknown }).st === 'string') {
    out.push({ name: path, d: o as unknown as Diagram })
    return
  }
  for (const [k, x] of Object.entries(o)) collect(x, `${path}.${k}`, out)
}

async function main() {
const mod = await import(pathToFileURL(resolve(file)).href)
const found: Found[] = []
for (const [k, v] of Object.entries(mod)) collect(v, k, found)

mkdirSync(outdir, { recursive: true })
let n = 0
for (const f of found) {
  n++
  const g = layout(f.d)
  const svg = renderToStaticMarkup(createElement(DiagramSvg, { g, style, uid: `p${n}` }))
  const full = svg.replace(/^<svg([^>]*)>/, `<svg$1><style>${css}</style><rect x="${g.view.x}" y="${g.view.y}" width="${g.view.w}" height="${g.view.h}" fill="${BG}"/>`)
  const wrapped = full.replace('class="od-svg"', `class="od od-svg" data-style="${style}"`)
  const base = join(outdir, `${String(n).padStart(2, '0')}-${f.name.replace(/[^a-zA-Z0-9]+/g, '_').slice(0, 80)}`)
  writeFileSync(`${base}.svg`, wrapped)
  // render with headless Chrome (supports oklch / color-mix like the real app)
  const html = `<!doctype html><html${dark ? ' data-theme="dark"' : ''}><meta charset="utf-8"><style>${VARS}html,body{margin:0;background:${BG}}body{padding:20px}.od-svg{max-width:none!important}</style>${wrapped}`
  writeFileSync(`${base}.html`, html)
  const W = Math.max(800, Math.ceil(g.view.w) + 240)
  const H = Math.ceil(g.view.h) + 240
  try {
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--user-data-dir=${base}.chrome`, '--force-device-scale-factor=1.5', `--window-size=${W},${H}`, `--screenshot=${base}.png`, pathToFileURL(`${base}.html`).href], { stdio: 'ignore', timeout: 30000 })
    // trim the empty page around the diagram, keep a small border
    execFileSync('magick', [`${base}.png`, '-trim', '+repage', '-bordercolor', BG, '-border', '24', `${base}.png`])
    execFileSync('rm', ['-rf', `${base}.chrome`])
    console.log(`${base}.png`)
  } catch (e) {
    console.error(`chrome failed for ${base}.html`, e)
  }
}
console.log(`${found.length} diagram(s)`)
}
main()
