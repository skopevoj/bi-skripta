/** Inline SVG icon sprite (24×24 grid, 1.6 stroke). Render <IconSprite/> once (Shell does it). */

export type IconName =
  | 'sun' | 'moon' | 'search' | 'menu' | 'play' | 'l' | 'r' | 'x' | 'check' | 'copy' | 'book' | 'steps'
  | 'warn' | 'file' | 'slides' | 'code' | 'chev' | 'chevd' | 'dot' | 'flag' | 'list' | 'clock' | 'ext' | 'bulb'
  | 'note' | 'sum' | 'lab' | 'img' | 'expand' | 'gear' | 'back' | 'bank' | 'timer' | 'doc' | 'target' | 'proof'
  | 'arrow' | 'star' | 'grid' | 'github'

export function Icon({ name, className, title }: { name: IconName; className?: string; title?: string }) {
  return (
    <svg className={className ? `i ${className}` : 'i'} aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}>
      {title && <title>{title}</title>}
      <use href={`#sk-i-${name}`} />
    </svg>
  )
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <symbol id="sk-i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" /></symbol>
      <symbol id="sk-i-moon" viewBox="0 0 24 24"><path d="M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1z" /></symbol>
      <symbol id="sk-i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></symbol>
      <symbol id="sk-i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
      <symbol id="sk-i-play" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none" /></symbol>
      <symbol id="sk-i-l" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></symbol>
      <symbol id="sk-i-r" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></symbol>
      <symbol id="sk-i-x" viewBox="0 0 24 24"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" /></symbol>
      <symbol id="sk-i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></symbol>
      <symbol id="sk-i-copy" viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></symbol>
      <symbol id="sk-i-book" viewBox="0 0 24 24"><path d="M5 4.5h10.5a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3z" /><path d="M5 16.5a3 3 0 0 1 3-3h10.5" /></symbol>
      <symbol id="sk-i-steps" viewBox="0 0 24 24"><path d="M10 6.5h10M10 12h10M10 17.5h10" /><path d="M4.5 6.5h1.5M4.5 12h1.5M4.5 17.5h1.5" /></symbol>
      <symbol id="sk-i-warn" viewBox="0 0 24 24"><path d="M12 4.5l8.5 15h-17z" /><path d="M12 10v4M12 16.8v.2" /></symbol>
      <symbol id="sk-i-file" viewBox="0 0 24 24"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" /><path d="M14 3.5V8h4" /></symbol>
      <symbol id="sk-i-doc" viewBox="0 0 24 24"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" /><path d="M14 3.5V8h4M9 12.5h6M9 16h4" /></symbol>
      <symbol id="sk-i-slides" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="12" rx="2" /><path d="M12 16.5v3.5M8.5 20h7" /></symbol>
      <symbol id="sk-i-code" viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></symbol>
      <symbol id="sk-i-chev" viewBox="0 0 24 24"><path d="M10 7l5 5-5 5" /></symbol>
      <symbol id="sk-i-chevd" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" /></symbol>
      <symbol id="sk-i-dot" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="currentColor" stroke="none" /></symbol>
      <symbol id="sk-i-flag" viewBox="0 0 24 24"><path d="M6 20.5V4.5M6 5h11l-2.5 4 2.5 4H6" /></symbol>
      <symbol id="sk-i-list" viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" /></symbol>
      <symbol id="sk-i-bank" viewBox="0 0 24 24"><path d="M4 6.5h16M4 12h16M4 17.5h10" /></symbol>
      <symbol id="sk-i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></symbol>
      <symbol id="sk-i-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="7.5" /><path d="M12 9v4l2.5 1.5M9.5 2.5h5" /></symbol>
      <symbol id="sk-i-ext" viewBox="0 0 24 24"><path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" /></symbol>
      <symbol id="sk-i-bulb" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.4 1.1 2.2h5c0-.8.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" /></symbol>
      <symbol id="sk-i-note" viewBox="0 0 24 24"><path d="M6 3.5h9l3.5 3.5v13H6z" /><path d="M9 11h6M9 15h4" /></symbol>
      <symbol id="sk-i-sum" viewBox="0 0 24 24"><path d="M17 5H7l5.5 7L7 19h10" /></symbol>
      <symbol id="sk-i-lab" viewBox="0 0 24 24"><path d="M9.5 3.5h5M10 3.5v6l-5 8.5a1.5 1.5 0 0 0 1.3 2.5h11.4a1.5 1.5 0 0 0 1.3-2.5L14 9.5v-6M7.5 15h9" /></symbol>
      <symbol id="sk-i-img" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 16l-5-5-8 8.5" /></symbol>
      <symbol id="sk-i-expand" viewBox="0 0 24 24"><path d="M14.5 4.5h5v5M9.5 19.5h-5v-5M19.5 4.5l-6 6M4.5 19.5l6-6" /></symbol>
      <symbol id="sk-i-gear" viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></symbol>
      <symbol id="sk-i-back" viewBox="0 0 24 24"><path d="M10 7l-5 5 5 5M5 12h10a4 4 0 0 1 4 4v1" /></symbol>
      <symbol id="sk-i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".8" fill="currentColor" /></symbol>
      <symbol id="sk-i-proof" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="1.5" /><path d="M9 12.2l2 2 4-4.4" /></symbol>
      <symbol id="sk-i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></symbol>
      <symbol id="sk-i-star" viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></symbol>
      <symbol id="sk-i-grid" viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></symbol>
      <symbol id="sk-i-github" viewBox="0 0 24 24"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.2-3.3-1.2-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.1-.2-4.4-1.1-4.4-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.4 4.7.3.3.7.9.7 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z" fill="currentColor" stroke="none" /></symbol>
    </svg>
  )
}
