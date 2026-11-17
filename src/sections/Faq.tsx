import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FAQ } from '../content'
import { Reveal, SectionHead } from '../components/ui'

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead
              index="08"
              label="FAQ"
              title={
                <>
                  Straight
                  <br />
                  <span className="text-ink-3">answers.</span>
                </>
              }
              lead="Where the build does not establish an answer, we say so rather than invent one."
            />
          </div>

          <div>
            <div className="divide-y divide-line border-t border-line">
              {FAQ.map((item, i) => {
                const isOpen = open === i
                return (
                  <Reveal key={item.q} delay={Math.min(i, 5) * 45}>
                    <div className="group">
                      <div>
                        <button
                          type="button"
                          onClick={() => setOpen(isOpen ? null : i)}
                          aria-expanded={isOpen}
                          aria-controls={`faq-${i}`}
                          className="flex w-full items-start justify-between gap-5 py-5 text-left"
                        >
                          <span
                            className={`text-[0.9375rem] leading-snug transition-colors duration-200 ${
                              isOpen ? 'text-ink' : 'text-ink-2 group-hover:text-ink-2'
                            }`}
                          >
                            {item.q}
                          </span>
                          <Plus
                            className={`mt-0.5 size-4 shrink-0 transition-all duration-300 ${
                              isOpen ? 'rotate-45 text-accent' : 'text-ink-3 group-hover:text-ink-2'
                            }`}
                            strokeWidth={1.75}
                          />
                        </button>
                      </div>
                      <div
                        id={`faq-${i}`}
                        hidden={!isOpen}
                        className="max-w-2xl pb-6 pr-8 text-[0.875rem] leading-relaxed text-ink-2"
                      >
                        {item.a}
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
