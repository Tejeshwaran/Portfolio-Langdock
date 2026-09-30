import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import Badge from './Badge'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/** Header: "PROJECT 01", status, title, subtitle, credit and technologies */
function ProjectHeader({ project }) {
  const { t } = useLanguage()
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {t('project')} {project.number}
        </p>
        {project.status && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-[11px] text-body">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            {project.status}
          </span>
        )}
      </div>
      <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-ink">{project.title}</h3>
      <p className="mt-1 text-sm text-body">{project.subtitle}</p>

      {/* Credit line, for example "Built together with Claude AI" */}
      {project.collaborator && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-accent/25 bg-accent-soft px-2.5 py-1 text-xs text-accent-strong">
          <Sparkles size={13} aria-hidden="true" />
          {t('builtWith', project.collaborator)}
        </p>
      )}

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t('technologies')}>
        {project.tech.map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
      </ul>
    </header>
  )
}

/** "How it works": the steps of the project as a small flow (wraps on phones) */
function Pipeline({ steps }) {
  const { t } = useLanguage()
  return (
    <div className="mt-5">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">{t('howItWorks')}</p>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {steps.map((step, index) => (
          <Fragment key={step}>
            {index > 0 && <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-muted" />}
            <PopIn as="li" className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[13px] text-ink">
              {step}
            </PopIn>
          </Fragment>
        ))}
      </ol>
    </div>
  )
}

/**
 * ProjectCard — one project as a small case study:
 *
 *   header (number, status, title, credit, technologies)
 *   How it works:  step › step › step › step
 *   Problem | Approach | Result (or Status, while in development)
 *   [Case study details ▾] → the features
 *
 * All texts come from portfolioData.js (projects). Nothing here is
 * decoration only: every block answers a question a recruiter asks.
 */
export default function ProjectCard({ project }) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const detailsId = `${project.id}-details`
  const { problem, approach, result } = project.caseStudy

  const parts = [
    { label: t('problem'), text: problem },
    { label: t('approach'), text: approach },
    { label: project.status ? t('statusNow') : t('result'), text: result },
  ]

  return (
    <PopIn
      as="article"
      className="rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors duration-200 hover:border-line-strong sm:p-6"
    >
      <ProjectHeader project={project} />
      <Pipeline steps={project.pipeline} />

      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {parts.map((part) => (
          <PopIn key={part.label} className="rounded-xl border border-line bg-canvas p-3.5">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{part.label}</dt>
            <dd className="mt-1.5 text-[13.5px] leading-relaxed text-body">{part.text}</dd>
          </PopIn>
        ))}
      </dl>

      {project.capabilities?.length > 0 && (
        <>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls={detailsId}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-body transition-colors hover:border-line-strong hover:text-ink"
          >
            {isOpen ? t('hideDetails') : t('caseStudy')}
            <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} aria-hidden="true">
              <ChevronDown size={15} />
            </motion.span>
          </button>

          {/* AnimatePresence lets the panel animate OUT before React removes it */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                id={detailsId}
                key="details"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mb-2 mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{t('features')}</p>
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {project.capabilities.map((capability) => (
                    <li key={capability} className="flex items-start gap-2 text-sm text-body">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </PopIn>
  )
}
