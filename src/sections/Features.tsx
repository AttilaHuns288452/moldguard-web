import { ArrowRight } from 'lucide-react'
import { FEATURES } from '../content'
import { Reveal, LineReveal, MagButton, Gauge, Seq } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * PDF-grounded feature band: the Mold Risk Index leads, while the remaining
 * capabilities stay in the same panel as supporting rows. One visual block
 * keeps the page hierarchy clear without repeating six equal-weight cards.
 */
export default function Features() {
  // White on both pages. PDF page 2 is one continuous white canvas, and on page 1
  // this has to be white because the section that used to separate it from `meet`
  // was removed - without that, two pale blocks merged into one wash.
  // This component is shared by / and /features; the "explore the features" CTA
  // only makes sense on the home page (on /features it is a link to itself).
  const onFeaturesRoute = typeof window !== 'undefined' && /^\/features\/?$/.test(window.location.pathname)
  return (
    // PDF page 1, band 5: {#eaf2fc}, i.e. PALE. This was switched to white when
    // `SenseScoreAct` was deleted, because the section below it was then also pale
    // and the two merged. Now that Sense (white) sits between Meet and Features,
    // the artboard's pale band is correct again and does not merge with anything:
    //   meet pale · sense white · features pale · ownership navy
    // Measured after the change: / is back to the artboard's 5-colour rhythm.
    <section id="features" className="section band-pale">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[720px]">
            <LineReveal
              lines={splitTitle(FEATURES.title)}
              className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-deep"
            />
          </div>
          <Reveal delay={60}>
            {/* On /features this section IS the features page, so the same CTA
                linked to /features — a button that navigates to the page you are
                already on. Hide it there; on the home page it is the path to the
                full page and stays. */}
            {!onFeaturesRoute && (
              <MagButton href={FEATURES.cta.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                {FEATURES.cta.label}
              </MagButton>
            )}
          </Reveal>
        </div>

        {/* Six equal-weight rows give the reader six equal claims, i.e. none.
            The Mold Risk Index is the differentiator, so it gets a wide card and
            the other five stay as supporting rows in the SAME panel: one card,
            one hierarchy, rather than a standalone hero card and a detached list. */}
        <Reveal delay={60}>
          <article className="card-lift mt-7 overflow-hidden rounded-shell border border-line bg-card">
            <div className="grid items-center gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:p-8">
              <div>
                <span className="measure text-[0.6875rem] tracking-[0.16em] text-accent-ink">
                  {FEATURES.items[0].n}
                </span>
                <h3 className="mt-2 text-[clamp(1.25rem,2.2vw,1.5rem)] font-[650] text-deep">
                  {FEATURES.items[0].title}
                </h3>
                <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">
                  {FEATURES.items[0].body}
                </p>
              </div>
              {/* Same arc gauge AND the same readout the Capabilities card uses. Without
                  the number it was a bare arc - pure decoration on the strongest page. */}
              <div className="w-[150px] shrink-0">
                <Gauge value={38} className="block w-full" />
                <div className="-mt-[2.2rem] text-center">
                  <p className="measure text-[1.5rem] leading-none font-semibold text-deep">38</p>
                  <p className="mt-0.5 text-[11px] tracking-[0.12em] text-ink-3 uppercase">/ 100</p>
                </div>
                <div className="mt-2 flex justify-between text-[11px] tracking-[0.1em] text-ink-3 uppercase">
                  <span>Safe</span><span>Watch</span><span>Act</span>
                </div>
                <p className="mt-1.5 text-center text-[10.5px] leading-snug text-ink-3">
                  Illustrative demo reading
                </p>
              </div>
            </div>

            {/* one observer for the whole index, children stagger off their own
                position (see .seq) rather than five independent Reveals. It sits
                inside the card so the dominant claim and its supporters are one block. */}
            {/* Dividers must be CONTINUOUS. A grid with `gap-x-12` plus per-cell
                borders draws each cell's rule separately, leaving a 48px hole in
                the gutter (measured: rules at x123–696 and x744–1317) — which reads
                as a broken line now that the last row spans both columns.
                So: no column gap at all, and the visual gutter comes from padding
                inside the left cell. Adjacent cells then share one continuous
                border-bottom. */}
            <Seq className="grid border-t border-line px-6 md:grid-cols-2 md:px-8 [&>*]:border-b [&>*]:border-line [&>*:last-child]:border-b-0">
              {FEATURES.items.slice(1).map((f, i, arr) => {
                const spans = i === arr.length - 1 && arr.length % 2 === 1
                return (
                  <div
                    key={f.n}
                    className={`flex gap-5 py-4 ${spans ? 'md:col-span-2' : i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}
                  >
                  <span className="measure w-4 shrink-0 pt-0.5 text-[0.6875rem] tracking-[0.16em] text-accent-ink">{f.n}</span>
                  <div>
                    <h3 className="text-[1.05rem] font-[650] text-deep">{f.title}</h3>
                    <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{f.body}</p>
                  </div>
                </div>
                )
              })}
            </Seq>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
