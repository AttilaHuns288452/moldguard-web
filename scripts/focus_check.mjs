/** Click every component and verify the real render, opacity, framing and reset.
 * node scripts/focus_check.mjs [url]
 * The response-only probe exposes existing scene refs, never changes app logic.
 */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { findChromium } = require('./find-chromium.cjs')
const out = process.env.FOCUS_DIR || '.qa/focus'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ executablePath: findChromium(), args: [
  '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
] })
const results = []
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 }, reducedMotion: 'reduce' })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.route(/(?:DeviceScene[^/]*\.js|\/src\/components\/DeviceScene\.tsx)(?:\?.*)?$/, async (route) => {
    const response = await route.fetch()
    const body = await response.text()
    // Both Vite dev and production output retain this callback property.
    const pattern = /onCreated:\s*\(\s*\{\s*gl\s*(?::\s*(\w+))?\s*\}\s*\)\s*=>\s*\{/
    assert.match(body, pattern, 'viewer creation callback must be found before probing')
    const patched = body.replace(pattern, (_, alias) => {
      const gl = alias || 'gl'
      return `onCreated:({gl:${gl},camera:__qaCam,scene:__qaScene})=>{(globalThis.__qaScenes??=new Map()).set(${gl}.domElement,{gl:${gl},camera:__qaCam,scene:__qaScene});`
    })
    await route.fulfill({ response, body: patched })
  })
  await page.goto(process.argv[2] || 'http://127.0.0.1:5173/', { waitUntil: 'load' })
  await page.locator('#meet').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => {
    const canvas = document.querySelector('#meet canvas')
    return document.querySelector('#meet [data-model-loaded="true"]') && globalThis.__qaScenes?.has(canvas)
  })
  await page.waitForTimeout(2200)
  // The expected grouping is checked independently from opacity, using export names.
  const groups = [
    'dht11|vl53l0x', 'esp32', 'relay_module', 'peltier_thermoelectric_cooler',
    'aluminium_extruded_heatsink', 'generic_80mm_computer_fan', 'display', 'buzzer',
    'adafruit_tpa2016d2', 'usb_micro_port', null, '^mesh_\\d+_root_layer0_',
  ]
  const measure = (index = null, paint = false) => page.evaluate(({ index, paint, groups }) => {
    const s = globalThis.__qaScenes.get(document.querySelector('#meet canvas'))
    const { scene, camera, gl } = s
    scene.updateMatrixWorld(true)
    camera.updateMatrixWorld(true)
    const meshes = []
    scene.traverse((m) => { if (m.isMesh && /^mesh_/.test(m.name)) meshes.push(m) })
    const matches = groups.map((rx) => rx && new RegExp(rx, 'i'))
    const picked = index === null ? meshes : meshes.filter((m) => index === 10
      ? !matches.some((rx) => rx?.test(m.name)) : matches[index].test(m.name))
    const wanted = new Set(picked)
    let wrongOpacity = 0, wrongFlags = 0
    for (const m of meshes) {
      for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
        const expected = index === null ? mat.userData.baseOpacity
          : wanted.has(m) ? 1
            : m.userData.isShell ? 0.06 : 0.12
        if (Math.abs(mat.opacity - expected) > 0.015) wrongOpacity++
        if (index === null && (mat.transparent !== mat.userData.baseTransparent || mat.depthWrite !== mat.userData.baseDepthWrite)) wrongFlags++
        if (index !== null && wanted.has(m)) {
          if (mat.transparent || !mat.depthWrite) wrongFlags++
          if (mat.emissive && mat.emissiveIntensity < mat.userData.baseEmissiveI + 0.8) wrongFlags++
        }
      }
    }
    // Use the actual vertices, excluding the separate decorative shadow plane.
    const lo = camera.position.clone().set(Infinity, Infinity, Infinity)
    const hi = lo.clone().set(-Infinity, -Infinity, -Infinity)
    const ndlo = lo.clone(), ndhi = hi.clone(), v = lo.clone()
    for (const m of picked) {
      const pos = m.geometry.attributes.position
      for (let n = 0; n < pos.count; n++) {
        v.fromBufferAttribute(pos, n).applyMatrix4(m.matrixWorld)
        lo.min(v); hi.max(v); v.project(camera); ndlo.min(v); ndhi.max(v)
      }
    }
    const center = lo.clone().add(hi).multiplyScalar(0.5)
    const ndc = [...ndlo.toArray().slice(0, 2), ...ndhi.toArray().slice(0, 2)]
    let paintedPixels = null
    if (paint) {
      const c = document.createElement('canvas'); c.width = gl.domElement.width; c.height = gl.domElement.height
      const ctx = c.getContext('2d', { willReadFrequently: true })
      gl.render(scene, camera); ctx.drawImage(gl.domElement, 0, 0)
      const before = ctx.getImageData(0, 0, c.width, c.height).data
      const visibility = picked.map((m) => m.visible)
      try {
        picked.forEach((m) => { m.visible = false })
        gl.render(scene, camera); ctx.clearRect(0, 0, c.width, c.height); ctx.drawImage(gl.domElement, 0, 0)
        const after = ctx.getImageData(0, 0, c.width, c.height).data
        paintedPixels = 0
        for (let p = 0; p < before.length; p += 4) {
          if (Math.max(...[0, 1, 2, 3].map((k) => Math.abs(before[p + k] - after[p + k]))) > 12) paintedPixels++
        }
      } finally {
        picked.forEach((m, i) => { m.visible = visibility[i] }); gl.render(scene, camera)
      }
    }
    return { meshes: meshes.length, picked: picked.length, ghosted: meshes.length - picked.length,
      wrongOpacity, wrongFlags, ndc, center: center.toArray(), radius: camera.position.distanceTo(center),
      camera: camera.position.toArray(), paintedPixels }
  }, { index, paint, groups })
  const base = await measure()
  assert.equal(base.meshes, 278, 'the complete original model must remain present')
  assert.equal(base.wrongOpacity + base.wrongFlags, 0, 'initial model fully restored')
  await page.locator('#meet [data-device-canvas]').screenshot({ path: `${out}/assembled.png` })
  const rows = page.locator('#meet li button')
  assert.equal(await rows.count(), 12)
  const baseline = []
  for (let i = 0; i < 12; i++) baseline.push(await measure(i))
  for (let i = 0; i < 12; i++) {
    const label = (await rows.nth(i).innerText()).replace(/\s+/g, ' ').trim()
    await rows.nth(i).click()
    // Rendering under SwiftShader can advance fewer frames than wall-clock
    // sleeps imply. Wait for opacity and framing to converge before sampling.
    let m
    for (let attempt = 0; attempt < 40; attempt++) {
      await page.waitForTimeout(250)
      m = await measure(i)
      const [x0, y0, x1, y1] = m.ndc
      if (m.wrongOpacity === 0 && m.wrongFlags === 0 &&
          Math.abs((x0 + x1) / 2) < 0.25 && Math.abs((y0 + y1) / 2) < 0.25 &&
          (i >= 10 || m.radius < baseline[i].radius * 0.9)) break
    }
    m = await measure(i, true)
    const [x0, y0, x1, y1] = m.ndc
    const checks = {
      subject: m.picked > 0 && m.picked < 150,
      faded: m.wrongOpacity === 0 && m.wrongFlags === 0,
      centered: Math.abs((x0 + x1) / 2) < 0.25 && Math.abs((y0 + y1) / 2) < 0.25,
      visible: m.paintedPixels > 60,
      framed: Math.max(x1 - x0, y1 - y0) > 0.05 && Math.max(Math.abs(x0), Math.abs(x1), Math.abs(y0), Math.abs(y1)) < 1.05,
      zoom: i >= 10 || m.radius < baseline[i].radius * 0.9,
    }
    const ok = Object.values(checks).every(Boolean)
    results.push({ label, ...m, checks, ok })
    await writeFile(`${out}/results.json`, JSON.stringify(results, null, 2))
    if ([0, 1, 6].includes(i)) await page.locator('#meet [data-device-canvas]').screenshot({ path: `${out}/part-${i + 1}.png` })
    console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: solid=${m.picked}, faded=${m.ghosted}, pixels=${m.paintedPixels}, r=${m.radius.toFixed(3)}${ok ? '' : ' ' + JSON.stringify(checks)}`)
  }
  await page.getByRole('button', { name: /^Assembled$/ }).first().click(); await page.waitForTimeout(2400)
  const restored = await measure()
  assert.equal(restored.wrongOpacity + restored.wrongFlags, 0, 'Assembled restores opacity and render flags')
  assert.ok(Math.abs(restored.radius - base.radius) < 0.02, 'Assembled restores fit distance')
  await rows.nth(1).click(); await page.waitForTimeout(1200)
  await page.getByRole('button', { name: 'Reset the view', exact: true }).click(); await page.waitForTimeout(2400)
  assert.equal((await measure()).wrongOpacity, 0, 'Reset clears selection and restores materials')
  await page.getByRole('button', { name: /^Exploded$/ }).click(); await page.waitForTimeout(1800)
  await rows.nth(1).click(); await page.waitForTimeout(2400)
  const exploded = await measure(1, true)
  assert.ok(exploded.wrongOpacity === 0 && exploded.paintedPixels > 60, 'focus also works in exploded view')
  await page.getByRole('button', { name: /^Assembled$/ }).click(); await page.waitForTimeout(2400)
  assert.equal((await measure()).wrongOpacity, 0, 'returning from exploded restores the assembly')
  assert.equal(errors.length, 0, errors.join('\n'))
  assert.equal(results.length, 12)
  assert.ok(results.every((r) => r.ok), 'all 12 component checks must pass')
  console.log('FOCUS: PASS. 12/12 parts, opacity, rendered pixels, zoom, framing, reset, exploded mode.')
} finally { await browser.close() }
