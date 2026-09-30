import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

// Is the slide that contains this component the visible one?
// ConversationBlock waits for `true` before it starts its question → answer.
// Outside a SlideDeck (normal scrolling page) it is always true.
export const SlideActiveContext = createContext(true)

// Lets any component move between slides: const deck = useSlideDeck()
const SlideDeckContext = createContext({ isDeck: false })
export function useSlideDeck() {
  return useContext(SlideDeckContext)
}

// ── Tuning ──
const TRANSITION_MS = 800 // new input is ignored while a slide change runs
const WHEEL_THRESHOLD = 40 // how much wheel movement counts as "one scroll"
const SWIPE_THRESHOLD = 60 // how far a finger must move (px) on phones
const MIN_FIT_SCALE = 0.8 // a too-tall slide may shrink to 80% to fit the screen
const FIT_MIN_WIDTH = 768 // only on tablets and computers; phones scroll inside the slide

// The fade: the old slide fades out and drifts away, then the new slide
// fades in from the other side.
const EASE = [0.22, 1, 0.36, 1]
const LEAVE_MS = 450 // how long the old slide stays drawn while it fades out
const slideVariants = {
  active: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, delay: 0.25, ease: EASE } },
  above: { opacity: 0, y: -48, scale: 0.98, transition: { duration: 0.35, ease: 'easeIn' } },
  below: { opacity: 0, y: 48, scale: 0.98, transition: { duration: 0.35, ease: 'easeIn' } },
}

/**
 * Can something between `target` and the slide still scroll in this
 * direction (1 = down, -1 = up)? Then the wheel should scroll it, not
 * change the slide. This covers the slide itself (when its content is
 * taller than the screen) and scroll boxes inside it, like the chats.
 */
/** Is the element inside a part marked data-deck-ignore (sidebar, drawer)? */
function isIgnored(target) {
  return target instanceof Element && Boolean(target.closest('[data-deck-ignore]'))
}

