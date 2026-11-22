import { ArrowRight, Gauge, RotateCcw, Thermometer, Wind } from 'lucide-react'
import { APP_MOCK, MEET } from '../content'
import { Seq } from './ui'

/**
 * "See the full data flow" — the home page's one diagram of the loop.
 *
 * Desktop: three connected regions SENSE → ANALYZE → RESPOND on one shared navy
 * rule, divided by hairlines, each with an icon, a short claim and its own
 * evidence. Mobile: the same regions stacked, arrows turned downward.
 *
 * Data honesty: the only numbers are APP_MOCK's. 38 is in the Safe band, so the
 * response reads "Standby" — the unit is NOT running at 38. The loop returns to
 * Sense because monitoring never stops, not because risk is high.
 */

// Safe 0–40 / Watch 40–70 / Act 70–100, acting at 70: the exact thresholds
// RiskShowcase prints, not a new number invented for this diagram.
const THRESHOLD = 70
const BAND = APP_MOCK.risk >= THRESHOLD ? 'Act' : APP_MOCK.risk >= 40 ? 'Watch' : 'Safe'

function Region({
  n, name, title, icon, focus = false, next = false, children,
}: {
  n: string
  name: string
  title: string
  icon: React.ReactNode
  focus?: boolean
  next?: boolean
  children: React.ReactNode
}) {
  return (
    <li
      data-flow-stage={name.toLowerCase()}
      className="relative py-6 first:pt-0 last:pb-0 lg:px-6 lg:py-7 lg:first:pl-7 lg:last:pr-7"
    >
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`grid size-9 shrink-0 place-items-center rounded-tight text-white ${focus ? 'bg-accent-ink' : 'bg-deep'}`}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="measure text-[10.5px] tracking-[0.16em] text-ink-3">{n} · {name}</p>
          <h3 className="mt-0.5 text-[15px] leading-tight font-[650] text-deep">{title}</h3>
        </div>
      </div>
      <div className="mt-3.5 text-[13.5px] leading-relaxed text-ink-2">{children}</div>

      {next && (
        <ArrowRight
          aria-hidden="true"
          strokeWidth={1.6}
          className="absolute bottom-0 left-1/2 size-5 -translate-x-1/2 translate-y-1/2 rotate-90 rounded-full bg-card text-[#7f9fc4] lg:top-1/2 lg:right-0 lg:bottom-auto lg:left-auto lg:-translate-y-1/2 lg:translate-x-1/2 lg:rotate-0"
        />
      )}
    </li>
  )
}

export default function DataFlow() {
  return (
    <figure data-data-flow className="mt-8 overflow-hidden rounded-shell border border-line bg-card">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5 md:px-7">
        <span className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{MEET.flowLabel}</span>
        <span className="measure text-[11px] text-ink-3">{MEET.flowNote}</span>
      </figcaption>

      {/* one shared dark rule across all three regions */}
      <div aria-hidden="true" className="h-[3px] w-full bg-deep" />

      <Seq className="px-5 pb-6 md:px-7 md:pb-7">
        <ol className="grid divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <Region n="01" name="SENSE" title="The pod senses" icon={<Thermometer className="size-4" strokeWidth={1.9} />} next>
            <p>Temperature and relative humidity, read continuously in the room.</p>
            <ul className="mt-3">
              <li className="flex items-baseline justify-between gap-2 border-b border-line pb-1.5">
                <span>Temperature</span>
                <span className="text-[12.5px] text-ink-3">continuous</span>
              </li>
              <li className="flex items-baseline justify-between gap-2 pt-1.5">
                <span>Relative humidity</span>
                <span className="text-[12.5px] text-ink-3">continuous</span>
              </li>
            </ul>
            <p className="mt-2.5 text-[13px] text-ink-3">
              Air quality adds supplementary context, not a mold verdict.
            </p>
          </Region>

          <Region n="02" name="ANALYZE" title="Conditions become a score" icon={<Gauge className="size-4" strokeWidth={1.9} />} focus next>
            <div className="flex items-center justify-between gap-3 rounded-tight border border-line bg-card px-3 py-2">
              <span className="measure text-[26px] leading-none font-semibold text-deep">
                {APP_MOCK.risk}<span className="ml-0.5 text-[12px] font-normal text-ink-3">/100</span>
              </span>
              <span className="rounded-full border border-[#c6d8ee] bg-paper px-2 py-0.5 text-[11.5px] font-[650] text-deep">
                {BAND}
              </span>
            </div>
            <p className="mt-2.5">
              Humidity, temperature, exposure duration and dew-point margin combine into one Mold Risk
              Index — not a single humidity threshold.
            </p>
          </Region>

          <Region n="03" name="RESPOND" title="It responds on its own" icon={<Wind className="size-4" strokeWidth={1.9} />}>
            <div className="flex items-center justify-between gap-3 rounded-tight border border-line bg-card px-3 py-2">
              <span className="text-[12.5px] font-[650] text-deep">Dehumidifier</span>
              <span className="flex items-center gap-1.5 text-[12.5px] text-ink-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#516a84]" />
                Standby
              </span>
            </div>
            <p className="mt-2.5">
              When risk crosses {THRESHOLD}, the thermoelectric stack runs; below it, the unit waits.
            </p>
            <p className="mt-2 text-[13px] text-ink-3">
              At {APP_MOCK.risk} the room is {BAND}, so nothing runs yet. Alerts and history still reach
              the app.
            </p>
          </Region>
        </ol>

        {/* continuous monitoring returns to Sense whether risk is safe or high */}
        <div className="relative mt-6 flex items-center justify-center">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 18"
            preserveAspectRatio="none"
            fill="none"
            className="absolute inset-x-0 top-1/2 h-4 w-full -translate-y-1/2"
          >
            <path d="M995 2v5M995 7H90" stroke="#9fb8d4" strokeWidth="1.4" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <path d="m97 3-7 4 7 4" stroke="#2563eb" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          </svg>
          <p className="relative flex items-center gap-1.5 bg-card px-3 text-[10.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
            <RotateCcw aria-hidden="true" strokeWidth={2} className="size-3 text-accent-ink" />
            Continuous monitoring returns to sense
          </p>
        </div>
        <p className="mx-auto mt-2.5 max-w-[58ch] text-center text-[13px] leading-relaxed text-ink-2">
          Readings keep streaming back into Sense whether risk is safe or high. At {APP_MOCK.risk} the
          loop simply holds on standby.
        </p>

        <p className="mt-4 border-t border-line pt-4 text-[13.5px] leading-relaxed text-ink-2">{MEET.flowLede}</p>
      </Seq>
    </figure>
  )
}
