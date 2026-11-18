import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { FrameHome, FrameDetail, FrameControl, FrameAnalytics } from '../figma/PhoneFrames'

/**
 * The app handoff, as the PDF's last artboard: "Get the MoldGuard app." with the
 * scan instruction and the real download QR.
 *
 * The four 390x844 frames below are the approved Figma application frames, ported
 * pixel-for-pixel from figma/MoldGuard_All_23.html (the file's own literals).
 * They were built in bd128e7 and then dropped from the page, so the only thing a
 * visitor ever saw of the app was a QR code. The frames are scaled as a group and
 * NOT redesigned: their internals stay exactly as the Figma file defines them.
 */
const FRAMES = [
  { el: FrameHome, label: 'Home' },
  { el: FrameDetail, label: 'Room detail' },
  { el: FrameControl, label: 'Control' },
  { el: FrameAnalytics, label: 'Analytics' },
]

export default function GetApp() {
  return (
    <section id="app" className="section section-alt">
      <div className="shell">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-16">
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

        {/* the approved Figma application frames, shown as a scrollable showcase */}
        <Reveal delay={60}>
          <p className="mt-12 text-[13px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
            Inside the app
          </p>
        </Reveal>
        <ul className="mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 [scrollbar-width:thin]">
          {FRAMES.map(({ el: Frame, label }) => (
            <li key={label} className="snap-start">
              <Reveal>
                {/* group scaling: the frames are authored at 390x844 and must not
                    be re-laid-out, so they are zoomed as a whole */}
                <figure className="overflow-hidden rounded-shell border border-line bg-white shadow-[0_1px_2px_rgba(21,56,94,.06),0_20px_44px_-30px_rgba(21,56,94,.5)]">
                  <div className="origin-top-left scale-[0.78] [width:390px] [height:calc(844px*0.78)]">
                    <Frame />
                  </div>
                </figure>
                <figcaption className="mt-2.5 text-[12px] font-[650] tracking-[0.06em] text-ink-3 uppercase">
                  {label}
                </figcaption>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
