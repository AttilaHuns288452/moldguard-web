import { CTA } from '../content'
import { Reveal, LineReveal } from '../components/ui'
import { splitTitle } from '../lib/motion'

/**
 * Closing CTA. A navy card sitting on the pale band, with the dark footer below
 * it. Previously the CTA band itself was navy, so the card and the footer merged
 * into one 1000px dark block and the closing action had nothing to sit against.
 *
 * Layout follows the approved frame: copy left, the two buttons right and
 * vertically centred on wide screens; stacked below the copy on phones.
 */
export default function ClosingCta({ onDownloadPage = false }: { onDownloadPage?: boolean }) {
  const secondary = onDownloadPage ? CTA.downloadSecondary : CTA.secondary
  return (
    <section id="closing-cta" className="section band-pale">
      <div className="shell">
        <Reveal>
          <div className="rounded-shell bg-deep px-7 py-9 shadow-e2 md:px-11 md:py-11">
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
              <div>
                <LineReveal
                  lines={splitTitle(CTA.title)}
                  className="max-w-[22ch] text-[clamp(1.5rem,2.9vw,2.4rem)] leading-[1.12] font-[650] text-white"
                />
                <p className="mt-2.5 max-w-[52ch] text-[14.5px] leading-relaxed text-on-dark-2">{CTA.lede}</p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <a
                  href={CTA.primary.href}
                  className="inline-flex min-h-12 items-center rounded-btn bg-accent-ink px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
                >
                  {CTA.primary.label}
                </a>
                <a
                  href={secondary.href}
                  className="inline-flex min-h-12 items-center rounded-btn bg-on-dark px-7 py-3 text-[15px] font-semibold text-deeper transition-colors hover:bg-white"
                >
                  {secondary.label}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
