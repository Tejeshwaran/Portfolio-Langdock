import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Linkedin, Mail, Menu, X } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { requestAsk } from '../utils/askEvents'
import { useSlideDeck } from './SlideDeck'
import HackerLogo from './HackerLogo'

const itemClasses = 'inline-flex items-center gap-2 rounded-full py-2 text-sm transition-colors'
const plainClasses = 'px-3 text-body hover:bg-subtle hover:text-ink'
// The main button is a black pill (like a "Get started" button)
const primaryClasses = 'bg-ink px-4 font-medium text-canvas hover:bg-ink/85'

/**
 * One item on the right side of the header.
 *  - item.onSelect → a button that asks the home chat (Contact)
 *  - item.href     → a normal link (LinkedIn)
 */
function HeaderItem({ item, onClick, className = '', isPrimary = false }) {
  const { t } = useLanguage()
  const Icon = item.icon

  if (item.onSelect) {
    return (
      <button
        type="button"
        onClick={() => {
          onClick?.()
          item.onSelect()
        }}
        className={`${itemClasses} ${isPrimary ? primaryClasses : plainClasses} ${className}`}
      >
        <Icon size={16} aria-hidden="true" />
        {item.label}
      </button>
    )
  }

  return (
    <a
      href={item.href}
      onClick={onClick}
      target="_blank"
      rel="noopener noreferrer"
      className={`${itemClasses} ${isPrimary ? primaryClasses : plainClasses} ${className}`}
    >
      <Icon size={16} aria-hidden="true" />
      {item.label}
      <span className="sr-only">{t('opensInNewTab')}</span>
    </a>
  )
}

/**
 * EN | DE switch. Clicking it does not switch right away: it asks the home
 * chat ("Change the entire website to German"), which types the request,
 * answers, and then switches the language (see usePortfolioChat.js).
 * The dark pill slides to the active language with a shared `layoutId`.
 */
export function LanguageToggle({ onClick, placement }) {
  const { language, t } = useLanguage()

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('changeLanguage')}
      className="flex items-center rounded-full border border-line bg-surface p-0.5 font-mono text-[11px] font-medium transition-colors hover:border-line-strong"
    >
      {['en', 'de'].map((code) => (
        <span
          key={code}
          className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
            language === code ? 'text-canvas' : 'text-muted'
          }`}
        >
          {language === code && (
            <motion.span
              layoutId={`language-pill-${placement}`}
              className="absolute inset-0 -z-10 rounded-full bg-ink"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          {code}
        </span>
      ))}
    </button>
  )
}

/** Sticky top bar: logo + name on the left, Contact / language on the right. */
export default function AIHeader() {
  const { data, language, t } = useLanguage()
  const { personal, askPortfolio } = data
  const deck = useSlideDeck()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Contact doesn't open anything directly: it types a question
  // into the "Ask anything" bar and send it (requestAsk → Hero.jsx).
  // LinkedIn stays a normal link and is hidden while its URL is empty.
  const headerItems = [
    { label: t('linkedin'), icon: Linkedin, href: personal.linkedin },
    { label: t('contact'), icon: Mail, onSelect: () => requestAsk(askPortfolio.contactQuestion) },
  ].filter((item) => item.href || item.onSelect)

  function askToSwitchLanguage() {
    const { toGerman, toEnglish } = askPortfolio.languageQuestions
    requestAsk(language === 'en' ? toGerman : toEnglish)
  }

  // Show the bottom border only after scrolling, so the home screen
  // stays one clean surface.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = (event) => event.key === 'Escape' && setIsMenuOpen(false)
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-canvas transition-colors duration-300 sm:bg-canvas/80 sm:backdrop-blur-md ${
        isScrolled || isMenuOpen ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a
          href="#home"
          onClick={(event) => {
            if (!deck.isDeck) return
            event.preventDefault()
            deck.goTo('home')
          }}
          className="flex items-center gap-3"
          aria-label={t('backToStart', personal.firstName)}
        >
          {/* The dotted hacker logo, then the terminal-style name with a blinking cursor */}
          <span className="flex items-center gap-2">
            <HackerLogo className="h-9 w-9 shrink-0" />
            <span aria-hidden="true" className="font-mono text-[15px] text-ink">
              {personal.firstName.toLowerCase()}
              <span className="animate-blink text-accent">_</span>
            </span>
          </span>
          {/* Hidden on phones, where the EN | DE switch needs the space */}
          <span className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            {t('aiPortfolio')}
          </span>
        </a>

        {/* Desktop / tablet */}
        <nav aria-label={t('profilesAndContact')} className="hidden items-center gap-1 sm:flex">
          {headerItems.map((item) => (
            <HeaderItem key={item.label} item={item} isPrimary={Boolean(item.onSelect)} />
          ))}
          <div className="ml-2">
            <LanguageToggle onClick={askToSwitchLanguage} placement="desktop" />
          </div>
        </nav>

        {/* Mobile: language switch stays visible, the rest goes in the menu */}
        <div className="flex items-center gap-2 sm:hidden">
          <LanguageToggle onClick={askToSwitchLanguage} placement="mobile" />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-subtle"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label={t('profilesAndContact')}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-canvas px-4 py-2 sm:hidden"
          >
            {headerItems.map((item) => (
              <HeaderItem
                key={item.label}
                item={item}
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-3"
              />
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
