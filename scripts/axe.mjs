const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

/**
 * axe-core over every route, run in the page against the live bundle.
 * The CLI wrapper needs a chromedriver; injecting the script directly avoids
 * that and works with the already-installed playwright chromium.
 */
const BASE = process.argv[2] || 'https://moldguard-web.vercel.app'
const ROUTES = ['/', '/features', '/how-it-works', '/contact', '/download']
// axe-core is a dev dependency; the CLI wrapper needs a chromedriver, so the
// script is injected straight into the page instead.
const AXE = require.resolve('axe-core/axe.min.js')

;(async () => {
  const b = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM,
    args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  })
  const report = {}
  let total = 0

  for (const r of ROUTES) {
    for (const vp of [{ w: 390, h: 844, name: 'mobile' }, { w: 1440, h: 900, name: 'desktop' }]) {
      const p = await b.newPage({ viewport: { width: vp.w, height: vp.h }, isMobile: vp.w < 500, hasTouch: vp.w < 500 })
      await p.goto(BASE + r, { waitUntil: 'load', timeout: 60000 })
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y)
          await new Promise((res) => setTimeout(res, 30))
        }
        window.scrollTo(0, 0)
      })
      // Wait for reveal animations to finish. Axe composites colour with opacity,
      // so auditing mid-fade reports text as lighter than it ever rests and
      // produces false contrast failures (verified: same page, run 1 clean,
      // run 2 one violation). Poll until no running animations, then settle.
      await p.evaluate(async () => {
        const wait = (ms) => new Promise((r) => setTimeout(r, ms))
        for (let i = 0; i < 60; i++) {
          const running = document.getAnimations().filter((a) => a.playState === 'running')
          if (!running.length) break
          await wait(100)
        }
      })
      await p.waitForTimeout(1200)
      await p.addScriptTag({ content: fs.readFileSync(AXE, 'utf8') })
      const res = await p.evaluate(async () => {
        const out = await window.axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] },
        })
        return out.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
          target: v.nodes[0]?.target?.join(' ').slice(0, 70) || '',
          summary: (v.nodes[0]?.failureSummary || '').split('\n')[1]?.trim().slice(0, 80) || '',
        }))
      })
      const key = r + ' ' + vp.name
      report[key] = res
      total += res.length
      await p.close()
    }
  }
  await b.close()

  for (const [k, v] of Object.entries(report)) {
    if (!v.length) { console.log('CLEAN  ' + k); continue }
    console.log('VIOLATIONS  ' + k)
    v.forEach((x) => console.log('   [' + x.impact + '] ' + x.id + ' x' + x.nodes + '  ' + x.target + '  :: ' + x.summary))
  }
  console.log('\n' + total + ' violation types across 10 route/viewport combinations')
  fs.writeFileSync('.qa/axe-report.json', JSON.stringify(report, null, 1))
})()
