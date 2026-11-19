import { useEffect, useRef, useState } from 'react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { RISK_SCENARIOS } from '../content'

/**
 * The Mold Risk Index, given its own identity. A data-dense composition in the
 * existing palette: a gauge, the four inputs, and a switchable scenario so a
 * visitor can see how the score moves. Every number is labelled illustrative.
 */
export default function RiskShowcase() {
  const [i, setI] = useState(0)
  const sc = RISK_SCENARIOS[i]
  const [shown, setShown] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const from = shown
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 700)
      setShown(from + (sc.index - from) * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [sc.index])

  const accent = shown >= 70 ? '#1d4ed8' : shown >= 40 ? '#5b7591' : '#465e7a'
  const R = 78, SWEEP = 250, C = 2 * Math.PI * R

  return (
    <section id="risk" className="section band-white">
      <div className="shell">
        <div className="grid gap-9 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
          <div>
            <LineReveal
              lines={splitTitle('One number, built from four.')}
              className="max-w-[22ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3">
                The Mold Risk Index is not a humidity reading with a new name. It is scored from
                humidity, temperature, how long those conditions persist, and the margin to the
                dew point.
              </p>
            </Reveal>
            <Reveal delay={130}>
              <div className="mt-6 flex flex-wrap gap-1.5">
                {RISK_SCENARIOS.map((s, n) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setI(n)}
                    aria-pressed={i === n}
                    className={`rounded-tight border px-3 py-1.5 text-[12.5px] transition-colors ${
                      i === n ? 'border-accent-ink bg-[#2563eb0f] font-[650] text-deep' : 'border-line text-ink-2 hover:border-line-hi'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={190}>
              <p className="mt-5 max-w-[46ch] text-[13px] leading-relaxed text-ink-3">{sc.note}</p>
            </Reveal>
          </div>

          <Reveal delay={100}>
            <div className="rounded-shell border border-line bg-card p-6 shadow-[0_1px_2px_rgba(21,56,94,.05),0_18px_40px_-28px_rgba(21,56,94,.35)]">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Mold Risk Index</span>
                <span className="rounded-full border border-ink-3/30 bg-ink-3/[0.07] px-2 py-0.5 text-[11.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
                  Illustrative
                </span>
              </div>

              <div className="mt-4 grid items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
                {/* gauge */}
                <svg width={168} height={168} viewBox="0 0 168 168" aria-hidden="true" className="shrink-0">
                  <g transform="rotate(145 84 84)">
                    <circle cx={84} cy={84} r={R} fill="none" stroke="#d7e3f2" strokeWidth={9}
                      strokeDasharray={`${(SWEEP / 360) * C} ${C}`} />
                    <circle cx={84} cy={84} r={R} fill="none" stroke={accent} strokeWidth={9} strokeLinecap="round"
                      strokeDasharray={`${(SWEEP / 360) * C * (shown / 100)} ${C}`} />
                  </g>
                  <text x={84} y={78} textAnchor="middle" fontSize={36} fontWeight={700} fill={accent}
                    fontFamily="Spline Sans Mono, monospace">{Math.round(shown)}</text>
                  <text x={84} y={92} textAnchor="middle" fontSize={9} fill="#5b7591">of 100</text>
                  <text x={84} y={102} textAnchor="middle" fontSize={10} fill="#5b7591"
                    letterSpacing="1.6">{sc.band.toUpperCase()}</text>
                  {/* threshold marker at 70 — the point the loop acts */}
                  {(() => {
                    const a = ((145 + (70 / 100) * SWEEP) * Math.PI) / 180
                    return <line x1={84 + Math.cos(a) * (R - 15)} y1={84 + Math.sin(a) * (R - 15)}
                      x2={84 + Math.cos(a) * (R + 8)} y2={84 + Math.sin(a) * (R + 8)}
                      stroke="#1d4ed8" strokeWidth={2} />
                  })()}
                </svg>

                {/* the four inputs */}
                <ul className="space-y-2.5">
                  {[
                    ['Humidity', sc.rh, 100, '%RH'],
                    ['Temperature', sc.temp, 40, '°C'],
                    ['Sustained exposure', sc.hours, 48, 'h'],
                    ['Dew-point margin', sc.dew, 6, '°C'],
                  ].map(([label, v, max, unit]) => {
                    const num = v as number
                    // A negative dew-point margin means surfaces are ALREADY below
                    // the dew point, i.e. condensation is forming - the worst state,
                    // not zero risk. The old expression divided straight through, so
                    // -0.4/6 produced a negative width and the bar painted full by
                    // accident, which happened to look right for the wrong reason.
                    // Now it is explicit, and the row says why.
                    const belowDew = label === 'Dew-point margin' && num < 0
                    const pct = belowDew ? 100 : Math.max(0, Math.min(100, (num / (max as number)) * 100))
                    return (
                      <li key={label as string}>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11.5px] text-ink-2">{label}</span>
                          <span className={`measure text-[11.5px] font-[650] ${belowDew ? 'text-[#bf2d2a]' : 'text-deep'}`}>
                            {v}<span className="ml-0.5 text-[11.5px] text-ink-3">{unit}</span>
                          </span>
                        </div>
                        <div className="mt-1 h-[3px] w-full rounded-full bg-line">
                          <div className={`h-[3px] rounded-full transition-[width] duration-700 ${belowDew ? 'bg-[#bf2d2a]' : 'bg-accent-ink'}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        {belowDew && (
                          <p className="mt-1 text-[11px] leading-snug text-[#bf2d2a]">Below dew point — condensing</p>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                <span className="text-[11.5px] text-ink-3">{sc.room}</span>
                <span className="measure text-[11.5px] text-ink-3">{sc.hours}h sustained</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[11.5px] text-ink-3">
                {[['Safe', 0, 40], ['Watch', 40, 70], ['Act', 70, 100]].map(([n, lo, hi]) => (
                  <span key={n as string} className="flex items-center gap-1.5">
                    <span className="h-[3px] w-4 rounded-full" style={{ background: n === 'Act' ? '#1d4ed8' : n === 'Watch' ? '#5b7591' : '#465e7a' }} />
                    {n} <span className="measure opacity-70">{lo}–{hi}</span>
                  </span>
                ))}
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="h-2.5 w-px bg-accent-ink" /> acts at 70
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
