/** Verify the 3D model renders real pixels on both stages, after any change.
 *  A live WebGL context is NOT proof of a model — count pixels that differ from
 *  the stage backdrop, same idea as qa.mjs but standalone and quick.
 *  usage: node scripts/model_check.mjs [url]
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const URL_ = process.argv[2] || 'http://127.0.0.1:5173/'
const b = await chromium.launch({
  executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

async function ink(page, sel) {
  const shot = await page.locator(sel).first().screenshot({ animations: 'disabled' })
  return page.evaluate(async (b64) => {
    const img = new Image()
    img.src = 'data:image/png;base64,' + b64
    await img.decode().catch(() => {})
    const c = document.createElement('canvas')
    c.width = 160; c.height = 160
    const g = c.getContext('2d', { willReadFrequently: true })
    if (!g || !img.width) return -1
    g.drawImage(img, 0, 0, 160, 160)
    const d = g.getImageData(0, 0, 160, 160).data
    // backdrop = average of the four corners; count pixels far from it
    let br = 0, bg = 0, bb = 0
    for (const [x, y] of [[2, 2], [157, 2], [2, 157], [157, 157]]) {
      const i = (y * 160 + x) * 4; br += d[i]; bg += d[i + 1]; bb += d[i + 2]
    }
    br /= 4; bg /= 4; bb /= 4
    let far = 0
    for (let i = 0; i < d.length; i += 4) {
      const dr = d[i] - br, dg = d[i + 1] - bg, db = d[i + 2] - bb
      if (dr * dr + dg * dg + db * db > 900) far++
    }
    return +(100 * far / (160 * 160)).toFixed(2)
  }, shot.toString('base64'))
}

const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(URL_, { waitUntil: 'load' })
await p.waitForTimeout(4000)
let hero = -1
if (await p.locator('#top [data-device-canvas]').count()) hero = await ink(p, '#top [data-device-canvas]')

await p.evaluate(() => document.getElementById('meet')?.scrollIntoView())
for (let i = 0; i < 24 && !(await p.locator('#meet [data-device-canvas] canvas').count()); i++) await p.waitForTimeout(250)
await p.waitForTimeout(2500)
let meet = -1
if (await p.locator('#meet [data-device-canvas]').count()) meet = await ink(p, '#meet [data-device-canvas]')

// hero must still have its model after Meet mounts (the per-viewer clone guard)
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(1500)
const heroAfter = await ink(p, '#top [data-device-canvas]')

console.log(`hero ink ${hero}%   meet ink ${meet}%   hero after meet ${heroAfter}%`)
const ok = hero >= 3 && meet >= 3 && heroAfter >= 3 && heroAfter >= hero * 0.6
console.log(ok ? 'MODEL: PASS' : 'MODEL: FAIL')
await b.close()
process.exit(ok ? 0 : 1)
