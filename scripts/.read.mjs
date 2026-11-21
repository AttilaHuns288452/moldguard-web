import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require_ = createRequire(process.cwd()+'/scripts/x.js')
const { findChromium } = require_('/home/attila/Documents/Projects/moldguard-web/scripts/find-chromium.cjs')
const b = await chromium.launch({ executablePath: findChromium(), args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] })
const ctx = await b.newContext({ viewport:{width:1440,height:900} })
const p = await ctx.newPage()
await p.goto('http://127.0.0.1:4173/', { waitUntil:'load' }); await p.waitForTimeout(2500)
const r = await p.evaluate(()=>{
  const card=[...document.querySelectorAll('div')].find(e=>/overflow-hidden rounded-shell/.test(e.className))
  const txt=[...card.querySelectorAll('*')].find(e=>e.textContent.trim().startsWith('MoldGuard') && e.children.length<6)
  // the readout: navy block
  let navy=null
  for (const e of card.querySelectorAll('*')) {
    const c=getComputedStyle(e)
    if (c.backgroundColor && /rgb\(21, 56, 94\)|#15385e/i.test(c.backgroundColor)) { navy=e; break }
  }
  const g=e=>{const b=e.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height),bottom:Math.round(b.bottom)}}
  return { card:g(card), navy: navy?{...g(navy), cls:String(navy.className).slice(0,70)}:null,
           navyBottomBeyondCard: navy ? g(navy).bottom - g(card).bottom : null }
})
console.log(JSON.stringify(r))
await b.close()
