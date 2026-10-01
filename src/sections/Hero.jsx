import { Fragment, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, FileText, Github, Layers, Linkedin, Mail } from 'lucide-react'
import ChatThread from '../components/ChatThread'
import ComposerExtras from '../components/ComposerExtras'
import PromptComposer, { TOPIC_ICONS } from '../components/PromptComposer'
import { useHomeChat } from '../components/HomeChat'
import { useSlideDeck } from '../components/SlideDeck'
import { onAskRequest, onLanguageSwitch } from '../utils/askEvents'
import { useLanguage } from '../i18n/LanguageContext'

const primaryAction =
  'inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-canvas transition-opacity hover:opacity-90'
const secondaryAction =
  'inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[13.5px] text-body transition-colors hover:border-line-strong hover:bg-ink/5 hover:text-ink'

// The heading appears word by word, like text being generated.
// The parent staggers its children; each word fades and rises a little.
const headingContainer = { hidden: {}, shown: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }
const headingWord = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * The home screen — the start page of an AI workspace, and at the same
 * time the answer to "who is this?" within a few seconds:
 *
 *   [Applying for AI Associate · Langdock, Berlin]
 *   Tejeshwaran Manoharan
 *   Data & AI-focused developer
 *   Building with data, web technologies and AI — and always trying to
 *   understand what happens under the hood.
 *   M.Sc. Data Analytics · Python · SQL · Tableau · React · EN C1 · DE B2
 *   [Explore my work →] [View CV] [GitHub] [LinkedIn] [Contact]
 *   [ prompt box ("Ask my portfolio") ]  [CV & projects · Connect with him]
 *   [Tell me about him] [What is he learning?] [Why this role?] …
 *
 * Two states:
 *  1. Empty: the start page above.
 *  2. Chat:  after the first question, the thread fills the screen and the
 *            prompt box moves to the bottom. Framer Motion's `layout` prop
 *            animates the move (with transforms, so it stays fast).
 *
 * Other parts of the page ask questions here with requestAsk()
 * (utils/askEvents.js): the contact and EN | DE buttons type the question
 * letter by letter; questions from the prompt box of another slide arrive
 * with { instant: true } and are sent straight away.
 *
 * The chat itself is shared (components/HomeChat.jsx), so the sidebar and
 * the top bar can show it too.
 */
