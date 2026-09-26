import { useEffect, useRef, useState } from 'react'
import { buildThoughtSteps, findAnswer } from '../utils/answerEngine'
import { useLanguage } from '../i18n/LanguageContext'
import { announceLanguageSwitch } from '../utils/askEvents'

// Timings in milliseconds
const NORMAL_THINKING_TIME = 650 // short pause before a normal answer
const THINK_STEP_TIME = 450 // time per visible step in "Think" mode
const COMMAND_DELAY = 1200 // wait after an answer before running its command

/** Read an answer aloud with the browser's built-in speech synthesis. */
function speakText(text, language) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = language === 'de' ? 'de-DE' : 'en-US'
  window.speechSynthesis.speak(utterance)
}

function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}

/**
 * usePortfolioChat — all the state of one chat window.
 * Used by the home screen (Hero.jsx) and the Ask section (AskPortfolio.jsx).
 *
 * A message looks like:
 *  { id, role: 'user' | 'ai', text, animate, thoughts, thoughtSeconds, link, details }
 *
 * Some answers carry a command. "Change the entire website to German"
 * answers first, then (after COMMAND_DELAY) switches the language, clears
 * this chat and announces the switch — so the home screen shows its
 * headline again, in the new language.
 */
export default function usePortfolioChat({ initialMessages = [] } = {}) {
  const { data, language, setLanguage, t } = useLanguage()
  const [messages, setMessages] = useState(initialMessages)
  const [isThinking, setIsThinking] = useState(false)
  const [thinkMode, setThinkMode] = useState(false)
  // In "Think" mode: the steps that are already visible while thinking
  const [liveThoughts, setLiveThoughts] = useState([])

  const timersRef = useRef([])
  const nextIdRef = useRef(initialMessages.length + 1)

  function clearTimers() {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  // Stop timers and speech when the chat disappears
  useEffect(
    () => () => {
      clearTimers()
      stopSpeaking()
    },
    [],
  )

  function addMessage(message) {
    setMessages((previous) => [...previous, { id: nextIdRef.current++, ...message }])
  }

  /** Run an answer's command, e.g. switch the website language. */
  function runCommand(command) {
    if (command?.type === 'set-language') {
      setLanguage(command.language)
      reset()
      announceLanguageSwitch()
    }
  }

  /**
   * Ask a question.
   * options.speak = true reads the answer aloud (used by voice mode).
   */
  function ask(question, { speak = false } = {}) {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isThinking) return

    stopSpeaking()
    addMessage({ role: 'user', text: trimmedQuestion })

    const engine = { askPortfolio: data.askPortfolio, language, t }
    const result = findAnswer(trimmedQuestion, engine)
    const steps = thinkMode ? buildThoughtSteps(trimmedQuestion, result, engine) : null
    const startedAt = performance.now()
    setIsThinking(true)
    setLiveThoughts([])

    // In "Think" mode, reveal one reasoning step after another
    if (steps) {
      steps.forEach((step, index) => {
        timersRef.current.push(
          setTimeout(() => setLiveThoughts((shown) => [...shown, step]), index * THINK_STEP_TIME),
        )
      })
    }

    const totalThinkingTime = steps ? steps.length * THINK_STEP_TIME + 250 : NORMAL_THINKING_TIME

    timersRef.current.push(
      setTimeout(() => {
        setIsThinking(false)
        setLiveThoughts([])
        addMessage({
          role: 'ai',
          text: result.answer,
          link: result.link,
          details: result.details,
          animate: true,
          thoughts: steps,
          thoughtSeconds: ((performance.now() - startedAt) / 1000).toFixed(1),
        })
        if (speak) speakText(result.answer, language)
        if (result.command) {
          timersRef.current.push(setTimeout(() => runCommand(result.command), COMMAND_DELAY))
        }
      }, totalThinkingTime),
    )
  }

  /** Start over with only the initial messages. */
  function reset() {
    clearTimers()
    stopSpeaking()
    setIsThinking(false)
    setLiveThoughts([])
    setMessages(initialMessages)
  }

  return {
    messages,
    isThinking,
    liveThoughts,
    thinkMode,
    toggleThinkMode: () => setThinkMode((isOn) => !isOn),
    ask,
    reset,
  }
}
