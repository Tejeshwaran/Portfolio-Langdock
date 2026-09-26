import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  AudioLines,
  Brain,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Languages,
  Layers,
  Mail,
  Mic,
  Plus,
} from 'lucide-react'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import { useLanguage } from '../i18n/LanguageContext'

// Icon names from portfolioData.askPortfolio.topics → Lucide icons
const TOPIC_ICONS = {
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Layers,
  languages: Languages,
  contact: Mail,
  pillo: AudioLines,
}

/** Four small bars that bounce while voice mode is listening */
function ListeningBars() {
  return (
    <span className="flex h-4 items-center gap-[3px]" aria-hidden="true">
      {[0, 150, 300, 450].map((delayMs) => (
        <span
          key={delayMs}
          className="h-full w-[3px] animate-voice-bar rounded-full bg-canvas"
          style={{ animationDelay: `${delayMs}ms` }}
        />
      ))}
    </span>
  )
}

/**
 * PromptComposer — the rounded "Ask anything" bar.
 *
 *  [+]  Ask anything ……………  [Think] [mic] [● voice / ↑ send]
 *
 *  +      opens a menu of topics to ask about
 *  Think  toggles "Think" mode (answers show their reasoning steps)
 *  mic    dictation: your speech is typed into the field
 *  voice  voice mode: speak, the question is sent automatically and the
 *         answer is read aloud. When the field has text, this button
 *         becomes the send button.
 *
 * Voice uses the browser's Web Speech API (see useSpeechRecognition.js).
 *
 * Other components can control the bar through its ref:
 *   composerRef.current.focus()
 *   composerRef.current.typeAndSubmit('How can I contact Tejeshwaran?')
 * typeAndSubmit types the text letter by letter, like a person, and then
 * sends it. The header's "Contact" button uses this.
 */
