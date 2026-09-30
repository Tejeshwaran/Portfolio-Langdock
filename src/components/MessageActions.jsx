import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Copy, RotateCw } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const actionButton =
  'flex h-7 items-center justify-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink'

/**
 * MessageActions — the small buttons under an AI answer, as in chat apps:
 *  - copy        copies the answer text (a tick shows it worked)
 *  - regenerate  writes the answer again (the typing animation replays;
 *                the words stay the same, because every answer comes
 *                straight from the résumé data)
 *
 * `visible` = false keeps the row's space but hides it (while typing),
 * so nothing jumps when it appears.
 */
export default function MessageActions({ text, onRegenerate, visible = true }) {
  const { t } = useLanguage()
  const [isCopied, setIsCopied] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsCopied(false), 1800)
    } catch {
      // Clipboard blocked: nothing to show
    }
  }

  return (
    <div className="mt-2 flex items-center gap-0.5" style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <button
        type="button"
        onClick={copyText}
        aria-label={isCopied ? t('answerCopied') : t('copyAnswer')}
        title={isCopied ? t('answerCopied') : t('copyAnswer')}
        className={`${actionButton} w-7`}
      >
        {isCopied ? <Check size={15} aria-hidden="true" className="text-success" /> : <Copy size={15} aria-hidden="true" />}
      </button>
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          aria-label={t('regenerate')}
          title={t('regenerate')}
          className={`${actionButton} gap-0.5 px-1.5`}
        >
          <RotateCw size={15} aria-hidden="true" />
          <ChevronDown size={12} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
