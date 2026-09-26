// ─────────────────────────────────────────────────────────────
// scrollEffect.js — how the page reacts to scrolling.
//
//   'slides'   The page does not move. Each part is a full-screen slide;
//              one scroll (wheel, swipe or arrow key) fades the current
//              slide out and the next one in. (components/SlideDeck.jsx)
//   'fade'     A normal scrolling page, but each part fades out near the
//              top of the screen while the next one fades in.
//   'classic'  A normal scrolling page without fading.
//
// To switch for good, change DEFAULT_SCROLL_EFFECT below.
// To compare without editing, add ?scroll=slides, ?scroll=fade or
// ?scroll=classic to the end of the address.
// ─────────────────────────────────────────────────────────────

const DEFAULT_SCROLL_EFFECT = 'slides'
const EFFECTS = ['slides', 'fade', 'classic']

function readFromAddress() {
  try {
    const value = new URLSearchParams(window.location.search).get('scroll')
    return EFFECTS.includes(value) ? value : null
  } catch {
    return null
  }
}

export const SCROLL_EFFECT = readFromAddress() ?? DEFAULT_SCROLL_EFFECT
export const isSlideMode = SCROLL_EFFECT === 'slides'
export const isFadeScroll = SCROLL_EFFECT === 'fade'
