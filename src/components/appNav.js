import {
  AudioLines,
  BarChart3,
  Briefcase,
  CircleDot,
  Globe,
  GraduationCap,
  Languages,
  Layers,
  Mail,
  Sparkles,
  UserRound,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// appNav.js — which sidebar item belongs to which slide(s), and the
// title the top bar shows for each slide.
// The slide ids are made in App.jsx (e.g. 'skills', 'skills-2', …).
// ─────────────────────────────────────────────────────────────

/** Slide id of the n-th item of a group: 0 → 'skills', 1 → 'skills-2' … */
export function groupSlideId(group, index) {
  return index === 0 ? group : `${group}-${index + 1}`
}

/** The sidebar's section list. `slides` = the slides this item stands for. */
export const SECTION_ITEMS = [
  { labelKey: 'topicAbout', icon: UserRound, slides: ['about'] },
  { labelKey: 'topicEducation', icon: GraduationCap, slides: ['education', 'education-2'] },
  { labelKey: 'topicExperience', icon: Briefcase, slides: ['experience'] },
  { labelKey: 'topicSkills', icon: Layers, slides: ['skills', 'skills-2', 'skills-3'] },
  { labelKey: 'topicLanguages', icon: Languages, slides: ['languages'] },
  { labelKey: 'topicBeyond', icon: CircleDot, slides: ['beyond'] },
  { labelKey: 'topicWhy', icon: Sparkles, slides: ['why'] },
  { labelKey: 'topicContact', icon: Mail, slides: ['contact'] },
]

// Project type (portfolioData.js) → icon in the sidebar's "Projects" list
export const PROJECT_ICONS = { dashboard: BarChart3, web: Globe, app: AudioLines }

/**
 * The top bar's title for a slide, like a chat app shows the chat's name.
 * The home slide shows the chat's first question (empty while no chat).
 */
export function slideTitle(slideId, { data, t, chatTitle }) {
  if (!slideId) return ''
  if (slideId === 'home') return chatTitle

  const [group, number] = slideId.split('-')
  const index = number ? Number(number) - 1 : 0
  if (group === 'projects') return data.projects[index]?.title || t('topicProjects')
  if (group === 'education') return `${t('topicEducation')} · ${data.education[index]?.level}`
  if (group === 'skills') return `${t('topicSkills')} · ${data.skills[index]?.name}`

  const item = SECTION_ITEMS.find((section) => section.slides.includes(slideId))
  return item ? t(item.labelKey) : ''
}
