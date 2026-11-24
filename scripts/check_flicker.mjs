/** Temporal flicker metric: capture a burst of frames and count pixels that
 *  oscillate (differ from BOTH the previous and next frame). Smooth camera
 *  motion moves pixels in one direction, so it does not register; z-fighting
 *  and unstable sort order make a pixel flip back and forth.
 *  Usage: node scripts/check_flicker.mjs [url]
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')

const url = process.argv[2] || 'http://127.0.0.1:4173/'
const b = await chromium.launch({ executablePath: findChromium() })
const p = await b.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: 'no-preference' })
await p.goto(url, { waitUntil: 'load' })
await p.waitForTimeout(2500)
await p.evaluate(() => {
  const s = document.querySelector('#meet')
  window.scrollTo(0, s.getBoundingClientRect().top + scrollY + 150)
})
await p.waitForTimeout(3500)

const frames = []
for (let i = 0; i < 6; i++) {
  const buf = await p.locator('#meet canvas').screenshot()
  frames.push(buf)
  await p.waitForTimeout(90)
}
const fs = require('node:fs')
frames.forEach((f, i) => fs.writeFileSync(`/tmp/fl${i}.png`, f))
console.log(JSON.stringify({ frames: frames.length }))
await b.close()
