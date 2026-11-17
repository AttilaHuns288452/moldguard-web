import type { ReactNode } from 'react'
import { useInView } from '../lib/motion'

export function Reveal({
  children, delay = 0, className = '', as: Tag = 'div',
}: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>
}

export function SectionHead({
  index, label, title, lead, align = 'left', max = 'max-w-2xl',
}: { index?: string; label: string; title: ReactNode; lead?: ReactNode; align?: 'left' | 'center'; max?: string }) {
  return (
    <div className={`${align === 'center' ? 'mx-auto text-center' : ''} ${max}`}>
      <Reveal>
        <Eyebrow className="mb-5 flex items-center gap-3">
          {index && <span className="font-mono text-[0.6875rem] text-accent">{index}</span>}
          {index && <span className="h-px w-6 bg-line-hi" aria-hidden="true" />}
          {label}
        </Eyebrow>
      </Reveal>
      <Reveal delay={70}>
        <h2 className="text-[clamp(1.9rem,4.4vw,3.1rem)] font-medium text-ink">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={140}>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-2">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}

export function Cta({
  href, children, variant = 'solid', external,
}: { href: string; children: ReactNode; variant?: 'solid' | 'ghost'; external?: boolean }) {
  const cls =
    variant === 'solid'
      ? 'bg-accent-ink text-white hover:bg-[#1d4ed8] shadow-[0_16px_44px_-18px_#2563eb]'
      : 'border border-line-hi text-ink-2 hover:border-line-hi hover:bg-white/[0.035]'
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={`group inline-flex items-center justify-center gap-2.5 rounded-tight px-6 py-3.5 text-[0.9375rem] font-medium transition-colors duration-200 ${cls}`}
    >
      {children}
    </a>
  )
}

export function Rule({ className = '' }: { className?: string }) {
  return <div className={`hairline ${className}`} aria-hidden="true" />
}

export function DemoTag({ children = 'Illustrative data' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-3/25 bg-ink-3/[0.07] px-2.5 py-1 text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">
      <span className="size-1 rounded-full bg-ink-3" aria-hidden="true" />
      {children}
    </span>
  )
}
