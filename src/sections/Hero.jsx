import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Layers } from 'lucide-react'
import ChatThread from '../components/ChatThread'
import ComposerExtras from '../components/ComposerExtras'
import PromptComposer, { TOPIC_ICONS } from '../components/PromptComposer'
import { useHomeChat } from '../components/HomeChat'
import { onAskRequest, onLanguageSwitch } from '../utils/askEvents'
import useScrollFade from '../hooks/useScrollFade'
import { useSlideDeck } from '../components/SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'

// The heading appears word by word, like text being generated.
// The parent staggers its children; each word fades and rises a little.
const headingContainer = { hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }
const headingWord = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * Scroll to the top of the page and resolve once we are there
 * (or after 1.5 s at the latest, so nothing can get stuck).
 */
function scrollToTop(reduceMotion) {
  return new Promise((resolve) => {
    if (window.scrollY < 4) return resolve()
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    const startedAt = performance.now()
    function check() {
      if (window.scrollY < 4) return resolve()
      if (performance.now() - startedAt > 1500) {
        // Smooth scrolling was interrupted: jump the rest of the way
        window.scrollTo({ top: 0, behavior: 'instant' })
        return resolve()
      }
      requestAnimationFrame(check)
    }
    requestAnimationFrame(check)
  })
}

/**
 * The home screen — an LLM start page.
 *
 * Two states:
 *  1. Empty: the heading, the prompt bar in the middle, suggestion chips.
 *  2. Chat:  after the first question, the thread fills the screen and the
 *            prompt bar moves to the bottom.
 *
 * The move is animated by Framer Motion's `layout` prop: when the prompt
 * bar's position changes between renders, Framer Motion measures the old and
 * new position and slides it smoothly (using transforms, so it stays fast).
 *
 * Other parts of the page can ask a question here with requestAsk()
 * (see utils/askEvents.js). The Contact and EN|DE buttons do that: the deck
 * fades back here, the question is typed into the box letter by letter, and
 * sent. Questions typed in the prompt box of another slide arrive with
 * { instant: true } and are sent straight away.
 *
 * The chat itself is shared (components/HomeChat.jsx), so the sidebar and
 * the top bar can show it too.
 */
