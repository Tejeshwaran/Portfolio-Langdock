import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * EN | DE switch. Clicking it does not switch right away: it asks the home
 * chat ("Change the entire website to German"), which types the request,
 * answers, and then switches the language (see usePortfolioChat.js).
 * The pill slides to the active language with a shared `layoutId`.
 */
export default function LanguageToggle({ onClick, placement }) {
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
