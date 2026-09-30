import { ArrowUpRight, Download, Github, Linkedin, Mail, Phone } from 'lucide-react'
import ConversationBlock from '../components/ConversationBlock'
import PopIn from '../components/PopIn'
import { useSlideDeck } from '../components/SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'

const pillButton =
  'inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-sm text-body transition-colors hover:border-line-strong hover:bg-ink/5 hover:text-ink'

/**
 * The last part: "Is that everything?" → the contact card.
 *
 * The call to action ("Let's build something useful.") with direct actions:
 * email, phone, CV download, GitHub and LinkedIn (hidden while its URL is
 * empty). Under them the personal details from the CV. Questions can still
 * be asked in the prompt box at the bottom of the slide.
 */
export default function Footer() {
  const { data, t } = useLanguage()
  const { personal, conversation } = data
  const deck = useSlideDeck()

  const actions = [
    { label: t('emailHim'), icon: Mail, href: `mailto:${personal.email}`, isPrimary: true },
    { label: t('downloadCv'), icon: Download, href: personal.cv, isDownload: true },
    { label: personal.phone, icon: Phone, href: personal.phone && `tel:${personal.phone.replace(/\s/g, '')}` },
    { label: 'GitHub', icon: Github, href: personal.github, isExternal: true },
    { label: 'LinkedIn', icon: Linkedin, href: personal.linkedin, isExternal: true },
  ].filter((action) => action.href)

  // Details exactly as on the CV (empty ones are left out)
  const details = [
    { label: t('email'), value: personal.email },
    { label: t('addressLabel'), value: personal.address },
    { label: t('birthDateLabel'), value: personal.birthDate },
  ].filter((detail) => detail.value)

  // "Start a new conversation": back to the home screen, cursor in the prompt box
  async function startNewConversation() {
    await deck.goTo('home')
    document.getElementById('hero-prompt')?.focus({ preventScroll: true })
  }

  return (
    <footer id="contact" className="pb-8 pt-12 sm:pt-16">
      <ConversationBlock topic={t('topicContact')} question={conversation.closing.question} answer={conversation.closing.answer}>
        <PopIn className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
          <p className="font-display text-2xl font-medium tracking-[-0.03em] text-ink sm:text-[28px]">
            {conversation.closing.cta}
          </p>
          <p className="mt-1 text-sm text-body">
            {personal.name} · {personal.role} · {personal.location}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {actions.map(({ label, icon: Icon, href, isPrimary, isDownload, isExternal }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(isDownload ? { download: '' } : {})}
                  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={
                    isPrimary
                      ? 'inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-90'
                      : pillButton
                  }
                >
                  <Icon size={15} aria-hidden="true" />
                  {label}
                  {isExternal && <span className="sr-only">{t('opensInNewTab')}</span>}
                </a>
              </li>
            ))}
          </ul>

          <dl className="mt-5 grid gap-x-6 gap-y-2 border-t border-line pt-4 text-sm sm:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.label} className="min-w-0">
                <dt className="text-[11px] text-muted">{detail.label}</dt>
                <dd className="break-words text-ink">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </PopIn>

        <PopIn className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={startNewConversation}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-ink shadow-card transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-lift"
          >
            {t('startNewConversation')}
            <ArrowUpRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </PopIn>
      </ConversationBlock>
    </footer>
  )
}
