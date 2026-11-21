import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
for (const w of [1440, 1024, 390]) {
  const ctx = await b.newContext({ viewport:{width:w,height:900} })
  const p = await ctx.newPage()
  await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2500)
  const r = await p.evaluate(() => {
    const card = [...document.querySelectorAll('div')].find(e => /overflow-hidden rounded-shell/.test(e.className))
    const read = [...document.querySelectorAll('*')].find(e => /^MoldGuardMOLD RISK INDEX/.test(e.textContent.replace(/\s+/g,'')))
    const cb = card?.getBoundingClientRect(), rb = read?.getBoundingClientRect()
    const cs = card ? getComputedStyle(card) : null
    return { card: cb && {x:Math.round(cb.x),y:Math.round(cb.y),w:Math.round(cb.width),h:Math.round(cb.height),bottom:Math.round(cb.bottom)},
             read: rb && {x:Math.round(rb.x),y:Math.round(rb.y),w:Math.round(rb.width),h:Math.round(rb.height),bottom:Math.round(rb.bottom)},
             overflow: cs?.overflow, readCls: String(read?.className).slice(0,80) }
  })
  console.log(w, JSON.stringify(r))
  await ctx.close()
}
await b.close()
