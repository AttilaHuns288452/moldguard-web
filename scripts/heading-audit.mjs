import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium() })
for (const path of ['/', '/features', '/how-it-works', '/contact', '/download']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto('http://127.0.0.1:5173' + path, { waitUntil: 'load' })
  await p.waitForTimeout(900)
  const h = await p.evaluate(() => ({
    h1: [...document.querySelectorAll('h1')].map((e) => e.getAttribute('aria-label') || e.textContent.trim().slice(0, 60)),
    h2: [...document.querySelectorAll('h2')].map((e) => (e.getAttribute('aria-label') || e.textContent.trim()).slice(0, 60)),
  }))
  const dupes = h.h2.filter((x, i) => h.h2.indexOf(x) !== i)
  console.log(path, 'h1=' + h.h1.length, 'h2=' + h.h2.length, dupes.length ? 'DUPE: ' + [...new Set(dupes)].join(' | ') : 'no dupes')
  if (h.h1.length !== 1) console.log('   !! h1 count', h.h1)
  await ctx.close()
}
await b.close()
