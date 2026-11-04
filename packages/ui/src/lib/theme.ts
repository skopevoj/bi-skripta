export type Theme = 'system' | 'light' | 'dark'
export type FontSize = 's' | 'm' | 'l'

/**
 * Inline script for <head> (before paint): restores theme + font size from localStorage.
 * Next: <script dangerouslySetInnerHTML={{ __html: themeInitScript('kom') }} />
 */
export function themeInitScript(prefix: string): string {
  const p = JSON.stringify(prefix)
  return `try{var d=document.documentElement,t=localStorage.getItem(${p}+'-theme'),f=localStorage.getItem(${p}+'-fs');if(t==='light'||t==='dark')d.dataset.theme=t;if(f==='s'||f==='l')d.dataset.fs=f}catch(e){}`
}

export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme
  return t === 'light' || t === 'dark' ? t : 'system'
}
export function resolvedTheme(): 'light' | 'dark' {
  const t = currentTheme()
  return t === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : t
}
export function applyTheme(prefix: string, t: Theme) {
  const root = document.documentElement
  // Colour transitions on controls would otherwise animate from the old theme (a visible flash).
  root.dataset.themeSwitch = ''
  requestAnimationFrame(() => requestAnimationFrame(() => delete root.dataset.themeSwitch))
  if (t === 'system') delete root.dataset.theme
  else root.dataset.theme = t
  try {
    if (t === 'system') localStorage.removeItem(`${prefix}-theme`)
    else localStorage.setItem(`${prefix}-theme`, t)
  } catch {
    /* ignore */
  }
}
export function currentFontSize(): FontSize {
  const f = document.documentElement.dataset.fs
  return f === 's' || f === 'l' ? f : 'm'
}
export function applyFontSize(prefix: string, f: FontSize) {
  const root = document.documentElement
  if (f === 'm') delete root.dataset.fs
  else root.dataset.fs = f
  try {
    if (f === 'm') localStorage.removeItem(`${prefix}-fs`)
    else localStorage.setItem(`${prefix}-fs`, f)
  } catch {
    /* ignore */
  }
}
