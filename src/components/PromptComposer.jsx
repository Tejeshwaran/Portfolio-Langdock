import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  AudioLines,
  Briefcase,
  Check,
  FileText,
  FolderKanban,
  GraduationCap,
  HelpCircle,
  Languages,
  Layers,
  Lightbulb,
  Mail,
  Mic,
  Plus,
  Sparkles,
  UserRound,
} from 'lucide-react'
import AssistantMark from './AssistantMark'
import useDismiss from '../hooks/useDismiss'
import useSpeechRecognition from '../hooks/useSpeechRecognition'
import { useLanguage } from '../i18n/LanguageContext'
import { requestAsk } from '../utils/askEvents'

// Icon names from portfolioData.askPortfolio.topics → Lucide icons
export const TOPIC_ICONS = {
  education: GraduationCap,
  experience: Briefcase,
  projects: FolderKanban,
  skills: Layers,
  languages: Languages,
  contact: Mail,
  pillo: AudioLines,
  about: UserRound,
  why: Sparkles,
  cv: FileText,
  learning: Lightbulb,
  curiosity: HelpCircle,
}

/** Four small bars that bounce while voice mode is listening */
function ListeningBars() {
  return (
    <span className="flex h-4 items-center gap-[3px]" aria-hidden="true">
      {[0, 150, 300, 450].map((delayMs) => (
        <span
          key={delayMs}
          className="h-full w-[3px] animate-voice-bar rounded-full bg-accent"
          style={{ animationDelay: `${delayMs}ms` }}
        />
      ))}
    </span>
  )
}

