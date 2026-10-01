import { Suspense, lazy, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import AppShell from './components/AppShell'
import { HomeChatProvider } from './components/HomeChat'
import { SlideDeckProvider } from './components/SlideDeck'
import { groupSlideId } from './components/appNav'
import { shouldShowOnboarding } from './config/onboarding'
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

// The intro pages are switched off by default (config/onboarding.js), so
// they are only downloaded when they are switched on.
const Onboarding = lazy(() => import('./onboarding/Onboarding'))

/**
 * The page is one "conversation" in an AI-workspace layout (AppShell.jsx):
 * sidebar, top bar and a chat area where every part is a slide. Scrolling
 * fades from one slide to the next (SlideDeck.jsx).
 *
 * The order follows what a recruiter for the AI Associate program wants to
 * know first: who → AI journey (curiosity, learning, approach) → what he
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
      {/* mode="wait": the intro fades out completely, then the portfolio starts */}
      <AnimatePresence mode="wait">
        {isIntroOpen ? (
          <Suspense key="intro" fallback={null}>
            <Onboarding onFinish={() => setIsIntroOpen(false)} />
          </Suspense>
        ) : (
          <motion.div key="portfolio" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* One shared home chat for the home screen, sidebar and top bar */}
            <HomeChatProvider>
              <SlideDeckProvider slides={slides}>
                <AppShell />
              </SlideDeckProvider>
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
