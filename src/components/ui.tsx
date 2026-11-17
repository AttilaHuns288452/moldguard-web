import { useEffect, useRef, type ReactNode } from 'react'
import { useInView, prefersReducedMotion } from '../lib/motion'

/** Viewport-driven reveal. Never mount-driven: content below the fold would
 *  otherwise animate off-screen and read as an abrupt pop. */
export function Reveal({
  children, delay = 0, className = '', as: Tag = 'div',
}: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
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
  return (
    <Tag ref={ref} className={`lines ${inView ? 'is-in' : ''} ${className}`} style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {lines.map((l, i) => (
        <span className="line" key={l}>
          <span style={{ '--i': i } as React.CSSProperties}>{l}</span>
          {/* keeps the accessible name word-separated: spans concatenate with no space */}
          <span className="sr-only"> </span>
        </span>
      ))}
    </Tag>
  )
}

/** Magnetic CTA: physical press, travelling icon in its own circular island. */
export function MagButton({
  href, children, variant = 'solid', icon,
}: { href: string; children: ReactNode; variant?: 'solid' | 'ghost'; icon?: ReactNode }) {
  const cls =
    variant === 'solid'
      ? 'bg-accent-ink text-white hover:bg-deep hover:shadow-[0_10px_30px_-12px_rgba(30,54,128,.5)]'
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
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let last = 0
    const paint = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0
      el.style.setProperty('--p', String(p))
    }
    const onScroll = () => {
      const now = performance.now()
      if (now - last < 60) return      // ponytail: ~16Hz is plenty for a hairline
      last = now
      paint()
    }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', paint, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', paint) }
  }, [])
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
