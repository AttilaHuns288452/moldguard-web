import { useState } from 'react'
import { ArrowLeft, ArrowRight, Boxes, Eye, Layers, RefreshCw } from 'lucide-react'
import DeviceViewer from '../components/DeviceViewer'
import DataFlow from '../components/DataFlow'
import { PARTS, PART_BY_ID, TOUR, MODEL_SIZE, type PartId } from '../components/parts'
import { MEET, OFFER } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { prefersReducedMotion, splitTitle } from '../lib/motion'
import { navigate } from '../lib/route'

/**
 * "Explore MoldGuard" — the signature section. A real component explorer:
 * select a part, the model highlights it and the panel explains the part's job
 * in the loop. The guided tour walks the documented order (sensor -> controller
 * -> relay -> dehumidifier). Every description is about the actual mesh.
 */
// the caption must come from the model, not a hand-typed number: the previous
// hardcoded "317 x 159 x 254" contradicted the measured 317.7 x 255 x 159
const mm = (m: number) => Math.round(m * 1000)

export default function Meet() {
  // Start with nothing selected: a preset selection both ghosted the shell on
  // first paint (ready-to-explode look while the toggle read "Assembled") and
  // pre-lit one part, so the default view read as a disassembled product.
  const [active, setActive] = useState<PartId | null>(null)
  const [mode, setMode] = useState<'tour' | 'explode'>('tour')
  // Auto-rotate is motion; the rest of the site honours prefers-reduced-motion,
  // so a 3D stage that spins regardless was the one place it was ignored.
  const [autoSpin, setAutoSpin] = useState(() => !prefersReducedMotion())
  const [tourStep, setTourStep] = useState(0)

  const selected = active ? PART_BY_ID[active] : null

  const pick = (id: PartId) => {
    setActive(id)
    setAutoSpin(false)
    const i = TOUR.indexOf(id)
    if (i >= 0) setTourStep(i)
  }

  const step = (dir: 1 | -1) => {
    // With nothing selected yet, "next" must land on the first stage — not skip
    // to stage 2 from the untouched counter.
    const next = active === null
      ? (dir === 1 ? 0 : TOUR.length - 1)
      : (tourStep + dir + TOUR.length) % TOUR.length
    setTourStep(next)
    setActive(TOUR[next])
    setAutoSpin(false)
  }

  return (
    <section id="meet" className="section band-pale">
      <div className="shell">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-[620px]">
          <LineReveal
              lines={splitTitle(MEET.title)}
              className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.08] font-[650] text-deep"
            />
            <Reveal delay={70}>
              <p className="lede mt-3">{MEET.lede}</p>
            </Reveal>
            {/* One column, not two. This block sits in the left half of a
                two-column section (the 3D stage takes the right), so a 2-col grid
                left each item ~130px wide and orphaned the last word ("…
                continuously." / "… real time.") on its own line. Measured on the
                rendered page; one column reads cleanly and keeps the four rows as
                a list, which is what the artboard shows anyway. */}
            <ol className="mt-6 grid gap-y-3">
              {MEET.stages.map((s, i) => (
                <Reveal key={s.n} delay={90 + i * 40} as="li">
                  <div className="flex items-baseline gap-2.5 border-t border-line pt-2.5">
                    <span className="measure text-[10.5px] tracking-[0.16em] text-accent-ink">{s.n}</span>
                    <div>
                      <p className="text-[0.9375rem] font-[650] text-deep">{s.title}</p>
                      <p className="mt-0.5 text-[13.5px] leading-snug text-ink-2">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Balances the half-empty header: the four steps occupied the left 620px
              of a 1260px row, leaving a large blank right side above the cards. */}
          <Reveal delay={150}>
            <div className="rounded-soft border border-line bg-card px-5 py-4 lg:max-w-[300px]">
              <p className="text-[11px] font-[650] tracking-[0.12em] text-ink-3 uppercase">In this section</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">
                The device below is the real assembly — 12 parts, each listed. Pick one to read what it does, or take the guided tour.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)] lg:gap-6">
          {/* ── the model ── */}
          <Reveal>
            <div className="relative overflow-hidden rounded-soft border border-line bg-card">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <span className="text-[11px] font-[650] tracking-[0.1em] text-ink-3 uppercase">{MEET.caption}</span>
                <span className="measure text-[11px] tracking-[0.08em] text-ink-3 uppercase">{mm(MODEL_SIZE[0])} &times; {mm(MODEL_SIZE[1])} &times; {mm(MODEL_SIZE[2])} mm</span>
              </div>
              <div className="relative h-[clamp(400px,58vh,560px)] w-full bg-[radial-gradient(70%_60%_at_50%_40%,#ffffff_0%,#e8f1fb_55%,#cadcef_100%)]">
                <DeviceViewer active={active} onSelect={(id) => { if (id) pick(id); else setActive(null) }} autoSpin={autoSpin} mode={mode} />
              </div>
              {/* The view toggle belongs to the model it changes, so it sits in the
                  card footer beside the view name it controls. */}
              <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5">
                <span className="text-[11px] text-ink-3">
                  {mode === 'explode' ? 'Parts offset along their own axis' : 'Select a part to inspect it'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setMode('tour'); setActive(null) }}
                    aria-pressed={mode === 'tour'}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-tight border px-2.5 py-1.5 text-[11.5px] transition-colors ${
                      mode === 'tour' ? 'border-accent-ink bg-[#2563eb0f] font-[650] text-deep' : 'border-line text-ink-2 hover:border-line-hi'
                    }`}
                  >
                    <Eye className="size-3.5" strokeWidth={2} aria-hidden="true" /> Assembled
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('explode'); setAutoSpin(false); setActive(null) }}
                    aria-pressed={mode === 'explode'}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-tight border px-2.5 py-1.5 text-[11.5px] transition-colors ${
                      mode === 'explode' ? 'border-accent-ink bg-[#2563eb0f] font-[650] text-deep' : 'border-line text-ink-2 hover:border-line-hi'
                    }`}
                  >
                    <Layers className="size-3.5" strokeWidth={2} aria-hidden="true" /> Exploded
                  </button>
                  <button
                    type="button"
                    onClick={() => setAutoSpin((v) => !v)}
                    aria-pressed={autoSpin}
                    aria-label={autoSpin ? 'Stop auto-rotating the model' : 'Auto-rotate the model'}
                    title={autoSpin ? 'Stop auto-rotation' : 'Auto-rotate'}
                    className={`grid size-9 place-items-center rounded-tight border transition-colors ${
                      autoSpin ? 'border-accent-ink bg-[#2563eb0f] text-deep' : 'border-line text-ink-3 hover:border-line-hi'
                    }`}
                  >
                    <RefreshCw className="size-3.5" strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
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
                    <p className="text-[11px] font-[650] tracking-[0.12em] text-accent uppercase">
                      {selected ? 'Selected component' : 'Components'}
                    </p>
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
                    <p className="mt-3 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-2">{selected.what}</p>
                    <p className="mt-2.5 border-l border-line-hi pl-3 text-[13.5px] leading-relaxed text-ink">
                      {selected.role}
                    </p>
                    {/* The explorer explained internals but offered no next step;
                        a reader who got this far is deciding on the device. */}
                    <a
                      href="/contact"
                      onClick={(e) => { e.preventDefault(); navigate('contact') }}
                      className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[13px] font-[650] text-accent-ink underline-offset-2 hover:underline"
                    >
                      Ask if this fits your room
                      <ArrowRight className="size-3.5" strokeWidth={2} aria-hidden="true" />
                    </a>
                  </>
                )}
              </div>

              {/* Header row carries only the tour controls; the eyebrow above
                  already names the list, so a second "Components" label here was
                  the same word twice in one card. */}
              <div className="flex items-center justify-end gap-2 border-b border-line bg-paper-deep/50 px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <span className="measure mr-1.5 text-[11px] text-ink-3">{active ? `Step ${tourStep + 1} of ${TOUR.length}` : 'Guided tour'}</span>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous component"
                    className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-hi hover:text-ink">
                    <ArrowLeft className="size-3.5" strokeWidth={2} />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next component"
                    className="grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-line-hi hover:text-ink">
                    <ArrowRight className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* component index */}
              <ul className="flex-1 divide-y divide-line overflow-y-auto">
                {PARTS.map((p) => {
                  const on = active === p.id
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
                        {/* the list number is the part's own index in the documented
                            order, not its tour position: the tour only covers 8 of
                            the 12 parts, so the rest read as em dashes */}
                        <span className={`measure w-4 shrink-0 text-[11px] ${on ? 'text-accent' : 'text-ink-3'}`}>
                          {String(PARTS.indexOf(p) + 1).padStart(2, '0')}
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
                <span className="text-[11px] text-ink-3">
                  {PARTS.length} documented components
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* The four stage cards that used to sit here said the same thing as the
            data-flow figure directly below them (and as Sense/Score/Act and the
            viewer's own "How it works" panel). On the home page the flow is now
            stated ONCE, as the diagram, with a link to the full walkthrough. */}
        {/* Buy CTA: the explorer ends ~5,900px before the next call to action,
            so a reader who has just inspected the hardware had no way to act. */}
        {/* Divides the interactive explorer from the automated walkthrough that
            follows it. Without a rule the CTA and data-flow band read as more
            content inside the same two cards above. */}
        <div className="mt-12 border-t border-line pt-10">
        <Reveal delay={40}>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 rounded-soft border border-line bg-card px-5 py-4">
            <p className="text-[14px] text-ink-2">
              <span className="font-[650] text-deep">{OFFER.price}</span> proposed one-time price. One small room, one device.
            </p>
            <a
              href="/contact"
              onClick={(e) => { e.preventDefault(); navigate('contact') }}
              className="inline-flex min-h-11 items-center rounded-btn bg-accent-ink px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-deep"
            >
              Check it fits my room
            </a>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <p className="mt-8 text-[14px] text-ink-2">
            The loop in full, stage by stage:{' '}
            <a
              href="/how-it-works"
              className="inline-flex min-h-11 items-center font-[650] text-accent-ink underline-offset-2 hover:underline"
            >
              how it works
            </a>
          </p>
        </Reveal>

        {/* PDF page 1: "See the full data flow" — the band that makes this the
            largest section of the artboard. */}
        <Reveal delay={80}>
          <DataFlow />
        </Reveal>
        </div>
      </div>
    </section>
  )
}
