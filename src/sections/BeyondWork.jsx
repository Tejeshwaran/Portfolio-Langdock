import { CircleDot, HeartPulse, MapPin } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import TableTennisStage from '../components/TableTennisStage'
import { useLanguage } from '../i18n/LanguageContext'

// Icon names from portfolioData.js (conversation.beyond.facts) → Lucide icons
const FACT_ICONS = { ball: CircleDot, location: MapPin, health: HeartPulse }

/**
 * "What does he do apart from IT?" — table tennis.
 * The answer types out, then the ball animation plays (TableTennisStage)
 * and the small tags pop in one by one.
 */
export default function BeyondWork() {
  const { data, t } = useLanguage()
  const { beyond } = data.conversation

  return (
    <section id="beyond" aria-label={t('topicBeyond')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicBeyond')} question={beyond.question} answer={beyond.answer}>
        <PopIn>
          <TableTennisStage word={beyond.sport} />
        </PopIn>
        <ul className="mt-3 flex flex-wrap gap-2">
          {beyond.facts.map((fact) => {
            const Icon = FACT_ICONS[fact.icon] || CircleDot
            return (
              <PopIn
                as="li"
                key={fact.text}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm text-body"
              >
                <Icon size={15} aria-hidden="true" className="text-accent" />
                {fact.text}
              </PopIn>
            )
          })}
        </ul>
      </ConversationBlock>
    </section>
  )
}
