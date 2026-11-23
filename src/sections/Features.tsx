import { ArrowRight, BadgeCheck, BellRing, ChartLine, Droplets, Gauge, Wallet } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FEATURES } from '../content'
import { Reveal, LineReveal, MagButton } from '../components/ui'
import { splitTitle } from '../lib/motion'
import '../styles/features-page.css'

/**
 * Feature index. One article, six consistent cells: the Mold Risk Index leads
 * (top rule + "core engine" tag), the rest read as a scannable capability grid.
 * No gauge here — the index is already shown as an instrument on #capabilities;
 * repeating a second dial was the same claim twice at a different number.
 */
const ICONS: Record<string, LucideIcon> = {
  '1': Gauge,
  '2': BadgeCheck,
  '3': Droplets,
  '4': ChartLine,
  '5': BellRing,
  '6': Wallet,
}

export default function Features() {
  // Shared by / and /features. On /features this section IS the features page,
  // so the "explore" CTA must not link to the page it is already on.
  const onFeaturesRoute = typeof window !== 'undefined' && /^\/features\/?$/.test(window.location.pathname)

  return (
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
            {!onFeaturesRoute && (
              <MagButton href={FEATURES.cta.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
                {FEATURES.cta.label}
              </MagButton>
            )}
          </Reveal>
        </div>

        <Reveal delay={60}>
          <article className="fx-feature-panel card-lift mt-8" data-feature-overview>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <h2 className="text-[13px] font-[650] text-deep">What you get</h2>
            </div>
            <div className="fx-feature-grid">
              {FEATURES.items.map((f) => {
                const Icon = ICONS[f.n]
                const lead = f.n === '1'
                return (
                  <div key={f.n} className="fx-feature-cell" data-lead={lead}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="fx-icon" aria-hidden="true">
                        <Icon className="size-[18px]" strokeWidth={1.75} />
                      </span>
                      <span className="measure text-[10.5px] tracking-[0.14em] text-ink-3">{f.n.padStart(2, '0')}</span>
                    </div>
                    <h3 className="mt-4 text-[1.02rem] leading-snug">{f.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{f.body}</p>
                  </div>
                )
              })}
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  )
}
