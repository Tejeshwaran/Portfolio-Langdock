import { useEffect } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useSlideDeck } from './SlideDeck'

/**
 * A thin accent line at the very top that shows how far you are.
 * It replaces the hidden scrollbar as the "where am I?" indicator.
 *
 *  - slide mode:     active slide ÷ number of slides
 *  - scrolling page: page scroll progress from 0 (top) to 1 (bottom)
 *
 * useSpring smooths the number so the line glides instead of jumping, and
 * useTransform hides the line while you are still on the home screen.
 * These are motion values: they update the element directly on every
 * frame without re-rendering React, which keeps it smooth on phones.
 */
export default function ScrollProgress() {
  const deck = useSlideDeck()
  const { scrollYProgress } = useScroll()
  const slideProgress = useMotionValue(0)

  useEffect(() => {
    if (deck.isDeck) slideProgress.set(deck.count > 1 ? deck.activeIndex / (deck.count - 1) : 0)
  }, [deck.isDeck, deck.activeIndex, deck.count, slideProgress])

  const progress = deck.isDeck ? slideProgress : scrollYProgress
  const scaleX = useSpring(progress, { stiffness: 220, damping: 32, restDelta: 0.001 })
  const opacity = useTransform(progress, [0, 0.02], [0, 1])

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-accent"
      style={{ scaleX, opacity }}
    />
  )
}
