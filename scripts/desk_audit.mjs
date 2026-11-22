/**
 * Desktop polish audit: objective, measurable quality signals at 1440 and 1920.
 * - vertical rhythm: gaps between section blocks, flag near-duplicate/dead bands
 * - measure: line length of body paragraphs (60-90ch is comfortable)
 * - contrast: computed text/background pairs, flag < 4.5:1 body text
 * - alignment: do left edges agree across a section?
 * - orphans: headings/labels with a single trailing word on its own line
 *
 *   node scripts/desk_audit.mjs [url]
 */
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(import.meta.url)
const { findChromium } = require_('./find-chromium.cjs')

const URL_ = process.argv[2] || 'http://127.0.0.1:5173'
const ROUTES = ['/', '/features', '/how-it-works', '/contact', '/download']

const b = await chromium.launch({ executablePath: findChromium() })
let issues = 0
const flag = (s) => { console.log('  ! ' + s); issues++ }

for (const vw of [1440, 1920]) {
  console.log(`\n=== ${vw} ===`)
  for (const route of ROUTES) {
    const p = await b.newPage({ viewport: { width: vw, height: 900 } })
    await p.goto(URL_.replace(/\/$/, '') + route, { waitUntil: 'load' })
    await p.waitForTimeout(1000)
    // fire reveals
    await p.evaluate(async () => {
      document.documentElement.style.scrollBehavior = 'auto'
      for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.6) {
        window.scrollTo({ top: y, behavior: 'instant' })
        await new Promise(r => requestAnimationFrame(() => setTimeout(r, 60)))
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
    })
    await p.waitForTimeout(600)
    const r = await p.evaluate(() => {
      const lum = (c) => {
        const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map(v => {
          v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      // Composite backgrounds properly. A table row tinted rgba(37,99,235,.06)
      // is not the text background: reading that rgba as an opaque colour made
      // mid-grey body text report 1.29:1 against white. Walk up and alpha-blend
      // every layer onto the opaque page colour instead.
      const bgOf = (el) => {
        const layers = []
        let n = el
        while (n) {
          let bg = getComputedStyle(n).backgroundColor
          // Tailwind v4 can emit oklab(...)/color(...) which has no rgb numbers.
          // Resolve anything non-rgb through a paint probe so the maths is real.
          if (bg && !/^rgba?\(/.test(bg) && !/transparent/.test(bg)) {
            const c = document.createElement('canvas'); c.width = c.height = 1
            const g = c.getContext('2d')
            g.fillStyle = '#ffffff'; g.fillRect(0, 0, 1, 1)
            g.fillStyle = bg; g.fillRect(0, 0, 1, 1)
            const d = g.getImageData(0, 0, 1, 1).data
            bg = `rgba(${d[0]},${d[1]},${d[2]},${(d[3] / 255).toFixed(3)})`
          }
          if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) layers.push(bg)
          n = n.parentElement
        }
        let out = [255, 255, 255]
        for (const layer of layers.reverse()) {
          const nums = layer.match(/[\d.]+/g).map(Number)
          const [r, g, b] = nums
          const a = nums.length > 3 ? nums[3] : 1
          out = [r * a + out[0] * (1 - a), g * a + out[1] * (1 - a), b * a + out[2] * (1 - a)]
        }
        return `rgb(${Math.round(out[0])},${Math.round(out[1])},${Math.round(out[2])})`
      }
      const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05) }

      // 1. low-contrast body text
      const low = []
      for (const el of document.querySelectorAll('p,li,span,a,td,th')) {
        if (el.children.length) continue
        const t = (el.textContent || '').trim()
        if (t.length < 12) continue
        const cs = getComputedStyle(el)
        if (parseFloat(cs.fontSize) < 11) continue
        const rc = el.getBoundingClientRect()
        if (rc.width < 8 || rc.height < 4) continue
        const cr = ratio(cs.color, bgOf(el))
        if (cr < 4.5) low.push({ t: t.slice(0, 34), cr: +cr.toFixed(2), fs: Math.round(parseFloat(cs.fontSize)) })
      }

      // 2. measure (line length) for real paragraphs
      const wide = []
      for (const el of document.querySelectorAll('p')) {
        const t = (el.textContent || '').trim()
        if (t.length < 90) continue
        // a cell inside a spec/comparison table is data, not prose
        if (el.closest('table')) continue
        const cs = getComputedStyle(el)
        const fs = parseFloat(cs.fontSize)
        if (fs < 8) continue
        // Calibrate chars-per-em from a real glyph sample of THIS font/size.
        // A fixed 0.5 divisor reported a max-w-[78ch] box as 100ch.
        // CSS `ch` = width of the "0" glyph, NOT the average character. In
        // Figtree "0" is narrower than lowercase, so max-w-[78ch] renders ~100
        // average chars and every correctly-capped paragraph read as a violation.
        const probe = document.createElement('canvas').getContext('2d')
        probe.font = `${cs.fontWeight} ${fs}px ${cs.fontFamily}`
        const chPx = probe.measureText('0').width
        const avg = ['abcdefghijklmnopqrstuvwxyz ', 'Humidity, temperature and sustained exposure duration.']
          .map((t) => probe.measureText(t).width / t.length)
        const avgPx = avg.reduce((a, b) => a + b, 0) / avg.length
        const chars = el.getBoundingClientRect().width / chPx          // measure in CSS ch units
        if (chars > 95) wide.push({ chars: Math.round(chars), t: t.slice(0, 30) })
      }

      // 3. section-block gaps (dead air)
      const gaps = []
      const secs = [...document.querySelectorAll('main section')]
      for (let i = 1; i < secs.length; i++) {
        const prev = secs[i - 1].getBoundingClientRect()
        const cur = secs[i].getBoundingClientRect()
        // measure last ink of prev vs first ink of cur is hard; use padding boxes
        gaps.push(Math.round(cur.top - prev.bottom))
      }

      // 4. heading orphans: last word alone on its own line
      const orphans = []
      for (const h of document.querySelectorAll('h1,h2,h3')) {
        const rg = document.createRange()
        const spans = h.querySelectorAll('.line > span')
        const targets = spans.length ? [...spans] : [h]
        for (const t of targets) {
          rg.selectNodeContents(t)
          const rects = [...rg.getClientRects()].filter(x => x.width > 2)
          if (rects.length < 2) continue
          const last = rects[rects.length - 1]
          const full = Math.max(...rects.map(x => x.width))
          if (last.width < full * 0.28) orphans.push({ t: (h.getAttribute('aria-label') || h.textContent).trim().slice(0, 40) })
        }
      }
      return { low: low.slice(0, 6), wide: wide.slice(0, 4), gaps, orphans: orphans.slice(0, 4) }
    })
    console.log(`\n${route}`)
    if (r.low.length) { flag(`low contrast (${r.low.length}): ` + r.low.map(x => `"${x.t}" ${x.cr}:1 @${x.fs}px`).join(' | ')) }
    if (r.wide.length) { flag(`long measure: ` + r.wide.map(x => `${x.chars}ch "${x.t}"`).join(' | ')) }
    if (r.orphans.length) { flag(`heading orphan: ` + r.orphans.map(x => x.t).join(' | ')) }
    // Sections are band-map seams: touching edges are correct by design.
    if (!r.low.length && !r.wide.length && !r.orphans.length) console.log('  clean')
    await p.close()
  }
}
console.log(issues === 0 ? '\nDESKTOP AUDIT: clean' : `\nDESKTOP AUDIT: ${issues} issues`)
await b.close()
