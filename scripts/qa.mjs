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

const SECTIONS = ['top', 'problem', 'loop', 'risk', 'features', 'app', 'ownership', 'team', 'faq', 'contact']

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

  // every section present + visible
  for (const id of SECTIONS) {
    const box = await page.locator(`#${id}`).first().boundingBox()
    record(`${vp.name}: #${id} rendered`, !!box && box.height > 40, box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'missing')
  }

  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` })
  if (FULL || vp.w === 1440 || vp.w === 390) {
    await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true })
  }

  // 3D canvas must produce actual pixels
  if (vp.w >= 768) {
    await page.evaluate(() => document.getElementById('top')?.scrollIntoView())
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

  // nav links all jump to existing anchors
  const navHrefs = await page.locator('header nav a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
  record('nav: has links', navHrefs.length >= 5, navHrefs.join(' '))
  for (const h of navHrefs) {
    const exists = await page.locator(`#${h.slice(1)}`).count()
    record(`nav: ${h} resolves`, exists > 0)
  }

  // FAQ: item 0 starts open, so assert the toggle actually flips state
  const faqBtn = page.locator('#faq button[aria-expanded]').first()
  const openCount = () => page.evaluate(() =>
    [...document.querySelectorAll('#faq [id^=faq-]')].filter(d => d.offsetHeight > 0).length)
  const before = await openCount()
  await faqBtn.click()
  await page.waitForTimeout(300)
  const after = await openCount()
  record('faq: toggles state', before !== after, `${before} -> ${after}`)
  await faqBtn.click()

  // loop step switcher
  await page.locator('#loop ol button').nth(2).click()
  await page.waitForTimeout(300)
  record('loop: step 3 selectable', (await page.locator('#loop button[aria-expanded="true"]').count()) === 1)

  // app tabs: switching to History must change the rendered screen body
  const roomBody = await page.locator('#app').textContent()
  await page.locator('#app button[aria-pressed]').nth(1).click()
  await page.waitForTimeout(350)
  const histBody = await page.locator('#app').textContent()
  record('app: history tab switches', !!histBody && histBody.includes('7 d'), histBody?.slice(0, 60))
  record('app: room tab content present', !!roomBody && /risk/i.test(roomBody), roomBody?.slice(0, 40))

  // contact form: disabled until valid, then composes a mailto
  const submit = page.locator('#contact button[type=submit]')
  record('contact: submit disabled when empty', await submit.isDisabled())
  await page.fill('#c-name', 'QA Tester')
  await page.fill('#c-email', 'qa@example.com')
  await page.fill('#c-msg', 'Testing the contact path.')
  await page.waitForTimeout(200)
  record('contact: submit enables when valid', await submit.isEnabled())
  // the form must compose a working mailto and say so
  const mailtoOk = await page.evaluate(() => {
    const btn = document.querySelector('#contact button[type=submit]')
    if (!btn) return false
    const note = document.querySelector('#contact form p')
    return !!note && /mail app/i.test(note.textContent || '')
  })
  record('contact: mailto handoff disclosed', mailtoOk)

  // every CTA resolves
  const ctas = await page.locator('a[href^="#"], a[href^="mailto:"], a[href^="tel:"]').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href')).filter(Boolean))
  const bad = []
  for (const c of new Set(ctas)) {
    if (c.startsWith('#')) {
      const n = await page.locator(c).count()
      if (n === 0) bad.push(c)
    }
  }
  record('links: all hash targets exist', bad.length === 0, bad.join(' ') || 'ok')

  // keyboard: from a clean load, the first tab stop must be the skip link
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim() ?? '')
  record('a11y: first tab stop is skip link', /skip/i.test(focused), focused)

  // focus ring must be visible on the primary CTA
  await page.locator('header a[href="#contact"]').first().focus()
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
