import { useEffect, useRef } from 'react'
import { RotateCcw } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import usePortfolioChat from '../hooks/usePortfolioChat'
import ChatThread from './ChatThread'
import PromptComposer from './PromptComposer'

/**
 * The chat window in the "Ask Tejeshwaran's Portfolio" section.
 * Same engine and parts as the home screen, in a compact panel.
 * (AskPortfolioSection gives it key={language}, so a language switch
 * starts a fresh chat with the greeting in the new language.)
 */
export default function AskPortfolio() {
  const { data, t } = useLanguage()
  const { askPortfolio } = data

  // The chat starts with a short, honest greeting (shown without typing)
  const chat = usePortfolioChat({
    initialMessages: [{ id: 0, role: 'ai', text: askPortfolio.greeting, animate: false }],
  })
  const threadRef = useRef(null)

  // Scroll only the chat box to the newest message, not the page
  useEffect(() => {
    const thread = threadRef.current
    if (thread) thread.scrollTo({ top: thread.scrollHeight, behavior: 'smooth' })
  }, [chat.messages, chat.isThinking, chat.liveThoughts])

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-lift">
      {/* Window header */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-sm font-medium text-ink">{t('assistantName')}</span>
          <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted sm:inline">
            {t('localNoApi')}
          </span>
        </div>
        <button
          type="button"
          onClick={chat.reset}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <RotateCcw size={13} aria-hidden="true" />
          {t('reset')}
        </button>
      </div>

      {/* Messages. role="log" + aria-live lets screen readers announce new answers. */}
      <div
        ref={threadRef}
        role="log"
        aria-live="polite"
        aria-label={t('conversationLabel')}
        className="h-[360px] overflow-y-auto px-4 py-5 sm:h-[400px] sm:px-5 sm:[.deck-mode_&]:h-[320px]"
      >
        <ChatThread
          messages={chat.messages}
          isThinking={chat.isThinking}
          liveThoughts={chat.liveThoughts}
          thinkMode={chat.thinkMode}
          compact
        />
      </div>

      {/* Suggested questions */}
      <div className="border-t border-line px-4 pt-3 sm:px-5">
        <p className="mb-2 text-xs text-muted" id="suggestions-label">
          {t('suggestedQuestions')}
        </p>
        <ul aria-labelledby="suggestions-label" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {askPortfolio.suggestions.map((suggestion) => (
            <li key={suggestion} className="shrink-0">
              <button
                type="button"
                onClick={() => chat.ask(suggestion)}
                disabled={chat.isThinking}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-body transition-colors hover:border-line-strong hover:bg-ink/5 hover:text-ink disabled:opacity-50"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="px-3 pb-1 pt-3 sm:px-4">
        <PromptComposer
          id="ask-prompt"
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
  )
}
