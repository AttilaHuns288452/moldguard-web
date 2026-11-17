import Header from './components/Header'
import Hero from './sections/Hero'
import Problem from './sections/Problem'
import Loop from './sections/Loop'
import RiskIndex from './sections/RiskIndex'
import Features from './sections/Features'
import AppShowcase from './sections/AppShowcase'
import Ownership from './sections/Ownership'
import Team from './sections/Team'
import Faq from './sections/Faq'
import Contact from './sections/Contact'
import ClosingCta from './sections/ClosingCta'
import Footer from './sections/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Loop />
        <RiskIndex />
        <Features />
        <AppShowcase />
        <Ownership />
        <Team />
        <Faq />
        <Contact />
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}
