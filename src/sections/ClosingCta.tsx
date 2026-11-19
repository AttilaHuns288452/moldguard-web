import { CTA } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Page-1 closing CTA (PDF band 0.873–0.946). The PDF insets a transparent
 * bordered card in the navy band with the copy top-left and the two buttons
 * BELOW it, left-aligned — not beside the heading, which made the band 157px
 * shorter than the reference and read as a toolbar rather than a closing panel.
 */
export default function ClosingCta({ onDownloadPage = false }: { onDownloadPage?: boolean }) {
  // On /download the band's own primary CTA pointed at /download - a dead control
  // on the page whose entire job is conversion. There it points at the real
  // install instead, and the id stops colliding with the hero's.
  const primary = onDownloadPage
    ? { label: 'Scan the code above', href: '#app' }
    : CTA.primary
  return (
    <section id="closing-cta" className="band-dark py-[72px] md:py-[128px]">
      <div className="shell">
        <Reveal>
          <div className="rounded-shell border border-[#eaf2fc33] px-7 py-8 md:px-10 md:py-9">
            <LineReveal
              lines={splitTitle(CTA.title)}
              className="max-w-[24ch] text-[clamp(1.9rem,3.2vw,2.7rem)] leading-[1.1] font-[650] text-white"
            />
            <p className="lede mt-2 max-w-[560px] text-on-dark-2">{CTA.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={primary.href}
                className="inline-flex items-center rounded-btn bg-accent-ink px-[28px] py-[14px] text-[16px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                {primary.label}
              </a>
              <a
                href={CTA.secondary.href}
                className="inline-flex items-center rounded-btn bg-on-dark px-[28px] py-[14px] text-[16px] font-semibold text-deeper transition-colors hover:bg-white"
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