export function canScrollInside(target, direction, slideElement) {
  if (!slideElement) return false
  let element = target instanceof Element ? target : null
  while (element) {
    const { overflowY } = getComputedStyle(element)
    const isScrollBox = (overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight + 4
    if (isScrollBox) {
      if (direction > 0 && element.scrollTop + element.clientHeight < element.scrollHeight - 4) return true
      if (direction < 0 && element.scrollTop > 4) return true
    }
    if (element === slideElement) return false
    element = element.parentElement
  }
  return false
}

/**
 * FitToScreen — keeps a slide inside the screen on computers.
 *
 * If the content is taller than the space available, it is shrunk with
 * transform: scale() (never below MIN_FIT_SCALE), so there is nothing to
 * scroll. A ResizeObserver re-measures whenever the content or the window
 * changes size (for example when a skill group is opened or closed).
 *
 * The outer box gets the SHRUNK height, so centering still works; the
 * inner box keeps its natural size and is scaled from the top center.
 */
function FitToScreen({ children, wide = false }) {
  const areaRef = useRef(null)
  const contentRef = useRef(null)
  const [fit, setFit] = useState({ scale: 1, height: 0 })

  useEffect(() => {
    const area = areaRef.current
    const content = contentRef.current
    const slide = area?.parentElement
    if (!area || !content || !slide) return

    function measure() {
      const areaStyle = getComputedStyle(area)
      const available = slide.clientHeight - parseFloat(areaStyle.paddingTop) - parseFloat(areaStyle.paddingBottom)
      const natural = content.offsetHeight // not affected by its own transform
      const canShrink = window.innerWidth >= FIT_MIN_WIDTH && natural > available
      const scale = canShrink ? Math.max(MIN_FIT_SCALE, available / natural) : 1
      setFit((previous) =>
        previous.scale === scale && previous.height === natural ? previous : { scale, height: natural },
      )
    }

    const observer = new ResizeObserver(measure)
    observer.observe(content)
    observer.observe(slide)
    measure()
    return () => observer.disconnect()
  }, [])

  const isShrunk = fit.scale < 1
  return (
    <div
      ref={areaRef}
      // pb-24 keeps the content clear of the prompt box at the bottom (SlideComposer.jsx)
      className={`mx-auto flex min-h-full flex-col justify-center px-4 pb-24 pt-4 sm:px-6 ${wide ? 'max-w-4xl' : 'max-w-3xl'}`}
    >
      <div style={isShrunk ? { height: fit.height * fit.scale } : undefined}>
        <div
          ref={contentRef}
          // The section's own vertical padding is removed: the slide has room already
          className="origin-top transition-transform duration-300 [&>*]:!py-0"
          style={isShrunk ? { transform: `scale(${fit.scale})` } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/** Small dots on the right edge: where am I, and click to jump.
 *  Only on tablets — on computers the sidebar shows where you are. */
function SlideDots({ count, activeIndex, onSelect }) {
  const { t } = useLanguage()
  if (activeIndex === 0) return null // keep the home screen clean

  return (
    <nav
      aria-label={t('slidesLabel')}
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 sm:flex lg:hidden"
    >
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={t('goToSlide', index + 1, count)}
          aria-current={index === activeIndex ? 'step' : undefined}
          className="group flex h-4 w-4 items-center justify-center"
        >
          <span
            className={`block w-1.5 rounded-full transition-all duration-300 ${
              index === activeIndex ? 'h-4 bg-ink' : 'h-1.5 bg-line-strong group-hover:bg-muted'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}

/**
 * SlideDeckProvider — turns the page into full-screen slides.
 * It wraps the whole page (see App.jsx), so the header, the progress line
 * and the bottom menu can all read and change the active slide.
 * <SlideStage /> (below) draws the slides.
 *
 * The page itself never scrolls. All slides lie on top of each other;
 * only the active one is visible. Scrolling does this:
 *
 *  1. Wheel / swipe / arrow key arrives.
 *  2. If the active slide (or a chat box in it) can still scroll in that
 *     direction, it scrolls normally — nothing else happens.
 *  3. Otherwise the slide changes: the current slide fades out and the
 *     next one fades in (slideVariants above).
 *  4. For TRANSITION_MS, and until the wheel has been still for a moment,
 *     further input is ignored — so one flick of a trackpad moves exactly
 *     one slide.
 *
 * Props: slides = [{ id, element, fullBleed }]
 *  - id         used by the navigation (e.g. 'skills')
 *  - element    what the slide shows (a section component)
 *  - fullBleed  true = no padding / centering (the home screen)
 *  - wide       true = a little wider than the other slides (languages, equation)
 */
export function SlideDeckProvider({ slides, children }) {
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  // The slide that is fading out right now (it must stay drawn until it is gone)
  const [leavingIndex, setLeavingIndex] = useState(null)

  const activeIndexRef = useRef(0)
  const slideRefs = useRef([])
  const ignoreInputUntilRef = useRef(0)
  const lastInnerScrollRef = useRef(0)
  const wheelRef = useRef({ sum: 0, lastTime: 0 })
  const touchRef = useRef(null)

  // The newest slides list, readable from event listeners
  const slidesRef = useRef(slides)
  slidesRef.current = slides

  /** Show a slide by index or id. Resolves when the fade has finished. */
  function goTo(target) {
    const list = slidesRef.current
    const index = typeof target === 'number' ? target : list.findIndex((slide) => slide.id === target)
    const from = activeIndexRef.current
    if (index < 0 || index >= list.length || index === from) return Promise.resolve()

    activeIndexRef.current = index
    ignoreInputUntilRef.current = performance.now() + TRANSITION_MS
    wheelRef.current.sum = 0

    // Going forward starts the next slide at its top; going back shows the
    // previous slide at its bottom, where you left it.
    const nextSlide = slideRefs.current[index]
    if (nextSlide) nextSlide.scrollTop = index > from ? 0 : nextSlide.scrollHeight

    // Keyboard focus must not stay inside a slide that is now hidden
    if (slideRefs.current[from]?.contains(document.activeElement)) nextSlide?.focus({ preventScroll: true })

    setActiveIndex(index)
    setLeavingIndex(from)
    setTimeout(() => setLeavingIndex((current) => (current === from ? null : current)), LEAVE_MS)
    return new Promise((resolve) => setTimeout(resolve, reduceMotion ? 50 : 650))
  }

  // One goTo for the event listeners below (they are added only once)
  const goToRef = useRef(goTo)
  goToRef.current = goTo

  // The page must not scroll in slide mode (see .deck-mode in index.css)
  useEffect(() => {
    document.documentElement.classList.add('deck-mode')
    return () => document.documentElement.classList.remove('deck-mode')
  }, [])

  // Mouse wheel and trackpad
  useEffect(() => {
    function handleWheel(event) {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return // sideways: ignore
      if (isIgnored(event.target)) return // e.g. the sidebar: let it scroll normally
      const now = performance.now()

      // During a change, and while a trackpad is still "gliding" after it,
      // swallow the input. Every new event pushes the end a little later.
      if (now < ignoreInputUntilRef.current) {
        event.preventDefault()
        ignoreInputUntilRef.current = Math.max(ignoreInputUntilRef.current, now + 180)
        return
      }

      const direction = event.deltaY > 0 ? 1 : -1
      const slide = slideRefs.current[activeIndexRef.current]
      if (canScrollInside(event.target, direction, slide)) {
        lastInnerScrollRef.current = now // let the browser scroll the content
        wheelRef.current.sum = 0
        return
      }

      event.preventDefault()
      // The content only just reached its end: wait for a fresh scroll
      if (now - lastInnerScrollRef.current < 400) {
        lastInnerScrollRef.current = now
        return
      }

      const wheel = wheelRef.current
      if (now - wheel.lastTime > 250) wheel.sum = 0
      wheel.lastTime = now
      wheel.sum += event.deltaY
      if (Math.abs(wheel.sum) >= WHEEL_THRESHOLD) goToRef.current(activeIndexRef.current + direction)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Swipes on phones and tablets
  useEffect(() => {
    function handleTouchStart(event) {
      touchRef.current = null
      if (event.touches.length !== 1 || isIgnored(event.target)) return
      const touch = event.touches[0]
      const slide = slideRefs.current[activeIndexRef.current]
      // Remember whether the content could still scroll when the finger went down
      touchRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        canScrollDown: canScrollInside(event.target, 1, slide),
        canScrollUp: canScrollInside(event.target, -1, slide),
      }
    }

    function handleTouchEnd(event) {
      const start = touchRef.current
      touchRef.current = null
      if (!start || performance.now() < ignoreInputUntilRef.current) return
      const touch = event.changedTouches[0]
      const distanceY = start.y - touch.clientY // positive = finger moved up = next
      const distanceX = start.x - touch.clientX
      if (Math.abs(distanceY) < SWIPE_THRESHOLD || Math.abs(distanceX) > Math.abs(distanceY)) return
      if (distanceY > 0 && !start.canScrollDown) goToRef.current(activeIndexRef.current + 1)
      if (distanceY < 0 && !start.canScrollUp) goToRef.current(activeIndexRef.current - 1)
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  // Keyboard: ↓ / PageDown / Space = next, ↑ / PageUp / Shift+Space = back
  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) return
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (event.key === ' ' && target.tagName === 'BUTTON') return

      const lastIndex = slidesRef.current.length - 1
      if (event.key === 'Home') return goToRef.current(0)
      if (event.key === 'End') return goToRef.current(lastIndex)

      const isForward = event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)
      const isBackward = event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)
      if (!isForward && !isBackward) return

      event.preventDefault()
      const direction = isForward ? 1 : -1
      const slide = slideRefs.current[activeIndexRef.current]
      if (canScrollInside(slide, direction, slide)) {
        slide.scrollBy({ top: direction * slide.clientHeight * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' })
        return
      }
      if (performance.now() >= ignoreInputUntilRef.current) goToRef.current(activeIndexRef.current + direction)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [reduceMotion])

  const activeId = slides[activeIndex]?.id
  const deck = useMemo(
    () => ({
      isDeck: true,
      slides,
      slideRefs,
      activeIndex,
      leavingIndex,
      activeId,
      count: slides.length,
      goTo: (target) => goToRef.current(target),
      next: () => goToRef.current(activeIndexRef.current + 1),
    }),
    [slides, activeIndex, leavingIndex, activeId],
  )

  return <SlideDeckContext.Provider value={deck}>{children}</SlideDeckContext.Provider>
}

/** Draws the slides on top of each other; only the active one is visible. */
export function SlideStage() {
  const { slides, slideRefs, activeIndex, leavingIndex, count, goTo } = useSlideDeck()

  return (
    <>
      {/* Fills the chat area of the AppShell (below the top bar) */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          // Only the active slide and the one fading out are drawn. All others
          // are `visibility: hidden`: invisible, not clickable, skipped by
          // screen readers — and cheap for the browser.
          const isDrawn = isActive || index === leavingIndex
          return (
            <motion.div
              key={slide.id}
              ref={(element) => {
                slideRefs.current[index] = element
              }}
              variants={slideVariants}
              initial={false}
              animate={isActive ? 'active' : index < activeIndex ? 'above' : 'below'}
              tabIndex={-1}
              aria-hidden={!isActive}
              // `inert` = nothing inside can be focused or clicked while hidden
              {...(isActive ? {} : { inert: '' })}
              style={{ visibility: isDrawn ? 'visible' : 'hidden' }}
              className="absolute inset-0 overflow-y-auto overscroll-contain focus:outline-none"
            >
              <SlideActiveContext.Provider value={isActive}>
                {slide.fullBleed ? (
                  <div className="mx-auto h-full max-w-4xl px-4 sm:px-6">{slide.element}</div>
                ) : (
                  // Centered on the screen, shrunk a little if it is too tall
                  <FitToScreen wide={slide.wide}>{slide.element}</FitToScreen>
                )}
              </SlideActiveContext.Provider>
            </motion.div>
          )
        })}
      </div>

      <SlideDots count={count} activeIndex={activeIndex} onSelect={(index) => goTo(index)} />
    </>
  )
}
