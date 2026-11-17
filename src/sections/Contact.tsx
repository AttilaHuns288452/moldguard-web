import { CONTACT, TEAM } from '../content'
import { Reveal } from '../components/ui'

/** Contact: direct channels + the roster. Matches the approved contact page intent. */
export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="max-w-[720px]">
          <Reveal>
            <h2 className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep">
              Talk to the team.
            </h2>
          </Reveal>
          <Reveal delay={70}>
            <p className="lede mt-2">
              Ask about your space or request a quotation. Every message goes straight to the team.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:items-start">
          <Reveal>
            <ul className="grid gap-px overflow-hidden rounded-soft border border-line bg-line">
              <li className="bg-card">
                <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface">
                  <span>
                    <span className="block text-[13.5px] font-[650] text-ink">Email</span>
                    <span className="mt-0.5 block text-[15px] text-ink-2">{CONTACT.email}</span>
                  </span>
                  <span className="text-ink-3" aria-hidden="true">&rarr;</span>
                </a>
              </li>
              <li className="bg-card">
                <a href={`tel:${CONTACT.phoneHref}`} className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface">
                  <span>
                    <span className="block text-[13.5px] font-[650] text-ink">Phone</span>
                    <span className="mt-0.5 block text-[15px] text-ink-2">{CONTACT.phone}</span>
                  </span>
                  <span className="text-ink-3" aria-hidden="true">&rarr;</span>
                </a>
              </li>
            </ul>
            <p className="form-note">Prototype build. Nothing on this page is stored or submitted to a backend.</p>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-soft border border-line bg-card p-6">
              <p className="text-[13.5px] font-[650] text-ink">The team</p>
              <div className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
                {TEAM.map((m) => (
                  <div key={m.name}>
                    <span
                      className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-ink-3 to-deep text-[0.88rem] font-bold text-on-dark"
                      aria-hidden="true"
                    >
                      {m.initials}
                    </span>
                    <p className="mt-2 text-[13.5px] leading-snug font-[650] text-ink">{m.name}</p>
                    <p className="text-[10px] tracking-[0.1em] text-ink-3 uppercase">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
