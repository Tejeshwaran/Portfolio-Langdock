import { useContext, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import ChatMessage from './ChatMessage'
import MessageActions from './MessageActions'
import ThinkingDots from './ThinkingDots'
import TypewriterText from './TypewriterText'
import { RevealContext } from './PopIn'
import { SlideActiveContext } from './SlideDeck'

// The life of one question → answer exchange, in order.
const STAGE = {
  IDLE: 0, // not on screen yet
  QUESTION: 1, // user bubble slides in
  THINKING: 2, // AI avatar appears with "Thinking…"
  TYPING: 3, // answer types character by character
  DONE: 4, // cards pop in, one by one, as they scroll into view
}

// Timings in milliseconds. Kept short on purpose: it should feel like
// the AI responds, but a recruiter should never wait for it
// (a 300-character answer is fully typed in about 1.2 seconds).
const QUESTION_TO_THINKING = 200
const THINKING_DURATION = 300
const TYPING_SPEED = 4 // ms per character

/**
 * ConversationBlock — a reusable "user asks, AI answers" unit.
 *
 * Props
 *  - question          text of the user bubble
 *  - answer            text the AI types out
 *  - children          cards shown after the answer finishes typing
 *  - delay             extra wait (ms) before the sequence starts
 *  - topic             optional small label above the block (helps scanning)
 *  - startImmediately  start without waiting to be scrolled into view
 *
 * The sequence starts when the block's slide is the visible one
 * (SlideActiveContext) and the block is on screen (`useInView`,
 * IntersectionObserver); timers then walk through the stages above.
 * With "reduce motion" switched on, it skips straight to the finished state.
 *
 * After the answer is typed, RevealContext switches to `true`, and every
 * <PopIn> inside the cards pops as soon as it is on screen.
 */
export default function ConversationBlock({
  question,
  answer,
  children,
  delay = 0,
  topic,
  startImmediately = false,
}) {
  const blockRef = useRef(null)
  const isInView = useInView(blockRef, { once: true, margin: '0px 0px -20% 0px' })
  const reduceMotion = useReducedMotion()
  const [stage, setStage] = useState(STAGE.IDLE)
  // Goes up by one each time "regenerate" is pressed
  const [runId, setRunId] = useState(0)

  // In slide mode, wait until this block's slide is the visible one
  const isSlideActive = useContext(SlideActiveContext)
  const shouldStart = isSlideActive && (startImmediately || isInView)

  // Schedule the stages with timers once the block becomes active.
  useEffect(() => {
    if (!shouldStart) return

    // Reduced motion: skip straight to the finished state.
    if (reduceMotion) {
      setStage(STAGE.DONE)
      return
    }

    const timers = [
      setTimeout(() => setStage(STAGE.QUESTION), delay),
      setTimeout(() => setStage(STAGE.THINKING), delay + QUESTION_TO_THINKING),
      setTimeout(() => setStage(STAGE.TYPING), delay + QUESTION_TO_THINKING + THINKING_DURATION),
      // TYPING → DONE is triggered by TypewriterText's onComplete below.
    ]
    return () => timers.forEach(clearTimeout)
  }, [shouldStart, reduceMotion, delay])

  // "Regenerate": think for a moment, then type the answer again
  useEffect(() => {
    if (runId === 0) return
    const timer = setTimeout(() => setStage(STAGE.TYPING), THINKING_DURATION)
    return () => clearTimeout(timer)
  }, [runId])

  function regenerate() {
    if (reduceMotion) return
    setStage(STAGE.THINKING)
    setRunId((id) => id + 1)
  }

  const showCards = stage === STAGE.DONE

  return (
    <motion.div ref={blockRef} className="space-y-5">
      {/* The topic is the slide's heading (h2), so screen readers get a clear outline */}
      {topic && (
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-muted">{topic}</h2>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>
      )}

      <ChatMessage role="user" visible={stage >= STAGE.QUESTION}>
        {question}
      </ChatMessage>

      <ChatMessage
        role="ai"
        visible={stage >= STAGE.THINKING}
        actions={<MessageActions text={answer} onRegenerate={regenerate} visible={showCards} />}
      >
        <div className="relative">
          {stage === STAGE.THINKING && (
            <div className="absolute left-0 top-0">
              <ThinkingDots />
            </div>
          )}
          <TypewriterText
            text={answer}
            speed={TYPING_SPEED}
            start={stage >= STAGE.TYPING}
            restartKey={runId}
            onComplete={() => setStage(STAGE.DONE)}
          />
        </div>
      </ChatMessage>

      {children && (
        // Cards are always rendered, so their space is reserved (no jumps).
        // Until the answer is typed they are `visibility: hidden`, which also
        // keeps their links out of the keyboard tab order.
        <RevealContext.Provider value={showCards}>
          <div className="sm:pl-11" style={{ visibility: showCards ? 'visible' : 'hidden' }}>
            {children}
          </div>
        </RevealContext.Provider>
      )}
    </motion.div>
  )
}
