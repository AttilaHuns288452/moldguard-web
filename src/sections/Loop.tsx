import { useRef, useState, type KeyboardEvent } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'
import { LOOP, SETUP } from '../content'
import { FrameControl, FrameAnalytics } from '../figma/PhoneFrames'
import SensorPodFrame from '../figma/SensorPodFrame'
import RiskGaugeCard from '../figma/RiskGaugeCard'
import './Loop.css'

/**
 * PDF page 3: the closed loop, drawn as the four-column rail — one shared navy
 * rule, four equal tabs, thin dividers, small blue chevrons between them and a
 * dashed return from PROTECT back to SENSE. Selecting a tab swaps ONE detail
 * panel beneath the rail, so the walkthrough explains one moment at a time
 * instead of printing four near-identical rows.
 *
 * WAI-ARIA tabs: arrow keys / Home / End move and activate, and the selected
 * tab is marked by shape (filled index chip + accent rule + raised band), not
 * colour alone. All four panels stay in the DOM — hidden, not unmounted — so
 * print, Ctrl+F and the prerendered HTML still carry every stage's copy.
 *
 * The visuals are the approved Figma frames for each moment, scaled whole (they
 * are authored at 390x844 and must not be re-laid-out). The app screens sit at
 * 215px wide, so their rows are readable rather than 140px thumbnails.
 */

const VISUAL = [
  { node: <SensorPodFrame label="Sensor pod" />, caption: 'Sensor pod · live status light' },
  { node: <RiskGaugeCard />, caption: 'Risk dial · sample reading' },
  {
    node: (
      <div className="loop-phone">
        <div className="loop-phone-inner"><FrameControl /></div>
      </div>
    ),
    caption: 'Sample app screen · auto-pilot and manual override',
  },
  {
    node: (
      <div className="loop-phone">
        <div className="loop-phone-inner"><FrameAnalytics /></div>
      </div>
    ),
    caption: 'Sample app screen · humidity and dew-point history',
  },
]

