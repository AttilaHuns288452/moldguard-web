import { ArrowRight, BellRing, Droplets, Thermometer } from 'lucide-react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { WHAT_IT_DOES, ALERTS, AUTOMATIONS } from '../content'
import '../styles/features-page.css'

/**
 * PDF page 2 evidence rows. One index/category spine on the left, the claim in
 * the middle, the instrument on the right — so the four capabilities read as
 * one ledger instead of four page restarts. Every readout is sample data.
 */
export default function WhatItDoes({ asHeading = 'h2' }: { asHeading?: 'h1' | 'h2' }) {
  const Sub = asHeading === 'h1' ? 'h2' : 'h3'
  const { title, lede, auto, sensors, analytics } = WHAT_IT_DOES
  return (
    <section id="what" className="section band-white">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[720px]">
            <LineReveal
              as={asHeading}
              lines={splitTitle(title)}
              className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3 max-w-[58ch]">{lede}</p>
            </Reveal>
          </div>
          <Reveal delay={90}>
            <span className="fx-tag">Sample data</span>
          </Reveal>
        </div>

        <div className="fx-groups">
          {/* 01 — auto-response */}
          <Reveal as="section">
            <div className="fx-row">
              <div className="fx-row-meta">
                <span className="measure">01</span>
                <p>Auto-response</p>
              </div>
              <div>
                <Sub className="text-[1.35rem] leading-snug">{auto.title}</Sub>
                <p className="mt-2 max-w-[48ch] text-[14.5px] leading-relaxed text-ink-2">{auto.body}</p>
              </div>
              <div className="fx-visual">
                <div className="fx-visual-head">
                  <p>Threshold → action → stable</p>
                  <span className="fx-tag">Illustrative readings</span>
                </div>
                <ol className="fx-loop">
                  {auto.diagram.map((d, i) => {
                    const Icon = i === 2 ? Droplets : BellRing
                    return (
                      <li key={d.a}>
                        <div className="fx-loop-node">
                          <span className="fx-icon fx-icon--sm" aria-hidden="true">
                            <Icon className="size-3.5" strokeWidth={1.75} />
                          </span>
                          <span className="measure text-[10.5px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                        </div>
                        <p className="fx-loop-state">{d.b}</p>
                        <p className="fx-loop-reading">{d.a}</p>
                      </li>
                    )
                  })}
                </ol>
              </div>
            </div>
          </Reveal>

          {/* 02 — sensing */}
          <Reveal as="section">
            <div className="fx-row">
              <div className="fx-row-meta">
                <span className="measure">02</span>
                <p>Sensing</p>
              </div>
              <div>
                <Sub className="text-[1.35rem] leading-snug">{sensors.title}</Sub>
                <p className="mt-2 max-w-[48ch] text-[14.5px] leading-relaxed text-ink-2">{sensors.body}</p>
              </div>
              <div className="fx-visual">
                <div className="fx-visual-head">
                  <p>{sensors.pod}</p>
                  <span className="fx-tag">Illustrative readings</span>
                </div>
                <dl className="fx-readout">
                  {sensors.readings.map((r) => (
                    <div key={r.k} className="fx-reading">
                      <dt>
                        {r.k === 'Temperature' ? (
                          <Thermometer className="mr-1.5 inline size-3.5 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
                        ) : (
                          <Droplets className="mr-1.5 inline size-3.5 align-[-2px]" strokeWidth={1.75} aria-hidden="true" />
                        )}
                        {r.k}
                      </dt>
                      <dd>{r.v}</dd>
                      {r.k === 'Humidity' && (
                        <div className="fx-meter" role="presentation">
                          <i style={{ width: `${parseFloat(r.v)}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </dl>
                <p className="mt-3 border-t border-line pt-2.5 text-[11.5px] leading-snug text-ink-3">
                  A dew-point estimate for cold surfaces is derived from these two readings — not a separate sensor.
                </p>
              </div>
            </div>
          </Reveal>

          {/* 03 — analytics */}
          <Reveal as="section">
            <div className="fx-row">
              <div className="fx-row-meta">
                <span className="measure">03</span>
                <p>Analytics</p>
              </div>
              <div>
                <Sub className="text-[1.35rem] leading-snug">{analytics.title}</Sub>
                <p className="mt-2 max-w-[48ch] text-[14.5px] leading-relaxed text-ink-2">{analytics.body}</p>
              </div>
              <div className="fx-visual">
                <div className="fx-visual-head">
                  <p>{analytics.sample}</p>
                  <div className="flex gap-1" role="group" aria-label="Time range (display only)">
                    {analytics.ranges.map((r, i) => (
                      <span
                        key={r}
                        className={`rounded-tight px-2 py-0.5 text-[11px] ${
                          i === 2 ? 'bg-[#2563eb0f] font-[650] text-deep' : 'text-ink-3'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="fx-chart">
                  <svg viewBox="0 0 340 120" role="img" aria-label="Illustrative 30-day humidity and dew-point trend">
                    {[24, 48, 72, 96].map((y) => (
                      <line key={y} x1="26" y1={y} x2="334" y2={y} stroke="#d7e3f2" strokeWidth="1" />
                    ))}
                    <line x1="26" y1="12" x2="26" y2="108" stroke="#d7e3f2" strokeWidth="1" />
                    {[
                      [24, '80'],
                      [48, '70'],
                      [72, '60'],
                      [96, '50'],
                    ].map(([y, l]) => (
                      <text key={l} x="20" y={(y as number) + 3} textAnchor="end" fontSize="8" fill="#516a84" fontFamily="Spline Sans Mono, monospace">
                        {l}
                      </text>
                    ))}
                    <polyline
                      points="26,34 64,30 102,38 140,58 178,66 216,60 254,48 292,44 334,52"
                      fill="none"
                      stroke="#15385e"
                      strokeWidth="2"
                    />
                    <polyline
                      points="26,52 64,48 102,54 140,68 178,74 216,70 254,62 292,58 334,64"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1.6"
                      strokeDasharray="5 4"
                    />
                    <line x1="178" y1="12" x2="178" y2="108" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="2 3" />
                    <circle cx="178" cy="66" r="3" fill="#15385e" />
                    {['0', '7', '14', '21', '28'].map((d, i) => (
                      <text key={d} x={26 + i * 77} y="118" textAnchor="middle" fontSize="8" fill="#516a84" fontFamily="Spline Sans Mono, monospace">
                        {d}d
                      </text>
                    ))}
                  </svg>
                </div>
                <div className="fx-legend">
                  <span>
                    <i /> Humidity
                  </span>
                  <span className="is-alt">
                    <i /> Dew point
                  </span>
                  <span className="measure">% RH</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 04 — alerts and control, one shared ledger row */}
          <Reveal as="section">
            <div className="fx-row">
              <div className="fx-row-meta">
                <span className="measure">04</span>
                <p>Alerts &amp; control</p>
              </div>
              <div>
                <Sub className="text-[1.35rem] leading-snug">{ALERTS.title}</Sub>
                <p className="mt-2 max-w-[48ch] text-[14.5px] leading-relaxed text-ink-2">{ALERTS.body}</p>
                <a className="fx-link mt-1 text-[13px]" href="#risk">
                  Try a sample room
                  <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
              <div className="fx-visual">
                <div className="fx-visual-head">
                  <p>{AUTOMATIONS.title}</p>
                  <span className="fx-tag">Visible rule</span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-ink-2">{AUTOMATIONS.body}</p>
                <p className="fx-rule mt-3">{AUTOMATIONS.rule}</p>
                <p className="mt-2 text-[11.5px] text-ink-3">{AUTOMATIONS.note}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
