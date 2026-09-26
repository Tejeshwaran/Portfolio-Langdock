import { useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { isFadeScroll, isSlideMode } from '../config/scrollEffect'

/**
 * useScrollFade — scroll-LINKED movement for one segment of the page.
 * Put the returned style on a motion element that has `ref`:
 *
 *   const ref = useRef(null)
 *   const style = useScrollFade(ref)
 *   <motion.div ref={ref} style={style}>…</motion.div>
 *
 * Two scroll measurements (useScroll gives 0 → 1 while the element moves
 * between the two positions in `offset`):
 *
 *  enter  'start end' → 'start 0.6'
 *         the segment's TOP travels from the bottom of the screen to 60%.
 *         It drifts up 48px → 0 (the gentle rise you already know).
 *
 *  leave  'end 0.5' → 'end 0.1'
 *         the segment's BOTTOM travels from the middle of the screen to
 *         near the top. It fades 1 → 0, lifts a little and shrinks to 98%,
 *         while the next segment comes in below it.
 *
 * Everything runs on motion values: Framer Motion writes opacity and
 * transform straight to the element on each frame, without re-rendering
 * React — so it stays smooth on phones.
 */
export default function useScrollFade(ref) {
  const reduceMotion = useReducedMotion()

  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start 0.6'] })
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ['end 0.5', 'end 0.1'] })

  const enterY = useTransform(enter, [0, 1], [48, 0])
  const leaveY = useTransform(leave, [0, 1], [0, -32])
  // Both movements added together into one `y`
  const y = useTransform([enterY, leaveY], ([rise, lift]) => rise + lift)
  const opacity = useTransform(leave, [0, 1], [1, 0])
  const scale = useTransform(leave, [0, 1], [1, 0.98])

  if (reduceMotion || isSlideMode) return undefined
  return isFadeScroll ? { y, opacity, scale } : { y: enterY }
}
