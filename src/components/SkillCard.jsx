import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BarChart3, ChevronDown, Cloud, Code2 } from 'lucide-react'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

// portfolioData.js stores an icon *name*; this maps it to a Lucide icon.
const CATEGORY_ICONS = { chart: BarChart3, code: Code2, cloud: Cloud }

/**
 * An expandable skill category (accordion item).
 * The card pops in, then every skill pops in one by one as you scroll.
 */
export default function SkillCard({ category, defaultOpen = true }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const Icon = CATEGORY_ICONS[category.icon] || Code2
  const panelId = `skills-${category.id}`

  return (
    <PopIn
      as="article"
      className={`rounded-2xl border bg-surface shadow-card transition-colors duration-200 ${
        isOpen ? 'border-line-strong' : 'border-line hover:border-line-strong'
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left sm:px-5"
        >
          <span
            aria-hidden="true"
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
              isOpen ? 'bg-accent-fill text-canvas' : 'bg-accent-soft text-accent'
            }`}
          >
            <Icon size={17} />
          </span>
          <span className="flex-1">
            <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-ink">
              {category.name}
            </span>
            <span className="block text-xs text-muted">{t('skillsCount', category.items.length)}</span>
          </span>
          {/* The chevron rotates 180° when the category is open */}
          <motion.span
            aria-hidden="true"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="text-muted"
          >
            <ChevronDown size={18} />
          </motion.span>
        </button>
      </h3>

      {/* AnimatePresence keeps the panel mounted until its exit animation ends */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="flex flex-wrap gap-2 border-t border-line px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
              {category.items.map((skill) => (
                <PopIn
                  as="li"
                  key={skill.name}
                  className={`inline-flex items-center gap-2 rounded-lg border border-line bg-canvas py-1.5 pl-3 ${
                    skill.level ? 'pr-1.5' : 'pr-3'
                  }`}
                >
                  <span className="text-sm font-medium text-ink">{skill.name}</span>
                  {/* Level exactly as written on the résumé; no fake percentages */}
                  {skill.level && (
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                        skill.level.key === 'very-good'
                          ? 'bg-accent-soft text-accent-strong'
                          : 'bg-subtle text-body'
                      }`}
                    >
                      {skill.level.label}
                    </span>
                  )}
                </PopIn>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </PopIn>
  )
}
