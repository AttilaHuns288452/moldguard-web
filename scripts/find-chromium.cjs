/**
 * Resolve a chromium binary to drive.
 *
 * Playwright pins an exact build (e.g. chromium_headless_shell-1255). When the
 * cache on a machine holds a different build, `chromium.launch()` dies with
 * "Executable doesn't exist ... run npx playwright install". That failure is
 * easy to hide: export PW_CHROMIUM in your shell and everything passes, for you.
 *
 * Order: PW_CHROMIUM -> playwright's own path (if it exists) -> any chromium
 * build already in ~/.cache/ms-playwright -> undefined (let playwright try).
 */
const fs = require('node:fs')
const path = require('node:path')

function findChromium() {
  if (process.env.PW_CHROMIUM) return process.env.PW_CHROMIUM

  let own = null
  try {
    // require lazily so this file is usable from scripts that import playwright
    own = require('playwright').chromium.executablePath()
  } catch {
    own = null
  }
  if (own && fs.existsSync(own)) return undefined

  const cache = path.join(process.env.HOME || '', '.cache/ms-playwright')
  if (fs.existsSync(cache)) {
    const builds = fs.readdirSync(cache).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()
    for (const d of builds) {
      for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
        const p = path.join(cache, d, rel)
        if (fs.existsSync(p)) return p
      }
    }
  }
  return undefined
}

module.exports = { findChromium }
