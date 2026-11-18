import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * The app handoff, as the PDF's last artboard: "Get the MoldGuard app." with the
 * scan instruction and the real download QR. (The 390x844 frames in the Figma
 * file are the mobile UI, not this promotional page.)
 */
export default function GetApp() {
  return (
    <section id="app" className="section section-alt">
      <div className="shell grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
        <div>
          <LineReveal
            as="h1"
            lines={splitTitle('Get the MoldGuard app.')}
            className="max-w-[20ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
          />
          <Reveal delay={80}>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-2">
              Monitor your home from anywhere.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="mt-6 text-[13px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
              Scan to get the app
            </p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <figure className="rounded-shell border border-line bg-card p-5 shadow-[0_1px_2px_rgba(21,56,94,.05),0_16px_36px_-24px_rgba(21,56,94,.35)]">
            <img
              src="/download-qr.svg"
              alt="QR code that opens the MoldGuard app download"
              width={220}
              height={220}
              className="size-[220px]"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
