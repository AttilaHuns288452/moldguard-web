import { useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import DeviceViewer from '../components/DeviceViewer'
import { DemoTag } from '../components/ui'
import type { HotspotId } from '../components/DeviceViewer'
import { useState } from 'react'

export default function Hero() {
  const [active, setActive] = useState<HotspotId | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  return (
    <section id="top" className="relative overflow-hidden pt-[68px]">
      {/* atmosphere: one controlled gradient, no particles */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(120% 78% at 72% 6%, #eaf2fc 0%, #eaf2fc 42%, #eaf2fc 72%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        aria-hidden="true"
        style={{ background: 'linear-gradient(90deg,transparent,#cbd9eb,transparent)' }}
      />

      <div className="shell relative">
        <div className="grid items-center gap-x-10 gap-y-10 pb-12 pt-8 md:pb-16 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)] lg:gap-x-10 lg:pb-20 lg:pt-14">
          {/* ── copy ── */}
          <div className="relative z-10 lg:py-8">
            <p className="eyebrow flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_#2563eb80]" aria-hidden="true" />
              IoT mold risk prevention &amp; detection
            </p>

            <h1 className="mt-7 text-[clamp(2.45rem,6.6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.035em] text-ink">
              Know mold risk
              <br />
              <span className="text-ink-2">before it becomes</span>
              <br />
              <span className="relative inline-block">
                visible.
                <span
                  className="absolute -bottom-1 left-0 h-px w-full bg-gradient-to-r from-cyan/80 to-transparent"
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
              Warm, humid rooms are mold&rsquo;s ideal habitat. Most dehumidifiers see one number:
              humidity. MoldGuard reads the full picture &mdash; humidity, temperature, exposure
              duration, and virtual dew-point margin &mdash; adds weather foresight, and responds on
              its own.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-tight bg-accent-ink px-6 py-3.5 text-[0.9375rem] font-medium text-white shadow-[0_18px_50px_-20px_#2563eb] transition-colors hover:bg-[#1d4ed8]"
              >
                Get a quote
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
              <a
                href="#loop"
                className="inline-flex items-center gap-2.5 rounded-tight border border-line-hi px-6 py-3.5 text-[0.9375rem] transition-colors hover:border-ice-dim/50 hover:bg-white/[0.035]"
              >
                See how it works
                <ArrowDown className="size-4" strokeWidth={1.75} />
              </a>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-soft border border-line bg-line">
              {[
                { k: 'Loop', v: 'Auto', d: 'no scheduling' },
                { k: 'Tank', v: '1 L', d: 'removable, monitored' },
                { k: 'Fees', v: 'None', d: 'no subscription' },
              ].map((s) => (
                <div key={s.k} className="bg-card px-4 py-4">
                  <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{s.k}</p>
                  <div className="mt-1.5">
                    <span className="block font-mono text-[1.0625rem] text-ink">{s.v}</span>
                    <span className="mt-0.5 block text-[0.6875rem] leading-tight text-ink-3">{s.d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── model stage ── */}
          <div ref={stageRef} className="relative">
            <div className="relative mx-auto w-full max-w-[520px]">
              {/* panel: the model sits inside it, not on top of its edges */}
              <div className="relative overflow-hidden rounded-shell border border-line bg-card shadow-[0_24px_60px_-34px_#15385e59]">
                {/* atmosphere inside the panel only */}
                <div
                  className="pointer-events-none absolute inset-0"
                  aria-hidden="true"
                  style={{ background: 'radial-gradient(76% 62% at 50% 30%, #f7fbff 0%, #edf4fc 46%, #e4eef3 100%)' }}
                />
                <div
                  className="pointer-events-none absolute inset-x-10 bottom-[26%] h-px"
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(90deg,transparent,#cbd9eb 25%,#2563eb80 50%,#cbd9eb 75%,transparent)' }}
                />

                {/* fixed stage height so the model can never push the card out */}
                <div className="relative h-[clamp(300px,50vh,470px)] w-full">
                  <DeviceViewer active={active} onHotspot={setActive} />
                </div>

                {/* readout strip, inside the panel, its own row */}
                <div className="relative flex items-center justify-between gap-4 border-t border-line bg-tint px-5 py-4">
                  <div className="flex items-center gap-3.5">
                    <span className="measure text-[1.625rem] leading-none text-accent">38</span>
                    <span>
                      <span className="block text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                        Mold risk index
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] text-ink-2">Closet · 82% RH · 26h sustained</span>
                    </span>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <DemoTag>Illustrative</DemoTag>
                    <span className="measure text-[0.6875rem] text-ink-3">dew point &minus;0.4&deg;C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
