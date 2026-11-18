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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* 01 — the risk engine, with its real reading */}
          <Reveal>
            <article className="flex h-full flex-col rounded-soft border border-line bg-card p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="measure text-[11px] tracking-[0.14em] text-accent">{engine.n}</span>
                  <h2 className="mt-1.5 text-[1.25rem] font-[650] text-deep">{engine.eyebrow}</h2>
                </div>
                <div className="shrink-0 text-right">
                  <p className="measure text-[2rem] leading-none font-semibold text-deep">{engine.index}</p>
                  <p className="mt-0.5 text-[11px] tracking-[0.12em] text-ink-3 uppercase">{engine.band}</p>
                </div>
              </div>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink-2">{engine.body}</p>
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
