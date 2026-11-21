import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd() + '/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')

const browser = await chromium.launch({
  executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const out = {}
for (const vp of [{n:'desk',w:1440,h:900},{n:'mob',w:390,h:844}]) {
  const ctx = await browser.newContext({ viewport:{width:vp.w,height:vp.h}, deviceScaleFactor:1 })
  const page = await ctx.newPage()
  await page.goto('http://127.0.0.1:4173/', { waitUntil:'load', timeout:60000 })
  await page.waitForTimeout(2500)
  const info = await page.evaluate(() => {
    document.documentElement.style.scrollBehavior='auto'
    const secs = [...document.querySelectorAll('main section, section')].map(s => ({
      id: s.id || null, top: Math.round(s.getBoundingClientRect().top + scrollY),
      h: Math.round(s.getBoundingClientRect().height), cls: s.className.slice(0,60),
      h1: (s.querySelector('h1')?.textContent||'').slice(0,60),
      h2: [...s.querySelectorAll('h2')].map(h=>h.textContent.trim().slice(0,50)),
    }))
    const heads = [...document.querySelectorAll('h1,h2')].map(h => {
      const r = h.getBoundingClientRect(); const cs = getComputedStyle(h)
      const lines = Math.round(r.height / (parseFloat(cs.lineHeight) || r.height))
      return { tag:h.tagName, text:h.textContent.trim().slice(0,55), fs: cs.fontSize, lh: cs.lineHeight, w: Math.round(r.width), h: Math.round(r.height), lines,
               top: Math.round(r.top+scrollY) }
    })
    return { docH: document.documentElement.scrollHeight, secs, heads, bodyFont: getComputedStyle(document.querySelector('main p') || document.body).fontSize }
  })
  out[vp.n] = info
  await page.screenshot({ path:`/tmp/mgqa/crops/render-${vp.n}.png`, fullPage:true })
  await ctx.close()
}
await browser.close()
console.log(JSON.stringify(out, null, 1))
