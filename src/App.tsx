import Header from './components/Header'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Meet from './sections/Meet'
import SenseScoreAct from './sections/SenseScoreAct'
import Features from './sections/Features'
import Ownership from './sections/Ownership'
import Placement from './sections/Placement'
import Contact from './sections/Contact'
import ClosingCta from './sections/ClosingCta'
import Footer from './sections/Footer'
import { ScrollProgress } from './components/ui'

/**
 * Section order ported from the approved promo site:
 * hero · problem · meet · sense/score/act · features · own-it · placement · CTA
 */
export default function App() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Meet />
        <SenseScoreAct />
        <Features />
        <Ownership />
        <Placement />
        <Contact />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
