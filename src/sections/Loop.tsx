import { useState } from 'react'
import { LOOP } from '../content'
import { Reveal, SectionHead } from '../components/ui'

export default function Loop() {
  const [open, setOpen] = useState(0)

  return (
    <section id="loop" className="relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(90% 60% at 18% 0%, #eaf2fc 0%, transparent 62%)' }}
      />

      <div className="shell relative">
        <SectionHead
          index="02"
          label="Meet MoldGuard"
          max="max-w-3xl"
          title={
            <>
              One continuous loop:
              <br />
              <span className="text-ink-3">sense, analyze, respond, protect.</span>
            </>
          }
          lead="MoldGuard runs the same four steps in every room, continuously. Each step exists so you never have to think about mold again."
        />

        {/* the sequence — horizontal on desktop, stacked on mobile */}
        <div className="mt-14">
          <ol className="grid gap-px overflow-hidden rounded-soft border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((step, i) => {
              const isOpen = open === i
              return (
                <li key={step.id} className="bg-card">
                  <Reveal delay={i * 70}>
                    <button
                      type="button"
                      onClick={() => setOpen(i)}
                      aria-expanded={isOpen}
                      className={`group relative flex h-full w-full flex-col gap-3 px-6 py-7 text-left transition-colors duration-300 ${
                        isOpen ? 'bg-[#edf4fc]' : 'hover:bg-[#ffffff]'
                      }`}
                    >
                      <span
                        className={`absolute inset-x-0 top-0 h-px transition-opacity duration-300 ${
                          isOpen ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ background: 'linear-gradient(90deg,transparent,#2563eb,#2563eb,transparent)' }}
                        aria-hidden="true"
                      />
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[0.625rem] tracking-[0.2em] text-ink-3">{step.index}</span>
                        {isOpen && (
                          <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">
                            active
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[1.375rem] font-medium tracking-tight transition-colors duration-300 ${
                          isOpen ? 'text-ink' : 'text-ink-2 group-hover:text-ink-2'
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-[0.8125rem] leading-snug text-ink-3">{step.meta}</span>
                    </button>
                  </Reveal>
                </li>
              )
            })}
          </ol>

          {/* detail panel for the selected step */}
          <div className="relative mt-px overflow-hidden rounded-b-soft border border-line bg-gradient-to-b from-[#ffffff] to-abyss">
            <div className="grid gap-8 p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-10">
              <div key={open} className="max-w-2xl animate-[fade_.5s_cubic-bezier(.22,1,.36,1)_both]">
                <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-accent uppercase">
                  {LOOP[open].index} / {LOOP[open].name}
                </p>
                <h3 className="mt-3 text-[clamp(1.375rem,2.6vw,1.875rem)] font-medium tracking-tight text-ink">
                  {LOOP[open].head}
                </h3>
                <p className="mt-4 text-[1rem] leading-relaxed text-ink-2">{LOOP[open].body}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-end md:gap-2">
                {LOOP.map((s, i) => (
                  <span
                    key={s.id}
                    className={`h-px w-8 transition-colors duration-300 md:w-14 ${
                      i === open ? 'bg-accent' : 'bg-line-hi'
                    }`}
                    aria-hidden="true"
                  />
                ))}
                <span className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
                  step {open + 1} of 4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
