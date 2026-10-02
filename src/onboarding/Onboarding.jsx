import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CornerDownLeft } from 'lucide-react'
import TypewriterText from '../components/TypewriterText'
import { canScrollInside } from '../components/SlideDeck'
import { useLanguage } from '../i18n/LanguageContext'
import HackerLogo from '../components/HackerLogo'

// ─────────────────────────────────────────────────────────────
// Onboarding — the welcome page shown before the portfolio, with small
// "command prompt" details (mono labels, boot log), in the same look as
// the site: a short letter to the Langdock team, his quote, and a
// "booting" terminal.
//
// Enter / arrow keys / mouse wheel / swipe / "Start the conversation" open
// the portfolio; Esc or "Skip intro" does too. It lies ABOVE the chat:
// scrolling up on the chat's first slide brings it back (App.jsx).
// The code still supports more pages (add them to `pages` and raise
// STEP_COUNT). All texts are in portfolioData.js (onboarding) and uiText.js.
// ─────────────────────────────────────────────────────────────

const STEP_COUNT = 1
const INPUT_LOCK_MS = 700 // one wheel flick = one page
const EASE = [0.22, 1, 0.36, 1]

// Page change: the old page fades up and out, the new one rises in
const pageVariants = {
  enter: (direction) => ({ opacity: 0, y: direction > 0 ? 28 : -28 }),
  shown: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  leave: (direction) => ({ opacity: 0, y: direction > 0 ? -28 : 28, transition: { duration: 0.3, ease: 'easeIn' } }),
}

