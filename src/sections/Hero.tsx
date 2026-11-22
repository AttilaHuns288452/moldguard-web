import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { HERO } from '../content'
import { LineReveal, MagButton } from '../components/ui'
import DeviceViewer from '../components/DeviceViewer'
import { useReducedMotion } from '../lib/motion'

/**
 * Hero: THE PRODUCT ITSELF, IN 3D. The owner's direction (2026-11-19) is
 * explicit: the 3D model is the hero, not a photo. So the live viewer sits in
 * the primary slot, showing the real SketchUp assembly rather than a render of
 * a device that does not exist. The risk readout card overlays it as before.
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
      {/* Column split measured off the PDF: content 1120pt = text 36.3% ·
          19.4% gap · photo 41.8%. The photo is SQUARE (468x473pt), not the
          landscape panel a 50/50 split produces. */}
      <div className="shell relative grid gap-5 pt-6 pb-8 lg:items-center lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)] lg:gap-[7%] lg:pt-16 lg:pb-10 min-[1352px]:grid-cols-[minmax(0,0.87fr)_minmax(0,1fr)] min-[1352px]:gap-[19%] min-[1352px]:pt-[118px] min-[1352px]:pb-[52px]">
        {/* copy */}
        <div className="relative z-10">
          <p className="mb-4 text-[13px] text-ink-3">{HERO.cat}</p>
          {/* PDF p1 h1 = 110pt on 1280 = 8.59% of page width. Straight-matching
              that ratio is impossible HERE because the copy is longer than the
              artboard's ("Know when conditions become mold-friendly." vs "Know mold
              is coming before it shows.") and the text column is 561px of 1440.
              Measured: at 1440 any size above ~4.6vw wraps to 4-5 lines, splitting
              "mold-friendly", which is worse than being smaller. 4.6vw = 66px keeps
              the artboard's 3-line shape at 1440 (was 72px / 4 lines). */}
          <LineReveal
            as="h1"
            className="max-w-[15ch] text-[clamp(2.75rem,4.6vw,4.1rem)] leading-[1.02] font-bold tracking-[-0.032em] text-deep"
            lines={HERO.titleLines}
          />
          <p className="lede mt-4 max-w-[34ch] sm:mt-6">{HERO.lede}</p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <MagButton href={HERO.primary.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.primary.label}
            </MagButton>
            <MagButton href={HERO.secondary.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.secondary.label}
            </MagButton>
          </div>
          <p className="mt-4 max-w-[42ch] border-l-2 border-accent pl-3 text-[12.5px] leading-relaxed text-ink-2">
            {HERO.status}. Demo scores show environmental conditions only; MoldGuard is not a mold diagnostic.
          </p>

          {/* the hero is tall enough that the fold can read as the end of the page;
              one quiet cue down to the next section fixes that */}
          <a
            href="#problem"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] sm:mt-8 text-ink-3 transition-colors hover:text-ink"
          >
            Scroll to see the unit
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>

        {/* the artboard's hero visual: visitor-facing 3D stage + readout overlay */}
        <div className="relative">
          <div
            className="relative mx-auto overflow-hidden rounded-shell border border-line bg-white p-2 shadow-[0_1px_2px_rgba(21,56,94,.05),0_18px_40px_-26px_rgba(21,56,94,.35)]"
            // Square, per the PDF frame, but the SIDE is capped on wide viewports.
            // Measured on the grid: the columns balance within 24px at 1440, but at
            // 1920 the square stage reaches 822px against a 624px copy column — a
            // 99px overhang each way. max-height cannot shrink an aspect-ratio box
            // (the width still drives the height), so cap the width instead: 680px
            // gives a 687px-tall stage, which is within ~60px of the copy column.
            style={{ aspectRatio: '1 / 1.01', maxWidth: 'min(100%, 680px)' }}
          >
            {/* Stage tone sampled from the artboard's hero product card: the device
                sits on a WARM, LIGHT surface (beige/cream studio), not a cool blue
                field. That contrast direction is what makes a white product read as
                a product: warm light ground, cool white object. The site had a cool
                mid-blue gradient (#e8f0f7 -> #5f7d9b) which fought the model — a
                white body on cool blue sits at the same value and dissolves.
                Measured after switching: product-region p5..p95 spread 70 -> see
                scripts/model_check.mjs + the band note in docs/FIGMA_RECONSTRUCTION_LOG.md. */}
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
                  in the SketchUp file, and the interior IS the product argument.
                  Two stickers used to say so; the artboard has neither, and the
                  hero read as crowded. Keep ONE line (the bottom one, which also
                  names the parts) and drop the "OPEN VIEW" pill — the open view is
                  self-evident once the model is on screen. */}
              <p className="mt-2 px-1 text-center text-[11px] leading-snug text-ink-3 sm:pointer-events-none sm:absolute sm:bottom-4 sm:left-4 sm:right-[188px] sm:mt-0 sm:rounded-tight sm:bg-card sm:px-3 sm:py-2 sm:text-[12px] sm:text-ink sm:backdrop-blur-sm">
                Open cutaway &middot; {HERO.stageNote}
              </p>
            </div>
          </div>

          {/* app card: navy panel, exactly the artboard's readout. It overlaps
              the photo's right edge into the white frame, as the PDF does —
              narrow enough that it clips the frame corner, not the unit. */}
          <div className="mt-3 rounded-soft border border-[#2b5c8f]/70 bg-deep/95 p-3 shadow-[0_22px_50px_-26px_rgba(15,39,71,.55)] backdrop-blur-sm sm:absolute sm:-right-4 sm:bottom-3 sm:mt-0 sm:w-[164px] sm:rounded-shell sm:p-3">
            <p className="text-[12px] font-[650] text-on-dark">MoldGuard</p>
            <p className="mt-2.5 text-[10px] tracking-[0.08em] text-on-dark-2 uppercase">Mold Risk Index</p>
            <p className="measure mt-0.5 text-[30px] leading-none font-semibold text-white">
              38<span className="text-[13px] text-on-dark-2">/100</span>
            </p>
            <p className="mt-1 flex items-center justify-between gap-2 whitespace-nowrap text-[11px] text-on-dark-2">
              <span>Conditions steady</span>
              <span className="shrink-0 rounded-full border border-[#eaf2fc33] px-1.5 py-0.5 text-[9px] tracking-[0.04em] uppercase">Demo</span>
            </p>
            {/* ONE room, not three. content.ts is explicit that multi-room is a
                planned premium tier and not in the base product, so a hero card
                listing Living room + Bedroom + Closet claimed a capability the
                FAQ then disclaims 4,000px lower. The band names are the site's
                one vocabulary (Safe / Watch / Act), not Low / Elevated. */}
            <ul className="mt-3 divide-y divide-[#eaf2fc24] border-t border-[#eaf2fc24]">
              {[['Closet', 'Watch'], ['Dehumidifier', 'Running']].map(([n, st]) => (
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
