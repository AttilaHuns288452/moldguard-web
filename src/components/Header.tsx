import { useEffect, useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { Logo } from './Marks'

const NAV = [
  { id: 'problem', label: 'Problem' },
  { id: 'loop', label: 'The loop' },
  { id: 'risk', label: 'Risk index' },
  { id: 'features', label: 'Features' },
  { id: 'app', label: 'App' },
  { id: 'faq', label: 'FAQ' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV.map((n) => n.id)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-tight focus:bg-accent-ink focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled || open ? 'border-b border-line bg-card backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2.5 text-ink" onClick={() => setOpen(false)}>
            <Logo className="size-7 text-[#2563eb]" />
            <span className="text-[0.9375rem] font-medium tracking-tight">MoldGuard</span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                aria-current={active === n.id ? 'true' : undefined}
                className={`relative rounded-tight px-3 py-2 text-[0.8125rem] transition-colors duration-200 ${
                  active === n.id ? 'text-ink' : 'text-ink-3 hover:text-ink-2'
                }`}
              >
                {n.label}
                {active === n.id && (
                  <span className="absolute inset-x-3 bottom-0.5 h-px bg-accent" aria-hidden="true" />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-1.5 rounded-tight bg-accent-ink px-4 py-2.5 text-[0.8125rem] font-medium text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Get a quote
              <ArrowUpRight className="size-3.5" strokeWidth={2} />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-10 place-items-center rounded-tight border border-line text-ink-2 lg:hidden"
            >
              {open ? <X className="size-4" strokeWidth={1.75} /> : <Menu className="size-4" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="fixed inset-0 top-[68px] z-40 bg-paper backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="shell flex flex-col divide-y divide-line pt-2">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-4 text-[1.0625rem] text-ink-2"
            >
              {n.label}
              <span className="font-mono text-[0.6875rem] text-ink-3">0{NAV.indexOf(n) + 1}</span>
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="py-5 text-[1.0625rem] text-accent">
            Get a quote →
          </a>
        </nav>
      </div>
    </>
  )
}
