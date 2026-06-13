import { useState, useCallback, useEffect } from 'react'
import useKonamiCode from './hooks/useKonamiCode'
import useKeyboardNav from './hooks/useKeyboardNav'
import Loading from './components/Loading/Loading'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Featured from './components/Featured/Featured'
import Projects from './components/Projects/Projects'
import Skills from './components/Skills/Skills'
import Playground from './components/Playground/Playground'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'

function KonamiOverlay({ show }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      pointerEvents: 'none',
      animation: 'konamiFade 5s forwards',
    }}>
      <div style={{
        fontFamily: "'Press Start 2P'",
        fontSize: 'clamp(1rem, 3vw, 2rem)',
        color: '#BAFFC9',
        textAlign: 'center',
        textShadow: '0 0 20px #BAFFC9, 0 0 40px #BAFFC9',
        animation: 'konamiPulse 0.5s ease-in-out 3',
      }}>
        ↑↑↓↓←→←→BA<br/>
        <span style={{ fontSize: '0.6em', color: '#FFB3BA' }}>KONAMI CODE ACTIVATED</span>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`scrollTop ${visible ? 'visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  )
}

function SectionDivider() {
  return (
    <div className="sectionDivider" aria-hidden="true">
      <span /><span /><span /><span /><span />
    </div>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(() => {
    return sessionStorage.getItem('portfolio-loaded') === 'true'
  })
  const konamiActive = useKonamiCode()
  useKeyboardNav()

  const handleLoadComplete = useCallback(() => {
    sessionStorage.setItem('portfolio-loaded', 'true')
    setLoaded(true)
  }, [])

  return (
    <>
      {!loaded && <Loading onComplete={handleLoadComplete} />}
      <ScrollProgress />
      <KonamiOverlay show={konamiActive} />
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Featured />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Playground />
        <SectionDivider />
        <Contact />
        <Footer />
      </div>
    </>
  )
}
