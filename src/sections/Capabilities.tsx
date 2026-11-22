import { Reveal, LineReveal, Gauge } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { CAPABILITIES } from '../content'

/**
 * PDF page 2 opening: "Mold-specific intelligence, end to end." The two long
 * capability blocks with their real readings — the risk engine at 38 Low, and
 * the predictive-weather block.
 */
export default function Capabilities() {
  const [engine, second] = CAPABILITIES.blocks

  return (
    <section id="capabilities" className="section band-white">
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
              className="max-w-[24ch] text-[clamp(2.2rem,4.1vw,3.9rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3 max-w-[66ch]">{CAPABILITIES.lede}</p>
            </Reveal>
          </div>

          <Reveal delay={110}>
            <figure className="overflow-hidden rounded-shell border border-line bg-card shadow-e2">
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
          <Reveal >
            <article className="card-lift flex h-full flex-col rounded-soft border border-line bg-card p-6 md:p-7">
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
                <Gauge value={engine.index ?? 0} className="block w-full" />
                <div className="-mt-[2.6rem] text-center">
                  <p className="measure text-[1.85rem] leading-none font-semibold text-deep">{engine.index}</p>
                  <p className="mt-0.5 text-[11.5px] tracking-[0.12em] text-ink-3 uppercase">/ 100</p>
                </div>
                <div className="mt-2 flex justify-between text-[11.5px] tracking-[0.1em] text-ink-3 uppercase">
                  <span>Safe</span><span>Watch</span><span>Act</span>
                </div>
              </div>

              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{engine.body}</p>
            </article>
          </Reveal>

          {/* 02 — predictive weather, per the proposal's objective */}
          <Reveal delay={80} >
            <article className="card-lift flex h-full flex-col rounded-soft border border-line bg-card p-6 md:p-7">
              <span className="measure text-[11px] tracking-[0.14em] text-accent">{second.n}</span>
              <h2 className="mt-1.5 text-[1.25rem] font-[650] text-deep">{second.eyebrow}</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">{second.body}</p>
              {/* Visual parity with card 01's gauge. This is the proposal's own
                  anticipation chain (Section: Objectives), drawn as three steps
                  rather than invented artwork. */}
              <ol className="mt-6 space-y-0 border-t border-line">
                {[
                  ['Forecast', 'Humidity trend for the next hours'],
                  ['Room', 'Current + historical readings'],
                  ['Decision', 'Pre-empt the rise, not react to it'],
                ].map(([k, v], i) => (
                  <li key={k} className="flex items-baseline gap-3 border-b border-line py-2.5 last:border-b-0">
                    <span className="measure w-4 shrink-0 text-[10.5px] tracking-[0.14em] text-accent-ink">0{i + 1}</span>
                    <div>
                      <p className="text-[13px] font-[650] text-deep">{k}</p>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-ink-2">{v}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