export default function Loop() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = LOOP.stages.length - 1
    const focused = tabRefs.current.findIndex((tab) => tab === document.activeElement)
    const current = focused < 0 ? active : focused
    let next: number | null = null
    if (e.key === 'ArrowRight') next = current === last ? 0 : current + 1
    else if (e.key === 'ArrowLeft') next = current === 0 ? last : current - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="how" className="section band-white">
      <div className="shell">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-end lg:gap-14">
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                {LOOP.label}
              </p>
            </Reveal>
            <LineReveal
              as="h1"
              lines={splitTitle(LOOP.title)}
              className="mt-4 max-w-[24ch] text-[clamp(2.2rem,4.1vw,3.9rem)] leading-[1.08] font-[650] text-deep"
            />
          </div>
          <Reveal delay={70}>
            <p className="lede lg:pb-2">{LOOP.lede}</p>
          </Reveal>
        </div>

        <Reveal delay={110}>
          <div className="mt-10 overflow-hidden rounded-soft border border-line bg-card shadow-e1">
            {/* one shared dark rule across the whole rail */}
            <div aria-hidden="true" className="h-[3px] w-full bg-deep" />

            <div
              role="tablist"
              aria-label="The closed loop: sense, analyze, respond, protect"
              onKeyDown={onKey}
              className="grid grid-cols-2 md:grid-cols-4"
            >
              {LOOP.rail.map((r, i) => {
                const on = i === active
                return (
                  <button
                    key={r.n}
                    ref={(el) => { tabRefs.current[i] = el }}
                    type="button"
                    role="tab"
                    id={`how-tab-${i}`}
                    aria-selected={on}
                    aria-controls={`how-panel-${i}`}
                    tabIndex={on ? 0 : -1}
                    data-how-stage={r.name.toLowerCase()}
                    onClick={() => setActive(i)}
                    className={`relative flex flex-col gap-2.5 border-line px-4 py-4 text-left transition-colors md:px-5 md:py-5 ${
                      i % 2 === 1 ? 'border-l' : ''
                    } ${i >= 2 ? 'border-t md:border-t-0' : ''} ${
                      i > 0 ? 'md:border-l' : ''
                    } ${on ? 'bg-paper-deep' : 'hover:bg-paper-deep/60'}`}
                  >
                    {on && <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-accent" />}
                    <span className="flex items-center justify-between gap-2">
                      <span
                        className={`measure grid size-7 place-items-center rounded-[4px] text-[11px] ${
                          on ? 'bg-deep font-semibold text-white' : 'text-ink-3'
                        }`}
                      >
                        {r.n}
                      </span>
                      {i < LOOP.rail.length - 1 && (
                        <ChevronRight
                          aria-hidden="true"
                          strokeWidth={2.2}
                          className="hidden size-4 text-accent md:absolute md:top-6 md:right-3 md:block"
                        />
                      )}
                    </span>
                    <span className={`loop-stage-name text-[clamp(1.125rem,2.4vw,2.25rem)] font-[650] leading-none tracking-[-0.025em] ${on ? 'text-deep' : 'text-ink-2'}`}>
                      {r.name}
                    </span>
                    <span className="text-[13.5px] leading-snug text-ink-2">{r.meta}</span>
                  </button>
                )
              })}
            </div>

            {/* dashed return: PROTECT feeds back into SENSE */}
            <div className="relative flex items-center justify-center border-t border-line px-4 py-3.5">
              <svg
                aria-hidden="true"
                viewBox="0 0 1000 16"
                preserveAspectRatio="none"
                fill="none"
                className="absolute inset-x-8 top-4 h-3"
              >
                <path d="M985 2v5M985 7H92" stroke="#9fb8d4" strokeWidth="1.4" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                <path d="m99 3-7 4 7 4" stroke="#2563eb" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
              </svg>
              <p className="relative flex items-center gap-1.5 bg-card px-2.5 text-[10.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
                <RotateCcw aria-hidden="true" strokeWidth={2} className="size-3" />
                Continuous monitoring returns to sense
              </p>
            </div>

            {LOOP.stages.map((stg, i) => (
              <div
                key={stg.n}
                role="tabpanel"
                id={`how-panel-${i}`}
                aria-labelledby={`how-tab-${i}`}
                tabIndex={i === active ? 0 : -1}
                hidden={i !== active}
                data-how-panel={LOOP.rail[i].name.toLowerCase()}
                className="loop-panel grid gap-8 border-t border-line px-5 py-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-12 md:px-8 md:py-9"
              >
                <div>
                  <h2 className="mt-2 text-[clamp(1.25rem,2.2vw,1.65rem)] leading-tight font-[650] text-deep">
                    {stg.head}
                  </h2>
                  <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2">{stg.body}</p>
                  <p className="mt-4 max-w-[52ch] border-t border-line pt-3 text-[13px] leading-relaxed text-ink-3">
                    {stg.meta}
                  </p>
                </div>

                <figure className="flex w-full flex-col items-center gap-2 md:w-auto">
                  {VISUAL[i].node}
                  <figcaption className="max-w-[215px] text-center text-[12px] leading-snug text-ink-3">
                    {VISUAL[i].caption}
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </Reveal>

        {/* PDF page 3: setup */}
        <div className="mt-16 border-t border-line pt-10">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h2 className="max-w-[24ch] text-[clamp(1.5rem,2.8vw,2.1rem)] font-[650] text-deep">{SETUP.title}</h2>
              <p className="text-[13px] text-ink-3">{SETUP.caption}</p>
            </div>
          </Reveal>
          <ol className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-3">
            {SETUP.steps.map((s, n) => (
              <Reveal as="li" key={s.n} delay={n * 60} className="border-t-2 border-deep pt-4">
                <span className="measure text-[11px] tracking-[0.14em] text-accent">0{s.n}</span>
                <h3 className="mt-1.5 text-[15px] font-[650] text-deep">{s.title}</h3>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-2">{s.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
