import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2000)
console.log(await p.evaluate(()=>{
  const rows=[]
  for (const h of document.querySelectorAll('h1,h2')) {
    const c=getComputedStyle(h), r=h.getBoundingClientRect()
    rows.push(`${h.tagName} ${c.fontSize} lh=${c.lineHeight} w=${Math.round(r.width)} lines=${Math.round(r.height/parseFloat(c.lineHeight))} :: ${h.textContent.trim().replace(/\s+/g,' ').slice(0,44)}`)
  }
  const canv=document.querySelector('canvas'); let bg=null
  if(canv){const r=canv.getBoundingClientRect(); bg={w:Math.round(r.width),h:Math.round(r.height),x:Math.round(r.x),y:Math.round(r.y), parentCls:String(canv.parentElement?.className).slice(0,60), parentBg:canv.parentElement?getComputedStyle(canv.parentElement).backgroundColor:null}}
  return rows.join('\n')+'\nCANVAS '+JSON.stringify(bg)
}))
await b.close()
