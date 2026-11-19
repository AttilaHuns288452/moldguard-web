import { ArrowRight } from 'lucide-react'
import { PLACEMENT } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

export default function Placement() {
  return (
    <section id="placement" className="section band-white">
      <div className="shell grid items-center gap-10 md:grid-cols-2 md:gap-11">
        <Reveal>
          <div>
            <LineReveal lines={splitTitle(PLACEMENT.title)} className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep" />
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
        <Reveal delay={90}>
          <div className="ph-zoom overflow-hidden rounded-soft bg-paper-deep">
            <img
              src="/pod-bath.webp"
              alt={PLACEMENT.photoAlt}
              width={1024}
              height={1024}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
