import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const src = fileURLToPath(new URL('../src', import.meta.url))

// Playground importuje zdroj balíčku přímo (stejně jako aplikace přes `file:`), react/katex z ../node_modules.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@skripta\/ui\/styles\.css$/, replacement: `${src}/styles.css` },
      { find: /^@skripta\/ui\/(interactive|math|practice|workbench)$/, replacement: `${src}/$1/index.ts` },
      { find: /^@skripta\/ui$/, replacement: `${src}/index.ts` },
    ],
    dedupe: ['react', 'react-dom', 'katex'],
  },
  server: { port: 5180, strictPort: true, fs: { allow: ['..'] } },
  preview: { port: 5180, strictPort: true },
})
