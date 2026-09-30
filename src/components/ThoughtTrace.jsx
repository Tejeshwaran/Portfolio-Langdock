import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

/** A vertical list of reasoning steps with small dots on a line */
function StepList({ steps, highlightLast = false }) {
  return (
    <ol className="space-y-2 border-l border-line pl-4">
      {steps.map((step, index) => (
        <motion.li
          key={step}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className={`relative text-[13px] leading-snug ${
            highlightLast && index === steps.length - 1 ? 'text-body' : 'text-muted'
          }`}
        >
          <span
            aria-hidden="true"
            className="absolute -left-[19px] top-[6px] h-1.5 w-1.5 rounded-full bg-line-strong"
          />
          {step}
        </motion.li>
      ))}
    </ol>
  )
}

/**
 * ThoughtTrace — the "Think" mode reasoning display.
 *
 *  live=true  → shimmering "Thinking" label + steps appearing one by one
 *  live=false → collapsed "Thought for 1.8s" button; click to see the steps
 */
export default function ThoughtTrace({ steps, seconds, live = false }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const panelId = useId()

  if (live) {
    return (
      <div className="mb-2" role="status">
        {/* The shimmer is a moving gradient clipped to the text (CSS only) */}
        <p className="mb-2 animate-shimmer bg-[linear-gradient(90deg,rgb(var(--c-muted))_0%,rgb(var(--c-muted))_40%,rgb(var(--c-ink))_50%,rgb(var(--c-muted))_60%,rgb(var(--c-muted))_100%)] bg-[length:200%_100%] bg-clip-text text-sm font-medium text-transparent">
          {t('thinking')}
        </p>
        <StepList steps={steps} highlightLast />
      </div>
    )
  }

  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="inline-flex items-center gap-1 rounded-md text-sm text-muted transition-colors hover:text-ink"
      >
        {t('thoughtFor', seconds)}
        <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
          <ChevronRight size={15} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pb-1 pt-2">
              <StepList steps={steps} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