const PromptComposer = forwardRef(function PromptComposer(
  {
    id,
    onSubmit,
    isBusy = false,
    thinkMode = false,
    onToggleThink,
    placeholder = 'Ask anything',
    topics = [],
    menuPlacement = 'down',
    size = 'large',
  },
  ref,
) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()

  // Always call the newest onSubmit, even from a delayed timer
  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // true while listening in voice mode (auto-send), false for dictation
  const isVoiceModeRef = useRef(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)

  const speech = useSpeechRecognition({
    onTranscript: (text) => setValue(text),
    onFinish: (text) => {
      if (isVoiceModeRef.current && text) {
        onSubmit(text, { fromVoice: true })
        setValue('')
      }
      isVoiceModeRef.current = false
      setIsVoiceMode(false)
    },
  })

  // Close the "+" menu on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return
    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setIsMenuOpen(false)
    }
    const handleKeyDown = (event) => event.key === 'Escape' && setIsMenuOpen(false)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  // ── Auto-typing (used by the header's "Contact" button) ──
  const [isAutoTyping, setIsAutoTyping] = useState(false)
  const autoTypeRef = useRef({ frameId: null, timeoutId: null })

  function stopAutoTyping() {
    cancelAnimationFrame(autoTypeRef.current.frameId)
    clearTimeout(autoTypeRef.current.timeoutId)
    setIsAutoTyping(false)
  }

  function typeAndSubmit(text) {
    stopAutoTyping()
    speech.stop()
    setIsMenuOpen(false)
    setIsAutoTyping(true)

    // After the last letter: a short pause (so it can be read), then send.
    function sendTypedText() {
      autoTypeRef.current.timeoutId = setTimeout(() => {
        setIsAutoTyping(false)
        setValue('')
        onSubmitRef.current(text, { fromVoice: false })
      }, 450)
    }

    if (reduceMotion) {
      setValue(text)
      sendTypedText()
      return
    }

    // Same idea as TypewriterText: each animation frame checks how much
    // time has passed and shows that many letters (one every 38 ms).
    const LETTER_MS = 38
    let startTime = null
    function typeFrame(now) {
      if (startTime === null) startTime = now
      const count = Math.min(text.length, Math.floor((now - startTime) / LETTER_MS) + 1)
      setValue(text.slice(0, count))
      if (count < text.length) autoTypeRef.current.frameId = requestAnimationFrame(typeFrame)
      else sendTypedText()
    }
    setValue('')
    autoTypeRef.current.frameId = requestAnimationFrame(typeFrame)
  }

  // Stop a running auto-type if the bar disappears
  useEffect(() => () => {
    cancelAnimationFrame(autoTypeRef.current.frameId)
    clearTimeout(autoTypeRef.current.timeoutId)
  }, [])

  // What the parent gets through `ref`
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    typeAndSubmit,
  }))

  const hasText = value.trim().length > 0
  const isDictating = speech.isListening && !isVoiceMode
  const isVoiceListening = speech.isListening && isVoiceMode

  function submitText() {
    if (!hasText || isBusy || isAutoTyping) return
    speech.stop()
    onSubmit(value.trim(), { fromVoice: false })
    setValue('')
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    submitText()
  }

  function toggleDictation() {
    if (speech.isListening) return speech.stop()
    isVoiceModeRef.current = false
    setIsVoiceMode(false)
    speech.start()
  }

  function toggleVoiceMode() {
    if (speech.isListening) return speech.stop()
    isVoiceModeRef.current = true
    setIsVoiceMode(true)
    setValue('')
    speech.start()
  }

  function pickTopic(topic) {
    setIsMenuOpen(false)
    onSubmit(topic.question, { fromVoice: false })
  }

  const isLarge = size === 'large'
  const iconButton =
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-white/10'

  return (
    <div className="w-full">
      <form
        onSubmit={handleFormSubmit}
        className={`relative flex items-center gap-1 rounded-full border bg-composer pl-2 pr-2 transition-[border-color,box-shadow] duration-300 focus-within:border-line-strong ${
          isAutoTyping ? 'border-accent/60 shadow-[0_0_0_4px_rgba(91,155,250,0.12)]' : 'border-line'
        } ${isLarge ? 'h-[60px]' : 'h-[52px]'}`}
      >
        {/* "+" topics menu */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-label={t('askAboutTopic')}
            className={iconButton}
          >
            <motion.span animate={{ rotate: isMenuOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
              <Plus size={isLarge ? 22 : 20} strokeWidth={1.75} aria-hidden="true" />
            </motion.span>
          </button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: menuPlacement === 'up' ? 6 : -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: menuPlacement === 'up' ? 6 : -6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className={`absolute left-0 z-30 w-60 rounded-2xl border border-line bg-surface p-1.5 shadow-lift ${
                  menuPlacement === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'
                }`}
              >
                <p className="px-2.5 pb-1 pt-1.5 text-xs text-muted">{t('askAbout')}</p>
                <ul>
                  {topics.map((topic) => {
                    const Icon = TOPIC_ICONS[topic.icon] || Layers
                    return (
                      <li key={topic.label}>
                        <button
                          type="button"
                          onClick={() => pickTopic(topic)}
                          className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-white/5"
                        >
                          <Icon size={16} aria-hidden="true" className="text-muted" />
                          {topic.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <label htmlFor={id} className="sr-only">
          {t('promptLabel')}
        </label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          readOnly={isAutoTyping}
          onChange={(event) => setValue(event.target.value)}
          placeholder={speech.isListening ? t('listening') : placeholder}
          autoComplete="off"
          enterKeyHint="send"
          className={`min-w-0 flex-1 bg-transparent px-2 text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none ${
            isLarge ? 'text-[17px]' : 'text-[15px]'
          }`}
        />

        {/* Think mode toggle */}
        <button
          type="button"
          onClick={onToggleThink}
          aria-pressed={thinkMode}
          className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[15px] transition-colors ${
            thinkMode ? 'bg-accent-soft text-accent' : 'text-body hover:bg-white/10'
          }`}
        >
          <Brain size={18} strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">{t('think')}</span>
          <span className="sr-only sm:hidden">{t('thinkMode')}</span>
        </button>

        {/* Dictation */}
        <button
          type="button"
          onClick={toggleDictation}
          aria-pressed={isDictating}
          aria-label={isDictating ? t('stopDictation') : t('dictate')}
          className={`${iconButton} ${isDictating ? 'bg-white/10 text-accent' : ''}`}
        >
          <Mic size={19} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {/* Voice mode ↔ send. The icon swaps with a small scale animation. */}
        {hasText && !speech.isListening ? (
          <button
            type="submit"
            disabled={isBusy}
            aria-label={t('send')}
            className={`flex shrink-0 items-center justify-center rounded-full bg-ink text-canvas transition-opacity disabled:opacity-40 ${
              isLarge ? 'h-11 w-11' : 'h-9 w-9'
            }`}
          >
            <ArrowUp size={20} strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggleVoiceMode}
            aria-pressed={isVoiceListening}
            aria-label={isVoiceListening ? t('stopVoice') : t('startVoice')}
            className={`flex shrink-0 items-center justify-center rounded-full bg-accent-fill text-canvas transition-transform hover:scale-105 ${
              isLarge ? 'h-11 w-11' : 'h-9 w-9'
            }`}
          >
            {isVoiceListening ? <ListeningBars /> : <AudioLines size={isLarge ? 20 : 18} aria-hidden="true" />}
          </button>
        )}
      </form>

      {/* Voice errors / hints (read out by screen readers) */}
      <p aria-live="polite" className="min-h-[1.25rem] px-5 pt-2 text-center text-xs text-muted">
        {speech.error}
      </p>
    </div>
  )
})

export default PromptComposer
