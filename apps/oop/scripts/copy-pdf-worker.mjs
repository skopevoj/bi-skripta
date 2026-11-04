// Copies the pdf.js worker next to the app so it can be loaded from /pdf.worker.min.mjs.
// The worker must match the pdfjs-dist that @skripta/ui/workbench bundles, so resolve it from the package
// (npm workspaces hoist one copy to the monorepo root; this also catches a nested copy if one ever appears).
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
let from = require
try {
  from = createRequire(require.resolve('@skripta/ui'))
} catch {
  /* package not installed — fall back to the app's own resolution */
}
const pkg = from.resolve('pdfjs-dist/package.json')
const src = join(dirname(pkg), 'build', 'pdf.worker.min.mjs')
mkdirSync(join(root, 'public'), { recursive: true })
copyFileSync(src, join(root, 'public', 'pdf.worker.min.mjs'))
console.log(`pdf.worker.min.mjs copied (pdfjs-dist ${JSON.parse(readFileSync(pkg, 'utf8')).version})`)
