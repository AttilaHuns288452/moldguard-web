/**
 * Minimal path routing. The PDF promo site is five separate pages, not one long
 * scroll, so the nav links are real routes. No router library: five static paths
 * and a popstate listener is all this needs.
 */
export const PAGES = ['home', 'features', 'how-it-works', 'contact', 'download'] as const
export type Page = (typeof PAGES)[number]

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

export function pageFromLocation(): Page {
  const p = window.location.pathname.replace(/\/+$/, '') || '/'
  const hit = (Object.entries(PATHS) as [Page, string][]).find(([, v]) => v === p)
  return hit ? hit[0] : 'home'
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
const HEAD: Record<Page, { title: string; description: string }> = {
  home: {
    title: 'MoldGuard - know mold is coming before it shows',
    description:
      'MoldGuard watches humidity, temperature and air conditions, scores your mold risk in real time, and activates a connected dehumidifier when conditions become unsafe.',
  },
  features: {
    title: 'Features - MoldGuard',
    description:
      'Mold Risk Index engine, environmental and VOC monitoring, automatic dehumidification, analytics, alerts and automations. How MoldGuard compares with passive absorbers and commercial dehumidifiers.',
  },
  'how-it-works': {
    title: 'How it works - MoldGuard',
    description:
      'The closed loop: sense the room, analyze the real mold risk, respond on your own dehumidifier, and report everything to the app. Plus setup and straight answers.',
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
}

export function applyHead(page: Page) {
  const meta = HEAD[page]
  document.title = meta.title
  const set = (sel: string, attr: string, value: string) => {
    const el = document.querySelector(sel)
    if (el) el.setAttribute(attr, value)
  }
  set('meta[name="description"]', 'content', meta.description)
  const url = `https://moldguard-web.vercel.app${pathFor(page)}`
  set('link[rel="canonical"]', 'href', url)
  set('meta[property="og:url"]', 'content', url)
  set('meta[property="og:title"]', 'content', meta.title)
  set('meta[property="og:description"]', 'content', meta.description)
  set('meta[name="twitter:title"]', 'content', meta.title)
  set('meta[name="twitter:description"]', 'content', meta.description)
}
