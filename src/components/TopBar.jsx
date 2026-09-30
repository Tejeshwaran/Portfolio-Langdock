import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Moon, PanelLeft, Share, SquarePen, Sun } from 'lucide-react'
import HackerLogo from './HackerLogo'
import { LanguageToggle } from './AIHeader'
import { getChatTitle, useHomeChat } from './HomeChat'
import { slideTitle } from './appNav'
import { useSlideDeck } from './SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'
import { requestAsk } from '../utils/askEvents'

const iconButton =
  'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink'

/** Sun / moon: switches between the dark and the light look */
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isDark = theme === 'dark'

  return (
    <button type="button" onClick={toggleTheme} aria-label={isDark ? t('switchToLight') : t('switchToDark')} className={iconButton}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

/** Copies the portfolio's link, then shows "Link copied" for two seconds */
function ShareButton() {
  const { t } = useLanguage()
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function copyLink() {
    // The clean address, without test parameters like ?intro=0
    const url = window.location.origin + window.location.pathname
    try {
      await navigator.clipboard.writeText(url)
      setIsCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. an old browser): nothing to show
    }
  }

  return (
    <button type="button" onClick={copyLink} aria-label={isCopied ? t('linkCopied') : t('shareLink')} className={iconButton}>
      {isCopied ? <Check size={18} aria-hidden="true" className="text-success" /> : <Share size={18} aria-hidden="true" />}
      <AnimatePresence>
        {isCopied && (
          <motion.span
            role="status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full z-50 mt-1.5 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-canvas shadow-lift"
          >
            {t('linkCopied')}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/**
 * TopBar — the thin bar above the chat area:
 *
 *   [☰] [✎]  Title of what you are looking at        EN|DE  ☀  ⇪
 *
 *  - ☰ opens the sidebar (only when it is hidden: phones, or collapsed)
 *  - ✎ "New chat" (only on phones while the home chat has messages)
 *  - the title is the slide's topic, or the chat's first question at home
 *  - EN|DE asks the home chat to switch the language (types the question)
 *  - ☀/☾ dark / light look, ⇪ copies the portfolio link
 */
export default function TopBar({ isSidebarVisible, onOpenSidebar }) {
  const deck = useSlideDeck()
  const chat = useHomeChat()
  const { data, language, t } = useLanguage()
  const chatTitle = getChatTitle(chat.messages)
  const title = slideTitle(deck.activeId, { data, t, chatTitle })
  const isChatting = chat.messages.length > 0 || chat.isThinking

  function askToSwitchLanguage() {
    const { toGerman, toEnglish } = data.askPortfolio.languageQuestions
    requestAsk(language === 'en' ? toGerman : toEnglish)
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-1 px-2 sm:px-3">
      {!isSidebarVisible && (
        <button type="button" onClick={onOpenSidebar} aria-label={t('openSidebar')} className={iconButton}>
          <PanelLeft size={18} aria-hidden="true" />
        </button>
      )}
      {!isSidebarVisible && deck.activeId === 'home' && isChatting && (
        <button type="button" onClick={chat.reset} aria-label={t('newChat')} className={iconButton}>
          <SquarePen size={18} aria-hidden="true" />
        </button>
      )}

      <div className="min-w-0 flex-1 px-1.5">
        <AnimatePresence mode="wait" initial={false}>
          {title ? (
            <motion.p
              key={title}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="truncate text-[15px] font-medium text-ink"
            >
              {title}
            </motion.p>
          ) : (
            // Nothing to name yet (fresh home screen): show the logo when the sidebar is hidden
            !isSidebarVisible && (
              <motion.span
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-w-0 items-center gap-2"
              >
                <HackerLogo className="h-7 w-7 shrink-0" />
                <span aria-hidden="true" className="truncate font-mono text-[14px] text-ink">
                  {data.personal.firstName.toLowerCase()}
                  <span className="animate-blink text-accent">_</span>
                </span>
              </motion.span>
            )
          )}
        </AnimatePresence>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <div className="mr-1">
          <LanguageToggle onClick={askToSwitchLanguage} placement="topbar" />
        </div>
        <ThemeToggle />
        <ShareButton />
      </div>
    </header>
  )
}
