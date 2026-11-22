import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium() })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'load' })
await p.waitForTimeout(900)
const r = await p.evaluate(() => {
  const counts = {}
  for (const e of document.querySelectorAll('*')) {
    const sh = getComputedStyle(e).boxShadow
    if (sh && sh !== 'none') counts[sh] = (counts[sh] || 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => ({ n: v, s: k.slice(0, 66) }))
})
console.log(JSON.stringify(r, null, 1))
await b.close()
