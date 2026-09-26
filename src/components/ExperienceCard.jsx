import { Briefcase, CalendarDays, Check } from 'lucide-react'
import Badge from './Badge'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

// Builds "HC" from "HermitCrabs" — used as a neutral logo placeholder.
function getInitials(companyName) {
  const capitals = companyName.match(/[A-Z]/g) || [companyName[0]]
  return capitals.slice(0, 2).join('')
}

/** The card pops in, then each responsibility and area pops in one by one. */
export default function ExperienceCard({ job }) {
  const { t } = useLanguage()
  return (
    <PopIn
      as="article"
      className="rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift sm:p-6"
    >
      <header className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink font-mono text-sm font-medium text-canvas"
        >
          {getInitials(job.company)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-ink">{job.role}</h3>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-body">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={14} aria-hidden="true" className="text-muted" />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <CalendarDays size={14} aria-hidden="true" />
              <time>{job.start}</time> – <time>{job.end}</time>
            </span>
          </p>
        </div>
      </header>

      <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="mb-2 text-xs font-medium text-muted">{t('responsibilities')}</p>
          <ul className="space-y-2">
            {job.responsibilities.map((item) => (
              <PopIn as="li" key={item} className="flex items-start gap-2 text-sm text-body">
                <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                {item}
              </PopIn>
            ))}
          </ul>
        </div>

        <div className="sm:w-48">
          <p className="mb-2 text-xs font-medium text-muted">{t('areas')}</p>
          <ul className="flex flex-wrap gap-1.5">
            {job.tags.map((tag) => (
              <PopIn as="li" key={tag}>
                <Badge>{tag}</Badge>
              </PopIn>
            ))}
          </ul>
        </div>
      </div>
    </PopIn>
  )
}
