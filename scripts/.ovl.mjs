import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load', timeout:60000 })
await p.evaluate(async()=>{document.documentElement.style.scrollBehavior='auto';for(let i=0;i<3;i++){for(let y=0;y<document.body.scrollHeight;y+=540){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,80)))}window.scrollTo({top:document.body.scrollHeight,behavior:'instant'});await new Promise(r=>setTimeout(r,500))}window.scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,400))})
const r = await p.evaluate(()=>{
  const g=e=>{const b=e.getBoundingClientRect();return {y:Math.round(b.y+scrollY),h:Math.round(b.height),x:Math.round(b.x),w:Math.round(b.width)}}
  const h2=[...document.querySelectorAll('h2')].find(e=>/Meet MoldGuard/.test(e.textContent))
  const lede=[...document.querySelectorAll('p')].find(e=>/^One device senses/.test(e.textContent))
  const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent))
  const sec=document.getElementById('meet')
  return { h2:g(h2), lede:g(lede), ol:g(ol), sec:g(sec),
           olOverlapsH2: !(g(ol).y > g(h2).y+g(h2).h) }
})
console.log(JSON.stringify(r))
const sec=await p.evaluate(()=>{const s=document.getElementById('meet').getBoundingClientRect();return {y:s.y+scrollY,h:s.height}})
await p.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}), sec.y-20)
await p.waitForTimeout(600)
await p.screenshot({path:'/tmp/mgqa/crops/meet-sec.png', clip:{x:60,y:20,width:700,height:Math.min(900,sec.h)}})
await b.close()
