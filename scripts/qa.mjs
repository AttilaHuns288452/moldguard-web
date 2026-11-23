/**
 * Visual + interaction QA for the MoldGuard site.
 *   node scripts/qa.mjs [url] [--full]
 * Writes PNGs to .qa/ and prints a check table.
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const URL = process.argv[2]?.startsWith('http') ? process.argv[2] : 'http://127.0.0.1:5173/'
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

// Section ids actually rendered per route. Keep in sync with App.tsx — the QA
// suite exists to catch a route that lost a section, so a stale map here
// silently passes a broken page.
const ROUTE_SECTIONS = {
  '/': ['top', 'problem', 'meet', 'features', 'ownership', 'placement', 'faq', 'closing-cta'],
  '/features': ['capabilities', 'features', 'what', 'risk', 'compare', 'parts', 'closing-cta'],
  '/how-it-works': ['how', 'faq', 'closing-cta'],
  '/contact': ['contact', 'faq'],
  '/download': ['app', 'closing-cta'],
}


const results = []
const record = (name, ok, detail = '') => results.push({ name, ok, detail })
// Guard: every route-map id must be rendered by SOME section component, otherwise
// the map has drifted from App.tsx. This drifted twice (duplicate ids, then a
// deleted section), each time making the suite fail on something that did not
// exist. A grep is enough: section files declare their own id.
{
  const { readdirSync, readFileSync } = await import('node:fs')
  const src = readdirSync('src/sections').map((f) => readFileSync('src/sections/' + f, 'utf8')).join('\n')
  const missing = [...new Set(Object.values(ROUTE_SECTIONS).flat())].filter((id) => !src.includes('id="' + id + '"'))
  record('qa map: every route-section id exists in a component', missing.length === 0, missing.join(' '))
}


import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const errors = []
const failed = []
const thirdPartyFailed = []
let navigationInFlight = false

/**
 * Load a URL. `networkidle` never fires on production (Vercel keeps a beacon/
 * font connection open), so a plain goto there times out 30s and kills the whole
 * suite. Wait for 'load', then give the app a short settle window, and only try
 * 'networkidle' best-effort when we are on localhost.
 */
async function open(page, url, settle = 700) {
  navigationInFlight = true
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.locator('main h1').first().waitFor({ state: 'attached', timeout: 20000 })
  } finally {
    navigationInFlight = false
  }
  // App readiness is explicit above; lazy WebGL and font requests are checked
  // separately and must not hold every navigation behind network-idle timing.
  await page.waitForTimeout(settle)
}

/**
 * Percentage of a 3D stage's pixels that are NOT its backdrop, judged by RGB
 * distance from the sampled corner colour. Whole-canvas variance cannot tell a
 * blank stage from a drawn one here: the hero's radial-gradient ground plus the
 * HTML overlays keep the colour count high with no model at all. Returns -1 when
 * the stage or its pixels are unavailable.
 */
