// Copies the pdf.js worker next to the app so it can be loaded from /pdf.worker.min.mjs.
import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(dirname(require.resolve('pdfjs-dist/package.json')), 'build', 'pdf.worker.min.mjs')
mkdirSync(join(root, 'public'), { recursive: true })
copyFileSync(src, join(root, 'public', 'pdf.worker.min.mjs'))
console.log('pdf.worker.min.mjs copied')
