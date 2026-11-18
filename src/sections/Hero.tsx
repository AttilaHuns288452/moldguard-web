import { ArrowRight } from 'lucide-react'
import { HERO } from '../content'
import { LineReveal, MagButton } from '../components/ui'

/**
 * Hero: the product itself, in 3D. Nothing competes with it — no card chrome,
 * no mockup. The model sits on its own lit stage and is the first thing the eye
 * lands on after the headline.
 *
 * Background is the PDF's flat #f7fbff hero band (sampled 105..750pt of page 1),
 * NOT a gradient: an authored gradient is a different design direction.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#f7fbff]">
      {/* Column split measured off the PDF: content 1120pt = text 36.3% ·
          19.4% gap · photo 41.8%. The photo is SQUARE (468x473pt), not the
          landscape panel a 50/50 split produces. */}
      <div className="shell relative grid items-center gap-8 pt-10 pb-10 [@media(min-width:1352px)]:grid-cols-[minmax(0,0.87fr)_minmax(0,1fr)] [@media(min-width:1352px)]:gap-[19%] [@media(min-width:1352px)]:pt-[118px] [@media(min-width:1352px)]:pb-[75px]">
        {/* copy */}
        <div className="relative z-10">
          <p className="mb-4 text-[13px] text-ink-3">IoT mold risk prevention &amp; detection</p>
          <LineReveal
            as="h1"
            className="max-w-[15ch] text-[clamp(2.75rem,5.6vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.032em] text-deep"
            lines={HERO.titleLines}
          />
          <p className="lede mt-6 max-w-[34ch]">{HERO.lede}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <MagButton href={HERO.primary.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.primary.label}
            </MagButton>
            <MagButton href={HERO.secondary.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.secondary.label}
            </MagButton>
          </div>
        </div>

        {/* the artboard's hero visual: lifestyle photo + dark app card overlay */}
        <div className="relative">
          <figure className="relative overflow-hidden rounded-shell border border-line bg-white p-2.5 shadow-[0_1px_2px_rgba(21,56,94,.05),0_18px_40px_-26px_rgba(21,56,94,.35)]">
            <img
              src="/pod-hero.webp"
              alt="MoldGuard Pod on a wooden shelf in a bright living room"
              width={1024} height={1086}
              className="aspect-[1/1.01] w-full rounded-soft object-cover"
              style={{ objectPosition: '42% 62%' }}
            />
          </figure>

          {/* app card: navy panel, exactly the artboard's readout. It overlaps
              the photo's right edge into the white frame, as the PDF does. */}
          <div className="absolute -right-1 bottom-8 w-[236px] rounded-shell border border-[#2b5c8f] bg-deep p-4 shadow-[0_26px_60px_-24px_rgba(15,39,71,.65)]">
            <p className="text-[12px] font-[650] text-on-dark">MoldGuard</p>
            <p className="mt-2.5 flex items-center justify-between gap-2 text-[11px] tracking-[0.08em] text-on-dark-2 uppercase">
              <span>Mold Risk Index</span>
              {/* the same disclosure Meet and the data-flow figure carry: this is
                  demo data, not a live device reading */}
              <span className="rounded-full border border-[#eaf2fc33] px-1.5 py-0.5 text-[9.5px] tracking-[0.08em]">Demo</span>
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
