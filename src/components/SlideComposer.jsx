import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PromptComposer from './PromptComposer'
import { useHomeChat } from './HomeChat'
import { useSlideDeck } from './SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'
import { requestAsk } from '../utils/askEvents'

/**
 * SlideComposer — the prompt box at the bottom of every slide except the
 * home screen (which has its own, bigger box). Like in a chat app, you can
 * always ask something, wherever you are.
 *
 * A question sent here goes to the home chat: the deck fades back to the
 * home screen and the question is asked there straight away
 * (requestAsk(..., { instant: true }) → Hero.jsx).
 *
 * It floats over the bottom of the slide on a soft fade, so the slide
 * keeps its full height (FitToScreen leaves room for it at the bottom).
 */
export default function SlideComposer() {
  const deck = useSlideDeck()
  const chat = useHomeChat()
  const { data, t } = useLanguage()
  const composerRef = useRef(null)
  const isVisible = deck.activeId !== 'home'

  // Press "/" to jump into this box (the home screen handles "/" itself)
  useEffect(() => {
    if (!isVisible) return
    function handleKeyDown(event) {
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        composerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isVisible])

  function handleSubmit(question, { fromVoice }) {
    requestAsk(question, { instant: true, speak: fromVoice })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="slide-composer"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.35 } }}
          exit={{ opacity: 0, y: 16, transition: { duration: 0.2 } }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-canvas via-canvas/90 to-transparent px-4 pb-4 pt-8 sm:px-6"
        >
          <div className="pointer-events-auto mx-auto max-w-3xl">
            <PromptComposer
              ref={composerRef}
              id="slide-prompt"
              size="compact"
              placeholder={t('slidePlaceholder')}
              onSubmit={handleSubmit}
              isBusy={chat.isThinking}
              thinkMode={chat.thinkMode}
              onToggleThink={chat.toggleThinkMode}
              topics={data.askPortfolio.topics}
              menuPlacement="up"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
