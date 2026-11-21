/**
 * Route capture for review: full-page shots of every route at desktop + mobile.
 *   node scripts/shots.mjs [url] [outdir]
 * Distinct from qa.mjs (assertions); this only produces evidence.
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
import { mkdirSync } from 'node:fs'

const URL_ = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://127.0.0.1:5173/'
const OUT = process.argv[3] || '.qa/shots'
mkdirSync(OUT, { recursive: true })

const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const ROUTES = ['/', '/features', '/how-it-works', '/contact', '/download']
const VIEWPORTS = [
  { name: 'desk', w: 1440, h: 900 },
  { name: 'mob', w: 390, h: 844 },
]

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    deviceScaleFactor: vp.w < 500 ? 2 : 1,
  })
  const page = await ctx.newPage()
  for (const route of ROUTES) {
    const url = URL_.replace(/\/$/, '') + (route === '/' ? '/' : route)
    await page.goto(url, { waitUntil: 'load', timeout: 60000 })
    // Walk the page so viewport-driven entrances fire. MUST force instant
    // scrolling: html{scroll-behavior:smooth} makes successive scrollTo() calls
    // cancel each other, so a "walk" can silently end mid-page and leave every
    // below-fold .reveal at opacity 0 — which then screenshots as an empty band.
    const reveal = await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto'
      // Walk with a RE-MEASURED bound. The page grows while we walk (the 3D stage
      // mounts lazily and inserts a canvas), so a bound captured once ends the
      // walk short of the real bottom and strands the last sections at opacity 0.
      for (let pass = 0; pass < 3; pass++) {
        const step = innerHeight * 0.6
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo({ top: y, behavior: 'instant' })
          await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 90)))
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
        await new Promise((r) => setTimeout(r, 600))
        if (window.scrollY + innerHeight >= document.body.scrollHeight - 4) break
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 500))
      const all = [...document.querySelectorAll('.reveal')]
      const hidden = all.filter((e) => getComputedStyle(e).opacity !== '1')
      return { total: all.length, hidden: hidden.length, secs: [...new Set(hidden.map((e) => e.closest('section')?.id || e.tagName))] }
    })
    if (reveal.hidden > 0) {
      console.warn(`  ! ${vp.name}-${route}: ${reveal.hidden}/${reveal.total} reveals still hidden (${reveal.secs.join(',')})`)
    }
    // 3D needs idle time after intersection
    await page.waitForTimeout(2500)
    const name = route === '/' ? 'home' : route.slice(1)
    await page.screenshot({ path: `${OUT}/${vp.name}-${name}.png`, fullPage: true })
    console.log(`${vp.name}-${name}.png`)
  }
  await ctx.close()
}

await browser.close()
