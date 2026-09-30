import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Github, Linkedin, Mail, MapPin } from 'lucide-react'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

// Icon names from portfolioData.js → Lucide icons
const DETAIL_ICONS = { email: Mail, location: MapPin, github: Github, linkedin: Linkedin }

/** A small button that copies a value and shows a tick for a moment */
function CopyButton({ value, label }) {
  const { t } = useLanguage()
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value)
      setIsCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), 1600)
    } catch {
      // Clipboard access can be blocked by the browser — then nothing happens.
    }
  }

  return (
    <button
      type="button"
      onClick={copyValue}
      aria-label={isCopied ? t('copied', label) : t('copy', label)}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
    >
      {isCopied ? <Check size={15} className="text-success" aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
    </button>
  )
}

/**
 * ContactDetails — contact cards shown under an AI answer
 * (email, location …). The list comes from portfolioData.js.
 * Each card pops in one by one after the answer has finished typing.
 */
export default function ContactDetails({ details }) {
  const { t } = useLanguage()
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label={t('contactDetails')}>
      {details.map((detail) => {
        const Icon = DETAIL_ICONS[detail.icon] || Mail
        const isExternal = detail.href?.startsWith('http')
        return (
          <PopIn
            as="li"
            key={detail.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5"
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
            >
              <Icon size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted">{detail.label}</p>
              {detail.href ? (
                <a
                  href={detail.href}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="block truncate text-sm text-ink transition-colors hover:text-accent"
                >
                  {detail.value}
                  {isExternal && <span className="sr-only"> {t('opensInNewTab')}</span>}
                </a>
              ) : (
                <p className="truncate text-sm text-ink">{detail.value}</p>
              )}
            </div>
            <CopyButton value={detail.value} label={detail.label} />
          </PopIn>
        )
      })}
    </ul>
  )
}
