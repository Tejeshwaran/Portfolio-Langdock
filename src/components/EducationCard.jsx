import { CalendarDays, GraduationCap } from 'lucide-react'
import Badge from './Badge'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

/**
 * One entry on the education timeline.
 * Rendered as an <li> — the parent (sections/Education.jsx) provides the
 * <ol> with the vertical line. The dot is positioned onto that line.
 * The card pops in first, then its topics pop in one by one (PopIn).
 */
export default function EducationCard({ entry }) {
  const { t } = useLanguage()
  return (
    <PopIn as="li" className="relative pl-8">
      {/* Timeline dot, centred on the parent's left border line */}
      <span
        aria-hidden="true"
        className="absolute -left-[5px] top-6 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-accent ring-1 ring-accent/30"
      />

      <article className="rounded-2xl border border-line bg-surface p-5 shadow-card transition-colors duration-200 hover:border-line-strong sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
            <GraduationCap size={14} aria-hidden="true" />
            {entry.level}
          </p>
          <Badge tone="accent">{t('grade')} {entry.grade}</Badge>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{entry.degree}</h3>
        <p className="mt-0.5 text-sm text-body">{entry.school}</p>

        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          <CalendarDays size={14} aria-hidden="true" />
          <time>{entry.start}</time> – <time>{entry.end}</time>
        </p>

        <div className="mt-4 border-t border-line pt-4">
          <p className="mb-2 text-xs font-medium text-muted">{t('topics')}</p>
          <ul className="flex flex-wrap gap-1.5">
            {entry.topics.map((topic) => (
              <PopIn as="li" key={topic}>
                <Badge>{topic}</Badge>
              </PopIn>
            ))}
          </ul>
        </div>
      </article>
    </PopIn>
  )
}
