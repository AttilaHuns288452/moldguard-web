import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle, useReducedMotion } from '../lib/motion'
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
  { el: FrameHome, label: 'Home', note: 'Illustrative screen' },
  { el: FrameDetail, label: 'Room detail', note: 'Illustrative screen' },
  { el: FrameControl, label: 'Control', note: 'Illustrative screen' },
  { el: FrameAnalytics, label: 'Analytics', note: 'Illustrative screen' },
]

export default function GetApp() {
  // A continuous ticker: the track holds the four screens twice and drifts by
  // exactly one copy, so it never visibly resets. Pausing is available (WCAG
  // 2.2.2) and the whole thing is off for reduced-motion users.
  const reduced = useReducedMotion()
  const [autoplay, setAutoplay] = useState(true)
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
              <p className="lede mt-3 max-w-[40ch]">
                The companion app pairs with the MoldGuard device: live status, alerts and control for the room it watches. It is not a stand-alone service.
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
              <p className="mt-4 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
                New to MoldGuard? The app comes with the device. Request a quotation for your room and it covers hardware, price and next steps.
              </p>
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
        {/* A rule separates the two jobs of this section: getting access to the
            page/device (above) and seeing what the app looks like (below). Without
            it the screens read as part of the QR card's block. */}
        <div className="mt-14 border-t border-line pt-10">
        <Reveal delay={60}>
          <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">Illustrative app screens</p>
          <h2 className="mt-2 text-[clamp(1.4rem,2.4vw,1.9rem)] font-[650] text-deep">
            Inside the app
          </h2>
        </Reveal>
        <div className="relative mt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-ink-3">Four screens from the companion app, scrolling.</p>
          <button type="button" onClick={() => setAutoplay((v) => !v)} aria-label={autoplay ? 'Pause the app screen ticker' : 'Resume the app screen ticker'} aria-pressed={autoplay} disabled={reduced} className="grid size-10 place-items-center rounded-full border border-line-hi bg-white text-ink-2 transition-colors hover:border-accent hover:text-accent-ink focus-visible:outline-2 focus-visible:outline-accent-ink disabled:opacity-40">{autoplay && !reduced ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}</button>
        </div>
        {/* Continuous ticker, not a slide-stepper: the track is rendered twice and
            translated by exactly one copy, so it loops with no visible seam. */}
        <div
          className="group/ticker relative overflow-hidden pt-2 pb-4"
        >
        <ul aria-label="MoldGuard app screens ticker" style={{ animationPlayState: autoplay ? 'running' : 'paused' }}
          className="flex w-max gap-5 will-change-transform [animation:app-marquee_38s_linear_infinite] group-hover/ticker:[animation-play-state:paused] motion-reduce:!animate-none">
          {[...FRAMES, ...FRAMES].map(({ el: Frame, label, note }, idx) => (
            <li key={`${label}-${idx}`} aria-hidden={idx >= FRAMES.length ? 'true' : undefined}>
              <Reveal>
                {/* group scaling: the frames are authored at 390x844 and must not
                    be re-laid-out, so they are zoomed as a whole */}
                <figure className="overflow-hidden rounded-shell border border-line bg-white shadow-e2">
                  {/* the frame is authored at 390x844 and must not be re-laid-out,
                      so it is scaled as a whole. The wrapper must carry the SCALED
                      footprint: transform does not affect layout, so leaving it at
                      390px made the row claim 1628px and clip the 4th frame. */}
                  <div className="h-auto w-[min(366px,100%)] overflow-hidden">
                    <div className="origin-top-left scale-[0.94] [width:390px] [height:844px]">
                      <Frame />
                    </div>
                  </div>
                </figure>
                <figcaption className="mt-2.5 text-[12px] font-[650] tracking-[0.06em] text-ink-3 uppercase">
                  {label} <span className="font-normal tracking-normal normal-case">· {note}</span>
                </figcaption>
              </Reveal>
            </li>
          ))}
        </ul>
        </div>
        </div>
        </div>
      </div>
    </section>
  )
}
