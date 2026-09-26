import ConversationBlock from '../components/ConversationBlock'
import ProjectCard from '../components/ProjectCard'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * Every project is its own question → answer, so the projects feel like
 * separate AI answers. The question and answer live on each project in
 * portfolioData.js — to add a project, only the data file changes.
 *
 *  - no projectIndex: all projects below each other (scrolling page)
 *  - projectIndex=1:  only that project (slide mode: one slide per project)
 */
export default function Projects({ projectIndex }) {
  const { data, t } = useLanguage()
  const [firstProject] = data.projects
  const shown = projectIndex === undefined ? data.projects : [data.projects[projectIndex]]
  const sectionId = !projectIndex ? 'projects' : `projects-${projectIndex + 1}`

  return (
    <section id={sectionId} aria-label={t('topicProjects')} className="space-y-16 py-12 sm:space-y-20 sm:py-16">
      {shown.map((project) => (
        <ConversationBlock
          key={project.id}
          topic={project === firstProject ? t('topicProjects') : undefined}
          question={project.question}
          answer={project.answer}
        >
          <ProjectCard project={project} />
        </ConversationBlock>
      ))}
    </section>
  )
}
