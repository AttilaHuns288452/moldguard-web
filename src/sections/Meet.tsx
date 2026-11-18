import { useState } from 'react'
import { ArrowLeft, ArrowRight, Boxes, Eye, Layers, Play } from 'lucide-react'
import DeviceViewer from '../components/DeviceViewer'
import { PARTS, PART_BY_ID, TOUR, type PartId } from '../components/parts'
import { MEET } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * "Explore MoldGuard" — the signature section. A real component explorer:
 * select a part, the model highlights it and the panel explains the part's job
 * in the loop. The guided tour walks the documented order (sensor -> controller
 * -> relay -> dehumidifier). Every description is about the actual mesh.
 */
export default function Meet() {
  const [active, setActive] = useState<PartId | null>('enclosure')
  const [mode, setMode] = useState<'tour' | 'explode'>('tour')
  const [autoSpin, setAutoSpin] = useState(true)
  const [tourStep, setTourStep] = useState(0)

  const selected = active ? PART_BY_ID[active] : null

  const pick = (id: PartId) => {
    setActive(id)
    setAutoSpin(false)
    const i = TOUR.indexOf(id)
    if (i >= 0) setTourStep(i)
  }

  const step = (dir: 1 | -1) => {
    const next = (tourStep + dir + TOUR.length) % TOUR.length
    setTourStep(next)
    setActive(TOUR[next])
    setAutoSpin(false)
  }

  return (
    <section id="meet" className="section section-alt">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[620px]">
            <LineReveal
              lines={splitTitle(MEET.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-2">{MEET.lede}</p>
            </Reveal>
          </div>
          <Reveal delay={110}>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMode('tour')}
                aria-pressed={mode === 'tour'}
                className={`inline-flex items-center gap-1.5 rounded-tight border px-3 py-2 text-[12.5px] transition-colors ${
                  mode === 'tour' ? 'border-accent-ink bg-[#2563eb0f] font-[650] text-deep' : 'border-line text-ink-2 hover:border-line-hi'
                }`}
              >
                <Eye className="size-3.5" strokeWidth={2} /> Assembled
              </button>
              <button
                type="button"
                onClick={() => { setMode('explode'); setAutoSpin(false) }}
                aria-pressed={mode === 'explode'}
                className={`inline-flex items-center gap-1.5 rounded-tight border px-3 py-2 text-[12.5px] transition-colors ${
                  mode === 'explode' ? 'border-accent-ink bg-[#2563eb0f] font-[650] text-deep' : 'border-line text-ink-2 hover:border-line-hi'
                }`}
              >
                <Layers className="size-3.5" strokeWidth={2} /> Exploded
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] lg:gap-6">
          {/* ── the model ── */}
          <Reveal>
            <div className="relative overflow-hidden rounded-soft border border-line bg-card">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">{MEET.caption}</span>
                <span className="measure text-[11px] text-ink-3">overall 317 &times; 292 &times; 823 mm</span>
              </div>
              <div className="relative h-[clamp(400px,58vh,560px)] w-full bg-[radial-gradient(70%_60%_at_50%_40%,#ffffff_0%,#e8f1fb_55%,#cadcef_100%)]">
                <DeviceViewer active={active} onSelect={(id) => { if (id) pick(id) }} autoSpin={autoSpin} mode={mode} />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5">
                <span className="text-[11px] text-ink-3">
                  {mode === 'explode' ? 'Exploded view — parts offset along their own axis' : 'Assembled view'}
                </span>
                <button
                  type="button"
                  onClick={() => setAutoSpin((v) => !v)}
                  aria-pressed={autoSpin}
                  className={`rounded-tight border px-2.5 py-1 text-[11px] transition-colors ${
                    autoSpin ? 'border-accent-ink bg-[#2563eb0f] text-deep' : 'border-line text-ink-3 hover:border-line-hi'
                  }`}
                >
                  Auto-rotate
                </button>
              </div>
            </div>
          </Reveal>

          {/* ── the information panel ── */}
          <Reveal delay={90}>
            <div className="flex h-full flex-col overflow-hidden rounded-soft border border-line bg-card">
              {/* selected part */}
              <div className="border-b border-line p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-[650] tracking-[0.12em] text-accent uppercase">Selected component</p>
                    <h3 className="mt-1.5 text-[1.25rem] font-[650] leading-tight text-deep">
                      {selected ? selected.name : 'Pick a component'}
                    </h3>
                  </div>
                  {selected && <span className="measure mt-1 shrink-0 text-[11px] text-ink-3">
                    {Math.round(selected.size[0]*1000)} × {Math.round(selected.size[2]*1000)} × {Math.round(selected.size[1]*1000)} mm
                  </span>}
                </div>
                {selected && (
                  <>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-ink-2">{selected.what}</p>
                    <p className="mt-2.5 border-l border-line-hi pl-3 text-[13.5px] leading-relaxed text-ink">
                      {selected.role}
                    </p>
                  </>
                )}
              </div>

              {/* guided walkthrough */}
              <div className="flex items-center justify-between gap-2 border-b border-line bg-paper-deep/50 px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">
                  <Play className="size-3" strokeWidth={2.5} /> How it works
                </span>
                <div className="flex items-center gap-1">
                  <span className="measure mr-1.5 text-[11px] text-ink-3">{tourStep + 1} / {TOUR.length}</span>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous component"
                    className="grid size-7 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-hi hover:text-ink">
                    <ArrowLeft className="size-3.5" strokeWidth={2} />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next component"
                    className="grid size-7 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-hi hover:text-ink">
                    <ArrowRight className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* component index */}
              <ul className="flex-1 divide-y divide-line overflow-y-auto">
                {PARTS.map((p) => {
                  const on = active === p.id
                  const inTour = TOUR.indexOf(p.id)
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => pick(p.id)}
                        aria-pressed={on}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          on ? 'bg-[#2563eb0a]' : 'hover:bg-paper-deep/60'
                        }`}
                      >
                        <span className={`measure w-4 shrink-0 text-[11px] ${on ? 'text-accent' : 'text-ink-3'}`}>
                          {inTour >= 0 ? String(inTour + 1).padStart(2, '0') : '—'}
                        </span>
                        <span className={`flex-1 text-[13px] ${on ? 'font-[650] text-deep' : 'text-ink-2'}`}>
                          {p.name}
                        </span>
                        {on && <Boxes className="size-3.5 shrink-0 text-accent" strokeWidth={2} />}
                      </button>
                    </li>
                  )
                })}
              </ul>

              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
                <span className="rounded-full border border-ink-3/30 bg-ink-3/[0.07] px-2 py-0.5 text-[10.5px] font-[650] tracking-[0.1em] text-ink-3 uppercase">Illustrative readouts</span>
                <span className="text-[11px] text-ink-3">
                  {PARTS.length} components · real SketchUp geometry
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* PDF page 1: the four stages, verbatim */}
        <ol className="mt-10 grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {MEET.stages.map((st, i) => (
            <Reveal as="li" key={st.n} delay={i * 60}>
              <div className="h-full bg-card px-5 py-4">
                <span className="measure text-[11px] tracking-[0.14em] text-accent">{st.n}</span>
                <h3 className="mt-1.5 text-[14.5px] font-[650] text-deep">{st.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{st.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={80}>
          <div className="mt-6 rounded-soft border border-line bg-card p-5">
            <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">{MEET.flowLabel}</p>
            <p className="mt-2 max-w-[74ch] text-[14.5px] leading-relaxed text-ink-2">{MEET.flowLede}</p>
            <p className="mt-1.5 text-[12px] text-ink-3">{MEET.flowNote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
