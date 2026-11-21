import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium() })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'load' })
await p.waitForTimeout(1500)
const m = await p.evaluate(() => {
  const g = (sel) => { const e = document.querySelector(sel); if (!e) return null
    const cs = getComputedStyle(e); return { fs: parseFloat(cs.fontSize), lh: parseFloat(cs.lineHeight), fw: cs.fontWeight, ls: cs.letterSpacing, ff: cs.fontFamily.split(',')[0].replace(/["']/g,'') } }
  const h1 = document.querySelector('h1')
  const h2 = document.querySelector('#problem h2, #meet h2, section h2')
  const body = document.querySelector('p.lede') || document.querySelector('p')
  const w = 1440
  const hero = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0
  const s2 = h2 ? parseFloat(getComputedStyle(h2).fontSize) : 0
  const bd = body ? parseFloat(getComputedStyle(body).fontSize) : 0
  return {
    h1: { ...g('h1'), pxAt1440: hero, pct: +(100*hero/w).toFixed(2) },
    h2: { ...g('h1, h2'), pxAt1440: s2, pct: +(100*s2/w).toFixed(2) },
    body: { ...g('p.lede'), pxAt1440: bd, pct: +(100*bd/w).toFixed(2) },
    bodyBase: getComputedStyle(document.body).fontSize,
    shell: (() => { const e=document.querySelector('.shell'); const cs=getComputedStyle(e); return { pl: cs.paddingLeft, width: e.getBoundingClientRect().width } })(),
  }
})
console.log(JSON.stringify(m, null, 1))
await b.close()
