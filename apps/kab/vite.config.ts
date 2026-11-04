import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  // @skripta/ui is a workspace package shipped as TS source; make sure it
  // resolves the app's single copy of React.
  resolve: { dedupe: ['react', 'react-dom'] },
})
