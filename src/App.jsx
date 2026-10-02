import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import AppShell from './components/AppShell'
import { HomeChatProvider } from './components/HomeChat'
import { SlideDeckProvider } from './components/SlideDeck'
import { groupSlideId } from './components/appNav'
import { ONBOARDING_ENABLED, shouldShowOnboarding } from './config/onboarding'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { ThemeProvider } from './theme/ThemeContext'
import Hero from './sections/Hero'
import About from './sections/About'
import AiJourney, { JOURNEY_PART_COUNT } from './sections/AiJourney'
import Education from './sections/Education'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Languages from './sections/Languages'
import BeyondWork from './sections/BeyondWork'
import WhyLangdock from './sections/WhyLangdock'
import Footer from './sections/Footer'

// The welcome page is its own small download (config/onboarding.js can
// switch it off completely).
const Onboarding = lazy(() => import('./onboarding/Onboarding'))

/**
 * The page is one "conversation" in an AI-workspace layout (AppShell.jsx):
 * sidebar, top bar and a chat area where every part is a slide. Scrolling
 * fades from one slide to the next (SlideDeck.jsx).
 *
 * The order follows what a recruiter for the AI Associate program wants to
 * know first: who → AI journey (learning, approach) → what he
 * built → experience → skills → education → why the program → languages →
 * beyond IT → contact.
 *
 * <MotionConfig reducedMotion="user"> tells Framer Motion to respect the
 * visitor's "reduce motion" system setting: movement (x/y/scale) is turned
 * off and only opacity fades remain.
 */
function Page() {
  const { data } = useLanguage()
  const [isIntroOpen, setIsIntroOpen] = useState(shouldShowOnboarding)
  // true once the visitor has gone from the welcome page to the chat —
  // then the welcome page comes back from above when they scroll up
  const [hasLeftIntro, setHasLeftIntro] = useState(false)

  function closeIntro() {
    setIsIntroOpen(false)
    setHasLeftIntro(true)
  }

  // Back from the welcome page: keyboard focus moves to the chat area
  useEffect(() => {
    if (!isIntroOpen && hasLeftIntro) document.getElementById('main')?.focus({ preventScroll: true })
  }, [isIntroOpen, hasLeftIntro])

  const slides = [
    { id: 'home', element: <Hero />, fullBleed: true },
    { id: 'about', element: <About /> },
    ...Array.from({ length: JOURNEY_PART_COUNT }, (_, index) => ({
      id: groupSlideId('journey', index),
      element: <AiJourney partIndex={index} />,
    })),
    // One slide per project, degree and skill group
    ...data.projects.map((project, index) => ({
      id: groupSlideId('projects', index),
      element: <Projects projectIndex={index} />,
    })),
    { id: 'experience', element: <Experience /> },
    ...data.skills.map((group, index) => ({
      id: groupSlideId('skills', index),
      element: <Skills skillIndex={index} />,
    })),
    ...data.education.map((degree, index) => ({
      id: groupSlideId('education', index),
      element: <Education educationIndex={index} />,
    })),
    { id: 'why', element: <WhyLangdock />, wide: true },
    { id: 'languages', element: <Languages />, wide: true },
    { id: 'beyond', element: <BeyondWork /> },
    { id: 'contact', element: <Footer /> },
  ]

  return (
    <MotionConfig reducedMotion="user">
      {/* The portfolio is always there. While the welcome page lies on top
          of it, it is hidden and can't be clicked or focused (inert) — and
          the chat and the current slide are kept for when the visitor
          comes back down. */}
      {/* Like the slides: the old page fades out first, then the new one fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={
          isIntroOpen
            ? { opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } }
            : { opacity: 1, transition: { duration: 0.5, delay: 0.25 } }
        }
        aria-hidden={isIntroOpen || undefined}
        {...(isIntroOpen ? { inert: '' } : {})}
      >
        {/* One shared home chat for the home screen, sidebar and top bar */}
        <HomeChatProvider>
          {/* Scrolling up on the first slide opens the welcome page again */}
          <SlideDeckProvider
            slides={slides}
            paused={isIntroOpen}
            onBeforeStart={ONBOARDING_ENABLED ? () => setIsIntroOpen(true) : undefined}
          >
            <AppShell />
          </SlideDeckProvider>
        </HomeChatProvider>
      </motion.div>

      {/* The welcome page: scroll down = it moves up and away, scroll up on
          the chat's first slide = it comes back down */}
      <AnimatePresence>
        {isIntroOpen && (
          <Suspense key="intro" fallback={null}>
            <Onboarding fromAbove={hasLeftIntro} onFinish={closeIntro} />
          </Suspense>
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
