import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import DeviceViewer from '../components/DeviceViewer'
import type { HotspotId } from '../components/DeviceViewer'
import { MEET } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Meet MoldGuard: the real 3D model gets its own full-size section (the hero
 * carries the product photo), plus the four-stage loop and the data-flow detail.
 */
export default function Meet() {
  const [active, setActive] = useState<HotspotId | null>(null)

  return (
    <section id="meet" className="section section-alt">
      <div className="shell">
        <div className="max-w-[720px]">
          <Reveal>
            <LineReveal
              lines={splitTitle(MEET.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
          </Reveal>
          <Reveal delay={70}>
            <p className="mt-2 text-[1.05rem] leading-relaxed text-ink-2">{MEET.lede}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          {/* the interactive model */}
          <Reveal>
            <div className="relative overflow-hidden rounded-[14px] border border-line bg-card shadow-[0_1px_2px_rgba(30,54,128,.05),0_10px_26px_-20px_rgba(30,54,128,.30)]">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="text-[0.6875rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                  {MEET.caption}
                </span>
              </div>
              <div className="relative h-[clamp(330px,46vw,470px)] w-full bg-[radial-gradient(72%_62%_at_50%_38%,#f1eee8_0%,#e7e2db_56%,#dbd5cc_100%)]">
                <DeviceViewer active={active} onHotspot={setActive} />
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
                <span className="text-[0.6875rem] leading-relaxed text-ink-3">
                  Interactive &mdash; drag to orbit, scroll to zoom
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-[0.6875rem] text-ink-3">
                  <RotateCcw className="size-3" strokeWidth={1.75} />
                  Real SketchUp model
                </span>
              </div>
            </div>
          </Reveal>

          {/* four stages */}
          <div>
            <p className="mb-1 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-3 uppercase">
              The loop
            </p>
            <ol>
            {MEET.stages.map((s, i) => (
              <Reveal as="li" key={s.n} delay={i * 65}>
                <div className="flex gap-4 border-b border-line py-4 last:border-b-0">
                  <span className="measure mt-0.5 text-[11px] tracking-[0.16em] text-accent-ink">{s.n}</span>
                  <div>
                    <h3 className="text-[1.05rem] font-[650] text-deep">{s.title}</h3>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed text-ink-2">{s.body}</p>
                  </div>
                </div>
              </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {/* data-flow detail */}
        <Reveal delay={80}>
          <details className="group mt-10 rounded-soft border border-line bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-[650] text-deep marker:content-none">
              See the full data flow
              <span className="grid size-7 place-items-center rounded-full border border-line-hi text-ink-3 transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="px-5 pb-5">
              <FlowDiagram />
              <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-ink-2">{MEET.flowLede}</p>
              <p className="mt-2 text-[12.5px] text-ink-3">{MEET.flowNote}</p>
            </div>
          </details>
        </Reveal>
      </div>
    </section>
  )
}

/** Authored SVG flow: pod -> sensors -> analysis -> index -> response -> dehumidifier, with a dashed return. */
function FlowDiagram() {
  return (
    <svg
      viewBox="0 0 1000 600"
      role="img"
      className="w-full"
      aria-label="Product flow. The MoldGuard pod senses temperature, humidity and air quality. Environmental analysis produces a Mold Risk Index of 38. An automatic response controls the dehumidifier, and the result returns to analysis."
    >
      <ellipse cx="500" cy="322" rx="60" ry="7" fill="#16296B" opacity=".12" />
      <rect x="430" y="52" width="140" height="240" rx="26" fill="#E9E6E1" stroke="#918C83" strokeWidth="2" />
      <rect x="448" y="70" width="104" height="118" rx="18" fill="#E5E2DC" stroke="#CBC6BE" />
      <g stroke="#B5B0A6" strokeWidth="1.4">
        <path d="M456 84 h88M456 98 h88M456 112 h88M456 126 h88M456 140 h88M456 154 h88M456 168 h88" />
      </g>
      <circle cx="500" cy="292" r="5" fill="#3F51B5" />
      <text x="574" y="76" fontFamily="Figtree, sans-serif" fontSize="12.5" fill="#666666">MoldGuard Pod</text>

      <g stroke="#666666" strokeOpacity=".35" strokeWidth="1.5" fill="none">
        <path d="M500 140 L320 194" /><path d="M500 140 L500 194" /><path d="M500 140 L680 194" />
      </g>
      <g fontFamily="Figtree, sans-serif" fontSize="15" fontWeight="500" fill="#2B2B2B" textAnchor="middle">
        <rect x="255" y="194" width="130" height="40" rx="12" fill="#FFFFFF" stroke="#3F51B5" strokeWidth="1.25" />
        <rect x="440" y="194" width="120" height="40" rx="12" fill="#FFFFFF" stroke="#3F51B5" strokeWidth="1.25" />
        <rect x="615" y="194" width="130" height="40" rx="12" fill="#FFFFFF" stroke="#3F51B5" strokeWidth="1.25" />
        <text x="320" y="219">Temperature</text>
        <text x="500" y="219">Humidity</text>
        <text x="680" y="219">Air Quality</text>
      </g>
      <g stroke="#666666" strokeOpacity=".35" strokeWidth="1.5" fill="none">
        <path d="M320 234 L500 268" /><path d="M500 234 L500 268" /><path d="M680 234 L500 268" />
      </g>
      <rect x="395" y="268" width="210" height="44" rx="12" fill="#FFFFFF" stroke="#E3DED6" strokeWidth="1" />
      <text x="500" y="295" fontFamily="Figtree, sans-serif" fontSize="15" fontWeight="500" fill="#2B2B2B" textAnchor="middle">Environmental Analysis</text>
      <path d="M500 312 L500 332" stroke="#666666" strokeOpacity=".55" strokeWidth="1.5" />
      <polygon points="494,332 506,332 500,340" fill="#666666" fillOpacity=".55" />
      <rect x="385" y="346" width="230" height="92" rx="12" fill="#FFFFFF" stroke="#3F51B5" strokeWidth="1.5" />
      <text x="500" y="372" fontFamily="Figtree, sans-serif" fontSize="14" fontWeight="500" fill="#555555" textAnchor="middle">Mold Risk Index</text>
      <text x="500" y="424" fontFamily="'Spline Sans Mono', monospace" fontSize="42" fontWeight="600" fill="#1E3680" textAnchor="middle">38</text>
      <path d="M500 438 L500 458" stroke="#666666" strokeOpacity=".55" strokeWidth="1.5" />
      <polygon points="494,458 506,458 500,466" fill="#666666" fillOpacity=".55" />
      <rect x="395" y="472" width="210" height="44" rx="12" fill="#FFFFFF" stroke="#E3DED6" strokeWidth="1" />
      <text x="500" y="499" fontFamily="Figtree, sans-serif" fontSize="15" fontWeight="500" fill="#2B2B2B" textAnchor="middle">Automatic Response</text>
      <path d="M500 516 L500 536" stroke="#666666" strokeOpacity=".55" strokeWidth="1.5" />
      <polygon points="494,536 506,536 500,544" fill="#666666" fillOpacity=".55" />
      <rect x="395" y="550" width="210" height="40" rx="12" fill="#FFFFFF" stroke="#E3DED6" strokeWidth="1" />
      <text x="500" y="575" fontFamily="Figtree, sans-serif" fontSize="15" fontWeight="500" fill="#2B2B2B" textAnchor="middle">Dehumidifier Control</text>
      <path d="M395 570 H320 V290 H387" stroke="#3F51B5" strokeOpacity=".85" strokeWidth="2" strokeDasharray="6 5" fill="none" />
      <polygon points="395,284 395,296 387,290" fill="#3F51B5" fillOpacity=".5" />
    </svg>
  )
}
