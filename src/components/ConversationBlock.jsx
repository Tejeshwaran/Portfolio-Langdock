import { useContext, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import ChatMessage from './ChatMessage'
import ThinkingDots from './ThinkingDots'
import TypewriterText from './TypewriterText'
import { RevealContext } from './PopIn'
import useScrollFade from '../hooks/useScrollFade'
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
// the AI responds, but never make the visitor wait.
const QUESTION_TO_THINKING = 300
const THINKING_DURATION = 450
const TYPING_SPEED = 7 // ms per character

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
 * Two kinds of scroll animation happen here:
 *
 *  1. Scroll-TRIGGERED sequence. `useInView` (IntersectionObserver) notices
 *     when the block's top passes 80% of the screen height, and timers walk
 *     through the stages above. `once: true` = it plays only the first time.
 *
 *  2. Scroll-LINKED motion (hooks/useScrollFade.js). The block rises a
 *     little as it comes in and — with the 'fade' scroll effect — fades out
 *     near the top of the screen while the next block comes in. It follows
 *     the scroll position directly, in both directions, without
 *     re-rendering React.
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

  const scrollStyle = useScrollFade(blockRef)

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

  const showCards = stage === STAGE.DONE

  return (
    <motion.div ref={blockRef} className="space-y-5" style={scrollStyle}>
      {topic && (
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{topic}</span>
          <span className="h-px flex-1 bg-line" />
        </div>
      )}

      <ChatMessage role="user" visible={stage >= STAGE.QUESTION}>
        {question}
      </ChatMessage>

      <ChatMessage role="ai" visible={stage >= STAGE.THINKING}>
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
