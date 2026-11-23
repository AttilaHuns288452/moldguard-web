/**
 * Pixel-level proof that the two visual states really differ on screen.
 * Screenshots are taken through Playwright, then diffed INSIDE chromium by
 * drawing both PNGs to a canvas and counting changed pixels — no extra deps.
 * Prints changed-pixel counts and writes .qa/motion/pixel-report.json.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const { findChromium } = require('./find-chromium.cjs')

const BASE = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const DIR = '.qa/motion'

const diff = async (page, a, b, label) => {
  const A = fs.readFileSync(a).toString('base64')
  const B = fs.readFileSync(b).toString('base64')
  const r = await page.evaluate(async ([A, B]) => {
    const load = (src) => new Promise((res) => {
      const i = new Image()
      i.onload = () => res(i)
      i.src = 'data:image/png;base64,' + src
    })
    const [ia, ib] = await Promise.all([load(A), load(B)])
    const w = Math.min(ia.width, ib.width)
    const h = Math.min(ia.height, ib.height)
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(ia, 0, 0)
    const da = ctx.getImageData(0, 0, w, h).data
    ctx.clearRect(0, 0, w, h)
    ctx.drawImage(ib, 0, 0)
    const db = ctx.getImageData(0, 0, w, h).data
    let changed = 0
    let maxDelta = 0
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])
      if (d > 6) changed++
      if (d > maxDelta) maxDelta = d
    }
    return { w, h, changed, pct: +(100 * changed / (w * h)).toFixed(2), maxDelta }
  }, [A, B])
  console.log(`${r.changed > 200 ? 'PASS' : 'FAIL'}  ${label}  ${r.changed} px changed (${r.pct}% of ${r.w}x${r.h}), max channel delta ${r.maxDelta}`)
  return r
}

;(async () => {
  fs.mkdirSync(DIR, { recursive: true })
  const b = await chromium.launch({
    executablePath: findChromium(),
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
  const report = {}

  // ── card: rest vs hover ───────────────────────────────────────────────────
  await p.goto(BASE + '/features', { waitUntil: 'load' })
  const card = p.locator('#capabilities .fx-cap-card').first()
  await card.scrollIntoViewIfNeeded()
  await p.waitForTimeout(1000)
  const box = await card.boundingBox()
  // pad the clip so the -3px lift and the shadow are inside the frame
  const clip = { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: box.width + 48, height: box.height + 48 }
  await p.screenshot({ path: `${DIR}/card-rest.png`, clip })
  await p.mouse.move(clip.x + clip.width / 2, clip.y + clip.height / 2)
  await p.waitForTimeout(450)
  await p.screenshot({ path: `${DIR}/card-hover.png`, clip })
  report.card = await diff(p, `${DIR}/card-rest.png`, `${DIR}/card-hover.png`, 'card rest vs hover')

  // ── gauge: mid-fill vs full ───────────────────────────────────────────────
  await p.goto(BASE + '/features', { waitUntil: 'load' })
  const g = p.locator('#capabilities .gauge-arc').first()
  await g.scrollIntoViewIfNeeded()
  await p.waitForTimeout(1400)
  const gbox = await g.boundingBox()
  const gc = { x: gbox.x - 6, y: gbox.y - 6, width: gbox.width + 12, height: gbox.height + 12 }
  await p.screenshot({ path: `${DIR}/gauge-full.png`, clip: gc })
  // rewind the arc to 0, wait out the reverse transition, shoot it empty
  await p.evaluate(() => document.querySelector('#capabilities .gauge-arc').classList.remove('is-in'))
  await p.waitForTimeout(1400)
  await p.screenshot({ path: `${DIR}/gauge-empty.png`, clip: gc })
  report.gauge = await diff(p, `${DIR}/gauge-empty.png`, `${DIR}/gauge-full.png`, 'gauge empty vs full')
  // 38% of a semicircle: sanity-check the ink grew, not shrank
  const ink = await p.evaluate(async ([E, F]) => {
    const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + src })
    const count = async (src) => {
      const im = await load(src)
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height
      const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0)
      const d = x.getImageData(0, 0, c.width, c.height).data
      let n = 0
      for (let i = 0; i < d.length; i += 4) if (d[i + 2] > 150 && d[i] < 120) n++
      return n
    }
    return { empty: await count(E), full: await count(F) }
  }, [fs.readFileSync(`${DIR}/gauge-empty.png`).toString('base64'), fs.readFileSync(`${DIR}/gauge-full.png`).toString('base64')])
  const grew = ink.full > ink.empty * 1.25
  console.log(`${grew ? 'PASS' : 'FAIL'}  gauge ink grows  accent px empty=${ink.empty} full=${ink.full}`)
  report.gaugeInk = { ...ink, ok: grew }

  await b.close()
  fs.writeFileSync(`${DIR}/pixel-report.json`, JSON.stringify(report, null, 1))
  process.exit(report.card.changed > 200 && report.gauge.changed > 200 && grew ? 0 : 1)
})()
