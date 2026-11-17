import { useEffect, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from './Marks'

const NAV = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'offer', label: 'What you get' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  // keep anchor jumps clear of the sticky header, whatever height it takes
  useEffect(() => {
    const el = document.querySelector('header')
    if (!el) return
    const apply = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:rounded-br-[10px] focus:bg-deep focus:px-4 focus:py-2 focus:text-on-dark">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <nav aria-label="Main" className="shell flex flex-wrap items-center gap-x-4 gap-y-1 py-3 lg:flex-nowrap lg:gap-x-6 lg:gap-y-2 lg:py-[18px]">
          <a href="#top" className="flex items-center gap-[11px]" aria-label="MoldGuard home">
            <Logo className="size-[34px] text-deep" />
            <span className="font-display text-[1.22rem] font-bold tracking-[-0.02em] text-ink">MoldGuard</span>
          </a>

          {/* desktop links */}
          <div className="order-3 hidden w-full basis-full gap-2 text-[13.5px] font-medium lg:order-none lg:ml-auto lg:flex lg:w-auto lg:basis-auto lg:gap-7 lg:text-[14px]">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="nav-grow flex min-h-11 flex-1 items-center justify-center py-2.5 text-center text-[11.5px] text-ink-2 transition-colors hover:text-ink lg:min-h-0 lg:flex-none lg:justify-start lg:py-1 lg:text-[14px] lg:text-left"
              >
                {n.label}
              </a>
            ))}
          </div>

          <a
            href="#download"
            className="order-2 ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-tight border border-line-hi px-[16px] py-2.5 text-[14px] font-[650] text-deep transition-colors duration-200 hover:border-deep hover:bg-[#15385e0a] active:scale-[.99] lg:ml-0 lg:-ml-2 lg:py-[10px]"
          >
            Get Started
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="order-1 grid size-11 shrink-0 place-items-center rounded-tight border border-line-hi text-deep lg:hidden"
          >
            {mobileOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
          </button>
        </nav>

        {mobileOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="shell border-t border-line pb-4 lg:hidden">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 items-center justify-between border-b border-line text-[16px] text-ink-2 active:text-deep"
              >
                {n.label}
                <ArrowRight className="size-4 text-ink-3" strokeWidth={2} />
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
