import { useState } from 'react'
import { Mail, Phone, ArrowUpRight, ExternalLink } from 'lucide-react'
import { CONTACT } from '../content'
import { Reveal, Eyebrow, DemoTag } from '../components/ui'

type Role = 'Homeowner' | 'Property manager' | 'Dormitory' | 'Other'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('Homeowner')
  const [message, setMessage] = useState('')

  /* No backend exists, and inventing one would be a lie. The form composes a
     real mailto: and says so. */
  const subject = `MoldGuard enquiry — ${role}${name ? ` — ${name}` : ''}`
  const body = [
    `Name: ${name || '—'}`,
    `Email: ${email || '—'}`,
    `Phone: ${phone || '—'}`,
    `I am a: ${role}`,
    '',
    message || '—',
  ].join('\n')
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const valid = name.trim().length > 0 && /.+@.+\..+/.test(email) && message.trim().length > 0

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(85% 70% at 50% 110%, #eaf2fc 0%, #eaf2fc 40%, transparent 72%)' }}
      />
      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.86fr)] lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-accent shadow-[0_0_12px_2px_#2563eb80]" aria-hidden="true" />
                09 / Contact
              </Eyebrow>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-6 text-[clamp(2.1rem,4.8vw,3.4rem)] font-medium leading-[1.06] text-ink">
                Let&rsquo;s keep your space
                <br />
                <span className="text-ink-2">ahead of mold.</span>
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-2">
                Tell us a little about your space and we&rsquo;ll get back to you, or reach us
                directly through any channel.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <ul className="mt-10 space-y-px overflow-hidden rounded-soft border border-line bg-line">
                <li className="bg-card">
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#d7e3f2]"
                  >
                    <span className="flex items-center gap-3">
                      <Mail className="size-4 text-ink-3" strokeWidth={1.75} />
                      <span>
                        <span className="block text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Email</span>
                        <span className="mt-0.5 block text-[0.875rem] text-ink">{CONTACT.email}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
                  </a>
                </li>
                <li className="bg-card">
                  <a
                    href={`tel:${CONTACT.phoneHref}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#d7e3f2]"
                  >
                    <span className="flex items-center gap-3">
                      <Phone className="size-4 text-ink-3" strokeWidth={1.75} />
                      <span>
                        <span className="block text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Phone</span>
                        <span className="mt-0.5 block text-[0.875rem] text-ink">{CONTACT.phone}</span>
                      </span>
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-ink-3" strokeWidth={1.75} />
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed tracking-[0.06em] text-ink-3">
                The first page of the proposal can be signed and returned by email or post.
                Approved by our course advisor.
              </p>
            </Reveal>
          </div>

          {/* form */}
          <Reveal delay={100}>
            <form
              className="panel-raised p-6 md:p-7"
              onSubmit={(e) => { e.preventDefault(); window.location.href = mailto }}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[1.0625rem] font-medium tracking-tight text-ink">Start the conversation</h3>
                <DemoTag>Opens your mail app</DemoTag>
              </div>

              <div className="mt-6 space-y-4">
                <Field label="Name" htmlFor="c-name">
                  <input
                    id="c-name" required value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" autoComplete="name"
                    className="input"
                  />
                </Field>
                <Field label="Email" htmlFor="c-email">
                  <input
                    id="c-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" autoComplete="email"
                    className="input"
                  />
                </Field>
                <Field label="Phone (optional)" htmlFor="c-phone">
                  <input
                    id="c-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="09xx xxx xxxx" autoComplete="tel"
                    className="input"
                  />
                </Field>

                <fieldset>
                  <legend className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">I am a</legend>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {(['Homeowner', 'Property manager', 'Dormitory', 'Other'] as const).map((r) => (
                      <button
                        key={r} type="button" onClick={() => setRole(r)} aria-pressed={role === r}
                        className={`rounded-tight border px-3 py-1.5 text-[0.75rem] transition-colors ${
                          role === r
                            ? 'border-accent-ink/60 bg-accent-ink/12 text-ink'
                            : 'border-line text-ink-3 hover:border-line-hi hover:text-ink-2'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Field label="Message" htmlFor="c-msg">
                  <textarea
                    id="c-msg" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your space, or ask us anything…"
                    className="input resize-y"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={!valid}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-tight bg-accent-ink px-6 py-3.5 text-[0.9375rem] font-medium text-white transition-all hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-3"
              >
                Send message
                <ExternalLink className="size-3.5" strokeWidth={2} />
              </button>

              <p className="mt-3.5 text-[0.6875rem] leading-relaxed text-ink-3">
                No backend yet: submissions route to <span className="text-ink-2">{CONTACT.email}</span>{' '}
                via your own mail app. Nothing is stored on this site.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
        {label}
      </label>
      <div className="mt-2">{children}</div>
    </div>
  )
}
