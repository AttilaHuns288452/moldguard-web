import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { WHAT_IT_DOES, ALERTS, AUTOMATIONS } from '../content'

/**
 * PDF page 2: "What MoldGuard does for you." The three capability blocks with
 * their real diagrams — the automatic loop, the sensor readout, and analytics.
 */
export default function WhatItDoes({ asHeading = 'h2' }: { asHeading?: 'h1' | 'h2' }) {
  // sub-block headings must sit one level under whatever the section renders,
  // or the outline flattens into a wall of same-level headings
  const Sub = asHeading === 'h1' ? 'h2' : 'h3'
  const { title, lede, auto, sensors, analytics } = WHAT_IT_DOES

  return (
    <section id="what" className="section band-white">
      <div className="shell">
        <div className="max-w-[720px]">
          <LineReveal
            as={asHeading}
            lines={splitTitle(title)}
            className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="lede mt-3 max-w-[60ch]">{lede}</p>
          </Reveal>
        </div>

        {/* 1. automatic dehumidification + its three-step loop */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
          <Reveal>
            <div>
              <p className="text-[11px] font-[650] tracking-[0.14em] text-accent uppercase">{auto.eyebrow}</p>
              <Sub className="mt-2 text-[1.5rem] font-[650] text-deep">{auto.title}</Sub>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{auto.body}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ol className="grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-3">
              {auto.diagram.map((d, i) => (
                <li key={d.a} className="bg-card px-4 py-4">
                  <span className="measure text-[11px] text-ink-3">0{i + 1}</span>
                  <p className="mt-1.5 text-[13px] font-[650] text-deep">{d.b}</p>
                  <p className="mt-0.5 measure text-[12px] text-ink-2">{d.a}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* 2. sensors + live readout */}
        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center">
          <Reveal>
            <div>
              <p className="text-[11px] font-[650] tracking-[0.14em] text-accent uppercase">{sensors.eyebrow}</p>
              <Sub className="mt-2 text-[1.5rem] font-[650] text-deep">{sensors.title}</Sub>
              <p className="mt-2.5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2">{sensors.body}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card-lift rounded-soft border border-line bg-card p-4">
              <p className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">{sensors.pod}</p>
              <dl className="mt-2 divide-y divide-line">
                {sensors.readings.map((r) => (
                  <div key={r.k} className="flex items-baseline justify-between py-2">
                    <dt className="text-[13px] text-ink-2">{r.k}</dt>
                    <dd className="measure text-[15px] font-[650] text-deep">{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* 3. analytics */}
        <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center">
          <Reveal>
            <div>
              <p className="text-[11px] font-[650] tracking-[0.14em] text-accent uppercase">{analytics.eyebrow}</p>
              <Sub className="mt-2 text-[1.5rem] font-[650] text-deep">{analytics.title}</Sub>
              <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{analytics.body}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card-lift rounded-soft border border-line bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-[650] text-ink-3 uppercase">{analytics.sample}</span>
                <div className="flex gap-1">
                  {analytics.ranges.map((r, i) => (
                    <span key={r} className={`rounded-tight px-2 py-0.5 text-[11.5px] transition-colors ${i === 2 ? 'bg-[#2563eb0f] font-[650] text-deep' : 'text-ink-3'}`}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 320 84" className="mt-3 h-20 w-full" role="img" aria-label="Illustrative humidity and dew-point trend over 30 days">
                <polyline points="0,58 40,50 80,44 120,26 160,38 200,54 240,62 280,60 320,58" fill="none" stroke="#15385e" strokeWidth="2" />
                <polyline points="0,66 40,62 80,58 120,50 160,56 200,64 240,68 280,66 320,64" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeDasharray="4 3" />
              </svg>
              <p className="mt-1 text-[11.5px] text-ink-3">Illustrative demo data.</p>
            </div>
          </Reveal>
        </div>

        {/* 4 + 5: alerts and automations, PDF page 2 */}
        <div className="mt-12 grid gap-6 border-t border-line pt-10 md:grid-cols-2">
          <Reveal>
            <div className="card-lift h-full rounded-soft border border-line bg-card p-6">
              <p className="text-[11px] font-[650] tracking-[0.14em] text-accent uppercase">{ALERTS.eyebrow}</p>
              <Sub className="mt-2 text-[1.25rem] font-[650] text-deep">{ALERTS.title}</Sub>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{ALERTS.body}</p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="card-lift h-full rounded-soft border border-line bg-card p-6">
              <p className="text-[11px] font-[650] tracking-[0.14em] text-accent uppercase">{AUTOMATIONS.eyebrow}</p>
              <Sub className="mt-2 text-[1.25rem] font-[650] text-deep">{AUTOMATIONS.title}</Sub>
              <p className="mt-2 max-w-[62ch] text-[14px] leading-relaxed text-ink-2">{AUTOMATIONS.body}</p>
              {/* mono is thin: 12.5px deep-on-paper-deep measured 3.02:1. 13px + font-medium
                clears AA without touching the palette. */}
              <p className="measure mt-3 rounded-tight border border-line-hi bg-paper-deep/50 px-3 py-2 text-[13px] font-medium text-deep">
                {AUTOMATIONS.rule}
              </p>
              <p className="mt-2 text-[11.5px] text-ink-3">{AUTOMATIONS.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
