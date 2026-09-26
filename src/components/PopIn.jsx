import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { popVariants } from './motionVariants'

// ConversationBlock sets this to `false` until its answer has finished
// typing, so cards never pop before the AI has "said" its answer.
// Outside a ConversationBlock the default is `true`.
export const RevealContext = createContext(true)

// ─────────────────────────────────────────────────────────────
// The "wave" scheduler — this is what makes items pop ONE BY ONE.
//
// Items that become visible in the same moment (for example, all skills
// in view when the answer finishes) are collected for one animation frame,
// sorted into page order, and given increasing delays: 0s, 0.07s, 0.14s …
// An item that scrolls into view on its own gets no delay at all, so
// scrolling never feels laggy.
// ─────────────────────────────────────────────────────────────
const STEP_SECONDS = 0.07 // gap between two items in one wave
const MAX_WAVE_SECONDS = 0.9 // a long wave is compressed to this length

let waitingItems = []

function startWave() {
  // Page order: an element that comes first in the document pops first.
  // (A card also comes before the items inside it.)
  const wave = waitingItems.sort((a, b) =>
    a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )
  waitingItems = []
  const step = Math.min(STEP_SECONDS, MAX_WAVE_SECONDS / wave.length)
  wave.forEach((item, index) => item.onDelay(index * step))
}

function requestPop(element, onDelay) {
  waitingItems.push({ element, onDelay })
  // The first request of a wave schedules the wave for the next frame
  if (waitingItems.length === 1) requestAnimationFrame(startWave)
}

/**
 * PopIn — wraps anything that should pop in when it scrolls into view.
 *
 *   <PopIn as="li" className="…">React</PopIn>
 *
 * `as` picks the HTML tag (div, li, article, span …).
 * It pops when BOTH are true:
 *  - it is on screen (useInView = IntersectionObserver), and
 *  - its ConversationBlock has finished typing (RevealContext).
 */
export default function PopIn({ as = 'div', className, children }) {
  const ref = useRef(null)
  const isRevealed = useContext(RevealContext)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -6% 0px' })
  const reduceMotion = useReducedMotion()
  const [delay, setDelay] = useState(null) // null = not popped yet

  const shouldPop = isRevealed && isInView

  useEffect(() => {
    if (!shouldPop || delay !== null) return
    if (reduceMotion) setDelay(0)
    else requestPop(ref.current, setDelay)
  }, [shouldPop, delay, reduceMotion])

  // motion.div, motion.li, motion.article … chosen by the `as` prop
  const MotionTag = motion[as]

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={popVariants}
      custom={delay ?? 0}
      initial="hidden"
      animate={delay === null ? 'hidden' : 'shown'}
    >
      {children}
    </MotionTag>
  )
}
