import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:[] })
const ctx = await b.newContext({ viewport:{width:390,height:844} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2000)
await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'})
const cs = await p.evaluate(()=>{
  const e=document.querySelector('.reveal'); const c=getComputedStyle(e)
  return {transition:c.transition, duration:c.transitionDuration, prop:c.transitionProperty}
})
console.log('reveal css', JSON.stringify(cs))
// instant jump straight to 1600 and sample opacity over time
for (const wait of [0, 100, 350, 800, 1500]) {
  await p.evaluate(()=>window.scrollTo({top:0,behavior:'instant'})); await p.waitForTimeout(400)
  await p.evaluate(()=>window.scrollTo({top:1600,behavior:'instant'}))
  await p.waitForTimeout(wait)
  const r = await p.evaluate(()=>{
    const vis=[...document.querySelectorAll('.reveal')].filter(e=>{const b=e.getBoundingClientRect(); return b.top<innerHeight && b.bottom>0})
    return vis.map(e=>({o:getComputedStyle(e).opacity, txt:e.textContent.trim().slice(0,26)}))
  })
  console.log('wait',wait, JSON.stringify(r))
}
await b.close()
