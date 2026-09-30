import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Briefcase, FolderKanban, House, Layers, Mail } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useSlideDeck } from './SlideDeck'

// Each nav item "owns" one or more section / slide ids, so the right item is
// highlighted even while you read a part that has no own nav button.
const NAV_ITEMS = [
  { labelKey: 'navHome', href: '#home', icon: House, sections: ['home', 'about', 'education', 'education-2'] },
  { labelKey: 'navExperience', href: '#experience', icon: Briefcase, sections: ['experience'] },
  { labelKey: 'navProjects', href: '#projects', icon: FolderKanban, sections: ['projects', 'projects-2', 'projects-3'] },
  { labelKey: 'navSkills', href: '#skills', icon: Layers, sections: ['skills', 'skills-2', 'skills-3', 'languages', 'beyond', 'why'] },
  { labelKey: 'navContact', href: '#contact', icon: Mail, sections: ['contact'] },
]

/**
 * A small floating "command bar" at the bottom of the screen.
 *
 * Which item is active?
 *  - slide mode: simply the active slide (from the SlideDeck)
 *  - scrolling page: one IntersectionObserver watches all sections. The
 *    rootMargin shrinks the "viewport" to a thin line around the middle of
 *    the screen, so exactly one section counts as visible at a time.
 */
export default function FloatingNav() {
  const { t } = useLanguage()
  const deck = useSlideDeck()
  const [observedSection, setObservedSection] = useState('home')

  useEffect(() => {
    if (deck.isDeck) return
    const sectionElements = NAV_ITEMS.flatMap((item) => item.sections)
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setObservedSection(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    sectionElements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [deck.isDeck])

  const activeSection = deck.isDeck ? deck.activeId : observedSection

  // Hidden on the home screen: there the prompt bar is the main control.
  const isVisible = activeSection !== 'home'

  // In slide mode a click fades to that slide instead of jumping to an anchor
  function handleClick(event, href) {
    if (!deck.isDeck) return
    event.preventDefault()
    deck.goTo(href.slice(1))
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          key="floating-nav"
          aria-label={t('navLabel')}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6"
        >
          <ul className="flex items-center gap-0.5 rounded-full border border-line bg-surface p-1 shadow-lift sm:bg-surface/90 sm:backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = item.sections.includes(activeSection)
              return (
                <li key={item.href} className="relative">
                  {/* The pill slides between items: Framer Motion animates any
                      element with the same `layoutId` from its old to its new place. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <a
                    href={item.href}
                    onClick={(event) => handleClick(event, item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200 ${
                      isActive ? 'text-canvas' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {/* Labels hide on very small screens; icons stay, with an accessible name */}
                    <span className="sr-only sm:not-sr-only">{t(item.labelKey)}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
