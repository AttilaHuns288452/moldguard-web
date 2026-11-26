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
