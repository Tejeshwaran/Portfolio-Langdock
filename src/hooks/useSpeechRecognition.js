import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

// The Web Speech API is built into Chrome, Edge and Safari (as
// webkitSpeechRecognition). Firefox does not have it.
const SpeechRecognitionAPI =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

// Browser error code → key of a friendly message in uiText.js
const ERROR_KEYS = {
  'not-allowed': 'micBlocked',
  'service-not-allowed': 'micBlocked',
  'no-speech': 'noSpeech',
  'audio-capture': 'noMic',
  network: 'voiceNetwork',
}

/**
 * useSpeechRecognition — turns speech into text with the browser's
 * built-in Web Speech API. No library and no API key.
 *
 *  onTranscript(text)  called while you speak (live text)
 *  onFinish(text)      called once when listening stops
 *
 * It listens in the website's current language (English or German).
 * Returns { isSupported, isListening, error, start, stop }.
 */
export default function useSpeechRecognition({ onTranscript, onFinish }) {
  const { language, t } = useLanguage()
  const isSupported = Boolean(SpeechRecognitionAPI)
  const [isListening, setIsListening] = useState(false)
  const [errorKey, setErrorKey] = useState('') // a uiText key, translated below
  const recognitionRef = useRef(null)

  // Always call the newest callbacks without restarting anything
  const callbacksRef = useRef({ onTranscript, onFinish })
  callbacksRef.current = { onTranscript, onFinish }

  const start = useCallback(() => {
    if (!isSupported) {
      setErrorKey('voiceUnsupported')
      return
    }
    recognitionRef.current?.abort()

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = language === 'de' ? 'de-DE' : 'en-US'
    recognition.interimResults = true // gives live text while speaking
    recognition.continuous = false // stops by itself after a pause

    let transcript = ''

    recognition.onresult = (event) => {
      // Join all result pieces into one sentence
      transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('')
      callbacksRef.current.onTranscript?.(transcript)
    }
    recognition.onerror = (event) => {
      if (event.error !== 'aborted') {
        setErrorKey(ERROR_KEYS[event.error] || 'voiceError')
      }
    }
    recognition.onend = () => {
      setIsListening(false)
      recognitionRef.current = null
      callbacksRef.current.onFinish?.(transcript.trim())
    }

    setErrorKey('')
    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, language])

  const stop = useCallback(() => recognitionRef.current?.stop(), [])

  // Stop the microphone if the component unmounts
  useEffect(() => () => recognitionRef.current?.abort(), [])

  return { isSupported, isListening, error: errorKey ? t(errorKey) : '', start, stop }
}
