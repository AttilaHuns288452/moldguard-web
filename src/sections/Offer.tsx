import { OFFER } from '../content'
import { Reveal, LineReveal, MagButton } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { ArrowRight, Check, Minus } from 'lucide-react'

/**
 * The offer, stated plainly: what is included, what is not, and how pricing
 * works. Buyers close a tab when they cannot find "what do I get and what does
 * it cost" — the deck supports the model but publishes no number, so this states
 * the model and routes to a quotation instead of inventing a price.
 */
export default function Offer() {
  return (
    <section id="offer" className="section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div>
            <LineReveal
              lines={splitTitle(OFFER.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3">{OFFER.lede}</p>
            </Reveal>

            <Reveal delay={130}>
              <div className="mt-8 rounded-soft border border-line bg-card p-6">
                <p className="text-[12.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Pricing</p>
                <p className="measure mt-2 text-[1.75rem] leading-none font-semibold text-deep">{OFFER.price.model}</p>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{OFFER.price.note}</p>
                <p className="mt-2 flex items-center gap-1.5 text-[13px] font-[650] text-accent-ink">
                  <Check className="size-3.5 shrink-0" strokeWidth={2.75} />
                  {OFFER.price.promise}
                </p>
                <div className="mt-5">
                  <MagButton href={OFFER.price.cta.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                    {OFFER.price.cta.label}
                  </MagButton>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="text-[12.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Included</p>
              <ul className="mt-3 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2">
                {OFFER.included.map((it) => (
                  <li key={it.k} className="bg-card px-4 py-3.5">
                    <p className="flex items-start gap-2 text-[13.5px] font-[650] text-ink">
                      <Check className="mt-0.5 size-3.5 shrink-0 text-accent-ink" strokeWidth={2.75} />
                      {it.k}
                    </p>
                    <p className="mt-0.5 pl-5 text-[12.5px] leading-snug text-ink-3">{it.v}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-6 text-[12.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Not included</p>
              <ul className="mt-3 space-y-2">
                {OFFER.notIncluded.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-2">
                    <Minus className="mt-1 size-3.5 shrink-0 text-[#465e7a]" strokeWidth={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
