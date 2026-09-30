import ConversationBlock from '../components/ConversationBlock'
import EducationCard from '../components/EducationCard'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Education.
 *  - no educationIndex: both degrees under one question (scrolling page)
 *  - educationIndex=1:  only that degree, with its own question and answer
 *                       (slide mode: Master's first, then Bachelor's)
 */
export default function Education({ educationIndex }) {
  const { data, t } = useLanguage()
  const { conversation, education } = data
  const isSingle = educationIndex !== undefined
  const entry = isSingle ? education[educationIndex] : null

  const question = isSingle ? entry.question : conversation.education.question
  const answer = isSingle ? entry.answer : conversation.education.answer
  const shown = isSingle ? [entry] : education
  const sectionId = !educationIndex ? 'education' : `education-${educationIndex + 1}`

  return (
    <section id={sectionId} aria-label={t('topicEducation')} className="py-12 sm:py-16">
      <ConversationBlock
        // The small "EDUCATION" label only above the first degree
        topic={t('topicEducation')}
        question={question}
        answer={answer}
      >
        {/* The left border of the <ol> is the timeline line;
            each EducationCard places its dot on it. */}
        <ol className="relative ml-1 space-y-5 border-l border-line-strong">
          {shown.map((degree) => (
            <EducationCard key={degree.id} entry={degree} />
          ))}
        </ol>
      </ConversationBlock>
    </section>
  )
}
