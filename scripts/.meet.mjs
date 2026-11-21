import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
for (const w of [1440, 390]) {
const ctx = await b.newContext({ viewport:{width:w,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2000)
const r = await p.evaluate(() => {
  const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent))
  if(!ol) return {found:false}
  const li=[...ol.querySelectorAll('li')]
  const box=ol.getBoundingClientRect()
  const info=li.map(e=>{const b=e.getBoundingClientRect(); const c=getComputedStyle(e); return {txt:e.textContent.trim().slice(0,28), o:c.opacity, disp:c.display, w:Math.round(b.width), h:Math.round(b.height), y:Math.round(b.y+scrollY)}})
  const oc=getComputedStyle(ol)
  const par=ol.parentElement.getBoundingClientRect()
  return {found:true, ol:{w:Math.round(box.width),h:Math.round(box.height),y:Math.round(box.y+scrollY),cls:oc.display+' '+oc.gridTemplateColumns}, parentW:Math.round(par.width), li:info}
})
console.log(w, JSON.stringify(r))
await ctx.close()
}
await b.close()
