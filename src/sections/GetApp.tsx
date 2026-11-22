import { useEffect, useRef, useState } from 'react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { navigate } from '../lib/route'
import StoreBadges from '../components/StoreBadges'
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
        {/* Two columns, top-aligned, left column actually populated.
            The old version centred a two-line headline against a tall QR card, so
            the left was ~80% empty whitespace floating beside a dense panel (right-
            heavy, "unfinished"). Now the left carries the promise + the store
            badges + the primary action, and the two columns start on the same line
            at lg. Below lg it stacks: copy, badges, then the scan card. */}
        <div className="grid max-w-[1180px] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-start lg:gap-8">
          <div>
            <LineReveal
              as="h1"
              lines={splitTitle('Get the MoldGuard app.')}
              className="max-w-[20ch] text-[clamp(2.2rem,4.1vw,3.9rem)] leading-[1.1] font-[650] text-deep"
            />
            <Reveal delay={80}>
              <p className="lede mt-3 max-w-[38ch]">
                Monitor your home from anywhere.
              </p>
            </Reveal>

            {/* Fills the left column and gives the page a real primary action.
                Badges are non-interactive (no listing exists) — see StoreBadges. */}
            <Reveal delay={120}>
              <div className="mt-7">
                <StoreBadges />
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a
                  href={`mailto:moldguard.dev.team@gmail.com?subject=MoldGuard%20app%20access`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-btn bg-accent-ink px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-deep"
                >
                  Request access
                </a>
                <a
                  href="/how-it-works"
                  onClick={(e) => { e.preventDefault(); navigate('how-it-works') }}
                  className="inline-flex min-h-11 items-center text-[14px] font-[650] text-accent-ink underline-offset-2 hover:underline"
                >
                  See how it works &rarr;
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="rounded-shell border border-line bg-card p-7 shadow-e1">
              {/* The QR encodes THIS page's URL, not a separate artifact, so the
                  caption must not promise an app. It is a "open this page on your
                  phone" convenience; the access path is the request button and the
                  mailto below. */}
              <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Open this page on your phone</p>
              <div className="mt-4">
                <img
                  src="/download-qr.svg"
                  alt="QR code that opens the MoldGuard download page"
                  width={250}
                  height={250}
                  className="mx-auto aspect-square h-auto w-[250px] max-w-full rounded-tight"
                />
                {/* Keep the code square even on the narrowest supported screens. */}
                <div className="min-w-0">
                  <p className="text-[12.5px] leading-relaxed text-ink-2">
                    Scan to open this page on the phone you want it on.
                  </p>
                  <a
                    href="https://moldguard-web.vercel.app/download"
                    className="mt-2 inline-flex min-h-11 items-center text-[12.5px] font-[650] text-accent-ink underline-offset-2 hover:underline"
                    // no break-all: it chopped the host mid-word ("moldguard-web.v /
                    // ercel.app/downlo / ad"). [overflow-wrap:anywhere] only breaks
                    // when the line genuinely cannot hold the token.
                    style={{ overflowWrap: 'anywhere' }}
                  >
                    moldguard-web.vercel.app/download
                  </a>
                  <p className="mt-2 border-t border-line pt-2 text-[11.5px] leading-relaxed text-ink-3">
                    Request access and the team sends the build for your phone.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* the approved Figma application frames, shown as a scrollable showcase */}
        <Reveal delay={60}>
          <h2 className="mt-12 text-[clamp(1.4rem,2.4vw,1.9rem)] font-[650] text-deep">
            Inside the app
          </h2>
        </Reveal>
        <div className="relative mt-4" ref={rowRef}>
        <ul tabIndex={0} aria-label="MoldGuard app screens, scrollable" className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pt-2 pr-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink [scrollbar-width:thin]">
          {FRAMES.map(({ el: Frame, label }) => (
            <li key={label} className="snap-start">
              <Reveal>
                {/* group scaling: the frames are authored at 390x844 and must not
                    be re-laid-out, so they are zoomed as a whole */}
                <figure className="overflow-hidden rounded-shell border border-line bg-white shadow-e2">
                  {/* the frame is authored at 390x844 and must not be re-laid-out,
                      so it is scaled as a whole. The wrapper must carry the SCALED
                      footprint: transform does not affect layout, so leaving it at
                      390px made the row claim 1628px and clip the 4th frame. */}
                  <div className="h-[793px] w-[366px] overflow-hidden">
                    <div className="origin-top-left scale-[0.94] [width:390px] [height:844px]">
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
