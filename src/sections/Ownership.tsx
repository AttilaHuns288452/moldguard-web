import { OWNERSHIP, STEPS, PLACEMENT } from '../content'
import { Reveal, SectionHead, Rule } from '../components/ui'

export default function Ownership() {
  return (
    <section id="ownership" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHead
            index="06"
            label="Hardware & ownership"
            title={
              <>
                Itemized hardware.
                <br />
                One fee.
                <br />
                <span className="text-ink-3">Yours.</span>
              </>
            }
            lead="MoldGuard is a fixed-cost build, not a subscription. Components are sourced individually and listed line by line, and the build is handed over to you."
          />

          <div>
            <ul className="divide-y divide-line border-t border-line">
              {OWNERSHIP.map((o, i) => (
                <Reveal as="li" key={o.title} delay={i * 70} className="py-6">
                  <div className="flex items-start gap-5">
                    <span className="mt-1 font-mono text-[0.625rem] text-ink-3">0{i + 1}</span>
                    <div>
                      <h3 className="text-[1.0625rem] font-medium tracking-tight text-ink">{o.title}</h3>
                      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-2">{o.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={120}>
              <p className="mt-8 border-l border-line-hi pl-4 text-[0.8125rem] leading-relaxed text-ink-3">
                The unit is built around a dehumidifier chosen for your setup. Because the hardware
                list depends on the room, the team quotes per installation rather than publishing a
                single price.
              </p>
            </Reveal>
          </div>
        </div>

        {/* ── three steps ── */}
        <Rule className="mt-20" />
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="flex gap-4">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full border border-line-hi font-mono text-[0.75rem] text-accent"
                  aria-hidden="true"
                >
                  {s.n}
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-medium text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── placement ── */}
        <Rule className="mt-20" />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <h3 className="text-[clamp(1.375rem,2.6vw,1.875rem)] font-medium tracking-tight text-ink">
              Where it belongs
            </h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">
              Tabletop or wall-mounted, near the places where humidity actually accumulates. Four
              room types are what the build is designed around.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2">
            {PLACEMENT.map((p, i) => (
              <Reveal as="li" key={p.room} delay={i * 60}>
                <div className="h-full bg-card p-5 transition-colors hover:bg-[#edf4fc]">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.9375rem] text-ink">{p.room}</span>
                    <span className="font-mono text-[0.5625rem] text-ink-3">0{i + 1}</span>
                  </div>
                  <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-3">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
