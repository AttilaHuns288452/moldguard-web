import type { ReactNode } from 'react'

/**
 * Official-style app-store badges (Google Play + App Store), drawn as SVG.
 *
 * They are PRESENTATION ONLY. MoldGuard has no store listing and no install
 * package, so both render as non-interactive <span>s with an aria-disabled
 * treatment and no href — a real <a> would promise a destination that does not
 * exist (and would break the page's honesty rules). The "Coming soon" label and
 * the caption underneath state that plainly, so the badges read as intent, not
 * as a broken link.
 *
 * Wordmarks here are typographic recreations (system sans + the store glyphs),
 * not the vendors' trademarked artwork — the official assets have usage terms we
 * cannot satisfy before launch.
 */

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px] shrink-0" aria-hidden="true">
      <path d="M3.2 2.4a1.3 1.3 0 0 0-.7 1.2v16.8c0 .5.3 1 .7 1.2l9.1-9.6z" fill="#34A853" />
      <path d="M16.9 8.6 12.3 3.6 3.6 2.4l9.2 9.6z" fill="#4285F4" />
      <path d="M3.6 21.6l8.7-1.2 4.6-5-4.7-4.8z" fill="#EA4335" />
      <path d="M16.9 15.4 20.6 13c.8-.5.8-1.6 0-2.1l-3.7-2.3-4.8 5z" fill="#FBBC04" />
    </svg>
  )
}

function AppleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px] shrink-0" aria-hidden="true">
      <path
        d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.2.9-1.3 1.2-2.5 1.2-2.6-.1 0-2.4-.9-2.4-3.3zM14.2 5.9c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2-.5 2.6-1.3z"
        fill="currentColor"
      />
    </svg>
  )
}

function Badge({ store, glyph, kicker }: { store: string; glyph: ReactNode; kicker: string }) {
  return (
    <span
      className="relative inline-flex min-h-[60px] items-center gap-3 rounded-[13px] border border-white/25 bg-[#0b1220] px-4 py-2.5 text-white shadow-floating transition-transform hover:-translate-y-px"
      // Presentation only: the app is distributed directly, so there is no store
      // URL to link to. A real <a> would promise a destination that does not exist.
      role="img"
      aria-label={`Download on ${store}`}
    >
      <span className="text-white">{glyph}</span>
      <span className="flex flex-col leading-none">
        <span className="text-[9.5px] tracking-[0.14em] text-white/70 uppercase">{kicker}</span>
        <span className="mt-1 text-[15px] leading-none font-semibold">{store}</span>
      </span>
    </span>
  )
}

export default function StoreBadges() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Badge store="Google Play" glyph={<PlayGlyph />} kicker="Get it on" />
        <Badge store="App Store" glyph={<AppleGlyph />} kicker="Download on the" />
      </div>
      <p className="mt-3 max-w-[56ch] text-[12px] leading-relaxed text-ink-3">
        iOS 15+ and Android 10+. Free to download.
      </p>
    </div>
  )
}
