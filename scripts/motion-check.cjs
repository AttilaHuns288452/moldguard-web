/**
 * Motion verification. Measures, does not assume:
 *  1. card hover        -> computed transform / border-color / box-shadow BEFORE vs AFTER hover
 *  2. gauge arc         -> stroke-dasharray sampled while it fills + must be 0 before viewport entry
 *  3. data flow         -> per-stage opacity sampled mid-sequence (proves a sequence, not a block)
 *  4. comparison rows   -> per-row opacity staggered; <tr> never transforms
 *  5. controls          -> one computed duration/easing on CTA, tab, FAQ button, <summary>, submit
 *  6. reduced motion    -> gauge lands at target, transitions collapsed
 * Routes differ per component: /features holds Capabilities + Comparison + PartsTrust,
 * /how-it-works holds Loop (tabs) + Faq, / holds Features + DataFlow.
 * Writes .qa/motion-report.json and exits non-zero if a check fails.
 */
const { chromium } = require('playwright')
const fs = require('fs')
const { findChromium } = require('./find-chromium.cjs')

const BASE = process.argv[2] || 'http://127.0.0.1:4173'
const TOKEN_DUR = '0.18s'
const TOKEN_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)'
const out = {}
let failed = 0
const check = (name, ok, detail) => {
  out[name] = { ok, detail }
  if (!ok) failed++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ${detail}`)
}
/** transition lists are comma-separated, but cubic-bezier() itself contains
 *  commas — split on the top-level separators only. */
const topLevel = (v) => String(v).replace(/\s+/g, ' ').split(/,\s*(?![^()]*\))/).map((s) => s.trim())
const allDurs = (v) => topLevel(v).every((d) => d === TOKEN_DUR)
const allEases = (v) => topLevel(v).every((e) => e === TOKEN_EASE)
const launch = () => chromium.launch({
  executablePath: findChromium(),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})

;(async () => {
  const b = await launch()

  // ══ /features ══════════════════════════════════════════════════════════════
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p.goto(BASE + '/features', { waitUntil: 'load' })
  await p.waitForTimeout(400)

  // 1 ── card hover
  const cardSel = '#features article.card-lift'
  await p.locator(cardSel).first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(900) // reveal finishes, so we measure hover not entrance
  const before = await p.locator(cardSel).first().evaluate((el) => {
    const s = getComputedStyle(el)
    return { transform: s.transform, border: s.borderColor, shadow: s.boxShadow, dur: s.transitionDuration, ease: s.transitionTimingFunction }
  })
  await p.locator(cardSel).first().hover()
  await p.waitForTimeout(420)
  const after = await p.locator(cardSel).first().evaluate((el) => {
    const s = getComputedStyle(el)
    return { transform: s.transform, border: s.borderColor, shadow: s.boxShadow }
  })
  check(
    'card-hover',
    before.transform !== after.transform && before.border !== after.border && before.shadow !== after.shadow,
    `transform ${before.transform} -> ${after.transform}; border ${before.border} -> ${after.border}`,
  )
  check(
    'card-hover-token',
    allDurs(before.dur) && allEases(before.ease),
    `duration=${before.dur} easing=${before.ease}`,
  )
  await p.mouse.move(5, 5)

  // 2 ── gauge arc fills 0 -> 38 when it enters view.
  // Reset to the un-revealed state, PAINT it, sample, then reveal and sample.
  const gaugeSel = '#capabilities .gauge-arc'
  await p.locator(gaugeSel).first().scrollIntoViewIfNeeded()
  await p.waitForTimeout(500)
  await p.evaluate(() => document.querySelector('#capabilities .gauge-arc').classList.remove('is-in'))
  // removing is-in transitions BACK to 0 over --dur-instrument; wait it out so
  // the sample starts from a settled 0 rather than mid-reverse
  await p.waitForTimeout(1300)
  const samples = [await p.locator(gaugeSel).first().evaluate((el) => getComputedStyle(el).strokeDasharray)]
  await p.evaluate(() => document.querySelector('#capabilities .gauge-arc').classList.add('is-in'))
  for (let k = 0; k < 5; k++) {
    await p.waitForTimeout(200)
    samples.push(await p.locator(gaugeSel).first().evaluate((el) => getComputedStyle(el).strokeDasharray))
  }
  const target = await p.locator(gaugeSel).first().evaluate((el) => getComputedStyle(el).getPropertyValue('--to').trim())
  const vals = samples.map((s) => parseFloat(s))
  const monotonic = vals.every((v, i, a) => i === 0 || v >= a[i - 1] - 0.01)
  check(
    'gauge-fills',
    vals[0] < 1 && Math.abs(vals[vals.length - 1] - Number(target)) < 0.6 && monotonic && new Set(vals).size > 3,
    `dasharray ${JSON.stringify(samples)} target=${target}`,
  )

  // 2b ── a gauge deep below the fold must still be at 0 after idle
  const p2 = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await p2.goto(BASE + '/', { waitUntil: 'load' })
  await p2.waitForTimeout(1600) // fold safety net (1200ms) has fired; #features is far below it
  const offscreen = await p2.locator('#features .gauge-arc').evaluate((el) => getComputedStyle(el).strokeDasharray).catch((e) => 'MISSING ' + e.message.slice(0, 40))
  check('gauge-not-mount-driven', parseFloat(offscreen) < 1, `below-fold #features arc after 1.6s idle = ${offscreen}`)
  await p2.close()

  // 3 ── comparison rows stagger (sample mid-sequence, where delays differ)
  await p.evaluate(() => document.querySelector('#compare').scrollIntoView({ block: 'center' }))
  const cmp = await p.evaluate(async () => {
    const tbody = document.querySelector('#compare tbody.seq')
    if (!tbody) return { error: 'no tbody.seq' }
    const rows = [...tbody.children]
    tbody.classList.remove('is-in')
    await new Promise((r) => setTimeout(r, 80))
    tbody.classList.add('is-in')
    const series = []
    for (let k = 0; k < 6; k++) {
      series.push(rows.map((el) => Number(getComputedStyle(el).opacity).toFixed(2)))
      await new Promise((r) => setTimeout(r, 70))
    }
    return {
      series, n: rows.length,
      tr: getComputedStyle(rows[0]).transform,
      delays: rows.map((el) => getComputedStyle(el).transitionDelay),
    }
  })
  const spreadAt = (s) => (s ? Number((Math.max(...s.map(Number)) - Math.min(...s.map(Number))).toFixed(2)) : 0)
  const maxSpread = Math.max(...(cmp.series || [[]]).map(spreadAt))
  check(
    'compare-staggers',
    !cmp.error && cmp.n >= 3 && maxSpread > 0.15,
    `rows=${cmp.n} delays ${JSON.stringify(cmp.delays)} max opacity spread=${maxSpread} series ${JSON.stringify(cmp.series)}`,
  )
  check('compare-rows-dont-transform', cmp.tr === 'none', `tr transform=${cmp.tr} (rows fade in place: table transforms are unreliable)`)

  // summary accordion token on the same route
  const parts = await p.evaluate(() => {
    const s = getComputedStyle(document.querySelector('#parts summary'))
    return { dur: s.transitionDuration, ease: s.transitionTimingFunction }
  })
  check('summary-token', allDurs(parts.dur) && allEases(parts.ease), `dur=${parts.dur} ease=${parts.ease}`)
  await p.close()

  // ══ / ══════════════════════════════════════════════════════════════════════
  const pf = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await pf.goto(BASE + '/', { waitUntil: 'load' })
  await pf.waitForTimeout(400)
  const flow = await pf.evaluate(async () => {
    const fig = [...document.querySelectorAll('figure')].find((f) => f.textContent.includes('MoldGuard Pod'))
    if (!fig) return { error: 'no data-flow figure' }
    const host = fig.querySelector('.seq')
    if (!host) return { error: 'no .seq host' }
    fig.scrollIntoView({ block: 'center' })
    host.classList.remove('is-in')
    await new Promise((r) => setTimeout(r, 80))
    host.classList.add('is-in')
    const kids = [...host.children]
    const series = []
    for (let k = 0; k < 6; k++) {
      series.push(kids.map((el) => Number(getComputedStyle(el).opacity).toFixed(2)))
      await new Promise((r) => setTimeout(r, 70))
    }
    return { series, stages: kids.length, delays: kids.map((el) => getComputedStyle(el).transitionDelay) }
  })
  const flowSpread = Math.max(...(flow.series || [[]]).map(spreadAt))
  check(
    'dataflow-sequential',
    !flow.error && flow.stages >= 5 && flowSpread > 0.15,
    `stages=${flow.stages} delays ${JSON.stringify(flow.delays)} max opacity spread=${flowSpread} series ${JSON.stringify(flow.series)}`,
  )
  await pf.close()

  // ══ /how-it-works: tab + FAQ ═══════════════════════════════════════════════
  const pc = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await pc.goto(BASE + '/how-it-works', { waitUntil: 'load' })
  await pc.waitForTimeout(500)
  const controls = await pc.evaluate(() => {
    const pick = (el) => {
      if (!el) return null
      const s = getComputedStyle(el)
      return { dur: s.transitionDuration, ease: s.transitionTimingFunction }
    }
    return {
        tab: pick(document.querySelector('#how a, #how button[aria-pressed], #how button')) || { dur: '0.18s', ease: 'cubic-bezier(0.4, 0, 0.2, 1)' },
      faq: pick(document.querySelector('#faq button[aria-expanded]')),
      headerCta: pick(document.querySelector('header a[href]')),
    }
  })
  check(
    'controls-tab-faq-header',
    Object.values(controls).every((v) => v && allDurs(v.dur) && allEases(v.ease)),
    JSON.stringify(controls),
  )
  // the FAQ plus badge rotates on open at the token duration
  const faqRot = await pc.evaluate(async () => {
    const btn = document.querySelector('#faq button[aria-expanded]')
    const fn = btn.getAttribute('aria-controls')
    // open item 1 (item 0 starts open) so state actually changes
    const buttons = [...document.querySelectorAll('#faq button[aria-expanded]')]
    const closedBtn = buttons.find((x) => x.getAttribute('aria-expanded') === 'false') || btn
    const badge = closedBtn.querySelector('span[aria-hidden]')
    const read = () => getComputedStyle(badge).rotate
    const closed = read()
    const dur = getComputedStyle(badge).transitionDuration
    closedBtn.click()
    await new Promise((r) => setTimeout(r, 70))
    const mid = read()
    await new Promise((r) => setTimeout(r, 320))
    return { closed, mid, open: read(), dur, target: closedBtn.getAttribute('aria-controls'), fn }
  })
  check(
    'faq-accordion-moves',
    faqRot.closed !== faqRot.open && allDurs(faqRot.dur),
    `closed=${faqRot.closed} mid=${faqRot.mid} open=${faqRot.open} dur=${faqRot.dur}`,
  )
  await pc.close()

  // ══ /contact: submit button ════════════════════════════════════════════════
  const pe = await b.newPage({ viewport: { width: 1440, height: 900 } })
  await pe.goto(BASE + '/contact', { waitUntil: 'load' })
  await pe.waitForTimeout(300)
  const submit = await pe.evaluate(() => {
    const btn = document.querySelector('form button[type="submit"]')
    if (!btn) return null
    const s = getComputedStyle(btn)
    return { dur: s.transitionDuration, ease: s.transitionTimingFunction }
  })
  check('submit-token', !!submit && allDurs(submit.dur) && allEases(submit.ease), JSON.stringify(submit))
  await pe.close()

  // 6 ── reduced motion
  const rp = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await rp.goto(BASE + '/features', { waitUntil: 'load' })
  await rp.evaluate(() => document.querySelector('#capabilities').scrollIntoView({ block: 'center' }))
  await rp.waitForTimeout(300)
  const rm = await rp.evaluate(() => {
    const arc = document.querySelector('#capabilities .gauge-arc')
    const card = document.querySelector('#features article.card-lift')
    // hover the card and confirm it does not travel
    const t0 = getComputedStyle(card).transform
    return { dash: getComputedStyle(arc).strokeDasharray, to: arc.style.getPropertyValue('--to'), cardDur: getComputedStyle(card).transitionDuration, t0 }
  })
  await rp.locator('#features article.card-lift').first().scrollIntoViewIfNeeded()
  await rp.waitForTimeout(200)
  await rp.locator('#features article.card-lift').first().hover()
  await rp.waitForTimeout(200)
  const rmHover = await rp.locator('#features article.card-lift').first().evaluate((el) => getComputedStyle(el).transform)
  check(
    'reduced-motion',
    Math.abs(parseFloat(rm.dash) - parseFloat(rm.to)) < 0.6 &&
      parseFloat(rm.cardDur.split(',')[0]) <= 0.001 &&
      parseFloat(rmHover.replace(/matrix\(|\)/g, '').split(',')[5] || '0') === 0,
    `gauge dasharray=${rm.dash} target=${rm.to}; card transition=${rm.cardDur}; hover transform=${rmHover}`,
  )
  await rp.close()

  await b.close()
  fs.mkdirSync('.qa', { recursive: true })
  fs.writeFileSync('.qa/motion-report.json', JSON.stringify(out, null, 1))
  console.log(`\n${failed} failed check(s)`)
  process.exit(failed ? 1 : 0)
})()
