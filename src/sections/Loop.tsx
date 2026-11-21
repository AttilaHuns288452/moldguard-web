
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { LOOP, SETUP } from '../content'
import { FrameHome, FrameDetail, FrameControl, FrameAnalytics } from '../figma/PhoneFrames'
import SensorPodFrame from '../figma/SensorPodFrame'
import RiskGaugeCard from '../figma/RiskGaugeCard'

/**
 * The approved Figma application frames, one per stage. PDF page 3 puts a visual
 * beside each of the four numbered blocks (sensor pod, gauge card, phone mockup,
 * product card); these are the real Figma frames for exactly those moments, so
 * each stage shows what the app looks like at that point in the loop.
 */
const STAGE_FRAME = [FrameHome, FrameDetail, FrameControl, FrameAnalytics]
const STAGE_FRAME_LABEL = [
  'Both pods, live status',
  'Risk reading and VOC detail',
  'Auto-pilot and manual override',
  'Humidity and dew-point history',
]

/**
 * PDF page 3: the closed loop. A rail of four stages (SENSE → ANALYZE →
 * RESPOND → PROTECT); selecting one shows its own copy. The rail is the
 * architecture, the panel is the explanation.
 */
export default function Loop() {

  return (
    <section id="how" className="section band-white">
      <div className="shell">
        <div className="max-w-[760px]">
          <LineReveal
            as="h1"
            lines={splitTitle(LOOP.title)}
            className="max-w-[26ch] text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.08] font-[650] text-deep"
          />
          <Reveal delay={70}>
            <p className="lede mt-3 max-w-[62ch]">{LOOP.lede}</p>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-[12.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">{LOOP.label}</p>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-ink-3">
              <span className="rounded-full border border-ink-3/30 bg-ink-3/[0.07] px-2 py-0.5 font-[650] tracking-[0.08em] uppercase">
                Illustrative
              </span>
              App screens and readouts below use demo data, not a live device.
            </p>
          </Reveal>
        </div>

        {/* all four stages, stacked as the PDF lays them out */}
        <ol className="mt-5 divide-y divide-line overflow-hidden rounded-soft border border-line bg-card">
          {LOOP.stages.map((stg, n) => (
            <li key={stg.n}>
              <Reveal delay={n * 50}>
                <div className="grid gap-6 px-6 py-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(212px,220px)] md:items-center md:gap-8 md:px-8 md:py-6">
                  <div className="flex items-start gap-3 md:w-20 md:flex-col md:gap-1.5">
                    <span className="measure text-[12px] tracking-[0.14em] text-accent">{stg.n}</span>
                    <span className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{stg.kicker}</span>
                  </div>
                  <div>
                    <h2 className="text-[clamp(1.125rem,2vw,1.375rem)] font-[650] text-deep">{stg.head}</h2>
                    <p className="mt-2 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2 md:max-w-none">{stg.body}</p>
                    <p className="mt-2.5 text-[12.5px] text-ink-3">{stg.meta}</p>
                  </div>
                  {/* the approved Figma frame for this stage of the loop. The frame is
                      authored at 390x844 and must not be re-laid-out, so it is scaled
                      as a whole and the wrapper carries the SCALED footprint. */}
                  {/* one column, one height: every stage visual occupies the same
                      box so the four rows share a rhythm instead of 206/198/474/474.
                      The box hugs its tallest child (frame 302 + caption 20 at xl)
                      rather than adding a fixed 368 gutter of dead air under it.

                      NOT hidden on mobile any more. It used to be `hidden md:flex`,
                      which turned /how-it-works into a wall of text on a phone while
                      the intro promised "app screens and readouts below" — and the
                      390x844 frames are already authored at exactly phone width.
                      Cap the height so a 390px frame does not own the viewport. */}
                  <div className="flex h-[240px] w-full flex-col items-center justify-center md:h-[216px] lg:h-[282px] xl:h-[322px]">
                    {n === 0
                      ? <SensorPodFrame />
                      : n === 1
                      ? <RiskGaugeCard />
                      : (
                        <figure className="overflow-hidden rounded-soft border border-line bg-white shadow-[0_1px_2px_rgba(21,56,94,.06),0_16px_36px_-28px_rgba(21,56,94,.5)]">
                          <div className="h-[240px] w-[111px] overflow-hidden md:h-[196px] md:w-[91px] lg:h-[262px] lg:w-[121px] xl:h-[302px] xl:w-[140px]">
                            <div className="origin-top-left scale-[0.285] md:scale-[0.233] lg:scale-[0.31] xl:scale-[0.358] [width:390px] [height:844px]">
                              {(() => { const F = STAGE_FRAME[n]; return <F /> })()}
                            </div>
                          </div>
                        </figure>
                      )}
                    {n > 1 && (
                      <p className="mt-1.5 text-center text-[10px] leading-snug text-ink-3">{STAGE_FRAME_LABEL[n]}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* PDF page 3: setup */}
        <div className="mt-14 border-t border-line pt-10">
          <Reveal>
            <h2 className="max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">{SETUP.title}</h2>
          </Reveal>
          <ol className="mt-6 grid gap-px overflow-hidden rounded-soft border border-line bg-line md:grid-cols-3">
            {SETUP.steps.map((s, n) => (
              <Reveal as="li" key={s.n} delay={n * 60}>
                <div className="h-full bg-card px-5 py-5">
                  <span className="measure text-[11px] tracking-[0.14em] text-accent">0{s.n}</span>
                  <h3 className="mt-1.5 text-[15px] font-[650] text-deep">{s.title}</h3>
                  <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
