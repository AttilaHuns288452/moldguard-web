import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useInView, useReducedMotion } from '../lib/motion'

/** Viewport-driven reveal. Never mount-driven: content below the fold would
 *  otherwise animate off-screen and read as an abrupt pop. */
export function Reveal({
  children, delay = 0, className = '', as: Tag = 'div',
}: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const [focused, setFocused] = useState(false)
  return (
    <Tag
      ref={ref as never}
      // A control inside an un-revealed block is still tabbable (opacity keeps it
      // in the tab order by design), so keyboard focus must reveal it — otherwise
      // Tab lands on a control the user cannot see. onFocus bubbles in React.
      onFocus={() => setFocused(true)}
      className={`reveal ${inView || focused ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Line-by-line mask lift for headings. Pass each line as its own string. */
export function LineReveal({
  lines, className = '', delay = 0, as: Tag = 'h2',
}: { lines: string[]; className?: string; delay?: number; as?: 'h1' | 'h2' }) {
  const [ref, inView] = useInView<HTMLHeadingElement>()
  // The visual lines live in spans that are visibility:hidden until they animate
  // in. That is fine for sighted users and fatal for screen readers: an
  // un-scrolled heading is reported as EMPTY (axe: "empty-heading"), because
  // hidden text contributes no accessible name. So the heading carries the real
  // name in aria-label and the animated spans are hidden from the a11y tree.
  const label = lines.join(' ')
  return (
    <Tag
      ref={ref}
      aria-label={label}
      className={`lines ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {lines.map((l, i) => (
        <span className="line" key={l} aria-hidden="true">
          <span style={{ '--i': i } as React.CSSProperties}>{l}</span>
        </span>
      ))}
    </Tag>
  )
}

/** Semicircle risk gauge. The arc fills from 0 to `value` (percent of the arc)
 *  when the gauge scrolls into view — viewport-driven like every other entrance
 *  on the page, so it does not burn its one animation off-screen.
 *
 *  pathLength=100 lets the CSS express the target as a percentage of the arc
 *  (see .gauge-arc) instead of every caller hardcoding pi*r. */
export function Gauge({ value, className = 'block w-full' }: { value: number; className?: string }) {
  const [ref, inView] = useInView<SVGSVGElement>()
  const to = Math.max(0, Math.min(100, value))
  const d = 'M8 52a40 40 0 0 1 80 0'
  return (
    <svg ref={ref} viewBox="0 0 96 56" className={className} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--color-line)" strokeWidth="7" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="var(--color-accent-ink)"
        strokeWidth="7"
        strokeLinecap="round"
        pathLength={100}
        className={`gauge-arc ${inView ? 'is-in' : ''}`}
        style={{ '--to': to } as React.CSSProperties}
      />
    </svg>
  )
}

/** Staggered sequence: each direct child enters after the previous one.
 *  One IntersectionObserver for the whole group — a per-row Reveal would spawn
 *  N observers, and a <tr> cannot be wrapped in the <div> a Reveal renders, so
 *  the group itself can be a tbody/ul.
 *  The child index is read by :nth-child in app.css, so no call site passes it. */
export function Seq({
  children, className = '', delay = 0, as: Tag = 'div',
}: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'tbody' | 'ul' }) {
  const [ref, inView] = useInView<HTMLElement>()
  const [focused, setFocused] = useState(false)
  return (
    <Tag
      ref={ref as never}
      onFocus={() => setFocused(true)}   // same contract as Reveal: focus reveals
      className={`seq ${inView || focused ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Magnetic CTA: physical press, travelling icon in its own circular island. */
export function MagButton({
  href, children, variant = 'solid', icon,
}: { href: string; children: ReactNode; variant?: 'solid' | 'ghost'; icon?: ReactNode }) {
  const cls =
    variant === 'solid'
      ? 'bg-accent-ink text-white hover:bg-deep hover:shadow-e2'
      : 'bg-card text-ink border border-[#b9cde4] hover:border-ink-2 hover:bg-[#f7fbff]'
  return (
    <a href={href} className={`btn-mag ${cls}`}>
      {children}
      {icon && (
        <span className={`ico ${variant === 'solid' ? 'bg-white/15' : 'bg-[#2b2b2b0a]'}`} aria-hidden="true">
          {icon}
        </span>
      )}
    </a>
  )
}

/** Scroll progress hairline — the single scroll-linked indicator on the page. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) { el.style.setProperty('--p', '0'); return }
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      el.style.setProperty('--p', String(p))
    }
    // One write per frame, coalesced: the old 16Hz throttle stepped the hairline
    // in visible 60ms jumps. rAF keeps it in step with the compositor and still
    // costs at most one style write per frame. A pending frame is cancelled on
    // unmount, a route change (new document height) and a resize.
    let frame = 0
    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(() => { frame = 0; paint() })
    }
    const cancel = () => { if (frame) cancelAnimationFrame(frame); frame = 0 }
    // A route change swaps the document height and scrolls to top AFTER the
    // event, so repaint on the next frame — measuring synchronously here would
    // read the outgoing page's scroll position.
    const onRoute = () => { cancel(); schedule() }
    paint()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    window.addEventListener('routechange', onRoute)
    window.addEventListener('popstate', onRoute)
    return () => {
      cancel()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      window.removeEventListener('routechange', onRoute)
      window.removeEventListener('popstate', onRoute)
    }
  }, [reduced])
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
