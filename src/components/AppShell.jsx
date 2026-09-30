import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './Sidebar'
import SlideComposer from './SlideComposer'
import TopBar from './TopBar'
import { SlideStage, useSlideDeck } from './SlideDeck'
import useMediaQuery from '../hooks/useMediaQuery'
import { useLanguage } from '../i18n/LanguageContext'

const SIDEBAR_WIDTH = 260

/**
 * AppShell — the page frame, laid out like an AI workspace app:
 *
 *   ┌──────────┬──────────────────────────────────────┐
 *   │ Sidebar  │ TopBar (title · EN|DE · ☀ · share)   │
 *   │          ├──────────────────────────────────────┤
 *   │          │ the slides (scroll = next slide)     │
 *   │          │                                      │
 *   │          │ [ prompt box ]  (not on home)        │
 *   └──────────┴──────────────────────────────────────┘
 *
 * Computers (≥ 1024px): the sidebar is a column that can be collapsed
 * (its width animates to 0). Phones and tablets: it is a drawer that
 * slides in over the page, with a dark backdrop.
 *
 * `data-deck-ignore` tells the slide deck to leave wheel and swipe
 * gestures on the sidebar alone, so its list can scroll normally.
 */
export default function AppShell() {
  const deck = useSlideDeck()
  const { t } = useLanguage()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // computers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false) // phones / tablets
  const drawerRef = useRef(null)

  // Which slides have been seen (for the progress card in the sidebar)
  const [visited, setVisited] = useState(() => new Set([0]))
  useEffect(() => {
    setVisited((seen) => (seen.has(deck.activeIndex) ? seen : new Set(seen).add(deck.activeIndex)))
  }, [deck.activeIndex])

  // Growing into a computer-sized window closes the phone drawer
  useEffect(() => {
    if (isDesktop) setIsDrawerOpen(false)
  }, [isDesktop])

  // Drawer: move keyboard focus into it, and close it with Escape
  useEffect(() => {
    if (!isDrawerOpen) return
    drawerRef.current?.focus()
    const handleKeyDown = (event) => event.key === 'Escape' && setIsDrawerOpen(false)
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDrawerOpen])

  const isSidebarVisible = isDesktop && isSidebarOpen

  function openSidebar() {
    if (isDesktop) setIsSidebarOpen(true)
    else setIsDrawerOpen(true)
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        {t('skipToContent')}
      </a>

      {/* Computers: a column that collapses to zero width */}
      <AnimatePresence initial={false}>
        {isSidebarVisible && (
          <motion.aside
            key="sidebar"
            data-deck-ignore=""
            initial={{ width: 0 }}
            animate={{ width: SIDEBAR_WIDTH }}
            exit={{ width: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="shrink-0 overflow-hidden border-r border-line bg-sidebar"
          >
            <div className="h-full" style={{ width: SIDEBAR_WIDTH }}>
              <Sidebar visited={visited} onClose={() => setIsSidebarOpen(false)} />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Phones / tablets: a drawer over the page */}
      <AnimatePresence>
        {!isDesktop && isDrawerOpen && (
          <>
            <motion.div
              key="backdrop"
              data-deck-ignore=""
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.aside
              key="drawer"
              ref={drawerRef}
              data-deck-ignore=""
              role="dialog"
              aria-modal="true"
              aria-label={t('sidebarLabel')}
              tabIndex={-1}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] border-r border-line bg-sidebar shadow-lift focus:outline-none"
            >
              <Sidebar
                visited={visited}
                isDrawer
                onClose={() => setIsDrawerOpen(false)}
                onNavigate={() => setIsDrawerOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* The chat area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar isSidebarVisible={isSidebarVisible} onOpenSidebar={openSidebar} />
        {/* tabIndex -1 lets "Skip to content" move focus here */}
        <main id="main" tabIndex={-1} className="relative min-h-0 flex-1 focus:outline-none">
          <SlideStage />
          <SlideComposer />
        </main>
      </div>
    </div>
  )
}
