import ConversationBlock from '../components/ConversationBlock'
import ExperienceCard from '../components/ExperienceCard'
import { useLanguage } from '../i18n/LanguageContext'

export default function Experience() {
  const { data, t } = useLanguage()
  const { conversation, experience } = data

  return (
    <section id="experience" aria-label={t('topicExperience')} className="py-12 sm:py-16">
      <ConversationBlock
        topic={t('topicExperience')}
        question={conversation.experience.question}
        answer={conversation.experience.answer}
      >
        <div className="space-y-4">
          {experience.map((job) => (
            <ExperienceCard key={job.id} job={job} />
          ))}
        </div>
      </ConversationBlock>
    </section>
  )
}
