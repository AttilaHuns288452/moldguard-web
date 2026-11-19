/** Viewport-driven entrances.
 *  Bound to viewport entry, never mount time: anything below the fold would
 *  otherwise animate off-screen and read as an abrupt pop when scrolled to. */
import { useEffect, useRef, useState } from 'react'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useInView<T extends Element>(margin = '0px 0px 18% 0px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { setInView(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: margin, threshold: 0.01 },
    )
    io.observe(el)

    // Safety net: IntersectionObserver fires for elements ABOVE the viewport too,
    // but a fast scroll (or an element already scrolled past before this effect
    // attached) can leave one unobserved. The reveal CSS sets visibility:hidden,
    // so an unobserved element is permanently invisible - to sighted users AND to
    // screen readers, which then report an empty heading. Reveal anything that is
    // already at or above the fold shortly after mount.
    const revealIfNear = () => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 1.2) setInView(true)
    }
    const t = window.setTimeout(revealIfNear, 1200)
    // and once more on any scroll, so dragging the scrollbar fast cannot strand
    // an element mid-page in the invisible state
    window.addEventListener('scroll', revealIfNear, { passive: true, once: true })
    return () => { window.clearTimeout(t); window.removeEventListener('scroll', revealIfNear); io.disconnect() }
  }, [margin])
  return [ref, inView] as const
}

/** Height of the fixed header, for scroll-spy offsets. */
export const HEADER_H = 68

export function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

/** Split a headline into reveal lines. Breaks after a period, or mid-string at
 *  the last space so long single-sentence headlines still lift in two beats. */
export function splitTitle(title: string): string[] {
  const parts = title.split(/(?<=\.)\s+/).filter(Boolean)
  if (parts.length > 1) return parts
  if (title.length < 26) return [title]
  const mid = Math.floor(title.lastIndexOf(' ', title.length * 0.58))
  return mid > 8 ? [title.slice(0, mid), title.slice(mid + 1)] : [title]
}

/**
 * Live `prefers-reduced-motion` subscription. Reading the media query once at
 * mount is wrong: the user can flip the OS setting while the page is open, and a
 * model that keeps spinning after they asked it to stop is a real accessibility
 * failure, not a cosmetic one.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => prefersReducedMotion())
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}
