import { useState } from 'react'
import { FAQ } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Objection handling. The FAQ copy already existed in content.ts but was never
 * rendered, so the page shipped with no answers to the obvious buyer questions.
 * Answers stay inside what the deck establishes; unknowns say so.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section section-alt">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <LineReveal
              lines={splitTitle('Questions, answered.')}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
            />
            <Reveal delay={80}>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
                The questions buyers actually ask before committing. Something not covered?{' '}
                <a href="#contact" className="font-[650] text-accent-ink underline-offset-2 hover:underline">
                  Ask the team
                </a>
                .
              </p>
            </Reveal>
          </div>

          <div>
            <ul className="divide-y divide-line border-t-2 border-deep">
              {FAQ.map((item, i) => {
                const isOpen = open === i
                return (
                  <Reveal as="li" key={item.q} delay={Math.min(i, 6) * 40}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="group flex w-full items-start justify-between gap-5 py-5 text-left"
                    >
                      <span className={`text-[15.5px] leading-snug transition-colors duration-200 ${
                        isOpen ? 'font-[650] text-deep' : 'text-ink-2 group-hover:text-deep'
                      }`}>
                        {item.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border text-[13px] transition-all duration-300 ${
                          isOpen
                            ? 'rotate-45 border-accent-ink bg-accent-ink text-white'
                            : 'border-[#b9b1a6] text-ink-2 group-hover:border-ink-3 group-hover:text-ink'
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <div
                      id={`faq-${i}`}
                      hidden={!isOpen}
                      className="max-w-[62ch] pb-6 pr-10 text-[14.5px] leading-relaxed text-ink-2 border-b border-line"
                    >
                      {item.a}
                    </div>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
