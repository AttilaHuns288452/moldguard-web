/** Commercial funnel regression: source-backed offer, real inquiry path, preserved UI.
 * node scripts/sales_check.mjs [baseUrl]
 * All form submissions are intercepted. No real enquiry or payment is sent.
 */
import assert from 'node:assert/strict'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')
const base = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const out = process.env.SALES_QA_DIR || '.qa/sales'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ executablePath: findChromium(), args: [
  '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
] })
const evidence = []
try {
  for (const width of [1440, 1920, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width > 1000 ? 950 : 844 }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto(base + '/', { waitUntil: 'load' })
    await page.waitForTimeout(700)
    const hero = page.locator('#top')
    assert.equal(await hero.locator('h1').count(), 1)
    assert.match(await hero.innerText(), /MoldGuard/)
    assert.match(await hero.innerText(), /9,994/)
    assert.match(await hero.innerText(), /proposed/i)
    assert.match(await hero.innerText(), /one.time/i)
    const quote = hero.getByRole('link', { name: /request.*quot/i }).first()
    assert.equal(await quote.getAttribute('href'), '/contact')
    assert.match(await page.locator('#problem').innerText(), /damp|condens|cupboard|room/i)
    const ownership = await page.locator('#ownership').innerText()
    assert.match(ownership, /9,994/)
    assert.match(ownership, /proposed/i)
    assert.match(ownership, /no subscription|no monthly/i)
    assert.doesNotMatch(ownership, /4,363|development fee|component budget/i)
    assert.match(ownership, /app/i)
    assert.match(ownership, /room/i)
    assert.match(ownership, /availability|quotation|confirm/i)
    const body = await page.locator('main').innerText()
    assert.doesNotMatch(body, /optional premium tier|premium subscription|never have to think about mold again/i)
    assert.equal(await page.locator('#faq').count(), 1, 'home answers purchase objections')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.screenshot({ path: `${out}/home-${width}.png` })
    await page.locator('#ownership').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `${out}/offer-${width}.png` })
    await quote.click()
    await page.waitForURL('**/contact')
    assert.match(await page.locator('h1').innerText(), /quot|room/i)
    const form = page.locator('#contact-form')
    // waitForURL fires before React renders the route; wait for the form itself.
    await form.waitFor({ state: 'attached', timeout: 20000 })
    assert.equal(await form.count(), 1)
    assert.equal(await form.locator('button[type="submit"]').isDisabled(), true)
    const nameBox = await form.boundingBox()
    const directBox = await page.locator('#contact a[href^="tel:"]').first().boundingBox()
    if (width < 1024) assert.ok(nameBox.y < directBox.y, 'inquiry form precedes direct-contact aside on mobile')
    await form.locator('#c-name').fill('Website verification')
    await form.locator('#c-email').fill('visitor@example.com')
    await form.locator('#c-phone').fill('09920000000')
    await form.locator('#c-role').selectOption('Renter')
    await form.locator('#c-about').fill('Bedroom with recurring window condensation. Please confirm room suitability and the proposed one-time price.')
    let submitted = null
    await page.route('https://docs.google.com/forms/**/formResponse', async (route) => {
      submitted = Object.fromEntries(new URLSearchParams(route.request().postData() || ''))
      await route.fulfill({ status: 200, contentType: 'text/plain', body: 'intercepted by automated verification' })
    })
    await form.locator('button[type="submit"]').click()
    await page.getByRole('status').waitFor({ state: 'visible' })
    assert.ok(submitted, 'inquiry still reaches the configured form transport')
    assert.equal(submitted['entry.273512640'], 'Website verification')
    assert.equal(submitted.emailAddress, 'visitor@example.com')
    assert.match(submitted['entry.1184808363'], /Renter/)
    assert.match(submitted['entry.1184808363'], /condensation/)
    const success = await page.getByRole('status').innerText()
    assert.match(success, /request|message|quot/i)
    assert.doesNotMatch(success, /order confirmed|payment received|purchase complete/i)
    await page.goto(base + '/how-it-works', { waitUntil: 'load' })
    assert.equal(await page.locator('#how [role="tab"]').count(), 4)
    const faqs = page.locator('#faq li')
    assert.equal(await faqs.count(), 12)
    const priceQuestion = page.getByRole('button', { name: 'How much does it cost?', exact: true })
    await priceQuestion.click()
    assert.match(await page.locator('#faq').innerText(), /9,994/)
    const schema = await page.evaluate(() => JSON.parse(document.querySelector('#faq-schema').textContent))
    const priceAnswer = schema.mainEntity.find((x) => x.name === 'How much does it cost?').acceptedAnswer.text
    assert.match(priceAnswer, /₱9,994/)
    assert.ok(!priceAnswer.includes('\\u20b1'), 'schema contains decoded currency, not a literal escape')
    await page.goto(base + '/download', { waitUntil: 'load' })
    assert.equal(await page.locator('#app .mg').count(), 4, 'all original app screens remain')
    assert.equal(await page.locator('#app img[alt*="QR"]').count(), 1)
    assert.equal(await page.getByRole('button', { name: 'Next app screen', exact: true }).count(), 1)
    assert.match(await page.locator('#app').innerText(), /companion|hardware|device/i)
    assert.deepEqual(errors, [])
    evidence.push({ width, status: 'pass', inquiryIntercepted: true })
    await writeFile(`${out}/results.json`, JSON.stringify(evidence, null, 2))
    console.log(`PASS ${width}px: product pitch, proposed price, quote funnel, intercepted form, objections/schema, preserved app carousel`)
    await page.close()
  }
  console.log('SALES: PASS. 4 viewports; no real enquiries submitted.')
} finally { await browser.close() }