async function modelInk(page, selector) {
  const shot = await page.locator(selector).first().screenshot({ animations: 'disabled' }).catch(() => null)
  if (!shot) return -1
  return page.evaluate(async (b64) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode().catch(() => {})
    if (!img.width) return -1
    const s = document.createElement('canvas')
    s.width = 160; s.height = 160
    const c = s.getContext('2d', { willReadFrequently: true })
    if (!c) return -1
    c.drawImage(img, 0, 0, 160, 160)
    const d = c.getImageData(0, 0, 160, 160).data
    let br = 0, bg = 0, bb = 0
    for (const [x, y] of [[2, 2], [157, 2], [2, 157], [157, 157]]) {
      const i = (y * 160 + x) * 4
      br += d[i]; bg += d[i + 1]; bb += d[i + 2]
    }
    br /= 4; bg /= 4; bb /= 4
    let far = 0
    for (let i = 0; i < d.length; i += 4) {
      const dr = d[i] - br, dg = d[i + 1] - bg, db = d[i + 2] - bb
      if (dr * dr + dg * dg + db * db > 900) far++ // 30+ RGB from the backdrop
    }
    return +(100 * far / (160 * 160)).toFixed(2)
  }, shot.toString('base64'))
}

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: vp.w < 500 ? 2 : 1, reducedMotion: 'no-preference' })
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vp.name}] ${m.text()}`) })
  page.on('requestfailed', (r) => {
    const u = r.url()
    const thirdParty = !u.startsWith(URL) && !u.startsWith('/') && !/^https?:\/\/(localhost|127\.0\.0\.1|moldguard-web\.vercel\.app)/.test(u)
    const line = `[${vp.name}] ${u} ${r.failure()?.errorText}`
    // A request is only ignorable when Chromium aborted it during route cleanup.
    // Keep other aborts visible because a real asset failure can also surface as
    // ERR_ABORTED; the explicit blocked-GLB test below covers intentional failure.
    const routeCleanupAbort = navigationInFlight && r.failure()?.errorText === 'net::ERR_ABORTED' && /node_modules|fonts\.googleapis|moldguard\.glb/.test(u)
    if (routeCleanupAbort) return
    // A flaky font CDN is not a defect in this site, and letting it fail the suite
    // made a 170-check run look like a regression. Report it, do not gate on it.
    if (thirdParty) thirdPartyFailed.push(line)
    else failed.push(line)
  })

  await open(page, URL, 1200)
  await page.waitForTimeout(1200)

  // horizontal overflow
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth)
  record(`${vp.name}: no horizontal overflow`, scrollW <= vp.w + 1, `${scrollW} vs ${vp.w}`)

  // sections live on their own routes now
  for (const [route, ids] of Object.entries(ROUTE_SECTIONS)) {
    await open(page, URL.replace(/\/$/, '') + (route === '/' ? '/' : route), 500)
    for (const id of ids) {
      const box = await page.locator(`#${id}`).first().boundingBox().catch(() => null)
      record(`${route} #${id} rendered`, !!box && box.height > 40)
    }
    await open(page, URL, 700)
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
    // The scene mounts lazily on intersection + requestIdleCallback, so poll
    // instead of trusting one fixed wait (a 2.5s sleep flakes under load).
    let canvasBox = null
    for (let i = 0; i < 24; i++) {
      await page.waitForTimeout(250)
      canvasBox = await page.locator('[data-device-canvas] canvas').first().boundingBox().catch(() => null)
      if (canvasBox) break
    }
    record(`${vp.name}: canvas mounted`, !!canvasBox, canvasBox ? `${Math.round(canvasBox.width)}x${Math.round(canvasBox.height)}` : 'none')
    if (canvasBox) {
      let shot = await page.locator('[data-device-canvas]').first().screenshot({ path: `${OUT}/${vp.name}-canvas.png`, animations: 'disabled' }).catch(() => null)
      const ink = await page.evaluate(() => {
        const cv = document.querySelector('[data-device-canvas] canvas')
        if (!cv) return -1
        const gl = cv.getContext('webgl2') || cv.getContext('webgl')
        return gl ? 1 : 0
      })
      record(`${vp.name}: webgl context live`, ink === 1)
      // A live context is not proof of pixels: a scene that never draws (bad
      // camera, cleared buffer, unmounted mesh) still has one.
      // Poll the viewer's own loaded marker rather than a fixed sleep.
      let modelLoaded = false
      for (let i = 0; i < 24; i++) {
        modelLoaded = await page.evaluate(() =>
          document.querySelector('[data-device-canvas]')?.parentElement
          ?.getAttribute('data-model-loaded') === 'true')
        if (modelLoaded) break
        await page.waitForTimeout(250)
      }
      record(`${vp.name}: 3D model loaded`, modelLoaded)
      // Re-shoot AFTER the model is known to be loaded. The first shot above can
      // catch the canvas mid-stream, which made this check report "1 colour,
      // spread 0" on a perfectly rendered hero under CPU load.
      if (modelLoaded) {
        await page.waitForTimeout(600)
        shot = await page.locator('[data-device-canvas]').first()
          .screenshot({ path: `${OUT}/${vp.name}-canvas.png`, animations: 'disabled' })
          .catch(() => shot)
      }
      // Regression: useGLTF caches by URL, so before the per-viewer clone the
      // hero and Meet shared one Group; mounting Meet reparented it and the hero
      // canvas went blank while still reporting a live context and a nonzero
      // colour count (its CSS backdrop and overlays stayed). So this measures the
      // HERO stage after the explorer has mounted and we scroll back, counting
      // model pixels by distance from the stage backdrop rather than raw variance.
      if (vp.w >= 1024) {
        const before = await modelInk(page, '#top [data-device-canvas]')
        await page.evaluate(() => document.getElementById('meet')?.scrollIntoView())
        await page.waitForTimeout(2200)
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(1400)
        const after = await modelInk(page, '#top [data-device-canvas]')
        record(`${vp.name}: hero keeps its model after Meet mounts`,
          after >= 3 && after >= before * 0.6, `${before}% -> ${after}% model pixels`)
      }
      // Sample the COMPOSITED screenshot, not the live canvas: the renderer runs
      // with preserveDrawingBuffer:false, so an in-page drawImage() reads an
      // already-cleared buffer and reports a blank stage on a healthy render.
      // Downscaled to 64x64 in the page: ~4k pixel reads to tell a model from a void.
      const px = await page.evaluate(async (b64) => {
        const img = new Image()
        img.src = 'data:image/png;base64,' + b64
        await img.decode().catch(() => {})
        const s = document.createElement('canvas')
        s.width = 64; s.height = 64
        const c2 = s.getContext('2d', { willReadFrequently: true })
        if (!c2 || !img.width) return { colors: -1, spread: 0 }
        c2.drawImage(img, 0, 0, 64, 64)
        const d = c2.getImageData(0, 0, 64, 64).data
        const seen = new Set()
        let lo = 255, hi = 0
        for (let i = 0; i < d.length; i += 4) {
          const l = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000
          if (l < lo) lo = l
          if (l > hi) hi = l
          seen.add(((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3))
        }
        return { colors: seen.size, spread: Math.round(hi - lo) }
      }, shot.toString('base64'))
      // A blank/uniform stage scores 1 colour and ~0 spread; a real model on its
      // gradient ground clears this floor by an order of magnitude.
      record(`${vp.name}: canvas is not blank`, px.colors >= 8 && px.spread >= 12,
        `${px.colors} colours, spread ${px.spread}`)
    }
  }

  await ctx.close()
}

