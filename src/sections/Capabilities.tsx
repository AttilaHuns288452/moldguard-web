import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { CAPABILITIES } from '../content'

/**
 * PDF page 2 opening: "Mold-specific intelligence, end to end." The two long
 * capability blocks with their real readings — the risk engine at 38 Low, and
 * the VOC caveat.
 */
export default function Capabilities() {
  const [engine, voc] = CAPABILITIES.blocks

  return (
    <section id="capabilities" className="section">
      <div className="shell">
        {/* PDF page 2 opens with a two-column hero: the copy on the left and a
            photo on the right carrying the caption banner
            "WARM AIR MEETS COLD STONE - AND CONDENSATION WANTS TO FORM."
            The site had the copy alone, which is why the page felt like text. */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-12">
          <div className="max-w-[780px]">
            <LineReveal
              as="h1"
              lines={splitTitle(CAPABILITIES.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.8rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="mt-3 max-w-[66ch] text-[1rem] leading-relaxed text-ink-2">{CAPABILITIES.lede}</p>
            </Reveal>
          </div>

          <Reveal delay={110}>
            <figure className="overflow-hidden rounded-shell border border-line bg-card shadow-[0_1px_2px_rgba(21,56,94,.05),0_20px_44px_-30px_rgba(21,56,94,.45)]">
              <img
                src="/condensation.webp"
                alt="Warm air meeting a cold stone bath, where condensation forms"
                width={1100}
                height={733}
                className="aspect-[3/2] w-full object-cover"
                style={{ height: 'auto' }}
              />
              <figcaption className="bg-deep px-5 py-3.5 text-[11px] font-[650] tracking-[0.1em] text-on-dark uppercase">
                Warm air meets cold stone &mdash; and condensation wants to form.
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* 01 — the risk engine, with its real reading */}
          <Reveal>
            <article className="flex h-full flex-col rounded-soft border border-line bg-card p-6 md:p-7">
              <div>
                <span className="measure text-[11px] tracking-[0.14em] text-accent">{engine.n}</span>
                <h2 className="mt-1.5 text-[1.25rem] font-[650] text-deep">{engine.eyebrow}</h2>
              </div>

              {/* The PDF draws this reading as an arc gauge with 38 centred and
                  Low / Elevated / High on the arc. A bare "38" with "LOW" under
                  it was a flattened copy of a real instrument and read as a
                  decorative KPI.

                  Fill = stroke-dasharray on the same path as the track, so it is
                  exactly value% of the arc by construction (no sweep flags or
                  hand-computed endpoints to get backwards).
                  Semicircle arc length = pi * r = pi * 40 = 125.66. */}
              <div className="mt-5">
                <svg viewBox="0 0 96 56" className="block w-full" aria-hidden="true">
                  <path d="M8 52a40 40 0 0 1 80 0" fill="none" stroke="var(--color-line)" strokeWidth="7" strokeLinecap="round" />
                  <path
                    d="M8 52a40 40 0 0 1 80 0"
                    fill="none"
                    stroke="var(--color-accent-ink)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${(125.66 * (engine.index ?? 0)) / 100} 125.66`}
                  />
                </svg>
                <div className="-mt-[2.6rem] text-center">
                  <p className="measure text-[1.85rem] leading-none font-semibold text-deep">{engine.index}</p>
                  <p className="mt-0.5 text-[10px] tracking-[0.12em] text-ink-3 uppercase">/ 100</p>
                </div>
                <div className="mt-2 flex justify-between text-[10px] tracking-[0.1em] text-ink-3 uppercase">
                  <span>Low</span><span>Watch</span><span>High</span>
                </div>
              </div>

              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{engine.body}</p>
            </article>
          </Reveal>

          {/* 02 — VOC, stated honestly as context */}
          <Reveal delay={80}>
            <article className="flex h-full flex-col rounded-soft border border-line bg-card p-6 md:p-7">
              <span className="measure text-[11px] tracking-[0.14em] text-accent">{voc.n}</span>
              <h2 className="mt-1.5 text-[1.25rem] font-[650] text-deep">{voc.eyebrow}</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">{voc.body}</p>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
