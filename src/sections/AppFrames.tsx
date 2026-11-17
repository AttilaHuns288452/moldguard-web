import { useState } from 'react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { FRAMES } from '../figma/PhoneFrames'

/**
 * The app, as designed in the Figma frames. Rendered at the file's own 390x844,
 * scaled down rather than re-laid-out, so the frames stay faithful.
 */
export default function AppFrames() {
  const [active, setActive] = useState(0)
  const Frame = FRAMES[active].el

  return (
    <section id="app" className="section section-alt">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_auto] lg:items-center lg:gap-16">
          <div>
            <LineReveal
              lines={splitTitle('The loop, in your pocket.')}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3">
                Live risk per room, the readings behind it, trend history, and the automation rule
                that is running right now. Every screen below is the shipped design.
              </p>
            </Reveal>

            <div className="mt-7 flex flex-wrap gap-1.5">
              {FRAMES.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`rounded-tight border px-3.5 py-2 text-[13px] transition-colors ${
                    active === i
                      ? 'border-accent-ink bg-[#3f51b50f] font-[650] text-deep'
                      : 'border-line text-ink-2 hover:border-line-hi hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <p className="mt-5 max-w-[46ch] text-[12.5px] leading-relaxed text-ink-3">
              Illustrative demo data from the design frames. Deck values: 31°C · 82% RH, risk 88%,
              tank 82%, HiveMQ 38 ms.
            </p>
          </div>

          {/* the frame, at its native 390x844, scaled */}
          <Reveal delay={110}>
            <div className="mx-auto lg:mx-0">
              {/* zoom scales LAYOUT (transform does not), so the frame keeps its
                  native 390x844 proportions inside a smaller box */}
              <div
                className="overflow-hidden rounded-[28px] border border-line-hi bg-white shadow-[0_40px_80px_-40px_rgba(20,32,60,.45)]"
                style={{ width: 390 * 0.82, height: 844 * 0.82, zoom: 0.82 } as React.CSSProperties}
              >
                <Frame />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
