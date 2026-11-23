/** App screen ticker: continuous marquee drift, pause/resume, reduced-motion off.
 *  node scripts/carousel_check.mjs [baseUrl]
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')
const base = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const SEL = 'ul[aria-label="MoldGuard app screens ticker"]'
const browser = await chromium.launch({ executablePath: findChromium() })
const tx = (page) => page.evaluate((sel) => {
  const ul = document.querySelector(sel)
  return Math.round(new DOMMatrix(getComputedStyle(ul).transform).m41)
}, SEL)
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
  await page.goto(base + '/download', { waitUntil: 'load' })
  await page.locator('#app').scrollIntoViewIfNeeded()
  await page.waitForTimeout(900)

  assert.equal(await page.locator(`${SEL} > li`).count(), 8, 'track holds the four screens twice')
  assert.equal(await page.evaluate((s) => getComputedStyle(document.querySelector(s)).animationName, SEL), 'app-marquee')

  // Continuous, linear drift (not a slide jumping every few seconds).
  const a = await tx(page)
  await page.waitForTimeout(1200)
  const b = await tx(page)
  await page.waitForTimeout(1200)
  const c = await tx(page)
  assert.ok(b < a && c < b, `track should keep drifting (${a} -> ${b} -> ${c})`)
  assert.ok(Math.abs((b - a) - (c - b)) <= 3, 'drift speed is steady')

  // Pause control stops it; resume restarts it.
  await page.getByRole('button', { name: /Pause the app screen ticker/i }).click()
  await page.waitForTimeout(300)
  const p1 = await tx(page)
  await page.waitForTimeout(1200)
  assert.equal(await tx(page), p1, 'pause stops the ticker')
  await page.getByRole('button', { name: /Resume the app screen ticker/i }).click()
  await page.waitForTimeout(1000)
  assert.notEqual(await tx(page), p1, 'resume restarts the ticker')

  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  await page.close()

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await reduced.goto(base + '/download', { waitUntil: 'load' })
  await reduced.locator('#app').scrollIntoViewIfNeeded()
  await reduced.waitForTimeout(700)
  assert.equal(await reduced.evaluate((s) => getComputedStyle(document.querySelector(s)).animationName, SEL), 'none', 'reduced motion disables the ticker')
  assert.equal(await reduced.getByRole('button', { name: /app screen ticker/i }).isDisabled(), true)
  assert.equal(await reduced.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
  console.log('TICKER: PASS. continuous drift, steady speed, pause/resume, reduced motion off.')
} finally { await browser.close() }
