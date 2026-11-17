import { CONTACT } from '../content'
import { Logo } from '../components/Marks'

const LINKS = [
  { href: '#problem', label: 'Problem' },
  { href: '#loop', label: 'The loop' },
  { href: '#features', label: 'Features' },
  { href: '#app', label: 'App' },
  { href: '#team', label: 'Team' },
  { href: '#faq', label: 'FAQ' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <a href="#top" className="flex items-center gap-2.5 text-ink">
              <Logo className="size-7 text-[#2563eb]" />
              <span className="text-[0.9375rem] font-medium tracking-tight">MoldGuard</span>
            </a>
            <p className="mt-3 max-w-xs text-[0.8125rem] leading-relaxed text-ink-3">
              IoT mold risk prevention &amp; detection. A closed loop that watches a room and runs
              the dehumidifier before mold gets a foothold.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Explore</p>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[0.8125rem] text-ink-2 transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[0.6562rem] font-semibold tracking-[0.12em] text-ink-3 uppercase">Talk to us</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="text-[0.8125rem] text-ink-2 transition-colors hover:text-ink">
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phoneHref}`} className="text-[0.8125rem] text-ink-2 transition-colors hover:text-ink">
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href="#contact" className="mt-2 inline-flex items-center gap-1 text-[0.8125rem] text-accent">
                  Get a quote →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[0.75rem] text-ink-2">
            &copy; {CONTACT.year} MoldGuard Team &middot; Prototype build &middot; photography is placeholder
          </p>
          <p className="max-w-xl text-[0.6875rem] leading-relaxed text-ink-2">
            <strong className="font-medium text-ink-2">Monitoring device</strong> &middot; not a mold
            diagnostic or substitute for professional inspection.
          </p>
        </div>
      </div>
    </footer>
  )
}
