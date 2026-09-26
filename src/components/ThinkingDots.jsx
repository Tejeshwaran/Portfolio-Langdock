import { useLanguage } from '../i18n/LanguageContext'

// Three small dots that pulse one after another — the "AI is thinking" state.
// Each dot uses the same CSS animation with a different animationDelay,
// which creates the wave effect without any JavaScript timers.
export default function ThinkingDots() {
  const { t } = useLanguage()
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted" role="status">
      <span className="inline-flex items-center gap-1" aria-hidden="true">
        {[0, 150, 300].map((delayMs) => (
          <span
            key={delayMs}
            className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-muted"
            style={{ animationDelay: `${delayMs}ms` }}
          />
        ))}
      </span>
      <span>{t('thinkingDots')}</span>
    </span>
  )
}
