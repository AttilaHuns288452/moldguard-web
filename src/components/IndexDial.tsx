import { useEffect, useRef, useState } from 'react'
import { useInView, prefersReducedMotion } from '../lib/motion'

/** Mold Risk Index dial. Illustrative value, labelled as such in the section copy. */
export function IndexDial({ value = 38 }: { value?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const [v, setV] = useState(prefersReducedMotion() ? value : 0)
  const raf = useRef(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) { setV(value); return }
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200)
      setV(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, value])

  const size = 176, r = size / 2 - 14, sweepDeg = 240
  const c = 2 * Math.PI * r
  const arc = (sweepDeg / 360) * c
  const filled = (v / 100) * arc

  return (
    <div ref={ref} className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g transform={`rotate(150 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e3ded6" strokeWidth="3" strokeDasharray={`${arc} ${c}`} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#3f51b5" strokeWidth="3.5"
            strokeDasharray={`${filled} ${c}`} strokeLinecap="round" className="dial-fill"
          />
        </g>
        {[0, 25, 50, 75, 100].map((t) => {
          const a = ((150 + (t / 100) * sweepDeg) * Math.PI) / 180
          return (
            <line
              key={t}
              x1={size / 2 + Math.cos(a) * (r - 8)} y1={size / 2 + Math.sin(a) * (r - 8)}
              x2={size / 2 + Math.cos(a) * (r - 3)} y2={size / 2 + Math.sin(a) * (r - 3)}
              stroke="#ccc5ba" strokeWidth="1"
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="measure text-[2.375rem] leading-none font-semibold text-deep">{Math.round(v)}</span>
        <span className="mt-1 text-[0.625rem] tracking-[0.14em] text-ink-3 uppercase">low risk</span>
      </div>
    </div>
  )
}
