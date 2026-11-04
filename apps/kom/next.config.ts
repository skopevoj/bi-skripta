import path from 'node:path'
import type { NextConfig } from 'next'

// @skripta/ui is TypeScript source in packages/ui (npm workspace).
// The workspace root contains both; npm hoists one copy of react/next/pdfjs-dist for all of them.
const root = path.resolve(__dirname, '../..')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  transpilePackages: ['@skripta/ui'],
  outputFileTracingRoot: root,
  turbopack: {
    root,
  },
}

export default nextConfig
