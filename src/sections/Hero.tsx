import { useState } from 'react'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { HERO, OFFER } from '../content'
import { LineReveal, MagButton } from '../components/ui'
import DeviceViewer from '../components/DeviceViewer'
import { useReducedMotion } from '../lib/motion'

/**
 * Hero: THE PRODUCT ITSELF, IN 3D. The owner's direction (2026-11-19) is
 * explicit: the 3D model is the hero, not a photo. So the live viewer sits in
 * the primary slot, showing the real SketchUp assembly rather than a render of
 * a device that does not exist. The risk readout card overlays it as before.
 *
 * Sales layout: the price sits next to the CTA, and the three bullets under it
 * are the customer's outcome, not a spec list. Everything routes to /contact —
 * there is no checkout on this site.
 *
 * Background is the PDF's flat #f7fbff hero band (sampled 105..750pt of page 1),
 * NOT a gradient: an authored gradient is a different design direction.
 */
export default function Hero() {
  // the hero stage is a live model: no part selected, assembled, slowly turning
  const [active, setActive] = useState<Parameters<typeof DeviceViewer>[0]['active']>(null)
  const reduced = useReducedMotion()

  return (
    <section id="top" className="relative overflow-hidden bg-[#f7fbff]">
      {/* Balanced columns: 0.95fr / 1fr with a 6% gutter. The old 19% gutter at
          1352px+ pushed the copy into a narrow ribbon and split the headline onto
          four lines; the pitch now has room to read as a paragraph. */}
      <div className="shell relative grid gap-5 pt-6 pb-8 lg:items-center lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-[6%] lg:pt-14 lg:pb-10 min-[1352px]:pt-[104px] min-[1352px]:pb-[52px]">
        {/* copy */}
        <div className="relative z-10">
          <p className="mb-4 text-[13px] text-ink-3">{HERO.cat}</p>
          <LineReveal
            as="h1"
            className="max-w-[20ch] text-[clamp(2.4rem,4.2vw,3.85rem)] leading-[1.03] font-bold tracking-[-0.032em] text-deep"
            lines={HERO.titleLines}
          />
          <p className="lede mt-4 max-w-[36ch] sm:mt-5">{HERO.lede}</p>

          {/* price + CTA together: the number a buyer asks for, beside the action */}
          <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-4 sm:mt-7">
            <div>
              <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{OFFER.priceLabel}</p>
              <p className="measure mt-1 flex items-baseline gap-2 text-[1.9rem] leading-none font-semibold text-deep">
                {OFFER.price}
                <span className="inline-flex items-center gap-1 rounded-full border border-[#177069]/30 bg-[#1770690d] px-2 py-0.5 text-[10.5px] font-[650] tracking-[0.06em] text-[#177069] uppercase">
                  <BadgeCheck className="size-3" strokeWidth={2} aria-hidden="true" />
                  No subscription
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <MagButton href={HERO.primary.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                {HERO.primary.label}
              </MagButton>
              <MagButton href={HERO.secondary.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                {HERO.secondary.label}
              </MagButton>
            </div>
          </div>

          <ul className="mt-6 grid max-w-[52ch] gap-y-2 border-t border-line pt-4">
            {HERO.bullets.map((b) => (
              <li key={b.title} className="flex gap-3">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <p className="text-[13px] leading-relaxed text-ink-2">
                  <span className="font-[650] text-deep">{b.title}.</span> {b.body}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-w-[52ch] text-[11.5px] leading-relaxed text-ink-3">
            {OFFER.terms}
          </p>

          {/* the hero is tall enough that the fold can read as the end of the page;
              one quiet cue down to the next section fixes that */}
          <a
            href="#problem"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] sm:mt-5 text-ink-3 transition-colors hover:text-ink"
          >
            See why the room needs more than a meter
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>

        {/* the artboard's hero visual: visitor-facing 3D stage + readout overlay */}
        <div className="relative">
          <div
            className="relative mx-auto overflow-hidden rounded-shell border border-line bg-white p-2 shadow-e2"
            // Square, per the PDF frame, but the SIDE is capped on wide viewports.
            // A cap on width keeps the square from overhanging the copy column.
            style={{ aspectRatio: '1 / 1.01', maxWidth: 'min(100%, 680px)' }}
          >
            {/* Stage tone sampled from the artboard's hero product card: the device
                sits on a WARM, LIGHT surface (beige/cream studio), not a cool blue
                field. That contrast direction is what makes a white product read as
                a product: warm light ground, cool white object. */}
            <div className="relative h-full w-full overflow-hidden rounded-soft bg-[radial-gradient(120%_95%_at_50%_20%,#fdfbf7_0%,#efe7db_55%,#d9cdbb_100%)]">
              <DeviceViewer
                active={active}
                onSelect={setActive}
                autoSpin={!reduced}
                mode="tour"
                chrome={false}
                hotspots={false}
                nudgeX={-0.014}
              />
              {/* The unit is shown open on purpose: the panels are modelled apart
                  in the SketchUp file, and the interior IS the product argument. */}
              <p className="mt-2 px-1 text-center text-[11px] leading-snug text-ink-3 sm:pointer-events-none sm:absolute sm:bottom-4 sm:left-4 sm:right-[188px] sm:mt-0 sm:rounded-tight sm:bg-card sm:px-3 sm:py-2 sm:text-[12px] sm:text-ink sm:backdrop-blur-sm">
                Open cutaway &middot; {HERO.stageNote}
              </p>
            </div>
          </div>

          {/* app card: navy panel, exactly the artboard's readout. It overlaps
              the photo's right edge into the white frame, as the PDF does. */}
          <div className="mt-3 rounded-soft border border-[#2b5c8f]/70 bg-deep/95 p-3 shadow-e3 backdrop-blur-sm sm:absolute sm:-right-4 sm:bottom-3 sm:mt-0 sm:w-[164px] sm:rounded-shell sm:p-3">
            <p className="text-[12px] font-[650] text-on-dark">MoldGuard</p>
            <p className="fx-tag mt-2 w-fit border-[#eaf2fc44] bg-[#eaf2fc12] text-on-dark-2">Illustrative reading</p>
            <p className="mt-2.5 text-[10px] tracking-[0.08em] text-on-dark-2 uppercase">Mold Risk Index</p>
            <p className="measure mt-0.5 text-[30px] leading-none font-semibold text-white">
              38<span className="text-[13px] text-on-dark-2">/100</span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-2 whitespace-nowrap text-[11px] text-on-dark-2">
              <span>Conditions steady</span>
            </p>
            {/* ONE room: one device is scoped to one small room. The band names are
                the site's one vocabulary (Safe / Watch / Act). */}
            <ul className="mt-3 divide-y divide-[#eaf2fc24] border-t border-[#eaf2fc24]">
              {[['Closet', 'Safe'], ['Dehumidifier', 'Standby']].map(([n, st]) => (
                <li key={n} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-[12px] text-on-dark-2">{n}</span>
                  <span className="text-[12px] font-[650] text-on-dark">{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
