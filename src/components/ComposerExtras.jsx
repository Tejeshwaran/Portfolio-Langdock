import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Folder, Globe, Linkedin, Mail } from 'lucide-react'
import { PROJECT_ICONS, groupSlideId } from './appNav'
import { useSlideDeck } from './SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'
import { requestAsk } from '../utils/askEvents'

/**
 * ComposerExtras — the thin bar under the home prompt box, in the style
 * of an AI workspace ("Work in a folder" · "Connect your apps"):
 *
 *   [📁 Projects folder]                 Connect with him  [✉] [🌐] [in]
 *
 *  - Projects folder opens a small list of his projects; a click fades
 *    to that project's slide.
 *  - "Connect with him" asks the chat for the contact details; the small
 *    app icons are direct links: email, his portfolio website and
 *    LinkedIn (only when its URL is filled in portfolioData.js).
 */
export default function ComposerExtras() {
  const deck = useSlideDeck()
  const { data, t } = useLanguage()
  const { personal, askPortfolio } = data
  const [isFolderOpen, setIsFolderOpen] = useState(false)
  const folderRef = useRef(null)

  // Close the folder list on outside click or Escape
  useEffect(() => {
    if (!isFolderOpen) return
    const handlePointerDown = (event) => {
      if (!folderRef.current?.contains(event.target)) setIsFolderOpen(false)
    }
    const handleKeyDown = (event) => event.key === 'Escape' && setIsFolderOpen(false)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFolderOpen])

  function openProject(index) {
    setIsFolderOpen(false)
    deck.goTo?.(groupSlideId('projects', index))
  }

  // Small "app icons": only real links
  const apps = [
    { label: t('emailHim'), icon: Mail, color: 'text-rose-400', href: `mailto:${personal.email}` },
    { label: t('portfolioSite'), icon: Globe, color: 'text-sky-400', href: personal.portfolioUrl, isExternal: true },
    { label: 'LinkedIn', icon: Linkedin, color: 'text-blue-400', href: personal.linkedin, isExternal: true },
  ].filter((app) => app.href)

  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1.5 sm:px-3">
      <div ref={folderRef} className="relative">
        <button
          type="button"
          onClick={() => setIsFolderOpen((isOpen) => !isOpen)}
          aria-expanded={isFolderOpen}
          aria-haspopup="true"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px] font-medium text-ink transition-colors hover:bg-ink/5"
        >
          <Folder size={17} aria-hidden="true" className="fill-sky-400/80 text-sky-400" />
          {t('projectsFolder')}
        </button>

        <AnimatePresence>
          {isFolderOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-30 mt-2 w-64 rounded-2xl border border-line bg-surface p-1.5 shadow-lift"
            >
              {data.projects.map((project, index) => {
                const Icon = PROJECT_ICONS[project.type] || Folder
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => openProject(index)}
                      className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-ink/5"
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0 text-muted" />
                      <span className="min-w-0 flex-1 truncate">{project.title}</span>
                    </button>
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => requestAsk(askPortfolio.contactQuestion)}
          className="hidden rounded-lg px-1.5 py-1 text-[14px] text-muted transition-colors hover:text-ink sm:inline"
        >
          {t('connectWith')}
        </button>
        <span className="flex items-center gap-1">
          {apps.map((app) => (
            <a
              key={app.label}
              href={app.href}
              {...(app.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={app.isExternal ? `${app.label} ${t('opensInNewTab')}` : app.label}
              title={app.label}
              className={`flex h-7 w-7 items-center justify-center rounded-lg bg-subtle transition-transform hover:scale-110 ${app.color}`}
            >
              <app.icon size={15} strokeWidth={2} aria-hidden="true" />
            </a>
          ))}
        </span>
      </div>
    </div>
  )
}
