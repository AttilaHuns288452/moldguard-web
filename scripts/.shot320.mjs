import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })

const ctx = await b.newContext({ viewport:{width:320,height:700}, deviceScaleFactor:2 })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2000)
const el = p.locator('p', { hasText: /^Temperature$/ }).first()
await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
await el.screenshot({ path:'/tmp/mgqa/crops/ov320-el.png' })
const near = p.locator('div.rounded-tight', { hasText: 'Temperature' }).first()
await near.screenshot({ path:'/tmp/mgqa/crops/ov320-card.png' }).catch(e=>console.log('cardfail',e.message))
const m = await p.evaluate(()=>{
  const e=[...document.querySelectorAll('p')].find(x=>x.textContent.trim()==='Temperature')
  const r=e.getBoundingClientRect(), par=e.parentElement.getBoundingClientRect()
  return {txtW:e.scrollWidth, txtCW:e.clientWidth, parentW:Math.round(par.width), font:getComputedStyle(e).fontSize}
})
console.log('temp', JSON.stringify(m))

const ctx2 = await b.newContext({ viewport:{width:1440,height:900} })
const p2 = await ctx2.newPage()
await p2.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p2.waitForTimeout(2500)
const c = await p2.evaluate(() => {
  const t=[...document.querySelectorAll('div')].filter(e=>/^Open cutaway/.test(e.textContent))[0]
  t.scrollIntoView({block:'center'}); const r=t.getBoundingClientRect()
  return {sw:t.scrollWidth, cw:t.clientWidth, x:r.x,y:r.y,w:r.width,h:r.height, ws:getComputedStyle(t).whiteSpace, txt:t.textContent}
})
console.log('caption', JSON.stringify(c))
await p2.waitForTimeout(300)
await p2.screenshot({ path:'/tmp/mgqa/crops/ovcaption.png', clip:{x:Math.max(0,c.x-16),y:Math.max(0,c.y-16),width:c.w+32,height:c.h+32} })
await b.close()
