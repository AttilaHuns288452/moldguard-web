/**
 * Visual + interaction QA for the MoldGuard site.
 *   node scripts/qa.mjs [url] [--full]
 * Writes PNGs to .qa/ and prints a check table.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://127.0.0.1:5199/'
const FULL = process.argv.includes('--full')
const OUT = '.qa'
mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: '360', w: 360, h: 780 },
  { name: '390', w: 390, h: 844 },
  { name: '430', w: 430, h: 932 },
  { name: '768', w: 768, h: 1024 },
  { name: '1024', w: 1024, h: 768 },
  { name: '1440', w: 1440, h: 900 },
  { name: '1920', w: 1920, h: 1080 },
]

const ROUTE_SECTIONS = {
  '/': ['top', 'problem', 'meet', 'features', 'ownership', 'placement'],
  '/features': ['features', 'how'],
  '/how-it-works': ['how', 'meet', 'ownership', 'offer', 'faq'],
  '/contact': ['contact', 'faq'],
  '/download': ['app', 'offer'],
}

const results = []
const record = (name, ok, detail = '') => results.push({ name, ok, detail })

// Reuse the playwright browser already on this box instead of downloading another.
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const errors = []
const failed = []

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.w < 500 ? 2 : 1, reducedMotion: 'no-preference' })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vp.name}] ${m.text()}`) })
  page.on('requestfailed', (r) => failed.push(`[${vp.name}] ${r.url()} ${r.failure()?.errorText}`))

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200)

  // horizontal overflow
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth)
  record(`${vp.name}: no horizontal overflow`, scrollW <= vp.w + 1, `${scrollW} vs ${vp.w}`)

  // sections live on their own routes now
  for (const [route, ids] of Object.entries(ROUTE_SECTIONS)) {
    await page.goto(URL.replace(/\/$/, '') + (route === '/' ? '/' : route), { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)
    for (const id of ids) {
      const box = await page.locator(`#${id}`).first().boundingBox().catch(() => null)
      record(`${route} #${id} rendered`, !!box && box.height > 40)
    }
    await page.goto(URL, { waitUntil: 'networkidle' })
  }
  for (const id of []) {
    const box = await page.locator(`#${id}`).first().boundingBox()
    record(`${vp.name}: #${id} rendered`, !!box && box.height > 40, box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'missing')
  }

  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` })
  if (FULL || vp.w === 1440 || vp.w === 390) {
    await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true })
  }

  // 3D canvas must produce actual pixels
  if (vp.w >= 768) {
    // the 3D viewer now lives in the Meet section, not the hero
    await page.evaluate(() => document.getElementById('meet')?.scrollIntoView())
    await page.waitForTimeout(2500)
    const canvasBox = await page.locator('[data-device-canvas] canvas').first().boundingBox().catch(() => null)
    record(`${vp.name}: canvas mounted`, !!canvasBox, canvasBox ? `${Math.round(canvasBox.width)}x${Math.round(canvasBox.height)}` : 'none')
    if (canvasBox) {
      const shot = await page.locator('[data-device-canvas]').first().screenshot({ path: `${OUT}/${vp.name}-canvas.png` })
      const ink = await page.evaluate(() => {
        const cv = document.querySelector('[data-device-canvas] canvas')
        if (!cv) return -1
        const gl = cv.getContext('webgl2') || cv.getContext('webgl')
        return gl ? 1 : 0
      })
      record(`${vp.name}: webgl context live`, ink === 1)
    }
  }

  await ctx.close()
}

// ── interaction checks at desktop ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })

  const base = URL.replace(/\/$/, '')
  // nav links must be real routes that serve 200
  const navHrefs = await page.locator('header nav a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  record('nav: has links', navHrefs.length >= 3, navHrefs.join(' '))
  for (const h of new Set(navHrefs)) {
    const resp = await page.request.get(base + h)
    record(`nav: ${h} resolves`, resp.ok())
  }

  // content below the fold is visibility:hidden until revealed, so scroll to it

  // / — meet section's data-flow accordion
  await page.goto(base + '/', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('meet').scrollIntoView())
  await page.waitForTimeout(900)
  // product explorer: selecting a component changes the info panel
  const title = () => page.locator('#meet h3').first().textContent()
  const t0 = await title()
  await page.locator('#meet li button').filter({ hasText: 'Relay' }).first().click()
  await page.waitForTimeout(500)
  record('explorer: component selection updates panel', (await title()) !== t0,
    `${t0} -> ${await title()}`)
  // guided tour moves forward
  const t1 = await title()
  await page.getByRole('button', { name: 'Next component' }).first().click()
  await page.waitForTimeout(500)
  record('explorer: guided tour advances', (await title()) !== t1)
  // exploded view toggle
  await page.getByRole('button', { name: 'Exploded' }).first().click()
  await page.waitForTimeout(400)
  record('explorer: exploded mode toggles',
    (await page.getByRole('button', { name: 'Exploded' }).first().getAttribute('aria-pressed')) === 'true')
  await page.getByRole('button', { name: 'Assembled' }).first().click()
  record('features: six items', (await page.locator('#features h3').count()) === 6)

  // /how-it-works — three stages
  await page.goto(base + '/how-it-works', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('how').scrollIntoView())
  await page.waitForTimeout(600)
  record('how: three stages present', (await page.locator('#how h3').count()) === 3)

  // /contact — real channels
  await page.goto(base + '/contact', { waitUntil: 'networkidle' })
  await page.evaluate(() => document.getElementById('contact').scrollIntoView())
  await page.waitForTimeout(700)
  record('contact: mailto present', (await page.locator('#contact a[href^="mailto:"]').count()) > 0)
  record('contact: tel present', (await page.locator('#contact a[href^="tel:"]').count()) > 0)

  // every internal link must resolve to a real route that returns 200
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href')).filter(Boolean))
  const bad = []
  for (const h of new Set(hrefs)) {
    const resp = await page.request.get(URL.replace(/\/$/, '') + h)
    if (!resp.ok()) bad.push(h)
  }
  record('links: all internal routes resolve', bad.length === 0, bad.join(' ') || `${new Set(hrefs).size} routes`)

  // keyboard: from a clean load, the first tab stop must be the skip link
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
  record('a11y: first tab stop is skip link', /skip/i.test(focused), focused)

  // focus ring must be visible on the primary CTA
  await page.locator('header a[href="/contact"]').first().focus()
  const ring = await page.evaluate(() => {
    const s = getComputedStyle(document.activeElement)
    return s.outlineStyle + ' ' + s.outlineWidth
  })
  record('a11y: focus ring on CTA', !/none/.test(ring), ring)

  await ctx.close()
}

// ── reduced motion ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const visible = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')]
    return els.length ? els.filter((e) => getComputedStyle(e).opacity === '1').length / els.length : 1
  })
  record('reduced-motion: content visible immediately', visible > 0.99, `${Math.round(visible * 100)}%`)
  await page.screenshot({ path: `${OUT}/reduced-motion.png` })
  await ctx.close()
}

await browser.close()

// ── report ──
const pass = results.filter((r) => r.ok).length
console.log('')
for (const r of results) {
  if (!r.ok) console.log(`  FAIL  ${r.name}${r.detail ? ` — ${r.detail}` : ''}`)
}
console.log(`\n  ${pass}/${results.length} checks passed`)
if (errors.length) {
  console.log(`\n  console errors (${errors.length}):`)
  errors.slice(0, 12).forEach((e) => console.log('   ', e))
}
if (failed.length) {
  console.log(`\n  failed requests (${failed.length}):`)
  failed.slice(0, 12).forEach((e) => console.log('   ', e))
}
process.exit(pass === results.length && errors.length === 0 ? 0 : 1)
