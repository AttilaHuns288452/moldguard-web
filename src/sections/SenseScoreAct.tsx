import { ArrowRight } from 'lucide-react'
import { SENSE_SCORE_ACT } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/** Three-column hairline steps: 01/02/03 with item lists. */
export default function SenseScoreAct() {
  return (
    <section id="how" className="section">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal>
            <LineReveal lines={splitTitle(SENSE_SCORE_ACT.title)} className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep" />
          </Reveal>
          <Reveal delay={60}>
            <a
              href={SENSE_SCORE_ACT.cta.href}
              className="inline-flex items-center gap-2.5 rounded-tight border border-line-hi bg-card px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3"
            >
              {SENSE_SCORE_ACT.cta.label}
              <ArrowRight className="size-[15px]" strokeWidth={2} />
            </a>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-3">
          {SENSE_SCORE_ACT.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="h-full bg-card px-6 py-7">
                <span className="measure text-[11px] tracking-[0.16em] text-accent-ink">{s.n}</span>
                <h3 className="mt-2 text-[1.13rem] font-[650] text-deep">{s.title}</h3>
                <ul className="mt-2 space-y-1">
                  {s.items.map((x) => (
                    <li key={x} className="text-[14.5px] text-ink-2">{x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
