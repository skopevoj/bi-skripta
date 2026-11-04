'use client'
import { COURSES, ROZSTREL_URL, type CourseLink } from '../courses'
import { Link, useSkripta } from '../lib/context'
import { Icon } from '../lib/icons'
import { CourseLogo } from './logos'
import { PopoverWrap, usePopover } from './Popover'

/**
 * Brand = the course switcher: logo + course code is one dropdown trigger. The menu lists all skripta
 * (the current one links to its home) and „Příprava na rozstřel“.
 */
export function CourseSwitcher({ logo, home = '/', courses = COURSES, rozstrel = ROZSTREL_URL }: { logo?: React.ReactNode; home?: string; courses?: CourseLink[]; rozstrel?: string | null }) {
  const { course } = useSkripta()
  const { open, setOpen, root } = usePopover()
  // The menu renders only after a click (client-side), so reading `location` here is hydration-safe.
  const local = open && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname)
  return (
    <PopoverWrap root={root} className="sk-brand">
      <button type="button" className="sk-course" aria-haspopup="menu" aria-expanded={open} aria-label={`${course.code}, přepnout skripta`} onClick={() => setOpen(!open)}>
        {logo ? <span className="sk-clogo" aria-hidden="true">{logo}</span> : <CourseLogo id={course.id} />}
        <b>{course.code}</b>
        <Icon name="chevd" />
      </button>
      {open && (
        <div className="sk-pop sk-courses" role="menu" aria-label="Skripta">
          <p className="sk-label">Skripta</p>
          <ul>
            {courses.map((c) => {
              const cur = c.id === course.id
              const body = (
                <>
                  <CourseLogo id={c.id} />
                  <span className="sk-courses-t">
                    <b>{c.code}</b>
                    <span>{c.name}</span>
                  </span>
                  {cur ? <Icon name="check" /> : !c.live && !local ? <small>připravuje se</small> : <span />}
                </>
              )
              return (
                <li key={c.id}>
                  {cur ? (
                    <Link href={home} role="menuitem" aria-current="true" className="on" onClick={() => setOpen(false)}>
                      {body}
                    </Link>
                  ) : (
                    <a href={local && c.devUrl ? c.devUrl : c.url} role="menuitem">
                      {body}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
          {rozstrel && (
            <a className="sk-rozstrel" href={rozstrel} target="_blank" rel="noopener noreferrer" role="menuitem">
              <Icon name="target" />
              <span>Příprava na rozstřel</span>
              <Icon name="ext" />
            </a>
          )}
        </div>
      )}
    </PopoverWrap>
  )
}
