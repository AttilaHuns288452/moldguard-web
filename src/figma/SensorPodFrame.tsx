/**
 * The SENSE illustration from PDF page 3: a tall rounded pod with three status
 * dots (top solid blue, two muted) and a centred "Sensor pod" label.
 *
 * Rebuilt as SVG from the approved page rather than lifted as a bitmap, so it
 * stays crisp at every density and inherits the site's palette. Proportions are
 * measured off the PDF at 60dpi: the pod is ~1 : 1.5 (w : h) with a corner radius
 * near 28% of its width, which is a rounded rectangle, not a capsule.
 */
export default function SensorPodFrame({ label = 'Sensor pod' }: { label?: string }) {
  return (
    <figure className="flex flex-col items-center">
      <svg
        viewBox="0 0 120 180"
        className="h-auto w-[120px]"
        role="img"
        aria-label="Sensor pod: a compact wall unit with a live status light"
      >
        <rect
          x="1"
          y="1"
          width="118"
          height="178"
          rx="33"
          fill="#f4f9ff"
          stroke="var(--color-line-hi, #b9cde4)"
          strokeWidth="1.5"
        />
        {/* top dot is the live one; the other two are dormant, exactly as the PDF
            draws them - one solid cobalt, two muted blue-greys */}
        <circle cx="60" cy="52" r="9" fill="var(--color-accent, #2563eb)" />
        <circle cx="60" cy="92" r="9" fill="#c3d4e6" />
        <circle cx="60" cy="132" r="9" fill="#c3d4e6" />
      </svg>
      <figcaption className="mt-2 text-[11.5px] text-ink-3">{label}</figcaption>
    </figure>
  )
}
