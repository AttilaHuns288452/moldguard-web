import { ArrowRight } from 'lucide-react'
import { PLACEMENT } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import DeviceViewer from '../components/DeviceViewer'

export default function Placement() {
  return (
    <section id="placement" className="section band-white">
      <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-11">
        <Reveal>
          <div>
            <LineReveal lines={splitTitle(PLACEMENT.title)} className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-deep" />
            <p className="lede mt-2">{PLACEMENT.lede}</p>
            <a
              href={PLACEMENT.cta.href}
              className="mt-5 inline-flex items-center gap-2.5 rounded-btn border border-line-hi bg-card px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3"
            >
              {PLACEMENT.cta.label}
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </a>
          </div>
        </Reveal>
        {/* The photo that used to sit here was a render of a DIFFERENT object: a
            cream box with a perforated speaker-style grille and no display, while
            every other section shows the real SketchUp assembly (LCD, fan,
            thermoelectric stack, tank). A buyer saw two products on one page.
            This render is the same model the other sections use, so the page now
            shows ONE device - and it is the one that actually exists. */}
        <Reveal delay={90}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-soft border border-line bg-[radial-gradient(70%_60%_at_50%_40%,#ffffff_0%,#e8f1fb_55%,#cadcef_100%)]">
            <DeviceViewer
              active={null}
              onSelect={() => {}}
              autoSpin={false}
              mode="tour"
              chrome={false}
              hotspots={false}
            />
            <p className="pointer-events-none absolute inset-x-4 bottom-3 text-center text-[11.5px] leading-snug text-ink-2">
              {PLACEMENT.photoAlt}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
