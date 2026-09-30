import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import ChatMessage from './ChatMessage'
import MessageActions from './MessageActions'
import ContactDetails from './ContactDetails'
import PopIn, { RevealContext } from './PopIn'
import ThinkingDots from './ThinkingDots'
import ThoughtTrace from './ThoughtTrace'
import TypewriterText from './TypewriterText'
import { useLanguage } from '../i18n/LanguageContext'

/** The optional button under an answer (e.g. "Open portfolio") */
function AnswerLink({ link }) {
  const { t } = useLanguage()
  const isExternal = link.href.startsWith('http')
  return (
    <PopIn className="mt-3">
      <a
        href={link.href}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-subtle px-3 py-1.5 text-sm text-ink transition-colors hover:border-line-strong"
      >
        {link.label}
        <ArrowUpRight size={14} aria-hidden="true" />
        {isExternal && <span className="sr-only">{t('opensInNewTab')}</span>}
      </a>
    </PopIn>
  )
}

/**
 * One AI answer. Extras under the text (a link button, contact cards) wait
 * until the typing has finished: RevealContext tells their <PopIn>s when.
 */
function AiAnswer({ message, textSize }) {
  const [isTyped, setIsTyped] = useState(!message.animate)
  // Goes up by one each time "regenerate" is pressed → the text types again
  const [runId, setRunId] = useState(0)

  function regenerate() {
    setIsTyped(false)
    setRunId((id) => id + 1)
  }

  return (
    <ChatMessage role="ai" actions={<MessageActions text={message.text} onRegenerate={regenerate} visible={isTyped} />}>
      {message.thoughts && <ThoughtTrace steps={message.thoughts} seconds={message.thoughtSeconds} />}
      <div className={`break-words ${textSize}`}>
        {message.animate || runId > 0 ? (
          <TypewriterText text={message.text} speed={9} restartKey={runId} onComplete={() => setIsTyped(true)} />
        ) : (
          message.text
        )}
      </div>
      <RevealContext.Provider value={isTyped}>
        {message.details && <ContactDetails details={message.details} />}
        {message.link && <AnswerLink link={message.link} />}
      </RevealContext.Provider>
    </ChatMessage>
  )
}

/**
 * ChatThread — renders the messages of one chat (from usePortfolioChat).
 * Every new message animates in through ChatMessage.
 */
export default function ChatThread({ messages, isThinking, liveThoughts, thinkMode, compact = false }) {
  const textSize = compact ? 'text-sm' : ''

  return (
    <div className="space-y-6">
      {messages.map((message) =>
        message.role === 'user' ? (
          <ChatMessage key={message.id} role="user">
            {message.text}
          </ChatMessage>
        ) : (
          <AiAnswer key={message.id} message={message} textSize={textSize} />
        ),
      )}

      {/* While the answer is being prepared */}
      {isThinking && (
        <ChatMessage role="ai">
          {thinkMode ? <ThoughtTrace steps={liveThoughts} live /> : <ThinkingDots />}
        </ChatMessage>
      )}
    </div>
  )
}
