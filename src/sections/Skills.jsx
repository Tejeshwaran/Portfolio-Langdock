import ConversationBlock from '../components/ConversationBlock'
import SkillCard from '../components/SkillCard'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Skills.
 *  - no skillIndex: all three groups under one question (scrolling page)
 *  - skillIndex=1:  only that group, with its own question and answer
 *                   (slide mode: data → web → data/cloud, one per slide)
 * Inside each group the skills pop in one by one (PopIn in SkillCard).
 */
export default function Skills({ skillIndex }) {
  const { data, t } = useLanguage()
  const { conversation, skills } = data
  const isSingle = skillIndex !== undefined
  const group = isSingle ? skills[skillIndex] : null

  const question = isSingle ? group.question : conversation.skills.question
  const answer = isSingle ? group.answer : conversation.skills.answer
  const shown = isSingle ? [group] : skills
  const sectionId = !skillIndex ? 'skills' : `skills-${skillIndex + 1}`

  return (
    <section id={sectionId} aria-label={t('topicSkills')} className="py-12 sm:py-16">
      <ConversationBlock topic={!skillIndex ? t('topicSkills') : undefined} question={question} answer={answer}>
        <div className="space-y-3">
          {/* All groups start open, so each skill pops in */}
          {shown.map((category) => (
            <SkillCard key={category.id} category={category} />
          ))}
        </div>
      </ConversationBlock>
    </section>
  )
}
