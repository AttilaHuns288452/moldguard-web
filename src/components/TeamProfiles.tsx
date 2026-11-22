import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { TEAM, type TeamMember } from '../content'
import { Reveal } from './ui'
import { prefersReducedMotion } from '../lib/motion'
import './TeamProfiles.css'

/**
 * The team roster and its single profile dialog.
 *
 * One <dialog> serves all eight people: it is opened with showModal() after the
 * selected member's details are committed, so it lands in the top layer above
 * the sticky header and the browser owns Escape, focus trapping, and inertness.
 */
export default function TeamProfiles() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const [active, setActive] = useState<TeamMember | null>(null)
  const [exiting, setExiting] = useState(false)
  const exitTimer = useRef(0)

  // Open after the selected profile has rendered, never on a stale/empty dialog.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !active || dialog.open) return
    setExiting(false)
    dialog.showModal()
  }, [active])

  // Every close path (X, backdrop, Escape) plays the same short exit, and the
  // dialog STAYS modal until it finishes: closing it first would drop the
  // backdrop and hand focus back mid-animation. Reduced motion closes at once.
  const requestClose = () => {
    const dialog = dialogRef.current
    if (!dialog?.open) return
    if (prefersReducedMotion()) {
      window.clearTimeout(exitTimer.current)
      setExiting(false)
      dialog.close()
      return
    }
    if (exiting) return
    setExiting(true)
    window.clearTimeout(exitTimer.current)
    exitTimer.current = window.setTimeout(() => {
      exitTimer.current = 0
      setExiting(false)
      dialog.close()
    }, 190)
  }

  // Rapid open/close or unmount must never leave a timer that closes a dialog
  // that no longer exists.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      if (!mq.matches || !exitTimer.current) return
      window.clearTimeout(exitTimer.current)
      exitTimer.current = 0
      setExiting(false)
      dialogRef.current?.close()
    }
    mq.addEventListener('change', onChange)
    return () => {
      window.clearTimeout(exitTimer.current)
      mq.removeEventListener('change', onChange)
    }
  }, [])

  // Lock page scroll while the modal is up; cleanup runs on close and unmount.
  useEffect(() => {
    if (!active) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [active])

  const open = (event: MouseEvent<HTMLButtonElement>, member: TeamMember) => {
    triggerRef.current = event.currentTarget
    setActive(member)
  }

  return (
    <>
      <ul data-team-profiles className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((member, i) => (
          <Reveal as="li" key={member.id} delay={i * 40}>
            <button
              type="button"
              className="team-card"
              data-team-member={member.id}
              aria-haspopup="dialog"
              aria-label={`View profile: ${member.name}, ${member.role}`}
              onClick={(event) => open(event, member)}
            >
              <img
                className="team-card__photo"
                src={member.photo}
                alt=""
                width={112}
                height={112}
                loading="lazy"
              />
              <span className="team-card__meta">
                <span className="team-card__name">{member.name}</span>
                <span className="team-card__role">{member.role}</span>
                <span className="team-card__cta">
                  View profile
                  <ArrowUpRight className="team-card__arrow size-3" strokeWidth={2.2} aria-hidden="true" />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className={`team-dialog ${exiting ? 'is-closing' : ''}`}
        aria-labelledby="team-profile-name"
        aria-describedby="team-profile-bio"
        onCancel={(event) => {
          // Escape: native close would skip the exit. Keep the dialog modal and
          // let requestClose own the timing.
          event.preventDefault()
          requestClose()
        }}
        onClose={() => {
          setActive(null)
          triggerRef.current?.focus({ preventScroll: true })
        }}
        onKeyDown={(event) => {
          // Chromium's native modal dialog leaves the document body in the Tab
          // order on this Linux build. Keep focus inside the single close action
          // until the profile gains more controls, while Escape remains native.
          if (event.key !== 'Tab') return
          event.preventDefault()
          const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ))
          if (focusable.length === 0) return
          const current = document.activeElement as HTMLElement | null
          const index = Math.max(0, focusable.indexOf(current as HTMLElement))
          const next = event.shiftKey
            ? focusable[(index - 1 + focusable.length) % focusable.length]
            : focusable[(index + 1) % focusable.length]
          next.focus()
        }}
        onClick={(event) => {
          const dialog = event.currentTarget
          // Only the backdrop can produce a click whose target is the dialog
          // itself; a rect check keeps clicks inside its padding from closing.
          if (event.target !== dialog) return
          const rect = dialog.getBoundingClientRect()
          const outside =
            event.clientX < rect.left || event.clientX > rect.right ||
            event.clientY < rect.top || event.clientY > rect.bottom
          if (outside) requestClose()
        }}
      >
        {active ? (
          <div className="team-dialog__inner">
            <button
              type="button"
              className="team-dialog__close"
              aria-label={`Close ${active.name}'s profile`}
              onClick={requestClose}
            >
              <X className="size-4" strokeWidth={2.2} aria-hidden="true" />
            </button>
            <div className="team-dialog__grid">
              <img className="team-dialog__photo" src={active.photo} alt={`Portrait of ${active.name}`} />
              <div>
                <h2 id="team-profile-name" className="team-dialog__name">{active.name}</h2>
                <dl className="team-dialog__meta">
                  <div>
                    <dt>Position</dt>
                    <dd>{active.role}</dd>
                  </div>
                  <div>
                    <dt>Work area</dt>
                    <dd>{active.section}</dd>
                  </div>
                </dl>
                <p id="team-profile-bio" className="team-dialog__bio">{active.bio}</p>
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}
