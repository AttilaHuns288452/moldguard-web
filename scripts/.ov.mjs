import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
for (const vp of [{n:'desk',w:1440,h:900},{n:'mob',w:390,h:844},{n:'mob320',w:320,h:700}]) {
  const ctx = await b.newContext({ viewport:{width:vp.w,height:vp.h} })
  const p = await ctx.newPage()
  for (const route of ['/', '/how-it-works']) {
    await p.goto('http://127.0.0.1:4173'+route, { waitUntil:'load' })
    await p.waitForTimeout(1500)
    const r = await p.evaluate(() => {
      const out=[]
      for (const el of document.querySelectorAll('h1,h2,h3,p,li,span,a,button,div')) {
        const rc = el.getBoundingClientRect()
        if (rc.width===0||rc.height===0) continue
        if (el.scrollWidth > el.clientWidth+2 && getComputedStyle(el).overflow !== 'auto') {
          out.push({t:el.tagName, cls:String(el.className).slice(0,40), txt:el.textContent.trim().slice(0,40), sw:el.scrollWidth, cw:el.clientWidth})
        }
      }
      // horizontal document overflow
      const de=document.documentElement
      return { overflowX: de.scrollWidth-de.clientWidth, offenders: out.slice(0,12),
               bodyScroll: de.scrollWidth }
    })
    console.log(vp.n, route, JSON.stringify(r))
  }
  await ctx.close()
}
await b.close()
