import { ArrowRight } from 'lucide-react'
import { FEATURES } from '../content'
import { Reveal } from '../components/ui'

/** Editorial two-column numbered feature rows. */
export default function Features() {
  return (
    <section id="features" className="section section-alt">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal>
            <h2 className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep">
              {FEATURES.title}
            </h2>
          </Reveal>
          <Reveal delay={60}>
            <a
              href={FEATURES.cta.href}
              className="inline-flex items-center gap-2.5 rounded-tight border border-line-hi bg-card px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3"
            >
              {FEATURES.cta.label}
              <ArrowRight className="size-[15px]" strokeWidth={2} />
            </a>
          </Reveal>
        </div>

        <div className="mt-[38px] grid gap-x-14 border-t-2 border-deep sm:grid-cols-2">
          {FEATURES.items.map((f, i) => (
            <Reveal key={f.n} delay={i * 55}>
              <div className="flex gap-5 border-b border-line py-5">
                <span className="measure w-4 shrink-0 pt-0.5 text-[11px] tracking-[0.16em] text-accent-ink">{f.n}</span>
                <div>
                  <h3 className="text-[1.05rem] font-[650] text-deep">{f.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
