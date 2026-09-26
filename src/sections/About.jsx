import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * "Who is Tejeshwaran?" — the answer, then his focus areas as pills.
 * (Degrees are not repeated here: the Education section shows them.)
 */
export default function About() {
  const { data, t } = useLanguage()
  const { about } = data.conversation

  return (
    <section id="about" aria-label={t('topicAbout')} className="py-12 sm:py-16">
      <ConversationBlock topic={t('topicAbout')} question={about.question} answer={about.answer}>
        <p className="mb-3 text-xs font-medium text-muted">{t('focusAreas')}</p>
        <ul className="flex flex-wrap gap-2">
          {about.focusAreas.map((area) => (
            <PopIn
              as="li"
              key={area}
              className="rounded-full border border-accent/25 bg-accent-soft px-4 py-2 text-sm font-medium text-accent-strong"
            >
              {area}
            </PopIn>
          ))}
        </ul>
      </ConversationBlock>
    </section>
  )
}
