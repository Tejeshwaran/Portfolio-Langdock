import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { isFadeScroll } from '../config/scrollEffect'

/**
 * EdgeFade — two soft gradients (page colour) fixed to the screen edges: one just
 * under the header, one at the bottom. Text that scrolls into them
 * dissolves instead of being cut off by a hard line.
 *
 * They stay invisible on the home screen (where the prompt bar sits at the
 * bottom) and fade in once you have scrolled about half a screen.
 * Only used when the scroll effect is 'fade' (see config/scrollEffect.js).
 */
export default function EdgeFade() {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const viewportHeightRef = useRef(typeof window === 'undefined' ? 800 : window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      viewportHeightRef.current = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 0 while the home screen is in view → 1 after ~90% of a screen
  const opacity = useTransform(scrollY, (distance) => {
    const height = viewportHeightRef.current
    return Math.min(1, Math.max(0, (distance - height * 0.4) / (height * 0.5)))
  })

  if (!isFadeScroll || reduceMotion) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ opacity }}
        className="pointer-events-none fixed inset-x-0 top-16 z-30 h-[14vh] bg-gradient-to-b from-canvas via-canvas/60 to-transparent"
      />
      <motion.div
        aria-hidden="true"
        style={{ opacity }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-30 h-[10vh] bg-gradient-to-t from-canvas to-transparent"
      />
    </>
  )
}
