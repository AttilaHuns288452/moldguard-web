import { TEAM } from '../content'
import { Reveal, SectionHead } from '../components/ui'

export default function Team() {
  return (
    <section id="team" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(75% 60% at 78% 100%, #eaf2fc 0%, transparent 62%)' }}
      />
      <div className="shell relative">
        <SectionHead
          index="07"
          label="The team"
          max="max-w-2xl"
          title={
            <>
              Eight students.
              <br />
              <span className="text-ink-3">One loop.</span>
            </>
          }
          lead="MoldGuard is built by a full-stack student team: hardware, firmware, backend, frontend, design, and QA, all in house."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal as="li" key={m.name} delay={i * 55}>
              <div className="group h-full bg-card p-6 transition-colors duration-300 hover:bg-[#edf4fc]">
                <span
                  className="grid size-11 place-items-center rounded-full border border-line-hi bg-[#d7e3f2] font-mono text-[0.75rem] tracking-[0.06em] text-ink-2 transition-colors duration-300 group-hover:border-accent/45 group-hover:text-accent"
                  aria-hidden="true"
                >
                  {m.initials}
                </span>
                <p className="mt-4 text-[0.9375rem] leading-snug font-medium tracking-tight text-ink">{m.name}</p>
                <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-3">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
