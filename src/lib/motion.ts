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

    // Safety net. IntersectionObserver only reports CHANGES while it is observing:
    // if the main thread is saturated, a fast scroll can step past an element
    // between two IO callbacks, and IO then reports it as never-intersecting. The
    // reveal CSS starts at opacity 0, so that element is permanently invisible —
    // to sighted users AND to screen readers. Measured: 4 of 21 blocks stranded on
    // / while the QA suite competed for CPU, 0 when idle.
    //
    // Scroll events are not enough (they coalesce or are dropped under load), so
    // poll geometry on a timer for a few seconds and stop as soon as it fires.
    // "At or above the fold" includes elements we have already scrolled PAST
    // (bottom < 0), which is exactly the case a dropped IO callback leaves behind.
    const check = () => {
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 1.2 || r.bottom < 0) {
        setInView(true)
        return true
      }
      return false
    }
    let ticks = 0
    const timer = window.setInterval(() => {
      ticks += 1
      if (check() || ticks > 20) window.clearInterval(timer)   // ~4s at 200ms
    }, 200)
    // Belt and braces: scroll fires far more often than the timer, so a block the
    // user scrolls past is caught on the way past rather than up to 200ms later.
    // Unconditional (no `once`) — the removed listener was the whole bug.
    const onScroll = () => { if (check()) window.removeEventListener('scroll', onScroll) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.clearInterval(timer); window.removeEventListener('scroll', onScroll); io.disconnect() }
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
