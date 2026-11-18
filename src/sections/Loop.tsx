import { useState } from 'react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { LOOP, SETUP } from '../content'

/**
 * PDF page 3: the closed loop. A rail of four stages (SENSE → ANALYZE →
 * RESPOND → PROTECT); selecting one shows its own copy. The rail is the
 * architecture, the panel is the explanation.
 */
export default function Loop() {
  const [i, setI] = useState(0)

  return (
    <section id="how" className="section section-alt">
      <div className="shell">
        <div className="max-w-[760px]">
          <LineReveal
            lines={splitTitle(LOOP.title)}
            className="max-w-[26ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="mt-3 max-w-[62ch] text-[1rem] leading-relaxed text-ink-2">{LOOP.lede}</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-[12.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">{LOOP.label}</p>
          </Reveal>
        </div>

        {/* the rail */}
        <div className="mt-5 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.rail.map((r, n) => {
            const on = i === n
            return (
              <Reveal key={r.n} delay={n * 50}>
                <button
                  type="button"
                  onClick={() => setI(n)}
                  aria-pressed={on}
                  className={`relative h-full w-full px-5 py-4 text-left transition-colors ${
                    on ? 'bg-card' : 'bg-paper-deep/40 hover:bg-card'
                  }`}
                >
                  <span
                    className={`absolute inset-x-0 top-0 h-[2px] transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: 'linear-gradient(90deg,transparent,#2563eb,transparent)' }}
                    aria-hidden="true"
                  />
                  <span className="measure text-[11px] text-ink-3">{r.n}</span>
                  <span className={`mt-1 block text-[15px] font-[650] ${on ? 'text-deep' : 'text-ink-2'}`}>
                    {r.name}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-3">{r.meta}</span>
                </button>
              </Reveal>
            )
          })}
        </div>

        {/* all four stages, stacked as the PDF lays them out */}
        <ol className="mt-5 divide-y divide-line overflow-hidden rounded-soft border border-line bg-card">
          {LOOP.stages.map((stg, n) => (
            <li key={stg.n}>
              <Reveal delay={n * 50}>
                <div
                  className={`grid gap-5 px-6 py-5 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8 md:px-8 md:py-6 ${
                    i === n ? 'bg-[#2563eb07]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 md:w-24 md:flex-col md:gap-1.5">
                    <span className="measure text-[12px] tracking-[0.14em] text-accent">{stg.n}</span>
                    <span className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{stg.kicker}</span>
                  </div>
                  <div>
                    <h3 className="text-[clamp(1.125rem,2vw,1.375rem)] font-[650] text-deep">{stg.head}</h3>
                    <p className="mt-2 max-w-[68ch] text-[14.5px] leading-relaxed text-ink-2">{stg.body}</p>
                    <p className="mt-2.5 text-[12.5px] text-ink-3">{stg.meta}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* PDF page 3: setup */}
        <div className="mt-14 border-t border-line pt-10">
          <Reveal>
            <h3 className="max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">{SETUP.title}</h3>
          </Reveal>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-soft border border-line bg-line md:grid-cols-3">
            {SETUP.steps.map((s, n) => (
              <Reveal as="li" key={s.n} delay={n * 60}>
                <div className="h-full bg-card px-5 py-5">
                  <span className="measure text-[11px] tracking-[0.14em] text-accent">0{s.n}</span>
                  <h4 className="mt-1.5 text-[15px] font-[650] text-deep">{s.title}</h4>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={120}>
            <p className="mt-4 text-[12.5px] text-ink-3">{SETUP.caption}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
