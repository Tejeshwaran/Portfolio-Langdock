import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Cpu,
  Database,
  FileText,
  History,
  Keyboard,
  Lightbulb,
  Lock,
  Pill,
  Sparkles,
  SpellCheck,
  TextCursorInput,
  X,
} from 'lucide-react'
import Badge from './Badge'
import PopIn from './PopIn'
import { useLanguage } from '../i18n/LanguageContext'

// Icons for the capability lists (used in order).
const CAPABILITY_ICONS = [Database, BarChart3, FileText, Lightbulb]
const APP_CAPABILITY_ICONS = [Keyboard, Cpu, TextCursorInput, SpellCheck, Pill, History]

// Bar heights (in %) for the decorative chart. This is NOT project data —
// the preview is labelled "Illustrative preview" on the card.
const PREVIEW_BARS = [42, 58, 36, 70, 54, 82, 64, 76]

/** Shared header: "PROJECT 01", title, subtitle, status and technology badges */
function ProjectHeader({ project }) {
  const { t } = useLanguage()
  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{t('project')} {project.number}</p>
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

      {/* Technology badges pop in one by one */}
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t('technologies')}>
        {project.tech.map((tech) => (
          <PopIn as="li" key={tech}>
            <Badge>{tech}</Badge>
          </PopIn>
        ))}
      </ul>
    </header>
  )
}

/** Three grey "window" dots used by both previews */
function WindowDots() {
  return (
    <span className="flex gap-1">
      <span className="h-2 w-2 rounded-full bg-line-strong" />
      <span className="h-2 w-2 rounded-full bg-line-strong" />
      <span className="h-2 w-2 rounded-full bg-line-strong" />
    </span>
  )
}

