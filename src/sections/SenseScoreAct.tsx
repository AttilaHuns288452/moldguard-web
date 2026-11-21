import { ArrowRight } from 'lucide-react'
import { SENSE_SCORE_ACT } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * PDF page 1, band 4: "Sense. Score. Act."
 *
 * This section was deleted (`2c6c70a`) to stop the home page explaining the
 * sense→score→act flow in four places. Removing it was reasonable on its own, but
 * the artboard it came from is a FIXED band map, and its absence is what broke the
 * page rhythm:
 *
 *   PDF  p1: hero pale · problem white · meet pale · [Sense✓] white · features pale
 *   site p1: hero pale · problem white · meet pale ·           features white
 *
 * With the white band gone, `meet` and `features` — both pale — ended up adjacent
 * and merged into ONE 2,667px wash instead of two distinct sections. To cover that,
 * Features was switched to white, which dropped the palette from 5 bands to 4 and
 * made `meet/features` and `features/ownership` read as one continuous slab.
 *
 * Restoring it (rebuilt from the artboard: hairline columns, not cards) puts the
 * band map back to the approved 8 bands. Measured, not argued: `band_map.py`.
 *
 * The duplicate-content concern is handled by keeping the CTA pointed at
 * /how-it-works — this band names the flow in three words and hands off; the
 * detailed walkthrough lives on its own page.
 */
export default function SenseScoreAct() {
  return (
    <section id="sense-score-act" className="section band-white">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Reveal>
            <LineReveal
              lines={splitTitle(SENSE_SCORE_ACT.title)}
              className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-deep"
            />
          </Reveal>
          <Reveal delay={60}>
            <a
              href={SENSE_SCORE_ACT.cta.href}
              className="inline-flex min-h-11 items-center gap-2.5 rounded-tight border border-line-hi bg-card px-5 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3"
            >
              {SENSE_SCORE_ACT.cta.label}
              <ArrowRight className="size-[15px]" strokeWidth={2} />
            </a>
          </Reveal>
        </div>

        {/* Hairline columns per the artboard: one rule, three columns divided by
            thin vertical lines, list rows separated by thin horizontal lines.
            Delete the card wrapper — the PDF has no card here, and a card was what
            made this read as a fourth "box" on a page that already has enough. */}
        <div className="mt-10 grid gap-px overflow-hidden border-t border-line bg-line sm:grid-cols-3">
          {SENSE_SCORE_ACT.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70}>
              <div className="h-full bg-white">
                <div className="flex items-baseline gap-3 px-6 pt-7">
                  <span className="measure text-[11px] tracking-[0.16em] text-accent-ink">{s.n}</span>
                  <h3 className="text-[1.13rem] font-[650] text-deep">{s.title}</h3>
                </div>
                <ul className="mt-3">
                  {s.items.map((x) => (
                    <li
                      key={x}
                      className="border-t border-line px-6 py-2.5 text-[14.5px] text-ink-2 first:border-t-0"
                    >
                      {x}
                    </li>
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
