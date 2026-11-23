import { OWN } from '../content'
import { Reveal, LineReveal, MagButton } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { ArrowRight, Check, Minus } from 'lucide-react'

/**
 * Purchase-offer band: navy on page 1 (PDF band 0.702–0.774).
 *
 * It used to show a component build cost, which is an internal figure and not a
 * customer price. It now states the one offer — a proposed one-time price, no
 * subscription — and what the system consists of, with an honest fit checklist.
 * Every term beyond price (stock, delivery, warranty, service) is confirmed in
 * the quotation, so nothing here promises what is not confirmed.
 */
export default function Ownership() {
  const { price } = OWN
  return (
    <section id="ownership" className="section band-dark">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <Reveal>
            <div>
              <LineReveal
                lines={splitTitle(OWN.title)}
                className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-white"
              />
              <p className="lede mt-3 max-w-[560px] text-on-dark-2">{OWN.lede}</p>

              {/* The offer: one figure, one payment, source named, terms scoped. */}
              <div className="mt-7 rounded-soft border border-[#eaf2fc26] bg-[#eaf2fc08] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[13px] font-semibold text-on-dark">{price.label}</p>
                  <p className="text-[11px] text-on-dark-2">One-time payment. No subscription.</p>
                </div>
                <p className="measure mt-2 text-[2.4rem] leading-none font-semibold text-white">{price.figure}</p>

                <p className="mt-4 max-w-[72ch] border-t border-[#eaf2fc26] pt-3 text-[12.5px] leading-relaxed text-on-dark">
                  {price.terms}
                </p>

                <div className="mt-5">
                  <MagButton href={OWN.cta.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                    {OWN.cta.label}
                  </MagButton>
                </div>
              </div>
            </div>
          </Reveal>

          <div>
            {/* What the buyer actually receives: the system, not assumed extras. */}
            <Reveal delay={60}>
              <p className="text-[11px] font-[650] tracking-[0.12em] text-on-dark-2 uppercase">{OWN.includesTitle}</p>
              <ul className="mt-3 divide-y divide-[#eaf2fc26] border-y border-[#eaf2fc26]">
                {OWN.includes.map((p, i) => (
                  <Reveal as="li" key={p.title} delay={i * 50}>
                    <div className="flex gap-3 py-3.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-[#8fb6e6]" strokeWidth={2} aria-hidden="true" />
                      <div>
                        <p className="text-[14.5px] font-[650] text-on-dark">{p.title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-on-dark-2">{p.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </Reveal>

            {/* Fit checklist: keeps the sales claim honest about scope. */}
            <Reveal delay={120}>
              <p className="mt-6 text-[11px] font-[650] tracking-[0.12em] text-on-dark-2 uppercase">{OWN.fitTitle}</p>
              <ul className="mt-3 grid gap-2">
                {OWN.fitYes.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-on-dark">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-[#8fb6e6]" strokeWidth={2.5} aria-hidden="true" />
                    {t}
                  </li>
                ))}
                {OWN.fitNo.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-on-dark-2">
                    <Minus className="mt-1 size-3.5 shrink-0 text-[#7d94ad]" strokeWidth={2.5} aria-hidden="true" />
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
