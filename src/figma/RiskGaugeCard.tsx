/**
 * The ANALYZE illustration from PDF page 3: a white card holding a semicircular
 * risk dial with three coloured zones (blue → light blue → navy), Low / Elevated /
 * High labels, a needle, the score 38, and the reading strip beneath it.
 *
 * Rebuilt as SVG from the approved page. The zones are the PDF's own three-stage
 * reading of the index, which is why the needle sits in the middle band at 38 —
 * the same value the rest of the site uses.
 */
export default function RiskGaugeCard() {
  // Semicircle from x=10 to x=150 (r=70). 38/100 of the arc for the needle.
  const cx = 80
  const cy = 74
  const r = 62
  const angle = Math.PI * (1 - 38 / 100) // 0 rad = left, pi = right
  const nx = cx + r * Math.cos(angle)
  const ny = cy - r * Math.sin(angle)

  return (
    <figure className="w-full max-w-[212px] overflow-hidden rounded-soft border border-line bg-card shadow-[0_1px_2px_rgba(21,56,94,.06),0_16px_36px_-28px_rgba(21,56,94,.5)]">
      <svg viewBox="0 0 160 92" className="mx-auto mt-4 block w-[160px]" role="img" aria-label="Mold Risk Index dial showing 38 out of 100, in the Elevated band">
        {/* three zones: safe, watch, act - the PDF's blue / light blue / navy */}
        <path d="M10 74a70 70 0 0 1 46.7 -66.4" fill="none" stroke="var(--color-accent, #2563eb)" strokeWidth="9" strokeLinecap="round" />
        <path d="M56.7 7.6a70 70 0 0 1 46.6 0" fill="none" stroke="#8fc4e8" strokeWidth="9" />
        <path d="M103.3 7.6a70 70 0 0 1 46.7 66.4" fill="none" stroke="var(--color-deep, #15385e)" strokeWidth="9" strokeLinecap="round" />
        {/* needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="var(--color-deep, #15385e)" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="4" fill="var(--color-deep, #15385e)" />
      </svg>
      <div className="-mt-6 text-center">
        <p className="measure text-[1.5rem] leading-none font-semibold text-deep">38</p>
        <p className="mt-0.5 text-[10px] tracking-[0.1em] text-ink-3 uppercase">Elevated</p>
      </div>
      <div className="mt-1 flex justify-between px-4 text-[10px] tracking-[0.08em] text-ink-3 uppercase">
        <span>Low</span><span>High</span>
      </div>
      <figcaption className="mt-3 border-t border-line px-4 py-2.5 text-[10.5px] leading-relaxed text-ink-3">
        Closet · 82% RH · 26h · dew −0.4°C
      </figcaption>
    </figure>
  )
}