// Children of a page appear one after another
const listVariants = { shown: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }
const itemVariants = {
  enter: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

/** Small uppercase label above a headline */
function Eyebrow({ children }) {
  return (
    <motion.p variants={itemVariants} className="font-code text-[11px] uppercase tracking-[0.18em] text-term-muted">
      {children}
    </motion.p>
  )
}

/** The big headline */
function Title({ children }) {
  return (
    <motion.h1
      variants={itemVariants}
      className="mt-4 font-display text-[40px] font-medium leading-[1.05] tracking-[-0.04em] text-term-ink sm:text-[64px]"
    >
      {children}
    </motion.h1>
  )
}

/**
 * A terminal that "boots" the portfolio: each line types itself after the
 * previous one, then its status ("ok") appears at the end of a dotted line.
 */
function BootLog({ lines }) {
  const [finishedLines, setFinishedLines] = useState(0)

  return (
    <motion.div
      variants={itemVariants}
      // Decoration only: hidden on short screens, so the letter and the quote always fit
      className="mt-8 rounded-xl border border-term-line bg-term-panel px-4 py-4 text-left font-code text-[12.5px] leading-7 sm:px-5 sm:text-[13px] [@media(max-height:859px)]:hidden"
      aria-label="Terminal"
    >
      {lines.map((line, index) => {
        const isDone = index < finishedLines
        return (
          <div key={index} className="flex items-baseline">
            <span aria-hidden="true" className={`w-5 shrink-0 ${line.isCommand ? 'text-term-accent' : ''}`}>
              {line.isCommand ? '›' : ''}
            </span>
            <span className={`min-w-0 ${line.isCommand ? 'text-term-ink' : 'text-term-muted'}`}>
              {/* start stays true once reached, so finished lines stay visible */}
              <TypewriterText
                text={line.text}
                speed={22}
                delay={index === 0 ? 500 : 120}
                start={index <= finishedLines}
                onComplete={() => setFinishedLines((count) => Math.max(count, index + 1))}
                cursorClassName="bg-term-accent"
              />
            </span>
            {line.status && (
              <>
                <span
                  aria-hidden="true"
                  className={`mx-2 hidden flex-1 -translate-y-1 border-b border-dotted border-term-line transition-opacity duration-300 sm:block ${
                    isDone ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span
                  className={`ml-2 shrink-0 text-term-green transition-opacity duration-300 sm:ml-0 ${
                    isDone ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {line.status}
                </span>
              </>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}

/** Page 1 — hello: a short letter, his quote, and the "booting" terminal */
function HelloPage({ content }) {
  const { data } = useLanguage()
  return (
    <motion.div variants={listVariants} initial="enter" animate="shown" className="mx-auto max-w-2xl text-center">
      <Eyebrow>{content.eyebrow}</Eyebrow>
      <Title>{content.title}</Title>
      <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-term-muted">
        {content.body}
      </motion.p>
      <motion.figure variants={itemVariants} className="mx-auto mt-6 max-w-xl border-l-2 border-term-accent pl-4 text-left">
        <blockquote className="font-display text-[18px] font-medium leading-snug tracking-[-0.01em] text-term-ink sm:text-[20px]">
          {data.personal.quote}
        </blockquote>
        <figcaption className="mt-2 font-code text-[12.5px] text-term-muted">{content.signature}</figcaption>
      </motion.figure>
      <BootLog lines={content.bootLines} />
    </motion.div>
  )
}

/** EN | DE — in the intro the language switches straight away */
function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage()
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
      aria-label={t('changeLanguage')}
      className="flex items-center rounded-full border border-term-line p-0.5 font-code text-[11px]"
    >
      {['en', 'de'].map((code) => (
        <span
          key={code}
          className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors duration-300 ${
            language === code ? 'text-term-bg' : 'text-term-muted'
          }`}
        >
          {language === code && (
            <motion.span
              layoutId="onboarding-language-pill"
              className="absolute inset-0 -z-10 rounded-full bg-term-ink"
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          {code}
        </span>
      ))}
    </button>
  )
}

/**
 * Onboarding — the full-screen intro.
 * Props:
 *  onFinish()  called by "Start the conversation", "Skip intro" or Esc
 *  fromAbove   true = the visitor scrolled back up from the chat, so the
 *              page slides down into view (first visit: it only fades in)
 */
export default function Onboarding({ onFinish, fromAbove = false }) {
  const { data, t } = useLanguage()
  const content = data.onboarding
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)

  const scrollAreaRef = useRef(null)
  const containerRef = useRef(null)
  const stepRef = useRef(0)
  // A short pause at the start: a trackpad still "gliding" from the scroll
  // that opened this page must not close it again
  const ignoreInputUntilRef = useRef(performance.now() + INPUT_LOCK_MS)
  const touchRef = useRef(null)

  /** Go one page forward (+1) or back (-1). After the last page: finish. */
  function move(delta) {
    const next = stepRef.current + delta
    if (next < 0) return
    if (next >= STEP_COUNT) return onFinishRef.current()
    stepRef.current = next
    ignoreInputUntilRef.current = performance.now() + INPUT_LOCK_MS
    setDirection(delta)
    setStep(next)
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0
  }

  // The newest functions, for the listeners below (added only once)
  const moveRef = useRef(move)
  moveRef.current = move
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  // Keyboard focus starts inside the intro
  useEffect(() => containerRef.current?.focus({ preventScroll: true }), [])

  // Keyboard: Enter / → / ↓ = next, ← / ↑ = back, Esc = skip
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') return onFinishRef.current()
      // Enter / Space on a button or link: let the button do its own job
      const isControl = ['BUTTON', 'A', 'INPUT'].includes(event.target.tagName)
      if (isControl && (event.key === 'Enter' || event.key === ' ')) return
      if (['Enter', 'ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        moveRef.current(1)
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        moveRef.current(-1)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mouse wheel and swipes: one gesture = one page (same idea as SlideDeck)
  useEffect(() => {
    function handleWheel(event) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const now = performance.now()
      if (now < ignoreInputUntilRef.current) {
        event.preventDefault()
        ignoreInputUntilRef.current = Math.max(ignoreInputUntilRef.current, now + 180)
        return
      }
      const delta = event.deltaY > 0 ? 1 : -1
      if (canScrollInside(event.target, delta, scrollAreaRef.current)) return // tall page on a phone
      event.preventDefault()
      if (Math.abs(event.deltaY) >= 4) moveRef.current(delta)
    }
    function handleTouchStart(event) {
      const touch = event.touches[0]
      touchRef.current = {
        y: touch.clientY,
        canScrollDown: canScrollInside(event.target, 1, scrollAreaRef.current),
        canScrollUp: canScrollInside(event.target, -1, scrollAreaRef.current),
      }
    }
    function handleTouchEnd(event) {
      const start = touchRef.current
      touchRef.current = null
      if (!start || performance.now() < ignoreInputUntilRef.current) return
      const distance = start.y - event.changedTouches[0].clientY
      if (Math.abs(distance) < 60) return
      if (distance > 0 && !start.canScrollDown) moveRef.current(1)
      if (distance < 0 && !start.canScrollUp) moveRef.current(-1)
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const pages = [
    <HelloPage key="hello" content={content.hello} />,
  ]
  const isLastStep = step === STEP_COUNT - 1

  return (
    <motion.div
      ref={containerRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={t('onboardingLabel')}
      // Like a page above the chat: it moves up and away when the portfolio
      // starts, and comes back down when the visitor scrolls up again
      initial={{ opacity: 0, y: fromAbove ? -48 : 0 }}
      // (coming back: it waits until the chat has faded out)
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: fromAbove ? 0.3 : 0 } }}
      exit={{ opacity: 0, y: -48, transition: { duration: 0.35, ease: 'easeIn' } }}
      className="fixed inset-0 z-[60] flex flex-col bg-term-bg font-plex text-term-ink focus:outline-none"
    >
      {/* Top bar, as in the concept: name_ on the left, status on the right */}
      <header className="border-b border-term-line">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-5 sm:px-8">
          <span className="flex items-center gap-2 font-code text-[15px] text-term-ink">
            <HackerLogo className="h-9 w-9 shrink-0" />
            <span>
              tejeshwaran<span className="animate-blink text-term-accent">_</span>
            </span>
          </span>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-term-line px-3 py-1 font-code text-[11px] text-term-muted md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-term-green" aria-hidden="true" />
              {content.badge}
            </span>
            <LanguageSwitch />
            <button
              type="button"
              onClick={() => onFinishRef.current()}
              aria-label={t('skipIntro')}
              className="rounded-full px-3 py-1.5 font-code text-[12px] text-term-muted transition-colors hover:text-term-ink"
            >
              {/* Phones show only the arrow, so the bar fits */}
              <span className="hidden sm:inline">{t('skipIntro')} </span>→
            </button>
          </div>
        </div>
      </header>

      {/* The page (scrolls only if it is taller than a phone screen) */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto overscroll-contain">
        <div className="flex min-h-full flex-col justify-center px-5 py-10 sm:px-8">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div key={step} custom={direction} variants={pageVariants} initial="enter" animate="shown" exit="leave">
              {pages[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar: progress, hint, back / continue */}
      <footer className="border-t border-term-line">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between gap-4 px-5 sm:px-8">
          <div className="flex items-center gap-4">
            {/* Progress — only when there is more than one page */}
            {STEP_COUNT > 1 && (
              <>
            <div className="flex gap-1.5" aria-hidden="true">
              {Array.from({ length: STEP_COUNT }, (_, index) => (
                <span
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index === step ? 'w-8 bg-term-accent' : index < step ? 'w-4 bg-term-ink/50' : 'w-4 bg-term-line'
                  }`}
                />
              ))}
            </div>
            <span className="hidden whitespace-nowrap font-code text-[12px] text-term-muted sm:inline">
              {String(step + 1).padStart(2, '0')} / {String(STEP_COUNT).padStart(2, '0')}
            </span>
              </>
            )}
            <span className="hidden font-code text-[11px] text-term-muted/70 sm:inline">{t('onboardingHint')}</span>
          </div>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                type="button"
                onClick={() => move(-1)}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 font-code text-[13px] text-term-muted transition-colors hover:text-term-ink"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                <span className="hidden sm:inline">{t('back')}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => move(1)}
              className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-term-ink px-5 py-2.5 font-code text-[13px] font-medium text-term-bg transition-transform duration-200 hover:scale-[1.03]"
            >
              {isLastStep ? t('startConversation') : t('next')}
              <CornerDownLeft size={14} aria-hidden="true" className="opacity-70" />
            </button>
          </div>
        </div>
      </footer>
    </motion.div>
  )
}
