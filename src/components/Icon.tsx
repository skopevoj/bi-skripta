export type IconName =
  | 'sun' | 'moon' | 'search' | 'menu' | 'play' | 'l' | 'r' | 'x' | 'check' | 'copy' | 'book' | 'steps'
  | 'warn' | 'file' | 'slides' | 'code' | 'chev' | 'dot' | 'flag' | 'list' | 'clock' | 'ext' | 'bulb' | 'note' | 'sum' | 'lab' | 'img'
  | 'expand' | 'gear'

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className ? `i ${className}` : 'i'} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></symbol>
      <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /></symbol>
      <symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
      <symbol id="i-play" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z" fill="currentColor" stroke="none" /></symbol>
      <symbol id="i-l" viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></symbol>
      <symbol id="i-r" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></symbol>
      <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></symbol>
      <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></symbol>
      <symbol id="i-copy" viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" /><path d="M15.5 8.5V6.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2" /></symbol>
      <symbol id="i-book" viewBox="0 0 24 24"><path d="M5 4.5h10.5a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3z" /><path d="M5 16.5a3 3 0 0 1 3-3h10.5" /></symbol>
      <symbol id="i-steps" viewBox="0 0 24 24"><path d="M10 6h10M10 12h10M10 18h10" /><path d="M4 5.5l1.2-1V8M3.8 14.5c.3-1.4 2.6-1.4 2.6 0 0 .9-2.6 1.6-2.6 3h2.6" strokeWidth="1.4" /></symbol>
      <symbol id="i-warn" viewBox="0 0 24 24"><path d="M12 4.5l8.5 15h-17z" /><path d="M12 10v4.2M12 16.9v.1" /></symbol>
      <symbol id="i-file" viewBox="0 0 24 24"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10.5a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z" /><path d="M14 3.5V8h4" /></symbol>
      <symbol id="i-slides" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="12" rx="1.5" /><path d="M12 16.5v3.5M8.5 20h7" /></symbol>
      <symbol id="i-code" viewBox="0 0 24 24"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5" /></symbol>
      <symbol id="i-chev" viewBox="0 0 24 24"><path d="M10 7l5 5-5 5" /></symbol>
      <symbol id="i-dot" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /></symbol>
      <symbol id="i-flag" viewBox="0 0 24 24"><path d="M6 20.5V4.5M6 5h11l-2.5 4 2.5 4H6" /></symbol>
      <symbol id="i-list" viewBox="0 0 24 24"><path d="M9 6.5h11M9 12h11M9 17.5h11M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" /></symbol>
      <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></symbol>
      <symbol id="i-ext" viewBox="0 0 24 24"><path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1H10" /></symbol>
      <symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 17.5h6M10 20.5h4M12 3.5a5.5 5.5 0 0 0-3.3 9.9c.5.4.8 1 .8 1.6v.5h5v-.5c0-.6.3-1.2.8-1.6A5.5 5.5 0 0 0 12 3.5z" /></symbol>
      <symbol id="i-note" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 7.9v.1" /></symbol>
      <symbol id="i-sum" viewBox="0 0 24 24"><path d="M17 5.5H7l5 6.5-5 6.5h10" /></symbol>
      <symbol id="i-lab" viewBox="0 0 24 24"><path d="M9.5 3.5h5M10 3.5v6l-5 8.5a1.5 1.5 0 0 0 1.3 2.5h11.4a1.5 1.5 0 0 0 1.3-2.5L14 9.5v-6M7.5 15h9" /></symbol>
      <symbol id="i-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z" /></symbol>
      <symbol id="i-expand" viewBox="0 0 24 24"><path d="M14.5 4.5h5v5M9.5 19.5h-5v-5M19.5 4.5l-6 6M4.5 19.5l6-6" /></symbol>
      <symbol id="i-img" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M20.5 16l-5-5-8 8.5" /></symbol>
    </svg>
  )
}
