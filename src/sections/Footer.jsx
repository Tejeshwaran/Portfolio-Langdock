import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Linkedin, Mail, MapPin, X } from 'lucide-react'
import ChatThread from '../components/ChatThread'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import PromptComposer from '../components/PromptComposer'
import { useSlideDeck } from '../components/SlideDeck'
import usePortfolioChat from '../hooks/usePortfolioChat'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * The last part: "Is that everything?" + a contact card.
 *
 * The Email button doesn't open anything directly. Instead a small
 * chat pops open inside the card: the question is typed into its prompt bar
 * ("How can I contact Tejeshwaran?"), sent, and the answer shows the contact
 * cards — the same as the header buttons do on the home screen.
 */
export default function Footer() {
  const { data, t } = useLanguage()
  const { personal, conversation, askPortfolio } = data
  const reduceMotion = useReducedMotion()
  const deck = useSlideDeck()

  const chat = usePortfolioChat()
  const composerRef = useRef(null)
  const chatBoxRef = useRef(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  // The chat box hides its overflow only while it opens (so the "+" menu is not cut off later)
  const [isChatSettled, setIsChatSettled] = useState(false)
  const [pendingQuestion, setPendingQuestion] = useState(null)

  const contactButtons = [
    { label: t('email'), icon: Mail, question: askPortfolio.contactQuestion },
  ]

  function askInCard(question) {
    if (chat.isThinking) return
    chat.reset() // show only the new question and its answer
    setIsChatOpen(true)
    setPendingQuestion(question)
  }

  // Once the chat box is open, type the question into it and send it
  useEffect(() => {
    if (!isChatOpen || !pendingQuestion) return
    const timer = setTimeout(() => {
      composerRef.current?.typeAndSubmit(pendingQuestion)
      setPendingQuestion(null)
    }, 350)
    return () => clearTimeout(timer)
  }, [isChatOpen, pendingQuestion])

  // When a new message arrives, make sure the whole chat box is visible
  // (on phones the slide scrolls a little; on computers nothing moves).
  // scroll-mb-24 on the box keeps it clear of the bottom menu.
  useEffect(() => {
    if (!isChatOpen || chat.messages.length === 0) return
    chatBoxRef.current?.scrollIntoView({ block: 'end', behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [chat.messages, chat.isThinking, isChatOpen, reduceMotion])

  function closeChat() {
    chat.reset()
    setIsChatOpen(false)
    setIsChatSettled(false)
  }

  // "Start a new conversation": back to the home screen, cursor in the prompt bar
  async function startNewConversation() {
    if (deck.isDeck) await deck.goTo('home')
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    document.getElementById('hero-prompt')?.focus({ preventScroll: true })
  }

  return (
    <footer id="contact" className="pb-32 pt-12 sm:pt-16">
      <ConversationBlock question={conversation.closing.question} answer={conversation.closing.answer}>
        <PopIn className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-display text-2xl font-medium tracking-[-0.03em] text-ink">{personal.name}</p>
              <p className="mt-0.5 text-sm text-body">{personal.tagline}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
                <MapPin size={14} aria-hidden="true" />
                {personal.location}
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {contactButtons.map(({ label, icon: Icon, question }) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => askInCard(question)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-body transition-colors hover:border-line-strong hover:bg-subtle hover:text-ink"
                  >
                    <Icon size={15} aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
              {/* LinkedIn stays a normal link (hidden while its URL is empty) */}
              {personal.linkedin && (
                <li>
                  <a
                    href={personal.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-body transition-colors hover:border-line-strong hover:bg-subtle hover:text-ink"
                  >
                    <Linkedin size={15} aria-hidden="true" />
                    {t('linkedin')}
                    <span className="sr-only">{t('opensInNewTab')}</span>
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* The chat that pops open when Email is clicked */}
          <AnimatePresence initial={false}>
            {isChatOpen && (
              <motion.div
                key="card-chat"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={() => setIsChatSettled(true)}
                className={isChatSettled ? '' : 'overflow-hidden'}
              >
                <div ref={chatBoxRef} className="relative mt-5 scroll-mb-24 border-t border-line pt-5">
                  <button
                    type="button"
                    onClick={closeChat}
                    aria-label={t('closeChat')}
                    className="absolute right-0 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                  <div role="log" aria-live="polite" className="pr-8">
                    <ChatThread
                      messages={chat.messages}
                      isThinking={chat.isThinking}
                      liveThoughts={chat.liveThoughts}
                      thinkMode={chat.thinkMode}
                      compact
                    />
                  </div>
                  <div className={chat.messages.length > 0 || chat.isThinking ? 'mt-4' : ''}>
                    <PromptComposer
                      ref={composerRef}
                      id="footer-prompt"
                      size="compact"
                      placeholder={askPortfolio.placeholder}
                      onSubmit={(question, { fromVoice }) => chat.ask(question, { speak: fromVoice })}
                      isBusy={chat.isThinking}
                      thinkMode={chat.thinkMode}
                      onToggleThink={chat.toggleThinkMode}
                      topics={askPortfolio.topics}
                      menuPlacement="up"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </PopIn>

        <PopIn className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={startNewConversation}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink shadow-card transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-lift"
          >
            {t('startNewConversation')}
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </PopIn>
      </ConversationBlock>
    </footer>
  )
}
