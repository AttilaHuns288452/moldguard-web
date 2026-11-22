import { useEffect, useRef, useState } from 'react'
import { Menu, X, ArrowRight } from 'lucide-react'
import { Logo } from './Marks'

import { navigate, pathFor, type Page, type Location_ } from '../lib/route'
import { usePresence } from '../lib/motion'

const NAV: { id: Page; label: string }[] = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'download', label: 'Get the app' },
  { id: 'contact', label: 'Contact' },
]

export default function Header({ page }: { page: Location_ }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  // Keep the panel mounted through a short exit; `inert` on the closing panel
  // takes its links out of the tab order and the a11y tree at once, so a
  // keyboard user can never land on a link that is halfway off screen.
  const menu = usePresence(mobileOpen, 190)
  const menuBtn = useRef<HTMLButtonElement>(null)
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

  // Escape closes the open menu and returns focus to the control that opened it,
  // so a keyboard user is never left with focus on a link that just unmounted.
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMobileOpen(false)
      menuBtn.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:rounded-br-[10px] focus:bg-deep focus:px-4 focus:py-2 focus:text-on-dark">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-card">
        <nav aria-label="Main" className="shell flex flex-wrap items-center gap-x-4 gap-y-1 py-3 lg:flex-nowrap lg:gap-x-6 lg:gap-y-2 lg:py-[18px]">
          <a href={pathFor('home')} onClick={(e) => { e.preventDefault(); navigate('home') }} className="flex min-h-11 items-center gap-[11px]" aria-label="MoldGuard home">
            <Logo className="size-[34px] text-accent" />
            <span className="font-display text-[1.22rem] font-bold tracking-[-0.02em] text-ink">MoldGuard</span>
          </a>

          {/* desktop links */}
          <div className="order-3 hidden w-full basis-full gap-2 text-[13.5px] font-medium lg:order-none lg:ml-auto lg:flex lg:w-auto lg:basis-auto lg:gap-7 lg:text-[14px]">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={pathFor(n.id)}
                onClick={(e) => { e.preventDefault(); navigate(n.id) }}
                aria-current={page === n.id ? 'page' : undefined}
                className="nav-grow flex min-h-11 flex-1 items-center justify-center py-2.5 text-center text-[11.5px] text-ink-2 transition-colors hover:text-ink lg:min-h-10 lg:flex-none lg:justify-start lg:py-1 lg:text-[14px] lg:text-left"
              >
                {n.label}
              </a>
            ))}
          </div>

          {/* Mobile menu toggle sits before "Get the app" in the DOM to match its
              visual position above it (order-1 vs order-2). CSS reordering alone
              left the tab order running below-to-above on small screens. */}
          <button
            ref={menuBtn}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="order-1 grid size-11 shrink-0 place-items-center rounded-tight border border-line-hi text-deep lg:hidden"
          >
            {mobileOpen ? <X className="size-5" strokeWidth={2} /> : <Menu className="size-5" strokeWidth={2} />}
          </button>

          <a
            href={pathFor("download")}
            onClick={(e) => { e.preventDefault(); navigate("download") }}
            className="order-2 ml-auto inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-btn border border-line-hi px-[16px] py-2.5 text-[14px] font-[650] text-white bg-accent-ink border-accent-ink transition-colors hover:bg-deep active:scale-[.99] lg:ml-0 lg:-ml-2 lg:py-[10px]"
          >
            Get the app
          </a>
        </nav>

        {menu.mounted && (
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            inert={menu.closing || undefined}
            className={`menu-panel shell border-t border-line pb-4 lg:hidden ${menu.closing ? 'is-closing' : ''}`}
          >
            {NAV.map((n) => (
              <a
                key={n.id}
                href={pathFor(n.id)}
                onClick={(e) => {
                  // Close on the way out, navigate NOW: the exit animation must
                  // never sit between the tap and the route change.
                  e.preventDefault()
                  setMobileOpen(false)
                  navigate(n.id)
                }}
                aria-current={page === n.id ? 'page' : undefined}
                className={`flex min-h-12 items-center justify-between border-b border-line text-[16px] transition-colors active:text-deep ${page === n.id ? 'font-[650] text-deep' : 'text-ink-2'}`}
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
