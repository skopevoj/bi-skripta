// Runs the dev servers of all skripta at once (the top-bar course switcher links between them on localhost).
// Ports must match `devUrl` in packages/ui/src/courses.ts.
import { spawn } from 'node:child_process'

const apps = [
  { name: 'kab', port: 5173, args: ['run', 'dev', '-w', 'apps/kab', '--', '--port', '5173', '--strictPort'] },
  { name: 'kom', port: 3131, args: ['run', 'dev', '-w', 'apps/kom', '--', '-p', '3131'] },
  { name: 'oop', port: 3123, args: ['run', 'dev', '-w', 'apps/oop', '--', '-p', '3123'] },
]

const children = apps.map(({ name, port, args }) => {
  const child = spawn('npm', args, { stdio: ['ignore', 'pipe', 'pipe'], env: process.env })
  const prefix = `[${name}] `
  const pipe = (stream, out) =>
    stream.on('data', (buf) => out.write(buf.toString().replace(/^(?=.)/gm, prefix)))
  pipe(child.stdout, process.stdout)
  pipe(child.stderr, process.stderr)
  child.on('exit', (code) => console.log(`${prefix}skončil (${code ?? 'signál'})`))
  console.log(`${prefix}http://localhost:${port}`)
  return child
})

const stop = () => {
  for (const c of children) c.kill('SIGTERM')
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
