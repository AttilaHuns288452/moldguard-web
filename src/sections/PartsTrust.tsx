import { PARTS_TRUST } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * PDF page 2, "Built from parts you can trust." — six collapsed rows with a
 * circular plus on the right. This section was missing from the site entirely;
 * the page went straight from the comparison table to the closing CTA.
 *
 * Native <details> so it works without JS, is keyboard accessible for free, and
 * a screen reader announces the expanded state. No accordion library.
 */
export default function PartsTrust() {
  return (
    <section id="parts" className="section band-white">
      <div className="shell">
        <div className="max-w-[720px]">
          <LineReveal
            as="h2"
            lines={splitTitle(PARTS_TRUST.title)}
            className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="lede mt-2">{PARTS_TRUST.lede}</p>
          </Reveal>
        </div>

        <Reveal delay={90}>
          <div className="mt-9 divide-y divide-line overflow-hidden rounded-soft border border-line bg-card">
            {PARTS_TRUST.rows.map((r) => (
              <details key={r.n} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper-deep/60 md:px-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex items-baseline gap-4">
                    <span className="measure text-[11px] tracking-[0.14em] text-accent-ink">{r.n}</span>
                    <span className="text-[15px] font-[650] text-deep">{r.title}</span>
                  </span>
                  {/* the PDF's circular plus, rotated to a minus when open */}
                  <span
                    aria-hidden="true"
                    className="state grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-2 transition-transform group-open:rotate-45"
                  >
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M6 1v10M1 6h10" />
                    </svg>
                  </span>
                </summary>
                <p className="max-w-[78ch] px-5 pb-5 text-[14.5px] leading-relaxed text-ink-2 md:px-6 md:pl-[3.4rem]">{r.body}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
