import { useEffect, useRef, useState } from 'react'
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
  // The right-edge fade is only honest when there IS more to scroll. At 1440 the
  // row overflows by ~40px, so an unconditional 64px fade sat on top of a fully
  // visible card and dimmed 24px of it permanently.
  const rowRef = useRef<HTMLDivElement>(null)
  const [more, setMore] = useState(false)
  useEffect(() => {
    const el = rowRef.current?.querySelector('ul')
    if (!el) return
    const check = () => setMore(el.scrollWidth - el.clientWidth > 64)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <section id="app" className="section band-white">
      <div className="shell">
        {/* ponytail: a 360px QR side column from md squeezed the copy into a narrow
            ribbon beside a card far shorter than the heading. Below lg the card now
            stacks under the copy at its own 360px width; the approved two-column
            composition is lg and up only. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-16">
          <div>
            <LineReveal
              as="h1"
              lines={splitTitle('Get the MoldGuard app.')}
              className="max-w-[20ch] text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.1] font-[650] text-deep"
            />
            <Reveal delay={80}>
              <p className="lede mt-3">
                Monitor your home from anywhere.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="max-w-[360px] rounded-shell border border-line bg-card p-6 shadow-[0_1px_2px_rgba(21,56,94,.05),0_16px_36px_-24px_rgba(21,56,94,.35)]">
              {/* The QR encodes THIS page's URL, not a separate artifact, so the
                  caption must not promise an app. It is a "open this page on your
                  phone" convenience (the link is easier to tap there than to retype),
                  and the access path is the team mailto below. Labelling it
                  "app download" is what made it read as a broken promise. */}
              <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Open this page on your phone</p>
              <img
                src="/download-qr.svg"
                alt="QR code that opens the MoldGuard download page"
                width={220}
                height={220}
                className="mt-3 size-[220px]"
              />
              <p className="mt-3 max-w-[220px] text-[12.5px] leading-relaxed text-ink-2">
                Scan to open this page on the phone you want it on, then request access below.
              </p>
              <a
                href="https://moldguard-web.vercel.app/download"
                className="mt-3 inline-flex min-h-11 items-center text-[13px] font-[650] text-accent-ink underline-offset-2 hover:underline"
              >
                moldguard-web.vercel.app/download
              </a>
              {/* Honest distribution note. There is no App Store or Play listing
                  AND no downloadable package in public/ (verified: no .apk/.ipa/
                  .aab), so "direct install ... is available" promised an install
                  that cannot happen. Access is granted by the team instead. */}
              <p className="mt-3 border-t border-line pt-3 text-[11.5px] leading-relaxed text-ink-3">
                Student prototype. Not distributed through an app store, and there is no public install package yet — the team grants access directly.
              </p>
              <a
                href={`mailto:moldguard.dev.team@gmail.com?subject=MoldGuard%20app%20access`}
                className="mt-3 inline-flex min-h-11 items-center text-[13px] font-[650] text-accent-ink underline-offset-2 hover:underline"
              >
                Need access help? Contact the team →
              </a>
            </div>
          </Reveal>
        </div>

        {/* the approved Figma application frames, shown as a scrollable showcase */}
        <Reveal delay={60}>
          <h2 className="mt-12 text-[clamp(1.4rem,2.4vw,1.9rem)] font-[650] text-deep">
            Inside the app
          </h2>
          <p className="mt-2 flex items-center gap-2 text-[11.5px] text-ink-3">
            <span className="rounded-full border border-ink-3/30 bg-ink-3/[0.07] px-2 py-0.5 font-[650] tracking-[0.1em] uppercase">
              Illustrative
            </span>
            App screens below use demo data.
          </p>
        </Reveal>
        <div className="relative mt-4" ref={rowRef}>
        <ul tabIndex={0} aria-label="MoldGuard app screens, scrollable" className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 pr-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink [scrollbar-width:thin]">
          {FRAMES.map(({ el: Frame, label }) => (
            <li key={label} className="snap-start">
              <Reveal>
                {/* group scaling: the frames are authored at 390x844 and must not
                    be re-laid-out, so they are zoomed as a whole */}
                <figure className="overflow-hidden rounded-shell border border-line bg-white shadow-[0_1px_2px_rgba(21,56,94,.06),0_20px_44px_-30px_rgba(21,56,94,.5)]">
                  {/* the frame is authored at 390x844 and must not be re-laid-out,
                      so it is scaled as a whole. The wrapper must carry the SCALED
                      footprint: transform does not affect layout, so leaving it at
                      390px made the row claim 1628px and clip the 4th frame. */}
                  <div className="h-[645px] w-[298px] overflow-hidden">
                    <div className="origin-top-left scale-[0.764] [width:390px] [height:844px]">
                      <Frame />
                    </div>
                  </div>
                </figure>
                <figcaption className="mt-2.5 text-[12px] font-[650] tracking-[0.06em] text-ink-3 uppercase">
                  {label}
                </figcaption>
              </Reveal>
            </li>
          ))}
        </ul>
        {/* fades the right edge so a clipped frame reads as "more to scroll" */}
        {more && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-paper to-transparent" aria-hidden="true" />
        )}
        </div>
      </div>
    </section>
  )
}
