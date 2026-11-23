import { CTA } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Page-1 closing CTA (PDF band 0.873–0.946). The PDF insets a transparent
 * bordered card in the navy band with the copy top-left and the two buttons
 * BELOW it, left-aligned — not beside the heading.
 *
 * Both routes sell. The quotation stays primary; the second action differs by
 * page so it is never a duplicate contact link. On /download it requests the
 * app build from the team, which is the only honest app action there.
 */
export default function ClosingCta({ onDownloadPage = false }: { onDownloadPage?: boolean }) {
  const secondary = onDownloadPage ? CTA.downloadSecondary : CTA.secondary
  return (
    <section id="closing-cta" className="band-dark py-[72px] md:py-[128px]">
      <div className="shell">
        <Reveal>
          <div className="rounded-shell border border-[#eaf2fc33] px-7 py-8 md:px-10 md:py-9">
            <LineReveal
              lines={splitTitle(CTA.title)}
              className="max-w-[24ch] text-[clamp(1.55rem,3.2vw,2.9rem)] leading-[1.1] font-[650] text-white"
            />
            <p className="lede mt-2 max-w-[560px] text-on-dark-2">{CTA.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={CTA.primary.href}
                className="inline-flex items-center rounded-btn bg-accent-ink px-[28px] py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                {CTA.primary.label}
              </a>
              <a
                href={secondary.href}
                className="inline-flex items-center rounded-btn bg-on-dark px-[28px] py-[14px] text-[16px] font-semibold text-deeper transition-colors hover:bg-white"
              >
                {secondary.label}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
