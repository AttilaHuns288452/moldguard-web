import { ArrowRight } from 'lucide-react'
import { HERO } from '../content'
import { LineReveal, MagButton } from '../components/ui'

/**
 * Hero: the product itself, in 3D. Nothing competes with it — no eyebrow, no
 * card chrome, no mockup. The model sits on its own lit stage and is the first
 * thing the eye lands on after the headline.
 */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* one authored background: a soft pool of light where the product stands */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg,#ffffff 0%,#f7fbff 55%,#eaf2fc 100%)',
        }}
      />

      <div className="shell relative grid items-center gap-8 pt-4 pb-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-6 lg:pt-6 lg:pb-14">
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

          {/* the honest guarantees, as a quiet line rather than a stat block */}
          <p className="mt-9 max-w-[46ch] text-[12.5px] leading-relaxed text-ink-3">
            No monitoring subscription. Fixed one-time cost. Open, itemized hardware.
            Yours after handover.
          </p>
        </div>

        {/* the artboard's hero visual: lifestyle photo + dark app card overlay */}
        <div className="relative">
          <figure className="relative overflow-hidden rounded-shell border border-line bg-white p-2.5 shadow-[0_1px_2px_rgba(21,56,94,.05),0_18px_40px_-26px_rgba(21,56,94,.35)]">
            <img
              src="/pod-hero.webp"
              alt="MoldGuard Pod on a wooden shelf in a bright living room"
              width={1024} height={1086}
              className="aspect-[1/1.1] w-full rounded-[16px] object-cover"
              style={{ objectPosition: '42% 62%' }}
            />
          </figure>

          {/* app card: navy panel, exactly the artboard's readout */}
          <div className="absolute right-3 bottom-6 w-[212px] rounded-[18px] border border-[#2b5c8f] bg-deep p-3.5 shadow-[0_26px_60px_-24px_rgba(15,39,71,.65)]">
            <p className="text-[11px] font-[650] text-on-dark">MoldGuard</p>
            <p className="mt-2 text-[10px] tracking-[0.08em] text-on-dark-2 uppercase">Mold Risk Index</p>
            <p className="measure text-[26px] leading-none font-semibold text-white">
              38<span className="text-[11px] text-on-dark-2">/100</span>
            </p>
            <p className="mt-0.5 text-[10px] text-on-dark-2">Conditions steady</p>
            <ul className="mt-2.5 divide-y divide-[#eaf2fc1f] border-t border-[#eaf2fc1f]">
              {[['Living room', 'Low', false], ['Bedroom', 'Low', false], ['Closet', 'Elevated', true], ['Dehumidifier', 'Running', true]].map(([n, st, hot]) => (
                <li key={n as string} className="flex items-center justify-between gap-2 py-1.5">
                  <span className="text-[11px] text-on-dark-2">{n}</span>
                  <span className={`text-[11px] font-[650] ${hot ? 'text-cyan-bright' : 'text-on-dark'}`} style={hot ? { color: '#7fb6ff' } : undefined}>{st}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
