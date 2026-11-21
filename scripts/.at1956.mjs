import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1956,height:1100} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2500)
const r = await p.evaluate(()=>{
  const g=s=>{const e=document.querySelector(s); if(!e) return null; const c=getComputedStyle(e); const b=e.getBoundingClientRect(); return {fs:c.fontSize, lh:c.lineHeight, x:Math.round(b.x), w:Math.round(b.width), h:Math.round(b.height), lines:Math.round(b.height/parseFloat(c.lineHeight||b.height))}}
  return { h1:g('h1'), body:g('main p'), eyebrow:g('main p.text-xs') || g('.eyebrow'),
    container: (()=>{const e=document.querySelector('section'); const b=e.getBoundingClientRect(); return {x:Math.round(b.x), w:Math.round(b.width)}})(),
    docH: document.documentElement.scrollHeight }
})
console.log(JSON.stringify(r,null,1))
await p.screenshot({ path:'/tmp/mgqa/crops/render-1956.png', fullPage:true })
await b.close()
