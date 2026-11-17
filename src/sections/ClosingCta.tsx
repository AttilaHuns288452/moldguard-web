import { ArrowUpRight } from 'lucide-react'
import { CONTACT } from '../content'
import { Reveal } from '../components/ui'

export default function ClosingCta() {
  return (
    <section className="relative overflow-hidden border-y border-line py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0" aria-hidden="true"
        style={{ background: 'radial-gradient(70% 80% at 50% 0%, #eaf2fc 0%, #eaf2fc 45%, #eaf2fc 78%)' }}
      />
      <div className="shell relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Prevention that runs itself</p>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-ink">
              One message starts
              <br />
              <span className="text-ink-2">the conversation.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[1rem] leading-relaxed text-ink-2">
              Get started with MoldGuard, or ask the team anything. Fixed cost, itemized hardware,
              and a build you own outright.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 rounded-tight bg-accent-ink px-6 py-3.5 text-[0.9375rem] font-medium text-white shadow-[0_18px_50px_-20px_#2563eb] transition-colors hover:bg-[#1d4ed8]"
              >
                Send a message
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={2} />
              </a>
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2.5 rounded-tight border border-line-hi px-6 py-3.5 text-[0.9375rem] transition-colors hover:border-ice-dim/50 hover:bg-white/[0.035]"
              >
                Email us directly
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
