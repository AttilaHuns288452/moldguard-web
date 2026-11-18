import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './sections/Footer'
import { ScrollProgress } from './components/ui'
import { pageFromLocation, type Page } from './lib/route'

// page 1 of the PDF
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Meet from './sections/Meet'
import Loop from './sections/Loop'
import Capabilities from './sections/Capabilities'
import RiskShowcase from './sections/RiskShowcase'
import WhatItDoes from './sections/WhatItDoes'
// page 2
import SenseScoreAct from './sections/SenseScoreAct'
// page 3 (how it works)
import Features from './sections/Features'
import Ownership from './sections/Ownership'
import Placement from './sections/Placement'
// other artboards
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import GetApp from './sections/GetApp'
import ClosingCta from './sections/ClosingCta'

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
  const [page, setPage] = useState<Page>(() => pageFromLocation())

  useEffect(() => {
    const sync = () => setPage(pageFromLocation())
    window.addEventListener('popstate', sync)
    window.addEventListener('routechange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('routechange', sync)
    }
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
            <WhatItDoes />
            <RiskShowcase />
            <SenseScoreAct />
            <Placement />
            <ClosingCta />
          </>
        )}
        {page === 'how-it-works' && (
          <>
            <Loop />
            <SenseScoreAct />
            <Meet />
            <RiskShowcase />
            <Ownership />
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
            <ClosingCta />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
