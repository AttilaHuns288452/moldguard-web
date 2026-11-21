/**
 * Responsive overflow gate: every route x 8 viewports, assert no horizontal scroll.
 * A single clipped word or fixed-width child is enough to break a phone layout, and
 * it is invisible in a desktop screenshot. Fails loudly instead.
 *
 *   node scripts/moball.mjs [url]
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const URL_ = process.argv[2] || 'http://127.0.0.1:5173'
const ROUTES = ['/', '/features', '/how-it-works', '/contact', '/download']
const WIDTHS = [320, 360, 390, 430, 768, 1024, 1440, 1920]

const b = await chromium.launch({ executablePath: findChromium() })
let bad = 0
for (const route of ROUTES) {
  for (const vw of WIDTHS) {
    const p = await b.newPage({ viewport: { width: vw, height: 800 } })
    await p.goto(URL_.replace(/\/$/, '') + route, { waitUntil: 'load' })
    await p.waitForTimeout(500)
    const r = await p.evaluate(() => ({
      over: document.documentElement.scrollWidth - innerWidth,
      // unscrollable clipped text (a word wider than its box)
      clipped: [...document.querySelectorAll('span,p,li,h1,h2,h3,a,td,th')]
        .filter((e) => !e.children.length && e.clientWidth > 1 && e.scrollWidth > e.clientWidth + 1)
        .map((e) => e.textContent.trim().slice(0, 24))
        .filter((t) => t && !/^Skip to content$/.test(t))
        .slice(0, 3),
    }))
    if (r.over > 1) { console.log(`OVERFLOW ${route} @${vw}: +${r.over}px`); bad++ }
    if (r.clipped.length) { console.log(`CLIPPED  ${route} @${vw}: ${r.clipped.join(' | ')}`); bad++ }
    await p.close()
  }
}
console.log(bad === 0 ? 'responsive: no overflow, no clipped text, 5 routes x 8 viewports' : `${bad} problems`)
await b.close()
process.exit(bad ? 1 : 0)
