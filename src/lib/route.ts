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

/** Path -> known route, or null. One lookup, shared by the initial read and by
 *  the delegated link handler in App, so an unknown path never becomes a route. */
export function pageFor(pathname: string): Page | null {
  const p = pathname.replace(/\/+$/, '') || '/'
  const hit = (Object.entries(PATHS) as [Page, string][]).find(([, v]) => v === p)
  return hit ? hit[0] : null
}

export function pageFromLocation(): Location_ {
  // 'not-found', NOT 'home': falling back to the home page served every mistyped
  // URL with HTTP 200 and the home content, so a broken link looked fine to both
  // the visitor and to a crawler.
  return pageFor(window.location.pathname) ?? 'not-found'
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
    title: 'MoldGuard - less guessing, more control over damp rooms',
    description:
      'One device for one small damp room: room monitoring, a Mold Risk Index and automatic dehumidification, with status and control in the companion app. One-time price PHP 9,994, no subscription. Ask about MoldGuard.',
  },
  features: {
    title: 'Features - MoldGuard',
    description:
      'Mold Risk Index engine, predictive weather integration, automatic dehumidification, analytics, alerts and automations. How MoldGuard compares with passive absorbers and commercial dehumidifiers.',
  },
  'how-it-works': {
    title: 'How it works - MoldGuard',
    description:
      'The closed loop: sense the room, score the real mold risk, dehumidify on its own, and report status to the companion app. Plus setup and straight answers.',
  },
  contact: {
    title: 'Ask about MoldGuard - MoldGuard',
    description:
      'Tell us the room, roughly how big it is and where condensation shows up. We reply with suitability, what the price covers and the next step. No payment, no commitment.',
  },
  download: {
    title: 'Get the MoldGuard app - MoldGuard',
    description:
      'The companion app for the MoldGuard device: live risk score, alerts and control. Pairs with the hardware; request the build from the team.',
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