export default function Hero() {
  const { data, t } = useLanguage()
  const { hero } = data.conversation
  const { topics, suggestions } = data.askPortfolio
  const headingWords = hero.heading.split(' ')
  const chat = useHomeChat()
  const chatRef = useRef(chat)
  chatRef.current = chat
  const composerRef = useRef(null)
  const threadRef = useRef(null)
  const deck = useSlideDeck()
  const deckRef = useRef(deck)
  deckRef.current = deck
  const isChatting = chat.messages.length > 0 || chat.isThinking

  // Keep the newest message visible inside the thread (not the whole page)
  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
  }, [chat.messages, chat.isThinking, chat.liveThoughts])

  // Keyboard shortcut: press "/" to jump into the prompt box
  // (on the other slides, SlideComposer.jsx handles "/" for its own box)
  useEffect(() => {
    function handleKeyDown(event) {
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (event.key === '/' && !isTyping && deckRef.current.activeId === 'home') {
        event.preventDefault()
        composerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Questions sent from elsewhere: fade back to this slide, then ask
  useEffect(
    () =>
      onAskRequest(async (question, options = {}) => {
        await deckRef.current.goTo('home')
        if (options.instant) chatRef.current.ask(question, { speak: options.speak })
        else composerRef.current?.typeAndSubmit(question)
      }),
    [],
  )

  // After a language switch: clear this chat, so the start page appears
  // again — now in the new language.
  useEffect(
    () =>
      onLanguageSwitch(() => {
        chatRef.current.reset()
        deckRef.current.goTo('home')
      }),
    [],
  )

  function handleSubmit(question, { fromVoice }) {
    chat.ask(question, { speak: fromVoice })
  }

  // The actions under the headline. Empty links (e.g. LinkedIn) are left out.
  const { personal } = data
  const heroActions = [
    { label: t('exploreWork'), icon: ArrowRight, onClick: () => deck.goTo('projects'), isPrimary: true },
    { label: t('viewCv'), icon: FileText, href: personal.cv, isExternal: true },
    { label: 'GitHub', icon: Github, href: personal.github, isExternal: true },
    { label: 'LinkedIn', icon: Linkedin, href: personal.linkedin, isExternal: true },
    { label: t('contactMe'), icon: Mail, href: `mailto:${personal.email}` },
  ].filter((action) => action.href || action.onClick)

  return (
    <section id="home" aria-label={t('heroLabel')} className="relative flex h-full min-h-[420px] flex-col">
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
        <div className="flex-[0.6]" />
      )}

      {/* Who he is — only on the start page */}
      <AnimatePresence initial={false}>
        {!isChatting && (
          <motion.div
            key={hero.heading}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            variants={headingContainer}
            initial="hidden"
            animate="shown"
            className="mb-5 text-center sm:mb-6"
          >
            {/* The application, like the status pill at the top of AI apps */}
            <motion.p
              variants={headingWord}
              className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-[12.5px] text-body sm:mb-6 sm:text-[13px]"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
              <span>
                {t('applyingFor')} <strong className="font-semibold text-ink">{data.personal.targetRole}</strong> ·{' '}
                {data.personal.targetPlace}
              </span>
            </motion.p>

            <h1 className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[40px]">
              {/* The space sits BETWEEN the word boxes: a space at the end of an
                  inline-block would be dropped by the browser */}
              {headingWords.map((word, index) => (
                <Fragment key={`${word}-${index}`}>
                  <motion.span variants={headingWord} className="inline-block">
                    {word}
                  </motion.span>
                  {index < headingWords.length - 1 && ' '}
                </Fragment>
              ))}
            </h1>
            <motion.p variants={headingWord} className="mt-2 text-[17px] font-medium text-accent sm:text-lg">
              {hero.role}
            </motion.p>
            <motion.p
              variants={headingWord}
              className="mx-auto mt-2 max-w-xl text-balance text-[15px] leading-relaxed text-body sm:text-base"
            >
              {hero.subheading}
            </motion.p>

            {/* Quick facts: degree, stack, languages — one quiet line */}
            <motion.p variants={headingWord} className="mx-auto mt-3 max-w-xl text-[12.5px] text-muted">
              <span className="sr-only">{t('quickFacts')}: </span>
              {hero.highlights.join(' · ')}
            </motion.p>

            {/* Direct actions — nobody has to hunt for the CV or contact */}
            <motion.ul variants={headingWord} className="mt-5 flex flex-wrap justify-center gap-2">
              {heroActions.map(({ label, icon: Icon, href, onClick, isPrimary, isExternal }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className={isPrimary ? primaryAction : secondaryAction}
                    >
                      <Icon size={15} aria-hidden="true" />
                      {label}
                      {isExternal && <span className="sr-only">{t('opensInNewTab')}</span>}
                    </a>
                  ) : (
                    <button type="button" onClick={onClick} className={isPrimary ? primaryAction : secondaryAction}>
                      {label}
                      <Icon size={15} aria-hidden="true" />
                    </button>
                  )}
                </li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The prompt box. On the start page it sits in a panel with a small
          bar underneath (CV & projects · connect); in a chat only the box stays. */}
      <motion.div layout="position" transition={{ type: 'spring', stiffness: 260, damping: 32 }}>
        <div
          className={`rounded-[20px] border transition-colors duration-300 ${
            isChatting ? 'border-transparent' : 'border-line bg-surface'
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
            {!isChatting && (
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

      {/* Suggested prompts — the main ways into the portfolio (start page only).
          Each answer ends with a button to the matching part. */}
      <AnimatePresence initial={false}>
        {!isChatting && (
          <motion.ul
            key="suggestions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.35, duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            aria-label={t('suggestedQuestions')}
            className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            {suggestions.map((suggestion) => {
              const Icon = TOPIC_ICONS[suggestion.icon] || Layers
              return (
                <li key={suggestion.label} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => chat.ask(suggestion.question)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[14px] text-body transition-colors hover:border-line-strong hover:bg-ink/5 hover:text-ink"
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="text-muted" />
                    {suggestion.label}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {!isChatting && <div className="flex-1" />}

      {/* Footnote + scroll hint, always at the bottom */}
      <div className="flex flex-col items-center gap-1 pb-4 pt-2 text-center text-xs text-muted">
        {isChatting && <p>{t('footnote')}</p>}
        <button
          type="button"
          onClick={() => deck.next()}
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
        </button>
      </div>
    </section>
  )
}
