/** Brand mark: a shield-ish enclosure with a rising risk arc. Pure SVG, inline. */
export function Logo({ className = 'size-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path
        d="M16 4.4 6.6 8.2v9.1c0 5.4 4.2 9.5 9.4 10.3 5.2-.8 9.4-4.9 9.4-10.3V8.2z"
        stroke="currentColor" strokeWidth="1.5"
      />
      <path d="M10.6 20.6c1.5-4.4 3.3-6.6 5.4-6.6s3.9 2.2 5.4 6.6" stroke="currentColor" strokeWidth="1.4" opacity=".55" />
      <circle cx="16" cy="15.2" r="2.1" fill="currentColor" />
    </svg>
  )
}

export function Noise({ className = '' }: { className?: string }) {
  return <div className={`grain pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" />
}

/** Instrument-style dial: single accent arc over a hairline track. */
export function Dial({
  value, label, sub, accent = '#2563eb', size = 132,
}: { value: number; label: string; sub?: string; accent?: string; size?: number }) {
  const r = size / 2 - 9
  const c = 2 * Math.PI * r
  const filled = (Math.min(100, Math.max(0, value)) / 100) * c
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#d7e3f2" strokeWidth="2" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth="2.5"
          strokeDasharray={`${filled} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray .8s cubic-bezier(.22,1,.36,1)' }}
        />
        <text
          x={size / 2} y={size / 2 + 2} textAnchor="middle" dominantBaseline="middle"
          fill="#15385e" fontSize={size * 0.245} fontFamily="Spline Sans Mono, monospace" fontWeight="500"
        >
          {Math.round(value)}
        </text>
      </svg>
      <div>
        <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">{label}</p>
        {sub && <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-2">{sub}</p>}
      </div>
    </div>
  )
}
