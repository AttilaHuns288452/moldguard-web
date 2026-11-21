import { COMPARISON } from '../content'
import { Reveal, LineReveal, Seq } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * PDF page 2, "How it compares." A four-column comparison table that the PDF
 * gives a full block of its own — the section had never been built, so the page
 * was missing its most convincing argument (why not a commercial dehumidifier).
 *
 * Rows are a real <table> so it reads as data, not as marketing cards; the third
 * row (ours) carries the accent so the comparison resolves visually.
 */
export default function Comparison() {
  return (
    <section id="compare" className="section band-white">
      <div className="shell">
        <LineReveal
          lines={splitTitle(COMPARISON.title)}
          className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-deep"
        />
        <Reveal delay={70}>
          <p className="lede mt-2 max-w-[62ch]">{COMPARISON.lede}</p>
        </Reveal>

        {/* desktop: a real table. Mobile: the same rows stacked, because four
            columns cannot be read at 360px without shrinking the type.

            Both are one Seq host, so the rows stagger off a single observer.
            A <tr> is not reliably transformable, so rows fade in place
            (.seq > tr) — the stagger is still per-row and still viewport-driven. */}
        <Reveal delay={90}>
          <div className="mt-9 overflow-hidden rounded-soft border border-line bg-card">
            <table className="hidden w-full border-collapse text-left md:table">
              <thead>
                <tr className="border-b border-line bg-paper-deep">
                  {COMPARISON.columns.map((c) => (
                    <th key={c} scope="col" className="px-5 py-3.5 text-[12px] font-[650] tracking-[0.1em] text-ink-2 uppercase">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <Seq as="tbody">
                {COMPARISON.rows.map((r) => (
                  <tr
                    key={r.option}
                    className={`border-b border-line transition-colors last:border-0 hover:bg-paper-deep/70 ${r.ours ? 'bg-[#2563eb0f] hover:bg-[#2563eb1a]' : ''}`}
                  >
                    <th scope="row" className={`px-5 py-5 align-top text-[15px] font-[650] ${r.ours ? 'text-accent-ink' : 'text-deep'}`}>
                      {r.option}
                      {r.ours && (
                        // whitespace-nowrap: at the table's 1st-column width this
                        // pill used to break "MOLDGUARD PROTOTYPE" across two lines
                        // inside a tight rounded blob. One short word instead.
                        <span className="mt-1.5 inline-flex items-center rounded-full bg-accent-ink px-2 py-0.5 text-[11px] font-[650] tracking-[0.06em] whitespace-nowrap text-white uppercase">
                          Prototype
                        </span>
                      )}
                    </th>
                    <td className={`px-5 py-5 align-top text-[14.5px] leading-relaxed ${r.ours ? 'text-ink' : 'text-ink-2'}`}>{r.does}</td>
                    <td className="px-5 py-5 align-top text-[14.5px] leading-relaxed text-ink-2">{r.cost}</td>
                    <td className="px-5 py-5 align-top text-[14.5px] leading-relaxed text-ink-2">{r.drawbacks}</td>
                  </tr>
                ))}
              </Seq>
            </table>

            {/* stacked */}
            <Seq as="ul" className="divide-y divide-line md:hidden">
              {COMPARISON.rows.map((r) => (
                <li key={r.option} className={`px-5 py-5 transition-colors hover:bg-paper-deep/70 ${r.ours ? 'bg-[#2563eb08] hover:bg-[#2563eb1a]' : ''}`}>
                  <p className={`text-[14.5px] font-[650] ${r.ours ? 'text-accent-ink' : 'text-deep'}`}>{r.option}</p>
                  <dl className="mt-2 grid gap-1.5">
                    {[['What it does', r.does], ['Cost model', r.cost], ['Drawbacks', r.drawbacks]].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[86px_1fr] gap-2">
                        <dt className="text-[11.5px] font-[650] tracking-[0.08em] text-ink-3 uppercase">{k}</dt>
                        <dd className="text-[13.5px] leading-relaxed text-ink-2">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              ))}
            </Seq>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
