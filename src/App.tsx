import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Header from './components/Header'
import Footer from './sections/Footer'
import { ScrollProgress } from './components/ui'
import { applyHead, navigate, pageFor, pageFromLocation, type Location_ } from './lib/route'
import { prefersReducedMotion } from './lib/motion'

// page 1 of the PDF
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Meet from './sections/Meet'
import Loop from './sections/Loop'
import Capabilities from './sections/Capabilities'
import RiskShowcase from './sections/RiskShowcase'
import Comparison from './sections/Comparison'
import PartsTrust from './sections/PartsTrust'
import WhatItDoes from './sections/WhatItDoes'
// page 2
// page 3 (how it works)
import Features from './sections/Features'
import SenseScoreAct from './sections/SenseScoreAct'
import Ownership from './sections/Ownership'
import Placement from './sections/Placement'
// other artboards
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import GetApp from './sections/GetApp'
import ClosingCta from './sections/ClosingCta'
import NotFound from './sections/NotFound'

/**
 * Page 1 of the PDF, in the PDF's own order and with the PDF's own bands.
 *
 * The band map is sampled from the page edge of MoldGuard.pdf p1:
 *   hero #f7fbff · problem #fff · meet #eaf2fc · sense/score/act #fff
 *   features #eaf2fc · own-it #15385e · placement #fff · cta #15385e · footer #15385e
 *
 * Only page-1 sections belong here. `risk`, `what` and `capabilities` live on
 * PDF page 2 and appear on /features instead — splicing them into page 1 made
 * the home page 8,441px of a 6,053pt artboard (38% longer than the reference)
 * and broke the approved composition.
 *
 *   /            — page 1
 *   /features    — page 2: capabilities + comparison + what-it-does
 *   /how-it-works— page 3: the closed loop, sense/score/act, setup
 *   /contact     — page 4: contact + team
 *   /download    — page 5: get the app
 */
export default function App() {
  const [page, setPage] = useState<Location_>(() => pageFromLocation())

  // per-route title/description/canonical, applied on first paint and on change.
  // `main` already carries tabIndex={-1} for exactly this: without moving focus,
  // a route change leaves a keyboard/screen-reader user on the old page's markup
  // with no announcement that anything happened.
  //
  // Compare against the previous route, not a "have I run yet" flag. StrictMode
  // mounts this effect twice, so a flag was already false on the second run and
  // every clean load (including QA's) landed focus on `main` — making the first
  // Tab skip the skip link. A route comparison is idempotent, so the double
  // mount changes nothing.
  const lastPage = useRef(page)
  const routeFade = useRef<Animation | null>(null)
  // Layout effect, not effect: React has already swapped the route's markup but
  // the browser has not painted it yet, so the fade starts from opacity 0 and
  // the new page never flashes at full opacity for one frame.
  useLayoutEffect(() => {
    applyHead(page)
    if (lastPage.current === page) return
    lastPage.current = page
    const main = document.getElementById('main')
    main?.focus({ preventScroll: false })
    // Route change: fade the content in once, on the new markup, opacity only.
    // Never a transform on `main` — a transformed ancestor becomes the containing
    // block for fixed overlays and breaks their positioning. Cancel the previous
    // fade so a fast double-navigation cannot stack two effect layers, and skip
    // entirely under reduced motion (main keeps its CSS opacity of 1).
    routeFade.current?.cancel()
    if (!main || prefersReducedMotion()) return
    routeFade.current = main.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 220, easing: 'cubic-bezier(.22,1,.36,1)' },
    )
  }, [page])
  // A live reduced-motion flip must not strand a half-finished fade: cancel it
  // (cancel() leaves the element at opacity 1) the moment the preference lands.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => { if (mq.matches) routeFade.current?.cancel() }
    mq.addEventListener('change', on)
    return () => {
      mq.removeEventListener('change', on)
      routeFade.current?.cancel()
    }
  }, [])

  useEffect(() => {
    const sync = () => setPage(pageFromLocation())
    window.addEventListener('popstate', sync)
    window.addEventListener('routechange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('routechange', sync)
    }
  }, [])

  // One delegated handler makes every plain anchor to a known route a client-side
  // navigation, so the Footer/body links get the same fast fade as the Header
  // instead of a full document reload. Header links already call preventDefault
  // (defaultPrevented check skips them). Modified clicks, target/download,
  // external origins, mailto/tel and hash links keep native behaviour, and an
  // unknown path is not a route — it stays a real request and a real 404.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      const anchor = target instanceof Element ? target.closest('a[href]') : null
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return
      if (anchor.origin !== window.location.origin || anchor.hash) return
      const next = pageFor(anchor.pathname)
      if (!next) return
      event.preventDefault()
      navigate(next)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <ScrollProgress />
      <Header page={page} />
      <main id="main" tabIndex={-1}>
        {page === 'home' && (
          <>
            <Hero />
            <Problem />
            <Meet />
            <SenseScoreAct />
            <Features />
            <Ownership />
            <Placement />
            <ClosingCta />
          </>
        )}
        {page === 'features' && (
          <>
            <Capabilities />
            <Features />
            <WhatItDoes asHeading="h2" />
            <RiskShowcase />
            <Comparison />
            <PartsTrust />
            <ClosingCta />
          </>
        )}
        {page === 'how-it-works' && (
          <>
            <Loop />
            <Faq />
            <ClosingCta />
          </>
        )}
        {page === 'contact' && (
          <>
            <Contact />
            <Faq />
          </>
        )}
        {page === 'download' && (
          <>
            <GetApp />
            <ClosingCta onDownloadPage />
          </>
        )}
        {page === 'not-found' && <NotFound />}
      </main>
      <Footer />
    </>
  )
}
