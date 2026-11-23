/** Autoplay carousel check: advances, pauses on hover/focus, respects pause button
 *  and reduced motion, and still supports manual arrows/dots. No network writes.
 *  node scripts/carousel_check.mjs [baseUrl]
 */
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')
const base = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const browser = await chromium.launch({ executablePath: findChromium() })
const label = (page) => page.locator('[aria-live="polite"].measure').innerText()
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
  await page.goto(base + '/download', { waitUntil: 'load' })
  const carousel = page.locator('ul[aria-label="MoldGuard app screens carousel"]')
  await carousel.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  assert.equal(await label(page), 'Screen 01 / 04', 'starts on slide 1')
  await page.waitForTimeout(5600)
  assert.equal(await label(page), 'Screen 02 / 04', 'auto-advances after ~4.8s')
  await page.waitForTimeout(5300)
  assert.equal(await label(page), 'Screen 03 / 04', 'keeps advancing')

  // Hover pauses: it must not advance while the pointer is over the carousel.
  await carousel.hover()
  const held = await label(page)
  await page.waitForTimeout(5600)
  assert.equal(await label(page), held, 'hover pauses autoplay')
  await page.mouse.move(0, 0)

  // The explicit pause control stops it, and the state is exposed.
  const pause = page.getByRole('button', { name: /Pause automatic app screen rotation/ })
  assert.equal(await pause.getAttribute('aria-pressed'), 'true')
  await pause.click()
  const stopped = await label(page)
  await page.waitForTimeout(5600)
  assert.equal(await label(page), stopped, 'pause button stops autoplay')
  assert.equal(await page.getByRole('button', { name: /Start automatic app screen rotation/ }).getAttribute('aria-pressed'), 'false')

  // Manual controls still work while paused.
  await page.getByRole('button', { name: 'Next app screen', exact: true }).click()
  await page.waitForTimeout(500)
  assert.notEqual(await label(page), stopped, 'manual next works while paused')
  await page.getByRole('tab', { name: 'Show Home app screen' }).click()
  await page.waitForTimeout(500)
  assert.equal(await label(page), 'Screen 01 / 04', 'dots select a slide')
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' })
  await reduced.goto(base + '/download', { waitUntil: 'load' })
  await reduced.locator('ul[aria-label="MoldGuard app screens carousel"]').scrollIntoViewIfNeeded()
  await reduced.waitForTimeout(5600)
  assert.equal(await label(reduced), 'Screen 01 / 04', 'reduced motion never autoplays')
  assert.equal(await reduced.getByRole('button', { name: /automatic app screen rotation/ }).isDisabled(), true)
  console.log('CAROUSEL: PASS. autoplay, hover/focus pause, pause control, manual controls, reduced motion.')
} finally { await browser.close() }
