import { useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './sections/Footer'
import { ScrollProgress } from './components/ui'
import { pageFromLocation, type Page } from './lib/route'

// page 1 of the PDF
import Hero from './sections/Hero'
import Credibility from './sections/Credibility'
import Problem from './sections/Problem'
import Meet from './sections/Meet'
import RiskShowcase from './sections/RiskShowcase'
// page 2
import SenseScoreAct from './sections/SenseScoreAct'
// page 3 (how it works)
import Features from './sections/Features'
import Ownership from './sections/Ownership'
import Placement from './sections/Placement'
// other artboards
import Offer from './sections/Offer'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import GetApp from './sections/GetApp'
import ClosingCta from './sections/ClosingCta'

/**
 * Five pages, matching the five artboards in MoldGuard.pdf:
 *   /            — page 1: hero, problem, meet, the loop, features, own-it, placement
 *   /features    — page 2: capabilities + comparison
 *   /how-it-works— page 3: the closed loop, sense/score/act
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
            <Credibility />
            <Problem />
            <Meet />
            <RiskShowcase />
            <Features />
            <Ownership />
            <Placement />
            <ClosingCta />
          </>
        )}
        {page === 'features' && (
          <>
            <Features />
            <SenseScoreAct />
            <Placement />
            <ClosingCta />
          </>
        )}
        {page === 'how-it-works' && (
          <>
            <SenseScoreAct />
            <Meet />
            <RiskShowcase />
            <Ownership />
            <Offer />
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
            <Offer />
            <ClosingCta />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
