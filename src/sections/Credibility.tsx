import { CREDIBILITY } from '../content'
import { Reveal } from '../components/ui'

/**
 * Authority strip. Deliberately uses countable project facts rather than
 * testimonials or "trusted by" logos, which would be fabricated: there are no
 * customers yet. Honest specificity outperforms fake social proof.
 */
export default function Credibility() {
  return (
    <section aria-label="About the build" className="border-y border-line bg-paper-deep py-10">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4">
          {CREDIBILITY.map((c, i) => (
            <Reveal as="li" key={c.label} delay={i * 50}>
              <div>
                <p className="font-display text-[1.25rem] leading-none font-bold tracking-[-0.02em] text-deep">{c.k}</p>
                <p className="mt-1.5 text-[13px] font-[650] text-ink">{c.label}</p>
                <p className="mt-0.5 text-[11.5px] leading-snug text-ink-3">{c.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
