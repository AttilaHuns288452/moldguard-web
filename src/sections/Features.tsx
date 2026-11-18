import { ArrowRight } from 'lucide-react'
import { FEATURES } from '../content'
import { Reveal, LineReveal, MagButton } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * PDF page 1, band 0.602–0.702: a plain 2×3 numbered grid, heading left and
 * "Explore the features" right. The PDF has NO hero card and no index dial
 * here — an invented hero card made this band 13.8% of the page against the
 * reference's 10.0% and pushed the whole page 38% longer than the artboard.
 * Six equal cells are the approved composition.
 */
export default function Features() {
  return (
    <section id="features" className="section band-pale">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[720px]">
            <LineReveal
              lines={splitTitle(FEATURES.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
          </div>
          <Reveal delay={60}>
            <MagButton href={FEATURES.cta.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {FEATURES.cta.label}
            </MagButton>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-x-14 border-t-2 border-deep sm:grid-cols-2">
          {FEATURES.items.map((f, i) => (
            <Reveal key={f.n} delay={i * 55}>
              <div className="card-lift flex gap-5 border-b border-line py-5">
                <span className="measure w-4 shrink-0 pt-0.5 text-[0.6875rem] tracking-[0.16em] text-accent-ink">{f.n}</span>
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
