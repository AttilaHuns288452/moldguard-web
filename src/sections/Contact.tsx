import { useState } from 'react'
import { CONTACT, TEAM, CONTACT_PAGE } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { ArrowRight, Check } from 'lucide-react'

/**
 * PDF page 4, section for section:
 *   "Let's keep your space ahead of mold."   hero
 *   "Start the conversation."                the form (Name / Email / Phone / I am a… / Message)
 *   "Prefer direct?"                         EMAIL / PHONE / QUOTE / APP
 *   "From message to quote in three steps."  01 / 02 / 03
 *   "Eight students. One loop."              the team
 *   "Ready when you are."                    closing CTA
 *
 * The previous version rendered only the hero, a 3-field form and the roster under
 * the wrong label, which is why the page read as a stub. The form still composes
 * a mailto: and says so — there is no backend and it does not pretend otherwise.
 */
export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('Homeowner')
  const [about, setAbout] = useState('')

  const errs = {
    name: name.trim().length === 0 ? 'Enter your name' : '',
    email: /.+@.+\..+/.test(email) ? '' : 'Enter an email we can reply to',
    about: about.trim().length === 0 ? 'Tell us about the space' : '',
  }
  const touched = { name: name.length > 0, email: email.length > 0, about: about.length > 0 }
  const valid = !errs.name && !errs.email && !errs.about
  const mailto =
    `mailto:${CONTACT.email}?subject=${encodeURIComponent(`MoldGuard enquiry — ${name || 'website'}`)}` +
    `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone || '—'}\nI am a: ${role}\n\n${about}`)}`

  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="max-w-[720px]">
          <LineReveal
            as="h1"
            lines={["Let's keep your space", 'ahead of mold.']}
            className="max-w-[24ch] text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.1] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="lede mt-3">{CONTACT_PAGE.lede}</p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-10">
          {/* ── Start the conversation ── */}
          <Reveal>
            <form
              className="rounded-soft border border-line bg-card p-7 md:p-8"
              onSubmit={(e) => { e.preventDefault(); window.location.href = mailto }}
            >
              <h2 className="text-[1.15rem] font-[650] text-deep">{CONTACT_PAGE.formTitle}</h2>

              <div className="mt-5 space-y-4">
                <Field id="c-name" label="Name" error={touched.name ? errs.name : ''}>
                  <input id="c-name" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" autoComplete="name" className="input"
                    aria-invalid={touched.name && !!errs.name}
                    aria-describedby={touched.name && errs.name ? 'c-name-err' : undefined} />
                </Field>
                <Field id="c-email" label="Email" error={touched.email ? errs.email : ''}>
                  <input id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email" className="input"
                    aria-invalid={touched.email && !!errs.email}
                    aria-describedby={touched.email && errs.email ? 'c-email-err' : undefined} />
                </Field>
                <Field id="c-phone" label="Phone (optional)">
                  <input id="c-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxxx" autoComplete="tel" className="input" />
                </Field>
                <Field id="c-role" label="I am a...">
                  <select id="c-role" value={role} onChange={(e) => setRole(e.target.value)} className="input">
                    {['Homeowner', 'Renter', 'Property manager', 'Dormitory or school', 'Other'].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field id="c-about" label="Message" error={touched.about ? errs.about : ''}>
                  <textarea id="c-about" required rows={4} value={about} onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about your space, or ask us anything..."
                    className="input resize-y"
                    aria-invalid={touched.about && !!errs.about}
                    aria-describedby={touched.about && errs.about ? 'c-about-err' : undefined} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={!valid}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-deep active:scale-[.99] disabled:cursor-not-allowed disabled:bg-[#d7e3f2] disabled:text-[#3f5670] disabled:opacity-100"
              >
                Send message
                <ArrowRight className="size-4" strokeWidth={2} />
              </button>

              <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-3">
                <Check className="mt-0.5 size-3 shrink-0 text-accent-ink" strokeWidth={2.5} />
                No backend — this opens your own mail app with the message ready, addressed to {CONTACT.email}.
              </p>
            </form>
          </Reveal>

          {/* ── Prefer direct? ── */}
          <Reveal delay={80}>
            <div className="rounded-soft border border-line bg-card p-7 md:p-8">
              <h2 className="text-[1.15rem] font-[650] text-deep">{CONTACT_PAGE.directTitle}</h2>
              <ul className="mt-5 divide-y divide-line">
                <li className="py-4">
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Email</p>
                  <a href={`mailto:${CONTACT.email}`}
                    className="mt-1 inline-flex min-h-11 items-center text-[15px] font-[650] text-deep underline-offset-2 hover:underline">
                    {CONTACT.email}
                  </a>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{CONTACT_PAGE.directNotes[0]}</p>
                </li>
                <li className="py-4">
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Phone</p>
                  <a href={`tel:${CONTACT.phoneHref}`}
                    className="mt-1 inline-flex min-h-11 items-center text-[15px] font-[650] text-deep underline-offset-2 hover:underline">
                    {CONTACT.phone}
                  </a>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{CONTACT_PAGE.directNotes[1]}</p>
                </li>
                <li className="py-4">
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Quote</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{CONTACT_PAGE.directNotes[2]}</p>
                </li>
                <li className="py-4">
                  <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">App</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">
                    {CONTACT_PAGE.app.kicker} {CONTACT_PAGE.app.body}{' '}
                    <a href="/download" className="inline-flex min-h-11 items-center font-[650] text-accent-ink underline-offset-2 hover:underline">
                      {CONTACT_PAGE.app.cta}
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        {/* ── From message to quote in three steps ── */}
        <div className="mt-14 border-t border-line pt-10">
          <Reveal>
            <h2 className="max-w-[22ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">
              {CONTACT_PAGE.steps.title}
            </h2>
          </Reveal>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-soft border border-line bg-line md:grid-cols-3">
            {CONTACT_PAGE.steps.items.map((s2, i) => (
              <Reveal as="li" key={s2.n} delay={i * 60}>
                <div className="h-full bg-card px-5 py-5">
                  <span className="measure text-[11px] tracking-[0.14em] text-accent">{s2.n}</span>
                  <h3 className="mt-1.5 text-[15px] font-[650] text-deep">{s2.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{s2.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* ── Eight students. One loop. ── */}
        <div className="mt-14 border-t border-line pt-10">
          <Reveal>
            <h2 className="max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">
              {CONTACT_PAGE.teamTitle}
            </h2>
            <p className="mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2">{CONTACT_PAGE.teamLede}</p>
          </Reveal>
          <ul className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 40}>
                <div className="flex items-start gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e4eaf2] text-[0.75rem] font-bold text-deep"
                    aria-hidden="true"
                  >
                    {m.initials}
                  </span>
                  <div>
                    <p className="text-[13.5px] leading-snug font-[650] text-ink">{m.name}</p>
                    <p className="mt-0.5 text-[11px] leading-snug text-ink-3">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* ── Ready when you are. ── */}
        <Reveal>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-shell border border-line bg-paper-deep px-7 py-8 md:px-10">
            <div>
              <h2 className="text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">{CONTACT_PAGE.closing.title}</h2>
              <p className="mt-1.5 text-[1rem] text-ink-2">One message starts the conversation.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center rounded-[10px] bg-accent-ink px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-deep">
                {CONTACT_PAGE.closing.primary}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center rounded-[10px] border border-line-hi bg-card px-6 py-3 text-[15px] font-semibold text-ink transition-colors hover:border-ink-3">
                {CONTACT_PAGE.closing.secondary}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[12.5px] font-[650] text-ink">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[11.5px] text-[#c0392b]">{error}</p>
      ) : null}
    </div>
  )
}