// ── interaction checks at desktop ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await open(page, URL, 700)

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
  await open(page, base + '/', 600)
  await page.evaluate(() => document.getElementById('meet').scrollIntoView())
  await page.waitForTimeout(900)
  // product explorer: selecting a component changes the info panel
  const title = () => page.locator('#meet h3').first().textContent()
  const t0 = await title()
  const relay = page.locator('#meet li button').filter({ hasText: 'Relay' }).first()
  await relay.waitFor({ state: 'visible' })
  await relay.scrollIntoViewIfNeeded()
  await relay.click()
  await page.waitForFunction((before) => document.querySelector('#meet h3')?.textContent !== before, t0)
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

  // /features — page 2 of the PDF: capabilities, comparison, closing
  await open(page, base + '/features', 700)
  await page.evaluate(() => document.getElementById('compare')?.scrollIntoView())
  record('compare: three rows', (await page.locator('#compare tbody tr').count()) === 3)
  record('compare: our row is marked', (await page.locator('#compare [class*="bg-[#2563eb"]').count()) >= 1)
  // This used to assert the OPPOSITE (no #features on /features), because the
  // route once duplicated the home grid wholesale. The duplication was the six
  // identical equal-weight claims; the fix is one dominant card + five support,
  // and a route called /features must contain the features. Guard the grid's
  // presence and its 6 headings instead of its absence.
  await page.evaluate(() => document.getElementById('features')?.scrollIntoView())
  record('features: grid present on /features', (await page.locator('#features').count()) === 1)
  record('features: six headings', (await page.locator('#features h3').count()) === 6)
  record('features: one dominant card', (await page.locator('#features article').count()) === 1)
  record('features: parts accordion has six rows', (await page.locator('#parts details').count()) === 6)
  record('features: hero caption banner present', await page.locator('#capabilities figcaption').first().textContent().then((t) => /cold stone/i.test(t)))

  // Four stage tabs share one visible detail panel. Check the interaction,
  // not the list-row markup of the previous static walkthrough.
  await open(page, base + '/how-it-works', 600)
  await page.evaluate(() => document.getElementById('how').scrollIntoView())
  await page.waitForTimeout(600)
  const stageTabs = page.locator('#how [role="tab"]')
  const stagePanels = page.locator('#how [role="tabpanel"]')
  record('how: loop has four stages', await stageTabs.count() === 4 && await stagePanels.count() === 4)
  for (const stage of ['sense', 'analyze', 'respond', 'protect']) {
    await page.locator(`[data-how-stage="${stage}"]`).click()
    await page.waitForFunction((name) =>
      document.querySelector(`[data-how-stage="${name}"]`)?.getAttribute('aria-selected') === 'true', stage)
    record(`how: ${stage} opens its detail`,
      await page.locator(`[data-how-panel="${stage}"]`).isVisible() &&
      await page.locator('#how [role="tabpanel"]:visible').count() === 1)
  }
  await stageTabs.first().focus()
  await page.keyboard.press('ArrowRight')
  await page.waitForFunction(() => document.querySelector('[data-how-stage="analyze"]')?.getAttribute('aria-selected') === 'true')
  await page.keyboard.press('End')
  await page.waitForFunction(() => document.querySelector('[data-how-stage="protect"]')?.getAttribute('aria-selected') === 'true')
  await page.keyboard.press('Home')
  await page.waitForFunction(() => document.querySelector('[data-how-stage="sense"]')?.getAttribute('aria-selected') === 'true')
  record('how: keyboard navigation returns to Sense', await stageTabs.first().evaluate((tab) => document.activeElement === tab))

  // /contact — real channels
  await open(page, base + '/contact', 600)
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

  // The approved Figma application frames must actually reach the page. They were
  // built, then dropped from /download, and only a QR code was left — so this is
  // the check that would have caught it.
  await open(page, base + '/download', 800)
  // The ticker duplicates the track for a seamless loop, so count the unique
  // screens rather than the DOM nodes.
  const caps = await page.locator('#app figcaption').allTextContents()
  const screens = new Set(caps.map((c) => c.split('·')[0].trim()))
  record('download: four Figma app frames render', screens.size === 4, `${screens.size} screens`)

  // keyboard: from a clean load, the first tab stop must be the skip link
  await open(page, URL, 700)
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
  await open(page, URL, 700)
  await page.waitForTimeout(800)
  const visible = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.reveal')]
    return els.length ? els.filter((e) => getComputedStyle(e).opacity === '1').length / els.length : 1
  })
  record('reduced-motion: content visible immediately', visible > 0.99, `${Math.round(visible * 100)}%`)
  await page.screenshot({ path: `${OUT}/reduced-motion.png` })
  await ctx.close()
}

