import { Logo } from './Marks'

const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:rounded-br-[10px] focus:bg-deep focus:px-4 focus:py-2 focus:text-on-dark">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <nav aria-label="Main" className="shell flex flex-wrap items-center gap-x-8 gap-y-2 py-[18px] md:flex-nowrap md:py-[18px]">
          <a href="#top" className="flex items-center gap-[11px]" aria-label="MoldGuard home">
            <Logo className="size-[34px] text-deep" />
            <span className="font-display text-[1.22rem] font-bold tracking-[-0.02em] text-ink">MoldGuard</span>
          </a>

          {/* desktop links */}
          <div className="ml-auto order-3 flex w-full gap-2 text-[13.5px] font-medium md:order-none md:w-auto md:gap-8 md:text-[14.5px]">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="nav-grow flex min-h-11 flex-1 items-center justify-center py-2.5 text-center text-ink-2 transition-colors hover:text-ink md:min-h-0 md:flex-none md:justify-start md:py-1 md:text-left"
              >
                {n.label}
              </a>
            ))}
          </div>

          <a
            href="#download"
            className="ml-auto inline-flex min-h-11 items-center rounded-tight bg-accent-ink px-[18px] py-2.5 text-[14px] font-semibold text-white transition-all duration-200 ease-[cubic-bezier(.4,0,.2,1)] hover:bg-deep hover:shadow-[0_10px_24px_-14px_rgba(30,54,128,.7)] active:scale-[.98] md:ml-0 md:-ml-4 md:px-[22px] md:py-[11px] md:text-[15px]"
          >
            Get Started
          </a>
        </nav>
      </header>
    </>
  )
}
