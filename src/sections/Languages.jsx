import ConversationBlock from '../components/ConversationBlock'
import LanguageCard from '../components/LanguageCard'
import { useLanguage } from '../i18n/LanguageContext'

export default function Languages() {
  const { data, t } = useLanguage()
  const { conversation, languages } = data

  return (
    <section id="languages" aria-label={t('topicLanguages')} className="py-12 sm:py-16">
      <ConversationBlock
        topic={t('topicLanguages')}
        question={conversation.languages.question}
        answer={conversation.languages.answer}
      >
        {/* Three columns from laptop width; this slide is a little wider (App.jsx: wide) */}
        <div className="grid gap-3 lg:grid-cols-3">
          {languages.map((language) => (
            <LanguageCard key={language.id} language={language} />
          ))}
        </div>
      </ConversationBlock>
    </section>
  )
}
