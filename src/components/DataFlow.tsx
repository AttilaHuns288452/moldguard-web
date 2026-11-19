import { APP_MOCK, MEET } from '../content'
import { Seq } from './ui'

/**
 * "See the full data flow" — PDF page 1, band 0.387–0.516.
 *
 * The reference draws this as ONE centred vertical flow, not two columns:
 *
 *              [ MoldGuard Pod ]
 *          ┌────────┼────────┐
 *      Temperature  Humidity  Air quality
 *          └────────┼────────┘
 *          [ Environmental Analysis ]
 *                     ↓
 *          [  Mold Risk Index  38  ]
 *                     ↓
 *           [ Automatic Response ]
 *                     ↓
 *          [ Dehumidifier Control ]
 *                     ⤴ dashed feedback to Analysis
 *
 * Two columns made the section 225px shorter than the artboard and read as a
 * side-by-side comparison rather than a flow. Every value comes from content.ts.
 */
export default function DataFlow() {
  const Arrow = () => (
    <div className="flex justify-center py-1.5" aria-hidden="true">
      <svg viewBox="0 0 10 18" className="h-4 w-2.5 text-line-hi" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M5 0v13M1.5 13.5 5 18l3.5-4.5" />
      </svg>
    </div>
  )

  const Node = ({ children, strong = false }: { children: React.ReactNode; strong?: boolean }) => (
    <div
      className={
        strong
          ? 'rounded-tight border-2 border-accent-ink/40 bg-[#2563eb0a] px-4 py-3'
          : 'rounded-tight border border-line bg-surface px-4 py-2.5'
      }
    >
      {children}
    </div>
  )

  return (
    <figure className="mt-8 overflow-hidden rounded-shell border border-line bg-card">
      <figcaption className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{MEET.flowLabel}</span>
        <span className="measure text-[11px] text-ink-3">{MEET.flowNote}</span>
      </figcaption>

      {/* Stages reveal in flow order (--stagger apart), so the reader follows
          pod -> readings -> analysis -> index -> response instead of the whole
          diagram appearing in one block. Grouped per stage, not per element:
          a 12-step cascade would still be running when the next section lands. */}
      <Seq className="mx-auto max-w-[520px] px-5 py-8">
        <div>
          {/* the pod */}
          <div className="flex justify-center">
            <Node>
              <span className="flex items-center gap-2.5">
                <span className="grid size-7 place-items-center rounded-tight bg-accent-ink text-white" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="6.5" y="3.5" width="11" height="17" rx="2.6" />
                    <path d="M10 8h4M10 11.5h4M10 15h4" />
                  </svg>
                </span>
                <span className="text-[13px] font-[650] text-deep">MoldGuard Pod</span>
              </span>
            </Node>
          </div>

          {/* fan-out: stem from the pod, a bar joining the three column centres,
              then a drop into each reading. Drawn as a 3-column grid rather than
              an SVG so the drops land on the column centres at any width. */}
          <div className="grid grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-[22px]">
                <span className="absolute bottom-0 left-1/2 h-[15px] w-px -translate-x-1/2 bg-line-hi" />
                {i < 2 && <span className="absolute left-1/2 top-[7px] h-px w-1/2 bg-line-hi" />}
                {i > 0 && <span className="absolute right-1/2 top-[7px] h-px w-1/2 bg-line-hi" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3">
            {['Temperature', 'Humidity', 'Air quality'].map((k) => (
              <div key={k} className="p-1">
                <div className="rounded-tight border border-line bg-surface px-2 py-2 text-center">
                  <p className="text-[11.5px] text-ink-2">{k}</p>
                </div>
              </div>
            ))}
          </div>

          {/* converge: a drop from each reading, a bar, then the stem into analysis */}
          <div className="grid grid-cols-3" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative h-[22px]">
                <span className="absolute top-0 left-1/2 h-[15px] w-px -translate-x-1/2 bg-line-hi" />
                {i < 2 && <span className="absolute left-1/2 top-[14px] h-px w-1/2 bg-line-hi" />}
                {i > 0 && <span className="absolute right-1/2 top-[14px] h-px w-1/2 bg-line-hi" />}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-center">
            <Node>
              <p className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Environmental Analysis</p>
            </Node>
          </div>

          <Arrow />
        </div>

        <div>
          <div className="flex justify-center">
            <div className="w-full max-w-[300px]">
              <Node strong>
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-[650] tracking-[0.1em] text-accent-ink uppercase">Mold Risk Index</span>
                  <span className="measure text-[28px] leading-none font-semibold text-deep">
                    {APP_MOCK.risk}<span className="text-[13px] text-ink-3">/100</span>
                  </span>
                </span>
              </Node>
            </div>
          </div>

          <Arrow />
        </div>

        <div>
          <div className="flex justify-center">
            <Node>
              <p className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Automatic Response</p>
            </Node>
          </div>

          <Arrow />
        </div>

        <div>
          <div className="flex justify-center">
            <Node>
              <p className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Dehumidifier Control</p>
            </Node>
          </div>

          {/* dashed feedback back up to the analysis step */}
          <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-ink-3">
            <svg viewBox="0 0 40 12" className="h-3 w-10 text-line-hi" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M2 10V4h32M34 4l4 3-4 3" strokeDasharray="2.5 2.5" />
            </svg>
            Runs again while risk stays high
          </p>
        </div>
      </Seq>

      <p className="border-t border-line px-5 py-3.5 text-center text-[12.5px] leading-relaxed text-ink-2">{MEET.flowLede}</p>
    </figure>
  )
}
