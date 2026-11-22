/** Verify the enlarged QR and all supplied team profiles. node scripts/team_download_check.mjs [baseUrl] */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')
const base = (process.argv[2] || 'http://127.0.0.1:5173').replace(/\/$/, '')
const out = process.env.TEAM_QA_DIR || '.qa/team-download'
await mkdir(out, { recursive: true })
const expected = [
  ['louie-banting', 'Louie Jein D. Banting', 'Louie'],
  ['jeremy-cabuntas', 'Jeremy V. Cabuntas', 'Jeremy'],
  ['maron-fajardo', 'Maron E. Fajardo', 'Maron'],
  ['akira-fernandez', 'Mcraven Akira S. Fernandez', 'Akira'],
  ['bernadette-lalata', 'Bernadette B. Lalata', 'Bernadette'],
  ['michael-litang', 'Michael T. Litang', 'Michael'],
  ['jessica-palma', 'Jessica Mae T. Palma', 'Jessica'],
  ['attila-sabiniano', 'Attila P. Sabiniano', 'Attila'],
]
const results = []
const browser = await chromium.launch({ executablePath: findChromium(), args: [
  '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
] })
try {
  for (const width of [1440, 1920, 390, 320]) {
    const page = await browser.newPage({ viewport: { width, height: width > 1000 ? 950 : 844 } })
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`${base}/download`, { waitUntil: 'load' })
    const qr = page.locator('img[alt="QR code that opens the MoldGuard download page"]')
    await qr.waitFor({ state: 'visible' })
    await page.waitForTimeout(700)
    const layout = await qr.evaluate((image) => {
      const card = image.closest('.rounded-shell')
      const grid = card.closest('.grid')
      const box = image.getBoundingClientRect()
      return { width: box.width, height: box.height, cardWidth: card.getBoundingClientRect().width,
        gridWidth: grid.getBoundingClientRect().width, gap: parseFloat(getComputedStyle(grid).columnGap),
        overflow: document.documentElement.scrollWidth > innerWidth }
    })
    assert.ok(Math.abs(layout.width - layout.height) < 1, 'QR stays square')
    assert.ok(layout.width >= (width >= 390 ? 248 : 210), 'QR is visibly enlarged')
    assert.equal(layout.overflow, false)
    if (width >= 1024) {
      assert.ok(layout.cardWidth >= 455, 'larger QR card')
      assert.ok(layout.gap <= 32, 'QR card closer to copy')
      assert.ok(layout.gridWidth <= 1181, 'wide screens do not separate QR from copy')
    }
    if (width !== 1920) await page.screenshot({ path: `${out}/download-${width}.png` })

    await page.goto(`${base}/contact`, { waitUntil: 'load' })
    const cards = page.locator('[data-team-member]')
    assert.equal(await cards.count(), 8)
    await cards.first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(650)
    if (width >= 1024) {
      await page.mouse.move(0, 0)
      await cards.first().hover()
      await page.waitForTimeout(250)
      const hover = await cards.first().evaluate((el) => ({
        transform: getComputedStyle(el).transform,
        duration: parseFloat(getComputedStyle(el).transitionDuration),
        photo: getComputedStyle(el.querySelector('img')).transform,
      }))
      assert.notEqual(hover.transform, 'none', 'card lifts on hover')
      assert.ok(hover.duration > 0, 'hover is animated')
      assert.notEqual(hover.photo, 'none', 'portrait hover motion')
    }
    for (const [index, [id, name, firstName]] of expected.entries()) {
      const trigger = page.locator(`[data-team-member="${id}"]`)
      const thumbnail = trigger.locator('img')
      await thumbnail.evaluate(async (image) => { await image.decode() })
      assert.ok(await thumbnail.evaluate((image) => image.naturalWidth >= 300))
      await trigger.click()
      const dialog = page.getByRole('dialog', { name, exact: true })
      await dialog.waitFor({ state: 'visible' })
      assert.equal(await dialog.evaluate((el) => el.matches(':modal')), true)
      assert.match(await dialog.locator('#team-profile-bio').innerText(), new RegExp(`Hello, I'm ${firstName}\\.`))
      assert.equal(await dialog.locator('dt').allTextContents().then((x) => x.join('|')), 'Position|Work area')
      assert.ok((await dialog.locator('dd').allTextContents()).every((text) => text.trim().length > 0))
      const image = dialog.locator('img')
      await image.evaluate(async (img) => { await img.decode() })
      assert.equal(await image.getAttribute('src'), `/team/${id}.webp`)
      assert.ok(await image.evaluate((img) => img.naturalWidth >= 300))
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden')
      for (let n = 0; n < 3; n++) {
        await page.keyboard.press('Tab')
        assert.ok(await dialog.evaluate((el) => el.contains(document.activeElement)), 'focus stays inside modal')
      }
      const bounds = await dialog.boundingBox()
      assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1, 'dialog fits viewport')
      assert.equal(await dialog.evaluate((el) => el.scrollWidth > el.clientWidth), false, 'no modal horizontal overflow')
      if (id === 'attila-sabiniano' && width !== 1920) {
        await page.screenshot({ path: `${out}/profile-${width}.png` })
      }
      // Exercise all three native close paths, plus keyboard opening.
      if (index === 0) await dialog.getByRole('button', { name: /Close/ }).click()
      else if (index === 1) await page.mouse.click(2, 2)
      else await page.keyboard.press('Escape')
      await dialog.waitFor({ state: 'hidden' })
      await page.waitForTimeout(50)
      assert.equal(await trigger.evaluate((el) => document.activeElement === el), true, 'focus returns to profile trigger')
      assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden')
      results.push({ width, id, status: 'pass' })
      await writeFile(`${out}/results.json`, JSON.stringify(results, null, 2))
    }
    await cards.first().focus()
    await page.keyboard.press('Enter')
    await page.getByRole('dialog').waitFor({ state: 'visible' })
    await page.keyboard.press('Escape')
    await page.getByRole('dialog').waitFor({ state: 'hidden' })
    await cards.first().scrollIntoViewIfNeeded()
    await page.mouse.move(0, 0)
    await page.screenshot({ path: `${out}/team-${width}.png` })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') })
    const violations = await page.evaluate(async () => (await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })).violations.map((v) => ({ id: v.id, nodes: v.nodes.length })))
    assert.deepEqual(violations, [], 'contact page accessibility')
    await cards.last().click()
    const dialogViolations = await page.evaluate(async () => (await axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })).violations.map((v) => ({ id: v.id, nodes: v.nodes.length })))
    assert.deepEqual(dialogViolations, [], 'profile dialog accessibility')
    await page.keyboard.press('Escape')
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await cards.first().hover()
    assert.equal(await cards.first().evaluate((el) => getComputedStyle(el).transform), 'none', 'reduced motion disables hover transforms')
    assert.deepEqual(errors, [], 'no page errors')
    console.log(`PASS ${width}px: QR layout, 8 portraits/profiles, close/focus/keyboard, reduced motion, axe`)
    await page.close()
  }
  assert.equal(results.length, expected.length * 4)
  console.log('TEAM + DOWNLOAD: PASS. 32 profile journeys, 4 viewports.')
} finally { await browser.close() }
