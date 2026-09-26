import { lazy, Suspense, useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import useScrollFade from '../hooks/useScrollFade'

// Lazy loading: the chat widget's code is split into its own small file
// and only downloaded when React first renders it. The first screen of the
// site therefore loads a little faster.
const AskPortfolio = lazy(() => import('../components/AskPortfolio'))

// Same size as the real widget, so nothing jumps when it arrives
function ChatPlaceholder() {
  return <div className="h-[620px] rounded-3xl border border-line bg-surface" aria-hidden="true" />
}

export default function AskPortfolioSection() {
  const { data, language, t } = useLanguage()
  const sectionRef = useRef(null)
  const sectionFade = useScrollFade(sectionRef)

  return (
    <motion.section ref={sectionRef} style={sectionFade} id="ask" aria-labelledby="ask-title" className="py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">{t('tryIt')}</p>
        <h2 id="ask-title" className="mt-3 font-display text-[30px] font-medium leading-tight tracking-[-0.02em] text-ink sm:text-[40px]">
          {data.askPortfolio.heading}
        </h2>
        <p className="mt-2 max-w-lg text-[15px] text-body">
          {t('askIntro')}
        </p>

        <div className="mt-6">
          <Suspense fallback={<ChatPlaceholder />}>
            <AskPortfolio key={language} />
          </Suspense>
        </div>
      </motion.div>
    </motion.section>
  )
}
