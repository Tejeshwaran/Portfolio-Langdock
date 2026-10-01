import { Check, CircleDashed, HelpCircle, Ticket } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/** Part 1 — the questions about AI systems he is exploring (as a learner) */
function CuriosityPart({ curiosity }) {
  const { t } = useLanguage()
  return (
    <>
      <ul className="grid gap-2.5 sm:grid-cols-2">
        {curiosity.questions.map((item) => (
          <PopIn as="li" key={item.question} className="rounded-xl border border-line bg-surface p-3.5 shadow-card">
            <p className="flex items-start gap-2 text-[14px] font-medium leading-snug text-ink">
              <HelpCircle size={16} aria-hidden="true" className="mt-px shrink-0 text-accent" />
              {item.question}
            </p>
            <p className="mt-2 pl-6">
              <span className="rounded-md border border-dashed border-line-strong px-2 py-0.5 text-[11.5px] text-muted">
                <span className="sr-only">{t('exploring')}: </span>
                {item.concept}
              </span>
            </p>
          </PopIn>
        ))}
      </ul>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">{curiosity.note}</p>
    </>
  )
}

/** Part 2 — what he has built or studied, next to what he is learning */
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

/** Part 3 — how he would work through a support ticket (an illustration) */
function ApproachPart({ approach }) {
  const { t } = useLanguage()
  return (
    <PopIn className="rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-5">
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <Ticket size={15} aria-hidden="true" className="text-accent" />
        {t('exampleTicket')}
      </p>
      <p className="mt-1 text-[15px] font-medium text-ink">{approach.ticket}</p>
      <ol className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {approach.steps.map((step, index) => (
          <PopIn as="li" key={step.title} className="flex gap-3 rounded-xl border border-line bg-canvas p-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[12px] font-medium text-accent-strong"
            >
              {index + 1}
            </span>
            <span>
              <span className="block text-[13.5px] font-medium text-ink">{step.title}</span>
              <span className="mt-0.5 block text-[13px] leading-relaxed text-body">{step.text}</span>
            </span>
          </PopIn>
        ))}
      </ol>
    </PopIn>
  )
}

const PARTS = ['curiosity', 'learning', 'approach']
const SLIDE_IDS = ['journey', 'journey-2', 'journey-3']

/**
 * "AI journey" — three slides that show (not tell) how he approaches AI:
 *  1. curiosity  the questions about AI systems he is exploring
 *  2. learning   built or studied  |  learning now
 *  3. approach   how he would work through a support ticket
 * Everything is framed as learning — nothing claims expert knowledge.
 * Texts: conversation.curiosity / learning / approach in portfolioData.js.
 */
export default function AiJourney({ partIndex = 0 }) {
  const { data, t } = useLanguage()
  const part = PARTS[partIndex]
  const content = data.conversation[part]

  return (
    <section id={SLIDE_IDS[partIndex]} aria-label={t('topicJourney')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicJourney')} question={content.question} answer={content.answer}>
        {part === 'curiosity' && <CuriosityPart curiosity={content} />}
        {part === 'learning' && <LearningPart learning={content} />}
        {part === 'approach' && <ApproachPart approach={content} />}
      </ConversationBlock>
    </section>
  )
}

export const JOURNEY_PART_COUNT = PARTS.length
