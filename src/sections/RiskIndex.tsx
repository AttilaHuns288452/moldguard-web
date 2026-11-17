import { useEffect, useRef, useState } from 'react'
import { RISK_FACTORS } from '../content'
import { Reveal, SectionHead, DemoTag } from '../components/ui'
import { useInView, prefersReducedMotion } from '../lib/motion'

const BANDS = [
  { name: 'Safe', range: '0 – 40', note: 'Conditions stay below the mold window.' },
  { name: 'Watch', range: '40 – 70', note: 'Trend is building; the loop keeps scoring.' },
  { name: 'Act', range: '70 – 100', note: 'Threshold crossed. Dehumidifier runs.' },
]

/** Illustrative 24h humidity trace. Hand-authored, not a device recording. */
const TRACE = [54, 57, 61, 66, 71, 76, 73, 68, 64, 66, 70, 74, 78, 82, 79, 74, 70, 67, 64, 62, 60, 58, 56, 55]

export default function RiskIndex() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const [idx, setIdx] = useState(prefersReducedMotion() ? 82 : 0)
  const raf = useRef(0)

  // Count the index up once it is actually on screen.
  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) { setIdx(82); return }
    const start = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setIdx(82 * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [inView])

  const band = idx < 40 ? 0 : idx < 70 ? 1 : 2
  // Severity is carried by type weight and background intensity, never a lamp.
  const accent = ['#465e7a', '#5c7392', '#1d4ed8'][band]

  const W = 620, H = 132
  const pts = TRACE.map((v, i) => [
    (i / (TRACE.length - 1)) * W,
    H - ((v - 45) / (90 - 45)) * H,
  ])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`

  return (
    <section id="risk" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(80% 60% at 82% 20%, #eaf2fc 0%, transparent 60%)' }}
      />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <SectionHead
            index="03"
            label="The Mold Risk Index"
            title={
              <>
                A score that knows
                <br />
                how long it has been
                <br />
                <span className="text-ink-3">that way.</span>
              </>
            }
            lead="The index combines humidity, temperature, and sustained exposure duration, with a virtual surface dew-point calculation. That is what lets it predict the window where mold can start, instead of reacting after a threshold trips."
          />

          <div ref={ref}>
            <Reveal>
              <div className="panel-raised overflow-hidden">
                {/* header strip */}
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
                  <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                    Closet &middot; illustrative
                  </span>
                  <DemoTag />
                </div>

                {/* live dial + band table */}
                <div className="grid gap-6 px-5 py-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
                  <IndexGauge value={idx} accent={accent} band={BANDS[band].name} />
                  <div>
                    <dl className="divide-y divide-line/80">
                      {BANDS.map((b, i) => (
                        <div
                          key={b.name}
                          className={`flex items-baseline justify-between gap-3 py-2.5 ${
                            i === band ? 'opacity-100' : 'opacity-55'
                          }`}
                        >
                          <dt className="flex items-center gap-2.5">
                            <span
                              className="size-1.5 rounded-full"
                              style={{ background: ['#d7e3f2', '#cbd9eb', '#1d4ed8'][i] }}
                              aria-hidden="true"
                            />
                            <span className="text-[0.875rem] text-ink-2">{b.name}</span>
                            <span className="font-mono text-[0.625rem] text-ink-3">{b.range}</span>
                          </dt>
                          <dd className="hidden text-right text-[0.6875rem] text-ink-3 sm:block">{b.note}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-4 border-l border-line-hi pl-4 text-[0.8125rem] leading-relaxed text-ink-2">
                      At <span className="font-mono text-ink">82</span>, the closet has held 78–82%
                      RH for 26 hours. The loop has already switched the dehumidifier on.
                    </p>
                  </div>
                </div>

                {/* trace */}
                <div className="border-t border-line px-5 pb-5 pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                      Relative humidity &middot; 24 h
                    </span>
                    <span className="font-mono text-[0.5625rem] text-ink-3">threshold 70</span>
                  </div>
                  <svg
                    viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" role="img"
                    aria-label="Illustrative relative humidity trace over 24 hours, rising above the risk threshold in the afternoon."
                  >
                    <defs>
                      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={accent} stopOpacity=".22" />
                        <stop offset="100%" stopColor={accent} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* threshold line at 70% -> y */}
                    <line
                      x1="0" x2={W} y1={H - ((70 - 45) / 45) * H} y2={H - ((70 - 45) / 45) * H}
                      stroke="#465e7a" strokeOpacity=".35" strokeDasharray="3 5" strokeWidth="1"
                    />
                    <path d={area} fill="url(#rg)" />
                    <path
                      d={line} fill="none" stroke={accent} strokeWidth="1.75" strokeLinecap="round"
                      style={{
                        // draw-on when in view
                        strokeDasharray: 1200,
                        strokeDashoffset: inView ? 0 : 1200,
                        transition: 'stroke-dashoffset 1.6s cubic-bezier(.22,1,.36,1)',
                      }}
                    />
                    {pts.filter((_, i) => i === 13).map(([x, y]) => (
                      <g key="peak">
                        <circle cx={x} cy={y} r="3.2" fill={accent} />
                        <circle cx={x} cy={y} r="7" fill="none" stroke={accent} strokeOpacity=".4" />
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            </Reveal>

            {/* what the index reads */}
            <Reveal delay={140}>
              <ul className="mt-6 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2">
                {RISK_FACTORS.map((f) => (
                  <li key={f.label} className="bg-card px-4 py-3.5">
                    <p className="text-[0.875rem] text-ink-2">{f.label}</p>
                    <p className="mt-0.5 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{f.note}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function IndexGauge({ value, accent, band }: { value: number; accent: string; band: string }) {
  const size = 168, r = size / 2 - 14
  const c = 2 * Math.PI * r
  // 240-degree sweep, instrument style
  const sweep = c * 0.66
  const filled = (value / 100) * sweep
  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <g transform={`rotate(150 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d7e3f2"
            strokeWidth="3" strokeDasharray={`${sweep} ${c}`}
          />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent}
            strokeWidth="3.5" strokeDasharray={`${filled} ${c}`} strokeLinecap="round"
            style={{ transition: 'stroke-dasharray .1s linear, stroke .4s' }}
          />
        </g>
        {[0, 25, 50, 75, 100].map((t) => {
          const a = ((150 + (t / 100) * 240) * Math.PI) / 180
          const x1 = size / 2 + Math.cos(a) * (r - 8)
          const y1 = size / 2 + Math.sin(a) * (r - 8)
          const x2 = size / 2 + Math.cos(a) * (r - 3)
          const y2 = size / 2 + Math.sin(a) * (r - 3)
          return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cbd9eb" strokeWidth="1" />
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-[2.5rem] leading-none tracking-tight"
          style={{ color: accent }}
        >
          {Math.round(value)}
        </span>
        <span className="mt-1 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{band}</span>
      </div>
    </div>
  )
}
