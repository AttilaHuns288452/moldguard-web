/** Viewport-driven entrances.
 *  Bound to viewport entry, never mount time: anything below the fold would
 *  otherwise animate off-screen and read as an abrupt pop when scrolled to. */
import { useEffect, useRef, useState } from 'react'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useInView<T extends Element>(margin = '-12% 0px -8% 0px') {
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
    return () => io.disconnect()
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
