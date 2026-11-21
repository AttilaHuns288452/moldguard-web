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
          <p className="mb-4 text-[13px] text-ink-3">IoT mold risk prevention &amp; detection</p>
          <LineReveal
            as="h1"
            className="max-w-[15ch] text-[clamp(2.75rem,5.6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.032em] text-deep"
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
            className="relative overflow-hidden rounded-shell border border-line bg-white p-2 shadow-[0_1px_2px_rgba(21,56,94,.05),0_18px_40px_-26px_rgba(21,56,94,.35)]"
            style={{ aspectRatio: '1 / 1.01' }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-soft bg-[radial-gradient(120%_90%_at_50%_18%,#e2edf7_0%,#b8cede_52%,#91aac0_100%)]">
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
                  in the SketchUp file, and the interior IS the product argument
                  (thermoelectric stack, heatsink, fan, tank). Saying so turns a
                  "broken front door" into a cutaway. */}
              <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full bg-deep/90 px-3 py-1 text-[11px] font-[650] tracking-[0.12em] text-on-dark uppercase backdrop-blur-sm">
                Open view &middot; inside the unit
              </p>
              <p className="mt-2 px-1 text-center text-[11px] leading-snug text-ink-3 sm:pointer-events-none sm:absolute sm:bottom-4 sm:left-4 sm:right-[188px] sm:mt-0 sm:rounded-tight sm:bg-card/92 sm:px-3 sm:py-2 sm:text-[11.5px] sm:text-ink-2 sm:backdrop-blur-sm">
                {HERO.stageNote}
              </p>
            </div>
          </div>

          {/* app card: navy panel, exactly the artboard's readout. It overlaps
              the photo's right edge into the white frame, as the PDF does —
              narrow enough that it clips the frame corner, not the unit. */}
          <div className="mt-3 rounded-soft border border-[#2b5c8f]/70 bg-deep/95 p-3 shadow-[0_22px_50px_-26px_rgba(15,39,71,.55)] backdrop-blur-sm sm:absolute sm:-right-6 sm:-bottom-5 sm:mt-0 sm:w-[164px] sm:rounded-shell sm:p-3">
            <p className="text-[12px] font-[650] text-on-dark">MoldGuard</p>
            <p className="mt-2.5 flex items-center justify-between gap-2 text-[11px] tracking-[0.08em] text-on-dark-2 uppercase">
              <span>Mold Risk Index</span>
              {/* the same disclosure Meet and the data-flow figure carry: this is
                  demo data, not a live device reading */}
              <span className="rounded-full border border-[#eaf2fc33] px-1.5 py-0.5 text-[10.5px] tracking-[0.08em]">Demo</span>
            </p>
            <p className="measure mt-0.5 text-[30px] leading-none font-semibold text-white">
              38<span className="text-[13px] text-on-dark-2">/100</span>
            </p>
            <p className="mt-1 text-[11.5px] text-on-dark-2">Conditions steady</p>
            <ul className="mt-3 divide-y divide-[#eaf2fc24] border-t border-[#eaf2fc24]">
              {[['Living room', 'Low', false], ['Bedroom', 'Low', false], ['Closet', 'Elevated', true], ['Dehumidifier', 'Running', true]].map(([n, st, hot]) => (
                <li key={n as string} className="flex items-center justify-between gap-2 py-2">
                  <span className="text-[12px] text-on-dark-2">{n}</span>
                  <span className={`text-[12px] font-[650] ${hot ? 'text-on-dark' : 'text-on-dark'}`} style={hot ? { color: '#7fb6ff' } : undefined}>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
