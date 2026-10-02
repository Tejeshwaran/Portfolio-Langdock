import { Check, CircleDashed } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/** What he has built or studied, next to what he is learning */
function LearningPart({ learning }) {
  const { t } = useLanguage()
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <PopIn className="rounded-xl border border-line bg-surface p-4 shadow-card">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-success">{t('builtOrStudied')}</h3>
        <ul className="mt-3 space-y-2">
          {learning.known.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[13.5px] leading-snug text-body">
              <Check size={15} aria-hidden="true" className="mt-px shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </PopIn>
      <PopIn className="rounded-xl border border-dashed border-line-strong p-4">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{t('learningNow')}</h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {learning.exploring.map((topic) => (
            <li key={topic} className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-[13px] text-body">
              <CircleDashed size={12} aria-hidden="true" className="text-accent" />
              {topic}
            </li>
          ))}
        </ul>
      </PopIn>
    </div>
  )
}

const PARTS = ['learning']
const SLIDE_IDS = ['journey']

/**
 * "AI journey" — what he has built or studied, next to what he is
 * learning right now (one slide; PARTS can hold more parts later).
 * Everything is framed as learning — nothing claims expert knowledge.
 * Texts: conversation.learning in portfolioData.js.
 */
export default function AiJourney({ partIndex = 0 }) {
  const { data, t } = useLanguage()
  const part = PARTS[partIndex]
  const content = data.conversation[part]

  return (
    <section id={SLIDE_IDS[partIndex]} aria-label={t('topicJourney')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicJourney')} question={content.question} answer={content.answer}>
        {part === 'learning' && <LearningPart learning={content} />}
      </ConversationBlock>
    </section>
  )
}

export const JOURNEY_PART_COUNT = PARTS.length
