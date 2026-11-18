import { CONTACT } from '../content'
import { Logo } from '../components/Marks'

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/contact', label: 'Contact' },
  { href: '/download', label: 'Get Started' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="shell grid gap-10 py-12 md:grid-cols-3">
        <div className="max-w-[280px]">
          <span className="flex items-center gap-2.5">
            <Logo className="size-[34px] text-deep" />
            <span className="font-display text-[1.22rem] font-bold tracking-[-0.02em] text-ink">MoldGuard</span>
          </span>
          <p className="mt-1.5 text-[14px] text-ink-2">IoT mold risk prevention &amp; detection</p>
        </div>

        <nav aria-label="Footer" className="grid gap-2 text-[14px]">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="inline-flex min-h-8 items-center py-1 text-ink-2 transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="grid gap-2 text-[14px]">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-8 items-center py-1 text-ink-2 transition-colors hover:text-ink">
            {CONTACT.email}
          </a>
          <a href={`tel:${CONTACT.phoneHref}`} className="inline-flex min-h-8 items-center py-1 text-ink-2 transition-colors hover:text-ink">
            {CONTACT.phone}
          </a>
        </div>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-line py-5 text-[10px] leading-relaxed text-ink-3">
        <span>&copy; {CONTACT.year} MoldGuard Team</span>
        <span>Prototype build &middot; photography is placeholder</span>
        <span>Monitoring device &middot; not a mold diagnostic or substitute for professional inspection</span>
      </div>
    </footer>
  )
}
