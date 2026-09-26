import { motion } from 'framer-motion'
import PopIn from './PopIn'

const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Each level segment grows from the left, one after another.
// These variants have the same names as PopIn's ("hidden" / "shown"), so the
// segments follow the card automatically when it pops.
const segmentVariants = {
  hidden: { scaleX: 0 },
  shown: (position) => ({
    scaleX: 1,
    transition: { delay: 0.3 + position * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

/**
 * Shows a language with its level on the real CEFR scale (A1–C2).
 * This is not a made-up percentage: each segment is one official level.
 *
 * The card is a column and the level bar sits at the bottom (mt-auto), so
 * the bars of all three cards always line up, even if a text is longer.
 */
export default function LanguageCard({ language }) {
  return (
    <PopIn
      as="article"
      className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors duration-200 hover:border-line-strong"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">{language.name}</h3>
        <span className="font-mono text-sm font-medium text-accent">{language.level}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{language.description}</p>

      <div className="mt-auto pt-4">
        <div className="flex gap-1" aria-hidden="true">
          {CEFR_LEVELS.map((cefrLabel, position) => (
            <span key={cefrLabel} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
              {position < language.cefr && (
                <motion.span
                  variants={segmentVariants}
                  custom={position}
                  className="block h-full origin-left rounded-full bg-accent"
                />
              )}
            </span>
          ))}
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-muted" aria-hidden="true">
          <span>A1</span>
          <span>C2</span>
        </div>
      </div>
    </PopIn>
  )
}
