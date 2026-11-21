import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load', timeout:60000 })
await p.evaluate(async()=>{
  document.documentElement.style.scrollBehavior='auto'
  for (let pass=0;pass<4;pass++){
    for(let y=0;y<document.body.scrollHeight;y+=innerHeight*0.6){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,90)))}
    window.scrollTo({top:document.body.scrollHeight,behavior:'instant'});await new Promise(r=>setTimeout(r,700))
  }
  window.scrollTo({top:0,behavior:'instant'});await new Promise(r=>setTimeout(r,600))
})
const r = await p.evaluate(()=>{
  const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent))
  const li=[...ol.querySelectorAll('li')]
  const par=ol
  return li.map(e=>{const b=e.getBoundingClientRect();const c=getComputedStyle(e);return {txt:e.textContent.trim().slice(0,22),o:c.opacity,vis:c.visibility,y:Math.round(b.y+scrollY),h:Math.round(b.height)}})
})
console.log('AFTER WALK:', JSON.stringify(r))
await p.evaluate(()=>{const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent)); ol.scrollIntoView({block:'center'})})
await p.waitForTimeout(500)
const box = await p.evaluate(()=>{const ol=[...document.querySelectorAll('ol')].find(o=>/The pod senses/.test(o.textContent));const b=ol.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}})
await p.screenshot({path:'/tmp/mgqa/crops/meet-live.png', clip:{x:box.x-10,y:box.y-10,width:box.w+20,height:box.h+20}})
await b.close()
