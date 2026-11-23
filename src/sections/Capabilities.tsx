import { ArrowRight, CloudSun, House, SlidersHorizontal } from 'lucide-react'
import { Reveal, LineReveal, Gauge } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { CAPABILITIES } from '../content'
import '../styles/features-page.css'

/**
 * /features opening: fact-led capability pair. The condensation photo stays as
 * the editorial anchor, but the two cards below now balance: one compact
 * instrument (score + band scale) against one process diagram (forecast → room
 * → decision) at the same optical weight. Both carry sample registers.
 */
const FLOW = [
  { icon: CloudSun, label: 'Forecast', note: 'Humidity trend for the next hours' },
  { icon: House, label: 'Room', note: 'Current + historical readings' },
  { icon: SlidersHorizontal, label: 'Decision', note: 'Pre-empt the rise, not react to it' },
]

const BANDS = [
  { label: 'Safe', range: '0–39' },
  { label: 'Watch', range: '40–69' },
  { label: 'Act', range: '70–100' },
]

export default function Capabilities() {
  const [engine, second] = CAPABILITIES.blocks
  // Same 40/70 thresholds RiskShowcase draws on its scale.
  const index = engine.index ?? 0
  const band = index >= 70 ? 'Act' : index >= 40 ? 'Watch' : 'Safe'

  return (
    <section id="capabilities" className="section band-white">
      <div className="shell">
        <div className="fx-hero">
          <div className="max-w-[780px]">
            <LineReveal
              as="h1"
              lines={splitTitle(CAPABILITIES.title)}
              className="max-w-[24ch] text-[clamp(2.2rem,4.1vw,3.9rem)] leading-[1.06] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-4 max-w-[62ch]">{CAPABILITIES.lede}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                <a className="fx-link" href="/how-it-works">
                  See the full sense → respond loop
                  <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
                </a>
                <span className="fx-tag">Illustrative readings below</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={110}>
            <figure className="fx-photo overflow-hidden rounded-shell border border-line bg-card shadow-e2">
              <img
                src="/condensation.webp"
                alt="Warm air meeting a cold stone bath, where condensation forms"
                width={1100}
                height={733}
              />
              <figcaption className="bg-deep px-5 py-3.5 text-[11px] font-[650] tracking-[0.1em] text-on-dark uppercase">
                <span>Warm air meets cold stone, and condensation wants to form.</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="fx-cap-grid">
          {/* 01 — risk engine: instrument + its own scale, no full-width gauge */}
          <Reveal>
            <article className="fx-cap-card card-lift">
              <div className="flex items-baseline justify-between gap-4">
                <span className="measure text-[11px] tracking-[0.14em] text-accent">{engine.n}</span>
                <span className="fx-tag">Sample reading</span>
              </div>
              <h2 className="mt-2">{engine.eyebrow}</h2>
              <p className="fx-cap-body">{engine.body}</p>

              <div className="fx-cap-visual">
                <div className="fx-gauge" role="img" aria-label={`Illustrative Mold Risk Index reading: ${index} of 100, ${band} band`}>
                  <Gauge value={index} className="block w-full" />
                  <div className="fx-gauge-value">
                    <p className="measure text-[2.1rem] leading-none font-semibold text-deep">{index}</p>
                    <p className="measure mt-1 text-[10.5px] tracking-[0.1em] text-ink-3 uppercase">of 100</p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Where this reading sits</p>
                  <p className="mt-1 text-[1.05rem] font-[650] text-deep">
                    {band} <span className="text-[12px] font-normal text-ink-2">· illustrated room</span>
                  </p>
                  <ul className="fx-bands mt-2">
                    {BANDS.map((b) => (
                      <li key={b.label} className="fx-band" data-active={b.label === band}>
                        <span className="fx-band-dot" aria-hidden="true" />
                        <span>{b.label}</span>
                        <span className="measure">{b.range}</span>
                      </li>
                    ))}
                  </ul>
                  <a className="fx-link mt-1 text-[12.5px]" href="#risk">
                    See the four inputs
                    <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>

          {/* 02 — predictive weather: the same visual weight, as a chain not prose */}
          <Reveal delay={80}>
            <article className="fx-cap-card card-lift">
              <div className="flex items-baseline justify-between gap-4">
                <span className="measure text-[11px] tracking-[0.14em] text-accent">{second.n}</span>
                <span className="fx-tag">Forecast pipeline</span>
              </div>
              <h2 className="mt-2">{second.eyebrow}</h2>
              <p className="fx-cap-body">{second.body}</p>

              <div className="fx-cap-visual fx-cap-visual--stack">
                <ol className="fx-flow">
                  {FLOW.map(({ icon: Icon, label, note }) => (
                    <li key={label} className="fx-flow-node">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      <p>{label}</p>
                      <span>{note}</span>
                    </li>
                  ))}
                </ol>
                <div>
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">What changes</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-2">
                    Outdoor trend plus indoor history lets the loop act on the rise <em>before</em> the room
                    crosses its threshold, instead of chasing a spike that already happened.
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
