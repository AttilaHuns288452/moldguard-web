import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(1500)
const r = await p.evaluate(() => {
  const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent))
  const card=[...document.querySelectorAll('div')].find(e=>/overflow-hidden rounded-shell/.test(e.className))
  const g=(e)=>{const b=e.getBoundingClientRect(); return {x:Math.round(b.x),y:Math.round(b.y+scrollY),w:Math.round(b.width),h:Math.round(b.height),z:getComputedStyle(e).zIndex, pos:getComputedStyle(e).position}}
  const items=[...ol.querySelectorAll('li')].map(i=>{const b=i.getBoundingClientRect(); return {y:Math.round(b.y+scrollY), x:Math.round(b.x), w:Math.round(b.width)}})
  // what element is at the ol center point?
  const bb=ol.getBoundingClientRect()
  const hit=document.elementFromPoint(bb.x+bb.width/2, bb.y+bb.height/2)
  return { ol:g(ol), card:g(card), items, hitAtOlCentre: hit ? hit.tagName+' '+String(hit.className).slice(0,50) : null }
})
console.log(JSON.stringify(r,null,1))
await b.close()
