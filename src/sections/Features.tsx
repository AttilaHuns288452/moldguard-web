import { ArrowRight } from 'lucide-react'
import { FEATURES } from '../content'
import { Reveal, LineReveal, MagButton } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { IndexDial } from '../components/IndexDial'

/**
 * Feature showcase. Copy is the approved list, but a six-row checklist buries
 * the differentiator, so capability 1 gets a hero card with a live index dial
 * and the remaining five read as editorial rows.
 */
export default function Features() {
  const [hero, ...others] = FEATURES.items
  // 5 leftovers in a 2-col grid leaves an orphan cell, so the last one closes the grid full-width.
  const rest = others.slice(0, -1)
  const closing = others[others.length - 1]

  return (
    <section id="features" className="section section-alt">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[720px]">
            <LineReveal
              lines={splitTitle(FEATURES.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
          </div>
          <Reveal delay={60}>
            <MagButton href={FEATURES.cta.href} variant="ghost" icon={<ArrowRight className="size-3.5" strokeWidth={2} />}>
              {FEATURES.cta.label}
            </MagButton>
          </Reveal>
        </div>

        {/* hero capability */}
        <Reveal delay={80}>
          <article className="card-lift mt-10 grid items-center gap-8 rounded-shell border border-line bg-card p-7 shadow-[0_1px_2px_rgba(30,54,128,.05),0_10px_26px_-20px_rgba(30,54,128,.30)] md:grid-cols-[minmax(0,1fr)_auto] md:p-9">
            <div>
              <span className="measure text-[0.6875rem] tracking-[0.16em] text-accent-ink">{hero.n}</span>
              <h3 className="mt-2 text-[clamp(1.25rem,2.2vw,1.5rem)] font-[650] text-deep">{hero.title}</h3>
              <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-ink-2">{hero.body}</p>
              <p className="mt-4 border-l border-line-hi pl-4 text-[13.5px] leading-relaxed text-ink-3">
                Scored from humidity, temperature and how long those conditions persist &mdash; not a
                single humidity threshold.
              </p>
            </div>
            <IndexDial value={38} />
          </article>
        </Reveal>

        {/* remaining capabilities */}
        <div className="mt-4 grid gap-x-12 border-t-2 border-deep sm:grid-cols-2">
          {rest.map((f, i) => (
            <Reveal key={f.n} delay={i * 55}>
              <div className="card-lift flex gap-5 border-b border-line py-5">
                <span className="measure w-4 shrink-0 pt-0.5 text-[0.6875rem] tracking-[0.16em] text-accent-ink">{f.n}</span>
                <div>
                  <h3 className="text-[1.05rem] font-[650] text-deep">{f.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{f.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* closing row: full width so the grid never ends on a half-empty cell */}
        <Reveal delay={60}>
          <div className="card-lift mt-4 flex flex-wrap items-baseline justify-between gap-3 border-b border-line pb-5 pt-5">
            <div className="flex items-baseline gap-5">
              <span className="measure text-[0.6875rem] tracking-[0.16em] text-accent-ink">{closing.n}</span>
              <h3 className="text-[1.05rem] font-[650] text-deep">{closing.title}</h3>
            </div>
            <p className="text-[14.5px] text-ink-2">{closing.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