/** A small on/off switch (used in the Plugins menu) */
function Switch({ isOn }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${isOn ? 'bg-accent' : 'bg-line-strong'}`}
    >
      <span
        className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${isOn ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
      />
    </span>
  )
}

/** The popup panel of a menu button (topics, plugins, answer mode) */
function MenuPanel({ placement, align = 'left', width = 'w-64', children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: placement === 'up' ? 6 : -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: placement === 'up' ? 6 : -6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`absolute z-30 ${width} rounded-2xl border border-line bg-surface p-1.5 shadow-lift ${
        align === 'right' ? 'right-0' : 'left-0'
      } ${placement === 'up' ? 'bottom-full mb-3' : 'top-full mt-3'}`}
    >
      {children}
    </motion.div>
  )
}

// The small coloured "app icons" stacked on the Plugins button
const PLUGIN_ICONS = [
  { icon: FileText, color: 'text-sky-400' },
  { icon: AudioLines, color: 'text-rose-400' },
  { icon: Languages, color: 'text-emerald-400' },
]

/**
 * PromptComposer — the rounded "Ask anything" box.
 *
 *  size="large" (home):     Ask anything ……………………………………………
 *                           [+] [◉◉◉ Plugins]        [◭ Auto] [mic] [↑]
 *  size="compact" (slides): [+]  Ask anything ……             [mic] [↑]
 *
 *  +        a menu of topics to ask about
 *  Plugins  what the assistant can use (all real):
 *             · Résumé data — always on, every answer comes from it
 *             · Voice mode  — on: the mic sends your spoken question by
 *                             itself and the answer is read aloud
 *             · English / German — asks the chat to switch the language
 *  Auto     the answer mode ("model" picker): Auto answers directly,
 *           Think shows each reasoning step first (thinkMode)
 *  mic      dictation: your speech is typed into the field
 *           (voice mode when that plugin is on)
 *  ↑        send (gray until there is text)
 *
 * Voice uses the browser's Web Speech API (see useSpeechRecognition.js).
 *
 * Other components can control the box through its ref:
 *   composerRef.current.focus()
 *   composerRef.current.typeAndSubmit('How can I contact Tejeshwaran?')
 * typeAndSubmit types the text letter by letter, like a person, and then
 * sends it. The contact and EN | DE buttons use this.
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
  const { data, language, t } = useLanguage()
  const reduceMotion = useReducedMotion()
  const isLarge = size === 'large'

  // Always call the newest onSubmit, even from a delayed timer
  const onSubmitRef = useRef(onSubmit)
  onSubmitRef.current = onSubmit

  // Which menu is open: null | 'topics' | 'plugins' | 'mode'
  const [openMenu, setOpenMenu] = useState(null)
  const topicsRef = useRef(null)
  const pluginsRef = useRef(null)
  const modeRef = useRef(null)

  // The "Voice mode" plugin
  const [isVoicePluginOn, setIsVoicePluginOn] = useState(false)

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

  // Close the open menu on outside click or Escape
  const openMenuRef = { topics: topicsRef, plugins: pluginsRef, mode: modeRef }[openMenu] || topicsRef
  useDismiss(openMenuRef, Boolean(openMenu), () => setOpenMenu(null))

  function toggleMenu(name) {
    setOpenMenu((current) => (current === name ? null : name))
  }

  // ── Auto-typing (used by the contact and EN | DE buttons) ──
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
    setOpenMenu(null)
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

  // Stop a running auto-type if the box disappears
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

  // The mic: dictation, or voice mode when the "Voice mode" plugin is on
  function toggleMic() {
    if (speech.isListening) return speech.stop()
    const useVoiceMode = isLarge && isVoicePluginOn
    isVoiceModeRef.current = useVoiceMode
    setIsVoiceMode(useVoiceMode)
    if (useVoiceMode) setValue('')
    speech.start()
  }

  function pickTopic(topic) {
    setOpenMenu(null)
    onSubmit(topic.question, { fromVoice: false })
  }

  function pickMode(wantsThink) {
    setOpenMenu(null)
    if (wantsThink !== thinkMode) onToggleThink?.()
  }

  function askToSwitchLanguage() {
    setOpenMenu(null)
    const { toGerman, toEnglish } = data.askPortfolio.languageQuestions
    requestAsk(language === 'en' ? toGerman : toEnglish)
  }

  const iconButton =
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink sm:h-9 sm:w-9'
  const menuRow = 'flex w-full items-start gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-ink/5'

  // ── The pieces of the box ──

  const topicsMenu = (
    <div ref={topicsRef} className="relative">
      <button
        type="button"
        onClick={() => toggleMenu('topics')}
        aria-expanded={openMenu === 'topics'}
        aria-haspopup="true"
        aria-label={t('askAboutTopic')}
        className={iconButton}
      >
        <motion.span animate={{ rotate: openMenu === 'topics' ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence>
        {openMenu === 'topics' && (
          <MenuPanel placement={menuPlacement} width="w-60">
            <p className="px-2.5 pb-1 pt-1.5 text-xs text-muted">{t('askAbout')}</p>
            <ul>
              {topics.map((topic) => {
                const Icon = TOPIC_ICONS[topic.icon] || Layers
                return (
                  <li key={topic.label}>
                    <button type="button" onClick={() => pickTopic(topic)} className={`${menuRow} items-center text-sm text-ink`}>
                      <Icon size={16} aria-hidden="true" className="text-muted" />
                      {topic.label}
                    </button>
                  </li>
                )
              })}
            </ul>
          </MenuPanel>
        )}
      </AnimatePresence>
    </div>
  )

  const pluginsMenu = (
    <div ref={pluginsRef} className="relative">
      <button
        type="button"
        onClick={() => toggleMenu('plugins')}
        aria-expanded={openMenu === 'plugins'}
        aria-haspopup="true"
        className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-2 text-[14px] font-medium text-body transition-colors hover:bg-ink/5 hover:text-ink sm:h-9 sm:px-2.5"
      >
        {/* Three small overlapping "app icons" */}
        <span className="flex items-center" aria-hidden="true">
          {PLUGIN_ICONS.map(({ icon: Icon, color }, index) => (
            <span
              key={index}
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full bg-subtle ring-2 ring-composer ${color} ${
                index > 0 ? '-ml-1.5' : ''
              }`}
            >
              <Icon size={12} strokeWidth={2.25} />
            </span>
          ))}
        </span>
        <span className="hidden sm:inline">{t('plugins')}</span>
        <span className="sr-only sm:hidden">{t('plugins')}</span>
      </button>
      <AnimatePresence>
        {openMenu === 'plugins' && (
          <MenuPanel placement={menuPlacement} width="w-72">
            <p className="px-2.5 pb-1 pt-1.5 text-xs text-muted">{t('pluginsTitle')}</p>
            <div className={`${menuRow} cursor-default hover:bg-transparent`}>
              <FileText size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-sky-400" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink">{t('pluginResume')}</span>
                <span className="block text-xs leading-snug text-muted">{t('pluginResumeText')}</span>
              </span>
              <span className="mt-0.5 shrink-0 text-xs text-muted">{t('alwaysOn')}</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isVoicePluginOn}
              onClick={() => setIsVoicePluginOn((isOn) => !isOn)}
              className={menuRow}
            >
              <AudioLines size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-rose-400" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink">{t('pluginVoice')}</span>
                <span className="block text-xs leading-snug text-muted">{t('pluginVoiceText')}</span>
              </span>
              <Switch isOn={isVoicePluginOn} />
            </button>
            <button type="button" onClick={askToSwitchLanguage} className={menuRow}>
              <Languages size={17} aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-400" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink">{t('pluginLanguage')}</span>
                <span className="block text-xs leading-snug text-muted">{t('pluginLanguageText')}</span>
              </span>
              <span className="mt-0.5 shrink-0 font-mono text-[11px] uppercase text-muted">{language}</span>
            </button>
          </MenuPanel>
        )}
      </AnimatePresence>
    </div>
  )

  // The answer-mode picker, shown like a model picker: [◭ Auto]
  const modeMenu = (
    <div ref={modeRef} className="relative">
      <button
        type="button"
        onClick={() => toggleMenu('mode')}
        aria-expanded={openMenu === 'mode'}
        aria-haspopup="true"
        aria-label={`${t('answerMode')}: ${thinkMode ? t('think') : t('modeAuto')}`}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-[14px] font-semibold text-ink transition-colors hover:bg-ink/5 sm:h-9 sm:px-2.5"
      >
        <AssistantMark className="h-4 w-4" />
        {thinkMode ? t('think') : t('modeAuto')}
      </button>
      <AnimatePresence>
        {openMenu === 'mode' && (
          <MenuPanel placement={menuPlacement} align="right" width="w-64">
            <p className="px-2.5 pb-1 pt-1.5 text-xs text-muted">{t('answerMode')}</p>
            {[
              { isThink: false, label: t('modeAuto'), text: t('modeAutoText') },
              { isThink: true, label: t('think'), text: t('modeThinkText') },
            ].map((mode) => (
              <button
                key={mode.label}
                type="button"
                role="menuitemradio"
                aria-checked={thinkMode === mode.isThink}
                onClick={() => pickMode(mode.isThink)}
                className={menuRow}
              >
                <AssistantMark className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-ink">{mode.label}</span>
                  <span className="block text-xs leading-snug text-muted">{mode.text}</span>
                </span>
                {thinkMode === mode.isThink && <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />}
              </button>
            ))}
          </MenuPanel>
        )}
      </AnimatePresence>
    </div>
  )

  const input = (
    <>
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
        // While listening it says so; a voice error shows here for a moment too
        placeholder={speech.isListening ? t('listening') : speech.error || placeholder}
        autoComplete="off"
        enterKeyHint="send"
        className={`min-w-0 bg-transparent text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none ${
          isLarge ? 'block w-full px-2.5 py-2 text-[16px] sm:text-[17px]' : 'flex-1 px-1 text-[15px] sm:px-2'
        }`}
      />
    </>
  )

  const micButton = (
    <button
      type="button"
      onClick={toggleMic}
      aria-pressed={speech.isListening}
      aria-label={
        isVoiceListening ? t('stopVoice') : isDictating ? t('stopDictation') : isLarge && isVoicePluginOn ? t('startVoice') : t('dictate')
      }
      className={`${iconButton} ${speech.isListening ? 'bg-accent-soft text-accent' : ''}`}
    >
      {isVoiceListening ? <ListeningBars /> : <Mic size={18} strokeWidth={1.75} aria-hidden="true" />}
    </button>
  )

  // Send: gray and disabled until there is text, like in chat apps
  const sendButton = (
    <button
      type="submit"
      disabled={!hasText || isBusy}
      aria-label={t('send')}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-default ${
        hasText ? 'bg-ink text-canvas' : 'bg-line-strong/70 text-muted'
      } ${hasText && isBusy ? 'opacity-40' : ''}`}
    >
      <ArrowUp size={19} strokeWidth={2.25} aria-hidden="true" />
    </button>
  )

  return (
    <div className="w-full">
      <form
        onSubmit={handleFormSubmit}
        className={`relative rounded-[18px] border bg-composer transition-[border-color,box-shadow] duration-300 focus-within:border-line-strong ${
          isAutoTyping ? 'border-accent/60 shadow-[0_0_0_4px_rgb(var(--c-accent)/0.14)]' : 'border-line'
        } ${isLarge ? 'px-2 pb-2 pt-2' : 'flex h-[52px] items-center gap-1 px-2 shadow-lift'}`}
      >
        {isLarge ? (
          <>
            {input}
            <div className="mt-1.5 flex items-center gap-0.5">
              {topicsMenu}
              {pluginsMenu}
              <div className="flex-1" />
              {modeMenu}
              {micButton}
              {sendButton}
            </div>
          </>
        ) : (
          <>
            {topicsMenu}
            {input}
            {micButton}
            {sendButton}
          </>
        )}
      </form>

      {/* Voice errors / hints, read out by screen readers */}
      <p aria-live="polite" className="sr-only">
        {speech.error}
      </p>
    </div>
  )
})

export default PromptComposer
