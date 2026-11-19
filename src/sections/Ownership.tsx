import { OWN } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Own-it band: navy on page 1 (PDF band 0.702–0.774). Copy left, three points
 * right as a hairline-divided list — the PDF does not use cards here, and white
 * cards on the navy band were the loudest deviation on the page.
 */
export default function Ownership() {
  return (
    <section id="ownership" className="section band-dark">
      <div className="shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <Reveal>
          <div>
            <LineReveal
              lines={splitTitle(OWN.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-white"
            />
            <p className="mt-3 max-w-[560px] text-[1.05rem] leading-relaxed text-on-dark-2">{OWN.lede}</p>

            {/* Cost teaser. Figures are the feasibility study's own, including its
                caveat — the study states plainly that production is not yet
                profitable, so quoting only the build cost would mislead. */}
            <div className="mt-6 rounded-soft border border-[#eaf2fc26] bg-[#eaf2fc08] p-4">
              <p className="text-[11.5px] font-[650] tracking-[0.12em] text-on-dark-2 uppercase">{OWN.cost.label}</p>
              <p className="measure mt-1 text-[1.6rem] leading-none font-semibold text-white">{OWN.cost.figure}</p>
              <p className="mt-1 text-[12.5px] text-on-dark-2">{OWN.cost.note}</p>
              <p className="mt-3 border-t border-[#eaf2fc26] pt-3 text-[13px] leading-relaxed text-on-dark">{OWN.cost.caveat}</p>
              <p className="mt-2 text-[11.5px] text-on-dark-2">{OWN.cost.source}</p>
            </div>
          </div>
        </Reveal>
        <ul className="divide-y divide-[#eaf2fc26] border-y border-[#eaf2fc26]">
          {OWN.points.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 60}>
              <div className="py-4">
                <p className="text-[15px] font-[650] text-on-dark">{p.title}</p>
                <p className="mt-0.5 text-[14px] text-on-dark-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
