import { ArrowRight } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * "Why the AI Associate program?"
 *
 *  1. The answer: the program treats AI as something to understand, not
 *     only to use — and he has not mastered the whole stack yet, which is
 *     exactly why the role appeals to him.
 *  2. A small story, one row per part of his background:
 *        Data analytics  →  checks the data before drawing conclusions
 *                           (M.Sc. Data Analytics · Sales Dashboard)
 *     Only things that are on the CV or visible in his projects.
 * All texts: conversation.why in portfolioData.js.
 */
export default function WhyLangdock() {
  const { data, t } = useLanguage()
  const { why } = data.conversation

  return (
    <section id="why" aria-label={t('topicWhy')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicWhy')} question={why.question} answer={why.answer}>
        {/* His own words — the program asks for people who want to understand AI */}
        <PopIn as="figure" className="mb-3 border-l-2 border-accent pl-4">
          <blockquote className="font-display text-[16px] font-medium leading-snug text-ink sm:text-[17px]">
            {data.personal.quote}
          </blockquote>
          <figcaption className="mt-1 text-[12px] text-muted">— {data.personal.name}</figcaption>
        </PopIn>
        <ol className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {why.story.map((row) => (
            <PopIn
              as="li"
              key={row.from}
              className="grid gap-1 border-t border-line px-4 py-3 first:border-t-0 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-4"
            >
              <span className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                {row.from}
                <ArrowRight size={14} aria-hidden="true" className="text-accent sm:ml-auto" />
              </span>
              <span>
                <span className="block text-[13.5px] text-body">{row.gives}</span>
                <span className="mt-0.5 block text-[12px] text-muted">{row.evidence}</span>
              </span>
            </PopIn>
          ))}
        </ol>
        <PopIn className="mt-3 flex items-center justify-end gap-2 text-[13px] text-muted">
          {t('allPointTo')}
          <span className="rounded-lg bg-ink px-2.5 py-1 font-medium text-canvas">{why.role}</span>
        </PopIn>
      </ConversationBlock>
    </section>
  )
}
