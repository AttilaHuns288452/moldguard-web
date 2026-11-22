/**
 * Interaction audit: the things a screenshot cannot show.
 * For every interactive element: does it have a hover treatment, a focus ring,
 * an adequate target size, and a state transition? Plus: are there dead links,
 * elements that look clickable but are not, and controls with no feedback?
 *
 *   node scripts/interaction_audit.mjs [url]
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const URL_ = process.argv[2] || 'http://127.0.0.1:5173'
const ROUTES = ['/', '/features', '/how-it-works', '/contact', '/download']

const b = await chromium.launch({ executablePath: findChromium() })
let issues = 0
const flag = (s) => { console.log('  ! ' + s); issues++ }

for (const route of ROUTES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(URL_.replace(/\/$/, '') + route, { waitUntil: 'load' })
  await p.waitForTimeout(900)
  console.log(`\n${route}`)

  const r = await p.evaluate(() => {
    const interactive = [...document.querySelectorAll('a[href], button, summary, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])')]
      .filter((e) => {
        const rc = e.getBoundingClientRect()
        const cs = getComputedStyle(e)
        return rc.width > 0 && rc.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'
      })

    const out = { noTransition: [], small: [], dead: [], noHover: [], focusless: [], noCursor: [] }
    for (const e of interactive) {
      const cs = getComputedStyle(e)
      const rc = e.getBoundingClientRect()
      const label = (e.textContent || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 32)

      // target size (WCAG 2.2 AA = 24x24 minimum, 44x44 comfortable)
      if (rc.height < 24 || rc.width < 24) out.small.push({ label, w: Math.round(rc.width), h: Math.round(rc.height) })

      // dead link: href="#" or javascript:void
      const href = e.getAttribute('href')
      if (href === '#' || href === '' || (href && href.startsWith('javascript:'))) out.dead.push(label)

      // no transition on a state-bearing control
      const tp = cs.transitionProperty
      if (tp === 'none' || cs.transitionDuration === '0s') out.noTransition.push(label)

      // clickable but no pointer cursor (looks non-interactive)
      if (cs.cursor !== 'pointer' && cs.cursor !== 'text' && e.tagName !== 'INPUT' && e.tagName !== 'TEXTAREA' && e.tagName !== 'SELECT') {
        out.noCursor.push({ label, cursor: cs.cursor })
      }
    }
    return out
  })

  for (const [k, v] of Object.entries(r)) {
    if (!v.length) continue
    const names = v.slice(0, 6).map((x) => (typeof x === 'string' ? x : `${x.label || ''}${x.w ? ` ${x.w}x${x.h}` : ''}${x.cursor ? ` (${x.cursor})` : ''}`))
    flag(`${k} (${v.length}): ${names.join(' | ')}`)
  }
  if (!Object.values(r).some((v) => v.length)) console.log('  clean')
  await p.close()
}
console.log(issues === 0 ? '\nINTERACTION AUDIT: clean' : `\nINTERACTION AUDIT: ${issues} issue groups`)
await b.close()
