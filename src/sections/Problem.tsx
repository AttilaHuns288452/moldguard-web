import { Reveal, SectionHead } from '../components/ui'

const COSTS = [
  {
    k: '01',
    lead: 'You find it after it is visible.',
    body: 'Mold announces itself with a stain, a smell, or a cough. By then the colony is already established and the damage is structural, not cosmetic. Every week of early signal is a week of remediation you never pay for.',
  },
  {
    k: '02',
    lead: 'One number is not a risk model.',
    body: 'Conventional controllers trigger on a humidity threshold. A single shower spikes humidity for ten minutes and trips the trigger; a genuinely dangerous room sitting at 78% for days can look normal on average. Duration is what mold cares about.',
  },
  {
    k: '03',
    lead: 'Passive absorbers absorb. Nothing else.',
    body: 'Chemical moisture absorbers have no sensors, no data, and no automation. They are a consumable sitting in a closet, not a monitoring system.',
  },
  {
    k: '04',
    lead: 'Monitoring you cannot afford to scale.',
    body: 'Commercial systems cost mid-to-high retail hardware, lock you into a vendor app, and still model humidity rather than mold. A building with twelve problem rooms is twelve subscriptions.',
  },
]

export default function Problem() {
  return (
    <section id="problem" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index="01"
              label="The problem"
              title={
                <>
                  Mold is a slow event
                  <br />
                  that everyone measures
                  <br />
                  <span className="text-ink-3">as an instant.</span>
                </>
              }
              lead="Mold does not appear. It accumulates. The conditions that produce it build quietly for days in exactly the rooms nobody instruments: the bathroom, the closet, the basement corner."
            />
            <Reveal delay={220}>
              <p className="mt-9 max-w-sm border-l border-line-hi pl-5 text-[0.9375rem] leading-relaxed text-ink-3">
                Four failure modes, and every one of them is a measurement problem before it is a
                mold problem.
              </p>
            </Reveal>
          </div>

          <ol className="divide-y divide-line border-t border-line">
            {COSTS.map((c, i) => (
              <Reveal as="li" key={c.k} delay={i * 80} className="group relative py-8 first:pt-0">
                <div className="flex items-start gap-6">
                  <span className="mt-1 font-mono text-[0.6875rem] tracking-[0.16em] text-ink-3 transition-colors group-hover:text-accent">
                    {c.k}
                  </span>
                  <div>
                    <h3 className="text-[1.1875rem] font-medium tracking-tight text-ink">{c.lead}</h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">{c.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
