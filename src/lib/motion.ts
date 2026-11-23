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
    // One reveal, then nothing: the observer, the timer and the scroll listener
    // all detach. Cleanup is idempotent, so the unmount path still works.
    let done = false
    let timer = 0
    let io: IntersectionObserver | null = null
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onPreference = () => { if (mq.matches) reveal() }
    const stop = () => {
      if (timer) window.clearInterval(timer)
      window.removeEventListener('scroll', onScroll)
      mq.removeEventListener('change', onPreference)
      io?.disconnect()
    }
    const reveal = () => {
      if (done) return
      done = true
      setInView(true)
      stop()
    }
    io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && reveal()),
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
      // A display:none node reports a 0,0,0,0 rect, which would read as "at the
      // fold" and burn the entrance while the node is invisible (a closed tab
      // panel). No client rects -> not laid out -> not revealable yet.
      if (!el.getClientRects().length) return false
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 1.2 || r.bottom < 0) {
        reveal()
        return true
      }
      return false
    }
    let ticks = 0
    timer = window.setInterval(() => {
      ticks += 1
      if (check() || ticks > 20) window.clearInterval(timer)   // ~4s at 200ms
    }, 200)
    // Belt and braces: scroll fires far more often than the timer, so a block the
    // user scrolls past is caught on the way past rather than up to 200ms later.
    // Unconditional (no `once`) — the removed listener was the whole bug.
    const onScroll = () => { check() }
    window.addEventListener('scroll', onScroll, { passive: true })
    mq.addEventListener('change', onPreference)
    return stop
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
  // An explicit pipe marks a deliberate break. Without it the character-count
  // heuristic can split mid-phrase ("See what takes / care of the room").
  if (title.includes('|')) return title.split('|').map((s) => s.trim()).filter(Boolean)
  const parts = title.split(/(?<=\.)\s+/).filter(Boolean)
  if (parts.length > 1) return parts
  if (title.length < 26) return [title]
  const mid = Math.floor(title.lastIndexOf(' ', title.length * 0.58))
  return mid > 8 ? [title.slice(0, mid), title.slice(mid + 1)] : [title]
}

/**
 * Mount-presence for an enter/exit pair. `mounted` keeps the node rendered while
 * the exit plays; `closing` is the exit state. Reduced motion unmounts on the
 * next commit — no timer, no stranded timer if the user flips the preference.
 */
export function usePresence(open: boolean, duration = 190) {
  const [mounted, setMounted] = useState(open)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (open) { setMounted(true); return }
    if (reduced || !mounted) { setMounted(false); return }
    const timer = window.setTimeout(() => setMounted(false), duration)
    return () => window.clearTimeout(timer)
  }, [open, mounted, reduced, duration])
  // Derived in render, not just in the effect: under reduced motion the exit is
  // immediate, with no commit that paints a fully-visible "closing" panel.
  return { mounted: open || (mounted && !reduced), closing: !open && mounted && !reduced }
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
