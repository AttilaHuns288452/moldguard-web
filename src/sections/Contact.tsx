import { useState } from 'react'
import { CONTACT, TEAM } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { ArrowRight, Check } from 'lucide-react'

/**
 * Contact. The approved site points at email/phone; a promotional page also needs
 * a real lead-capture path, so this composes a mailto: and says exactly that
 * rather than faking a submission.
 */
export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
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
    `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${about}`)}`

  return (
    <section id="contact" className="section">
      <div className="shell">
        <div className="max-w-[720px]">
          <LineReveal
            lines={['Talk to', 'the team.']}
            className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="lede mt-3">
              Ask about your space or request a quotation. Which rooms, roughly how damp, and we
              will come back with a hardware list.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:items-start lg:gap-10">
          {/* lead form */}
          <Reveal>
            <form
              className="rounded-soft border border-line bg-card p-7 md:p-8"
              onSubmit={(e) => { e.preventDefault(); window.location.href = mailto }}
            >
              <div className="space-y-4">
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
                <Field id="c-about" label="About your space" error={touched.about ? errs.about : ''}>
                  <textarea id="c-about" required rows={4} value={about} onChange={(e) => setAbout(e.target.value)}
                    placeholder="Bathroom and a basement, damp most of the year…" className="input resize-y"
                    aria-invalid={touched.about && !!errs.about}
                    aria-describedby={touched.about && errs.about ? 'c-about-err' : undefined} />
                </Field>
              </div>

              <button
                type="submit"
                disabled={!valid}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-accent-ink px-6 py-3.5 text-[15px] font-semibold text-white transition-all duration-200 ease-[cubic-bezier(.4,0,.2,1)] hover:bg-deep active:scale-[.99] disabled:cursor-not-allowed disabled:bg-[#d6d0c8] disabled:text-[#8a837a] disabled:opacity-70 disabled:shadow-none"
              >
                Send message
                <ArrowRight className="size-4" strokeWidth={2} />
              </button>

              <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-ink-3">
                <Check className="mt-0.5 size-3 shrink-0 text-accent-ink" strokeWidth={2.5} />
                Opens your own mail app with the message ready &mdash; nothing is stored on this page.
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-4 text-[13.5px]">
                <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-8 items-center text-ink-2 underline-offset-2 hover:text-deep hover:underline">
                  {CONTACT.email}
                </a>
                <a href={`tel:${CONTACT.phoneHref}`} className="inline-flex min-h-8 items-center text-ink-2 underline-offset-2 hover:text-deep hover:underline">
                  {CONTACT.phone}
                </a>
              </div>
            </form>
          </Reveal>

          {/* roster */}
          <Reveal delay={80}>
            <div className="rounded-soft border border-line bg-card p-7 md:p-8">
              <p className="text-[13px] font-[650] tracking-[0.1em] text-ink-3 uppercase">The team</p>
              <div className="mt-6 grid gap-x-6 gap-y-6 sm:grid-cols-2">
                {TEAM.map((m) => (
                  <div key={m.name} className="flex items-start gap-3">
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eae6e0] text-[0.75rem] font-bold text-deep"
                      aria-hidden="true"
                    >
                      {m.initials}
                    </span>
                    <div>
                      <p className="text-[13.5px] leading-snug font-[650] text-ink">{m.name}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-ink-3">{m.role}</p>
                    </div>
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

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-[12.5px] font-[650] text-ink">{label}</label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-[11.5px] text-[#a8402b]">{error}</p>
      ) : null}
    </div>
  )
}