// A failed 3D asset must never take the page down with it, AND must degrade to
// the fallback rather than a silent empty stage. Asserting only body length
// would pass a page that quietly lost its 3D section.
{
  const bp = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await bp.route('**/moldguard.glb', (r) => r.abort())
  await open(bp, URL, 2500)
  await bp.evaluate(() => document.getElementById('meet')?.scrollIntoView())
  await bp.waitForTimeout(3500)
  const survive = await bp.evaluate(() => (document.body.innerText || '').length)
  // The fallback explains itself rather than saying "3D unavailable": it names the
  // static view and points at the parts list beside it.
  const fallback = await bp.evaluate(() => /static view|cannot run the interactive 3d/i.test(document.body.innerText || ''))
  const hero = await bp.evaluate(() => !!document.querySelector('#top h1'))
  record('GLB blocked: page survives', survive > 800, `${survive} chars`)
  record('GLB blocked: shows the fallback', fallback)
  record('GLB blocked: hero still renders', hero)
  await bp.close()
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
if (thirdPartyFailed.length) {
  console.log(`\n  third-party requests that did not answer (${thirdPartyFailed.length}) — not gating:`)
  thirdPartyFailed.slice(0, 6).forEach((f) => console.log('   ', f))
}
if (failed.length) {
  console.log(`\n  failed requests (${failed.length}):`)
  failed.slice(0, 12).forEach((e) => console.log('   ', e))
}
process.exit(pass === results.length && errors.length === 0 && failed.length === 0 ? 0 : 1)
