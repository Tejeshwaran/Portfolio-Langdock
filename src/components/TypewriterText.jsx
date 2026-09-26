import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Cursor from './Cursor'

/**
 * TypewriterText — reveals `text` one character at a time.
 *
 * Props
 *  - text        the full string to type
 *  - speed       milliseconds between characters (lower = faster)
 *  - delay       milliseconds to wait before typing starts
 *  - start       typing only begins when this is true (e.g. "is visible")
 *  - onComplete  called once when the last character is shown
 *  - restartKey  change this value to type the text again from the start
 *  - cursorClassName  colour of the blinking cursor (default: blue accent)
 *
 * How it avoids layout jumps:
 *  The full text is rendered INVISIBLY to reserve its final size.
 *  The typed part is drawn on top of it with `position: absolute`.
 *  So the page never grows line-by-line while typing, and scrolling
 *  stays smooth.
 *
 * Accessibility:
 *  Screen readers get the full text at once (sr-only span); the animated
 *  copy is aria-hidden so it is not read out letter by letter.
 */
export default function TypewriterText({
  text,
  speed = 10,
  delay = 0,
  start = true,
  onComplete,
  restartKey,
  className = '',
  cursorClassName,
}) {
  const reduceMotion = useReducedMotion()
  const [visibleCount, setVisibleCount] = useState(0)

  // Keep the latest onComplete in a ref, so a new function passed by the
  // parent on every render does not restart the typing effect below.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  const hasCompletedRef = useRef(false)

  // 1) The typing loop
  useEffect(() => {
    setVisibleCount(0)
    hasCompletedRef.current = false
    if (!start) return

    // Reduced motion: show everything immediately, no typing.
    if (reduceMotion) {
      setVisibleCount(text.length)
      return
    }

    // Typing is driven by requestAnimationFrame (once per screen refresh)
    // instead of a fast setInterval. Each frame asks: "how much time has
    // passed?" and shows that many characters. So the speed is the same on
    // a slow phone and a fast PC, and React renders at most once per frame.
    let frameId
    let startTime = null

    function typeFrame(now) {
      if (startTime === null) startTime = now
      const count = Math.min(text.length, Math.floor((now - startTime) / speed) + 1)
      setVisibleCount(count) // same number as last frame → React skips the render
      if (count < text.length) frameId = requestAnimationFrame(typeFrame)
    }

    const timeoutId = setTimeout(() => {
      frameId = requestAnimationFrame(typeFrame)
    }, delay)

    // Cleanup runs if the component unmounts or a prop changes mid-typing.
    return () => {
      clearTimeout(timeoutId)
      cancelAnimationFrame(frameId)
    }
  }, [text, speed, delay, start, reduceMotion, restartKey])

  // 2) Fire onComplete exactly once, when the last character appears
  useEffect(() => {
    if (start && !hasCompletedRef.current && visibleCount >= text.length) {
      hasCompletedRef.current = true
      onCompleteRef.current?.()
    }
  }, [visibleCount, start, text.length])

  const isTyping = start && visibleCount < text.length

  return (
    <span className={`relative block ${className}`}>
      <span className="sr-only">{text}</span>
      {/* Invisible copy: reserves the final height of the paragraph */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      {/* Visible typed copy, drawn on top of the reserved space */}
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, visibleCount)}
        {isTyping && <Cursor className={cursorClassName} />}
      </span>
    </span>
  )
}
