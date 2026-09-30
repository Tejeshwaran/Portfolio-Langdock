import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

// Shared entrance animation: fade in + slide up a little.
// Only opacity and transform change, which the GPU handles cheaply.
const hiddenState = { opacity: 0, y: 12 }
const shownState = { opacity: 1, y: 0 }
const entranceTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

/**
 * ChatMessage — one message in the conversation.
 *  role="user" → round bubble on the right
 *  role="ai"   → round avatar + plain text on the left (like modern AI
 *                apps); `actions` (copy / regenerate) goes under the text
 *
 * The message is always in the DOM (so it takes up its space from the start);
 * `visible` only animates it in. This keeps the page from jumping.
 */
export default function ChatMessage({ role, visible = true, actions, children }) {
  const { t } = useLanguage()
  if (role === 'user') {
    return (
      <motion.div
        className="flex justify-end"
        initial={hiddenState}
        animate={visible ? shownState : hiddenState}
        transition={entranceTransition}
      >
        <p className="max-w-[85%] rounded-[20px] bg-bubble px-4 py-2.5 text-[15px] leading-relaxed text-ink sm:max-w-[75%]">
          <span className="sr-only">{t('visitorAsks')}</span>
          {children}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="flex gap-3"
      initial={hiddenState}
      animate={visible ? shownState : hiddenState}
      transition={entranceTransition}
    >
      <div
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-accent"
      >
        <Sparkles size={15} strokeWidth={2} />
      </div>
      {/* pt-1: the first line of text sits level with the middle of the avatar */}
      <div className="min-w-0 flex-1 pt-1">
        <p className="sr-only">{t('aiName')}</p>
        <div className="text-[15px] leading-relaxed text-ink sm:text-base">{children}</div>
        {actions}
      </div>
    </motion.div>
  )
}
