import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import DeviceViewer from '../components/DeviceViewer'
import type { HotspotId } from '../components/DeviceViewer'
import { HERO } from '../content'
import { LineReveal, MagButton } from '../components/ui'

/**
 * Hero: the product itself, in 3D. Nothing competes with it — no eyebrow, no
 * card chrome, no mockup. The model sits on its own lit stage and is the first
 * thing the eye lands on after the headline.
 */
export default function Hero() {
  const [active, setActive] = useState<HotspotId | null>(null)

  return (
    <section id="top" className="relative overflow-hidden">
      {/* one authored background: a soft pool of light where the product stands */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(46% 44% at 50% 42%, #ffffff 0%, #f6f2ec 52%, #ebe5dc 100%)',
        }}
      />

      <div className="shell relative grid items-center gap-8 pt-4 pb-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-6 lg:pt-6 lg:pb-14">
        {/* copy */}
        <div className="relative z-10">
          <LineReveal
            as="h1"
            className="max-w-[15ch] text-[clamp(2.75rem,5.6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.032em] text-deep"
            lines={HERO.titleLines}
          />
          <p className="lede mt-6 max-w-[34ch]">{HERO.lede}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <MagButton href={HERO.primary.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.primary.label}
            </MagButton>
            <a
              href={HERO.secondary.href}
              className="group inline-flex min-h-11 items-center gap-1.5 px-1 text-[15px] font-[650] text-deep underline-offset-4 hover:underline"
            >
              {HERO.secondary.label}
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </a>
          </div>

          {/* the honest guarantees, as a quiet line rather than a stat block */}
          <p className="mt-9 max-w-[46ch] text-[12.5px] leading-relaxed text-ink-3">
            No monitoring subscription. Fixed one-time cost. Open, itemized hardware.
            Yours after handover.
          </p>
        </div>

        {/* the product, at full size */}
        <div className="relative">
          <div className="relative mx-auto h-[clamp(380px,62vh,620px)] w-full max-w-[430px]">
            <DeviceViewer active={active} onHotspot={setActive} />
          </div>
        </div>
      </div>
    </section>
  )
}
