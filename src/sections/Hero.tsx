import { ArrowRight } from 'lucide-react'
import { HERO, APP_MOCK } from '../content'
import { LineReveal, MagButton } from '../components/ui'

/**
 * Hero ported from the approved site: editorial split, real product photo on the
 * right with the app mock overlaid. The 3D viewer lives in its own Meet section
 * so the model reads at full size instead of being a small panel here.
 */
export default function Hero() {
  return (
    <section id="top" className="section-tight">
      <div className="shell grid items-center gap-10 md:gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14">
        {/* copy */}
        <div>
          <p className="text-[0.8125rem] font-medium tracking-[0.01em] text-ink-3">{HERO.cat}</p>
          <LineReveal
            as="h1"
            className="mt-5 max-w-[15ch] text-[clamp(2.75rem,5.8vw,4.6rem)] leading-[1.02] font-bold tracking-[-0.032em] text-deep"
            lines={[HERO.titleLead, HERO.titleTail]}
          />
          <p className="lede mt-5">{HERO.lede}</p>
          <div className="mt-[30px] flex flex-wrap gap-3">
            <MagButton href={HERO.primary.href} icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.primary.label}
            </MagButton>
            <MagButton href={HERO.secondary.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {HERO.secondary.label}
            </MagButton>
          </div>
        </div>

        {/* showcase: product photo + light phone mock, as on the approved site */}
        <div>
          <div className="relative grid min-h-[470px] place-items-end justify-center overflow-hidden rounded-shell border border-line bg-card px-[26px] pt-[34px] shadow-[0_1px_2px_rgba(30,54,128,.05),0_10px_26px_-20px_rgba(30,54,128,.30)]">
            <img
              src="/pod-hero.png"
              alt="MoldGuard Pod, a compact matte-white environmental monitor with a status light, on a wooden shelf in a bright living room"
              width={1024}
              height={1024}
              className="aspect-[1/1.06] w-full rounded-[18px] border border-line object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.02]"
              style={{ objectPosition: '42% 62%' }}
            />

            {/* phone mock: 6px black bezel, pale app screen, deck values */}
            <div className="absolute right-[18px] bottom-[18px] z-[2] w-[168px] overflow-hidden rounded-[26px] border-[6px] border-[#0a0a0a] bg-deeper shadow-[0_22px_48px_rgba(30,54,128,.28)]">
              <div className="w-full overflow-hidden rounded-[20px] border border-line bg-[#eaf1f4]">
                <div className="flex justify-between px-3.5 pt-2.5 pb-0.5 text-[10px] text-ink-3">
                  <span>MoldGuard</span>
                </div>
                <div className="px-3.5 pb-3">
                  <span className="mb-1.5 block text-[10px] font-bold tracking-[0.1em] text-ink">Mold Risk Index</span>
                  <div className="measure text-[26px] leading-[1.1] font-semibold text-deep">
                    {APP_MOCK.risk}
                    <span className="text-[12px] text-ink-3">/100</span>
                  </div>
                  <div className="mt-0.5 text-[10.5px] text-ink-3">{APP_MOCK.cap}</div>
                  <div className="mt-2.5 border-t border-line">
                    {APP_MOCK.rooms.map((r) => (
                      <div key={r.name} className="flex items-center justify-between gap-2.5 border-b border-line py-2 text-[11.5px] text-ink">
                        <span>{r.name}</span>
                        <i
                          className={`flex-none text-[10.5px] not-italic ${
                            r.state === 'Elevated' ? 'font-semibold text-deep' : r.state === 'Running' ? 'text-accent-ink' : 'text-ink-3'
                          }`}
                        >
                          {r.state}
                        </i>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
