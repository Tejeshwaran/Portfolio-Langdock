import { Fragment, useRef } from 'react'
import { motion } from 'framer-motion'
import { Code2, BarChart3, Equal, MessageSquare, Plus, Sparkles } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'
import useScrollFade from '../hooks/useScrollFade'

// One icon per "ingredient", in the same order as why.parts
const PART_ICONS = [BarChart3, Code2, MessageSquare]

/**
 * "Why is this portfolio built differently?"
 * Explains the idea behind the site and shows it as a small equation:
 * Data Analytics + Frontend Development + AI Interface = Interactive Portfolio
 */
export default function WhyLangdock() {
  const { data, t } = useLanguage()
  const { why } = data.conversation
  const headingRef = useRef(null)
  const headingFade = useScrollFade(headingRef)

  return (
    <section id="why" aria-labelledby="why-title" className="py-12 sm:py-16">
      <motion.div ref={headingRef} style={headingFade} className="mb-10 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{t('behindInterface')}</p>
        <h2 id="why-title" className="mt-3 font-display text-[30px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
          {why.sectionTitle}
        </h2>
      </motion.div>

      <ConversationBlock question={why.question} answer={why.answer}>
        {/* One line on laptops: A + B + C = result. On phones the chips stack.
            Each chip pops in after the other. */}
        <div className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:gap-2">
          {why.parts.map((part, index) => {
            const Icon = PART_ICONS[index % PART_ICONS.length]
            return (
              <Fragment key={part}>
                {index > 0 && (
                  <PopIn as="span" className="self-center text-muted">
                    <Plus size={15} />
                  </PopIn>
                )}
                <PopIn
                  as="span"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-line bg-surface px-3 py-3 text-[13.5px] font-medium text-ink shadow-card"
                >
                  <Icon size={15} aria-hidden="true" className="text-accent" />
                  {part}
                </PopIn>
              </Fragment>
            )
          })}
          <PopIn as="span" className="self-center text-muted">
            <Equal size={15} />
          </PopIn>
          <PopIn
            as="span"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-ink px-3.5 py-3 text-[13.5px] font-medium text-canvas shadow-lift"
          >
            <Sparkles size={15} aria-hidden="true" />
            {why.result}
          </PopIn>
        </div>
        <p className="mt-4 text-sm text-muted">{t('usingItNow')}</p>
      </ConversationBlock>
    </section>
  )
}
