/**
 * Minimal path routing. The PDF promo site is five separate pages, not one long
 * scroll, so the nav links are real routes. No router library: five static paths
 * and a popstate listener is all this needs.
 */
export const PAGES = ['home', 'features', 'how-it-works', 'contact', 'download'] as const
export type Page = (typeof PAGES)[number]
/** Not a route: a URL that matches nothing. Rendered as a real 404. */
export type Location_ = Page | 'not-found'

const PATHS: Record<Page, string> = {
  home: '/',
  features: '/features',
  'how-it-works': '/how-it-works',
  contact: '/contact',
  download: '/download',
}

export function pathFor(page: Page): string {
  return PATHS[page]
}

export function pageFromLocation(): Location_ {
  const p = window.location.pathname.replace(/\/+$/, '') || '/'
  const hit = (Object.entries(PATHS) as [Page, string][]).find(([, v]) => v === p)
  // 'not-found', NOT 'home': falling back to the home page served every mistyped
  // URL with HTTP 200 and the home content, so a broken link looked fine to both
  // the visitor and to a crawler.
  return hit ? hit[0] : 'not-found'
}

export function navigate(page: Page) {
  const path = pathFor(page)
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('routechange'))
  }
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
}

/**
 * Per-route document head. Every route was serving the home title, description
 * and canonical, and four of the five pages started at h2 — invisible to search
 * engines and awkward for a screen reader, which had no page heading to announce.
 */
const HEAD: Record<Location_, { title: string; description: string }> = {
  home: {
    title: 'MoldGuard - know when conditions become mold-friendly',
    description:
      'MoldGuard watches humidity, temperature and sustained exposure, scores a room-level environmental risk index, and dehumidifies automatically.',
  },
  features: {
    title: 'Features - MoldGuard',
    description:
      'Mold Risk Index engine, predictive weather integration, automatic dehumidification, analytics, alerts and automations. How MoldGuard compares with passive absorbers and commercial dehumidifiers.',
  },
  'how-it-works': {
    title: 'How it works - MoldGuard',
    description:
      'The closed loop: sense the room, analyze the real mold risk, dehumidify on its own, and report everything to the app. Plus setup and straight answers.',
  },
  contact: {
    title: 'Contact - MoldGuard',
    description:
      'Tell us about your space and get a quote, or reach the MoldGuard team directly by email or phone.',
  },
  download: {
    title: 'Get the app - MoldGuard',
    description: 'Scan to get the MoldGuard app and monitor your home from anywhere.',
  },
  'not-found': {
    title: 'Page not found - MoldGuard',
    description: 'That page does not exist. Head back to the MoldGuard home page.',
  },
}

export function applyHead(page: Location_) {
  const meta = HEAD[page]
  document.title = meta.title
  const set = (sel: string, attr: string, value: string) => {
    const el = document.querySelector(sel)
    if (el) el.setAttribute(attr, value)
  }
  set('meta[name="description"]', 'content', meta.description)
  // No canonical for a URL that does not exist: pointing it at '/' would tell a
  // crawler the wrong page is canonical.
  const url = page === 'not-found' ? null : `https://moldguard-web.vercel.app${pathFor(page)}`
  if (url) {
    set('link[rel="canonical"]', 'href', url)
    set('meta[property="og:url"]', 'content', url)
  } else {
    document.querySelector('link[rel="canonical"]')?.removeAttribute('href')
  }
  set('meta[property="og:title"]', 'content', meta.title)
  set('meta[property="og:description"]', 'content', meta.description)
  set('meta[name="twitter:title"]', 'content', meta.title)
  set('meta[name="twitter:description"]', 'content', meta.description)
}
