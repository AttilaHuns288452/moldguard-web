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
