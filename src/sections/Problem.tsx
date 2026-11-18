import { PROBLEM } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/** Editorial numbered list: 2-col hairline grid, mono index + title + one sentence. */
export default function Problem() {
  return (
    <section id="problem" className="section band-white">
      <div className="shell">
        <div className="max-w-[720px]">
          <Reveal>
            <LineReveal
              lines={splitTitle(PROBLEM.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
          </Reveal>
          <Reveal delay={80}>
            <p className="lede mt-2">{PROBLEM.lede}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-x-14 gap-y-0 border-t-2 border-line sm:grid-cols-2">
          {PROBLEM.items.map((it, i) => (
            <Reveal key={it.n} delay={i * 60}>
              <div className="card-lift flex h-full flex-col justify-start border-b border-line py-6">
                <span className="measure text-[11px] tracking-[0.16em] text-accent-ink">{it.n}</span>
                <h3 className="mt-2 text-[1.13rem] font-[650] text-deep">{it.title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">{it.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