/** A tiny, decorative analytics workspace drawn with divs and CSS */
function DashboardPreview() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <WindowDots />
        <span className="font-mono text-[10px] text-muted">sales_dashboard · Tableau</span>
      </div>

      <div className="grid grid-cols-[56px_1fr] gap-3 p-3 sm:grid-cols-[72px_1fr]">
        {/* Filter sidebar (skeleton lines) */}
        <div className="space-y-2 rounded-lg border border-line bg-surface p-2">
          {[80, 60, 70, 50].map((width, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-line" style={{ width: `${width}%` }} />
          ))}
        </div>

        <div className="space-y-3">
          {/* KPI tiles */}
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((tile) => (
              <div key={tile} className="rounded-lg border border-line bg-surface p-2">
                <span className="block font-mono text-[9px] uppercase text-muted">KPI</span>
                <span
                  className={`mt-1.5 block h-2 rounded-full ${tile === 0 ? 'bg-accent/70' : 'bg-line-strong'}`}
                  style={{ width: `${55 + tile * 12}%` }}
                />
              </div>
            ))}
          </div>

          {/* Bar chart: bars grow slightly when the card is hovered (group-hover).
              scale-y is a transform, so it is GPU-friendly. */}
          <div className="flex h-24 items-end gap-1.5 rounded-lg border border-line bg-surface px-3 pb-2 pt-3">
            {PREVIEW_BARS.map((height, i) => (
              <span
                key={i}
                className={`flex-1 origin-bottom rounded-t-sm transition-transform duration-500 ease-out group-hover:scale-y-110 ${
                  i === 5 ? 'bg-accent' : 'bg-accent/25'
                }`}
                style={{ height: `${height}%`, transitionDelay: `${i * 30}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** A tiny browser window showing the portfolio's real URL */
function WebPreview({ url }) {
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center gap-3 border-b border-line bg-surface px-3 py-2">
        <WindowDots />
        <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-subtle px-2 py-1 font-mono text-[10px] text-muted">
          <Lock size={10} className="shrink-0" />
          <span className="truncate">{displayUrl}</span>
        </span>
      </div>
      <div className="space-y-3 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-1">
        <span className="block h-2 w-16 rounded-full bg-ink/80" />
        <span className="block h-3 w-3/4 rounded-full bg-line-strong" />
        <span className="block h-3 w-1/2 rounded-full bg-line" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[0, 1, 2].map((tile) => (
            <span key={tile} className="block h-12 rounded-lg border border-line bg-surface" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * A tiny, decorative desktop app: a sidebar, transcript rows and the
 * floating "pill" that Pillo shows while you dictate. The waveform bars
 * are a CSS animation (transform only), so they cost almost nothing.
 */
function AppPreview() {
  return (
    <div aria-hidden="true" className="relative overflow-hidden rounded-xl border border-line bg-canvas">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2">
        <WindowDots />
        <span className="font-mono text-[10px] text-muted">Pillo · Windows</span>
      </div>
      <div className="grid grid-cols-[64px_1fr] gap-3 p-3 pb-16 sm:grid-cols-[84px_1fr] [.deck-mode_&]:pb-14">
        <div className="space-y-2 rounded-lg border border-line bg-surface p-2">
          {[70, 85, 60, 75, 55].map((width, i) => (
            <span
              key={i}
              className={`block h-1.5 rounded-full ${i === 0 ? 'bg-ink/70' : 'bg-line-strong'}`}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
        <div className="space-y-2">
          {[88, 72, 80].map((width, i) => (
            <div
              key={i}
              // slide mode shows two rows so the whole card fits on one screen
              className={`flex items-center gap-2 rounded-lg border border-line bg-surface p-2 ${i === 2 ? "[.deck-mode_&]:hidden" : ""}`}
            >
              <span className="h-4 w-4 shrink-0 rounded bg-line-strong" />
              <span className="block h-1.5 rounded-full bg-line-strong" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>

      {/* The floating dictation pill */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line-strong bg-canvas px-4 py-2 shadow-lift">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="flex h-4 items-center gap-[3px]">
          {[0, 120, 240, 360, 480, 600, 720].map((delayMs) => (
            <span
              key={delayMs}
              className="h-full w-[3px] animate-voice-bar rounded-full bg-ink/90"
              style={{ animationDelay: `${delayMs}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  )
}

/** Pillo card: preview, description and capabilities, which pop in one by one */
function AppProjectCard({ project }) {
  const { t } = useLanguage()
  return (
    <PopIn
      as="article"
      className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift sm:p-6"
    >
      <ProjectHeader project={project} />
      <div className="mt-5">
        <AppPreview />
      </div>
      <p className="mt-2 text-[11px] text-muted">{t('illustrativePreview')}</p>
      {/* In slide mode the AI answer above already says this, so it is hidden to fit one screen */}
      <p className="mt-3 text-sm leading-relaxed text-body [.deck-mode_&]:hidden">{project.description}</p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:[.deck-mode_&]:grid-cols-3">
        {project.capabilities.map((capability, i) => {
          const Icon = APP_CAPABILITY_ICONS[i % APP_CAPABILITY_ICONS.length]
          return (
            <PopIn
              as="li"
              key={capability}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-canvas px-3 py-2.5 text-sm text-ink"
            >
              <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
              {capability}
            </PopIn>
          )
        })}
      </ul>
    </PopIn>
  )
}

function DashboardProjectCard({ project }) {
  const { t } = useLanguage()
  // `isAnalyzing` opens the detail panel under the preview
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const panelId = `${project.id}-analysis`

  return (
    <PopIn
      as="article"
      className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift sm:p-6"
    >
      <ProjectHeader project={project} />

      <div className="relative mt-5">
        <DashboardPreview />

        {/* "Analyze project →" — always visible on touch screens (small widths),
            appears on hover or keyboard focus on larger screens. */}
        <div className="absolute inset-0 flex items-center justify-center rounded-xl transition-colors duration-300 sm:group-hover:bg-canvas/60">
          <button
            type="button"
            onClick={() => setIsAnalyzing((open) => !open)}
            aria-expanded={isAnalyzing}
            aria-controls={panelId}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas shadow-lift transition-all duration-300 hover:bg-accent sm:translate-y-2 sm:opacity-0 sm:focus-visible:translate-y-0 sm:focus-visible:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
          >
            {isAnalyzing ? t('closeAnalysis') : t('analyzeProject')}
            {isAnalyzing ? <X size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted">{t('illustrativePreview')}</p>

      <p className="mt-3 text-sm leading-relaxed text-body">{project.description}</p>

      {/* The analysis panel. AnimatePresence lets it animate OUT before
          React removes it from the DOM. */}
      <AnimatePresence initial={false}>
        {isAnalyzing && (
          <motion.div
            id={panelId}
            key="analysis"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-line bg-canvas p-4">
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.12em] text-accent">
                {t('capabilities')}
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {project.capabilities.map((capability, i) => {
                  const Icon = CAPABILITY_ICONS[i % CAPABILITY_ICONS.length]
                  return (
                    <PopIn
                      as="li"
                      key={capability}
                      className="flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink"
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
                      {capability}
                    </PopIn>
                  )
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PopIn>
  )
}

function WebProjectCard({ project }) {
  const { t } = useLanguage()
  return (
    <PopIn
      as="article"
      className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-lift sm:p-6"
    >
      <ProjectHeader project={project} />
      <div className="mt-5">
        <WebPreview url={project.link} />
      </div>
      <p className="mt-4 text-sm leading-relaxed text-body">{project.description}</p>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
      >
        {t('viewProject')}
        <ArrowUpRight
          size={15}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
        <span className="sr-only">{t('opensInNewTab')}</span>
      </a>
    </PopIn>
  )
}

/** Picks the right card layout based on `project.type` from portfolioData.js */
export default function ProjectCard({ project }) {
  if (project.type === 'dashboard') return <DashboardProjectCard project={project} />
  if (project.type === 'app') return <AppProjectCard project={project} />
  return <WebProjectCard project={project} />
}
