import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import AIHeader from './components/AIHeader'
import AppShell from './components/AppShell'
import EdgeFade from './components/EdgeFade'
import FloatingNav from './components/FloatingNav'
import { HomeChatProvider } from './components/HomeChat'
import ScrollProgress from './components/ScrollProgress'
import { SlideDeckProvider } from './components/SlideDeck'
import { isSlideMode } from './config/scrollEffect'
import { shouldShowOnboarding } from './config/onboarding'
import Onboarding from './onboarding/Onboarding'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import Hero from './sections/Hero'
import About from './sections/About'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Languages from './sections/Languages'
import BeyondWork from './sections/BeyondWork'
import WhyLangdock from './sections/WhyLangdock'
import Footer from './sections/Footer'

/**
 * The page is one long "conversation". Each part is a question/answer
 * pair that plays when it appears (see ConversationBlock.jsx).
 *
 * Two ways to show it (config/scrollEffect.js):
 *  - slide mode (default): an AI-workspace layout (AppShell.jsx) — sidebar,
 *    top bar and a chat area where every part is a slide; scrolling fades
 *    from one slide to the next (SlideDeck.jsx). Each degree, project and
 *    skill group gets its own slide.
 *  - scrolling page: all parts below each other, like a normal website.
 *
 * Before the portfolio, every visit starts with a short intro
 * (onboarding/Onboarding.jsx, switched on/off in config/onboarding.js).
 *
 * <MotionConfig reducedMotion="user"> tells Framer Motion to respect the
 * visitor's "reduce motion" system setting: movement (x/y/scale) is turned
 * off and only opacity fades remain.
 */
function Page() {
  const { data, t } = useLanguage()
  const [isIntroOpen, setIsIntroOpen] = useState(shouldShowOnboarding)

  // The intro is shown again on every page load (config/onboarding.js)
  function finishIntro() {
    setIsIntroOpen(false)
  }

  const slides = [
    { id: 'home', element: <Hero />, fullBleed: true },
    { id: 'about', element: <About /> },
    // One slide per degree: Master's first, then Bachelor's
    ...data.education.map((degree, index) => ({
      id: index === 0 ? 'education' : `education-${index + 1}`,
      element: <Education educationIndex={index} />,
    })),
    { id: 'experience', element: <Experience /> },
    ...data.projects.map((project, index) => ({
      id: index === 0 ? 'projects' : `projects-${index + 1}`,
      element: <Projects projectIndex={index} />,
    })),
    // One slide per skill group
    ...data.skills.map((group, index) => ({
      id: index === 0 ? 'skills' : `skills-${index + 1}`,
      element: <Skills skillIndex={index} />,
    })),
    { id: 'languages', element: <Languages />, wide: true },
    { id: 'beyond', element: <BeyondWork /> },
    { id: 'why', element: <WhyLangdock />, wide: true },
    { id: 'contact', element: <Footer /> },
  ]

  // The older "normal scrolling website" version (?scroll=classic or fade)
  const scrollingPage = (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        {t('skipToContent')}
      </a>

      <ScrollProgress />
      <AIHeader />

      {/* tabIndex -1 lets "Skip to content" move focus here */}
      <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-4 focus:outline-none sm:px-6">
        <Hero />
        <About />
        <Education />
        <Experience />
        <Projects />
        <Skills />
        <Languages />
        <BeyondWork />
        <WhyLangdock />
        <Footer />
      </main>

      <EdgeFade />
      <FloatingNav />
    </>
  )

  return (
    <MotionConfig reducedMotion="user">
      {/* mode="wait": the intro fades out completely, then the portfolio
          starts (so its home screen animates in fresh, and the intro's
          wheel / key handling never reaches the slides underneath). */}
      <AnimatePresence mode="wait">
        {isIntroOpen ? (
          <Onboarding key="intro" onFinish={finishIntro} />
        ) : (
          <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* One shared home chat for the home screen, sidebar and top bar */}
            <HomeChatProvider>
              {isSlideMode ? (
                <SlideDeckProvider slides={slides}>
                  <AppShell />
                </SlideDeckProvider>
              ) : (
                scrollingPage
              )}
            </HomeChatProvider>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}

/**
 * ThemeProvider: dark / light look. LanguageProvider: English / German.
 * Both are available to every component below them.
 */
export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Page />
      </LanguageProvider>
    </ThemeProvider>
  )
}
