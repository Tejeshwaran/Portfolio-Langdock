import { motion } from 'framer-motion'
import { ChevronRight, Mail, MessageSquare, PanelLeftClose, SquarePen, X } from 'lucide-react'
import HackerLogo from './HackerLogo'
import { getChatTitle, useHomeChat } from './HomeChat'
import { PROJECT_ICONS, SECTION_ITEMS, groupSlideId } from './appNav'
import { useSlideDeck } from './SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'
import { requestAsk } from '../utils/askEvents'

/** One row in the sidebar (icon + label), highlighted when active */
function SidebarItem({ icon: Icon, label, isActive = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? 'true' : undefined}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[14px] transition-colors ${
        isActive ? 'bg-surface font-medium text-ink' : 'text-body hover:bg-ink/5 hover:text-ink'
      }`}
    >
      <Icon size={17} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  )
}

/** Small gray group title ("Projects", "Today") */
function SidebarHeading({ children }) {
  return <p className="px-2.5 pb-1 pt-5 text-[12.5px] text-muted">{children}</p>
}

/** "TM" from "Tejeshwaran Manoharan" */
function initialsOf(name) {
  const words = name.trim().split(/\s+/)
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase()
}

/**
 * Sidebar — the left column, in the style of an AI workspace app:
 *
 *   logo + name              [close]
 *   New chat
 *   About · Education · … · Contact      ← one item per part of the portfolio
 *   Projects:  Sales Dashboard · …        ← straight to one project
 *   Today:     the current chat           ← its first question
 *   [Explore the portfolio  40% explored ▬▬▬───]
 *   (TM) Tejeshwaran Manoharan       ✉    ← asks for the contact details
 *
 * Every item moves the slide deck (deck.goTo). `visited` holds the slide
 * numbers already seen; the progress card shows how many that is.
 *
 * Props
 *  - visited      Set of slide indexes the visitor has seen
 *  - onNavigate   called after an item was used (closes the phone drawer)
 *  - onClose      the close button (collapse on computers, close the drawer on phones)
 *  - isDrawer     true in the phone drawer (shows an × instead of the collapse icon)
 */
export default function Sidebar({ visited, onNavigate, onClose, isDrawer = false }) {
  const deck = useSlideDeck()
  const chat = useHomeChat()
  const { data, t } = useLanguage()
  const { personal, askPortfolio } = data
  const chatTitle = getChatTitle(chat.messages)

  const percent = Math.round((visited.size / deck.count) * 100)

  function go(target) {
    deck.goTo(target)
    onNavigate?.()
  }

  function startNewChat() {
    chat.reset()
    go('home')
  }

  // The next slide after the current one that has not been seen yet
  function showNextUnseen() {
    for (let step = 1; step < deck.count; step++) {
      const index = (deck.activeIndex + step) % deck.count
      if (!visited.has(index)) return go(index)
    }
    go(0) // everything seen: back to the start
  }

  function askForContact() {
    requestAsk(askPortfolio.contactQuestion)
    onNavigate?.()
  }

  return (
    <nav aria-label={t('sidebarLabel')} className="flex h-full flex-col">
      {/* Top row: logo + name, and the close / collapse button */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 pl-3 pr-2">
        <button
          type="button"
          onClick={() => go('home')}
          aria-label={t('backToStart', personal.firstName)}
          className="flex min-w-0 items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-ink/5"
        >
          <HackerLogo className="h-7 w-7 shrink-0" />
          <span aria-hidden="true" className="truncate font-mono text-[14px] text-ink">
            {personal.firstName.toLowerCase()}
            <span className="animate-blink text-accent">_</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t('closeSidebar')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {isDrawer ? <X size={18} aria-hidden="true" /> : <PanelLeftClose size={18} aria-hidden="true" />}
        </button>
      </div>

      {/* The lists (scroll on their own if the window is short) */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        <SidebarItem icon={SquarePen} label={t('newChat')} onClick={startNewChat} />

        <div className="mt-3 space-y-px">
          {SECTION_ITEMS.map((item) => (
            <SidebarItem
              key={item.labelKey}
              icon={item.icon}
              label={t(item.labelKey)}
              isActive={item.slides.includes(deck.activeId)}
              onClick={() => go(item.slides[0])}
            />
          ))}
        </div>

        <SidebarHeading>{t('topicProjects')}</SidebarHeading>
        <div className="space-y-px">
          {data.projects.map((project, index) => {
            const slideId = groupSlideId('projects', index)
            return (
              <SidebarItem
                key={project.id}
                icon={PROJECT_ICONS[project.type] || MessageSquare}
                label={project.title}
                isActive={deck.activeId === slideId}
                onClick={() => go(slideId)}
              />
            )
          })}
        </div>

        <SidebarHeading>{t('today')}</SidebarHeading>
        {chatTitle ? (
          <SidebarItem
            icon={MessageSquare}
            label={chatTitle}
            isActive={deck.activeId === 'home'}
            onClick={() => go('home')}
          />
        ) : (
          <p className="px-2.5 py-1.5 text-[13px] text-muted">{t('noChatsYet')}</p>
        )}
      </div>

      {/* How much of the portfolio has been seen — click for the next unseen part */}
      <div className="shrink-0 px-2 pb-2">
        <button
          type="button"
          onClick={showNextUnseen}
          aria-label={`${t('explored', percent)}. ${t('exploreNext')}`}
          className="group w-full rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-line-strong"
        >
          <span className="flex items-center justify-between text-[14px] font-medium text-ink">
            {t('exploreTitle')}
            <ChevronRight size={16} aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-0.5 block text-[12.5px] text-muted">
            {t('explored', percent)} · <span className="text-body">{t('exploreCheer', percent)}</span>
          </span>
          <span aria-hidden="true" className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-line-strong/70">
            <motion.span
              className="block h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: `${percent}%` }}
              transition={{ type: 'spring', stiffness: 160, damping: 26 }}
            />
          </span>
        </button>
      </div>

      {/* The person — asks the home chat for the contact details */}
      <div className="shrink-0 border-t border-line p-2">
        <button
          type="button"
          onClick={askForContact}
          aria-label={t('contactPerson', personal.firstName)}
          className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-ink/5"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[12px] font-medium text-accent-strong"
          >
            {initialsOf(personal.name)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink">{personal.name}</span>
          <Mail size={16} aria-hidden="true" className="shrink-0 text-muted" />
        </button>
      </div>
    </nav>
  )
}
