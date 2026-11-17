import { CTA } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/** Navy CTA band, matching the approved site's final section. */
export default function ClosingCta() {
  return (
    <section id="download" className="bg-deep py-[72px] md:py-[88px]">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <LineReveal lines={splitTitle(CTA.title)} className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-white" />
              <p className="mt-1.5 max-w-[560px] text-[1.05rem] leading-relaxed text-on-dark-2">{CTA.lede}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={CTA.primary.href}
                className="inline-flex items-center rounded-[10px] bg-on-dark px-[28px] py-[14px] text-[16px] font-semibold text-deeper transition-colors hover:bg-white"
              >
                {CTA.primary.label}
              </a>
              <a
                href={CTA.secondary.href}
                className="inline-flex items-center rounded-[10px] border border-[#e8eaf659] bg-[#e8eaf614] px-[28px] py-[14px] text-[16px] font-semibold text-on-dark transition-colors hover:border-on-dark"
              >
                {CTA.secondary.label}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
