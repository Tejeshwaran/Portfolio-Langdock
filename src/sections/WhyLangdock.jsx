import { Fragment } from 'react'
import { BarChart3, Check, Code2, Equal, Plus, Search, Sparkles } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'

// One icon per "ingredient", in the same order as why.parts
const PART_ICONS = [BarChart3, Code2, Search]

/**
 * "Why Langdock — and why the AI Associate program?"
 *
 *  1. The answer: what Langdock does, why its support is where the real
 *     questions about AI arrive, and what he brings.
 *  2. Four cards: what the program asks for → where he has shown it.
 *     Only things that are on the CV or visible in his projects.
 *  3. A one-line summary: Data analysis + Web development + Curiosity
 *     about AI = AI Associate.
 * All texts: conversation.why in portfolioData.js.
 */
export default function WhyLangdock() {
  const { data, t } = useLanguage()
  const { why } = data.conversation

  return (
    <section id="why" aria-label={t('topicWhy')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicWhy')} question={why.question} answer={why.answer}>
        <ul className="grid gap-2.5 sm:grid-cols-2" aria-label={`${t('roleAsks')} — ${t('whereShown')}`}>
          {why.fits.map((fit) => (
            <PopIn as="li" key={fit.need} className="rounded-xl border border-line bg-surface p-3.5 shadow-card">
              <p className="flex items-start gap-2 text-[13.5px] font-medium text-ink">
                <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-success" />
                {fit.need}
              </p>
              <p className="mt-1 pl-[23px] text-[13px] leading-relaxed text-body">{fit.proof}</p>
            </PopIn>
          ))}
        </ul>

        {/* A + B + C = AI Associate. Wraps onto more lines on small screens. */}
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={`${why.parts.join(' + ')} = ${why.result}`}>
          {why.parts.map((part, index) => {
            const Icon = PART_ICONS[index % PART_ICONS.length]
            return (
              <Fragment key={part}>
                {index > 0 && (
                  <PopIn as="span" className="text-muted" aria-hidden="true">
                    <Plus size={14} />
                  </PopIn>
                )}
                <PopIn
                  as="span"
                  aria-hidden="true"
                  className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[13px] font-medium text-ink"
                >
                  <Icon size={14} className="text-accent" />
                  {part}
                </PopIn>
              </Fragment>
            )
          })}
          <PopIn as="span" className="text-muted" aria-hidden="true">
            <Equal size={14} />
          </PopIn>
          <PopIn
            as="span"
            aria-hidden="true"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-[13px] font-medium text-canvas"
          >
            <Sparkles size={14} />
            {why.result}
          </PopIn>
        </div>
      </ConversationBlock>
    </section>
  )
}
