import { OWN } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/** Own-it band: copy left, three points right. */
export default function Ownership() {
  return (
    <section id="ownership" className="section border-t border-line">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <div>
            <LineReveal lines={splitTitle(OWN.title)} className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep" />
            <p className="mt-3 max-w-[560px] text-[1.05rem] leading-relaxed text-ink-2">{OWN.lede}</p>
          </div>
        </Reveal>
        <ul className="grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-1">
          {OWN.points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 60}>
              <div className="card-lift h-full bg-card px-5 py-4">
                <p className="text-[15px] font-[650] text-deep">{p.title}</p>
                <p className="mt-0.5 text-[14px] text-ink-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
