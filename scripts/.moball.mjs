import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium() })
let bad = 0
for (const route of ['/', '/features', '/how-it-works', '/contact', '/download']) {
  for (const vw of [320, 360, 390, 430, 768, 1024, 1440, 1920]) {
    const p = await b.newPage({ viewport: { width: vw, height: 800 } })
    await p.goto('http://127.0.0.1:5173' + route, { waitUntil: 'load' })
    await p.waitForTimeout(500)
    const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    if (over > 1) { console.log(`OVERFLOW ${route} @${vw}: +${over}px`); bad++ }
    await p.close()
  }
}
console.log(bad === 0 ? 'responsive: no overflow at any route/viewport' : `${bad} overflow cases`)
await b.close()
process.exit(bad ? 1 : 0)