export default function Hero() {
  const { data, t } = useLanguage()
  const { hero } = data.conversation
  const { topics, contactQuestion } = data.askPortfolio
  const headingWords = hero.heading.split(' ')
  const chat = useHomeChat()
  const chatRef = useRef(chat)
  chatRef.current = chat
  const composerRef = useRef(null)
  const threadRef = useRef(null)
  const heroRef = useRef(null)
  const heroFade = useScrollFade(heroRef)
  const deck = useSlideDeck()
  const deckRef = useRef(deck)
  deckRef.current = deck
  const reduceMotion = useReducedMotion()
  const isChatting = chat.messages.length > 0 || chat.isThinking

  // Keep the newest message visible inside the thread (not the whole page)
  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
  }, [chat.messages, chat.isThinking, chat.liveThoughts])

  // Keyboard shortcut: press "/" anywhere to jump into the prompt box
  // (on the other slides, SlideComposer.jsx handles "/" for its own box)
  useEffect(() => {
    function handleKeyDown(event) {
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      const isHomeShown = !deckRef.current.isDeck || deckRef.current.activeId === 'home'
      if (event.key === '/' && !isTyping && isHomeShown) {
        event.preventDefault()
        composerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Questions sent from elsewhere (e.g. the header's "Contact" button)
  useEffect(
    () =>
      onAskRequest(async (question, options = {}) => {
        // Slide mode: fade back to the home slide. Scrolling page: scroll up.
        if (deckRef.current.isDeck) await deckRef.current.goTo('home')
        else await scrollToTop(reduceMotion)
        if (options.instant) chatRef.current.ask(question, { speak: options.speak })
        else composerRef.current?.typeAndSubmit(question)
      }),
    [reduceMotion],
  )

  // After a language switch (from any chat on the page): clear this chat, so
  // the headline appears again in the new language, and go back to the home
  // screen — the first thing the visitor sees is the translated start page.
  useEffect(
    () =>
      onLanguageSwitch(() => {
        chatRef.current.reset()
        if (deckRef.current.isDeck) deckRef.current.goTo('home')
        else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
      }),
    [reduceMotion],
  )

  function handleSubmit(question, { fromVoice }) {
    chat.ask(question, { speak: fromVoice })
  }

  return (
    <motion.section
      ref={heroRef}
      style={heroFade}
      id="home"
      aria-label={t('heroLabel')}
      // In the app layout the home slide fills the chat area below the top bar
      className={`relative flex flex-col ${deck.isDeck ? 'h-full min-h-[420px]' : 'h-[calc(100svh-4rem)] min-h-[540px]'}`}
    >
      {/* Top area: empty space (state 1) or the chat thread (state 2) */}
      {isChatting ? (
        // ("New chat" lives in the sidebar, and in the top bar on phones)
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div ref={threadRef} className="min-h-0 flex-1 overflow-y-auto pb-6 pt-4">
            <ChatThread
              messages={chat.messages}
              isThinking={chat.isThinking}
              liveThoughts={chat.liveThoughts}
              thinkMode={chat.thinkMode}
            />
          </div>
        </div>
      ) : (
        <div className="flex-[0.8]" />
      )}

      {/* The heading only exists in the empty state */}
      <AnimatePresence initial={false}>
        {!isChatting && (
          <motion.div
            key={hero.heading}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            variants={headingContainer}
            initial="hidden"
            animate="shown"
            className="mb-7 text-center"
          >
            {/* Status pill at the top, like the "Trial … Upgrade" pill in AI apps */}
            <motion.div
              variants={headingWord}
              className="mb-8 inline-flex items-center gap-3 rounded-full bg-surface px-4 py-2 text-[13.5px] text-body sm:mb-10"
            >
              {data.onboarding.badge}
              <button
                type="button"
                onClick={() => composerRef.current?.typeAndSubmit(contactQuestion)}
                className="font-medium text-accent transition-colors hover:text-accent-strong"
              >
                {t('contact')}
              </button>
            </motion.div>
            <h1 className="text-balance font-display text-[28px] font-medium leading-[1.15] tracking-[-0.025em] text-ink sm:text-[34px]">
              {headingWords.map((word, index) => (
                <motion.span key={`${word}-${index}`} variants={headingWord} className="inline-block">
                  {word}
                  {index < headingWords.length - 1 && ' '}
                </motion.span>
              ))}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The prompt box. `layout` animates its move from the middle to the bottom. */}
      {/* On the start page the box sits in a wider panel with a small bar
          underneath (projects folder · connect); in a chat only the box stays. */}
      <motion.div layout="position" transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
        <div
          className={`rounded-[20px] border transition-colors duration-300 ${
            isChatting || !deck.isDeck ? 'border-transparent' : 'border-line bg-surface'
          }`}
        >
          <PromptComposer
            ref={composerRef}
            id="hero-prompt"
            placeholder={hero.placeholder}
            onSubmit={handleSubmit}
            isBusy={chat.isThinking}
            thinkMode={chat.thinkMode}
            onToggleThink={chat.toggleThinkMode}
            topics={topics}
            menuPlacement={isChatting ? 'up' : 'down'}
          />
          <AnimatePresence initial={false}>
            {!isChatting && deck.isDeck && (
              <motion.div
                key="extras"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <ComposerExtras />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Suggestion chips (empty state only) */}
      <AnimatePresence initial={false}>
        {!isChatting && (
          <motion.ul
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.7, duration: 0.4 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            aria-label={t('suggestedQuestions')}
            className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-2.5 sm:overflow-visible sm:px-0"
          >
            {topics.map((topic) => {
              const Icon = TOPIC_ICONS[topic.icon] || Layers
              return (
                <li key={topic.label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => chat.ask(topic.question)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] text-body transition-colors hover:border-line-strong hover:bg-ink/5 hover:text-ink"
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="text-muted" />
                    {topic.label}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {!isChatting && <div className="flex-1" />}

      {/* Footnote + scroll hint, always at the bottom */}
      <div className="flex flex-col items-center gap-1 pb-5 pt-2 text-center text-xs text-muted">
        {isChatting && <p>{t('footnote')}</p>}
        <a
          href="#about"
          onClick={(event) => {
            if (!deck.isDeck) return
            event.preventDefault()
            deck.next()
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:text-ink"
        >
          {t('scrollHint')}
          <motion.span
            aria-hidden="true"
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown size={13} />
          </motion.span>
        </a>
      </div>
    </motion.section>
  )
}
