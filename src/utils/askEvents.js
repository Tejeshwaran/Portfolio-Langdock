// ─────────────────────────────────────────────────────────────
// askEvents.js — lets ANY component ask the home chat a question.
//
// Example: the "Contact" button in the header calls
//   requestAsk('How can I contact Tejeshwaran?')
// and the home screen (Hero.jsx), which listens with onAskRequest(),
// scrolls up, types the question into the prompt bar and sends it.
//
// It uses a normal browser event, so the header and the home screen
// don't need to know about each other.
// ─────────────────────────────────────────────────────────────

const EVENT_NAME = 'portfolio:ask'

/** Ask the home chat a question from anywhere on the page. */
export function requestAsk(question) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: question }))
}

/** Listen for questions. Returns a function that stops listening. */
export function onAskRequest(handler) {
  const listener = (event) => handler(event.detail)
  window.addEventListener(EVENT_NAME, listener)
  return () => window.removeEventListener(EVENT_NAME, listener)
}

// ── After a language switch ──
// The chat that ran "Change the entire website to German" announces the
// switch; the home screen (Hero.jsx) listens, clears its chat and shows its
// headline again — now in the new language.

const LANGUAGE_SWITCH_EVENT = 'portfolio:language-switched'

/** Tell the page that the website language was just switched. */
export function announceLanguageSwitch() {
  window.dispatchEvent(new CustomEvent(LANGUAGE_SWITCH_EVENT))
}

/** Listen for language switches. Returns a function that stops listening. */
export function onLanguageSwitch(handler) {
  window.addEventListener(LANGUAGE_SWITCH_EVENT, handler)
  return () => window.removeEventListener(LANGUAGE_SWITCH_EVENT, handler)
}
