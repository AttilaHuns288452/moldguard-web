import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
for (const w of [1440, 1024, 768, 390]) {
  const ctx = await b.newContext({ viewport:{width:w,height:900} })
  const p = await ctx.newPage()
  await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2000)
  const r = await p.evaluate(() => {
    const els=[...document.querySelectorAll('*')].filter(e=>e.children.length<=2 && /^Open cutaway/.test(e.textContent.trim()))
    return els.map(e=>{const b=e.getBoundingClientRect(); return {tag:e.tagName, cls:String(e.className).slice(0,50), sw:e.scrollWidth, cw:e.clientWidth, bw:Math.round(b.width), txt:e.textContent.trim().slice(0,70)}})
  })
  console.log(w, JSON.stringify(r))
  // screenshot the card bottom area
  const card = p.locator('text=Open cutaway').first()
  if (await card.count()) { await card.scrollIntoViewIfNeeded(); await p.waitForTimeout(200); await card.screenshot({path:`/tmp/mgqa/crops/cap-${w}.png`}).catch(()=>{}) }
  await ctx.close()
}
await b.close()
