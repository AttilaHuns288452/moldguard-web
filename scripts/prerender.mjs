/**
 * Static per-route HTML after build.
 *
 * Vercel rewrites every path to one index.html, and applyHead() only runs in a
 * client effect - so curl, Slack/LinkedIn unfurlers and any crawler that does not
 * execute JS saw the HOME title/canonical/og on all five routes. Verified live:
 * `curl /features | grep title` returned the home title. This copies index.html to
 * features.html, how-it-works.html, contact.html and download.html with that
 * route's own head, so the raw HTML is correct and the SPA still takes over.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const DIST = resolve('dist')
const HOST = 'https://moldguard-web.vercel.app'

const ROUTES = {
  '': {
    title: 'MoldGuard - know when conditions become mold-friendly',
    description:
      'MoldGuard watches humidity, temperature and sustained exposure, scores a room-level environmental risk index, and dehumidifies automatically. Student prototype, not a mold diagnostic.',
  },
  features: {
    title: 'Features - MoldGuard',
    description:
      'Mold Risk Index engine, environmental and VOC monitoring, automatic dehumidification, analytics, alerts and automations. How MoldGuard compares with passive absorbers and commercial dehumidifiers.',
  },
  'how-it-works': {
    title: 'How it works - MoldGuard',
    description:
      'The closed loop: sense the room, analyze the real mold risk, dehumidify on its own, and report everything to the app. Plus setup and straight answers.',
  },
  contact: {
    title: 'Contact - MoldGuard',
    description: 'Tell us about your space and get a quote, or reach the MoldGuard team directly by email or phone.',
  },
  download: {
    title: 'Get the app - MoldGuard',
    description: 'Scan to get the MoldGuard app and monitor your home from anywhere.',
  },
  '__404__': {
    title: 'Page not found - MoldGuard',
    description: 'That page does not exist. Head back to the MoldGuard home page.',
  },
}

const src = readFileSync(resolve(DIST, 'index.html'), 'utf8')
const faqSchema = readFileSync(resolve(DIST, 'faq.json'), 'utf8').trim().replace(/</g, '\\u003c')
const faqSlot = '<script type="application/ld+json" id="faq-schema"></script>'
if (!src.includes(faqSlot)) throw new Error('prerender: FAQ schema slot missing in index.html')

for (const [route, meta] of Object.entries(ROUTES)) {
  const notFound = route === '__404__'
  const url = `${HOST}/${route}`
  let html = src.replace(faqSlot, `<script type="application/ld+json" id="faq-schema">${faqSchema}</script>`)
  if (notFound) {
    html = html
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>\n?/, '')
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>\s*/, '')
  }
  // each replacement targets the exact tag index.html ships, so a template
  // change fails loudly here instead of silently emitting the wrong head
  const swaps = [
    [/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`],
    [/<meta name="description" content="[^"]*"/, `<meta name="description" content="${meta.description}"`],
    ...(!notFound ? [[/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`]] : []),
    [/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${meta.title}"`],
    [/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${meta.description}"`],
    ...(!notFound ? [[/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`]] : []),
    [/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${meta.title}"`],
    [/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${meta.description}"`],
  ]
  for (const [re, rep] of swaps) {
    if (!re.test(html)) throw new Error(`prerender: ${re} did not match in index.html`)
    html = html.replace(re, rep)
  }
  const out = resolve(DIST, route === '' ? 'index.html' : route === '__404__' ? '404.html' : `${route}.html`)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  console.log(`prerendered ${route === '__404__' ? '404' : route || '/'} -> ${out.replace(DIST + '/', '')}`)
}
